import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import httpProxy from 'http-proxy';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();

// SSRF guard. Production traffic arrives via the gateway with Host:
// kian.coffee (or dev.kian.coffee); pod IPs and localhost would otherwise
// be rejected with 400. Override via NG_ALLOWED_HOSTS for ad-hoc hosts.
const ALLOWED_HOSTS = (process.env['NG_ALLOWED_HOSTS']?.split(',').map((s) => s.trim()).filter(Boolean)) ?? [
  'kian.coffee',
  'dev.kian.coffee',
  'localhost',
  '127.0.0.1',
];

const angularApp = new AngularNodeAppEngine({ allowedHosts: ALLOWED_HOSTS });

const OPENPANEL_HOST = process.env['OPENPANEL_HOST'] ?? 'openpanel.techgarden.gg';
const GLITCHTIP_HOST = process.env['GLITCHTIP_HOST'] ?? 'glitchtip.techgarden.gg';
const GLITCHTIP_DSN = process.env['GLITCHTIP_DSN'] ?? '';
const GLITCHTIP_PUBLIC_KEY = parseDsnPublicKey(GLITCHTIP_DSN);

const SECURITY_HEADERS: Record<string, string> = {
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'X-Frame-Options': 'DENY',
  'Content-Security-Policy':
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline'; " +
    "connect-src 'self'; " +
    "img-src 'self' data:; " +
    "style-src 'self' 'unsafe-inline'; " +
    "font-src 'self' data:; " +
    "frame-ancestors 'none'; " +
    "base-uri 'self'; " +
    "form-action 'self'",
};

app.use((_, res, next) => {
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    res.setHeader(name, value);
  }
  next();
});

// Cheap probe — bypasses Angular handler so K8s liveness/readiness doesn't
// pay an SSR render per check.
app.get('/health', (_, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.json({ status: 'ok' });
});

// Runtime config script — equivalent of the old envsubst step. The browser
// bootstrap (index.html) reads window.__ENV from this file.
app.get('/runtime-config.js', (_, res) => {
  const env = {
    OPENPANEL_CLIENT_ID: process.env['OPENPANEL_CLIENT_ID'] ?? '',
    GLITCHTIP_DSN,
    APP_ENV: process.env['APP_ENV'] ?? 'unknown',
  };
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.send(`window.__ENV = ${JSON.stringify(env)};\n`);
});

// Telemetry tunnels: same-origin proxies so cross-origin CSP stays tight and
// ad-blockers can't take down analytics. http-proxy is the bare minimum we
// need for header rewriting (X-Sentry-Auth injection).
const telemetryProxy = httpProxy.createProxyServer({
  changeOrigin: true,
  secure: true,
  xfwd: true,
});

telemetryProxy.on('error', (err, _req, res) => {
  console.error('[telemetry-proxy]', err);
  if (res && 'writeHead' in res && !res.headersSent) {
    res.writeHead(502, { 'Content-Type': 'text/plain' });
    res.end('Bad Gateway');
  }
});

// /api/op/op1.js → upstream /op1.js (vendor canonical script path).
// Exact match wins over the /api/op/* prefix below regardless of order.
app.get('/api/op/op1.js', (req, res) => {
  req.url = '/op1.js';
  telemetryProxy.web(req, res, {
    target: `https://${OPENPANEL_HOST}`,
    headers: { Host: OPENPANEL_HOST },
  });
});

// /api/op/<rest> → upstream /api/<rest>. express strips the mount path, so
// we re-prefix /api onto req.url before proxying.
app.use('/api/op', (req, res) => {
  req.url = '/api' + req.url;
  telemetryProxy.web(req, res, {
    target: `https://${OPENPANEL_HOST}`,
    headers: { Host: OPENPANEL_HOST },
  });
});

// /api/gt/:projectId/envelope → upstream /api/:projectId/envelope/ (note trailing
// slash in upstream path) with X-Sentry-Auth re-injected. The Sentry browser
// SDK strips that header when using `tunnel:`, but GlitchTip 403s without it.
app.use('/api/gt/:projectId/envelope', (req, res) => {
  const projectId = (req.params as { projectId?: string }).projectId;
  if (!projectId || !/^\d+$/.test(projectId)) {
    res.status(400).end('Bad Request');
    return;
  }
  req.url = `/api/${projectId}/envelope/`;
  const headers: Record<string, string> = { Host: GLITCHTIP_HOST };
  if (GLITCHTIP_PUBLIC_KEY) {
    headers['X-Sentry-Auth'] =
      `Sentry sentry_version=7,sentry_key=${GLITCHTIP_PUBLIC_KEY},sentry_client=kian-coffee-tunnel/1.0`;
  }
  telemetryProxy.web(req, res, {
    target: `https://${GLITCHTIP_HOST}`,
    headers,
  });
});

// Local-dev only: when LOCAL_API_PROXY_TARGET is set, forward the blog-API
// surfaces (which production routes via the gateway) to the configured
// upstream so `localhost` runs match prod end-to-end. Inert in prod.
const LOCAL_API_PROXY_TARGET = process.env['LOCAL_API_PROXY_TARGET'];
if (LOCAL_API_PROXY_TARGET) {
  const upstreamHost = new URL(LOCAL_API_PROXY_TARGET).host;
  const proxyWithMount = (mount: string) => (req: express.Request, res: express.Response) => {
    // express strips the mount path from req.url; re-prefix so the upstream
    // sees the full original path. Strip a leading `/` that immediately
    // precedes `?` or end-of-string so we don't construct /api/posts/ or
    // /api/posts/?foo, which Spring 404s.
    const rest = req.url.replace(/^\/(?=\?|$)/, '');
    req.url = mount + rest;
    telemetryProxy.web(req, res, {
      target: LOCAL_API_PROXY_TARGET,
      headers: { Host: upstreamHost },
    });
  };
  app.use('/api/posts', proxyWithMount('/api/posts'));
  app.use('/api/media', proxyWithMount('/api/media'));
  app.use('/feed', proxyWithMount('/feed'));
  app.get('/sitemap.xml', (req, res) => {
    telemetryProxy.web(req, res, {
      target: LOCAL_API_PROXY_TARGET,
      headers: { Host: upstreamHost },
    });
  });
  console.log(`[local-api-proxy] /api/posts, /api/media, /feed, /sitemap.xml → ${LOCAL_API_PROXY_TARGET}`);
}

// Static assets from the browser bundle. Long-cache for hashed files.
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
    setHeaders: (res, path) => {
      if (path.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-store');
      } else {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
    },
  }),
);

// Everything else → Angular (prerendered HTML or runtime SSR).
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

if (isMainModule(import.meta.url)) {
  const port = Number(process.env['PORT'] ?? 4000);
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export default createNodeRequestHandler(app);

function parseDsnPublicKey(dsn: string): string {
  if (!dsn) return '';
  const match = dsn.match(/^https?:\/\/([^@]+)@/);
  return match ? match[1] : '';
}
