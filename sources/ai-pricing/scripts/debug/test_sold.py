"""
Test détection articles vendus via verify_item_status().
Usage:
    python test_sold.py https://www.vinted.fr/items/8427687322-asics-gel-1130
    python test_sold.py 8427687322
"""
import sys
import re
from src.core.fetching.vinted import verify_item_status, load_cookies_from_file, set_session_cookies

COOKIE_FILE = "www.vinted.fr_cookies.txt"


def extract_id(arg: str) -> str:
    m = re.search(r'/items/(\d+)', arg)
    return m.group(1) if m else arg.strip()


def main():
    arg = sys.argv[1] if len(sys.argv) > 1 else ""
    if not arg:
        print("Usage: python test_sold.py <url_ou_id>")
        sys.exit(1)

    item_id = extract_id(arg)
    print(f"[test] item_id={item_id}")

    try:
        cookies = load_cookies_from_file(COOKIE_FILE)
        set_session_cookies(cookies)
        print(f"[test] {len(cookies)} cookies chargés")
    except Exception:
        print("[test] Pas de cookies — résultat peut être 'unknown'")

    result = verify_item_status(item_id)
    labels = {
        "sold":    "VENDU - détection OK",
        "removed": "SUPPRIMÉ (annonce retirée, pas vendu)",
        "active":  "ACTIF (toujours en vente)",
        "unknown": "INCONNU (HTML non parsé — cookies requis ?)",
    }
    print(f"[test] Résultat: {result} — {labels.get(result, result)}")


if __name__ == "__main__":
    main()
