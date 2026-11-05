# Plataforma ECOEMS · App

Base local de Fase 1. Proyecto Supabase: `ioikcrdxneuydylyhvwi` (staging por crear).

## Producción

- **App (GitHub Pages):** https://monetarytexas42.github.io/CursosProfeLuis/
- El repo es público (requisito de Pages en plan gratuito). Sin secretos versionados.

### Republicar el frontend

```bash
cd app/frontend
npm run build -- --base=/CursosProfeLuis/
cd dist
git init -b gh-pages
git add -A
git commit -m "Build de la plataforma"
git push -f https://github.com/MonetaryTexas42/CursosProfeLuis.git gh-pages
```

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
- [x] Login de alumno, profesor y tutor (tutor: enlace por WhatsApp, sin correo).
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
- [x] Edge Functions desplegadas: `admin-create-student`,
      `admin-reset-student-password`, `invite-guardian` y `guardian-consent`.
- [x] Invitación de tutores **por WhatsApp** (botón en el panel del profesor;
      sin envío de correos) y consentimiento del tutor funcional E2E.
- [x] Frontend publicado en GitHub Pages y verificado contra la URL pública
      (flujos de alumno y profesor).
- [ ] Proyecto staging separado (bloqueado por la API: crear desde el dashboard).
- [ ] Aviso de privacidad validado por un abogado antes del piloto real.

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
node scripts/ui-smoke.mjs               # flujo del alumno
MODE=teacher node scripts/ui-smoke.mjs  # flujo del profesor (invitación de tutores)

# Prueba E2E de las Edge Functions desplegadas
node scripts/test-functions.mjs
```

## Reglas

- No se usa `service_role` en el frontend.
- No se suben `.env` ni datos reales.
- La cadena directa de Postgres vive en `.secrets/database-url` (ignorada por git) y solo se usa para migraciones y scripts.
- La seguridad real se implementa con RLS en Supabase.
- El curso actual no se modifica.

## Siguiente paso

Crear el proyecto staging desde el dashboard ([supabase.com/dashboard/new](https://supabase.com/dashboard/new))
y aplicar las migraciones con `db push`. Validar el aviso de privacidad con un
abogado antes de cargar datos reales y de ampliar el piloto.
