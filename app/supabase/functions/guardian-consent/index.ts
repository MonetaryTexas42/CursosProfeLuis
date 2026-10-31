import { audit, requireCaller } from "../_shared/auth.ts";
import {
  handleError,
  handleOptions,
  HttpError,
  jsonResponse,
  readJson,
  requestContext,
} from "../_shared/http.ts";
import { asBoolean, asString, asUuid } from "../_shared/validation.ts";

Deno.serve(async (req) => {
  const options = handleOptions(req);
  if (options) return options;

  try {
    const { admin, userId, profile } = await requireCaller(req);
    const body = await readJson(req);

    if (profile.role !== "guardian") {
      throw new HttpError(403, "Solo el tutor puede registrar su consentimiento");
    }

    const studentId = asUuid(body.student_id, "student_id");
    const documentVersion = asString(body.document_version, "document_version", 1, 40);
    const accepted = asBoolean(body.accepted, "accepted", false);
    const revoke = asBoolean(body.revoke, "revoke", false);

    if (accepted && revoke) {
      throw new HttpError(400, "Indica accepted o revoke, no ambos");
    }

    // La versión debe ser la vigente según settings (si está configurada).
    const { data: versionSetting } = await admin
      .from("settings")
      .select("value")
      .eq("key", "privacy_document_version")
      .maybeSingle();

    const currentVersion = versionSetting?.value?.privacy_document_version ??
      (typeof versionSetting?.value === "string" ? versionSetting.value : null);

    if (currentVersion && documentVersion !== currentVersion) {
      throw new HttpError(409, `La versión vigente del aviso es ${currentVersion}`);
    }

    const { data: guardian } = await admin
      .from("guardians")
      .select("id")
      .eq("profile_id", userId)
      .maybeSingle();

    if (!guardian) {
      throw new HttpError(403, "No existe la ficha del tutor");
    }

    const { data: link } = await admin
      .from("student_guardians")
      .select("student_id")
      .eq("guardian_id", guardian.id)
      .eq("student_id", studentId)
      .maybeSingle();

    if (!link) {
      throw new HttpError(403, "El alumno no está vinculado a este tutor");
    }

    const context = requestContext(req);
    const ip = context.ip ? context.ip : null;
    const userAgent = context.userAgent;
    const action = revoke ? "consent.revoked" : "consent.accepted";

    if (revoke) {
      const { data: existing, error: findError } = await admin
        .from("privacy_consents")
        .select("id")
        .eq("student_id", studentId)
        .eq("guardian_id", guardian.id)
        .eq("document_version", documentVersion)
        .is("revoked_at", null)
        .maybeSingle();

      if (findError) {
        throw new HttpError(500, "No se pudo consultar el consentimiento");
      }

      if (!existing) {
        throw new HttpError(409, "No hay un consentimiento activo de esa versión");
      }

      const { error: revokeError } = await admin
        .from("privacy_consents")
        .update({ revoked_at: new Date().toISOString(), user_agent: userAgent })
        .eq("id", existing.id);

      if (revokeError) {
        throw new HttpError(500, "No se pudo revocar el consentimiento");
      }
    } else {
      const { error: upsertError } = await admin
        .from("privacy_consents")
        .upsert(
          {
            student_id: studentId,
            guardian_id: guardian.id,
            document_version: documentVersion,
            accepted_at: new Date().toISOString(),
            revoked_at: null,
            ip,
            user_agent: userAgent,
            metadata: {
              accepted_by: profile.full_name,
              channel: "portal",
            },
          },
          { onConflict: "student_id,guardian_id,document_version" },
        );

      if (upsertError) {
        throw new HttpError(500, "No se pudo registrar el consentimiento");
      }
    }

    await audit(
      admin,
      userId,
      action,
      "student",
      studentId,
      {
        document_version: documentVersion,
        guardian_id: guardian.id,
      },
      req,
    );

    return jsonResponse({
      ok: true,
      student_id: studentId,
      document_version: documentVersion,
      status: revoke ? "revoked" : "accepted",
      recorded_at: new Date().toISOString(),
    });
  } catch (error) {
    return handleError(error);
  }
});
