import { ApplicationConfig, ErrorHandler } from '@angular/core';
import { TitleStrategy, provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { createErrorHandler } from '@sentry/angular';

import { routes } from './app.routes';
import { KianTitleStrategy } from './shared/seo/title-strategy';
import { BLOG_API_BASE } from './shared/blog/blog-api.token';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      })
    ),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    { provide: TitleStrategy, useClass: KianTitleStrategy },
    { provide: ErrorHandler, useValue: createErrorHandler({ showDialog: false }) },
    // Browser default: same-origin, gateway path-routes /api/posts to the blog service.
    { provide: BLOG_API_BASE, useValue: '' },
  ],
};
