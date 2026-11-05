-- 0008 · Estadísticas de contenido para el panel de administración
--
-- Devuelve por materia el número de unidades (publicadas/borrador),
-- ejercicios, preguntas de quiz y si tiene reto, contando la versión 1.

create or replace function public.app_admin_content_stats()
returns table (
  subject_id text,
  subject_name text,
  subject_active boolean,
  subject_color text,
  units_total bigint,
  units_published bigint,
  units_draft bigint,
  exercises bigint,
  quiz_count bigint,
  has_reto bigint
)
language sql
stable
security definer
set search_path = public, pg_temp
set row_security = off
as $$
  select
    s.id,
    s.name,
    s.active,
    s.color,
    count(u.id) as units_total,
    count(u.id) filter (where u.status = 'published'::public.unit_status) as units_published,
    count(u.id) filter (where u.status = 'draft'::public.unit_status) as units_draft,
    coalesce(sum(jsonb_array_length(v.content -> 'exercises')) filter (where v.id is not null), 0) as exercises,
    coalesce(sum(jsonb_array_length(v.content -> 'quiz')) filter (where v.id is not null), 0) as quiz_count,
    count(v.id) filter (
      where v.content -> 'reto' is not null
        and jsonb_typeof(v.content -> 'reto') = 'object'
        and (v.content -> 'reto' ->> 'prompt') is not null
    ) as has_reto
  from public.subjects s
  left join public.units u on u.subject_id = s.id
  left join public.unit_versions v on v.unit_id = u.id and v.version = 1
  where public.app_is_admin()
  group by s.id, s.name, s.active, s.color
  order by s.sort_order;
$$;

revoke all on function public.app_admin_content_stats() from public;
grant execute on function public.app_admin_content_stats() to authenticated;
