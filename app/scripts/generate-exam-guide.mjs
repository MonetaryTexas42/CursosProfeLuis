// Genera la guía de examen imprimible desde el contenido real de Español.
//
// Uso (desde app/):
//   node scripts/generate-exam-guide.mjs
//
// Sale a frontend/public/guia-examen-espanol.html. Se regenera cuando cambie
// el seed (content-v1.json) para que la guía y el examen usen los mismos temas.

import { readFileSync, writeFileSync } from 'node:fs';

const seedPath = new URL('../supabase/seed/content-v1.json', import.meta.url);
const outPath = new URL('../frontend/public/guia-examen-espanol.html', import.meta.url);

const content = JSON.parse(readFileSync(seedPath, 'utf8'));
const units = content.units
  .filter((unit) => unit.subjectId === 'espanol' && unit.status === 'published')
  .sort((a, b) => a.num - b.num);

if (!units.length) throw new Error('No hay unidades publicadas de Español en el seed');

const esc = (value) => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const list = (items, tag = 'li') => (items || [])
  .filter(Boolean)
  .map((item) => `<${tag}>${esc(typeof item === 'object' ? item.title || item.prompt : item)}${typeof item === 'object' && item.detail ? ` — ${esc(item.detail)}` : ''}</${tag}>`)
  .join('\n');

const sections = units.map((unit) => {
  const c = unit.content;
  const questions = c.quiz || [];
  const exercises = c.exercises || [];
  return `
    <section class="tema" id="tema-${unit.num}">
      <div class="tema-head">
        <h2>${unit.num}. ${esc(unit.title)}</h2>
        <span class="tiempo">≈ ${unit.estimatedMinutes} min de estudio</span>
      </div>
      ${c.unit?.truco ? `<p class="truco"><strong>Truco:</strong> ${esc(c.unit.truco)}</p>` : ''}

      <h3>Ideas clave</h3>
      <ul class="claves">${list(c.theory)}</ul>

      ${c.guides?.length ? `
        <h3>Cómo estudiarlo</h3>
        <ul>${list(c.guides)}</ul>
      ` : ''}

      ${c.examples?.length ? `
        <h3>Ejemplos resueltos</h3>
        <ol class="ejemplos">
          ${c.examples.map((example) => `
            <li>
              <p><strong>${esc(example.prompt)}</strong></p>
              <ol>${list(example.steps)}</ol>
              <p class="resultado">Resultado: ${esc(example.result)}</p>
            </li>
          `).join('\n')}
        </ol>
      ` : ''}

      ${c.commonMistakes?.length ? `
        <h3>Errores frecuentes</h3>
        <ul class="errores">${list(c.commonMistakes)}</ul>
      ` : ''}

      ${exercises.length ? `
        <h3>Practica en casa (${exercises.length})</h3>
        <ol class="practica">
          ${exercises.map((exercise) => `
            <li>
              <p>${esc(exercise.prompt)}</p>
              <p class="respuesta"><strong>Respuesta:</strong> ${esc(exercise.answer)}${exercise.explanation ? ` <em>${esc(exercise.explanation)}</em>` : ''}</p>
            </li>
          `).join('\n')}
        </ol>
      ` : ''}

      <h3>Compruébate (${questions.length} preguntas tipo examen)</h3>
      <ol class="quiz">
        ${questions.map((question) => `
          <li>
            <p>${esc(question.prompt)}</p>
            <ul class="opciones">
              ${(question.options || []).map((option, i) => `<li>${'ABCD'[i] || i + 1}) ${esc(option)}</li>`).join('\n')}
            </ul>
            <p class="respuesta"><strong>Respuesta: ${'ABCD'[question.correctIndex] || question.correctIndex + 1}</strong> · ${esc(question.explanation || '')}</p>
          </li>
        `).join('\n')}
      </ol>
    </section>
  `;
}).join('\n');

const indice = units.map((unit) => `<li><a href="#tema-${unit.num}">${unit.num}. ${esc(unit.title)}</a></li>`).join('\n');
const totalQuestions = units.reduce((sum, unit) => sum + (unit.content.quiz?.length || 0), 0);
const totalExercises = units.reduce((sum, unit) => sum + (unit.content.exercises?.length || 0), 0);

