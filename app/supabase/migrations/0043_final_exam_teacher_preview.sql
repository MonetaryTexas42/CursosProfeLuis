-- 0043 · Vista previa del examen final para el profesorado
--
-- El profesorado necesita revisar el banco de reactivos sin convertirse en
-- alumno. Esta RPC construye las mismas 13 secciones y preguntas que
-- app_start_final_exam(), con orden aleatorio por llamada, pero NO crea
-- sesión, NO escribe tablas y NO aparece en los resultados del panel.
--
-- Devuelve la clave (correctIndex y explanation) porque el objetivo es
-- verificar que el examen esté bien. Solo puede llamarla personal activo
-- (app_is_staff()); un alumno autenticado recibe un error 42501.
--
-- Rollback:
--   drop function if exists public.app_preview_final_exam();

create or replace function public.app_preview_final_exam()
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
set row_security = off
as $$
declare
  v_seed text;
  v_limit int;
  v_section_no int := 0;
  v_unit record;
  v_q record;
  v_section_key text;
  v_questions jsonb := '[]'::jsonb;
  v_sections jsonb := '[]'::jsonb;
  v_total int := 0;
begin
  if auth.uid() is null or not public.app_is_staff() then
    raise exception 'La vista previa del examen es solo para profesorado'
      using errcode = '42501';
  end if;

  v_limit := coalesce(
    (select (value #>> '{}')::int from public.settings
      where key = 'final_exam_spanish_questions_per_section'),
    0
  );
  if v_limit is null or v_limit < 0 then
    v_limit := 0;
  end if;

  v_seed := md5(auth.uid()::text || clock_timestamp()::text || random()::text);

  for v_unit in
    select u.id as unit_id, u.num, u.title, v.content
      from public.units u
      cross join lateral (
        select uv.content
          from public.unit_versions uv
         where uv.unit_id = u.id and uv.published_at is not null
         order by uv.version desc
         limit 1
      ) v
     where u.subject_id = 'espanol' and u.status = 'published'
     order by md5(u.id::text || v_seed)
  loop
    v_section_no := v_section_no + 1;
    v_section_key := coalesce(v_unit.content->'unit'->>'key', v_unit.unit_id::text);

    v_sections := v_sections || jsonb_build_object(
      'key', v_section_key,
      'title', v_unit.title,
      'num', v_unit.num,
      'order', v_section_no
    );

    for v_q in
      select q.value as q,
             row_number() over (order by md5(q.value->>'key' || v_seed)) as rn
        from jsonb_array_elements(coalesce(v_unit.content->'quiz', '[]'::jsonb)) q
    loop
      exit when v_limit > 0 and v_q.rn > v_limit;

      v_total := v_total + 1;
      v_questions := v_questions || jsonb_build_object(
        'id', v_total,
        'sectionKey', v_section_key,
        'sectionTitle', v_unit.title,
        'position', v_q.rn,
        'questionKey', v_q.q->>'key',
        'prompt', v_q.q->>'prompt',
        'options', coalesce(v_q.q->'options', '[]'::jsonb),
        'correctIndex', coalesce((v_q.q->>'correctIndex')::int, 0),
        'explanation', v_q.q->>'explanation'
      );
    end loop;
  end loop;

  return jsonb_build_object(
    'preview', true,
    'sections', v_sections,
    'questions', v_questions,
    'totalQuestions', v_total
  );
end;
$$;

revoke all on function public.app_preview_final_exam() from public, anon;
grant execute on function public.app_preview_final_exam() to authenticated;

comment on function public.app_preview_final_exam() is
  'Vista previa del examen final solo para profesorado: sin sesiones ni escrituras; revela la clave para revisión.';
