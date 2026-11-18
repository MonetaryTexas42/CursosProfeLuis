# 08 · Privacidad y datos personales

## 1. Resumen

La plataforma trata **datos personales de menores de edad**, además de datos de tutores, profesores y personal administrativo. Eso la coloca en la categoría de mayor cuidado: el tratamiento debe tener base legal, finalidad determinada, consentimiento verificable, medidas de seguridad y un mecanismo real para ejercer derechos.

El diseño de Fase 0 es **conceptualmente correcto**: hay un borrador de aviso integral, una carta de consentimiento, una tabla `privacy_consents` con versión, IP y user-agent, una propuesta de retención y una lista de verificación. El problema es que **casi nada de eso está implementado en la aplicación**:

1. El aviso completo **no está publicado** dentro de la app; solo existe como borrador en `Fase-0/`.
2. El botón de consentimiento **no enlaza al texto** y **no bloquea el acceso**.
3. La evidencia guardada **no incluye el texto ni su hash**, aunque el documento lo promete.
4. Los derechos **ARCO no tienen canal ni procedimiento** en la app.
5. Hay **datos internos del profesor** (notas, perfil vocacional) visibles para el alumno y el tutor.
6. Los **respaldos locales** contienen identidades y PII sin cifrar.
7. El reproductor conserva **datos en `localStorage`** sin política de limpieza.

**Nivel de riesgo de privacidad:** **Alto**. No porque el diseño sea malo, sino porque la distancia entre lo prometido y lo implementado es grande, y el sujeto de los datos es un menor.

> **Aviso:** este informe es técnico y operativo. No constituye un dictamen legal. La LFPDPPP y su reglamento, así como cualquier norma estatal aplicable, deben ser interpretados por un abogado antes del piloto con datos reales.

---

## 2. Inventario de datos personales

### 2.1. Titulares

| Titular | Cantidad estimada | Notas |
|---|---|---|
| Alumnos | 1–600 en el piloto | **Menores de edad** en su mayoría |
| Tutores | 1–2 por alumno | Padres o tutores legales |
| Profesores | 2–10 | Personal de la institución |
| Administradores | 1–3 | Acceso total |

### 2.2. Categorías de datos

| Categoría | Datos | Tabla / ubicación | Sensibilidad |
|---|---|---|---|
| **Identificación** | Nombre completo, usuario, correo, matrícula | `profiles`, `students`, `auth.users` | Alta |
| **Contacto** | Correo, teléfono | `profiles`, `guardians`, `auth.users` | Alta |
| **Demográficos** | Fecha de nacimiento, fecha de inscripción | `students` | Alta (menor) |
| **Académicos** | Grupo, nivel, horario, avance, precisión, intentos, calificaciones, asistencia | `students`, `unit_progress`, `exercise_attempts`, `quiz_attempts`, `grades`, `attendance` | Alta |
| **Psicoeducativos** | Intereses, aptitudes, fortalezas, debilidades, notas vocacionales, tests de personalidad | `student_profiles`, `reading_assessments` | **Muy alta** |
| **Conducta y bienestar** | Observaciones del profesor, notas internas, mensajes a tutores | `observations`, `students.notes_internal`, `guardian_messages` | **Muy alta** |
| **Financieros** | Plan, cuota, pagos, método | `student_billing`, `payments` | Alta |
| **Consentimiento** | Versión, fecha, IP, user-agent | `privacy_consents` | Media (prueba legal) |
| **Técnicos** | IP, user-agent, logs de auditoría | `audit_log`, `privacy_consents` | Media |
| **Credenciales** | Correo, hash de contraseña, tokens | `auth.users` | Crítica (nunca debe salir de Auth) |

### 2.3. Datos de menores

Los datos de menores requieren **consentimiento del tutor** y un tratamiento especialmente cuidadoso. La plataforma recaba:

- Identidad y contacto del menor.
- Historial académico y de comportamiento.
- Resultados de tests de personalidad y orientación vocacional.
- Observaciones del profesor sobre bienestar o conducta.
- Datos financieros asociados a la familia.

