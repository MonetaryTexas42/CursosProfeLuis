# 04 · Base de datos

## 1. Resumen

El esquema está bien normalizado para un piloto: 38 tablas, claves primarias UUID, claves foráneas explícitas, restricciones `check`, índices en las columnas de consulta más frecuentes y RLS en todas las tablas. Las migraciones son legibles y están comentadas.

Los problemas no están en el diseño general, sino en **detalles de integridad y operación**:

- `unit_assignments` no tiene una restricción única por `(group_id, unit_id)`, lo que permite duplicados.
- Muchas claves foráneas no tienen `on delete cascade`, así que **no se puede borrar un alumno** con historial.
- `app_sync_player_state` acepta XP y racha del cliente sin validarlos contra el contenido.
- `app_complete_unit` permite completar una unidad sin haber hecho nada.
- No hay retención ni partición para `audit_log` y `email_outbox`.
- El estado real de las migraciones en producción no se pudo verificar.

**Nivel de riesgo de base de datos:** **Medio**, con un punto de integridad alto (`DB-03`) y un punto de diseño que agrava privacidad (`DB-08`).

---

## 2. Inventario de migraciones

| # | Archivo | Líneas | Propósito | Observación |
|---|---|---:|---|---|
| 0001 | `0001_schema.sql` | 624 | Esquema base: 38 tablas, enums, índices, triggers | Sólido; muchas FKs sin cascade |
| 0002 | `0002_enable_rls.sql` | 34 | Habilita RLS en todas las tablas | Completo |
| 0003 | `0003_rls.sql` | 903 | Helpers de autorización + 77 políticas | Núcleo de seguridad; no idempotente |
| 0004 | `0004_progress_rpcs.sql` | 471 | `app_start_unit`, `app_record_exercise_attempt`, `app_submit_quiz_answer`, `app_complete_unit` | Evaluación en servidor |
| 0005 | `0005_fix_quiz_accuracy.sql` | 177 | Corrige cálculo de precisión del quiz | Parche |
| 0006 | `0006_game_reading_rpcs.sql` | 225 | RPCs de juegos y lectura | — |
| 0007 | `0007_exercise_answers.sql` | 236 | Evaluación de ejercicios con opciones y texto | Bien resuelto |
| 0008 | `0008_admin_content_stats.sql` | 49 | Estadísticas de contenido para admin | Solo lectura |
| 0009 | `0009_student_published_content.sql` | 24 | Permite a alumnos leer contenido publicado | **Origen de `SEC-01`** |
| 0010 | `0010_player_sync_whatsapp.sql` | 79 | Sincronización del reproductor + canal WhatsApp | **Origen de `DB-03`** |
| 0011 | `0011_force_password_change.sql` | 34 | Limpia `must_change_password` | **Origen de `SEC-03`** |
| 0012 | `0012_staff_dashboard.sql` | 294 | Dashboard del staff y detalle del alumno | — |
| 0013 | `0013_student_cards.sql` | 367 | Fichas, score de grupo, tablero de materias | Añade `student_profiles` |
| 0014 | `0014_fix_subject_board.sql` | 103 | Corrige tablero de materias | Parche |
| 0015 | `0015_tasks_activity.sql` | 280 | Tareas, entregas, actividad | — |
| 0016 | `0016_student_tests.sql` | 128 | Tests de personalidad y vocacional | — |
| 0017 | `0017_external_accounts.sql` | 215 | Cuentas externas, baneo, vinculación | **Origen de `SEC-07`** |
| 0018 | `0018_link_confirm.sql` | 144 | Confirma correo al vincular | **Origen de `SEC-02`** |
| 0019 | `0019_link_username_fix.sql` | 144 | Corrige generación de usuario | Redefine 0018 |
| 0020 | `0020_payments.sql` | 64 | Planes y pagos | Sin saldo/cobertura |
| 0021 | `0021_billing_guard.sql` | 34 | Endurece lectura de finanzas | Correcto |
| 0022 | `0022_quiz_retry.sql` | 196 | Reintento de quiz con `attempt_no` | — |

**Total:** 4,825 líneas SQL.

### 2.1. Orden y dependencias

