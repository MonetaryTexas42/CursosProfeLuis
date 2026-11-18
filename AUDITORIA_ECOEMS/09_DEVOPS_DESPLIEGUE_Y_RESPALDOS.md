# 09 · DevOps, despliegue y respaldos

## 1. Resumen

La operación de ECOEMS es **artesanal**: un solo proyecto de Supabase, un despliegue manual a GitHub Pages, respaldos por script local sin cifrar, restauración destructiva sin confirmación y pruebas E2E que pueden escribir en la base configurada. No hay CI/CD, no hay staging, no hay monitoreo ni alertas.

Para un piloto de un profesor, eso es comprensible: montar toda la infraestructura profesional tiene un costo que no se justifica al inicio. Pero el piloto ya trata datos de menores y ya tiene usuarios reales, así que la falta de red de seguridad deja de ser una decisión de simplicidad y se convierte en un riesgo operativo.

**Nivel de riesgo de operación:** **Alto**, concentrado en tres puntos:

1. **Respaldos sin cifrar con PII** (`OPS-01`).
2. **Restauración que trunca tablas sin confirmación** (`OPS-02`).
3. **Pruebas que escriben en la base configurada** (`OPS-03`), que al no existir staging es producción.

---

## 2. Ambientes

### 2.1. Lo que propone Fase 0

`Fase-0/07-ambientes-y-respaldos.md` define tres ambientes:

| Ambiente | URL | Proyecto Supabase | Datos |
|---|---|---|---|
| Local | `http://localhost:5173` | Local o staging | Semilla ficticia |
| Staging | `https://staging.app.ecoems.mx` | Proyecto staging | Ficticios o copia anonimizada |
| Producción | `https://monetarytexas42.github.io/CursosProfeLuis/` | Producción | Reales |

### 2.2. Lo que existe

| Ambiente | URL | Proyecto Supabase | Datos |
|---|---|---|---|
| Local | `http://localhost:5173` | `ioikcrdxneuydylyhvwi` (producción) | **Producción** |
| Staging | — | — | — |
| Producción | GitHub Pages | `ioikcrdxneuydylyhvwi` | Piloto |

**No hay staging.** El archivo `.env` local apunta al proyecto de producción (`VITE_APP_ENV=producción`). El archivo `.secrets/staging-db-password.txt` existe (31 bytes) pero **no hay proyecto staging** al que corresponda: es un residuo.

**Consecuencia:** cualquier prueba local, cualquier script de seed y cualquier smoke test se ejecuta contra la base real. No hay forma de ensayar una migración ni de reproducir un bug con datos ficticios.

---

## 3. Despliegue

### 3.1. Proceso actual

`app/README.md:28-36`:

```bash
cd app/frontend
npm run build -- --base=/CursosProfeLuis/
cd dist
git init -b gh-pages
git add -A
git commit -m "Build de la plataforma"
git push -f https://github.com/MonetaryTexas42/CursosProfeLuis.git gh-pages
```

### 3.2. Observaciones

| Aspecto | Estado |
|---|---|
| CI/CD | ❌ No hay `.github/workflows` |
| Revisión previa | ❌ No hay PR obligatorio ni check |
| Build reproducible | ❌ `dist` es un repo anidado con su propio historial |
| Trazabilidad código → artefacto | ❌ No hay etiqueta ni registro |
| Rollback | ⚠️ Manual: buscar un commit anterior de `gh-pages` y `push -f` |
| Health check post-deploy | ❌ No existe |
| Versionado visible | ⚠️ Cadena manual `v8-pulido` en el código |
| Caché | ⚠️ GitHub Pages cachea; no hay estrategia de invalidación |

### 3.3. Riesgos del `git push -f`

- Sobrescribe el historial de `gh-pages`; si alguien más publicó, se pierde.
- `git init` dentro de `dist` crea un repositorio nuevo cada vez que se reconstruye desde cero, perdiendo la relación con el commit anterior.
- No hay verificación de que el bundle compilado corresponda al `main` actual.
- Un build fallido o parcial puede publicarse igual.

