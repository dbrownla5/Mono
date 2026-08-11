#!/usr/bin/env python
"""Test all niche URLs from config to verify they work."""
import sys
import yaml
sys.path.insert(0, '.')

from src.core.fetching.vinted import fetch_items_scrapling

# Load config
with open('config/config.yaml', 'r', encoding='utf-8') as f:
    cfg = yaml.safe_load(f)

niches = cfg.get('niches', [])
print(f"Found {len(niches)} niches to test\n")
print("="*70)

results = []
for i, niche in enumerate(niches, 1):
    name = niche.get('name', f'Niche {i}')
    feed_urls = niche.get('feed_urls') or []
    if not feed_urls and niche.get('feed_url'):
        feed_urls = [niche['feed_url']]
    
    print(f"\n[{i}/{len(niches)}] Testing: {name}")
    
    if not feed_urls:
        print("  ⚠️  No URLs defined!")
        results.append((name, 'NO_URL', 0))
        continue
    
    for url in feed_urls:
        url_short = url[:80] + "..." if len(url) > 80 else url
        print(f"  URL: {url_short}")
        
        # Check URL validity
        if not url or not url.startswith('http'):
            print(f"  ❌ INVALID URL: '{url}'")
            results.append((name, 'INVALID', 0))
            continue
    
    # Test fetch with max 1 page
    test_niche = {**niche, 'max_pages': 1}
    try:
        items = fetch_items_scrapling(test_niche, headless=True, timeout_ms=30000)
        count = len(items)
        if count > 0:
            print(f"  ✅ OK - Fetched {count} items")
            results.append((name, 'OK', count))
        else:
            print("  ⚠️  0 items (may need different search)")
            results.append((name, 'EMPTY', 0))
    except Exception as e:
        print(f"  ❌ ERROR: {e}")
        results.append((name, 'ERROR', 0))

print("\n" + "="*70)
print("SUMMARY:")
print("="*70)

ok_count = sum(1 for r in results if r[1] == 'OK')
empty_count = sum(1 for r in results if r[1] == 'EMPTY')
error_count = sum(1 for r in results if r[1] in ('ERROR', 'INVALID', 'NO_URL'))

print(f"✅ Working: {ok_count}")
print(f"⚠️  Empty (0 items): {empty_count}")
print(f"❌ Errors: {error_count}")

if error_count > 0:
    print("\nNiches with errors:")
    for name, status, _ in results:
        if status in ('ERROR', 'INVALID', 'NO_URL'):
            print(f"  - {name}: {status}")

# Save results
with open('url_test_results.txt', 'w', encoding='utf-8') as f:
    f.write("URL Test Results\n")
    f.write("="*50 + "\n\n")
    for name, status, count in results:
        f.write(f"{status:8} | {count:3} items | {name}\n")

print("\nResults saved to url_test_results.txt")
