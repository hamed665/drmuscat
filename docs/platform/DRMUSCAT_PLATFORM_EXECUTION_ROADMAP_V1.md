# DrMuscat Platform Execution Roadmap V1

## Status and Authority

- Status: Documentation-only.
- Authority: Execution roadmap and decision lock only.
- This document does not authorize implementation.
- This document must be read together with `docs/platform/DRMUSCAT_PLATFORM_ARCHITECTURE_V1.md`.
- This document does not replace the V10.4 master spec or any stricter guardrail.
- Future implementation requires separate PHASED_BUILD_ONLY approval.
- No code, route, migration, RLS, API, dashboard, billing, ads, offers, CMS, AI, analytics, sales CRM, review, seed, provider mutation, or auth behavior is approved by this document.

## Four-Axis Mapping

- Execution Phase: Phase 0 — Spec Freeze and Schema Patch / documentation alignment only.
- Lock Scope: Phase 0 — Repository Readiness.
- Product Module: Phase 0 — Setup Only / documentation alignment.
- Subphase ID: `ALIGN-PLATFORM-ROADMAP-V1`.

## 1. Purpose

Platform Architecture V1 defines what DrMuscat can become as a long-term healthcare, wellness, pet clinic, marketplace, SEO, admin, monetization, sales, CMS, analytics, and AI-assisted platform. This roadmap converts that architecture into a practical execution plan without authorizing product behavior.

This roadmap defines:

- What decisions are now locked.
- What remains future-only.
- What MVP means for a revenue-first, Oman-focused launch path.
- What documentation/spec PRs come next before implementation starts.
- What must be true before implementation starts.
- What stop rules prevent unsafe Codex drift.

## 2. Decision Lock V1

| # | Area | Decision | Reason | Impact |
| --- | --- | --- | --- | --- |
| 1 | Fixed plan pricing | Do not add fixed prices yet. | Keep market pricing flexible for Oman sales discovery. | Future plan specs may define feature matrix and pricing placeholders only. |
| 2 | Pet clinics | Include pet clinics as a launch category family from day one. | Strong WhatsApp-led lead potential and existing business context. | Taxonomy/model should allow pet clinic/pet wellness category without treating it as human medical care. |
| 3 | Appointment booking | Future-only. MVP uses WhatsApp, call, and directions. | Booking adds operational complexity and provider scheduling burden. | Data model may remain booking-ready but no booking implementation until separately approved. |
| 4 | Reviews | Delay full reviews until provider verification and moderation workflows mature. | Healthcare reviews need trust, anti-fake controls, moderation, and legal/compliance policy. | No aggregate rating or fake schema in MVP. Controlled testimonials may be future-reviewed. |
| 5 | Insurance filters | Future-only but schema-ready. | Insurance data is difficult to maintain accurately. | Avoid launching insurance filters until provider/plan data quality exists. |
| 6 | AI article engine | AI articles only after CMS workflow exists. | AI must not publish directly and needs editorial/medical/SEO review. | CMS + content review workflow comes before AI content generation. |
| 7 | Admin operations vs provider dashboard | Admin operations come before full provider dashboard. | Admin needs to control onboarding, verification, claims, data quality, and payments before providers can self-serve. | Build admin workflows first, then provider self-service. |
| 8 | Sales CRM surface | Sales CRM starts inside admin operations first; separate marketer panel later. | Early sales will be tightly controlled and manual. | First sales implementation is admin-scoped, then future role-scoped marketer panel. |
| 9 | Billing | Manual billing and manual payment approval before gateway. | Oman MVP can monetize earlier with controlled manual invoicing. | No payment gateway or checkout until later. |
| 10 | Public lead conversion | WhatsApp-first before appointment booking. | WhatsApp is faster for Oman/GCC provider conversion. | Track WhatsApp/call/directions before booking. |
| 11 | Programmatic SEO | Controlled and quality-gated only. | Thin healthcare pages are risky for SEO and trust. | Category/area/provider pages must pass content, supply, canonical, hreflang, and index/noindex rules. |
| 12 | Medical advice | DrMuscat is discovery, not diagnosis. | Avoid medical-risk behavior and trust violations. | No diagnosis, prescription, treatment recommendation, or AI medical advice features. |

## 3. MVP Definition V1

The MVP is a practical, revenue-first platform slice. It prioritizes trusted discovery, WhatsApp-led conversion, admin-controlled operations, manual monetization, and phase-gated future expansion. MVP definition does not authorize implementation.

### 3.1 Public MVP

Public MVP includes:

- Homepage.
- Category discovery.
- Area/category pages.
- Provider listing.
- Provider cards.
- Provider profile.
- Doctor profile.
- Basic search/filter.
- WhatsApp CTA.
- Call CTA.
- Directions CTA.
- Claim/list center CTA.
- Basic offers visibility only after offer workflow approval.
- Arabic/English pages.
- SEO-safe canonical/hreflang.
- Mobile-first UX.
- Trust/disclaimer labels.

