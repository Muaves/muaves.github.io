#!/usr/bin/env bash
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"
load_env

log "Building..."

# Node example:
if [[ -f "${ROOT_DIR}/package.json" ]]; then
  require_cmd node npm
  if npm run | grep -qE '(^| )build'; then
    run npm run build
  else
    warn "No npm build script found; customize build.sh"
  fi
fi

# Go example:
if [[ -f "${ROOT_DIR}/go.mod" ]]; then
  require_cmd go
  OUT="${ROOT_DIR}/dist/app"
  run go build -o "$OUT" ./...
  log "Built to $OUT"
fi

# Python typically no build unless you package; you can add wheel build:
if [[ -f "${ROOT_DIR}/pyproject.toml" ]]; then
  if command -v python3 >/dev/null 2>&1; then
    require_cmd python3
    if [[ -n "${BUILD_WHEEL:-}" ]]; then
      require_cmd pip
      run python3 -m pip install -U build
      run python3 -m build
    fi
  fi
fi

log "Build complete"
