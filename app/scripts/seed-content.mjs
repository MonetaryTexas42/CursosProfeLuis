// Siembra el contenido extraído (supabase/seed/content-v1.json) en la base.
//
// Uso (desde app/):
//   DATABASE_URL="$(cat .secrets/database-url)" node scripts/seed-content.mjs
//
// Idempotente: se puede ejecutar varias veces. Publica la versión 1 de las
// unidades de las materias listas y deja desactivadas las 7 materias vacías.
// No crea asignaciones: el profesor activa unidades desde su panel.
import pg from "pg";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const here = dirname(fileURLToPath(import.meta.url));
const contentPath = resolve(here, "../supabase/seed/content-v1.json");
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("Falta DATABASE_URL en el entorno.");
  process.exit(2);
}

const payload = JSON.parse(readFileSync(contentPath, "utf8"));

const client = new pg.Client({ connectionString: databaseUrl });
await client.connect();

try {
  await client.query("begin");

  const adminRes = await client.query(
    "select id from public.profiles where role = 'admin' order by created_at limit 1",
  );
  const adminId = adminRes.rows[0]?.id ?? null;

  let subjectsUpserted = 0;
  for (const subject of payload.subjects) {
    await client.query(
      `insert into public.subjects (id, name, short, color, icon, badge, sort_order, active)
       values ($1, $2, $3, $4, $5, $6, $7, $8)
       on conflict (id) do update set
         name = excluded.name,
         short = excluded.short,
         color = excluded.color,
         icon = excluded.icon,
         badge = excluded.badge,
         sort_order = excluded.sort_order,
         active = excluded.active`,
      [
        subject.id,
        subject.name,
        subject.short,
        subject.color,
        subject.icon,
        subject.badge,
        subject.sortOrder,
        subject.ready,
      ],
    );
    subjectsUpserted += 1;
  }

  let unitsUpserted = 0;
  let versionsUpserted = 0;

  for (const unit of payload.units) {
    const contentJson = JSON.stringify(unit.content);
    const checksum = createHash("sha256").update(contentJson).digest("hex");

    const unitRes = await client.query(
      `insert into public.units (subject_id, num, title, status, sort_order, estimated_minutes, created_by)
       values ($1, $2, $3, $4, $5, $6, $7)
       on conflict (subject_id, num) do update set
         title = excluded.title,
         status = excluded.status,
         sort_order = excluded.sort_order,
         estimated_minutes = excluded.estimated_minutes,
         updated_at = now()
       returning id`,
      [
        unit.subjectId,
        unit.num,
        unit.title,
        unit.status,
        unit.num,
        unit.estimatedMinutes,
        adminId,
      ],
    );

    const unitId = unitRes.rows[0].id;

    await client.query(
      `insert into public.unit_versions (unit_id, version, content, checksum, published_at, published_by, created_by)
       values ($1, 1, $2::jsonb, $3, now(), $4, $4)
       on conflict (unit_id, version) do update set
         content = excluded.content,
         checksum = excluded.checksum,
         published_at = excluded.published_at,
         published_by = excluded.published_by`,
      [unitId, contentJson, checksum, adminId],
    );

    unitsUpserted += 1;
    versionsUpserted += 1;
  }

  await client.query("commit");

  // Versión del aviso de privacidad vigente (la usa el flujo de consentimiento).
  await client.query(
    `insert into public.settings (key, value, updated_by)
     values ('privacy_document_version', '"v1-2026"'::jsonb, $1)
     on conflict (key) do nothing`,
    [adminId],
  );

  const counts = await client.query(`
    select
      (select count(*) from public.subjects) as subjects,
      (select count(*) from public.subjects where active) as subjects_active,
      (select count(*) from public.units) as units,
      (select count(*) from public.units where status = 'published') as units_published,
      (select count(*) from public.unit_versions) as versions,
      (select coalesce(sum(jsonb_array_length(content -> 'exercises')), 0)
         from public.unit_versions) as exercises_in_versions
  `);

  const totalExercises = payload.units.reduce(
    (sum, unit) => sum + unit.content.exercises.length,
    0,
  );

  console.log("Contenido sembrado:");
  console.log(`  materias: ${counts.rows[0].subjects} (${counts.rows[0].subjects_active} activas)`);
  console.log(`  unidades: ${counts.rows[0].units} (${counts.rows[0].units_published} publicadas)`);
  console.log(`  versiones: ${counts.rows[0].versions}`);
  console.log(`  ejercicios en la base: ${counts.rows[0].exercises_in_versions} (esperados: ${totalExercises})`);

  if (Number(counts.rows[0].exercises_in_versions) !== totalExercises) {
    console.error("MISMATCH: la suma de ejercicios en versiones no coincide.");
    process.exit(1);
  }

  console.log("\nSeed OK.");
} catch (error) {
  await client.query("rollback").catch(() => {});
  console.error("FALLÓ:", error.message);
  process.exit(1);
} finally {
  await client.end().catch(() => {});
}
