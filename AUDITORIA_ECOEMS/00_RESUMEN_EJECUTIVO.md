# 00 · Resumen ejecutivo

**Proyecto:** Plataforma ECOEMS · CursosProfeLuis
**Tipo de trabajo:** Auditoría integral de solo lectura (sin correcciones)
**Fecha de corte:** 15 de noviembre de 2026
**Alcance:** repositorio local `~/Desktop/Curso ECOEMS/Plataforma/`, migraciones, Edge Functions, frontend, scripts operativos, configuración y documentación de Fase 0.
**Producción observada:** `https://monetarytexas42.github.io/CursosProfeLuis/` · proyecto Supabase `ioikcrdxneuydylyhvwi`.
**Autor:** Auditoría técnica asistida por IA (Big Pickle), a solicitud del responsable del proyecto.

> **Declaración de no modificación.** Esta auditoría no modificó archivos existentes, no aplicó migraciones, no escribió en la base de datos, no desplegó, no cambió contraseñas, permisos ni configuración, y no publicó secretos ni datos personales. Todos los entregables viven únicamente en `AUDITORIA_ECOEMS/`.

> **Actualización 21 nov 2026 (addenda).** Las fases 0–3 se implementaron y se
> ejecutaron en un staging real (`hsfhlhrkmhajmpethzqn`), distinto de producción:
> 40/40 migraciones, 10 Edge Functions (9 con `ALLOWED_ORIGIN` y el procesador
> de correo con token), seed ficticio, suite RLS **135/135**,
> `test-functions.mjs` y `test-email-outbox.mjs` en PASS y build de staging
> correcto. La primera ejecución en staging detectó 19 fallos; se corrigieron
> con `0039_staging_rls_fixes.sql` y dos ajustes a la suite. `0040` añadió el
> procesador de `email_outbox` con proveedor `log` (sin envío real) y el recibo
> PDF de `FUN-02`, validado con `test-receipt-pdf.mjs`. El 22 nov se probó una
> restauración cifrada en staging: dato modificado y recuperado, 41 tablas
> comparadas sin diferencias y `restore.log` completo. El CI quedó reforzado y
> el push a `main` se ejecutó con autorización; el primer run falló por IPv6 y
> se corrigió usando el pooler IPv4 de staging para `STAGING_DATABASE_URL`.
> Durante la auditoría, producción solo se verificó en modo lectura. El
> despliegue a Pages sí se ejecutó con autorización y el run final
> `45051723789` terminó en SUCCESS. Ese despliegue dejó ver un desajuste: el
> frontend pedía columnas y vistas que la BD no tenía. El 22 nov 2026, con
> autorización explícita, se hizo un respaldo cifrado de producción y se
> aplicaron las migraciones `0023`–`0040`; la verificación posterior dio
> **40/40 migraciones, 93 políticas, 111 funciones, 0 `SECURITY DEFINER` sin
> `search_path`** y conteos sin cambios. La auditoría original queda como línea
> base; esta addenda documenta la validación posterior.

---

## 1. Veredicto general

La plataforma es **funcional para un piloto controlado**, pero **no está lista para operar con datos reales de menores ni para crecer fuera del aula piloto** sin atender primero un conjunto pequeño de riesgos críticos y altos.

El hallazgo más grave es de **control de acceso**: una política RLS introducida en la migración `0009` permite que **cualquier alumno activo lea todo el contenido publicado**, incluidas las respuestas correctas de ejercicios y quizzes y las unidades que el profesor todavía no ha activado. La interfaz filtra por asignaciones, pero la API no. Esto rompe simultáneamente la integridad académica, el control pedagógico y la promesa comercial del producto.

El segundo bloque de riesgo está en **identidad y offboarding**: el cambio obligatorio de contraseña se puede saltar llamando la RPC directamente, la desactivación de usuarios no revoca sesiones ni banea la cuenta en Auth, y la vinculación de cuentas confirma correos y asocia fichas sin verificar que quien controla el correo sea el titular.

El tercer bloque es **privacidad y operación**: el aviso de privacidad completo no está publicado dentro de la app, el consentimiento del tutor no bloquea el acceso y no hay evidencia del texto aceptado; además, los respaldos locales contienen `auth.users` y datos personales sin cifrar, y el script de restauración trunca tablas sin confirmación.

**Nivel de riesgo global:** **Alto**, con un foco **Crítico** en la exposición de contenido evaluable.

---

## 2. Cifras de la revisión

