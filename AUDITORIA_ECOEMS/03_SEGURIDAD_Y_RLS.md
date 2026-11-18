# 03 · Seguridad y RLS

## 1. Resumen

La seguridad de la plataforma descansa en **tres capas**:

1. **Supabase Auth** para identidad y sesión.
2. **RLS de PostgreSQL** para autorización por fila.
3. **Funciones `SECURITY DEFINER`** para operaciones privilegiadas controladas.

La revisión encontró una **base sólida**: las 38 tablas tienen RLS, las 52 funciones `SECURITY DEFINER` fijan `search_path`, y la evaluación de respuestas ocurre en el servidor. Pero también encontró **una política permisiva que anula el control de acceso al contenido** (`SEC-01`) y **tres debilidades de identidad/offboarding** (`SEC-02`, `SEC-03`, `SEC-04`).

**Nivel de riesgo de seguridad:** **Crítico** por `SEC-01`; el resto es manejable con las correcciones propuestas.

---

## 2. Modelo de autenticación

### 2.1. Proveedor

- Supabase Auth con **email + contraseña**.
- Los alumnos usan un correo sintético: `usuario@alumnos.ecoems.mx` (`frontend/src/lib/supabase.js:5,19-26`).
- Los profesores y tutores usan correo real.
- Los tutores también pueden entrar con **magic link** generado por `invite-guardian` y compartido por WhatsApp.

### 2.2. Sesión

- `supabase-js` persiste la sesión en el almacenamiento del navegador (`persistSession: true`, `autoRefreshToken: true`, `detectSessionInUrl: true`).
- `handleSession` consulta `profiles` y rechaza perfiles inactivos (`app.js:738-760`).
- `onAuthStateChange` escucha cambios de sesión (`app.js:7059`).
- `signOut` limpia el estado local y vuelve al login (`app.js:7028-7040`).

### 2.3. Roles

| Rol | Origen | Verificación |
|---|---|---|
| `admin` | `profiles.role` | `app_is_admin()` |
| `teacher` | `profiles.role` | `app_is_staff()` + pertenencia a grupo |
| `student` | `profiles.role` + `students.status='active'` | `app_current_role()` + `app_student_id()` |
| `guardian` | `profiles.role` + `guardians.active` | `app_is_guardian_of()` |

### 2.4. Lo que no se pudo verificar

- Si el **autorregistro** está habilitado.
- Si la **confirmación de correo** es obligatoria.
- La **expiración** de sesión y de magic links.
- Los **rate limits** de Auth.
- La **política de contraseñas** (longitud, complejidad, reutilización).
- Si hay **MFA** disponible.

Estas variables cambian la severidad de `SEC-02` y `SEC-03`; se documentan como confianza Media cuando dependen de ellas.

---

## 3. Funciones de autorización

Las funciones viven en `0003_rls.sql` y son `SECURITY DEFINER` con `set search_path = public, pg_temp` y `set row_security = off`.

| Función | Qué responde | Línea |
|---|---|---|
| `app_current_role()` | Rol del usuario autenticado, solo si `active` | `0003:1` |
| `app_is_admin()` | ¿Es admin activo? | `0003:16` |
| `app_is_staff()` | ¿Es admin o teacher activo? | `0003:33` |
| `app_student_id()` | `students.id` del usuario autenticado, solo si activo | `0003:50` |
| `app_is_own_student(id)` | ¿El usuario es ese alumno activo? | `0003:113` |
| `app_is_own_guardian(id)` | ¿El usuario es ese tutor activo? | `0003:130` |
| `app_is_guardian_of(student_id)` | ¿El usuario es tutor activo de ese alumno activo? | `0003:147` |
| `app_student_in_group(group_id)` | ¿El alumno autenticado está en el grupo? | `0003:167` |
| `app_guardian_has_student_in_group(group_id)` | ¿El tutor tiene un alumno en el grupo **con consentimiento vigente**? | `0027` |
| `app_can_access_student(student_id)` | Admin, profesor, alumno propio o tutor **con consentimiento vigente** | `0027` |
| `app_can_access_group(group_id)` | Admin, profesor, alumno o tutor del grupo con consentimiento | `0027` |
| `app_can_view_profile(profile_id)` | Admin, propio, profesor o vínculo familiar con consentimiento | `0027` |
| `app_can_view_billing(student_id)` | Personal o tutor con consentimiento (el alumno no ve finanzas) | `0027` |
| `app_guardian_has_consent(student_id)` | ¿El tutor autenticado aceptó la versión vigente para ese alumno? | `0027` |
| `app_setting_text(p_key)` | Lee un ajuste de texto sin exponer `settings` | `0027` |
| `app_can_view_guardian(guardian_id)` | Admin o vínculo con el tutor | `0003:271` |
| `app_has_active_assignment(assignment_id)` | Asignación visible, activa, en ventana, con override y versión publicada | `0003:294` |
| `app_has_active_unit(unit_id)` | ¿Hay alguna asignación activa para esa unidad? | `0003:324` |
| `app_can_access_version(version_id)` | ¿Hay alguna asignación activa para esa versión? | `0003:340` |
| `app_can_manage_student_assignment(...)` | Admin o profesor del grupo | `0003:356` |
| `app_can_manage_attendance(...)` | Admin o profesor del grupo | `0003:374` |
| `app_can_view_grade(...)` | Admin, profesor, o familia si la evaluación es visible | `0003:443` |
| `app_can_manage_message(...)` | Admin, profesor o tutor del alumno | `0003:463` |

