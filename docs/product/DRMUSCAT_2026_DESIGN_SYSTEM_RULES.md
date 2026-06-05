# DrMuscat 2026 Design System Rules

## 1. Visual source of truth

The approved visual source of truth is:

`docs/prototype-reference/drmuscat-ui-kit-2026-v2/`

Primary files:

* `DrMuscat Design System (2).zip`
* `DrMuscat Web UI Kit (1).html`

Use this reference for:

* Arabic typography feeling
* green/teal palette
* search-first layout
* premium cards
* calm medical tone
* rounded inputs
* soft shadows
* spacing
* mobile-first polish
* desktop polish
* editorial article style

Do not copy:

* route logic
* backend logic
* fake state
* dead links
* unreviewed CSS chaos

## 2. Brand color system

Define the intended color direction:

* primary: premium green/teal
* secondary: soft mint / medical green
* dark: deep navy/charcoal text
* muted: slate
* background: warm off-white / clean healthcare neutral
* WhatsApp green must be distinct from DrMuscat primary
* sponsored label color must be visible but not loud

Important:
Mobile and desktop must use the same brand color tokens.
Do not allow desktop to become blue while mobile is green.

## 3. Arabic typography

Arabic must look premium and readable.

Preferred safe stack:
"IBM Plex Sans Arabic", "Noto Sans Arabic", "Tajawal", "Segoe UI", Tahoma, Arial, sans-serif

If the verified Claude reference uses a better available local/safe Arabic font stack, document that as preferred.

Rules:

* Arabic desktop headings must not be oversized.
* Arabic mobile headings must not overflow.
* Arabic nav must be compact.
* Arabic button text must fit.
* Arabic line height must be comfortable.
* Arabic footer must be localized.
* No English footer on Arabic pages.
* No broken machine-like Arabic labels.

## 4. English typography

English must be clean, modern, readable.
Avoid tiny text and overly corporate stiffness.

## 5. Spacing and layout

Rules:

* mobile-first
* desktop must not look like stretched mobile
* max-width containers
* readable article width
* two-column layout for profile desktop
* card grids for discovery
* no horizontal overflow
* no giant blank sections

## 6. Component rules

Core components:

* Button
* Card
* Badge
* Input
* Select
* Search bar
* Location selector
* Provider card
* Sponsored card
* FAQ accordion
* Review block
* Comment form
* Offer card
* Gallery/media card
* Profile hero
* Floating support dock

## 7. CTA rules

Provider card:

* View profile
* WhatsApp
* Call
* Directions

Profile:

* WhatsApp
* Call
* Directions
* Save
* Share
* Claim/update
* Report issue

Global support:

* DrMuscat WhatsApp support
* AI assistant preview

Do not confuse global WhatsApp with provider WhatsApp.

## 8. Sponsored and ads UI

Sponsored must be:

* clearly labeled
* visually premium
* not cheap banner
* not fake ranking
* not medical endorsement

Disclaimer required.

## 9. Reviews/comments UI

Must show:

* honest empty states
* moderation
* no fake ratings
* no fake comments
* no fake count

## 10. Glass/liquid style

Allowed later, controlled:

* search card
* header
* floating support
* provider cards
* pricing cards

Rules:

* contrast first
* readability first
* no excessive blur
* no glass over long article text
* no performance-heavy effects

## 11. Micro-interactions

Allowed:

* hover
* active
* focus
* selected chips
* soft card lift
* validation feedback
* save/favorite pulse

Required:

* prefers-reduced-motion support
* no aggressive animations
* no scroll chaos

## 12. Stories

Care Stories planned later.

Possible categories:

* Dental
* Beauty
* Kids
* Pet Clinic
* Labs
* Offers
* For Providers
* New Centers
* Hospitals

Rules:

* safe, short, non-medical-claim content
* CTA to providers/search/articles
* premium look
* Arabic/English
* no backend initially

## 13. Profile premium visual rules

Profile pages must look like premium health cards:

* hero profile card
* badges
* quick CTAs
* services chips
* offer cards
* rating empty state
* comments/reviews moderation
* gallery/video
* related articles/providers
* FAQ
* safety note

## 14. Articles visual rules

Articles must feel like a health magazine:

* featured guide
* category chips
* video badge
* checklist blocks
* related provider cards
* sponsored provider placements
* comments
* FAQ
* disclaimer
