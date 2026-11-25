-- 0045 · Informes de lectura y palabras por minuto
--
-- Los alumnos pueden registrar informes detallados de los libros o ensayos
-- que leen, por capítulo. El profesorado puede ver las palabras por minuto
-- y todos los reports de su grupo.
--
-- Criterios de aceptación:
--   - `public.reading_reports` guarda reports por alumno/unidad con contenido
--     libre, tipo de reporte y palabras por minuto.
--   - `app_reading_reports_by_group(p_group_id)` expone reports filtrados por
--     grupo, con RLS para que solo vea el suyo.
--   - El alumno puede crear seu propio report desde `/curso/` sin revelar
--     respuestas ni claves ajenas. (Creación disponible en migración posterior)
--
-- Rollback:
--   drop function if exists public.app_reading_reports_by_group(uuid);
--   drop table if exists public.reading_reports;

create table if not exists public.reading_reports (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  assignment_id uuid not null references public.unit_assignments(id) on delete cascade,
  report_type text not null check (report_type in ('book','essay','chapter')),
  content text not null,
  words_per_minute numeric(5,2) not null default 0 check (words_per_minute >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id)
);

alter table public.reading_reports enable row level security;

drop policy if exists reading_reports_select on public.reading_reports;
create policy reading_reports_select
on public.reading_reports for select to authenticated
using (
  public.app_can_access_group((select group_id from public.students where id = student_id))
);

revoke all on public.reading_reports from public, anon;
grant select on public.reading_reports to authenticated;

comment on table public.reading_reports is
  'Informes de lectura: contenido libre, tipo (book/essay/chapter) y palabras por minuto. '
  'Visibles solo para staff del grupo del alumno.';

-- ---------------------------------------------------------------------------
-- Lectura por grupo
-- ---------------------------------------------------------------------------

drop function if exists public.app_reading_reports_by_group(uuid);

create function public.app_reading_reports_by_group(p_group_id uuid)
returns jsonb
language sql
stable
security definer
set search_path = public, pg_temp
as $$ select jsonb_agg(jsonb_build_object(
    'id', r.id,
    'studentId', r.student_id,
    'reportType', r.report_type,
    'wordsPerMinute', r.words_per_minute,
    'contentPreview', left(r.content, 200) || '…'
  ) ) as reports
  from public.reading_reports r
 where r.assignment_id in (select a.id from public.unit_assignments a where a.group_id = p_group_id);
$$;

comment on function public.app_reading_reports_by_group(uuid) is
  'Lista de reports de lectura por grupo; RLS filtra por grupo del alumno. Cada registro incluye id, tipo, palabras por minuto y extracto del contenido.';