**No se observaron datos sensibles en el sentido estricto** (salud, origen étnico, religión, orientación sexual, datos biométricos). Pero los tests de personalidad y las notas internas pueden **inferir** información sensible si se interpretan. Deben tratarse como categoría de cuidado alto.

---

## 3. Finalidades del tratamiento

| Finalidad | Datos usados | Base legal propuesta | Estado |
|---|---|---|---|
| Gestión académica y registro de avance | Identificación, académicos | Relación educativa + consentimiento | Parcial |
| Evaluación del aprendizaje | Académicos, intentos, calificaciones | Relación educativa | Parcial |
| Comunicación con tutores | Contacto, observaciones, mensajes | Consentimiento | Parcial |
| Orientación vocacional | Psicoeducativos | Consentimiento expreso | **No cubierto con claridad** |
| Cobranza y control de pagos | Financieros | Relación contractual | Parcial |
| Seguridad y auditoría | Técnicos, logs | Interés legítimo / obligación | Parcial |
| Mejora del servicio | Agregados | Consentimiento o anonimización | **No implementado** |

### 3.1. Observación

El aviso borrador menciona “fines educativos” de forma genérica. Para los tests de personalidad y las notas vocacionales, la finalidad debe ser **explícita y separada**, porque no son necesarios para la operación básica del curso y pueden influir en decisiones sobre el menor.

---

## 4. Consentimiento

### 4.1. Lo que existe

| Elemento | Estado | Evidencia |
|---|---|---|
| Tabla `privacy_consents` | Existe | `0001_schema.sql:140-151` |
| Versión del documento | Existe (`document_version`) | `0001:144` |
| Fecha de aceptación | Existe (`accepted_at`) | `0001:145` |
| Revocación | Existe (`revoked_at`) | `0001:146` |
| IP y user-agent | Existe | `0001:147-148` |
| Metadatos | Existe (`metadata jsonb`) | `0001:149` |
| Edge Function de registro | Existe | `guardian-consent/index.ts` |
| Revocación desde la app | **No** | No hay botón ni flujo |
| Texto del aviso en la app | **No** | Solo borrador en `Fase-0/` |
| Bloqueo sin consentimiento | **No** | El panel se renderiza completo |
| Hash del texto aceptado | **No** | `metadata` solo guarda `accepted_by` y `channel` |

### 4.2. Flujo actual

```
1. El tutor entra con magic link.
2. Ve la lista de hijos y sus pagos.
3. Aparece un botón "Aceptar aviso de privacidad".
4. Al pulsarlo, se invoca guardian-consent con:
   { student_id, document_version: 'v1-2026', accepted: true }
5. La función guarda la fila con IP y user-agent.
6. Se muestra "Consentimiento registrado".
```

**Problemas del flujo:**

- El tutor ya vio datos del menor **antes** de aceptar.
- No hay enlace al texto; el botón dice “Aceptar aviso” sin mostrarlo.
- No se registra qué texto se mostró (solo la versión).
- No se pide confirmación explícita de lectura.
- No hay forma de revocar desde la UI.
- El alumno no participa; a los 18 años debería poder otorgar o ratificar su consentimiento.

---

## 5. Derechos ARCO y revocación

### 5.1. Lo que promete el borrador

`Fase-0/05-privacidad-y-consentimiento.md`:

- Línea 46: “El consentimiento es revocable, sin efectos retroactivos…”
- Línea 59: “Puede ejercer sus derechos de acceso, rectificación, cancelación y oposición escribiendo a [CORREO DE PRIVACIDAD].”
- Línea 75: “Mecanismos para ejercer derechos ARCO.”
- Línea 185: checklist “Procedimiento ARCO documentado”.

### 5.2. Lo que existe en la app

