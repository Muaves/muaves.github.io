#!/usr/bin/env bash
# Curlable Redstone Launcher diagnostics for Linux/macOS.
# Usage: curl -fsSL https://raw.githubusercontent.com/Muaves/muaves.github.io/main/scripts/redstone-launcher-diagnostics/diagnose.sh | bash -s -- --case startup
set -eu
BASE="https://raw.githubusercontent.com/Muaves/muaves.github.io/main/scripts/redstone-launcher-diagnostics//diagnose.py"
TMP="$(mktemp "${TMPDIR:-/tmp}/redstone-diagnose.XXXXXX.py")"
cleanup() { rm -f "$TMP"; }
trap cleanup EXIT INT TERM
if ! command -v curl >/dev/null 2>&1; then echo "ERROR: curl is required." >&2; exit 2; fi
if ! curl -fsSL "$BASE" -o "$TMP"; then echo "ERROR: Could not download the diagnostic collector." >&2; exit 2; fi
if command -v python3 >/dev/null 2>&1; then PY=python3
elif command -v python >/dev/null 2>&1; then PY=python
else echo "ERROR: Python 3 is required. Install Python 3 and retry." >&2; exit 2
fi
"$PY" "$TMP" "$@"