### 3.1. Observación positiva

Todas las funciones que consultan `auth.uid()` verifican `active` en `profiles` o en `students`/`guardians`. Un perfil inactivo no obtiene rol ni acceso a datos por RLS.

### 3.2. Observación de diseño

`app_can_access_student` es una **función ómnibus** que incluye al alumno propio y al tutor. Se usa para tablas con datos sensibles (`students`, `student_profiles`, `unit_progress`, `exercise_attempts`, `quiz_attempts`, `student_stats`, `attendance`, `task_status`). Eso significa que **todo lo que se protege con esa función es visible para el alumno y su tutor**, aunque la UI no lo muestre. Es la raíz de `PRIV-02` y `PRIV-03`.

---

## 4. Matriz RLS

### 4.1. Cobertura

- **38/38 tablas** con `enable row level security`.
- **Ninguna** tabla de `public` sin RLS.
- **52 funciones `SECURITY DEFINER`**, todas con `search_path` fijo.

### 4.2. Políticas por tabla

| Tabla | SELECT | INSERT | UPDATE | DELETE | ALL (admin) |
|---|---:|---:|---:|---:|---:|
| `academic_years` | 1 | — | — | — | 1 |
| `assessments` | 1 | — | — | — | 1 |
| `attendance` | 1 | — | — | — | 1 |
| `attendance_sessions` | 1 | — | — | — | 1 |
| `audit_log` | 1 | — | — | — | — |
| `badges` | 1 | — | — | — | 1 |
| `email_outbox` | 1 | — | — | — | — |
| `exercise_attempts` | 1 | — | — | — | 1 |
| `game_catalog` | 1 | — | — | — | 1 |
| `game_sessions` | 1 | — | — | — | 1 |
| `grades` | 1 | — | — | — | 1 |
| `groups` | 1 | — | — | — | 1 |
| `guardian_messages` | 1 | 1 | 1 | 1 | — |
| `guardians` | 1 | — | — | — | 1 |
| `observations` | 1 | 1 | 1 | 1 | — |
| `payments` | **2** | — | — | — | 1 |
| `privacy_consents` | 1 | 1 | — | — | 1 |
| `profiles` | 1 | — | — | — | 1 |
| `quiz_attempts` | 1 | — | — | — | 1 |
| `reading_assessments` | 1 | — | — | — | 1 |
| `settings` | 1 | — | — | — | 1 |
| `student_badges` | 1 | — | — | — | 1 |
| `student_billing` | **2** | — | — | — | 1 |
| `student_guardians` | 1 | — | — | — | 1 |
| `student_profiles` | 1 | 1 | 1 | 1 | — |
| `student_stats` | 1 | — | — | — | 1 |
| `student_unit_overrides` | 1 | — | — | — | 1 |
| `students` | 1 | 1 | 1 | 1 | — |
| `subjects` | 1 | — | — | — | 1 |
| `task_status` | 1 | — | — | — | 1 |
| `task_submissions` | 1 | — | — | — | 1 |
| `tasks` | 1 | — | — | — | 1 |
| `terms` | 1 | — | — | — | 1 |
| `unit_assignments` | 1 | 1 | 1 | 1 | — |
| `unit_progress` | 1 | — | — | — | 1 |
| `unit_versions` | **2** | — | — | — | 1 |
| `units` | **2** | — | — | — | 1 |
| `xp_events` | 1 | — | — | — | 1 |

**Las tres tablas con 2 políticas SELECT son la clave:**

- `units`: `units_select` (`0003:625`) + `units_select_published_students` (`0009:8`).
- `unit_versions`: `unit_versions_select` (`0003:634`) + `unit_versions_select_published_students` (`0009:17`).
- `payments` y `student_billing`: dos políticas legítimas (staff + tutor), no un problema.

### 4.3. Políticas clave

#### `students_select` (`0003:560`)

