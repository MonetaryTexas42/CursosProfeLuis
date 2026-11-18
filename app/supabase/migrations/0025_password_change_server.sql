-- 0025 · Cambio de contraseña verificado en el servidor (SEC-03)
--
-- La migración 0011 dejó una RPC que solo limpiaba la bandera
-- must_change_password. Cualquier usuario autenticado podía llamarla sin
-- cambiar la contraseña y conservar la temporal que el profesor conoce.
--
-- Ahora el cambio pasa por la Edge Function `complete-password-change`, que:
--   1. identifica al usuario por su JWT;
--   2. valida la política de contraseñas;
--   3. llama auth.admin.updateUserById(userId, { password });
--   4. solo entonces limpia la bandera y registra password_changed_at.
--
-- Esta migración elimina la RPC insegura. Sin ella, el perfil no tiene
-- política de UPDATE para el propio usuario, así que la bandera solo puede
-- limpiarla el servidor (service_role).
--
-- Criterio de aceptación:
--   - `app_complete_password_change` ya no existe en el esquema public.
--   - Un usuario autenticado no puede limpiar must_change_password por REST.
--   - Tras un cambio real, profiles.password_changed_at queda registrado.
--
-- Rollback: recrear la función desde 0011 y
--   alter table public.profiles drop column if exists password_changed_at;
--   -- No se recomienda: reabre el hallazgo.

alter table public.profiles
  add column if not exists password_changed_at timestamptz;

comment on column public.profiles.password_changed_at is
  'SEC-03: momento del último cambio de contraseña verificado en el servidor.';

drop function if exists public.app_complete_password_change();
