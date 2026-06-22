#!/usr/bin/env bash
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"
load_env

VERSION="${1:-}"
if [[ -z "$VERSION" ]]; then
  die "Usage: release.sh <version> (e.g., 1.2.3)"
fi

log "Releasing version=$VERSION"

require_cmd git

# Basic safety, ensure clean working tree
if [[ -n "$(git status --porcelain)" ]]; then
  die "Working tree not clean. Commit/stash changes before releasing."
fi

# Tagging example:
TAG="v${VERSION}"
if git rev-parse "$TAG" >/dev/null 2>&1; then
  die "Tag already exists: $TAG"
fi

log "Creating tag $TAG"
run git tag "$TAG"

# Optional: push tags
if [[ "${PUSH_TAGS:-0}" == "1" ]]; then
  run git push --tags
fi

# Build + optional smoke tests
run "${ROOT_DIR}/scripts/build.sh"

log "Release steps complete"
