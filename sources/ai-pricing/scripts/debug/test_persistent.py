#!/usr/bin/env python
"""Test persistent session across multiple niches."""
import sys
sys.path.insert(0, '.')

from src.core.fetching.vinted import fetch_items_scrapling, SessionManager, load_cookies_from_file, set_session_cookies
import os

# Load cookies if available
cookie_file = "www.vinted.fr_cookies.txt"
if os.path.exists(cookie_file):
    cookies = load_cookies_from_file(cookie_file)
    set_session_cookies(cookies)

# Test niches
test_niches = [
    {'name': 'Niche 1 - Nike', 'feed_url': 'https://www.vinted.fr/api/v2/catalog/items?page=1&per_page=10&search_text=Nike', 'max_pages': 1},
]

print("Testing persistent session across multiple niches...")
print("Session will be created ONCE and reused for all niches.\n")
print("="*60)

total_items = 0
for i, niche in enumerate(test_niches, 1):
    print(f"\n[{i}/{len(test_niches)}] Fetching: {niche['name']}")
    
    try:
        items = fetch_items_scrapling(niche, headless=True, timeout_ms=30000)
        print(f"    → Got {len(items)} items")
        total_items += len(items)
        
        if items:
            sample = items[0]
            print(f"    → Sample: {sample.get('title', '')[:40]}... ({sample.get('price_numeric', '?')} EUR)")
    except Exception as e:
        print(f"    → ERROR: {e}")

print("\n" + "="*60)
print(f"TOTAL: {total_items} items fetched across {len(test_niches)} niches")

# Clean up session
SessionManager.close()
print("Session closed.")
