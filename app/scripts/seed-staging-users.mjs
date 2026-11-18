// Seed de staging: usuarios ficticios y datos mínimos para la suite de RLS.
//
// Uso (desde app/):
//   SUPABASE_URL="https://<ref-staging>.supabase.co" \
//   SUPABASE_SERVICE_ROLE_KEY="<service-role-de-staging>" \
//   DATABASE_URL="$(cat .secrets/staging-database-url)" \
//   node scripts/seed-staging-users.mjs
//
// Requisitos:
// - Proyecto de staging con las migraciones aplicadas y el contenido sembrado
//   (`scripts/seed-content.mjs`).
// - Clave service_role SOLO de staging. Nunca la de producción ni el frontend.
//
// Crea (idempotente):
//   admin@staging.ecoems.local          admin
//   profesor1@staging.ecoems.local      teacher, dueño de Grupo A y B
//   profesor2@staging.ecoems.local      teacher sin grupos (otro profesor)
//   alumno1@alumnos.staging.ecoems.mx   student en Grupo A, con asignación
//   alumno2@alumnos.staging.ecoems.mx   student en Grupo B, sin asignación
//   tutor1@staging.ecoems.local         guardian vinculado a alumno1 (sin consentimiento)
//   tutor2@staging.ecoems.local         guardian sin vínculos
//   tutor3@staging.ecoems.local         guardian con consentimiento vigente (alumno2)
//                                       y consentimiento revocado (alumno1)
//
// La contraseña es ficticia y se puede cambiar con STAGING_USER_PASSWORD.

import pg from "pg";

const PROD_REF = "ioikcrdxneuydylyhvwi";
const supabaseUrl = (process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? "").replace(/\/$/, "");
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const databaseUrl = process.env.DATABASE_URL;
const password = process.env.STAGING_USER_PASSWORD ?? "StagingDemo-2026!";

if (!supabaseUrl || !serviceKey || !databaseUrl) {
  console.error("Faltan SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY o DATABASE_URL.");
  process.exit(2);
}

const ref = supabaseUrl.match(/^https?:\/\/([a-z0-9]{20})\.supabase\.co/i)?.[1]?.toLowerCase();
const dbRef = (
  databaseUrl.match(/@(?:db\.)?([a-z0-9]{20})\.supabase\.(?:com|co)/i) ||
  databaseUrl.match(/\/(?:postgres|pgbouncer)\.([a-z0-9]{20}):/i)
)?.[1]?.toLowerCase();

if (!ref) {
  console.error("ABORTADO: SUPABASE_URL no parece la URL de un proyecto Supabase.");
  process.exit(2);
}

if (ref === PROD_REF || dbRef === PROD_REF) {
  console.error("ABORTADO: SUPABASE_URL o DATABASE_URL apuntan a producción.");
  process.exit(2);
}

if (dbRef && dbRef !== ref) {
  console.error(
    `ABORTADO: SUPABASE_URL (${ref}) y DATABASE_URL (${dbRef}) apuntan a proyectos distintos.`,
  );
  process.exit(2);
}

const USERS = [
  { key: "admin", email: "admin@staging.ecoems.local", username: "admin.staging", role: "admin", full_name: "Admin Staging" },
  { key: "teacher1", email: "profesor1@staging.ecoems.local", username: "profesor1.staging", role: "teacher", full_name: "Profesor Uno Staging" },
  { key: "teacher2", email: "profesor2@staging.ecoems.local", username: "profesor2.staging", role: "teacher", full_name: "Profesor Dos Staging" },
  { key: "student1", email: "alumno1@alumnos.staging.ecoems.mx", username: "alumno1.staging", role: "student", full_name: "Alumno Uno Staging" },
  { key: "student2", email: "alumno2@alumnos.staging.ecoems.mx", username: "alumno2.staging", role: "student", full_name: "Alumno Dos Staging" },
  { key: "guardian1", email: "tutor1@staging.ecoems.local", username: "tutor1.staging", role: "guardian", full_name: "Tutor Uno Staging" },
  { key: "guardian2", email: "tutor2@staging.ecoems.local", username: "tutor2.staging", role: "guardian", full_name: "Tutor Dos Staging" },
  { key: "guardian3", email: "tutor3@staging.ecoems.local", username: "tutor3.staging", role: "guardian", full_name: "Tutor Tres Staging" },
];

async function adminApi(path, options = {}) {
  const res = await fetch(`${supabaseUrl}/auth/v1/admin${path}`, {
    ...options,
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });
  const text = await res.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  return { ok: res.ok, status: res.status, body };
}

async function listUsers() {
  const res = await adminApi("/users?page=1&per_page=1000");
  if (!res.ok) throw new Error(`No se pudo listar usuarios (${res.status})`);
  const data = res.body;
  return Array.isArray(data) ? data : (data?.users ?? []);
}

