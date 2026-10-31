begin;

-- Prueba de humo con contenido real: asigna espanol-u01 y matematicas-u01
-- al grupo Piloto A y recorre el flujo completo del alumno PIL-001.
create temporary table _smoke_ids on commit drop as
select
  (select id from public.groups where name = 'Piloto A') as group_id,
  (select id from public.units where subject_id = 'espanol' and num = 1) as espanol_unit_id,
  (select id from public.units where subject_id = 'matematicas' and num = 1) as mat_unit_id,
  s.id as student_id,
  s.profile_id as student_profile_id,
  gp.id as guardian_profile_id
from public.students s
join public.profiles gp on gp.email = 'tutor1@ecoems.local'
where s.student_code = 'PIL-001'
limit 1;

grant select on _smoke_ids to authenticated;

do $$
begin
  if not exists (select 1 from _smoke_ids) then
    raise exception 'No se encontraron los datos base de PIL-001';
  end if;
end;
$$;

insert into public.unit_assignments
  (group_id, unit_id, unit_version_id, opens_at, closes_at, status, visible)
select i.group_id, i.espanol_unit_id, v.id,
       now() - interval '1 hour', now() + interval '1 day', 'active', true
from _smoke_ids i
join public.unit_versions v on v.unit_id = i.espanol_unit_id and v.version = 1;

insert into public.unit_assignments
  (group_id, unit_id, unit_version_id, opens_at, closes_at, status, visible)
select i.group_id, i.mat_unit_id, v.id,
       now() - interval '1 hour', now() + interval '1 day', 'active', true
from _smoke_ids i
join public.unit_versions v on v.unit_id = i.mat_unit_id and v.version = 1;

select set_config(
  'request.jwt.claims',
  (select json_build_object('sub', student_profile_id, 'role', 'authenticated')::text from _smoke_ids),
  true
);
set local role authenticated;

do $$
declare
  v_espanol_assignment uuid;
  v_mat_assignment uuid;
  v_result jsonb;
  v_content_ok boolean;
  v_progress public.unit_progress%rowtype;
  v_attempt_count int;
  v_quiz_count int;
begin
  select a.id into v_espanol_assignment
    from public.unit_assignments a, _smoke_ids i
   where a.group_id = i.group_id and a.unit_id = i.espanol_unit_id
     and a.status = 'active' limit 1;

  select a.id into v_mat_assignment
    from public.unit_assignments a, _smoke_ids i
   where a.group_id = i.group_id and a.unit_id = i.mat_unit_id
     and a.status = 'active' limit 1;

  -- 1. El alumno inicia la unidad real.
  v_result := public.app_start_unit(v_espanol_assignment);
  if v_result->>'status' <> 'in_progress' then
    raise exception 'start: %', v_result;
  end if;

  -- 2. Puede leer el contenido real de la versión asignada (RLS).
  select (v.content->'exercises') is not null
        and (v.content->>'schemaVersion') is not null
        and jsonb_array_length(v.content->'exercises') = 9
    into v_content_ok
    from public.unit_versions v
   where v.unit_id = (select espanol_unit_id from _smoke_ids)
     and v.version = 1;

  if not coalesce(v_content_ok, false) then
    raise exception 'El alumno no puede leer el contenido de la versión asignada';
  end if;

  -- 3. Intento correcto de flashcard (respuesta de texto normalizada).
  v_result := public.app_record_exercise_attempt(
    v_espanol_assignment, 'ej-01', '{"text": "apelativa"}'::jsonb, 5000
  );
  if not (v_result->>'is_correct')::boolean then
    raise exception 'La respuesta correcta se calificó mal: %', v_result;
  end if;

  -- 4. Intento incorrecto.
  v_result := public.app_record_exercise_attempt(
    v_espanol_assignment, 'ej-02', '{"text": "apelativa"}'::jsonb, 4000
  );
  if (v_result->>'is_correct')::boolean then
    raise exception 'La respuesta incorrecta se calificó como correcta: %', v_result;
  end if;

  -- 5. Quiz (tipo) de la unidad de matemáticas con respuesta correcta.
  v_result := public.app_submit_quiz_answer(v_mat_assignment, 'tipo', 'quiz-01', 0);
  if not (v_result->>'is_correct')::boolean then
    raise exception 'Quiz correcto mal calificado: %', v_result;
  end if;

  -- 6. Quiz con respuesta incorrecta.
  v_result := public.app_submit_quiz_answer(v_mat_assignment, 'tipo', 'quiz-01', 1);
  if (v_result->>'is_correct')::boolean then
    raise exception 'Quiz incorrecto calificado como correcto: %', v_result;
  end if;

  -- 7. Completa la unidad.
  v_result := public.app_complete_unit(v_espanol_assignment);
  if v_result->>'status' <> 'completed' then
    raise exception 'complete: %', v_result;
  end if;

  select count(*) into v_attempt_count
    from public.exercise_attempts a, _smoke_ids i
   where a.student_id = i.student_id;

  if v_attempt_count <> 2 then
    raise exception 'Se esperaban 2 intentos de ejercicio y hay %', v_attempt_count;
  end if;

  select count(*) into v_quiz_count
    from public.quiz_attempts a, _smoke_ids i
   where a.student_id = i.student_id;

  if v_quiz_count <> 2 then
    raise exception 'Se esperaban 2 intentos de quiz y hay %', v_quiz_count;
  end if;

  raise notice 'flujo completo con contenido real: ok';
end;
$$;

reset role;

select set_config(
  'request.jwt.claims',
  (select json_build_object('sub', guardian_profile_id, 'role', 'authenticated')::text from _smoke_ids),
  true
);
set local role authenticated;

do $$
declare
  v_assignment uuid;
begin
  select a.id into v_assignment
    from public.unit_assignments a, _smoke_ids i
   where a.group_id = i.group_id and a.unit_id = i.espanol_unit_id
     and a.status = 'active' limit 1;

  begin
    perform public.app_start_unit(v_assignment);
    raise exception 'El tutor no debería iniciar unidades';
  exception when insufficient_privilege then
    raise notice 'guardian blocked ok';
  end;
end;
$$;

reset role;

select '0007_content_smoke: ok' as test;

rollback;
