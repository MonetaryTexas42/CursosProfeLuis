# 01 · Alcance y metodología

## 1. Objetivo

Evaluar, en modo **solo lectura**, la seguridad, la base de datos, la funcionalidad, la calidad del código, la experiencia de usuario, la privacidad y la operación de la **Plataforma ECOEMS** (repositorio `CursosProfeLuis`), y entregar un paquete de informes priorizados que permita decidir qué corregir antes de operar con datos reales de alumnos y tutores.

La auditoría **no** corrige, **no** migra, **no** despliega y **no** modifica datos. Su producto son documentos y evidencia reproducible.

---

## 2. Alcance incluido

### 2.1. Código y configuración

| Ruta | Qué se revisó |
|---|---|
| `app/frontend/src/ui/app.js` | SPA completa: autenticación, dashboards por rol, unidades, quizzes, tests, ficha, pagos, activación, consentimiento |
| `app/frontend/src/styles.css` | Temas, responsive, accesibilidad visual |
| `app/frontend/src/lib/supabase.js` | Cliente Supabase, dominio de correo sintético, variables de entorno |
| `app/frontend/public/curso/js/login-gate.js` | Puerta de acceso y descarga de contenido |
| `app/frontend/public/curso/js/app.js` | Reproductor legacy y gestión en `localStorage` |
| `app/frontend/public/curso/js/sistema2.js` | Motor de navegación y renderizado del curso |
| `app/frontend/public/tool-gate.js` | Puerta de acceso de herramientas embebidas |
| `app/frontend/index.html`, `public/*.html` | Shell y herramientas |
| `app/supabase/migrations/*.sql` | 22 migraciones: esquema, RLS, RPCs, parches |
| `app/supabase/functions/**` | 6 Edge Functions y módulos compartidos |
| `app/supabase/tests/*.sql` | Pruebas SQL existentes |
| `app/scripts/*.mjs` | Smoke E2E, respaldo, restauración, seed, pruebas de funciones |
| `app/README.md`, `app/frontend/README.md`, `app/supabase/README.md` | Estado, comandos, despliegue |
| `Fase-0/*.md` | Especificación, ERD, RLS, auth, privacidad, criterios, ambientes |

### 2.2. Artefactos observados

- Bundle compilado en `app/frontend/dist/` (incluye un repositorio Git anidado en rama `gh-pages`).
- Respaldo local `.backups/backup-2026-10-31-22-59-01.json` (857 KB), inspeccionado **solo para confirmar estructura y presencia de PII**, sin extraer ni publicar datos.
- Directorio `.secrets/` (metadatos y nombres de archivo; no se copiaron credenciales).
- Historial Git del repositorio principal y del repo anidado `dist`.

---

## 3. Alcance excluido

Quedan fuera de esta auditoría:

1. **Conexión a producción** (PostgreSQL, PostgREST, Auth Admin) para leer o escribir datos.
2. **Ejecución de migraciones** o cambios de esquema.
3. **Pruebas que escriban datos reales**, incluidas las que usan `TEST_WRITE=1`.
4. **Cambios de contraseñas, permisos, políticas o configuración** de Supabase.
5. **Despliegue** o publicación de artefactos.
6. **Pruebas de penetración activas** contra el sitio en producción.
7. **Revisión legal formal** del aviso de privacidad y de los contratos con terceros.
8. **Auditoría de infraestructura** de GitHub Pages o de la red de Supabase más allá de lo observable en el repositorio.
9. **Análisis de accesibilidad con usuarios reales** o herramientas especializadas (solo revisión heurística y de código).

---

## 4. Restricciones y reglas de manejo

| Regla | Cumplimiento |
|---|---|
| No modificar archivos existentes | Solo se crearon archivos nuevos en `AUDITORIA_ECOEMS/` |
| No escribir en base de datos | No se abrió conexión; no se ejecutó SQL |
| No publicar secretos | No se copiaron claves, contraseñas ni cadenas de conexión; se referencian por ruta |
| No publicar PII | No se transcribieron nombres, correos ni identificadores reales; se usan marcadores |
| No desplegar | No se ejecutó `npm run build` ni `git push` |
| No cambiar contraseñas/permisos | No se llamó Auth Admin ni RPC de escritura |
| Evidencia verificable | Cada hallazgo cita archivo y línea; las consultas de verificación están en los informes |

### 4.1. Tratamiento de datos sensibles

- Los correos y nombres reales se sustituyen por marcadores (`<correo-admin>`, `<alumno-piloto>`, `<tutor-piloto>`).
- La anon key se menciona como “clave pública” sin reproducir su valor.
- El respaldo se describe por tamaño, fecha y esquema de tablas, no por contenido.
- Las contraseñas de prueba no se transcriben; solo se indica el archivo que las contiene.

