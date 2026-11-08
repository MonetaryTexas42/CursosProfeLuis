import { supabase, isConfigured, toStudentEmail, studentEmailDomain, appEnv } from '../lib/supabase.js';

const roleLabels = {
  admin: 'Administrador',
  teacher: 'Profesor',
  student: 'Alumno',
  guardian: 'Tutor'
};

const roleCopy = {
  admin: 'Administra usuarios, contenido y configuración del piloto.',
  teacher: 'Activa unidades, registra asistencia y da seguimiento a tu grupo.',
  student: 'Tus unidades activas aparecerán aquí cuando el profesor las abra.',
  guardian: 'Aquí verás el avance de tus hijos cuando la cuenta esté vinculada.'
};

const progressLabels = {
  not_started: 'Sin empezar',
  in_progress: 'En progreso',
  completed: 'Completada',
  mastered: 'Dominada'
};

const quizPartLabels = {
  tipo: 'Práctica',
  reto: 'Reto',
  capitulo: 'Capítulo'
};

const assignmentStatusLabels = {
  draft: 'Borrador',
  active: 'Activa',
  closed: 'Cerrada'
};

// Debe coincidir con settings.privacy_document_version de la base.
const PRIVACY_DOCUMENT_VERSION = 'v1-2026';

const staffTabLabels = {
  dashboard: '📊 Dashboard',
  alumnos: '👥 Alumnos',
  materias: '📚 Materias',
  asistencia: '📅 Asistencia',
  tareas: '📝 Tareas',
  actividad: '📈 Actividad',
  tutores: '💬 Tutores',
  usuarios: '🛠️ Usuarios',
  contenido: '🗂️ Contenido',
  configuracion: '⚙️ Configuración'
};

const attendanceLabels = {
  present: 'Presente',
  late: 'Tarde',
  excused: 'Justificado',
  absent: 'Falta'
};

const assessmentTypeLabels = {
  diagnostic: 'Diagnóstico',
  quiz: 'Examen corto',
  exam: 'Examen',
  project: 'Tarea / Proyecto',
  participation: 'Participación',
  other: 'Otra'
};

const state = {
  mode: 'student',
  session: null,
  profile: null,
  dashboard: null,
  dashboardError: '',
  view: 'dashboard',
  unitView: null,
  unitResults: {},
  error: '',
  notice: '',
  staffTab: 'dashboard',
  sidebarCollapsed: localStorage.getItem('ecoems_sidebar') === 'collapsed',
  collapsedSubjects: readCollapsedSubjects(),
  loading: true
};

let appRoot = null;
let lastSessionToken = null;

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function readCollapsedSubjects() {
  try {
    const raw = JSON.parse(localStorage.getItem('ecoems_collapsed_subjects') || '[]');
    return new Set(Array.isArray(raw) ? raw : []);
  } catch {
    return new Set();
  }
}

function persistCollapsedSubjects() {
  localStorage.setItem(
    'ecoems_collapsed_subjects',
    JSON.stringify([...state.collapsedSubjects])
  );
}

function toggleCollapsedSubject(subjectId) {
  if (state.collapsedSubjects.has(subjectId)) {
    state.collapsedSubjects.delete(subjectId);
  } else {
    state.collapsedSubjects.add(subjectId);
  }
  persistCollapsedSubjects();
}

function tabParts(label) {
  const [emoji, ...rest] = String(label).split(' ');
  return { emoji, text: rest.join(' ') };
}

function setError(message) {
  state.error = message;
  state.notice = '';
}

function setNotice(message) {
  state.notice = message;
  state.error = '';
}

function alertMarkup() {
  if (!state.error && !state.notice) return '';
  const type = state.error ? 'error' : 'notice';
  const text = state.error || state.notice;
  return `<div class="alert ${type}" role="status">${escapeHtml(text)}</div>`;
}

function headerMarkup() {
  return `
    <header class="top">
      <a class="brand" href="/" aria-label="ECOEMS inicio">
        <span class="brand-mark">E</span>
        <span>ECOEMS <small>Plataforma</small></span>
      </a>
      <div class="top-actions">
        <span class="env-pill">${escapeHtml(appEnv)}</span>
        <button class="theme-toggle" id="theme-toggle" aria-label="Cambiar tema" title="Cambiar entre modo oscuro y claro">🌓</button>
      </div>
    </header>
  `;
}

function applyTheme() {
  const saved = localStorage.getItem('ecoems_theme');
  document.documentElement.setAttribute('data-theme', saved === 'light' ? 'light' : 'dark');
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('ecoems_theme', next);
  const button = appRoot.querySelector('#theme-toggle');
  if (button) button.textContent = next === 'light' ? '☀️' : '🌙';
}

function wireThemeToggle() {
  const button = appRoot.querySelector('#theme-toggle');
  if (!button) return;
  button.textContent = document.documentElement.getAttribute('data-theme') === 'light' ? '☀️' : '🌙';
  button.addEventListener('click', toggleTheme);
}

function renderLoading() {
  appRoot.innerHTML = `
    <div class="shell">
      ${headerMarkup()}
      <main class="center">
        <div class="panel loading-panel">
          <div class="spinner" aria-hidden="true"></div>
          <p>Cargando sesión…</p>
        </div>
      </main>
    </div>
  `;
}

function renderConfig() {
  appRoot.innerHTML = `
    <div class="shell">
      ${headerMarkup()}
      <main class="center">
        <section class="panel config-panel">
          <span class="kicker">Fase 1 · base local</span>
          <h1>Falta conectar Supabase</h1>
          <p>La estructura del proyecto ya está creada. Para iniciar sesión, copia las llaves de tu proyecto de Supabase en el archivo <code>.env</code>.</p>
          <ol class="steps">
            <li>Copia <code>.env.example</code> a <code>.env</code>.</li>
            <li>Pega <code>VITE_SUPABASE_URL</code> y <code>VITE_SUPABASE_ANON_KEY</code>.</li>
            <li>Reinicia el servidor con <code>npm run dev</code>.</li>
          </ol>
          <pre><code>cp .env.example .env
npm run dev</code></pre>
          <p class="muted">El dominio de alumnos configurado es <strong>${escapeHtml(studentEmailDomain)}</strong>.</p>
          <div class="row">
            <span class="pill">Sin datos reales</span>
            <span class="pill">Sin llaves privadas en el frontend</span>
          </div>
        </section>
      </main>
    </div>
  `;
}

function renderLogin() {
  const isStudent = state.mode === 'student';
  const isGuardian = state.mode === 'guardian';

  appRoot.innerHTML = `
    <div class="shell">
      ${headerMarkup()}
      <main class="center">
        <section class="panel login-panel">
          <span class="kicker">Acceso al piloto</span>
          <h1>Entra a tu cuenta</h1>
          <p class="muted">Sin autorregistro. Las cuentas las crea el profesor o el administrador.</p>

          <div class="mode-tabs" role="tablist" aria-label="Tipo de acceso">
            <button class="mode-tab ${isStudent ? 'active' : ''}" data-mode="student" role="tab" aria-selected="${isStudent}">Alumno</button>
            <button class="mode-tab ${state.mode === 'teacher' ? 'active' : ''}" data-mode="teacher" role="tab" aria-selected="${state.mode === 'teacher'}">Profesor</button>
            <button class="mode-tab ${isGuardian ? 'active' : ''}" data-mode="guardian" role="tab" aria-selected="${isGuardian}">Tutor</button>
          </div>

          ${alertMarkup()}

          <form id="login-form" class="form">
            ${isStudent ? `
              <label class="field">
                <span>Usuario</span>
                <input name="username" autocomplete="username" autocapitalize="none" spellcheck="false" placeholder="ana.martinez" required>
              </label>
              <p class="hint">Se usará <strong>usuario@${escapeHtml(studentEmailDomain)}</strong> como identificador interno.</p>
              <label class="field">
                <span>Contraseña</span>
                <input name="password" type="password" autocomplete="current-password" placeholder="Tu contraseña" required>
              </label>
            ` : isGuardian ? `
              <div class="guardian-login-note">
                <span class="card-label">Acceso para tutores</span>
                <h2>Usa tu enlace de acceso</h2>
                <p>Tu profesor te comparte el enlace de acceso por <strong>WhatsApp</strong>. Tócalo y entrarás directo, sin contraseña.</p>
                <p class="hint">¿El enlace venció o no lo tienes? Pídele a tu profesor que te lo reenvíe.</p>
              </div>
            ` : `
              <label class="field">
                <span>Correo</span>
                <input name="email" type="email" autocomplete="email" placeholder="profesor@correo.com" required>
              </label>
              <label class="field">
                <span>Contraseña</span>
                <input name="password" type="password" autocomplete="current-password" placeholder="Tu contraseña" required>
              </label>
            `}
            ${isGuardian ? '' : `<button class="btn primary" type="submit" id="submit-btn">Entrar</button>`}
          </form>

          <p class="fine-print">Si olvidaste tu contraseña, pide una temporal a tu profesor. El tutor entra con el enlace que recibe por WhatsApp.</p>
        </section>
      </main>
    </div>
  `;

  appRoot.querySelectorAll('[data-mode]').forEach((button) => {
    button.addEventListener('click', () => {
      state.mode = button.dataset.mode;
      state.error = '';
      state.notice = '';
      renderLogin();
    });
  });

  appRoot.querySelector('#login-form').addEventListener('submit', handleLogin);
  wireThemeToggle();
}

function renderChangePassword() {
  const name = state.profile?.full_name || '';

  appRoot.innerHTML = `
    <div class="shell">
      ${headerMarkup()}
      <main class="center">
        <section class="panel login-panel">
          <span class="kicker">Primer ingreso</span>
          <h1>Hola, ${escapeHtml(name.split(' ')[0] || 'alumno')} 👋</h1>
          <p class="muted">Tu contraseña actual es temporal. Crea una nueva que solo tú conozcas para continuar.</p>

          ${alertMarkup()}

          <form id="change-password-form" class="form">
            <label class="field">
              <span>Nueva contraseña (mínimo 8 caracteres)</span>
              <input name="password" type="password" autocomplete="new-password" minlength="8" placeholder="Tu nueva contraseña" required>
            </label>
            <label class="field">
              <span>Confirma tu nueva contraseña</span>
              <input name="confirm" type="password" autocomplete="new-password" minlength="8" placeholder="Repite la contraseña" required>
            </label>
            <button class="btn primary" type="submit" id="change-password-btn">Guardar y continuar</button>
          </form>

          <p class="fine-print">Elige una contraseña que recuerdes: con ella entrarás a partir de ahora.</p>
        </section>
      </main>
    </div>
  `;

  appRoot.querySelector('#change-password-form').addEventListener('submit', changePassword);
  wireThemeToggle();
}

async function changePassword(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const button = appRoot.querySelector('#change-password-btn');

  const password = String(data.get('password') || '');
  const confirm = String(data.get('confirm') || '');

  state.error = '';
  state.notice = '';

  if (password.length < 8) {
    setError('La contraseña debe tener al menos 8 caracteres.');
    renderChangePassword();
    return;
  }

  if (password !== confirm) {
    setError('Las contraseñas no coinciden.');
    renderChangePassword();
    return;
  }

  button.disabled = true;
  button.textContent = 'Guardando…';

  try {
    const { error } = await supabase.auth.updateUser({ password });

    if (error) throw error;

    const { error: rpcError } = await supabase.rpc('app_complete_password_change');

    if (rpcError) throw rpcError;

    setNotice('Contraseña actualizada. ¡Bienvenido!');
    state.view = 'dashboard';
    renderDashboard();
    await loadDashboard(state.profile);
  } catch (error) {
    setError(error?.message || 'No se pudo actualizar la contraseña. Intenta de nuevo.');
    renderChangePassword();
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const button = appRoot.querySelector('#submit-btn');
  const data = new FormData(form);

  state.error = '';
  state.notice = '';
  button.disabled = true;
  button.textContent = 'Conectando…';

  try {
    const email = state.mode === 'student'
      ? toStudentEmail(data.get('username'))
      : String(data.get('email') || '').trim().toLowerCase();

    if (!email) throw new Error('Escribe un usuario válido.');

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password: String(data.get('password') || '')
    });

    if (error) throw error;
    if (authData.session) await handleSession(authData.session);
  } catch (error) {
    const message = String(error?.message || '');

    if (message.toLowerCase().includes('invalid login')) {
      setError('Usuario o contraseña incorrectos.');
    } else if (message.toLowerCase().includes('email not confirmed')) {
      setError('La cuenta aún no está confirmada. Pide apoyo al administrador.');
    } else if (message.toLowerCase().includes('rate limit')) {
      setError('Demasiados intentos. Espera un momento y vuelve a probar.');
    } else {
      setError('No se pudo iniciar sesión. Revisa tus datos o consulta a soporte.');
    }

    renderLogin();
  } finally {
    button.disabled = false;
    button.textContent = 'Entrar';
  }
}

async function handleSession(session) {
  if (!session) {
    state.session = null;
    state.profile = null;
    state.dashboard = null;
    state.dashboardError = '';
    state.view = 'dashboard';
    state.unitView = null;
    state.unitResults = {};
    lastSessionToken = null;
    renderLogin();
    return;
  }

  if (lastSessionToken === session.access_token) return;
  lastSessionToken = session.access_token;
  state.session = session;

  const { data, error } = await supabase
    .from('profiles')
    .select('id, role, full_name, username, email, active, must_change_password')
    .eq('id', session.user.id)
    .maybeSingle();

  if (error) {
    lastSessionToken = null;
    setError('No se pudo cargar tu perfil. Revisa la conexión con Supabase.');
    renderFatal('No se pudo cargar el perfil', state.error);
    return;
  }

  if (!data) {
    await supabase.auth.signOut();
    lastSessionToken = null;
    setError('Tu cuenta existe, pero no tiene perfil. Pide al administrador que la complete.');
    renderLogin();
    return;
  }

  if (!data.active) {
    await supabase.auth.signOut();
    lastSessionToken = null;
    setError('Tu cuenta está inactiva. Consulta a la institución.');
    renderLogin();
    return;
  }

  state.profile = data;
  state.dashboard = null;
  state.dashboardError = '';
  state.view = 'dashboard';
  state.unitView = null;
  state.unitResults = {};
  state.error = '';
  state.notice = '';

  if (data.must_change_password) {
    state.view = 'change-password';
    renderChangePassword();
    return;
  }

  renderDashboard();
  loadDashboard(data);
}

async function loadDashboard(profile) {
  try {
    const data = await fetchDashboardData(profile);
    if (state.profile?.id !== profile.id) return;
    state.dashboard = data;
    state.dashboardError = '';
  } catch (error) {
    if (state.profile?.id !== profile.id) return;
    console.error('dashboard_error', error?.message || error);
    state.dashboard = null;
    state.dashboardError = `No se pudieron cargar los datos de tu panel. ${error?.message || ''}`;
  }

  renderDashboard();
}

function assertNoError(error) {
  if (error) throw error;
}

async function fetchDashboardData(profile) {
  if (profile.role === 'admin') return fetchAdminDashboard();
  if (profile.role === 'teacher') return fetchTeacherDashboard(profile.id);
  if (profile.role === 'guardian') return fetchGuardianDashboard();
  return fetchStudentDashboard(profile.id);
}

async function fetchAdminDashboard() {
  const [
    yearRes, groupsRes, profilesRes, studentsRes, guardiansRes, linksRes,
    settingsRes, statsRes, unitsRes, overviewRes, boardRes, studentProfilesRes, termsRes, assignmentsRes,
    tasksRes, activityRes
  ] = await Promise.all([
    supabase
      .from('academic_years')
      .select('name,starts_on,ends_on')
      .eq('is_active', true)
      .maybeSingle(),
    supabase.from('groups').select('id,name,level,schedule,teacher_id').order('name'),
    supabase
      .from('profiles')
      .select('id,role,full_name,email,username,active,phone,created_at')
      .order('created_at'),
    supabase.from('students').select('id,student_code,group_id,profile_id,status').order('student_code'),
    supabase.from('guardians').select('id,profile_id,email,full_name,phone,active').order('email'),
    supabase.from('student_guardians').select('student_id,guardian_id'),
    supabase.from('settings').select('key,value,updated_at,updated_by').order('key'),
    supabase.rpc('app_admin_content_stats'),
    supabase.from('units').select('id,subject_id,num,title,status').order('num'),
    supabase.rpc('app_staff_dashboard'),
    supabase.rpc('app_subject_board'),
    supabase.from('student_profiles').select('*'),
    supabase.from('terms').select('id,academic_year_id,name,starts_on,ends_on').order('starts_on'),
    supabase.from('unit_assignments').select('id,group_id,unit_id,unit_version_id,status,visible,opens_at,closes_at'),
    supabase.rpc('app_staff_tasks'),
    supabase.rpc('app_activity_log', { p_limit: 80 })
  ]);

  assertNoError(yearRes.error);
  assertNoError(groupsRes.error);
  assertNoError(profilesRes.error);
  assertNoError(studentsRes.error);
  assertNoError(guardiansRes.error);
  assertNoError(linksRes.error);
  assertNoError(settingsRes.error);
  assertNoError(statsRes.error);
  assertNoError(unitsRes.error);
  assertNoError(overviewRes.error);
  assertNoError(boardRes.error);
  assertNoError(studentProfilesRes.error);
  assertNoError(termsRes.error);
  assertNoError(assignmentsRes.error);
  assertNoError(tasksRes.error);
  assertNoError(activityRes.error);

  const profiles = profilesRes.data || [];
  const students = studentsRes.data || [];
  const guardians = guardiansRes.data || [];
  const groups = groupsRes.data || [];
  const units = unitsRes.data || [];

  const roleCounts = profiles.reduce((counts, item) => {
    counts[item.role] = (counts[item.role] || 0) + 1;
    return counts;
  }, {});

  const profileNames = new Map(profiles.map((profile) => [profile.id, profile.full_name]));
  const groupNames = new Map(groups.map((group) => [group.id, group.name]));
  const teacherNames = new Map(profiles.map((profile) => [profile.id, profile.full_name]));

  const studentCodes = new Map(students.map((student) => [student.id, student.student_code]));
  const guardianLinks = new Map();
  for (const link of linksRes.data || []) {
    if (!guardianLinks.has(link.guardian_id)) guardianLinks.set(link.guardian_id, []);
    guardianLinks.get(link.guardian_id).push(studentCodes.get(link.student_id) || '?');
  }

  return {
    kind: 'admin',
    year: yearRes.data,
    groups: groups.map((group) => ({
      ...group,
      teacher_name: teacherNames.get(group.teacher_id) || 'Sin profesor'
    })),
    profiles,
    students: students.map((student) => ({
      ...student,
      full_name: profileNames.get(student.profile_id) || 'Alumno sin nombre',
      group_name: groupNames.get(student.group_id) || 'Sin grupo'
    })),
    guardians: guardians.map((guardian) => ({
      ...guardian,
      students: guardianLinks.get(guardian.id) || []
    })),
    settings: settingsRes.data || [],
    stats: statsRes.data || [],
    units,
    overview: overviewRes.data || null,
    board: (boardRes.data || {}).subjects || [],
    assignments: assignmentsRes.data || [],
    tasks: (tasksRes.data || {}).tasks || [],
    activity: (activityRes.data || {}).entries || [],
    studentProfiles: new Map(
      (studentProfilesRes.data || []).map((profile) => [profile.student_id, profile])
    ),
    terms: termsRes.data || [],
    subjectNames: new Map(
      (statsRes.data || []).map((row) => [row.subject_id, row.subject_name])
    ),
    counts: {
      profiles: profiles.length,
      students: students.length,
      ...roleCounts
    }
  };
}

