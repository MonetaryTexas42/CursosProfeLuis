# Monitoreo y operación

Runbook de verificaciones periódicas. Cierra **OPS-06** (trazabilidad de
acciones sensibles) y **OPS-07** (verificación de migraciones aplicadas), y da
seguimiento a **OPS-09** (staging).

## 1. Migraciones aplicadas (OPS-07)

La Fase 3 añade `0032`–`0038`. La ejecución real en staging añadió `0039` con
tres correcciones detectadas por la suite (grants a `authenticated` y visibilidad
de perfiles) y `0040` con las RPCs del procesador de `email_outbox`. El 22 nov
2026, con autorización explícita y tras respaldos cifrados, se aplicaron en
producción `0023`–`0040`, después `0041`/`0042` del examen final y, al cierre,
`0043` de la vista previa del profesorado. Staging y producción quedaron
alineados en 43/43 migraciones.

En staging, después de `db push`:

```bash
cd app
DATABASE_URL="$(cat .secrets/staging-database-url)" \
VITE_SUPABASE_URL="https://<REF_STAGING>.supabase.co" \
  node scripts/staging-check.mjs
```

El verificador es de solo lectura y comprueba:

| Recurso | Umbral esperado | Observado en staging |
|---|---|---|
| Migraciones | ≥ 38 | 43 (40 + `0041`/`0042` + `0043`) |
| Tablas | 41 | 41 |
| Políticas RLS | ≥ 93 | 96 |
| Funciones `SECURITY DEFINER` | ≥ 53 | ver `staging-check.mjs` |

Además verifica los objetos nuevos: índices únicos de asignación y XP,
triggers de XP/política de quiz, `data_requests` con tres políticas, los cuatro
ajustes de la Fase 3 y las RPCs `app_activate_unit`, `app_anonymize_student`,
`app_award_server_xp`, `app_unit_requirements`, `app_quiz_policy`,
`app_create_data_request`, `app_resolve_data_request`, `app_ban_account`,
`app_claim_email_outbox`, `app_complete_email_outbox` y
`app_requeue_stale_email_outbox`.

Para producción, usa el verificador de solo lectura:

```bash
cd app
DATABASE_URL="$(cat .secrets/database-url)" \
  node scripts/verify-migrations.mjs
```

Esa verificación ya se ejecutó el 20 nov 2026 contra el proyecto enlazado
`ioikcrdxneuydylyhvwi`. El script solo emite `SELECT`: **38 migraciones
locales, 22 aplicadas, 16 faltantes (`0023`–`0038`), 0 desconocidas, 87
políticas, 94 funciones y 0 `SECURITY DEFINER` sin `search_path`**. El código
de salida fue `1`, esperado mientras falten migraciones. No se aplicó ningún
cambio, no se desplegó y no se imprimió la URL.

El verificador usa las columnas reales `version`, `name` y `statements` de
`schema_migrations`; la referencia anterior a `inserted_at` era incorrecta y
ya está corregida (commit `888a2ce`).

**Resultado en staging (21 nov 2026):** `hsfhlhrkmhajmpethzqn`, 40/40
migraciones, 41 tablas, 93 políticas, 61 `SECURITY DEFINER`, 0 sin
`search_path`, suite RLS **135/135**, `test-functions.mjs` y
`test-email-outbox.mjs` en PASS. El build de staging también terminó
correctamente.

**DB-07 quedó verificado en staging**; en ese momento no había cambios en
producción. No uses credenciales de escritura "por costumbre": la verificación
no modifica la base, y producción no debe recibir migraciones sin aprobación
explícita.

**Estado actual de producción (22 nov 2026, cierre final):** con autorización
explícita se aplicaron `0041`/`0042` tras el respaldo cifrado
`backup-2026-11-22-19-09-56.json.enc` (SHA-256 del contenido
`30bc3762…7f141`, SHA-256 del archivo `784ada66…c631e`) y, al final del cierre,
`0043` tras el respaldo `backup-2026-11-22-21-55-47.json.enc` (SHA-256 del
contenido `ccb38143…816c8`, SHA-256 del archivo `3803a2c3…5207`). La
verificación final reporta **43/43 migraciones, 96 políticas, 116 funciones y 0
`SECURITY DEFINER` sin `search_path`**. `app_final_exam_status()` devuelve
`{"enabled":true,"subject":"espanol","sections":13,"questions":136,"questionsPerSection":0}`.
Los conteos de datos sensible no cambiaron: 13 perfiles, 4 alumnos, 2
`student_profiles`, 4 pagos, 13 asignaciones y 24 entradas de auditoría;
`settings` pasó de 7 a 9 por los ajustes del examen. La vista
`student_billing_status` sigue respondiendo `401` con clave anónima porque solo
concede permisos a `authenticated` (igual que en staging). Evidencia en
`AUDITORIA_ECOEMS/evidencias/produccion-cierre-final.json`.

