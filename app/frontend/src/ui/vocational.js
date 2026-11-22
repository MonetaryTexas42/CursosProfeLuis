// Taller vocacional completo.
//
// Reutiliza todo el material del sistema legacy extraído en vocational-data.js:
// test RIASEC (30 preguntas), 44 escuelas, 11 instituciones, 11 planes de
// estudio, 40 carreras técnicas, catálogos, guía de decisión y preparación.
//
// El resultado del RIASEC se guarda solo en este navegador (localStorage).
// El test oficial de orientación que se guarda en el expediente sigue siendo
// el de la tarjeta "Mi orientación" de app.js; aquí no se sobrescribe.

import { VOCATIONAL_CATALOG as V } from './vocational-data.js';

const RESULTS_KEY = 'ecoems_vocational_riasec_v1';
const CHECKLIST_KEY = 'ecoems_vocational_checklist_v1';

const TABS = [
  { id: 'inicio', label: 'Inicio', icon: '🏠' },
  { id: 'test', label: 'Descúbrete', icon: '🧭' },
  { id: 'escuelas', label: 'Escuelas y carreras', icon: '🎓' },
  { id: 'universidades', label: 'Universidades', icon: '🏛️' },
  { id: 'planes', label: 'Planes y técnicas', icon: '📘' },
  { id: 'decision', label: 'Decide tu futuro', icon: '✨' }
];

const CHECKLIST = [
  'Hice el test RIASEC y leí mis tipos más fuertes.',
  'Comparé bachillerato general y bachillerato técnico.',
  'Elegí tres escuelas y verifiqué cortes y fechas oficiales.',
  'Revisé el plan de estudios y las carreras técnicas que ofrecen.',
  'Hablé con mi familia y mi profesor sobre mi decisión.',
  'Preparé un plan de repaso para el examen de admisión.'
];

let workshop = null;

function esc(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

// El HTML enriquecido viene del archivo estático legacy (solo <b>, <ul>, etc.).
function rich(value) {
  return String(value ?? '');
}

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Modo privado o storage lleno: el taller sigue funcionando en memoria.
  }
}

function removeStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // Nada que hacer.
  }
}

function unique(items) {
  return [...new Set((items || []).filter(Boolean))];
}

function countTechnicianPrograms() {
  return Object.values(V.technicianPrograms).reduce(
    (sum, institution) => sum + (institution.carreras?.length || 0),
    0
  );
}

export function vocationalDashboardCard() {
  return `
    <article class="card wide voc-dashboard-card">
      <div class="card-heading">
        <div>
          <span class="card-label">Orientación</span>
          <h2>Taller vocacional completo</h2>
        </div>
        <span class="pill">Incluye guía y catálogos</span>
      </div>
      <p class="muted">Descubre tus intereses con el test RIASEC, compara ${V.schools.length} escuelas y ${V.institutions.length} instituciones, revisa planes de estudio y carreras técnicas, y arma tu decisión con información.</p>
      <div class="row voc-dashboard-actions">
        <button class="btn primary" data-open-vocational>Abrir taller vocacional →</button>
        <span class="muted"><small>${V.riasecQuestions.length} preguntas · ${countTechnicianPrograms()} carreras técnicas · guía imprimible</small></span>
      </div>
    </article>
  `;
}

export function openVocationalWorkshop(root, { onClose, readOnly = false } = {}) {
  workshop = {
    root,
    onClose,
    readOnly,
    tab: 'inicio',
    filters: { q: '', inst: '', tipo: '', tag: '', dist: 'todas' },
    plan: 'UNAM_ENP',
    techInst: 'IPN',
    answers: readStorage(RESULTS_KEY, {}) || {},
    savedResult: readStorage(RESULTS_KEY + ':result', null),
    checklist: readStorage(CHECKLIST_KEY, []) || [],
    focusSearch: false
  };
  render();
}

function currentResult() {
  const complete = V.riasecQuestions.every((_, index) => workshop.answers[index] != null);
  if (!complete) return workshop.savedResult;

  const scores = {};
  for (const type of V.riasecTypes) scores[type.id] = 0;
  V.riasecQuestions.forEach((question, index) => {
    scores[question.d] = (scores[question.d] || 0) + Number(workshop.answers[index] || 0);
  });

  const normalized = {};
  for (const key of Object.keys(scores)) {
    normalized[key] = Math.round((scores[key] / (V.riasecMaxPerType * 4)) * 100);
  }

  const result = {
    completed_at: new Date().toISOString(),
    scores: normalized,
    top: Object.entries(normalized)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([id, value]) => ({ id, value }))
  };
  return result;
}

