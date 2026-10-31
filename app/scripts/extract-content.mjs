// Extrae el contenido del curso actual (curso/js/data.js) y lo normaliza
// al formato de la plataforma (seed/content-v1.json).
//
// Uso (desde app/):
//   node scripts/extract-content.mjs
//
// El archivo generado vive en supabase/seed/content-v1.json y lo consume
// scripts/seed-content.mjs. Ver Fase-0/04-contenido-y-versionado.md.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import vm from "node:vm";

const here = dirname(fileURLToPath(import.meta.url));
const dataPath = resolve(here, "../../../curso/js/data.js");
const outDir = resolve(here, "../supabase/seed");
const outPath = resolve(outDir, "content-v1.json");

const code = readFileSync(dataPath, "utf8");
const sandbox = {};
vm.createContext(sandbox);
const DATA = vm.runInContext(code + "; DATA", sandbox);

const ESTIMATED_MINUTES = 30;

/** Serialización canónica: claves ordenadas de forma recursiva. */
function canonical(value) {
  if (Array.isArray(value)) return "[" + value.map(canonical).join(",") + "]";
  if (value !== null && typeof value === "object") {
    const keys = Object.keys(value).sort();
    return "{" + keys.map((k) => `${JSON.stringify(k)}:${canonical(value[k])}`).join(",") + "}";
  }
  return JSON.stringify(value);
}

const checksumOf = (content) =>
  createHash("sha256").update(canonical(content)).digest("hex");

const errors = [];

function unitKey(subjectId, num) {
  return `${subjectId}-u${String(num).padStart(2, "0")}`;
}

function validateQuiz(quiz, part, key, unitKey) {
  if (!quiz || typeof quiz.enc !== "string" || quiz.enc.trim() === "") return null;
  const options = Array.isArray(quiz.ops) ? quiz.ops : [];
  const correctIndex = Number(quiz.correct);
  if (options.length < 2) {
    errors.push(`${unitKey}: ${key} con menos de 2 opciones`);
    return null;
  }
  if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex >= options.length) {
    errors.push(`${unitKey}: ${key} con correctIndex fuera de rango (${correctIndex})`);
    return null;
  }
  return {
    key,
    part,
    prompt: quiz.enc,
    options,
    correctIndex,
    explanation: quiz.expl ?? "",
  };
}

function normalizeMiniQuizzes(miniItems, unitKey) {
  const quizzes = [];
  if (!miniItems || !Array.isArray(miniItems)) return quizzes;
  miniItems.forEach((item, index) => {
    const quiz = validateQuiz(
      item,
      "capitulo",
      `cap-${String(index + 1).padStart(2, "0")}`,
      unitKey,
    );
    if (quiz) quizzes.push(quiz);
  });
  return quizzes;
}

function normalizeExercise(ex, index) {
  const exercise = {
    key: `ej-${String(index + 1).padStart(2, "0")}`,
    prompt: typeof ex.q === "string" ? ex.q : "",
    answer: typeof ex.a === "string" ? ex.a : "",
    explanation: typeof ex.p === "string" ? ex.p : "",
    acceptedAnswers: Array.isArray(ex.v) ? ex.v.map(String) : [],
    steps: Array.isArray(ex.pasos) ? ex.pasos.map(String) : [],
    figure: ex.fig ?? null,
  };
  if (!exercise.prompt) errors.push(`ejercicio ${exercise.key}: sin enunciado`);
  if (!exercise.answer) errors.push(`ejercicio ${exercise.key}: sin respuesta`);
  return exercise;
}

function normalizeUnit(subjectId, subjectReady, unit) {
  const key = unitKey(subjectId, unit.num);

  const tipoQuiz = validateQuiz(unit.tipo, "tipo", "quiz-01", key);
  const capQuizzes = normalizeMiniQuizzes(
    unit.capitulo?.mini?.items ?? [],
    key,
  );
  const retoQuiz = validateQuiz(unit.reto, "reto", "reto-01", key);

  const content = {
    schemaVersion: 1,
    unit: {
      key,
      subjectKey: subjectId,
      num: unit.num,
      title: unit.name ?? "",
      objective: Array.isArray(unit.objetivo) ? unit.objetivo : [],
      hook: unit.hook ?? "",
      truco: unit.truco ?? "",
      estimatedMinutes: ESTIMATED_MINUTES,
    },
    theory: Array.isArray(unit.teoria) ? unit.teoria.map(String) : [],
    guides: Array.isArray(unit.guia) ? unit.guia.map(String) : [],
    examples: Array.isArray(unit.ejemplos)
      ? unit.ejemplos.map((e) => ({
          prompt: e.enc ?? "",
          steps: Array.isArray(e.pasos) ? e.pasos.map(String) : [],
          result: e.res ?? "",
        }))
      : [],
    commonMistakes: Array.isArray(unit.errores)
      ? unit.errores.map((e) => ({
          title: e.t ?? "",
          detail: e.d ?? "",
        }))
      : [],
    chapter: unit.capitulo ?? null,
    exercises: Array.isArray(unit.ejercicios)
      ? unit.ejercicios.map(normalizeExercise)
      : [],
    quiz: [tipoQuiz, ...capQuizzes].filter(Boolean),
    reto: retoQuiz,
    resources: [],
  };

  if (content.exercises.length !== 9) {
    errors.push(`${key}: se esperaban 9 ejercicios y hay ${content.exercises.length}`);
  }

  return {
    subjectId,
    num: unit.num,
    title: unit.name ?? "",
    key,
    status: subjectReady ? "published" : "draft",
    estimatedMinutes: ESTIMATED_MINUTES,
    content,
  };
}

const subjects = DATA.subjects.map((s, i) => ({
  id: s.id,
  num: s.num ?? i + 1,
  short: s.short ?? "",
  name: s.name ?? "",
  icon: s.icon ?? "",
  badge: s.badge ?? "",
  blurb: s.blurb ?? "",
  color: s.color ?? "#64748B",
  ready: Boolean(s.ready),
  unitsCount: Array.isArray(s.units) ? s.units.length : 0,
  sortOrder: i + 1,
}));

const units = [];
let totalExercises = 0;
let totalQuiz = 0;
let totalReto = 0;

for (const subject of DATA.subjects) {
  for (const unit of subject.units ?? []) {
    const normalized = normalizeUnit(subject.id, subject.ready, unit);
    units.push(normalized);
    totalExercises += normalized.content.exercises.length;
    totalQuiz += normalized.content.quiz.length;
    if (normalized.content.reto) totalReto += 1;
  }
}

const keys = new Set(units.map((u) => u.key));
if (keys.size !== units.length) errors.push("Hay claves de unidad duplicadas");

const output = {
  generatedAt: new Date().toISOString(),
  source: "curso/js/data.js",
  schemaVersion: 1,
  subjects,
  units,
};

mkdirSync(outDir, { recursive: true });
writeFileSync(outPath, JSON.stringify(output, null, 1), "utf8");

console.log(`Materias: ${subjects.length} (${subjects.filter((s) => s.ready).length} listas)`);
console.log(`Unidades: ${units.length} (se esperaban 60)`);
console.log(`Ejercicios: ${totalExercises} (se esperaban 540)`);
console.log(`Quiz (tipo): ${totalQuiz} · Retos: ${totalReto}`);
console.log(`Errores de validación: ${errors.length}`);
for (const error of errors.slice(0, 20)) console.log("  -", error);
if (errors.length > 20) console.log(`  ... y ${errors.length - 20} más`);
console.log(`\nEscrito: ${outPath}`);
