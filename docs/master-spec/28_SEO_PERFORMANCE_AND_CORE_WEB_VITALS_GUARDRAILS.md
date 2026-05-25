# 28_SEO_PERFORMANCE_AND_CORE_WEB_VITALS_GUARDRAILS.md

# SEO, Performance and Core Web Vitals Guardrails

## 1. Non-Negotiable Targets
- Lighthouse Performance: 90+
- Lighthouse SEO: 95+
- Lighthouse Accessibility: 90+
- Lighthouse Best Practices: 90+
- LCP under 2.5s
- CLS under 0.1
- INP under 200ms

## 2. Public Page Rendering
Public pages must be Server Component first. Interactive elements may be client islands only.

Do not use `useEffect` as the primary data-fetching method for public SEO content.

## 3. Metadata
Every indexable public page must define:
- title
- meta description
- canonical
- hreflang alternates
- Open Graph image
- robots directive
- structured data where relevant

## 4. Matrix Pages
`/[locale]/centers/[categorySlug]/[areaSlug]` indexes only when there are at least 3 published centers. Otherwise it must be `noindex, follow`.

## 5. Sitemap Rules
Include only:
- static public pages
- published centers
- published doctors if directory enabled
- published articles
- approved indexable matrix pages
- approved indexable microsites if explicitly allowed

Exclude:
- dashboard
- admin
- auth callback
- API
- filtered query pages
- payment pages
- internal previews

## 6. Bundle Rules
- no heavy animation libraries in MVP
- no chart libraries on public pages unless dynamically imported and below the fold
- no admin libraries in public bundles
- no client-side full app shell for public pages
- no unbounded icon imports

## 7. Image Rules
- derivatives only for public display
- correct width/height or aspect ratio
- lazy-load non-LCP images
- no layout shift from media

## 8. Fonts
- use performant font loading
- avoid blocking render
- Arabic readable and RTL-tested
- no layout shift caused by late font swaps where avoidable

## 9. Accessibility
- keyboard navigation
- visible focus states
- aria labels for icon buttons
- form errors linked to fields
- contrast AA
- correct `lang` and `dir`
- modal focus trap
- touch targets large enough on mobile

## 10. Performance Testing Requirement
After each UI-heavy phase, Claude Code must report:
- build result
- typecheck result
- likely LCP element
- bundle risk
- image risk
- mobile overflow risk
- RTL risk
