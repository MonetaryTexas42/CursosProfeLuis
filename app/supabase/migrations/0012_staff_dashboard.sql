-- 0012 · Dashboard del staff y detalle del alumno
--
-- app_staff_dashboard(): resumen operativo (admin: todo; profesor: su grupo).
-- app_student_detail(): avance por unidad e intentos recientes de un alumno.

create or replace function public.app_staff_dashboard()
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
    'role', v_role,

    'counts', (
      select jsonb_build_object(
        'students', count(*) filter (where s.status = 'active'::public.student_status),
        'total_students', count(*),
        'groups', (
          select count(*) from public.groups g
          where v_role = 'admin'::public.user_role or g.teacher_id = v_uid
        ),
        'published_units', (
          select count(*) from public.units u where u.status = 'published'::public.unit_status
        ),
        'active_assignments', (
          select count(*) from public.unit_assignments a
          join public.groups g on g.id = a.group_id
          where a.status = 'active'::public.assignment_status
            and (v_role = 'admin'::public.user_role or g.teacher_id = v_uid)
        )
      )
      from public.students s
      where v_role = 'admin'::public.user_role
         or exists (select 1 from public.groups g2 where g2.id = s.group_id and g2.teacher_id = v_uid)
    ),

    'activity', (
      select jsonb_build_object(
        'today_attempts', (
          select count(*) from public.exercise_attempts a
          join public.students s on s.id = a.student_id
          where a.created_at::date = current_date
            and (v_role = 'admin'::public.user_role
                 or exists (select 1 from public.groups g where g.id = s.group_id and g.teacher_id = v_uid))
        ),
        'week_attempts', (
          select count(*) from public.exercise_attempts a
          join public.students s on s.id = a.student_id
          where a.created_at::date >= current_date - 6
            and (v_role = 'admin'::public.user_role
                 or exists (select 1 from public.groups g where g.id = s.group_id and g.teacher_id = v_uid))
        ),
        'today_completions', (
          select count(*) from public.unit_progress p
          join public.students s on s.id = p.student_id
          where p.completed_at::date = current_date
            and (v_role = 'admin'::public.user_role
                 or exists (select 1 from public.groups g where g.id = s.group_id and g.teacher_id = v_uid))
        ),
        'week_completions', (
          select count(*) from public.unit_progress p
          join public.students s on s.id = p.student_id
          where p.completed_at::date >= current_date - 6
            and (v_role = 'admin'::public.user_role
                 or exists (select 1 from public.groups g where g.id = s.group_id and g.teacher_id = v_uid))
        ),
        'xp_total', (
          select coalesce(sum(ss.xp_total), 0) from public.student_stats ss
          join public.students s on s.id = ss.student_id
          where v_role = 'admin'::public.user_role
             or exists (select 1 from public.groups g where g.id = s.group_id and g.teacher_id = v_uid)
        ),
        'series', coalesce((
          select jsonb_agg(
            jsonb_build_object(
              'day', d.d,
              'attempts', coalesce(x.c, 0),
              'completions', coalesce(y.c, 0)
            ) order by d.d
          )
          from (select generate_series(current_date - 6, current_date, interval '1 day')::date as d) d
          left join lateral (
            select count(*) c from public.exercise_attempts a
            join public.students s on s.id = a.student_id
            where a.created_at::date = d.d
              and (v_role = 'admin'::public.user_role
                   or exists (select 1 from public.groups g where g.id = s.group_id and g.teacher_id = v_uid))
          ) x on true
          left join lateral (
            select count(*) c from public.unit_progress p
            join public.students s on s.id = p.student_id
            where p.completed_at::date = d.d
              and (v_role = 'admin'::public.user_role
                   or exists (select 1 from public.groups g where g.id = s.group_id and g.teacher_id = v_uid))
          ) y on true
        ), '[]'::jsonb)
      )
    ),

    'attention', jsonb_build_object(
      'pending_consent', coalesce((
        select jsonb_agg(
          jsonb_build_object('student', s.student_code, 'guardian', gp.full_name)
          order by s.student_code
        )
        from public.student_guardians sg
        join public.students s on s.id = sg.student_id
        join public.guardians gu on gu.id = sg.guardian_id
        join public.profiles gp on gp.id = gu.profile_id
        where (v_role = 'admin'::public.user_role
               or exists (select 1 from public.groups g where g.id = s.group_id and g.teacher_id = v_uid))
          and not exists (
            select 1 from public.privacy_consents pc
            where pc.student_id = s.id and pc.guardian_id = gu.id and pc.revoked_at is null
          )
      ), '[]'::jsonb),
      'inactive_students', coalesce((
        select jsonb_agg(
          jsonb_build_object(
            'student', s.student_code,
            'name', p.full_name,
            'days', (current_date - ss.last_activity_date)
          ) order by ss.last_activity_date nulls first
        )
        from public.students s
        join public.profiles p on p.id = s.profile_id
        left join public.student_stats ss on ss.student_id = s.id
        where s.status = 'active'::public.student_status
          and (v_role = 'admin'::public.user_role
               or exists (select 1 from public.groups g where g.id = s.group_id and g.teacher_id = v_uid))
          and (ss.last_activity_date is null or ss.last_activity_date < current_date - 6)
      ), '[]'::jsonb),
      'attendance_missing_today', (
        select count(*) > 0
        from public.groups g
        where (v_role = 'admin'::public.user_role or g.teacher_id = v_uid)
          and g.active
          and not exists (
            select 1 from public.attendance_sessions a
            where a.group_id = g.id and a.session_date = current_date
          )
      ),
      'units_without_assignments', (
        select count(*)
        from public.units u
        where u.status = 'published'::public.unit_status
          and not exists (
            select 1 from public.unit_assignments a
            where a.unit_id = u.id and a.status = 'active'::public.assignment_status
          )
      ),
      'assignments_ending_soon', coalesce((
        select jsonb_agg(
          jsonb_build_object('unit', un.title, 'group', g.name, 'closes', a.closes_at)
          order by a.closes_at
        )
        from public.unit_assignments a
        join public.units un on un.id = a.unit_id
        join public.groups g on g.id = a.group_id
        where a.status = 'active'::public.assignment_status
          and a.closes_at is not null
          and a.closes_at between now() and now() + interval '3 days'
          and (v_role = 'admin'::public.user_role or g.teacher_id = v_uid)
      ), '[]'::jsonb)
    ),

    'recent', coalesce((
      select jsonb_agg(t order by t->>'ts' desc)
      from (
        select jsonb_build_object(
          'ts', a.created_at, 'kind', 'attempt', 'student', s.student_code,
          'name', p.full_name, 'text', 'respondió un ejercicio', 'ok', a.is_correct
        ) as t
        from public.exercise_attempts a
        join public.students s on s.id = a.student_id
        join public.profiles p on p.id = s.profile_id
        where v_role = 'admin'::public.user_role
           or exists (select 1 from public.groups g where g.id = s.group_id and g.teacher_id = v_uid)

        union all

        select jsonb_build_object(
          'ts', pr.completed_at, 'kind', 'completed', 'student', s.student_code,
          'name', p.full_name, 'text', 'completó una unidad', 'ok', true
        ) as t
        from public.unit_progress pr
        join public.students s on s.id = pr.student_id
        join public.profiles p on p.id = s.profile_id
        where pr.status = 'completed'::public.progress_status
          and pr.completed_at is not null
          and (v_role = 'admin'::public.user_role
               or exists (select 1 from public.groups g where g.id = s.group_id and g.teacher_id = v_uid))
      ) x
      limit 12
    ), '[]'::jsonb)
  ) into v_result;

  return v_result;
