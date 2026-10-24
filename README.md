# piyush-mptra.com

Source for Piyush Mohapatra's portfolio. Static Astro site served by a Cloudflare Worker.

## Run it

```bash
fnm use            # Node 24, from .node-version
npm ci
npm run dev        # http://localhost:4321
npm run build      # static site in dist/, plus a hashed CSP written into dist/_headers
npm run preview    # production build behind the Worker, via wrangler dev
docker compose up --build   # same build from a read-only nginx container on :8080
```

## Where things live

- `src/content/profile.ts`: every fact shown on the site. Edit content here only.
- `src/components/`: one file per section. `src/scripts/`: contour terrain, kinetic type, the agent desk, ⌘K palette, tracking.
- `worker/index.ts`: serves `dist/` and the cookieless analytics endpoint `POST /api/e`.
- `scripts/csp.mjs`: hashes every inline script and style after the build so the CSP never needs `unsafe-inline`.

## Deploy

Pushes to `main` deploy through `.github/workflows/ci.yml` once the repository variable `DEPLOY_ENABLED`
is `true` and the `production` environment holds `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.

## Analytics

Cloudflare Web Analytics (cookieless) for page views, plus first-party events written to Workers Analytics Engine.
No cookies, no IP addresses, no cross-site identifiers. Visitors with Do Not Track or Global Privacy Control send nothing.
