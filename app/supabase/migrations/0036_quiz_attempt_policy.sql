-- 0036 · Política de intentos de quiz visible y aplicada (FUN-04)
--
-- `quiz_attempts` no tenía límite: se podía reintentar indefinidamente hasta
-- acertar y la precisión final siempre tendía a 100 %. Aquí se define una
-- política en `settings`, se aplica con un trigger antes de cada inserción
-- (cubre la RPC y cualquier otra vía de escritura) y se expone al cliente.
--
-- Configuración:
--   {"max_attempts": 3}   → 3 intentos por pregunta y unidad
--   {"max_attempts": 0}   → sin límite (útil para diagnóstico)
--
-- Rollback:
--   drop trigger if exists quiz_attempts_policy on public.quiz_attempts;
--   drop function if exists public.app_enforce_quiz_attempt_policy();
--   drop function if exists public.app_quiz_policy();
--   delete from public.settings where key = 'quiz_attempt_policy';

insert into public.settings (key, value)
values ('quiz_attempt_policy', '{"max_attempts":3}'::jsonb)
on conflict (key) do nothing;

create or replace function public.app_enforce_quiz_attempt_policy()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
set row_security = off
as $$
declare
  v_max int;
  v_used int;
begin
  select coalesce((value ->> 'max_attempts')::int, 3)
    into v_max
    from public.settings
   where key = 'quiz_attempt_policy';

  v_max := coalesce(v_max, 3);

  -- 0 significa "sin límite", explícitamente.
  if v_max <= 0 then
    return new;
  end if;

  select count(*)::int
    into v_used
    from public.quiz_attempts a
   where a.student_id = new.student_id
     and a.assignment_id = new.assignment_id
     and a.part = new.part
     and a.question_key = new.question_key;

  if v_used >= v_max then
    raise exception 'Has agotado los % intentos permitidos para esta pregunta', v_max
      using errcode = '22023';
  end if;

  return new;
end;
$$;

drop trigger if exists quiz_attempts_policy on public.quiz_attempts;
create trigger quiz_attempts_policy
  before insert on public.quiz_attempts
  for each row execute function public.app_enforce_quiz_attempt_policy();

comment on function public.app_enforce_quiz_attempt_policy() is
  'FUN-04: aplica el máximo de intentos por pregunta antes de insertar en quiz_attempts.';

create or replace function public.app_quiz_policy()
returns jsonb
language sql
stable
security definer
set search_path = public, pg_temp
set row_security = off
as $$
  select coalesce(
    (select value from public.settings where key = 'quiz_attempt_policy'),
    '{"max_attempts":3}'::jsonb
  );
$$;

revoke all on function public.app_quiz_policy() from public;
grant execute on function public.app_quiz_policy() to authenticated;

comment on function public.app_quiz_policy() is
  'FUN-04: expone la política de intentos al cliente para que la muestre antes de reintentar.';
