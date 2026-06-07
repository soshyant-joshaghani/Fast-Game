#!/usr/bin/env bash
set -euo pipefail
cd "$(cd "$(dirname "$0")/.." && pwd)"

if [[ ! -f .env ]]; then
  cp -n .env.example .env 2>/dev/null || true
fi

bash __init__/setup-local.sh

echo "[fast-game] Starting dev infrastructure (db, proxy, adminer)..."
docker compose -f compose.dev.yml up -d db proxy adminer

echo "[fast-game] Waiting for Postgres..."
until docker compose -f compose.dev.yml exec -T db pg_isready -U "${POSTGRES_USER:-postgres}" >/dev/null 2>&1; do
  sleep 2
done

echo "[fast-game] Running migrations + seed (local prestart)..."
(
  cd backend
  # shellcheck disable=SC1091
  source ../.venv/bin/activate
  export PYTHONPATH="$PWD"
  python app/backend_pre_start.py
  alembic -c alembic.ini upgrade head
  python app/initial_data.py
)

export API_PROXY_TARGET="${API_PROXY_TARGET:-http://localhost:8000}"
export PORT=2567
ROOT="$(pwd)"

echo "[fast-game] Starting backend, frontend, and Colyseus game server..."
(
  cd backend
  # shellcheck disable=SC1091
  source ../.venv/bin/activate
  export PYTHONPATH="$PWD"
  exec uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
) &
BACKEND_PID=$!

(
  cd "$ROOT"
  exec npm run dev -w frontend -- --host --port 5173 --open
) &
FRONTEND_PID=$!

(
  cd "$ROOT"
  export PORT=2567
  exec npm run start -w game
) &
GAME_PID=$!

cleanup() {
  kill "$BACKEND_PID" "$FRONTEND_PID" "$GAME_PID" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

echo
echo "Dev stack ready (hot reload on save):"
echo "  Dashboard:   http://dashboard.localhost"
echo "  API docs:    http://api.localhost/docs"
echo "  Game server: ws://game.localhost  (or ws://localhost:2567)"
echo "  Monitor:     http://game.localhost/monitor"
echo "  Demo:        http://dashboard.localhost/demo/colyseus"
echo "  Adminer:     http://adminer.localhost"
echo "  Traefik:     http://localhost:8090"
echo
echo "Press Ctrl+C to stop backend, frontend, and game server."

wait
