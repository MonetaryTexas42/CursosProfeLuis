// Verificación de migraciones aplicadas (DB-07).
//
// Uso (desde app/):
//   DATABASE_URL="$(cat .secrets/staging-database-url)" node scripts/verify-migrations.mjs
//   DATABASE_URL="..." node scripts/verify-migrations.mjs --out=docs/migraciones-staging.json
//
// Qué hace (solo lectura):
//   1. Compara los archivos de `supabase/migrations/` con
//      `supabase_migrations.schema_migrations`.
//   2. Lista políticas y funciones de `public` para detectar objetos no
//      versionados.
//   3. Revisa que las funciones `SECURITY DEFINER` fijen `search_path`.
//   4. Sale con código 1 si falta una migración o hay una versión desconocida.
//
// No escribe en la base. El `--out` es un archivo local para comparar entornos.
// Nota: en proyectos recientes `schema_migrations` tiene (version, statements,
// name), sin `inserted_at`. No se consulta para no depender de la versión.
import pg from "pg";
import { readdirSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { PRODUCTION_REF } from "./lib/env-guard.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const databaseUrl = process.env.DATABASE_URL;
const args = process.argv.slice(2);
const outArg = args.find((arg) => arg.startsWith("--out="));
const allowMismatch = args.includes("--allow-mismatch");

if (!databaseUrl) {
  console.error("Falta DATABASE_URL en el entorno.");
  process.exit(2);
}

function targetRef(url) {
  const match =
    String(url).match(/@(?:db\.)?([a-z0-9]{20})\.supabase\.(?:com|co)/i) ||
    String(url).match(/\/\/(?:postgres|pgbouncer)\.([a-z0-9]{20}):/i);
  return match ? match[1].toLowerCase() : "desconocido";
}

const target = targetRef(databaseUrl);
if (target === PRODUCTION_REF) {
  console.warn("\nAVISO · estás verificando PRODUCCIÓN. Esta consulta es de solo lectura.\n");
}

const migrationsDir = resolve(here, "../supabase/migrations");
const localFiles = readdirSync(migrationsDir)
  .filter((name) => /^\d{4}_.+\.sql$/.test(name))
  .sort();
const localVersions = localFiles.map((name) => name.slice(0, 4));

const client = new pg.Client({ connectionString: databaseUrl, statement_timeout: 60000 });
await client.connect();

try {
  // En un proyecto recién creado la tabla todavía no existe: eso significa
  // 0 migraciones aplicadas, no un error de conexión.
  const tableRes = await client.query(`
    select to_regclass('supabase_migrations.schema_migrations') as oid
  `);
  const hasMigrationTable = Boolean(tableRes.rows[0]?.oid);

  const appliedRes = hasMigrationTable
    ? await client.query(`
        select version, name
          from supabase_migrations.schema_migrations
         order by version
      `)
    : { rows: [] };

  const applied = appliedRes.rows.map((row) => ({
    version: String(row.version),
    name: row.name,
  }));
  const appliedVersions = new Set(applied.map((row) => row.version));

  const missing = localVersions.filter((version) => !appliedVersions.has(version));
  const unknown = applied.filter((row) => !localVersions.includes(row.version));

  const policiesRes = await client.query(`
    select schemaname, tablename, policyname, cmd, roles::text as roles
      from pg_policies
     where schemaname = 'public'
     order by tablename, policyname
  `);

  const functionsRes = await client.query(`
    select n.nspname as schema,
           p.proname as name,
           pg_get_function_identity_arguments(p.oid) as args,
           p.prosecdef as security_definer,
           coalesce(p.proconfig, '{}'::text[]) as config
      from pg_proc p
      join pg_namespace n on n.oid = p.pronamespace
     where n.nspname = 'public'
     order by p.proname, args
  `);

  const definerWithoutSearchPath = functionsRes.rows.filter(
    (row) =>
      row.security_definer &&
      !row.config.some((entry) => entry.startsWith("search_path=")),
  );

  const snapshot = {
    generatedAt: new Date().toISOString(),
    target,
    migrations: {
      local: localVersions,
      applied,
      missing,
      unknown,
    },
    counts: {
      local: localVersions.length,
      applied: applied.length,
      policies: policiesRes.rowCount,
      functions: functionsRes.rowCount,
      definerWithoutSearchPath: definerWithoutSearchPath.length,
    },
    policies: policiesRes.rows,
    definerWithoutSearchPath,
  };

  console.log(`Destino: ${target}`);
  if (!hasMigrationTable) {
    console.log("Tabla de migraciones: no existe todavía (BD nueva; 0 aplicadas)");
  }
  console.log(`Migraciones locales: ${localVersions.length}`);
  console.log(`Migraciones aplicadas: ${applied.length}`);
  console.log(`Políticas en public: ${policiesRes.rowCount}`);
  console.log(`Funciones en public: ${functionsRes.rowCount}`);
  console.log(`SECURITY DEFINER sin search_path: ${definerWithoutSearchPath.length}`);

  if (missing.length) {
    console.error(`\nFALTAN ${missing.length} migraciones por aplicar:`);
    for (const version of missing) {
      console.error(`  ${version} · ${localFiles.find((name) => name.startsWith(version))}`);
    }
  }

  if (unknown.length) {
    console.error(`\n${unknown.length} migraciones aplicadas no existen en el repositorio:`);
    for (const row of unknown) {
      console.error(`  ${row.version} · ${row.name || "sin nombre"}`);
    }
  }

  if (definerWithoutSearchPath.length) {
    console.warn("\nFunciones SECURITY DEFINER sin search_path fijo:");
    for (const row of definerWithoutSearchPath) {
      console.warn(`  ${row.name}(${row.args})`);
    }
  }

  if (outArg) {
    const outPath = resolve(here, "..", outArg.split("=")[1]);
    writeFileSync(outPath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
    console.log(`\nInstantánea escrita: ${outPath}`);
  }

  if ((missing.length || unknown.length || definerWithoutSearchPath.length) && !allowMismatch) {
    process.exitCode = 1;
  } else {
    console.log("\nEstado consistente.");
  }
} finally {
  await client.end().catch(() => {});
}
