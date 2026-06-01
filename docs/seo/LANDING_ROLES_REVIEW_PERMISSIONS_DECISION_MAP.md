# SEO-D3H4-A — Landing Roles/Review Permissions Decision Map

## 1. Status and Authority

This document is documentation-only for SEO-D3H4-A. It records a conservative future decision map for landing content roles, review permissions, and publish authority before any landing content migration, RLS implementation, data-bearing public landing query helper, route integration, visible noindex page, indexable page, crawler behavior, metadata, sitemap, schema, robots, `llms.txt`, CMS UI, API handler, seed row, public UI, or public landing content work.

This document does not authorize SQL, migrations, RLS policies, generated database type changes, Supabase client/type changes, Supabase usage, service-role usage, database queries, data-bearing query helpers, helper changes, route integration, route-check changes, tests, metadata, `generateMetadata`, `generateStaticParams`, canonical tags, hreflang tags, Open Graph output, sitemap changes, schema output, robots changes, `llms.txt` changes, visible noindex pages, indexable pages, content generation, keyword seed runtime usage, CMS records, API handlers, seed rows, crawler behavior, analytics/background jobs, public UI, provider listings, center listings, landing content, medical content, service descriptions, local area descriptions, payment logic, monetization logic, sponsored placement, ranking, referral, commission, entitlement, or plan logic.

Future implementation requires a separate approved `PHASED_BUILD_ONLY` task with explicit four-axis mapping, allowed files, forbidden files, database/RLS impact, route impact, SEO/crawler impact, validation commands, and human approval. If this document conflicts with `AGENTS.md`, project-state files, V10.4 master-spec files, V10.5 addendums, existing SEO decision documents, route-check guardrails, existing helper contracts, existing RLS/security guardrails, or stricter SEO/security instructions, the stricter guardrail wins.

## 2. Four-Axis Mapping

- Execution Phase: Phase 3 — Public SEO Platform
- Lock Scope: Phase 4 — Public SEO Pages / landing roles and review permissions documentation-only decision map
- Product Module: Phase 9 — SEO/CMS and Programmatic Pages
- Subphase ID: SEO-D3H4-A

## 3. Relationship to Prior Phases

### SEO-D3H4 Plan

SEO-D3H4 was a PLAN ONLY task. It concluded that landing role, editorial review, medical review, and publish authority semantics must be documented before any landing content migration, RLS implementation, data-bearing helper, route integration, crawler behavior, public UI, or public content work.

SEO-D3H4-A implements only that documentation artifact. It does not implement any schema, RLS, runtime helper, route, crawler, UI, or content behavior.

### SEO-D3H3E Query Helper Readiness Recheck

SEO-D3H3E concluded that no data-bearing public landing query helper should be implemented now. The service helper may be closest to readiness because it avoids area local relevance and specialty relationship ambiguity, but it remains blocked by missing `landing_page_contents`, missing landing content RLS, missing public-safe projection, missing review workflow, missing landing role semantics, missing approved intro source, missing data-bearing helper tests, and unresolved service slug canonical proof.

SEO-D3H4-A addresses only the role/review/publish authority blocker and does not unblock helper implementation by itself.

### SEO-D3H3D-A Local Relevance Source Decision Map

SEO-D3H3D-A documented that local relevance must be approved, reviewed, public-safe, tied to canonical landing identity, tied to resolved canonical area identity for area-bearing families, specific to the requested family/entity/area context, and not inferred from counts, slugs, names, provider density, center density, keyword data, route existence, or generated copy.

Landing editorial and medical roles must not approve local relevance by implication. Local relevance requires its own approved source model and review semantics in a future phase.

### SEO-D3H3C-A Landing Content RLS Decision Map

SEO-D3H3C-A documented that current broad helpers include `public.current_profile_id()`, `public.is_platform_admin()`, `public.is_provider_user()`, and `public.is_patient_user()`, and that center access helpers are center-scoped rather than global landing content roles. It also documented that no explicit landing editor, editorial reviewer, medical reviewer, publisher, SEO admin, or super admin role semantics are established for landing content.

SEO-D3H4-A narrows that blocker into a role and permission decision map. It does not create policies or helper functions.

### SEO-D3H3B-A Landing Content Migration Decision Map

SEO-D3H3B-A documented that no dedicated landing content table exists, no landing content migration is authorized, public helpers cannot expose content payloads, area canonicalization remains blocked, local relevance remains unresolved, and RLS planning must be handled before public SELECT or public helper reliance on landing content.