```sql
create policy students_select
on public.students for select to authenticated
using (public.app_can_access_student(id));
```

Incluye al alumno propio y al tutor. Expone la fila completa, incluida `notes_internal` (`0001:111`). Ver `PRIV-02`.

#### `students_insert_staff` / `students_update_staff` (`0003:564,568`)

```sql
with check (public.app_is_admin() or public.app_is_teacher_of_group(group_id))
```

Correcto: un profesor solo da de alta/edita alumnos de su grupo.

#### `unit_assignments_select` (`0003:643`)

```sql
using (
  public.app_is_admin()
  or public.app_is_teacher_of_group(group_id)
  or (
    visible
    and status in ('active','closed')
    and (public.app_student_in_group(group_id)
         or public.app_guardian_has_student_in_group(group_id))
  )
)
```

Correcto: alumnos y tutores solo ven asignaciones visibles y activas/cerradas de su grupo.

#### `unit_progress_select` (`0003:687`)

```sql
using (public.app_can_access_student(student_id));
```

Correcto para el alumno y su tutor; el profesor solo si es su alumno.

#### `privacy_consents_select` (`0003:595`)

Revisar que el alumno no vea consentimientos de otros. La política usa `app_can_access_student` o el tutor; es correcta, pero conviene confirmar que el alumno no ve la fila del tutor si no debe.

#### `observations_select` (`0003:843`)

```sql
using (
  public.app_is_admin()
  or public.app_is_teacher_of_student(student_id)
  or (
    visibility = 'family'
    and (public.app_is_own_student(student_id)
         or public.app_is_guardian_of(student_id))
  )
)
```

**Bien diseñada:** las observaciones internas no se filtran a la familia. Es el patrón que debería seguir `students.notes_internal`.

#### `payments_select` y `student_billing_select` (`0020`, `0021`)

Dos políticas: staff y tutor. El alumno no tiene SELECT. Correcto.

---

## 5. Hallazgos de seguridad

### SEC-01 · RLS permite que cualquier alumno lea todo el contenido publicado

- **Severidad:** Crítico
- **Categoría:** Seguridad / RLS / control de acceso
- **Ubicación:** `app/supabase/migrations/0009_student_published_content.sql:8-24`; políticas base en `0003_rls.sql:625-642`; consumo en `frontend/public/curso/js/login-gate.js:248-301`
- **Evidencia:**

```sql
-- 0009:8-15
create policy units_select_published_students
on public.units for select to authenticated
using (
  public.app_is_admin()
  or public.app_is_staff()
  or (public.app_current_role() = 'student'::public.user_role
      and status = 'published'::public.unit_status)
);

-- 0009:17-24
create policy unit_versions_select_published_students
on public.unit_versions for select to authenticated
using (
  public.app_is_admin()
  or public.app_is_staff()
  or (public.app_current_role() = 'student'::public.user_role
      and published_at is not null)
);
```

PostgreSQL combina políticas **permisivas** con `OR`. Las políticas restrictivas de `0003` (`units_select`, `unit_versions_select`) siguen existiendo, pero la política de `0009` concede acceso por sí sola. El resultado es que **todo alumno activo ve todas las unidades publicadas y todas las versiones publicadas**, sin importar asignación, grupo, ventana de fechas ni override.

El reproductor confirma el diseño inseguro: descarga `units`, `unit_versions`, `unit_assignments` y `student_unit_overrides`, y **filtra en el cliente**:

```js
// login-gate.js:277-301
var allowed = {};
assignments.forEach(function (a) {
  var o = overrideByAssignment[a.id] || {};
  var status = o.status || a.status;
  if (status !== "active") return;
  var opensAt = o.opens_at || a.opens_at;
  var closesAt = o.closes_at || a.closes_at;
  if (opensAt && new Date(opensAt).getTime() > now) return;
  if (closesAt && new Date(closesAt).getTime() <= now) return;
  allowed[a.unit_id] = true;
});

var allowedUnits = allUnits.filter(function (u) {
  return allowed[u.id] === true;
});
```

- **Problema:** la autorización real ocurre en el navegador. La base de datos entrega el contenido completo antes de que el cliente decida qué mostrar.
- **Escenario de abuso:** un alumno inicia sesión normalmente, abre la consola del navegador y ejecuta:

```js
const { data } = await supabase
  .from('unit_versions')
  .select('unit_id,version,content')
  .not('published_at', 'is', null);
console.log(data);
```

