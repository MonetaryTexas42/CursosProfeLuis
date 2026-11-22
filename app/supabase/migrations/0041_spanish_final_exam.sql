-- 0041 · Examen final de Español listo para activar y contestado en plataforma
--
-- El alumno puede estudiar con la guía (frontend/public/guia-examen-espanol.html)
-- desde el primer día. El examen NO se puede iniciar hasta que un administrador
-- cambie `final_exam_spanish_enabled` a true en Configuración (o se autorice
-- expresamente el cambio en la base). Así se cumple "se activa cuando yo diga":
-- el código y el banco de reactivos quedan listos, pero cerrados.
--
-- Criterios de aceptación:
--   - 13 secciones (una por unidad de Español), en orden aleatorio por sesión.
--   - Todas las preguntas `quiz` de las 13 unidades entran al banco (136 hoy).
--     `final_exam_spanish_questions_per_section = 0` significa "todas"; un
--     número mayor que 0 limita cada sección sin quitar temas.
--   - Cada respuesta guarda índice elegido, milisegundos invertidos y momento.
--   - El puntaje y la corrección se calculan en servidor, nunca en el cliente.
--   - Las respuestas correctas NO se pueden leer con SELECT: viven en
--     `final_exam_key`, sin grants, y solo se revelan al terminar.
--   - El alumno ve solo su sesión; profesor de ese alumno y admin también.
--
-- Rollback:
--   drop function if exists public.app_finish_final_exam(uuid);
--   drop function if exists public.app_answer_final_exam(uuid, bigint, int, int);
--   drop function if exists public.app_start_final_exam();
--   drop function if exists public.app_final_exam_status();
--   drop table if exists public.final_exam_answers;
--   drop table if exists public.final_exam_key;
--   drop table if exists public.final_exam_questions;
--   drop table if exists public.final_exam_sessions;
--   delete from public.settings where key in
--     ('final_exam_spanish_enabled','final_exam_spanish_questions_per_section');

insert into public.settings (key, value)
values
  ('final_exam_spanish_enabled', 'false'::jsonb),
  ('final_exam_spanish_questions_per_section', '0'::jsonb)
on conflict (key) do nothing;

-- ---------------------------------------------------------------------------
-- Sesiones, reactivos y respuestas
-- ---------------------------------------------------------------------------

create table if not exists public.final_exam_sessions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  subject_id text not null default 'espanol' references public.subjects(id),
  status text not null default 'in_progress' check (status in ('in_progress', 'completed')),
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  total_questions int not null default 0 check (total_questions >= 0),
  answered_questions int not null default 0 check (answered_questions >= 0),
  correct_answers int not null default 0 check (correct_answers >= 0),
  score numeric(6,2),
  duration_ms bigint,
  sections jsonb not null default '[]'::jsonb,
  check (finished_at is null or finished_at >= started_at),
  check (score is null or (score >= 0 and score <= 100))
);

create index if not exists final_exam_sessions_student_idx
  on public.final_exam_sessions (student_id, started_at desc);