function persistResult(result) {
  if (!result?.completed_at) return;
  writeStorage(RESULTS_KEY, workshop.answers);
  writeStorage(RESULTS_KEY + ':result', result);
  workshop.savedResult = result;
}

function render() {
  if (!workshop) return;

  workshop.root.innerHTML = `
    <div class="shell">
      <header class="top">
        <a class="brand" href="/" aria-label="ECOEMS inicio">
          <span class="brand-mark">E</span>
          <span>ECOEMS <small>Plataforma</small></span>
        </a>
        <div class="top-actions">
          <button class="btn ghost" id="voc-back">← Volver al panel</button>
        </div>
      </header>
      <main id="main-content" tabindex="-1" class="dashboard voc-main">
        ${heroMarkup()}
        <nav class="voc-tabs" aria-label="Secciones del taller">
          ${TABS.map((tab) => `
            <button class="voc-tab ${workshop.tab === tab.id ? 'active' : ''}" data-voc-tab="${tab.id}" ${workshop.tab === tab.id ? 'aria-current="page"' : ''}>
              <span aria-hidden="true">${tab.icon}</span>
              <span>${tab.label}</span>
            </button>
          `).join('')}
        </nav>
        <div id="voc-panel">${panelMarkup()}</div>
      </main>
    </div>
  `;

  workshop.root.querySelector('#voc-back')?.addEventListener('click', () => workshop.onClose?.());
  workshop.root.querySelectorAll('[data-voc-tab]').forEach((button) => {
    button.addEventListener('click', () => {
      workshop.tab = button.dataset.vocTab;
      render();
      workshop.root.querySelector('.voc-tabs')?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    });
  });
  bindPanel();
}

function heroMarkup() {
  return `
    <article class="card wide voc-hero">
      <span class="card-label">Taller de orientación vocacional</span>
      <h1>Construye tu camino con información</h1>
      <p class="muted">${esc(V.catalogIntro)}</p>
      <div class="voc-hero-stats">
        <div><strong>${V.riasecQuestions.length}</strong><small>preguntas para descubrirte</small></div>
        <div><strong>${V.schools.length}</strong><small>escuelas comparadas</small></div>
        <div><strong>${V.institutions.length}</strong><small>instituciones</small></div>
        <div><strong>${countTechnicianPrograms()}</strong><small>carreras técnicas</small></div>
      </div>
      <div class="voc-disclaimer">${rich(V.catalogDisclaimer)}</div>
    </article>
  `;
}

function panelMarkup() {
  switch (workshop.tab) {
    case 'test': return testPanel();
    case 'escuelas': return schoolsPanel();
    case 'universidades': return universitiesPanel();
    case 'planes': return plansPanel();
    case 'decision': return decisionPanel();
    default: return homePanel();
  }
}

function homePanel() {
  return `
    <article class="card wide voc-panel">
      <h2>¿Qué puedes hacer aquí?</h2>
      <div class="voc-home-grid">
        <button class="voc-home-tile" data-voc-go="test">
          <span>🧭</span><strong>Descúbrete</strong>
          <small>Responde 30 preguntas RIASEC y conoce tus intereses dominantes.</small>
        </button>
        <button class="voc-home-tile" data-voc-go="escuelas">
          <span>🎓</span><strong>Compara escuelas</strong>
          <small>Filtra por institución, tipo, área, distancia y lo que cada escuela ofrece.</small>
        </button>
        <button class="voc-home-tile" data-voc-go="universidades">
          <span>🏛️</span><strong>Entiende las universidades</strong>
          <small>Pase directo, examen de admisión y referencias de aciertos por institución.</small>
        </button>
        <button class="voc-home-tile" data-voc-go="planes">
          <span>📘</span><strong>Revisa planes y técnicas</strong>
          <small>Materias semestre por semestre y módulos de las carreras técnicas.</small>
        </button>
        <button class="voc-home-tile" data-voc-go="decision">
          <span>✨</span><strong>Decide y prepárate</strong>
          <small>Guía para elegir, perfiles de ejemplo y un plan para el examen de admisión.</small>
        </button>
      </div>
      <div class="voc-note">
        <strong>Dos herramientas complementarias.</strong>
        <p>El test de esta sección es para explorar y se guarda en este navegador. En la tarjeta <em>Mi orientación</em> del panel está el test oficial que tu profesor puede ver en tu ficha. Usa ambos para decidir con más seguridad.</p>
      </div>
      <p class="muted"><small>${esc(V.scoreReferenceNote)}</small></p>
    </article>
  `;
}

