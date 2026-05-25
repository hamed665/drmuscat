# 39 — Extensibility, Feature Flags, Settings Engine and Dynamic Modules V10.2

DrMuscat must be built as a platform that can grow without database rewrites or code redeploys for every business change. This file is canonical for extensibility.

## Non-Negotiable Platform Rules

1. Feature availability must be controlled by feature flags, plan features, and role permissions.
2. Pricing, plan limits, homepage modules, SEO defaults, notification templates, legal documents, review rules, ad placements, and payment gateways must be admin-configurable.
3. The dashboard menu must use a module registry, not hard-coded sidebar arrays scattered through components.
4. Events must be emitted through a generic event bus so analytics, notifications, billing, CRM, and ads can subscribe without changing business flows.
5. API routes must be versioned from launch: `/api/v1/...`.
6. English and Arabic text must not be hard-coded in business logic. Use translation keys or DB-managed content where content is admin-editable.

## Feature Flags

Feature flags must support:

- enabled/disabled state
- rollout percentage
- plan targeting
- role targeting
- user targeting
- JSON config
- audit trail on changes

Examples:

```text
features.reviews_enabled
features.ai_chat_enabled
features.video_consult_enabled
features.ads_wallet_enabled
features.meilisearch_enabled
features.push_notifications_enabled
```

## Settings Engine

Settings are grouped by category:

- General
- Branding
- SEO & Meta
- Homepage
- Plans & Pricing
- Payment
- Features
- Notifications
- Categories & Areas
- Trust & Reviews
- Ads & Sponsorship
- Legal
- Performance

Every setting must have a type, label in English/Arabic, validation metadata, audit metadata, and cache TTL.

## Dashboard Module Registry

Dashboard modules must register metadata:

```ts
{
  id: 'analytics',
  title: { en: 'Analytics', ar: 'التحليلات' },
  route: '/center/analytics',
  availableForPlans: ['growth', 'premium'],
  availableForRoles: ['center_owner', 'center_staff'],
  order: 30,
  badge: 'New'
}
```

The sidebar, command bar, permissions, onboarding checklist, and feature lock tooltips must consume this registry.

## Event Bus

Required event names include:

```text
center.profile.viewed
center.whatsapp.clicked
center.phone.clicked
center.directions.clicked
offer.claimed
review.submitted
review.approved
ad.impression
ad.clicked
subscription.upgraded
payment.succeeded
payment.failed
claim.submitted
claim.approved
```

Events must be structured and privacy-aware. Do not store raw sensitive medical data in behavior events.
