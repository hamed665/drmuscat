# 40 — Luxury UI Polish and Performance Budget V10.2

Luxury in DrMuscat means speed, clarity, restraint, trust, and thoughtful motion. It does not mean heavy decoration, slow animations, or visual noise.

## Performance Budget

CI must fail or warn if launch pages exceed these budgets unless explicitly approved:

| Metric | Budget |
|---|---:|
| LCP | < 1.5s target, < 2.5s maximum |
| INP | < 100ms target, < 200ms maximum |
| CLS | < 0.05 target, < 0.1 maximum |
| Initial JS | < 200KB gzip target |
| Public page weight | < 1MB target |
| Hero image derivative | < 100KB target |
| Time to interactive | < 2s target |

## Week-One Polish

Must have:

- premium skeleton shimmer
- page-specific empty states
- mobile-first listing cards
- RTL Arabic polish
- subtle loading signature
- accessible focus states
- high contrast buttons
- zero layout shift image containers

Must not have in week one:

- sound design
- custom cursor
- heavy cinematic transitions
- dark mode
- confetti except later milestone moments

## Motion Rules

- Transitions must be 120-220ms.
- Motion must respect `prefers-reduced-motion`.
- Arabic RTL shimmer direction must be right-to-left.
- No animation may block user action.

## Premium Visual Direction

Use a medical-trust palette with restrained Gulf premium cues:

- white/ivory base
- deep teal
- medical blue
- subtle gold accent
- generous spacing
- consistent card radius
- one Arabic-capable font family and one Latin-capable font family, or a unified multilingual type strategy

## Signature Loading State

Allowed: subtle ECG/pulse-inspired loading. Not allowed: gimmicky medical animations, stethoscope cartoons, or heavy Lottie everywhere. Apparently the world has suffered enough spinners already.
