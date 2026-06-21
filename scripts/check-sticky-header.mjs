import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (relativePath) =>
  fs.readFileSync(path.join(root, relativePath), 'utf8');

const headerStyles = read('src/styles/header.module.scss');
const layoutStyles = read('src/styles/layout.module.scss');

const assertIncludes = (source, expected, message) => {
  if (!source.includes(expected)) {
    throw new Error(message);
  }
};

assertIncludes(
  headerStyles,
  'position: fixed;',
  'Header should be fixed so it remains visible while scrolling'
);
assertIncludes(
  headerStyles,
  'top: 0;',
  'Header should pin to the viewport top'
);
assertIncludes(
  headerStyles,
  'z-index: 2600;',
  'Header should sit above page content and floating contact controls'
);
assertIncludes(
  headerStyles,
  'box-shadow:',
  'Fixed header should have separation from scrolled content'
);
assertIncludes(
  layoutStyles,
  'padding-top: var(--header-height)',
  'Main content should reserve space for the fixed header'
);

console.log('Sticky header checks passed.');
