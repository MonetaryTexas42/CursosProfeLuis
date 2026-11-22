# 12 · Pruebas pendientes

## 1. Propósito

Esta auditoría fue **estática**: no se ejecutó la aplicación, no se abrió conexión a la base y no se llamó a producción. Por eso, buena parte de los hallazgos tiene evidencia de código pero **no verificación en ejecución**.

Este documento define las pruebas que faltan, cómo ejecutarlas en un entorno aislado y qué evidencia debe quedar. No se ejecutó ninguna.

> **Regla de oro:** ninguna prueba de este documento se corre contra producción. Todas requieren staging (`OPS-09`) o una réplica local. Las que escriben datos llevan la marca **W**.

---

## 2. Requisitos previos

| Requisito | Detalle |
|---|---|
| Proyecto staging | `hsfhlhrkmhajmpethzqn` («Plataforma de Prueba ECOEMS»), con las 39 migraciones (`0032`–`0039` incluidas) y el seed |
| Usuarios ficticios | Un admin, un profesor con grupo, dos alumnos (uno con asignación, uno sin), un tutor vinculado sin consentimiento, un tutor no vinculado y un tutor con consentimiento vigente y revocado |
| Contenido | Al menos una unidad publicada con `correctIndex`, una en borrador |
| `psql` | Para pruebas SQL directas |
| `curl` o `httpie` | Para PostgREST |
| Node 20+ | Para scripts |
| Chrome | Para E2E con DevTools Protocol |
| JWT por rol | Ver §3 |

### 2.1. Datos ficticios mínimos

```
admin@staging.ecoems.local          → rol admin
profesor1@staging.ecoems.local      → rol teacher, grupos A y B
profesor2@staging.ecoems.local      → rol teacher, sin grupos (otro profesor)
alumno1@alumnos.staging.ecoems.mx   → rol student, grupo A, con asignación activa
alumno2@alumnos.staging.ecoems.mx   → rol student, grupo B, sin asignación
tutor1@staging.ecoems.local         → rol guardian, vinculado a alumno1, sin consentimiento
tutor2@staging.ecoems.local         → rol guardian, sin vínculos
tutor3@staging.ecoems.local         → rol guardian, consentimiento vigente de alumno2
                                      y consentimiento revocado de alumno1
```

Todas las contraseñas son ficticias y viven solo en staging. El seed
`app/scripts/seed-staging-users.mjs` crea exactamente estos usuarios.

### 2.2. Suite automatizada de RLS (COD-07)

La suite `app/supabase/tests/rls/rls-negative.mjs` (135 verificaciones) y su runner
`app/scripts/run-rls-tests.mjs` codifican el comportamiento **seguro esperado**.
Descubren las identidades por rol, validan que el JWT simulado resuelva al rol
correcto y hacen `rollback` en cada prueba.

```bash
cd app
DATABASE_URL="$(cat .secrets/staging-database-url)" \
  node scripts/run-rls-tests.mjs
```

- `0`: todo PASS o SKIP justificado.
- `1`: hay FAIL (comportamiento inseguro).
- `2`: error de configuración o conexión.

Los roles sin identidad se marcan **SKIP**, nunca PASS. Antes de la Fase 1 la
línea base era de 6 FAIL (`SEC-01`: RLS-01, 02, 10, 11; `PRIV-02`: RLS-16, 50).
Con las migraciones 0023–0038 y las Edge Functions de contraseña, invitación,
consentimiento, CORS y correo, la expectativa es **0 FAIL**; cualquier FAIL
nuevo es una regresión. La suite añade RLS-89–91 (`SEC-03`), RLS-92–97
(`SEC-02`), RLS-98–107 (`PRIV-01`), RLS-108–129 para la Fase 2 (offboarding,
perfil vocacional curado y pagos con trazabilidad) y **RLS-130–148** para la
Fase 3: integridad de asignaciones (`DB-01`), anonimización (`DB-02`), XP en
servidor y reglas de completado (`DB-03/04`, `FUN-04/05`) y solicitudes ARCO
(`PRIV-06`). El runbook completo está en
[`app/docs/staging.md`](../app/docs/staging.md).

---

## 3. Cómo obtener un JWT por rol

### 3.1. Login por contraseña

```bash
export SB_URL="https://<ref-staging>.supabase.co"
export SB_ANON="<anon-key-staging>"

login() {
  local email="$1" pass="$2"
  curl -s "$SB_URL/auth/v1/token?grant_type=password" \
    -H "apikey: $SB_ANON" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$email\",\"password\":\"$pass\"}" \
  | jq -r '.access_token'
}

export JWT_ADMIN=$(login "admin@staging.local" "$ADMIN_PASS")
export JWT_TEACHER=$(login "profesor@staging.local" "$TEACHER_PASS")
export JWT_STUDENT1=$(login "alumno1@alumnos.staging.mx" "$STUDENT1_PASS")
export JWT_STUDENT2=$(login "alumno2@alumnos.staging.mx" "$STUDENT2_PASS")
export JWT_GUARDIAN=$(login "tutor1@staging.local" "$GUARDIAN_PASS")
```

**Evidencia esperada:** cada llamada devuelve `access_token` y `user.id`. Guardar el `user.id` de cada rol para las pruebas SQL.

### 3.2. Pruebas SQL con claims simulados

Para probar RLS directamente en PostgreSQL sin pasar por PostgREST:

```sql
-- Reemplazar <uuid> por el id real del usuario en staging
begin;
  set local role authenticated;
  set local request.jwt.claims = '{"sub":"<uuid-alumno1>","role":"authenticated"}';
  select count(*) from public.unit_versions;
rollback;
```

**Ventaja:** permite aislar la política de la API. **Cuidado:** `set local` debe ir dentro de una transacción; el `rollback` evita dejar el rol cambiado.

**Helper recomendado:**

```sql
create or replace function public.test_as(p_user uuid)
returns void
language plpgsql
as $$
begin
  perform set_config('role', 'authenticated', true);
  perform set_config('request.jwt.claims',
    json_build_object('sub', p_user, 'role', 'authenticated')::text, true);
end;
$$;
```

Uso:

```sql
begin;
select public.test_as('<uuid-alumno1>');
select count(*) from public.unit_versions;
rollback;
```

---

## 4. Pruebas de RLS

Cada prueba indica: **rol**, **consulta**, **esperado hoy**, **esperado después de la corrección** y **hallazgo** asociado.

> Los IDs de esta sección son **conceptuales**, para planear la verificación. La
> numeración ejecutable y autoritativa está en
> `app/supabase/tests/rls/rls-negative.mjs` (RLS-01…129); cuando difieran, manda
> la suite.

### 4.1. Contenido (SEC-01)

| # | Rol | Consulta | Esperado hoy | Esperado corregido | Hallazgo |
|---|---|---|---|---|---|
| RLS-01 | alumno sin asignación | `select count(*) from units` | > 0 | **0** | SEC-01 |
| RLS-02 | alumno sin asignación | `select count(*) from unit_versions` | > 0 | **0** | SEC-01 |
| RLS-03 | alumno con asignación A | `select unit_id from unit_versions` | todas | **solo A** | SEC-01 |
| RLS-04 | alumno con asignación cerrada | `select count(*) from unit_versions` | > 0 | **0** | SEC-01 |
| RLS-05 | alumno con asignación fuera de ventana | `select count(*) from unit_versions` | > 0 | **0** | SEC-01 |
| RLS-06 | alumno | `select content from unit_versions` | incluye `correctIndex` | **solo de su unidad** | SEC-01 |
| RLS-07 | profesor | `select count(*) from units` | todas (staff) | todas | — |
| RLS-08 | tutor | `select count(*) from unit_versions` | > 0 | **0** (no cursa) | SEC-01 |

**Consulta de verificación del contenido expuesto (solo lectura):**

```bash
curl -s "$SB_URL/rest/v1/unit_versions?select=unit_id,version,content&published_at=not.is.null" \
  -H "apikey: $SB_ANON" \
  -H "Authorization: Bearer $JWT_STUDENT2" | jq 'length'
```

**Evidencia:** número de filas y, si es > 0, confirmar que `content` incluye `correctIndex` (sin transcribir el contenido completo).

### 4.2. Datos de alumnos (PRIV-02)

| # | Rol | Consulta | Esperado hoy | Esperado corregido | Hallazgo |
|---|---|---|---|---|---|
| RLS-10 | alumno1 | `select * from students` | 1 fila con `notes_internal` | 1 fila **sin** `notes_internal` | PRIV-02 |
| RLS-11 | tutor1 | `select * from students` | 1 fila con `notes_internal` | 1 fila **sin** `notes_internal` | PRIV-02 |
| RLS-12 | alumno1 | `select count(*) from students` | 1 | 1 | — |
| RLS-13 | alumno2 | `select count(*) from students` | 1 (solo él) | 1 | — |
| RLS-14 | profesor | `select count(*) from students` | solo su grupo | solo su grupo | — |
| RLS-15 | alumno1 | `select * from student_staff_notes` | error/0 | error/0 | PRIV-02 |

### 4.3. Perfil vocacional (PRIV-03)

La familia ya **no** lee la tabla cruda `student_profiles`. Usa la vista curada
`student_guidance`, que no expone `weaknesses`, `vocational_notes` ni `extras`.

| # | Rol | Consulta | Esperado hoy | Esperado corregido | Hallazgo |
|---|---|---|---|---|---|
| RLS-20 | tutor1 | `select * from student_profiles` | solo su hijo, con `vocational_notes` | **0 filas** (RLS-47) | PRIV-03 |
| RLS-21 | alumno1 | `select * from student_profiles` | solo su fila | **0 filas** (RLS-19) | PRIV-03 |
| RLS-22 | alumno2 | `select count(*) from student_profiles` | 1 (solo él) | **0** | PRIV-03 |
| RLS-23 | profesor de otro grupo | `select count(*) from student_profiles` | 0 | 0 | — |
| RLS-24 | tutor1 (con consentimiento) | `select * from student_guidance` | no existía | solo su hijo, **sin** `weaknesses`/`vocational_notes`/`extras` (RLS-110) | PRIV-03 |
| RLS-25 | tutor3 | `select count(*) from student_guidance` | no existía | 0 si el alumno no está consentido (RLS-114/115) | PRIV-03 |
| RLS-26 | alumno1 | `select * from student_guidance` | no existía | solo su fila (RLS-113) | PRIV-03 |
| RLS-27 | profesor | `select * from student_guidance` | no existía | solo sus alumnos (RLS-116/117) | PRIV-03 |
| RLS-28 | admin | política `student_profiles_select` | usaba `app_can_access_student` | solo `app_is_admin`/`app_is_teacher_of_student` (RLS-111/112) | PRIV-03 |

### 4.4. Observaciones (familia vs. interno)

| # | Rol | Consulta | Esperado | Hallazgo |
|---|---|---|---|---|
| RLS-30 | tutor1 | `select visibility, body from observations` | solo `family` de su hijo | — |
| RLS-31 | alumno1 | `select visibility, body from observations` | solo `family` propios | — |
| RLS-32 | profesor | `select count(*) from observations` | solo de sus alumnos | — |
| RLS-33 | tutor2 (sin vínculo) | `select count(*) from observations` | 0 | — |

### 4.5. Finanzas (FUN-02, SEC-01)

| # | Rol | Consulta | Esperado hoy | Esperado corregido | Hallazgo |
|---|---|---|---|---|---|
| RLS-40 | alumno1 | `select count(*) from payments` | **0** (0021) | 0 | — |
| RLS-41 | alumno1 | `select count(*) from student_billing` | **0** (0021) | 0 | — |
| RLS-42 | tutor1 | `select count(*) from payments` | solo de su hijo | solo de su hijo | — |
| RLS-43 | tutor1 | `insert into payments ...` | **falla** (solo lectura) | falla | — |
| RLS-44 | profesor | `select count(*) from payments` | solo de sus alumnos | solo de sus alumnos | — |
| RLS-45 | alumno1 | `select count(*) from student_billing_status` | no existía | **0** (RLS-125) | FUN-02 |
| RLS-46 | tutor1 (sin consentimiento) | `select count(*) from student_billing_status` | no existía | **0** (RLS-126) | FUN-02 |
| RLS-47 | tutor3 | `select count(*) from student_billing_status where student_id <> alumno2` | no existía | **0** (RLS-127) | FUN-02 |
| RLS-48 | profesor | `select * from student_billing_status` | no existía | solo sus alumnos (RLS-128/129) | FUN-02 |
| RLS-49 | admin | `pg_policies` de `payments` | había `DELETE` | **sin** política `DELETE` (RLS-119) | FUN-02 |
| RLS-50 | admin | `pg_proc` de `app_void_payment` | no existía | `SECURITY DEFINER` con `search_path` fijo (RLS-120) | FUN-02 |

