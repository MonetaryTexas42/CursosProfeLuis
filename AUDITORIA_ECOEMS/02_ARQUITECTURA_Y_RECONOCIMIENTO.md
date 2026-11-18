# 02 · Arquitectura y reconocimiento

## 1. Vista general

La Plataforma ECOEMS es una **aplicación web estática** (Vite + JavaScript vanilla) que se publica en GitHub Pages y usa **Supabase** como backend gestionado: PostgreSQL, PostgREST, Auth, Storage (no usado) y Edge Functions (Deno). No hay servidor propio ni API intermedia; el navegador habla directamente con Supabase usando la **anon key** pública y la sesión del usuario.

```
┌──────────────────────────────────────────────────────────────────┐
│                        Navegador del usuario                      │
│                                                                  │
│  ┌────────────────────────┐      ┌────────────────────────────┐  │
│  │ Portal (SPA)           │      │ Curso (reproductor)        │  │
│  │ frontend/src/ui/app.js │      │ public/curso/js/*.js       │  │
│  │ - login por rol        │      │ - login-gate.js            │  │
│  │ - dashboards           │      │ - sistema2.js              │  │
│  │ - unidades/quizzes     │      │ - app.js (legacy)          │  │
│  │ - ficha/pagos/tests    │      │ - localStorage             │  │
│  └───────────┬────────────┘      └─────────────┬──────────────┘  │
│              │                                 │                 │
│              └──────────────┬──────────────────┘                 │
│                             │ anon key + JWT                     │
└─────────────────────────────┼────────────────────────────────────┘
                              │ HTTPS
              ┌───────────────▼────────────────┐
              │            Supabase            │
              │                                │
              │  Auth (email/password)         │
              │  PostgREST (REST + RLS)        │
              │  PostgreSQL (38 tablas)        │
              │  Edge Functions (Deno)         │
              │   - admin-create-student       │
              │   - admin-create-teacher       │
              │   - admin-reset-password       │
              │   - deactivate-user            │
              │   - invite-guardian            │
              │   - guardian-consent           │
              └────────────────────────────────┘
```

### 1.1. Principios de diseño observados

1. **Backend gestionado, sin servidor propio.** Toda la lógica sensible vive en PostgreSQL (RLS + RPC) y en Edge Functions.
2. **Autorización en la base de datos.** El frontend no es la fuente de verdad; las políticas RLS y las RPC `SECURITY DEFINER` deciden.
3. **Dos experiencias separadas.** Portal (SPA con dashboards) y curso (reproductor con contenido). Comparten Supabase y sesión.
4. **Contenido versionado.** `units` + `unit_versions` con `content` en JSONB; las asignaciones apuntan a una versión concreta.
5. **Progreso por asignación.** `unit_assignments` (grupo) + `student_unit_overrides` (alumno) + `unit_progress` (avance).
6. **Roles explícitos.** `admin`, `teacher`, `student`, `guardian`.

---

## 2. Stack técnico

| Capa | Tecnología | Versión / nota |
|---|---|---|
| Frontend | JavaScript vanilla (ESM) | Sin framework |
| Build | Vite | `^8.3.5` |
| Cliente Supabase | `@supabase/supabase-js` | `^2.118.0` |
| Estilos | CSS propio | 4,027 líneas, temas claro/oscuro |
| Backend | Supabase | PostgreSQL + PostgREST + Auth |
| Funciones | Deno / TypeScript | 6 Edge Functions |
| Scripts | Node.js ESM | `pg` para SQL, Chrome DevTools Protocol para E2E |
| Hosting | GitHub Pages | Rama `gh-pages` |
| Repositorio | GitHub | `MonetaryTexas42/CursosProfeLuis` |

### 2.1. Dependencias declaradas

`app/frontend/package.json`:

```json
{
  "dependencies": { "@supabase/supabase-js": "^2.118.0" },
  "devDependencies": { "vite": "^8.3.5" }
}
```

`app/scripts/package.json`:

```json
{
  "dependencies": { "pg": "^8.13.1" }
}
```

No hay `package-lock.json` versionado en el repositorio observado, ni configuración de ESLint, Prettier, TypeScript o test runner.

### 2.2. Variables de entorno del frontend

