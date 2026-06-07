#!/usr/bin/env bash
set -euo pipefail
cd "$(cd "$(dirname "$0")/.." && pwd)"

if [[ ! -d .venv ]]; then
  echo "Creating Python venv at .venv ..."
  python3 -m venv .venv
fi
# shellcheck disable=SC1091
source .venv/bin/activate
python -m pip install -U pip
pip install -r requirements.txt

if [[ ! -d node_modules ]]; then
  echo "Installing npm dependencies at root ..."
  npm install
fi
mkdir -p frontend/node_modules
if [[ ! -e frontend/node_modules/@sveltejs ]]; then
  ln -sf ../../node_modules/@sveltejs frontend/node_modules/@sveltejs
fi
if [[ ! -e frontend/node_modules/svelte ]]; then
  ln -sf ../../node_modules/svelte frontend/node_modules/svelte
fi
npm run prepare -w frontend 2>/dev/null || true
echo "Local environment ready."
