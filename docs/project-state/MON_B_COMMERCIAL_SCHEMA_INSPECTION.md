# MON-B Commercial Schema Inspection

Status: completed as a documentation/state inspection.

## Purpose

This note records the current commercial, media, sponsored placement, content, and lead-history schema surface that already exists in the generated Supabase types. It is a planning artifact for the next monetization and content phases.

This note does not implement any product behavior.

## Guardrails

- No migrations were added.
- No RLS policies were changed.
- No generated Supabase types were changed.
- No seed data was changed.
- No application code was changed.
- No public UI or admin UI was changed.
- No payment gateway, upload system, article editor, or AI workflow was implemented.

## Inspected sources

Primary source inspected:

- `supabase/types/database.types.ts`

Relevant existing tables and concepts were identified from the generated type surface only. Before any future database migration, the corresponding SQL migrations should be inspected directly as well.

## Existing commercial foundation

### Subscription plans

Existing table:

- `subscription_plans`

Observed capability:

- plan slug and name
- English and Arabic descriptions
- price amount
- currency code
- billing interval
- status
- sort order
- basic entitlement flags
  - `includes_claim_badge`
  - `includes_featured_listing`
  - `includes_media_gallery`
- limits
  - `max_doctors`
  - `max_locations`
  - `max_services`
- metadata
- soft delete support

Interpretation:

- This is a useful base for Free, Verified, Growth, and Premium plan definitions.
- It does not yet model the full entitlement contract from the STRAT-A operating model.
- It does not directly model article placements, special offer placements, add-on products, campaign credits, or media limits beyond the current flags and max fields.

### Center subscriptions

Existing table:

- `center_subscriptions`

Observed capability:

- links a center to a subscription plan
- status
- billing interval
- currency code
- agreed price
- starts and ends dates
- trial ends date
- cancelled date
- sales profile reference
- notes
- metadata
- soft delete support

Interpretation:

- This can support admin-assigned provider subscription plans.
- It is not yet a full billing/payment system.
- It does not yet represent separately purchasable add-ons such as Homepage Ads or Special Offer Placement.

## Existing sponsored placement foundation

### Sponsored campaigns

Existing table:

- `sponsored_campaigns`

Observed capability:

- campaign title in English and optionally Arabic
- center owner
- budget amount
- currency code
- status
- start and end dates
- created by profile
- metadata
- soft delete support

Interpretation:

- This can support a campaign wrapper for paid visibility.
- It is not yet enough by itself to model all commercial products, order state, payment status, or placement inventory.

### Sponsored placements

Existing table:

- `sponsored_placements`

Observed capability:

- belongs to sponsored campaign
- country and optional locale
- slot type
- placement key
- priority
- active flag
- start and end dates
- target center, center service, doctor, or doctor service
- metadata
- soft delete support

Observed enum:

- `sponsored_slot_type`
  - `featured_partner`
  - `sponsored_result`
  - `homepage_featured`

Interpretation:

- This is a good existing foundation for homepage sponsored cards and sponsored search/result placements.
- It likely needs extension or a related model for article-specific placements and special offer placements.
- The current target model focuses on providers/services, not explicit offer targets or article slots.

## Existing media foundation

### Media assets

Existing table:

- `media_assets`

Observed capability:

- storage bucket and path
- public URL or external URL
- MIME type
- width and height
- file size
- original filename
- checksum
- blurhash
- source
- status
- created by profile
- metadata
- soft delete support

Observed enums:

- `media_asset_source`
  - uploaded
  - external_url
  - imported
  - generated
  - unknown

- `media_asset_status`
  - draft
  - pending_review
  - approved
  - rejected
  - hidden
  - archived

Interpretation:

- This is a strong base for center images, offer images, ad images, article images, thumbnails, and AI-generated images.
- The status model already supports review and approval.
- Future work should reuse this rather than creating a parallel upload/media table.

### Entity media

Existing table:

- `entity_media`

Observed capability:

- links a media asset to an entity
- entity type
- usage kind
- alt text in English and Arabic
- captions in English and Arabic
- primary and featured flags
- sort order
- media review status
- public visibility flag
- metadata
- soft delete support

Observed enums:

- `media_entity_type`
  - center
  - center_location
  - doctor
  - service
  - center_service
  - doctor_service
  - review

- `media_usage_kind`
  - logo
  - cover
  - profile
  - gallery
  - menu
  - certificate
  - document
  - before_after
  - thumbnail
  - other

Interpretation:

- This is reusable for existing center, doctor, service, and gallery media.
- It does not yet include article, offer, or ad as media entity types.
- Future article/offer/ad media work should extend or adapt this model carefully instead of duplicating it.

## Existing content foundation

### Landing page contents

Existing table:

- `landing_page_contents`

Observed capability:

- localized landing content
- canonical landing and area keys
- family type
- service, specialty, area, and city links
- title, intro, sections, FAQ
- content status
- editorial review status
- medical review status
- medical reviewer profile
- published and reviewed metadata
- created/updated by profile
- soft delete support

