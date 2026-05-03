#!/usr/bin/env node
// Generate public/sitemap.xml at build time. Keeps the route list a single
// source of truth: add a route here + in src/app/app.routes.ts and the
// sitemap stays in sync. No dependency on TS build — small duplication is
// cheaper than a TS-aware build hook for something this stable.

import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(__dirname, '..', 'public', 'sitemap.xml');

const SITE_URL = 'https://kian.coffee';
const lastmod = new Date().toISOString().split('T')[0];

/**
 * Public routes. `changefreq` is advisory — crawlers mostly ignore it but
 * it doesn't hurt. Priority is relative only (search engines re-normalize).
 */
const ROUTES = [
  { path: '/', changefreq: 'weekly', priority: 1.0 },
  { path: '/work', changefreq: 'monthly', priority: 0.9 },
  { path: '/projects', changefreq: 'monthly', priority: 0.9 },
  { path: '/lab', changefreq: 'monthly', priority: 0.8 },
  { path: '/uses', changefreq: 'monthly', priority: 0.6 },
  { path: '/now', changefreq: 'weekly', priority: 0.7 },
  { path: '/beans', changefreq: 'monthly', priority: 0.7 },
  { path: '/contact', changefreq: 'yearly', priority: 0.5 },
];

function render() {
  const urls = ROUTES.map(({ path, changefreq, priority }) => {
    const loc = path === '/' ? SITE_URL + '/' : SITE_URL + path;
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

writeFileSync(outPath, render(), 'utf8');
console.log(`sitemap.xml ← ${ROUTES.length} routes`);
