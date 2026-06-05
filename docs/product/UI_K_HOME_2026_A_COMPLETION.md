# UI-K-HOME-2026-A Completion Report — PR #156-A

## 1. Files read

Read in the required guardrail/reference order before implementation:

1. `AGENTS.md`
2. `README.md`
3. `docs/project-state/CURRENT_STATE.md`
4. `docs/project-state/V10_4_PHASE_ALIGNMENT_MATRIX.md`
5. `docs/master-spec/58_CODEX_PHASED_BUILD_MASTER_PLAN.md`
6. `docs/master-spec/66_PHASE_LOCKS_AND_ALLOWED_FILE_CHANGES.md`
7. `docs/master-spec/08_IMPLEMENTATION_TASKS_AND_PHASES.md`
8. `docs/master-spec/67_DATABASE_MIGRATION_PROTOCOL.md`
9. `docs/master-spec/68_TESTING_AND_VALIDATION_GATE.md`
10. `docs/master-spec/69_ERROR_HANDLING_AND_STOP_RULES.md`
11. `docs/master-spec/70_AGENT_OUTPUT_REPORT_TEMPLATE.md`
12. `docs/master-spec/72_SECURITY_RLS_AND_SECRET_HANDLING_PROTOCOL.md`
13. `docs/master-spec/73_SEO_BUILD_VALIDATION_PROTOCOL.md`
14. `docs/master-spec/76_HUMAN_APPROVAL_CHECKPOINTS.md`
15. `docs/product/UI_K_DESIGN_REFERENCE_IMPORT_A.md`
16. `docs/product/UI_K_ALIGN_B_TOKEN_TYPOGRAPHY.md`
17. `docs/product/UI_K_FOUNDATION_2026_PRE_AUDIT.md`
18. `docs/product/UI_K_FOUNDATION_2026_B_COMPLETION.md`
19. `src/styles/dm2026-foundation.css`
20. `src/styles/globals.css`
21. `src/lib/i18n/config.ts`
22. `src/lib/routes/public.ts`
23. `src/app/[locale]/[country]/page.tsx`
24. `src/components/layout/site-header.tsx`
25. `src/components/layout/site-footer.tsx`
26. `docs/prototype-reference/drmuscat-ui-kit-2026-v2/DrMuscat Web UI Kit (1).html`
27. `docs/prototype-reference/drmuscat-ui-kit-2026-v2/DrMuscat Design System (2).zip` inspected via archive listing as visual reference only.

Also read the V10.5 documentation-only addendums required by root guardrails:

- `docs/addendums/V10_5_BUSINESS_GROWTH_REVENUE_ADDENDUM.md`
- `docs/addendums/V10_5_SEO_AI_SEARCH_EXPANSION_ADDENDUM.md`
- `docs/addendums/V10_5_MONETIZATION_SALES_REFERRAL_ADDENDUM.md`

## 2. Exact file plan used

- `src/app/[locale]/[country]/page.tsx` — narrow homepage render change only: replace the current top homepage composition with the new localized header/hero/search component while preserving metadata/canonical behavior and existing approved route helpers.
- `src/components/home/HomePage2026HeaderHero.tsx` — new server-rendered homepage-only component containing the premium visual header, localized hero copy, safety micro-copy, and composition of the static search UI.
- `src/components/home/HomeSearch2026.tsx` — new server-rendered UI-only premium search surface with labeled fields, approved static suggestions, approved provider/country/city/area options, and approved route-only CTAs.
- `src/styles/dm2026-home.css` — new homepage-only CSS using only `dm2026-home-*` selectors and existing `dm2026-*` foundation classes/tokens.
- `src/styles/globals.css` — import `dm2026-home.css` once, immediately after the existing `dm2026-foundation.css` import.
- `docs/product/UI_K_HOME_2026_A_COMPLETION.md` — required phase completion report with files read, file plan, changes, safety notes, validations, and next PR recommendation.

## 3. Files changed

- `src/app/[locale]/[country]/page.tsx`
- `src/components/home/HomePage2026HeaderHero.tsx`
- `src/components/home/HomeSearch2026.tsx`
- `src/styles/dm2026-home.css`
- `src/styles/globals.css`
- `docs/product/UI_K_HOME_2026_A_COMPLETION.md`

