# 60_ACCEPTANCE_CRITERIA_PER_PANEL.md

# DrMuscat V10.3 — Acceptance Criteria Per Panel and System Area

## 1. Purpose
This file defines what "done" means. Without acceptance criteria, humans start calling half-finished screens "MVP" and then act shocked when users behave like users.

## 2. Public Website Acceptance
Must pass:
- `/en/om` and `/ar/om` work.
- Public discovery works without login.
- Center listing works.
- Center profile works.
- Doctor listing works.
- Doctor profile works.
- Specialty/area pages use canonical `/[locale]/om` routes.
- WhatsApp/phone/directions buttons work.
- No Health Card/card-sales UI exists.
- No Persian/Hindi launch routes exist.
- Arabic RTL is correct.
- English LTR is correct.
- Metadata/canonical/hreflang are correct.
- Sitemap contains only approved public pages.

## 3. Admin Panel Acceptance
Must pass:
- Non-admin blocked from `/admin`.
- Super admin can manage centers, doctors, geo, taxonomy, claims, SEO, redirects, imports, billing, support, settings.
- Sensitive actions write audit log.
- Admin can noindex/publish SEO pages.
- Admin can create redirects.
- Admin can approve/reject claims.
- Admin can review provider-submitted edits.
- Admin can review duplicate candidates.

## 4. Provider Dashboard Acceptance
Must pass:
- Provider sees only owned workspace.
- Provider can update allowed profile fields.
- Provider cannot change verification badge.
- Provider cannot change organic ranking.
- Provider cannot access billing of other providers.
- Provider can see basic analytics for owned profiles.
- Provider can submit support tickets.

## 5. Doctor Panel Acceptance
Must pass:
- Doctor profile edit works for owned/linked doctor.
- Practice locations can be displayed.
- License/verification fields require admin review.
- Doctor can manage bio, education, experience subject to moderation rules.

## 6. Sales Panel Acceptance
Must pass:
- Sales user can manage leads and follow-ups.
- Sales user cannot approve payments unless finance permission exists.
- Sales user cannot alter SEO canonical/indexing.
- Sales activity is logged.

## 7. Finance Panel Acceptance
Must pass:
- Finance can view subscriptions and manual receipts.
- Finance can approve/reject manual payment.
- Finance cannot alter public medical profile content unless additional role exists.
- Payment actions are audited.

## 8. SEO System Acceptance
Must pass:
- No duplicate canonicals for same entity/locale.
- No thin page indexed by default.
- Redirect loops blocked.
- Slug changes create redirects.
- FAQ/schema never expose private data.
- Review schema only uses approved compliant reviews.

## 9. Database/RLS Acceptance
Must pass:
- RLS enabled on sensitive tables.
- Anonymous cannot read private forms.
- Provider cannot read other provider's private data.
- Public queries return only published/indexable data.
- Service role use limited to server-only paths.

## 10. Production Acceptance
Must pass:
- Build passes.
- Typecheck passes.
- Lint passes.
- Migration validation passes.
- Basic seed data loads.
- Public pages load fast on mobile.
- No private env keys exposed.
- Backups/recovery documented.
