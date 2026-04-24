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
