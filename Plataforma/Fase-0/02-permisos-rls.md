# 02 · Permisos y RLS

## Principio

La seguridad no se implementa en el frontend. Cada tabla tiene RLS activado y las políticas usan `auth.uid()` para decidir qué filas puede leer o escribir cada usuario.

- **Admin:** todo.
- **Profesor:** solo sus grupos.
- **Alumno:** solo sus datos y unidades activas.
- **Padre/tutor:** solo sus hijos y solo información visible para familia.
- **Edge Functions:** usan `service_role` para operaciones administrativas, pero primero verifican el JWT del llamador y su rol.

## Funciones auxiliares

Se implementan como `security definer`, `stable` y con `search_path = public` para evitar recursión de políticas y ambigüedad.

| Función | Devuelve | Uso |
|---|---|---|
| `app_current_role()` | rol del perfil autenticado | Filtros generales. |
| `app_is_admin()` | boolean | Acceso total. |
| `app_is_staff()` | boolean | Admin o profesor. |
| `app_student_id()` | uuid del alumno autenticado | Progreso, juegos, asistencia propia. |
| `app_guardian_id()` | uuid del tutor autenticado | Portal de padres. |
| `app_is_teacher_of_group(group_id)` | boolean | Grupos y alumnos del profesor. |
| `app_is_guardian_of(student_id)` | boolean | Acceso del padre a su hijo. |
| `app_can_access_student(student_id)` | boolean | Admin, alumno propio, profesor del grupo o tutor ligado. |
| `app_has_active_assignment(unit_id)` | boolean | Alumno solo ve contenido activo. |
| `app_can_access_assignment(assignment_id)` | boolean | Progreso y contenido por asignación. |

## Matriz de políticas

| Tabla | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| `profiles` | Propio; admin; profesor ve alumnos de sus grupos; padre ve hijos | Admin | Propio limitado; admin | Admin |
| `groups` | Admin; profesor propio; alumno propio; padre del alumno | Admin | Admin | Admin |
| `students` | Admin; profesor del grupo; alumno propio; padre ligado | Admin/profesor de su grupo | Admin/profesor de su grupo | Admin |
| `guardians` | Admin; tutor propio; profesor de sus grupos | Admin | Admin/tutor propio | Admin |
| `student_guardians` | Admin; alumno propio; tutor propio; profesor del grupo | Admin | Admin | Admin |
| `privacy_consents` | Admin; tutor propio; alumno propio; profesor del grupo (solo estado) | Tutor/admin | Admin | Admin |
| `subjects` | Autenticados si `active`; admin todo | Admin | Admin | Admin |
| `units` | Admin; profesor; alumno solo si tiene asignación activa | Admin | Admin | Admin |
| `unit_versions` | Admin; profesor de la unidad; alumno si asignación activa y versión asignada | Admin | Admin | Admin |
| `unit_assignments` | Admin; profesor del grupo; alumno del grupo si activa/cerrada | Admin/profesor de su grupo | Admin/profesor de su grupo | Admin/profesor de su grupo |
| `student_unit_overrides` | Admin; profesor del grupo; alumno propio | Admin/profesor | Admin/profesor | Admin/profesor |
| `unit_progress` | Admin; profesor del grupo; alumno propio; padre ligado | Alumno propio vía RPC | Alumno propio vía RPC; admin | Admin |
| `exercise_attempts` | Admin; profesor del grupo; alumno propio; padre ligado | Alumno propio vía RPC | Nadie | Admin |
| `quiz_attempts` | Admin; profesor del grupo; alumno propio; padre ligado | Alumno propio vía RPC | Nadie | Admin |
| `game_catalog` | Autenticados si `active` | Admin | Admin | Admin |
| `game_sessions` | Admin; profesor del grupo; alumno propio; padre ligado | Alumno propio vía RPC | Nadie | Admin |
| `reading_assessments` | Admin; profesor del grupo; alumno propio; padre ligado | Alumno propio vía RPC | Nadie | Admin |
| `xp_events` | Admin; profesor del grupo; alumno propio | RPC/trigger | Nadie | Admin |
| `badges` | Autenticados | Admin | Admin | Admin |
| `student_badges` | Admin; profesor del grupo; alumno propio; padre ligado | RPC/trigger | Nadie | Admin |
| `student_stats` | Admin; profesor del grupo; alumno propio; padre ligado | Trigger/RPC | Trigger/RPC | Admin |
| `student_profiles` | Admin; profesor del grupo; alumno propio; padre ligado | Admin/profesor | Admin/profesor | Admin |
| `attendance_sessions` | Admin; profesor del grupo; alumno del grupo; padre ligado | Admin/profesor | Admin/profesor | Admin |
| `attendance` | Admin; profesor del grupo; alumno propio; padre ligado | Admin/profesor | Admin/profesor | Admin |
| `assessments` | Admin; profesor del grupo; alumno del grupo si visible; padre ligado si visible | Admin/profesor | Admin/profesor | Admin |
| `grades` | Admin; profesor del grupo; alumno propio si visible; padre ligado si visible | Admin/profesor | Admin/profesor | Admin |
| `task_status` | Admin; profesor del grupo; alumno propio; padre ligado | Admin/profesor | Admin/profesor | Admin |
| `observations` | Admin; profesor del grupo; alumno propio si `family`; padre ligado si `family` | Admin/profesor | Admin/profesor | Admin (lógico) |
| `guardian_messages` | Admin; profesor del grupo; tutor propio | Admin/profesor | Admin/profesor | Admin |
| `email_outbox` | Admin | Edge Function | Edge Function | Admin |
| `academic_years`, `terms` | Autenticados | Admin | Admin | Admin |
| `audit_log` | Admin | Trigger/Edge Function | Nadie | Nadie |
| `settings` | Admin; lectura pública solo de claves marcadas | Admin | Admin | Admin |

