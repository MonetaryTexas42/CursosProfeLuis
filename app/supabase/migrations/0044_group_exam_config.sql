-- 0044 · Grupos configurables y examen final por grupo
--
-- El profesorado puede crear grupos, editar su horario estructurado (días y
-- horas) y decidir por grupo si el examen final de Español está activo. El
-- acceso global `final_exam_spanish_enabled` sigue siendo el interruptor
-- maestro: si está apagado, ningún grupo puede iniciar examen.
--
-- Criterios de aceptación:
--   - `group_exam_config` guarda la activación del examen por grupo.
--   - `groups.schedule_days`, `schedule_start` y `schedule_end` guardan el
--     horario (días 0=domingo…6=sábado, horas HH24:MI).
--   - `groups.schedule` se mantiene como texto derivado para compatibilidad.
--   - `app_group_exam_enabled(group_id)` y `app_effective_final_exam_status()`
--     exponen el estado efectivo sin revelar claves.
--   - `app_upsert_group_exam_config(...)` y `app_set_group_schedule(...)` son
--     SECURITY DEFINER y solo permiten admin o profesor del grupo.
--   - `app_start_final_exam()` respeta el flag global y el del grupo.
--
-- Rollback:
--   drop function if exists public.app_start_final_exam();
--   -- restaurar 0041 para la función anterior
--   drop function if exists public.app_effective_final_exam_status();
--   drop function if exists public.app_group_exam_enabled(uuid);
--   drop function if exists public.app_set_group_schedule(uuid, int[], time, time);
--   drop function if exists public.app_upsert_group_exam_config(uuid, boolean);
--   drop table if exists public.group_exam_config;
--   alter table public.groups drop column if exists schedule_end;
--   alter table public.groups drop column if exists schedule_start;
--   alter table public.groups drop column if exists schedule_days;

alter table public.groups
  add column if not exists schedule_days int[],
  add column if not exists schedule_start time,
  add column if not exists schedule_end time;

do $$
begin
  if not exists (
    select 1 from pg_constraint
     where conname = 'groups_schedule_days_check' and conrelid = 'public.groups'::regclass
  ) then
    alter table public.groups
      add constraint groups_schedule_days_check
      check (schedule_days is null or (
        array_length(schedule_days, 1) is null
        or (
          schedule_days <@ array[0,1,2,3,4,5,6]
          and array_length(schedule_days, 1) <= 7
        )
      ));
  end if;

  if not exists (
    select 1 from pg_constraint
     where conname = 'groups_schedule_window_check' and conrelid = 'public.groups'::regclass
  ) then
    alter table public.groups
      add constraint groups_schedule_window_check
      check (
        schedule_start is null
        or schedule_end is null
        or schedule_end > schedule_start
      );
  end if;
end $$;

create table if not exists public.group_exam_config (
  group_id uuid primary key references public.groups(id) on delete cascade,
  exam_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id)
);

alter table public.group_exam_config enable row level security;

drop policy if exists group_exam_config_select on public.group_exam_config;
create policy group_exam_config_select
on public.group_exam_config for select to authenticated
using (public.app_can_access_group(group_id));

revoke all on public.group_exam_config from public, anon;
grant select on public.group_exam_config to authenticated;

comment on table public.group_exam_config is
  'Activación del examen final de Español por grupo. Solo lectura vía RLS; escrituras por RPC.';

-- Conserva el comportamiento previo: los grupos ya activos mantienen el examen
-- habilitado. Los grupos nuevos quedan apagados hasta que el staff los configure.
insert into public.group_exam_config (group_id, exam_enabled)
select g.id, true
  from public.groups g
 where g.active
on conflict (group_id) do nothing;

-- ---------------------------------------------------------------------------
-- Lectura del estado efectivo
-- ---------------------------------------------------------------------------

create or replace function public.app_group_exam_enabled(p_group_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
set row_security = off
as $$
  select coalesce(
    (
      select c.exam_enabled
        from public.group_exam_config c
       where c.group_id = p_group_id
    ),
    false
  );
$$;

revoke all on function public.app_group_exam_enabled(uuid) from public;
grant execute on function public.app_group_exam_enabled(uuid) to authenticated;

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
  )
  select jsonb_build_object(
    'subject', 'espanol',
    'enabled', coalesce((ctx.status->>'enabled')::boolean, false)
      and (
        ctx.student_id is null
        or public.app_group_exam_enabled((
          select s.group_id from public.students s where s.id = ctx.student_id
        ))
      ),
    'globalEnabled', coalesce((ctx.status->>'enabled')::boolean, false),
    'groupEnabled', case
      when ctx.student_id is null then null
      else public.app_group_exam_enabled((
        select s.group_id from public.students s where s.id = ctx.student_id
      ))
    end,
    'questionsPerSection', coalesce((ctx.status->>'questionsPerSection')::int, 0),
    'sections', coalesce((ctx.status->>'sections')::int, 0),
    'questions', coalesce((ctx.status->>'questions')::int, 0)
  )
  from ctx;
