// Suite de RLS negativa (COD-07).
//
// Cada prueba expresa el comportamiento SEGURO esperado, no el actual. Por eso
// la suite falla hoy en los casos afectados por SEC-01 y PRIV-02: es su función.
// Se ejecuta con `scripts/run-rls-tests.mjs` y no escribe datos.
//
// Convenciones:
// - `sql` debe devolver una sola fila y una sola columna.
// - `expected` es un número o un booleano.
// - `requires` indica qué identidades ficticias deben existir; si falta alguna,
//   la prueba se marca SKIP (no PASS).
// - `params` recibe el objeto de fixtures y devuelve los valores de `$1...$n`.

export const roleSanity = {
  anon: {
    description: "auth.uid() es null para anon",
    expected: true,
    sql: "select (auth.uid() is null) as ok",
  },
  student1: {
    description: "El JWT resuelve al alumno con asignación",
    expected: true,
    sql: "select (public.app_student_id() = $1::uuid) as ok",
    params: (f) => [f.student1_id],
  },
  student2: {
    description: "El JWT resuelve al alumno sin asignación",
    expected: true,
    sql: "select (public.app_student_id() = $1::uuid) as ok",
    params: (f) => [f.student2_id],
  },
  guardian1: {
    description: "El JWT resuelve al tutor vinculado",
    expected: true,
    sql: "select (public.app_guardian_id() = $1::uuid) as ok",
    params: (f) => [f.guardian1_id],
  },
  guardian2: {
    description: "El JWT resuelve al tutor sin vínculos",
    expected: true,
    sql: "select (public.app_guardian_id() = $1::uuid) as ok",
    params: (f) => [f.guardian2_id],
  },
  guardian3: {
    description: "El JWT resuelve al tutor con consentimiento",
    expected: true,
    sql: "select (public.app_guardian_id() = $1::uuid) as ok",
    params: (f) => [f.guardian3_id],
  },
  teacher: {
    description: "El JWT resuelve a un profesor activo",
    expected: true,
    sql: "select (public.app_current_role() = 'teacher'::public.user_role) as ok",
  },
  teacher_other: {
    description: "El JWT resuelve a otro profesor activo",
    expected: true,
    sql: "select (public.app_current_role() = 'teacher'::public.user_role) as ok",
  },
  admin: {
    description: "El JWT resuelve a un administrador activo",
    expected: true,
    sql: "select public.app_is_admin() as ok",
  },
};

const zero = (id, role, description, sql, extra = {}) => ({
  id,
  role,
  description,
  expected: 0,
  sql,
  ...extra,
});

const yes = (id, role, description, sql, extra = {}) => ({
  id,
  role,
  description,
  expected: true,
  sql,
  ...extra,
});

