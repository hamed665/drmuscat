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

function assertIncludes(content, token, label) {
  if (!content.includes(token)) {
    throw new Error(`${label} is missing required token: ${token}`);
  }
}

function assertExcludes(content, token, label) {
  if (content.includes(token)) {
    throw new Error(`${label} must not include forbidden token: ${token}`);
  }
}

const actionPath = 'src/server/admin/draft-center-location-actions.ts';
const typePath = 'src/server/admin/draft-center-location-action-types.ts';
const componentPaths = [
  'src/components/admin/draft-center-location-create-form.tsx',
  'src/components/admin/draft-center-location-panel.tsx',
  'src/components/admin/draft-center-location-edit-form.tsx',
];

const stateTypes = [
  'DraftCenterLocationCreateState',
  'DraftCenterLocationEditState',
  'DraftCenterLocationPrimaryState',
  'DraftCenterLocationReviewState',
];

const actionContent = readFile(actionPath);
assertIncludes(actionContent, '"use server";', actionPath);

for (const token of [
  'export type {',
  'type DraftCenterLocationCreateState =',
  'type DraftCenterLocationEditState =',
  'type DraftCenterLocationPrimaryState =',
  'type DraftCenterLocationReviewState =',
]) {
  assertExcludes(actionContent, token, actionPath);
}

assertIncludes(
  actionContent,
  'from "@/server/admin/draft-center-location-action-types";',
  actionPath,
);

const typeContent = readFile(typePath);
for (const stateType of stateTypes) {
  assertIncludes(typeContent, `export type ${stateType}`, typePath);
}

for (const componentPath of componentPaths) {
  const componentContent = readFile(componentPath);
  const actionImportBlocks = componentContent.match(
    /import[\s\S]*?from "@\/server\/admin\/draft-center-location-actions";/g,
  ) ?? [];

  for (const actionImportBlock of actionImportBlocks) {
    for (const stateType of stateTypes) {
      assertExcludes(actionImportBlock, stateType, componentPath);
    }
  }

  assertIncludes(
    componentContent,
    'from "@/server/admin/draft-center-location-action-types";',
    componentPath,
  );
}

console.log('Admin server action type boundary checks passed.');
