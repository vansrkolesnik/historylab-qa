#!/usr/bin/env bash
# History Lab, Stage 5.3F.5.4C — candidate only, DO NOT deploy without approval.
set -euo pipefail

output="__publish"
if [[ -e "$output" || -L "$output" ]]; then
  echo "ERROR: $output already exists; refusing to reuse or delete it." >&2
  exit 1
fi

required=(assets section1 section2 section3 _redirects critical-media-sw.js favicon.ico index.html robots.txt sitemap.xml)
for item in "${required[@]}"; do
  if [[ ! -e "$item" ]]; then
    echo "ERROR: required input missing: $item" >&2
    exit 1
  fi
done

mkdir -- "$output"
cp -R -- "${required[@]}" "$output/"

# Fail closed: only the approved publication set is accepted.
if [[ -e "$output/docs" || -e "$output/netlify.toml" || -e "$output/scripts" ]]; then
  echo "ERROR: non-public files found in output." >&2
  exit 1
fi

file_count="$(find "$output" -type f | wc -l | tr -d '[:space:]')"
html_count="$(find "$output" -type f -name '*.html' | wc -l | tr -d '[:space:]')"
if [[ "$file_count" -ne 232 || "$html_count" -ne 78 ]]; then
  echo "ERROR: unexpected output file count: $file_count total, $html_count HTML." >&2
  exit 1
fi

for item in _redirects critical-media-sw.js favicon.ico index.html robots.txt sitemap.xml; do
  [[ -f "$output/$item" ]] || { echo "ERROR: missing $item" >&2; exit 1; }
done
printf 'PUBLICATION_STAGING_OK files=%s html=%s docs=0\n' "$file_count" "$html_count"
