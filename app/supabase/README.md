# Supabase

## Migraciones

```text
migrations/
  0001_schema.sql              34 tablas, enums, índices y triggers de updated_at
  0002_enable_rls.sql          RLS activo en todas las tablas
  0003_rls.sql                 funciones auxiliares y 77 políticas
  0004_progress_rpcs.sql       inicio, intentos, quiz/reto y completar unidad
  0005_fix_quiz_accuracy.sql   corrige el cálculo de precisión del quiz
  0006_game_reading_rpcs.sql   sesiones de juego y evaluaciones de lectura
  0007_exercise_answers.sql    calificación de flashcards (respuesta de texto)
tests/
  0004_progress_rpcs.sql       prueba SQL transaccional de las RPC de progreso
  0006_game_reading_rpcs.sql   prueba SQL transaccional de juegos y lectura
  0007_content_smoke.sql       flujo completo con contenido real (asignación → completar)
```

Las siete migraciones están aplicadas al proyecto `ioikcrdxneuydylyhvwi`. La base tiene 34 tablas, RLS en todas y 77 políticas.

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

- **17 pruebas de RLS** con usuarios ficticios dentro de una transacción con `rollback`.
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
```

## Importante

- El esquema asume que existe `auth.users`, provisto por Supabase.
- Los alumnos **no** escriben tablas directamente; usan RPC para inicio, intentos,
  quiz/reto, completar unidad, juegos y lectura.
- No se deben cargar datos reales hasta revisar privacidad y completar el consentimiento.
- No se usa `service_role` en el frontend.
- Los correos de alumnos son sintéticos: `usuario@alumnos.ecoems.mx`.

## Flujo de migraciones

```bash
# desde la raíz Plataforma/
cd app
npx supabase db push --db-url "$(cat .secrets/database-url)" \
  --workdir "$(pwd)" --yes
```

La cadena directa vive en `.secrets/database-url`, que está ignorado por git, y solo
se usa en administración local. No debe ir al frontend ni a un repositorio.

## Pruebas SQL

```bash
cd app
DATABASE_URL="$(cat .secrets/database-url)" \
  node scripts/run-sql-test.mjs supabase/tests/0004_progress_rpcs.sql
```

## Respaldo

```bash
cd app
DATABASE_URL="$(cat .secrets/database-url)" node scripts/backup-db.mjs
```

Escribe en `.backups/` (ignorado por git) un JSON con todas las tablas de
`auth` y `public`. El esquema se reproduce con las migraciones.

## Despliegue de Edge Functions

Requiere `SUPABASE_ACCESS_TOKEN`:

```bash
cd app
npx supabase link --project-ref ioikcrdxneuydylyhvwi --workdir "$(pwd)"
npx supabase functions deploy invite-guardian guardian-consent \
  admin-create-student admin-reset-student-password \
  --project-ref ioikcrdxneuydylyhvwi
```
