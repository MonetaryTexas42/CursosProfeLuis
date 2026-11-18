// Restauración segura de un respaldo generado por backup-db.mjs (OPS-02).
//
// Uso (desde app/):
//   DATABASE_URL="$(cat .secrets/staging-database-url)" \
//     node scripts/restore-db.mjs .backups/backup-<fecha>.json.enc --confirm=restore
//
// Reglas de seguridad:
//   1. Sin `--confirm=restore` no hace nada.
//   2. Si el destino es producción, aborta salvo que se añada `--i-know`.
//   3. Antes de tocar nada genera un respaldo cifrado del estado actual.
//   4. Valida el archivo, el checksum lateral y que las tablas existan.
//   5. Restaura dentro de una transacción y deja un registro en
//      `.backups/restore.log`.
//
// `--skip-prebackup` existe solo para una emergencia documentada; sin respaldo
// previo no hay forma de deshacer una restauración equivocada.
//
// PRECAUCIÓN: reemplaza el contenido de las tablas incluidas en el respaldo.
// Requiere conexión directa (superusuario) para desactivar disparadores y
// claves foráneas durante la carga.
import pg from "pg";
import { spawnSync } from "node:child_process";
import { createDecipheriv, createHash } from "node:crypto";
import {
  appendFileSync,
  chmodSync,
  existsSync,
  mkdirSync,
  readFileSync,
} from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { PRODUCTION_REF } from "./lib/env-guard.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const backupPath = args.find((arg) => !arg.startsWith("--"));
const databaseUrl = process.env.DATABASE_URL;
const confirm = args.find((arg) => arg.startsWith("--confirm="))?.split("=")[1];
const iKnow = args.includes("--i-know");
const skipPrebackup = args.includes("--skip-prebackup");
const keyFile = resolve(
  here,
  process.env.BACKUP_KEY_FILE || "../.secrets/backup.key",
);

function fail(message) {
  console.error(`\nBLOQUEADO · ${message}\nNo se escribió nada.\n`);
  process.exit(2);
}

if (!backupPath) {
  fail("Uso: node scripts/restore-db.mjs <backup.json|backup.json.enc> --confirm=restore");
}

if (confirm !== "restore") {
  fail("Esta operación sobrescribe datos. Vuelve a ejecutar con --confirm=restore.");
}

if (!databaseUrl) {
  fail("Falta DATABASE_URL en el entorno.");
}

function targetRef(url) {
  const match =
    String(url).match(/@(?:db\.)?([a-z0-9]{20})\.supabase\.(?:com|co)/i) ||
    String(url).match(/\/\/(?:postgres|pgbouncer)\.([a-z0-9]{20}):/i);
  return match ? match[1].toLowerCase() : "desconocido";
}

const target = targetRef(databaseUrl);
console.log(`Destino: proyecto ${target}`);
if (target === PRODUCTION_REF && !iKnow) {
  fail(
    "El destino es PRODUCCIÓN. Si de verdad quieres restaurar ahí, añade --i-know " +
      "y ten a mano el respaldo previo.",
  );
}

function loadKey() {
  if (process.env.BACKUP_KEY) {
    const key = Buffer.from(process.env.BACKUP_KEY.trim(), "hex");
    if (key.length !== 32) fail("BACKUP_KEY debe tener 32 bytes en hexadecimal.");
    return key;
  }
  if (!existsSync(keyFile)) {
    fail(`No existe la llave ${keyFile}. Sin ella no se puede descifrar el respaldo.`);
  }
  const key = Buffer.from(readFileSync(keyFile, "utf8").trim(), "hex");
  if (key.length !== 32) fail(`La llave ${keyFile} no tiene 32 bytes en hexadecimal.`);
  return key;
}

function readBackup(path) {
  const text = readFileSync(path, "utf8");
  if (!path.endsWith(".enc")) {
    console.warn("AVISO: el respaldo no está cifrado. Verifica su origen antes de continuar.");
    return text;
  }

  let envelope;
  try {
    envelope = JSON.parse(text);
  } catch {
    fail("El archivo cifrado no tiene el formato esperado.");
  }

  if (envelope.format !== "ecoems-backup-v1" || envelope.alg !== "aes-256-gcm") {
    fail("Formato de respaldo desconocido.");
  }

  try {
    const decipher = createDecipheriv(
      "aes-256-gcm",
      loadKey(),
      Buffer.from(envelope.iv, "base64"),
    );
    decipher.setAuthTag(Buffer.from(envelope.tag, "base64"));
    return Buffer.concat([
      decipher.update(Buffer.from(envelope.ciphertext, "base64")),
      decipher.final(),
    ]).toString("utf8");
  } catch {
    fail("No se pudo descifrar o verificar el respaldo. ¿Llave incorrecta o archivo alterado?");
  }
}

const absoluteBackup = resolve(backupPath);

