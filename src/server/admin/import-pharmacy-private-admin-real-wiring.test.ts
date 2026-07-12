import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  createPharmacyPrivateAdminRealPorts,
  type PharmacyPrivateAdminRealWiringDependencies,
} from "./import-pharmacy-private-admin-real-wiring";
import type {
  ImportRealReservationCanaryInput,
  ImportRealReservationCanaryResult,
} from "./import-real-reservation-canary";
import type {
  ImportPharmacyPrivateMutationRequest,
  ImportPharmacyPrivateMutationResult,
} from "./import-pharmacy-private-mutation-adapter";
import type { ImportPharmacyPrivateRollbackResult } from "./import-supabase-pharmacy-private-rollback-writer";

type ReservationRunner = NonNullable<PharmacyPrivateAdminRealWiringDependencies["reservationRunner"]>;
type MutationRunner = NonNullable<PharmacyPrivateAdminRealWiringDependencies["mutationRunner"]>;
type RollbackWriter = NonNullable<PharmacyPrivateAdminRealWiringDependencies["rollbackWriter"]>;

function harness() {
  const reservationRunner = vi.fn(
    async (..._args: Parameters<ReservationRunner>): Promise<ImportRealReservationCanaryResult> => ({
      mode: "preview_reservation_canary",
      attempted: true,
      reserved: true,
      verified: true,
      reservationResult: {
        kind: "reserved",
        reservationId: "reservation-1",
        rollbackSnapshotId: "snapshot-1",
        auditEventId: "audit-1",
      },
      readbackResult: null,
      blockers: [],
      terminalPersistenceAllowed: false,
      entityMutationAllowed: false,
      routeMutationAllowed: false,
      sitemapMutationAllowed: false,
      bulkAllowed: false,
    }),
  );
  const mutationRunner = vi.fn(
    async (..._args: Parameters<MutationRunner>): Promise<ImportPharmacyPrivateMutationResult> => ({
      kind: "mutated",
      entityId: "pharmacy-1",
      actualVersion: "version-2",
      visibility: "private",
    }),
  );
  const rollbackWriter = vi.fn(
    async (..._args: Parameters<RollbackWriter>): Promise<ImportPharmacyPrivateRollbackResult> => ({
      kind: "rolled_back",
      entityId: "pharmacy-1",
      actualVersion: "version-3",
    }),
  );

  const mutationRequest = {
    family: "pharmacy",
    selectedFamily: "pharmacy",
    draft: { draftId: "pharmacy-1" },
    actorId: "admin-1",
    idempotencyKey: "key-1",
    expectedVersion: "version-1",
    rollbackState: { entityId: "pharmacy-1" },
    executionEnabled: true,
    batchSize: 1,
  } as unknown as Omit<ImportPharmacyPrivateMutationRequest, "reservationResult">;

  const canaryInput = {
    actorId: "admin-1",
    entityId: "pharmacy-1",
  } as unknown as ImportRealReservationCanaryInput;

  const loadPublishContext = vi.fn(async () => ({ canaryInput, mutationRequest }));
  const createPublishReference = vi.fn(async () => "publish-reference-1");

  const dependencies: PharmacyPrivateAdminRealWiringDependencies = {
    persistenceAdapter: {} as never,
    readbackClient: {} as never,
    mutationRpcClient: {} as never,
    rollbackRpcClient: {} as never,
    loadPublishContext,
    createPublishReference,
    resolveRollbackRequest: vi.fn(async () => ({
      reservationId: "reservation-1",
      rollbackSnapshotId: "snapshot-1",
      entityId: "pharmacy-1",
      actorId: "admin-1",
      expectedCurrentVersion: "version-2",
      expectedSnapshotHash: "a".repeat(64),
    })),
    dryRun: vi.fn(async () => ({ ok: true, reference: "dry-1" })),
    review: vi.fn(async () => ({ ok: true, reference: "review-1" })),
    audit: vi.fn(async () => true),
    reservationRunner,
    mutationRunner,
    mutationWriter: {} as never,
    rollbackWriter,
  };

  return {
    dependencies,
    reservationRunner,
    mutationRunner,
    rollbackWriter,
    loadPublishContext,
    createPublishReference,
  };
}

describe("pharmacy private admin real wiring", () => {
  it("reserves, verifies, mutates one pharmacy, and creates an opaque publish reference", async () => {
    const test = harness();
    const ports = createPharmacyPrivateAdminRealPorts(test.dependencies);
    const result = await ports.privatePublish({ actorId: "admin-1", entityId: "pharmacy-1" });

    expect(result).toEqual({ ok: true, reference: "publish-reference-1" });
    expect(test.reservationRunner).toHaveBeenCalledTimes(1);
    expect(test.mutationRunner).toHaveBeenCalledTimes(1);
    expect(test.createPublishReference).toHaveBeenCalledWith({
      actorId: "admin-1",
      entityId: "pharmacy-1",
      reservationId: "reservation-1",
      rollbackSnapshotId: "snapshot-1",
      actualVersion: "version-2",
    });
  });

  it("fails closed before mutation when reservation readback is not verified", async () => {
    const test = harness();
    test.reservationRunner.mockResolvedValueOnce({
      mode: "preview_reservation_canary",
      attempted: true,
      reserved: true,
      verified: false,
      reservationResult: {
        kind: "reserved",
        reservationId: "reservation-1",
        rollbackSnapshotId: "snapshot-1",
        auditEventId: "audit-1",
      },
      readbackResult: null,
      blockers: ["readback_verification_failed"],
      terminalPersistenceAllowed: false,
      entityMutationAllowed: false,
      routeMutationAllowed: false,
      sitemapMutationAllowed: false,
      bulkAllowed: false,
    });

    const result = await createPharmacyPrivateAdminRealPorts(test.dependencies).privatePublish({
      actorId: "admin-1",
      entityId: "pharmacy-1",
    });
    expect(result).toEqual({ ok: false, reference: null });
    expect(test.mutationRunner).not.toHaveBeenCalled();
  });

  it("rejects mismatched publish context before reservation", async () => {
    const test = harness();
    const context = await test.loadPublishContext();
    test.loadPublishContext.mockResolvedValueOnce({
      ...context,
      mutationRequest: { ...context.mutationRequest, actorId: "other-admin" },
    });

    const result = await createPharmacyPrivateAdminRealPorts(test.dependencies).privatePublish({
      actorId: "admin-1",
      entityId: "pharmacy-1",
    });
    expect(result).toEqual({ ok: false, reference: null });
    expect(test.reservationRunner).not.toHaveBeenCalled();
  });

  it("resolves an opaque reference and runs the real rollback boundary once", async () => {
    const test = harness();
    const result = await createPharmacyPrivateAdminRealPorts(test.dependencies).rollback({
      actorId: "admin-1",
      entityId: "pharmacy-1",
      publishReference: "publish-reference-1",
    });
    expect(result).toEqual({ ok: true, reference: "publish-reference-1" });
    expect(test.rollbackWriter).toHaveBeenCalledTimes(1);
  });
});
