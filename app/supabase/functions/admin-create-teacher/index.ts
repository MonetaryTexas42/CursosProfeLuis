import {
  audit,
  findAuthUserByEmail,
  requireCaller,
} from "../_shared/auth.ts";
import { handleError, handleOptions, HttpError, jsonResponse, readJson } from "../_shared/http.ts";
import { asEmail, asString } from "../_shared/validation.ts";

Deno.serve(async (req) => {
  const options = handleOptions(req);
  if (options) return options;

  try {
    const { admin, userId, profile } = await requireCaller(req);

    if (profile.role !== "admin") {
      throw new HttpError(403, "Solo el administrador puede crear profesores");
    }

    const body = await readJson(req);

    const fullName = asString(body.full_name, "full_name", 2, 120);
    const email = asEmail(body.email);
    const password = asString(body.password, "password", 10, 72);

    const existing = await findAuthUserByEmail(admin, email);
    if (existing) {
      throw new HttpError(409, "El correo ya está en uso");
    }

    const { data: authData, error: authError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role: "teacher", full_name: fullName },
    });

    if (authError || !authData.user) {
      throw new HttpError(400, "No se pudo crear la cuenta de acceso");
    }

    try {
      const { data: newProfile, error: profileError } = await admin
        .from("profiles")
        .insert({
          id: authData.user.id,
          role: "teacher",
          full_name: fullName,
          email,
          active: true,
        })
        .select("id,email,full_name,role,active")
        .single();

      if (profileError || !newProfile) {
        throw new HttpError(500, "No se pudo crear el perfil del profesor");
      }

      await audit(
        admin,
        userId,
        "teacher.created",
        "profile",
        newProfile.id,
        { email, full_name: fullName },
        req,
      );

      return jsonResponse({ ok: true, profile: newProfile }, 201);
    } catch (error) {
      await admin.auth.admin.deleteUser(authData.user.id);
      throw error;
    }
  } catch (error) {
    return handleError(error);
  }
});
