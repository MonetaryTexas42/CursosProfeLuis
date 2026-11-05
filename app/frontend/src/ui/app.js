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

const adminTabLabels = {
  resumen: 'Resumen',
  usuarios: 'Usuarios',
  contenido: 'Contenido',
  configuracion: 'Configuración'
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
  adminTab: 'resumen',
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
      <span class="env-pill">${escapeHtml(appEnv)}</span>
    </header>
  `;
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
    .select('id, role, full_name, username, email, active')
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
  renderDashboard();
  loadDashboard(data);
}

async function loadDashboard(profile) {
  try {
    const data = await fetchDashboardData(profile);
    if (state.profile?.id !== profile.id) return;
    state.dashboard = data;
    state.dashboardError = '';
  } catch {
    if (state.profile?.id !== profile.id) return;
    state.dashboard = null;
    state.dashboardError = 'No se pudieron cargar los datos de tu panel.';
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
    settingsRes, statsRes, unitsRes
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
    supabase.from('units').select('id,subject_id,num,title,status').order('num')
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

  const [unitsRes, versionsRes, assignmentsRes, subjectsRes] = await Promise.all([
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
    supabase.from('subjects').select('id,name').order('name')
  ]);

  assertNoError(unitsRes.error);
  assertNoError(versionsRes.error);
  assertNoError(assignmentsRes.error);
  assertNoError(subjectsRes.error);

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

  return {
    kind: 'teacher',
    groups: groups.map((group) => ({
      ...group,
      students: students
        .filter((student) => student.group_id === group.id)
        .map((student) => ({
          ...student,
          full_name: names.get(student.profile_id) || 'Alumno sin nombre'
        }))
    })),
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
  const counts = data.counts;
  const year = data.year;
  const tab = state.adminTab || 'resumen';

  return `
    <article class="card wide">
      <div class="card-heading">
        <div>
          <span class="card-label">Piloto</span>
          <h2>${year ? escapeHtml(year.name) : 'Sin ciclo activo'}</h2>
        </div>
        <span class="pill ${year ? 'success' : ''}">${year ? 'Activo' : 'Pendiente'}</span>
      </div>
      <p>${year ? `${escapeHtml(formatDate(year.starts_on))} – ${escapeHtml(formatDate(year.ends_on))}` : 'Crea el ciclo escolar para empezar.'}</p>
      <div class="row">
        <span class="pill">${countLabel(counts.profiles, 'perfil', 'perfiles')}</span>
        <span class="pill">${countLabel(counts.teacher || 0, 'profesor', 'profesores')}</span>
        <span class="pill">${countLabel(counts.student || 0, 'alumno', 'alumnos')}</span>
        <span class="pill">${countLabel(counts.guardian || 0, 'tutor', 'tutores')}</span>
      </div>
    </article>

    <nav class="card wide admin-tabs" aria-label="Administración">
      ${Object.entries(adminTabLabels).map(([key, label]) => `
        <button class="mode-tab ${tab === key ? 'active' : ''}" data-admin-tab="${key}">
          ${escapeHtml(label)}
        </button>
      `).join('')}
    </nav>

    ${tab === 'usuarios' ? adminUsersMarkup(data)
      : tab === 'contenido' ? adminContentMarkup(data)
      : tab === 'configuracion' ? adminSettingsMarkup(data)
      : adminResumenMarkup(data)}
  `;
}

function adminResumenMarkup(data) {
  const activeStudents = data.students.filter((student) => student.status === 'active').length;

  return `
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

    <article class="card wide">
      <div class="card-heading">
        <div>
          <span class="card-label">Piloto en números</span>
          <h2>Contenido y avance</h2>
        </div>
      </div>
      <div class="row">
        <span class="pill">${data.stats.filter((row) => row.subject_active).length} materias activas</span>
        <span class="pill">${countLabel(data.units.filter((unit) => unit.status === 'published').length, 'unidad publicada', 'unidades publicadas')}</span>
        <span class="pill">${countLabel(activeStudents, 'alumno activo', 'alumnos activos')}</span>
      </div>
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

function teacherGroupMarkup(group, data) {
  const groupAssignments = data.assignments.filter((assignment) => assignment.group_id === group.id);
  const activeVersionIds = new Set(
    groupAssignments
      .filter((assignment) => assignment.status === 'active')
      .map((assignment) => assignment.unit_version_id)
  );
  const available = data.publishedUnits.flatMap((unit) =>
    unit.versions
      .filter((version) => !activeVersionIds.has(version.id))
      .map((version) => ({ unit, version }))
  );

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
                <small>${escapeHtml(student.student_code)}</small>
              </div>
              <button class="btn ghost" data-invite-toggle="${escapeHtml(student.id)}">Invitar tutor</button>
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
            </li>
          `).join('')}
        </ul>
      ` : '<p class="empty-state">Este grupo aún no tiene alumnos.</p>'}

      <span class="card-label">Unidades del grupo</span>
      ${groupAssignments.length ? `
        <ul class="data-list">
          ${groupAssignments.map((assignment) => `
            <li>
              <div>
                <strong>${escapeHtml(assignment.unit_title)}</strong>
                <small>${escapeHtml(assignmentStatusLabels[assignment.status] || assignment.status)}${assignment.opens_at ? ` · ${escapeHtml(formatDate(assignment.opens_at.slice(0, 10)))}` : ''}</small>
              </div>
            </li>
          `).join('')}
        </ul>
      ` : '<p class="empty-state">Este grupo todavía no tiene unidades.</p>'}

      ${available.length ? `
        <form class="form activation-form" data-activate-group="${escapeHtml(group.id)}">
          <label class="field">
            <span>Activar una unidad publicada</span>
            <select name="version" required>
              ${available.map(({ unit, version }) => `
                <option value="${escapeHtml(unit.id)}:${escapeHtml(version.id)}">${escapeHtml(unit.title)} · v${version.version}</option>
              `).join('')}
            </select>
          </label>
          <button class="btn primary" type="submit">Activar ahora</button>
        </form>
      ` : data.publishedUnits.length
        ? '<p class="empty-state">Todas las versiones publicadas ya están activas en este grupo.</p>'
        : '<p class="empty-state">Aún no hay unidades publicadas. Primero carga contenido.</p>'}
    </div>
  `;
}

function teacherDashboardMarkup(data) {
  const totalStudents = data.groups.reduce((total, group) => total + group.students.length, 0);

  return `
    <article class="card wide">
      <div class="card-heading">
        <div>
          <span class="card-label">Mi grupo</span>
          <h2>${data.groups.length ? escapeHtml(data.groups.map((group) => group.name).join(' · ')) : 'Sin grupo asignado'}</h2>
        </div>
        <span class="pill">${countLabel(totalStudents, 'alumno', 'alumnos')}</span>
      </div>
      ${data.groups.length ? data.groups.map((group) => teacherGroupMarkup(group, data)).join('') : '<p class="empty-state">El administrador todavía no te asignó un grupo.</p>'}
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
  if (state.dashboard.kind === 'teacher') return teacherDashboardMarkup(state.dashboard);
  if (state.dashboard.kind === 'guardian') return guardianDashboardMarkup(state.dashboard);
  return studentDashboardMarkup(state.dashboard);
}

