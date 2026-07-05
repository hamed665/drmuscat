import { describe, expect, it } from "vitest";

import {
  buildImportBatchDryRunHospitalRelationSummary,
  buildImportBatchDryRunLocalSuggestionSummary,
  buildImportBatchDryRunReport,
  emptyImportBatchDryRunFamilySummary,
  importBatchDryRunRequiredChecks,
  type ImportBatchDryRunCheck,
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

function baseLocalSuggestionRow(): ImportBatchDryRunLocalSuggestionRow {
  return {
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
  };
}

function baseHospitalRelationRow(): ImportBatchDryRunHospitalRelationRow {
  return {
    hospitalKey: "hospital-al-khuwair-one",
    doctorKey: "doctor-al-khuwair-one",
    doctorName: "Representative Doctor One",
    sourceUrl: "https://example.com/hospital-doctor-source",
    lastCheckedAt: checkedAt,
    confidence: "high",
    branchVerified: true,
    publicVisible: true,
  };
}

describe("representative first-batch dry-run fixtures", () => {
  it("summarizes safe, unsafe, and private suggestions without publish side effects", () => {
    const localSuggestionRows: readonly ImportBatchDryRunLocalSuggestionRow[] = [
      baseLocalSuggestionRow(),
      {
        ...baseLocalSuggestionRow(),
        sourceFamily: "pharmacy",
        sourceKey: "pharmacy-al-khuwair-one",
        targetFamily: "doctor",
        targetKey: "doctor-al-khuwair-one",
        targetName: "Representative Doctor One",
        sourceName: null,
        sourceUrl: "https://example.com/pharmacy-doctor-source",
        confidence: "medium",
        relationStatus: "approved",
      },
      {
        ...baseLocalSuggestionRow(),
        targetName: "Private Review Pharmacy",
        sourceName: "Provider official website",
        confidence: "medium",
        publicVisible: false,
        relationStatus: "active",
      },
      {
        ...baseLocalSuggestionRow(),
        targetName: "Missing Source Evidence Pharmacy",
        sourceName: null,
        sourceUrl: null,
      },
      {
        ...baseLocalSuggestionRow(),
        targetName: "Missing Last Checked Pharmacy",
        sourceName: "Provider official website",
        lastCheckedAt: null,
      },
      {
        ...baseLocalSuggestionRow(),
        targetName: "Wrong Location Pharmacy",
        sourceName: "Provider official website",
        targetArea: "Qurum",
      },
      {
        ...baseLocalSuggestionRow(),
        targetKey: "pharmacy-not-selected",
        targetName: "Missing Target Candidate Pharmacy",
        sourceName: "Provider official website",
        confidence: "medium",
      },
      {
        ...baseLocalSuggestionRow(),
        sourceKey: "doctor-not-in-candidates",
        targetName: "Source Candidate Missing Pharmacy",
        sourceName: "Provider official website",
        confidence: "medium",
      },
      {
        ...baseLocalSuggestionRow(),
        targetFamily: "doctor",
        targetKey: "doctor-al-khuwair-one",
        targetName: "Representative Doctor One",
        sourceName: "Provider official website",
        confidence: "medium",
      },
      {
        ...baseLocalSuggestionRow(),
        targetName: "Requires Review Pharmacy",
        sourceName: "Provider official website",
        requiresReview: true,
      },
      {
        ...baseLocalSuggestionRow(),
        targetName: "Disputed Pharmacy",
        sourceName: "Provider official website",
        relationStatus: "disputed",
      },
      {
        ...baseLocalSuggestionRow(),
        targetFamily: "clinic" as ImportBatchDryRunLocalSuggestionFamily,
        targetKey: "clinic-al-khuwair-one",
        targetName: "Unsupported Clinic One",
        sourceName: "Provider official website",
      },
    ];
    const hospitalRelationRows: readonly ImportBatchDryRunHospitalRelationRow[] = [
      baseHospitalRelationRow(),
      {
        ...baseHospitalRelationRow(),
        doctorName: "Disputed Hospital Doctor One",
        sourceUrl: "https://example.com/hospital-doctor-disputed-source",
        confidence: "medium",
        relationStatus: "disputed",
      },
    ];
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
        afterUrlCount: 0,
        importedDeltaCount: 0,
        unexpectedUrlCount: 0,
        unexpectedUrls: [],
      },
      byFamily: {
        doctor: emptyImportBatchDryRunFamilySummary(),
        pharmacy: emptyImportBatchDryRunFamilySummary(),
        hospital: emptyImportBatchDryRunFamilySummary(),
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
    expect(localBlockerReasons).toEqual(
      expect.arrayContaining([
        "source_missing",
        "last_checked_missing",
        "location_mismatch",
        "target_candidate_missing",
        "source_candidate_missing",
        "same_entity_self_link",
        "ambiguous_review_required",
        "unsupported_family",
      ]),
    );
    expect(hospitalRelations.unsafePublicBlockers.map((blocker) => blocker.reason)).toEqual([
      "ambiguous_review_required",
    ]);
  });
});
