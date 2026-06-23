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

log "Stopping dev services..."

if docker compose version >/dev/null 2>&1; then
  run docker compose $COMPOSE_FILE down
else
  run docker-compose $COMPOSE_FILE down
fi

log "Dev down complete"
