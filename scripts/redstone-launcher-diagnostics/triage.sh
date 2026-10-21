```bash
#!/usr/bin/env bash
set -eu

BASE="https://raw.githubusercontent.com/Muaves/muaves.github.io/main/scripts/redstone-launcher-diagnostics"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT INT TERM

if command -v python3 >/dev/null 2>&1; then
    PY=python3
elif command -v python >/dev/null 2>&1; then
    PY=python
else
    echo "Python 3 is required."
    exit 1
fi

curl -fsSL "$BASE/triage.py" -o "$TMP/triage.py"
curl -fsSL "$BASE/diagnose.py" -o "$TMP/diagnose.py"

"$PY" "$TMP/triage.py"
```
