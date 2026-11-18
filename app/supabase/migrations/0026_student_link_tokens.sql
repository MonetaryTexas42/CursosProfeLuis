-- 0026 · Vinculación de alumnos con tokens de un solo uso (SEC-02)
--
-- La migración 0019 dejó `app_link_student_account`: una función
-- SECURITY DEFINER que cualquier profesor podía ejecutar, que buscaba una
-- cuenta por correo y **forzaba** `auth.users.email_confirmed_at`. No había
-- prueba de que quien controlaba esa cuenta fuera el alumno o su tutor.
--
-- Este cambio:
--   1. elimina la RPC y, con ella, la escritura directa en `auth.users`;
--   2. crea `student_link_tokens`, que guarda solo el hash SHA-256 del token;
--   3. deja la tabla sin políticas para `authenticated`/`anon`: solo el
--      service_role de las Edge Functions puede leerla o escribirla;
--   4. exige que la emisión y el canje pasen por funciones auditadas.
--
-- Flujo nuevo:
--   - El profesor o admin llama a `issue-student-link-token`. La función crea
--     la cuenta con una contraseña aleatoria que nunca se devuelve, crea la
--     ficha del alumno y emite un token de 72 h.
--   - La familia abre el enlace y elige su contraseña en
--     `redeem-student-link-token`. El token se marca usado de forma atómica.
--   - Emisión y canje quedan en `audit_log`; el token en claro nunca se guarda
--     ni se audita.
--
-- Criterio de aceptación:
--   - `app_link_student_account` ya no existe.
--   - Ningún rol de aplicación puede leer `token_hash` por PostgREST.
--   - Un token usado, revocado o vencido no se puede canjear dos veces.
--
-- Rollback: volver a aplicar 0019 y
--   drop table if exists public.student_link_tokens;
--   -- No se recomienda: reabre el hallazgo.

create table if not exists public.student_link_tokens (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  token_hash text not null unique,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  used_at timestamptz,
  used_by uuid references public.profiles(id),
  revoked_at timestamptz,
  constraint student_link_tokens_hash_format check (token_hash ~ '^[0-9a-f]{64}$'),
  constraint student_link_tokens_expiry check (expires_at > created_at)
);

create index if not exists student_link_tokens_student_idx
  on public.student_link_tokens (student_id, created_at desc);

create index if not exists student_link_tokens_pending_idx
  on public.student_link_tokens (expires_at)
  where used_at is null and revoked_at is null;

alter table public.student_link_tokens enable row level security;

-- Sin políticas: RLS devuelve 0 filas a cualquier usuario de la aplicación.
-- El service_role de las Edge Functions omite RLS y es el único que opera.
revoke all on public.student_link_tokens from public;
revoke all on public.student_link_tokens from anon, authenticated;
grant select on public.student_link_tokens to authenticated;
grant all on public.student_link_tokens to service_role;

comment on table public.student_link_tokens is
  'SEC-02: tokens de un solo uso para que el alumno elija su contraseña. Solo se guarda el hash SHA-256.';
comment on column public.student_link_tokens.token_hash is
  'SHA-256 hexadecimal del token. El valor en claro se entrega una vez y no se persiste.';
comment on column public.student_link_tokens.expires_at is
  'Vigencia de 72 h desde la emisión; el canje la vuelve a comprobar.';

drop function if exists public.app_link_student_account(text, text, uuid, text, text);
