# CHANGELOG_V10.md

# DrMuscat V10 Changes

V10 fixes the incomplete internal advertising database model discovered after V9 validation.

## Fixed

- Added complete ad wallet schema.
- Added complete ad wallet transaction schema.
- Added complete ad creative schema.
- Added complete ad pricing rules schema.
- Added complete ad placement booking schema.
- Added missing ad campaign fields: `campaign_type`, `daily_budget`, `total_budget`, `spent_amount`, `wallet_id`, `creative_id`, `bid_amount`, `flat_price`, approval and lifecycle fields.
- Added missing ad event fields: `placement_id`, `creative_id`, `idempotency_key`, `billed_amount`, fraud fields, billing flags and metadata.
- Added ad-specific enums for campaign type, campaign status, creative status, booking status, event type and wallet transaction lifecycle.
- Added ad indexes and unique idempotency indexes.
- Added updated_at triggers for ad tables that need mutation tracking.
- Added `05d_AD_SYSTEM_DDL_SUPPLEMENT_V10.md` as a mandatory patch/validation file.
- Clarified that canonical `listing_status` values are only `draft`, `published`, `hidden`, `archived`.

## Rule

Claude Code must read `05d_AD_SYSTEM_DDL_SUPPLEMENT_V10.md` immediately after `05c_DATABASE_EXECUTION_PATCH_AND_VALIDATION_V10.md` and before implementing any advertising phase.


## V10.1 - SEO-First Business Revision
Added:
- Canonical SEO-first implementation requirement.
- Keyword workbook integration summary from `drmuscat-keywords-full.xlsx`.
- English/Arabic-only launch language decision.
- Oman-focused Arabic guidelines.
- Persian/Farsi removal from MVP routes, sitemap, hreflang and UI.
- Health Card/user card sales cancellation.
- Public patient offers replacing card-based offers.
- Four provider plan levels for centers and doctors.
- Free user registration and anonymous discovery rules.

Changed:
- Business model no longer depends on Health Card.
- SEO is a launch blocker, not a later feature.
- Public access must not require login for discovery.

Fixed:
- Removed legacy `fa` from canonical localization docs.
- Replaced Health Card public route with offers route.


## V10.2 — Multi-Country, Doctor Profiles, Extensibility, Consent, Payments, Analytics and Sponsored Slot Revision

Added:
- 05e DDL supplement for geo hierarchy, doctor profile extensions, feature flags, settings, dynamic plans, legal documents, consent logs, notifications, payment gateways, behavior analytics, fuzzy search and sponsored-slot primitives.
- Country-aware routing: `/[locale]/[country]/...` with Oman active at `/en/om` and `/ar/om`.
- Five-layer geographic hierarchy: country, region, city, area, address/location.
- Doctor profiles as first-class SEO/trust entities with multi-location practice support.
- Feature flags and admin settings engine as platform primitives.
- Cookie consent, legal document versioning, legal acceptance logs and notification permission strategy.
- Dynamic payment gateway abstraction and DB-driven provider plans.
- Upgrade nudges with anti-annoyance rules.
- Privacy-first behavior analytics event system and funnel foundation.
- Transparent sponsored slot rules so premium plans do not silently buy organic ranking.
- AI discoverability: llms.txt, AI crawler policy, AI summary blocks, fuzzy search strategy.
- Week-one launch scope vs deferred features.

Fixed:
- Removed remaining legacy Health Card wording from 05c and clarified patient-offer replacement.
- Replaced singular `/dentist/al-khuwair` example with canonical `/[locale]/[country]/centers/[categorySlug]/[areaSlug]`.
- Clarified checklist wording around no card sales.
