-- 0034 · XP calculado en servidor desde eventos (DB-03, COD-02)
--
-- Antes de este cambio, `app_sync_player_state` aceptaba `xp`, `racha`, `best`
-- y `done` del navegador y registraba como evento la diferencia. Un cliente
-- modificado podía declarar XP arbitrario y la base lo aceptaba.
--
-- Este cambio:
--   1. emite XP desde el servidor cuando un ejercicio es correcto (+5) y
--      cuando una unidad se completa o domina (+25), una sola vez por evento;
--   2. unique parcial en `xp_events` para que un reintento no duplique XP;
--   3. reescribe `app_sync_player_state` para ignorar los números del cliente:
--      `xp_total` es la suma de eventos y `units_completed` se deriva de
--      `unit_progress`. Las rachas se conservan, no se aceptan del cliente.
--
-- Nota de despliegue: el primer sync tras aplicar esta migración sustituye el
-- XP heredado por el XP con eventos verificables. Si se decide conservar el
-- histórico, se debe hacer una reconciliación explícita y auditada antes del
-- despliegue; no se hace automáticamente porque reintroduciría el riesgo.
--
-- Rollback:
--   drop trigger if exists exercise_attempts_award_xp on public.exercise_attempts;
--   drop trigger if exists unit_progress_award_xp on public.unit_progress;
--   drop function if exists public.app_award_server_xp();
--   drop index if exists public.xp_events_source_uq;
--   Restaurar app_sync_player_state desde 0010 (reabre DB-03).

-- Solo las fuentes nuevas tienen llave única: los eventos heredados de 0010
-- pueden repetir `source_id` y no deben impedir aplicar la migración.
create unique index if not exists xp_events_source_uq
  on public.xp_events (source_type, source_id)
 where source_type in ('exercise', 'unit') and source_id is not null;

comment on index public.xp_events_source_uq is
  'DB-03: un premio de XP por ejercicio/unidad; evita duplicar reintentos sin tocar eventos heredados.';

create or replace function public.app_award_server_xp()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
set row_security = off
as $$
declare
  v_new_completion boolean;
begin
  if tg_table_name = 'exercise_attempts' then
    if new.is_correct then
      insert into public.xp_events (student_id, source_type, source_id, xp, reason)
      values (new.student_id, 'exercise', new.id::text, 5, 'Ejercicio respondido correctamente')
      on conflict (source_type, source_id)
        where source_type in ('exercise', 'unit') and source_id is not null
        do nothing;
    end if;
  elsif tg_table_name = 'unit_progress' then
    if tg_op = 'INSERT' then
      v_new_completion := new.status in ('completed'::public.progress_status, 'mastered'::public.progress_status);
    else
      v_new_completion := new.status in ('completed'::public.progress_status, 'mastered'::public.progress_status)
        and old.status not in ('completed'::public.progress_status, 'mastered'::public.progress_status);
    end if;

    if v_new_completion then
      insert into public.xp_events (student_id, source_type, source_id, xp, reason)
      values (new.student_id, 'unit', new.id::text, 25, 'Unidad completada')
      on conflict (source_type, source_id)
        where source_type in ('exercise', 'unit') and source_id is not null
        do nothing;
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists exercise_attempts_award_xp on public.exercise_attempts;
create trigger exercise_attempts_award_xp
  after insert on public.exercise_attempts
  for each row execute function public.app_award_server_xp();

drop trigger if exists unit_progress_award_xp on public.unit_progress;
create trigger unit_progress_award_xp
  after insert or update of status on public.unit_progress
  for each row execute function public.app_award_server_xp();

comment on function public.app_award_server_xp() is
  'DB-03: premia en servidor los ejercicios correctos y las unidades completadas, una sola vez por origen.';

-- ---------------------------------------------------------------------------
-- Sincronización del reproductor: el cliente solo observa
-- ---------------------------------------------------------------------------

create or replace function public.app_sync_player_state(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
set row_security = off
as $$
declare
  v_student_id uuid;
  v_xp int;
  v_units int;
  v_streak int;
  v_best int;
begin
  if auth.uid() is null then
    raise exception 'No autenticado' using errcode = '42501';
  end if;

  select s.id
    into v_student_id
    from public.students s
   where s.profile_id = auth.uid()
     and s.status = 'active'::public.student_status;

  if v_student_id is null then
    raise exception 'Solo alumnos activos pueden sincronizar progreso' using errcode = '42501';
  end if;

  -- Los campos xp/racha/best/done del payload se ignoran a propósito.
  select coalesce(sum(e.xp), 0)::int
    into v_xp
    from public.xp_events e
   where e.student_id = v_student_id;

  select count(distinct p.unit_id)::int
    into v_units
    from public.unit_progress p
   where p.student_id = v_student_id
     and p.status in ('completed'::public.progress_status, 'mastered'::public.progress_status);

  select coalesce(s.current_streak, 0), coalesce(s.best_streak, 0)
    into v_streak, v_best
    from public.student_stats s
   where s.student_id = v_student_id;

  insert into public.student_stats (
    student_id, xp_total, current_streak, best_streak,
    units_completed, last_activity_date, updated_at
  )
  values (
    v_student_id, v_xp, coalesce(v_streak, 0), coalesce(v_best, 0),
    v_units, current_date, now()
  )
  on conflict (student_id) do update
    set xp_total = excluded.xp_total,
        units_completed = greatest(public.student_stats.units_completed, excluded.units_completed),
        last_activity_date = excluded.last_activity_date,
        updated_at = now();

  return jsonb_build_object(
    'ok', true,
    'xp', v_xp,
    'streak', coalesce(v_streak, 0),
    'units_completed', v_units,
    'source', 'server'
  );
end;
$$;

revoke all on function public.app_sync_player_state(jsonb) from public;
grant execute on function public.app_sync_player_state(jsonb) to authenticated;

comment on function public.app_sync_player_state(jsonb) is
  'DB-03: sincroniza el estado del reproductor usando XP calculado en servidor; ignora xp/racha/best/done del cliente.';
