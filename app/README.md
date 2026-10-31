# Plataforma ECOEMS · App

Base local de Fase 1. Proyecto Supabase: `ioikcrdxneuydylyhvwi` (staging por crear).

## Estructura

```text
app/
  frontend/          Vite + JS, login y shell por rol
  supabase/          Migraciones, funciones Edge, pruebas y seed de contenido
  scripts/           Utilidades de administración (Node + pg)
  docs/              Enlaces a la especificación de Fase 0
```

## Estado

- [x] Estructura del repositorio.
- [x] Vite + módulos JS.
- [x] Cliente Supabase con variables de entorno.
- [x] Login de alumno, profesor y tutor.
- [x] Carga de perfil y redirección por rol.
- [x] Migración inicial con 34 tablas.
- [x] RLS activo en todas las tablas.
- [x] Políticas RLS y 17 pruebas de acceso.
- [x] Usuarios ficticios persistentes por rol.
- [x] Ciclo escolar, trimestres y grupo piloto con alumnos y tutores.
- [x] Panel por rol con grupo, alumnos, hijos y unidades activas.
- [x] RPC de inicio, intentos, quiz/reto y completar unidad.
- [x] RPC de juegos y lectura (`0006`), probadas.
- [x] Calificación de flashcards de texto (`0007`).
- [x] Carga de contenido real: 11 materias, 60 unidades, 540 ejercicios,
      426 preguntas de quiz y 47 retos (versión 1 publicada).
- [x] Pantalla de unidad del alumno con contenido real (teoría, guías,
      ejemplos, errores comunes, capítulo, flashcards y quiz).
- [x] Prueba UI en Chrome headless con la unidad real (`scripts/ui-smoke.mjs`).
- [x] Edge Functions `admin-create-student` y `admin-reset-student-password`.
- [x] Edge Functions `invite-guardian` y `guardian-consent` (código listo).
- [ ] Despliegue de Edge Functions (falta `SUPABASE_ACCESS_TOKEN`).
- [ ] Proyecto staging y despliegue del frontend.
- [ ] Correo transaccional (SMTP) para invitaciones.
- [ ] Consentimiento probado con un tutor real.

## Arranque local

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Sin las variables de entorno, la app muestra una pantalla de configuración; no falla.

## Scripts de administración

```bash
cd app

# Extraer el contenido del curso actual a supabase/seed/content-v1.json
node scripts/extract-content.mjs

# Sembrar contenido en la base (idempotente)
DATABASE_URL="$(cat .secrets/database-url)" node scripts/seed-content.mjs

# Correr una prueba SQL transaccional
DATABASE_URL="$(cat .secrets/database-url)" node scripts/run-sql-test.mjs supabase/tests/0004_progress_rpcs.sql

# Respaldo de la base en JSON (.backups/, ignorado por git)
DATABASE_URL="$(cat .secrets/database-url)" node scripts/backup-db.mjs

# Prueba UI con Chrome headless (requiere la app servida en :5173)
node scripts/ui-smoke.mjs
```

## Reglas

- No se usa `service_role` en el frontend.
- No se suben `.env` ni datos reales.
- La cadena directa de Postgres vive en `.secrets/database-url` (ignorada por git) y solo se usa para migraciones y scripts.
- La seguridad real se implementa con RLS en Supabase.
- El curso actual no se modifica.

## Siguiente paso

Desplegar las Edge Functions (requiere `SUPABASE_ACCESS_TOKEN`), crear el proyecto
staging, configurar el correo transaccional y publicar el frontend.
