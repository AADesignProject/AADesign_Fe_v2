import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const staticContent = require('./src/data/static-content.json');

const toSlugSegment = (value) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const getProjectSlug = (project) =>
  toSlugSegment([project.name, project.address].filter(Boolean).join(' ')) ||
  project._id;

const redirectsToSlug = (from, project) => {
  const slug = getProjectSlug(project);

  return [
    {
      source: `/construction/${from}`,
      destination: `/construction/${slug}`,
      permanent: true,
      locale: false,
    },
    {
      source: `/en/construction/${from}`,
      destination: `/en/construction/${slug}`,
      permanent: true,
      locale: false,
    },
    {
      source: `/vi/construction/${from}`,
      destination: `/construction/${slug}`,
      permanent: true,
      locale: false,
    },
    {
      source: `/en/en/construction/${from}`,
      destination: `/en/construction/${slug}`,
      permanent: true,
      locale: false,
    },
  ];
};

const projectIdRedirects = staticContent.projects.flatMap((project) =>
  redirectsToSlug(project._id, project)
);

// Old slug -> project id, for slugs renamed by typo fixes (Diamon, Vinhome).
const legacySlugs = {
  'bgr-diamon-residence-le-van-luong-ha-noi': '67fa23db6644672a6bf73ba8',
  'hoa-lan-vinhome-vinhome-ha-noi': '67f9ef7a6644672a6bf73b57',
  'chung-cu-vinhome-sai-gon': '67f9f3a96644672a6bf73b77',
};

const legacySlugRedirects = Object.entries(legacySlugs).flatMap(
  ([oldSlug, projectId]) =>
    redirectsToSlug(
      oldSlug,
      staticContent.projects.find((project) => project._id === projectId)
    )
);

// Next only strips one locale prefix, so /en/en/x renders as a copy of /en/x.
// Send it to the real URL (after the ID rules, which are exact).
// Not done for /vi/x: `locale: false` rules also see the default-locale
// prefix, so /vi/:path* -> /:path* would loop. Canonical tags cover /vi/x.
const duplicateLocaleRedirects = [
  {
    source: '/en/en/:path*',
    destination: '/en/:path*',
    permanent: true,
    locale: false,
  },
];

/** @type {import('next').NextConfig} */
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com https://*.vercel-insights.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://aa-design.s3.ap-southeast-1.amazonaws.com https://*.googleusercontent.com https://*.gstatic.com https://maps.googleapis.com",
  "font-src 'self' data:",
  "connect-src 'self' https://vitals.vercel-insights.com https://*.vercel-insights.com https://aa-design.s3.ap-southeast-1.amazonaws.com",
  'frame-src https://www.google.com',
  'upgrade-insecure-requests',
].join('; ');

const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['en', 'vi'],
    defaultLocale: 'vi',
    // Without this `/` redirects English browsers to /en, so one URL would
    // serve two languages.
    localeDetection: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'aa-design.s3.ap-southeast-1.amazonaws.com',
        pathname: '/**',
      },
    ],
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    dangerouslyAllowSVG: false,
    formats: ['image/webp'],
    // Next 16 only allows quality 75 unless listed; the pages use 80/85/90.
    qualities: [75, 80, 85, 90],
    // Vercel bills per image transformation. Photo file names carry a
    // timestamp, so a changed photo gets a new URL and a long TTL is safe.
    minimumCacheTTL: 2678400,
    localPatterns: [{ pathname: '/images/**' }],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  async rewrites() {
    return [{ source: '/sitemap.xml', destination: '/api/sitemap' }];
  },
  async redirects() {
    return [
      ...projectIdRedirects,
      ...legacySlugRedirects,
      ...duplicateLocaleRedirects,
    ];
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value:
              'camera=(), microphone=(), geolocation=(), payment=(), usb=(), accelerometer=(), gyroscope=(), magnetometer=()',
          },
          {
            key: 'Content-Security-Policy',
            value: contentSecurityPolicy,
          },
          {
            key: 'X-Permitted-Cross-Domain-Policies',
            value: 'none',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