end;
$$;

create or replace function public.app_student_detail(p_student_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public, pg_temp
set row_security = off
as $$
declare
  v_result jsonb;
begin
  if auth.uid() is null then
    raise exception 'No autenticado' using errcode = '42501';
  end if;

  if not public.app_is_admin() and not public.app_is_teacher_of_student(p_student_id) then
    raise exception 'Sin permiso sobre este alumno' using errcode = '42501';
  end if;

  select jsonb_build_object(
    'student', (
      select jsonb_build_object('code', s.student_code, 'status', s.status, 'name', p.full_name)
      from public.students s
      join public.profiles p on p.id = s.profile_id
      where s.id = p_student_id
    ),
    'stats', (
      select jsonb_build_object(
        'xp', ss.xp_total, 'streak', ss.current_streak, 'best', ss.best_streak,
        'units', ss.units_completed, 'accuracy', ss.accuracy, 'last', ss.last_activity_date
      )
      from public.student_stats ss where ss.student_id = p_student_id
    ),
    'units', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'unit', u.title,
          'subject', u.subject_id,
          'status', coalesce(up.status, 'not_started'),
          'attempts', coalesce(up.attempts_count, 0),
          'accuracy', up.best_accuracy,
          'started', up.started_at,
          'completed', up.completed_at,
          'last', up.last_activity_at
        ) order by u.subject_id, u.num
      )
      from public.unit_assignments a
      join public.units u on u.id = a.unit_id
      left join public.unit_progress up on up.assignment_id = a.id and up.student_id = p_student_id
      where a.group_id = (select s.group_id from public.students s where s.id = p_student_id)
        and a.status in ('active'::public.assignment_status, 'closed'::public.assignment_status)
    ), '[]'::jsonb),
    'recent', coalesce((
      select jsonb_agg(t order by t->>'ts' desc)
      from (
        select jsonb_build_object(
          'ts', a.created_at, 'kind', 'ejercicio',
          'text', 'Ejercicio ' || a.exercise_key, 'ok', a.is_correct
        ) as t
        from public.exercise_attempts a where a.student_id = p_student_id

        union all

        select jsonb_build_object(
          'ts', q.created_at, 'kind', 'quiz',
          'text', 'Quiz · ' || q.part, 'ok', q.is_correct
        ) as t
        from public.quiz_attempts q where q.student_id = p_student_id
      ) x
      limit 15
    ), '[]'::jsonb)
  ) into v_result;

  return v_result;
end;
$$;

revoke all on function public.app_staff_dashboard() from public;
revoke all on function public.app_student_detail(uuid) from public;
grant execute on function public.app_staff_dashboard() to authenticated;
grant execute on function public.app_student_detail(uuid) to authenticated;