SEO-D3H4-A does not create `landing_page_contents`; it only records role/review/publish expectations that a future migration plan may reference.

### SEO-D3H3A Landing Content Review Model Decision Map

SEO-D3H3A documented that no landing-specific editorial or medical review model exists, existing taxonomy/provider/review/media/geo tables are not suitable landing content sources, and future public visibility should require published status, non-deleted state, canonical identity, related active entities, editorial approval, medical approval or explicit `not_required`, and no private/internal field exposure.

SEO-D3H4-A defines who may conceptually create, review, classify, approve, publish, archive, and delete such future content.

### SEO-D3H2 Area Canonicalization

SEO-D3H2 documented that `areaSlug` alone is not sufficient canonical area identity because `geo_areas.slug` uniqueness is scoped by `city_id`. Area-bearing content must remain fail-closed until city-context routing, an approved canonical area key, or another approved canonical area identity model exists.

Landing roles cannot override unresolved area canonicalization. Editorial, medical, or publish approval must not turn ambiguous area identity into canonical identity.

### SEO-D3H1 Blocker Resolution

SEO-D3H1 concluded that further route integration and data-bearing public landing query helper work should not proceed until blockers are resolved. SEO-D3H4-A resolves no runtime blocker by itself; it records one conservative governance artifact for future planning.

### SEO-D3F2 / SEO-D3E2 Fail-Closed Routes

SEO-D3E2 integrated the service scaffold route only in a fail-closed manner. SEO-D3F2 integrated the service-area scaffold route only in a fail-closed manner. Both validate locale/country, call fail-closed skeleton helpers, pass input into the decision helper, and still end in `notFound()`.

SEO-D3H4-A does not authorize changing either route. Fail-closed route behavior remains unchanged.

### SEO-D3D2B Skeleton Helper

SEO-D3D2B introduced skeleton landing gate helpers for specialty, specialty-area, area, service, and service-area families. All helpers return fail-closed output with no source tables, no content payload, no Supabase usage, and no database queries.

SEO-D3H4-A does not authorize a data-bearing helper or any helper modification.

### Decision Helper

The landing decision helper remains a pure evaluator over supplied gate inputs. It does not fetch data, render pages, publish content, or create crawler signals. Its output remains unsafe for visible noindex and unsafe for indexing.

SEO-D3H4-A does not authorize changing the decision helper.

### Route-Check Guardrails

`scripts/routes-check.mjs` guards the current fail-closed posture by checking selected route integrations, skeleton helper behavior, forbidden runtime/crawler/content tokens, and absence of forbidden route families. SEO-D3H4-A does not authorize route-check changes.

## 4. Current Role/Permission Inventory

### Profiles and Broad Profile Role Fields

Current `public.profiles` includes profile identity/contact/localization fields and three broad boolean role fields:

- `is_platform_admin boolean not null default false`;
- `is_provider_user boolean not null default false`;
- `is_patient_user boolean not null default true`.

Generated database types reflect these same fields and do not include landing-specific role fields.

Implication: existing profile booleans are broad user category flags. They are not landing editor, editorial reviewer, medical reviewer, publisher, landing content admin, SEO admin, or medical/legal approver roles.

### `is_platform_admin`

`public.is_platform_admin()` returns true when the authenticated user has a non-deleted profile with `is_platform_admin = true`.

Implication: platform admin is a global operational admin signal, but it does not automatically prove medical reviewer authority, editorial quality authority, landing publisher authority, or legal/product approval authority.

### `is_provider_user`

`public.is_provider_user()` returns true when the authenticated user has a non-deleted profile with `is_provider_user = true`.

Implication: provider user is not a global landing content authority. Provider users may have commercial or profile-management interests and must not be treated as neutral editorial, medical, or publish approvers for public SEO landing pages.

### `is_patient_user`

`public.is_patient_user()` returns true when the authenticated user has a non-deleted profile with `is_patient_user = true`.

Implication: patient user has no landing content creation, review, or publish authority.

### `center_member_role`

Current `center_member_role` enum values are:

- `owner`;
- `admin`;
- `manager`;
- `editor`;
- `staff`;
- `billing`;
- `sales`.

Implication: these roles are center-scoped. Even the `editor` value is an editor for a center context, not a global SEO landing editor.

### `center_memberships`

