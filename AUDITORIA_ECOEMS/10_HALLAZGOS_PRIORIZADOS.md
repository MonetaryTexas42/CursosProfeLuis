# 10 · Hallazgos priorizados

## 1. Propósito

Este documento consolida los **63 hallazgos** de los informes 03–09 en una sola tabla, los ordena por riesgo y define el **top 10** que debe atenderse antes de operar con datos reales. No introduce hallazgos nuevos ni cambia severidades: cada fila remite al informe donde está la evidencia completa.

---

## 2. Distribución

### 2.1. Por severidad

| Severidad | Cantidad | % |
|---|---:|---:|
| Crítico | 1 | 1.6 % |
| Alto | 11 | 17.5 % |
| Medio | 25 | 39.7 % |
| Bajo | 26 | 41.3 % |
| **Total** | **63** | **100 %** |

### 2.2. Por prioridad

| Prioridad | Horizonte | Cantidad |
|---|---|---:|
| P0 | 0–72 h | 6 |
| P1 | 1–2 semanas | 12 |
| P2 | 30 días | 22 |
| P3 | 90 días | 23 |
| **Total** | | **63** |

### 2.3. Por categoría y severidad

| Categoría | Crítico | Alto | Medio | Bajo | Total |
|---|---:|---:|---:|---:|---:|
| Seguridad (SEC) | 1 | 3 | 3 | 2 | 9 |
| Base de datos (DB) | — | — | 5 | 3 | 8 |
| Funcionalidad (FUN) | — | 2 | 6 | 3 | 11 |
| Código (COD) | — | — | 3 | 6 | 9 |
| UX (UX) | — | — | 2 | 6 | 8 |
| Privacidad (PRIV) | — | 2 | 3 | 3 | 8 |
| DevOps (OPS) | — | 4 | 3 | 3 | 10 |
| **Total** | **1** | **11** | **25** | **26** | **63** |

---

## 3. Tabla consolidada

> **Leyenda:** S = severidad (C = Crítico, A = Alto, M = Medio, B = Bajo) · P = prioridad · Conf. = confianza (A/M/B).

### 3.1. Seguridad

| ID | S | P | Conf. | Hallazgo | Ubicación | Informe |
|---|---|---|---|---|---|---|
| SEC-01 | **C** | P0 | A | RLS permite leer todo el contenido publicado | `0009:8-24` | 03 |
| SEC-02 | A | P0 | A/M | Vinculación sin titularidad y confirmación forzada de correo | `0019:116-120` | 03 |
| SEC-03 | A | P0 | A | El cambio obligatorio de contraseña se puede saltar | `0011:9-30` | 03 |
| SEC-04 | A | P1 | A | Desactivar no revoca sesiones ni banea en Auth | `deactivate-user/index.ts:43-46` | 03 |
| SEC-05 | M | P2 | A | CORS permisivo por defecto (`*`) | `_shared/http.ts:1-6` | 03 |
| SEC-06 | M | P2 | A | Magic link de tutor por WhatsApp, reenviable | `invite-guardian/index.ts:115-134` | 03 |
| SEC-07 | M | P2 | A | Baneo sin auditoría ni revocación de sesiones | `0017:169-205` | 03 |
| SEC-08 | B | P3 | A | Anon key duplicada en dos puertas | `login-gate.js:15-17`; `tool-gate.js:7-9` | 03 |
| SEC-09 | B | P3 | M | Sin rate limiting propio en Edge Functions | `supabase/functions/**` | 03 |

### 3.2. Base de datos

