import { AngularNodeAppEngine, createNodeRequestHandler, isMainModule, writeResponseToNodeResponse } from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();

/**
 * Allow-list of hostnames the SSR engine will render for. Angular 20+ blocks
 * unknown hosts as SSRF protection — without an allowlist, requests for
 * `localhost` (dev) or the prod hostname fall back to an empty client-rendered
 * shell. Add every externally-reachable hostname here.
 */
const allowedHosts: string[] = [
  'localhost',
  'localhost:4000',
  'localhost:4100',
  'kian.coffee',
  'kian.sh',
  'www.kian.coffee',
];

const angularApp = new AngularNodeAppEngine({ allowedHosts });

/**
 * Per-route TTL cache — keeps SSR rendering cheap and lets `/elsewhere` feel
 * as fresh as Next.js ISR without a full site rebuild. Default TTL is
 * effectively-infinite; routes with external data (just `/elsewhere` today)
 * opt into a short TTL and serve stale-while-revalidate.
 *
 * Cache is keyed by the full URL (pathname + search) and stores the serialized
 * HTML plus when it was rendered. Single-replica in-memory — fine at our
 * traffic; swap for Redis when the site horizontally scales.
 */
interface CacheEntry {
  readonly html: string;
  readonly status: number;
  readonly headers: Record<string, string>;
  readonly renderedAt: number;
}

const HOUR = 60 * 60 * 1000;
const MINUTE = 60 * 1000;
const ROUTE_TTL_MS: ReadonlyArray<{ match: RegExp; ttl: number; swr?: boolean }> = [
  { match: /^\/elsewhere(?:\/|$)/, ttl: 15 * MINUTE, swr: true },
  // Everything else is effectively static between deploys.
  { match: /.*/, ttl: 24 * HOUR },
];

function ttlFor(pathname: string): { ttl: number; swr: boolean } {
  for (const rule of ROUTE_TTL_MS) {
    if (rule.match.test(pathname)) return { ttl: rule.ttl, swr: rule.swr ?? false };
  }
  return { ttl: 24 * HOUR, swr: false };
}

const renderCache = new Map<string, CacheEntry>();
const inFlight = new Map<string, Promise<void>>();

/** Liveness/readiness endpoint for K8s probes. */
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

/**
 * Static assets from the browser build — fonts, images, robots.txt,
 * sitemap.xml, etc. Served with strong caching since Angular fingerprints
 * filenames that change.
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  })
);

/**
 * SSR handler with TTL cache. For cache hits inside TTL: serve immediately.
 * For expired entries on SWR routes: serve stale, refresh in background.
 * For cache misses: render synchronously and store.
 */
app.use(async (req, res, next) => {
  // Skip non-GET/HEAD — let other handlers deal with them.
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();

  const key = req.originalUrl;
  const { ttl, swr } = ttlFor(req.path);
  const now = Date.now();
  const cached = renderCache.get(key);
  const fresh = cached && now - cached.renderedAt < ttl;

  if (fresh) {
    respondFromCache(res, cached);
    return;
  }

  if (cached && swr) {
    // Serve stale, kick off a background refresh (deduplicated).
    respondFromCache(res, cached);
    void refresh(req, key);
    return;
  }

  try {
    await refresh(req, key);
  } catch (err) {
    console.error('[ssr] render failed', req.originalUrl, err);
    if (cached) {
      // Last-known-good beats a 500.
      respondFromCache(res, cached);
      return;
    }
    next(err);
    return;
  }

  const entry = renderCache.get(key);
  if (!entry) return next();
  respondFromCache(res, entry);
});

/** Renders via Angular and stores in cache. Deduplicates concurrent renders. */
async function refresh(req: express.Request, key: string): Promise<void> {
  const existing = inFlight.get(key);
  if (existing) return existing;

  const promise = (async () => {
    const response = await angularApp.handle(req);
    if (!response) return;
    const text = await response.text();
    const headers: Record<string, string> = {};
    response.headers.forEach((value, name) => {
      headers[name] = value;
    });
    renderCache.set(key, {
      html: text,
      status: response.status,
      headers,
      renderedAt: Date.now(),
    });
  })().finally(() => {
    inFlight.delete(key);
  });

  inFlight.set(key, promise);
  return promise;
}

function respondFromCache(res: express.Response, entry: CacheEntry): void {
  for (const [name, value] of Object.entries(entry.headers)) {
    res.setHeader(name, value);
  }
  const ttlRule = ttlFor(new URL(res.req.originalUrl, 'http://localhost').pathname);
  res.setHeader(
    'Cache-Control',
    `public, max-age=0, s-maxage=${Math.floor(ttlRule.ttl / 1000)}`
  );
  res.setHeader('X-Cache-Age', String(Math.floor((Date.now() - entry.renderedAt) / 1000)));
  res.status(entry.status).send(entry.html);
}

const port = Number(process.env['PORT'] ?? 4000);
if (isMainModule(import.meta.url)) {
  app.listen(port, () => {
    console.log(`kian.coffee SSR listening on :${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);
