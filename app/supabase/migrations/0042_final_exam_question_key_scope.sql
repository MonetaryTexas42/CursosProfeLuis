-- 0042 · Corrección del banco del examen final (0041)
--
-- En el contenido real, las claves de pregunta (`cap-01`, `cap-02`, …) se
-- repiten en cada unidad de Español. La restricción de 0041 era
-- unique (session_id, question_key), así que el segundo tema ya no podía
-- insertarse. La clave correcta es (session_id, section_key, question_key):
-- la pregunta se identifica dentro de su sección.
--
-- Rollback:
--   alter table public.final_exam_questions drop constraint if exists
--     final_exam_questions_session_section_question_key_key;
--   alter table public.final_exam_questions add constraint
--     final_exam_questions_session_id_question_key_key
--     unique (session_id, question_key);

alter table public.final_exam_questions
  drop constraint if exists final_exam_questions_session_id_question_key_key;

alter table public.final_exam_questions
  add constraint final_exam_questions_session_section_question_key_key
  unique (session_id, section_key, question_key);

comment on constraint final_exam_questions_session_section_question_key_key
  on public.final_exam_questions is
  '0042: las claves quiz se repiten por unidad; se distinguen por sección.';
