# 43 — Payment Gateways, Dynamic Plans and Upgrade Nudges V10.2

DrMuscat must support provider monetization without hard-coding pricing or payment gateways.

## Payment Gateway Priority

Launch:

1. Manual bank transfer / receipt upload
2. Thawani readiness

Later:

3. Tap Payments
4. MyFatoorah
5. Stripe only if international need exists

## Payment Gateway Abstraction

Every gateway must implement a common interface:

- create payment
- capture/verify payment
- refund if supported
- verify webhook
- get status

Gateway config must be encrypted or stored using server-side secret management. Never expose gateway secret keys to client bundles.

## Dynamic Plans

Provider plan configuration must live in the database. Admin must be able to edit:

- plan name EN/AR
- active/recommended status
- display order
- monthly/quarterly/biannual/annual prices
- feature limits
- available provider types
- available countries
- trial settings if explicitly enabled later

Canonical provider ladder remains:

1. Free Listing
2. Verified Starter
3. Growth Partner
4. Premium / Ads Pro

## Upgrade Nudges

Upgrade prompts must be strategic, not annoying.

Allowed nudge types:

- permanent sidebar hint
- locked feature tooltip
- milestone modal after first WhatsApp click
- limit approach warning
- positive review streak suggestion
- privacy-safe competitor pulse

Anti-annoyance rules:

- max 1 modal/day
- 7-day cooldown after dismiss
- 30-day cooldown after 3 dismissals
- stop after upgrade
- never show on login/signup/password reset

## Pricing Change Policy

Changing plan prices must not unexpectedly alter existing subscriptions unless a plan's pricing policy explicitly says so. Default:

- existing subscriptions keep their price until renewal or grandfathered policy applies
- notify users before renewal price changes
- log admin change in audit trail