### 3.4. Deriva entre `src` y `dist`

El repositorio principal está en `main` (`40b01a4`). El repo anidado `dist` está en `gh-pages` (`2114eba`). Los mensajes son similares pero **no hay un vínculo verificable** entre ambos commits. Nada impide publicar un `dist` construido desde un estado no commiteado.

---

## 4. Respaldos

### 4.1. Script actual

`app/scripts/backup-db.mjs`:

1. Conecta con `DATABASE_URL` (cadena de conexión directa, superusuario).
2. Lista todas las tablas de `public` y `auth`.
3. Vuelca cada tabla a JSON con `jsonb_agg(to_jsonb(t))`.
4. Escribe un único archivo `.backups/backup-<fecha>.json` **sin cifrar**.

### 4.2. Propiedades observadas

| Propiedad | Valor |
|---|---|
| Archivo | `.backups/backup-2026-10-31-22-59-01.json` |
| Tamaño | 878,057 bytes (857 KB) |
| Permisos | `-rw-r--r--` (legible por cualquier usuario del equipo) |
| Cifrado | ❌ Ninguno |
| Esquemas incluidos | `public` y **`auth`** (correos, hashes, metadatos) |
| Retención | ❌ No hay borrado automático |
| Verificación de integridad | ❌ No hay hash ni checksum |
| Restauración probada | ❌ No hay evidencia |
| Almacenamiento | Disco local (posible sincronización a nube personal) |

### 4.3. Lo que no cubre

- **No es un respaldo físico:** no incluye el esquema, las políticas, las funciones ni los triggers. Depende de que las migraciones se apliquen por separado.
- **No incluye Storage** (no usado hoy, pero relevante si se agregan archivos).
- **No incluye la configuración de Auth** (proveedores, plantillas, rate limits).
- **No hay respaldo automático** desde Supabase verificado.

### 4.4. Restauración

`app/scripts/restore-db.mjs`:

1. Lee el JSON.
2. Abre una transacción.
3. `set local session_replication_role = replica` (desactiva triggers y FKs).
4. **`truncate table ... cascade`** para cada tabla.
5. Inserta las filas.
6. `commit`.

**Problemas:**

- No pide confirmación interactiva.
- No verifica que `DATABASE_URL` no sea producción.
- No hace un respaldo previo automático.
- No valida el archivo de entrada (podría ser un JSON parcial o corrupto).
- Si falla a mitad, la transacción revierte, pero si el `truncate` se ejecutó fuera de transacción o el `commit` es parcial, el daño es total.
- No registra quién restauró ni cuándo.

---

## 5. Secretos y credenciales

### 5.1. Inventario observado (sin valores)

| Archivo | Permisos | Contenido | Riesgo |
|---|---|---|---|
| `.secrets/database-url` | `600` | Cadena de conexión directa | Alto si se filtra: acceso total a la BD |
| `.secrets/test-users.txt` | `600` | Credenciales de cuentas de prueba | Medio: acceso a cuentas del piloto |
| `.secrets/staging-db-password.txt` | `644` | Contraseña de un staging inexistente | Bajo, pero es un residuo |

### 5.2. Lo que está bien

- `.secrets/` y `.backups/` están en `.gitignore`.
- No hay archivos sensibles versionados (`git ls-files` no los muestra).
- No hay `service_role` en el bundle compilado.
- La anon key es pública por diseño.

### 5.3. Lo que falta

- **Rotación:** no hay procedimiento ni recordatorio. Si `database-url` se filtró, sigue siendo válida.
- **Cifrado en reposo:** los archivos están en claro en el disco.
- **Gestión:** no hay un gestor de secretos (1Password, Bitwarden, variables de CI).
- **Alcance:** la cadena de conexión parece ser de superusuario; debería ser un rol de solo lectura para respaldos.
- **Residuos:** `staging-db-password.txt` con permisos `644` y sin proyecto asociado.
- **MFA:** no se puede verificar si el panel de Supabase y GitHub tienen MFA.

