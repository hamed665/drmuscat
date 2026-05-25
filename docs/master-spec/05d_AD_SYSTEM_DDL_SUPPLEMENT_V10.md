# 05d_AD_SYSTEM_DDL_SUPPLEMENT_V10.md

# DrMuscat Advertising System DDL Supplement V10

This file is canonical and must be read immediately after `05c_DATABASE_EXECUTION_PATCH_AND_VALIDATION_V10.md`.

Purpose:
1. Make the internal advertising system executable and unambiguous.
2. Prevent Claude Code from implementing wallet/CPC/banner logic against half-defined tables.
3. Provide an idempotent SQL patch for any database that was created from V9 before the V10 ad DDL fix.
4. Confirm the canonical ad model for fresh V10 migrations.

For a brand-new database, `05b_DATABASE_FULL_DDL_V10.sql.md` already includes these definitions. This file still remains mandatory as a validation/patch document.

## Canonical Ad Tables

The internal advertising system must include these tables:

- `ad_placements`
- `ad_wallets`
- `ad_campaigns`
- `ad_creatives`
- `ad_pricing_rules`
- `ad_placement_bookings`
- `ad_events`
- `ad_wallet_transactions`

Claude Code must not implement Phase 15A/15B advertising unless all tables above exist with the fields required below.

## Canonical Ad Statuses

Campaign statuses:

- `draft`
- `pending_review`
- `approved`
- `scheduled`
- `active`
- `paused`
- `exhausted_budget`
- `completed`
- `rejected`
- `cancelled`
- `archived`

Creative statuses:

- `draft`
- `pending_review`
- `approved`
- `rejected`
- `archived`

Placement booking statuses:

- `requested`
- `pending_payment`
- `confirmed`
- `active`
- `completed`
- `cancelled`
- `rejected`

Campaign types:

- `flat_sponsorship`
- `cpc`
- `cpm`

MVP uses `flat_sponsorship` and `cpc`. `cpm` is future unless explicitly approved.

## Mandatory Fields

`ad_campaigns` must include:

- `campaign_type`
- `daily_budget`
- `total_budget`
- `spent_amount`
- `wallet_id`
- `creative_id`
- `bid_amount`
- `flat_price`
- `status`
- `review_notes`
- `approved_by`
- `approved_at`

`ad_events` must include:

- `placement_id`
- `creative_id`
- `idempotency_key`
- `billed_amount`
- `fraud_score`
- `is_billable`
- `is_billed`
- `metadata`

`ad_wallet_transactions` must include:

- `wallet_id`
- `campaign_id`
- `ad_event_id`
- `transaction_type`
- `status`
- `amount`
- `balance_before`
- `balance_after`
- `idempotency_key`

## Idempotent SQL Patch

Run this patch only when upgrading an older V9 database or when Claude Code validates a partially applied migration. For a fresh V10 build, the same definitions are already included in `05b`.

