-- 0020 · Finanzas: planes de pago y pagos por alumno
--
-- 1) student_billing: plan (semanal, quincenal, mensual, contado, beca,
--    otro), cuota por periodo y notas por alumno.
-- 2) payments: pagos registrados (monto, fecha, método, concepto).
-- 3) Accesos: el personal (admin o profesor del grupo del alumno) registra
--    y edita; el tutor solo consulta lo de sus hijos (solo lectura).

create table if not exists public.student_billing (
  student_id uuid primary key references public.students(id) on delete cascade,
  plan text not null default 'mensual'
    check (plan in ('semanal', 'quincenal', 'mensual', 'contado', 'beca', 'otro')),
  fee numeric(10, 2) check (fee is null or fee >= 0),
  notes text,
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  amount numeric(10, 2) not null check (amount > 0),
  paid_at date not null default current_date,
  method text not null default 'efectivo'
    check (method in ('efectivo', 'transferencia', 'tarjeta', 'otro')),
  period text,
  notes text,
  recorded_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create index if not exists payments_student_date_idx on public.payments (student_id, paid_at desc);

drop trigger if exists student_billing_set_updated_at on public.student_billing;
create trigger student_billing_set_updated_at before update on public.student_billing
for each row execute function public.set_updated_at();

alter table public.student_billing enable row level security;
alter table public.payments enable row level security;

-- Lectura: personal y tutores vinculados al alumno (solo lectura para tutores).
create policy student_billing_select
on public.student_billing for select to authenticated
using (public.app_can_access_student(student_id));

create policy student_billing_write_staff
on public.student_billing for all to authenticated
using (public.app_is_admin() or public.app_is_teacher_of_student(student_id))
with check (public.app_is_admin() or public.app_is_teacher_of_student(student_id));

create policy payments_select
on public.payments for select to authenticated
using (public.app_can_access_student(student_id));

create policy payments_write_staff
on public.payments for all to authenticated
using (public.app_is_admin() or public.app_is_teacher_of_student(student_id))
with check (public.app_is_admin() or public.app_is_teacher_of_student(student_id));

comment on table public.student_billing is
  'Plan de pago por alumno: periodicidad, cuota y notas (lo gestiona el personal).';
comment on table public.payments is
  'Pagos registrados por alumno: monto, fecha, método y concepto.';
