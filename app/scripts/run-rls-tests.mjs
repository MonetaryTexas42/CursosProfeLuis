// Runner de la suite de RLS negativa (COD-07).
//
// Uso (desde app/):
//   DATABASE_URL="$(cat .secrets/staging-database-url)" node scripts/run-rls-tests.mjs
//
// Requisitos:
// - Conexión directa a un entorno AISLADO (staging o réplica local).
//   El runner es de solo lectura, pero no debe apuntarse a producción por
//   costumbre: las pruebas de identidad necesitan usuarios ficticios.
// - Aborta si detecta el ref de producción. `--allow-production` lo permite
//   explícitamente para un diagnóstico de solo lectura.
// - Usuarios ficticios por rol (ver app/docs/staging.md).
//
// Qué hace:
// 1. Descubre identidades reales por rol (admin, profesor, alumno con y sin
//    asignación, tutor vinculado y sin vínculos).
// 2. Verifica que el JWT simulado resuelva a la identidad correcta. Si no,
//    marca ese rol como SKIP para no producir falsos PASS.
// 3. Ejecuta cada prueba en su propia transacción con `set local role` y
//    `request.jwt.claims`, y hace rollback siempre.
// 4. Sale con código 1 si alguna prueba falla.

import pg from "pg";
import { checks, roleSanity } from "../supabase/tests/rls/rls-negative.mjs";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("Falta DATABASE_URL en el entorno.");
  process.exit(2);
}

// Guard de producción: la suite es de solo lectura, pero no debe descubrir ni
// imprimir identidades reales. Se permite explícitamente con --allow-production.
const PROD_REF = "ioikcrdxneuydylyhvwi";
const allowProduction = process.argv.includes("--allow-production");
const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? "";

function refFromDatabaseUrl(url) {
  const host = url.match(/@(?:db\.)?([a-z0-9]{20})\.supabase\.(?:com|co)/i);
  if (host) return host[1].toLowerCase();
  const user = url.match(/\/\/(?:postgres|pgbouncer)\.([a-z0-9]{20}):/i);
  return user ? user[1].toLowerCase() : null;
}

function refFromSupabaseUrl(url) {
  const match = url.match(/^https?:\/\/([a-z0-9]{20})\.supabase\.co/i);
  return match ? match[1].toLowerCase() : null;
}

const refs = [refFromDatabaseUrl(databaseUrl), refFromSupabaseUrl(supabaseUrl)].filter(Boolean);
const isProduction = refs.includes(PROD_REF);
const isLocal =
  /(?:localhost|127\.0\.0\.1)/i.test(databaseUrl) || /(?:localhost|127\.0\.0\.1)/i.test(supabaseUrl);

if (isProduction && !allowProduction) {
  console.error("ABORTADO: la suite apunta al proyecto de producción (" + PROD_REF + ").");
  console.error("Usa staging. Si de verdad necesitas un diagnóstico de solo lectura,");
  console.error("vuelve a ejecutar con --allow-production.");
  process.exit(2);
}

if (!isProduction && refs.length === 0 && !isLocal) {
  console.warn(
    "Aviso: no se pudo identificar el proyecto por la URL. Verifica manualmente que NO sea producción.",
  );
}

const ACTIVE_ASSIGNMENT = `
  exists (
    select 1
      from public.unit_assignments a
      join public.units u on u.id = a.unit_id
      join public.unit_versions v on v.id = a.unit_version_id and v.unit_id = a.unit_id
      left join public.student_unit_overrides o
        on o.assignment_id = a.id and o.student_id = s.id
     where a.group_id = s.group_id
       and a.visible
       and a.status in ('active'::public.assignment_status, 'closed'::public.assignment_status)
       and coalesce(o.status, a.status) = 'active'::public.assignment_status
       and u.status = 'published'::public.unit_status
       and v.published_at is not null
       and (coalesce(o.opens_at, a.opens_at) is null or coalesce(o.opens_at, a.opens_at) <= now())
       and (coalesce(o.closes_at, a.closes_at) is null or coalesce(o.closes_at, a.closes_at) > now())
  )`;

const client = new pg.Client({ connectionString: databaseUrl });

async function one(sql, params = []) {
  const res = await client.query(sql, params);
  return res.rows[0] ?? null;
}

