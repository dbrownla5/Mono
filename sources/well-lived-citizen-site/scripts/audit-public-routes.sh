#!/usr/bin/env bash
set -euo pipefail

base_url="https://3000-iosf6cd1hbktth1n82zss-995aadcb.us2.manus.computer"
report="/home/ubuntu/well-lived-citizen-site/public-route-audit.txt"

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
    printf '%s\n' "$html" | grep -o '<title>[^<]*</title>' | head -n 1 || true
    printf '%s\n' "$html" | grep -Eo 'tel:[0-9]+' | sort -u | tr '\n' ' ' || true
    printf '\n'
    printf '%s\n' "$html" | grep -Eo 'mailto:[^" >]+' | sort -u | tr '\n' ' ' || true
    printf '\n'
    printf '%s\n' "$html" | grep -Eo 'https://formspree.io/f/[A-Za-z0-9]+' | sort -u | tr '\n' ' ' || true
    printf '\n----\n'
  } >> "$report"
done

cat "$report"