```
0001 esquema
  └── 0002 RLS
        └── 0003 políticas + helpers
              ├── 0004 progreso
              ├── 0005 fix quiz
              ├── 0006 juegos/lectura
              ├── 0007 ejercicios
              ├── 0008 stats admin
              ├── 0009 contenido publicado  ← conflicto con 0003
              ├── 0010 sync jugador
              ├── 0011 password
              ├── 0012 dashboard staff
              ├── 0013 fichas
              ├── 0014 fix tablero
              ├── 0015 tareas
              ├── 0016 tests
              ├── 0017 cuentas externas
              ├── 0018 vinculación
              ├── 0019 fix usuario
              ├── 0020 pagos
              ├── 0021 billing guard
              └── 0022 quiz retry
```

No hay migraciones de rollback (`down`) ni un manifiesto de versión aplicada en el repositorio.

---

## 3. Inventario de tablas

### 3.1. Núcleo institucional

| Tabla | PK | Claves foráneas | Restricciones relevantes |
|---|---|---|---|
| `academic_years` | `id` | — | `name unique`; índice único parcial `is_active` |
| `terms` | `id` | `academic_year_id → academic_years` | `unique (academic_year_id, name)` |
| `groups` | `id` | `academic_year_id`, `teacher_id → profiles` | — |
| `profiles` | `id` | `id → auth.users` (cascade) | `username citext unique`, `email citext unique` |
| `students` | `id` | `profile_id → profiles` (unique), `group_id → groups` | `student_code unique` |
| `guardians` | `id` | `profile_id → profiles` (unique) | `email citext unique` |
| `student_guardians` | `(student_id, guardian_id)` | `student_id → students`, `guardian_id → guardians` | Índice único parcial de un tutor primario |

### 3.2. Contenido

| Tabla | PK | Claves foráneas | Restricciones relevantes |
|---|---|---|---|
| `subjects` | `id` (text) | — | — |
| `units` | `id` | `subject_id → subjects` | `status` enum (`draft`, `published`, `archived`) |
| `unit_versions` | `id` | `unit_id → units` | `unique (id, unit_id)`; `content jsonb` |
| `unit_assignments` | `id` | `group_id → groups`, `unit_id → units`, `(unit_version_id, unit_id) → unit_versions` | `unique (id, unit_id, unit_version_id)`; **sin unique `(group_id, unit_id)`** |
| `student_unit_overrides` | `id` | `assignment_id → unit_assignments`, `student_id → students` | `unique (assignment_id, student_id)` |
| `unit_progress` | `id` | `student_id → students`, `(assignment_id, unit_id, unit_version_id) → unit_assignments` | `unique (student_id, assignment_id)` |

### 3.3. Evaluación y actividad

| Tabla | PK | Claves foráneas | Restricciones relevantes |
|---|---|---|---|
| `exercise_attempts` | `bigserial` | `student_id → students`, `(assignment_id, unit_id, unit_version_id) → unit_assignments` | `attempt_no > 0`, `duration_ms >= 0` |
| `quiz_attempts` | `bigserial` | `student_id → students`, `(assignment_id, unit_id, unit_version_id) → unit_assignments` | `part in ('tipo','reto','capitulo')` |
| `game_sessions` | `id` | `student_id → students`, `game_id → game_catalog` | — |
| `reading_assessments` | `id` | `student_id → students` | — |
| `xp_events` | `id` | `student_id → students` | — |
| `badges` | `id` | — | — |
| `student_badges` | `(student_id, badge_id)` | `student_id`, `badge_id` | — |
| `student_stats` | `student_id` | `student_id → students` | `xp_total >= 0`, etc. |

### 3.4. Evaluación formal y comunicación

| Tabla | PK | Claves foráneas | Restricciones relevantes |
|---|---|---|---|
| `assessments` | `id` | `group_id → groups`, `subject_id → subjects`, `term_id → terms` | `max_score > 0` |
| `grades` | `id` | `assessment_id → assessments`, `student_id → students` | `unique (assessment_id, student_id)` |
| `task_status` | `id` | `student_id → students` | — |
| `tasks` | `id` | `group_id → groups`, `subject_id → subjects`, `unit_id → units` | `max_score > 0` |
| `task_submissions` | `id` | `task_id → tasks`, `student_id → students` | — |
| `attendance_sessions` | `id` | `group_id → groups` | `unique (group_id, session_date, start_time)` |
| `attendance` | `id` | `session_id → attendance_sessions`, `student_id → students` | `unique (session_id, student_id)` |
| `observations` | `id` | `student_id → students`, `author_id → profiles` | `visibility` enum |
| `guardian_messages` | `id` | `student_id`, `guardian_id`, `observation_id` | — |
| `email_outbox` | `id` | — | `status`, `scheduled_at` |
| `audit_log` | `id` | `actor_id → profiles` | — |
| `settings` | `key` | — | `value jsonb` |
| `privacy_consents` | `id` | `student_id`, `guardian_id` | — |
| `student_profiles` | `student_id` | `student_id → students` | — |
| `student_billing` | `student_id` | `student_id → students` (cascade) | `plan` enum, `fee >= 0` |
| `payments` | `id` | `student_id → students` (cascade) | `amount > 0`, `method` enum |

