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
//
// Transport notes:
// - `tunnel` routes all envelope POSTs through our nginx reverse proxy at
//   /api/gt/<project>/envelope to dodge a broken CORS preflight on the
//   GlitchTip gateway (same root cause as the OpenPanel workaround).
//   Sentry supplies the DSN in each envelope header so the backend knows
//   the project; here we also parse the project ID client-side so the
//   tunnel URL is stable and nginx routing stays simple. When GlitchTip's
//   upstream CORS is fixed, delete the `tunnel` line and point the SDK
//   back at the DSN host directly.
export function initTelemetry(): void {
  if (typeof window === 'undefined') return;

  const env = window.__ENV;
  if (!env?.GLITCHTIP_DSN) return;

  const projectId = env.GLITCHTIP_DSN.match(/\/(\d+)$/)?.[1];
  if (!projectId) return;

  Sentry.init({
    dsn: env.GLITCHTIP_DSN,
    tunnel: `/api/gt/${projectId}/envelope`,
    environment: env.APP_ENV ?? 'unknown',
    tracesSampleRate: 0.1,
  });
}
