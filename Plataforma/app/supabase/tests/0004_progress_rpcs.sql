begin;

create temporary table _rpc_test_ids on commit drop as
select
  g.id as group_id,
  s.id as student_id,
  s.profile_id as student_profile_id,
  gp.id as guardian_profile_id
from public.groups g
join public.students s on s.group_id = g.id and s.student_code = 'PIL-001'
join public.profiles gp on gp.email = 'tutor1@ecoems.local'
where g.name = 'Piloto A'
limit 1;

do $$
begin
  if not exists (select 1 from _rpc_test_ids) then
    raise exception 'No se encontraron los datos base de Piloto A';
  end if;
end;
$$;

insert into public.subjects (id, name, short, active, sort_order)
values ('demo-rpc', 'Demo RPC', 'Demo', true, 999)
on conflict (id) do update set name = excluded.name, active = true;

insert into public.units (id, subject_id, num, title, status, sort_order, estimated_minutes)
values (
  '00000000-0000-0000-0000-000000000004',
  'demo-rpc',
  999,
  'Unidad demo RPC',
  'published',
  999,
  5
);

insert into public.unit_versions (id, unit_id, version, content, published_at)
values (
  '00000000-0000-0000-0000-000000000014',
  '00000000-0000-0000-0000-000000000004',
  1,
  '{
    "schemaVersion": 1,
    "unit": {
      "key": "demo-rpc-u999",
      "subjectKey": "demo-rpc",
      "num": 999,
      "title": "Unidad demo RPC",
      "objective": "Probar las RPC de progreso.",
      "estimatedMinutes": 5
    },
    "sections": [
      {
        "key": "leccion-01",
        "type": "lesson",
        "title": "Lección",
        "body": "Texto de prueba."
      },
      {
        "key": "ejercicio-01",
        "type": "exercise",
        "prompt": "Elige la respuesta correcta.",
        "options": ["A", "B", "C"],
        "correctIndex": 0,
        "explanation": "A es la correcta."
      }
    ],
    "quiz": [
      {
        "key": "reto-01",
        "part": "tipo",
        "prompt": "Elige la respuesta correcta.",
        "options": ["A", "B", "C"],
        "correctIndex": 1,
        "explanation": "B es la correcta."
      }
    ],
    "reto": {
      "key": "reto-principal",
      "title": "Reto final",
      "prompt": "Elige la respuesta correcta.",
      "options": ["A", "B", "C"],
      "correctIndex": 2,
      "explanation": "C es la correcta."
    },
    "resources": []
  }'::jsonb,
  now()
);

insert into public.unit_assignments (
  id, group_id, unit_id, unit_version_id, status, visible, opens_at
)
select
  '00000000-0000-0000-0000-000000000024',
  t.group_id,
  '00000000-0000-0000-0000-000000000004',
  '00000000-0000-0000-0000-000000000014',
  'active',
  true,
  now() - interval '1 hour'
from _rpc_test_ids t;

select set_config(
  'request.jwt.claims',
  (select json_build_object('sub', student_profile_id, 'role', 'authenticated')::text from _rpc_test_ids),
  true
);
set local role authenticated;

do $$
declare
  v_result jsonb;
begin
  v_result := public.app_start_unit('00000000-0000-0000-0000-000000000024');
  if v_result->>'status' <> 'in_progress' then
    raise exception 'app_start_unit no dejó la unidad en progreso: %', v_result;
  end if;
  raise notice 'app_start_unit ok';
end;
$$;

do $$
declare
  v_result jsonb;
begin
  v_result := public.app_record_exercise_attempt(
    '00000000-0000-0000-0000-000000000024',
    'ejercicio-01',
    '{"index": 1}'::jsonb,
    1000
  );

  if (v_result->>'is_correct')::boolean then
    raise exception 'La respuesta incorrecta se marcó como correcta';
  end if;
  if (v_result->>'attempt_no')::int <> 1 then
    raise exception 'El primer intento no es 1: %', v_result;
  end if;
  if (v_result->'progress'->>'attempts_count')::int <> 1 then
    raise exception 'attempts_count no se incrementó: %', v_result;
  end if;
  raise notice 'intento incorrecto ok';
end;
$$;

do $$
declare
  v_result jsonb;
