import fs from 'node:fs';

const geoPath = 'src/config/geo/oman.ts';
const countryPrefix = '/oman';
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function readFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing geo file: ${filePath}`);
  }

  return fs.readFileSync(filePath, 'utf8');
}

function section(source, exportName) {
  const marker = `export const ${exportName}`;
  const start = source.indexOf(marker);
  if (start === -1) return '';

  const nextExport = source.indexOf('\nexport const ', start + marker.length);
  return source.slice(start, nextExport === -1 ? source.length : nextExport);
}

function stringProp(line, prop) {
  const match = line.match(new RegExp(`${prop}: '([^']*)'`));
  return match?.[1] ?? null;
}

function rawProp(line, prop) {
  const match = line.match(new RegExp(`${prop}: ([^,}]+)`));
  if (!match) return null;

  const value = match[1].trim();
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (/^\d+$/.test(value)) return Number(value);
  return value.replace(/^'|'$/g, '');
}

function prune(item) {
  return Object.fromEntries(
    Object.entries(item).filter(([, value]) => value !== null && value !== undefined && value !== ''),
  );
}

function parseRegistry(source, exportName, registryType) {
  return section(source, exportName)
    .split('\n')
    .filter((line) => line.includes("slug: '"))
    .map((line) => prune({
      type: registryType,
      slug: stringProp(line, 'slug'),
      governorateSlug: stringProp(line, 'governorateSlug'),
      wilayatSlug: stringProp(line, 'wilayatSlug'),
      labelEn: stringProp(line, 'labelEn'),
      labelAr: stringProp(line, 'labelAr'),
      countryCode: stringProp(line, 'countryCode'),
      scope: rawProp(line, 'scope'),
      publicLaunchPhase: rawProp(line, 'publicLaunchPhase'),
      isMvp: rawProp(line, 'isMvp'),
    }));
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertKebabSlug(entity, entityType) {
  assert(entity.slug, `${entityType} is missing slug`);
  assert(slugPattern.test(entity.slug), `${entityType} has invalid slug: ${entity.slug}`);
}

function uniqueValues(values, label) {
  const seen = new Set();
  for (const value of values) {
    assert(!seen.has(value), `Duplicate ${label}: ${value}`);
    seen.add(value);
  }
}

function routePath(...parts) {
  return parts.join('/').replace(/\/+/g, '/');
}

const source = readFile(geoPath);

const governorates = parseRegistry(source, 'OMAN_GOVERNORATES', 'governorate');
const wilayats = parseRegistry(source, 'OMAN_WILAYATS', 'wilayat');
const areas = parseRegistry(source, 'OMAN_AREAS', 'area');

assert(governorates.length > 0, 'No governorates found');
assert(wilayats.length > 0, 'No wilayats found');

for (const governorate of governorates) assertKebabSlug(governorate, 'Governorate');
for (const wilayat of wilayats) assertKebabSlug(wilayat, 'Wilayat');
for (const area of areas) assertKebabSlug(area, 'Area');

uniqueValues(governorates.map((item) => item.slug), 'governorate slug');
uniqueValues(wilayats.map((item) => `${item.governorateSlug}/${item.slug}`), 'wilayat route key');
uniqueValues(areas.map((item) => `${item.governorateSlug}/${item.wilayatSlug}/${item.slug}`), 'area route key');

const governorateSlugs = new Set(governorates.map((item) => item.slug));
const wilayatKeys = new Set(wilayats.map((item) => `${item.governorateSlug}/${item.slug}`));

for (const wilayat of wilayats) {
  assert(governorateSlugs.has(wilayat.governorateSlug), `Wilayat references missing governorate: ${wilayat.slug} -> ${wilayat.governorateSlug}`);
}

for (const area of areas) {
  assert(governorateSlugs.has(area.governorateSlug), `Area references missing governorate: ${area.slug} -> ${area.governorateSlug}`);
  assert(wilayatKeys.has(`${area.governorateSlug}/${area.wilayatSlug}`), `Area references missing wilayat: ${area.slug} -> ${area.governorateSlug}/${area.wilayatSlug}`);
}

const routes = [
  { type: 'country', path: countryPrefix },
  ...governorates.map((governorate) => ({
    type: 'governorate',
    path: routePath(countryPrefix, governorate.slug),
    publicLaunchPhase: governorate.publicLaunchPhase,
    isMvp: governorate.isMvp,
  })),
  ...wilayats.map((wilayat) => ({
    type: 'wilayat',
    path: routePath(countryPrefix, wilayat.governorateSlug, wilayat.slug),
    publicLaunchPhase: wilayat.publicLaunchPhase,
    isMvp: wilayat.isMvp,
  })),
  ...areas.map((area) => ({
    type: 'area',
    path: routePath(countryPrefix, area.governorateSlug, area.wilayatSlug, area.slug),
    publicLaunchPhase: area.publicLaunchPhase,
    isMvp: area.isMvp,
  })),
];

uniqueValues(routes.map((item) => item.path), 'route path');

for (const route of routes) {
  assert(route.path.startsWith(countryPrefix), `Route does not start with ${countryPrefix}: ${route.path}`);
  assert(!route.path.includes('//'), `Route contains duplicate slash: ${route.path}`);
  assert(route.path === route.path.toLowerCase(), `Route path must be lowercase: ${route.path}`);
}

const summary = routes.reduce((acc, route) => {
  acc[route.type] = (acc[route.type] ?? 0) + 1;
  return acc;
}, {});

console.log('Oman geo route contract is valid.');
console.log({
  prefix: countryPrefix,
  totalRoutes: routes.length,
  ...summary,
});