---

## 5. Método

La auditoría siguió una secuencia de seis etapas, con evidencia acumulativa:

### Etapa 1 · Reconocimiento

- Inventario de carpetas, archivos, entry points y dependencias.
- Lectura de `README`, `package.json`, `.env.example`, configuración de Vite y scripts.
- Identificación de roles, flujos y servicios externos.
- Resultado: `02_ARQUITECTURA_Y_RECONOCIMIENTO.md`.

### Etapa 2 · Seguridad y base de datos

- Lectura completa de las 22 migraciones.
- Extracción de tablas, políticas, funciones `SECURITY DEFINER`, `GRANT`/`REVOKE`, triggers e índices.
- Revisión de Edge Functions y de los módulos `_shared`.
- Revisión de secretos, `.gitignore`, historial Git y bundle.
- Resultado: `03_SEGURIDAD_Y_RLS.md` y `04_BASE_DE_DATOS.md`.

### Etapa 3 · Funcionalidad y flujos

- Recorrido estático de los flujos por rol: alumno, profesor, admin, tutor.
- Revisión de altas, activación de unidades, estudio, quizzes, reintentos, tests, ficha, pagos y consentimiento.
- Identificación de casos límite y de funciones disponibles en la API pero no en la UI.
- Resultado: `05_FUNCIONALIDAD_Y_FLUJOS.md`.

### Etapa 4 · Código y calidad

- Métricas de tamaño y estructura.
- Patrones de manejo de errores, escapado, estado, duplicación y deuda técnica.
- Revisión de pruebas existentes y de su cobertura.
- Resultado: `06_CODIGO_Y_CALIDAD.md`.

### Etapa 5 · UX, privacidad y DevOps

- Revisión heurística de accesibilidad, responsive, feedback y consistencia.
- Inventario de datos personales, finalidades, consentimiento, retención y derechos.
- Revisión de ambientes, CI/CD, respaldos, restauración, secretos y monitoreo.
- Resultado: `07_UX_ACCESIBILIDAD.md`, `08_PRIVACIDAD_Y_DATOS_PERSONALES.md` y `09_DEVOPS_DESPLIEGUE_Y_RESPALDOS.md`.

### Etapa 6 · Consolidación

- Normalización de IDs, severidades y prioridades.
- Eliminación de duplicados y relación entre hallazgos.
- Plan de remediación por fases y pruebas pendientes.
- Resultado: `10_HALLAZGOS_PRIORIZADOS.md`, `11_PLAN_DE_REMEDIACION.md`, `12_PRUEBAS_PENDIENTES.md` y `AUDITORIA_ECOEMS.html`.

---

## 6. Escala de severidad

| Severidad | Criterio | Ejemplo |
|---|---|---|
| **Crítico** | Explotable con la anon key pública o con una cuenta de bajo privilegio; impacto directo en integridad, confidencialidad o seguridad de menores; requiere acción antes de cualquier uso real | Alumno descarga todas las respuestas correctas |
| **Alto** | Debilita un control importante, permite abuso real o incumple una obligación legal; debe corregirse antes del piloto con datos reales | Cambio de contraseña evitable; aviso de privacidad no publicado |
| **Medio** | Afecta la calidad, la operación o la defensa en profundidad; puede esperar a la siguiente iteración, pero debe planearse | Falta de paginación; CORS `*`; sin pruebas negativas de RLS |
| **Bajo** | Mejora recomendable, deuda técnica o riesgo acotado; no bloquea el piloto | Duplicación de la anon key; monolito de 7,000 líneas |

### 6.1. Prioridad

| Prioridad | Horizonte | Criterio |
|---|---|---|
| **P0** | 0–72 h | Crítico o alto explotable; bloquea el uso con datos reales |
| **P1** | 1–2 semanas | Alto; obligatorio antes del piloto formal |
| **P2** | 30 días | Medio; siguiente iteración |
| **P3** | 90 días | Bajo; mejora continua |

### 6.2. Confianza

| Nivel | Significado |
|---|---|
| **Alta** | Verificado directamente en código, migraciones o artefactos |
| **Media** | Inferido de código y configuración, pero depende de un estado no observable (p. ej. Auth) |
| **Baja** | Requiere validación en entorno real; se documenta como hipótesis |

### 6.3. Estado

Todos los hallazgos se registran como **Abierto**. No se marca ninguno como “corregido” porque esta auditoría no aplicó cambios. Cuando exista un plan aprobado, el estado podrá pasar a “En remediación”, “Verificado” o “Aceptado con riesgo”.

---

## 7. Formato de hallazgo

Cada hallazgo sigue esta estructura:

```
### <ID> · <Título>
- Severidad: Crítico / Alto / Medio / Bajo
- Categoría: ...
- Ubicación: archivo:línea
- Evidencia: fragmento o descripción verificable
- Problema: qué está mal y por qué
- Escenario: cómo se manifestaría
- Impacto: consecuencia concreta
- Recomendación: cambio propuesto (sin ejecutarlo)
- Prioridad: P0 / P1 / P2 / P3
- Confianza: Alta / Media / Baja
- Estado: Abierto
```

Los IDs son estables y se usan en todos los informes:

- `SEC-xx` seguridad y RLS
- `DB-xx` base de datos
- `FUN-xx` funcionalidad
- `COD-xx` código y calidad
- `UX-xx` experiencia y accesibilidad
- `PRIV-xx` privacidad
- `OPS-xx` DevOps, despliegue y respaldos

---

## 8. Fuentes y evidencia

### 8.1. Fuentes primarias

- Código y migraciones del repositorio local.
- Bundle compilado en `dist/`.
- Historial Git (`git log`, `git ls-files`, búsqueda de secretos).
- Documentación de Fase 0.
- Estructura del respaldo local (sin contenido).
- Metadatos de `.secrets/` (nombres y tamaños, sin valores).

### 8.2. Fuentes secundarias

- Comportamiento documentado de PostgreSQL sobre políticas permisivas (combinación con `OR`).
- Comportamiento documentado de Supabase Auth y PostgREST.
- Buenas prácticas de OWASP ASVS, OWASP Top 10 y LFPDPPP (referencia conceptual, no dictamen legal).

### 8.3. Lo que no es evidencia

- Suposiciones sobre el estado de producción no confirmadas.
- Comentarios del código que describen intenciones (“solo alumnos activos…”) cuando la política hace otra cosa.
- Mensajes de la UI que prometen controles que la API no aplica.

Cuando el comentario y el código discrepan, prevalece el código y se documenta la discrepancia.

---

## 9. Limitaciones metodológicas

1. **Auditoría estática.** No se ejecutó la app ni se interactuó con producción. Los hallazgos de comportamiento se basan en lectura de código y en el comportamiento documentado de PostgreSQL/Supabase.
2. **Sin réplica de datos.** No se pudieron confirmar duplicados, inconsistencias ni datos de prueba en producción.
3. **Sin configuración de Auth.** El estado de sign-ups, confirmación de correo, expiración de sesión y rate limits es desconocido; los hallazgos que dependen de ello se marcan con confianza Media.
4. **Sin revisión legal.** El análisis de privacidad es técnico y operativo; no sustituye un dictamen.
5. **Sin pruebas de carga.** No se evaluó rendimiento bajo concurrencia ni límites de Supabase.
6. **Sin acceso a logs.** No se revisaron logs de Auth, PostgREST, Edge Functions ni auditoría de Supabase.

---

## 10. Criterios de aceptación de la auditoría

Se considera que esta auditoría cumplió si:

- [x] Se revisaron las 22 migraciones y las 38 tablas.
- [x] Se revisaron las 6 Edge Functions y los módulos compartidos.
- [x] Se revisó el frontend principal, el reproductor y los scripts operativos.
- [x] Cada hallazgo tiene ID, severidad, ubicación, evidencia, impacto, recomendación, prioridad, confianza y estado.
- [x] Se documentaron las pruebas pendientes y cómo ejecutarlas en entorno aislado.
- [x] No se modificó ningún archivo existente.
- [x] No se escribió en base de datos ni se desplegó.
- [x] No se publicaron secretos ni PII.
- [x] Se entregaron los 13 informes y el índice HTML.

---

## 11. Glosario mínimo

| Término | Definición |
|---|---|
| **RLS** | Row Level Security de PostgreSQL; filtra filas por política y rol |
| **Política permisiva** | Política que concede acceso; varias se combinan con `OR` |
| **Política restrictiva** | Política que limita; se combina con `AND` sobre las permisivas |
| **`SECURITY DEFINER`** | Función que se ejecuta con los privilegios de su dueño |
| **`search_path`** | Orden de esquemas para resolver nombres; debe fijarse en funciones definer |
| **Anon key** | Clave pública de Supabase; identifica el proyecto, no otorga privilegios por sí sola |
| **Service role** | Clave secreta que omite RLS; nunca debe llegar al cliente |
| **PostgREST** | API REST autogenerada por Supabase sobre PostgreSQL |
| **Edge Function** | Función Deno desplegada en Supabase, con acceso a `service_role` |
| **Magic link** | Enlace de un solo uso para iniciar sesión sin contraseña |
| **ARCO** | Derechos de Acceso, Rectificación, Cancelación y Oposición (LFPDPPP) |
| **PII** | Información personal identificable |
| **Staging** | Entorno de pruebas aislado, con datos ficticios |
| **Smoke test** | Prueba rápida de humo que recorre los flujos principales |
