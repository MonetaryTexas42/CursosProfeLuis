-- 0048 · Reparar función app_group_kpis (columna puntuacion_participacion no existe)
--
-- Arregla la función que fallaba por referencia a columna que no existe en students.

drop function if exists public.app_group_kpis(uuid);
create function public.app_group_kpis(p_group_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_group_id alias for p_group_id;
  v_count int;
begin
  if p_group_id is null then return jsonb_build_object('error','group_id requerido'); end if;
  -- Usamos solo count de estudiantes activos, sin columnas de puntuación
  select count(*) into v_count from public.students where group_id = v_group_id and status = 'active';
  return jsonb_build_object('group_id',v_group_id,'students_total',v_count);
end;
$$;

comment on function public.app_group_kpis(uuid) is
'KPIs básicos: total estudiantes activos en el grupo. (Sin columnas de puntuación en students).';