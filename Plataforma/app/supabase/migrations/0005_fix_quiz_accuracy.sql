create or replace function public.app_submit_quiz_answer(
  p_assignment_id uuid,
  p_part text,
  p_question_key text,
  p_selected_index int
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
  v_question jsonb;
  v_correct_index int;
  v_is_correct boolean;
  v_progress public.unit_progress%rowtype;
  v_explanation text;
  v_accuracy numeric(5,2);
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

  if p_part not in ('tipo', 'reto', 'capitulo') then
    raise exception 'La parte del quiz no es válida' using errcode = '22023';
  end if;

  if p_question_key is null or length(trim(p_question_key)) = 0 then
    raise exception 'La clave de la pregunta es obligatoria' using errcode = '22023';
  end if;

  if p_selected_index is null or p_selected_index < 0 then
    raise exception 'El índice de respuesta no es válido' using errcode = '22023';
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

  if p_part = 'reto' then
    v_question := v_content->'reto';

    if v_question is null or v_question->>'key' <> p_question_key then
      raise exception 'La pregunta no existe en esta versión' using errcode = '22023';
    end if;
  else
    select q.value
      into v_question
      from jsonb_array_elements(coalesce(v_content->'quiz', '[]'::jsonb)) q
     where q.value->>'part' = p_part
       and q.value->>'key' = p_question_key
     limit 1;

    if v_question is null then
      raise exception 'La pregunta no existe en esta versión' using errcode = '22023';
    end if;
  end if;

  v_correct_index := coalesce(
    nullif(v_question->>'correctIndex', '')::int,
    nullif(v_question->>'correct_index', '')::int
  );

  if v_correct_index is null then
    raise exception 'La pregunta no tiene respuesta correcta configurada' using errcode = '22023';
  end if;

  if p_selected_index >= jsonb_array_length(coalesce(v_question->'options', '[]'::jsonb)) then
    raise exception 'El índice de respuesta está fuera de rango' using errcode = '22023';
  end if;

  v_is_correct := p_selected_index = v_correct_index;

  insert into public.quiz_attempts (
    student_id, assignment_id, unit_id, unit_version_id,
    part, question_key, selected_index, is_correct
  )
  values (
    v_student_id, v_assignment.id, v_assignment.unit_id, v_assignment.unit_version_id,
    p_part, p_question_key, p_selected_index, v_is_correct
  );

  with latest as (
    select distinct on (a.part, a.question_key)
      a.part, a.question_key, a.is_correct
    from public.quiz_attempts a
    where a.student_id = v_student_id
      and a.assignment_id = p_assignment_id
    order by a.part, a.question_key, a.created_at desc, a.id desc
  ),
  totals as (
    select
      jsonb_array_length(coalesce(v_content->'quiz', '[]'::jsonb))
      + case when v_content ? 'reto' then 1 else 0 end as total_questions
  )
  select case
    when totals.total_questions = 0 then null
    when count(latest.*) < totals.total_questions then null
    else round(100.0 * count(*) filter (where latest.is_correct) / totals.total_questions, 2)
  end
  into v_accuracy
  from latest
  cross join totals
  group by totals.total_questions;

  insert into public.unit_progress (
    student_id, assignment_id, unit_id, unit_version_id,
    status, started_at, last_activity_at, attempts_count, best_accuracy
  )
  values (
    v_student_id, v_assignment.id, v_assignment.unit_id, v_assignment.unit_version_id,
    'in_progress'::public.progress_status, now(), now(), 1, v_accuracy
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
    best_accuracy = case
      when v_accuracy is null then unit_progress.best_accuracy
      else greatest(coalesce(unit_progress.best_accuracy, 0), v_accuracy)
    end,
    updated_at = now()
  returning * into v_progress;

  v_explanation := v_question->>'explanation';

  return jsonb_build_object(
    'is_correct', v_is_correct,
    'correct_index', v_correct_index,
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

revoke all on function public.app_submit_quiz_answer(uuid, text, text, int) from public;
grant execute on function public.app_submit_quiz_answer(uuid, text, text, int) to authenticated;
