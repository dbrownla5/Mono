
import sys
import os

# Add src to path
sys.path.append(os.path.join(os.getcwd(), 'src'))

from core.database import DatabaseManager

def check_database():
    print("Checking database...")
    db = DatabaseManager()
    stats = db.get_stats()
    print("Database Stats:")
    print(stats)
    
    print("\nSample Active Item (if any):")
    active_items = db.get_items_by_status('active', days=1)
    if active_items:
        item = active_items[0]
        print(f"ID: {item.get('id')}")
        print(f"Title: {item.get('title')}")
        print(f"Price: {item.get('price')}")
        print(f"Raw JSON (snippet): {item.get('raw_json')[:200]}...")
    else:
        print("No active items found in the last 24h.")

if __name__ == "__main__":
    check_database()