Interpretation:

- This is a strong foundation for SEO landing pages.
- It is not the same as an article CMS.
- It can inform the future article review workflow, but article content should likely have its own model because articles need slug, author/editor/reviewer, media/video blocks, internal links, placements, and publication workflow.

## Existing lead and admin operations foundation

### Provider onboarding leads

Existing tables:

- `provider_onboarding_leads`
- `provider_onboarding_lead_events`

Observed capability:

- provider onboarding lead submission data
- status and priority
- request source
- contact and consent fields
- private lead history events
- actor profile reference for lead events
- event type
- old/new status and priority fields
- note text field
- metadata

Interpretation:

- This supports the admin onboarding workflow already implemented.
- It can become the operational bridge from provider interest to center creation, plan assignment, offer creation, or paid placement sales.

## Gaps against STRAT-A operating model

### Commercial product and add-on model

Not yet fully represented:

- commercial product catalog for add-ons
- paid add-on orders
- add-on purchase state
- manual invoice/payment status
- paid placement inventory
- campaign credits or bundled entitlements
- product rules for Free Listing providers buying add-ons

Potential future model:

- `commercial_products`
- `commercial_orders`
- `commercial_order_items`
- `commercial_entitlements`
- or extension of existing `sponsored_campaigns` and `sponsored_placements` if the team decides to avoid new tables.

### Official Offers

Not yet fully represented as a dedicated offer model:

- offer content
- offer terms
- offer dates
- offer status/review workflow
- offer image linkage
- offer owner
- offer placement linkage

Potential future model:

- `provider_offers`
- `provider_offer_translations`
- `provider_offer_media`
- `provider_offer_review_events`

### Special Offer Placement

Existing sponsored placements can represent provider/service sponsorship, but they do not explicitly target offers or article offer slots.

Missing concepts:

- offer target type
- article placement slot
- homepage special offer surface
- offer placement schedule
- paid placement label mode
- active/pending/commercial review state per placement

Potential future model:

- extend `sponsored_placements` target model
- or introduce `commercial_placements` / `offer_placements`

A future architecture decision is required before migration work.

### Article CMS

Not yet represented as a dedicated article CMS.

Missing concepts:

- articles
- translations
- body sections
- article FAQ
- article media blocks
- article video blocks
- internal links
- article placement slots
- editorial and medical review workflow
- AI draft metadata
- publication scheduling

Potential future model:

- `articles`
- `article_translations`
- `article_sections`
- `article_faqs`
- `article_media`
- `article_videos`
- `article_internal_links`
- `article_placements`

### AI editorial assistant

Not yet represented as a workflow.

Missing concepts:

- AI topic suggestions
- AI draft records
- AI internal-link suggestions
- AI media prompt suggestions
- human approval status
- medical review status for AI-assisted content

Potential future model:

- `ai_content_suggestions`
- `ai_article_drafts`
- `ai_content_review_events`

This should come after article CMS and approval workflow foundations.

## Recommended next phases

### MON-C candidate: Admin plan assignment

Scope:

- Use existing `subscription_plans` and `center_subscriptions`.
- Add admin read-only or minimal assignment UI only after confirming existing tables and RLS/server access patterns.
- No payment gateway.
- No public UI changes.

Why this is next-safe:

- Existing tables already support basic plan assignment.
- It connects onboarding/sales workflow to monetization.

### MON-D candidate: Paid add-on / placement order contract

Scope:

- Decide whether to extend `sponsored_campaigns` and `sponsored_placements` or introduce a generic commercial order/add-on layer.
- Document before migrating.

Why this is important:

- Homepage Ads and Special Offer Placement are independently purchasable add-ons, including for Free Listing providers.

### OFF-A candidate: Official Offer data model plan

Scope:

- Plan a dedicated offer content model.
- Keep Official Offer content separate from Special Offer Placement.

### ART-B candidate: Article CMS data model plan

Scope:

- Plan dedicated article, media, video, internal-link, and placement-slot models.
- Do not reuse landing page content as article CMS without explicit decision.

## Key architecture decisions still required

1. Should paid add-ons be modeled through a generic commercial order system, or directly through sponsored campaigns and placements?
2. Should Special Offer Placement be a subtype of sponsored placement or a separate offer placement model?
3. Should article ads and article special offers share a generic article placement table?
4. Should article media reuse `media_assets` plus an extended `entity_media`, or have article-specific media join tables?
5. Should `media_entity_type` be extended to include article, offer, and ad entities?
6. How should Free Listing add-on purchases be represented before online payments exist?
7. What admin workflow should convert provider onboarding leads into center, plan, offer, and placement records?

## Recommendation

Proceed with MON-C only if the immediate goal is plan assignment using existing `subscription_plans` and `center_subscriptions`.

Proceed with MON-D if the immediate goal is Homepage Ads / Special Offer paid add-ons.

Do not build article placements, AI drafts, or offer media until the offer and article data models are explicitly planned.
