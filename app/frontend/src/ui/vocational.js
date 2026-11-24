// Taller vocacional completo.
//
// Reutiliza todo el material del sistema legacy extraído en vocational-data.js:
// test RIASEC (60 preguntas), 8 preguntas de contexto, 47 escuelas,
// 12 instituciones, 11 planes de estudio, 40 carreras técnicas, expos con
// fuentes citadas, colegiaturas de referencia y guía de decisión.
//
// El resultado del RIASEC y del contexto se guarda solo en este navegador
// (localStorage). Las respuestas v1 se migran a v2 sin perderlas. El test
// oficial de orientación de la ficha del alumno no se sobrescribe.

import { VOCATIONAL_CATALOG as V } from './vocational-data.js';

const APP_BASE = import.meta.env.BASE_URL || '/';
const RESULTS_KEY_V1 = 'ecoems_vocational_riasec_v1';
const RESULTS_KEY = 'ecoems_vocational_riasec_v2';
const RESULT_KEY = RESULTS_KEY + ':result';
const CONTEXT_KEY = 'ecoems_vocational_context_v1';
const CHECKLIST_KEY = 'ecoems_vocational_checklist_v1';
const CAREER_SAVED_KEY = 'ecoems_vocational_careers_v1';
const CAREER_COMPARE_KEY = 'ecoems_vocational_compare_v1';

const TABS = [
  { id: 'inicio', label: 'Inicio', icon: '🏠' },
  { id: 'test', label: 'Descúbrete', icon: '🧭' },
  { id: 'escuelas', label: 'Escuelas', icon: '🎓' },
  { id: 'carreras', label: 'Super catálogo de carreras', icon: '🧩' },
  { id: 'expos', label: 'Expos y fechas', icon: '📅' },
  { id: 'universidades', label: 'Universidades', icon: '🏛️' },
  { id: 'planes', label: 'Planes y técnicas', icon: '📘' },
  { id: 'decision', label: 'Decide tu futuro', icon: '✨' }
];