### 4.6. Consentimientos (PRIV-01)

| # | Rol | Consulta | Esperado | Hallazgo |
|---|---|---|---|---|
| RLS-50 | tutor1 | `select * from privacy_consents` | solo de su hijo | — |
| RLS-51 | alumno1 | `select * from privacy_consents` | solo los propios | PRIV-01 |
| RLS-52 | tutor2 | `select count(*) from privacy_consents` | 0 | — |
| RLS-98 | tutor1 (sin consentimiento) | `select count(*) from students` | **0** | PRIV-01 |
| RLS-99 | tutor1 (sin consentimiento) | `select count(*) from profiles where id = alumno1` | **0** | PRIV-01 |
| RLS-100 | tutor1 (sin consentimiento) | `select count(*) from groups where id = grupo1` | **0** | PRIV-01 |
| RLS-101 | tutor1 (sin consentimiento) | `select count(*) from student_guardians` | **1** (su vínculo, para aceptar) | PRIV-01 |
| RLS-102 | tutor1 (sin consentimiento) | `select count(*) from student_billing` + `payments` | **0** | PRIV-01 |
| RLS-103 | tutor3 (con consentimiento) | `select count(*) from students` | **1** (solo el consentido) | PRIV-01 |
| RLS-104 | tutor3 | perfil de alumno1 (consentimiento revocado) | **0** | PRIV-01 |
| RLS-105 | tutor3 | `app_guardian_has_consent(alumno2)` y `(alumno1)` | **true** y **false** | PRIV-01 |
| RLS-106 | anon | `select * from privacy_document` | 1 fila con versión, URL y hash | PRIV-01 |
| RLS-107 | tutor1 | política `privacy_consents_guardian_insert` | **no existe** | PRIV-01 |

### 4.7. Grupos y perfiles

| # | Rol | Consulta | Esperado | Hallazgo |
|---|---|---|---|---|
| RLS-60 | profesor A | `select * from groups` | solo grupo A | — |
| RLS-61 | profesor A | `select * from profiles` | solo su grupo + él | — |
| RLS-62 | alumno1 | `select count(*) from profiles` | 1 (él) | — |
| RLS-63 | tutor1 | `select count(*) from profiles` | él + su hijo | — |

---

## 5. Pruebas de autenticación e identidad

### 5.1. SEC-03 · Cambio obligatorio de contraseña

**Precondición:** alumno con `must_change_password = true` y contraseña temporal conocida.

| # | Paso | Esperado hoy | Esperado corregido |
|---|---|---|---|
| AUTH-01 | Login con temporal | éxito | éxito |
| AUTH-02 | `rpc('app_complete_password_change')` sin cambiar contraseña | limpia la bandera | **la función ya no existe (RLS-89)** |
| AUTH-02b | `update profiles set must_change_password=false` por REST | — | **0 filas (RLS-91)** |
| AUTH-03 | Cerrar sesión, entrar con la temporal | éxito | **falla** |
| AUTH-04 | Cambiar contraseña por el flujo normal (Edge Function) | éxito | éxito y `password_changed_at` (RLS-90) |
| AUTH-05 | Entrar con la temporal tras el cambio | falla | falla |
| AUTH-06 | Entrar con la nueva | éxito | éxito |

```bash
# AUTH-02 (con JWT del alumno): debe responder 404 (función eliminada)
curl -s -X POST "$SB_URL/rest/v1/rpc/app_complete_password_change" \
  -H "apikey: $SB_ANON" \
  -H "Authorization: Bearer $JWT_STUDENT1" \
  -H "Content-Type: application/json" -d '{}'
```

**Evidencia:** respuesta de la RPC y valor de `profiles.must_change_password` antes y después.

### 5.2. SEC-04 · Desactivación

**Precondición:** `0028_offboarding.sql` aplicada y `deactivate-user` desplegada
con la versión que banea en Auth.

| # | Paso | Esperado hoy | Esperado corregido |
|---|---|---|---|
| AUTH-10 | Admin desactiva a alumno2 con motivo | `profiles.active=false` | además `banned_until`, `deactivated_at`, `deactivated_by` y `deactivation_reason` (RLS-108/109) |
| AUTH-11 | Alumno2 intenta login | **éxito** (falla en app) | **falla en Auth** (`400`/`403`) |
| AUTH-12 | Alumno2 usa su JWT anterior | RPC que solo valida `auth.uid()` funciona | falla al refrescar; el `access_token` caduca y no se renueva |
| AUTH-13 | Admin reactiva | login funciona | login funciona, `banned_until = none`, rastro en `audit_log` |
| AUTH-14 | Revisar `audit_log` | solo `profiles.active` | `user.deactivated`/`user.reactivated` con actor, motivo y antes/después |
| AUTH-15 | Simular fallo del update de `profiles` | queda baneado sin registro | la función compensa el ban y devuelve error |

**Evidencia:** código HTTP del login tras desactivar, fila de `profiles` y
entradas de `audit_log` (sin tokens).

### 5.3. SEC-02 · Invitación y canje de token

**Precondición:** profesor con un grupo; alumno ficticio sin cuenta previa.

