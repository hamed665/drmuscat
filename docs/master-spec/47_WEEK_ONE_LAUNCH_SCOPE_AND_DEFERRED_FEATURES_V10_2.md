# 47 — Week-One Launch Scope and Deferred Features V10.2

V10.2 defines a large platform. Week-one launch must remain disciplined.

## Week-One Must Ship

- self-hosted deployment foundation
- English and Arabic public site
- country-aware `/[locale]/om/...` routes
- homepage
- centers listing
- center profile
- doctors listing/profile foundation
- geo hierarchy seed for Oman/Muscat core areas
- provider plans foundation
- free listing and paid plan definitions
- public anonymous discovery
- soft signup nudges
- no Health Card/card sales
- patient offers foundation
- admin basic CRUD for centers/doctors/services/categories/geo
- claim profile form
- WhatsApp/call/direction tracking
- pg_trgm fuzzy search
- SEO metadata/canonical/hreflang/sitemap/robots/schema
- llms.txt
- cookie consent banner foundation
- legal document foundation
- settings engine foundation
- feature flags foundation
- behavior event tracking foundation
- sponsored slot foundation, labeled only
- premium skeleton/polish states
- performance budget

## Deferred After Week One

- AI chat full RAG
- Meilisearch
- AI query understanding
- full wallet/CPC ads
- full payment gateway integration beyond manual/payment readiness
- full Web Push delivery
- advanced notification preferences
- My Health Hub full timeline/family profiles
- full center dashboard intelligence
- self-service ad builder
- native sponsored content
- anomaly detection
- session replay
- dark mode
- sound design
- custom cursor
- doctor before/after gallery production workflow
- full country expansion beyond Oman

## Rule

If a feature is not in Week-One Must Ship, code may include clean extension points only. It must not ship half-implemented UI that looks functional but has no safe backend. Humanity has made enough fake buttons already.
