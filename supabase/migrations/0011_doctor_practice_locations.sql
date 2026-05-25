-- Phase 2.5B: doctor practice locations foundation
-- Purpose: map doctors to centers and optional center locations.

create table if not exists public.doctor_practice_locations (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid not null references public.doctors(id),
  center_id uuid not null references public.centers(id),
  center_location_id uuid null references public.center_locations(id),
  primary_specialty_id uuid null references public.specialties(id),
  title_override_en text null,
  title_override_ar text null,
  bio_override_en text null,
  bio_override_ar text null,
  consultation_note_en text null,
  consultation_note_ar text null,
  is_primary boolean not null default false,
  is_active boolean not null default true,
  is_accepting_new_patients boolean not null default true,
  sort_order integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz null
);

create unique index if not exists doctor_practice_locations_uq_doctor_center_null_location_active
  on public.doctor_practice_locations (doctor_id, center_id)
  where center_location_id is null and deleted_at is null;

create unique index if not exists doctor_practice_locations_uq_doctor_center_location_active
  on public.doctor_practice_locations (doctor_id, center_id, center_location_id)
  where center_location_id is not null and deleted_at is null;

create index if not exists doctor_practice_locations_doctor_id_idx
  on public.doctor_practice_locations (doctor_id);

create index if not exists doctor_practice_locations_center_id_idx
  on public.doctor_practice_locations (center_id);

create index if not exists doctor_practice_locations_center_location_id_idx
  on public.doctor_practice_locations (center_location_id)
  where center_location_id is not null;

create index if not exists doctor_practice_locations_primary_specialty_id_idx
  on public.doctor_practice_locations (primary_specialty_id)
  where primary_specialty_id is not null;

create index if not exists doctor_practice_locations_deleted_at_idx
  on public.doctor_practice_locations (deleted_at)
  where deleted_at is not null;

do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'trg_doctor_practice_locations_set_updated_at'
  ) then
    create trigger trg_doctor_practice_locations_set_updated_at
      before update on public.doctor_practice_locations
      for each row
      execute function public.set_updated_at();
  end if;
end
$$;
