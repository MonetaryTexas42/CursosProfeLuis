-- 0010 · Sincronización del reproductor y canal de mensajes WhatsApp
--
-- 1) El reproductor del curso (curso/) sincroniza su estado local
--    (XP, racha, unidades completadas) hacia student_stats con esta RPC.
-- 2) Se habilita el canal 'whatsapp' para los avisos a tutores.

alter type public.message_channel add value if not exists 'whatsapp';

create or replace function public.app_sync_player_state(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
set row_security = off
as $$
declare
  v_student_id uuid;
  v_xp int := coalesce((p_payload ->> 'xp')::int, 0);
  v_streak int := coalesce((p_payload ->> 'racha')::int, 0);
  v_best int := coalesce((p_payload ->> 'best')::int, 0);
  v_done int := coalesce(jsonb_array_length(p_payload -> 'done'), 0);
  v_stats public.student_stats%rowtype;
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

  if v_xp < 0 or v_streak < 0 or v_best < 0 or v_done < 0 then
    raise exception 'Valores de progreso inválidos' using errcode = '22023';
  end if;

  select *
    into v_stats
    from public.student_stats
   where student_id = v_student_id;

  -- Registra el XP nuevo como evento (solo el delta positivo).
  if v_xp > coalesce(v_stats.xp_total, 0) then
    insert into public.xp_events (student_id, source_type, source_id, xp, reason)
    values (
      v_student_id,
      'player',
      null,
      v_xp - coalesce(v_stats.xp_total, 0),
      'Sincronización del reproductor'
    );
  end if;

  insert into public.student_stats (
    student_id, xp_total, current_streak, best_streak,
    units_completed, last_activity_date, updated_at
  )
  values (
    v_student_id, v_xp, v_streak, v_best, v_done, current_date, now()
  )
  on conflict (student_id) do update
    set xp_total = greatest(student_stats.xp_total, excluded.xp_total),
        current_streak = excluded.current_streak,
        best_streak = greatest(student_stats.best_streak, excluded.best_streak),
        units_completed = greatest(student_stats.units_completed, excluded.units_completed),
        last_activity_date = excluded.last_activity_date,
        updated_at = now();

  return jsonb_build_object('ok', true, 'xp', v_xp, 'streak', v_streak);
end;
$$;

revoke all on function public.app_sync_player_state(jsonb) from public;
grant execute on function public.app_sync_player_state(jsonb) to authenticated;