async function fetchTeacherDashboard(teacherId) {
  const groupsRes = await supabase
    .from('groups')
    .select('id,name,level,schedule')
    .eq('teacher_id', teacherId)
    .order('name');

  assertNoError(groupsRes.error);

  const groups = groupsRes.data || [];
  const groupIds = groups.map((group) => group.id);
  let students = [];

  if (groupIds.length) {
    const studentsRes = await supabase
      .from('students')
      .select('id,student_code,group_id,profile_id')
      .in('group_id', groupIds)
      .order('student_code');

    assertNoError(studentsRes.error);
    students = studentsRes.data || [];
  }

  const studentIds = students.map((student) => student.id);

  const profileIds = [...new Set(students.map((student) => student.profile_id))];
  let profiles = [];

  if (profileIds.length) {
    const profilesRes = await supabase
      .from('profiles')
      .select('id,full_name')
      .in('id', profileIds);

    assertNoError(profilesRes.error);
    profiles = profilesRes.data || [];
  }

  const [unitsRes, versionsRes, assignmentsRes, subjectsRes, overviewRes, statsRes, linksRes, guardiansRes, boardRes, studentProfilesRes, termsRes, tasksRes, activityRes] = await Promise.all([
    supabase
      .from('units')
      .select('id,title,subject_id,estimated_minutes')
      .eq('status', 'published')
      .order('title'),
    supabase
      .from('unit_versions')
      .select('id,unit_id,version,published_at')
      .not('published_at', 'is', null)
      .order('version', { ascending: false }),
    groupIds.length
      ? supabase
          .from('unit_assignments')
          .select('id,group_id,unit_id,unit_version_id,status,visible,opens_at,closes_at')
          .in('group_id', groupIds)
          .order('created_at', { ascending: false })
      : Promise.resolve({ data: [], error: null }),
    supabase.from('subjects').select('id,name').order('name'),
    supabase.rpc('app_staff_dashboard'),
    studentIds.length
      ? supabase
          .from('student_stats')
          .select('student_id,xp_total,current_streak,best_streak,units_completed,last_activity_date')
          .in('student_id', studentIds)
      : Promise.resolve({ data: [], error: null }),
    studentIds.length
      ? supabase.from('student_guardians').select('student_id,guardian_id').in('student_id', studentIds)
      : Promise.resolve({ data: [], error: null }),
    supabase.from('guardians').select('id,full_name,email,phone,relationship'),
    supabase.rpc('app_subject_board'),
    studentIds.length
      ? supabase.from('student_profiles').select('*').in('student_id', studentIds)
      : Promise.resolve({ data: [], error: null }),
    supabase.from('terms').select('id,academic_year_id,name,starts_on,ends_on').order('starts_on'),
    supabase.rpc('app_staff_tasks'),
    supabase.rpc('app_activity_log', { p_limit: 80 })
  ]);

  assertNoError(unitsRes.error);
  assertNoError(versionsRes.error);
  assertNoError(assignmentsRes.error);
  assertNoError(subjectsRes.error);
  assertNoError(overviewRes.error);
  assertNoError(statsRes.error);
  assertNoError(linksRes.error);
  assertNoError(guardiansRes.error);
  assertNoError(boardRes.error);
  assertNoError(studentProfilesRes.error);
  assertNoError(termsRes.error);
  assertNoError(tasksRes.error);
  assertNoError(activityRes.error);

  const names = new Map(profiles.map((profile) => [profile.id, profile.full_name]));
  const subjectMap = new Map((subjectsRes.data || []).map((subject) => [subject.id, subject.name]));
  const versionsByUnit = new Map();

  for (const version of versionsRes.data || []) {
    if (!versionsByUnit.has(version.unit_id)) versionsByUnit.set(version.unit_id, []);
    versionsByUnit.get(version.unit_id).push(version);
  }

  const publishedUnits = (unitsRes.data || []).map((unit) => ({
    ...unit,
    subject_name: subjectMap.get(unit.subject_id) || unit.subject_id,
    versions: versionsByUnit.get(unit.id) || []
  }));

  const unitTitles = new Map(publishedUnits.map((unit) => [unit.id, unit.title]));
  const assignments = (assignmentsRes.data || []).map((assignment) => ({
    ...assignment,
    unit_title: unitTitles.get(assignment.unit_id) || 'Unidad'
  }));

  const statsByStudent = new Map((statsRes.data || []).map((stats) => [stats.student_id, stats]));

  const guardiansById = new Map(
    (guardiansRes.data || []).map((guardian) => [guardian.id, guardian])
  );

  const guardiansByStudent = new Map();
  for (const link of linksRes.data || []) {
    if (!guardiansByStudent.has(link.student_id)) guardiansByStudent.set(link.student_id, []);
    const guardian = guardiansById.get(link.guardian_id);
    if (guardian) guardiansByStudent.get(link.student_id).push(guardian);
  }

  return {
    kind: 'teacher',
    overview: overviewRes.data || null,
    board: (boardRes.data || {}).subjects || [],
    tasks: (tasksRes.data || {}).tasks || [],
    activity: (activityRes.data || {}).entries || [],
    studentProfiles: new Map(
      (studentProfilesRes.data || []).map((profile) => [profile.student_id, profile])
    ),
    terms: termsRes.data || [],
    groups: groups.map((group) => ({
      ...group,
      students: students
        .filter((student) => student.group_id === group.id)
        .map((student) => ({
          ...student,
          full_name: names.get(student.profile_id) || 'Alumno sin nombre',
          stats: statsByStudent.get(student.id) || null,
          guardians: guardiansByStudent.get(student.id) || []
        }))
    })),
    students: groups
      .map((group) => ({
        ...group,
        students: students
          .filter((student) => student.group_id === group.id)
          .map((student) => ({
            ...student,
            full_name: names.get(student.profile_id) || 'Alumno sin nombre',
            stats: statsByStudent.get(student.id) || null,
            guardians: guardiansByStudent.get(student.id) || [],
            group_name: group.name
          }))
      }))
      .flatMap((group) => group.students),
    publishedUnits,
    assignments
  };
}

async function fetchStudentDashboard(studentId) {
  const studentRes = await supabase
    .from('students')
    .select('id,student_code,group_id,status')
    .eq('profile_id', studentId)
    .maybeSingle();

  assertNoError(studentRes.error);

  if (!studentRes.data) {
    return { kind: 'student', student: null, group: null, units: [], activeAssignments: 0 };
  }

  const [groupRes, assignmentsRes] = await Promise.all([
    supabase
      .from('groups')
      .select('name,level,schedule')
      .eq('id', studentRes.data.group_id)
      .maybeSingle(),
    supabase
      .from('unit_assignments')
      .select('id,unit_id,unit_version_id,instructions,opens_at,closes_at')
      .eq('group_id', studentRes.data.group_id)
      .eq('status', 'active')
      .eq('visible', true)
      .order('created_at')
  ]);

  assertNoError(groupRes.error);
  assertNoError(assignmentsRes.error);

  const assignments = assignmentsRes.data || [];
  const unitIds = [...new Set(assignments.map((assignment) => assignment.unit_id))];
  const assignmentIds = assignments.map((assignment) => assignment.id);

  let unitRows = [];
  let subjectRows = [];
  let progressRows = [];

  if (unitIds.length) {
    const [unitsRes, subjectsRes, progressRes] = await Promise.all([
      supabase
        .from('units')
        .select('id,title,subject_id,estimated_minutes')
        .in('id', unitIds),
      supabase.from('subjects').select('id,name').order('name'),
      supabase
        .from('unit_progress')
        .select('assignment_id,status,attempts_count,best_accuracy,completed_at')
        .eq('student_id', studentRes.data.id)
        .in('assignment_id', assignmentIds)
    ]);

    assertNoError(unitsRes.error);
    assertNoError(subjectsRes.error);
    assertNoError(progressRes.error);

    unitRows = unitsRes.data || [];
    subjectRows = subjectsRes.data || [];
    progressRows = progressRes.data || [];
  }

  const unitMap = new Map(unitRows.map((unit) => [unit.id, unit]));
  const subjectMap = new Map(subjectRows.map((subject) => [subject.id, subject.name]));
  const progressMap = new Map(progressRows.map((progress) => [progress.assignment_id, progress]));

  const units = assignments.map((assignment) => {
    const unit = unitMap.get(assignment.unit_id);
    return {
      ...assignment,
      unit: unit
        ? {
            ...unit,
            subject_name: subjectMap.get(unit.subject_id) || unit.subject_id
          }
        : null,
      progress: progressMap.get(assignment.id) || null
    };
  });

  return {
    kind: 'student',
    student: studentRes.data,
    group: groupRes.data,
    units,
    activeAssignments: units.length
  };
}

async function fetchGuardianDashboard() {
  const studentsRes = await supabase
    .from('students')
    .select('id,student_code,group_id,profile_id')
    .order('student_code');

  assertNoError(studentsRes.error);

  const students = studentsRes.data || [];
  const profileIds = [...new Set(students.map((student) => student.profile_id))];
  const groupIds = [...new Set(students.map((student) => student.group_id))];
  const studentIds = students.map((student) => student.id);

  const [profilesRes, groupsRes, consentsRes] = await Promise.all([
    profileIds.length
      ? supabase.from('profiles').select('id,full_name').in('id', profileIds)
      : Promise.resolve({ data: [], error: null }),
    groupIds.length
      ? supabase.from('groups').select('id,name').in('id', groupIds)
      : Promise.resolve({ data: [], error: null }),
    studentIds.length
      ? supabase
          .from('privacy_consents')
          .select('student_id,document_version,accepted_at,revoked_at')
          .in('student_id', studentIds)
      : Promise.resolve({ data: [], error: null })
  ]);

  assertNoError(profilesRes.error);
  assertNoError(groupsRes.error);
  assertNoError(consentsRes.error);

  const names = new Map((profilesRes.data || []).map((profile) => [profile.id, profile.full_name]));
  const groupNames = new Map((groupsRes.data || []).map((group) => [group.id, group.name]));

  const consentsByStudent = new Map();
  for (const consent of consentsRes.data || []) {
    if (consent.document_version === PRIVACY_DOCUMENT_VERSION && !consent.revoked_at) {
      consentsByStudent.set(consent.student_id, consent);
    }
  }

  return {
    kind: 'guardian',
    children: students.map((student) => ({
      ...student,
      full_name: names.get(student.profile_id) || 'Alumno sin nombre',
      group_name: groupNames.get(student.group_id) || 'Sin grupo',
      consent_accepted: consentsByStudent.has(student.id)
    }))
  };
}

function renderFatal(title, message) {
  appRoot.innerHTML = `
    <div class="shell">
      ${headerMarkup()}
      <main class="center">
        <section class="panel config-panel">
          <span class="kicker">Error de acceso</span>
          <h1>${escapeHtml(title)}</h1>
          <p>${escapeHtml(message)}</p>
          <div class="row">
            <button class="btn primary" id="retry-btn">Reintentar</button>
            <button class="btn ghost" id="fatal-logout">Cerrar sesión</button>
          </div>
        </section>
      </main>
    </div>
  `;

  appRoot.querySelector('#retry-btn').addEventListener('click', () => {
    state.error = '';
    renderLoading();
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) handleSession(data.session);
      else renderLogin();
    });
  });

  appRoot.querySelector('#fatal-logout').addEventListener('click', signOut);
}

