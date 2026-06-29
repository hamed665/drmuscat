# Draft Location Create Runtime Guard

This guard keeps the draft location create workflow private.

It checks that the server action keeps created location candidates inactive, keeps public contact visibility disabled, limits creation to draft review states, records an admin audit event, and revalidates only the draft center admin page.

It also checks that the admin form clearly presents the save flow as a private draft location candidate workflow.
