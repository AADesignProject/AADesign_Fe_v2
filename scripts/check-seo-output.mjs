// Run after `npm run build`:  node scripts/check-seo-output.mjs [http://localhost:3000]
// Scans the built HTML for the SEO problems this project has had: /en/en links,
// 24-hex project IDs in links, meta keywords, bad canonical/hreflang, duplicate
// titles/descriptions. With a base URL it also compares /sitemap.xml to the
// canonicals.
import fs from 'node:fs';
import path from 'node:path';

const pagesDir = path.join(process.cwd(), '.next/server/pages');
const base = process.argv[2];
const problems = [];
const report = (page, message) => problems.push(`${page}: ${message}`);

const walk = (dir) =>
  fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) =>
      entry.isDirectory()
        ? walk(path.join(dir, entry.name))
        : entry.name.endsWith('.html')
          ? [path.join(dir, entry.name)]
          : []
    );

const decode = (value) => value.replace(/&amp;/g, '&').replace(/&quot;/g, '"');
const pick = (html, regex) =>
  [...html.matchAll(regex)].map((m) => decode(m[1]));

const titles = new Map();
const descriptions = new Map();
const canonicals = new Set();

for (const file of walk(pagesDir)) {
  const page = path.relative(pagesDir, file);
  if (/^(?:(?:en|vi)\/)?(404|500)\.html$/.test(page)) continue;
  const html = fs.readFileSync(file, 'utf8');

  for (const href of pick(html, /<(?:a|link)\b[^>]*?\shref="([^"]*)"/g)) {
    if (/\/en\/en(\/|$)/.test(href)) report(page, `link ${href} has /en/en`);
    if (/\/[0-9a-f]{24}(\/|$|\?)/.test(href))
      report(page, `link ${href} uses a project ID`);
  }

  const canonical = pick(html, /<link rel="canonical" href="([^"]*)"/g);
  if (canonical.length !== 1)
    report(page, `${canonical.length} canonical tags`);
  else {
    const url = canonical[0];
    canonicals.add(url);
    if (
      !/^https:\/\/[^/]+(\/\S*)?$/.test(url) ||
      (url.endsWith('/') && url.split('/').length > 4)
    ) {
      report(page, `bad canonical ${url}`);
    }
  }

  const alternates = Object.fromEntries(
    [
      ...html.matchAll(
        /<link rel="alternate" hrefLang="([^"]+)" href="([^"]+)"/g
      ),
    ].map((m) => [m[1], decode(m[2])])
  );
  for (const lang of ['vi', 'en', 'x-default']) {
    if (!alternates[lang]) report(page, `missing hreflang ${lang}`);
  }
  if (canonical[0] && ![alternates.vi, alternates.en].includes(canonical[0])) {
    report(page, 'canonical is not one of its own hreflang URLs');
  }

  if (/<meta name="keywords"/.test(html)) report(page, 'has meta keywords');
  const h1Count = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1Count !== 1) report(page, `${h1Count} h1 tags`);

  // Parsed raw, without decoding entities: crawlers that skip JS read this.
  const schemaTypes = new Set();
  for (const [, json] of html.matchAll(
    /<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g
  )) {
    try {
      // seo-header emits one script holding an array of nodes.
      for (const node of [JSON.parse(json)].flat())
        [node['@type']].flat().forEach((t) => t && schemaTypes.add(t));
    } catch {
      report(page, 'JSON-LD is not valid JSON in the server HTML');
    }
  }
  const pagePath = (canonical[0] ?? '').replace(/^https:\/\/[^/]+/, '') || '/';
  if (
    ['/', '/en'].includes(pagePath) &&
    !schemaTypes.has('HomeAndConstructionBusiness')
  )
    report(page, 'home page has no HomeAndConstructionBusiness JSON-LD');
  if (
    /^(\/en)?\/construction\/[^/]+$/.test(pagePath) &&
    !schemaTypes.has('BreadcrumbList')
  )
    report(page, 'project page has no BreadcrumbList JSON-LD');

  const [ogImage] = pick(html, /<meta property="og:image" content="([^"]*)"/g);
  if (!ogImage || !/^https:\/\//.test(ogImage))
    report(page, `og:image is missing or not absolute (${ogImage})`);

  const [title] = pick(html, /<title[^>]*>([^<]*)<\/title>/g);
  const [description] = pick(
    html,
    /<meta name="description" content="([^"]*)"/g
  );
  if (!title) report(page, 'no title');
  if (!description) report(page, 'no description');
  else if ([...description].length < 140 || [...description].length > 160)
    report(
      page,
      `description is ${[...description].length} chars (want 140-160)`
    );
  for (const [map, value] of [
    [titles, title],
    [descriptions, description],
  ]) {
    if (value) map.set(value, [...(map.get(value) ?? []), page]);
  }
}

