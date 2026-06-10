# DrMuscat Platform Architecture V1

## Status and Authority

- Status: Documentation-only.
- Authority: Future architecture planning only.
- This document does not authorize implementation.
- This document must not replace the existing V10.4 master spec or any stricter guardrails.
- Any future implementation requires separate `PHASED_BUILD_ONLY` task approval.
- Existing current-state restrictions remain active.
- No code, route, migration, RLS, API, dashboard, billing, ads, offers, CMS, AI, analytics, sales CRM, review, seed, or provider mutation behavior is approved by this document.

## Four-Axis Mapping

- Execution Phase: Phase 0 — Spec Freeze and Schema Patch / documentation alignment only.
- Lock Scope: Phase 0 — Repository Readiness.
- Product Module: Phase 0 — Setup Only / documentation alignment.
- Subphase ID: `ALIGN-PLATFORM-ARCH-V1`.

## 1. Platform Definition

DrMuscat is planned as a healthcare discovery and provider business platform for Oman-first growth, not only as a public directory. The long-term platform architecture includes:

- Public healthcare discovery platform.
- Provider SaaS.
- Doctor dashboard.
- Center/Clinic dashboard.
- Admin/Super Admin operations.
- Sales/Marketer CRM.
- Ads and sponsored placement platform.
- Offers engine.
- CMS.
- AI content workflow.
- Analytics and lead tracking.
- Manual billing/subscription system.

The current repository does not implement all of these capabilities. This document records the target architecture so future implementation can be broken into safe, approved, phase-gated work without drifting into unapproved features.

## 2. Target Audiences

### 2.1 Public user / visitor / future patient user

Goals:

- Discover healthcare, beauty, wellness, lab, pharmacy, and pet-care providers.
- Search by condition-adjacent needs, category, specialty, service, area, provider name, or doctor name without receiving medical advice.
- Compare trust signals, contact options, location, services, offers, and profile completeness.
- Use clear CTAs such as WhatsApp, call, directions, share, claim/list center, and report incorrect information.

Platform value:

- Reduces discovery friction.
- Makes local provider information easier to evaluate.
- Provides clear labels for verified, claimed, sponsored, and reviewed information where approved.
- Keeps medical and advertising claims guarded by disclaimers and review workflows.

### 2.2 Provider: center, clinic, hospital, lab, pharmacy, beauty, wellness, pet clinic, doctor

Goals:

- Improve public visibility.
- Claim or list profiles.
- Manage accurate contact, branch, service, doctor/team, media, and offer information in future approved dashboards.
- Receive leads and understand performance.
- Request ads, sponsored placements, offers, verification, and plan upgrades where allowed.

Platform value:

- Acts as a provider SaaS growth channel.
- Helps providers maintain high-quality public profiles.
- Supports manual billing/subscription workflows and add-on monetization later.
- Keeps provider-owned access scoped and audited.

### 2.3 Admin / Super Admin / content / finance team

Goals:

- Operate provider onboarding, claims, verification, quality review, content, SEO, offers, ads, payments, plans, reports, and support.
- Maintain trust, compliance, platform quality, and operational visibility.
- Keep dangerous/global settings limited to Super Admin.

Platform value:

- Centralizes daily operations.
- Supports controlled approval workflows.
- Preserves auditability for sensitive provider, billing, content, SEO, and settings changes.

### 2.4 Sales / marketer / sales manager

Goals:

- Track prospects, follow-ups, notes, outreach stages, documents, and conversion.
- Attribute provider registrations and paid conversions.
- Let sales managers assign prospects, review team performance, and approve commission only after future billing approval permits it.

Platform value:

- Creates a structured revenue pipeline.
- Connects sales activity to provider onboarding and manual payment approval.
- Prevents unscoped access by keeping sales agents assigned to their own prospects unless a sales manager role is explicitly approved.

## 3. User-Friendly Public Experience

