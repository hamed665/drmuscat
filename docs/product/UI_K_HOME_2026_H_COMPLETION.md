# UI-K-HOME-2026-H — Homepage FAQ + Trust/Safety Foundation Completion

## 1. Final scope

PR #166 added a homepage-only FAQ section and a compact Trust/Safety section for the DrMuscat 2026 homepage.

Four-axis mapping:

- Execution Phase: `PHASED_BUILD_ONLY`
- Lock Scope: Public homepage UI-only update
- Product Module: Homepage trust, FAQ, bilingual public discovery education
- Subphase ID: `UI-K-HOME-2026-H`

This phase did not add backend functionality, routes, schema, metadata, sitemap entries, robots changes, llms.txt changes, migrations, Supabase changes, package changes, Articles, pricing plans, CMS, admin, API routes, or payment functionality.

## 2. Files changed

- `src/components/home/HomeFAQ2026.tsx`
- `src/components/home/HomeTrustSafety2026.tsx`
- `src/components/home/HomePage2026HeaderHero.tsx`
- `src/styles/dm2026-home.css`
- `docs/product/UI_K_HOME_2026_H_COMPLETION.md`

## 3. FAQ component strategy

`HomeFAQ2026` is a small, data-driven client component with bilingual English/Arabic copy inside the component. It uses lightweight React state to control one open accordion item at a time.

Accessibility strategy:

- Real `<button>` controls are used for every FAQ question.
- Each button includes `aria-expanded`.
- Each button is connected to its panel with `aria-controls`.
- Each panel uses `role="region"` and `aria-labelledby`.
- Focus-visible styling is provided in the homepage stylesheet.
- The component receives `dir` so English and Arabic layouts stay LTR/RTL-safe.

No dependencies were added.

## 4. English/Arabic FAQ content summary

The FAQ covers:

- What DrMuscat is.
- That DrMuscat is a public healthcare discovery platform for Oman.
- Supported provider categories including doctors, clinics, hospitals, labs, pharmacies, beauty centers, pet clinics, wellness providers, services, and special offer previews.
- That DrMuscat does not provide medical advice, diagnosis, or treatment recommendations.
- That provider details can appear after review and approval.
- That users should confirm hours, services, prices, offers, availability, appointments, and location directly with providers.
- That Special Offers and sponsored visibility are not medical quality rankings.
- That direct actions such as WhatsApp, call, directions, and profile viewing can be supported when details are approved and available.
- That DrMuscat supports Arabic and English discovery in Oman with RTL-aware design.

## 5. Trust/Safety content summary

`HomeTrustSafety2026` adds a compact, high-trust section after the FAQ. It explains in visible English and Arabic text that:

- DrMuscat helps users explore public provider information in Oman.
- DrMuscat is not medical advice.
- Sponsored visibility and Special Offers are not medical quality rankings.
- Users should confirm details directly with providers.

Trust pills reinforce:

- Public discovery only.
- Not medical advice.
- Confirm with provider.
- Sponsored visibility is clearly marked.
- Offers appear after review.

## 6. SEO/LLM visibility notes

This phase improves visible homepage copy for search engines and LLMs without adding structured data. The visible FAQ and Trust/Safety copy clarifies DrMuscat's role, Oman scope, bilingual support, provider categories, medical-safety boundaries, offer/sponsorship boundaries, and direct-provider confirmation guidance.

No metadata, sitemap, robots, or llms.txt changes were made.

## 7. FAQ schema decision and JSON-LD deferral

Visible FAQ UI was added and the FAQ data is structured in a way that can be governed for schema readiness later.

`FAQPage` JSON-LD was intentionally deferred because DrMuscat is a medical/health discovery platform and structured data must be governed carefully. Any future FAQ schema should be handled in a dedicated SEO/schema PR with explicit medical-safe schema governance.

## 8. Articles deferral decision

Articles were intentionally not built in this PR.

A future Medical Editorial Foundation PR is required before Articles can be added. That separate scope should define author/reviewer rules, reviewed dates, source policy, medical disclaimer patterns, editorial workflow, schema governance, and Arabic/English medical content rules.

## 9. Accessibility notes

- FAQ uses semantic section markup with an accessible heading relationship.
- FAQ questions use real buttons, not div-buttons.
- FAQ buttons expose `aria-expanded` and `aria-controls`.
- FAQ panels expose region semantics linked to their button labels.
- Focus-visible styling is included for keyboard users.
- Trust/Safety uses semantic section markup and readable text contrast.
- No motion or animation library was added.

## 10. Arabic/RTL notes

- Both components accept the existing homepage `dir` value.
- Arabic copy is rendered in RTL context on Arabic pages.
- CSS uses logical properties where relevant for spacing, sizing, and alignment.
- Arabic line-height receives additional breathing room for readability.
- Mobile layout collapses to one column and avoids horizontal overflow.

## 11. No backend/database/SEO infra changes confirmation

Confirmed unchanged scope:

- No backend.
- No API routes.
- No database changes.
- No Supabase changes.
- No RLS changes.
- No migrations.
- No seed rows.
- No route creation.
- No sitemap changes.
- No robots changes.
- No llms.txt changes.
- No metadata changes.
- No JSON-LD/schema additions.
- No package or dependency changes.
- No Articles routes or article cards.
- Header/footer, Search Hero, Featured Provider Board, Discovery Categories, Special Offers Showcase, and Provider CTA internals were not modified.

## 12. Validation results

- `git status --short` completed and showed only the planned working tree changes before commit.
- `pnpm lint` passed with existing warnings in prototype/reference and existing public detail files.
- `pnpm typecheck` passed.
- `pnpm build` passed.
- `pnpm routes:check` passed.

## 13. Manual QA notes

Manual QA was performed with the production server (`pnpm start`) after a successful build and a fetch-based page content check for:

- `/en/om` desktop content presence.
- `/ar/om` desktop content presence.
- `/en/om` mobile layout scope by responsive CSS review.
- `/ar/om` mobile RTL layout scope by responsive CSS review.

Checklist status:

- FAQ is mounted after Provider CTA.
- Trust/Safety is mounted after FAQ.
- FAQ accordion uses accessible buttons and opens/closes through lightweight state.
- English FAQ/Trust copy is present on `/en/om`.
- Arabic FAQ/Trust copy is present on `/ar/om`.
- Arabic layout uses the provided `dir="rtl"` flow.
- Trust/Safety is compact and readable.
- Copy avoids medical advice claims, quality ranking claims, fake prices, fake ratings, fake reviews, fake availability, and guaranteed outcomes.
- No FAQPage JSON-LD was added.
- No new routes were added.
- No DB/API/Supabase/RLS/SEO infra/package changes were added.

## 14. Next PR recommendation

Recommended next PR options:

1. `UI-K-HOME-2026-I — Homepage Final SEO/LLM Metadata Audit`
2. `UI-K-CONTENT-2026-A — Medical Editorial / Articles Foundation`

## 15. FIX01 — Mobile + RTL polish summary

`PR #166-FIX01` applied targeted UI polish only to the FAQ and Trust/Safety foundation. The sections were not rebuilt, FAQ content was preserved, Trust/Safety content was preserved, and no homepage order or unrelated homepage section changes were made.

FIX01 scope:

- Added CSS scroll offset protection to the FAQ and Trust/Safety section containers so mobile scroll positioning has safe space below the sticky header without editing the header.
- Refined the desktop FAQ grid from the initial heavier right-column balance to a slightly calmer left/right ratio.
- Reduced mobile FAQ vertical weight by tightening section padding, shell gaps, card gaps, question padding, question font size, icon size, and answer line spacing.
- Reduced mobile Trust/Safety height by tightening shell padding, grid gaps, icon size, body text size/line-height, pill gaps, and pill padding.
- Fixed the Arabic FAQ plus/minus rendering alignment by centering the icon strokes with physical `top`/`left` positioning inside the icon circle, avoiding RTL logical-position drift inside the icon itself.
- Preserved accessible FAQ button behavior, `aria-expanded`, `aria-controls`, linked panels, and semantic Trust/Safety markup.

## 16. FIX01 Arabic/RTL notes

- Arabic FAQ and Trust/Safety still receive the page `dir="rtl"` value from the existing homepage integration.
- Arabic question text remains naturally right-aligned via `text-align: start` in an RTL context.
- The FAQ icon strokes no longer depend on `inset-inline-start` for internal centering, preventing the plus/minus mark from visually drifting in Arabic.
- Arabic paragraph line-height remains slightly more generous than English, with a compact mobile override to avoid excessive vertical height.
- Trust/Safety pills continue to wrap naturally in Arabic without clipping or hidden content.

## 17. FIX01 validation results

- `git status --short` completed before validation and showed only the planned CSS/documentation changes.
- `pnpm lint` passed with existing repository warnings only.
- `pnpm typecheck` passed.
- `pnpm build` passed.
- `pnpm routes:check` passed.

## 18. FIX01 manual QA notes

Manual QA checklist status:

- FAQ has mobile scroll offset protection for sticky-header overlap.
- Mobile FAQ cards are more compact while preserving readable/tappable controls.
- Mobile FAQ no longer presents as a wall of oversized buttons.
- Mobile Trust/Safety is shorter, compact, and premium while keeping all trust pills visible.
- Trust/Safety bottom spacing was reduced for mobile.
- Desktop FAQ remains visually balanced with a small left/right ratio refinement.
- Arabic FAQ plus/minus icon strokes remain centered inside the icon circle.
- Arabic FAQ rows remain unified cards with consistent padding and no clipped text.
- English LTR and Arabic RTL content remains preserved.
- No schema or JSON-LD was added.
- No Articles were added.
- No DB/API/Supabase/RLS/SEO/package changes were made.
- Header/footer, Search Hero, Featured Provider Board, Discovery Categories, Special Offers, and Provider CTA were not edited.

## 19. FIX01 merge-readiness recommendation

After FIX01, `UI-K-HOME-2026-H` remains merge-ready from an implementation standpoint, pending reviewer approval.
