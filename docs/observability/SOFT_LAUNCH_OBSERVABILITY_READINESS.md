# DrKhaleej Soft Launch Observability Readiness

## Purpose

This document defines the observability surface required before expanding beyond the controlled soft launch.

The goal is to measure crawl health, route health, user actions, and mobile quality without adding public ranking, review, rating, or unsupported provider claims.

## Required setup before public index expansion

Before expanding indexable URLs, confirm these are ready:

- Search Console property for the production domain
- sitemap submission workflow
- production 404 review path
- uptime or availability check
- Core Web Vitals baseline process
- safe event taxonomy for user actions
- route-family daily review
- rollback note process

## Search Console checklist

After production deploy:

1. Add the production property.
2. Submit `/sitemap.xml`.
3. Inspect `/en/om`.
4. Inspect `/ar/om`.
5. Inspect one launch-core category route.
6. Inspect one preview route to confirm noindex handling.
7. Record submitted URL count.
8. Record indexed URL count once available.
9. Record crawl or canonical warnings.

## Route health checklist

Track route health by family:

- country root
- doctors hub
- centers hub
- labs hub
- pharmacies hub
- hospitals hub
- services hub
- for-providers page
- search utility page
- preview routes
- guarded provider profiles

For each family, record:

- status code
- canonical behavior
- noindex/index state
- sitemap inclusion state
- mobile first-fold status
- obvious copy or layout issues

## Event taxonomy

Allowed soft-launch user-action events:

- `provider_form_submit`
- `contact_form_submit`
- `whatsapp_click`
- `call_click`
- `website_click`
- `map_click`
- `language_switch_click`
- `search_submit`
- `provider_profile_view`

Blocked event claims:

- quality ranking
- best provider
- official verification
- public rating
- public review score
- insurance acceptance
- open-now status
- emergency availability

## Core Web Vitals baseline

Record mobile and desktop baseline for:

- `/en/om`
- `/ar/om`
- `/en/om/doctors`
- `/en/om/pharmacies`
- `/en/om/hospitals`
- `/en/om/services`
- `/en/om/for-providers`

Track:

- LCP
- INP
- CLS
- transferred JavaScript
- first-fold readability
- RTL layout stability

## Daily soft-launch report

For the first seven days, record:

- date
- deploy commit
- sitemap submitted URL count
- sitemap unexpected URL count
- indexed URL count if available
- 404 count
- top route errors
- form submissions
- WhatsApp and call clicks
- profile page sample status
- mobile issue notes
- rollback needed: yes/no

## Expansion rule

Do not expand indexable URLs until:

- no unexpected sitemap families appear
- no preview routes are indexed
- launch-core routes load cleanly
- provider profile samples hide internal QA fields
- no structured-data violation is found on preview routes
- mobile baseline is acceptable
- rollback path remains valid

## Next implementation boundary

This document is readiness planning only.

Runtime instrumentation, analytics scripts, event emitters, dashboards, and external platform configuration must be added in separate dedicated PRs after this readiness contract is accepted.