`public.center_memberships` links a profile to a specific center with a center-scoped role, status, invitation/approval actors, lifecycle timestamps, metadata, and `deleted_at`.

Implication: center membership roles prove access to a center context only. They must not be reused for global landing content without explicit future approval.

### Center-Scoped Helper Functions

Current center-scoped helper functions include:

- `public.is_active_center_member(target_center_id)`;
- `public.can_manage_center(target_center_id)`;
- `public.can_view_center_private_data(target_center_id)`.

These helpers rely on platform admin or active center memberships for a target center. They are not global landing content permission helpers.

Implication: future landing content RLS must not use center-scoped helper functions as a shortcut for global page publishing, editorial approval, or medical approval.

### Public/Private RLS Helper Patterns

Current patterns include:

- public SELECT uses explicit public predicates such as active/non-deleted status, approved review status, explicit visibility flags, and related active parent records;
- private SELECT is usually `TO authenticated` and helper-gated;
- soft-deleted rows are generally excluded;
- service-role bypass is not acceptable for public helper logic;
- current RLS is row-level, not column-level.

Implication: future landing content needs separate write/review/publish policies, separate public SELECT policies, and preferably a public-safe projection/view so public helpers do not read raw rows containing content payloads, reviewer fields, notes, metadata, or audit actors.

### Review/Moderation Examples

#### Reviews

Current `reviews` use `review_status` values such as `pending`, `approved`, `rejected`, `hidden`, and `flagged`, with approval/rejection timestamps.

Implication: review status exists for patient/provider reviews, but it is not editorial review or medical review for landing content.

#### Review Reports

Current `review_reports` include report reason/status, reviewer profile reference, reviewed timestamp, resolved timestamp, note, metadata, and soft delete.

Implication: review reports demonstrate moderation and reviewer actor patterns, but they are not a landing content workflow.

#### Media Assets

Current `media_assets` include `media_asset_status` values such as `draft`, `pending_review`, `approved`, `rejected`, `hidden`, and `archived`, plus `created_by_profile_id` and metadata.

Implication: media asset status is useful as a status convention but does not approve landing text, local relevance, or medical claims.

#### Entity Media

Current `entity_media` has explicit public visibility and review fields: `public_media_visible`, `media_review_status`, and `media_reviewed_at`. Public visibility requires approved media review.

Implication: entity media demonstrates a strict visibility-plus-review gate, but media approval is not landing content approval.

#### Contact Visibility

Contact visibility fields use safe false defaults for public contact exposure and `contact_review_status` / `contact_reviewed_at` on centers and center locations.

Implication: contact visibility demonstrates conservative public exposure defaults, but contact review is not landing editorial or medical review.

#### Provider License Visibility

Provider license records use explicit `public_license_visible`, `license_review_status`, `license_reviewed_at`, public visibility constraints, and public SELECT policies requiring approved review and non-empty public license fields.

Implication: license visibility demonstrates a strict public exposure pattern, but license review is not landing content editorial or medical approval.

### Audit Actor/Action Fields

Current audit logs include:

- `actor_type`;
- `actor_profile_id`;
- `action_type`;
- `entity_type`;
- `entity_id`;
- request/user-agent context;
- `before_data`;
- `after_data`;
- metadata;
- timestamps.

Current audit actor values include `system`, `admin`, `provider_user`, `patient_user`, and `anonymous`. Current audit action values include `create`, `update`, `delete`, `approve`, `reject`, `publish`, and `unpublish`.

Implication: audit infrastructure can inform future landing transition audit design, but no landing-specific transition audit or role model exists today.

### Existing Admin/Content Roles

Current schema evidence shows platform admin and center/provider/patient-related roles, but no explicit landing editor, editorial reviewer, medical reviewer, publisher, landing content admin, SEO admin, CMS editor, or content governance role.

## 5. Current Blocker Posture

Current blocker posture remains fail-closed:

- no landing content role model exists;
- no landing editor role exists;
- no editorial reviewer role exists;
- no medical reviewer role exists;
- no publisher role exists;
- no landing content workflow exists;
- no `landing_page_contents` table exists;
- no landing content public-safe projection exists;
- no landing content RLS exists;
- no SQL/migration/RLS/helper implementation is authorized by this document;
- provider/center roles must not be reused for global landing content;
- platform admin must not be inferred as medical reviewer without explicit human product/legal/medical approval;
- route/crawler/helper behavior remains blocked and fail-closed.

