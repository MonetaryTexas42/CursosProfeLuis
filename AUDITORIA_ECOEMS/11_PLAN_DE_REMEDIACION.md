# 11 · Plan de remediación

## 1. Principios

Este plan **no se ejecuta en esta auditoría**. Es la propuesta de trabajo para después de la aprobación. Se organiza por fases con dependencias explícitas, criterios de aceptación verificables y un plan de reversión por cambio.

Reglas que aplican a todas las fases:

1. **Nada directo en producción.** Todo cambio se prueba primero en staging (`OPS-09`).
2. **Migraciones versionadas**, con `drop ... if exists` y un archivo de rollback cuando el cambio sea destructivo.
3. **Prueba negativa obligatoria:** cada cambio de RLS debe demostrar que el rol correcto sigue viendo lo correcto y que el rol incorrecto ve **cero**.
4. **Un cambio por PR**, con descripción de riesgo y evidencia de prueba.
5. **Respaldo cifrado antes de tocar datos** (`OPS-01`).
6. **Nada de `TEST_WRITE=1` contra producción** (`OPS-03`).
7. **Registro en `audit_log`** de toda acción administrativa nueva.

---

## 2. Dependencias entre fases

```
Fase 0 (habilitantes)
  ├── OPS-09 staging real
  ├── OPS-05 config.toml + estado de Auth
  └── COD-07 suite de pruebas de RLS
        │
        ▼
Fase 1 (P0 · 0–72 h)
  ├── SEC-01 cerrar RLS de contenido
  ├── PRIV-02 / DB-08 notas internas
  ├── SEC-03 cambio de contraseña verificable
  ├── SEC-02 cerrar vinculación insegura
  ├── PRIV-01 aviso + consentimiento
  └── OPS-03 bloqueo de pruebas en producción
        │
        ▼
Fase 2 (P1 · 1–2 semanas)
  ├── SEC-04 offboarding
  ├── FUN-01 panel del tutor
  ├── FUN-02 pagos con trazabilidad
  ├── PRIV-03 / PRIV-05 privacidad de datos y respaldos
  ├── OPS-01 / OPS-02 respaldos y restauración
  ├── OPS-04 CI/CD
  └── DB-07 verificación de migraciones
        │
        ▼
Fase 3 (P2 · 30 días)
  ├── SEC-05/06/07
  ├── DB-01/02/03/04
  ├── FUN-03/04/05/06/09/10
  ├── COD-01/02
  ├── UX-01/02
  ├── PRIV-04/06
  └── OPS-06/07/09
        │
        ▼
Fase 4 (P3 · 90 días)
  └── el resto (deuda y pulido)
```

**Regla de secuencia:** no se empieza Fase 1 sin staging y sin la suite de pruebas de RLS. Corregir `SEC-01` sin poder demostrar que quedó cerrado es repetir el error.

---

## 3. Fase 0 · Habilitantes (1–3 días)

### 3.1. OPS-09 · Crear staging real

| Paso | Acción |
|---|---|
| 1 | Crear un proyecto Supabase nuevo (`ecoems-staging`) |
| 2 | Aplicar las 40 migraciones desde cero |
| 3 | Cargar `seed/content-v1.json` |
| 4 | Crear usuarios ficticios por rol (admin, profesor, alumno, tutor) |
| 5 | Crear `.env.staging` con la URL y anon key de staging |
| 6 | Apuntar el entorno de desarrollo a staging |
| 7 | Documentar el proyecto y el acceso en el README (sin secretos) |

**Aceptación:** un `npm run dev` local habla con staging; el login ficticio funciona; no hay ninguna referencia a producción en el `.env` de desarrollo.

**Rollback:** no aplica (entorno nuevo).

**Esfuerzo:** 4–6 h.

---

### 3.2. OPS-05 · Versionar configuración y documentar Auth

| Paso | Acción |
|---|---|
| 1 | Ejecutar `supabase init` y versionar `config.toml` |
| 2 | Registrar el estado actual de Auth: sign-ups, confirmación de correo, expiración, rate limits, plantillas |
| 3 | Decidir y documentar: autorregistro **deshabilitado**, confirmación **obligatoria** |
| 4 | Aplicar la misma configuración en staging y producción |
| 5 | Añadir al README la tabla de configuración por entorno |

**Aceptación:** existe `supabase/config.toml` en el repo; el README declara el estado de Auth; staging y producción coinciden en los valores críticos.

**Verificación:**

```sql
-- En el dashboard: Authentication → Providers → Email
-- Confirmar "Enable sign ups" = OFF y "Confirm email" = ON
```

**Esfuerzo:** 2–3 h.

---

### 3.3. COD-07 · Suite de pruebas negativas de RLS

| Paso | Acción |
|---|---|
| 1 | Crear `supabase/tests/rls/` con un archivo por área |
| 2 | Para cada prueba: iniciar sesión con un JWT de rol, ejecutar `select`, comparar conteo |
| 3 | Cubrir como mínimo: contenido, alumnos, notas, calificaciones, asistencia, pagos, consentimientos, observaciones |
| 4 | Añadir el runner a CI (cuando exista, `OPS-04`) |
| 5 | Documentar cómo ejecutarla en `12_PRUEBAS_PENDIENTES.md` |

**Casos mínimos:**

