# 31_GROWTH_SEO_AI_SEARCH_AND_ADS_STRATEGY.md

# DrMuscat Growth, SEO, AI Search and Ads Strategy

## Canonical Growth Positioning
DrMuscat must be built as an Oman healthcare discovery and growth platform, not as a generic directory.

The platform must support growth through:
1. Google SEO
2. AI search and chatbot discoverability
3. local backlinks and partner link kits
4. WhatsApp-first lead flows
5. Instagram awareness and retargeting ads
6. YouTube awareness and retargeting
7. free seeded public listings converted into claimed/verified paid profiles

## Primary Business Logic
Free public listings create inventory, SEO surface area, and trust. Claimed and paid profiles create monetization.

Claude Code must not build DrMuscat as only a listing website. Every major public and admin feature must support at least one of:
- patient discovery
- center trust
- SEO visibility
- WhatsApp/call/direction conversion
- review/reputation growth
- claim-profile conversion
- paid upgrade conversion
- measurable reporting

## Seeded Free Listings
Hospitals, pharmacies, clinics, labs, imaging centers, dental clinics, dermatology centers, physiotherapy centers, home healthcare providers and similar public healthcare locations may be added as unclaimed profiles.

Unclaimed profiles must:
- clearly show `Public listing` or `Unclaimed profile`
- avoid partnership language
- avoid verified language
- avoid discount/offer claims unless explicitly approved
- include only publicly available information
- include `Claim this profile`
- include `Suggest an edit`
- include `Report wrong information`
- include `Request removal`
- show `Last reviewed` or `Last updated` when available
- include a disclaimer that information may change and users should contact the center before visiting

Claimed/paid profiles may include:
- Verified Center badge
- DrMuscat Partner badge
- offers and campaigns
- review response tools
- analytics dashboard
- featured placement
- more media
- WhatsApp/call/direction tracking
- campaign landing pages
- monthly reports

## Google SEO Strategy
The platform must create SEO-indexable pages for:
- center profiles
- doctor profiles, when approved
- category pages
- area pages
- service pages
- category + area matrix pages
- service + area pages, only where content is sufficient
- offer pages, when approved
- trust/policy pages
- healthcare guide articles

Required SEO page families:
```text
/en/centers/[centerSlug]
/ar/centers/[centerSlug]
/en/doctors/[doctorSlug]
/ar/doctors/[doctorSlug]
/en/clinics/[categorySlug]
/ar/clinics/[categorySlug]
/en/clinics/[categorySlug]/[areaSlug]
/ar/clinics/[categorySlug]/[areaSlug]
/en/services/[serviceSlug]-muscat
/ar/services/[serviceSlug]-muscat
/en/areas/[areaSlug]
/ar/areas/[areaSlug]
/en/for-clinics
/ar/for-clinics
/en/claim-your-clinic
/ar/claim-your-clinic
```

## AI Search / Chatbot Discoverability
Pages must be machine-readable and answerable by AI assistants.

Every eligible public page must include:
- clear title
- concise summary block
- structured data JSON-LD
- FAQ section
- breadcrumbs
- last updated date
- correction/report mechanism
- canonical URL
- hreflang for supported locales
- safe medical disclaimer where relevant

AI search readiness must include:
- `llms.txt` route if implemented in the current phase
- structured public sitemap
- clean semantic HTML
- FAQ content that answers direct user questions
- schema.org entities for MedicalClinic, Hospital, Pharmacy, Dentist, Physician, FAQPage, BreadcrumbList, Offer and AggregateRating where allowed

Claude Code must not generate medical claims or rankings that imply medical superiority unless backed by verified, compliant data.

## WhatsApp Growth Strategy
DrMuscat is WhatsApp-first in Oman.

Every center profile must support tracked actions:
- WhatsApp click
- call click
- direction click
- offer claim
- appointment/request inquiry, if enabled

WhatsApp prefilled messages must include source attribution where appropriate:
```text
Hi, I found your clinic on DrMuscat.
I want to ask about {{serviceName}}.
Area: {{areaName}}
Offer code: {{offerCode}}
```

Arabic version:
```text
مرحبا، حصلت عيادتكم في DrMuscat.
أريد أستفسر عن {{serviceName}}.
المنطقة: {{areaName}}
كود العرض: {{offerCode}}
```

## Instagram Ads Strategy
Instagram ads are used for:
- public awareness
- patient discovery
- clinic-owner awareness
- retargeting visitors
- warming up centers before sales visits

Required landing pages:
```text
/en/find-dental-clinics-muscat
/en/find-pharmacy-near-me
/en/laser-offers-muscat
/en/for-clinics
/en/clinic-growth-platform-oman
/en/claim-your-clinic
```
Arabic equivalents must exist where content is ready.

## YouTube Strategy
YouTube is primarily for trust and retargeting, not immediate subscription sales.

Support:
- YouTube Shorts landing pages
- embedded approved center videos
- campaign tracking with UTM
- retargeting events

## Backlink Strategy
Build natural backlinks only.

Allowed:
- partner center website links
- verified badge embed links
- local Oman business/community links
- PR launch articles
- healthcare event pages
- wellness/gym/insurance partner links
- center Instagram bio/profile links where possible

Forbidden:
- spam backlink packages
- PBN links
- comment spam
- unrelated low-quality links
- adult/gambling/crypto junk link sources

## Partner Link Kit
Paid/verified centers must have a badge embed option:
```html
<a href="https://drmuscat.com/en/centers/{{centerSlug}}" rel="noopener">
  Verified on DrMuscat
</a>
```

The badge means profile information has been verified or claimed. It must not imply clinical quality guarantee or medical outcome guarantee.

## Required Tracking Events
Every growth channel must map to events:
- page_view
- profile_view
- search_performed
- whatsapp_click
- call_click
- direction_click
- offer_claim
- offer_redeem
- review_submit
- claim_profile_click
- claim_profile_submit
- start_chat
- ai_lead_generated
- center_signup_start
- center_signup_submit
- proposal_view
- payment_receipt_upload

## Non-Negotiable Rule
If a feature cannot be tracked, reported, or tied to patient/center value, it must not be treated as a growth feature.
