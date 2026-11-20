# Staging

Runbook para crear y mantener un entorno de staging de la Plataforma ECOEMS.
Cierra el hallazgo **OPS-09** y da soporte a la suite de RLS negativa
(**COD-07**).

## 1. Propósito y reglas

Staging existe para probar migraciones, RLS y flujos completos **sin tocar
producción** y **sin datos reales**.

Reglas no negociables:

- **Nunca** apuntar a producción (`ioikcrdxneuydylyhvwi`). Los scripts
  `staging-check.mjs`, `run-rls-tests.mjs` y `seed-staging-users.mjs` abortan
  si detectan ese ref.
- **Solo datos ficticios.** Nada de alumnos, tutores ni pagos reales.
- La `service_role` se usa únicamente en scripts administrativos de staging.
  Nunca en el frontend ni en producción.
- La cadena `postgresql://...` vive en `.secrets/` (ignorado por git).
- Los secretos no se versionan. `config.toml` no contiene secretos.

## 2. Estado actual

| Pieza | Estado |
|---|---|
| `supabase/config.toml` versionado | Listo |
| Suite RLS negativa (`146` checks) | Lista, pendiente de ejecutar |
| Runner `scripts/run-rls-tests.mjs` | Listo |
| Verificador `scripts/staging-check.mjs` | Listo |
| Seed `scripts/seed-staging-users.mjs` | Listo |
| Proyecto staging | **Bloqueado**: falta token/organización o Docker |

Para desbloquearlo hace falta una de estas dos cosas:

1. `SUPABASE_ACCESS_TOKEN` (o `npx supabase login`) y una organización.
2. Docker Desktop para levantar el stack local.

## 3. Opción A · Proyecto cloud (recomendado)

### 3.1. Prerrequisitos

- Cuenta de Supabase con una organización.
- Token de acceso:

```bash
export SUPABASE_ACCESS_TOKEN="sbp_..."   # nunca lo escribas en un archivo versionado
```

- CLI (no hace falta instalarlo global):

```bash
npx --yes supabase@latest --version
```

### 3.2. Crear el proyecto

```bash
cd app

# 1. Ver la organización
npx --yes supabase@latest orgs list

# 2. Crear el proyecto (anota la contraseña de BD; se guarda en 3.3)
npx --yes supabase@latest projects create ecoems-staging \
  --org-id "<ORG_ID>" \
  --db-password "<PASSWORD_FUERTE>" \
  --region us-east-1
```

Anota el **project ref** que devuelve el comando (20 caracteres).

### 3.3. Enlazar y guardar secretos

```bash
cd app

npx --yes supabase@latest link --project-ref "<REF_STAGING>" --workdir "$(pwd)"
# Si pide la contraseña de la base, usa la misma del paso 3.2.

# Cadena directa de staging (Dashboard → Connect → Direct connection).
mkdir -p .secrets
printf '%s' "postgresql://postgres:<PASSWORD>@db.<REF_STAGING>.supabase.co:5432/postgres" \
  > .secrets/staging-database-url
chmod 600 .secrets/staging-database-url
```

Comprueba el ref antes de seguir:

```bash
grep -o 'db\.[a-z0-9]\{20\}\.supabase\.co' .secrets/staging-database-url \
  && echo "ref correcto"
```

### 3.4. Aplicar migraciones

```bash
cd app

# Revisar qué se aplicaría
npx --yes supabase@latest db push --remote --dry-run --workdir "$(pwd)"

# Aplicar
npx --yes supabase@latest db push --remote --workdir "$(pwd)"
```

Si pide la contraseña, usa la del paso 3.2 o exporta `SUPABASE_DB_PASSWORD`
antes de ejecutar.

### 3.5. Aplicar la configuración versionada de Auth

`config.toml` fija `enable_signup = false`, confirmación de correo,
contraseña mínima de 12 y requisitos de composición. **Antes de escribir**,
ajusta `auth.site_url` y `auth.additional_redirect_urls` a la URL del entorno
(en el repo quedan en `localhost` para no empujar producción a staging).
Revisa el diff y hazlo solo sobre staging:

```bash
cd app

npx --yes supabase@latest config diff --workdir "$(pwd)"
npx --yes supabase@latest config push --workdir "$(pwd)" --yes
```

No ejecutes `config push` contra producción sin una revisión explícita: cambia
el comportamiento de Auth para todos los usuarios.

### 3.5.1. Desplegar las Edge Functions

Las funciones que escriben con `service_role` deben existir en staging antes
de probar los flujos:

```bash
cd app

npx --yes supabase@latest functions deploy \
  admin-create-student admin-create-teacher admin-reset-student-password \
  invite-guardian guardian-consent complete-password-change \
  issue-student-link-token redeem-student-link-token \
  deactivate-user \
  --project-ref <REF_STAGING>
```

`complete-password-change` depende de la migración `0025` (columna
`profiles.password_changed_at`). Aplica las migraciones antes de desplegarla.
La función se niega a limpiar `must_change_password` si el cambio de contraseña
en Auth falla.

`issue-student-link-token` y `redeem-student-link-token` dependen de `0026`.
La primera es para staff (requiere JWT); la segunda es pública a propósito,
porque el alumno todavía no tiene contraseña. Nunca marca correos como
confirmados: la cuenta la crea el servidor y el token prueba la titularidad.

`guardian-consent` depende de `0027`: lee de `settings` la versión, la URL y el
hash del aviso, exige la casilla de acuse y revoca todas las versiones activas
del vínculo. La política de inserción directa del tutor se elimina en `0027`;
el consentimiento solo se registra por esta función con `service_role`.

#### Fase 3 · CORS y correo de invitación

Las nueve funciones leen `ALLOWED_ORIGIN` desde `_shared/http.ts`. **Configura
la variable en cada función desplegada**; si falta, se rechazan las peticiones
de navegador con un `Origin` presente (health checks y scripts sin `Origin`
siguen funcionando):

```bash
export ALLOWED_ORIGIN="https://<REF_STAGING>.github.io"   # un solo origen por entorno
npx --yes supabase@latest secrets set ALLOWED_ORIGIN="$ALLOWED_ORIGIN" \
  --project-ref <REF_STAGING>
```

Para producción se usa el origen real (`https://monetarytexas42.github.io`),
nunca `*`. Tras desplegar, `test-functions.mjs` comprueba el rechazo con
`Origin: https://origen-no-autorizado.invalid`.

`invite-guardian` depende de `email_outbox` (0023): encola la plantilla
`guardian_invite` y devuelve `delivery: "email"` y `email_id`. Ni la respuesta
HTTP ni la interfaz entregan `magic_link` ni `whatsapp_share_url` (`SEC-06`).
El procesador que envía la cola es trabajo operativo posterior: en staging
puede verificarse la fila, pero todavía no hay entrega real.

### 3.6. Sembrar datos (orden importante)

El contenido necesita un perfil admin, y la asignación de prueba necesita
contenido. Por eso el seed de usuarios se ejecuta **dos veces**:

```bash
cd app

export SUPABASE_URL="https://<REF_STAGING>.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="<SERVICE_ROLE_DE_STAGING>"
export DATABASE_URL="$(cat .secrets/staging-database-url)"

# 1) Usuarios, grupos, alumnos y tutores (aún sin contenido)
node scripts/seed-staging-users.mjs

# 2) Contenido real de prueba
node scripts/seed-content.mjs

# 3) Segunda pasada: crea la asignación activa del Grupo A
node scripts/seed-staging-users.mjs
```

El seed es idempotente. La contraseña ficticia por defecto es
`StagingDemo-2026!`; se puede cambiar con `STAGING_USER_PASSWORD`.

### 3.7. Verificar el entorno

```bash
cd app

DATABASE_URL="$(cat .secrets/staging-database-url)" \
VITE_SUPABASE_URL="https://<REF_STAGING>.supabase.co" \
  node scripts/staging-check.mjs
```

Debe reportar el ref de staging, **41 tablas, 93 políticas, 38 migraciones y
53 funciones `SECURITY DEFINER`**, además de los objetos de Fase 3: índices
`unit_assignments_group_unit_uq` y `xp_events_source_uq`, triggers de XP y
política de quiz, `data_requests` con tres políticas, y los ajustes
`unit_completion_rules`, `quiz_attempt_policy`, `data_request_sla_days` y
`data_request_email`. Si aparece una advertencia, corrígela antes de probar
RLS.

### 3.8. Ejecutar la suite de RLS negativa

```bash
cd app

DATABASE_URL="$(cat .secrets/staging-database-url)" \
  node scripts/run-rls-tests.mjs
```

La suite expresa el comportamiento **seguro esperado**. Antes de la Fase 1 la
línea base era **6 FAIL** (`SEC-01` y `PRIV-02`). Con `0023`–`0038` aplicadas y
los fixtures de consentimiento, la expectativa es **0 FAIL**. El runner reporta
**135 verificaciones**: 131 pruebas (`checks`) más 4 comprobaciones de identidad
(`roleSanity`). RLS-108–129 cubren la Fase 2 y RLS-130–148 la Fase 3 (el ID
RLS-135 se retiró al fusionar dos pruebas de anonimización). Códigos de salida:

- `0`: todo PASS o SKIP justificado.
- `1`: hay FAIL (comportamiento inseguro).
- `2`: error de configuración o conexión.

### 3.9. Frontend contra staging

```bash
cd app/frontend
cp .env.staging.example .env.staging
# rellena VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY del proyecto de staging
npm run build:staging
```

El build genera `public/env.js` con la URL y la clave pública del modo activo
(ese archivo está ignorado por git). El reproductor del curso y las
herramientas lo leen en vez de llevar URLs de producción incrustadas. Un
`build:staging` sin `.env.staging` falla a propósito para no publicar staging
contra producción.

No uses la `service_role` en el frontend. Si las variables quedan vacías, la
app muestra la pantalla de configuración.

### 3.10. Pruebas E2E contra staging (OPS-03)

Las pruebas que escriben datos solo se ejecutan con `APP_ENV=staging` y se
niegan a arrancar si `VITE_SUPABASE_URL` o `APP_URL` apuntan a producción.
La comprobación ocurre antes de abrir sesión o escribir nada.

```bash
cd app
export APP_ENV=staging
export TEST_WRITE=1
export TEST_STUDENT_CODE=STAGING.ALUMNO.UNO   # fixture ficticio del seed
export APP_URL=http://localhost:5173
# Solo para MODE=teacher y test-functions.mjs: cuenta admin de staging.
# No uses la cuenta real de producción.
export ADMIN_EMAIL="admin.staging@example.test"
export ADMIN_PASSWORD="<contraseña-del-admin-de-staging>"

node scripts/ui-smoke.mjs            # flujo del alumno
MODE=teacher node scripts/ui-smoke.mjs
node scripts/test-functions.mjs
```

`ui-smoke.mjs` guarda el estado previo y, al terminar, borra las asignaciones
de unidad creadas y restaura el perfil de tests del alumno (teardown). Si el
teardown falla, lo reporta y deja el entorno para revisión manual.

`test-functions.mjs` siempre exige `APP_ENV=staging` porque crea invitaciones,
consentimientos y cuentas de prueba. No contiene datos de alumnos reales: el
alumno se localiza con `TEST_STUDENT_CODE`.

Para las pruebas SQL transaccionales:

```bash
cd app
TEST_STUDENT_CODE=STAGING.ALUMNO.UNO \
  DATABASE_URL="$(cat .secrets/database-url)" \
  node scripts/run-sql-test.mjs supabase/tests/0004_progress_rpcs.sql
```

Si la base es producción, el runner se niega salvo que se añada
`ALLOW_PRODUCTION_SQL_TEST=1`. Las pruebas terminan en `ROLLBACK`, pero el
opt-in explícito evita ejecutarlas por accidente.

## 4. Opción B · Stack local con Docker

Útil para iterar sin consumir un proyecto cloud. Requiere Docker Desktop.

```bash
cd app

# 1. Levantar el stack
npx --yes supabase@latest start --workdir "$(pwd)"

# 2. Aplicar migraciones (el seed SQL está desactivado en config.toml)
npx --yes supabase@latest db reset --workdir "$(pwd)"

# 3. Leer credenciales locales
npx --yes supabase@latest status -o env --workdir "$(pwd)"
```

Exporta las credenciales que imprime `status` y siembra igual que en cloud:

```bash
cd app

export SUPABASE_URL="http://127.0.0.1:54321"
export SUPABASE_SERVICE_ROLE_KEY="<SERVICE_ROLE_KEY_LOCAL>"
export DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"

node scripts/seed-staging-users.mjs
node scripts/seed-content.mjs
node scripts/seed-staging-users.mjs
node scripts/staging-check.mjs
node scripts/run-rls-tests.mjs
```

Para detener el stack:

```bash
npx --yes supabase@latest stop --workdir "$(pwd)"
```

## 5. Fixtures que espera la suite

La suite descubre identidades por rol, no por correo. Necesita:

| Rol | Requisito |
|---|---|
| `admin` | Un perfil activo con rol `admin`. |
| `teacher` | Profesor activo dueño de al menos un grupo con alumnos. |
| `teacher_other` | Otro profesor activo, sin el grupo del alumno 1. |
| `student1` | Alumno activo **con** una asignación activa y visible. |
| `student2` | Alumno activo **sin** asignación activa. |
| `guardian1` | Tutor activo vinculado a `student1`, **sin** consentimiento. |
| `guardian2` | Tutor activo sin vínculos. |
| `guardian3` | Tutor activo con consentimiento vigente para `student2` y consentimiento revocado para `student1`. |

