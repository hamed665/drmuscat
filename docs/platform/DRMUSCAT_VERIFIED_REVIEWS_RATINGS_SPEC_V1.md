# DrMuscat Verified Reviews & Ratings Spec V1

## Status and Authority

- Status: Documentation-only.
- Authority: Verified reviews, ratings, moderation, provider replies, disputes, anti-fraud, and schema eligibility planning only.
- This document does not authorize implementation.
- This document does not authorize review database creation.
- This document does not authorize rating database creation.
- This document does not authorize review submission UI.
- This document does not authorize provider reply UI.
- This document does not authorize moderation UI.
- This document does not authorize Review schema.
- This document does not authorize AggregateRating schema.
- This document does not authorize public review pages.
- This document does not authorize analytics/tracking.
- This document must be read together with:
  - `docs/platform/DRMUSCAT_PROVIDER_STORIES_COMMENTS_SPEC_V1.md`
  - `docs/platform/DRMUSCAT_LEGAL_TRUST_AI_EDITORIAL_POLICY_SPEC_V1.md`
  - `docs/platform/DRMUSCAT_PUBLIC_ROUTE_SEO_INVENTORY_SPEC_V1.md`
  - `docs/platform/DRMUSCAT_CMS_CONTENT_MODEL_SPEC_V1.md`
  - `docs/platform/DRMUSCAT_SEO_REPORTING_ANALYTICS_SPEC_V1.md`
- Future implementation requires separate `PHASED_BUILD_ONLY` approval.
- Final legal policy for reviews/ratings must be reviewed before launch.

## Four-Axis Mapping

- Execution Phase: Phase 0 — Spec Freeze and Schema Patch / documentation alignment only.
- Lock Scope: Phase 0 — Repository Readiness.
- Product Module: Phase 0 — Setup Only / documentation alignment.
- Subphase ID: `ALIGN-VERIFIED-REVIEWS-RATINGS-V1`.

## 1. Purpose

This specification defines the future verified reviews and ratings system for DrMuscat before any review/rating runtime behavior, database schema, moderation workflow, provider reply system, public display, or structured data implementation is approved.

The future system must protect:

- users and patients
- providers and doctors
- public trust
- local SEO integrity
- platform credibility
- review authenticity
- privacy
- legal safety
- medical safety
- provider dispute rights
- schema correctness

Reviews and ratings are future-only. No review/rating runtime behavior is implemented by this document. No Review schema or AggregateRating schema is authorized by this document.

## 2. Review System Principles

- Reviews must be real.
- Reviews must not be seeded.
- Reviews must not be fake.
- Providers cannot review themselves.
- Staff cannot review their own provider organization.
- Competitors cannot manipulate reviews.
- Users must be logged in before submitting reviews.
- Anonymous public review submission is not allowed in initial phases.
- Moderation is required before public display in initial phases.
- Reviews must not contain private patient data.
- Reviews must not request diagnosis, prescription, or emergency help.
- Reviews must not contain defamatory or abusive content.
- Ratings must not be displayed as AggregateRating until enough real approved reviews exist.
- Provider replies must be moderated or governed by clear policy.
- A dispute/removal process must exist before public launch.

## 3. Review Types

The following review-related content types are future planning categories only. They do not create tables, routes, UI, APIs, moderation queues, schema, or runtime behavior.

