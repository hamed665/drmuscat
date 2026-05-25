# 04_DESIGN_SYSTEM_TOKENS_AND_COMPONENTS.md

# Design System Tokens and Component Discipline

## 1. Core Design Rule
DrMuscat must use a strict shared design system. No page may invent a separate visual style. Claude Code must not create different button/card/badge implementations in every page like a CSS flea market.

## 2. Brand Feel
- premium
- warm
- modern
- calm
- local to Muscat
- medically credible
- slightly luxurious
- mobile-first
- fast

## 3. Color Tokens
Recommended tokens:
```ts
const colors = {
  brand: {
    teal: '#0F766E',
    tealDark: '#115E59',
    tealSoft: '#CCFBF1',
    gold: '#C49A3A',
    goldSoft: '#FFF3C4',
    ivory: '#FFFCF4',
  },
  text: {
    primary: '#0F172A',
    secondary: '#475569',
    muted: '#64748B',
    inverse: '#FFFFFF',
  },
  border: '#E2E8F0',
  status: {
    success: '#16A34A',
    warning: '#D97706',
    danger: '#DC2626',
    info: '#2563EB',
    neutral: '#64748B'
  }
}
```

## 4. Spacing Scale
Use only:
- 4px
- 8px
- 12px
- 16px
- 24px
- 32px
- 48px
- 64px
- 96px

Avoid random values unless justified.

## 5. Radius Scale
- sm: 8px
- md: 12px
- lg: 16px
- xl: 24px
- full: 999px

## 6. Shadow Scale
- soft
- card
- elevated
- premium
- focus

Shadows must be subtle. No cheap harsh shadows.

## 7. Typography
Requirements:
- readable on mobile
- strong headings
- comfortable line-height
- Arabic RTL rendering checked
- dashboard tables readable
- forms readable
- no tiny low-contrast text

## 8. Responsive Tokens
Breakpoints:
- base mobile-first
- sm 640px
- md 768px
- lg 1024px
- xl 1280px
- 2xl 1536px

Containers:
- mobile: full width + 16px padding
- tablet: full width + 24px padding
- desktop: max-width 1200px
- wide: max-width 1280/1440 depending section

Section padding:
- mobile: 48px vertical / 16px horizontal
- tablet: 64px / 24px
- desktop: 80-96px / 32px

## 9. CTA Hierarchy
Primary: teal background, white text. Main action.
Secondary: ivory/white with teal text/border.
Premium: soft gold treatment for Patient Offer/premium partner.
Danger: destructive admin only.

## 10. Required Core Components
- Button
- Card
- Badge
- Input
- Select
- Textarea
- Checkbox
- RadioGroup
- FormField
- ErrorMessage
- ConfirmDialog
- Toast
- Breadcrumbs
- Pagination
- Tabs
- Modal
- Sheet
- Skeleton
- EmptyState
- MobileStickyCTA
- LocalizedLink
- LocalizedTabs
- MetricCard
- CommandSearch
- DateRangePicker
- FileUploadDropzone

## 11. Required Business Components
- CenterCard
- CenterProfileHero
- CenterContactActions
- CenterStatusBadges
- DoctorCard
- DoctorProfileHero
- SearchFilters
- KanbanBoard
- StatusColumn
- ApprovalQueue
- OfferBadge
- PartnerBadge
- WorkspaceSelector

## 12. Responsive Component Rules
- Button supports mobile full width.
- Card stacks on mobile.
- Badge wraps safely.
- Modal becomes near full-screen on mobile.
- Sheet supports bottom drawer.
- Tables have responsive alternatives.
- Sticky CTA respects safe area.
- LanguageSwitcher fits compact header.
- SearchFilters works as desktop sidebar and mobile drawer.

## 13. RTL Component Rules
All components must work in LTR and RTL. Icons with direction meaning must flip when needed. Margin/padding must not be hardcoded only for LTR.


## 14. V10 Premium Creative Direction
The visual system must be modern, distinctive, and Oman-aware without becoming heavy or gimmicky.

Required creative language:
- soft medical trust: clean surfaces, calm spacing, strong readability
- premium local accent: restrained gold details, Muscat-inspired gradients, subtle map/area chips
- high-end marketplace feel: confident cards, clear badges, sticky mobile CTAs, fast search
- no stock-template hero sections that look like every SaaS landing page produced during a caffeine shortage

Homepage must include:
- premium hero with search-first interaction
- quick category chips
- area chips for Muscat neighborhoods
- Patient Offer value block
- featured partner cards
- trust/explanation section
- For Partners CTA
- article/content preview

Design must use CSS variables/design tokens only. No hardcoded random colors in components.

## 15. V10 Required Component Name Resolution
Canonical component names:
- `LocalizedLink`, not `LanguageAwareLink`
- `LocalizedTabs`
- `SearchFilters`
- `CenterFilters` as a center-specific wrapper around `SearchFilters`
- `OfferBadge`
- `PartnerBadge`
- `WorkspaceSelector`
- `ImageUploadDropzone`
- `OptimizedImagePreview`
- `AdminSettingsShell`

Claude Code must update imports to these names and must not create duplicate names for the same purpose.
