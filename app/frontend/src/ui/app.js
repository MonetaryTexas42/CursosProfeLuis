import { supabase, isConfigured, toStudentEmail, studentEmailDomain, appEnv } from '../lib/supabase.js';
import { downloadReceiptPdf } from './receipt-pdf.js';

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
// La versión vigente también se lee de la vista pública `privacy_document`.
const PRIVACY_DOCUMENT_VERSION = 'v3-2026';

// Etiqueta de versión visible en la cabecera: sirve para confirmar que el
// navegador cargó el build más reciente (no una versión en caché).
const APP_BUILD = 'v8-pulido';

// FUN-09: tamaño de página compartido por los listados paginados.
const PAGE_SIZE = 20;

const staffTabLabels = {
  dashboard: '📊 Dashboard',
  alumnos: '👥 Alumnos',
  materias: '📚 Materias',
  asistencia: '📅 Asistencia',
  pagos: '💳 Pagos',
  tareas: '📝 Tareas',
  actividad: '📈 Actividad',
  tutores: '💬 Tutores',
  usuarios: '🛠️ Usuarios',
  contenido: '🗂️ Contenido',
  auditoria: '🧾 Auditoría',
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

/* ---------------- Tests del alumno: personalidad y orientación ---------------- */

const personalityDimensionLabels = {
  apertura: {
    label: 'Apertura a la experiencia',
    emoji: '💡',
    copy: 'Curiosidad, imaginación y ganas de aprender cosas nuevas.'
  },
  responsabilidad: {
    label: 'Responsabilidad',
    emoji: '🎯',
    copy: 'Constancia, orden y cumplimiento de tus metas.'
  },
  extraversion: {
    label: 'Extraversión',
    emoji: '🗣️',
    copy: 'Energía social y facilidad para conectar con otras personas.'
  },
  amabilidad: {
    label: 'Amabilidad',
    emoji: '🤝',
    copy: 'Empatía, respeto y ganas de colaborar.'
  },
  estabilidad: {
    label: 'Estabilidad emocional',
    emoji: '🌊',
    copy: 'Calma y manejo de la presión en momentos difíciles.'
  }
};

const personalityQuestions = [
  { id: 'p1', dim: 'apertura', text: 'Me gusta probar cosas nuevas y aprender temas distintos.' },
  { id: 'p2', dim: 'apertura', text: 'Soy imaginativo/a y disfruto crear ideas, historias o proyectos.' },
  { id: 'p3', dim: 'apertura', reverse: true, text: 'Prefiero quedarme con las rutinas de siempre antes que probar novedades.' },
  { id: 'p4', dim: 'responsabilidad', text: 'Cumplo mis tareas aunque no tenga muchas ganas.' },
  { id: 'p5', dim: 'responsabilidad', text: 'Organizo mi tiempo y mis materiales con anticipación.' },
  { id: 'p6', dim: 'responsabilidad', reverse: true, text: 'Dejo las cosas para el último momento.' },
  { id: 'p7', dim: 'extraversion', text: 'Disfruto hablar con gente nueva y hacer amigos.' },
  { id: 'p8', dim: 'extraversion', text: 'Me siento con energía cuando estoy en grupo.' },
  { id: 'p9', dim: 'extraversion', reverse: true, text: 'Prefiero quedarme callado/a en reuniones grandes.' },
  { id: 'p10', dim: 'amabilidad', text: 'Escucho y ayudo cuando alguien tiene un problema.' },
  { id: 'p11', dim: 'amabilidad', reverse: true, text: 'Me cuesta ponerme en el lugar de los demás.' },
  { id: 'p12', dim: 'amabilidad', text: 'Trato con respeto a quienes piensan distinto a mí.' },
  { id: 'p13', dim: 'estabilidad', text: 'Me recupero rápido cuando algo me sale mal.' },
  { id: 'p14', dim: 'estabilidad', reverse: true, text: 'Me preocupo mucho por cosas que todavía no pasan.' },
  { id: 'p15', dim: 'estabilidad', text: 'Mantengo la calma en situaciones de presión.' }
];

const personalityScale = [
  { label: 'Nada', emoji: '😐' },
  { label: 'Poco', emoji: '🙂' },
  { label: 'A veces', emoji: '😌' },
  { label: 'Bastante', emoji: '😄' },
  { label: 'Mucho', emoji: '🤩' }
];

const vocationalSteps = [
  {
    id: 'series',
    title: 'Contenido que disfrutas',
    prompt: '¿Qué series, películas o videos sueles ver?',
    help: 'Elige todo lo que de verdad ves. Tus gustos nos ayudan a detectar áreas de interés.',
    options: [
      { label: 'Novelas y K-dramas', tags: ['personas', 'emociones'] },
      { label: 'Series de policías, crimen o misterio', tags: ['análisis', 'lógica', 'justicia'] },
      { label: 'Anime', tags: ['creatividad', 'arte'] },
      { label: 'Ciencia ficción y fantasía', tags: ['ciencia', 'tecnología', 'creatividad'] },
      { label: 'Documentales de naturaleza', tags: ['ciencia', 'naturaleza'] },
      { label: 'Documentales de historia', tags: ['historia', 'cultura'] },
      { label: 'Deportes', tags: ['deporte', 'equipo', 'salud'] },
      { label: 'Comedia', tags: ['creatividad', 'personas'] },
      { label: 'Drama', tags: ['personas', 'emociones'] },
      { label: 'Terror o suspenso', tags: ['análisis', 'creatividad'] },
      { label: 'Caricaturas', tags: ['arte', 'creatividad'] },
      { label: 'Reality shows', tags: ['personas', 'actualidad'] },
      { label: 'Superhéroes', tags: ['justicia', 'creatividad'] },
      { label: 'Videos de YouTube', tags: ['actualidad', 'tecnología'] },
      { label: 'Podcasts', tags: ['cultura', 'actualidad'] },
      { label: 'Videojuegos', tags: ['tecnología', 'lógica'] },
      { label: 'Contenido de cocina', tags: ['cocina', 'creatividad'] },
      { label: 'Música y conciertos', tags: ['música', 'arte'] },
      { label: 'Moda y belleza', tags: ['diseño', 'creatividad'] },
      { label: 'Tecnología y gadgets', tags: ['tecnología', 'ciencia'] }
    ]
  },
  {
    id: 'subjects',
    title: 'Materias favoritas',
    prompt: '¿Qué materias de la escuela disfrutas o se te dan mejor?',
    help: 'Piensa en las clases que más te gustan, aunque no seas el mejor de tu grupo.',
    options: [
      { label: 'Español y Literatura', tags: ['lectura', 'escritura'] },
      { label: 'Matemáticas', tags: ['cálculo', 'lógica'] },
      { label: 'Física y Química', tags: ['ciencia', 'experimentos'] },
      { label: 'Biología', tags: ['ciencia', 'naturaleza'] },
      { label: 'Historia', tags: ['historia', 'cultura'] },
      { label: 'Geografía', tags: ['naturaleza', 'cultura'] },
      { label: 'Inglés u otros idiomas', tags: ['idiomas', 'cultura'] },
      { label: 'Computación', tags: ['tecnología', 'lógica'] },
      { label: 'Artes', tags: ['arte', 'creatividad'] },
      { label: 'Música', tags: ['música', 'arte'] },
      { label: 'Educación física', tags: ['deporte', 'salud'] },
      { label: 'Civismo o Ética', tags: ['sociedad', 'debate'] },
      { label: 'Tecnología o taller', tags: ['manualidades', 'construcción'] }
    ]
  },
  {
    id: 'activities',
    title: 'Actividades favoritas',
    prompt: '¿Qué actividades disfrutas hacer en tu tiempo libre o en la escuela?',
    help: 'Marca todas las que realmente disfrutes, no las que creas que deberías elegir.',
    options: [
      { label: 'Leer', tags: ['lectura', 'cultura'] },
      { label: 'Escribir', tags: ['escritura', 'creatividad'] },
      { label: 'Resolver problemas matemáticos', tags: ['cálculo', 'lógica'] },
      { label: 'Hacer experimentos', tags: ['ciencia', 'experimentos'] },
      { label: 'Dibujar o diseñar', tags: ['arte', 'diseño'] },
      { label: 'Tocar un instrumento o cantar', tags: ['música', 'arte'] },
      { label: 'Hacer deporte', tags: ['deporte', 'salud'] },
      { label: 'Bailar', tags: ['arte', 'deporte'] },
      { label: 'Ayudar a otras personas', tags: ['ayudar', 'empatía'] },
      { label: 'Usar computadoras o programar', tags: ['tecnología', 'lógica'] },
      { label: 'Jugar videojuegos', tags: ['tecnología', 'lógica'] },
      { label: 'Cuidar plantas o animales', tags: ['naturaleza', 'animales'] },
      { label: 'Cocinar', tags: ['cocina', 'creatividad'] },
      { label: 'Armar o reparar cosas', tags: ['manualidades', 'construcción'] },
      { label: 'Debatir', tags: ['debate', 'sociedad'] },
      { label: 'Organizar eventos', tags: ['organización', 'liderazgo'] },
      { label: 'Aprender idiomas', tags: ['idiomas', 'cultura'] },
      { label: 'Vender o emprender', tags: ['negocios', 'emprendimiento'] }
    ]
  },
  {
    id: 'aptitudes',
    title: 'Aptitudes',
    prompt: '¿En qué te sientes bueno/a o crees que destacas?',
    help: 'Piensa en lo que profesores, familiares o amigos te han reconocido.',
    options: [
      { label: 'Cálculo mental', tags: ['cálculo'] },
      { label: 'Comprensión de lectura', tags: ['lectura'] },
      { label: 'Escritura', tags: ['escritura'] },
      { label: 'Memorizar', tags: ['memoria'] },
      { label: 'Creatividad', tags: ['creatividad'] },
      { label: 'Comunicación', tags: ['comunicación'] },
      { label: 'Liderazgo', tags: ['liderazgo'] },
      { label: 'Organización', tags: ['organización'] },
      { label: 'Tecnología', tags: ['tecnología'] },
      { label: 'Deporte', tags: ['deporte'] },
      { label: 'Música', tags: ['música'] },
      { label: 'Dibujo o arte', tags: ['arte'] },
      { label: 'Empatía', tags: ['empatía'] },
      { label: 'Resolver conflictos', tags: ['sociedad', 'empatía'] },
      { label: 'Manualidades', tags: ['manualidades'] },
      { label: 'Análisis de datos', tags: ['datos', 'análisis'] }
    ]
  },
  {
    id: 'workdays',
    title: 'Un día de trabajo',
    prompt: '¿Qué te gustaría hacer en un día de trabajo?',
    help: 'Imagina tu rutina ideal. Elige las actividades que más te emocionen.',
    options: [
      { label: 'Atender y ayudar personas', tags: ['ayudar', 'personas'] },
      { label: 'Resolver problemas con números', tags: ['cálculo', 'análisis'] },
      { label: 'Crear diseños o contenido', tags: ['creatividad', 'diseño'] },
      { label: 'Construir o reparar cosas', tags: ['construcción', 'manualidades'] },
      { label: 'Investigar y experimentar', tags: ['ciencia', 'experimentos'] },
      { label: 'Vender o negociar', tags: ['negocios', 'comunicación'] },
      { label: 'Enseñar o capacitar', tags: ['comunicación', 'personas'] },
      { label: 'Organizar equipos o eventos', tags: ['organización', 'liderazgo'] },
      { label: 'Cuidar animales', tags: ['animales', 'naturaleza'] },
      { label: 'Cuidar la salud de personas', tags: ['salud', 'ayudar'] },
      { label: 'Programar o crear apps', tags: ['tecnología', 'lógica'] },
      { label: 'Escribir historias o noticias', tags: ['escritura', 'lectura'] },
      { label: 'Defender causas o personas', tags: ['justicia', 'debate'] },
      { label: 'Cocinar o preparar alimentos', tags: ['cocina', 'creatividad'] },
      { label: 'Producir música o videos', tags: ['música', 'creatividad'] },
      { label: 'Entrenar o competir', tags: ['deporte', 'salud'] }
    ]
  },
  {
    id: 'environment',
    title: 'Ambiente de trabajo',
    prompt: '¿Cómo te imaginas trabajando en el futuro?',
    help: 'Puedes elegir varios ambientes. No hay respuestas correctas o incorrectas.',
    options: [
      { label: 'Solo/a', tags: ['autonomía'] },
      { label: 'En equipo', tags: ['equipo'] },
      { label: 'Al aire libre', tags: ['naturaleza'] },
      { label: 'En oficina', tags: ['organización'] },
      { label: 'En laboratorio', tags: ['experimentos'] },
      { label: 'Con personas', tags: ['personas'] },
      { label: 'Con animales', tags: ['animales'] },
      { label: 'Con números y datos', tags: ['datos', 'cálculo'] },
      { label: 'Con tecnología', tags: ['tecnología'] },
      { label: 'Creando cosas', tags: ['creatividad', 'diseño'] },
      { label: 'Ayudando a la comunidad', tags: ['ayudar', 'sociedad'] },
      { label: 'Liderando proyectos', tags: ['liderazgo'] }
    ]
  },
  {
    id: 'values',
    title: 'Lo que valoras',
    prompt: '¿Qué es lo más importante para ti en un futuro trabajo?',
    help: 'Elige hasta tres opciones que más te importen.',
    options: [
      { label: 'Ayudar a los demás', tags: ['ayudar'] },
      { label: 'Creatividad', tags: ['creatividad'] },
      { label: 'Estabilidad económica', tags: ['estabilidad'] },
      { label: 'Libertad', tags: ['autonomía'] },
      { label: 'Aprender siempre', tags: ['ciencia', 'cultura'] },
      { label: 'Liderar', tags: ['liderazgo'] },
      { label: 'Impacto social', tags: ['sociedad'] },
      { label: 'Trabajo seguro', tags: ['estabilidad'] },
      { label: 'Reconocimiento', tags: ['liderazgo'] },
      { label: 'Tiempo libre', tags: ['bienestar'] }
    ]
  },
  {
    id: 'future',
    title: 'Tu futuro',
    prompt: '¿Cómo te imaginas en el futuro?',
    help: 'Elige las escenas que más te gustaría vivir dentro de unos años.',
    options: [
      { label: 'Ayudando a mi comunidad', tags: ['ayudar', 'sociedad'] },
      { label: 'Con mi propio negocio', tags: ['negocios', 'liderazgo'] },
      { label: 'Viviendo de mi arte', tags: ['arte', 'creatividad'] },
      { label: 'Siendo reconocido en mi profesión', tags: ['liderazgo'] },
      { label: 'Viajando por mi trabajo', tags: ['idiomas', 'actualidad'] },
      { label: 'Trabajando con tecnología', tags: ['tecnología'] },
      { label: 'En un hospital o laboratorio', tags: ['salud', 'ciencia'] },
      { label: 'En una oficina', tags: ['organización', 'negocios'] },
      { label: 'Al aire libre', tags: ['naturaleza', 'deporte'] },
      { label: 'Dando clases', tags: ['comunicación', 'personas'] },
      { label: 'En un juzgado o despacho', tags: ['justicia', 'debate'] },
      { label: 'Con estabilidad económica', tags: ['estabilidad'] }
    ]
  }
];

const careerCatalog = [
  { name: 'Medicina', tags: ['salud', 'ciencia', 'ayudar', 'personas'] },
  { name: 'Enfermería', tags: ['salud', 'ayudar', 'personas', 'equipo'] },
  { name: 'Psicología', tags: ['personas', 'emociones', 'ayudar', 'ciencia'] },
  { name: 'Nutrición', tags: ['salud', 'ciencia', 'ayudar', 'bienestar'] },
  { name: 'Veterinaria', tags: ['animales', 'salud', 'ciencia', 'naturaleza'] },
  { name: 'Biología', tags: ['ciencia', 'naturaleza', 'experimentos', 'análisis'] },
  { name: 'Química', tags: ['ciencia', 'experimentos', 'análisis', 'cálculo'] },
  { name: 'Física', tags: ['ciencia', 'cálculo', 'análisis', 'tecnología'] },
  { name: 'Matemáticas', tags: ['cálculo', 'análisis', 'datos', 'lógica'] },
  { name: 'Ingeniería en sistemas', tags: ['tecnología', 'cálculo', 'lógica', 'datos'] },
  { name: 'Ciencia de datos', tags: ['datos', 'cálculo', 'tecnología', 'análisis'] },
  { name: 'Ingeniería civil', tags: ['cálculo', 'construcción', 'naturaleza', 'organización'] },
  { name: 'Ingeniería mecánica', tags: ['cálculo', 'construcción', 'tecnología', 'manualidades'] },
  { name: 'Ingeniería industrial', tags: ['cálculo', 'organización', 'negocios', 'liderazgo'] },
  { name: 'Arquitectura', tags: ['arte', 'construcción', 'creatividad', 'diseño'] },
  { name: 'Diseño gráfico', tags: ['arte', 'creatividad', 'tecnología', 'diseño'] },
  { name: 'Animación y videojuegos', tags: ['arte', 'tecnología', 'creatividad', 'lógica'] },
  { name: 'Diseño de modas', tags: ['diseño', 'arte', 'creatividad', 'actualidad'] },
  { name: 'Comunicación', tags: ['escritura', 'personas', 'creatividad', 'actualidad'] },
  { name: 'Periodismo', tags: ['escritura', 'lectura', 'actualidad', 'sociedad'] },
  { name: 'Derecho', tags: ['lectura', 'debate', 'sociedad', 'justicia'] },
  { name: 'Criminología', tags: ['justicia', 'análisis', 'sociedad', 'lógica'] },
  { name: 'Administración', tags: ['organización', 'liderazgo', 'negocios', 'datos'] },
  { name: 'Contaduría', tags: ['cálculo', 'organización', 'datos', 'negocios'] },
  { name: 'Docencia', tags: ['ayudar', 'personas', 'comunicación', 'lectura'] },
  { name: 'Trabajo social', tags: ['ayudar', 'sociedad', 'personas', 'empatía'] },
  { name: 'Gastronomía', tags: ['cocina', 'creatividad', 'manualidades', 'emprendimiento'] },
  { name: 'Música', tags: ['música', 'arte', 'creatividad', 'disciplina'] },
  { name: 'Artes escénicas', tags: ['arte', 'creatividad', 'personas', 'comunicación'] },
  { name: 'Ciencias del deporte', tags: ['deporte', 'salud', 'equipo', 'disciplina'] },
  { name: 'Turismo', tags: ['personas', 'idiomas', 'organización', 'actualidad'] },
  { name: 'Mercadotecnia', tags: ['creatividad', 'negocios', 'personas', 'actualidad'] },
  { name: 'Relaciones internacionales', tags: ['idiomas', 'sociedad', 'debate', 'actualidad'] },
  { name: 'Ciencias políticas', tags: ['sociedad', 'debate', 'actualidad', 'liderazgo'] },
  { name: 'Historia', tags: ['historia', 'cultura', 'lectura', 'sociedad'] },
  { name: 'Literatura', tags: ['lectura', 'escritura', 'cultura', 'creatividad'] },
  { name: 'Lenguas extranjeras', tags: ['idiomas', 'cultura', 'comunicación', 'lectura'] }
];

const testKindLabels = {
  personality: 'Test de personalidad',
  vocational: 'Test de orientación vocacional'
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
  paymentsPage: 1,
  sidebarCollapsed: localStorage.getItem('ecoems_sidebar') === 'collapsed',
  collapsedSubjects: readCollapsedSubjects(),
  fichaStudentId: null,
  fichaTrigger: null,
  fichaEscHandler: null,
  unitAssign: null,
  payDialog: null,
  subjectsGroupId: null,
  activeTest: null,
  loading: true,
  pendingLoginUsername: '',
  studentInvitation: null,
  passwordRecovery: false
};

let appRoot = null;
let lastSessionToken = null;
let passwordResetCleanup = null;
let dataRequestCleanup = null;

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

// PRIV-04 / COD-01: el navegador no debe conservar preferencias ni borradores
// de una sesión terminada. Se eliminan las claves actuales y las heredadas.
const LEGACY_STORAGE_KEYS = [
  'ecoems_nav_open',
  'ecoems_sidebar_off',
  'curso_comipems_v1',
  'curso_ecoems_alumnos_v1',
  'curso_ecoems_pagos_v1',
  'curso_ecoems_asistencia_v1',
  'curso_ecoems_plan_v1',
  'curso_ecoems_perfiles_v1',
  'curso_ecoems_entregas_v1',
  'lectura_reto_v1',
  'mate_reto_v1'
];

function clearLocalSessionData() {
  const keys = new Set();

  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (key && key.startsWith('ecoems_')) keys.add(key);
  }
  for (const key of LEGACY_STORAGE_KEYS) keys.add(key);
  for (const key of keys) localStorage.removeItem(key);

  state.sidebarCollapsed = false;
  state.collapsedSubjects = new Set();
}

function setError(message) {
  state.error = message;
  state.notice = '';
}

function setNotice(message) {
  state.notice = message;
  state.error = '';
}

// UX-02: un solo helper para los diálogos. Mantiene el foco dentro mientras
// el diálogo está abierto, cierra con Escape y devuelve el foco al disparador.
// Devuelve la función de limpieza que deben llamar los `close*`.
function trapDialogFocus(container, close) {
  if (!container) return () => {};

  const previous = document.activeElement;
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  const onKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }

    if (event.key !== 'Tab') return;

    const items = [...container.querySelectorAll(selector)].filter(
      (element) => element.offsetParent !== null || element === document.activeElement
    );
    if (!items.length) return;

    const first = items[0];
    const last = items[items.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  document.addEventListener('keydown', onKeyDown);
  requestAnimationFrame(() => {
    (container.querySelector('[autofocus]') || container.querySelector(selector))?.focus();
  });

  return () => {
    document.removeEventListener('keydown', onKeyDown);
    if (previous?.isConnected && typeof previous.focus === 'function') previous.focus();
  };
}

