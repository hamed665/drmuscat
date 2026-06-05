# DrMuscat Public UI Phase Roadmap

Use this exact phase order.

## PR #154 — Planning and visual reference lock

Scope:

* documentation only
* freeze PR #153 as reference
* document exact Claude visual reference path:
  `docs/prototype-reference/drmuscat-ui-kit-2026-v2/`
* lock Claude UI Kit as visual source of truth

Forbidden:

* no UI implementation
* no CSS
* no components
* no routes
* no database
* no backend

Routes affected:

* none

Validation required:

* git status
* no forbidden files changed
* no code implementation
* no database files changed
* no route files changed
* exact Claude reference path documented

Merge criteria:

* all four PR #154 planning documents exist under `docs/product/`
* exact Claude visual reference path is documented
* primary files are documented
* PR #153 is documented as frozen/reference only
* no forbidden files are changed

## PR #155 — Global design system foundation

Scope:

* color tokens based on Claude UI Kit
* Arabic typography based on Claude UI Kit
* English typography
* header/footer base
* RTL base
* buttons/cards/inputs/selects
* floating support base
* shared layout containers

Forbidden:

* no page rebuild
* no database
* no backend
* no payment

Routes affected:

* global shell/shared layout only, as explicitly approved in the PR #155 task

Validation required:

* pnpm typecheck
* pnpm lint if available
* pnpm build
* pnpm routes:check

Merge criteria:

* shared design foundation matches the locked Claude visual reference direction
* Arabic and English typography are coherent
* RTL base is safe
* no database, backend, payment, or route rebuild work is included

## PR #156 — Homepage public shell

Scope:

* Claude-style search hero
* country/city/area search
* featured providers carousel
* categories
* areas
* articles preview
* care journey
* trust layer
* FAQ
* provider CTA
* footer

Forbidden:

* no database
* no backend
* no payment
* no private-data RLS
* no fake ratings, reviews, or medical rankings
* no unapproved routes

Routes affected:

* approved localized public homepage routes only, as explicitly approved in the PR #156 task

Validation required:

* pnpm typecheck
* pnpm lint if available
* pnpm build
* pnpm routes:check

Merge criteria:

* homepage follows the Claude search-first visual direction
* country/city/area hierarchy is not mixed
* EN/AR and RTL behavior are verified
* sponsored or provider claims are not faked

## PR #157 — Discovery listing pages

Scope:

* doctors
* centers
* hospitals
* pharmacies
* labs
* services
* search
* filters
* listing cards
* sponsored slots
* SEO/GEO text
* FAQ

Forbidden:

* no database
* no backend
* no payment
* no private-data RLS
* no fake provider quality claims
* no fake availability
* no unapproved route patterns

Routes affected:

* approved localized doctors, centers, hospitals, pharmacies, labs, services, and search listing routes only, as explicitly approved in the PR #157 task

Validation required:

* pnpm typecheck
* pnpm lint if available
* pnpm build
* pnpm routes:check

Merge criteria:

* listing cards are consistent across provider types
* sponsored slots are clearly labeled
* SEO/GEO copy is not thin or fake
* filters preserve Country → City → Area hierarchy

## PR #158 — Profile detail pages

Scope:

* doctor profile
* center profile
* hospital profile
* pharmacy profile
* lab profile
* service/wellness/pet profile
* reviews
* ratings
* comments
* offers/packages
* gallery/video
* FAQ
* related providers/articles
* sponsored slots

Forbidden:

* no database
* no backend
* no payment
* no private-data RLS
* no fake ratings
* no fake reviews
* no fake emergency availability claims
* no unverified “best” or “top” claims

Routes affected:

* approved localized public profile detail routes only, as explicitly approved in the PR #158 task

Validation required:

* pnpm typecheck
* pnpm lint if available
* pnpm build
* pnpm routes:check

Merge criteria:

* profile pages use premium health-card visual hierarchy
* no fake reviews, ratings, or claims are introduced
* offers/packages are preview-safe and approval-aware
* related providers/articles and FAQ areas are included where approved

## PR #159 — Articles and article provider lead system

Scope:

* article index
* article detail
* video support
* comments
* FAQ
* related articles
* related provider ads
* sponsored placements in articles
* medical disclaimer

Forbidden:

* no database
* no backend
* no payment
* no private-data RLS
* no fake comments
* no diagnosis or treatment advice
* no unsupported schema.org markup

Routes affected:

* approved localized article index and article detail routes only, as explicitly approved in the PR #159 task

Validation required:

* pnpm typecheck
* pnpm lint if available
* pnpm build
* pnpm routes:check

Merge criteria:

* articles feel like a healthcare magazine
* provider lead blocks are clearly related or sponsored
* comments show moderation behavior and no fake public comments
* medical disclaimer is present

## PR #160 — For Providers, pricing, ads, offers

Scope:

* Basic/Plus/Premium/Enterprise pricing
* billing selector
* add-ons
* offers system UI
* checkout preview only
* onboarding selection
* no payment backend

Forbidden:

* no database
* no backend
* no real payment processing
* no checkout gateway
* no entitlement activation
* no private-data RLS

Routes affected:

* approved For Providers, pricing, ads, offers, and onboarding-selection UI routes only, as explicitly approved in the PR #160 task

Validation required:

* pnpm typecheck
* pnpm lint if available
* pnpm build
* pnpm routes:check

Merge criteria:

* pricing terms match approved planning values
* sponsored-placement disclaimer is present in English and Arabic
* checkout is clearly preview-only with no payment backend behavior
* offers UI avoids guaranteed results and medical superiority claims

## PR #161 — Auth/register/list your center UI

Scope:

* sign in
* register
* role selection
* list your center
* plan preselection
* provider type
* phone-first
* Google/OTP/email-password preview only
* no real auth backend

Forbidden:

* no auth backend changes
* no database
* no backend APIs
* no payment
* no private-data RLS
* no real OTP, Google auth, or email-password flow changes

Routes affected:

* approved sign-in, register, and list-your-center UI routes only, as explicitly approved in the PR #161 task

Validation required:

* pnpm typecheck
* pnpm lint if available
* pnpm build
* pnpm routes:check

Merge criteria:

* auth/register screens are clearly UI-only where backend is not approved
* provider type and plan preselection are visually represented without backend assumptions
* no auth backend or payment behavior is changed

## PR #162 — Premium interactions

Scope:

* Care Stories
* Liquid Glass controlled styling
* micro-interactions
* AI Concierge command palette UI-only
* loading skeletons
* bento refinements
* map preview

Forbidden:

* no AI chat backend
* no database
* no backend APIs
* no payment
* no heavy animation library unless explicitly approved
* no private-data RLS

Routes affected:

* approved public UI surfaces receiving interaction polish only, as explicitly approved in the PR #162 task

Validation required:

* pnpm typecheck
* pnpm lint if available
* pnpm build
* pnpm routes:check

Merge criteria:

* premium interactions respect `prefers-reduced-motion`
* Liquid Glass use preserves contrast and readability
* AI Concierge remains UI-only
* no backend or database behavior is introduced

## PR #163 — Final QA, SEO, performance, RTL gate

Scope:

* route audit
* 404 audit
* EN/AR audit
* RTL audit
* mobile/desktop audit
* Core Web Vitals focus
* no fake claims
* sponsored labels
* FAQ presence
* validation

Forbidden:

* no new feature expansion beyond approved QA fixes
* no database
* no backend
* no payment
* no private-data RLS
* no route rewrites unless explicitly approved as QA fixes

Routes affected:

* all approved public UI rebuild routes from PR #155 through PR #162, audit-only unless an explicit QA fix is approved

Validation required:

* pnpm typecheck
* pnpm lint if available
* pnpm build
* pnpm routes:check
* pnpm test:db:rls when relevant and safe

Merge criteria:

* route and 404 audit is clean
* EN/AR and RTL behavior are verified
* mobile and desktop rendering are polished
* fake claims, fake ratings, fake reviews, and unlabeled sponsored placements are absent
* implementation validation passes or any environment limitation is documented honestly

## Required phase fields

Each phase must include:

* allowed scope
* forbidden scope
* routes affected
* validation required
* merge criteria

## Validation required for implementation PRs

* pnpm typecheck
* pnpm lint if available
* pnpm build
* pnpm routes:check
* pnpm test:db:rls when relevant and safe

## PR #154 validation

Since PR #154 is docs only:

* git status
* no forbidden files changed
* no code implementation
* no database files changed
* no route files changed
* exact Claude reference path documented
