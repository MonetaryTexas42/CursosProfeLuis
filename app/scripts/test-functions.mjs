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
import { assertSafeTestEnvironment, readEnvFile } from "./lib/env-guard.mjs";

const here = dirname(fileURLToPath(import.meta.url));

// Versión vigente del aviso: se toma del manifiesto que también usa el seed y
// la migración 0027, para que la prueba no quede fijada a una versión vieja.
const privacyManifest = JSON.parse(
  readFileSync(resolve(here, "../supabase/seed/privacy-document.json"), "utf8"),
);
const PRIVACY_VERSION = privacyManifest.version;

function readTestUsers() {
  // En staging usamos credenciales ficticias separadas. El archivo
  // `.secrets/test-users.txt` puede contener datos reales y no se lee aquí.
  const file = process.env.APP_ENV === "staging"
    ? "../.secrets/staging-test-users.txt"
    : "../.secrets/test-users.txt";
  const text = readFileSync(resolve(here, file), "utf8");
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
  const file = process.env.APP_ENV === "staging"
    ? "../frontend/.env.staging"
    : "../frontend/.env";
  return readEnvFile(resolve(here, file));
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

async function callFunction(name, token, body, extraHeaders = {}) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/${name}`, {
    method: "POST",
    headers: {
      ...authHeaders,
      Authorization: `Bearer ${token}`,
      ...extraHeaders,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

async function main() {
  // Este script crea y modifica datos (invitaciones, consentimientos,
  // cuentas de prueba). Solo puede ejecutarse contra staging.
  assertSafeTestEnvironment({
    supabaseUrl: SUPABASE_URL,
    write: true,
    label: "test-functions",
  });

  const teacher = users.teacher;
  const guardian = users.guardian;
  if (!teacher?.email || !guardian?.email) {
    throw new Error("No se encontraron las credenciales en test-users.txt");
  }

  const studentCode = process.env.TEST_STUDENT_CODE || "STAGING.ALUMNO.UNO";

  console.log("1) Login del profesor…");
  const teacherToken = await login(teacher.email, teacher.password);

  console.log(`2) Obteniendo el alumno ${studentCode}…`);
  const studentsRes = await fetch(
    `${SUPABASE_URL}/rest/v1/students?student_code=eq.${encodeURIComponent(studentCode)}&select=id`,
    { headers: { apikey: ANON_KEY, Authorization: `Bearer ${teacherToken}` } },
  );
  const students = await studentsRes.json();
  const studentId = students?.[0]?.id;
  if (!studentId) {
    throw new Error(
      `No se encontró el alumno ${studentCode}. ` +
        "Ajusta TEST_STUDENT_CODE o ejecuta el seed de staging.",
    );
  }
  console.log("   student_id:", studentId);

  console.log("3) invite-guardian (profesor)…");
  const invite = await callFunction("invite-guardian", teacherToken, {
    student_id: studentId,
    full_name: "Tutor de Prueba Correo",
    phone: "+5215512345678",
    relationship: "madre",
    email: "tutor.correo.pil001@tutores.ecoems.mx",
  });

  if (invite.status !== 201 || !invite.data?.ok) {
    throw new Error(`invite-guardian falló: ${JSON.stringify(invite)}`);
  }
  if (invite.data.magic_link || invite.data.whatsapp_share_url) {
    throw new Error("invite-guardian devolvió un enlace mágico o de WhatsApp");
  }
  if (invite.data.delivery !== "email" || !invite.data.email_id) {
    throw new Error(`Se esperaba entrega por correo encolada: ${JSON.stringify(invite.data)}`);
  }
  console.log("   ✓ invitación encolada · delivery:", invite.data.delivery);
  console.log("   ✓ email_id:", invite.data.email_id);

  console.log("4) Reinvitación (mismo correo, no debe duplicar)…");
  const reinvite = await callFunction("invite-guardian", teacherToken, {
    student_id: studentId,
    full_name: "Tutor de Prueba Correo",
    email: "tutor.correo.pil001@tutores.ecoems.mx",
    resend: true,
  });
  if (reinvite.status !== 201 || !reinvite.data?.ok) {
    throw new Error(`reinvitación falló: ${JSON.stringify(reinvite)}`);
  }
  console.log("   ✓ reinvitación ok (reusa la cuenta)");

  console.log("5) guardian-consent llamado por un PROFESOR (debe ser rechazado)…");
  const teacherConsent = await callFunction("guardian-consent", teacherToken, {
    student_id: studentId,
    document_version: PRIVACY_VERSION,
    accepted: true,
    acknowledged: true,
  });
  if (teacherConsent.status !== 403) {
    throw new Error(`Se esperaba 403 y llegó ${teacherConsent.status}`);
  }
  console.log("   ✓ rechazado correctamente");

  console.log("5b) CORS: origen desconocido (debe ser 403)…");
  const corsProbe = await callFunction(
    "guardian-consent",
    teacherToken,
    {
      student_id: studentId,
      document_version: PRIVACY_VERSION,
      accepted: true,
      acknowledged: true,
    },
    { Origin: "https://origen-no-autorizado.invalid" },
  );
  if (corsProbe.status !== 403) {
    throw new Error(
      `Se esperaba 403 por origen no permitido y llegó ${corsProbe.status}: ${JSON.stringify(corsProbe.data)}`,
    );
  }
  console.log("   ✓ origen desconocido rechazado");

  console.log("6) Login del tutor existente (tutor1)…");
  const guardianToken = await login(guardian.email, guardian.password);

  console.log("7) guardian-consent con versión INCORRECTA (debe rechazarse)…");
  const wrongVersion = await callFunction("guardian-consent", guardianToken, {
    student_id: studentId,
    document_version: "v9-9999",
    accepted: true,
    acknowledged: true,
  });
  if (wrongVersion.status !== 409) {
    throw new Error(`Se esperaba 409 por versión y llegó ${wrongVersion.status}: ${JSON.stringify(wrongVersion.data)}`);
  }
  console.log("   ✓ versión incorrecta rechazada");

  console.log("8) guardian-consent correcto (requiere admin para el vínculo; se corre tras el login admin)…");
  let guardianLinkId = null;

  // ---- Funciones de administración (requieren ADMIN_PASSWORD) ----
  if (process.env.ADMIN_PASSWORD) {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      throw new Error("Define ADMIN_EMAIL en el entorno (cuenta admin de staging)");
    }
    const testTeacherEmail = `profesor.test.${Date.now()}@ecoems.local`;

    console.log("9) Login del admin…");
    const adminToken = await login(adminEmail, process.env.ADMIN_PASSWORD);

    console.log("8b) Vínculo temporal tutor1 → alumno de prueba y consentimiento…");
    const guardiansRes = await fetch(
      `${SUPABASE_URL}/rest/v1/guardians?select=id&email=eq.${encodeURIComponent(guardian.email)}`,
      { headers: { apikey: ANON_KEY, Authorization: `Bearer ${adminToken}` } },
    );
    const guardians = await guardiansRes.json();
    const guardianId = guardians?.[0]?.id;

    if (guardianId) {
      const linkRes = await fetch(`${SUPABASE_URL}/rest/v1/student_guardians`, {
        method: "POST",
        headers: { ...authHeaders, Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({ student_id: studentId, guardian_id: guardianId, can_receive_email: true }),
      });
      if (linkRes.ok) console.log("   (vínculo temporal creado)");
    }

    const consent = await callFunction("guardian-consent", guardianToken, {
      student_id: studentId,
      document_version: PRIVACY_VERSION,
      accepted: true,
      acknowledged: true,
    });
    if (consent.status !== 200 || consent.data?.status !== "accepted") {
      throw new Error(`consent falló: ${JSON.stringify(consent)}`);
    }
    console.log("   ✓ consentimiento registrado:", consent.data.status);

    if (guardianId) {
      await fetch(
        `${SUPABASE_URL}/rest/v1/student_guardians?student_id=eq.${studentId}&guardian_id=eq.${guardianId}`,
        { method: "DELETE", headers: { apikey: ANON_KEY, Authorization: `Bearer ${adminToken}` } },
      );
      console.log("   (vínculo temporal eliminado)");
    }

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
