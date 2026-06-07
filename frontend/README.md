# Frontend

SvelteKit dashboard (Svelte 5, Tailwind 4, adapter-node).

## Layout

```
src/
├── lib/config/backend.ts     # API_BASE_URL (/api/v1)
├── lib/modules/global/       # shared shell
├── lib/modules/apps/         # per-app UI modules
└── routes/                   # thin route files
```

## Dev

From repo root:

```bat
npm run dev
```

Vite proxies `/api` → `API_PROXY_TARGET` (default `http://localhost:8000`).

In Docker dev, Traefik serves http://dashboard.localhost → Vite :5173.

## Production

Multi-stage `Dockerfile` builds with `npm run build -w frontend` and runs `node build` on port 5000.

Set `PUBLIC_API_BASE_URL` at build time (see `compose.yml`).
