import "server-only";

export type ImportDatabaseTransactionRpcBlocker =
  | "adapter_contract_not_ready"
  | "persistence_schema_not_ready"
  | "private_schema_missing"
  | "security_invoker_not_declared"
  | "search_path_not_pinned"
  | "public_execute_not_revoked"
  | "authenticated_execute_present"
  | "service_role_execute_missing"
  | "input_validation_missing"
  | "single_transaction_missing"
  | "idempotency_conflict_check_missing"
  | "optimistic_lock_check_missing"
  | "rollback_snapshot_write_missing"
  | "audit_start_write_missing"
  | "terminal_result_write_missing"
  | "rpc_not_enabled";

export type ImportDatabaseTransactionRpcSecurityInput = {
  adapterContractReady: boolean;
  persistenceSchemaReady: boolean;
  privateSchemaPresent: boolean;
  securityMode: "invoker" | "definer" | "unspecified";
  searchPathPinned: boolean;
  publicExecuteRevoked: boolean;
  authenticatedExecuteGranted: boolean;
  serviceRoleExecuteGranted: boolean;
  inputValidationPresent: boolean;
  singleTransactionGuaranteed: boolean;
  idempotencyConflictCheckPresent: boolean;
  optimisticLockCheckPresent: boolean;
  rollbackSnapshotWritePresent: boolean;
  auditStartWritePresent: boolean;
  terminalResultWritePresent: boolean;
  rpcEnabled: false;
};

export type ImportDatabaseTransactionRpcSecurityPlan = {
  mode: "rpc_security_contract_only";
  contractReady: boolean;
  rpcReady: false;
  executionReady: false;
  mutationEnabled: false;
  bulkAllowed: false;
  blockers: readonly ImportDatabaseTransactionRpcBlocker[];
  requiredSecurityMode: "invoker";
  requiredSearchPath: readonly ["pg_catalog", "public"];
  allowedExecutorRole: "service_role";
  deniedExecutorRoles: readonly ["anon", "authenticated", "public"];
  orderedTransactionStages: readonly [
    "validate_request",
    "check_idempotency_conflict",
    "check_optimistic_version",
    "reserve_idempotency_key",
    "capture_rollback_snapshot",
    "append_execution_started_audit",
    "persist_terminal_result",
  ];
  sqlObjects: readonly [];
};

export function getImportDatabaseTransactionRpcSecurityPlan(
  input: ImportDatabaseTransactionRpcSecurityInput,
): ImportDatabaseTransactionRpcSecurityPlan {
  const blockers: ImportDatabaseTransactionRpcBlocker[] = [];

  if (!input.adapterContractReady) blockers.push("adapter_contract_not_ready");
  if (!input.persistenceSchemaReady) blockers.push("persistence_schema_not_ready");
  if (!input.privateSchemaPresent) blockers.push("private_schema_missing");
  if (input.securityMode !== "invoker") blockers.push("security_invoker_not_declared");
  if (!input.searchPathPinned) blockers.push("search_path_not_pinned");
  if (!input.publicExecuteRevoked) blockers.push("public_execute_not_revoked");
  if (input.authenticatedExecuteGranted) blockers.push("authenticated_execute_present");
  if (!input.serviceRoleExecuteGranted) blockers.push("service_role_execute_missing");
  if (!input.inputValidationPresent) blockers.push("input_validation_missing");
  if (!input.singleTransactionGuaranteed) blockers.push("single_transaction_missing");
  if (!input.idempotencyConflictCheckPresent) blockers.push("idempotency_conflict_check_missing");
  if (!input.optimisticLockCheckPresent) blockers.push("optimistic_lock_check_missing");
  if (!input.rollbackSnapshotWritePresent) blockers.push("rollback_snapshot_write_missing");
  if (!input.auditStartWritePresent) blockers.push("audit_start_write_missing");
  if (!input.terminalResultWritePresent) blockers.push("terminal_result_write_missing");
  if (!input.rpcEnabled) blockers.push("rpc_not_enabled");

  const uniqueBlockers = [...new Set(blockers)];
  const contractBlockers = uniqueBlockers.filter((blocker) => blocker !== "rpc_not_enabled");

  return {
    mode: "rpc_security_contract_only",
    contractReady: contractBlockers.length === 0,
    rpcReady: false,
    executionReady: false,
    mutationEnabled: false,
    bulkAllowed: false,
    blockers: uniqueBlockers,
    requiredSecurityMode: "invoker",
    requiredSearchPath: ["pg_catalog", "public"],
    allowedExecutorRole: "service_role",
    deniedExecutorRoles: ["anon", "authenticated", "public"],
    orderedTransactionStages: [
      "validate_request",
      "check_idempotency_conflict",
      "check_optimistic_version",
      "reserve_idempotency_key",
      "capture_rollback_snapshot",
      "append_execution_started_audit",
      "persist_terminal_result",
    ],
    sqlObjects: [],
  };
}

export function isImportDatabaseTransactionRpcSecurityContractReady(
  input: ImportDatabaseTransactionRpcSecurityInput,
): boolean {
  return getImportDatabaseTransactionRpcSecurityPlan(input).contractReady;
}
