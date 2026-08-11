#!/usr/bin/env python
"""Quick validation of all URLs in config without fetching."""
import yaml

print("Checking all niche URLs in config...\n")

with open('config/config.yaml', 'r', encoding='utf-8') as f:
    cfg = yaml.safe_load(f)

niches = cfg.get('niches', [])
issues = []

for i, niche in enumerate(niches, 1):
    name = niche.get('name', f'Niche {i}')
    
    # Get URLs
    feed_urls = niche.get('feed_urls') or []
    if not feed_urls and niche.get('feed_url'):
        feed_urls = [niche['feed_url']]
    
    if not feed_urls:
        issues.append((name, "NO_URL", "No feed_url or feed_urls defined"))
        continue
    
    for j, url in enumerate(feed_urls):
        # Check for common issues
        if not url:
            issues.append((name, "EMPTY", f"URL #{j+1} is empty"))
        elif not url.startswith('http'):
            issues.append((name, "INVALID", f"URL doesn't start with http: {url[:50]}..."))
        elif url.startswith('- '):
            issues.append((name, "YAML_ERROR", f"URL has YAML prefix '- ': {url[:50]}..."))
        elif '&amp;' in url:
            issues.append((name, "ENCODED", f"URL has HTML encoding (&amp;): {url[:50]}..."))
        elif 'vinted.fr' not in url:
            issues.append((name, "WRONG_DOMAIN", f"URL is not Vinted: {url[:50]}..."))
        else:
            print(f"✅ [{i:2}] {name}")
            for u in feed_urls:
                print(f"       {u[:80]}...")
            break  # Only print once per niche

print("\n" + "="*70)

if issues:
    print(f"\n❌ Found {len(issues)} issues:\n")
    for name, issue_type, detail in issues:
        print(f"  [{issue_type}] {name}")
        print(f"          {detail}\n")
else:
    print("\n✅ All URLs look valid!")

print(f"\nTotal niches: {len(niches)}")
print(f"Issues found: {len(issues)}")