**Verificación actual de staging (22 nov 2026, tras `0043`):**
`verify-migrations.mjs` reporta 43 migraciones locales y 43 aplicadas, 96
políticas, 116 funciones y 0 `SECURITY DEFINER` sin `search_path`. La prueba
E2E `scripts/test-final-exam.mjs` confirma 13 secciones, 136 preguntas,
respuestas y tiempos registrados, puntaje calculado en servidor, clave correcta
no legible por el alumno y rollback sin residuos. La suite RLS sigue en
**131 PASS · 0 FAIL · 0 SKIP**. El flag de staging quedó en `false` para no
alterar el entorno de prueba. Detalle en
`AUDITORIA_ECOEMS/12_PRUEBAS_PENDIENTES.md` §8.6.

**Publicación (22 nov 2026):** el run `45059343395` de «CI y despliegue»
terminó en SUCCESS para el commit `c3ef7c6`, publicó `gh-pages` y la etiqueta
`deploy-c3ef7c6`. El health check confirmó el portal y el aviso `v3-2026`.
Verificación externa: `/`, `/guia-examen-espanol.html` y `/privacidad.html`
responden 200; hashes `966fb846…d4094` (guía) y `85d13859…f740b` (aviso);
bundle publicado `index-D58IlHdW.js`.

**Ajuste de visibilidad en `/curso/` (22 nov 2026):** tras confirmar que el
examen y el taller solo aparecían en el panel principal, el commit `0aeb7e7`
añadió accesos en el menú lateral y en el inicio del reproductor legacy, con
deep links `../#examen` y `../#vocacional`. El run `45060761193` terminó en
SUCCESS y publicó `deploy-0aeb7e7` (`gh-pages` en `3bb4484`); el build de Pages
`45060808981` también terminó en SUCCESS. Verificación externa:
`/curso/index.html` sirve `css/styles.css?v=3` y `js/login-gate.js?v=3`;
`/curso/js/app.js?v=3` contiene «Evaluación y orientación» y «Examen final de
Español»; `/curso/css/styles.css?v=3` contiene `.tool-grid`; el bundle actual es
`index-DOGMA5Xi.js` (200).

**Resultados del examen para el profesorado (22 nov 2026):** la RLS de `0041`
ya autorizaba a `app_is_teacher_of_student()` y a los administradores a leer
`final_exam_sessions`; comprobado con un token de profesor (`GET
/rest/v1/final_exam_sessions` → HTTP 200 `[]`, sin escrituras). El commit
`5207118` añadió la pestaña «Examen final» al panel del staff con sesiones,
estado, aciertos, duración, puntaje y promedio. El run `45061693062` terminó en
SUCCESS y publicó `deploy-5207118` (`gh-pages` en `2356aa8`); el build de Pages
`45061732099` también terminó en SUCCESS. Verificación externa: bundle actual
`index-CYpOHLrA.js` (200), que contiene «Resultados por alumno», «Promedio» y la
nota del test vocacional oficial. El test vocacional oficial continúa en la
ficha del alumno y el taller ampliado sigue en `localStorage`.

**Vista previa del examen para el profesorado (22 nov 2026):** el commit
`f4bc229` añadió el botón «Vista previa del examen →» a la pestaña «Examen
final» del staff. La migración `0043` creó `app_preview_final_exam()`, una RPC
de solo lectura restringida por `app_is_staff()` que devuelve las 13 secciones,
las 136 preguntas, la respuesta correcta y la explicación. El frontend omite
`app_answer_final_exam` y `app_finish_final_exam` en este modo: no hay sesión,
no hay escrituras y la calificación en pantalla es solo local. Pruebas con
tokens de prueba: profesor HTTP 200 con clave; alumno y tutor HTTP 403. Tras
las pruebas, `final_exam_sessions=0` y `final_exam_answers=0` en staging y
producción. En producción la CLI no pudo iniciar el rol de login (403) y la
migración se aplicó por SQL directo, quedando registrada en
`supabase_migrations.schema_migrations`; no se imprimieron secretos.

**Página propia del vocacional (22 nov 2026):** `vocacional.html` es una entrada
independiente con gate de sesión; el panel y `/curso/` enlazan a ella. Ya no se
abre como diálogo dentro de la ficha del alumno. RIASEC y checklist siguen en
`localStorage` y se limpian al cerrar sesión; el test oficial continúa en la
ficha del alumno. Los recursos del curso se versionaron con `?v=4`.

