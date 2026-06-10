# DrMuscat CMS Content Model Spec V1

## Status and Authority

- Status: Documentation-only
- Authority: CMS content model and publishing workflow planning only
- Does not authorize implementation
- Does not authorize CMS database creation
- Does not authorize article route creation
- Does not authorize media upload implementation
- Does not authorize AI generation implementation
- Does not authorize publishing automation
- Does not authorize comments/reviews/stories implementation
- Must be read together with:
  - `docs/platform/DRMUSCAT_PLATFORM_ARCHITECTURE_V1.md`
  - `docs/platform/DRMUSCAT_PLATFORM_EXECUTION_ROADMAP_V1.md`
  - `docs/platform/DRMUSCAT_SEO_AI_CONTENT_OPERATING_SYSTEM_SPEC_V1.md`
  - `docs/platform/DRMUSCAT_KEYWORD_UNIVERSE_CONTENT_INTELLIGENCE_SPEC_V1.md`
  - `docs/platform/DRMUSCAT_PUBLIC_ROUTE_SEO_INVENTORY_SPEC_V1.md`
- Future implementation requires separate `PHASED_BUILD_ONLY` approval

This specification does not replace the V10.4 master specification, V10.5 documentation-only addendums, migration protocol, RLS/security protocol, SEO validation protocol, or human approval checkpoints. If a future interpretation conflicts with stricter repository guardrails, the stricter guardrail wins.

## Four-Axis Mapping

- Execution Phase: Phase 0 — Spec Freeze and Schema Patch / documentation alignment only
- Lock Scope: Phase 0 — Repository Readiness
- Product Module: Phase 0 — Setup Only / documentation alignment
- Subphase ID: `ALIGN-CMS-CONTENT-MODEL-V1`

## 1. Purpose

This spec defines the future CMS content model for DrMuscat before any implementation. DrMuscat is an Oman-first healthcare, beauty, wellness, pharmacy, lab, hospital, dental, pet clinic, and provider discovery platform, so CMS planning must combine SEO discipline, editorial governance, healthcare risk controls, localization, provider-supply awareness, and human approval.

The CMS must eventually support:

- SEO articles
- category guides
- area guides
- FAQ blocks
- legal/trust content
- homepage and landing page copy blocks
- provider profile support content
- doctor profile support content
- offer content
- sponsored content
- provider stories/updates later
- media-enhanced content
- AI-assisted briefs/drafts later
- editorial review
- medical review
- SEO review
- owner/admin approval
- publish/refresh/archive lifecycle

This document defines the model and guardrails only. It does not create tables, routes, UI, APIs, AI integration, or publishing behavior.

## 2. Language and Localization Model

- Public CMS content for launch is English and Arabic only.
- Persian may be used for internal planning notes, AI summaries, admin review notes, and owner review notes only.
- Public Persian/Hindi routes are not allowed unless separately approved.
- English and Arabic content must have equivalent intent, facts, disclaimers, and review status.
- Arabic content must be real localization/transcreation, not empty placeholders or poor literal translation.
- A content item may have language variants under one canonical group.
- A language variant must not be indexable until it has approved localized content.

Future language-related fields may include:

- `canonical_group_id`
- `language`
- `locale`
- `country`
- `title`
- `slug`
- `excerpt`
- `body`
- `meta_title`
- `meta_description`
- `og_title`
- `og_description`
- `localized_status`
- `translation_source_language`
- `translation_review_status`
- `localized_last_reviewed_at`

No fields or tables are implemented in this PR.

## 3. Content Type Taxonomy

Future CMS content types are planning labels only. They do not create runtime enums, tables, routes, records, or UI.

