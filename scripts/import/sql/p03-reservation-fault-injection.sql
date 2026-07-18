-- P03 RES-DB-SAFETY-PROOF
-- Test-only, session-local fault wrapper. pg_temp guarantees that this function
-- disappears when the database client disconnects. It must never be migrated.

create or replace function pg_temp.p03_import_publish_reserve_snapshot_audit_fault(
  p_entity_id uuid,
  p_actor_profile_id uuid,
  p_idempotency_key text,
  p_request_hash text,
  p_expected_version text,
  p_snapshot_payload jsonb,
  p_snapshot_hash text,
  p_audit_schema_version text,
  p_authorization_id uuid,
  p_review_snapshot_hash text,
  p_entity_fingerprint text,
  p_operation_attempt_id uuid,
  p_patch_hash text,
  p_entity_family text,
  p_operation_scope text,
  p_fail_after text,
  p_reservation_ttl_hours integer default 168,
  p_rollback_retention_days integer default 365
)
returns jsonb
language plpgsql
security invoker
set search_path = pg_catalog, public
as $$
declare
  v_authorization public.import_pharmacy_publish_authorizations%rowtype;
  v_idempotency_id uuid;
  v_snapshot_id uuid;
  v_audit_id uuid;
  v_created_at timestamptz := clock_timestamp();
  v_updated_count integer;