- **Nada.** No hay formulario, correo configurado, pantalla ni procedimiento.
- La revocación existe en la Edge Function (`revoke: true`), pero **no está expuesta** en la interfaz.
- No hay forma de solicitar acceso, rectificación, cancelación u oposición.
- No hay plazo de respuesta ni registro de solicitudes.

### 5.3. Riesgo

Un tutor que quiera revocar su consentimiento no puede hacerlo sin escribir a un correo que no está publicado. Un tutor que quiera eliminar los datos de su hijo no tiene canal. La promesa legal queda sin sustento operativo.

---

## 6. Retención y eliminación

### 6.1. Propuesta del borrador

| Dato | Conservación propuesta |
|---|---|
| Expediente académico | Mientras dure la relación escolar y plazo legal |
| Progreso e intentos | Mientras dure la cuenta; anonimizar al egreso |
| Asistencia y calificaciones | Plazo escolar y legal |
| Mensajes y observaciones | Hasta 1 año después del egreso |
| Logs de auditoría | 1 año |
| Respaldos | 30 días rotativos; mensual 6 meses |
| Consentimientos | Mientras dure el tratamiento y plazo legal |

### 6.2. Lo que existe en la práctica

- **Ningún job de limpieza.**
- **Ninguna política de anonimización.**
- **Ningún borrado real:** las FKs sin `on delete` impiden eliminar alumnos (`DB-02`).
- Los respaldos locales **no se rotan** ni se borran; el observado tiene más de dos semanas y sigue en disco.
- `audit_log` y `email_outbox` crecen sin límite (`DB-06`).

---

## 7. Seguridad de los datos personales

### 7.1. Controles existentes

| Control | Estado |
|---|---|
| HTTPS | Sí (GitHub Pages + Supabase) |
| RLS en todas las tablas | Sí |
| `service_role` solo en Edge Functions | Sí |
| Contraseñas gestionadas por Supabase Auth | Sí |
| Auditoría de acciones administrativas | Parcial (solo Edge Functions) |
| Respaldos cifrados | **No** |
| MFA en el panel de Supabase | No verificado |
| Cifrado en reposo | Depende de Supabase (no verificado) |
| Seudonimización en reportes | **No** |

### 7.2. Exposición por rol

| Rol | Ve | No debería ver |
|---|---|---|
| Alumno | Su ficha, avance, unidades activas | `notes_internal`, notas vocacionales, datos de otros |
| Tutor | Hijos, plan, pagos | Notas internas, tests psicométricos sin finalidad explícita |
| Profesor | Sus grupos, fichas completas | Datos de otros grupos, finanzas globales |
| Admin | Todo | — (pero con auditoría y minimización) |

**Desviaciones confirmadas:** `PRIV-02` (notas internas) y `PRIV-03` (perfil psicopedagógico a tutores).

---

## 8. Hallazgos de privacidad

### PRIV-01 · Aviso de privacidad no publicado, consentimiento sin evidencia y sin bloqueo de acceso

- **Severidad:** Alto
- **Categoría:** Privacidad / consentimiento / cumplimiento
- **Ubicación:** `app/frontend/src/ui/app.js:37,3958,3963,6997-7026`; `app/supabase/functions/guardian-consent/index.ts:99-110`; `Fase-0/05-privacidad-y-consentimiento.md`
- **Evidencia:**

```js
// app.js:37
const PRIVACY_DOCUMENT_VERSION = 'v1-2026';

// app.js:3958-3963
<button class="btn primary" data-consent-student="${escapeHtml(child.id)}">
  Aceptar aviso de privacidad
</button>
...
<p class="muted"><small>Aviso de privacidad versión ${escapeHtml(PRIVACY_DOCUMENT_VERSION)}.
Al aceptar, autorizas el tratamiento de los datos del alumno con fines educativos.
Puedes revocarlo cuando quieras.</small></p>
```

```ts
// guardian-consent/index.ts:99-110
metadata: {
  accepted_by: profile.full_name,
  channel: "portal",
},
```

