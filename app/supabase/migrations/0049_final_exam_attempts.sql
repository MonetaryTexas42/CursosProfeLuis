-- 0049 · Límite de intentos del examen final de Español y mejor resultado
--
-- El alumno puede tener un tope global de intentos y cada grupo uno propio.
-- `0` significa ilimitado. Cuando ambos números son mayores que cero se usa
-- el menor de los dos, así el global actúa como techo y el grupo puede ser
-- más estricto pero nunca más permisivo.
--
-- Criterios de aceptación:
--   - `final_exam_spanish_max_attempts` es el setting global (0 = ilimitado).
--   - `group_exam_config.max_attempts` guarda el límite por grupo.
--   - `app_set_group_exam_attempts(uuid, int)` permite al staff del grupo
--     cambiar ese límite sin alterar el interruptor `exam_enabled`.
--   - `app_start_final_exam()` bloquea al llegar al tope. Solo cuentan las
--     sesiones `completed`; una sesión `in_progress` no agota intentos.
--   - `app_effective_final_exam_status()` expone maxAttempts, attemptsUsed,
--     attemptsRemaining y el mejor resultado (score/aciertos/fecha).
--
-- Rollback:
--   drop function if exists public.app_effective_final_exam_status();
--   drop function if exists public.app_start_final_exam();
--   -- restaurar 0044 para ambas funciones
--   drop function if exists public.app_set_group_exam_attempts(uuid, integer);
--   drop function if exists public.app_effective_exam_attempts(uuid);
--   alter table public.group_exam_config drop column if exists max_attempts;
--   delete from public.settings where key = 'final_exam_spanish_max_attempts';

-- ---------------------------------------------------------------------------
-- Configuración
-- ---------------------------------------------------------------------------

insert into public.settings (key, value)
values ('final_exam_spanish_max_attempts', '0'::jsonb)
on conflict (key) do nothing;

alter table public.group_exam_config
  add column if not exists max_attempts integer not null default 0;

do $$
begin
  if not exists (
    select 1
      from pg_constraint
     where conname = 'group_exam_config_max_attempts_check'
       and conrelid = 'public.group_exam_config'::regclass
  ) then
    alter table public.group_exam_config
      add constraint group_exam_config_max_attempts_check
      check (max_attempts >= 0);
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- Límite efectivo: global como techo, grupo como excepción más estricta
-- ---------------------------------------------------------------------------