$$;

revoke all on function public.app_effective_final_exam_status() from public;
grant execute on function public.app_effective_final_exam_status() to authenticated;

comment on function public.app_effective_final_exam_status() is
  'Estado efectivo del examen final para el alumno: flag global + activación por grupo.';

-- ---------------------------------------------------------------------------
-- Escritura segura de configuración del grupo
-- ---------------------------------------------------------------------------

create or replace function public.app_upsert_group_exam_config(
  p_group_id uuid,
  p_exam_enabled boolean
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

  insert into public.group_exam_config (group_id, exam_enabled, updated_by)
  values (p_group_id, coalesce(p_exam_enabled, false), auth.uid())
  on conflict (group_id) do update
    set exam_enabled = excluded.exam_enabled,
        updated_at = now(),
        updated_by = excluded.updated_by;

  return jsonb_build_object(
    'groupId', p_group_id,
    'examEnabled', coalesce(p_exam_enabled, false)
  );
end;
$$;

revoke all on function public.app_upsert_group_exam_config(uuid, boolean) from public;
grant execute on function public.app_upsert_group_exam_config(uuid, boolean) to authenticated;

comment on function public.app_upsert_group_exam_config(uuid, boolean) is
  'Activa o desactiva el examen final de Español para un grupo; solo staff del grupo.';

create or replace function public.app_set_group_schedule(
  p_group_id uuid,
  p_schedule_days int[],
  p_schedule_start time,
  p_schedule_end time
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
set row_security = off
as $$
declare
  v_days_label text;
  v_schedule text;
begin
  if auth.uid() is null then
    raise exception 'No autenticado' using errcode = '42501';
  end if;

  if not public.app_is_admin() and not public.app_is_teacher_of_group(p_group_id) then
    raise exception 'No tienes permiso para configurar este grupo' using errcode = '42501';
  end if;

  if p_schedule_days is not null
     and exists (select 1 from unnest(p_schedule_days) d where d < 0 or d > 6) then
    raise exception 'Los días deben estar entre 0 (domingo) y 6 (sábado)' using errcode = '22023';
  end if;

  if p_schedule_start is not null and p_schedule_end is not null
     and p_schedule_end <= p_schedule_start then
    raise exception 'La hora de fin debe ser posterior a la de inicio' using errcode = '22023';
  end if;

  v_days_label := case
    when p_schedule_days is null or array_length(p_schedule_days, 1) is null then ''
    else (
      select string_agg(
        (array['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'])[d + 1],
        ', ' order by d
      )
      from unnest(p_schedule_days) d
    )
  end;

  v_schedule := nullif(
    concat_ws(
      ' ',
      nullif(v_days_label, ''),
      case
        when p_schedule_start is null then ''
        else to_char(p_schedule_start, 'HH24:MI') || '–' || to_char(coalesce(p_schedule_end, p_schedule_start), 'HH24:MI')
      end
    ),
    ''
  );

  update public.groups g
     set schedule_days = p_schedule_days,
         schedule_start = p_schedule_start,
         schedule_end = p_schedule_end,
         schedule = v_schedule,
         updated_at = now()
   where g.id = p_group_id;

  if not found then
    raise exception 'Grupo no encontrado' using errcode = 'P0002';
  end if;

  return jsonb_build_object(
    'groupId', p_group_id,
    'scheduleDays', coalesce(p_schedule_days, '{}'::int[]),
    'scheduleStart', p_schedule_start,
    'scheduleEnd', p_schedule_end,
    'schedule', v_schedule
  );
end;
$$;

revoke all on function public.app_set_group_schedule(uuid, int[], time, time) from public;
grant execute on function public.app_set_group_schedule(uuid, int[], time, time) to authenticated;

comment on function public.app_set_group_schedule(uuid, int[], time, time) is
  'Guarda el horario estructurado del grupo y actualiza el texto derivado.';

-- ---------------------------------------------------------------------------
-- Inicio del examen con doble validación
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
  v_limit int;
  v_seed text;
  v_session_id uuid;
  v_total int := 0;
  v_section_no int := 0;
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

  v_limit := coalesce(
    (select (value #>> '{}')::int from public.settings
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
        coalesce((v_q.q->>'correctIndex')::int, 0),
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
  'Crea una sesión del examen final respetando el flag global y la activación por grupo.';
