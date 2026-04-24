import * as Sentry from '@sentry/angular';

interface RuntimeEnv {
  OPENPANEL_CLIENT_ID?: string;
  GLITCHTIP_DSN?: string;
  APP_ENV?: string;
}

type OpenPanelFn = ((...args: unknown[]) => void) & { q?: unknown[][] };

declare global {
  interface Window {
    __ENV?: RuntimeEnv;
    op?: OpenPanelFn;
  }
}

export function initTelemetry(): void {
  if (typeof window === 'undefined') return;

  const env = window.__ENV;
  if (!env) return;

  if (env.GLITCHTIP_DSN) {
    Sentry.init({
      dsn: env.GLITCHTIP_DSN,
      environment: env.APP_ENV ?? 'unknown',
      tracesSampleRate: 0.1,
    });
  }

  if (env.OPENPANEL_CLIENT_ID && window.op) {
    window.op('init', {
      clientId: env.OPENPANEL_CLIENT_ID,
      apiUrl: '/api/op',
      trackScreenViews: true,
      trackOutgoingLinks: true,
      trackAttributes: true,
    });
  }
}