| # | Paso | Esperado corregido |
|---|---|---|
| AUTH-20 | Intentar `rpc('app_link_student_account')` | **404: la función ya no existe (RLS-95)** |
| AUTH-21 | El staff genera una invitación | cuenta creada, token de 72 h, `must_change_password=true`, auditado |
| AUTH-22 | El alumno abre el enlace y define su contraseña | éxito, `password_changed_at`, `must_change_password=false`, auditado |
| AUTH-23 | Reusar el mismo token | **falla** con `400` y mensaje genérico |
| AUTH-24 | Usar un token expirado o revocado | **falla** |
| AUTH-25 | Canjear con contraseña débil | **falla**; el token sigue disponible para reintentar |
| AUTH-26 | Un profesor de otro grupo intenta emitir | **403** |
| AUTH-27 | Alumno, profesor o admin leen `student_link_tokens` por REST | **0 filas (RLS-92…94)** |
| AUTH-28 | Revisar `audit_log` | `student.link_token_issued` y `student.link_token_redeemed`, sin token en claro |

```bash
# AUTH-20 (con JWT de profesor): debe responder 404 (función eliminada)
curl -s -X POST "$SB_URL/rest/v1/rpc/app_link_student_account" \
  -H "apikey: $SB_ANON" \
  -H "Authorization: Bearer $JWT_TEACHER" \
  -H "Content-Type: application/json" \
  -d '{"p_email":"alumno@ejemplo.mx","p_full_name":"Alumno Prueba","p_group_id":"'"$GROUP_ID"'"}'

# AUTH-21: la Edge Function devuelve el token una sola vez.
# No se debe registrar en logs ni en el repositorio.
curl -s -X POST "$SB_URL/functions/v1/issue-student-link-token" \
  -H "apikey: $SB_ANON" \
  -H "Authorization: Bearer $JWT_TEACHER" \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Alumno Prueba","group_id":"'"$GROUP_ID"'"}'

# AUTH-22: el canje es público; el token es la prueba de titularidad.
curl -s -X POST "$SB_URL/functions/v1/redeem-student-link-token" \
  -H "apikey: $SB_ANON" \
  -H "Content-Type: application/json" \
  -d '{"token":"'"$LINK_TOKEN"'","new_password":"NuevaClave2026"}'
```

**Evidencia:** respuestas HTTP, filas de `audit_log`, `profiles.password_changed_at` y ausencia del token en claro en la base y en los logs.

### 5.4. SEC-05 / SEC-06 · CORS e invitación por correo

| # | Paso | Esperado corregido |
|---|---|---|
| AUTH-30 | Invitar tutor desde el panel | `201` con `delivery: "email"` y `email_id`; sin `magic_link` ni `whatsapp_share_url` |
| AUTH-31 | Consultar `email_outbox` | fila `guardian_invite` en `pending` con el enlace solo en el payload |
| AUTH-32 | Abrir el enlace del correo en otro navegador | funciona una vez (procesador de correo pendiente) |
| AUTH-33 | Reabrir el enlace | falla |
| AUTH-34 | Llamar a una función con `Origin` del entorno | `200/201` y `Access-Control-Allow-Origin` igual al origen |
| AUTH-35 | Llamar con `Origin: https://origen-no-autorizado.invalid` | **403** (RLS/CORS; `test-functions.mjs` lo verifica) |
| AUTH-36 | Llamar sin `Origin` (health check) | permitido |

**Evidencia:** respuesta HTTP sin enlaces, fila de `email_outbox`, evento
`guardian.invited` en `audit_log` con `delivery: "email"` y salida de la prueba
CORS negativa.

---

## 6. Pruebas funcionales

### 6.1. Activación de unidades (FUN-03, DB-01)

| # | Paso | Esperado hoy | Esperado corregido |
|---|---|---|---|
| FUN-10 | Activar unidad para 2 de 5 alumnos | asignación de grupo + 3 overrides `closed` | audiencia explícita |
| FUN-11 | Agregar un alumno nuevo al grupo | **ve la unidad** | **no la ve** |
| FUN-12 | Activar la misma unidad dos veces | **crea otra asignación** | reutiliza o bloquea |
| FUN-13 | Cerrar y reabrir | progreso se conserva | progreso se conserva |

**Consulta de duplicados:**

```sql
select group_id, unit_id, count(*)
from public.unit_assignments
group by 1,2 having count(*) > 1;
```

### 6.2. Estudio y evaluación (DB-03, DB-04, FUN-04, FUN-05)

| # | Paso | Esperado hoy | Esperado corregido |
|---|---|---|---|
| FUN-20 | Abrir unidad sin responder nada | funciona | funciona |
| FUN-21 | `rpc('app_complete_unit')` sin actividades | **completed** | **falla** |
| FUN-22 | `rpc('app_sync_player_state', {xp: 999999})` | **acepta** | **rechaza o calcula** |
| FUN-23 | Quiz: fallar y reintentar 10 veces | **permite** | límite según política |
| FUN-24 | Ejercicio con respuesta correcta | `is_correct=true` en servidor | igual |
| FUN-25 | Ejercicio con respuesta incorrecta | `is_correct=false` | igual |
| FUN-26 | Manipular el payload de respuesta | no altera `is_correct` | igual |

```bash
# FUN-21
curl -s -X POST "$SB_URL/rest/v1/rpc/app_complete_unit" \
  -H "apikey: $SB_ANON" -H "Authorization: Bearer $JWT_STUDENT1" \
  -H "Content-Type: application/json" \
  -d '{"p_assignment_id":"<uuid>"}'
```

```bash
# FUN-22
curl -s -X POST "$SB_URL/rest/v1/rpc/app_sync_player_state" \
  -H "apikey: $SB_ANON" -H "Authorization: Bearer $JWT_STUDENT1" \
  -H "Content-Type: application/json" \
  -d '{"p_payload":{"xp":999999,"racha":999,"best":999,"done":[]}}'
```

**Evidencia:** respuesta JSON y valor de `student_stats.xp_total` antes y después.

### 6.3. Pagos (FUN-02)

**Precondición:** `0029_payments_traceability.sql` aplicada y el panel nuevo
desplegado.

