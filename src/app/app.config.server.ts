import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';

import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { BLOG_API_BASE } from './shared/blog/blog-api.token';

const SSR_BLOG_API_BASE =
  process.env['BLOG_API_BASE'] ??
  'http://kian-coffee-blog.kian-coffee.svc.cluster.local:8080';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    // SSR needs an absolute URL — Node fetch can't resolve relative paths.
    { provide: BLOG_API_BASE, useValue: SSR_BLOG_API_BASE },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
