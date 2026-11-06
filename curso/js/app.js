"use strict";

/* =============================================================
   PLATAFORMA ECOEMS · app.js
   Router hash + renderizador + gamificación + gestión alumnos/pagos (localStorage).
   Sin dependencias externas.
   ============================================================= */

const STORE_KEY = "curso_comipems_v1";
const ALUMNOS_KEY = "curso_ecoems_alumnos_v1";
const PAGOS_KEY = "curso_ecoems_pagos_v1";
const ASISTENCIA_KEY = "curso_ecoems_asistencia_v1";

const DIFF = {
  0: { label: "Básico", emoji: "\u{1F7E2}", cls: "diff-0" },
  1: { label: "Intermedio", emoji: "\u{1F7E1}", cls: "diff-1" },
  2: { label: "Avanzado", emoji: "\u{1F534}", cls: "diff-2" }
};

const BADGES = [
  { id: "first", icon: "\u{1F3AF}", name: "Primer paso", desc: "Completaste tu primera unidad", test: s => s.done.length >= 1 },
  { id: "racha3", icon: "\u{1F525}", name: "Racha de 3", desc: "Acertaste 3 veces seguidas", test: s => s.best >= 3 },
  { id: "reto", icon: "\u{1F60E}", name: "Reto cumplido", desc: "Resolviste tu primer reto", test: s => s.retos >= 1 },
  { id: "half", icon: "\u{1F3C1}", name: "La mitad", desc: "Completaste 4 unidades", test: s => s.done.length >= 4 },
  { id: "master", icon: "\u{1F4AF}", name: "Maestría", desc: "Lograste dominio 100% en una unidad", test: s => s.mastered >= 1 }
];

const LETTERS = ["A", "B", "C", "D", "E", "F"];

/* Iconos SVG inline (mismo patrón que el resto del shell, sin CDN) */
const svgTag = p => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + "</svg>";
const IC = {
  info:       '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  arrow:      '<circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="m12 16 4-4-4-4"/>',
  signal:     '<circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49"/><path d="M7.76 16.24a6 6 0 0 1 0-8.49"/><path d="M4.93 19.07a10 10 0 0 1 0-14.14"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>',
  feather:    '<path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" x2="2" y1="8" y2="22"/><line x1="17.5" x2="9" y1="15" y2="15"/>',
  lang:       '<path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/>',
  list:       '<line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/>',
  download:   '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
  sparkles:   '<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>',
  chev:       '<path d="m9 18 6-6-6-6"/>',
  file:       '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/>',
  flag:       '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/>',
  graph:      '<circle cx="5" cy="12" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="19" cy="18" r="2"/><path d="M7 12h10"/><path d="m9.6 10.7 7.9-3.4"/><path d="m9.6 13.3 7.9 3.4"/>',
  trophy:     '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>'
};
const FUN_ICONS = { azul: IC.info, rojo: IC.arrow, verde: IC.signal, morado: IC.feather, ambar: IC.lang };
const FUN_PILLS = { azul: "Informar", rojo: "Acción", verde: "Contacto", morado: "Forma", ambar: "Lenguaje" };

let state = null;
let quizData = [];
let lastSubject = null;
let navOpen = {};
let alumnos = [];
let pagos = [];
let asistencias = [];

const $ = s => document.querySelector(s);
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fmtMX = n => (n == null ? "-" : "$" + Number(n).toLocaleString("es-MX") + ".00");

/* ---------------- Estado (localStorage) ---------------- */
function defaultState() {
  return { xp: 0, racha: 0, best: 0, correct: 0, wrong: 0, retos: 0, mastered: 0, done: [], answers: {}, picked: {}, badges: [] };
}
function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return Object.assign(defaultState(), JSON.parse(raw));
  } catch (e) { /* ignorar */ }
  return defaultState();
}
function saveState() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* ignorar */ }
}
function loadAlumnos() {
  try {
    const raw = localStorage.getItem(ALUMNOS_KEY);
    alumnos = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(alumnos)) alumnos = [];
  } catch (e) { alumnos = []; }
}
function saveAlumnos() {
  try { localStorage.setItem(ALUMNOS_KEY, JSON.stringify(alumnos)); } catch (e) { /* ignorar */ }
}
function loadPagos() {
  try {
    const raw = localStorage.getItem(PAGOS_KEY);
    pagos = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(pagos)) pagos = [];
  } catch (e) { pagos = []; }
}
function savePagos() {
  try { localStorage.setItem(PAGOS_KEY, JSON.stringify(pagos)); } catch (e) { /* ignorar */ }
}
function loadAsistencias() {
  try {
    const raw = localStorage.getItem(ASISTENCIA_KEY);
    asistencias = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(asistencias)) asistencias = [];
  } catch (e) { asistencias = []; }
}
function saveAsistencias() {
  try { localStorage.setItem(ASISTENCIA_KEY, JSON.stringify(asistencias)); } catch (e) { /* ignorar */ }
}

function award(xp, opts) {
  opts = opts || {};
  state.xp += xp;
  if (opts.racha !== false) { state.racha++; if (state.racha > state.best) state.best = state.racha; }
  else { state.racha = 0; }
  if (opts.retos) state.retos++;
  checkBadges();
  saveState();
  paintStats();
  toast((opts.label ? opts.label + " &middot; " : "") + "+" + xp + " XP");
  if (opts.racha !== false && state.racha > 0 && state.racha % 3 === 0) {
    setTimeout(() => toast("\u{1F525} \u00a1Racha de " + state.racha + "!"), 900);
  }
}
function fail() {
  state.wrong++;
  state.racha = 0;
  saveState();
  paintStats();
}
function checkBadges() {
  BADGES.forEach(b => { if (!state.badges.includes(b.id) && b.test(state)) state.badges.push(b.id); });
}

/* ---------------- Utilidades de datos ---------------- */
const findSubject = id => DATA.subjects.find(s => s.id === id) || null;
const doneKey = (id, u) => id + "/u" + u;
const quizKey = (id, u, part) => id + "/u" + u + "/" + part;
const practiceKey = (id, u, i) => id + "/u" + u + "/ex" + i;
const isDone = (id, u) => state.done.includes(doneKey(id, u));
function totalReadyUnits() {
  return DATA.subjects.reduce((n, s) => n + (s.ready ? s.units.length : 0), 0);
}
function totalDoneUnits() {
  return state.done.filter(k => DATA.subjects.some(s => s.ready && s.units.some(u => doneKey(s.id, u.num) === k))).length;
}
function subjectDone(sub) {
  return sub.units.filter(u => isDone(sub.id, u.num)).length;
}
function nextStudyTarget() {
  for (const s of DATA.subjects) {
    if (!s.ready) continue;
    for (const u of s.units) if (!isDone(s.id, u.num)) return { sub: s, unit: u };
  }
  return null;
}
function practiceResult(sub, unit) {
  const total = unit.ejercicios.length;
  let answered = 0, correct = 0;
  unit.ejercicios.forEach((_, i) => {
    const v = state.answers[practiceKey(sub.id, unit.num, i)];
    if (v === undefined) return;
    answered++;
    if (v === 1) correct++;
  });
  const tipo = state.answers[quizKey(sub.id, unit.num, "tipo")];
  const reto = state.answers[quizKey(sub.id, unit.num, "reto")];
  let t = tipo === undefined ? null : tipo;
  let r = reto === undefined ? null : reto;
  return { total, answered, correct, t, r };
}

/* ---------------- Modo "escribe la respuesta" (Matemáticas) ---------------- */
const TYPE_MODE = sub => sub && sub.id === "matematicas";
const acceptedOf = x => (Array.isArray(x.v) && x.v.length ? x.v : [String(x.a)]);
const stepsOf = x => (Array.isArray(x.pasos) && x.pasos.length ? x.pasos : [x.p]);

function normAns(s) {
  let t = String(s == null ? "" : s).toLowerCase().trim();
  t = t.replace(/[−–—]/g, "-");
  t = t.replace(/[áàäâ]/g, "a").replace(/[éèëê]/g, "e").replace(/[íìïî]/g, "i")
       .replace(/[óòöô]/g, "o").replace(/[úùüû]/g, "u").replace(/ñ/g, "n");
  t = t.replace(/[$%]/g, "");
  t = t.replace(/(cm|mm|km|m|kg|g|l|h|hrs?|min|seg|s)\s*([23²³])?(?![a-z0-9])/g, "");
  t = t.replace(/°/g, "");
  t = t.replace(/²/g, "2").replace(/³/g, "3").replace(/¹/g, "1");
  t = t.replace(/[\^×·*÷]/g, "");
  t = t.replace(/(?<=\d)x(?=\d)/g, "");
  t = t.replace(/\s+/g, "");
  t = t.replace(/[.,;:]+$/, "").replace(/^[.,;:]+/, "");
  return t;
}
function numOf(s) {
  let t = normAns(s);
  t = t.replace(/,/g, ".");
  if (/^[+-]?\d+(\.\d+)?$/.test(t)) return parseFloat(t);
  const mixed = t.match(/^([+-]?\d+)(\d+)\/(\d+)$/);
  if (mixed) return parseInt(mixed[1], 10) + (parseInt(mixed[2], 10) / parseInt(mixed[3], 10));
  const fr = t.match(/^([+-]?\d+)\/(\d+)$/);
  if (fr) return parseInt(fr[1], 10) / parseInt(fr[2], 10);
  const pct = t.match(/^([+-]?\d+(?:\.\d+)?)%?$/);
  if (pct) return parseFloat(pct[1]);
  return null;
}
function answerMatches(userRaw, accepted) {
  const u = normAns(userRaw);
  if (!u) return false;
  const un = numOf(userRaw);
  for (const a of accepted) {
    if (normAns(a) === u) return true;
    const an = numOf(a);
    if (un !== null && an !== null && Math.abs(un - an) < 1e-6) return true;
  }
  return false;
}
/* ---------------- Notación matemática (fracciones apiladas) ---------------- */
function isMathSubject(sub) { return !!sub && (sub.id === "matematicas" || sub.id === "habilidad-matematica"); }
const FRAC_RX = /\d+\s*\/\s*\d+/g;
const FRAC_TEST = /\d\s*\/\s*\d/;
function fmtMathInEl(root) {
  if (!root) return;
  const REJECT = { INPUT: 1, TEXTAREA: 1, SCRIPT: 1, STYLE: 1, SVG: 1 };
  const nodes = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(n) {
      const p = n.parentNode;
      if (!p || REJECT[p.nodeName]) return NodeFilter.FILTER_REJECT;
      const cl = p.classList;
      if (cl && (cl.contains("frac") || cl.contains("frac-n") || cl.contains("frac-d") || cl.contains("ex-input"))) return NodeFilter.FILTER_REJECT;
      return FRAC_TEST.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  });
  while (walker.nextNode()) nodes.push(walker.currentNode);
  for (const n of nodes) {
    const s = n.nodeValue;
    if (!FRAC_TEST.test(s)) continue;
    const frag = document.createDocumentFragment();
    let last = 0, m;
    FRAC_RX.lastIndex = 0;
    while ((m = FRAC_RX.exec(s))) {
      if (m.index > last) frag.appendChild(document.createTextNode(s.slice(last, m.index)));
      const a = m[0].split("/")[0].trim();
      const b = m[0].split("/")[1].trim();
      const span = document.createElement("span");
      span.className = "frac";
      const num = document.createElement("span"); num.className = "frac-n"; num.textContent = a;
      const den = document.createElement("span"); den.className = "frac-d"; den.textContent = b;
      span.appendChild(num); span.appendChild(den);
      frag.appendChild(span);
      last = m.index + m[0].length;
    }
    if (last < s.length) frag.appendChild(document.createTextNode(s.slice(last)));
    if (n.parentNode) n.parentNode.replaceChild(frag, n);
  }
}
function typeFeedback(ok, pasos, res) {
  const body =
    '<div class="ex-proc"' + (ok ? "" : ' style="display:none"') + '>' +
      '<div class="ex-proc-head">\u{1F4DD} Procedimiento correcto</div>' +
      '<ol class="ex-proc-list">' + pasos.map(p => "<li>" + esc(p) + "</li>").join("") + "</ol>" +
      '<div class="ex-proc-res">\u2705 Respuesta: <b>' + esc(res) + "</b></div>" +
    "</div>";
  return (
    '<div class="ex-fb ' + (ok ? "ok" : "no") + '">' +
      '<div class="ex-fb-title">' + (ok ? "\u{1F389} \u00a1Correcto!" : "\u{1F643} A\u00fan no es correcto") + "</div>" +
      body +
      (ok ? "" : '<button class="btn-revealproc" data-action="revealproc">\u{1F441}\uFE0F Ver procedimiento correcto</button>') +
    "</div>"
  );
}
function exerciseHTML(sub, unit, x, i) {
  const d = DIFF[i < 3 ? 0 : i < 6 ? 1 : 2];
  const ky = practiceKey(sub.id, unit.num, i);
  const v = state.answers[ky];
  const fig = x.fig ? '<div class="ex-fig">' + x.fig + "</div>" : "";
  const qrow =
    '<div class="ex-q"><span class="qb">Q</span><span>' + (i + 1) + ". " + esc(x.q) +
    '</span><span class="diff-chip ' + d.cls + '">' + d.emoji + " " + d.label + "</span></div>";

  if (TYPE_MODE(sub)) {
    const pasos = stepsOf(x);
    const accepted = JSON.stringify(acceptedOf(x));
    const actions = v === undefined
      ? '<div class="ex-actions ex-actions-type">' +
          '<input class="ex-input" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Escribe tu respuesta\u2026" data-key="' + ky + '">' +
          '<button class="btn-check" data-action="check" data-key="' + ky + '" data-acc="' + esc(accepted) + '" data-steps="' + esc(pasos.join("\n")) + '" data-res="' + esc(x.a) + '">Comprobar</button>' +
        "</div>"
      : "";
    const fb = v === undefined ? "" : typeFeedback(v === 1, pasos, x.a);
    return "<div class='ex-item ex-type' data-key='" + ky + "'>" + qrow + fig + actions + fb + "</div>";  }

  return (
    "<div class='ex-item' data-key='" + ky + "'>" +
      qrow + fig +
      "<div class='ex-actions'>" +
        '<button class="btn-hint" data-action="hint" data-key="' + ky + '">\u{1F4A1} Pista</button>' +
        '<button class="btn-reveal" data-action="reveal" data-key="' + ky + '">\u{1F441}\uFE0F Soluci\u00f3n</button>' +
      "</div>" +
      '<div class="ex-ans">' +
        '<div class="ex-ans-pista" data-el="pista" style="display:none;font-size:13.5px;color:var(--muted);margin-bottom:8px">\u{1F4A1} <b>Pista:</b> ' + esc(x.p) + "</div>" +
        '<div class="ex-ans-res" data-el="res" style="display:none">' +
          '<div class="ans-a">\u2705 Respuesta: ' + esc(x.a) + "</div>" +
          '<div class="ans-p" style="margin:2px 0 8px">Pista: ' + esc(x.p) + "</div>" +
          '<div data-el="verdict"' + (v === undefined ? ' style="display:none"' : "") + ">" +
            (v === undefined ? selfCheckButtons(ky, sub.color) : (v === 1 ? "<b style='color:var(--ok)'>\u2713 \u00a1Bien!</b>" : "<b style='color:var(--bad)'>\u2717 Rep\u00e1salo y vuelve a intentarlo</b>")) +
          "</div>" +
        "</div>" +
      "</div>" +
      (v === undefined ? "" : '<div class="ex-ans open" style="background:#F0FDF4"><b style="color:var(--ok)">Registrado.</b> Puedes ver la soluci\u00f3n arriba.</div>') +
    "</div>"
  );
}
/* ---------------- Accento por materia ---------------- */
function setAccent(color) {
  document.documentElement.style.setProperty("--accent", color || "#334155");
}

