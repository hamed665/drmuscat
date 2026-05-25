# 51_SEO_OPERATIONS_REDIRECTS_AND_INDEXABILITY_MANAGER.md

# DrMuscat V10.3 — SEO Operations, Redirects, and Indexability Manager

## 1. Purpose
V10.2 defines SEO-first strategy. V10.3 makes it operational. DrMuscat must avoid thin programmatic pages, route conflicts, duplicate canonicals, broken hreflang, and accidental indexing of incomplete routes.

## 2. Canonical Public Route Model
Launch public routes must use:
- `/en/om/...`
- `/ar/om/...`

Deprecated/noncanonical:
- `/en/centers`
- `/ar/centers`
- `/en/dentist/al-khuwair`
- `/ar/dentist/al-khuwair`
- `/fa/...`
- `/hi/...`

If legacy routes exist, they must be 301 redirects or 404/noindex, not indexable duplicates.

## 3. SEO Page Registry
Create `seo_pages` to control every indexable/generated page.

Required fields:
- `id`
- `locale`
- `country_id`
- `page_type`
- `entity_type`
- `entity_id`
- `path`
- `canonical_path`
- `title`
- `meta_description`
- `h1`
- `intro_html`
- `faq_json`
- `schema_json`
- `robots_index`
- `sitemap_include`
- `quality_score`
- `listing_count`
- `content_status`: `draft`, `pending_review`, `approved`, `published`, `noindex`, `archived`
- `last_reviewed_by_profile_id`
- `last_reviewed_at`
- `created_at`
- `updated_at`

## 4. Indexability Gates
A page may be indexable only if:
- It uses canonical `/[locale]/om` path.
- Locale is `en` or `ar`.
- It has a canonical path.
- It has unique title and meta description.
- It has enough useful listings or unique editorial content.
- It has valid hreflang pair where applicable.
- It has no forbidden private data.
- It passes quality threshold.

Default for newly generated programmatic pages:
- `robots_index=false`
- `sitemap_include=false`

Admin/content approval may publish after quality gates pass.

## 5. Redirect Manager
Create `redirect_rules`.

Fields:
- `id`
- `source_path`
- `target_path`
- `status_code`: 301 or 302
- `country_id`
- `locale`
- `reason`
- `is_active`
- `hit_count`
- `last_hit_at`
- `created_by_profile_id`
- `created_at`
- `updated_at`

Rules:
- Redirects must never point to private/admin routes.
- Redirect loops must be detected.
- Old slugs must create redirects automatically when center/doctor slugs change.

## 6. Hreflang Rules
Every English public page should map to its Arabic equivalent when Arabic page exists.
Every Arabic public page should map to English equivalent when English page exists.
Use `x-default` only when a neutral selector page exists or a canonical default is explicitly defined.

## 7. Sitemap Rules
Sitemap must include only:
- published public pages.
- `robots_index=true`.
- `sitemap_include=true`.
- `locale in ('en','ar')`.
- `country='om'` for launch.

Do not include:
- admin/provider routes.
- auth routes.
- search query result pages.
- filtered query parameter pages.
- Persian/Hindi routes.
- draft/noindex/thin pages.

## 8. Structured Data Rules
Allowed schema types:
- `WebSite`
- `Organization`
- `MedicalOrganization`
- `MedicalClinic`
- `Hospital`
- `Dentist`
- `Physician`
- `LocalBusiness`
- `BreadcrumbList`
- `FAQPage`
- `Offer`
- `Review` / `AggregateRating` only when compliant and approved.

Rules:
- Never generate fake ratings.
- Never use private reviews.
- Do not expose admin notes, CRM notes, billing, license documents, receipts, or claim evidence.
- Medical claims must follow file 20.

## 9. SEO Admin Requirements
Admin must manage:
- Meta title/description.
- H1.
- Index/noindex.
- Sitemap include/exclude.
- Canonical path.
- Redirects.
- FAQ blocks.
- AI summary blocks.
- Schema preview.
- Page quality warnings.
- Duplicate title/meta warnings.
- Broken internal links.
- Thin page detection.

## 10. Search Query Logs
Search logs must be used to improve content, synonyms, and zero-result pages.
Do not expose individual user behavior publicly.

## 11. Route File Correction
Any older file defining `/[locale]/centers`, `/[locale]/doctors`, or `/[locale]/services` as canonical public SEO routes is deprecated. Codex must implement `/[locale]/[country]` routes only for public SEO pages.