function dashboardMarkup(profile) {
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
  } catch {
    if (state.view !== 'unit' || state.unitView?.assignment.id !== item.id) return;
    setError('No se pudo abrir la unidad. Revisa la conexión o avisa al profesor.');
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

async function activateUnit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const groupId = form.dataset.activateGroup;
  const value = String(new FormData(form).get('version') || '');
  const [unitId, versionId] = value.split(':');

  if (!groupId || !unitId || !versionId) {
    setError('Selecciona una unidad publicada.');
    renderDashboard();
    return;
  }

  const button = form.querySelector('button[type="submit"]');
  if (button) {
    button.disabled = true;
    button.textContent = 'Activando…';
  }

  state.error = '';
  state.notice = '';

  const { error } = await supabase.from('unit_assignments').insert({
    group_id: groupId,
    unit_id: unitId,
    unit_version_id: versionId,
    status: 'active',
    visible: true,
    opens_at: new Date().toISOString(),
    created_by: state.profile.id
  });

  if (error) {
    setError('No se pudo activar la unidad. Revisa la conexión e intenta de nuevo.');
    renderDashboard();
    return;
  }

  setNotice('Unidad activada para el grupo.');
  await loadDashboard(state.profile);
}

function renderDashboard() {
  appRoot.innerHTML = dashboardMarkup(state.profile);

  appRoot.querySelector('#logout-btn').addEventListener('click', signOut);

  appRoot.querySelectorAll('[data-open-unit]').forEach((button) => {
    button.addEventListener('click', () => openUnit(button.dataset.openUnit));
  });

  appRoot.querySelectorAll('[data-activate-group]').forEach((form) => {
    form.addEventListener('submit', activateUnit);
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

  appRoot.querySelectorAll('[data-admin-tab]').forEach((button) => {
    button.addEventListener('click', () => {
      state.adminTab = button.dataset.adminTab;
      state.error = '';
      state.notice = '';
      renderDashboard();
    });
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