---

## 4. Claves, FKs e índices

### 4.1. Índices existentes

34 índices, entre ellos:

- `academic_years_one_active` (único parcial).
- `student_guardians_one_primary` (único parcial).
- `profiles_role_idx`, `groups_teacher_idx`, `groups_year_idx`.
- `students_group_idx`.
- `student_guardians_guardian_idx`.
- `privacy_consents_student_idx`.
- `units_subject_status_idx`.
- `unit_versions_unit_idx`.
- `unit_assignments_group_status_idx`, `unit_assignments_unit_idx`.
- `overrides_student_idx`.
- `unit_progress_student_idx`, `unit_progress_assignment_idx`.
- `exercise_attempts_student_idx`, `exercise_attempts_assignment_idx`.
- `quiz_attempts_student_idx`.
- `game_sessions_student_idx`, `game_sessions_game_idx`.
- `reading_assessments_student_idx`.
- `xp_events_student_idx`.
- `student_badges_badge_idx`.
- `attendance_sessions_group_idx`, `attendance_student_idx`.
- `assessments_group_term_idx`, `grades_student_idx`.
- `task_status_student_idx`.
- `observations_student_idx`, `observations_visibility_idx`.
- `guardian_messages_student_idx`, `guardian_messages_guardian_idx`, `guardian_messages_status_idx`.
- `email_outbox_status_idx`.
- `audit_log_actor_idx`, `audit_log_entity_idx`.
- `terms_year_idx`.

### 4.2. Índices faltantes o mejorables

| Columna | Por qué importa | Recomendación |
|---|---|---|
| `payments.student_id` | Filtrar pagos por alumno | Índice simple |
| `payments.paid_at` | Resúmenes mensuales | Índice o compuesto `(student_id, paid_at)` |
| `student_billing.updated_at` | Ordenar/auditar | Índice |
| `unit_assignments.unit_version_id` | Joins por versión | Índice |
| `unit_progress.status` | Filtros de avance | Índice parcial |
| `students.status` | Conteos de activos | Índice parcial |
| `units.status` | Filtros de publicación | Ya cubierto por `(subject_id, status)`; considerar `(status)` |
| `quiz_attempts.assignment_id` | Analítica por asignación | Índice |
| `audit_log.created_at` | Retención/consultas | Índice |

No es un problema crítico con el volumen actual, pero conviene planearlo antes de crecer.

### 4.3. FKs sin `on delete`

La mayoría de las FKs usan el comportamiento por defecto (`no action`). Eso significa que **no se puede borrar un alumno** mientras tenga:

- `unit_progress`
- `exercise_attempts`
- `quiz_attempts`
- `game_sessions`
- `reading_assessments`
- `xp_events`
- `student_stats`
- `attendance`
- `grades`
- `task_status`
- `task_submissions`
- `observations`
- `guardian_messages`
- `privacy_consents`
- `student_profiles`

Y **no se puede borrar un perfil** mientras tenga `students` o `guardians`.

`student_billing` y `payments` sí tienen `on delete cascade` (`0020`).

**Consecuencia:** el borrado de alumnos es inviable sin un procedimiento manual que desactive FKs o borre en orden. La política `students_delete_admin` existe, pero en la práctica falla.

---

## 5. Consistencia y calidad de datos

### 5.1. Duplicación de correo

`profiles.email` y `guardians.email` son `citext unique`, pero también existen `auth.users.email`. No hay trigger que mantenga la sincronización. Si un usuario cambia su correo en Auth, `profiles.email` queda desactualizado.

**Riesgo:** el login de alumnos usa `profiles.username` y el dominio sintético; el de profesores/tutores usa el correo de Auth. Una discrepancia puede impedir el acceso o mostrar datos incorrectos.

