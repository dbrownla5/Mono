
from src.core.fetching.vinted import fetch_items_scrapling, SessionManager, load_cookies_from_file, set_session_cookies
import os

# Load cookies
cookie_file = "www.vinted.fr_cookies.txt"
if os.path.exists(cookie_file):
    cookies = load_cookies_from_file(cookie_file)
    set_session_cookies(cookies)

niche = {
    "name": "Debug Condition",
    "feed_url": "https://www.vinted.fr/api/v2/catalog/items?page=1&per_page=10&search_text=Nike",
    "max_pages": 1
}

print("Fetching items to inspect 'status'/'condition' fields...")
items = fetch_items_scrapling(niche, headless=True)

if items:
    print(f"\nFetched {len(items)} items. Inspecting conditions:")
    for item in items[:20]:
        status = item.get("status")
        condition = item.get("condition")
        title = item.get("title")
        print(f"Title: {title[:30]}... | Status: '{status}' | Condition: '{condition}'")
else:
    print("No items fetched.")

SessionManager.close()
