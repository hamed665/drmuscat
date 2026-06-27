export type ImportFirstBatchFamily = "doctor" | "pharmacy" | "hospital";

export type ImportFirstBatchLocale = "en" | "ar";

export type ImportFirstBatchStatus = "selected" | "held" | "removed";

export type ImportFirstBatchSchemaVersion = "drkhaleej.import.firstBatchSelection.v1";

export type ImportFirstBatchCaps = Record<ImportFirstBatchFamily, number>;

export type ImportFirstBatchRow = {
  family: ImportFirstBatchFamily;
  queueId: string;
  candidateId: string;
  canonicalPath: string;
  locale: ImportFirstBatchLocale;
  slug: string;
  displayName: string;
  area: string;
  governorate: string;
  sourceName: string;
  sourceUrl: string | null;
  lastCheckedAt: string;
  contactOrMapSignal: string;
  qaOwner: string;
  qaStatus: ImportFirstBatchStatus;
  qaNotes: string | null;
};

export type ImportFirstBatchSelection = {
  schemaVersion: ImportFirstBatchSchemaVersion;
  selectionId: string;
  generatedAt: string;
  caps: ImportFirstBatchCaps;
  rows: readonly ImportFirstBatchRow[];
};

export const importFirstBatchSchemaVersion: ImportFirstBatchSchemaVersion =
  "drkhaleej.import.firstBatchSelection.v1";

export const firstBatchCaps = {
  doctor: 50,
  pharmacy: 25,
  hospital: 10,
} as const satisfies ImportFirstBatchCaps;

export const firstBatchFamilies: readonly ImportFirstBatchFamily[] = ["doctor", "pharmacy", "hospital"];

export function emptyFirstBatchCounts(): ImportFirstBatchCaps {
  return {
    doctor: 0,
    pharmacy: 0,
    hospital: 0,
  };
}

export function countSelectedFirstBatchRows(rows: readonly ImportFirstBatchRow[]): ImportFirstBatchCaps {
  const counts = emptyFirstBatchCounts();
  for (const row of rows) {
    if (row.qaStatus === "selected") counts[row.family] += 1;
  }
  return counts;
}

export function isFirstBatchWithinCaps(
  rows: readonly ImportFirstBatchRow[],
  caps: ImportFirstBatchCaps = firstBatchCaps,
): boolean {
  const counts = countSelectedFirstBatchRows(rows);
  return firstBatchFamilies.every((family) => counts[family] <= caps[family]);
}
