-- 0039 · Correcciones detectadas al ejecutar la suite en staging
--
-- La primera ejecución real de la suite de RLS (135 verificaciones) encontró
-- tres problemas de esquema/permisos que no aparecían en la revisión estática:
--
--   1. `payments`, `student_billing` y `student_staff_notes` se crearon en
--      migraciones posteriores a 0003 y no recibieron los grants posteriores:
--      las políticas existían, pero `authenticated` no tenía `SELECT` y todas
--      las consultas terminaban en `permission denied`.
--   2. `app_can_view_profile` permitía a un alumno ver a sus tutores porque la
--      rama "tutor de mi alumno" también se cumple cuando el que pregunta es
--      el propio alumno. Ahora esas ramas solo aplican al rol `guardian`.
--   3. Sin cambios de datos: RLS-132 y RLS-134 eran pruebas mal formuladas;
--      se corrigen en `supabase/tests/rls/rls-negative.mjs`.
--
-- Rollback:
--   create or replace function public.app_can_view_profile(uuid) ... (versión 0027);
--   revoke select on public.payments, public.student_billing,
--              public.student_staff_notes from authenticated;
-- No se revierten datos: esta migración solo concede SELECT y reemplaza una
-- función, sin borrar filas.

-- ---------------------------------------------------------------------------
-- 1. Grants explícitos para tablas creadas después de 0003
-- ---------------------------------------------------------------------------

grant select on public.payments to authenticated;
grant select on public.student_billing to authenticated;
grant select on public.student_staff_notes to authenticated;

-- ---------------------------------------------------------------------------
-- 2. Un alumno no debe ver a sus tutores a través de app_can_view_profile
-- ---------------------------------------------------------------------------

create or replace function public.app_can_view_profile(p_profile_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
set row_security = off
as $$
  select public.app_is_admin()
    or p_profile_id = auth.uid()
    or exists (
      select 1
      from public.students s
      join public.groups g on g.id = s.group_id
      where s.profile_id = p_profile_id
        and g.teacher_id = auth.uid()
    )
    or (
      public.app_current_role() = 'guardian'::public.user_role
      and (
        exists (
          select 1
          from public.students s
          where s.profile_id = p_profile_id
            and public.app_is_guardian_of(s.id)
            and public.app_guardian_has_consent(s.id)
        )
        or exists (
          select 1
          from public.guardians gu
          join public.student_guardians sg on sg.guardian_id = gu.id
          where gu.profile_id = p_profile_id
            and public.app_is_own_student(sg.student_id)
        )
        or exists (
          select 1
          from public.guardians gu
          join public.student_guardians sg on sg.guardian_id = gu.id
          where gu.profile_id = p_profile_id
            and public.app_is_guardian_of(sg.student_id)
            and public.app_guardian_has_consent(sg.student_id)
        )
      )
    );
$$;

revoke all on function public.app_can_view_profile(uuid) from public;
grant execute on function public.app_can_view_profile(uuid) to authenticated, service_role;

comment on function public.app_can_view_profile(uuid) is
  'La visibilidad de tutores solo se evalúa para el rol guardian; un alumno ve únicamente su propio perfil.';