### 5.2. `notes_internal`

`students.notes_internal` (`0001:111`) es una columna de texto libre para notas del profesor. La política `students_select` entrega la fila completa al alumno y al tutor. Ver `PRIV-02`.

### 5.3. `student_stats` controlado por el cliente

`app_sync_player_state` (`0010:12-75`) recibe `p_payload` con `xp`, `racha`, `best` y `done`, y los escribe con `greatest` en `student_stats`. No valida contra el contenido completado ni contra `unit_progress`. Un alumno puede inflar su XP.

### 5.4. `unit_assignments` duplicables

No hay `unique (group_id, unit_id)`. La UI puede crear una asignación nueva para la misma unidad y grupo si se activa dos veces; los alumnos verían dos tarjetas o el progreso se dividiría entre asignaciones.

### 5.5. `payments` sin periodo ni cobertura

`payments` registra monto, fecha, método y concepto, pero no un periodo cubierto ni un saldo. No hay forma de saber si un alumno está al corriente, si un pago es duplicado o si cubre el mes. Ver `FUN-02`.

### 5.6. `privacy_consents` sin hash del documento

Se guarda `document_version`, `accepted_at`, `revoked_at`, IP y user-agent, pero no el hash del texto mostrado. Si el texto cambia sin cambiar la versión, no hay evidencia de qué se aceptó.

### 5.7. Datos de prueba en producción

Se observaron referencias a cuentas de prueba (`alumno1`, `profesor1@ecoems.local`, `profesora2@ecoems.local`, grupo “Piloto A”, alumna “Alexa”) en scripts y documentación. No se verificó si siguen en producción. Ver `12_PRUEBAS_PENDIENTES.md`.

---

## 6. Hallazgos de base de datos

### DB-01 · `unit_assignments` permite duplicados por grupo y unidad

- **Severidad:** Medio
- **Categoría:** Base de datos / integridad
- **Ubicación:** `app/supabase/migrations/0001_schema.sql:194-211`
- **Evidencia:**

```sql
create table if not exists public.unit_assignments (
  ...
  unique (id, unit_id, unit_version_id),
  ...
);
```

La única restricción única es para la terna `(id, unit_id, unit_version_id)`, que sirve para la FK compuesta de `unit_progress`/`exercise_attempts`, no para evitar duplicados de negocio. No hay `unique (group_id, unit_id)`.

- **Problema:** se pueden crear dos asignaciones activas para la misma unidad y grupo.
- **Escenario:** el profesor activa una unidad, la cierra y la vuelve a activar; la UI crea otra fila. Los alumnos ven dos tarjetas, el progreso se reparte y las estadísticas se duplican.
- **Impacto:** confusión, métricas incorrectas, esfuerzo de soporte.
- **Recomendación:** añadir `unique (group_id, unit_id)` (o un índice único parcial que permita reabrir la misma fila) y ajustar la UI para reutilizar la asignación existente. Limpiar duplicados antes de aplicar la restricción.
- **Prioridad:** P2
- **Confianza:** Alta
- **Estado:** Abierto

---

### DB-02 · Las FKs sin `on delete` impiden borrar alumnos y perfiles

- **Severidad:** Medio
- **Categoría:** Base de datos / integridad referencial
- **Ubicación:** `0001_schema.sql` (múltiples tablas); `0020_payments.sql` (excepciones con cascade)
- **Evidencia:** `students.profile_id references profiles(id)` sin `on delete`; `unit_progress.student_id references students(id)` sin `on delete`; `exercise_attempts.student_id`, `quiz_attempts.student_id`, `game_sessions.student_id`, `reading_assessments.student_id`, `xp_events.student_id`, `student_stats.student_id`, `attendance.student_id`, `grades.student_id`, `task_status.student_id`, `task_submissions.student_id`, `observations.student_id`, `guardian_messages.student_id`, `privacy_consents.student_id`, `student_profiles.student_id` — todas sin cascade.
- **Problema:** la política `students_delete_admin` existe, pero el borrado falla por las FKs. El “borrado” real requiere desactivar (`status='inactive'`), no eliminar.
- **Escenario:** un tutor ejerce su derecho de cancelación; el admin intenta borrar al alumno y recibe un error de FK. Se queda con datos personales que debía eliminar.
- **Impacto:** incumplimiento de privacidad, imposibilidad de limpiar datos de prueba, crecimiento indefinido.
- **Recomendación:** definir una política de borrado: `on delete cascade` para datos derivados (progreso, intentos, stats) y `on delete set null` o anonimización para datos contables (`payments`, `audit_log`). Implementar una función `app_anonymize_student(id)` que borre/anonimice en orden y registre la acción.
- **Prioridad:** P2
- **Confianza:** Alta
- **Estado:** Abierto

