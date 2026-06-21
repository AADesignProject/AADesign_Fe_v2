import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const localeFiles = {
  en: path.join(root, 'src/locales/en/common.json'),
  vi: path.join(root, 'src/locales/vi/common.json'),
};

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'));

const flattenKeys = (value, prefix = '') => {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) =>
      flattenKeys(item, `${prefix}[${index}]`)
    );
  }

  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, nestedValue]) =>
      flattenKeys(nestedValue, prefix ? `${prefix}.${key}` : key)
    );
  }

  return [prefix];
};

const walk = (dirPath) => {
  if (!fs.existsSync(dirPath)) return [];

  return fs.readdirSync(dirPath, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) return walk(fullPath);
    if (!/\.(tsx|ts)$/.test(entry.name)) return [];
    return [fullPath];
  });
};

const vi = readJson(localeFiles.vi);
const en = readJson(localeFiles.en);
const viKeys = new Set(flattenKeys(vi));
const enKeys = new Set(flattenKeys(en));
const missingInEn = [...viKeys].filter((key) => !enKeys.has(key));
const missingInVi = [...enKeys].filter((key) => !viKeys.has(key));

const uiFiles = [
  ...walk(path.join(root, 'src/components')),
  ...walk(path.join(root, 'src/component-page')),
  ...walk(path.join(root, 'src/pages')),
].filter((filePath) => !filePath.endsWith(`${path.sep}_document.tsx`));

const vietnamesePattern =
  /[ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠ-ỹ]/;
const mojibakePattern = /(?:áº|Ã|Ä|Æ|Ð|Â©|Â®|â€|â†)/;
const hardcodedMatches = [];

for (const filePath of uiFiles) {
  const relativePath = path.relative(root, filePath).replaceAll(path.sep, '/');
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//')) return;
    if (vietnamesePattern.test(line) || mojibakePattern.test(line)) {
      hardcodedMatches.push(`${relativePath}:${index + 1}: ${trimmed}`);
    }
  });
}

if (missingInEn.length || missingInVi.length || hardcodedMatches.length) {
  console.error('i18n consistency check failed.');

  if (missingInEn.length) {
    console.error('\nMissing in en/common.json:');
    missingInEn.forEach((key) => console.error(`- ${key}`));
  }

  if (missingInVi.length) {
    console.error('\nMissing in vi/common.json:');
    missingInVi.forEach((key) => console.error(`- ${key}`));
  }

  if (hardcodedMatches.length) {
    console.error('\nHardcoded Vietnamese/mojibake text in UI files:');
    hardcodedMatches.forEach((match) => console.error(`- ${match}`));
  }

  process.exit(1);
}

console.log('i18n consistency check passed.');