Future public surfaces should be designed for fast, trustworthy, mobile-first discovery.

### 3.1 Future capabilities

- Smart search by keyword, category, specialty, service, area, provider name, and doctor name.
- Arabic/English search readiness.
- Area/category discovery.
- Trust signals.
- Verified badge.
- Claimed/unclaimed status.
- Profile reviewed date.
- License/contact verification labels where approved.
- Report incorrect information.
- WhatsApp CTA.
- Call CTA.
- Directions CTA.
- Share profile.
- Save/compare later.
- Offers discovery.
- Clear disclaimers.
- Sponsored labels.
- Mobile-first design.

### 3.2 MVP distinction

MVP public experience should prioritize:

- Homepage.
- Category and area discovery.
- Provider cards.
- Provider profiles.
- Doctor profiles.
- Search/filter basics.
- WhatsApp/call/directions CTAs.
- Claim/list center CTA.
- Basic offers visibility where separately approved.
- Clear disclaimers and sponsored labels where needed.

### 3.3 Later distinction

Later public experience may add:

- Saved profiles and compare-later flows.
- Advanced multilingual search ranking.
- Personal user accounts.
- Deeper offer discovery.
- Review/reputation workflows.
- Answer-engine summaries only when based on visible approved content.
- Appointment booking only if separately approved.

## 4. Provider-Friendly Experience

Future provider-side value should make DrMuscat useful as a business growth and profile-quality platform.

Future provider capabilities may include:

- Provider profile quality.
- Onboarding/list center flow.
- Claim flow.
- Profile completeness score.
- Media/gallery management.
- Services management.
- Doctor/team relationship management.
- Working hours.
- Branches.
- WhatsApp/contact management.
- Lead inbox.
- Analytics.
- Offers request.
- Ads request.
- Plan/billing view.
- Staff roles.
- Verification status.
- Upgrade prompts.

Provider dashboard mutations are not currently implemented by this document and remain phase-gated. Future mutations must enforce ownership, role scope, entitlement checks, approval requirements, RLS, server-side validation, and audit logging where applicable.

## 5. Role Model

Future roles should be explicit, scoped, and fail closed. No role is implemented by this document.

| Role | Intended access level | Scope | Can see | Can edit | Must not access |
| --- | --- | --- | --- | --- | --- |
| `public_visitor` | Public anonymous discovery | Public/indexable only | Published provider, doctor, category, area, offer, CMS, and legal content | Nothing except approved safe public forms in future phases | Private tables, admin/provider dashboards, billing, CRM notes, license files, receipts, unpublished content |
| `patient_user` later | Authenticated public user | Owned account | Own saved items, preferences, future requests, and allowed public content | Own profile/preferences and future patient-owned records if approved | Provider private data, admin data, diagnosis/prescription/lab-result records unless a future medical-record scope is explicitly approved |
| `doctor` | Professional profile owner | Own doctor identity/profile and linked relationships where approved | Own profile, linked organizations, leads or analytics if approved | Own doctor profile fields allowed by policy | Center-owned records not linked to the doctor, center billing, other doctors' private data, admin notes |
| `center_owner` | Organization owner | Owned organization(s) | Organization profile, branches, staff, doctors/team links, leads, analytics, plans, billing view where approved | Own center fields allowed by policy, staff assignments, service/media drafts, offer/ad requests | Entitlement state, payment status, verified badge, license verification, sponsored status, organic ranking controls |
| `center_staff` | Delegated organization staff | Assigned organization(s) and staff permission | Assigned leads, profile sections, service/media/content drafts, billing view only when role allows | Only fields/actions delegated by owner/manager | Global provider data, entitlement/payment/verification controls, unrelated branches/providers |
| `sales_agent` / `marketer` | Sales pipeline contributor | Assigned prospects | Own prospects, follow-ups, notes, converted status where approved | Own assigned prospect updates | Other agents' prospects, billing approval, entitlement activation, admin settings |
| `sales_manager` | Sales team manager | Team/all assigned sales scope | Team prospects, pipeline, performance, assignment queues | Assign prospects, review team records, approve commission only if future billing allows | Super Admin settings, unrelated private provider documents, unaudited commission payout |
| `admin` | Daily operations | All operational records allowed by policy | Providers, doctors, claims, onboarding leads, offers, ads, CMS, reports, support, review queues | Daily review/approval workflows approved by phase | Dangerous/global settings, service secrets, uncontrolled billing/entitlement changes, Super Admin-only actions |
| `super_admin` | Global/dangerous platform control | All, with audit | Full operational and configuration visibility where lawful | Roles, permissions, global settings, plan builder, pricing, feature flags, finance controls, danger-zone actions | Secrets outside approved secret management, unlogged sensitive changes, unsupported medical/advertising claims |
| `content_editor` | Content production | Assigned CMS/content scope | Drafts, CMS copy, article briefs, SEO fields where assigned | Draft/edit content | Publish high-risk content without review, change global SEO/indexing unless allowed, access billing/CRM/private documents |
| `medical_reviewer` | Medical safety review | Assigned medical-sensitive content | Medical-sensitive content awaiting review, reviewer checklist, source notes | Review status, safety notes, approval/rejection if allowed | Billing, CRM, provider entitlement controls, unrelated admin settings |
| `finance_manager` | Finance operations | Approved finance workflows | Invoices, manual payments, receipts, plan/payment reports where approved | Approve/reject allowed finance workflows, subject to future approval | Card storage, gateway secrets, unapproved cash payouts, provider clinical/private records |

