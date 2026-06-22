#!/usr/bin/env bash
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

load_env

require_cmd bash awk sed grep date

# Customize these checks:
: "${APP_ENV:=development}"
: "${NODE_ENV:=${APP_ENV}}"

# Example required env vars (edit/remove):
# [[ -n "${DATABASE_URL:-}" ]] || die "DATABASE_URL is required (set in config/.env)"
# [[ -n "${REDIS_URL:-}" ]] || die "REDIS_URL is required (set in config/.env)"

log "Environment checks:"
log "- APP_ENV=$APP_ENV"
log "- NODE_ENV=$NODE_ENV"

if [[ -f "${ROOT_DIR}/package.json" ]]; then
  require_cmd node npm
  node --version || true
  npm --version || true
fi

if [[ -f "${ROOT_DIR}/pyproject.toml" ]] || [[ -f "${ROOT_DIR}/requirements.txt" ]]; then
  require_cmd python3
  python3 --version || true
fi

# docker-compose (optional)
if [[ -f "${ROOT_DIR}/docker-compose.yml" ]] || [[ -f "${ROOT_DIR}/compose.yaml" ]]; then
  if command -v docker >/dev/null 2>&1; then
    log "- docker: available"
  else
    warn "docker not found (compose scripts may fail)"
  fi
fi

log "OK"
