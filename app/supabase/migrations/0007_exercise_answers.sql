-- 0007 · Evaluación de ejercicios para el contenido real
--
-- El contenido sembrado usa flashcards de respuesta de texto
-- (content.exercicios: prompt, answer, acceptedAnswers, steps, explanation).
-- Esta migración adapta app_record_exercise_attempt para calificar ese
-- formato con comparación normalizada, y conserva el formato anterior
-- (content.sections con opciones e índices) como respaldo.

create or replace function public._app_normalize_answer(p_text text)
returns text
language sql
immutable
strict
as $$
  select translate(
           regexp_replace(
             regexp_replace(
               lower(trim(coalesce(p_text, ''))),
               '[«»“”"'']', '', 'g'),
             '[\s.,;:!?¡¿()]+$', '', 'g'),
           'áéíóúü−–—',
           'aeiouu---');
$$;

create or replace function public.app_record_exercise_attempt(
  p_assignment_id uuid,
  p_exercise_key text,
  p_answer jsonb,
  p_duration_ms int default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
set row_security = off
as $$
declare
  v_student_id uuid;
  v_assignment public.unit_assignments%rowtype;
  v_content jsonb;
  v_exercise jsonb;
  v_selected_index int;
  v_correct_index int;
  v_is_correct boolean;
  v_attempt_no int;
  v_progress public.unit_progress%rowtype;
  v_explanation text;
  v_answer_text text;
  v_normalized text;
  v_expected text;
  v_variant text;
begin
  if auth.uid() is null then
    raise exception 'No autenticado' using errcode = '42501';
  end if;

  select s.id
    into v_student_id
    from public.students s
   where s.profile_id = auth.uid()
     and s.status = 'active'::public.student_status;

  if v_student_id is null then
    raise exception 'Solo alumnos activos pueden registrar intentos' using errcode = '42501';
  end if;

  if p_exercise_key is null or length(trim(p_exercise_key)) = 0 then
    raise exception 'La clave del ejercicio es obligatoria' using errcode = '22023';
  end if;

  if p_duration_ms is not null and p_duration_ms < 0 then
    raise exception 'La duración no puede ser negativa' using errcode = '22023';
  end if;

  if not public.app_has_active_assignment(p_assignment_id) then
    raise exception 'La unidad no está activa para este alumno' using errcode = '42501';
  end if;

  select a.*
    into v_assignment
    from public.unit_assignments a
   where a.id = p_assignment_id;

  select v.content
    into v_content
    from public.unit_versions v
   where v.id = v_assignment.unit_version_id
     and v.unit_id = v_assignment.unit_id;

  if v_content is null then
    raise exception 'La versión de la unidad no existe' using errcode = '22023';
  end if;

  -- 1) Formato real: flashcards en content.exercicios.
  select e.value
    into v_exercise
    from jsonb_array_elements(coalesce(v_content->'exercises', '[]'::jsonb)) e
   where e.value->>'key' = p_exercise_key
   limit 1;

  -- 2) Respaldo: formato con opciones en content.sections.
  if v_exercise is null then
    select e.value
      into v_exercise
      from jsonb_array_elements(coalesce(v_content->'sections', '[]'::jsonb)) e
     where e.value->>'type' = 'exercise'
       and e.value->>'key' = p_exercise_key
     limit 1;
  end if;

  if v_exercise is null then
    raise exception 'El ejercicio no existe en esta versión' using errcode = '22023';
  end if;

  if jsonb_typeof(v_exercise->'options') = 'array'
     and jsonb_array_length(v_exercise->'options') > 0 then
    -- Modo opción múltiple (índice).
    if jsonb_typeof(p_answer) = 'number' then
      v_selected_index := (p_answer #>> '{}')::int;
    elsif jsonb_typeof(p_answer) = 'object' then
      v_selected_index := coalesce(
        nullif(p_answer->>'index', '')::int,
        nullif(p_answer->>'selectedIndex', '')::int
      );
    end if;

    if v_selected_index is null then
      raise exception 'La respuesta debe incluir un índice' using errcode = '22023';
    end if;

    v_correct_index := coalesce(
      nullif(v_exercise->>'correctIndex', '')::int,
      nullif(v_exercise->>'correct_index', '')::int
    );

    if v_correct_index is null then
      raise exception 'El ejercicio no tiene respuesta correcta configurada' using errcode = '22023';
    end if;

    if v_selected_index < 0
       or v_selected_index >= jsonb_array_length(v_exercise->'options') then
      raise exception 'El índice de respuesta está fuera de rango' using errcode = '22023';
    end if;

    v_is_correct := v_selected_index = v_correct_index;
  else
    -- Modo flashcard (respuesta de texto, comparación normalizada).
    if jsonb_typeof(p_answer) = 'string' then
      v_answer_text := p_answer #>> '{}';
    elsif jsonb_typeof(p_answer) = 'object' then
      v_answer_text := coalesce(p_answer->>'text', p_answer->>'answer', '');
    end if;

    v_normalized := public._app_normalize_answer(v_answer_text);

    if v_normalized = '' then
      raise exception 'La respuesta debe incluir el texto del alumno' using errcode = '22023';
    end if;

    v_expected := public._app_normalize_answer(v_exercise->>'answer');
    v_is_correct := v_normalized = v_expected;

    if not v_is_correct then
      for v_variant in
        select jsonb_array_elements_text(
          coalesce(v_exercise->'acceptedAnswers', '[]'::jsonb)
        )
      loop
        if public._app_normalize_answer(v_variant) = v_normalized then
          v_is_correct := true;
          exit;
        end if;
      end loop;
    end if;
  end if;

  select coalesce(max(a.attempt_no), 0) + 1
    into v_attempt_no
    from public.exercise_attempts a
   where a.student_id = v_student_id
     and a.assignment_id = p_assignment_id
     and a.exercise_key = p_exercise_key;

  insert into public.exercise_attempts (
    student_id, assignment_id, unit_id, unit_version_id,
    exercise_key, answer, is_correct, attempt_no, duration_ms
  )
  values (
    v_student_id, v_assignment.id, v_assignment.unit_id, v_assignment.unit_version_id,
    p_exercise_key, p_answer, v_is_correct, v_attempt_no, p_duration_ms
  );

  insert into public.unit_progress (
    student_id, assignment_id, unit_id, unit_version_id,
    status, started_at, last_activity_at, attempts_count
  )
  values (
    v_student_id, v_assignment.id, v_assignment.unit_id, v_assignment.unit_version_id,
    'in_progress'::public.progress_status, now(), now(), 1
  )
  on conflict (student_id, assignment_id) do update
    set status = case
      when unit_progress.status = 'not_started'::public.progress_status
        then 'in_progress'::public.progress_status
      else unit_progress.status
    end,
    started_at = coalesce(unit_progress.started_at, now()),
    last_activity_at = now(),
    attempts_count = unit_progress.attempts_count + 1,
    updated_at = now()
  returning * into v_progress;

  v_explanation := v_exercise->>'explanation';

  return jsonb_build_object(
    'is_correct', v_is_correct,
    'attempt_no', v_attempt_no,
    'correct_index', nullif(v_correct_index, null),
    'correct_answer', case
      when jsonb_typeof(v_exercise->'options') = 'array' then null
      else v_exercise->>'answer'
    end,
    'explanation', v_explanation,
    'progress', jsonb_build_object(
      'progress_id', v_progress.id,
      'status', v_progress.status,
      'attempts_count', v_progress.attempts_count,
      'best_accuracy', v_progress.best_accuracy,
      'completed_at', v_progress.completed_at
    )
  );
end;
$$;

revoke all on function public.app_record_exercise_attempt(uuid, text, jsonb, int) from public;
grant execute on function public.app_record_exercise_attempt(uuid, text, jsonb, int) to authenticated;
