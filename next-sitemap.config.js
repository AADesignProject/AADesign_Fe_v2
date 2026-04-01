/** @type {import('next-sitemap').IConfig} */

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aa-design.vn';

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  exclude: ['/admin/*', '/vi', '/vi/*'],
  changefreq: 'daily',
  priority: 0.7,
  alternateRefs: [
    {
      href: siteUrl,
      hreflang: 'vi',
    },
    {
      href: `${siteUrl}/en`,
      hreflang: 'en',
    },
  ],
};