## 6. Required Landing Workflow Actions

| Action | Conceptual allowed actor | Current schema supports it? | Authority scope | Medical/legal approval dependency | Audit requirement | Fail-closed default |
| --- | --- | --- | --- | --- | --- | --- |
| Create draft | `landing_editor` or `landing_content_admin`; platform admin only if explicitly human-approved as temporary model | No | Global landing role | Usually no medical approval at creation; product policy required | `created_by_profile_id`, `created_at`, initial status transition | Block draft creation |
| Update draft | Draft creator with landing edit permission, `landing_editor`, or `landing_content_admin` | No | Global; optionally ownership-aware | No medical approval unless changing reviewed/classified content; editorial policy required | `updated_by_profile_id`, `updated_at`, before/after transition audit | Block draft updates |
| Submit for editorial review | `landing_editor` or `landing_content_admin` | No | Global | No medical approval yet; content classification readiness required | submitter actor, submitted timestamp, status transition | Block submission |
| Approve editorial review | `landing_editorial_reviewer`; platform admin only if human-approved | No | Global | Product/editorial policy; not a substitute for medical approval | `editorial_reviewed_by_profile_id`, `editorial_reviewed_at`, transition audit | Treat editorial review as missing |
| Reject editorial review | `landing_editorial_reviewer` or `landing_content_admin` with reason | No | Global | Product/editorial policy | rejection actor, timestamp, editorial rejection reason, transition audit | Keep non-public |
| Classify content as medical | `landing_editorial_reviewer`, `landing_medical_reviewer`, or approved policy actor; conservative default is medical when clinical/service/specialty claims exist | No | Global | Medical/legal/product policy required | classifier actor, timestamp, classification reason | Treat unclear content as medical/review required |
| Classify content as non-medical / `not_required` | `landing_medical_reviewer` or explicit medical/legal/product approver under documented rules | No | Global | Yes; must be explicit and auditable | actor, timestamp, `medical_not_required_reason`, external approval reference if applicable | Do not set `not_required`; treat as missing/required |
| Approve medical review | `landing_medical_reviewer` with approved authority/process | No | Global | Yes | `medical_reviewer_profile_id`, `medical_reviewed_at`, transition audit | Treat medical review as missing |
| Reject medical review | `landing_medical_reviewer` with reason | No | Global | Yes | actor, timestamp, medical rejection reason, transition audit | Keep non-public |
| Publish content | `landing_publisher` or `landing_content_admin` after all gates pass | No | Global | Yes when medical/local healthcare content exists | `published_by_profile_id`, `published_at`, transition audit, checkpoint reference | Block publication |
| Archive content | `landing_content_admin` or `landing_publisher` if policy allows | No | Global | Usually no, but legal/product policy may apply | actor, `archived_at`, reason, transition audit | Block archive mutation |
| Soft-delete content | `landing_content_admin`; platform admin only if temporary policy approved | No | Global | Usually no medical approval, but governance policy required | actor, `deleted_at`, reason, transition audit | Block deletion |
| Restore content if allowed | `landing_content_admin`; must re-check review/canonical/public gates | No | Global | Yes for medical/outdated content or stale approval | actor, timestamp, restore reason, re-review checkpoint | Block restore; require re-review |
| View drafts | `landing_editor`, assigned reviewers, `landing_content_admin`; platform admin if approved | No | Global private access | No medical approval, but private access policy required | access should be helper/RLS-gated; audit if sensitive | Deny draft visibility |
| View review queues | Editorial reviewers see editorial queue; medical reviewers see medical queue; content admins see both | No | Global private access | Medical queue access requires medical governance | access helper/RLS-gated; audit if required | Deny queue visibility |
| View reviewer/internal fields | Appropriate reviewer/admin roles only; never public helper output | No | Global private access | Yes for medical notes and legal/product approval notes | access and mutation audit; field-level projection discipline | Deny internal field exposure |

## 7. Candidate Role Models

### Option A: Platform-Admin-Only First Version

Description: only users passing `public.is_platform_admin()` may create, update, review, classify, publish, archive, and delete landing content.

Pros:

- Lowest schema complexity if explicitly human-approved.
- Reuses existing global platform admin helper.
- May support a tightly bounded temporary workflow while explicit landing roles are deferred.

Cons:

- Platform admin is not automatically a medical reviewer.
- Platform admin is not automatically an editorial reviewer.
- Platform admin is not automatically a publisher with legal/product authority.
- Blurs operational access with clinical/legal review authority.
- Weak separation of duties.
- Risky if external medical/legal approval is not required and audited.

Schema impact:

- Could avoid a dedicated role table temporarily, but future content still needs actor fields, status fields, and transition audit.

RLS impact:

- Would rely on `public.is_platform_admin()` for private mutation/read policies if later approved.
- Public SELECT must remain separate and must still require published/reviewed/canonical states.

Audit impact:

- Must record the admin actor for every transition.
- Must record external/human approval references when the admin is entering editorial or medical statuses on behalf of other approvers.

Medical/legal risk:

- Medium to high unless human product/legal/medical stakeholders explicitly approve this temporary simplification.

Implementation risk:

- Low technical risk; high governance risk.

Recommendation:

- Do not adopt by default. Accept only as a temporary model if explicitly approved by human product/legal/medical stakeholders.

### Option B: Explicit Global Landing Roles

Description: define explicit global roles such as:

- `landing_editor`;
- `landing_editorial_reviewer`;
- `landing_medical_reviewer`;
- `landing_publisher`;
- `landing_content_admin`.

Pros:

- Clear separation of duties.
- Best fit for global public SEO landing surfaces.
- Avoids misuse of provider/center-scoped roles.
- Supports auditable editorial/medical/publish gates.
- Supports future precise RLS helper functions and tests.
- Lowest long-term medical/legal ambiguity.

Cons:

- Requires additional schema/permissions design later.
- Requires role assignment workflow.
- Requires helper functions and RLS tests if implemented.
- Requires human policy decisions.

Schema impact:

- Likely requires one of: a landing-specific enum and assignment table, a generic global permission table, a profile permissions table, or carefully approved profile role fields.
- Existing profile booleans are not enough.

RLS impact:

- Future RLS can use explicit helper functions for edit/review/publish/admin actions.
- Public SELECT remains separate from write/review/publish policies.

Audit impact:

- Strong. Each role action can be captured with actor, timestamp, reason, transition, and approval reference.

Medical/legal risk:

- Lowest if medical reviewer authority and `not_required` classification are explicitly approved.

Implementation risk:

- Moderate, but safest and clearest.

Recommendation:

- Preferred long-term model. Document first; do not implement in SEO-D3H4-A.

### Option C: Reuse Existing Center/Provider-Scoped Roles

Description: allow provider users or center members such as center `owner`, `admin`, `manager`, or `editor` to create/review/publish landing content.

Pros:

- Reuses existing center membership schema.
- May seem convenient for center-owned pages or provider-submitted content.

Cons:

- Landing pages are global public SEO surfaces, not center profile pages.
- Center roles are scoped to specific centers and do not prove global editorial authority.
- Provider users may have conflicts of interest.
- Does not solve medical reviewer authority.
- Does not solve publisher authority.
- Does not solve canonical route-family content governance.

Schema impact:

- Low if reused, but incorrect for this domain.

RLS impact:

- Would require unsafe cross-domain reuse of center-scoped helpers such as `can_manage_center()`.

Audit impact:

- Weak for global landing governance because actor authority would be tied to one center, not to the global landing surface.

Medical/legal risk:

- High.

Implementation risk:

- High due to ambiguity, conflict of interest, and route-family mismatch.

Recommendation:

- Reject. Do not reuse provider/center-scoped roles for global landing content without an explicit future human-approved exception.

### Option D: External/Manual Human Approval Outside App, Platform Admin Enters Final Statuses

Description: editorial, medical, legal, or product approvals occur outside the application. A platform admin records final statuses and references the external approval evidence.

Pros:

- Can support governance before full in-app role workflow exists.
- Keeps medical decision outside platform admin if properly audited.
- Pragmatic for a very small first version if human-approved.

Cons:

- Requires strong external approval references.
- Requires strict distinction between approver and data-entry actor.
- Can become unsafe if approval evidence is optional or vague.
- Still requires schema fields for external approval reference, reasons, and transition audit.

Schema impact:

- Future content table would need fields for approval reference, reviewer identity/reference, timestamps, reasons, and status transitions.

RLS impact:

- Temporary mutation policy could be platform-admin-only if approved.
- Public SELECT still requires final approved/published/canonical states.

Audit impact:

- Must be strong: actor, timestamp, external approval checkpoint, reviewer/approver reference, and reasons.

