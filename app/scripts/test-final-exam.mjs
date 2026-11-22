// Prueba de extremo a extremo del examen final de Español (0041).
//
// Uso (desde app/):
//   DATABASE_URL="$(cat .secrets/staging-database-url)" node scripts/test-final-exam.mjs
//
// Solo se ejecuta contra STAGING: activa el flag dentro de una transacción,
// contesta las 136 preguntas, califica, verifica que las respuestas correctas
// no se puedan leer con SELECT y hace ROLLBACK. No deja datos ni cambios de
// configuración.

import pg from 'pg';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const url = process.env.DATABASE_URL;
if (!url) throw new Error('Falta DATABASE_URL');
if (!/hsfhlhrkmhajmpethzqn|localhost|127\.0\.0\.1/.test(url)) {
  throw new Error('Esta prueba solo se ejecuta contra staging; rechazado el destino');
}

const client = new pg.Client({ connectionString: url, connectionTimeoutMillis: 15000 });

try {
  await client.connect();
  await client.query('begin');

  const student = await client.query(`
    select s.id as student_id, s.profile_id
      from public.students s
     where s.status = 'active' and s.profile_id is not null
     limit 1
  `);
  assert.ok(student.rowCount, 'No hay alumno activo en staging');

  await client.query(`
    update public.settings
       set value = 'true'::jsonb
     where key = 'final_exam_spanish_enabled'
  `);

  await client.query(`set local role authenticated`);
  await client.query(`set local request.jwt.claim.sub = '${student.rows[0].profile_id}'`);

  const status = await client.query('select public.app_final_exam_status() as value');
  assert.equal(status.rows[0].value.enabled, true);
  assert.equal(status.rows[0].value.sections, 13);
  assert.equal(status.rows[0].value.questions, 136);

  let blocked = false;
  await client.query('savepoint key_probe');
  try {
    await client.query('select * from public.final_exam_key limit 1');
  } catch (error) {
    blocked = /permission denied/.test(error.message);
  }
  await client.query('rollback to savepoint key_probe');
  assert.ok(blocked, 'Un alumno autenticado no debe poder leer final_exam_key');

  const started = await client.query('select public.app_start_final_exam() as value');
  const exam = started.rows[0].value;
  assert.equal(exam.sections.length, 13, 'Deben haber 13 secciones');
  assert.equal(exam.questions.length, 136, 'Deben haber 136 preguntas');
  assert.ok(!JSON.stringify(exam).includes('correctIndex'), 'El inicio no debe revelar respuestas');

  const seenSections = new Set(exam.sections.map((s) => s.key));
  assert.equal(seenSections.size, 13, 'Cada sección debe ser única');
  assert.notDeepEqual(
    exam.sections.map((s) => s.key),
    [...exam.sections].sort((a, b) => a.num - b.num).map((s) => s.key),
    'El orden de secciones no debe ser el cronológico'
  );

  let answered = 0;
  for (const question of exam.questions) {
    await client.query(
      'select public.app_answer_final_exam($1, $2, $3, $4)',
      [exam.sessionId, question.id, 0, 1000 + answered]
    );
    answered += 1;
  }

  const finished = await client.query(
    'select public.app_finish_final_exam($1) as value',
    [exam.sessionId]
  );
  const result = finished.rows[0].value;
  assert.equal(result.total, 136);
  assert.equal(result.answered, 136);
  assert.ok(Math.abs(result.score - (result.correct * 100) / 136) < 0.01, 'El puntaje debe corresponder a aciertos/136');
  assert.equal(result.sections.length, 13);
  assert.equal(result.sections.reduce((sum, s) => sum + s.total, 0), 136);
  assert.equal(result.sections.reduce((sum, s) => sum + s.timeMs, 0), result.durationMs);
  assert.equal(result.answers.length, 136);
  assert.ok('correctIndex' in result.answers[0], 'Al terminar sí se revela la corrección');

  const session = await client.query(`
    select status, score, correct_answers, answered_questions
      from public.final_exam_sessions where id = $1
  `, [exam.sessionId]);
  assert.equal(session.rows[0].status, 'completed');
  assert.equal(session.rows[0].correct_answers, result.correct);

  await client.query('rollback');

  console.log('PASS · 13 secciones, 136 preguntas, respuestas y tiempos registrados');
  console.log(`PASS · puntaje calculado en servidor: ${result.score}% (${result.correct}/136)`);
  console.log('PASS · final_exam_key no legible por el alumno');
  console.log('PASS · rollback: flag y datos de staging sin cambios');
} catch (error) {
  await client.query('rollback').catch(() => {});
  console.error('FAIL:', error.message);
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
}
