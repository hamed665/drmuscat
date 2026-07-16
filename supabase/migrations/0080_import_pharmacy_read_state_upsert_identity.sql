-- P02 RES-INTEGRITY-READBACK: make Pharmacy read-state UPSERT identities inferable.
-- PostgreSQL unique indexes keep NULL values distinct by default, so legacy rows with NULL identity remain compatible.

drop index if exists public.import_pharmacy_admin_read_states_attempt_operation_idx;

create unique index import_pharmacy_admin_read_states_attempt_operation_idx
  on public.import_pharmacy_admin_read_states (operation_attempt_id, operation);

drop index if exists public.import_pharmacy_admin_read_states_idempotency_operation_idx;

create unique index import_pharmacy_admin_read_states_idempotency_operation_idx
  on public.import_pharmacy_admin_read_states (idempotency_key, operation);
