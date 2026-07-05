import { describe, expect, it } from "vitest";

import {
  buildImportBatchDryRunHospitalRelationSummary,
  buildImportBatchDryRunLocalSuggestionSummary,
  buildImportBatchDryRunReport,
  importBatchDryRunRequiredChecks,
  type ImportBatchDryRunCheck,
  type ImportBatchDryRunFamilySummary,
  type ImportBatchDryRunHospitalRelationRow,
  type ImportBatchDryRunLocalSuggestionFamily,
  type ImportBatchDryRunLocalSuggestionRow,
} from "./import-batch-dry-run-report";

const checkedAt = "2026-07-05";

function passingChecks(): readonly ImportBatchDryRunCheck[] {
  return importBatchDryRunRequiredChecks.map((key) => ({
    key,
    passed: true,
    notes: null,
  }));
}

function familySummary(): ImportBatchDryRunFamilySummary {
  return {
    selectedCount: 1,
    eligibleCount: 1,
    blockedCount: 0,
    sitemapUrlCount: 1,
    sampledUrlCount: 0,
    blockers: [],
    samples: [],
  };
}

const localSuggestionRows: readonly ImportBatchDryRunLocalSuggestionRow[] = [
  {
    sourceFamily: "doctor",
    sourceKey: "doctor-al-khuwair-one",
    sourceArea: "Al Khuwair",
    sourceGovernorate: "Muscat",
    targetFamily: "pharmacy",
    targetKey: "pharmacy-al-khuwair-one",
    targetArea: "Al Khuwair",
    targetGovernorate: "Muscat",
    targetName: "Representative Pharmacy One",
    sourceName: "Oman Ministry of Health directory",
    sourceUrl: null,
    lastCheckedAt: checkedAt,
    confidence: "high",
    publicVisible: true,
    relationStatus: "active",
  },
  {
    sourceFamily: "pharmacy",
    sourceKey: "pharmacy-al-khuwair-one",
    sourceArea: "Al Khuwair",
    sourceGovernorate: "Muscat",
    targetFamily: "doctor",
    targetKey: "doctor-al-khuwair-one",
    targetArea: "Al Khuwair",
    targetGovernorate: "Muscat",
    targetName: "Representative Doctor One",
    sourceName: null,
    sourceUrl: "https://example.com/pharmacy-doctor-source",
    lastCheckedAt: checkedAt,
    confidence: "medium",
    publicVisible: true,
    relationStatus: "approved",
  },
  {
    sourceFamily: "doctor",
    sourceKey: "doctor-al-khuwair-one",
    sourceArea: "Al Khuwair",
    sourceGovernorate: "Muscat",
    targetFamily: "pharmacy",
    targetKey: "pharmacy-al-khuwair-one",
    targetArea: "Al Khuwair",
    targetGovernorate: "Muscat",
    targetName: "Private Review Pharmacy",
    sourceName: "Provider official website",
    sourceUrl: null,
    lastCheckedAt: checkedAt,
    confidence: "medium",
    publicVisible: false,
    relationStatus: "active",
  },
  {
    sourceFamily: "doctor",
    sourceKey: "doctor-al-khuwair-one",
    sourceArea: "Al Khuwair",
    sourceGovernorate: "Muscat",
    targetFamily: "pharmacy",
    targetKey: "pharmacy-al-khuwair-one",
    targetArea: "Al Khuwair",
    targetGovernorate: "Muscat",
    targetName: "Missing Source Evidence Pharmacy",
    sourceName: null,
    sourceUrl: null,
    lastCheckedAt: checkedAt,
    confidence: "high",
    publicVisible: true,
  },
  {
    sourceFamily: "doctor",
    sourceKey: "doctor-al-khuwair-one",
    sourceArea: "Al Khuwair",
    sourceGovernorate: "Muscat",
    targetFamily: "pharmacy",
    targetKey: "pharmacy-al-khuwair-one",
    targetArea: "Al Khuwair",
    targetGovernorate: "Muscat",
    targetName: "Missing Last Checked Pharmacy",
    sourceName: "Provider official website",
    sourceUrl: null,
    lastCheckedAt: null,
    confidence: "high",
    publicVisible: true,
  },
  {
    sourceFamily: "doctor",
    sourceKey: "doctor-al-khuwair-one",
    sourceArea: "Al Khuwair",
    sourceGovernorate: "Muscat",
    targetFamily: "pharmacy",
    targetKey: "pharmacy-al-khuwair-one",
    targetArea: "Qurum",
    targetGovernorate: "Muscat",
    targetName: "Wrong Location Pharmacy",
    sourceName: "Provider official website",
    sourceUrl: null,
    lastCheckedAt: checkedAt,
    confidence: "high",
    publicVisible: true,
  },
  {
    sourceFamily: "doctor",
    sourceKey: "doctor-al-khuwair-one",
    sourceArea: "Al Khuwair",
    sourceGovernorate: "Muscat",
    targetFamily: "pharmacy",
    targetKey: "pharmacy-not-selected",
    targetArea: "Al Khuwair",
    targetGovernorate: "Muscat",
    targetName: "Missing Target Candidate Pharmacy",
    sourceName: "Provider official website",
    sourceUrl: null,
    lastCheckedAt: checkedAt,
    confidence: "medium",
    publicVisible: true,
  },
  {
    sourceFamily: "doctor",
    sourceKey: "doctor-not-in-candidates",
    sourceArea: "Al Khuwair",
    sourceGovernorate: "Muscat",
    targetFamily: "pharmacy",
    targetKey: "pharmacy-al-khuwair-one",
    targetArea: "Al Khuwair",
    targetGovernorate: "Muscat",
    targetName: "Source Candidate Missing Pharmacy",
    sourceName: "Provider official website",
    sourceUrl: null,
    lastCheckedAt: checkedAt,
    confidence: "medium",
    publicVisible: true,
  },
  {
    sourceFamily: "doctor",
    sourceKey: "doctor-al-khuwair-one",
    sourceArea: "Al Khuwair",
    sourceGovernorate: "Muscat",
    targetFamily: "doctor",
    targetKey: "doctor-al-khuwair-one",
    targetArea: "Al Khuwair",
    targetGovernorate: "Muscat",
    targetName: "Representative Doctor One",
    sourceName: "Provider official website",
    sourceUrl: null,
    lastCheckedAt: checkedAt,
    confidence: "medium",
    publicVisible: true,
  },
  {
    sourceFamily: "doctor",
    sourceKey: "doctor-al-khuwair-one",
    sourceArea: "Al Khuwair",
    sourceGovernorate: "Muscat",
    targetFamily: "pharmacy",
    targetKey: "pharmacy-al-khuwair-one",
    targetArea: "Al Khuwair",
    targetGovernorate: "Muscat",
    targetName: "Requires Review Pharmacy",
    sourceName: "Provider official website",
    sourceUrl: null,
    lastCheckedAt: checkedAt,
    confidence: "high",
    publicVisible: true,
    requiresReview: true,
  },
  {
    sourceFamily: "doctor",
    sourceKey: "doctor-al-khuwair-one",
    sourceArea: "Al Khuwair",
    sourceGovernorate: "Muscat",
    targetFamily: "pharmacy",
    targetKey: "pharmacy-al-khuwair-one",
    targetArea: "Al Khuwair",
    targetGovernorate: "Muscat",
    targetName: "Disputed Pharmacy",
    sourceName: "Provider official website",
    sourceUrl: null,
    lastCheckedAt: checkedAt,
    confidence: "high",
    publicVisible: true,
    relationStatus: "disputed",
  },
  {
    sourceFamily: "doctor",
    sourceKey: "doctor-al-khuwair-one",
    sourceArea: "Al Khuwair",
    sourceGovernorate: "Muscat",
    targetFamily: "clinic" as ImportBatchDryRunLocalSuggestionFamily,
    targetKey: "clinic-al-khuwair-one",
    targetArea: "Al Khuwair",
    targetGovernorate: "Muscat",
    targetName: "Unsupported Clinic One",
    sourceName: "Provider official website",
    sourceUrl: null,
    lastCheckedAt: checkedAt,
    confidence: "high",
    publicVisible: true,
  },
];