| ID | S | P | Conf. | Hallazgo | Ubicación | Informe |
|---|---|---|---|---|---|---|
| DB-01 | M | P2 | A | `unit_assignments` permite duplicados por grupo y unidad | `0001:194-211` | 04 |
| DB-02 | M | P2 | A | FKs sin `on delete` impiden borrar alumnos y perfiles | `0001` (múltiples) | 04 |
| DB-03 | M | P2 | A | `app_sync_player_state` acepta XP del cliente | `0010:12-75` | 04 |
| DB-04 | M | P2 | A | `app_complete_unit` permite completar sin actividades | `0004:398-465` | 04 |
| DB-05 | B | P3 | A | Migraciones sin rollback y no idempotentes | `0003:625`; `0009:8` | 04 |
| DB-06 | B | P3 | A | Sin retención para `audit_log` y `email_outbox` | `0001:508-519` | 04 |
| DB-07 | M | P1 | C | Estado real de migraciones verificado: 40/40 en staging y 40/40 en producción tras la autorización del 22 nov (antes 22/38) | `supabase/.temp/`; `scripts/verify-migrations.mjs` | 04 |
| DB-08 | B | P1 | A | `notes_internal` en tabla visible a la familia | `0001:111`; `0003:560` | 04 |

### 3.3. Funcionalidad

| ID | S | P | Conf. | Hallazgo | Ubicación | Informe |
|---|---|---|---|---|---|---|
| FUN-01 | A | P1 | A | El tutor no ve calificaciones, asistencia ni observaciones | `app.js:1296-1400`; `3937-3970` | 05 |
| FUN-02 | A | P1 | A | Pagos sin saldo, periodo, duplicados ni anulación | `0020`; `app.js:2593-2700` | 05 |
| FUN-03 | M | P2 | A | La activación parcial se hereda a alumnos nuevos | `app.js:4880-4925` | 05 |
| FUN-04 | M | P2 | A | Reintentos de quiz ilimitados | `0022` | 05 |
| FUN-05 | M | P2 | A | “Completar unidad” no valida ni advierte | `app.js:4610-4635` | 05 |
| FUN-06 | M | P2 | A | Sin recuperación de contraseña para alumnos | `app.js:572` | 05 |
| FUN-07 | B | P3 | A | Login atado a un dominio sintético fijo | `supabase.js:5,19-26` | 05 |
| FUN-08 | B | P3 | A | Dashboard admin carga todo en el navegador | `app.js:813-860` | 05 |
| FUN-09 | M | P2 | A | Listados truncados por `.limit()` sin paginación | `app.js:855,1067,1337,6044` | 05 |
| FUN-10 | M | P2 | A | Sin auditoría visible de cambios | `app.js:813-860` | 05 |
| FUN-11 | B | P3 | A | El modo de login no persiste | `app.js:7036` | 05 |

### 3.4. Código

| ID | S | P | Conf. | Hallazgo | Ubicación | Informe |
|---|---|---|---|---|---|---|
| COD-01 | M | P2 | A | Reproductor legacy con `localStorage` y rutas muertas | `curso/js/app.js:5,62-104` | 06 |
| COD-02 | M | P2 | A | Autorización duplicada; el cliente es la única barrera | `login-gate.js:248-301` | 06 |
| COD-03 | B | P3 | M | Interpolaciones sin escape y `catch` silenciosos | `app.js:6344,6677` | 06 |
| COD-04 | B | P3 | A | Sin lint, tests unitarios ni tipos | `frontend/package.json` | 06 |
| COD-05 | B | P3 | A | Monolito de 7,072 líneas | `frontend/src/ui/app.js` | 06 |
| COD-06 | B | P3 | A | `catch` vacíos que ocultan fallos | `app.js:399,4566,…` | 06 |
| COD-07 | M | P1 | A | Sin pruebas negativas de RLS | `supabase/tests/*.sql` | 06 |
| COD-08 | B | P3 | A | Sin lockfile versionado ni auditoría de dependencias | `frontend/package.json` | 06 |
| COD-09 | B | P3 | A | `dist` anidado sin build reproducible | `frontend/dist/.git` | 06 |

### 3.5. UX y accesibilidad