function alertMarkup() {
  if (!state.error && !state.notice) return '';
  const isError = Boolean(state.error);
  const type = isError ? 'error' : 'notice';
  const text = state.error || state.notice;
  return `<div class="alert ${type}" role="${isError ? 'alert' : 'status'}" aria-live="${isError ? 'assertive' : 'polite'}">${escapeHtml(text)}</div>`;
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
        <span class="env-pill" title="Versión del build">${escapeHtml(APP_BUILD)}</span>
        <button class="theme-toggle" id="theme-toggle" aria-label="Cambiar tema" title="Cambiar entre modo oscuro y claro">🌓</button>
      </div>
    </header>
  `;
}

function privacyFooterMarkup() {
  const version = state.dashboard?.privacy?.version || PRIVACY_DOCUMENT_VERSION;
  const url = state.dashboard?.privacy?.url || '/privacidad.html';

  return `
    <footer class="privacy-footer">
      <a href="${escapeHtml(url)}" target="_blank" rel="noopener">Aviso de privacidad</a>
      ${state.session ? `
        <span aria-hidden="true">·</span>
        <button class="link-button" type="button" id="data-request-btn">Solicitar mis datos</button>
      ` : ''}
      <span aria-hidden="true">·</span>
      <span>Versión ${escapeHtml(version)}</span>
      <span aria-hidden="true">·</span>
      <span>Documento en revisión legal</span>
    </footer>
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
      <main id="main-content" tabindex="-1" class="center">
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
      <main id="main-content" tabindex="-1" class="center">
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
  const prefillUsername = state.pendingLoginUsername || '';
  state.pendingLoginUsername = '';

  appRoot.innerHTML = `
    <div class="shell">
      ${headerMarkup()}
      <main id="main-content" tabindex="-1" class="center">
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
                <input name="username" autocomplete="username" autocapitalize="none" spellcheck="false" placeholder="ana.martinez o tu correo" value="${escapeHtml(prefillUsername)}" required>
              </label>
              <p class="hint">Entra con el usuario que te dio tu profesor, o con tu <strong>correo</strong> si ya tenías cuenta.</p>
              <label class="field">
                <span>Contraseña</span>
                <input name="password" type="password" autocomplete="current-password" placeholder="Tu contraseña" required>
              </label>
            ` : isGuardian ? `
              <div class="guardian-login-note">
                <span class="card-label">Acceso para tutores</span>
                <h2>Usa tu enlace de acceso</h2>
                <p>Tu profesor te envía el enlace de acceso por <strong>correo electrónico</strong>. Ábrelo desde tu bandeja de entrada y entrarás directo, sin contraseña.</p>
                <p class="hint">¿El enlace venció o no lo tienes? Pídele a tu profesor que te reenvíe la invitación.</p>
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
            ${isGuardian ? '' : `
              <div class="row">
                <button class="btn primary" type="submit" id="submit-btn">Entrar</button>
                <button class="btn ghost" type="button" id="forgot-password-btn">Olvidé mi contraseña</button>
              </div>
            `}
          </form>

          <p class="fine-print">Recupera tu contraseña con tu correo registrado. Los tutores entran con el enlace que reciben por correo.</p>
          ${privacyFooterMarkup()}
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
  appRoot.querySelector('#forgot-password-btn')?.addEventListener('click', openPasswordReset);
  wireThemeToggle();
}

// FUN-06: recuperación de contraseña con el correo registrado. Supabase
// envía el enlace; la interfaz nunca muestra si la cuenta existe o no.
function passwordResetMarkup(prefill) {
  return `
    <div class="unit-assign-overlay" data-password-reset-overlay>
      <section class="unit-assign-dialog" role="dialog" aria-modal="true" aria-labelledby="password-reset-title">
        <button type="button" class="ficha-close" data-password-reset-close aria-label="Cerrar">✕</button>
        <header class="unit-assign-head">
          <span class="card-label">Recuperar acceso</span>
          <h2 id="password-reset-title">Restablece tu contraseña</h2>
          <p class="muted">Te enviaremos un enlace de un solo uso a tu correo registrado.</p>
        </header>
        <form id="password-reset-form" class="form">
          <label class="field">
            <span>Correo registrado</span>
            <input name="email" type="email" autocomplete="email" value="${escapeHtml(prefill)}" placeholder="tu@correo.com" required>
          </label>
          <p class="hint">Si el correo existe en la plataforma, recibirás las instrucciones en unos minutos.</p>
          <div class="unit-assign-error" data-password-reset-error hidden></div>
          <footer class="unit-assign-foot">
            <button type="button" class="btn ghost" data-password-reset-close>Cancelar</button>
            <button type="submit" class="btn primary" id="password-reset-submit">Enviar enlace</button>
          </footer>
        </form>
      </section>
    </div>
  `;
}

function prefillResetEmail() {
  const input = appRoot.querySelector('#login-form input[name="username"], #login-form input[name="email"]');
  const raw = String(input?.value || '').trim();
  if (!raw) return '';
  return raw.includes('@') ? raw.toLowerCase() : toStudentEmail(raw);
}

function openPasswordReset() {
  closePasswordReset();
  document.body.insertAdjacentHTML('beforeend', passwordResetMarkup(prefillResetEmail()));
  document.body.classList.add('unit-assign-open');

  const overlay = document.querySelector('[data-password-reset-overlay]');
  passwordResetCleanup = trapDialogFocus(overlay, closePasswordReset);

  overlay.querySelectorAll('[data-password-reset-close]').forEach((button) => {
    button.addEventListener('click', closePasswordReset);
  });
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) closePasswordReset();
  });
  overlay.querySelector('#password-reset-form').addEventListener('submit', submitPasswordReset);
}

function closePasswordReset() {
  if (passwordResetCleanup) {
    passwordResetCleanup();
    passwordResetCleanup = null;
  }
  document.querySelectorAll('[data-password-reset-overlay]').forEach((overlay) => overlay.remove());
  document.body.classList.remove('unit-assign-open');
}

async function submitPasswordReset(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const email = String(new FormData(form).get('email') || '').trim().toLowerCase();
  const button = form.querySelector('#password-reset-submit');
  const errorBox = form.querySelector('[data-password-reset-error]');

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    if (errorBox) {
      errorBox.textContent = 'Escribe un correo válido.';
      errorBox.hidden = false;
    }
    return;
  }

  button.disabled = true;
  button.textContent = 'Enviando…';

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.href.split('#')[0]
    });
    if (error) throw error;
  } catch {
    // FUN-06: mantenemos el diálogo abierto para no perder lo escrito. El
    // mensaje es neutro: no revela si la cuenta existe.
    if (errorBox) {
      errorBox.textContent = 'No se pudo enviar el enlace. Intenta de nuevo en unos minutos.';
      errorBox.hidden = false;
    }
    button.disabled = false;
    button.textContent = 'Enviar enlace';
    return;
  }

  closePasswordReset();
  setNotice('Si el correo está registrado, ya recibiste las instrucciones para crear tu contraseña.');
  renderLogin();
}

// PRIV-06: canal interno para ejercer los derechos ARCO. La dirección de
// contacto se configura en `settings`; mientras esté vacía no se inventa.
function dataRequestMarkup() {
  return `
    <div class="unit-assign-overlay" data-data-request-overlay>
      <section class="unit-assign-dialog" role="dialog" aria-modal="true" aria-labelledby="data-request-title">
        <button type="button" class="ficha-close" data-data-request-close aria-label="Cerrar">✕</button>
        <header class="unit-assign-head">
          <span class="card-label">Privacidad</span>
          <h2 id="data-request-title">Solicitar mis datos</h2>
          <p class="muted">Registramos tu solicitud con fecha y plazo de respuesta en el portal.</p>
        </header>
        <form id="data-request-form" class="form">
          <label class="field">
            <span>Tipo de solicitud</span>
            <select name="kind" required>
              <option value="access">Acceso a mis datos</option>
              <option value="rectification">Rectificación</option>
              <option value="cancellation">Cancelación</option>
              <option value="opposition">Oposición</option>
              <option value="portability">Portabilidad</option>
              <option value="revocation">Revocación de consentimiento</option>
            </select>
          </label>
          <label class="field">
            <span>Detalles (opcional)</span>
            <textarea name="details" rows="4" maxlength="2000" placeholder="Explica qué necesitas"></textarea>
          </label>
          <div class="unit-assign-error" data-data-request-error hidden></div>
          <footer class="unit-assign-foot">
            <button type="button" class="btn ghost" data-data-request-close>Cancelar</button>
            <button type="submit" class="btn primary">Enviar solicitud</button>
          </footer>
        </form>
      </section>
    </div>
  `;
}

function openDataRequest() {
  closeDataRequest();
  document.body.insertAdjacentHTML('beforeend', dataRequestMarkup());
  document.body.classList.add('unit-assign-open');

  const overlay = document.querySelector('[data-data-request-overlay]');
  dataRequestCleanup = trapDialogFocus(overlay, closeDataRequest);

  overlay.querySelectorAll('[data-data-request-close]').forEach((button) => {
    button.addEventListener('click', closeDataRequest);
  });
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) closeDataRequest();
  });
  overlay.querySelector('#data-request-form').addEventListener('submit', submitDataRequest);
}

function closeDataRequest() {
  if (dataRequestCleanup) {
    dataRequestCleanup();
    dataRequestCleanup = null;
  }
  document.querySelectorAll('[data-data-request-overlay]').forEach((overlay) => overlay.remove());
  document.body.classList.remove('unit-assign-open');
}

async function submitDataRequest(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const errorBox = form.querySelector('[data-data-request-error]');
  const button = form.querySelector('button[type="submit"]');

  button.disabled = true;
  button.textContent = 'Enviando…';

  let result;
  try {
    const response = await supabase.rpc('app_create_data_request', {
      p_kind: String(data.get('kind') || ''),
      p_details: String(data.get('details') || '').trim() || null
    });
    if (response.error) throw response.error;
    result = response.data;
  } catch (error) {
    if (errorBox) {
      errorBox.textContent = error?.message || 'No se pudo registrar la solicitud. Intenta de nuevo.';
      errorBox.hidden = false;
    }
    button.disabled = false;
    button.textContent = 'Enviar solicitud';
    return;
  }

  closeDataRequest();

  setNotice(`Solicitud registrada. Plazo de respuesta: ${formatDate(String(result?.due_at || '').slice(0, 10))}.`);
  renderDashboard();
}

function renderChangePassword() {
  const name = state.profile?.full_name || '';
  const recovery = Boolean(state.passwordRecovery);

  appRoot.innerHTML = `
    <div class="shell">
      ${headerMarkup()}
      <main id="main-content" tabindex="-1" class="center">
        <section class="panel login-panel">
          <span class="kicker">${recovery ? 'Recuperación de acceso' : 'Primer ingreso'}</span>
          <h1>${recovery ? 'Elige una nueva contraseña' : `Hola, ${escapeHtml(name.split(' ')[0] || 'alumno')} 👋`}</h1>
          <p class="muted">${recovery
            ? 'Usamos el enlace de recuperación que enviamos a tu correo. Crea una contraseña nueva para entrar.'
            : 'Tu contraseña actual es temporal. Crea una nueva que solo tú conozcas para continuar.'}</p>

          ${alertMarkup()}

          <form id="change-password-form" class="form">
            <label class="field">
              <span>Nueva contraseña (mínimo 12 caracteres, con mayúscula, minúscula y número)</span>
              <input name="password" type="password" autocomplete="new-password" minlength="12" placeholder="Tu nueva contraseña" required>
            </label>
            <label class="field">
              <span>Confirma tu nueva contraseña</span>
              <input name="confirm" type="password" autocomplete="new-password" minlength="12" placeholder="Repite la contraseña" required>
            </label>
            <button class="btn primary" type="submit" id="change-password-btn">Guardar y continuar</button>
          </form>

          <p class="fine-print">Elige una contraseña que recuerdes: con ella entrarás a partir de ahora.</p>
          ${privacyFooterMarkup()}
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

  if (password.length < 12) {
    setError('La contraseña debe tener al menos 12 caracteres.');
    renderChangePassword();
    return;
  }

  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) {
    setError('La contraseña debe incluir al menos una minúscula, una mayúscula y un número.');
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
    // SEC-03: el cambio y el borrado de la bandera ocurren en el servidor.
    // La RPC anterior permitía limpiar la bandera sin cambiar la contraseña.
    const { data: result, error } = await supabase.functions.invoke('complete-password-change', {
      body: { new_password: password }
    });

    if (error) throw error;
    if (!result?.ok) throw new Error(result?.error || 'No se pudo actualizar la contraseña');

    state.profile = { ...(state.profile || {}), must_change_password: false };
    state.passwordRecovery = false;
    setNotice('Contraseña actualizada. ¡Bienvenido!');
    state.view = 'dashboard';
    renderDashboard();
    await loadDashboard(state.profile);
  } catch (error) {
    setError(error?.message || 'No se pudo actualizar la contraseña. Intenta de nuevo.');
    renderChangePassword();
  }
}

function clearLinkTokenFromUrl() {
  const url = new URL(window.location.href);
  if (!url.searchParams.has('link_token')) return;
  url.searchParams.delete('link_token');
  window.history.replaceState({}, '', url.pathname + url.search + url.hash);
}

function renderLinkRedemption(token) {
  appRoot.innerHTML = `
    <div class="shell">
      ${headerMarkup()}
      <main id="main-content" tabindex="-1" class="center">
        <section class="panel login-panel">
          <span class="kicker">Invitación de alumno</span>
          <h1>Crea tu contraseña</h1>
          <p class="muted">Tu profesor generó este enlace de un solo uso. Elige una contraseña que solo tú conozcas.</p>

          ${alertMarkup()}

          <form id="link-redeem-form" class="form">
            <label class="field">
              <span>Nueva contraseña (mínimo 12, con mayúscula, minúscula y número)</span>
              <input name="password" type="password" autocomplete="new-password" minlength="12" placeholder="Tu nueva contraseña" required>
            </label>
            <label class="field">
              <span>Confirma tu nueva contraseña</span>
              <input name="confirm" type="password" autocomplete="new-password" minlength="12" placeholder="Repite la contraseña" required>
            </label>
            <button class="btn primary" type="submit" id="link-redeem-btn">Guardar contraseña</button>
          </form>

          <p class="fine-print">Si el enlace venció, pide a tu profesor que genere uno nuevo.</p>
          <div class="row">
            <button class="btn ghost" type="button" id="link-redeem-cancel">Ya tengo contraseña</button>
          </div>
          ${privacyFooterMarkup()}
        </section>
      </main>
    </div>
  `;

  appRoot.querySelector('#link-redeem-form').addEventListener('submit', (event) => {
    redeemLinkToken(event, token);
  });
  appRoot.querySelector('#link-redeem-cancel').addEventListener('click', () => {
    clearLinkTokenFromUrl();
    state.error = '';
    state.notice = '';
    renderLogin();
  });
  wireThemeToggle();
}

async function redeemLinkToken(event, token) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const button = appRoot.querySelector('#link-redeem-btn');

  const password = String(data.get('password') || '');
  const confirm = String(data.get('confirm') || '');

  state.error = '';
  state.notice = '';

  if (password.length < 12) {
    setError('La contraseña debe tener al menos 12 caracteres.');
    renderLinkRedemption(token);
    return;
  }

  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) {
    setError('La contraseña debe incluir al menos una minúscula, una mayúscula y un número.');
    renderLinkRedemption(token);
    return;
  }

  if (password !== confirm) {
    setError('Las contraseñas no coinciden.');
    renderLinkRedemption(token);
    return;
  }

  button.disabled = true;
  button.textContent = 'Guardando…';

  try {
    const { data: result, error } = await supabase.functions.invoke('redeem-student-link-token', {
      body: { token, new_password: password }
    });

    if (error) throw error;
    if (!result?.ok) throw new Error(result?.error || 'No se pudo canjear la invitación');

    clearLinkTokenFromUrl();
    state.mode = 'student';
    state.pendingLoginUsername = result.username || result.email || '';
    setNotice(`Contraseña creada. Entra con tu usuario ${result.username || result.email}.`);
    renderLogin();
  } catch (error) {
    setError(await functionErrorMessage(error, 'No se pudo canjear la invitación. Pide un enlace nuevo.'));
    renderLinkRedemption(token);
  }
}

async function functionErrorMessage(error, fallback) {
  try {
    const response = error?.context;
    if (response && typeof response.clone === 'function') {
      const body = await response.clone().json();
      if (body?.error) return String(body.error);
    }
  } catch {
    // El cuerpo no era JSON: se usa el mensaje genérico.
  }

  return error?.message || fallback;
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
    const rawUser = String(data.get('username') || '').trim();
    const email = state.mode === 'student'
      ? (rawUser.includes('@') ? rawUser.toLowerCase() : toStudentEmail(rawUser))
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
  if (profile.role === 'guardian') return fetchGuardianDashboard(profile);
  return fetchStudentDashboard(profile.id);
}