---

## 6. Monitoreo y observabilidad

| Capacidad | Estado |
|---|---|
| Logs de aplicación | ❌ Solo `console.error` local |
| Logs de Auth | ⚠️ Disponibles en Supabase, no revisados |
| Logs de PostgREST | ⚠️ Disponibles, no revisados |
| Logs de Edge Functions | ⚠️ Disponibles, no revisados |
| Métricas (latencia, errores) | ❌ |
| Alertas (caída, error 5xx, respaldo fallido) | ❌ |
| Uptime check | ❌ |
| Panel de salud | ❌ |
| Trazas de error de usuario | ❌ |
| Correlación de incidentes | ❌ |

**Consecuencia:** si el login falla, si una RPC empieza a devolver error o si el respaldo no se ejecutó, nadie se entera hasta que un usuario escribe.

---

## 7. Hallazgos de DevOps

### OPS-01 · Respaldos completos sin cifrar, con `auth.users` y PII, sin retención

- **Severidad:** Alto
- **Categoría:** DevOps / respaldos / privacidad
- **Ubicación:** `app/scripts/backup-db.mjs:20-51`; `.backups/backup-2026-10-31-22-59-01.json`
- **Evidencia:**

```js
// backup-db.mjs:20-24
select schemaname, tablename
  from pg_tables
 where schemaname in ('public', 'auth')
 order by schemaname, tablename
```

```js
// backup-db.mjs:41-51
const rowsRes = await client.query(
  `select coalesce(jsonb_agg(to_jsonb(t)), '[]'::jsonb) as data from ${quoted} t`,
);
...
writeFileSync(outPath, JSON.stringify(backup), "utf8");
```

El archivo observado: 878,057 bytes, permisos `-rw-r--r--`, sin cifrado.

- **Problema:** se vuelca toda la base, incluido el esquema `auth`, a un JSON legible. No hay cifrado, control de acceso, retención ni registro. El respaldo contiene identidades, correos, hashes y datos académicos de menores.
- **Escenario:** el equipo se pierde, se comparte o se sincroniza a una nube personal; un tercero lee el archivo y obtiene el expediente completo. O el archivo se sube por error a un chat.
- **Impacto:** brecha de datos personales, obligación de notificación, daño reputacional, riesgo legal.
- **Recomendación:**
  1. Cifrar en origen con `age` o GPG y guardar la clave fuera del equipo.
  2. Excluir `auth.users` del volcado manual; usar el respaldo nativo de Supabase para Auth.
  3. Aplicar `chmod 600` y una carpeta con permisos restringidos.
  4. Definir retención (30 días) y borrado automático.
  5. Calcular un checksum y registrar la generación en un log.
  6. Probar la restauración en staging al menos una vez.
- **Prioridad:** P1
- **Confianza:** Alta
- **Estado:** Abierto

---

### OPS-02 · La restauración trunca tablas sin confirmación ni respaldo previo

- **Severidad:** Alto
- **Categoría:** DevOps / recuperación / riesgo de pérdida de datos
- **Ubicación:** `app/scripts/restore-db.mjs:39-49`
- **Evidencia:**

```js
await client.query("begin");
await client.query("set local session_replication_role = replica");
await client.query("set local statement_timeout = '5min'");

for (const [name] of tables) {
  if (SKIP.has(name)) continue;
  const [schema, table] = name.split(".");
  await client.query(`truncate table "${schema}"."${table}" cascade`);
}
```

