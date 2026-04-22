import { SITE } from './site';

/**
 * JSON-LD `Person` schema for the home page. Kept minimal and factually
 * anchored to the CV — no invented attributes. Ships in the rendered HTML
 * so recruiters' structured-data parsers (LinkedIn, Clearbit, Google) can
 * pick it up without executing JS.
 */
export function personJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SITE.owner,
    url: SITE.url,
    jobTitle: 'Lead Software Engineer',
    worksFor: {
      '@type': 'Organization',
      name: 'Mastercard',
    },
    alumniOf: [
      {
        '@type': 'CollegeOrUniversity',
        name: 'Case Western Reserve University',
      },
    ],
    sameAs: [
      'https://www.linkedin.com/in/kian-alikhani-20b656100',
      'https://github.com/TechGardenCode',
    ],
  };
}