function testPanel() {
  const result = currentResult();
  const answered = V.riasecQuestions.filter((_, i) => workshop.answers[i] != null).length;
  const total = V.riasecQuestions.length;

  return `
    <article class="card wide voc-panel">
      <div class="card-heading">
        <div>
          <span class="card-label">Test RIASEC</span>
          <h2>¿Qué tipo de actividades te atraen?</h2>
        </div>
        <span class="pill ${answered === total ? 'success' : ''}">${answered}/${total} respondidas</span>
      </div>
      <p class="muted">Para cada actividad elige qué tanto te gusta. No hay respuestas correctas: cuenta lo que realmente te interesa, no lo que crees que «debería» gustarte.</p>
      ${result ? riasecResultMarkup(result) : ''}
      <div class="row voc-test-actions">
        <button class="btn ghost" data-voc-action="clear-riasec" ${answered ? '' : 'disabled'}>Borrar respuestas</button>
        ${answered === total ? '<button class="btn primary" data-voc-action="save-riasec">Guardar mi resultado ✓</button>' : ''}
      </div>
      <p class="hint">${workshop.readOnly ? 'Estás explorando en modo invitado.' : 'Tus respuestas se guardan automáticamente en este dispositivo.'} No se modifican tus calificaciones ni tu ficha.</p>

      <div class="voc-riasec-groups">
        ${V.riasecTypes.map((type) => {
          const questions = V.riasecQuestions
            .map((question, index) => ({ ...question, index }))
            .filter((question) => question.d === type.id);
          return `
            <section class="voc-riasec-group" style="--voc-color:${esc(type.color)}">
              <header>
                <span aria-hidden="true">${type.icon}</span>
                <div><strong>${esc(type.nombre)}</strong><small>${esc(type.desc)}</small></div>
              </header>
              ${questions.map((question) => `
                <div class="voc-question">
                  <p><span>${question.index + 1}.</span> ${esc(question.t)}</p>
                  <div class="voc-scale" role="group" aria-label="Respuesta para: ${esc(question.t)}">
                    ${V.riasecScale.map((label, value) => `
                      <button type="button" class="voc-scale-btn ${workshop.answers[question.index] === value ? 'selected' : ''}" data-voc-riasec="${question.index}" data-value="${value}" title="${esc(label)}" aria-pressed="${workshop.answers[question.index] === value}">
                        <strong>${value + 1}</strong><small>${esc(label)}</small>
                      </button>
                    `).join('')}
                  </div>
                </div>
              `).join('')}
            </section>
          `;
        }).join('')}
      </div>
    </article>
  `;
}

