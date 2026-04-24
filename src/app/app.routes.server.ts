import { RenderMode, ServerRoute } from '@angular/ssr';

/** Every route is prerendered to static HTML at build time. Content only
 *  changes on deploy, so there's no runtime rendering — nginx serves the
 *  dist/ output directly and Cloudflare caches HTML at the edge. */
export const serverRoutes: ServerRoute[] = [
  { path: '**', renderMode: RenderMode.Prerender },
];