O, sin sesión de la app, usa `curl` con su JWT y la anon key. Obtiene `content` con `correctIndex`, respuestas, explicaciones y unidades que el profesor no ha activado. Puede copiar las respuestas, adelantar contenido o compartirlo.
- **Impacto:**
  - **Integridad académica:** los quizzes y ejercicios dejan de medir aprendizaje.
  - **Control pedagógico:** el profesor pierde la secuencia de activación.
  - **Negocio:** el contenido evaluable es el activo principal; su fuga reduce el valor del producto.
  - **Menores:** el contenido puede incluir material no previsto para su edad o momento.
- **Recomendación:**
  1. Crear una migración correctiva (`0023`) que **elimine** las dos políticas de `0009`:

```sql
drop policy if exists units_select_published_students on public.units;
drop policy if exists unit_versions_select_published_students on public.unit_versions;
```

  2. Dejar que las políticas de `0003` hagan el trabajo: `units_select` usa `app_has_active_unit(id)` y `unit_versions_select` usa `app_can_access_version(id)`. Ambas dependen de `app_has_active_assignment`, que ya valida visibilidad, estado, fechas, override y publicación.
  3. Ajustar `login-gate.js` para no depender del filtrado cliente; puede seguir filtrando como defensa en profundidad, pero la base ya no debe entregar lo no permitido.
  4. Añadir una prueba negativa: un alumno sin asignación debe recibir **0 filas** de `unit_versions`.
  5. Rotar o revisar el contenido si el piloto ya estuvo abierto a alumnos.
- **Prioridad:** P0
- **Confianza:** Alta (código y semántica de RLS verificadas; no se ejecutó contra producción)
- **Estado:** Mitigado en código · pendiente de verificación en staging
- **Remediación:** migración `0023_fix_published_content_rls.sql`; el reproductor ya no lleva la URL de producción incrustada (`public/env.js` generado por Vite) y muestra un aviso cuando la base devuelve 0 unidades. La suite RLS (`RLS-01/02/10/11`) cubre el caso negativo.

---

### SEC-02 · Vinculación de cuentas sin verificar titularidad y con confirmación forzada de correo

- **Severidad:** Alto (Crítico si el autorregistro está abierto y la confirmación de correo está desactivada)
- **Categoría:** Seguridad / identidad / apropiación de cuenta
- **Ubicación:** `app/supabase/migrations/0018_link_confirm.sql:7-141`; redefinición en `0019_link_username_fix.sql:7-141`; punto crítico en `0019:116-120`
- **Evidencia:**

```sql
-- 0019:116-120
if v_email_confirmed_at is null then
  update auth.users
     set email_confirmed_at = now()
   where id = v_user_id;
end if;
```

La función:

1. Busca una cuenta existente por correo (`0019:45-50`).
2. Verifica que no tenga perfil (`0019:58-65`).
3. Inserta `profiles` y `students` (`0019:107-113`).
4. **Marca el correo como confirmado** aunque el titular nunca haya abierto el enlace.
5. No verifica que quien controla la cuenta sea el alumno o su tutor.

- **Problema:** la confianza se deposita en el profesor (“el profesor respalda que el correo es de su alumno”, comentario en `0019:114-115`), pero no hay prueba de titularidad. Además, una función `SECURITY DEFINER` ejecutable por cualquier profesor permite escribir directamente en `auth.users`, un esquema que normalmente está fuera del alcance de la aplicación.
- **Escenario de abuso:**
  1. El autorregistro está abierto (no verificado).
  2. Un atacante crea una cuenta con el correo de un alumno objetivo (o con un correo que el profesor creerá válido).
  3. El profesor da de alta al alumno con ese correo; `app_link_student_account` confirma la cuenta y la vincula a la ficha.
  4. El atacante inicia sesión y ve la ficha, el progreso, los datos del tutor y, si aplica, los pagos.
  - Variante: un profesor malicioso vincula una cuenta propia a la ficha de un alumno.
- **Impacto:** apropiación de ficha, acceso a datos de menores, suplantación, pérdida de confianza. Escala a Crítico porque el daño es directo y difícil de detectar.
- **Recomendación:**
  1. **Deshabilitar el autorregistro** en Supabase Auth.
  2. **No forzar `email_confirmed_at`** desde una RPC de aplicación; usar el flujo nativo de invitación (`inviteUserByEmail`) o un token de un solo uso.
  3. Implementar un **token de vinculación** ligado a `student_id`, con expiración, un solo uso y auditoría de quién lo emitió y quién lo canjeó.
  4. Registrar en `audit_log` el `user_id`, el `student_id`, el profesor y el momento de la vinculación.
  5. Añadir una verificación manual (documento de identidad o confirmación del tutor) para casos dudosos.
  6. Revisar las cuentas ya vinculadas y confirmar que el correo pertenece al alumno.
