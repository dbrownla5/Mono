
import json
import os
from src.core.fetching.vinted import fetch_items_scrapling, SessionManager, load_cookies_from_file, set_session_cookies

# Load cookies
cookie_file = "www.vinted.fr_cookies.txt"
if os.path.exists(cookie_file):
    cookies = load_cookies_from_file(cookie_file)
    set_session_cookies(cookies)

niche = {
    "name": "Debug Analysis",
    "feed_url": "https://www.vinted.fr/api/v2/catalog/items?page=1&per_page=1&search_text=Nike",
    "max_pages": 1
}

print("Fetching 1 item to dump raw JSON...")
items = fetch_items_scrapling(niche, headless=True)

if items:
    item = items[0]
    with open("debug_item.json", "w", encoding="utf-8") as f:
        json.dump(item, f, indent=4, ensure_ascii=False)
    print("✅ Item JSON saved to debug_item.json")
else:
    print("❌ No items fetched.")

SessionManager.close()
