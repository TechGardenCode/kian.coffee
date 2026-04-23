# kian.coffee

Source for [kian.coffee](https://kian.coffee) — Kian's personal site. Angular 21 SSR app, deployed to a self-hosted Talos Kubernetes cluster via ArgoCD.

## Stack

- **Angular 21** — standalone components, SSR via [`@angular/ssr`](https://angular.dev/guide/ssr)
- **Tailwind v4** (`@tailwindcss/postcss`)
- **Node 22** + **Express 5** — custom SSR wrapper in [`src/server.ts`](src/server.ts) with a per-route TTL cache
- **Karma / Jasmine** for unit tests
- Multi-stage [`Dockerfile`](Dockerfile) → `ghcr.io/techgardencode/kian.coffee`

## Local development

```bash
npm install
npm start          # ng serve on http://localhost:4200
```

The `prestart` / `prebuild` npm hooks auto-run `build:content`, which regenerates [`src/app/content/lab.generated.ts`](src/app/content/lab.generated.ts) from the parent repo's Ansible inventory and rewrites [`public/sitemap.xml`](public/sitemap.xml). See [Content pipeline](#content-pipeline) below.

## Pages

Route list lives in [`src/app/app.routes.ts`](src/app/app.routes.ts); sitemap is generated from [`scripts/build-sitemap.mjs`](scripts/build-sitemap.mjs).

| Route | Purpose |
|---|---|
| `/` | Landing |
| `/work` | Professional background |
| `/projects` | Selected projects |
| `/lab` | Live homelab inventory (generated from `ansible/inventory/hosts.yml`) |
| `/uses` | Hardware + software I actually use |
| `/now` | What I'm focused on right now |
| `/elsewhere` | Aggregated external feeds — refreshed every 15 min (SWR) |
| `/contact` | Contact |

`/writing` → `/elsewhere` and `/about` → `/work` are kept as redirects.

## Content pipeline

Two node scripts run at build time via the `prebuild` / `prestart` hooks:

- [`scripts/build-lab-content.mjs`](scripts/build-lab-content.mjs) — reads `ansible/inventory/hosts.yml` from the parent `kian.sh` monorepo and emits a typed `src/app/content/lab.generated.ts`. In CI and Docker the parent repo isn't checked out; the script detects this and falls back to the committed `lab.generated.ts`. Never hand-edit that file.
- [`scripts/build-sitemap.mjs`](scripts/build-sitemap.mjs) — writes `public/sitemap.xml`. Add new routes in both this script and `src/app/app.routes.ts`.

## Build & run (production)

```bash
npm run build
node dist/www/server/server.mjs
```

The SSR server listens on `$PORT` (default `4000`) and exposes:

- `GET /health` — liveness/readiness JSON, used by the K8s probes and Docker `HEALTHCHECK`
- Per-route TTL cache — 24h default across the static routes; `/elsewhere` uses a 15-min TTL with stale-while-revalidate so the external-feed aggregator stays fresh between deploys. Cache logic lives entirely in [`src/server.ts`](src/server.ts).

Env vars:

| Name | Default | Notes |
|---|---|---|
| `PORT` | `4000` | SSR listen port |
| `NG_ALLOWED_HOSTS` | _(see Dockerfile)_ | Comma-separated hostnames the SSR engine will render for. Matches the allowlist hardcoded in `src/server.ts` — keep both in sync when adding a domain. |

## Docker

```bash
docker build -t kian.coffee .
docker run --rm -p 4000:4000 kian.coffee
```

Published image: `ghcr.io/techgardencode/kian.coffee:<git-sha>` (also `:latest` for `main`).

## Deploy flow

Fully automated — do not commit image tags anywhere.

1. Push to `main` → [`.github/workflows/deployment.yml`](.github/workflows/deployment.yml) builds the app and pushes the image to GHCR.
2. A final job fires a `repository_dispatch` (event `update-image`) to [`techgardencode/homelab`](https://github.com/techgardencode/homelab).
3. Homelab's `update-image-tag.yml` workflow opens a promotion PR that bumps the tag under `kubernetes/clusters/kian-coffee-dev/`; merging it lets ArgoCD sync dev. Prod is promoted via a separate manual PR.
4. ArgoCD picks up the new revision in seconds via webhook.

**Never edit `image:` / `tag:` / `newTag:` fields in the homelab repo** — the CI pipeline owns them.

## Testing

```bash
npm test              # watch mode
npm run test:ci       # headless Chrome, single run
```

## Commit style

[Conventional Commits](https://www.conventionalcommits.org/), lowercase imperative subject — e.g. `feat(header): scroll-aware nav`, `fix(ssr): add dev.kian.coffee to allowed-hosts`.
