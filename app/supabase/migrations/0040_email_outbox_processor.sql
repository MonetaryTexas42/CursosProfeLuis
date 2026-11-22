-- 0040 · Procesador transaccional de email_outbox (SEC-06)
--
-- `invite-guardian` encola el mensaje, pero hasta ahora nadie lo entregaba.
-- Esta migración añade las RPCs que necesita la Edge Function
-- `process-email-outbox` para reclamar y cerrar filas de forma segura:
--
--   1. `app_claim_email_outbox` toma un lote con FOR UPDATE SKIP LOCKED y
--      incrementa `attempts` en la misma transacción. Dos workers no pueden
--      reclamar el mismo correo.
--   2. `app_complete_email_outbox` cierra el resultado (`sent`, `captured`,
--      `failed` o `retry`) y guarda un error truncado, sin payload ni enlaces.
--   3. `app_requeue_stale_email_outbox` devuelve a `pending` los mensajes que
--      un worker abandonó en `sending` tras un timeout.
--
-- Seguridad: las tres RPCs son SECURITY DEFINER con search_path fijo y solo se
-- conceden a `service_role`. La Edge Function exige además un token de cabecera,
-- de modo que un cliente con la anon key no puede invocarla.
--
-- Nota: `captured` significa "el proveedor log capturó el mensaje", no
-- "entregado". Sirve para probar el flujo sin enviar correo real. Nunca se
-- usa en producción con un proveedor real.
--
-- Rollback:
--   drop function public.app_requeue_stale_email_outbox(int, int);
--   drop function public.app_complete_email_outbox(uuid, text, text, text, timestamptz);
--   drop function public.app_claim_email_outbox(int, timestamptz);
--   alter table public.email_outbox drop column claimed_at, drop column provider_message_id;
--   alter type public.email_status drop value 'captured';  -- solo si no hay filas

alter type public.email_status add value if not exists 'captured';

alter table public.email_outbox
  add column if not exists claimed_at timestamptz,
  add column if not exists provider_message_id text;

comment on column public.email_outbox.claimed_at is
  'Momento en que un worker tomó la fila; permite recuperar envíos abandonados.';
comment on column public.email_outbox.provider_message_id is
  'Identificador devuelto por el proveedor de correo. Nunca contiene el enlace.';

-- ---------------------------------------------------------------------------
-- 1. Reclamo atómico de un lote
-- ---------------------------------------------------------------------------

create or replace function public.app_claim_email_outbox(
  p_limit int default 10,
  p_now timestamptz default now()
)
returns setof public.email_outbox
language plpgsql
security definer
set search_path = public, pg_temp
set row_security = off
as $$
declare
  v_limit int := least(greatest(coalesce(p_limit, 10), 1), 50);
begin
  return query
  with picked as (
    select e.id
      from public.email_outbox e
     where e.status = 'pending'::public.email_status
       and e.scheduled_at <= p_now
     order by e.scheduled_at, e.created_at, e.id
     for update skip locked
     limit v_limit
  )
  update public.email_outbox e
     set status = 'sending'::public.email_status,
         attempts = e.attempts + 1,
         claimed_at = p_now
    from picked
   where e.id = picked.id
  returning e.*;
end;
$$;

revoke all on function public.app_claim_email_outbox(int, timestamptz) from public, anon, authenticated;
grant execute on function public.app_claim_email_outbox(int, timestamptz) to service_role;

comment on function public.app_claim_email_outbox(int, timestamptz) is
  'SEC-06: reclama hasta 50 correos pendientes con FOR UPDATE SKIP LOCKED.';

-- ---------------------------------------------------------------------------
-- 2. Cierre del resultado
-- ---------------------------------------------------------------------------

create or replace function public.app_complete_email_outbox(
  p_id uuid,
  p_result text,
  p_provider_message_id text default null,
  p_error text default null,
  p_retry_at timestamptz default null
)
returns public.email_outbox
language plpgsql
security definer
set search_path = public, pg_temp
set row_security = off
as $$
declare
  v_row public.email_outbox;
begin
  if p_result not in ('sent', 'captured', 'failed', 'retry') then
    raise exception 'Resultado de correo no válido' using errcode = '22023';
  end if;

  update public.email_outbox e
     set status = case
                    when p_result = 'retry' then 'pending'::public.email_status
                    else p_result::public.email_status
                  end,
         sent_at = case
                     when p_result in ('sent', 'captured') then now()
                     else e.sent_at
                   end,
         claimed_at = null,
         provider_message_id = coalesce(p_provider_message_id, e.provider_message_id),
         last_error = case
                        when p_result in ('retry', 'failed') then left(p_error, 500)
                        else null
                      end,
         scheduled_at = case
                          when p_result = 'retry' then coalesce(p_retry_at, now() + interval '5 minutes')
                          else e.scheduled_at
                        end
   where e.id = p_id
     and e.status = 'sending'::public.email_status
  returning e.* into v_row;

  if not found then
    raise exception 'El correo no existe o no está en envío' using errcode = 'P0002';
  end if;

  return v_row;
end;
$$;

revoke all on function public.app_complete_email_outbox(uuid, text, text, text, timestamptz) from public, anon, authenticated;
grant execute on function public.app_complete_email_outbox(uuid, text, text, text, timestamptz) to service_role;

comment on function public.app_complete_email_outbox(uuid, text, text, text, timestamptz) is
  'SEC-06: cierra una fila reclamada. retry la devuelve a pending con backoff.';

-- ---------------------------------------------------------------------------
-- 3. Recuperación de envíos abandonados
-- ---------------------------------------------------------------------------

create or replace function public.app_requeue_stale_email_outbox(
  p_age_minutes int default 30,
  p_limit int default 50
)
returns int
language plpgsql
security definer
set search_path = public, pg_temp
set row_security = off
as $$
declare
  v_count int;
begin
  with stale as (
    select e.id
      from public.email_outbox e
     where e.status = 'sending'::public.email_status
       and coalesce(e.claimed_at, e.scheduled_at) < now() - make_interval(mins => p_age_minutes)
     order by coalesce(e.claimed_at, e.scheduled_at)
     limit least(greatest(coalesce(p_limit, 50), 1), 200)
     for update skip locked
  )
  update public.email_outbox e
     set status = 'pending'::public.email_status,
         claimed_at = null,
         scheduled_at = now(),
         last_error = left(coalesce(e.last_error, '') || ' · rehecho tras timeout', 500)
    from stale
   where e.id = stale.id;

  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

revoke all on function public.app_requeue_stale_email_outbox(int, int) from public, anon, authenticated;
grant execute on function public.app_requeue_stale_email_outbox(int, int) to service_role;

comment on function public.app_requeue_stale_email_outbox(int, int) is
  'SEC-06: devuelve a pending los correos en sending abandonados por un worker.';
