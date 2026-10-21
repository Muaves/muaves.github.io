#!/usr/bin/env python3
"""
Redstone Launcher Support Diagnostics
Read-only collector. Creates a redacted ZIP report in the current user's home directory.
"""
import os, sys, platform, subprocess, shutil, glob, json, time, re, socket, urllib.request, tempfile, zipfile
from pathlib import Path
from datetime import datetime

REPO = "https://github.com/TGGamesYT/redstone-launcher"
VERSION = "1.0.0"
CASE_CHOICES = {"all", "startup", "login", "minecraft", "network", "performance", "relay"}
args = sys.argv[1:]
case = "all"
for i, a in enumerate(args):
    if a == "--case" and i + 1 < len(args):
        case = args[i + 1].lower()
if case not in CASE_CHOICES:
    print("Usage: diagnose.py [--case all|startup|login|minecraft|network|performance|relay]")
    sys.exit(2)

HOME = Path.home()
STAMP = datetime.now().strftime("%Y%m%d-%H%M%S")
OUT = HOME / f"RedstoneLauncher-Diagnostics-{STAMP}.zip"
report = []
files = {}

def add(title, value=""):
    report.append(f"\n## {title}\n{value}")

def run(cmd, timeout=8):
    try:
        p = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout, errors="replace")
        return (p.stdout + ("\n" + p.stderr if p.stderr else "")).strip() or f"(exit code {p.returncode}; no output)"
    except Exception as e:
        return f"(unavailable: {type(e).__name__}: {e})"

def redact(s):
    s = str(s)
    # Remove common secrets, auth tokens, cookies and query-string credentials.
    patterns = [
        (r'(?i)(access[_ -]?token|refresh[_ -]?token|id[_ -]?token|client[_ -]?secret|password|passwd|authorization|cookie|x-ms-token|minecraftservices.*?token)(\s*["\']?\s*[:=]\s*["\']?)[^"\',\s}]+', r'\1\2[REDACTED]'),
        (r'(?i)(Bearer\s+)[A-Za-z0-9._~+/=-]+', r'\1[REDACTED]'),
        (r'(?i)([?&](?:code|token|access_token|refresh_token|client_secret|password)=)[^&\s]+', r'\1[REDACTED]'),
        (r'(?i)(email\s*[:=]\s*)[^\s,;]+@[^\s,;]+', r'\1[REDACTED_EMAIL]'),
    ]
    for pat, repl in patterns:
        s = re.sub(pat, repl, s)
    # Replace home directory with a generic marker.
    try:
        s = s.replace(str(HOME), "~")
    except Exception:
        pass
    return s

def collect_file(path, max_bytes=180_000, tail_lines=500):
    try:
        p = Path(path)
        if not p.is_file():
            return
        data = p.read_bytes()
        if len(data) > max_bytes:
            data = b"\n[TRUNCATED: only last section retained]\n" + b"\n".join(data[-max_bytes:].splitlines()[-tail_lines:])
        text = data.decode("utf-8", "replace")
        files[p.name + ".txt"] = redact(text)
    except Exception:
        pass

def app_paths():
    system = platform.system()
    paths = []
    if system == "Windows":
        for env in ("APPDATA", "LOCALAPPDATA"):
            if os.environ.get(env):
                paths += [Path(os.environ[env]) / "redstone-launcher", Path(os.environ[env]) / "Redstone Launcher"]
        paths += [HOME / "AppData/Roaming/redstone-launcher", HOME / "AppData/Roaming/Redstone Launcher"]
    elif system == "Darwin":
        paths += [HOME / "Library/Application Support/redstone-launcher", HOME / "Library/Application Support/Redstone Launcher"]
        paths += [HOME / "Library/Logs/redstone-launcher", HOME / "Library/Logs/Redstone Launcher"]
    else:
        xdg = Path(os.environ.get("XDG_CONFIG_HOME", HOME / ".config"))
        data = Path(os.environ.get("XDG_DATA_HOME", HOME / ".local/share"))
        cache = Path(os.environ.get("XDG_CACHE_HOME", HOME / ".cache"))
        paths += [xdg / "redstone-launcher", xdg / "Redstone Launcher",
                  data / "redstone-launcher", data / "Redstone Launcher",
                  cache / "redstone-launcher", HOME / ".config/redstone-launcher"]
        if os.environ.get("SNAP_USER_DATA"):
            paths.append(Path(os.environ["SNAP_USER_DATA"]))
    return list(dict.fromkeys(paths))

def find_log_candidates(paths):
    found = []
    for root in paths:
        if not root.exists():
            continue
        try:
            for p in root.rglob("*"):
                if p.is_file() and (p.suffix.lower() in {".log", ".txt", ".err", ".out"} or "log" in p.name.lower()):
                    try:
                        if p.stat().st_size <= 2_000_000:
                            found.append(p)
                    except Exception:
                        pass
                if len(found) >= 12:
                    return found
        except Exception:
            pass
    return found

add("Report", f"Redstone Launcher diagnostic version: {VERSION}\nCase: {case}\nCreated: {datetime.now().isoformat(timespec='seconds')}\nRepository: {REPO}\nThis report is read-only; no settings or files were changed.")
add("System", "\n".join([
    f"OS: {platform.platform()}",
    f"OS family: {platform.system()}",
    f"OS release: {platform.release()}",
    f"Architecture: {platform.machine()}",
    f"Python: {platform.python_version()}",
    f"Hostname: {socket.gethostname()}",
    f"Desktop/session: {os.environ.get('XDG_CURRENT_DESKTOP', '')} / {os.environ.get('XDG_SESSION_TYPE', '')}",
    f"Wayland display present: {'yes' if os.environ.get('WAYLAND_DISPLAY') else 'no'}",
    f"Display present: {'yes' if os.environ.get('DISPLAY') else 'no'}",
    f"Snap: {'yes' if os.environ.get('SNAP') else 'no'}",
    f"Flatpak: {'yes' if os.path.exists('/.flatpak-info') else 'no'}",
]))