function riasecResultMarkup(result) {
  const complete = V.riasecQuestions.every((_, i) => workshop.answers[i] != null);
  const top = result.top || [];
  const interests = unique(top.flatMap((item) => V.riasecInterestsByType[item.id] || []));
  const tags = unique(top.flatMap((item) => V.riasecTagsByType[item.id] || []));
  const templates = unique(top.map((item) => V.riasecTemplateByType[item.id])).map((id) => V.templatesById[id]).filter(Boolean);
  const schools = V.schools
    .map((school) => ({ school, matches: (school.tags || []).filter((tag) => tags.includes(tag)) }))
    .filter((item) => item.matches.length)
    .sort((a, b) => b.matches.length - a.matches.length || a.school.nombre.localeCompare(b.school.nombre))
    .slice(0, 5);

  return `
    <section class="voc-result">
      <div class="voc-result-head">
        <span class="card-label">${complete ? 'Tu resultado' : 'Último resultado guardado'}</span>
        <h3>${top.length ? top.map((item) => esc(V.riasecById[item.id]?.nombre || item.id)).join(' · ') : 'Aún sin resultado'}</h3>
      </div>
      <div class="voc-score-grid">
        ${V.riasecTypes.map((type) => {
          const value = result.scores?.[type.id] ?? 0;
          return `
            <div class="voc-score" style="--voc-color:${esc(type.color)}">
              <div><strong>${type.icon} ${esc(type.nombre)}</strong><span>${value}%</span></div>
              <div class="voc-score-bar"><i style="width:${Math.max(0, Math.min(100, value))}%"></i></div>
            </div>
          `;
        }).join('')}
      </div>
      ${top.length ? `
        <p class="muted">${top.slice(0, 2).map((item) => esc(V.riasecById[item.id]?.desc || '')).filter(Boolean).join(' ')}</p>
        <div class="voc-result-columns">
          ${interests.length ? `
            <div>
              <span class="card-label">Intereses relacionados</span>
              <div class="ficha-tags">${interests.map((item) => `<span class="ficha-tag">${esc(item)}</span>`).join('')}</div>
            </div>
          ` : ''}
          ${templates.length ? `
            <div>
              <span class="card-label">Perfiles para explorar</span>
              <div class="ficha-tags">${templates.map((item) => `<span class="ficha-tag">${item.icon || '🎯'} ${esc(item.nombre)}</span>`).join('')}</div>
            </div>
          ` : ''}
        </div>
        ${schools.length ? `
          <div class="voc-result-schools">
            <span class="card-label">Escuelas que podrías revisar</span>
            <div class="ficha-tags">${schools.map((item) => `<button class="ficha-tag" data-voc-action="filter-inst" data-inst="${esc(item.school.inst)}">${esc(item.school.inst)} · ${esc(item.school.nombre)}</button>`).join('')}</div>
          </div>
        ` : ''}
      ` : ''}
    </section>
  `;
}

function filteredSchools() {
  const { q, inst, tipo, tag, dist } = workshop.filters;
  const needle = q.trim().toLowerCase();

  return V.schools.filter((school) => {
    if (inst && school.inst !== inst) return false;
    if (tipo && school.tipo !== tipo) return false;
    if (tag && !(school.tags || []).includes(tag)) return false;
    if (dist !== 'todas') {
      const km = Number(school.km) || 0;
      if (dist === '<20' && !(km < 20)) return false;
      if (dist === '20-30' && !(km >= 20 && km <= 30)) return false;
      if (dist === '30-45' && !(km > 30 && km <= 45)) return false;
      if (dist === '>45' && !(km > 45)) return false;
    }
    if (!needle) return true;
    return [school.nombre, school.inst, school.tipo, school.zona, school.fuerte, school.orienta, school.carreras, school.uni, ...(school.tags || [])]
      .join(' ')
      .toLowerCase()
      .includes(needle);
  });
}

function schoolsPanel() {
  const schools = filteredSchools();
  return `
    <article class="card wide voc-panel">
      <div class="card-heading">
        <div>
          <span class="card-label">Catálogo</span>
          <h2>Escuelas y lo que puedes estudiar</h2>
        </div>
        <span class="pill">${schools.length} de ${V.schools.length} escuelas</span>
      </div>
      <p class="muted">Compara distancia desde Cuautitlán, aciertos de referencia, pase a universidad, carrera técnica y orientación. Verifica siempre los datos oficiales del año.</p>

      <div class="voc-filters">
        <label class="voc-search">
          <span>Buscar</span>
          <input id="voc-q" type="search" placeholder="Escuela, zona, carrera, área…" value="${esc(workshop.filters.q)}" data-voc-filter="q">
        </label>
        <label><span>Institución</span>
          <select data-voc-filter="inst">
            <option value="">Todas</option>
            ${V.institutions.map((item) => `<option value="${esc(item)}" ${workshop.filters.inst === item ? 'selected' : ''}>${esc(item)}</option>`).join('')}
          </select>
        </label>
        <label><span>Tipo</span>
          <select data-voc-filter="tipo">
            <option value="">Todos</option>
            ${V.schoolTypes.map((item) => `<option value="${esc(item)}" ${workshop.filters.tipo === item ? 'selected' : ''}>${esc(item)}</option>`).join('')}
          </select>
        </label>
        <label><span>Área</span>
          <select data-voc-filter="tag">
            <option value="">Todas</option>
            ${V.catalogTags.map((item) => `<option value="${esc(item)}" ${workshop.filters.tag === item ? 'selected' : ''}>${esc(item)}</option>`).join('')}
          </select>
        </label>
        <label><span>Distancia</span>
          <select data-voc-filter="dist">
            ${V.catalogDistanceFilters.map(([value, label]) => `<option value="${esc(value)}" ${workshop.filters.dist === value ? 'selected' : ''}>${esc(label)}</option>`).join('')}
          </select>
        </label>
        <button class="btn ghost" data-voc-action="reset-filters">Limpiar filtros</button>
      </div>

      ${schools.length ? `
        <div class="voc-school-grid">
          ${schools.map((school, index) => schoolCard(school, index)).join('')}
        </div>
      ` : `
        <p class="empty-state">No hay escuelas con esos filtros. Prueba con otra institución o distancia.</p>
      `}
      <div class="voc-disclaimer">${rich(V.catalogDisclaimer)}</div>
    </article>
  `;
}

