#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Usage: assets/run.sh [options] [-- <extra-eslint-args>]

Options:
  --path <path>                 Path to lint (default: .)
  --eslint-args <args>          ESLint targets/flags string (default: .)
  --fix                         Enable --fix
  --max-warnings <n>            Fail if warnings exceed n (default: -1)
  --report-dir <dir>            Directory for lint report (default: .eslint)
  --report-file <name>          Report filename (default: eslint-report.json)
  --report-formatter <name>     ESLint formatter for report (default: json)
  --build-image <true|false>    Build image before linting (default: true)
  --image-tag <tag>             Docker image tag (default: malnati-ops-eslint:local)
  --fail-on-error <true|false>  Exit non-zero when lint fails (default: true)
  -h, --help                    Show this help
USAGE
}

to_bool() {
  local value="${1:-}"
  case "${value,,}" in
    true|1|yes|y) echo "true" ;;
    false|0|no|n) echo "false" ;;
    *) echo "$value" ;;
  esac
}

SCAN_PATH="${INPUT_PATH:-.}"
ESLINT_ARGS="${INPUT_ESLINT_ARGS:-.}"
FIX="${INPUT_FIX:-false}"
MAX_WARNINGS="${INPUT_MAX_WARNINGS:--1}"
REPORT_DIR="${INPUT_REPORT_DIR:-.eslint}"
REPORT_FILE="${INPUT_REPORT_FILE:-eslint-report.json}"
REPORT_FORMATTER="${INPUT_REPORT_FORMATTER:-json}"
BUILD_IMAGE="${INPUT_BUILD_IMAGE:-true}"
IMAGE_TAG="${INPUT_IMAGE_TAG:-malnati-ops-eslint:local}"
FAIL_ON_ERROR="${INPUT_FAIL_ON_ERROR:-true}"

EXTRA_ARGS=()
while [ "$#" -gt 0 ]; do
  case "$1" in
    --path)
      SCAN_PATH="$2"
      shift 2
      ;;
    --eslint-args)
      ESLINT_ARGS="$2"
      shift 2
      ;;
    --fix)
      FIX="true"
      shift
      ;;
    --max-warnings)
      MAX_WARNINGS="$2"
      shift 2
      ;;
    --report-dir)
      REPORT_DIR="$2"
      shift 2
      ;;
    --report-file)
      REPORT_FILE="$2"
      shift 2
      ;;
    --report-formatter)
      REPORT_FORMATTER="$2"
      shift 2
      ;;
    --build-image)
      BUILD_IMAGE="$2"
      shift 2
      ;;
    --image-tag)
      IMAGE_TAG="$2"
      shift 2
      ;;
    --fail-on-error)
      FAIL_ON_ERROR="$2"
      shift 2
      ;;
    --)
      shift
      EXTRA_ARGS=("$@")
      break
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage
      exit 1
      ;;
  esac
done

FIX="$(to_bool "$FIX")"
BUILD_IMAGE="$(to_bool "$BUILD_IMAGE")"
FAIL_ON_ERROR="$(to_bool "$FAIL_ON_ERROR")"

if [ "$FIX" != "true" ] && [ "$FIX" != "false" ]; then
  echo "ERROR: --fix must be true or false." >&2
  exit 1
fi
if [ "$BUILD_IMAGE" != "true" ] && [ "$BUILD_IMAGE" != "false" ]; then
  echo "ERROR: --build-image must be true or false." >&2
  exit 1
fi
if [ "$FAIL_ON_ERROR" != "true" ] && [ "$FAIL_ON_ERROR" != "false" ]; then
  echo "ERROR: --fail-on-error must be true or false." >&2
  exit 1
fi

if [ -z "$SCAN_PATH" ] || [ -z "$REPORT_FILE" ]; then
  echo "ERROR: path and report-file cannot be empty." >&2
  exit 1
fi

script_dir=$(cd "$(dirname "$0")" && pwd)
repo_root=$(cd "$script_dir/.." && pwd)
workspace="${GITHUB_WORKSPACE:-$repo_root}"

