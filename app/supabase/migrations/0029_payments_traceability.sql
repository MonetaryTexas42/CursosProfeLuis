-- 0029 · Pagos con trazabilidad: periodo, estado, folio, duplicados y anulación
--        (FUN-02)
--
-- Antes de este cambio, `payments` solo guardaba monto, fecha, método y un
-- concepto libre. No se podía responder "¿cuánto debe y de qué periodo?",
-- detectar un pago duplicado ni anular sin borrar la fila.
--
-- Este cambio:
--   1. añade periodo cubierto, estado, folio, clave de idempotencia y datos de
--      anulación;
--   2. asigna un folio legible y único a cada pago;
--   3. bloquea pagos idénticos activos y ofrece una vista de duplicados
--      heredados;
--   4. calcula el estado de cuenta por alumno y periodo (`student_billing_status`);
--   5. sustituye el borrado por una anulación auditada (`app_void_payment`);
--   6. impide borrar pagos o planes desde PostgREST.
--
-- Criterio de aceptación:
--   - Se puede responder "¿cuánto debe y de qué periodo?" para cada alumno.
--   - Un pago duplicado se rechaza y los heredados se listan.
--   - Anular deja motivo, actor, fecha y registro en `audit_log`.
--   - Un tutor solo ve las finanzas de sus hijos; un alumno no ve ninguna.
--
-- Rollback:
--   drop function if exists public.app_void_payment(uuid, text);
--   drop view if exists public.payment_duplicates;
--   drop view if exists public.student_billing_status;
--   drop function if exists public.app_payments_before_write();
--   drop function if exists public.app_billing_period(text, date);
--   drop sequence if exists public.payment_receipt_seq;
--   alter table public.payments
--     drop column if exists updated_at,
--     drop column if exists idempotency_key,
--     drop column if exists receipt_no,
--     drop column if exists void_reason,
--     drop column if exists voided_by,
--     drop column if exists voided_at,
--     drop column if exists status,
--     drop column if exists period_end,
--     drop column if exists period_start;

alter table public.payments
  add column if not exists period_start date,
  add column if not exists period_end date,
  add column if not exists status text not null default 'paid',
  add column if not exists voided_at timestamptz,
  add column if not exists voided_by uuid references public.profiles(id) on delete set null,
  add column if not exists void_reason text,
  add column if not exists receipt_no text,
  add column if not exists idempotency_key text,
  add column if not exists updated_at timestamptz not null default now();

-- Periodo natural según el plan. Devuelve 0 filas para planes manuales
-- (contado, beca, otro).
create or replace function public.app_billing_period(p_plan text, p_date date)
returns table(period_start date, period_end date)
language sql
immutable
set search_path = public, pg_temp
as $$
  select
    case p_plan
      when 'semanal' then date_trunc('week', p_date)::date
      when 'quincenal' then
        case
          when extract(day from p_date) <= 15 then date_trunc('month', p_date)::date
          else (date_trunc('month', p_date) + interval '15 days')::date
        end
      when 'mensual' then date_trunc('month', p_date)::date
    end,
    case p_plan
      when 'semanal' then (date_trunc('week', p_date) + interval '6 days')::date
      when 'quincenal' then
        case
          when extract(day from p_date) <= 15
            then (date_trunc('month', p_date) + interval '14 days')::date
          else (date_trunc('month', p_date) + interval '1 month - 1 day')::date
        end
      when 'mensual' then (date_trunc('month', p_date) + interval '1 month - 1 day')::date
    end
  where p_plan in ('semanal', 'quincenal', 'mensual');
$$;

revoke all on function public.app_billing_period(text, date) from public, anon;
grant execute on function public.app_billing_period(text, date) to authenticated, service_role;

comment on function public.app_billing_period(text, date) is
  'FUN-02: inicio y fin del periodo natural del plan para una fecha dada.';