| Content type | Purpose | Public/private nature | Index/noindex default | Review requirement | AI may assist later | Medical review may be required |
| --- | --- | --- | --- | --- | --- | --- |
| `seo_article` | Long-form educational or discovery content for Oman-first search demand. | Public when approved and published. | Index when approved, localized, non-thin, and route policy permits. | Editor/admin and SEO review; medical review by risk. | Yes, for briefs, outlines, drafts, metadata, links, and refresh ideas. | Yes, for medium/high-risk medical topics. |
| `category_guide` | Explain a provider/service category and help users choose providers. | Public when approved and supported by supply. | Index when category has enough useful content and provider supply. | Editor/admin and SEO review. | Yes, for structure, FAQs, and internal link suggestions. | May be required for clinical or procedure-heavy categories. |
| `area_guide` | Help users understand healthcare/service discovery in a specific Oman area. | Public when approved and route inventory permits. | Index only when not thin and localized content exists. | Editor/admin and SEO review. | Yes, for outlines and localization support. | Usually no, unless medical claims are added. |
| `area_category_guide` | Combine area and category discovery, such as category availability in a location. | Public when approved and supply threshold is met. | Index only when approved, non-duplicative, and route policy permits. | Editor/admin and SEO review. | Yes, for brief and internal link suggestions. | May be required depending on category risk. |
| `faq_block` | Reusable approved FAQ content for pages, articles, and guides. | Public only when attached to approved visible content; internal while drafting. | Follows parent page; no index as standalone by default. | Editor/admin and SEO review; medical review by topic. | Yes, for suggestions only. | Yes, if medical-sensitive. |
| `homepage_block` | Managed copy blocks for homepage sections. | Public after approval. | Follows homepage policy; not independently indexable. | Editor/admin and owner/admin approval. | Yes, for copy variants only. | Usually no unless medical claims are included. |
| `landing_page_block` | Managed copy blocks for approved landing pages. | Public after approval. | Follows approved landing page policy. | Editor/admin and SEO review. | Yes, for copy and metadata ideas. | May be required depending on claims. |
| `legal_page` | Legal, policy, privacy, terms, and compliance content. | Public or private depending page type. | Index/noindex decided by legal/trust policy. | Owner/admin/legal approval required. | Limited assistance only; never final authority. | Usually no, unless health-policy claims require expert review. |
| `trust_page` | Trust, verification, safety, content policy, and editorial standards pages. | Public when approved. | Index when useful and approved. | Owner/admin and relevant reviewer approval. | Yes, for structure, but facts require manual review. | May be required for medical review policy statements. |
| `provider_profile_support` | Editorial support copy for provider profiles and profile completeness. | Public only after moderation and profile approval. | Follows provider profile index policy. | Admin/editor moderation and SEO review when indexable. | Yes, for formatting and clarity; must not invent facts. | Yes, if medical-sensitive. |
| `doctor_profile_support` | Editorial support copy for doctor profiles, specialties, and profile context. | Public only after moderation and profile approval. | Follows doctor profile index policy. | Admin/editor moderation and SEO review when indexable. | Yes, for formatting and clarity; must not invent credentials. | Yes, if medical-sensitive. |
| `offer_content` | Approved offer copy, terms, conditions, and compliance-sensitive promotions. | Public only when offer workflow is approved. | Usually noindex or follows approved offer route policy until SEO approval. | Admin, compliance/offer terms review, and owner/admin where sensitive. | Limited assistance for wording; no unapproved claims. | May be required for medical/health offers. |
| `sponsored_content` | Clearly labeled paid or sponsored editorial/advertising content. | Public only after sponsored review and labeling. | Index only if approved, labeled, non-thin, and policy-compliant. | Admin, SEO, and owner/admin approval. | Limited assistance; disclosure cannot be automated away. | May be required depending on claims. |
| `provider_story` | Provider updates, announcements, events, or engagement stories. | Public engagement content after moderation. | Noindex by default. | Moderation/admin review required. | Yes, for formatting and summaries. | Yes, if medical-sensitive. |
| `doctor_story` | Doctor updates, educational notes, or short engagement stories. | Public engagement content after moderation. | Noindex by default. | Moderation/admin review required. | Yes, for formatting and summaries. | Yes, if medical-sensitive. |
| `media_caption` | Captions, alt text, transcripts, and media descriptions. | Public when attached to approved media; private while drafting. | Follows parent content/media policy. | Editor/admin review; accessibility and SEO checks. | Yes, for suggestions, never unreviewed. | Yes, for before/after or clinical media. |
| `video_article` | Video-enhanced article with transcript and supporting editorial content. | Public when approved and media policy permits. | Index when transcript/content is substantial and approved. | Editor/admin, SEO, and media performance review; medical review by risk. | Yes, for transcript summaries and metadata. | Yes, for medical-sensitive video. |
| `refresh_task` | Internal task to refresh, merge, noindex, archive, or improve existing content. | Private/internal. | Noindex. | Editor/admin and relevant reviewer depending target content. | Yes, for recommendations and summaries. | May be required if target content is medical-sensitive. |
| `internal_planning_note` | Private editorial, SEO, owner, AI, or planning note. | Private/internal only. | Noindex. | Internal review as needed. | Yes, including Persian internal summaries. | May be required if note is used to support high-risk content. |