Medical/legal risk:

- Medium if strictly audited; high if external approval evidence is not mandatory.

Implementation risk:

- Moderate.

Recommendation:

- Acceptable only as a human-approved temporary workflow. Do not implement now.

### Option E: No Publish Workflow Until Role Model Implemented

Description: keep all landing content create/review/publish behavior blocked until explicit roles and RLS are implemented.

Pros:

- Safest current state.
- Avoids accidental publication.
- Preserves fail-closed posture.
- Forces governance clarity before migration/RLS/helper work.

Cons:

- Slower path to data-bearing helper readiness.
- Requires additional planning/implementation phases.

Schema impact:

- None now.

RLS impact:

- None now.

Audit impact:

- None now.

Medical/legal risk:

- Lowest immediate risk.

Implementation risk:

- Lowest immediate risk.

Recommendation:

- Default current state until a later approved task implements explicit roles or a human-approved temporary platform-admin workflow.

## 8. Recommended Conservative Decision

Conservative decision:

- Do not reuse provider/center-scoped roles for global landing content.
- Do not infer medical reviewer authority from platform admin.
- Prefer explicit global landing roles as the long-term model:
  - `landing_editor`;
  - `landing_editorial_reviewer`;
  - `landing_medical_reviewer`;
  - `landing_publisher`;
  - `landing_content_admin`.
- A platform-admin-only temporary workflow may be allowed only if human product/legal/medical stakeholders explicitly approve it.
- Keep write, review, classify, publish, archive, delete, restore, and review-queue visibility blocked until role semantics are documented and separately implemented.
- No SQL, RLS, migration, generated type, helper, route, route-check, crawler, metadata, sitemap, schema, robots, `llms.txt`, UI, test, or public content implementation is authorized now.

## 9. Medical Reviewer Boundary

### Who May Approve Medical Content

Only an explicitly authorized `landing_medical_reviewer` or a future human-approved medical/legal/product authority may approve medical landing content.

### Why Platform Admin Is Not Enough by Default

Platform admin is an operational access role. It does not prove medical credentials, clinical review authority, legal approval authority, or product approval authority. Platform admin may enter medical status values only under a documented temporary workflow with explicit external/human approval evidence.

### When `medicalReviewStatus: not_required` May Be Set

`medicalReviewStatus: not_required` may be set only when all of the following are true:

- an explicit, auditable, future-approved classification marks the content non-medical;
- editorial review is approved;
- the content contains no symptoms, diagnosis, treatment, prevention, outcomes, risks, contraindications, procedures, medications, emergency guidance, care expectations, clinical suitability, medical service/specialty details, pricing/insurance claims, or other healthcare claims;
- the route family and taxonomy context do not imply clinical advice;
- a medical/legal/product approver or approved `landing_medical_reviewer` has authorized the classification.

### Required Audit Fields and Reasons

Future medical review should record:

- `medical_reviewer_profile_id` or approved external reviewer reference;
- `medical_reviewed_at`;
- medical review status;
- medical rejection reason when rejected;
- `medical_not_required_reason` when set to `not_required`;
- external/human approval checkpoint reference where applicable;
- status transition audit.

### Fail-Closed Behavior

Missing, pending, ambiguous, unavailable, rejected, stale, or unclassified medical review must not pass as approved or not-required. The default helper-facing state remains `medicalReviewStatus: 'missing'` or another non-passing value until trustworthy review state exists.

## 10. Editorial Reviewer Boundary

### Who May Approve Editorial Quality

Only an explicit `landing_editorial_reviewer` or `landing_content_admin` under a documented policy may approve editorial quality. Platform admin may do so only under an approved temporary workflow.

### Uniqueness and Content Safety Responsibilities

Editorial review must confirm:

- content is unique for the exact locale, country, family, and canonical entity/combination;
- content is not thin, duplicated, generated, keyword-stuffed, or unsupported;
- content does not use keyword seed JSON as runtime source;
- content does not repurpose provider descriptions, center descriptions, service descriptions, specialty descriptions, reviews, media captions, slugs, names, counts, or generated copy as landing content proof;
- content is localized appropriately;
- content avoids unsupported medical, local, commercial, ranking, pricing, insurance, availability, or outcome claims;
- public-safe projection/RLS boundaries are respected.

### Relation to `hasUniqueVisibleIntro`

