#!/usr/bin/env bash
# Redstone Launcher performance diagnostic shortcut.
# Usage: curl -fsSL https://raw.githubusercontent.com/TGGamesYT/redstone-launcher/main/scripts/diagnose-performance.sh | bash
set -eu
BASE="https://raw.githubusercontent.com/TGGamesYT/redstone-launcher/main/scripts/diagnose.py"
TMP="$(mktemp "${TMPDIR:-/tmp}/redstone-diagnose.XXXXXX.py")"
trap 'rm -f "$TMP"' EXIT INT TERM
curl -fsSL "$BASE" -o "$TMP"
if command -v python3 >/dev/null 2>&1; then PY=python3
elif command -v python >/dev/null 2>&1; then PY=python
else echo "ERROR: Python 3 is required." >&2; exit 2
fi
exec "$PY" "$TMP" --case performance