function formatDate(value) {
  if (!value) return '';
  const [year, month, day] = String(value).split('-').map(Number);
  if (!year || !month || !day) return String(value);

  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

function countLabel(count, singular, plural) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function adminDashboardMarkup(data) {
  return staffShellMarkup(data);
}
function adminResumenMarkup(data) {
  return `
    ${staffOverviewMarkup(data.overview)}

    <article class="card wide">
      <div class="card-heading">
        <div>
          <span class="card-label">Grupos</span>
          <h2>${data.groups.length ? countLabel(data.groups.length, 'grupo', 'grupos') : 'Sin grupos'}</h2>
        </div>
      </div>
      ${data.groups.length ? `
        <ul class="data-list">
          ${data.groups.map((group) => `
            <li>
              <div>
                <strong>${escapeHtml(group.name)}</strong>
                <small>${escapeHtml([group.level, group.schedule].filter(Boolean).join(' · ') || 'Sin nivel ni horario')} · Prof.: ${escapeHtml(group.teacher_name)}</small>
              </div>
            </li>
          `).join('')}
        </ul>
      ` : '<p class="empty-state">Todavía no hay grupos. Crea el primero para iniciar el piloto.</p>'}
    </article>
  `;
}

function adminUsersMarkup(data) {
  const teachers = data.profiles.filter((profile) => profile.role === 'teacher');
  const guardians = data.guardians;

  const userRow = (profile) => `
    <li>
      <div>
        <strong>${escapeHtml(profile.full_name)}${profile.role === 'admin' ? ' · Tú' : ''}</strong>
        <small>${escapeHtml(profile.email || profile.username || 'Sin identificador')}</small>
      </div>
      ${profile.role === 'admin' ? `
        <span class="pill success">Activo</span>
      ` : `
        <button class="btn ghost" data-toggle-user="${escapeHtml(profile.id)}" data-active="${profile.active ? '1' : '0'}">
          ${profile.active ? 'Desactivar' : 'Activar'}
        </button>
      `}
    </li>
  `;

  return `
    <article class="card wide">
      <div class="card-heading">
        <div>
          <span class="card-label">Profesores y admin</span>
          <h2>${teachers.length ? countLabel(teachers.length, 'profesor', 'profesores') : 'Sin profesores'}</h2>
        </div>
      </div>
      <ul class="data-list">
        ${data.profiles.filter((profile) => profile.role === 'teacher' || profile.role === 'admin').map(userRow).join('')}
      </ul>

      <details class="admin-details">
        <summary>Crear profesor</summary>
        <form class="form" id="create-teacher-form">
          <label class="field">
            <span>Nombre completo</span>
            <input name="full_name" autocomplete="off" placeholder="Nombre y apellidos" required>
          </label>
          <label class="field">
            <span>Correo</span>
            <input name="email" type="email" autocomplete="off" placeholder="profesor@colegio.mx" required>
          </label>
          <label class="field">
            <span>Contraseña (mínimo 10 caracteres)</span>
            <input name="password" type="text" autocomplete="off" minlength="10" placeholder="Contraseña temporal" required>
          </label>
          <button class="btn primary" type="submit">Crear profesor</button>
        </form>
      </details>
    </article>

    <article class="card wide">
      <div class="card-heading">
        <div>
          <span class="card-label">Alumnos</span>
          <h2>${data.students.length ? countLabel(data.students.length, 'alumno', 'alumnos') : 'Sin alumnos'}</h2>
        </div>
      </div>
      ${data.students.length ? `
        <ul class="data-list">
          ${data.students.map((student) => `
            <li>
              <div>
                <strong>${escapeHtml(student.full_name)}</strong>
                <small>${escapeHtml(student.student_code)} · ${escapeHtml(student.group_name)} · ${escapeHtml(student.status)}</small>
              </div>
              <button class="btn ghost" data-reset-student="${escapeHtml(student.id)}" data-student-name="${escapeHtml(student.full_name)}">Nueva contraseña</button>
            </li>
          `).join('')}
        </ul>
      ` : '<p class="empty-state">Todavía no hay alumnos.</p>'}
    </article>

    <article class="card wide">
      <div class="card-heading">
        <div>
          <span class="card-label">Tutores</span>
          <h2>${guardians.length ? countLabel(guardians.length, 'tutor', 'tutores') : 'Sin tutores'}</h2>
        </div>
      </div>
      ${guardians.length ? `
        <ul class="data-list">
          ${guardians.map((guardian) => `
            <li>
              <div>
                <strong>${escapeHtml(guardian.full_name)}</strong>
                <small>${escapeHtml(guardian.email || guardian.phone || 'Sin contacto')} · Alumnos: ${guardian.students.map(escapeHtml).join(', ') || '—'}</small>
              </div>
              <span class="pill ${guardian.active ? 'success' : ''}">${guardian.active ? 'Activo' : 'Inactivo'}</span>
            </li>
          `).join('')}
        </ul>
      ` : '<p class="empty-state">Todavía no hay tutores. Invítalos desde el panel del profesor.</p>'}
    </article>
  `;
}

function adminContentMarkup(data) {
  const unitsBySubject = new Map();
  for (const unit of data.units) {
    if (!unitsBySubject.has(unit.subject_id)) unitsBySubject.set(unit.subject_id, []);
    unitsBySubject.get(unit.subject_id).push(unit);
  }

  return `
    <article class="card wide">
      <div class="card-heading">
        <div>
          <span class="card-label">Contenido</span>
          <h2>Materias y unidades</h2>
        </div>
        <span class="pill">Versión 1 publicada</span>
      </div>
      ${data.stats.length ? `
        <ul class="data-list">
          ${data.stats.map((row) => `
            <li>
              <div>
                <strong>${escapeHtml(row.subject_name)}</strong>
                <small>
                  ${row.units_total} unidades · ${row.units_published} publicadas ·
                  ${row.exercises} ejercicios · ${row.quiz_count} quiz · ${Number(row.has_reto) > 0 ? 'con reto' : 'sin reto'}
                </small>
              </div>
              <span class="pill ${row.subject_active ? 'success' : ''}">${row.subject_active ? 'Activa' : 'Inactiva'}</span>
            </li>
            ${(unitsBySubject.get(row.subject_id) || []).map((unit) => `
              <li class="unit-row">
                <div>
                  <small>U${String(unit.num).padStart(2, '0')} · ${escapeHtml(unit.title)}</small>
                </div>
                <span class="pill ${unit.status === 'published' ? 'success' : ''}">${escapeHtml(unit.status)}</span>
              </li>
            `).join('')}
          `).join('')}
        </ul>
      ` : '<p class="empty-state">Sin estadísticas de contenido.</p>'}
    </article>
  `;
}

function adminSettingsMarkup(data) {
  return `
    <article class="card wide">
      <div class="card-heading">
        <div>
          <span class="card-label">Configuración</span>
          <h2>Parámetros del sistema</h2>
        </div>
      </div>
      ${data.settings.length ? `
        <ul class="data-list settings-list">
          ${data.settings.map((setting) => `
            <li>
              <div>
                <strong>${escapeHtml(setting.key)}</strong>
                <small>Actualizado: ${escapeHtml(setting.updated_at ? new Date(setting.updated_at).toLocaleString() : '—')}</small>
              </div>
              <div class="row setting-edit">
                <input data-setting-value="${escapeHtml(setting.key)}" value="${escapeHtml(JSON.stringify(setting.value))}">
                <button class="btn primary" data-save-setting="${escapeHtml(setting.key)}">Guardar</button>
              </div>
            </li>
          `).join('')}
        </ul>
      ` : '<p class="empty-state">Sin parámetros configurados.</p>'}
    </article>

    <article class="card wide">
      <div class="card-heading">
        <div>
          <span class="card-label">Entorno</span>
          <h2>Información técnica</h2>
        </div>
      </div>
      <ul class="data-list">
        <li><div><strong>App</strong><small>${escapeHtml(appEnv)} · GitHub Pages</small></div></li>
        <li><div><strong>Supabase</strong><small>${escapeHtml(projectUrlLabel())}</small></div></li>
        <li><div><strong>Aviso de privacidad vigente</strong><small>${escapeHtml(PRIVACY_DOCUMENT_VERSION)}</small></div></li>
      </ul>
    </article>
  `;
}

function projectUrlLabel() {
  return 'ioikcrdxneuydylyhvwi.supabase.co';
}

function formatDayShort(iso) {
  if (!iso) return '';
  const date = new Date(`${String(iso).slice(0, 10)}T12:00:00`);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric' });
}

function formatRelative(iso) {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const seconds = Math.max(0, Math.round((Date.now() - date.getTime()) / 1000));
  if (seconds < 60) return 'ahora';
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.round(hours / 24);
  if (days === 1) return 'ayer';
  if (days < 30) return `hace ${days} días`;
  return date.toLocaleDateString('es-MX');
}

function attentionMarkup(attention) {
  const items = [];
  const consent = attention?.pending_consent || [];
  const inactive = attention?.inactive_students || [];
  const ending = attention?.assignments_ending_soon || [];

  if (consent.length) {
    items.push(`
      <div class="attention-item">
        <span class="dot dot-amber"></span>
        <div><strong>${consent.length} ${consent.length === 1 ? 'tutor sin consentimiento' : 'tutores sin consentimiento'}</strong>
        <div class="muted"><small>${consent.slice(0, 4).map((item) => `${escapeHtml(item.student)} · ${escapeHtml(item.guardian)}`).join(' · ')}${consent.length > 4 ? '…' : ''}</small></div></div>
      </div>
    `);
  }

  for (const item of inactive.slice(0, 3)) {
    items.push(`
      <div class="attention-item">
        <span class="dot dot-red"></span>
        <div><strong>${escapeHtml(item.name || item.student)}</strong> sin actividad reciente
        <div class="muted"><small>${item.days ? `última actividad hace ${item.days} días` : 'sin actividad registrada'} · ${escapeHtml(item.student)}</small></div></div>
      </div>
    `);
  }
  if (inactive.length > 3) {
    items.push(`
      <div class="attention-item"><span class="dot dot-red"></span>
      <div><strong>${inactive.length - 3} alumnos más</strong> sin actividad reciente.</div></div>
    `);
  }

  if (attention?.attendance_missing_today) {
    items.push(`
      <div class="attention-item"><span class="dot dot-blue"></span>
      <div><strong>Asistencia de hoy sin registrar</strong>
      <div class="muted"><small>Pásala en la sección de asistencia del grupo.</small></div></div></div>
    `);
  }

  if (attention?.units_without_assignments > 0) {
    items.push(`
      <div class="attention-item"><span class="dot dot-blue"></span>
      <div><strong>${attention.units_without_assignments} unidades publicadas sin activar</strong>
      <div class="muted"><small>Actívalas desde la sección de unidades del grupo.</small></div></div></div>
    `);
  }

  for (const item of ending.slice(0, 3)) {
    items.push(`
      <div class="attention-item"><span class="dot dot-amber"></span>
      <div><strong>«${escapeHtml(item.unit)}» por cerrar</strong>
      <div class="muted"><small>${escapeHtml(item.group)} · cierra ${escapeHtml(formatDate(String(item.closes).slice(0, 10)))}</small></div></div>
    `);
  }

  if (!items.length) {
    return '<div class="attention-item"><span class="dot dot-green"></span><div><strong>Todo en orden 🎉</strong><div class="muted"><small>No hay pendientes que requieran tu atención.</small></div></div></div>';
  }

  return items.join('');
}

function recentFeedMarkup(recent) {
  const list = Array.isArray(recent) ? recent : [];
  if (!list.length) {
    return '<p class="empty-state">Todavía no hay actividad reciente. Cuando los alumnos trabajen, aparecerá aquí.</p>';
  }

  return `
    <div class="feed-list">
      ${list.map((item) => `
        <div class="feed-item">
          <span class="feed-emoji">${item.kind === 'completed' ? '🏆' : '✏️'}</span>
          <div>
            <strong>${escapeHtml(item.name || item.student)}</strong> ${escapeHtml(item.text)}
            <div><small>${escapeHtml(item.student)} · ${escapeHtml(formatRelative(item.ts))}</small></div>
          </div>
          <span class="${item.ok ? 'feed-ok' : 'feed-bad'}">${item.ok ? '✓' : '✗'}</span>
        </div>
      `).join('')}
    </div>
  `;
}

function staffStatsMarkup(overview) {
  if (!overview) return '';

  const counts = overview.counts || {};
  const activity = overview.activity || {};

  return `
    <div class="dash-stats">
      <div class="stat-card stat-blue"><span class="stat-num">${counts.students ?? 0}</span><span class="stat-label">Alumnos activos</span></div>
      <div class="stat-card stat-violet"><span class="stat-num">${counts.published_units ?? 0}</span><span class="stat-label">Unidades publicadas</span></div>
      <div class="stat-card stat-green"><span class="stat-num">${activity.today_attempts ?? 0}</span><span class="stat-label">Intentos hoy</span></div>
      <div class="stat-card stat-amber"><span class="stat-num">${activity.week_completions ?? 0}</span><span class="stat-label">Completadas · 7 días</span></div>
      <div class="stat-card stat-pink"><span class="stat-num">${activity.xp_total ?? 0}</span><span class="stat-label">XP del grupo</span></div>
    </div>
  `;
}

function staffActivityPanelsMarkup(overview) {
  if (!overview) return '';

  const activity = overview.activity || {};
  const series = Array.isArray(activity.series) ? activity.series : [];
  const max = Math.max(1, ...series.map((day) => Math.max(day.attempts || 0, day.completions || 0)));

  return `
    <div class="dash-grid">
      <article class="card wide">
        <div class="card-heading">
          <div><span class="card-label">Actividad</span><h2>Últimos 7 días</h2></div>
          <span class="pill pill-blue">${activity.week_attempts ?? 0} intentos</span>
        </div>
        <div class="mini-chart">
          ${series.map((day) => `
            <div class="bar-wrap">
              <span class="bar-count">${day.attempts || 0}</span>
              <div class="bar" style="height:${Math.max(3, Math.round(((day.attempts || 0) / max) * 100))}%"></div>
              <span class="bar-label">${escapeHtml(formatDayShort(day.day))}</span>
            </div>
          `).join('')}
        </div>
      </article>

      <article class="card wide">
        <div class="card-heading">
          <div><span class="card-label">Recordatorios</span><h2>Requiere tu atención</h2></div>
        </div>
        <div class="attention-list">${attentionMarkup(overview.attention)}</div>
      </article>
    </div>
  `;
}

function staffOverviewMarkup(overview) {
  if (!overview) {
    return '<article class="card wide"><p class="empty-state">Cargando resumen…</p></article>';
  }

  return `
    ${staffStatsMarkup(overview)}
    ${staffActivityPanelsMarkup(overview)}
    <article class="card wide">
      <div class="card-heading">
        <div><span class="card-label">En vivo</span><h2>Actividad reciente</h2></div>
      </div>
      ${recentFeedMarkup(overview.recent)}
    </article>
  `;
}

function studentDetailMarkup(detail) {
  if (!detail) return '<p class="empty-state">No se pudo cargar el detalle del alumno.</p>';

  const stats = detail.stats || {};
  const units = Array.isArray(detail.units) ? detail.units : [];
  const recent = Array.isArray(detail.recent) ? detail.recent : [];

  return `
    <div class="detail-head">
      <span class="pill pill-green">⚡ ${stats.xp ?? 0} XP</span>
      <span class="pill pill-amber">🔥 racha ${stats.streak ?? 0}</span>
      <span class="pill pill-blue">${stats.units ?? 0} unidades completadas</span>
      ${stats.accuracy != null ? `<span class="pill pill-violet">🎯 ${Math.round(stats.accuracy)}% precisión</span>` : ''}
      <span class="pill">🕐 ${stats.last ? `última actividad ${escapeHtml(formatRelative(stats.last))}` : 'sin actividad'}</span>
    </div>

    ${units.length ? `
      <span class="card-label">Unidades asignadas</span>
      ${units.map((unit) => `
        <div class="progress-row">
          <div>
            <strong>${escapeHtml(unit.unit)}</strong>
            <div class="muted"><small>${escapeHtml(unit.subject)} · ${unit.attempts} intentos${unit.accuracy != null ? ` · ${Math.round(unit.accuracy)}% precisión` : ''}</small></div>
          </div>
          <span class="pill ${unit.status === 'completed' ? 'success' : unit.status === 'in_progress' ? 'pill-blue' : ''}">${escapeHtml(progressLabels[unit.status] || unit.status)}</span>
          ${unit.last ? `<span class="muted"><small>${escapeHtml(formatRelative(unit.last))}</small></span>` : ''}
        </div>
      `).join('')}
    ` : '<p class="empty-state">Este alumno no tiene unidades asignadas.</p>'}

    ${recent.length ? `
      <span class="card-label">Última actividad</span>
      <div class="feed-list">
        ${recent.slice(0, 6).map((item) => `
          <div class="feed-item">
            <span class="feed-emoji">${item.kind === 'quiz' ? '🧠' : '✏️'}</span>
            <div><strong>${escapeHtml(item.text)}</strong><div><small>${escapeHtml(formatRelative(item.ts))}</small></div></div>
            <span class="${item.ok ? 'feed-ok' : 'feed-bad'}">${item.ok ? '✓' : '✗'}</span>
          </div>
        `).join('')}
      </div>
    ` : ''}
  `;
}

function teacherGroupMarkup(group, data) {
  return `
    <div class="teacher-group">
      <p>${escapeHtml([group.level, group.schedule].filter(Boolean).join(' · ') || 'Sin horario')}</p>

      <span class="card-label">Alumnos</span>
      ${group.students.length ? `
        <ul class="data-list invite-list">
          ${group.students.map((student) => `
            <li>
              <div>
                <strong>${escapeHtml(student.full_name)}</strong>
                <small>${escapeHtml(student.student_code)}${student.stats ? ` · ⚡ ${student.stats.xp_total} XP · 🔥 racha ${student.stats.current_streak} · ${student.stats.units_completed} unidades` : ''}</small>
              </div>
              <div class="row">
                <button class="btn ghost" data-student-detail="${escapeHtml(student.id)}">Detalle</button>
                <button class="btn ghost" data-invite-toggle="${escapeHtml(student.id)}">Invitar tutor</button>
                <button class="btn ghost" data-advise-student="${escapeHtml(student.id)}" data-advise-name="${escapeHtml(student.full_name)}">Avisar tutor</button>
              </div>
              <form class="form invite-form hidden" data-invite-form="${escapeHtml(student.id)}" data-student-code="${escapeHtml(student.student_code)}">
                <label class="field">
                  <span>Nombre del tutor</span>
                  <input name="full_name" autocomplete="off" placeholder="Nombre completo" required>
                </label>
                <label class="field">
                  <span>Teléfono (WhatsApp)</span>
                  <input name="phone" type="tel" autocomplete="off" placeholder="52 1 55 1234 5678">
                </label>
                <label class="field">
                  <span>Parentesco (opcional)</span>
                  <input name="relationship" autocomplete="off" placeholder="madre, padre, tutor…">
                </label>
                <label class="field">
                  <span>Correo (opcional — si no tiene, se genera uno interno)</span>
                  <input name="email" type="email" autocomplete="off" placeholder="correo@ejemplo.com">
                </label>
                <div class="row">
                  <button class="btn primary" type="submit">Crear invitación</button>
                  <button class="btn ghost" type="button" data-invite-cancel="${escapeHtml(student.id)}">Cancelar</button>
                </div>
              </form>
              <div class="invite-result hidden" data-invite-result="${escapeHtml(student.id)}"></div>
              <div class="advise-form hidden" data-advise-form="${escapeHtml(student.id)}"></div>
              <div class="student-detail hidden" data-student-detail-box="${escapeHtml(student.id)}"></div>
            </li>
          `).join('')}
        </ul>
      ` : '<p class="empty-state">Este grupo aún no tiene alumnos.</p>'}

      <details class="admin-details">
        <summary>Nuevo alumno</summary>
        <form class="form" data-create-student-group="${escapeHtml(group.id)}">
          <label class="field">
            <span>Nombre completo</span>
            <input name="full_name" autocomplete="off" placeholder="Nombre y apellidos" required>
          </label>
          <label class="field">
            <span>Usuario (opcional — si lo dejas vacío, se genera del nombre)</span>
            <input name="username" autocomplete="off" placeholder="ej. ana.martinez">
          </label>
          <label class="field">
            <span>Contraseña temporal (mín. 8 caracteres)</span>
            <input name="password" type="text" autocomplete="off" minlength="8" required>
          </label>
          <label class="field">
            <span>Matrícula (opcional; si no, se usa el usuario)</span>
            <input name="student_code" autocomplete="off" placeholder="ECO-2027-001">
          </label>
          <div class="row">
            <button class="btn primary" type="submit">Dar de alta</button>
          </div>
          <div class="create-student-result" data-create-result="${escapeHtml(group.id)}"></div>
        </form>
      </details>

      <span class="card-label">Asistencia</span>
      <div class="row">
        <button class="btn ghost" data-attendance-open="${escapeHtml(group.id)}">Asistencia de hoy</button>
        <button class="btn ghost" data-attendance-close="${escapeHtml(group.id)}" style="display:none">Cerrar</button>
      </div>
      <div class="attendance-area hidden" data-attendance-area="${escapeHtml(group.id)}"></div>

      <span class="card-label">Unidades del grupo</span>
      <div data-group-id="${escapeHtml(group.id)}">
        ${unitActivationMarkup(group, data)}
      </div>
    </div>
  `;
}

function unitActivationMarkup(group, data) {
  const groupAssignments = data.assignments.filter((assignment) => assignment.group_id === group.id);
  const assignmentByUnit = new Map(groupAssignments.map((assignment) => [assignment.unit_id, assignment]));

  const bySubject = new Map();
  for (const unit of data.publishedUnits) {
    const subjectKey = unit.subject_name || unit.subject_id || 'Materia';
    if (!bySubject.has(subjectKey)) bySubject.set(subjectKey, []);
    bySubject.get(subjectKey).push(unit);
  }

  if (!bySubject.size) {
    return '<p class="empty-state">Aún no hay unidades publicadas. Primero carga contenido.</p>';
  }

  return [...bySubject.entries()].map(([subjectName, units]) => `
    <div class="subject-block">
      <div class="subject-head">📘 ${escapeHtml(subjectName)}</div>
      ${units.map((unit) => {
        const assignment = assignmentByUnit.get(unit.id);
        const version = unit.versions[0];

        let actions = '';
        let meta = '';

        if (!assignment || assignment.status === 'draft') {
          meta = '<span class="pill">Sin activar</span>';
          actions = version ? `
            <input type="date" data-closes-date="${escapeHtml(unit.id)}" aria-label="Fecha de cierre opcional" title="Fecha de cierre opcional">
            <button class="btn-mini primary" data-activate-unit="${escapeHtml(unit.id)}:${escapeHtml(version.id)}">Activar</button>
          ` : '<span class="muted"><small>Sin versión publicada</small></span>';
        } else if (assignment.status === 'active') {
          meta = `
            <span class="pill pill-green">Activa</span>
            ${assignment.opens_at ? `<span>desde ${escapeHtml(formatDate(String(assignment.opens_at).slice(0, 10)))}</span>` : ''}
            ${assignment.closes_at ? `<span>hasta ${escapeHtml(formatDate(String(assignment.closes_at).slice(0, 10)))}</span>` : '<span>sin cierre</span>'}
          `;
          actions = `<button class="btn-mini danger" data-close-assignment="${escapeHtml(assignment.id)}">Cerrar</button>`;
        } else {
          meta = `
            <span class="pill pill-red">Cerrada</span>
            ${assignment.closes_at ? `<span>hasta ${escapeHtml(formatDate(String(assignment.closes_at).slice(0, 10)))}</span>` : ''}
          `;
          actions = `<button class="btn-mini" data-reopen-assignment="${escapeHtml(assignment.id)}">Reabrir</button>`;
        }

        return `
          <div class="unit-card">
            <div>
              <strong>${escapeHtml(unit.title)}</strong>
              <div class="muted"><small>${unit.estimated_minutes ? `${unit.estimated_minutes} min` : ''}${version ? ` · v${version.version}` : ''}</small></div>
            </div>
            <div class="unit-actions">${actions}</div>
            <div class="unit-meta">${meta}</div>
          </div>
        `;
      }).join('')}
    </div>
  `).join('');
}

function staffShellMarkup(data) {
  const isAdmin = state.profile?.role === 'admin';
  const tab = state.staffTab || 'dashboard';
  const collapsed = Boolean(state.sidebarCollapsed);

  const teacherTabs = ['dashboard', 'alumnos', 'materias', 'asistencia', 'tareas', 'actividad', 'tutores'];
  const adminTabs = ['dashboard', 'alumnos', 'materias', 'asistencia', 'tareas', 'actividad', 'usuarios', 'contenido', 'configuracion'];
  const tabs = isAdmin ? adminTabs : teacherTabs;

  return `
    <div class="staff-app ${collapsed ? 'collapsed' : ''}">
      <aside class="staff-sidebar" aria-label="Secciones">
        <a class="brand staff-brand" href="/" aria-label="ECOEMS inicio">
          <span class="brand-mark">E</span>
          <span class="brand-copy">ECOEMS <small>Plataforma</small></span>
        </a>

        <nav class="staff-nav">
          <span class="side-label">${isAdmin ? 'Administración' : 'Mi espacio'}</span>
          ${tabs.map((key) => {
            const parts = tabParts(staffTabLabels[key]);
            return `
              <button class="staff-tab-btn ${tab === key ? 'active' : ''}" data-staff-tab="${key}" title="${escapeHtml(parts.text)}">
                <span class="nav-emoji" aria-hidden="true">${escapeHtml(parts.emoji)}</span>
                <span class="nav-text">${escapeHtml(parts.text)}</span>
              </button>
            `;
          }).join('')}
        </nav>

        <div class="staff-sidebar-footer">
          <button class="staff-tab-btn sidebar-toggle" id="sidebar-toggle" title="${collapsed ? 'Mostrar menú' : 'Ocultar menú'}" aria-label="${collapsed ? 'Mostrar menú' : 'Ocultar menú'}" aria-expanded="${collapsed ? 'false' : 'true'}">
            <span class="nav-emoji" aria-hidden="true">${collapsed ? '»' : '«'}</span>
            <span class="nav-text">${collapsed ? 'Mostrar menú' : 'Ocultar menú'}</span>
          </button>
          <button class="theme-toggle" id="theme-toggle" aria-label="Cambiar tema" title="Cambiar entre modo oscuro y claro">🌓</button>
          <button class="staff-tab-btn" id="logout-btn" title="Cerrar sesión">
            <span class="nav-emoji" aria-hidden="true">🚪</span>
            <span class="nav-text">Cerrar sesión</span>
          </button>
        </div>
      </aside>

      <div class="staff-main">
        <main class="staff-content">
          ${alertMarkup()}
          ${staffTabContentMarkup(data, tab)}
        </main>
      </div>
    </div>
  `;
}

function staffTabContentMarkup(data, tab) {
  if (!data) {
    if (state.dashboardError) {
      return `
        <article class="card wide">
          <span class="card-label">Panel</span>
          <h2>No se pudo cargar</h2>
          <p>${escapeHtml(state.dashboardError)}</p>
        </article>
      `;
    }
    return `
      <article class="card wide">
        <span class="card-label">Panel</span>
        <h2>Cargando datos…</h2>
        <p>Estamos consultando tu grupo y tu avance.</p>
      </article>
    `;
  }

  if (tab === 'alumnos') return staffStudentsTabMarkup(data);
  if (tab === 'materias') return staffSubjectsTabMarkup(data);
  if (tab === 'asistencia') return staffAttendanceTabMarkup(data);
  if (tab === 'tareas') return staffTasksTabMarkup(data);
  if (tab === 'actividad') return staffActivityTabMarkup(data);
  if (tab === 'tutores') return staffTutoresTabMarkup(data);
  if (tab === 'usuarios') return adminUsersMarkup(data);
  if (tab === 'contenido') return adminContentMarkup(data);
  if (tab === 'configuracion') return adminSettingsMarkup(data);
  return staffDashboardTabMarkup(data);
}

function staffGreetingMarkup() {
  const profile = state.profile;
  if (!profile) return '';

  const role = roleLabels[profile.role] || 'Usuario';
  const name = profile.full_name || profile.username || profile.email || 'Sin nombre';
  const identifier = profile.username
    ? `@${profile.username}`
    : profile.email || 'Sin identificador';

  return `
    <section class="welcome">
      <div>
        <span class="kicker">Sesión activa</span>
        <h1>Hola, ${escapeHtml(name.split(' ')[0])} 👋</h1>
        <p class="muted">${escapeHtml(roleCopy[profile.role] || 'Tu cuenta está conectada.')}</p>
      </div>
      <div class="identity">
        <span class="avatar">${escapeHtml(name.slice(0, 1).toUpperCase())}</span>
        <div>
          <strong>${escapeHtml(name)}</strong>
          <small>${escapeHtml(role)} · ${escapeHtml(identifier)}</small>
        </div>
      </div>
    </section>
  `;
}

function staffDashboardTabMarkup(data) {
  const scores = data.overview?.scores || {};
  const students = Array.isArray(scores.students) ? scores.students : [];

  return `
    ${staffGreetingMarkup()}

    <div class="section-title">
      <div>
        <span class="card-label">Panel de control</span>
        <h2>¿Cómo va el grupo?</h2>
      </div>
      <span class="pill">${escapeHtml(data.kind === 'admin' ? 'Vista global' : 'Tu grupo')}</span>
    </div>

    ${staffStatsMarkup(data.overview)}
    ${staffActivityPanelsMarkup(data.overview)}

    <div class="dash-grid">
      <article class="card wide">
        <div class="card-heading">
          <div>
            <span class="card-label">Score del grupo</span>
            <h2>${scores.group ?? 0} / 100</h2>
          </div>
        </div>
        <p class="muted">Promedio del grupo: 50 % avance de unidades + 50 % precisión en ejercicios.</p>
        ${students.length ? `
          <div class="feed-list">
            ${students.map((student) => `
              <div class="feed-item">
                <span class="feed-emoji">${student.score >= 80 ? '🏆' : student.score >= 50 ? '📈' : '🌱'}</span>
                <div>
                  <strong>${escapeHtml(student.name)}</strong>
                  <div><small>${escapeHtml(student.code)} · ⚡ ${student.xp} XP · 📚 ${student.units_done}/${student.units_total} unidades · ${student.accuracy != null ? `🎯 ${Math.round(student.accuracy)}%` : 'sin precisión'} · faltas: ${student.absences}</small></div>
                </div>
                <span class="score-num">${student.score}</span>
              </div>
            `).join('')}
          </div>
        ` : '<p class="empty-state">Aún no hay alumnos en el grupo.</p>'}
      </article>

      <article class="card wide">
        <div class="card-heading">
          <div><span class="card-label">En vivo</span><h2>Actividad reciente</h2></div>
        </div>
        ${recentFeedMarkup(data.overview?.recent)}
      </article>
    </div>
  `;
}

function scoreRingClass(score) {
  if (score >= 80) return 'high';
  if (score >= 50) return 'mid';
  return 'low';
}

function subjectProgressForStudent(data, studentId) {
  // board.subjects[].units[].students[] → por materia: completadas/totales y precisión
  const result = [];
  for (const subject of data.board || []) {
    let done = 0;
    let total = 0;
    let accuracySum = 0;
    let accuracyCount = 0;
    for (const unit of subject.units || []) {
      total += 1;
      const row = (unit.students || []).find((item) => item.code === studentId || item.id === studentId);
      if (row && (row.status === 'completed' || row.status === 'mastered')) done += 1;
      if (row && row.accuracy != null) {
        accuracySum += Number(row.accuracy);
        accuracyCount += 1;
      }
    }
    if (total > 0) {
      result.push({
        subject: subject.name,
        color: subject.color,
        done,
        total,
        accuracy: accuracyCount ? Math.round(accuracySum / accuracyCount) : null
      });
    }
  }
  return result;
}

function nextUnitMissing(data, studentId) {
  for (const subject of data.board || []) {
    for (const unit of subject.units || []) {
      const row = (unit.students || []).find((item) => item.code === studentId || item.id === studentId);
      if (!row || row.status === 'not_started') {
        return `${subject.name} · ${unit.title}`;
      }
    }
  }
  return null;
}

function staffStudentsTabMarkup(data) {
  const students = data.students || [];
  const scoreStudents = new Map(
    (data.overview?.scores?.students || []).map((item) => [item.code, item])
  );

  if (!students.length) {
    return `
      <div class="section-title"><div><span class="card-label">Alumnos</span><h2>Grupo</h2></div></div>
      <article class="card wide"><p class="empty-state">Todavía no hay alumnos. Da de alta al primero aquí abajo.</p></article>
      ${staffCreateStudentMarkup(data)}
    `;
  }

  return `
    <div class="section-title">
      <div>
        <span class="card-label">Alumnos</span>
        <h2>${students.length} ${students.length === 1 ? 'alumna inscrita' : 'alumnos inscritos'}</h2>
      </div>
    </div>

    <div class="student-cards">
      ${students.map((student) => {
        const scoreRow = scoreStudents.get(student.student_code) || {};
        const score = scoreRow.score ?? 0;
        return `
          <article class="student-card">
            <div class="student-card-head">
              <div class="avatar-big">${escapeHtml((student.full_name || 'A').slice(0, 1).toUpperCase())}</div>
              <span class="score-ring ${scoreRingClass(score)}" title="Score general">${score}</span>
            </div>
            <div>
              <strong>${escapeHtml(student.full_name)}</strong>
              <div class="muted"><small>${escapeHtml(student.student_code)} · ${escapeHtml(student.group_name || 'Sin grupo')}</small></div>
            </div>
            <div class="student-mini-stats">
              <span class="pill pill-pink">⚡ ${scoreRow.xp ?? 0} XP</span>
              <span class="pill pill-green">📚 ${scoreRow.units_done ?? 0}/${scoreRow.units_total ?? '—'}</span>
              ${scoreRow.accuracy != null ? `<span class="pill pill-blue">🎯 ${Math.round(scoreRow.accuracy)}%</span>` : ''}
              <span class="pill ${(scoreRow.absences ?? 0) > 0 ? 'pill-red' : ''}">Faltas: ${scoreRow.absences ?? 0}</span>
            </div>
            <button class="btn ghost" data-ficha-toggle="${escapeHtml(student.id)}">Ver ficha completa</button>
            <div class="student-ficha hidden" data-ficha-box="${escapeHtml(student.id)}"></div>
          </article>
        `;
      }).join('')}
    </div>

    ${staffCreateStudentMarkup(data)}
  `;
}

function staffCreateStudentMarkup(data) {
  const groups = data.groups || [];
  const isAdmin = data.kind === 'admin';

  return `
    <article class="card wide">
      <div class="card-heading">
        <div><span class="card-label">Alta</span><h2>Nuevo alumno</h2></div>
      </div>
      <form class="form" ${isAdmin ? 'id="admin-create-student-form"' : ''} ${!isAdmin ? `data-create-student-group="${escapeHtml(groups[0]?.id || '')}"` : ''}>
        ${isAdmin ? `
          <label class="field">
            <span>Grupo</span>
            <select name="group_id" data-admin-groups required>
              <option value="">Selecciona un grupo…</option>
              ${groups.map((group) => `
                <option value="${escapeHtml(group.id)}">${escapeHtml(group.name)}${group.teacher_name ? ` · ${escapeHtml(group.teacher_name)}` : ''}</option>
              `).join('')}
            </select>
          </label>
        ` : ''}
        <label class="field">
          <span>Nombre completo</span>
          <input name="full_name" autocomplete="off" placeholder="Nombre y apellidos" required>
        </label>
        <label class="field">
          <span>Usuario (opcional — si lo dejas vacío, se genera del nombre)</span>
          <input name="username" autocomplete="off" placeholder="ej. alexa.mandujano">
        </label>
        <label class="field">
          <span>Contraseña temporal (mín. 8 caracteres)</span>
          <input name="password" type="text" autocomplete="off" minlength="8" required>
        </label>
        <label class="field">
          <span>Matrícula (opcional)</span>
          <input name="student_code" autocomplete="off" placeholder="ECO-2027-001">
        </label>
        <div class="row">
          <button class="btn primary" type="submit">Dar de alta</button>
        </div>
        <div class="create-student-result" data-create-result="${isAdmin ? 'admin' : 'teacher'}"></div>
      </form>
    </article>
  `;
}

function staffSubjectsTabMarkup(data) {
  const subjects = data.board || [];
  const groups = data.groups || [];
  const groupId = groups[0]?.id || null;
  const students = data.students || [];
  const assignmentsByUnit = new Map();
  for (const assignment of data.assignments || []) {
    assignmentsByUnit.set(assignment.unit_id, assignment);
  }

  const termOptions = data.terms || [];

  if (!subjects.length) {
    return `
      <div class="section-title"><div><span class="card-label">Materias</span><h2>Contenido</h2></div></div>
      <article class="card wide"><p class="empty-state">Aún no hay materias activas con contenido.</p></article>
    `;
  }

  return `
    <div class="section-title">
      <div>
        <span class="card-label">Materias</span>
        <h2>Unidades, exámenes y calificaciones</h2>
      </div>
      <span class="pill">${subjects.length} materias</span>
    </div>

    ${subjects.map((subject) => {
      const assignments = [];
      for (const unit of subject.units || []) {
        const assignment = assignmentsByUnit.get(unit.id);
        if (assignment) assignments.push(assignment);
      }
      const collapsed = state.collapsedSubjects.has(subject.id);
      return `
        <article class="board-subject ${collapsed ? 'collapsed' : ''}" style="border-left: 5px solid ${escapeHtml(subject.color || '#5b8cff')}">
          <div class="board-head">
            <button class="board-toggle" data-subject-toggle="${escapeHtml(subject.id)}" aria-expanded="${collapsed ? 'false' : 'true'}" title="${collapsed ? 'Mostrar' : 'Ocultar'} ${escapeHtml(subject.name)}">
              <span class="chev" aria-hidden="true">▾</span>
              <h3 style="margin:0">${escapeHtml(subject.name)}</h3>
            </button>
            <span class="pill">${(subject.units || []).length} unidades</span>
            <span class="pill">${(subject.assessments || []).length} evaluaciones</span>
          </div>

          <div class="board-body" data-subject-body="${escapeHtml(subject.id)}">
          <span class="card-label">Unidades (orden del curso)</span>
          ${(subject.units || []).map((unit) => {
            const assignment = assignmentsByUnit.get(unit.id);
            const unitStudents = unit.students || [];
            return `
              <div class="board-unit">
                <span class="pill pill-blue">U${String(unit.num).padStart(2, '0')}</span>
                <div>
                  <strong>${escapeHtml(unit.title)}</strong>
                  <div class="muted"><small>${unit.estimated ? `${unit.estimated} min` : ''}</small></div>
                </div>
                <div class="row">
                  ${assignment && assignment.status === 'active'
                    ? `<span class="pill success">Activa</span>${data.kind === 'teacher' ? `<button class="btn-mini danger" data-close-assignment="${escapeHtml(assignment.id)}">Cerrar</button>` : ''}`
                    : assignment && assignment.status === 'closed'
                      ? `<span class="pill pill-red">Cerrada</span>${data.kind === 'teacher' ? `<button class="btn-mini" data-reopen-assignment="${escapeHtml(assignment.id)}">Reabrir</button>` : ''}`
                      : data.kind === 'teacher' && groupId
                        ? `<button class="btn-mini primary" data-activate-unit="${escapeHtml(unit.id)}:${escapeHtml((data.publishedUnits?.find((u) => u.id === unit.id)?.versions || [])[0]?.id || '')}">Activar</button>`
                        : '<span class="pill">Sin activar</span>'
                  }
                </div>
                <div class="unit-students">
                  ${unitStudents.length ? unitStudents.map((row) => `
                    <span class="student-chip ${row.status === 'completed' || row.status === 'mastered' ? 'done' : row.status === 'in_progress' ? 'progress' : 'todo'}">
                      ${escapeHtml(row.name || row.code)} ${row.status === 'completed' || row.status === 'mastered' ? '✓' : row.status === 'in_progress' ? '…' : '·'}${row.accuracy != null ? ` ${Math.round(row.accuracy)}%` : ''}
                    </span>
                  `).join('') : '<span class="muted"><small>Sin avance registrado</small></span>'}
                </div>
              </div>
            `;
          }).join('')}

          <span class="card-label">Exámenes y tareas</span>
          ${(subject.assessments || []).map((assessment) => `
            <div class="assessment-box" data-assessment-box="${escapeHtml(assessment.id)}">
              <div class="section-title">
                <div>
                  <strong>${escapeHtml(assessment.title)}</strong>
                  <div class="muted"><small>${escapeHtml(assessmentTypeLabels[assessment.type] || assessment.type)} · sobre ${assessment.max} · ${escapeHtml(assessment.date ? formatDate(String(assessment.date).slice(0, 10)) : 'sin fecha')}</small></div>
                </div>
                <button class="btn-mini" data-toggle-grades="${escapeHtml(assessment.id)}">Calificar</button>
              </div>
              <div class="grades-editor hidden" data-grades-editor="${escapeHtml(assessment.id)}">
                ${students.map((student) => {
                  const grade = (assessment.grades || []).find((item) => item.student === student.student_code);
                  return `
                    <div class="grade-row">
                      <span>${escapeHtml(student.full_name)}</span>
                      <input type="number" step="0.1" min="0" max="${escapeHtml(assessment.max)}" value="${grade ? escapeHtml(grade.score ?? '') : ''}" data-grade-student="${escapeHtml(student.id)}" placeholder="—">
                      <button class="btn-mini primary" data-save-grade="${escapeHtml(assessment.id)}" data-student="${escapeHtml(student.id)}">Guardar</button>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          `).join('') || '<p class="empty-state">Sin exámenes ni tareas en esta materia.</p>'}

          ${groupId ? `
            <details class="admin-details">
              <summary>Nueva evaluación (examen, tarea, proyecto…)</summary>
              <form class="form" data-create-assessment="${escapeHtml(subject.id)}" data-group="${escapeHtml(groupId)}">
                <label class="field"><span>Nombre</span><input name="name" required placeholder="Examen parcial 1"></label>
                <label class="field">
                  <span>Tipo</span>
                  <select name="type">
                    ${Object.entries(assessmentTypeLabels).map(([value, label]) => `<option value="${value}">${escapeHtml(label)}</option>`).join('')}
                  </select>
                </label>
                <div class="row">
                  <label class="field"><span>Puntaje máximo</span><input name="max_score" type="number" step="0.1" value="10" required></label>
                  <label class="field"><span>Fecha</span><input name="assessment_date" type="date"></label>
                  <label class="field"><span>Trimestre</span>
                    <select name="term_id">${termOptions.map((term) => `<option value="${escapeHtml(term.id)}">${escapeHtml(term.name)}</option>`).join('')}</select>
                  </label>
                </div>
                <button class="btn primary" type="submit">Crear evaluación</button>
              </form>
            </details>
          ` : ''}
          </div>
        </article>
      `;
    }).join('')}
  `;
}

function staffAttendanceTabMarkup(data) {
  const groups = data.groups || [];
  if (!groups.length) {
    return `
      <div class="section-title"><div><span class="card-label">Asistencia</span><h2>Grupos</h2></div></div>
      <article class="card wide"><p class="empty-state">No tienes grupos asignados.</p></article>
    `;
  }

  return `
    <div class="section-title">
      <div>
        <span class="card-label">Asistencia</span>
        <h2>Tomar lista y justificar</h2>
      </div>
      <span class="pill">Las faltas no afectan calificaciones; solo son informativas</span>
    </div>
    ${groups.map((group) => `
      <article class="card wide">
        <div class="card-heading">
          <div><span class="card-label">Grupo</span><h2>${escapeHtml(group.name)}</h2></div>
        </div>
        <div class="row">
          <button class="btn primary" data-attendance-open="${escapeHtml(group.id)}">Tomar asistencia</button>
          <button class="btn ghost" data-history-open="${escapeHtml(group.id)}">Ver historial</button>
        </div>
        <div class="attendance-area hidden" data-attendance-area="${escapeHtml(group.id)}"></div>
        <div class="attendance-history hidden" data-history-box="${escapeHtml(group.id)}"></div>
      </article>
    `).join('')}
  `;
}

function staffTasksTabMarkup(data) {
  const tasks = data.tasks || [];
  const groups = data.groups || [];
  const subjects = data.board || [];
  const units = data.publishedUnits || data.units || [];
  const taskStatusLabels = {
    pending: 'Pendiente',
    submitted: 'Entregada',
    late: 'Tarde'
  };

  const dueLabel = (task) => {
    if (!task.due_at) return 'Sin fecha';
    const due = new Date(task.due_at);
    const late = due.getTime() < Date.now() && (task.submissions || []).some((sub) => sub.status === 'pending');
    const formatted = due.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });
    return late ? `Venció ${formatted}` : `Entrega ${formatted}`;
  };

  return `
    <div class="section-title">
      <div>
        <span class="card-label">Tareas</span>
        <h2>Asignar, revisar y calificar</h2>
      </div>
      <span class="pill">${tasks.length} ${tasks.length === 1 ? 'tarea activa' : 'tareas activas'}</span>
    </div>

    <article class="card wide">
      <div class="card-heading">
        <div><span class="card-label">Nueva tarea</span><h2>Asignar al grupo</h2></div>
      </div>
      <form class="form task-form" id="create-task-form">
        <label class="field"><span>Título</span><input name="title" required placeholder="Investigación sobre figuras literarias"></label>
        <div class="task-form-grid">
          <label class="field"><span>Grupo</span>
            <select name="group_id" required>
              ${groups.map((group) => `<option value="${escapeHtml(group.id)}">${escapeHtml(group.name)}</option>`).join('')}
            </select>
          </label>
          <label class="field"><span>Materia</span>
            <select name="subject_id" required>
              ${subjects.map((subject) => `<option value="${escapeHtml(subject.id)}">${escapeHtml(subject.name)}</option>`).join('')}
            </select>
          </label>
          <label class="field"><span>Tipo</span>
            <select name="task_type">
              ${Object.entries(assessmentTypeLabels).map(([value, label]) => `<option value="${value}" ${value === 'project' ? 'selected' : ''}>${escapeHtml(label)}</option>`).join('')}
            </select>
          </label>
          <label class="field"><span>Unidad (opcional)</span>
            <select name="unit_id">
              <option value="">Sin unidad</option>
              ${units.map((unit) => `<option value="${escapeHtml(unit.id)}">${escapeHtml(unit.subject_name || unit.subject_id || '')} · ${escapeHtml(unit.title)}</option>`).join('')}
            </select>
          </label>
          <label class="field"><span>Fecha de entrega</span><input name="due_at" type="datetime-local"></label>
          <label class="field"><span>Puntaje máximo</span><input name="max_score" type="number" min="0.1" step="0.1" value="10" required></label>
        </div>
        <label class="field"><span>Instrucciones</span><textarea name="instructions" rows="3" placeholder="Qué debe entregar el alumno, formato y criterios."></textarea></label>
        <button class="btn primary" type="submit">Crear tarea</button>
      </form>
    </article>

    ${tasks.length ? tasks.map((task) => {
      const submissions = task.submissions || [];
      const done = submissions.filter((sub) => sub.status === 'submitted' || sub.status === 'late').length;
      return `
        <article class="task-card" data-task-card="${escapeHtml(task.id)}">
          <div class="task-head">
            <div>
              <span class="card-label" style="color:${escapeHtml(task.subject_color || 'var(--brand)')}">${escapeHtml(task.subject_name || 'Materia')}</span>
              <h3>${escapeHtml(task.title)}</h3>
              <div class="task-meta">
                <span class="pill pill-blue">${escapeHtml(task.group_name || 'Grupo')}</span>
                <span class="pill ${task.due_at && new Date(task.due_at) < new Date() ? 'pill-red' : 'pill-green'}">${escapeHtml(dueLabel(task))}</span>
                <span class="pill">${escapeHtml(task.max_score)} pts</span>
                <span class="pill" data-task-count="${escapeHtml(task.id)}">${done}/${submissions.length} entregadas</span>
                ${task.unit_title ? `<span class="pill">${escapeHtml(task.unit_title)}</span>` : ''}
              </div>
            </div>
          </div>
          ${task.instructions ? `<p class="muted task-instructions">${escapeHtml(task.instructions)}</p>` : ''}
          <div class="task-students">
            ${submissions.length ? submissions.map((sub) => `
              <div class="task-student" data-task-row data-task-id="${escapeHtml(task.id)}" data-student-id="${escapeHtml(sub.student_id)}" data-status="${escapeHtml(sub.status || 'pending')}">
                <div class="attendance-who">
                  <span class="avatar small">${escapeHtml((sub.name || '?').slice(0, 1).toUpperCase())}</span>
                  <div>
                    <strong>${escapeHtml(sub.name)}</strong>
                    <small>${escapeHtml(sub.code)}</small>
                  </div>
                </div>
                <div class="status-seg" role="group" aria-label="Entrega de ${escapeHtml(sub.name)}">
                  ${Object.entries(taskStatusLabels).map(([value, label]) => `
                    <button class="status-btn ${((sub.status || 'pending') === value) ? 'active' : ''}" type="button" data-task-status="${value}">${escapeHtml(label)}</button>
                  `).join('')}
                </div>
                <input class="task-score" type="number" min="0" max="${escapeHtml(task.max_score)}" step="0.1" value="${sub.score ?? ''}" placeholder="Pts" data-task-score aria-label="Puntaje de ${escapeHtml(sub.name)}">
                <button class="btn-mini primary" type="button" data-save-task-submission>Guardar</button>
              </div>
            `).join('') : '<p class="empty-state">Este grupo no tiene alumnos activos.</p>'}
          </div>
        </article>
      `;
    }).join('') : '<article class="card wide"><p class="empty-state">Aún no hay tareas. Crea la primera arriba.</p></article>'}
  `;
}

function staffActivityTabMarkup(data) {
  const entries = data.activity || [];
  const filters = [
    ['todo', 'Todo'],
    ['ejercicio', 'Ejercicios'],
    ['unidad', 'Unidades'],
    ['tarea', 'Tareas'],
    ['calificacion', 'Calificaciones'],
    ['observacion', 'Observaciones']
  ];

  return `
    <div class="section-title">
      <div>
        <span class="card-label">Actividad</span>
        <h2>Registro de actividades</h2>
      </div>
      <span class="pill">${entries.length} eventos recientes</span>
    </div>
    <article class="card wide">
      <div class="activity-filters" data-activity-filters>
        ${filters.map(([key, label], index) => `
          <button class="filter-chip ${index === 0 ? 'active' : ''}" type="button" data-activity-filter="${key}">${escapeHtml(label)}</button>
        `).join('')}
      </div>
      <div class="activity-feed" data-activity-feed>
        ${entries.length ? entries.map((entry) => `
          <div class="activity-item" data-activity-kind="${escapeHtml(entry.kind)}">
            <span class="activity-emoji" aria-hidden="true">${escapeHtml(entry.emoji || '•')}</span>
            <div class="activity-body">
              <strong>${escapeHtml(entry.title || 'Actividad')}</strong>
              <span>${escapeHtml(entry.detail || '')}</span>
              <small>${escapeHtml(entry.name || '')}${entry.student ? ` · ${escapeHtml(entry.student)}` : ''} · ${escapeHtml(formatRelative(entry.ts))}</small>
            </div>
          </div>
        `).join('') : '<p class="empty-state">Todavía no hay actividad registrada. En cuanto haya ejercicios, entregas o calificaciones aparecerán aquí.</p>'}
      </div>
    </article>
  `;
}

function staffTutoresTabMarkup(data) {
  const students = data.students || [];

  return `
    <div class="section-title">
      <div>
        <span class="card-label">Tutores</span>
        <h2>Invitaciones y avisos por WhatsApp</h2>
      </div>
    </div>
    <article class="card wide">
      <div class="card-heading"><div><span class="card-label">Alumnos</span><h2>Vínculos con tutores</h2></div></div>
      ${students.length ? `
        <ul class="data-list invite-list">
          ${students.map((student) => `
            <li>
              <div>
                <strong>${escapeHtml(student.full_name)}</strong>
                <small>${escapeHtml(student.student_code)} · ${(student.guardians || []).length} ${(student.guardians || []).length === 1 ? 'tutor' : 'tutores'} vinculado(s)</small>
              </div>
              <div class="row">
                <button class="btn ghost" data-invite-toggle="${escapeHtml(student.id)}">Invitar tutor</button>
                <button class="btn ghost" data-advise-student="${escapeHtml(student.id)}">Avisar tutor</button>
              </div>
              <form class="form invite-form hidden" data-invite-form="${escapeHtml(student.id)}" data-student-code="${escapeHtml(student.student_code)}">
                <label class="field"><span>Nombre del tutor</span><input name="full_name" required placeholder="Nombre completo"></label>
                <label class="field"><span>Teléfono (WhatsApp)</span><input name="phone" type="tel" placeholder="52 1 55 1234 5678"></label>
                <label class="field"><span>Parentesco (opcional)</span><input name="relationship" placeholder="madre, padre…"></label>
                <label class="field"><span>Correo (opcional — si no tiene, se genera uno interno)</span><input name="email" type="email"></label>
                <div class="row">
                  <button class="btn primary" type="submit">Crear invitación</button>
                  <button class="btn ghost" type="button" data-invite-cancel="${escapeHtml(student.id)}">Cancelar</button>
                </div>
              </form>
              <div class="invite-result hidden" data-invite-result="${escapeHtml(student.id)}"></div>
              <div class="advise-form hidden" data-advise-form="${escapeHtml(student.id)}"></div>
            </li>
          `).join('')}
        </ul>
      ` : '<p class="empty-state">No hay alumnos. Da de alta primero.</p>'}
    </article>
  `;
}

function studentDashboardMarkup(data) {
  if (!data.student) {
    return `
      <article class="card wide">
        <span class="card-label">Mi espacio</span>
        <h2>Sin expediente de alumno</h2>
        <p>Tu cuenta existe, pero aún no está vinculada a un grupo.</p>
      </article>
    `;
  }

  return `
    <article class="card wide">
      <div class="card-heading">
        <div>
          <span class="card-label">Mi espacio</span>
          <h2>${escapeHtml(data.group?.name || 'Sin grupo')}</h2>
        </div>
        <span class="pill success">${escapeHtml(data.student.student_code)}</span>
      </div>
      <p>${escapeHtml(data.group ? [data.group.level, data.group.schedule].filter(Boolean).join(' · ') || 'Sin horario' : 'Tu grupo aún no está asignado.')}</p>
      <div class="row">
        <a class="btn primary" href="./curso/">📚 Abrir curso completo</a>
        <span class="pill">${countLabel(data.activeAssignments, 'unidad activa', 'unidades activas')}</span>
        <span class="pill">${escapeHtml(data.student.status)}</span>
      </div>
      ${data.units.length ? `
        <ul class="data-list">
          ${data.units.map((item) => `
            <li>
              <div>
                <strong>${escapeHtml(item.unit?.title || 'Unidad')}</strong>
                <small>${escapeHtml(item.unit?.subject_name || 'Materia')} · ${escapeHtml(progressLabels[item.progress?.status] || 'Sin empezar')}</small>
              </div>
              <button class="btn ghost" data-open-unit="${escapeHtml(item.id)}">Abrir</button>
            </li>
          `).join('')}
        </ul>
      ` : '<p class="empty-state">Tus unidades aparecerán aquí cuando el profesor las active.</p>'}
    </article>
  `;
}

function guardianDashboardMarkup(data) {
  return `
    <article class="card wide">
      <div class="card-heading">
        <div>
          <span class="card-label">Mis hijos</span>
          <h2>${data.children.length ? countLabel(data.children.length, 'alumno vinculado', 'alumnos vinculados') : 'Sin vínculos'}</h2>
        </div>
        <span class="pill">Solo lectura</span>
      </div>
      ${data.children.length ? `
        <ul class="data-list">
          ${data.children.map((child) => `
            <li>
              <div>
                <strong>${escapeHtml(child.full_name)}</strong>
                <small>${escapeHtml(child.student_code)} · ${escapeHtml(child.group_name)}</small>
              </div>
              ${child.consent_accepted ? `
                <span class="pill success">Consentimiento registrado</span>
              ` : `
                <button class="btn primary" data-consent-student="${escapeHtml(child.id)}">Aceptar aviso de privacidad</button>
              `}
            </li>
          `).join('')}
        </ul>
        <p class="muted"><small>Aviso de privacidad versión ${escapeHtml(PRIVACY_DOCUMENT_VERSION)}. Al aceptar, autorizas el tratamiento de los datos del alumno con fines educativos. Puedes revocarlo cuando quieras.</small></p>
      ` : '<p class="empty-state">Cuando la institución vincule a tus hijos, aparecerán aquí.</p>'}
    </article>
  `;
}

function dashboardDataMarkup(profile) {
  if (state.dashboardError) {
    return `
      <article class="card wide">
        <span class="card-label">Panel</span>
        <h2>No se pudo cargar</h2>
        <p>${escapeHtml(state.dashboardError)}</p>
      </article>
    `;
  }

  if (!state.dashboard) {
    return `
      <article class="card wide">
        <span class="card-label">Panel</span>
        <h2>Cargando datos…</h2>
        <p>Estamos consultando tu grupo y tu avance.</p>
      </article>
    `;
  }

  if (state.dashboard.kind === 'admin') return adminDashboardMarkup(state.dashboard);
  if (state.dashboard.kind === 'teacher') return staffShellMarkup(state.dashboard);
  if (state.dashboard.kind === 'guardian') return guardianDashboardMarkup(state.dashboard);
  return studentDashboardMarkup(state.dashboard);
}

function dashboardMarkup(profile) {
  // Para el personal, el panel del staff ES el dashboard completo:
  // un solo header, la barra lateral de página y el contenido por sección.
  if (profile.role === 'admin' || profile.role === 'teacher') {
    return staffShellMarkup(state.dashboard);
  }

  const role = roleLabels[profile.role] || 'Usuario';
  const name = profile.full_name || profile.username || profile.email || 'Sin nombre';
  const identifier = profile.username
    ? `@${profile.username}`
    : profile.email || 'Sin identificador';

  return `
    <div class="shell">
      ${headerMarkup()}
      <main class="dashboard">
        <section class="welcome">
          <div>
            <span class="kicker">Sesión activa</span>
            <h1>Hola, ${escapeHtml(name.split(' ')[0])}</h1>
            <p class="muted">${escapeHtml(roleCopy[profile.role] || 'Tu cuenta está conectada.')}</p>
          </div>
          <div class="identity">
            <span class="avatar">${escapeHtml(name.slice(0, 1).toUpperCase())}</span>
            <div>
              <strong>${escapeHtml(name)}</strong>
              <small>${escapeHtml(role)} · ${escapeHtml(identifier)}</small>
            </div>
          </div>
        </section>

        ${alertMarkup()}

        <div class="grid">
          <article class="card">
            <span class="card-label">Conexión</span>
            <h2>Supabase conectado</h2>
            <p>La sesión y el perfil se cargaron desde la base. Entorno: <strong>${escapeHtml(appEnv)}</strong>.</p>
            <span class="pill success">Operativo</span>
          </article>

          <article class="card">
            <span class="card-label">Rol</span>
            <h2>${escapeHtml(role)}</h2>
            <p>${escapeHtml(roleCopy[profile.role] || '')}</p>
            <span class="pill">${escapeHtml(profile.role)}</span>
          </article>

          ${dashboardDataMarkup(profile)}
        </div>

        <div class="row end">
          <button class="btn ghost" id="logout-btn">Cerrar sesión</button>
        </div>
      </main>
    </div>
  `;
}

function textBlock(value) {
  return escapeHtml(value).replaceAll('\n', '<br>');
}

function progressText(progress) {
  return progressLabels[progress?.status] || 'Sin empezar';
}

function optionClass(index, result) {
  if (!result) return '';
  if (index === result.correct_index) return 'correct';
  if (index === result.selected_index && !result.is_correct) return 'incorrect';
  return '';
}

function questionMarkup(question, result, attributes) {
  const options = Array.isArray(question.options) ? question.options : [];
  const answerAttributes = attributes.exerciseKey
    ? `data-answer-kind="exercise" data-answer-key="${escapeHtml(attributes.exerciseKey)}"`
    : `data-answer-kind="quiz" data-answer-part="${escapeHtml(attributes.part)}" data-answer-key="${escapeHtml(attributes.questionKey)}"`;

  return `
    <article class="card wide question-card">
      <span class="card-label">${escapeHtml(attributes.title || 'Pregunta')}</span>
      <h2>${escapeHtml(question.prompt || 'Pregunta')}</h2>
      <div class="options">
        ${options.map((option, index) => `
          <button class="option-btn ${optionClass(index, result)}"
            ${answerAttributes}
            data-answer-index="${index}">
            ${escapeHtml(option)}
          </button>
        `).join('')}
      </div>
      ${result ? `
        <div class="answer-box ${result.is_correct ? 'correct' : 'incorrect'}">
          <strong>${result.is_correct ? 'Correcto' : 'Todavía no'}</strong>
          ${result.explanation ? `<p>${escapeHtml(result.explanation)}</p>` : ''}
          <small>Intento ${result.attempt_no || 1}</small>
        </div>
      ` : ''}
    </article>
  `;
}

function sectionMarkup(section, results) {
  const key = String(section.key || '');

  if (section.type === 'exercise') {
    return questionMarkup(section, results[`exercise:${key}`], {
      title: 'Ejercicio',
      exerciseKey: key
    });
  }

  const type = section.type === 'example' ? 'Ejemplo' : 'Lección';

  return `
    <article class="card wide unit-section">
      <span class="card-label">${type}</span>
      <h2>${escapeHtml(section.title || 'Sección')}</h2>
      <p class="unit-body">${textBlock(section.body || '')}</p>
    </article>
  `;
}

function flashcardMarkup(exercise, result) {
  const key = String(exercise.key || '');
  const answered = Boolean(result);

  return `
    <article class="card wide question-card">
      <span class="card-label">Ejercicio ${escapeHtml(key.replace('ej-', ''))}</span>
      <h2>${escapeHtml(exercise.prompt || 'Ejercicio')}</h2>
      ${exercise.figure ? `<div class="figure">${escapeHtml(exercise.figure)}</div>` : ''}
      <button class="btn ghost reveal-btn" data-reveal="${escapeHtml(key)}">Ver respuesta</button>
      <div class="flashcard-answer hidden" data-flashcard-answer="${escapeHtml(key)}">
        <p class="unit-body"><strong>Respuesta:</strong> ${escapeHtml(exercise.answer || '')}</p>
        ${(exercise.steps || []).length ? `
          <ol class="steps">
            ${exercise.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join('')}
          </ol>
        ` : ''}
        ${(exercise.acceptedAnswers || []).length ? `
          <p class="muted"><small>También vale: ${exercise.acceptedAnswers.map(escapeHtml).join(' · ')}</small></p>
        ` : ''}
        <div class="row">
          <button class="btn primary" data-answer-kind="flashcard"
            data-answer-key="${escapeHtml(key)}" data-answer-text="${escapeHtml(exercise.answer)}"
            ${answered ? 'disabled' : ''}>Lo acerté</button>
          <button class="btn ghost" data-answer-kind="flashcard"
            data-answer-key="${escapeHtml(key)}" data-answer-text="x"
            ${answered ? 'disabled' : ''}>Todavía no</button>
        </div>
      </div>
      ${result ? `
        <div class="answer-box ${result.is_correct ? 'correct' : 'incorrect'}">
          <strong>${result.is_correct ? 'Correcto' : 'Todavía no'}</strong>
          ${result.explanation ? `<p>${escapeHtml(result.explanation)}</p>` : ''}
          <small>Intento ${result.attempt_no || 1}</small>
        </div>
      ` : ''}
    </article>
  `;
}

function lessonCard(label, title, body) {
  return `
    <article class="card wide unit-section">
      <span class="card-label">${escapeHtml(label)}</span>
      <h2>${escapeHtml(title)}</h2>
      <p class="unit-body">${textBlock(body)}</p>
    </article>
  `;
}

function exampleMarkup(example, index) {
  return `
    <article class="card wide unit-section">
      <span class="card-label">Ejemplo ${index + 1}</span>
      <h2>${escapeHtml(example.prompt || 'Ejemplo')}</h2>
      ${(example.steps || []).length ? `
        <ol class="steps">
          ${example.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join('')}
        </ol>
      ` : ''}
      ${example.result ? `<p class="unit-body"><strong>Resultado:</strong> ${escapeHtml(example.result)}</p>` : ''}
    </article>
  `;
}

function chapterMarkup(chapter) {
  if (!chapter || typeof chapter !== 'object') return '';

  const intro = chapter.intro;
  const bloques = Array.isArray(chapter.bloques) ? chapter.bloques : [];

  const introCard = intro ? `
    <article class="card wide unit-section">
      <span class="card-label">Capítulo</span>
      <h2>${escapeHtml(intro.t || 'Antes de empezar')}</h2>
      ${intro.p1 ? `<p class="unit-body">${textBlock(intro.p1)}</p>` : ''}
      ${intro.p2 ? `<p class="unit-body">${textBlock(intro.p2)}</p>` : ''}
      ${(intro.items || []).length ? `
        <ul class="steps">
          ${intro.items.map((item) => `<li>${escapeHtml(String(item))}</li>`).join('')}
        </ul>
      ` : ''}
    </article>
  ` : '';

  const blockCards = bloques.map((bloque) => `
    <article class="card wide unit-section">
      <span class="card-label">${escapeHtml(bloque.rotulo || 'Bloque')}</span>
      <h2>${escapeHtml(bloque.nombre || 'Sección del capítulo')}</h2>
      ${bloque.intro ? `<p class="unit-body">${textBlock(bloque.intro)}</p>` : ''}
      ${(bloque.cards || []).map((card) => `
        <div class="chapter-card">
          <strong>${escapeHtml(card.titulo || '')}</strong>
          ${card.pill ? `<span class="pill">${escapeHtml(card.pill)}</span>` : ''}
          ${card.hace ? `<p class="unit-body">${textBlock(card.hace)}</p>` : ''}
        </div>
      `).join('')}
    </article>
  `).join('');

  return introCard + blockCards;
}

function realContentMarkup(content) {
  const theory = Array.isArray(content.theory) ? content.theory : [];
  const guides = Array.isArray(content.guides) ? content.guides : [];
  const examples = Array.isArray(content.examples) ? content.examples : [];
  const mistakes = Array.isArray(content.commonMistakes) ? content.commonMistakes : [];
  const exercises = Array.isArray(content.exercises) ? content.exercises : [];
  const hook = content.unit?.hook || '';
  const truco = content.unit?.truco || '';

  return [
    hook ? lessonCard('Para empezar', '¿De qué trata?', hook) : '',
    theory.map((item, index) => lessonCard('Concepto', `Idea ${index + 1}`, item)).join(''),
    truco ? lessonCard('Truco', 'Recuerda', truco) : '',
    guides.map((item, index) => lessonCard('Guía práctica', `Actividad ${index + 1}`, item)).join(''),
    examples.map(exampleMarkup).join(''),
    mistakes.map((mistake) => `
      <article class="card wide unit-section mistake-card">
        <span class="card-label">Error común</span>
        <h2>${escapeHtml(mistake.title || 'Cuidado')}</h2>
        <p class="unit-body">${textBlock(mistake.detail || '')}</p>
      </article>
    `).join(''),
    chapterMarkup(content.chapter),
    exercises.map((exercise) => flashcardMarkup(exercise, state.unitResults[`exercise:${exercise.key}`])).join('')
  ].join('');
}

function quizBlockMarkup(content, results) {
  const quiz = Array.isArray(content.quiz) ? content.quiz : [];
  const reto = content.reto && typeof content.reto === 'object' ? content.reto : null;

  return [
    ...quiz.map((question) => {
      const part = question.part || 'tipo';
      const key = String(question.key || '');
      return questionMarkup(question, results[`quiz:${part}:${key}`], {
        title: quizPartLabels[part] || 'Quiz',
        part,
        questionKey: key
      });
    }),
    reto
      ? questionMarkup(reto, results[`quiz:reto:${String(reto.key || '')}`], {
          title: 'Reto final',
          part: 'reto',
          questionKey: String(reto.key || '')
        })
      : ''
  ].join('');
}

function unitMarkup(unitView) {
  if (!unitView) return '';

  if (unitView.loading) {
    return `
      <div class="shell">
        ${headerMarkup()}
        <main class="dashboard">
          <section class="welcome">
            <div>
              <span class="kicker">Unidad activa</span>
              <h1>Abriendo unidad…</h1>
              <p class="muted">Estamos cargando el contenido y tu avance.</p>
            </div>
          </section>
          <div class="grid">
            <article class="card wide">
              <div class="spinner" aria-hidden="true"></div>
              <p>Cargando…</p>
            </article>
          </div>
          <div class="row end">
            <button class="btn ghost" id="back-btn">Volver al panel</button>
          </div>
        </main>
      </div>
    `;
  }

  const assignment = unitView.assignment;
  const unit = unitView.unit;
  const content = unitView.version?.content || {};
  const hasSections = Array.isArray(content.sections) && content.sections.length > 0;
  const progress = unitView.progress;
  const isDone = progress?.status === 'completed' || progress?.status === 'mastered';
  const objective = Array.isArray(content.unit?.objective)
    ? content.unit.objective[0]
    : (content.unit?.objective || '');
  const estimated = unit?.estimated_minutes || content.unit?.estimatedMinutes;
  const subject = unit?.subject_name || content.unit?.subjectKey || 'Materia';
  const hasQuestions = hasSections
    || (Array.isArray(content.exercises) && content.exercises.length > 0)
    || (Array.isArray(content.quiz) && content.quiz.length > 0)
    || Boolean(content.reto);

  return `
    <div class="shell">
      ${headerMarkup()}
      <main class="dashboard">
        <section class="welcome">
          <div>
            <span class="kicker">Unidad activa</span>
            <h1>${escapeHtml(unit?.title || 'Unidad')}</h1>
            <p class="muted">${escapeHtml(objective || 'Contenido de la unidad.')}</p>
          </div>
          <div class="identity">
            <span class="avatar">${escapeHtml((unit?.title || 'U').slice(0, 1).toUpperCase())}</span>
            <div>
              <strong>${escapeHtml(subject)}</strong>
              <small>${escapeHtml(progressText(progress))}${estimated ? ` · ${estimated} min` : ''}</small>
            </div>
          </div>
        </section>

        ${alertMarkup()}

        <div class="grid">
          <article class="card wide">
            <div class="card-heading">
              <div>
                <span class="card-label">Sesión</span>
                <h2>${escapeHtml(unit?.title || 'Unidad')}</h2>
              </div>
              <span class="pill ${isDone ? 'success' : ''}">${escapeHtml(progressText(progress))}</span>
            </div>
            <p>${escapeHtml(subject)}${estimated ? ` · ${estimated} minutos estimados` : ''}${unitView.version?.version ? ` · versión ${unitView.version.version}` : ''}</p>
            ${assignment.instructions ? `<p class="unit-body">${textBlock(assignment.instructions)}</p>` : ''}
          </article>

          ${hasSections
            ? content.sections.map((section) => sectionMarkup(section, state.unitResults)).join('')
            : realContentMarkup(content)}
          ${quizBlockMarkup(content, state.unitResults)}

          ${hasQuestions ? '' : '<article class="card wide"><p class="empty-state">Esta versión todavía no tiene ejercicios.</p></article>'}
        </div>

        <div class="row end">
          <button class="btn ghost" id="back-btn">Volver al panel</button>
          <button class="btn primary" id="complete-unit-btn" ${isDone ? 'disabled' : ''}>
            ${isDone ? 'Unidad completada' : 'Marcar como completada'}
          </button>
        </div>
      </main>
    </div>
  `;
}

function renderUnit() {
  appRoot.innerHTML = unitMarkup(state.unitView);

  const backButton = appRoot.querySelector('#back-btn');
  if (backButton) backButton.addEventListener('click', closeUnit);

  const completeButton = appRoot.querySelector('#complete-unit-btn');
  if (completeButton) completeButton.addEventListener('click', completeUnit);

  appRoot.querySelectorAll('[data-answer-key]').forEach((button) => {
    button.addEventListener('click', answerQuestion);
  });

  appRoot.querySelectorAll('[data-reveal]').forEach((button) => {
    button.addEventListener('click', () => {
      const key = button.dataset.reveal;
      const panel = appRoot.querySelector(`[data-flashcard-answer="${key}"]`);
      if (panel) {
        panel.classList.toggle('hidden');
        button.textContent = panel.classList.contains('hidden')
          ? 'Ver respuesta'
          : 'Ocultar respuesta';
      }
    });
  });

  wireThemeToggle();
}

function closeUnit() {
  state.view = 'dashboard';
  state.unitView = null;
  state.unitResults = {};
  state.error = '';
  state.notice = '';
  renderDashboard();
  loadDashboard(state.profile);
}

async function openUnit(assignmentId) {
  const item = (state.dashboard?.units || []).find((unit) => unit.id === assignmentId);
  if (!item) return;

  state.view = 'unit';
  state.unitResults = {};
  state.error = '';
  state.notice = '';
  state.unitView = {
    assignment: item,
    unit: item.unit,
    version: null,
    progress: item.progress,
    loading: true
  };
  renderUnit();

  try {
    const [versionRes, startRes] = await Promise.all([
      supabase
        .from('unit_versions')
        .select('content,version')
        .eq('id', item.unit_version_id)
        .maybeSingle(),
      supabase.rpc('app_start_unit', { p_assignment_id: item.id })
    ]);

    assertNoError(versionRes.error);
    assertNoError(startRes.error);
    if (state.view !== 'unit' || state.unitView?.assignment.id !== item.id) return;

    state.unitView = {
      assignment: item,
      unit: item.unit,
      version: versionRes.data,
      progress: startRes.data || item.progress,
      loading: false
    };
  } catch (error) {
    if (state.view !== 'unit' || state.unitView?.assignment.id !== item.id) return;
    console.error('open_unit_error', error?.message || error);
    setError(`No se pudo abrir la unidad. ${error?.message || ''}`.trim());
    state.unitView = { ...state.unitView, loading: false };
  }

  renderUnit();
}

async function answerQuestion(event) {
  const button = event.currentTarget;
  const unitView = state.unitView;
  if (!unitView || unitView.loading || button.disabled) return;

  const kind = button.dataset.answerKind;
  const key = button.dataset.answerKey;
  const part = button.dataset.answerPart || 'reto';
  const resultKey = kind === 'exercise' || kind === 'flashcard'
    ? `exercise:${key}`
    : `quiz:${part}:${key}`;

  if (!key) return;

  if (kind === 'flashcard') {
    state.error = '';
    state.notice = '';
    button.disabled = true;

    try {
      const { data, error } = await supabase.rpc('app_record_exercise_attempt', {
        p_assignment_id: unitView.assignment.id,
        p_exercise_key: key,
        p_answer: { text: button.dataset.answerText || 'x' },
        p_duration_ms: null
      });

      if (error) throw error;
      if (state.view !== 'unit' || state.unitView?.assignment.id !== unitView.assignment.id) return;

      state.unitResults[resultKey] = data;
      if (data.progress) state.unitView.progress = data.progress;
    } catch {
      if (state.view !== 'unit' || state.unitView?.assignment.id !== unitView.assignment.id) return;
      setError('No se pudo guardar tu respuesta. Revisa la conexión e intenta de nuevo.');
    }

    renderUnit();
    return;
  }

  const index = Number(button.dataset.answerIndex);
  if (Number.isNaN(index)) return;

  state.error = '';
  state.notice = '';
  button.disabled = true;

  try {
    const { data, error } = kind === 'exercise'
      ? await supabase.rpc('app_record_exercise_attempt', {
          p_assignment_id: unitView.assignment.id,
          p_exercise_key: key,
          p_answer: { index },
          p_duration_ms: null
        })
      : await supabase.rpc('app_submit_quiz_answer', {
          p_assignment_id: unitView.assignment.id,
          p_part: part,
          p_question_key: key,
          p_selected_index: index
        });

    if (error) throw error;
    if (state.view !== 'unit' || state.unitView?.assignment.id !== unitView.assignment.id) return;

    state.unitResults[resultKey] = { ...data, selected_index: index };
    if (data.progress) state.unitView.progress = data.progress;
  } catch {
    if (state.view !== 'unit' || state.unitView?.assignment.id !== unitView.assignment.id) return;
    setError('No se pudo guardar tu respuesta. Revisa la conexión e intenta de nuevo.');
  }

  renderUnit();
}

async function completeUnit() {
  const unitView = state.unitView;
  if (!unitView || unitView.loading) return;

  const button = appRoot.querySelector('#complete-unit-btn');
  if (button) {
    button.disabled = true;
    button.textContent = 'Guardando…';
  }

  state.error = '';
  state.notice = '';

  const { data, error } = await supabase.rpc('app_complete_unit', {
    p_assignment_id: unitView.assignment.id
  });

  if (error) {
    setError('No se pudo completar la unidad. Revisa la conexión e intenta de nuevo.');
    renderUnit();
    return;
  }

  if (state.view !== 'unit' || state.unitView?.assignment.id !== unitView.assignment.id) return;
  state.unitView.progress = data;
  setNotice('Unidad marcada como completada.');
  renderUnit();
}

async function activateUnitCard(button) {
  const [unitId, versionId] = String(button.dataset.activateUnit || '').split(':');
  if (!unitId || !versionId || button.disabled) return;

  const container = button.closest('[data-group-id]');
  const groupId = container?.dataset.groupId;
  if (!groupId) return;

  const dateInput = container.querySelector(`[data-closes-date="${unitId}"]`);
  const closesDate = dateInput?.value || '';
  const closesAt = closesDate ? `${closesDate}T23:59:59` : null;

  state.error = '';
  state.notice = '';
  button.disabled = true;
  button.textContent = 'Activando…';

  try {
    const { error } = await supabase.from('unit_assignments').insert({
      group_id: groupId,
      unit_id: unitId,
      unit_version_id: versionId,
      status: 'active',
      visible: true,
      opens_at: new Date().toISOString(),
      closes_at: closesAt,
      created_by: state.profile?.id ?? null
    });

    if (error) throw error;

    setNotice(closesAt ? 'Unidad activada con fecha de cierre.' : 'Unidad activada. Quedará abierta hasta que la cierres.');
    await loadDashboard(state.profile);
  } catch (error) {
    setError(error?.message || 'No se pudo activar la unidad.');
    button.disabled = false;
    button.textContent = 'Activar';
  }
}

async function setAssignmentStatus(button, status) {
  const assignmentId = button.dataset.closeAssignment || button.dataset.reopenAssignment;
  if (!assignmentId || button.disabled) return;

  const isReopen = status === 'active';

  state.error = '';
  state.notice = '';
  button.disabled = true;
  button.textContent = isReopen ? 'Reabriendo…' : 'Cerrando…';

  try {
    const { error } = await supabase
      .from('unit_assignments')
      .update({
        status,
        ...(isReopen ? { closes_at: null, opens_at: new Date().toISOString() } : {})
      })
      .eq('id', assignmentId);

    if (error) throw error;

    setNotice(isReopen ? 'Unidad reabierta. Los alumnos pueden continuar.' : 'Unidad cerrada. El progreso de los alumnos se conserva.');
    await loadDashboard(state.profile);
  } catch (error) {
    setError(error?.message || `No se pudo ${isReopen ? 'reabrir' : 'cerrar'} la unidad.`);
    button.disabled = false;
    button.textContent = isReopen ? 'Reabrir' : 'Cerrar';
  }
}

async function openStudentDetail(studentId, button) {
  const box = appRoot.querySelector(`[data-student-detail-box="${studentId}"]`);
  if (!box) return;

  if (!box.classList.contains('hidden')) {
    box.classList.add('hidden');
    return;
  }

  if (!box.dataset.loaded) {
    box.classList.remove('hidden');
    box.innerHTML = '<div class="spinner" aria-hidden="true"></div>';

    const { data, error } = await supabase.rpc('app_student_detail', { p_student_id: studentId });

    if (error || !data) {
      box.innerHTML = `<p class="empty-state">No se pudo cargar el detalle: ${escapeHtml(error?.message || 'error')}</p>`;
      return;
    }

    box.innerHTML = studentDetailMarkup(data);
    box.dataset.loaded = '1';
  } else {
    box.classList.remove('hidden');
  }
}

/* ---------------- Ficha completa del alumno ---------------- */

function studentFichaMarkup(data, student) {
  const profile = data.studentProfiles?.get(student.id) || {};
  const perSubject = subjectProgressForStudent(data, student.student_code);
  const missing = nextUnitMissing(data, student.student_code);
  const scoreRow = (data.overview?.scores?.students || []).find((item) => item.code === student.student_code) || {};

  const csv = (value) => (Array.isArray(value) ? value.join(', ') : '');
  const json = (value) => (value && typeof value === 'object' ? JSON.stringify(value, null, 1) : (typeof value === 'string' && value ? value : ''));

  return `
    <div class="ficha-grid">
      <div class="ficha-box">
        <h4>📚 Cómo va por materia</h4>
        ${perSubject.length ? perSubject.map((item) => `
          <div class="subject-progress-item">
            <span><strong>${escapeHtml(item.subject)}</strong></span>
            <span>${item.done}/${item.total} ${item.accuracy != null ? `· 🎯 ${item.accuracy}%` : ''}</span>
            <div class="progress-track" style="grid-column:1/-1">
              <div class="progress-fill" style="width:${item.total ? Math.round((item.done / item.total) * 100) : 0}%"></div>
            </div>
          </div>
        `).join('') : '<p class="empty-state">Sin avance registrado.</p>'}
        <div class="sp-meta">
          ${missing ? `⏭️ Le falta: <strong>${escapeHtml(missing)}</strong>` : '🎉 No le falta ninguna unidad por empezar.'}
        </div>
      </div>

      <div class="ficha-box">
        <h4>🎯 Resumen</h4>
        <div class="student-mini-stats">
          <span class="pill pill-pink">⚡ ${scoreRow.xp ?? 0} XP</span>
          <span class="pill pill-amber">🔥 racha ${scoreRow?.xp ? (data.overview?.scores?.students || []).find((item) => item.code === student.student_code)?.xp : 0}</span>
          <span class="pill ${(scoreRow.absences ?? 0) > 0 ? 'pill-red' : 'pill-green'}">Faltas: ${scoreRow.absences ?? 0}</span>
          ${scoreRow.accuracy != null ? `<span class="pill pill-blue">🎯 ${Math.round(scoreRow.accuracy)}% precisión</span>` : ''}
        </div>
        <h4>🧭 Perfil profesional</h4>
        <form class="form profile-edit-grid" data-save-profile="${escapeHtml(student.id)}">
          <label class="field"><span>Carrera que quiere</span><input name="career_choice" value="${escapeHtml(profile.career_choice || '')}" placeholder="ej. Medicina"></label>
          <label class="field"><span>Carreras sugeridas (separadas por coma)</span><input name="career_suggestions" value="${escapeHtml(csv(profile.career_suggestions))}" placeholder="ej. Enfermería, Biología"></label>
          <label class="field"><span>Intereses (separados por coma)</span><input name="interests" value="${escapeHtml(csv(profile.interests))}" placeholder="ciencia, música…"></label>
          <label class="field"><span>Aptitudes (separadas por coma)</span><input name="aptitudes" value="${escapeHtml(csv(profile.aptitudes))}" placeholder="razonamiento, lectura…"></label>
          <label class="field"><span>Fortalezas (separadas por coma)</span><input name="strengths" value="${escapeHtml(csv(profile.strengths))}"></label>
          <label class="field"><span>Áreas a trabajar (separadas por coma)</span><input name="weaknesses" value="${escapeHtml(csv(profile.weaknesses))}"></label>
          <label class="field"><span>Test de personalidad (resultados)</span><textarea name="personality" placeholder="Resultado del test…">${escapeHtml(json(profile.personality))}</textarea></label>
          <label class="field"><span>Test de aptitudes (resultados)</span><textarea name="aptitude" placeholder="Resultado del test…">${escapeHtml(json(profile.aptitude))}</textarea></label>
          <label class="field"><span>Notas de orientación vocacional</span><textarea name="vocational_notes">${escapeHtml(profile.vocational_notes || '')}</textarea></label>
          <button class="btn primary" type="submit">Guardar perfil profesional</button>
        </form>
      </div>

      <div class="ficha-box">
        <h4>📝 Observaciones</h4>
        <div data-observations-list="${escapeHtml(student.id)}"><div class="spinner" aria-hidden="true"></div></div>
        <form class="form" data-add-observation="${escapeHtml(student.id)}">
          <label class="field"><span>Categoría (opcional)</span><input name="category" placeholder="conducta, académico…"></label>
          <label class="field"><span>Observación</span><textarea name="body" required></textarea></label>
          <label class="field"><span>Visible para</span>
            <select name="visibility">
              <option value="internal">Solo personal</option>
              <option value="family">Personal y tutor</option>
            </select>
          </label>
          <button class="btn primary" type="submit">Agregar observación</button>
        </form>
      </div>
    </div>
  `;
}

async function openStudentFicha(studentId, button) {
  const box = appRoot.querySelector(`[data-ficha-box="${studentId}"]`);
  if (!box) return;

  if (!box.classList.contains('hidden')) {
    box.classList.add('hidden');
    button.textContent = 'Ver ficha completa';
    return;
  }

  const data = state.dashboard;
  const student = (data.students || []).find((item) => item.id === studentId);
  if (!student) return;

  box.classList.remove('hidden');
  button.textContent = 'Cerrar ficha';
  box.innerHTML = studentFichaMarkup(data, student);

  const profileForm = box.querySelector(`[data-save-profile="${studentId}"]`);
  if (profileForm) profileForm.addEventListener('submit', (event) => saveStudentProfile(event, studentId));

  const observationForm = box.querySelector(`[data-add-observation="${studentId}"]`);
  if (observationForm) observationForm.addEventListener('submit', (event) => addObservation(event, studentId));

  loadObservations(studentId);
}

async function saveStudentProfile(event, studentId) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);

  const split = (value) => String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  const parseJson = (value) => {
    const text = String(value || '').trim();
    if (!text) return {};
    try {
      const parsed = JSON.parse(text);
      return parsed && typeof parsed === 'object' ? parsed : { nota: text };
    } catch {
      return { nota: text };
    }
  };

  const payload = {
    student_id: studentId,
    career_choice: String(data.get('career_choice') || '').trim() || null,
    career_suggestions: split(data.get('career_suggestions')),
    interests: split(data.get('interests')),
    aptitudes: split(data.get('aptitudes')),
    strengths: split(data.get('strengths')),
    weaknesses: split(data.get('weaknesses')),
    personality: parseJson(data.get('personality')),
    aptitude: parseJson(data.get('aptitude')),
    vocational_notes: String(data.get('vocational_notes') || '').trim() || null,
    updated_at: new Date().toISOString()
  };

  state.error = '';
  state.notice = '';

  const { error } = await supabase.from('student_profiles').upsert(payload, { onConflict: 'student_id' });

  if (error) {
    setError(error?.message || 'No se pudo guardar el perfil profesional.');
    return;
  }

  setNotice('Perfil profesional guardado.');
  await loadDashboard(state.profile);
}

async function loadObservations(studentId) {
  const list = appRoot.querySelector(`[data-observations-list="${studentId}"]`);
  if (!list) return;

  const { data, error } = await supabase
    .from('observations')
    .select('id,category,body,visibility,created_at,author_id')
    .eq('student_id', studentId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error || !data?.length) {
    list.innerHTML = '<p class="empty-state">Sin observaciones todavía.</p>';
    return;
  }

  list.innerHTML = `
    <div class="feed-list">
      ${data.map((item) => `
        <div class="feed-item">
          <span class="feed-emoji">${item.visibility === 'family' ? '👨‍👩‍👧' : '🔒'}</span>
          <div>
            ${item.category ? `<strong>${escapeHtml(item.category)}</strong> · ` : ''}${escapeHtml(item.body)}
            <div><small>${escapeHtml(formatRelative(item.created_at))} · ${item.visibility === 'family' ? 'visible al tutor' : 'solo personal'}</small></div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

async function addObservation(event, studentId) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);

  const category = String(data.get('category') || '').trim();
  const body = String(data.get('body') || '').trim();
  const visibility = String(data.get('visibility') || 'internal');

  if (!body) return;

  const submitButton = form.querySelector('button[type="submit"]');
  if (submitButton) submitButton.disabled = true;

  state.error = '';
  state.notice = '';

  const { error } = await supabase.from('observations').insert({
    student_id: studentId,
    author_id: state.profile?.id ?? null,
    category: category || null,
    body,
    visibility
  });

  if (error) {
    setError(error?.message || 'No se pudo guardar la observación.');
    if (submitButton) submitButton.disabled = false;
    return;
  }

  form.reset();
  if (submitButton) submitButton.disabled = false;
  await loadObservations(studentId);
  setNotice('Observación guardada.');
}

async function saveGrade(button) {
  const assessmentId = button.dataset.saveGrade;
  const studentId = button.dataset.student;
  const box = button.closest('.assessment-box');
  const input = box?.querySelector(`[data-grade-student="${studentId}"]`);

  if (!assessmentId || !studentId || !input || button.disabled) return;

  const raw = input.value.trim();
  const score = raw === '' ? null : Number(raw);

  if (score !== null && (Number.isNaN(score) || score < 0)) {
    setError('El puntaje debe ser un número válido.');
    return;
  }

  state.error = '';
  state.notice = '';
  button.disabled = true;
  button.textContent = '…';

  const { error } = await supabase.from('grades').upsert({
    assessment_id: assessmentId,
    student_id: studentId,
    score,
    status: score === null ? 'pending' : 'recorded',
    recorded_by: state.profile?.id ?? null,
    recorded_at: new Date().toISOString()
  }, { onConflict: 'assessment_id,student_id' });

  if (error) {
    setError(error?.message || 'No se pudo guardar la calificación.');
    button.disabled = false;
    button.textContent = 'Guardar';
    return;
  }

  setNotice('Calificación guardada.');
  button.disabled = false;
  button.textContent = 'Guardar';
}

async function createAssessment(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);

  const subjectId = form.dataset.createAssessment;
  const groupId = form.dataset.group;
  const name = String(data.get('name') || '').trim();
  const type = String(data.get('type') || 'other');
  const maxScore = Number(data.get('max_score') || 0);
  const assessmentDate = String(data.get('assessment_date') || '').trim() || null;
  let termId = String(data.get('term_id') || '');

  if (!name || !maxScore || maxScore <= 0 || !groupId) {
    setError('Completa nombre, puntaje máximo y grupo.');
    return;
  }

  if (!termId) {
    termId = state.dashboard?.terms?.[0]?.id;
  }

  if (!termId) {
    setError('No hay un trimestre configurado para esta evaluación.');
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');
  if (submitButton) submitButton.disabled = true;

  state.error = '';
  state.notice = '';

  const { error } = await supabase.from('assessments').insert({
    group_id: groupId,
    subject_id: subjectId,
    term_id: termId,
    name,
    type,
    max_score: maxScore,
    assessment_date: assessmentDate,
    created_by: state.profile?.id ?? null
  });

  if (error) {
    setError(error?.message?.includes('duplicate') || error?.code === '23505'
      ? 'Ya existe una evaluación con ese nombre en la materia.'
      : error?.message || 'No se pudo crear la evaluación.');
    if (submitButton) submitButton.disabled = false;
    return;
  }

  setNotice('Evaluación creada. Ahora puedes calificar a cada alumno.');
  await loadDashboard(state.profile);
}

async function createTask(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);

  const groupId = String(data.get('group_id') || '');
  const subjectId = String(data.get('subject_id') || '');
  const unitId = String(data.get('unit_id') || '').trim();
  const title = String(data.get('title') || '').trim();
  const instructions = String(data.get('instructions') || '').trim();
  const taskType = String(data.get('task_type') || 'project');
  const maxScore = Number(data.get('max_score') || 0);
  const dueRaw = String(data.get('due_at') || '').trim();

  if (!groupId || !subjectId || !title || !maxScore || maxScore <= 0) {
    setError('Completa grupo, materia, título y puntaje máximo.');
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = 'Creando…';
  }

  state.error = '';
  state.notice = '';

  const { error } = await supabase.from('tasks').insert({
    group_id: groupId,
    subject_id: subjectId,
    unit_id: unitId || null,
    title,
    instructions: instructions || null,
    task_type: taskType,
    due_at: dueRaw ? new Date(dueRaw).toISOString() : null,
    max_score: maxScore,
    created_by: state.profile?.id ?? null
  });

  if (error) {
    setError(error?.message || 'No se pudo crear la tarea.');
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = 'Crear tarea';
    }
    return;
  }

  setNotice('Tarea creada. Ya puedes registrar entregas y calificaciones.');
  await refreshStaffTasks();
  await refreshStaffActivity().catch(() => {});
  renderDashboard();
}

async function refreshStaffTasks() {
  const { data, error } = await supabase.rpc('app_staff_tasks');
  if (error) throw error;
  if (state.dashboard) state.dashboard.tasks = (data || {}).tasks || [];
}

async function refreshStaffActivity() {
  const { data, error } = await supabase.rpc('app_activity_log', { p_limit: 80 });
  if (error) throw error;
  if (state.dashboard) state.dashboard.activity = (data || {}).entries || [];
}

async function saveTaskSubmission(button) {
  const row = button.closest('[data-task-row]');
  if (!row) return;

  const taskId = row.dataset.taskId;
  const studentId = row.dataset.studentId;
  const status = row.dataset.status || 'pending';
  const scoreInput = row.querySelector('[data-task-score]');
  const rawScore = String(scoreInput?.value || '').trim();
  const score = rawScore === '' ? null : Number(rawScore);
  const maxScore = Number(scoreInput?.max || 0);

  if (score !== null && Number.isNaN(score)) {
    setError('El puntaje debe ser un número.');
    return;
  }
  if (score !== null && maxScore && score > maxScore) {
    setError(`El puntaje no puede superar ${maxScore}.`);
    return;
  }

  button.disabled = true;
  const original = button.textContent;
  button.textContent = '…';
  state.error = '';
  state.notice = '';

  const submittedAt = status === 'pending' ? null : new Date().toISOString();

  const { error } = await supabase.from('task_submissions').upsert({
    task_id: taskId,
    student_id: studentId,
    status,
    score,
    submitted_at: submittedAt,
    recorded_by: state.profile?.id ?? null,
    updated_at: new Date().toISOString()
  }, { onConflict: 'task_id,student_id' });

  if (error) {
    setError(error?.message || 'No se pudo guardar la entrega.');
    button.disabled = false;
    button.textContent = original;
    return;
  }

  const task = (state.dashboard?.tasks || []).find((item) => item.id === taskId);
  if (task) {
    const submission = (task.submissions || []).find((item) => item.student_id === studentId);
    if (submission) {
      submission.status = status;
      submission.score = score;
      submission.submitted_at = submittedAt;
      submission.updated_at = new Date().toISOString();
    }
    const done = (task.submissions || []).filter((item) => item.status === 'submitted' || item.status === 'late').length;
    const counter = appRoot.querySelector(`[data-task-count="${taskId}"]`);
    if (counter) counter.textContent = `${done}/${(task.submissions || []).length} entregadas`;
  }

  await refreshStaffActivity().catch(() => {});

  button.disabled = false;
  button.textContent = '✓ Guardado';
  window.setTimeout(() => {
    button.textContent = original;
  }, 1600);
}

async function openAttendanceHistory(groupId, button) {
  const box = appRoot.querySelector(`[data-history-box="${groupId}"]`);
  if (!box) return;

  if (!box.classList.contains('hidden')) {
    box.classList.add('hidden');
    button.textContent = 'Ver historial';
    return;
  }

  box.classList.remove('hidden');
  button.textContent = 'Ocultar historial';
  box.innerHTML = '<div class="spinner" aria-hidden="true"></div>';

  const students = (state.dashboard?.groups || []).find((group) => group.id === groupId)?.students || [];

  const { data: sessions, error: sessionsError } = await supabase
    .from('attendance_sessions')
    .select('id,session_date')
    .eq('group_id', groupId)
    .order('session_date', { ascending: false })
    .limit(12);

  if (sessionsError || !sessions?.length) {
    box.innerHTML = '<p class="empty-state">Todavía no hay sesiones de asistencia registradas.</p>';
    return;
  }

  const sessionIds = sessions.map((session) => session.id);
  const { data: rows, error: rowsError } = await supabase
    .from('attendance')
    .select('session_id,student_id,status')
    .in('session_id', sessionIds);

  if (rowsError) {
    box.innerHTML = '<p class="empty-state">No se pudo cargar el historial.</p>';
    return;
  }

  const statusEmoji = { present: '✅', late: '⏰', excused: '✳️', absent: '❌' };
  const byStudent = new Map();
  for (const student of students) {
    byStudent.set(student.id, { name: student.full_name, code: student.student_code, cells: new Map(), absences: 0 });
  }
  for (const row of rows || []) {
    const entry = byStudent.get(row.student_id);
    if (!entry) continue;
    entry.cells.set(row.session_id, row.status);
    if (row.status === 'absent') entry.absences += 1;
  }

  box.innerHTML = `
    <table class="attendance-history-table">
      <thead>
        <tr>
          <th>Alumno</th>
          ${sessions.map((session) => `<th>${escapeHtml(formatDate(String(session.session_date).slice(0, 10)))}</th>`).join('')}
          <th>Faltas</th>
        </tr>
      </thead>
      <tbody>
        ${[...byStudent.values()].map((entry) => `
          <tr>
            <td><strong>${escapeHtml(entry.name)}</strong><div class="muted"><small>${escapeHtml(entry.code)}</small></div></td>
            ${sessions.map((session) => `<td>${statusEmoji[entry.cells.get(session.id)] || '·'}</td>`).join('')}
            <td>${entry.absences}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <p class="muted"><small>✅ presente · ⏰ tarde · ✳️ justificado · ❌ falta · · sin registro</small></p>
  `;
}

function renderDashboard() {
  appRoot.innerHTML = dashboardMarkup(state.profile);

  appRoot.querySelector('#logout-btn').addEventListener('click', signOut);

  appRoot.querySelectorAll('[data-open-unit]').forEach((button) => {
    button.addEventListener('click', () => openUnit(button.dataset.openUnit));
  });

  appRoot.querySelectorAll('[data-consent-student]').forEach((button) => {
    button.addEventListener('click', () => acceptConsent(button.dataset.consentStudent, button));
  });

  appRoot.querySelectorAll('[data-invite-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      const form = appRoot.querySelector(`[data-invite-form="${button.dataset.inviteToggle}"]`);
      if (form) form.classList.toggle('hidden');
    });
  });

  appRoot.querySelectorAll('[data-invite-cancel]').forEach((button) => {
    button.addEventListener('click', () => {
      const form = appRoot.querySelector(`[data-invite-form="${button.dataset.inviteCancel}"]`);
      if (form) form.classList.add('hidden');
    });
  });

  appRoot.querySelectorAll('[data-invite-form]').forEach((form) => {
    form.addEventListener('submit', inviteGuardian);
  });

  appRoot.querySelectorAll('[data-staff-tab]').forEach((button) => {
    button.addEventListener('click', () => {
      state.staffTab = button.dataset.staffTab;
      state.error = '';
      state.notice = '';
      renderDashboard();
    });
  });

  appRoot.querySelectorAll('[data-ficha-toggle]').forEach((button) => {
    button.addEventListener('click', () => openStudentFicha(button.dataset.fichaToggle, button));
  });

  appRoot.querySelectorAll('[data-toggle-grades]').forEach((button) => {
    button.addEventListener('click', () => {
      const editor = appRoot.querySelector(`[data-grades-editor="${button.dataset.toggleGrades}"]`);
      if (editor) editor.classList.toggle('hidden');
    });
  });

  appRoot.querySelectorAll('[data-save-grade]').forEach((button) => {
    button.addEventListener('click', () => saveGrade(button));
  });

  appRoot.querySelectorAll('[data-create-assessment]').forEach((form) => {
    form.addEventListener('submit', createAssessment);
  });

  appRoot.querySelectorAll('[data-history-open]').forEach((button) => {
    button.addEventListener('click', () => openAttendanceHistory(button.dataset.historyOpen, button));
  });

  const createTeacherForm = appRoot.querySelector('#create-teacher-form');
  if (createTeacherForm) createTeacherForm.addEventListener('submit', createTeacher);

  appRoot.querySelectorAll('[data-reset-student]').forEach((button) => {
    button.addEventListener('click', () => resetStudentPassword(button.dataset.resetStudent, button));
  });

  appRoot.querySelectorAll('[data-toggle-user]').forEach((button) => {
    button.addEventListener('click', () => toggleUserActive(button));
  });

  appRoot.querySelectorAll('[data-save-setting]').forEach((button) => {
    button.addEventListener('click', () => saveSetting(button.dataset.saveSetting, button));
  });

  appRoot.querySelectorAll('[data-create-student-group]').forEach((form) => {
    form.addEventListener('submit', (event) => createStudent(event, form.dataset.createStudentGroup));
  });

  const adminCreateStudentForm = appRoot.querySelector('#admin-create-student-form');
  if (adminCreateStudentForm) {
    adminCreateStudentForm.addEventListener('submit', (event) => {
      const select = adminCreateStudentForm.querySelector('[data-admin-groups]');
      createStudent(event, select?.value);
    });
  }

  appRoot.querySelectorAll('[data-advise-student]').forEach((button) => {
    button.addEventListener('click', () => renderAdviseForm(button.dataset.adviseStudent));
  });

  appRoot.querySelectorAll('[data-attendance-open]').forEach((button) => {
    button.addEventListener('click', () => openAttendance(button.dataset.attendanceOpen));
  });

  appRoot.querySelectorAll('[data-attendance-close]').forEach((button) => {
    button.addEventListener('click', () => {
      const area = appRoot.querySelector(`[data-attendance-area="${button.dataset.attendanceClose}"]`);
      if (area) area.classList.add('hidden');
      button.style.display = 'none';
      const openButton = appRoot.querySelector(`[data-attendance-open="${button.dataset.attendanceClose}"]`);
      if (openButton) openButton.style.display = '';
    });
  });

  appRoot.querySelectorAll('[data-student-detail]').forEach((button) => {
    button.addEventListener('click', () => openStudentDetail(button.dataset.studentDetail, button));
  });

  appRoot.querySelectorAll('[data-activate-unit]').forEach((button) => {
    button.addEventListener('click', () => activateUnitCard(button));
  });

  appRoot.querySelectorAll('[data-close-assignment]').forEach((button) => {
    button.addEventListener('click', () => setAssignmentStatus(button, 'closed'));
  });

  appRoot.querySelectorAll('[data-reopen-assignment]').forEach((button) => {
    button.addEventListener('click', () => setAssignmentStatus(button, 'active'));
  });

  const sidebarToggle = appRoot.querySelector('#sidebar-toggle');
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
      localStorage.setItem('ecoems_sidebar', state.sidebarCollapsed ? 'collapsed' : 'open');
      const shell = appRoot.querySelector('.staff-app');
      if (shell) shell.classList.toggle('collapsed', state.sidebarCollapsed);
      const expanded = !state.sidebarCollapsed;
      sidebarToggle.setAttribute('aria-expanded', String(expanded));
      sidebarToggle.title = expanded ? 'Ocultar menú' : 'Mostrar menú';
      const emoji = sidebarToggle.querySelector('.nav-emoji');
      const text = sidebarToggle.querySelector('.nav-text');
      if (emoji) emoji.textContent = expanded ? '«' : '»';
      if (text) text.textContent = expanded ? 'Ocultar menú' : 'Mostrar menú';
    });
  }

  appRoot.querySelectorAll('[data-subject-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      const subjectId = button.dataset.subjectToggle;
      toggleCollapsedSubject(subjectId);
      const card = button.closest('.board-subject');
      if (!card) return;
      const collapsed = state.collapsedSubjects.has(subjectId);
      card.classList.toggle('collapsed', collapsed);
      button.setAttribute('aria-expanded', String(!collapsed));
    });
  });

  appRoot.querySelectorAll('[data-activity-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.activityFilter;
      appRoot.querySelectorAll('[data-activity-filter]').forEach((item) => {
        item.classList.toggle('active', item === button);
      });
      appRoot.querySelectorAll('[data-activity-kind]').forEach((item) => {
        item.classList.toggle('hidden', filter !== 'todo' && item.dataset.activityKind !== filter);
      });
    });
  });

  const createTaskForm = appRoot.querySelector('#create-task-form');
  if (createTaskForm) createTaskForm.addEventListener('submit', createTask);

  appRoot.querySelectorAll('[data-task-status]').forEach((button) => {
    button.addEventListener('click', () => {
      const row = button.closest('[data-task-row]');
      if (!row) return;
      row.dataset.status = button.dataset.taskStatus;
      row.querySelectorAll('[data-task-status]').forEach((item) => {
        item.classList.toggle('active', item === button);
      });
    });
  });

  appRoot.querySelectorAll('[data-save-task-submission]').forEach((button) => {
    button.addEventListener('click', () => saveTaskSubmission(button));
  });

  wireThemeToggle();
}

