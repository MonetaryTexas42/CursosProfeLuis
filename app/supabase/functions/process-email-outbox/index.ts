// Procesador de `email_outbox` (SEC-06).
//
// No es una función de navegador: solo la invoca un cron con un token compartido.
// Lea el runbook en docs/seguridad.md antes de desplegarla. Por diseño:
//   - el proveedor por defecto es `log`, que NO envía correo (captura el mensaje
//     y marca la fila como `captured`, un estado distinto de `sent`);
//   - el enlace mágico solo se lee del payload para armar el correo: nunca se
//     escribe en logs, audit_log ni en la respuesta HTTP;
//   - sin OUTBOX_PROCESSOR_TOKEN la función falla cerrada.

import { adminClient, audit } from "../_shared/auth.ts";
import { errorResponse, HttpError, jsonResponse } from "../_shared/http.ts";

type Result = "sent" | "captured" | "failed" | "retry";

interface OutboxRow {
  id: string;
  to_email: string;
  template: string;
  payload: Record<string, unknown>;
  attempts: number;
}

interface Rendered {
  subject: string;
  html: string;
  text: string;
}

const TOKEN_HEADER = "x-outbox-token";

function intEnv(name: string, fallback: number, min: number, max: number): number {
  const raw = Deno.env.get(name);
  if (!raw) return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new HttpError(500, `${name} debe ser un entero entre ${min} y ${max}`);
  }
  return value;
}

function equalSecret(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function authorize(req: Request): void {
  const secret = Deno.env.get("OUTBOX_PROCESSOR_TOKEN");
  if (!secret) {
    throw new HttpError(500, "El procesador de correo no está configurado");
  }
  if (!equalSecret(req.headers.get(TOKEN_HEADER) ?? "", secret)) {
    throw new HttpError(403, "No autorizado");
  }
}

function escapeHtml(value: string): string {
  const entities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return value.replace(/[&<>"']/g, (char) => entities[char]);
}

function textField(payload: Record<string, unknown>, key: string, max: number): string {
  const value = payload[key];
  if (typeof value !== "string" || !value.trim() || value.length > max) {
    throw new Error(`payload.${key} inválido`);
  }
  return value.trim();
}

/** Renderiza la única plantilla soportada. Nunca incluye el enlace en logs. */
function render(row: OutboxRow): Rendered {
  if (row.template !== "guardian_invite") {
    throw new Error(`Plantilla no soportada: ${row.template}`);
  }

  const guardian = textField(row.payload, "guardian_name", 120);
  const student = textField(row.payload, "student_name", 120);
  const code = textField(row.payload, "student_code", 60);
  const link = textField(row.payload, "magic_link", 2048);

  let url: URL;
  try {
    url = new URL(link);
  } catch {
    throw new Error("magic_link no es una URL válida");
  }
  if (url.protocol !== "https:") {
    throw new Error("magic_link debe usar HTTPS");
  }

  const safeGuardian = escapeHtml(guardian);
  const safeStudent = escapeHtml(student);
  const safeCode = escapeHtml(code);
  const safeLink = escapeHtml(url.toString());

  return {
    subject: "Invitación a la plataforma ECOEMS",
    text:
      `${guardian}, te invitamos a vincularte con ${student} (${code}) en ECOEMS.\n\n` +
      `Abre este enlace para confirmar tu cuenta:\n${url.toString()}\n\n` +
      "Si no esperabas este correo, ignóralo.",
    html:
      `<p>${safeGuardian}, te invitamos a vincularte con ${safeStudent} ` +
      `(${safeCode}) en ECOEMS.</p>` +
      `<p><a href="${safeLink}">Confirmar mi cuenta</a></p>` +
      `<p>Si no esperabas este correo, ignóralo.</p>`,
  };
}

interface Delivery {
  result: Exclude<Result, "retry">;
  providerMessageId: string | null;
  error: string | null;
  retryable: boolean;
}

async function deliver(
  provider: "log" | "resend",
  row: OutboxRow,
  message: Rendered,
): Promise<Delivery> {
  if (provider === "log") {
    // Captura sin salida: el correo no sale del entorno. El prefijo distingue
    // estos ids de los del proveedor real en la auditoría.
    return {
      result: "captured",
      providerMessageId: `log:${crypto.randomUUID()}`,
      error: null,
      retryable: false,
    };
  }

  const apiKey = Deno.env.get("RESEND_API_KEY");
  const from = Deno.env.get("EMAIL_FROM");
  if (!apiKey || !from) {
    throw new HttpError(500, "Falta RESEND_API_KEY o EMAIL_FROM");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [row.to_email],
      subject: message.subject,
      html: message.html,
      text: message.text,
    }),
  });

  const payload = await response.json().catch(() => ({})) as {
    id?: string;
    message?: string;
  };

  if (response.ok && payload.id) {
    return { result: "sent", providerMessageId: payload.id, error: null, retryable: false };
  }

  const detail = String(payload.message ?? `HTTP ${response.status}`).slice(0, 300);
  return {
    result: "failed",
    providerMessageId: null,
    error: detail,
    retryable: response.status === 429 || response.status >= 500,
  };
}

