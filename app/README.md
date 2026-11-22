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
| `/curso/` | Reproductor del curso (la plataforma anterior): materias, unidades, tareas, planificación, XP y accesos a evaluación y orientación |
| `/guia-examen-espanol.html` | Guía imprimible del examen final de Español (13 temas, 136 preguntas y 117 ejercicios) |
| `/vocacional.html` | Taller vocacional como página propia: RIASEC, escuelas, universidades, planes/técnicas y guía de decisión |
| `/herramientas-lectura.html`, `/herramientas-matematicas.html` | Herramientas embebidas en el reproductor |

**Integración y seguridad:**
- El contenido del curso **ya no viaja en archivos públicos** (`data.js` quedó fuera del build): el reproductor lo descarga desde Supabase y **RLS solo se lo entrega a alumnos con sesión activa** (`0009_student_published_content.sql`).
- `/curso/` sin sesión redirige al portal (puerta `login-gate.js`).
- La sesión del portal se comparte con el reproductor (mismo origen).
- Los intentos y el progreso por unidad siguen regidos por asignaciones activas.
- El progreso local (localStorage) del reproductor se conserva como respaldo temporal, pendiente de sincronizar con Supabase (Fase 2).

### Publicar el frontend

El despliegue ya **no** se hace con `git push -f`. El workflow
[`.github/workflows/ci.yml`](../.github/workflows/ci.yml) construye el
frontend, valida el aviso de privacidad y el recibo PDF, verifica migraciones
contra staging, corre la suite RLS y publica en `gh-pages`. En `main`, la falta
de `STAGING_DATABASE_URL` detiene el workflow antes de publicar. Cada
publicación deja la etiqueta `deploy-<sha>` y pasa un health check.

`STAGING_DATABASE_URL` en GitHub debe apuntar al **pooler IPv4** de Supabase
(`aws-<índice>-<región>.pooler.supabase.com:6543`; el índice se copia del
diálogo Connect, no se deduce de la región). La conexión directa
`db.<ref>.supabase.co:5432` solo resuelve AAAA y GitHub Actions no tiene salida
IPv6: el primer intento falló con `ENETUNREACH`. La conexión directa sigue
usándose solo en local para respaldos y restauración.

**Estado final (22 nov 2026):** con autorización explícita se aplicaron
`0041`/`0042` en producción tras un respaldo cifrado y se activó
`final_exam_spanish_enabled=true`. Después se publicaron los accesos en
`/curso/` (`deploy-0aeb7e7`, run `45060761193`), la vista de resultados del
examen (`deploy-5207118`, run `45061693062`) y, por último, la vista previa del
profesorado y la página propia del vocacional (`deploy-f4bc229`, run
`45074991966`; build de Pages `45075032798`). Al final se añadió el acceso en
el sidebar del staff (`deploy-a5630a9`, run `45076042391`; Pages `45076128140`)
y la ampliación del taller vocacional (`deploy-f83ebb9`, run `45084537069`;
Pages `45084579025`). Todos los runs terminaron en SUCCESS.

Producción y staging quedaron en **43/43 migraciones, 96 políticas, 116
funciones y 0 `SECURITY DEFINER` sin `search_path`**. El examen final de Español
sigue activo en producción con 13 secciones y 136 preguntas; la guía imprimible
está siempre disponible en `/guia-examen-espanol.html`. El taller vocacional
reutiliza el material legacy sin escribir en la base: ahora tiene 60 preguntas
RIASEC, 8 de contexto, 47 escuelas (incluidas 3 militares), expos con fuentes
citadas, colegiaturas de referencia y guía para decidir por ti y en familia.
RIASEC, contexto y checklist viven en `localStorage`.

En `/curso/` hay un menú lateral «Evaluación y orientación» y tarjetas en el
inicio que abren `../#examen`, `../vocacional.html` y la guía imprimible. Los
recursos estáticos del curso se versionaron con `?v=4` para evitar caché.

En el panel del staff (profesor y administrador) hay una pestaña **🎓 Examen
final** con sesiones, estado, aciertos, tiempo, puntaje y promedio, y el botón
**«Vista previa del examen →»**. La vista previa usa `app_preview_final_exam`,
restringida por `app_is_staff()`: muestra el banco real con clave y
explicaciones, sin crear sesión ni guardar respuestas. Alumnos y tutores reciben
HTTP 403. El test vocacional oficial sigue en la ficha del alumno; el taller
ampliado tiene su propia página y permanece privado en el dispositivo. El
sidebar del staff incluye el grupo **Orientación** con **🧭 Taller vocacional**,
que abre `/vocacional.html` sin incrustar el taller en el panel.

