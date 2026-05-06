# syntax=docker/dockerfile:1.7

FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

# Runtime: Node SSR. Replaces the prior nginx stage. Telemetry proxies
# (OpenPanel, GlitchTip), runtime-config injection, security headers, and
# the /health probe all live in src/server.ts now.
FROM node:22-alpine AS runtime

ENV NODE_ENV=production \
    PORT=4000

WORKDIR /app

# Copy only the production runtime artifacts from the build stage.
COPY --from=builder /app/dist/www /app/dist/www
COPY --from=builder /app/package.json /app/package-lock.json ./

# Install runtime deps only. The Angular SSR build emits a self-contained
# server.mjs but it imports `express` and `http-proxy` at runtime.
RUN npm ci --omit=dev --no-audit --no-fund \
 && npm cache clean --force

USER node

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:4000/health || exit 1

CMD ["node", "dist/www/server/server.mjs"]
