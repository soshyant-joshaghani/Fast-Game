#!/usr/bin/env bash
set -euo pipefail
cd "$(cd "$(dirname "$0")/.." && pwd)"
if [[ ! -f .env ]]; then
  cp -n .env.example .env 2>/dev/null || true
fi
docker network inspect traefik-public >/dev/null 2>&1 || docker network create traefik-public
docker compose up -d --build
echo
echo "fast-game production stack started."
echo "Update DOMAIN in compose.yml, ACME email in compose.traefik.yml, and DNS before going live."
echo "Game server: wss://game.\${DOMAIN:-example.com}  or  game.\${DOMAIN:-example.com}:2567"
