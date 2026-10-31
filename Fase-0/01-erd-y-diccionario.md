# 01 · ERD y diccionario de datos

## Objetivo

Definir la estructura mínima y suficiente para operar el piloto: identidad, grupos, contenido, activación, progreso, juegos, asistencia, calificaciones, expediente, observaciones y comunicación con padres.

Principios:

- Una sola identidad por persona (`profiles`).
- El contenido se versiona; las asignaciones fijan la versión.
- El progreso y los intentos son historial; el resumen se calcula.
- Los permisos se aplican en Postgres con RLS, no en el frontend.
- No se crean tablas de pagos en el MVP.

## ERD simplificado

```text
auth.users
    │ 1:1
    ▼
profiles ──────────────┐
    │ 0..1              │ 0..1
    ▼                   ▼
students             guardians
    │ N:M               │
    └── student_guardians ──┘
    │
    ├── groups ──< unit_assignments >── units ──< unit_versions
    │                                   │
    │                                   └──< subjects
    ├──< unit_progress >── unit_assignments
    ├──< exercise_attempts
    ├──< quiz_attempts
    ├──< game_sessions
    ├──< reading_assessments
    ├──< xp_events
    ├──< student_badges >── badges
    ├── 1:1 student_stats
    ├── 1:1 student_profiles
    ├──< attendance >── attendance_sessions >── groups
    ├──< grades >── assessments >── groups
    ├──< task_status
    ├──< observations >── profiles (autor)
    ├──< guardian_messages >── guardians
    └──< privacy_consents >── guardians
```

## Relaciones principales

| Relación | Cardinalidad | Regla |
|---|---|---|
| `profiles` → `students` | 1 : 0..1 | Un perfil de alumno puede existir sin ficha, pero el piloto exige ficha. |
| `profiles` → `guardians` | 1 : 0..1 | Un perfil de padre/tutor puede estar ligado a varios alumnos. |
| `groups` → `students` | 1 : N | Un alumno pertenece a un grupo por ciclo. |
| `students` ↔ `guardians` | N : M | Un alumno puede tener varios tutores; un tutor, varios hijos. |
| `subjects` → `units` | 1 : N | Cada unidad pertenece a una materia. |
| `units` → `unit_versions` | 1 : N | El contenido se versiona; una versión publicada no se edita. |
| `groups` + `units` → `unit_assignments` | 1 : N | La asignación activa una unidad para un grupo. |
| `unit_assignments` → `unit_progress` | 1 : N | Un progreso por alumno y asignación. |
| `groups` → `attendance_sessions` | 1 : N | Cada sesión pertenece a un grupo y una fecha. |
| `groups` → `assessments` | 1 : N | Cada evaluación pertenece a un grupo, materia y periodo. |
| `students` + `assessments` → `grades` | 1 : 1 | Una calificación por alumno y evaluación. |

## Diccionario por dominio

### Identidad

| Tabla | Campos clave | Reglas |
|---|---|---|
| `profiles` | `id uuid PK`, `role`, `full_name`, `username citext unique`, `email citext`, `phone`, `active`, `created_at`, `updated_at` | `id` referencia `auth.users(id)`. No hay autorregistro. El rol se cambia solo por admin. |
| `groups` | `id uuid`, `academic_year_id`, `name`, `level`, `teacher_id`, `schedule`, `active` | `teacher_id` referencia `profiles`. Un profesor solo ve sus grupos. |
| `students` | `id uuid`, `profile_id`, `group_id`, `student_code`, `birth_date`, `enrollment_date`, `status`, `notes_internal` | `profile_id` único. `student_code` único por ciclo. |
| `guardians` | `id uuid`, `profile_id`, `full_name`, `email`, `phone`, `relationship` | `profile_id` puede ser nulo hasta que acepte la invitación. |
| `student_guardians` | `student_id`, `guardian_id`, `is_primary`, `can_receive_email` | PK compuesta. `is_primary` único por alumno. |
| `privacy_consents` | `id`, `student_id`, `guardian_id`, `document_version`, `accepted_at`, `ip`, `metadata` | Se guarda la versión exacta del aviso aceptado. |

### Contenido