async function createTeacher(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);

  const fullName = String(data.get('full_name') || '').trim();
  const email = String(data.get('email') || '').trim().toLowerCase();
  const password = String(data.get('password') || '');

  if (!fullName || !email || password.length < 10) {
    setError('Completa los datos: nombre, correo y contraseña de al menos 10 caracteres.');
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = 'Creando…';

  state.error = '';
  state.notice = '';

  try {
    const { data: result, error } = await supabase.functions.invoke('admin-create-teacher', {
      body: { full_name: fullName, email, password }
    });

    if (error) throw error;
    if (!result?.ok) throw new Error(result?.error || 'No se pudo crear el profesor');

    setNotice(`Profesor ${result.profile.full_name} creado. Entrégale el correo y la contraseña.`);
    form.reset();
    await loadDashboard(state.profile);
  } catch (error) {
    setError(error?.message || 'No se pudo crear el profesor.');
    submitButton.disabled = false;
    submitButton.textContent = 'Crear profesor';
  }
}

async function resetStudentPassword(studentId, button) {
  if (!studentId || button.disabled) return;

  state.error = '';
  state.notice = '';
  button.disabled = true;
  button.textContent = 'Generando…';

  try {
    const { data: result, error } = await supabase.functions.invoke('admin-reset-student-password', {
      body: { student_id: studentId }
    });

    if (error) throw error;
    if (!result?.temporary_password) throw new Error(result?.error || 'No se pudo restablecer la contraseña');

    const name = button.dataset.studentName || result.username || 'el alumno';
    setNotice(`Contraseña temporal de ${name} (${result.username}): ${result.temporary_password}. Entrégala una sola vez.`);
    button.disabled = false;
    button.textContent = 'Nueva contraseña';
  } catch (error) {
    setError(error?.message || 'No se pudo restablecer la contraseña.');
    button.disabled = false;
    button.textContent = 'Nueva contraseña';
  }
}

