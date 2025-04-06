#!/usr/bin/env bash
set -euo pipefail

CI_OUT_DIR="public/${CI_COMMIT_REF_NAME}"
mkdir -p "$CI_OUT_DIR"

SUMMARY_PATH="$CI_OUT_DIR/summary.txt"
INFO_PATH="$CI_OUT_DIR/info.env"
REPORT_MD="$CI_OUT_DIR/report-${CI_COMMIT_SHORT_SHA}.md"

# Run tests with coverage and tee output
echo "Running tests and capturing summary..."
npm run test:coverage | tee "$SUMMARY_PATH"

# Parse results
PASS_COUNT=$(grep -Eo "[0-9]+ passed" "$SUMMARY_PATH" | awk '{print $1}' || echo 0)
FAIL_COUNT=$(grep -Eo "[0-9]+ failed" "$SUMMARY_PATH" | awk '{print $1}' || echo 0)
COVERAGE=$(grep -Eo "[0-9]{1,3}\.[0-9]{1,2}% Statements" coverage/coverage-summary.txt | head -n1 | grep -Eo "[0-9]{1,3}\.[0-9]{1,2}" || echo 0.0)

# Fail fast if tests fail
if [[ "$FAIL_COUNT" != "0" ]]; then
  echo "❌ $FAIL_COUNT test(s) failed. Failing pipeline."
  exit 1
fi

# Threshold enforcement
THRESHOLD=85.0
if (( $(echo "$COVERAGE < $THRESHOLD" | bc -l) )); then
  echo "❌ Coverage $COVERAGE% is below threshold $THRESHOLD%. Failing pipeline."
  exit 1
fi

# Export info
cat <<EOF > "$INFO_PATH"
CI_PAGES_URL=$CI_PAGES_URL
REPORT_URL=$CI_PAGES_URL/$CI_COMMIT_REF_NAME/report-${CI_COMMIT_SHORT_SHA}.md
PASS_COUNT=$PASS_COUNT
FAIL_COUNT=$FAIL_COUNT
COVERAGE_PERCENT=$COVERAGE
EOF

# Append to CSV history log
CSV_PATH="public/$CI_COMMIT_REF_NAME/coverage-history.csv"
echo "${CI_COMMIT_SHORT_SHA},${CI_COMMIT_REF_NAME},$COVERAGE" >> "$CSV_PATH"