async function discoverFixtures() {
  const f = {};

  f.admin = (await one(`
    select p.id
      from public.profiles p
     where p.role = 'admin'::public.user_role and p.active
     order by p.created_at, p.id
     limit 1`))?.id ?? null;

  f.teacher = (await one(`
    select p.id
      from public.profiles p
     where p.role = 'teacher'::public.user_role and p.active
       and exists (
         select 1 from public.groups g
           join public.students s on s.group_id = g.id
          where g.teacher_id = p.id
       )
     order by p.created_at, p.id
     limit 1`))?.id ?? null;

  if (!f.teacher) {
    f.teacher = (await one(`
      select p.id from public.profiles p
       where p.role = 'teacher'::public.user_role and p.active
       order by p.created_at, p.id limit 1`))?.id ?? null;
  }

  const student1 = await one(`
    select s.profile_id, s.id as student_id, s.group_id
      from public.students s
     where s.status = 'active'::public.student_status
       and ${ACTIVE_ASSIGNMENT}
     order by s.created_at, s.id
     limit 1`);

  f.student1 = student1?.profile_id ?? null;
  f.student1_id = student1?.student_id ?? null;
  f.student1_group = student1?.group_id ?? null;

  const student2 = await one(
    `
    select s.profile_id, s.id as student_id, s.group_id
      from public.students s
     where s.status = 'active'::public.student_status
       and ($1::uuid is null or s.id <> $1::uuid)
       and not ${ACTIVE_ASSIGNMENT}
     order by s.created_at, s.id
     limit 1`,
    [f.student1_id],
  );

  f.student2 = student2?.profile_id ?? null;
  f.student2_id = student2?.student_id ?? null;
  f.student2_group = student2?.group_id ?? null;

  f.teacher_other = (await one(
    `
    select p.id
      from public.profiles p
     where p.role = 'teacher'::public.user_role and p.active
       and ($1::uuid is null or p.id <> $1::uuid)
       and ($2::uuid is null or not exists (
         select 1 from public.groups g
          where g.teacher_id = p.id and g.id = $2::uuid
       ))
     order by p.created_at, p.id
     limit 1`,
    [f.teacher, f.student1_group],
  ))?.id ?? null;

  if (f.student1_id) {
    const guardian1 = await one(
      `
      select g.profile_id, g.id as guardian_id
        from public.guardians g
        join public.student_guardians sg on sg.guardian_id = g.id
       where g.active and g.profile_id is not null
         and sg.student_id = $1::uuid
         and not exists (
           select 1
             from public.privacy_consents pc
            where pc.guardian_id = g.id
              and pc.revoked_at is null
              and pc.document_version = coalesce(
                (select value #>> '{}' from public.settings
                  where key = 'privacy_document_version'),
                ''
              )
         )
       order by g.created_at, g.id
       limit 1`,
      [f.student1_id],
    );
    f.guardian1 = guardian1?.profile_id ?? null;
    f.guardian1_id = guardian1?.guardian_id ?? null;
  } else {
    f.guardian1 = null;
    f.guardian1_id = null;
  }

  const guardian2 = await one(`
    select g.profile_id, g.id as guardian_id
      from public.guardians g
     where g.active and g.profile_id is not null
       and not exists (select 1 from public.student_guardians sg where sg.guardian_id = g.id)
     order by g.created_at, g.id
     limit 1`);
  f.guardian2 = guardian2?.profile_id ?? null;
  f.guardian2_id = guardian2?.guardian_id ?? null;

  // PRIV-01: tutor con consentimiento vigente para al menos un alumno.
  const guardian3 = await one(`
    select g.profile_id, g.id as guardian_id
      from public.guardians g
      join public.privacy_consents pc on pc.guardian_id = g.id
     where g.active and g.profile_id is not null
       and pc.revoked_at is null
       and pc.document_version = coalesce(
         (select value #>> '{}' from public.settings where key = 'privacy_document_version'),
         ''
       )
     order by g.created_at, g.id
     limit 1`);
  f.guardian3 = guardian3?.profile_id ?? null;
  f.guardian3_id = guardian3?.guardian_id ?? null;

  return f;
}

const profileByRole = (f, role) => {
  switch (role) {
    case "admin": return f.admin;
    case "teacher": return f.teacher;
    case "teacher_other": return f.teacher_other;
    case "student1": return f.student1;
    case "student2": return f.student2;
    case "guardian1": return f.guardian1;
    case "guardian2": return f.guardian2;
    case "guardian3": return f.guardian3;
    default: return null;
  }
};

