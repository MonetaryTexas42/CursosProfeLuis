-- 0035 · Requisitos para completar una unidad (DB-04, FUN-05)
--
-- `app_complete_unit` marcaba la unidad como completada sin exigir ejercicios
-- ni quiz. Aquí se añade una regla configurable en `settings` y una RPC que
-- expone los requisitos y lo que falta para que la interfaz lo explique.
--
-- Regla por defecto: 60 % de los ejercicios respondidos y 70 % de precisión
-- en el quiz. Se puede ajustar con:
--   update public.settings
--      set value = '{"min_exercises_pct":60,"min_quiz_accuracy":70}'::jsonb,
--          updated_at = now()
--    where key = 'unit_completion_rules';
--
-- Rollback: restaurar `app_complete_unit` desde 0004 y borrar la clave de
-- `settings` y la función `app_unit_requirements`. Reabre DB-04.

insert into public.settings (key, value)
values ('unit_completion_rules', '{"min_exercises_pct":60,"min_quiz_accuracy":70}'::jsonb)
on conflict (key) do nothing;

create or replace function public.app_unit_requirements(p_assignment_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public, pg_temp
set row_security = off
as $$
declare
  v_student_id uuid;
  v_content jsonb;
  v_min_ex_pct int;
  v_min_accuracy int;
  v_total_ex int;
  v_answered_ex int;
  v_total_q int;
  v_answered_q int;
  v_accuracy numeric(5,2);
  v_needed_ex int;
  v_missing text[] := '{}'::text[];
  v_can boolean;
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
    raise exception 'Solo alumnos activos pueden consultar requisitos' using errcode = '42501';
  end if;

  select
    coalesce((value ->> 'min_exercises_pct')::int, 60),
    coalesce((value ->> 'min_quiz_accuracy')::int, 70)
    into v_min_ex_pct, v_min_accuracy
    from public.settings
   where key = 'unit_completion_rules';

  v_min_ex_pct := coalesce(v_min_ex_pct, 60);
  v_min_accuracy := coalesce(v_min_accuracy, 70);

  select v.content
    into v_content
    from public.unit_versions v
    join public.unit_assignments a on a.unit_version_id = v.id
   where a.id = p_assignment_id;

  if v_content is null then
    raise exception 'La unidad no existe' using errcode = 'P0002';
  end if;

  -- El contenido versionado guarda los ejercicios en `content.exercises`.
  v_total_ex := jsonb_array_length(coalesce(v_content -> 'exercises', '[]'::jsonb));

  select count(distinct exercise_key)::int
    into v_answered_ex
    from public.exercise_attempts a
   where a.student_id = v_student_id
     and a.assignment_id = p_assignment_id;

  v_total_q := jsonb_array_length(coalesce(v_content -> 'quiz', '[]'::jsonb))
    + case when v_content ? 'reto' then 1 else 0 end;

  select count(distinct (part || ':' || question_key))::int
    into v_answered_q
    from public.quiz_attempts a
   where a.student_id = v_student_id
     and a.assignment_id = p_assignment_id;

  select best_accuracy
    into v_accuracy
    from public.unit_progress p
   where p.student_id = v_student_id
     and p.assignment_id = p_assignment_id;

  v_needed_ex := ceil(v_total_ex * v_min_ex_pct::numeric / 100.0)::int;

  if v_answered_ex < v_needed_ex then
    v_missing := array_append(
      v_missing,
      format('responde %s ejercicios (llevas %s)', v_needed_ex, v_answered_ex)
    );
  end if;

  if v_answered_q < v_total_q then
    v_missing := array_append(
      v_missing,
      format('responde el quiz (llevas %s de %s)', v_answered_q, v_total_q)
    );
  end if;

  if coalesce(v_accuracy, 0) < v_min_accuracy then
    v_missing := array_append(
      v_missing,
      format('alcanza %s %% de precisión (llevas %s %%)', v_min_accuracy, coalesce(v_accuracy, 0))
    );
  end if;

  v_can := cardinality(v_missing) = 0;

  return jsonb_build_object(
    'assignment_id', p_assignment_id,
    'rules', jsonb_build_object(
      'min_exercises_pct', v_min_ex_pct,
      'min_quiz_accuracy', v_min_accuracy
    ),
    'exercises', jsonb_build_object('total', v_total_ex, 'answered', v_answered_ex, 'required', v_needed_ex),
    'quiz', jsonb_build_object('total', v_total_q, 'answered', v_answered_q),
    'best_accuracy', v_accuracy,
    'missing', v_missing,
    'can_complete', v_can,
    'message', case
      when v_can then 'Puedes marcar la unidad como completada.'
      else 'Falta: ' || array_to_string(v_missing, '; ') || '.'
    end
  );
end;
$$;

revoke all on function public.app_unit_requirements(uuid) from public;
grant execute on function public.app_unit_requirements(uuid) to authenticated;

comment on function public.app_unit_requirements(uuid) is
  'DB-04/FUN-05: expone la regla de completado y lo que falta; la UI solo renderiza este resultado.';

-- ---------------------------------------------------------------------------
-- app_complete_unit con validación en servidor
-- ---------------------------------------------------------------------------

create or replace function public.app_complete_unit(p_assignment_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
set row_security = off
as $$
declare
  v_student_id uuid;
  v_assignment public.unit_assignments%rowtype;
  v_progress public.unit_progress%rowtype;
  v_requirements jsonb;
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
    raise exception 'Solo alumnos activos pueden completar unidades' using errcode = '42501';
  end if;

  if not public.app_has_active_assignment(p_assignment_id) then
    raise exception 'La unidad no está activa para este alumno' using errcode = '42501';
  end if;

  v_requirements := public.app_unit_requirements(p_assignment_id);

  if not (v_requirements ->> 'can_complete')::boolean then
    raise exception '%', v_requirements ->> 'message' using errcode = '22023';
  end if;

  select a.*
    into v_assignment
    from public.unit_assignments a
   where a.id = p_assignment_id;

  insert into public.unit_progress (
    student_id, assignment_id, unit_id, unit_version_id,
    status, started_at, completed_at, last_activity_at
  )
  values (
    v_student_id, v_assignment.id, v_assignment.unit_id, v_assignment.unit_version_id,
    'completed'::public.progress_status, now(), now(), now()
  )
  on conflict (student_id, assignment_id) do update
    set status = case
      when unit_progress.status = 'mastered'::public.progress_status
        then unit_progress.status
      else 'completed'::public.progress_status
    end,
    started_at = coalesce(unit_progress.started_at, now()),
    completed_at = coalesce(unit_progress.completed_at, now()),
    last_activity_at = now(),
    updated_at = now()
  returning * into v_progress;

  return jsonb_build_object(
    'progress_id', v_progress.id,
    'status', v_progress.status,
    'attempts_count', v_progress.attempts_count,
    'best_accuracy', v_progress.best_accuracy,
    'completed_at', v_progress.completed_at
  );
end;
$$;

revoke all on function public.app_complete_unit(uuid) from public;
grant execute on function public.app_complete_unit(uuid) to authenticated;

comment on function public.app_complete_unit(uuid) is
  'DB-04: solo completa la unidad si se cumplen los requisitos devueltos por app_unit_requirements.';