`app/frontend/.env.example`:

| Variable | Uso |
|---|---|
| `VITE_SUPABASE_URL` | URL del proyecto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Clave pública |
| `VITE_STUDENT_EMAIL_DOMAIN` | Dominio sintético para alumnos (`alumnos.ecoems.mx` por defecto) |
| `VITE_APP_ENV` | Etiqueta de entorno (`local`, `producción`, …) |

`app/frontend/.env` (observado, sin reproducir valores) apunta al proyecto `ioikcrdxneuydylyhvwi` y declara `VITE_APP_ENV=producción`.

### 2.3. Variables de entorno de las Edge Functions

| Variable | Uso |
|---|---|
| `SUPABASE_URL` | URL del proyecto |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave secreta para Auth Admin y escritura |
| `ALLOWED_ORIGIN` | Origen permitido para CORS (por defecto `*`) |
| `STUDENT_EMAIL_DOMAIN` | Dominio sintético de alumnos |

---

## 3. Estructura del repositorio

```
Plataforma/
├── Fase-0/                         # Especificación y documentos de diseño
│   ├── 01-...md
│   ├── 02-permisos-rls.md
│   ├── 05-privacidad-y-consentimiento.md
│   ├── 06-criterios-de-aceptacion.md
│   └── 07-ambientes-y-respaldos.md
├── app/
│   ├── frontend/
│   │   ├── index.html
│   │   ├── vite.config.*            # No observado
│   │   ├── .env / .env.example
│   │   ├── src/
│   │   │   ├── main.js
│   │   │   ├── styles.css
│   │   │   ├── lib/supabase.js
│   │   │   └── ui/app.js            # 7,072 líneas
│   │   ├── public/
│   │   │   ├── curso/
│   │   │   │   ├── index.html
│   │   │   │   └── js/{login-gate,sistema2,app}.js
│   │   │   ├── herramientas-lectura.html
│   │   │   ├── herramientas-matematicas.html
│   │   │   └── tool-gate.js
│   │   └── dist/                    # Build + repo Git anidado (gh-pages)
│   ├── supabase/
│   │   ├── .temp/linked-project.json
│   │   ├── migrations/              # 22 archivos
│   │   ├── functions/               # 6 funciones + _shared
│   │   ├── seed/content-v1.json     # 1.1 MB, 60 unidades
│   │   └── tests/                   # 3 pruebas SQL
│   ├── scripts/                     # smoke, backup, restore, seed, test-functions
│   ├── .secrets/                    # database-url, test-users, staging password
│   ├── .backups/                    # backup JSON sin cifrar
│   └── README.md
├── README.md
└── .gitignore
```

### 3.1. Entry points

| Entry point | Propósito |
|---|---|
| `frontend/index.html` → `src/main.js` → `initApp()` | Portal principal |
| `frontend/public/curso/index.html` → `login-gate.js` | Curso con sesión |
| `frontend/public/herramientas-lectura.html` | Herramienta embebida |
| `frontend/public/herramientas-matematicas.html` | Herramienta embebida |
| `supabase/functions/*/index.ts` | Endpoints Deno |
| `scripts/*.mjs` | Operación y pruebas |

### 3.2. Scripts operativos

| Script | Función | Riesgo |
|---|---|---|
| `ui-smoke.mjs` | E2E con Chrome headless; 4 suites (alumno, profesor, admin, tests) | `TEST_WRITE=1` escribe en la BD configurada |
| `test-functions.mjs` | Prueba E2E de Edge Functions desplegadas | Usa credenciales de `.secrets/test-users.txt` |
| `backup-db.mjs` | Vuelca todas las tablas a JSON | Sin cifrar, incluye `auth.users` |
| `restore-db.mjs` | Restaura un JSON | `truncate ... cascade` sin confirmación |
| `seed-content.mjs` | Carga contenido y settings | Escribe en la BD |
| `run-sql-test.mjs` | Ejecuta pruebas SQL | Requiere `DATABASE_URL` |
| `restore-alexa-tests.mjs` | Restaura datos de prueba | Escribe en la BD |

---

## 4. Modelo de datos (resumen)

### 4.1. Núcleo académico

