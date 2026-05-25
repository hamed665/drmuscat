-- Phase 2.5D: Doctor schedules foundation
-- Creates only doctor_schedule_day enum and public.doctor_schedules

do $$
begin
  create type doctor_schedule_day as enum (
    'saturday',
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday'
  );
exception
  when duplicate_object then null;
end $$;

create table if not exists public.doctor_schedules (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid not null references public.doctors(id),
  doctor_practice_location_id uuid null references public.doctor_practice_locations(id),
  center_id uuid null references public.centers(id),
  center_location_id uuid null references public.center_locations(id),
  day_of_week doctor_schedule_day not null,
  start_time time not null,
  end_time time not null,
  slot_minutes integer null,
  break_start_time time null,
  break_end_time time null,
  effective_from date null,
  effective_to date null,
  timezone text not null default 'Asia/Muscat',
  is_active boolean not null default true,
  notes_en text null,
  notes_ar text null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz null,

  constraint doctor_schedules_time_window_check
    check (end_time > start_time),
  constraint doctor_schedules_slot_minutes_check
    check (slot_minutes is null or (slot_minutes >= 5 and slot_minutes <= 240)),
  constraint doctor_schedules_break_window_check
    check (
      (break_start_time is null and break_end_time is null)
      or (break_start_time is not null and break_end_time is not null and break_end_time > break_start_time)
    ),
  constraint doctor_schedules_effective_date_check
    check (
      effective_to is null
      or effective_from is null
      or effective_to >= effective_from
    ),
  constraint doctor_schedules_timezone_nonempty_check
    check (btrim(timezone) <> '')
);

create index if not exists idx_doctor_schedules_doctor_id
  on public.doctor_schedules(doctor_id);

create index if not exists idx_doctor_schedules_doctor_practice_location_id
  on public.doctor_schedules(doctor_practice_location_id)
  where doctor_practice_location_id is not null;

create index if not exists idx_doctor_schedules_center_id
  on public.doctor_schedules(center_id)
  where center_id is not null;

create index if not exists idx_doctor_schedules_center_location_id
  on public.doctor_schedules(center_location_id)
  where center_location_id is not null;

create index if not exists idx_doctor_schedules_day_of_week
  on public.doctor_schedules(day_of_week);

create index if not exists idx_doctor_schedules_deleted_at
  on public.doctor_schedules(deleted_at)
  where deleted_at is not null;

create unique index if not exists uq_doctor_schedules_doctor_loc_day_time_active
  on public.doctor_schedules(
    doctor_id,
    doctor_practice_location_id,
    day_of_week,
    start_time,
    end_time
  )
  where doctor_practice_location_id is not null and deleted_at is null;

do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'trg_doctor_schedules_set_updated_at'
  ) then
    create trigger trg_doctor_schedules_set_updated_at
      before update on public.doctor_schedules
      for each row
      execute function public.set_updated_at();
  end if;
end $$;
