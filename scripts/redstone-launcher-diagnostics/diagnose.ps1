# Redstone Launcher diagnostics for Windows PowerShell 5.1+ / PowerShell 7+
# Usage: irm https://raw.githubusercontent.com/Muaves/muaves.github.io/main/scripts/redstone-launcher-diagnostics/diagnose.ps1 | iex
# Optional case: $env:REDSTONE_DIAG_CASE='startup'; irm .../diagnose.ps1 | iex
$ErrorActionPreference = "Stop"
$scriptUrl = "https://raw.githubusercontent.com/Muaves/muaves.github.io/main/scripts/redstone-launcher-diagnostics/diagnose.py"
$tempScript = Join-Path $env:TEMP ("redstone-diagnose-" + [guid]::NewGuid().ToString("N") + ".py")
try {
    Invoke-WebRequest -Uri $scriptUrl -OutFile $tempScript -UseBasicParsing
    $python = Get-Command py -ErrorAction SilentlyContinue
    if ($python) {
        $pythonArgs = @("-3", $tempScript)
    } else {
        $python = Get-Command python -ErrorAction SilentlyContinue
        if (-not $python) { throw "Python 3 was not found. Install Python 3 and run again." }
        $pythonArgs = @($tempScript)
    }
    $case = $env:REDSTONE_DIAG_CASE
    if ([string]::IsNullOrWhiteSpace($case)) { $case = "all" }
    & $python.Source @pythonArgs --case $case
    if ($LASTEXITCODE -ne 0) { throw "Diagnostics exited with code $LASTEXITCODE" }
} finally {
    Remove-Item $tempScript -Force -ErrorAction SilentlyContinue
}
