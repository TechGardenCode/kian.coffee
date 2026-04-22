import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';

import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { FEED_LOADER } from './features/elsewhere/feed-loader';
import { ServerFeedLoader } from './features/elsewhere/feed-loader.server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    // Override the browser-side no-op. Imports the real fetcher on this
    // side of the build only, keeping rss-parser + Node built-ins out of
    // the browser bundle.
    { provide: FEED_LOADER, useClass: ServerFeedLoader },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
