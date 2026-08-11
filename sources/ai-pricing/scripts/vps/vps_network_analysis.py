"""Analyse les appels API faits par la page HTML d'un item Vinted.
Compare un item actif vs un item vendu/removed."""
import os
import re
import time

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


def get_session():
    resp = cffi_requests.get(
        "https://www.vinted.fr",
        headers={"User-Agent": FP["ua"], "Accept": "text/html"},
        impersonate=FP["impersonate"],
        timeout=10,
    )
    return dict(resp.cookies)


def find_api_endpoints_in_html(text):
    """Extract all API endpoints referenced in the HTML."""
    endpoints = set()
    # Find /api/v2/... patterns
    for m in re.finditer(r'/api/v2/[a-zA-Z0-9/_-]+', text):
        endpoints.add(m.group(0))
    # Find fetch/XHR URLs
    for m in re.finditer(r'https?://www\.vinted\.\w+/api/[a-zA-Z0-9/_?&=-]+', text):
        endpoints.add(m.group(0))
    return sorted(endpoints)


def extract_item_json_from_html(text, item_id):
    """Extract the full item JSON blob from HTML script tags."""
    # Find script tags containing the item data
    scripts = re.findall(r'<script[^>]*>(.*?)</script>', text, re.DOTALL)
    for i, s in enumerate(scripts):
        if f'"id":{item_id}' in s or f'"id":"{item_id}"' in s:
            # Try to extract the item JSON
            # Look for patterns like {"id":ITEM_ID,...}
            start = s.find(f'"id":{item_id}')
            if start == -1:
                start = s.find(f'"id":"{item_id}"')
            if start >= 0:
                # Find the enclosing {...}
                brace_start = s.rfind('{', 0, start)
                if brace_start >= 0:
                    return i, s[max(0, brace_start - 20):min(len(s), start + 200)]
    return None, None


def analyze_item_page(item_id, cookie_str, label=""):
    """Fetch and analyze an item's HTML page."""
    print(f"\n{'='*60}")
    print(f"  {label}: Item {item_id}")
    print(f"{'='*60}")

    url = f"https://www.vinted.fr/items/{item_id}"
    headers = {
        "User-Agent": FP["ua"],
        "Accept": "text/html",
        "Cookie": cookie_str,
    }
    resp = cffi_requests.get(
        url, headers=headers, impersonate=FP["impersonate"], timeout=15
    )
    print(f"  HTTP {resp.status_code}, body={len(resp.text)//1024}KB")

    if resp.status_code != 200:
        print("  ERROR: Non-200 status")
        return

    text = resp.text

    # 1. Key status fields
    print("\n  --- Status Fields ---")
    for field in ["can_buy", "is_closed", "item_closing_action", "can_buy_used",
                  "is_reserved", "is_hidden", "is_draft", "is_processing"]:
        # Escaped JSON format
        patterns = [
            (rf'\\"{field}\\":(true|false|null)', "escaped_bool"),
            (rf'\\"{field}\\":\\"([^"\\]*)\\?"', "escaped_str"),
            (rf'"{field}":(true|false|null)', "raw_bool"),
            (rf'"{field}":"([^"]*)"', "raw_str"),
        ]
        for pat, kind in patterns:
            m = re.search(pat, text)
            if m:
                print(f"    {field}: {m.group(1)} ({kind})")
                break
        else:
            # Not found
            pass

    # 2. API endpoints referenced
    print("\n  --- API Endpoints in HTML ---")
    endpoints = find_api_endpoints_in_html(text)
    for ep in endpoints[:20]:
        print(f"    {ep}")
    if len(endpoints) > 20:
        print(f"    ... and {len(endpoints)-20} more")

    # 3. Check for interesting API patterns
    print("\n  --- Interesting Patterns ---")
    patterns_to_check = [
        (r'/api/v2/items/\d+/(?:status|info|details)', "item status endpoint"),
        (r'/api/v2/users/\d+/items', "user items endpoint"),
        (r'graphql', "GraphQL usage"),
        (r'__NEXT_DATA__', "Next.js data"),
        (r'window\.__INITIAL_STATE__', "Initial state"),
        (r'window\.__PRELOADED_STATE__', "Preloaded state"),
        (r'fetchStrategy|dataFetcher', "Data fetching config"),
        (r'/api/v2/item_notifications', "Item notifications API"),
        (r'/api/v2/transactions', "Transactions API"),
    ]
    for pat, name in patterns_to_check:
        m = re.search(pat, text, re.IGNORECASE)
        if m:
            ctx = text[max(0, m.start()-30):m.end()+50]
            print(f"    {name}: ...{repr(ctx[:100])}...")

    # 4. Try alternative API endpoints
    print("\n  --- Testing Alternative Endpoints ---")
    alt_endpoints = [
        f"/api/v2/items/{item_id}/info",
        f"/api/v2/items/{item_id}/details",
        f"/api/v2/items/{item_id}/content",
        f"/api/v2/items/{item_id}/status",
        f"/api/v2/items/{item_id}/summary",
    ]
    for ep in alt_endpoints:
        alt_url = f"https://www.vinted.fr{ep}"
        try:
            r = cffi_requests.get(
                alt_url,
                headers={
                    "Accept": "application/json",
                    "User-Agent": FP["ua"],
                    "Cookie": cookie_str,
                },
                impersonate=FP["impersonate"],
                timeout=5,
            )
            ct = r.headers.get("content-type", "")
            print(f"    {ep}: HTTP {r.status_code} ({ct[:30]})")
            if r.status_code == 200 and "json" in ct:
                print(f"      Body: {r.text[:200]}")
        except Exception as e:
            print(f"    {ep}: ERROR {e}")
        time.sleep(0.5)