Principles:

- Super Admin controls dangerous/global settings.
- Admin handles daily operations but not global dangerous settings.
- Provider roles are scoped to owned/linked organizations.
- Doctor identity must remain independent from center relationship.
- Sales roles are scoped to assigned prospects unless sales manager.

## 6. Permission and Scope Model

Future permissions should be modeled as explicit tuples. No actual permissions are implemented in this PR.

Each permission decision should include:

- Resource.
- Action.
- Scope.
- Role.
- Approval requirement.
- Audit requirement.

Example permission matrix:

| Resource | Action | Scope | Role | Approval requirement | Audit requirement |
| --- | --- | --- | --- | --- | --- |
| Center profile | Manage allowed editable fields | Own center | `center_owner` | Sensitive fields may require admin review | Yes for sensitive edits |
| Center leads | Manage/read/update | Assigned center | `center_staff` | Depends on staff role | Yes for status changes |
| Doctor profile | Manage allowed editable fields | Own doctor identity | `doctor` | Sensitive credentials/license fields require review | Yes for sensitive edits |
| Sales prospects | Manage | Own assigned prospects | `sales_agent` | Manager/admin approval for conversion/commission if applicable | Yes |
| Sales prospects | View/assign | Team scope | `sales_manager` | Future sales approval policy | Yes for assignment and commission |
| Providers | Review/approve | All operational | `admin` | Required for provider approval workflows | Yes |
| Settings | Manage | All/global | `super_admin` | Super Admin-only | Yes, mandatory |
| CMS content | Draft | Assigned content | `content_editor` | Review before publish | Revision history required |
| Medical-sensitive content | Review | Assigned/all review queue | `medical_reviewer` | Human medical review required for high risk | Yes |
| Finance workflows | View/approve allowed items | Finance scope | `finance_manager` | Subject to future approval | Yes, mandatory |

Future implementations must use server-side checks and RLS. Client-only permission checks are not sufficient.

## 7. Provider Entity Model

Future entity modeling should support organizations, doctors, branches, documents, verification, taxonomy, and relationships without making legacy or ambiguous tables writable sources of truth.

Future entities may include:

- Organizations.
- Organization profiles.
- Organization branches.
- Organization members.
- Organization documents.
- Organization verification.
- Doctors.
- Doctor profiles.
- Doctor-specialty/service links.
- Doctor-organization relationships.
- Locations/areas/cities/countries.
- Categories/specialties/services/languages.