- **Prioridad:** P0
- **Confianza:** Alta en el código; Media en la explotabilidad (depende de la configuración de Auth)
- **Estado:** Mitigado en código · pendiente de verificación en staging
- **Remediación:** migración `0026_student_link_tokens.sql` (elimina `app_link_student_account` y crea la tabla de tokens sin políticas para roles de aplicación), Edge Functions `issue-student-link-token` (staff, 72 h, hash SHA-256, auditoría) y `redeem-student-link-token` (público, canje atómico, contraseña propia, revoca invitaciones anteriores). La UI ya no vincula por correo: genera una invitación. La suite cubre `RLS-92`–`RLS-97`; el flujo E2E queda en `AUTH-07`–`AUTH-12`.

---

### SEC-03 · El cambio obligatorio de contraseña se puede saltar

- **Severidad:** Alto
- **Categoría:** Seguridad / autenticación / gestión de credenciales
- **Ubicación:** `app/supabase/migrations/0011_force_password_change.sql:9-30`; `frontend/src/ui/app.js:775`; `app.js:650-665`
- **Evidencia:**

```sql
-- 0011:9-30
create or replace function public.app_complete_password_change()
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
set row_security = off
as $$
declare
  v_profile_id uuid := auth.uid();
begin
  if v_profile_id is null then
    raise exception 'No autenticado' using errcode = '42501';
  end if;

  update public.profiles p
     set must_change_password = false,
         updated_at = now()
   where p.id = v_profile_id;

  if not found then
    raise exception 'No se pudo completar el cambio de contraseña' using errcode = '42501';
  end if;

  return jsonb_build_object('ok', true);
end;
$$;
```

El frontend solo muestra la pantalla de cambio si `data.must_change_password` es verdadero (`app.js:775`). La RPC no comprueba que la contraseña haya cambiado: solo limpia la bandera.

- **Problema:** la política de “contraseña temporal obligatoria” es **solo cosmética**. Un alumno puede ejecutar la RPC directamente y conservar la contraseña que el profesor conoce.
- **Escenario de abuso:**
  1. El profesor crea al alumno con contraseña temporal y la comparte.
  2. El alumno (o cualquier persona con esa contraseña) inicia sesión.
  3. En la consola: `await supabase.rpc('app_complete_password_change')`.
  4. La bandera se limpia; la contraseña sigue siendo la temporal.
  5. El profesor, o quien conozca la contraseña, puede entrar como el alumno.
- **Impacto:** suplantación, acceso a datos del menor, pérdida de trazabilidad. En un piloto con contraseñas compartidas, el riesgo es alto.
- **Recomendación:**
  1. Implementar el cambio en una **Edge Function** con `service_role` que:
     - Reciba la nueva contraseña.
     - Llame `auth.admin.updateUserById(userId, { password })`.
     - Registre `password_changed_at` y limpie la bandera en la misma transacción lógica.
  2. O eliminar `must_change_password` y usar el flujo nativo de **recuperación de contraseña** de Supabase, con expiración y token de un solo uso.
  3. Añadir una política de contraseñas (longitud, complejidad, no reutilización) y registrar el evento.
  4. Mientras se corrige, no reutilizar contraseñas temporales entre alumnos y rotarlas después del primer ingreso.
- **Prioridad:** P0
- **Confianza:** Alta
- **Estado:** Mitigado en código · pendiente de verificación en staging
- **Remediación:** migración `0025_password_change_server.sql` (elimina `app_complete_password_change` y añade `profiles.password_changed_at`), Edge Function `complete-password-change` con `auth.admin.updateUserById` y validación de política, y `app.js` llamando a la función en vez de a la RPC. La suite cubre `RLS-89`–`RLS-91`.

---

### SEC-04 · Desactivar un usuario no revoca sesiones ni banea la cuenta en Auth

- **Severidad:** Alto
- **Categoría:** Seguridad / offboarding / gestión de sesiones
- **Ubicación:** `app/supabase/functions/deactivate-user/index.ts:43-46`
- **Evidencia:**

```ts
const { error: updateError } = await admin
  .from("profiles")
  .update({ active, updated_at: new Date().toISOString() })
  .eq("id", targetId);
```

La función solo cambia `profiles.active`. No llama a `admin.auth.admin.updateUserById(id, { ban_duration: ... })`, no invalida sesiones y no revoca refresh tokens.

- **Problema:** el usuario desactivado **sigue pudiendo autenticarse** en Auth. La app lo rechaza después de consultar `profiles.active`, pero:
  - El token sigue siendo válido hasta su expiración.
  - Las RPC que solo verifican `auth.uid()` (por ejemplo, `app_complete_password_change`) siguen funcionando.
  - Si el perfil se reactiva, la sesión antigua puede seguir viva.
  - El mensaje “Perderá el acceso de inmediato” (`app.js:6390`) no es exacto.