A future helper may set `hasUniqueVisibleIntro: true` only when editorial review is approved, medical review is approved or explicitly not-required, content is published, canonical identity is resolved, source is public/RLS-safe, and no private/internal fields are exposed.

Editorial approval alone is necessary but not sufficient for `hasUniqueVisibleIntro: true`.

### Relation to Local Relevance Source

For area-bearing families, editorial review must not infer local relevance from area names, city names, slugs, counts, provider density, center density, keyword data, route existence, media, reviews, or generated copy. Local relevance requires a future approved, reviewed, public-safe source tied to canonical landing identity and resolved canonical area identity.

### Fail-Closed Behavior

Missing, pending, rejected, ambiguous, or stale editorial review means:

- no publication;
- no public SELECT;
- `hasUniqueVisibleIntro: false`;
- `hasLocalRelevance: false` for local families;
- no data-bearing helper passing output.

## 11. Publisher Boundary

### Who May Publish

Only an explicit `landing_publisher` or `landing_content_admin` should publish landing content. A platform admin may publish only under a documented temporary workflow with explicit human approval.

### Prerequisites for Publishing

Publishing requires all of the following:

- editorial review approved;
- medical review approved or explicitly `not_required`;
- canonical identity resolved;
- related country/service/specialty/city/area entities active and non-deleted as applicable;
- area-bearing identity resolved by city plus area or an approved canonical area key model;
- RLS/public-safe projection readiness;
- no private/internal/reviewer/admin fields exposed;
- no draft, pending, rejected, archived, deleted, or ambiguous state;
- exact locale/country/family/canonical entity uniqueness established.

### Publishing Does Not Authorize Indexing

Publishing content is not the same as indexing content. Publishing must not automatically authorize:

- route integration;
- visible noindex pages;
- indexable pages;
- metadata;
- canonical tags;
- hreflang tags;
- Open Graph output;
- sitemap entries;
- schema output;
- robots changes;
- `llms.txt` changes;
- crawler behavior.

All route/crawler/indexability work requires separate approved phases.

### Fail-Closed Behavior

If any publishing prerequisite is missing, ambiguous, stale, rejected, or unimplemented, publication must remain blocked and public helpers must remain fail-closed.

## 12. Audit Requirements

Future landing content workflow should include, at minimum:

- `created_by_profile_id`;
- `updated_by_profile_id`;
- `editorial_reviewed_by_profile_id`;
- `medical_reviewer_profile_id`;
- `published_by_profile_id`;
- `created_at`;
- `updated_at`;
- `editorial_reviewed_at`;
- `medical_reviewed_at`;
- `published_at`;
- `archived_at`;
- `deleted_at`;
- status transition audit;
- editorial rejection reason;
- medical rejection reason;
- `medical_not_required_reason`;
- external/human approval checkpoint reference;
- no silent status mutation.

Audit should distinguish the person who approved a decision from a platform admin who merely entered an externally approved status. Status changes should preserve before/after state, actor, timestamp, reason, and approval reference.

## 13. RLS Implications

- Public SELECT is separate from write/review/publish policies.
- Public SELECT should require published status, editorial approval, medical approval or explicit `not_required`, non-deleted state, canonical identity, active/non-deleted related entities, and public-safe projection boundaries.
- Drafts, review queues, reviewer notes, medical notes, rejection reasons, internal metadata, private actor IDs, and audit references are private by default.
- Public helpers must not expose actor fields, reviewer fields, admin/internal fields, raw rows, raw Supabase/database errors, or content payloads.
- Service-role access is forbidden for public landing helpers and must not be used to bypass RLS.
- Ambiguous roles must block mutation.
- Future role helper functions may be needed, including:
  - `can_create_landing_content()`;
  - `can_edit_landing_content()`;
  - `can_review_landing_editorial()`;
  - `can_review_landing_medical()`;
  - `can_publish_landing_content()`;
  - `can_admin_landing_content()`.

These function names are conceptual only. This document does not authorize creating them.

## 14. Migration Implications

### Whether Roles Need Enum/Table/Permissions Model

Future landing roles likely need an explicit enum/table/permissions model. Possible future directions include:

- a landing-specific role enum and assignment table;
- a generic global permissions table;
- a profile permissions table;
- narrowly approved profile role fields;
- temporary platform-admin-only workflow if human-approved.

This document does not select or implement a schema.

### Why Existing Profile Booleans Are Not Enough

