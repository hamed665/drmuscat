# 10_PHONE_FIRST_AUTH_AND_USER_ONBOARDING.md

# Free User Registration and Onboarding — V10.1

## 1. User Registration Principle
Public user registration is free. There is no paid user card, no Health Card signup, and no user payment requirement for discovery.

Users can browse centers, doctors, areas, services, public offers, public reviews and contact actions without registration.

## 2. Soft Registration Nudges
The site should encourage free registration without blocking discovery. Nudges may appear:
- after repeated profile views
- when user clicks save/favorite
- when user wants to submit review
- when user wants an offer claim code
- when user wants appointment reminder or alert
- when user wants to keep history across devices

Nudges must be lightweight, mobile-friendly and dismissible. Do not damage Core Web Vitals or use intrusive interstitials.

## 3. Actions That May Require Login
Login may be required for:
- submitting reviews
- review helpful voting if anti-abuse requires it
- saving favorites across devices
- claiming offer codes
- redemption history
- personalized alerts
- appointment reminders
- provider claim/profile ownership flows

Login must not be required for:
- viewing center profiles
- viewing doctors
- viewing services
- viewing offers
- clicking WhatsApp/call/directions
- reading public reviews
- searching and filtering

## 4. Auth Method
MVP auth should support phone-first Oman-friendly registration and can support email fallback. Default country code is +968. Normalize phone to E.164.

If the self-hosted architecture is used, use Auth.js/custom auth rather than Supabase Auth. If a Supabase-based implementation is used in an older branch, this file overrides Health Card/signup behavior and user access rules.

## 5. Profile Completion
Complete profile fields:
- full name
- preferred language (`en` or `ar`)
- phone
- optional email
- user intent

Intent does not create business/admin roles.

## 6. Security
returnTo must be internal only. No open redirects. Localized errors only. No raw provider errors in production.
