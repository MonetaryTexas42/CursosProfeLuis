-- 0032 · Una asignación por grupo/unidad y audiencia explícita (DB-01, FUN-03)
--
-- Antes de este cambio:
--   - no existía `unique (group_id, unit_id)` en `unit_assignments`; activar
--     dos veces la misma unidad creaba filas duplicadas;
--   - el acceso se decidía por grupo, de modo que un alumno dado de alta
--     después heredaba las unidades ya activas sin inclusión explícita.
--
-- Este cambio:
--   1. consolida duplicados heredados, conservando la versión más reciente y
--      moviendo el progreso, los intentos y los overrides a la fila canónica;
--   2. crea el índice único y una RPC `app_activate_unit` que reutiliza la fila;
--   3. crea un trigger que, al dar de alta un alumno, marca `closed` todas las
--      asignaciones del grupo: el docente debe incluirlo expresamente;
--   4. ofrece `app_backfill_unit_audience` para aplicar la regla a alumnos
--      existentes de forma explícita (no se ejecuta automáticamente).
--
-- Rollback:
--   drop trigger if exists students_new_audience on public.students;
--   drop function if exists public.app_new_student_unit_audience();
--   drop function if exists public.app_backfill_unit_audience(uuid);
--   drop function if exists public.app_activate_unit(uuid, uuid, uuid, timestamptz, timestamptz, text);
--   drop index if exists public.unit_assignments_group_unit_uq;
-- No se recobran los duplicados eliminados: exportarlos antes si hiciera falta.

-- ---------------------------------------------------------------------------
-- 1. Consolidar duplicados heredados
-- ---------------------------------------------------------------------------

do $$
begin
  if exists (
    select 1 from pg_indexes
     where schemaname = 'public' and indexname = 'unit_assignments_group_unit_uq'
  ) then
    return;
  end if;

  create temp table unit_assignment_dups on commit drop as
  with ranked as (
    select
      a.id,
      a.unit_id,
      a.unit_version_id,
      row_number() over (
        partition by a.group_id, a.unit_id
        order by coalesce(v.version, 0) desc, a.created_at desc, a.id desc
      ) as rn,
      first_value(a.id) over w as keep_id,
      first_value(a.unit_version_id) over w as keep_unit_version_id
    from public.unit_assignments a
    left join public.unit_versions v on v.id = a.unit_version_id
    window w as (
      partition by a.group_id, a.unit_id
      order by coalesce(v.version, 0) desc, a.created_at desc, a.id desc
    )
  )
  select id as dup_id, unit_id, unit_version_id, keep_id, keep_unit_version_id
  from ranked
  where rn > 1;

  -- Si el alumno ya tiene override/progreso en la fila canónica, se descarta
  -- el de la fila duplicada; si no, se mueve.
  delete from public.student_unit_overrides o
   using unit_assignment_dups d
   where o.assignment_id = d.dup_id
     and exists (
       select 1 from public.student_unit_overrides k
        where k.assignment_id = d.keep_id and k.student_id = o.student_id
     );

  update public.student_unit_overrides o
     set assignment_id = d.keep_id
    from unit_assignment_dups d
   where o.assignment_id = d.dup_id;

  delete from public.unit_progress p
   using unit_assignment_dups d
   where p.assignment_id = d.dup_id
     and exists (
       select 1 from public.unit_progress k
        where k.assignment_id = d.keep_id and k.student_id = p.student_id
     );

  update public.unit_progress p
     set assignment_id = d.keep_id,
         unit_version_id = d.keep_unit_version_id,
         updated_at = now()
    from unit_assignment_dups d
   where p.assignment_id = d.dup_id;

  update public.exercise_attempts a
     set assignment_id = d.keep_id,
         unit_version_id = d.keep_unit_version_id
    from unit_assignment_dups d
   where a.assignment_id = d.dup_id;

  update public.quiz_attempts a
     set assignment_id = d.keep_id,
         unit_version_id = d.keep_unit_version_id
    from unit_assignment_dups d
   where a.assignment_id = d.dup_id;

  delete from public.unit_assignments a
   using unit_assignment_dups d
   where a.id = d.dup_id;
end $$;

create unique index if not exists unit_assignments_group_unit_uq
  on public.unit_assignments (group_id, unit_id);

comment on index public.unit_assignments_group_unit_uq is
  'DB-01: una sola asignación activa/draft por grupo y unidad; evita duplicados al activar dos veces.';

-- ---------------------------------------------------------------------------
-- 2. Activación idempotente
-- ---------------------------------------------------------------------------

