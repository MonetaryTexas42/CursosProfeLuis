-- 0011 · Cambio obligatorio de contraseña en el primer ingreso
--
-- El alumno cambia su contraseña con la API de Auth y esta RPC confirma
-- el cambio limpiando la bandera must_change_password del perfil.

create or replace function public.app_complete_password_change()
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
set row_security = off
as $$
declare
  v_profile_id uuid := auth.uid();
begin
  if v_profile_id is null then
    raise exception 'No autenticado' using errcode = '42501';
  end if;

  update public.profiles p
     set must_change_password = false,
         updated_at = now()
   where p.id = v_profile_id;

  if not found then
    raise exception 'No se pudo completar el cambio de contraseña' using errcode = '42501';
  end if;

  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function public.app_complete_password_change() from public;
grant execute on function public.app_complete_password_change() to authenticated;
