# V10.4 OVERRIDE

For build-from-zero execution, use `77_FINAL_BUILD_FROM_ZERO_PROMPT.md` and the V10.4 Agent-Safe Build Framework files `64` through `77` before applying this V10.3 implementation prompt. This file remains valid as product implementation guidance, but V10.4 controls phase gates, stop rules, allowed file changes, and validation gates.

# 63_FINAL_CODEX_IMPLEMENTATION_PROMPT_V10_3.md

# DrMuscat V10.3 — Final Codex Implementation Prompt

## 1. Purpose
This is the final handoff prompt for Codex/ChatGPT with GitHub. Use it only after the full V10.3 package is committed to the repository.

This prompt is intentionally strict. Codex must not build the whole project in one task. That is how repositories become haunted houses with TypeScript errors.

---

## 2. Initial SAFE_REVIEW_ONLY Prompt

```text
Read all DrMuscat Master Spec V10.3 files in the exact order defined in README_SEND_ORDER_AND_RULES.md.
Use SAFE_REVIEW_ONLY mode first.
Do not write code yet.
Do not edit files yet.
Do not create migrations yet.
Do not scaffold the app yet.

First produce the DRMUSCAT V10.3 PRE-IMPLEMENTATION REVIEW.
```

---

## 3. Mandatory Confirmation Checklist

The review must explicitly confirm:

```text
1. SEO-first Oman launch.
2. English/Arabic only launch.
3. No Persian/Hindi launch SEO routes.
4. No Health Card/card sales.
5. Patient offers replace cards.
6. Free user registration and anonymous browsing.
7. Four provider plan levels.
8. Country-aware /[locale]/om route structure.
9. Five-layer geo hierarchy.
10. geo_areas is canonical, not legacy areas.
11. First-class doctor profiles.
12. doctor_practice_locations is canonical, not doctor_centers.
13. provider_plans is canonical for provider subscriptions, not legacy plans.
14. platform_settings is canonical for configurable admin settings, not legacy settings.
15. Feature flags and settings engine.
16. Cookie/legal/consent foundation.
17. Dynamic payment gateway foundation.
18. Behavior analytics MVP uses normal indexed table, not risky partitioning.
19. Sponsored slots instead of forced organic premium ranking.
20. Appointment request foundation is added, but live booking is deferred.
21. Insurance acceptance foundation is added, but real-time eligibility is deferred.
22. Admin operating system modules are required.
23. SEO operations, redirect manager, and indexability manager are required.
24. Bulk import and duplicate merge are required.
25. Provider dashboard entitlements are required.
26. Support tickets and notification templates are required.
27. Production monitoring/system health is required.
28. Seed data must be UTF-8 safe, idempotent, and Oman-first.
29. Medical claim guardrails must run on imports and public content.
30. Build must be phase-gated according to 58_CODEX_PHASED_BUILD_MASTER_PLAN.md.
```

---

## 4. Required Review Output

After reading all files, Codex must produce:

```text
A. Executive summary
B. Conflict report
C. Canonical decision confirmation
D. Database migration order
E. RLS/security risk list
F. Route and SEO confirmation
G. Admin panel implementation map
H. Provider panel implementation map
I. Data import and seed plan
J. Phase-by-phase implementation plan
K. First implementation task only: Phase 0 spec/schema review
L. Questions/blockers, if any
```

Codex must stop after this review and wait for explicit approval.

---

## 5. Global Build Rules

Codex must:

```text
- implement one phase at a time.
- create small branches or commits per phase.
- never mix unrelated phases.
- run lint/typecheck/build after implementation phases.
- report changed files.
- report database changes.
- report RLS changes.
- report any deviation from spec.
- stop if a conflict is found.
```

Codex must not:

```text
- invent routes.
- invent roles.
- invent payment behavior.
- invent medical claims.
- invent Persian/Hindi launch pages.
- reintroduce Health Card.
- use legacy areas as a second writable geo system.
- use doctor_centers as a second writable doctor-location system.
- use legacy plans/settings for new V10.3 provider logic.
- expose private documents in public pages.
- implement full payment gateways without approval.
- implement live booking without approval.
- implement AI chat without approval.
- implement all phases in one task.
```

