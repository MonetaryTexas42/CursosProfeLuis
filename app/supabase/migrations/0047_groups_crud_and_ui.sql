-- 0047 · Reestructuración de sección de grupos (solo CRUD + info)

-- ---------------------------------------------------------------------------
-- Añadir columnas de horario en groups (idempotente)
-- ---------------------------------------------------------------------------

alter table public.groups
  add column if not exists schedule_days int[],
  add column if not exists schedule_start time,
  add column if not exists schedule_end time;

-- ---------------------------------------------------------------------------
-- Función: listado de grupos con estudiantes y profesor
-- ---------------------------------------------------------------------------

drop function if exists public.app_groups_list_with_students(uuid);
create function public.app_groups_list_with_students(p_group_id uuid default null)
returns jsonb
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select jsonb_build_object(
    'groups', jsonb_agg(g) filter (where g is not null)
  ) as result
  from (
    select g.id, g.name, g.level, g.schedule, g.active,
           (select p.full_name from public.profiles p where p.id = g.teacher_id limit 1) as teacher,
           (select count(s.id) from public.students s where s.group_id = g.id and s.status = 'active') as students_count
      from public.groups g
     where p_group_id is null or g.id = p_group_id
     order by g.name
  ) g;
$$;

comment on function public.app_groups_list_with_students(uuid) is
'Lista grupos con profesor y count de estudiantes activos.';

-- ---------------------------------------------------------------------------
-- Función: KPIs de un grupo (versión simplificada por columnas existentes)
-- ---------------------------------------------------------------------------

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
  -- Solo count de estudiantes activos, ya que no hay columnas de puntuación en students
  select count(*) into v_count from public.students where group_id = v_group_id and status = 'active';
  return jsonb_build_object('group_id',v_group_id,'students_total',v_count);
end;
$$;

comment on function public.app_group_kpis(uuid) is
'KPIs básicos: total estudiantes activos en el grupo. (Sin columnas de puntuación en students).';

-- ---------------------------------------------------------------------------
-- Función: asignar estudiante a grupo
-- ---------------------------------------------------------------------------

drop function if exists public.app_group_assign_student(uuid,uuid);
create function public.app_group_assign_student(
  p_group_id uuid, p_student_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_group_id alias for p_group_id;
  v_student_id alias for p_student_id;
  v_teacher_id uuid;
begin
  if auth.uid() is null then raise exception 'No autenticado'; end if;
  select teacher_id into v_teacher_id from public.groups where id = v_group_id limit 1;
  if not public.app_is_admin() and not public.app_is_teacher_of_group(v_group_id) then
    raise exception 'No tiene permiso'; end if;
  update public.students set group_id = v_group_id, updated_at = now() where id = v_student_id;
  return jsonb_build_object('student_id',v_student_id,'group_id',v_group_id,'assigned',true);
end;
$$;

comment on function public.app_group_assign_student(uuid,uuid) is
'Asigna o quita estudiante del grupo. Admin/teacher.'

-- ---------------------------------------------------------------------------
-- Observación final
-- ---------------------------------------------------------------------------

-- El flag global final_exam_spanish_enabled y la tabla group_exam_config persisten
-- en base, pero el frontend NO debe mostrar interruptor de examen en la sección grupos.
-- El examen permanece como unidad global activable desde configuración general.
-- Fin de migración 0047.