-- 0046 · Función para crear informe de lectura
--
-- Permite a el profesorado (admin o profesor del grupo) crear reports de
-- lectura para un alumno, con tipo, contenido y palabras por minuto.
--
-- Criterios de aceptación:
--   - `app_create_reading_report(...)` es SECURITY DEFINER y valida rol.
--   - Inserta en `public.reading_reports` y devuelve el id y datos resueltos.
--   - El alumno no puede crear reports para grupos ajenos.
--
-- Rollback:
--   drop function if exists public.app_create_reading_report(uuid, text, text, text, numeric);

create function public.app_create_reading_report(
  p_student_id uuid,
  p_assignment_id uuid,
  p_report_type text,
  p_content text,
  p_words_per_minute numeric
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
set row_security = off
as $$
declare
  v_group_id uuid;
begin
  if auth.uid() is null then
    raise exception 'No autenticado' using errcode = '42501';
  end if;

  select group_id into v_group_id from public.students where id = p_student_id limit 1;

  if not public.app_is_admin() and not public.app_is_teacher_of_group(v_group_id) then
    raise exception 'No tienes permiso para crear un report para este alumno' using errcode = '42501';
  end if;

  insert into public.reading_reports (student_id, assignment_id, report_type, content, words_per_minute, updated_by)
  values (p_student_id, p_assignment_id, p_report_type, p_content, p_words_per_minute, auth.uid());

  return jsonb_build_object(
    'id', (select id from public.reading_reports where student_id = p_student_id and assignment_id = p_assignment_id and report_type = p_report_type and content = p_content and words_per_minute = p_words_per_minute order by created_at desc limit 1),
    'studentId', p_student_id,
    'assignmentId', p_assignment_id,
    'reportType', p_report_type,
    'wordsPerMinute', p_words_per_minute,
    'createdAt', now()
  );
end;
$$;