
import sys
import os
import time

# Add src to path
sys.path.append(os.path.join(os.getcwd(), 'src'))

from core.database import DatabaseManager
from core.fetcher import fetch_items_curl, load_cookies_from_file, set_session_cookies

def verify_system():
    print("=== Loading Cookies ===")
    try:
        cookie_file = "www.vinted.fr_cookies.txt"
        if os.path.exists(cookie_file):
            cookies = load_cookies_from_file(cookie_file)
            set_session_cookies(cookies)
            print(f"✅ Loaded {len(cookies)} cookies from {cookie_file}")
        else:
            print(f"⚠️ Cookie file not found: {cookie_file}")
    except Exception as e:
        print(f"❌ Error loading cookies: {e}")

    print("\n=== 1. Testing Database Storage ===")
    try:
        db = DatabaseManager()
        
        # Create a dummy item
        dummy_item = {
            "id": int(time.time()),
            "title": "Test Item Verification",
            "price_numeric": 10.0,
            "currency": "EUR",
            "brand_title": "TestBrand",
            "user": {
                "id": 12345,
                "login": "tester",
                "feedback_reputation": 0.9,
                "feedback_count": 10
            },
            "photos": [{"url": "http://example.com/photo.jpg"}],
            "status": "neuf",
            "url": "http://vinted.fr/items/12345"
        }
        
        print("Inserting dummy item...")
        is_new, action = db.upsert_item(dummy_item)
        print(f"Insert result: is_new={is_new}, action={action}")
        
        print("Verifying item in DB...")
        items = db.get_items_by_status('active', days=1)
        found = False
        for it in items:
            if it['title'] == "Test Item Verification":
                print("✅ Success: Item found in database!")
                print("Stored Raw JSON snippet:", it['raw_json'][:50], "...")
                found = True
                break
        
        if not found:
            print("❌ Error: Item not found in database after insert.")
            
    except Exception as e:
        print(f"❌ Database Error: {e}")

    print("\n=== 2. Testing API JSON Reading (via curl_cffi) ===")
    try:
        # Define a simple niche
        niche = {
            "name": "Test Fetch",
            "search_text": "Nike",
            "max_pages": 1
        }
        
        print("Fetching items using curl_cffi (fallback mode)...")
        items = fetch_items_curl(niche, max_pages=1)
        
        if items:
            print(f"✅ Success: Fetched {len(items)} items.")
            print("Sample Item JSON keys:", list(items[0].keys()))
            print("Sample Title:", items[0].get('title'))
        else:
            print("⚠️ Warning: No items fetched. API might be blocking or empty results.")
            
    except ImportError:
        print("❌ Error: curl_cffi not installed.")
    except Exception as e:
        print(f"❌ Fetch Error: {e}")

if __name__ == "__main__":
    verify_system()
