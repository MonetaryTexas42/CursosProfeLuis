# 06 · Código y calidad

## 1. Resumen

El código es **legible, directo y sin dependencias innecesarias**. El frontend es JavaScript vanilla con Vite; el backend son migraciones SQL comentadas y Edge Functions en TypeScript. No hay framework, ni estado global complejo, ni capas de abstracción que oculten el flujo.

Los problemas son de **escala y disciplina**:

- Un archivo `app.js` de **7,072 líneas** concentra toda la SPA.
- Un reproductor legacy de **2,018 líneas** mantiene gestión en `localStorage` que ya no se usa.
- La autorización se implementa dos veces: en RLS y en filtros de cliente.
- No hay lint, tests unitarios ni lockfile versionado.
- Las pruebas existentes cubren caminos felices, no denegaciones.

**Nivel de riesgo de código:** **Medio**, con deuda que empieza a frenar el cambio.

---

## 2. Métricas

| Archivo | Líneas | Rol |
|---|---:|---|
| `frontend/src/ui/app.js` | 7,072 | SPA principal |
| `frontend/src/styles.css` | 4,027 | Estilos |
| `frontend/public/curso/js/app.js` | 2,018 | Reproductor legacy |
| `frontend/public/curso/js/sistema2.js` | 1,704 | Motor del curso |
| `frontend/public/curso/js/login-gate.js` | 319 | Puerta de acceso |
| `frontend/src/lib/supabase.js` | 28 | Cliente |
| `frontend/src/main.js` | 4 | Entry point |
| `scripts/ui-smoke.mjs` | 855 | E2E |
| Migraciones SQL | 4,825 | Esquema, RLS, RPCs |
| Edge Functions | 794 | 6 funciones |

### 2.1. Distribución del frontend

- **Sin módulos**: `app.js` exporta `initApp` y contiene todo lo demás en el mismo archivo.
- **Sin tipos**: no hay TypeScript ni JSDoc sistemático.
- **Sin framework reactivo**: el estado se maneja a mano (`state`) y se re-renderiza con `innerHTML`.
- **Sin router**: el portal usa vistas por estado; el curso usa hash routing (`#/...`).
- **Sin componentes**: el markup se construye con template literals.

### 2.2. Complejidad

| Indicador | Valor | Comentario |
|---|---:|---|
| Funciones en `app.js` | > 150 | Difícil de navegar |
| Interpolaciones `${...}` | > 400 | Muchas son IDs/clases; requieren revisión |
| `catch {}` vacíos | 7 | Algunos intencionales, otros ocultan errores |
| `innerHTML` | Frecuente | Se usa con `escapeHtml` en la mayoría |
| `eval` / `document.write` | 0 | Bien |
| `localStorage` | 9 usos | Estado de UI + datos legacy |

---

## 3. Estructura del frontend

```
main.js
  └── initApp(root)
        ├── renderLogin()
        ├── renderLoading()
        ├── renderConfig()
        ├── renderChangePassword()
        ├── renderDashboard()
        │     ├── fetchAdminDashboard()
        │     ├── fetchTeacherDashboard()
        │     ├── fetchGuardianDashboard()
        │     └── fetchStudentDashboard()
        ├── renderUnit()
        ├── renderFicha()
        ├── renderPayDialog()
        ├── renderUnitAssignDialog()
        ├── renderTestDialog()
        └── signOut()
```

### 3.1. Patrón de render

1. Se actualiza `state`.
2. Se construye un string HTML.
3. Se asigna a `appRoot.innerHTML`.
4. Se conectan eventos con `querySelectorAll(...).forEach(...)`.

**Ventaja:** simple, sin dependencias.
**Desventaja:** cada render reconstruye todo; se pierde foco, scroll y estado de inputs si no se maneja con cuidado.

### 3.2. Manejo de estado

```js
const state = {
  session: null,
  profile: null,
  dashboard: null,
  view: 'login',
  mode: 'student',
  error: '',
  notice: '',
  unitView: null,
  unitResults: {},
  // ...
};
```

