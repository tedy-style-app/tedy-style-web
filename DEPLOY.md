# Deploy — sevil.app

The site is a **single-page app** (Vite). Routes like `/admin` and `/s/<id>`
are handled in the browser (`src/main.tsx`), so the host MUST serve
`index.html` for any unknown path (SPA fallback). Without it those URLs 404.

## Build

```bash
npm ci
npm run build      # → dist/
```
Deploy the contents of `dist/` as the site root.

## SPA fallback per host

- **Netlify / Cloudflare Pages** — `dist/_redirects` (already generated from
  `public/_redirects`) does it: `/*  /index.html  200`.
- **Vercel** — `vercel.json` (repo root) rewrites non-asset paths to
  `/index.html`.
- **nginx** (e.g. same box as `sevil.app`):

  ```nginx
  server {
    server_name sevil.app;
    root /var/www/sevil.app/dist;   # the built dist/
    index index.html;

    # iOS/Android deep-link association files — serve as-is, JSON type.
    location = /.well-known/apple-app-site-association {
      default_type application/json;
    }
    location /.well-known/assetlinks.json {
      default_type application/json;
    }

    # SPA fallback — everything else falls through to index.html.
    location / {
      try_files $uri $uri/ /index.html;
    }
  }
  ```

## After deploy — verify

- `https://sevil.app/`            → marketing site
- `https://sevil.app/admin`       → admin login (creds in backend appsettings `Admin`)
- `https://sevil.app/s/<listingId>` → shared Secondhand item
- `https://sevil.app/.well-known/apple-app-site-association` → JSON (for universal links)

## Notes

<<<<<<< HEAD
- The admin panel calls `https://sevil.app/api/admin/*`; make sure that
  backend is deployed and CORS allows `https://sevil.app`.
=======
- The admin panel calls `https://sevil.app/api/admin/*` (same origin); make sure
  the backend is deployed and CORS allows `https://sevil.app`.
>>>>>>> ffb6f40760d5ee3a7a8b5dba42bc1073d4b6defa
- Replace `TEAMID` in `public/.well-known/apple-app-site-association` with the
  real Apple Team ID before relying on https universal links.