- **Escenario:** un alumno es desactivado por conducta grave; conserva el refresh token y, si el perfil se reactiva por error, vuelve a entrar sin credenciales nuevas. O un atacante con una sesión robada mantiene acceso hasta que expire.
- **Impacto:** offboarding incompleto, acceso residual, dificultad para contener incidentes.
- **Recomendación:**
  1. En `deactivate-user`, llamar a `admin.auth.admin.updateUserById(targetId, { ban_duration: '876000h' })` (o `'none'` al reactivar).
  2. Invalidar sesiones: Supabase no tiene “revoke all” directo; una opción es rotar el `JWT secret` (global, no ideal) o mantener una tabla de `session_version` y verificarla en un hook. Como mínimo, banear la cuenta impide nuevos logins y refresh.
  3. Añadir `deactivated_at`, `deactivated_by` y motivo en `profiles` o `audit_log`.
  4. Probar el flujo: desactivar → intentar login → debe fallar en Auth, no solo en la app.
- **Prioridad:** P1
- **Confianza:** Alta
- **Estado:** Abierto

---

### SEC-05 · CORS permisivo por defecto en Edge Functions

- **Severidad:** Medio
- **Categoría:** Seguridad / configuración
- **Ubicación:** `app/supabase/functions/_shared/http.ts:1-6`
- **Evidencia:**

```ts
const allowedOrigin = Deno.env.get("ALLOWED_ORIGIN") ?? "*";

export const corsHeaders = {
  "Access-Control-Allow-Origin": allowedOrigin,
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
```

- **Problema:** si `ALLOWED_ORIGIN` no está configurado, cualquier origen puede llamar a las funciones. El navegador de un usuario autenticado podría ser inducido a invocar acciones desde un sitio malicioso, aunque el token no viaja automáticamente (se requiere `Authorization`), lo que reduce la explotabilidad.
- **Escenario:** un sitio de terceros intenta invocar `admin-create-student` o `guardian-consent` con el token del usuario; el navegador permite la respuesta por CORS. Sin el token, la llamada falla; con un XSS previo, el token podría estar disponible.
- **Impacto:** superficie de ataque mayor, especialmente combinada con XSS o extensiones maliciosas.
- **Recomendación:** configurar `ALLOWED_ORIGIN` con el dominio de producción y el de staging; rechazar orígenes desconocidos; no usar `*` en funciones que reciben `service_role`.
- **Prioridad:** P2
- **Confianza:** Alta
- **Estado:** Abierto

---

### SEC-06 · Magic link de tutor compartido por WhatsApp y reenviable

- **Severidad:** Medio
- **Categoría:** Seguridad / identidad / tutores
- **Ubicación:** `app/supabase/functions/invite-guardian/index.ts:115-134,158-160`
- **Evidencia:**

```ts
const { data: linkData, error: linkGenError } = await admin.auth.admin.generateLink({
  type: "magiclink",
  email,
});
// ...
const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;
```

- **Problema:** el enlace de acceso se comparte por WhatsApp y queda en el historial del chat, en la nube del mensajero y en cualquier reenvío. Un magic link es una credencial bearer: quien lo tenga puede iniciar sesión como el tutor hasta que expire o se use.
- **Escenario:** el tutor reenvía el mensaje a un familiar; el enlace se filtra; un tercero entra al panel y ve datos del menor y pagos.
- **Impacto:** acceso no autorizado a datos de menores y finanzas.
- **Recomendación:** enviar el enlace por correo al tutor, no por WhatsApp; usar un enlace de invitación de un solo uso con expiración corta (15–30 min) y confirmación de correo; registrar el canje; permitir revocar invitaciones; no incluir el enlace en un `wa.me` que invita a reenviar.
- **Prioridad:** P2
- **Confianza:** Alta
- **Estado:** Abierto

---

### SEC-07 · El baneo de cuentas sin perfil no audita ni revoca sesiones

- **Severidad:** Medio
- **Categoría:** Seguridad / administración
- **Ubicación:** `app/supabase/migrations/0017_external_accounts.sql:169-205`
- **Evidencia:**

```sql
update auth.users
   set banned_until = case when p_ban then now() + interval '100 years' else null end
 where id = p_user_id;
```

