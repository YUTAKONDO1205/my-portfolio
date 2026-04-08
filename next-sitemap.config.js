/** @type {import('next-sitemap').IConfig} */
const siteUrl =
  process.env.SITE_URL || 'https://kondo-yuta-my-portfolio.vercel.app'

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  changefreq: 'monthly',
  autoLastmod: true,
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
  },
  transform: async (config, path) => {
    let priority = 0.8

    if (path === '/') {
      priority = 1
    } else if (path === '/research') {
      priority = 0.9
    }

    return {
      loc: path,
      changefreq: 'monthly',
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    }
  },
}
