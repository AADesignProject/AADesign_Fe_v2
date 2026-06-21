/** @type {import('next-sitemap').IConfig} */

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aa-design.vn';

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  autoLastmod: false,
  exclude: ['/admin/*', '/vi', '/vi/*'],
  changefreq: 'daily',
  priority: 0.7,
  transform: async (config, path) => {
    const cleanPath = path.replace(/^\/en(?=\/|$)/, '') || '/';
    const normalizedPath = cleanPath === '/' ? '' : cleanPath;

    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      alternateRefs: [
        {
          href: `${siteUrl}${normalizedPath}`,
          hrefIsAbsolute: true,
          hreflang: 'vi',
        },
        {
          href: `${siteUrl}/en${normalizedPath}`,
          hrefIsAbsolute: true,
          hreflang: 'en',
        },
        {
          href: `${siteUrl}${normalizedPath}`,
          hrefIsAbsolute: true,
          hreflang: 'x-default',
        },
      ],
    };
  },
};