- **Problema:** el script vacía todas las tablas antes de cargar, sin pedir confirmación, sin verificar el entorno y sin respaldo previo. Un error de dedo en `DATABASE_URL` o en la ruta del archivo puede borrar producción.
- **Escenario:** el operador quiere restaurar en staging, pero `DATABASE_URL` apunta a producción (no hay staging). Ejecuta el script con un respaldo viejo o parcial. Todas las tablas se truncan y la carga falla; la transacción revierte si todo está dentro de `begin`, pero cualquier paso fuera de ella deja la base vacía.
- **Impacto:** pérdida total o parcial de datos, interrupción del servicio, imposibilidad de rendir cuentas.
- **Recomendación:**
  1. Exigir una bandera explícita (`--confirm=restore`) y escribir el nombre del proyecto/entorno en pantalla.
  2. Rechazar URLs que contengan el `ref` de producción salvo una bandera adicional (`--i-know`).
  3. Hacer un respaldo automático antes de truncar.
  4. Validar el JSON de entrada (esquema, tablas, conteos, checksum).
  5. Ejecutar siempre en staging primero; documentar el runbook.
  6. Registrar en `audit_log` o en un log externo quién restauró, cuándo y desde qué archivo.
- **Prioridad:** P1
- **Confianza:** Alta
- **Estado:** Abierto

---

### OPS-03 · Las pruebas E2E escriben en la base configurada y no distinguen producción

- **Severidad:** Alto
- **Categoría:** DevOps / pruebas / integridad de datos
- **Ubicación:** `app/scripts/ui-smoke.mjs:476,554-580,672,746-770`; `app/scripts/test-functions.mjs:105`
- **Evidencia:**

```js
// ui-smoke.mjs:476
const writeMode = process.env.TEST_WRITE === "1";
...
// ui-smoke.mjs:574
console.log("  (TEST_WRITE=1) activando la unidad para todo el grupo…");
...
// ui-smoke.mjs:746
console.log("  (TEST_WRITE=1) completando el test de personalidad…");
```

`test-functions.mjs:105` consulta un `student_code` que **contiene el nombre completo de una alumna del piloto**, escrito literalmente en el repositorio.

- **Problema:** con `TEST_WRITE=1`, el smoke test activa unidades, edita alumnos, completa tests y deja datos. No verifica que el entorno sea staging. Como no hay staging, la ruta natural es ejecutarlo contra producción. Además, el script de funciones contiene PII en el código.
- **Escenario:** el desarrollador ejecuta `TEST_WRITE=1 node scripts/ui-smoke.mjs` para validar un cambio; activa una unidad para todo el grupo “Piloto A” y completa los tests de la alumna de prueba; los datos reales del piloto se contaminan y las métricas se distorsionan.
- **Impacto:** datos sucios, métricas falsas, exposición de PII en el repo, riesgo de que una prueba destructiva se ejecute en producción.
- **Recomendación:**
  1. Crear un proyecto staging real y apuntar ahí las pruebas.
  2. Bloquear `TEST_WRITE=1` si `VITE_SUPABASE_URL` coincide con el `ref` de producción.
  3. Exigir `APP_ENV=staging` además de `TEST_WRITE`.
  4. Quitar el `student_code` con nombre real del script; usar un identificador ficticio o una variable.
  5. Limpiar los datos creados por la prueba al final (teardown).
  6. Ejecutar el smoke en CI contra staging, no en local contra producción.
- **Prioridad:** P0 (mientras no exista staging)
- **Confianza:** Alta
- **Estado:** Mitigado en código · pendiente de verificación en staging
- **Remediación:** guardas en `scripts/lib/env-guard.mjs` (bloqueo de producción y `APP_ENV=staging`), teardown en `scripts/lib/e2e-teardown.mjs`, `student_code` ficticio configurable (`TEST_STUDENT_CODE`) y eliminación de PII de scripts y pruebas SQL. Ver `docs/staging.md` §3.10.

---

### OPS-04 · Despliegue manual con `push -f`, sin CI, sin staging y sin rollback

