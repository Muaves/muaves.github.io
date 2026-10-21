```powershell
$ErrorActionPreference = "Stop"

$base = "https://raw.githubusercontent.com/Muaves/muaves.github.io/main/scripts/redstone-launcher-diagnostics"
$temp = Join-Path $env:TEMP ("redstone-triage-" + [guid]::NewGuid().ToString("N"))

New-Item -ItemType Directory -Path $temp | Out-Null

try {
    Invoke-WebRequest "$base/triage.py" -OutFile "$temp/triage.py"
    Invoke-WebRequest "$base/diagnose.py" -OutFile "$temp/diagnose.py"

    $python = Get-Command py -ErrorAction SilentlyContinue

    if ($python) {
        & $python.Source -3 "$temp/triage.py"
    } else {
        $python = Get-Command python -ErrorAction SilentlyContinue
        if (-not $python) {
            throw "Python 3 is required."
        }
        & $python.Source "$temp/triage.py"
    }
} finally {
    Remove-Item $temp -Recurse -Force -ErrorAction SilentlyContinue
}
```
