begin;

create temporary table _game_reading_test_ids on commit drop as
select
  s.id as student_id,
  s.profile_id as student_profile_id,
  gp.id as guardian_profile_id
from public.students s
join public.profiles gp on gp.email = 'tutor1@ecoems.local'
where s.student_code = 'PIL-001'
limit 1;

do $$
begin
  if not exists (select 1 from _game_reading_test_ids) then
    raise exception 'No se encontraron los datos base de PIL-001';
  end if;
end;
$$;

insert into public.game_catalog (id, name, description, metric_type, active)
values
  ('demo-game', 'Juego demo', 'Prueba de RPC', 'score', true),
  ('demo-game-inactive', 'Juego inactivo', 'Prueba de rechazo', 'score', false);

select set_config(
  'request.jwt.claims',
  (select json_build_object('sub', student_profile_id, 'role', 'authenticated')::text from _game_reading_test_ids),
  true
);
set local role authenticated;

do $$
declare
  v_result jsonb;
  v_count int;
  v_row public.game_sessions%rowtype;
begin
  v_result := public.app_record_game_session(
    'demo-game',
    80,
    100,
    80,
    8,
    2,
    60,
    'practica',
    'normal',
    '{"assignment_id": "demo"}'::jsonb
  );

  if (v_result->>'game_id') <> 'demo-game' then
    raise exception 'game_id incorrecto: %', v_result;
  end if;

  if (v_result->>'score')::numeric <> 80 then
    raise exception 'score incorrecto: %', v_result;
  end if;

  select count(*) into v_count
    from public.game_sessions
   where student_id = public.app_student_id()
     and game_id = 'demo-game';

  if v_count <> 1 then
    raise exception 'Se esperaba 1 sesión de juego y hay %', v_count;
  end if;

  select g.*
    into v_row
    from public.game_sessions g
   where g.student_id = public.app_student_id()
     and g.game_id = 'demo-game'
   order by g.created_at desc
   limit 1;

  if v_row.accuracy <> 80 or v_row.correct <> 8 or v_row.wrong <> 2 then
    raise exception 'La sesión de juego no coincide: %', row_to_json(v_row);
  end if;

  raise notice 'game session ok';
end;
$$;

do $$
declare
  v_result jsonb;
  v_count int;
  v_row public.reading_assessments%rowtype;
  v_stats public.student_stats%rowtype;
begin
  v_result := public.app_record_reading_assessment(
    'lectura',
    'comprension',
    45,
    80,
    90,
    3,
    'medio',
    120,
    '{"source": "demo"}'::jsonb
  );

  if (v_result->>'tool') <> 'lectura' then
    raise exception 'tool incorrecto: %', v_result;
  end if;

  if (v_result->>'wpm')::numeric <> 45 then
    raise exception 'wpm incorrecto: %', v_result;
  end if;

  select count(*) into v_count
    from public.reading_assessments
   where student_id = public.app_student_id();

  if v_count <> 1 then
    raise exception 'Se esperaba 1 lectura y hay %', v_count;
  end if;

  select r.*
    into v_row
    from public.reading_assessments r
   where r.student_id = public.app_student_id()
   order by r.created_at desc
   limit 1;

  if v_row.wpm <> 45 or v_row.comprehension_pct <> 80 then
    raise exception 'La lectura no coincide: %', row_to_json(v_row);
  end if;

  select s.*
    into v_stats
    from public.student_stats s
   where s.student_id = public.app_student_id();

  if v_stats.reading_wpm <> 45 or v_stats.reading_comprehension <> 80 then
    raise exception 'Las estadísticas de lectura no se actualizaron: %', row_to_json(v_stats);
  end if;

  if v_stats.last_activity_date <> current_date then
    raise exception 'last_activity_date no se actualizó: %', v_stats.last_activity_date;
  end if;

  raise notice 'reading assessment ok';
end;
$$;

do $$
begin
  begin
    perform public.app_record_game_session('demo-game-inactive', 10, 100, 10, 1, 0, 5);
    raise exception 'El juego inactivo no debería aceptar resultados';
  exception when invalid_parameter_value then
    raise notice 'inactive game blocked ok';
  end;
end;
$$;

do $$
begin
  begin
    perform public.app_record_game_session('demo-game', 10, 100, 101, 1, 0, 5);
    raise exception 'La precisión fuera de rango no debería aceptarse';
  exception when invalid_parameter_value then
    raise notice 'invalid game accuracy blocked ok';
  end;
end;
$$;

do $$
begin
  begin
    perform public.app_record_reading_assessment('lectura', null, 30, 101, 60, 2, null, 60);
    raise exception 'La comprensión fuera de rango no debería aceptarse';
  exception when invalid_parameter_value then
    raise notice 'invalid reading comprehension blocked ok';
  end;
end;
$$;

reset role;

select set_config(
  'request.jwt.claims',
  (select json_build_object('sub', guardian_profile_id, 'role', 'authenticated')::text from _game_reading_test_ids),
  true
);
set local role authenticated;

do $$
begin
  begin
    perform public.app_record_game_session('demo-game', 10, 100, 10, 1, 0, 5);
    raise exception 'El tutor no debería registrar juegos';
  exception when insufficient_privilege then
    raise notice 'guardian game blocked ok';
  end;

  begin
    perform public.app_record_reading_assessment('lectura', null, 20, 50, 40, 1, null, 30);
    raise exception 'El tutor no debería registrar lecturas';
  exception when insufficient_privilege then
    raise notice 'guardian reading blocked ok';
  end;
end;
$$;

reset role;

select '0006_game_reading_rpcs: ok' as test;

rollback;
