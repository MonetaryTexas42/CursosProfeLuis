# Monitoreo y operación

Runbook de verificaciones periódicas. Cierra **OPS-06** (trazabilidad de
acciones sensibles) y **OPS-07** (verificación de migraciones aplicadas), y da
seguimiento a **OPS-09** (staging).

## 1. Migraciones aplicadas (OPS-07)

La Fase 3 añade `0032`–`0038`. La ejecución real en staging añadió `0039` con
tres correcciones detectadas por la suite (grants a `authenticated` y visibilidad
de perfiles) y `0040` con las RPCs del procesador de `email_outbox`. Ninguna
migración se ha aplicado a producción desde este repositorio: están preparadas
como cambios versionados y reversibles.

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
| Migraciones | 40 | 40 |
| Tablas | 41 | 41 |
| Políticas RLS | 93 | 93 |
| Funciones `SECURITY DEFINER` | ≥ 53 | 61 |

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

**DB-07 queda verificado en staging**, sin cambios en producción. No uses
credenciales de escritura "por costumbre": la verificación no modifica la base,
y producción no debe recibir migraciones sin aprobación explícita.

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
