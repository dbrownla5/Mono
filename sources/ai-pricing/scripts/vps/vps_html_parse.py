"""Parse HTML page for item status data — run on VPS."""
import os
import re
import time
import json

os.chdir("/REDACTED/REMOTE_DIR")
from curl_cffi import requests as cffi_requests

FP = {
    "impersonate": "chrome131",
    "ua": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/131.0.0.0 Safari/537.36"
    ),
}

# Get session
resp = cffi_requests.get(
    "https://www.vinted.fr",
    headers={"User-Agent": FP["ua"], "Accept": "text/html"},
    impersonate=FP["impersonate"],
    timeout=10,
)
cookies = dict(resp.cookies)
cookie_str = "; ".join(f"{k}={v}" for k, v in cookies.items())

# Get a fresh item
url = (
    "https://www.vinted.fr/api/v2/catalog/items"
    f"?page=1&per_page=5&time={int(time.time())}"
    "&search_text=Nike&order=newest_first"
)
resp = cffi_requests.get(
    url,
    headers={"Accept": "application/json", "User-Agent": FP["ua"], "Cookie": cookie_str},
    impersonate=FP["impersonate"],
    timeout=10,
)
items = resp.json().get("items", [])
test_id = str(items[0]["id"])
print(f"Testing item: {test_id}")

time.sleep(1)

# Fetch HTML page
html_url = f"https://www.vinted.fr/items/{test_id}"
resp = cffi_requests.get(
    html_url,
    headers={"User-Agent": FP["ua"], "Accept": "text/html", "Cookie": cookie_str},
    impersonate=FP["impersonate"],
    timeout=15,
)
text = resp.text
print(f"HTML length: {len(text)}")

# Search for key item fields
for key in ["can_buy", "is_closed", "item_closing_action", "can_buy_used"]:
    idx = text.find(key)
    if idx >= 0:
        snippet = text[max(0, idx - 10) : idx + 60]
        print(f"Found '{key}' at pos {idx}: ...{repr(snippet)}...")
    else:
        print(f"NOT found: '{key}'")

# Find __NEXT_DATA__ script tag
next_data_match = re.search(
    r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>',
    text,
    re.DOTALL,
)
if next_data_match:
    nd = next_data_match.group(1)
    print(f"\n__NEXT_DATA__ found ({len(nd)} chars)")
    try:
        nd_json = json.loads(nd)
        # Navigate to find item data
        props = nd_json.get("props", {}).get("pageProps", {})
        item = props.get("item", props.get("itemDto", {}))
        if item:
            print(f"  id: {item.get('id')}")
            print(f"  can_buy: {item.get('can_buy')}")
            print(f"  is_closed: {item.get('is_closed')}")
            print(f"  item_closing_action: {item.get('item_closing_action')}")
            print(f"  status: {item.get('status')}")
        else:
            # Try to find item in the nested structure
            print(f"  pageProps keys: {list(props.keys())[:10]}")
    except json.JSONDecodeError as e:
        print(f"  JSON parse error: {e}")
else:
    print("\n__NEXT_DATA__ NOT found")

# Look for all script tags containing item data
scripts = re.findall(r"<script[^>]*>(.*?)</script>", text, re.DOTALL)
print(f"\nTotal script tags: {len(scripts)}")
for i, s in enumerate(scripts):
    if "can_buy" in s or "closing_action" in s or "is_closed" in s:
        print(f"  Script #{i} contains item data ({len(s)} chars)")
        for key in ["can_buy", "item_closing_action", "is_closed"]:
            idx = s.find(key)
            if idx >= 0:
                snippet = s[max(0, idx - 20) : idx + 60]
                print(f"    {key}: ...{repr(snippet)}...")
