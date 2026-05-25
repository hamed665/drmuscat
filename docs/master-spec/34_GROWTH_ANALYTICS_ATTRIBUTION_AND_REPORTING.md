# 34_GROWTH_ANALYTICS_ATTRIBUTION_AND_REPORTING.md

# Growth Analytics, Attribution and Reporting

## Purpose
DrMuscat must prove value to centers through measurable actions, not vague visibility claims.

Required measurable actions:
- profile view
- WhatsApp click
- call click
- direction click
- offer claim
- offer redemption
- appointment/request inquiry
- review submitted
- AI lead generated
- claim profile click/submit

## Attribution Inputs
Track where possible:
- UTM source
- UTM medium
- UTM campaign
- UTM content
- UTM term
- referrer
- landing page
- session id hash
- anonymous user id hash
- locale
- device class
- ad platform where passed

Do not store unnecessary personal data. Hash IP/user-agent when needed for abuse and analytics.

## Required Events
Canonical event names:
```text
page_view
profile_view
search_performed
whatsapp_click
call_click
direction_click
offer_claim
offer_redeem
review_submit
review_helpful_vote
claim_profile_click
claim_profile_submit
start_chat
ai_lead_generated
center_signup_start
center_signup_submit
proposal_view
payment_receipt_upload
```

## Center Analytics Dashboard
Center panel must show:
- profile views
- WhatsApp clicks
- call clicks
- direction clicks
- offer claims
- offer redemptions
- review count
- rating trend
- top viewed services
- top searched area/service
- traffic sources
- conversion rate
- month-over-month comparison

MVP can start with simple cards and tables, but the event model must support future charts.

## Monthly Report
Each paid/claimed center must be able to receive or download a monthly visibility report.

Required report fields:
```text
Center name
Month
Profile views
WhatsApp clicks
Call clicks
Direction clicks
Offer claims
Offer redemptions
New reviews
Average rating
Top service
Top source
Recommended next action
```

Report delivery targets:
- PDF download
- admin view
- center panel view
- WhatsApp/email share later

## Offer Claim and Redemption Tracking
Every approved offer must support claim tracking.

Claim code format example:
```text
DRM-ABC-4821
```

Offer claim statuses:
- claimed
- redeemed
- expired
- cancelled
- invalid

Centers may mark redemption only for their own offers. Admin can override with audit log.

## WhatsApp Attribution
Prefilled WhatsApp messages must include attribution when appropriate:
- center name
- service
- offer code
- DrMuscat source text

Clicks must be logged before redirect.

## AI Chat Lead Tracking
AI chat must create a lead/action log when:
- user requests center recommendations
- user clicks a center from AI answer
- user clicks WhatsApp/call/direction from AI answer
- user asks for offer details
- user starts claim flow as center representative

## External Analytics
The app must support, behind environment flags/settings:
- GA4
- Google Tag Manager
- Meta Pixel
- Meta Conversion API later
- server-side event logging

No external tracking script should break rendering if env vars are missing.

## Privacy Rules
- Do not expose private lead details publicly.
- Do not show raw IP to centers.
- Do not expose patient identity unless user explicitly submitted a lead/contact form and consented.
- Analytics must be aggregated for center dashboards unless lead capture consent exists.

## Admin Analytics
Admin must see:
- total listings
- claimed profiles
- verified centers
- paid centers
- MRR/6-month revenue/annual revenue
- top categories
- top areas
- highest converting pages
- ad campaign performance
- sales pipeline value
- review moderation backlog
- AI chat usage

## Non-Negotiable Rule
A center should never need to guess whether DrMuscat created value. The platform must show measurable actions every month.


## Advertising Attribution Events

Canonical ad events:

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

Ad attribution must connect campaign, placement, creative, center, billing model, source page, locale, device, anonymous session, and downstream patient action where privacy allows.
