-- Phase 4.6E-1: Provider License & Verification Database/RLS Foundation
-- Purpose: safe public-readable license record foundation with explicit visibility and review gates.

CREATE TABLE IF NOT EXISTS public.provider_license_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,
  center_id uuid NULL REFERENCES public.centers(id),
  doctor_id uuid NULL REFERENCES public.doctors(id),
  license_number text NULL,
  license_authority text NULL,
  license_country public.country_code NOT NULL DEFAULT 'om',
  license_status text NOT NULL DEFAULT 'not_provided',
  license_review_status text NOT NULL DEFAULT 'not_reviewed',
  license_reviewed_at timestamptz NULL,
  public_license_visible boolean NOT NULL DEFAULT false,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz NULL,
  CONSTRAINT provider_license_records_entity_type_check
    CHECK (entity_type IN ('center', 'doctor')),
  CONSTRAINT provider_license_records_entity_target_check
    CHECK (
      (entity_type = 'center' AND center_id IS NOT NULL AND doctor_id IS NULL)
      OR (entity_type = 'doctor' AND doctor_id IS NOT NULL AND center_id IS NULL)
    ),
  CONSTRAINT provider_license_records_license_status_check
    CHECK (license_status IN ('not_provided', 'provided', 'expired', 'suspended', 'unknown')),
  CONSTRAINT provider_license_records_license_review_status_check
    CHECK (license_review_status IN ('not_reviewed', 'pending', 'approved', 'rejected')),
  CONSTRAINT provider_license_records_license_number_length_check
    CHECK (license_number IS NULL OR char_length(btrim(license_number)) BETWEEN 3 AND 80),
  CONSTRAINT provider_license_records_license_number_safe_text_check
    CHECK (
      license_number IS NULL
      OR (
        license_number !~* '<[^>]+>'
        AND license_number ~ '^[A-Za-z0-9 .\-\/]+$'
      )
    ),
  CONSTRAINT provider_license_records_license_authority_length_check
    CHECK (license_authority IS NULL OR char_length(btrim(license_authority)) BETWEEN 2 AND 120),
  CONSTRAINT provider_license_records_license_authority_plain_text_check
    CHECK (license_authority IS NULL OR license_authority !~* '<[^>]+>'),
  CONSTRAINT provider_license_records_public_visible_requires_approval_check
    CHECK (
      public_license_visible = false
      OR (
        license_review_status = 'approved'
        AND license_number IS NOT NULL
        AND btrim(license_number) <> ''
      )
    ),
  CONSTRAINT provider_license_records_reviewed_at_status_check
    CHECK (license_reviewed_at IS NULL OR license_review_status IN ('approved', 'rejected'))
);

CREATE INDEX IF NOT EXISTS provider_license_records_center_id_idx
  ON public.provider_license_records(center_id)
  WHERE center_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS provider_license_records_doctor_id_idx
  ON public.provider_license_records(doctor_id)
  WHERE doctor_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS provider_license_records_public_center_idx
  ON public.provider_license_records(center_id, license_review_status, public_license_visible)
  WHERE deleted_at IS NULL AND center_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS provider_license_records_public_doctor_idx
  ON public.provider_license_records(doctor_id, license_review_status, public_license_visible)
  WHERE deleted_at IS NULL AND doctor_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS provider_license_records_deleted_at_idx
  ON public.provider_license_records(deleted_at)
  WHERE deleted_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS provider_license_records_license_review_status_idx
  ON public.provider_license_records(license_review_status)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS provider_license_records_public_visible_idx
  ON public.provider_license_records(public_license_visible)
  WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS provider_license_records_one_active_center_license_idx
  ON public.provider_license_records(center_id)
  WHERE center_id IS NOT NULL AND deleted_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS provider_license_records_one_active_doctor_license_idx
  ON public.provider_license_records(doctor_id)
  WHERE doctor_id IS NOT NULL AND deleted_at IS NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'trg_provider_license_records_set_updated_at'
  ) THEN
    CREATE TRIGGER trg_provider_license_records_set_updated_at
      BEFORE UPDATE ON public.provider_license_records
      FOR EACH ROW
      EXECUTE FUNCTION public.set_updated_at();
  END IF;
END
$$;

ALTER TABLE public.provider_license_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY provider_license_records_public_select_anon
ON public.provider_license_records
FOR SELECT
TO anon
USING (
  deleted_at IS NULL
  AND public_license_visible = true
  AND license_review_status = 'approved'
  AND license_number IS NOT NULL
  AND btrim(license_number) <> ''
  AND (
    (
      entity_type = 'center'
      AND center_id IS NOT NULL
      AND EXISTS (
        SELECT 1
        FROM public.centers AS c
        WHERE c.id = provider_license_records.center_id
          AND c.deleted_at IS NULL
          AND c.is_active = true
          AND c.status = 'active'
      )
    )
    OR (
      entity_type = 'doctor'
      AND doctor_id IS NOT NULL
      AND EXISTS (
        SELECT 1
        FROM public.doctors AS d
        WHERE d.id = provider_license_records.doctor_id
          AND d.deleted_at IS NULL
          AND d.is_active = true
          AND d.status = 'active'
      )
    )
  )
);

CREATE POLICY provider_license_records_public_select_authenticated
ON public.provider_license_records
FOR SELECT
TO authenticated
USING (
  deleted_at IS NULL
  AND public_license_visible = true
  AND license_review_status = 'approved'
  AND license_number IS NOT NULL
  AND btrim(license_number) <> ''
  AND (
    (
      entity_type = 'center'
      AND center_id IS NOT NULL
      AND EXISTS (
        SELECT 1
        FROM public.centers AS c
        WHERE c.id = provider_license_records.center_id
          AND c.deleted_at IS NULL
          AND c.is_active = true
          AND c.status = 'active'
      )
    )
    OR (
      entity_type = 'doctor'
      AND doctor_id IS NOT NULL
      AND EXISTS (
        SELECT 1
        FROM public.doctors AS d
        WHERE d.id = provider_license_records.doctor_id
          AND d.deleted_at IS NULL
          AND d.is_active = true
          AND d.status = 'active'
      )
    )
  )
);