| ID | S | P | Conf. | Hallazgo | Ubicación | Informe |
|---|---|---|---|---|---|---|
| UX-01 | M | P2 | A | Accesibilidad limitada: foco, contraste y semántica | `styles.css:422-425` | 07 |
| UX-02 | M | P2 | A | Diálogos sin focus trap ni Escape consistente | `app.js:2731,3601,4703,5401` | 07 |
| UX-03 | B | P3 | A | Errores genéricos sin pasos siguientes | `app.js` (múltiples) | 07 |
| UX-04 | B | P3 | A | Estados de carga inconsistentes | `app.js` | 07 |
| UX-05 | B | P3 | M | Tablas y grids se comprimen en móvil | `styles.css`; `app.js` | 07 |
| UX-06 | B | P3 | A | Falta indicador “solo lectura” consistente | `app.js:3942` | 07 |
| UX-07 | B | P3 | A | Acciones destructivas sin confirmación | `app.js:4960-4995` | 07 |
| UX-08 | B | P3 | A | Sin ayuda contextual sobre intentos y completado | `app.js` | 07 |

### 3.6. Privacidad

| ID | S | P | Conf. | Hallazgo | Ubicación | Informe |
|---|---|---|---|---|---|---|
| PRIV-01 | A | P0 | A | Aviso no publicado, consentimiento sin evidencia ni bloqueo | `app.js:37,3958,6997` | 08 |
| PRIV-02 | A | P0 | A | `notes_internal` se entrega al alumno y al tutor | `0001:111`; `0003:560` | 08 |
| PRIV-03 | M | P1 | A | Perfil psicopedagógico visible al tutor sin finalidad | `0001:386-396`; `0003:774` | 08 |
| PRIV-04 | M | P2 | A | PII en `localStorage` sin limpieza | `curso/js/app.js:62-104` | 08 |
| PRIV-05 | M | P1 | A | Respaldos con `auth.users` y PII sin cifrar | `backup-db.mjs:20-51` | 08 |
| PRIV-06 | B | P2 | A | Sin canal ni procedimiento ARCO | `Fase-0/05` | 08 |
| PRIV-07 | B | P3 | A | `audit_log` con PII sin retención | `0001:508-519` | 08 |
| PRIV-08 | B | P3 | A | Magic link por WhatsApp con nombre del alumno | `invite-guardian:128-134` | 08 |

### 3.7. DevOps

| ID | S | P | Conf. | Hallazgo | Ubicación | Informe |
|---|---|---|---|---|---|---|
| OPS-01 | A | P1 | A | Respaldos sin cifrar con `auth.users` y PII | `backup-db.mjs:20-51` | 09 |
| OPS-02 | A | P1 | A | Restauración trunca tablas sin confirmación | `restore-db.mjs:39-49` | 09 |
| OPS-03 | A | P0 | A | Pruebas E2E escriben en la base configurada | `ui-smoke.mjs:476,554-580` | 09 |
| OPS-04 | A | P1 | A | Despliegue manual con `push -f`, sin CI ni rollback | `README.md:28-36` | 09 |
| OPS-05 | M | P1 | A | Configuración de Supabase no versionada | sin `config.toml` | 09 |
| OPS-06 | M | P2 | A | Secretos sin rotación, residuos y permisos | `.secrets/` | 09 |
| OPS-07 | M | P2 | A | Sin monitoreo, alertas ni respaldos automáticos | todo el proyecto | 09 |
| OPS-08 | B | P3 | A | Sin rotación de claves ni plan de incidentes | `.secrets/` | 09 |
| OPS-09 | B | P2 | A | Sin staging real | `.env`; `.secrets/` | 09 |
| OPS-10 | B | P3 | A | `dist` deriva de `src` | `frontend/dist/.git` | 09 |

---

## 4. Matriz de riesgo

Probabilidad × impacto, considerando la exposición actual (piloto con datos reales).

