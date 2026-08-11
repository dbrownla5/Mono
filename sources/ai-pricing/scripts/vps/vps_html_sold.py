"""Check if we can detect SOLD items via HTML page + test rate limits."""
import os
import re
import sys
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


def parse_item_html(html_text):
    """Extract item status from HTML page."""
    result = {"can_buy": None, "is_closed": None, "item_closing_action": None}

    # Find JSON in script tags (escaped)
    for key in ["can_buy", "is_closed", "item_closing_action"]:
        # Escaped JSON format: \"key\":value or \"key\":\"value\"
        patterns = [
            rf'\\"{key}\\":(true|false|null)',  # boolean/null
            rf'\\"{key}\\":\\"([^"\\]*)\\"',  # string value
        ]
        for pat in patterns:
            m = re.search(pat, html_text)
            if m:
                val = m.group(1)
                if val == "true":
                    result[key] = True
                elif val == "false":
                    result[key] = False
                elif val == "null":
                    result[key] = None
                else:
                    result[key] = val
                break

    # Determine status
    if result["item_closing_action"] == "sold":
        return "sold"
    if result["is_closed"] is True:
        return "removed"
    if result["can_buy"] is True:
        return "active"
    if result["can_buy"] is False:
        return "removed"
    return "unknown"


def verify_html(item_id, cookie_str, domain="www.vinted.fr"):
    """Verify item status via HTML page."""
    url = f"https://{domain}/items/{item_id}"
    headers = {
        "User-Agent": FP["ua"],
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "fr-FR,fr;q=0.9",
        "Cookie": cookie_str,
    }
    t0 = time.time()
    try:
        resp = cffi_requests.get(
            url, headers=headers, impersonate=FP["impersonate"], timeout=15
        )
        elapsed = time.time() - t0
        if resp.status_code == 404:
            return "removed", 404, elapsed, len(resp.text)
        if resp.status_code == 429:
            return "unknown", 429, elapsed, 0
        if resp.status_code != 200:
            return "unknown", resp.status_code, elapsed, 0
        status = parse_item_html(resp.text)
        return status, 200, elapsed, len(resp.text)
    except Exception:
        return "error", 0, time.time() - t0, 0


def main():
    print("=" * 60)
    print("  HTML-BASED SOLD VERIFICATION TEST")
    print("=" * 60)

    cookies = get_session()
    cookie_str = "; ".join(f"{k}={v}" for k, v in cookies.items())
    print(f"Session: {len(cookies)} cookies")

    # Get fresh IDs from feed
    url = (
        "https://www.vinted.fr/api/v2/catalog/items"
        f"?page=1&per_page=20&time={int(time.time())}"
        "&search_text=Nike&order=newest_first"
    )
    resp = cffi_requests.get(
        url,
        headers={
            "Accept": "application/json",
            "User-Agent": FP["ua"],
            "Cookie": cookie_str,
        },
        impersonate=FP["impersonate"],
        timeout=10,
    )
    items = resp.json().get("items", [])
    fresh_ids = [str(it["id"]) for it in items]
    print(f"Fresh IDs: {len(fresh_ids)}")

    # Get DB IDs
    from sqlcipher3 import dbapi2 as sqlite3
    conn = sqlite3.connect("/REDACTED/REMOTE_DIR/data/db/market.db")
    conn.execute("PRAGMA key='ma_super_cle_de_32_caracteres!'")
    old_ids = [
        str(r[0])
        for r in conn.execute(
            "SELECT id FROM items WHERE status='active' ORDER BY last_seen_at ASC LIMIT 10"
        ).fetchall()
    ]
    conn.close()
    print(f"DB old IDs: {len(old_ids)}")

    # === Test 1: Verify fresh items via HTML ===
    print("\n--- Test 1: Fresh items via HTML (should be active) ---")
    for item_id in fresh_ids[:5]:
        status, http, elapsed, size = verify_html(item_id, cookie_str)
        print(f"  {item_id}: {status} (HTTP {http}, {elapsed:.2f}s, {size//1024}KB)")
        time.sleep(1.5)

    # === Test 2: Verify old DB items via HTML ===
    print("\n--- Test 2: Old DB items via HTML (probably sold/removed) ---")
    for item_id in old_ids[:5]:
        status, http, elapsed, size = verify_html(item_id, cookie_str)
        print(f"  {item_id}: {status} (HTTP {http}, {elapsed:.2f}s, {size//1024}KB)")
        time.sleep(1.5)

    # === Test 3: Rate limit test — 1s delay, 20 items ===
    print("\n--- Test 3: Rate limit — 1s delay, 20 fresh items ---")
    counts = {"active": 0, "sold": 0, "removed": 0, "unknown": 0, "error": 0, "http_429": 0}
    total_size = 0
    for i, item_id in enumerate(fresh_ids[:20]):
        status, http, elapsed, size = verify_html(item_id, cookie_str)
        counts[status] = counts.get(status, 0) + 1
        if http == 429:
            counts["http_429"] += 1
        total_size += size
        marker = "!" if http == 429 else "."
        sys.stdout.write(marker)
        sys.stdout.flush()
        if (i + 1) % 10 == 0:
            sys.stdout.write(f" [{i+1}/20]\n")
            sys.stdout.flush()
        if i < 19:
            time.sleep(1.0)

    print(f"\n  Results: {counts}")
    print(f"  Total bandwidth: {total_size // 1024}KB ({total_size // 1024 // 20}KB/item avg)")
    if counts["http_429"] == 0:
        print("  No 429!")
    else:
        print(f"  429 count: {counts['http_429']}")


if __name__ == "__main__":
    main()