- **Problema:** el baneo funciona para bloquear nuevos logins, pero no hay registro en `audit_log`, no se revocan sesiones existentes y no se notifica al administrador. Tampoco hay una lista de “cuentas externas” con motivo.
- **Escenario:** un administrador banea una cuenta colada; la cuenta tenía una sesión activa y sigue operando hasta que expire el token. No queda rastro de quién la baneó.
- **Impacto:** contención incompleta y falta de trazabilidad.
- **Recomendación:** registrar la acción en `audit_log` con actor, objetivo y motivo; documentar que el baneo no revoca tokens; considerar `session_version` o rotación de JWT para incidentes graves; añadir una vista de cuentas externas con estado y fecha.
- **Prioridad:** P2
- **Confianza:** Alta
- **Estado:** Abierto

---

### SEC-08 · Anon key duplicada y hardcodeada en dos puertas

- **Severidad:** Bajo
- **Categoría:** Seguridad / configuración
- **Ubicación:** `frontend/public/curso/js/login-gate.js:15-17`; `frontend/public/tool-gate.js:7-9`; bundle en `frontend/dist/assets/*.js`
- **Evidencia:** la misma clave pública aparece en dos archivos y en el bundle. No es un secreto (es la anon key), pero su duplicación complica la rotación y facilita el error de pegar una clave de otro proyecto.
- **Problema:** si se rota la clave, hay que actualizar tres lugares y reconstruir; si se filtra una `service_role` por error, el patrón de copiar/pegar la haría más probable.
- **Escenario:** rotación incompleta; una de las puertas sigue usando la clave vieja y falla.
- **Impacto:** operativo, no de confidencialidad.
- **Recomendación:** centralizar la configuración en un solo módulo o en variables inyectadas en build; documentar la rotación; añadir una prueba que verifique que las tres copias coinciden.
- **Prioridad:** P3
- **Confianza:** Alta
- **Estado:** Abierto

---

### SEC-09 · Sin rate limiting propio en Edge Functions

- **Severidad:** Bajo
- **Categoría:** Seguridad / abuso
- **Ubicación:** `app/supabase/functions/**`
- **Evidencia:** no hay contadores, captcha, límites por IP/usuario ni colas. Supabase aplica límites de plataforma, pero no se verificaron.
- **Problema:** un atacante con una cuenta válida puede invocar funciones costosas (altas, invitaciones, consentimientos) en bucle.
- **Escenario:** creación masiva de cuentas o invitaciones; spam de magic links; agotamiento de cuota.
- **Impacto:** costo, abuso, posible denegación de servicio.
- **Recomendación:** añadir límites por usuario/IP en las funciones sensibles; usar `settings` o una tabla de cuotas; monitorear y alertar; verificar los límites de Supabase.
- **Prioridad:** P3
- **Confianza:** Media (depende de la plataforma)
- **Estado:** Abierto

---

## 6. Controles positivos

| Control | Evidencia | Por qué importa |
|---|---|---|
| RLS en todas las tablas | `0002_enable_rls.sql` + 38 tablas | Sin RLS, la anon key expondría todo |
| `search_path` fijo | 52/52 funciones | Evita secuestro de funciones y tipos |
| Evaluación de respuestas en servidor | `0007`, `0005`, `0022` | El cliente no decide `is_correct` |
| Asignaciones activas verificadas | `app_has_active_assignment` (`0003:294`) | Progreso e intentos ligados a una asignación válida |
| Roles separados | `app_is_admin`, `app_is_staff`, `app_is_own_student`, `app_is_guardian_of` | Autorización explícita y legible |
| Pagos sin acceso para alumnos | `0021_billing_guard` | Separa finanzas del alumno |
| Observaciones internas protegidas | `observations_select` (`0003:843`) | Patrón correcto de visibilidad |
| Sin `service_role` en el bundle | `grep` en `dist/assets/*.js` = 0 | La clave secreta no llega al cliente |
| Secretos fuera de Git | `.gitignore` + `git ls-files` | No hay credenciales en el historial |
| Escapado HTML centralizado | `escapeHtml` (`app.js:386-393`) | Reduce XSS en la mayoría de las vistas |

---

## 7. Modelo de amenazas (resumen)

| Amenaza | Probabilidad | Impacto | Control actual | Estado |
|---|---|---|---|---|
| Alumno descarga respuestas | Alta | Alto | RLS permisiva | **Falla** (`SEC-01`) |
| Alumno conserva contraseña temporal | Alta | Alto | Bandera solo frontend | **Falla** (`SEC-03`) |
| Tercero se apropia de ficha | Media | Alto | Vinculación sin titularidad | **Falla** (`SEC-02`) |
| Usuario desactivado sigue entrando | Media | Medio | Solo `profiles.active` | **Parcial** (`SEC-04`) |
| Tutor reenvía magic link | Media | Medio | Enlace bearer por WhatsApp | **Parcial** (`SEC-06`) |
| Profesor ve otros grupos | Baja | Alto | `app_is_teacher_of_group` | **OK** |
| Alumno ve datos de otro alumno | Baja | Alto | `app_can_access_student` | **OK** |
| Escalada a admin | Baja | Crítico | `app_is_admin` + RLS | **OK** |
| Inyección SQL | Baja | Alto | Consultas parametrizadas / RPC | **OK** |
| XSS almacenado | Media | Medio | `escapeHtml` | **Parcial** (`COD-03`) |
| Fuga por respaldo | Media | Alto | `.backups/` sin cifrar | **Falla** (`OPS-01`) |

