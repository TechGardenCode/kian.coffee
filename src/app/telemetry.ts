import * as Sentry from '@sentry/angular';

interface RuntimeEnv {
  OPENPANEL_CLIENT_ID?: string;
  GLITCHTIP_DSN?: string;
  APP_ENV?: string;
}

declare global {
  interface Window {
    __ENV?: RuntimeEnv;
  }
}

// Only Sentry boots here — it hooks into Angular's ErrorHandler and
// benefits from sitting in appConfig providers. OpenPanel is initialized
// inline in index.html because op1.js's drain loop hard-assumes the queue
// has an `init` entry when it runs, which races with Angular bootstrap.
export function initTelemetry(): void {
  if (typeof window === 'undefined') return;

  const env = window.__ENV;
  if (!env?.GLITCHTIP_DSN) return;

  Sentry.init({
    dsn: env.GLITCHTIP_DSN,
    environment: env.APP_ENV ?? 'unknown',
    tracesSampleRate: 0.1,
  });
}