---

### DB-03 · `app_sync_player_state` acepta XP y racha del cliente sin validación

- **Severidad:** Medio
- **Categoría:** Base de datos / integridad de gamificación
- **Ubicación:** `app/supabase/migrations/0010_player_sync_whatsapp.sql:12-75`
- **Evidencia:**

```sql
v_xp int := coalesce((p_payload ->> 'xp')::int, 0);
v_streak int := coalesce((p_payload ->> 'racha')::int, 0);
v_best int := coalesce((p_payload ->> 'best')::int, 0);
v_done int := coalesce(jsonb_array_length(p_payload -> 'done'), 0);
...
insert into public.student_stats (...)
values (v_student_id, v_xp, v_streak, v_best, v_done, current_date, now())
on conflict (student_id) do update
  set xp_total = greatest(student_stats.xp_total, excluded.xp_total),
      ...
```

- **Problema:** el servidor confía en el cliente. No verifica que el XP corresponda a unidades completadas, intentos correctos o eventos registrados. `greatest` impide bajar el XP, pero no impide inflarlo.
- **Escenario:** el alumno ejecuta `supabase.rpc('app_sync_player_state', { p_payload: { xp: 999999, racha: 999, best: 999, done: [...] } })`. Su perfil aparece como el mejor de la plataforma.
- **Impacto:** gamificación sin valor, comparaciones injustas, posible desmotivación, datos sucios para reportes.
- **Recomendación:** calcular XP y racha en el servidor a partir de `unit_progress`, `exercise_attempts`, `quiz_attempts` y `xp_events`; no aceptar valores del cliente. Si se necesita sincronizar el reproductor, aceptar solo eventos (`unit_completed`, `exercise_correct`) y derivar el total. Añadir topes y auditoría.
- **Prioridad:** P2
- **Confianza:** Alta
- **Estado:** Abierto

---

### DB-04 · `app_complete_unit` permite completar sin actividades

- **Severidad:** Medio
- **Categoría:** Base de datos / integridad académica
- **Ubicación:** `app/supabase/migrations/0004_progress_rpcs.sql:398-465`
- **Evidencia:** la función valida que la asignación esté activa y luego hace `insert ... on conflict ... status = 'completed'` sin comprobar `unit_progress.attempts_count`, `best_accuracy`, ejercicios respondidos ni quiz completado.
- **Problema:** un alumno puede marcar una unidad como completada sin estudiarla.
- **Escenario:** `await supabase.rpc('app_complete_unit', { p_assignment_id })` en la consola; la unidad aparece completada y cuenta para `units_completed`.
- **Impacto:** métricas de avance falsas, credenciales sin sustento, reportes engañosos.
- **Recomendación:** exigir un mínimo configurable (por ejemplo, 80 % de ejercicios intentados y precisión mínima) antes de `completed`; distinguir `completed` de `mastered`; registrar la regla aplicada.
- **Prioridad:** P2
- **Confianza:** Alta
- **Estado:** Abierto

---

### DB-05 · Migraciones sin rollback y parcialmente no idempotentes

- **Severidad:** Bajo
- **Categoría:** Base de datos / operación
- **Ubicación:** `app/supabase/migrations/*.sql`; por ejemplo `0003_rls.sql:625` y `0009:8`
- **Evidencia:** `create policy units_select ...` sin `drop policy if exists`; no hay archivos `down` ni un manifiesto de versión.
- **Problema:** reaplicar una migración falla; revertir un cambio requiere escribir SQL a mano; no hay historial de qué se aplicó en cada entorno.
- **Escenario:** se intenta reconstruir staging desde cero y una migración falla a mitad; el esquema queda inconsistente.
- **Impacto:** recuperación lenta, deriva entre entornos.
- **Recomendación:** usar `drop policy if exists` antes de `create policy`; mantener migraciones `up`/`down` o usar el flujo de Supabase CLI con `db diff`; registrar la versión aplicada; probar el rebuild completo en staging.
- **Prioridad:** P3
- **Confianza:** Alta
- **Estado:** Abierto