/* ---------------- Pintado global ---------------- */
function paintStats() {
  const xp = $("#stat-xp"), rc = $("#stat-racha");
  if (xp) xp.textContent = "\u2699\u{FE0F} " + state.xp + " XP";
  if (rc) rc.textContent = "\u{1F525} " + state.racha;
  paintProgress();
}
function paintProgress() {
  const ready = totalReadyUnits(), doneU = totalDoneUnits();
  const pct = ready ? Math.round((doneU / ready) * 100) : 0;
  const bar = $("#side-prog-bar"), tp = $("#top-prog-bar");
  const pb = $("#side-prog-pct"), tp2 = $("#top-prog-pct");
  if (bar) bar.style.width = pct + "%";
  if (tp) tp.style.width = pct + "%";
  if (pb) pb.textContent = pct + "%";
  if (tp2) tp2.textContent = pct + "%";
}
function toast(msg) {
  let el = $("#xp-toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "xp-toast";
    el.className = "xp-toast";
    document.body.appendChild(el);
  }
  el.innerHTML = msg;
  el.classList.add("show");
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove("show"), 1600);
}

/* ---------------- Router ---------------- */
function currentRoute() {
  const h = location.hash.replace(/^#\/?/, "");
  const parts = h.split("/").filter(Boolean);
  if (parts[0] === "m" && parts[1]) {
    const sub = findSubject(parts[1]);
    if (!sub) return { view: "404" };
    if (parts[2] === "u" && parts[3]) {
      const unum = parseInt(parts[3], 10);
      let unit = null;
      if (sub.ready) unit = sub.units.find(u => u.num === unum) || null;
      return { view: "lesson", sub, unit };
    }
    return { view: "subject", sub };
  }
  if (parts[0] === "mate") return { view: "mate" };
  if (parts[0] === "lectura") return { view: "lectura" };
  if (parts[0] === "sistema") {
    if (parts[1] === "asistencia") return { view: "asistencia" };
    if (parts[1] === "pagos") return { view: "pagos" };
    if (parts[1] === "planificacion") return { view: "planificacion" };
    if (parts[1] === "taller") return { view: "taller" };
    if (parts[1] === "perfil") return { view: "perfil" };
    if (parts[1] === "concentrado") return { view: "concentrado" };
    if (parts[1] === "catalogo") return { view: "catalogo" };
    return { view: "asistencia" };
  }
  return { view: "home" };
}
function route() {
  closeSidebar();
  const r = currentRoute();
  renderNav();
  if (r.view === "404") { render404(); return; }
  if (r.view === "mate") { setAccent(DATA.subjects.find(s=>s.id==='matematicas').color); renderMate(); return; }
  if (r.view === "lectura") { setAccent(null); renderLectura(); return; }
  if (r.view === "asistencia") { setAccent('#2563EB'); renderAsistencia(); return; }
  if (r.view === "pagos") { setAccent('#059669'); renderPagos(); return; }
  if (r.view === "planificacion") { setAccent('#4F46E5'); renderPlanificacion(); return; }
  if (r.view === "taller") { setAccent('#0F766E'); renderTaller(); return; }
  if (r.view === "perfil") { setAccent('#BE123C'); renderPerfil(); return; }
  if (r.view === "concentrado") { setAccent('#B45309'); renderConcentrado(); return; }
  if (r.view === "catalogo") { setAccent('#0891B2'); renderCatalogo(); return; }
  if (r.view === "subject") { setAccent(r.sub.color); renderSubject(r.sub); if (isMathSubject(r.sub)) fmtMathInEl($("#view")); return; }
  if (r.view === "lesson") { if (!r.unit) { render404(); return; } setAccent(r.sub.color); renderLesson(r.sub, r.unit); if (isMathSubject(r.sub)) fmtMathInEl($("#view")); return; }
  setAccent(null);
  renderHome();
}

/* ---------------- Sidebar / menú móvil ---------------- */
const NAV_KEY = "ecoems_nav_open";
function loadNav() {
  try {
    const raw = localStorage.getItem(NAV_KEY);
    if (raw) navOpen = JSON.parse(raw) || {};
  } catch (e) { navOpen = {}; }
}
function saveNav() {
  try { localStorage.setItem(NAV_KEY, JSON.stringify(navOpen)); } catch (e) { /* ignorar */ }
}
function renderNav() {
  const r = currentRoute();
  const lectOpen = r.view === "lectura" || !!navOpen["lectura"];
  const lectGroup =
    '<div class="nav-group">' +
      '<a class="nav-sub' + (r.view === "lectura" ? " active" : "") + '" href="#/lectura" data-sub="lectura">' +
        '<span class="nav-icon">\u{1F4D6}</span>' +
        '<span class="nav-name">Lectura y velocidad</span>' +
        '<span class="nav-chevron' + (lectOpen ? " open" : "") + '">\u25b8</span>' +
      "</a>" +
      '<div class="nav-units' + (lectOpen ? " open" : "") + '">' +
        '<a class="nav-lesson' + (r.view === "lectura" ? " active" : "") + '" href="#/lectura">' +
          '<span class="nav-lesson-icon">\u25b8</span>' +
          '<span class="nav-lesson-name">Herramientas de lectura</span>' +
        "</a>" +
      "</div>" +
    "</div>";
  const mateOpen = r.view === "mate" || !!navOpen["mate"];
  const mateGroup =
    '<div class="nav-group">' +
      '<a class="nav-sub' + (r.view === "mate" ? " active" : "") + '" href="#/mate" data-sub="mate">' +
        '<span class="nav-icon">\u{1F4DD}</span>' +
        '<span class="nav-name">Banco de Matem\u00e1ticas</span>' +
        '<span class="nav-chevron' + (mateOpen ? " open" : "") + '">\u25b8</span>' +
      "</a>" +
      '<div class="nav-units' + (mateOpen ? " open" : "") + '">' +
        '<a class="nav-lesson' + (r.view === "mate" ? " active" : "") + '" href="#/mate">' +
          '<span class="nav-lesson-icon">\u25b8</span>' +
          '<span class="nav-lesson-name">Banco de ejercicios</span>' +
        "</a>" +
      "</div>" +
    "</div>";
  const sistViews = ["asistencia", "pagos", "planificacion", "taller", "perfil", "concentrado", "catalogo"];
  const sistOpen = sistViews.indexOf(r.view) >= 0 || !!navOpen["sistema"];
  const sistLink = (view, href, label) =>
    '<a class="nav-lesson' + (r.view === view ? " active" : "") + '" href="' + href + '">' +
      '<span class="nav-lesson-icon">\u25b8</span>' +
      '<span class="nav-lesson-name">' + label + "</span>" +
    "</a>";
  const sistGroup =
    '<div class="nav-group">' +
      '<a class="nav-sub' + (sistViews.indexOf(r.view) >= 0 ? " active" : "") + '" href="#/sistema/asistencia" data-sub="sistema">' +
        '<span class="nav-icon">\u{1F4CA}</span>' +
        '<span class="nav-name">Sistema</span>' +
        '<span class="nav-chevron' + (sistOpen ? " open" : "") + '">\u25b8</span>' +
      "</a>" +
      '<div class="nav-units' + (sistOpen ? " open" : "") + '">' +
        sistLink("asistencia", "#/sistema/asistencia", "Asistencia") +
        sistLink("pagos", "#/sistema/pagos", "Pagos") +
        sistLink("planificacion", "#/sistema/planificacion", "Planificaci\u00f3n") +
        sistLink("taller", "#/sistema/taller", "Taller vocacional") +
        sistLink("catalogo", "#/sistema/catalogo", "Cat\u00e1logo de escuelas") +
        sistLink("perfil", "#/sistema/perfil", "Perfil del alumno") +
        sistLink("concentrado", "#/sistema/concentrado", "Concentrado de tareas") +
      "</div>" +
    "</div>";
  $("#side-nav").innerHTML = lectGroup + DATA.subjects.map(s => {
    const hasUnits = s.ready && s.units && s.units.length;
    const activeSub = r.view !== "home" && r.sub && r.sub.id === s.id;
    const activeLesson = activeSub && r.view === "lesson" && r.unit;
    const open = hasUnits && (!!navOpen[s.id] || !!activeLesson);
    const units = hasUnits ? s.units.map(u =>
      '<a class="nav-lesson' + (activeLesson && r.unit.num === u.num ? " active" : "") + '" href="#/m/' + esc(s.id) + "/u/" + u.num + '">' +
        '<span class="nav-lesson-icon">\u25b8</span>' +
        '<span class="nav-lesson-name">Unidad ' + u.num + "</span>" +
      "</a>"
    ).join("") : "";
    return '<div class="nav-group">' +
      '<a class="nav-sub' + (activeSub && !activeLesson ? " active" : "") + '" href="#/m/' + esc(s.id) + '" data-sub="' + esc(s.id) + '">' +
        '<span class="nav-icon">' + s.icon + "</span>" +
        '<span class="nav-name">' + esc(s.num) + ". " + esc(s.name) + "</span>" +
        (hasUnits ? '<span class="nav-chevron' + (open ? " open" : "") + '">\u25b8</span>'
                  : '<span class="nav-tag">pronto</span>') +
      "</a>" +
      '<div class="nav-units' + (open ? " open" : "") + '">' + units + "</div>" +
    "</div>";
  }).join("") + mateGroup + sistGroup;
}
function setupNavToggles() {
  $("#side-nav").addEventListener("click", ev => {
    const sub = ev.target.closest(".nav-sub");
    if (!sub) return;
    const group = sub.parentElement;
    const units = group.querySelector(".nav-units");
    if (!units) return;
    ev.preventDefault();
    const id = sub.dataset.sub;
    navOpen[id] = !units.classList.contains("open");
    saveNav();
    units.classList.toggle("open", navOpen[id]);
    const ch = sub.querySelector(".nav-chevron");
    if (ch) ch.classList.toggle("open", navOpen[id]);
  });
}
function openSidebar() { $("#sidebar").classList.add("open"); $("#overlay").hidden = false; $("#overlay").classList.add("show"); }
function closeSidebar() { $("#sidebar").classList.remove("open"); $("#overlay").classList.add("hidden"); $("#overlay").hidden = true; $("#overlay").classList.remove("show"); }

/* ---------------- Sidebar colapsable (todo el panel) ---------------- */
const SIDEBAR_OFF_KEY = "ecoems_sidebar_off";
function isDesktop() { return !window.matchMedia("(max-width:900px)").matches; }
function setSidebarOff(off) {
  document.body.classList.toggle("sidebar-off", off);
  try { localStorage.setItem(SIDEBAR_OFF_KEY, off ? "1" : "0"); } catch (e) { /* ignorar */ }
}
function toggleSidebar() {
  if (isDesktop()) setSidebarOff(!document.body.classList.contains("sidebar-off"));
  else openSidebar();
}
function initSidebarCollapse() {
  try { if (isDesktop() && localStorage.getItem(SIDEBAR_OFF_KEY) === "1") document.body.classList.add("sidebar-off"); } catch (e) { /* ignorar */ }
}

/* ---------------- LECTURA (herramientas embebidas) ---------------- */
function renderLectura() {
  breadcrumbs([{ label: "Lectura y velocidad", href: "#/lectura" }]);
$("#view").innerHTML =
    '<section class="subject-hero">' +
      '<span class="sh-icon" style="background:#0284C7">\u{1F4D6}</span>' +
      "<div>" +
        "<h1>Lectura y velocidad</h1>" +
        "<p>Cuatro pr\u00e1cticas para leer m\u00e1s, m\u00e1s r\u00e1pido y m\u00e1s fluido: retos que suben de dificultad, velocidad palabra por palabra, lectura en voz alta con micr\u00f3fono y el juego para el sal\u00f3n. Elige la pesta\u00f1a que quieras dentro de la pr\u00e1ctica.</p>" +
      "</div>" +
    "</section>" +
    '<iframe id="lectura-frame" src="../herramientas-lectura.html" title="Herramientas de lectura" style="width:100%;height:1540px;border:1px solid var(--line);border-radius:16px;background:#F8FAFC;box-shadow:var(--shadow-card)"></iframe>';
}

/* =============================================================
   SISTEMA · Gestión de alumnos, asistencia y pagos (localStorage)
   ============================================================= */
const PLANES = [
  { id: "contado",    nombre: "Contado",     total: 4000, nota: "Un solo pago de $4,000" },
  { id: "dos-pagos",  nombre: "2 pagos",     total: 4200, nota: "2 pagos de $2,100 (hoy + enero)" },
  { id: "mensual",    nombre: "Mensual",     total: 4500, nota: "10 pagos de $450 (sep–jun)" },
  { id: "semanal",    nombre: "Semanal",     total: 5000, nota: "~40 pagos de $125" }
];
const TIPOS = [
  { id: "general",  nombre: "General",       nota: "Precio de lista" },
  { id: "fundador", nombre: "Fundador",      nota: "Primeras 4 · 2 amigos = $1,000" },
  { id: "especial", nombre: "Especial/Beca", nota: "Monto manual por trato especial" }
];
const METODOS = ["Efectivo", "Transferencia", "Tarjeta", "Depósito", "Otro"];
const ESTADOS_ASIS = ["Presente", "Tardanza", "Justificado", "Ausente"];
const ASIS_SHORT = { Presente: "P", Tardanza: "T", Justificado: "J", Ausente: "A" };
const grupos = () => Array.from(new Set(alumnos.map(a => a.grupo).filter(Boolean))).sort();

let sistemaUI = { fecha: hoyISO(), grupo: "", busqueda: "", planFiltro: "", planFiltroEstado: "todas", planBusqueda: "", sesionAbierta: null, tallerId: null, perfilId: null, concArea: "", concModo: "tareas", catInst: "todas", catTag: "todas", catDist: "todas", catBusqueda: "" };

function hoyISO() {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
function planDe(id) { return PLANES.find(p => p.id === id) || { id: id || "", nombre: id || "Sin plan", total: 0, nota: "" }; }
function tipoDe(id) { return TIPOS.find(t => t.id === id) || TIPOS[0]; }
function alumnoById(id) { return alumnos.find(a => a.id === id) || null; }
function pagosDe(id) { return pagos.filter(p => p.alumnoId === id); }
function pagadoDe(id) { return pagosDe(id).reduce((s, p) => s + Number(p.monto || 0), 0); }
function montoBaseDe(a) { return Number(a.planMonto != null ? a.planMonto : planDe(a.plan).total) || 0; }
function amigosDe(a) { return Array.isArray(a.amigos) ? a.amigos : []; }
function amigosPagados(a) { return amigosDe(a).filter(x => x.pago).length; }
function descuentoDe(a) {
  if (a.tipo === "especial") return 0;
  const n = amigosPagados(a);
  if (a.tipo === "fundador") {
    if (n >= 2) return Math.max(0, montoBaseDe(a) - 1000);
    return n === 1 ? 500 : 0;
  }
  if (n >= 2) return 1000;
  return n === 1 ? 500 : 0;
}
function totalPlanDe(a) {
  if (a.tipo === "especial") return Number(a.montoTotal != null ? a.montoTotal : montoBaseDe(a)) || 0;
  return Math.max(0, montoBaseDe(a) - descuentoDe(a));
}
function saldoDe(a) { return totalPlanDe(a) - pagadoDe(a.id); }
function estadoPagoDe(a) {
  const total = totalPlanDe(a), pag = pagadoDe(a.id);
  if (pag <= 0) return "Pendiente";
  if (pag >= total && total > 0) return "Pagado";
  return "Parcial";
}
function asisDe(alumnoId, fecha) { return asistencias.find(x => x.alumnoId === alumnoId && x.fecha === fecha) || null; }
function conteoAsis(id) {
  const regs = asistencias.filter(a => a.alumnoId === id);
  const c = { Presente: 0, Tardanza: 0, Justificado: 0, Ausente: 0, total: regs.length };
  regs.forEach(r => { if (c[r.estado] != null) c[r.estado]++; });
  return c;
}
function pctAsis(id) {
  const c = conteoAsis(id);
  if (!c.total) return null;
  return Math.round(((c.Presente + c.Tardanza * 0.5) / c.total) * 100);
}
/* ---- Modal genérico ---------------- */
function ensureModal() {
  let m = document.getElementById("sistema-modal");
  if (!m) {
    m = document.createElement("div");
    m.id = "sistema-modal";
    m.className = "modal-overlay";
    m.hidden = true;
    m.innerHTML =
      '<div class="modal-card" role="dialog" aria-modal="true">' +
        '<div class="modal-head"><h3 id="modal-title"></h3><button class="modal-x" data-modal-close aria-label="Cerrar">&times;</button></div>' +
        '<div class="modal-body" id="modal-body"></div>' +
      "</div>";
    document.body.appendChild(m);
    m.addEventListener("click", ev => { if (ev.target === m || ev.target.closest("[data-modal-close]")) closeModal(); });
    document.addEventListener("keydown", ev => { if (ev.key === "Escape") closeModal(); });
  }
  return m;
}
function openModal(title, bodyHTML) {
  const m = ensureModal();
  m.querySelector(".modal-card").classList.remove("modal-wide");
  m.querySelector("#modal-title").innerHTML = title;
  m.querySelector("#modal-body").innerHTML = bodyHTML;
  m.hidden = false;
  setTimeout(() => { const f = m.querySelector("input,select,textarea"); if (f) f.focus(); }, 40);
}
function closeModal() { const m = document.getElementById("sistema-modal"); if (m) m.hidden = true; }

/* ---------------- Migración de datos antiguos ---------------- */
function migrarAlumnos() {
  const mapa = { "Mensual": "mensual", "Trimestral": "dos-pagos", "Semestral": "dos-pagos", "Único": "contado", "Pago único": "contado", "Unico": "contado", "Trimestral ": "dos-pagos" };
  let cambio = false;
  alumnos.forEach(a => {
    if (!a.tipo || !TIPOS.some(t => t.id === a.tipo)) { a.tipo = "general"; cambio = true; }
    if (!Array.isArray(a.amigos)) { a.amigos = []; cambio = true; }
    if (!PLANES.some(p => p.id === a.plan)) {
      const id = mapa[a.plan] || "mensual";
      a.plan = id;
      cambio = true;
      if (a.planMonto == null) { a.planMonto = Number(a.monto) || planDe(id).total; }
    } else if (a.planMonto == null) {
      a.planMonto = Number(a.monto) || planDe(a.plan).total;
      cambio = true;
    }
    delete a.pagado; delete a.saldo; delete a.metodo; delete a.fecha; delete a.monto;
  });
  if (cambio) saveAlumnos();
}

/* ---------------- Semilla inicial ---------------- */
function ensureSeed() {
  if (alumnos.length) return;
  const base = [
    { nombre: "Ana Martínez",    grupo: "A", tutor: "Sra. Martínez", telefono: "55 1234 5678", tipo: "general",  plan: "mensual",   planMonto: 4500, amigos: [] },
    { nombre: "Carlos López",    grupo: "A", tutor: "Sr. López",     telefono: "55 2222 3344", tipo: "general",  plan: "contado",   planMonto: 4000, amigos: [{ id: uid(), nombre: "Luis Pérez", pago: true }] },
    { nombre: "Diana Cruz",      grupo: "B", tutor: "Sra. Cruz",     telefono: "55 8888 9900", tipo: "fundador", plan: "contado",   planMonto: 4000, amigos: [{ id: uid(), nombre: "Sofía Ruiz", pago: true }, { id: uid(), nombre: "Mateo Gil", pago: true }] },
    { nombre: "Eduardo Ramírez", grupo: "A", tutor: "Sr. Ramírez",   telefono: "55 1111 2222", tipo: "general",  plan: "dos-pagos", planMonto: 4200, amigos: [] },
    { nombre: "Fernanda Díaz",   grupo: "B", tutor: "Sra. Díaz",     telefono: "55 3333 4444", tipo: "especial", plan: "contado",   planMonto: 4000, montoTotal: 0, amigos: [] },
    { nombre: "Gabriel Torres",  grupo: "B", tutor: "Sr. Torres",    telefono: "55 6666 7777", tipo: "general",  plan: "semanal",   planMonto: 5000, amigos: [] }
  ];
  alumnos = base.map(s => Object.assign({ id: uid(), inscripcion: "2026-09-19", activo: true }, s));
  saveAlumnos();

  const [a0, a1, a2, a3, a4, a5] = alumnos;
  pagos = [
    { id: uid(), alumnoId: a0.id, concepto: "Mensualidad septiembre", monto: 450,  metodo: "Transferencia", fecha: "2026-09-19" },
    { id: uid(), alumnoId: a0.id, concepto: "Mensualidad octubre",    monto: 450,  metodo: "Transferencia", fecha: "2026-09-19" },
    { id: uid(), alumnoId: a1.id, concepto: "Pago de contado (con 1 amigo)", monto: 3500, metodo: "Efectivo", fecha: "2026-09-19" },
    { id: uid(), alumnoId: a2.id, concepto: "Pago fundador (2 amigos)", monto: 1000, metodo: "Efectivo",     fecha: "2026-10-01" },
    { id: uid(), alumnoId: a3.id, concepto: "Primer pago de 2",       monto: 2100, metodo: "Transferencia", fecha: "2026-09-20" },
    { id: uid(), alumnoId: a4.id, concepto: "Beca fundadora",         monto: 0,    metodo: "Otro",          fecha: "2026-09-28" },
    { id: uid(), alumnoId: a5.id, concepto: "Semana 1",               monto: 125,  metodo: "Efectivo",      fecha: "2026-09-22" }
  ];
  savePagos();

  asistencias = [];
  const fechas = ["2026-09-19", "2026-09-26", "2026-10-03", "2026-10-10"];
  alumnos.forEach((al, ai) => {
    fechas.forEach((f, fi) => {
      let estado = "Presente";
      if (ai === 1 && fi === 1) estado = "Ausente";
      if (ai === 5 && fi === 3) estado = "Tardanza";
      if (ai === 2 && fi === 2) estado = "Justificado";
      asistencias.push({ id: uid(), alumnoId: al.id, fecha: f, estado });
    });
  });
  saveAsistencias();
}

function badgeTipo(id) {
  const map = {
    general:  { bg: "#EEF2FF", bd: "#C7D2FE", fg: "#3730A3" },
    fundador: { bg: "#FFFBEB", bd: "#FDE68A", fg: "#92400E" },
    especial: { bg: "#F5F3FF", bd: "#DDD6FE", fg: "#5B21B6" }
  }[id] || { bg: "#F1F5F9", bd: "#E2E8F0", fg: "#334155" };
  return '<span class="chip" style="background:' + map.bg + ";border-color:" + map.bd + ";color:" + map.fg + '">' + esc(tipoDe(id).nombre) + "</span>";
}
function badgeEstadoPago(est) {
  const map = {
    Pagado:    { bg: "#F0FDF4", bd: "#BBF7D0", fg: "#166534" },
    Parcial:   { bg: "#FFFBEB", bd: "#FDE68A", fg: "#92400E" },
    Pendiente: { bg: "#FEF2F2", bd: "#FECACA", fg: "#991B1B" }
  }[est] || { bg: "#F1F5F9", bd: "#E2E8F0", fg: "#334155" };
  return '<span class="chip" style="background:' + map.bg + ";border-color:" + map.bd + ";color:" + map.fg + '">' + est + "</span>";
}

/* ---------------- SISTEMA · ASISTENCIA ---------------- */
function renderAsistencia() {
  breadcrumbs([{ label: "Sistema", href: "#/sistema/asistencia" }, { label: "Asistencia" }]);
  const fecha = sistemaUI.fecha || hoyISO();
  const lista = alumnos.filter(a => !sistemaUI.grupo || a.grupo === sistemaUI.grupo);
  const presentes = asistencias.filter(x => x.fecha === fecha && x.estado === "Presente").length;
  const marcados = asistencias.filter(x => x.fecha === fecha).length;

  const filas = lista.length ? lista.map(a => {
    const reg = asisDe(a.id, fecha);
    const est = reg ? reg.estado : null;
    const btns = ESTADOS_ASIS.map(e => {
      const on = est === e;
      return '<button class="asis-btn asis-' + ASIS_SHORT[e] + (on ? " on" : "") + '" data-action="asis-set" data-id="' + a.id + '" data-estado="' + e + '" title="' + e + '">' + ASIS_SHORT[e] + "</button>";
    }).join("");
    const c = conteoAsis(a.id), pct = pctAsis(a.id);
    return "<tr>" +
      '<td class="st-name"><b>' + esc(a.nombre) + "</b><span>Grupo " + esc(a.grupo || "-") + "</span></td>" +
      '<td><div class="asis-toggle">' + btns + "</div></td>" +
      '<td class="st-num">' + c.Presente + "</td>" +
      '<td class="st-num">' + c.Tardanza + "</td>" +
      '<td class="st-num">' + c.Justificado + "</td>" +
      '<td class="st-num">' + c.Ausente + "</td>" +
      '<td class="st-num"><b style="color:' + (pct == null ? "var(--muted)" : pct >= 80 ? "var(--ok)" : pct >= 60 ? "var(--warn)" : "var(--bad)") + '">' + (pct == null ? "-" : pct + "%") + "</b></td>" +
      "</tr>";
  }).join("") : '<tr><td colspan="7" class="st-empty">Sin alumnos. Agrega un alumno para comenzar.</td></tr>';

  $("#view").innerHTML =
    '<section class="subject-hero" style="background:linear-gradient(135deg,#2563EB 0%,#1E40AF 100%)">' +
      '<span class="sh-icon" style="background:#1E40AF">\u{1F4CB}</span>' +
      "<div>" +
        "<h1>Asistencia de Alumnos</h1>" +
        "<p>Registra presente, tardanza, justificado o falta por sesión. El porcentaje se calcula automáticamente.</p>" +
      "</div>" +
    "</section>" +
    '<div class="grid" style="margin-bottom:16px">' +
      '<div class="card"><div class="sys-kpi-lbl">ALUMNOS</div><div class="st-kpi">' + alumnos.length + "</div></div>" +
      '<div class="card"><div class="st-kpi-lbl">PRESENTES HOY</div><div class="st-kpi" style="color:var(--ok)">' + presentes + "</div></div>" +
      '<div class="card"><div class="st-kpi-lbl">REGISTRADOS HOY</div><div class="st-kpi">' + marcados + " / " + alumnos.length + "</div></div>" +
      '<div class="card"><div class="st-kpi-lbl">ASISTENCIA PROMEDIO</div><div class="st-kpi">' + (lista.length ? Math.round(lista.reduce((s, a) => s + (pctAsis(a.id) || 0), 0) / lista.length) : 0) + "%</div></div>" +
    "</div>" +
    '<div class="card st-toolbar">' +
      '<label>Fecha de sesión <input type="date" class="st-input" data-asis="fecha" value="' + fecha + '"></label>' +
      '<label>Grupo <select class="st-input" data-asis="grupo"><option value="">Todos</option>' + grupos().map(g => '<option' + (sistemaUI.grupo === g ? " selected" : "") + ">" + esc(g) + "</option>").join("") + "</select></label>" +
      '<div class="st-spacer"></div>' +
      '<button class="st-btn st-btn-soft" data-action="asis-todos">Todos presentes</button>' +
      '<button class="st-btn" data-action="open-alumno">+ Agregar alumno</button>' +
    "</div>" +
    '<div class="card">' +
      '<div class="block-title"><span>\u{1F4C5}</span> Lista de asistencia · ' + esc(fecha) + "</div>" +
      '<div class="st-scroll"><table class="st-table">' +
        '<thead><tr><th>Alumno</th><th>Estado de hoy</th><th>Pres.</th><th>Tard.</th><th>Just.</th><th>Aus.</th><th>%</th></tr></thead>' +
        "<tbody>" + filas + "</tbody>" +
      "</table></div>" +
    "</div>";
}

/* ---------------- SISTEMA · PAGOS ---------------- */
function renderPagos() {
  breadcrumbs([{ label: "Sistema", href: "#/sistema/asistencia" }, { label: "Pagos" }]);
  const q = sistemaUI.busqueda.toLowerCase();
  const lista = alumnos.filter(a =>
    (!sistemaUI.grupo || a.grupo === sistemaUI.grupo) &&
    (!sistemaUI.planFiltro || a.plan === sistemaUI.planFiltro) &&
    (!q || a.nombre.toLowerCase().includes(q))
  );

  const comprometido = alumnos.reduce((s, a) => s + totalPlanDe(a), 0);
  const cobrado = alumnos.reduce((s, a) => s + pagadoDe(a.id), 0);
  const pendiente = comprometido - cobrado;
  const morosos = alumnos.filter(a => estadoPagoDe(a) !== "Pagado").length;
  const descuentos = alumnos.reduce((s, a) => s + descuentoDe(a), 0);
  const fundadores = alumnos.filter(a => a.tipo === "fundador").length;

  const filas = lista.length ? lista.map(a => {
    const plan = planDe(a.plan), desc = descuentoDe(a), total = totalPlanDe(a), pag = pagadoDe(a.id), saldo = total - pag, est = estadoPagoDe(a);
    const na = amigosPagados(a);
    const descTxt = desc > 0 ? '<span style="color:var(--bad)">−' + fmtMX(desc) + (a.tipo === "fundador" && na >= 2 ? " (fundador)" : " (" + na + " amigo" + (na > 1 ? "s" : "") + ")") + "</span>" : (a.tipo === "especial" ? '<span style="color:var(--muted)">Trato especial</span>' : "—");
    return "<tr>" +
      '<td class="st-name"><b>' + esc(a.nombre) + "</b><span>Grupo " + esc(a.grupo || "-") + (a.tutor ? " &middot; " + esc(a.tutor) : "") + "</span></td>" +
      "<td>" + badgeTipo(a.tipo) + "</td>" +
      '<td><span class="chip">' + esc(plan.nombre) + "</span><span class=\"st-sub\">" + fmtMX(montoBaseDe(a)) + "</span></td>" +
      '<td class="st-num">' + descTxt + "</td>" +
      '<td class="st-num"><b>' + fmtMX(total) + "</b></td>" +
      '<td class="st-num" style="color:var(--ok)">' + fmtMX(pag) + "</td>" +
      '<td class="st-num" style="color:' + (saldo > 0 ? "var(--bad)" : "var(--ok)") + '">' + fmtMX(Math.max(0, saldo)) + "</td>" +
      "<td>" + badgeEstadoPago(est) + "</td>" +
      '<td class="st-acc">' +
        '<button class="st-mini st-mini-ok" data-action="open-pago" data-id="' + a.id + '" title="Registrar pago">+ Abono</button>' +
        '<button class="st-mini" data-action="edit-amigos" data-id="' + a.id + '" title="Amigos / referidos">Amigos' + (na ? " (" + na + ")" : "") + "</button>" +
        '<button class="st-mini" data-action="ver-desglose" data-id="' + a.id + '" title="Ver desglose">Desglose</button>' +
        '<button class="st-mini" data-action="edit-alumno" data-id="' + a.id + '" title="Editar">Editar</button>' +
        '<button class="st-mini st-mini-del" data-action="del-alumno" data-id="' + a.id + '" title="Eliminar">&times;</button>' +
      "</td>" +
    "</tr>";
  }).join("") : '<tr><td colspan="9" class="st-empty">Sin alumnos que coincidan. Agrega un alumno para empezar.</td></tr>';

  const porPlan = PLANES.map(p => {
    const planA = alumnos.filter(a => a.plan === p.id);
    if (!planA.length) return "";
    const comp = planA.reduce((s, a) => s + totalPlanDe(a), 0);
    const cob = planA.reduce((s, a) => s + pagadoDe(a.id), 0);
    return "<tr>" +
      "<td><b>" + esc(p.nombre) + "</b></td>" +
      '<td class="st-num">' + planA.length + "</td>" +
      '<td class="st-num">' + fmtMX(comp) + "</td>" +
      '<td class="st-num" style="color:var(--ok)">' + fmtMX(cob) + "</td>" +
      '<td class="st-num" style="color:var(--bad)">' + fmtMX(Math.max(0, comp - cob)) + "</td>" +
      '<td><div class="st-bar"><i style="width:' + (comp ? Math.round(cob / comp * 100) : 0) + '%"></i></div></td>' +
    "</tr>";
  }).join("");

  const movs = pagos.slice().sort((x, y) => (y.fecha || "").localeCompare(x.fecha || ""));
  const movRows = movs.length ? movs.map(p => {
    const al = alumnoById(p.alumnoId);
    return "<tr>" +
      '<td class="st-num">' + esc(p.fecha || "-") + "</td>" +
      "<td><b>" + esc(al ? al.nombre : "(alumno eliminado)") + "</b></td>" +
      "<td>" + esc(p.concepto || "Pago") + "</td>" +
      '<td><span class="chip">' + esc(p.metodo || "-") + "</span></td>" +
      '<td class="st-num" style="color:var(--ok)">' + fmtMX(p.monto) + "</td>" +
      '<td class="st-acc">' +
        '<button class="st-mini" data-action="edit-pago" data-id="' + p.id + '">Editar</button>' +
        '<button class="st-mini st-mini-del" data-action="del-pago" data-id="' + p.id + '">Eliminar</button>' +
      "</td>" +
    "</tr>";
  }).join("") : '<tr><td colspan="6" class="st-empty">Aún no hay pagos registrados.</td></tr>';

  $("#view").innerHTML =
    '<section class="subject-hero" style="background:linear-gradient(135deg,#059669 0%,#065F46 100%)">' +
      '<span class="sh-icon" style="background:#065F46">\u{1F4B8}</span>' +
      "<div><h1>Control de Pagos</h1><p>Plan elegido por cada alumno, abonos, saldo, estado y desglose general.</p></div>" +
    "</section>" +
    '<div class="grid" style="margin-bottom:16px">' +
      '<div class="card"><div class="st-kpi-lbl">COMPROMETIDO</div><div class="st-kpi">' + fmtMX(comprometido) + "</div></div>" +
      '<div class="card"><div class="st-kpi-lbl">COBRADO</div><div class="st-kpi" style="color:var(--ok)">' + fmtMX(cobrado) + "</div></div>" +
      '<div class="card"><div class="st-kpi-lbl">POR COBRAR</div><div class="st-kpi" style="color:var(--bad)">' + fmtMX(pendiente) + "</div></div>" +
      '<div class="card"><div class="st-kpi-lbl">DESCUENTOS APLICADOS</div><div class="st-kpi" style="color:var(--bad)">' + fmtMX(descuentos) + "</div></div>" +
      '<div class="card"><div class="st-kpi-lbl">FUNDADORES</div><div class="st-kpi">' + fundadores + "</div></div>" +
      '<div class="card"><div class="st-kpi-lbl">ALUMNOS CON ADEUDO</div><div class="st-kpi">' + morosos + " / " + alumnos.length + "</div></div>" +
    "</div>" +
    '<div class="card st-toolbar">' +
      '<label>Buscar <input type="text" class="st-input" data-pago="busqueda" placeholder="Nombre del alumno" value="' + esc(sistemaUI.busqueda) + '"></label>' +
      '<label>Grupo <select class="st-input" data-pago="grupo"><option value="">Todos</option>' + grupos().map(g => '<option' + (sistemaUI.grupo === g ? " selected" : "") + ">" + esc(g) + "</option>").join("") + "</select></label>" +
      '<label>Plan <select class="st-input" data-pago="planFiltro"><option value="">Todos</option>' + PLANES.map(p => '<option value="' + p.id + '"' + (sistemaUI.planFiltro === p.id ? " selected" : "") + ">" + esc(p.nombre) + "</option>").join("") + "</select></label>" +
      '<div class="st-spacer"></div>' +
      '<button class="st-btn st-btn-soft" data-action="open-pago">+ Registrar pago</button>' +
      '<button class="st-btn" data-action="open-alumno">+ Agregar alumno</button>' +
    "</div>" +
    '<div class="section-title">\u{1F464} Estado por alumno</div>' +
    '<div class="card"><div class="st-scroll"><table class="st-table">' +
      '<thead><tr><th>Alumno</th><th>Tipo</th><th>Plan (base)</th><th>Descuento</th><th>Total</th><th>Pagado</th><th>Saldo</th><th>Estado</th><th>Acciones</th></tr></thead>' +
      "<tbody>" + filas + "</tbody>" +
    "</table></div></div>" +
    '<div class="section-title">\u{1F4CA} Desglose por plan</div>' +
    '<div class="card"><div class="st-scroll"><table class="st-table">' +
      "<thead><tr><th>Plan</th><th>Alumnos</th><th>Comprometido</th><th>Cobrado</th><th>Por cobrar</th><th>Avance</th></tr></thead>" +
      "<tbody>" + (porPlan || '<tr><td colspan="6" class="st-empty">Sin planes.</td></tr>') + "</tbody>" +
    "</table></div></div>" +
    '<div class="section-title">\u{1F4DD} Movimientos registrados (' + pagos.length + ")</div>" +
    '<div class="card"><div class="st-scroll"><table class="st-table">' +
      "<thead><tr><th>Fecha</th><th>Alumno</th><th>Concepto</th><th>Método</th><th>Monto</th><th>Acciones</th></tr></thead>" +
      "<tbody>" + movRows + "</tbody>" +
    "</table></div></div>";
}
/* ---------------- Formularios ---------------- */
function formAlumno(id) {
  const a = id ? alumnoById(id) : null;
  const tipo = a ? a.tipo : "general";
  const opts = PLANES.map(p => '<option value="' + p.id + '"' + (a && a.plan === p.id ? " selected" : "") + ">" + esc(p.nombre) + " &middot; " + esc(p.nota) + "</option>").join("");
  const tipoOpts = TIPOS.map(t => '<option value="' + t.id + '"' + (a && a.tipo === t.id ? " selected" : "") + ">" + esc(t.nombre) + " &middot; " + esc(t.nota) + "</option>").join("");
  const na = a ? amigosPagados(a) : 0;
  const baseVal = a ? montoBaseDe(a) : PLANES[0].total;
  const finalVal = a ? totalPlanDe(a) : PLANES[0].total;
  openModal(a ? "Editar alumno" : "Agregar alumno",
    '<div class="st-form">' +
      '<label>Nombre completo<input id="f-nombre" class="st-input" value="' + esc(a ? a.nombre : "") + '" placeholder="Nombre del alumno"></label>' +
      '<label>Grupo<input id="f-grupo" class="st-input" value="' + esc(a ? a.grupo : "") + '" placeholder="A / B"></label>' +
      '<label>Tutor<input id="f-tutor" class="st-input" value="' + esc(a ? a.tutor || "" : "") + '" placeholder="Padre / madre / tutor"></label>' +
      '<label>Teléfono<input id="f-tel" class="st-input" value="' + esc(a ? a.telefono || "" : "") + '" placeholder="55 0000 0000"></label>' +
      '<label>Tipo de alumno<select id="f-tipo" class="st-input" data-tipo-select>' + TIPOS.map(t => '<option value="' + t.id + '"' + ((a ? a.tipo : "general") === t.id ? " selected" : "") + ">" + esc(t.nombre) + " &middot; " + esc(t.nota) + "</option>").join("") + "</select></label>" +
      '<label>Plan de pago<select id="f-plan" class="st-input">' + opts + "</select></label>" +
      '<label>Monto base del plan<input id="f-monto" type="number" min="0" class="st-input" value="' + esc(baseVal) + '"></label>' +
      '<label id="f-montofinal-wrap">Monto final a pagar (beca/trato)<input id="f-montofinal" type="number" min="0" class="st-input" value="' + esc(finalVal) + '"></label>' +
      '<div class="st-note-sm" id="f-promo-note"></div>' +
      '<div class="st-form-actions">' +
        (a ? '<button type="button" class="st-btn st-btn-soft" data-action="edit-amigos" data-id="' + a.id + '">\u{1F465} Amigos' + (na ? " (" + na + ")" : "") + "</button>" : "") +
        '<button class="st-btn st-btn-soft" data-modal-close>Cancelar</button>' +
        '<button class="st-btn" data-action="save-alumno" data-id="' + (a ? a.id : "") + '">Guardar</button>' +
      "</div>" +
    "</div>");
  refreshTipoUI();
}
function refreshTipoUI() {
  const sel = document.getElementById("f-tipo");
  const wrap = document.getElementById("f-montofinal-wrap");
  const note = document.getElementById("f-promo-note");
  const planSel = document.getElementById("f-plan");
  const monto = document.getElementById("f-monto");
  if (!sel) return;
  const tipo = sel.value;
  if (wrap) wrap.style.display = tipo === "especial" ? "" : "none";
  if (note) {
    if (tipo === "fundador") note.innerHTML = "\u{1F31F} Fundador: con 2 amigos que paguen, el curso completo queda en <b>$1,000</b>. Con 1 amigo, $500 menos.";
    else if (tipo === "especial") note.innerHTML = "\u{1F4DD} Escribe el monto final acordado (ej. $0 beca, $2,000 mitad).";
    else note.innerHTML = "\u{1F465} General: 1 amigo = −$500, 2 amigos = −$1,000 (se activa cuando el amigo paga).";
  }
  if (tipo === "especial" && planSel && monto) {
    const fin = document.getElementById("f-montofinal");
    if (fin && (!fin.value || Number(fin.value) === 0)) fin.value = monto.value || PLANES[0].total;
  }
}
function formAmigos(id) {
  const a = alumnoById(id);
  if (!a) return;
  const amigos = amigosDe(a);
  const na = amigos.filter(x => x.pago).length;
  const desc = descuentoDe(a), total = totalPlanDe(a);
  const rows = amigos.length ? amigos.map(x =>
    '<div class="amigo-row">' +
      '<input type="checkbox" class="amigo-check" data-action="toggle-amigo" data-id="' + x.id + '" data-alumno="' + a.id + '"' + (x.pago ? " checked" : "") + ' title="Marcar que ya pagó">' +
      '<span class="amigo-name' + (x.pago ? " pagado" : "") + '">' + esc(x.nombre) + "</span>" +
      '<button class="st-mini st-mini-del" data-action="del-amigo" data-id="' + x.id + '" data-alumno="' + a.id + '" title="Quitar">&times;</button>' +
    "</div>").join("") : '<div class="st-empty">Sin amigos registrados todavía.</div>';
  const promo = a.tipo === "fundador"
    ? (na >= 2 ? "\u{1F31F} Fundador con 2 amigos: el curso completo queda en $1,000." : "\u{1F31F} Fundador: 1 amigo = −$500 · 2 amigos = curso en $1,000.")
    : a.tipo === "especial" ? "\u{1F4DD} Tipo Especial/Beca: el monto final se define en la ficha del alumno."
    : "\u{1F465} General: 1 amigo = −$500 · 2 amigos = −$1,000.";
  openModal("Amigos de " + esc(a.nombre),
    '<div class="st-form">' +
      '<div class="st-note-sm"><b>' + esc(tipoDe(a.tipo).nombre) + "</b> · " + promo + "</div>" +
      '<div class="amigos-list">' + rows + "</div>" +
      '<div class="amigo-add">' +
        '<input id="amigo-nombre" class="st-input" placeholder="Nombre del amigo/referido">' +
        '<button class="st-btn" data-action="add-amigo" data-id="' + a.id + '">+ Agregar</button>' +
      "</div>" +
      '<div class="st-note-sm">Amigos que pagaron: <b>' + na + "</b> · Descuento: <b style=\"color:var(--bad)\">" + fmtMX(desc) + "</b> · Total del alumno: <b>" + fmtMX(total) + "</b></div>" +
      '<div class="st-form-actions"><button class="st-btn" data-modal-close>Listo</button></div>' +
    "</div>");
}
function formPago(alumnoId, pagoId) {
  const ed = pagoId ? pagos.find(p => p.id === pagoId) : null;
  const targetId = ed ? ed.alumnoId : alumnoId;
  const a = targetId ? alumnoById(targetId) : null;
  const opts = alumnos.map(x => '<option value="' + x.id + '"' + (a && a.id === x.id ? " selected" : "") + ">" + esc(x.nombre) + " (Grupo " + esc(x.grupo || "-") + ")</option>").join("");
  const saldo = a ? totalPlanDe(a) - pagadoDe(a.id) + (ed ? Number(ed.monto) || 0 : 0) : "";
  openModal(ed ? "Editar pago" : "Registrar pago",
    '<div class="st-form">' +
      '<label>Alumno<select id="p-alumno" class="st-input">' + (opts || '<option value="">Sin alumnos</option>') + "</select></label>" +
      '<label>Concepto<input id="p-con" class="st-input" placeholder="Ej. Mensualidad octubre" value="' + esc(ed ? ed.concepto || "" : "") + '"></label>' +
      '<label>Monto<input id="p-monto" type="number" min="0" step="0.01" class="st-input" value="' + (ed ? (Number(ed.monto) || 0) : (saldo !== "" && saldo > 0 ? saldo : "")) + '"></label>' +
      '<label>Método<select id="p-metodo" class="st-input">' + METODOS.map(m => '<option' + (ed && ed.metodo === m ? " selected" : "") + ">" + m + "</option>").join("") + "</select></label>" +
      '<label>Fecha<input id="p-fecha" type="date" class="st-input" value="' + esc(ed ? ed.fecha : hoyISO()) + '"></label>' +
      '<div class="st-form-actions"><button class="st-btn st-btn-soft" data-modal-close>Cancelar</button>' +
      '<button class="st-btn" data-action="save-pago" data-id="' + (ed ? ed.id : "") + '">' + (ed ? "Guardar cambios" : "Guardar pago") + "</button></div>" +
    "</div>");
}
function verDesglose(id) {
  const a = alumnoById(id);
  if (!a) return;
  const total = totalPlanDe(a), pag = pagadoDe(a.id), saldo = total - pag;
  const desc = descuentoDe(a), na = amigosPagados(a);
  const lista = pagosDe(id).sort((x, y) => (x.fecha || "").localeCompare(y.fecha || ""));
  const movs = lista.length ? lista.map(p => '<tr><td>' + esc(p.fecha) + '</td><td>' + esc(p.concepto || "Pago") + '</td><td>' + esc(p.metodo || "-") + '</td><td class="st-num" style="color:var(--ok)">' + fmtMX(p.monto) + "</td>" +
      '<td class="st-acc"><button class="st-mini" data-action="edit-pago" data-id="' + p.id + '">Editar</button>' +
      '<button class="st-mini st-mini-del" data-action="del-pago" data-id="' + p.id + '">Eliminar</button></td></tr>').join("")
    : '<tr><td colspan="5" class="st-empty">Sin pagos.</td></tr>';
  openModal("Estado de cuenta · " + esc(a.nombre),
    '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:8px">' +
      '<div class="card" style="flex:1;min-width:130px"><div class="st-kpi-lbl">Tipo</div><div style="font-weight:800">' + esc(tipoDe(a.tipo).nombre) + "</div></div>" +
      '<div class="card" style="flex:1;min-width:130px"><div class="st-kpi-lbl">Plan</div><div style="font-weight:800">' + esc(planDe(a.plan).nombre) + "</div></div>" +
      '<div class="card"><div class="st-kpi-lbl">Base</div><div style="font-weight:800">' + fmtMX(montoBaseDe(a)) + "</div></div>" +
      '<div class="card"><div class="st-kpi-lbl">Descuento</div><div class="st-kpi" style="color:var(--bad)">' + (desc > 0 ? "−" + fmtMX(desc) : fmtMX(0)) + "</div></div>" +
      '<div class="card"><div class="st-kpi-lbl">Total</div><div class="st-kpi">' + fmtMX(total) + "</div></div>" +
      '<div class="card"><div class="st-kpi-lbl">Pagado</div><div class="st-kpi" style="color:var(--ok)">' + fmtMX(pag) + "</div></div>" +
      '<div class="card"><div class="st-kpi-lbl">Saldo</div><div class="st-kpi" style="color:var(--bad)">' + fmtMX(Math.max(0, saldo)) + "</div></div>" +
    "</div>" +
    (amigosDe(a).length ? '<div class="st-note-sm" style="margin-bottom:12px">\u{1F465} Amigos: ' + amigosDe(a).map(x => esc(x.nombre) + (x.pago ? " \u2714" : " (pendiente)")).join(" · ") + " · Pagaron: <b>" + na + "</b></div>" : "") +
    '<div class="st-scroll"><table class="st-table"><thead><tr><th>Fecha</th><th>Concepto</th><th>Método</th><th>Monto</th><th>Acciones</th></tr></thead><tbody>' + movs + "</tbody></table></div>" +
    '<div class="st-form-actions" style="margin-top:14px"><button class="st-btn st-btn-soft" data-modal-close>Cerrar</button>' +
    '<button class="st-btn" data-action="open-pago" data-id="' + a.id + '">+ Registrar pago</button></div>');
}

/* ---------------- Acciones del sistema ---------------- */
function leerValor(sel) { const el = document.querySelector(sel); return el ? el.value.trim() : ""; }
function handleSistemaClick(ev) {
  const t = ev.target.closest("[data-action]");
  if (!t) return false;
  const act = t.dataset.action;
  const id = t.dataset.id;

  if (act === "open-alumno") { formAlumno(null); return true; }
  if (act === "edit-alumno") { formAlumno(id); return true; }
  if (act === "save-alumno") {
    const nombre = leerValor("#f-nombre");
    if (!nombre) { alert("Escribe el nombre del alumno."); return true; }
    const tipo = leerValor("#f-tipo") || "general";
    const data = {
      nombre,
      grupo: leerValor("#f-grupo") || "-",
      tutor: leerValor("#f-tutor"),
      telefono: leerValor("#f-tel"),
      tipo,
      plan: leerValor("#f-plan") || PLANES[0].id,
      planMonto: Number(leerValor("#f-monto")) || 0
    };
    if (tipo === "especial") {
      const fin = document.getElementById("f-montofinal");
      data.montoTotal = fin ? (Number(fin.value) || 0) : 0;
    } else {
      delete data.montoTotal;
    }
    if (id && alumnoById(id)) Object.assign(alumnoById(id), data);
    else alumnos.push(Object.assign({ id: uid(), inscripcion: hoyISO(), activo: true, amigos: [] }, data));
    saveAlumnos(); closeModal(); route(); return true;
  }
  if (act === "edit-amigos") { formAmigos(id); return true; }
  if (act === "add-amigo") {
    const a = alumnoById(id);
    if (!a) return true;
    const nom = leerValor("#amigo-nombre");
    if (!nom) { alert("Escribe el nombre del amigo."); return true; }
    if (!Array.isArray(a.amigos)) a.amigos = [];
    a.amigos.push({ id: uid(), nombre: nom, pago: false });
    saveAlumnos(); formAmigos(id); return true;
  }
  if (act === "del-amigo") {
    const a = alumnoById(t.dataset.alumno);
    if (!a) return true;
    a.amigos = amigosDe(a).filter(x => x.id !== id);
    saveAlumnos(); formAmigos(a.id); return true;
  }
  if (act === "toggle-amigo") {
    const a = alumnoById(t.dataset.alumno);
    if (!a) return true;
    const am = amigosDe(a).find(x => x.id === id);
    if (am) am.pago = !am.pago;
    saveAlumnos(); formAmigos(a.id); return true;
  }
  if (act === "del-alumno") {
    const a = alumnoById(id);
    if (!a) return true;
    if (!confirm("¿Eliminar a " + a.nombre + " y todos sus pagos?")) return true;
    alumnos = alumnos.filter(x => x.id !== id);
    pagos = pagos.filter(p => p.alumnoId !== id);
    asistencias = asistencias.filter(x => x.alumnoId !== id);
    saveAlumnos(); savePagos(); saveAsistencias(); route(); return true;
  }
  if (act === "open-pago") { formPago(id || null, null); return true; }
  if (act === "edit-pago") {
    const p = pagos.find(x => x.id === id);
    if (!p) return true;
    formPago(p.alumnoId, p.id); return true;
  }
  if (act === "save-pago") {
    const alumnoId = leerValor("#p-alumno");
    const monto = Number(leerValor("#p-monto"));
    if (!alumnoId || !(monto > 0)) { alert("Elige un alumno e indica un monto mayor a 0."); return true; }
    const data = { alumnoId, concepto: leerValor("#p-con") || "Pago", monto, metodo: leerValor("#p-metodo") || "Otro", fecha: leerValor("#p-fecha") || hoyISO() };
    const ex = id ? pagos.find(p => p.id === id) : null;
    if (ex) Object.assign(ex, data);
    else pagos.push(Object.assign({ id: uid() }, data));
    savePagos(); closeModal(); route(); return true;
  }
  if (act === "del-pago") {
    const p = pagos.find(x => x.id === id);
    if (!p) return true;
    const al = alumnoById(p.alumnoId);
    if (!confirm("¿Eliminar el pago de " + fmtMX(p.monto) + (al ? " de " + al.nombre : "") + "?")) return true;
    pagos = pagos.filter(x => x.id !== id);
    savePagos(); closeModal(); route(); return true;
  }
  if (act === "ver-desglose") { verDesglose(id); return true; }
  if (act === "asis-set") {
    const fecha = sistemaUI.fecha || hoyISO();
    const reg = asisDe(id, fecha);
    const estado = t.dataset.estado;
    if (reg) { if (reg.estado === estado) { asistencias = asistencias.filter(x => x.id !== reg.id); } else { reg.estado = estado; } }
    else { asistencias.push({ id: uid(), alumnoId: id, fecha, estado }); }
    saveAsistencias(); route(); return true;
  }
  if (act === "asis-todos") {
    const fecha = sistemaUI.fecha || hoyISO();
    alumnos.filter(a => !sistemaUI.grupo || a.grupo === sistemaUI.grupo).forEach(a => {
      const reg = asisDe(a.id, fecha);
      if (reg) reg.estado = "Presente"; else asistencias.push({ id: uid(), alumnoId: a.id, fecha, estado: "Presente" });
    });
    saveAsistencias(); route(); return true;
  }
  return false;
}
function handleSistemaInput(ev) {
  const el = ev.target;
  if (el.dataset && el.dataset.asis === "fecha") { sistemaUI.fecha = el.value; route(); return true; }
  if (el.dataset && el.dataset.asis === "grupo") { sistemaUI.grupo = el.value; route(); return true; }
  if (el.dataset && el.dataset.pago === "busqueda") { sistemaUI.busqueda = el.value; return false; }
  if (el.dataset && el.dataset.pago === "grupo") { sistemaUI.grupo = el.value; route(); return true; }
  if (el.dataset && el.dataset.pago === "planFiltro") { sistemaUI.planFiltro = el.value; route(); return true; }
  return false;
}
function handleSistemaChange(ev) {
  const el = ev.target;
  if (el.id === "f-tipo") { refreshTipoUI(); return true; }
  if (el.id === "f-plan") {
    const wrap = document.getElementById("f-montofinal-wrap");
    if (wrap && wrap.style.display !== "none") return true;
    const monto = document.getElementById("f-monto");
    if (monto) monto.value = planDe(el.value).total;
    return true;
  }
  if (el.dataset && el.dataset.pago === "busqueda") { sistemaUI.busqueda = el.value; route(); return true; }
  return false;
}

/* ---------------- BANCO DE EJERCICIOS (Matemáticas) ---------------- */
function renderMate() {
  breadcrumbs([{ label: "Matem\u00e1ticas", href: "#/m/matematicas" }, { label: "Banco de ejercicios" }]);
  const col = DATA.subjects.find(s=>s.id==="matematicas").color;
  $("#view").innerHTML =
    '<section class="subject-hero">' +
      '<span class="sh-icon" style="background:' + col + '">\u{1F4D6}</span>' +
      "<div>" +
        "<h1>Banco de ejercicios de Matem\u00e1ticas</h1>" +
        "<p>Ejercicios aleatorios de todos los temas (n\u00fameros, \u00e1lgebra, estad\u00edstica y geometr\u00eda) con su respuesta y el procedimiento explicado paso a paso. Escribe tu resultado y compru\u00e9balo al instante.</p>" +
      "</div>" +
    "</section>" +
    '<iframe id="mate-frame" src="../herramientas-matematicas.html" title="Banco de ejercicios de Matem\u00e1ticas" style="width:100%;height:1500px;border:1px solid var(--line);border-radius:16px;background:#F8FAFC;box-shadow:var(--shadow-card)"></iframe>';
}

/* ---------------- Crumbs ---------------- */
function breadcrumbs(parts) {
  let out = '<a href="#/">Inicio</a>';
  parts.forEach(p => {
    out += ' <span class="sep">&rsaquo;</span> ';
    if (p.href) out += '<a href="' + p.href + '">' + esc(p.label) + "</a>";
    else out += '<span class="cur">' + esc(p.label) + "</span>";
  });
  $("#breadcrumbs").innerHTML = out;
}

/* ---------------- HOME ---------------- */
function renderHome() {
  lastSubject = null;
  const ready = totalReadyUnits(), doneU = totalDoneUnits();
  const pct = ready ? Math.round((doneU / ready) * 100) : 0;
  const next = nextStudyTarget();
  const badgesOwned = state.badges;

  let cont = "";
  if (next) {
    const s = next.sub;
    cont =
      '<div class="continue-row">' +
        '<div class="sc-icon" style="background:' + s.color + '">' + s.icon + "</div>" +
        '<div style="flex:1;min-width:0">' +
          '<div style="font-size:12px;color:var(--muted);font-weight:700">CONTIN\u00daA ESTUDIANDO</div>' +
          '<div style="font-weight:800;font-size:16px">' + esc(s.short) + ". " + esc(s.name) + ' &middot; Unidad ' + next.unit.num + "</div>" +
        "</div>" +
        '<a class="go" href="#/m/' + esc(s.id) + "/u/" + next.unit.num + '" style="background:' + s.color + ';color:#fff;border:0;border-radius:11px;padding:11px 18px;font-weight:800;font-size:14px;text-decoration:none">Seguir \u2192</a>' +
      "</div>";
  } else if (ready) {
    cont = '<div class="card"><b>\u{1F3C6} \u00a1Curso completo!</b><p style="margin:6px 0 0">Repasa cualquier materia desde el men\u00fa lateral.</p></div>';
  }

  const cards = DATA.subjects.map(s => {
    const dn = s.ready ? subjectDone(s) : 0;
    const tag = s.ready
      ? '<button class="ready" style="background:' + s.color + ';color:#fff;border:0;border-radius:10px;padding:8px 14px;font-weight:700;font-size:13px">' + (dn ? dn + "/" + s.units.length + " &middot; " : "") + "Entrar &rarr;</button>"
      : '<span class="soon">\uD83D\uDD28 En camino &middot; ' + s.unitsCount + " unidades</span>";
    return (
      '<div class="card subject-card" style="--accent:' + s.color + '" data-href="#/m/' + esc(s.id) + '" role="link" tabindex="0">' +
        '<div class="sc-head"><span class="sc-icon">' + s.icon + "</span>" +
        '<h3>' + esc(s.short) + ". " + esc(s.name) + "</h3></div>" +
        "<p>" + esc(s.blurb) + "</p>" +
        '<div class="sc-foot">' +
          (s.ready
            ? '<div style="flex:1;margin-right:12px"><div class="prog-track"><div class="prog-fill" style="width:' + Math.round((dn / s.units.length) * 100) + '%;background:' + s.color + '"></div></div></div>' + tag
            : tag) +
        "</div>" +
      "</div>"
    );
  }).join("");

  const bdg = BADGES.map(b => {
    const has = badgesOwned.includes(b.id);
    return (
      '<div class="badge' + (has ? "" : " locked") + '" title="' + esc(b.desc) + '">' +
        '<div class="b-icon">' + b.icon + "</div><b>" + esc(b.name) + "</b>" +
      "</div>"
    );
  }).join("");

  breadcrumbs([{ label: "Inicio" }]);
  $("#view").innerHTML =
    '<section class="hero">' +
      '<h1>' + esc(DATA.title) + "</h1>" +
      "<p>Materias estructuradas por unidades, con ejemplos resueltos, pr\u00e1cticas, preguntas tipo examen y retos. Tu avance se guarda en este navegador.</p>" +
      '<div class="prog-wrap"><div class="prog-row"><span>\uD83D\uDCC8 Progreso general</span><span>' + doneU + " / " + ready + " unidades &middot; " + pct + "%</span></div>" +
      '<div class="prog-track"><div class="prog-fill" style="width:' + pct + '%"></div></div></div>' +
    "</section>" +
    (cont ? '<div class="section-title">\uD83D\uDCD6 Tu pr\u00f3ximo paso</div>' + cont : "") +
    '<div class="section-title">\uD83D\uDCC2 Materias</div>' +
    '<div class="grid">' + cards + "</div>" +
    '<div class="section-title">\uD83C\uDFC6 Insignias</div>' +
    '<div class="badges">' + bdg + "</div>";
}

/* ---------------- MATERIA ---------------- */
function renderSubject(sub) {
  lastSubject = sub;
  const dn = subjectDone(sub);
  const pct = Math.round((dn / sub.units.length) * 100);
  breadcrumbs([{ label: sub.short + ". " + sub.name, href: "#/m/" + sub.id }]);

  if (!sub.ready) {
    $("#view").innerHTML =
      '<div class="card" style="padding:30px;text-align:center">' +
        '<div style="font-size:44px">\uD83D\uDD28</div>' +
        "<h2>" + esc(sub.name) + "</h2>" +
        "<p>Esta materia se est\u00e1 adaptando a la nueva modalidad y entrar\u00e1 pronto. Los dem\u00e1s contenidos siguen disponibles en el manual del profesor.</p>" +
      "</div>";
    return;
  }

  const units = sub.units.map(u => {
    const done = isDone(sub.id, u.num);
    const nbloques = u.capitulo && u.capitulo.bloques ? u.capitulo.bloques.length : 0;
    return (
      '<a class="unit-card' + (done ? " done" : "") + '" style="--accent:' + sub.color + '" href="#/m/' + esc(sub.id) + "/u/" + u.num + '">' +
        '<span class="uc-badge" style="background:' + sub.color + '">' + u.num + "</span>" +
        '<div class="uc-body">' +
          "<h3>" + esc(u.name) + "</h3>" +
          '<span class="uc-meta">Unidad ' + u.num + " &middot; " + u.ejercicios.length + " ejercicios &middot; " + u.ejemplos.length + " ejemplos" + (nbloques ? " &middot; " + nbloques + " bloques" : "") + "</span>" +
        "</div>" +
        (done ? '<span class="uc-status">\u2713 Completada</span>' : "") +
        '<span class="uc-go" style="background:' + sub.color + '">' + (done ? "Repasar" : "Empezar") + " &rarr;</span>" +
      "</a>"
    );
  }).join("");

  $("#view").innerHTML =
    '<section class="subject-hero">' +
      '<span class="sh-icon" style="background:' + sub.color + '">' + sub.icon + "</span>" +
      "<div>" +
        "<h1>" + esc(sub.short) + ". " + esc(sub.name) + "</h1>" +
        "<p>" + esc(sub.blurb) + "</p>" +
        '<div class="subject-prog">' +
          '<span style="font-size:12px;font-weight:800;white-space:nowrap">' + dn + "/" + sub.units.length + " unidades</span>" +
          '<div class="prog-track"><div class="prog-fill" style="width:' + pct + '%;background:' + sub.color + '"></div></div>' +
          '<span style="font-size:12px;font-weight:800">' + pct + "%</span>" +
        "</div>" +
      "</div>" +
    "</section>" +
    '<div class="section-title">\u{1F4DA} Unidades</div>' +
    '<div class="units-grid">' + units + "</div>";
}

/* ---------------- LECCIÓN ---------------- */
function renderLesson(sub, unit) {
  lastSubject = sub;
  breadcrumbs([
    { label: sub.short + ". " + sub.name, href: "#/m/" + sub.id },
    { label: "Unidad " + unit.num, href: "#/m/" + sub.id + "/u/" + unit.num }
  ]);

  quizData = [];
  const acc = sub.color;
  const html = lessonHTML(sub, unit, acc);
  $("#view").innerHTML =
    '<div class="lesson-wrap">' +
      '<div class="lesson">' + html + "</div>" +
      '<aside class="lesson-rail">' +
        '<div class="rail-card">' +
          '<h4><span class="rail-ico" style="--rc:#2563EB">' + svgTag(IC.list) + '</span> \u00cdndice de la unidad</h4>' +
          '<div class="rail-list" id="rail-index"></div>' +
        "</div>" +
        '<div class="rail-card">' +
          '<h4><span class="rail-ico" style="--rc:#7C3AED">' + svgTag(IC.download) + '</span> Material de apoyo</h4>' +
          '<button class="rail-cta" style="--rc:#2563EB" data-rail="manual"><span class="rc-ico">' + svgTag(IC.file) + '</span><span class="rc-txt">Manual del profesor</span>' + svgTag(IC.chev) + '</button>' +
          '<button class="rail-cta" style="--rc:#7C3AED" data-rail="mapa"><span class="rc-ico">' + svgTag(IC.graph) + '</span><span class="rc-txt">Mapa mental</span>' + svgTag(IC.chev) + '</button>' +
          '<button class="rail-cta" style="--rc:#059669" data-rail="mini"><span class="rc-ico">' + svgTag(IC.flag) + '</span><span class="rc-txt">Mini examen</span>' + svgTag(IC.chev) + '</button>' +
        "</div>" +
        '<div class="rail-card rail-motive">' +
          '<div class="rm-head"><span class="rm-ico">' + svgTag(IC.trophy) + '</span><b>\u00a1T\u00fa puedes!</b></div>' +
          "<p>La constancia tambi\u00e9n es talento. \u00a1Cada clase cuenta para tu meta!</p>" +
        "</div>" +
      "</aside>" +
    "</div>";
  mountLesson(sub, unit);
}

function buildLessonRail() {
  const list = $("#rail-index");
  if (!list) return;
  const secs = document.querySelectorAll("#view .lesson > .card, #view .lesson > .cap-sec");
  let html = "";
  secs.forEach((el, i) => {
    const t = el.querySelector(":scope > .block-title, :scope > h2");
    if (!t) return;
    let txt = t.textContent.replace(/[^\p{L}\p{N}\s\u00BF\u00A1.,:;\-()]/gu, "").trim().slice(0, 36);
    if (!txt) return;
    const id = "ls-" + i;
    el.id = id;
    html += '<button class="rail-item" data-scroll="' + id + '"><span class="ri-num">' + (i + 1) + "</span><span>" + esc(txt) + "</span></button>";
  });
  list.innerHTML = html;
}

function lessonHTML(sub, unit, acc) {
  const o = unit.objetivo && unit.objetivo.length ? unit.objetivo.map(x => "<li><span class='tick'>\u2713</span>" + esc(x) + "</li>").join("") : "";
  const teor = unit.teoria.map((t, i) =>
    '<div class="teoria-card"><h4>' + esc(sub.short) + " " + unit.num + " &middot; Paso " + (i + 1) + "</h4><p>" + esc(t) + "</p></div>"
  ).join("");
  const ej = unit.ejemplos.map(e =>
    "<div class='example'>" +
      '<div class="example-head">\uD83D\uDC41\uFE0F Ejemplo resuelto</div>' +
      (e.fig ? '<div class="ex-fig">' + e.fig + "</div>" : "") +
      '<div class="example-datos"><b>Datos / problema:</b> ' + esc(e.enc) + "</div>" +
      '<div class="example-pasos"><b>Procedimiento:</b><br>' +
        e.pasos.map((p, i) => (i + 1) + ". " + esc(p) + "<br>").join("") +
      "</div>" +
      '<div class="example-res">\u2705 Resultado: ' + esc(e.res) + "</div>" +
    "</div>"
  ).join("");
  const ex = unit.ejercicios.map((x, i) => exerciseHTML(sub, unit, x, i)).join("");
  const practicaIntro = TYPE_MODE(sub)
    ? '<div class="tb-sub">Escribe tu respuesta. Al acertar ver\u00e1s el procedimiento completo; si fallas, podr\u00e1s verlo con un bot\u00f3n.</div>'
    : '<div class="tb-sub">Resuelve antes de ver la soluci\u00f3n</div>';

  const mk = { v: quizData.length };
  const cap = unit.capitulo;

  const capIntro = cap && cap.intro
    ? '<div class="cap-panel cap-intro-inner">' +
        '<div class="cap-panel-title">\u{1F9E0} Los bloques que m\u00e1s se preguntan</div>' +
        "<p>" + esc(cap.intro.t) + "</p>" +
        '<p style="font-weight:700;margin:8px 0">' + esc(cap.intro.p1) + "</p>" +
        "<p>" + esc(cap.intro.p2) + "</p>" +
        '<div class="pill-list">' + cap.intro.items.map(x => '<span class="pill">' + esc(x) + "</span>").join("") + "</div>" +
        "<p>" + esc(cap.intro.p3) + "</p>" +
      "</div>"
    : "";
  const capLlave = cap && cap.llave
    ? '<div class="cap-panel cap-llave-inner">' +
        '<div class="cap-panel-title">\u{1F511} Pregunta m\u00e1gica para identificarlas</div>' +
        '<p style="margin:0;color:var(--muted);font-weight:600">' + esc(cap.llave.p) + "</p>" +
        '<p class="hook-q" style="font-size:17px">' + esc(cap.llave.q) + "</p>" +
        (cap.llave.nota ? '<p style="margin:0;font-weight:700">' + esc(cap.llave.nota) + "</p>" : "") +
      "</div>"
    : "";
  const capBloques = cap && cap.bloques && cap.bloques.length ? bloquesHTML(cap.bloques, sub, unit, mk, acc) : "";
  const capTrucos = trucosHTML(cap);
  const trucoTip = unit.truco
    ? '<div class="truco-tip"><div class="cap-panel-title">\u{1F4A1} Truco para el examen</div><p>' + esc(unit.truco) + "</p></div>"
    : "";
  const cmp = comparacionHTML(cap);
  const esquema = mapaHTML(cap, acc);
  const capReto = capRetoHTML(cap, acc);
  const capMini = capMiniHTML(cap, sub, unit, mk);

  const tipoBlock = quizBlockHTML(sub, unit, "tipo", acc);
  const retoBlock = quizBlockHTML(sub, unit, "reto", acc);
  const result = resultBoxHTML(sub, unit, acc);

  const hero = lessonHeroHTML(sub, unit);
  const objetivo = o ? sec("card-objetivo", "\u{1F3AF}", "Objetivo", '<ul class="objetivo-list">' + o + "</ul>") : "";

  let empezar = "";
  if (unit.hook) {
    empezar = sec("card-empezar", "\u26A1", "Para empezar",
      '<p class="tb-desc">Imagina la siguiente situaci\u00f3n:</p>' +
      '<div class="tb-box"><p class="hook-q">' + esc(unit.hook) + "</p></div>" +
      (unit.name
        ? '<p class="hook-sub">' + esc(sub.short) + ". " + esc(sub.name) + " &middot; Unidad " + unit.num + " &middot; " + esc(unit.name) + "</p>"
        : ""));
  }

  const teoriaBody =
    capIntro + capLlave + capBloques +
    (capTrucos ? '<div class="tb-sub">Trucos para dominar el tema</div>' + capTrucos : "") +
    trucoTip +
    (teor ? '<div class="tb-sub">Lo que necesitas saber</div><div class="teoria-grid">' + teor + "</div>" : "");
  const teoria = sec("card-teoria", "\u{1F9E0}", "Teor\u00eda", teoriaBody);

  const ejemplo = ej ? sec("card-ejemplos", "\u{1F50D}", "Ejemplo", ej) : "";
  const practica = (unit.guia || ex) ? sec("card-practica", "\u{270F}\uFE0F", "Pr\u00e1ctica guiada",
    (unit.guia
      ? '<div class="tb-sub">Actividad pr\u00e1ctica sugerida</div><ul class="guide-list">' + unit.guia.map(g => '<li><span class="gicon">\u25B8</span><span>' + esc(g) + "</span></li>").join("") + "</ul>"
      : "") +
    (ex ? practicaIntro + ex : "")) : "";
  const comparacion = cmp ? sec("card-comparacion", "\u{1F501}", "Comparaci\u00f3n", cmp) : "";
  const esquemaSec = esquema ? sec("card-esquema", "\u{1F310}", "Esquema", esquema) : "";
  const error = errsHTML(unit.errores) ? sec("card-error", "\u26A0\uFE0F", "Error com\u00fan", errsHTML(unit.errores)) : "";
  const tipo = (tipoBlock || capMini) ? sec("card-tipo", "\u23F1\uFE0F", "Pregunta tipo examen",
    (tipoBlock ? '<div class="tb-desc">Misma forma y dificultad de las preguntas del examen, pero elaborada por el curso: no es una pregunta oficial.</div>' + tipoBlock : "") + capMini) : "";
  const reto = (retoBlock || capReto) ? sec("card-reto", "\u{1F525}", "Reto",
    (retoBlock ? '<div class="tb-desc">\u00danica pregunta: demuestra que dominas la unidad.</div>' + retoBlock : "") + capReto) : "";
  const resumen = sec("card-resumen", "\u{1F4CB}", "Resumen",
    motivSegment() + '<div id="result-box">' + result + "</div>");

  return (
    hero + objetivo + empezar + teoria + ejemplo + practica + comparacion + esquemaSec + error + tipo + reto + resumen +
    lessonNav(sub, unit, acc)
  );
}

function comparacionHTML(cap) {
  const tr = cap && cap.trucos;
  const rows = tr && tr.ojo ? tr.ojo : [];
  if (!rows.length) return "";
  let h = '<div class="cmp-intro">' + esc(tr.ojo_t || "Ojo: descripci\u00f3n \u2260 exposici\u00f3n") + "</div>";
  h += '<div class="cmp-grid">';
  rows.forEach(r => {
    h += '<div class="cmp-row">' +
      '<div class="cmp-box cmp-no"><div class="cb-label">\u274C No es esto</div>' + esc(r.ej) + "</div>" +
      '<div class="cmp-box cmp-si"><div class="cb-label">\u2705 Es as\u00ed</div>' + esc(r.f) + "</div>" +
    "</div>";
  });
  return h + "</div>";
}

function errsHTML(list) {
  if (!list || !list.length) return "";
  let h = '<div class="err-alert">' +
    '<span class="ea-icon">\u26A0\uFE0F</span>' +
    "<b>\u00a1Cuidado!</b>" +
  "</div>";
  h += list.map(e => '<div class="err"><b>' + esc(e.t) + "</b><p>" + esc(e.d) + "</p></div>").join("");
  return h;
}

function motivSegment() {
  return '<div class="resumen-motiv">' +
    '<span style="font-size:22px">\u2728</span>' +
    "<div><b>\u00a1Lo est\u00e1s haciendo muy bien!</b><p>La constancia te dar\u00e1 mejores resultados; repasa cada bloque hasta dominarlo.</p></div>" +
  "</div>";
}

function sec(cls, emoji, title, inner) {
  return '<div class="card ' + cls + '"><div class="block-title">' + (emoji || "") + " " + title + "</div>" + inner + "</div>";
}

function lessonHeroHTML(sub, unit) {
  return (
    '<section class="lesson-hero">' +
      '<span class="lh-pill"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5V5a2 2 0 0 1 2-2h6v14H6a2 2 0 0 0-2 2z"></path><path d="M20 19.5V5a2 2 0 0 0-2-2h-6v14h6a2 2 0 0 1 2 2z"></path></svg> ' + esc(sub.short) + " \u00b7 " + esc(sub.name) + " \u00b7 Unidad " + unit.num + "</span>" +
      "<h1><span class=\"lh-tile\">" + sub.icon + "</span>" + esc(unit.name) + "</h1>" +
      "<p>" + esc(sub.blurb) + "</p>" +
    "</section>"
  );
}

function selfCheckButtons(ky, acc) {
  return (
    '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">' +
      '¿Lo sab&iacute;as? ' +
      '<button class="ready" data-action="verdict" data-kind="1" data-key="' + ky + '" style="background:var(--ok);color:#fff;border:0;border-radius:9px;padding:7px 13px;font-weight:700">\u2713 S\u00ed</button> ' +
      '<button class="ready" data-action="verdict" data-kind="0" data-key="' + ky + '" style="background:var(--bad);color:#fff;border:0;border-radius:9px;padding:7px 13px;font-weight:700">\u2717 No</button>' +
    "</div>"
  );
}

function quizBlockHTML(sub, unit, part, acc) {
  const q = part === "tipo" ? unit.tipo : unit.reto;
  if (!q || !q.ops || !q.ops.length) return "";
  return mcqHTML({
    enc: q.enc, ops: q.ops, correct: q.correct, expl: q.expl,
    key: quizKey(sub.id, unit.num, part), part, xp: part === "tipo" ? 10 : 20, reg: quizData.length
  });
}

function mcqHTML(o) {
  const v = state.answers[o.key];
  const picked = state.picked[o.key];
  const opts = o.ops.map((op, i) => {
    let cls = "";
    if (v !== undefined) {
      if (i === o.correct) cls = " correct";
      else if (v === 0 && i === picked) cls = " wrong";
    }
    return (
      "<button data-val='" + i + "'" + (cls || "") + (v !== undefined ? " disabled" : "") + ">" +
        '<span class="opt">' + LETTERS[i] + "</span>" +
        "<span>" + esc(op) + "</span>" +
      "</button>"
    );
  }).join("");

  const fb = v === undefined ? "" : (
    '<div class="quiz-feedback open ' + (v === 1 ? "ok" : "no") + '">' +
      '<div class="fb-title">' + (v === 1 ? "\u{1F389} \u00a1Correcto!" : "\u{1F643} No era esa") + "</div>" +
      esc(o.expl) +
    "</div>"
  );

  return (
    '<div class="mcq" data-reg="' + o.reg + '" data-key="' + esc(o.key) + '" data-part="' + o.part + '" data-xp="' + o.xp + '" data-correct="' + o.correct + '" data-expl="' + esc(o.expl) + '">' + opts + fb + "</div>"
  );
}

const nl = s => String(s == null ? "" : s).replace(/\n/g, "<br>");
const capKey = (sub, unit, k) => sub.id + "/u" + unit.num + "/cap/" + k;

function tablaHTML(head, rows) {
  return (
    '<div class="cap-table-wrap"><table class="cap-table">' +
      "<thead><tr>" + head.map(hx => "<th>" + esc(hx) + "</th>").join("") + "</tr></thead>" +
      "<tbody>" + rows.map(r => "<tr>" + r.map(c => "<td>" + esc(c) + "</td>").join("") + "</tr>").join("") + "</tbody>" +
    "</table></div>"
  );
}

function funCardHTML(c, sub, unit, mk, esModo, rotulo) {
  const colorVar = { azul: "--c-azul", rojo: "--c-rojo", verde: "--c-verde", morado: "--c-morado", ambar: "--c-ambar" }[c.color] || "--c-azul";
  const pillTxt = c.pill || FUN_PILLS[c.color];
  const h = [];
  h.push('<div class="f-carta" style="--fc:var(' + colorVar + ')">');
  h.push('<div class="f-head"><span class="f-ico">' + svgTag(FUN_ICONS[c.color] || IC.info) + '</span>' +
    '<div class="f-meta"><span class="f-num">' + (rotulo || (esModo ? "Modo " : "Funci\u00f3n ")) + c.n + '</span><span class="f-titulo">' + esc(c.titulo) + "</span></div>" +
    (esModo || !pillTxt ? "" : '<span class="f-pill">' + esc(pillTxt) + "</span>") + "</div>");
  h.push('<div class="f-body">');
  h.push('<div class="f-hace"><b> \u00bfQu\u00e9 hace?</b> ' + esc(c.hace) + "</div>");
  if (c.fig) h.push('<div class="ex-fig">' + c.fig + "</div>");
  if (c.notas && c.notas.length) {
    h.push('<div class="f-notas">' + c.notas.map(n => '<span class="pill sm">' + esc(n) + "</span>").join("") + "</div>");
  }
  h.push('<div class="pista-chip">\u{1F9E0} Pista: <b>' + esc(c.pista) + "</b></div>");
  if (c.ejemplos && c.ejemplos.length) {
    h.push('<div class="f-ejemplos"><div class="f-sub">Ejemplos</div>');
    c.ejemplos.forEach(e => h.push('<div class="ej-item">' + nl(esc(e)) + "</div>"));
    h.push("</div>");
  }
  if (c.muestra) {
    h.push('<div class="f-muestra"><div class="f-sub-t">As\u00ed se ve en la pr\u00e1ctica</div>' + nl(esc(c.muestra)) + "</div>");
  }
  if (c.tabla) {
    h.push('<div class="f-tabla"><div class="f-sub">\u{1F4CA} Conjugaci\u00f3n en la pr\u00e1ctica</div>' + tablaHTML(c.tabla.columnas, c.tabla.filas) + "</div>");
  }
  if (c.dialogo && c.dialogo.length) {
    h.push('<div class="f-dialogo">' + c.dialogo.map(d => "<div>" + esc(d) + "</div>").join("") + "</div>");
  }
  if (c.claves && c.claves.length) {
    h.push('<div class="f-claves"><span class="f-sub">Palabras que delatan</span>' + c.claves.map(k => '<span class="pill sm">' + esc(k) + "</span>").join("") + "</div>");
  }
  if (c.tipo && c.tipo.ops && c.tipo.ops.length) {
    const j = mk.v++;
    h.push('<div class="f-tipo"><div class="f-sub">\u{23F1}\uFE0F Ejemplo tipo examen</div>');
    h.push('<div class="mq-q">' + nl(esc(c.tipo.enc)) + "</div>");
    h.push(mcqHTML({ enc: c.tipo.enc, ops: c.tipo.ops, correct: c.tipo.correct, expl: c.tipo.expl, xp: 10, key: capKey(sub, unit, "q" + j), part: "cap", reg: j }));
    h.push("</div>");
  }
  h.push("</div>");
  h.push("</div>");
  return h.join("");
}

function bloquesHTML(bloques, sub, unit, mk, acc) {
  return '<div class="cap-secs">' + bloques.map(bl => {
    const esModo = bl.tipo === "modos";
    const rotulo = bl.rotulo || (esModo ? "Modo" : "Funci\u00f3n");
    let h = '<div class="cap-sec">';
    h += "<h2>" + esc(bl.nombre) + "</h2>";
    if (bl.intro) h += "<p>" + esc(bl.intro) + "</p>";
    if (bl.pill && bl.pill.length) {
      h += '<div class="pill-list">' + bl.pill.map(x => '<span class="pill dk">' + esc(x) + "</span>").join("") + "</div>";
    }
    h += '<div class="cap-grid">';
    (bl.cards || []).forEach(c => { h += funCardHTML(c, sub, unit, mk, esModo, rotulo); });
    h += "</div></div>";
    return h;
  }).join("") + "</div>";
}

function trucosHTML(cap) {
  const tr = cap.trucos;
  if (!tr) return "";
  let h = '<div class="cap-panel cap-trucos-inner">';
  h += '<div class="cap-panel-title">\u{1F4A1} Truco para memorizar las funciones</div>';
  h += tablaHTML(tr.columnas, tr.filas);
  if (tr.modos_columnas && tr.modos_filas) {
    h += '<div class="cap-panel-title" style="margin-top:16px">\u{1F5FA}\uFE0F Los modos discursivos en dos l\u00edneas</div>';
    h += tablaHTML(tr.modos_columnas, tr.modos_filas);
  }
  if (tr.tablas && tr.tablas.length) {
    tr.tablas.forEach(tb => {
      h += '<div class="cap-panel-title" style="margin-top:16px">\u{1F4D6} ' + esc(tb.t) + "</div>";
      h += tablaHTML(tb.columnas, tb.filas);
    });
  }
  if (tr.formula && tr.formula.length) {
    h += '<div class="cap-panel-title" style="margin-top:16px">\u{1F9E0}\uFE0F F\u00f3rmula expr\u00e9s para el examen</div>';
    h += '<div class="formula">' + tr.formula.map(f => '<span class="f-chip">' + esc(f) + "</span>").join("") + "</div>";
  }
  return h + "</div>";
}

function capRetoHTML(cap, acc) {
  const rt = cap && cap.reto;
  if (!rt || !rt.items || !rt.items.length) return "";
  let h = '<div class="cap-panel cap-reto-inner">';
  h += '<div class="cap-panel-title">\u{1F3AE} Reto r\u00e1pido</div>';
  if (rt.intro) h += "<p>" + esc(rt.intro) + "</p>";
  h += '<div class="reto-list">';
  rt.items.forEach((it, i) => {
    h += '<div class="reto-q">' +
      '<div class="rq-num">' + (i + 1) + "</div>" +
      '<div class="rq-txt">' + esc(it.q) + "</div>" +
      '<button class="rq-btn" data-action="rq" style="background:' + acc + '">Ver respuesta</button>' +
      '<div class="rq-ans" style="display:none"><b>' + esc(it.a) + "</b></div>" +
    "</div>";
  });
  return h + "</div></div>";
}

function capMiniHTML(cap, sub, unit, mk) {
  const mn = cap && cap.mini;
  if (!mn || !mn.items || !mn.items.length) return "";
  let h = '<div class="cap-panel cap-mini-inner">';
  if (mn.intro) h += "<p>" + esc(mn.intro) + "</p>";
  mn.items.forEach((it, i) => {
    const j = mk.v++;
    h += '<div class="mini-q"><div class="mq-q"><b>' + (i + 1) + ".</b> " + nl(esc(it.enc)) + "</div>" +
      mcqHTML({ enc: it.enc, ops: it.ops, correct: it.correct, expl: it.expl, xp: 10, key: capKey(sub, unit, "mini" + i), part: "cap", reg: j }) +
      "</div>";
  });
  return h + "</div>";
}

function mapaHTML(cap, acc) {
  const m = cap.mapa;
  if (!m || !m.length) return "";
  let h = '<div class="cap-panel cap-mapa-inner">';
  h += '<div class="cap-panel-title">\u{1F9E0}\uFE0F Mapa mental para recordar antes del examen</div>';
  h += '<div class="mapa">';
  m.forEach(mp => {
    h += '<div class="map-col">';
    h += '<div class="map-root" style="background:' + acc + '">' + esc(mp.t) + "</div>";
    mp.r.forEach(n => h += '<div class="map-node"><span class="map-q">' + esc(n[0]) + '</span><span class="map-a">' + esc(n[1]) + "</span></div>");
    h += "</div>";
  });
  return h + "</div></div>";
}

function resultBoxHTML(sub, unit, acc) {
  const P = practiceResult(sub, unit);
  const items = [];
  for (let i = 0; i < unit.ejercicios.length; i++) items.push(state.answers[practiceKey(sub.id, unit.num, i)]);
  if (P.t !== null) items.push(P.t);
  if (P.r !== null) items.push(P.r);
  const answered = items.filter(v => v !== undefined && v !== null).length;
  const correct = items.filter(v => v === 1).length;
  const pct = answered ? Math.round((correct / answered) * 100) : null;

  let ring, subTxt, rec, level;
  if (pct === null) {
    ring = "0%";
    subTxt = "A\u00fan no has respondido";
    rec = "Resuelve los ejercicios de pr\u00e1ctica, la pregunta tipo examen y el reto para conocer tu nivel.";
    level = "";
  } else {
    ring = pct + "%";
    subTxt = pct + "% de acierto";
    if (pct === 100) { level = ["Maestr\u00eda \u{1F4AF}", "Dominas esta unidad. \u00a1Excelente trabajo!"]; }
    else if (pct >= 80) { level = ["Competencia \u{1F680}", "Muy bien. Refuerza solo los errores que cometiste."]; }
    else if (pct >= 50) { level = ["Habilidad \u{1F44F}", "Bien, pero vuelve a los ejemplos resueltos y a la teor\u00eda."]; }
    else { level = ["Reconocimiento \u{1F4D6}", "Repasa la teor\u00eda y los ejemplos; luego vuelve a la pr\u00e1ctica."]; }
    rec = level[1];
  }

  const done = isDone(sub.id, unit.num);

  return (
    '<div class="score-card">' +
      '<div class="score-ring" style="--pct:' + ring + ';color:' + acc + '" data-ring>' +
        '<div class="ring-in"><b>' + (pct === null ? "&ndash;" : pct + "%") + "</b><span>aciertos</span></div>" +
      "</div>" +
      '<div class="score-big">' + (pct === null ? "\u00bfListo?" : pct + "%") + "</div>" +
      '<div class="score-sub">' + subTxt + (level ? " &middot; " + level[0] : "") + "</div>" +
      '<div class="chips">' +
        '<span class="chip">\u{1F4C8} Respondidos: ' + answered + "</span>" +
        '<span class="chip">\u2705 Correctos: ' + correct + "</span>" +
        '<span class="chip">\u274C Errores: ' + (answered - correct) + "</span>" +
      "</div>" +
      (rec ? "<p style='margin:14px auto 0;max-width:520px;color:var(--muted)'>" + rec + "</p>" : "") +
      '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:16px">' +
        '<button class="btn-ghost" data-action="replay">\u{1F504} Reintentar</button>' +
        (done
          ? '<span class="chip" style="background:var(--ok);color:#fff">\u2713 Unidad completada</span>'
          : '<button data-action="markdone" style="background:' + acc + ';color:#fff;border:0;border-radius:10px;padding:10px 16px;font-weight:800">\u2713 Marcar unidad completada \u2139 +15 XP</button>') +
      "</div>" +
    "</div>"
  );
}

function lessonNav(sub, unit, acc) {
  const units = sub.units;
  const ix = units.findIndex(u => u.num === unit.num);
  const prev = ix > 0 ? units[ix - 1] : null;
  const next = ix < units.length - 1 ? units[ix + 1] : null;
  let html = '<div style="display:flex;gap:12px;justify-content:space-between;flex-wrap:wrap;margin-top:6px">';
  html += prev
    ? '<a class="btn-ghost" href="#/m/' + esc(sub.id) + "/u/" + prev.num + '" style="text-decoration:none">\u2190 Unidad ' + prev.num + "</a>"
    : '<a class="btn-ghost" href="#/m/' + esc(sub.id) + '" style="text-decoration:none">\u2190 \u00cdndice de la materia</a>';
  html += next
    ? '<a style="background:' + acc + ';color:#fff;border:0;border-radius:11px;padding:11px 18px;font-weight:800;text-decoration:none" href="#/m/' + esc(sub.id) + "/u/" + next.num + '">Unidad ' + next.num + " \u2192</a>"
    : '<a style="background:' + acc + ';color:#fff;border:0;border-radius:11px;padding:11px 18px;font-weight:800;text-decoration:none" href="#/m/' + esc(sub.id) + '">Ver resumen de la materia \u2192</a>';
  html += "</div>";
  return html;
}

function render404() {
  breadcrumbs([{ label: "No encontrado" }]);
  $("#view").innerHTML = '<div class="card" style="padding:40px;text-align:center"><div style="font-size:44px">\u{1F50D}</div><h2>P\u00e1gina no encontrada</h2><p>El enlace no existe o la materia a\u00fan no est\u00e1 disponible.</p><a class="go" href="#/" style="display:inline-block;background:var(--accent);color:#fff;border-radius:10px;padding:10px 16px;font-weight:800;text-decoration:none">Ir al inicio</a></div>';
}

/* ---------------- Mount: eventos ---------------- */
function mountLesson(sub, unit) {
  // Registrar quizzes (base HM + capítulos)
  document.querySelectorAll(".mcq").forEach(el => {
    const idx = parseInt(el.dataset.reg, 10);
    quizData[idx] = {
      el, part: el.dataset.part, key: el.dataset.key,
      xp: parseInt(el.dataset.xp, 10),
      correctIdx: parseInt(el.dataset.correct, 10),
      expl: el.dataset.expl || "",
      sub, unit
    };
  });
  buildLessonRail();
}

/* ---------------- Delegación de eventos ---------------- */
function onClick(ev) {
  if (handleSistemaClick(ev)) return;
  if (typeof handlePlanClick === "function" && handlePlanClick(ev)) return;
  const rail = ev.target.closest('[data-scroll]');
  if (rail) {
    const el = document.getElementById(rail.dataset.scroll);
    if (el) {
      const t = el.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop) - 84;
      window.scrollTo({ top: Math.max(0, t), behavior: "smooth" });
      return;
    }
  }
  const rct = ev.target.closest("[data-rail]");
  if (rct) {
    const kind = rct.dataset.rail;
    if (kind === "manual") { window.open("../manual-del-profesor.html", "_blank"); return; }
    const el = document.querySelector(kind === "mapa" ? ".cap-mapa-inner" : ".cap-mini-inner");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  const sct = ev.target.closest("#side-continue");
  if (sct) {
    const n = nextStudyTarget();
    if (n) location.hash = "#/m/" + n.sub.id + "/u/" + n.unit.num;
    return;
  }

  const toggler = ev.target.closest('[data-action="hint"], [data-action="reveal"]');
  if (toggler) {
    const item = toggler.closest(".ex-item");
    if (!item) return;
    const box = item.querySelector(".ex-ans");
    if (toggler.dataset.action === "hint") {
      const p = item.querySelector('[data-el="pista"]');
      const show = p.style.display === "none" || !p.style.display;
      p.style.display = show ? "block" : "none";
    } else {
      box.classList.add("open");
      item.querySelector('[data-el="res"]').style.display = "block";
      const v = item.querySelector('[data-el="verdict"]');
      if (v && v.style.display === "none") v.style.display = "flex";
      toggler.style.display = "none";
      const hint = item.querySelector('[data-el="pista"]');
      hint.style.display = "none";
    }
    return;
  }

  const rv = ev.target.closest('[data-action="revealproc"]');
  if (rv) {
    const host = rv.closest(".ex-fb");
    if (!host) return;
    const proc = host.querySelector(".ex-proc");
    if (proc) proc.style.display = "block";
    rv.style.display = "none";
    host.classList.add("open");
    return;
  }

  const check = ev.target.closest('[data-action="check"]');
  if (check) {
    const item = check.closest(".ex-item");
    if (!item) return;
    const ky = check.dataset.key;
    if (state.answers[ky] !== undefined) return;
    const input = item.querySelector(".ex-input");
    if (!input) return;
    const raw = input.value;
    if (!String(raw).trim()) {
      input.classList.add("shake");
      input.setAttribute("placeholder", "Escribe una respuesta primero");
      setTimeout(() => { input.classList.remove("shake"); input.setAttribute("placeholder", "Escribe tu respuesta\u2026"); }, 1000);
      return;
    }
    let accepted = [];
    try { accepted = JSON.parse(check.dataset.acc || "[]"); } catch (e) { accepted = []; }
    if (!accepted.length) accepted = [check.dataset.res || ""];
    const pasos = (check.dataset.steps || "").split("\n").filter(Boolean);
    const res = check.dataset.res || "";
    const ok = answerMatches(raw, accepted);
    state.answers[ky] = ok ? 1 : 0;
    if (ok) { state.correct++; award(5, { label: "\u00a1Bien!" }); }
    else { fail(); }
    saveState();
    const actions = item.querySelector(".ex-actions-type");
    if (actions) actions.remove();
    item.insertAdjacentHTML("beforeend", typeFeedback(ok, pasos, res));
    if (isMathSubject(currentRoute().sub)) fmtMathInEl(item);
    refreshResult();
    return;
  }

  const verdict = ev.target.closest('[data-action="verdict"]');
  if (verdict) {
    const ky = verdict.dataset.key;
    const kind = parseInt(verdict.dataset.kind, 10);
    if (state.answers[ky] !== undefined) return;
    state.answers[ky] = kind;
    if (kind === 1) { state.correct++; award(5, { label: "\u00a1Bien!" }); }
    else { fail(); }
    saveState();
    // actualizar vista del item
    const item = document.querySelector('.ex-item[data-key="' + ky + '"]');
    if (item) {
      const v = item.querySelector('[data-el="verdict"]');
      v.innerHTML = kind === 1
        ? "<b style='color:var(--ok)'>\u2713 \u00a1Bien! +5 XP</b>"
        : "<b style='color:var(--bad)'>\u2717 Rep\u00e1salo y vuelve a intentarlo</b>";
      const note = item.querySelector(".ex-ans.open, .ex-ans");
      if (note) note.classList.add("open");
    }
    refreshResult();
    return;
  }

  const rq = ev.target.closest('[data-action="rq"]');
  if (rq) {
    const host = rq.closest(".reto-q");
    if (!host) return;
    const ans = host.querySelector(".rq-ans");
    if (!ans) return;
    const show = ans.style.display !== "block";
    ans.style.display = show ? "block" : "none";
    rq.textContent = show ? "Ocultar respuesta" : "Ver respuesta";
    return;
  }

  const opt = ev.target.closest(".mcq button");
  if (opt) {
    const host = opt.closest(".mcq");
    if (opt.disabled) return;
    const reg = parseInt(host.dataset.reg, 10);
    const qz = quizData[reg];
    if (!qz) return;
    if (state.answers[qz.key] !== undefined) { host.querySelectorAll("button").forEach(b => b.disabled = true); return; }
    const val = parseInt(opt.dataset.val, 10);
    state.picked[qz.key] = val;
    const ok = val === qz.correctIdx;
    state.answers[qz.key] = ok ? 1 : 0;
    if (ok) { state.correct++; if (qz.part === "reto") { state.retos++; if (state.racha === 0) award(0, { racha: false }); award(qz.xp, { label: qz.part === "reto" ? "\u{1F525} Reto superado" : "\u2705 \u00a1Correcto!", retos: qz.part === "reto" }); }
      else award(qz.xp, { label: "\u2705 \u00a1Correcto!" }); }
    else { fail(); }

    saveState();
    host.querySelectorAll("button").forEach(b => {
      b.disabled = true;
      const bi = parseInt(b.dataset.val, 10);
      b.classList.remove("correct", "wrong");
      if (bi === qz.correctIdx) b.classList.add("correct");
      else if (bi === val) b.classList.add("wrong");
    });
    const fb = document.createElement("div");
    fb.className = "quiz-feedback open " + (ok ? "ok" : "no");
    fb.innerHTML = (ok ? '<div class="fb-title">\u{1F389} \u00a1Correcto! (+' + qz.xp + " XP)</div>" : '<div class="fb-title">\u{1F643} No era esa</div>') + esc(qz.expl);
    host.appendChild(fb);
    refreshResult();
    return;
  }

  const mark = ev.target.closest('[data-action="markdone"]');
  if (mark) {
    if (!lastSubject) return;
    const sub = lastSubject;
    const r = currentRoute();
    const unit = r.unit;
    if (!unit) return;
    const ky = doneKey(sub.id, unit.num);
    if (state.done.includes(ky)) return;
    state.done.push(ky);
    award(15, { label: "\u{1F3C6} Unidad completada" });
    checkMastered(sub, unit);
    renderLesson(sub, unit);
    return;
  }

  const replay = ev.target.closest('[data-action="replay"]');
  if (replay) {
    location.reload();
    return;
  }

  if (ev.target.closest("#btn-reset")) {
    if (confirm("\u00bfReiniciar todo tu progreso en este navegador?")) {
      localStorage.removeItem(STORE_KEY);
      state = defaultState();
      saveState();
      location.hash = "#/";
      location.reload();
    }
    return;
  }

  if (ev.target.closest("#btn-menu")) { toggleSidebar(); return; }
  if (ev.target.closest("#btn-side-collapse")) { if (isDesktop()) setSidebarOff(true); else closeSidebar(); return; }
  if (ev.target.closest("#overlay")) { closeSidebar(); return; }

  const dh = ev.target.closest("[data-href]");
  if (dh) { location.hash = dh.dataset.href; return; }
}

function checkMastered(sub, unit) {
  const P = practiceResult(sub, unit);
  const parts = [];
  unit.ejercicios.forEach((_, i) => parts.push(state.answers[practiceKey(sub.id, unit.num, i)]));
  parts.push(P.t, P.r);
  const all = parts.every(v => v === 1);
  if (all && !state.masteredInc) { state.mastered++; checkBadges(); saveState(); toast("\u{1F4AF} \u00a1Dominio completo de la unidad!"); }
  else if (!all) { toast("Completa todos los ejercicios para alcanzar el 100%."); }
}

function refreshResult() {
  const r = currentRoute();
  if (!r.unit || !r.sub) return;
  const box = document.querySelector("#result-box");
  if (!box) return;
  const html = resultBoxHTML(r.sub, r.unit, r.sub.color);
  if (box.innerHTML !== html) box.innerHTML = html;
}

/* ---------------- Init ---------------- */
function init() {
  state = loadState();
  loadAlumnos();
  loadPagos();
  loadAsistencias();
  migrarAlumnos();
  ensureSeed();
  if (typeof initPlanData === "function") initPlanData();
  loadNav();
  initSidebarCollapse();
  renderNav();
  setupNavToggles();
  paintStats();
  window.addEventListener("hashchange", route);
  document.addEventListener("click", onClick);
  document.addEventListener("input", ev => { if (handleSistemaInput(ev)) return; if (typeof handlePlanInput === "function" && handlePlanInput(ev)) return; });
  document.addEventListener("change", ev => { handleSistemaChange(ev); if (typeof handlePlanChange === "function") handlePlanChange(ev); });
  document.addEventListener("keydown", ev => {
    if (ev.key !== "Enter") return;
    const inp = ev.target.closest && ev.target.closest(".ex-input");
    if (!inp) return;
    ev.preventDefault();
    const item = inp.closest(".ex-item");
    const btn = item && item.querySelector('[data-action="check"]');
    if (btn) btn.click();
  });
  window.addEventListener("message", e => {
    const d = e.data;
    if (!d) return;
    if (d.type === "lecturaXp" && isFinite(d.xp) && d.xp !== 0) {
      state.xp += d.xp;
      saveState();
      paintStats();
      toast((d.xp > 0 ? "+" : "") + d.xp + " XP &middot; \u{1F4D6} Reto de lectura");
    } else if (d.type === "lecturaHeight") {
      const f = document.getElementById("lectura-frame");
      if (f && d.h && isFinite(d.h)) {
        f.style.height = Math.min(5000, Math.round(d.h)) + "px";
      }
    } else if (d.type === "mateHeight") {
      const f = document.getElementById("mate-frame");
      if (f && d.h && isFinite(d.h)) {
        f.style.height = Math.min(5000, Math.round(d.h)) + "px";
      }
    }
  });
  route();
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
else init();