### 3.2 Admin MVP

Admin MVP includes:

- Protected admin.
- Provider onboarding lead list/detail.
- Claim review.
- Provider verification review.
- Manual status changes.
- Admin notes.
- Audit log foundation.
- Basic data quality dashboard.
- Offer review later.
- Ad review later.
- Manual billing/payment approval later.

### 3.3 Provider MVP

Provider MVP includes:

- Claim/list flow.
- Profile preview.
- Basic provider dashboard shell only after admin operations are stable.
- Basic lead summary.
- Plan/billing read-only later.
- Offer/ad request later.
- Profile completeness score later.

### 3.4 Sales MVP

Sales MVP includes:

- Prospects.
- Pipeline stages.
- Follow-up date.
- Notes.
- Assigned marketer/admin owner.
- Converted provider relation.
- Manual commission tracking later.

### 3.5 Monetization MVP

Monetization MVP includes:

- Manual plans.
- Manual invoice.
- Manual payment approval.
- Verified badge.
- Sponsored placement request.
- Offer add-on request.
- WhatsApp click tracking.
- Provider performance snapshot.

## 4. Explicit Non-MVP Items

The following items are explicitly non-MVP:

- Full appointment booking.
- Payment gateway.
- Self-service checkout.
- AI chat.
- AI medical advice.
- AI article publishing before CMS.
- Insurance filters.
- Full reviews/rating system.
- Automatic commission payout.
- Wallet.
- Medical records.
- Prescriptions.
- Lab results.
- Private health records.
- Mass programmatic SEO.
- Persian/Hindi public routes.
- Complex ranking algorithm.
- Uncontrolled provider self-service mutations.

## 5. Execution Sequence V1

This roadmap defines the order for future documentation and implementation planning. It does not approve these implementations; it only defines order.

### Documentation/spec sequence before implementation

1. PR #175 — Roles and Permissions Spec V1
   - File: `docs/platform/DRMUSCAT_ROLES_AND_PERMISSIONS_SPEC_V1.md`
2. PR #176 — Provider Entity Model Spec V1
   - File: `docs/platform/DRMUSCAT_PROVIDER_ENTITY_MODEL_SPEC_V1.md`
3. PR #177 — Public Route and SEO Inventory Spec V1
   - File: `docs/platform/DRMUSCAT_PUBLIC_ROUTE_SEO_INVENTORY_SPEC_V1.md`
4. PR #178 — Admin Operations Spec V1
   - File: `docs/platform/DRMUSCAT_ADMIN_OPERATIONS_SPEC_V1.md`
5. PR #179 — Sales CRM Spec V1
   - File: `docs/platform/DRMUSCAT_SALES_CRM_SPEC_V1.md`
6. PR #180 — Plans, Entitlements, and Manual Billing Spec V1
   - File: `docs/platform/DRMUSCAT_PLANS_ENTITLEMENTS_BILLING_SPEC_V1.md`
7. PR #181 — Ads and Offers Spec V1
   - File: `docs/platform/DRMUSCAT_ADS_OFFERS_SPEC_V1.md`
8. PR #182 — CMS and AI Content Workflow Spec V1
   - File: `docs/platform/DRMUSCAT_CMS_AI_CONTENT_WORKFLOW_SPEC_V1.md`
9. PR #183 — Analytics and Events Spec V1
   - File: `docs/platform/DRMUSCAT_ANALYTICS_EVENTS_SPEC_V1.md`
10. PR #184 — Legal, Trust, and Compliance Spec V1
    - File: `docs/platform/DRMUSCAT_LEGAL_TRUST_COMPLIANCE_SPEC_V1.md`

### Implementation sequence after documentation/spec approval

High-level future implementation order:

1. Roles/permissions helpers and policy plan.
2. Provider entity migration batch.
3. Public read models / public projections.
4. Admin read-only operations.
5. Admin mutation workflows with audit.
6. Sales CRM admin-scoped MVP.
7. Plan/entitlement/manual billing foundation.
8. Offers foundation.
9. Ads request/review foundation.
10. Provider dashboard shell.
11. Provider self-service drafts.
12. CMS foundation.
13. Analytics/events foundation.
14. AI content assistance after CMS review workflow.

This roadmap does not approve these implementations; it only defines order.

## 6. Migration Readiness Gate

Before any migration PR, require:

- Entity spec approved.
- Permission spec approved.
- Public/private boundary approved.
- RLS policy plan approved.
- Audit log requirement defined.
- Admin/provider ownership rules defined.
- Seed/no-seed decision made.
- Generated types update plan defined.
- Validator/check update plan defined.
- Rollback notes defined.
- No conflicting existing table/view/function names.
- No public SELECT granted accidentally.
- No anon mutation.
- No license/private document leakage.
- No SEO route coupling unless explicitly approved.

