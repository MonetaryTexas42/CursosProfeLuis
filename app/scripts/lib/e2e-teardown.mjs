// Utilidades de limpieza para las pruebas E2E que escriben en staging.
//
// El smoke test de UI activa una unidad para un grupo y completa los tests
// del alumno. Estas funciones deshacen esos cambios usando la propia sesión
// del navegador, sin service_role:
//
//   - borra las asignaciones de unidad creadas durante la ejecución;
//   - restaura el perfil de tests del alumno a su estado anterior.

function decodeJwtSubject(token) {
  try {
    const payload = token.split(".")[1];
    const json = Buffer.from(
      payload.replace(/-/g, "+").replace(/_/g, "/"),
      "base64",
    ).toString("utf8");
    return JSON.parse(json).sub || null;
  } catch {
    return null;
  }
}

/** Lee la sesión de Supabase que el navegador guardó en localStorage. */
export async function readBrowserSession(pageEval) {
  const stored = await pageEval(`(() => {
    const out = {};
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (key && key.startsWith('sb-') && key.endsWith('-auth-token')) {
        out[key] = localStorage.getItem(key);
      }
    }
    return out;
  })()`);

  for (const value of Object.values(stored || {})) {
    try {
      const session = JSON.parse(value);
      if (session?.access_token) {
        return {
          accessToken: session.access_token,
          userId: session.user?.id || decodeJwtSubject(session.access_token),
        };
      }
    } catch {
      // Sigue con la siguiente entrada.
    }
  }
  return null;
}

async function rest(supabaseUrl, anonKey, token, path, options = {}) {
  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(options.headers || {}),
    },
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`REST ${path}: ${response.status} ${detail}`.trim());
  }
  if (response.status === 204) return null;
  return response.json().catch(() => null);
}

/** Guarda el estado de tests del alumno antes de que la prueba lo modifique. */
export async function snapshotStudentProfile({
  pageEval,
  supabaseUrl,
  anonKey,
}) {
  const session = await readBrowserSession(pageEval);
  if (!session?.accessToken || !session.userId) {
    throw new Error("No se pudo leer la sesión del alumno para el teardown");
  }

  const students = await rest(
    supabaseUrl,
    anonKey,
    session.accessToken,
    `students?select=id&profile_id=eq.${session.userId}&limit=1`,
  );
  const studentId = students?.[0]?.id;
  if (!studentId) return null;

  const profiles = await rest(
    supabaseUrl,
    anonKey,
    session.accessToken,
    `student_profiles?select=*&student_id=eq.${studentId}`,
  );

  return {
    accessToken: session.accessToken,
    studentId,
    profile: profiles?.[0] || null,
  };
}

/** Restaura el perfil de tests guardado por snapshotStudentProfile. */
export async function restoreStudentProfile({
  supabaseUrl,
  anonKey,
  snapshot,
}) {
  if (!snapshot?.accessToken) return { restored: false, reason: "sin sesión" };

  const previous = snapshot.profile || {};
  const personality = previous.personality || {};
  const vocational = {
    ...(previous.aptitude || {}),
    interests: previous.interests || [],
    aptitudes: previous.aptitudes || [],
    strengths: previous.strengths || [],
    career_suggestions: previous.career_suggestions || [],
    career_choice: previous.career_choice || null,
  };

  const call = (kind, payload) =>
    rest(supabaseUrl, anonKey, snapshot.accessToken, "rpc/app_save_student_test", {
      method: "POST",
      body: JSON.stringify({ p_kind: kind, p_payload: payload }),
    });

  await call("personality", personality);
  await call("vocational", vocational);

  return { restored: true, studentId: snapshot.studentId };
}

/** Borra las asignaciones de unidad creadas por la prueba. */
export async function deleteCreatedAssignments({
  pageEval,
  supabaseUrl,
  anonKey,
  assignmentIds,
}) {
  const ids = [...new Set(assignmentIds || [])].filter(Boolean);
  if (!ids.length) return { deleted: 0 };

  const session = await readBrowserSession(pageEval);
  if (!session?.accessToken) {
    throw new Error("No se pudo leer la sesión del profesor para el teardown");
  }

  const list = ids.join(",");
  await rest(
    supabaseUrl,
    anonKey,
    session.accessToken,
    `student_unit_overrides?assignment_id=in.(${list})`,
    { method: "DELETE" },
  );
  await rest(
    supabaseUrl,
    anonKey,
    session.accessToken,
    `unit_assignments?id=in.(${list})`,
    { method: "DELETE" },
  );

  return { deleted: ids.length };
}