| Tabla | Campos clave | Reglas |
|---|---|---|
| `subjects` | `id text PK`, `name`, `short`, `color`, `icon`, `badge`, `sort_order`, `active` | Las 7 materias vacías se crean inactivas. |
| `units` | `id uuid`, `subject_id`, `num`, `title`, `status`, `sort_order`, `estimated_minutes` | `status`: draft, published, archived. `unique(subject_id, num)`. |
| `unit_versions` | `id uuid`, `unit_id`, `version`, `content jsonb`, `checksum`, `published_at`, `published_by` | Una versión publicada es inmutable. `unique(unit_id, version)`. |
| `unit_assignments` | `id uuid`, `group_id`, `unit_id`, `unit_version_id`, `opens_at`, `closes_at`, `status`, `visible`, `instructions`, `created_by` | `status`: draft, active, closed. No se puede activar una unidad sin versión publicada. |
| `student_unit_overrides` | `id`, `assignment_id`, `student_id`, `opens_at`, `closes_at`, `status`, `reason` | Excepciones individuales; no modifican la asignación del grupo. |

### Aprendizaje

| Tabla | Campos clave | Reglas |
|---|---|---|
| `unit_progress` | `id`, `student_id`, `assignment_id`, `unit_id`, `unit_version_id`, `status`, `started_at`, `completed_at`, `last_activity_at`, `time_spent_seconds`, `best_accuracy`, `attempts_count`, `xp_earned` | `unique(student_id, assignment_id)`. `status`: not_started, in_progress, completed, mastered. |
| `exercise_attempts` | `id bigserial`, `student_id`, `assignment_id`, `unit_id`, `unit_version_id`, `exercise_key`, `answer jsonb`, `is_correct`, `attempt_no`, `duration_ms`, `created_at` | Append-only. `exercise_key` estable por versión. |
| `quiz_attempts` | `id bigserial`, `student_id`, `assignment_id`, `unit_id`, `unit_version_id`, `part`, `question_key`, `selected_index`, `is_correct`, `created_at` | `part`: tipo, reto, capitulo. Append-only. |
| `game_catalog` | `id text PK`, `name`, `description`, `subject_id`, `metric_type`, `active` | Catálogo de juegos disponibles. |
| `game_sessions` | `id uuid`, `student_id`, `game_id`, `mode`, `difficulty`, `score`, `max_score`, `accuracy`, `correct`, `wrong`, `duration_seconds`, `metadata`, `created_at` | Guarda la partida; `metadata` incluye temas y respuestas si se requiere auditar. |
| `reading_assessments` | `id uuid`, `student_id`, `tool`, `assessment_type`, `wpm`, `comprehension_pct`, `words_read`, `errors`, `level`, `duration_seconds`, `metadata`, `created_at` | Una fila por medición de lectura. |
| `xp_events` | `id bigserial`, `student_id`, `source_type`, `source_id`, `xp`, `reason`, `created_at` | Libro mayor de XP. No se edita; se compensa con otro evento. |
| `badges` | `id text PK`, `name`, `description`, `icon`, `criteria jsonb` | Catálogo de insignias. |
| `student_badges` | `student_id`, `badge_id`, `awarded_at`, `source` | PK compuesta. |
| `student_stats` | `student_id PK`, `xp_total`, `current_streak`, `best_streak`, `last_activity_date`, `units_completed`, `units_mastered`, `accuracy`, `reading_wpm`, `reading_comprehension`, `updated_at` | Resumen materializado para dashboards. Se actualiza por trigger o RPC. |
| `student_profiles` | `student_id PK`, `interests text[]`, `aptitudes text[]`, `strengths text[]`, `weaknesses text[]`, `extras text[]`, `vocational_notes`, `reading_goal`, `updated_at` | Intereses y gustos del expediente. |

### Escuela

