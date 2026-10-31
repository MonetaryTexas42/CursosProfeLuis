set search_path = public, extensions;

create extension if not exists pgcrypto;
create extension if not exists citext;

do $$
begin
  if to_regtype('public.user_role') is null then
    create type public.user_role as enum ('admin', 'teacher', 'student', 'guardian');
  end if;
  if to_regtype('public.unit_status') is null then
    create type public.unit_status as enum ('draft', 'published', 'archived');
  end if;
  if to_regtype('public.assignment_status') is null then
    create type public.assignment_status as enum ('draft', 'active', 'closed');
  end if;
  if to_regtype('public.progress_status') is null then
    create type public.progress_status as enum ('not_started', 'in_progress', 'completed', 'mastered');
  end if;
  if to_regtype('public.attendance_status') is null then
    create type public.attendance_status as enum ('present', 'late', 'excused', 'absent');
  end if;
  if to_regtype('public.observation_visibility') is null then
    create type public.observation_visibility as enum ('internal', 'family');
  end if;
  if to_regtype('public.message_channel') is null then
    create type public.message_channel as enum ('portal', 'email');
  end if;
  if to_regtype('public.message_status') is null then
    create type public.message_status as enum ('draft', 'queued', 'sent', 'failed', 'read');
  end if;
  if to_regtype('public.grade_status') is null then
    create type public.grade_status as enum ('pending', 'recorded', 'absent', 'exempt');
  end if;
  if to_regtype('public.student_status') is null then
    create type public.student_status as enum ('active', 'inactive', 'graduated', 'withdrawn');
  end if;
  if to_regtype('public.assessment_type') is null then
    create type public.assessment_type as enum ('diagnostic', 'quiz', 'exam', 'project', 'participation', 'other');
  end if;
  if to_regtype('public.task_completion_status') is null then
    create type public.task_completion_status as enum ('pending', 'submitted', 'late', 'not_applicable');
  end if;
  if to_regtype('public.email_status') is null then
    create type public.email_status as enum ('pending', 'sending', 'sent', 'failed');
  end if;
end $$;

create table if not exists public.academic_years (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  starts_on date not null,
  ends_on date not null,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  check (ends_on > starts_on)
);

create unique index if not exists academic_years_one_active
  on public.academic_years (is_active) where is_active;

create table if not exists public.terms (
  id uuid primary key default gen_random_uuid(),
  academic_year_id uuid not null references public.academic_years(id),
  name text not null,
  starts_on date not null,
  ends_on date not null,
  weight numeric(5,2) not null default 1,
  sort_order int not null default 1,
  created_at timestamptz not null default now(),
  unique (academic_year_id, name),
  check (ends_on > starts_on),
  check (weight >= 0)
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null default 'student',
  full_name text not null,
  username citext unique,
  email citext unique,
  phone text,
  active boolean not null default true,
  must_change_password boolean not null default false,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.groups (
  id uuid primary key default gen_random_uuid(),
  academic_year_id uuid not null references public.academic_years(id),
  name text not null,
  level text,
  teacher_id uuid not null references public.profiles(id),
  schedule text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (academic_year_id, name)
);

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id),
  group_id uuid not null references public.groups(id),
  student_code text not null unique,
  birth_date date,
  enrollment_date date not null default current_date,
  status public.student_status not null default 'active',
  notes_internal text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.guardians (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid unique references public.profiles(id),
  full_name text not null,
  email citext not null unique,
  phone text,
  relationship text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.student_guardians (
  student_id uuid not null references public.students(id),
  guardian_id uuid not null references public.guardians(id),
  is_primary boolean not null default false,
  can_receive_email boolean not null default true,
  created_at timestamptz not null default now(),
  primary key (student_id, guardian_id)
);

create unique index if not exists student_guardians_one_primary
  on public.student_guardians (student_id) where is_primary;

create table if not exists public.privacy_consents (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id),
  guardian_id uuid not null references public.guardians(id),
  document_version text not null,
  accepted_at timestamptz not null default now(),
  revoked_at timestamptz,
  ip inet,
  user_agent text,
  metadata jsonb not null default '{}'::jsonb,
  unique (student_id, guardian_id, document_version)
);