function schoolCard(school, index) {
  return `
    <article class="voc-school-card">
      <header>
        <span class="voc-school-index">${String(index + 1).padStart(2, '0')}</span>
        <div>
          <span class="card-label">${esc(school.inst)}</span>
          <h3>${esc(school.nombre)}</h3>
          <small>${esc(school.tipo)} · ${esc(school.zona)}</small>
        </div>
      </header>
      <dl class="voc-school-facts">
        <div><dt>Distancia</dt><dd>${esc(school.km)} km · ${esc(school.tiempo)}</dd></div>
        <div><dt>Aciertos</dt><dd>${esc(school.aciertos)}</dd></div>
        <div><dt>Pase</dt><dd>${esc(school.pase)}</dd></div>
        <div><dt>Carrera técnica</dt><dd>${esc(school.carreras)}</dd></div>
      </dl>
      <p><strong>Fuerte:</strong> ${esc(school.fuerte)}</p>
      <p><strong>Orienta a:</strong> ${esc(school.orienta)}</p>
      <p><strong>Universidad:</strong> ${esc(school.uni)}</p>
      <div class="ficha-tags">${(school.tags || []).map((tag) => `<span class="ficha-tag">${esc(tag)}</span>`).join('')}</div>
      <div class="row voc-school-actions">
        <button class="btn-mini" data-voc-action="school-plan" data-school="${esc(school.nombre)}">Ver plan de estudios</button>
        <button class="btn-mini" data-voc-action="filter-inst" data-inst="${esc(school.inst)}">Ver ${esc(school.inst)}</button>
      </div>
    </article>
  `;
}

function universitiesPanel() {
  return `
    <article class="card wide voc-panel">
      <div class="card-heading">
        <div>
          <span class="card-label">Educación superior</span>
          <h2>Qué ofrece cada institución</h2>
        </div>
        <span class="pill">${V.institutions.length} instituciones</span>
      </div>
      <p class="muted">Antes de elegir, entiende si tu bachillerato da pase directo, si necesitas examen de admisión y qué tan lejos queda.</p>
      <div class="voc-university-grid">
        ${V.institutions.map((inst) => {
          const info = V.institutionInfo[inst] || {};
          const refs = V.schoolScoreReferences[inst] || [];
          const total = V.schools.filter((school) => school.inst === inst).length;
          return `
            <article class="voc-university-card">
              <header><h3>${esc(inst)}</h3><span class="pill">${total} ${total === 1 ? 'opción' : 'opciones'}</span></header>
              <p>${esc(info.desc || '—')}</p>
              <p><strong>Pase:</strong> ${esc(info.pase || '—')}</p>
              <p><strong>Hacia la universidad:</strong> ${esc(info.uni || '—')}</p>
              ${refs.length ? `
                <details>
                  <summary>Referencias de aciertos (${refs.length})</summary>
                  <ul>${refs.map((item) => `<li>${esc(item.n)} · ${esc(item.r)}</li>`).join('')}</ul>
                </details>
              ` : ''}
              <button class="btn-mini" data-voc-action="filter-inst" data-inst="${esc(inst)}">Ver sus escuelas →</button>
            </article>
          `;
        }).join('')}
      </div>
      <div class="voc-note"><strong>Importante:</strong> ${rich(V.scoreReferenceNote)} Las cifras son orientativas; consulta la convocatoria oficial.</div>
    </article>
  `;
}

