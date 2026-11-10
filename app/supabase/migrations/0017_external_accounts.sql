-- 0017 · Vincular cuentas existentes y detección de cuentas externas
--
-- 1) app_link_student_account(): vincula una cuenta de auth ya existente
--    (autorregistro) a un alumno del grupo, sin duplicar su acceso.
--    El alumno entrará con su correo en la pestaña "Alumno".
-- 2) app_external_accounts(): cuentas de auth sin perfil (colados).
-- 3) app_ban_account(): bloquea o desbloquea una cuenta de auth sin perfil.

-- 1) Vinculación de una cuenta existente a un alumno del grupo.
create or replace function public.app_link_student_account(
  p_email text,
  p_full_name text,
  p_group_id uuid,
  p_student_code text default null,
  p_username text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
set row_security = off
as $$
declare
  v_user_id uuid;
  v_email text;
  v_email_confirmed_at timestamptz;
  v_existing_role public.user_role;
  v_username text;
  v_candidate text;
  v_attempt int := 0;
  v_student_code text;
  v_profile_id uuid;
  v_student_id uuid;
begin
  if auth.uid() is null then
    raise exception 'No autenticado' using errcode = '42501';
  end if;

  if not (public.app_is_admin() or public.app_is_teacher_of_group(p_group_id)) then
    raise exception 'No tienes permiso para dar de alta en este grupo' using errcode = '42501';
  end if;

  v_email := lower(trim(coalesce(p_email, '')));
  if v_email = '' or v_email !~ '^[^@]+@[^@]+\.[^@]+$' then
    raise exception 'Escribe un correo válido' using errcode = '22023';
  end if;

  select u.id, u.email, u.email_confirmed_at
    into v_user_id, v_email, v_email_confirmed_at
    from auth.users u
   where lower(u.email) = v_email
   order by u.created_at
   limit 1;

  if v_user_id is null then
    raise exception 'No existe una cuenta con ese correo. Dale de alta con usuario y contraseña temporal.'
      using errcode = 'P0002';
  end if;

  select p.role
    into v_existing_role
    from public.profiles p
   where p.id = v_user_id;

  if v_existing_role is not null then
    raise exception 'Esa cuenta ya tiene un perfil en la plataforma (%). Usa la pestaña Usuarios si necesitas reactivarla.',
      v_existing_role using errcode = 'P0002';
  end if;

  -- Usuario: el que indique el profesor o generado del nombre.
  if p_username is not null and trim(p_username) <> '' then
    v_username := lower(trim(p_username));
  else
    v_username := lower(regexp_replace(
      translate(trim(p_full_name), 'ÁÉÍÓÚÜÑáéíóúüñ', 'AEIOUUNaeiouun'),
      '[^a-z0-9]+', '.', 'g'
    ));
    v_username := trim(v_username, '.');
  end if;

  if v_username = '' then
    v_username := 'alumno';
  end if;

  v_username := left(v_username, 32);

  v_candidate := v_username;
  loop
    exit when not exists (
      select 1 from public.profiles p where p.username = v_candidate
    );
    v_attempt := v_attempt + 1;
    if v_attempt > 50 then
      raise exception 'No se pudo generar un usuario libre' using errcode = '23505';
    end if;
    v_candidate := left(v_username, 32 - length('.' || v_attempt)) || '.' || v_attempt;
  end loop;
  v_username := v_candidate;

  v_student_code := upper(trim(coalesce(p_student_code, '')));
  if v_student_code = '' then
    v_student_code := upper(v_username);
  end if;

  if exists (select 1 from public.students s where s.student_code = v_student_code) then
    raise exception 'La matrícula % ya existe', v_student_code using errcode = '23505';
  end if;

  insert into public.profiles (id, role, full_name, username, email, active, must_change_password)
  values (v_user_id, 'student'::public.user_role, trim(p_full_name), v_username, v_email, true, false)
  returning id into v_profile_id;

  insert into public.students (profile_id, group_id, student_code, status)
  values (v_profile_id, p_group_id, v_student_code, 'active'::public.student_status)
  returning id into v_student_id;

  return jsonb_build_object(
    'ok', true,
    'profile_id', v_profile_id,
    'student_id', v_student_id,
    'username', v_username,
    'student_code', v_student_code,
    'email', v_email,
    'email_confirmed', (v_email_confirmed_at is not null)
  );
exception
  when others then
    if v_profile_id is not null then
      delete from public.profiles where id = v_profile_id;
    end if;
    raise;
end;
$$;

-- 2) Cuentas de auth sin perfil en la plataforma (colados).
--    Solo el administrador obtiene filas; el resto ve la lista vacía.
create or replace function public.app_external_accounts()
returns table (
  id uuid,
  email text,
  created_at timestamptz,
  last_sign_in_at timestamptz,
  email_confirmed boolean,
  banned boolean
)
language sql
stable
security definer
set search_path = public, pg_temp
set row_security = off
as $$
  select u.id,
         u.email,
         u.created_at,
         u.last_sign_in_at,
         (u.email_confirmed_at is not null) as email_confirmed,
         (u.banned_until is not null and u.banned_until > now()) as banned
    from auth.users u
   where public.app_is_admin()
     and u.email is not null
     and not exists (select 1 from public.profiles p where p.id = u.id)
   order by u.created_at desc;
$$;

-- 3) Bloquear o desbloquear una cuenta de auth sin perfil.
create or replace function public.app_ban_account(p_user_id uuid, p_ban boolean default true)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
set row_security = off
as $$
declare
  v_exists boolean;
begin
  if auth.uid() is null then
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

  update auth.users
     set banned_until = case when p_ban then now() + interval '100 years' else null end
   where id = p_user_id;

  return jsonb_build_object('ok', true, 'user_id', p_user_id, 'banned', p_ban);
end;
$$;

revoke all on function public.app_link_student_account(text, text, uuid, text, text) from public;
revoke all on function public.app_external_accounts() from public;
revoke all on function public.app_ban_account(uuid, boolean) from public;
grant execute on function public.app_link_student_account(text, text, uuid, text, text) to authenticated;
grant execute on function public.app_external_accounts() to authenticated;
grant execute on function public.app_ban_account(uuid, boolean) to authenticated;

comment on function public.app_link_student_account(text, text, uuid, text, text) is
  'Vincula una cuenta de auth existente a un alumno del grupo (para autorregistros), sin duplicar su acceso.';
comment on function public.app_external_accounts() is
  'Lista cuentas de auth sin perfil en la plataforma (solo el administrador ve filas).';
comment on function public.app_ban_account(uuid, boolean) is
  'Bloquea o desbloquea una cuenta de auth sin perfil (solo administrador).';
