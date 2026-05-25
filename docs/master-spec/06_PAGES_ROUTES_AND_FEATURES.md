# 06_PAGES_ROUTES_AND_FEATURES.md

# Pages, Routes and Features

## 1. App Router Structure
Use Next.js App Router with localized root:
- `src/app/api/*` global APIs, no locale prefix
- `src/app/microsite/[subdomain_slug]/*` internal microsite rendering
- `src/app/[locale]/(public)/*` public pages
- `src/app/[locale]/(dashboard)/*` dashboards

## 2. Public Routes
- `/[locale]`
- `/[locale]/centers`
- `/[locale]/centers/[slug]`
- `/[locale]/doctors`
- `/[locale]/doctors/[slug]`
- `/[locale]/offers`
- `/[locale]/for-partners`
- `/[locale]/for-doctors`
- `/[locale]/claim-profile`
- `/[locale]/blog`
- `/[locale]/blog/[slug]`
- `/[locale]/contact`
- `/[locale]/privacy-policy`
- `/[locale]/terms`
- `/[locale]/medical-disclaimer`
- `/[locale]/partner-terms`
- `/[locale]/centers/[categorySlug]/[areaSlug]`

## 3. API Routes
- `POST /api/leads`
- `POST /api/events`
- `POST /api/ads/event`
- `POST /api/storage/signed-upload-url`
- `POST /api/claim-profile`
- `POST /api/onboarding/center`
- `POST /api/onboarding/doctor`
- `GET /api/search/centers`
- `GET /api/search/doctors`
- `GET /api/search/nearby`
- `POST /api/admin/approve`
- `POST /api/admin/reject`
- `POST /api/admin/mark-payment-paid`

## 4. Homepage Requirements
Homepage must be premium and product-led: search preview, center cards, area chips, offer/partner badge, partner CTA.

## 5. Center Directory
Marketplace-like, mobile filter sheet, category/area filters, Offer filter, featured priority, skeleton loading, no client-only SEO page.

## 6. Center Profile
Premium mini-site: hero, badges, contact actions, sticky mobile CTA, services, hours, map placeholder, approved patient offer, media, similar centers, disclaimer, claim CTA.

## 7. Dashboard Pages
Dashboards use shared shell, cards, tables, filters, badges, empty states and role-based actions. Backend enforcement required.


## 8. V10 Admin Route Requirements
Admin routes must include:
- `/[locale]/dashboard/admin`
- `/[locale]/dashboard/admin/approvals`
- `/[locale]/dashboard/admin/organizations`
- `/[locale]/dashboard/admin/centers`
- `/[locale]/dashboard/admin/doctors`
- `/[locale]/dashboard/admin/users`
- `/[locale]/dashboard/admin/billing`
- `/[locale]/dashboard/admin/payments`
- `/[locale]/dashboard/admin/subscriptions`
- `/[locale]/dashboard/admin/media`
- `/[locale]/dashboard/admin/ads`
- `/[locale]/dashboard/admin/ledger`
- `/[locale]/dashboard/admin/content`
- `/[locale]/dashboard/admin/microsites`
- `/[locale]/dashboard/admin/settings`
- `/[locale]/dashboard/admin/settings/seo`
- `/[locale]/dashboard/admin/settings/homepage`
- `/[locale]/dashboard/admin/settings/menus`
- `/[locale]/dashboard/admin/settings/translations`
- `/[locale]/dashboard/admin/settings/features`

## 9. V10 Matrix Route Requirement
The folder tree must include:
- `src/app/[locale]/(public)/centers/[categorySlug]/[areaSlug]/page.tsx`

This route is required for SEO matrix pages and must not be omitted.

## 10. V10 Growth Public Routes
Additional required public routes:
- `/[locale]/services/[serviceSlug]`
- `/[locale]/services/[serviceSlug]/[areaSlug]`
- `/[locale]/areas/[areaSlug]`
- `/[locale]/compare/[slug]`
- `/[locale]/for-clinics`
- `/[locale]/claim-your-clinic`
- `/[locale]/find-dental-clinics-muscat`
- `/[locale]/centers/[slug]/reviews`

## 11. V10 Growth API Routes
Additional required API routes:
- `POST /api/reviews`
- `POST /api/reviews/[reviewId]/vote`
- `POST /api/reviews/[reviewId]/report`
- `POST /api/offers/claim`
- `POST /api/offers/redeem`
- `POST /api/analytics/event`
- `POST /api/ai-chat/sessions`
- `POST /api/ai-chat/messages`

## 12. Center Profile V10 Requirements
Center profile must include:
- unclaimed/claimed/verified/partner badge logic
- claim CTA if unclaimed
- suggest edit/report wrong information/request removal
- WhatsApp/call/direction actions with tracking
- offer claim if approved offers exist
- review summary and review list if thresholds are met
- leave review CTA
- AI chat entry point, if enabled
- SEO structured data

## 13. Center Dashboard V10 Requirements
Center dashboard must include pages/sections for:
- profile editor
- profile completeness
- analytics
- reviews and responses
- leads/actions
- offers and claim/redemption stats
- reports
- QR kit
- billing/subscription
- settings

## 14. Admin Dashboard V10 Requirements
Admin dashboard must include pages/sections for:
- seeded listings
- claim requests
- review moderation
- reported/disputed reviews
- AI chat safety/logs
- analytics/events
- sales CRM
- sales pitch/presentation mode
- proposals
- contracts
- SEO matrix/noindex controls
- duplicate/merge tools


## Advertising and Sponsored Placement Routes

Public advertising pages:
- `/[locale]/for-clinics/advertise`
- `/[locale]/for-clinics/advertising-options`

Center dashboard advertising pages:
- `/[locale]/dashboard/ads`
- `/[locale]/dashboard/ads/new`
- `/[locale]/dashboard/ads/[campaignId]`
- `/[locale]/dashboard/ads/wallet`
- `/[locale]/dashboard/ads/reports`

Admin advertising pages:
- `/[locale]/admin/ads`
- `/[locale]/admin/ads/placements`
- `/[locale]/admin/ads/campaigns`
- `/[locale]/admin/ads/creatives`
- `/[locale]/admin/ads/wallets`
- `/[locale]/admin/ads/pricing`
- `/[locale]/admin/ads/events`

Required ad API families:
- `/api/ads/impression`
- `/api/ads/click`
- `/api/ads/campaigns`
- `/api/ads/wallet/topup-request`
- `/api/admin/ads/*`

Sponsored placements must be rendered inside relevant public pages using admin-defined placement keys. Public UI must show `Sponsored` / `إعلان ممول` labels.


## V10.2 Multi-Country Route Override

All public SEO routes must be multi-country-ready from launch. Oman is the only active country in launch, but the URL must still include `om` so the platform can later support UAE, Saudi Arabia, Qatar, and other GCC markets without a database or route rewrite.

Required launch routes:

```text
/[locale]/[country]
/[locale]/[country]/centers
/[locale]/[country]/centers/[categorySlug]
/[locale]/[country]/centers/[categorySlug]/[areaSlug]
/[locale]/[country]/[citySlug]
/[locale]/[country]/[citySlug]/centers
/[locale]/[country]/[citySlug]/[areaSlug]
/[locale]/[country]/doctors
/[locale]/[country]/doctors/[doctorSlug]
/[locale]/[country]/for-centers
/[locale]/[country]/claim-profile
/[locale]/[country]/about
```

`country` must be an active or launching country slug such as `om`, `ae`, `sa`, or `qa`. In V10.2 launch, only `om` is active. Future country routes may show Coming Soon lead capture pages until activated.
