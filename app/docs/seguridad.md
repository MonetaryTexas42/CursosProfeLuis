# Seguridad operativa

Runbook de los controles introducidos en la Fase 3. Complementa
[staging.md](staging.md) y el índice de hallazgos de `AUDITORIA_ECOEMS/`.

## 1. CORS por entorno (SEC-05)

Las nueve Edge Functions comparten `_shared/http.ts`. No hay lista abierta:
cada entorno declara su origen exacto en `ALLOWED_ORIGIN`.

| Entorno | Valor |
|---|---|
| Producción | `https://monetarytexas42.github.io` |
| Staging | la URL exacta del proyecto de staging |
| Pruebas locales explícitas | `*` (nunca en staging ni producción) |

Comportamiento:

- Una petición con `Origin` distinto se rechaza con **403** antes del
  `OPTIONS` y del `POST`.
- Una petición sin `Origin` (health checks, scripts servidor a servidor) sigue
  permitida. CORS protege al navegador; esos clientes no pueden suplantar su
  origen.
- Las respuestas incluyen `Vary: Origin` para no mezclar cachés por origen.

Configuración y comprobación:

```bash
cd app
npx --yes supabase@latest secrets set \
  ALLOWED_ORIGIN="https://<ORIGEN_EXACTO_DEL_ENTORNO>" \
  --project-ref <REF>

APP_ENV=staging node scripts/test-functions.mjs
```

`test-functions.mjs` incluye una prueba negativa: envía
`Origin: https://origen-no-autorizado.invalid` y exige 403. Si esa prueba no
falla cuando corresponde, no despliegues el cambio.

## 2. Entrega de invitaciones (SEC-06)

`invite-guardian` ya no devuelve `magic_link` ni `whatsapp_share_url`. El
enlace de un solo uso se escribe **solo** en el payload de `email_outbox` con
la plantilla `guardian_invite`:

```text
invite-guardian → email_outbox (pending) → procesador autorizado → correo del tutor
```

Reglas:

- La respuesta HTTP contiene `delivery: "email"` y `email_id`, nunca el enlace.
- La interfaz dice que el correo fue encolado; no ofrece botón de WhatsApp ni
  muestra el enlace mágico.
- La fila de `audit_log` registra `delivery: "email"` y `email_id`, sin el
  enlace.
- **El procesador de `email_outbox` no está implementado en esta fase.** Hasta
  que exista, las invitaciones quedan en `pending`: este es un trabajo
  operativo posterior, no un fallo silencioso. No reenvíes el enlace desde el
  chat ni por correo manual con la `service_role` fuera del procesador.

## 3. Registro de auditoría (SEC-07)

`audit_log` conserva la trazabilidad de acciones sensibles: who, qué, cuándo y
desde dónde. La Fase 3 añade eventos para anonimización, resolución ARCO y
baneo de cuentas externas (`0033`, `0037`, `0038`).

- El administrador consulta `audit_log` y `data_requests` desde la pestaña
  **Auditoría** del panel.
- La vista **no renderiza** `before`/`after`: esos campos pueden contener PII y
  duplicarla en pantalla. Se muestran acción, actor, entidad y fecha.
- `audit_log` y `email_outbox` no son legibles por alumnos, tutores ni
  profesores (RLS-68, RLS-69 y checks de la Fase 3).

### Retención

No hay una política de retención aprobada en esta fase. Hasta que Legal defina
el plazo, **no se borran** filas de `audit_log` ni de `data_requests`: el
borrado rompería la evidencia. Registra la decisión en el plan de remediación
antes de programar cualquier limpieza.

## 4. Anonimización y baneo

- `app_anonymize_student` sustituye el código por un seudónimo, elimina la
  fecha de nacimiento y borra notas internas, consentimientos, vínculos y
  mensajes. Conserva el historial académico y financiero bajo el seudónimo.
- El borrado definitivo de `auth.users` queda como acción separada y
  coordinada: no se ejecuta desde la UI ni desde un script automático.
- `app_ban_account` registra actor, motivo y fecha de la desactivación
  (`0038`). La cuenta se desactiva en Auth antes de marcar el perfil; si falla
  el update, la función compensa el cambio.

## 5. Solicitudes ARCO (PRIV-06)

- El plazo por defecto es **20 días** (`settings.data_request_sla_days`).
- La dirección de contacto es `settings.data_request_email`. Está vacía a
  propósito: mientras no se valide institucionalmente, la UI **no inventa**
  un correo.
- El alta (`app_create_data_request`) y la resolución
  (`app_resolve_data_request`) quedan auditadas. No hay política de DELETE en
  `data_requests`.

## 6. Antes de desplegar

1. Aplicar `0032`–`0038` en staging y correr `staging-check.mjs` sin
   advertencias.
2. Correr la suite RLS con 0 FAIL.
3. Verificar CORS positivo y negativo y el encolado de correo.
4. Revisar que no haya secretos, PII real ni enlaces mágicos en logs o
   respuestas.
5. Confirmar con Legal el aviso `v3-2026` y el correo de contacto.