- **Problema:** el botón no enlaza a ningún documento; el texto completo vive solo en `Fase-0/`. No se guarda el texto ni su hash. El panel del tutor se renderiza completo antes de aceptar, así que el consentimiento es un trámite posterior, no una puerta. La frase “puedes revocarlo cuando quieras” no tiene botón ni canal.
- **Escenario:** un tutor acepta sin haber leído el aviso; meses después pide saber qué autorizó. La base solo dice `v1-2026`, pero el texto pudo cambiar sin cambiar la versión. No hay evidencia de qué aceptó. Otro tutor quiere revocar y no encuentra cómo.
- **Impacto:** consentimiento no informado, evidencia débil, imposibilidad de demostrar cumplimiento, riesgo legal y reputacional con menores.
- **Recomendación:**
  1. Publicar el aviso como página estática (`/privacidad.html`) enlazada desde el login, el panel del tutor y el pie de página.
  2. Guardar en `privacy_consents.metadata` el **hash SHA-256 del texto** y la URL mostrada, además de la versión.
  3. Bloquear el acceso a datos del alumno hasta que exista consentimiento vigente del tutor; mostrar solo el aviso y el botón.
  4. Exigir una casilla “He leído y entiendo” antes de aceptar.
  5. Exponer la revocación en el panel, con confirmación y efecto claro.
  6. Versionar el texto: cualquier cambio de fondo sube la versión y exige nueva aceptación.
  7. Validar el texto con un abogado antes del piloto real.
- **Prioridad:** P0
- **Confianza:** Alta
- **Estado:** Mitigado en código · pendiente de verificación en staging y de revisión legal
- **Remediación:**
  - `frontend/public/privacidad.html` publica el aviso `v2-2026` (marcado como borrador hasta la revisión legal).
  - `0027_privacy_notice.sql` guarda versión, URL y hash en `settings`, expone la vista pública `privacy_document` y crea `app_guardian_has_consent`.
  - Las políticas del tutor exigen consentimiento vigente; `student_guardians` y `privacy_consents` quedan visibles para aceptar o revocar.
  - Se elimina `privacy_consents_guardian_insert`: el consentimiento solo lo registra `guardian-consent` con `service_role`.
  - `guardian-consent` exige `acknowledged`, guarda `document_hash`, `document_url`, `accepted_by` y `channel`, y revoca todas las versiones activas con `confirm`.
  - El panel del tutor muestra el aviso, la casilla, un botón por alumno pendiente y la revocación con confirmación; el pie enlaza al aviso.
  - La suite cubre `RLS-98`–`RLS-107`; las pruebas manuales son `PRIV-10`–`PRIV-13` y `PRIV-17/18`.
  - **Pendiente:** validación por abogado y E2E en staging. El texto contiene placeholders institucionales (`[NOMBRE DE LA INSTITUCIÓN]`, `[DOMICILIO]`, `[CORREO DE PRIVACIDAD]`, `[NOMBRE DEL RESPONSABLE]`).

---

### PRIV-02 · `students.notes_internal` se entrega al alumno y al tutor

- **Severidad:** Alto
- **Categoría:** Privacidad / minimización / datos sensibles
- **Ubicación:** `app/supabase/migrations/0001_schema.sql:111`; política en `0003_rls.sql:560`
- **Evidencia:**

```sql
-- 0001:103-115
create table if not exists public.students (
  ...
  notes_internal text,
  ...
);
```

```sql
-- 0003:560-562
create policy students_select
on public.students for select to authenticated
using (public.app_can_access_student(id));
```

`app_can_access_student` incluye al alumno propio y a su tutor (`0003:201-216`). RLS filtra **filas**, no **columnas**: la fila completa viaja con `notes_internal`.

