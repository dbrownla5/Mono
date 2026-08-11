#!/usr/bin/env python
"""Test Scrapling fetcher with improved wait times."""
import sys
sys.path.insert(0, '.')

from src.core.fetching.vinted import fetch_items_scrapling

# Test niche
niche = {
    'name': 'Test Nike',
    'feed_url': 'https://www.vinted.fr/api/v2/catalog/items?page=1&per_page=10&search_text=Nike',
    'max_pages': 1
}

print("Testing Scrapling fetcher with improved wait times...")
print("This may take 15-30 seconds for the first warmup...\n")

try:
    items = fetch_items_scrapling(
        niche,
        headless=False,  # Visible browser to see what happens
        timeout_ms=30000,
        solve_cloudflare=True
    )
    
    # Write results
    with open('scrapling_result.txt', 'w', encoding='utf-8') as f:
        f.write(f"Fetched {len(items)} items!\n\n")
        if items:
            f.write("First 5 items:\n")
            for it in items[:5]:
                item_id = it.get('id')
                title = it.get('title', '')[:60]
                price = it.get('price_numeric') or (it.get('price') or {}).get('amount') or '?'
                f.write(f"  - {item_id}: {title}... ({price} EUR)\n")
        else:
            f.write("No items fetched\n")
    
    print(f"\nDone! Fetched {len(items)} items")
    print("Results saved to scrapling_result.txt")
    
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
