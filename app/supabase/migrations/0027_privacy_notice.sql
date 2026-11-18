-- 0027 · Aviso de privacidad, evidencia del consentimiento y bloqueo del tutor (PRIV-01)
--
-- Antes de este cambio:
--   - El botón "Aceptar aviso de privacidad" no enlazaba a ningún documento.
--   - `privacy_consents.metadata` solo guardaba el nombre y el canal, no qué
--     texto se aceptó.
--   - El panel del tutor mostraba los datos del alumno antes de aceptar.
--   - No había forma de revocar desde el panel.
--
-- Este cambio:
--   1. publica la versión y la URL del aviso en `settings` y las expone en la
--      vista pública `privacy_document` (sin datos personales);
--   2. crea `app_guardian_has_consent`, que exige un consentimiento activo de
--      la versión vigente para el tutor autenticado;
--   3. aplica ese requisito a las políticas de lectura del tutor: alumno,
--      perfil, grupo, finanzas, mensajes y todas las tablas que usan
--      `app_can_access_student`;
--   4. deja visibles `student_guardians` y `privacy_consents` para que el tutor
--      pueda ver sus vínculos y aceptar o revocar sin ver datos del alumno.
--
-- La Edge Function `guardian-consent` guarda `document_url`, `document_hash`,
-- `accepted_by` y el acuse de lectura en `privacy_consents.metadata`.
--
-- Importante: esta migración sube la versión vigente a `v2-2026`. Los
-- consentimientos de versiones anteriores dejan de ser vigentes y el tutor
-- deberá aceptar el aviso nuevo. Aplicar junto con el despliegue de
-- `privacidad.html` y de la Edge Function actualizada.
--
-- Rollback: restaurar las funciones de `0003_rls.sql` y `0021_billing_guard.sql`,
--   eliminar la vista `privacy_document`, `app_guardian_has_consent` y
--   `app_setting_text`, y volver a la versión anterior en `settings`. No se
--   recomienda: reabre PRIV-01.

-- ---------------------------------------------------------------------------
-- 1. Lectura controlada de un ajuste de texto
-- ---------------------------------------------------------------------------

create or replace function public.app_setting_text(p_key text)
returns text
language sql
stable
security definer
set search_path = public, pg_temp
set row_security = off
as $$
  select case
    when value is null then null
    when jsonb_typeof(value) = 'string' then value #>> '{}'
    else value ->> p_key
  end
  from public.settings
  where key = p_key;
$$;

revoke all on function public.app_setting_text(text) from public;

comment on function public.app_setting_text(text) is
  'PRIV-01: lee un ajuste de texto sin exponer la tabla settings. Solo para uso interno de funciones y vistas.';

-- ---------------------------------------------------------------------------
-- 2. ¿El tutor autenticado tiene consentimiento vigente para este alumno?
-- ---------------------------------------------------------------------------