if platform.system() == "Windows":
    commands = [
        ("Windows details", ["cmd", "/c", "ver"]),
        ("PowerShell", ["powershell", "-NoProfile", "-Command", "$PSVersionTable.PSVersion.ToString()"]),
        ("Node", ["cmd", "/c", "node --version"]),
        ("npm", ["cmd", "/c", "npm --version"]),
        ("Installed launcher packages", ["powershell", "-NoProfile", "-Command", "Get-AppxPackage *redstone* | Select-Object Name,Version | Format-List"]),
        ("Launcher processes", ["powershell", "-NoProfile", "-Command", "Get-CimInstance Win32_Process | Where-Object {$_.Name -match 'redstone|electron'} | Select-Object Name,ProcessId,ExecutablePath | Format-List"]),
    ]
elif platform.system() == "Darwin":
    commands = [
        ("macOS version", ["sw_vers"]),
        ("Node", ["node", "--version"]),
        ("npm", ["npm", "--version"]),
        ("Homebrew launcher packages", ["brew", "list", "--versions", "redstone-launcher"]),
        ("Launcher processes", ["sh", "-c", "ps -axo pid,comm,args | grep -Ei '[r]edstone|[e]lectron'"]),
    ]
else:
    commands = [
        ("OS release", ["sh", "-c", "cat /etc/os-release 2>/dev/null || uname -a"]),
        ("Kernel", ["uname", "-a"]),
        ("Node", ["node", "--version"]),
        ("npm", ["npm", "--version"]),
        ("Package: dpkg", ["sh", "-c", "dpkg-query -W -f='${Package} ${Version}\\n' redstone-launcher 2>/dev/null"]),
        ("Package: rpm", ["sh", "-c", "rpm -q redstone-launcher 2>/dev/null"]),
        ("Snap", ["sh", "-c", "snap list redstone-launcher 2>/dev/null"]),
        ("Flatpak", ["sh", "-c", "flatpak info io.github.TGGamesYT.redstone-launcher 2>/dev/null"]),
        ("Launcher processes", ["sh", "-c", "ps -eo pid,comm,args | grep -Ei '[r]edstone|[e]lectron'"]),
        ("GPU / display", ["sh", "-c", "command -v lspci >/dev/null && lspci | grep -Ei 'vga|3d|display' || true; echo WAYLAND_DISPLAY=$WAYLAND_DISPLAY; echo DISPLAY=$DISPLAY"]),
    ]
for title, cmd in commands:
    add(title, run(cmd))

# Safe endpoint reachability checks: no account/login endpoint or private relay endpoint is contacted.
if case in {"all", "network", "login", "relay"}:
    add("Public endpoint connectivity", "")
    for url in ["https://github.com", "https://redstone-launcher.com", "https://api.github.com"]:
        try:
            req = urllib.request.Request(url, method="HEAD", headers={"User-Agent": "RedstoneLauncher-Diagnostics"})
            with urllib.request.urlopen(req, timeout=6) as response:
                report.append(f"{url}: HTTP {response.status}")
        except Exception as e:
            report.append(f"{url}: FAILED ({type(e).__name__}: {e})")

if case in {"all", "startup", "login", "minecraft", "performance", "relay"}:
    paths = app_paths()
    add("Likely application data/log paths", "\n".join(f"{p}: {'exists' if p.exists() else 'not found'}" for p in paths))
    candidates = find_log_candidates(paths)
    for p in candidates:
        collect_file(p)
    add("Collected logs", f"Collected {len(candidates)} candidate log file(s), where accessible. Logs are size-limited and common token/password patterns are redacted. Review the ZIP before attaching it to a ticket.")

if case in {"all", "startup", "minecraft", "performance"}:
    add("Graphics / Java / Minecraft tools", "")
    if platform.system() == "Windows":
        extra = [
            ("Java", ["cmd", "/c", "java -version"]),
            ("GPU", ["powershell", "-NoProfile", "-Command", "Get-CimInstance Win32_VideoController | Select-Object Name,DriverVersion | Format-Table -AutoSize"]),
        ]
    elif platform.system() == "Darwin":
        extra = [("Java", ["sh", "-c", "java -version 2>&1"]), ("GPU", ["system_profiler", "SPDisplaysDataType"])]
    else:
        extra = [("Java", ["sh", "-c", "java -version 2>&1"]), ("OpenGL", ["sh", "-c", "command -v glxinfo >/dev/null && glxinfo -B 2>/dev/null || echo glxinfo-not-installed"])]
    for title, cmd in extra:
        add(title, run(cmd))

# Include process environment only as selected non-sensitive diagnostics, not the full environment.
selected = ["PATH", "SHELL", "LANG", "LC_ALL", "XDG_SESSION_TYPE", "XDG_CURRENT_DESKTOP", "SNAP", "FLATPAK_ID", "JAVA_HOME"]
add("Selected environment", "\n".join(f"{k}={redact(os.environ.get(k, ''))}" for k in selected if os.environ.get(k)))

files["diagnostic-report.txt"] = redact("\n".join(report))
try:
    with zipfile.ZipFile(OUT, "w", zipfile.ZIP_DEFLATED) as z:
        for name, content in files.items():
            z.writestr(name, content)
    print("Redstone Launcher diagnostics completed.")
    print(f"Report: {OUT}")
    print("Please review the ZIP before attaching it to a ticket. It may contain system usernames, installed software, and log snippets.")
except Exception as e:
    print(f"Could not write report: {e}", file=sys.stderr)
    sys.exit(1)