| Caso | Esperado |
|---|---|
| Alumno sin asignación → `unit_versions` | 0 filas |
| Alumno con asignación A → `unit_versions` | Solo la versión de A |
| Alumno A → `students` | Solo su fila |
| Alumno A → `students.notes_internal` | `null` o columna ausente |
| Tutor → `observations` | Solo `visibility='family'` de sus hijos |
| Tutor → `payments` | Solo de sus hijos, solo lectura |
| Alumno → `payments` | 0 filas (0021) |
| Profesor → `groups` | Solo los suyos |
| Profesor → `student_profiles` | Solo los de sus alumnos |
| Admin → todo | Conteo completo |

**Aceptación:** la suite corre en staging y falla si se reintroduce una política permisiva.

**Esfuerzo:** 1–2 días.

---

## 4. Fase 1 · P0 (0–72 h)

> **Objetivo:** cerrar las brechas que impiden operar con datos reales. No se agrega funcionalidad nueva.

### 4.1. SEC-01 · Cerrar el acceso al contenido publicado

**Cambio propuesto** (migración `0023_fix_published_content_rls.sql`):

```sql
-- Revertir la política de conveniencia de 0009.
drop policy if exists units_select_published_students on public.units;
drop policy if exists unit_versions_select_published_students on public.unit_versions;
```

Las políticas de `0003` (`units_select`, `unit_versions_select`) ya exigen asignación activa mediante `app_has_active_unit` / `app_can_access_version`.

**Ajuste de cliente:** `login-gate.js` puede seguir filtrando como defensa en profundidad, pero ya no debe ser la única barrera. Añadir un manejo de “sin unidades” cuando la base devuelva vacío.

**Aceptación:**

- [ ] Un alumno sin asignación obtiene **0** filas de `units` y `unit_versions`.
- [ ] Un alumno con asignación activa ve **solo** su unidad y versión.
- [ ] Un alumno con asignación cerrada o fuera de ventana obtiene 0.
- [ ] El reproductor sigue funcionando para el caso válido.
- [ ] La prueba negativa está en la suite (`COD-07`).
- [ ] Se revisó si el contenido estuvo expuesto y se decidió si rotarlo.

**Verificación:**

```sql
-- Con JWT de alumno sin asignación
select count(*) from public.units;          -- esperado 0
select count(*) from public.unit_versions;  -- esperado 0
```

**Rollback:** recrear las políticas de `0009` (no recomendado; solo para emergencia).

**Riesgo:** si algún flujo dependía del acceso amplio (por ejemplo, el reproductor descargando todo), se rompe. Mitigación: probar en staging con las 4 cuentas.

**Esfuerzo:** 2–4 h + pruebas.

---

### 4.2. PRIV-02 / DB-08 · Sacar `notes_internal` del alcance de la familia

**Opción A (recomendada):** mover la columna a una tabla privada.

```sql
create table if not exists public.student_staff_notes (
  student_id uuid primary key references public.students(id) on delete cascade,
  notes text,
  updated_by uuid references public.profiles(id),
  updated_at timestamptz not null default now()
);

alter table public.student_staff_notes enable row level security;

create policy student_staff_notes_select
on public.student_staff_notes for select to authenticated
using (public.app_is_admin() or public.app_is_teacher_of_student(student_id));

create policy student_staff_notes_write
on public.student_staff_notes for all to authenticated
using (public.app_is_admin() or public.app_is_teacher_of_student(student_id))
with check (public.app_is_admin() or public.app_is_teacher_of_student(student_id));

-- Migrar datos y eliminar la columna
insert into public.student_staff_notes (student_id, notes)
select id, notes_internal from public.students where notes_internal is not null;

alter table public.students drop column notes_internal;
```

**Opción B (más rápida, menos limpia):** crear una vista `students_family` sin la columna y usarla en el frontend; mantener la columna pero revocar `select` a nivel de columna para `authenticated` y conceder solo a staff. Requiere revisar todas las consultas.

**Aceptación:**

- [ ] Un alumno o tutor no puede obtener `notes_internal` por ninguna vía (`select *`, PostgREST, RPC).
- [ ] El profesor y el admin siguen viendo y editando la nota.
- [ ] La UI del staff no se rompe.

**Verificación:**

```sql
-- Con JWT de alumno
select * from public.students where id = '<propio>';
-- No debe aparecer notes_internal

select * from public.student_staff_notes;
-- Debe fallar o devolver 0
```

**Rollback:** restaurar la columna desde el respaldo y revertir la migración.

**Esfuerzo:** 4–6 h.

---

### 4.3. SEC-03 · Hacer verificable el cambio de contraseña

**Opción A (recomendada):** Edge Function `complete-password-change`.

```
1. requireCaller valida el JWT.
2. Recibe { new_password }.
3. Valida fortaleza (mín. 12, no igual a la temporal).
4. admin.auth.admin.updateUserById(userId, { password: new_password }).
5. Actualiza profiles.must_change_password = false y password_changed_at = now().
6. Registra en audit_log.
```

**Opción B (más simple):** eliminar `must_change_password` y usar el flujo nativo de recuperación de Supabase, que ya verifica el cambio.

**Aceptación:**

- [ ] Llamar `app_complete_password_change` directamente **no** limpia la bandera sin cambiar la contraseña.
- [ ] El flujo normal cambia la contraseña y limpia la bandera.
- [ ] Queda registro de la fecha del cambio.
- [ ] La contraseña temporal deja de funcionar tras el cambio.

**Verificación:** en staging, iniciar sesión con la temporal, cambiar la contraseña, cerrar sesión, intentar entrar con la temporal → debe fallar.

**Rollback:** restaurar la RPC anterior (solo si la Edge Function falla en producción).