Verificación externa: `/`, `/vocacional.html`, `/curso/`,
`guia-examen-espanol.html` y `privacidad.html` responden 200. Bundles actuales
`main-BtBvmvWS.js` (vista previa, «Orientación» y «Taller vocacional»),
`vocacional-Dt1CGBmS.js` (gate de sesión), `vocational-DjbRL5rI.js`
(«Mejores opciones para ti», «Expos y fechas», coincidencias, colegiaturas y
decisión familiar) y `vocational-1XDN4CCT.css`. Aviso `v3-2026` con hash
`85d13859…f740b` y guía con hash `966fb846…d4094` sin cambios. Evidencia
detallada en `AUDITORIA_ECOEMS/evidencias/produccion-cierre-final.json`
(§ `cierre_0043`, `sidebar_staff` y `taller_vocacional_v2`) y en
`AUDITORIA_ECOEMS/12_PRUEBAS_PENDIENTES.md` §8.8 (OPS-68).

```bash
# Publicación normal: commit en main
git push origin main

# Rollback: volver a publicar una etiqueta anterior
git checkout deploy-<sha>
```

El runbook completo —secretos, rollback y verificación— está en
[`docs/despliegue.md`](docs/despliegue.md). Para probar el build en local:

```bash
cd app/frontend
npm run build -- --base=/CursosProfeLuis/
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
- [x] Login de alumno, profesor y tutor (tutor: invitación por correo, sin enlace en la UI).
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
- [x] Invitación de tutores **por correo** (`SEC-06`): `invite-guardian`
      encola `guardian_invite` en `email_outbox` y `process-email-outbox`
      drena la cola con token, reintentos y auditoría sin enlaces. En staging
      el proveedor es `log`, por lo que no se envía correo real.
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
- [x] Ficha visual del alumno en ventana emergente: score animado, XP,
      racha, asistencia, precisión, avance por materia, unidades asignadas,
      actividad reciente, perfil profesional editable y observaciones.
- [x] Activación de unidades **eligiendo a qué alumnos se activa cada una**:
      al activar (o con "Alumnos" en una unidad activa) se abre una ventana
      con la lista del grupo, botones Todos/Ninguno, fecha de cierre opcional;
      los excluidos quedan con `student_unit_overrides` cerradas.
- [x] Tests del alumno (`0016`): apartado **Mi orientación** con test de
      personalidad (15 preguntas, escala de 5 botones, avance automático al
      responder) y test de orientación vocacional de **8 pasos** (contenido
      que ve —novelas, anime, deportes, videojuegos…—, materias favoritas,
      actividades, aptitudes, día de trabajo ideal, ambiente, valores y
      futuro) con botones de selección múltiple y elección final de carrera.
      Se guardan con `app_save_student_test` y el personal ve los resultados
      (rasgos, carreras sugeridas, intereses) en la ficha.
- [x] Finanzas (`0020`–`0021`): pestaña **Pagos** para el personal con
      resumen mensual, estado de cuentas por alumno (plan semanal, quincenal,
      mensual, contado, beca u otro + cuota), registro de pagos (monto,
      fecha, método y concepto) e historial. El **tutor ve su propio estado
      de cuenta** (solo lectura); los alumnos **no** tienen acceso a pagos.
- [x] Pagos con trazabilidad (`0029`, FUN-02): periodo cubierto, folio
      `REC-<año>-<n>`, estado (`paid`/`partial`/`voided`), clave de
      idempotencia, detección de duplicados, estado de cuenta por alumno
      (`al corriente`/`parcial`/`pendiente`/`vencido`/`beca`) y anulación con
      motivo y auditoría. El historial no se borra: se anula. El botón
      **Recibo** descarga un PDF con folio, periodo e importe (sin notas
      internas); los anulados llevan sello de anulación.
- [x] Panel del tutor (`FUN-01`): avance, calificaciones, asistencia, tareas,
      observaciones `family` y estado de cuenta de sus hijos, todo en solo
      lectura y con estados vacíos.
- [x] Perfil vocacional curado (`0030`, PRIV-03): la familia usa
      `student_guidance` (intereses, aptitudes, fortalezas, carrera de
      interés); no lee `student_profiles` crudo ni las notas internas.
- [x] Desactivación real (`0028`, SEC-04): `deactivate-user` banea la cuenta
      en Auth, guarda fecha, actor y motivo, y audita la reactivación.
- [x] Aviso de privacidad `v3-2026` (`0031`): finalidad educativa del perfil
      vocacional, resumen curado para el tutor y notas internas reservadas al
      personal.
- [x] Vinculación de cuentas existentes (`0017`–`0019`): en el alta hay una
      casilla "el alumno ya tiene cuenta"; con su correo se reutiliza su
      cuenta (sin duplicar acceso), se confirma su correo y se crea solo la
      ficha de alumno. El alumno entra con su correo en la pestaña Alumno.
- [x] Detector de cuentas externas ("colados"): el admin ve en Usuarios las
      cuentas creadas fuera de la plataforma (sin perfil ni grupo) y puede
      **bloquearlas/desbloquearlas**; las cuentas sin perfil no ven nada
      (la app cierra su sesión) y RLS no les entrega contenido.
      ⚠️ Recomendado: desactivar "Allow new users to sign up" en
      Supabase → Authentication → Providers → Email para cerrar el
      autorregistro por completo.
- [x] Pulido de UX (`v8`): panel del alumno con héroe y tarjetas de unidades
      por materia; sección de pagos con tablero de cuentas, selector de plan
      y método por botones; ficha con campos derivados de los tests en solo
      lectura; scores de carreras diferenciados (peso por especificidad, ya
      no todo 100%); **reintento de preguntas del quiz** (contador de intento
      real + botón "Reintentar", `0022`); el reproductor del curso ya no
      muestra las secciones de gestión antiguas a los alumnos.
- [x] Cerrar y reabrir unidades desde la tarjeta.
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
- [x] Fase 3 preparada (sin aplicar): CORS por entorno (`SEC-05`), invitación
      por correo (`SEC-06`), auditoría y runbooks (`SEC-07`, `OPS-06/07`),
      migraciones `0032`–`0038` (integridad de asignaciones, anonimización,
      XP en servidor, reglas de completado, intentos, ARCO y baneo), reglas e
      intentos desde RPC (`COD-02`), recuperación de contraseña (`FUN-06`),
      paginación con totales (`FUN-09`), pestaña de auditoría (`FUN-10`),
      limpieza de `localStorage` (`PRIV-04`), diálogo ARCO (`PRIV-06`) y
      accesibilidad (`UX-01/02`). La suite RLS tiene 135 verificaciones y
      `staging-check.mjs` verifica 40 migraciones, 41 tablas, 93 políticas y
      al menos 53 funciones `SECURITY DEFINER`.
- [x] Aplicar `0032`–`0040` en staging, desplegar las Edge Functions con
      `ALLOWED_ORIGIN`, correr la suite RLS y `staging-check.mjs` sin avisos.
      Producción sigue intacta y solo se verificó en lectura.
- [x] Implementar y verificar en staging el procesador de `email_outbox`
      (`scripts/test-email-outbox.mjs`). El cron requiere secretos del repo.
- [ ] Aviso de privacidad validado por un abogado antes del piloto real y
      correo institucional de contacto para solicitudes ARCO.
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

# Respaldo cifrado de la base (AES-256-GCM, excluye auth.*, .backups/, ignorado por git)
DATABASE_URL="$(cat .secrets/database-url)" node scripts/backup-db.mjs

# Restauración con confirmación explícita y respaldo previo automático
DATABASE_URL="$(cat .secrets/staging-database-url)" \
  node scripts/restore-db.mjs .backups/<archivo>.enc --confirm=restore

# Comparar migraciones aplicadas con los archivos locales (solo lectura)
DATABASE_URL="$(cat .secrets/staging-database-url)" node scripts/verify-migrations.mjs

# Prueba UI con Chrome headless (requiere la app servida en :5173)
node scripts/ui-smoke.mjs               # flujo del alumno
MODE=teacher node scripts/ui-smoke.mjs  # flujo del profesor (tareas, asistencia, actividad)
MODE=admin ADMIN_PASSWORD=... node scripts/ui-smoke.mjs  # flujo del admin
MODE=curso node scripts/ui-smoke.mjs    # reproductor protegido

# Los modos de alumno y profesor recorren los tests y la ventana de
# activación en modo lectura. Para validar escrituras reales (guardar
# tests del alumno y activar una unidad de verdad) usa TEST_WRITE=1 y
# limpia después los datos de prueba (asignación creada y perfil del
# alumno).
TEST_WRITE=1 APP_URL=https://monetarytexas42.github.io/CursosProfeLuis/ MODE=student node scripts/ui-smoke.mjs
TEST_WRITE=1 APP_URL=https://monetarytexas42.github.io/CursosProfeLuis/ MODE=teacher node scripts/ui-smoke.mjs

# Prueba E2E de las Edge Functions desplegadas (solo staging)
APP_ENV=staging node scripts/test-functions.mjs

# Verificación de staging (solo lectura)
DATABASE_URL="$(cat .secrets/staging-database-url)" \
VITE_SUPABASE_URL="https://<REF_STAGING>.supabase.co" \
  node scripts/staging-check.mjs

# Suite de RLS negativa (solo lectura, 135 verificaciones)
DATABASE_URL="$(cat .secrets/staging-database-url)" \
  node scripts/run-rls-tests.mjs

# Validar el aviso de privacidad versionado
node scripts/privacy-doc.mjs --check
```

## Reglas

- No se usa `service_role` en el frontend.
- No se suben `.env` ni datos reales.
- La cadena directa de Postgres vive en `.secrets/database-url` (ignorada por git) y solo se usa para migraciones y scripts.
- La seguridad real se implementa con RLS en Supabase.
- El curso actual no se modifica.

## Siguiente paso

Crear el proyecto staging desde el dashboard ([supabase.com/dashboard/new](https://supabase.com/dashboard/new))
y aplicar las migraciones con `db push`. El procedimiento completo, incluida la
configuración de `ALLOWED_ORIGIN`, está en [docs/staging.md](docs/staging.md);
los controles de la Fase 3 en [docs/seguridad.md](docs/seguridad.md) y
[docs/monitoreo.md](docs/monitoreo.md). Validar el aviso de privacidad con un
abogado antes de cargar datos reales y de ampliar el piloto.
