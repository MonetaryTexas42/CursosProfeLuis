// Examen final de Español y guía de estudio.
//
// El examen solo se puede iniciar si `final_exam_spanish_enabled` está en true
// (migración 0041). La guía es una página estática imprimible y siempre está
// disponible: se estudia en casa desde el primer día.
//
// Las respuestas, el puntaje y los tiempos los calcula el servidor mediante
// app_start_final_exam / app_answer_final_exam / app_finish_final_exam.

import { supabase } from '../lib/supabase.js';

export const EXAM_GUIDE_URL = './guia-examen-espanol.html';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

function esc(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function formatTime(ms) {
  const total = Math.max(0, Math.round(Number(ms || 0) / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString('es-MX', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

// La ausencia de la migración 0041 no debe romper el panel del alumno.
export async function fetchExamSummary() {
  if (!supabase) return { available: false, enabled: false, last: null, status: null };
  try {
    const [statusRes, sessionsRes] = await Promise.all([
      supabase.rpc('app_final_exam_status'),
      supabase
        .from('final_exam_sessions')
        .select('id,started_at,finished_at,status,score,correct_answers,total_questions')
        .order('started_at', { ascending: false })
        .limit(1)
    ]);
    if (statusRes.error) throw statusRes.error;
    if (sessionsRes.error) throw sessionsRes.error;
    return {
      available: true,
      status: statusRes.data,
      enabled: Boolean(statusRes.data?.enabled),
      last: sessionsRes.data?.[0] || null
    };
  } catch {
    return { available: false, enabled: false, last: null, status: null };
  }
}

export function examDashboardCard(summary) {
  if (!summary?.available) return '';

  const enabled = Boolean(summary.enabled);
  const last = summary.last;
  const completed = last?.status === 'completed';
  const badge = enabled
    ? '<span class="pill success">Activo</span>'
    : '<span class="pill pill-amber">Aún no activado</span>';
  const result = completed
    ? `<p class="exam-last-result">Último resultado: <strong>${Number(last.score).toFixed(2)}%</strong> · ${last.correct_answers}/${last.total_questions} aciertos <small>${esc(formatDate(last.finished_at))}</small></p>`
    : last?.status === 'in_progress'
      ? '<p class="exam-last-result">Tienes un examen en curso.</p>'
      : '';

  return `
    <article class="card wide exam-card">
      <div class="card-heading">
        <div>
          <span class="card-label">Evaluación</span>
          <h2>Examen final de Español</h2>
        </div>
        ${badge}
      </div>
      <p class="muted">${enabled
        ? '13 secciones con temas vistos en desorden. Tus respuestas, aciertos y tiempos quedan registrados.'
        : 'El examen se abrirá cuando se active oficialmente. Mientras tanto, ya puedes estudiar con la guía.'}</p>
      ${result}
      <div class="row exam-card-actions">
        ${enabled ? '<button class="btn primary" data-open-final-exam>Contestar examen →</button>' : ''}
        <a class="btn ghost" href="${EXAM_GUIDE_URL}" target="_blank" rel="noopener">📖 Guía de examen (imprimir)</a>
      </div>
    </article>
  `;
}

let exam = null;

export function openFinalExam(root, { onClose }) {
  exam = {
    root,
    onClose,
    view: 'intro',
    error: '',
    status: null,
    sessionId: null,
    sections: [],
    questions: [],
    index: 0,
    answers: new Map(),
    questionStart: 0,
    result: null,
    startedAt: 0
  };
  render();
  refreshStatus();
}

async function refreshStatus() {
  if (!exam) return;
  const summary = await fetchExamSummary();
  if (!exam || exam.view !== 'intro') return;
  exam.status = summary.status;
  if (!summary.enabled) exam.error = 'El examen todavía no está activo. Puedes seguir estudiando con la guía.';
  render();
}

function shell(content) {
  return `
    <div class="shell">
      <header class="top">
        <a class="brand" href="/" aria-label="ECOEMS inicio">
          <span class="brand-mark">E</span>
          <span>ECOEMS <small>Plataforma</small></span>
        </a>
        <div class="top-actions">
          <button class="btn ghost" id="exam-back">← Volver al panel</button>
        </div>
      </header>
      <main id="main-content" tabindex="-1" class="dashboard exam-main">
        ${exam.error ? `<div class="alert error" role="alert">${esc(exam.error)}</div>` : ''}
        ${content}
      </main>
    </div>
  `;
}

function render() {
  if (!exam) return;
  const content = exam.view === 'question'
    ? questionMarkup()
    : exam.view === 'results'
      ? resultsMarkup()
      : introMarkup();

  exam.root.innerHTML = shell(content);
  exam.root.querySelector('#exam-back')?.addEventListener('click', () => {
    if (exam.view === 'question' && !window.confirm('¿Salir del examen? Tu sesión quedará abierta y podrías perder el tiempo medido.')) return;
    exam.onClose?.();
  });
  exam.root.querySelectorAll('[data-exam-action]').forEach((button) => {
    button.addEventListener('click', () => handleAction(button.dataset.examAction, button.dataset));
  });
}

function introMarkup() {
  const status = exam.status;
  const enabled = Boolean(status?.enabled);
  const sections = status?.sections ?? 13;
  const questions = status?.questions ?? 136;

  return `
    <article class="card wide exam-intro">
      <span class="card-label">Evaluación final</span>
      <h1>Examen final de Español</h1>
      <p class="muted">Una evaluación completa de todos los temas vistos en la materia.</p>
      <div class="exam-facts">
        <div><strong>${sections}</strong><small>secciones (temas vistos)</small></div>
        <div><strong>${questions}</strong><small>preguntas del banco</small></div>
        <div><strong>∞</strong><small>tiempo libre por respuesta</small></div>
      </div>
      <ul class="exam-rules">
        <li>Las secciones aparecen en <strong>orden distinto</strong> al que se vieron en clase; cada una corresponde a un tema.</li>
        <li>Se mide el tiempo de <strong>cada pregunta</strong> y de <strong>cada sección</strong>.</li>
        <li>No verás si acertaste hasta terminar: el puntaje se calcula en el servidor.</li>
        <li>Responde en una sola sesión y revisa antes de terminar.</li>
      </ul>
      <div class="row exam-intro-actions">
        ${enabled
          ? '<button class="btn primary" data-exam-action="start">Comenzar examen →</button>'
          : '<button class="btn primary" disabled>Examen pendiente de activación</button>'}
        <a class="btn ghost" href="${EXAM_GUIDE_URL}" target="_blank" rel="noopener">📖 Estudiar con la guía</a>
      </div>
      ${enabled ? '' : '<p class="muted"><small>Cuando se active, regresa aquí y podrás contestarlo en la plataforma. La guía ya está lista para estudiar en casa.</small></p>'}
    </article>
  `;
}

function sectionFor(question) {
  return exam.sections.find((section) => section.key === question.sectionKey);
}

function questionMarkup() {
  const question = exam.questions[exam.index];
  if (!question) return resultsMarkup();
  const section = sectionFor(question);
  const answeredInSection = exam.questions.filter((q) =>
    q.sectionKey === question.sectionKey && exam.answers.get(q.id)?.selected != null
  ).length;
  const sectionTotal = exam.questions.filter((q) => q.sectionKey === question.sectionKey).length;
  const selected = exam.answers.get(question.id)?.selected;

  return `
    <div class="exam-layout">
      <aside class="exam-aside">
        <span class="card-label">Secciones</span>
        <ol class="exam-section-list">
          ${exam.sections.map((item) => {
            const total = exam.questions.filter((q) => q.sectionKey === item.key).length;
            const done = exam.questions.filter((q) => q.sectionKey === item.key && exam.answers.get(q.id)?.selected != null).length;
            const first = exam.questions.findIndex((q) => q.sectionKey === item.key);
            return `
              <li>
                <button data-exam-action="jump" data-index="${first}" class="${item.key === question.sectionKey ? 'active' : ''}">
                  <span>${esc(item.title)}</span>
                  <small>${done}/${total} · ${formatTime(sectionTime(item.key))}</small>
                </button>
              </li>
            `;
          }).join('')}
        </ol>
      </aside>

      <section class="card exam-question">
        <div class="exam-progress-top">
          <span>Pregunta ${exam.index + 1} de ${exam.questions.length}</span>
          <span>Sección ${section?.order ?? '—'} · ${esc(section?.title || 'Tema')} (${answeredInSection}/${sectionTotal})</span>
        </div>
        <progress class="exam-progress" max="${exam.questions.length}" value="${exam.index + 1}"></progress>
        <h2>${esc(question.prompt)}</h2>
        <div class="exam-options">
          ${(question.options || []).map((option, i) => `
            <button class="exam-option ${selected === i ? 'selected' : ''}" data-exam-action="answer" data-option="${i}">
              <span class="exam-letter">${LETTERS[i] || i + 1}</span>
              <span>${esc(option)}</span>
            </button>
          `).join('')}
        </div>
        <div class="answer-foot exam-nav">
          <button class="btn ghost" data-exam-action="prev" ${exam.index === 0 ? 'disabled' : ''}>← Anterior</button>
          <span class="muted"><small>${exam.questions.filter((q) => exam.answers.get(q.id)?.selected != null).length} contestadas</small></span>
          ${exam.index === exam.questions.length - 1
            ? '<button class="btn primary" data-exam-action="finish">Terminar examen ✓</button>'
            : '<button class="btn primary" data-exam-action="next">Siguiente →</button>'}
        </div>
      </section>
    </div>
  `;
}

function sectionTime(sectionKey) {
  let total = 0;
  for (const question of exam.questions) {
    if (question.sectionKey !== sectionKey) continue;
    total += exam.answers.get(question.id)?.elapsed || 0;
    if (question.id === exam.questions[exam.index]?.id) {
      total += Math.max(0, Math.round(performance.now() - exam.questionStart));
    }
  }
  return total;
}

async function handleAction(action, dataset) {
  if (action === 'start') return startExam();
  if (action === 'answer') return selectOption(Number(dataset.option));
  if (action === 'next') return goTo(exam.index + 1);
  if (action === 'prev') return goTo(exam.index - 1);
  if (action === 'jump') return goTo(Number(dataset.index));
  if (action === 'finish') return finishExam();
  if (action === 'retry') return openFinalExam(exam.root, { onClose: exam.onClose });
}

async function startExam() {
  exam.error = '';
  if (!supabase) {
    exam.error = 'La plataforma no está conectada a la base de datos.';
    return render();
  }
  const { data, error } = await supabase.rpc('app_start_final_exam');
  if (error) {
    exam.error = error.message || 'No se pudo iniciar el examen.';
    return render();
  }

  exam.sessionId = data.sessionId;
  exam.questions = data.questions || [];
  exam.sections = data.sections || [];
  exam.startedAt = Date.now();
  exam.answers = new Map();
  exam.index = 0;
  exam.view = 'question';
  exam.error = '';
  exam.questionStart = performance.now();
  render();
}

function accumulateTime() {
  const question = exam.questions[exam.index];
  if (!question) return;
  const elapsed = Math.max(0, Math.round(performance.now() - exam.questionStart));
  const current = exam.answers.get(question.id) || { selected: null, elapsed: 0 };
  current.elapsed += elapsed;
  exam.answers.set(question.id, current);
  exam.questionStart = performance.now();
}

async function selectOption(option) {
  const question = exam.questions[exam.index];
  if (!question || !Number.isInteger(option)) return;
  const current = exam.answers.get(question.id) || { selected: null, elapsed: 0 };
  const previous = current.selected;
  const elapsed = Math.max(0, Math.round(performance.now() - exam.questionStart));
  exam.questionStart = performance.now();

  exam.answers.set(question.id, { selected: option, elapsed: current.elapsed + elapsed });
  exam.root.querySelectorAll('.exam-option').forEach((button) => {
    button.classList.toggle('selected', Number(button.dataset.option) === option);
  });

  const { error } = await supabase.rpc('app_answer_final_exam', {
    p_session_id: exam.sessionId,
    p_question_id: question.id,
    p_selected_index: option,
    p_duration_ms: current.elapsed + elapsed
  });

  if (error) {
    exam.answers.set(question.id, { selected: previous, elapsed: current.elapsed });
    exam.error = error.message || 'No se pudo guardar la respuesta; vuelve a intentarlo.';
    render();
  } else {
    exam.root.querySelector('.exam-question')?.querySelectorAll('.exam-option').forEach((button) => {
      button.classList.toggle('selected', Number(button.dataset.option) === option);
    });
  }
}

function goTo(index) {
  if (index < 0 || index >= exam.questions.length) return;
  accumulateTime();
  exam.index = index;
  exam.error = '';
  render();
  exam.root.querySelector('.exam-question h2')?.scrollIntoView({ block: 'start', behavior: 'smooth' });
}

async function finishExam() {
  accumulateTime();
  const unanswered = exam.questions.filter((q) => exam.answers.get(q.id)?.selected == null).length;
  if (unanswered && !window.confirm(`Todavía hay ${unanswered} preguntas sin contestar. ¿Terminar de todos modos?`)) return;

  const { data, error } = await supabase.rpc('app_finish_final_exam', {
    p_session_id: exam.sessionId
  });
  if (error) {
    exam.error = error.message || 'No se pudo terminar el examen.';
    return render();
  }

  exam.result = data;
  exam.view = 'results';
  exam.error = '';
  render();
}

function resultsMarkup() {
  const result = exam.result;
  if (!result) return introMarkup();
  const wallClock = Date.now() - exam.startedAt;
  const score = Number(result.score || 0);
  const tone = score >= 70 ? 'good' : score >= 60 ? 'fair' : 'bad';

  return `
    <article class="card wide exam-result">
      <div class="exam-result-head">
        <div>
          <span class="card-label">Resultado</span>
          <h1>Examen final de Español</h1>
          <p class="muted">Sesión ${esc(result.sessionId)} · terminado ${esc(formatDate(new Date()))}</p>
        </div>
        <div class="exam-score ${tone}">
          <strong>${score.toFixed(2)}%</strong>
          <small>${result.correct}/${result.total} aciertos</small>
        </div>
      </div>

      <div class="exam-facts">
        <div><strong>${formatTime(wallClock)}</strong><small>tiempo total de la sesión</small></div>
        <div><strong>${formatTime(result.durationMs)}</strong><small>tiempo contestando</small></div>
        <div><strong>${result.answered}/${result.total}</strong><small>respuestas registradas</small></div>
      </div>

      <h2>Desglose por sección</h2>
      <div class="exam-table-wrap">
        <table class="exam-table">
          <thead><tr><th>#</th><th>Tema</th><th>Aciertos</th><th>Tiempo</th></tr></thead>
          <tbody>
            ${(result.sections || []).map((section) => `
              <tr>
                <td>${section.num}</td>
                <td>${esc(section.title)}</td>
                <td>${section.correct}/${section.total}</td>
                <td>${formatTime(section.timeMs)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <h2>Revisión de respuestas</h2>
      <div class="exam-review">
        ${(result.answers || []).map((answer, i) => `
          <details class="exam-review-item ${answer.isCorrect ? 'ok' : 'wrong'}">
            <summary>
              <span>${i + 1}. ${esc(answer.prompt)}</span>
              <span class="pill ${answer.isCorrect ? 'success' : 'pill-amber'}">${answer.isCorrect ? 'Correcta' : 'Incorrecta'} · ${formatTime(answer.durationMs)}</span>
            </summary>
            <p>Tu respuesta: <strong>${answer.selectedIndex == null ? 'Sin responder' : esc(LETTERS[answer.selectedIndex] || answer.selectedIndex + 1)}</strong> · Correcta: <strong>${esc(LETTERS[answer.correctIndex] || answer.correctIndex + 1)}</strong></p>
            ${answer.explanation ? `<p class="muted">${esc(answer.explanation)}</p>` : ''}
          </details>
        `).join('')}
      </div>

      <div class="row exam-result-actions">
        <button class="btn ghost" data-exam-action="retry">Volver al inicio</button>
        <a class="btn ghost" href="${EXAM_GUIDE_URL}" target="_blank" rel="noopener">📖 Repasar con la guía</a>
      </div>
    </article>
  `;
}
