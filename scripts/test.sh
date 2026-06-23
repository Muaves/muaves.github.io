#!/usr/bin/env bash
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"
load_env

MODE="${1:-all}"  # all | quick
MODE="${MODE:-all}"
log "Running tests (mode=$MODE)"

# Quick/changed support can be refined here as a basic example:
if [[ "${MODE}" == "quick" ]]; then
  # Customize: e.g. only unit tests
  :
fi

# Node example:
if [[ -f "${ROOT_DIR}/package.json" ]]; then
  if npm run | grep -qE '(^| )test'; then
    if [[ "${MODE}" == "quick" ]]; then
      if npm run | grep -qE '(^| )test:unit'; then
        run npm run test:unit
      else
        run npm test -- --watch=false || run npm test
      fi
    else
      run npm test
    fi
  else
    warn "No npm test script found"
  fi
fi

# Python example:
if [[ -f "${ROOT_DIR}/pyproject.toml" ]] || [[ -f "${ROOT_DIR}/requirements.txt" ]]; then
  if command -v pytest >/dev/null 2>&1; then
    if [[ "${MODE}" == "quick" ]]; then
      run pytest -q
    else
      run pytest
    fi
  fi
fi

# Go example:
if [[ -f "${ROOT_DIR}/go.mod" ]]; then
  require_cmd go
  if [[ "${MODE}" == "quick" ]]; then
    run go test ./... -run Test -count=1
  else
    run go test ./... -count=1
  fi
fi

log "Tests complete"
