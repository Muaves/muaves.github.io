# Redstone Launcher Support Diagnostics

Cross-platform, read-only support collectors for the Electron/Node.js Redstone Launcher. The repository currently declares Electron 41, `electron-builder`, `sharp`, `minecraft-launcher-core`, `msmc`, and an optional relay client/server structure. These scripts collect system/runtime/package details, selected public connectivity checks, and limited local log snippets for support tickets.

## Safety / privacy
- No administrator/root privileges required.
- Does not modify launcher settings or delete files.
- Does not intentionally collect launcher accounts, worlds, mods, screenshots, or full environment variables.
- Common token/password/cookie patterns are redacted, but redaction is not perfect. **Review the ZIP before attaching it to a ticket.**
- It does not contact Microsoft login endpoints or any private relay endpoint.
- It downloads the diagnostic collector from this repository; users should inspect the script if they prefer not to pipe remote code into a shell.

## Quick commands

### Linux / macOS (curlable)
General report:
```bash
curl -fsSL https://raw.githubusercontent.com/TGGamesYT/redstone-launcher/main/scripts/diagnose.sh | bash
```
Specific issue:
```bash
curl -fsSL https://raw.githubusercontent.com/TGGamesYT/redstone-launcher/main/scripts/diagnose.sh | bash -s -- --case startup
curl -fsSL https://raw.githubusercontent.com/TGGamesYT/redstone-launcher/main/scripts/diagnose.sh | bash -s -- --case login
curl -fsSL https://raw.githubusercontent.com/TGGamesYT/redstone-launcher/main/scripts/diagnose.sh | bash -s -- --case minecraft
curl -fsSL https://raw.githubusercontent.com/TGGamesYT/redstone-launcher/main/scripts/diagnose.sh | bash -s -- --case network
curl -fsSL https://raw.githubusercontent.com/TGGamesYT/redstone-launcher/main/scripts/diagnose.sh | bash -s -- --case performance
curl -fsSL https://raw.githubusercontent.com/TGGamesYT/redstone-launcher/main/scripts/diagnose.sh | bash -s -- --case relay
```

### Windows PowerShell
General report:
```powershell
irm https://raw.githubusercontent.com/TGGamesYT/redstone-launcher/main/scripts/diagnose.ps1 | iex
```
Specific issue:
```powershell
$env:REDSTONE_DIAG_CASE='login'; irm https://raw.githubusercontent.com/TGGamesYT/redstone-launcher/main/scripts/diagnose.ps1 | iex
```
Supported cases: `all`, `startup`, `login`, `minecraft`, `network`, `performance`, `relay`.

## Ticket template
Ask the user to attach `RedstoneLauncher-Diagnostics-*.zip` and include:
1. Launcher version and installation method (AppImage, deb, Snap, Windows installer, macOS DMG, development build).
2. What they expected vs. what happened.
3. Exact steps to reproduce.
4. Whether the issue started after a launcher/OS update.
5. Screenshot or exact error text (only if it contains no private information).

## Developer notes
- `diagnose.py` uses only Python standard library.
- `diagnose.sh` is for Linux/macOS and downloads the Python collector to a temporary file.
- `diagnose.ps1` is for Windows PowerShell and downloads the Python collector to `%TEMP%`.
- Since these are curlable, commit the files under `scripts/` on the `main` branch before sending commands to users.
