# piyushmoha.com

Source for Piyush Mohapatra's portfolio at https://piyushmoha.com. Static Astro site served by a Cloudflare Worker.
 is a second Worker that sends piyush-mptra.com, www.piyush-mptra.com and www.piyushmoha.com to piyushmoha.com.

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

Every push to `main` deploys from GitHub Actions (`.github/workflows/ci.yml`) once build, secret scan and container scan pass.
It ships the site Worker and the `www-redirect/` Worker. Needs the `production` environment secrets
`CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`, and the repository variable `DEPLOY_ENABLED=true`.
Manual deploy: `npm run deploy`. `.gitlab-ci.yml` is a dormant mirror of the same pipeline; see [docs/DEPLOY.md](docs/DEPLOY.md).

## Analytics

Cloudflare Web Analytics (cookieless) for page views, plus first-party events written to Workers Analytics Engine.
No cookies, no IP addresses, no cross-site identifiers. Visitors with Do Not Track or Global Privacy Control send nothing.