---

### DB-06 · Sin retención ni partición para `audit_log` y `email_outbox`

- **Severidad:** Bajo
- **Categoría:** Base de datos / operación
- **Ubicación:** `0001_schema.sql` (`audit_log`, `email_outbox`); índices en `0001:559-561`
- **Evidencia:** ambas tablas crecen sin límite; no hay job de limpieza ni política de retención documentada.
- **Problema:** con el tiempo, las consultas se vuelven lentas y los datos personales se acumulan más allá de lo necesario.
- **Escenario:** después de un año, `audit_log` tiene cientos de miles de filas; los reportes tardan; el respaldo crece.
- **Impacto:** costo, rendimiento, privacidad.
- **Recomendación:** definir retención (por ejemplo, 12 meses para auditoría, 90 días para `email_outbox`), implementar un job de limpieza y documentarlo; considerar partición por mes si el volumen lo justifica.
- **Prioridad:** P3
- **Confianza:** Alta
- **Estado:** Abierto

---

### DB-07 · El estado real de las migraciones en producción no se pudo verificar

- **Severidad:** Medio (riesgo de verificación, no defecto confirmado)
- **Categoría:** Base de datos / gobernanza
- **Ubicación:** `app/supabase/.temp/linked-project.json`; no hay `supabase/config.toml`
- **Evidencia:** el proyecto está enlazado a `ioikcrdxneuydylyhvwi`, pero no se autorizó conexión de solo lectura ni acceso al dashboard. No se puede afirmar que las 22 migraciones estén aplicadas, ni en qué orden, ni si hay cambios manuales fuera de las migraciones.
- **Problema:** la auditoría se basa en el código; si producción difiere, los hallazgos pueden cambiar.
- **Escenario:** una política se aplicó a mano en el dashboard y no está en el repositorio; el `drop policy` propuesto no la elimina.
- **Impacto:** correcciones incompletas, falsa sensación de seguridad.
- **Recomendación:** ejecutar en una réplica/staging:

```sql
select version, name, inserted_at
from supabase_migrations.schema_migrations
order by version;
```

y comparar con los 22 archivos. Revisar también `pg_policies` y `pg_proc` para detectar objetos no versionados. Ver `12_PRUEBAS_PENDIENTES.md`.
- **Prioridad:** P1 (verificación)
- **Confianza:** Alta en la limitación
- **Estado:** Abierto

---

### DB-08 · `notes_internal` vive en la tabla que se expone al alumno y al tutor

- **Severidad:** Bajo como diseño; **Alto** por su efecto (ver `PRIV-02`)
- **Categoría:** Base de datos / diseño de privacidad
- **Ubicación:** `app/supabase/migrations/0001_schema.sql:103-115`; política en `0003_rls.sql:560`
- **Evidencia:**

```sql
create table if not exists public.students (
  ...
  notes_internal text,
  ...
);
```

```sql
create policy students_select
on public.students for select to authenticated
using (public.app_can_access_student(id));
```

- **Problema:** una columna de uso interno comparte tabla y política con datos que el alumno y el tutor sí deben ver. RLS filtra filas, no columnas.
- **Escenario:** el profesor escribe “crisis familiar, no presionar”; el alumno o el tutor lee la nota desde la API.
- **Impacto:** fuga de información sensible, daño a la relación pedagógica.
- **Recomendación:** mover `notes_internal` a `student_private_notes` con política solo para staff; o crear una vista `students_public` sin la columna y usarla en el frontend. Ver `PRIV-02`.
- **Prioridad:** P1 (por su efecto)
- **Confianza:** Alta
- **Estado:** Mitigado en código · pendiente de verificación en staging
- **Remediación:** migración `0024_student_staff_notes.sql`; ver `PRIV-02`.

---

## 7. Consultas de verificación (solo lectura)

Ejecutar en réplica o staging.

### 7.1. Migraciones aplicadas

```sql
select version, name, inserted_at
from supabase_migrations.schema_migrations
order by version;
```

### 7.2. Cobertura RLS

```sql
select c.relname as tabla, c.relrowsecurity as rls
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind = 'r'
order by c.relname;
```

**Esperado:** `rls = true` en las 38 tablas.

### 7.3. Políticas por tabla

