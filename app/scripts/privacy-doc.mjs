// Huella del aviso de privacidad (PRIV-01).
//
// El consentimiento debe guardar la versión, la URL y el hash SHA-256 del
// texto que la familia leyó. El texto vive en frontend/public/privacidad.html
// y su huella se publica en supabase/seed/privacy-document.json.
//
// Uso (desde app/):
//   node scripts/privacy-doc.mjs            # muestra versión y hash
//   node scripts/privacy-doc.mjs --write    # actualiza el manifiesto
//   node scripts/privacy-doc.mjs --check    # falla si el manifiesto no coincide
//
// Después de cambiar el texto hay que subir la versión, ejecutar --write y
// actualizar la migración 0027 (o la migración vigente) con los nuevos valores.

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const htmlPath = resolve(here, "../frontend/public/privacidad.html");
const manifestPath = resolve(here, "../supabase/seed/privacy-document.json");

function metaContent(html, name) {
  const pattern = new RegExp(
    `<meta\\s+name=["']${name}["']\\s+content=["']([^"']+)["']`,
    "i",
  );
  return html.match(pattern)?.[1] ?? null;
}

const html = readFileSync(htmlPath, "utf8");
const version = metaContent(html, "privacy-version");
const url = metaContent(html, "privacy-url");

if (!version) {
  console.error("Falta <meta name=\"privacy-version\"> en privacidad.html");
  process.exit(1);
}

if (!url) {
  console.error("Falta <meta name=\"privacy-url\"> en privacidad.html");
  process.exit(1);
}

const sha256 = createHash("sha256").update(html, "utf8").digest("hex");
const manifest = `${JSON.stringify({ version, url, sha256 }, null, 2)}\n`;

if (process.argv.includes("--check")) {
  let current = "";
  try {
    current = readFileSync(manifestPath, "utf8");
  } catch {
    console.error("No existe supabase/seed/privacy-document.json");
    process.exit(1);
  }

  if (current !== manifest) {
    console.error("El manifiesto del aviso no coincide con privacidad.html.");
    console.error("Ejecuta: node scripts/privacy-doc.mjs --write");
    process.exit(1);
  }

  console.log(`Aviso ${version} · ${sha256}`);
  process.exit(0);
}

if (process.argv.includes("--write")) {
  writeFileSync(manifestPath, manifest);
  console.log(`Manifiesto actualizado: ${manifestPath}`);
}

console.log(`version=${version}`);
console.log(`url=${url}`);
console.log(`sha256=${sha256}`);