---

## 6. Phase 0 Task Prompt — Spec Freeze and Schema Review

```text
TASK ID: DM-V10.3-P0-SPEC-SCHEMA-REVIEW
PHASE: 0
GOAL: Validate the V10.3 spec and produce a schema/implementation readiness report without writing code.
FILES TO READ:
- README_SEND_ORDER_AND_RULES.md
- PACKAGE_MANIFEST.json
- 25_FINAL_CANONICAL_DECISIONS_AND_CONFLICT_RESOLUTION.md
- 58_CODEX_PHASED_BUILD_MASTER_PLAN.md
- 59_DATABASE_CANONICAL_PATCH_V10_3.md
- 60_ACCEPTANCE_CRITERIA_PER_PANEL.md
- 62_PANEL_ROUTE_PERMISSION_MATRIX.md
- all files referenced by README canonical order
FILES TO CREATE/EDIT: none
MUST IMPLEMENT: review only
MUST NOT IMPLEMENT: no code, no migration, no scaffold
DATABASE CHANGES: none
RLS CHANGES: none
ROUTES: none
TESTS: not applicable
ACCEPTANCE CRITERIA:
- conflict report produced
- canonical table decisions confirmed
- migration order proposed
- phase plan confirmed
- blockers listed
STOP CONDITION: stop after review and wait for approval
```

---

## 7. Phase 1 Task Prompt — Repo Foundation

```text
TASK ID: DM-V10.3-P1-REPO-FOUNDATION
PHASE: 1
GOAL: Create the project foundation only.
FILES TO READ:
- 04_DESIGN_SYSTEM_TOKENS_AND_COMPONENTS.md
- 06_PAGES_ROUTES_AND_FEATURES.md
- 14_PREMIUM_UI_UX_PERFORMANCE_AND_ACCESSIBILITY.md
- 15_MULTILINGUAL_RTL_LOCALIZATION_AND_MICROSITES.md
- 19_ENVIRONMENT_VARIABLES_AND_DEPLOYMENT.md
- 24_FOLDER_STRUCTURE.md
- 58_CODEX_PHASED_BUILD_MASTER_PLAN.md
FILES TO CREATE/EDIT:
- package files
- Next.js app foundation
- TypeScript config
- Tailwind config
- env examples
- route shell
- shared layout/components foundation
MUST IMPLEMENT:
- Next.js App Router
- TypeScript
- Tailwind
- Supabase client/server setup placeholders
- en/ar only
- /[locale]/[country] route shell
- support /en/om and /ar/om
- RTL/LTR layout foundation
MUST NOT IMPLEMENT:
- database migrations
- payment gateway
- AI chat
- full admin dashboard
- full provider dashboard
DATABASE CHANGES: none
RLS CHANGES: none
ROUTES:
- /en/om
- /ar/om
TESTS:
- lint
- typecheck
- build
ACCEPTANCE CRITERIA:
- /en/om renders
- /ar/om renders RTL
- invalid locale/country handled safely
- no fa/hi launch routes
STOP CONDITION: stop after foundation passes checks
```

---

## 8. Phase 2 Task Prompt — Database Core and RLS

