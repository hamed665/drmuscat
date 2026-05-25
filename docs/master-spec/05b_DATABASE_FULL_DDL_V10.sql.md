# 05b_DATABASE_FULL_DDL_V10.sql.md

# DrMuscat Full Database DDL V10

This file is canonical fresh-schema SQL. Merge validation rules from `05c_DATABASE_EXECUTION_PATCH_AND_VALIDATION_V10.md` and mandatory ad-system supplement rules from `05d_AD_SYSTEM_DDL_SUPPLEMENT_V10.md` before generating the first migration.

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS postgis;

-- =========================
-- ENUMS
-- =========================
DO $$ BEGIN CREATE TYPE public.profile_role_type AS ENUM ('super_admin','admin','finance_manager','content_manager','center_owner','center_staff','doctor','marketer','user'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.profile_status AS ENUM ('active','suspended','archived'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.organization_type AS ENUM ('center','hospital','pharmacy','lab','pet_clinic','physiotherapy','beauty_clinic','wellness','marketer_company'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.verification_status AS ENUM ('unclaimed','claimed','verified','rejected'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.listing_status AS ENUM ('draft','published','hidden','archived'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.approval_status AS ENUM ('pending','approved','rejected','archived'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.media_status AS ENUM ('uploaded','pending_review','approved','rejected','archived'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.plan_target_type AS ENUM ('center','doctor','advertiser'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.subscriber_type AS ENUM ('organization','doctor','external_advertiser'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.owner_entity_type AS ENUM ('organization','doctor'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.billing_cycle_type AS ENUM ('monthly','6_month','annual'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.subscription_status AS ENUM ('pending','active','suspended','expired','cancelled'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.invoice_status AS ENUM ('draft','issued','paid','cancelled'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.payment_provider AS ENUM ('manual','bank_transfer','thawani','tap','paytabs','stripe'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.payment_status AS ENUM ('pending','paid','failed','refunded','cancelled'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.ledger_account_type AS ENUM ('marketer','organization','doctor','platform_revenue','platform_liability'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.transaction_type AS ENUM ('commission_earned','commission_paid','subscription_payment','refund','adjustment'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.ledger_entry_type AS ENUM ('debit','credit'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.lead_status AS ENUM ('new_lead','contacted','booked','visited','won','lost','no_answer','follow_up'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.sales_deal_status AS ENUM ('prospect','contacted','profile_sent','demo_done','negotiation','payment_pending','paid','lost'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.referral_status AS ENUM ('pending','converted','expired','cancelled'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.payout_status AS ENUM ('pending','approved','paid','rejected','cancelled'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.approval_entity_type AS ENUM ('organization','center','doctor_profile','doctor_claim','center_claim','license','media_photo','media_video','video_subtitle','offer','article','banner','ad_campaign','contract','microsite','payment_receipt'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.article_status AS ENUM ('draft','pending_review','approved','published','rejected','archived'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.article_type AS ENUM ('medical_education','service_guide','directory_guide','platform_guide','news_update','center_update'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.event_owner_type AS ENUM ('organization','center','doctor','article','microsite'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.public_event_type AS ENUM ('page_view','profile_view','doctor_view','article_view','whatsapp_click','call_click','direction_click','offer_click','video_play','gallery_open','microsite_view','search_performed','partner_form_start','partner_form_submit','claim_profile_click','claim_profile_submit','offer_claim','offer_redeem','review_submit','review_helpful_vote','start_chat','ai_lead_generated','center_signup_start','center_signup_submit','proposal_view','payment_receipt_upload'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.ad_campaign_type AS ENUM ('flat_sponsorship','cpc','cpm'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.ad_campaign_status AS ENUM ('draft','pending_review','approved','scheduled','active','paused','exhausted_budget','completed','rejected','cancelled','archived'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.ad_creative_status AS ENUM ('draft','pending_review','approved','rejected','archived'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.ad_booking_status AS ENUM ('requested','pending_payment','confirmed','active','completed','cancelled','rejected'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.ad_wallet_transaction_type AS ENUM ('top_up_requested','top_up_approved','top_up_rejected','debit_cpc_click','debit_cpm_batch','debit_flat_booking','refund','adjustment','expired_credit'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.ad_wallet_transaction_status AS ENUM ('pending','approved','rejected','posted','reversed','failed','cancelled'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.ad_event_type AS ENUM ('impression','click','whatsapp_click','call_click','direction_click','offer_claim','conversion'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.notification_channel AS ENUM ('in_app','email','whatsapp','sms'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.notification_type AS ENUM ('lead_alert','payment_success','payment_pending','approval_needed','approval_result','subscription_expiring','system'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =========================
-- FUNCTIONS
-- =========================
CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.generate_invoice_number() RETURNS TEXT AS $$
DECLARE next_num BIGINT;
BEGIN
  SELECT COALESCE(MAX((regexp_match(invoice_number, 'INV-[0-9]{4}-([0-9]+)'))[1]::BIGINT), 0) + 1 INTO next_num FROM public.invoices WHERE invoice_number LIKE 'INV-' || EXTRACT(YEAR FROM NOW())::TEXT || '-%';
  RETURN 'INV-' || EXTRACT(YEAR FROM NOW())::TEXT || '-' || LPAD(next_num::TEXT, 6, '0');
EXCEPTION WHEN undefined_table THEN RETURN 'INV-' || EXTRACT(YEAR FROM NOW())::TEXT || '-000001';
END; $$ LANGUAGE plpgsql;

-- =========================
-- PROFILES / ROLES
-- =========================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT,
  phone_number TEXT UNIQUE,
  avatar_url TEXT,
  country_code VARCHAR(5) DEFAULT '+968',
  preferred_language VARCHAR(5) DEFAULT 'en',
  status public.profile_status NOT NULL DEFAULT 'active',
  phone_verified_at TIMESTAMP WITH TIME ZONE,
  email_verified_at TIMESTAMP WITH TIME ZONE,
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT phone_number_e164_check CHECK (phone_number IS NULL OR phone_number ~ '^\+[1-9][0-9]{7,14}$')
);
CREATE TABLE IF NOT EXISTS public.profile_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role_name public.profile_role_type NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(profile_id, role_name)
);

CREATE OR REPLACE FUNCTION public.handle_new_auth_user() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id,email,phone_number,full_name,phone_verified_at,email_verified_at,created_at,updated_at)
  VALUES (NEW.id, NEW.email, NEW.phone, COALESCE(NEW.raw_user_meta_data->>'full_name',''), CASE WHEN NEW.phone IS NOT NULL THEN NOW() ELSE NULL END, NEW.email_confirmed_at, NOW(), NOW())
  ON CONFLICT (id) DO UPDATE SET email=COALESCE(EXCLUDED.email, public.profiles.email), phone_number=COALESCE(EXCLUDED.phone_number, public.profiles.phone_number), updated_at=NOW();
  INSERT INTO public.profile_roles(profile_id, role_name) VALUES (NEW.id, 'user') ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- =========================
-- DIRECTORY CORE
-- =========================
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type public.organization_type NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  owner_profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status public.verification_status DEFAULT 'unclaimed',
  name_official TEXT NOT NULL,
  name_en TEXT, name_ar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role_name TEXT NOT NULL CHECK (role_name IN ('owner','manager','staff')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(organization_id, profile_id)
);
CREATE TABLE IF NOT EXISTS public.areas (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), slug TEXT UNIQUE NOT NULL, name_en TEXT NOT NULL, name_ar TEXT NOT NULL, city TEXT DEFAULT 'Muscat', country TEXT DEFAULT 'Oman', latitude DOUBLE PRECISION, longitude DOUBLE PRECISION);
CREATE TABLE IF NOT EXISTS public.categories (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), slug TEXT UNIQUE NOT NULL, name_en TEXT NOT NULL, name_ar TEXT NOT NULL, is_active BOOLEAN DEFAULT TRUE);
CREATE TABLE IF NOT EXISTS public.services (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE, slug TEXT UNIQUE NOT NULL, name_en TEXT NOT NULL, name_ar TEXT NOT NULL);

CREATE TABLE IF NOT EXISTS public.centers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL, category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL, area_id UUID REFERENCES public.areas(id) ON DELETE SET NULL,
  name_en TEXT, name_ar TEXT,
  description_en TEXT, description_ar TEXT,
  short_description_en TEXT, short_description_ar TEXT,
  google_maps_url TEXT, whatsapp_number TEXT, call_number TEXT, website_url TEXT, instagram_url TEXT, email TEXT,
  working_hours JSONB DEFAULT '{}'::jsonb,
  latitude DOUBLE PRECISION, longitude DOUBLE PRECISION, location geography(Point,4326),
  is_offer_partner BOOLEAN DEFAULT FALSE, discount_percentage NUMERIC(5,2) DEFAULT 0 CHECK(discount_percentage>=0 AND discount_percentage<=100), finance_available BOOLEAN DEFAULT FALSE, is_featured BOOLEAN DEFAULT FALSE,
  listing_status public.listing_status DEFAULT 'draft', response_score NUMERIC(3,2) DEFAULT 1, profile_completion_score NUMERIC(3,2) DEFAULT 0, partner_score NUMERIC(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  slug TEXT UNIQUE NOT NULL, gender VARCHAR(10) CHECK(gender IS NULL OR gender IN ('male','female')), languages_spoken TEXT[] DEFAULT '{en,ar}', profile_photo_url TEXT, cover_photo_url TEXT, years_experience INT DEFAULT 0 CHECK(years_experience>=0),
  name_en TEXT NOT NULL, name_ar TEXT NOT NULL,
  main_specialty_en TEXT NOT NULL, main_specialty_ar TEXT NOT NULL,
  bio_en TEXT, bio_ar TEXT,
  verification_status public.verification_status DEFAULT 'unclaimed', listing_status public.listing_status DEFAULT 'draft', is_partner BOOLEAN DEFAULT FALSE, is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.doctor_organizations (doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE, organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE, is_primary BOOLEAN DEFAULT FALSE, PRIMARY KEY(doctor_id, organization_id));
CREATE TABLE IF NOT EXISTS public.doctor_centers (doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE, center_id UUID REFERENCES public.centers(id) ON DELETE CASCADE, organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE, is_primary BOOLEAN DEFAULT FALSE, status public.listing_status DEFAULT 'published', created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), PRIMARY KEY(doctor_id, center_id));
CREATE TABLE IF NOT EXISTS public.center_services (center_id UUID REFERENCES public.centers(id) ON DELETE CASCADE, service_id UUID REFERENCES public.services(id) ON DELETE CASCADE, price NUMERIC(10,3) CHECK(price IS NULL OR price>=0), PRIMARY KEY(center_id, service_id));

-- =========================
-- APPROVAL / AUDIT
-- =========================
CREATE TABLE IF NOT EXISTS public.license_verifications (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), target_type public.owner_entity_type NOT NULL, target_id UUID NOT NULL, license_number TEXT NOT NULL, license_authority TEXT DEFAULT 'MOH Oman', license_expiry_date DATE NOT NULL, license_file_url TEXT NOT NULL, status public.approval_status DEFAULT 'pending', reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL, reviewed_at TIMESTAMP WITH TIME ZONE, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());
CREATE TABLE IF NOT EXISTS public.approval_requests (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), entity_type public.approval_entity_type NOT NULL, entity_id UUID NOT NULL, requested_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL, status public.approval_status DEFAULT 'pending', reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL, reviewed_at TIMESTAMP WITH TIME ZONE, admin_notes TEXT, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());
CREATE TABLE IF NOT EXISTS public.claim_requests (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), target_type public.owner_entity_type NOT NULL, target_id UUID NOT NULL, requested_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL, requester_name TEXT NOT NULL, requester_phone TEXT NOT NULL, requester_email TEXT NOT NULL, requester_position TEXT NOT NULL, verification_notes TEXT, status public.approval_status DEFAULT 'pending', reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL, reviewed_at TIMESTAMP WITH TIME ZONE, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());
CREATE TABLE IF NOT EXISTS public.data_sources (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), target_type public.owner_entity_type NOT NULL, target_id UUID NOT NULL, source_name TEXT DEFAULT 'public_web', source_url TEXT, source_notes TEXT, last_verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());
CREATE TABLE IF NOT EXISTS public.audit_logs (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), request_id TEXT, actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, action TEXT NOT NULL, entity_type TEXT NOT NULL, entity_id UUID NOT NULL, old_values JSONB, new_values JSONB, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());

-- =========================
-- BILLING / LEDGER
-- =========================
CREATE TABLE IF NOT EXISTS public.plans (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), target_type public.plan_target_type NOT NULL, name TEXT NOT NULL, price_monthly NUMERIC(10,3) NOT NULL CHECK(price_monthly>=0), price_6_month NUMERIC(10,3) NOT NULL CHECK(price_6_month>=0), price_annual NUMERIC(10,3) NOT NULL CHECK(price_annual>=0), features JSONB NOT NULL DEFAULT '{}'::jsonb, default_commission_percentage NUMERIC(5,2) DEFAULT 0 CHECK(default_commission_percentage>=0), is_active BOOLEAN DEFAULT TRUE, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());
CREATE TABLE IF NOT EXISTS public.subscriptions (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), subscriber_type public.subscriber_type NOT NULL, subscriber_id UUID NOT NULL, plan_id UUID REFERENCES public.plans(id) ON DELETE RESTRICT, billing_cycle public.billing_cycle_type NOT NULL, amount NUMERIC(10,3) NOT NULL CHECK(amount>=0), discount_amount NUMERIC(10,3) DEFAULT 0 CHECK(discount_amount>=0), final_amount NUMERIC(10,3) NOT NULL CHECK(final_amount>=0), status public.subscription_status NOT NULL DEFAULT 'pending', start_date TIMESTAMP WITH TIME ZONE, end_date TIMESTAMP WITH TIME ZONE, activated_at TIMESTAMP WITH TIME ZONE, expired_at TIMESTAMP WITH TIME ZONE, suspended_at TIMESTAMP WITH TIME ZONE, cancelled_at TIMESTAMP WITH TIME ZONE, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());
CREATE TABLE IF NOT EXISTS public.invoices (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), subscriber_type public.subscriber_type NOT NULL, subscriber_id UUID NOT NULL, subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL, invoice_number TEXT UNIQUE NOT NULL DEFAULT public.generate_invoice_number(), amount NUMERIC(10,3) NOT NULL CHECK(amount>=0), currency VARCHAR(3) DEFAULT 'OMR', status public.invoice_status DEFAULT 'draft', due_date DATE, paid_at TIMESTAMP WITH TIME ZONE, pdf_url TEXT, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());
CREATE TABLE IF NOT EXISTS public.payments (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), subscriber_type public.subscriber_type NOT NULL, subscriber_id UUID NOT NULL, subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL, invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL, provider public.payment_provider DEFAULT 'manual', provider_reference TEXT, amount NUMERIC(10,3) NOT NULL CHECK(amount>=0), currency VARCHAR(3) DEFAULT 'OMR', receipt_file_url TEXT, receipt_media_asset_id UUID, status public.payment_status DEFAULT 'pending', created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());
CREATE TABLE IF NOT EXISTS public.ledger_accounts (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), account_type public.ledger_account_type NOT NULL, account_id UUID NOT NULL, currency VARCHAR(3) DEFAULT 'OMR', status TEXT DEFAULT 'active' CHECK(status IN ('active','frozen','archived')), created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), UNIQUE(account_type,account_id,currency));
CREATE TABLE IF NOT EXISTS public.ledger_transactions (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), transaction_type public.transaction_type NOT NULL, description TEXT, created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());
CREATE TABLE IF NOT EXISTS public.ledger_entries (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), transaction_group_id UUID REFERENCES public.ledger_transactions(id) ON DELETE CASCADE, ledger_account_id UUID REFERENCES public.ledger_accounts(id) ON DELETE RESTRICT, entry_type public.ledger_entry_type NOT NULL, amount NUMERIC(10,3) NOT NULL CHECK(amount>0), reason TEXT, related_payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL, related_subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());
CREATE TABLE IF NOT EXISTS public.referral_codes (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), owner_profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE, code TEXT UNIQUE NOT NULL, default_commission_percentage NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK(default_commission_percentage>=0), status TEXT DEFAULT 'active' CHECK(status IN ('active','expired','disabled')), created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());
CREATE TABLE IF NOT EXISTS public.referrals (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), referral_code_id UUID REFERENCES public.referral_codes(id) ON DELETE RESTRICT, referrer_profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE, target_type public.subscriber_type NOT NULL, target_id UUID NOT NULL, status public.referral_status DEFAULT 'pending', created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());
CREATE TABLE IF NOT EXISTS public.commission_rules (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), role_name public.profile_role_type NOT NULL, plan_id UUID REFERENCES public.plans(id) ON DELETE CASCADE, commission_percentage NUMERIC(5,2) NOT NULL CHECK(commission_percentage>=0), is_active BOOLEAN DEFAULT TRUE, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());
CREATE TABLE IF NOT EXISTS public.commission_payouts (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, amount NUMERIC(10,3) NOT NULL CHECK(amount>0), currency VARCHAR(3) DEFAULT 'OMR', payment_method TEXT NOT NULL CHECK(payment_method IN ('bank_transfer','cash','manual')), payment_reference TEXT, status public.payout_status DEFAULT 'pending', paid_at TIMESTAMP WITH TIME ZONE, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());

-- =========================
-- CRM
-- =========================
CREATE TABLE IF NOT EXISTS public.leads (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), owner_type public.owner_entity_type NOT NULL, owner_id UUID NOT NULL, lead_name TEXT NOT NULL, lead_phone TEXT NOT NULL, lead_language VARCHAR(5) DEFAULT 'en', requested_service_id UUID REFERENCES public.services(id) ON DELETE SET NULL, source TEXT DEFAULT 'web_form', status public.lead_status DEFAULT 'new_lead', assigned_to_profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, next_follow_up_at TIMESTAMP WITH TIME ZONE, lost_reason TEXT, won_at TIMESTAMP WITH TIME ZONE, last_contacted_at TIMESTAMP WITH TIME ZONE, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());
CREATE TABLE IF NOT EXISTS public.sales_deals (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), target_type public.subscriber_type, target_id UUID, lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL, center_id UUID REFERENCES public.centers(id) ON DELETE SET NULL, assigned_marketer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, assigned_to_profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, status public.sales_deal_status DEFAULT 'prospect', expected_amount NUMERIC(10,3) DEFAULT 0 CHECK(expected_amount>=0), amount NUMERIC(10,3) CHECK(amount IS NULL OR amount>=0), currency VARCHAR(3) DEFAULT 'OMR', next_follow_up TIMESTAMP WITH TIME ZONE, lost_reason TEXT, closed_at TIMESTAMP WITH TIME ZONE, last_contacted_at TIMESTAMP WITH TIME ZONE, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());
CREATE TABLE IF NOT EXISTS public.lead_notes (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE, author_profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, note TEXT NOT NULL, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());
CREATE TABLE IF NOT EXISTS public.sales_deal_notes (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), deal_id UUID REFERENCES public.sales_deals(id) ON DELETE CASCADE, author_profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, note TEXT NOT NULL, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());

-- =========================
-- MEDIA / MICROSITE / ADS
-- =========================
CREATE TABLE IF NOT EXISTS public.media_assets (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), owner_type TEXT NOT NULL, owner_id UUID NOT NULL, media_role TEXT NOT NULL, file_url TEXT NOT NULL, storage_bucket TEXT, storage_path TEXT, alt_text_en TEXT, alt_text_ar TEXT, sort_order INT DEFAULT 0, file_type TEXT, mime_type TEXT, file_size INT CHECK(file_size IS NULL OR file_size>=0), status public.media_status DEFAULT 'uploaded', created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='payments_receipt_media_asset_id_fkey') THEN ALTER TABLE public.payments ADD CONSTRAINT payments_receipt_media_asset_id_fkey FOREIGN KEY(receipt_media_asset_id) REFERENCES public.media_assets(id) ON DELETE SET NULL; END IF; END $$;
CREATE TABLE IF NOT EXISTS public.videos (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), owner_type public.owner_entity_type NOT NULL, owner_id UUID NOT NULL, title TEXT NOT NULL, youtube_url TEXT, youtube_video_id TEXT NOT NULL CHECK(youtube_video_id ~ '^[A-Za-z0-9_-]{11}$'), thumbnail_url TEXT, main_language VARCHAR(5) DEFAULT 'en', status public.approval_status DEFAULT 'pending', created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());
CREATE TABLE IF NOT EXISTS public.video_subtitles (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE, language VARCHAR(5) NOT NULL, srt_url TEXT, transcript_text TEXT, status public.approval_status DEFAULT 'pending');
CREATE TABLE IF NOT EXISTS public.microsites (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), owner_type public.owner_entity_type NOT NULL, owner_id UUID NOT NULL, subdomain TEXT UNIQUE NOT NULL, custom_domain TEXT UNIQUE, template_key TEXT DEFAULT 'default_clean', status public.approval_status DEFAULT 'pending', seo_indexing_mode TEXT DEFAULT 'canonical_to_main' CHECK(seo_indexing_mode IN ('canonical_to_main','noindex','indexable','redirect_to_main')), canonical_url TEXT NOT NULL, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());
CREATE TABLE IF NOT EXISTS public.ad_placements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  page_type TEXT NOT NULL,
  position TEXT NOT NULL,
  size TEXT NOT NULL,
  pricing_model public.ad_campaign_type NOT NULL DEFAULT 'flat_sponsorship',
  base_price NUMERIC(10,3) DEFAULT 0 CHECK(base_price >= 0),
  currency VARCHAR(3) DEFAULT 'OMR',
  max_active INT DEFAULT 1 CHECK(max_active >= 1),
  rotation_model TEXT DEFAULT 'standard' CHECK(rotation_model IN ('standard','weighted','exclusive')),
  is_exclusive BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  rules JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ad_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_type public.subscriber_type NOT NULL,
  owner_id UUID NOT NULL,
  currency VARCHAR(3) DEFAULT 'OMR',
  balance_amount NUMERIC(12,3) NOT NULL DEFAULT 0 CHECK(balance_amount >= 0),
  reserved_amount NUMERIC(12,3) NOT NULL DEFAULT 0 CHECK(reserved_amount >= 0),
  lifetime_top_up_amount NUMERIC(12,3) NOT NULL DEFAULT 0 CHECK(lifetime_top_up_amount >= 0),
  lifetime_spent_amount NUMERIC(12,3) NOT NULL DEFAULT 0 CHECK(lifetime_spent_amount >= 0),
  status TEXT DEFAULT 'active' CHECK(status IN ('active','frozen','closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(owner_type, owner_id, currency),
  CHECK(balance_amount >= reserved_amount)
);

CREATE TABLE IF NOT EXISTS public.ad_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  advertiser_type public.subscriber_type NOT NULL,
  advertiser_id UUID NOT NULL,
  wallet_id UUID REFERENCES public.ad_wallets(id) ON DELETE RESTRICT,
  placement_id UUID REFERENCES public.ad_placements(id) ON DELETE RESTRICT,
  creative_id UUID,
  campaign_type public.ad_campaign_type NOT NULL DEFAULT 'flat_sponsorship',
  title TEXT NOT NULL,
  target_url TEXT NOT NULL,
  targeting JSONB NOT NULL DEFAULT '{}'::jsonb,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  bid_amount NUMERIC(10,3) DEFAULT 0 CHECK(bid_amount >= 0),
  flat_price NUMERIC(10,3) DEFAULT 0 CHECK(flat_price >= 0),
  daily_budget NUMERIC(10,3) DEFAULT 0 CHECK(daily_budget >= 0),
  total_budget NUMERIC(10,3) DEFAULT 0 CHECK(total_budget >= 0),
  spent_amount NUMERIC(10,3) DEFAULT 0 CHECK(spent_amount >= 0),
  currency VARCHAR(3) DEFAULT 'OMR',
  status public.ad_campaign_status DEFAULT 'draft',
  review_notes TEXT,
  approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  approved_at TIMESTAMP WITH TIME ZONE,
  paused_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK(end_date >= start_date),
  CHECK(total_budget = 0 OR spent_amount <= total_budget)
);

CREATE TABLE IF NOT EXISTS public.ad_creatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES public.ad_campaigns(id) ON DELETE CASCADE,
  media_asset_id UUID REFERENCES public.media_assets(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  headline TEXT,
  body TEXT,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  cta_label TEXT DEFAULT 'Learn more',
  target_url TEXT NOT NULL,
  language VARCHAR(5) DEFAULT 'en',
  status public.ad_creative_status DEFAULT 'draft',
  rejection_reason TEXT,
  approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname='ad_campaigns_creative_id_fkey'
  ) THEN
    ALTER TABLE public.ad_campaigns
      ADD CONSTRAINT ad_campaigns_creative_id_fkey FOREIGN KEY (creative_id) REFERENCES public.ad_creatives(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.ad_pricing_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  placement_id UUID REFERENCES public.ad_placements(id) ON DELETE CASCADE,
  campaign_type public.ad_campaign_type NOT NULL,
  page_type TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  area_id UUID REFERENCES public.areas(id) ON DELETE SET NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  price NUMERIC(10,3) NOT NULL CHECK(price >= 0),
  min_budget NUMERIC(10,3) DEFAULT 0 CHECK(min_budget >= 0),
  currency VARCHAR(3) DEFAULT 'OMR',
  starts_at TIMESTAMP WITH TIME ZONE,
  ends_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  rules JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK(ends_at IS NULL OR starts_at IS NULL OR ends_at >= starts_at)
);

CREATE TABLE IF NOT EXISTS public.ad_placement_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES public.ad_campaigns(id) ON DELETE CASCADE,
  placement_id UUID REFERENCES public.ad_placements(id) ON DELETE RESTRICT,
  advertiser_type public.subscriber_type NOT NULL,
  advertiser_id UUID NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  booked_price NUMERIC(10,3) DEFAULT 0 CHECK(booked_price >= 0),
  currency VARCHAR(3) DEFAULT 'OMR',
  status public.ad_booking_status DEFAULT 'requested',
  exclusive BOOLEAN DEFAULT FALSE,
  approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK(end_date >= start_date)
);

CREATE TABLE IF NOT EXISTS public.ad_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES public.ad_campaigns(id) ON DELETE CASCADE,
  placement_id UUID REFERENCES public.ad_placements(id) ON DELETE SET NULL,
  creative_id UUID REFERENCES public.ad_creatives(id) ON DELETE SET NULL,
  event_type public.ad_event_type NOT NULL,
  page_url TEXT,
  referrer_url TEXT,
  session_id_hash TEXT,
  ip_hash TEXT,
  user_agent_hash TEXT,
  idempotency_key TEXT,
  billed_amount NUMERIC(10,3) DEFAULT 0 CHECK(billed_amount >= 0),
  currency VARCHAR(3) DEFAULT 'OMR',
  fraud_score NUMERIC(5,2) DEFAULT 0 CHECK(fraud_score >= 0),
  is_billable BOOLEAN DEFAULT FALSE,
  is_billed BOOLEAN DEFAULT FALSE,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ad_wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID REFERENCES public.ad_wallets(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES public.ad_campaigns(id) ON DELETE SET NULL,
  ad_event_id UUID REFERENCES public.ad_events(id) ON DELETE SET NULL,
  transaction_type public.ad_wallet_transaction_type NOT NULL,
  status public.ad_wallet_transaction_status DEFAULT 'pending',
  amount NUMERIC(12,3) NOT NULL CHECK(amount >= 0),
  currency VARCHAR(3) DEFAULT 'OMR',
  balance_before NUMERIC(12,3),
  balance_after NUMERIC(12,3),
  external_reference TEXT,
  idempotency_key TEXT,
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================
-- HEALTH CARD / CONTENT / EVENTS
-- =========================
CREATE TABLE IF NOT EXISTS public.patient_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_type public.owner_entity_type NOT NULL,
  owner_id UUID NOT NULL,
  title_en TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  description_en TEXT,
  description_ar TEXT,
  benefit_type TEXT DEFAULT 'discount' CHECK (benefit_type IN ('discount','free_consultation','package','cashback','other')),
  discount_percentage NUMERIC(5,2) CHECK(discount_percentage IS NULL OR (discount_percentage>=0 AND discount_percentage<=100)),
  terms_en TEXT,
  terms_ar TEXT,
  start_date DATE,
  end_date DATE,
  status public.approval_status DEFAULT 'pending',
  requires_login BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.articles (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), slug TEXT UNIQUE NOT NULL, type public.article_type NOT NULL, status public.article_status DEFAULT 'draft', author_profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, medical_reviewer_doctor_id UUID REFERENCES public.doctors(id) ON DELETE SET NULL, primary_locale VARCHAR(5) DEFAULT 'en', title_en TEXT NOT NULL, title_ar TEXT, excerpt_en TEXT, excerpt_ar TEXT, content_en TEXT, content_ar TEXT, meta_title_en TEXT, meta_title_ar TEXT, meta_description_en TEXT, meta_description_ar TEXT, canonical_url TEXT, robots_index BOOLEAN DEFAULT TRUE, locale_indexing JSONB NOT NULL DEFAULT '{"en": true, "ar": true}', featured_image_media_id UUID REFERENCES public.media_assets(id) ON DELETE SET NULL, ai_metadata JSONB NOT NULL DEFAULT '{}'::jsonb, editorial_notes TEXT, reviewer_notes TEXT, reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL, reviewed_at TIMESTAMP WITH TIME ZONE, category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL, service_id UUID REFERENCES public.services(id) ON DELETE SET NULL, published_at TIMESTAMP WITH TIME ZONE, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());
CREATE TABLE IF NOT EXISTS public.events (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), owner_type public.event_owner_type NOT NULL, owner_id UUID, event_type public.public_event_type NOT NULL, locale VARCHAR(5) DEFAULT 'en', page_url TEXT, referrer TEXT, utm_source TEXT, utm_medium TEXT, utm_campaign TEXT, session_id_hash TEXT, ip_hash TEXT, user_agent_hash TEXT, metadata JSONB DEFAULT '{}'::jsonb, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());
CREATE TABLE IF NOT EXISTS public.notifications (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE, title TEXT NOT NULL, message TEXT NOT NULL, type public.notification_type NOT NULL, channel public.notification_channel NOT NULL, status TEXT DEFAULT 'unread' CHECK(status IN ('unread','read','archived')), created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());
CREATE TABLE IF NOT EXISTS public.settings (key TEXT PRIMARY KEY, value JSONB NOT NULL, updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());



-- =========================
-- V10 SECURITY HELPER FUNCTIONS
-- =========================
CREATE OR REPLACE FUNCTION public.has_role(role_to_check public.profile_role_type)
RETURNS BOOLEAN AS $$
BEGIN
  IF auth.uid() IS NULL THEN RETURN FALSE; END IF;
  RETURN EXISTS (
    SELECT 1 FROM public.profile_roles pr
    WHERE pr.profile_id = auth.uid()
      AND pr.role_name = role_to_check
      AND pr.status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path=public;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN public.has_role('admin') OR public.has_role('super_admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path=public;

CREATE OR REPLACE FUNCTION public.is_org_member(org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  IF auth.uid() IS NULL OR org_id IS NULL THEN RETURN FALSE; END IF;
  RETURN EXISTS (
    SELECT 1 FROM public.organization_members om
    WHERE om.profile_id = auth.uid()
      AND om.organization_id = org_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path=public;

CREATE OR REPLACE FUNCTION public.has_org_role(org_id UUID, role_to_check TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  IF auth.uid() IS NULL OR org_id IS NULL THEN RETURN FALSE; END IF;
  RETURN EXISTS (
    SELECT 1 FROM public.organization_members om
    WHERE om.profile_id = auth.uid()
      AND om.organization_id = org_id
      AND om.role_name = role_to_check
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path=public;

CREATE OR REPLACE FUNCTION public.owns_doctor_profile(doctor_id_to_check UUID)
RETURNS BOOLEAN AS $$
BEGIN
  IF auth.uid() IS NULL OR doctor_id_to_check IS NULL THEN RETURN FALSE; END IF;
  RETURN EXISTS (
    SELECT 1 FROM public.doctors d
    WHERE d.id = doctor_id_to_check
      AND d.profile_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path=public;

-- =========================
-- RPC STUBS WITH SIGNATURES
-- =========================
CREATE OR REPLACE FUNCTION public.create_manual_subscription_transaction(_subscriber_type public.subscriber_type,_subscriber_id UUID,_plan_id UUID,_billing_cycle public.billing_cycle_type,_amount NUMERIC,_receipt_media_id UUID,_actor_id UUID) RETURNS UUID AS $$ BEGIN RAISE EXCEPTION 'Not implemented until billing phase'; END; $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path=public;
CREATE OR REPLACE FUNCTION public.approve_manual_payment_and_activate_subscription(_payment_id UUID,_actor_id UUID) RETURNS UUID AS $$ BEGIN RAISE EXCEPTION 'Not implemented until billing phase'; END; $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path=public;
CREATE OR REPLACE FUNCTION public.create_balanced_ledger_transaction(_transaction_type public.transaction_type,_description TEXT,_entries JSONB,_actor_id UUID) RETURNS UUID AS $$ BEGIN RAISE EXCEPTION 'Not implemented until billing phase'; END; $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path=public;


-- =========================
-- V10 GROWTH / REVIEWS / AI CHAT / REPORTING ADDITIONS
-- =========================
DO $$ BEGIN CREATE TYPE public.review_status AS ENUM ('pending','approved','rejected','hidden','disputed'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.review_visibility AS ENUM ('public','private_feedback'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.review_verification_source AS ENUM ('community','offer_claim','appointment_request','admin_verified','center_confirmed'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.review_visit_type AS ENUM ('in_person','online','phone_whatsapp','unknown'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.review_vote_type AS ENUM ('helpful','not_helpful'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.review_report_reason AS ENUM ('fake_experience','offensive_language','personal_medical_information','defamation_or_accusation','wrong_center','spam','privacy','other'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.review_report_status AS ENUM ('open','reviewed','dismissed','action_taken'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.ai_chat_role AS ENUM ('user','assistant','system','tool'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.ai_chat_user_type AS ENUM ('patient','center','admin','anonymous'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.ai_chat_status AS ENUM ('active','closed','flagged','disabled'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.offer_claim_status AS ENUM ('claimed','redeemed','expired','cancelled','invalid'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.sales_activity_type AS ENUM ('call','whatsapp','email','meeting','proposal','follow_up','note','payment','contract'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.proposal_status AS ENUM ('draft','sent','viewed','accepted','rejected','expired'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.contract_status AS ENUM ('draft','sent','signed','active','expired','cancelled'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  center_id UUID NOT NULL REFERENCES public.centers(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE SET NULL,
  visit_type public.review_visit_type DEFAULT 'unknown',
  visibility public.review_visibility DEFAULT 'public',
  rating_overall INT NOT NULL CHECK (rating_overall BETWEEN 1 AND 5),
  rating_cleanliness INT CHECK (rating_cleanliness BETWEEN 1 AND 5),
  rating_staff_behavior INT CHECK (rating_staff_behavior BETWEEN 1 AND 5),
  rating_waiting_time INT CHECK (rating_waiting_time BETWEEN 1 AND 5),
  rating_doctor_communication INT CHECK (rating_doctor_communication BETWEEN 1 AND 5),
  rating_price_clarity INT CHECK (rating_price_clarity BETWEEN 1 AND 5),
  rating_booking_experience INT CHECK (rating_booking_experience BETWEEN 1 AND 5),
  rating_location_parking INT CHECK (rating_location_parking BETWEEN 1 AND 5),
  rating_service_satisfaction INT CHECK (rating_service_satisfaction BETWEEN 1 AND 5),
  title TEXT,
  body TEXT,
  language VARCHAR(5) DEFAULT 'en',
  is_verified_experience BOOLEAN DEFAULT FALSE,
  verification_source public.review_verification_source DEFAULT 'community',
  status public.review_status DEFAULT 'pending',
  moderation_reason TEXT,
  contains_medical_data_detected BOOLEAN DEFAULT FALSE,
  contains_personal_data_detected BOOLEAN DEFAULT FALSE,
  suspicious_score NUMERIC(5,2) DEFAULT 0 CHECK (suspicious_score >= 0),
  helpful_count INT DEFAULT 0 CHECK (helpful_count >= 0),
  not_helpful_count INT DEFAULT 0 CHECK (not_helpful_count >= 0),
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_user_center_created ON public.reviews(center_id, user_id, created_at DESC) WHERE user_id IS NOT NULL;
-- The one-review-per-user-per-center-per-90-days rule must be enforced in the application/server action because PostgreSQL cannot express a rolling 90-day partial unique constraint safely.

CREATE TABLE IF NOT EXISTS public.review_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  anonymous_session_id_hash TEXT,
  vote_type public.review_vote_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT review_vote_actor_required CHECK (user_id IS NOT NULL OR anonymous_session_id_hash IS NOT NULL)
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_review_votes_user ON public.review_votes(review_id, user_id) WHERE user_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS uq_review_votes_anon ON public.review_votes(review_id, anonymous_session_id_hash) WHERE anonymous_session_id_hash IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.review_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reason public.review_report_reason NOT NULL,
  details TEXT,
  status public.review_report_status DEFAULT 'open',
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.center_review_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  center_id UUID NOT NULL REFERENCES public.centers(id) ON DELETE CASCADE,
  responder_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  body TEXT NOT NULL,
  status public.review_status DEFAULT 'pending',
  moderation_reason TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.review_moderation_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID REFERENCES public.reviews(id) ON DELETE CASCADE,
  response_id UUID REFERENCES public.center_review_responses(id) ON DELETE CASCADE,
  moderator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  reason TEXT,
  before_snapshot JSONB,
  after_snapshot JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ai_chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  anonymous_session_id_hash TEXT,
  user_type public.ai_chat_user_type DEFAULT 'anonymous',
  locale VARCHAR(5) DEFAULT 'en',
  status public.ai_chat_status DEFAULT 'active',
  safety_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ai_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.ai_chat_sessions(id) ON DELETE CASCADE,
  role public.ai_chat_role NOT NULL,
  content TEXT NOT NULL,
  safety_category TEXT,
  source_refs JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ai_chat_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.ai_chat_sessions(id) ON DELETE SET NULL,
  center_id UUID REFERENCES public.centers(id) ON DELETE SET NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  intent TEXT NOT NULL,
  area_slug TEXT,
  lead_phone TEXT,
  whatsapp_clicked BOOLEAN DEFAULT FALSE,
  call_clicked BOOLEAN DEFAULT FALSE,
  direction_clicked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.offer_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id UUID NOT NULL REFERENCES public.patient_offers(id) ON DELETE CASCADE,
  center_id UUID REFERENCES public.centers(id) ON DELETE SET NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  anonymous_session_id_hash TEXT,
  claim_code TEXT UNIQUE NOT NULL,
  status public.offer_claim_status DEFAULT 'claimed',
  source_event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  redeemed_by_profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  redeemed_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.center_scorecards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  center_id UUID NOT NULL REFERENCES public.centers(id) ON DELETE CASCADE,
  visibility_score NUMERIC(5,2) DEFAULT 0 CHECK (visibility_score >= 0 AND visibility_score <= 100),
  profile_completion_score NUMERIC(5,2) DEFAULT 0 CHECK (profile_completion_score >= 0 AND profile_completion_score <= 100),
  missing_items JSONB DEFAULT '[]'::jsonb,
  recommendations JSONB DEFAULT '[]'::jsonb,
  generated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.center_analytics_daily (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  center_id UUID NOT NULL REFERENCES public.centers(id) ON DELETE CASCADE,
  report_date DATE NOT NULL,
  profile_views INT DEFAULT 0 CHECK (profile_views >= 0),
  whatsapp_clicks INT DEFAULT 0 CHECK (whatsapp_clicks >= 0),
  call_clicks INT DEFAULT 0 CHECK (call_clicks >= 0),
  direction_clicks INT DEFAULT 0 CHECK (direction_clicks >= 0),
  offer_claims INT DEFAULT 0 CHECK (offer_claims >= 0),
  offer_redemptions INT DEFAULT 0 CHECK (offer_redemptions >= 0),
  review_submissions INT DEFAULT 0 CHECK (review_submissions >= 0),
  ai_leads INT DEFAULT 0 CHECK (ai_leads >= 0),
  source_breakdown JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(center_id, report_date)
);

CREATE TABLE IF NOT EXISTS public.center_monthly_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  center_id UUID NOT NULL REFERENCES public.centers(id) ON DELETE CASCADE,
  report_month DATE NOT NULL,
  summary JSONB NOT NULL DEFAULT '{}'::jsonb,
  pdf_url TEXT,
  generated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sent_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(center_id, report_month)
);

CREATE TABLE IF NOT EXISTS public.sales_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sales_deal_id UUID REFERENCES public.sales_deals(id) ON DELETE CASCADE,
  center_id UUID REFERENCES public.centers(id) ON DELETE SET NULL,
  actor_profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  activity_type public.sales_activity_type NOT NULL,
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  next_follow_up_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.sales_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sales_deal_id UUID REFERENCES public.sales_deals(id) ON DELETE SET NULL,
  center_id UUID REFERENCES public.centers(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES public.plans(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  proposed_amount NUMERIC(10,3) NOT NULL CHECK (proposed_amount >= 0),
  currency VARCHAR(3) DEFAULT 'OMR',
  billing_cycle public.billing_cycle_type NOT NULL,
  features JSONB DEFAULT '{}'::jsonb,
  valid_until DATE,
  status public.proposal_status DEFAULT 'draft',
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  sent_at TIMESTAMP WITH TIME ZONE,
  viewed_at TIMESTAMP WITH TIME ZONE,
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.center_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  center_id UUID REFERENCES public.centers(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  proposal_id UUID REFERENCES public.sales_proposals(id) ON DELETE SET NULL,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  status public.contract_status DEFAULT 'draft',
  contract_file_url TEXT,
  start_date DATE,
  end_date DATE,
  signed_at TIMESTAMP WITH TIME ZONE,
  renewal_reminder_at TIMESTAMP WITH TIME ZONE,
  terms_snapshot JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================
-- TRIGGERS
-- =========================
DROP TRIGGER IF EXISTS set_updated_at_profiles ON public.profiles; CREATE TRIGGER set_updated_at_profiles BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS set_updated_at_organizations ON public.organizations; CREATE TRIGGER set_updated_at_organizations BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS set_updated_at_centers ON public.centers; CREATE TRIGGER set_updated_at_centers BEFORE UPDATE ON public.centers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS set_updated_at_doctors ON public.doctors; CREATE TRIGGER set_updated_at_doctors BEFORE UPDATE ON public.doctors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS set_updated_at_subscriptions ON public.subscriptions; CREATE TRIGGER set_updated_at_subscriptions BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS set_updated_at_leads ON public.leads; CREATE TRIGGER set_updated_at_leads BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS set_updated_at_sales_deals ON public.sales_deals; CREATE TRIGGER set_updated_at_sales_deals BEFORE UPDATE ON public.sales_deals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS set_updated_at_articles ON public.articles; CREATE TRIGGER set_updated_at_articles BEFORE UPDATE ON public.articles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS set_updated_at_settings ON public.settings; CREATE TRIGGER set_updated_at_settings BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


DROP TRIGGER IF EXISTS set_updated_at_reviews ON public.reviews; CREATE TRIGGER set_updated_at_reviews BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS set_updated_at_center_review_responses ON public.center_review_responses; CREATE TRIGGER set_updated_at_center_review_responses BEFORE UPDATE ON public.center_review_responses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS set_updated_at_ai_chat_sessions ON public.ai_chat_sessions; CREATE TRIGGER set_updated_at_ai_chat_sessions BEFORE UPDATE ON public.ai_chat_sessions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS set_updated_at_center_contracts ON public.center_contracts; CREATE TRIGGER set_updated_at_center_contracts BEFORE UPDATE ON public.center_contracts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_ad_placements ON public.ad_placements; CREATE TRIGGER set_updated_at_ad_placements BEFORE UPDATE ON public.ad_placements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS set_updated_at_ad_wallets ON public.ad_wallets; CREATE TRIGGER set_updated_at_ad_wallets BEFORE UPDATE ON public.ad_wallets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS set_updated_at_ad_campaigns ON public.ad_campaigns; CREATE TRIGGER set_updated_at_ad_campaigns BEFORE UPDATE ON public.ad_campaigns FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS set_updated_at_ad_creatives ON public.ad_creatives; CREATE TRIGGER set_updated_at_ad_creatives BEFORE UPDATE ON public.ad_creatives FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS set_updated_at_ad_pricing_rules ON public.ad_pricing_rules; CREATE TRIGGER set_updated_at_ad_pricing_rules BEFORE UPDATE ON public.ad_pricing_rules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS set_updated_at_ad_placement_bookings ON public.ad_placement_bookings; CREATE TRIGGER set_updated_at_ad_placement_bookings BEFORE UPDATE ON public.ad_placement_bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================
-- INDEXES
-- =========================
CREATE INDEX IF NOT EXISTS idx_profile_roles_profile ON public.profile_roles(profile_id);
CREATE INDEX IF NOT EXISTS idx_organizations_slug ON public.organizations(slug);
CREATE INDEX IF NOT EXISTS idx_organization_members_profile ON public.organization_members(profile_id);
CREATE INDEX IF NOT EXISTS idx_centers_slug ON public.centers(slug);
CREATE INDEX IF NOT EXISTS idx_centers_org ON public.centers(organization_id);
CREATE INDEX IF NOT EXISTS idx_centers_area_category ON public.centers(area_id, category_id);
CREATE INDEX IF NOT EXISTS idx_centers_location ON public.centers USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_doctors_slug ON public.doctors(slug);
CREATE INDEX IF NOT EXISTS idx_doctor_centers_center ON public.doctor_centers(center_id);
CREATE INDEX IF NOT EXISTS idx_doctor_centers_doctor ON public.doctor_centers(doctor_id);
CREATE INDEX IF NOT EXISTS idx_doctor_centers_org ON public.doctor_centers(organization_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_subscriber ON public.subscriptions(subscriber_type, subscriber_id);
CREATE INDEX IF NOT EXISTS idx_payments_subscriber ON public.payments(subscriber_type, subscriber_id);
CREATE INDEX IF NOT EXISTS idx_ledger_entries_account ON public.ledger_entries(ledger_account_id);
CREATE INDEX IF NOT EXISTS idx_leads_owner ON public.leads(owner_type, owner_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_sales_deals_assigned_marketer ON public.sales_deals(assigned_marketer_id);
CREATE INDEX IF NOT EXISTS idx_media_assets_owner ON public.media_assets(owner_type, owner_id);
CREATE INDEX IF NOT EXISTS idx_microsites_subdomain ON public.microsites(subdomain);
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_wallet ON public.ad_campaigns(wallet_id);
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_placement_status ON public.ad_campaigns(placement_id,status,start_date,end_date);
CREATE INDEX IF NOT EXISTS idx_ad_creatives_campaign ON public.ad_creatives(campaign_id,status);
CREATE INDEX IF NOT EXISTS idx_ad_wallets_owner ON public.ad_wallets(owner_type,owner_id,currency);
CREATE INDEX IF NOT EXISTS idx_ad_wallet_transactions_wallet ON public.ad_wallet_transactions(wallet_id,created_at);
CREATE INDEX IF NOT EXISTS idx_ad_events_campaign ON public.ad_events(campaign_id,event_type,created_at);
CREATE INDEX IF NOT EXISTS idx_ad_events_placement ON public.ad_events(placement_id,event_type,created_at);
CREATE UNIQUE INDEX IF NOT EXISTS idx_ad_events_idempotency_key ON public.ad_events(idempotency_key) WHERE idempotency_key IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_ad_wallet_transactions_idempotency_key ON public.ad_wallet_transactions(idempotency_key) WHERE idempotency_key IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ad_bookings_placement_dates ON public.ad_placement_bookings(placement_id,start_date,end_date,status);
CREATE INDEX IF NOT EXISTS idx_ad_pricing_rules_lookup ON public.ad_pricing_rules(placement_id,campaign_type,is_active);
CREATE INDEX IF NOT EXISTS idx_articles_status_type ON public.articles(status,type);
CREATE INDEX IF NOT EXISTS idx_events_owner ON public.events(owner_type, owner_id);
CREATE INDEX IF NOT EXISTS idx_events_type_created ON public.events(event_type, created_at);



CREATE INDEX IF NOT EXISTS idx_reviews_center_status ON public.reviews(center_id, status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_review_reports_status ON public.review_reports(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_center_review_responses_review ON public.center_review_responses(review_id, status);
CREATE INDEX IF NOT EXISTS idx_ai_chat_sessions_user ON public.ai_chat_sessions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_chat_messages_session ON public.ai_chat_messages(session_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_ai_chat_leads_center ON public.ai_chat_leads(center_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_offer_claims_offer_status ON public.offer_claims(offer_id, status);
CREATE INDEX IF NOT EXISTS idx_offer_claims_center ON public.offer_claims(center_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_center_analytics_daily_center_date ON public.center_analytics_daily(center_id, report_date DESC);
CREATE INDEX IF NOT EXISTS idx_sales_activities_deal ON public.sales_activities(sales_deal_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sales_proposals_center ON public.sales_proposals(center_id, status);
CREATE INDEX IF NOT EXISTS idx_center_contracts_center ON public.center_contracts(center_id, status);

-- =========================
-- V10 RLS BASELINE
-- =========================
-- RLS must be enabled for every application table. Policies are intentionally narrow.
-- Public SEO reads should use approved server-side query helpers that return only published fields.

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.center_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.license_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claim_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ledger_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ledger_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ledger_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_deal_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_subtitles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.microsites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_placements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_creatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_placement_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.center_review_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_moderation_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offer_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.center_scorecards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.center_analytics_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.center_monthly_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.center_contracts ENABLE ROW LEVEL SECURITY;


REVOKE INSERT ON public.events FROM anon;
REVOKE INSERT ON public.events FROM authenticated;
REVOKE INSERT ON public.ad_events FROM anon;
REVOKE INSERT ON public.ad_events FROM authenticated;

DROP POLICY IF EXISTS "Admins can read all events" ON public.events;
CREATE POLICY "Admins can read all events" ON public.events FOR SELECT TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can read settings" ON public.settings;
CREATE POLICY "Admins can read settings" ON public.settings FOR SELECT TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can manage settings" ON public.settings;
CREATE POLICY "Admins can manage settings" ON public.settings FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Public can read active taxonomy areas" ON public.areas;
CREATE POLICY "Public can read active taxonomy areas" ON public.areas FOR SELECT TO anon, authenticated USING (TRUE);

DROP POLICY IF EXISTS "Public can read active categories" ON public.categories;
CREATE POLICY "Public can read active categories" ON public.categories FOR SELECT TO anon, authenticated USING (is_active = TRUE);

DROP POLICY IF EXISTS "Public can read services" ON public.services;
CREATE POLICY "Public can read services" ON public.services FOR SELECT TO anon, authenticated USING (TRUE);

DROP POLICY IF EXISTS "Public can read published centers" ON public.centers;
CREATE POLICY "Public can read published centers" ON public.centers FOR SELECT TO anon, authenticated USING (listing_status = 'published');

DROP POLICY IF EXISTS "Public can read published doctors" ON public.doctors;
CREATE POLICY "Public can read published doctors" ON public.doctors FOR SELECT TO anon, authenticated USING (listing_status = 'published');

DROP POLICY IF EXISTS "Public can read approved public media" ON public.media_assets;
CREATE POLICY "Public can read approved public media" ON public.media_assets FOR SELECT TO anon, authenticated USING (status = 'approved' AND storage_bucket = 'public-media');

DROP POLICY IF EXISTS "Public can read published articles" ON public.articles;
CREATE POLICY "Public can read published articles" ON public.articles FOR SELECT TO anon, authenticated USING (status = 'published' AND robots_index = TRUE);

DROP POLICY IF EXISTS "Public can read approved patient offers" ON public.patient_offers;
CREATE POLICY "Public can read approved patient offers" ON public.patient_offers FOR SELECT TO anon, authenticated USING (status = 'approved');


DROP POLICY IF EXISTS "Public can read approved public reviews" ON public.reviews;
CREATE POLICY "Public can read approved public reviews" ON public.reviews FOR SELECT TO anon, authenticated USING (status = 'approved' AND visibility = 'public');

DROP POLICY IF EXISTS "Authenticated users can create pending reviews" ON public.reviews;
CREATE POLICY "Authenticated users can create pending reviews" ON public.reviews FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND status = 'pending');

DROP POLICY IF EXISTS "Admins can manage reviews" ON public.reviews;
CREATE POLICY "Admins can manage reviews" ON public.reviews FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Authenticated can vote on reviews" ON public.review_votes;
CREATE POLICY "Authenticated can vote on reviews" ON public.review_votes FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can manage review votes" ON public.review_votes;
CREATE POLICY "Admins can manage review votes" ON public.review_votes FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Authenticated can report reviews" ON public.review_reports;
CREATE POLICY "Authenticated can report reviews" ON public.review_reports FOR INSERT TO authenticated WITH CHECK (reporter_id = auth.uid() OR reporter_id IS NULL);

DROP POLICY IF EXISTS "Admins can manage review reports" ON public.review_reports;
CREATE POLICY "Admins can manage review reports" ON public.review_reports FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Public can read approved center responses" ON public.center_review_responses;
CREATE POLICY "Public can read approved center responses" ON public.center_review_responses FOR SELECT TO anon, authenticated USING (status = 'approved');

DROP POLICY IF EXISTS "Admins can manage center responses" ON public.center_review_responses;
CREATE POLICY "Admins can manage center responses" ON public.center_review_responses FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can read review moderation events" ON public.review_moderation_events;
CREATE POLICY "Admins can read review moderation events" ON public.review_moderation_events FOR SELECT TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Users can read own ai sessions" ON public.ai_chat_sessions;
CREATE POLICY "Users can read own ai sessions" ON public.ai_chat_sessions FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Users can read own ai messages" ON public.ai_chat_messages;
CREATE POLICY "Users can read own ai messages" ON public.ai_chat_messages FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.ai_chat_sessions s WHERE s.id = session_id AND (s.user_id = auth.uid() OR public.is_admin())));

DROP POLICY IF EXISTS "Admins can manage ai chat" ON public.ai_chat_sessions;
CREATE POLICY "Admins can manage ai chat" ON public.ai_chat_sessions FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can manage ai messages" ON public.ai_chat_messages;
CREATE POLICY "Admins can manage ai messages" ON public.ai_chat_messages FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can manage ai leads" ON public.ai_chat_leads;
CREATE POLICY "Admins can manage ai leads" ON public.ai_chat_leads FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Users can read own offer claims" ON public.offer_claims;
CREATE POLICY "Users can read own offer claims" ON public.offer_claims FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage offer claims" ON public.offer_claims;
CREATE POLICY "Admins can manage offer claims" ON public.offer_claims FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can manage center growth private tables" ON public.center_scorecards;
CREATE POLICY "Admins can manage center growth private tables" ON public.center_scorecards FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can manage center analytics" ON public.center_analytics_daily;
CREATE POLICY "Admins can manage center analytics" ON public.center_analytics_daily FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can manage center reports" ON public.center_monthly_reports;
CREATE POLICY "Admins can manage center reports" ON public.center_monthly_reports FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can manage sales activities" ON public.sales_activities;
CREATE POLICY "Admins can manage sales activities" ON public.sales_activities FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can manage sales proposals" ON public.sales_proposals;
CREATE POLICY "Admins can manage sales proposals" ON public.sales_proposals FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can manage center contracts" ON public.center_contracts;
CREATE POLICY "Admins can manage center contracts" ON public.center_contracts FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());



ALTER TABLE public.ad_placements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_creatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_placement_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_pricing_rules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read active ad placements" ON public.ad_placements;
CREATE POLICY "Public can read active ad placements" ON public.ad_placements FOR SELECT TO anon, authenticated USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage ad placements" ON public.ad_placements;
CREATE POLICY "Admins can manage ad placements" ON public.ad_placements FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can manage ad campaigns" ON public.ad_campaigns;
CREATE POLICY "Admins can manage ad campaigns" ON public.ad_campaigns FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can manage ad creatives" ON public.ad_creatives;
CREATE POLICY "Admins can manage ad creatives" ON public.ad_creatives FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can manage ad wallets" ON public.ad_wallets;
CREATE POLICY "Admins can manage ad wallets" ON public.ad_wallets FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can manage ad wallet transactions" ON public.ad_wallet_transactions;
CREATE POLICY "Admins can manage ad wallet transactions" ON public.ad_wallet_transactions FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can read ad events" ON public.ad_events;
CREATE POLICY "Admins can read ad events" ON public.ad_events FOR SELECT TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can manage ad bookings" ON public.ad_placement_bookings;
CREATE POLICY "Admins can manage ad bookings" ON public.ad_placement_bookings FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can manage ad pricing rules" ON public.ad_pricing_rules;
CREATE POLICY "Admins can manage ad pricing rules" ON public.ad_pricing_rules FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Center self-service ad access must be implemented later through server actions/RPCs that verify org membership and budget rules.
-- Direct client writes to ad billing tables are intentionally not allowed.

-- Financial, approval, audit, role, ledger, private media and admin tables remain default-deny except through admin/server actions.
```

-- V10.3 CANONICAL OVERRIDE NOTICE
-- The legacy public.doctor_centers table in this base V10 DDL must not be used as the canonical writable doctor-location relation.
-- V10.3 uses public.doctor_practice_locations as canonical. If doctor_centers remains, it must be read-only compatibility or migration-only.
-- See 25_FINAL_CANONICAL_DECISIONS_AND_CONFLICT_RESOLUTION.md and 59_DATABASE_CANONICAL_PATCH_V10_3.md.