**Esfuerzo:** 4–6 h.

---

### 4.4. SEC-02 · Cerrar la vinculación insegura

**Estado:** implementado en código (migración `0026`, Edge Functions `issue-student-link-token` y `redeem-student-link-token`, UI de invitación). **Sin verificar en ejecución** hasta que exista staging.

**Pasos:**

1. **Deshabilitar autorregistro** (parte de `OPS-05`).
2. **Eliminar `app_link_student_account`** y, con ella, la escritura directa en `auth.users` y la confirmación forzada de correo.
3. **Sustituir por invitación:** el profesor o admin genera un token de un solo uso ligado a `student_id`, con expiración (72 h) y registro de quién lo emitió. La cuenta la crea el servidor con una contraseña aleatoria que nunca se devuelve.
4. **Canje:** el alumno abre el enlace y establece su contraseña. El token prueba la titularidad; no se marca ningún correo como confirmado.
5. **Auditoría:** registrar emisión y canje en `audit_log`, sin guardar el token en claro.
6. **Revisión:** listar las vinculaciones existentes y confirmar titularidad.

**Tabla implementada:**

```sql
create table if not exists public.student_link_tokens (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  token_hash text not null unique,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  used_at timestamptz,
  used_by uuid references public.profiles(id),
  revoked_at timestamptz,
  constraint student_link_tokens_hash_format check (token_hash ~ '^[0-9a-f]{64}$'),
  constraint student_link_tokens_expiry check (expires_at > created_at)
);
```

Sin políticas para `authenticated`/`anon`: RLS devuelve 0 filas y solo el `service_role` de las Edge Functions opera.

**Aceptación:**

- [ ] No se puede marcar un correo como confirmado desde una RPC de aplicación (`RLS-95`).
- [ ] La vinculación exige un token válido, no usado y no expirado (`AUTH-23…25`).
- [ ] Queda rastro de emisión y canje (`AUTH-21`, `AUTH-22`, `AUTH-28`).
- [ ] Una cuenta creada por un tercero no puede apropiarse de una ficha: la cuenta nace en el servidor y el token se entrega fuera de banda.
- [ ] Nadie lee el hash por PostgREST (`RLS-92…94`); la tabla no guarda el token en claro (`RLS-97`).

**Verificación:** intentar vincular con un correo no verificado sin token → debe fallar; con token → debe funcionar y quedar auditado. Ver `12_PRUEBAS_PENDIENTES.md` §5.3.

**Rollback:** volver a aplicar `0019_link_username_fix.sql` y `drop table if exists public.student_link_tokens;`. No se recomienda: reabre el hallazgo.

**Esfuerzo:** 1–2 días.

---

### 4.5. PRIV-01 · Aviso, consentimiento y bloqueo

**Pasos:**

1. Publicar `privacidad.html` con el texto validado (versión `v2-2026` si cambia).
2. Enlazarlo desde el login, el panel del tutor y el pie.
3. Guardar en `privacy_consents.metadata`:
   - `document_hash` (SHA-256 del texto),
   - `document_url`,
   - `accepted_by`,
   - `channel`.
4. Bloquear el panel del tutor hasta que exista consentimiento vigente: mostrar solo el aviso y el botón.
5. Exigir casilla “He leído y entiendo”.
6. Exponer la revocación con confirmación.
7. Registrar aceptación y revocación en `audit_log`.

**Implementado (sin aplicar):**

- `frontend/public/privacidad.html` publica el aviso `v3-2026` (la `0027` publicó `v2-2026`; la `0031` añade la finalidad educativa del perfil vocacional) con banner de revisión legal y placeholders institucionales. `scripts/privacy-doc.mjs` calcula su SHA-256 y genera `supabase/seed/privacy-document.json`.
- `0027_privacy_notice.sql` publica `privacy_document_version`, `privacy_document_url` y `privacy_document_sha256`; crea la vista pública `privacy_document` y `app_guardian_has_consent`. `0031_privacy_notice_v3.sql` sube la versión vigente a `v3-2026` y su hash.
- Las políticas del tutor (`students`, `profiles`, `groups`, finanzas, mensajes) exigen consentimiento vigente. `student_guardians` y `privacy_consents` siguen visibles para poder aceptar o revocar.
- Se elimina `privacy_consents_guardian_insert`: el tutor no puede fabricar un consentimiento por PostgREST.
- `guardian-consent` valida versión, URL y hash contra `settings`, exige `acknowledged` y `confirm`, revoca todas las versiones activas y audita aceptación y revocación.
- El panel del tutor muestra el aviso, la casilla, un botón por alumno pendiente y la revocación con confirmación. El pie enlaza al aviso en login, paneles y canje de invitación.

**Aceptación:**

- [x] Un tutor nuevo no ve datos del alumno hasta aceptar (código y RLS; falta verificación en staging).
- [x] El botón abre el texto completo.
- [x] La base guarda hash y URL.
- [x] La revocación funciona y se refleja en el panel (código; falta E2E en staging).
- [ ] El texto fue revisado por un abogado.

**Verificación:** crear un tutor ficticio en staging, entrar, comprobar el bloqueo, aceptar, comprobar el acceso, revocar, comprobar el bloqueo de nuevo. Los fixtures `tutor1` (sin consentimiento) y `tutor3` (vigente y revocado) ya existen en `seed-staging-users.mjs`; los checks son `RLS-98`–`RLS-107` y `PRIV-10`–`PRIV-13`.