| Impacto ↓ / Probabilidad → | Baja | Media | Alta |
|---|---|---|---|
| **Crítico** | — | SEC-02 | **SEC-01** |
| **Alto** | — | SEC-04, PRIV-01, PRIV-02, OPS-01, OPS-02, OPS-04 | SEC-03, OPS-03 |
| **Medio** | SEC-05, SEC-07, OPS-05 | FUN-01, FUN-02, DB-02, DB-03, DB-07, PRIV-03, PRIV-05, OPS-06, OPS-07 | DB-01, DB-04, FUN-03, FUN-04, FUN-05, FUN-09, FUN-10, COD-02, COD-07, UX-01, UX-02 |
| **Bajo** | SEC-08, SEC-09, DB-05, DB-06, COD-03, COD-04, COD-08, UX-03, UX-06, PRIV-08, OPS-08, OPS-10 | SEC-06, DB-08, FUN-06, FUN-07, FUN-08, FUN-11, COD-01, COD-05, COD-06, COD-09, UX-04, UX-05, UX-07, UX-08, PRIV-04, PRIV-06, PRIV-07, OPS-09 | — |

### 4.1. Lectura de la matriz

- **Una sola celda crítica-alta:** `SEC-01`. Es el único hallazgo que combina alta probabilidad con impacto crítico.
- **La franja alta-media** (SEC-02, SEC-04, PRIV-01, PRIV-02, OPS-01, OPS-02, OPS-04) es la que exige decisión antes del piloto formal.
- **La franja media-alta** es grande y explica por qué la plataforma “funciona pero no está lista”: muchas cosas menores se acumulan.
- **La franja baja** es deuda planificable; no bloquea, pero conviene agruparla en una iteración de “pulido” después de P0/P1.

---

## 5. Top 10

Ordenado por riesgo real, no por severidad nominal.

| # | ID | Por qué está aquí | Acción mínima |
|---|---|---|---|
| 1 | **SEC-01** | Cualquier alumno descarga todas las respuestas; anula la evaluación y el control pedagógico | `drop policy` de las dos políticas de `0009` |
| 2 | **PRIV-02** | Notas internas del profesor visibles al menor y su familia | Mover `notes_internal` a tabla privada o vista |
| 3 | **SEC-03** | La contraseña temporal se conserva; el profesor puede entrar como el alumno | Verificar el cambio en servidor o usar recuperación nativa |
| 4 | **SEC-02** | Apropiación de ficha si el autorregistro está abierto | Cerrar autorregistro, no forzar `email_confirmed_at`, token de vinculación |
| 5 | **PRIV-01** | Consentimiento sin información, sin evidencia y sin bloqueo | Publicar aviso, enlazarlo, guardar hash, bloquear acceso |
| 6 | **OPS-03** | Las pruebas escriben en producción; no hay staging | Crear staging y bloquear `TEST_WRITE` contra producción |
| 7 | **OPS-01** | El respaldo expone el expediente completo de menores | Cifrar, excluir `auth.users`, permisos 600, retención |
| 8 | **OPS-02** | Un error de dedo puede truncar producción | Confirmación, verificación de entorno, respaldo previo |
| 9 | **SEC-04** | Usuario desactivado sigue autenticándose | Banear en Auth e invalidar sesiones |
| 10 | **FUN-01** | El tutor no ve lo que la ley y el producto prometen | Añadir pestañas de solo lectura con RLS existente |

**Siguientes en la lista:** `FUN-02` (pagos sin trazabilidad), `PRIV-05` (respaldos con PII), `DB-08` (diseño de `notes_internal`), `COD-07` (sin pruebas negativas de RLS), `OPS-04` (despliegue manual).

---

## 6. Relaciones entre hallazgos

Algunos hallazgos comparten causa o se agravan entre sí. Corregirlos juntos evita parches contradictorios.

### 6.1. Cadena del contenido expuesto

```
SEC-01 (RLS permisiva)
  └── COD-02 (cliente filtra)
        └── DB-03 (XP del cliente)
        └── DB-04 / FUN-05 (completar sin validar)
              └── FUN-04 (reintentos ilimitados)
```

**Corrección conjunta:** cerrar RLS, mover el filtrado al servidor y endurecer las reglas de progreso. Hacerlo por partes deja huecos.

### 6.2. Cadena de identidad

