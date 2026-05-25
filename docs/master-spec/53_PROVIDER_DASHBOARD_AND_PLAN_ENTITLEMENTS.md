# 53_PROVIDER_DASHBOARD_AND_PLAN_ENTITLEMENTS.md

# DrMuscat V10.3 — Provider Dashboard and Plan Entitlements

## 1. Purpose
Provider dashboard must support business operations, profile management, lead visibility, and paid plan value. It must not let providers manipulate trust, SEO, or sponsored visibility without review.

## 2. Provider Workspaces
Workspace types:
- `center_workspace`
- `doctor_workspace`
- `organization_workspace`

A provider may belong to multiple workspaces.

## 3. Provider Dashboard Modules
Required modules:
- Overview.
- Profile completeness.
- Edit profile.
- Locations/branches.
- Doctors/staff.
- Services/prices.
- Working hours.
- Media gallery.
- Insurance.
- Offers.
- Appointment requests.
- Reviews and replies.
- Click analytics.
- Leads.
- Reports.
- Billing/plan.
- Support.

## 4. Plan Levels
Canonical provider plans:
- Free Listing.
- Verified Starter.
- Growth Partner.
- Premium / Ads Pro.

## 5. Entitlement Matrix

### Free Listing
- Basic profile.
- Public listing if approved.
- Claim request.
- Limited profile edits.
- Basic contact buttons.
- No sponsored slots.
- No advanced analytics.

### Verified Starter
- Verification badge if approved.
- More media slots.
- Services/prices management.
- Basic monthly report.
- Review replies.
- Profile completeness guidance.

### Growth Partner
- Offers.
- Enhanced analytics.
- More doctor/location management.
- Lead insights.
- Priority content review.
- Basic sponsored eligibility.

### Premium / Ads Pro
- Sponsored slot campaigns.
- Advanced analytics.
- Premium report.
- Sales/growth recommendations.
- More media/offers limits.
- Ads tools where enabled.

## 6. Entitlement Enforcement
Create or confirm:
- `plan_entitlements`
- `workspace_plan_assignments`
- `feature_usage_limits`
- `usage_counters`

All feature gates must be enforced server-side, not only hidden in UI.

## 7. Provider Edit Governance
Provider edits must be classified:

### Safe Auto-Publish
- Description changes within allowed rules.
- Working hours.
- Services/prices.
- Photos if moderation rules pass.

### Requires Admin Review
- Name changes.
- License claims.
- Verification badge.
- Specialty changes.
- Before/after media.
- Insurance verification.
- Sponsored status.

## 8. Profile Completeness Score
Calculate based on:
- English and Arabic names.
- Description.
- Photos.
- Logo/profile image.
- Phone/WhatsApp/maps.
- Services.
- Working hours.
- Doctors linked.
- Insurance/payment acceptance.
- Verification documents.

Expose score to provider; expose only safe badges publicly.

## 9. Provider Analytics
Provider can see:
- Profile views.
- WhatsApp clicks.
- Phone clicks.
- Directions clicks.
- Appointment requests.
- Offer claims.
- Search appearances when available.

Provider cannot see:
- Individual anonymous user identities.
- Competitor private data.
- Admin notes.

## 10. Upgrade Nudges
Upgrade nudges must follow anti-annoyance rules:
- No blocking profile management.
- No deceptive ranking promises.
- Clearly explain benefits.
- Sponsored visibility must be labeled.