**Esfuerzo:** 1–2 días + revisión legal.

---

### 4.6. OPS-03 · Bloquear pruebas de escritura en producción

**Cambio propuesto** en `ui-smoke.mjs` y `test-functions.mjs`:

```js
const PROD_REF = 'ioikcrdxneuydylyhvwi';
const url = env.VITE_SUPABASE_URL || '';
const isProd = url.includes(PROD_REF);

if (process.env.TEST_WRITE === '1' && isProd) {
  console.error('TEST_WRITE=1 bloqueado: la URL apunta a producción.');
  process.exit(2);
}
```

Además:

- Quitar el `student_code` con nombre real de `test-functions.mjs:105`; usar una variable o un identificador ficticio.
- Exigir `APP_ENV=staging` junto con `TEST_WRITE=1`.
- Añadir teardown de los datos creados.

**Aceptación:**

- [ ] `TEST_WRITE=1` con la URL de producción termina con error antes de escribir.
- [ ] `TEST_WRITE=1` contra staging funciona y limpia.
- [ ] No hay PII en los scripts.

**Esfuerzo:** 2–3 h.

---

### 4.7. Criterio de salida de Fase 1

- [ ] Las 6 acciones están en staging y verificadas.
- [ ] La suite de RLS pasa completa.
- [ ] Un tutor ficticio completa el flujo: invitación → consentimiento → acceso → revocación.
- [ ] Un alumno ficticio completa: login → cambio de contraseña → unidad activa → ejercicio → quiz.
- [ ] Un alumno sin asignación no ve contenido.
- [ ] No hay `TEST_WRITE` posible contra producción.
- [ ] Existe un respaldo cifrado previo a cualquier cambio en producción.

---

### 4.8. Rollback de Fase 1 (0023–0027)

Solo para emergencia: revertir reabre el hallazgo correspondiente. Antes de
empezar, tomar un respaldo verificable y avisar a los usuarios de que no habrá
escrituras durante la ventana.

**Orden obligatorio:** frontend → Edge Functions → migraciones en orden inverso
(`0027` → `0023`). Así el cliente deja de llamar funciones que se van a retirar.

1. **Frontend:** volver al commit anterior de `app.js`, `styles.css` y
   `privacidad.html`; reconstruir y publicar el commit previo de `gh-pages`.
   No dejar el panel nuevo llamando a `guardian-consent` ni al canje de token
   si la función ya no existe.
2. **Edge Functions:** redesplegar la versión anterior de `guardian-consent` o
   retirarla; retirar `issue-student-link-token`, `redeem-student-link-token` y
   `complete-password-change` si se revierten `0026`/`0025`.
3. **0027 (PRIV-01):** `drop view public.privacy_document`; `drop function
   public.app_guardian_has_consent(uuid)`; `drop function
   public.app_setting_text(text)`; restaurar `app_can_access_student`,
   `app_guardian_has_student_in_group` y `app_can_view_profile` desde
   `0003_rls.sql`; restaurar `app_can_view_billing` desde
   `0021_billing_guard.sql`; recrear `guardian_messages_select` y
   `privacy_consents_guardian_insert` desde `0003_rls.sql`; restaurar o borrar
   las tres claves `privacy_document_*` de `settings`. **No borrar** las filas de
   `privacy_consents`: son evidencia; si se reaplica `0027`, vuelven a contar.
4. **0026 (SEC-02):** `drop table public.student_link_tokens`; recrear
   `app_link_student_account` desde `0019_link_username_fix.sql`; retirar las
   dos funciones de invitación. No se recomienda: restaura la escritura directa
   en `auth.users`.
5. **0025 (SEC-03):** recrear `app_complete_password_change` desde
   `0011_force_password_change.sql`; `alter table public.profiles drop column
   password_changed_at`; retirar `complete-password-change`. No se recomienda:
   vuelve la bandera evitable.
6. **0024 (PRIV-02/DB-08):** `alter table public.students add column
   notes_internal text`; copiar `note` desde `student_staff_notes`; `drop table
   public.student_staff_notes`; eliminar el trigger y
   `app_audit_student_staff_note`. No se recomienda: la familia vuelve a ver las
   notas internas.
7. **0023 (SEC-01):** recrear `units_select_published_students` y
   `unit_versions_select_published_students` tal como están en `0009`. No se
   recomienda: cualquier alumno vuelve a leer todo el contenido publicado.

**Verificación posterior:** ejecutar `node scripts/staging-check.mjs` y la suite
RLS. Si se revirtió todo, la línea base vuelve a **6 FAIL** (`SEC-01` y
`PRIV-02`); cualquier FAIL adicional indica un rollback incompleto. Probar
login de alumno, panel del tutor y acceso a una unidad asignada antes de
declarar la operación terminada.

---

## 5. Fase 2 · P1 (1–2 semanas)

### 5.1. SEC-04 · Offboarding real

- En `deactivate-user`, llamar `admin.auth.admin.updateUserById(id, { ban_duration: '876000h' })` al desactivar y `{ ban_duration: 'none' }` al reactivar.
- Registrar `deactivated_at`, `deactivated_by` y motivo.
- Documentar que el baneo impide nuevos logins y refresh; para revocar tokens activos, evaluar `session_version` o rotación de JWT.
- Probar: desactivar → intentar login → debe fallar en Auth.

**Aceptación:** el usuario desactivado no puede autenticarse ni refrescar; la reaktivación exige una acción explícita.

**Esfuerzo:** 4 h.

### 5.2. FUN-01 · Panel del tutor