async function toggleUserActive(button) {
  const userId = button.dataset.toggleUser;
  const currentlyActive = button.dataset.active === '1';

  if (!userId || button.disabled) return;

  const targetName = button.closest('li')?.querySelector('strong')?.textContent || 'usuario';

  if (!currentlyActive && !window.confirm(`¿Activar la cuenta de ${targetName}?`)) return;
  if (currentlyActive && !window.confirm(`¿Desactivar la cuenta de ${targetName}? Perderá el acceso de inmediato.`)) return;

  state.error = '';
  state.notice = '';
  button.disabled = true;

  try {
    const { data: result, error } = await supabase.functions.invoke('deactivate-user', {
      body: { user_id: userId, active: !currentlyActive }
    });

    if (error) throw error;
    if (!result?.ok) throw new Error(result?.error || 'No se pudo actualizar la cuenta');

    setNotice(`Cuenta de ${targetName} ${result.active ? 'activada' : 'desactivada'}.`);
    await loadDashboard(state.profile);
  } catch (error) {
    setError(error?.message || 'No se pudo actualizar la cuenta.');
    button.disabled = false;
  }
}

async function saveSetting(key, button) {
  const input = appRoot.querySelector(`[data-setting-value="${key}"]`);
  if (!input || button.disabled) return;

  let value;
  try {
    value = JSON.parse(input.value);
  } catch {
    setError(`El valor de ${key} debe ser JSON válido.`);
    return;
  }

  state.error = '';
  state.notice = '';
  button.disabled = true;
  button.textContent = 'Guardando…';

  try {
    const { error } = await supabase
      .from('settings')
      .upsert({ key, value, updated_by: state.profile?.id ?? null });

    if (error) throw error;

    setNotice(`Configuración ${key} guardada.`);
    button.disabled = false;
    button.textContent = 'Guardar';
  } catch (error) {
    setError(error?.message || `No se pudo guardar ${key}.`);
    button.disabled = false;
    button.textContent = 'Guardar';
  }
}