## 4. Homepage header/hero/search changes

- Replaced the localized homepage top hero/search render with a dedicated `HomePage2026HeaderHero` server component.
- Added a premium homepage-only header visual with DrMuscat logo placement, approved discovery links, disabled hospitals/coming-soon UI, provider CTA, and bilingual language switch.
- Added a search-first hero with calm medical/GCC teal-green visual direction and restrained Omani gold accent usage.
- Added a large static-safe search surface with care-need input, provider type selector, country selector, city selector, area selector, Search CTA, and List your center / provider CTA.
- Added static-safe suggestion UI containing only generic services/categories/areas and explicitly stating that suggestions are static examples.
- Preserved existing lower homepage sections without redesigning excluded homepage sections in this PR.

## 5. English/Arabic copy summary

- English hero: “Find healthcare options in Oman with a calmer search-first experience.”
- Arabic hero: “ابحث عن خيارات الرعاية الصحية في عُمان بتجربة هادئة تبدأ من البحث.”
- English safety micro-copy communicates public discovery only, confirmation with providers, and not medical advice.
- Arabic safety micro-copy mirrors the same safety meaning without medical claims.
- Language switch behavior:
  - English page displays `العربية`.
  - Arabic page displays `English`.

## 6. Route/SEO/RTL safety notes

- No new routes were added.
- No route helpers were changed.
- Homepage metadata and canonical generation remain in the existing localized page file.
- Header links use existing approved route helpers only: home, doctors, centers, labs, pharmacies, services, search, and for-providers.
- Articles, auth, account, and registration routes were not added or linked.
- Hospitals are shown only as disabled/coming-soon UI because no approved hospital route exists.
- Supported locales remain `en` and `ar`; supported country remains `om`.
- No Persian/Hindi routes were added.
- No deprecated route pattern was added.
- Arabic layout is rendered with existing `localeDirection` output and homepage CSS includes RTL-safe line-height and letter-spacing handling.

## 7. Accessibility/performance notes

- Search UI is server-rendered and does not require client-only rendering for SEO-critical content.
- Search input/select fields have visible `<label>` elements.
- CTAs are real `<a>` links or `<button>` elements; no div buttons were introduced.
- Static suggestions are non-interactive preview content, marked with static-preview data and explanatory copy.
- Touch targets use the existing `dm2026-button`, `dm2026-input`, and `dm2026-select` primitives with at least 44px minimum block size.
- No new dependencies, heavy JavaScript, animation library, remote fonts, large images, background video, API route, or Supabase query was added.
- Motion remains limited to existing CSS transitions and respects the foundation-level reduced-motion behavior.

## 8. Forbidden areas confirmed untouched

Confirmed unchanged by changed-file review:

- `supabase/**`
- `migrations/**`
- `scripts/db/**`
- generated database types
- API routes
- auth backend
- payment backend
- `src/app/sitemap.ts`
- `src/app/robots.ts`
- `public/llms.txt`
- `package.json`
- `pnpm-lock.yaml`
- database schema
- seed data
- route-check scripts

Content safety scan confirmed no fake ratings, fake review counts, fake provider names, fake availability, fake phone/WhatsApp numbers, “best doctor”, “top clinic”, or unsupported medical trust claims in the changed homepage files.

## 9. Validation results

- `git status --short` — completed; showed only the scoped homepage UI/report changes.
- `pnpm lint` — passed with existing repository warnings and no errors.
- `pnpm typecheck` — initially found strict default-value checks in the new search component; fixed with the smallest safe TypeScript helper, then passed.
- `pnpm build` — passed.
- `pnpm routes:check` — passed.
- `curl -I -s http://localhost:3000/en/om` — passed with `HTTP/1.1 200 OK`.
- `curl -I -s http://localhost:3000/ar/om` — passed with `HTTP/1.1 200 OK`.
- Forbidden path/content checks — passed.

## 10. Warnings or blockers

- No unresolved blockers.
- Lint still reports pre-existing warnings in prototype/public detail files unrelated to this PR.
- A browser screenshot could not be produced in this container because no browser/screenshot binary is installed; no dependency was added to force screenshot tooling.

## 11. Recommended next PR

PR #156-B — Homepage Stories + Categories + Care Journey
