import { describe, expect, it } from "vitest";

import { buildFirstBatchDryRunReport } from "./import-first-batch-dry-run-bridge";
import {
  importBatchDryRunRequiredChecks,
  type ImportBatchDryRunCheck,
  type ImportBatchDryRunLocalSuggestionRow,
} from "./import-batch-dry-run-report";
import type { ImportBatchDryRunTransformedCandidate } from "./import-batch-dry-run-payload-adapter";
import {
  importFirstBatchSchemaVersion,
  type ImportFirstBatchRow,
  type ImportFirstBatchSelection,
} from "./import-first-batch-selection";

const checkedAt = "2026-07-05";

function selectedRow(input: {
  family: ImportFirstBatchRow["family"];
  candidateId: string;
  canonicalPath: string;
  displayName: string;
}): ImportFirstBatchRow {
  return {
    family: input.family,
    queueId: `${input.candidateId}-queue`,
    candidateId: input.candidateId,
    canonicalPath: input.canonicalPath,
    locale: "en",
    slug: input.candidateId,
    displayName: input.displayName,
    area: "Al Khuwair",
    governorate: "Muscat",
    sourceName: "Oman Ministry of Health directory",
    sourceUrl: "https://example.com/oman-health-directory",
    lastCheckedAt: checkedAt,
    contactOrMapSignal: "official_directory_entry",
    qaOwner: "import-readiness",
    qaStatus: "selected",
    qaNotes: null,
  };
}

function passingChecks(): readonly ImportBatchDryRunCheck[] {
  return importBatchDryRunRequiredChecks.map((key) => ({
    key,
    passed: true,
    notes: null,
  }));
}

const selection: ImportFirstBatchSelection = {
  schemaVersion: importFirstBatchSchemaVersion,
  selectionId: "first-batch-representative-fixture",
  generatedAt: "2026-07-05T00:00:00.000Z",
  caps: {
    doctor: 50,
    pharmacy: 25,
    hospital: 10,
  },
  rows: [
    selectedRow({
      family: "doctor",
      candidateId: "doctor-al-khuwair-one",
      canonicalPath: "/en/om/doctor/doctor-al-khuwair-one",
      displayName: "Representative Doctor One",
    }),
    selectedRow({
      family: "pharmacy",
      candidateId: "pharmacy-al-khuwair-one",
      canonicalPath: "/en/om/pharmacies/pharmacy-al-khuwair-one",
      displayName: "Representative Pharmacy One",
    }),
    selectedRow({
      family: "hospital",
      candidateId: "hospital-al-khuwair-one",
      canonicalPath: "/en/om/hospitals/hospital-al-khuwair-one",
      displayName: "Representative Hospital One",
    }),
  ],
};