async function createStudent(event, groupId) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);

  const fullName = String(data.get('full_name') || '').trim();
  const username = String(data.get('username') || '').trim().toLowerCase();
  const password = String(data.get('password') || '');
  const studentCode = String(data.get('student_code') || '').trim().toUpperCase();

  if (!groupId) {
    setError('Selecciona un grupo para el alumno.');
    return;
  }

  if (!fullName || password.length < 8) {
    setError('Completa los datos: nombre y contraseña temporal (8+ caracteres). El usuario se genera del nombre si lo dejas vacío.');
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = 'Dando de alta…';
  }

  state.error = '';
  state.notice = '';

  try {
    const { data: result, error } = await supabase.functions.invoke('admin-create-student', {
      body: {
        full_name: fullName,
        username: username || null,
        password,
        group_id: groupId,
        student_code: studentCode || null
      }
    });

    if (error) throw error;
    if (!result?.ok) throw new Error(result?.error || 'No se pudo dar de alta al alumno');

    const resultBox = form.querySelector('[data-create-result]');
    if (resultBox) {
      resultBox.innerHTML = `
        <div class="answer-box correct">
          <strong>Alumno dado de alta</strong>
          <p>Usuario: <b>${escapeHtml(result.access.username)}</b><br>
          Contraseña temporal: <b>${escapeHtml(password)}</b><br>
          <small>Entrégaselas una vez. En su primer ingreso, el alumno deberá crear su propia contraseña.</small></p>
        </div>
      `;
    }

    setNotice(`Alumno ${result.student?.student_code || username} dado de alta en el grupo.`);
    form.reset();
    await loadDashboard(state.profile);
  } catch (error) {
    setError(error?.message || 'No se pudo dar de alta al alumno.');
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = 'Dar de alta';
    }
  }
}

