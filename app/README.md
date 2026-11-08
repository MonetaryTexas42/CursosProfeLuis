# Plataforma ECOEMS · App

Base local de Fase 1. Proyecto Supabase: `ioikcrdxneuydylyhvwi` (staging por crear).

## Producción

- **App (GitHub Pages):** https://monetarytexas42.github.io/CursosProfeLuis/
- **Reproductor del curso:** https://monetarytexas42.github.io/CursosProfeLuis/curso/
- El repo es público (requisito de Pages en plan gratuito). Sin secretos versionados.

## Cómo está armada

| Ruta | Qué es |
|---|---|
| `/` | Portal: login por rol (alumno/profesor/tutor), paneles y administración |
| `/curso/` | Reproductor del curso (la plataforma anterior): materias, unidades, tareas, planificación, taller vocacional, XP |
| `/herramientas-lectura.html`, `/herramientas-matematicas.html` | Herramientas embebidas en el reproductor |

**Integración y seguridad:**
- El contenido del curso **ya no viaja en archivos públicos** (`data.js` quedó fuera del build): el reproductor lo descarga desde Supabase y **RLS solo se lo entrega a alumnos con sesión activa** (`0009_student_published_content.sql`).
- `/curso/` sin sesión redirige al portal (puerta `login-gate.js`).
- La sesión del portal se comparte con el reproductor (mismo origen).
- Los intentos y el progreso por unidad siguen regidos por asignaciones activas.
- El progreso local (localStorage) del reproductor se conserva como respaldo temporal, pendiente de sincronizar con Supabase (Fase 2).

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
      (flujos de alumno, curso, profesor y admin).
- [x] Altas de alumnos desde el panel del profesor y del admin (contraseña
      temporal entregada una vez).
- [x] Sincronización de progreso del reproductor (XP, racha, unidades)
      hacia `student_stats` y `xp_events` con `app_sync_player_state` (`0010`).
- [x] Herramientas de lectura y matemáticas protegidas por sesión
      (`tool-gate.js`): los anónimos son redirigidos al portal.
- [x] Asistencia diaria por grupo (sesión + estados por alumno) desde el
      panel del profesor.
- [x] Avisos a tutores por WhatsApp (enlace `wa.me` + registro en
      `guardian_messages`; canal `whatsapp` habilitado en `0010`).
- [x] Dashboard del staff (`0012`): tarjetas de estadísticas, actividad de
      los últimos 7 días, recordatorios automáticos (consentimientos
      pendientes, alumnos inactivos, asistencia sin registrar, unidades por
      activar/cerrar) y feed de actividad reciente.
- [x] Detalle por alumno (avance por unidad, intentos, precisión y actividad).
- [x] Activación de unidades por tarjetas (activar con cierre opcional,
      cerrar y reabrir desde la tarjeta).
- [x] Modo claro/oscuro con persistencia.
- [x] Panel del staff de una sola página: barra lateral colapsable (se
      recuerda en el navegador), materias plegables y asistencia dinámica
      por fecha con "todos presentes", botones de estado y contadores.
- [x] Tareas reales (`0015`): creación por grupo/materia/unidad, fecha de
      entrega, puntaje, entregas por alumno (pendiente/entregada/tarde) y
      calificación con retroalimentación.
- [x] Registro de actividades (`0015`): línea de tiempo de ejercicios,
      unidades completadas, entregas, calificaciones y observaciones, con
      filtros por tipo.
- [ ] Aviso de privacidad validado por un abogado antes del piloto real.
- [ ] Mover el progreso histórico de localStorage a Supabase (opcional: el
      reproductor ya sincroniza en tiempo real; localStorage queda de respaldo).

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
MODE=teacher node scripts/ui-smoke.mjs  # flujo del profesor (tareas, asistencia, actividad)
MODE=admin ADMIN_PASSWORD=... node scripts/ui-smoke.mjs  # flujo del admin
MODE=curso node scripts/ui-smoke.mjs    # reproductor protegido

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
