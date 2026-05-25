# 44 — Behavioral Analytics, Events and Funnels V10.2

Behavior analytics is the learning system of DrMuscat. It must be privacy-first and structured.

## Week-One Event Tracking

Required events:

```text
page_viewed
search_performed
filter_applied
profile_viewed
whatsapp_clicked
phone_clicked
directions_clicked
offer_clicked
offer_claimed
claim_started
claim_submitted
signup_started
signup_completed
form_error
```

## Event Rules

- Use anonymous session id until signup.
- Respect cookie consent for analytics/marketing categories.
- Do not log raw phone numbers, emails, payment details, passwords, unpublished review text, or sensitive medical details.
- Hash or summarize identifiers where possible.

## Funnels

Initial funnels:

- Search -> Profile View -> WhatsApp Click
- Profile View -> Claim Offer
- Center Owner Signup -> Claim Submitted -> Approved -> Upgraded
- Free Listing -> Verified Upgrade

## Later Analytics

Phase 2:

- funnel dashboard
- cohort retention
- center analytics dashboard
- upgrade nudge conversion

Phase 3:

- anomaly detection
- rage click detection
- PostHog/session replay if privacy approved

## Admin Insights

Admin behavior dashboard should summarize:

- top pages
- top searches
- zero-result searches
- top conversion paths
- traffic by source
- suspicious spikes
- payment failure spikes
- ad budget anomalies
