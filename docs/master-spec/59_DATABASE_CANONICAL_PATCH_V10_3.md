# 59_DATABASE_CANONICAL_PATCH_V10_3.md

# DrMuscat V10.3 — Database Canonical Patch and Conflict Resolution

## 1. Purpose
This file resolves V10.2 schema conflicts and adds missing operational tables. It is canonical after 05b, 05c, 05d, and 05e. If older files conflict, this file wins for database implementation.

## 2. Non-Negotiable Database Decisions
1. `public.geo_areas` is canonical. Legacy `public.areas` must not remain a second writable source of truth.
2. `public.doctor_practice_locations` is canonical. Legacy `public.doctor_centers` must not remain a second writable source of truth.
3. Public SEO route base is `/[locale]/[country]`.
4. `public.settings` and `public.plans` conflicts must be resolved by merge/ALTER or renamed tables. Do not redefine existing tables with incompatible `CREATE TABLE IF NOT EXISTS`.
5. All new tables must use `public.` schema qualification.
6. MVP behavior events should be a normal indexed table unless explicit partition maintenance is implemented.
7. RLS must be enabled for all tables containing user/provider/admin/private data.

## 3. Recommended Naming Resolution
Use:
- `public.platform_settings` for runtime/admin settings if `public.settings` already exists as legacy key/value.
- `public.provider_plans` for provider-facing plan catalog if `public.plans` already exists and cannot be safely merged.
- `public.geo_areas` for geography.
- `public.doctor_practice_locations` for doctor-center/location relation.

## 4. Required SQL Patch Skeleton

