# 58_CODEX_PHASED_BUILD_MASTER_PLAN.md

# DrMuscat V10.3 — Codex Phased Build Master Plan

## 1. Purpose
This file is the canonical build execution plan for ChatGPT/Codex with GitHub. Do not ask Codex to build the whole platform in one uncontrolled task. That is not ambition; that is technical vandalism with a nicer font.

## 2. Execution Model
ChatGPT = architect, reviewer, QA controller.
Codex = implementation agent.
GitHub = source of truth.
Supabase = database/auth/storage.
Vercel/VPS = deployment target.

## 3. Mandatory Task Template
Every Codex task must use:

```text
TASK ID:
PHASE:
GOAL:
FILES TO READ:
FILES TO CREATE/EDIT:
MUST IMPLEMENT:
MUST NOT IMPLEMENT:
DATABASE CHANGES:
RLS CHANGES:
ROUTES:
TESTS:
ACCEPTANCE CRITERIA:
STOP CONDITION:
```

## 4. Phase 0 — Spec Freeze and Schema Patch
Goal:
- Apply V10.3 canonical decisions.
- Resolve schema conflicts.
- Produce migration order.

Must implement:
- Use file 59 for canonical database patch.
- Update route canonicals to `/[locale]/[country]`.
- Confirm no fa/hi launch routes.
- Confirm no Health Card feature.

Stop condition:
- Produce review only. No app code.

## 5. Phase 1 — Repo Foundation
Must implement:
- Next.js App Router.
- TypeScript.
- Tailwind.
- Supabase client/server setup.
- i18n with `en` and `ar` only.
- `/[locale]/[country]` route shell.
- RTL/LTR layout.
- Shared UI shell.
- Env examples.

Must not implement:
- Payment gateways.
- AI chat.
- Appointment engine beyond route placeholders.
- Full provider dashboard.

Acceptance:
- `/en/om` and `/ar/om` render.
- Build/lint/typecheck pass.

## 6. Phase 2 — Database Core and RLS
Must implement:
- Core enums.
- Profiles.
- Geo hierarchy.
- Taxonomy.
- Centers.
- Doctors.
- Doctor practice locations.
- Services.
- Minimal media.
- Claims.
- SEO pages.
- Redirect rules.
- Audit logs.

Must use:
- File 59.

Acceptance:
- Migrations run cleanly.
- Seed data inserts.
- RLS test queries pass.

## 7. Phase 3 — Public SEO Platform
Must implement:
- Homepage.
- Centers listing.
- Center profile.
- Doctors listing.
- Doctor profile.
- Specialty/area pages.
- Search/fuzzy basic.
- WhatsApp/phone/directions buttons.
- Metadata/canonical/hreflang.
- Sitemap/robots/llms.txt.

Must not implement:
- Full appointment live booking.
- Payment gateway.
- AI chat.

Acceptance:
- Public pages do not require login.
- Sitemap contains only valid `/en/om` and `/ar/om` URLs.
- No private data appears publicly.

## 8. Phase 4 — Admin Foundation
Must implement:
- Admin auth guard.
- Command center.
- Centers manager.
- Doctors manager.
- Claims manager.
- SEO manager minimal.
- Import manager minimal.
- Redirect manager.
- Audit log viewer.

Acceptance:
- Admin can manage core data.
- Non-admin blocked.
- Sensitive actions logged.

## 9. Phase 5 — Provider Dashboard and Claim
Must implement:
- Claim request form.
- Admin approve/reject.
- Provider workspace.
- Provider profile editor.
- Profile completeness.
- Media upload controls.

Acceptance:
- Provider can edit owned center only.
- Sensitive edits require review.

## 10. Phase 6 — Monetization Foundation
Must implement:
- Plans.
- Entitlements.
- Manual bank transfer/receipt upload.
- Admin payment approval.
- Sponsored slot foundation.
- Offers foundation.

Must not implement:
- Full payment gateway integration unless separately approved.

## 11. Phase 7 — Analytics, Support, Quality
Must implement:
- Click tracking.
- Behavior events MVP normal table, not risky partitioning.
- Provider analytics.
- Support tickets.
- Duplicate detection.
- Data quality dashboard.

## 12. Phase 8 — Appointment/Insurance Foundation
Must implement:
- Appointment request capture.
- Admin/provider request management.
- Insurance companies/acceptance.

Must not implement:
- Real-time eligibility verification.
- Calendar sync.

## 13. Phase 9 — Production Hardening
Must implement:
- Security review.
- RLS review.
- Performance checks.
- SEO QA.
- Monitoring/system health.
- Backup documentation.

## 14. Global Forbidden Actions
Codex must not:
- Add Persian/Hindi launch SEO routes.
- Reintroduce Health Card/card sales.
- Make public discovery require login.
- Force paid providers into organic ranking.
- Expose private admin/billing/CRM/license/receipt data.
- Create a second writable area system.
- Create a second writable doctor-location relation.
- Implement all phases in one task.