async function ensureUser(user) {
  const created = await adminApi("/users", {
    method: "POST",
    body: JSON.stringify({
      email: user.email,
      password,
      email_confirm: true,
      user_metadata: { full_name: user.full_name },
    }),
  });

  if (created.ok && created.body?.id) {
    return created.body.id;
  }

  const alreadyExists =
    created.status === 422 ||
    /already|registered|exists/i.test(typeof created.body === "string" ? created.body : JSON.stringify(created.body));

  if (!alreadyExists) {
    throw new Error(`No se pudo crear ${user.email} (${created.status}): ${JSON.stringify(created.body)}`);
  }

  const users = await listUsers();
  const found = users.find((u) => String(u.email ?? "").toLowerCase() === user.email.toLowerCase());
  if (!found) throw new Error(`El usuario ${user.email} existe pero no se encontró en la lista`);

  // Mantiene la contraseña conocida en reruns.
  const updated = await adminApi(`/users/${found.id}`, {
    method: "PUT",
    body: JSON.stringify({ password, email_confirm: true, user_metadata: { full_name: user.full_name } }),
  });
  if (!updated.ok) throw new Error(`No se pudo actualizar ${user.email} (${updated.status})`);

  return found.id;
}

const client = new pg.Client({ connectionString: databaseUrl });