create or replace function public.app_activate_unit(
  p_group_id uuid,
  p_unit_id uuid,
  p_unit_version_id uuid,
  p_opens_at timestamptz default null,
  p_closes_at timestamptz default null,
  p_instructions text default null
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
set row_security = off
as $$
declare
  v_assignment_id uuid;
  v_actor uuid := auth.uid();
begin
  if v_actor is null then
    raise exception 'No autenticado' using errcode = '42501';
  end if;

  if not (
    public.app_is_admin()
    or exists (
      select 1 from public.groups g
       where g.id = p_group_id and g.teacher_id = v_actor
     )
  ) then
    raise exception 'Solo el profesor del grupo o el administrador puede activar unidades'
      using errcode = '42501';
  end if;

  if not exists (
    select 1
      from public.unit_versions v
      join public.units u on u.id = v.unit_id
     where v.id = p_unit_version_id
       and v.unit_id = p_unit_id
       and v.published_at is not null
       and u.status = 'published'::public.unit_status
  ) then
    raise exception 'La versión de la unidad no existe o no está publicada'
      using errcode = '22023';
  end if;

  if p_closes_at is not null and p_opens_at is not null and p_closes_at <= p_opens_at then
    raise exception 'La fecha de cierre debe ser posterior a la de apertura'
      using errcode = '22023';
  end if;

  insert into public.unit_assignments (
    group_id, unit_id, unit_version_id, opens_at, closes_at,
    status, visible, instructions, created_by, updated_at
  )
  values (
    p_group_id, p_unit_id, p_unit_version_id, p_opens_at, p_closes_at,
    'active'::public.assignment_status, true, p_instructions, v_actor, now()
  )
  on conflict (group_id, unit_id) do update
    set unit_version_id = excluded.unit_version_id,
        opens_at = excluded.opens_at,
        closes_at = excluded.closes_at,
        status = 'active'::public.assignment_status,
        visible = true,
        instructions = excluded.instructions,
        updated_at = now()
  returning id into v_assignment_id;

  insert into public.audit_log (actor_id, action, entity_type, entity_id, after)
  values (
    v_actor,
    'unit.activated',
    'unit_assignment',
    v_assignment_id::text,
    jsonb_build_object(
      'group_id', p_group_id,
      'unit_id', p_unit_id,
      'unit_version_id', p_unit_version_id
    )
  );

  return v_assignment_id;
end;
$$;

revoke all on function public.app_activate_unit(uuid, uuid, uuid, timestamptz, timestamptz, text) from public;
grant execute on function public.app_activate_unit(uuid, uuid, uuid, timestamptz, timestamptz, text) to authenticated;

comment on function public.app_activate_unit(uuid, uuid, uuid, timestamptz, timestamptz, text) is
  'DB-01: activa o reactiva una unidad reutilizando la fila existente; deja rastro en audit_log.';

-- ---------------------------------------------------------------------------
-- 3. Audiencia explícita para alumnos nuevos
-- ---------------------------------------------------------------------------

create or replace function public.app_new_student_unit_audience()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
set row_security = off
as $$
begin
  -- Las asignaciones se crean para el grupo. Un alumno que se da de alta
  -- después no debe heredarlas: se cierran hasta que el docente lo incluya.
  insert into public.student_unit_overrides (
    assignment_id, student_id, status, reason, created_by
  )
  select
    a.id,
    new.id,
    'closed'::public.assignment_status,
    'Alta nueva: requiere inclusión explícita del docente',
    null
  from public.unit_assignments a
  where a.group_id = new.group_id
    and a.status in ('active'::public.assignment_status, 'closed'::public.assignment_status)
  on conflict (assignment_id, student_id) do nothing;

  return new;
end;
$$;

drop trigger if exists students_new_audience on public.students;
create trigger students_new_audience
  after insert on public.students
  for each row execute function public.app_new_student_unit_audience();

comment on function public.app_new_student_unit_audience() is
  'FUN-03: cierra al alumno nuevo las unidades ya activas de su grupo hasta inclusión explícita.';

create or replace function public.app_backfill_unit_audience(p_student_id uuid)
returns int
language plpgsql
security definer
set search_path = public, pg_temp
set row_security = off
as $$
declare
  v_group_id uuid;
  v_actor uuid := auth.uid();
  v_count int;
begin
  if v_actor is null then
    raise exception 'No autenticado' using errcode = '42501';
  end if;

  select s.group_id into v_group_id
    from public.students s
   where s.id = p_student_id;

  if v_group_id is null then
    raise exception 'El alumno no existe' using errcode = 'P0002';
  end if;

  if not (
    public.app_is_admin()
    or exists (select 1 from public.groups g where g.id = v_group_id and g.teacher_id = v_actor)
  ) then
    raise exception 'No tienes permiso sobre el grupo del alumno' using errcode = '42501';
  end if;

  with inserted as (
    insert into public.student_unit_overrides (
      assignment_id, student_id, status, reason, created_by
    )
    select
      a.id,
      p_student_id,
      'closed'::public.assignment_status,
      'Audiencia explícita (backfill manual)',
      v_actor
    from public.unit_assignments a
    where a.group_id = v_group_id
      and a.status in ('active'::public.assignment_status, 'closed'::public.assignment_status)
      and not exists (
        select 1 from public.student_unit_overrides o
         where o.assignment_id = a.id and o.student_id = p_student_id
      )
    returning 1
  )
  select count(*) into v_count from inserted;

  insert into public.audit_log (actor_id, action, entity_type, entity_id, after)
  values (
    v_actor,
    'student.audience_backfilled',
    'student',
    p_student_id::text,
    jsonb_build_object('overrides_created', v_count)
  );

  return v_count;
end;
$$;

revoke all on function public.app_backfill_unit_audience(uuid) from public;
grant execute on function public.app_backfill_unit_audience(uuid) to authenticated;

comment on function public.app_backfill_unit_audience(uuid) is
  'FUN-03: aplica la audiencia explícita a un alumno existente; solo admin o profesor de su grupo.';