function planKeyForSchool(name) {
  const school = V.schools.find((item) => item.nombre === name);
  if (!school) return 'GENERAL';
  const selector = V.studyPlanSelectors.find((item) => item.inst === school.inst || item.inst === '*');
  if (!selector) return 'GENERAL';
  const matches = Object.entries(selector.match || {}).every(([key, value]) => String(school[key]) === String(value));
  if (!matches) return selector.fallback || 'GENERAL';
  if (school.inst === 'UNAM') {
    return /CCH/i.test(school.nombre) ? 'UNAM_CCH' : (selector.fallback || 'UNAM_ENP');
  }
  return selector.plan;
}

function plansPanel() {
  const plan = V.studyPlans[workshop.plan] || V.studyPlans.GENERAL;
  const tech = V.technicianPrograms[workshop.techInst] || Object.values(V.technicianPrograms)[0];

  return `
    <article class="card wide voc-panel">
      <div class="card-heading">
        <div>
          <span class="card-label">Mapa académico</span>
          <h2>Planes de estudio y carreras técnicas</h2>
        </div>
        <span class="pill">${Object.keys(V.studyPlans).length} planes · ${countTechnicianPrograms()} técnicas</span>
      </div>

      <section class="voc-subsection">
        <div class="voc-subhead">
          <h3>Plan de estudios</h3>
          <label><span>Plan</span>
            <select data-voc-select="plan">
              ${Object.entries(V.studyPlans).map(([key, item]) => `<option value="${esc(key)}" ${workshop.plan === key ? 'selected' : ''}>${esc(item.nombre)}</option>`).join('')}
            </select>
          </label>
        </div>
        <p class="muted">${plan.tecnico ? 'Este plan incluye una carrera técnica además del bachillerato.' : 'Bachillerato general: abre opciones para cualquier licenciatura.'}</p>
        <div class="voc-semesters">
          ${(plan.semestres || []).map((semester) => `
            <article>
              <h4>Semestre ${semester.n}</h4>
              <ul>${(semester.materias || []).map((subject) => `<li>${esc(subject)}</li>`).join('')}</ul>
            </article>
          `).join('')}
        </div>
      </section>

      <section class="voc-subsection">
        <div class="voc-subhead">
          <h3>Carreras técnicas</h3>
          <label><span>Institución</span>
            <select data-voc-select="techInst">
              ${Object.keys(V.technicianPrograms).map((inst) => `<option value="${esc(inst)}" ${workshop.techInst === inst ? 'selected' : ''}>${esc(inst)}</option>`).join('')}
            </select>
          </label>
        </div>
        <p class="muted">${esc(tech.nota || '')}</p>
        <div class="voc-tech-grid">
          ${(tech.carreras || []).map((career) => `
            <article>
              <h4>${esc(career.n)}</h4>
              <ul>${(career.modulos || []).map((module) => `<li>${esc(module)}</li>`).join('')}</ul>
            </article>
          `).join('')}
        </div>
      </section>
    </article>
  `;
}

