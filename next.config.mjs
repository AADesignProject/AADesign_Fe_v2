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

const projectIdRedirects = staticContent.projects.flatMap((project) => {
  const slug = getProjectSlug(project);

  return [
    {
      source: `/construction/${project._id}`,
      destination: `/construction/${slug}`,
      permanent: true,
      locale: false,
    },
    {
      source: `/en/construction/${project._id}`,
      destination: `/en/construction/${slug}`,
      permanent: true,
      locale: false,
    },
    {
      source: `/vi/construction/${project._id}`,
      destination: `/construction/${slug}`,
      permanent: true,
      locale: false,
    },
  ];
});

/** @type {import('next').NextConfig} */
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://*.vercel-insights.com",
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
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  async redirects() {
    return [
      ...projectIdRedirects,
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
