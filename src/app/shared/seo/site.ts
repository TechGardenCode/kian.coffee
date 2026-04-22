/**
 * Site-level constants — used by the SEO service, JSON-LD schema, and the
 * build-time sitemap generator. Change the canonical URL here if the site
 * ever moves.
 */
export const SITE = {
  name: 'kian.coffee',
  url: 'https://kian.coffee',
  owner: 'Kian Alikhani',
  ogImage: '/og-default.png',
  locale: 'en_US',
  twitter: '@kian_sh',
} as const;