- Añadir pestañas de solo lectura: avance, calificaciones visibles, asistencia, observaciones `family`, tareas.
- Reutilizar RLS existente; no ampliar permisos.
- Mostrar “Solo lectura” en cada sección.
- Añadir estados vacíos claros.

**Aceptación:** el tutor ve el avance y las calificaciones visibles de sus hijos; no ve datos de otros; no puede editar.

**Esfuerzo:** 2–3 días.

### 5.3. FUN-02 · Pagos con trazabilidad

- Añadir a `payments`: `period_start`, `period_end`, `status`, `voided_at`, `void_reason`, `receipt_no`, `idempotency_key`.
- Calcular saldo por alumno y periodo con una vista o RPC.
- Detectar duplicados.
- Implementar anulación con motivo y auditoría (sin borrar).
- Mostrar al tutor “al corriente / pendiente / vencido”.
- Añadir recibo descargable.

**Implementado en `0029`:** columnas y folio (`REC-<año>-<secuencia>`),
`app_billing_period`, trigger `app_payments_before_write` (folio, validación,
duplicados y auditoría de la anulación), vistas `student_billing_status` y
`payment_duplicates`, RPC `app_void_payment`, políticas sin `DELETE` y panel
del tutor/staff con periodo, estado, saldo, folio y botón “Anular”. El trigger
registra en `audit_log` incluso si la anulación se hace por PostgREST. El recibo
PDF se genera en el cliente desde los datos visibles por RLS, sin dependencias:
`frontend/src/ui/receipt-pdf.js`, botón “Recibo” en el historial de staff y
tutores, y validación estructural con `scripts/test-receipt-pdf.mjs`. El PDF
marca los pagos anulados y **no incluye `notes`**. Resta la revisión manual del
diseño del documento antes del piloto real.

**Aceptación:** se puede responder “¿cuánto debe y de qué periodo?” para cualquier alumno; un pago duplicado se detecta; una anulación deja rastro.

**Esfuerzo:** 3–5 días.

### 5.4. PRIV-03 · Visibilidad del perfil vocacional

- Definir finalidad específica en el aviso.
- Reservar `vocational_notes` para staff.
- Exponer al tutor un resumen curado.
- Añadir leyenda “orientativo, no diagnóstico”.

**Aceptación:** el tutor no ve notas crudas ni “debilidades”; el alumno entiende el carácter orientativo.

**Esfuerzo:** 1 día.

### 5.5. PRIV-05 / OPS-01 · Respaldos cifrados

- Cifrar en origen con `age` o GPG.
- Excluir `auth.users` del volcado manual.
- `chmod 600` y carpeta restringida.
- Retención de 30 días con borrado automático.
- Checksum y log de generación.
- Verificar los respaldos automáticos de Supabase.

**Implementado en `scripts/backup-db.mjs`:** cifrado AES-256-GCM en origen con
llave en `.secrets/backup.key` (o `BACKUP_KEY`), exclusión de **todo** `auth.*`
salvo `--include-auth` con `ALLOW_AUTH_BACKUP=1`, permisos 600/700, retención de
30 días, checksum lateral `.sha256` y `backup.log`. El volcado sin cifrar exige
`ALLOW_PLAINTEXT_BACKUP=1` y es solo para diagnóstico local.

**Aceptación:** el respaldo en disco está cifrado; no contiene `auth.users`; se borra a los 30 días; existe evidencia de una restauración exitosa.

**Esfuerzo:** 1 día.

### 5.6. OPS-02 · Restauración segura

- Bandera `--confirm=restore`.
- Rechazo de la URL de producción salvo `--i-know`.
- Respaldo previo automático.
- Validación del JSON (tablas, conteos, checksum).
- Registro de la restauración.

**Aceptación:** ejecutar sin bandera no hace nada; con la URL de producción y sin `--i-know` aborta; con confirmación, restaura y deja log.

**Esfuerzo:** 4–6 h.

### 5.7. OPS-04 · CI/CD

- Workflow: `npm ci`, `npm run build`, pruebas de RLS contra staging, publicación a `gh-pages` solo desde `main`.
- Etiqueta de versión con el commit.
- Health check post-deploy.
- Rollback documentado (revertir commit y redesplegar, sin `-f`).

**Aceptación:** un push a `main` genera un build verificable y publica; un fallo de prueba bloquea el despliegue; se puede volver a la versión anterior en menos de 15 minutos.

**Esfuerzo:** 1–2 días.

### 5.8. DB-07 · Verificación de migraciones

- Ejecutar en staging y, en modo lectura, en producción:

```sql
select version, name, statements
from supabase_migrations.schema_migrations
order by version;
```

- Comparar con los 40 archivos.
- Revisar `pg_policies` y `pg_proc` para detectar objetos no versionados.

**Implementado:** `scripts/verify-migrations.mjs` compara
`supabase_migrations.schema_migrations` con los archivos locales, lista
políticas/funciones, detecta `SECURITY DEFINER` sin `search_path` y puede
escribir una instantánea JSON con `--out=`. Es de solo lectura y avisa si el
destino es producción. La columna `inserted_at` no existe en
`schema_migrations`; se corrigió el verificador para usar `version`, `name` y
`statements` (commit `888a2ce`).

**Ejecutado en producción (20 nov 2026, solo `SELECT`):** ref
`ioikcrdxneuydylyhvwi`; 38 migraciones locales en ese momento, 22 aplicadas,
16 faltantes (`0023`–`0038`), 0 desconocidas, 87 políticas, 94 funciones y 0
`SECURITY DEFINER` sin `search_path`. `exit code 1`, esperado. No se aplicaron
migraciones ni se desplegó.

