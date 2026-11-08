-- 0015 · Tareas, entregas y registro de actividades
--
-- 1) Tabla de tareas por grupo/materia (con fecha de entrega y puntaje).
-- 2) Entregas por alumno (pendiente / entregada / tarde) con calificación.
-- 3) RPC app_staff_tasks(): tareas + entregas para el panel del staff.
-- 4) RPC app_activity_log(): línea de tiempo de la actividad del grupo.

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  subject_id text not null references public.subjects(id),
  unit_id uuid references public.units(id) on delete set null,
  title text not null,
  instructions text,
  task_type public.assessment_type not null default 'project',
  due_at timestamptz,
  max_score numeric(5,2) not null default 10,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  archived_at timestamptz,
  check (max_score > 0)
);

create table if not exists public.task_submissions (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  status public.task_completion_status not null default 'pending',
  score numeric(5,2),
  feedback text,
  submitted_at timestamptz,
  recorded_by uuid references public.profiles(id),
  updated_at timestamptz not null default now(),
  unique (task_id, student_id),
  check (score is null or score >= 0)
);

create index if not exists tasks_group_idx on public.tasks (group_id, due_at);
create index if not exists tasks_subject_idx on public.tasks (subject_id);
create index if not exists task_submissions_task_idx on public.task_submissions (task_id);
create index if not exists task_submissions_student_idx on public.task_submissions (student_id);

alter table public.tasks enable row level security;
alter table public.task_submissions enable row level security;

drop policy if exists tasks_select on public.tasks;
create policy tasks_select
on public.tasks for select to authenticated
using (
  public.app_is_admin()
  or public.app_is_teacher_of_group(group_id)
  or public.app_student_in_group(group_id)
  or public.app_guardian_has_student_in_group(group_id)
);

drop policy if exists tasks_staff_write on public.tasks;
create policy tasks_staff_write
on public.tasks for all to authenticated
using (public.app_is_admin() or public.app_is_teacher_of_group(group_id))
with check (public.app_is_admin() or public.app_is_teacher_of_group(group_id));

drop policy if exists task_submissions_select on public.task_submissions;
create policy task_submissions_select
on public.task_submissions for select to authenticated
using (public.app_can_access_student(student_id));

drop policy if exists task_submissions_staff_write on public.task_submissions;
create policy task_submissions_staff_write
on public.task_submissions for all to authenticated
using (public.app_is_admin() or public.app_is_teacher_of_student(student_id))
with check (public.app_is_admin() or public.app_is_teacher_of_student(student_id));

create or replace function public.app_staff_tasks()
returns jsonb
language plpgsql
stable
security definer
set search_path = public, pg_temp
set row_security = off
as $$
declare
  v_role public.user_role := public.app_current_role();
  v_uid uuid := auth.uid();
  v_result jsonb;
begin
  if v_role is null or v_role not in ('admin'::public.user_role, 'teacher'::public.user_role) then
    raise exception 'Solo personal de la institución' using errcode = '42501';
  end if;

  select jsonb_build_object(
    'tasks', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', t.id,
          'title', t.title,
          'instructions', t.instructions,
          'type', t.task_type,
          'due_at', t.due_at,
          'max_score', t.max_score,
          'created_at', t.created_at,
          'group_id', t.group_id,
          'group_name', g.name,
          'subject_id', t.subject_id,
          'subject_name', s.name,
          'subject_color', s.color,
          'unit_id', t.unit_id,
          'unit_title', u.title,
          'submissions', coalesce((
            select jsonb_agg(
              jsonb_build_object(
                'student_id', st.id,
                'code', st.student_code,
                'name', p.full_name,
                'status', coalesce(ts.status, 'pending'),
                'score', ts.score,
                'feedback', ts.feedback,
                'submitted_at', ts.submitted_at,
                'updated_at', ts.updated_at
              ) order by p.full_name
            )
            from public.students st
            join public.profiles p on p.id = st.profile_id
            left join public.task_submissions ts
              on ts.task_id = t.id and ts.student_id = st.id
            where st.group_id = t.group_id
              and st.status = 'active'::public.student_status
          ), '[]'::jsonb)
        ) order by
          case when t.due_at is null then 1 else 0 end,
          t.due_at nulls last,
          t.created_at desc
      )
      from public.tasks t
      join public.groups g on g.id = t.group_id
      join public.subjects s on s.id = t.subject_id
      left join public.units u on u.id = t.unit_id
      where t.archived_at is null
        and (v_role = 'admin'::public.user_role or g.teacher_id = v_uid)
    ), '[]'::jsonb)
  ) into v_result;

  return v_result;
end;
$$;

