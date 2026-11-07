-- 0013 · Fichas de alumnos, score del grupo y tablero de materias
--
-- 1) Campos nuevos en student_profiles para el perfil profesional.
-- 2) app_staff_dashboard ampliado: score del grupo, score por alumno
--    y conteo de faltas por alumno (informativo, no afecta calificación).
-- 3) app_subject_board(): por materia, unidades con avance por alumno,
--    evaluaciones (exámenes/tareas) y calificaciones por alumno.

alter table public.student_profiles
  add column if not exists career_choice text,
  add column if not exists career_suggestions jsonb not null default '[]'::jsonb,
  add column if not exists personality jsonb not null default '{}'::jsonb,
  add column if not exists aptitude jsonb not null default '{}'::jsonb;

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
  v_published_units bigint;
  v_result jsonb;
begin
  if v_role is null or v_role not in ('admin'::public.user_role, 'teacher'::public.user_role) then
    raise exception 'Solo personal de la institución' using errcode = '42501';
  end if;

  select count(*) into v_published_units
    from public.units u where u.status = 'published'::public.unit_status;

  select jsonb_build_object(
    'role', v_role,
    'published_units_total', v_published_units,

    'counts', (
      select jsonb_build_object(
        'students', count(*) filter (where s.status = 'active'::public.student_status),
        'total_students', count(*),
        'groups', (
          select count(*) from public.groups g
          where v_role = 'admin'::public.user_role or g.teacher_id = v_uid
        ),
        'published_units', v_published_units,
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

    'scores', (
      with student_scope as (
        select s.id as student_id, s.student_code, p.full_name as name, s.group_id
        from public.students s
        join public.profiles p on p.id = s.profile_id
        where s.status = 'active'::public.student_status
          and (v_role = 'admin'::public.user_role
               or exists (select 1 from public.groups g where g.id = s.group_id and g.teacher_id = v_uid))
      ), per_student as (
        select sc.student_id, sc.student_code, sc.name,
               coalesce(ss.xp_total, 0) as xp,
               coalesce(ss.units_completed, 0) as units_done,
               ss.accuracy,
               (
                 select count(*)
                 from public.attendance att
                 where att.student_id = sc.student_id and att.status = 'absent'::public.attendance_status
               ) as absences,
               round(
                 coalesce(ss.accuracy, 0) * 0.5
                 + (coalesce(ss.units_completed, 0)::numeric / greatest(v_published_units, 1) * 100) * 0.5
               ) as score
        from student_scope sc
        left join public.student_stats ss on ss.student_id = sc.student_id
      )
      select jsonb_build_object(
        'group', coalesce(round(avg(score)), 0),
        'students', coalesce(jsonb_agg(
          jsonb_build_object(
            'id', student_id, 'code', student_code, 'name', name,
            'xp', xp, 'units_done', units_done, 'units_total', v_published_units,
            'accuracy', accuracy, 'absences', absences, 'score', score
          ) order by score desc
        ), '[]'::jsonb)
      )
      from per_student
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

create or replace function public.app_subject_board()
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
    'subjects', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', s.id,
          'name', s.name,
          'color', s.color,
          'units', coalesce((
            select jsonb_agg(
              jsonb_build_object(
                'id', u.id,
                'num', u.num,
                'title', u.title,
                'estimated', u.estimated_minutes,
                'assignment', (
                  select jsonb_build_object('id', a.id, 'status', a.status, 'opens', a.opens_at, 'closes', a.closes_at)
                  from public.unit_assignments a
                  where a.unit_id = u.id
                    and (v_role = 'admin'::public.user_role
                         or exists (select 1 from public.groups g2 where g2.id = a.group_id and g2.teacher_id = v_uid))
                  order by a.created_at desc
                  limit 1
                ),
                'students', coalesce((
                  select jsonb_agg(
                    jsonb_build_object(
                      'code', st.student_code,
                      'name', pr.full_name,
                      'status', coalesce(up.status, 'not_started'),
                      'attempts', coalesce(up.attempts_count, 0),
                      'accuracy', up.best_accuracy,
                      'completed', up.completed_at
                    ) order by st.student_code
                  )
                  from public.students st
                  join public.profiles pr on pr.id = st.profile_id
                  left join public.unit_progress up
                    on up.student_id = st.id
                   and up.unit_id = u.id
                  where st.status = 'active'::public.student_status
                    and (v_role = 'admin'::public.user_role
                         or exists (select 1 from public.groups g3 where g3.id = st.group_id and g3.teacher_id = v_uid))
                ), '[]'::jsonb)
              ) order by u.num
            )
            from public.units u
            where u.subject_id = s.id and u.status = 'published'::public.unit_status
          ), '[]'::jsonb),
          'assessments', coalesce((
            select jsonb_agg(
              jsonb_build_object(
                'id', a.id,
                'title', a.name,
                'type', a.type,
                'max', a.max_score,
                'date', a.assessment_date,
                'grades', coalesce((
                  select jsonb_agg(
                    jsonb_build_object('student', st.student_code, 'score', gr.score, 'status', gr.status)
                    order by st.student_code
                  )
                  from public.grades gr
                  join public.students st on st.id = gr.student_id
                  where gr.assessment_id = a.id
                ), '[]'::jsonb)
              ) order by a.assessment_date desc nulls last
            )
            from public.assessments a
            where a.subject_id = s.id
              and (v_role = 'admin'::public.user_role
                   or exists (select 1 from public.groups g4 where g4.id = a.group_id and g4.teacher_id = v_uid))
          ), '[]'::jsonb)
        ) order by s.sort_order
      )
      from public.subjects s
      where s.active
    ), '[]'::jsonb)
  ) into v_result;

  return v_result;
end;
$$;

revoke all on function public.app_staff_dashboard() from public;
revoke all on function public.app_subject_board() from public;
grant execute on function public.app_staff_dashboard() to authenticated;
grant execute on function public.app_subject_board() to authenticated;