**Ejecutado en staging (21 nov 2026):** ref `hsfhlhrkmhajmpethzqn`; 40/40
migraciones (incluye `0039_staging_rls_fixes.sql` y `0040_email_outbox_processor.sql`),
41 tablas, 93 políticas, 61 `SECURITY DEFINER`, 0 sin `search_path`, suite RLS
135/135, `test-functions.mjs` y `test-email-outbox.mjs` en PASS. Producción
sigue intacta.

**Aceptación:** existe un documento que confirma qué migraciones están aplicadas y si hay diferencias.

**Esfuerzo:** 2 h.

### 5.9. Estado de implementación de Fase 2 (17 nov 2026)

| ID | Estado en código | Migración / archivo | Verificación pendiente |
|---|---|---|---|
| SEC-04 | Implementado | `0028_offboarding.sql`; `functions/deactivate-user/index.ts` | Desactivar → login/refresh falla en Auth (staging) |
| FUN-01 | Implementado | `frontend/src/ui/app.js`; `styles.css` | Panel del tutor con datos ficticios |
| FUN-02 | Implementado con recibo PDF | `0029_payments_traceability.sql`; `src/ui/app.js`; `receipt-pdf.js` | Revisión visual del PDF; resto verificado con RLS y build |
| PRIV-03 | Implementado | `0030_vocational_visibility.sql`; `privacidad.html` | Tutor no ve tabla cruda ni notas internas |
| PRIV-05 / OPS-01 | Implementado | `scripts/backup-db.mjs` | Respaldo cifrado y restauración de prueba |
| OPS-02 | Implementado | `scripts/restore-db.mjs` | Sin `--confirm` no escribe; producción exige `--i-know` |
| OPS-04 | Implementado | `.github/workflows/ci.yml`; `docs/despliegue.md` | Primer push a `main` con secretos configurados |
| DB-07 | Verificado en staging y en producción (solo lectura) | `scripts/verify-migrations.mjs` | Cerrado: 40/40 en staging |

La suite de RLS creció de **91 a 113 checks** (RLS-108…129) para cubrir
offboarding, pagos, estado de cuenta y perfil vocacional curado. Nada de esto
está aplicado ni verificado en un entorno real todavía.

### 5.10. Rollback de Fase 2 (0028–0031)

Solo para emergencia. Antes de empezar, generar un respaldo cifrado con
`scripts/backup-db.mjs` y confirmar que se puede descifrar. El orden es
frontend → Edge Functions → migraciones en orden inverso (`0031` → `0028`).

1. **Frontend:** volver al commit anterior de `app.js`, `styles.css` y
   `privacidad.html`; reconstruir y publicar. El panel anterior no consulta
   `student_guidance`, `student_billing_status` ni `app_void_payment`.
2. **0031 (aviso v3):** restaurar en `settings` la versión `v2-2026`, la URL
   `/privacidad.html` y el hash
   `2862320c61c93a3553a7328625836bf9792783cc170051de76c655559ddeedfc`.
   No borrar los consentimientos `v3-2026`: son evidencia; si se reaplica la
   migración, vuelven a contar.
3. **0030 (PRIV-03):** `drop view public.student_guidance`; recrear
   `student_profiles_select` con `app_can_access_student(student_id)` desde
   `0003_rls.sql`. No se recomienda: el tutor vuelve a ver `weaknesses` y
   `vocational_notes`.
4. **0029 (FUN-02):** `drop function public.app_void_payment(uuid, text)`;
   `drop view public.payment_duplicates`; `drop view public.student_billing_status`;
   `drop function public.app_payments_before_write()`; `drop function
   public.app_billing_period(text, date)`; `drop sequence
   public.payment_receipt_seq`; quitar las columnas nuevas de `payments` y
   recrear las políticas `payments_write_staff` y `student_billing_write_staff`
   desde `0020_payments.sql` / `0021_billing_guard.sql`. **No borrar** los pagos:
   las columnas de anulación contienen evidencia; exportarlas antes de eliminar
   las columnas.
5. **0028 (SEC-04):** quitar `deactivation_reason`, `deactivated_by` y
   `deactivated_at` de `profiles`; redesplegar la versión anterior de
   `deactivate-user` (solo `profiles.active = false`). No se recomienda: el
   usuario desactivado vuelve a poder autenticarse.

**Verificación posterior:** `node scripts/staging-check.mjs` debe volver a los
umbrales de Fase 1 (27 migraciones, 88 políticas, 46 funciones `SECURITY
DEFINER`) y la suite RLS debe quedar sin los checks 108–129. Si se revirtió
todo, la línea base no debe superar los 6 FAIL históricos de `SEC-01` y
`PRIV-02`; cualquier FAIL adicional indica un rollback incompleto.

---

## 6. Fase 3 · P2 (30 días)

