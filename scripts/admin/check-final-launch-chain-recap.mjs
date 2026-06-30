import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const repoRoot = process.cwd();

function readFile(relativePath) {
  const absolutePath = path.join(repoRoot, relativePath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Missing required file: ${relativePath}`);
  }
  return fs.readFileSync(absolutePath, 'utf8');
}

function mustHave(content, token, label) {
  if (!content.includes(token)) throw new Error(`${label} missing token: ${token}`);
}

const docPath = 'docs/admin/final-launch-chain-recap.md';
const doc = readFile(docPath);

for (const token of [
  'Final Launch Chain Recap',
  'draft center workflow panel',
  'draft center taxonomy panel',
  'draft center location panel',
  'draft center contact review panel',
  'draft center quality panel',
  'publication readiness panel',
  '`draft`',
  '`pending_review`',
  'The readiness helper and panel must keep activation blocked until required evidence is present.',
  'The final server action must:',
  'require `draft_centers.update`',
  'set `status` to `active`',
  'set `is_active` to true',
  'keep `is_claimable` false',
  'write `draft_center.public_profile_activated`',
  'Public center routes must continue using the explicit public eligibility wrapper.',
  '`is_active` equals true',
  '`status` equals `active`',
  'Relation failures must fail closed.',
  'Public UI must remain launch-safe:',
  'active centers read-only view',
  'audit log read-only route',
  'The audit route must remain read-only and gated by `admin.audit.read`.',
  'bulk activation',
  'live provider editing',
  'claim workflow changes',
]) {
  mustHave(doc, token, docPath);
}

const requiredScripts = [
  'admin:provider-publication-contract:validate',
  'admin:final-chain:validate',
  'admin:launch-checklist:validate',
  'admin:post-activation:validate',
  'admin:provider-view-contract:validate',
  'admin:active-centers-readonly:validate',
  'admin:audit-log-readonly:validate',
  'seo:public-catalog-eligibility:validate',
  'seo:public-listing-card-safety:validate',
  'seo:public-launch-safe-ui:validate',
  'import:publish-readiness-audit:validate',
  'import:sitemap-family-caps:validate',
  'import:profile-smoke:validate',
];

for (const token of requiredScripts) {
  mustHave(doc, token, docPath);
}

for (const relativePath of [
  'src/server/admin/draft-center-publication-readiness.ts',
  'src/server/admin/draft-center-public-activation-actions.ts',
  'src/app/admin/draft-centers/[centerId]/page.tsx',
  'src/server/admin/active-centers.ts',
  'src/app/admin/active-centers/page.tsx',
  'src/app/admin/audit-log/page.tsx',
  'src/lib/catalog/public-eligible-queries.ts',
  'scripts/admin/check-admin-final-chain.mjs',
  'scripts/admin/check-post-activation-verifier.mjs',
  'scripts/admin/check-provider-view-contract.mjs',
  'scripts/admin/check-active-centers-readonly-view.mjs',
  'scripts/admin/check-audit-log-readonly-route.mjs',
  'scripts/seo/check-public-launch-safe-ui.mjs',
]) {
  readFile(relativePath);
}

const packagePath = 'package.json';
const packageJson = readFile(packagePath);
for (const token of [
  '"admin:final-launch-recap:validate": "node scripts/admin/check-final-launch-chain-recap.mjs"',
  'pnpm admin:final-launch-recap:validate',
  ...requiredScripts.map((script) => `pnpm ${script}`),
]) {
  mustHave(packageJson, token, packagePath);
}

console.log('Final launch chain recap checks passed.');
