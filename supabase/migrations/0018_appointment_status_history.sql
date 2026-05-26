-- Phase 2.6C: appointment status history foundation only

create table if not exists public.appointment_status_history (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid not null references public.appointments(id),
  from_status appointment_status null,
  to_status appointment_status not null,
  changed_by_profile_id uuid null references public.profiles(id),
  change_reason text null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  deleted_at timestamptz null
);

create index if not exists idx_appointment_status_history_appointment_id
  on public.appointment_status_history (appointment_id);

create index if not exists idx_appointment_status_history_to_status
  on public.appointment_status_history (to_status);

create index if not exists idx_appointment_status_history_changed_by_profile_id
  on public.appointment_status_history (changed_by_profile_id)
  where changed_by_profile_id is not null;

create index if not exists idx_appointment_status_history_created_at
  on public.appointment_status_history (created_at);

create index if not exists idx_appointment_status_history_deleted_at
  on public.appointment_status_history (deleted_at)
  where deleted_at is not null;
