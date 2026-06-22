#!/usr/bin/env bash
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"
load_env

# Flags
FIX="${1:-}"
if [[ "${FIX:-}" == "--fix" ]]; then
  FIX=--fix
else
  FIX=""
fi

log "Running lint..."

# customize for your stack:
# Node example:
if [[ -f "${ROOT_DIR}/package.json" ]]; then
  if npm run | grep -qE '(^| )lint'; then
    if [[ -n "$FIX" ]]; then
      run npm run lint -- --fix || run npm run lint --fix
    else
      run npm run lint
    fi
  else
    warn "No npm lint script found; add `lint` to package.json or customize lint.sh"
  fi

  # Optional format:
  if npm run | grep -qE '(^| )format'; then
    run npm run format ${FIX:+--fix} || true
  fi
fi

# Python example:
if [[ -f "${ROOT_DIR}/pyproject.toml" ]] || [[ -f "${ROOT_DIR}/requirements.txt" ]]; then
  if command -v ruff >/dev/null 2>&1; then
    # ruff accepts --fix
    if [[ -n "$FIX" ]]; then
      run ruff check . --fix
    else
      run ruff check .
    fi
  elif command -v flake8 >/dev/null 2>&1; then
    run flake8 .
  fi
fi

log "Lint complete"