Existing profile booleans only identify broad platform admin, provider user, and patient user states. They do not encode landing editor, editorial reviewer, medical reviewer, publisher, landing content admin, medical/legal approver, or separation-of-duties semantics.

### Whether Content Table Can Reference Profile IDs Before Roles Exist

A future landing content table may include actor profile references such as `created_by_profile_id`, `updated_by_profile_id`, `editorial_reviewed_by_profile_id`, `medical_reviewer_profile_id`, and `published_by_profile_id`. However, those fields only identify actors; they do not prove that the actor had legitimate authority unless role semantics and mutation policies are implemented.

### Whether Role Model Must Be Implemented Before `landing_page_contents` Migration

Conservative sequencing:

1. Document role/review/publish semantics.
2. Plan landing content migration.
3. Implement landing content migration only if separately approved.
4. Implement role/RLS policies only if separately approved.
5. Implement public-safe projection only if separately approved.
6. Implement data-bearing helper only if separately approved.
7. Integrate routes/crawler/indexability only if separately approved.

A content table could be planned before role implementation, but it must not become a trusted write/review/publish source until role semantics, RLS, and audit behavior are implemented and tested.

### Temporary Platform-Admin-Only Workflow

A temporary platform-admin-only workflow is acceptable only if human product/legal/medical stakeholders explicitly approve it. It must require audit evidence and external approval references where the platform admin is entering editorial/medical decisions on behalf of others.

## 15. Query Helper Implications

- Data-bearing helper implementation remains blocked until review status source is trustworthy.
- Helpers must not trust statuses that cannot be legitimately set by approved actors under approved policies.
- Helpers must not expose title, intro, sections, FAQ, reviewer fields, admin fields, internal notes, raw content rows, actor IDs, private metadata, or raw database errors.
- Helpers must not use service-role access.
- Helpers must not use keyword seed JSON at runtime.
- Helpers must not generate content.
- Helpers must not produce direct rendering, metadata, sitemap, schema, robots, `llms.txt`, canonical, hreflang, or crawler behavior.
- Helpers must fail closed on missing/ambiguous review state, missing role authority, unresolved canonical identity, RLS denial, zero rows, multiple rows, private-data risk, or partial query failure.

## 16. Route/Crawler Implications

- No route integration is authorized now.
- No visible noindex pages are authorized now.
- No indexable pages are authorized now.
- No metadata, canonical, or hreflang implementation is authorized now.
- No sitemap, schema, robots, or `llms.txt` changes are authorized now.
- Publishing content is not the same as indexing content.
- Route/crawler/indexability changes require separate approved `PHASED_BUILD_ONLY` tasks after content, role, RLS, public-safe projection, and helper readiness are proven.

## 17. Recommended Next Subphase

Recommended next subphase: **no further action until human product/legal/medical decision**.

Reasoning:

- This document defines conservative role boundaries but does not choose a final implementable schema.
- Human product/legal/medical stakeholders must decide whether the future workflow should use explicit global landing roles, a temporary platform-admin-only workflow with external approvals, or remain blocked.
- Landing content migration implementation is premature until those governance decisions are approved.
- Landing roles/RLS implementation is premature until the role model is selected.
- Specialty relationship semantics remains important, but role/medical/legal authority should not be bypassed by moving directly to runtime or schema work.

## 18. Exact Allowed Files for Next Recommended Task

If the next task remains plan-only:

- no files.

If humans approve a documentation-only follow-up:

- one `docs/seo/*.md` file only.

## 19. Exact Forbidden Files for Next Recommended Task

Unless a separate explicit implementation phase authorizes them, the next task must not edit:

- routes;
- route-check;
- helpers;
- migrations unless explicit implementation phase;
- generated types;
- package files;
- sitemap/robots/`llms.txt`;
- `data/seo`;
- tests unless explicit test phase;
- public UI/content files;
- Supabase client/server files;
- API handlers.

## 20. Validation Expectations

For this documentation-only task, expected validation is:

- confirm only `docs/seo/LANDING_ROLES_REVIEW_PERMISSIONS_DECISION_MAP.md` was created;
- confirm no forbidden files were edited;
- run required validation commands without faking results;
- keep route/helper/schema/crawler/public UI behavior unchanged.

Future implementation phases should run the full validation gate appropriate to their scope, including unit tests, environment checks, migration validation, RLS static tests, route checks, typecheck, build, and lint.