async function main() {
  await client.connect();

  const ids = {};
  for (const user of USERS) {
    ids[user.key] = await ensureUser(user);
    console.log(`  auth.users  ${user.email}  ${ids[user.key]}`);
  }

  await client.query("begin");
  try {
    for (const user of USERS) {
      await client.query(
        `insert into public.profiles (id, role, full_name, username, email, active)
         values ($1, $2::public.user_role, $3, $4, $5, true)
         on conflict (id) do update
           set role = excluded.role,
               full_name = excluded.full_name,
               username = excluded.username,
               email = excluded.email,
               active = true`,
        [ids[user.key], user.role, user.full_name, user.username, user.email],
      );
    }

    await client.query(
      `update public.academic_years set is_active = false
        where is_active and name <> '2026-2027'`,
    );

    const year = await client.query(
      `insert into public.academic_years (name, starts_on, ends_on, is_active)
       values ('2026-2027', '2026-08-01', '2027-07-31', true)
       on conflict (name) do update set is_active = true
       returning id`,
    );
    const yearId = year.rows[0].id;

    await client.query(
      `insert into public.terms (academic_year_id, name, starts_on, ends_on, weight, sort_order)
       values ($1, 'Demo', '2026-08-01', '2026-12-31', 1, 1)
       on conflict (academic_year_id, name) do nothing`,
      [yearId],
    );

    const groups = {};
    for (const [key, name] of [["groupA", "Grupo A"], ["groupB", "Grupo B"]]) {
      const res = await client.query(
        `insert into public.groups (academic_year_id, name, level, teacher_id, schedule, active)
         values ($1, $2, 'Secundaria', $3, 'Lun-Vie 08:00', true)
         on conflict (academic_year_id, name) do update
           set teacher_id = excluded.teacher_id, active = true
         returning id`,
        [yearId, name, ids.teacher1],
      );
      groups[key] = res.rows[0].id;
    }

    const students = {};
    for (const [key, groupId, code] of [
      ["student1", groups.groupA, "STAGING.ALUMNO.UNO"],
      ["student2", groups.groupB, "STAGING.ALUMNO.DOS"],
    ]) {
      const res = await client.query(
        `insert into public.students (profile_id, group_id, student_code, status)
         values ($1, $2, $3, 'active')
         on conflict (student_code) do update
           set profile_id = excluded.profile_id,
               group_id = excluded.group_id,
               status = 'active'
         returning id`,
        [ids[key], groupId, code],
      );
      students[key] = res.rows[0].id;
    }

    // PRIV-02: la nota interna vive fuera de students.
    await client.query(
      `insert into public.student_staff_notes (student_id, note)
       values ($1, 'NOTA_INTERNA_DE_PRUEBA')
       on conflict (student_id) do update
         set note = excluded.note, updated_at = now()`,
      [students.student1],
    );

    const guardians = {};
    for (const [key, email, fullName] of [
      ["guardian1", "tutor1@staging.ecoems.local", "Tutor Uno Staging"],
      ["guardian2", "tutor2@staging.ecoems.local", "Tutor Dos Staging"],
      ["guardian3", "tutor3@staging.ecoems.local", "Tutor Tres Staging"],
    ]) {
      const res = await client.query(
        `insert into public.guardians (profile_id, full_name, email, relationship, active)
         values ($1, $2, $3, 'Tutor', true)
         on conflict (email) do update
           set profile_id = excluded.profile_id, full_name = excluded.full_name, active = true
         returning id`,
        [ids[key], fullName, email],
      );
      guardians[key] = res.rows[0].id;
    }

    await client.query(
      `insert into public.student_guardians (student_id, guardian_id)
       values ($1, $2) on conflict do nothing`,
      [students.student1, guardians.guardian1],
    );

    // PRIV-01: fixtures de consentimiento.
    // - guardian1/alumno1: vínculo sin consentimiento (el panel debe bloquearse).
    // - guardian3/alumno2: consentimiento vigente (el panel debe mostrar datos).
    // - guardian3/alumno1: consentimiento revocado (no debe otorgar acceso).
    await client.query(
      `insert into public.student_guardians (student_id, guardian_id)
       values ($1, $2)
       on conflict do nothing`,
      [students.student1, guardians.guardian3],
    );
    await client.query(
      `insert into public.student_guardians (student_id, guardian_id)
       values ($1, $2)
       on conflict do nothing`,
      [students.student2, guardians.guardian3],
    );

    const privacyRes = await client.query(
      `select
         coalesce((select value #>> '{}' from public.settings where key = 'privacy_document_version'), 'v2-2026') as version,
         coalesce((select value #>> '{}' from public.settings where key = 'privacy_document_url'), '/privacidad.html') as url,
         coalesce((select value #>> '{}' from public.settings where key = 'privacy_document_sha256'), '') as sha256`,
    );
    const privacy = privacyRes.rows[0];

    await client.query(
      `delete from public.privacy_consents
        where guardian_id = any($1::uuid[])`,
      [[guardians.guardian1, guardians.guardian3]],
    );

    await client.query(
      `insert into public.privacy_consents
         (student_id, guardian_id, document_version, accepted_at, revoked_at, metadata)
       values
         ($1, $2, $3, now() - interval '2 days', null,
          jsonb_build_object(
            'accepted_by', 'Tutor Tres Staging',
            'channel', 'seed',
            'document_version', $3::text,
            'document_url', $4::text,
            'document_hash', $5::text,
            'acknowledged', true
          )),
         ($6, $2, $3, now() - interval '10 days', now() - interval '1 day',
          jsonb_build_object(
            'accepted_by', 'Tutor Tres Staging',
            'channel', 'seed',
            'document_version', $3::text,
            'document_url', $4::text,
            'document_hash', $5::text,
            'acknowledged', true,
            'revoked_by', 'Tutor Tres Staging',
            'revoked_channel', 'seed'
          ))
       on conflict (student_id, guardian_id, document_version) do update
         set accepted_at = excluded.accepted_at,
             revoked_at = excluded.revoked_at,
             metadata = excluded.metadata`,
      [
        students.student2,
        guardians.guardian3,
        privacy.version,
        privacy.url,
        privacy.sha256,
        students.student1,
      ],
    );

    const content = await client.query(
      `select u.id as unit_id, v.id as version_id
         from public.units u
         join public.unit_versions v on v.unit_id = u.id
        where u.status = 'published' and v.published_at is not null
        order by u.subject_id, u.num
        limit 1`,
    );

    if (content.rows[0]) {
      const { unit_id, version_id } = content.rows[0];
      const existing = await client.query(
        `select id from public.unit_assignments where group_id = $1 and unit_id = $2 limit 1`,
        [groups.groupA, unit_id],
      );
      if (!existing.rows[0]) {
        await client.query(
          `insert into public.unit_assignments
             (group_id, unit_id, unit_version_id, status, visible, created_by)
           values ($1, $2, $3, 'active', true, $4)`,
          [groups.groupA, unit_id, version_id, ids.admin],
        );
      }
    } else {
      console.log("  aviso: no hay contenido publicado; no se creó asignación para Grupo A.");
    }

    await client.query("commit");

    console.log("");
    console.log("Listo. IDs para pruebas manuales:");
    console.log(`  year:     ${yearId}`);
    console.log(`  groupA:   ${groups.groupA}`);
    console.log(`  groupB:   ${groups.groupB}`);
    console.log(`  alumno1:  ${students.student1}`);
    console.log(`  alumno2:  ${students.student2}`);
    console.log(`  tutor1:   ${guardians.guardian1}`);
    console.log(`  tutor2:   ${guardians.guardian2}`);
    console.log(`  tutor3:   ${guardians.guardian3}`);
    console.log("");
    console.log(`Contraseña ficticia: ${password}`);
  } catch (error) {
    await client.query("rollback").catch(() => {});
    throw error;
  }
}

main()
  .then(async () => {
    await client.end();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error("Falló el seed:", error.message);
    await client.end().catch(() => {});
    process.exit(1);
  });
