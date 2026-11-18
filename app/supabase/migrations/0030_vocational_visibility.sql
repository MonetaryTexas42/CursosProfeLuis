-- 0030 · Visibilidad del perfil vocacional (PRIV-03)
--
-- Antes de este cambio, la política `student_profiles_select` usaba
-- `app_can_access_student`, así que el tutor con consentimiento podía leer la
-- fila completa: `weaknesses` (áreas a trabajar) y `vocational_notes` (notas
-- internas de orientación). Esas columnas son material de trabajo del personal
-- docente y no tienen finalidad para la familia.
--
-- Este cambio:
--   1. limita la lectura de `student_profiles` al personal (admin/profesor);
--   2. publica una vista curada `student_guidance` para el alumno y su tutor
--      con intereses, aptitudes, fortalezas, carrera de interés, sugerencias y
--      resultados de los test, sin notas internas ni "áreas a trabajar";
--   3. conserva la RLS existente: la vista solo devuelve filas de alumnos a los
--      que el solicitante puede acceder (incluido el consentimiento del tutor).
--
-- El texto del aviso de privacidad v3-2026 (migración 0031) explica esta
-- finalidad y la leyenda "orientativo, no diagnóstico".
--
-- Rollback:
--   drop view if exists public.student_guidance;
--   drop policy if exists student_profiles_select on public.student_profiles;
--   create policy student_profiles_select
--     on public.student_profiles for select to authenticated
--     using (public.app_can_access_student(student_id));

drop policy if exists student_profiles_select on public.student_profiles;
create policy student_profiles_select
on public.student_profiles for select to authenticated
using (
  public.app_is_admin()
  or public.app_is_teacher_of_student(student_id)
);

-- Vista con privilegios del propietario: la RLS de `student_profiles` no
-- aplica al dueño de la vista, por eso el filtro `app_can_access_student` es
-- obligatorio y explícito. No expone `weaknesses`, `vocational_notes` ni
-- `extras`.
create or replace view public.student_guidance as
select
  sp.student_id,
  sp.interests,
  sp.aptitudes,
  sp.strengths,
  sp.career_choice,
  sp.career_suggestions,
  sp.personality,
  sp.aptitude,
  sp.reading_goal,
  sp.updated_at
from public.student_profiles sp
where public.app_can_access_student(sp.student_id);

comment on view public.student_guidance is
  'PRIV-03: resumen curado del perfil vocacional para el alumno y su tutor. Excluye notas internas, áreas a trabajar y extras.';

revoke all on public.student_guidance from public, anon;
grant select on public.student_guidance to authenticated, service_role;
