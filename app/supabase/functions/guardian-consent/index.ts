// Registra la aceptación o revocación del aviso de privacidad (PRIV-01).
//
// La aceptación exige:
//   - que el llamante sea tutor;
//   - que el alumno esté vinculado a ese tutor;
//   - que la versión enviada sea la vigente en `settings`;
//   - que el tutor marque explícitamente que leyó y entiende el aviso.
//
// La evidencia se guarda en `privacy_consents.metadata`: versión, URL, hash
// SHA-256 del texto, quién aceptó, canal y acuse de lectura. La URL y el hash
// los toma el servidor de `settings`, no del cliente.
//
// La revocación exige confirmación explícita y marca como revocadas **todas**
// las versiones activas de ese vínculo, para que ninguna siga dando acceso.

import type { SupabaseClient } from "jsr:@supabase/supabase-js@2";
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

async function readSettingText(
  admin: SupabaseClient,
  key: string,
): Promise<string | null> {
  const { data, error } = await admin
    .from("settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();

  if (error) {
    throw new HttpError(500, "No se pudo consultar la configuración del aviso");
  }

  const value = data?.value;
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    const candidate = (value as Record<string, unknown>)[key];
    return typeof candidate === "string" ? candidate : null;
  }

  return null;
}

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
    const accepted = asBoolean(body.accepted, "accepted", false);
    const revoke = asBoolean(body.revoke, "revoke", false);
    const acknowledged = asBoolean(body.acknowledged, "acknowledged", false);
    const confirmed = asBoolean(body.confirm, "confirm", false);

    if (accepted && revoke) {
      throw new HttpError(400, "Indica accepted o revoke, no ambos");
    }

    if (!accepted && !revoke) {
      throw new HttpError(400, "Indica accepted o revoke");
    }

    const { data: guardian, error: guardianError } = await admin
      .from("guardians")
      .select("id")
      .eq("profile_id", userId)
      .maybeSingle();

    if (guardianError) {
      throw new HttpError(500, "No se pudo consultar la ficha del tutor");
    }

    if (!guardian) {
      throw new HttpError(403, "No existe la ficha del tutor");
    }

    const { data: link, error: linkError } = await admin
      .from("student_guardians")
      .select("student_id")
      .eq("guardian_id", guardian.id)
      .eq("student_id", studentId)
      .maybeSingle();

    if (linkError) {
      throw new HttpError(500, "No se pudo verificar el vínculo con el alumno");
    }

    if (!link) {
      throw new HttpError(403, "El alumno no está vinculado a este tutor");
    }

    const context = requestContext(req);
    const ip = context.ip ? context.ip : null;
    const userAgent = context.userAgent;
    const now = new Date().toISOString();

    if (revoke) {
      if (!confirmed) {
        throw new HttpError(400, "Confirma que deseas revocar el consentimiento");
      }

      const { data: existingRows, error: findError } = await admin
        .from("privacy_consents")
        .select("id, document_version, metadata, accepted_at")
        .eq("student_id", studentId)
        .eq("guardian_id", guardian.id)
        .is("revoked_at", null)
        .order("accepted_at", { ascending: false });

      if (findError) {
        throw new HttpError(500, "No se pudo consultar el consentimiento");
      }

      if (!existingRows || existingRows.length === 0) {
        throw new HttpError(409, "No hay un consentimiento activo para revocar");
      }

      // Revoca todas las versiones activas de ese vínculo, no solo la última:
      // si el tutor aceptó v1 y v2, ninguna debe seguir dando acceso.
      for (const row of existingRows) {
        const metadata = {
          ...(row.metadata && typeof row.metadata === "object"
            ? row.metadata
            : {}),
          revoked_by: profile.full_name,
          revoked_by_profile_id: userId,
          revoked_at: now,
          revoked_channel: "portal",
          revoked_user_agent: userAgent,
        };

        const { error: revokeError } = await admin
          .from("privacy_consents")
          .update({ revoked_at: now, user_agent: userAgent, metadata })
          .eq("id", row.id);

        if (revokeError) {
          throw new HttpError(500, "No se pudo revocar el consentimiento");
        }
      }

      const latest = existingRows[0];

      await audit(
        admin,
        userId,
        "consent.revoked",
        "student",
        studentId,
        {
          document_version: latest.document_version,
          document_versions: existingRows.map((row) => row.document_version),
          guardian_id: guardian.id,
          channel: "portal",
        },
        req,
      );

      return jsonResponse({
        ok: true,
        student_id: studentId,
        document_version: latest.document_version,
        revoked_count: existingRows.length,
        status: "revoked",
        recorded_at: now,
      });
    }

    // Aceptación: el acuse de lectura es obligatorio.
    if (!acknowledged) {
      throw new HttpError(
        400,
        "Debes confirmar que leíste y entiendes el aviso de privacidad",
      );
    }

    const documentVersion = asString(
      body.document_version,
      "document_version",
      1,
      40,
    );

    const [currentVersion, documentUrl, documentHash] = await Promise.all([
      readSettingText(admin, "privacy_document_version"),
      readSettingText(admin, "privacy_document_url"),
      readSettingText(admin, "privacy_document_sha256"),
    ]);

    if (!currentVersion || !documentUrl || !documentHash) {
      throw new HttpError(
        409,
        "El aviso de privacidad no está configurado. Pide apoyo al administrador.",
      );
    }

    if (documentVersion !== currentVersion) {
      throw new HttpError(
        409,
        `La versión vigente del aviso es ${currentVersion}. Recarga la página y vuelve a intentarlo.`,
      );
    }

    const metadata = {
      accepted_by: profile.full_name,
      accepted_by_profile_id: userId,
      channel: "portal",
      document_version: currentVersion,
      document_url: documentUrl,
      document_hash: documentHash,
      acknowledged: true,
      acknowledged_at: now,
      guardian_id: guardian.id,
      user_agent: userAgent,
    };

    const { error: upsertError } = await admin
      .from("privacy_consents")
      .upsert(
        {
          student_id: studentId,
          guardian_id: guardian.id,
          document_version: currentVersion,
          accepted_at: now,
          revoked_at: null,
          ip,
          user_agent: userAgent,
          metadata,
        },
        { onConflict: "student_id,guardian_id,document_version" },
      );

    if (upsertError) {
      throw new HttpError(500, "No se pudo registrar el consentimiento");
    }

    await audit(
      admin,
      userId,
      "consent.accepted",
      "student",
      studentId,
      {
        document_version: currentVersion,
        document_url: documentUrl,
        document_hash: documentHash,
        guardian_id: guardian.id,
        channel: "portal",
      },
      req,
    );

    return jsonResponse({
      ok: true,
      student_id: studentId,
      document_version: currentVersion,
      document_url: documentUrl,
      document_hash: documentHash,
      status: "accepted",
      recorded_at: now,
    });
  } catch (error) {
    return handleError(error);
  }
});
