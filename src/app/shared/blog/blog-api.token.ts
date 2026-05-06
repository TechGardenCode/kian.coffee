import { InjectionToken } from '@angular/core';

/**
 * Base URL for the kian-coffee-blog API. In the browser this is `''` —
 * requests hit the same origin and the apex Gateway path-routes `/api/posts`
 * and `/api/media` to the blog Service. In SSR (Node runtime) we need an
 * absolute URL so HttpClient's fetch can resolve; pointed at the in-cluster
 * Service DNS name.
 */
export const BLOG_API_BASE = new InjectionToken<string>('BLOG_API_BASE');
