import { describe, expect, it } from "vitest";

import {
  buildImportBatchDryRunLocalSuggestionSummary,
  type ImportBatchDryRunLocalSuggestionFamily,
  type ImportBatchDryRunLocalSuggestionRow,
} from "./import-batch-dry-run-report";

function localSuggestionRow(input: {
  sourceFamily?: ImportBatchDryRunLocalSuggestionFamily;
  sourceKey: string;
  targetFamily?: ImportBatchDryRunLocalSuggestionFamily;
  targetKey: string;
}): ImportBatchDryRunLocalSuggestionRow {
  return {
    sourceFamily: input.sourceFamily ?? "doctor",
    sourceKey: input.sourceKey,
    sourceArea: "Al Khuwair",
    sourceGovernorate: "Muscat",
    targetFamily: input.targetFamily ?? "doctor",
    targetKey: input.targetKey,
    targetName: input.targetKey,
    targetArea: "Al Khuwair",
    targetGovernorate: "Muscat",
    sourceName: "Oman Ministry of Health directory",
    sourceUrl: null,
    lastCheckedAt: "2026-07-01",
    confidence: "high",
    publicVisible: true,
    relationStatus: "active",
  };
}

describe("buildImportBatchDryRunLocalSuggestionSummary self-link protection", () => {
  it("blocks only same-family same-key local suggestions", () => {
    const rows = [
      localSuggestionRow({
        sourceFamily: "doctor",
        sourceKey: "doctor-self",
        targetFamily: "doctor",
        targetKey: "doctor-self",
      }),
      localSuggestionRow({
        sourceFamily: "doctor",
        sourceKey: "shared-key",
        targetFamily: "pharmacy",
        targetKey: "shared-key",
      }),
      localSuggestionRow({
        sourceFamily: "doctor",
        sourceKey: "doctor-self",
        targetFamily: "doctor",
        targetKey: "doctor-other",
      }),
    ];

    const summary = buildImportBatchDryRunLocalSuggestionSummary({
      rows,
      candidateKeys: {
        doctor: ["doctor-self", "doctor-other", "shared-key"],
        pharmacy: ["shared-key"],
      },
    });

    expect(summary.publicVisibleCount).toBe(2);
    expect(summary.unsafePublicCount).toBe(1);
    expect(summary.unsafePublicBlockers).toHaveLength(1);
    expect(summary.unsafePublicBlockers[0]?.reason).toBe("same_entity_self_link");
    expect(summary.unsafePublicBlockers[0]?.sourceFamily).toBe("doctor");
    expect(summary.unsafePublicBlockers[0]?.sourceKey).toBe("doctor-self");
    expect(summary.unsafePublicBlockers[0]?.targetFamily).toBe("doctor");
    expect(summary.unsafePublicBlockers[0]?.targetKey).toBe("doctor-self");
  });
});