El seed crea exactamente eso:

```text
admin@staging.ecoems.local          admin
profesor1@staging.ecoems.local      teacher (Grupo A y B)
profesor2@staging.ecoems.local      teacher (sin grupos)
alumno1@alumnos.staging.ecoems.mx   student (Grupo A, con asignación)
alumno2@alumnos.staging.ecoems.mx   student (Grupo B, sin asignación)
tutor1@staging.ecoems.local         guardian (vinculado a alumno1, sin consentimiento)
tutor2@staging.ecoems.local         guardian (sin vínculos)
tutor3@staging.ecoems.local         guardian (consentimiento vigente de alumno2;
                                    consentimiento revocado de alumno1)
```

Si falta una identidad, los checks dependientes se marcan **SKIP**, nunca PASS.

## 6. Criterios de aceptación

- [ ] El proyecto de staging tiene un ref distinto de producción.
- [ ] `staging-check.mjs` no aborta y no muestra advertencias.
- [ ] Las 38 migraciones están aplicadas (`0032`–`0038` incluidas).
- [ ] `config.toml` está aplicado en staging (`config diff` sin cambios).
- [ ] El seed de usuarios corre dos veces sin errores (idempotente).
- [ ] La suite RLS no produce PASS falsos: los roles sin identidad salen SKIP.
- [ ] La suite RLS termina con **0 FAIL** tras `0023`–`0038` (la línea base previa era 6: `SEC-01` y `PRIV-02`).
- [ ] `guardian-consent` está desplegada y la vista `privacy_document` devuelve `v3-2026` y su hash.
- [ ] Un tutor sin consentimiento no ve datos del alumno y puede aceptar desde el panel.
- [ ] `complete-password-change` está desplegada y `app_complete_password_change` ya no existe.
- [ ] `deactivate-user` banea en Auth, registra actor/motivo y compensa si falla el update (`SEC-04`).
- [ ] `student_guidance` no expone `weaknesses`, `vocational_notes` ni `extras` (`PRIV-03`).
- [ ] `student_billing_status`, `payment_duplicates` y `app_void_payment` responden con los fixtures (`FUN-02`).
- [ ] `ALLOWED_ORIGIN` está configurado en las nueve funciones y un origen ajeno recibe 403 (`SEC-05`).
- [ ] `invite-guardian` encola `guardian_invite` y la respuesta no contiene enlaces (`SEC-06`).
- [ ] La anonimización de alumnos se prueba solo con un fixture; `auth.users` no se borra en esta fase (`DB-02`).
- [ ] `app_quiz_policy` devuelve `max_attempts` y `app_unit_requirements` bloquea el completado hasta cumplir las reglas (`FUN-03/05`).
- [ ] `verify-migrations.mjs` confirma 38 migraciones aplicadas y ningún `SECURITY DEFINER` sin `search_path` (`DB-07`).
- [ ] El frontend compila en modo `staging` y no contiene secretos.
- [ ] No hay datos reales ni PII en staging.

## 7. Solución de problemas

| Síntoma | Causa probable | Acción |
|---|---|---|
| `AccessTokenRequiredError` | Sin login ni token | `npx supabase login` o exportar `SUPABASE_ACCESS_TOKEN`. |
| `docker: command not found` | Sin Docker | Usar la Opción A (cloud). |
| `staging-check` aborta por producción | `DATABASE_URL` apunta al ref real | Corregir `.secrets/staging-database-url`. |
| Todo sale SKIP | Faltan fixtures | Revisar el orden de seeds (usuarios → contenido → usuarios). |
| `password authentication failed` | Contraseña o ref incorrectos | Regenerar la cadena directa desde el dashboard. |
| `permission denied for table` en `anon` | Esperado | El runner lo cuenta como PASS. |
| Un check de pagos falla | La migración `0021` no está aplicada o se reintrodujo una política permisiva | Revisar `app_can_view_billing` y confirmar que `0021_billing_guard.sql` está aplicada. |

## 8. Limpieza

- No borres el proyecto de staging mientras haya una rama de trabajo que lo use.
- Para reiniciar datos: repetir los seeds (idempotentes) o `db reset` en local.
- Tras una prueba con `TEST_WRITE=1`, revisa la salida del teardown. Si falló,
  borra a mano las asignaciones creadas y vuelve a ejecutar los seeds.
- Rota la contraseña de BD y la `service_role` si alguna se expuso.
- Nunca copies `.secrets/` ni `.env.staging` a otro equipo sin canal seguro.
