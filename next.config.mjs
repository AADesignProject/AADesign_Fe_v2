/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['en', 'vi'],
    defaultLocale: 'vi',
  },
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: "aa-design.s3.ap-southeast-1.amazonaws.com"
    }],
  },
  async rewrites() {
    return [
      {
        source: '/:lang(en|vi)/:path*',
        destination: '/:path*',
      },
    ];
  },
};

export default nextConfig;