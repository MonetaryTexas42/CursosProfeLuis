-- 0031 · Aviso de privacidad v3-2026: finalidad específica del perfil vocacional
--        (PRIV-03)
--
-- 0027 publicó la v2-2026. Este cambio añade al aviso una sección específica
-- sobre el perfil de orientación vocacional: finalidad educativa, carácter
-- orientativo (no diagnóstico), qué ve el tutor (resumen curado) y qué queda
-- reservado al personal docente (notas internas y áreas a trabajar).
--
-- Cambiar el texto exige una versión nueva y un nuevo consentimiento. El hash
-- se genera con `node scripts/privacy-doc.mjs --write` a partir de
-- `frontend/public/privacidad.html`.
--
-- Aplicar junto con el despliegue de `privacidad.html` v3-2026, del frontend
-- (`PRIVACY_DOCUMENT_VERSION`) y de `guardian-consent` (que lee la versión
-- vigente desde `settings`).
--
-- Rollback:
--   update public.settings set value = to_jsonb('v2-2026'::text)
--    where key = 'privacy_document_version';
--   update public.settings
--      set value = to_jsonb('2862320c61c93a3553a7328625836bf9792783cc170051de76c655559ddeedfc'::text)
--    where key = 'privacy_document_sha256';

insert into public.settings (key, value)
values
  ('privacy_document_version', to_jsonb('v3-2026'::text)),
  ('privacy_document_url', to_jsonb('/privacidad.html'::text)),
  ('privacy_document_sha256', to_jsonb('85d13859e9681bbbea548e67422fd069c9b91a5a1c51705062183c0e460f740b'::text))
on conflict (key) do update
  set value = excluded.value,
      updated_at = now();

comment on table public.settings is
  'Ajustes de la aplicación. Incluye la versión, URL y hash del aviso de privacidad vigente (PRIV-01/PRIV-03).';
