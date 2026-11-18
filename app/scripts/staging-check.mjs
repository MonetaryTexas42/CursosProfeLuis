// Verificador de entorno (OPS-09).
//
// Uso (desde app/):
//   DATABASE_URL="$(cat .secrets/staging-database-url)" \
//   VITE_SUPABASE_URL="https://<ref>.supabase.co" \
//   node scripts/staging-check.mjs
//
// Comprueba que la conexión NO sea producción, que las migraciones estén
// aplicadas y que existan los datos mínimos para las pruebas de RLS.
// Es de solo lectura. Sale con código 2 si detecta producción o no conecta.

import pg from "pg";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const privacyHtmlPath = resolve(here, "../frontend/public/privacidad.html");
const privacyManifestPath = resolve(here, "../supabase/seed/privacy-document.json");
const privacyManifest = JSON.parse(readFileSync(privacyManifestPath, "utf8"));
const privacyHtmlHash = createHash("sha256")
  .update(readFileSync(privacyHtmlPath, "utf8"), "utf8")
  .digest("hex");

const PROD_REF = "ioikcrdxneuydylyhvwi";
const allowProduction = process.argv.includes("--allow-production");
const databaseUrl = process.env.DATABASE_URL;
const supabaseUrl = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";

if (!databaseUrl) {
  console.error("Falta DATABASE_URL en el entorno.");
  process.exit(2);
}

function refFromDatabaseUrl(url) {
  // Conexión directa: db.<ref>.supabase.co
  const host = url.match(/@(?:db\.)?([a-z0-9]{20})\.supabase\.(?:com|co)/i);
  if (host) return host[1].toLowerCase();
  // Pooler: postgres.<ref>@<region>.pooler.supabase.com
  const user = url.match(/\/\/(?:postgres|pgbouncer)\.([a-z0-9]{20}):/i);
  return user ? user[1].toLowerCase() : null;
}

function refFromSupabaseUrl(url) {
  const match = url.match(/^https?:\/\/([a-z0-9]{20})\.supabase\.co/i);
  return match ? match[1].toLowerCase() : null;
}

const refs = [refFromDatabaseUrl(databaseUrl), refFromSupabaseUrl(supabaseUrl)].filter(Boolean);
const isProduction = refs.includes(PROD_REF);
const isLocal = /(?:localhost|127\.0\.0\.1)/i.test(databaseUrl) || /(?:localhost|127\.0\.0\.1)/i.test(supabaseUrl);

if (!isProduction && refs.length === 0 && !isLocal) {
  console.warn(
    "Aviso: no se pudo identificar el proyecto por la URL. Verifica manualmente que NO sea producción.",
  );
}

if (isProduction && !allowProduction) {
  console.error("ABORTADO: la conexión apunta al proyecto de producción (" + PROD_REF + ").");
  console.error("Usa el proyecto de staging. Si de verdad necesitas un diagnóstico de solo lectura,");
  console.error("vuelve a ejecutar con --allow-production y sin pruebas que escriban.");
  process.exit(2);
}

const client = new pg.Client({ connectionString: databaseUrl, statement_timeout: 30000 });

async function scalar(sql) {
  const res = await client.query(sql);
  return res.rows[0] ? Object.values(res.rows[0])[0] : null;
}

