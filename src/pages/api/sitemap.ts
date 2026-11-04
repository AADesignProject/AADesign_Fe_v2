import type { NextApiRequest, NextApiResponse } from 'next';

import staticContent from '@/data/static-content.json';
import { getProjectContent } from '@/utils/projectContent';
import { getProjectSlug } from '@/utils/projectSlug';
import { siteUrl } from '@/utils/siteUrl';

// Served as /sitemap.xml (see rewrites in next.config.mjs). Built from the
// project data on request, so a new project shows up without regenerating files.
// Bump this when the main pages' content really changes (projects use
// `updatedAt` in project-content.json).
const staticPagesLastmod = '2026-10-09';
const staticPages = ['', '/profile', '/construction', '/contact'];

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

// Encodes each path segment so `#` and `?` in a file name stay part of the path.
const encodePath = (path: string) =>
  path.split('/').map(encodeURIComponent).join('/');

// Image sitemap: lets Google Images find the project photos at their plain
// file URLs (the page <img> tags point at /_next/image variants).
const imageTags = (paths: Array<string | undefined>) =>
  [...new Set(paths)]
    .filter((p): p is string => !!p && p.startsWith('/'))
    .map(
      (p) =>
        `<image:image><image:loc>${escapeXml(siteUrl + encodePath(p))}</image:loc></image:image>`
    )
    .join('');

// One <url> per language version; both list each other plus x-default.
const entries = (path: string, lastmod?: string, images = '') => {
  const vi = `${siteUrl}${path}`;
  const en = `${siteUrl}/en${path}`;
  const alternates = [
    ['vi', vi],
    ['en', en],
    ['x-default', vi],
  ]
    .map(
      ([hreflang, href]) =>
        `<xhtml:link rel="alternate" hreflang="${escapeXml(hreflang)}" href="${escapeXml(href)}"/>`
    )
    .join('');

  return [vi, en].map(
    (loc) =>
      `<url><loc>${escapeXml(loc)}</loc>${lastmod ? `<lastmod>${escapeXml(lastmod)}</lastmod>` : ''}${alternates}${images}</url>`
  );
};

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const urls = [
    ...staticPages.flatMap((path) => entries(path, staticPagesLastmod)),
    ...staticContent.projects.flatMap((project) =>
      entries(
        `/construction/${getProjectSlug(project)}`,
        getProjectContent(project._id).updatedAt,
        imageTags([project.thumbnail, ...(project.images ?? [])])
      )
    ),
  ];

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=3600, stale-while-revalidate=86400'
  );
  res
    .status(200)
    .send(
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls.join('\n')}\n</urlset>\n`
    );
}
