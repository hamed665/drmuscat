import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { runPharmacyRealRollbackCanary } from "./import-pharmacy-real-rollback-canary";
import type { PharmacyRealPreviewCanaryResult } from "./import-pharmacy-real-preview-canary";

const HASH = "a".repeat(64);

function publishCanary(overrides: Partial<PharmacyRealPreviewCanaryResult> = {}): PharmacyRealPreviewCanaryResult {
  return {
    verified: true,
    actorId: "actor-1",
    entityId: "pharmacy-1",
    publishReference: "opaque-reference",
    readback: null,
    blockers: [],
    publicVisibility: "private",
    indexEligible: false,
    sitemapEligible: false,
    routeEnabled: false,
    ...overrides,
  };
}

function readback(overrides: Record<string, unknown> = {}) {
  return {
    rolledBackAuditCount: 1,
    rollbackReplayCount: 0,
    duplicateRollbackCount: 0,
    referenceCount: 1,
    referenceConsumed: true,
    entity: {
      id: "pharmacy-1",
      centerType: "pharmacy",
      status: "draft",
      isActive: false,
      isFeatured: false,
      logicalSnapshotHash: HASH,
    },
    ...overrides,
  };
}

describe("runPharmacyRealRollbackCanary", () => {
  it("verifies one exact private rollback", async () => {
    const executor = vi.fn().mockResolvedValue({
      operation: "rollback",
      status: "completed",
      entityId: "pharmacy-1",
      blockers: [],
      publicVisibility: "private",
      indexEligible: false,
      sitemapEligible: false,
      routeEnabled: false,
      executionReference: "opaque-reference",
    });
    const client = { read: vi.fn().mockResolvedValue({ data: readback(), error: null }) };

    const result = await runPharmacyRealRollbackCanary({
      publishCanary: publishCanary(),
      expectedOriginalSnapshotHash: HASH,
      executor,
      readbackClient: client,
    });

    expect(result.verified).toBe(true);
    expect(result.blockers).toEqual([]);
    expect(executor).toHaveBeenCalledWith({
      operation: "rollback",
      actorId: "actor-1",
      entityId: "pharmacy-1",
      confirmation: "ROLLBACK PRIVATE PHARMACY",
      publishReference: "opaque-reference",
    });
  });

  it("fails closed before rollback when publish canary is not verified", async () => {
    const executor = vi.fn();
    const result = await runPharmacyRealRollbackCanary({
      publishCanary: publishCanary({ verified: false }),
      expectedOriginalSnapshotHash: HASH,
      executor,
      readbackClient: { read: vi.fn() },
    });

    expect(result.verified).toBe(false);
    expect(result.blockers).toContain("publish_canary_not_verified");
    expect(executor).not.toHaveBeenCalled();
  });

  it("rejects snapshot mismatch and duplicate rollback", async () => {
    const executor = vi.fn().mockResolvedValue({
      operation: "rollback",
      status: "completed",
      entityId: "pharmacy-1",
      blockers: [],
      publicVisibility: "private",
      indexEligible: false,
      sitemapEligible: false,
      routeEnabled: false,
      executionReference: "opaque-reference",
    });
    const result = await runPharmacyRealRollbackCanary({
      publishCanary: publishCanary(),
      expectedOriginalSnapshotHash: HASH,
      executor,
      readbackClient: {
        read: vi.fn().mockResolvedValue({
          data: readback({
            duplicateRollbackCount: 1,
            referenceConsumed: false,
            entity: { ...readback().entity, logicalSnapshotHash: "b".repeat(64) },
          }),
          error: null,
        }),
      },
    });

    expect(result.verified).toBe(false);
    expect(result.blockers).toEqual(expect.arrayContaining([
      "duplicate_rollback_detected",
      "publish_reference_not_consumed",
      "entity_snapshot_mismatch",
    ]));
  });
});
