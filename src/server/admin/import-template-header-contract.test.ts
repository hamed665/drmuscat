import { describe, expect, it } from "vitest";

import { buildImportBatchDryRunPayloadExtraction } from "./import-batch-dry-run-payload-adapter";

describe("import template header contract", () => {
  it("maps Excel-style snake_case local suggestion headers through the dry-run adapter", () => {
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
              local_suggestions: [
                {
                  source_family: "doctor",
                  source_key: "doctor-source",
                  source_area: "Al Khuwair",
                  source_governorate: "Muscat",
                  target_family: "pharmacy",
                  target_key: "pharmacy-target",
                  target_name: "Header Contract Pharmacy",
                  target_area: "Al Khuwair",
                  target_governorate: "Muscat",
                  public_visible: true,
                  confidence: "high",
                  source_name: "Oman Ministry of Health directory",
                  source_url: "https://example.com/header-contract-source",
                  last_checked_at: "2026-07-05",
                  relation_status: "active",
                  requires_review: true,
                },
              ],
            },
          },
        },
        {
          candidateKey: "pharmacy-target",
          entityType: "pharmacy",
          candidateStatus: "approved",
          candidatePayload: {},
        },
      ],
    });

    expect(extraction.localSuggestionRows).toHaveLength(1);
    expect(extraction.localSuggestionRows[0]).toMatchObject({
      sourceFamily: "doctor",
      sourceKey: "doctor-source",
      sourceArea: "Al Khuwair",
      sourceGovernorate: "Muscat",
      targetFamily: "pharmacy",
      targetKey: "pharmacy-target",
      targetName: "Header Contract Pharmacy",
      targetArea: "Al Khuwair",
      targetGovernorate: "Muscat",
      publicVisible: true,
      confidence: "high",
      sourceName: "Oman Ministry of Health directory",
      sourceUrl: "https://example.com/header-contract-source",
      lastCheckedAt: "2026-07-05",
      relationStatus: "active",
      requiresReview: true,
    });
  });
});