- No hay inmutabilidad ni suscripciones.
- `state.dashboard` se reemplaza tras cada `loadDashboard`.
- `state.unitResults` se pierde al cerrar la unidad.

---

## 4. Backend

### 4.1. Migraciones

- SQL legible, comentado, con separación por responsabilidad.
- Uso consistente de `create table if not exists`, `create or replace function`, `grant/revoke`.
- `security definer` + `set search_path` en todas las funciones.
- Evaluación de respuestas en servidor.
- **Debilidad:** `create policy` sin `drop policy if exists` (no idempotente).

### 4.2. Edge Functions

- Estructura compartida (`_shared/auth.ts`, `http.ts`, `validation.ts`).
- Validación de entrada con `asString`, `asEmail`, `asUuid`, etc.
- `requireCaller` valida token y perfil activo.
- `assertAdminOrTeacherOfGroup/Student` centraliza permisos.
- `audit` registra acciones.
- **Debilidad:** CORS `*` por defecto; sin rate limiting.

### 4.3. Duplicación de autorización

La autorización vive en dos lugares:

1. **RLS**: `app_can_access_student`, `app_has_active_assignment`, etc.
2. **Frontend**: filtros como `allowed[unit_id]`, `state.dashboard.units`, `if (profile.role === ...)`.

El frontend no debe ser la fuente de verdad. Cuando el filtro de cliente es la única barrera (como en `login-gate.js`), la seguridad se rompe (`SEC-01`).

---

## 5. Pruebas existentes

| Prueba | Cobertura | Limitación |
|---|---|---|
| `supabase/tests/0004_progress_rpcs.sql` | Flujo de progreso, intentos, quiz, completar | Datos reales de “Piloto A” y “Alexa”; no prueba denegaciones |
| `supabase/tests/0006_game_reading_rpcs.sql` | Juegos y lectura | Camino feliz |
| `supabase/tests/0007_content_smoke.sql` | Contenido real | Asigna unidades al grupo; escribe |
| `scripts/ui-smoke.mjs` | E2E alumno/profesor/admin/tests | `TEST_WRITE=1` escribe; depende de Chrome y credenciales |
| `scripts/test-functions.mjs` | Edge Functions desplegadas | Requiere `.secrets/test-users.txt` y producción |

**No hay:**

- Pruebas unitarias de funciones puras.
- Pruebas de RLS negativas (alumno A no ve alumno B, alumno sin asignación no ve contenido).
- Pruebas de componentes o de accesibilidad.
- Pruebas de contrato de las RPCs.
- Pruebas de carga.

---

## 6. Hallazgos de código

### COD-01 · Reproductor legacy con gestión en `localStorage` y rutas muertas

- **Severidad:** Medio
- **Categoría:** Código / deuda técnica
- **Ubicación:** `frontend/public/curso/js/app.js:5,62-104,382-390,444-460`
- **Evidencia:**

```js
// app.js:5
Router hash + renderizador + gamificación + gestión alumnos/pagos (localStorage).

// app.js:62-104
const STORE_KEY = "...";
const ALUMNOS_KEY = "...";
const PAGOS_KEY = "...";
const ASISTENCIA_KEY = "...";
function loadState() { ... localStorage.getItem(STORE_KEY) ... }
function saveState() { ... localStorage.setItem(STORE_KEY, ...) ... }
```

```js
// app.js:382-390
const legacyViews = ["asistencia", "pagos", "planificacion", "taller", "perfil", "concentrado", "catalogo"];
if (legacyViews.indexOf(r.view) >= 0) { setAccent(null); renderHome(); return; }
```

- **Problema:** el reproductor conserva código de una versión anterior que gestionaba alumnos, pagos y asistencia en `localStorage`. Ya no se muestra, pero:
  - Aumenta el tamaño y la superficie de ataque.
  - Puede contener datos residuales de usuarios que usaron la versión anterior.
  - Confunde a quien mantiene el código.