async function main() {
  await client.connect();

  const version = await scalar("show server_version");
  const tables = Number(await scalar("select count(*) from pg_tables where schemaname = 'public'"));
  const policies = Number(await scalar("select count(*) from pg_policies where schemaname = 'public'"));
  const definer = Number(
    await scalar(`
      select count(*)
        from pg_proc p
        join pg_namespace n on n.oid = p.pronamespace
       where n.nspname = 'public' and p.prosecdef`),
  );

  const billingGuard = Number(
    await scalar(`
      select count(*)
        from pg_proc p
        join pg_namespace n on n.oid = p.pronamespace
       where n.nspname = 'public' and p.proname = 'app_can_view_billing'`),
  );

  const consentGuard = Number(
    await scalar(`
      select count(*)
        from pg_proc p
        join pg_namespace n on n.oid = p.pronamespace
       where n.nspname = 'public' and p.proname = 'app_guardian_has_consent'`),
  );

  const privacyView = Number(
    await scalar(`
      select count(*)
        from pg_views
       where schemaname = 'public' and viewname = 'privacy_document'`),
  );

  const guardianConsentInsertPolicy = Number(
    await scalar(`
      select count(*)
        from pg_policies
       where schemaname = 'public'
         and tablename = 'privacy_consents'
         and policyname = 'privacy_consents_guardian_insert'`),
  );

  // Fase 2 · FUN-02, PRIV-03 y SEC-04.
  const billingPeriodFn = Number(
    await scalar(`
      select count(*)
        from pg_proc p
        join pg_namespace n on n.oid = p.pronamespace
       where n.nspname = 'public' and p.proname = 'app_billing_period'`),
  );

  const voidPaymentFn = Number(
    await scalar(`
      select count(*)
        from pg_proc p
        join pg_namespace n on n.oid = p.pronamespace
       where n.nspname = 'public' and p.proname = 'app_void_payment'`),
  );

  const billingStatusView = Number(
    await scalar(`
      select count(*) from pg_views
       where schemaname = 'public' and viewname = 'student_billing_status'`),
  );

  const paymentDuplicatesView = Number(
    await scalar(`
      select count(*) from pg_views
       where schemaname = 'public' and viewname = 'payment_duplicates'`),
  );

  const guidanceView = Number(
    await scalar(`
      select count(*) from pg_views
       where schemaname = 'public' and viewname = 'student_guidance'`),
  );

  const paymentsColumns = Number(
    await scalar(`
      select count(*)
        from information_schema.columns
       where table_schema = 'public' and table_name = 'payments'
         and column_name in (
           'period_start', 'period_end', 'status', 'receipt_no',
           'idempotency_key', 'voided_at', 'voided_by', 'void_reason'
         )`),
  );

  const offboardingColumns = Number(
    await scalar(`
      select count(*)
        from information_schema.columns
       where table_schema = 'public' and table_name = 'profiles'
         and column_name in ('deactivated_at', 'deactivated_by', 'deactivation_reason')`),
  );

  const rawProfilePolicyLeak = Number(
    await scalar(`
      select count(*)
        from pg_policies
       where schemaname = 'public'
         and tablename = 'student_profiles'
         and policyname = 'student_profiles_select'
         and coalesce(qual, '') like '%app_can_access_student%'`),
  );

  let privacyRow = null;
  try {
    const res = await client.query("select version, url, sha256 from public.privacy_document");
    privacyRow = res.rows[0] ?? null;
  } catch {
    privacyRow = null;
  }

  let migrations = null;
  try {
    migrations = Number(await scalar("select count(*) from supabase_migrations.schema_migrations"));
  } catch {
    migrations = null;
  }

  const units = Number(await scalar("select count(*) from public.units"));
  const versions = Number(await scalar("select count(*) from public.unit_versions"));
  const students = Number(await scalar("select count(*) from public.students"));
  const guardians = Number(await scalar("select count(*) from public.guardians"));
  const assignments = Number(
    await scalar("select count(*) from public.unit_assignments where status = 'active' and visible"),
  );
  const roles = (
    await client.query(`
      select role::text as role, count(*)::int as n
        from public.profiles
       where active
       group by role
       order by role`)
  ).rows;

  console.log("Entorno");
  console.log("  proyecto:      " + (refs[0] ?? "desconocido") + (isProduction ? " (PRODUCCIÓN)" : ""));
  console.log("  postgres:      " + version);
  console.log("  migraciones:   " + (migrations === null ? "sin tabla de historial" : migrations));
  console.log("  tablas:        " + tables);
  console.log("  políticas RLS: " + policies);
  console.log("  SECURITY DEF.: " + definer);
  console.log("  billing guard: " + (billingGuard ? "sí (0021)" : "NO"));
  console.log("  consent guard: " + (consentGuard ? "sí (0027)" : "NO"));
  console.log("  aviso público: " + (privacyView ? "sí (0027)" : "NO"));
  console.log("  periodo plan:  " + (billingPeriodFn ? "sí (0029)" : "NO"));
  console.log("  anulación:     " + (voidPaymentFn ? "sí (0029)" : "NO"));
  console.log("  estado cuenta: " + (billingStatusView ? "sí (0029)" : "NO"));
  console.log("  duplicados:    " + (paymentDuplicatesView ? "sí (0029)" : "NO"));
  console.log("  guía curada:   " + (guidanceView ? "sí (0030)" : "NO"));
  console.log("  offboarding:   " + (offboardingColumns === 3 ? "sí (0028)" : "NO"));
  if (privacyRow) {
    console.log(
      "  aviso vigente: " +
        privacyRow.version +
        " · " +
        privacyRow.url +
        " · " +
        String(privacyRow.sha256 || "").slice(0, 12) +
        "…",
    );
  }
  console.log("");
  console.log("Datos");
  console.log("  unidades:      " + units);
  console.log("  versiones:     " + versions);
  console.log("  alumnos:       " + students);
  console.log("  tutores:       " + guardians);
  console.log("  asignaciones:  " + assignments);
  console.log("  perfiles:      " + (roles.map((r) => `${r.role}=${r.n}`).join(", ") || "ninguno"));

  const warnings = [];
  if (migrations !== null && migrations < 31) warnings.push(`faltan migraciones (${migrations} < 31)`);
  if (tables < 40) warnings.push(`faltan tablas (${tables} < 40)`);
  if (policies < 90) warnings.push(`faltan políticas (${policies} < 90)`);
  if (definer < 48) warnings.push(`faltan funciones SECURITY DEFINER (${definer} < 48)`);
  if (billingGuard === 0) warnings.push("falta app_can_view_billing (0021 no aplicada)");
  if (consentGuard === 0) warnings.push("falta app_guardian_has_consent (0027 no aplicada)");
  if (privacyView === 0) warnings.push("falta la vista privacy_document (0027 no aplicada)");
  if (guardianConsentInsertPolicy > 0) {
    warnings.push("sigue la política privacy_consents_guardian_insert: el tutor podría fabricar consentimientos");
  }
  if (billingPeriodFn === 0) warnings.push("falta app_billing_period (0029 no aplicada)");
  if (voidPaymentFn === 0) warnings.push("falta app_void_payment (0029 no aplicada)");
  if (billingStatusView === 0) warnings.push("falta la vista student_billing_status (0029 no aplicada)");
  if (paymentDuplicatesView === 0) warnings.push("falta la vista payment_duplicates (0029 no aplicada)");
  if (guidanceView === 0) warnings.push("falta la vista student_guidance (0030 no aplicada)");
  if (paymentsColumns < 8) warnings.push(`faltan columnas de trazabilidad en payments (${paymentsColumns}/8)`);
  if (offboardingColumns < 3) warnings.push(`faltan columnas de offboarding en profiles (${offboardingColumns}/3)`);
  if (rawProfilePolicyLeak > 0) {
    warnings.push("student_profiles_select sigue exponiendo la tabla cruda al tutor (PRIV-03)");
  }
  if (!privacyRow) {
    warnings.push("no se pudo leer la vista privacy_document");
  } else {
    if (privacyRow.version !== privacyManifest.version) {
      warnings.push(`versión del aviso desalineada (${privacyRow.version} ≠ ${privacyManifest.version})`);
    }
    if (privacyRow.url !== privacyManifest.url) {
      warnings.push(`URL del aviso desalineada (${privacyRow.url} ≠ ${privacyManifest.url})`);
    }
    if (privacyRow.sha256 !== privacyManifest.sha256) {
      warnings.push("el hash del aviso en la base no coincide con el manifiesto");
    }
  }
  if (privacyManifest.sha256 !== privacyHtmlHash) {
    warnings.push("el manifiesto del aviso no coincide con frontend/public/privacidad.html");
  }
  if (units === 0) warnings.push("no hay contenido sembrado");
  if (students === 0) warnings.push("no hay alumnos ficticios");
  if (guardians === 0) warnings.push("no hay tutores ficticios");
  if (assignments === 0) warnings.push("no hay asignaciones activas (RLS-10/11 quedarán en SKIP)");
  const roleNames = new Set(roles.map((r) => r.role));
  for (const role of ["admin", "teacher", "student", "guardian"]) {
    if (!roleNames.has(role)) warnings.push(`no hay perfiles con rol ${role}`);
  }

  console.log("");
  if (warnings.length) {
    console.log("Advertencias:");
    for (const w of warnings) console.log("  - " + w);
  } else {
    console.log("Sin advertencias: el entorno tiene lo mínimo para la suite de RLS.");
  }

  await client.end();
}

main().catch(async (error) => {
  console.error("No se pudo verificar el entorno:", error.message);
  await client.end().catch(() => {});
  process.exit(2);
});