## Reglas de contenido

1. Un alumno puede leer `units` y `unit_versions` solo si:
   - existe una `unit_assignments` con `status = 'active'`,
   - su grupo coincide,
   - la fecha actual está dentro de `opens_at` y `closes_at` (o la asignación no tiene cierre),
   - la unidad y la versión están publicadas.
2. Si la asignación se cierra, el alumno deja de ver la unidad, pero `unit_progress` y los intentos permanecen.
3. El profesor puede previsualizar cualquier unidad de sus grupos, incluso antes de activarla.
4. El admin puede ver todo el contenido.
5. El padre no necesita leer el contenido completo; recibe resumen y métricas.

## Reglas de escritura

- El alumno **no** inserta directamente en tablas. Usa RPCs controladas:
  - `record_exercise_attempt(...)`
  - `record_quiz_attempt(...)`
  - `record_game_session(...)`
  - `record_reading_assessment(...)`
  - `complete_unit(...)`
- Las RPCs validan que el alumno tenga una asignación activa y que la unidad corresponda.
- El profesor escribe asistencia, calificaciones, observaciones y tareas físicas solo en sus grupos.
- El padre no escribe calificaciones ni asistencia; solo acepta consentimiento y lee mensajes.
- El admin puede corregir datos, pero cada cambio genera `audit_log`.

## Pruebas de seguridad mínimas

| # | Actor | Acción | Resultado esperado |
|---|---|---|---|
| 1 | Alumno A | `select * from students where id = B` | 0 filas |
| 2 | Alumno A | Leer unidad sin asignación activa | 0 filas |
| 3 | Alumno A | Insertar intento en asignación de B | Error |
| 4 | Profesor A | Leer alumnos del grupo B | 0 filas |
| 5 | Profesor A | Calificar alumno del grupo B | Error |
| 6 | Profesor A | Activar unidad en su grupo | Permitido |
| 7 | Padre A | Leer alumno B | 0 filas |
| 8 | Padre A | Leer observación `internal` de su hijo | 0 filas |
| 9 | Padre A | Leer observación `family` de su hijo | Permitido |
| 10 | Admin | Leer cualquier tabla | Permitido |
| 11 | Anónimo | Leer cualquier tabla protegida | 0 filas / error |
| 12 | Frontend | Buscar `service_role` en el bundle | No debe existir |

## Pruebas de consistencia

- Un profesor no puede asignar una unidad sin versión publicada.
- Un alumno no puede tener dos `unit_progress` para la misma asignación.
- Una calificación no puede existir para un alumno de otro grupo.
- Una asistencia no puede existir para un alumno que no pertenece al grupo de la sesión.
- Un mensaje a padre debe estar ligado a un tutor del alumno.
- Un consentimiento debe guardar la versión exacta del aviso.

## Notas de implementación

- Las políticas deben evitar subconsultas recursivas a la misma tabla. Por eso se usan funciones `security definer`.
- Las RPCs deben ser `security definer` y validar `auth.uid()` internamente.
- Las Edge Functions que usan `service_role` deben verificar el JWT del llamador y su rol antes de actuar.
- No se confía en IDs enviados por el cliente. El alumno se resuelve con `auth.uid()`.
- Los tests de RLS se ejecutan en staging con usuarios reales de prueba, no con el admin.