Core rule:

- Center owns the relationship.
- Doctor owns identity/profile continuity.

Scenarios:

- Independent doctor: doctor profile exists without an active center relationship, with public display rules defined by future policy.
- Doctor under one center: center relationship controls branch/service context while doctor identity remains continuous.
- Doctor under multiple centers: each relationship may have different branch, schedule, services, contact, and visibility settings.
- Center-managed doctor profile: center may manage relationship-specific fields and possibly draft doctor profile updates, subject to doctor/admin policy.
- Self-managed doctor profile: doctor controls own identity and profile fields while center controls center relationship data.
- Doctor leaves center: relationship is ended/deactivated without deleting doctor identity continuity.
- Center claims an existing profile: claim review links organization ownership without duplicating canonical provider identity.
- Doctor claims profile later: doctor identity claim can coexist with center relationships under a clear conflict-resolution and approval workflow.

## 8. Center Staff Roles

Future center staff roles should allow delegation without giving every staff member owner-level power. No implementation is included.

| Center staff role | Intended future access |
| --- | --- |
| `owner` | Full organization management. |
| `manager` | Profile, doctors, services, offers, leads, analytics. |
| `receptionist` | Leads/contact handling only. |
| `marketing_staff` | Media/offers/ad requests where allowed. |
| `billing_viewer` | Plan/invoices/payments read-only. |
| `content_editor` | Draft changes only. |

Provider staff must never self-edit entitlement state, verified badge, payment status, sponsored status, license verification status, organic ranking score, or platform-wide settings.

## 9. Plans and Entitlements

Future plan definitions should support manual subscription/billing operations without hardcoding fixed pricing in this document.

Future plans:

- Free / Basic.
- Verified Starter.
- Growth Partner.
- Premium / Ads Pro.
- Custom Enterprise later.

### 9.1 Feature matrix

| Feature | Free / Basic | Verified Starter | Growth Partner | Premium / Ads Pro | Custom Enterprise later |
| --- | --- | --- | --- | --- | --- |
| Basic profile | Yes | Yes | Yes | Yes | Custom |
| Verified badge | No or request-only | Eligible after approval | Eligible after approval | Eligible after approval | Custom |
| Photos/media limits | Low | Moderate | Higher | Highest standard | Custom |
| Doctors under center | Limited | Moderate | Higher | Higher/premium | Custom |
| Branches | Limited or none | Limited | Multiple | Multiple | Custom |
| Active offers | None public; draft/request upgrade | Limited | Multiple | Multiple/campaign support | Custom |
| Homepage offer eligibility | No | No or request-only | Eligible | Priority eligible | Custom |
| Ads request eligibility | Request upgrade | Eligible | Eligible | Priority eligible | Custom |
| Leads inbox | Basic or limited if approved | Yes | Yes | Yes | Custom |
| Analytics level | None/basic snapshot | Basic | Standard | Advanced | Custom |
| Staff users | None/owner only | Limited | Multiple | More | Custom |
| Priority support | No | Standard | Priority | Priority/account support | Custom |
| Account manager | No | No | Optional | Eligible | Custom |
| Claim support | Basic | Assisted | Assisted | Priority assisted | Custom |
| Profile quality tools | Basic prompts | Yes | Yes | Advanced | Custom |

### 9.2 Entitlement concepts

Future entitlement keys may include:

- `max_photos`.
- `max_doctors`.
- `max_branches`.
- `max_offers`.
- `can_request_ads`.
- `can_view_analytics`.
- `can_receive_leads`.
- `can_manage_staff`.
- `can_show_verified_badge`.
- `can_use_featured_placement`.
- `can_request_homepage_offer`.
- Support level.

Entitlements activate only after approved payment when paid plan/billing is implemented. Providers must not self-edit entitlement state. Admin/Super Admin changes must be audited.

