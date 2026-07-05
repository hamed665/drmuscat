import { describe, expect, it } from "vitest";

import { buildImportBatchDryRunPayloadExtraction } from "./import-batch-dry-run-payload-adapter";
import { buildImportBatchDryRunLocalSuggestionSummary } from "./import-batch-dry-run-report";

describe("buildImportBatchDryRunPayloadExtraction", () => {
  it("keeps unsupported local suggestion targets unsafe instead of defaulting to hospital", () => {
    const extraction = buildImportBatchDryRunPayloadExtraction({
      candidates: [
        {
          candidateKey: "doctor-1",
          entityType: "doctor",
          candidateStatus: "approved",
          candidatePayload: {
            geo: {
              area: "Al Khuwair",
              governorate: "Muscat",
            },
            relations: {
              localSuggestions: [
                {
                  targetFamily: "clinic",
                  targetKey: "clinic-1",
                  targetName: "Clinic One",
                  targetArea: "Al Khuwair",
                  targetGovernorate: "Muscat",
                  publicVisible: true,
                  confidence: "high",
                  sourceUrl: "https://example.com/clinic-source",
                  lastCheckedAt: "2026-07-01",
                },
                {
                  targetKey: "missing-target-kind-1",
                  targetName: "Missing Target Kind One",
                  targetArea: "Al Khuwair",
                  targetGovernorate: "Muscat",
                  publicVisible: true,
                  confidence: "medium",
                  sourceUrl: "https://example.com/missing-target-kind-source",
                  lastCheckedAt: "2026-07-01",
                },
              ],
            },
          },
        },
      ],
    });

    expect(extraction.localSuggestionRows.map((row) => row.targetFamily)).toEqual(["clinic", "unsupported"]);
    expect(extraction.localSuggestionRows.map((row) => row.targetFamily)).not.toContain("hospital");

    const summary = buildImportBatchDryRunLocalSuggestionSummary({
      rows: extraction.localSuggestionRows,
      candidateKeys: extraction.localSuggestionCandidateKeys,
    });

    expect(summary.unsafePublicCount).toBe(2);
    expect(summary.unsafePublicBlockers.filter((blocker) => blocker.reason === "unsupported_family")).toHaveLength(2);
  });

  it("aligns dry-run source evidence with the runtime local suggestion guard", () => {
    const targetKeys = [
      "pharmacy-source-url",
      "pharmacy-source-name",
      "pharmacy-url-without-last-checked",
      "pharmacy-name-without-last-checked",
      "pharmacy-missing-source-anchor",
    ];
    const extraction = buildImportBatchDryRunPayloadExtraction({
      candidates: [
        {
          candidateKey: "doctor-source",
          entityType: "doctor",
          candidateStatus: "approved",
          candidatePayload: {
            geo: {
              area: "Al Khuwair",
              governorate: "Muscat",
            },
            relations: {
              localSuggestions: [
                {
                  targetFamily: "pharmacy",
                  targetKey: "pharmacy-source-url",
                  targetName: "Source URL Pharmacy",
                  targetArea: "Al Khuwair",
                  targetGovernorate: "Muscat",
                  publicVisible: true,
                  confidence: "high",
                  sourceUrl: "https://example.com/source-url",
                  lastCheckedAt: "2026-07-01",
                },
                {
                  targetFamily: "pharmacy",
                  targetKey: "pharmacy-source-name",
                  targetName: "Source Name Pharmacy",
                  targetArea: "Al Khuwair",
                  targetGovernorate: "Muscat",
                  publicVisible: true,
                  confidence: "high",
                  sourceName: "Oman Ministry of Health directory",
                  lastCheckedAt: "2026-07-01",
                },
                {
                  targetFamily: "pharmacy",
                  targetKey: "pharmacy-url-without-last-checked",
                  targetName: "URL Without Last Checked Pharmacy",
                  targetArea: "Al Khuwair",
                  targetGovernorate: "Muscat",
                  publicVisible: true,
                  confidence: "high",
                  sourceUrl: "https://example.com/source-url-without-date",
                },
                {
                  targetFamily: "pharmacy",
                  targetKey: "pharmacy-name-without-last-checked",
                  targetName: "Name Without Last Checked Pharmacy",
                  targetArea: "Al Khuwair",
                  targetGovernorate: "Muscat",
                  publicVisible: true,
                  confidence: "high",
                  sourceName: "Oman Ministry of Health directory",
                },
                {
                  targetFamily: "pharmacy",
                  targetKey: "pharmacy-missing-source-anchor",
                  targetName: "Missing Source Anchor Pharmacy",
                  targetArea: "Al Khuwair",
                  targetGovernorate: "Muscat",
                  publicVisible: true,
                  confidence: "high",
                  lastCheckedAt: "2026-07-01",
                },
              ],
            },
          },
        },
        ...targetKeys.map((targetKey) => ({
          candidateKey: targetKey,
          entityType: "pharmacy",
          candidateStatus: "approved",
          candidatePayload: {},
        })),
      ],
    });

    const rowsByTargetKey = new Map(extraction.localSuggestionRows.map((row) => [row.targetKey, row]));
    expect(rowsByTargetKey.get("pharmacy-source-name")?.sourceName).toBe("Oman Ministry of Health directory");

    const summary = buildImportBatchDryRunLocalSuggestionSummary({
      rows: extraction.localSuggestionRows,
      candidateKeys: extraction.localSuggestionCandidateKeys,
    });

    expect(summary.publicVisibleCount).toBe(2);
    expect(summary.unsafePublicCount).toBe(3);

    const blockersByTargetKey = new Map(
      summary.unsafePublicBlockers.map((blocker) => [blocker.targetKey, blocker.reason]),
    );
    expect(blockersByTargetKey.get("pharmacy-url-without-last-checked")).toBe("last_checked_missing");
    expect(blockersByTargetKey.get("pharmacy-name-without-last-checked")).toBe("last_checked_missing");
    expect(blockersByTargetKey.get("pharmacy-missing-source-anchor")).toBe("source_missing");
  });

  it("covers representative first-batch local suggestions before publish", () => {
    const checkedAt = "2026-07-05";
    const localSuggestion = (overrides: Record<string, unknown>) => ({
      targetFamily: "pharmacy",
      targetKey: "pharmacy-al-khuwair-one",
      targetName: "Representative Pharmacy One",
      targetArea: "Al Khuwair",
      targetGovernorate: "Muscat",
      sourceName: "Provider official website",
      lastCheckedAt: checkedAt,
      confidence: "high",
      publicVisible: true,
      ...overrides,
    });
    const extraction = buildImportBatchDryRunPayloadExtraction({
      candidates: [
        {
          candidateKey: "doctor-al-khuwair-one",
          entityType: "doctor",
          candidateStatus: "approved",
          candidatePayload: {
            geo: { area: "Al Khuwair", governorate: "Muscat" },
            relations: {
              localSuggestions: [
                localSuggestion({
                  targetName: "Representative Pharmacy One",
                  sourceName: "Oman Ministry of Health directory",
                  confidence: "high",
                }),
                localSuggestion({
                  targetName: "Missing Source Evidence Pharmacy",
                  sourceName: undefined,
                  sourceUrl: undefined,
                }),
                localSuggestion({
                  targetName: "Missing Last Checked Pharmacy",
                  lastCheckedAt: undefined,
                }),
                localSuggestion({
                  targetName: "Wrong Location Pharmacy",
                  targetArea: "Qurum",
                }),
                localSuggestion({
                  targetName: "Missing Target Candidate Pharmacy",
                  targetKey: "pharmacy-not-selected",
                  confidence: "medium",
                }),
                localSuggestion({
                  targetFamily: "doctor",
                  targetKey: "doctor-al-khuwair-one",
                  targetName: "Representative Doctor One",
                  confidence: "medium",
                }),
                localSuggestion({
                  targetName: "Requires Review Pharmacy",
                  requiresReview: true,
                }),
                localSuggestion({
                  targetName: "Disputed Pharmacy",
                  relationStatus: "disputed",
                }),
                localSuggestion({
                  targetFamily: "clinic",
                  targetKey: "clinic-al-khuwair-one",
                  targetName: "Unsupported Clinic One",
                }),
                localSuggestion({
                  targetName: "Private Review Pharmacy",
                  confidence: "medium",
                  publicVisible: false,
                }),
              ],
            },
          },
        },
        {
          candidateKey: "pharmacy-al-khuwair-one",
          entityType: "pharmacy",
          candidateStatus: "approved",
          candidatePayload: {
            geo: { area: "Al Khuwair", governorate: "Muscat" },
            relations: {
              localSuggestions: [
                localSuggestion({
                  targetFamily: "doctor",
                  targetKey: "doctor-al-khuwair-one",
                  targetName: "Representative Doctor One",
                  sourceName: undefined,
                  sourceUrl: "https://example.com/pharmacy-doctor-source",
                  confidence: "medium",
                }),
              ],
            },
          },
        },
        {
          candidateKey: "hospital-al-khuwair-one",
          entityType: "hospital",
          candidateStatus: "approved",
          candidatePayload: {
            geo: { area: "Al Khuwair", governorate: "Muscat" },
            relations: {
              doctors: [
                {
                  doctorKey: "doctor-al-khuwair-one",
                  doctorName: "Representative Doctor One",
                  sourceUrl: "https://example.com/hospital-doctor-source",
                  lastCheckedAt: checkedAt,
                  confidence: "high",
                  branchVerified: true,
                  publicVisible: true,
                },
                {
                  doctorKey: "doctor-al-khuwair-one",
                  doctorName: "Disputed Hospital Doctor One",
                  sourceUrl: "https://example.com/hospital-doctor-disputed-source",
                  lastCheckedAt: checkedAt,
                  confidence: "medium",
                  branchVerified: true,
                  publicVisible: true,
                  relationStatus: "disputed",
                },
              ],
            },
          },
        },
      ],
    } as never);
    const sourceCandidateMissingRow = {
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
      relationStatus: "active",
    };
    const localSuggestions = buildImportBatchDryRunLocalSuggestionSummary({
      rows: [...extraction.localSuggestionRows, sourceCandidateMissingRow as never],
      candidateKeys: extraction.localSuggestionCandidateKeys,
    });
    const localBlockerReasons = localSuggestions.unsafePublicBlockers.map((blocker) => blocker.reason);

    expect(localSuggestions.publicVisibleCount).toBe(2);
    expect(localSuggestions.unsafePublicCount).toBe(9);
    expect(localSuggestions.privateReviewCount).toBe(1);
    expect(extraction.hospitalRelationRows).toHaveLength(2);
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
  });
});