create table if not exists public.subjects (
  id text primary key,
  name text not null,
  short text,
  color text,
  icon text,
  badge text,
  sort_order int not null default 1,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.units (
  id uuid primary key default gen_random_uuid(),
  subject_id text not null references public.subjects(id),
  num int not null,
  title text not null,
  status public.unit_status not null default 'draft',
  sort_order int not null default 1,
  estimated_minutes int,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (subject_id, num),
  check (estimated_minutes is null or estimated_minutes > 0)
);

create table if not exists public.unit_versions (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references public.units(id),
  version int not null,
  content jsonb not null,
  checksum text,
  published_at timestamptz,
  published_by uuid references public.profiles(id),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  unique (unit_id, version),
  unique (id, unit_id)
);

create table if not exists public.unit_assignments (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id),
  unit_id uuid not null references public.units(id),
  unit_version_id uuid not null,
  opens_at timestamptz,
  closes_at timestamptz,
  status public.assignment_status not null default 'draft',
  visible boolean not null default true,
  instructions text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (unit_version_id, unit_id) references public.unit_versions(id, unit_id),
  unique (id, unit_id, unit_version_id),
  check (closes_at is null or opens_at is null or closes_at > opens_at)
);

create table if not exists public.student_unit_overrides (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.unit_assignments(id),
  student_id uuid not null references public.students(id),
  opens_at timestamptz,
  closes_at timestamptz,
  status public.assignment_status,
  reason text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  unique (assignment_id, student_id),
  check (closes_at is null or opens_at is null or closes_at > opens_at)
);

create table if not exists public.unit_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id),
  assignment_id uuid not null,
  unit_id uuid not null,
  unit_version_id uuid not null,
  status public.progress_status not null default 'not_started',
  started_at timestamptz,
  completed_at timestamptz,
  last_activity_at timestamptz,
  time_spent_seconds int not null default 0,
  best_accuracy numeric(5,2),
  attempts_count int not null default 0,
  xp_earned int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (assignment_id, unit_id, unit_version_id)
    references public.unit_assignments(id, unit_id, unit_version_id),
  unique (student_id, assignment_id),
  check (time_spent_seconds >= 0),
  check (attempts_count >= 0),
  check (best_accuracy is null or (best_accuracy >= 0 and best_accuracy <= 100))
);

create table if not exists public.exercise_attempts (
  id bigserial primary key,
  student_id uuid not null references public.students(id),
  assignment_id uuid not null,
  unit_id uuid not null,
  unit_version_id uuid not null,
  exercise_key text not null,
  answer jsonb,
  is_correct boolean not null default false,
  attempt_no int not null default 1,
  duration_ms int,
  created_at timestamptz not null default now(),
  foreign key (assignment_id, unit_id, unit_version_id)
    references public.unit_assignments(id, unit_id, unit_version_id),
  check (attempt_no > 0),
  check (duration_ms is null or duration_ms >= 0)
);

create table if not exists public.quiz_attempts (
  id bigserial primary key,
  student_id uuid not null references public.students(id),
  assignment_id uuid not null,
  unit_id uuid not null,
  unit_version_id uuid not null,
  part text not null,
  question_key text not null,
  selected_index int,
  is_correct boolean not null default false,
  created_at timestamptz not null default now(),
  foreign key (assignment_id, unit_id, unit_version_id)
    references public.unit_assignments(id, unit_id, unit_version_id),
  check (part in ('tipo', 'reto', 'capitulo')),
  check (selected_index is null or selected_index >= 0)
);

create table if not exists public.game_catalog (
  id text primary key,
  name text not null,
  description text,
  subject_id text references public.subjects(id),
  metric_type text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.game_sessions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id),
  game_id text not null references public.game_catalog(id),
  mode text,
  difficulty text,
  score numeric(10,2) not null default 0,
  max_score numeric(10,2),
  accuracy numeric(5,2),
  correct int not null default 0,
  wrong int not null default 0,
  duration_seconds int not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  check (score >= 0),
  check (max_score is null or max_score >= 0),
  check (accuracy is null or (accuracy >= 0 and accuracy <= 100)),
  check (correct >= 0),
  check (wrong >= 0),
  check (duration_seconds >= 0)
);

create table if not exists public.reading_assessments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id),
  tool text not null default 'lectura',
  assessment_type text,
  wpm numeric(6,2),
  comprehension_pct numeric(5,2),
  words_read int,
  errors int,
  level text,
  duration_seconds int not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  check (wpm is null or wpm >= 0),
  check (comprehension_pct is null or (comprehension_pct >= 0 and comprehension_pct <= 100)),
  check (words_read is null or words_read >= 0),
  check (errors is null or errors >= 0),
  check (duration_seconds >= 0)
);

