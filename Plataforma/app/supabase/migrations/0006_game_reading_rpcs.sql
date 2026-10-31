create or replace function public.app_record_game_session(
  p_game_id text,
  p_score numeric,
  p_max_score numeric default null,
  p_accuracy numeric default null,
  p_correct int default 0,
  p_wrong int default 0,
  p_duration_seconds int default 0,
  p_mode text default null,
  p_difficulty text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
set row_security = off
as $$
declare
  v_student_id uuid;
  v_game public.game_catalog%rowtype;
  v_session public.game_sessions%rowtype;
  v_metadata jsonb := coalesce(p_metadata, '{}'::jsonb);
  v_correct int := coalesce(p_correct, 0);
  v_wrong int := coalesce(p_wrong, 0);
  v_duration int := coalesce(p_duration_seconds, 0);
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
    raise exception 'Solo alumnos activos pueden registrar juegos' using errcode = '42501';
  end if;

  if p_game_id is null or length(trim(p_game_id)) = 0 then
    raise exception 'El juego es obligatorio' using errcode = '22023';
  end if;

  if p_score is null or p_score < 0 then
    raise exception 'El puntaje no es válido' using errcode = '22023';
  end if;

  if p_max_score is not null and p_max_score < 0 then
    raise exception 'El puntaje máximo no es válido' using errcode = '22023';
  end if;

  if p_accuracy is not null and (p_accuracy < 0 or p_accuracy > 100) then
    raise exception 'La precisión debe estar entre 0 y 100' using errcode = '22023';
  end if;

  if v_correct < 0 or v_wrong < 0 then
    raise exception 'Los aciertos y errores no pueden ser negativos' using errcode = '22023';
  end if;

  if v_duration < 0 then
    raise exception 'La duración no puede ser negativa' using errcode = '22023';
  end if;

  if jsonb_typeof(v_metadata) <> 'object' then
    raise exception 'Los metadatos deben ser un objeto JSON' using errcode = '22023';
  end if;

  select g.*
    into v_game
    from public.game_catalog g
   where g.id = p_game_id
     and g.active;

  if v_game.id is null then
    raise exception 'El juego no existe o está inactivo' using errcode = '22023';
  end if;

  insert into public.game_sessions (
    student_id, game_id, mode, difficulty, score, max_score, accuracy,
    correct, wrong, duration_seconds, metadata
  )
  values (
    v_student_id, p_game_id, nullif(trim(p_mode), ''), nullif(trim(p_difficulty), ''),
    p_score, p_max_score, p_accuracy, v_correct, v_wrong, v_duration, v_metadata
  )
  returning * into v_session;

  insert into public.student_stats (student_id, last_activity_date, updated_at)
  values (v_student_id, current_date, now())
  on conflict (student_id) do update
    set last_activity_date = excluded.last_activity_date,
        updated_at = now();

  return jsonb_build_object(
    'id', v_session.id,
    'game_id', v_session.game_id,
    'score', v_session.score,
    'max_score', v_session.max_score,
    'accuracy', v_session.accuracy,
    'correct', v_session.correct,
    'wrong', v_session.wrong,
    'duration_seconds', v_session.duration_seconds,
    'created_at', v_session.created_at
  );
end;
$$;

create or replace function public.app_record_reading_assessment(
  p_tool text default 'lectura',
  p_assessment_type text default null,
  p_wpm numeric default null,
  p_comprehension_pct numeric default null,
  p_words_read int default null,
  p_errors int default null,
  p_level text default null,
  p_duration_seconds int default 0,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
set row_security = off
as $$
declare
  v_student_id uuid;
  v_assessment public.reading_assessments%rowtype;
  v_stats public.student_stats%rowtype;
  v_metadata jsonb := coalesce(p_metadata, '{}'::jsonb);
  v_duration int := coalesce(p_duration_seconds, 0);
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
    raise exception 'Solo alumnos activos pueden registrar lecturas' using errcode = '42501';
  end if;

  if p_tool is null or length(trim(p_tool)) = 0 then
    raise exception 'La herramienta es obligatoria' using errcode = '22023';
  end if;

  if p_wpm is not null and p_wpm < 0 then
    raise exception 'Las palabras por minuto no son válidas' using errcode = '22023';
  end if;

  if p_comprehension_pct is not null
     and (p_comprehension_pct < 0 or p_comprehension_pct > 100) then
    raise exception 'La comprensión debe estar entre 0 y 100' using errcode = '22023';
  end if;

  if p_words_read is not null and p_words_read < 0 then
    raise exception 'Las palabras leídas no pueden ser negativas' using errcode = '22023';
  end if;

  if p_errors is not null and p_errors < 0 then
    raise exception 'Los errores no pueden ser negativos' using errcode = '22023';
  end if;

  if v_duration < 0 then
    raise exception 'La duración no puede ser negativa' using errcode = '22023';
  end if;

  if jsonb_typeof(v_metadata) <> 'object' then
    raise exception 'Los metadatos deben ser un objeto JSON' using errcode = '22023';
  end if;

  insert into public.reading_assessments (
    student_id, tool, assessment_type, wpm, comprehension_pct,
    words_read, errors, level, duration_seconds, metadata
  )
  values (
    v_student_id, trim(p_tool), nullif(trim(p_assessment_type), ''),
    p_wpm, p_comprehension_pct, p_words_read, p_errors,
    nullif(trim(p_level), ''), v_duration, v_metadata
  )
  returning * into v_assessment;

  insert into public.student_stats (
    student_id, reading_wpm, reading_comprehension, last_activity_date, updated_at
  )
  values (
    v_student_id, p_wpm, p_comprehension_pct, current_date, now()
  )
  on conflict (student_id) do update
    set reading_wpm = coalesce(excluded.reading_wpm, student_stats.reading_wpm),
        reading_comprehension = coalesce(
          excluded.reading_comprehension,
          student_stats.reading_comprehension
        ),
        last_activity_date = excluded.last_activity_date,
        updated_at = now()
  returning * into v_stats;

  return jsonb_build_object(
    'id', v_assessment.id,
    'tool', v_assessment.tool,
    'assessment_type', v_assessment.assessment_type,
    'wpm', v_assessment.wpm,
    'comprehension_pct', v_assessment.comprehension_pct,
    'words_read', v_assessment.words_read,
    'errors', v_assessment.errors,
    'level', v_assessment.level,
    'duration_seconds', v_assessment.duration_seconds,
    'created_at', v_assessment.created_at,
    'reading_wpm', v_stats.reading_wpm,
    'reading_comprehension', v_stats.reading_comprehension
  );
end;
$$;

revoke all on function public.app_record_game_session(text, numeric, numeric, numeric, int, int, int, text, text, jsonb) from public;
revoke all on function public.app_record_reading_assessment(text, text, numeric, numeric, int, int, text, int, jsonb) from public;

grant execute on function public.app_record_game_session(text, numeric, numeric, numeric, int, int, int, text, text, jsonb) to authenticated;
grant execute on function public.app_record_reading_assessment(text, text, numeric, numeric, int, int, text, int, jsonb) to authenticated;
