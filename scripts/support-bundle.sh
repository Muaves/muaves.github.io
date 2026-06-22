#!/usr/bin/env bash
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"
load_env

OUT_DIR="${ROOT_DIR}/support-bundles"
mkdir -p "$OUT_DIR"
TS="$(date +%Y%m%d-%H%M%S)"
BUNDLE="${OUT_DIR}/bundle-${TS}.tar.gz"

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

log "Collecting support bundle..."

# Non-sensitive system + repo info
{
  echo "timestamp=$(date -Is)"
  echo "user=$(id -un)"
  echo "host=$(hostname)"
  echo "cwd=$(pwd)"
} > "$TMP/metadata.txt"

# Git info
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  git log -1 --oneline > "$TMP/git-last-commit.txt" || true
  git status --porcelain > "$TMP/git-status.txt" || true
fi

# Logs (if your app writes logs)
if [[ -d "${ROOT_DIR}/logs" ]]; then
  cp -R "${ROOT_DIR}/logs" "$TMP/logs" 2>/dev/null || true
fi

# Docker logs (optional redact as needed)
if command -v docker >/dev/null 2>&1; then
  if docker compose version >/dev/null 2>&1; then
    # Change service names if needed; generic dump:
    docker compose logs --no-color --tail=200 > "$TMP/docker-compose-logs.txt" 2>/dev/null || true
  fi
fi

# Create archive
tar -C "$TMP" -czf "$BUNDLE" .
log "Bundle created: $BUNDLE"