| # | Paso | Esperado hoy | Esperado corregido |
|---|---|---|---|
| FUN-30 | Registrar pago mensual | se guarda | se guarda con `period_start`/`period_end`, `status='paid'` y folio `REC-<año>-<n>` |
| FUN-31 | Registrar el mismo pago dos veces | **se duplica** | rechaza por `idempotency_key`/duplicado activo; los heredados aparecen en `payment_duplicates` (RLS-122/124) |
| FUN-32 | Consultar saldo del alumno | **no existe** | `student_billing_status` devuelve periodo, esperado, pagado, saldo y estado (RLS-121) |
| FUN-33 | Anular un pago | **no existe** | `app_void_payment` exige motivo, marca `voided`, conserva la fila y audita (RLS-120) |
| FUN-34 | Tutor consulta pagos | solo lectura | solo lectura + estado de cuenta y recibos |
| FUN-35 | Alumno consulta pagos | 0 filas | 0 filas (RLS-125) |
| FUN-36 | Borrar un pago por PostgREST | **lo borra** | **falla**: no hay política `DELETE` (RLS-119) |
| FUN-37 | Reactivar un pago anulado por REST | no aplicaba | **falla**; hay que registrar uno nuevo |
| FUN-38 | Anular por PostgREST (no por RPC) | no dejaba rastro | el trigger `app_payments_before_write` registra `payment.voided` en `audit_log` (RLS-123) |
| FUN-39 | Descargar recibo | **no existe** | **pendiente**: el folio y el periodo ya están; falta el PDF |

```sql
-- FUN-32: estado de cuenta por alumno y periodo
select student_id, period_start, period_end, expected_amount, paid_amount, balance, status
from public.student_billing_status
where student_id = '<uuid-alumno1>'
order by period_start desc;
```

### 6.4. Panel del tutor (FUN-01)

| # | Paso | Esperado hoy | Esperado corregido |
|---|---|---|---|
| FUN-40 | Tutor entra | ve hijos, consentimiento, pagos | además avance, calificaciones, asistencia, observaciones `family` y tareas |
| FUN-41 | Tutor intenta editar | sin controles | sin controles y con etiqueta “Solo lectura” |
| FUN-42 | Tutor ve calificación no visible | 0 | 0 |
| FUN-43 | Tutor con consentimiento revocado | — | panel bloqueado, sin datos académicos |
| FUN-44 | Alumno sin actividad | panel vacío sin errores | estados vacíos explícitos |
| FUN-45 | Tutor abre el perfil vocacional | veía `vocational_notes` | solo `student_guidance` (intereses, aptitudes, fortalezas, carrera de interés) |

---

## 7. Pruebas de privacidad

| # | Paso | Esperado hoy | Esperado corregido | Hallazgo |
|---|---|---|---|---|
| PRIV-10 | Tutor nuevo entra | ve datos antes de aceptar | **bloqueado hasta aceptar** | PRIV-01 |
| PRIV-11 | Botón de consentimiento | no abre texto | abre el aviso | PRIV-01 |
| PRIV-12 | Aceptar | guarda versión, IP, UA | además hash y URL | PRIV-01 |
| PRIV-13 | Revocar | **no hay botón** | revoca y bloquea | PRIV-01 |
| PRIV-14 | Revisar `localStorage` tras cerrar sesión | quedan claves `ecoems_*` | se limpian | PRIV-04 |
| PRIV-15 | Solicitar eliminación de datos | **no hay canal** | solicitud registrada | PRIV-06 |
| PRIV-16 | Revisar respaldo en disco | JSON legible con PII | cifrado y sin `auth.users` | PRIV-05 / OPS-01 |
| PRIV-17 | Comparar el hash de `privacidad.html` con `settings` y `privacy_document` | no existía | coinciden (`node scripts/privacy-doc.mjs --check`) | PRIV-01 |
| PRIV-18 | Insertar un consentimiento por PostgREST como tutor | no había política | **falla**; solo lo registra `guardian-consent` (RLS-107) | PRIV-01 |
| PRIV-19 | Tutor con consentimiento lee el perfil vocacional | veía la fila cruda | solo `student_guidance`; no ve `weaknesses`, `vocational_notes` ni `extras` (RLS-110) | PRIV-03 |
| PRIV-20 | Comparar el aviso vigente con `settings` | `v2-2026` | `v3-2026` con hash `85d13859…f740b`; el manifiesto coincide | PRIV-03 |

**Estado de PRIV-10…13, PRIV-17/18 y PRIV-19/20:** implementado en
`0027_privacy_notice.sql`, `0030_vocational_visibility.sql`, `0031_privacy_notice_v3.sql`,
`guardian-consent` y el panel del tutor; falta la verificación E2E en staging.
El aviso se publica como `v3-2026` con la finalidad educativa del perfil
vocacional y banner de revisión legal; la validación por abogado sigue
pendiente. Los consentimientos `v2-2026` dejan de ser vigentes al aplicar
`0031`.

**Comprobación de `localStorage`:**

```js
// En la consola del navegador, tras cerrar sesión
Object.keys(localStorage).filter(k => k.startsWith('ecoems_') || k.startsWith('curso_'));
// Esperado corregido: ninguna clave; se limpian también las heredadas
// (lectura_reto_v1, mate_reto_v1, curso_comipems_v1, …)
```

---

## 8. Pruebas de operación

### 8.1. Respaldo y restauración (OPS-01, OPS-02)

**Solo en staging.** Ejecutar el ciclo completo:

```bash
# 1. Respaldo cifrado (excluye auth.*, permisos 600, retención 30 días)
DATABASE_URL="$(cat .secrets/staging-database-url)" node scripts/backup-db.mjs

# 2. Verificar el archivo y su checksum
ls -la .backups/
shasum -a 256 -c .backups/<archivo>.sha256

# 3. Modificar un dato de prueba (W)
# 4. Restaurar (exige confirmación explícita)
DATABASE_URL="$(cat .secrets/staging-database-url)" \
  node scripts/restore-db.mjs .backups/<archivo>.enc --confirm=restore

# 5. Verificar que el dato volvió y revisar restore.log
```