const html = `<!doctype html>
<html lang="es-MX">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Guía de examen · Español · ECOEMS</title>
  <style>
    :root { color-scheme: light; --ink: #1d1733; --muted: #645c7c; --brand: #7c3aed; --line: #ddd6e8; --soft: #f7f4fc; }
    * { box-sizing: border-box; }
    body { margin: 0; padding: 36px 20px 60px; background: #fff; color: var(--ink);
      font: 15px/1.55 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; }
    .hoja { max-width: 880px; margin: 0 auto; }
    header { border-bottom: 4px solid var(--brand); padding-bottom: 18px; margin-bottom: 22px; }
    .kicker { color: var(--brand); font-size: 12px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
    h1 { font-size: 32px; margin: 6px 0; letter-spacing: -.02em; }
    h2 { font-size: 21px; margin: 0; }
    h3 { font-size: 15px; margin: 20px 0 6px; color: var(--brand); }
    p { margin: 8px 0; }
    .muted, .tiempo { color: var(--muted); font-size: 13px; }
    .portada { background: var(--soft); border: 1px solid var(--line); border-radius: 16px; padding: 20px 24px; }
    .indice { columns: 2; padding-left: 20px; }
    .indice a { color: var(--ink); text-decoration: none; }
    .tema { padding: 24px 0; border-top: 1px solid var(--line); break-inside: avoid; }
    .tema-head { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; flex-wrap: wrap; }
    .truco { background: #fff8e1; border-left: 4px solid #f0b429; padding: 10px 14px; border-radius: 8px; }
    ul, ol { padding-left: 22px; margin: 6px 0; }
    li { margin: 5px 0; }
    .opciones { list-style: none; padding-left: 18px; color: var(--muted); font-size: 14px; }
    .respuesta { color: #0d7a52; font-size: 13.5px; }
    .resultado { font-weight: 700; }
    .consejos { background: var(--soft); border-radius: 16px; padding: 18px 24px; margin-top: 28px; }
    .accion { margin-top: 22px; text-align: center; }
    .accion a { display: inline-block; padding: 12px 20px; border-radius: 10px; background: var(--brand); color: #fff; text-decoration: none; font-weight: 700; }
    footer { margin-top: 30px; padding-top: 14px; border-top: 1px solid var(--line); color: var(--muted); font-size: 12px; }
    @media print {
      body { padding: 0; font-size: 11.5pt; }
      .tema { break-inside: avoid-page; }
      .accion { display: none; }
      header { border-bottom-width: 3px; }
      a { color: inherit; text-decoration: none; }
    }
    @media (max-width: 600px) { .indice { columns: 1; } }
  </style>
</head>
<body>
  <div class="hoja">
    <header>
      <span class="kicker">ECOEMS · Preparación final</span>
      <h1>Guía de examen de Español</h1>
      <p class="muted">${units.length} temas vistos · ${totalQuestions} preguntas tipo examen · ${totalExercises} ejercicios · generada desde el contenido oficial del curso.</p>
    </header>

    <div class="portada">
      <h2>Cómo usar esta guía</h2>
      <ol>
        <li>Lee las <strong>ideas clave</strong> y el truco de cada tema. No memorices frases: entiende la regla.</li>
        <li>Revisa los <strong>ejemplos resueltos</strong> y los <strong>errores frecuentes</strong>: ahí está la diferencia entre acertar y dudar.</li>
        <li>Haz los <strong>ejercicios</strong> sin ver la respuesta y compruébate después.</li>
        <li>Responde el <strong>cuestionario</strong> de cada tema. Si fallas, vuelve a las ideas clave de ese tema.</li>
        <li>El día del examen respira, lee dos veces y elimina primero las opciones claramente incorrectas.</li>
      </ol>
      <p class="muted">El examen en la plataforma mezcla los temas en otro orden: por eso conviene dominar cada uno por separado.</p>
    </div>

    <h2>Índice de temas</h2>
    <ol class="indice">${indice}</ol>

    ${sections}

    <div class="consejos">
      <h2>El día del examen</h2>
      <ul>
        <li>Llega con tiempo y ten tu sesión lista; necesitarás conexión para contestar en la plataforma.</li>
        <li>Lee el enunciado completo antes de elegir. Subraya mentalmente palabras como <em>no</em>, <em>siempre</em> o <em>excepto</em>.</li>
        <li>Si dudas, marca la opción y sigue: puedes regresar antes de terminar.</li>
        <li>Se mide el tiempo por pregunta y por sección, pero no hay límite: adminístralo sin ansiedad.</li>
        <li>Una vez que termines no se puede reabrir esa sesión; revisa el contador de contestadas.</li>
      </ul>
    </div>

    <div class="accion"><a href="./index.html">Ir a la plataforma</a></div>

    <footer>
      Guía generada automáticamente desde <code>supabase/seed/content-v1.json</code>.
      Contenido de Español del curso ECOEMS. Documento de estudio, no calificación oficial.
    </footer>
  </div>
</body>
</html>
`;

writeFileSync(outPath, html);
console.log(`Guía generada: ${outPath.pathname}`);
console.log(`${units.length} temas · ${totalQuestions} preguntas · ${totalExercises} ejercicios`);
