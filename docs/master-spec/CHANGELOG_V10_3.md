# CHANGELOG_V10_3.md

# DrMuscat V10.3 Operational + Admin + SEO Hardening Patch

## Added
- Appointment request and availability foundation.
- Insurance acceptance foundation.
- Full admin operating system modules.
- SEO operations, redirect manager, and indexability manager.
- Taxonomy, geo, bulk import, and source management.
- Provider dashboard and plan entitlement governance.
- Patient account roadmap with favorites/history.
- Support tickets and notification templates.
- Data quality, duplicate merge, and audit system.
- Production monitoring, security, and system health requirements.
- Codex phased build master plan.
- Database canonical conflict-resolution patch.
- Acceptance criteria per panel.
- Competitor parity and gap matrix.
- Panel route and permission matrix.
- Final Codex implementation prompt.

## Fixed
- V10.2 priority-order weakness: new V10.3 files are now canonical.
- Clarified `geo_areas` vs legacy `areas`.
- Clarified `doctor_practice_locations` vs legacy `doctor_centers`.
- Resolved `plans` and `settings` conflict risk using `provider_plans` and `platform_settings` guidance.
- Added missing first-class doctor profile ALTER guidance.
- Added center geo linkage guidance.
- Replaced risky behavior event partitioning for MVP with normal indexed table guidance.
- Added SEO indexability database model.
- Added redirect manager requirements.
- Added admin module acceptance criteria.

## Still Deferred by Design
- Full live appointment booking.
- Real-time insurance eligibility.
- Full payment gateway integration.
- AI diagnosis/triage.
- Meilisearch.
- Native mobile app.
- Full patient medical records.
- Medicine delivery/lab marketplace.


## V10.3.1 Fix

This package revision expands previously small/stub files into implementation-ready specifications:

```text
11_PARTNER_ONBOARDING_PAYMENTS_AND_BILLING.md
14_PREMIUM_UI_UX_PERFORMANCE_AND_ACCESSIBILITY.md
16_QA_TESTING_RESPONSIVE_AND_LAUNCH_CHECKLIST.md
17_OBSERVABILITY_BACKUP_PRIVACY_AND_RETENTION.md
20_UTF8_MEDICAL_CLAIM_GUARDRAILS.md
21_SEED_DATA_AND_CONTENT_BOOTSTRAP.md
63_FINAL_CODEX_IMPLEMENTATION_PROMPT_V10_3.md
```

It also adds `CHANGELOG_V10_1.md` and `CHANGELOG_V10_2.md`, and adds explicit legacy override notes for old `doctor_centers` mentions in earlier files.
