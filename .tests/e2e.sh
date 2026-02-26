#!/usr/bin/env bash
set -euo pipefail

script_dir=$(cd "$(dirname "$0")" && pwd)
repo_root=$(cd "$script_dir/.." && pwd)

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

passed=0
failed=0

require_docker() {
  if ! command -v docker >/dev/null 2>&1; then
    echo -e "${RED}ERROR:${NC} docker is required."
    exit 1
  fi

  if ! docker info >/dev/null 2>&1; then
    echo -e "${RED}ERROR:${NC} docker daemon is not running."
    exit 1
  fi
}

run_lint_fixture() {
  local path="$1"
  local name="$2"

  echo ""
  echo -e "${YELLOW}========================================${NC}"
  echo -e "${YELLOW}  Linting: $name ($path)${NC}"
  echo -e "${YELLOW}========================================${NC}"

  if ! bash "$repo_root/assets/run.sh" --path "$path" --fail-on-error false; then
    echo -e "${RED}[FAIL]${NC} $name - execution failed"
    failed=$((failed + 1))
    return
  fi

  local report="$repo_root/$path/.eslint/eslint-report.json"
  if [ ! -f "$report" ]; then
    echo -e "${RED}[FAIL]${NC} $name - report not found: $report"
    failed=$((failed + 1))
    return
  fi

  local counts
  counts=$(node - "$report" <<'NODE'
const fs = require("fs");
const report = process.argv[2];
const data = JSON.parse(fs.readFileSync(report, "utf8"));
if (!Array.isArray(data)) {
  console.log("0 0");
  process.exit(0);
}
const totals = data.reduce(
  (acc, item) => {
    acc.errors += Number(item.errorCount || 0);
    acc.warnings += Number(item.warningCount || 0);
    return acc;
  },
  { errors: 0, warnings: 0 },
);
console.log(`${totals.errors} ${totals.warnings}`);
NODE
)

  local errors warnings
  read -r errors warnings <<< "$counts"

  if [ "$errors" -le 0 ]; then
    echo -e "${RED}[FAIL]${NC} $name - expected lint errors in fixture"
    failed=$((failed + 1))
    return
  fi

  echo -e "${GREEN}[PASS]${NC} $name - errors=$errors warnings=$warnings"
  passed=$((passed + 1))
}

echo "========================================"
echo "  ops-eslint E2E Test Suite"
echo "========================================"

require_docker
run_lint_fixture ".tests/api" "E2E API"
run_lint_fixture ".tests/react" "E2E React"

echo ""
echo "Passed: $passed  Failed: $failed  Total: $((passed + failed))"

if [ "$failed" -gt 0 ]; then
  echo -e "${RED}Some checks failed${NC}"
  exit 1
fi

echo -e "${GREEN}All checks passed${NC}"