| Type | Purpose | Public/private nature | Verification requirement | Moderation requirement | Schema eligibility | Risk level | Blocked conditions |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `provider_review` | Future review of a provider organization, clinic, hospital, lab, pharmacy, beauty, wellness, dental, or pet clinic entity. | Public only if approved and display is separately implemented. | Logged-in user minimum; stronger verification may be required later. | Required before public display. | Blocked by default until Review/AggregateRating eligibility is approved. | High. | Fake, seeded, self-review, staff review, competitor manipulation, private data, abusive, defamatory, or unsafe medical content. |
| `doctor_review` | Future review of an individual doctor or practitioner profile. | Public only if approved and display is separately implemented. | Logged-in user minimum; verified visit evidence may be required later. | Required before public display. | Blocked by default until schema eligibility is approved. | High. | Medical outcome claims, private treatment details, fake review, conflict of interest, or policy-violating content. |
| `service_review` | Future review of a listed service experience. | Public only if approved and display is separately implemented. | Logged-in user minimum; service/booking evidence may be required later. | Required before public display. | Blocked by default; may be eligible only after service review policy and visible content rules are approved. | Medium to high. | Unsupported medical claims, wrong service, spam, duplicate content, or privacy/legal risk. |
| `offer_review` | Future review of an approved offer experience where offers exist. | Public only if approved and offer review display is separately implemented. | Logged-in user minimum; offer redemption evidence may be required later. | Required before public display. | Blocked by default and requires separate schema review. | Medium to high. | Paid/incentivized manipulation, misleading price claims, fake redemption, or irrelevant promotion. |
| `verified_visit_review` | Future review explicitly tied to approved evidence of a visit, booking, lead, receipt, or appointment. | Public only if approved; verification evidence remains private. | Requires an approved verification rule and supporting evidence. | Required before public display. | Possible only after system maturity, threshold, and schema approval. | High. | No supporting evidence, exposed patient data, disputed evidence, fake documentation, or policy violations. |
| `invited_review` | Future review submitted after a provider or platform invitation. | Public only if approved and invite policy is approved. | Invitation source must be tracked and controlled by future policy. | Required before public display. | Blocked by default until manipulation controls and schema policy are approved. | High. | Review gating, selective invitations, incentives without policy, provider pressure, or suspicious invitation bursts. |
| `admin_imported_legacy_review_blocked` | Legacy or externally imported review content considered for future migration/import planning. | Private/blocked by default. | Requires a future verified import policy; no default verification. | Required if ever considered, but import is blocked by default. | Not eligible by default. | Very high. | Any unverified, seeded, scraped, fake, unclear-consent, private, or unsupported legacy source. |
| `internal_feedback` | Private operational feedback for platform/provider quality improvement. | Private only; not public review content. | Future policy-defined evidence may apply. | Internal review may apply, but it is not public moderation. | Not eligible for Review or AggregateRating schema. | Medium. | Attempting to display as public review, include in ratings, or use in schema. |
| `reported_review` | A previously approved/displayed review that a user, provider, or admin reports for policy review. | Visibility depends on future temporary visibility policy. | Original verification state remains subject to review. | Required escalation/moderation. | Schema eligibility may be suspended depending on future policy. | High. | Legal/privacy/medical safety risk, abuse, fraud, wrong provider, or unresolved dispute. |
| `provider_reply` | Future provider response to an approved review. | Public only if provider reply display and governance are approved. | Requires claimed/verified provider access. | May require moderation before display. | Not rating content; schema eligibility requires future review. | High. | Revealing patient identity, treatment details, diagnosis, prescription, attacks, guarantees, or private data. |

Legacy/imported reviews are blocked by default unless a future verified import policy is approved. Internal feedback is not public review content and must not be used as public rating or schema evidence.

## 4. Rating Dimensions

Possible future rating dimensions include:

- `overall_rating`
- `cleanliness`
- `communication`
- `waiting_time`
- `staff_behavior`
- `value_transparency`
- `booking_experience`
- `service_quality`
- `location_accessibility`
- `provider_response_quality`

Rules:

- Rating dimensions must be approved before implementation.
- Medical outcome ratings should be avoided or strictly reviewed.
- No rating should imply guaranteed medical quality.
- Rating categories that encourage unsafe medical claims must be avoided.
- Ratings must be explainable to users.
- Star rating labels must be localized in English and Arabic if public.

## 5. Review Status Lifecycle

Future statuses:

- `draft`
- `submitted`
- `pending_moderation`
- `needs_revision`
- `approved`
- `rejected`
- `hidden`
- `reported`
- `under_dispute`
- `provider_replied`
- `admin_removed`
- `blocked`
- `archived`

Conceptual transitions:

- `draft` → `submitted`
- `submitted` → `pending_moderation`
- `pending_moderation` → `approved`
- `pending_moderation` → `needs_revision`
- `pending_moderation` → `rejected`
- `pending_moderation` → `blocked`
- `approved` → `reported`
- `reported` → `under_dispute`
- `approved` → `provider_replied`
- `approved` → `hidden`
- `approved` → `admin_removed`
- `under_dispute` → `approved` / `hidden` / `admin_removed` / `blocked`
- any public status → `hidden` or `admin_removed` for legal/privacy/safety reasons

Rules:

- Every moderation decision must be auditable in future implementation.
- Rejected/blocked content must not be public.
- Hidden/admin_removed content must not be used for public rating averages unless future policy explicitly allows otherwise.
- Reported/disputed reviews may need temporary visibility rules.

## 6. Verification Model

Future verification signals may include:

- logged-in user
- verified phone/email
- verified visit later
- appointment/lead evidence later
- provider-invited review later
- receipt or booking confirmation later
- manual admin verification later
- anti-spam checks later

Rules:

- A review may be displayed only after moderation approval.
- A review may be labeled “verified” only after an approved verification rule exists.
- Provider-invited reviews must be labeled or controlled to avoid manipulation.
- Reviews must not be purchased.
- Incentivized reviews require explicit policy and may be blocked.
- No review may imply a verified visit unless evidence exists.
- Verification data must protect privacy and avoid exposing patient records.

## 7. Moderation Rules

Blocked review content:

- spam
- abusive language
- threats
- hate/harassment
- doxxing
- private patient data
- personal health information
- diagnosis requests
- prescription requests
- emergency medical requests
- lab result interpretation requests
- detailed private treatment records
- defamatory accusations without policy
- fake reviews
- competitor manipulation
- provider self-review
- staff review of own provider
- paid undisclosed review
- irrelevant promotion
- sexual/graphic content
- illegal content
- duplicate review spam
- unsupported medical outcome claims
- misleading before/after claims

Moderation actions:

- approve
- reject
- hide
- request revision
- redact future-only after policy
- escalate to admin
- escalate to legal/privacy reviewer
- escalate to medical reviewer
- flag as suspected fraud
- open provider dispute
- lock review thread
- remove from rating calculation where policy allows

No moderation implementation is included in this PR.

## 8. Provider Reply Policy

Future provider replies:

- provider replies require claimed/verified provider access
- replies must be professional
- replies must not reveal patient identity
- replies must not reveal treatment details
- replies must not diagnose
- replies must not prescribe
- replies must not attack the reviewer
- replies must not offer misleading guarantees
- replies may invite the reviewer to contact the provider privately
- replies may correct factual inaccuracies politely
- replies may require moderation before display
- replies should be auditable

Provider replies must not affect rating averages.

## 9. Dispute and Removal Policy

Future dispute reasons:

- fake review
- wrong provider
- conflict of interest
- private patient data
- defamatory claim
- abusive content
- duplicate review
- spam/manipulation
- review violates medical/privacy/legal policy
- provider says reviewer was never a patient/customer
- review includes false factual claim

Possible dispute outcomes:

- keep approved
- hide temporarily
- request reviewer clarification
- request provider evidence
- redact future-only after policy
- remove/admin_removed
- block user/provider abuse pattern
- escalate legal/privacy
- escalate medical safety

Rules:

- Provider dispute does not automatically remove a review.
- Reviewer rights and provider rights must be balanced.
- Final decision must be auditable.
- Dispute workflow must be approved before public launch.

## 10. Rating Calculation Policy

Future rules:

- rating average uses only approved eligible reviews
- rejected/blocked/admin_removed reviews are excluded
- hidden/disputed reviews are handled by approved policy
- rating count must reflect eligible reviews only
- minimum review count threshold is required before public aggregate display
- minimum review count threshold is required before AggregateRating schema
- rating averages must not be manually edited
- provider cannot pay to change ratings
- sponsored/verified status cannot alter rating calculation
- rating recency weighting requires separate approval
- category-specific ratings require separate approval

Suggested planning thresholds:

- Public average display: not before enough approved reviews exist.
- AggregateRating schema: only after review system maturity, anti-fraud policy, moderation workflow, dispute workflow, and minimum review count threshold are approved.

This specification does not hard-code thresholds. Thresholds require future approval.

## 11. Schema Eligibility Rules

Review schema and AggregateRating schema remain blocked by default.

Review/AggregateRating schema may be considered only after:

- real approved reviews exist
- review submission policy exists
- moderation workflow exists
- anti-fake review policy exists
- provider reply policy exists
- dispute/removal policy exists
- rating calculation policy exists
- minimum review threshold approved
- schema review approved
- visible review/rating content matches schema
- no fake/seeded/imported reviews are included
- no private patient data is exposed
- no review gating/manipulation exists

Rules:

- No fake reviews.
- No fake ratings.
- No schema for hidden/unapproved content.
- No AggregateRating for empty/thin profiles.
- No AggregateRating for seeded/imported/unverified legacy data.
- No schema implementation in this PR.

## 12. UGC SEO Rules

- Review content must not create standalone thin pages.
- Reviews are not sitemap entries.
- Review pages/routes require separate approval.
- Reviews must not change indexability automatically.
- Reviews must not inject uncontrolled schema.
- Reviews must not add unreviewed medical claims to indexable content.
- Reviews with sensitive content must be moderated or hidden.
- Provider profile indexability should not depend solely on reviews.
- Review snippets must be safe and moderated before display.

## 13. Privacy and Data Handling

- Reviews must not expose private patient data.
- Verification data must be private.
- Phone/email verification data is not public.
- Appointment/lead evidence is not public.
- Review submitter identity display policy must be approved.
- Deletion/removal requests must be supported in future policy.
- Audit logs must avoid leaking PHI.
- Review analytics must avoid sensitive medical text.
- Provider dashboards must not expose private user data beyond approved review display.
- Users must have a way to report privacy issues.