function renderAdviseForm(studentId) {
  const box = appRoot.querySelector(`[data-advise-form="${studentId}"]`);
  if (!box) return;

  const group = (state.dashboard?.groups || []).find((item) =>
    item.students.some((student) => student.id === studentId)
  );
  const student = group?.students.find((item) => item.id === studentId);
  const guardians = student?.guardians || [];

  box.classList.toggle('hidden');
  if (box.classList.contains('hidden')) return;

  if (!guardians.length) {
    box.innerHTML = '<p class="empty-state">Este alumno no tiene tutores vinculados. Usa "Invitar tutor" primero.</p>';
    return;
  }

  box.innerHTML = `
    <span class="card-label">Aviso para ${escapeHtml(student?.full_name || 'el alumno')}</span>
    <select data-advise-guardian>
      ${guardians.map((guardian) => `
        <option value="${escapeHtml(guardian.id)}" data-phone="${escapeHtml(guardian.phone || '')}">
          ${escapeHtml(guardian.full_name)}${guardian.relationship ? ` (${escapeHtml(guardian.relationship)})` : ''}
        </option>
      `).join('')}
    </select>
    <textarea data-advise-body rows="3" placeholder="Escribe el aviso que quieres enviar…"></textarea>
    <div class="row">
      <button class="btn primary" data-advise-send="${escapeHtml(studentId)}">Enviar por WhatsApp</button>
      <button class="btn ghost" data-advise-close="${escapeHtml(studentId)}">Cerrar</button>
    </div>
  `;

  box.querySelector('[data-advise-send]').addEventListener('click', () => sendAdvise(studentId, student));
  box.querySelector('[data-advise-close]').addEventListener('click', () => box.classList.add('hidden'));
}

