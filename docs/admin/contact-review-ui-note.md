# Contact Review UI Note

This note records the current admin contact review UI boundary.

The draft center detail page includes a read-only contact review panel for location-level contact visibility flags.

The panel may show:

- internal active status
- contact review status
- prepared primary field flag
- prepared messaging field flag
- prepared mail field flag

The panel must not publish a provider, verify a center, claim a center, change billing, change sponsorship, or revalidate public routes.

Mutation controls remain deferred to a smaller follow-up UI wiring step so the admin surface can be reviewed before exposing toggles.
