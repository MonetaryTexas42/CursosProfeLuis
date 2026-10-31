import { createClient, type SupabaseClient } from "jsr:@supabase/supabase-js@2";
import { HttpError, requestContext } from "./http.ts";

export type AppRole = "admin" | "teacher" | "student" | "guardian";

export interface CallerProfile {
  id: string;
  role: AppRole;
  active: boolean;
  full_name: string;
  username: string | null;
  email: string | null;
}

export interface Caller {
  admin: SupabaseClient;
  userId: string;
  profile: CallerProfile;
}

export interface StudentScope {
  id: string;
  profile_id: string;
  group_id: string;
  student_code: string;
  status: string;
}

function requiredEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) {
    throw new HttpError(500, `Falta la variable de entorno ${name}`);
  }

  return value;
}

export function adminClient(): SupabaseClient {
  return createClient(
    requiredEnv("SUPABASE_URL"),
    requiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}

export async function requireCaller(req: Request): Promise<Caller> {
  const admin = adminClient();
  const authorization = req.headers.get("Authorization") ?? "";
  const token = authorization.replace(/^Bearer\s+/i, "").trim();

  if (!token) {
    throw new HttpError(401, "Falta el token de sesión");
  }

  const { data, error } = await admin.auth.getUser(token);
  if (error || !data.user) {
    throw new HttpError(401, "Sesión inválida o expirada");
  }

  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("id, role, active, full_name, username, email")
    .eq("id", data.user.id)
    .maybeSingle();

  if (profileError) {
    throw new HttpError(500, "No se pudo consultar el perfil");
  }

  if (!profile || !profile.active) {
    throw new HttpError(403, "El perfil no existe o está inactivo");
  }

  return {
    admin,
    userId: data.user.id,
    profile: profile as CallerProfile,
  };
}

export async function getStudent(
  admin: SupabaseClient,
  studentId: string,
): Promise<StudentScope> {
  const { data, error } = await admin
    .from("students")
    .select("id, profile_id, group_id, student_code, status")
    .eq("id", studentId)
    .maybeSingle();

  if (error) {
    throw new HttpError(500, "No se pudo consultar el alumno");
  }

  if (!data) {
    throw new HttpError(404, "Alumno no encontrado");
  }

  return data as StudentScope;
}

export async function assertAdminOrTeacherOfGroup(
  admin: SupabaseClient,
  profile: CallerProfile,
  groupId: string,
): Promise<void> {
  if (profile.role === "admin") return;

  if (profile.role !== "teacher") {
    throw new HttpError(403, "Solo admin o profesor del grupo puede hacer esta acción");
  }

  const { data, error } = await admin
    .from("groups")
    .select("id")
    .eq("id", groupId)
    .eq("teacher_id", profile.id)
    .maybeSingle();

  if (error) {
    throw new HttpError(500, "No se pudo verificar el grupo");
  }

  if (!data) {
    throw new HttpError(403, "El grupo no está a tu cargo");
  }
}

export async function assertAdminOrTeacherOfStudent(
  admin: SupabaseClient,
  profile: CallerProfile,
  student: StudentScope,
): Promise<void> {
  if (profile.role === "admin") return;
  await assertAdminOrTeacherOfGroup(admin, profile, student.group_id);
}

export async function findAuthUserByEmail(
  admin: SupabaseClient,
  email: string,
): Promise<{ id: string; email?: string } | null> {
  const normalized = email.toLowerCase();

  for (let page = 1; page <= 50; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({
      page,
      perPage: 200,
    });

    if (error) {
      throw new HttpError(500, "No se pudo consultar el usuario de Auth");
    }

    const users = data.users ?? [];
    const match = users.find(
      (user) => (user.email ?? "").toLowerCase() === normalized,
    );

    if (match) return match;
    if (users.length < 200) break;
  }

  return null;
}

export async function audit(
  admin: SupabaseClient,
  actorId: string,
  action: string,
  entityType: string,
  entityId: string | null,
  after: Record<string, unknown> | null,
  req: Request,
): Promise<void> {
  const context = requestContext(req);
  const { error } = await admin.from("audit_log").insert({
    actor_id: actorId,
    action,
    entity_type: entityType,
    entity_id: entityId,
    after,
    ip: context.ip,
    user_agent: context.userAgent,
  });

  if (error) {
    console.error("audit_log_error", error.message);
  }
}