| # | Prueba | Esperado hoy | Esperado corregido |
|---|---|---|---|
| OPS-10 | Respaldo sin cifrar | archivo legible | AES-256-GCM; sin llave no se lee |
| OPS-11 | Respaldo incluye `auth.users` | sí | no; `--include-auth` exige `ALLOW_AUTH_BACKUP=1` |
| OPS-12 | Restore sin confirmación | ejecuta | **aborta** sin `--confirm=restore` |
| OPS-13 | Restore con URL de producción | **ejecuta** | **aborta** salvo `--i-know` |
| OPS-14 | Restore con archivo corrupto | falla a mitad | valida checksum, conteos y tablas antes de escribir |
| OPS-15 | Restore deja log | no | `restore.log` con fecha, archivo, checksum y resultado |
| OPS-16 | Respaldo previo automático | no | el restore genera un respaldo antes de truncar |
| OPS-17 | Retención | manual | borra respaldos de más de 30 días y lo registra en `backup.log` |

### 8.2. Smoke E2E (OPS-03)

```bash
cd app
APP_ENV=staging TEST_WRITE=1 node scripts/ui-smoke.mjs
```

| # | Prueba | Esperado hoy | Esperado corregido |
|---|---|---|---|
| OPS-20 | `TEST_WRITE=1` con URL de producción | escribe | **aborta** |
| OPS-21 | `TEST_WRITE=1` con staging | escribe | escribe y limpia |
| OPS-22 | Smoke sin `TEST_WRITE` | solo lectura | solo lectura |
| OPS-23 | Scripts contienen PII | sí (`test-functions.mjs:105`) | no |

### 8.3. Edge Functions

```bash
cd app
node scripts/test-functions.mjs
```

| # | Prueba | Esperado |
|---|---|---|
| OPS-30 | `deactivate-user` sin token | 401 |
| OPS-31 | `deactivate-user` con token de alumno | 403 |
| OPS-32 | `deactivate-user` con admin | 200 |
| OPS-33 | `admin-create-student` con profesor de otro grupo | 403 |
| OPS-34 | `guardian-consent` con alumno | 403 |
| OPS-35 | `guardian-consent` con versión incorrecta | 409 |
| OPS-36 | CORS con origen no permitido | rechazo (corregido) |
| OPS-37 | `deactivate-user` con admin y motivo | 200 + ban en Auth + `audit_log` (SEC-04) |
| OPS-38 | `deactivate-user` reactivando | 200 + `banned_until=none` |

### 8.4. Migraciones, CI y despliegue (DB-07, OPS-04)

```bash
# Solo lectura: compara migraciones aplicadas con los archivos locales
DATABASE_URL="$(cat .secrets/staging-database-url)" \
  node scripts/verify-migrations.mjs --out=.backups/migrations-staging.json
```

| # | Prueba | Esperado hoy | Esperado corregido |
|---|---|---|---|
| OPS-40 | `verify-migrations.mjs` contra staging | no existía | 39 migraciones aplicadas, sin faltantes ni sobrantes (**obtenido**) |
| OPS-40b | `verify-migrations.mjs` contra producción (solo lectura) | no existía | **Ejecutado:** 22/38 aplicadas, 16 faltantes (`0023`–`0038`), 0 desconocidas, `exit 1` esperado; sin escrituras |
| OPS-41 | `verify-migrations.mjs` detecta `SECURITY DEFINER` sin `search_path` | no existía | lista vacía o justificada (en producción: 0) |
| OPS-42 | Push a `main` | `git push -f` manual | CI construye, valida el aviso y publica en `gh-pages` |
| OPS-43 | Fallo de build o de `privacy-doc --check` | se publicaba igual | el workflow se detiene y no publica |
| OPS-44 | Despliegue correcto | sin etiqueta | etiqueta `deploy-<sha>` y health check |
| OPS-45 | Rollback | manual y lento | volver a una etiqueta anterior en menos de 15 minutos |

**Resultado real en staging (21 nov 2026):** la primera ejecución dio
**19 FAIL**. Tres causas: falta de `SELECT` en `payments`, `student_billing` y
`student_staff_notes`; `app_can_view_profile` exponía tutores a alumnos; y dos
pruebas estaban mal formuladas (`RLS-132` rechazaba un insert con RLS y
`RLS-134` esperaba 3 funciones donde solo hay 1). Se corrigió con
`0039_staging_rls_fixes.sql`, `denyIsPass` en el runner y `count(*) = 1`.
La segunda ejecución quedó en **131 PASS · 0 FAIL · 0 SKIP · 131 total**, más
4 comprobaciones de identidad: **135/135**. `test-functions.mjs` terminó en
PASS y `npm run build:staging` compiló correctamente.

---

## 9. Pruebas de accesibilidad y UX

| # | Prueba | Herramienta | Esperado |
|---|---|---|---|
| UX-10 | Navegación completa con teclado | Manual | foco visible en todo |
| UX-11 | Diálogo: foco atrapado | Manual | Tab no sale del diálogo |
| UX-12 | Cerrar diálogo con Escape | Manual | cierra y restaura foco |
| UX-13 | Contraste de texto | axe / Lighthouse | AA |
| UX-14 | Lector de pantalla en login | VoiceOver/NVDA | anuncia campos y errores |
| UX-15 | Vista a 360 px | DevTools | sin scroll horizontal |
| UX-16 | `prefers-reduced-motion` | DevTools | sin animaciones |
| UX-17 | Formularios con error | Manual | error asociado al campo |

**Comando sugerido (Lighthouse):**

```bash
npx lighthouse https://<staging>/ --only-categories=accessibility --output=json
```

---

## 9.1. Pruebas de Fase 3 (P2 · 30 días)

Todas requieren `0032`–`0038` aplicadas en staging. **No ejecutar en
producción.** Las pruebas marcadas **W** escriben datos ficticios; las demás
son de solo lectura o transaccionales con `ROLLBACK`.

