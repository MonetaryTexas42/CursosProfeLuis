-- 0038 · Auditoría de baneos administrativos (SEC-07)
--
-- `deactivate-user` (0028/SEC-04) ya audita los baneos de cuentas con perfil.
-- La RPC `app_ban_account`, usada para cuentas externas sin perfil, no dejaba
-- rastro. Esta migración envuelve la actualización de `auth.users` con un
-- registro en `audit_log` con actor, acción y estado anterior/posterior.
--
-- Límites que deben quedar documentados (ver docs/seguridad.md):
--   - `ban_duration = 876000h` bloquea nuevos logins y refresh, pero no
--     revoca un access_token ya emitido;
--   - `config.toml` fija `jwt_expiry = 3600` (1 h);
--   - para incidentes graves hay que cerrar sesiones en Auth además de banear.
--
-- Rollback: restaurar `app_ban_account` desde 0017 (reabre SEC-07).

create or replace function public.app_ban_account(p_user_id uuid, p_ban boolean default true)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
set row_security = off
as $$
declare
  v_actor uuid := auth.uid();
  v_exists boolean;
  v_before timestamptz;
  v_after timestamptz;
begin
  if v_actor is null then
    raise exception 'No autenticado' using errcode = '42501';
  end if;

  if not public.app_is_admin() then
    raise exception 'Solo el administrador puede bloquear cuentas' using errcode = '42501';
  end if;

  select exists (
    select 1
      from auth.users u
     where u.id = p_user_id
       and not exists (select 1 from public.profiles p where p.id = u.id)
  ) into v_exists;

  if not v_exists then
    raise exception 'La cuenta no existe o ya tiene un perfil en la plataforma' using errcode = 'P0002';
  end if;

  select u.banned_until into v_before
    from auth.users u
   where u.id = p_user_id;

  v_after := case when p_ban then now() + interval '100 years' else null end;

  update auth.users
     set banned_until = v_after
   where id = p_user_id;

  insert into public.audit_log (actor_id, action, entity_type, entity_id, before, after)
  values (
    v_actor,
    case when p_ban then 'user.banned' else 'user.unbanned' end,
    'auth_user',
    p_user_id::text,
    jsonb_build_object('banned_until', v_before),
    jsonb_build_object('banned_until', v_after)
  );

  return jsonb_build_object(
    'ok', true,
    'user_id', p_user_id,
    'banned', p_ban,
    'audited', true
  );
end;
$$;

revoke all on function public.app_ban_account(uuid, boolean) from public;
grant execute on function public.app_ban_account(uuid, boolean) to authenticated;

comment on function public.app_ban_account(uuid, boolean) is
  'SEC-07: bloquea/desbloquea cuentas externas y registra actor y estado anterior/posterior en audit_log.';