-- Backfill: el periodo se deduce del plan del alumno. Los pagos antiguos sin
-- plan se tratan como mensuales.
with pending as (
  select p.id,
         coalesce(b.plan, 'mensual') as plan,
         p.paid_at
    from public.payments p
    left join public.student_billing b on b.student_id = p.student_id
   where p.period_start is null
),
computed as (
  select c.id,
         period.period_start,
         period.period_end
    from pending c
    left join lateral public.app_billing_period(c.plan, c.paid_at) period on true
)
update public.payments p
   set period_start = coalesce(c.period_start, date_trunc('month', p.paid_at)::date),
       period_end = coalesce(
         c.period_end,
         (date_trunc('month', p.paid_at) + interval '1 month - 1 day')::date
       )
  from computed c
 where c.id = p.id;

update public.payments
   set period_start = date_trunc('month', paid_at)::date,
       period_end = (date_trunc('month', paid_at) + interval '1 month - 1 day')::date
 where period_start is null;

-- Folio heredado: se distingue de los folios nuevos para no chocar con la
-- secuencia. Los nuevos usan REC-<año>-<secuencia>.
with numbered as (
  select id, row_number() over (order by paid_at, id) as rn
    from public.payments
   where receipt_no is null
)
update public.payments p
   set receipt_no = 'REC-' || to_char(p.paid_at, 'YYYY') || '-L' || lpad(n.rn::text, 6, '0')
  from numbered n
 where n.id = p.id;

do $$
begin
  if not exists (
    select 1 from pg_constraint
     where conrelid = 'public.payments'::regclass
       and conname = 'payments_period_order'
  ) then
    alter table public.payments
      add constraint payments_period_order
      check (period_start is null or period_end is null or period_end >= period_start);
  end if;

  if not exists (
    select 1 from pg_constraint
     where conrelid = 'public.payments'::regclass
       and conname = 'payments_status_check'
  ) then
    alter table public.payments
      add constraint payments_status_check
      check (status in ('paid', 'partial', 'voided'));
  end if;

  if not exists (
    select 1 from pg_constraint
     where conrelid = 'public.payments'::regclass
       and conname = 'payments_void_consistency'
  ) then
    alter table public.payments
      add constraint payments_void_consistency
      check (
        status <> 'voided'
        or (voided_at is not null and void_reason is not null and char_length(trim(void_reason)) >= 3)
      );
  end if;
end $$;

create index if not exists payments_period_idx
  on public.payments (student_id, period_start, period_end);
create index if not exists payments_status_idx
  on public.payments (student_id, status);
create unique index if not exists payments_idempotency_key_idx
  on public.payments (idempotency_key)
  where idempotency_key is not null;
create unique index if not exists payments_receipt_no_idx
  on public.payments (receipt_no)
  where receipt_no is not null;

create sequence if not exists public.payment_receipt_seq;
grant usage, select on sequence public.payment_receipt_seq to authenticated, service_role;