const transformedCandidates: readonly ImportBatchDryRunTransformedCandidate[] = [
  {
    candidateKey: "doctor-al-khuwair-one",
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
            targetKey: "pharmacy-al-khuwair-one",
            targetName: "Representative Pharmacy One",
            targetArea: "Al Khuwair",
            targetGovernorate: "Muscat",
            sourceName: "Oman Ministry of Health directory",
            lastCheckedAt: checkedAt,
            confidence: "high",
            publicVisible: true,
          },
          {
            targetFamily: "pharmacy",
            targetKey: "pharmacy-al-khuwair-one",
            targetName: "Missing Source Evidence Pharmacy",
            targetArea: "Al Khuwair",
            targetGovernorate: "Muscat",
            lastCheckedAt: checkedAt,
            confidence: "high",
            publicVisible: true,
          },
          {
            targetFamily: "pharmacy",
            targetKey: "pharmacy-al-khuwair-one",
            targetName: "Missing Last Checked Pharmacy",
            targetArea: "Al Khuwair",
            targetGovernorate: "Muscat",
            sourceName: "Provider official website",
            confidence: "high",
            publicVisible: true,
          },
          {
            targetFamily: "pharmacy",
            targetKey: "pharmacy-al-khuwair-one",
            targetName: "Wrong Location Pharmacy",
            targetArea: "Qurum",
            targetGovernorate: "Muscat",
            sourceName: "Provider official website",
            lastCheckedAt: checkedAt,
            confidence: "high",
            publicVisible: true,
          },
          {
            targetFamily: "pharmacy",
            targetKey: "pharmacy-not-selected",
            targetName: "Missing Target Candidate Pharmacy",
            targetArea: "Al Khuwair",
            targetGovernorate: "Muscat",
            sourceName: "Provider official website",
            lastCheckedAt: checkedAt,
            confidence: "medium",
            publicVisible: true,
          },
          {
            targetFamily: "doctor",
            targetKey: "doctor-al-khuwair-one",
            targetName: "Representative Doctor One",
            targetArea: "Al Khuwair",
            targetGovernorate: "Muscat",
            sourceName: "Provider official website",
            lastCheckedAt: checkedAt,
            confidence: "medium",
            publicVisible: true,
          },
          {
            targetFamily: "pharmacy",
            targetKey: "pharmacy-al-khuwair-one",
            targetName: "Requires Review Pharmacy",
            targetArea: "Al Khuwair",
            targetGovernorate: "Muscat",
            sourceName: "Provider official website",
            lastCheckedAt: checkedAt,
            confidence: "high",
            publicVisible: true,
            requiresReview: true,
          },
          {
            targetFamily: "pharmacy",
            targetKey: "pharmacy-al-khuwair-one",
            targetName: "Disputed Pharmacy",
            targetArea: "Al Khuwair",
            targetGovernorate: "Muscat",
            sourceName: "Provider official website",
            lastCheckedAt: checkedAt,
            confidence: "high",
            publicVisible: true,
            relationStatus: "disputed",
          },
          {
            targetFamily: "clinic",
            targetKey: "clinic-al-khuwair-one",
            targetName: "Unsupported Clinic One",
            targetArea: "Al Khuwair",
            targetGovernorate: "Muscat",
            sourceName: "Provider official website",
            lastCheckedAt: checkedAt,
            confidence: "high",
            publicVisible: true,
          },
          {
            targetFamily: "pharmacy",
            targetKey: "pharmacy-al-khuwair-one",
            targetName: "Private Review Pharmacy",
            targetArea: "Al Khuwair",
            targetGovernorate: "Muscat",
            sourceName: "Provider official website",
            lastCheckedAt: checkedAt,
            confidence: "medium",
            publicVisible: false,
          },
        ],
      },
    },
  },
  {
    candidateKey: "pharmacy-al-khuwair-one",
    entityType: "pharmacy",
    candidateStatus: "approved",
    candidatePayload: {
      geo: {
        area: "Al Khuwair",
        governorate: "Muscat",
      },
      relations: {
        localSuggestions: [
          {
            targetFamily: "doctor",
            targetKey: "doctor-al-khuwair-one",
            targetName: "Representative Doctor One",
            targetArea: "Al Khuwair",
            targetGovernorate: "Muscat",
            sourceUrl: "https://example.com/pharmacy-doctor-source",
            lastCheckedAt: checkedAt,
            confidence: "medium",
            publicVisible: true,
          },
        ],
      },
    },
  },
  {
    candidateKey: "hospital-al-khuwair-one",
    entityType: "hospital",
    candidateStatus: "approved",
    candidatePayload: {
      geo: {
        area: "Al Khuwair",
        governorate: "Muscat",
      },
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
];

const sourceCandidateMissingRow: ImportBatchDryRunLocalSuggestionRow = {
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

describe("representative first-batch dry-run fixtures", () => {
  it("summarizes safe, unsafe, and private local suggestions without publish side effects", () => {
    const report = buildFirstBatchDryRunReport({
      selection,
      generatedAt: "2026-07-05T00:00:00.000Z",
      commitSha: "representative-fixture",
      checks: passingChecks(),
      transformedCandidates,
      localSuggestionRows: [sourceCandidateMissingRow],
      notes: ["Representative fixture only; no database, route, sitemap, or publish writes."],
    });

    expect(report.localSuggestions.publicVisibleCount).toBe(2);
    expect(report.localSuggestions.unsafePublicCount).toBe(9);
    expect(report.localSuggestions.privateReviewCount).toBe(1);
    expect(report.hospitalRelations.publicVisibleCount).toBe(1);
    expect(report.hospitalRelations.unsafePublicCount).toBe(1);
    expect(report.decision).toBe("no_go");

    expect(report.localSuggestions.unsafePublicBlockers.map((blocker) => blocker.reason)).toEqual(
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
    expect(report.hospitalRelations.unsafePublicBlockers.map((blocker) => blocker.reason)).toEqual([
      "ambiguous_review_required",
    ]);
  });
});
