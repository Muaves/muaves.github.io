# Redstone Launcher Support Diagnostics

## Start here

**Linux / macOS**
```bash
curl -fsSL https://raw.githubusercontent.com/Muaves/muaves.github.io/main/scripts/redstone-launcher-diagnostics/triage.sh | bash
```

**Windows PowerShell**
```powershell
irm https://raw.githubusercontent.com/Muaves/muaves.github.io/main/scripts/redstone-launcher-diagnostics/triage.ps1 | iex
```

The triage tool runs a general diagnostic, asks what problem you are experiencing, and recommends a focused diagnostic.

### Available diagnostics
- `startup` — launcher startup or crashes
- `login` — account and authentication
- `minecraft` — Java and game launch
- `network` — downloads and connectivity
- `performance` — FPS and system performance
- `relay` — relay connectivity
- `all` — general diagnostic report

### Privacy
Review diagnostic ZIP files before attaching them to tickets. Reports may contain system details and log snippets. Never share passwords, authentication tokens, or session cookies.