-- Folio, validaciones y detección de duplicados en una sola puerta de entrada.
create or replace function public.app_payments_before_write()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  new.updated_at := now();

  if new.receipt_no is null then
    new.receipt_no := 'REC-' || to_char(coalesce(new.paid_at, current_date), 'YYYY')
      || '-' || lpad(nextval('public.payment_receipt_seq')::text, 6, '0');
  end if;

  if new.period_start is not null and new.period_end is not null
     and new.period_end < new.period_start then
    raise exception 'El fin del periodo no puede ser anterior al inicio'
      using errcode = '22023';
  end if;

  if new.status = 'voided' then
    if new.voided_at is null then
      new.voided_at := now();
    end if;
    if new.void_reason is null or char_length(trim(new.void_reason)) < 3 then
      raise exception 'La anulación requiere un motivo de al menos 3 caracteres'
        using errcode = '22023';
    end if;
  else
    if new.voided_at is not null or new.void_reason is not null then
      raise exception 'Solo un pago anulado puede tener fecha y motivo de anulación'
        using errcode = '22023';
    end if;
  end if;

  if tg_op = 'UPDATE' and old.status = 'voided' and new.status <> 'voided' then
    raise exception 'Un pago anulado no se reactiva; registra uno nuevo'
      using errcode = '22023';
  end if;

  -- La anulación deja rastro aunque se haga por PostgREST y no por la RPC.
  if tg_op = 'UPDATE' and old.status <> 'voided' and new.status = 'voided' then
    insert into public.audit_log (actor_id, action, entity_type, entity_id, before, after)
    values (
      auth.uid(),
      'payment.voided',
      'payment',
      new.id::text,
      to_jsonb(old),
      to_jsonb(new)
    );
  end if;

  if new.status = 'paid'
     and new.period_start is not null
     and new.period_end is not null
     and exists (
       select 1
         from public.payments p
        where p.student_id = new.student_id
          and p.amount = new.amount
          and p.period_start = new.period_start
          and p.period_end = new.period_end
          and p.status = 'paid'
          and p.voided_at is null
          and p.id <> new.id
     ) then
    raise exception 'Ya existe un pago idéntico para ese periodo; revisa el historial antes de duplicarlo'
      using errcode = '23505';
  end if;

  return new;
end;
$$;

drop trigger if exists payments_before_write on public.payments;
create trigger payments_before_write
before insert or update on public.payments
for each row execute function public.app_payments_before_write();

-- Estado de cuenta por alumno: periodo actual, pagado, saldo y adeudo anterior.
create or replace view public.student_billing_status
with (security_invoker = true) as
with base as (
  select s.id as student_id,
         b.plan,
         b.fee,
         p.period_start,
         p.period_end
    from public.students s
    join public.student_billing b on b.student_id = s.id
    left join lateral public.app_billing_period(b.plan, current_date) p on true
),
prev as (
  select b.*,
         pp.period_start as previous_period_start,
         pp.period_end as previous_period_end
    from base b
    left join lateral public.app_billing_period(b.plan, b.period_start - 1) pp
      on b.period_start is not null
),
totals as (
  select p.*,
         coalesce((
           select sum(x.amount)
             from public.payments x
            where x.student_id = p.student_id
              and x.status <> 'voided'
              and p.period_start is not null
              and x.period_start <= p.period_end
              and x.period_end >= p.period_start
         ), 0) as paid,
         coalesce((
           select sum(x.amount)
             from public.payments x
            where x.student_id = p.student_id
              and x.status <> 'voided'
              and p.previous_period_start is not null
              and x.period_start <= p.previous_period_end
              and x.period_end >= p.previous_period_start
         ), 0) as previous_paid,
         (
           select max(x.paid_at)
             from public.payments x
            where x.student_id = p.student_id
              and x.status <> 'voided'
         ) as last_paid_at
    from prev p
)
select
  student_id,
  plan,
  fee,
  period_start,
  period_end,
  case when plan = 'beca' then 0::numeric else coalesce(fee, 0) end as expected,
  paid,
  case when plan = 'beca' then 0::numeric else coalesce(fee, 0) - paid end as balance,
  greatest(paid - case when plan = 'beca' then 0::numeric else coalesce(fee, 0) end, 0) as credit,
  case
    when plan = 'beca' then 'beca'
    when period_start is null then 'manual'
    when coalesce(fee, 0) <= 0 then 'sin cuota'
    when paid >= coalesce(fee, 0) then 'al corriente'
    when paid > 0 then 'parcial'
    when previous_period_start is not null
      and last_paid_at is not null
      and previous_paid < coalesce(fee, 0) then 'vencido'
    else 'pendiente'
  end as status,
  (
    previous_period_start is not null
    and last_paid_at is not null
    and previous_paid < coalesce(fee, 0)
  ) as overdue,
  previous_period_start,
  previous_period_end,
  case when plan = 'beca' then 0::numeric else coalesce(fee, 0) end as previous_expected,
  previous_paid,
  case when plan = 'beca' then 0::numeric else coalesce(fee, 0) - previous_paid end as previous_balance,
  last_paid_at
