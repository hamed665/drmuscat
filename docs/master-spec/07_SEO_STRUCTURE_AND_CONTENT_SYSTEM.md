# 07_SEO_STRUCTURE_AND_CONTENT_SYSTEM.md

# SEO Structure and Content System — V10.1 SEO-First

## 1. SEO Is Core System
SEO must be implemented in the first public build. It is not an afterthought. DrMuscat must ship with index control, localized metadata, canonical URLs, hreflang, sitemap, robots, schema, internal linking, breadcrumbs, content quality rules, noindex guardrails and admin SEO controls.

## 2. Keyword Research Source
The uploaded workbook `drmuscat-keywords-full.xlsx` is the canonical initial SEO planning source. It contains:
- 792 total keywords
- 396 English keywords
- 396 Arabic keywords
- 10 SEO tiers
- major clusters including Dental, Aesthetic, Skin, Lab, Imaging, Nutrition, Fitness, Women, Insurance and Local

Tier distribution:
- Tier 1 Money: 140
- Tier 2 Programmatic: 240
- Tier 3 Costs: 52
- Tier 4 Symptoms: 96
- Tier 5 Drugs: 84
- Tier 6 Lab/Imaging: 44
- Tier 7 Wellness: 50
- Tier 8 Devices: 32
- Tier 9 Insurance: 22
- Tier 10 Local: 32

## 3. Launch Languages for SEO
Indexable public SEO languages in MVP are exactly:
- English: `/en`
- Arabic for Oman: `/ar`

Do not create `/fa` routes, sitemap entries, hreflang entries, Persian dictionaries or Persian SEO pages.
Do not create `/hi` routes in launch. Hindi is a future optional acquisition experiment only.

Arabic SEO pages should use clear professional Arabic that is understandable across Oman. Omani/local phrasing may be used in CTAs, ads, short headings and WhatsApp/social copy, but long-form SEO pages should remain clear and searchable.

## 4. URL Strategy
Use stable ASCII slugs across languages for technical reliability:
- `/en/centers/al-fajar-dental`
- `/ar/centers/al-fajar-dental`
- Canonical category/area URL: `/en/om/centers/dentistry/al-khuwair`
- Canonical Arabic equivalent: `/ar/om/centers/dentistry/al-khuwair`
- Deprecated non-canonical examples such as `/en/dentist/al-khuwair` must not be generated, indexed, linked internally, or included in sitemap.

Arabic content appears in page text, title, H1, metadata and schema, not necessarily Arabic URL slugs.

## 5. Required SEO Page Types
Launch architecture must support:
- homepage
- center profiles
- doctor profiles
- specialty/category hubs
- area hubs
- category × area pages
- service pages
- service × area pages
- offer pages
- article pages
- cost pages
- FAQ/trust pages
- provider acquisition pages

## 6. Programmatic SEO Guardrails
Programmatic pages are allowed only when useful. Category+area or service+area pages must be indexable only if they meet quality thresholds.

Indexable matrix page requirements:
- at least 3 relevant published listings, or admin-approved unique content
- unique intro copy
- localized title/H1/meta
- internal links to centers, services, areas and related pages
- FAQ if useful
- JSON-LD where compliant
- no duplicate/thin content

Otherwise render `noindex, follow` and exclude from sitemap.

## 7. Sitemap
Include only indexable public pages:
- static pages
- published center/doctor profiles
- approved offer pages
- published articles
- useful matrix pages
- trust pages

Exclude dashboards, API, auth callbacks, filtered query pages, payment/internal/admin pages, incomplete language pages, noindex pages, fake or seed-only thin pages.

## 8. hreflang
Every indexable localized page includes self-referencing alternates:
- `en-OM`
- `ar-OM`
- `x-default` normally points to English

Do not include `fa-OM` or `hi-OM` in MVP.

## 9. Medical Content
Medical content is YMYL. No diagnosis promises, guaranteed outcomes, fake reviews, fake ratings, fake rankings, AI auto-publishing, or unsupported medical claims. Medical education articles need reviewer workflow before public index.

## 10. JSON-LD
Use compliant schema types where relevant:
- MedicalClinic
- Physician
- Dentist
- Pharmacy
- Hospital
- LocalBusiness
- ItemList
- BreadcrumbList
- FAQPage
- MedicalWebPage
- Article
- Offer

Do not add aggregateRating or reviewCount unless real approved review system data exists and is visible on the page.

## 11. AI Search Readiness
Each indexable page must include:
- semantic HTML
- direct summary block
- visible contact/location/service information
- structured data
- breadcrumbs
- last updated date where useful
- correction/report mechanism
- FAQ when helpful

## 12. Admin SEO Controls
Admin must eventually control:
- index/noindex
- title/meta overrides
- canonical override with validation
- sitemap inclusion
- page quality status
- target keyword mapping
- Arabic/English completeness
- thin content warning

## 13. Trust Pages
Required trust pages:
- About DrMuscat
- For Healthcare Providers
- How We Verify Centers
- Review Policy
- Medical Disclaimer
- Privacy Policy
- Terms of Use
- Data Removal Request
- Correction Request
- Contact Compliance Team


## V10.2 Canonical URL Routing Override

V10.2 introduces multi-country readiness. Public SEO URLs must include the country segment from launch, even when Oman is the only active country.

Canonical pattern:

```text
/[locale]/[country]/centers
/[locale]/[country]/centers/[categorySlug]
/[locale]/[country]/centers/[categorySlug]/[areaSlug]
/[locale]/[country]/[citySlug]
/[locale]/[country]/[citySlug]/centers
/[locale]/[country]/[citySlug]/[areaSlug]
/[locale]/[country]/doctors/[doctorSlug]
```

Launch examples:

```text
/en/om/centers
/ar/om/centers
/en/om/centers/dentistry/al-khuwair
/ar/om/centers/dentistry/al-khuwair
/en/om/muscat/al-mouj
/ar/om/muscat/al-mouj
/en/om/doctors/dr-hassan-al-balushi
/ar/om/doctors/dr-hassan-al-balushi
```

The old singular shortcut route pattern `/[locale]/dentist/[areaSlug]` is deprecated and must not be implemented. If legacy URLs ever exist, they must 301 redirect to the canonical `/[locale]/[country]/centers/[categorySlug]/[areaSlug]` route.
