// Ejecuta un script SQL (prueba transaccional) contra la base remota.
// Uso:
//   TEST_STUDENT_CODE=STAGING.ALUMNO.UNO node run-sql-test.mjs supabase/tests/0004_progress_rpcs.sql
//
// Requiere DATABASE_URL (la cadena directa de .secrets/database-url) y
// TEST_STUDENT_CODE (fixture ficticio; nunca un alumno real).
// Los scripts de pruebas inician con BEGIN y terminan con ROLLBACK; este
// runner imprime los RAISE NOTICE y el resultado de la última consulta.
import pg from "pg";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { PRODUCTION_REF } from "./lib/env-guard.mjs";

const sqlPath = process.argv[2];
const databaseUrl = process.env.DATABASE_URL;
const studentCode = process.env.TEST_STUDENT_CODE;

if (!sqlPath) {
  console.error("Uso: node run-sql-test.mjs <archivo.sql>");
  process.exit(2);
}

if (!databaseUrl) {
  console.error("Falta DATABASE_URL en el entorno.");
  process.exit(2);
}

if (!studentCode) {
  console.error(
    "Falta TEST_STUDENT_CODE. Usa un fixture ficticio, por ejemplo STAGING.ALUMNO.UNO.",
  );
  process.exit(2);
}

// Conexión directa (db.<ref>.supabase.co) o pooler (postgres.<ref>@...).
const targetRef =
  (databaseUrl.match(/@(?:db\.)?([a-z0-9]{20})\.supabase\.(?:com|co)/i) || [])[1] ||
  (databaseUrl.match(/\/\/(?:postgres|pgbouncer)\.([a-z0-9]{20}):/i) || [])[1] ||
  "";
if (
  targetRef.toLowerCase() === PRODUCTION_REF &&
  process.env.ALLOW_PRODUCTION_SQL_TEST !== "1"
) {
  console.error(
    "La base es producción. Estas pruebas hacen ROLLBACK, pero si es intencional " +
      "añade ALLOW_PRODUCTION_SQL_TEST=1.",
  );
  process.exit(2);
}

const sql = readFileSync(resolve(sqlPath), "utf8");
const client = new pg.Client({ connectionString: databaseUrl });

const notices = [];
client.on("notice", (msg) => {
  notices.push(msg.message);
  console.log("  notice:", msg.message);
});

try {
  await client.connect();
  // Disponible para los scripts como current_setting('test.student_code').
  await client.query("select set_config('test.student_code', $1, false)", [
    studentCode,
  ]);
  const result = await client.query(sql);
  const rows = Array.isArray(result) ? result.at(-1)?.rows ?? [] : result.rows;
  console.log("\nResultado final:");
  for (const row of rows) {
    console.log("  ", JSON.stringify(row));
  }
  console.log(`\nOK · ${notices.length} notice(s) · sin errores (transacción revertida)`);
} catch (error) {
  console.error("\nFALLÓ:", error.message);
  process.exit(1);
} finally {
  await client.end().catch(() => {});
}
