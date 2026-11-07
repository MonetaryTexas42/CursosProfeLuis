-- 0014 · Corrige app_subject_board (columna assessments.type)
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

revoke all on function public.app_subject_board() from public;
grant execute on function public.app_subject_board() to authenticated;
