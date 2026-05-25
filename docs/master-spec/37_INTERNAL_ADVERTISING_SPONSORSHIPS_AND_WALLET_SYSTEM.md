# 37_INTERNAL_ADVERTISING_SPONSORSHIPS_AND_WALLET_SYSTEM.md

# DrMuscat Internal Advertising, Sponsored Placements, Wallet, CPC/CPM and Banner System

This file is canonical for all DrMuscat paid visibility and internal advertising features.
Claude Code must not invent ad products, billing rules, placement logic, pricing, tracking behavior, or medical ad policy outside this file.

## 1. Product Positioning

DrMuscat must support internal advertising as a controlled healthcare visibility product for centers, clinics, pharmacies, labs, hospitals, wellness providers, and approved healthcare-adjacent partners.

The advertising system is not a generic open ad network.
It is a curated, compliant, admin-approved sponsored placement system inside DrMuscat.

The advertising promise to centers:

- more visibility inside relevant DrMuscat pages
- measurable impressions, clicks, WhatsApp clicks, call clicks, direction clicks, offer claims, and appointment/request actions
- flexible promotion by page, area, category, service, keyword, and audience intent
- wallet-based prepaid budget control
- admin-approved creatives and medical claim safety

DrMuscat must never promise guaranteed patients, guaranteed medical outcomes, guaranteed ranking in Google, or guaranteed treatment conversions.

## 2. Required Ad Monetization Models

DrMuscat must support these monetization models:

### 2.1 Flat Placement Sponsorship

A center pays a fixed amount for a specific placement and date range.

Examples:

- homepage hero banner for 7 days
- homepage featured clinic carousel for 30 days
- category top slot for 30 days
- area page sponsor for 30 days
- newsletter/WhatsApp campaign sponsor, if enabled later

Use this for premium centers that want predictable visibility.

### 2.2 CPC — Cost Per Click

A center funds a wallet and pays per tracked click.

Billable click types may include:

- ad click to center profile
- WhatsApp click
- call click
- direction click
- offer claim click
- appointment request click

CPC must support placement-specific minimum bid and maximum bid.

### 2.3 CPM — Cost Per 1,000 Impressions

A center pays for impressions.

CPM must be optional and disabled by default for MVP unless admin enables it.
Impressions must be counted only when the ad is actually viewable enough to be counted by the frontend event rules.

### 2.4 CPA / Lead Fee — Future Only

Cost-per-lead may be supported in a future phase, but must not be enabled in MVP unless explicitly approved.
Healthcare lead billing has compliance and attribution risk.

### 2.5 Sponsored Boost Inside Organic Lists

Paid boosts may influence internal DrMuscat visibility, but must be clearly labeled as sponsored.
Sponsored results must not be mixed deceptively with organic recommendations.

## 3. Ad Inventory and Placement Types

Every ad placement must be defined by admin and stored in the database.
Each placement has its own pricing, allowed creative types, targeting capabilities, page context, and display rules.

Required placement types:

### 3.1 Homepage Placements

- homepage hero sponsor
- homepage top banner
- homepage featured centers carousel
- homepage category sponsor block
- homepage offer highlight block

### 3.2 Directory and Search Placements

- top of search results
- between organic result cards
- right/secondary rail on desktop only
- mobile sticky sponsored card, if enabled by admin
- promoted center card within results

### 3.3 Category Page Placements

Examples:

- Dental clinics page sponsor
- Dermatology page sponsor
- Pharmacies page sponsor
- Labs page sponsor
- Physiotherapy page sponsor

### 3.4 Area Page Placements

Examples:

- Al Khuwair dental sponsor
- Bousher dermatology sponsor
- Seeb pharmacy sponsor
- Ruwi lab sponsor

### 3.5 Service Page Placements

Examples:

- teeth whitening in Muscat
- laser hair removal in Bousher
- blood test in Seeb
- dental implant in Al Khuwair

### 3.6 Center Profile Cross-Promotion Rules

A center must not place an ad directly on a competitor center's profile page unless admin explicitly enables a safe marketplace placement.
Default rule: competitor ads on individual center profile pages are disabled.

Allowed alternatives:

- generic category ads below related centers
- non-competitor healthcare-adjacent ads if approved
- DrMuscat own CTA modules

### 3.7 AI Chat Sponsored Suggestions

AI chat may show sponsored suggestions only if:

- the suggestion is relevant to the user's area/service intent
- it is clearly labeled as Sponsored
- it does not claim medical superiority
- organic options are still available
- AI never says a sponsored center is medically better because it paid

MVP recommendation: log the structure but keep AI chat sponsorship disabled until core AI safety is stable.

## 4. Targeting Rules

Ad campaigns must support safe targeting by:

- placement
- center category
- service category
- area/city
- language/locale
- device type
- page type
- keyword/search intent
- day/time schedule
- start and end date
- budget
- maximum daily spend
- maximum total spend

