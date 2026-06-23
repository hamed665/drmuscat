import fs from 'node:fs';

const files = {
  verticals: 'src/config/taxonomy/verticals.ts',
  doctorLevels: 'src/config/taxonomy/doctor-levels.ts',
  entityTypes: 'src/config/taxonomy/entity-types.ts',
  specialties: 'src/config/taxonomy/specialties.ts',
  services: 'src/config/taxonomy/services.ts',
};

const validScopes = new Set(['core', 'adjacent', 'deferred', 'excluded']);
const validLaunchPhases = new Set(['1', '2', '3', 'deferred', 'excluded']);
const validLicenseLevels = new Set(['required', 'recommended', 'not_required']);
const validRiskLevels = new Set(['none', 'low', 'medium', 'ymyl_high']);
const validReviewLevels = new Set(['required', 'recommended', 'not_required']);

const errors = [];
const warnings = [];

function readFile(path) {
  if (!fs.existsSync(path)) {
    errors.push(`Missing taxonomy file: ${path}`);
    return '';
  }

  return fs.readFileSync(path, 'utf8');
}

function stringProp(line, prop) {
  const match = line.match(new RegExp(`${prop}: '([^']*)'`));
  return match?.[1];
}

function rawProp(line, prop) {
  const match = line.match(new RegExp(`${prop}: ([^,}]+)`));
  return match?.[1]?.trim().replace(/^'|'$/g, '');
}

function arrayProp(line, prop) {
  const match = line.match(new RegExp(`${prop}: \\[([^\\]]*)\\]`));
  if (!match) return [];
  return [...match[1].matchAll(/'([^']+)'/g)].map((item) => item[1]);
}

function parseRegistry(name, path) {
  return readFile(path)
    .split('\n')
    .filter((line) => line.includes("slug: '"))
    .map((line) => ({
      registry: name,
      path,
      raw: line,
      slug: stringProp(line, 'slug'),
      labelEn: stringProp(line, 'labelEn'),
      labelAr: stringProp(line, 'labelAr'),
      descriptionEn: stringProp(line, 'descriptionEn'),
      descriptionAr: stringProp(line, 'descriptionAr'),
      scope: rawProp(line, 'scope'),
      publicLaunchPhase: rawProp(line, 'publicLaunchPhase'),
      requiresLicense: rawProp(line, 'requiresLicense'),
      medicalRiskLevel: rawProp(line, 'medicalRiskLevel'),
      requiresMedicalReview: rawProp(line, 'requiresMedicalReview'),
      parentSlug: rawProp(line, 'parentSlug'),
      family: rawProp(line, 'family'),
      verticals: arrayProp(line, 'verticals'),
      relatedEntityTypes: arrayProp(line, 'relatedEntityTypes'),
      relatedSpecialtySlugs: arrayProp(line, 'relatedSpecialtySlugs'),
    }));
}

function fail(item, message) {
  errors.push(`${item.registry}:${item.slug ?? 'unknown'}:${item.path} - ${message}`);
}

function warn(item, message) {
  warnings.push(`${item.registry}:${item.slug ?? 'unknown'}:${item.path} - ${message}`);
}

function checkRequiredFields(items) {
  for (const item of items) {
    for (const prop of ['slug', 'labelEn', 'labelAr', 'descriptionEn', 'descriptionAr']) {
      if (!item[prop] || item[prop].trim() === '') {
        fail(item, `Missing or empty ${prop}`);
      }
    }

    if (item.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug)) {
      fail(item, `Invalid slug format: ${item.slug}`);
    }

    if (!item.scope || !validScopes.has(item.scope)) {
      fail(item, `Invalid scope: ${item.scope}`);
    }

    if (!item.publicLaunchPhase || !validLaunchPhases.has(String(item.publicLaunchPhase))) {
      fail(item, `Invalid publicLaunchPhase: ${item.publicLaunchPhase}`);
    }

    const arabicFields = `${item.labelAr ?? ''} ${item.descriptionAr ?? ''}`;

    if (/taxonomy node|service taxonomy item|service within taxonomy/i.test(arabicFields)) {
      fail(item, 'Arabic fields contain obvious English placeholder text');
    }

    if (/خدمة ضمن التصنيف/.test(arabicFields)) {
      warn(item, 'Arabic description may still be generic service placeholder text');
    }
  }
}

