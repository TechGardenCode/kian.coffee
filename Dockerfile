# syntax=docker/dockerfile:1.7
#
# kian.coffee static container. Two-stage build:
#   1. `builder` — Node 22 Alpine, runs `ng build` with `outputMode: static`.
#      Angular prerenders every route to HTML; output lands in
#      dist/www/browser/.
#   2. `runtime` — nginx-unprivileged Alpine serving the prerendered HTML +
#      fingerprinted assets on :4000 with tuned cache headers.
#
# Every route is static between deploys, so there is no Node runtime,
# no SSR cache, and no host-allowlist to manage.

# ─── build ────────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

# Copy only manifest files first so we can exploit Docker layer caching
# when application code changes but deps don't.
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# Now the rest of the source. Build script runs `build-lab-content.mjs` and
# `build-sitemap.mjs` via the `prebuild` npm hook, so lab inventory + sitemap
# are regenerated at build time.
COPY . .
RUN npm run build

# ─── runtime ──────────────────────────────────────────────────────────────
# nginx-unprivileged: runs as uid 101 by default, listens on high port,
# plays nicely with readOnlyRootFilesystem + non-root SecurityContext.
FROM nginxinc/nginx-unprivileged:1.27-alpine AS runtime

# Replace the default server block with our static + cache config.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Prerendered HTML + hashed JS/CSS/fonts/images.
COPY --from=builder /app/dist/www/browser /usr/share/nginx/html

EXPOSE 4000

# Liveness/readiness — K8s probe uses /health. HEALTHCHECK is belt-and-
# suspenders for local dev.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:4000/health || exit 1