const CHECKLIST = [
  'Hice el test RIASEC y leí mis tipos más fuertes.',
  'Comparé bachillerato general y bachillerato técnico.',
  'Elegí tres escuelas y verifiqué cortes y fechas oficiales.',
  'Revisé el plan de estudios y las carreras técnicas que ofrecen.',
  'Hablé con mi familia sobre costos, transporte y apoyo.',
  'Hablé con mi profesor y contrasté mi resultado con el test oficial.',
  'Revisé una expo o una convocatoria oficial con fecha y fuente.',
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

function norm(value) {
  return String(value ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
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
        <a class="btn primary" href="./vocacional.html">Abrir taller vocacional →</a>
        <span class="muted"><small>${V.riasecQuestions.length} preguntas · ${countTechnicianPrograms()} carreras técnicas · guía imprimible</small></span>
      </div>
    </article>
  `;
}

function loadAnswers() {
  const current = readStorage(RESULTS_KEY, null);
  if (current && typeof current === 'object' && !Array.isArray(current)) return current;

  // Migración v1 → v2: las 30 respuestas antiguas conservan su índice.
  const legacy = readStorage(RESULTS_KEY_V1, null);
  if (!legacy || typeof legacy !== 'object' || Array.isArray(legacy)) return {};

  const migrated = {};
  Object.entries(legacy).forEach(([key, value]) => {
    const index = Number(key);
    if (Number.isInteger(index) && index >= 0 && index < V.riasecQuestions.length) {
      migrated[index] = value;
    }
  });
  writeStorage(RESULTS_KEY, migrated);
  removeStorage(RESULTS_KEY_V1);
  removeStorage(RESULTS_KEY_V1 + ':result');
  return migrated;
}

export function openVocationalWorkshop(root, { onClose, readOnly = false, standalone = false } = {}) {
  workshop = {
    root,
    onClose,
    readOnly,
    standalone,
    tab: 'inicio',
    filters: { q: '', inst: '', tipo: '', tag: '', dist: 'todas', sector: '', costo: '' },
    careerFilters: { q: '', area: '', inst: '', sort: 'afinidad', affinity: false, saved: false },
    savedCareers: readStorage(CAREER_SAVED_KEY, []) || [],
    compareCareers: readStorage(CAREER_COMPARE_KEY, []) || [],
    plan: 'UNAM_ENP',
    techInst: 'IPN',
    answers: loadAnswers(),
    savedResult: readStorage(RESULT_KEY, null),
    context: readStorage(CONTEXT_KEY, {}) || {},
    checklist: readStorage(CHECKLIST_KEY, []) || [],
    focusSearch: false
  };
  render();
}

function currentResult() {
  const answered = V.riasecQuestions
    .map((_, index) => index)
    .filter((index) => workshop.answers[index] != null);
  if (!answered.length) return workshop.savedResult || null;

  const scores = {};
  const counts = {};
  for (const type of V.riasecTypes) {
    scores[type.id] = 0;
    counts[type.id] = 0;
  }
  answered.forEach((index) => {
    const question = V.riasecQuestions[index];
    scores[question.d] += Number(workshop.answers[index]) || 0;
    counts[question.d] += 1;
  });

  const normalized = {};
  for (const key of Object.keys(scores)) {
    normalized[key] = counts[key]
      ? Math.round((scores[key] / (counts[key] * 4)) * 100)
      : 0;
  }
  const complete = answered.length === V.riasecQuestions.length;
  return {
    complete,
    answered: answered.length,
    total: V.riasecQuestions.length,
    completed_at: complete ? new Date().toISOString() : null,
    scores: normalized,
    top: Object.entries(normalized)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([id, value]) => ({ id, value }))
  };
}

function persistAnswers() {
  writeStorage(RESULTS_KEY, workshop.answers);
}

function persistResult(result) {
  persistAnswers();
  if (!result?.complete) return;
  writeStorage(RESULT_KEY, result);
  workshop.savedResult = result;
}

function contextProfile() {
  const answers = workshop.context || {};
  const values = {};
  const tags = [];
  const notes = [];
  let maxKm = null;
  let costMax = null;

  for (const question of V.contextQuestions) {
    const value = answers[question.id];
    if (value == null) continue;
    if (Array.isArray(value)) {
      if (!value.length) continue;
      values[question.id] = value;
      value.forEach((item) => {
        const option = (question.options || []).find((entry) => entry.v === item);
        (option?.tags || []).forEach((tag) => tags.push(tag));
        if (option?.note) notes.push(option.note);
      });
      continue;
    }
    values[question.id] = value;
    const option = (question.options || []).find((entry) => entry.v === value);
    if (!option) continue;
    (option.tags || []).forEach((tag) => tags.push(tag));
    if (option.note) notes.push(option.note);
    if (option.maxKm != null) maxKm = option.maxKm;
    if (option.costMax != null) costMax = option.costMax;
  }

  return {
    values,
    tags: unique(tags),
    notes: unique(notes),
    maxKm,
    costMax,
    answered: Object.keys(values).length,
    total: V.contextQuestions.length
  };
}

function schoolProfile(school) {
  const extra = V.schoolExtras[school.nombre] || {};
  const sector = extra.sector
    || (school.inst === 'Privadas' ? 'Privada' : school.inst === 'Militares' ? 'Militar' : 'Pública');
  return {
    sector,
    nivel: extra.nivel || 'Bachillerato',
    colegiatura: extra.colegiatura || 'Sin colegiatura (verifica otros pagos)',
    band: extra.band || 'gratis',
    fuente: extra.fuente || null
  };
}

const COST_BANDS = { gratis: 0, medio: 2, alto: 3 };

function schoolAffinity(school, result, ctx) {
  const profile = schoolProfile(school);
  const tags = new Set([...(school.tags || []), profile.sector, profile.nivel]);
  const reasons = [];
  let score = 0;

  (result?.top || []).slice(0, 3).forEach((item, index) => {
    const type = V.riasecById[item.id];
    if (!type || item.value <= 0) return;
    const hits = (type.tags || []).filter((tag) => tags.has(tag));
    if (!hits.length) return;
    score += [4, 3, 2][index] * hits.length;
    reasons.push(`${type.icon} ${type.nombre}: ${hits.join(', ')}`);
  });

  ctx.tags.forEach((tag) => {
    if (tag === 'Beca' && profile.band !== 'gratis' && profile.band !== 'confirmar') return;
    if (tags.has(tag)) {
      score += 2;
      reasons.push(`Coincide con tu respuesta: ${tag}`);
    }
  });

  const technical = /técnic|tecnológ|profesional técnico/i.test(`${school.tipo} ${school.carreras}`);
  if (ctx.values.modalidad === 'tecnico' && technical) {
    score += 3;
    reasons.push('Incluye carrera técnica');
  }
  if (ctx.values.modalidad === 'general' && !technical) {
    score += 3;
    reasons.push('Bachillerato general flexible');
  }

  const militar = ctx.values.militar;
  if (militar === 'si' || militar === 'informarme' || militar === 'nose') {
    if (profile.sector === 'Militar') {
      score += 5;
      reasons.push('Opción militar que pediste explorar');
    }
  } else if (militar === 'no' && profile.sector === 'Militar') {
    score -= 6;
  }

  const km = Number(school.km) || 0;
  if (ctx.maxKm != null && km <= ctx.maxKm) {
    score += 2;
    reasons.push(`A ${km} km de Cuautitlán`);
  }

  const band = COST_BANDS[profile.band];
  if (ctx.costMax != null && band != null && band <= ctx.costMax) {
    score += 2;
    reasons.push(profile.band === 'gratis' ? 'Sin colegiatura' : 'Colegiatura dentro de tu presupuesto');
  }

  return { score, reasons: unique(reasons).slice(0, 4), profile };
}

function rankedSchools(list, result, ctx) {
  return list
    .map((school) => ({ school, affinity: schoolAffinity(school, result, ctx) }))
    .sort((a, b) => b.affinity.score - a.affinity.score || (a.school._i ?? 0) - (b.school._i ?? 0));
}

/* ---------- Super catálogo de carreras ---------- */

function careerAffinity(career, result, ctx) {
  const reasons = [];
  let score = 0;

  (result?.top || []).slice(0, 3).forEach((item, index) => {
    if (!career.riasecList.includes(item.id) || item.value <= 0) return;
    const type = V.riasecById[item.id];
    score += [5, 3, 2][index];
    reasons.push(`${type.icon} ${type.nombre}: coincide con tu perfil`);
  });

  ctx.tags.forEach((tag) => {
    if (!career.tagList.includes(tag)) return;
    score += 2;
    reasons.push(`Coincide con tu respuesta: ${tag}`);
  });

  if (ctx.values.modalidad === 'tecnico' && career.area === 'tecnica') {
    score += 3;
    reasons.push('Opción técnica que pediste explorar');
  }
  if (ctx.values.modalidad === 'general' && career.area !== 'tecnica') {
    score += 2;
    reasons.push('Licenciatura flexible desde bachillerato general');
  }

  const militar = ctx.values.militar;
  const esMilitar = career.instList.includes('SEDENA');
  if (esMilitar && ['si', 'informarme', 'nose'].includes(militar)) {
    score += 4;
    reasons.push('Opción militar que pediste explorar');
  } else if (esMilitar && militar === 'no') {
    score -= 6;
  }

  return { score, reasons: unique(reasons).slice(0, 3) };
}

function rankedCareers(list, result, ctx) {
  return list
    .map((career) => ({ career, affinity: careerAffinity(career, result, ctx) }))
    .sort((a, b) => b.affinity.score - a.affinity.score || a.career._i - b.career._i);
}

function filteredCareers(result, ctx) {
  const f = workshop.careerFilters;
  const query = norm(f.q).trim();
  let items = rankedCareers(V.careers, result, ctx);

  items = items.filter(({ career, affinity }) => {
    if (query && !norm(`${career.nombre} ${career.materias} ${career.perfil} ${career.salida} ${career.tagList.join(' ')}`).includes(query)) return false;
    if (f.area && career.area !== f.area) return false;
    if (f.inst && !career.instList.includes(f.inst)) return false;
    if (f.saved && !workshop.savedCareers.includes(career.id)) return false;
    if (f.affinity && affinity.score <= 0) return false;
    return true;
  });

  const sorters = {
    afinidad: (a, b) => b.affinity.score - a.affinity.score || a.career._i - b.career._i,
    az: (a, b) => a.career.nombre.localeCompare(b.career.nombre, 'es'),
    duracion: (a, b) => (parseInt(a.career.duracion, 10) || 9) - (parseInt(b.career.duracion, 10) || 9),
    area: (a, b) => a.career.area.localeCompare(b.career.area, 'es') || a.career.nombre.localeCompare(b.career.nombre, 'es')
  };
  return items.sort(sorters[f.sort] || sorters.afinidad);
}

function careerCodeMarkup(career) {
  return career.riasecList.map((id) => {
    const type = V.riasecById[id];
    if (!type) return '';
    return `<span class="voc-career-code" style="--code:${type.color}" title="${esc(type.nombre)}">${esc(id)}</span>`;
  }).join('');
}

function careerProvidersMarkup(career) {
  return career.instList.map((code) => {
    const provider = V.careerProviders[code];
    if (!provider) return '';
    return `<a class="pill voc-provider" href="${esc(provider.url)}" target="_blank" rel="noopener" title="${esc(provider.nota)}">${esc(provider.nombre)} ↗</a>`;
  }).join('');
}

function careerCardMarkup(item) {
  const career = item.career;
  const area = V.careerAreas.find((entry) => entry.id === career.area) || { icon: '🎯', nombre: career.area };
  const saved = workshop.savedCareers.includes(career.id);
  const compared = workshop.compareCareers.includes(career.id);

  return `
    <article class="voc-career-card">
      <header>
        <span class="pill">${area.icon} ${esc(area.nombre)}</span>
        <h3>${esc(career.nombre)}</h3>
        <p class="voc-career-meta">⏱ ${esc(career.duracion)} <span class="voc-career-codes">${careerCodeMarkup(career)}</span></p>
      </header>
      ${item.affinity.reasons.length ? `<div class="voc-career-why">${item.affinity.reasons.map((reason) => `<span>✓ ${esc(reason)}</span>`).join('')}</div>` : ''}
      <dl class="voc-career-facts">
        <dt>Qué se estudia</dt><dd>${esc(career.materias)}</dd>
        <dt>Perfil</dt><dd>${esc(career.perfil)}</dd>
        <dt>Qué harás</dt><dd>${esc(career.salida)}</dd>
        <dt>Bachillerato recomendado</dt><dd>${esc(career.prepa)}</dd>
      </dl>
      <div class="voc-career-providers">
        <strong>Dónde estudiarla</strong>
        <div class="row">${careerProvidersMarkup(career)}</div>
        ${career.instList.includes('SEDENA') ? '<p class="voc-warn">🎖️ Es una licenciatura militar: requiere bachillerato terminado. No es una preparatoria.</p>' : ''}
      </div>
      <div class="row voc-career-actions">
        <button class="btn ghost" data-voc-action="career-save" data-id="${esc(career.id)}" aria-pressed="${saved}">${saved ? '★ Guardada' : '☆ Guardar en mi lista'}</button>
        <button class="btn ghost" data-voc-action="career-compare" data-id="${esc(career.id)}" aria-pressed="${compared}">${compared ? '✓ En comparador' : '＋ Comparar'}</button>
        <button class="btn ghost" data-voc-action="filter-inst-career" data-inst="${esc(career.instList[0] || '')}">Ver más de ${esc(V.careerProviders[career.instList[0]]?.nombre || 'esta institución')}</button>
      </div>
    </article>
  `;
}

function careerCompareMarkup() {
  const selected = workshop.compareCareers.map((id) => V.careerById[id]).filter(Boolean);
  if (!selected.length) {
    return '<div class="voc-note"><strong>Mi comparador.</strong> Agrega hasta 3 carreras con el botón «Comparar» para verlas lado a lado.</div>';
  }
  const fields = [
    ['Área', (c) => V.careerAreas.find((a) => a.id === c.area)?.nombre || c.area],
    ['Duración', (c) => c.duracion],
    ['RIASEC', (c) => c.riasecList.map((id) => V.riasecById[id]?.nombre || id).join(', ')],
    ['Qué se estudia', (c) => c.materias],
    ['Perfil', (c) => c.perfil],
    ['Qué harás', (c) => c.salida],
    ['Bachillerato recomendado', (c) => c.prepa],
    ['Dónde estudiarla', (c) => c.instList.map((code) => V.careerProviders[code]?.nombre || code).join(', ')]
  ];
  return `
    <div class="voc-compare-scroll">
      <table class="voc-compare-table">
        <thead><tr><th>Aspecto</th>${selected.map((c) => `<th>${esc(c.nombre)} <button class="voc-remove" data-voc-action="career-uncompare" data-id="${esc(c.id)}" aria-label="Quitar ${esc(c.nombre)} del comparador">×</button></th>`).join('')}</tr></thead>
        <tbody>${fields.map(([label, get]) => `<tr><th>${esc(label)}</th>${selected.map((c) => `<td>${esc(get(c))}</td>`).join('')}</tr>`).join('')}</tbody>
      </table>
    </div>
  `;
}

function careersPanel() {
  const result = currentResult();
  const ctx = contextProfile();
  const top = rankedCareers(V.careers, result, ctx).filter((item) => item.affinity.score > 0).slice(0, 6);
  const items = filteredCareers(result, ctx);
  const f = workshop.careerFilters;

  return `
    <article class="card wide voc-panel">
      <div class="card-heading">
        <div>
          <span class="card-label">Explora a fondo</span>
          <h2>Super catálogo de carreras</h2>
        </div>
        <span class="pill">${V.careers.length} carreras · ${V.careerAreas.length} áreas · ${Object.keys(V.careerProviders).length} fuentes</span>
      </div>
      <div class="voc-note rich">${rich(V.careerNote)}</div>

      ${top.length ? `
        <section class="voc-subsection">
          <div class="voc-subhead">
            <h3>Mejores coincidencias para ti</h3>
            <span class="pill success">Según tu Descúbrete</span>
          </div>
          <p class="muted">Ordenadas por afinidad con tus respuestas. Puedes explorarlas todas más abajo.</p>
          <div class="voc-career-matches">
            ${top.map((item, index) => `
              <button class="voc-career-match" data-voc-action="career-focus" data-id="${esc(item.career.id)}">
                <span class="voc-match-rank">${index + 1}</span>
                <strong>${esc(item.career.nombre)}</strong>
                <small>${esc(item.affinity.reasons[0] || 'Carrera afín a tu perfil')}</small>
              </button>
            `).join('')}
          </div>
        </section>
      ` : '<div class="voc-note">Responde «Descúbrete» para ver aquí tus mejores coincidencias. Mientras tanto puedes explorar y filtrar todo el catálogo.</div>'}

      <section class="voc-subsection">
        <div class="voc-subhead"><h3>Busca y filtra</h3><span class="pill">${items.length} resultados</span></div>
        <div class="voc-career-filters">
          <label><span>Buscar</span><input id="career-q" data-career-filter="q" value="${esc(f.q)}" placeholder="Ej. salud, datos, derecho, técnico"></label>
          <label><span>Área</span><select data-career-filter="area">
            <option value="">Todas las áreas</option>
            ${V.careerAreas.map((area) => `<option value="${esc(area.id)}" ${f.area === area.id ? 'selected' : ''}>${area.icon} ${esc(area.nombre)}</option>`).join('')}
          </select></label>
          <label><span>Institución</span><select data-career-filter="inst">
            <option value="">Todas</option>
            ${Object.entries(V.careerProviders).map(([code, provider]) => `<option value="${esc(code)}" ${f.inst === code ? 'selected' : ''}>${esc(provider.nombre)}</option>`).join('')}
          </select></label>
          <label><span>Ordenar</span><select data-career-filter="sort">
            ${V.careerSort.map(([value, label]) => `<option value="${esc(value)}" ${f.sort === value ? 'selected' : ''}>${esc(label)}</option>`).join('')}
          </select></label>
          <label class="voc-check-label"><input type="checkbox" data-career-filter="affinity" ${f.affinity ? 'checked' : ''}> Solo afines a mi perfil</label>
          <label class="voc-check-label"><input type="checkbox" data-career-filter="saved" ${f.saved ? 'checked' : ''}> Solo mis guardadas (${workshop.savedCareers.length})</label>
          <button class="btn ghost" data-voc-action="reset-career-filters">Limpiar filtros</button>
        </div>
      </section>

      <section class="voc-subsection">
        <h3>Carreras</h3>
        <div class="voc-career-grid">
          ${items.length ? items.map(careerCardMarkup).join('') : '<div class="voc-note">No hay carreras con esos filtros. Prueba con otra palabra o limpia los filtros.</div>'}
        </div>
      </section>

      <section class="voc-subsection">
        <div class="voc-subhead">
          <h3>Mi comparador</h3>
          <span class="pill">${workshop.compareCareers.length}/3 seleccionadas</span>
        </div>
        ${careerCompareMarkup()}
      </section>

      <section class="voc-subsection">
        <h3>Fuentes oficiales</h3>
        <p class="muted">Abre el catálogo de cada institución para confirmar oferta vigente, sede, duración y fechas. No inventes requisitos ni montos: verifícalos en la fuente.</p>
        <div class="voc-source-list">
          ${Object.values(V.careerProviders).map((provider) => `
            <a href="${esc(provider.url)}" target="_blank" rel="noopener"><strong>${esc(provider.nombre)} ↗</strong><small>${esc(provider.nota)}</small></a>
          `).join('')}
        </div>
        <div class="row voc-dashboard-actions">
          <button class="btn ghost" data-voc-go="universidades">Comparar instituciones →</button>
          <button class="btn ghost" data-voc-go="escuelas">Ver escuelas y bachilleratos →</button>
        </div>
      </section>
    </article>
  `;
}

function render() {
  if (!workshop) return;

  workshop.root.innerHTML = `
    <div class="shell">
      <header class="top">
        <a class="brand" href="${APP_BASE}" aria-label="ECOEMS inicio">
          <span class="brand-mark">E</span>
          <span>ECOEMS <small>Plataforma</small></span>
        </a>
        <div class="top-actions">
          <button class="btn ghost" id="voc-back">← ${workshop.standalone ? 'Volver a la plataforma' : 'Volver al panel'}</button>
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

  workshop.root.querySelector('#voc-back')?.addEventListener('click', () => {
    if (workshop.onClose) workshop.onClose();
    else if (workshop.standalone) window.location.assign(APP_BASE);
  });
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
    case 'carreras': return careersPanel();
    case 'expos': return exposPanel();
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
          <small>Responde ${V.riasecQuestions.length} preguntas RIASEC y ${V.contextQuestions.length} de contexto para afinar tu perfil.</small>
        </button>
        <button class="voc-home-tile" data-voc-go="escuelas">
          <span>🎓</span><strong>Compara escuelas</strong>
          <small>Públicas, privadas y militares. Si ya respondiste Descúbrete, verás arriba las que mejor encajan contigo.</small>
        </button>
        <button class="voc-home-tile" data-voc-go="carreras">
          <span>🧩</span><strong>Super catálogo de carreras</strong>
          <small>${V.careers.length} carreras: qué se estudia, duración, salidas, bachillerato recomendado y dónde cursarlas con fuentes oficiales.</small>
        </button>
        <button class="voc-home-tile" data-voc-go="expos">
          <span>📅</span><strong>Expos y fechas</strong>
          <small>Qué se estudia en prepa y universidad, convocatorias con fuente citada y qué preguntar en la feria.</small>
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
          <small>Qué considerar por ti y en familia, perfiles de ejemplo y tu plan de decisión.</small>
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
  const ctx = contextProfile();
  const answered = V.riasecQuestions.filter((_, i) => workshop.answers[i] != null).length;
  const total = V.riasecQuestions.length;

  return `
    <article class="card wide voc-panel">
      <div class="card-heading">
        <div>
          <span class="card-label">Descúbrete · versión ampliada</span>
          <h2>¿Qué tipo de actividades te atraen?</h2>
        </div>
        <span class="pill ${answered === total ? 'success' : ''}">${answered}/${total} RIASEC · ${ctx.answered}/${ctx.total} contexto</span>
      </div>
      <p class="muted">Para cada actividad elige qué tanto te gusta. No hay respuestas correctas: cuenta lo que realmente te interesa, no lo que crees que «debería» gustarte. Puedes ver un resultado parcial desde la primera respuesta.</p>
      ${result ? riasecResultMarkup(result) : ''}
      ${ctx.answered ? contextSummaryMarkup(ctx) : ''}
      <div class="row voc-test-actions">
        <button class="btn ghost" data-voc-action="clear-riasec" ${answered ? '' : 'disabled'}>Borrar respuestas RIASEC</button>
        <button class="btn ghost" data-voc-action="clear-context" ${ctx.answered ? '' : 'disabled'}>Borrar contexto</button>
        ${(result || ctx.answered) ? '<button class="btn primary" data-voc-action="go-matches">Ver mis mejores escuelas →</button>' : ''}
        ${(result || ctx.answered) ? '<button class="btn primary" data-voc-action="go-career-matches">Ver carreras para mí →</button>' : ''}
      </div>
      <p class="hint">${workshop.readOnly ? 'Estás explorando en modo invitado.' : 'Tus respuestas se guardan automáticamente en este dispositivo.'} No se modifican tus calificaciones ni tu ficha.</p>

      <section class="voc-subsection">
        <div class="voc-subhead">
          <h3>Parte 1 · Intereses (RIASEC)</h3>
          <span class="muted"><small>${V.riasecScale.length} opciones por actividad · 10 por tipo</small></span>
        </div>
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
                ${questions.map((question, questionIndex) => `
                  <div class="voc-question">
                    <p><span>${questionIndex + 1}.</span> ${esc(question.t)}</p>
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
      </section>

      ${contextPanel(ctx)}
    </article>
  `;
}

function contextPanel(ctx) {
  return `
    <section class="voc-subsection">
      <div class="voc-subhead">
        <h3>Parte 2 · Tu contexto y preferencias</h3>
        <span class="pill ${ctx.answered === ctx.total ? 'success' : ''}">${ctx.answered}/${ctx.total} respondidas</span>
      </div>
      <p class="muted">Estas respuestas ajustan el orden del catálogo: escuelas militares, distancia, colegiatura y tipo de bachillerato. Son privadas y no se guardan en tu ficha.</p>
      <div class="voc-context-grid">
        ${V.contextQuestions.map((question, index) => {
          const selected = workshop.context[question.id];
          return `
            <section class="voc-context-card">
              <h4><span>${index + 1}.</span> ${esc(question.t)}</h4>
              ${question.hint ? `<p class="hint">${esc(question.hint)}</p>` : ''}
              <div class="voc-context-options">
                ${(question.options || []).map((option) => question.multiple
                  ? `<label class="voc-context-option"><input type="checkbox" data-voc-context-multi="${esc(question.id)}" value="${esc(option.v)}" ${(Array.isArray(selected) && selected.includes(option.v)) ? 'checked' : ''}><span>${esc(option.label)}</span></label>`
                  : `<button type="button" class="voc-context-option ${selected === option.v ? 'selected' : ''}" data-voc-context="${esc(question.id)}" data-value="${esc(option.v)}" aria-pressed="${selected === option.v}"><span>${esc(option.label)}</span></button>`
                ).join('')}
              </div>
            </section>
          `;
        }).join('')}
      </div>
    </section>
  `;
}

function contextSummaryMarkup(ctx) {
  if (!ctx.notes.length) return '';
  return `
    <div class="voc-context-summary">
      <span class="card-label">Lo que dijiste</span>
      <div class="ficha-tags">${ctx.notes.map((note) => `<span class="ficha-tag">${esc(note)}</span>`).join('')}</div>
    </div>
  `;
}

function riasecResultMarkup(result) {
  const ctx = contextProfile();
  const top = result.top || [];
  const interests = unique(top.flatMap((item) => V.riasecInterestsByType[item.id] || []));
  const templates = unique(top.map((item) => V.riasecTemplateByType[item.id])).map((id) => V.templatesById[id]).filter(Boolean);
  const schools = rankedSchools(V.schools, result, ctx)
    .filter((item) => item.affinity.score > 0)
    .slice(0, 5);

  return `
    <section class="voc-result">
      <div class="voc-result-head">
        <span class="card-label">${result.complete ? 'Tu resultado' : `Resultado parcial · ${result.answered}/${result.total} respondidas`}</span>
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
            <div class="ficha-tags">${schools.map(({ school }) => `<button class="ficha-tag" data-voc-action="filter-inst" data-inst="${esc(school.inst)}">${esc(school.inst)} · ${esc(school.nombre)}</button>`).join('')}</div>
          </div>
        ` : ''}
      ` : ''}
    </section>
  `;
}

function filteredSchools() {
  const { q, inst, tipo, tag, dist, sector, costo } = workshop.filters;
  const needle = q.trim().toLowerCase();

  return V.schools.filter((school) => {
    if (inst && school.inst !== inst) return false;
    if (tipo && school.tipo !== tipo) return false;
    if (tag && !(school.tags || []).includes(tag)) return false;
    const profile = schoolProfile(school);
    if (sector && profile.sector !== sector) return false;
    if (costo && profile.band !== costo) return false;
    if (dist !== 'todas') {
      const km = Number(school.km) || 0;
      if (dist === '<20' && !(km < 20)) return false;
      if (dist === '20-30' && !(km >= 20 && km <= 30)) return false;
      if (dist === '30-45' && !(km > 30 && km <= 45)) return false;
      if (dist === '>45' && !(km > 45)) return false;
    }
    if (!needle) return true;
    return [school.nombre, school.inst, school.tipo, school.zona, school.fuerte, school.orienta,
      school.carreras, school.uni, profile.colegiatura, profile.nivel, ...(school.tags || [])]
      .join(' ')
      .toLowerCase()
      .includes(needle);
  });
}

function schoolsPanel() {
  const result = currentResult();
  const ctx = contextProfile();
  const hasProfile = Boolean(result || ctx.answered);
  const ranked = rankedSchools(filteredSchools(), result, ctx);
  const top = hasProfile ? ranked.filter((item) => item.affinity.score > 0).slice(0, 6) : [];

  return `
    <article class="card wide voc-panel">
      <div class="card-heading">
        <div>
          <span class="card-label">Catálogo ampliado</span>
          <h2>Escuelas y lo que puedes estudiar</h2>
        </div>
        <span class="pill">${ranked.length} de ${V.schools.length} escuelas</span>
      </div>
      <p class="muted">Públicas, privadas y militares. Compara distancia desde Cuautitlán, aciertos, pase, carrera técnica, colegiatura y orientación. Verifica siempre los datos oficiales del año.</p>

      ${hasProfile ? `
        <section class="voc-match-section">
          <div class="voc-match-head">
            <div>
              <span class="card-label">Ordenado para ti</span>
              <h3>Mejores opciones para ti</h3>
            </div>
            <span class="pill ${result?.complete ? 'success' : ''}">${result
              ? (result.complete ? 'Perfil RIASEC completo' : `Perfil RIASEC parcial · ${result.answered}/${result.total}`)
              : 'Solo respuestas de contexto'}</span>
          </div>
          <p class="muted">Calculado con tus respuestas de «Descúbrete»${ctx.answered ? ` y ${ctx.answered} de ${ctx.total} respuestas de contexto` : ''}. Es una guía para investigar, no una promesa de admisión.</p>
          ${top.length ? `
            <div class="voc-match-grid">
              ${top.map((item, index) => matchCard(item, index)).join('')}
            </div>
          ` : `
            <p class="empty-state">Todavía no hay coincidencias claras. Responde más preguntas o quita filtros para ver todo el catálogo.</p>
          `}
        </section>
      ` : `
        <div class="voc-note">
          <strong>¿Quieres ver primero las escuelas que encajan contigo?</strong>
          <p>Responde «Descúbrete» y este catálogo se ordena solo con tus intereses, distancia, presupuesto y preferencia de bachillerato.</p>
          <button class="btn-mini" data-voc-go="test">Ir a Descúbrete →</button>
        </div>
      `}

      <section class="voc-subsection">
        <div class="voc-subhead">
          <h3>Todas las escuelas</h3>
          <span class="pill">${ranked.length} resultados</span>
        </div>
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
          <label><span>Sector</span>
            <select data-voc-filter="sector">
              ${V.catalogSectorFilters.map(([value, label]) => `<option value="${esc(value)}" ${workshop.filters.sector === value ? 'selected' : ''}>${esc(label)}</option>`).join('')}
            </select>
          </label>
          <label><span>Colegiatura</span>
            <select data-voc-filter="costo">
              ${V.catalogCostFilters.map(([value, label]) => `<option value="${esc(value)}" ${workshop.filters.costo === value ? 'selected' : ''}>${esc(label)}</option>`).join('')}
            </select>
          </label>
          <button class="btn ghost" data-voc-action="reset-filters">Limpiar filtros</button>
        </div>

        ${ranked.length ? `
          <div class="voc-school-grid">
            ${ranked.map(({ school, affinity }, index) => schoolCard(school, index, affinity)).join('')}
          </div>
        ` : `
          <p class="empty-state">No hay escuelas con esos filtros. Prueba con otra institución, sector o distancia.</p>
        `}
      </section>
      <div class="voc-disclaimer">${rich(V.catalogDisclaimer)}</div>
      <div class="voc-disclaimer">${esc(V.tuitionNote)}</div>
    </article>
  `;
}

function reasonsMarkup(reasons, compact = false) {
  if (!reasons?.length) return '';
  return `
    <div class="voc-match-reasons ${compact ? 'compact' : ''}">
      ${reasons.map((reason) => `<span class="voc-reason">${esc(reason)}</span>`).join('')}
    </div>
  `;
}

function matchCard({ school, affinity }, index) {
  return `
    <article class="voc-match-card">
      <header>
        <span class="voc-school-index">${index + 1}</span>
        <div>
          <span class="card-label">${esc(school.inst)} · ${esc(affinity.profile.sector)}</span>
          <h4>${esc(school.nombre)}</h4>
          <small>${esc(affinity.profile.nivel)} · ${esc(school.tipo)}</small>
        </div>
      </header>
      ${reasonsMarkup(affinity.reasons)}
      <p><small><strong>Colegiatura:</strong> ${esc(affinity.profile.colegiatura)}</small></p>
      <div class="row voc-school-actions">
        <button class="btn-mini" data-voc-action="school-plan" data-school="${esc(school.nombre)}">Ver plan</button>
        <button class="btn-mini" data-voc-action="filter-inst" data-inst="${esc(school.inst)}">Ver ${esc(school.inst)}</button>
      </div>
    </article>
  `;
}

function schoolCard(school, index, affinity) {
  const profile = affinity?.profile || schoolProfile(school);
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
      <div class="ficha-tags voc-school-badges">
        <span class="voc-badge voc-badge-${esc(profile.sector.toLowerCase())}">${esc(profile.sector)}</span>
        <span class="voc-badge">${esc(profile.nivel)}</span>
      </div>
      <dl class="voc-school-facts">
        <div><dt>Distancia</dt><dd>${esc(school.km)} km · ${esc(school.tiempo)}</dd></div>
        <div><dt>Aciertos</dt><dd>${esc(school.aciertos)}</dd></div>
        <div><dt>Pase</dt><dd>${esc(school.pase)}</dd></div>
        <div><dt>Carrera técnica</dt><dd>${esc(school.carreras)}</dd></div>
        <div><dt>Colegiatura</dt><dd>${esc(profile.colegiatura)}</dd></div>
      </dl>
      <p><strong>Fuerte:</strong> ${esc(school.fuerte)}</p>
      <p><strong>Orienta a:</strong> ${esc(school.orienta)}</p>
      <p><strong>Universidad:</strong> ${esc(school.uni)}</p>
      ${reasonsMarkup(affinity?.reasons, true)}
      <div class="ficha-tags">${(school.tags || []).map((tag) => `<span class="ficha-tag">${esc(tag)}</span>`).join('')}</div>
      ${profile.fuente ? `
        <p class="voc-source"><small>Fuente: <a href="${esc(profile.fuente.url)}" target="_blank" rel="noopener">${esc(profile.fuente.label)}</a>${profile.fuente.oficial ? ` · <a href="${esc(profile.fuente.oficial)}" target="_blank" rel="noopener">simulador oficial</a>` : ''} · consultada ${esc(profile.fuente.consulta)}</small></p>
      ` : ''}
      <div class="row voc-school-actions">
        <button class="btn-mini" data-voc-action="school-plan" data-school="${esc(school.nombre)}">Ver plan de estudios</button>
        <button class="btn-mini" data-voc-action="filter-inst" data-inst="${esc(school.inst)}">Ver ${esc(school.inst)}</button>
      </div>
    </article>
  `;
}

function exposPanel() {
  const fairSections = [
    { key: 'prepa', title: 'Para elegir prepa o bachillerato', desc: 'Sirve aunque aún no sepas qué carrera seguirás.' },
    { key: 'uni', title: 'Para pensar en la universidad', desc: 'Útil al terminar el bachillerato o para comparar desde ahora.' },
    { key: 'militar', title: 'Para la opción militar', desc: 'El Heroico Colegio Militar es licenciatura: pide bachillerato terminado.' }
  ];

  return `
    <article class="card wide voc-panel">
      <div class="card-heading">
        <div>
          <span class="card-label">Orientación profesiográfica</span>
          <h2>Expos, fechas y qué preguntar</h2>
        </div>
        <span class="pill">${V.expoEvents.length} fuentes citadas</span>
      </div>
      <p class="muted">Aquí verás qué se estudia en la prepa y en la universidad, con fechas públicas verificables. Cuando no hay convocatoria confirmada se muestra «Por confirmar» y se enlaza el sitio oficial: no se inventan fechas ni montos.</p>

      <div class="voc-expo-grid">
        ${V.expoEvents.map((event) => `
          <article class="voc-expo-card">
            <header>
              <span aria-hidden="true">📌</span>
              <div><h3>${esc(event.nombre)}</h3><small>${esc(event.nivel)}</small></div>
            </header>
            <span class="pill ${/concluida/i.test(event.estado) ? '' : 'voc-pending'}">${esc(event.estado)}</span>
            <dl class="voc-expo-facts">
              <div><dt>Fechas</dt><dd>${esc(event.fechas)}</dd></div>
              <div><dt>Lugar</dt><dd>${esc(event.lugar)}</dd></div>
              <div><dt>Costo</dt><dd>${esc(event.costo)}</dd></div>
            </dl>
            <p><strong>Para qué sirve:</strong> ${esc(event.paraQue)}</p>
            ${event.etapas ? `
              <details>
                <summary>Calendario de referencia del ciclo 2026 (${event.etapas.length} etapas)</summary>
                <ul>${event.etapas.map(([step, dates]) => `<li><strong>${esc(step)}:</strong> ${esc(dates)}</li>`).join('')}</ul>
              </details>
            ` : ''}
            ${event.notaEtapas ? `<p class="hint">${esc(event.notaEtapas)}</p>` : ''}
            <p class="voc-source"><small>Fuente: <a href="${esc(event.fuente.url)}" target="_blank" rel="noopener">${esc(event.fuente.label)}</a>${event.fuente.secundaria ? ` · <a href="${esc(event.fuente.secundaria)}" target="_blank" rel="noopener">cobertura secundaria</a>` : ''} · consultada ${esc(event.fuente.consulta)}</small></p>
          </article>
        `).join('')}
      </div>

      <section class="voc-subsection">
        <h3>Qué preguntar en la feria</h3>
        <p class="muted">Lleva tus tres opciones escritas y estas preguntas. Anota las respuestas: te servirán para hablar en familia y con tu profesor.</p>
        <div class="voc-fair-grid">
          ${fairSections.map((section) => `
            <article>
              <h4>${esc(section.title)}</h4>
              <p class="muted"><small>${esc(section.desc)}</small></p>
              <ol>${(V.fairQuestions[section.key] || []).map((question) => `<li>${esc(question)}</li>`).join('')}</ol>
            </article>
          `).join('')}
        </div>
      </section>

      <div class="voc-note"><strong>Antes de ir:</strong> revisa la pestaña «Descúbrete» para llevar tu perfil RIASEC y tus respuestas de contexto; así podrás preguntar por carreras afines en lugar de quedarte solo con el nombre.</div>
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

      <section class="voc-subsection decision-section">
        <div class="voc-subhead">
          <h3>Qué considerar antes de decidir</h3>
          <span class="pill">Por ti · en familia · con tu profesor</span>
        </div>
        <div class="voc-decision-grid">
          ${[V.decisionGuide.individual, V.decisionGuide.family, V.decisionGuide.teacher].map((block) => `
            <article>
              <h4><span aria-hidden="true">${block.icon}</span> ${esc(block.title)}</h4>
              <ul>${(block.items || []).map((item) => `<li>${esc(item)}</li>`).join('')}</ul>
            </article>
          `).join('')}
        </div>
        <div class="voc-note">
          <strong>Preguntas para llevar a la conversación</strong>
          <ol>${(V.decisionGuide.questions || []).map((question) => `<li>${esc(question)}</li>`).join('')}</ol>
        </div>
      </section>

      <section class="voc-subsection">
        <div class="voc-subhead">
          <h3>Lo que aprendes en el curso te abre puertas</h3>
          <span class="pill">Curso ↔ carreras</span>
        </div>
        <p class="muted">${esc(V.courseBridgeNote)}</p>
        <div class="voc-bridge-grid">
          ${V.courseBridge.map((bridge) => `
            <article class="voc-bridge-card">
              <header><span aria-hidden="true">${bridge.icon}</span><h4>${esc(bridge.skill)}</h4></header>
              <p>${esc(bridge.use)}</p>
              <div class="row voc-bridge-careers">
                ${bridge.careers.map((id) => {
                  const career = V.careerById[id];
                  return career ? `<button class="pill" data-voc-action="career-focus" data-id="${esc(id)}">${esc(career.nombre)} →</button>` : '';
                }).join('')}
              </div>
            </article>
          `).join('')}
        </div>
      </section>

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

  panel.querySelectorAll('[data-career-filter]').forEach((field) => {
    const key = field.dataset.careerFilter;
    const eventName = field.type === 'checkbox' ? 'change' : (field.tagName === 'INPUT' ? 'input' : 'change');
    field.addEventListener(eventName, () => {
      workshop.careerFilters[key] = field.type === 'checkbox' ? field.checked : field.value;
      if (field.tagName === 'INPUT' && field.type !== 'checkbox') workshop.focusSearch = true;
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
      persistResult(currentResult());
      refreshPanel();
    });
  });

  panel.querySelectorAll('[data-voc-context]').forEach((button) => {
    button.addEventListener('click', () => {
      workshop.context[button.dataset.vocContext] = button.dataset.value;
      writeStorage(CONTEXT_KEY, workshop.context);
      refreshPanel();
    });
  });

  panel.querySelectorAll('[data-voc-context-multi]').forEach((input) => {
    input.addEventListener('change', () => {
      const id = input.dataset.vocContextMulti;
      const selected = new Set(Array.isArray(workshop.context[id]) ? workshop.context[id] : []);
      if (input.checked) selected.add(input.value);
      else selected.delete(input.value);
      workshop.context[id] = [...selected];
      writeStorage(CONTEXT_KEY, workshop.context);
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
    const input = panel.querySelector(workshop.tab === 'carreras' ? '#career-q' : '#voc-q');
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
    removeStorage(RESULT_KEY);
    removeStorage(RESULTS_KEY_V1);
    removeStorage(RESULTS_KEY_V1 + ':result');
    refreshPanel();
    return;
  }

  if (action === 'clear-context') {
    workshop.context = {};
    removeStorage(CONTEXT_KEY);
    refreshPanel();
    return;
  }

  if (action === 'go-matches') {
    workshop.tab = 'escuelas';
    render();
    return;
  }

  if (action === 'go-career-matches') {
    workshop.tab = 'carreras';
    render();
    return;
  }

  if (action === 'career-focus') {
    workshop.careerFilters = { q: '', area: '', inst: '', sort: 'afinidad', affinity: false, saved: false };
    const career = V.careerById[dataset.id];
    if (career) workshop.careerFilters.q = career.nombre;
    workshop.tab = 'carreras';
    render();
    return;
  }

  if (action === 'career-save') {
    const set = new Set(workshop.savedCareers);
    if (set.has(dataset.id)) set.delete(dataset.id);
    else set.add(dataset.id);
    workshop.savedCareers = [...set];
    writeStorage(CAREER_SAVED_KEY, workshop.savedCareers);
    refreshPanel();
    return;
  }

  if (action === 'career-compare') {
    const set = new Set(workshop.compareCareers);
    if (set.has(dataset.id)) set.delete(dataset.id);
    else if (set.size < 3) set.add(dataset.id);
    workshop.compareCareers = [...set];
    writeStorage(CAREER_COMPARE_KEY, workshop.compareCareers);
    refreshPanel();
    return;
  }

  if (action === 'career-uncompare') {
    workshop.compareCareers = workshop.compareCareers.filter((id) => id !== dataset.id);
    writeStorage(CAREER_COMPARE_KEY, workshop.compareCareers);
    refreshPanel();
    return;
  }

  if (action === 'reset-career-filters') {
    workshop.careerFilters = { q: '', area: '', inst: '', sort: 'afinidad', affinity: false, saved: false };
    refreshPanel();
    return;
  }

  if (action === 'filter-inst-career') {
    workshop.careerFilters = { q: '', area: '', inst: dataset.inst || '', sort: 'afinidad', affinity: false, saved: false };
    workshop.tab = 'carreras';
    render();
    return;
  }

  if (action === 'save-riasec') {
    persistResult(currentResult());
    refreshPanel();
    return;
  }

  if (action === 'reset-filters') {
    workshop.filters = { q: '', inst: '', tipo: '', tag: '', dist: 'todas', sector: '', costo: '' };
    refreshPanel();
    return;
  }

  if (action === 'filter-inst') {
    workshop.filters = { q: '', inst: dataset.inst || '', tipo: '', tag: '', dist: 'todas', sector: '', costo: '' };
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