No fixed prices are defined in this document.

## 10. Add-ons and Monetization

Future add-ons may include:

- Homepage featured placement.
- Category page featured placement.
- Area page featured placement.
- Offer homepage placement.
- Sponsored card.
- Banner campaign.
- WhatsApp lead boost.
- Profile media boost.
- Seasonal package campaign.
- Article sponsorship later.
- Premium microsite later.

Rules:

- Subscription and add-ons are separate.
- A provider on a lower plan may buy specific add-ons if future policy allows.
- Sponsored content must be labeled.
- No hidden organic ranking boosts are allowed.
- Add-ons must not bypass medical, advertising, billing, entitlement, RLS, audit, or SEO guardrails.

## 11. Ads Platform

Future ad placement types may include:

- Homepage hero sponsor.
- Homepage featured provider.
- Homepage offer placement.
- Category sponsored card.
- Area sponsored card.
- Search sponsored result.
- Article sponsor later.
- WhatsApp/newsletter campaign later.

Future ad workflow:

- `draft`.
- `pending_review`.
- `approved`.
- `rejected`.
- `payment_pending`.
- `scheduled`.
- `active`.
- `paused`.
- `expired`.
- `cancelled`.

Rules:

- Admin review required.
- Sponsored label required.
- No misleading medical claims.
- No hidden quality ranking.
- No unsupported before/after or treatment guarantee.
- Payment approval before activation where monetized.

Future analytics:

- Impressions.
- Clicks.
- WhatsApp clicks.
- Profile visits.
- Offer clicks.
- CTR.
- Duration.

No ads platform behavior is implemented by this document.

## 12. Offers Engine

Future offer types may include:

- Discount.
- Package.
- Seasonal campaign.
- Free consultation if allowed.
- Beauty package.
- Dental checkup.
- Lab package.
- Pet vaccination.
- Wellness package.

Future offer fields may include:

- Provider.
- Title en/ar.
- Short description en/ar.
- Full description en/ar.
- Terms en/ar.
- Price before.
- Price after.
- Discount percent.
- Start date.
- End date.
- Category.
- Target area.
- CTA.
- Status.

Future offer statuses:

- `draft`.
- `pending_review`.
- `approved`.
- `active`.
- `expired`.
- `rejected`.
- `cancelled`.

Future placement options:

- Provider profile.
- Offers page.
- Homepage carousel.
- Category page.
- Area page.
- Sponsored offer slot.

Future plan rules:

- Free: no public offer, can draft/request upgrade.
- Starter: limited active offers.
- Growth: multiple offers.
- Premium: campaign support and homepage eligibility.

No offers engine behavior is implemented by this document.

## 13. Sales / Marketer CRM

Future prospect fields may include:

- Prospect name.
- Provider type.
- Category.
- Area.
- Contact person.
- Phone.
- WhatsApp.
- Email.
- Instagram.
- Google Maps link.
- Stage.
- Assigned sales agent.
- Follow-up date.
- Notes.
- Documents.
- Claim/register link.
- Converted provider relation.

Future pipeline stages:

- `new`.
- `contacted`.
- `meeting_scheduled`.
- `presented`.
- `interested`.
- `documents_requested`.
- `registered`.
- `verified`.
- `paid`.
- `lost`.
- `follow_up_later`.

Sales manager capabilities may include:

- View team.
- Assign prospects.
- Review performance.
- Approve commission only when future billing allows.

Future commission statuses:

- `pending`.
- `approved`.
- `paid_manual`.
- `cancelled`.

Commission rules:

- Commission is only after approved payment.
- No automatic cash payout in MVP.
- Commission must be audited and tied to approved billing records.

No sales CRM behavior is implemented by this document.

## 14. Admin and Super Admin Operations

Future Admin sections may include:

- Overview.
- Providers.
- Doctors.
- Centers.
- Claims.
- Onboarding leads.
- Leads.
- Offers.
- Ads.
- Payments.
- Plans.
- CMS.
- Articles.
- SEO.
- Users.
- Marketers.
- Reviews.
- Reports.
- Audit logs.
- Settings.

Future Admin workflows may include:

- Provider approval.
- Claim review.
- Document review.
- Lead review.
- Offer review.
- Ad review.
- Support requests.
- Profile data quality.
- Internal notes.

Future Super Admin sections may include:

- System settings.
- Roles and permissions.
- Plan builder.
- Pricing.
- Global SEO config.
- Global CMS config.
- Admin user management.
- Finance control.
- Audit logs.
- Danger zone.
- Feature flags.
- AI policy settings.
- Brand settings later.

Admin daily work is allowed only in future approved phases. Super Admin controls dangerous/global settings. No mutation workflows are implemented by this PR.

## 15. CMS and Homepage Control

Future CMS-managed content may include:

- Hero title en/ar.
- Hero subtitle en/ar.
- Primary CTA.
- Secondary CTA.
- Search placeholder.
- Trust section.
- FAQ.
- Featured categories.
- Provider CTA.
- Offer section copy.
- Footer disclaimer.
- Support text.
- Category intro text.
- Area intro text.
- Legal snippets.
- SEO title/description.
- OG title/description.

Future CMS workflow:

- `draft`.
- `review`.
- `approved`.
- `published`.
- `archived`.

Future permissions:

- `content_editor` can draft/edit.
- `admin` can manage daily copy where allowed.
- `medical_reviewer` reviews medical-sensitive content.
- `super_admin` controls global SEO/canonical/indexing/high-risk publishing.

Revision history and rollback are required for future CMS implementation. No CMS behavior is implemented by this document.

## 16. AI Content Workflow

Goal: AI may assist with drafts, briefs, translations, SEO ideas, FAQ suggestions, and internal link suggestions. AI must not directly publish medical content.

Future AI inputs may include:

- Keyword.
- Intent.
- Category.
- Language.
- Risk level.
- Analytics signals.
- Admin topic request.
- Sources.
- Do/don't list.

Future AI outputs may include:

- Title ideas.
- Meta title.
- Meta description.
- Outline.
- FAQ ideas.
- Article draft.
- Internal link suggestions.
- Schema recommendation.
- Risk notes.
- Reviewer checklist.

Future workflow:

- Keyword selected.
- Content brief generated.
- Editor edits brief.
- AI draft generated.
- Editor review.
- Medical safety review.
- SEO review.
- Final approval.
- Published.

Risk levels:

- Low risk: choosing clinic, checklist, general discovery.
- Medium risk: general procedure preparation.
- High risk: symptoms, treatment, medication, emergency care, diagnosis-related content.

Rule: High-risk medical content must not publish without medical reviewer/human approval.

No AI content workflow behavior is implemented by this document.

## 17. Reviews and Trust

Future review/reputation system concepts:

- Review intake.
- Moderation.
- No fake reviews.
- No unsupported medical outcomes.
- Provider response later.
- Report review.
- No `AggregateRating` until enough approved real reviews.
- Controlled testimonials may be considered before full reviews.
- Review policy required.

No review system behavior is implemented by this document.

## 18. Analytics and Event Tracking

Future public/user events may include:

- `search_performed`.
- `category_clicked`.
- `area_selected`.
- `profile_view`.
- `doctor_profile_view`.
- `whatsapp_click`.
- `call_click`.
- `directions_click`.
- `offer_view`.
- `offer_click`.
- `ad_impression`.
- `ad_click`.
- `claim_started`.
- `claim_submitted`.
- `lead_submitted`.
- `provider_signup_started`.

Future provider analytics may include:

- Profile views.
- Search appearances.
- WhatsApp clicks.
- Call clicks.
- Directions clicks.
- Offer performance.
- Ad performance.
- Source attribution.

Future admin analytics may include:

- Provider growth.
- Leads.
- Claims.
- Paid conversions.
- Sales performance.
- Content performance.
- SEO/indexing health.

Privacy rules:

- No diagnosis storage.
- No prescription data.
- No sensitive medical record data.
- Event tracking must be privacy-safe and phase-approved.

No analytics or event tracking behavior is implemented by this document.

## 19. Billing and Finance

Future manual billing plans:

- Free.
- Verified Starter.
- Growth Partner.
- Premium / Ads Pro.
- Custom Enterprise later.

Future billing terms:

- Monthly.
- 3 months.
- 6 months.
- 12 months.
- Custom.

Future payment methods:

- Cash.
- Bank transfer.
- Cheque.
- Manual adjustment.
- Gateway later only.

Future invoice statuses:

- `draft`.
- `issued`.
- `payment_pending`.
- `paid`.
- `rejected`.
- `cancelled`.
- `refunded` later.

Payment approval principles:

- Admin/finance review required.
- Entitlement activation only after approved payment.
- All payment/plan/entitlement changes audited.
- No card storage.
- No gateway implementation in this PR.

No billing or finance behavior is implemented by this document.

## 20. Notifications

Future notification events may include:

- Claim submitted.
- Claim approved/rejected.
- Provider lead received.
- Offer approved/rejected.
- Ad approved/rejected.
- Payment confirmed.
- Subscription expiring.
- Profile needs update.
- License expiring.
- CMS review requested.
- Medical review requested.

Future channels:

- Email.
- Dashboard notifications later.
- WhatsApp manual first / automated later only if approved.

No notification behavior is implemented by this document.

## 21. Legal and Compliance

Future legal/compliance content should include:

- Privacy Policy.
- Terms of Use.
- Medical Disclaimer.
- Advertising Policy.
- Review Policy.
- Provider Terms.
- Content Policy.
- Data Removal Request.
- Report Incorrect Information.
- Sponsored Placement Disclosure.

Healthcare content and advertising must be reviewed carefully. Future legal and compliance implementation must be separately approved and must not rely on this architecture document as implementation authority.

## 22. Security, RLS, and Audit

Required future principles:

- No anonymous mutation.
- No public access to raw private tables.
- RLS required.
- Server-side permission checks.
- Private license documents.
- File upload validation.
- Admin audit logs.
- Role-scoped dashboards.
- Super Admin-only dangerous actions.
- Rate limiting later.
- Sensitive financial actions audited.
- Sensitive content publishing audited.

No security, RLS, or audit implementation is included in this document.

## 23. SEO, Local SEO, and Answer Engine Readiness

Future SEO architecture:

- Canonical URLs.
- `hreflang` en/ar/x-default.
- Sitemap discipline.
- Robots discipline.
- Structured data only when supported by visible content.
- Category pages.
- Area pages.
- Provider pages.
- Doctor pages.
- Offer pages.
- Article pages later.
- `noindex` thin pages.
- Internal linking.
- Arabic/English metadata.
- No Persian/Hindi routes unless explicitly approved.
- No deprecated route patterns.
- No duplicate route patterns.
- No fake schema.
- LLM/answer-ready summaries later only if based on visible approved public content.

Programmatic SEO quality gates:

- Enough provider supply.
- Unique visible content.
- Useful localized metadata.
- Canonical.
- Index/noindex decision.
- Medical safety review where needed.

No SEO route, sitemap, schema, or metadata implementation is included in this document.

## 24. Design and UX Standards

Future DrMuscat UI should follow 2026 healthcare trust standards:

- Mobile-first.
- Responsive across iPhone, Android, tablet, laptop, desktop.
- Premium healthcare-trust visual style.
- No placeholder-looking UI.
- Accessibility WCAG 2.2 AA target.
- Semantic HTML.
- Keyboard navigation.
- Visible focus states.
- Readable contrast.
- Optimized images.
- Fast Core Web Vitals.
- Animations only if performance-safe.
- `prefers-reduced-motion` respected.