const hospitalRelationRows: readonly ImportBatchDryRunHospitalRelationRow[] = [
  {
    hospitalKey: "hospital-al-khuwair-one",
    doctorKey: "doctor-al-khuwair-one",
    doctorName: "Representative Doctor One",
    sourceUrl: "https://example.com/hospital-doctor-source",
    lastCheckedAt: checkedAt,
    confidence: "high",
    branchVerified: true,
    publicVisible: true,
    relationStatus: "active",
  },
  {
    hospitalKey: "hospital-al-khuwair-one",
    doctorKey: "doctor-al-khuwair-one",
    doctorName: "Disputed Hospital Doctor One",
    sourceUrl: "https://example.com/hospital-doctor-disputed-source",
    lastCheckedAt: checkedAt,
    confidence: "medium",
    branchVerified: true,
    publicVisible: true,
    relationStatus: "disputed",
  },
];

describe("representative first-batch dry-run fixtures", () => {
  it("summarizes safe, unsafe, and private suggestions without publish side effects", () => {
    const localSuggestions = buildImportBatchDryRunLocalSuggestionSummary({
      rows: localSuggestionRows,
      candidateKeys: {
        doctor: ["doctor-al-khuwair-one"],
        pharmacy: ["pharmacy-al-khuwair-one"],
        hospital: ["hospital-al-khuwair-one"],
      },
    });
    const hospitalRelations = buildImportBatchDryRunHospitalRelationSummary({
      rows: hospitalRelationRows,
      candidateHospitalKeys: ["hospital-al-khuwair-one"],
    });
    const report = buildImportBatchDryRunReport({
      rehearsalId: "first-batch-representative-fixture",
      generatedAt: "2026-07-05T00:00:00.000Z",
      commitSha: "representative-fixture",
      checks: passingChecks(),
      sitemap: {
        beforeUrlCount: 0,
        afterUrlCount: 3,
        importedDeltaCount: 3,
        unexpectedUrlCount: 0,
        unexpectedUrls: [],
      },
      byFamily: {
        doctor: familySummary(),
        pharmacy: familySummary(),
        hospital: familySummary(),
      },
      hospitalRelations,
      localSuggestions,
      notes: ["Representative fixture only; no database, route, sitemap, or publish writes."],
    });
    const localBlockerReasons = localSuggestions.unsafePublicBlockers.map((blocker) => blocker.reason);

    expect(localSuggestions.publicVisibleCount).toBe(2);
    expect(localSuggestions.unsafePublicCount).toBe(9);
    expect(localSuggestions.privateReviewCount).toBe(1);
    expect(hospitalRelations.publicVisibleCount).toBe(1);
    expect(hospitalRelations.unsafePublicCount).toBe(1);
    expect(report.decision).toBe("no_go");

    expect(localBlockerReasons).toContain("source_missing");
    expect(localBlockerReasons).toContain("last_checked_missing");
    expect(localBlockerReasons).toContain("location_mismatch");
    expect(localBlockerReasons).toContain("target_candidate_missing");
    expect(localBlockerReasons).toContain("source_candidate_missing");
    expect(localBlockerReasons).toContain("same_entity_self_link");
    expect(localBlockerReasons).toContain("ambiguous_review_required");
    expect(localBlockerReasons).toContain("unsupported_family");
    expect(hospitalRelations.unsafePublicBlockers.map((blocker) => blocker.reason)).toEqual([
      "ambiguous_review_required",
    ]);
  });
});
