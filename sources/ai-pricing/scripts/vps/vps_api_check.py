"""Check different API approaches to access individual items on Vinted."""
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
    cookies = dict(resp.cookies)
    cookie_str = "; ".join(f"{k}={v}" for k, v in cookies.items())
    return cookies, cookie_str


def get_fresh_id(cookie_str):
    url = (
        "https://www.vinted.fr/api/v2/catalog/items"
        f"?page=1&per_page=5&time={int(time.time())}"
        "&search_text=Nike&order=newest_first"
    )
    headers = {
        "Accept": "application/json",
        "User-Agent": FP["ua"],
        "Referer": "https://www.vinted.fr/",
        "Cookie": cookie_str,
    }
    resp = cffi_requests.get(url, headers=headers, impersonate=FP["impersonate"], timeout=10)
    if resp.status_code == 200:
        data = resp.json()
        items = data.get("items") or data.get("catalog_items") or []
        if items:
            return str(items[0]["id"])
    return None


def main():
    print("Getting session...")
    cookies, cookie_str = get_session()
    print(f"Cookies: {list(cookies.keys())}")

    print("\nFetching fresh item from feed...")
    test_id = get_fresh_id(cookie_str)
    if not test_id:
        print("ERROR: No items in feed")
        return
    print(f"Test item: {test_id}")

    time.sleep(1)

    # === Test 1: HTML page ===
    print("\n=== Test 1: HTML page /items/{id} ===")
    url = f"https://www.vinted.fr/items/{test_id}"
    resp = cffi_requests.get(
        url,
        headers={"User-Agent": FP["ua"], "Accept": "text/html", "Cookie": cookie_str},
        impersonate=FP["impersonate"],
        timeout=10,
    )
    print(f"  HTTP {resp.status_code}, body length={len(resp.text)}")
    text = resp.text
    # Search for item data in HTML
    for pattern_name, pattern in [
        ("itemDto", r'"itemDto"\s*:\s*\{'),
        ("can_buy", r'"can_buy"\s*:\s*(true|false)'),
        ("is_closed", r'"is_closed"\s*:\s*(true|false)'),
        ("item_closing_action", r'"item_closing_action"\s*:\s*"(\w+)"'),
        ("status", r'"status"\s*:\s*"(\w+)"'),
    ]:
        m = re.search(pattern, text)
        if m:
            print(f"  Found {pattern_name}: {m.group(0)[:80]}")

    time.sleep(1)

    # === Test 2: API with different headers ===
    print("\n=== Test 2: API /api/v2/items/{id} with various headers ===")

    header_combos = [
        ("Basic JSON", {"Accept": "application/json", "User-Agent": FP["ua"], "Cookie": cookie_str}),
        ("With Referer", {
            "Accept": "application/json",
            "User-Agent": FP["ua"],
            "Cookie": cookie_str,
            "Referer": f"https://www.vinted.fr/items/{test_id}",
        }),
        ("XHR", {
            "Accept": "application/json, text/plain, */*",
            "User-Agent": FP["ua"],
            "Cookie": cookie_str,
            "Referer": f"https://www.vinted.fr/items/{test_id}",
            "X-Requested-With": "XMLHttpRequest",
        }),
        ("Accept-Language FR", {
            "Accept": "application/json",
            "Accept-Language": "fr-FR,fr;q=0.9",
            "User-Agent": FP["ua"],
            "Cookie": cookie_str,
            "Referer": f"https://www.vinted.fr/items/{test_id}",
        }),
    ]

    api_url = f"https://www.vinted.fr/api/v2/items/{test_id}"
    for name, headers in header_combos:
        resp = cffi_requests.get(
            api_url,
            headers=headers,
            impersonate=FP["impersonate"],
            timeout=10,
        )
        ct = resp.headers.get("content-type", "")
        is_json = "json" in ct
        print(f"  {name}: HTTP {resp.status_code} | CT={ct[:40]} | JSON={is_json}")
        if is_json and resp.status_code == 200:
            data = resp.json()
            item = data.get("item") or data
            print(f"    can_buy={item.get('can_buy')}, status={item.get('status')}")
        time.sleep(1)

    # === Test 3: Check if the issue is datadome ===
    print("\n=== Test 3: Response headers analysis ===")
    resp = cffi_requests.get(
        api_url,
        headers={
            "Accept": "application/json",
            "User-Agent": FP["ua"],
            "Cookie": cookie_str,
        },
        impersonate=FP["impersonate"],
        timeout=10,
    )
    print(f"  HTTP {resp.status_code}")
    for hdr in ["server", "x-datadome", "x-datadome-cid", "cf-ray", "set-cookie"]:
        val = resp.headers.get(hdr, "")
        if val:
            print(f"  {hdr}: {val[:100]}")


if __name__ == "__main__":
    main()
