import { provideZoneChangeDetection } from "@angular/core";
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import posthog from 'posthog-js';

posthog.init('phc_FkPsD9wHkfK8hPtxUlR2SZw3tJBaCkeZbvVzDxQONai', {
  api_host: 'https://us.i.posthog.com',
  person_profiles: 'always',
  defaults: '2025-05-24',
});

platformBrowserDynamic()
  .bootstrapModule(AppModule, { applicationProviders: [provideZoneChangeDetection()], })
  .catch((err) => console.error(err));
