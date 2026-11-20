-- 0037 · Canal ARCO y registro de solicitudes (PRIV-06)
--
-- El aviso de privacidad enumeraba los derechos ARCO pero no ofrecía canal
-- ni dejaba evidencia de la solicitud. Esta migración crea el registro,
-- políticas de propietario/admin y las RPCs de alta y resolución.
--
-- El correo de contacto se configura en `settings` (`data_request_email`).
-- mientras esté vacío, la interfaz debe mostrar el placeholder del aviso y
-- no inventar una dirección.
--
-- Rollback:
--   drop function if exists public.app_resolve_data_request(uuid, text, text);
--   drop function if exists public.app_create_data_request(text, text, uuid);
--   drop table if exists public.data_requests;
--   delete from public.settings where key in ('data_request_sla_days','data_request_email');
-- No se recobran las solicitudes ya registradas: son evidencia.

insert into public.settings (key, value)
values
  ('data_request_sla_days', to_jsonb(20)),
  ('data_request_email', to_jsonb(''::text))
on conflict (key) do nothing;

create table if not exists public.data_requests (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  guardian_id uuid references public.guardians(id) on delete set null,
  student_id uuid references public.students(id) on delete set null,
  kind text not null check (
    kind in ('access', 'rectification', 'cancellation', 'opposition', 'portability', 'revocation')
  ),
  details text,
  status text not null default 'received' check (
    status in ('received', 'in_progress', 'resolved', 'rejected')
  ),
  received_at timestamptz not null default now(),
  due_at timestamptz not null,
  resolved_at timestamptz,
  resolution text,
  metadata jsonb not null default '{}'::jsonb,
  check (details is null or length(details) <= 2000),
  check (resolution is null or length(resolution) <= 2000),
  check (due_at >= received_at)
);

create index if not exists data_requests_status_due_idx
  on public.data_requests (status, due_at);

alter table public.data_requests enable row level security;

drop policy if exists data_requests_select_own on public.data_requests;
create policy data_requests_select_own
on public.data_requests for select to authenticated
using (
  profile_id = auth.uid()
  or student_id = public.app_student_id()
  or guardian_id in (
    select g.id from public.guardians g where g.profile_id = auth.uid()
  )
);

drop policy if exists data_requests_insert_own on public.data_requests;
create policy data_requests_insert_own
on public.data_requests for insert to authenticated
with check (
  profile_id = auth.uid()
  or student_id = public.app_student_id()
  or guardian_id in (
    select g.id from public.guardians g where g.profile_id = auth.uid()
  )
);

drop policy if exists data_requests_admin_all on public.data_requests;
create policy data_requests_admin_all
on public.data_requests for all to authenticated
using (public.app_is_admin())
with check (public.app_is_admin());

revoke all on public.data_requests from public, anon;
grant select, insert, update on public.data_requests to authenticated;

comment on table public.data_requests is
  'PRIV-06: solicitudes ARCO con fecha de recepción, plazo y resolución; sin borrado para conservar evidencia.';

-- ---------------------------------------------------------------------------
-- Alta de solicitudes
-- ---------------------------------------------------------------------------