```
academic_years ──< terms
academic_years ──< groups ──< students ──< student_guardians >── guardians
                    │            │
                    │            └──< unit_progress >── unit_assignments
                    │                                      │
                    └──< unit_assignments >── units ──< unit_versions
                                                          │
                                                          └── content (JSONB)
```

### 4.2. Evaluación y actividad

- `exercise_attempts`, `quiz_attempts`: intentos por asignación y versión.
- `game_sessions`, `reading_assessments`: actividades lúdicas y lectura.
- `xp_events`, `student_stats`, `badges`, `student_badges`: gamificación.
- `assessments`, `grades`, `task_status`, `observations`: evaluación formal y notas.
- `attendance_sessions`, `attendance`: asistencia.
- `guardian_messages`, `email_outbox`: comunicación.
- `audit_log`: auditoría.

### 4.3. Administración

- `profiles`: espejo de `auth.users` con rol, estado y bandera de cambio de contraseña.
- `settings`: parámetros clave/valor (incluye `privacy_document_version`).
- `student_profiles`: intereses, aptitudes, fortalezas, debilidades, notas vocacionales, personalidad.
- `student_billing`, `payments`: finanzas.
- `tasks`, `task_submissions`: tareas y entregas.
- `privacy_consents`: consentimientos por alumno, tutor y versión.

### 4.4. Inventario completo

38 tablas en `public`:

`academic_years`, `assessments`, `attendance`, `attendance_sessions`, `audit_log`, `badges`, `email_outbox`, `exercise_attempts`, `game_catalog`, `game_sessions`, `grades`, `groups`, `guardian_messages`, `guardians`, `observations`, `payments`, `privacy_consents`, `profiles`, `quiz_attempts`, `reading_assessments`, `settings`, `student_badges`, `student_billing`, `student_guardians`, `student_profiles`, `student_stats`, `student_unit_overrides`, `students`, `subjects`, `task_status`, `task_submissions`, `tasks`, `terms`, `unit_assignments`, `unit_progress`, `unit_versions`, `units`, `xp_events`.

---

## 5. Roles y capacidades

| Rol | Puede | No puede |
|---|---|---|
| **Admin** | Todo: usuarios, grupos, contenido, finanzas, configuración, auditoría | — |
| **Profesor** | Ver y operar sus grupos; crear alumnos; activar unidades; calificar; asistencia; pagos de sus alumnos | Ver otros grupos; cambiar configuración global; crear profesores |
| **Alumno** | Ver su ficha, unidades activadas, progreso, tests, pagos (no), consentimiento (no) | Ver contenido no activado; ver otros alumnos; escribir contenido |
| **Tutor** | Ver hijos vinculados, su plan y pagos (solo lectura), aceptar/revocar consentimiento | Ver calificaciones/asistencia en la UI (aunque RLS lo permita); editar datos |

### 5.1. Login por rol

| Modo | Credencial | Nota |
|---|---|---|
| Alumno | `usuario` → `usuario@alumnos.ecoems.mx` | Dominio sintético configurable |
| Profesor | Correo real | — |
| Tutor | Correo real | Entra con magic link o contraseña |

`app.js:684-694` decide el correo según `state.mode`. `toStudentEmail` (`supabase.js:19-26`) normaliza el usuario.

---

## 6. Flujo de autenticación y sesión

```
1. Usuario elige modo (alumno / profesor / tutor).
2. Ingresa credenciales.
3. supabase.auth.signInWithPassword({ email, password })
4. handleSession(session) → consulta profiles por id.
5. Si profile.active = false → signOut y error.
6. Si must_change_password = true → pantalla de cambio.
7. Si no → loadDashboard(profile) según rol.
8. onAuthStateChange escucha SIGNED_IN / SIGNED_OUT / TOKEN_REFRESHED.
```

Puntos observados:

- `handleSession` consulta `profiles` con `select('id, role, full_name, username, email, active, must_change_password')` (`app.js:738-741`).
- `signOut` limpia estado y vuelve al login (`app.js:7028-7040`).
- El reproductor del curso usa su propia puerta (`login-gate.js`) y comparte la sesión de Supabase.
- `tool-gate.js` exige sesión para las herramientas embebidas.

---