| # | Prueba | Hallazgo | Esperado |
|---|---|---|---|
| P3-01 | Crear dos asignaciones de la misma unidad en un grupo | DB-01 | la segunda falla por `unit_assignments_group_unit_uq` |
| P3-02 | Crear alumno nuevo en grupo con asignación activa | FUN-03 | hereda la audiencia explícita solo según la política de la asignación |
| P3-03 | Anonimizar un alumno ficticio con historial | DB-02 | seudónimo, sin `birth_date`, sin notas/consentimientos/vínculos; historial académico y financiero conservado |
| P3-04 | Verificar `auth.users` tras la anonimización | DB-02 | **sigue existiendo**; el borrado definitivo es una acción separada |
| P3-05 | Responder un ejercicio dos veces | DB-03 | un solo evento de XP por `source_id` nuevo (índice parcial) |
| P3-06 | Llamar a `app_sync_player_state` con XP inflado | DB-03 / COD-02 | el XP se calcula desde eventos, no desde el valor del cliente |
| P3-07 | Completar unidad sin responder nada | DB-04 / FUN-05 | falla; `app_unit_requirements` devuelve `can_complete = false` y el motivo |
| P3-08 | Responder menos del 60 % de ejercicios o menos del 70 % de precisión | FUN-05 | el botón sigue deshabilitado y explica qué falta |
| P3-09 | Agotar los intentos de una pregunta | FUN-04 | se respeta `max_attempts = 3`; con `0`, sin límite |
| P3-10 | Solicitar recuperación de contraseña | FUN-06 | correo enviado; la UI no revela si la cuenta existe; `PASSWORD_RECOVERY` pide nueva contraseña |
| P3-11 | Ver historial de pagos con más de 20 filas | FUN-09 | “Mostrando X de Y” y controles Anterior/Siguiente accesibles |
| P3-12 | Abrir la pestaña admin `auditoria` | FUN-10 | eventos y solicitudes sin `before`/`after` |
| P3-13 | Crear y resolver una solicitud ARCO | PRIV-06 | plazo de 20 días, estado, resolución y evento en `audit_log` |
| P3-14 | Cerrar sesión y revisar `localStorage` | PRIV-04 / COD-01 | sin claves `ecoems_*` ni heredadas |
| P3-15 | Navegar con teclado, abrir y cerrar cada diálogo | UX-01 / UX-02 | skip link, foco visible, Tab atrapado, Escape cierra y restaura foco |
| P3-16 | Correr `staging-check.mjs` y la suite RLS (W) | OPS-07 / OPS-09 | 39/41/93/≥53 y 0 FAIL en 135 verificaciones (**obtenido**) |

**Estado:** preparado en código, **sin ejecutar**. Los bloqueos son staging
(`OPS-09`), el procesador de `email_outbox` y la validación legal del aviso.

---

## 10. Matriz de cobertura

| Hallazgo | Prueba(s) | Tipo |
|---|---|---|
| SEC-01 | RLS-01…08 | SQL / HTTP |
| SEC-02 | AUTH-20…28 + RLS-92…97 | E2E / SQL |
| SEC-03 | AUTH-01…06 + RLS-89…91 | E2E / SQL |
| PRIV-01 | PRIV-10…13, PRIV-17/18 + RLS-98…107 | E2E / SQL |
| SEC-04 | AUTH-10…15 + OPS-37/38 + RLS-108/109 | E2E / SQL |
| SEC-05 | OPS-36 | HTTP |
| SEC-06 | AUTH-30…33 | E2E |
| SEC-07 | AUTH-10…15 + auditoría | SQL |
| SEC-08 | Inspección de bundle | Estática |
| SEC-09 | Carga controlada | Manual |
| DB-01 | FUN-12 | SQL |
| DB-02 | Borrado de alumno de prueba | SQL (W) |
| DB-03 | FUN-22 | HTTP |
| DB-04 | FUN-21 | HTTP |
| DB-05 | Rebuild desde cero | SQL |
| DB-06 | Inspección de retención | SQL |
| DB-07 | OPS-40/41 (`verify-migrations.mjs`) | SQL (solo lectura) |
| DB-08 | RLS-16, RLS-50, RLS-85…88 | SQL |
| FUN-01 | FUN-40…45 | E2E |
| FUN-02 | FUN-30…39 + RLS-118…129 | E2E / SQL |
| FUN-03 | FUN-10…13 | E2E |
| FUN-04 | FUN-23 | E2E |
| FUN-05 | FUN-21 | E2E |
| FUN-06 | Flujo de recuperación | E2E |
| FUN-07 | Login con dominio alterno | Manual |
| FUN-08 | Medición de tiempo de carga | Manual |
| FUN-09 | Conteo con > límite | SQL |
| FUN-10 | Pantalla de auditoría | E2E |
| FUN-11 | Recarga tras logout | Manual |
| COD-01 | Inspección de `localStorage` | Manual |
| COD-02 | RLS-01…08, P3-06 | SQL / E2E |
| COD-03 | Revisión de interpolaciones | Estática |
| COD-04 | Ejecutar `npm run lint`/`test` | CI |
| COD-05 | Revisión de estructura | Estática |
| COD-06 | Forzar fallo de `localStorage` | Manual |
| COD-07 | Suite completa | CI |
| COD-08 | `npm ci` + `npm audit` | CI |
| COD-09 | Rebuild y comparación | CI |
| UX-01…08 | UX-10…17 | Manual / axe |
| PRIV-01 | PRIV-10…13 | E2E |
| PRIV-02 | RLS-16, RLS-50, RLS-85…88 | SQL |
| PRIV-03 | RLS-19/47, RLS-110…117, PRIV-19/20 | SQL / E2E |
| PRIV-04 | PRIV-14 | Manual |
| PRIV-05 | PRIV-16 / OPS-10, OPS-11, OPS-17 | Manual |
| PRIV-06 | PRIV-15 | E2E |
| PRIV-07 | Consulta de retención | SQL |
| PRIV-08 | AUTH-33 | Manual |
| OPS-01 | OPS-10, OPS-11, OPS-17 | Manual |
| OPS-02 | OPS-12…16 | Manual (W) |
| OPS-03 | OPS-20…23 | Script |
| OPS-04 | OPS-42…45 | CI |
| OPS-05 | Revisión de `config.toml` | Estática |
| OPS-06 | Revisión de permisos | Manual |
| OPS-07 | Simulación de fallo | Manual |
| OPS-08 | Simulación de rotación | Manual |
| OPS-09 | Existencia de staging | Manual |
| OPS-10 | Rebuild reproducible | CI |

---

## 11. Plantilla de evidencia