from totals;

comment on view public.student_billing_status is
  'FUN-02: estado de cuenta por alumno y periodo. Respeta la RLS de student_billing y payments.';

revoke all on public.student_billing_status from public, anon;
grant select on public.student_billing_status to authenticated, service_role;

-- Duplicados heredados (los nuevos se bloquean en el trigger).
create or replace view public.payment_duplicates
with (security_invoker = true) as
select
  student_id,
  amount,
  period_start,
  period_end,
  count(*)::int as duplicate_count,
  array_agg(id order by paid_at, id) as payment_ids,
  min(paid_at) as first_paid_at,
  max(paid_at) as last_paid_at
from public.payments
where status = 'paid'
  and voided_at is null
  and period_start is not null
  and period_end is not null
group by student_id, amount, period_start, period_end
having count(*) > 1;

comment on view public.payment_duplicates is
  'FUN-02: pagos idénticos activos registrados antes de la validación.';

revoke all on public.payment_duplicates from public, anon;
grant select on public.payment_duplicates to authenticated, service_role;

-- Anulación con motivo y auditoría. No borra la fila.
create or replace function public.app_void_payment(p_payment_id uuid, p_reason text)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
set row_security = off
as $$
declare
  v_actor uuid := auth.uid();
  v_payment public.payments%rowtype;
  v_reason text := nullif(trim(coalesce(p_reason, '')), '');
begin
  if v_actor is null then
    raise exception 'No autenticado' using errcode = '42501';
  end if;

  if v_reason is null or char_length(v_reason) < 3 then
    raise exception 'Escribe un motivo de anulación (mínimo 3 caracteres)'
      using errcode = '22023';
  end if;

  select * into v_payment
    from public.payments
   where id = p_payment_id
   for update;

  if not found then
    raise exception 'Pago no encontrado' using errcode = 'P0002';
  end if;

  if not (public.app_is_admin() or public.app_is_teacher_of_student(v_payment.student_id)) then
    raise exception 'No puedes anular este pago' using errcode = '42501';
  end if;

  if v_payment.status = 'voided' then
    raise exception 'El pago ya está anulado' using errcode = '22023';
  end if;

  -- El trigger `app_payments_before_write` registra la anulación en
  -- `audit_log`, de modo que también queda rastro si se hace por PostgREST.
  update public.payments
     set status = 'voided',
         voided_at = now(),
         voided_by = v_actor,
         void_reason = v_reason,
         updated_at = now()
   where id = p_payment_id;

  return jsonb_build_object('ok', true, 'payment_id', p_payment_id);
end;
$$;

revoke all on function public.app_void_payment(uuid, text) from public, anon;
grant execute on function public.app_void_payment(uuid, text) to authenticated, service_role;

comment on function public.app_void_payment(uuid, text) is
  'FUN-02: anula un pago con motivo, actor y registro en audit_log. Solo admin o profesor del alumno.';

-- Sin políticas de DELETE: el historial no se borra, se anula.
drop policy if exists payments_write_staff on public.payments;
create policy payments_insert_staff
on public.payments for insert to authenticated
with check (public.app_is_admin() or public.app_is_teacher_of_student(student_id));

create policy payments_update_staff
on public.payments for update to authenticated
using (public.app_is_admin() or public.app_is_teacher_of_student(student_id))
with check (public.app_is_admin() or public.app_is_teacher_of_student(student_id));

drop policy if exists student_billing_write_staff on public.student_billing;
create policy student_billing_insert_staff
on public.student_billing for insert to authenticated
with check (public.app_is_admin() or public.app_is_teacher_of_student(student_id));

create policy student_billing_update_staff
on public.student_billing for update to authenticated
using (public.app_is_admin() or public.app_is_teacher_of_student(student_id))
with check (public.app_is_admin() or public.app_is_teacher_of_student(student_id));
