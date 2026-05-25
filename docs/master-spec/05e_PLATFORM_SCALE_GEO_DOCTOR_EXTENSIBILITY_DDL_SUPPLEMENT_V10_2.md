# 05e — Platform Scale, Geography, Doctor Profiles, Extensibility, Consent, Payments, Analytics DDL Supplement V10.2

This supplement is mandatory after `05d_AD_SYSTEM_DDL_SUPPLEMENT_V10.md`. It does not replace `05b`; it extends it. Claude Code must not implement multi-country routing, doctor SEO pages, dynamic plans, consent, payments, notifications, or behavior analytics without this supplement or a migration derived from it.

## Required Extensions

```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;
```

## Canonical Geographic Hierarchy

The platform must support five geographic layers:

```text
country -> region/governorate -> city -> area/neighborhood -> address/location point
```

Launch country is Oman (`om`), but the schema must be multi-country-ready.

### Tables

```sql
CREATE TABLE IF NOT EXISTS geo_countries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  iso_code_2 TEXT UNIQUE NOT NULL,
  iso_code_3 TEXT UNIQUE NOT NULL,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  name_native TEXT,
  currency_code TEXT NOT NULL,
  currency_symbol TEXT,
  phone_code TEXT NOT NULL,
  timezone TEXT NOT NULL,
  default_locale TEXT NOT NULL,
  supported_locales TEXT[] NOT NULL DEFAULT ARRAY['en','ar'],
  rtl_default BOOLEAN DEFAULT TRUE,
  center_lat NUMERIC(10,7),
  center_lng NUMERIC(10,7),
  default_zoom INT DEFAULT 7,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','launching','inactive')),
  launch_date DATE,
  is_primary BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0,
  domain_strategy TEXT NOT NULL DEFAULT 'subfolder' CHECK (domain_strategy IN ('subfolder','subdomain','separate_domain')),
  custom_domain TEXT,
  medical_authority TEXT,
  license_format TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS geo_regions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id UUID NOT NULL REFERENCES geo_countries(id) ON DELETE RESTRICT,
  iso_code TEXT,
  slug TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'governorate',
  center_lat NUMERIC(10,7),
  center_lng NUMERIC(10,7),
  default_zoom INT DEFAULT 10,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','coming_soon','beta','inactive')),
  display_order INT DEFAULT 0,
  centers_count INT DEFAULT 0,
  doctors_count INT DEFAULT 0,
  population INT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(country_id, slug)
);

CREATE TABLE IF NOT EXISTS geo_cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id UUID NOT NULL REFERENCES geo_countries(id) ON DELETE RESTRICT,
  region_id UUID NOT NULL REFERENCES geo_regions(id) ON DELETE RESTRICT,
  slug TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  alternative_names JSONB DEFAULT '[]'::jsonb,
  center_lat NUMERIC(10,7),
  center_lng NUMERIC(10,7),
  default_zoom INT DEFAULT 12,
  population INT,
  is_capital BOOLEAN DEFAULT FALSE,
  is_major_city BOOLEAN DEFAULT FALSE,
  centers_count INT DEFAULT 0,
  doctors_count INT DEFAULT 0,
  meta_title_en TEXT,
  meta_title_ar TEXT,
  meta_description_en TEXT,
  meta_description_ar TEXT,
  hero_image_url TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','coming_soon','beta','inactive')),
  launch_date DATE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(country_id, slug)
);

CREATE TABLE IF NOT EXISTS geo_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id UUID NOT NULL REFERENCES geo_countries(id) ON DELETE RESTRICT,
  region_id UUID NOT NULL REFERENCES geo_regions(id) ON DELETE RESTRICT,
  city_id UUID NOT NULL REFERENCES geo_cities(id) ON DELETE RESTRICT,
  slug TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  alternative_names JSONB DEFAULT '[]'::jsonb,
  center_lat NUMERIC(10,7),
  center_lng NUMERIC(10,7),
  boundary_geojson JSONB,
  default_zoom INT DEFAULT 14,
  area_type TEXT CHECK (area_type IN ('residential','commercial','mixed','industrial','medical_district','tourist')),
  is_featured BOOLEAN DEFAULT FALSE,
  centers_count INT DEFAULT 0,
  doctors_count INT DEFAULT 0,
  population INT,
  meta_title_en TEXT,
  meta_title_ar TEXT,
  meta_description_en TEXT,
  meta_description_ar TEXT,
  hero_image_url TEXT,
  description_en TEXT,
  description_ar TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','coming_soon','beta','inactive')),
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(city_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_geo_areas_city_status ON geo_areas(city_id, status);
CREATE INDEX IF NOT EXISTS idx_geo_cities_country_status ON geo_cities(country_id, status);
CREATE INDEX IF NOT EXISTS idx_geo_regions_country ON geo_regions(country_id);
CREATE INDEX IF NOT EXISTS idx_geo_areas_counts ON geo_areas(centers_count DESC) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_geo_areas_trgm_en ON geo_areas USING gin (name_en gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_geo_areas_trgm_ar ON geo_areas USING gin (name_ar gin_trgm_ops);
```

