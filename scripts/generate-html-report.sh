#!/usr/bin/env bash
set -euo pipefail

CI_OUT_DIR="public/${CI_COMMIT_REF_NAME}"
mkdir -p "$CI_OUT_DIR"

# Copy coverage files
cp -r coverage/* "$CI_OUT_DIR/"

# Generate simple index
cat <<EOF > "$CI_OUT_DIR/index.html"
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CI Reports - $CI_COMMIT_REF_NAME</title>
  <style>
    body { font-family: sans-serif; padding: 2rem; background: #f4f4f4; }
    h1 { color: #222; }
    .link-block, .summary { margin: 1rem 0; padding: 1rem; background: white; border-radius: 0.5rem; box-shadow: 0 0 5px rgba(0,0,0,0.1); }
    table { width: 100%; border-collapse: collapse; }
    td, th { padding: 0.5rem; border-bottom: 1px solid #ccc; }
  </style>
</head>
<body>
  <h1>Reports for <code>${CI_COMMIT_REF_NAME}</code></h1>

  <div class="summary">
    <h2>🧪 Test Summary</h2>
    <table>
      <tr><th>Commit</th><td>${CI_COMMIT_SHORT_SHA}</td></tr>
      <tr><th>Passed</th><td>${PASS_COUNT}</td></tr>
      <tr><th>Failed</th><td>${FAIL_COUNT}</td></tr>
      <tr><th>Coverage</th><td>${COVERAGE}%</td></tr>
    </table>
  </div>

  <div class="link-block">
    <a href="report-${CI_COMMIT_SHORT_SHA}.md">📝 Markdown Summary</a>
  </div>
</body>
</html>
EOF

