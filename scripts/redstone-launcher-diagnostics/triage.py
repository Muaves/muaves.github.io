``python
#!/usr/bin/env python3
import os
import sys
import platform
import subprocess
from pathlib import Path

BASE_URL = "https://raw.githubusercontent.com/Muaves/muaves.github.io/main/scripts/redstone-launcher-diagnostics/"
COLLECTOR = Path(__file__).resolve().parent / "diagnose.py"

CASES = {
    "1": ("startup", "Launcher crashes, will not open, or shows a blank window"),
    "2": ("login", "Microsoft login or account problems"),
    "3": ("minecraft", "Minecraft launch, Java, crash, or graphics problems"),
    "4": ("network", "Downloads, API connections, or timeouts"),
    "5": ("performance", "Low FPS, stuttering, or high CPU/RAM usage"),
    "6": ("relay", "Relay server or relay connection problems"),
    "7": ("all", "Not sure / general diagnostics only"),
}

def download_collector():
    if COLLECTOR.is_file():
        return True

    import urllib.request
    try:
        urllib.request.urlretrieve(BASE_URL + "diagnose.py", COLLECTOR)
        return True
    except Exception as exc:
        print(f"Could not download diagnose.py: {exc}")
        return False

def run_case(case):
    if not download_collector():
        return

    try:
        subprocess.run(
            [sys.executable, str(COLLECTOR), "--case", case],
            check=False
        )
    except KeyboardInterrupt:
        print("\nCancelled.")

def main():
    print("=" * 55)
    print(" REDSTONE LAUNCHER — SUPPORT DIAGNOSTICS")
    print("=" * 55)
    print(f"OS: {platform.system()} {platform.release()}")
    print(f"Architecture: {platform.machine()}")
    print("\nStep 1: Running the general diagnostic...")
    run_case("all")

    print("\nStep 2: What problem are you experiencing?")
    for key, (_, description) in CASES.items():
        print(f"{key}. {description}")

    choice = input("\nChoose 1-7: ").strip()
    if choice not in CASES:
        print("Invalid selection. The general report may still be available.")
        return

    case, description = CASES[choice]
    print(f"\nRecommended diagnostic: {case}")
    print(f"Reason: {description}")

    if case == "all":
        print("The general diagnostic has already run.")
        return

    answer = input(f"Run the {case} diagnostic now? [Y/n] ").strip().lower()
    if answer in ("", "y", "yes"):
        run_case(case)
        print("\nAttach the reports created to your support ticket.")
    else:
        print(f"Run later using: python diagnose.py --case {case}")

if __name__ == "__main__":
    main()
```
