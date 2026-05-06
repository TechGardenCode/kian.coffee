import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * Per-route render mode. The portfolio surfaces only change on deploy, so they
 * stay prerendered to static HTML and Cloudflare caches them at the edge. Blog
 * routes are runtime SSR because slugs are user-created — we can't enumerate
 * them at build time.
 */
export const serverRoutes: ServerRoute[] = [
  // Blog (runtime SSR — content is dynamic)
  { path: 'blog', renderMode: RenderMode.Server },
  { path: 'blog/tag/:tag', renderMode: RenderMode.Server },
  { path: 'blog/:slug', renderMode: RenderMode.Server },

  // Portfolio (prerendered at build time)
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'work', renderMode: RenderMode.Prerender },
  { path: 'projects', renderMode: RenderMode.Prerender },
  { path: 'lab', renderMode: RenderMode.Prerender },
  { path: 'uses', renderMode: RenderMode.Prerender },
  { path: 'now', renderMode: RenderMode.Prerender },
  { path: 'contact', renderMode: RenderMode.Prerender },
  { path: 'beans', renderMode: RenderMode.Prerender },
  { path: 'about', renderMode: RenderMode.Prerender },

  // Anything else (router redirects to '') falls through to SSR.
  { path: '**', renderMode: RenderMode.Server },
];
