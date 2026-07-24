import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  buildPharmacyAdminStateMachineSnapshot,
  type PharmacyAdminStateMachineEvidence,
} from "./import-pharmacy-admin-state-machine";

const NOW = "2026-07-24T01:00:00.000Z";
const FUTURE = "2026-07-24T01:15:00.000Z";
const VERSION = "2026-07-24T00:55:00.000Z";

function logicalSnapshot() {
  return {
    schemaVersion: "drkhaleej.import.pharmacyRollbackSnapshot.v1",
    visibility: "private",
    indexPolicy: "noindex",
    sitemapPolicy: "excluded",
    publishStatus: "private_published",
    publicReady: false,
    projectionVersion: "p08-v1",
    canonicalRoute: "/en/om/pharmacies/p08-pharmacy",
    center: {
      id: "pharmacy-1",
      centerType: "pharmacy",
      slug: "p08-pharmacy",
      nameEn: "P08 Pharmacy",
      nameAr: "صيدلية P08",
      legalName: "P08 Pharmacy LLC",
      status: "draft",
      verificationStatus: "unverified",
      primaryPhone: "+96824000000",
      secondaryPhone: null,
      whatsappPhone: "+96894000000",
      email: "p08@example.invalid",
      websiteUrl: "https://example.invalid/p08",
      logoUrl: null,
      coverImageUrl: null,
      shortDescriptionEn: null,
      shortDescriptionAr: null,
      descriptionEn: "P08 exact state.",
      descriptionAr: null,
      defaultLocale: "en",
      defaultCountry: "om",
      isActive: false,
      isClaimable: false,
      isFeatured: false,
      sortOrder: 0,
      metadata: {
        projectionVersion: "p08-v1",
        visibility: "private",
        publicRouteEnabled: false,
        indexable: false,
        sitemapEligible: false,
        protected: { licenseNumber: "LICENSE-P08" },
      },
      deletedAt: null,
    },
    relations: [],
  };
}

function entityRow() {
  const snapshot = logicalSnapshot();
  return {
    id: snapshot.center.id,
    center_type: snapshot.center.centerType,
    slug: snapshot.center.slug,
    name_en: snapshot.center.nameEn,
    name_ar: snapshot.center.nameAr,
    legal_name: snapshot.center.legalName,
    status: snapshot.center.status,
    verification_status: snapshot.center.verificationStatus,
    primary_phone: snapshot.center.primaryPhone,
    secondary_phone: snapshot.center.secondaryPhone,
    whatsapp_phone: snapshot.center.whatsappPhone,
    email: snapshot.center.email,
    website_url: snapshot.center.websiteUrl,
    logo_url: snapshot.center.logoUrl,
    cover_image_url: snapshot.center.coverImageUrl,
    short_description_en: snapshot.center.shortDescriptionEn,
    short_description_ar: snapshot.center.shortDescriptionAr,
    description_en: snapshot.center.descriptionEn,
    description_ar: snapshot.center.descriptionAr,
    default_locale: snapshot.center.defaultLocale,
    default_country: snapshot.center.defaultCountry,
    is_active: snapshot.center.isActive,
    is_claimable: snapshot.center.isClaimable,
    is_featured: snapshot.center.isFeatured,
    sort_order: snapshot.center.sortOrder,
    metadata: snapshot.center.metadata,
    deleted_at: snapshot.center.deletedAt,
    updated_at: NOW,
  };
}

function readState(reviewed = false) {
  return {
    operationAttemptId: "attempt-1",
    snapshotHash: "a".repeat(64),
    entityFingerprint: "b".repeat(64),
    expectedEntityVersion: VERSION,
    createdAt: "2026-07-24T00:50:00.000Z",
    expiresAt: FUTURE,
    reviewedAt: reviewed ? "2026-07-24T00:51:00.000Z" : null,
  };
}

function evidence(overrides: Partial<PharmacyAdminStateMachineEvidence> = {}): PharmacyAdminStateMachineEvidence {
  return {
    entityId: "pharmacy-1",
    generatedAt: NOW,
    dryRun: null,
    review: null,
    authorization: null,
    reservation: null,
    rollbackSnapshot: null,
    publishReference: null,
    reservationAuditCount: 0,
    mutationStartedAuditCount: 0,
    publishSucceededAuditCount: 0,
    rollbackSucceededAuditCount: 0,
    publicExposureCount: 0,
    entity: { ...entityRow(), updated_at: VERSION },
    auditHistory: [],
    ...overrides,
  };
}

function stageStatus(snapshot: ReturnType<typeof buildPharmacyAdminStateMachineSnapshot>, id: string) {
  return snapshot.stages.find((stage) => stage.id === id)?.status;
}

