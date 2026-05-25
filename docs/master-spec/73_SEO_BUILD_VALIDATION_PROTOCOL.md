# 73_SEO_BUILD_VALIDATION_PROTOCOL.md — SEO Build Validation Protocol

**Package:** DrMuscat Master Spec V10.4 Agent-Safe Build Framework  
**Status:** Canonical build-control document  
**Applies to:** Codex, Claude Code, or any coding agent building DrMuscat from zero or modifying the repository.

> This document is not a product feature spec. It is an execution-control contract. If a coding agent cannot follow it, the agent must stop instead of guessing.

## 1. Purpose
This file ensures DrMuscat launches with SEO discipline, not a pile of crawlable rubble.

## 2. Canonical Route Contract
Allowed public launch route patterns:
```txt
/[locale]/[country]
/[locale]/[country]/centers
/[locale]/[country]/centers/[specialtySlug]
/[locale]/[country]/centers/[specialtySlug]/[areaSlug]
/[locale]/[country]/center/[centerSlug]
/[locale]/[country]/doctors
/[locale]/[country]/doctors/[doctorSlug]
/[locale]/[country]/areas/[areaSlug]
/[locale]/[country]/offers
/[locale]/[country]/claim
```
Allowed launch locales: `en`, `ar`.
Allowed launch country: `om`.

Forbidden public SEO routes:
```txt
/fa/*
/hi/*
/[locale]/centers
/[locale]/doctors
/en/dentist/al-khuwair
/ar/dentist/al-khuwair
```

## 3. Metadata Requirements
Every indexable page must have:
- title
- meta description
- canonical URL
- language alternate/hreflang pair when Arabic/English counterpart exists
- Open Graph basics
- no duplicate canonical

## 4. Sitemap Rules
Sitemap includes only:
- canonical indexable pages,
- pages passing quality gates,
- English/Arabic Oman routes,
- active public entities.

Sitemap excludes:
- deprecated routes,
- search result query pages,
- thin programmatic pages,
- admin/provider pages,
- claim forms if not SEO-targeted,
- private/user pages.

## 5. Page Quality Gate
A programmatic page is indexable only if:
- enough listings exist or the page has unique editorial value,
- title/description are unique,
- intro copy is unique and localized,
- FAQ block is useful, not filler,
- internal links exist,
- schema is valid,
- no duplicate canonical exists,
- page has `quality_score` above threshold or admin approval.

## 6. Structured Data
Use only compliant public data. Supported templates:
- `WebSite`
- `Organization`
- `MedicalOrganization`
- `MedicalClinic`
- `Physician`
- `Dentist`
- `Hospital`
- `LocalBusiness`
- `BreadcrumbList`
- `FAQPage`
- `Offer`

Review schema must be used only for approved, visible, compliant reviews.

## 7. Redirect Manager
All legacy route support must use explicit redirect rules:
- 301 for permanent canonical changes.
- No internal links to deprecated routes.
- Deprecated routes excluded from sitemap.

## 8. AI Discoverability
`llms.txt` and AI summary blocks may use only approved public fields. Never expose CRM notes, payment logs, private reviews, license files, receipts, claim evidence, admin notes, or unpublished provider data.

## 9. SEO Validation Commands
By Phase 4/10:
```bash
pnpm routes:check
pnpm seo:check
pnpm build
```
Validation must check:
- forbidden routes absent,
- canonical routes present,
- sitemap generated,
- hreflang pairs valid,
- no Persian/Hindi public SEO routes,
- no deprecated dentist shortcut in sitemap.
