import "server-only";

import type {
  ImportPrivatePublishPersistenceAdapter,
  ImportPublishPersistenceTransactionRequest,
  ImportPublishPersistenceTransactionResult,
} from "./import-private-persistence-adapter";

export const IMPORT_RESERVATION_ONLY_MODE_ENABLED = false as const;

export type ImportReservationOnlyBlocker =
  | "orchestration_not_ready"
  | "environment_not_allowed"
  | "canary_entity_missing"
  | "canary_entity_mismatch"
  | "actor_not_allowed"
  | "approval_token_missing"
  | "reservation_only_mode_disabled";

export type ImportReservationOnlyInput = {
  orchestrationReady: boolean;
  environment: "development" | "preview" | "production";
  allowedEnvironment: "preview";
  entityId: string;
  canaryEntityId: string;
  actorId: string;
  allowedActorIds: readonly string[];
  approvalToken: string;
  expectedApprovalToken: string;
  reservationRequest: ImportPublishPersistenceTransactionRequest;
};

export type ImportReservationOnlyResult = {
  mode: "reservation_only_disabled";
  reservationOnlyReady: boolean;
  reservationAttempted: boolean;
  reservationResult: ImportPublishPersistenceTransactionResult | null;
  executionReady: false;
  mutationEnabled: false;
  terminalPersistenceAllowed: false;
  entityMutationAllowed: false;
  routeMutationAllowed: false;
  sitemapMutationAllowed: false;
  bulkAllowed: false;
  blockers: readonly ImportReservationOnlyBlocker[];
  allowedOperations: readonly [
    "reserve_idempotency_key",
    "capture_rollback_snapshot",
    "append_execution_started_audit",
  ];
};

export async function runImportReservationOnlyMode(
  input: ImportReservationOnlyInput,
  adapter: ImportPrivatePublishPersistenceAdapter,
): Promise<ImportReservationOnlyResult> {
  const blockers: ImportReservationOnlyBlocker[] = [];

  if (!input.orchestrationReady) blockers.push("orchestration_not_ready");
  if (input.environment !== input.allowedEnvironment) blockers.push("environment_not_allowed");
  if (!input.canaryEntityId.trim()) blockers.push("canary_entity_missing");
  if (input.entityId !== input.canaryEntityId) blockers.push("canary_entity_mismatch");
  if (!input.allowedActorIds.includes(input.actorId)) blockers.push("actor_not_allowed");
  if (!input.approvalToken.trim() || input.approvalToken !== input.expectedApprovalToken) {
    blockers.push("approval_token_missing");
  }
  if (!IMPORT_RESERVATION_ONLY_MODE_ENABLED) blockers.push("reservation_only_mode_disabled");

  const uniqueBlockers = [...new Set(blockers)];
  const reservationOnlyReady = uniqueBlockers.every(
    (blocker) => blocker === "reservation_only_mode_disabled",
  );

  if (!reservationOnlyReady || !IMPORT_RESERVATION_ONLY_MODE_ENABLED) {
    return {
      mode: "reservation_only_disabled",
      reservationOnlyReady,
      reservationAttempted: false,
      reservationResult: null,
      executionReady: false,
      mutationEnabled: false,
      terminalPersistenceAllowed: false,
      entityMutationAllowed: false,
      routeMutationAllowed: false,
      sitemapMutationAllowed: false,
      bulkAllowed: false,
      blockers: uniqueBlockers,
      allowedOperations: [
        "reserve_idempotency_key",
        "capture_rollback_snapshot",
        "append_execution_started_audit",
      ],
    };
  }

  const reservationResult = await adapter.runReservationSnapshotAuditTransaction(
    input.reservationRequest,
  );

  return {
    mode: "reservation_only_disabled",
    reservationOnlyReady,
    reservationAttempted: true,
    reservationResult,
    executionReady: false,
    mutationEnabled: false,
    terminalPersistenceAllowed: false,
    entityMutationAllowed: false,
    routeMutationAllowed: false,
    sitemapMutationAllowed: false,
    bulkAllowed: false,
    blockers: uniqueBlockers,
    allowedOperations: [
      "reserve_idempotency_key",
      "capture_rollback_snapshot",
      "append_execution_started_audit",
    ],
  };
}
