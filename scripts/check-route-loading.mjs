import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const files = {
  app: path.join(root, 'src/pages/_app.tsx'),
  layout: path.join(root, 'src/components/layout.tsx'),
  loading: path.join(root, 'src/components/loading.tsx'),
  styles: path.join(root, 'src/styles/loading.module.scss'),
};

const read = (filePath) => fs.readFileSync(filePath, 'utf8');

const checks = [
  {
    file: files.app,
    label: 'App listens for routeChangeStart',
    pattern: /router\.events\.on\(['"]routeChangeStart['"]/,
  },
  {
    file: files.app,
    label: 'App listens for routeChangeComplete',
    pattern: /router\.events\.on\(['"]routeChangeComplete['"]/,
  },
  {
    file: files.app,
    label: 'App listens for routeChangeError',
    pattern: /router\.events\.on\(['"]routeChangeError['"]/,
  },
  {
    file: files.app,
    label: 'App controls loading store',
    pattern: /useLoadingStore/,
  },
  {
    file: files.layout,
    label: 'Layout renders loading overlay without replacing children',
    pattern: /loading\s*&&\s*<LoadingComponent/,
  },
  {
    file: files.loading,
    label: 'Loading component exposes status semantics',
    pattern: /role=["']status["']/,
  },
  {
    file: files.styles,
    label: 'Loading overlay is fixed',
    pattern: /position:\s*fixed;/,
  },
];

const failures = checks.filter(({ file, pattern }) => !pattern.test(read(file)));

if (failures.length > 0) {
  console.error('Route loading check failed.');
  failures.forEach(({ file, label }) => {
    console.error(`- ${label}: ${path.relative(root, file)}`);
  });
  process.exit(1);
}

console.log('Route loading check passed.');