- **Escenario:** un alumno que usó la versión antigua tiene `ecoems_*` en `localStorage` con nombres o pagos; el código sigue leyendo/escribiendo esas claves.
- **Impacto:** deuda, posible exposición local, mantenimiento más caro.
- **Recomendación:** eliminar el código legacy y las claves de `localStorage`; si se necesita compatibilidad, migrar una vez y borrar. Reducir `app.js` a lo que el reproductor realmente usa.
- **Prioridad:** P2
- **Confianza:** Alta
- **Estado:** Abierto

---

### COD-02 · La autorización se duplica y el cliente es la única barrera en el curso

- **Severidad:** Medio
- **Categoría:** Código / seguridad
- **Ubicación:** `login-gate.js:248-301`; `app.js` (múltiples `if (profile.role ...)`)
- **Evidencia:** el reproductor descarga todo y filtra con `allowed[unit_id]`; el portal decide vistas por `profile.role`; la base tiene sus propias políticas.
- **Problema:** tres fuentes de verdad para la misma decisión. Cuando divergen, gana la más permisiva (el cliente) o se producen comportamientos inconsistentes.
- **Escenario:** se agrega un rol nuevo o se cambia una regla; se actualiza RLS pero no el filtro de cliente, o viceversa.
- **Impacto:** regresiones de seguridad, bugs difíciles de reproducir.
- **Recomendación:** una sola fuente de verdad en la base; el cliente solo renderiza lo que recibe. Si se necesita ocultar UI, derivar de permisos calculados por el servidor, no de `role` hardcodeado.
- **Prioridad:** P2
- **Confianza:** Alta
- **Estado:** Abierto

---

### COD-03 · Interpolaciones sin escape y `catch` silenciosos

- **Severidad:** Bajo
- **Categoría:** Código / robustez
- **Ubicación:** `app.js:6344`, `6677`; `catch {}` en `399`, `4566`, `4602`, `5662`, `6454`, `6983`, `7021`
- **Evidencia:**

```js
// 6344
setNotice(`Profesor ${result.profile.full_name} creado...`);

// 6677
const subject = `Aviso sobre ${student?.full_name || 'el alumno'}`;
```

`setNotice` escapa al renderizar (`alertMarkup` usa `escapeHtml`), así que el primer caso es seguro en la práctica. El segundo se guarda en `guardian_messages.subject`; si alguna vista lo renderiza sin escapar, sería XSS almacenado. No se encontró una vista que lo muestre, pero el dato queda almacenado.

- **Problema:** no hay una regla consistente de “escapar en el límite”; se escapa a veces al construir y a veces al renderizar. Los `catch` vacíos ocultan fallos de `localStorage`, parseo y red.
- **Escenario:** un nombre con `<script>` se guarda; una vista futura lo interpola sin escapar. Un `catch` vacío impide detectar que el guardado falló.
- **Impacto:** XSS potencial, bugs silenciosos.
- **Recomendación:** escapar siempre al renderizar, no al almacenar; usar una función `html` etiquetada o un sanitizador; revisar cada `catch` y registrar o propagar el error.
- **Prioridad:** P3
- **Confianza:** Media
- **Estado:** Abierto

---

### COD-04 · Sin lint, tests unitarios ni verificación de tipos

- **Severidad:** Bajo
- **Categoría:** Código / calidad
- **Ubicación:** `frontend/package.json` (solo `dev`, `build`, `preview`); no hay `.eslintrc`, `tsconfig`, `vitest`, `jest`
- **Evidencia:** no hay scripts de lint/test; no hay configuración de TypeScript.
- **Problema:** los errores se detectan en producción o en el smoke E2E; no hay red de seguridad para refactors.
- **Escenario:** se renombra una función o se cambia una firma de RPC; el build pasa, el E2E falla tarde.
- **Impacto:** regresiones, miedo a cambiar.
- **Recomendación:** añadir ESLint + Prettier, Vitest para funciones puras, y un chequeo de tipos con JSDoc o migración gradual a TypeScript. Integrar en CI.
- **Prioridad:** P3
- **Confianza:** Alta
- **Estado:** Abierto

