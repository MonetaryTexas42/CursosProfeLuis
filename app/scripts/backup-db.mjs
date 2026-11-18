// Respaldo cifrado de la base remota (PRIV-05 / OPS-01).
//
// Uso (desde app/):
//   DATABASE_URL="$(cat .secrets/database-url)" node scripts/backup-db.mjs
//
// Qué hace:
//   1. Lee las tablas de `public` (por defecto NO toca `auth`, que contiene
//      usuarios, sesiones y tokens; Supabase ya respalda Auth).
//   2. Cifra el JSON en origen con AES-256-GCM antes de escribirlo.
//   3. Deja el archivo en `.backups/` con permisos 600 y la carpeta 700.
//   4. Guarda el SHA-256 del contenido y un registro en `.backups/backup.log`.
//   5. Borra respaldos con más de 30 días.
//
// Llave:
//   - `BACKUP_KEY` (32 bytes en hex) o `BACKUP_KEY_FILE`
//     (por defecto `.secrets/backup.key`).
//   - Si no existe, se crea una llave nueva y se avisa. Sin esa llave no se
//     puede restaurar: guárdala fuera del repositorio.
//
// Opciones:
//   --no-encrypt        Solo con ALLOW_PLAINTEXT_BACKUP=1. Para diagnóstico local.
//   --include-auth      Solo con ALLOW_AUTH_BACKUP=1. Incluye el esquema auth.
//   --out-dir=<ruta>    Carpeta destino (por defecto `.backups`).
//
// El esquema se reproduce con las migraciones; este archivo contiene datos.
import pg from "pg";
import {
  appendFileSync,
  chmodSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { createCipheriv, createHash, randomBytes } from "node:crypto";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const databaseUrl = process.env.DATABASE_URL;
const RETENTION_DAYS = 30;

if (!databaseUrl) {
  console.error("Falta DATABASE_URL en el entorno.");
  process.exit(2);
}

const args = new Set(process.argv.slice(2));
const includeAuth = args.has("--include-auth");
const noEncrypt = args.has("--no-encrypt");
const outDirArg = [...args].find((arg) => arg.startsWith("--out-dir="));
const outDir = resolve(here, outDirArg ? outDirArg.split("=")[1] : "../.backups");
const keyFile = resolve(
  here,
  process.env.BACKUP_KEY_FILE || "../.secrets/backup.key",
);

if (noEncrypt && process.env.ALLOW_PLAINTEXT_BACKUP !== "1") {
  console.error(
    "El respaldo sin cifrar está bloqueado. Añade ALLOW_PLAINTEXT_BACKUP=1 solo para un diagnóstico local.",
  );
  process.exit(2);
}

if (includeAuth && process.env.ALLOW_AUTH_BACKUP !== "1") {
  console.error(
    "Incluir `auth` expone usuarios, sesiones y tokens. Si es imprescindible, añade ALLOW_AUTH_BACKUP=1.",
  );
  process.exit(2);
}

function targetRef(url) {
  const match =
    String(url).match(/@(?:db\.)?([a-z0-9]{20})\.supabase\.(?:com|co)/i) ||
    String(url).match(/\/\/(?:postgres|pgbouncer)\.([a-z0-9]{20}):/i);
  return match ? match[1].toLowerCase() : "desconocido";
}

function loadKey() {
  if (process.env.BACKUP_KEY) {
    const key = Buffer.from(process.env.BACKUP_KEY.trim(), "hex");
    if (key.length !== 32) {
      console.error("BACKUP_KEY debe tener 32 bytes en hexadecimal (64 caracteres).");
      process.exit(2);
    }
    return key;
  }

  if (existsSync(keyFile)) {
    const key = Buffer.from(readFileSync(keyFile, "utf8").trim(), "hex");
    if (key.length !== 32) {
      console.error(`La llave ${keyFile} no tiene 32 bytes en hexadecimal.`);
      process.exit(2);
    }
    return key;
  }

  mkdirSync(dirname(keyFile), { recursive: true, mode: 0o700 });
  const key = randomBytes(32);
  writeFileSync(keyFile, `${key.toString("hex")}\n`, { mode: 0o600 });
  chmodSync(keyFile, 0o600);
  console.warn(`\nSe creó una llave nueva en ${keyFile}`);
  console.warn("Guárdala fuera del repositorio. Sin ella no se puede restaurar.\n");
  return key;
}

function encrypt(plaintext, key) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return JSON.stringify({
    format: "ecoems-backup-v1",
    alg: "aes-256-gcm",
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
    ciphertext: ciphertext.toString("base64"),
  });
}