```sql
-- =========================
-- AD SYSTEM ENUMS
-- =========================
DO $$ BEGIN CREATE TYPE public.ad_campaign_type AS ENUM ('flat_sponsorship','cpc','cpm'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.ad_campaign_status AS ENUM ('draft','pending_review','approved','scheduled','active','paused','exhausted_budget','completed','rejected','cancelled','archived'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.ad_creative_status AS ENUM ('draft','pending_review','approved','rejected','archived'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.ad_booking_status AS ENUM ('requested','pending_payment','confirmed','active','completed','cancelled','rejected'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.ad_wallet_transaction_type AS ENUM ('top_up_requested','top_up_approved','top_up_rejected','debit_cpc_click','debit_cpm_batch','debit_flat_booking','refund','adjustment','expired_credit'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.ad_wallet_transaction_status AS ENUM ('pending','approved','rejected','posted','reversed','failed','cancelled'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.ad_event_type AS ENUM ('impression','click','whatsapp_click','call_click','direction_click','offer_claim','conversion'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =========================
-- AD TABLES REQUIRED BY V10
-- =========================
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

ALTER TABLE public.ad_placements ADD COLUMN IF NOT EXISTS pricing_model public.ad_campaign_type NOT NULL DEFAULT 'flat_sponsorship';
ALTER TABLE public.ad_placements ADD COLUMN IF NOT EXISTS base_price NUMERIC(10,3) DEFAULT 0 CHECK(base_price >= 0);
ALTER TABLE public.ad_placements ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'OMR';
ALTER TABLE public.ad_placements ADD COLUMN IF NOT EXISTS is_exclusive BOOLEAN DEFAULT FALSE;
ALTER TABLE public.ad_placements ADD COLUMN IF NOT EXISTS rules JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.ad_placements ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.ad_placements ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

ALTER TABLE public.ad_campaigns ADD COLUMN IF NOT EXISTS wallet_id UUID REFERENCES public.ad_wallets(id) ON DELETE RESTRICT;
ALTER TABLE public.ad_campaigns ADD COLUMN IF NOT EXISTS creative_id UUID;
ALTER TABLE public.ad_campaigns ADD COLUMN IF NOT EXISTS campaign_type public.ad_campaign_type NOT NULL DEFAULT 'flat_sponsorship';
ALTER TABLE public.ad_campaigns ADD COLUMN IF NOT EXISTS bid_amount NUMERIC(10,3) DEFAULT 0 CHECK(bid_amount >= 0);
ALTER TABLE public.ad_campaigns ADD COLUMN IF NOT EXISTS flat_price NUMERIC(10,3) DEFAULT 0 CHECK(flat_price >= 0);
ALTER TABLE public.ad_campaigns ADD COLUMN IF NOT EXISTS daily_budget NUMERIC(10,3) DEFAULT 0 CHECK(daily_budget >= 0);
ALTER TABLE public.ad_campaigns ADD COLUMN IF NOT EXISTS total_budget NUMERIC(10,3) DEFAULT 0 CHECK(total_budget >= 0);
ALTER TABLE public.ad_campaigns ADD COLUMN IF NOT EXISTS spent_amount NUMERIC(10,3) DEFAULT 0 CHECK(spent_amount >= 0);
ALTER TABLE public.ad_campaigns ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'OMR';
ALTER TABLE public.ad_campaigns ADD COLUMN IF NOT EXISTS review_notes TEXT;
ALTER TABLE public.ad_campaigns ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER TABLE public.ad_campaigns ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.ad_campaigns ADD COLUMN IF NOT EXISTS paused_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.ad_campaigns ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.ad_campaigns ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- If upgrading from V9 where ad_campaigns.status was approval_status, normalize it to ad_campaign_status.
DO $$
DECLARE status_type TEXT;
BEGIN
  SELECT udt_name INTO status_type
  FROM information_schema.columns
  WHERE table_schema='public' AND table_name='ad_campaigns' AND column_name='status';

  IF status_type <> 'ad_campaign_status' THEN
    ALTER TABLE public.ad_campaigns ALTER COLUMN status DROP DEFAULT;
    ALTER TABLE public.ad_campaigns
      ALTER COLUMN status TYPE public.ad_campaign_status
      USING (
        CASE status::TEXT
          WHEN 'pending' THEN 'pending_review'
          WHEN 'approved' THEN 'approved'
          WHEN 'rejected' THEN 'rejected'
          WHEN 'archived' THEN 'archived'
          ELSE 'draft'
        END
      )::public.ad_campaign_status;
    ALTER TABLE public.ad_campaigns ALTER COLUMN status SET DEFAULT 'draft';
  END IF;
END $$;

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

ALTER TABLE public.ad_events ADD COLUMN IF NOT EXISTS placement_id UUID REFERENCES public.ad_placements(id) ON DELETE SET NULL;
ALTER TABLE public.ad_events ADD COLUMN IF NOT EXISTS creative_id UUID REFERENCES public.ad_creatives(id) ON DELETE SET NULL;
ALTER TABLE public.ad_events ADD COLUMN IF NOT EXISTS referrer_url TEXT;
ALTER TABLE public.ad_events ADD COLUMN IF NOT EXISTS idempotency_key TEXT;
ALTER TABLE public.ad_events ADD COLUMN IF NOT EXISTS billed_amount NUMERIC(10,3) DEFAULT 0 CHECK(billed_amount >= 0);
ALTER TABLE public.ad_events ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'OMR';
ALTER TABLE public.ad_events ADD COLUMN IF NOT EXISTS fraud_score NUMERIC(5,2) DEFAULT 0 CHECK(fraud_score >= 0);
ALTER TABLE public.ad_events ADD COLUMN IF NOT EXISTS is_billable BOOLEAN DEFAULT FALSE;
ALTER TABLE public.ad_events ADD COLUMN IF NOT EXISTS is_billed BOOLEAN DEFAULT FALSE;
ALTER TABLE public.ad_events ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{}'::jsonb;

DO $$
DECLARE event_type_udt TEXT;
BEGIN
  SELECT udt_name INTO event_type_udt
  FROM information_schema.columns
  WHERE table_schema='public' AND table_name='ad_events' AND column_name='event_type';

  IF event_type_udt <> 'ad_event_type' THEN
    ALTER TABLE public.ad_events DROP CONSTRAINT IF EXISTS ad_events_event_type_check;
    ALTER TABLE public.ad_events
      ALTER COLUMN event_type TYPE public.ad_event_type
      USING event_type::public.ad_event_type;
  END IF;
END $$;

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
-- AD INDEXES
-- =========================
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

-- =========================
-- UPDATED_AT TRIGGERS
-- =========================
DROP TRIGGER IF EXISTS set_updated_at_ad_placements ON public.ad_placements;
CREATE TRIGGER set_updated_at_ad_placements BEFORE UPDATE ON public.ad_placements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_ad_wallets ON public.ad_wallets;
CREATE TRIGGER set_updated_at_ad_wallets BEFORE UPDATE ON public.ad_wallets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_ad_campaigns ON public.ad_campaigns;
CREATE TRIGGER set_updated_at_ad_campaigns BEFORE UPDATE ON public.ad_campaigns FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_ad_creatives ON public.ad_creatives;
CREATE TRIGGER set_updated_at_ad_creatives BEFORE UPDATE ON public.ad_creatives FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_ad_pricing_rules ON public.ad_pricing_rules;
CREATE TRIGGER set_updated_at_ad_pricing_rules BEFORE UPDATE ON public.ad_pricing_rules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_ad_placement_bookings ON public.ad_placement_bookings;
CREATE TRIGGER set_updated_at_ad_placement_bookings BEFORE UPDATE ON public.ad_placement_bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================
-- RLS BASELINE
-- =========================
ALTER TABLE public.ad_placements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_creatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_placement_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_pricing_rules ENABLE ROW LEVEL SECURITY;
```

## Implementation Rule

The application must never deduct wallet balance directly from a public client component. All wallet debits, CPC billing, booking confirmation, refunds, and top-up approvals must run through server actions or RPCs with idempotency keys, audit logs, budget checks, and role checks.

## Listing Status Clarification

Canonical `listing_status` values remain exactly:

- `draft`
- `published`
- `hidden`
- `archived`

`active` and `pending_review` are not valid `listing_status` values. They may appear only in other domains such as subscriptions, ad campaign lifecycle, media lifecycle, article lifecycle, or AI chat lifecycle.
