import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const docPath = 'docs/admin/operational-validator-index.md';
const packagePath = 'package.json';

function read(relativePath) {
  const fullPath = path.join(root, relativePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing file: ${relativePath}`);
  }
  return fs.readFileSync(fullPath, 'utf8');
}

function mustContain(source, token, label) {
  if (!source.includes(token)) {
    throw new Error(`${label} must include ${token}`);
  }
}

const packageJson = JSON.parse(read(packagePath));
const doc = read(docPath);
const scripts = Object.entries(packageJson.scripts ?? {})
  .filter(([name]) => name.startsWith('admin:') && name.endsWith(':validate'))
  .sort(([a], [b]) => a.localeCompare(b));

if (scripts.length === 0) {
  throw new Error('Expected at least one admin validator script.');
}

for (const [name, command] of scripts) {
  const scriptPath = String(command).replace('node ', '');
  mustContain(String(command), 'node scripts/admin/', packagePath);
  read(scriptPath);
  mustContain(doc, `\`${name}\``, docPath);
  mustContain(doc, `\`${scriptPath}\``, docPath);
}

for (const heading of [
  'Access and role guards',
  'Draft center location workflow',
  'Contact, quality, and publication gates',
  'Launch chain and read-only surfaces',
  'Compact historical chain'
]) {
  mustContain(doc, heading, docPath);
}

console.log(`Admin operational validator index covers ${scripts.length} validators.`);
