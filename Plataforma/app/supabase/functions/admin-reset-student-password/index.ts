import {
  assertAdminOrTeacherOfStudent,
  audit,
  getStudent,
  requireCaller,
  type StudentScope,
} from "../_shared/auth.ts";
import { handleError, handleOptions, HttpError, jsonResponse, readJson } from "../_shared/http.ts";
import {
  asString,
  asUuid,
  normalizeUsername,
  randomPassword,
} from "../_shared/validation.ts";

async function findStudentByUsername(
  admin: ReturnType<typeof import("../_shared/auth.ts")["adminClient"]>,
  username: string,
): Promise<{ student: StudentScope; profileId: string }> {
  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("id, role, username")
    .eq("username", username)
    .maybeSingle();

  if (profileError) {
    throw new HttpError(500, "No se pudo consultar el perfil");
  }

  if (!profile || profile.role !== "student") {
    throw new HttpError(404, "Alumno no encontrado");
  }

  const { data: student, error: studentError } = await admin
    .from("students")
    .select("id, profile_id, group_id, student_code, status")
    .eq("profile_id", profile.id)
    .maybeSingle();

  if (studentError) {
    throw new HttpError(500, "No se pudo consultar el alumno");
  }

  if (!student) {
    throw new HttpError(404, "Alumno no encontrado");
  }

  return { student: student as StudentScope, profileId: profile.id };
}

Deno.serve(async (req) => {
  const options = handleOptions(req);
  if (options) return options;

  try {
    const { admin, userId, profile } = await requireCaller(req);
    const body = await readJson(req);

    if (profile.role !== "admin" && profile.role !== "teacher") {
      throw new HttpError(403, "Solo admin o profesor puede restablecer contraseñas");
    }

    let student: StudentScope;

    if (body.student_id !== undefined && body.student_id !== null) {
      student = await getStudent(admin, asUuid(body.student_id, "student_id"));
    } else if (body.username !== undefined && body.username !== null) {
      const username = normalizeUsername(body.username);
      const result = await findStudentByUsername(admin, username);
      student = result.student;
    } else {
      throw new HttpError(400, "Indica student_id o username");
    }

    await assertAdminOrTeacherOfStudent(admin, profile, student);

    const { data: studentProfile, error: studentProfileError } = await admin
      .from("profiles")
      .select("id, username, email, role, active")
      .eq("id", student.profile_id)
      .maybeSingle();

    if (studentProfileError) {
      throw new HttpError(500, "No se pudo consultar el perfil del alumno");
    }

    if (!studentProfile || studentProfile.role !== "student") {
      throw new HttpError(404, "Alumno no encontrado");
    }

    const temporaryPassword = randomPassword();

    const { error: authError } = await admin.auth.admin.updateUserById(
      student.profile_id,
      {
        password: temporaryPassword,
        user_metadata: { must_change_password: true },
      },
    );

    if (authError) {
      throw new HttpError(500, "No se pudo restablecer la contraseña");
    }

    const { error: profileError } = await admin
      .from("profiles")
      .update({
        must_change_password: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", student.profile_id);

    if (profileError) {
      throw new HttpError(500, "No se pudo actualizar el perfil del alumno");
    }

    await audit(
      admin,
      userId,
      "student.password_reset",
      "student",
      student.id,
      {
        student_code: student.student_code,
        username: studentProfile.username,
        must_change_password: true,
      },
      req,
    );

    return jsonResponse({
      ok: true,
      student_id: student.id,
      username: studentProfile.username,
      temporary_password: temporaryPassword,
      must_change_password: true,
    });
  } catch (error) {
    return handleError(error);
  }
});