## 7. Public Route Readiness Gate

Before any new public route PR, require:

- Route pattern approved.
- Locale/country pattern approved.
- Canonical rule approved.
- hreflang rule approved.
- Sitemap eligibility approved.
- Index/noindex decision approved.
- Schema eligibility approved.
- Minimum content/supply threshold defined.
- Empty/thin page behavior defined.
- Arabic and English metadata planned.
- No deprecated route pattern introduced.
- No duplicate route pattern introduced.

## 8. Admin Workflow Readiness Gate

Before any admin workflow PR, require:

- Admin role/scope approved.
- Super Admin boundary approved.
- Read-only vs mutation mode defined.
- Mutation audit rules defined.
- Sensitive action confirmation defined.
- Approval/rejection statuses defined.
- Internal notes privacy defined.
- Error states defined.
- Empty states defined.
- Protected route behavior verified.
- No public exposure of admin data.

## 9. Provider Dashboard Readiness Gate

Before provider dashboard PR, require:

- Provider ownership model approved.
- Organization membership model approved.
- Center staff roles approved.
- Draft vs published profile model approved.
- Sensitive field review rules approved.
- Plan entitlement checks approved.
- Audit log requirements approved.
- Public/private media rules approved.
- Provider cannot self-verify, self-activate paid plan, or self-assign sponsored status.

## 10. Billing Readiness Gate

Before billing/payment PR, require:

- Plan matrix approved.
- Entitlement keys approved.
- Manual invoice statuses approved.
- Manual payment statuses approved.
- Payment approval roles approved.
- Audit log requirements approved.
- No payment gateway unless separately approved.
- No card storage.
- Entitlements activate only after approved payment.
- Provider cannot self-approve payment or entitlement.

## 11. Ads and Offers Readiness Gate

Before ads/offers PR, require:

- Offer/ad status workflow approved.
- Sponsored labeling rules approved.
- Medical/advertising claim review rules approved.
- Payment/entitlement dependency approved.
- Placement eligibility approved.
- Expiry/schedule rules approved.
- Audit requirements approved.
- No hidden organic ranking boost.
- No fake schema.
- No unsupported before/after or treatment guarantees.

## 12. CMS and AI Readiness Gate

Before CMS/AI PR, require:

- CMS content types approved.
- Revision history approved.
- Draft/review/publish workflow approved.
- Rollback rules approved.
- SEO field control approved.
- Medical reviewer workflow approved.
- AI allowed inputs/outputs approved.
- AI cannot directly publish.
- High-risk content requires human medical review.
- No medical advice or diagnosis behavior.

## 13. Analytics and Privacy Readiness Gate

Before analytics/events PR, require:

- Event taxonomy approved.
- User privacy boundary approved.
- No diagnosis/prescription/lab result/medical record event storage.
- Provider analytics aggregation rules approved.
- Admin analytics access rules approved.
- Consent/cookie implications reviewed later where needed.
- No private health data collection.

## 14. Stop Rules

Codex must stop and report instead of implementing if:

- Required source docs are missing.
- Existing specs conflict.
- Role names conflict.
- Entity names conflict.
- Public/private boundary is unclear.
- RLS policy is unclear.
- A migration would expose private data.
- A public route has unclear canonical/hreflang/indexing behavior.
- A feature requires medical/legal review but lacks policy.
- A feature requires billing/payment behavior not approved.
- A feature requires provider self-service before ownership model is approved.
- A feature would create fake reviews, fake ratings, fake schema, or unsupported claims.
- A feature would create patient medical records or diagnosis behavior.
- A feature would add Persian/Hindi routes.
- A feature would weaken existing SEO/RLS/security guardrails.

## 15. Feature Gate Checklist

Every future PR must answer:

1. Which role/user is this for?
2. Which surface/panel/route does it affect?
3. Is it public or private?
4. What permission is required?
5. What ownership scope applies?
6. Does it need plan entitlement?
7. Does it require admin approval?
8. Does it require audit logging?
9. Does it affect billing, ads, offers, leads, or analytics?
10. Does it affect SEO/indexing/schema?
11. Does it expose private or sensitive data?
12. Does it require RLS/security changes?
13. Does it require medical/legal review?
14. What validations must pass?
15. What is explicitly out of scope?

## 16. Validation Expectations

For this PR:

- `git status --short`.
- `pnpm lint` if repository conventions require or if README/docs linting is included.

Do not fake validation. If validation cannot run, report why.

## 17. Completion Report Requirements

The final Codex report must include:

- Files created/changed.
- Confirmation this is documentation-only.
- Confirmation no source code changed.
- Confirmation no routes changed.
- Confirmation no migrations/RLS/API/server actions changed.
- Confirmation no dashboard/business logic was implemented.
- Summary of locked decisions.
- Summary of execution sequence.
- Summary of readiness gates.
- Validation results.
- Any blockers or unresolved conflicts.
