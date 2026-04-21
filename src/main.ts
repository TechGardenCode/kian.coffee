import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import posthog from 'posthog-js';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

posthog.init('phc_FkPsD9wHkfK8hPtxUlR2SZw3tJBaCkeZbvVzDxQONai', {
  api_host: 'https://us.i.posthog.com',
  person_profiles: 'always',
  defaults: '2025-05-24',
});

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)],
}).catch((err) => console.error(err));