if [[ "$SCAN_PATH" = /* ]]; then
  target_abs="$SCAN_PATH"
  mount_source="$SCAN_PATH"
  container_workdir="/workspace"
  output_prefix=""
else
  target_abs="$workspace/$SCAN_PATH"
  mount_source="$workspace"
  container_workdir="/workspace/$SCAN_PATH"
  output_prefix="$SCAN_PATH"
fi

if [ ! -d "$target_abs" ]; then
  echo "ERROR: lint path does not exist: $target_abs" >&2
  exit 1
fi

report_dir_rel="${REPORT_DIR#/}"
if [ -z "$report_dir_rel" ]; then
  report_dir_rel=".eslint"
fi

mkdir -p "$target_abs/$report_dir_rel"
report_abs="$target_abs/$report_dir_rel/$REPORT_FILE"
report_container_path="$report_dir_rel/$REPORT_FILE"

if [ -z "$output_prefix" ]; then
  report_output="$report_abs"
elif [ "$output_prefix" = "." ]; then
  report_output="$report_container_path"
else
  report_output="$output_prefix/$report_container_path"
fi

if [ "$BUILD_IMAGE" = "true" ]; then
  echo "==> Building tooling image: $IMAGE_TAG"
  docker build -t "$IMAGE_TAG" -f "$repo_root/Dockerfile" "$repo_root"
fi

lint_targets=()
if [ -n "${ESLINT_ARGS// }" ]; then
  # shellcheck disable=SC2206
  lint_targets=($ESLINT_ARGS)
fi
if [ "${#EXTRA_ARGS[@]}" -gt 0 ]; then
  lint_targets+=("${EXTRA_ARGS[@]}")
fi
if [ "${#lint_targets[@]}" -eq 0 ]; then
  lint_targets=(".")
fi

docker_cmd=(
  docker run --rm
  -v "$mount_source:/workspace"
  -w "$container_workdir"
  -e ESLINT_USE_FLAT_CONFIG=true
  "$IMAGE_TAG"
)

eslint_cmd=(
  --format "$REPORT_FORMATTER"
  --output-file "$report_container_path"
)

if [ "$FIX" = "true" ]; then
  eslint_cmd+=(--fix)
fi
if [ "$MAX_WARNINGS" != "-1" ]; then
  eslint_cmd+=(--max-warnings "$MAX_WARNINGS")
fi
eslint_cmd+=("${lint_targets[@]}")

echo "==> Running ESLint in container"
echo "Path: $SCAN_PATH"
echo "Report: $report_output"

set +e
"${docker_cmd[@]}" "${eslint_cmd[@]}"
exit_code=$?
set -e

if [ ! -f "$report_abs" ] && [ "$REPORT_FORMATTER" = "json" ]; then
  echo "[]" > "$report_abs"
fi

error_count=0
warning_count=0
if [ "$REPORT_FORMATTER" = "json" ] && [ -s "$report_abs" ]; then
  read -r error_count warning_count <<<"$(node - "$report_abs" <<'NODE'
const fs = require("fs");
const file = process.argv[2];
try {
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
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
} catch {
  console.log("0 0");
}
NODE
)"
fi

status="passed"
if [ "$exit_code" -ne 0 ]; then
  status="failed"
fi

if [ -n "${GITHUB_OUTPUT:-}" ]; then
  {
    echo "report_path=$report_output"
    echo "error_count=$error_count"
    echo "warning_count=$warning_count"
    echo "status=$status"
    echo "exit_code=$exit_code"
  } >> "$GITHUB_OUTPUT"
fi

echo "ESLint finished with status=$status (errors=$error_count warnings=$warning_count exit_code=$exit_code)"

if [ "$exit_code" -ne 0 ] && [ "$FAIL_ON_ERROR" = "true" ]; then
  exit "$exit_code"
fi

if [ "$exit_code" -ne 0 ] && [ "$FAIL_ON_ERROR" = "false" ]; then
  echo "Lint failed, but fail_on_error=false so the step will continue."
fi
