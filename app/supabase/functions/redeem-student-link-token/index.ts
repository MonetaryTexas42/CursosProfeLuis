// Canjea una invitación de alumno (SEC-02).
//
// Es pública a propósito: el alumno todavía no tiene contraseña. La prueba de
// titularidad es el token de 256 bits que el profesor entregó a la familia.
// El canje:
//   1. valida formato, hash, vigencia y que no esté usado ni revocado;
//   2. reclama el token de forma atómica (una sola vez);
//   3. fija la contraseña con la Admin API de Auth;
//   4. limpia `must_change_password` y registra `password_changed_at`;
//   5. revoca cualquier otra invitación pendiente del mismo alumno;
//   6. audita sin guardar el token.
//
// Nunca escribe directamente en `auth.users` ni marca correos como
// confirmados: la cuenta la creó el servidor al emitir la invitación.

import { adminClient, audit } from "../_shared/auth.ts";
import {
  handleError,
  handleOptions,
  HttpError,
  jsonResponse,
  readJson,
} from "../_shared/http.ts";
import { hashLinkToken, isLinkTokenFormat } from "../_shared/tokens.ts";
import { asPassword } from "../_shared/validation.ts";

const INVALID_LINK =
  "La invitación no es válida o ya venció. Pide al profesor que genere una nueva.";

Deno.serve(async (req) => {
  const options = handleOptions(req);
  if (options) return options;

  try {
    const admin = adminClient();
    const body = await readJson(req);
    const token = body.token;
    const password = asPassword(body.new_password, "new_password");

    if (!isLinkTokenFormat(token)) {
      throw new HttpError(400, INVALID_LINK);
    }

    const tokenHash = await hashLinkToken(token);

    const { data: tokenRow, error: tokenError } = await admin
      .from("student_link_tokens")
      .select("id, student_id, expires_at, used_at, revoked_at")
      .eq("token_hash", tokenHash)
      .maybeSingle();

    if (tokenError) {
      throw new HttpError(500, "No se pudo consultar la invitación");
    }

    if (
      !tokenRow ||
      tokenRow.used_at ||
      tokenRow.revoked_at ||
      new Date(tokenRow.expires_at).getTime() <= Date.now()
    ) {
      throw new HttpError(400, INVALID_LINK);
    }

    const { data: student, error: studentError } = await admin
      .from("students")
      .select("id, profile_id, student_code, status")
      .eq("id", tokenRow.student_id)
      .maybeSingle();

    if (studentError) {
      throw new HttpError(500, "No se pudo consultar al alumno");
    }

    if (!student || student.status !== "active") {
      throw new HttpError(400, INVALID_LINK);
    }

    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .select("id, full_name, username, email, active")
      .eq("id", student.profile_id)
      .maybeSingle();

    if (profileError) {
      throw new HttpError(500, "No se pudo consultar el perfil");
    }

    if (!profile || !profile.active) {
      throw new HttpError(400, INVALID_LINK);
    }

    const now = new Date().toISOString();

    // Reclamo atómico: dos canjes simultáneos no pueden usar el mismo token.
    const { data: claimed, error: claimError } = await admin
      .from("student_link_tokens")
      .update({ used_at: now, used_by: profile.id })
      .eq("id", tokenRow.id)
      .is("used_at", null)
      .is("revoked_at", null)
      .gt("expires_at", now)
      .select("id")
      .maybeSingle();

    if (claimError) {
      throw new HttpError(500, "No se pudo registrar el canje");
    }

    if (!claimed) {
      throw new HttpError(400, INVALID_LINK);
    }

    const { error: authError } = await admin.auth.admin.updateUserById(profile.id, {
      password,
      user_metadata: { must_change_password: false },
    });

    if (authError) {
      // Liberar el token para que la familia pueda reintentar con otra
      // contraseña que sí cumpla la política.
      await admin
        .from("student_link_tokens")
        .update({ used_at: null, used_by: null })
        .eq("id", tokenRow.id);

      throw new HttpError(
        400,
        "No se pudo guardar la contraseña. Verifica que cumpla la política e intenta de nuevo.",
      );
    }

    const { error: profileUpdateError } = await admin
      .from("profiles")
      .update({
        must_change_password: false,
        password_changed_at: now,
        updated_at: now,
      })
      .eq("id", profile.id);

    if (profileUpdateError) {
      // La contraseña ya cambió en Auth. El token queda usado para que no se
      // pueda reutilizar; se avisa para revisión manual.
      console.error("student_link_profile_update_error", profileUpdateError.message);
      throw new HttpError(
        500,
        "La contraseña se guardó, pero no se pudo actualizar el perfil. Pide apoyo al administrador.",
      );
    }

    // Una invitación nueva invalida las anteriores del mismo alumno.
    await admin
      .from("student_link_tokens")
      .update({ revoked_at: now })
      .eq("student_id", student.id)
      .is("used_at", null)
      .neq("id", tokenRow.id);

    await audit(
      admin,
      profile.id,
      "student.link_token_redeemed",
      "student",
      student.id,
      {
        token_id: tokenRow.id,
        student_code: student.student_code,
      },
      req,
    );

    return jsonResponse({
      ok: true,
      full_name: profile.full_name,
      username: profile.username,
      email: profile.email,
      student_code: student.student_code,
    });
  } catch (error) {
    return handleError(error);
  }
});