| Tabla | Campos clave | Reglas |
|---|---|---|
| `attendance_sessions` | `id`, `group_id`, `session_date`, `start_time`, `end_time`, `topic`, `created_by` | `unique(group_id, session_date, start_time)`. |
| `attendance` | `id`, `session_id`, `student_id`, `status`, `minutes_late`, `note`, `recorded_by`, `updated_at` | `unique(session_id, student_id)`. `status`: present, late, excused, absent. |
| `assessments` | `id`, `group_id`, `subject_id`, `term_id`, `name`, `type`, `max_score`, `weight`, `assessment_date`, `visible_to_guardian`, `created_by` | `type`: diagnostic, quiz, exam, project, participation, other. |
| `grades` | `id`, `assessment_id`, `student_id`, `score`, `status`, `notes`, `recorded_by`, `recorded_at` | `unique(assessment_id, student_id)`. `status`: pending, recorded, absent, exempt. |
| `task_status` | `id`, `student_id`, `task_key`, `status`, `note`, `recorded_by`, `updated_at` | Trabajo físico: pendiente, entregado, tarde, no aplica. No hay archivos. |
| `observations` | `id`, `student_id`, `author_id`, `category`, `body`, `visibility`, `created_at`, `updated_at`, `deleted_at` | `visibility`: internal, family. Las internas no las ve el padre. |
| `guardian_messages` | `id`, `student_id`, `guardian_id`, `observation_id`, `channel`, `subject`, `body`, `status`, `sent_at`, `read_at`, `provider_message_id`, `metadata` | `channel`: portal, email. `status`: draft, queued, sent, failed, read. |
| `email_outbox` | `id`, `to_email`, `template`, `payload`, `status`, `attempts`, `last_error`, `scheduled_at`, `sent_at` | Cola de correo para reintentos y auditoría. |

### Sistema

| Tabla | Campos clave | Reglas |
|---|---|---|
| `academic_years` | `id`, `name`, `starts_on`, `ends_on`, `is_active` | Un ciclo activo a la vez. |
| `terms` | `id`, `academic_year_id`, `name`, `starts_on`, `ends_on`, `weight`, `sort_order` | Tres periodos por defecto. |
| `audit_log` | `id bigserial`, `actor_id`, `action`, `entity_type`, `entity_id`, `before`, `after`, `ip`, `user_agent`, `created_at` | Solo admin puede leer. Escritura desde funciones/triggers. |
| `settings` | `key text PK`, `value jsonb`, `updated_by`, `updated_at` | Escala, periodos, dominio de alumnos, etc. |

## Enums propuestos

```sql
user_role: admin | teacher | student | guardian
unit_status: draft | published | archived
assignment_status: draft | active | closed
progress_status: not_started | in_progress | completed | mastered
attendance_status: present | late | excused | absent
observation_visibility: internal | family
message_channel: portal | email
message_status: draft | queued | sent | failed | read
grade_status: pending | recorded | absent | exempt
```

## Reglas críticas

1. **Publicar no es activar.** Una unidad publicada no aparece al alumno hasta que exista una asignación activa para su grupo.
2. **La asignación fija la versión.** Si se publica una versión nueva, las asignaciones anteriores siguen apuntando a la versión vieja.
3. **El progreso no se borra al cerrar.** Cerrar una asignación oculta la unidad, pero conserva avance e intentos.
4. **Los intentos son append-only.** Corregir un intento crea otro registro; no se sobrescribe el historial.
5. **Progreso e intentos apuntan a la misma asignación, unidad y versión.** El esquema usa una llave compuesta para evitar mezclar versiones.
6. **Las calificaciones se registran por evaluación.** El promedio por materia y periodo se calcula en una vista.
7. **Las observaciones internas no las ve la familia.** Solo las marcadas como `family`.
8. **El padre ve solo a sus hijos.** La relación se valida con `student_guardians`.
9. **El alumno no ve datos de otros alumnos.** RLS lo impide a nivel de fila.
10. **No hay pagos en el MVP.** No se crean tablas de cobro.
11. **Borrado lógico.** Observaciones y mensajes usan `deleted_at`; los datos académicos no se borran sin auditoría.

## Mapeo desde `localStorage`

| Clave actual | Destino |
|---|---|
| `curso_comipems_v1` | `unit_progress`, `exercise_attempts`, `quiz_attempts`, `xp_events`, `student_badges`, `student_stats` |
| `curso_ecoems_alumnos_v1` | `groups`, `students`, `guardians`, `student_guardians` |
| `curso_ecoems_asistencia_v1` | `attendance_sessions`, `attendance` |
| `curso_ecoems_perfiles_v1` | `student_profiles` |
| `curso_ecoems_plan_v1` | Planeación didáctica; no es MVP. Se migra después. |
| `curso_ecoems_entregas_v1` | `task_status` (estado físico, sin archivos) |
| `mate_reto_v1` | `game_sessions` |
| `lectura_reto_v1` | `reading_assessments` |

Los datos de demostración no se migran. El piloto empieza limpio; solo se importa la lista real de alumnos y tutores.
