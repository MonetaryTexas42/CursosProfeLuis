-- 0016 · Tests de personalidad y orientación vocacional para alumnos
--
-- 1) RPC para que cada alumno guarde sus propios resultados sin poder
--    editar campos que son responsabilidad del personal.
-- 2) Los resultados se guardan en student_profiles:
--    personality  -> test de personalidad (dimensiones + respuestas)
--    aptitude     -> test vocacional (intereses, aptitudes, preferencias)
--    interests / aptitudes / strengths / career_suggestions -> resumen
-- 3) El personal sigue viendo y editando el perfil desde la ficha.

create or replace function public.app_save_student_test(
  p_kind text,
  p_payload jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
set row_security = off
as $$
declare
  v_student_id uuid;
  v_interests text[];
  v_aptitudes text[];
  v_strengths text[];
  v_career_choice text;
  v_result jsonb;
begin
  if auth.uid() is null then
    raise exception 'No autenticado' using errcode = '42501';
  end if;

  select s.id
    into v_student_id
    from public.students s
   where s.profile_id = auth.uid()
     and s.status = 'active'::public.student_status
   limit 1;

  if v_student_id is null then
    raise exception 'La cuenta no está vinculada a un alumno activo' using errcode = '42501';
  end if;

  if p_kind = 'personality' then
    insert into public.student_profiles (student_id, personality)
    values (v_student_id, coalesce(p_payload, '{}'::jsonb))
    on conflict (student_id) do update
      set personality = excluded.personality,
          updated_at = now();

    select jsonb_build_object(
      'kind', 'personality',
      'personality', sp.personality
    )
      into v_result
      from public.student_profiles sp
     where sp.student_id = v_student_id;

    return v_result;
  end if;

  if p_kind = 'vocational' then
    v_interests := coalesce(
      array(select jsonb_array_elements_text(coalesce(p_payload->'interests', '[]'::jsonb))),
      '{}'::text[]
    );
    v_aptitudes := coalesce(
      array(select jsonb_array_elements_text(coalesce(p_payload->'aptitudes', '[]'::jsonb))),
      '{}'::text[]
    );
    v_strengths := coalesce(
      array(select jsonb_array_elements_text(coalesce(p_payload->'strengths', '[]'::jsonb))),
      '{}'::text[]
    );
    v_career_choice := nullif(trim(coalesce(p_payload->>'career_choice', '')), '');

    insert into public.student_profiles (
      student_id,
      aptitude,
      interests,
      aptitudes,
      strengths,
      career_suggestions,
      career_choice
    )
    values (
      v_student_id,
      coalesce(p_payload, '{}'::jsonb),
      v_interests,
      v_aptitudes,
      v_strengths,
      coalesce(p_payload->'career_suggestions', '[]'::jsonb),
      v_career_choice
    )
    on conflict (student_id) do update
      set aptitude = excluded.aptitude,
          interests = excluded.interests,
          aptitudes = excluded.aptitudes,
          strengths = excluded.strengths,
          career_suggestions = excluded.career_suggestions,
          career_choice = coalesce(excluded.career_choice, public.student_profiles.career_choice),
          updated_at = now();

    select jsonb_build_object(
      'kind', 'vocational',
      'aptitude', sp.aptitude,
      'interests', to_jsonb(sp.interests),
      'aptitudes', to_jsonb(sp.aptitudes),
      'strengths', to_jsonb(sp.strengths),
      'career_suggestions', sp.career_suggestions,
      'career_choice', sp.career_choice
    )
      into v_result
      from public.student_profiles sp
     where sp.student_id = v_student_id;

    return v_result;
  end if;

  raise exception 'Tipo de test no válido: %', p_kind using errcode = '22023';
end;
$$;

revoke all on function public.app_save_student_test(text, jsonb) from public;
grant execute on function public.app_save_student_test(text, jsonb) to authenticated;

comment on function public.app_save_student_test(text, jsonb) is
  'Guarda el resultado de un test (personality o vocational) del alumno autenticado.';
