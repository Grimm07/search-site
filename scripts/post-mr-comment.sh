#!/usr/bin/env bash
set -euo pipefail

if [ -z "${CI_MERGE_REQUEST_IID:-}" ]; then
  echo "Not a merge request. Skipping."
  exit 0
fi

CI_OUT_DIR="public/${CI_COMMIT_REF_NAME}"
source "$CI_OUT_DIR/info.env"

EMOJI="✅"
if [[ "${FAIL_COUNT:-0}" != "0" ]]; then
  EMOJI="❌"
fi

# Optional: Fetch base branch coverage
BASE_BRANCH=${CI_MERGE_REQUEST_TARGET_BRANCH_NAME:-main}
BASE_URL="${CI_PROJECT_URL}/-/raw/${BASE_BRANCH}/public/${BASE_BRANCH}/info.env"
curl -sfL "$BASE_URL" -o .base_info.env || true
source .base_info.env || true

DELTA=$(echo "${COVERAGE_PERCENT:-0} - ${COVERAGE_PERCENT:-0}" | bc -l)
SIGN=$(echo "$DELTA" | awk '{if ($1 >= 0) print "+"; else print "-"}')

COMMENT_MARKER="<!-- ci-report-${CI_COMMIT_REF_NAME} -->"
COMMENT_BODY="${EMOJI} Test report for branch \`${CI_COMMIT_REF_NAME}\` and commit \`${CI_COMMIT_SHORT_SHA}\`:
- [HTML Report](${CI_PAGES_URL}/${CI_COMMIT_REF_NAME}/index.html)
- [Markdown Summary](${CI_PAGES_URL}/${CI_COMMIT_REF_NAME}/report-${CI_COMMIT_SHORT_SHA}.md)
- **Passed:** ${PASS_COUNT:-0} | **Failed:** ${FAIL_COUNT:-0}
- 📊 Coverage: ${COVERAGE_PERCENT:-0}%
- 📈 Coverage change vs \`${BASE_BRANCH}\`: ${SIGN}$(printf %.2f "$DELTA")%

${COMMENT_MARKER}"

# JSON encode
jq -n --arg body "$COMMENT_BODY" '{body: $body}' > .ci-mr-comment.json

NOTE_ID=$(curl --silent --header "PRIVATE-TOKEN: ${GITLAB_TOKEN}" \
  "${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/merge_requests/${CI_MERGE_REQUEST_IID}/notes" \
  | jq -r --arg marker "$COMMENT_MARKER" '.[] | select(.body | contains($marker)) | .id' | head -n1)

if [ -n "$NOTE_ID" ]; then
  echo "Editing comment $NOTE_ID..."
  curl --request PUT \
    --header "PRIVATE-TOKEN: ${GITLAB_TOKEN}" \
    --header "Content-Type: application/json" \
    --data @.ci-mr-comment.json \
    "${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/merge_requests/${CI_MERGE_REQUEST_IID}/notes/$NOTE_ID"
else
  echo "Creating new MR comment..."
  curl --request POST \
    --header "PRIVATE-TOKEN: ${GITLAB_TOKEN}" \
    --header "Content-Type: application/json" \
    --data @.ci-mr-comment.json \
    "${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/merge_requests/${CI_MERGE_REQUEST_IID}/notes"
fi
