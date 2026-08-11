#!/usr/bin/env bash
set -euo pipefail

base_url="https://3000-iosf6cd1hbktth1n82zss-995aadcb.us2.manus.computer"
report="/home/ubuntu/well-lived-citizen-site/served-link-audit.txt"

cat /dev/null > "$report"

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

for route in "${routes[@]}"; do
  html="$(curl -L -s "${base_url}${route}")"
  {
    echo "ROUTE ${route}"
    printf '%s\n' "$html" | grep -Eo 'https://thewelllivedcitizen.com[^" >]*|mailto:zelleEmail|tel:[0-9]+' | sort -u || true
    echo "----"
  } >> "$report"
done

cat "$report"
