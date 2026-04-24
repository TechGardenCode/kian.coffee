# syntax=docker/dockerfile:1.7

FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

FROM nginxinc/nginx-unprivileged:1.27-alpine AS runtime

COPY nginx.conf             /etc/nginx/conf.d/default.conf
COPY security-headers.conf  /etc/nginx/security-headers.conf
COPY proxy-common.conf      /etc/nginx/proxy-common.conf
COPY docker/runtime-config.template.js        /etc/nginx/runtime-config.template.js
COPY --chmod=0755 docker/render-runtime-config.sh /docker-entrypoint.d/30-render-runtime-config.sh

COPY --from=builder /app/dist/www/browser /usr/share/nginx/html

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:4000/health || exit 1