```
SEC-02 (vinculación sin titularidad)
  └── SEC-03 (contraseña temporal)
        └── SEC-04 (desactivar no banea)
              └── SEC-07 (baneo sin auditoría)
                    └── SEC-06 / PRIV-08 (magic link por WhatsApp)
```

**Corrección conjunta:** un solo flujo de identidad con invitación, verificación, cambio obligatorio y offboarding. Requiere configurar Auth (`OPS-05`).

### 6.3. Cadena de privacidad

```
PRIV-01 (sin aviso ni bloqueo)
  └── PRIV-02 / DB-08 (notas internas)
        └── PRIV-03 (perfil vocacional)
              └── PRIV-06 (sin ARCO)
                    └── DB-02 (no se puede borrar)
                          └── PRIV-07 / DB-06 (retención)
```

**Corrección conjunta:** publicar aviso, minimizar datos, permitir revocación y eliminación, definir retención.

### 6.4. Cadena operativa

```
OPS-09 (sin staging)
  └── OPS-03 (pruebas en producción)
        └── OPS-02 (restore destructivo)
              └── OPS-01 (respaldos sin cifrar)
                    └── OPS-04 / OPS-10 (despliegue manual)
                          └── OPS-07 (sin monitoreo)
```

**Corrección conjunta:** staging → CI → respaldos cifrados → despliegue automatizado → monitoreo.

---

## 7. Lo que NO es un hallazgo

Para evitar confusiones en la revisión:

| Observación | Por qué no se registra |
|---|---|
| `payments` y `student_billing` tienen dos políticas SELECT | Una es staff, otra tutor; es diseño correcto |
| La anon key está en el bundle | Es pública por diseño; el problema es la duplicación (`SEC-08`), no su presencia |
| `dist` está en `.gitignore` del repo principal | Correcto; el problema es el repo anidado (`OPS-10`) |
| Los alumnos usan correo sintético | Decisión de diseño válida para menores; el problema es el dominio fijo (`FUN-07`) |
| No hay Storage | No se usa hoy; se vuelve relevante si se agregan archivos |
| Los tests son orientativos | Es una decisión pedagógica; el problema es la visibilidad (`PRIV-03`) |
| No hay app móvil | No está en el alcance |

---

## 8. Criterio de salida del piloto

> **Estado a 20 nov 2026:** la Fase 0 (`OPS-05`, `COD-07`), la Fase 1
> (`SEC-01`, `SEC-02`, `SEC-03`, `PRIV-01`, `PRIV-02`/`DB-08`, `OPS-03`), la
> Fase 2 (`SEC-04`, `FUN-01`, `FUN-02`, `PRIV-03`, `PRIV-05`/`OPS-01`,
> `OPS-02`, `OPS-04`) y la Fase 3 (`SEC-05`, `SEC-06`, `SEC-07`, `DB-01`–`04`,
> `FUN-03`–`06`, `FUN-09`, `FUN-10`, `COD-01`, `COD-02`, `UX-01`, `UX-02`,
> `PRIV-04`, `PRIV-06`, `OPS-06`, `OPS-07`, documentación de `OPS-09`) están
> **implementadas en código y versionadas**. El 21 nov 2026 se ejecutaron en el
> staging real (`hsfhlhrkmhajmpethzqn`): migraciones `0023`–`0040` (donde
> `0039` corrige tres fallos detectados por la propia suite y `0040` añade el
> procesador de correo), 10 Edge Functions, seed ficticio, **135/135
> verificaciones de RLS**, `test-functions.mjs` y `test-email-outbox.mjs` en
> PASS y build de staging correcto. Durante la auditoría producción no fue
> tocada: el 20 nov solo se verificó en lectura y seguía con 22 migraciones.
> El 22 nov, con autorización explícita y tras respaldo cifrado, se aplicaron
> `0023`–`0040` en producción: 40/40 migraciones, 93 políticas, 111 funciones y
> 0 `SECURITY DEFINER` sin `search_path`; el aviso coincide con `v3-2026`.
>
> Siguen pendientes funcionales: la validación legal del aviso `v3-2026` y el
> correo de contacto de `PRIV-06`. El despliegue en CI ya se ejecutó con
> autorización (run final `45051723789`, SUCCESS). `SEC-06` quedó verificado
> en staging con el proveedor `log` (sin envío real); el cron requiere secretos
> del repositorio. `OPS-01`/`OPS-02` quedaron verificados con una restauración
> real en staging el 22 nov 2026. `DB-07` quedó cerrado en staging; el borrado
> definitivo de `auth.users` queda como acción coordinada separada.