- **Problema:** una columna pensada para uso interno del profesor comparte tabla y política con datos que la familia sí debe ver.
- **Escenario:** el profesor anota “situación familiar delicada, evitar presión por calificaciones”. El alumno abre la consola y ejecuta `supabase.from('students').select('*')`. Ve la nota. O el tutor la ve y estalla un conflicto.
- **Impacto:** fuga de información sensible sobre un menor, daño a la relación pedagógica, posible riesgo emocional, incumplimiento del principio de minimización.
- **Recomendación:**
  1. Mover `notes_internal` a `student_private_notes` (o `student_staff_notes`) con política solo para admin y profesor del alumno.
  2. O crear una vista `students_family` sin la columna y usarla en el frontend.
  3. Nunca depender de que la UI no muestre el campo.
  4. Auditar el acceso a notas internas (quién las lee y cuándo).
- **Prioridad:** P0 (por su efecto; el cambio es pequeño)
- **Confianza:** Alta
- **Estado:** Mitigado en código · pendiente de verificación en staging
- **Remediación:** migración `0024_student_staff_notes.sql` (tabla `student_staff_notes` solo para admin/profesor, copia de datos, borrado de la columna y auditoría sin texto). El seed de staging ya no escribe `notes_internal`; la suite cubre `RLS-16`, `RLS-50`, `RLS-85`–`RLS-88`.

---

### PRIV-03 · El perfil psicopedagógico y vocacional es visible para el tutor sin finalidad explícita

- **Severidad:** Medio
- **Categoría:** Privacidad / datos psicoeducativos
- **Ubicación:** `app/supabase/migrations/0001_schema.sql:386-396`; política en `0003_rls.sql:774-776`
- **Evidencia:**

```sql
-- 0001:386-396
create table if not exists public.student_profiles (
  student_id uuid primary key references public.students(id),
  interests text[] not null default '{}',
  aptitudes text[] not null default '{}',
  strengths text[] not null default '{}',
  weaknesses text[] not null default '{}',
  extras text[] not null default '{}',
  vocational_notes text,
  reading_goal text,
  updated_at timestamptz not null default now()
);
```

```sql
-- 0003:774-776
create policy student_profiles_select
on public.student_profiles for select to authenticated
using (public.app_can_access_student(student_id));
```

- **Problema:** intereses, aptitudes, fortalezas, debilidades y notas vocacionales se consideran datos de cuidado alto. La política los entrega al alumno y al tutor junto con el resto del expediente, sin que el aviso los distinga ni exista una finalidad específica aceptada.
- **Escenario:** el tutor consulta “debilidades” y “notas vocacionales” de su hijo sin contexto; el alumno ve cómo el profesor lo describió. Los resultados de tests de personalidad se usan fuera del proceso de orientación para el que se recabaron.
- **Impacto:** interpretación fuera de contexto, etiquetado del menor, conflicto familia-institución, tratamiento sin finalidad explícita.
- **Recomendación:**
  1. Definir una finalidad específica y separada para los tests y el perfil vocacional, con consentimiento expreso.
  2. Mostrar al tutor solo el **resumen orientativo** acordado (no las notas internas ni las “debilidades” crudas).
  3. Reservar `vocational_notes` para staff; exponer al alumno/tutor una vista curada.
  4. Añadir una leyenda de que los tests son orientativos y no diagnósticos.
  5. Documentar quién puede ver qué y con qué propósito.
- **Prioridad:** P1
- **Confianza:** Alta
- **Estado:** Abierto

---

### PRIV-04 · El reproductor conserva datos en `localStorage` sin política de limpieza

- **Severidad:** Medio
- **Categoría:** Privacidad / almacenamiento local
- **Ubicación:** `app/frontend/public/curso/js/app.js:62-104,395-400,492-499,1932`
- **Evidencia:**

```js
// app.js:62-104
function loadAlumnos() { ... localStorage.getItem(ALUMNOS_KEY) ... }
function saveAlumnos() { ... localStorage.setItem(ALUMNOS_KEY, JSON.stringify(alumnos)) ... }
function loadPagos()   { ... localStorage.getItem(PAGOS_KEY) ... }
function savePagos()   { ... localStorage.setItem(PAGOS_KEY, JSON.stringify(pagos)) ... }
function loadAsistencias() { ... localStorage.getItem(ASISTENCIA_KEY) ... }
```

