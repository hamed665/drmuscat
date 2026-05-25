# 35_LOCAL_SEO_PROGRAMMATIC_PAGES_AND_TRUST_AUTHORITY.md

# Local SEO, Programmatic Pages and Trust Authority

## Purpose
This file defines the SEO architecture required for fast growth without creating thin/spam pages.

## SEO Matrix
Required matrix families:
1. category pages
2. area pages
3. category + area pages
4. service pages
5. service + area pages, only when enough data exists
6. center profile pages
7. doctor profile pages
8. offer pages
9. guide/articles
10. trust/compliance pages

## Programmatic SEO Guardrails
Claude Code must not create unlimited indexable pages by query parameter.

Indexable matrix pages must meet quality thresholds:
- at least 3 relevant listings, or
- unique editorial content and clear user value, or
- strategically important page manually approved by admin

If the page has weak data:
```text
robots_index = false
meta robots = noindex,follow
exclude from sitemap
```

## Required Page Content
Each indexable category/area/service page must include:
- H1 with area/service/category
- short useful intro
- relevant listings
- filters
- FAQ
- internal links to nearby areas/services
- breadcrumbs
- last updated date
- canonical URL
- JSON-LD where relevant

## Safe Medical Language
Allowed:
- find clinics
- compare locations/services/hours/languages/offers
- contact centers
- learn general questions to ask

Forbidden without verified evidence:
- best doctor
- guaranteed treatment
- cure
- lowest risk
- medically superior
- safest clinic
- 100% result

## Structured Data Rules
Use JSON-LD only when content is visible and compliant.

Allowed types:
- WebSite
- Organization
- LocalBusiness
- MedicalBusiness
- MedicalClinic
- Hospital
- Pharmacy
- Dentist
- Physician
- FAQPage
- BreadcrumbList
- Offer
- Review
- AggregateRating

Review and AggregateRating must only be emitted for approved compliant reviews and after minimum threshold.

## Hreflang and Canonical
Every localized public page must include:
- canonical URL
- `en` hreflang where English exists
- `ar` hreflang where Arabic exists
- optional `fa`/`hi` only when content is production-ready and indexable
- `x-default` where appropriate

## Sitemap Strategy
Separate sitemaps:
- centers sitemap
- doctors sitemap
- categories sitemap
- areas sitemap
- services sitemap
- articles sitemap
- offers sitemap

Only indexable pages go into sitemap.

## Trust Authority Pages
Required public pages:
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

## Medical Content Review
Health guide/service content must include:
- author where relevant
- reviewer where medical content is involved
- last updated date
- disclaimer
- no diagnosis/prescription language
- sources if factual/medical claims are made

## Internal Linking
Every center profile should link to:
- its area page
- its category page
- its service pages
- related offers
- related articles where safe

Every category/area page should link to:
- top centers
- nearby areas
- related services
- FAQ/trust pages

## Popular Searches
Homepage and landing pages may include popular searches:
- Dental clinics in Al Khuwair
- Dermatology clinics in Bousher
- Pharmacies open now in Seeb
- Blood test in Ruwi

Popular searches must link only to pages that are useful or noindex until useful.

## Local Area Intelligence
Canonical areas must include at least:
- Al Khuwair
- Bousher
- Azaiba
- Qurum
- Ruwi
- Muttrah
- Seeb
- Al Hail
- Ghubrah
- Mabela
- Mawaleh
- Muscat Hills
- Al Mouj

Admin must be able to add/merge/disable areas.

## Duplicate and Merge Rules
Duplicate center records hurt SEO and trust.

Admin must support:
- duplicate detection
- merge suggestion
- canonical record selection
- redirect old slug to canonical slug
- branch vs duplicate distinction

## Branch System
For multi-branch businesses:
```text
Organization/Brand
-> Branches/Centers
-> Services per branch
-> Doctors per branch
-> Offers per branch
```

Do not flatten every branch as unrelated if the organization relationship is known.

## Non-Negotiable Rule
Programmatic SEO is allowed only when it creates useful, safe, localized pages. Thin pages must be noindex until improved.
