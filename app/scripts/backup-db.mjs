// Respaldo de la base remota en JSON (sin Docker: usa la conexión directa).
//
// Uso (desde app/):
//   DATABASE_URL="$(cat .secrets/database-url)" node scripts/backup-db.mjs
//
// Genera .backups/backup-<fecha>.json con el contenido de todas las tablas
// de los esquemas auth y public. El esquema se reproduce con las migraciones.
import pg from "pg";
import { writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("Falta DATABASE_URL en el entorno.");
  process.exit(2);
}

const client = new pg.Client({ connectionString: databaseUrl, statement_timeout: 120000 });
await client.connect();

try {
  const tablesRes = await client.query(`
    select schemaname, tablename
      from pg_tables
     where schemaname in ('public', 'auth')
     order by schemaname, tablename
  `);

  const backup = {
    generatedAt: new Date().toISOString(),
    tables: {},
  };

  for (const { schemaname, tablename } of tablesRes.rows) {
    const quoted = `"${schemaname}"."${tablename}"`;
    const rowsRes = await client.query(
      `select coalesce(jsonb_agg(to_jsonb(t)), '[]'::jsonb) as data from ${quoted} t`,
    );
    const count = rowsRes.rows[0].data.length;
    backup.tables[`${schemaname}.${tablename}`] = rowsRes.rows[0].data;
    console.log(`  ${schemaname}.${tablename}: ${count} filas`);
  }

  const stamp = new Date().toISOString().replace(/[:T]/g, "-").slice(0, 19);
  const outDir = resolve(here, "../.backups");
  mkdirSync(outDir, { recursive: true });
  const outPath = resolve(outDir, `backup-${stamp}.json`);
  writeFileSync(outPath, JSON.stringify(backup), "utf8");

  console.log(`\nRespaldo escrito: ${outPath}`);
} finally {
  await client.end().catch(() => {});
}
