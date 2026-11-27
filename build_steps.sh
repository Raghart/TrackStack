#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd -- "$(dirname -- "$0")" && pwd)"
cd "$ROOT_DIR"

if ! command -v node >/dev/null 2>&1; then
  echo "Error: Node.js is not installed." >&2
  exit 1
fi

PNPM_VERSION="$(node -p "require('./package.json').packageManager?.replace(/^pnpm@/, '') ?? ''")"

if ! command -v pnpm >/dev/null 2>&1; then
  if command -v corepack >/dev/null 2>&1; then
    echo "==> Enabling pnpm${PNPM_VERSION:+ $PNPM_VERSION} through corepack"
    corepack enable
    if [ -n "$PNPM_VERSION" ]; then
      corepack prepare "pnpm@$PNPM_VERSION" --activate
    fi
  else
    echo "==> Installing pnpm${PNPM_VERSION:+ $PNPM_VERSION} with npm"
    npm install --global "pnpm@${PNPM_VERSION:-latest}"
  fi
fi

echo "==> Node $(node --version) / pnpm $(pnpm --version)"

echo "==> Installing workspace dependencies"
pnpm install --frozen-lockfile

echo "==> Building frontend (output: backend/public)"
pnpm run build:frontend

echo "==> Building backend (output: backend/dist)"
pnpm run build:backend

echo "==> Build complete"