## 4. Core Content Entity Model

The future conceptual model may include these planning entities:

- content item
- content version
- localized variant
- content block
- media asset reference
- SEO metadata
- review assignment
- approval record
- publication record
- refresh task
- internal note
- content relationship / internal link plan
- source/reference record
- AI generation record later

These are conceptual planning entities only. No database schema is created. Future implementation must separately define database names, ownership, RLS, audit behavior, generated types, API/server-action boundaries, route behavior, validation gates, and rollback/stop rules before any runtime work begins.

## 5. Recommended Content Fields

Future content items may use fields like the following. These are planning fields only and are not implemented in this PR.

### Identity

- `id`
- `canonical_group_id`
- `content_type`
- `content_subtype`
- `language`
- `locale`
- `country`
- `status`
- `risk_level`

### Editorial

- `title`
- `slug`
- `excerpt`
- `body`
- `summary`
- `faq_items`
- `key_takeaways`
- `disclaimer_block`
- `author_id`
- `editor_id`
- `medical_reviewer_id`
- `seo_reviewer_id`
- `owner_approver_id`

### SEO

- `primary_keyword`
- `secondary_keywords`
- `topic_cluster`
- `search_intent`
- `funnel_stage`
- `meta_title`
- `meta_description`
- `og_title`
- `og_description`
- `canonical_url`
- `hreflang_group`
- `noindex`
- `sitemap_eligible`
- `schema_type`
- `schema_eligible`
- `breadcrumb_label`

### Governance

- `created_by`
- `updated_by`
- `approved_by`
- `published_by`
- `published_at`
- `last_reviewed_at`
- `next_review_due_at`
- `archived_at`
- `rejected_reason`
- `blocked_reason`

### Media

- `hero_media_id`
- `inline_media_ids`
- `video_embed_url`
- `video_transcript`
- `media_alt_text_status`
- `media_performance_status`

### AI planning later

- `ai_brief_id`
- `ai_draft_id`
- `ai_allowed`
- `ai_summary_internal`
- `ai_risk_notes`
- `ai_prompt_version`

No implementation.

## 6. Content Status Workflow

Future statuses may include:

- `idea`
- `brief_ready`
- `brief_review`
- `draft`
- `editor_review`
- `medical_review`
- `seo_review`
- `owner_review`
- `approved`
- `scheduled`
- `published`
- `needs_refresh`
- `refresh_in_progress`
- `refresh_review`
- `archived`
- `rejected`
- `blocked`

Conceptual allowed transitions:

- `idea` → `brief_ready`
- `brief_ready` → `brief_review`
- `brief_review` → `draft`
- `draft` → `editor_review`
- `editor_review` → `medical_review` when required
- `editor_review` → `seo_review` when medical review is not required
- `medical_review` → `seo_review`
- `seo_review` → `owner_review`
- `owner_review` → `approved`
- `approved` → `scheduled` or `published`
- `published` → `needs_refresh`
- `needs_refresh` → `refresh_in_progress`
- `refresh_in_progress` → `refresh_review`
- `refresh_review` → `published`
- Any review state → `rejected` or `blocked` where appropriate
- `published` → `archived`

Future implementation must enforce transitions server-side and audit sensitive transitions. Client-only workflow enforcement is not sufficient. Publishing, unpublishing, approval, rejection, archive, canonical/noindex changes, schema eligibility changes, medical risk changes, and sponsored/provider-generated approvals must be auditable.

## 7. Review and Approval Matrix

| Content/risk type | Required reviewers | Final approval | Notes |
| --- | --- | --- | --- |
| Low-risk discovery article | Editor/admin review. | Editor/admin approval. | Covers provider discovery, how to choose a clinic, what to ask a provider, area/category discovery, and general wellness/discovery. |
| Medium-risk procedure/service explanation | Editor/admin and SEO review; medical review may be required depending topic. | Admin or owner/admin when risk or claims are sensitive. | Must avoid prescriptive medical advice and unsupported claims. |
| High-risk medical topic | Medical reviewer and SEO review. | Owner/admin final approval. | Required for symptoms, diagnosis, medications, treatment decisions, emergency care, pregnancy/children/high-risk topics, lab interpretation, prescription-related content, invasive procedures, before/after claims, weight loss medication/injection content, and mental health/medical advice. |
| Category guide | Editor/admin and SEO review. | Editor/admin approval; owner/admin if high-value or sensitive. | Medical review may be required for clinical categories. |
| Area guide | Editor/admin and SEO review. | Editor/admin approval. | Must avoid thin pages and duplicate route patterns. |
| FAQ block | Editor/admin and SEO review; medical review by risk. | Editor/admin or owner/admin for sensitive topics. | FAQ schema is only allowed when visible, approved, and policy-compliant. |
| Provider profile support content | Admin/editor moderation and SEO review when indexable. | Admin approval. | Provider-generated claims require verification and moderation. |
| Doctor profile support content | Admin/editor moderation and SEO review when indexable. | Admin approval. | Credentials, specialties, and claims must not be invented. |
| Offer content | Admin review, offer terms review, and compliance review. | Owner/admin or authorized admin approval. | Offer content requires clear terms and must not imply unsupported outcomes. |
| Sponsored content | Admin review, SEO review, disclosure/label review. | Owner/admin final approval. | Sponsored content requires an obvious sponsored label. |
| Provider story/update | Moderation/admin review; medical review by risk. | Admin approval. | Stories are noindex by default and are engagement content, not automatic SEO pages. |
| Legal/trust page | Owner/admin/legal review. | Owner/admin/legal approval. | Legal/trust pages require stricter approval and must not be changed casually. |
| AI-assisted draft | Human editor/admin review plus SEO/medical/owner review based on risk. | Never auto-approved; final approver depends on risk. | AI-assisted drafts are never auto-approved and must not bypass reviewers. |

Rules:

- Low-risk content requires editor/admin approval.
- Medium-risk content requires editor/admin and SEO review; medical review may be required depending topic.
- High-risk content requires medical reviewer, SEO review, and owner/admin final approval.
- Sponsored content requires admin review and sponsored label.
- Offer content requires offer terms and compliance review.
- Legal/trust pages require owner/admin/legal approval.
- AI-assisted drafts are never auto-approved.
- Provider-generated content requires moderation.

## 8. Risk Level Model

### Low risk

- provider discovery
- how to choose a clinic
- what to ask a provider
- area/category discovery
- general wellness/discovery

### Medium risk

- procedure preparation
- general dental/beauty/wellness explanations
- lab/service overview
- pet care informational content
- non-prescriptive health education

