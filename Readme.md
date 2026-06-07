# Fast-Game

Full-stack template: **SvelteKit** dashboard + **FastAPI** API + **Colyseus** game server + **Postgres** + **Traefik**, on one VM.

Fork or clone when starting a new game project. Includes a minimal Colyseus template room (`game_test_room`) with shared chat module.

## Stack

| Layer | Tech | Dev URL |
|-------|------|---------|
| Frontend | Svelte 5 + SvelteKit + Tailwind | http://dashboard.localhost |
| Backend | FastAPI + SQLModel + Alembic | http://api.localhost/docs · http://api.localhost/sdoc |
| Game server | Colyseus 0.17 (port **2567**) | ws://game.localhost · ws://localhost:2567 |
| Database | Postgres 18 | localhost:15432 |
| Proxy | Traefik 3.6 | http://localhost:8090 |

## Quick start (dev)

Starts Postgres + Traefik in Docker, then **uvicorn**, **Vite**, and **Colyseus** on the host (hot reload):

```bat
__init__\start-fast-game-dev.bat
```

```bash
chmod +x __init__/start-fast-game-dev.sh __init__/setup-local.sh
__init__/start-fast-game-dev.sh
```

| Service | URL |
|---------|-----|
| Dashboard | http://dashboard.localhost |
| API | http://api.localhost/docs |
| Game (Traefik) | ws://game.localhost |
| Game (direct) | ws://localhost:2567 |
| Monitor | http://game.localhost/monitor |
| Playground | http://game.localhost/playground |
| Colyseus demo | http://dashboard.localhost/demo/colyseus |

Stop app processes by closing their terminal windows. Stop infrastructure:

```bat
docker compose -f compose.dev.yml down
```

## Production (single VM)

```bash
bash __init__/setup-ubuntu.sh
bash __init__/start-fast-game-prod.sh
```

DNS (point at VM IP):

| Host | Serves |
|------|--------|
| `@` | `https://example.com` (frontend) |
| `api` | `https://api.example.com` (backend) |
| `game` | `wss://game.example.com` or `game.example.com:2567` |
| `adminer` | optional DB UI |

Edit `DOMAIN` in `compose.yml` and ACME email in `compose.traefik.yml`.

## Project layout

```
fast-game/
├── backend/          FastAPI
├── frontend/         SvelteKit
├── game/             Colyseus server template (game-test sample room)
├── compose.dev.yml   Dev infra only
├── compose.yml       Prod stack (backend + frontend + game + db)
└── __init__/         setup + start scripts
```

## Game server

- Sample room: **`game_test_room`** under `game/src/games/game-test/`
- Shared module: **`modules/communication/`** (chat)
- **No Redis** — single in-memory Colyseus node
- Backend exposes `GET /api/v1/utils/game-server/` → `{ "url": "ws://game.localhost" }`

Manual game server only:

```bash
npm run start -w game
```

## Local tooling

```bat
__init__\setup-local.bat
```

- Python: `.venv` + `pip install -r requirements.txt`
- Node: npm workspaces (`frontend`, `game`)

## Tests

```bat
__init__\tests\test-all.bat
npm run test
pytest tests/backend
```
