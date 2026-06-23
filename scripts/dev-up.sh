#!/usr/bin/env bash
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"
load_env

COMPOSE_FILE=""
if [[ -f "${ROOT_DIR}/docker-compose.yml" ]]; then
  COMPOSE_FILE="-f ${ROOT_DIR}/docker-compose.yml"
elif [[ -f "${ROOT_DIR}/compose.yaml" ]]; then
  COMPOSE_FILE="-f ${ROOT_DIR}/compose.yaml"
fi

SERVICES="${1:-}" # optional
DETACH="1"

require_cmd bash

if ! command -v docker >/dev/null 2>&1; then
  die "docker not found"
fi

if ! command -v docker-compose >/dev/null 2>&1 && ! docker compose version >/dev/null 2>&1; then
  die "docker compose not available (docker-compose or docker compose)"
fi

log "Starting dev services..."

# Prefer `docker compose` if available
if docker compose version >/dev/null 2>&1; then
  if [[ -n "$SERVICES" ]]; then
    run docker compose $COMPOSE_FILE up -d "$SERVICES"
  else
    run docker compose $COMPOSE_FILE up -d
  fi
else
  if [[ -n "$SERVICES" ]]; then
    run docker-compose $COMPOSE_FILE up -d "$SERVICES"
  else
    run docker-compose $COMPOSE_FILE up -d
  fi
fi

# Optional readiness wait: customize or remove
log "Dev up complete (optionally wait for readiness in your stack)."