Existing `centers` and `doctors` must reference country, region, city, and area where applicable. If `areas` already exists in V10.1, implementation must either migrate it into `geo_areas` or create a compatibility view. Do not keep two competing area systems.

## Doctor Profile Extension

Doctor profiles are first-class SEO objects. They must support full identity, license, language, specialty, education, multi-location practice, services, media, reviews, and safe schema.org output.

```sql
CREATE TABLE IF NOT EXISTS doctor_practice_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  center_id UUID NOT NULL REFERENCES centers(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT FALSE,
  role_en TEXT,
  role_ar TEXT,
  department TEXT,
  schedule JSONB DEFAULT '{}'::jsonb,
  appointment_available BOOLEAN DEFAULT TRUE,
  walk_in_accepted BOOLEAN DEFAULT TRUE,
  start_date DATE,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','ended')),
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(doctor_id, center_id)
);

CREATE TABLE IF NOT EXISTS doctor_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  name_en TEXT,
  name_ar TEXT,
  description_en TEXT,
  description_ar TEXT,
  price_min NUMERIC(10,3),
  price_max NUMERIC(10,3),
  price_starts_from BOOLEAN DEFAULT FALSE,
  price_on_request BOOLEAN DEFAULT FALSE,
  duration_minutes INT,
  covered_by_insurance BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','hidden','archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS doctor_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  media_type TEXT NOT NULL CHECK (media_type IN ('photo','video','document')),
  media_role TEXT NOT NULL CHECK (media_role IN ('profile_photo','cover','gallery','before_after','certificate','workspace','team','patient_testimonial_video')),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  caption_en TEXT,
  caption_ar TEXT,
  alt_text_en TEXT,
  alt_text_ar TEXT,
  is_before_after BOOLEAN DEFAULT FALSE,
  before_url TEXT,
  after_url TEXT,
  procedure_name_en TEXT,
  procedure_name_ar TEXT,
  patient_consent BOOLEAN DEFAULT FALSE,
  consent_document_url TEXT,
  display_order INT DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','hidden')),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_doctor_practice_locations_doctor ON doctor_practice_locations(doctor_id, status);
CREATE INDEX IF NOT EXISTS idx_doctor_practice_locations_center ON doctor_practice_locations(center_id, status);
CREATE INDEX IF NOT EXISTS idx_doctor_services_doctor ON doctor_services(doctor_id, status);
CREATE INDEX IF NOT EXISTS idx_doctor_media_doctor ON doctor_media(doctor_id, status);
```

Implementation must extend the existing `doctors` table, not create a duplicate doctor table. Required additional fields on `doctors` include: nationality, spoken languages, primary specialty, sub-specialties, procedures, conditions treated, education, career history, license metadata, certifications, memberships, awards, publications, bio, short bio, consultation fee range, insurance, patient type support, verification level, SEO metadata, and cached engagement counts.

## Extensibility Primitives

```sql
CREATE TABLE IF NOT EXISTS feature_flags (
  key TEXT PRIMARY KEY,
  enabled BOOLEAN DEFAULT FALSE,
  rollout_percentage INT DEFAULT 0 CHECK (rollout_percentage BETWEEN 0 AND 100),
  enabled_for_plans JSONB DEFAULT '[]'::jsonb,
  enabled_for_users JSONB DEFAULT '[]'::jsonb,
  config JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('string','number','boolean','json','array')),
  category TEXT NOT NULL,
  label_en TEXT,
  label_ar TEXT,
  description_en TEXT,
  description_ar TEXT,
  input_type TEXT,
  options JSONB,
  validation JSONB,
  is_public BOOLEAN DEFAULT FALSE,
  requires_admin BOOLEAN DEFAULT TRUE,
  requires_super_admin BOOLEAN DEFAULT FALSE,
  last_changed_by UUID REFERENCES profiles(id),
  last_changed_at TIMESTAMPTZ,
  cache_ttl_seconds INT DEFAULT 60,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS dashboard_modules (
  id TEXT PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  icon TEXT,
  route TEXT NOT NULL,
  available_for_plans TEXT[] DEFAULT ARRAY[]::TEXT[],
  available_for_roles TEXT[] DEFAULT ARRAY[]::TEXT[],
  display_order INT DEFAULT 0,
  enabled BOOLEAN DEFAULT TRUE,
  badge TEXT,
  config JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Dynamic Plans and Pricing

Provider plans must be DB-driven, not hard-coded.

```sql
CREATE TABLE IF NOT EXISTS plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  description_en TEXT,
  description_ar TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  is_recommended BOOLEAN DEFAULT FALSE,
  pricing JSONB NOT NULL DEFAULT '{}'::jsonb,
  trial_enabled BOOLEAN DEFAULT FALSE,
  trial_days INT DEFAULT 0,
  features JSONB NOT NULL DEFAULT '{}'::jsonb,
  available_for TEXT[] DEFAULT ARRAY['center','doctor'],
  available_in_countries TEXT[] DEFAULT ARRAY['OM'],
  pricing_change_policy JSONB DEFAULT '{"affectsExisting":false,"applyAtRenewal":true,"notifyUsersInAdvance":30}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Consent, Legal Documents, Notifications