```sql
select tablename, policyname, cmd, permissive
from pg_policies
where schemaname = 'public'
order by tablename, policyname;
```

### 7.4. Asignaciones duplicadas

```sql
select group_id, unit_id, count(*) as n
from public.unit_assignments
group by group_id, unit_id
having count(*) > 1
order by n desc;
```

### 7.5. Alumnos sin perfil o perfil sin alumno

```sql
select s.id, s.student_code
from public.students s
left join public.profiles p on p.id = s.profile_id
where p.id is null;

select p.id, p.email
from public.profiles p
left join public.students s on s.profile_id = p.id
where p.role = 'student' and s.id is null;
```

### 7.6. Correos desincronizados

```sql
select p.id, p.email as profile_email, u.email as auth_email
from public.profiles p
join auth.users u on u.id = p.id
where p.email is distinct from u.email;
```

### 7.7. Notas internas con contenido

```sql
select count(*) as alumnos_con_nota
from public.students
where notes_internal is not null and length(trim(notes_internal)) > 0;
```

### 7.8. Estadísticas anómalas

```sql
select student_id, xp_total, current_streak, best_streak, units_completed
from public.student_stats
where xp_total > 100000
   or current_streak > 365
   or best_streak > 365
   or units_completed > (select count(*) from public.units)
order by xp_total desc;
```

### 7.9. Pagos duplicados o sin plan

```sql
select student_id, amount, paid_at, count(*) as n
from public.payments
group by student_id, amount, paid_at
having count(*) > 1;

select s.id, s.student_code
from public.students s
left join public.student_billing b on b.student_id = s.id
where b.student_id is null;
```

### 7.10. Consentimientos sin versión vigente

```sql
select pc.student_id, pc.document_version, pc.accepted_at, pc.revoked_at
from public.privacy_consents pc
where pc.document_version <> (
  select (value ->> 'privacy_document_version')
  from public.settings
  where key = 'privacy_document_version'
);
```

### 7.11. Datos de prueba

```sql
select id, student_code, status
from public.students
where student_code ilike '%PRUEBA%'
   or student_code ilike '%ALEXA%'
   or student_code ilike '%TEST%';

select id, email, role, active
from public.profiles
where email ilike '%@ecoems.local'
   or username in ('alumno1', 'profesor1', 'profesora2');
```

### 7.12. FKs sin cascade

```sql
select
  tc.table_name,
  kcu.column_name,
  ccu.table_name as referenced_table,
  rc.delete_rule
from information_schema.table_constraints tc
join information_schema.key_column_usage kcu
  on kcu.constraint_name = tc.constraint_name
join information_schema.constraint_column_usage ccu
  on ccu.constraint_name = tc.constraint_name
join information_schema.referential_constraints rc
  on rc.constraint_name = tc.constraint_name
where tc.constraint_type = 'FOREIGN KEY'
  and tc.table_schema = 'public'
order by tc.table_name, kcu.column_name;
```

---

## 8. Recomendaciones de base de datos

1. **Cerrar `SEC-01` con una migración de dos `drop policy`.** Es el cambio de mayor impacto y menor riesgo.
2. **Añadir `unique (group_id, unit_id)`** a `unit_assignments`, después de limpiar duplicados.
3. **Definir la política de borrado/anonimización** de alumnos y ajustar FKs.
4. **Mover `notes_internal`** a una tabla privada o crear una vista pública.
5. **Calcular XP en el servidor** y dejar de aceptar `student_stats` del cliente.
6. **Exigir requisitos mínimos** en `app_complete_unit`.
7. **Versionar la configuración de Supabase** (`config.toml`) y registrar migraciones aplicadas.
8. **Añadir índices** en FKs y columnas de filtro antes de crecer.
9. **Definir retención** para `audit_log`, `email_outbox` y respaldos.
10. **Probar el rebuild completo** del esquema en staging desde cero.

---

## 9. Conclusión

El esquema es **ordenado y legible**, con decisiones correctas: UUID, enums, restricciones `check`, FK compuestas para garantizar que el intento pertenece a la asignación correcta, e índices en los accesos principales. No hay señales de diseño caótico.

Los problemas son de **cierre**: una restricción única que falta, FKs que impiden el borrado, una RPC que confía en el cliente y columnas internas en tablas públicas. Son correcciones puntuales, no una reescritura. La base puede sostener el piloto; necesita higiene antes de crecer.
