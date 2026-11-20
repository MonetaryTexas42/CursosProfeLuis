-- 0033 · Anonimización de alumnos y llaves foráneas coherentes (DB-02)
--
-- Antes de este cambio no había forma de atender una solicitud de cancelación
-- sin borrar el historial: muchas FKs a `students`/`profiles` no tenían
-- `on delete`, y no existía una RPC que retirara los datos personales.
--
-- Este cambio:
--   1. ajusta las FKs de las tablas dependientes: `cascade` para los datos
--      personales del alumno, `set null` para las columnas de actor;
--   2. añade `app_anonymize_student`, que sustituye los datos identificables
--      por un seudónimo, elimina vínculos, consentimientos y notas, banea la
--      cuenta en Auth y deja rastro en `audit_log`.
--
-- Límite importante: la anonimización conserva el historial académico y
-- financiero bajo un código seudónimo. La eliminación definitiva de
-- `auth.users` (para una cancelación total) es una acción separada y
-- coordinada: ver `docs/seguridad.md`.
--
-- Rollback:
--   drop function if exists public.app_anonymize_student(uuid, text);
--   Las FKs no se revierten automáticamente: suspender su uso y documentar
--   la decisión. No se recobran los datos ya anonimizados.

-- ---------------------------------------------------------------------------
-- 1. FKs de tablas dependientes del alumno: borrado en cascada
-- ---------------------------------------------------------------------------

do $$
declare
  r record;
begin
  for r in
    select c.conname, c.conrelid::regclass as child, a.attname
      from pg_constraint c
      join pg_attribute a
        on a.attrelid = c.conrelid
       and a.attnum = any(c.conkey)
     where c.contype = 'f'
       and c.confrelid = 'public.students'::regclass
       and array_length(c.conkey, 1) = 1
       and c.conrelid::regclass::text in (
         'privacy_consents',
         'student_guardians',
         'student_unit_overrides',
         'student_profiles',
         'student_staff_notes',
         'student_link_tokens',
         'observations',
         'guardian_messages'
       )
  loop
    execute format('alter table %s drop constraint %I', r.child, r.conname);
    execute format(
      'alter table %s add constraint %I foreign key (%I) references public.students(id) on delete cascade',
      r.child, r.conname, r.attname
    );
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- 2. Columnas de actor: conservar la fila aunque se borre el perfil
-- ---------------------------------------------------------------------------

do $$
declare
  r record;
begin
  for r in
    select c.conname, c.conrelid::regclass as child, a.attname
      from pg_constraint c
      join pg_attribute a
        on a.attrelid = c.conrelid
       and a.attnum = any(c.conkey)
     where c.contype = 'f'
       and c.confrelid = 'public.profiles'::regclass
       and array_length(c.conkey, 1) = 1
       and a.attname in (
         'created_by', 'recorded_by', 'author_id', 'updated_by',
         'published_by', 'reviewed_by', 'graded_by', 'issued_by'
       )
  loop
    execute format('alter table %s drop constraint %I', r.child, r.conname);
    execute format(
      'alter table %s add constraint %I foreign key (%I) references public.profiles(id) on delete set null',
      r.child, r.conname, r.attname
    );
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- 3. Anonimización administrativa
-- ---------------------------------------------------------------------------

create or replace function public.app_anonymize_student(
  p_student_id uuid,
  p_reason text
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
set row_security = off
as $$
declare
  v_actor uuid := auth.uid();
  v_student public.students%rowtype;
  v_reason text := btrim(coalesce(p_reason, ''));
  v_code text;
begin
  if v_actor is null then
    raise exception 'No autenticado' using errcode = '42501';
  end if;

  if not public.app_is_admin() then
    raise exception 'Solo el administrador puede anonimizar alumnos' using errcode = '42501';
  end if;

  if length(v_reason) < 10 or length(v_reason) > 400 then
    raise exception 'El motivo de la anonimización debe tener entre 10 y 400 caracteres'
      using errcode = '22023';
  end if;

  select * into v_student
    from public.students
   where id = p_student_id;

  if not found then
    raise exception 'El alumno no existe' using errcode = 'P0002';
  end if;

  if v_student.status = 'inactive'::public.student_status
     and v_student.student_code like 'ANON-%' then
    raise exception 'El alumno ya está anonimizado' using errcode = '22023';
  end if;

  v_code := 'ANON-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10));

  -- Datos personales que no deben sobrevivir a la solicitud.
  delete from public.privacy_consents where student_id = p_student_id;
  delete from public.student_guardians where student_id = p_student_id;
  delete from public.student_link_tokens where student_id = p_student_id;
  delete from public.guardian_messages where student_id = p_student_id;
  delete from public.observations where student_id = p_student_id;
  delete from public.student_staff_notes where student_id = p_student_id;
  delete from public.student_profiles where student_id = p_student_id;

  -- El historial académico y financiero permanece bajo un código seudónimo.
  -- `notes_internal` se eliminó en 0024 (PRIV-02): las notas internas viven en
  -- `student_staff_notes` y ya se borraron arriba.
  update public.students
     set student_code = v_code,
         birth_date = null,
         status = 'inactive'::public.student_status,
         updated_at = now()
   where id = p_student_id;

  update public.profiles
     set full_name = 'Alumno anonimizado',
         username = null,
         email = null,
         phone = null,
         active = false,
         must_change_password = false,
         updated_at = now()
   where id = v_student.profile_id;

  -- La identidad de Auth deja de poder autenticarse. Para borrarla por
  -- completo hay que seguir el procedimiento de `docs/seguridad.md`.
  update auth.users
     set banned_until = now() + interval '100 years'
   where id = v_student.profile_id;

  insert into public.audit_log (actor_id, action, entity_type, entity_id, before, after)
  values (
    v_actor,
    'student.anonymized',
    'student',
    p_student_id::text,
    jsonb_build_object(
      'student_code', v_student.student_code,
      'status', v_student.status,
      'profile_id', v_student.profile_id
    ),
    jsonb_build_object(
      'student_code', v_code,
      'status', 'inactive',
      'reason', v_reason,
      'auth_banned', true
    )
  );

  return jsonb_build_object(
    'ok', true,
    'student_id', p_student_id,
    'pseudonym', v_code
  );
end;
$$;

revoke all on function public.app_anonymize_student(uuid, text) from public;
grant execute on function public.app_anonymize_student(uuid, text) to authenticated;

comment on function public.app_anonymize_student(uuid, text) is
  'DB-02: anonimiza un alumno conservando su historial seudonimizado; solo administrador, con motivo auditado.';