### High risk

- symptoms
- diagnosis
- medications
- treatment decisions
- emergency care
- pregnancy/children/high-risk medical topics
- lab result interpretation
- prescription-related content
- invasive procedures
- before/after claims
- weight loss medication or injection content
- mental health/medical advice

### Blocked

- individualized diagnosis
- prescription instructions
- emergency triage
- unsupported treatment guarantees
- fake medical claims
- private patient information
- unapproved before/after claims
- content requiring professional review that is unavailable

## 9. SEO Publishing Model

Every publishable content item must define:

- canonical URL
- language variant
- hreflang group
- x-default behavior where relevant
- index/noindex
- sitemap eligibility
- title tag
- meta description
- OG title
- OG description
- schema eligibility
- breadcrumb label
- internal links
- related providers/categories/areas
- last reviewed date
- author/reviewer information where appropriate
- disclaimer requirement
- risk level
- refresh date

Rules:

- No content may be indexable if required localized version is missing and route policy blocks it.
- No fake FAQ schema.
- No Review/AggregateRating schema until review system maturity.
- No hidden structured data.
- No schema that does not match visible content.
- No public Persian/Hindi content.
- No keyword-stuffed metadata.
- No unsupported “best” claims unless editorial criteria are approved.

## 10. Media Model

Future media support may include:

### Media types

- hero image
- inline image
- image gallery
- infographic
- YouTube embed
- self-hosted video later
- provider video tip later
- doctor video tip later
- before/after media only with strict approval
- document/source attachment for internal review only

### Future media metadata

- `media_id`
- `content_id`
- `media_type`
- `storage_path_or_external_url`
- `title`
- `alt_text`
- `caption`
- `credit`
- `source`
- `width`
- `height`
- `format`
- `file_size`
- `compression_status`
- `lcp_candidate`
- `lazy_load`
- `transcript`
- `thumbnail`
- `review_status`
- `medical_sensitive`
- `public_visibility`

### Performance rules

- Image/video dimensions required.
- Prefer AVIF/WebP for images where possible.
- Lazy-load non-critical media.
- Use facade/lazy-loading strategy for YouTube embeds.
- Avoid CLS from media.
- Heavy video upload is future-only.
- Before/after media requires strict policy and approval.
- No private patient media may be exposed.

## 11. AI Content Assistance Model

AI may assist with:

- topic clustering
- brief generation
- outline generation
- English draft
- Arabic draft/transcreation
- Persian internal summary
- FAQ suggestions
- media suggestions
- internal link suggestions
- metadata suggestions
- schema suggestions
- risk notes
- refresh recommendations

AI must not:

- publish
- approve
- bypass reviewers
- create diagnosis/prescription/treatment instructions
- invent provider facts
- invent medical claims
- invent citations
- create fake reviews
- create public Persian/Hindi content
- generate pages from every keyword row
- change canonical/noindex/schema automatically

Future AI records may track:

- prompt version
- model/provider
- input source
- output summary
- reviewer decision
- risk notes
- rejected output reason
- created_by
- created_at

No AI implementation in this PR.

## 12. Provider and Doctor Content Model

Future provider and doctor content planning may include:

- provider article requests
- doctor article requests
- provider profile support text
- doctor profile support text
- weekly updates/stories
- educational notes
- event participation
- new equipment announcements
- offer/sponsored content

Rules:

- Provider/doctor cannot directly publish public content.
- Provider/doctor content must be reviewed.
- Medical-sensitive provider/doctor content requires medical review.
- Provider cannot self-label as verified/sponsored.
- Provider cannot publish patient/private data.
- Patient case examples require anonymization and approval.
- Stories are noindex by default.
- Provider stories are engagement content, not automatic SEO pages.

## 13. Comments and Review Content Relationship