| Métrica | Valor |
|---|---:|
| Migraciones SQL revisadas | 22 |
| Tablas del esquema `public` | 38 |
| Tablas con RLS habilitado | 38 (100 %) |
| Funciones `SECURITY DEFINER` | 52 |
| Funciones `SECURITY DEFINER` con `set search_path` | 52 (100 %) |
| Edge Functions desplegables | 6 (+ 3 módulos `_shared`) |
| Líneas del frontend principal (`app.js`) | 7,072 |
| Líneas de estilos (`styles.css`) | 4,027 |
| Líneas del reproductor legacy (`curso/js/app.js`) | 2,018 |
| Líneas del motor del curso (`sistema2.js`) | 1,704 |
| Líneas de la puerta de acceso (`login-gate.js`) | 319 |
| Líneas del smoke E2E (`ui-smoke.mjs`) | 855 |
| Hallazgos registrados | 63 |

### Distribución por severidad

| Severidad | Cantidad | % |
|---|---:|---:|
| Crítico | 1 | 1.6 % |
| Alto | 11 | 17.5 % |
| Medio | 25 | 39.7 % |
| Bajo | 26 | 41.3 % |
| **Total** | **63** | **100 %** |

> `DB-08` se cuenta como **Bajo** por su naturaleza de diseño; su efecto práctico se califica **Alto** y se registra como `PRIV-02` para no duplicar el riesgo en la tabla.

### Distribución por categoría

| Categoría | Hallazgos |
|---|---:|
| Seguridad / RLS | 9 |
| Base de datos | 8 |
| Funcionalidad | 11 |
| Código y calidad | 9 |
| UX / accesibilidad | 8 |
| Privacidad | 8 |
| DevOps / respaldos | 10 |

---

## 3. Los cinco riesgos que deben atenderse primero

### 3.1. SEC-01 · Cualquier alumno puede descargar todo el contenido publicado

**Severidad:** Crítico · **Prioridad:** P0 · **Confianza:** Alta

La migración `0009_student_published_content.sql:8-24` agrega dos políticas permisivas:

- `units_select_published_students`: todo alumno activo ve todas las unidades con `status = 'published'`.
- `unit_versions_select_published_students`: todo alumno activo ve todas las versiones con `published_at is not null`.

PostgreSQL combina políticas permisivas con `OR`. Las políticas restrictivas de `0003_rls.sql:625` (`units_select`) y `0003_rls.sql:634` (`unit_versions_select`) quedan anuladas por las nuevas. El reproductor (`frontend/public/curso/js/login-gate.js:248-301`) descarga todo y **filtra en el cliente** por asignaciones activas.

**Consecuencia:** un alumno con sesión y la anon key pública puede llamar directamente a PostgREST y obtener `content` completo, incluidos `correctIndex`, respuestas y explicaciones, de unidades no activadas. No necesita herramientas especiales: basta el navegador o `curl`.

**Recomendación inmediata:** eliminar las dos políticas de `0009` y sustituirlas por políticas que exijan una asignación activa para el alumno (reutilizando `app_has_active_assignment` o una función equivalente por `unit_id`/`version_id`), y mover el filtrado a la base de datos. Mientras se corrige, rotar el contenido evaluable o asumir que está comprometido.

### 3.2. SEC-02 · Vinculación de cuentas sin verificar titularidad

**Severidad:** Alto (escala a Crítico si el autorregistro está abierto) · **Prioridad:** P0 · **Confianza:** Alta en el código; configuración de Auth no verificada

`app_link_student_account` (`0018_link_confirm.sql`, redefinida en `0019_link_username_fix.sql:16`) busca una cuenta existente por correo, **fuerza `email_confirmed_at`** y la vincula a la ficha del alumno. No comprueba que quien registró esa cuenta sea el alumno o su tutor, ni que el correo pertenezca al titular.

Si el proyecto permite autorregistro sin confirmación de correo, un tercero puede crear una cuenta con el correo de un alumno antes de que el profesor lo dé de alta; cuando el profesor vincula, el atacante recibe acceso a la ficha, al progreso y a los datos del menor.

**Recomendación:** deshabilitar autorregistro; no forzar `email_confirmed_at` desde una RPC de aplicación; exigir un token de invitación de un solo uso ligado a la ficha; registrar quién vincula y cuándo; y verificar el estado real de Auth en el dashboard.

**Estado:** mitigado en código (`0026_student_link_tokens.sql`, `issue-student-link-token`, `redeem-student-link-token`); pendiente de verificación en staging.

### 3.3. SEC-03 · El cambio obligatorio de contraseña es evitable

**Severidad:** Alto · **Prioridad:** P0 · **Confianza:** Alta

`must_change_password` solo se evalúa en el frontend (`frontend/src/ui/app.js:775`). La RPC `app_complete_password_change` (`0011_force_password_change.sql:9-30`) únicamente pone la bandera en `false`; no verifica que la contraseña haya cambiado, ni cuándo, ni con qué fortaleza.