create table if not exists public.final_exam_questions (
  id bigserial primary key,
  session_id uuid not null references public.final_exam_sessions(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  section_key text not null,
  section_title text not null,
  section_num int not null,
  position int not null,
  question_key text not null,
  prompt text not null,
  options jsonb not null,
  unique (session_id, question_key)
);

create index if not exists final_exam_questions_session_idx
  on public.final_exam_questions (session_id, section_num, position);

-- Respuestas correctas: sin grants. Solo las RPC SECURITY DEFINER pueden
-- consultarlas; el alumno nunca las recibe antes de terminar.
create table if not exists public.final_exam_key (
  question_id bigint primary key
    references public.final_exam_questions(id) on delete cascade,
  correct_index int not null check (correct_index >= 0),
  explanation text
);

create table if not exists public.final_exam_answers (
  question_id bigint primary key
    references public.final_exam_questions(id) on delete cascade,
  session_id uuid not null references public.final_exam_sessions(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  selected_index int,
  duration_ms int not null default 0 check (duration_ms >= 0),
  answered_at timestamptz,
  check (selected_index is null or selected_index >= 0)
);

create index if not exists final_exam_answers_session_idx
  on public.final_exam_answers (session_id);

-- ---------------------------------------------------------------------------
-- RLS y permisos
-- ---------------------------------------------------------------------------

alter table public.final_exam_sessions enable row level security;
alter table public.final_exam_questions enable row level security;
alter table public.final_exam_answers enable row level security;
alter table public.final_exam_key enable row level security;

drop policy if exists final_exam_sessions_select on public.final_exam_sessions;
create policy final_exam_sessions_select
on public.final_exam_sessions for select to authenticated
using (
  student_id = public.app_student_id()
  or public.app_is_admin()
  or public.app_is_teacher_of_student(student_id)
);

drop policy if exists final_exam_questions_select on public.final_exam_questions;
create policy final_exam_questions_select
on public.final_exam_questions for select to authenticated
using (
  student_id = public.app_student_id()
  or public.app_is_admin()
  or public.app_is_teacher_of_student(student_id)
);

drop policy if exists final_exam_answers_select on public.final_exam_answers;
create policy final_exam_answers_select
on public.final_exam_answers for select to authenticated
using (
  student_id = public.app_student_id()
  or public.app_is_admin()
  or public.app_is_teacher_of_student(student_id)
);

revoke all on public.final_exam_sessions, public.final_exam_questions,
  public.final_exam_answers, public.final_exam_key from public, anon;
revoke all on public.final_exam_key from authenticated;
grant select on public.final_exam_sessions, public.final_exam_questions,
  public.final_exam_answers to authenticated;

comment on table public.final_exam_sessions is
  'Sesiones del examen final de Español: estado, puntaje, tiempos y secciones.';
comment on table public.final_exam_key is
  'Respuestas correctas del examen final. Sin grants: solo RPCs de servidor.';

-- ---------------------------------------------------------------------------
-- Estado y activación
-- ---------------------------------------------------------------------------

create or replace function public.app_final_exam_status()
returns jsonb
language sql
stable
security definer
set search_path = public, pg_temp
set row_security = off
as $$
  select jsonb_build_object(
    'subject', 'espanol',
    'enabled', coalesce(
      (select value from public.settings where key = 'final_exam_spanish_enabled'),
      'false'::jsonb
    ),
    'questionsPerSection', coalesce(
      (select (value #>> '{}')::int from public.settings
        where key = 'final_exam_spanish_questions_per_section'),
      0
    ),
    'sections', (select count(*)::int from public.units
                  where subject_id = 'espanol' and status = 'published'),
    'questions', (select count(*)::int
                    from public.units u
                   cross join lateral (
                     select uv.content
                       from public.unit_versions uv
                      where uv.unit_id = u.id and uv.published_at is not null
                      order by uv.version desc
                      limit 1
                   ) v
                   cross join lateral jsonb_array_elements(
                     coalesce(v.content->'quiz', '[]'::jsonb)
                   ) q
                   where u.subject_id = 'espanol' and u.status = 'published')
  );
$$;

revoke all on function public.app_final_exam_status() from public;
grant execute on function public.app_final_exam_status() to authenticated;

comment on function public.app_final_exam_status() is
  'Expone si el examen final ya fue activado y cuántas secciones/preguntas tiene.';

-- ---------------------------------------------------------------------------
-- Iniciar: construye el examen con secciones y preguntas desordenadas
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
  v_enabled boolean;
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

  select s.id into v_student_id
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

  -- Cada unidad publicada de Español es una sección. md5(key || seed) fija un
  -- orden aleatorio distinto por alumno e intento, sin depender del orden
  -- cronológico en que se vieron las unidades.
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
  'Crea una sesión del examen final con 13 secciones y preguntas desordenadas; no revela respuestas.';

-- ---------------------------------------------------------------------------
-- Responder: guarda índice y tiempo por pregunta, sin decir si acertó
-- ---------------------------------------------------------------------------

create or replace function public.app_answer_final_exam(
  p_session_id uuid,
  p_question_id bigint,
  p_selected_index int,
  p_duration_ms int default 0
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
set row_security = off
as $$
declare
  v_student_id uuid;
  v_options int;
  v_active int;
begin
  if auth.uid() is null then
    raise exception 'No autenticado' using errcode = '42501';
  end if;

  select s.id into v_student_id
    from public.students s
   where s.profile_id = auth.uid()
     and s.status = 'active'::public.student_status
   limit 1;

  if v_student_id is null then
    raise exception 'La cuenta no está vinculada a un alumno activo' using errcode = '42501';
  end if;

  select 1 into v_active
    from public.final_exam_sessions s
   where s.id = p_session_id
     and s.student_id = v_student_id
     and s.status = 'in_progress';

  if v_active is null then
    raise exception 'La sesión del examen no está abierta para este alumno' using errcode = '42501';
  end if;

  select jsonb_array_length(q.options) into v_options
    from public.final_exam_questions q
   where q.id = p_question_id
     and q.session_id = p_session_id;

  if v_options is null then
    raise exception 'La pregunta no pertenece a esta sesión' using errcode = '22023';
  end if;

  if p_selected_index is not null
     and (p_selected_index < 0 or p_selected_index >= v_options) then
    raise exception 'La respuesta elegida no es válida' using errcode = '22023';
  end if;

  if p_duration_ms is null or p_duration_ms < 0 then
    raise exception 'El tiempo registrado no es válido' using errcode = '22023';
  end if;

  update public.final_exam_answers a
     set selected_index = p_selected_index,
         duration_ms = least(p_duration_ms, 3600000),
         answered_at = now()
   where a.question_id = p_question_id
     and a.session_id = p_session_id
     and a.student_id = v_student_id;

  if not found then
    raise exception 'No se pudo registrar la respuesta' using errcode = '42501';
  end if;

  update public.final_exam_sessions s
     set answered_questions = (
       select count(*)::int from public.final_exam_answers a
        where a.session_id = s.id and a.selected_index is not null
     )
   where s.id = p_session_id;

  return jsonb_build_object('ok', true, 'questionId', p_question_id);
end;
$$;

revoke all on function public.app_answer_final_exam(uuid, bigint, int, int) from public;
grant execute on function public.app_answer_final_exam(uuid, bigint, int, int) to authenticated;

comment on function public.app_answer_final_exam(uuid, bigint, int, int) is
  'Registra selección y tiempo por pregunta del examen final sin revelar la corrección.';

-- ---------------------------------------------------------------------------
-- Terminar: califica en servidor y devuelve el desglose por sección
-- ---------------------------------------------------------------------------

create or replace function public.app_finish_final_exam(p_session_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
set row_security = off
as $$
declare
  v_student_id uuid;
  v_total int := 0;
  v_answered int := 0;
  v_correct int := 0;
  v_score numeric(6,2) := 0;
  v_duration bigint := 0;
  v_sections jsonb;
  v_details jsonb;
begin
  if auth.uid() is null then
    raise exception 'No autenticado' using errcode = '42501';
  end if;

  select s.id into v_student_id
    from public.students s
   where s.profile_id = auth.uid()
     and s.status = 'active'::public.student_status
   limit 1;

  if v_student_id is null then
    raise exception 'La cuenta no está vinculada a un alumno activo' using errcode = '42501';
  end if;

  if not exists (
    select 1 from public.final_exam_sessions s
     where s.id = p_session_id
       and s.student_id = v_student_id
       and s.status = 'in_progress'
  ) then
    raise exception 'La sesión del examen no está abierta para este alumno' using errcode = '42501';
  end if;

  select count(*)::int,
         count(a.selected_index)::int,
         (count(*) filter (where k.correct_index = a.selected_index))::int
    into v_total, v_answered, v_correct
    from public.final_exam_questions q
    join public.final_exam_key k on k.question_id = q.id
    left join public.final_exam_answers a on a.question_id = q.id
   where q.session_id = p_session_id;

  if v_total = 0 then
    raise exception 'La sesión no tiene preguntas' using errcode = '22023';
  end if;

  v_score := round(v_correct::numeric * 100 / v_total, 2);

  select coalesce(sum(a.duration_ms), 0)::bigint into v_duration
    from public.final_exam_answers a
   where a.session_id = p_session_id;

  select jsonb_agg(jsonb_build_object(
           'key', x.section_key,
           'title', x.section_title,
           'num', x.section_num,
           'correct', x.correct,
           'total', x.total,
           'answered', x.answered,
           'timeMs', x.time_ms
         ) order by x.section_num)
    into v_sections
    from (
      select q.section_key,
             min(q.section_title) as section_title,
             min(q.section_num) as section_num,
             (count(*) filter (where k.correct_index = a.selected_index))::int as correct,
             count(*)::int as total,
             count(a.selected_index)::int as answered,
             coalesce(sum(a.duration_ms), 0)::bigint as time_ms
        from public.final_exam_questions q
        join public.final_exam_key k on k.question_id = q.id
        left join public.final_exam_answers a on a.question_id = q.id
       where q.session_id = p_session_id
       group by q.section_key
    ) x;

  select jsonb_agg(jsonb_build_object(
           'id', q.id,
           'sectionKey', q.section_key,
           'prompt', q.prompt,
           'selectedIndex', a.selected_index,
           'correctIndex', k.correct_index,
           'isCorrect', (k.correct_index = a.selected_index),
           'durationMs', coalesce(a.duration_ms, 0),
           'explanation', k.explanation
         ) order by q.section_num, q.position)
    into v_details
    from public.final_exam_questions q
    join public.final_exam_key k on k.question_id = q.id
    left join public.final_exam_answers a on a.question_id = q.id
   where q.session_id = p_session_id;

  update public.final_exam_sessions s
     set status = 'completed',
         finished_at = now(),
         answered_questions = v_answered,
         correct_answers = v_correct,
         score = v_score,
         duration_ms = v_duration,
         sections = coalesce(v_sections, '[]'::jsonb)
   where s.id = p_session_id;

  return jsonb_build_object(
    'sessionId', p_session_id,
    'score', v_score,
    'correct', v_correct,
    'total', v_total,
    'answered', v_answered,
    'durationMs', v_duration,
    'sections', coalesce(v_sections, '[]'::jsonb),
    'answers', coalesce(v_details, '[]'::jsonb)
  );
end;
$$;

revoke all on function public.app_finish_final_exam(uuid) from public;
grant execute on function public.app_finish_final_exam(uuid) to authenticated;

comment on function public.app_finish_final_exam(uuid) is
  'Califica el examen final, revela corrección y guarda tiempos por pregunta y sección.';