create or replace function public.app_activity_log(p_limit int default 50)
returns jsonb
language plpgsql
stable
security definer
set search_path = public, pg_temp
set row_security = off
as $$
declare
  v_role public.user_role := public.app_current_role();
  v_uid uuid := auth.uid();
  v_limit int := greatest(1, least(coalesce(p_limit, 50), 200));
  v_result jsonb;
begin
  if v_role is null or v_role not in ('admin'::public.user_role, 'teacher'::public.user_role) then
    raise exception 'Solo personal de la institución' using errcode = '42501';
  end if;

  select coalesce(jsonb_agg(entry order by (entry->>'ts')::timestamptz desc), '[]'::jsonb)
  into v_result
  from (
    select entry
    from (
    select jsonb_build_object(
      'ts', a.created_at,
      'kind', 'ejercicio',
      'emoji', case when a.is_correct then '✅' else '❌' end,
      'title', case when a.is_correct then 'Ejercicio correcto' else 'Ejercicio incorrecto' end,
      'detail', coalesce(un.title, 'Unidad'),
      'student', s.student_code,
      'name', p.full_name
    ) as entry
    from public.exercise_attempts a
    join public.students s on s.id = a.student_id
    join public.profiles p on p.id = s.profile_id
    left join public.units un on un.id = a.unit_id
    where v_role = 'admin'::public.user_role
       or exists (select 1 from public.groups g where g.id = s.group_id and g.teacher_id = v_uid)

    union all

    select jsonb_build_object(
      'ts', pr.completed_at,
      'kind', 'unidad',
      'emoji', '🎓',
      'title', 'Unidad completada',
      'detail', coalesce(un.title, 'Unidad'),
      'student', s.student_code,
      'name', p.full_name
    )
    from public.unit_progress pr
    join public.students s on s.id = pr.student_id
    join public.profiles p on p.id = s.profile_id
    left join public.units un on un.id = pr.unit_id
    where pr.status in ('completed'::public.progress_status, 'mastered'::public.progress_status)
      and pr.completed_at is not null
      and (v_role = 'admin'::public.user_role
           or exists (select 1 from public.groups g where g.id = s.group_id and g.teacher_id = v_uid))

    union all

    select jsonb_build_object(
      'ts', ts.updated_at,
      'kind', 'tarea',
      'emoji', case
        when ts.status = 'submitted'::public.task_completion_status then '📤'
        when ts.status = 'late'::public.task_completion_status then '⏰'
        else '📝'
      end,
      'title', case
        when ts.status = 'submitted'::public.task_completion_status then 'Entrega registrada'
        when ts.status = 'late'::public.task_completion_status then 'Entrega tardía'
        else 'Tarea actualizada'
      end,
      'detail', t.title,
      'student', s.student_code,
      'name', p.full_name
    )
    from public.task_submissions ts
    join public.tasks t on t.id = ts.task_id
    join public.students s on s.id = ts.student_id
    join public.profiles p on p.id = s.profile_id
    where v_role = 'admin'::public.user_role
       or exists (select 1 from public.groups g where g.id = s.group_id and g.teacher_id = v_uid)

    union all

    select jsonb_build_object(
      'ts', gr.recorded_at,
      'kind', 'calificacion',
      'emoji', '🏅',
      'title', 'Calificación registrada',
      'detail', asm.name,
      'student', s.student_code,
      'name', p.full_name
    )
    from public.grades gr
    join public.assessments asm on asm.id = gr.assessment_id
    join public.students s on s.id = gr.student_id
    join public.profiles p on p.id = s.profile_id
    where gr.recorded_at is not null
      and gr.score is not null
      and (v_role = 'admin'::public.user_role
           or exists (select 1 from public.groups g where g.id = s.group_id and g.teacher_id = v_uid))

    union all

    select jsonb_build_object(
      'ts', o.created_at,
      'kind', 'observacion',
      'emoji', '🗒️',
      'title', 'Observación registrada',
      'detail', coalesce(o.category, 'General'),
      'student', s.student_code,
      'name', p.full_name
    )
    from public.observations o
    join public.students s on s.id = o.student_id
    join public.profiles p on p.id = s.profile_id
    where o.deleted_at is null
      and (v_role = 'admin'::public.user_role
           or exists (select 1 from public.groups g where g.id = s.group_id and g.teacher_id = v_uid))
    ) raw
    order by (entry->>'ts')::timestamptz desc
    limit v_limit
  ) entries;

  return jsonb_build_object('entries', v_result);
end;
$$;

revoke all on function public.app_staff_tasks() from public;
revoke all on function public.app_activity_log(int) from public;
grant execute on function public.app_staff_tasks() to authenticated;
grant execute on function public.app_activity_log(int) to authenticated;