**Publicación final (22 nov 2026):** el run `45074991966` terminó en SUCCESS y
publicó `deploy-f4bc229` (`gh-pages` en `0ea4c50`); el build de Pages
`45075032798` también terminó en SUCCESS. Verificación externa:
`/`, `/vocacional.html`, `/curso/`, `/guia-examen-espanol.html` y
`/privacidad.html` → 200. Bundle `main-CqpKtSk-.js` con «Vista previa del
profesorado», `data-preview-final-exam` y `app_preview_final_exam`; entrada
`vocacional.html` con `vocacional-CayTz_gP.js` y chunk `vocational-kkg0TQ4K.js`.
Detalle en `AUDITORIA_ECOEMS/evidencias/produccion-cierre-final.json` (§
`cierre_0043`) y en `AUDITORIA_ECOEMS/12_PRUEBAS_PENDIENTES.md` §8.7.

## 2. Trazabilidad de acciones sensibles (OPS-06)

Consultas de solo lectura para revisar la actividad reciente. Se ejecutan en
staging o en una réplica de producción; nunca escriben datos.

```sql
-- Acciones sensibles de los últimos 7 días
select created_at, actor_id, action, entity_type, entity_id
  from public.audit_log
 where created_at >= now() - interval '7 days'
 order by created_at desc
 limit 200;

-- Solicitudes ARCO que se acercan al plazo (20 días por defecto)
select id, kind, status, received_at, due_at
  from public.data_requests
 where status in ('received', 'in_progress')
 order by due_at
 limit 100;

-- Solicitudes vencidas: requieren atención inmediata
select count(*) as vencidas
  from public.data_requests
 where status in ('received', 'in_progress') and due_at < now();
```

La pestaña **Auditoría** del panel muestra las mismas fuentes sin `before` ni
`after`. Esos campos pueden contener PII y solo deben consultarse con una
investigación autorizada y registrada.

### Señales que requieren revisión

| Señal | Acción |
|---|---|
| Subida repentina de `guardian.invited` | Revisar si hay automatización o abuso. |
| Muchos `ban.*` o `deactivate-user` seguidos | Verificar actor en `audit_log`. |
| `data_requests` vencidas | Escalar a la persona responsable de privacidad. |
| `email_outbox` en `pending` más de 24 h | Revisar el cron y el procesador de correo. |
| `email_outbox` en `sending` más de 30 min | El worker murió; `app_requeue_stale_email_outbox` lo recupera en la próxima ejecución. |
| `email_outbox` en `failed` | No reenviar a mano el enlace; revisar `last_error`. |
| `email.outbox.failed` en `audit_log` | Revisar la plantilla y los reintentos antes de reprocesar. |
| `cors_origin_rejected` en logs | Confirmar si es configuración o un origen real no autorizado. |

Los logs de Edge Functions se revisan desde el dashboard del proyecto o con el
CLI. No pegues logs en canales compartidos: pueden contener correos o IDs.

## 3. Salud de las Edge Functions

Comprobación rápida sin `Origin` (no dispara el bloqueo CORS):

```bash
cd app
node scripts/test-functions.mjs      # exige APP_ENV=staging
node scripts/test-email-outbox.mjs   # exige APP_ENV=staging y el token del cron
```

La suite valida, entre otros puntos:

- entrega por correo de `invite-guardian` y ausencia de enlaces en la
  respuesta;
- rechazo 403 ante un `Origin` desconocido;
- consentimiento del tutor con versión correcta e incorrecta;
- rechazo de acciones de rol por rol.

## 4. Respuesta ante incidentes

1. **Aislar**: identifica entorno, función o migración implicada. No apuntes
   herramientas de diagnóstico a producción por costumbre.
2. **Contener**: si es CORS, corrige `ALLOWED_ORIGIN`; si es una invitación,
   deja de compartir enlaces y revisa `email_outbox`.
3. **Documentar**: escribe un evento en `audit_log` solo desde el flujo
   autorizado; no insertes registros a mano con `service_role`.
4. **Revertir**: las migraciones tienen `Rollback` documentado en su cabecera.
   Aplícalo solo en staging y con revisión; en producción requiere aprobación.
5. **Comunicar**: a Privacidad si hay datos personales; a Legal si hay una
   solicitud ARCO vencida o un borrado indebido.

No hay alertas automáticas configuradas en esta fase. La revisión manual
quiere registro de quién la ejecutó y cuándo.