create or replace function public.app_effective_exam_attempts(p_group_id uuid)
returns integer
language sql
stable
security definer
set search_path = public, pg_temp
set row_security = off
as $$
  with cfg as (
    select
      greatest(
        coalesce((select (value #>> '{}')::integer from public.settings
                   where key = 'final_exam_spanish_max_attempts'), 0),
        0
      ) as global_max,
      greatest(
        coalesce((select c.max_attempts from public.group_exam_config c
                   where c.group_id = p_group_id), 0),
        0
      ) as group_max
  )
  select case
           when global_max = 0 then group_max
           when group_max = 0 then global_max
           else least(global_max, group_max)
         end
    from cfg;
$$;

revoke all on function public.app_effective_exam_attempts(uuid) from public;
grant execute on function public.app_effective_exam_attempts(uuid) to authenticated;

comment on function public.app_effective_exam_attempts(uuid) is
  'Intentos efectivos del examen: global y por grupo; 0 = ilimitado.';

-- ---------------------------------------------------------------------------
-- Estado efectivo con intentos y mejor resultado
-- ---------------------------------------------------------------------------

create or replace function public.app_effective_final_exam_status()
returns jsonb
language sql
stable
security definer
set search_path = public, pg_temp
set row_security = off
as $$
  with base as (
    select public.app_final_exam_status() as status
  ),
  ctx as (
    select
      b.status,
      case
        when public.app_is_staff() then null
        else public.app_student_id()
      end as student_id
    from base b
  ),
  scope as (
    select
      ctx.*,
      (select s.group_id from public.students s where s.id = ctx.student_id) as group_id
    from ctx
  ),
  counters as (
    select
      scope.*,
      public.app_effective_exam_attempts(scope.group_id) as max_attempts,
      (
        select count(*)::integer
          from public.final_exam_sessions f
         where f.student_id = scope.student_id
           and f.subject_id = 'espanol'
           and f.status = 'completed'
      ) as attempts_used
    from scope
  ),
  best as (
    select f.score, f.correct_answers, f.total_questions, f.finished_at
      from public.final_exam_sessions f
      join counters c on c.student_id = f.student_id
     where f.status = 'completed'
       and f.subject_id = 'espanol'
       and f.score is not null
     order by f.score desc, f.finished_at asc
     limit 1
  )
  select jsonb_build_object(
    'subject', 'espanol',
    'enabled', coalesce((c.status->>'enabled')::boolean, false)
      and (
        c.student_id is null
        or public.app_group_exam_enabled(c.group_id)
      ),
    'globalEnabled', coalesce((c.status->>'enabled')::boolean, false),
    'groupEnabled', case
      when c.student_id is null then null
      else public.app_group_exam_enabled(c.group_id)
    end,
    'questionsPerSection', coalesce((c.status->>'questionsPerSection')::integer, 0),
    'sections', coalesce((c.status->>'sections')::integer, 0),
    'questions', coalesce((c.status->>'questions')::integer, 0),
    'maxAttempts', case when c.student_id is null then null else c.max_attempts end,
    'attemptsUsed', case when c.student_id is null then null else c.attempts_used end,
    'attemptsRemaining', case
      when c.student_id is null or c.max_attempts <= 0 then null
      else greatest(c.max_attempts - c.attempts_used, 0)
    end,
    'bestScore', b.score,
    'bestCorrect', b.correct_answers,
    'bestTotal', b.total_questions,
    'bestFinishedAt', b.finished_at
  )
  from counters c
  left join best b on true;
$$;

revoke all on function public.app_effective_final_exam_status() from public;
grant execute on function public.app_effective_final_exam_status() to authenticated;

comment on function public.app_effective_final_exam_status() is
  'Estado efectivo del examen: flags global y de grupo, intentos y mejor resultado.';

-- ---------------------------------------------------------------------------
-- Escritura segura del límite por grupo
-- ---------------------------------------------------------------------------

create or replace function public.app_set_group_exam_attempts(
  p_group_id uuid,
  p_max_attempts integer
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
set row_security = off
as $$
begin
  if auth.uid() is null then
    raise exception 'No autenticado' using errcode = '42501';
  end if;

  if not public.app_is_admin() and not public.app_is_teacher_of_group(p_group_id) then
    raise exception 'No tienes permiso para configurar este grupo' using errcode = '42501';
  end if;

  if p_max_attempts is null or p_max_attempts < 0 then
    raise exception 'Los intentos deben ser 0 (ilimitado) o un número positivo'
      using errcode = '22023';
  end if;

  insert into public.group_exam_config (group_id, exam_enabled, max_attempts, updated_by)
  values (p_group_id, false, p_max_attempts, auth.uid())
  on conflict (group_id) do update
    set max_attempts = excluded.max_attempts,
        updated_at = now(),
        updated_by = excluded.updated_by;

  return jsonb_build_object(
    'groupId', p_group_id,
    'maxAttempts', p_max_attempts
  );
end;
$$;

revoke all on function public.app_set_group_exam_attempts(uuid, integer) from public;
grant execute on function public.app_set_group_exam_attempts(uuid, integer) to authenticated;

comment on function public.app_set_group_exam_attempts(uuid, integer) is
  'Define los intentos del examen por grupo sin cambiar su activación; solo staff del grupo.';

-- ---------------------------------------------------------------------------
-- Inicio del examen con validación de intentos
-- ---------------------------------------------------------------------------

create or replace function public.app_start_final_exam()
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
set row_security = off
as $$
declare
  v_student_id uuid;
  v_group_id uuid;
  v_enabled boolean;
  v_group_enabled boolean;
  v_max_attempts integer;
  v_attempts_used integer;
  v_limit integer;
  v_seed text;
  v_session_id uuid;
  v_total integer := 0;
  v_section_no integer := 0;
  v_unit record;
  v_section_key text;
  v_q record;
  v_question_id bigint;
  v_questions jsonb;
  v_sections jsonb := '[]'::jsonb;
begin
  if auth.uid() is null then
    raise exception 'No autenticado' using errcode = '42501';
  end if;

  select s.id, s.group_id into v_student_id, v_group_id
    from public.students s
   where s.profile_id = auth.uid()
     and s.status = 'active'::public.student_status
   limit 1;

  if v_student_id is null then
    raise exception 'La cuenta no está vinculada a un alumno activo' using errcode = '42501';
  end if;

  v_enabled := coalesce(
    (select (value #>> '{}')::boolean from public.settings
      where key = 'final_exam_spanish_enabled'),
    false
  );

  if not v_enabled then
    raise exception 'El examen final de Español aún no está activo' using errcode = '42501';
  end if;

  v_group_enabled := public.app_group_exam_enabled(v_group_id);

  if not v_group_enabled then
    raise exception 'El examen final no está activo para tu grupo' using errcode = '42501';
  end if;

  v_max_attempts := public.app_effective_exam_attempts(v_group_id);

  if v_max_attempts > 0 then
    select count(*)::integer into v_attempts_used
      from public.final_exam_sessions f
     where f.student_id = v_student_id
       and f.subject_id = 'espanol'
       and f.status = 'completed';

    if v_attempts_used >= v_max_attempts then
      raise exception 'Ya completaste tus % intentos del examen final de Español', v_max_attempts
        using errcode = '42501';
    end if;
  end if;

  v_limit := coalesce(
    (select (value #>> '{}')::integer from public.settings
      where key = 'final_exam_spanish_questions_per_section'),
    0
  );
  if v_limit is null or v_limit < 0 then
    v_limit := 0;
  end if;

  v_seed := md5(v_student_id::text || clock_timestamp()::text || random()::text);

  insert into public.final_exam_sessions (student_id, subject_id, sections)
  values (v_student_id, 'espanol', '[]'::jsonb)
  returning id into v_session_id;

  for v_unit in
    select u.id as unit_id, u.num, u.title, v.content
      from public.units u
      cross join lateral (
        select uv.content
          from public.unit_versions uv
         where uv.unit_id = u.id and uv.published_at is not null
         order by uv.version desc
         limit 1
      ) v
     where u.subject_id = 'espanol' and u.status = 'published'
     order by md5(u.id::text || v_seed)
  loop
    v_section_no := v_section_no + 1;
    v_section_key := coalesce(v_unit.content->'unit'->>'key', v_unit.unit_id::text);

    v_sections := v_sections || jsonb_build_object(
      'key', v_section_key,
      'title', v_unit.title,
      'num', v_unit.num,
      'order', v_section_no
    );

    for v_q in
      select q.value as q,
             row_number() over (order by md5(q.value->>'key' || v_seed)) as rn
        from jsonb_array_elements(coalesce(v_unit.content->'quiz', '[]'::jsonb)) q
    loop
      exit when v_limit > 0 and v_q.rn > v_limit;

      insert into public.final_exam_questions (
        session_id, student_id, section_key, section_title,
        section_num, position, question_key, prompt, options
      )
      values (
        v_session_id, v_student_id, v_section_key, v_unit.title,
        v_section_no, v_q.rn, v_q.q->>'key', v_q.q->>'prompt',
        coalesce(v_q.q->'options', '[]'::jsonb)
      )
      returning id into v_question_id;

      insert into public.final_exam_key (question_id, correct_index, explanation)
      values (
        v_question_id,
        coalesce((v_q.q->>'correctIndex')::integer, 0),
        v_q.q->>'explanation'
      );

      insert into public.final_exam_answers (question_id, session_id, student_id)
      values (v_question_id, v_session_id, v_student_id);

      v_total := v_total + 1;
    end loop;
  end loop;

  update public.final_exam_sessions
     set total_questions = v_total,
         sections = v_sections
   where id = v_session_id;

  select jsonb_agg(jsonb_build_object(
           'id', q.id,
           'sectionKey', q.section_key,
           'sectionTitle', q.section_title,
           'position', q.position,
           'questionKey', q.question_key,
           'prompt', q.prompt,
           'options', q.options
         ) order by q.section_num, q.position)
    into v_questions
    from public.final_exam_questions q
   where q.session_id = v_session_id;

  return jsonb_build_object(
    'sessionId', v_session_id,
    'sections', v_sections,
    'questions', coalesce(v_questions, '[]'::jsonb),
    'totalQuestions', v_total
  );
end;
$$;

revoke all on function public.app_start_final_exam() from public;
grant execute on function public.app_start_final_exam() to authenticated;

comment on function public.app_start_final_exam() is
  'Crea una sesión del examen respetando flags global/grupo y el límite de intentos.';
