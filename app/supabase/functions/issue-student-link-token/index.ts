// Emite una invitación de un solo uso para que un alumno cree su contraseña
// (SEC-02).
//
// Reemplaza la vinculación insegura de 0019. En vez de confiar en una cuenta
// que un tercero pudo registrar antes, el servidor crea la cuenta con una
// contraseña aleatoria que nunca se devuelve y entrega a la familia un token
// de 72 h. Solo quien recibe ese token puede fijar la contraseña.
//
// El token en claro se devuelve una vez; en `student_link_tokens` solo queda
// el hash SHA-256.

import {
  assertAdminOrTeacherOfGroup,
  assertAdminOrTeacherOfStudent,
  audit,
  getStudent,
  requireCaller,
} from "../_shared/auth.ts";
import {
  handleError,
  handleOptions,
  HttpError,
  jsonResponse,
  readJson,
} from "../_shared/http.ts";
import {
  generateLinkToken,
  hashLinkToken,
  LINK_TOKEN_TTL_HOURS,
  linkTokenExpiry,
} from "../_shared/tokens.ts";
import {
  asDate,
  asString,
  asUuid,
  defaultUsername,
  normalizeUsername,
  optionalString,
  randomPassword,
  studentEmail,
} from "../_shared/validation.ts";

Deno.serve(async (req) => {
  const options = handleOptions(req);
  if (options) return options;

  try {
    const { admin, userId, profile } = await requireCaller(req);
    const body = await readJson(req);

    // Reemisión para un alumno existente (por ejemplo, enlace vencido).
    if (body.student_id) {
      const studentId = asUuid(body.student_id, "student_id");
      const student = await getStudent(admin, studentId);
      await assertAdminOrTeacherOfStudent(admin, profile, student);

      const { data: studentProfile, error: studentProfileError } = await admin
        .from("profiles")
        .select("id, full_name, username, email, active")
        .eq("id", student.profile_id)
        .maybeSingle();

      if (studentProfileError) {
        throw new HttpError(500, "No se pudo consultar el perfil del alumno");
      }

      if (!studentProfile || !studentProfile.active) {
        throw new HttpError(409, "La cuenta del alumno está inactiva");
      }

      const now = new Date().toISOString();
      await admin
        .from("student_link_tokens")
        .update({ revoked_at: now })
        .eq("student_id", studentId)
        .is("used_at", null)
        .is("revoked_at", null);

      const token = generateLinkToken();
      const tokenHash = await hashLinkToken(token);
      const expiresAt = linkTokenExpiry();

      const { data: tokenRow, error: tokenError } = await admin
        .from("student_link_tokens")
        .insert({
          student_id: studentId,
          token_hash: tokenHash,
          created_by: userId,
          expires_at: expiresAt,
        })
        .select("id, expires_at")
        .single();

      if (tokenError || !tokenRow) {
        throw new HttpError(500, "No se pudo emitir la invitación");
      }

      await audit(
        admin,
        userId,
        "student.link_token_reissued",
        "student",
        studentId,
        {
          token_id: tokenRow.id,
          student_code: student.student_code,
          expires_at: expiresAt,
        },
        req,
      );

      return jsonResponse(
        {
          ok: true,
          student,
          access: {
            full_name: studentProfile.full_name,
            username: studentProfile.username,
            email: studentProfile.email,
          },
          invitation: {
            token,
            expires_at: expiresAt,
            ttl_hours: LINK_TOKEN_TTL_HOURS,
          },
        },
        201,
      );
    }

    const fullName = asString(body.full_name, "full_name", 2, 120);
    const groupId = asUuid(body.group_id, "group_id");
    const phone = optionalString(body.phone, "phone", 40);
    const birthDate = asDate(body.birth_date, "birth_date");
    const enrollmentDate = asDate(body.enrollment_date, "enrollment_date");

    await assertAdminOrTeacherOfGroup(admin, profile, groupId);

    // Usuario: el que indique el staff o uno generado del nombre.
    const requestedUsername = optionalString(body.username, "username", 32);
    let username = requestedUsername
      ? normalizeUsername(requestedUsername)
      : defaultUsername(fullName);

    let attempt = 1;
    while (attempt <= 50) {
      const { data: taken } = await admin
        .from("profiles")
        .select("id")
        .eq("username", username)
        .maybeSingle();

      if (!taken) break;

      const suffix = `.${attempt + 1}`;
      username = username.slice(0, 32 - suffix.length) + suffix;
      attempt += 1;
    }

    if (attempt > 50) {
      throw new HttpError(409, "No se pudo generar un usuario libre");
    }

    if (!/^[a-z0-9][a-z0-9._-]{2,31}$/.test(username)) {
      throw new HttpError(400, "El usuario generado no es válido");
    }

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

    // La cuenta es nueva y del dominio sintético de alumnos: no existe una
    // cuenta previa de un tercero que pueda apropiarse de la ficha. La
    // contraseña aleatoria nunca se entrega; el token es la única vía.
    const { data: authData, error: authError } = await admin.auth.admin.createUser({
      email,
      password: randomPassword(24),
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
    let studentId: string | null = null;

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
        .select("id, username, email, full_name")
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
        .select("id, student_code, group_id, status")
        .single();

      if (studentError || !student) {
        throw new HttpError(500, "No se pudo crear la ficha del alumno");
      }

      studentId = student.id;

      const token = generateLinkToken();
      const tokenHash = await hashLinkToken(token);
      const expiresAt = linkTokenExpiry();

      const { data: tokenRow, error: tokenError } = await admin
        .from("student_link_tokens")
        .insert({
          student_id: student.id,
          token_hash: tokenHash,
          created_by: userId,
          expires_at: expiresAt,
        })
        .select("id, expires_at")
        .single();

      if (tokenError || !tokenRow) {
        throw new HttpError(500, "No se pudo emitir la invitación");
      }

      await audit(
        admin,
        userId,
        "student.link_token_issued",
        "student",
        student.id,
        {
          token_id: tokenRow.id,
          student_code: studentCode,
          group_id: groupId,
          expires_at: expiresAt,
        },
        req,
      );

      return jsonResponse(
        {
          ok: true,
          student,
          access: {
            full_name: fullName,
            username,
            email,
          },
          invitation: {
            token,
            expires_at: expiresAt,
            ttl_hours: LINK_TOKEN_TTL_HOURS,
          },
        },
        201,
      );
    } catch (error) {
      // Deshacer en orden inverso a las claves foráneas.
      if (studentId) {
        await admin.from("students").delete().eq("id", studentId);
      }
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
