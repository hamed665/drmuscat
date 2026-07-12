#!/usr/bin/env node

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..");
const source = readFileSync(
  path.join(repoRoot, "src/server/admin/import-pharmacy-real-rollback-canary.ts"),
  "utf8",
);

function requirePattern(pattern, message) {
  if (!pattern.test(source)) {
    console.error(`❌ IMPORT-PUBLISH-AG rollback canary: ${message}`);
    process.exit(1);
  }
}

for (const [pattern, message] of [
  [/operation:\s*"rollback"/, "must execute rollback operation"],
  [/confirmation:\s*"ROLLBACK PRIVATE PHARMACY"/, "must require exact rollback confirmation"],
  [/publish_canary_not_verified/, "must require verified publish canary"],
  [/entity_snapshot_mismatch/, "must verify exact original logical snapshot"],
  [/duplicate_rollback_detected/, "must reject duplicate rollback"],
  [/publish_reference_not_consumed/, "must require consumed durable reference"],
  [/publicVisibility:\s*"private"/, "must remain private"],
  [/indexEligible:\s*false/, "must remain noindex"],
  [/sitemapEligible:\s*false/, "must remain excluded from sitemap"],
  [/routeEnabled:\s*false/, "must not enable a public route"],
]) requirePattern(pattern, message);

for (const [pattern, message] of [
  [/\bfetch\s*\(/, "must not call public HTTP endpoints"],
  [/\.from\s*\(/, "must not write/read tables directly in the verifier"],
  [/\.rpc\s*\(/, "must not call RPCs directly in the verifier"],
]) {
  if (pattern.test(source)) {
    console.error(`❌ IMPORT-PUBLISH-AG rollback canary: ${message}`);
    process.exit(1);
  }
}

console.log("IMPORT-PUBLISH-AG Pharmacy real rollback canary check passed.");