---

### COD-05 · Monolito de 7,072 líneas sin módulos

- **Severidad:** Bajo
- **Categoría:** Código / mantenibilidad
- **Ubicación:** `frontend/src/ui/app.js`
- **Evidencia:** un solo archivo con login, dashboards, unidades, quizzes, tests, ficha, pagos, activación y consentimiento.
- **Problema:** navegación difícil, conflictos de merge, funciones con muchas responsabilidades.
- **Escenario:** dos personas trabajan en pagos y en unidades; ambas tocan `app.js` y el merge es doloroso.
- **Impacto:** velocidad de cambio, riesgo de romper algo no relacionado.
- **Recomendación:** dividir por dominio (`auth.js`, `dashboard.js`, `units.js`, `payments.js`, `ficha.js`, `tests.js`) y por capa (`api.js`, `render.js`, `state.js`). No requiere framework.
- **Prioridad:** P3
- **Confianza:** Alta
- **Estado:** Abierto

---

### COD-06 · `catch` vacíos que ocultan fallos

- **Severidad:** Bajo
- **Categoría:** Código / observabilidad
- **Ubicación:** `app.js:399,4566,4602,5662,6454,6983,7021`
- **Evidencia:** bloques `catch { /* ignorar */ }` o `catch {}` sin log ni feedback.
- **Problema:** si falla el guardado de una preferencia, el parseo de un JSON o una llamada, el usuario no lo sabe y el equipo tampoco.
- **Escenario:** `localStorage` está lleno; el guardado falla silenciosamente; la preferencia no persiste y nadie lo detecta.
- **Impacto:** bugs invisibles, soporte reactivo.
- **Recomendación:** registrar en consola con contexto en desarrollo; para fallos de datos, mostrar un aviso no bloqueante; nunca ignorar errores de red.
- **Prioridad:** P3
- **Confianza:** Alta
- **Estado:** Abierto

---

### COD-07 · No hay pruebas negativas de RLS

- **Severidad:** Medio
- **Categoría:** Código / pruebas de seguridad
- **Ubicación:** `app/supabase/tests/*.sql`
- **Evidencia:** las 3 pruebas existentes recorren caminos felices con datos reales. No hay aserciones del tipo “el alumno A no ve al alumno B” o “el alumno sin asignación no ve la versión”.
- **Problema:** la regresión de `0009` no se habría detectado con las pruebas actuales. Cualquier cambio futuro de políticas puede abrir una brecha sin que el CI lo note.
- **Escenario:** alguien agrega una política permisiva para “arreglar” el reproductor; las pruebas siguen pasando; el contenido queda expuesto.
- **Impacto:** seguridad no verificada, confianza excesiva en la revisión manual.
- **Recomendación:** crear una suite de pruebas de RLS con JWT por rol y aserciones de filas; ejecutarla en CI contra staging. Ver `12_PRUEBAS_PENDIENTES.md`.
- **Prioridad:** P1
- **Confianza:** Alta
- **Estado:** Abierto

---

### COD-08 · Sin lockfile versionado ni auditoría de dependencias

- **Severidad:** Bajo
- **Categoría:** Código / cadena de suministro
- **Ubicación:** `frontend/package.json`; no hay `package-lock.json` en el repositorio observado
- **Evidencia:** `package.json` declara rangos `^`; no se encontró lockfile versionado. `npm audit` no se pudo completar en el entorno de auditoría.
- **Problema:** builds no reproducibles; una actualización menor puede cambiar el comportamiento; no hay revisión de vulnerabilidades.
- **Escenario:** `npm install` en otra máquina trae una versión distinta de `@supabase/supabase-js` y rompe el login.
- **Impacto:** deriva, vulnerabilidades no detectadas.
- **Recomendación:** versionar `package-lock.json`, usar `npm ci` en CI y ejecutar `npm audit` con un umbral.
- **Prioridad:** P3
- **Confianza:** Alta
- **Estado:** Abierto

