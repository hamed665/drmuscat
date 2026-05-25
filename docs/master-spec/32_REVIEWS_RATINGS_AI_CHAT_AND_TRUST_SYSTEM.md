# 32_REVIEWS_RATINGS_AI_CHAT_AND_TRUST_SYSTEM.md

# Reviews, Ratings, AI Chat and Trust System

## Core Principle
DrMuscat must include a structured patient experience system, not an unrestricted comment wall.

Reviews must help users understand real patient experience while protecting users, centers, doctors, and DrMuscat from privacy, defamation, spam, fake review, and medical misinformation risks.

## Review Principles
1. Reviews must be based on personal experience.
2. Reviews must not include insults, threats, unsupported accusations, defamation, private medical details, third-party personal data, phone numbers, IDs, lab reports, prescriptions, or emergency claims.
3. Reviews must be moderated before public display in MVP.
4. Verified patient experiences must be visually distinguished from unverified community reviews.
5. Centers may respond to reviews only through moderated replies.
6. Centers may dispute reviews, but cannot directly delete or hide reviews.
7. Admins must have full moderation tools, audit logs, report queues, and dispute handling.
8. Ratings must include sub-ratings, not only one overall score.
9. Public aggregate rating must use a weighted scoring model, not a raw average only.
10. Review schema must only be emitted for compliant approved reviews.
11. Paid centers must not be allowed to buy review removal.
12. Review collection must never ask for sensitive medical details.

## Required Sub-Ratings
- overall
- cleanliness
- staff behavior
- waiting time
- doctor communication
- price clarity
- booking experience
- location and parking
- service satisfaction

## Review Types
### Verified Review
A review attached to a tracked appointment request, offer claim, verified visit, or admin-approved proof.

### Community Review
A user-submitted experience that is moderated but not independently verified.

### Private Feedback
Feedback visible to admin and the center only, not public.

## Required Public UI
Each center profile must include:
- aggregate rating, only after minimum review threshold
- review count
- verified/community labels
- sub-rating summary
- helpful vote control
- report review control
- center response, if approved
- sort by newest/helpful/highest/lowest
- review policy link
- leave review CTA
- private feedback option

## Minimum Thresholds
- Aggregate rating visible only after at least 3 approved public reviews.
- AI review summary visible only after at least 5 approved public reviews.
- Review schema emitted only when reviews meet compliance and minimum threshold.

## Review Submission Guardrails
Before submission, users must confirm:
```text
I confirm this review is based on my personal experience.
I will not share private medical details, insults, accusations, or personal information.
I understand DrMuscat may edit, reject, hide, or remove reviews that violate policy.
```

## Moderation Workflow
Statuses:
```text
pending -> approved
pending -> rejected
approved -> disputed
disputed -> hidden
hidden -> restored
```

Allowed admin actions:
- approve
- reject
- hide
- restore
- redact personal data
- request clarification
- notify center
- notify user
- mark verified
- mark suspicious
- lock thread

Redaction may remove personal/private data, but must not alter the meaning of the review.

## Center Responses
Centers may reply only through moderated responses.

Centers may:
- thank the user
- apologize professionally
- ask the user to contact patient relations
- explain general policy

Centers may not:
- insult the user
- reveal patient identity
- publish private medical details
- threaten legal action publicly
- accuse the user of lying without proper dispute process

## Anti-Fraud and Abuse Protections
- one public review per user per center per 90 days
- rate limits
- suspicious review queue
- repeated text detection
- review burst detection
- same device/IP cluster risk flag
- center-owner self-review flag
- competitor attack flag
- admin audit trail
- no incentivized reviews unless legally and clearly disclosed, and MVP should avoid incentives entirely

## Weighted Rating
Public score must not be raw average only.

Use a model conceptually equivalent to:
```text
weighted_score = Bayesian average + verified review boost + recency weight - suspicious penalty
```

Claude Code may implement the MVP score as a database view or server-side helper, but must not rank by raw average alone.

## AI Review Summary
For approved reviews only, the platform may show:
```text
What patients mention most:
- Friendly staff
- Clean clinic
- Waiting time can be longer in evenings
```

AI summaries must:
- use only approved reviews
- avoid medical claims
- avoid personal data
- avoid unsupported accusations
- include a note that summaries may not reflect every experience

## AI Chat Role
DrMuscat AI must be a healthcare discovery assistant, not a medical diagnosis assistant.

The AI may:
- help users find centers, pharmacies, doctors, services, offers, areas, and contact options
- answer questions about DrMuscat pages, policies, offers, and listings
- guide centers through profile claim, offer creation, media upload, analytics, and subscription steps
- summarize approved reviews safely

The AI must not:
- diagnose
- prescribe medication
- recommend treatment as medical advice
- rank doctors by medical superiority
- guarantee outcomes
- analyze medical images, lab results, prescriptions, or symptoms as a doctor
- replace emergency care

## AI Chat Safety Disclaimer
Every AI chat entry point must include:
```text
DrMuscat AI helps you find healthcare providers and information. It does not diagnose, prescribe, or replace a licensed medical professional. For emergencies, contact local emergency services immediately.
```

## AI Retrieval Rule
The AI must use DrMuscat data where possible.

If information is unavailable or unverified, it must respond:
```text
I could not verify that information on DrMuscat. Please contact the center directly.
```

## AI Chat Modes
### Patient Assistant
Helps with:
- nearby clinics
- pharmacies open now
- services by area
- offers
- WhatsApp/call/direction actions

### Center Assistant
Helps with:
- claiming profile
- completing profile
- creating offers
- uploading media
- understanding analytics
- understanding review rules
- upgrading subscription

## Required Admin Tools
Admin panel must include:
- review moderation dashboard
- reported reviews queue
- disputed reviews queue
- suspicious reviews queue
- AI risk scan result
- review audit log
- center response moderation
- AI chat logs with safety categories
- ability to disable AI chat for specific users/sessions if abused

## Required Center Tools
Center panel must include:
- review list
- rating trends
- sub-rating breakdown
- response drafting
- dispute request
- monthly reputation summary
- review request QR/link

## Non-Negotiable Rule
Reviews and AI chat are trust features. They must never become unrestricted medical advice, unrestricted public accusation, or pay-to-delete reputation control.
