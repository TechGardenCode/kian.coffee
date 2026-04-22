import { RenderMode, ServerRoute } from '@angular/ssr';

/** Server routing policy: every route is runtime-rendered. No build-time
 *  prerender. The Node server + TTL cache in src/server.ts is what makes
 *  this feel like static hosting for most pages while letting /elsewhere
 *  stay fresh without a redeploy. */
export const serverRoutes: ServerRoute[] = [
  { path: '**', renderMode: RenderMode.Server },
];
