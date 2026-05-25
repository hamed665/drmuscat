# 16_QA_TESTING_RESPONSIVE_AND_LAUNCH_CHECKLIST.md

# DrMuscat V10.3 — QA, Testing, Responsive, and Launch Checklist

## 1. Purpose
This file defines the minimum QA gates for DrMuscat before any phase is considered complete. It must be used by Codex, the reviewer, and the human operator before merging or deploying.

No phase is complete because code exists. Code existing is not an achievement; mold exists too.

---

## 2. Required Test Layers

### 2.1 Static checks
Every implementation phase must pass:

```text
npm run lint
npm run typecheck
npm run build
```

If the repo uses pnpm, replace npm with pnpm consistently.

### 2.2 Unit tests
Required for:
- route helper functions.
- locale/country validation.
- slug generation.
- phone normalization.
- URL canonical builder.
- permission checks.
- entitlement checks.
- UTF-8/medical claim guardrails.
- SEO indexability gate.

### 2.3 Integration tests
Required for:
- Supabase read/write access.
- RLS policies.
- claim request flow.
- admin approval flow.
- provider ownership editing.
- receipt upload private access.
- redirect resolution.
- import preview/validation.

### 2.4 End-to-end smoke tests
Required for:

```text
/en/om
/ar/om
/en/om/centers
/ar/om/centers
/en/om/doctors
/ar/om/doctors
center profile
doctor profile
claim form
admin login
provider dashboard after claim approval
```

---

## 3. Responsive QA Matrix

Test public pages on:

```text
375x812 mobile
390x844 mobile
430x932 mobile
768x1024 tablet
1024x768 tablet landscape
1366x768 laptop
1440x900 desktop
```

### Required checks
- Header does not wrap badly.
- Filter drawer works on mobile.
- Arabic cards align correctly.
- CTA buttons fit.
- Phone/WhatsApp/directions buttons are tappable.
- Sponsored label visible.
- Skeletons do not shift layout.
- Tables in admin have horizontal handling.

---

## 4. Browser QA

Minimum:

```text
Chrome latest
Safari iOS current
Chrome Android current
Edge latest
```

Do not block MVP on obscure browsers, but do not ship broken mobile Safari. It exists specifically to punish lazy frontend decisions.

---

## 5. SEO QA Checklist

For each public SEO page type:

```text
- correct status code
- unique title
- unique meta description
- canonical URL
- hreflang en/ar pair
- no fa/hi launch route
- no deprecated route generated
- noindex for thin pages
- sitemap inclusion only when indexable
- robots.txt allows intended public pages
- structured data valid
- breadcrumb present
- internal links present
- no private data exposed
```

### Page types

```text
homepage
centers listing
center profile
doctors listing
doctor profile
specialty page
specialty + area page
area page
insurance page when enabled
appointment request landing when enabled
```

---

## 6. Security QA Checklist

```text
- anonymous cannot access admin/provider dashboards
- provider cannot edit unowned center
- provider cannot approve own payment
- provider cannot set verified/sponsored directly
- public cannot access private receipts
- public cannot access license documents
- public cannot access CRM notes
- RLS policies tested with anonymous/auth/provider/admin contexts
- service role key is never exposed client-side
- environment variables are not leaked
```

---

## 7. Data Quality QA

Before launch:

```text
- no duplicate active slugs
- center has country/region/city/geo_area
- center has at least one specialty
- doctor profile has minimum name/specialty/location
- Arabic required fields are present for Arabic indexable pages
- maps link or coordinates exist for center pages
- phone/WhatsApp normalized
- no Health Card text visible
- no medical cure guarantee claims
```

---

## 8. Admin QA

Admin must be able to:

```text
- create/edit center
- create/edit doctor
- approve/reject claim
- manage taxonomy
- manage geo areas
- create redirect
- set index/noindex
- view audit log
- import data preview
- detect duplicate candidate
- review payment receipt when billing enabled
```

---

## 9. Provider QA

Provider must be able to:

```text
- log in after approved claim
- see own workspace only
- edit permitted profile fields
- upload permitted media
- view profile completeness
- view billing status
- open support ticket
```

Provider must not be able to:

```text
- edit another provider
- change plan price
- approve payments
- mark self verified
- hide admin-required warnings
```

---

## 10. Launch Readiness Gate

Production launch requires:

```text
- build/lint/typecheck pass
- migration applied cleanly
- seed data loaded
- RLS tests documented
- SEO QA complete
- mobile QA complete
- Arabic QA complete
- legal pages published
- cookie consent working
- sitemap generated
- robots.txt verified
- llms.txt verified
- backups documented
- rollback plan documented
```

---

## 11. Bug Severity

```text
P0: blocks launch, data leak, payment/security failure, public 500 on core page
P1: major broken flow, SEO indexability failure, provider/admin critical failure
P2: UI bug, non-critical dashboard issue, missing optional state
P3: polish, copy, minor spacing
```

P0 and P1 must be fixed before launch.

---

## 12. Final Acceptance

A phase is accepted only when:

```text
- implementation matches the phase scope
- forbidden items were not added
- tests pass
- acceptance criteria are checked
- reviewer signs off
- next phase task is created separately
```