async function fetchAdminDashboard() {
  const [
    yearRes, groupsRes, profilesRes, studentsRes, guardiansRes, linksRes,
    settingsRes, statsRes, unitsRes, overviewRes, boardRes, studentProfilesRes, termsRes, assignmentsRes,
    unitVersionsRes, overridesRes, tasksRes, activityRes, externalAccountsRes, billingRes, paymentsRes, billingStatusRes,
    auditRes, dataRequestsRes
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
    supabase
      .from('unit_versions')
      .select('id,unit_id,version,published_at')
      .not('published_at', 'is', null)
      .order('version', { ascending: false }),
    supabase
      .from('student_unit_overrides')
      .select('assignment_id,student_id,status,opens_at,closes_at'),
    supabase.rpc('app_staff_tasks'),
    supabase.rpc('app_activity_log', { p_limit: 80 }),
    supabase.rpc('app_external_accounts'),
    supabase.from('student_billing').select('*'),
    supabase
      .from('payments')
      .select('id,student_id,amount,paid_at,method,period,notes,period_start,period_end,status,receipt_no,voided_at,void_reason')
      .order('paid_at', { ascending: false })
      .limit(600),
    supabase.from('student_billing_status').select('*'),
    supabase
      .from('audit_log')
      .select('id,actor_id,action,entity_type,entity_id,created_at')
      .order('created_at', { ascending: false })
      .limit(200),
    supabase
      .from('data_requests')
      .select('id,profile_id,student_id,kind,details,status,received_at,due_at,resolved_at,resolution')
      .order('received_at', { ascending: false })
      .limit(200)
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
  assertNoError(unitVersionsRes.error);
  assertNoError(overridesRes.error);
  assertNoError(tasksRes.error);
  assertNoError(activityRes.error);
  assertNoError(externalAccountsRes.error);
  assertNoError(billingRes.error);
  assertNoError(paymentsRes.error);
  assertNoError(billingStatusRes.error);
  assertNoError(auditRes.error);
  assertNoError(dataRequestsRes.error);

  const profiles = profilesRes.data || [];
  const students = studentsRes.data || [];
  const guardians = guardiansRes.data || [];
  const groups = groupsRes.data || [];
  const units = unitsRes.data || [];

  const subjectNameMap = new Map(
    (statsRes.data || []).map((row) => [row.subject_id, row.subject_name])
  );

  const versionsByUnit = new Map();
  for (const version of unitVersionsRes.data || []) {
    if (!versionsByUnit.has(version.unit_id)) versionsByUnit.set(version.unit_id, []);
    versionsByUnit.get(version.unit_id).push(version);
  }

  const publishedUnits = units
    .filter((unit) => unit.status === 'published')
    .map((unit) => ({
      ...unit,
      subject_name: subjectNameMap.get(unit.subject_id) || unit.subject_id,
      versions: versionsByUnit.get(unit.id) || []
    }));

  const overridesByAssignment = new Map();
  for (const override of overridesRes.data || []) {
    if (!overridesByAssignment.has(override.assignment_id)) {
      overridesByAssignment.set(override.assignment_id, []);
    }
    overridesByAssignment.get(override.assignment_id).push(override);
  }

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
    assignments: (assignmentsRes.data || []).map((assignment) => ({
      ...assignment,
      overrides: overridesByAssignment.get(assignment.id) || []
    })),
    publishedUnits,
    tasks: (tasksRes.data || {}).tasks || [],
    activity: (activityRes.data || {}).entries || [],
    externalAccounts: externalAccountsRes.data || [],
    billingByStudent: new Map(
      (billingRes.data || []).map((row) => [row.student_id, row])
    ),
    payments: paymentsRes.data || [],
    billingStatusByStudent: new Map(
      (billingStatusRes.data || []).map((row) => [row.student_id, row])
    ),
    auditLog: auditRes.data || [],
    dataRequests: dataRequestsRes.data || [],
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

  const [unitsRes, versionsRes, assignmentsRes, overridesRes, subjectsRes, overviewRes, statsRes, linksRes, guardiansRes, boardRes, studentProfilesRes, termsRes, tasksRes, activityRes, billingRes, paymentsRes, billingStatusRes] = await Promise.all([
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
    groupIds.length
      ? supabase
          .from('student_unit_overrides')
          .select('assignment_id,student_id,status,opens_at,closes_at')
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
    supabase.rpc('app_activity_log', { p_limit: 80 }),
    studentIds.length
      ? supabase.from('student_billing').select('*').in('student_id', studentIds)
      : Promise.resolve({ data: [], error: null }),
    studentIds.length
      ? supabase
          .from('payments')
          .select('id,student_id,amount,paid_at,method,period,notes,period_start,period_end,status,receipt_no,voided_at,void_reason')
          .in('student_id', studentIds)
          .order('paid_at', { ascending: false })
          .limit(400)
      : Promise.resolve({ data: [], error: null }),
    studentIds.length
      ? supabase
          .from('student_billing_status')
          .select('*')
          .in('student_id', studentIds)
      : Promise.resolve({ data: [], error: null })
  ]);

  assertNoError(unitsRes.error);
  assertNoError(versionsRes.error);
  assertNoError(assignmentsRes.error);
  assertNoError(overridesRes.error);
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
  assertNoError(billingRes.error);
  assertNoError(paymentsRes.error);
  assertNoError(billingStatusRes.error);

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
  const overridesByAssignment = new Map();
  for (const override of overridesRes.data || []) {
    if (!overridesByAssignment.has(override.assignment_id)) {
      overridesByAssignment.set(override.assignment_id, []);
    }
    overridesByAssignment.get(override.assignment_id).push(override);
  }

  const assignments = (assignmentsRes.data || []).map((assignment) => ({
    ...assignment,
    unit_title: unitTitles.get(assignment.unit_id) || 'Unidad',
    overrides: overridesByAssignment.get(assignment.id) || []
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
    billingByStudent: new Map(
      (billingRes.data || []).map((row) => [row.student_id, row])
    ),
    payments: paymentsRes.data || [],
    billingStatusByStudent: new Map(
      (billingStatusRes.data || []).map((row) => [row.student_id, row])
    ),
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

  const [groupRes, assignmentsRes, profileRes] = await Promise.all([
    supabase
      .from('groups')
      .select('name,level,schedule')
      .eq('id', studentRes.data.group_id)
      .maybeSingle(),
    supabase
      .from('unit_assignments')
      .select('id,unit_id,unit_version_id,instructions,opens_at,closes_at,status,visible')
      .eq('group_id', studentRes.data.group_id)
      .in('status', ['active', 'closed'])
      .eq('visible', true)
      .order('created_at'),
    supabase
      .from('student_guidance')
      .select('*')
      .eq('student_id', studentRes.data.id)
      .maybeSingle()
  ]);

  assertNoError(groupRes.error);
  assertNoError(assignmentsRes.error);
  assertNoError(profileRes.error);

  const allAssignments = assignmentsRes.data || [];
  const assignmentIds = allAssignments.map((assignment) => assignment.id);

  let overrides = [];

  if (assignmentIds.length) {
    const overridesRes = await supabase
      .from('student_unit_overrides')
      .select('assignment_id,status,opens_at,closes_at')
      .eq('student_id', studentRes.data.id)
      .in('assignment_id', assignmentIds);

    assertNoError(overridesRes.error);
    overrides = overridesRes.data || [];
  }

  const overrideMap = new Map(overrides.map((override) => [override.assignment_id, override]));
  const now = Date.now();

  const assignments = allAssignments.filter((assignment) => {
    const override = overrideMap.get(assignment.id);
    const effectiveStatus = override?.status || assignment.status;
    if (effectiveStatus !== 'active') return false;

    const opensAt = override?.opens_at || assignment.opens_at;
    const closesAt = override?.closes_at || assignment.closes_at;
    if (opensAt && new Date(opensAt).getTime() > now) return false;
    if (closesAt && new Date(closesAt).getTime() <= now) return false;

    return true;
  });

  const unitIds = [...new Set(assignments.map((assignment) => assignment.unit_id))];
  const visibleAssignmentIds = assignments.map((assignment) => assignment.id);

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
        .in('assignment_id', visibleAssignmentIds)
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
    profile: profileRes.data || {},
    units,
    activeAssignments: units.length
  };
}

async function fetchGuardianDashboard(profile) {
  const [guardianRes, privacyRes] = await Promise.all([
    supabase
      .from('guardians')
      .select('id')
      .eq('profile_id', profile.id)
      .maybeSingle(),
    supabase
      .from('privacy_document')
      .select('version,url,sha256')
      .maybeSingle()
  ]);

  assertNoError(guardianRes.error);

  const privacy = privacyRes.error || !privacyRes.data
    ? { version: PRIVACY_DOCUMENT_VERSION, url: '/privacidad.html', sha256: '' }
    : privacyRes.data;

  const guardianId = guardianRes.data?.id;
  if (!guardianId) {
    return {
      kind: 'guardian',
      privacy,
      billingByStudent: new Map(),
      payments: [],
      children: [],
      pending: []
    };
  }

  const linksRes = await supabase
    .from('student_guardians')
    .select('student_id')
    .eq('guardian_id', guardianId)
    .order('student_id');

  assertNoError(linksRes.error);

  const linkedIds = [...new Set((linksRes.data || []).map((link) => link.student_id))];
  if (!linkedIds.length) {
    return {
      kind: 'guardian',
      privacy,
      billingByStudent: new Map(),
      payments: [],
      children: [],
      pending: []
    };
  }

  const consentsRes = await supabase
    .from('privacy_consents')
    .select('student_id,document_version,accepted_at,revoked_at')
    .eq('guardian_id', guardianId)
    .in('student_id', linkedIds);

  assertNoError(consentsRes.error);

  const currentVersion = privacy.version || PRIVACY_DOCUMENT_VERSION;
  const consentsByStudent = new Map();
  for (const consent of consentsRes.data || []) {
    if (consent.document_version === currentVersion && !consent.revoked_at) {
      consentsByStudent.set(consent.student_id, consent);
    }
  }

  const consentedIds = linkedIds.filter((id) => consentsByStudent.has(id));
  const pendingIds = linkedIds.filter((id) => !consentsByStudent.has(id));

  const studentsRes = consentedIds.length
    ? await supabase
        .from('students')
        .select('id,student_code,group_id,profile_id')
        .in('id', consentedIds)
        .order('student_code')
    : { data: [], error: null };

  assertNoError(studentsRes.error);

  const students = studentsRes.data || [];
  const profileIds = [...new Set(students.map((student) => student.profile_id))];
  const groupIds = [...new Set(students.map((student) => student.group_id))];
  const studentIds = students.map((student) => student.id);

  const [
    profilesRes, groupsRes, billingRes, paymentsRes, billingStatusRes,
    guidanceRes, progressRes, assignmentsRes, gradesRes, assessmentsRes,
    attendanceRes, sessionsRes, observationsRes, tasksRes, submissionsRes, statsRes, subjectsRes
  ] = await Promise.all([
    profileIds.length
      ? supabase.from('profiles').select('id,full_name').in('id', profileIds)
      : Promise.resolve({ data: [], error: null }),
    groupIds.length
      ? supabase.from('groups').select('id,name').in('id', groupIds)
      : Promise.resolve({ data: [], error: null }),
    studentIds.length
      ? supabase.from('student_billing').select('*').in('student_id', studentIds)
      : Promise.resolve({ data: [], error: null }),
    studentIds.length
      ? supabase
          .from('payments')
          .select('id,student_id,amount,paid_at,method,period,period_start,period_end,status,receipt_no,voided_at,void_reason')
          .in('student_id', studentIds)
          .order('paid_at', { ascending: false })
          .limit(120)
      : Promise.resolve({ data: [], error: null }),
    // FUN-01 · lectura de solo lectura para el tutor (RLS existente).
    studentIds.length
      ? supabase.from('student_billing_status').select('*').in('student_id', studentIds)
      : Promise.resolve({ data: [], error: null }),
    studentIds.length
      ? supabase.from('student_guidance').select('*').in('student_id', studentIds)
      : Promise.resolve({ data: [], error: null }),
    studentIds.length
      ? supabase
          .from('unit_progress')
          .select('student_id,assignment_id,status,best_accuracy,completed_at,attempts_count')
          .in('student_id', studentIds)
      : Promise.resolve({ data: [], error: null }),
    groupIds.length
      ? supabase
          .from('unit_assignments')
          .select('id,group_id,unit_id,status,visible,opens_at,closes_at')
          .in('group_id', groupIds)
      : Promise.resolve({ data: [], error: null }),
    studentIds.length
      ? supabase
          .from('grades')
          .select('student_id,assessment_id,score,status,notes,recorded_at')
          .in('student_id', studentIds)
      : Promise.resolve({ data: [], error: null }),
    groupIds.length
      ? supabase
          .from('assessments')
          .select('id,group_id,subject_id,name,type,max_score,assessment_date')
          .in('group_id', groupIds)
      : Promise.resolve({ data: [], error: null }),
    studentIds.length
      ? supabase
          .from('attendance')
          .select('student_id,session_id,status,minutes_late')
          .in('student_id', studentIds)
      : Promise.resolve({ data: [], error: null }),
    groupIds.length
      ? supabase
          .from('attendance_sessions')
          .select('id,group_id,session_date,topic')
          .in('group_id', groupIds)
      : Promise.resolve({ data: [], error: null }),
    studentIds.length
      ? supabase
          .from('observations')
          .select('student_id,category,body,created_at')
          .in('student_id', studentIds)
          .eq('visibility', 'family')
      : Promise.resolve({ data: [], error: null }),
    groupIds.length
      ? supabase
          .from('tasks')
          .select('id,group_id,subject_id,title,due_at,max_score,task_type')
          .in('group_id', groupIds)
          .is('archived_at', null)
      : Promise.resolve({ data: [], error: null }),
    studentIds.length
      ? supabase
          .from('task_submissions')
          .select('task_id,student_id,status,score,feedback,submitted_at')
          .in('student_id', studentIds)
      : Promise.resolve({ data: [], error: null }),
    studentIds.length
      ? supabase
          .from('student_stats')
          .select('student_id,xp_total,units_completed,units_mastered,accuracy,reading_wpm,reading_comprehension')
          .in('student_id', studentIds)
      : Promise.resolve({ data: [], error: null }),
    supabase.from('subjects').select('id,name').order('name')
  ]);

  assertNoError(profilesRes.error);
  assertNoError(groupsRes.error);
  assertNoError(billingRes.error);
  assertNoError(paymentsRes.error);
  assertNoError(billingStatusRes.error);
  assertNoError(guidanceRes.error);
  assertNoError(progressRes.error);
  assertNoError(assignmentsRes.error);
  assertNoError(gradesRes.error);
  assertNoError(assessmentsRes.error);
  assertNoError(attendanceRes.error);
  assertNoError(sessionsRes.error);
  assertNoError(observationsRes.error);
  assertNoError(tasksRes.error);
  assertNoError(submissionsRes.error);
  assertNoError(statsRes.error);
  assertNoError(subjectsRes.error);

  const unitIds = [...new Set((assignmentsRes.data || []).map((row) => row.unit_id).filter(Boolean))];
  const unitsRes = unitIds.length
    ? await supabase.from('units').select('id,title,subject_id').in('id', unitIds)
    : { data: [], error: null };
  assertNoError(unitsRes.error);

  const names = new Map((profilesRes.data || []).map((item) => [item.id, item.full_name]));
  const groupNames = new Map((groupsRes.data || []).map((group) => [group.id, group.name]));
  const subjectNames = new Map((subjectsRes.data || []).map((subject) => [subject.id, subject.name]));
  const unitsById = new Map((unitsRes.data || []).map((unit) => [unit.id, unit]));
  const assignmentsById = new Map((assignmentsRes.data || []).map((row) => [row.id, row]));
  const assessmentsById = new Map((assessmentsRes.data || []).map((row) => [row.id, row]));
  const sessionsById = new Map((sessionsRes.data || []).map((row) => [row.id, row]));
  const tasksById = new Map((tasksRes.data || []).map((row) => [row.id, row]));
  const guidanceByStudent = new Map((guidanceRes.data || []).map((row) => [row.student_id, row]));
  const statsByStudent = new Map((statsRes.data || []).map((row) => [row.student_id, row]));

  const group = (rows, key) => {
    const map = new Map();
    for (const row of rows || []) {
      const value = row[key];
      if (!map.has(value)) map.set(value, []);
      map.get(value).push(row);
    }
    return map;
  };

  const progressByStudent = group(progressRes.data, 'student_id');
  const gradesByStudent = group(gradesRes.data, 'student_id');
  const attendanceByStudent = group(attendanceRes.data, 'student_id');
  const observationsByStudent = group(observationsRes.data, 'student_id');
  const submissionsByStudent = group(submissionsRes.data, 'student_id');

  const academics = new Map(students.map((student) => {
    const progress = (progressByStudent.get(student.id) || []).map((row) => {
      const assignment = assignmentsById.get(row.assignment_id);
      const unit = assignment ? unitsById.get(assignment.unit_id) : null;
      return {
        ...row,
        unit_title: unit?.title || 'Unidad',
        subject_name: unit ? (subjectNames.get(unit.subject_id) || unit.subject_id) : '',
        opens_at: assignment?.opens_at || null,
        closes_at: assignment?.closes_at || null
      };
    });

    const grades = (gradesByStudent.get(student.id) || []).map((row) => {
      const assessment = assessmentsById.get(row.assessment_id);
      return {
        ...row,
        assessment_name: assessment?.name || 'Evaluación',
        subject_name: assessment ? (subjectNames.get(assessment.subject_id) || assessment.subject_id) : '',
        max_score: assessment?.max_score ?? null,
        assessment_date: assessment?.assessment_date || null
      };
    }).sort((a, b) => String(b.assessment_date || '').localeCompare(String(a.assessment_date || '')));

    const attendance = (attendanceByStudent.get(student.id) || []).map((row) => {
      const session = sessionsById.get(row.session_id);
      return {
        ...row,
        session_date: session?.session_date || null,
        topic: session?.topic || ''
      };
    }).sort((a, b) => String(b.session_date || '').localeCompare(String(a.session_date || '')));

    const observations = (observationsByStudent.get(student.id) || [])
      .slice()
      .sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')));

    const submissions = submissionsByStudent.get(student.id) || [];
    const tasks = (tasksRes.data || [])
      .filter((task) => task.group_id === student.group_id)
      .map((task) => ({
        ...task,
        subject_name: subjectNames.get(task.subject_id) || task.subject_id,
        submission: submissions.find((row) => row.task_id === task.id) || null
      }))
      .sort((a, b) => String(a.due_at || '').localeCompare(String(b.due_at || '')));

    return [student.id, {
      guidance: guidanceByStudent.get(student.id) || {},
      stats: statsByStudent.get(student.id) || {},
      progress,
      grades,
      attendance,
      observations,
      tasks
    }];
  }));

  return {
    kind: 'guardian',
    privacy,
    billingByStudent: new Map(
      (billingRes.data || []).map((row) => [row.student_id, row])
    ),
    payments: paymentsRes.data || [],
    billingStatusByStudent: new Map(
      (billingStatusRes.data || []).map((row) => [row.student_id, row])
    ),
    academics,
    children: students.map((student) => ({
      ...student,
      full_name: names.get(student.profile_id) || 'Alumno sin nombre',
      group_name: groupNames.get(student.group_id) || 'Sin grupo',
      consent_accepted: true,
      consent_accepted_at: consentsByStudent.get(student.id)?.accepted_at || null
    })),
    pending: pendingIds.map((id, index) => ({
      id,
      label: pendingIds.length === 1 ? 'el alumno vinculado' : `el alumno ${index + 1}`
    }))
  };
}

function renderFatal(title, message) {
  appRoot.innerHTML = `
    <div class="shell">
      ${headerMarkup()}
      <main id="main-content" tabindex="-1" class="center">
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
  const external = data.externalAccounts || [];
  const linkedProfileIds = new Set(
    (data.students || []).map((student) => student.profile_id)
  );
  const unlinkedStudents = data.profiles.filter(
    (profile) => profile.role === 'student' && !linkedProfileIds.has(profile.id)
  );

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
            <span>Contraseña (mínimo 12, con mayúscula, minúscula y número)</span>
            <input name="password" type="text" autocomplete="off" minlength="12" placeholder="Contraseña temporal" required>
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
              <div class="row">
                <button class="btn ghost" data-reset-student="${escapeHtml(student.id)}" data-student-name="${escapeHtml(student.full_name)}">Nueva contraseña</button>
                <button class="btn ghost" data-reissue-invite="${escapeHtml(student.id)}" data-student-name="${escapeHtml(student.full_name)}">Enlace de acceso</button>
              </div>
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

    ${adminExternalAccountsMarkup(external, unlinkedStudents)}
  `;
}

function adminExternalAccountsMarkup(external, unlinkedStudents) {
  return `
    <article class="card wide">
      <div class="card-heading">
        <div>
          <span class="card-label">Detección de colados</span>
          <h2>Cuentas externas</h2>
        </div>
        <span class="pill ${external.length ? 'pill-red' : 'success'}">${external.length ? countLabel(external.length, 'cuenta', 'cuentas') : 'Ninguna'}</span>
      </div>
      <p class="muted">Cuentas creadas fuera de la plataforma (sin perfil ni grupo). No pueden ver nada del curso. Aquí puedes <strong>bloquearlas</strong> o vincularlas desde el alta de alumnos con su correo.</p>
      ${external.length ? `
        <ul class="data-list">
          ${external.map((account) => `
            <li>
              <div>
                <strong>${escapeHtml(account.email)}</strong>
                <small>
                  ${account.banned ? '⛔ Bloqueada' : account.email_confirmed ? 'Correo confirmado' : '⚠️ Correo sin confirmar'}
                  · Creada ${escapeHtml(formatRelative(account.created_at))}
                  · Último acceso: ${account.last_sign_in_at ? escapeHtml(formatRelative(account.last_sign_in_at)) : 'nunca'}
                </small>
              </div>
              <button class="btn ghost ${account.banned ? '' : 'danger'}" data-ban-account="${escapeHtml(account.id)}" data-ban="${account.banned ? '0' : '1'}">
                ${account.banned ? 'Desbloquear' : 'Bloquear'}
              </button>
            </li>
          `).join('')}
        </ul>
      ` : '<p class="empty-state">No hay cuentas externas detectadas. ¡Nadie colado! ✅</p>'}
    </article>

    ${unlinkedStudents.length ? `
      <article class="card wide">
        <div class="card-heading">
          <div>
            <span class="card-label">Revisar</span>
            <h2>Perfiles de alumno sin ficha vinculada</h2>
          </div>
          <span class="pill pill-amber">${unlinkedStudents.length}</span>
        </div>
        <ul class="data-list">
          ${unlinkedStudents.map((profile) => `
            <li>
              <div>
                <strong>${escapeHtml(profile.full_name)}</strong>
                <small>${escapeHtml(profile.email || profile.username || 'Sin identificador')} · Sin ficha de alumno en ningún grupo</small>
              </div>
              <button class="btn ghost" data-toggle-user="${escapeHtml(profile.id)}" data-active="${profile.active ? '1' : '0'}">
                ${profile.active ? 'Desactivar' : 'Activar'}
              </button>
            </li>
          `).join('')}
        </ul>
      </article>
    ` : ''}
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

const dataRequestKindLabels = {
  access: 'Acceso',
  rectification: 'Rectificación',
  cancellation: 'Cancelación',
  opposition: 'Oposición',
  portability: 'Portabilidad',
  revocation: 'Revocación'
};

const dataRequestStatusLabels = {
  received: 'Recibida',
  in_progress: 'En proceso',
  resolved: 'Resuelta',
  rejected: 'Rechazada'
};

// FUN-10 / PRIV-06: solo el administrador ve esta vista. No se renderizan
// los campos `before`/`after` del audit_log para no duplicar datos personales.
function adminAuditMarkup(data) {
  const logs = data.auditLog || [];
  const requests = data.dataRequests || [];
  const actorNames = new Map((data.profiles || []).map((item) => [item.id, item.full_name || item.email || item.id]));

  return `
    <div class="section-title">
      <div>
        <span class="card-label">Gobierno</span>
        <h2>Auditoría y solicitudes ARCO</h2>
      </div>
      <span class="pill">${logs.length} eventos · ${requests.length} solicitudes</span>
    </div>

    <article class="card wide">
      <div class="card-heading">
        <div>
          <span class="card-label">PRIV-06</span>
          <h2>Solicitudes de datos</h2>
        </div>
      </div>
      ${requests.length ? `
        <ul class="data-list audit-list">
          ${requests.map((request) => `
            <li>
              <div>
                <strong>${escapeHtml(dataRequestKindLabels[request.kind] || request.kind)} · ${escapeHtml(dataRequestStatusLabels[request.status] || request.status)}</strong>
                <small>Recibida: ${escapeHtml(formatDate(String(request.received_at).slice(0, 10)))} · Plazo: ${escapeHtml(formatDate(String(request.due_at).slice(0, 10)))}${request.resolved_at ? ` · Resuelta: ${escapeHtml(formatDate(String(request.resolved_at).slice(0, 10)))}` : ''}</small>
                ${request.details ? `<p>${escapeHtml(request.details)}</p>` : ''}
                ${request.resolution ? `<p class="muted"><strong>Resolución:</strong> ${escapeHtml(request.resolution)}</p>` : ''}
              </div>
              ${request.status === 'received' || request.status === 'in_progress' ? `
                <div class="row">
                  <select data-request-status="${escapeHtml(request.id)}" aria-label="Nuevo estado">
                    <option value="in_progress">En proceso</option>
                    <option value="resolved">Resuelta</option>
                    <option value="rejected">Rechazada</option>
                  </select>
                  <input data-request-resolution="${escapeHtml(request.id)}" placeholder="Motivo de la resolución" minlength="10" aria-label="Motivo de la resolución">
                  <button class="btn primary" data-resolve-request="${escapeHtml(request.id)}">Resolver</button>
                </div>
              ` : ''}
            </li>
          `).join('')}
        </ul>
      ` : '<p class="empty-state">No hay solicitudes registradas.</p>'}
    </article>

    <article class="card wide">
      <div class="card-heading">
        <div>
          <span class="card-label">SEC-07</span>
          <h2>Registro de acciones</h2>
        </div>
      </div>
      ${logs.length ? `
        <ul class="data-list audit-list">
          ${logs.map((entry) => `
            <li>
              <div>
                <strong>${escapeHtml(entry.action)}</strong>
                <small>${escapeHtml(actorNames.get(entry.actor_id) || 'Sistema')} · ${escapeHtml(entry.entity_type)}${entry.entity_id ? ` · ${escapeHtml(entry.entity_id)}` : ''}</small>
              </div>
              <span class="pill">${escapeHtml(formatDate(String(entry.created_at).slice(0, 10)))}</span>
            </li>
          `).join('')}
        </ul>
      ` : '<p class="empty-state">Todavía no hay eventos auditados.</p>'}
    </article>
  `;
}

async function resolveDataRequest(button) {
  const requestId = button.dataset.resolveRequest;
  const status = appRoot.querySelector(`[data-request-status="${requestId}"]`)?.value;
  const resolution = String(appRoot.querySelector(`[data-request-resolution="${requestId}"]`)?.value || '').trim();

  if (status !== 'in_progress' && status !== 'resolved' && status !== 'rejected') {
    setError('Selecciona un estado válido.');
    renderDashboard();
    return;
  }

  if (status !== 'in_progress' && resolution.length < 10) {
    setError('Escribe una resolución de al menos 10 caracteres.');
    renderDashboard();
    return;
  }

  button.disabled = true;
  button.textContent = 'Guardando…';

  const { error } = await supabase.rpc('app_resolve_data_request', {
    p_request_id: requestId,
    p_status: status,
    p_resolution: resolution || 'Solicitud tomada en atención.'
  });

  if (error) {
    setError(error.message || 'No se pudo actualizar la solicitud.');
  } else {
    setNotice('Solicitud actualizada y registrada en auditoría.');
  }
  renderDashboard();
  await loadDashboard(state.profile);
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
  const url = import.meta.env.VITE_SUPABASE_URL || '';
  try {
    return new URL(url).host;
  } catch {
    return 'sin configurar';
  }
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
                <button class="btn ghost" data-student-detail="${escapeHtml(student.id)}">Ver ficha</button>
                <button class="btn ghost" data-invite-toggle="${escapeHtml(student.id)}">Invitar tutor</button>
                <button class="btn ghost" data-advise-student="${escapeHtml(student.id)}" data-advise-name="${escapeHtml(student.full_name)}">Avisar tutor</button>
                <button class="btn ghost" data-reissue-invite="${escapeHtml(student.id)}" data-student-name="${escapeHtml(student.full_name)}">Enlace de acceso</button>
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
            <span>Contraseña temporal (mín. 12, con mayúscula, minúscula y número)</span>
            <input name="password" type="text" autocomplete="off" minlength="12" required>
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
          const excluded = (assignment.overrides || []).filter((override) => override.status === 'closed').length;
          const activeCount = Math.max(0, group.students.length - excluded);
          meta = `
            <span class="pill pill-green">Activa</span>
            <span class="pill">${activeCount}/${group.students.length} alumnos</span>
            ${assignment.opens_at ? `<span>desde ${escapeHtml(formatDate(String(assignment.opens_at).slice(0, 10)))}</span>` : ''}
            ${assignment.closes_at ? `<span>hasta ${escapeHtml(formatDate(String(assignment.closes_at).slice(0, 10)))}</span>` : '<span>sin cierre</span>'}
          `;
          actions = `
            <button class="btn-mini" data-manage-assignment="${escapeHtml(assignment.id)}" data-unit-group="${escapeHtml(group.id)}">Alumnos</button>
            <button class="btn-mini danger" data-close-assignment="${escapeHtml(assignment.id)}">Cerrar</button>
          `;
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

  const teacherTabs = ['dashboard', 'alumnos', 'materias', 'asistencia', 'pagos', 'tareas', 'actividad', 'tutores'];
  const adminTabs = ['dashboard', 'alumnos', 'materias', 'asistencia', 'pagos', 'tareas', 'actividad', 'usuarios', 'contenido', 'auditoria', 'configuracion'];
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
        <main id="main-content" tabindex="-1" class="staff-content">
          ${alertMarkup()}
          ${staffTabContentMarkup(data, tab)}
          ${privacyFooterMarkup()}
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
  if (tab === 'pagos') return staffPaymentsTabMarkup(data);
  if (tab === 'tareas') return staffTasksTabMarkup(data);
  if (tab === 'actividad') return staffActivityTabMarkup(data);
  if (tab === 'tutores') return staffTutoresTabMarkup(data);
  if (tab === 'usuarios') return adminUsersMarkup(data);
  if (tab === 'contenido') return adminContentMarkup(data);
  if (tab === 'auditoria') return adminAuditMarkup(data);
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
          <input name="username" autocomplete="off" placeholder="ej. maria.lopez">
        </label>
        <label class="field">
          <span>Contraseña temporal (mín. 12, con mayúscula, minúscula y número)</span>
          <input name="password" type="text" autocomplete="off" minlength="12" required>
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

      <details class="admin-details" ${state.studentInvitation ? 'open' : ''}>
        <summary>Invitar alumno (elige su propia contraseña)</summary>
        <p class="hint">Crea la cuenta y genera un enlace de un solo uso para que el alumno establezca su contraseña. Entrégalo por un canal seguro: vence en 72 h y no se puede reutilizar.</p>
        <form class="form" data-invite-student-form data-invite-group-default="${escapeHtml(groups[0]?.id || '')}">
          ${isAdmin ? `
            <label class="field">
              <span>Grupo</span>
              <select name="group_id" data-invite-groups required>
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
            <input name="username" autocomplete="off" placeholder="ej. maria.lopez">
          </label>
          <label class="field">
            <span>Matrícula (opcional)</span>
            <input name="student_code" autocomplete="off" placeholder="ECO-2027-001">
          </label>
          <div class="row">
            <button class="btn primary" type="submit">Generar invitación</button>
          </div>
          <div class="create-student-result" data-invite-student-result></div>
        </form>
      </details>

      ${invitationMarkup(state.studentInvitation)}
    </article>
  `;
}

function invitationMarkup(invitation) {
  if (!invitation) return '';

  return `
    <div class="answer-box correct" data-student-invitation>
      <strong>Invitación para ${escapeHtml(invitation.fullName)}</strong>
      <p>Comparte este enlace con el alumno o su tutor. Vence en 72 h y solo funciona una vez.</p>
      <label class="field">
        <span>Enlace de invitación</span>
        <input readonly value="${escapeHtml(invitation.redeemUrl)}" data-invitation-url>
      </label>
      <div class="row">
        <button class="btn ghost" type="button" data-copy-invitation>Copiar enlace</button>
        <button class="btn ghost" type="button" data-dismiss-invitation>Ocultar</button>
      </div>
      <p><small>Usuario: ${escapeHtml(invitation.username)} · Matrícula: ${escapeHtml(invitation.studentCode)} · Vence: ${escapeHtml(invitation.expiresAtLabel)}</small></p>
    </div>
  `;
}

function unitVersionId(data, unitId) {
  const unit = (data.publishedUnits || []).find((item) => item.id === unitId);
  if (unit?.versions?.length) return unit.versions[0].id;
  return '';
}

function staffSubjectsTabMarkup(data) {
  const subjects = data.board || [];
  const groups = data.groups || [];
  const groupId = groups.some((group) => group.id === state.subjectsGroupId)
    ? state.subjectsGroupId
    : groups[0]?.id || null;
  const students = data.students || [];
  const assignmentsByUnit = new Map();
  for (const assignment of data.assignments || []) {
    if (assignment.group_id !== groupId) continue;
    if (!assignmentsByUnit.has(assignment.unit_id)) {
      assignmentsByUnit.set(assignment.unit_id, assignment);
    }
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
      <div class="row">
        ${groups.length > 1 ? `
          <label class="field inline-field">
            <span>Grupo</span>
            <select data-subjects-group>
              ${groups.map((group) => `<option value="${escapeHtml(group.id)}" ${group.id === groupId ? 'selected' : ''}>${escapeHtml(group.name)}</option>`).join('')}
            </select>
          </label>
        ` : ''}
        <span class="pill">${subjects.length} materias</span>
      </div>
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
            const groupStudents = students.filter((student) => student.group_id === groupId);
            const excluded = (assignment?.overrides || []).filter((override) => override.status === 'closed').length;
            const activeCount = Math.max(0, groupStudents.length - excluded);
            const versionId = unitVersionId(data, unit.id);
            return `
              <div class="board-unit">
                <span class="pill pill-blue">U${String(unit.num).padStart(2, '0')}</span>
                <div>
                  <strong>${escapeHtml(unit.title)}</strong>
                  <div class="muted"><small>${unit.estimated ? `${unit.estimated} min` : ''}</small></div>
                </div>
                <div class="row">
                  ${assignment && assignment.status === 'active'
                    ? `<span class="pill success">Activa</span>
                       <span class="pill">${activeCount}/${groupStudents.length} alumnos</span>
                       <button class="btn-mini" data-manage-assignment="${escapeHtml(assignment.id)}" data-unit-group="${escapeHtml(groupId)}">Alumnos</button>
                       <button class="btn-mini danger" data-close-assignment="${escapeHtml(assignment.id)}">Cerrar</button>`
                    : assignment && assignment.status === 'closed'
                      ? `<span class="pill pill-red">Cerrada</span>
                         <button class="btn-mini" data-reopen-assignment="${escapeHtml(assignment.id)}">Reabrir</button>`
                      : groupId
                        ? `<button class="btn-mini primary" data-activate-unit="${escapeHtml(unit.id)}:${escapeHtml(versionId)}" data-unit-group="${escapeHtml(groupId)}">Activar</button>`
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

/* ---------------- Finanzas: pagos y planes ---------------- */

const paymentPlanLabels = {
  semanal: 'Semanal',
  quincenal: 'Quincenal',
  mensual: 'Mensual',
  contado: 'Contado',
  beca: 'Beca',
  otro: 'Otro'
};

const paymentMethodLabels = {
  efectivo: 'Efectivo',
  transferencia: 'Transferencia',
  tarjeta: 'Tarjeta',
  otro: 'Otro'
};

function paymentsOf(studentId, payments) {
  return (payments || []).filter((payment) => payment.student_id === studentId);
}

function paymentsTotal(studentId, payments) {
  return paymentsOf(studentId, payments).reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
}

function paymentsLast(studentId, payments) {
  const list = paymentsOf(studentId, payments)
    .slice()
    .sort((a, b) => String(b.paid_at).localeCompare(String(a.paid_at)));
  return list[0] || null;
}

function money(value) {
  const number = Number(value || 0);
  return number.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
}

function isoDate(value) {
  return value.toISOString().slice(0, 10);
}

// Espejo de `app_billing_period` (0029): periodo natural del plan.
function billingPeriod(plan, value) {
  if (!['semanal', 'quincenal', 'mensual'].includes(plan)) return null;
  const date = new Date(`${value || isoDate(new Date())}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return null;

  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();

  if (plan === 'mensual') {
    return {
      start: isoDate(new Date(Date.UTC(year, month, 1))),
      end: isoDate(new Date(Date.UTC(year, month + 1, 0)))
    };
  }

  if (plan === 'quincenal') {
    if (date.getUTCDate() <= 15) {
      return {
        start: isoDate(new Date(Date.UTC(year, month, 1))),
        end: isoDate(new Date(Date.UTC(year, month, 15)))
      };
    }
    return {
      start: isoDate(new Date(Date.UTC(year, month, 16))),
      end: isoDate(new Date(Date.UTC(year, month + 1, 0)))
    };
  }

  // semanal: lunes a domingo (date_trunc('week') usa lunes).
  const diffToMonday = (date.getUTCDay() + 6) % 7;
  const start = new Date(Date.UTC(year, month, date.getUTCDate() - diffToMonday));
  const end = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate() + 6));
  return { start: isoDate(start), end: isoDate(end) };
}

function paymentStatusLabel(status) {
  if (status === 'voided') return 'Anulado';
  if (status === 'partial') return 'Parcial';
  return 'Pagado';
}

function billingStatusLabel(status) {
  return {
    'al corriente': 'Al corriente',
    parcial: 'Pago parcial',
    pendiente: 'Pendiente',
    vencido: 'Vencido',
    beca: 'Beca',
    manual: 'Plan manual',
    'sin cuota': 'Sin cuota'
  }[status] || 'Pendiente';
}

function staffPaymentsTabMarkup(data) {
  const students = data.students || [];
  const billing = data.billingByStudent || new Map();
  const billingStatus = data.billingStatusByStudent || new Map();
  const payments = data.payments || [];
  const pageCount = Math.max(1, Math.ceil(payments.length / PAGE_SIZE));
  const paymentsPage = Math.min(Math.max(1, state.paymentsPage), pageCount);
  const visiblePayments = payments.slice(
    (paymentsPage - 1) * PAGE_SIZE,
    paymentsPage * PAGE_SIZE
  );

  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthPayments = payments.filter((payment) => String(payment.paid_at || '').slice(0, 7) === monthKey);
  const monthIncome = monthPayments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const totalIncome = payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const withPlan = students.filter((student) => billing.has(student.id)).length;

  return `
    <div class="section-title">
      <div>
        <span class="card-label">Finanzas</span>
        <h2>Pagos y planes por alumno</h2>
      </div>
      <span class="pill">${students.length} ${students.length === 1 ? 'alumno' : 'alumnos'}</span>
    </div>

    <div class="pay-summary">
      <article class="card pay-stat pay-stat-violet">
        <span class="pay-stat-icon" aria-hidden="true">📅</span>
        <div>
          <span class="card-label">Este mes (${now.toLocaleDateString('es-MX', { month: 'short' })})</span>
          <h2>${money(monthIncome)}</h2>
          <p class="muted">${monthPayments.length} ${monthPayments.length === 1 ? 'pago' : 'pagos'} registrados</p>
        </div>
      </article>
      <article class="card pay-stat pay-stat-green">
        <span class="pay-stat-icon" aria-hidden="true">💰</span>
        <div>
          <span class="card-label">Ingresos totales</span>
          <h2>${money(totalIncome)}</h2>
          <p class="muted">Todo lo registrado en la plataforma</p>
        </div>
      </article>
      <article class="card pay-stat pay-stat-blue">
        <span class="pay-stat-icon" aria-hidden="true">🗂️</span>
        <div>
          <span class="card-label">Planes asignados</span>
          <h2>${withPlan}/${students.length}</h2>
          <p class="muted">${[...new Set([...billing.values()].map((row) => row.plan))].length} ${[...new Set([...billing.values()].map((row) => row.plan))].length === 1 ? 'tipo de plan' : 'tipos de plan'}</p>
        </div>
      </article>
    </div>

    <article class="card wide">
      <div class="card-heading">
        <div>
          <span class="card-label">Alumnos</span>
          <h2>Estado de cuentas</h2>
        </div>
      </div>
      ${students.length ? `
        <div class="pay-board">
          ${students.map((student) => {
            const planRow = billing.get(student.id) || {};
            const statusRow = billingStatus.get(student.id) || {};
            const plan = planRow.plan || 'mensual';
            const total = paymentsTotal(student.id, payments);
            const last = paymentsLast(student.id, payments);
            const initial = (student.full_name || 'A').trim().slice(0, 1).toUpperCase();
            return `
              <article class="pay-card">
                <div class="pay-card-head">
                  <span class="pay-avatar" aria-hidden="true">${escapeHtml(initial)}</span>
                  <div class="pay-who">
                    <strong>${escapeHtml(student.full_name)}</strong>
                    <small>${escapeHtml(student.student_code || '')}${student.group_name ? ` · ${escapeHtml(student.group_name)}` : ''}</small>
                  </div>
                  <span class="pill ${billing.has(student.id) ? '' : 'pill-amber'}">${billing.has(student.id) ? escapeHtml(paymentPlanLabels[plan] || plan) : 'Sin plan'}</span>
                </div>
                <div class="pay-card-body">
                  <div class="pay-metric">
                    <span class="card-label">Cuota</span>
                    <strong>${planRow.fee ? money(planRow.fee) : '—'}</strong>
                  </div>
                  <div class="pay-metric">
                    <span class="card-label">Pagado</span>
                    <strong class="${total > 0 ? 'pay-good' : ''}">${money(total)}</strong>
                  </div>
                  <div class="pay-metric">
                    <span class="card-label">Estado</span>
                    <strong class="${statusRow.status === 'al corriente' || statusRow.status === 'beca' ? 'pay-good' : 'pay-last'}">${escapeHtml(billingStatusLabel(statusRow.status))}</strong>
                  </div>
                  <div class="pay-metric">
                    <span class="card-label">Saldo</span>
                    <strong class="${Number(statusRow.balance || 0) > 0 ? 'pay-last' : ''}">${statusRow.balance != null ? money(statusRow.balance) : '—'}</strong>
                  </div>
                  <div class="pay-metric">
                    <span class="card-label">Último pago</span>
                    <strong class="pay-last">${last ? escapeHtml(formatDate(String(last.paid_at).slice(0, 10))) : '—'}</strong>
                  </div>
                </div>
                <div class="pay-card-actions">
                  <button class="btn primary" data-open-pay-dialog="${escapeHtml(student.id)}" data-pay-mode="payment">💵 Registrar pago</button>
                  <button class="btn ghost" data-open-pay-dialog="${escapeHtml(student.id)}" data-pay-mode="plan">⚙️ Plan</button>
                </div>
              </article>
            `;
          }).join('')}
        </div>
      ` : '<p class="empty-state">Todavía no hay alumnos en tus grupos.</p>'}
    </article>

    <article class="card wide">
      <div class="card-heading">
        <div>
          <span class="card-label">Historial</span>
          <h2>Últimos pagos registrados</h2>
        </div>
      </div>
      ${payments.length ? `
        ${paginationMarkup({ total: payments.length, page: paymentsPage, target: 'payments' })}
        <ul class="data-list pay-list">
          ${visiblePayments.map((payment) => {
            const student = students.find((item) => item.id === payment.student_id);
            return `
              <li>
                <div>
                  <strong>${escapeHtml(student?.full_name || 'Alumno')}${payment.receipt_no ? ` · ${escapeHtml(payment.receipt_no)}` : ''}</strong>
                  <small>${escapeHtml(formatDate(String(payment.paid_at).slice(0, 10)))} · ${escapeHtml(paymentMethodLabels[payment.method] || payment.method)}${payment.period_start ? ` · ${escapeHtml(formatDate(payment.period_start))}–${escapeHtml(formatDate(payment.period_end))}` : payment.period ? ` · ${escapeHtml(payment.period)}` : ''}${payment.status === 'voided' && payment.void_reason ? ` · Motivo: ${escapeHtml(payment.void_reason)}` : ''}</small>
                </div>
                <div class="pay-history-actions">
                  <span class="pill ${payment.status === 'voided' ? 'pill-amber' : 'success'}">${money(payment.amount)} · ${escapeHtml(paymentStatusLabel(payment.status))}</span>
                  <button class="btn ghost" data-receipt-payment="${escapeHtml(payment.id)}" aria-label="Descargar recibo ${escapeHtml(payment.receipt_no || payment.id)}">Recibo</button>
                  ${payment.status !== 'voided' ? `<button class="btn ghost" data-void-payment="${escapeHtml(payment.id)}">Anular</button>` : ''}
                </div>
              </li>
            `;
          }).join('')}
        </ul>
      ` : '<p class="empty-state">Aún no hay pagos registrados. Usa "Registrar pago" en cada alumno.</p>'}
    </article>
  `;
}

function payDialogMarkup() {
  const dialog = state.payDialog;
  if (!dialog) return '';

  const data = state.dashboard;
  const student = (data?.students || []).find((item) => item.id === dialog.studentId);
  const planRow = (data?.billingByStudent || new Map()).get(dialog.studentId) || {};
  const today = new Date().toISOString().slice(0, 10);
  const initial = (student?.full_name || 'A').trim().slice(0, 1).toUpperCase();
  const isPlan = dialog.mode === 'plan';

  return `
    <div class="unit-assign-overlay" data-pay-overlay>
      <section class="unit-assign-dialog pay-dialog" role="dialog" aria-modal="true" aria-labelledby="pay-title">
        <button type="button" class="ficha-close" data-pay-close aria-label="Cerrar">✕</button>

        <header class="pay-dialog-head">
          <span class="pay-avatar pay-avatar-lg" aria-hidden="true">${escapeHtml(initial)}</span>
          <div class="pay-who">
            <span class="card-label">${isPlan ? 'Plan de pago' : 'Registrar pago'}</span>
            <h2 id="pay-title">${escapeHtml(student?.full_name || 'Alumno')}</h2>
            <p class="muted">${escapeHtml(student?.student_code || '')}${student?.group_name ? ` · ${escapeHtml(student.group_name)}` : ''}${!isPlan && planRow.plan ? ` · Plan ${escapeHtml(paymentPlanLabels[planRow.plan] || planRow.plan)}` : ''}</p>
          </div>
        </header>

        <form class="form pay-form" data-pay-form>
          ${isPlan ? `
            <div class="pay-plan-grid">
              ${Object.entries(paymentPlanLabels).map(([value, label]) => `
                <button type="button" class="pay-plan-option ${(planRow.plan || 'mensual') === value ? 'selected' : ''}" data-pay-plan="${value}">
                  ${escapeHtml(label)}
                </button>
              `).join('')}
              <input type="hidden" name="plan" value="${escapeHtml(planRow.plan || 'mensual')}">
            </div>
            <label class="field">
              <span>Cuota por periodo (pesos)</span>
              <input name="fee" type="number" min="0" step="0.01" value="${planRow.fee ?? ''}" placeholder="ej. 250">
            </label>
            <label class="field">
              <span>Notas (opcional)</span>
              <textarea name="notes" placeholder="ej. beca del 20%, incluye material…">${escapeHtml(planRow.notes || '')}</textarea>
            </label>
          ` : `
            <label class="field">
              <span>Monto (pesos)</span>
              <div class="pay-amount-wrap">
                <span class="pay-currency">$</span>
                <input name="amount" type="number" min="1" step="0.01" required placeholder="0.00">
              </div>
            </label>
            <label class="field">
              <span>Fecha del pago</span>
              <input name="paid_at" type="date" required value="${today}">
            </label>
            <div class="field">
              <span>Método</span>
              <div class="pay-method-grid">
                ${Object.entries(paymentMethodLabels).map(([value, label], index) => `
                  <button type="button" class="pay-method-option ${index === 0 ? 'selected' : ''}" data-pay-method="${value}">
                    ${escapeHtml(label)}
                  </button>
                `).join('')}
                <input type="hidden" name="method" value="efectivo">
              </div>
            </div>
            <label class="field">
              <span>Concepto (opcional)</span>
              <input name="period" placeholder="ej. semana del 2 nov, noviembre, inscripción">
            </label>
            <label class="field">
              <span>Notas (opcional)</span>
              <textarea name="notes" placeholder="ej. pagó el tutor en efectivo"></textarea>
            </label>
          `}

          <div class="pay-error" data-pay-error hidden></div>

          <footer class="unit-assign-foot">
            <button type="button" class="btn ghost" data-pay-close>Cancelar</button>
            <button type="submit" class="btn primary">${isPlan ? 'Guardar plan' : 'Registrar pago'}</button>
          </footer>
        </form>
      </section>
    </div>
  `;
}

function openPayDialog(studentId, mode) {
  state.payDialog = { studentId, mode, escHandler: null };
  renderPayDialog();
}

function renderPayDialog() {
  document.querySelectorAll('[data-pay-overlay]').forEach((overlay) => overlay.remove());

  if (state.payDialog?.escHandler) {
    state.payDialog.escHandler();
    state.payDialog.escHandler = null;
  }

  const markup = payDialogMarkup();
  if (!markup) {
    document.body.classList.remove('unit-assign-open');
    return;
  }

  document.body.insertAdjacentHTML('beforeend', markup);
  document.body.classList.add('unit-assign-open');

  const overlay = document.querySelector('[data-pay-overlay]');
  const close = () => closePayDialog();

  overlay.querySelectorAll('[data-pay-close]').forEach((button) => {
    button.addEventListener('click', close);
  });
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) close();
  });
  state.payDialog.escHandler = trapDialogFocus(overlay, close);

  const form = overlay.querySelector('[data-pay-form]');
  if (form) form.addEventListener('submit', (event) => savePayDialog(event, form));

  overlay.querySelectorAll('[data-pay-method]').forEach((button) => {
    button.addEventListener('click', () => {
      overlay.querySelectorAll('[data-pay-method]').forEach((item) => item.classList.remove('selected'));
      button.classList.add('selected');
      const input = form?.querySelector('input[name="method"]');
      if (input) input.value = button.dataset.payMethod;
    });
  });

  overlay.querySelectorAll('[data-pay-plan]').forEach((button) => {
    button.addEventListener('click', () => {
      overlay.querySelectorAll('[data-pay-plan]').forEach((item) => item.classList.remove('selected'));
      button.classList.add('selected');
      const input = form?.querySelector('input[name="plan"]');
      if (input) input.value = button.dataset.payPlan;
    });
  });

  requestAnimationFrame(() => {
    overlay.querySelector('[data-pay-close]')?.focus();
  });
}

function closePayDialog() {
  if (state.payDialog?.escHandler) {
    state.payDialog.escHandler();
  }
  state.payDialog = null;
  document.querySelectorAll('[data-pay-overlay]').forEach((overlay) => overlay.remove());
  document.body.classList.remove('unit-assign-open');
}

async function voidPayment(button) {
  const paymentId = button.dataset.voidPayment;
  if (!paymentId || button.disabled) return;

  const reason = window.prompt('Motivo de la anulación (mínimo 3 caracteres):', '');
  if (reason === null) return;

  const trimmed = reason.trim();
  if (trimmed.length < 3) {
    setError('Escribe un motivo de al menos 3 caracteres para anular el pago.');
    return;
  }

  button.disabled = true;
  button.textContent = 'Anulando…';

  const { error } = await supabase.rpc('app_void_payment', {
    p_payment_id: paymentId,
    p_reason: trimmed
  });

  if (error) {
    setError(error.message || 'No se pudo anular el pago.');
    button.disabled = false;
    button.textContent = 'Anular';
    return;
  }

  setNotice('Pago anulado. El historial conserva el registro y el motivo.');
  await loadDashboard(state.profile);
}

// FUN-02: el recibo se arma en el cliente con los datos que RLS ya permitió
// leer. No hay nueva consulta ni se expone `notes` (puede ser información
// interna) en el PDF.
function downloadPaymentReceipt(paymentId) {
  const payment = (state.dashboard?.payments || []).find((item) => item.id === paymentId);
  if (!payment) {
    setError('No se encontró el pago para generar el recibo.');
    return;
  }

  const student = (state.dashboard?.students || []).find((item) => item.id === payment.student_id);
  const planRow = (state.dashboard?.billingByStudent || new Map()).get(payment.student_id) || {};

  downloadReceiptPdf({
    id: payment.id,
    receipt_no: payment.receipt_no,
    paid_at: formatDate(String(payment.paid_at || '').slice(0, 10)),
    amount: money(payment.amount),
    method: paymentMethodLabels[payment.method] || payment.method || '—',
    period_start: payment.period_start ? formatDate(payment.period_start) : '',
    period_end: payment.period_end ? formatDate(payment.period_end) : '',
    period: payment.period,
    status: payment.status,
    student_name: student?.full_name || 'Alumno',
    student_code: student?.student_code || '',
    group_name: student?.group_name || '',
    plan: paymentPlanLabels[planRow.plan] || planRow.plan || '',
    void_reason: payment.void_reason || ''
  });

  setNotice(payment.status === 'voided'
    ? 'Recibo descargado. El documento marca el pago como anulado.'
    : 'Recibo descargado.');
}

async function savePayDialog(event, form) {  event.preventDefault();
  const dialog = state.payDialog;
  if (!dialog) return;

  const data = new FormData(form);
  const submitButton = form.querySelector('button[type="submit"]');
  const errorBox = form.querySelector('[data-pay-error]');
  if (submitButton) submitButton.disabled = true;

  try {
    if (dialog.mode === 'plan') {
      const fee = String(data.get('fee') || '').trim();
      const { error } = await supabase.from('student_billing').upsert({
        student_id: dialog.studentId,
        plan: String(data.get('plan') || 'mensual'),
        fee: fee ? Number(fee) : null,
        notes: String(data.get('notes') || '').trim() || null,
        updated_by: state.profile?.id ?? null,
        updated_at: new Date().toISOString()
      }, { onConflict: 'student_id' });

      if (error) throw error;
      closePayDialog();
      setNotice('Plan de pago guardado.');
    } else {
      const amount = Number(data.get('amount'));
      if (!amount || amount <= 0) throw new Error('Escribe un monto válido.');

      const paidAt = String(data.get('paid_at') || isoDate(new Date()));
      const planRow = (state.dashboard?.billingByStudent || new Map()).get(dialog.studentId) || {};
      const period = billingPeriod(planRow.plan || 'mensual', paidAt);

      const { error } = await supabase.from('payments').insert({
        student_id: dialog.studentId,
        amount,
        paid_at: paidAt,
        method: String(data.get('method') || 'efectivo'),
        period: String(data.get('period') || '').trim() || null,
        notes: String(data.get('notes') || '').trim() || null,
        period_start: period?.start || null,
        period_end: period?.end || null,
        idempotency_key: crypto.randomUUID(),
        recorded_by: state.profile?.id ?? null
      });

      if (error) {
        if (error.code === '23505' || /duplicad|idéntico/i.test(error.message || '')) {
          throw new Error('Ya existe un pago idéntico para ese periodo. Revisa el historial antes de registrarlo otra vez.');
        }
        throw error;
      }
      closePayDialog();
      setNotice('Pago registrado con folio.');
    }

    await loadDashboard(state.profile);
  } catch (error) {
    if (submitButton) submitButton.disabled = false;
    if (errorBox) {
      errorBox.hidden = false;
      errorBox.textContent = error?.message || 'No se pudo guardar.';
    }
  }
}

function staffTasksTabMarkup(data) {  const tasks = data.tasks || [];
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
        <h2>Invitaciones por correo y avisos a tutores</h2>
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
                <button class="btn ghost" data-reissue-invite="${escapeHtml(student.id)}" data-student-name="${escapeHtml(student.full_name)}">Enlace de acceso</button>
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

const subjectPalette = [
  'var(--brand)', 'var(--brand-2)', '#0ea5e9', '#f59e0b', '#10b981', '#ef4444', '#ec4899', '#14b8a6'
];

function subjectColor(name) {
  let hash = 0;
  for (const char of String(name || '')) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  return subjectPalette[Math.abs(hash) % subjectPalette.length];
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

  const fullName = state.profile?.full_name || 'Alumno';
  const firstName = fullName.split(' ')[0];
  const initial = fullName.trim().slice(0, 1).toUpperCase();
  const profile = data.profile || {};
  const testsDone = Number(Boolean(profile.personality?.completed_at)) + Number(Boolean(profile.aptitude?.completed_at));

  return `
    <section class="student-hero">
      <div class="student-hero-copy">
        <span class="kicker">Hola, ${escapeHtml(firstName)} 👋</span>
        <h1>Tu camino al bachillerato</h1>
        <p class="muted">${escapeHtml(data.group ? [data.group.level, data.group.schedule].filter(Boolean).join(' · ') || 'Grupo sin horario' : 'Tu grupo aún no está asignado.')}</p>
        <div class="student-hero-chips">
          <span class="hero-chip">📚 ${countLabel(data.activeAssignments, 'unidad activa', 'unidades activas')}</span>
          <span class="hero-chip">🧭 ${testsDone} de 2 tests completados</span>
          <span class="hero-chip">🎓 ${escapeHtml(data.student.student_code)}</span>
        </div>
      </div>
      <div class="student-hero-actions">
        <span class="student-avatar" aria-hidden="true">${escapeHtml(initial)}</span>
        <a class="btn primary" href="./curso/">📚 Abrir curso completo</a>
      </div>
    </section>

    <div class="section-title">
      <div>
        <span class="card-label">Tus unidades</span>
        <h2>${data.units.length ? 'Sigue tu ruta de estudio' : 'Aún no hay unidades'}</h2>
      </div>
      ${data.units.length ? `<span class="pill">${data.units.length}</span>` : ''}
    </div>

    ${data.units.length ? `
      <div class="student-unit-grid">
        ${data.units.map((item) => {
          const status = item.progress?.status || 'not_started';
          const statusLabel = progressLabels[status] || 'Sin empezar';
          const accuracy = item.progress?.best_accuracy != null ? `${Math.round(item.progress.best_accuracy)}%` : null;
          const attempts = item.progress?.attempts_count || 0;
          const accent = subjectColor(item.unit?.subject_name);
          return `
            <article class="student-unit-card" style="--accent:${accent}">
              <div class="student-unit-top">
                <span class="student-unit-subject">${escapeHtml(item.unit?.subject_name || 'Materia')}</span>
                <span class="pill ${status === 'completed' || status === 'mastered' ? 'success' : status === 'in_progress' ? 'pill-blue' : ''}">${escapeHtml(statusLabel)}</span>
              </div>
              <h3>${escapeHtml(item.unit?.title || 'Unidad')}</h3>
              <div class="student-unit-stats">
                ${accuracy ? `<span class="hero-chip">🎯 ${escapeHtml(accuracy)}</span>` : ''}
                ${attempts > 0 ? `<span class="hero-chip">🔄 ${attempts} ${attempts === 1 ? 'intento' : 'intentos'}</span>` : ''}
              </div>
              <button class="btn ghost" data-open-unit="${escapeHtml(item.id)}">${status === 'completed' || status === 'mastered' ? 'Repasar →' : 'Estudiar →'}</button>
            </article>
          `;
        }).join('')}
      </div>
    ` : '<article class="card wide"><p class="empty-state">Tus unidades aparecerán aquí cuando el profesor las active. 🔒</p></article>'}

    ${studentTestsMarkup(data)}
  `;
}

function testResultFor(profile, kind) {
  const value = kind === 'personality' ? profile?.personality : profile?.aptitude;
  return value && typeof value === 'object' ? value : null;
}

function testIsComplete(profile, kind) {
  const result = testResultFor(profile, kind);
  return Boolean(result?.completed_at);
}

function studentTestsMarkup(data) {
  const profile = data.profile || {};
  const personality = testResultFor(profile, 'personality');
  const vocational = testResultFor(profile, 'vocational');
  const personalityDone = Boolean(personality?.completed_at);
  const vocationalDone = Boolean(vocational?.completed_at);
  const interests = Array.isArray(profile.interests) ? profile.interests : [];
  const aptitudes = Array.isArray(profile.aptitudes) ? profile.aptitudes : [];
  const careers = Array.isArray(profile.career_suggestions) ? profile.career_suggestions : [];
  const topCareers = careers
    .slice(0, 3)
    .map((career) => (typeof career === 'string' ? career : career?.name))
    .filter(Boolean);

  return `
    <article class="card wide student-tests">
      <div class="card-heading">
        <div>
          <span class="card-label">Mi orientación</span>
          <h2>Conócete y descubre tu camino</h2>
        </div>
        <span class="pill">${personalityDone && vocationalDone ? '2 de 2 completados' : `${Number(personalityDone) + Number(vocationalDone)} de 2 completados`}</span>
      </div>
      <p class="muted">Responde con calma y honestidad. No hay respuestas correctas: tus resultados ayudan a tu profesor a acompañarte mejor.</p>

      <div class="test-grid">
        <div class="test-card ${personalityDone ? 'done' : ''}">
          <span class="test-emoji" aria-hidden="true">🧠</span>
          <div class="test-copy">
            <strong>Test de personalidad</strong>
            <p>15 preguntas sobre tu forma de ser, aprender y convivir.</p>
            <span class="pill ${personalityDone ? 'success' : ''}">${personalityDone ? 'Completado' : 'Pendiente'}</span>
          </div>
          <button class="btn ${personalityDone ? 'ghost' : 'primary'}" data-start-test="personality">${personalityDone ? 'Volver a hacerlo' : 'Comenzar'}</button>
        </div>

        <div class="test-card ${vocationalDone ? 'done' : ''}">
          <span class="test-emoji" aria-hidden="true">🧭</span>
          <div class="test-copy">
            <strong>Test de orientación vocacional</strong>
            <p>Intereses, aptitudes y carreras que podrían encajar contigo.</p>
            <span class="pill ${vocationalDone ? 'success' : ''}">${vocationalDone ? 'Completado' : 'Pendiente'}</span>
          </div>
          <button class="btn ${vocationalDone ? 'ghost' : 'primary'}" data-start-test="vocational">${vocationalDone ? 'Volver a hacerlo' : 'Comenzar'}</button>
        </div>
      </div>

      ${(interests.length || aptitudes.length || topCareers.length) ? `
        <div class="test-summary">
          ${topCareers.length ? `
            <div class="test-summary-block">
              <span class="card-label">Carreras que podrían interesarte</span>
              <div class="ficha-tags">
                ${topCareers.map((career) => `<span class="ficha-tag">🎓 ${escapeHtml(career)}</span>`).join('')}
              </div>
            </div>
          ` : ''}
          ${interests.length ? `
            <div class="test-summary-block">
              <span class="card-label">Tus intereses</span>
              <div class="ficha-tags">
                ${interests.slice(0, 8).map((item) => `<span class="ficha-tag">${escapeHtml(item)}</span>`).join('')}
              </div>
            </div>
          ` : ''}
          ${aptitudes.length ? `
            <div class="test-summary-block">
              <span class="card-label">Tus aptitudes</span>
              <div class="ficha-tags">
                ${aptitudes.slice(0, 8).map((item) => `<span class="ficha-tag">${escapeHtml(item)}</span>`).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      ` : ''}
    </article>
  `;
}

function personalityScores(answers) {
  const sums = {};
  const counts = {};

  for (const question of personalityQuestions) {
    const index = answers[question.id];
    if (index == null) continue;
    const value = question.reverse ? 5 - index : index + 1;
    sums[question.dim] = (sums[question.dim] || 0) + value;
    counts[question.dim] = (counts[question.dim] || 0) + 1;
  }

  const scores = {};
  for (const dimension of Object.keys(personalityDimensionLabels)) {
    const count = counts[dimension] || 0;
    const sum = sums[dimension] || 0;
    scores[dimension] = count
      ? Math.max(0, Math.min(100, Math.round(((sum - count) / Math.max(1, count * 4)) * 100)))
      : 0;
  }
  return scores;
}

function vocationalResult(answers) {
  const tagSet = new Set();
  const selected = {};

  for (const step of vocationalSteps) {
    const labels = Array.isArray(answers[step.id]) ? answers[step.id] : [];
    selected[step.id] = labels;
    for (const label of labels) {
      const option = step.options.find((item) => item.label === label);
      for (const tag of option?.tags || []) tagSet.add(tag);
    }
  }

  const interests = [
    ...new Set([
      ...(answers.series || []),
      ...(answers.subjects || []),
      ...(answers.activities || [])
    ])
  ];
  const aptitudes = [...new Set(answers.aptitudes || [])];
  const workdays = [...new Set(answers.workdays || [])];
  const environment = [...new Set(answers.environment || [])];
  const values = [...new Set(answers.values || [])];
  const future = [...new Set(answers.future || [])];

  const tagFrequency = {};
  for (const career of careerCatalog) {
    for (const tag of career.tags) {
      tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
    }
  }

  const scored = careerCatalog
    .map((career) => {
      const matches = career.tags.filter((tag) => tagSet.has(tag));
      // Peso por especificidad: un tag compartido por muchas carreras
      // distingue menos que uno poco común. Así el score no se satura a 100%.
      const weight = matches.reduce((sum, tag) => sum + 1 / tagFrequency[tag], 0);
      return { name: career.name, matches, weight };
    })
    .filter((career) => career.matches.length > 0)
    .sort((a, b) => b.weight - a.weight || a.name.localeCompare(b.name));

  const top = scored.slice(0, 8);
  const maxWeight = top[0]?.weight || 1;
  const careerSuggestions = top.map((career) => ({
    name: career.name,
    score: Math.round((career.weight / maxWeight) * 100),
    matches: career.matches
  }));

  return {
    version: 1,
    completed_at: new Date().toISOString(),
    interests,
    aptitudes,
    workdays,
    environment,
    values,
    future,
    tags: [...tagSet],
    career_suggestions: careerSuggestions,
    career_choice: answers.career_choice || null
  };
}

function testTopDimensions(scores) {
  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([key]) => key);
}

function testModalStepCount(active) {
  return active.kind === 'personality' ? personalityQuestions.length : vocationalSteps.length + 1;
}

function testModalCurrentQuestion(active) {
  if (active.kind === 'personality') {
    return personalityQuestions[active.step] || null;
  }
  return vocationalSteps[active.step] || null;
}

function testModalOptionsMarkup(active) {
  if (active.kind === 'personality') {
    const question = personalityQuestions[active.step];
    if (!question) return '';
    const selected = active.answers[question.id];

    return `
      <div class="test-scale">
        ${personalityScale.map((item, index) => `
          <button type="button" class="test-option ${selected === index ? 'selected' : ''}" data-test-option="${index}">
            <span aria-hidden="true">${item.emoji}</span>
            <strong>${escapeHtml(item.label)}</strong>
          </button>
        `).join('')}
      </div>
    `;
  }

  if (active.step >= vocationalSteps.length) {
    const result = vocationalResult(active.answers);
    const options = result.career_suggestions.map((career) => career.name);
    const choice = active.answers.career_choice || '';

    return `
      <div class="test-career-grid">
        ${options.map((name) => `
          <button type="button" class="test-option ${choice === name ? 'selected' : ''}" data-test-option="${escapeHtml(name)}">
            <span aria-hidden="true">🎓</span>
            <strong>${escapeHtml(name)}</strong>
          </button>
        `).join('')}
        <button type="button" class="test-option ${choice === 'Aún no lo sé' ? 'selected' : ''}" data-test-option="Aún no lo sé">
          <span aria-hidden="true">🤔</span>
          <strong>Aún no lo sé</strong>
        </button>
      </div>
      ${options.length ? '<p class="hint">Estas carreras salen de tus intereses y aptitudes. Puedes elegir una o decir que aún no lo sabes.</p>' : ''}
    `;
  }

  const step = vocationalSteps[active.step];
  const selected = active.answers[step.id] || [];
  const max = step.id === 'values' ? 3 : null;

  return `
    <div class="test-choice-grid">
      ${step.options.map((option) => `
        <button type="button" class="test-option ${selected.includes(option.label) ? 'selected' : ''}" data-test-option="${escapeHtml(option.label)}">
          <span class="test-check" aria-hidden="true">${selected.includes(option.label) ? '✓' : '+'}</span>
          <strong>${escapeHtml(option.label)}</strong>
        </button>
      `).join('')}
    </div>
    <div class="test-choice-foot">
      <span class="pill">${selected.length} seleccionados${max ? ` · máximo ${max}` : ''}</span>
      <button type="button" class="btn-mini" data-test-clear ${selected.length ? '' : 'hidden'}>Limpiar selección</button>
    </div>
  `;
}

function testResultMarkup(active) {
  const result = active.result || {};
  const payload = active.kind === 'personality' ? result.personality : result.aptitude;
  const profile = state.dashboard?.profile || {};

  if (active.kind === 'personality') {
    const scores = payload?.scores || {};
    const top = testTopDimensions(scores);
    const topLabels = top.map((key) => personalityDimensionLabels[key]?.label).filter(Boolean);

    return `
      <div class="test-result">
        <div class="test-result-hero">
          <span class="test-result-emoji" aria-hidden="true">🧠</span>
          <div>
            <span class="card-label">Test completado</span>
            <h2>Tu perfil de personalidad</h2>
            <p class="muted">${topLabels.length ? `Tus rasgos más marcados son ${topLabels.join(' y ')}.` : 'Gracias por responder con honestidad.'}</p>
          </div>
        </div>

        <div class="test-score-list">
          ${Object.entries(personalityDimensionLabels).map(([key, meta]) => {
            const value = scores[key] ?? 0;
            return `
              <div class="test-score">
                <div class="test-score-head">
                  <span>${meta.emoji} ${escapeHtml(meta.label)}</span>
                  <strong>${value}%</strong>
                </div>
                <div class="ficha-bar" aria-hidden="true">
                  <div class="ficha-bar-fill" style="--bar-color:${value >= 70 ? 'var(--good)' : value >= 40 ? 'var(--brand)' : 'var(--amber)'};--bar-scale:${(value / 100).toFixed(3)}"></div>
                </div>
                <small>${escapeHtml(meta.copy)}</small>
              </div>
            `;
          }).join('')}
        </div>

        <div class="test-result-note">
          <strong>Tu profesor ya puede ver este resultado en tu ficha.</strong>
          <span>Puedes volver a hacer el test cuando quieras; se guardará la versión más reciente.</span>
        </div>

        <div class="test-result-actions">
          <button type="button" class="btn ghost" data-test-retry>Volver a hacerlo</button>
          <button type="button" class="btn primary" data-test-close>Cerrar</button>
        </div>
      </div>
    `;
  }

  const careers = Array.isArray(payload?.career_suggestions) ? payload.career_suggestions : [];
  const interests = Array.isArray(payload?.interests) ? payload.interests : [];
  const aptitudes = Array.isArray(payload?.aptitudes) ? payload.aptitudes : [];
  const choice = payload?.career_choice || profile.career_choice;

  return `
    <div class="test-result">
      <div class="test-result-hero">
        <span class="test-result-emoji" aria-hidden="true">🧭</span>
        <div>
          <span class="card-label">Test completado</span>
          <h2>Tu orientación vocacional</h2>
          <p class="muted">${choice ? `Elegiste ${escapeHtml(choice)} como una carrera que te llama la atención.` : 'Estas son las carreras que mejor combinan con tus respuestas.'}</p>
        </div>
      </div>

      ${careers.length ? `
        <div class="test-career-results">
          <span class="card-label">Carreras sugeridas</span>
          ${careers.map((career) => `
            <div class="test-career-row">
              <div>
                <strong>${escapeHtml(career.name)}</strong>
                <small>${(career.matches || []).map((tag) => escapeHtml(tag)).join(' · ') || 'Coincide con tu perfil'}</small>
              </div>
              <div class="test-career-score">
                <div class="ficha-bar" aria-hidden="true">
                  <div class="ficha-bar-fill" style="--bar-color:var(--brand-2);--bar-scale:${(Math.max(0, Math.min(100, career.score)) / 100).toFixed(3)}"></div>
                </div>
                <strong>${career.score}%</strong>
              </div>
            </div>
          `).join('')}
        </div>
      ` : '<p class="ficha-empty">Todavía no hay suficientes coincidencias. Puedes repetir el test eligiendo más intereses.</p>'}

      <div class="test-tag-columns">
        ${interests.length ? `
          <div class="test-summary-block">
            <span class="card-label">Intereses que elegiste</span>
            <div class="ficha-tags">${interests.map((item) => `<span class="ficha-tag">${escapeHtml(item)}</span>`).join('')}</div>
          </div>
        ` : ''}
        ${aptitudes.length ? `
          <div class="test-summary-block">
            <span class="card-label">Aptitudes que reconociste</span>
            <div class="ficha-tags">${aptitudes.map((item) => `<span class="ficha-tag">${escapeHtml(item)}</span>`).join('')}</div>
          </div>
        ` : ''}
      </div>

      <div class="test-result-note">
        <strong>Tu profesor ya puede ver estos intereses y carreras en tu ficha.</strong>
        <span>Puedes repetir el test si tus gustos cambian.</span>
      </div>

      <div class="test-result-actions">
        <button type="button" class="btn ghost" data-test-retry>Volver a hacerlo</button>
        <button type="button" class="btn primary" data-test-close>Cerrar</button>
      </div>
    </div>
  `;
}

function testModalCanContinue(active) {
  const total = testModalStepCount(active);
  const step = Math.min(active.step, total - 1);

  if (active.kind === 'personality') {
    const question = personalityQuestions[step];
    return question ? active.answers[question.id] != null : false;
  }

  if (step >= vocationalSteps.length) return Boolean(active.answers.career_choice);
  return (active.answers[vocationalSteps[step].id] || []).length > 0;
}

function testModalMarkup() {
  const active = state.activeTest;
  if (!active) return '';

  if (active.saved) {
    return `
      <div class="test-overlay" data-test-overlay>
        <section class="test-dialog" role="dialog" aria-modal="true" aria-labelledby="test-title">
          <button type="button" class="ficha-close" data-test-close aria-label="Cerrar test">✕</button>
          <div class="test-body">${testResultMarkup(active)}</div>
        </section>
      </div>
    `;
  }

  const total = testModalStepCount(active);
  const step = Math.min(active.step, total - 1);
  const progress = Math.round(((step + 1) / total) * 100);
  const question = testModalCurrentQuestion(active);
  const isCareerStep = active.kind === 'vocational' && step >= vocationalSteps.length;
  const title = active.kind === 'personality' ? 'Test de personalidad' : 'Test de orientación vocacional';
  const stepTitle = active.kind === 'personality' ? `Pregunta ${step + 1}` : (isCareerStep ? 'Tu carrera ideal' : vocationalSteps[step].title);
  const prompt = active.kind === 'personality' ? question.text : (isCareerStep ? '¿Cuál de estas carreras te llama más la atención?' : vocationalSteps[step].prompt);
  const help = active.kind === 'personality'
    ? 'Elige la opción que mejor te describa. No hay respuestas buenas o malas.'
    : (isCareerStep ? 'Puedes elegir una carrera o decir que aún no lo sabes.' : vocationalSteps[step].help);

  const canContinue = testModalCanContinue(active);

  return `
    <div class="test-overlay" data-test-overlay>
      <section class="test-dialog" role="dialog" aria-modal="true" aria-labelledby="test-title">
        <button type="button" class="ficha-close" data-test-close aria-label="Cerrar test">✕</button>

        <header class="test-header">
          <div>
            <span class="card-label">${escapeHtml(title)}</span>
            <h2 id="test-title">${escapeHtml(stepTitle)}</h2>
          </div>
          <span class="pill">${step + 1} / ${total}</span>
        </header>

        <div class="test-progress" aria-hidden="true">
          <div class="test-progress-fill" style="width:${progress}%"></div>
        </div>

        <div class="test-body">
          <h3 class="test-prompt">${escapeHtml(prompt)}</h3>
          <p class="test-help">${escapeHtml(help)}</p>
          ${testModalOptionsMarkup(active)}
          <div class="test-error" data-test-error hidden></div>
        </div>

        <footer class="test-footer">
          <button type="button" class="btn ghost" data-test-back ${step === 0 ? 'disabled' : ''}>← Atrás</button>
          <button type="button" class="btn primary" data-test-next aria-disabled="${canContinue ? 'false' : 'true'}" ${canContinue ? '' : 'data-pending="1"'}>
            ${step === total - 1 ? 'Guardar resultados' : 'Siguiente →'}
          </button>
        </footer>
      </section>
    </div>
  `;
}

function bindTestModalEvents() {
  const overlay = document.querySelector('[data-test-overlay]');
  if (!overlay) return;

  const active = state.activeTest;
  if (!active) return;

  const close = () => closeTestModal({ refresh: true });

  overlay.querySelectorAll('[data-test-close]').forEach((button) => {
    button.addEventListener('click', close);
  });

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) close();
  });

  state.activeTest.escHandler = trapDialogFocus(overlay, close);

  if (active.saved) {
    overlay.querySelectorAll('[data-test-retry]').forEach((button) => {
      button.addEventListener('click', () => {
        const kind = active.kind;
        closeTestModal({ silent: true });
        startStudentTest(kind);
      });
    });
    return;
  }

  const scrollDialogTop = () => {
    const dialog = overlay.querySelector('.test-dialog');
    if (dialog) dialog.scrollTop = 0;
  };

  const refreshFooterState = () => {
    const next = overlay.querySelector('[data-test-next]');
    if (!next) return;
    const ok = testModalCanContinue(active);
    next.setAttribute('aria-disabled', ok ? 'false' : 'true');
    if (ok) next.removeAttribute('data-pending');
    else next.setAttribute('data-pending', '1');
  };

  const refreshChoiceFoot = () => {
    const foot = overlay.querySelector('.test-choice-foot');
    if (!foot) return;
    const step = vocationalSteps[active.step];
    if (!step) return;
    const selected = Array.isArray(active.answers[step.id]) ? active.answers[step.id] : [];
    const max = step.id === 'values' ? 3 : null;
    const pill = foot.querySelector('.pill');
    if (pill) pill.textContent = `${selected.length} seleccionados${max ? ` · máximo ${max}` : ''}`;
    const clear = foot.querySelector('[data-test-clear]');
    if (clear) clear.hidden = selected.length === 0;
    refreshFooterState();
  };

  overlay.querySelectorAll('[data-test-option]').forEach((button) => {
    button.addEventListener('click', () => {
      const value = button.dataset.testOption;
      const total = testModalStepCount(active);

      // Personalidad: una sola respuesta → avanza automáticamente.
      if (active.kind === 'personality') {
        const question = personalityQuestions[active.step];
        active.answers[question.id] = Number(value);

        if (active.step < total - 1) {
          active.step += 1;
          renderTestModal();
          scrollDialogTop();
        } else {
          saveStudentTest(null);
        }
        return;
      }

      // Carrera (último paso del vocacional): una sola elección → guarda.
      if (active.step >= vocationalSteps.length) {
        active.answers.career_choice = value;
        button.classList.add('selected');
        const errorBox = overlay.querySelector('[data-test-error]');
        if (errorBox) {
          errorBox.hidden = false;
          errorBox.textContent = 'Guardando tus resultados…';
        }
        saveStudentTest(null);
        return;
      }

      // Pasos de selección múltiple: actualiza en el sitio, sin recargar.
      const step = vocationalSteps[active.step];
      const current = Array.isArray(active.answers[step.id]) ? [...active.answers[step.id]] : [];
      const index = current.indexOf(value);
      const max = step.id === 'values' ? 3 : null;

      if (index >= 0) {
        current.splice(index, 1);
      } else if (!max || current.length < max) {
        current.push(value);
      }
      active.answers[step.id] = current;

      const nowSelected = current.includes(value);
      button.classList.toggle('selected', nowSelected);
      const check = button.querySelector('.test-check');
      if (check) check.textContent = nowSelected ? '✓' : '+';
      refreshChoiceFoot();
    });
  });

  const clearButton = overlay.querySelector('[data-test-clear]');
  if (clearButton) {
    clearButton.addEventListener('click', () => {
      const step = vocationalSteps[active.step];
      if (!step) return;
      active.answers[step.id] = [];
      overlay.querySelectorAll('[data-test-option].selected').forEach((button) => {
        button.classList.remove('selected');
        const check = button.querySelector('.test-check');
        if (check) check.textContent = '+';
      });
      refreshChoiceFoot();
    });
  }

  overlay.querySelector('[data-test-back]')?.addEventListener('click', () => {
    if (active.step > 0) {
      active.step -= 1;
      renderTestModal();
      scrollDialogTop();
    }
  });

  overlay.querySelector('[data-test-next]')?.addEventListener('click', async (event) => {
    if (!testModalCanContinue(active)) {
      const errorBox = overlay.querySelector('[data-test-error]');
      if (errorBox) {
        errorBox.hidden = false;
        errorBox.textContent = active.kind === 'personality'
          ? 'Elige una opción antes de continuar.'
          : 'Selecciona al menos una opción antes de continuar.';
      }
      return;
    }

    const total = testModalStepCount(active);
    if (active.step < total - 1) {
      active.step += 1;
      renderTestModal();
      return;
    }
    await saveStudentTest(event.currentTarget);
  });
}

function renderTestModal() {
  document.querySelectorAll('[data-test-overlay]').forEach((overlay) => overlay.remove());

  if (state.activeTest?.escHandler) {
    state.activeTest.escHandler();
    state.activeTest.escHandler = null;
  }

  const markup = testModalMarkup();
  if (!markup) {
    document.body.classList.remove('test-open');
    return;
  }

  document.body.insertAdjacentHTML('beforeend', markup);
  document.body.classList.add('test-open');
  bindTestModalEvents();

  requestAnimationFrame(() => {
    document.querySelector('[data-test-close]')?.focus();
  });
}

function startStudentTest(kind) {
  state.activeTest = {
    kind,
    step: 0,
    answers: {},
    saved: false,
    result: null,
    escHandler: null
  };
  renderTestModal();
}

function closeTestModal({ silent = false, refresh = false } = {}) {
  if (state.activeTest?.escHandler) {
    state.activeTest.escHandler();
  }
  state.activeTest = null;
  document.querySelectorAll('[data-test-overlay]').forEach((overlay) => overlay.remove());
  document.body.classList.remove('test-open');

  if (refresh && !silent) {
    renderDashboard();
  }
}

async function saveStudentTest(button) {
  const active = state.activeTest;
  if (!active || active.saving || button?.disabled) return;

  active.saving = true;

  const errorBox = document.querySelector('[data-test-error]');
  if (errorBox && button) {
    errorBox.hidden = true;
    errorBox.textContent = '';
  }

  let payload;
  if (active.kind === 'personality') {
    const scores = personalityScores(active.answers);
    payload = {
      version: 1,
      completed_at: new Date().toISOString(),
      scores,
      top: testTopDimensions(scores),
      answers: active.answers
    };
  } else {
    payload = vocationalResult(active.answers);
  }

  if (button) {
    button.disabled = true;
    button.textContent = 'Guardando…';
  }

  const { data, error } = await supabase.rpc('app_save_student_test', {
    p_kind: active.kind,
    p_payload: payload
  });

  if (error) {
    active.saving = false;
    if (button) {
      button.disabled = false;
      button.textContent = 'Guardar resultados';
    }
    if (errorBox) {
      errorBox.hidden = false;
      errorBox.textContent = error.message || 'No se pudieron guardar los resultados.';
    }
    return;
  }

  active.saved = true;
  active.result = data || {};
  active.savedAt = new Date().toISOString();

  if (state.dashboard) {
    state.dashboard.profile = state.dashboard.profile || {};
    if (active.kind === 'personality') {
      state.dashboard.profile.personality = payload;
    } else {
      state.dashboard.profile.aptitude = payload;
      state.dashboard.profile.interests = payload.interests;
      state.dashboard.profile.aptitudes = payload.aptitudes;
      state.dashboard.profile.strengths = payload.aptitudes;
      state.dashboard.profile.career_suggestions = payload.career_suggestions;
      if (payload.career_choice) state.dashboard.profile.career_choice = payload.career_choice;
    }
  }

  renderTestModal();
}

function guardianDashboardMarkup(data) {
  const privacy = data.privacy || {};
  const version = privacy.version || PRIVACY_DOCUMENT_VERSION;
  const url = privacy.url || '/privacidad.html';
  const children = data.children || [];
  const pending = data.pending || [];
  const hasConsent = children.length > 0;
  const linkedCount = children.length + pending.length;
  const statusLabel = !linkedCount ? 'Sin vínculos' : (pending.length ? 'Pendiente' : 'Aceptado');
  const statusClass = linkedCount && !pending.length ? 'success' : '';

  return `
    <article class="card wide privacy-gate">
      <div class="card-heading">
        <div>
          <span class="card-label">Privacidad</span>
          <h2>Aviso de privacidad ${escapeHtml(version)}</h2>
        </div>
        <span class="pill ${statusClass}">${statusLabel}</span>
      </div>
      ${linkedCount ? `
        <p>Para consultar la información de tus hijos, lee el aviso y confirma que lo entiendes. Sin ese consentimiento, la plataforma no muestra datos del alumno.</p>
      ` : `
        <p>Cuando la institución vincule a tus hijos, aparecerán aquí. Antes de mostrar sus datos deberás leer y aceptar el aviso de privacidad.</p>
      `}
      <div class="row">
        <a class="btn ghost" href="${escapeHtml(url)}" target="_blank" rel="noopener">Leer el aviso completo</a>
      </div>
      ${pending.length ? `
        <label class="checkbox-field">
          <input type="checkbox" data-consent-ack>
          <span>He leído y entiendo el <a href="${escapeHtml(url)}" target="_blank" rel="noopener">aviso de privacidad</a> ${escapeHtml(version)}.</span>
        </label>
        <ul class="data-list">
          ${pending.map((item) => `
            <li>
              <div>
                <strong>${escapeHtml(item.label)}</strong>
                <small>Sin consentimiento vigente. No se muestran sus datos.</small>
              </div>
              <button class="btn primary" data-consent-student="${escapeHtml(item.id)}" disabled>Aceptar y ver datos</button>
            </li>
          `).join('')}
        </ul>
        <p class="hint">Marca la casilla para habilitar el botón. El consentimiento se registra por alumno.</p>
      ` : linkedCount ? `
        <p class="hint">Consentimiento vigente. Puedes revocarlo cuando quieras desde la lista de tus hijos.</p>
      ` : ''}
    </article>

    ${hasConsent ? `
      <article class="card wide">
        <div class="card-heading">
          <div>
            <span class="card-label">Mis hijos</span>
            <h2>${countLabel(children.length, 'alumno vinculado', 'alumnos vinculados')}</h2>
          </div>
          <span class="pill">Solo lectura</span>
        </div>
        <ul class="data-list">
          ${children.map((child) => {
            const accepted = child.consent_accepted_at
              ? formatDate(String(child.consent_accepted_at).slice(0, 10))
              : '';

            return `
              <li>
                <div>
                  <strong>${escapeHtml(child.full_name)}</strong>
                  <small>${escapeHtml(child.student_code)} · ${escapeHtml(child.group_name)}${accepted ? ` · Consentimiento del ${escapeHtml(accepted)}` : ''}</small>
                </div>
                <button class="btn ghost" data-revoke-consent="${escapeHtml(child.id)}" data-revoke-name="${escapeHtml(child.full_name)}">Revocar consentimiento</button>
              </li>
            `;
          }).join('')}
        </ul>
        <p class="muted"><small>Si revocas el consentimiento, dejaremos de mostrar la información del alumno hasta que vuelvas a aceptar el aviso.</small></p>
      </article>
    ` : ''}

    ${hasConsent ? guardianAcademicsMarkup(data) : ''}

    ${hasConsent ? guardianPaymentsMarkup(data) : ''}
  `;
}

function guardianAcademicsMarkup(data) {
  const children = data.children || [];
  const academics = data.academics || new Map();

  return `
    <article class="card wide">
      <div class="card-heading">
        <div>
          <span class="card-label">Seguimiento</span>
          <h2>Avance, calificaciones y tareas</h2>
        </div>
        <span class="pill">Solo lectura</span>
      </div>
      <p class="muted"><small>Ves lo que el personal registra para tus hijos. No puedes editar nada desde aquí.</small></p>
      ${children.map((child) => guardianChildAcademicsMarkup(child, academics.get(child.id) || {})).join('')}
    </article>
  `;
}

function guardianChildAcademicsMarkup(child, academics) {
  const stats = academics.stats || {};
  const progress = academics.progress || [];
  const grades = academics.grades || [];
  const attendance = academics.attendance || [];
  const observations = academics.observations || [];
  const tasks = academics.tasks || [];
  const guidance = academics.guidance || {};

  const attendanceCounts = attendance.reduce((counts, row) => {
    counts[row.status] = (counts[row.status] || 0) + 1;
    return counts;
  }, {});
  const attendanceTotal = attendance.length;
  const attendanceRate = attendanceTotal
    ? Math.round((((attendanceCounts.present || 0) + (attendanceCounts.late || 0)) * 100) / attendanceTotal)
    : null;
  const completed = progress.filter((row) => row.status === 'completed' || row.status === 'mastered').length;
  const inProgress = progress.filter((row) => row.status === 'in_progress').length;
  const pendingTasks = tasks.filter((task) => !task.submission || task.submission.status === 'pending');

  const interests = Array.isArray(guidance.interests) ? guidance.interests : [];
  const aptitudes = Array.isArray(guidance.aptitudes) ? guidance.aptitudes : [];
  const strengths = Array.isArray(guidance.strengths) ? guidance.strengths : [];
  const careers = Array.isArray(guidance.career_suggestions)
    ? guidance.career_suggestions.map((career) => (typeof career === 'string' ? career : career?.name)).filter(Boolean)
    : [];
  const hasGuidance = interests.length || aptitudes.length || strengths.length || careers.length || guidance.career_choice;

  const taskStatusLabel = (task) => {
    if (!task.submission) return 'Sin registrar';
    return { pending: 'Pendiente', submitted: 'Entregada', late: 'Entregada tarde' }[task.submission.status] || 'Pendiente';
  };

  const attendanceLabel = (status) => ({
    present: 'Asistencia',
    late: 'Retardo',
    excused: 'Justificado',
    absent: 'Falta'
  }[status] || status);

  return `
    <section class="guardian-child">
      <div class="guardian-child-head">
        <div>
          <h3>${escapeHtml(child.full_name)}</h3>
          <small>${escapeHtml(child.student_code)} · ${escapeHtml(child.group_name)}</small>
        </div>
        <span class="pill">Solo lectura</span>
      </div>

      <div class="guardian-grid">
        <div class="guardian-block">
          <h4>Avance <span class="guardian-ro">Solo lectura</span></h4>
          <div class="guardian-chips">
            <span class="hero-chip">🎯 ${completed} ${completed === 1 ? 'unidad completada' : 'unidades completadas'}</span>
            <span class="hero-chip">📚 ${inProgress} en curso</span>
            <span class="hero-chip">⚡ ${Number(stats.xp_total || 0)} XP</span>
          </div>
          ${progress.length ? `
            <ul class="data-list compact">
              ${progress.slice(0, 6).map((row) => `
                <li>
                  <div>
                    <strong>${escapeHtml(row.unit_title)}</strong>
                    <small>${escapeHtml(row.subject_name || 'Materia')} · ${escapeHtml(progressLabels[row.status] || row.status)}${row.best_accuracy != null ? ` · ${Math.round(row.best_accuracy)}%` : ''}</small>
                  </div>
                </li>
              `).join('')}
            </ul>
          ` : '<p class="empty-state">Todavía no hay avance registrado.</p>'}
        </div>

        <div class="guardian-block">
          <h4>Calificaciones visibles <span class="guardian-ro">Solo lectura</span></h4>
          ${grades.length ? `
            <ul class="data-list compact">
              ${grades.slice(0, 8).map((row) => `
                <li>
                  <div>
                    <strong>${escapeHtml(row.assessment_name)}</strong>
                    <small>${escapeHtml(row.subject_name || 'Materia')}${row.assessment_date ? ` · ${escapeHtml(formatDate(row.assessment_date))}` : ''}</small>
                  </div>
                  <span class="pill ${row.score != null ? 'success' : ''}">${row.score != null ? `${row.score}/${row.max_score ?? '—'}` : 'Pendiente'}</span>
                </li>
              `).join('')}
            </ul>
          ` : '<p class="empty-state">Aún no hay calificaciones marcadas como visibles para la familia.</p>'}
        </div>

        <div class="guardian-block">
          <h4>Asistencia <span class="guardian-ro">Solo lectura</span></h4>
          ${attendanceTotal ? `
            <div class="guardian-chips">
              <span class="hero-chip">✅ ${attendanceRate}% de asistencia</span>
              ${Object.entries(attendanceCounts).map(([status, count]) => `<span class="hero-chip">${escapeHtml(attendanceLabel(status))}: ${count}</span>`).join('')}
            </div>
            <ul class="data-list compact">
              ${attendance.slice(0, 6).map((row) => `
                <li>
                  <div>
                    <strong>${row.session_date ? escapeHtml(formatDate(row.session_date)) : 'Sesión'}</strong>
                    <small>${escapeHtml(row.topic || 'Sin tema registrado')}${row.minutes_late ? ` · ${row.minutes_late} min tarde` : ''}</small>
                  </div>
                  <span class="pill ${row.status === 'absent' ? 'pill-amber' : ''}">${escapeHtml(attendanceLabel(row.status))}</span>
                </li>
              `).join('')}
            </ul>
          ` : '<p class="empty-state">Aún no hay registros de asistencia.</p>'}
        </div>

        <div class="guardian-block">
          <h4>Tareas <span class="guardian-ro">Solo lectura</span></h4>
          ${tasks.length ? `
            <div class="guardian-chips">
              <span class="hero-chip">📝 ${pendingTasks.length} pendientes</span>
            </div>
            <ul class="data-list compact">
              ${tasks.slice(0, 6).map((task) => `
                <li>
                  <div>
                    <strong>${escapeHtml(task.title)}</strong>
                    <small>${escapeHtml(task.subject_name || 'Materia')}${task.due_at ? ` · entrega ${escapeHtml(formatDate(String(task.due_at).slice(0, 10)))}` : ''}</small>
                  </div>
                  <span class="pill ${task.submission?.status === 'submitted' ? 'success' : task.submission?.status === 'late' ? 'pill-amber' : ''}">${escapeHtml(taskStatusLabel(task))}${task.submission?.score != null ? ` · ${task.submission.score}/${task.max_score ?? '—'}` : ''}</span>
                </li>
              `).join('')}
            </ul>
          ` : '<p class="empty-state">Aún no hay tareas asignadas.</p>'}
        </div>

        <div class="guardian-block wide">
          <h4>Observaciones para la familia <span class="guardian-ro">Solo lectura</span></h4>
          ${observations.length ? `
            <ul class="data-list compact">
              ${observations.slice(0, 6).map((row) => `
                <li>
                  <div>
                    <strong>${escapeHtml(row.category || 'Observación')}</strong>
                    <small>${escapeHtml(formatDate(String(row.created_at).slice(0, 10)))}</small>
                    <p>${escapeHtml(row.body)}</p>
                  </div>
                </li>
              `).join('')}
            </ul>
          ` : '<p class="empty-state">No hay observaciones visibles para la familia.</p>'}
        </div>

        <div class="guardian-block wide">
          <h4>Orientación vocacional <span class="guardian-ro">Solo lectura</span></h4>
          <p class="hint">Resumen orientativo, no diagnóstico. Las notas internas de orientación quedan reservadas al personal docente.</p>
          ${hasGuidance ? `
            ${guidance.career_choice ? `<p><strong>Carrera de interés:</strong> ${escapeHtml(guidance.career_choice)}</p>` : ''}
            ${interests.length ? `<p><strong>Intereses:</strong> ${interests.map((item) => escapeHtml(item)).join(' · ')}</p>` : ''}
            ${aptitudes.length ? `<p><strong>Aptitudes:</strong> ${aptitudes.map((item) => escapeHtml(item)).join(' · ')}</p>` : ''}
            ${strengths.length ? `<p><strong>Fortalezas:</strong> ${strengths.map((item) => escapeHtml(item)).join(' · ')}</p>` : ''}
            ${careers.length ? `<p><strong>Carreras sugeridas:</strong> ${careers.slice(0, 6).map((item) => escapeHtml(item)).join(' · ')}</p>` : ''}
          ` : '<p class="empty-state">El alumno todavía no ha completado los test de orientación.</p>'}
        </div>
      </div>
    </section>
  `;
}

function guardianPaymentsMarkup(data) {
  const billing = data.billingByStudent || new Map();
  const billingStatus = data.billingStatusByStudent || new Map();

  return `
    <article class="card wide">
      <div class="card-heading">
        <div>
          <span class="card-label">Cuentas</span>
          <h2>Plan y pagos de tus hijos</h2>
        </div>
        <span class="pill">Solo lectura</span>
      </div>
      ${data.children.map((child) => {
        const planRow = billing.get(child.id) || {};
        const statusRow = billingStatus.get(child.id) || {};
        const plan = planRow.plan || 'mensual';
        const total = paymentsTotal(child.id, data.payments);
        const last = paymentsLast(child.id, data.payments);
        const recent = paymentsOf(child.id, data.payments)
          .slice()
          .sort((a, b) => String(b.paid_at).localeCompare(String(a.paid_at)))
          .slice(0, 3);

        return `
          <div class="guardian-pay">
            <div class="guardian-pay-head">
              <div>
                <strong>${escapeHtml(child.full_name)}</strong>
                <small>${escapeHtml(child.student_code)}</small>
              </div>
              <div class="pay-cells">
                <span class="pill">${escapeHtml(paymentPlanLabels[plan] || plan)}${planRow.fee ? ` · ${money(planRow.fee)}` : ''}</span>
                ${statusRow.status ? `<span class="pill ${statusRow.status === 'al corriente' || statusRow.status === 'beca' ? 'success' : 'pill-amber'}">${escapeHtml(billingStatusLabel(statusRow.status))}</span>` : ''}
                <span class="pill ${total > 0 ? 'success' : ''}">Pagado: ${money(total)}</span>
                ${last ? `<span class="pill">Último pago: ${escapeHtml(formatDate(String(last.paid_at).slice(0, 10)))}</span>` : '<span class="pill">Sin pagos registrados</span>'}
              </div>
            </div>
            ${statusRow.period_start ? `
              <p class="muted"><small>Periodo actual: ${escapeHtml(formatDate(statusRow.period_start))} – ${escapeHtml(formatDate(statusRow.period_end))}${statusRow.balance != null && Number(statusRow.balance) > 0 ? ` · Saldo: ${money(statusRow.balance)}` : ''}</small></p>
            ` : ''}
            ${recent.length ? `
              <ul class="data-list">
                ${recent.map((payment) => `
                  <li>
                    <div>
                      <strong>${money(payment.amount)}${payment.receipt_no ? ` · ${escapeHtml(payment.receipt_no)}` : ''}</strong>
                      <small>${escapeHtml(formatDate(String(payment.paid_at).slice(0, 10)))} · ${escapeHtml(paymentMethodLabels[payment.method] || payment.method)}${payment.period_start ? ` · ${escapeHtml(formatDate(payment.period_start))}–${escapeHtml(formatDate(payment.period_end))}` : ''}${payment.status === 'voided' ? ' · Anulado' : ''}</small>
                    </div>
                    <div class="pay-history-actions">
                      <span class="pill ${payment.status === 'voided' ? 'pill-amber' : 'success'}">${escapeHtml(paymentStatusLabel(payment.status))}</span>
                      <button class="btn ghost" data-receipt-payment="${escapeHtml(payment.id)}" aria-label="Descargar recibo ${escapeHtml(payment.receipt_no || payment.id)}">Recibo</button>
                    </div>
                  </li>
                `).join('')}
              </ul>
            ` : ''}
            ${planRow.notes ? `<p class="muted"><small>📝 ${escapeHtml(planRow.notes)}</small></p>` : ''}
            <p class="muted"><small>¿Algo no cuadra? Escribe a la institución para revisar tu estado de cuenta.</small></p>
          </div>
        `;
      }).join('')}
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
      <main id="main-content" tabindex="-1" class="dashboard">
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
      ${privacyFooterMarkup()}
    </div>
  `;
}

// FUN-09: la misma interfaz para todos los listados: total, ventana visible
// y controles con aria-label para lectores de pantalla.
function paginationMarkup({ total, page, target, pageSize = PAGE_SIZE }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(1, page), pages);
  const from = total ? (current - 1) * pageSize + 1 : 0;
  const to = Math.min(current * pageSize, total);

  return `
    <div class="pagination" aria-label="Paginación">
      <span>Mostrando ${to - from + 1} de ${total} · filas ${from}–${to}</span>
      <div class="row">
        <button class="btn-mini" data-pagination="${escapeHtml(target)}" data-page="${current - 1}" ${current <= 1 ? 'disabled' : ''} aria-label="Página anterior">← Anterior</button>
        <span aria-live="polite">Página ${current} de ${pages}</span>
        <button class="btn-mini" data-pagination="${escapeHtml(target)}" data-page="${current + 1}" ${current >= pages ? 'disabled' : ''} aria-label="Página siguiente">Siguiente →</button>
      </div>
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
  const resultKey = attributes.exerciseKey
    ? `exercise:${attributes.exerciseKey}`
    : `quiz:${attributes.part}:${attributes.questionKey}`;

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
          <div class="answer-foot">
            <small>Intento ${result.attempt_no || 1}</small>
            <button class="btn-mini" data-retry-question="${escapeHtml(resultKey)}">↺ Reintentar</button>
          </div>
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
        <main id="main-content" tabindex="-1" class="dashboard">
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
  const canComplete = unitView.requirements ? unitView.requirements.can_complete : true;
  const maxAttempts = unitView.quizPolicy?.max_attempts;
  const attemptCopy = maxAttempts === 0
    ? 'sin límite de intentos'
    : (Number.isInteger(maxAttempts) && maxAttempts > 0
      ? `${maxAttempts} intentos por pregunta`
      : '');

  return `
    <div class="shell">
      ${headerMarkup()}
      <main id="main-content" tabindex="-1" class="dashboard">
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
          ${attemptCopy ? `<p class="hint">Política de intentos: ${escapeHtml(attemptCopy)}.</p>` : ''}

          ${hasQuestions ? '' : '<article class="card wide"><p class="empty-state">Esta versión todavía no tiene ejercicios.</p></article>'}

          ${unitView.requirements ? `
            <article class="card wide requirement-card" role="status" aria-live="polite">
              <span class="card-label">Requisitos de completado</span>
              <p>${escapeHtml(unitView.requirements.message)}</p>
              <small class="muted">Mínimo ${escapeHtml(String(unitView.requirements.rules?.min_exercises_pct ?? 60))} % de ejercicios y ${escapeHtml(String(unitView.requirements.rules?.min_quiz_accuracy ?? 70))} % de precisión en el quiz.</small>
            </article>
          ` : ''}
        </div>

        <div class="row end">
          <button class="btn ghost" id="back-btn">Volver al panel</button>
          <button class="btn primary" id="complete-unit-btn" ${isDone || !canComplete ? 'disabled' : ''}>
            ${isDone ? 'Unidad completada' : (canComplete ? 'Marcar como completada' : 'Faltan requisitos')}
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

  appRoot.querySelectorAll('[data-retry-question]').forEach((button) => {
    button.addEventListener('click', () => {
      const key = button.dataset.retryQuestion;
      if (!key) return;
      delete state.unitResults[key];
      renderUnit();
    });
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
    requirements: null,
    quizPolicy: null,
    loading: true
  };
  renderUnit();

  try {
    const [versionRes, startRes, requirementsRes, policyRes] = await Promise.all([
      supabase
        .from('unit_versions')
        .select('content,version')
        .eq('id', item.unit_version_id)
        .maybeSingle(),
      supabase.rpc('app_start_unit', { p_assignment_id: item.id }),
      supabase.rpc('app_unit_requirements', { p_assignment_id: item.id }),
      supabase.rpc('app_quiz_policy')
    ]);

    assertNoError(versionRes.error);
    assertNoError(startRes.error);
    assertNoError(requirementsRes.error);
    assertNoError(policyRes.error);
    if (state.view !== 'unit' || state.unitView?.assignment.id !== item.id) return;

    state.unitView = {
      assignment: item,
      unit: item.unit,
      version: versionRes.data,
      progress: startRes.data || item.progress,
      requirements: requirementsRes.data,
      quizPolicy: policyRes.data,
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

async function refreshUnitRequirements() {
  const unitView = state.unitView;
  if (!unitView || unitView.loading) return;

  const { data, error } = await supabase.rpc('app_unit_requirements', {
    p_assignment_id: unitView.assignment.id
  });

  if (error) return;
  if (state.view !== 'unit' || state.unitView?.assignment.id !== unitView.assignment.id) return;

  state.unitView = { ...state.unitView, requirements: data };
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
  void refreshUnitRequirements();
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
    // DB-04/FUN-05: el servidor devuelve qué falta; no ocultamos el motivo.
    setError(error.message || 'No se pudo completar la unidad. Revisa la conexión e intenta de nuevo.');
    renderUnit();
    return;
  }

  if (state.view !== 'unit' || state.unitView?.assignment.id !== unitView.assignment.id) return;
  state.unitView.progress = data;
  setNotice('Unidad marcada como completada.');
  renderUnit();
}

/* ---------------- Activar unidad y elegir alumnos ---------------- */

function unitAssignStudents(groupId, assignment) {
  const group = (state.dashboard?.groups || []).find((item) => item.id === groupId);
  const closedIds = new Set(
    (assignment?.overrides || [])
      .filter((override) => override.status === 'closed')
      .map((override) => override.student_id)
  );

  return (group?.students || []).map((student) => ({
    id: student.id,
    full_name: student.full_name || 'Alumno sin nombre',
    student_code: student.student_code || '',
    selected: !closedIds.has(student.id)
  }));
}

function openUnitAssignDialog({ mode, unitId, versionId, groupId, assignmentId = null }) {
  const data = state.dashboard;
  const assignment = assignmentId
    ? (data?.assignments || []).find((item) => item.id === assignmentId)
    : null;

  const resolvedGroupId = groupId || assignment?.group_id;
  const resolvedUnitId = unitId || assignment?.unit_id;
  const resolvedVersionId = versionId || assignment?.unit_version_id;
  const group = (data?.groups || []).find((item) => item.id === resolvedGroupId);

  if (!group || !resolvedUnitId) {
    setError('No se pudo identificar la unidad o el grupo.');
    return;
  }

  const unit = (data?.publishedUnits || []).find((item) => item.id === resolvedUnitId);
  const students = unitAssignStudents(resolvedGroupId, assignment);

  state.unitAssign = {
    mode,
    unitId: resolvedUnitId,
    versionId: resolvedVersionId || unitVersionId(data, resolvedUnitId),
    groupId: resolvedGroupId,
    assignmentId,
    unitTitle: unit?.title || 'Unidad',
    groupName: group.name,
    students,
    closesAt: assignment?.closes_at ? String(assignment.closes_at).slice(0, 10) : '',
    saving: false,
    escHandler: null
  };

  renderUnitAssignDialog();
}

function unitAssignDialogMarkup() {
  const active = state.unitAssign;
  if (!active) return '';

  const selectedCount = active.students.filter((student) => student.selected).length;
  const allSelected = selectedCount === active.students.length;
  const noneSelected = selectedCount === 0;

  return `
    <div class="unit-assign-overlay" data-unit-assign-overlay>
      <section class="unit-assign-dialog" role="dialog" aria-modal="true" aria-labelledby="unit-assign-title">
        <button type="button" class="ficha-close" data-unit-assign-close aria-label="Cerrar">✕</button>

        <header class="unit-assign-head">
          <span class="card-label">${active.mode === 'activate' ? 'Activar unidad' : 'Alumnos de la unidad'}</span>
          <h2 id="unit-assign-title">${escapeHtml(active.unitTitle)}</h2>
          <p class="muted">${escapeHtml(active.groupName)} · elige a qué alumnos se activa esta unidad.</p>
        </header>

        <div class="unit-assign-toolbar">
          <span class="pill ${selectedCount ? 'success' : 'pill-red'}">${selectedCount}/${active.students.length} alumnos seleccionados</span>
          <div class="row">
            <button type="button" class="btn-mini" data-unit-assign-all ${allSelected ? 'disabled' : ''}>Todos</button>
            <button type="button" class="btn-mini" data-unit-assign-none ${noneSelected ? 'disabled' : ''}>Ninguno</button>
          </div>
        </div>

        ${active.students.length ? `
          <div class="unit-assign-list">
            ${active.students.map((student) => `
              <label class="unit-assign-row ${student.selected ? 'selected' : ''}">
                <input type="checkbox" data-unit-assign-student="${escapeHtml(student.id)}" ${student.selected ? 'checked' : ''}>
                <span class="unit-assign-avatar" aria-hidden="true">${escapeHtml((student.full_name || 'A').trim().slice(0, 1).toUpperCase())}</span>
                <span class="unit-assign-name">
                  <strong>${escapeHtml(student.full_name)}</strong>
                  <small>${escapeHtml(student.student_code || 'Sin matrícula')}</small>
                </span>
                <span class="unit-assign-state">${student.selected ? 'Incluido' : 'Excluido'}</span>
              </label>
            `).join('')}
          </div>
        ` : '<p class="ficha-empty">Este grupo todavía no tiene alumnos.</p>'}

        <label class="field unit-assign-date">
          <span>Fecha de cierre (opcional)</span>
          <input type="date" data-unit-assign-closes value="${escapeHtml(active.closesAt)}">
          <small class="hint">Si la dejas vacía, la unidad quedará abierta hasta que la cierres.</small>
        </label>

        <div class="unit-assign-error" data-unit-assign-error hidden></div>

        <footer class="unit-assign-foot">
          <button type="button" class="btn ghost" data-unit-assign-close>Cancelar</button>
          <button type="button" class="btn primary" data-unit-assign-save ${selectedCount ? '' : 'disabled'}>
            ${active.mode === 'activate' ? `Activar para ${selectedCount} ${selectedCount === 1 ? 'alumno' : 'alumnos'}` : 'Guardar cambios'}
          </button>
        </footer>
      </section>
    </div>
  `;
}

function bindUnitAssignDialog() {
  const overlay = document.querySelector('[data-unit-assign-overlay]');
  const active = state.unitAssign;
  if (!overlay || !active) return;

  const close = () => closeUnitAssignDialog();

  overlay.querySelectorAll('[data-unit-assign-close]').forEach((button) => {
    button.addEventListener('click', close);
  });

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) close();
  });

  active.escHandler = trapDialogFocus(overlay, close);

  overlay.querySelectorAll('[data-unit-assign-student]').forEach((input) => {
    input.addEventListener('change', () => {
      const student = active.students.find((item) => item.id === input.dataset.unitAssignStudent);
      if (student) student.selected = input.checked;
      renderUnitAssignDialog();
    });
  });

  overlay.querySelector('[data-unit-assign-all]')?.addEventListener('click', () => {
    active.students.forEach((student) => { student.selected = true; });
    renderUnitAssignDialog();
  });

  overlay.querySelector('[data-unit-assign-none]')?.addEventListener('click', () => {
    active.students.forEach((student) => { student.selected = false; });
    renderUnitAssignDialog();
  });

  const closesInput = overlay.querySelector('[data-unit-assign-closes]');
  if (closesInput) {
    closesInput.addEventListener('change', () => {
      active.closesAt = closesInput.value;
    });
  }

  overlay.querySelector('[data-unit-assign-save]')?.addEventListener('click', (event) => {
    saveUnitAssignment(event.currentTarget);
  });
}

function renderUnitAssignDialog() {
  document.querySelectorAll('[data-unit-assign-overlay]').forEach((overlay) => overlay.remove());

  if (state.unitAssign?.escHandler) {
    state.unitAssign.escHandler();
    state.unitAssign.escHandler = null;
  }

  const markup = unitAssignDialogMarkup();
  if (!markup) {
    document.body.classList.remove('unit-assign-open');
    return;
  }

  document.body.insertAdjacentHTML('beforeend', markup);
  document.body.classList.add('unit-assign-open');
  bindUnitAssignDialog();

  requestAnimationFrame(() => {
    document.querySelector('[data-unit-assign-close]')?.focus();
  });
}

function closeUnitAssignDialog() {
  if (state.unitAssign?.escHandler) {
    state.unitAssign.escHandler();
  }
  state.unitAssign = null;
  document.querySelectorAll('[data-unit-assign-overlay]').forEach((overlay) => overlay.remove());
  document.body.classList.remove('unit-assign-open');
}

async function saveUnitAssignment(button) {
  const active = state.unitAssign;
  if (!active || active.saving) return;

  const selected = active.students.filter((student) => student.selected);
  if (!selected.length) return;

  const errorBox = document.querySelector('[data-unit-assign-error]');
  const resetButton = () => {
    active.saving = false;
    if (button) {
      button.disabled = false;
      button.textContent = active.mode === 'activate'
        ? `Activar para ${selected.length} ${selected.length === 1 ? 'alumno' : 'alumnos'}`
        : 'Guardar cambios';
    }
  };

  if (errorBox) {
    errorBox.hidden = true;
    errorBox.textContent = '';
  }

  active.saving = true;
  if (button) {
    button.disabled = true;
    button.textContent = 'Guardando…';
  }

  const closesAt = active.closesAt ? `${active.closesAt}T23:59:59` : null;

  try {
    let assignmentId = active.assignmentId;

    if (active.mode === 'activate') {
      if (!active.versionId) throw new Error('La unidad no tiene una versión publicada.');

      const { data, error } = await supabase
        .from('unit_assignments')
        .insert({
          group_id: active.groupId,
          unit_id: active.unitId,
          unit_version_id: active.versionId,
          status: 'active',
          visible: true,
          opens_at: new Date().toISOString(),
          closes_at: closesAt,
          created_by: state.profile?.id ?? null
        })
        .select('id')
        .single();

      if (error) throw error;
      assignmentId = data.id;
    } else {
      const { error } = await supabase
        .from('unit_assignments')
        .update({ closes_at: closesAt })
        .eq('id', assignmentId);

      if (error) throw error;
    }

    const excluded = active.students.filter((student) => !student.selected);
    if (excluded.length) {
      const rows = excluded.map((student) => ({
        assignment_id: assignmentId,
        student_id: student.id,
        status: 'closed',
        created_by: state.profile?.id ?? null
      }));

      const { error } = await supabase
        .from('student_unit_overrides')
        .upsert(rows, { onConflict: 'assignment_id,student_id' });

      if (error) throw error;
    }

    if (active.mode === 'manage' && selected.length) {
      const { error } = await supabase
        .from('student_unit_overrides')
        .update({ status: 'active' })
        .eq('assignment_id', assignmentId)
        .in('student_id', selected.map((student) => student.id));

      if (error) throw error;
    }

    const count = selected.length;
    closeUnitAssignDialog();
    setNotice(active.mode === 'activate'
      ? `Unidad activada para ${count} ${count === 1 ? 'alumno' : 'alumnos'}.`
      : 'Alumnos de la unidad actualizados.');
    await loadDashboard(state.profile);
  } catch (error) {
    resetButton();
    if (errorBox) {
      errorBox.hidden = false;
      errorBox.textContent = error?.message || 'No se pudo guardar la activación.';
    }
  }
}

function activateUnitCard(button) {
  const [unitId, versionId] = String(button.dataset.activateUnit || '').split(':');
  const groupId = button.dataset.unitGroup
    || button.closest('[data-group-id]')?.dataset.groupId
    || state.subjectsGroupId;

  if (!unitId || !versionId || !groupId || button.disabled) {
    setError('No se pudo identificar la unidad o el grupo.');
    return;
  }

  state.error = '';
  state.notice = '';
  openUnitAssignDialog({ mode: 'activate', unitId, versionId, groupId });
}

function manageUnitAssignment(button) {
  const assignmentId = button.dataset.manageAssignment;
  const groupId = button.dataset.unitGroup;
  if (!assignmentId || button.disabled) return;

  state.error = '';
  state.notice = '';
  openUnitAssignDialog({ mode: 'manage', assignmentId, groupId });
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

/* ---------------- Ficha completa del alumno (ventana emergente) ---------------- */

function fichaCsv(value) {
  return Array.isArray(value) ? value.filter(Boolean).map(careerName).join(', ') : '';
}

function careerName(value) {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object' && value.name) return value.name;
  return '';
}

function careerNames(value) {
  return Array.isArray(value) ? value.map(careerName).filter(Boolean) : [];
}

// Recalcula el score de las carreras con la misma fórmula de especificidad
// que usa el test, para mostrar porcentajes diferenciados incluso con
// resultados guardados antes de la mejora.
function careerDisplayScores(careers) {
  const list = (Array.isArray(careers) ? careers : [])
    .map((career) => ({
      name: typeof career === 'string' ? career : career?.name,
      matches: Array.isArray(career?.matches) ? career.matches.map(String) : []
    }))
    .filter((career) => Boolean(career.name));

  const tagFrequency = {};
  for (const career of careerCatalog) {
    for (const tag of career.tags) {
      tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
    }
  }

  const weighted = list
    .map((career) => ({
      ...career,
      weight: career.matches.reduce((sum, tag) => sum + 1 / (tagFrequency[tag] || 1), 0)
    }))
    .sort((a, b) => b.weight - a.weight || a.name.localeCompare(b.name));

  const maxWeight = weighted[0]?.weight || 1;

  return weighted.map((career) => ({
    name: career.name,
    matches: career.matches,
    score: Math.round((career.weight / maxWeight) * 100)
  }));
}

function fichaJson(value) {
  if (value && typeof value === 'object') return JSON.stringify(value, null, 1);
  return typeof value === 'string' ? value : '';
}

function fichaLoadingMarkup(text) {
  return `<div class="ficha-loading"><span class="spinner" aria-hidden="true"></span><span>${escapeHtml(text)}</span></div>`;
}

function fichaStatMarkup(icon, value, label, tone, key) {
  return `
    <div class="ficha-stat ${escapeHtml(tone || '')}">
      <span class="ficha-stat-icon" aria-hidden="true">${icon}</span>
      <div class="ficha-stat-copy">
        <strong data-ficha-stat="${escapeHtml(key)}">${escapeHtml(value)}</strong>
        <small data-ficha-stat-label="${escapeHtml(key)}">${escapeHtml(label)}</small>
      </div>
    </div>
  `;
}

function scoreRingMarkup(score) {
  const value = Math.max(0, Math.min(100, Math.round(Number(score) || 0)));
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - value / 100);

  return `
    <div class="ficha-ring ${scoreRingClass(value)}" role="img" aria-label="Score general ${value} de 100">
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle class="ring-track" cx="50" cy="50" r="${radius}" />
        <circle class="ring-fill" cx="50" cy="50" r="${radius}" style="--dash:${circumference.toFixed(2)};--offset:${offset.toFixed(2)}" />
      </svg>
      <div class="ficha-ring-center"><strong>${value}</strong><small>/100</small></div>
    </div>
  `;
}

function fichaSubjectProgressMarkup(perSubject) {
  if (!perSubject.length) {
    return '<p class="ficha-empty">Sin avance registrado todavía. Cuando empiece una unidad aparecerá aquí.</p>';
  }

  return `
    <div class="ficha-subject-list">
      ${perSubject.map((item) => {
        const pct = item.total ? Math.round((item.done / item.total) * 100) : 0;
        return `
          <div class="ficha-subject">
            <div class="ficha-subject-head">
              <strong>${escapeHtml(item.subject)}</strong>
              <span>${item.done}/${item.total} · ${pct}%</span>
            </div>
            <div class="ficha-bar" aria-hidden="true">
              <div class="ficha-bar-fill" style="--bar-color:${escapeHtml(item.color || 'var(--brand)')};--bar-scale:${(pct / 100).toFixed(3)}"></div>
            </div>
            <div class="ficha-subject-meta">
              ${item.accuracy != null ? `🎯 ${item.accuracy}% precisión` : 'Sin precisión registrada'}
              · ${item.done === item.total ? 'materia completa' : `${item.total - item.done} por completar`}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function fichaNextStepMarkup(missing) {
  if (!missing) {
    return `
      <article class="ficha-card ficha-focus ficha-focus-done">
        <span class="card-label">Siguiente paso</span>
        <h3>🎉 ¡Al día!</h3>
        <p class="card-sub">No le falta ninguna unidad por empezar. Aprovecha para reforzar las materias con menor precisión.</p>
      </article>
    `;
  }

  return `
    <article class="ficha-card ficha-focus">
      <span class="card-label">Siguiente paso</span>
      <h3>⏭️ ${escapeHtml(missing)}</h3>
      <p class="card-sub">Recomendación: abrir esta unidad en la siguiente sesión y revisar los ejercicios con menor precisión.</p>
      <span class="ficha-focus-chip">Enfoque sugerido</span>
    </article>
  `;
}

function fichaSubjectNameMap(data) {
  return new Map((data.board || []).map((subject) => [subject.id, subject.name]));
}

function fichaUnitsMarkup(data, detail) {
  const units = Array.isArray(detail?.units) ? detail.units : [];
  const subjectNames = fichaSubjectNameMap(data);

  if (!units.length) {
    return '<p class="ficha-empty">Este alumno no tiene unidades asignadas.</p>';
  }

  return `
    <div class="ficha-unit-list">
      ${units.map((unit) => {
        const status = unit.status || 'not_started';
        const tone = status === 'completed' || status === 'mastered' ? 'success' : status === 'in_progress' ? 'pill-blue' : '';
        return `
          <div class="ficha-unit-row">
            <div class="ficha-unit-main">
              <strong>${escapeHtml(unit.unit || 'Unidad')}</strong>
              <small>${escapeHtml(subjectNames.get(unit.subject) || 'Materia')} · ${unit.attempts || 0} intentos${unit.accuracy != null ? ` · 🎯 ${Math.round(unit.accuracy)}%` : ''}</small>
            </div>
            <span class="pill ${tone}">${escapeHtml(progressLabels[status] || status)}</span>
            <small class="ficha-unit-when">${unit.last ? escapeHtml(formatRelative(unit.last)) : 'Sin actividad'}</small>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function fichaActivityMarkup(data, student, detail) {
  const detailRecent = Array.isArray(detail?.recent) ? detail.recent : [];
  const overviewRecent = (data.overview?.recent || [])
    .filter((item) => item.student === student.student_code)
    .map((item) => ({
      ts: item.ts,
      kind: item.kind === 'completed' ? 'unidad' : 'ejercicio',
      text: item.text,
      ok: item.ok
    }));

  const merged = [...detailRecent, ...overviewRecent]
    .filter((item) => item.ts)
    .sort((a, b) => new Date(b.ts) - new Date(a.ts))
    .slice(0, 10);

  if (!merged.length) {
    return '<p class="ficha-empty">Sin actividad registrada todavía.</p>';
  }

  return `
    <div class="ficha-timeline">
      ${merged.map((item) => {
        const emoji = item.kind === 'quiz' ? '🧠' : item.kind === 'unidad' ? '📚' : '✏️';
        return `
          <div class="ficha-timeline-item">
            <span class="ficha-timeline-dot ${item.ok ? 'ok' : 'bad'}" aria-hidden="true">${item.ok ? '✓' : '✗'}</span>
            <div class="ficha-timeline-copy">
              <strong>${escapeHtml(item.text)}</strong>
              <small>${escapeHtml(formatRelative(item.ts))}</small>
            </div>
            <span class="ficha-timeline-emoji" aria-hidden="true">${emoji}</span>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function fichaTagGroupMarkup(label, values) {
  const list = Array.isArray(values) ? values.map(careerName).filter(Boolean) : [];
  if (!list.length) return '';

  return `
    <div class="ficha-tag-group">
      <span class="card-label">${escapeHtml(label)}</span>
      <div class="ficha-tags">
        ${list.map((value) => `<span class="ficha-tag">${escapeHtml(value)}</span>`).join('')}
      </div>
    </div>
  `;
}

function fichaTestResultsMarkup(profile) {
  const personality = profile.personality && typeof profile.personality === 'object' ? profile.personality : null;
  const vocational = profile.aptitude && typeof profile.aptitude === 'object' ? profile.aptitude : null;
  const personalityDone = Boolean(personality?.completed_at);
  const vocationalDone = Boolean(vocational?.completed_at);
  const scores = personality?.scores || {};
  const careers = Array.isArray(vocational?.career_suggestions) ? vocational.career_suggestions : [];
  const interests = Array.isArray(vocational?.interests) ? vocational.interests : [];

  return `
    <div class="ficha-test-results">
      <article class="ficha-card">
        <div class="ficha-card-head">
          <div>
            <h3>🧠 Test de personalidad</h3>
            <p class="card-sub">${personalityDone ? `Respondido ${escapeHtml(formatRelative(personality.completed_at))}` : 'El alumno todavía no ha respondido este test.'}</p>
          </div>
          <span class="pill ${personalityDone ? 'success' : ''}">${personalityDone ? 'Completado' : 'Pendiente'}</span>
        </div>
        ${personalityDone ? `
          <div class="test-score-list">
            ${Object.entries(personalityDimensionLabels).map(([key, meta]) => {
              const value = Number(scores[key] ?? 0);
              return `
                <div class="test-score">
                  <div class="test-score-head">
                    <span>${meta.emoji} ${escapeHtml(meta.label)}</span>
                    <strong>${value}%</strong>
                  </div>
                  <div class="ficha-bar" aria-hidden="true">
                    <div class="ficha-bar-fill" style="--bar-color:${value >= 70 ? 'var(--good)' : value >= 40 ? 'var(--brand)' : 'var(--amber)'};--bar-scale:${(Math.max(0, Math.min(100, value)) / 100).toFixed(3)}"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        ` : '<p class="ficha-empty">Cuando lo complete, aquí verás sus rasgos principales.</p>'}
      </article>

      <article class="ficha-card">
        <div class="ficha-card-head">
          <div>
            <h3>🧭 Orientación vocacional</h3>
            <p class="card-sub">${vocationalDone ? `Respondido ${escapeHtml(formatRelative(vocational.completed_at))}` : 'El alumno todavía no ha respondido este test.'}</p>
          </div>
          <span class="pill ${vocationalDone ? 'success' : ''}">${vocationalDone ? 'Completado' : 'Pendiente'}</span>
        </div>
        ${vocationalDone ? `
          ${careers.length ? `
            <div class="test-career-results">
              ${careerDisplayScores(careers).slice(0, 6).map((career) => `
                  <div class="test-career-row">
                    <div>
                      <strong>${escapeHtml(career.name)}</strong>
                      <small>${career.matches.map((tag) => escapeHtml(tag)).join(' · ') || 'Coincide con su perfil'}</small>
                    </div>
                    <div class="test-career-score">
                      <div class="ficha-bar" aria-hidden="true">
                        <div class="ficha-bar-fill" style="--bar-color:var(--brand-2);--bar-scale:${(Math.max(0, Math.min(100, career.score)) / 100).toFixed(3)}"></div>
                      </div>
                      <strong>${career.score}%</strong>
                    </div>
                  </div>
                `).join('')}
            </div>
          ` : ''}
          ${interests.length ? `
            <div class="test-summary-block">
              <span class="card-label">Intereses detectados</span>
              <div class="ficha-tags">${interests.slice(0, 12).map((item) => `<span class="ficha-tag">${escapeHtml(item)}</span>`).join('')}</div>
            </div>
          ` : ''}
        ` : '<p class="ficha-empty">Cuando lo complete, aquí verás sus intereses y carreras sugeridas.</p>'}
      </article>
    </div>
  `;
}

function fichaProfilePanelMarkup(student, profile) {
  const tagGroups = [
    ['Carreras sugeridas', profile.career_suggestions],
    ['Intereses', profile.interests],
    ['Aptitudes', profile.aptitudes],
    ['Fortalezas', profile.strengths],
    ['Áreas a trabajar', profile.weaknesses]
  ].map(([label, values]) => fichaTagGroupMarkup(label, values)).filter(Boolean).join('');

  return `
    <div class="ficha-profile-summary">
      <div class="ficha-profile-career">
        <span class="card-label">Meta vocacional</span>
        <h3>${escapeHtml(profile.career_choice || 'Aún sin definir')}</h3>
        <p class="card-sub">${profile.career_choice ? 'Carrera objetivo registrada para orientar su ruta.' : 'Define la carrera que quiere estudiar para personalizar el acompañamiento.'}</p>
      </div>
      ${tagGroups ? `<div class="ficha-tag-groups">${tagGroups}</div>` : '<p class="ficha-empty">Todavía no hay intereses ni aptitudes registradas.</p>'}
    </div>

    ${fichaTestResultsMarkup(profile)}

    <form class="form ficha-profile-form" data-save-profile="${escapeHtml(student.id)}">
      <div class="ficha-form-grid">
        <label class="field"><span>Carrera que quiere</span><input name="career_choice" value="${escapeHtml(profile.career_choice || '')}" placeholder="ej. Medicina"></label>
        <label class="field"><span>Áreas a trabajar (separadas por coma)</span><input name="weaknesses" value="${escapeHtml(fichaCsv(profile.weaknesses))}" placeholder="organización, ansiedad…"></label>
        <label class="field wide"><span>Notas de orientación vocacional</span><textarea name="vocational_notes" placeholder="Acuerdos, seguimiento y observaciones de orientación…">${escapeHtml(profile.vocational_notes || '')}</textarea></label>
      </div>
      <p class="hint">🔒 Carreras sugeridas, intereses, aptitudes y fortalezas salen de los tests del alumno; no se editan a mano.</p>
      <div class="ficha-form-actions">
        <button class="btn primary" type="submit">Guardar perfil profesional</button>
      </div>
    </form>
  `;
}

function fichaObservationsPanelMarkup(student) {
  return `
    <div class="ficha-observations-layout">
      <article class="ficha-card">
        <div class="ficha-card-head">
          <div><h3>✍️ Nueva observación</h3><p class="card-sub">Registra acuerdos, avances o situaciones a dar seguimiento.</p></div>
        </div>
        <form class="form" data-add-observation="${escapeHtml(student.id)}">
          <div class="ficha-form-grid">
            <label class="field">
              <span>Categoría</span>
              <select name="category">
                <option value="">General</option>
                <option value="académico">Académico</option>
                <option value="conducta">Conducta</option>
                <option value="emocional">Emocional</option>
                <option value="vocacional">Vocacional</option>
                <option value="asistencia">Asistencia</option>
              </select>
            </label>
            <label class="field">
              <span>Visible para</span>
              <select name="visibility">
                <option value="internal">Solo personal</option>
                <option value="family">Personal y tutor</option>
              </select>
            </label>
            <label class="field wide"><span>Observación</span><textarea name="body" required placeholder="Escribe la observación…"></textarea></label>
          </div>
          <div class="ficha-form-actions">
            <button class="btn primary" type="submit">Agregar observación</button>
          </div>
        </form>
      </article>

      <article class="ficha-card">
        <div class="ficha-card-head">
          <div><h3>📝 Historial</h3><p class="card-sub">Observaciones internas y compartidas con el tutor.</p></div>
        </div>
        <div data-observations-list="${escapeHtml(student.id)}">${fichaLoadingMarkup('Cargando observaciones…')}</div>
      </article>
    </div>
  `;
}

function studentFichaMarkup(data, student, detail = null) {
  const profile = data.studentProfiles?.get(student.id) || {};
  const perSubject = subjectProgressForStudent(data, student.student_code);
  const missing = nextUnitMissing(data, student.student_code);
  const scoreRow = (data.overview?.scores?.students || []).find((item) => item.code === student.student_code) || {};
  const stats = detail?.stats || {};
  const score = Number(scoreRow.score ?? 0);
  const xp = Number(stats.xp ?? scoreRow.xp ?? student.stats?.xp_total ?? 0);
  const streak = Number(stats.streak ?? student.stats?.current_streak ?? 0);
  const bestStreak = Number(stats.best ?? student.stats?.best_streak ?? 0);
  const unitsDone = Number(stats.units ?? scoreRow.units_done ?? student.stats?.units_completed ?? 0);
  const unitsTotal = Number(scoreRow.units_total ?? data.overview?.published_units_total ?? 0);
  const accuracy = stats.accuracy ?? scoreRow.accuracy ?? null;
  const absences = Number(scoreRow.absences ?? 0);
  const last = stats.last || student.stats?.last_activity_date || null;
  const initial = (student.full_name || 'A').trim().slice(0, 1).toUpperCase();
  const status = student.status || 'active';
  const statusLabel = status === 'active' ? 'Activa' : status === 'inactive' ? 'Inactiva' : status;

  return `
    <div class="ficha-overlay" data-ficha-overlay>
      <section class="ficha-dialog" role="dialog" aria-modal="true" aria-labelledby="ficha-title" data-ficha-dialog="${escapeHtml(student.id)}" data-detail-loaded="${detail ? '1' : '0'}">
        <button type="button" class="ficha-close" data-ficha-close aria-label="Cerrar ficha">✕</button>

        <header class="ficha-hero">
          <div class="ficha-hero-main">
            <div class="ficha-avatar" aria-hidden="true">${escapeHtml(initial)}</div>
            <div class="ficha-identity">
              <span class="ficha-eyebrow">Ficha del alumno</span>
              <h2 id="ficha-title">${escapeHtml(student.full_name || 'Alumno sin nombre')}</h2>
              <div class="ficha-meta">
                <span class="ficha-chip">🎓 ${escapeHtml(student.student_code || '—')}</span>
                <span class="ficha-chip">👥 ${escapeHtml(student.group_name || 'Sin grupo')}</span>
                <span class="ficha-chip ${status === 'active' ? 'success' : ''}">${escapeHtml(statusLabel)}</span>
              </div>
            </div>
          </div>
          <div class="ficha-score">
            ${scoreRingMarkup(score)}
            <span>Score general</span>
            <small data-ficha-last>${last ? `Última actividad ${escapeHtml(formatRelative(last))}` : 'Sin actividad registrada'}</small>
          </div>
        </header>

        <div class="ficha-stat-grid">
          ${fichaStatMarkup('⚡', xp.toLocaleString('es-MX'), 'XP acumulados', 'violet', 'xp')}
          ${fichaStatMarkup('🔥', streak, bestStreak ? `Racha actual · récord ${bestStreak}` : 'Racha actual', 'amber', 'streak')}
          ${fichaStatMarkup('📚', unitsTotal ? `${unitsDone}/${unitsTotal}` : unitsDone, 'Unidades completadas', 'blue', 'units')}
          ${fichaStatMarkup('🎯', accuracy != null ? `${Math.round(accuracy)}%` : '—', 'Precisión en ejercicios', 'green', 'accuracy')}
          ${fichaStatMarkup('🗓️', absences, 'Faltas registradas', absences ? 'red' : 'green', 'absences')}
        </div>

        <nav class="ficha-tabs" role="tablist" aria-label="Secciones de la ficha">
          <button type="button" class="ficha-tab active" data-ficha-tab="resumen" role="tab" aria-selected="true" aria-controls="ficha-panel-resumen">📊 Avance</button>
          <button type="button" class="ficha-tab" data-ficha-tab="perfil" role="tab" aria-selected="false" aria-controls="ficha-panel-perfil">🧭 Perfil profesional</button>
          <button type="button" class="ficha-tab" data-ficha-tab="observaciones" role="tab" aria-selected="false" aria-controls="ficha-panel-observaciones">📝 Observaciones</button>
        </nav>

        <div class="ficha-body">
          <section class="ficha-panel" data-ficha-panel="resumen" id="ficha-panel-resumen" role="tabpanel">
            <div class="ficha-overview-grid">
              <article class="ficha-card">
                <div class="ficha-card-head">
                  <div><h3>📚 Cómo va por materia</h3><p class="card-sub">Avance sobre las unidades publicadas de cada materia.</p></div>
                </div>
                ${fichaSubjectProgressMarkup(perSubject)}
              </article>

              ${fichaNextStepMarkup(missing)}

              <article class="ficha-card ficha-span-2">
                <div class="ficha-card-head">
                  <div><h3>🧩 Unidades asignadas</h3><p class="card-sub">Estatus, intentos y precisión por unidad.</p></div>
                </div>
                <div data-ficha-units>${detail ? fichaUnitsMarkup(data, detail) : fichaLoadingMarkup('Cargando unidades…')}</div>
              </article>

              <article class="ficha-card ficha-span-2">
                <div class="ficha-card-head">
                  <div><h3>🕒 Actividad reciente</h3><p class="card-sub">Últimos ejercicios y quizzes registrados.</p></div>
                </div>
                <div data-ficha-activity>${detail ? fichaActivityMarkup(data, student, detail) : fichaLoadingMarkup('Cargando actividad…')}</div>
              </article>
            </div>
          </section>

          <section class="ficha-panel hidden" data-ficha-panel="perfil" id="ficha-panel-perfil" role="tabpanel">
            <div data-ficha-profile-panel>${fichaProfilePanelMarkup(student, profile)}</div>
          </section>

          <section class="ficha-panel hidden" data-ficha-panel="observaciones" id="ficha-panel-observaciones" role="tabpanel">
            ${fichaObservationsPanelMarkup(student)}
          </section>
        </div>
      </section>
    </div>
  `;
}

function showFichaToast(message, kind = 'ok') {
  const dialog = document.querySelector('.ficha-dialog');
  if (!dialog) {
    if (kind === 'error') setError(message);
    else setNotice(message);
    return;
  }

  let toast = document.querySelector('[data-ficha-toast]');
  if (!toast) {
    toast = document.createElement('div');
    toast.dataset.fichaToast = '';
    document.body.appendChild(toast);
  }

  toast.className = `ficha-toast ${kind}`;
  toast.textContent = message;
  clearTimeout(toast._hideTimer);
  toast._hideTimer = setTimeout(() => toast.remove(), 4200);
}

function bindFichaProfileForm(studentId, scope = document) {
  const form = scope.querySelector(`[data-save-profile="${studentId}"]`);
  if (form) form.addEventListener('submit', (event) => saveStudentProfile(event, studentId));
}

function bindFichaEvents(studentId) {
  const overlay = document.querySelector('[data-ficha-overlay]');
  if (!overlay) return;

  const close = () => closeStudentFicha();

  overlay.querySelectorAll('[data-ficha-close]').forEach((button) => {
    button.addEventListener('click', close);
  });

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) close();
  });

  overlay.querySelectorAll('[data-ficha-tab]').forEach((button) => {
    button.addEventListener('click', () => {
      const tab = button.dataset.fichaTab;
      overlay.querySelectorAll('[data-ficha-tab]').forEach((item) => {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-selected', String(active));
      });
      overlay.querySelectorAll('[data-ficha-panel]').forEach((panel) => {
        panel.classList.toggle('hidden', panel.dataset.fichaPanel !== tab);
      });
    });
  });

  bindFichaProfileForm(studentId, overlay);

  const observationForm = overlay.querySelector(`[data-add-observation="${studentId}"]`);
  if (observationForm) observationForm.addEventListener('submit', (event) => addObservation(event, studentId));

  state.fichaEscHandler = trapDialogFocus(overlay, close);

  loadObservations(studentId);
}

function closeStudentFicha({ silent = false } = {}) {
  const overlay = document.querySelector('[data-ficha-overlay]');
  if (overlay) overlay.remove();
  document.querySelectorAll('[data-ficha-toast]').forEach((toast) => toast.remove());

  document.body.classList.remove('ficha-open');

  if (state.fichaEscHandler) {
    // El helper ya devuelve el foco al disparador; no lo duplicamos aquí.
    state.fichaEscHandler();
    state.fichaEscHandler = null;
  }

  const trigger = state.fichaTrigger;
  state.fichaStudentId = null;
  state.fichaTrigger = null;

  if (!silent && trigger?.isConnected) trigger.focus();
}

function openStudentFicha(studentId, button = null) {
  const data = state.dashboard;
  const student = (data?.students || []).find((item) => item.id === studentId);
  if (!student) return;

  closeStudentFicha({ silent: true });
  state.fichaStudentId = studentId;
  state.fichaTrigger = button;

  document.body.insertAdjacentHTML('beforeend', studentFichaMarkup(data, student));
  document.body.classList.add('ficha-open');

  bindFichaEvents(studentId);
  loadFichaDetail(studentId);

  requestAnimationFrame(() => {
    document.querySelector('[data-ficha-close]')?.focus();
  });
}

function applyStudentDetail(data, student, detail) {
  const dialog = [...document.querySelectorAll('[data-ficha-dialog]')]
    .find((item) => item.dataset.fichaDialog === student.id);
  if (!dialog) return;

  const stats = detail?.stats || {};
  const scoreRow = (data.overview?.scores?.students || []).find((item) => item.code === student.student_code) || {};
  const unitsTotal = Number(scoreRow.units_total ?? data.overview?.published_units_total ?? 0);

  const setStat = (key, value) => {
    const element = dialog.querySelector(`[data-ficha-stat="${key}"]`);
    if (element) element.textContent = value;
  };
  const setStatLabel = (key, value) => {
    const element = dialog.querySelector(`[data-ficha-stat-label="${key}"]`);
    if (element) element.textContent = value;
  };

  setStat('xp', Number(stats.xp ?? scoreRow.xp ?? 0).toLocaleString('es-MX'));
  setStat('streak', String(stats.streak ?? 0));
  if (stats.best != null) setStatLabel('streak', `Racha actual · récord ${stats.best}`);
  setStat('units', unitsTotal ? `${stats.units ?? 0}/${unitsTotal}` : String(stats.units ?? 0));
  setStat('accuracy', stats.accuracy != null ? `${Math.round(stats.accuracy)}%` : '—');

  const last = dialog.querySelector('[data-ficha-last]');
  if (last) {
    last.textContent = stats.last ? `Última actividad ${formatRelative(stats.last)}` : 'Sin actividad registrada';
  }

  const unitsBox = dialog.querySelector('[data-ficha-units]');
  if (unitsBox) unitsBox.innerHTML = fichaUnitsMarkup(data, detail);

  const activityBox = dialog.querySelector('[data-ficha-activity]');
  if (activityBox) activityBox.innerHTML = fichaActivityMarkup(data, student, detail);

  dialog.dataset.detailLoaded = '1';
}

async function loadFichaDetail(studentId) {
  const { data, error } = await supabase.rpc('app_student_detail', { p_student_id: studentId });

  const dialog = [...document.querySelectorAll('[data-ficha-dialog]')]
    .find((item) => item.dataset.fichaDialog === studentId);
  if (!dialog) return;

  if (error || !data) {
    const message = `No se pudo cargar el detalle: ${error?.message || 'error'}`;
    const unitsBox = dialog.querySelector('[data-ficha-units]');
    const activityBox = dialog.querySelector('[data-ficha-activity]');
    if (unitsBox) unitsBox.innerHTML = `<p class="ficha-empty">${escapeHtml(message)}</p>`;
    if (activityBox) activityBox.innerHTML = `<p class="ficha-empty">${escapeHtml(message)}</p>`;
    return;
  }

  const student = (state.dashboard?.students || []).find((item) => item.id === studentId);
  if (!student) return;

  applyStudentDetail(state.dashboard, student, data);
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
    weaknesses: split(data.get('weaknesses')),
    vocational_notes: String(data.get('vocational_notes') || '').trim() || null,
    updated_at: new Date().toISOString()
  };

  // Los campos derivados de los tests (carreras sugeridas, intereses,
  // aptitudes, fortalezas) solo se incluyen si el formulario los expone,
  // para no borrar resultados guardados por los tests del alumno.
  if (data.has('career_suggestions')) payload.career_suggestions = split(data.get('career_suggestions'));
  if (data.has('interests')) payload.interests = split(data.get('interests'));
  if (data.has('aptitudes')) payload.aptitudes = split(data.get('aptitudes'));
  if (data.has('strengths')) payload.strengths = split(data.get('strengths'));

  // Los tests se guardan con app_save_student_test. Solo incluirlos si el
  // formulario los expone para no borrar resultados ya guardados.
  if (data.has('personality')) payload.personality = parseJson(data.get('personality'));
  if (data.has('aptitude')) payload.aptitude = parseJson(data.get('aptitude'));

  state.error = '';
  state.notice = '';

  const submitButton = form.querySelector('button[type="submit"]');
  if (submitButton) submitButton.disabled = true;

  const { error } = await supabase.from('student_profiles').upsert(payload, { onConflict: 'student_id' });

  if (submitButton) submitButton.disabled = false;

  if (error) {
    showFichaToast(error?.message || 'No se pudo guardar el perfil profesional.', 'error');
    return;
  }

  if (state.dashboard?.studentProfiles) {
    const previous = state.dashboard.studentProfiles.get(studentId) || {};
    state.dashboard.studentProfiles.set(studentId, { ...previous, ...payload });
  }

  const panel = document.querySelector('[data-ficha-profile-panel]');
  const student = (state.dashboard?.students || []).find((item) => item.id === studentId);
  if (panel && student && state.dashboard?.studentProfiles) {
    panel.innerHTML = fichaProfilePanelMarkup(student, state.dashboard.studentProfiles.get(studentId) || {});
    bindFichaProfileForm(studentId, panel);
  }

  showFichaToast('Perfil profesional guardado.', 'ok');
}

async function loadObservations(studentId) {
  const list = document.querySelector(`[data-observations-list="${studentId}"]`);
  if (!list) return;

  const { data, error } = await supabase
    .from('observations')
    .select('id,category,body,visibility,created_at,author_id')
    .eq('student_id', studentId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error || !data?.length) {
    list.innerHTML = error
      ? `<p class="ficha-empty">No se pudieron cargar las observaciones: ${escapeHtml(error.message || 'error')}</p>`
      : '<p class="ficha-empty">Sin observaciones todavía. La primera que registres aparecerá aquí.</p>';
    return;
  }

  list.innerHTML = `
    <div class="ficha-observation-list">
      ${data.map((item) => `
        <article class="ficha-observation">
          <div class="ficha-observation-head">
            <span class="ficha-chip">${escapeHtml(item.category || 'General')}</span>
            <span class="ficha-chip ${item.visibility === 'family' ? 'success' : ''}">${item.visibility === 'family' ? '👨‍👩‍👧 Tutor' : '🔒 Interno'}</span>
            <small>${escapeHtml(formatRelative(item.created_at))}</small>
          </div>
          <p>${escapeHtml(item.body)}</p>
        </article>
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
    showFichaToast(error?.message || 'No se pudo guardar la observación.', 'error');
    if (submitButton) submitButton.disabled = false;
    return;
  }

  form.reset();
  if (submitButton) submitButton.disabled = false;
  await loadObservations(studentId);
  showFichaToast('Observación guardada.', 'ok');
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
  closeStudentFicha({ silent: true });
  closeTestModal({ silent: true });
  closeUnitAssignDialog();
  closePayDialog();
  appRoot.innerHTML = dashboardMarkup(state.profile);

  appRoot.querySelector('#logout-btn').addEventListener('click', signOut);

  appRoot.querySelectorAll('[data-open-unit]').forEach((button) => {
    button.addEventListener('click', () => openUnit(button.dataset.openUnit));
  });

  appRoot.querySelectorAll('[data-consent-ack]').forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      appRoot.querySelectorAll('[data-consent-student]').forEach((button) => {
        button.disabled = !checkbox.checked;
      });
    });
  });

  appRoot.querySelectorAll('[data-consent-student]').forEach((button) => {
    button.addEventListener('click', () => acceptConsent(button.dataset.consentStudent, button));
  });

  appRoot.querySelectorAll('[data-revoke-consent]').forEach((button) => {
    button.addEventListener('click', () => {
      revokeConsent(button.dataset.revokeConsent, button.dataset.revokeName || '', button);
    });
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

  appRoot.querySelectorAll('[data-pagination]').forEach((button) => {
    button.addEventListener('click', () => {
      const page = Number(button.dataset.page);
      if (!Number.isFinite(page) || page < 1) return;
      if (button.dataset.pagination === 'payments') state.paymentsPage = page;
      renderDashboard();
      appRoot.querySelector('[data-pagination]')?.scrollIntoView({ block: 'nearest' });
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

  appRoot.querySelectorAll('[data-invite-student-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      const select = form.querySelector('[data-invite-groups]');
      const groupId = select?.value || form.dataset.inviteGroupDefault || '';
      issueStudentLinkToken(event, groupId);
    });
  });

  appRoot.querySelectorAll('[data-copy-invitation]').forEach((button) => {
    button.addEventListener('click', async () => {
      const input = button.closest('[data-student-invitation]')?.querySelector('[data-invitation-url]');
      if (!input) return;

      try {
        await navigator.clipboard.writeText(input.value);
        button.textContent = 'Copiado ✓';
        setTimeout(() => {
          button.textContent = 'Copiar enlace';
        }, 2000);
      } catch {
        input.select();
        button.textContent = 'Copia manual';
      }
    });
  });

  appRoot.querySelectorAll('[data-dismiss-invitation]').forEach((button) => {
    button.addEventListener('click', () => {
      state.studentInvitation = null;
      renderDashboard();
    });
  });

  appRoot.querySelectorAll('[data-reset-student]').forEach((button) => {
    button.addEventListener('click', () => resetStudentPassword(button.dataset.resetStudent, button));
  });

  appRoot.querySelectorAll('[data-reissue-invite]').forEach((button) => {
    button.addEventListener('click', () => reissueStudentInvitation(button.dataset.reissueInvite, button));
  });

  appRoot.querySelectorAll('[data-toggle-user]').forEach((button) => {
    button.addEventListener('click', () => toggleUserActive(button));
  });

  appRoot.querySelectorAll('[data-ban-account]').forEach((button) => {
    button.addEventListener('click', () => banExternalAccount(button));
  });

  appRoot.querySelectorAll('[data-save-setting]').forEach((button) => {
    button.addEventListener('click', () => saveSetting(button.dataset.saveSetting, button));
  });

  appRoot.querySelectorAll('[data-resolve-request]').forEach((button) => {
    button.addEventListener('click', () => resolveDataRequest(button));
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
    button.addEventListener('click', () => openStudentFicha(button.dataset.studentDetail, button));
  });

  appRoot.querySelectorAll('[data-start-test]').forEach((button) => {
    button.addEventListener('click', () => startStudentTest(button.dataset.startTest));
  });

  appRoot.querySelectorAll('[data-activate-unit]').forEach((button) => {
    button.addEventListener('click', () => activateUnitCard(button));
  });

  appRoot.querySelectorAll('[data-manage-assignment]').forEach((button) => {
    button.addEventListener('click', () => manageUnitAssignment(button));
  });

  appRoot.querySelectorAll('[data-open-pay-dialog]').forEach((button) => {
    button.addEventListener('click', () => openPayDialog(button.dataset.openPayDialog, button.dataset.payMode || 'payment'));
  });

  appRoot.querySelectorAll('[data-void-payment]').forEach((button) => {
    button.addEventListener('click', () => voidPayment(button));
  });

  appRoot.querySelectorAll('[data-receipt-payment]').forEach((button) => {
    button.addEventListener('click', () => downloadPaymentReceipt(button.dataset.receiptPayment));
  });

  const subjectsGroupSelect = appRoot.querySelector('[data-subjects-group]');
  if (subjectsGroupSelect) {
    subjectsGroupSelect.addEventListener('change', () => {
      state.subjectsGroupId = subjectsGroupSelect.value;
      renderDashboard();
    });
  }

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

  if (
    !fullName ||
    !email ||
    password.length < 12 ||
    !/[a-z]/.test(password) ||
    !/[A-Z]/.test(password) ||
    !/\d/.test(password)
  ) {
    setError('Completa los datos: nombre, correo y contraseña de al menos 12 caracteres con mayúscula, minúscula y número.');
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

async function banExternalAccount(button) {
  const userId = button.dataset.banAccount;
  const ban = button.dataset.ban === '1';

  if (!userId || button.disabled) return;

  const email = button.closest('li')?.querySelector('strong')?.textContent || 'la cuenta';

  if (!window.confirm(
    ban
      ? `¿Bloquear ${email}? No podrá iniciar sesión con esa cuenta.`
      : `¿Desbloquear ${email}? Volverá a poder iniciar sesión (seguirá sin ver contenido hasta que se vincule).`
  )) return;

  state.error = '';
  state.notice = '';
  button.disabled = true;

  try {
    const { data: result, error } = await supabase.rpc('app_ban_account', {
      p_user_id: userId,
      p_ban: ban
    });

    if (error) throw error;
    if (!result?.ok) throw new Error(result?.error || 'No se pudo actualizar la cuenta');

    setNotice(`Cuenta ${email} ${ban ? 'bloqueada' : 'desbloqueada'}.`);
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

  if (!fullName) {
    setError('Escribe el nombre completo del alumno.');
    return;
  }

  if (
    password.length < 12 ||
    !/[a-z]/.test(password) ||
    !/[A-Z]/.test(password) ||
    !/\d/.test(password)
  ) {
    setError('Completa los datos: nombre y contraseña temporal (12+ caracteres, con mayúscula, minúscula y número). El usuario se genera del nombre si lo dejas vacío.');
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
    const resultBox = form.querySelector('[data-create-result]');
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

function buildRedeemUrl(token) {
  const url = new URL(window.location.href);
  url.search = '';
  url.hash = '';
  url.searchParams.set('link_token', token);
  return url.toString();
}

function invitationExpiryLabel(value) {
  const date = new Date(value || '');
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' });
}

async function issueStudentLinkToken(event, groupId) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);

  const fullName = String(data.get('full_name') || '').trim();
  const username = String(data.get('username') || '').trim().toLowerCase();
  const studentCode = String(data.get('student_code') || '').trim().toUpperCase();

  if (!groupId) {
    setError('Selecciona un grupo para el alumno.');
    return;
  }

  if (!fullName) {
    setError('Escribe el nombre completo del alumno.');
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = 'Generando…';
  }

  state.error = '';
  state.notice = '';
  state.studentInvitation = null;

  try {
    const { data: result, error } = await supabase.functions.invoke('issue-student-link-token', {
      body: {
        full_name: fullName,
        username: username || null,
        group_id: groupId,
        student_code: studentCode || null
      }
    });

    if (error) throw error;
    if (!result?.ok) throw new Error(result?.error || 'No se pudo generar la invitación');

    const token = result.invitation?.token;
    if (!token) throw new Error('La invitación llegó sin token.');

    const redeemUrl = buildRedeemUrl(token);

    state.studentInvitation = {
      fullName,
      username: result.access?.username || '',
      studentCode: result.student?.student_code || studentCode || '',
      redeemUrl,
      expiresAtLabel: invitationExpiryLabel(result.invitation?.expires_at)
    };

    setNotice(`Invitación generada para ${fullName}. Comparte el enlace; vence en 72 h.`);
    await loadDashboard(state.profile);
  } catch (error) {
    setError(await functionErrorMessage(error, 'No se pudo generar la invitación.'));
    renderDashboard();
  }
}

async function reissueStudentInvitation(studentId, button) {
  if (!studentId || button.disabled) return;

  state.error = '';
  state.notice = '';
  button.disabled = true;
  button.textContent = 'Generando…';

  try {
    const { data: result, error } = await supabase.functions.invoke('issue-student-link-token', {
      body: { student_id: studentId }
    });

    if (error) throw error;
    if (!result?.ok) throw new Error(result?.error || 'No se pudo generar el enlace');

    const token = result.invitation?.token;
    if (!token) throw new Error('La invitación llegó sin token.');

    const redeemUrl = buildRedeemUrl(token);
    const fullName = result.access?.full_name || button.dataset.studentName || 'el alumno';
    const username = result.access?.username || '';

    state.studentInvitation = {
      fullName,
      username,
      studentCode: result.student?.student_code || '',
      redeemUrl,
      expiresAtLabel: invitationExpiryLabel(result.invitation?.expires_at)
    };

    state.staffTab = 'alumnos';
    setNotice(`Enlace de acceso generado para ${fullName}. Compártelo; vence en 72 h.`);
    await loadDashboard(state.profile);
  } catch (error) {
    setError(await functionErrorMessage(error, 'No se pudo generar el enlace de acceso.'));
    button.disabled = false;
    button.textContent = 'Enlace de acceso';
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
        <span class="card-label">Invitación enviada · ${escapeHtml(fullName)}</span>
        <p>${escapeHtml(result.message || `Correo encolado para ${result.email || 'el tutor'}.`)}</p>
        <p class="hint">El enlace de acceso viaja en el correo, no en esta pantalla ni en un chat. Si caduca, vuelve a generarlo con el mismo botón.</p>
      `;
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

  const acknowledged = Boolean(appRoot.querySelector('[data-consent-ack]')?.checked);
  if (!acknowledged) {
    setError('Marca la casilla “He leído y entiendo” antes de aceptar el aviso de privacidad.');
    return;
  }

  state.error = '';
  state.notice = '';
  button.disabled = true;
  button.textContent = 'Enviando…';

  const documentVersion = state.dashboard?.privacy?.version || PRIVACY_DOCUMENT_VERSION;

  try {
    const { data, error } = await supabase.functions.invoke('guardian-consent', {
      body: {
        student_id: studentId,
        document_version: documentVersion,
        accepted: true,
        acknowledged: true
      }
    });

    if (error) throw error;
    if (data?.status !== 'accepted') {
      throw new Error(data?.error || 'No se pudo registrar el consentimiento');
    }

    state.notice = 'Consentimiento registrado. Gracias por confiar en nosotros.';
    await loadDashboard(state.profile);
  } catch (error) {
    setError(await functionErrorMessage(error, 'No se pudo registrar el consentimiento. Revisa la conexión e intenta de nuevo.'));
    button.disabled = false;
    button.textContent = 'Aceptar y ver datos';
  }
}

async function revokeConsent(studentId, name, button) {
  if (!studentId || button.disabled) return;

  const label = name ? `a ${name}` : 'a este alumno';
  const confirmed = typeof window.confirm === 'function'
    ? window.confirm(`¿Revocar el consentimiento ${label}? Dejarás de ver su información hasta que vuelvas a aceptar el aviso de privacidad.`)
    : false;

  if (!confirmed) return;

  state.error = '';
  state.notice = '';
  button.disabled = true;
  button.textContent = 'Revocando…';

  try {
    const { data, error } = await supabase.functions.invoke('guardian-consent', {
      body: {
        student_id: studentId,
        revoke: true,
        confirm: true
      }
    });

    if (error) throw error;
    if (data?.status !== 'revoked') {
      throw new Error(data?.error || 'No se pudo revocar el consentimiento');
    }

    state.notice = 'Consentimiento revocado. La información del alumno ya no se muestra.';
    await loadDashboard(state.profile);
  } catch (error) {
    setError(await functionErrorMessage(error, 'No se pudo revocar el consentimiento. Intenta de nuevo.'));
    button.disabled = false;
    button.textContent = 'Revocar consentimiento';
  }
}

async function signOut() {
  await supabase.auth.signOut();
  clearLocalSessionData();
  applyTheme();
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

  // SEC-02: enlace de invitación de alumno. Se atiende antes de restaurar
  // cualquier sesión para no mezclar el panel del staff con el canje.
  const incomingLinkToken = new URLSearchParams(window.location.search).get('link_token');
  if (incomingLinkToken) {
    supabase.auth.signOut().catch(() => {});
    renderLinkRedemption(incomingLinkToken);
    return;
  }

  renderLoading();

  // PRIV-06: delegación global porque el pie de privacidad aparece en varias
  // vistas (login, panel, auditoría y cambio de contraseña).
  document.addEventListener('click', (event) => {
    if (event.target.closest('#data-request-btn')) openDataRequest();
  });

  supabase.auth.getSession().then(({ data }) => {
    if (data.session) handleSession(data.session);
    else renderLogin();
  });

  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') {
      clearLocalSessionData();
      applyTheme();
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

    if (event === 'PASSWORD_RECOVERY' && session) {
      // FUN-06: el enlace de Supabase ya trae una sesión válida; pedimos la
      // contraseña nueva antes de mostrar el panel.
      void (async () => {
        await handleSession(session);
        if (!state.profile) return;
        state.passwordRecovery = true;
        state.view = 'change-password';
        renderChangePassword();
      })();
      return;
    }

    if (session && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
      handleSession(session);
    }
  });
}