async function runAs(role, profileId, sql, params = []) {
  const dbRole = role === "anon" ? "anon" : "authenticated";
  await client.query("begin");
  try {
    if (role === "anon") {
      await client.query("select set_config('request.jwt.claim.sub', '', true), set_config('request.jwt.claims', '{}', true)");
    } else {
      await client.query(
        "select set_config('request.jwt.claim.sub', $1, true), set_config('request.jwt.claims', $2, true)",
        [profileId, JSON.stringify({ sub: profileId, role: "authenticated" })],
      );
    }
    await client.query(`set local role ${dbRole}`);
    const res = await client.query(sql, params);
    return res.rows[0] ? Object.values(res.rows[0])[0] : null;
  } finally {
    await client.query("rollback").catch(() => {});
  }
}

function matches(actual, expected) {
  if (typeof expected === "boolean") return actual === expected;
  if (typeof expected === "number") return Number(actual) === expected;
  return String(actual) === String(expected);
}

function pad(value, width) {
  const s = String(value);
  return s.length >= width ? s : s + " ".repeat(width - s.length);
}

function describeMissing(f, requires) {
  return requires.filter((key) => f[key] === null || f[key] === undefined);
}

async function main() {
  await client.connect();
  const f = await discoverFixtures();

  const identities = [
    ["admin", f.admin],
    ["teacher", f.teacher],
    ["teacher_other", f.teacher_other],
    ["student1", f.student1],
    ["student2", f.student2],
    ["guardian1", f.guardian1],
    ["guardian2", f.guardian2],
    ["guardian3", f.guardian3],
  ].filter(([, id]) => id);

  console.log("Identidades descubiertas:");
  for (const [name, id] of identities) {
    console.log(`  ${pad(name, 14)} ${id}`);
  }
  const missingRoles = Object.keys(roleSanity).filter((r) => r !== "anon" && !profileByRole(f, r));
  if (missingRoles.length) {
    console.log(`  (sin identidad: ${missingRoles.join(", ")})`);
  }

  // Sanity por rol: si el JWT no resuelve, se evita un PASS falso.
  const brokenRoles = new Set();
  for (const [role, sanity] of Object.entries(roleSanity)) {
    const profileId = profileByRole(f, role);
    if (role !== "anon" && !profileId) {
      brokenRoles.add(role);
      continue;
    }
    try {
      const actual = await runAs(role, profileId, sanity.sql, sanity.params ? sanity.params(f) : []);
      if (!matches(actual, sanity.expected)) brokenRoles.add(role);
    } catch {
      brokenRoles.add(role);
    }
  }

  const results = [];
  for (const check of checks) {
    if (brokenRoles.has(check.role)) {
      results.push({ ...check, status: "SKIP", actual: "identidad no resuelta" });
      continue;
    }
    const missing = describeMissing(f, check.requires ?? []);
    if (missing.length) {
      results.push({ ...check, status: "SKIP", actual: `falta ${missing.join(", ")}` });
      continue;
    }
    try {
      const actual = await runAs(
        check.role,
        profileByRole(f, check.role),
        check.sql,
        check.params ? check.params(f) : [],
      );
      results.push({ ...check, status: matches(actual, check.expected) ? "PASS" : "FAIL", actual });
    } catch (error) {
      // Para anon, "permission denied" es el resultado seguro esperado.
      const denied = check.role === "anon" && error.code === "42501";
      results.push({
        ...check,
        status: denied ? "PASS" : "FAIL",
        actual: denied ? "permission denied" : `error: ${error.message}`,
      });
    }
  }

  console.log("");
  console.log(`${pad("ID", 10)} ${pad("Rol", 14)} ${pad("Estado", 6)} ${pad("Esperado", 9)} ${pad("Actual", 20)} Descripción`);
  console.log("-".repeat(120));
  for (const r of results) {
    console.log(
      `${pad(r.id, 10)} ${pad(r.role, 14)} ${pad(r.status, 6)} ${pad(r.expected, 9)} ${pad(r.actual, 20)} ${r.description}`,
    );
  }

  const passed = results.filter((r) => r.status === "PASS").length;
  const failed = results.filter((r) => r.status === "FAIL").length;
  const skipped = results.filter((r) => r.status === "SKIP").length;

  console.log("-".repeat(120));
  console.log(`Resumen: ${passed} PASS · ${failed} FAIL · ${skipped} SKIP · ${results.length} total`);

  if (failed > 0) {
    console.log("");
    console.log("Fallos (comportamiento inseguro detectado):");
    for (const r of results.filter((x) => x.status === "FAIL")) {
      console.log(`  ${r.id} [${r.role}] ${r.description} — esperado ${r.expected}, actual ${r.actual}`);
    }
  }

  await client.end();
  process.exit(failed > 0 ? 1 : 0);
}

main().catch(async (error) => {
  console.error("Error del runner:", error.message);
  await client.end().catch(() => {});
  process.exit(2);
});
