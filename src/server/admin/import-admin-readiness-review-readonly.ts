import "server-only";

import {
  buildAdminReadinessPanelRows,
  buildAdminReadinessSummary,
  type ImportAdminReadinessEntityRow,
  type ImportAdminReadinessPanelRow,
  type ImportAdminReadinessSummary,
} from "./import-admin-readiness-panel";

export type ImportAdminReadinessReviewReadOnlyModel = {
  mode: "read_only";
  summary: ImportAdminReadinessSummary;
  rows: readonly ImportAdminReadinessPanelRow[];
  supportedStates: readonly ["ready", "blocked"];
  visibleBlockerCategories: readonly [
    "geo",
    "seo",
    "schema",
    "relations",
    "duplicate",
    "manual",
    "publish",
    "sitemap",
  ];
  allowedActions: readonly [];
};

export function getImportAdminReadinessReviewReadOnlyModel(
  rows: readonly ImportAdminReadinessEntityRow[] = [],
): ImportAdminReadinessReviewReadOnlyModel {
  return {
    mode: "read_only",
    summary: buildAdminReadinessSummary(rows),
    rows: buildAdminReadinessPanelRows(rows),
    supportedStates: ["ready", "blocked"],
    visibleBlockerCategories: [
      "geo",
      "seo",
      "schema",
      "relations",
      "duplicate",
      "manual",
      "publish",
      "sitemap",
    ],
    allowedActions: [],
  };
}