```sql
-- V10.3 canonical patch skeleton. Review against existing 05b before execution.

CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- 1) Settings conflict-safe platform settings
CREATE TABLE IF NOT EXISTS public.platform_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL DEFAULT 'general',
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  value_type TEXT NOT NULL DEFAULT 'json',
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  is_sensitive BOOLEAN NOT NULL DEFAULT FALSE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2) Provider plans conflict-safe catalog
CREATE TABLE IF NOT EXISTS public.provider_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  description_en TEXT,
  description_ar TEXT,
  price_monthly_omr NUMERIC(10,3),
  price_annual_omr NUMERIC(10,3),
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  entitlements JSONB NOT NULL DEFAULT '{}'::jsonb,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_recommended BOOLEAN NOT NULL DEFAULT FALSE,
  trial_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  trial_days INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- trial fields are future-only in MVP; keep false/0 unless explicitly approved.

CREATE TABLE IF NOT EXISTS public.plan_entitlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES public.provider_plans(id) ON DELETE CASCADE,
  feature_key TEXT NOT NULL,
  limit_value JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(plan_id, feature_key)
);

-- 3) Geo canonical linkage for centers
ALTER TABLE public.centers
  ADD COLUMN IF NOT EXISTS country_id UUID REFERENCES public.geo_countries(id),
  ADD COLUMN IF NOT EXISTS region_id UUID REFERENCES public.geo_regions(id),
  ADD COLUMN IF NOT EXISTS city_id UUID REFERENCES public.geo_cities(id),
  ADD COLUMN IF NOT EXISTS geo_area_id UUID REFERENCES public.geo_areas(id),
  ADD COLUMN IF NOT EXISTS data_quality_status TEXT NOT NULL DEFAULT 'needs_review',
  ADD COLUMN IF NOT EXISTS profile_quality_score INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_verified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_verified_by_profile_id UUID REFERENCES public.profiles(id);

-- Prefer country-scoped center slug uniqueness for multi-country scale.
-- Existing global unique constraints must be reviewed before applying.
-- CREATE UNIQUE INDEX IF NOT EXISTS centers_country_slug_uidx ON public.centers(country_id, slug);

-- 4) Doctor first-class profile extensions
ALTER TABLE public.doctors
  ADD COLUMN IF NOT EXISTS nationality TEXT,
  ADD COLUMN IF NOT EXISTS sub_specialties JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS procedures JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS conditions_treated JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS education JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS career_history JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS license_number TEXT,
  ADD COLUMN IF NOT EXISTS license_authority TEXT,
  ADD COLUMN IF NOT EXISTS license_status TEXT,
  ADD COLUMN IF NOT EXISTS license_expires_at DATE,
  ADD COLUMN IF NOT EXISTS certifications JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS memberships JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS awards JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS publications JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS short_bio_en TEXT,
  ADD COLUMN IF NOT EXISTS short_bio_ar TEXT,
  ADD COLUMN IF NOT EXISTS consultation_fee_min NUMERIC(10,3),
  ADD COLUMN IF NOT EXISTS consultation_fee_max NUMERIC(10,3),
  ADD COLUMN IF NOT EXISTS insurance_accepted JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS patient_types TEXT[] NOT NULL DEFAULT ARRAY['adult'],
  ADD COLUMN IF NOT EXISTS verification_level TEXT NOT NULL DEFAULT 'basic',
  ADD COLUMN IF NOT EXISTS meta_title_en TEXT,
  ADD COLUMN IF NOT EXISTS meta_title_ar TEXT,
  ADD COLUMN IF NOT EXISTS meta_description_en TEXT,
  ADD COLUMN IF NOT EXISTS meta_description_ar TEXT,
  ADD COLUMN IF NOT EXISTS profile_quality_score INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_verified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_verified_by_profile_id UUID REFERENCES public.profiles(id);

-- 5) SEO pages and redirects
CREATE TABLE IF NOT EXISTS public.seo_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  locale TEXT NOT NULL CHECK (locale IN ('en','ar')),
  country_id UUID REFERENCES public.geo_countries(id),
  page_type TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  path TEXT NOT NULL UNIQUE,
  canonical_path TEXT NOT NULL,
  title TEXT NOT NULL,
  meta_description TEXT,
  h1 TEXT,
  intro_html TEXT,
  faq_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  schema_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  robots_index BOOLEAN NOT NULL DEFAULT FALSE,
  sitemap_include BOOLEAN NOT NULL DEFAULT FALSE,
  quality_score INT NOT NULL DEFAULT 0,
  listing_count INT NOT NULL DEFAULT 0,
  content_status TEXT NOT NULL DEFAULT 'draft',
  last_reviewed_by_profile_id UUID REFERENCES public.profiles(id),
  last_reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.redirect_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_path TEXT NOT NULL UNIQUE,
  target_path TEXT NOT NULL,
  status_code INT NOT NULL DEFAULT 301 CHECK (status_code IN (301,302)),
  country_id UUID REFERENCES public.geo_countries(id),
  locale TEXT CHECK (locale IN ('en','ar')),
  reason TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  hit_count INT NOT NULL DEFAULT 0,
  last_hit_at TIMESTAMPTZ,
  created_by_profile_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6) Appointment MVP
CREATE TABLE IF NOT EXISTS public.appointment_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id UUID REFERENCES public.geo_countries(id),
  center_id UUID REFERENCES public.centers(id),
  doctor_id UUID REFERENCES public.doctors(id),
  service_id UUID,
  offer_id UUID,
  patient_user_id UUID REFERENCES public.profiles(id),
  patient_name TEXT NOT NULL,
  patient_phone_e164 TEXT NOT NULL,
  patient_email TEXT,
  preferred_locale TEXT NOT NULL DEFAULT 'en' CHECK (preferred_locale IN ('en','ar')),
  preferred_date DATE,
  preferred_time_window TEXT NOT NULL DEFAULT 'anytime',
  reason_text TEXT,
  channel TEXT NOT NULL DEFAULT 'website_form',
  source_path TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  provider_notes TEXT,
  admin_notes TEXT,
  assigned_to_profile_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.appointment_status_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_request_id UUID NOT NULL REFERENCES public.appointment_requests(id) ON DELETE CASCADE,
  from_status TEXT,
  to_status TEXT NOT NULL,
  changed_by_profile_id UUID REFERENCES public.profiles(id),
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7) Insurance
CREATE TABLE IF NOT EXISTS public.insurance_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id UUID REFERENCES public.geo_countries(id),
  name_en TEXT NOT NULL,
  name_ar TEXT,
  slug TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  support_phone TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(country_id, slug)
);

CREATE TABLE IF NOT EXISTS public.insurance_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  insurance_company_id UUID NOT NULL REFERENCES public.insurance_companies(id) ON DELETE CASCADE,
  name_en TEXT NOT NULL,
  name_ar TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.center_insurance_acceptance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  center_id UUID NOT NULL REFERENCES public.centers(id) ON DELETE CASCADE,
  insurance_company_id UUID NOT NULL REFERENCES public.insurance_companies(id),
  insurance_plan_id UUID REFERENCES public.insurance_plans(id),
  acceptance_type TEXT NOT NULL DEFAULT 'unknown',
  notes_en TEXT,
  notes_ar TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  verified_by_profile_id UUID REFERENCES public.profiles(id),
  verified_at TIMESTAMPTZ,
  last_checked_at TIMESTAMPTZ,
  source TEXT NOT NULL DEFAULT 'provider_claimed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.doctor_insurance_acceptance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  insurance_company_id UUID NOT NULL REFERENCES public.insurance_companies(id),
  insurance_plan_id UUID REFERENCES public.insurance_plans(id),
  acceptance_type TEXT NOT NULL DEFAULT 'unknown',
  notes_en TEXT,
  notes_ar TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  verified_by_profile_id UUID REFERENCES public.profiles(id),
  verified_at TIMESTAMPTZ,
  last_checked_at TIMESTAMPTZ,
  source TEXT NOT NULL DEFAULT 'provider_claimed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8) Import, duplicates, support, notifications, behavior events MVP
CREATE TABLE IF NOT EXISTS public.import_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  source_name TEXT,
  uploaded_file_url TEXT,
  status TEXT NOT NULL DEFAULT 'uploaded',
  total_rows INT NOT NULL DEFAULT 0,
  valid_rows INT NOT NULL DEFAULT 0,
  invalid_rows INT NOT NULL DEFAULT 0,
  duplicate_rows INT NOT NULL DEFAULT 0,
  created_by_profile_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.duplicate_candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id_a UUID NOT NULL,
  entity_id_b UUID NOT NULL,
  score NUMERIC(5,2) NOT NULL DEFAULT 0,
  reasons JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending',
  reviewed_by_profile_id UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL DEFAULT 'other',
  status TEXT NOT NULL DEFAULT 'new',
  subject TEXT NOT NULL,
  requester_profile_id UUID REFERENCES public.profiles(id),
  requester_email TEXT,
  requester_phone TEXT,
  related_entity_type TEXT,
  related_entity_id UUID,
  assigned_to_profile_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notification_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL,
  channel TEXT NOT NULL,
  locale TEXT NOT NULL CHECK (locale IN ('en','ar')),
  subject TEXT,
  body TEXT NOT NULL,
  variables_schema JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(key, channel, locale)
);

CREATE TABLE IF NOT EXISTS public.behavior_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
  event_date DATE NOT NULL DEFAULT CURRENT_DATE,
  country_id UUID REFERENCES public.geo_countries(id),
  locale TEXT CHECK (locale IN ('en','ar')),
  profile_id UUID REFERENCES public.profiles(id),
  anonymous_id TEXT,
  entity_type TEXT,
  entity_id UUID,
  path TEXT,
  properties JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS behavior_events_name_date_idx ON public.behavior_events(event_name, event_date);
CREATE INDEX IF NOT EXISTS behavior_events_entity_idx ON public.behavior_events(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS centers_geo_area_idx ON public.centers(geo_area_id);
CREATE INDEX IF NOT EXISTS centers_country_idx ON public.centers(country_id);
CREATE INDEX IF NOT EXISTS doctors_license_idx ON public.doctors(license_number);
CREATE INDEX IF NOT EXISTS seo_pages_path_idx ON public.seo_pages(path);
```

## 5. RLS Requirements
Every table above must have explicit RLS. At minimum:
- Public can read published/indexable public data only.
- Providers can read/write only owned workspace data and only allowed fields.
- Admin/super_admin can manage all.
- Anonymous inserts allowed only for controlled forms: appointment request, support report, claim request, review if approved by existing rules.
- No anonymous read of private operational forms.

## 6. Payment Provider Alignment
If `payment_provider` enum exists without `myfatoorah`, do not use `myfatoorah` in `payments.provider` until enum migration is approved. Gateway config may list future providers as disabled config only.

## 7. Legal Acceptance Constraint
If legal acceptance is locale-specific, unique must include locale:
`UNIQUE(user_id, document_type, document_version, document_locale)`.
If legal acceptance is language-independent, remove locale from the acceptance uniqueness model and store display locale separately.

## 8. Behavior Events Decision
MVP uses normal `behavior_events` table with indexes. Partitioning is deferred until traffic requires it and partition maintenance exists.
