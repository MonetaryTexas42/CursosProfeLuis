// Restaura un respaldo JSON generado por backup-db.mjs.
//
// Uso (desde app/):
//   DATABASE_URL="$(cat .secrets/database-url)" \
//     node scripts/restore-db.mjs .backups/backup-<fecha>.json
//
// PRECAUCIÓN: reemplaza el contenido de las tablas respaldadas. Requiere la
// conexión directa (superusuario) para desactivar disparadores y claves
// foráneas durante la carga. El esquema debe existir (migraciones aplicadas).
import pg from "pg";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const backupPath = process.argv[2];
const databaseUrl = process.env.DATABASE_URL;

if (!backupPath) {
  console.error("Uso: node scripts/restore-db.mjs <backup.json>");
  process.exit(2);
}

if (!databaseUrl) {
  console.error("Falta DATABASE_URL en el entorno.");
  process.exit(2);
}

const backup = JSON.parse(readFileSync(resolve(backupPath), "utf8"));
const client = new pg.Client({ connectionString: databaseUrl });
await client.connect();

const tables = Object.entries(backup.tables);

// Tablas de sistema que no son datos y no deben restaurarse.
const SKIP = new Set(["auth.schema_migrations"]);

try {
  await client.query("begin");
  // Desactiva disparadores y validación de claves foráneas durante la carga.
  await client.query("set local session_replication_role = replica");
  await client.query("set local statement_timeout = '5min'");

  // Paso 1: vaciar todas las tablas primero (el CASCADE no importa porque
  // al final todo queda vacío antes de cargar).
  for (const [name] of tables) {
    if (SKIP.has(name)) continue;
    const [schema, table] = name.split(".");
    await client.query(`truncate table "${schema}"."${table}" cascade`);
  }
  console.log("Tablas vaciadas. Cargando datos…");

  // Paso 2: insertar las filas (el orden no importa: las claves foráneas
  // están desactivadas con session_replication_role = replica).
  for (const [name, rows] of tables) {
    if (SKIP.has(name)) {
      console.log(`  ${name}: omitida (tabla de sistema)`);
      continue;
    }

    const [schema, table] = name.split(".");
    const quoted = `"${schema}"."${table}"`;

    if (!rows.length) {
      console.log(`  ${name}: vacía`);
      continue;
    }

    // Omite columnas generadas (GENERATED ALWAYS) e identity: la base las calcula.
    const columnsRes = await client.query(
      `select column_name, is_generated, is_identity, udt_name
         from information_schema.columns
        where table_schema = $1 and table_name = $2
        order by ordinal_position`,
      [schema, table],
    );

    const columnInfo = new Map(
      columnsRes.rows.map((column) => [column.column_name, column]),
    );

    const generated = new Set(
      columnsRes.rows
        .filter((column) => column.is_generated === "ALWAYS" || column.is_identity === "YES")
        .map((column) => column.column_name),
    );

    const columns = Object.keys(rows[0]).filter((column) => !generated.has(column));
    const columnList = columns.map((column) => `"${column}"`).join(", ");

    const NUMERIC_TYPES = new Set([
      "int2", "int4", "int8", "float4", "float8", "numeric", "oid",
    ]);

    const literalFor = (column, value) => {
      if (value === null || value === undefined) return "NULL";

      const info = columnInfo.get(column);
      const udt = info?.udt_name ?? "";

      if (typeof value === "object") {
        return `'${JSON.stringify(value).replaceAll("'", "''")}'::jsonb`;
      }

      const text = String(value);

      if (NUMERIC_TYPES.has(udt)) {
        if (text.trim() === "") return "NULL";
        return `'${text.replaceAll("'", "''")}'::${udt}`;
      }

      if (udt === "bool") {
        return text === "true" ? "true" : "false";
      }

      if (udt === "inet") {
        return `'${text.replaceAll("'", "''")}'::inet`;
      }

      return `'${text.replaceAll("'", "''")}'`;
    };

    // Carga en lotes de 500 filas.
    for (let index = 0; index < rows.length; index += 500) {
      const batch = rows.slice(index, index + 500);
      const values = batch
        .map((row) => {
          const parts = columns.map((column) => literalFor(column, row[column]));
          return `(${parts.join(", ")})`;
        })
        .join(", ");

      await client.query(
        `insert into ${quoted} (${columnList}) values ${values}`,
      );
    }

    console.log(`  ${name}: ${rows.length} filas restauradas`);
  }

  await client.query("commit");
  console.log("\nRestauración completada.");
} catch (error) {
  await client.query("rollback").catch(() => {});
  console.error("FALLÓ:", error.message);
  process.exit(1);
} finally {
  await client.end().catch(() => {});
}