Las claves `ALUMNOS_KEY`, `PAGOS_KEY` y `ASISTENCIA_KEY` provienen de la versión anterior del reproductor, que gestionaba alumnos, pagos y asistencia en el navegador.

- **Problema:** el código sigue leyendo y escribiendo datos personales en el almacenamiento del navegador. No hay borrado al cerrar sesión (solo `STORE_KEY` se elimina en `1932`), ni expiración, ni aviso. En equipos compartidos (aula, biblioteca, computadora familiar), esos datos quedan disponibles para el siguiente usuario.
- **Escenario:** un profesor usó la versión antigua en la computadora del aula; quedaron nombres, montos y asistencias en `localStorage`. Otro alumno abre el navegador y los lee desde las herramientas de desarrollo.
- **Impacto:** fuga local de PII, incumplimiento de minimización y seguridad, confusión con datos obsoletos.
- **Recomendación:**
  1. Eliminar el código legacy y las claves `ALUMNOS_KEY`, `PAGOS_KEY`, `ASISTENCIA_KEY`.
  2. Al cerrar sesión, borrar todas las claves `ecoems_*` que contengan datos personales (dejar solo preferencias no sensibles, como el tema).
  3. No almacenar PII en `localStorage`; si se necesita caché, usar `sessionStorage` con expiración y sin datos identificables.
  4. Añadir una nota de privacidad sobre el uso de almacenamiento local.
- **Prioridad:** P2
- **Confianza:** Alta
- **Estado:** Abierto

---

### PRIV-05 · Respaldos locales con `auth.users` y PII sin cifrar ni retención

- **Severidad:** Medio (la operación se trata en `OPS-01`)
- **Categoría:** Privacidad / respaldos
- **Ubicación:** `app/scripts/backup-db.mjs:20-51`; `app/.backups/backup-2026-10-31-22-59-01.json`
- **Evidencia:** el script recorre `pg_tables` para `public` y `auth` y escribe un JSON único:

```js
// backup-db.mjs:20-51
where schemaname in ('public', 'auth')
...
backup.tables[`${schemaname}.${tablename}`] = rowsRes.rows[0].data;
...
writeFileSync(outPath, JSON.stringify(backup), "utf8");
```

El archivo observado pesa **878,057 bytes** y tiene permisos `-rw-r--r--` (legible por cualquier usuario del equipo). Contiene `auth.users` (correos, hashes, metadatos) y las tablas con PII.

- **Problema:** un respaldo completo de datos personales de menores queda en disco sin cifrar, sin control de acceso y sin fecha de borrado. No hay política de retención aplicada ni registro de quién accedió.
- **Escenario:** el equipo se pierde o se comparte; el archivo se sincroniza a una nube personal; un tercero con acceso al equipo lee identidades y datos académicos.
- **Impacto:** brecha de datos personales, obligación de notificación, daño reputacional, incumplimiento de medidas de seguridad.
- **Recomendación:**
  1. Cifrar el respaldo en origen (`age`, GPG o `openssl` con clave fuera del repo).
  2. Guardar solo `public`; para `auth.users` usar el respaldo nativo de Supabase, no un volcado manual.
  3. Restringir permisos a `600` y al usuario propietario.
  4. Definir retención (30 días) y borrado automático.
  5. Registrar en un log quién genera y quién restaura.
  6. No versionar ni sincronizar `.backups/` (ya está en `.gitignore`, pero puede estar en iCloud/Dropbox).
- **Prioridad:** P1
- **Confianza:** Alta
- **Estado:** Abierto

---

### PRIV-06 · No hay canal ni procedimiento ARCO en la aplicación

