"""Test SOLD verify sur le VPS — a uploader et executer sur le serveur."""
import os
import sys
import time
import random

# Setup
sys.path.insert(0, '/REDACTED/REMOTE_DIR')
os.chdir('/REDACTED/REMOTE_DIR')
from curl_cffi import requests as cffi_requests

FINGERPRINT_PROFILES = [
    {"name": "chrome120", "impersonate": "chrome120",
     "ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"},
    {"name": "chrome131", "impersonate": "chrome131",
     "ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"},
]

ALL_DOMAINS = [
    "www.vinted.fr", "www.vinted.de", "www.vinted.es",
    "www.vinted.it", "www.vinted.nl", "www.vinted.be",
]
DOMAIN_LANG = {
    "www.vinted.fr": "fr-FR,fr;q=0.9,en;q=0.8",
    "www.vinted.de": "de-DE,de;q=0.9,en;q=0.8",
    "www.vinted.es": "es-ES,es;q=0.9,en;q=0.8",
    "www.vinted.it": "it-IT,it;q=0.9,en;q=0.8",
    "www.vinted.nl": "nl-NL,nl;q=0.9,en;q=0.8",
    "www.vinted.be": "fr-BE,fr;q=0.9,nl;q=0.8,en;q=0.7",
}


def get_anon_cookies():
    """Get anonymous session cookies from Vinted."""
    fp = random.choice(FINGERPRINT_PROFILES)
    resp = cffi_requests.get("https://www.vinted.fr", headers={
        "User-Agent": fp["ua"], "Accept": "text/html",
    }, impersonate=fp["impersonate"], timeout=10)
    cookies = dict(resp.cookies)
    cookie_str = "; ".join(f"{k}={v}" for k, v in cookies.items())
    return cookies, cookie_str


def fetch_fresh_ids(cookie_str, count=50):
    """Fetch fresh item IDs from feed."""
    fp = random.choice(FINGERPRINT_PROFILES)
    url = (
        f"https://www.vinted.fr/api/v2/catalog/items"
        f"?page=1&per_page={count}"
        f"&time={int(time.time())}"
        f"&search_text=Nike+Dunk&order=newest_first"
    )
    headers = {
        "Accept": "application/json",
        "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
        "User-Agent": fp["ua"],
        "Referer": "https://www.vinted.fr/",
        "Cookie": cookie_str,
    }
    resp = cffi_requests.get(url, headers=headers, impersonate=fp["impersonate"], timeout=10)
    if resp.status_code == 200:
        data = resp.json()
        items = data.get("items") or data.get("catalog_items") or []
        return [str(it["id"]) for it in items]
    print(f"  Feed error: HTTP {resp.status_code}")
    return []


def get_db_ids():
    """Get old and recent IDs from DB."""
    from sqlcipher3 import dbapi2 as sqlite3
    conn = sqlite3.connect("/REDACTED/REMOTE_DIR/data/db/market.db")
    conn.execute("PRAGMA key='ma_super_cle_de_32_caracteres!'")
    old = [str(r[0]) for r in conn.execute(
        "SELECT id FROM items WHERE status='active' ORDER BY last_seen_at ASC LIMIT 20"
    ).fetchall()]
    recent = [str(r[0]) for r in conn.execute(
        "SELECT id FROM items WHERE status='active' ORDER BY last_seen_at DESC LIMIT 20"
    ).fetchall()]
    conn.close()
    return old, recent


def verify_one(item_id, domain, cookie_str):
    """Verify a single item — raw, no throttle."""
    fp = random.choice(FINGERPRINT_PROFILES)
    url = f"https://{domain}/api/v2/items/{item_id}"
    headers = {
        "Accept": "application/json",
        "Accept-Language": DOMAIN_LANG.get(domain, "fr-FR"),
        "User-Agent": fp["ua"],
        "Referer": f"https://{domain}/",
        "Cookie": cookie_str,
    }
    t0 = time.time()
    try:
        resp = cffi_requests.get(url, headers=headers, impersonate=fp["impersonate"], timeout=5)
        elapsed = time.time() - t0
        if resp.status_code == 404:
            return "removed", 404, elapsed
        if resp.status_code == 429:
            return "unknown", 429, elapsed
        if resp.status_code in (401, 403):
            return "unknown", resp.status_code, elapsed
        if resp.status_code >= 400:
            return "unknown", resp.status_code, elapsed
        data = resp.json()
        item = data.get("item") or data
        if item.get("item_closing_action") == "sold":
            return "sold", 200, elapsed
        if item.get("is_closed"):
            return "removed", 200, elapsed
        if item.get("can_buy") is True:
            return "active", 200, elapsed
        st = item.get("status")
        if st == "sold":
            return "sold", 200, elapsed
        if st in ("closed", "hidden"):
            return "removed", 200, elapsed
        return ("active" if st == "active" else "unknown"), 200, elapsed
    except Exception:
        return "error", 0, time.time() - t0