begin
  if p_fail_after not in (
    'reservation_insert',
    'snapshot_insert',
    'audit_insert',
    'authorization_update'
  ) then
    raise exception 'p03_fault_boundary_invalid' using errcode = '22023';
  end if;

  if p_entity_id is null or p_actor_profile_id is null or p_authorization_id is null then
    raise exception 'reservation_identity_missing' using errcode = '22023';
  end if;
  if char_length(btrim(coalesce(p_idempotency_key, ''))) not between 8 and 240 then
    raise exception 'idempotency_key_invalid' using errcode = '22023';
  end if;
  if coalesce(p_request_hash, '') !~ '^[a-f0-9]{64}$'
    or coalesce(p_snapshot_hash, '') !~ '^[a-f0-9]{64}$'
    or coalesce(p_review_snapshot_hash, '') !~ '^[a-f0-9]{64}$'
    or coalesce(p_entity_fingerprint, '') !~ '^[a-f0-9]{64}$'
    or coalesce(p_patch_hash, '') !~ '^[a-f0-9]{64}$' then
    raise exception 'reservation_hash_invalid' using errcode = '22023';
  end if;
  if p_operation_attempt_id is null then
    raise exception 'operation_attempt_id_missing' using errcode = '22023';
  end if;
  if char_length(btrim(coalesce(p_expected_version, ''))) not between 1 and 120 then
    raise exception 'expected_version_invalid' using errcode = '22023';
  end if;
  if p_entity_family <> 'pharmacy' or p_operation_scope <> 'reserve_private_publish' then
    raise exception 'authorization_scope_invalid' using errcode = '22023';
  end if;
  if p_snapshot_payload is null or jsonb_typeof(p_snapshot_payload) <> 'object' then
    raise exception 'snapshot_payload_invalid' using errcode = '22023';
  end if;
  if char_length(btrim(coalesce(p_audit_schema_version, ''))) not between 1 and 64 then
    raise exception 'audit_schema_version_invalid' using errcode = '22023';
  end if;
  if p_reservation_ttl_hours not between 24 and 168 then
    raise exception 'reservation_ttl_invalid' using errcode = '22023';
  end if;
  if p_rollback_retention_days not between 30 and 365 then
    raise exception 'rollback_retention_invalid' using errcode = '22023';
  end if;

  select * into v_authorization
  from public.import_pharmacy_publish_authorizations
  where id = p_authorization_id
  for update;

  if not found then
    raise exception 'authorization_not_found' using errcode = 'P0001';
  end if;
  if v_authorization.actor_profile_id <> p_actor_profile_id
    or v_authorization.entity_id <> p_entity_id
    or v_authorization.review_snapshot_hash <> p_review_snapshot_hash
    or v_authorization.entity_fingerprint <> p_entity_fingerprint
    or v_authorization.operation_attempt_id <> p_operation_attempt_id
    or v_authorization.idempotency_key <> p_idempotency_key
    or v_authorization.request_hash <> p_request_hash
    or v_authorization.patch_hash <> p_patch_hash
    or v_authorization.expected_entity_version <> p_expected_version
    or v_authorization.entity_family <> p_entity_family
    or v_authorization.operation_scope <> p_operation_scope then
    raise exception 'authorization_identity_mismatch' using errcode = 'P0001';
  end if;
  if v_authorization.status <> 'issued'
    or v_authorization.consumed_at is not null
    or v_authorization.invalidated_at is not null
    or v_authorization.issued_at > v_created_at
    or v_authorization.expires_at <= v_created_at then
    raise exception 'authorization_not_issued' using errcode = 'P0001';
  end if;

  insert into public.import_publish_idempotency_records (
    idempotency_key, entity_id, actor_profile_id, expected_version, request_hash,
    status, created_at, updated_at, expires_at, pharmacy_authorization_id
  ) values (
    p_idempotency_key, p_entity_id, p_actor_profile_id, p_expected_version, p_request_hash,
    'reserved', v_created_at, v_created_at,
    v_created_at + make_interval(hours => p_reservation_ttl_hours), p_authorization_id
  ) returning id into v_idempotency_id;

  if p_fail_after = 'reservation_insert' then
    raise exception 'p03_forced_abort_reservation_insert' using errcode = 'P0001';
  end if;

  insert into public.import_publish_rollback_snapshots (
    entity_id, actor_profile_id, idempotency_record_id, expected_version,
    snapshot_payload, snapshot_hash, created_at, expires_at
  ) values (
    p_entity_id, p_actor_profile_id, v_idempotency_id, p_expected_version,
    p_snapshot_payload, p_snapshot_hash, v_created_at,
    v_created_at + make_interval(days => p_rollback_retention_days)
  ) returning id into v_snapshot_id;

  if p_fail_after = 'snapshot_insert' then
    raise exception 'p03_forced_abort_snapshot_insert' using errcode = 'P0001';
  end if;

  insert into public.import_publish_audit_events (
    entity_id, actor_profile_id, idempotency_record_id, rollback_snapshot_id,
    event_type, outcome, schema_version, expected_version, event_payload, created_at
  ) values (
    p_entity_id, p_actor_profile_id, v_idempotency_id, v_snapshot_id,
    'execution_started', 'pending', p_audit_schema_version, p_expected_version,
    jsonb_build_object(
      'phase', 'reservation',
      'requestHash', p_request_hash,
      'authorizationId', p_authorization_id,
      'reviewSnapshotHash', p_review_snapshot_hash,
      'entityFingerprint', p_entity_fingerprint,
      'operationAttemptId', p_operation_attempt_id,
      'patchHash', p_patch_hash,
      'entityFamily', p_entity_family,
      'operationScope', p_operation_scope
    ),
    v_created_at
  ) returning id into v_audit_id;

  if p_fail_after = 'audit_insert' then
    raise exception 'p03_forced_abort_audit_insert' using errcode = 'P0001';
  end if;

  update public.import_pharmacy_publish_authorizations
  set status = 'consumed',
      consumed_at = v_created_at,
      consumed_by_reservation_id = v_idempotency_id
  where id = p_authorization_id
    and status = 'issued'
    and consumed_at is null
    and invalidated_at is null
    and expires_at > v_created_at;

  get diagnostics v_updated_count = row_count;
  if v_updated_count <> 1 then
    raise exception 'authorization_consume_failed' using errcode = 'P0001';
  end if;

  if p_fail_after = 'authorization_update' then
    raise exception 'p03_forced_abort_authorization_update' using errcode = 'P0001';
  end if;

  return jsonb_build_object(
    'status', 'reserved',
    'idempotencyRecordId', v_idempotency_id,
    'rollbackSnapshotId', v_snapshot_id,
    'auditEventId', v_audit_id
  );
end;
$$;
