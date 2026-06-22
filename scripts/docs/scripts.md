## Scripts

- `scripts/doctor.sh` : validate env
- `scripts/lint.sh [--fix]` : lint/format
- `scripts/test.sh [all|quick]` : tests
- `scripts/dev-up.sh [service]` : start docker compose dev stack
- `scripts/dev-down.sh` : stop compose
- `scripts/build.sh` : build artifacts
- `scripts/release.sh <version>` : tag + build
- `scripts/support-bundle.sh` : diagnostics bundle
- `scripts/new-service.sh <name>` : scaffold a service
- `scripts/changed.sh [baseRef] [headRef]` : run checks for changed files