Un alumno puede llamar `supabase.rpc('app_complete_password_change')` desde la consola y conservar la contraseña temporal que el profesor conoce. En un piloto con contraseñas compartidas por WhatsApp o en papel, esto equivale a suplantación trivial.

**Recomendación:** mover la verificación al servidor (Edge Function con `service_role` que compare el hash o use `auth.admin.updateUserById`), o eliminar la bandera y usar el flujo nativo de recuperación de Supabase con expiración. Como mínimo, registrar `password_changed_at` y exigir que sea posterior a `must_change_password_since`.

**Estado:** mitigado en código (`0025_password_change_server.sql` y `complete-password-change`); pendiente de verificación en staging.

### 3.4. PRIV-01 · Aviso de privacidad no publicado y consentimiento sin evidencia

**Severidad:** Alto · **Prioridad:** P0 · **Confianza:** Alta

El texto completo del aviso existe solo como borrador en `Fase-0/05-privacidad-y-consentimiento.md`. En la app:

- El botón "Aceptar aviso de privacidad" (`app.js:3958`) no enlaza al documento; solo muestra el número de versión (`app.js:3963`).
- El panel del tutor se renderiza completo aunque no haya consentimiento; el botón es una acción posterior, no una puerta (`app.js:3937-3970`).
- La Edge Function `guardian-consent` registra `accepted: true` con versión, IP y user-agent, pero no guarda el texto mostrado ni una prueba de que el tutor lo leyó.
- No hay mecanismo de revocación visible ni flujo ARCO dentro de la app.

**Recomendación:** publicar el aviso como página estática enlazada desde el login y desde el panel; bloquear el acceso a datos del alumno hasta el consentimiento; versionar el texto y guardar hash del documento; ofrecer revocación y canal ARCO; validar legalmente antes del piloto real.

**Estado:** mitigado en código (`frontend/public/privacidad.html`, `0027_privacy_notice.sql`, `guardian-consent` y panel del tutor); pendiente de verificación en staging y de revisión legal. El aviso se publica como borrador `v2-2026` con placeholders institucionales.

### 3.5. OPS-01 / OPS-02 / OPS-03 · Operación sobre producción sin red de seguridad

**Severidad:** Alto · **Prioridad:** P1 · **Confianza:** Alta

- `scripts/backup-db.mjs:25-51` vuelca **todas** las tablas, incluido `auth.users`, a un JSON **sin cifrar** en `.backups/`. El archivo observado (857 KB) contiene identidades y PII.
- `scripts/restore-db.mjs:39-47` hace `truncate table ... cascade` por tabla, con `session_replication_role = replica`, **sin confirmación interactiva ni respaldo previo**.
- `scripts/ui-smoke.mjs:476,554-580,672,746-770` escribe en la base configurada cuando `TEST_WRITE=1`; no verifica que el entorno sea staging. Como no existe staging, la ruta natural es ejecutarlo contra producción.
- El despliegue es manual (`app/README.md:30-35`): `npm run build`, `git init` dentro de `dist`, `git push -f` a `gh-pages`, sin CI, sin revisión y sin rollback.

**Recomendación:** cifrar respaldos (age/GPG) y restringir permisos; exigir confirmación explícita y backup previo en restore; bloquear `TEST_WRITE` salvo que `APP_ENV=staging` y la URL no sea la de producción; crear staging real; automatizar build y despliegue con GitHub Actions y un check de salud.

---

## 4. Lo que está bien y debe conservarse

La auditoría también encontró controles sólidos que conviene no romper al corregir:

1. **RLS en las 38 tablas.** No hay tablas del esquema `public` sin RLS.
2. **52 funciones `SECURITY DEFINER` con `set search_path = public, pg_temp`.** No se encontró el patrón clásico de secuestro de `search_path`.
3. **Evaluación de respuestas en el servidor.** `app_record_exercise_attempt` y `app_submit_quiz_answer` leen `correctIndex`/`answer` desde `unit_versions` y calculan `is_correct` en PostgreSQL; el cliente no decide si acertó.
4. **Progreso y intentos ligados a asignaciones activas.** `app_has_active_assignment` valida visibilidad, estado, ventana de fechas, override y publicación antes de escribir.
5. **Separación de roles en RLS.** Admin, profesor del grupo, alumno propio y tutor tienen funciones de autorización explícitas y acotadas.
6. **Pagos de solo lectura para tutores y sin acceso para alumnos.** La migración `0021_billing_guard` endurece la lectura; el alumno no ve finanzas.
7. **Sin `service_role` en el bundle.** Se revisó `dist/assets/*.js`: 0 ocurrencias. Solo viaja la anon key pública.
8. **Secretos fuera de Git.** `.secrets/` y `.backups/` están en `.gitignore`; el historial no contiene esos archivos.
9. **Escapado HTML centralizado.** `escapeHtml` (`app.js:386-393`) se usa en la mayoría de las interpolaciones; `textBlock` escapa y convierte saltos de línea.
10. **Documentación de Fase 0.** Hay especificación, ERD, matriz RLS, criterios de aceptación y borrador de privacidad; es una base valiosa para el plan de remediación.