Para declarar que la plataforma puede operar con datos reales de menores, deben cumplirse **todos** estos:

- [ ] `SEC-01` corregido y verificado con prueba negativa (0 filas sin asignación).
- [ ] `SEC-02`, `SEC-03` y `SEC-04` corregidos y probados con cuentas reales en staging.
- [ ] `PRIV-01` implementado en código: aviso publicado, enlace, hash y bloqueo (falta verificación en staging).
- [ ] `PRIV-02` y `DB-08` resueltos: notas internas fuera del alcance de la familia.
- [ ] `FUN-01` verificado en staging: el tutor ve avance, calificaciones, asistencia, tareas y observaciones `family` de sus hijos, sin poder editar.
- [x] `FUN-02` verificado: periodo, saldo, duplicado y anulación auditada (RLS-118…129); recibo PDF implementado y validado por `test-receipt-pdf.mjs`.
- [ ] `PRIV-03` verificado en staging: el tutor no lee `student_profiles` crudo ni notas internas; solo `student_guidance`.
- [x] `OPS-01` y `OPS-02` resueltos: respaldos cifrados y restauración segura, con una restauración de prueba exitosa en staging (22 nov 2026).
- [x] `OPS-03` y `OPS-09` resueltos: staging real creado, suites ejecutadas allí; producción se migró después con autorización.
- [x] `OPS-04`: push a `main` ejecutado y workflow sin `push -f`, con etiqueta y health check; tras dos fallos de configuración (IPv6 y propagación de Pages), el run final `45051723789` terminó en SUCCESS. La reversión está documentada pero no se probó.
- [ ] `COD-07` implementado: suite de RLS negativa en CI.
- [x] `SEC-06` verificado en staging: cola drenada con token, reintentos y auditoría sin enlaces; sin correo real (proveedor `log`).
- [x] `DB-07` cerrado: `verify-migrations.mjs` confirma 40/40 en staging y 40/40 en producción tras la migración autorizada del 22 nov 2026 (antes 22/38, solo lectura).
- [ ] Aviso de privacidad `v3-2026` validado por abogado y sin placeholders.
- [ ] Respaldos automáticos de Supabase verificados y restauración probada.
- [ ] Runbook de incidentes documentado.

Los demás hallazgos (Medio/Bajo) pueden planificarse después, siempre que no se agregue funcionalidad nueva que dependa de las áreas afectadas.

---

## 9. Resumen en una tabla

| Pregunta | Respuesta |
|---|---|
| ¿Cuántos hallazgos hay? | 63 |
| ¿Cuántos son críticos? | 1 (`SEC-01`) |
| ¿Cuántos bloquean el piloto real? | 6 en P0 + 12 en P1 |
| ¿Cuál es el de mayor impacto y menor esfuerzo? | `SEC-01`: dos `drop policy` |
| ¿Cuál es el más urgente en privacidad? | `PRIV-02`: notas internas visibles |
| ¿Cuál es el más peligroso para los datos? | `OPS-02`: truncate sin confirmación |
| ¿Qué falta para poder corregir con seguridad? | Staging (`OPS-09`) y pruebas negativas (`COD-07`) |
| ¿Se puede operar hoy con datos reales? | No, sin aceptar riesgos altos documentados |
| ¿Qué cambios tiene la Fase 3? | Migraciones `0032`–`0038`, CORS por entorno, correo de invitación, reglas de progreso en servidor, ARCO y accesibilidad; nada aplicado ni desplegado |
