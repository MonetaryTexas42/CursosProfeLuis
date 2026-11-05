-- 0009 · Alumnos leen el contenido publicado del curso
--
-- El reproductor del curso (curso/) necesita leer las unidades publicadas
-- para mostrarlas al alumno con sesión. El acceso sigue siendo por rol:
-- solo estudiantes activos ven contenido publicado; los intentos y el
-- progreso se siguen rigiendo por asignaciones activas (sin cambios).

create policy units_select_published_students
on public.units for select to authenticated
using (
  public.app_is_admin()
  or public.app_is_staff()
  or (public.app_current_role() = 'student'::public.user_role
      and status = 'published'::public.unit_status)
);

create policy unit_versions_select_published_students
on public.unit_versions for select to authenticated
using (
  public.app_is_admin()
  or public.app_is_staff()
  or (public.app_current_role() = 'student'::public.user_role
      and published_at is not null)
);