---

### COD-09 · `dist` es un repositorio anidado sin build reproducible

- **Severidad:** Bajo
- **Categoría:** Código / despliegue
- **Ubicación:** `frontend/dist/.git` (rama `gh-pages`); `README.md:30-35`
- **Evidencia:** `dist` tiene su propio `.git`, remoto y commits; se publica con `git push -f`.
- **Problema:** el artefacto publicado no se puede reconstruir de forma determinista desde `main`; no hay trazabilidad entre commit de código y commit de `dist`.
- **Escenario:** se publica un cambio y no se sabe qué commit de `main` le corresponde; un rollback requiere buscar a mano.
- **Impacto:** auditoría de cambios difícil, riesgo de publicar algo no revisado.
- **Recomendación:** generar `dist` en CI y publicar con `gh-pages` o GitHub Actions; etiquetar el commit de código; no versionar `dist` en el repo principal.
- **Prioridad:** P3
- **Confianza:** Alta
- **Estado:** Abierto

---

## 7. Controles positivos de código

| Control | Evidencia |
|---|---|
| Escapado HTML centralizado | `escapeHtml` (`app.js:386-393`), `textBlock` (`4114-4116`) |
| Sin `eval` ni `document.write` | Búsqueda en `app.js`, `sistema2.js`, `login-gate.js` |
| Validación de entrada en Edge Functions | `_shared/validation.ts` |
| Autorización centralizada en el servidor | `_shared/auth.ts`, RLS |
| Evaluación de respuestas en servidor | `0007`, `0005`, `0022` |
| Manejo de errores con `HttpError` | `_shared/http.ts` |
| Comentarios de intención | Migraciones y funciones |
| Sin `service_role` en el bundle | `grep` = 0 |

---

## 8. Deuda técnica priorizada

| Deuda | Impacto | Esfuerzo | Prioridad |
|---|---|---|---|
| Filtrado de contenido en cliente | Seguridad | Bajo (drop policies) | P0 |
| Autorización duplicada | Seguridad | Medio | P1 |
| Pruebas negativas de RLS | Seguridad | Medio | P1 |
| Monolito `app.js` | Mantenibilidad | Alto | P3 |
| Reproductor legacy | Mantenibilidad / privacidad | Medio | P2 |
| Sin lint/tests unitarios | Calidad | Medio | P3 |
| Sin lockfile | Reproducibilidad | Bajo | P3 |
| `dist` anidado | Despliegue | Medio | P3 |
| `catch` vacíos | Observabilidad | Bajo | P3 |

---

## 9. Recomendaciones de código

1. **No agregar funcionalidad nueva hasta cerrar `SEC-01`.** Cualquier feature sobre contenido expuesto hereda el problema.
2. **Crear una capa `api.js`** que centralice las llamadas a Supabase y traduzca errores; hoy están dispersas.
3. **Dividir `app.js` por dominio** sin cambiar el comportamiento; empezar por pagos y unidades.
4. **Eliminar el código legacy** del reproductor y las claves `ecoems_*` de `localStorage`.
5. **Añadir ESLint + Prettier + Vitest** y un script `npm test`.
6. **Versionar el lockfile** y usar `npm ci`.
7. **Añadir pruebas negativas de RLS** antes de tocar políticas.
8. **Publicar `dist` desde CI**, no desde una carpeta con `.git` propio.

---

## 10. Conclusión

El código no es un desastre: es **claro, sin dependencias y con buenas decisiones de seguridad en el servidor**. El problema es que se ha concentrado en un archivo y que la autorización se resolvió dos veces. La deuda es manejable si se paga antes de agregar más funcionalidad.

La mejor inversión de calidad no es reescribir: es **mover la decisión de acceso al servidor**, **probar las denegaciones** y **dividir el monolito** en módulos pequeños. Con eso, el resto se vuelve más fácil.