create table if not exists public.xp_events (
  id bigserial primary key,
  student_id uuid not null references public.students(id),
  source_type text not null,
  source_id text,
  xp int not null,
  reason text,
  created_at timestamptz not null default now(),
  check (xp <> 0)
);

create table if not exists public.badges (
  id text primary key,
  name text not null,
  description text,
  icon text,
  criteria jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.student_badges (
  student_id uuid not null references public.students(id),
  badge_id text not null references public.badges(id),
  awarded_at timestamptz not null default now(),
  source text,
  primary key (student_id, badge_id)
);

create table if not exists public.student_stats (
  student_id uuid primary key references public.students(id),
  xp_total int not null default 0,
  current_streak int not null default 0,
  best_streak int not null default 0,
  last_activity_date date,
  units_completed int not null default 0,
  units_mastered int not null default 0,
  accuracy numeric(5,2),
  reading_wpm numeric(6,2),
  reading_comprehension numeric(5,2),
  updated_at timestamptz not null default now(),
  check (xp_total >= 0),
  check (current_streak >= 0),
  check (best_streak >= 0),
  check (units_completed >= 0),
  check (units_mastered >= 0),
  check (accuracy is null or (accuracy >= 0 and accuracy <= 100)),
  check (reading_comprehension is null or (reading_comprehension >= 0 and reading_comprehension <= 100))
);

create table if not exists public.student_profiles (
  student_id uuid primary key references public.students(id),
  interests text[] not null default '{}',
  aptitudes text[] not null default '{}',
  strengths text[] not null default '{}',
  weaknesses text[] not null default '{}',
  extras text[] not null default '{}',
  vocational_notes text,
  reading_goal text,
  updated_at timestamptz not null default now()
);

create table if not exists public.attendance_sessions (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id),
  session_date date not null,
  start_time time,
  end_time time,
  topic text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  unique (group_id, session_date, start_time),
  check (end_time is null or start_time is null or end_time > start_time)
);

create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.attendance_sessions(id),
  student_id uuid not null references public.students(id),
  status public.attendance_status not null default 'present',
  minutes_late int not null default 0,
  note text,
  recorded_by uuid references public.profiles(id),
  updated_at timestamptz not null default now(),
  unique (session_id, student_id),
  check (minutes_late >= 0)
);

create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id),
  subject_id text not null references public.subjects(id),
  term_id uuid not null references public.terms(id),
  name text not null,
  type public.assessment_type not null default 'other',
  max_score numeric(5,2) not null default 10,
  weight numeric(5,2) not null default 1,
  assessment_date date,
  visible_to_guardian boolean not null default false,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  unique (group_id, subject_id, term_id, name),
  check (max_score > 0),
  check (weight >= 0)
);

create table if not exists public.grades (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.assessments(id),
  student_id uuid not null references public.students(id),
  score numeric(5,2),
  status public.grade_status not null default 'pending',
  notes text,
  recorded_by uuid references public.profiles(id),
  recorded_at timestamptz,
  unique (assessment_id, student_id),
  check (score is null or score >= 0)
);

create table if not exists public.task_status (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id),
  task_key text not null,
  status public.task_completion_status not null default 'pending',
  note text,
  recorded_by uuid references public.profiles(id),
  updated_at timestamptz not null default now(),
  unique (student_id, task_key)
);

create table if not exists public.observations (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id),
  author_id uuid not null references public.profiles(id),
  category text,
  body text not null,
  visibility public.observation_visibility not null default 'internal',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.guardian_messages (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id),
  guardian_id uuid not null references public.guardians(id),
  observation_id uuid references public.observations(id),
  channel public.message_channel not null default 'portal',
  subject text,
  body text not null,
  status public.message_status not null default 'draft',
  sent_at timestamptz,
  read_at timestamptz,
  provider_message_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.email_outbox (
  id uuid primary key default gen_random_uuid(),
  to_email citext not null,
  template text not null,
  payload jsonb not null default '{}'::jsonb,
  status public.email_status not null default 'pending',
  attempts int not null default 0,
  last_error text,
  scheduled_at timestamptz not null default now(),
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  check (attempts >= 0)
);

create table if not exists public.audit_log (
  id bigserial primary key,
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  before jsonb,
  after jsonb,
  ip inet,
  user_agent text,
  created_at timestamptz not null default now()
);

