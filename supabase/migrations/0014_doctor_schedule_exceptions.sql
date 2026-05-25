-- Phase 2.5E: Doctor schedule exceptions / overrides foundation only.

DO $$
BEGIN
  CREATE TYPE doctor_schedule_exception_type AS ENUM (
    'unavailable',
    'custom_hours',
    'holiday',
    'leave',
    'emergency',
    'other'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

CREATE TABLE IF NOT EXISTS public.doctor_schedule_exceptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid NOT NULL REFERENCES public.doctors(id),
  doctor_schedule_id uuid NULL REFERENCES public.doctor_schedules(id),
  doctor_practice_location_id uuid NULL REFERENCES public.doctor_practice_locations(id),
  center_id uuid NULL REFERENCES public.centers(id),
  center_location_id uuid NULL REFERENCES public.center_locations(id),
  exception_type doctor_schedule_exception_type NOT NULL,
  exception_date date NOT NULL,
  start_time time NULL,
  end_time time NULL,
  reason_en text NULL,
  reason_ar text NULL,
  is_available boolean NOT NULL DEFAULT false,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz NULL,
  CONSTRAINT doctor_schedule_exceptions_time_pair_check CHECK (
    (start_time IS NULL AND end_time IS NULL)
    OR (start_time IS NOT NULL AND end_time IS NOT NULL)
  ),
  CONSTRAINT doctor_schedule_exceptions_time_window_check CHECK (
    start_time IS NULL OR end_time > start_time
  )
);

CREATE INDEX IF NOT EXISTS doctor_schedule_exceptions_doctor_idx
  ON public.doctor_schedule_exceptions(doctor_id);

CREATE INDEX IF NOT EXISTS doctor_schedule_exceptions_doctor_schedule_idx
  ON public.doctor_schedule_exceptions(doctor_schedule_id)
  WHERE doctor_schedule_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS doctor_schedule_exceptions_practice_location_idx
  ON public.doctor_schedule_exceptions(doctor_practice_location_id)
  WHERE doctor_practice_location_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS doctor_schedule_exceptions_center_idx
  ON public.doctor_schedule_exceptions(center_id)
  WHERE center_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS doctor_schedule_exceptions_center_location_idx
  ON public.doctor_schedule_exceptions(center_location_id)
  WHERE center_location_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS doctor_schedule_exceptions_date_idx
  ON public.doctor_schedule_exceptions(exception_date);

CREATE INDEX IF NOT EXISTS doctor_schedule_exceptions_type_idx
  ON public.doctor_schedule_exceptions(exception_type);

CREATE INDEX IF NOT EXISTS doctor_schedule_exceptions_deleted_at_idx
  ON public.doctor_schedule_exceptions(deleted_at)
  WHERE deleted_at IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS doctor_schedule_exceptions_unique_active_window_idx
  ON public.doctor_schedule_exceptions(
    doctor_id,
    doctor_practice_location_id,
    exception_date,
    start_time,
    end_time,
    exception_type
  )
  WHERE deleted_at IS NULL
    AND doctor_practice_location_id IS NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'trg_doctor_schedule_exceptions_set_updated_at'
  ) THEN
    CREATE TRIGGER trg_doctor_schedule_exceptions_set_updated_at
    BEFORE UPDATE ON public.doctor_schedule_exceptions
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();
  END IF;
END
$$;
