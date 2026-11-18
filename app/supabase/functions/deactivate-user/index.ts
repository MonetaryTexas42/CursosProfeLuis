import { audit, requireCaller } from "../_shared/auth.ts";
import { handleError, handleOptions, HttpError, jsonResponse, readJson } from "../_shared/http.ts";
import { asBoolean, asUuid, optionalString } from "../_shared/validation.ts";

// SEC-04 · Offboarding real.
//
// Antes solo se marcaba `profiles.active = false`: la identidad seguía viva en
// Supabase Auth y el usuario podía iniciar sesión y refrescar el token. Ahora:
//   1. se banea la cuenta en Auth (100 años) al desactivar y se desbanea al
//      reactivar;
//   2. se guarda fecha, actor y motivo en `profiles`;
//   3. se registra la acción en `audit_log`.
//
// Un access token ya emitido sigue siendo válido hasta su expiración natural
// (1 h por defecto). Para cortar ese margen, el proyecto debe mantener un
// `jwt_expiry` corto; el baneo impide nuevos logins y refresh.
const BAN_DURATION = "876000h"; // 100 años
const UNBAN_DURATION = "none";

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
    const reason = optionalString(body.reason, "reason", 400);

    if (targetId === userId) {
      throw new HttpError(400, "No puedes desactivar tu propia cuenta");
    }

    const { data: target, error: findError } = await admin
      .from("profiles")
      .select("id,role,active,full_name,email,deactivated_at")
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

    // 1) Auth primero: si el baneo falla, el perfil no queda en un estado
    //    inconsistente (activo en Auth, inactivo en la app).
    const { error: banError } = await admin.auth.admin.updateUserById(targetId, {
      ban_duration: active ? UNBAN_DURATION : BAN_DURATION,
    });

    if (banError) {
      throw new HttpError(502, `No se pudo ${active ? "reactivar" : "suspender"} la cuenta en Auth`);
    }

    // 2) Perfil: rastro de la desactivación. Al reactivar se limpia.
    const profilePatch = active
      ? {
        active: true,
        deactivated_at: null,
        deactivated_by: null,
        deactivation_reason: null,
        updated_at: new Date().toISOString(),
      }
      : {
        active: false,
        deactivated_at: new Date().toISOString(),
        deactivated_by: userId,
        deactivation_reason: reason ?? "Desactivación administrativa",
        updated_at: new Date().toISOString(),
      };

    const { error: updateError } = await admin
      .from("profiles")
      .update(profilePatch)
      .eq("id", targetId);

    if (updateError) {
      // Intento de compensación: si el perfil no se pudo actualizar, se
      // devuelve el estado de Auth al que tenía antes.
      await admin.auth.admin.updateUserById(targetId, {
        ban_duration: target.active ? UNBAN_DURATION : BAN_DURATION,
      });
      throw new HttpError(500, "No se pudo actualizar el perfil");
    }

    // 3) Auditoría con el motivo y el estado anterior.
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
        previous_active: target.active,
        previous_deactivated_at: target.deactivated_at,
        reason: active ? null : (reason ?? "Desactivación administrativa"),
        auth_ban_duration: active ? UNBAN_DURATION : BAN_DURATION,
      },
      req,
    );

    return jsonResponse({
      ok: true,
      user_id: targetId,
      role: target.role,
      active,
      banned: !active,
    });
  } catch (error) {
    return handleError(error);
  }
});