def main():
    print("Getting session...")
    cookies = get_session()
    cookie_str = "; ".join(f"{k}={v}" for k, v in cookies.items())

    # Get a fresh active item
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
    active_id = str(items[0]["id"]) if items else None
    print(f"Active item: {active_id}")

    # Get a removed/old item from DB
    from sqlcipher3 import dbapi2 as sqlite3
    conn = sqlite3.connect("/REDACTED/REMOTE_DIR/data/db/market.db")
    conn.execute("PRAGMA key='ma_super_cle_de_32_caracteres!'")
    # Get one expired item
    expired_rows = conn.execute(
        "SELECT id FROM items WHERE status='expired' LIMIT 5"
    ).fetchall()
    # Also get the known sold items
    sold_rows = conn.execute(
        "SELECT id FROM items WHERE status='sold' LIMIT 5"
    ).fetchall()
    conn.close()

    expired_id = str(expired_rows[0][0]) if expired_rows else None
    sold_id = str(sold_rows[0][0]) if sold_rows else None
    print(f"Expired item: {expired_id}")
    print(f"Sold item: {sold_id}")

    # Analyze active item
    if active_id:
        analyze_item_page(active_id, cookie_str, "ACTIVE (from feed)")
        time.sleep(2)

    # Analyze expired item
    if expired_id:
        analyze_item_page(expired_id, cookie_str, "EXPIRED (from DB)")
        time.sleep(2)

    # Analyze sold item
    if sold_id:
        analyze_item_page(sold_id, cookie_str, "SOLD (from DB)")
        time.sleep(2)

    # Try a known sold item on Vinted (manually found)
    # If we don't have one, try to find a sold indicator
    print("\n\n--- BONUS: Testing /api/v2/catalog/items with status filter ---")
    for status_filter in ["sold", "closed"]:
        test_url = (
            "https://www.vinted.fr/api/v2/catalog/items"
            f"?page=1&per_page=5&time={int(time.time())}"
            f"&status={status_filter}"
        )
        r = cffi_requests.get(
            test_url,
            headers={"Accept": "application/json", "User-Agent": FP["ua"], "Cookie": cookie_str},
            impersonate=FP["impersonate"],
            timeout=10,
        )
        ct = r.headers.get("content-type", "")
        print(f"  catalog?status={status_filter}: HTTP {r.status_code} ({ct[:30]})")
        if r.status_code == 200 and "json" in ct:
            data = r.json()
            items_count = len(data.get("items", []))
            print(f"    Items: {items_count}")
        time.sleep(1)


if __name__ == "__main__":
    main()