begin
  v_result := public.app_record_exercise_attempt(
    '00000000-0000-0000-0000-000000000024',
    'ejercicio-01',
    '{"index": 0}'::jsonb,
    1000
  );

  if not (v_result->>'is_correct')::boolean then
    raise exception 'La respuesta correcta no se marcó como correcta';
  end if;
  if (v_result->>'attempt_no')::int <> 2 then
    raise exception 'El segundo intento no es 2: %', v_result;
  end if;
  if (v_result->'progress'->>'attempts_count')::int <> 2 then
    raise exception 'attempts_count no se incrementó al segundo intento: %', v_result;
  end if;
  raise notice 'intento correcto ok';
end;
$$;

do $$
declare
  v_result jsonb;
begin
  v_result := public.app_submit_quiz_answer(
    '00000000-0000-0000-0000-000000000024',
    'tipo',
    'reto-01',
    1
  );

  if not (v_result->>'is_correct')::boolean then
    raise exception 'La respuesta de quiz correcta no se marcó como correcta: %', v_result;
  end if;
  raise notice 'quiz ok';
end;
$$;

do $$
declare
  v_result jsonb;
begin
  v_result := public.app_submit_quiz_answer(
    '00000000-0000-0000-0000-000000000024',
    'reto',
    'reto-principal',
    2
  );

  if not (v_result->>'is_correct')::boolean then
    raise exception 'La respuesta de reto correcta no se marcó como correcta: %', v_result;
  end if;
  raise notice 'reto ok';
end;
$$;

do $$
declare
  v_result jsonb;
  v_progress public.unit_progress%rowtype;
  v_exercise_count int;
  v_quiz_count int;
begin
  v_result := public.app_complete_unit('00000000-0000-0000-0000-000000000024');

  if v_result->>'status' <> 'completed' then
    raise exception 'app_complete_unit no marcó la unidad como completada: %', v_result;
  end if;

  select p.*
    into v_progress
    from public.unit_progress p
   where p.assignment_id = '00000000-0000-0000-0000-000000000024'
     and p.student_id = public.app_student_id();

  if v_progress.attempts_count <> 4 then
    raise exception 'attempts_count final no es 4: %', v_progress.attempts_count;
  end if;

  if v_progress.best_accuracy is null or v_progress.best_accuracy < 100 then
    raise exception 'best_accuracy no quedó en 100: %', v_progress.best_accuracy;
  end if;

  select count(*) into v_exercise_count
    from public.exercise_attempts
   where assignment_id = '00000000-0000-0000-0000-000000000024';

  select count(*) into v_quiz_count
    from public.quiz_attempts
   where assignment_id = '00000000-0000-0000-0000-000000000024';

  if v_exercise_count <> 2 then
    raise exception 'Se esperaban 2 intentos de ejercicio y hay %', v_exercise_count;
  end if;

  if v_quiz_count <> 2 then
    raise exception 'Se esperaban 2 intentos de quiz y hay %', v_quiz_count;
  end if;

  raise notice 'app_complete_unit y progreso ok';
end;
$$;

reset role;

select set_config(
  'request.jwt.claims',
  (select json_build_object('sub', guardian_profile_id, 'role', 'authenticated')::text from _rpc_test_ids),
  true
);
set local role authenticated;

do $$
begin
  begin
    perform public.app_start_unit('00000000-0000-0000-0000-000000000024');
    raise exception 'El tutor no debería poder iniciar la unidad';
  exception when insufficient_privilege then
    raise notice 'tutor bloqueado ok';
  end;
end;
$$;

reset role;

update public.unit_assignments
   set status = 'closed'
 where id = '00000000-0000-0000-0000-000000000024';

select set_config(
  'request.jwt.claims',
  (select json_build_object('sub', student_profile_id, 'role', 'authenticated')::text from _rpc_test_ids),
  true
);
set local role authenticated;

do $$
begin
  begin
    perform public.app_record_exercise_attempt(
      '00000000-0000-0000-0000-000000000024',
      'ejercicio-01',
      '{"index": 0}'::jsonb,
      1000
    );
    raise exception 'La asignación cerrada no debería aceptar intentos';
  exception when insufficient_privilege then
    raise notice 'asignación cerrada bloqueada ok';
  end;
end;
$$;

reset role;

select '0004_progress_rpcs: ok' as test;

rollback;