| ID | Acción | Aceptación | Esfuerzo |
|---|---|---|---|
| SEC-05 | Configurar `ALLOWED_ORIGIN` por entorno | Origen desconocido rechazado | 2 h |
| SEC-06 | Enviar invitación por correo, no WhatsApp | El enlace no queda en chat | 1 día |
| SEC-07 | Auditar baneos y documentar límites | Acción registrada con actor y motivo | 4 h |
| DB-01 | `unique (group_id, unit_id)` tras limpiar duplicados | No se crean duplicados | 4 h |
| DB-02 | Política de borrado/anonimización y ajuste de FKs | Se puede anonimizar un alumno con historial | 2 días |
| DB-03 | Calcular XP en servidor desde eventos | El cliente no puede inflar XP | 1–2 días |
| DB-04 | Requisitos mínimos para completar unidad | No se completa en vacío | 4 h |
| FUN-03 | Audiencia explícita por alumno | Alumno nuevo no hereda acceso | 1–2 días |
| FUN-04 | Política de intentos visible y aplicada | Se muestra y se respeta | 1 día |
| FUN-05 | Validación y aviso en UI | El botón explica qué falta | 4 h |
| FUN-06 | Recuperación de contraseña | El alumno puede recuperar sin el profesor | 1 día |
| FUN-09 | Paginación con totales | “Mostrando X de Y” | 1 día |
| FUN-10 | Pantalla de auditoría | Filtros por actor, entidad y fecha | 1–2 días |
| COD-01 | Eliminar legacy y claves `localStorage` | Sin código muerto ni PII local | 1 día |
| COD-02 | Una sola fuente de verdad | El cliente solo renderiza | 1–2 días |
| UX-01 | Foco global, skip link, `aria-live`, contraste | Auditoría axe sin errores críticos | 1–2 días |
| UX-02 | Helper de diálogos con focus trap | Foco atrapado y restaurado | 1 día |
| PRIV-04 | Limpieza de `localStorage` al cerrar sesión | No quedan datos personales | 4 h |
| PRIV-06 | Canal ARCO y registro de solicitudes | Solicitud registrada con plazo | 1 día |
| OPS-06 | Permisos, residuos y rotación | `.secrets` limpio y documentado | 4 h |
| OPS-07 | Monitoreo y alertas | Alerta de error 5xx y de respaldo fallido | 1 día |
| OPS-09 | Consolidar staging | Staging estable y documentado | — (Fase 0) |

### 6.1. Estado de implementación de Fase 3 (20 nov 2026)

Preparada como cambio versionado en `main`, **sin migraciones aplicadas ni
despliegue**. Sigue a los commits `8f87f97` (Fase 0/1) y `58a85c8` (Fase 2).

| Bloque | Entregado | Pendiente de entorno |
|---|---|---|
| `SEC-05` | `ALLOWED_ORIGIN` por entorno, validación antes de `OPTIONS`/`POST`, `Vary: Origin` y rechazo 403 en `_shared/http.ts`; prueba negativa en `test-functions.mjs` | Configurar el secreto en las nueve funciones al desplegar |
| `SEC-06` | Helper `_shared/email.ts`; `invite-guardian` encola y `process-email-outbox` drena con token, reintentos y auditoría sin enlaces | Verificado en staging con proveedor `log`; falta activar el cron con secretos del repo |
| `SEC-07` | Auditoría de anonimización, ARCO y baneo; vista admin sin `before`/`after` | Definir retención con Legal (PRIV-07) |
| `DB-01` | `0032`: índice único por grupo/unidad, RPC de activación y backfill de audiencia | Limpiar duplicados heredados si existen antes de aplicar |
| `DB-02` | `0033`: `app_anonymize_student` con seudónimo, borrado de PII y auditoría | Coordinar el borrado definitivo de `auth.users` |
| `DB-03` | `0034`: `xp_events`, trigger de premios y `app_award_server_xp`; índice único parcial para fuentes nuevas | No reconciliar XP heredado automáticamente |
| `DB-04` / `FUN-05` | `0035`: reglas por defecto (60 % ejercicios, 70 % precisión), `app_unit_requirements` y `app_complete_unit` con validación | Ajustar reglas con el equipo académico |
| `FUN-03` | `0032`: audiencia explícita por alumno en nuevas asignaciones; trigger para alumnos nuevos | Verificar el backfill de asignaciones heredadas |
| `FUN-04` | `0036`: `max_attempts=3` (`0` = sin límite), trigger y `app_quiz_policy` | Confirmar política con el profesor |
| `FUN-06` | Recuperación de contraseña con `resetPasswordForEmail` y manejo de `PASSWORD_RECOVERY` | Configurar redirect URLs por entorno |
| `FUN-09` | Paginación de pagos con “Mostrando X de Y” y controles accesibles | — |
| `FUN-10` | Pestaña admin `auditoria` con solicitudes y eventos; resolución auditada | Filtros por actor/entidad/fecha (diferidos a Fase 4) |
| `COD-01` / `PRIV-04` | Limpieza de claves `ecoems_*` y legacy al cerrar sesión; textos de invitación por correo | — |
| `COD-02` | Reglas, intentos y estado se leen de RPC; la UI solo renderiza | — |
| `UX-01` | Skip link, `<main>` enfocable, foco visible y `aria-live` | Ejecutar axe en staging |
| `UX-02` | `trapDialogFocus` centralizado en seis diálogos | — |
| `PRIV-06` | `0037`: `data_requests`, SLA de 20 días, RPCs y diálogo “Solicitar mis datos” | Validar aviso `v3-2026` y `data_request_email` con Legal |
| `OPS-06` / `OPS-07` | Runbooks `docs/seguridad.md` y `docs/monitoreo.md` | Acceso de solo lectura a producción para `DB-07`; alertas automáticas (Fase 4) |
| `OPS-09` | `staging-check.mjs` con umbrales 40/41/93/≥53 y objetos Fase 3; suite RLS ampliada a 135 verificaciones | Ejecutado en staging el 21 nov 2026: 135/135 y functions PASS |

