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

const homeDir = 'src/component-page/home';
const index = read('src/pages/index.tsx');
const landing = read(`${homeDir}/homepage-landing.tsx`);
const parts = fs
  .readdirSync(path.join(root, homeDir))
  .filter((file) => file.startsWith('home-') && file.endsWith('.tsx'))
  .map((file) => read(`${homeDir}/${file}`))
  .join('\n');
const styles = read('src/styles/home-page.module.scss');
const en = read('src/locales/en/common.json');
const vi = read('src/locales/vi/common.json');

assertIncludes(
  index,
  '<HomepageLandingComponent />',
  'Homepage should render the landing component'
);

// Sections are composed in this order in the landing component.
const componentOrder = [
  'HomeHero',
  'HomeIntro',
  'HomeFeatured',
  'HomeBand',
  'HomeProcess',
  'HomeServices',
  'HomeTeam',
  'HomeFaq',
  'HomeContact',
];

let previousIndex = -1;
for (const name of componentOrder) {
  const position = landing.indexOf(`<${name}`);
  if (position === -1) throw new Error(`Missing homepage section: ${name}`);
  if (position < previousIndex) {
    throw new Error(`Homepage section is out of order: ${name}`);
  }
  previousIndex = position;
}

// Each section keeps a stable id (the header links to #services).
for (const id of [
  'hero',
  'intro',
  'featured-projects',
  'image-band',
  'process',
  'services',
  'team',
  'faq',
  'consultation-form',
]) {
  assertIncludes(parts, `id="${id}"`, `Missing homepage section id: ${id}`);
}

assertIncludes(
  landing,
  'getLocalizedProjects',
  'Homepage should localize existing project data'
);
assertIncludes(
  landing,
  'staticContent.projects',
  'Homepage should advertise from existing project data'
);
assertIncludes(
  parts,
  "t('home.landing.featuredProjects.scopeLabel'",
  'Project cards should use a scope label instead of fake area data'
);
assertIncludes(
  parts,
  'priority: true',
  'The hero image should be loaded with priority'
);
if ((parts.match(/<h1/g) ?? []).length !== 1) {
  throw new Error('Homepage should render exactly one h1');
}
assertIncludes(
  styles,
  '.landingPage',
  'Homepage styles should define the landing wrapper'
);
assertIncludes(en, '"landing"', 'English homepage landing copy is missing');
assertIncludes(vi, '"landing"', 'Vietnamese homepage landing copy is missing');

console.log('Homepage rebuild checks passed.');