- **Severidad:** Alto
- **Categoría:** DevOps / despliegue
- **Ubicación:** `app/README.md:28-36`; ausencia de `.github/workflows`
- **Evidencia:** el proceso es `npm run build`, `git init` en `dist`, `git add`, `git commit`, `git push -f`. No hay workflow, ni PR obligatorio, ni check de build, ni health check.

- **Problema:** el artefacto publicado no se puede reconstruir de forma determinista, no hay trazabilidad con `main`, y el `push -f` puede sobrescribir cambios. Un error de build se publica sin aviso.
- **Escenario:** se publica un cambio que rompe el login; nadie lo detecta hasta que un alumno escribe. El rollback requiere buscar a mano un commit anterior de `gh-pages` y volver a hacer `push -f`, con el mismo riesgo.
- **Impacto:** interrupciones, pérdida de trabajo, dificultad para auditar qué se publicó y cuándo.
- **Recomendación:**
  1. Crear un workflow de GitHub Actions: `npm ci`, `npm run build`, pruebas, y publicación a `gh-pages` solo desde `main`.
  2. Etiquetar cada despliegue con el commit de origen (`v8-pulido+40b01a4`).
  3. Añadir un health check post-deploy (login, carga de dashboard).
  4. Documentar el rollback: revertir el commit y volver a desplegar, sin `-f`.
  5. Separar staging y producción con entornos de GitHub.
- **Prioridad:** P1
- **Confianza:** Alta
- **Estado:** Abierto

---

### OPS-05 · Configuración de Supabase no versionada y Auth sin verificar

- **Severidad:** Medio
- **Categoría:** DevOps / configuración como código
- **Ubicación:** `app/supabase/.temp/linked-project.json`; ausencia de `app/supabase/config.toml`
- **Evidencia:** el proyecto está enlazado (`ref: ioikcrdxneuydylyhvwi`), pero no hay `config.toml` ni un archivo equivalente que declare Auth, correo, rate limits, CORS o funciones.

- **Problema:** la configuración vive solo en el dashboard. No se puede revisar, versionar ni reproducir. Si alguien cambia el autorregistro o la confirmación de correo, no queda rastro. Esto agrava `SEC-02`.
- **Escenario:** se reconstruye staging desde el repo; el Auth queda con valores por defecto distintos a producción; las pruebas pasan en un entorno y fallan en otro.
- **Impacto:** deriva de configuración, imposibilidad de auditar, riesgos de seguridad invisibles.
- **Recomendación:**
  1. Ejecutar `supabase init` y versionar `config.toml` con valores no secretos.
  2. Documentar en el README los ajustes del dashboard (sign-ups, confirmación, expiración, rate limits, plantillas).
  3. Revisar y registrar el estado actual de Auth antes del piloto real.
  4. Aplicar la configuración por entorno con `supabase config push`.
- **Prioridad:** P1
- **Confianza:** Alta
- **Estado:** Abierto

---

### OPS-06 · Secretos locales sin rotación, con residuos y permisos inconsistentes

- **Severidad:** Medio
- **Categoría:** DevOps / gestión de secretos
- **Ubicación:** `app/.secrets/database-url`, `test-users.txt`, `staging-db-password.txt`
- **Evidencia:** `.secrets/` contiene tres archivos; `staging-db-password.txt` tiene permisos `644` y no corresponde a ningún proyecto existente. No hay procedimiento de rotación ni gestor de secretos.

- **Problema:** los secretos están en claro en el disco, sin rotación ni propietario documentado. Un archivo huérfano sugiere que hubo un staging que ya no existe o que nunca se creó.
- **Escenario:** el equipo se comparte; `staging-db-password.txt` es legible por cualquier usuario; alguien la prueba contra el proyecto real por error.
- **Impacto:** acceso no autorizado, confusión operativa, riesgo de filtración.
- **Recomendación:**
  1. Eliminar el archivo huérfano.
  2. Aplicar `chmod 600` a todos los archivos de `.secrets/`.
  3. Rotar `database-url` y las contraseñas de prueba después del piloto.
  4. Usar un gestor de secretos o variables de entorno del sistema/CI.
  5. Documentar el procedimiento de rotación y el responsable.
  6. Verificar MFA en GitHub y Supabase.