function checkUniqueSlugs(name, items) {
  const seen = new Set();

  for (const item of items) {
    if (!item.slug) continue;

    if (seen.has(item.slug)) {
      errors.push(`${name}:${item.slug} duplicate slug found`);
    } else {
      seen.add(item.slug);
    }
  }
}

function checkSetReferences(items, prop, validSet, label) {
  for (const item of items) {
    for (const value of item[prop] ?? []) {
      if (!validSet.has(value)) {
        fail(item, `Invalid ${label}: ${value}`);
      }
    }
  }
}

function serviceFamilies() {
  const source = readFile(files.services);
  const match = source.match(/export type ServiceFamilySlug = ([^;]+);/);
  if (!match) return new Set();
  return new Set([...match[1].matchAll(/'([^']+)'/g)].map((item) => item[1]));
}

const registries = {
  verticals: parseRegistry('verticals', files.verticals),
  doctorLevels: parseRegistry('doctorLevels', files.doctorLevels),
  entityTypes: parseRegistry('entityTypes', files.entityTypes),
  specialties: parseRegistry('specialties', files.specialties),
  services: parseRegistry('services', files.services),
};

for (const [name, items] of Object.entries(registries)) {
  if (items.length === 0) errors.push(`${name} registry has no parsed items`);
  checkRequiredFields(items);
  checkUniqueSlugs(name, items);
}

const verticalSlugs = new Set(registries.verticals.map((item) => item.slug).filter(Boolean));
const entityTypeSlugs = new Set(registries.entityTypes.map((item) => item.slug).filter(Boolean));
const specialtySlugs = new Set(registries.specialties.map((item) => item.slug).filter(Boolean));
const familySlugs = serviceFamilies();

if (familySlugs.size === 0) {
  errors.push('Could not parse ServiceFamilySlug values from services.ts');
}

for (const item of registries.doctorLevels) {
  if (!validLicenseLevels.has(item.requiresLicense)) fail(item, `Invalid requiresLicense: ${item.requiresLicense}`);
}

for (const item of registries.specialties) {
  if (item.parentSlug && item.parentSlug !== 'undefined' && !specialtySlugs.has(item.parentSlug)) {
    fail(item, `Invalid parentSlug: ${item.parentSlug}`);
  }
  if (item.requiresLicense && !validLicenseLevels.has(item.requiresLicense)) fail(item, `Invalid requiresLicense: ${item.requiresLicense}`);
  if (item.medicalRiskLevel && !validRiskLevels.has(item.medicalRiskLevel)) fail(item, `Invalid medicalRiskLevel: ${item.medicalRiskLevel}`);
}

checkSetReferences(registries.specialties, 'verticals', verticalSlugs, 'vertical slug');
checkSetReferences(registries.specialties, 'relatedEntityTypes', entityTypeSlugs, 'related entity type slug');

for (const item of registries.services) {
  if (!item.family || !familySlugs.has(item.family)) fail(item, `Invalid service family: ${item.family}`);
  if (item.requiresLicense && !validLicenseLevels.has(item.requiresLicense)) fail(item, `Invalid requiresLicense: ${item.requiresLicense}`);
  if (item.medicalRiskLevel && !validRiskLevels.has(item.medicalRiskLevel)) fail(item, `Invalid medicalRiskLevel: ${item.medicalRiskLevel}`);
  if (item.requiresMedicalReview && !validReviewLevels.has(item.requiresMedicalReview)) fail(item, `Invalid requiresMedicalReview: ${item.requiresMedicalReview}`);
}

checkSetReferences(registries.services, 'verticals', verticalSlugs, 'vertical slug');
checkSetReferences(registries.services, 'relatedSpecialtySlugs', specialtySlugs, 'related specialty slug');
checkSetReferences(registries.services, 'relatedEntityTypes', entityTypeSlugs, 'related entity type slug');

console.log('Taxonomy registry counts:');
for (const [name, items] of Object.entries(registries)) {
  console.log(`- ${name}: ${items.length}`);
}

if (warnings.length > 0) {
  console.log('\nWarnings:');
  for (const warning of warnings) console.log(`- ${warning}`);
}

if (errors.length > 0) {
  console.error('\nTaxonomy validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log('\nTaxonomy validation passed.');
}