```text
TASK ID: DM-V10.3-P2-DATABASE-RLS
PHASE: 2
GOAL: Implement canonical database foundation and RLS.
FILES TO READ:
- 05b_DATABASE_FULL_DDL_V10.sql.md
- 05c_DATABASE_EXECUTION_PATCH_AND_VALIDATION_V10.md
- 05e_PLATFORM_SCALE_GEO_DOCTOR_EXTENSIBILITY_DDL_SUPPLEMENT_V10_2.md
- 13_SECURITY_RLS_APPROVAL_AND_AUDIT.md
- 21_SEED_DATA_AND_CONTENT_BOOTSTRAP.md
- 42_CONSENT_COOKIES_NOTIFICATIONS_AND_LEGAL_ACCEPTANCE.md
- 59_DATABASE_CANONICAL_PATCH_V10_3.md
FILES TO CREATE/EDIT:
- supabase/migrations/*
- supabase/seed/*
MUST IMPLEMENT:
- canonical core schema
- geo hierarchy using geo_areas
- doctor_practice_locations canonical
- provider_plans
- platform_settings
- redirect_rules
- seo_indexability/pages foundation
- audit_logs
- claim_requests foundation
- core RLS policies
- idempotent seed files
MUST NOT IMPLEMENT:
- full payment gateway integration
- live booking
- AI chat
DATABASE CHANGES:
- create/apply migrations in safe order
RLS CHANGES:
- public read for published public entities
- provider owned write only
- admin write for admin modules
- private finance/legal/security tables protected
ROUTES: none
TESTS:
- migration applies cleanly
- seed applies cleanly
- RLS access tests
ACCEPTANCE CRITERIA:
- no second writable areas system
- no second writable doctor_centers system
- no legacy plans/settings for V10.3 provider logic
- no Health Card tables/features added
STOP CONDITION: stop after database and seed validation report
```

---

## 9. Phase 3 Task Prompt — Public SEO Platform

```text
TASK ID: DM-V10.3-P3-PUBLIC-SEO
PHASE: 3
GOAL: Build public SEO-first pages.
FILES TO READ:
- 06_PAGES_ROUTES_AND_FEATURES.md
- 07_SEO_STRUCTURE_AND_CONTENT_SYSTEM.md
- 28_SEO_PERFORMANCE_AND_CORE_WEB_VITALS_GUARDRAILS.md
- 35_LOCAL_SEO_PROGRAMMATIC_PAGES_AND_TRUST_AUTHORITY.md
- 41_AI_DISCOVERABILITY_LLM_SEARCH_AND_FUZZY_SEARCH.md
- 51_SEO_OPERATIONS_REDIRECTS_AND_INDEXABILITY_MANAGER.md
MUST IMPLEMENT:
- homepage
- centers listing
- center profile
- doctors listing
- doctor profile
- specialty/area pages
- WhatsApp/phone/directions CTAs
- metadata/canonical/hreflang
- sitemap.xml
- robots.txt
- llms.txt
- structured data foundation
MUST NOT IMPLEMENT:
- login requirement for browsing
- fa/hi launch routes
- deprecated route generation
- full live booking
DATABASE CHANGES: only if needed for SEO views/helpers approved by Phase 2
RLS CHANGES: no weakening public/private separation
ROUTES:
- /[locale]/om
- /[locale]/om/centers
- /[locale]/om/doctors
- /[locale]/om/centers/[specialty]
- /[locale]/om/centers/[specialty]/[area]
- /[locale]/om/center/[centerSlug] or the canonical profile route already approved
- /[locale]/om/doctors/[doctorSlug]
TESTS:
- route smoke tests
- SEO metadata tests
- sitemap tests
ACCEPTANCE CRITERIA:
- public pages render without login
- sitemap contains only indexable en/ar Oman URLs
- no private data exposed
STOP CONDITION: stop after public SEO QA report
```

---

## 10. Phase 4 Task Prompt — Admin Operating System Foundation

```text
TASK ID: DM-V10.3-P4-ADMIN-FOUNDATION
PHASE: 4
GOAL: Implement admin foundation and core management modules.
FILES TO READ:
- 26_CREATIVE_UI_ADMIN_AND_SETTINGS_REQUIREMENTS.md
- 50_ADMIN_OPERATING_SYSTEM_FULL_MODULES.md
- 51_SEO_OPERATIONS_REDIRECTS_AND_INDEXABILITY_MANAGER.md
- 52_TAXONOMY_GEO_AND_IMPORT_MANAGEMENT.md
- 56_DATA_QUALITY_DUPLICATE_MERGE_AND_AUDIT.md
- 60_ACCEPTANCE_CRITERIA_PER_PANEL.md
- 62_PANEL_ROUTE_PERMISSION_MATRIX.md
MUST IMPLEMENT:
- admin auth guard
- command center shell
- centers manager
- doctors manager
- claims manager
- taxonomy manager foundation
- geo manager foundation
- redirect manager
- SEO indexability manager foundation
- audit log viewer
MUST NOT IMPLEMENT:
- provider billing automation
- full payment gateway
- AI chat
DATABASE CHANGES: only admin-support fields if not already in Phase 2
RLS CHANGES: admin-only writes and private tables protected
ROUTES:
- /admin
- /admin/centers
- /admin/doctors
- /admin/claims
- /admin/seo
- /admin/redirects
- /admin/taxonomy
- /admin/geo
TESTS:
- non-admin blocked
- admin can manage core records
- audit log created for sensitive changes
ACCEPTANCE CRITERIA:
- admin can manage all MVP public data
- no provider/user can access admin
STOP CONDITION: stop after admin QA report
```