function decisionPanel() {
  return `
    <article class="card wide voc-panel">
      <div class="card-heading">
        <div>
          <span class="card-label">Toma de decisión</span>
          <h2>${esc(V.careerGuide.title)}</h2>
        </div>
      </div>
      <div class="voc-guide rich">${rich(V.careerGuideHtml)}</div>

      <section class="voc-subsection">
        <h3>Preparación para el futuro</h3>
        <div class="voc-note rich">${rich(V.careerGuide.examPreparation)}</div>
        <div class="row voc-dashboard-actions">
          <a class="btn ghost" href="./guia-examen-espanol.html" target="_blank" rel="noopener">📖 Guía de examen de Español</a>
          <a class="btn ghost" href="./curso/">📚 Volver al curso</a>
        </div>
      </section>

      <section class="voc-subsection">
        <h3>Perfiles de ejemplo</h3>
        <p class="muted">No son etiquetas: sirven para comparar gustos, materias y escuelas. Puedes mezclar varios.</p>
        <div class="voc-template-grid">
          ${V.templates.map((template) => `
            <article>
              <header><span aria-hidden="true">${template.icon || '🎯'}</span><h4>${esc(template.nombre)}</h4></header>
              <p><strong>Intereses:</strong> ${(template.intereses || []).map(esc).join(' · ')}</p>
              <p><strong>Aptitudes:</strong> ${(template.aptitudes || []).map(esc).join(' · ')}</p>
              <p><strong>Escuelas sugeridas:</strong> ${(template.escuelas || []).map((item) => `${esc(item.inst)}: ${esc(item.esc)}`).join(' · ')}</p>
            </article>
          `).join('')}
        </div>
      </section>

      <section class="voc-subsection">
        <h3>Mi plan de decisión</h3>
        <p class="muted">Marca lo que ya hiciste. Tu lista se guarda en este dispositivo.</p>
        <ul class="voc-checklist">
          ${CHECKLIST.map((item, index) => `
            <li>
              <label>
                <input type="checkbox" data-voc-check="${index}" ${workshop.checklist.includes(index) ? 'checked' : ''}>
                <span>${esc(item)}</span>
              </label>
            </li>
          `).join('')}
        </ul>
        <p class="pill ${workshop.checklist.length === CHECKLIST.length ? 'success' : ''}">${workshop.checklist.length}/${CHECKLIST.length} pasos listos</p>
      </section>
    </article>
  `;
}

function bindPanel() {
  const panel = workshop.root.querySelector('#voc-panel');
  if (!panel) return;

  panel.querySelectorAll('[data-voc-go]').forEach((button) => {
    button.addEventListener('click', () => {
      workshop.tab = button.dataset.vocGo;
      render();
    });
  });

  panel.querySelectorAll('[data-voc-filter]').forEach((field) => {
    const key = field.dataset.vocFilter;
    const eventName = field.tagName === 'INPUT' ? 'input' : 'change';
    field.addEventListener(eventName, () => {
      workshop.filters[key] = field.value;
      if (field.tagName === 'INPUT') workshop.focusSearch = true;
      refreshPanel();
    });
  });

  panel.querySelectorAll('[data-voc-select]').forEach((field) => {
    field.addEventListener('change', () => {
      workshop[field.dataset.vocSelect] = field.value;
      refreshPanel();
    });
  });

  panel.querySelectorAll('[data-voc-riasec]').forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.vocRiasec);
      workshop.answers[index] = Number(button.dataset.value);
      const result = currentResult();
      persistResult(result);
      refreshPanel();
    });
  });

  panel.querySelectorAll('[data-voc-check]').forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      const index = Number(checkbox.dataset.vocCheck);
      const set = new Set(workshop.checklist);
      if (checkbox.checked) set.add(index);
      else set.delete(index);
      workshop.checklist = [...set];
      writeStorage(CHECKLIST_KEY, workshop.checklist);
      refreshPanel();
    });
  });

  panel.querySelectorAll('[data-voc-action]').forEach((button) => {
    button.addEventListener('click', () => handleAction(button.dataset.vocAction, button.dataset));
  });
}

function refreshPanel() {
  const panel = workshop.root.querySelector('#voc-panel');
  if (!panel) return;
  const scroll = window.scrollY;
  panel.innerHTML = panelMarkup();
  bindPanel();
  if (workshop.focusSearch) {
    const input = panel.querySelector('#voc-q');
    if (input) {
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }
    workshop.focusSearch = false;
  }
  window.scrollTo(0, scroll);
}

function handleAction(action, dataset) {
  if (action === 'clear-riasec') {
    workshop.answers = {};
    workshop.savedResult = null;
    removeStorage(RESULTS_KEY);
    removeStorage(RESULTS_KEY + ':result');
    refreshPanel();
    return;
  }

  if (action === 'save-riasec') {
    persistResult(currentResult());
    refreshPanel();
    return;
  }

  if (action === 'reset-filters') {
    workshop.filters = { q: '', inst: '', tipo: '', tag: '', dist: 'todas' };
    refreshPanel();
    return;
  }

  if (action === 'filter-inst') {
    workshop.filters = { q: '', inst: dataset.inst || '', tipo: '', tag: '', dist: 'todas' };
    workshop.tab = 'escuelas';
    render();
    return;
  }

  if (action === 'school-plan') {
    workshop.plan = planKeyForSchool(dataset.school);
    workshop.tab = 'planes';
    render();
  }
}
