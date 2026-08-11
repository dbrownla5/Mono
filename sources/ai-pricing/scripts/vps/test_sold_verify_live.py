"""
Test live de verification SOLD — mesure les limites reelles de l'API Vinted.

Usage: python tests/test_sold_verify_live.py [--pass 1|2|3|all] [--count N]

3 passes:
  Pass 1: delai 1s, domaine fixe (www.vinted.fr)
  Pass 2: delai 2s, rotation 3 domaines
  Pass 3: delai 5s, rotation 6 domaines
"""

import json
import os
import sys
import time
import logging
from pathlib import Path
from typing import Dict, List, Optional
from dataclasses import dataclass, field

# Setup path
ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
os.chdir(str(ROOT))

# Minimal logging
logging.basicConfig(level=logging.WARNING, format="%(levelname)s %(message)s")
logger = logging.getLogger("test_sold_verify")
logger.setLevel(logging.INFO)

# --- Load cookies ---
from src.core.fetching.vinted import (
    load_cookies_from_file,
    set_session_cookies,
    HAS_CURL_CFFI,
    FINGERPRINT_PROFILES,
    DOMAIN_LANG,
    DEFAULT_LANG,
    get_cookie_header,
)

if not HAS_CURL_CFFI:
    print("ERREUR: curl_cffi non installe")
    sys.exit(1)

from curl_cffi import requests as cffi_requests

COOKIE_FILE = ROOT / "www.vinted.fr_cookies.json"
if not COOKIE_FILE.exists():
    print(f"ERREUR: cookie file manquant: {COOKIE_FILE}")
    sys.exit(1)

cookies = load_cookies_from_file(str(COOKIE_FILE))
set_session_cookies(cookies)
print(f"Cookies charges: {len(cookies)} cookies")

# --- Sample IDs ---
SAMPLE_FILE = ROOT / "data" / "test_sample_ids.json"
if not SAMPLE_FILE.exists():
    print(f"ERREUR: sample IDs manquant: {SAMPLE_FILE}")
    sys.exit(1)

with open(SAMPLE_FILE) as f:
    sample_data = json.load(f)

ALL_DOMAINS = list(DOMAIN_LANG.keys())


@dataclass
class PassResult:
    name: str
    delay: float
    domains_used: List[str]
    total: int = 0
    results: Dict[str, int] = field(default_factory=lambda: {
        "sold": 0, "active": 0, "removed": 0, "unknown": 0,
        "http_429": 0, "http_401": 0, "http_403": 0, "http_404": 0, "http_other": 0,
        "error": 0,
    })
    first_429_at: Optional[int] = None  # request number of first 429
    response_times: List[float] = field(default_factory=list)
    elapsed_total: float = 0.0


def verify_raw(item_id: str, domain: str, timeout: float = 5.0) -> dict:
    """Verification brute sans throttle — retourne status + http_code + response_time."""
    import random
    fp = random.choice(FINGERPRINT_PROFILES)
    url = f"https://{domain}/api/v2/items/{item_id}"
    headers = {
        "Accept": "application/json",
        "Accept-Language": DOMAIN_LANG.get(domain, DEFAULT_LANG),
        "User-Agent": fp["ua"],
        "Referer": f"https://{domain}/",
    }
    cookie_header = get_cookie_header()
    if cookie_header:
        headers["Cookie"] = cookie_header

    t0 = time.time()
    try:
        resp = cffi_requests.get(url, headers=headers, impersonate=fp["impersonate"], timeout=timeout)
        elapsed = time.time() - t0

        if resp.status_code == 404:
            return {"status": "removed", "http": 404, "time": elapsed}
        if resp.status_code == 429:
            return {"status": "unknown", "http": 429, "time": elapsed}
        if resp.status_code == 401:
            return {"status": "unknown", "http": 401, "time": elapsed}
        if resp.status_code == 403:
            return {"status": "unknown", "http": 403, "time": elapsed}
        if resp.status_code >= 400:
            return {"status": "unknown", "http": resp.status_code, "time": elapsed}

        data = resp.json()
        item = data.get("item") or data
        if item.get("item_closing_action") == "sold":
            return {"status": "sold", "http": 200, "time": elapsed}
        if item.get("is_closed"):
            return {"status": "removed", "http": 200, "time": elapsed}
        if item.get("can_buy") is True:
            return {"status": "active", "http": 200, "time": elapsed}
        st = item.get("status")
        if st == "sold":
            return {"status": "sold", "http": 200, "time": elapsed}
        if st in ("closed", "hidden"):
            return {"status": "removed", "http": 200, "time": elapsed}
        return {"status": "active" if st == "active" else "unknown", "http": 200, "time": elapsed}

    except Exception as e:
        elapsed = time.time() - t0
        return {"status": "error", "http": 0, "time": elapsed, "error": str(e)}


