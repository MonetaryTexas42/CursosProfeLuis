// Restaura los resultados de tests de un alumno desde un respaldo JSON.
//
// Reemplaza al antiguo restore-alexa-tests.mjs, que llevaba el UUID y las
// respuestas reales de una alumna escritos en el repositorio. El respaldo
// vive fuera del control de versiones (.secrets/) y este script no contiene
// datos personales.
//
// Uso (desde app/):
//   CONFIRM_RESTORE=1 RESTORE_STUDENT_ID=<uuid> \
//     node scripts/restore-student-tests.mjs [ruta-al-json]
//
// El JSON debe tener la forma:
//   { "personality": {...}, "aptitude": {...}, "career_choice": "..." }
import pg from "pg";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { PRODUCTION_REF } from "./lib/env-guard.mjs";

const here = dirname(fileURLToPath(import.meta.url));

const studentId = process.env.RESTORE_STUDENT_ID;
const backupPath =
  process.argv[2] || resolve(here, "../.secrets/restore-student-tests.json");
const databaseUrl = (
  process.env.DATABASE_URL ||
  readFileSync(resolve(here, "../.secrets/database-url"), "utf8")
).trim();

if (!studentId) {
  console.error("Falta RESTORE_STUDENT_ID (UUID del alumno a restaurar).");
  process.exit(2);
}

if (process.env.CONFIRM_RESTORE !== "1") {
  console.error(
    "Esta operación sobrescribe datos. Vuelve a ejecutar con CONFIRM_RESTORE=1.",
  );
  process.exit(2);
}

// Conexión directa (db.<ref>.supabase.co) o pooler (postgres.<ref>@...).
const refMatch =
  databaseUrl.match(/@(?:db\.)?([a-z0-9]{20})\.supabase\.(?:com|co)/i) ||
  databaseUrl.match(/\/\/(?:postgres|pgbouncer)\.([a-z0-9]{20}):/i);
const targetRef = refMatch ? refMatch[1].toLowerCase() : "desconocido";
console.log(`Destino: proyecto ${targetRef}`);
if (targetRef === PRODUCTION_REF && process.env.ALLOW_PRODUCTION_RESTORE !== "1") {
  console.error(
    "El destino es producción. Si es intencional, añade ALLOW_PRODUCTION_RESTORE=1.",
  );
  process.exit(2);
}

const backup = JSON.parse(readFileSync(backupPath, "utf8"));
if (!backup?.personality && !backup?.aptitude) {
  console.error(`El respaldo ${backupPath} no contiene datos de tests.`);
  process.exit(2);
}

// --- Extrae careerCatalog de src/ui/app.js y lo evalúa ---
const appSource = readFileSync(resolve(here, "../frontend/src/ui/app.js"), "utf8");
const start = appSource.indexOf("const careerCatalog = [");
const end = appSource.indexOf("];", start) + 1;
if (start < 0 || end <= start) {
  console.error("No se encontró careerCatalog en frontend/src/ui/app.js.");
  process.exit(2);
}
const raw = appSource.slice(start, end).replace("const careerCatalog = ", "");
const js = raw
  .replace(/([{,]\s*)([a-zA-Z_]+)\s*:/g, '$1"$2":')
  .replace(/'/g, '"');
const careerCatalog = JSON.parse(js);

// --- Recalcula las carreras sugeridas con la misma fórmula del test ---
const tags = backup.aptitude?.tags || [];
const tagSet = new Set(tags);

const tagFrequency = {};
for (const career of careerCatalog) {
  for (const tag of career.tags) {
    tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
  }
}

const scored = careerCatalog
  .map((career) => {
    const matches = career.tags.filter((tag) => tagSet.has(tag));
    const weight = matches.reduce((sum, tag) => sum + 1 / tagFrequency[tag], 0);
    return { name: career.name, matches, weight };
  })
  .filter((career) => career.matches.length > 0)
  .sort((a, b) => b.weight - a.weight || a.name.localeCompare(b.name));

const top = scored.slice(0, 8);
const maxWeight = top[0]?.weight || 1;
const careerSuggestions = top.map((career) => ({
  name: career.name,
  score: Math.round((career.weight / maxWeight) * 100),
  matches: career.matches,
}));

const aptitude = {
  ...(backup.aptitude || {}),
  career_suggestions: careerSuggestions,
};
const interests = [...new Set(aptitude.interests || [])];

const client = new pg.Client({ connectionString: databaseUrl });
await client.connect();

const result = await client.query(
  `update public.student_profiles
      set personality = $1::jsonb,
          aptitude = $2::jsonb,
          interests = $3::text[],
          aptitudes = $4::text[],
          career_suggestions = $5::jsonb,
          career_choice = $6,
          updated_at = now()
    where student_id = $7`,
  [
    JSON.stringify(backup.personality || {}),
    JSON.stringify(aptitude),
    interests,
    aptitude.aptitudes || [],
    JSON.stringify(careerSuggestions),
    backup.career_choice || aptitude.career_choice || null,
    studentId,
  ],
);

if (result.rowCount === 0) {
  console.error("No se actualizó ninguna fila: revisa el UUID del alumno.");
  await client.end();
  process.exit(1);
}

const check = await client.query(
  `select personality->'scores' as scores,
          aptitude->'career_suggestions' as cs,
          interests,
          career_choice
     from public.student_profiles
    where student_id = $1`,
  [studentId],
);
console.log("Restaurado.");
console.log("  scores:", JSON.stringify(check.rows[0].scores));
console.log(
  "  carreras:",
  JSON.stringify((check.rows[0].cs || []).map((c) => `${c.name}:${c.score}`)),
);
console.log(
  "  intereses:",
  check.rows[0].interests.length,
  "· career_choice:",
  check.rows[0].career_choice,
);
await client.end();
