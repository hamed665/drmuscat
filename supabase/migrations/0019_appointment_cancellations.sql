-- Phase 2.6C: appointment cancellations foundation only

do $$
begin
  create type appointment_cancellation_actor as enum (
    'patient',
    'center',
    'doctor',
    'admin',
    'system',
    'unknown'
  );
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  create type appointment_cancellation_reason as enum (
    'patient_request',
    'doctor_unavailable',
    'center_unavailable',
    'duplicate_booking',
    'no_confirmation',
    'no_show',
    'emergency',
    'other'
  );
exception
  when duplicate_object then null;
end
$$;

create table if not exists public.appointment_cancellations (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid not null references public.appointments(id),
  cancelled_by_actor appointment_cancellation_actor not null default 'unknown',
  cancellation_reason appointment_cancellation_reason not null default 'other',
  cancelled_by_profile_id uuid null references public.profiles(id),
  cancelled_at timestamptz not null default now(),
  note text null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz null
);

create index if not exists idx_appointment_cancellations_appointment_id
  on public.appointment_cancellations (appointment_id);

create index if not exists idx_appointment_cancellations_cancelled_by_actor
  on public.appointment_cancellations (cancelled_by_actor);

create index if not exists idx_appointment_cancellations_cancellation_reason
  on public.appointment_cancellations (cancellation_reason);

create index if not exists idx_appointment_cancellations_cancelled_by_profile_id
  on public.appointment_cancellations (cancelled_by_profile_id)
  where cancelled_by_profile_id is not null;

create index if not exists idx_appointment_cancellations_cancelled_at
  on public.appointment_cancellations (cancelled_at);

create index if not exists idx_appointment_cancellations_deleted_at
  on public.appointment_cancellations (deleted_at)
  where deleted_at is not null;

do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'trg_appointment_cancellations_set_updated_at'
  ) then
    create trigger trg_appointment_cancellations_set_updated_at
      before update on public.appointment_cancellations
      for each row
      execute function public.set_updated_at();
  end if;
end
$$;