create table if not exists public.settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_by uuid references public.profiles(id),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles (role);
create index if not exists groups_teacher_idx on public.groups (teacher_id);
create index if not exists groups_year_idx on public.groups (academic_year_id);
create index if not exists students_group_idx on public.students (group_id);
create index if not exists student_guardians_guardian_idx on public.student_guardians (guardian_id);
create index if not exists privacy_consents_student_idx on public.privacy_consents (student_id);
create index if not exists units_subject_status_idx on public.units (subject_id, status);
create index if not exists unit_versions_unit_idx on public.unit_versions (unit_id);
create index if not exists unit_assignments_group_status_idx on public.unit_assignments (group_id, status);
create index if not exists unit_assignments_unit_idx on public.unit_assignments (unit_id);
create index if not exists overrides_student_idx on public.student_unit_overrides (student_id);
create index if not exists unit_progress_student_idx on public.unit_progress (student_id);
create index if not exists unit_progress_assignment_idx on public.unit_progress (assignment_id);
create index if not exists exercise_attempts_student_idx on public.exercise_attempts (student_id, created_at desc);
create index if not exists exercise_attempts_assignment_idx on public.exercise_attempts (assignment_id);
create index if not exists quiz_attempts_student_idx on public.quiz_attempts (student_id, created_at desc);
create index if not exists game_sessions_student_idx on public.game_sessions (student_id, created_at desc);
create index if not exists game_sessions_game_idx on public.game_sessions (game_id);
create index if not exists reading_assessments_student_idx on public.reading_assessments (student_id, created_at desc);
create index if not exists xp_events_student_idx on public.xp_events (student_id, created_at desc);
create index if not exists student_badges_badge_idx on public.student_badges (badge_id);
create index if not exists attendance_sessions_group_idx on public.attendance_sessions (group_id, session_date);
create index if not exists attendance_student_idx on public.attendance (student_id);
create index if not exists assessments_group_term_idx on public.assessments (group_id, term_id);
create index if not exists grades_student_idx on public.grades (student_id);
create index if not exists task_status_student_idx on public.task_status (student_id);
create index if not exists observations_student_idx on public.observations (student_id, created_at desc);
create index if not exists observations_visibility_idx on public.observations (visibility);
create index if not exists guardian_messages_student_idx on public.guardian_messages (student_id, created_at desc);
create index if not exists guardian_messages_guardian_idx on public.guardian_messages (guardian_id);
create index if not exists guardian_messages_status_idx on public.guardian_messages (status);
create index if not exists email_outbox_status_idx on public.email_outbox (status, scheduled_at);
create index if not exists audit_log_actor_idx on public.audit_log (actor_id, created_at desc);
create index if not exists audit_log_entity_idx on public.audit_log (entity_type, entity_id);
create index if not exists terms_year_idx on public.terms (academic_year_id, sort_order);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists groups_set_updated_at on public.groups;
create trigger groups_set_updated_at before update on public.groups
for each row execute function public.set_updated_at();

drop trigger if exists students_set_updated_at on public.students;
create trigger students_set_updated_at before update on public.students
for each row execute function public.set_updated_at();

drop trigger if exists guardians_set_updated_at on public.guardians;
create trigger guardians_set_updated_at before update on public.guardians
for each row execute function public.set_updated_at();

drop trigger if exists units_set_updated_at on public.units;
create trigger units_set_updated_at before update on public.units
for each row execute function public.set_updated_at();

drop trigger if exists unit_assignments_set_updated_at on public.unit_assignments;
create trigger unit_assignments_set_updated_at before update on public.unit_assignments
for each row execute function public.set_updated_at();

drop trigger if exists unit_progress_set_updated_at on public.unit_progress;
create trigger unit_progress_set_updated_at before update on public.unit_progress
for each row execute function public.set_updated_at();

drop trigger if exists student_stats_set_updated_at on public.student_stats;
create trigger student_stats_set_updated_at before update on public.student_stats
for each row execute function public.set_updated_at();

drop trigger if exists student_profiles_set_updated_at on public.student_profiles;
create trigger student_profiles_set_updated_at before update on public.student_profiles
for each row execute function public.set_updated_at();

drop trigger if exists attendance_set_updated_at on public.attendance;
create trigger attendance_set_updated_at before update on public.attendance
for each row execute function public.set_updated_at();

drop trigger if exists task_status_set_updated_at on public.task_status;
create trigger task_status_set_updated_at before update on public.task_status
for each row execute function public.set_updated_at();

drop trigger if exists observations_set_updated_at on public.observations;
create trigger observations_set_updated_at before update on public.observations
for each row execute function public.set_updated_at();

drop trigger if exists settings_set_updated_at on public.settings;
create trigger settings_set_updated_at before update on public.settings
for each row execute function public.set_updated_at();
