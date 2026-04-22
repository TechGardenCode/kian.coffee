# syntax=docker/dockerfile:1.7
#
# kian.coffee SSR container. Two-stage build:
#   1. `builder` — Node 22 Alpine + all deps, runs `ng build` (which produces
#      both browser + server bundles into dist/www).
#   2. `runtime`  — minimal Node 22 Alpine, production deps only, runs the
#      Express SSR server on :4000.
#
# The SSR server maintains an in-memory TTL cache so most routes behave like
# SSG (≈24h TTL, invalidated on deploy) while `/elsewhere` refreshes every
# 15 minutes without a redeploy — the feed aggregator reads this.

# ─── build ────────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

# Copy only manifest files first so we can exploit Docker layer caching
# when application code changes but deps don't.
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# Now the rest of the source. Build script runs `build-lab-content.mjs` via
# the `prebuild` npm hook, so the lab inventory data is regenerated from
# ansible/inventory at build time — unless ANSIBLE is not mounted in,
# in which case the previously-committed lab.generated.ts is used.
COPY . .
RUN npm run build

# ─── runtime ──────────────────────────────────────────────────────────────
FROM node:22-alpine AS runtime
WORKDIR /app

# Non-root user for defense in depth. node:alpine ships with a pre-created
# `node` user (uid 1000).
USER node

# Copy only the build output + the package manifests (so npm ci installs
# production deps for the server to run). The browser bundle lives under
# dist/www/browser; the server bundle under dist/www/server. Both are
# referenced by the Express server entrypoint.
COPY --chown=node:node --from=builder /app/package.json /app/package-lock.json ./
COPY --chown=node:node --from=builder /app/dist ./dist

# Production deps only — no dev tooling, no Angular CLI.
RUN npm ci --omit=dev --no-audit --no-fund && npm cache clean --force

ENV NODE_ENV=production
ENV PORT=4000
ENV NG_ALLOWED_HOSTS=kian.coffee,www.kian.coffee,kian.sh,www.kian.sh

EXPOSE 4000

# Liveness + readiness probes should target /health over HTTP. Dockerfile
# HEALTHCHECK is a nice local-dev belt-and-suspenders — Kubernetes will use
# its own probe config.
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:4000/health || exit 1

CMD ["node", "dist/www/server/server.mjs"]