Cada prueba ejecutada debe dejar un registro como este:

```markdown
### <ID de prueba> · <título>

- Fecha: 2026-11-XX HH:MM
- Entorno: staging (<ref>)
- Rol: alumno1 (<uuid>)
- Comando / consulta: ...
- Resultado observado: ...
- Resultado esperado: ...
- Veredicto: PASA / FALLA
- Hallazgo relacionado: SEC-01
- Evidencia: captura o salida (sin PII)
- Notas: ...
```

**Reglas de evidencia:**

- No incluir tokens, contraseñas ni cadenas de conexión.
- No transcribir nombres, correos ni identificadores reales; usar `<uuid>` y `<correo>`.
- Si se captura pantalla, ocultar datos personales.
- Guardar la evidencia dentro de `AUDITORIA_ECOEMS/evidencias/` (subcarpeta permitida) o en el sistema de tickets.

---

## 12. Orden recomendado de ejecución

1. **Preparar staging** y usuarios ficticios.
2. **`verify-migrations.mjs`** (OPS-40/41): confirmar 39 migraciones aplicadas.
3. **RLS-01…08** (contenido): confirma `SEC-01` y sirve de línea base.
4. **RLS-16/50 y RLS-85…88** (notas internas).
5. **RLS-30…33** (observaciones).
6. **RLS-40…50** (finanzas y estado de cuenta).
7. **AUTH-01…06 + RLS-89…91** (contraseña).
8. **AUTH-20…28 + RLS-92…97** (invitaciones con token).
9. **RLS-98…107 + PRIV-10…13, PRIV-17/18, PRIV-20** (aviso y consentimiento).
10. **AUTH-10…15 + OPS-37/38 + RLS-108/109** (desactivación con ban).
11. **RLS-19/47, RLS-110…117 + PRIV-19** (perfil vocacional curado).
12. **FUN-30…39 + RLS-118…129** (pagos, saldo, duplicados y anulación).
13. **FUN-40…45** (panel del tutor).
14. **FUN-20…26** (estudio y evaluación).
15. **FUN-10…13** (activación).
16. **PRIV-14…16** (datos y respaldos).
17. **OPS-10…17** (respaldo/restore) — al final, porque modifica staging.
18. **OPS-20…23** (smoke).
19. **OPS-42…45** (CI y despliegue).
20. **UX-10…17** (accesibilidad).
21. **P3-01…16** (Fase 3: CORS, correo, DB-01/04, FUN-03/06, ARCO y UX).
22. **Repetir la suite de 135 verificaciones** después de cada corrección de Fase 3.

---

## 13. Lo que no se debe probar

| Prueba | Motivo |
|---|---|
| Cualquier escritura contra producción | Riesgo de contaminar datos reales |
| `TEST_WRITE=1` con la URL de producción | Activa unidades y completa tests |
| `restore-db.mjs` contra producción | Trunca tablas |
| Fuerza bruta de contraseñas | Abuso y bloqueo de cuentas |
| Escaneo de puertos o penetración activa | Fuera de alcance y sin autorización |
| Extracción masiva de datos | Viola privacidad y el acuerdo de auditoría |
| Cambio de políticas en el dashboard | Modifica producción |
| Rotación de claves | Requiere coordinación y actualización de clientes |

---

## 14. Criterio de cierre de las pruebas

Se considera que las pruebas pendientes están resueltas cuando:

- [ ] Existe staging con datos ficticios.
- [ ] Las pruebas RLS-01…08 demuestran 0 filas para el alumno sin asignación.
- [ ] Las pruebas RLS-16/50 y RLS-85…88 demuestran que `notes_internal` ya no existe y que `student_staff_notes` no es accesible a la familia.
- [ ] AUTH-01…06 y RLS-89…91 demuestran que la contraseña temporal deja de funcionar y que nadie puede limpiar la bandera sin cambiar la contraseña.
- [ ] AUTH-20…28 y RLS-92…97 demuestran que la vinculación exige token, que el token no se lee por REST y que no se puede reutilizar.
- [ ] RLS-98…107 y PRIV-10…13, PRIV-17/18, PRIV-20 demuestran el bloqueo, la evidencia, la revocación, la ausencia de inserción directa de consentimientos y el aviso `v3-2026`.
- [ ] AUTH-10…15, OPS-37/38 y RLS-108/109 demuestran que el usuario desactivado no puede autenticarse y que queda rastro del actor y del motivo.
- [ ] RLS-19/47, RLS-110…117 y PRIV-19 demuestran que la familia no lee `student_profiles` crudo ni las notas internas.
- [ ] FUN-30…39 y RLS-118…129 demuestran periodo, saldo, duplicados, anulación auditada y ausencia de `DELETE`; el recibo PDF queda implementado.
- [ ] FUN-40…45 demuestran el panel del tutor de solo lectura con avance, calificaciones, asistencia, tareas y observaciones `family`.
- [ ] FUN-21/22 demuestran que no se puede completar en vacío ni inflar XP.
- [ ] OPS-12…16 demuestran que el restore exige confirmación, respalda antes, valida el checksum y deja log.
- [x] OPS-40/41 demuestran qué migraciones están aplicadas (39/39 en staging) y que no hay `SECURITY DEFINER` sin `search_path`.
- [ ] OPS-20 demuestra que `TEST_WRITE=1` no escribe en producción.
- [ ] OPS-42…45 demuestran que el despliegue es reproducible, etiquetado y reversible sin `push -f`.
- [ ] La suite corre en CI y bloquea el despliegue si falla.
- [ ] Cada prueba tiene evidencia registrada sin PII.

---

## 15. Conclusión

La auditoría encontró los problemas leyendo el código; las pruebas deben **demostrar que están cerrados**. La diferencia es importante: una política puede parecer correcta y fallar por una función `SECURITY DEFINER`, un `grant` olvidado o una vista que hereda permisos.

La suite propuesta no es exhaustiva, pero cubre **todos los hallazgos, con énfasis en los de mayor riesgo**, y establece el hábito que hoy falta: probar la denegación, no solo el camino feliz. Ese hábito, más que cualquier migración, es lo que impide que `SEC-01` vuelva a ocurrir.