**Criterio de salida:** 0 FAIL en la suite RLS, `staging-check.mjs` sin
advertencias, CORS positivo y negativo verificado, correo encolado sin enlaces
en la respuesta y firma de Legal sobre el aviso y el correo de contacto. Hasta
entonces la Fase 3 queda como código preparado, no como remediación cerrada.

---

## 7. Fase 4 · P3 (90 días)

| ID | Acción | Esfuerzo |
|---|---|---|
| SEC-08 | Centralizar la anon key | 2 h |
| SEC-09 | Rate limiting en funciones sensibles | 1 día |
| DB-05 | Migraciones idempotentes con rollback | 1–2 días |
| DB-06 | Retención y partición de logs | 1 día |
| FUN-07 | Mostrar el dominio y validar en alta | 4 h |
| FUN-08 | Carga por pestaña y agregados en RPC | 2 días |
| FUN-11 | Persistir el modo de login | 2 h |
| COD-03 | Escapar en el límite y revisar `catch` | 1 día |
| COD-04 | ESLint + Prettier + Vitest | 1–2 días |
| COD-05 | Dividir `app.js` por dominio | 3–5 días |
| COD-06 | Errores observables | 4 h |
| COD-08 | Lockfile y `npm audit` | 2 h |
| COD-09 | `dist` fuera del repo | 4 h |
| UX-03 | Errores accionables con código | 1 día |
| UX-04 | Skeletons y `aria-busy` | 1 día |
| UX-05 | Tablas → tarjetas en móvil | 1 día |
| UX-06 | Badge de modo en cada vista | 4 h |
| UX-07 | Confirmación en acciones masivas | 4 h |
| UX-08 | Ayuda contextual en quizzes | 4 h |
| PRIV-07 | Retención de `audit_log` | 4 h |
| PRIV-08 | Sustituir WhatsApp por correo | 1 día |
| OPS-08 | Plan de rotación de claves | 4 h |
| OPS-10 | Build reproducible | 4 h |

---

## 8. Estimación agregada

| Fase | Esfuerzo estimado | Calendario |
|---|---|---|
| Fase 0 (habilitantes) | 3–5 días | Semana 0 |
| Fase 1 (P0) | 5–8 días | Semana 1 |
| Fase 2 (P1) | 10–15 días | Semanas 2–4 |
| Fase 3 (P2) | 20–25 días | Mes 2 |
| Fase 4 (P3) | 25–30 días | Mes 3 |
| **Total** | **~2.5–3 meses** | — |

Con una sola persona a tiempo parcial, el calendario se duplica. Con dos personas (una en backend/seguridad y otra en frontend/UX), se puede mantener.

---

## 9. Riesgos del plan

| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| Cerrar `SEC-01` rompe el reproductor | Media | Probar en staging con 4 roles; dejar filtro cliente como respaldo |
| La migración de `notes_internal` pierde datos | Baja | Respaldo previo y copia a la nueva tabla antes de `drop column` |
| El flujo de invitación no se completa antes del piloto | Media | Mantener la RPC anterior deshabilitada (`revoke`) y usar altas por Edge Function mientras tanto |
| El abogado no valida el aviso a tiempo | Media | No iniciar con datos reales hasta tenerlo; usar datos ficticios |
| Staging se desactualiza | Alta | Aplicar migraciones en CI y recrearlo desde cero periódicamente |
| Se agrega funcionalidad nueva durante la remediación | Alta | Congelar features hasta cerrar P0/P1 |
| El equipo no tiene tiempo | Alta | Priorizar P0 (6 acciones) y posponer P2/P3 |

---

## 10. Definición de “terminado”

Un hallazgo se considera cerrado solo si:

1. El cambio está en `main` y desplegado.
2. Existe una prueba automatizada que falla sin el cambio y pasa con él.
3. La prueba se ejecutó en staging y en producción (cuando aplique).
4. El informe correspondiente se actualiza con “Verificado” y la fecha.
5. No se reintrodujo por otra vía (revisión de políticas, no solo del código).

**No cuenta como cerrado:** “se cambió el código”, “se probó a mano una vez”, “el profesor dice que ya funciona”.

---

## 11. Qué no hacer

- **No** aplicar las migraciones directamente en producción sin staging.
- **No** “arreglar” `SEC-01` agregando otra política permisiva más específica; el problema es la política permisiva.
- **No** mover el filtrado al cliente como solución.
- **No** borrar `notes_internal` sin migrar los datos.
- **No** desactivar RLS para “probar más rápido”.
- **No** publicar el aviso sin revisión legal.
- **No** ejecutar `restore-db.mjs` contra producción sin respaldo y confirmación.
- **No** rotar claves sin actualizar los tres lugares donde vive la anon key.
- **No** agregar funcionalidad nueva antes de cerrar P0.

---

## 12. Conclusión

El plan es **grande en número y pequeño en cambios críticos**. Seis acciones de Fase 1 cierran el 80 % del riesgo real:

1. Dos `drop policy`.
2. Una tabla privada para notas internas.
3. Una Edge Function para el cambio de contraseña.
4. Un flujo de invitación con token.
5. Un aviso publicado con hash y bloqueo.
6. Un guard de `TEST_WRITE`.

Ninguna requiere reescribir la plataforma. Todas requieren **hacerlas en staging, probarlas con denegaciones y dejar evidencia**. Ese es el cambio de hábito que separa el piloto de la operación.
