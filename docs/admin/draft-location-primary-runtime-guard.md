# Draft Location Primary Runtime Guard

This guard keeps the draft location selection workflow private.

It checks that selecting a candidate only changes inactive draft location candidates for the same draft center. It must not activate a location, expose contact fields, verify a center, publish a provider, or touch public routes.

It also checks that the admin panel keeps the selection copy clear: selection stays private and inactive until a later review workflow.
