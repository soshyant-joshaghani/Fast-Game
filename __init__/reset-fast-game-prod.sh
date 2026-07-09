#!/usr/bin/env bash
# Wipe app build images + Postgres/Redis data volumes; keep Traefik base image and SSL on disk.
set -euo pipefail
cd "$(cd "$(dirname "$0")/.." && pwd)"

source "$(dirname "$0")/lib/ensure-letsencrypt.sh"

if [[ -f letsencrypt/acme.json ]] && [[ -s letsencrypt/acme.json ]]; then
  backup="letsencrypt/acme.json.bak.$(date +%Y%m%d-%H%M%S)"
  cp -a letsencrypt/acme.json "$backup"
  echo "Backed up SSL state to $backup"
fi

echo "Stopping production stack..."
docker compose down --remove-orphans

echo "Removing Postgres and Redis data volumes..."
for vol in fast-game_db-data fast-game_redis-data; do
  if docker volume inspect "$vol" >/dev/null 2>&1; then
    docker volume rm "$vol"
    echo "  removed $vol"
  fi
done

echo "Removing application images (will rebuild on next start)..."
for img in fast-game-backend:prod fast-game-frontend:prod fast-game-colyseus:prod; do
  if docker image inspect "$img" >/dev/null 2>&1; then
    docker rmi "$img"
    echo "  removed $img"
  fi
done

docker image prune -f >/dev/null || true

echo
echo "Reset complete."
echo "  Kept: traefik:3.6, postgres:18, redis:8-alpine, adminer images"
echo "  Kept: ./letsencrypt/acme.json"
echo "  Wiped: db-data, redis-data, app :prod images"
echo
echo "Start fresh: bash __init__/start-fast-game-prod.sh"