def run_pass(
    name: str,
    item_ids: List[str],
    delay: float,
    domains: List[str],
    max_items: int = 50,
) -> PassResult:
    """Execute une passe de verification."""
    result = PassResult(name=name, delay=delay, domains_used=domains)
    items = item_ids[:max_items]
    result.total = len(items)

    print(f"\n{'='*60}")
    print(f"  {name}")
    print(f"  Delay: {delay}s | Domaines: {len(domains)} | Items: {len(items)}")
    print(f"{'='*60}")

    domain_idx = 0
    t_start = time.time()

    for i, item_id in enumerate(items):
        domain = domains[domain_idx % len(domains)]
        domain_idx += 1

        r = verify_raw(item_id, domain)
        status = r["status"]
        http_code = r["http"]

        # Track status
        if status in result.results:
            result.results[status] += 1

        # Track HTTP codes
        if http_code == 429:
            result.results["http_429"] += 1
            if result.first_429_at is None:
                result.first_429_at = i + 1
        elif http_code == 401:
            result.results["http_401"] += 1
        elif http_code == 403:
            result.results["http_403"] += 1
        elif http_code == 404:
            result.results["http_404"] += 1
        elif http_code >= 400:
            result.results["http_other"] += 1

        result.response_times.append(r["time"])

        # Progress
        marker = "!" if http_code == 429 else "." if status in ("sold", "active", "removed") else "?"
        sys.stdout.write(marker)
        sys.stdout.flush()

        # Log every 10
        if (i + 1) % 10 == 0:
            rate_429 = result.results["http_429"]
            sys.stdout.write(f" [{i+1}/{len(items)}] 429:{rate_429}\n")
            sys.stdout.flush()

        # Wait before next request
        if i < len(items) - 1:
            time.sleep(delay)

    result.elapsed_total = time.time() - t_start
    print()
    return result


def print_results(result: PassResult):
    """Affiche les resultats d'une passe."""
    print(f"\n--- Resultats: {result.name} ---")
    print(f"  Total requetes:  {result.total}")
    print(f"  Duree totale:    {result.elapsed_total:.1f}s")

    if result.response_times:
        avg_rt = sum(result.response_times) / len(result.response_times)
        print(f"  Temps moyen/req: {avg_rt:.3f}s")

    print("\n  Distribution status:")
    for k, v in result.results.items():
        if v > 0:
            pct = v / result.total * 100
            print(f"    {k:12s}: {v:4d} ({pct:5.1f}%)")

    if result.first_429_at:
        print(f"\n  Premier 429 a la requete #{result.first_429_at}")
    else:
        print("\n  Aucun 429!")

    rate_429 = result.results["http_429"]
    success_rate = (result.total - rate_429 - result.results["error"]) / result.total * 100
    print(f"  Taux de succes: {success_rate:.1f}%")


def main():
    import argparse
    parser = argparse.ArgumentParser(description="Test live verification SOLD")
    parser.add_argument("--pass", dest="pass_num", default="all", help="Pass: 1, 2, 3, ou all")
    parser.add_argument("--count", type=int, default=30, help="Items par passe (defaut 30)")
    args = parser.parse_args()

    # Mix: recent first (most likely active), then random, then old
    all_ids = sample_data["recent"] + sample_data["random"] + sample_data["old"]

    passes_to_run = []
    if args.pass_num in ("1", "all"):
        passes_to_run.append(("Pass 1: 1s fixe .fr", 1.0, ["www.vinted.fr"]))
    if args.pass_num in ("2", "all"):
        passes_to_run.append(("Pass 2: 2s rotation 3 dom", 2.0, ALL_DOMAINS[:3]))
    if args.pass_num in ("3", "all"):
        passes_to_run.append(("Pass 3: 5s rotation 6 dom", 5.0, ALL_DOMAINS[:6]))

    results = []
    for name, delay, domains in passes_to_run:
        r = run_pass(name, all_ids, delay, domains, max_items=args.count)
        print_results(r)
        results.append(r)

        # Cooldown entre passes
        if len(passes_to_run) > 1:
            print("\n  [Cooldown 30s entre passes...]")
            time.sleep(30)

    # Summary
    if len(results) > 1:
        print(f"\n{'='*60}")
        print("  RESUME COMPARATIF")
        print(f"{'='*60}")
        print(f"  {'Pass':35s} {'429s':>6s} {'Succes':>8s} {'1er 429':>8s}")
        for r in results:
            rate = (r.total - r.results["http_429"] - r.results["error"]) / r.total * 100
            first_429 = str(r.first_429_at) if r.first_429_at else "aucun"
            print(f"  {r.name:35s} {r.results['http_429']:>6d} {rate:>7.1f}% {first_429:>8s}")


if __name__ == "__main__":
    main()