function prune(outDir) {
  const cutoff = Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000;
  let removed = 0;
  for (const name of readdirSync(outDir)) {
    if (!/^backup-.*\.(json|json\.enc|sha256)$/.test(name)) continue;
    const path = resolve(outDir, name);
    try {
      if (statSync(path).mtimeMs < cutoff) {
        unlinkSync(path);
        removed += 1;
      }
    } catch {
      // Un archivo que desapareció entre la lectura y el borrado no es un error.
    }
  }
  return removed;
}

const client = new pg.Client({ connectionString: databaseUrl, statement_timeout: 120000 });
await client.connect();

try {
  const schemas = includeAuth ? ["public", "auth"] : ["public"];
  const tablesRes = await client.query(
    `select schemaname, tablename
       from pg_tables
      where schemaname = any($1::text[])
      order by schemaname, tablename`,
    [schemas],
  );

  const backup = {
    format: "ecoems-backup-v1",
    generatedAt: new Date().toISOString(),
    source: { ref: targetRef(databaseUrl), schemas },
    excluded: includeAuth ? [] : ["auth"],
    counts: {},
    tables: {},
  };

  for (const { schemaname, tablename } of tablesRes.rows) {
    if (schemaname === "auth" && tablename === "schema_migrations") continue;
    const quoted = `"${schemaname}"."${tablename}"`;
    const rowsRes = await client.query(
      `select coalesce(jsonb_agg(to_jsonb(t)), '[]'::jsonb) as data from ${quoted} t`,
    );
    const rows = rowsRes.rows[0].data;
    backup.tables[`${schemaname}.${tablename}`] = rows;
    backup.counts[`${schemaname}.${tablename}`] = rows.length;
    console.log(`  ${schemaname}.${tablename}: ${rows.length} filas`);
  }

  const plaintext = JSON.stringify(backup);
  const sha256 = createHash("sha256").update(plaintext, "utf8").digest("hex");
  const stamp = new Date().toISOString().replace(/[:T]/g, "-").slice(0, 19);
  const baseName = `backup-${stamp}`;
  mkdirSync(outDir, { recursive: true, mode: 0o700 });
  chmodSync(outDir, 0o700);

  let outPath;
  let fileSha;
  if (noEncrypt) {
    outPath = resolve(outDir, `${baseName}.json`);
    writeFileSync(outPath, plaintext, { mode: 0o600 });
    fileSha = sha256;
    console.warn("AVISO: respaldo SIN cifrar (solo diagnóstico local).");
  } else {
    const encrypted = encrypt(plaintext, loadKey());
    outPath = resolve(outDir, `${baseName}.json.enc`);
    writeFileSync(outPath, encrypted, { mode: 0o600 });
    fileSha = createHash("sha256").update(encrypted, "utf8").digest("hex");
  }
  chmodSync(outPath, 0o600);

  const checksumPath = `${outPath}.sha256`;
  writeFileSync(checksumPath, `${fileSha}  ${outPath.split("/").pop()}\n`, { mode: 0o600 });
  chmodSync(checksumPath, 0o600);

  const removed = prune(outDir);
  appendFileSync(
    resolve(outDir, "backup.log"),
    `${new Date().toISOString()}\t${outPath.split("/").pop()}\tencrypted=${!noEncrypt}\t` +
      `plaintext_sha256=${sha256}\tfile_sha256=${fileSha}\t` +
      `tables=${Object.keys(backup.tables).length}\tpruned=${removed}\n`,
    { mode: 0o600 },
  );
  chmodSync(resolve(outDir, "backup.log"), 0o600);

  console.log(`\nRespaldo escrito: ${outPath}`);
  console.log(`SHA-256 del contenido: ${sha256}`);
  console.log(`SHA-256 del archivo:   ${fileSha}`);
  console.log(`Respaldos eliminados por retención (${RETENTION_DAYS} días): ${removed}`);
} finally {
  await client.end().catch(() => {});
}
