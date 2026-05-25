# 38_SEO_FIRST_BUSINESS_MODEL_AND_ACCESS_REVISION_V10_1.md

# DrMuscat V10.1 — SEO-First, Language, Card Cancellation, Provider Plans, and User Access Revision

## 1. Purpose
This file captures the latest product decisions and overrides older V10 wording where conflicts exist. It must be treated as a canonical implementation rule.

## 2. SEO Must Be Built Into The System From Day One
DrMuscat must not launch as a plain directory and add SEO later. The first public build must include:
- server-rendered public pages
- localized metadata
- canonical URLs
- English/Arabic hreflang
- sitemap and robots
- schema.org JSON-LD
- index/noindex controls
- noindex guardrails for thin pages
- SEO matrix support
- admin SEO settings shell
- keyword mapping fields
- route architecture for money pages and long-tail pages

## 3. Keyword Workbook Summary
The uploaded workbook `drmuscat-keywords-full.xlsx` is the initial SEO planning source.

Workbook summary:
- 792 total keywords
- 396 English keywords
- 396 Arabic keywords
- 570 commercial intent keywords
- 172 transactional intent keywords
- 50 informational intent keywords

Top clusters:
- Dental: 180
- Aesthetic: 96
- Skin: 52
- Lab: 34
- Imaging: 34
- Nutrition: 28
- Fitness: 28
- Women: 24
- Insurance: 22
- Skincare: 18

Tier strategy:
- Tier 1 Money pages: highest commercial category/city pages
- Tier 2 Programmatic pages: category × area pages
- Tier 3 Cost pages: price/cost articles and landing pages
- Tier 4 Symptom pages: safe informational pages with medical disclaimers
- Tier 5 Drug pages: pharmacy/drug informational pages with strict disclaimers
- Tier 6 Lab/Imaging pages
- Tier 7 Wellness pages
- Tier 8 Devices pages
- Tier 9 Insurance pages
- Tier 10 Local pages

## 4. Launch Languages
Launch public site languages are exactly:
- English: `/en`, LTR
- Arabic for Oman: `/ar`, RTL

Arabic guidelines:
- SEO pages use clear professional Arabic.
- Omani/local Arabic may be used in CTAs, ads, WhatsApp copy, social copy and trust elements.
- Do not make SEO content so dialect-heavy that search clarity is harmed.

Not supported in MVP:
- Persian/Farsi `/fa`
- Hindi `/hi`

No Persian or Hindi sitemap entries, hreflang entries, routes, public dictionaries, UI language switcher items, SEO pages, microsite languages or public generated pages in launch.

## 5. Card Sales Cancelled
The product must not sell a user card. Do not implement:
- Health Card sales
- paid user membership card
- card number generation
- card checkout
- card pricing
- user card landing page
- card-required discounts

Replace card concept with public/patient offers:
- approved provider offers
- visible public offer terms
- optional claim code
- optional login for anti-abuse and history
- redemption tracking

Offers must not require a paid user card.

## 6. Provider Registration Plans
Centers and doctors must be able to register under four plan levels.

### Plan 1 — Free Listing
Purpose: fill platform, support SEO, allow providers to claim basic presence.
Includes:
- public profile
- basic info
- claim request
- suggest edit/report wrong info
- WhatsApp/call/direction if available
- limited media
- no verified badge unless separately approved
- no partner language

### Plan 2 — Verified Starter
Includes:
- verification review
- verified badge
- richer profile
- logo/cover/gallery
- services and working hours
- basic analytics
- ability to respond to reviews where enabled

### Plan 3 — Growth Partner
Includes:
- advanced profile
- public offers
- more media
- review management
- advanced analytics
- monthly visibility report
- category/area visibility add-ons

### Plan 4 — Premium / Ads Pro
Includes:
- premium presentation
- featured placements
- ads wallet/CPC eligibility
- priority sponsored options
- advanced reporting
- campaign support
- QR kit and sales material

Paid plans must not imply medical superiority or guaranteed ranking. Sponsored placements must be labeled.

## 7. User Registration
Public users register for free. Registration must not be monetized in MVP.

Anonymous users can:
- browse centers
- browse doctors
- search and filter
- view public offers
- view public reviews
- click WhatsApp
- call
- open directions
- read articles

Registration nudges should appear, but must be soft and dismissible.

Login may be required only for identity/anti-abuse/personalization actions:
- submit review
- save favorites across devices
- claim an offer code
- receive reminders
- personalized alerts
- manage account history

## 8. SEO Implementation Acceptance Criteria
Before a public launch build is accepted, it must include:
- `/en` and `/ar` homepage metadata
- `/en/centers` and `/ar/centers` metadata
- center profile metadata
- category/area route architecture
- service page route architecture
- sitemap route
- robots route
- canonical helper
- hreflang helper with en/ar only
- JSON-LD helper
- noindex helper
- page quality threshold function
- SEO admin settings shell

## 9. Conflict Rule
If older V10 files mention Persian, Farsi, Hindi launch support, Health Card, paid user card, card signup, card membership, card numbers, or mandatory login to browse public provider pages, this file overrides them.
