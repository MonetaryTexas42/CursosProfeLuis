// Prueba E2E del procesador de email_outbox (SEC-06).
//
// Uso (desde app/):
//   APP_ENV=staging DATABASE_URL="$(cat .secrets/staging-database-url)" \
//     node scripts/test-email-outbox.mjs
//
// Requisitos: la Edge Function `process-email-outbox` desplegada con
// --no-verify-jwt, el secreto OUTBOX_PROCESSOR_TOKEN configurado y
// EMAIL_PROVIDER=log. El proveedor log NO envía correo: la fila termina en
// `captured`, nunca en `sent`.
//
// El script inserta una fila de prueba con un enlace FALSO y verifica que el
// enlace no aparece en audit_log ni en la respuesta. No borra la fila: queda
// como evidencia en staging.

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import { assertSafeTestEnvironment, projectRef, readEnvFile } from "./lib/env-guard.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");

const envFile = readEnvFile(resolve(root, "frontend/.env.staging"));
const supabaseUrl = envFile.VITE_SUPABASE_URL;
const token = readFileSync(resolve(root, ".secrets/outbox-processor-token"), "utf8").trim();
const ref = projectRef(supabaseUrl);

assertSafeTestEnvironment({
  supabaseUrl,
  appEnv: process.env.APP_ENV,
  write: true,
  label: "prueba de email_outbox",
});

if (!process.env.DATABASE_URL) {
  console.error("Falta DATABASE_URL ( usa .secrets/staging-database-url ).");
  process.exit(2);
}
if (!token) {
  console.error("Falta .secrets/outbox-processor-token.");
  process.exit(2);
}

const functionUrl = `https://${ref}.supabase.co/functions/v1/process-email-outbox`;
const db = new pg.Client({ connectionString: process.env.DATABASE_URL });
await db.connect();

const fakeLink = "https://example.invalid/auth/fake?token=NO-REAL";

function check(condition, message) {
  if (!condition) throw new Error(message);
  console.log("   ✓", message);
}

async function post(body, { secret = token, origin = null } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (secret !== null) headers["X-Outbox-Token"] = secret;
  if (origin) headers["Origin"] = origin;
  const response = await fetch(functionUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  return { status: response.status, data };
}

try {
  console.log("1) Insertando correo de prueba con enlace falso…");
  const inserted = await db.query(
    `insert into public.email_outbox (to_email, template, payload, status, scheduled_at)
     values ($1, 'guardian_invite', $2::jsonb, 'pending', now())
     returning id`,
    [
      "prueba@staging.ecoems.local",
      JSON.stringify({
        guardian_name: "Tutor Ficticio",
        student_name: "Alumno Ficticio",
        student_code: "STAGING.EMAIL.TEST",
        magic_link: fakeLink,
        resend: false,
      }),
    ],
  );
  const id = inserted.rows[0].id;
  console.log("   email_id:", id);

  console.log("2) Controles negativos…");
  const noToken = await post({ limit: 1 }, { secret: null });
  check(noToken.status === 403, "sin token → 403");
  const badToken = await post({ limit: 1 }, { secret: "token-incorrecto" });
  check(badToken.status === 403, "token incorrecto → 403");
  const browser = await post({ limit: 1 }, { origin: "https://origen-no-autorizado.invalid" });
  check(browser.status === 403, "petición de navegador → 403");
  const badMethod = await fetch(functionUrl, {
    method: "GET",
    headers: { "X-Outbox-Token": token },
  });
  check(badMethod.status === 405, "GET → 405");

  console.log("3) Procesando la cola…");
  const result = await post({ limit: 10 });
  check(result.status === 200 && result.data.ok === true, `respuesta 200 (${result.status})`);
  check(result.data.provider === "log", "el proveedor es log (sin envío real)");
  check(result.data.claimed >= 1, `reclamó ${result.data.claimed} correo(s)`);
  check(
    !JSON.stringify(result.data).includes("magic_link") &&
      !JSON.stringify(result.data).includes(fakeLink),
    "la respuesta no contiene el enlace",
  );

  console.log("4) Verificando la fila en la base…");
  const row = await db.query(
    `select status, attempts, sent_at, last_error, provider_message_id
       from public.email_outbox where id = $1`,
    [id],
  );
  const actual = row.rows[0];
  check(actual?.status === "captured", `estadoCapturado: ${actual?.status}`);
  check(actual?.attempts === 1, `un intento: ${actual?.attempts}`);
  check(actual?.sent_at instanceof Date, "sent_at registrado");
  check(actual?.last_error === null, "sin error");
  check(String(actual?.provider_message_id).startsWith("log:"), "id de proveedor log");
  check(
    actual?.status !== "sent",
    "ningún correo marcado como entregado con el proveedor log",
  );

  console.log("5) Verificando la auditoría sin PII…");
  const audit = await db.query(
    `select action, entity_type, entity_id, actor_id, after,
            after::text like '%magic_link%' as filtra_link,
            after::text like '%example.invalid%' as filtra_url
       from public.audit_log
      where entity_type = 'email_outbox' and entity_id = $1
      order by id desc limit 1`,
    [id],
  );
  const event = audit.rows[0];
  check(event?.action === "email.outbox.captured", `evento: ${event?.action}`);
  check(event?.actor_id === null, "actor del sistema (null)");
  check(event?.after?.provider === "log", "proveedor registrado en after");
  check(event?.filtra_link === false && event?.filtra_url === false, "after sin enlace");

  console.log("6) Segunda ejecución (idempotencia)…");
  const second = await post({ limit: 10 });
  check(second.status === 200 && second.data.claimed === 0, "no reclama la misma fila dos veces");

  console.log("\nPASS · procesador de email_outbox verificado en staging.");
} finally {
  await db.end().catch(() => {});
}
