// Ejecuta un script SQL (prueba transaccional) contra la base remota.
// Uso:
//   node run-sql-test.mjs supabase/tests/0004_progress_rpcs.sql
//
// Requiere DATABASE_URL (la cadena directa de .secrets/database-url).
// Los scripts de pruebas inician con BEGIN y terminan con ROLLBACK; este
// runner imprime los RAISE NOTICE y el resultado de la última consulta.
import pg from "pg";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const sqlPath = process.argv[2];
const databaseUrl = process.env.DATABASE_URL;

if (!sqlPath) {
  console.error("Uso: node run-sql-test.mjs <archivo.sql>");
  process.exit(2);
}

if (!databaseUrl) {
  console.error("Falta DATABASE_URL en el entorno.");
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
