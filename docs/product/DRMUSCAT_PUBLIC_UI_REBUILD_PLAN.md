# DrMuscat Public UI Rebuild Plan

## 1. Strategic decision

* PR #153 is frozen.
* PR #153 must not be merged now.
* PR #153 must not be closed yet.
* PR #153 is used only as reference and lesson source.
* New work starts from clean main.
* Future work must be split into small PRs.
* Each PR must have one purpose and one safe scope.
* Each PR must pass validation before merge.
* The Claude UI Kit visual reference path is locked as:
  `docs/prototype-reference/drmuscat-ui-kit-2026-v2/`

## 2. Why PR #153 is frozen

* It became too large.
* Too many files changed.
* Further prompts became unreliable.
* Fixes did not consistently apply.
* It mixed route scaffolds, homepage, articles, auth pages, listing pages, footer/header, CSS, pricing, floating actions, and profile ideas.
* It is safer to rebuild cleanly with small PRs.

The replacement strategy is to preserve PR #153 only as a warning/reference source while restarting public UI implementation from clean main with narrow, reviewable PRs.

## 3. Claude UI Kit visual reference decision

* Claude UI Kit is approved as the visual reference.
* The exact confirmed Claude reference path is:
  `docs/prototype-reference/drmuscat-ui-kit-2026-v2/`
* The primary files are:
  `DrMuscat Design System (2).zip`
  `DrMuscat Web UI Kit (1).html`
* The Arabic font feeling from Claude UI Kit is preferred.
* The search-first hero from Claude UI Kit is preferred.
* The green/teal mobile visual tone is preferred.
* The card style, spacing, modern healthcare look, and premium calm style are preferred.
* The implementation must be rebuilt inside DrMuscat rules, not blindly copied.

Claude UI Kit is the visual source of truth. DrMuscat architecture, approved routes, data rules, security rules, SEO guardrails, and phased build locks remain the technical and product source of truth.

## 4. Product goals

DrMuscat must feel like:

* a premium Oman healthcare discovery platform
* trusted and calm
* serious enough for clinics, hospitals, doctors, pharmacies, labs, beauty/wellness, and pet clinics
* search-first
* SEO/GEO-ready
* bilingual English/Arabic
* RTL-safe
* mobile-first
* desktop-polished
* fast
* monetization-ready
* not a test UI
* not a cheap directory
* not a fake medical ranking site

## 5. Safety boundaries

Every future PR must preserve:

* database
* Supabase
* migrations
* RLS
* generated database types
* backend APIs
* auth backend
* payment backend
* sitemap
* robots
* llms.txt
* package/lockfiles
* CI

Unless a later task explicitly approves one of these.

Future phases must also preserve the active DrMuscat rules for PHASED_BUILD_ONLY mode, four-axis phase mapping, no fake passing tests, no unapproved Persian or Hindi SEO routes, no unapproved private-data RLS expansion, and no unapproved seed rows.

## 6. Medical trust rules

Future UI must never:

* invent ratings
* invent reviews
* invent review counts
* invent medical quality rankings
* say “best doctor” or “top clinic” without verified ranking framework
* imply sponsored providers are medically better
* give diagnosis or treatment advice
* guarantee results
* show fake availability
* show fake phone numbers or WhatsApp numbers
* claim a listing is verified unless it is approved or clearly preview-labeled

Must always support:

* “No reviews yet” empty state
* reviews/comments pending moderation
* sponsored placement disclaimer
* confirm details directly with provider
* general information only disclaimers
* no fake medical claims

## 7. Required product modules

Future public UI must cover:

* Homepage
* Doctors listing
* Centers listing
* Hospitals listing
* Pharmacies listing
* Labs listing
* Services listing
* Search page
* Article index
* Article detail
* Doctor profile
* Center profile
* Hospital profile
* Pharmacy profile
* Lab profile
* Service/wellness/pet profile
* For Providers
* Pricing plans
* Advertising add-ons
* Offers/packages
* List your center
* Register
* Sign in
* Global floating WhatsApp / AI support
* FAQ
* Reviews
* Ratings
* Comments
* Related providers
* Related articles
* Sponsored placements
* Care Stories later
* AI Concierge later