async function sendAdvise(studentId, student) {
  const box = appRoot.querySelector(`[data-advise-form="${studentId}"]`);
  if (!box) return;

  const select = box.querySelector('[data-advise-guardian]');
  const textarea = box.querySelector('[data-advise-body]');
  const option = select?.selectedOptions?.[0];

  const guardianId = select?.value;
  const phone = option?.dataset?.phone || '';
  const guardianName = option?.textContent?.trim() || 'el tutor';
  const body = String(textarea?.value || '').trim();

  if (!body) {
    setError('Escribe el aviso que quieres enviar.');
    return;
  }

  if (!phone) {
    setError('El tutor no tiene teléfono registrado. Edita su ficha o comparte el aviso por otro medio.');
    return;
  }

  const subject = `Aviso sobre ${student?.full_name || 'el alumno'}`;

  try {
    const { error: insertError } = await supabase.from('guardian_messages').insert({
      student_id: studentId,
      guardian_id: guardianId,
      channel: 'whatsapp',
      subject,
      body,
      status: 'sent',
      sent_at: new Date().toISOString()
    });

    if (insertError) throw insertError;

    const waMessage = [
      `Hola ${guardianName} 👋`,
      subject + ':',
      body
    ].join('\n');

    window.open(`https://wa.me/${phone.replace(/[^\d]/g, '')}?text=${encodeURIComponent(waMessage)}`, '_blank', 'noopener');
    setNotice('Aviso registrado. Se abrió WhatsApp para enviarlo.');
    box.classList.add('hidden');
    await loadDashboard(state.profile);
  } catch (error) {
    setError(error?.message || 'No se pudo registrar el aviso.');
  }
}

async function openAttendance(groupId, dateValue) {
  const area = appRoot.querySelector(`[data-attendance-area="${groupId}"]`);
  if (!area) return;

  const openButton = appRoot.querySelector(`[data-attendance-open="${groupId}"]`);

  if (!area.classList.contains('hidden') && !dateValue) {
    area.classList.add('hidden');
    area.innerHTML = '';
    if (openButton) openButton.style.display = '';
    return;
  }

  const group = (state.dashboard?.groups || []).find((item) => item.id === groupId);
  const students = group?.students || [];
  if (!students.length) {
    setError('El grupo no tiene alumnos.');
    return;
  }

  area.classList.remove('hidden');
  area.innerHTML = '<div class="spinner" aria-hidden="true"></div>';
  if (openButton) openButton.style.display = 'none';

  state.error = '';
  state.notice = '';

  const today = new Date().toISOString().slice(0, 10);
  await loadAttendanceArea(groupId, students, area, dateValue || today);
}

async function loadAttendanceArea(groupId, students, area, date) {
  try {
    let { data: session, error } = await supabase
      .from('attendance_sessions')
      .select('id,session_date')
      .eq('group_id', groupId)
      .eq('session_date', date)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    if (!session) {
      const created = await supabase
        .from('attendance_sessions')
        .insert({ group_id: groupId, session_date: date, created_by: state.profile?.id ?? null })
        .select('id,session_date')
        .single();

      if (created.error) throw created.error;
      session = created.data;
    }

    const rows = await supabase
      .from('attendance')
      .select('student_id,status')
      .eq('session_id', session.id);

    if (rows.error) throw rows.error;

    const statusByStudent = new Map((rows.data || []).map((row) => [row.student_id, row.status]));
    const today = new Date().toISOString().slice(0, 10);

    area.innerHTML = `
      <div class="attendance-toolbar">
        <label class="attendance-date">
          <span>Fecha</span>
          <input type="date" value="${escapeHtml(date)}" max="${escapeHtml(today)}" data-attendance-date>
        </label>
        <div class="attendance-bulk">
          <button class="btn-mini" type="button" data-attendance-all="present">Todos presentes</button>
          <button class="btn-mini" type="button" data-attendance-all="absent">Todos ausentes</button>
        </div>
        <button class="btn-mini ghost" type="button" data-attendance-dismiss>Listo</button>
      </div>
      <div class="attendance-summary" data-attendance-summary></div>
      <ul class="attendance-list">
        ${students.map((student) => {
          const status = statusByStudent.get(student.id) || 'present';
          return `
            <li class="attendance-row" data-attendance-row data-student-id="${escapeHtml(student.id)}" data-status="${escapeHtml(status)}">
              <div class="attendance-who">
                <span class="avatar small">${escapeHtml((student.full_name || '?').slice(0, 1).toUpperCase())}</span>
                <div>
                  <strong>${escapeHtml(student.full_name)}</strong>
                  <small>${escapeHtml(student.student_code)}</small>
                </div>
              </div>
              <div class="status-seg" role="group" aria-label="Estado de ${escapeHtml(student.full_name)}">
                ${Object.entries(attendanceLabels).map(([value, label]) => `
                  <button class="status-btn ${status === value ? 'active' : ''}" type="button" data-att-status="${value}">${escapeHtml(label)}</button>
                `).join('')}
              </div>
            </li>
          `;
        }).join('')}
      </ul>
      <div class="row end attendance-actions">
        <span class="muted" data-attendance-save-note><small>Los cambios se guardan por fecha.</small></span>
        <button class="btn primary" data-attendance-save="${escapeHtml(session.id)}" data-attendance-group="${escapeHtml(groupId)}">Guardar asistencia</button>
      </div>
    `;

    wireAttendanceArea(area, groupId, students);
    updateAttendanceSummary(area);
  } catch (error) {
    area.innerHTML = `<p class="empty-state">No se pudo cargar la asistencia: ${escapeHtml(error?.message || 'error')}</p>`;
  }
}

function wireAttendanceArea(area, groupId, students) {
  const dateInput = area.querySelector('[data-attendance-date]');
  if (dateInput) {
    dateInput.addEventListener('change', () => {
      const date = dateInput.value || new Date().toISOString().slice(0, 10);
      area.innerHTML = '<div class="spinner" aria-hidden="true"></div>';
      loadAttendanceArea(groupId, students, area, date);
    });
  }

  area.querySelectorAll('[data-att-status]').forEach((button) => {
    button.addEventListener('click', () => {
      const row = button.closest('[data-attendance-row]');
      if (!row) return;
      row.dataset.status = button.dataset.attStatus;
      row.querySelectorAll('[data-att-status]').forEach((item) => {
        item.classList.toggle('active', item === button);
      });
      updateAttendanceSummary(area);
    });
  });

  area.querySelectorAll('[data-attendance-all]').forEach((button) => {
    button.addEventListener('click', () => {
      const status = button.dataset.attendanceAll;
      area.querySelectorAll('[data-attendance-row]').forEach((row) => {
        row.dataset.status = status;
        row.querySelectorAll('[data-att-status]').forEach((item) => {
          item.classList.toggle('active', item.dataset.attStatus === status);
        });
      });
      updateAttendanceSummary(area);
    });
  });

  const dismiss = area.querySelector('[data-attendance-dismiss]');
  if (dismiss) {
    dismiss.addEventListener('click', () => {
      area.classList.add('hidden');
      area.innerHTML = '';
      const openButton = appRoot.querySelector(`[data-attendance-open="${groupId}"]`);
      if (openButton) openButton.style.display = '';
    });
  }

  const saveButton = area.querySelector('[data-attendance-save]');
  if (saveButton) {
    saveButton.addEventListener('click', () => saveAttendance(saveButton.dataset.attendanceSave, groupId, saveButton, area));
  }
}

function updateAttendanceSummary(area) {
  const summary = area.querySelector('[data-attendance-summary]');
  if (!summary) return;
  const counts = { present: 0, late: 0, excused: 0, absent: 0 };
  area.querySelectorAll('[data-attendance-row]').forEach((row) => {
    const status = row.dataset.status || 'present';
    if (counts[status] != null) counts[status] += 1;
  });
  const total = Object.values(counts).reduce((sum, value) => sum + value, 0);
  summary.innerHTML = `
    <span class="pill pill-green">${counts.present} presentes</span>
    <span class="pill pill-amber">${counts.late} tarde</span>
    <span class="pill">${counts.excused} justificados</span>
    <span class="pill pill-red">${counts.absent} faltas</span>
    <span class="pill pill-blue">${total} alumnos</span>
  `;
}

async function saveAttendance(sessionId, groupId, button, area) {
  if (!area) return;

  button.disabled = true;
  button.textContent = 'Guardando…';
  state.error = '';
  state.notice = '';

  try {
    const rows = [...area.querySelectorAll('[data-attendance-row]')];
    const upserts = rows.map((row) =>
      supabase.from('attendance').upsert({
        session_id: sessionId,
        student_id: row.dataset.studentId,
        status: row.dataset.status || 'present',
        recorded_by: state.profile?.id ?? null
      }, { onConflict: 'session_id,student_id' })
    );

    const results = await Promise.all(upserts);
    const firstError = results.find((result) => result.error)?.error;
    if (firstError) throw firstError;

    const note = area.querySelector('[data-attendance-save-note]');
    if (note) {
      const time = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
      note.innerHTML = `<small>Guardado a las ${escapeHtml(time)} · ${rows.length} alumnos.</small>`;
    }
    button.disabled = false;
    button.textContent = 'Guardar asistencia';
  } catch (error) {
    setError(error?.message || 'No se pudo guardar la asistencia.');
    button.disabled = false;
    button.textContent = 'Guardar asistencia';
  }
}

async function inviteGuardian(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const studentId = form.dataset.inviteForm;
  const studentCode = String(form.dataset.studentCode || 'alumno').toLowerCase();
  const data = new FormData(form);

  const fullName = String(data.get('full_name') || '').trim();
  const phone = String(data.get('phone') || '').trim();
  const relationship = String(data.get('relationship') || '').trim();
  const email = String(data.get('email') || '').trim().toLowerCase()
    || `tutor.${studentCode}@tutores.ecoems.mx`;

  if (!fullName) return;

  const submitButton = form.querySelector('button[type="submit"]');
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = 'Creando…';
  }

  state.error = '';
  state.notice = '';

  try {
    const { data: result, error } = await supabase.functions.invoke('invite-guardian', {
      body: {
        student_id: studentId,
        full_name: fullName,
        phone: phone || null,
        relationship: relationship || null,
        email
      }
    });

    if (error) throw error;
    if (!result?.ok) throw new Error(result?.error || 'No se pudo crear la invitación');

    form.classList.add('hidden');

    const box = appRoot.querySelector(`[data-invite-result="${studentId}"]`);
    if (box) {
      box.classList.remove('hidden');
      box.innerHTML = `
        <span class="card-label">Invitación lista · ${escapeHtml(fullName)}</span>
        <p>Comparte el enlace de acceso por WhatsApp. El tutor entra sin contraseña; si el enlace caduca, vuelve a generar otro con el mismo botón.</p>
        <div class="row">
          <a class="btn primary" href="${escapeHtml(result.whatsapp_share_url)}" target="_blank" rel="noopener">Compartir por WhatsApp</a>
          <button class="btn ghost" data-copy-link="${escapeHtml(result.magic_link)}">Copiar enlace</button>
        </div>
        <p class="invite-link" title="${escapeHtml(result.magic_link)}">${escapeHtml(result.magic_link)}</p>
      `;

      const copyButton = box.querySelector('[data-copy-link]');
      copyButton.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(copyButton.dataset.copyLink);
          copyButton.textContent = '¡Copiado!';
        } catch {
          copyButton.textContent = 'No se pudo copiar';
        }
      });
    }
  } catch (error) {
    setError(error?.message || 'No se pudo crear la invitación. Revisa la conexión.');
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = 'Crear invitación';
    }
  }
}

async function acceptConsent(studentId, button) {
  if (!studentId || button.disabled) return;

  state.error = '';
  state.notice = '';
  button.disabled = true;
  button.textContent = 'Enviando…';

  try {
    const { data, error } = await supabase.functions.invoke('guardian-consent', {
      body: {
        student_id: studentId,
        document_version: PRIVACY_DOCUMENT_VERSION,
        accepted: true
      }
    });

    if (error) throw error;
    if (data?.status !== 'accepted') {
      throw new Error(data?.error || 'No se pudo registrar el consentimiento');
    }

    state.notice = 'Consentimiento registrado. Gracias por confiar en nosotros.';
    await loadDashboard(state.profile);
  } catch {
    setError('No se pudo registrar el consentimiento. Revisa la conexión e intenta de nuevo.');
    button.disabled = false;
    button.textContent = 'Aceptar aviso de privacidad';
  }
}

async function signOut() {
  await supabase.auth.signOut();
  state.session = null;
  state.profile = null;
  state.dashboard = null;
  state.dashboardError = '';
  state.error = '';
  state.notice = '';
  state.mode = 'student';
  lastSessionToken = null;
  renderLogin();
}

export function initApp(root) {
  if (!root) return;
  appRoot = root;

  applyTheme();

  if (!isConfigured) {
    renderConfig();
    return;
  }

  renderLoading();

  supabase.auth.getSession().then(({ data }) => {
    if (data.session) handleSession(data.session);
    else renderLogin();
  });

  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') {
      state.session = null;
      state.profile = null;
      lastSessionToken = null;
      renderLogin();
      return;
    }

    if (session && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
      handleSession(session);
    }
  });
}
