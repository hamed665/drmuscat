import { vi } from "vitest";

vi.mock("server-only", () => ({}));

import { describe, expect, it } from "vitest";
import { createSupabasePharmacyPrivateRollbackWriter } from "./import-supabase-pharmacy-private-rollback-writer";

const snapshotHash = "a".repeat(64);

function request() {
  return {
    reservationId: "reservation-001",
    rollbackSnapshotId: "snapshot-001",
    entityId: "11111111-1111-4111-8111-111111111111",
    actorId: "22222222-2222-4222-8222-222222222222",
    expectedCurrentVersion: "2026-07-12 02:00:00+00",
    expectedSnapshotHash: snapshotHash,
  };
}

describe("Supabase pharmacy private rollback writer", () => {
  it("calls only the atomic rollback RPC with exact identity and hash", async () => {
    const rpc = vi.fn().mockResolvedValue({
      data: {
        status: "rolled_back",
        entityId: request().entityId,
        actualVersion: "2026-07-12 02:01:00+00",
      },
      error: null,
    });
    const rollback = createSupabasePharmacyPrivateRollbackWriter({ rpc });

    await expect(rollback(request())).resolves.toEqual({
      kind: "rolled_back",
      entityId: request().entityId,
      actualVersion: "2026-07-12 02:01:00+00",
    });
    expect(rpc).toHaveBeenCalledWith("import_rollback_pharmacy_private", {
      p_idempotency_record_id: "reservation-001",
      p_rollback_snapshot_id: "snapshot-001",
      p_entity_id: request().entityId,
      p_actor_profile_id: request().actorId,
      p_expected_current_version: "2026-07-12 02:00:00+00",
      p_expected_snapshot_hash: snapshotHash,
      p_audit_schema_version: "1",
    });
  });

  it("returns replayed for an already restored snapshot", async () => {
    const rollback = createSupabasePharmacyPrivateRollbackWriter({
      rpc: vi.fn().mockResolvedValue({
        data: { status: "replayed", entityId: request().entityId, actualVersion: "v3" },
        error: null,
      }),
    });
    await expect(rollback(request())).resolves.toEqual({
      kind: "replayed",
      entityId: request().entityId,
      actualVersion: "v3",
    });
  });

  it("fails closed before RPC for an invalid snapshot hash", async () => {
    const rpc = vi.fn();
    const rollback = createSupabasePharmacyPrivateRollbackWriter({ rpc });
    await expect(rollback({ ...request(), expectedSnapshotHash: "bad" })).resolves.toEqual({ kind: "failed" });
    expect(rpc).not.toHaveBeenCalled();
  });

  it("normalizes approved conflicts and rejects malformed responses", async () => {
    const conflict = createSupabasePharmacyPrivateRollbackWriter({
      rpc: vi.fn().mockResolvedValue({
        data: { status: "conflict", reason: "rollback_current_version_mismatch" },
        error: null,
      }),
    });
    await expect(conflict(request())).resolves.toEqual({
      kind: "conflict",
      reason: "rollback_current_version_mismatch",
    });

    const malformed = createSupabasePharmacyPrivateRollbackWriter({
      rpc: vi.fn().mockResolvedValue({ data: { status: "rolled_back" }, error: null }),
    });
    await expect(malformed(request())).resolves.toEqual({ kind: "failed" });
  });
});
