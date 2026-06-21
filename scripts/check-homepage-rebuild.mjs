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

const index = read('src/pages/index.tsx');
const component = read('src/component-page/home/homepage-landing.tsx');
const styles = read('src/styles/home-page.module.scss');
const en = read('src/locales/en/common.json');
const vi = read('src/locales/vi/common.json');

assertIncludes(
  index,
  '<HomepageLandingComponent />',
  'Homepage should render the rebuilt landing component'
);

const sectionIds = [
  'hero',
  'what-we-do',
  'who-we-serve',
  'regions',
  'quick-proof',
  'primary-cta',
  'social-proof',
  'experience',
  'project-types',
  'featured-images',
  'need-services',
  'featured-projects',
  'process',
  'why-aa-design',
  'founder',
  'reviews',
  'faq',
  'consultation-form',
];

let previousIndex = -1;
for (const sectionId of sectionIds) {
  const indexInComponent = component.indexOf(`id="${sectionId}"`);
  if (indexInComponent === -1) {
    throw new Error(`Missing homepage section id: ${sectionId}`);
  }
  if (indexInComponent < previousIndex) {
    throw new Error(`Homepage section is out of order: ${sectionId}`);
  }
  previousIndex = indexInComponent;
}

assertIncludes(
  component,
  'getLocalizedProjects',
  'Homepage should localize existing project data'
);
assertIncludes(
  component,
  'staticContent.projects',
  'Homepage should advertise from existing project data'
);
assertMatches(
  component,
  /const featuredProjectIds = \[[\s\S]*?67f898307d268cfebb8c0af4[\s\S]*?67f9f0e06644672a6bf73b63[\s\S]*?\]/,
  'Featured projects should be curated from real project ids'
);
assertMatches(
  component,
  /featuredProjectIds[\s\S]*?slice\(0,\s*8\)/,
  'Homepage should show up to 8 featured projects'
);
assertIncludes(
  component,
  "t('home.landing.featuredProjects.scopeLabel'",
  'Project cards should use a scope label instead of fake area data'
);
assertIncludes(
  styles,
  '.landingPage',
  'Homepage styles should define the rebuilt landing wrapper'
);
assertIncludes(en, '"landing"', 'English homepage landing copy is missing');
assertIncludes(vi, '"landing"', 'Vietnamese homepage landing copy is missing');

console.log('Homepage rebuild checks passed.');
