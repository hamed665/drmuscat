#!/usr/bin/env node

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..");
const panel = readFileSync(
  path.join(repoRoot, "src/components/admin/import-pharmacy-private-admin-control-panel.tsx"),
  "utf8",
);
const page = readFileSync(
  path.join(repoRoot, "src/app/admin/imports/readiness/page.tsx"),
  "utf8",
);
const model = readFileSync(
  path.join(repoRoot, "src/server/admin/import-pharmacy-minimal-admin-ui-model.ts"),
  "utf8",
);
const actions = readFileSync(
  path.join(repoRoot, "src/app/admin/imports/readiness/actions.ts"),
  "utf8",
);

function requirePattern(source, pattern, message) {
  if (!pattern.test(source)) {
    console.error(`❌ P08 Pharmacy Admin state machine: ${message}`);
    process.exit(1);
  }
}

for (const [pattern, message] of [
  [/"use client"/, "must remain a client action-state panel"],
  [/useActionState/, "must use authenticated Server Action state"],
  [/initialStateMachine/, "must receive initial server readback"],
  [/name="operation" value="refresh_state"/, "must provide explicit readback-only refresh"],
  [/name="stateRevision"/, "must bind every form to a server revision"],
  [/Ten server-authoritative Pharmacy stages/, "must render the ten-stage model"],
  [/No automatic mutation retry/, "must state the no-auto-retry boundary"],
  [/EXECUTE PRIVATE PUBLISH/, "must require entity-bound private publish confirmation"],
  [/ROLLBACK PRIVATE PUBLISH/, "must require entity-bound rollback confirmation"],
  [/state_revision_mismatch/, "must explain multi-tab stale-form collisions"],
  [/Waiting for server readback/, "must avoid optimistic success"],
  [/Bounded audit history/, "must render bounded audit history"],
  [/Exact recovery readback/, "must render exact recovery evidence"],
  [/rounded-3xl/, "must follow the existing rounded Admin card language"],
  [/bg-sky-50\/70/, "must use the restrained tinted panel language"],
  [/aria-labelledby/, "must include accessible section labelling"],
]) requirePattern(panel, pattern, message);

for (const [pattern, message] of [
  [/requirePlatformAdmin/, "page must bind initial state to the authenticated admin"],
  [/createPharmacyAdminStateMachineReaderFromEnvironment/, "page must load initial state from server readback"],
  [/initialStateMachine=/, "page must pass bounded initial state to the client"],
  [/never retried automatically/, "page must preserve no-auto-retry policy"],
  [/P09 automatic canary execution.*remain locked/s, "page must keep P09 and promotion closed"],
]) requirePattern(page, pattern, message);

for (const [pattern, message] of [
  [/"rollback"/, "Server Action must enable the proven rollback operation"],
  [/createPharmacyAdminStateMachineReaderFromEnvironment/, "actions must refresh from persisted server state"],
  [/submittedRevision !== beforeState\.revision/, "actions must reject stale multi-tab submissions"],
  [/state_readback_unverified/, "actions must fail when post-operation readback is not proven"],
  [/operationValue === "refresh_state"/, "refresh must be readback-only"],
  [/runPharmacyPrivateAdminRollbackOperation/, "rollback UI must reuse the existing atomic authority"],
  [/automaticMutationRetryAllowed/, "actions must consume the bounded state-machine contract"],
]) requirePattern(actions, pattern, message);

for (const [pattern, message] of [
  [/resolvePharmacyPreviewCanaryActivation/, "must derive activation from the existing Preview gate"],
  [/publicVisibility:\s*"private"/, "must preserve private visibility"],
  [/indexEligible:\s*false/, "must preserve noindex"],
  [/sitemapEligible:\s*false/, "must remain outside sitemap"],
  [/bulkAllowed:\s*false/, "must reject bulk"],
]) requirePattern(model, pattern, message);

for (const [source, pattern, message] of [
  [panel, /dangerouslySetInnerHTML/, "must not render unrestricted payload HTML"],
  [panel, /process\.env/, "panel must not read environment variables"],
  [panel, /publishReference|rollbackSnapshotId|reservationId/, "panel must not receive raw persistence identifiers"],
  [page, /process\.env/, "route must not interpret runtime environment directly"],
  [actions, /setTimeout|setInterval/, "Server Action must not automatically retry writes"],
]) {
  if (pattern.test(source)) {
    console.error(`❌ P08 Pharmacy Admin state machine: ${message}`);
    process.exit(1);
  }
}

console.log("P08 Pharmacy server-authoritative Admin UI check passed.");