export const checks = [
  // ---------------------------------------------------------------- anónimo
  zero("RLS-80", "anon", "Anónimo no ve unidades", "select count(*)::int as n from public.units"),
  zero("RLS-81", "anon", "Anónimo no ve versiones de contenido", "select count(*)::int as n from public.unit_versions"),
  zero("RLS-82", "anon", "Anónimo no ve alumnos", "select count(*)::int as n from public.students"),
  zero("RLS-83", "anon", "Anónimo no ve pagos", "select count(*)::int as n from public.payments"),
  zero("RLS-84", "anon", "Anónimo no ve perfiles", "select count(*)::int as n from public.profiles"),

  // ------------------------------------------- alumno SIN asignación (SEC-01)
  zero("RLS-01", "student2", "Alumno sin asignación no ve unidades", "select count(*)::int as n from public.units", { requires: ["student2"] }),
  zero("RLS-02", "student2", "Alumno sin asignación no ve versiones", "select count(*)::int as n from public.unit_versions", { requires: ["student2"] }),
  zero(
    "RLS-03",
    "student2",
    "Alumno sin asignación no ve asignaciones de otros grupos",
    "select count(*)::int as n from public.unit_assignments a where not public.app_student_in_group(a.group_id)",
    { requires: ["student2"] },
  ),
  zero("RLS-04", "student2", "Alumno sin asignación no tiene progreso visible", "select count(*)::int as n from public.unit_progress", { requires: ["student2"] }),
  zero("RLS-05", "student2", "Alumno sin asignación no tiene intentos de ejercicio", "select count(*)::int as n from public.exercise_attempts", { requires: ["student2"] }),
  zero("RLS-06", "student2", "Alumno sin asignación no tiene intentos de quiz", "select count(*)::int as n from public.quiz_attempts", { requires: ["student2"] }),

  // --------------------------------------------- alumno CON asignación (SEC-01)
  zero(
    "RLS-10",
    "student1",
    "Toda unidad visible está respaldada por una asignación activa",
    "select count(*)::int as n from public.units u where not public.app_has_active_unit(u.id)",
    { requires: ["student1"] },
  ),
  zero(
    "RLS-11",
    "student1",
    "Toda versión visible está respaldada por una asignación activa",
    "select count(*)::int as n from public.unit_versions v where not public.app_can_access_version(v.id)",
    { requires: ["student1"] },
  ),
  yes(
    "RLS-12",
    "student1",
    "El alumno con asignación sí ve al menos una unidad",
    "select (count(*) > 0) as ok from public.units",
    { requires: ["student1"] },
  ),
  yes(
    "RLS-13",
    "student1",
    "El alumno con asignación sí ve al menos una versión",
    "select (count(*) > 0) as ok from public.unit_versions",
    { requires: ["student1"] },
  ),
  zero(
    "RLS-14",
    "student1",
    "El alumno no ve unidades en borrador o archivadas",
    "select count(*)::int as n from public.units u where u.status <> 'published'::public.unit_status",
    { requires: ["student1"] },
  ),
  zero(
    "RLS-15",
    "student1",
    "El alumno solo ve su propia fila de students",
    "select count(*)::int as n from public.students s where s.id <> public.app_student_id()",
    { requires: ["student1"] },
  ),
  zero(
    "RLS-16",
    "student1",
    "El alumno no puede leer la columna students.notes_internal (PRIV-02)",
    "select count(*)::int as n from information_schema.columns where table_schema = 'public' and table_name = 'students' and column_name = 'notes_internal'",
    { requires: ["student1"] },
  ),
  zero(
    "RLS-17",
    "student1",
    "El alumno solo ve su propio perfil",
    "select count(*)::int as n from public.profiles p where p.id <> auth.uid()",
    { requires: ["student1"] },
  ),
  zero(
    "RLS-18",
    "student1",
    "El alumno solo ve su propio grupo",
    "select count(*)::int as n from public.groups g where not exists (select 1 from public.students s where s.group_id = g.id and s.profile_id = auth.uid())",
    { requires: ["student1"] },
  ),
  zero(
    "RLS-19",
    "student1",
    "El alumno no lee la tabla cruda del perfil vocacional; usa student_guidance (PRIV-03)",
    "select count(*)::int as n from public.student_profiles",
    { requires: ["student1"] },
  ),
  zero(
    "RLS-20",
    "student1",
    "El alumno solo ve su propio progreso",
    "select count(*)::int as n from public.unit_progress up where up.student_id <> public.app_student_id()",
    { requires: ["student1"] },
  ),
  zero(
    "RLS-21",
    "student1",
    "El alumno solo ve sus intentos de ejercicio",
    "select count(*)::int as n from public.exercise_attempts ea where ea.student_id <> public.app_student_id()",
    { requires: ["student1"] },
  ),
  zero(
    "RLS-22",
    "student1",
    "El alumno solo ve sus intentos de quiz",
    "select count(*)::int as n from public.quiz_attempts qa where qa.student_id <> public.app_student_id()",
    { requires: ["student1"] },
  ),
  zero(
    "RLS-23",
    "student1",
    "El alumno no ve pagos (0021)",
    "select count(*)::int as n from public.payments",
    { requires: ["student1"] },
  ),
  zero(
    "RLS-24",
    "student1",
    "El alumno no ve su configuración de cobro (0021)",
    "select count(*)::int as n from public.student_billing",
    { requires: ["student1"] },
  ),
  zero(
    "RLS-25",
    "student1",
    "El alumno solo ve sus propios consentimientos",
    "select count(*)::int as n from public.privacy_consents pc where pc.student_id <> public.app_student_id()",
    { requires: ["student1"] },
  ),
  zero(
    "RLS-26",
    "student1",
    "El alumno solo ve observaciones familiares propias",
    "select count(*)::int as n from public.observations o where o.visibility <> 'family'::public.observation_visibility or o.student_id <> public.app_student_id()",
    { requires: ["student1"] },
  ),
  zero(
    "RLS-27",
    "student1",
    "El alumno solo ve evaluaciones visibles de su grupo",
    "select count(*)::int as n from public.assessments a where not (a.visible_to_guardian and exists (select 1 from public.students s where s.group_id = a.group_id and s.profile_id = auth.uid()))",
    { requires: ["student1"] },
  ),
  zero(
    "RLS-28",
    "student1",
    "El alumno solo ve sus propias calificaciones",
    "select count(*)::int as n from public.grades g where g.student_id <> public.app_student_id()",
    { requires: ["student1"] },
  ),
  zero(
    "RLS-29",
    "student1",
    "El alumno solo ve su propia asistencia",
    "select count(*)::int as n from public.attendance a where a.student_id <> public.app_student_id()",
    { requires: ["student1"] },
  ),
  zero(
    "RLS-30",
    "student1",
    "El alumno solo ve sus propias estadísticas",
    "select count(*)::int as n from public.student_stats st where st.student_id <> public.app_student_id()",
    { requires: ["student1"] },
  ),
  zero(
    "RLS-31",
    "student1",
    "El alumno solo ve sus propias tareas",
    "select count(*)::int as n from public.task_status ts where ts.student_id <> public.app_student_id()",
    { requires: ["student1"] },
  ),
  zero(
    "RLS-32",
    "student1",
    "El alumno solo ve sus propias insignias",
    "select count(*)::int as n from public.student_badges sb where sb.student_id <> public.app_student_id()",
    { requires: ["student1"] },
  ),

  // ---------------------------------------------------------------- tutor 1
  zero("RLS-40", "guardian1", "El tutor no ve versiones de contenido", "select count(*)::int as n from public.unit_versions", { requires: ["guardian1"] }),
  zero("RLS-41", "guardian1", "El tutor no ve unidades", "select count(*)::int as n from public.units", { requires: ["guardian1"] }),
  zero(
    "RLS-42",
    "guardian1",
    "El tutor solo ve alumnos vinculados",
    "select count(*)::int as n from public.students s where not public.app_is_guardian_of(s.id)",
    { requires: ["guardian1"] },
  ),
  zero(
    "RLS-43",
    "guardian1",
    "El tutor solo ve observaciones familiares de sus hijos",
    "select count(*)::int as n from public.observations o where o.visibility <> 'family'::public.observation_visibility or not public.app_is_guardian_of(o.student_id)",
    { requires: ["guardian1"] },
  ),
  zero(
    "RLS-44",
    "guardian1",
    "El tutor solo ve pagos de sus hijos",
    "select count(*)::int as n from public.payments p where not public.app_is_guardian_of(p.student_id)",
    { requires: ["guardian1"] },
  ),
  zero(
    "RLS-45",
    "guardian1",
    "El tutor solo ve la configuración de cobro de sus hijos",
    "select count(*)::int as n from public.student_billing sb where not public.app_is_guardian_of(sb.student_id)",
    { requires: ["guardian1"] },
  ),
  zero(
    "RLS-46",
    "guardian1",
    "El tutor solo ve sus propios consentimientos",
    "select count(*)::int as n from public.privacy_consents pc where pc.guardian_id <> public.app_guardian_id()",
    { requires: ["guardian1"] },
  ),
  zero(
    "RLS-47",
    "guardian1",
    "El tutor no lee la tabla cruda del perfil vocacional; usa student_guidance (PRIV-03)",
    "select count(*)::int as n from public.student_profiles",
    { requires: ["guardian1"] },
  ),
  zero(
    "RLS-48",
    "guardian1",
    "El tutor solo ve el progreso de sus hijos",
    "select count(*)::int as n from public.unit_progress up where not public.app_is_guardian_of(up.student_id)",
    { requires: ["guardian1"] },
  ),
  zero(
    "RLS-49",
    "guardian1",
    "El tutor solo ve grupos donde estudia un hijo",
    "select count(*)::int as n from public.groups g where not public.app_guardian_has_student_in_group(g.id)",
    { requires: ["guardian1"] },
  ),
  zero(
    "RLS-50",
    "guardian1",
    "El tutor no puede leer la columna students.notes_internal (PRIV-02)",
    "select count(*)::int as n from information_schema.columns where table_schema = 'public' and table_name = 'students' and column_name = 'notes_internal'",
    { requires: ["guardian1"] },
  ),
  zero(
    "RLS-51",
    "guardian1",
    "El tutor solo ve evaluaciones visibles de sus hijos",
    "select count(*)::int as n from public.assessments a where not (a.visible_to_guardian and public.app_guardian_has_student_in_group(a.group_id))",
    { requires: ["guardian1"] },
  ),

  // ---------------------------------------------------------------- tutor 2
  zero("RLS-55", "guardian2", "El tutor sin vínculos no ve alumnos", "select count(*)::int as n from public.students", { requires: ["guardian2"] }),
  zero("RLS-56", "guardian2", "El tutor sin vínculos no ve pagos", "select count(*)::int as n from public.payments", { requires: ["guardian2"] }),
  zero("RLS-57", "guardian2", "El tutor sin vínculos no ve observaciones", "select count(*)::int as n from public.observations", { requires: ["guardian2"] }),
  zero("RLS-58", "guardian2", "El tutor sin vínculos no ve consentimientos", "select count(*)::int as n from public.privacy_consents", { requires: ["guardian2"] }),
  zero(
    "RLS-59",
    "guardian2",
    "El tutor sin vínculos solo se ve a sí mismo en profiles",
    "select count(*)::int as n from public.profiles p where p.id <> auth.uid()",
    { requires: ["guardian2"] },
  ),

  // --------------------------------------------------------------- profesor
  yes("RLS-60", "teacher", "El profesor ve el catálogo de unidades", "select (count(*) > 0) as ok from public.units", { requires: ["teacher"] }),
  yes("RLS-61", "teacher", "El profesor ve las versiones de contenido", "select (count(*) > 0) as ok from public.unit_versions", { requires: ["teacher"] }),
  zero(
    "RLS-62",
    "teacher",
    "El profesor solo ve alumnos de sus grupos",
    "select count(*)::int as n from public.students s where not public.app_is_teacher_of_student(s.id)",
    { requires: ["teacher"] },
  ),
  zero(
    "RLS-63",
    "teacher",
    "El profesor solo ve sus propios grupos",
    "select count(*)::int as n from public.groups g where g.teacher_id <> auth.uid()",
    { requires: ["teacher"] },
  ),
  zero(
    "RLS-64",
    "teacher",
    "El profesor solo ve observaciones de sus alumnos",
    "select count(*)::int as n from public.observations o where not public.app_is_teacher_of_student(o.student_id)",
    { requires: ["teacher"] },
  ),
  zero(
    "RLS-65",
    "teacher",
    "El profesor solo ve pagos de sus alumnos",
    "select count(*)::int as n from public.payments p where not public.app_is_teacher_of_student(p.student_id)",
    { requires: ["teacher"] },
  ),
  zero(
    "RLS-66",
    "teacher",
    "El profesor solo ve perfiles de sus alumnos",
    "select count(*)::int as n from public.student_profiles sp where not public.app_is_teacher_of_student(sp.student_id)",
    { requires: ["teacher"] },
  ),
  zero(
    "RLS-67",
    "teacher",
    "El profesor solo ve calificaciones de sus alumnos",
    "select count(*)::int as n from public.grades g where not public.app_student_has_assessment(g.student_id, g.assessment_id)",
    { requires: ["teacher"] },
  ),
  zero("RLS-68", "teacher", "El profesor no ve el log de auditoría", "select count(*)::int as n from public.audit_log", { requires: ["teacher"] }),
  zero("RLS-69", "teacher", "El profesor no ve la cola de correos", "select count(*)::int as n from public.email_outbox", { requires: ["teacher"] }),

  // ------------------------------------------------- profesor de otro grupo
  zero(
    "RLS-70",
    "teacher_other",
    "Otro profesor no ve la fila del alumno ajeno",
    "select count(*)::int as n from public.students s where s.id = $1::uuid",
    { requires: ["teacher_other", "student1_id"], params: (f) => [f.student1_id] },
  ),
  zero(
    "RLS-71",
    "teacher_other",
    "Otro profesor no ve el perfil del alumno ajeno",
    "select count(*)::int as n from public.profiles p where p.id = $1::uuid",
    { requires: ["teacher_other", "student1"], params: (f) => [f.student1] },
  ),
  zero(
    "RLS-72",
    "teacher_other",
    "Otro profesor no ve el perfil psicopedagógico ajeno",
    "select count(*)::int as n from public.student_profiles sp where sp.student_id = $1::uuid",
    { requires: ["teacher_other", "student1_id"], params: (f) => [f.student1_id] },
  ),
  zero(
    "RLS-73",
    "teacher_other",
    "Otro profesor no ve observaciones del alumno ajeno",
    "select count(*)::int as n from public.observations o where o.student_id = $1::uuid",
    { requires: ["teacher_other", "student1_id"], params: (f) => [f.student1_id] },
  ),

  // ------------------------------------------ notas internas del staff (PRIV-02)
  zero(
    "RLS-85",
    "student1",
    "El alumno no ve notas internas del staff",
    "select count(*)::int as n from public.student_staff_notes",
    { requires: ["student1"] },
  ),
  zero(
    "RLS-86",
    "guardian1",
    "El tutor no ve notas internas del staff",
    "select count(*)::int as n from public.student_staff_notes",
    { requires: ["guardian1"] },
  ),
  yes(
    "RLS-87",
    "teacher",
    "El profesor ve la nota interna de su alumno",
    "select (count(*) > 0) as ok from public.student_staff_notes",
    { requires: ["teacher"] },
  ),
  yes(
    "RLS-88",
    "admin",
    "El admin ve las notas internas",
    "select (count(*) > 0) as ok from public.student_staff_notes",
    { requires: ["admin"] },
  ),

  // ------------------------------------ cambio de contraseña en servidor (SEC-03)
  zero(
    "RLS-89",
    "student1",
    "La RPC que limpiaba must_change_password ya no existe",
    "select count(*)::int as n from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' and p.proname = 'app_complete_password_change'",
    { requires: ["student1"] },
  ),
  yes(
    "RLS-90",
    "admin",
    "profiles registra password_changed_at",
    "select (count(*) > 0) as ok from information_schema.columns where table_schema = 'public' and table_name = 'profiles' and column_name = 'password_changed_at'",
    { requires: ["admin"] },
  ),
  zero(
    "RLS-91",
    "student1",
    "El alumno no puede limpiar must_change_password por REST",
    "with changed as (update public.profiles set must_change_password = false where id = auth.uid() returning 1) select count(*)::int as n from changed",
    { requires: ["student1"] },
  ),

  // ------------------------------------- invitaciones de alumno con token (SEC-02)
  zero(
    "RLS-92",
    "student1",
    "El alumno no ve tokens de vinculación",
    "select count(*)::int as n from public.student_link_tokens",
    { requires: ["student1"] },
  ),
  zero(
    "RLS-93",
    "teacher",
    "El profesor no lee tokens por PostgREST",
    "select count(*)::int as n from public.student_link_tokens",
    { requires: ["teacher"] },
  ),
  zero(
    "RLS-94",
    "admin",
    "El admin tampoco lee tokens por PostgREST",
    "select count(*)::int as n from public.student_link_tokens",
    { requires: ["admin"] },
  ),
  zero(
    "RLS-95",
    "student1",
    "La RPC de vinculación insegura ya no existe",
    "select count(*)::int as n from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' and p.proname = 'app_link_student_account'",
    { requires: ["student1"] },
  ),
  yes(
    "RLS-96",
    "admin",
    "student_link_tokens tiene RLS activo",
    "select c.relrowsecurity as ok from pg_class c join pg_namespace n on n.oid = c.relnamespace where n.nspname = 'public' and c.relname = 'student_link_tokens'",
    { requires: ["admin"] },
  ),
  yes(
    "RLS-97",
    "admin",
    "student_link_tokens no guarda el token en claro",
    "select (count(*) = 0) as ok from information_schema.columns where table_schema = 'public' and table_name = 'student_link_tokens' and column_name = 'token'",
    { requires: ["admin"] },
  ),

  // --------------------------- aviso de privacidad y bloqueo del tutor (PRIV-01)
  zero(
    "RLS-98",
    "guardian1",
    "El tutor sin consentimiento no ve al alumno",
    "select count(*)::int as n from public.students",
    { requires: ["guardian1", "student1_id"] },
  ),
  zero(
    "RLS-99",
    "guardian1",
    "El tutor sin consentimiento no ve el perfil del alumno",
    "select count(*)::int as n from public.profiles where id = $1::uuid",
    { requires: ["guardian1", "student1"], params: (f) => [f.student1] },
  ),
  zero(
    "RLS-100",
    "guardian1",
    "El tutor sin consentimiento no ve el grupo del alumno",
    "select count(*)::int as n from public.groups where id = $1::uuid",
    { requires: ["guardian1", "student1_group"], params: (f) => [f.student1_group] },
  ),
  yes(
    "RLS-101",
    "guardian1",
    "El tutor sin consentimiento sí ve su vínculo para poder aceptar",
    "select (count(*) = 1) as ok from public.student_guardians where guardian_id = $1::uuid and student_id = $2::uuid",
    { requires: ["guardian1_id", "student1_id"], params: (f) => [f.guardian1_id, f.student1_id] },
  ),
  zero(
    "RLS-102",
    "guardian1",
    "El tutor sin consentimiento no ve cuentas ni pagos",
    "select ((select count(*) from public.student_billing) + (select count(*) from public.payments))::int as n",
    { requires: ["guardian1"] },
  ),
  yes(
    "RLS-103",
    "guardian3",
    "El tutor con consentimiento ve solo al alumno consentido",
    "select (count(*) = 1) as ok from public.students",
    { requires: ["guardian3", "student1_id", "student2_id"] },
  ),
  zero(
    "RLS-104",
    "guardian3",
    "Un consentimiento revocado no da acceso al alumno",
    "select count(*)::int as n from public.profiles where id = $1::uuid",
    { requires: ["guardian3", "student1"], params: (f) => [f.student1] },
  ),
  yes(
    "RLS-105",
    "guardian3",
    "app_guardian_has_consent distingue vigente de revocado",
    "select (public.app_guardian_has_consent($1::uuid) and not public.app_guardian_has_consent($2::uuid)) as ok",
    {
      requires: ["guardian3", "student1_id", "student2_id"],
      params: (f) => [f.student2_id, f.student1_id],
    },
  ),
  yes(
    "RLS-106",
    "anon",
    "El aviso público expone versión, URL y hash sin datos personales",
    "select (count(*) = 1 and bool_and(version <> '' and url <> '' and sha256 ~ '^[0-9a-f]{64}$')) as ok from public.privacy_document",
  ),
  zero(
    "RLS-107",
    "guardian1",
    "El tutor no puede fabricar un consentimiento por PostgREST",
    "select count(*)::int as n from pg_policies where schemaname = 'public' and tablename = 'privacy_consents' and policyname = 'privacy_consents_guardian_insert'",
    { requires: ["guardian1"] },
  ),

  // ------------------------------------------ offboarding real (SEC-04)
  yes(
    "RLS-108",
    "admin",
    "profiles registra fecha, actor y motivo de la desactivación (SEC-04)",
    `select (count(*) = 3) as ok
       from information_schema.columns
      where table_schema = 'public' and table_name = 'profiles'
        and column_name in ('deactivated_at', 'deactivated_by', 'deactivation_reason')`,
    { requires: ["admin"] },
  ),
  yes(
    "RLS-109",
    "admin",
    "El motivo de desactivación tiene límite de longitud (SEC-04)",
    `select (count(*) = 1) as ok
       from pg_constraint
      where conrelid = 'public.profiles'::regclass
        and conname = 'profiles_deactivation_reason_len'`,
    { requires: ["admin"] },
  ),

  // ------------------------------- perfil vocacional curado (PRIV-03)
  yes(
    "RLS-110",
    "admin",
    "student_guidance existe y no expone notas internas ni áreas a trabajar",
    `select (
       (select count(*) from information_schema.columns
         where table_schema = 'public' and table_name = 'student_guidance') > 0
       and (select count(*) from information_schema.columns
             where table_schema = 'public' and table_name = 'student_guidance'
               and column_name in ('weaknesses', 'vocational_notes', 'extras')) = 0
     ) as ok`,
    { requires: ["admin"] },
  ),
  yes(
    "RLS-111",
    "admin",
    "student_profiles_select ya no usa app_can_access_student (PRIV-03)",
    `select (count(*) = 0) as ok
       from pg_policies
      where schemaname = 'public' and tablename = 'student_profiles'
        and policyname = 'student_profiles_select'
        and coalesce(qual, '') like '%app_can_access_student%'`,
    { requires: ["admin"] },
  ),
  yes(
    "RLS-112",
    "admin",
    "student_profiles_select deja la tabla cruda al personal docente (PRIV-03)",
    `select (count(*) = 1) as ok
       from pg_policies
      where schemaname = 'public' and tablename = 'student_profiles'
        and policyname = 'student_profiles_select'
        and coalesce(qual, '') like '%app_is_teacher_of_student%'`,
    { requires: ["admin"] },
  ),
  zero(
    "RLS-113",
    "student1",
    "El alumno no ve el resumen vocacional de otros alumnos (PRIV-03)",
    "select count(*)::int as n from public.student_guidance g where g.student_id <> public.app_student_id()",
    { requires: ["student1"] },
  ),
  zero(
    "RLS-114",
    "guardian1",
    "El tutor sin consentimiento no ve el resumen vocacional (PRIV-03)",
    "select count(*)::int as n from public.student_guidance",
    { requires: ["guardian1"] },
  ),
  zero(
    "RLS-115",
    "guardian3",
    "El tutor con consentimiento no ve el resumen de un alumno no consentido (PRIV-03)",
    "select count(*)::int as n from public.student_guidance g where g.student_id <> $1::uuid",
    { requires: ["guardian3", "student2_id"], params: (f) => [f.student2_id] },
  ),
  zero(
    "RLS-116",
    "teacher",
    "El profesor solo ve el resumen vocacional de sus alumnos (PRIV-03)",
    "select count(*)::int as n from public.student_guidance g where not public.app_is_teacher_of_student(g.student_id)",
    { requires: ["teacher"] },
  ),
  zero(
    "RLS-117",
    "teacher_other",
    "Otro profesor no ve el resumen vocacional del alumno ajeno (PRIV-03)",
    "select count(*)::int as n from public.student_guidance g where g.student_id = $1::uuid",
    { requires: ["teacher_other", "student1_id"], params: (f) => [f.student1_id] },
  ),

  // ------------------------------ pagos con trazabilidad (FUN-02)
  yes(
    "RLS-118",
    "admin",
    "payments guarda periodo, estado, folio, idempotencia y anulación (FUN-02)",
    `select (count(*) = 8) as ok
       from information_schema.columns
      where table_schema = 'public' and table_name = 'payments'
        and column_name in (
          'period_start', 'period_end', 'status', 'receipt_no',
          'idempotency_key', 'voided_at', 'voided_by', 'void_reason'
        )`,
    { requires: ["admin"] },
  ),
  yes(
    "RLS-119",
    "admin",
    "payments no tiene política de DELETE: el historial no se borra (FUN-02)",
    `select (count(*) = 0) as ok
       from pg_policies
      where schemaname = 'public' and tablename = 'payments' and cmd = 'DELETE'`,
    { requires: ["admin"] },
  ),
  yes(
    "RLS-120",
    "admin",
    "app_void_payment es SECURITY DEFINER con search_path fijo (FUN-02)",
    `select (count(*) = 1) as ok
       from pg_proc p
       join pg_namespace n on n.oid = p.pronamespace
      where n.nspname = 'public' and p.proname = 'app_void_payment'
        and p.prosecdef
        and exists (
          select 1 from unnest(coalesce(p.proconfig, '{}'::text[])) as c
           where c like 'search_path=%'
        )`,
    { requires: ["admin"] },
  ),
  yes(
    "RLS-121",
    "admin",
    "student_billing_status respeta la RLS del invocador (FUN-02)",
    `select (
       (select count(*) from pg_views
         where schemaname = 'public' and viewname = 'student_billing_status') = 1
       and (select coalesce(array_to_string(c.reloptions, ','), '') like '%security_invoker=true%'
              from pg_class c
              join pg_namespace n on n.oid = c.relnamespace
             where n.nspname = 'public' and c.relname = 'student_billing_status')
     ) as ok`,
    { requires: ["admin"] },
  ),
  yes(
    "RLS-122",
    "admin",
    "payment_duplicates respeta la RLS del invocador (FUN-02)",
    `select (
       (select count(*) from pg_views
         where schemaname = 'public' and viewname = 'payment_duplicates') = 1
       and (select coalesce(array_to_string(c.reloptions, ','), '') like '%security_invoker=true%'
              from pg_class c
              join pg_namespace n on n.oid = c.relnamespace
             where n.nspname = 'public' and c.relname = 'payment_duplicates')
     ) as ok`,
    { requires: ["admin"] },
  ),
  yes(
    "RLS-123",
    "admin",
    "El trigger de folio, duplicados y auditoría está activo (FUN-02)",
    `select (count(*) = 1) as ok
       from pg_trigger t
       join pg_class c on c.oid = t.tgrelid
       join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public' and c.relname = 'payments'
        and t.tgname = 'payments_before_write' and not t.tgisinternal`,
    { requires: ["admin"] },
  ),
  yes(
    "RLS-124",
    "admin",
    "Folio e idempotencia son únicos (FUN-02)",
    `select (count(*) = 2) as ok
       from pg_indexes
      where schemaname = 'public' and tablename = 'payments'
        and indexname in ('payments_idempotency_key_idx', 'payments_receipt_no_idx')`,
    { requires: ["admin"] },
  ),
  zero(
    "RLS-125",
    "student1",
    "El alumno no ve su estado de cuenta (FUN-02)",
    "select count(*)::int as n from public.student_billing_status",
    { requires: ["student1"] },
  ),
  zero(
    "RLS-126",
    "guardian1",
    "El tutor sin consentimiento no ve el estado de cuenta (FUN-02)",
    "select count(*)::int as n from public.student_billing_status",
    { requires: ["guardian1"] },
  ),
  zero(
    "RLS-127",
    "guardian3",
    "El tutor con consentimiento no ve el estado de cuenta de un alumno no consentido (FUN-02)",
    "select count(*)::int as n from public.student_billing_status b where b.student_id <> $1::uuid",
    { requires: ["guardian3", "student2_id"], params: (f) => [f.student2_id] },
  ),
  zero(
    "RLS-128",
    "teacher",
    "El profesor solo ve el estado de cuenta de sus alumnos (FUN-02)",
    "select count(*)::int as n from public.student_billing_status b where not public.app_is_teacher_of_student(b.student_id)",
    { requires: ["teacher"] },
  ),
  zero(
    "RLS-129",
    "teacher_other",
    "Otro profesor no ve el estado de cuenta del alumno ajeno (FUN-02)",
    "select count(*)::int as n from public.student_billing_status b where b.student_id = $1::uuid",
    { requires: ["teacher_other", "student1_id"], params: (f) => [f.student1_id] },
  ),

  // ---------------------------------------- integridad de asignaciones (DB-01)
  yes(
    "RLS-130",
    "admin",
    "Una unidad solo puede asignarse una vez por grupo (DB-01)",
    `select (count(*) = 1) as ok
       from pg_indexes
      where schemaname = 'public' and tablename = 'unit_assignments'
        and indexname = 'unit_assignments_group_unit_uq'`,
    { requires: ["admin"] },
  ),
  yes(
    "RLS-131",
    "admin",
    "app_activate_unit es SECURITY DEFINER con search_path fijo (DB-01)",
    `select (count(*) = 1) as ok
       from pg_proc p
       join pg_namespace n on n.oid = p.pronamespace
      where n.nspname = 'public' and p.proname = 'app_activate_unit'
        and p.prosecdef
        and exists (
          select 1 from unnest(coalesce(p.proconfig, '{}'::text[])) as c
           where c like 'search_path=%'
        )`,
    { requires: ["admin"] },
  ),
  zero(
    "RLS-132",
    "student1",
    "El alumno no puede crear asignaciones por REST",
    `with attempted as (
       insert into public.unit_assignments (group_id, unit_id, unit_version_id, status, visible)
       select g.id, u.id, uv.id, 'active'::public.assignment_status, true
         from public.groups g
         join public.units u on true
         join public.unit_versions uv on uv.unit_id = u.id
        limit 1
       returning 1
     )
     select count(*)::int as n from attempted`,
    { requires: ["student1"], denyIsPass: true },
  ),

  // ------------------------------------------------ anonimización (DB-02)
  yes(
    "RLS-133",
    "admin",
    "app_anonymize_student existe como SECURITY DEFINER (DB-02)",
    `select (count(*) = 1) as ok
       from pg_proc p
       join pg_namespace n on n.oid = p.pronamespace
      where n.nspname = 'public' and p.proname = 'app_anonymize_student'
        and p.prosecdef
        and exists (
          select 1 from unnest(coalesce(p.proconfig, '{}'::text[])) as c
           where c like 'search_path=%'
        )`,
    { requires: ["admin"] },
  ),
  yes(
    "RLS-134",
    "admin",
    "La anonimización conserva el historial bajo seudónimo (DB-02)",
    `select (count(*) = 1) as ok
       from pg_proc p
       join pg_namespace n on n.oid = p.pronamespace
      where n.nspname = 'public' and p.proname = 'app_anonymize_student'
        and pg_get_functiondef(p.oid) like '%student_code%'
        and pg_get_functiondef(p.oid) like '%birth_date = null%'
        and pg_get_functiondef(p.oid) like '%student_staff_notes%'`,
    { requires: ["admin"] },
  ),

  // -------------------------------------- XP en servidor y reglas (DB-03/04)
  yes(
    "RLS-136",
    "admin",
    "Los premios de XP tienen índice único parcial (DB-03)",
    `select (count(*) = 1 and bool_and(coalesce(indexdef, '') like '%exercise%')) as ok
       from pg_indexes
      where schemaname = 'public' and tablename = 'xp_events'
        and indexname = 'xp_events_source_uq'`,
    { requires: ["admin"] },
  ),
  yes(
    "RLS-137",
    "admin",
    "Los triggers de XP y política de quiz están activos (DB-03/04)",
    `select (count(*) = 4) as ok
       from pg_trigger t
       join pg_class c on c.oid = t.tgrelid
       join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public' and not t.tgisinternal
        and t.tgname in (
          'students_new_audience',
          'exercise_attempts_award_xp',
          'unit_progress_award_xp',
          'quiz_attempts_policy'
        )`,
    { requires: ["admin"] },
  ),
  yes(
    "RLS-138",
    "student1",
    "app_unit_requirements devuelve un objeto con motivo, reglas y estado (FUN-05)",
    `select (
       public.app_unit_requirements(a.id) ?& array['can_complete', 'rules', 'message']
     ) as ok
       from public.unit_assignments a
      where exists (
        select 1 from public.students s
         where s.profile_id = auth.uid() and s.group_id = a.group_id
      )
      limit 1`,
    { requires: ["student1"] },
  ),
  yes(
    "RLS-139",
    "student1",
    "app_quiz_policy expone el máximo de intentos (FUN-03)",
    `select (coalesce((policy ->> 'max_attempts')::int, -1) >= 0) as ok
       from (select public.app_quiz_policy() as policy) p`,
    { requires: ["student1"] },
  ),
  zero(
    "RLS-140",
    "student1",
    "El alumno no puede saltarse el límite de intentos por REST",
    "select count(*)::int as n from pg_policies where schemaname = 'public' and tablename = 'quiz_attempts' and cmd = 'DELETE'",
    { requires: ["student1"] },
  ),
  yes(
    "RLS-141",
    "admin",
    "Las reglas y la política de intentos están en settings (FUN-04/05)",
    `select (count(*) = 2) as ok
       from public.settings
      where key in ('unit_completion_rules', 'quiz_attempt_policy')`,
    { requires: ["admin"] },
  ),

  // ----------------------------------- solicitudes ARCO y auditoría (PRIV-06)
  zero(
    "RLS-142",
    "anon",
    "Anónimo no ve solicitudes ARCO",
    "select count(*)::int as n from public.data_requests",
  ),
  zero(
    "RLS-143",
    "student2",
    "Un alumno no ve solicitudes de otros (PRIV-06)",
    "select count(*)::int as n from public.data_requests d where d.profile_id <> auth.uid() and d.student_id <> public.app_student_id()",
    { requires: ["student2"] },
  ),
  zero(
    "RLS-144",
    "guardian2",
    "Un tutor sin vínculos no ve solicitudes (PRIV-06)",
    "select count(*)::int as n from public.data_requests",
    { requires: ["guardian2"] },
  ),
  zero(
    "RLS-145",
    "teacher",
    "El profesor no ve solicitudes ARCO (PRIV-06)",
    "select count(*)::int as n from public.data_requests",
    { requires: ["teacher"] },
  ),
  yes(
    "RLS-146",
    "admin",
    "data_requests tiene RLS y tres políticas sin borrado (PRIV-06)",
    `select (
       (select relrowsecurity from pg_class c join pg_namespace n on n.oid = c.relnamespace
         where n.nspname = 'public' and c.relname = 'data_requests')
       and (select count(*) = 3 from pg_policies
             where schemaname = 'public' and tablename = 'data_requests')
       and (select count(*) = 0 from pg_policies
             where schemaname = 'public' and tablename = 'data_requests' and cmd = 'DELETE')
     ) as ok`,
    { requires: ["admin"] },
  ),
  yes(
    "RLS-147",
    "admin",
    "El plazo ARCO se configura en settings (PRIV-06)",
    `select (
       (select coalesce(value #>> '{}', '')::int from public.settings where key = 'data_request_sla_days') between 1 and 90
     ) as ok`,
    { requires: ["admin"] },
  ),
  yes(
    "RLS-148",
    "admin",
    "app_resolve_data_request valida rol y registra la resolución (PRIV-06)",
    `select (
       pg_get_functiondef(p.oid) like '%app_is_admin()%'
       and pg_get_functiondef(p.oid) like '%insert into public.audit_log%'
       and p.prosecdef
       and exists (
         select 1 from unnest(coalesce(p.proconfig, '{}'::text[])) as c
          where c like 'search_path=%'
       )
     ) as ok
       from pg_proc p
       join pg_namespace n on n.oid = p.pronamespace
      where n.nspname = 'public' and p.proname = 'app_resolve_data_request'`,
    { requires: ["admin"] },
  ),

  // ----------------------------------------------------------- administrador
  yes("RLS-75", "admin", "El admin ve alumnos", "select (count(*) > 0) as ok from public.students", { requires: ["admin"] }),
  yes("RLS-76", "admin", "El admin ve unidades", "select (count(*) > 0) as ok from public.units", { requires: ["admin"] }),
  yes("RLS-77", "admin", "El admin ve perfiles", "select (count(*) > 0) as ok from public.profiles", { requires: ["admin"] }),
];
