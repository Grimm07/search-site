#!/usr/bin/env bash
set -euo pipefail

CI_OUT_DIR="public/${CI_COMMIT_REF_NAME}"
SUMMARY_PATH="$CI_OUT_DIR/summary.txt"
REPORT_MD="$CI_OUT_DIR/report-${CI_COMMIT_SHORT_SHA}.md"

echo "## CI Test Report - Commit \`${CI_COMMIT_SHORT_SHA}\`" > "$REPORT_MD"
echo '' >> "$REPORT_MD"
cat "$SUMMARY_PATH" >> "$REPORT_MD"
