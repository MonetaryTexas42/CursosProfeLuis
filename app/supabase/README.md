# Supabase

## Migraciones

```text
migrations/
  0001_schema.sql              38 tablas, enums, índices y triggers de updated_at
  0002_enable_rls.sql          RLS activo en todas las tablas
  0003_rls.sql                 funciones auxiliares y 77 políticas base
  0004_progress_rpcs.sql       inicio, intentos, quiz/reto y completar unidad
  0005_fix_quiz_accuracy.sql   corrige el cálculo de precisión del quiz
  0006_game_reading_rpcs.sql   sesiones de juego y evaluaciones de lectura
  0007_exercise_answers.sql    calificación de flashcards (respuesta de texto)
  0008_admin_content_stats.sql estadísticas de contenido para el panel admin
  0009_student_published_content.sql  alumnos leen contenido publicado (SEC-01)
  0010_player_sync_whatsapp.sql sincronización del reproductor y canal WhatsApp
  0011_force_password_change.sql cambio obligatorio de contraseña
  0012_staff_dashboard.sql     dashboard del staff y detalle del alumno
  0013_student_cards.sql       fichas, score del grupo y tablero de materias
  0014_fix_subject_board.sql   corrige app_subject_board
  0015_tasks_activity.sql      tareas, entregas y registro de actividades
  0016_student_tests.sql       tests de personalidad y orientación vocacional
  0017_external_accounts.sql   vinculación de cuentas y detección de externas
  0018_link_confirm.sql        confirmación de correo en la vinculación
  0019_link_username_fix.sql   corrige la generación de usuario al vincular
  0020_payments.sql            planes de pago y pagos por alumno
  0021_billing_guard.sql       finanzas visibles solo para personal y tutores
  0022_quiz_retry.sql          intento real de quiz y reintento visible
  0023_fix_published_content_rls.sql  cierra el contenido no asignado (SEC-01)
  0024_student_staff_notes.sql notas internas fuera de students (PRIV-02)
  0025_password_change_server.sql cambio de contraseña verificado (SEC-03)
  0026_student_link_tokens.sql invitaciones de alumno con token (SEC-02)
  0027_privacy_notice.sql      aviso, evidencia y bloqueo del tutor (PRIV-01)
tests/
  0004_progress_rpcs.sql       prueba SQL transaccional de las RPC de progreso
  0006_game_reading_rpcs.sql   prueba SQL transaccional de juegos y lectura
  0007_content_smoke.sql       flujo completo con contenido real (asignación → completar)
  rls/rls-negative.mjs         suite de RLS negativa (91 checks, ver COD-07)
```

El repositorio contiene **27 migraciones**. Un entorno creado desde cero
(staging) tiene 40 tablas, RLS en todas y 88 políticas. El estado real de
producción **no está verificado** (`DB-07`): no se debe asumir que las 27
migraciones estén aplicadas ni que producción coincida con el repositorio.

## Configuración versionada

`config.toml` describe el proyecto y fija el comportamiento de Auth que antes
solo existía en el dashboard (hallazgo **OPS-05**):

- `enable_signup = false`: las cuentas se crean con las Edge Functions
  administrativas, no por autorregistro.
- `enable_confirmations = true`: no se aceptan correos sin verificar.
- `minimum_password_length = 12` y
  `password_requirements = "lower_upper_letters_digits"`.

No contiene secretos. `auth.site_url` y `auth.additional_redirect_urls`
quedan en `localhost`: ajústalos a la URL del entorno antes de aplicar el
archivo, para no empujar la URL de producción a staging. Para aplicarlo sobre
un proyecto enlazado:

```bash
cd app
npx --yes supabase@latest config diff --workdir "$(pwd)"
npx --yes supabase@latest config push --workdir "$(pwd)" --yes
```

Revisa el diff antes de escribir y hazlo primero en staging. `config push`
cambia el comportamiento de Auth para todos los usuarios del proyecto.

## Suite de RLS negativa (COD-07)

`tests/rls/rls-negative.mjs` contiene 91 verificaciones que expresan el
comportamiento **seguro esperado** para `anon`, alumno con y sin asignación,
tutor con y sin vínculos, tutor con consentimiento vigente, profesor, otro
profesor y admin. Se ejecuta con un runner que descubre identidades reales,
valida que el JWT simulado resuelva al rol correcto y hace `rollback` en cada
prueba:

```bash
cd app
DATABASE_URL="$(cat .secrets/staging-database-url)" \
  node scripts/run-rls-tests.mjs
```

- `0`: todo PASS o SKIP justificado.
- `1`: hay FAIL (comportamiento inseguro).
- `2`: error de configuración o conexión.

Los roles sin identidad se marcan **SKIP**, nunca PASS. Antes de la Fase 1 la
línea base era **6 FAIL** (`SEC-01` y `PRIV-02`). Con `0023`–`0027` aplicadas y
los fixtures de consentimiento, la expectativa es **0 FAIL**; cualquier FAIL
nuevo es una regresión.

## Verificación de staging (OPS-09)

```bash
cd app
DATABASE_URL="$(cat .secrets/staging-database-url)" \
VITE_SUPABASE_URL="https://<ref-staging>.supabase.co" \
  node scripts/staging-check.mjs
```

Comprueba que la conexión no sea producción, cuenta migraciones, tablas,
políticas y funciones `SECURITY DEFINER`, y avisa si faltan contenido o
fixtures. Es de solo lectura y sale con código `2` si detecta producción.