describe("buildPharmacyAdminStateMachineSnapshot", () => {
  it("starts with only dry-run available and keeps every public boundary closed", () => {
    const snapshot = buildPharmacyAdminStateMachineSnapshot(evidence());

    expect(snapshot.currentStage).toBe("dry_run");
    expect(stageStatus(snapshot, "dry_run")).toBe("available");
    expect(stageStatus(snapshot, "exact_review")).toBe("blocked");
    expect(snapshot.publicVisibility).toBe("private");
    expect(snapshot.indexEligible).toBe(false);
    expect(snapshot.sitemapEligible).toBe(false);
    expect(snapshot.routeEnabled).toBe(false);
    expect(snapshot.bulkAllowed).toBe(false);
    expect(snapshot.automaticMutationRetryAllowed).toBe(false);
    expect(snapshot.rawIdentifiersExposed).toBe(false);
    expect(snapshot.revision).toMatch(/^[a-f0-9]{64}$/);
  });

  it("makes the next operation available only from persisted server evidence", () => {
    const dryRun = buildPharmacyAdminStateMachineSnapshot(evidence({ dryRun: readState() }));
    expect(stageStatus(dryRun, "dry_run")).toBe("complete");
    expect(stageStatus(dryRun, "exact_review")).toBe("available");

    const reviewed = buildPharmacyAdminStateMachineSnapshot(evidence({
      dryRun: readState(),
      review: readState(true),
      authorization: {
        status: "issued",
        issuedAt: "2026-07-24T00:51:00.000Z",
        expiresAt: FUTURE,
        consumedAt: null,
      },
    }));
    expect(stageStatus(reviewed, "authorization_ready")).toBe("complete");
    expect(stageStatus(reviewed, "reservation")).toBe("available");
    expect(reviewed.nextExpiryAt).toBe(FUTURE);
  });

  it("marks stale and expired state fail-closed", () => {
    const stale = buildPharmacyAdminStateMachineSnapshot(evidence({
      dryRun: readState(),
      review: readState(true),
      entity: { ...entityRow(), updated_at: "2026-07-24T00:59:00.000Z" },
    }));
    expect(stale.stale).toBe(true);
    expect(stageStatus(stale, "exact_review")).toBe("stale");

    const expiredRead = { ...readState(true), expiresAt: "2026-07-24T00:59:59.000Z" };
    const expired = buildPharmacyAdminStateMachineSnapshot(evidence({
      dryRun: expiredRead,
      review: expiredRead,
    }));
    expect(stageStatus(expired, "dry_run")).toBe("expired");
    expect(stageStatus(expired, "exact_review")).toBe("expired");
  });

  it("proves the complete ten-stage path after rollback exact recovery", () => {
    const snapshotPayload = logicalSnapshot();
    const snapshot = buildPharmacyAdminStateMachineSnapshot(evidence({
      dryRun: readState(),
      review: readState(true),
      authorization: {
        status: "consumed",
        issuedAt: "2026-07-24T00:51:00.000Z",
        expiresAt: FUTURE,
        consumedAt: "2026-07-24T00:52:00.000Z",
      },
      reservation: {
        status: "rolled_back",
        expiresAt: FUTURE,
        terminalKind: "rolled_back",
      },
      rollbackSnapshot: {
        snapshotHash: "c".repeat(64),
        snapshotPayload,
        restoredAt: "2026-07-24T00:58:00.000Z",
      },
      publishReference: { count: 1, consumedAt: "2026-07-24T00:58:00.000Z" },
      reservationAuditCount: 1,
      mutationStartedAuditCount: 1,
      publishSucceededAuditCount: 1,
      rollbackSucceededAuditCount: 1,
      entity: entityRow(),
      auditHistory: [
        {
          eventType: "reservation_created",
          outcome: "pending",
          schemaVersion: "drkhaleej.import.publishAudit.v2",
          phase: "reservation",
          createdAt: "2026-07-24T00:52:00.000Z",
        },
        {
          eventType: "rollback_succeeded",
          outcome: "rolled_back",
          schemaVersion: "drkhaleej.import.publishAudit.v4",
          phase: "rollback",
          createdAt: "2026-07-24T00:58:00.000Z",
        },
      ],
    }));

    expect(snapshot.stages).toHaveLength(10);
    expect(snapshot.stages.every((stage) => stage.status === "complete")).toBe(true);
    expect(snapshot.currentStage).toBe("bounded_audit_history");
    expect(snapshot.exactRecovery?.verified).toBe(true);
    expect(snapshot.exactRecovery?.mismatchCount).toBe(0);
    expect(snapshot.exactRecovery?.expectedHash).toBe(snapshot.exactRecovery?.actualHash);
    expect(snapshot.auditHistory).toHaveLength(2);
  });

  it("returns only bounded path and hashes when exact recovery mismatches", () => {
    const tampered = entityRow();
    tampered.metadata = {
      ...(tampered.metadata as Record<string, unknown>),
      protected: { licenseNumber: "TAMPERED" },
    };
    const snapshot = buildPharmacyAdminStateMachineSnapshot(evidence({
      dryRun: readState(),
      review: readState(true),
      authorization: { status: "consumed", issuedAt: NOW, expiresAt: FUTURE, consumedAt: NOW },
      reservation: { status: "rolled_back", expiresAt: FUTURE, terminalKind: "rolled_back" },
      rollbackSnapshot: { snapshotHash: "c".repeat(64), snapshotPayload: logicalSnapshot(), restoredAt: NOW },
      publishReference: { count: 1, consumedAt: NOW },
      reservationAuditCount: 1,
      mutationStartedAuditCount: 1,
      publishSucceededAuditCount: 1,
      rollbackSucceededAuditCount: 1,
      entity: tampered,
      auditHistory: [{ eventType: "rollback_succeeded", outcome: "rolled_back", schemaVersion: "v4", phase: "rollback", createdAt: NOW }],
    }));

    expect(snapshot.exactRecovery?.verified).toBe(false);
    expect(snapshot.exactRecovery?.mismatchCount).toBe(1);
    expect(snapshot.exactRecovery?.mismatches[0]?.path).toBe("logical.center.metadata.protected.licenseNumber");
    expect(snapshot.exactRecovery?.mismatches[0]?.expectedHash).toMatch(/^[a-f0-9]{64}$/);
    expect(snapshot.exactRecovery?.mismatches[0]?.actualHash).toMatch(/^[a-f0-9]{64}$/);
    expect(JSON.stringify(snapshot)).not.toContain("LICENSE-P08");
    expect(JSON.stringify(snapshot)).not.toContain("TAMPERED");
  });
});
