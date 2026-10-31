create or replace function public.app_current_role()
returns public.user_role
language sql
stable
security definer
set search_path = public, pg_temp
set row_security = off
as $$
  select p.role
  from public.profiles p
  where p.id = auth.uid()
    and p.active
  limit 1;
$$;

create or replace function public.app_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
set row_security = off
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'::public.user_role
      and p.active
  );
$$;

create or replace function public.app_is_staff()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
set row_security = off
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role in ('admin'::public.user_role, 'teacher'::public.user_role)
      and p.active
  );
$$;

create or replace function public.app_student_id()
returns uuid
language sql
stable
security definer
set search_path = public, pg_temp
set row_security = off
as $$
  select s.id
  from public.students s
  where s.profile_id = auth.uid()
    and s.status = 'active'::public.student_status
  limit 1;
$$;

create or replace function public.app_guardian_id()
returns uuid
language sql
stable
security definer
set search_path = public, pg_temp
set row_security = off
as $$
  select g.id
  from public.guardians g
  where g.profile_id = auth.uid()
    and g.active
  limit 1;
$$;

create or replace function public.app_is_teacher_of_group(p_group_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
set row_security = off
as $$
  select exists (
    select 1
    from public.groups g
    where g.id = p_group_id
      and g.teacher_id = auth.uid()
  );
$$;

create or replace function public.app_is_teacher_of_student(p_student_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
set row_security = off
as $$
  select exists (
    select 1
    from public.students s
    join public.groups g on g.id = s.group_id
    where s.id = p_student_id
      and g.teacher_id = auth.uid()
  );
$$;

create or replace function public.app_is_own_student(p_student_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
set row_security = off
as $$
  select exists (
    select 1
    from public.students s
    where s.id = p_student_id
      and s.profile_id = auth.uid()
      and s.status = 'active'::public.student_status
  );
$$;

create or replace function public.app_is_own_guardian(p_guardian_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
set row_security = off
as $$
  select exists (
    select 1
    from public.guardians g
    where g.id = p_guardian_id
      and g.profile_id = auth.uid()
      and g.active
  );
$$;

create or replace function public.app_is_guardian_of(p_student_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
set row_security = off
as $$
  select exists (
    select 1
    from public.student_guardians sg
    join public.guardians g on g.id = sg.guardian_id
    join public.students s on s.id = sg.student_id
    where sg.student_id = p_student_id
      and g.profile_id = auth.uid()
      and g.active
      and s.status = 'active'::public.student_status
  );
$$;

create or replace function public.app_student_in_group(p_group_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
set row_security = off
as $$
  select exists (
    select 1
    from public.students s
    where s.group_id = p_group_id
      and s.profile_id = auth.uid()
      and s.status = 'active'::public.student_status
  );
$$;

create or replace function public.app_guardian_has_student_in_group(p_group_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
set row_security = off
as $$
  select exists (
    select 1
    from public.student_guardians sg
    join public.guardians g on g.id = sg.guardian_id
    join public.students s on s.id = sg.student_id
    where s.group_id = p_group_id
      and g.profile_id = auth.uid()
      and g.active
      and s.status = 'active'::public.student_status
  );
$$;

create or replace function public.app_can_access_student(p_student_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
set row_security = off
as $$
  select public.app_is_admin()
    or public.app_is_teacher_of_student(p_student_id)
    or public.app_is_own_student(p_student_id)
    or public.app_is_guardian_of(p_student_id);
$$;

create or replace function public.app_can_access_group(p_group_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
set row_security = off
as $$
  select public.app_is_admin()
    or public.app_is_teacher_of_group(p_group_id)
    or public.app_student_in_group(p_group_id)
    or public.app_guardian_has_student_in_group(p_group_id);
$$;

create or replace function public.app_can_view_profile(p_profile_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
set row_security = off
as $$
  select public.app_is_admin()
    or p_profile_id = auth.uid()
    or exists (
      select 1
      from public.students s
      join public.groups g on g.id = s.group_id
      where s.profile_id = p_profile_id
        and g.teacher_id = auth.uid()
    )
    or exists (
      select 1
      from public.students s
      where s.profile_id = p_profile_id
        and public.app_is_guardian_of(s.id)
    )
    or exists (
      select 1
      from public.guardians gu
      join public.student_guardians sg on sg.guardian_id = gu.id
      where gu.profile_id = p_profile_id
        and public.app_is_own_student(sg.student_id)
    )
    or exists (
      select 1
      from public.guardians gu
      join public.student_guardians sg on sg.guardian_id = gu.id
      where gu.profile_id = p_profile_id
        and public.app_is_guardian_of(sg.student_id)
    );
$$;

create or replace function public.app_can_view_guardian(p_guardian_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
set row_security = off
as $$
  select public.app_is_admin()
    or exists (
      select 1
      from public.guardians g
      where g.id = p_guardian_id
        and g.profile_id = auth.uid()
    )
    or exists (
      select 1
      from public.student_guardians sg
      where sg.guardian_id = p_guardian_id
        and public.app_can_access_student(sg.student_id)
    );
$$;

create or replace function public.app_has_active_assignment(p_assignment_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
set row_security = off
as $$
  select exists (
    select 1
    from public.unit_assignments a
    join public.students s on s.group_id = a.group_id
    join public.units u on u.id = a.unit_id
    join public.unit_versions v on v.id = a.unit_version_id and v.unit_id = a.unit_id
    left join public.student_unit_overrides o
      on o.assignment_id = a.id
     and o.student_id = s.id
    where a.id = p_assignment_id
      and s.profile_id = auth.uid()
      and s.status = 'active'::public.student_status
      and a.visible
      and a.status in ('active'::public.assignment_status, 'closed'::public.assignment_status)
      and coalesce(o.status, a.status) = 'active'::public.assignment_status
      and u.status = 'published'::public.unit_status
      and v.published_at is not null
      and (coalesce(o.opens_at, a.opens_at) is null or coalesce(o.opens_at, a.opens_at) <= now())
      and (coalesce(o.closes_at, a.closes_at) is null or coalesce(o.closes_at, a.closes_at) > now())
  );
$$;

create or replace function public.app_has_active_unit(p_unit_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
set row_security = off
as $$
  select exists (
    select 1
    from public.unit_assignments a
    where a.unit_id = p_unit_id
      and public.app_has_active_assignment(a.id)
  );
$$;

create or replace function public.app_can_access_version(p_version_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
set row_security = off
as $$
  select exists (
    select 1
    from public.unit_assignments a
    where a.unit_version_id = p_version_id
      and public.app_has_active_assignment(a.id)
  );
$$;

create or replace function public.app_can_manage_student_assignment(p_assignment_id uuid, p_student_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
set row_security = off
as $$
  select exists (
    select 1
    from public.unit_assignments a
    join public.students s on s.group_id = a.group_id
    where a.id = p_assignment_id
      and s.id = p_student_id
      and (public.app_is_admin() or public.app_is_teacher_of_group(a.group_id))
  );
$$;

create or replace function public.app_can_manage_attendance(p_session_id uuid, p_student_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
set row_security = off
as $$
  select exists (
    select 1
    from public.attendance_sessions ses
    join public.students s on s.group_id = ses.group_id
    where ses.id = p_session_id
      and s.id = p_student_id
      and (public.app_is_admin() or public.app_is_teacher_of_group(ses.group_id))
  );
$$;

create or replace function public.app_student_has_assessment(p_student_id uuid, p_assessment_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
set row_security = off
as $$
  select exists (
    select 1
    from public.assessments a
    join public.students s on s.group_id = a.group_id
    where a.id = p_assessment_id
      and s.id = p_student_id
  );
$$;

create or replace function public.app_can_manage_grade(p_assessment_id uuid, p_student_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
set row_security = off
as $$
  select exists (
    select 1
    from public.assessments a
    join public.students s on s.group_id = a.group_id
    where a.id = p_assessment_id
      and s.id = p_student_id
      and (public.app_is_admin() or public.app_is_teacher_of_group(a.group_id))
  );
$$;

create or replace function public.app_assessment_visible_to_family(p_assessment_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
set row_security = off
as $$
  select exists (
    select 1
    from public.assessments a
    where a.id = p_assessment_id
      and a.visible_to_guardian
  );
$$;

create or replace function public.app_can_view_grade(p_assessment_id uuid, p_student_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
set row_security = off
as $$
  select public.app_is_admin()
    or (
      public.app_is_teacher_of_student(p_student_id)
      and public.app_student_has_assessment(p_student_id, p_assessment_id)
    )
    or (
      (public.app_is_own_student(p_student_id) or public.app_is_guardian_of(p_student_id))
      and public.app_student_has_assessment(p_student_id, p_assessment_id)
      and public.app_assessment_visible_to_family(p_assessment_id)
    );
$$;

create or replace function public.app_can_manage_message(p_student_id uuid, p_guardian_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
set row_security = off
as $$
  select exists (
    select 1
    from public.student_guardians sg
    where sg.student_id = p_student_id
      and sg.guardian_id = p_guardian_id
      and (public.app_is_admin() or public.app_is_teacher_of_student(p_student_id))
  );
$$;

grant usage on schema public to authenticated, service_role;
revoke all on all tables in schema public from anon;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;
revoke execute on all functions in schema public from public, anon;
grant execute on all functions in schema public to authenticated, service_role;

alter table public.academic_years enable row level security;
alter table public.terms enable row level security;
alter table public.profiles enable row level security;
alter table public.groups enable row level security;
alter table public.students enable row level security;
alter table public.guardians enable row level security;
alter table public.student_guardians enable row level security;
alter table public.privacy_consents enable row level security;
alter table public.subjects enable row level security;
alter table public.units enable row level security;
alter table public.unit_versions enable row level security;
alter table public.unit_assignments enable row level security;
alter table public.student_unit_overrides enable row level security;
alter table public.unit_progress enable row level security;
alter table public.exercise_attempts enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.game_catalog enable row level security;
alter table public.game_sessions enable row level security;
alter table public.reading_assessments enable row level security;
alter table public.xp_events enable row level security;
alter table public.badges enable row level security;
alter table public.student_badges enable row level security;
alter table public.student_stats enable row level security;
alter table public.student_profiles enable row level security;
alter table public.attendance_sessions enable row level security;
alter table public.attendance enable row level security;
alter table public.assessments enable row level security;
alter table public.grades enable row level security;
alter table public.task_status enable row level security;
alter table public.observations enable row level security;
alter table public.guardian_messages enable row level security;
alter table public.email_outbox enable row level security;
alter table public.audit_log enable row level security;
alter table public.settings enable row level security;

create policy academic_years_select_authenticated
on public.academic_years for select to authenticated
using (true);

create policy academic_years_admin_all
on public.academic_years for all to authenticated
using (public.app_is_admin())
with check (public.app_is_admin());

create policy terms_select_authenticated
on public.terms for select to authenticated
using (true);

create policy terms_admin_all
on public.terms for all to authenticated
using (public.app_is_admin())
with check (public.app_is_admin());

create policy profiles_select
on public.profiles for select to authenticated
using (public.app_can_view_profile(id));

create policy profiles_admin_all
on public.profiles for all to authenticated
using (public.app_is_admin())
with check (public.app_is_admin());

create policy groups_select
on public.groups for select to authenticated
using (public.app_can_access_group(id));

create policy groups_admin_all
on public.groups for all to authenticated
using (public.app_is_admin())
with check (public.app_is_admin());

create policy students_select
on public.students for select to authenticated
using (public.app_can_access_student(id));

create policy students_insert_staff
on public.students for insert to authenticated
with check (public.app_is_admin() or public.app_is_teacher_of_group(group_id));

create policy students_update_staff
on public.students for update to authenticated
using (public.app_is_admin() or public.app_is_teacher_of_group(group_id))
with check (public.app_is_admin() or public.app_is_teacher_of_group(group_id));

create policy students_delete_admin
on public.students for delete to authenticated
using (public.app_is_admin());

create policy guardians_select
on public.guardians for select to authenticated
using (public.app_can_view_guardian(id));

create policy guardians_admin_all
on public.guardians for all to authenticated
using (public.app_is_admin())
with check (public.app_is_admin());

create policy student_guardians_select
on public.student_guardians for select to authenticated
using (public.app_can_access_student(student_id) or public.app_is_own_guardian(guardian_id));

create policy student_guardians_admin_all
on public.student_guardians for all to authenticated
using (public.app_is_admin())
with check (public.app_is_admin());

create policy privacy_consents_select
on public.privacy_consents for select to authenticated
using (
  public.app_is_admin()
  or public.app_is_own_guardian(guardian_id)
  or public.app_is_own_student(student_id)
  or public.app_is_teacher_of_student(student_id)
);

create policy privacy_consents_guardian_insert
on public.privacy_consents for insert to authenticated
with check (
  public.app_is_admin()
  or (guardian_id = public.app_guardian_id() and public.app_is_guardian_of(student_id))
);

create policy privacy_consents_admin_all
on public.privacy_consents for all to authenticated
using (public.app_is_admin())
with check (public.app_is_admin());

create policy subjects_select
on public.subjects for select to authenticated
using (active or public.app_is_admin());

create policy subjects_admin_all
on public.subjects for all to authenticated
using (public.app_is_admin())
with check (public.app_is_admin());

create policy units_select
on public.units for select to authenticated
using (public.app_is_staff() or public.app_has_active_unit(id));

create policy units_admin_all
on public.units for all to authenticated
using (public.app_is_admin())
with check (public.app_is_admin());

create policy unit_versions_select
on public.unit_versions for select to authenticated
using (public.app_is_staff() or public.app_can_access_version(id));

create policy unit_versions_admin_all
on public.unit_versions for all to authenticated
using (public.app_is_admin())
with check (public.app_is_admin());

create policy unit_assignments_select
on public.unit_assignments for select to authenticated
using (
  public.app_is_admin()
  or public.app_is_teacher_of_group(group_id)
  or (
    visible
    and status in ('active'::public.assignment_status, 'closed'::public.assignment_status)
    and (public.app_student_in_group(group_id) or public.app_guardian_has_student_in_group(group_id))
  )
);

create policy unit_assignments_insert_staff
on public.unit_assignments for insert to authenticated
with check (public.app_is_admin() or public.app_is_teacher_of_group(group_id));

create policy unit_assignments_update_staff
on public.unit_assignments for update to authenticated
using (public.app_is_admin() or public.app_is_teacher_of_group(group_id))
with check (public.app_is_admin() or public.app_is_teacher_of_group(group_id));

create policy unit_assignments_delete_staff
on public.unit_assignments for delete to authenticated
using (public.app_is_admin() or public.app_is_teacher_of_group(group_id));

create policy student_unit_overrides_select
on public.student_unit_overrides for select to authenticated
using (
  public.app_can_manage_student_assignment(assignment_id, student_id)
  or public.app_is_own_student(student_id)
);

create policy student_unit_overrides_write_staff
on public.student_unit_overrides for all to authenticated
using (public.app_can_manage_student_assignment(assignment_id, student_id))
with check (public.app_can_manage_student_assignment(assignment_id, student_id));

create policy unit_progress_select
on public.unit_progress for select to authenticated
using (public.app_can_access_student(student_id));

create policy unit_progress_admin_all
on public.unit_progress for all to authenticated
using (public.app_is_admin())
with check (public.app_is_admin());

create policy exercise_attempts_select
on public.exercise_attempts for select to authenticated
using (public.app_can_access_student(student_id));

create policy exercise_attempts_admin_all
on public.exercise_attempts for all to authenticated
using (public.app_is_admin())
with check (public.app_is_admin());

create policy quiz_attempts_select
on public.quiz_attempts for select to authenticated
using (public.app_can_access_student(student_id));

create policy quiz_attempts_admin_all
on public.quiz_attempts for all to authenticated
using (public.app_is_admin())
with check (public.app_is_admin());

create policy game_catalog_select
on public.game_catalog for select to authenticated
using (active or public.app_is_admin());

create policy game_catalog_admin_all
on public.game_catalog for all to authenticated
using (public.app_is_admin())
with check (public.app_is_admin());

create policy game_sessions_select
on public.game_sessions for select to authenticated
using (public.app_can_access_student(student_id));

create policy game_sessions_admin_all
on public.game_sessions for all to authenticated
using (public.app_is_admin())
with check (public.app_is_admin());

create policy reading_assessments_select
on public.reading_assessments for select to authenticated
using (public.app_can_access_student(student_id));

create policy reading_assessments_admin_all
on public.reading_assessments for all to authenticated
using (public.app_is_admin())
with check (public.app_is_admin());

create policy xp_events_select
on public.xp_events for select to authenticated
using (
  public.app_is_admin()
  or public.app_is_teacher_of_student(student_id)
  or public.app_is_own_student(student_id)
);

create policy xp_events_admin_all
on public.xp_events for all to authenticated
using (public.app_is_admin())
with check (public.app_is_admin());

create policy badges_select
on public.badges for select to authenticated
using (true);

create policy badges_admin_all
on public.badges for all to authenticated
using (public.app_is_admin())
with check (public.app_is_admin());

create policy student_badges_select
on public.student_badges for select to authenticated
using (public.app_can_access_student(student_id));

create policy student_badges_admin_all
on public.student_badges for all to authenticated
using (public.app_is_admin())
with check (public.app_is_admin());

create policy student_stats_select
on public.student_stats for select to authenticated
using (public.app_can_access_student(student_id));

create policy student_stats_admin_all
on public.student_stats for all to authenticated
using (public.app_is_admin())
with check (public.app_is_admin());

create policy student_profiles_select
on public.student_profiles for select to authenticated
using (public.app_can_access_student(student_id));

create policy student_profiles_staff_insert
on public.student_profiles for insert to authenticated
with check (public.app_is_admin() or public.app_is_teacher_of_student(student_id));

create policy student_profiles_staff_update
on public.student_profiles for update to authenticated
using (public.app_is_admin() or public.app_is_teacher_of_student(student_id))
with check (public.app_is_admin() or public.app_is_teacher_of_student(student_id));

create policy student_profiles_delete_admin
on public.student_profiles for delete to authenticated
using (public.app_is_admin());

create policy attendance_sessions_select
on public.attendance_sessions for select to authenticated
using (public.app_can_access_group(group_id));

create policy attendance_sessions_staff_write
on public.attendance_sessions for all to authenticated
using (public.app_is_admin() or public.app_is_teacher_of_group(group_id))
with check (public.app_is_admin() or public.app_is_teacher_of_group(group_id));

create policy attendance_select
on public.attendance for select to authenticated
using (public.app_can_access_student(student_id));

create policy attendance_staff_write
on public.attendance for all to authenticated
using (public.app_can_manage_attendance(session_id, student_id))
with check (public.app_can_manage_attendance(session_id, student_id));

create policy assessments_select
on public.assessments for select to authenticated
using (
  public.app_is_admin()
  or public.app_is_teacher_of_group(group_id)
  or (
    visible_to_guardian
    and (public.app_student_in_group(group_id) or public.app_guardian_has_student_in_group(group_id))
  )
);

create policy assessments_staff_write
on public.assessments for all to authenticated
using (public.app_is_admin() or public.app_is_teacher_of_group(group_id))
with check (public.app_is_admin() or public.app_is_teacher_of_group(group_id));

create policy grades_select
on public.grades for select to authenticated
using (public.app_can_view_grade(assessment_id, student_id));

create policy grades_staff_write
on public.grades for all to authenticated
using (public.app_can_manage_grade(assessment_id, student_id))
with check (public.app_can_manage_grade(assessment_id, student_id));

create policy task_status_select
on public.task_status for select to authenticated
using (public.app_can_access_student(student_id));

create policy task_status_staff_write
on public.task_status for all to authenticated
using (public.app_is_admin() or public.app_is_teacher_of_student(student_id))
with check (public.app_is_admin() or public.app_is_teacher_of_student(student_id));

create policy observations_select
on public.observations for select to authenticated
using (
  public.app_is_admin()
  or public.app_is_teacher_of_student(student_id)
  or (
    visibility = 'family'::public.observation_visibility
    and (public.app_is_own_student(student_id) or public.app_is_guardian_of(student_id))
  )
);

create policy observations_staff_insert
on public.observations for insert to authenticated
with check (public.app_is_admin() or public.app_is_teacher_of_student(student_id));

create policy observations_staff_update
on public.observations for update to authenticated
using (public.app_is_admin() or public.app_is_teacher_of_student(student_id))
with check (public.app_is_admin() or public.app_is_teacher_of_student(student_id));

create policy observations_delete_admin
on public.observations for delete to authenticated
using (public.app_is_admin());

create policy guardian_messages_select
on public.guardian_messages for select to authenticated
using (
  public.app_is_admin()
  or public.app_is_teacher_of_student(student_id)
  or public.app_is_own_guardian(guardian_id)
);

create policy guardian_messages_staff_insert
on public.guardian_messages for insert to authenticated
with check (public.app_can_manage_message(student_id, guardian_id));

create policy guardian_messages_staff_update
on public.guardian_messages for update to authenticated
using (public.app_can_manage_message(student_id, guardian_id))
with check (public.app_can_manage_message(student_id, guardian_id));

create policy guardian_messages_delete_admin
on public.guardian_messages for delete to authenticated
using (public.app_is_admin());

create policy email_outbox_select_admin
on public.email_outbox for select to authenticated
using (public.app_is_admin());

create policy audit_log_select_admin
on public.audit_log for select to authenticated
using (public.app_is_admin());

create policy settings_select_admin
on public.settings for select to authenticated
using (public.app_is_admin());

create policy settings_admin_all
on public.settings for all to authenticated
using (public.app_is_admin())
with check (public.app_is_admin());
