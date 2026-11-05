import { audit, requireCaller } from "../_shared/auth.ts";
import { handleError, handleOptions, HttpError, jsonResponse, readJson } from "../_shared/http.ts";
import { asBoolean, asUuid } from "../_shared/validation.ts";

Deno.serve(async (req) => {
  const options = handleOptions(req);
  if (options) return options;

  try {
    const { admin, userId, profile } = await requireCaller(req);

    if (profile.role !== "admin") {
      throw new HttpError(403, "Solo el administrador puede activar o desactivar cuentas");
    }

    const body = await readJson(req);

    const targetId = asUuid(body.user_id, "user_id");
    const active = asBoolean(body.active, "active", false);

    if (targetId === userId) {
      throw new HttpError(400, "No puedes desactivar tu propia cuenta");
    }

    const { data: target, error: findError } = await admin
      .from("profiles")
      .select("id,role,active,full_name,email")
      .eq("id", targetId)
      .maybeSingle();

    if (findError) {
      throw new HttpError(500, "No se pudo consultar el perfil");
    }

    if (!target) {
      throw new HttpError(404, "Perfil no encontrado");
    }

    if (target.role === "admin") {
      throw new HttpError(403, "No se puede desactivar a otro administrador");
    }

    const { error: updateError } = await admin
      .from("profiles")
      .update({ active, updated_at: new Date().toISOString() })
      .eq("id", targetId);

    if (updateError) {
      throw new HttpError(500, "No se pudo actualizar el perfil");
    }

    await audit(
      admin,
      userId,
      active ? "user.activated" : "user.deactivated",
      "profile",
      targetId,
      {
        role: target.role,
        email: target.email,
        active,
      },
      req,
    );

    return jsonResponse({
      ok: true,
      user_id: targetId,
      role: target.role,
      active,
    });
  } catch (error) {
    return handleError(error);
  }
});
