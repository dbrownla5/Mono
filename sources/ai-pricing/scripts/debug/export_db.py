"""
Export/lecture de market.db en local.
Usage:
    python export_db.py                          # Stats + 50 derniers articles
    python export_db.py --csv items.csv          # Export CSV complet
    python export_db.py --status sold --days 7   # Articles vendus 7 derniers jours
    python export_db.py --db /chemin/market.db   # DB spécifique
    python export_db.py --limit 200              # Plus de résultats
"""
import argparse
import csv
import sqlite3
import sys
import time


def main():
    parser = argparse.ArgumentParser(description="Lecture/export de market.db")
    parser.add_argument("--db", default="data/db/market.db", help="Chemin vers la DB")
    parser.add_argument("--csv", metavar="FILE", help="Export vers CSV")
    parser.add_argument("--status", choices=["active", "sold", "expired"], default=None)
    parser.add_argument("--days", type=int, default=30, help="Fenêtre temporelle (jours)")
    parser.add_argument("--limit", type=int, default=50, help="Nombre max de résultats")
    args = parser.parse_args()

    try:
        conn = sqlite3.connect(args.db)
        conn.row_factory = sqlite3.Row
    except Exception as e:
        print(f"Erreur ouverture DB {args.db}: {e}")
        sys.exit(1)

    # Stats générales
    total = conn.execute("SELECT COUNT(*) FROM items").fetchone()[0]
    stats = conn.execute("SELECT status, COUNT(*) as n FROM items GROUP BY status").fetchall()
    print(f"DB: {args.db}  |  Total: {total} articles")
    for row in stats:
        print(f"  {row['status']}: {row['n']}")

    # Requête filtrée
    cutoff = time.time() - args.days * 86400
    where = "WHERE created_at > ?"
    params: list = [cutoff]
    if args.status:
        where += " AND status = ?"
        params.append(args.status)

    rows = conn.execute(
        f"SELECT id, title, price, brand_title, condition_title, status, item_url, "
        f"datetime(first_seen_at, 'unixepoch') as first_seen, "
        f"datetime(status_changed_at, 'unixepoch') as status_changed "
        f"FROM items {where} ORDER BY first_seen_at DESC LIMIT ?",
        params + [args.limit]
    ).fetchall()

    if not rows:
        print("\nAucun article trouvé avec ces filtres.")
        return

    if args.csv:
        with open(args.csv, "w", newline="", encoding="utf-8") as f:
            w = csv.DictWriter(f, fieldnames=rows[0].keys())
            w.writeheader()
            w.writerows([dict(r) for r in rows])
        print(f"\nExporté {len(rows)} lignes → {args.csv}")
    else:
        print(f"\n--- {len(rows)} articles (--days {args.days}) ---")
        for r in rows:
            url = r["item_url"] or ""
            print(f"  [{r['status']:8}] {(r['title'] or '')[:40]:40} {r['price']:7.2f}€  {url}")


if __name__ == "__main__":
    main()
