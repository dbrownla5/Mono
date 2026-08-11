#!/usr/bin/env bash
set -euo pipefail

base_url="https://3000-iosf6cd1hbktth1n82zss-995aadcb.us2.manus.computer"
report="/home/ubuntu/well-lived-citizen-site/cta-audit-report.txt"

routes=(
  "/"
  "/about"
  "/services"
  "/services/home-organization"
  "/services/house-calls"
  "/services/legacy"
  "/services/resale"
  "/pricing"
  "/contact"
)

cat /dev/null > "$report"

for route in "${routes[@]}"; do
  html="$(curl -L -s "${base_url}${route}")"
  {
    echo "ROUTE ${route}"
    printf '%s\n' "$html" | grep -Eo 'href="[^"]+"' | sed 's/^href="//; s/"$//' | sort -u
    echo "----"
  } >> "$report"
done

cat "$report"