---

## 5. Qué no se pudo verificar

Estas limitaciones son parte del resultado, no un defecto del informe:

| Tema | Motivo | Cómo verificarlo |
|---|---|---|
| Migraciones realmente aplicadas en producción | No se autorizó conexión de solo lectura ni acceso al dashboard | Ver §12 y la consulta a `supabase_migrations.schema_migrations` en `04_BASE_DE_DATOS.md` |
| Configuración de Supabase Auth (sign-ups, confirmación, expiración, rate limits) | No hay `supabase/config.toml` ni acceso al panel | Revisar Authentication → Providers/Email y `auth.config` |
| Existencia y contenido de `settings.privacy_document_version` | Requiere lectura de datos | `select key, value from public.settings where key = 'privacy_document_version';` |
| Estado de los respaldos automáticos de Supabase | Depende del plan y del dashboard | Revisar Database → Backups y probar una restauración en staging |
| Rotación y alcance de la anon key | No se puede saber desde el repo | Revisar API Keys y logs de uso |
| Validez legal del aviso de privacidad | Requiere abogado | Revisión legal externa antes del piloto con menores |
| Contenido real de la base (datos de prueba, duplicados, inconsistencias) | No se leyó producción | Ejecutar las consultas de `04_BASE_DE_DATOS.md` en una réplica o staging |

---

## 6. Decisión recomendada

**No iniciar correcciones todavía.** Este paquete es el insumo para decidir. La secuencia sugerida es:

1. **Aprobar el alcance y la severidad** de los 63 hallazgos (o ajustar la calificación).
2. **Autorizar un entorno aislado** (staging o réplica) para validar los hallazgos de base de datos y ejecutar las pruebas pendientes.
3. **Aprobar el plan de remediación por fases** de `11_PLAN_DE_REMEDIACION.md`, empezando por P0.
4. **Ejecutar P0 en una rama** con revisión y pruebas negativas de RLS antes de tocar producción.
5. **Repetir la auditoría** sobre la rama corregida antes de declarar el piloto listo para datos reales.

---

## 7. Mapa de informes

| Archivo | Contenido |
|---|---|
| `00_RESUMEN_EJECUTIVO.md` | Este documento |
| `01_ALCANCE_Y_METODOLOGIA.md` | Objetivo, alcance, límites, escala de severidad y método |
| `02_ARQUITECTURA_Y_RECONOCIMIENTO.md` | Stack, estructura, entry points, flujos y mapa de dependencias |
| `03_SEGURIDAD_Y_RLS.md` | Modelo de auth, helpers, matriz RLS y hallazgos SEC |
| `04_BASE_DE_DATOS.md` | Inventario, claves, FKs, índices, migraciones y hallazgos DB |
| `05_FUNCIONALIDAD_Y_FLUJOS.md` | Flujos por rol y hallazgos FUN |
| `06_CODIGO_Y_CALIDAD.md` | Métricas, patrones, deuda y hallazgos COD |
| `07_UX_ACCESIBILIDAD.md` | Heurísticas, accesibilidad, responsive y hallazgos UX |
| `08_PRIVACIDAD_Y_DATOS_PERSONALES.md` | Datos, finalidades, consentimiento, ARCO y hallazgos PRIV |
| `09_DEVOPS_DESPLIEGUE_Y_RESPALDOS.md` | Ambientes, CI/CD, respaldos, secretos y hallazgos OPS |
| `10_HALLAZGOS_PRIORIZADOS.md` | Tabla consolidada, matriz de riesgo y top 10 |
| `11_PLAN_DE_REMEDIACION.md` | Fases, criterios de aceptación y verificación |
| `12_PRUEBAS_PENDIENTES.md` | Pruebas reproducibles en entorno aislado |
| `AUDITORIA_ECOEMS.html` | Índice navegable y resumen visual |

---

## 8. Conclusión en una frase

**La arquitectura tiene buenos cimientos de seguridad (RLS completa, evaluación en servidor, roles separados), pero una sola política permisiva en `0009` anula el control de acceso al contenido y convierte un piloto pedagógicamente sólido en un sistema donde cualquier alumno puede leer todas las respuestas; corregir eso, cerrar la identidad y publicar el aviso de privacidad son las tres condiciones para pasar de piloto a operación real.**