create or replace function public.app_guardian_has_consent(p_student_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
set row_security = off
as $$
  select exists (
    select 1
    from public.privacy_consents pc
    join public.guardians g on g.id = pc.guardian_id
    where pc.student_id = p_student_id
      and g.profile_id = auth.uid()
      and g.active
      and pc.revoked_at is null
      and pc.document_version = public.app_setting_text('privacy_document_version')
  );
$$;

revoke all on function public.app_guardian_has_consent(uuid) from public;
grant execute on function public.app_guardian_has_consent(uuid) to authenticated;

comment on function public.app_guardian_has_consent(uuid) is
  'PRIV-01: verdadero solo si el tutor autenticado aceptó la versión vigente del aviso para ese alumno.';

-- ---------------------------------------------------------------------------
-- 3. Políticas de lectura del tutor: sin consentimiento, sin datos del alumno
-- ---------------------------------------------------------------------------

create or replace function public.app_can_access_student(p_student_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
set row_security = off
as $$
  select public.app_is_admin()
    or public.app_is_teacher_of_student(p_student_id)
    or public.app_is_own_student(p_student_id)
    or (
      public.app_is_guardian_of(p_student_id)
      and public.app_guardian_has_consent(p_student_id)
    );
$$;

create or replace function public.app_guardian_has_student_in_group(p_group_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
set row_security = off
as $$
  select exists (
    select 1
    from public.student_guardians sg
    join public.guardians g on g.id = sg.guardian_id
    join public.students s on s.id = sg.student_id
    where s.group_id = p_group_id
      and g.profile_id = auth.uid()
      and g.active
      and s.status = 'active'::public.student_status
      and public.app_guardian_has_consent(s.id)
  );
$$;

create or replace function public.app_can_view_profile(p_profile_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
set row_security = off
as $$
  select public.app_is_admin()
    or p_profile_id = auth.uid()
    or exists (
      select 1
      from public.students s
      join public.groups g on g.id = s.group_id
      where s.profile_id = p_profile_id
        and g.teacher_id = auth.uid()
    )
    or exists (
      select 1
      from public.students s
      where s.profile_id = p_profile_id
        and public.app_is_guardian_of(s.id)
        and public.app_guardian_has_consent(s.id)
    )
    or exists (
      select 1
      from public.guardians gu
      join public.student_guardians sg on sg.guardian_id = gu.id
      where gu.profile_id = p_profile_id
        and public.app_is_own_student(sg.student_id)
    )
    or exists (
      select 1
      from public.guardians gu
      join public.student_guardians sg on sg.guardian_id = gu.id
      where gu.profile_id = p_profile_id
        and public.app_is_guardian_of(sg.student_id)
        and public.app_guardian_has_consent(sg.student_id)
    );
$$;

create or replace function public.app_can_view_billing(p_student_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
set row_security = off
as $$
  select public.app_is_admin()
    or public.app_is_teacher_of_student(p_student_id)
    or (
      public.app_is_guardian_of(p_student_id)
      and public.app_guardian_has_consent(p_student_id)
    );
$$;

revoke all on function public.app_can_view_billing(uuid) from public;
grant execute on function public.app_can_view_billing(uuid) to authenticated;

comment on function public.app_can_view_billing(uuid) is
  'PRIV-01: finanzas visibles solo para el personal y para el tutor con consentimiento vigente.';

-- El consentimiento solo lo registra la Edge Function `guardian-consent` con
-- service_role, que valida versión, hash, vínculo y acuse de lectura. Si se
-- dejara la política de inserción del tutor, podría fabricar un consentimiento
-- por PostgREST sin evidencia. Se elimina.
drop policy if exists privacy_consents_guardian_insert on public.privacy_consents;

drop policy if exists guardian_messages_select on public.guardian_messages;
create policy guardian_messages_select
on public.guardian_messages for select to authenticated
using (
  public.app_is_admin()
  or public.app_is_teacher_of_student(student_id)
  or (
    public.app_is_own_guardian(guardian_id)
    and public.app_guardian_has_consent(student_id)
  )
);

-- ---------------------------------------------------------------------------
-- 4. Vista pública del aviso: versión, URL y hash, sin datos personales
-- ---------------------------------------------------------------------------

create or replace view public.privacy_document as
select
  coalesce(public.app_setting_text('privacy_document_version'), '') as version,
  coalesce(public.app_setting_text('privacy_document_url'), '/privacidad.html') as url,
  coalesce(public.app_setting_text('privacy_document_sha256'), '') as sha256,
  coalesce(
    (select updated_at from public.settings where key = 'privacy_document_version'),
    now()
  ) as updated_at;

comment on view public.privacy_document is
  'PRIV-01: versión, URL y hash del aviso vigente. Lectura pública; no contiene datos personales.';

revoke all on public.privacy_document from public;
grant select on public.privacy_document to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 5. Valores vigentes del aviso (v2-2026)
-- ---------------------------------------------------------------------------
--
-- El hash debe coincidir con `frontend/public/privacidad.html`.
-- Se verifica con `node scripts/privacy-doc.mjs --check` y con
-- `scripts/staging-check.mjs`.

insert into public.settings (key, value)
values
  ('privacy_document_version', to_jsonb('v2-2026'::text)),
  ('privacy_document_url', to_jsonb('/privacidad.html'::text)),
  ('privacy_document_sha256', to_jsonb('2862320c61c93a3553a7328625836bf9792783cc170051de76c655559ddeedfc'::text))
on conflict (key) do update
  set value = excluded.value,
      updated_at = now();
