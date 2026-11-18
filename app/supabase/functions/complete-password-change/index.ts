// Cambio de contraseña verificado en el servidor (SEC-03).
//
// El cliente ya no puede limpiar must_change_password: esta función usa
// service_role para cambiar la contraseña en Auth y solo después actualiza
// el perfil. El usuario se identifica por su JWT, nunca por un id del cuerpo.

import { audit, requireCaller } from "../_shared/auth.ts";
import {
  handleError,
  handleOptions,
  HttpError,
  jsonResponse,
  readJson,
} from "../_shared/http.ts";
import { asPassword } from "../_shared/validation.ts";

Deno.serve(async (req) => {
  const options = handleOptions(req);
  if (options) return options;

  try {
    const { admin, userId, profile } = await requireCaller(req);
    const body = await readJson(req);
    const newPassword = asPassword(body.new_password, "new_password");

    const { error: authError } = await admin.auth.admin.updateUserById(userId, {
      password: newPassword,
      user_metadata: { must_change_password: false },
    });

    if (authError) {
      throw new HttpError(
        400,
        "No se pudo actualizar la contraseña. Verifica que cumpla la política.",
      );
    }

    const now = new Date().toISOString();
    const { error: profileError } = await admin
      .from("profiles")
      .update({
        must_change_password: false,
        password_changed_at: now,
        updated_at: now,
      })
      .eq("id", userId);

    if (profileError) {
      // La contraseña ya cambió en Auth. Se informa para revisión manual:
      // no se debe dejar al usuario creyendo que el flujo falló del todo.
      throw new HttpError(
        500,
        "La contraseña cambió, pero no se pudo actualizar el perfil. Contacta al administrador.",
      );
    }

    await audit(
      admin,
      userId,
      "profile.password_changed",
      "profile",
      userId,
      { forced: Boolean(profile.must_change_password) },
      req,
    );

    return jsonResponse({ ok: true });
  } catch (error) {
    return handleError(error);
  }
});