- **Prioridad:** P2
- **Confianza:** Alta
- **Estado:** Abierto

---

### OPS-07 · Sin monitoreo, alertas ni respaldos automáticos verificados

- **Severidad:** Medio
- **Categoría:** DevOps / observabilidad
- **Ubicación:** todo el proyecto; ausencia de configuración de logs, métricas o alertas
- **Evidencia:** no hay integración de Sentry, Logflare, health checks, ni alertas de Supabase. El respaldo es manual (`node scripts/backup-db.mjs`). No se verificó el estado de los respaldos automáticos de Supabase.

- **Problema:** los incidentes se detectan por reporte de usuario. No hay forma de saber si el respaldo se ejecutó, si aumentaron los errores 5xx o si un endpoint dejó de responder.
- **Escenario:** una migración rompe una RPC; los alumnos ven un error genérico; el profesor no sabe a quién avisar; pasan días.
- **Impacto:** tiempo de inactividad prolongado, pérdida de confianza, recuperación reactiva.
- **Recomendación:**
  1. Activar y verificar los respaldos automáticos de Supabase (según plan).
  2. Configurar alertas de error 5xx, latencia y uso de disco/CPU.
  3. Añadir un uptime check externo (por ejemplo, una petición a `/rest/v1/` con la anon key).
  4. Integrar un recolector de errores del frontend (Sentry o similar) con scrubbing de PII.
  5. Documentar el runbook de incidentes y el canal de aviso.
- **Prioridad:** P2
- **Confianza:** Alta
- **Estado:** Abierto

---

### OPS-08 · Sin rotación de claves ni plan de respuesta a incidentes

- **Severidad:** Bajo
- **Categoría:** DevOps / seguridad operativa
- **Ubicación:** `.secrets/`, `frontend/.env`, Edge Functions
- **Evidencia:** no hay calendario de rotación, ni inventario de claves, ni procedimiento para revocar y reemplazar la anon key, la `service_role`, la cadena de conexión o las contraseñas de prueba.

- **Problema:** si una clave se filtra, no hay un plan claro. La anon key está duplicada en tres lugares (`SEC-08`), lo que complica la rotación.
- **Escenario:** se descubre que `database-url` estuvo en un chat; no se sabe qué rotar primero ni cómo verificar que todo sigue funcionando.
- **Impacto:** respuesta lenta, ventana de exposición más larga.
- **Recomendación:** inventariar claves y su ubicación; definir frecuencia de rotación (90 días o tras incidente); documentar el procedimiento; centralizar la anon key; probar la rotación en staging.
- **Prioridad:** P3
- **Confianza:** Alta
- **Estado:** Abierto

---

### OPS-09 · Sin staging real: todo se prueba contra producción

- **Severidad:** Bajo (por sí mismo; agrava OPS-02 y OPS-03)
- **Categoría:** DevOps / ambientes
- **Ubicación:** `.env` local apunta a producción; `.secrets/staging-db-password.txt` sin proyecto
- **Evidencia:** no hay un segundo proyecto de Supabase ni una URL de staging. La documentación de Fase 0 lo propone, pero no se implementó.

- **Problema:** no hay lugar seguro para probar migraciones, restauraciones, cambios de Auth o el smoke test. Cada prueba es un riesgo para los datos reales.
- **Escenario:** se quiere validar la migración que cierra `SEC-01`; no hay dónde probarla sin tocar producción.
- **Impacto:** cambios sin ensayo, miedo a corregir, incidentes evitables.
- **Recomendación:** crear un proyecto Supabase de staging (plan gratuito es suficiente), aplicar las migraciones desde cero, sembrar datos ficticios, apuntar ahí el `.env` de desarrollo y ejecutar el smoke con `TEST_WRITE=1`.
- **Prioridad:** P2 (habilitante de P0/P1)
- **Confianza:** Alta
- **Estado:** Abierto

