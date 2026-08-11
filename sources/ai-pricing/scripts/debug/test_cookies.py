#!/usr/bin/env python
"""Test script to verify cookie-based fetching works."""
import sys
sys.path.insert(0, '.')

from src.core.fetching.vinted import load_cookies_from_file, set_session_cookies, fetch_items_curl

# Load cookies from file
cookies = load_cookies_from_file('www.vinted.fr_cookies.txt')
set_session_cookies(cookies)

# Test fetch
niche = {
    'name': 'Test',
    'feed_url': 'https://www.vinted.fr/api/v2/catalog/items?page=1&per_page=10&search_text=Nike',
    'max_pages': 1
}

print("\nFetching items...")
items = fetch_items_curl(niche, max_pages=1)

# Write results to file
with open('test_result.txt', 'w', encoding='utf-8') as f:
    f.write(f"Fetched {len(items)} items!\n\n")
    if items:
        f.write("First 5 items:\n")
        for it in items[:5]:
            item_id = it.get('id')
            title = it.get('title', '')[:60]
            price = it.get('price_numeric') or (it.get('price') or {}).get('amount') or '?'
            f.write(f"  - {item_id}: {title}... ({price} EUR)\n")
    else:
        f.write("No items fetched - cookies might be expired or invalid\n")

print(f"Results written to test_result.txt ({len(items)} items)")