## Usuarios ficticios de staging

```bash
cd app
SUPABASE_URL="https://<ref-staging>.supabase.co" \
SUPABASE_SERVICE_ROLE_KEY="<service-role-de-staging>" \
DATABASE_URL="$(cat .secrets/staging-database-url)" \
  node scripts/seed-staging-users.mjs
```

Crea ocho usuarios ficticios (admin, dos profesores, dos alumnos y tres
tutores), dos grupos, vínculos, consentimientos y una asignación activa. Es
idempotente y aborta si la URL apunta a producción. El orden completo de seeds
está en [`../docs/staging.md`](../docs/staging.md).

## Contenido real cargado

- 11 materias (4 activas: español, habilidad verbal, matemáticas, habilidad matemática).
- 60 unidades publicadas con versión 1 (checksum SHA-256 del contenido).
- 540 ejercicios flashcard, 426 preguntas de quiz (tipo + capítulo) y 47 retos.
- El contenido se extrae del curso actual con `scripts/extract-content.mjs` y se
  siembra con `scripts/seed-content.mjs` (idempotente).
- Formato de contenido (schemaVersion 1): ver `seed/content-v1.json` y
  `Fase-0/04-contenido-y-versionado.md` (adaptado al formato real de `data.js`).
- El grupo **Piloto A** tiene una asignación activa de `espanol-u01` como piloto.

## Pruebas ejecutadas

- **91 verificaciones de RLS** en `tests/rls/rls-negative.mjs`, ejecutadas con
  identidades ficticias y `rollback` (ver COD-07 más arriba).
- `tests/0004_progress_rpcs.sql`: inicio, intentos, quiz/reto, precisión, completado,
  tutor bloqueado y asignación cerrada bloqueada (8 verificaciones).
- `tests/0006_game_reading_rpcs.sql`: sesiones de juego, lecturas, estadísticas y
  bloqueos de tutor/juego inactivo (7 verificaciones).
- `tests/0007_content_smoke.sql`: con contenido real — inicio, lectura del contenido
  por RLS, flashcard correcta/incorrecta, quiz, completado y tutor bloqueado.
- `scripts/ui-smoke.mjs`: Chrome headless contra la app real — login de alumno,
  unidad visible, render del contenido, revelado de flashcard e intento calificado.

## Funciones Edge

```text
functions/
  admin-create-student/        alta de alumno (admin o profesor del grupo)   [listo]
  admin-reset-student-password/ contraseña temporal con auditoría            [listo]
  invite-guardian/             invitación de tutor con enlace mágico         [nuevo, por desplegar]
  guardian-consent/            aceptación/revocación del aviso de privacidad [nuevo, por desplegar]
  complete-password-change/    cambio de contraseña verificado (SEC-03)      [nuevo, por desplegar]
  issue-student-link-token/    invitación de alumno con token de un uso (SEC-02) [nuevo, por desplegar]
  redeem-student-link-token/   canje público del token y contraseña propia (SEC-02) [nuevo, por desplegar]
```

## Importante

- El esquema asume que existe `auth.users`, provisto por Supabase.
- Los alumnos **no** escriben tablas directamente; usan RPC para inicio, intentos,
  quiz/reto, completar unidad, juegos y lectura.
- No se deben cargar datos reales hasta revisar privacidad y completar el consentimiento.
- No se usa `service_role` en el frontend.
- Los correos de alumnos son sintéticos: `usuario@alumnos.ecoems.mx`.

## Flujo de migraciones

Aplica primero en **staging**, nunca en producción sin aprobación explícita y un
respaldo verificado:

```bash
# desde la raíz Plataforma/
cd app
npx supabase db push --db-url "$(cat .secrets/staging-database-url)" \
  --workdir "$(pwd)" --yes
```

Las cadenas directas viven en `.secrets/` (ignorado por git) y solo se usan en
administración local. No deben ir al frontend ni a un repositorio. La cadena
`.secrets/database-url` apunta a producción: no la uses para pruebas.

## Pruebas SQL

```bash
cd app
TEST_STUDENT_CODE=STAGING.ALUMNO.UNO \
DATABASE_URL="$(cat .secrets/staging-database-url)" \
  node scripts/run-sql-test.mjs supabase/tests/0004_progress_rpcs.sql
```

El runner exige `TEST_STUDENT_CODE` (fixture ficticio) y se niega a ejecutar
contra producción salvo `ALLOW_PRODUCTION_SQL_TEST=1`.

## Respaldo

```bash
cd app
DATABASE_URL="$(cat .secrets/database-url)" node scripts/backup-db.mjs
```

Escribe en `.backups/` (ignorado por git) un JSON con todas las tablas de
`auth` y `public`. El esquema se reproduce con las migraciones.

## Despliegue de Edge Functions

Requiere `SUPABASE_ACCESS_TOKEN`. No despliegues a producción hasta que el
cambio esté verificado en staging y exista aprobación explícita; el comando de
abajo usa el proyecto real como ejemplo.

```bash
cd app
npx supabase link --project-ref ioikcrdxneuydylyhvwi --workdir "$(pwd)"
npx supabase functions deploy invite-guardian guardian-consent \
  admin-create-student admin-reset-student-password \
  complete-password-change issue-student-link-token \
  redeem-student-link-token \
  --project-ref ioikcrdxneuydylyhvwi
```