- **Severidad:** Bajo
- **Categoría:** Privacidad / derechos del titular
- **Ubicación:** `Fase-0/05-privacidad-y-consentimiento.md:59,75,185`; `app/frontend/src/ui/app.js` (sin formulario)
- **Evidencia:** el borrador promete un correo `[CORREO DE PRIVACIDAD]` y un procedimiento, pero no hay página, formulario, correo configurado ni pantalla. La única acción disponible es el botón de consentimiento, que no revoca ni solicita nada.
- **Problema:** los derechos de acceso, rectificación, cancelación y oposición no tienen cauce operativo. Tampoco hay forma de solicitar la eliminación de la cuenta o de los datos.
- **Escenario:** un tutor pide eliminar los datos de su hijo; no encuentra cómo; escribe al profesor, que no sabe qué hacer; los datos siguen ahí.
- **Impacto:** incumplimiento, fricción, riesgo de reclamación.
- **Recomendación:** publicar una página “Privacidad y derechos” con correo, formulario y plazos; registrar cada solicitud en una tabla `data_requests` con estado y fechas; definir el procedimiento interno y los responsables; enlazarlo desde el aviso y el panel.
- **Prioridad:** P2
- **Confianza:** Alta
- **Estado:** Abierto

---

### PRIV-07 · `audit_log` guarda PII sin retención ni control de acceso visible

- **Severidad:** Bajo
- **Categoría:** Privacidad / logs
- **Ubicación:** `app/supabase/migrations/0001_schema.sql:508-519`; políticas en `0003_rls.sql`
- **Evidencia:**

```sql
-- 0001:508-519
create table if not exists public.audit_log (
  id bigserial primary key,
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  before jsonb,
  after jsonb,
  ip inet,
  user_agent text,
  created_at timestamptz not null default now()
);
```

Las Edge Functions escriben `before`/`after` con datos del objetivo (por ejemplo, correo y rol en `deactivate-user/index.ts:58-62`).

- **Problema:** los logs de auditoría contienen PII y pueden contener datos sensibles en `before`/`after`. No hay retención definida (el borrador propone 1 año, pero no está implementado), no hay política de acceso explícita para consultarlos y no hay pantalla de auditoría.
- **Escenario:** después de dos años, `audit_log` conserva correos, roles y cambios de datos de alumnos que ya egresaron.
- **Impacto:** acumulación innecesaria de PII, riesgo en caso de brecha, dificultad para cumplir cancelación.
- **Recomendación:** definir retención (12 meses), implementar limpieza programada, minimizar `before`/`after` (guardar solo campos relevantes), restringir lectura a admin y registrar el acceso a los logs.
- **Prioridad:** P3
- **Confianza:** Alta
- **Estado:** Abierto

---

### PRIV-08 · El magic link del tutor viaja por WhatsApp con el nombre del alumno

- **Severidad:** Bajo (la seguridad se trata en `SEC-06`)
- **Categoría:** Privacidad / comunicación con terceros
- **Ubicación:** `app/supabase/functions/invite-guardian/index.ts:128-134`
- **Evidencia:**

```ts
const whatsappMessage = [
  ...
  `Soy el Prof. Luis. Te invito a la plataforma ECOEMS para dar seguimiento a ${studentProfile?.full_name ?? student.student_code}.`,
  ...
];
const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;
```

- **Problema:** el mensaje incluye el **nombre del menor** y un enlace de acceso, y se comparte mediante WhatsApp. Eso expone datos del alumno a un tercero (Meta/WhatsApp) y deja el enlace en el historial del chat, donde puede reenviarse.
- **Escenario:** el profesor comparte el enlace desde su WhatsApp; el mensaje queda en su historial y en el del tutor; el enlace se reenvía a un familiar.
- **Impacto:** exposición de datos del menor a un proveedor externo, acceso no autorizado, falta de control sobre la difusión.
- **Recomendación:** enviar la invitación por correo electrónico al tutor; si se usa WhatsApp, no incluir el nombre del alumno ni el enlace en el mismo mensaje (enviar un código y pedir que se canjee en la app); documentar a WhatsApp como encargado del tratamiento o evitar su uso para datos de menores.
- **Prioridad:** P3
- **Confianza:** Alta
- **Estado:** Abierto

---

## 9. Matriz de riesgos de privacidad

