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
| Adminer | Adminer (via Traefik) | http://adminer.localhost |

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
| Adminer | http://adminer.localhost |

Stop app processes by closing their terminal windows. Stop infrastructure:

```bat
docker compose -f compose.dev.yml down
```

### Adminer and database connections

Adminer runs **inside Docker**. Host tools (IDE, local pytest, pgAdmin on Windows) and Adminer use **different** host/port values — both are correct for their context.

| Context | Server | Port | Credentials |
|---------|--------|------|-------------|
| **Adminer** (browser → Docker) | `db` | `5432` (internal) | `POSTGRES_USER` / `POSTGRES_PASSWORD` from `.env` |
| **Host / IDE** (Windows, local scripts) | `localhost` | `15432` (published) | same `.env` values |

**Do not use `localhost:15432` in Adminer** — inside the Adminer container, `localhost` is the Adminer container itself, not Postgres. You will get `Connection refused`.

#### Adminer login (dev)

Open `http://adminer.localhost`. System: **PostgreSQL**.

```
System:   PostgreSQL
Server:   db
Username: postgres          # POSTGRES_USER from .env
Password: <POSTGRES_PASSWORD from .env>
Database: app               # POSTGRES_DB from .env
```

Default values are in `.env.example` (`POSTGRES_DB=app`, `POSTGRES_USER=postgres`).

#### Adminer login (production)

Open `https://adminer.<your-domain>` (see DNS table below). Use the same **Server** (`db`), **Username**, **Password**, and **Database** as in `.env` — not `localhost`.

#### Troubleshooting

- **`Connection refused` on `localhost:15432` in Adminer** — use server `db` and port `5432`.
- **`password authentication failed`** — network is fine; retype the password manually (watch for keyboard layout on `@`). Uncheck “Permanent login” or use a private window if the browser cached old credentials.
- **Password changed in `.env` but login still fails** — Postgres sets the password only when the volume is first created. Either reset it:

  ```bash
  docker compose -f compose.dev.yml exec db psql -U postgres -d app -c "ALTER USER postgres PASSWORD 'your-new-password';"
  ```

  or wipe dev volumes and recreate: `docker compose -f compose.dev.yml down -v` then start again.

## Production (single VM)

```bash
bash __init__/setup-ubuntu.sh
bash __init__/start-fast-game-prod.sh
```

### Stop / reset (production)

| Script | What it does |
|--------|----------------|
| `__init__/stop-fast-game-prod.sh` | Stops all prod containers. Keeps DB, Redis, and SSL. |
| `__init__/reset-fast-game-prod.sh` | Wipes **db-data** + **redis-data** + app `:prod` images; keeps SSL. |
| `__init__/backup-acme.sh` | SSL → `../.foxg-ssl-backups/fast-game/acme.json` |
| `__init__/restore-acme.sh` | Restore from parent backup |
| `__init__/prune-docker-build.sh` | Backup SSL, then `docker builder prune -af` |

Windows: `.bat` variants. Start script auto-restores SSL from parent backup if local file is empty.

Recover from legacy named volume: `bash __init__/migrate-letsencrypt-from-volume.sh`

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
├── letsencrypt/      Prod ACME certs (acme.json — gitignored)
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