create or replace function public.app_create_data_request(
  p_kind text,
  p_details text default null,
  p_student_id uuid default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
set row_security = off
as $$
declare
  v_actor uuid := auth.uid();
  v_profile_id uuid;
  v_guardian_id uuid;
  v_student_id uuid;
  v_days int;
  v_due timestamptz;
  v_id uuid;
begin
  if v_actor is null then
    raise exception 'No autenticado' using errcode = '42501';
  end if;

  if p_kind not in ('access', 'rectification', 'cancellation', 'opposition', 'portability', 'revocation') then
    raise exception 'El tipo de solicitud no es válido' using errcode = '22023';
  end if;

  if p_details is not null and length(btrim(p_details)) > 2000 then
    raise exception 'Los detalles son demasiado largos' using errcode = '22023';
  end if;

  if exists (select 1 from public.profiles p where p.id = v_actor) then
    v_profile_id := v_actor;
  end if;

  select g.id into v_guardian_id
    from public.guardians g
   where g.profile_id = v_actor;

  v_student_id := public.app_student_id();

  if p_student_id is not null then
    if not (
      public.app_is_admin()
      or public.app_is_guardian_of(p_student_id)
    ) then
      raise exception 'No puedes solicitar datos de ese alumno' using errcode = '42501';
    end if;
    v_student_id := p_student_id;
  end if;

  if v_profile_id is null and v_guardian_id is null and v_student_id is null then
    raise exception 'No se pudo identificar al solicitante' using errcode = '42501';
  end if;

  v_days := coalesce(
    nullif((select value #>> '{}' from public.settings where key = 'data_request_sla_days'), '')::int,
    20
  );

  if v_days < 1 or v_days > 90 then
    v_days := 20;
  end if;

  v_due := now() + (interval '1 day' * v_days);

  insert into public.data_requests (
    profile_id, guardian_id, student_id, kind, details, due_at, metadata
  )
  values (
    v_profile_id, v_guardian_id, v_student_id, p_kind, nullif(btrim(coalesce(p_details, '')), ''),
    v_due,
    jsonb_build_object('channel', 'portal', 'sla_days', v_days)
  )
  returning id into v_id;

  insert into public.audit_log (actor_id, action, entity_type, entity_id, after)
  values (
    v_actor,
    'data_request.received',
    'data_request',
    v_id::text,
    jsonb_build_object('kind', p_kind, 'due_at', v_due, 'sla_days', v_days)
  );

  return jsonb_build_object(
    'ok', true,
    'request_id', v_id,
    'due_at', v_due,
    'sla_days', v_days
  );
end;
$$;

revoke all on function public.app_create_data_request(text, text, uuid) from public;
grant execute on function public.app_create_data_request(text, text, uuid) to authenticated;

comment on function public.app_create_data_request(text, text, uuid) is
  'PRIV-06: registra una solicitud ARCO con plazo y evidencia en audit_log.';

-- ---------------------------------------------------------------------------
-- Resolución (solo administrador)
-- ---------------------------------------------------------------------------

create or replace function public.app_resolve_data_request(
  p_request_id uuid,
  p_status text,
  p_resolution text
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
set row_security = off
as $$
declare
  v_actor uuid := auth.uid();
  v_before jsonb;
begin
  if v_actor is null or not public.app_is_admin() then
    raise exception 'Solo el administrador puede resolver solicitudes' using errcode = '42501';
  end if;

  if p_status not in ('in_progress', 'resolved', 'rejected') then
    raise exception 'El estado no es válido' using errcode = '22023';
  end if;

  if p_resolution is null or length(btrim(p_resolution)) < 10 or length(p_resolution) > 2000 then
    raise exception 'La resolución debe tener entre 10 y 2000 caracteres'
      using errcode = '22023';
  end if;

  select to_jsonb(r) into v_before
    from public.data_requests r
   where r.id = p_request_id;

  if v_before is null then
    raise exception 'La solicitud no existe' using errcode = 'P0002';
  end if;

  update public.data_requests
     set status = p_status,
         resolution = p_resolution,
         resolved_at = case when p_status in ('resolved', 'rejected') then now() else null end,
         metadata = metadata || jsonb_build_object('resolved_by', v_actor)
   where id = p_request_id;

  insert into public.audit_log (actor_id, action, entity_type, entity_id, before, after)
  values (
    v_actor,
    'data_request.' || p_status,
    'data_request',
    p_request_id::text,
    v_before,
    jsonb_build_object('status', p_status, 'resolution', p_resolution)
  );

  return jsonb_build_object('ok', true, 'request_id', p_request_id, 'status', p_status);
end;
$$;

revoke all on function public.app_resolve_data_request(uuid, text, text) from public;
grant execute on function public.app_resolve_data_request(uuid, text, text) to authenticated;

comment on function public.app_resolve_data_request(uuid, text, text) is
  'PRIV-06: resuelve una solicitud ARCO y registra actor, antes y después en audit_log.';
