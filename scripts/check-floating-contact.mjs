import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const read = (relativePath) =>
  fs.readFileSync(path.join(root, relativePath), 'utf8');

const assertIncludes = (source, expected, message) => {
  if (!source.includes(expected)) {
    throw new Error(message);
  }
};

const assertMatches = (source, pattern, message) => {
  if (!pattern.test(source)) {
    throw new Error(message);
  }
};

const component = read('src/components/floating-contact.tsx');
const layout = read('src/components/layout.tsx');
const styles = read('src/styles/floating-contact.module.scss');
const constants = read('src/constant/general.ts');
const en = read('src/locales/en/common.json');
const vi = read('src/locales/vi/common.json');

assertIncludes(
  constants,
  'zaloHref',
  'general constants should expose a single Zalo link source',
);

assertIncludes(
  layout,
  '<FloatingContactComponent />',
  'layout should render the floating contact controls globally',
);

assertIncludes(
  component,
  'href={`tel:${phoneNumberHref}`}',
  'floating contact should include a phone link',
);

assertIncludes(
  component,
  'href={zaloHref}',
  'floating contact should include a Zalo link',
);

assertMatches(
  component,
  /aria-label=\{t\('floatingContact\.call'/,
  'phone action should have a localized aria-label',
);

assertMatches(
  component,
  /aria-label=\{t\('floatingContact\.zalo'/,
  'Zalo action should have a localized aria-label',
);

assertIncludes(
  styles,
  'position: fixed;',
  'floating contact styles should pin the controls on screen',
);

assertMatches(
  styles,
  /@keyframes\s+pulseContact/,
  'floating contact styles should define the pulse animation',
);

assertMatches(
  styles,
  /prefers-reduced-motion:\s*reduce/,
  'floating contact animation should respect reduced-motion preference',
);

assertIncludes(en, '"floatingContact"', 'English locale should include labels');
assertIncludes(vi, '"floatingContact"', 'Vietnamese locale should include labels');

console.log('Floating contact checks passed.');
