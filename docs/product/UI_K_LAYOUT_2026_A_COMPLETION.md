# UI-K-LAYOUT-2026-A Completion — Header/Footer Pathname i18n Root Fix

## Task

PR #163-FIX01 — Root Fix Header and Footer i18n Using Pathname, Not Request Headers.

## Root Cause

The public header and footer visible labels previously depended on request-derived locale state, including `x-drmuscat-locale` and other server-side request header fallbacks. Those values can be missing or unreliable for the rendered route, so `/ar/om` could still display English header or footer labels.

## Fix

Visible header and footer labels now derive from the actual client pathname via `usePathname()` and a shared local resolver:

- first pathname segment `/ar` resolves to Arabic
- all other pathnames resolve to English
- second pathname segment resolves country when it is `om`, otherwise defaults safely to `om`

No request headers, proxy headers, middleware headers, cookies, browser language, `referer`, or `x-next-url` values are used for visible header/footer labels.

## Files Changed

- `src/components/layout/layout-i18n-copy.ts`
- `src/components/layout/site-header.tsx`
- `src/components/layout/site-footer.tsx`
- `docs/product/UI_K_LAYOUT_2026_A_COMPLETION.md`

## Header i18n Result

- `/en/om` desktop header labels render in English.
- `/ar/om` desktop header labels render in Arabic.
- Header labels are sourced from pathname-derived locale copy.
- Header pending items remain disabled text for unfinished destinations.
- No new header routes were created.

## Mobile Menu i18n Result

- `/en/om` mobile menu labels use the same English copy as desktop.
- `/ar/om` mobile menu labels use the same Arabic copy as desktop.
- Mobile pending items remain disabled text.
- Mobile menu close behavior is preserved with the existing `data-dm2026-mobile-menu-close` contract, now wired from the client component.

## Footer i18n Result

- `/en/om` footer brand, Browse, For Providers, and Trust & Safety labels render in English.
- `/ar/om` footer brand, Browse, For Providers, and Trust & Safety labels render in Arabic.
- Footer labels are sourced from pathname-derived locale copy.
- Unfinished footer destinations such as hospitals and Special Offers remain disabled text.

## Language Switch Preservation

The existing `HeaderLanguageSwitch` remains unchanged and still uses `usePathname()`:

- English pages show `العربية`.
- Arabic pages show `English`.
- Header and footer both reuse this pathname-based switch behavior.

## Route and Link Safety Notes

- No new routes were created.
- No `/offers` route was created or linked.
- No pricing, onboarding, admin, backend, API, Supabase, sitemap, robots, `llms.txt`, package, lockfile, middleware, or proxy changes were made.
- Existing safe discovery links are preserved.
- Existing safe `/[locale]/[country]/for-providers` usage is preserved only for the provider CTA/list-your-center destination.
- Unfinished destinations render as disabled text.

## Validation Results

Required validation passed for this root i18n fix:

- `git status --short`
- `pnpm lint` — passed with existing warnings only
- `pnpm typecheck`
- `pnpm build`
- `pnpm routes:check`

Additional HTML smoke checks passed for `/en/om` and `/ar/om` after starting the local Next.js server with `pnpm exec next start -H 0.0.0.0 -p 3000`.

## Manual QA Notes

Manual QA checklist status:

- `/en/om` desktop header labels are English.
- `/ar/om` desktop header labels are Arabic.
- `/en/om` mobile menu labels are English.
- `/ar/om` mobile menu labels are Arabic.
- `/en/om` footer labels are English.
- `/ar/om` footer labels are Arabic.
- Language switch labels remain `العربية` on English pages and `English` on Arabic pages.
- Mobile menu close hooks remain present on mobile menu items; no browser automation was available for a full popover interaction screenshot in this environment.
- No homepage content sections were changed.
- No route creation occurred.
- No backend/database/API/Supabase/SEO/package changes occurred.

## Next PR Recommendation

UI-K-LAYOUT-2026-B — Premium header/footer visual polish after i18n is stable.
