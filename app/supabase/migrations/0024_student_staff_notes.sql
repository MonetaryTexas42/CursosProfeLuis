-- 0024 · Notas internas del staff fuera de la tabla que ve la familia
--        (PRIV-02 / DB-08)
--
-- `students.notes_internal` compartía tabla y política RLS con datos que el
-- alumno y el tutor sí deben ver. RLS filtra filas, no columnas, así que un
-- `select('*')` entregaba la nota interna a la familia.
--
-- Esta migración:
--   1. crea public.student_staff_notes (una nota por alumno);
--   2. copia las notas existentes;
--   3. elimina la columna de public.students;
--   4. deja la nueva tabla solo para admin y profesor del alumno;
--   5. audita los cambios sin duplicar el texto de la nota.
--
-- Criterio de aceptación:
--   - Un alumno o tutor no puede leer ninguna fila de student_staff_notes.
--   - El profesor del alumno y el admin sí pueden leerla y editarla.
--   - public.students ya no tiene la columna notes_internal.
--   - Las notas existentes se conservan.
--
-- Rollback:
--   alter table public.students add column if not exists notes_internal text;
--   update public.students s set notes_internal = n.note
--     from public.student_staff_notes n where n.student_id = s.id;
--   drop table public.student_staff_notes;
--   -- y volver a crear las políticas anteriores si se habían eliminado.

create table if not exists public.student_staff_notes (
  student_id uuid primary key references public.students(id) on delete cascade,
  note text not null,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.student_staff_notes is
  'PRIV-02: notas internas del staff. Nunca se exponen al alumno ni al tutor.';
comment on column public.student_staff_notes.note is
  'Texto libre del profesor. No incluir datos de terceros innecesarios.';

alter table public.student_staff_notes enable row level security;

create policy student_staff_notes_select
on public.student_staff_notes for select to authenticated
using (
  public.app_is_admin()
  or public.app_is_teacher_of_student(student_id)
);

create policy student_staff_notes_insert
on public.student_staff_notes for insert to authenticated
with check (
  public.app_is_admin()
  or public.app_is_teacher_of_student(student_id)
);

create policy student_staff_notes_update
on public.student_staff_notes for update to authenticated
using (
  public.app_is_admin()
  or public.app_is_teacher_of_student(student_id)
)
with check (
  public.app_is_admin()
  or public.app_is_teacher_of_student(student_id)
);

create policy student_staff_notes_delete
on public.student_staff_notes for delete to authenticated
using (
  public.app_is_admin()
  or public.app_is_teacher_of_student(student_id)
);

-- Copia las notas existentes antes de eliminar la columna.
insert into public.student_staff_notes (student_id, note, created_at, updated_at)
select s.id, btrim(s.notes_internal), s.updated_at, s.updated_at
  from public.students s
 where s.notes_internal is not null
   and btrim(s.notes_internal) <> ''
on conflict (student_id) do nothing;

-- Auditoría de cambios sin copiar el texto de la nota a audit_log.
create or replace function public.app_audit_student_staff_note()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
set row_security = off
as $$
declare
  v_student_id uuid;
  v_note_id text;
  v_action text;
  v_metadata jsonb;
begin
  if tg_op = 'DELETE' then
    v_student_id := old.student_id;
    v_note_id := old.student_id::text;
    v_action := 'staff_note.deleted';
    v_metadata := jsonb_build_object('student_id', old.student_id, 'had_note', true);
  else
    v_student_id := new.student_id;
    v_note_id := new.student_id::text;
    v_action := case when tg_op = 'INSERT' then 'staff_note.created'
                     else 'staff_note.updated' end;
    v_metadata := jsonb_build_object(
      'student_id', new.student_id,
      'has_note', length(btrim(new.note)) > 0
    );
  end if;

  insert into public.audit_log (actor_id, action, entity_type, entity_id, after)
  values (auth.uid(), v_action, 'student_staff_notes', v_note_id, v_metadata);

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

revoke all on function public.app_audit_student_staff_note() from public;

drop trigger if exists student_staff_notes_audit on public.student_staff_notes;
create trigger student_staff_notes_audit
after insert or update or delete on public.student_staff_notes
for each row execute function public.app_audit_student_staff_note();

-- La columna ya no debe existir: la familia no puede recibirla.
alter table public.students drop column if exists notes_internal;