// 1) Checksum lateral del archivo (si existe).
const sidecar = `${absoluteBackup}.sha256`;
if (existsSync(sidecar)) {
  const expected = readFileSync(sidecar, "utf8").trim().split(/\s+/)[0];
  const actual = createHash("sha256").update(readFileSync(absoluteBackup)).digest("hex");
  if (expected !== actual) {
    fail(`El checksum del archivo no coincide (esperado ${expected}, obtenido ${actual}).`);
  }
  console.log("Checksum del archivo: OK");
}

// 2) Descifrado y validación estructural.
let backup;
try {
  backup = JSON.parse(readBackup(absoluteBackup));
} catch (error) {
  fail(`No se pudo leer el respaldo: ${error.message}`);
}

if (!backup || typeof backup.tables !== "object" || !backup.tables) {
  fail("El respaldo no contiene un objeto `tables`.");
}

const entries = Object.entries(backup.tables);
if (!entries.length) fail("El respaldo no contiene tablas.");

for (const [name, rows] of entries) {
  if (!/^[a-z_]+\.[a-z0-9_]+$/i.test(name)) fail(`Nombre de tabla inválido: ${name}`);
  if (!Array.isArray(rows)) fail(`La tabla ${name} no es una lista de filas.`);
  if (backup.counts?.[name] != null && backup.counts[name] !== rows.length) {
    fail(`Conteo inconsistente en ${name}: ${backup.counts[name]} declarado, ${rows.length} leído.`);
  }
}

if (!skipPrebackup) {
  console.log("Generando respaldo previo del estado actual…");
  const result = spawnSync(process.execPath, [resolve(here, "backup-db.mjs")], {
    env: process.env,
    stdio: "inherit",
  });
  if (result.status !== 0) {
    fail("Falló el respaldo previo. Restauración cancelada.");
  }
} else {
  console.warn("AVISO: --skip-prebackup. No habrá respaldo del estado actual.");
}

const client = new pg.Client({ connectionString: databaseUrl });
await client.connect();

const SKIP = new Set(["auth.schema_migrations"]);

try {
  // 3) Validar que las tablas existan antes de abrir la transacción.
  for (const [name] of entries) {
    if (SKIP.has(name)) continue;
    const [schema, table] = name.split(".");
    const exists = await client.query(
      `select 1 from information_schema.tables
        where table_schema = $1 and table_name = $2`,
      [schema, table],
    );
    if (!exists.rowCount) {
      fail(`La tabla ${name} no existe en el destino. Aplica las migraciones antes de restaurar.`);
    }
  }

  await client.query("begin");
  await client.query("set local session_replication_role = replica");
  await client.query("set local statement_timeout = '10min'");

  // 4) Vaciar y cargar. El orden no importa: las claves foráneas están
  //    desactivadas y todo se vacía antes de insertar.
  for (const [name] of entries) {
    if (SKIP.has(name)) continue;
    const [schema, table] = name.split(".");
    await client.query(`truncate table "${schema}"."${table}" cascade`);
  }
  console.log("Tablas vaciadas. Cargando datos…");

  for (const [name, rows] of entries) {
    if (SKIP.has(name)) {
      console.log(`  ${name}: omitida (tabla de sistema)`);
      continue;
    }
    if (!rows.length) {
      console.log(`  ${name}: vacía`);
      continue;
    }

    const [schema, table] = name.split(".");
    const quoted = `"${schema}"."${table}"`;

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
      if (udt === "bool") return text === "true" ? "true" : "false";
      if (udt === "inet") return `'${text.replaceAll("'", "''")}'::inet`;
      return `'${text.replaceAll("'", "''")}'`;
    };

    for (let index = 0; index < rows.length; index += 500) {
      const batch = rows.slice(index, index + 500);
      const values = batch
        .map((row) => `(${columns.map((column) => literalFor(column, row[column])).join(", ")})`)
        .join(", ");
      await client.query(`insert into ${quoted} (${columnList}) values ${values}`);
    }

    console.log(`  ${name}: ${rows.length} filas restauradas`);
  }

  await client.query("commit");

  const logDir = dirname(absoluteBackup);
  mkdirSync(logDir, { recursive: true, mode: 0o700 });
  appendFileSync(
    resolve(logDir, "restore.log"),
    `${new Date().toISOString()}\t${absoluteBackup.split("/").pop()}\t` +
      `target=${target}\tby=${process.env.USER || "desconocido"}\t` +
      `tables=${entries.length}\t` +
      `rows=${entries.reduce((sum, [, rows]) => sum + rows.length, 0)}\n`,
    { mode: 0o600 },
  );
  chmodSync(resolve(logDir, "restore.log"), 0o600);

  console.log("\nRestauración completada y registrada en restore.log.");
} catch (error) {
  await client.query("rollback").catch(() => {});
  console.error("FALLÓ:", error.message);
  process.exit(1);
} finally {
  await client.end().catch(() => {});
}