| Riesgo | Probabilidad | Impacto | Nivel | Hallazgo |
|---|---|---|---|---|
| Tutor acepta sin leer el aviso | Alta | Alto | **Alto** | PRIV-01 |
| Alumno/tutor lee notas internas | Alta | Alto | **Alto** | PRIV-02 |
| Perfil vocacional mal interpretado | Media | Medio | Medio | PRIV-03 |
| PII residual en navegador compartido | Media | Medio | Medio | PRIV-04 |
| Brecha por respaldo sin cifrar | Media | Alto | Medio | PRIV-05 |
| Solicitud ARCO sin cauce | Media | Medio | Bajo | PRIV-06 |
| Retención indefinida de logs | Alta | Bajo | Bajo | PRIV-07 |
| Datos del menor expuestos a WhatsApp | Media | Bajo | Bajo | PRIV-08 |

---

## 10. Checklist de cumplimiento (estado actual)

| Requisito | Estado | Evidencia |
|---|---|---|
| Aviso de privacidad publicado | ❌ | Solo borrador en `Fase-0/` |
| Aviso enlazado desde el registro/login | ❌ | Sin enlace |
| Consentimiento del tutor para menores | ⚠️ | Se registra, pero no bloquea ni informa |
| Evidencia del texto aceptado | ❌ | Solo versión, sin hash |
| Revocación accesible | ❌ | Existe en API, no en UI |
| Canal ARCO | ❌ | No existe |
| Retención definida e implementada | ❌ | Solo propuesta |
| Eliminación/anonimización | ❌ | FKs lo impiden |
| Minimización de datos | ⚠️ | `notes_internal`, perfil vocacional expuestos |
| Cifrado de respaldos | ❌ | JSON plano |
| Registro de actividades de tratamiento | ⚠️ | `audit_log` parcial |
| Responsable de privacidad designado | ❌ | No documentado |
| Proveedores identificados en el aviso | ⚠️ | Supabase, GitHub, WhatsApp no declarados |
| Evaluación de impacto (PIA) | ❌ | No realizada |

---

## 11. Recomendaciones por horizonte

### P0 (antes de datos reales)

1. Publicar el aviso y enlazarlo desde el login y el panel.
2. Bloquear el acceso hasta el consentimiento del tutor.
3. Guardar hash del texto aceptado.
4. Sacar `notes_internal` de la tabla visible a la familia.

### P1 (primeras dos semanas)

5. Cifrar respaldos y aplicar retención.
6. Definir finalidad y visibilidad del perfil vocacional.
7. Exponer la revocación del consentimiento.
8. Documentar proveedores y responsable de privacidad.

### P2 (30 días)

9. Publicar canal ARCO y registrar solicitudes.
10. Implementar anonimización al egreso.
11. Limpiar `localStorage` y eliminar el código legacy.
12. Retención de `audit_log`.

### P3 (90 días)

13. Evaluación de impacto (PIA) formal.
14. Revisión legal del aviso y del consentimiento.
15. Sustituir WhatsApp por correo para invitaciones.
16. Capacitar al personal en manejo de datos de menores.

---

## 12. Conclusión

La privacidad de ECOEMS está **bien pensada en el papel y poco implementada en el producto**. El borrador de Fase 0 tiene la estructura correcta: aviso, consentimiento, retención, ARCO, medidas de seguridad. Pero la app no publica el aviso, no bloquea sin consentimiento, no guarda evidencia del texto, no permite revocar y no ofrece canal ARCO.

El riesgo más concreto no es abstracto: **un tutor puede aceptar sin leer, un alumno puede leer las notas internas del profesor y un respaldo sin cifrar puede exponer el expediente completo de un menor**. Los tres se corrigen con cambios acotados.

La condición para operar con menores no es tener un aviso perfecto: es que **el aviso exista, se muestre antes de recabar, se pueda demostrar qué se aceptó y se pueda revocar**. Hoy no se cumple ninguna de las cuatro.
