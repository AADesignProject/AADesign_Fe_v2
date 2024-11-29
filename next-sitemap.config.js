/** @type {import('next-sitemap').IConfig} */

module.exports = {
  siteUrl: process.env.SITE_URL || 'https://aa-design.vn',
  generateRobotsTxt: true,
  exclude: ['/admin/*'],
  changefreq: 'daily',
  priority: 0.7,
};