## 7. Flujo de contenido y activación

```
Profesor                          Base de datos                     Alumno
   │                                   │                              │
   │ 1. Elige unidad + versión         │                              │
   ├──────────────────────────────────>│                              │
   │    insert unit_assignments        │                              │
   │    (group_id, unit_id, version)   │                              │
   │                                   │                              │
   │ 2. Excluye alumnos                │                              │
   ├──────────────────────────────────>│                              │
   │    upsert student_unit_overrides  │                              │
   │    status = 'closed'              │                              │
   │                                   │                              │
   │                                   │ 3. login-gate.js descarga    │
   │                                   │<─────────────────────────────┤
   │                                   │    units, unit_versions,     │
   │                                   │    assignments, overrides    │
   │                                   │                              │
   │                                   │ 4. Filtra en cliente         │
   │                                   │    allowed[unit_id] = true   │
   │                                   │                              │
   │                                   │ 5. Renderiza solo permitidas │
   │                                   │─────────────────────────────>│
```

**Observación clave:** el paso 4 ocurre en el navegador. La base de datos ya entregó todo el contenido publicado (ver `SEC-01`).

---

## 8. Flujo de estudio y evaluación

```
Alumno abre unidad
  → openUnit(assignmentId)                       app.js:4470
  → select unit_versions.content                 (RLS)
  → rpc app_start_unit(assignment_id)            (crea/actualiza unit_progress)
  → renderiza secciones, ejercicios, quiz, reto

Responde ejercicio
  → rpc app_record_exercise_attempt(...)         0007
  → servidor lee correctIndex/answer de content
  → calcula is_correct, attempt_no, accuracy
  → actualiza unit_progress

Responde quiz
  → rpc app_submit_quiz_answer(...)              0022
  → servidor evalúa y devuelve explicación
  → permite reintento; devuelve attempt_no

Completa unidad
  → rpc app_complete_unit(assignment_id)         0004
  → marca status = completed
  → (no exige intentos ni precisión mínima)
```

---

## 9. Flujo de altas

### 9.1. Alta de alumno

Dos caminos:

1. **Edge Function `admin-create-student`** (`functions/admin-create-student/index.ts`):
   - `requireCaller` valida sesión y perfil activo.
   - `assertAdminOrTeacherOfGroup` valida permiso sobre el grupo.
   - Crea usuario en Auth con `email_confirm: true` y contraseña temporal.
   - Crea `profiles`, `students`, `student_profiles`.
   - Registra auditoría.
2. **RPC `app_link_student_account`** (`0018`/`0019`):
   - Para alumnos que ya tienen cuenta.
   - Busca por correo, fuerza `email_confirmed_at`, vincula a la ficha.
   - No verifica titularidad (ver `SEC-02`).

### 9.2. Alta de profesor

`admin-create-teacher` (`functions/admin-create-teacher/index.ts`): solo admin; crea usuario con `email_confirm: true` y perfil `teacher`.

### 9.3. Alta de tutor

`invite-guardian` (`functions/invite-guardian/index.ts`):
- Valida permiso sobre el alumno.
- Crea o reutiliza cuenta de Auth.
- Crea `guardians` y `student_guardians`.
- Genera magic link y arma un enlace de WhatsApp (`wa.me`).
- Registra auditoría.

---

## 10. Edge Functions

| Función | Rol requerido | Acceso a `service_role` | Propósito |
|---|---|---|---|
| `admin-create-student` | Admin o profesor del grupo | Sí | Alta completa de alumno |
| `admin-create-teacher` | Admin | Sí | Alta de profesor |
| `admin-reset-student-password` | Admin o profesor del alumno | Sí | Contraseña temporal |
| `deactivate-user` | Admin (y reglas) | Sí | Activar/desactivar perfil |
| `invite-guardian` | Admin o profesor del alumno | Sí | Vincular tutor y magic link |
| `guardian-consent` | Tutor | Sí | Registrar/revocar consentimiento |

Módulos compartidos:

- `_shared/auth.ts`: `requireCaller`, `adminClient`, `getStudent`, `assertAdminOrTeacherOfGroup`, `assertAdminOrTeacherOfStudent`, `findAuthUserByEmail`, `audit`.
- `_shared/http.ts`: CORS, `HttpError`, `jsonResponse`, `readJson`, `handleError`, `handleOptions`, `requestContext`.
- `_shared/validation.ts`: `asString`, `asEmail`, `asUuid`, `asDate`, `asBoolean`, `optionalString`, `normalizeUsername`, `defaultUsername`, `studentEmail`.

---

## 11. Mapa de dependencias entre módulos

```
frontend/src/main.js
  └── frontend/src/ui/app.js
        ├── frontend/src/lib/supabase.js
        │     └── @supabase/supabase-js
        ├── frontend/src/styles.css
        └── Edge Functions (invoke)
              ├── admin-create-student
              ├── admin-create-teacher
              ├── admin-reset-student-password
              ├── deactivate-user
              ├── invite-guardian
              └── guardian-consent

frontend/public/curso/js/login-gate.js
  ├── @supabase/supabase-js (CDN)
  ├── buildData() (global)
  ├── sistema2.js
  └── app.js (legacy)

scripts/ui-smoke.mjs
  ├── Chrome DevTools Protocol
  └── .secrets/test-users.txt

scripts/backup-db.mjs / restore-db.mjs
  └── pg + .secrets/database-url
```

---

## 12. Despliegue observado

`app/README.md:28-36` describe el proceso manual:

```bash
cd app/frontend
npm run build -- --base=/CursosProfeLuis/
cd dist
git init -b gh-pages
git add -A
git commit -m "..."
git push -f https://github.com/MonetaryTexas42/CursosProfeLuis.git gh-pages
```

Observaciones:

- `dist/` es un repositorio Git anidado en rama `gh-pages`, con remoto `origin` al mismo repositorio.
- El último commit observado en `dist` es `2114eba` (“Pule UI de alumno y pagos…”).
- El repositorio principal está en `main`, commit `40b01a4` (“README: pulido de UX v8”).
- No hay workflow de GitHub Actions, ni verificación de build, ni rollback automatizado.
- La versión visible en la cabecera es `v8-pulido` (`app.js`).

---

## 13. Servicios externos y terceros

| Servicio | Uso | Datos expuestos |
|---|---|---|
| Supabase | Auth, base de datos, funciones | Todos los datos de la plataforma |
| GitHub Pages | Hosting estático | Bundle público (anon key incluida) |
| jsDelivr | CDN de `@supabase/supabase-js` | Solo código público |
| WhatsApp (`wa.me`) | Compartir magic link de tutores | Enlace de acceso y nombre del alumno en el mensaje |
| Google Fonts / fuentes locales | Tipografía | Sin datos de usuario (revisar `index.html`) |

No se observaron integraciones de pago, correo transaccional propio, analítica ni almacenamiento de archivos.

---

## 14. Deuda arquitectónica visible

| Tema | Descripción | Consecuencia |
|---|---|---|
| Dos frontends | Portal SPA + reproductor legacy con `localStorage` | Duplicación, estados divergentes, deuda |
| Sin capa de servicios | `app.js` llama Supabase directamente en decenas de lugares | Difícil testear y centralizar autorización |
| Sin tipos | JavaScript puro, sin TypeScript ni validación de esquemas | Errores en tiempo de ejecución |
| Sin staging | Un solo proyecto Supabase | Pruebas contra producción |
| Sin CI/CD | Build y push manual | Deriva y publicaciones accidentales |
| Sin observabilidad | No hay logs, métricas ni alertas propias | Incidentes invisibles |
| Contenido en JSONB | Flexible, pero sin validación de esquema | Contenido malformado rompe el reproductor |

---

## 15. Conclusión de arquitectura

La arquitectura es **adecuada para un piloto**: simple, barata, con la seguridad concentrada en PostgreSQL y sin servidores que mantener. Los cimientos son buenos: RLS completa, RPCs con `search_path` fijo, evaluación en servidor y roles claros.

El problema no es la arquitectura, sino **la implementación de una política** (`0009`) y **la ausencia de operación profesional** (staging, CI, respaldos cifrados, monitoreo). Corregir esos puntos no requiere reescribir la plataforma; requiere disciplina de configuración y unas pocas migraciones bien probadas.