---

## 11. Phase 5 Task Prompt — Provider Dashboard and Claim

```text
TASK ID: DM-V10.3-P5-PROVIDER-CLAIM
PHASE: 5
GOAL: Implement provider claim and dashboard foundation.
FILES TO READ:
- 33_CENTER_ACQUISITION_CLAIM_AND_SALES_CRM_SYSTEM.md
- 53_PROVIDER_DASHBOARD_AND_PLAN_ENTITLEMENTS.md
- 60_ACCEPTANCE_CRITERIA_PER_PANEL.md
- 62_PANEL_ROUTE_PERMISSION_MATRIX.md
MUST IMPLEMENT:
- claim form
- claim status
- admin approve/reject connection
- provider workspace shell
- provider profile editor
- profile completeness
- media upload controls
- entitlement warnings
MUST NOT IMPLEMENT:
- provider self-verification
- provider payment self-approval
- full live booking
DATABASE CHANGES: only if ownership mapping missing
RLS CHANGES: provider can edit owned workspace only
ROUTES:
- /provider
- /provider/profile
- /provider/media
- /provider/billing/status placeholder
TESTS:
- provider cannot edit unowned center
- approved provider can edit permitted fields
ACCEPTANCE CRITERIA:
- claim approved creates ownership/access
- sensitive edits require review where specified
STOP CONDITION: stop after provider QA report
```

---

## 12. Phase 6 Task Prompt — Monetization Foundation

```text
TASK ID: DM-V10.3-P6-MONETIZATION
PHASE: 6
GOAL: Implement provider plans, manual payment, offers, and sponsored slot foundation.
FILES TO READ:
- 11_PARTNER_ONBOARDING_PAYMENTS_AND_BILLING.md
- 37_INTERNAL_ADVERTISING_SPONSORSHIPS_AND_WALLET_SYSTEM.md
- 43_PAYMENT_GATEWAYS_DYNAMIC_PLANS_AND_UPGRADE_NUDGES.md
- 45_SPONSORED_SLOTS_AND_PREMIUM_VISIBILITY_RULES.md
- 53_PROVIDER_DASHBOARD_AND_PLAN_ENTITLEMENTS.md
MUST IMPLEMENT:
- provider plan display/admin assignment
- entitlement checks
- manual payment record
- private receipt upload
- admin receipt approval/rejection
- sponsored slot label/foundation
- patient offers foundation
MUST NOT IMPLEMENT:
- automatic gateway charging
- hidden organic ranking boost
- Health Card
DATABASE CHANGES: finance and subscription tables if not already migrated
RLS CHANGES: finance-private protection
ROUTES:
- /admin/billing
- /admin/payments
- /provider/billing
- /admin/offers
TESTS:
- provider cannot approve own payment
- receipt private
- sponsored label visible
ACCEPTANCE CRITERIA:
- provider plan active after manual approval
- organic ranking remains separate from sponsored
STOP CONDITION: stop after monetization QA report
```

---

## 13. Phase 7 Task Prompt — Analytics, Support, Quality

