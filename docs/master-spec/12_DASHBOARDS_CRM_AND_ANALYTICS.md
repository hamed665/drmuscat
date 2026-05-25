# 12_DASHBOARDS_CRM_AND_ANALYTICS.md

# Dashboards, CRM and Analytics

Dashboards must prove value without fake data.

Center dashboard: subscription, profile status, views, WhatsApp/call/direction clicks, leads, Offers, media, billing, profile editor.

CRM statuses: new_lead, contacted, booked, visited, won, lost, no_answer, follow_up.

CRM fields: assigned_to_profile_id, next_follow_up_at, lost_reason, won_at, last_contacted_at.

Filters: overdue, today, no-answer, source, language, assigned, status.

KPI formulas must be division-safe.

Admin dashboard includes approvals, users, centers, doctors, media, payments, subscriptions, ads, settings, audit logs.

## V10 Center Dashboard Additions
Center dashboard must show:
- profile completeness score
- visibility scorecard
- profile views
- WhatsApp clicks
- call clicks
- direction clicks
- offer claims
- offer redemptions
- review count and rating trend
- sub-rating breakdown
- top viewed services
- top searched source/area/service
- monthly report download

## V10 Admin CRM Additions
Admin CRM must track:
- new/listed/contacted/meeting_booked/proposal_sent/trial/paid/rejected/follow_up/lost
- sales owner
- next follow-up
- notes
- objections
- proposed package
- proposal status
- contract status
- payment status

## V10 Analytics Events
Use canonical event names from `34_GROWTH_ANALYTICS_ATTRIBUTION_AND_REPORTING.md`. Do not invent alternate event names.

## V10 Reporting Rule
A paid/claimed center must be able to see measurable value every month. A subscription product without reporting is incomplete.


## Advertising Dashboard Requirements

Center dashboard must include an Ads section with campaign list, campaign performance, wallet balance, top-up requests, budget remaining, impressions, clicks, CTR, spend, WhatsApp/call/direction actions, offer claims, and placement performance.

Admin dashboard must include ad placement management, campaign approval, creative approval, wallet/top-up review, pricing management, ad event inspection, suspicious click flags, refunds/adjustments, and audit logs.

Monthly reports must include ad performance when a center has active sponsored placements or campaigns.