Ad targeting must not use sensitive health inference beyond the user's explicit page/search context.
For example, showing a dental clinic ad on a dental page is allowed.
Building sensitive hidden profiles about user health conditions is not allowed.

## 5. Pricing Architecture

Pricing must be admin-configurable per placement.
Do not hard-code prices in UI components.

Each placement must support:

- base flat price
- minimum CPC
- suggested CPC
- minimum CPM
- suggested CPM
- allowed billing models
- minimum budget
- maximum active campaigns per placement
- priority rules
- rotation rules
- availability calendar

Example pricing records, not final business prices:

| Placement | Suggested billing | Example price logic |
|---|---|---|
| Homepage hero | Flat | highest fixed weekly/monthly sponsorship |
| Homepage featured carousel | Flat or CPC | medium-high |
| Category top sponsor | Flat or CPC | depends on category demand |
| Area + category page | Flat or CPC | medium |
| Service page sponsor | CPC | high intent |
| Search promoted result | CPC | high intent |
| Offer highlight | CPC or flat | campaign based |

All prices must be changeable from admin panel.

## 6. Wallet and Prepaid Balance

Centers must be able to fund an advertising wallet.

Wallet rules:

- wallet is prepaid
- no campaign can spend more than available wallet balance unless admin grants manual credit
- wallet debits must be ledgered
- every billable event must have an idempotency key
- refunds/adjustments must be admin-only and audited
- low balance alerts must be supported
- auto-pause campaign when balance is insufficient

Required wallet actions:

- top-up requested
- top-up approved manually
- top-up rejected
- debit for CPC click
- debit for CPM impression batch
- debit for flat sponsorship booking
- refund
- adjustment
- expired credit, if admin enables expiry later

MVP payment method may be manual bank transfer / manual admin approval.
Online card payments are future unless explicitly approved.

## 7. Campaign Lifecycle

Campaign statuses:

- draft
- pending_review
- approved
- scheduled
- active
- paused
- exhausted_budget
- completed
- rejected
- cancelled
- archived

Creative statuses:

- draft
- pending_review
- approved
- rejected
- archived

Placement booking statuses:

- requested
- pending_payment
- confirmed
- active
- completed
- cancelled
- rejected

Campaign flow:

1. center creates campaign or admin creates campaign for center
2. center selects placement, target, dates, budget, bidding model
3. center uploads/chooses creative
4. system estimates reach/cost range, if data exists
5. center submits for review
6. admin reviews content, claims, image, targeting, budget, and medical compliance
7. admin approves or rejects with reason
8. campaign runs only when approved and funded
9. campaign auto-pauses on budget exhaustion, date end, policy hold, or admin action
10. center sees reports

## 8. Ad Creative Requirements

Creative types:

- image banner
- promoted center card
- offer card
- text CTA block
- carousel, future optional
- video creative, future optional

Required creative fields:

- headline
- subheadline
- CTA label
- target URL or action
- image/media asset
- language
- disclaimer, if needed
- linked center
- linked offer, optional
- linked service/category/area, optional

Image rules:

- originals are never served directly
- use optimized derivatives from media pipeline
- preserve quality while reducing size
- enforce aspect ratios per placement
- reject blurry, misleading, over-compressed, or medically risky visuals

## 9. Medical Advertising Policy

All ads must follow DrMuscat medical claim guardrails.

Ads must not include:

- guaranteed cure
- guaranteed results
- misleading before/after claims
- "best doctor" or "number one" claims unless legally verifiable and approved
- emergency care promises unless the center is verified for emergency service
- fake urgency
- fake discounts
- unapproved prescription drug promotion
- patient data or identifiable patient images without proper consent
- offensive or discriminatory content
- unsafe health advice

Allowed ad positioning:

- discover clinic
- book/contact through WhatsApp
- limited-time patient benefit, if real and approved
- verified profile visibility
- service availability
- location and hours
- introductory consultation, if center confirms terms

Every rejected ad must store rejection reason.

## 10. Sponsored Labeling and User Trust

All paid placements must be visibly labeled:

- Sponsored
- إعلان ممول

The label must appear in both English and Arabic interfaces.

Sponsored content must not visually impersonate organic ranking.
Organic results and sponsored results may share card design, but sponsored cards must include clear label and tracking.

## 11. Reporting for Centers

Campaign reporting must include:

- impressions
- viewable impressions, if implemented
- clicks
- CTR
- CPC spend
- CPM spend
- flat sponsorship spend
- WhatsApp clicks
- call clicks
- direction clicks
- offer claims
- appointment/request actions
- AI chat assisted leads, if enabled
- spend by day
- budget remaining
- top placement performance
- top area/category/service performance

Reports must be available in:

- center dashboard
- admin dashboard
- monthly PDF/visibility report
- export CSV, future optional

## 12. Admin Advertising Console

Admin panel must include:

### 12.1 Ad Placements

- create/edit placements
- placement key
- page type
- allowed billing models
- allowed creative formats
- prices
- availability
- max active campaigns
- rotation rules
- active/inactive

### 12.2 Campaign Management

- list campaigns
- filter by center/status/placement/date/budget
- approve/reject/pause/resume/cancel
- view campaign performance
- view wallet balance
- add admin note
- audit log all actions

### 12.3 Creative Review

- preview creative in desktop/mobile/RTL
- approve/reject creative
- check medical claim risk
- request edits
- view linked center/offer/service

### 12.4 Wallet and Payments

- view center wallet
- approve top-up
- reject top-up
- create adjustment
- refund credit
- view ledger
- export transactions, future optional

### 12.5 Pricing Controls

- set default placement pricing
- override center-specific pricing
- promotional credits
- free trial ad credit, optional admin-only
- minimum wallet top-up

## 13. Anti-Fraud and Event Quality

Ad event tracking must protect against fake clicks and accidental double billing.

Required safeguards:

- idempotency key per billable event
- rate limit repeated clicks from same anonymous session/user/IP/device window
- do not bill repeated clicks within configured cooldown
- bot/user-agent filtering where practical
- server-side validation for billable clicks
- suspicious activity flags
- admin refund/adjustment workflow
- campaign spend cap enforcement server-side

Billable click cooldown default:

- same campaign + same placement + same action + same anonymous session within 30 minutes should not be billed twice

This default may be admin-configurable later.

## 14. Database Tables Required

The canonical DDL must include these tables:

- ad_placements
- ad_campaigns
- ad_creatives
- ad_wallets
- ad_wallet_transactions
- ad_events
- ad_placement_bookings
- ad_pricing_rules

Do not implement ads without these tables or a clearly approved equivalent schema.

## 15. Routes Required

Public/internal routes:

- sponsored modules rendered inside relevant public pages
- `/[locale]/for-clinics/advertise`
- `/[locale]/for-clinics/advertising-options`

Center dashboard routes:

- `/[locale]/dashboard/ads`
- `/[locale]/dashboard/ads/new`
- `/[locale]/dashboard/ads/[campaignId]`
- `/[locale]/dashboard/ads/wallet`
- `/[locale]/dashboard/ads/reports`

Admin routes:

- `/[locale]/admin/ads`
- `/[locale]/admin/ads/placements`
- `/[locale]/admin/ads/campaigns`
- `/[locale]/admin/ads/creatives`
- `/[locale]/admin/ads/wallets`
- `/[locale]/admin/ads/pricing`
- `/[locale]/admin/ads/events`

API route families:

- `/api/ads/impression`
- `/api/ads/click`
- `/api/ads/campaigns`
- `/api/ads/wallet/topup-request`
- `/api/admin/ads/*`

## 16. Analytics Event Names

Use these canonical event names:

- `ad_impression`
- `ad_viewable_impression`
- `ad_click`
- `ad_whatsapp_click`
- `ad_call_click`
- `ad_direction_click`
- `ad_offer_claim`
- `ad_campaign_created`
- `ad_campaign_submitted`
- `ad_campaign_approved`
- `ad_campaign_rejected`
- `ad_campaign_paused`
- `ad_budget_exhausted`
- `ad_wallet_topup_requested`
- `ad_wallet_topup_approved`
- `ad_wallet_debit`
- `ad_wallet_refund`

## 17. MVP Scope Recommendation

For MVP, implement advertising in this order:

### MVP Ads Phase A

- admin-defined placements
- flat sponsorship booking
- manual payment approval
- sponsored cards/banners
- admin approval
- basic impressions/clicks
- monthly report integration

### MVP Ads Phase B

- wallet top-up
- CPC campaigns
- budget caps
- anti-duplicate click billing
- center self-serve campaign creation

### MVP Ads Phase C

- CPM
- AI chat sponsored suggestions
- advanced bidding
- automated recommendations
- CSV exports

Claude Code must not build all ad phases at once unless explicitly instructed.

## 18. Non-Negotiable Rules

1. No ad goes live without admin approval.
2. No unapproved medical claim is allowed in ads.
3. No hidden paid ranking.
4. Every sponsored item must be labeled.
5. No ad spend without wallet/ledger record or confirmed flat booking.
6. No direct serving of original uploaded ad images.
7. No competitor ads on center profile pages by default.
8. No billing without idempotency and anti-fraud rules.
9. No hard-coded placement pricing.
10. No medical diagnosis or treatment recommendation through ads or AI sponsorship.


## V10 Database Completion Note

This advertising system depends on `05d_AD_SYSTEM_DDL_SUPPLEMENT_V10.md`. Claude Code must not treat the old three-table ad model as sufficient. Wallets, wallet transactions, creatives, pricing rules, placement bookings, budget fields, idempotency keys and billable event fields are mandatory before Phase 15B.
