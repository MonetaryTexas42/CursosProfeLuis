-- 0023 · Cerrar el acceso de alumnos a contenido no asignado (SEC-01)
--
-- La migración 0009 añadió dos políticas permisivas para que el reproductor
-- pudiera leer el contenido publicado:
--
--   units_select_published_students
--   unit_versions_select_published_students
--
-- PostgreSQL combina políticas permisivas con OR, así que esas políticas
-- anulaban las de 0003 y dejaban que *cualquier* alumno autenticado leyera
-- todas las unidades y versiones publicadas, incluso sin asignación activa.
--
-- Al eliminarlas, el acceso vuelve a regirse por las políticas de 0003:
--   units_select          → app_is_staff() or app_has_active_unit(id)
--   unit_versions_select  → app_is_staff() or app_can_access_version(id)
--
-- Ambas exigen asignación visible, activa, dentro de la ventana de fechas,
-- unidad publicada y versión publicada.
--
-- Criterio de aceptación:
--   - Alumno sin asignación: 0 filas en units y unit_versions.
--   - Alumno con asignación activa: solo su unidad y su versión.
--   - Alumno con asignación cerrada o fuera de ventana: 0 filas.
--   - Staff y admin conservan el acceso completo.
--
-- Rollback: volver a crear las dos políticas tal como están en 0009. No se
-- recomienda: reabre el hallazgo.

drop policy if exists units_select_published_students on public.units;
drop policy if exists unit_versions_select_published_students on public.unit_versions;

comment on policy units_select on public.units is
  'SEC-01: solo staff o alumnos con asignación activa y vigente.';
comment on policy unit_versions_select on public.unit_versions is
  'SEC-01: solo staff o versiones de una asignación activa y vigente.';