## 14. Anti-Fraud and Abuse Planning

Future fraud signals may include:

- duplicate review patterns
- same user reviewing many providers unusually
- same provider receiving bursts of suspicious reviews
- IP/device signals later if privacy-approved
- provider staff review patterns
- competitor review patterns
- repeated text patterns
- incentivized review patterns
- review bombing
- suspicious provider-invited review bursts

Rules:

- Fraud signals are not automatic guilt.
- Human review is required.
- Privacy policy is required before collecting device/IP abuse signals.
- Anti-fraud decisions must be auditable.
- Provider/user sanctions require future policy.

## 15. Access Control Planning

Future roles:

- anonymous user: read approved public reviews only when review display exists
- logged-in user: submit review/report review where enabled
- reviewer/user: edit/delete own review under approved policy
- provider_owner: view and reply to own provider reviews only
- provider_staff: limited reply/request review access only if approved
- content_manager: moderate reviews
- medical_reviewer: review medical-sensitive escalations
- legal/privacy reviewer: review legal/privacy escalations
- admin: manage moderation/disputes
- super_admin: override with audit

Rules:

- server-side enforcement required
- no client-only permission checks
- no cross-provider access
- no anonymous review submission
- every moderation/dispute action auditable

## 16. Notification Planning

Future notifications may include:

- review submitted
- review approved/rejected
- review needs revision
- review reported
- dispute opened
- dispute resolved
- provider reply submitted
- provider reply approved/rejected
- privacy/legal escalation
- medical escalation

Rules:

- no notification implementation
- no email/SMS/WhatsApp integration
- notification content must not expose PHI/private data
- recipient scope must be role-based

## 17. Analytics and Reporting Planning

Future review reporting may include:

- approved review count
- average rating where eligible
- pending moderation count
- reported/disputed review count
- provider reply rate
- review response time
- suspected fraud count
- category/provider review coverage
- Arabic/English review distribution if multilingual reviews exist
- reviews blocked for privacy/medical risk

Rules:

- analytics are planning-only
- no tracking implementation
- no provider dashboard implementation
- no private user data exposure

## 18. AI Use in Reviews

AI may assist future review operations only after policy approval.

Allowed:

- spam/fraud signal suggestions
- moderation triage suggestions
- toxicity flag suggestions
- privacy/PHI flag suggestions
- provider reply drafting assistance from approved facts
- summary for internal moderator review

Blocked:

- AI final moderation decisions
- AI deleting reviews automatically
- AI changing ratings
- AI writing fake reviews
- AI rewriting user reviews
- AI generating provider testimonials
- AI generating public review summaries without approval
- AI exposing private user/provider data
- AI making medical/legal judgments as final authority

## 19. Explicit Non-Implementation

- no review tables
- no rating tables
- no moderation tables
- no dispute tables
- no provider reply tables
- no review UI
- no rating UI
- no moderation UI
- no provider reply UI
- no review routes
- no review forms
- no review widgets
- no Review schema
- no AggregateRating schema
- no analytics/tracking
- no notification integration
- no AI moderation
- no RLS/API/server action changes
- no source code changes
- no migrations
- no seed data
- no public Persian/Hindi routes

## 20. Future PR Sequence

Recommended future PR sequence only:

1. Review Policy Page Route Inventory Spec
2. Review Data Model Spec
3. Review Moderation Workflow Spec
4. Review RLS and Access Control Spec
5. Review UI Wireflow Spec
6. Review Database Foundation
7. Review Moderation Admin UI
8. Provider Reply UI
9. AggregateRating Schema Implementation only after review maturity approval

These recommendations are planning guidance only and do not authorize implementation.

## 21. Completion Report Requirements

Final Codex report must include:

- Files created/changed
- Confirmation documentation-only
- Confirmation no source code changed
- Confirmation no routes changed
- Confirmation no migrations/RLS/API/server actions changed
- Confirmation no review/rating/moderation/provider-reply/schema/runtime behavior was implemented
- Summary of review/rating model
- Summary of moderation/dispute/anti-fraud rules
- Summary of schema eligibility rules
- Validation results
- Any blockers/conflicts

Validation:

- Run `git status --short`
- Run `pnpm lint` only if repository conventions require it or README/docs linting is expected
- Run `git diff --check -- docs/platform/DRMUSCAT_VERIFIED_REVIEWS_RATINGS_SPEC_V1.md`
- Do not fake validation
- If validation cannot run, report why
