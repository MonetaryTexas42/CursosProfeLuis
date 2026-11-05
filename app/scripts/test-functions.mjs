// Prueba E2E de las Edge Functions desplegadas (sin dependencias).
//
// Uso (desde app/):
//   node scripts/test-functions.mjs
//
// Requiere .secrets/test-users.txt (credenciales ficticias) y
// frontend/.env (URL y anon key del proyecto).
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

function readTestUsers() {
  const text = readFileSync(resolve(here, "../.secrets/test-users.txt"), "utf8");
  const lines = text.split("\n");
  const users = {};
  let current = null;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const roleMatch = line.match(/^\[(\w+)\]\s+(.+)$/);
    if (roleMatch) {
      current = { role: roleMatch[1], name: roleMatch[2], email: null, password: null, username: null };
    } else if (current) {
      const email = line.match(/correo:\s*(\S+)/);
      const password = line.match(/contraseña:\s*(\S+)/);
      const username = line.match(/usuario:\s*(\S+)/);
      if (email) current.email = email[1];
      if (password) current.password = password[1];
      if (username) current.username = username[1];
      if (current.email && current.password) {
        if (!users[current.role]) users[current.role] = current;
        current = null;
      }
    }
  }

  return users;
}

function readEnv() {
  const text = readFileSync(resolve(here, "../frontend/.env"), "utf8");
  const values = {};
  for (const line of text.split("\n")) {
    const match = line.match(/^([A-Z_]+)=(.*)$/);
    if (match) values[match[1]] = match[2].trim();
  }
  return values;
}

const users = readTestUsers();
const env = readEnv();
const SUPABASE_URL = env.VITE_SUPABASE_URL;
const ANON_KEY = env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !ANON_KEY || ANON_KEY.includes("REEMPLAZA")) {
  console.error("Falta VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en frontend/.env");
  process.exit(2);
}

const authHeaders = { apikey: ANON_KEY, "Content-Type": "application/json" };

