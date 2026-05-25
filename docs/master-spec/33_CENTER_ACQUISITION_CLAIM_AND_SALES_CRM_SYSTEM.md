# 33_CENTER_ACQUISITION_CLAIM_AND_SALES_CRM_SYSTEM.md

# Center Acquisition, Claim Profile and Sales CRM System

## Purpose
This file defines the system that converts free seeded listings into claimed, verified and paid center relationships.

Claude Code must treat unclaimed profiles as acquisition assets, not just content records.

## Acquisition Funnel
```text
Seed public listing
-> public SEO/profile traffic
-> Claim this profile CTA
-> claim request
-> admin verification
-> center onboarding wizard
-> profile completeness score
-> upgrade offer
-> paid plan
-> analytics/report retention
```

## Claim Profile CTA
Every unclaimed center/organization profile must show:
- Own this center?
- Claim this profile
- Suggest an edit
- Report wrong information
- Request removal

Claim CTA must appear on:
- profile header
- sticky mobile action area
- admin sales preview
- footer trust block

## Claim Profile Flow
Required steps:
1. requester name
2. requester role/position
3. work phone
4. work email
5. center/organization selection
6. license/trade/MOH verification document upload, if required
7. OTP/email verification, when provider is configured
8. admin review
9. approval/rejection notification
10. workspace/member creation
11. onboarding wizard start

## Claim Statuses
Use approval status where possible:
- pending
- approved
- rejected

Additional operational states may be stored in metadata:
- needs_more_info
- duplicate_claim
- suspected_impersonation

Claude Code must not allow automatic full admin access to a center before approval.

## Verification Levels
Public display levels:
1. Public Listing
2. Claimed Profile
3. Verified Center
4. DrMuscat Partner
5. Featured Partner

Definitions:
- Public Listing: public/unclaimed data only.
- Claimed Profile: a representative has claimed access.
- Verified Center: identity/contact/license-related information reviewed.
- DrMuscat Partner: paid or approved partner relationship.
- Featured Partner: paid/promotional placement.

`Verified` must not mean clinical quality guarantee.

## Center Onboarding Wizard
After claim approval, center users must be guided through:
1. basic info
2. branch/location info
3. services
4. doctors/staff profiles where applicable
5. photos/media
6. WhatsApp/call/contact settings
7. working hours/Ramadan hours
8. insurance/languages
9. offers/campaigns
10. review policy acknowledgement
11. submit for verification/publishing

## Profile Completeness Score
Every center should have a visible completeness score.

Suggested scoring:
- logo: 5
- hero image: 10
- working hours: 10
- Arabic description: 10
- English description: 10
- services: 15
- doctors/staff: 10
- gallery photos: 10
- WhatsApp/call/contact: 10
- location/map: 10

Profiles above 80% completion may receive better internal visibility. This must be clearly described in admin/internal docs.

## Center Visibility Scorecard
Sales/admin must have a scorecard page for each center:
```text
Digital Visibility Score: 42/100
Missing:
- no Arabic SEO page
- no structured services
- no verified badge
- no photos
- no offers
- no reviews
- no WhatsApp tracking
```

The scorecard must help sales show before/after upgrade value.

## Sales Presentation Mode
Admin must support a sales presentation view:
```text
/admin/sales/center-pitch/[centerId]
```

Required sections:
- current public profile preview
- visibility score
- missing items
- upgrade preview
- recommended plan
- price proposal
- QR code for claim/profile
- next steps

## Sales CRM
Admin must include a lightweight CRM for centers.

Required deal statuses:
- new
- listed
- contacted
- meeting_booked
- proposal_sent
- trial
- paid
- rejected
- follow_up
- lost

Required fields:
- center_id
- assigned sales owner
- next follow-up date
- notes
- objection reason
- package offered
- amount
- contract status
- payment status
- last contacted date

## Proposal Generator
Admin must be able to generate a proposal for a center with:
- center name
- recommended plan
- 6-month price
- annual price
- included features
- terms
- bank transfer/payment instructions
- validity date
- sales rep contact

MVP may generate HTML/PDF later, but the data model and admin workflow must exist.

## Agreement/Contract Tracking
For paid centers, admin must track:
- agreement status
- signed file upload
- start date
- end date
- renewal reminder
- cancellation terms
- offer/review/content responsibility acknowledgement

## Referral System for Centers
Partner centers may refer another center.

Suggested benefit:
- one month featured placement
- or a defined account credit

Referral rewards must be admin-approved and auditable.

## QR Kit
Each center should have QR assets for:
- profile URL
- leave review
- claim offer
- WhatsApp contact

QR generation may be implemented after MVP, but routes/URLs should be stable from the beginning.

## Non-Negotiable Rule
If a center cannot claim, verify, complete, upgrade, track value, and receive reports, DrMuscat is not ready for scalable B2B sales.