- Comments/reviews are future systems, not CMS implementation in this PR.
- Article comments are future-only.
- Provider/doctor profile comments require login.
- Comments require moderation before display in initial phases.
- Provider replies require moderation policy.
- Ratings/reviews are delayed until verification and moderation maturity.
- AggregateRating schema is blocked until enough real approved reviews exist.

## 14. Source and Citation Model

Future content sources may include:

- official provider data
- approved public provider profile data
- official health/government/medical sources when needed
- reviewed internal notes
- approved expert/doctor contribution
- manually reviewed external sources
- Google Search Console and analytics data for planning only

Rules:

- AI must not invent citations.
- High-risk content needs source review.
- Claims must be visible and source-supported.
- Source URLs/notes may be private editorial metadata.
- Public citation display policy must be separately approved.

## 15. Refresh and Maintenance Model

Refresh triggers may include:

- stale content
- ranking drop
- high impressions/low CTR
- outdated provider supply
- changed medical/trust policy
- missing Arabic version
- missing media
- weak internal links
- cannibalization
- changed offer/provider status
- new competitor content
- scheduled periodic review

Future refresh statuses may include:

- `refresh_candidate`
- `refresh_brief_ready`
- `refresh_in_progress`
- `refresh_review`
- `refresh_approved`
- `refreshed`
- `no_action`

Review windows:

- 7 days after publish for index/crawl
- 30 days for impressions/CTR
- 60 days for ranking movement
- 90 days for refresh/merge/noindex decision

## 16. Audit and Versioning Requirements

Future CMS must support:

- content versions
- revision history
- who changed what
- before/after values for sensitive fields
- approval records
- rejection reasons
- publish/unpublish records
- archive reasons
- AI output review trail
- medical review notes
- SEO review notes
- rollback capability

Sensitive actions requiring audit:

- publish
- unpublish
- approve
- reject
- archive
- change canonical
- change noindex
- change schema eligibility
- change medical risk level
- change author/reviewer
- publish sponsored content
- approve provider-generated content

No implementation.

## 17. Access Control Planning

Future access principles:

- public visitors can only read approved public published content.
- content editors can draft/edit assigned content.
- SEO reviewers can review metadata/internal links/schema eligibility.
- medical reviewers can review medical-sensitive content.
- admins can manage daily editorial operations.
- super_admin controls dangerous/global SEO and publishing settings.
- providers/doctors can request or draft content only where future provider dashboard allows.
- no provider self-publishing for public medical-sensitive content.
- no anonymous content creation.
- no client-only permission checks.

## 18. Explicit Non-Implementation

This PR implements none of the following:

- no CMS database
- no content tables
- no article tables
- no media tables
- no story tables
- no comment/review tables
- no content routes
- no article routes
- no media upload
- no AI integration
- no publishing UI
- no admin CMS dashboard
- no provider content dashboard
- no sitemap/schema/canonical changes
- no keyword import
- no seed data
- no public Persian/Hindi routes
- no RLS/API/server action changes

## 19. Future PR Sequence

Recommended future PR sequence:

1. AI Brief/Draft Workflow Spec V1
2. SEO Reporting & Analytics Spec V1
3. Media SEO & Video/Image Performance Spec V1
4. Provider Stories & Comments Spec V1
5. Legal/Trust/AI Editorial Policy Spec V1
6. CMS Database Foundation
7. Admin CMS Read-Only UI
8. Admin CMS Draft/Review/Publish UI
9. Public Article Route Foundation
10. AI Draft Assistant Integration

These are recommendations only and do not authorize implementation.

## 20. Completion Report Requirements

Final Codex report must include:

- Files created/changed
- Confirmation documentation-only
- Confirmation no source code changed
- Confirmation no routes changed
- Confirmation no migrations/RLS/API/server actions changed
- Confirmation no CMS/article/media/story/comment/review/AI behavior was implemented
- Summary of CMS content model
- Summary of review/publishing gates
- Validation results
- Any blockers/conflicts
