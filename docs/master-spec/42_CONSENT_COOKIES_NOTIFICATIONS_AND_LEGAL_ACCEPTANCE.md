# 42 — Consent, Cookies, Notifications and Legal Acceptance V10.2

Consent must be legally clean, user-friendly, and logged. Cookie consent and notification permission are separate systems.

## Cookie Categories

Required categories:

1. Necessary — always enabled
2. Analytics — optional
3. Marketing — optional
4. Notifications — optional preference category, not the same as native browser permission

Cookie banner must have equal-weight actions:

```text
Accept All | Reject All | Customize
```

No analytics or marketing cookies may load before consent.

## Consent Logs

Every consent action must log:

- anonymous session hash or user id
- consent version
- preferences JSON
- country-level location only
- summarized user agent
- timestamp

Do not store full IP in consent logs unless legally required and explicitly approved.

## Notification Permission Pattern

Never request browser notification permission on first page load.

Use two-step permission:

1. Soft prompt after engagement, such as viewing 3 center profiles, saving a center, claiming an offer, or submitting a review.
2. Browser native permission only after user clicks yes.

## Frequency Caps

Default limits:

- max 2 notifications/day/user
- max 7 notifications/week/user
- quiet hours default 22:00-08:00
- Ramadan timing support later

## Legal Documents

Required versioned documents:

- Terms of Use
- Privacy Policy
- Medical Disclaimer
- Review Policy
- Partner Agreement
- Marketer Agreement later
- Patient Offer Terms

Signup must require explicit unchecked acceptance of Terms, Privacy Policy, and Medical Disclaimer. Notification consent must be separate and optional.

## Re-Acceptance

If a legal document version has `requires_reacceptance = true`, affected users must accept the new version before continuing protected actions.

## Right to Erasure

Account deletion must support:

- request flow
- confirmation
- grace period
- anonymization of public reviews where appropriate
- retention of legal/payment records where required
- audit trail
