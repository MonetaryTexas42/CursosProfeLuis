-- 0021 · Finanzas: lectura restringida al personal y tutores (sin alumnos)
--
-- Los pagos y el plan son información sensible de la familia: los alumnos
-- NO deben verlos. Solo el personal (admin o profesor del grupo) y los
-- tutores vinculados pueden consultarlos.

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
    or public.app_is_guardian_of(p_student_id);
$$;

revoke all on function public.app_can_view_billing(uuid) from public;
grant execute on function public.app_can_view_billing(uuid) to authenticated;

drop policy if exists student_billing_select on public.student_billing;
create policy student_billing_select
on public.student_billing for select to authenticated
using (public.app_can_view_billing(student_id));

drop policy if exists payments_select on public.payments;
create policy payments_select
on public.payments for select to authenticated
using (public.app_can_view_billing(student_id));

comment on function public.app_can_view_billing(uuid) is
  'Lectura de finanzas: solo personal y tutores vinculados (los alumnos no ven pagos).';