Future component discipline should cover:

- Buttons.
- Cards.
- Forms.
- Tables.
- Badges.
- Status pills.
- Empty states.
- Modals/drawers.
- Dashboard layout.
- Mobile navigation.

No UI implementation is included in this document.

## 25. MVP Revenue Core

A practical revenue-first MVP may include the following only after explicit phase approval.

### 25.1 Public

- Homepage.
- Category listing.
- Area/category pages.
- Provider cards.
- Provider profile.
- Doctor profile.
- Search/filter.
- WhatsApp CTA.
- Claim/list center CTA.
- Offers basic.

### 25.2 Admin

- Protected admin.
- Provider onboarding lead list/detail.
- Lead status update later.
- Claim review.
- Provider approve/reject.
- Manual verification.
- Offer review.
- Basic CMS text control later.

### 25.3 Provider

- Claim/list flow.
- Basic dashboard shell.
- Profile preview.
- Lead summary.
- Offer request.
- Ad request.
- Plan view.
- Billing view.

### 25.4 Sales

- Prospects.
- Pipeline.
- Follow-up.
- Notes.
- Converted status.
- Marketer attribution.

### 25.5 Monetization

- Manual plans.
- Manual invoice.
- Manual payment approval.
- Verified badge.
- Offer add-on.
- Sponsored placement request.
- WhatsApp click tracking.
- Provider performance snapshot.

## 26. Explicitly Not Implemented Yet

This architecture document does not implement or approve:

- No payment gateway.
- No checkout.
- No AI chat.
- No AI medical advice.
- No appointment booking full flow.
- No insurance integration.
- No wallet.
- No automated commission payout.
- No self-service paid checkout.
- No mass programmatic SEO.
- No Persian/Hindi public routes.
- No medical records.
- No diagnoses.
- No prescriptions.
- No lab results.
- No private health records.

## 27. Future PR Sequencing

Recommended future documentation/spec PRs:

- Roles and Permissions Spec.
- Provider Entity Model Spec.
- Plan and Entitlement Matrix Spec.
- Admin / Super Admin Operations Spec.
- Sales / Marketer CRM Spec.
- Ads and Offers Platform Spec.
- CMS and AI Content Workflow Spec.
- Analytics and Events Spec.
- Billing and Manual Payments Spec.
- Legal and Compliance Spec.

Future implementation phases may proceed only after explicit approval, with narrow allowed files, validation commands, RLS/security review, and stop conditions defined for each phase.

## 28. Universal Feature Gate Checklist

Every future feature must answer:

1. Which user or role is this for?
2. Which panel/surface does it belong to?
3. Is it public or private?
4. What permission is required?
5. What ownership scope applies?
6. Does it require plan entitlement?
7. Does it require admin approval?
8. Does it require audit logging?
9. Does it touch billing, ads, offers, leads, or analytics?
10. Does it affect SEO/indexing?
11. Does it expose private or sensitive data?
12. Does it require RLS/security changes?
13. Does it need medical/legal review?
14. What validation commands must pass?

## 29. Open Decisions

Open decisions:

- Whether to include fixed plan prices now or keep only feature matrix.
- Whether pet clinics are a launch category from day one.
- Whether appointment booking remains future-only while WhatsApp CTA is MVP.
- Whether reviews are delayed until provider verification is mature.
- Whether insurance filters are future-only but schema-ready.
- Whether AI article engine starts only after CMS workflow exists.
- Whether provider dashboard should come before or after admin operations.
- Whether sales CRM should be admin-only first or a separate marketer panel.

Recommended defaults:

- No fixed pricing yet.
- Pet clinics included from day one.
- Appointment booking future-only.
- Reviews after verification maturity.
- Insurance filters future-only but schema-ready.
- AI articles after CMS workflow.
- Admin operations before full provider dashboard.
- Sales CRM admin-only first, marketer panel later.
