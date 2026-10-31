import {
  assertAdminOrTeacherOfStudent,
  audit,
  findAuthUserByEmail,
  getStudent,
  requireCaller,
} from "../_shared/auth.ts";
import { handleError, handleOptions, HttpError, jsonResponse, readJson } from "../_shared/http.ts";
import { asBoolean, asEmail, asString, asUuid, optionalString } from "../_shared/validation.ts";

Deno.serve(async (req) => {
  const options = handleOptions(req);
  if (options) return options;

  try {
    const { admin, userId, profile } = await requireCaller(req);
    const body = await readJson(req);

    const studentId = asUuid(body.student_id, "student_id");
    const fullName = asString(body.full_name, "full_name", 2, 120);
    const email = asEmail(body.email);
    const phone = optionalString(body.phone, "phone", 40);
    const relationship = optionalString(body.relationship, "relationship", 40);
    const resend = asBoolean(body.resend, "resend", false);

    const student = await getStudent(admin, studentId);
    await assertAdminOrTeacherOfStudent(admin, profile, student);

    const { data: studentProfile } = await admin
      .from("profiles")
      .select("full_name")
      .eq("id", student.profile_id)
      .maybeSingle();

    const existingAuthUser = await findAuthUserByEmail(admin, email);

    if (existingAuthUser) {
      const { data: existingProfile } = await admin
        .from("profiles")
        .select("id, role")
        .eq("id", existingAuthUser.id)
        .maybeSingle();

      if (existingProfile && existingProfile.role !== "guardian") {
        throw new HttpError(409, "El correo ya pertenece a una cuenta con otro rol");
      }
    }

    const authUserId = existingAuthUser?.id ??
      (await admin.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: { role: "guardian", full_name: fullName },
      })).data.user?.id;

    if (!authUserId) {
      throw new HttpError(500, "No se pudo crear o encontrar la cuenta del tutor");
    }

    const { data: profileRow, error: profileError } = await admin
      .from("profiles")
      .upsert(
        {
          id: authUserId,
          role: "guardian",
          full_name: fullName,
          email,
          phone,
          active: true,
        },
        { onConflict: "id" },
      )
      .select("id, email, full_name, active")
      .single();

    if (profileError || !profileRow) {
      throw new HttpError(500, "No se pudo crear el perfil del tutor");
    }

    const { data: guardianRow, error: guardianError } = await admin
      .from("guardians")
      .upsert(
        {
          profile_id: authUserId,
          full_name: fullName,
          email,
          phone,
          relationship,
          active: true,
        },
        { onConflict: "email" },
      )
      .select("id, email, active")
      .single();

    if (guardianError || !guardianRow) {
      throw new HttpError(500, "No se pudo crear la ficha del tutor");
    }

    const { error: linkError } = await admin
      .from("student_guardians")
      .upsert(
        {
          student_id: studentId,
          guardian_id: guardianRow.id,
          can_receive_email: true,
        },
        { onConflict: "student_id,guardian_id" },
      );

    if (linkError) {
      throw new HttpError(500, "No se pudo vincular al tutor con el alumno");
    }

    const { data: linkData, error: linkGenError } = await admin.auth.admin.generateLink({
      type: "magiclink",
      email,
    });

    if (linkGenError || !linkData.properties?.action_link) {
      throw new HttpError(500, "No se pudo generar el enlace mágico");
    }

    const link = linkData.properties.action_link;

    const { error: outboxError } = await admin.from("email_outbox").insert({
      to_email: email,
      template: resend ? "guardian_invite_resend" : "guardian_invite",
      payload: {
        guardian_name: fullName,
        student_name: studentProfile?.full_name ?? null,
        student_code: student.student_code,
        relationship,
        link,
      },
      status: "pending",
    });

    if (outboxError) {
      console.error("email_outbox_error", outboxError.message);
    }

    await audit(
      admin,
      userId,
      resend ? "guardian.invite_resent" : "guardian.invited",
      "guardian",
      guardianRow.id,
      {
        guardian_email: email,
        student_id: studentId,
        student_code: student.student_code,
        resend,
      },
      req,
    );

    return jsonResponse(
      {
        ok: true,
        guardian_id: guardianRow.id,
        email,
        resend,
        // El enlace se entrega por correo; aquí solo para depuración o entrega impresa.
        magic_link: link,
      },
      201,
    );
  } catch (error) {
    return handleError(error);
  }
});