```sql
CREATE TABLE IF NOT EXISTS legal_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_type TEXT NOT NULL,
  version TEXT NOT NULL,
  locale TEXT NOT NULL CHECK (locale IN ('en','ar')),
  title TEXT NOT NULL,
  content_html TEXT NOT NULL,
  effective_from TIMESTAMPTZ NOT NULL,
  effective_until TIMESTAMPTZ,
  requires_reacceptance BOOLEAN DEFAULT FALSE,
  change_summary TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(document_type, version, locale)
);

CREATE TABLE IF NOT EXISTS user_legal_acceptances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  document_version TEXT NOT NULL,
  document_locale TEXT NOT NULL CHECK (document_locale IN ('en','ar')),
  accepted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_country TEXT,
  user_agent_hash TEXT,
  context TEXT,
  UNIQUE(user_id, document_type, document_version)
);

CREATE TABLE IF NOT EXISTS consent_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  session_hash TEXT,
  consent_version TEXT NOT NULL,
  preferences JSONB NOT NULL,
  ip_country TEXT,
  user_agent_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  respect_ramadan BOOLEAN DEFAULT TRUE,
  max_per_day INT DEFAULT 2,
  max_per_week INT DEFAULT 7,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  user_agent_summary TEXT,
  locale TEXT CHECK (locale IN ('en','ar')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(endpoint)
);
```

## Payment Gateways and Webhook Logs

```sql
CREATE TABLE IF NOT EXISTS payment_gateways (
  id TEXT PRIMARY KEY,
  display_name_en TEXT NOT NULL,
  display_name_ar TEXT NOT NULL,
  provider TEXT NOT NULL,
  enabled BOOLEAN DEFAULT FALSE,
  priority INT DEFAULT 0,
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  test_mode BOOLEAN DEFAULT TRUE,
  min_amount NUMERIC(10,3),
  max_amount NUMERIC(10,3),
  enabled_currencies TEXT[] DEFAULT ARRAY['OMR'],
  enabled_for_plans TEXT[],
  enabled_for_countries TEXT[] DEFAULT ARRAY['OM'],
  total_processed NUMERIC(15,3) DEFAULT 0,
  success_rate NUMERIC(5,2),
  last_used_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payment_webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gateway_id TEXT NOT NULL REFERENCES payment_gateways(id),
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  signature TEXT,
  verified BOOLEAN DEFAULT FALSE,
  payment_id UUID,
  processed_at TIMESTAMPTZ,
  error TEXT,
  received_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Upgrade Nudges and Behavior Events

```sql
CREATE TABLE IF NOT EXISTS upgrade_nudges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  nudge_type TEXT NOT NULL,
  trigger_context JSONB DEFAULT '{}'::jsonb,
  current_plan TEXT,
  suggested_plan TEXT,
  shown_at TIMESTAMPTZ DEFAULT NOW(),
  action TEXT CHECK (action IN ('shown','clicked','dismissed','ignored','converted')),
  action_at TIMESTAMPTZ,
  converted_to_subscription_id UUID REFERENCES subscriptions(id)
);

CREATE TABLE IF NOT EXISTS behavior_events (
  id UUID DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
  event_category TEXT,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT TRUE,
  user_type TEXT,
  page_url TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_campaign TEXT,
  entity_type TEXT,
  entity_id UUID,
  properties JSONB DEFAULT '{}'::jsonb,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  country TEXT,
  city TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  date DATE GENERATED ALWAYS AS (created_at::date) STORED,
  PRIMARY KEY (id, date)
) PARTITION BY RANGE (date);

CREATE INDEX IF NOT EXISTS idx_behavior_events_name_date ON behavior_events(event_name, date);
CREATE INDEX IF NOT EXISTS idx_behavior_events_entity ON behavior_events(entity_type, entity_id, date);
CREATE INDEX IF NOT EXISTS idx_behavior_events_session ON behavior_events(session_id, date);
```

Implementation must create monthly partitions automatically or through a migration/cron process. Do not allow the parent partitioned table to become an unbounded write target without partitions.

## Search Synonyms and Query Logs

```sql
CREATE TABLE IF NOT EXISTS search_synonyms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  canonical_term TEXT NOT NULL,
  locale TEXT CHECK (locale IN ('en','ar')),
  variants TEXT[] NOT NULL,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS search_query_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query TEXT NOT NULL,
  normalized_query TEXT,
  locale TEXT CHECK (locale IN ('en','ar')),
  country_slug TEXT,
  result_count INT,
  clicked_entity_type TEXT,
  clicked_entity_id UUID,
  session_id TEXT,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Sponsored Slot Rule

Premium plan visibility must use clearly labeled sponsored slots, not silent organic ranking manipulation. Organic ranking stays relevance-based. Sponsored slots must be capped by placement, labeled in English and Arabic, and separated from organic results.