---

## 8. Consultas de verificación (solo lectura)

Ejecutar en una **réplica o staging**, nunca en producción sin autorización.

### 8.1. Confirmar políticas de `units` y `unit_versions`

```sql
select schemaname, tablename, policyname, permissive, roles, cmd, qual
from pg_policies
where schemaname = 'public'
  and tablename in ('units', 'unit_versions')
order by tablename, policyname;
```

**Esperado hoy:** 3 políticas por tabla (1 ALL admin + 2 SELECT). **Esperado después de la corrección:** 2 por tabla (1 ALL admin + 1 SELECT restrictiva).

### 8.2. Confirmar que un alumno sin asignación no ve versiones

Con el JWT de un alumno sin asignaciones:

```sql
select count(*) from public.unit_versions;
```

**Esperado hoy:** > 0 (falla). **Esperado después:** 0.

### 8.3. Confirmar que un alumno con asignación solo ve su unidad

```sql
select u.id, u.num, u.title
from public.units u
order by u.num;
```

**Esperado después:** solo las unidades con asignación activa para ese alumno.

### 8.4. Confirmar que `notes_internal` se filtra

Con el JWT de un alumno:

```sql
select id, student_code, notes_internal from public.students;
```

**Esperado hoy:** la fila propia incluye `notes_internal` (falla `PRIV-02`). **Esperado después:** `notes_internal` debe ser `null` o la columna no debe estar en el `select` permitido.

### 8.5. Confirmar que un tutor no ve evaluaciones internas

Con el JWT de un tutor:

```sql
select id, visibility, body from public.observations;
```

**Esperado:** solo `visibility = 'family'` de sus hijos. Si aparece `internal`, hay un fallo.

### 8.6. Confirmar que un alumno no ve finanzas

Con el JWT de un alumno:

```sql
select count(*) from public.payments;
select count(*) from public.student_billing;
```

**Esperado:** 0 y 0.

### 8.7. Confirmar que un profesor no ve otros grupos

Con el JWT de un profesor:

```sql
select id, name from public.groups;
select id, student_code from public.students;
```

**Esperado:** solo sus grupos y sus alumnos.

### 8.8. Confirmar que las funciones definer tienen `search_path`

```sql
select n.nspname, p.proname,
       p.proconfig
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.prosecdef
order by p.proname;
```

**Esperado:** todas con `search_path=public, pg_temp` (o equivalente).

---

## 9. Recomendaciones transversales

1. **Adoptar pruebas negativas de RLS** como parte del CI: para cada tabla sensible, un JWT por rol y una aserción de filas esperadas. Ver `COD-07` y `12_PRUEBAS_PENDIENTES.md`.
2. **Separar datos internos de datos visibles**: mover `notes_internal` a una tabla `student_private_notes` con su propia política, en lugar de confiar en que la UI no la muestre.
3. **No usar `app_can_access_student` para todo**: crear funciones específicas por caso de uso (`app_can_view_grades`, `app_can_view_attendance`, `app_can_view_wellbeing`) para reducir el radio de exposición.
4. **Auditar toda escritura privilegiada**: altas, vinculaciones, baneos, cambios de contraseña y pagos deben dejar rastro en `audit_log`.
5. **Revisar la configuración de Auth** antes de emitir el veredicto final: sign-ups, confirmación, expiración, rate limits y política de contraseñas.
6. **Tratar el contenido como dato sensible**: no solo por propiedad intelectual, sino porque las respuestas correctas son la integridad del proceso evaluativo.

---

## 10. Conclusión

La seguridad de ECOEMS está **bien pensada pero mal cerrada en un punto**. Las 38 tablas con RLS, las 52 funciones con `search_path` y la evaluación en servidor demuestran criterio. El problema es que una política de conveniencia (`0009`) abrió la puerta principal para que el reproductor “funcione”, y el filtrado se movió al cliente.

Corregir `SEC-01` es probablemente **la migración más pequeña y de mayor impacto** de todo el proyecto: dos `drop policy`. Después, cerrar identidad (`SEC-02`, `SEC-03`, `SEC-04`) y publicar el aviso de privacidad (`PRIV-01`) son las condiciones para operar con menores.