for (const [label, map] of [
  ['title', titles],
  ['description', descriptions],
]) {
  for (const [value, pages] of map) {
    if (pages.length > 1)
      report(pages.join(', '), `duplicate ${label}: ${value}`);
  }
}

// The list pages must link to every project in their HTML (no "load more").
for (const [file, prefix] of [
  ['vi/construction.html', ''],
  ['en/construction.html', '/en'],
]) {
  const list = fs.readFileSync(path.join(pagesDir, file), 'utf8');
  const hrefs = new Set(pick(list, /\shref="([^"]*)"/g));
  for (const url of canonicals) {
    const projectPath = url.replace(/^https:\/\/[^/]+/, '');
    const isProject = projectPath.startsWith(`${prefix}/construction/`);
    const isOtherLocale = prefix === '' && projectPath.startsWith('/en/');
    if (isProject && !isOtherLocale && !hrefs.has(projectPath))
      report(file, `does not link to ${projectPath}`);
  }
}

if (base) {
  const xml = await (await fetch(`${base}/sitemap.xml`)).text();
  const locs = new Set(
    [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
  );
  if (/changefreq|priority/.test(xml))
    report('sitemap', 'still has changefreq/priority');
  for (const loc of locs) {
    if (/[0-9a-f]{24}/.test(loc)) report('sitemap', `${loc} uses a project ID`);
    if (!canonicals.has(loc))
      report('sitemap', `${loc} is not any page's canonical`);
  }
  for (const url of canonicals) {
    if (!locs.has(url)) report('sitemap', `missing ${url}`);
  }
  console.log(`sitemap: ${locs.size} URLs, built pages: ${canonicals.size}`);

  const robots = await (await fetch(`${base}/robots.txt`)).text();
  if (!/^Sitemap: https:\/\/\S+\/sitemap\.xml$/m.test(robots))
    report('robots.txt', 'no Sitemap line');
  if (/^Disallow:\s*\/(_next|images)/m.test(robots))
    report('robots.txt', 'blocks /_next or /images');

  // Redirects. Next sends `permanent: true` as 308; Google treats it like a 301.
  const probe = async (from) => {
    const res = await fetch(`${base}${from}`, { redirect: 'manual' });
    const to = res.headers.get('location')?.replace(/^https?:\/\/[^/]+/, '');
    return { status: res.status, to };
  };
  const permanent = (status) => [301, 308].includes(status);
  const paths = new Set(
    [...canonicals].map((u) => u.replace(/^https:\/\/[^/]+/, ''))
  );
  const viProject = [...paths].find((p) => /^\/construction\/[^/]+$/.test(p));
  const projectId = JSON.parse(
    fs.readFileSync(
      path.join(process.cwd(), 'src/data/static-content.json'),
      'utf8'
    )
  ).projects[0]._id;

  const doubled = await probe(`/en/en${viProject}`);
  if (!permanent(doubled.status) || doubled.to !== `/en${viProject}`)
    report(
      '/en/en',
      `got ${doubled.status} ${doubled.to}, want permanent -> /en${viProject}`
    );
  for (const prefix of ['', '/en']) {
    const byId = await probe(`${prefix}/construction/${projectId}`);
    if (!permanent(byId.status) || !paths.has(byId.to))
      report(
        `${prefix}/construction/<id>`,
        `got ${byId.status} ${byId.to}, want permanent -> a built page`
      );
    const unknown = await probe(
      `${prefix}/construction/000000000000000000000000`
    );
    if (unknown.status !== 404)
      report(
        `${prefix}/construction/<unknown id>`,
        `got ${unknown.status}, want 404`
      );
  }
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log('SEO output check passed.');