function retryAt(attempts: number): string {
  const minutes = Math.min(5 * 2 ** Math.max(attempts - 1, 0), 360);
  return new Date(Date.now() + minutes * 60_000).toISOString();
}

Deno.serve(async (req) => {
  // Rechaza explícitamente cualquier petición de navegador. Los crons no
  // envían Origin; si aparece, alguien está intentando llamarlo desde un sitio.
  if (req.headers.get("origin")) {
    return errorResponse(403, "Este proceso no acepta peticiones de navegador");
  }
  if (req.method !== "POST") {
    return errorResponse(405, "Método no permitido");
  }

  try {
    authorize(req);

    const provider = Deno.env.get("EMAIL_PROVIDER") ?? "log";
    if (provider !== "log" && provider !== "resend") {
      throw new HttpError(500, "EMAIL_PROVIDER debe ser log o resend");
    }
    // Falla cerrada antes de reclamar nada: una configuración incompleta no
    // debe marcar correos como fallidos de forma permanente.
    if (provider === "resend" && (!Deno.env.get("RESEND_API_KEY") || !Deno.env.get("EMAIL_FROM"))) {
      throw new HttpError(500, "Falta RESEND_API_KEY o EMAIL_FROM");
    }
    const maxAttempts = intEnv("EMAIL_MAX_ATTEMPTS", 5, 1, 20);
    const staleMinutes = intEnv("EMAIL_STALE_MINUTES", 30, 1, 1440);

    let body: Record<string, unknown> = {};
    try {
      body = await req.json() as Record<string, unknown>;
    } catch {
      // Cuerpo opcional: el cron puede llamar sin payload.
    }
    const limit = body.limit === undefined
      ? intEnv("EMAIL_BATCH_SIZE", 10, 1, 50)
      : Number(body.limit);
    if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
      throw new HttpError(400, "limit debe ser un entero entre 1 y 50");
    }

    const admin = adminClient();

    const requeued = await admin.rpc("app_requeue_stale_email_outbox", {
      p_age_minutes: staleMinutes,
      p_limit: 50,
    });
    if (requeued.error) throw new HttpError(500, "No se pudieron recuperar envíos abandonados");

    const claimed = await admin.rpc("app_claim_email_outbox", { p_limit: limit });
    if (claimed.error) throw new HttpError(500, "No se pudo reclamar la cola de correo");

    const rows = (claimed.data ?? []) as OutboxRow[];
    const summary = {
      ok: true,
      provider,
      claimed: rows.length,
      stale_requeued: Number(requeued.data ?? 0),
      sent: 0,
      captured: 0,
      retried: 0,
      failed: 0,
      errors: 0,
    };

    for (const row of rows) {
      let result: Result = "failed";
      let providerMessageId: string | null = null;
      let error: string | null = null;

      try {
        const message = render(row);

        let delivery: Delivery;
        try {
          delivery = await deliver(provider, row, message);
        } catch (err) {
          // Fallo de transporte (red, timeout): se reintenta, no es un error
          // permanente del mensaje. Nunca se registra el cuerpo de la petición.
          delivery = {
            result: "failed",
            providerMessageId: null,
            error: String(err instanceof Error ? err.message : err).slice(0, 300),
            retryable: true,
          };
        }
        providerMessageId = delivery.providerMessageId;
        error = delivery.error;

        if (!delivery.retryable) {
          result = delivery.result;
        } else if (row.attempts >= maxAttempts) {
          result = "failed";
          error = `Reintentos agotados (${row.attempts}): ${delivery.error ?? "error desconocido"}`;
        } else {
          result = "retry";
        }
      } catch (err) {
        // Un payload inválido o una plantilla desconocida no se reintenta:
        // corregir el productor es la única salida.
        result = "failed";
        error = String(err instanceof Error ? err.message : err).slice(0, 300);
      }

      const closed = await admin.rpc("app_complete_email_outbox", {
        p_id: row.id,
        p_result: result,
        p_provider_message_id: providerMessageId,
        p_error: error,
        p_retry_at: result === "retry" ? retryAt(row.attempts) : null,
      });

      if (closed.error) {
        // La fila queda en `sending`; el reclamo de la próxima ejecución la
        // recuperará tras EMAIL_STALE_MINUTES.
        console.error("email_outbox_close_error", row.id, closed.error.message);
        summary.errors++;
        continue;
      }

      await audit(
        admin,
        null,
        `email.outbox.${result}`,
        "email_outbox",
        row.id,
        { template: row.template, provider, attempts: row.attempts },
        req,
      );

      if (result === "sent") summary.sent++;
      else if (result === "captured") summary.captured++;
      else if (result === "retry") summary.retried++;
      else summary.failed++;
    }

    // Nunca devolver payloads: pueden contener enlaces de un solo uso.
    return jsonResponse(summary);
  } catch (error) {
    if (error instanceof HttpError) {
      return errorResponse(error.status, error.message);
    }
    console.error("email_outbox_processor_error", error instanceof Error ? error.message : "error");
    return errorResponse(500, "Error interno");
  }
});
