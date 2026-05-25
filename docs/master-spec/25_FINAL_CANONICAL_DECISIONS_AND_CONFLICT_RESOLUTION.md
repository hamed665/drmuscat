# 25_FINAL_CANONICAL_DECISIONS_AND_CONFLICT_RESOLUTION.md

# DrMuscat V10.4 Final Canonical Decisions and Conflict Resolution

## 1. Purpose
This is the highest-priority decision file in the package. If any other file conflicts with this file, Claude Code must obey this file and report the conflict in the pre-implementation review.

## 2. Priority Order
Claude Code/Codex must resolve documents in this order. V10.4 execution-control files override older build-process instructions. Product/database/SEO decisions remain governed by the canonical product files listed below.

1. `64_AGENT_SAFE_BUILD_FRAMEWORK.md`
2. `77_FINAL_BUILD_FROM_ZERO_PROMPT.md`
3. `76_HUMAN_APPROVAL_CHECKPOINTS.md`
4. `68_TESTING_AND_VALIDATION_GATE.md`
5. `67_DATABASE_MIGRATION_PROTOCOL.md`
6. `66_PHASE_LOCKS_AND_ALLOWED_FILE_CHANGES.md`
7. `72_SECURITY_RLS_AND_SECRET_HANDLING_PROTOCOL.md`
8. `73_SEO_BUILD_VALIDATION_PROTOCOL.md`
9. `74_UI_COMPONENT_CONTRACT_AND_DESIGN_SYSTEM.md`
10. `75_DATA_IMPORT_AND_SEED_EXECUTION_PROTOCOL.md`
11. `71_ENVIRONMENT_AND_DEPLOYMENT_CONTRACT.md`
12. `70_AGENT_OUTPUT_REPORT_TEMPLATE.md`
13. `69_ERROR_HANDLING_AND_STOP_RULES.md`
14. `65_CODEX_REPOSITORY_BOOTSTRAP_RULES.md`
15. `25_FINAL_CANONICAL_DECISIONS_AND_CONFLICT_RESOLUTION.md`
16. `63_FINAL_CODEX_IMPLEMENTATION_PROMPT_V10_3.md`
17. `58_CODEX_PHASED_BUILD_MASTER_PLAN.md`
18. `59_DATABASE_CANONICAL_PATCH_V10_3.md`
19. `60_ACCEPTANCE_CRITERIA_PER_PANEL.md`
20. `38_SEO_FIRST_BUSINESS_MODEL_AND_ACCESS_REVISION_V10_1.md`
21. `05b_DATABASE_FULL_DDL_V10.sql.md`
22. `05c_DATABASE_EXECUTION_PATCH_AND_VALIDATION_V10.md`
23. `05d_AD_SYSTEM_DDL_SUPPLEMENT_V10.md`
24. `05e_PLATFORM_SCALE_GEO_DOCTOR_EXTENSIBILITY_DDL_SUPPLEMENT_V10_2.md`
25. `48_APPOINTMENT_AND_AVAILABILITY_ENGINE.md`
26. `49_INSURANCE_AND_PAYMENT_ACCEPTANCE_SYSTEM.md`
27. `50_ADMIN_OPERATING_SYSTEM_FULL_MODULES.md`
28. `51_SEO_OPERATIONS_REDIRECTS_AND_INDEXABILITY_MANAGER.md`
29. `52_TAXONOMY_GEO_AND_IMPORT_MANAGEMENT.md`
30. `53_PROVIDER_DASHBOARD_AND_PLAN_ENTITLEMENTS.md`
31. `54_PATIENT_ACCOUNT_FAVORITES_AND_HISTORY.md`
32. `55_SUPPORT_TICKETS_AND_NOTIFICATION_TEMPLATES.md`
33. `56_DATA_QUALITY_DUPLICATE_MERGE_AND_AUDIT.md`
34. `57_PRODUCTION_MONITORING_SECURITY_AND_SYSTEM_HEALTH.md`
35. `61_COMPETITOR_PARITY_AND_GAP_MATRIX.md`
36. `62_PANEL_ROUTE_PERMISSION_MATRIX.md`
37. `README_SEND_ORDER_AND_RULES.md`
38. `00_MASTER_PROMPT_FOR_CLAUDE_CODE_V10_FINAL.md`
39. `24_FOLDER_STRUCTURE.md`
40. `23_CODE_PATTERNS_AND_EXAMPLES.md`
41. `09_AUTH_ROLES_AND_WORKSPACES.md`
42. `13_SECURITY_RLS_APPROVAL_AND_AUDIT.md`
43. `26_CREATIVE_UI_ADMIN_AND_SETTINGS_REQUIREMENTS.md`
44. `27_IMAGE_OPTIMIZATION_MEDIA_PIPELINE.md`
45. `28_SEO_PERFORMANCE_AND_CORE_WEB_VITALS_GUARDRAILS.md`
46. Remaining product and business files