async function login(email, password) {
  const res = await fetch(
    `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
    {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({ email, password }),
    },
  );
  const data = await res.json();
  if (!res.ok || !data.access_token) {
    throw new Error(`Login falló para ${email}: ${data.error_description || data.msg || res.status}`);
  }
  return data.access_token;
}

async function callFunction(name, token, body) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/${name}`, {
    method: "POST",
    headers: {
      ...authHeaders,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

async function main() {
  const teacher = users.teacher;
  const guardian = users.guardian;
  if (!teacher?.email || !guardian?.email) {
    throw new Error("No se encontraron las credenciales en test-users.txt");
  }

  console.log("1) Login del profesor…");
  const teacherToken = await login(teacher.email, teacher.password);

  console.log("2) Obteniendo el alumno PIL-001…");
  const studentsRes = await fetch(
    `${SUPABASE_URL}/rest/v1/students?student_code=eq.PIL-001&select=id`,
    { headers: { apikey: ANON_KEY, Authorization: `Bearer ${teacherToken}` } },
  );
  const students = await studentsRes.json();
  const studentId = students?.[0]?.id;
  if (!studentId) throw new Error("No se pudo obtener PIL-001");
  console.log("   student_id:", studentId);

  console.log("3) invite-guardian (profesor)…");
  const invite = await callFunction("invite-guardian", teacherToken, {
    student_id: studentId,
    full_name: "Tutor de Prueba WhatsApp",
    phone: "+5215512345678",
    relationship: "madre",
    email: "tutor.wa.pil001@tutores.ecoems.mx",
  });

  if (invite.status !== 201 || !invite.data?.ok) {
    throw new Error(`invite-guardian falló: ${JSON.stringify(invite)}`);
  }
  if (!invite.data.magic_link || !invite.data.whatsapp_share_url) {
    throw new Error("invite-guardian no devolvió enlace ni URL de WhatsApp");
  }
  if (invite.data.delivery !== "whatsapp") {
    throw new Error(`Se esperaba delivery whatsapp: ${invite.data.delivery}`);
  }
  console.log("   ✓ invitación creada · delivery:", invite.data.delivery);
  console.log("   ✓ whatsapp_share_url empieza con wa.me:",
    invite.data.whatsapp_share_url.startsWith("https://wa.me/"));

  console.log("4) Reinvitación (mismo correo, no debe duplicar)…");
  const reinvite = await callFunction("invite-guardian", teacherToken, {
    student_id: studentId,
    full_name: "Tutor de Prueba WhatsApp",
    email: "tutor.wa.pil001@tutores.ecoems.mx",
    resend: true,
  });
  if (reinvite.status !== 201 || !reinvite.data?.ok) {
    throw new Error(`reinvitación falló: ${JSON.stringify(reinvite)}`);
  }
  console.log("   ✓ reinvitación ok (reusa la cuenta)");

  console.log("5) guardian-consent llamado por un PROFESOR (debe ser rechazado)…");
  const teacherConsent = await callFunction("guardian-consent", teacherToken, {
    student_id: studentId,
    document_version: "v1-2026",
    accepted: true,
  });
  if (teacherConsent.status !== 403) {
    throw new Error(`Se esperaba 403 y llegó ${teacherConsent.status}`);
  }
  console.log("   ✓ rechazado correctamente");

  console.log("6) Login del tutor existente (tutor1)…");
  const guardianToken = await login(guardian.email, guardian.password);

  console.log("7) guardian-consent con versión INCORRECTA (debe rechazarse)…");
  const wrongVersion = await callFunction("guardian-consent", guardianToken, {
    student_id: studentId,
    document_version: "v9-9999",
    accepted: true,
  });
  if (wrongVersion.status !== 409) {
    throw new Error(`Se esperaba 409 por versión y llegó ${wrongVersion.status}: ${JSON.stringify(wrongVersion.data)}`);
  }
  console.log("   ✓ versión incorrecta rechazada");

  console.log("8) guardian-consent correcto (tutor1 para PIL-001)…");
  const consent = await callFunction("guardian-consent", guardianToken, {
    student_id: studentId,
    document_version: "v1-2026",
    accepted: true,
  });
  if (consent.status !== 200 || consent.data?.status !== "accepted") {
    throw new Error(`consent falló: ${JSON.stringify(consent)}`);
  }
  console.log("   ✓ consentimiento registrado:", consent.data.status);

  // ---- Funciones de administración (requieren ADMIN_PASSWORD) ----
  if (process.env.ADMIN_PASSWORD) {
    const adminEmail = process.env.ADMIN_EMAIL || "cursosprofeluis@gmail.com";
    const testTeacherEmail = `profesor.test.${Date.now()}@ecoems.local`;

    console.log("9) Login del admin…");
    const adminToken = await login(adminEmail, process.env.ADMIN_PASSWORD);

    console.log("10) admin-create-teacher…");
    const created = await callFunction("admin-create-teacher", adminToken, {
      full_name: "Profesor de Prueba",
      email: testTeacherEmail,
      password: "Aa1!contraseñaTemporal",
    });
    if (created.status !== 201 || !created.data?.ok) {
      throw new Error(`admin-create-teacher falló: ${JSON.stringify(created)}`);
    }
    const teacherProfileId = created.data.profile.id;
    console.log("   ✓ profesor creado:", created.data.profile.email);

    console.log("11) admin-create-teacher con correo repetido (409)…");
    const duplicated = await callFunction("admin-create-teacher", adminToken, {
      full_name: "Profesor de Prueba",
      email: testTeacherEmail,
      password: "Aa1!contraseñaTemporal",
    });
    if (duplicated.status !== 409) {
      throw new Error(`Se esperaba 409 y llegó ${duplicated.status}`);
    }
    console.log("   ✓ duplicado rechazado");

    console.log("12) deactivate-user (desactivar profesor de prueba)…");
    const deactivated = await callFunction("deactivate-user", adminToken, {
      user_id: teacherProfileId,
      active: false,
    });
    if (deactivated.status !== 200 || deactivated.data?.active !== false) {
      throw new Error(`deactivate-user falló: ${JSON.stringify(deactivated)}`);
    }
    console.log("   ✓ cuenta desactivada");

    console.log("13) deactivate-user al propio admin (debe bloquearse)…");
    const adminProfilesRes = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?select=id&email=eq.${encodeURIComponent(adminEmail)}`,
      { headers: { apikey: ANON_KEY, Authorization: `Bearer ${adminToken}` } },
    );
    const adminProfiles = await adminProfilesRes.json();
    const adminProfileId = adminProfiles?.[0]?.id;
    if (adminProfileId) {
      const blocked = await callFunction("deactivate-user", adminToken, {
        user_id: adminProfileId,
        active: false,
      });
      if (blocked.status !== 400) {
        throw new Error(`Se esperaba 400 y llegó ${blocked.status}`);
      }
      console.log("   ✓ auto-desactivación bloqueada");
    } else {
      console.log("   (omitido: no se pudo leer el perfil del admin)");
    }

    // Nota: el profesor de prueba se limpia con la conexión directa a la base
    // después de la prueba (el borrado de auth.users requiere service_role).
    console.log(`   (profesor de prueba ${testTeacherEmail} queda para limpieza directa)`);
  }

  console.log("\nPASS · Funciones Edge desplegadas y flujos verificados.");
}

main().catch((error) => {
  console.error("\nFAIL:", error.message);
  process.exit(1);
});
