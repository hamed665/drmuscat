# 26_CREATIVE_UI_ADMIN_AND_SETTINGS_REQUIREMENTS.md

# Creative UI, Premium Admin Panel and Settings Requirements

## 1. Purpose
DrMuscat must be beautiful, fast, serious and commercial. The public site must feel premium enough for clinics to pay for. The admin panel must be powerful enough to operate the business without editing code every time a human changes their mind, which humans do with alarming consistency.

## 2. Public Site Creative Requirements
The site must not look like a generic healthcare directory.

Required creative elements:
- search-first premium hero
- elegant Oman/Muscat locality cues without cheap tourist clutter
- strong center cards with trust badges
- Patient offer / provider plan commercial block with premium treatment
- area/category chips
- sticky mobile contact CTA
- calm medical color palette with restrained gold accents
- fast-loading visual depth using gradients, borders, spacing and typography instead of heavy animation
- clear trust hierarchy: verified, partner, offer available, license pending/verified

Do not use:
- fake ratings
- fake reviews
- stock medical cliché overload
- heavy Lottie/animation libraries
- autoplay video
- low-contrast text
- client-only public SEO pages

## 3. Admin Panel Product Standard
The admin panel is not a raw database table browser. It must be a controlled operations dashboard with role-gated workflows.

Required admin modules:
- overview dashboard
- approval center
- organizations
- centers
- doctors
- users/profiles
- roles and organization members
- claims
- media review
- licenses
- billing
- payments
- subscriptions
- invoices
- ledger overview
- patient offers and offer claims
- CRM/leads overview
- articles/content
- ads and placements
- microsites
- system settings
- SEO settings
- homepage settings
- menu/navigation builder
- translation editor
- feature flags
- audit logs read-only

## 4. Admin Settings Requirements
Settings must be stored in `public.settings` as JSONB with validation in server actions.

Do not store secrets in editable public settings. Secrets remain environment variables.

Required setting groups:

### Site Identity
- site name
- default locale
- enabled locales
- contact phone
- WhatsApp number
- support email
- social links
- logo media id
- favicon media id

### Homepage Modules
- hero title/subtitle per locale
- featured categories
- featured areas
- featured centers
- Patient offer block
- partner CTA block
- article preview settings
- module ordering
- module visibility

### SEO Settings
- default meta title/description per locale
- robots defaults
- sitemap settings
- hreflang defaults
- noindex controls
- OG image media id
- canonical domain

### Menu Builder
- header menu per locale
- footer menu per locale
- dashboard shortcuts
- external link validation

### Feature Flags
- doctors directory enabled
- Patient offers enabled
- microsites enabled
- ads enabled
- marketer referrals enabled
- articles enabled
- Persian disabled in MVP
- Hindi/Urdu future disabled

### Billing Settings
- currency OMR
- invoice prefix
- invoice numbering display rules
- manual payment instructions per locale
- bank transfer instructions
- receipt upload rules

### Media Settings
- max image size
- max PDF size
- derivative sizes
- allowed MIME types
- image quality presets
- admin approval required

### Legal / Disclaimer Settings
- medical disclaimer text per locale
- privacy policy content source
- partner terms source
- claim disclaimer

## 5. Admin UX Requirements
- responsive desktop-first with mobile fallback
- command search for admin entities
- saved filters where useful
- clear empty states
- safe destructive actions with confirmation
- optimistic UI only for non-critical actions
- critical actions require server confirmation
- every approval/rejection needs reason or notes where relevant
- all admin mutation responses use standardized success/error format

## 6. Admin Security Requirements
- every admin page checks role server-side before rendering
- every admin mutation checks role server-side before changing data
- service role only in server-only modules
- settings changes audit-logged
- role changes audit-logged
- approval changes audit-logged
- payment/subscription changes audit-logged
- no admin-only data in public client bundles

## 7. Admin Design Requirements
Admin panel should feel modern and powerful:
- dashboard cards
- side navigation
- top command search
- status badges
- review queue cards
- split view approval detail
- activity timeline
- media preview panel
- billing action panel
- audit trail panel

No raw unstyled tables unless wrapped in the shared `DashboardTable` component.