---

### OPS-10 · `dist` es un repositorio anidado que deriva de `src`

- **Severidad:** Bajo
- **Categoría:** DevOps / artefactos
- **Ubicación:** `app/frontend/dist/.git` (rama `gh-pages`, commit `2114eba`); `main` en `40b01a4`
- **Evidencia:** `dist` tiene su propio `.git`, remoto y commits. No hay etiqueta ni archivo de correspondencia con el commit de `main`.

- **Problema:** el artefacto publicado no se puede reconstruir ni auditar con certeza. `dist` puede contener cambios no commiteados en `src`.
- **Escenario:** se publica un hotfix directo en `dist`; el siguiente build desde `src` lo borra y el cambio se pierde.
- **Impacto:** deriva, pérdida de cambios, auditoría difícil.
- **Recomendación:** no versionar `dist`; generarlo en CI y publicarlo con `gh-pages`; etiquetar el commit de origen; verificar que el build sea reproducible (`npm ci` + lockfile).
- **Prioridad:** P3
- **Confianza:** Alta
- **Estado:** Abierto

---

## 8. Runbook mínimo recomendado

### 8.1. Antes de una migración

1. Confirmar que existe un respaldo cifrado reciente.
2. Aplicar la migración en staging desde cero.
3. Ejecutar pruebas positivas y negativas (RLS).
4. Verificar el plan de rollback.
5. Aplicar en producción en ventana de baja actividad.
6. Ejecutar health check y revisar logs.

### 8.2. Antes de un despliegue

1. `npm ci` y `npm run build` desde un árbol limpio.
2. Ejecutar smoke contra staging.
3. Verificar que el bundle no contiene `service_role`.
4. Etiquetar el commit.
5. Publicar y comprobar login + dashboard.
6. Tener el commit anterior a mano para rollback.

### 8.3. Ante un incidente

1. Contener: desactivar la función o el usuario afectado.
2. Evaluar alcance con `audit_log` y logs de Supabase.
3. Rotar credenciales si aplica.
4. Restaurar desde respaldo verificado si hay pérdida.
5. Comunicar a los tutores afectados si hay datos personales comprometidos.
6. Documentar la causa y la acción correctiva.

---

## 9. Checklist de operación

| Requisito | Estado |
|---|---|
| Staging separado | ❌ |
| CI/CD con build y pruebas | ❌ |
| Despliegue reproducible | ❌ |
| Rollback documentado y probado | ⚠️ Manual |
| Respaldos cifrados | ❌ |
| Retención de respaldos | ❌ |
| Restauración probada | ❌ |
| Restauración con confirmación | ❌ |
| Pruebas bloqueadas en producción | ❌ |
| `config.toml` versionado | ❌ |
| Secretos con permisos correctos | ⚠️ Parcial |
| Rotación de claves | ❌ |
| Monitoreo y alertas | ❌ |
| Runbook de incidentes | ❌ |
| MFA en GitHub/Supabase | No verificado |

---

## 10. Conclusión

La operación de ECOEMS funciona porque **una persona conoce el sistema y lo opera con cuidado**. Eso no es un modelo sostenible ni auditable, y con datos de menores deja de ser aceptable.

Los tres cambios que más reducen el riesgo son concretos y baratos:

1. **Cifrar los respaldos y dejar de volcar `auth.users`** (unas horas).
2. **Crear staging y bloquear `TEST_WRITE` en producción** (un día).
3. **Publicar desde CI con un health check** (un día).

Ninguno requiere reescribir la plataforma. Requieren convertir el conocimiento tácito del operador en un procedimiento que cualquiera pueda seguir y que deje evidencia. Eso es lo que separa un piloto de un sistema en operación.
