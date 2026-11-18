-- 0028 · Offboarding real: ban en Auth y rastro de la desactivación (SEC-04)
--
-- Antes de este cambio, `deactivate-user` solo ponía `profiles.active = false`.
-- El usuario seguía pudiendo autenticarse en Supabase Auth, refrescar su token
-- y conservar la sesión hasta que expirara. La app lo rechazaba después, pero
-- la identidad seguía viva.
--
-- Este cambio:
--   1. registra cuándo, quién y por qué se desactivó una cuenta;
--   2. deja que la Edge Function banee la cuenta en Auth al desactivar y la
--      desbanee al reactivar (auth.admin.updateUserById con ban_duration);
--   3. mantiene el historial completo en `audit_log`.
--
-- Criterio de aceptación:
--   - Un usuario desactivado no puede iniciar sesión ni refrescar el token.
--   - La reactivación es una acción explícita del admin y deja rastro.
--   - `profiles` conserva la fecha, el actor y el motivo de la desactivación.
--
-- Rollback:
--   alter table public.profiles
--     drop column if exists deactivation_reason,
--     drop column if exists deactivated_by,
--     drop column if exists deactivated_at;

alter table public.profiles
  add column if not exists deactivated_at timestamptz,
  add column if not exists deactivated_by uuid references public.profiles(id) on delete set null,
  add column if not exists deactivation_reason text;

do $$
begin
  if not exists (
    select 1
      from pg_constraint
     where conrelid = 'public.profiles'::regclass
       and conname = 'profiles_deactivation_reason_len'
  ) then
    alter table public.profiles
      add constraint profiles_deactivation_reason_len
      check (deactivation_reason is null or char_length(deactivation_reason) <= 400);
  end if;
end $$;

comment on column public.profiles.deactivated_at is
  'SEC-04: fecha de la última desactivación; null si la cuenta está activa.';
comment on column public.profiles.deactivated_by is
  'SEC-04: administrador que desactivó la cuenta.';
comment on column public.profiles.deactivation_reason is
  'SEC-04: motivo registrado al desactivar la cuenta.';