```text
TASK ID: DM-V10.3-P7-ANALYTICS-SUPPORT-QUALITY
PHASE: 7
GOAL: Implement behavior events, support tickets, data quality, duplicate detection.
FILES TO READ:
- 34_GROWTH_ANALYTICS_ATTRIBUTION_AND_REPORTING.md
- 44_BEHAVIORAL_ANALYTICS_EVENTS_AND_FUNNELS.md
- 55_SUPPORT_TICKETS_AND_NOTIFICATION_TEMPLATES.md
- 56_DATA_QUALITY_DUPLICATE_MERGE_AND_AUDIT.md
MUST IMPLEMENT:
- behavior_events normal indexed table usage
- click tracking
- profile_viewed/search_performed basics
- support tickets
- notification templates foundation
- data quality dashboard
- duplicate candidate queue
MUST NOT IMPLEMENT:
- session replay
- anomaly detection
- full marketing automation
DATABASE CHANGES: analytics/support/quality if not already migrated
RLS CHANGES: private analytics/admin access, provider scoped metrics
TESTS:
- events insert safely
- provider only sees own analytics
- support tickets permission-scoped
ACCEPTANCE CRITERIA:
- click events recorded
- duplicate queue works
- ticket flow works
STOP CONDITION: stop after quality/analytics QA report
```

---

## 14. Phase 8 Task Prompt — Appointment and Insurance Foundation

```text
TASK ID: DM-V10.3-P8-APPOINTMENT-INSURANCE
PHASE: 8
GOAL: Implement request-based appointment foundation and insurance acceptance foundation.
FILES TO READ:
- 48_APPOINTMENT_AND_AVAILABILITY_ENGINE.md
- 49_INSURANCE_AND_PAYMENT_ACCEPTANCE_SYSTEM.md
- 60_ACCEPTANCE_CRITERIA_PER_PANEL.md
MUST IMPLEMENT:
- appointment request capture
- admin/provider request management
- appointment status logs
- insurance companies
- center/doctor insurance acceptance
- insurance display/filter foundation
MUST NOT IMPLEMENT:
- real-time insurance eligibility
- calendar sync
- instant confirmed live booking unless separately approved
DATABASE CHANGES: appointment/insurance tables if not already migrated
RLS CHANGES: patient/provider/admin scoped access
ROUTES:
- public request CTA/form where approved
- /provider/appointments
- /admin/appointments
- /admin/insurance
TESTS:
- request can be submitted
- provider sees own requests
- admin manages all
- insurance filter does not create thin index pages automatically
ACCEPTANCE CRITERIA:
- appointment request is operational but not falsely presented as instant confirmed booking
- insurance acceptance is visible and admin-manageable
STOP CONDITION: stop after appointment/insurance QA report
```

---

## 15. Phase 9 Task Prompt — Production Hardening

```text
TASK ID: DM-V10.3-P9-PRODUCTION-HARDENING
PHASE: 9
GOAL: Prepare production deployment safely.
FILES TO READ:
- 16_QA_TESTING_RESPONSIVE_AND_LAUNCH_CHECKLIST.md
- 17_OBSERVABILITY_BACKUP_PRIVACY_AND_RETENTION.md
- 28_SEO_PERFORMANCE_AND_CORE_WEB_VITALS_GUARDRAILS.md
- 57_PRODUCTION_MONITORING_SECURITY_AND_SYSTEM_HEALTH.md
MUST IMPLEMENT:
- security review fixes
- RLS review fixes
- SEO QA fixes
- performance optimization
- system health panel basics
- backup/restore documentation
- deployment checklist
MUST NOT IMPLEMENT:
- new product features beyond hardening
DATABASE CHANGES: only hardening fixes
RLS CHANGES: tighten policies only
TESTS:
- full build/lint/typecheck
- route smoke tests
- RLS tests
- SEO tests
- mobile/RTL QA checklist
ACCEPTANCE CRITERIA:
- production checklist complete
- no P0/P1 bugs open
- rollback plan documented
STOP CONDITION: final production readiness report
```

---

## 16. Final Instruction

After each phase, Codex must output:

```text
- completed scope
- changed files
- database changes
- RLS changes
- routes added
- tests run
- known issues
- next recommended task
```

Do not proceed to the next phase without explicit approval.
