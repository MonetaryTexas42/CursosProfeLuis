import {
  assertAdminOrTeacherOfGroup,
  audit,
  requireCaller,
} from "../_shared/auth.ts";
import { handleError, handleOptions, HttpError, jsonResponse, readJson } from "../_shared/http.ts";
import {
  asDate,
  asString,
  asUuid,
  normalizeUsername,
  optionalString,
  studentEmail,
} from "../_shared/validation.ts";

Deno.serve(async (req) => {
  const options = handleOptions(req);
  if (options) return options;

  try {
    const { admin, userId, profile } = await requireCaller(req);
    const body = await readJson(req);

    const fullName = asString(body.full_name, "full_name", 2, 120);
    const username = normalizeUsername(body.username);
    const password = asString(body.password, "password", 8, 72);
    const groupId = asUuid(body.group_id, "group_id");
    const phone = optionalString(body.phone, "phone", 40);
    const birthDate = asDate(body.birth_date, "birth_date");
    const enrollmentDate = asDate(body.enrollment_date, "enrollment_date");
    const studentCode = (body.student_code
      ? asString(body.student_code, "student_code", 3, 32)
      : username
    ).toUpperCase();

    if (!/^[A-Z0-9._-]{3,32}$/.test(studentCode)) {
      throw new HttpError(
        400,
        "student_code debe usar solo A-Z, 0-9, punto, guion o guion bajo",
      );
    }

    await assertAdminOrTeacherOfGroup(admin, profile, groupId);

    const email = studentEmail(username);

    const [{ data: profileByUsername }, { data: profileByEmail }, { data: studentByCode }] =
      await Promise.all([
        admin.from("profiles").select("id").eq("username", username).maybeSingle(),
        admin.from("profiles").select("id").eq("email", email).maybeSingle(),
        admin.from("students").select("id").eq("student_code", studentCode).maybeSingle(),
      ]);

    if (profileByUsername || profileByEmail) {
      throw new HttpError(409, "El usuario o correo ya existe");
    }

    if (studentByCode) {
      throw new HttpError(409, "La matrícula ya existe");
    }

    const { data: authData, error: authError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role: "student",
        full_name: fullName,
        username,
        must_change_password: true,
      },
    });

    if (authError || !authData.user) {
      throw new HttpError(400, "No se pudo crear la cuenta de acceso");
    }

    let profileId: string | null = null;

    try {
      const { data: newProfile, error: profileError } = await admin
        .from("profiles")
        .insert({
          id: authData.user.id,
          role: "student",
          full_name: fullName,
          username,
          email,
          phone,
          active: true,
          must_change_password: true,
        })
        .select("id, username, email, full_name, must_change_password")
        .single();

      if (profileError || !newProfile) {
        throw new HttpError(500, "No se pudo crear el perfil del alumno");
      }

      profileId = newProfile.id;

      const { data: student, error: studentError } = await admin
        .from("students")
        .insert({
          profile_id: newProfile.id,
          group_id: groupId,
          student_code: studentCode,
          birth_date: birthDate,
          enrollment_date: enrollmentDate ?? new Date().toISOString().slice(0, 10),
        })
        .select("id, student_code, group_id, status, enrollment_date")
        .single();

      if (studentError || !student) {
        throw new HttpError(500, "No se pudo crear la ficha del alumno");
      }

      await audit(
        admin,
        userId,
        "student.created",
        "student",
        student.id,
        {
          profile_id: newProfile.id,
          username,
          student_code: studentCode,
          group_id: groupId,
        },
        req,
      );

      return jsonResponse(
        {
          ok: true,
          profile: newProfile,
          student,
          access: {
            username,
            email,
            must_change_password: true,
          },
        },
        201,
      );
    } catch (error) {
      if (profileId) {
        await admin.from("profiles").delete().eq("id", profileId);
      }
      await admin.auth.admin.deleteUser(authData.user.id);
      throw error;
    }
  } catch (error) {
    return handleError(error);
  }
});