Claude Code/Codex must never silently choose one conflicting instruction. It must report the conflict and stop if the conflict affects schema, security, billing, routing, auth, SEO indexability, data ownership, payments, appointments, insurance, sponsored visibility, or public trust.

## 3. Version Decision
This package is V10.4. All V5/V6/V10.0-only wording in older text is deprecated where it conflicts with V10.4. File names in this package are canonical, and V10.4 agent-safe build files control execution behavior.

## 4. MVP Subscription Status Decision
Canonical subscription lifecycle:
- `pending`
- `active`
- `suspended`
- `expired`
- `cancelled`

`trial` is disabled in MVP. Do not create trial UI, trial billing logic, or trial enum values.

## 5. Role Decision
Canonical global roles come from `profile_role_type` in the DDL. Role labels in UI may be friendly, but database values must not be renamed casually.

Canonical business-facing labels:
- `center_owner` = clinic/center owner
- `center_staff` = center staff/member
- `marketer` = sales/marketing agent
- `finance_manager` = finance/admin billing operator
- `content_manager` = content/media/editorial operator
- `admin` / `super_admin` = internal privileged roles

Do not invent `clinic_owner` or `sales` if the enum uses `center_owner` and `marketer`.

## 6. Component Naming Decision
Canonical component names:
- `LocalizedLink`, not `LanguageAwareLink`
- `SearchFilters` generic
- `CenterFilters` center-specific wrapper
- `LocalizedTabs`
- `OfferBadge`
- `PartnerBadge`
- `WorkspaceSelector`
- `AdminSettingsShell`

## 7. Storage Decision
Canonical buckets:
- `public-media`
- `private-documents`
- `payment-receipts`
- `contracts`
- `license-files`
- `video-assets`

`video-assets` is admin-only/future in MVP and must be rejected by public signed upload routes unless explicitly approved.

## 8. Public SEO Data Decision
Public SEO pages must render server-side. They may read only published/approved/indexable fields. Do not expose private CRM, billing, audit, admin notes, receipt, license, ledger, or claim data on public pages.

## 9. Admin Settings Decision
Admin settings are required in MVP architecture. Not every setting needs deep UI in Phase 0, but schema, route boundaries, permission model, and settings shell must exist.

## 10. Image Optimization Decision
Image uploads must preserve quality while reducing public delivery size. The canonical path is original upload plus server-generated derivatives. Public pages must serve derivatives via `next/image`, not raw originals.

## 11. Build Discipline Decision
The project may be initiated with one instruction, but implementation must be phase-gated. Claude Code must not build all phases in one uncontrolled response.


## 12. Growth Positioning Decision
DrMuscat is an Oman healthcare discovery + growth platform. It must support SEO, AI search discoverability, WhatsApp-first conversion, center reputation, analytics reporting, and paid center upgrades.

Do not implement DrMuscat as a simple directory where profiles are static pages with no claim, analytics, reviews, or conversion tracking.

## 13. Free Listing Decision
Hospitals, pharmacies, clinics and similar healthcare locations may be seeded as free public unclaimed listings.

Unclaimed profiles must not say Partner, Verified, Discount Available, or any cooperation wording unless actually approved.

Every unclaimed profile must include:
- Claim this profile
- Suggest an edit
- Report wrong information
- Request removal

## 14. Reviews Decision
Reviews are required as a structured patient experience system.

They must be moderated in MVP. They must include sub-ratings. Centers may respond but cannot directly delete reviews. Paid status must not allow review removal.

## 15. AI Chat Decision
AI chat is allowed only as a healthcare discovery assistant and platform assistant.

It must not diagnose, prescribe, interpret medical images/labs, guarantee outcomes, or replace emergency care.

## 16. Analytics Decision
Every major conversion action must be tracked:
- profile view
- WhatsApp click
- call click
- direction click
- offer claim
- offer redemption
- review submission
- AI lead
- claim profile action

Centers must have analytics and monthly reporting architecture.

## 17. Sales CRM Decision
Admin must include CRM/proposal/contract tracking architecture. This is required because the product depends on B2B center acquisition, not only public SEO.

## 18. Programmatic SEO Decision
Programmatic pages are allowed only when useful. Thin pages must be noindex and excluded from sitemap until improved.


## Advertising System Canonical Decision

`37_INTERNAL_ADVERTISING_SPONSORSHIPS_AND_WALLET_SYSTEM.md` is canonical for all internal advertising, sponsored placement, wallet, CPC/CPM, banner, campaign, billing, creative approval, ad event tracking, and sponsored labeling decisions.