These modules include doctors, centers, hospitals, pharmacies, labs, services, search, profiles, articles, ads, offers, pricing, reviews, ratings, comments, FAQ, RTL, Arabic typography, provider lead blocks inside articles, Care Stories later, and AI Concierge later.

## 8. Required monetization modules

Must be planned from the beginning:

Provider subscription plans:

Basic:

* Free

Plus:

* 3 months: 25 OMR
* 6 months: 45 OMR
* 12 months: 82 OMR

Premium:

* 3 months: 65 OMR
* 6 months: 117 OMR
* 12 months: 213 OMR

Enterprise / Elite:

* 3 months: 160 OMR
* 6 months: 288 OMR
* 12 months: 525 OMR

Advertising add-ons:

* Homepage Featured Card

  * launch: 30 OMR / 30 days
  * normal: 50 OMR / 30 days
* Homepage Top Sponsored Slot

  * launch: 60 OMR / 30 days
  * normal: 90 OMR / 30 days
* Category Featured Placement

  * launch: 20 OMR / 30 days
  * normal: 35 OMR / 30 days
* Area Featured Placement

  * launch: 15 OMR / 30 days
  * normal: 25 OMR / 30 days
* Article sponsored provider placement
* Profile sponsored related provider placement
* Future story/video package for Premium/Enterprise

Mandatory disclaimer:
“Sponsored placement is paid visibility, not medical quality ranking.”

Arabic:
"الموضع الممول يعني ظهوراً مدفوعاً ولا يعني تصنيفاً لجودة الرعاية الطبية."

## 9. Required offer/package support

Doctors, clinics, hospitals, labs, beauty/wellness, and pet clinics must be able to show offers/packages later.

Offer UI must support:

* title
* description
* related service/category
* price/discount text
* validity
* terms
* approval status
* CTA
* no guaranteed result claims
* no medical superiority claims
* approval required before public display

## 10. Required reviews/ratings/comments support

Doctor and provider profiles must support:

* rating summary
* “No reviews yet”
* 5-star distribution bars
* review form
* comment form
* pending moderation
* moderation note
* no fake ratings
* no fake review counts

Article detail pages must support:

* comments
* pending moderation
* no fake public comments

## 11. Required article lead system

Every article detail page must support provider lead/ad placements:

* related providers after intro
* sponsored/related provider block inside article
* related providers near article end
* related articles
* related services
* FAQ
* comments
* disclaimer
* CTA to search/providers

Mapping:

* Dental care articles → dentists / dental clinics
* Lab test articles → labs / diagnostic centers
* Pharmacy articles → pharmacies
* Clinic guide articles → clinics / medical centers / hospitals
* Pet care articles → pet clinics
* Wellness articles → wellness / beauty / physiotherapy
* General guide articles → doctors / centers / hospitals / pharmacies / labs

## 12. Hospital support

Hospitals must be first-class public discovery entities.

Future UI must include:

* hospitals listing
* hospital profile
* departments
* doctors at hospital
* contact actions
* area/city
* services
* articles
* FAQ
* safety disclaimers
* no fake emergency availability claims

## 13. Location hierarchy

Must preserve strict:
Country → City → Area

Oman active.

Other countries can be “Coming soon” if shown:

* UAE
* Saudi Arabia
* Qatar
* Bahrain
* Kuwait
* Iran

City must contain only cities.
Area must contain only neighborhoods/districts for the selected city.

Do not mix Muscat areas into City dropdown.
Do not mix Oman cities into Area dropdown.

## 14. Performance goals

Public UI must target:

* fast loading
* low JS
* no heavy animation libraries unless already approved
* image/media lazy loading
* no huge client-only page if not needed
* minimal layout shift
* responsive CSS
* accessible interactions
* prefers-reduced-motion support
* mobile and desktop polish

## 15. Final PR #153 closure rule

PR #153 should only be closed after replacement PRs are merged and verified.