def run_pass(name, ids, delay, domains, cookie_str, max_n=20):
    """Run a test pass."""
    print(f"\n--- {name} ---")
    print(f"    delay={delay}s | {len(domains)} domain(s) | {min(len(ids), max_n)} items")
    counts = {"sold": 0, "active": 0, "removed": 0, "unknown": 0, "error": 0, "http_429": 0}
    first_429 = None
    test_ids = ids[:max_n]
    di = 0
    t_start = time.time()

    for i, iid in enumerate(test_ids):
        d = domains[di % len(domains)]
        di += 1
        status, http, elapsed = verify_one(iid, d, cookie_str)
        counts[status] = counts.get(status, 0) + 1
        if http == 429:
            counts["http_429"] += 1
            if first_429 is None:
                first_429 = i + 1
        marker = "!" if http == 429 else "." if status in ("sold", "active", "removed") else "?"
        sys.stdout.write(marker)
        sys.stdout.flush()
        if (i + 1) % 10 == 0:
            sys.stdout.write(f" [{i+1}/{len(test_ids)}]\n")
            sys.stdout.flush()
        if i < len(test_ids) - 1:
            time.sleep(delay)

    total_time = time.time() - t_start
    total = len(test_ids)
    success = total - counts["http_429"] - counts.get("error", 0)
    print()
    print(f"    sold={counts['sold']} active={counts['active']} removed={counts['removed']} unknown={counts['unknown']} 429={counts['http_429']}")
    print(f"    Success: {success}/{total} ({success/total*100:.0f}%) | Time: {total_time:.1f}s")
    if first_429:
        print(f"    First 429 at request #{first_429}")
    else:
        print("    No 429!")
    return counts


def main():
    print("=" * 60)
    print("  SOLD VERIFY — RATE LIMIT TEST")
    print("=" * 60)

    # Get cookies
    print("\n[1] Getting anonymous session...")
    cookies, cookie_str = get_anon_cookies()
    print(f"    Got {len(cookies)} cookies")

    # Get fresh IDs
    print("\n[2] Fetching fresh IDs from feed...")
    fresh_ids = fetch_fresh_ids(cookie_str)
    print(f"    Got {len(fresh_ids)} fresh IDs")

    # Get DB IDs
    print("\n[3] Getting DB IDs...")
    old_ids, recent_ids = get_db_ids()
    print(f"    Old: {len(old_ids)}, Recent: {len(recent_ids)}")

    # === PASS 1: Fresh IDs, 1s delay, single domain ===
    print("\n" + "=" * 60)
    print("  PASS 1: Fresh IDs, 1s delay, .fr only")
    print("=" * 60)
    run_pass("FRESH 1s .fr", fresh_ids, 1.0, ["www.vinted.fr"], cookie_str, 20)

    print("\n  [Cooldown 15s...]")
    time.sleep(15)

    # === PASS 2: Fresh IDs, 2s delay, 3 domains ===
    print("\n" + "=" * 60)
    print("  PASS 2: Fresh IDs, 2s delay, 3 domains rotation")
    print("=" * 60)
    run_pass("FRESH 2s 3dom", fresh_ids[20:], 2.0, ALL_DOMAINS[:3], cookie_str, 20)

    print("\n  [Cooldown 15s...]")
    time.sleep(15)

    # === PASS 3: DB old IDs ===
    print("\n" + "=" * 60)
    print("  PASS 3: DB old IDs (probably removed), 1s, .fr")
    print("=" * 60)
    run_pass("DB_OLD 1s .fr", old_ids, 1.0, ["www.vinted.fr"], cookie_str, 20)

    print("\n  [Cooldown 15s...]")
    time.sleep(15)

    # === PASS 4: DB recent IDs ===
    print("\n" + "=" * 60)
    print("  PASS 4: DB recent IDs, 1s, .fr")
    print("=" * 60)
    run_pass("DB_RECENT 1s .fr", recent_ids, 1.0, ["www.vinted.fr"], cookie_str, 20)

    print("\n  [Cooldown 15s...]")
    time.sleep(15)

    # === PASS 5: STRESS TEST 0.5s ===
    print("\n" + "=" * 60)
    print("  PASS 5: STRESS 0.5s — find rate limit threshold")
    print("=" * 60)
    stress_ids = fresh_ids[:40] if len(fresh_ids) >= 40 else fresh_ids + old_ids
    run_pass("STRESS 0.5s .fr", stress_ids, 0.5, ["www.vinted.fr"], cookie_str, 40)

    print("\n  [Cooldown 15s...]")
    time.sleep(15)

    # === PASS 6: STRESS TEST 0.5s with domain rotation ===
    print("\n" + "=" * 60)
    print("  PASS 6: STRESS 0.5s, 6 domains rotation")
    print("=" * 60)
    run_pass("STRESS 0.5s 6dom", stress_ids, 0.5, ALL_DOMAINS, cookie_str, 40)

    print("\n" + "=" * 60)
    print("  DONE")
    print("=" * 60)


if __name__ == "__main__":
    main()