If another file mentions ads more generally, file 37 overrides it for advertising details.
Claude Code must not invent ad pricing, placement keys, ad statuses, campaign billing models, or wallet behavior outside file 37 and canonical DDL.


## V10 Advertising DDL Decision

The advertising system is canonical only when `05b_DATABASE_FULL_DDL_V10.sql.md` and `05d_AD_SYSTEM_DDL_SUPPLEMENT_V10.md` agree. If Claude Code sees `37_INTERNAL_ADVERTISING_SPONSORSHIPS_AND_WALLET_SYSTEM.md` requiring wallet/CPC/booking/idempotency features, it must confirm the following database objects exist before implementation:

- `ad_wallets`
- `ad_wallet_transactions`
- `ad_creatives`
- `ad_pricing_rules`
- `ad_placement_bookings`

`ad_campaigns` must include budget, wallet, campaign type, spend, and creative linkage fields. `ad_events` must include placement, creative, idempotency, billing, fraud, and metadata fields.

Claude Code must not implement ad wallet debits, CPC billing, sponsored placement booking, or center self-service campaigns against incomplete ad tables.

## V10 Listing Status Decision

Canonical `listing_status` values are exactly:

- `draft`
- `published`
- `hidden`
- `archived`

`active` and `pending_review` are not valid `listing_status` values. They may appear only in other domains such as subscription status, ad campaign status, media status, article status, or AI chat status.


## V10.1 SEO-First Business Revision Decision
`38_SEO_FIRST_BUSINESS_MODEL_AND_ACCESS_REVISION_V10_1.md` is canonical for the following decisions:

- SEO must be present from the first public implementation.
- Launch public languages are English and Arabic only.
- Arabic is Oman-focused: clear professional Arabic for SEO, Omani/local tone for CTAs and ads.
- Persian/Farsi is not supported in MVP and must not appear in routes, sitemap, hreflang, UI language switcher or dictionaries.
- Hindi is deferred and must not be indexed in launch.
- Health Card / paid user card sales are cancelled.
- Public users register for free.
- Public discovery is available without login.
- Registration prompts must be soft nudges, not hard discovery walls.
- Centers and doctors register under four provider plan levels: Free Listing, Verified Starter, Growth Partner, Premium / Ads Pro.
- Free plan is required so the site can grow listings and SEO; paid plans add verification, analytics, visibility and growth tools.

If any other file mentions `fa`, Persian, Health Card, paid user card, card membership, card sales, or mandatory login for browsing, this V10.1 decision overrides it. Claude Code must report the legacy conflict and follow V10.1.


## V10.2 Canonical Overrides

If any older file conflicts with the following V10.2 rules, these rules win:

1. Public launch locales are English and Arabic only: `en`, `ar`.
2. Public launch country is Oman only, but routes must include country slug `om`.
3. Canonical public route base is `/[locale]/[country]`, not `/[locale]` alone for SEO pages.
4. Provider paid visibility must use clearly labeled sponsored slots, not forced organic ranking.
5. Organic search results must remain relevance-based and cannot be silently purchased.
6. Geo hierarchy must use country -> region -> city -> area -> address.
7. Doctor profiles are first-class SEO entities with multi-location practice support.
8. Feature flags, dynamic settings, plans, legal documents, consent logs, payment gateways, behavior events, and notification preferences are platform primitives, not optional hacks.
9. Health Card/card sales remain removed. Patient offers and offer claim codes replace that concept.
10. Persian and Hindi must not be launch SEO routes or sitemap entries. Hindi may be future AI/search support only after explicit approval.


## V10.3 Canonical Overrides

If any older file conflicts with the following V10.3 rules, these rules win:

1. `public.geo_areas` is canonical. Legacy `areas` cannot remain a second writable source of truth.
2. `public.doctor_practice_locations` is canonical. Legacy `doctor_centers` cannot remain a second writable source of truth.
3. `public.platform_settings` and `public.provider_plans` are preferred conflict-safe tables if old `settings` or `plans` schemas cannot be safely merged.
4. MVP behavior analytics uses a normal indexed table. Risky partitioning is deferred until partition maintenance exists.
5. Appointment request capture is added to the platform foundation; live booking, calendar sync, and online appointment payment are deferred.
6. Insurance acceptance is added; real-time insurance eligibility verification is deferred.
7. SEO operations, redirect manager, and indexability manager are required before serious public launch.
8. Bulk import, duplicate detection, data quality scoring, and audit logs are required operational controls.
9. Admin must be able to manage core platform objects without code changes.
10. Provider plan entitlements must be enforced server-side, not only hidden in UI.
11. Support tickets and notification templates are platform primitives.
12. Production system health/security monitoring is required before serious production launch.
13. Codex/Claude must implement in phase-gated tasks. Do not build all phases in one uncontrolled run.
