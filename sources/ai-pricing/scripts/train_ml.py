#!/usr/bin/env python3
"""Entraine le modele ML de prediction de vente rapide.

Usage (sur le VPS) :
    python -m scripts.train_ml
    python -m scripts.train_ml --days 60 --min-samples 50

Le modele est sauvegarde dans data/models/sell_predictor.joblib
et sera automatiquement charge par le bot au prochain demarrage.
"""

import argparse
import sys
from pathlib import Path

# Ajouter le root du projet au path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from src.core.storage.database import DatabaseManager
from src.core.scoring.ml import MLScorer
from src.core.config.loader import load_config


def main() -> None:
    parser = argparse.ArgumentParser(description="Train ML sell predictor")
    parser.add_argument("--days", type=int, default=30, help="Training window in days")
    parser.add_argument("--min-samples", type=int, default=100, help="Minimum samples to train")
    parser.add_argument("--db", type=str, default="data/db/market.db", help="Path to market.db")
    args = parser.parse_args()

    cfg = load_config()
    brand_scores = cfg.get("brand_scores") or {"default": 60}
    condition_scores = cfg.get("condition_scores") or {"default": 60}

    db = DatabaseManager(db_path=args.db)
    scorer = MLScorer(min_samples=args.min_samples)

    # Stats DB
    stats = db.get_stats()
    print(f"DB stats: {stats}")

    # Entrainement
    accuracy = scorer.train(
        db,
        brand_scores=brand_scores,
        condition_scores=condition_scores,
        train_days=args.days,
    )

    if accuracy is not None:
        print(f"Modele entraine. Accuracy: {accuracy:.2%}")
        fi = scorer.feature_importance()
        if fi:
            print("\nFeature importance:")
            for name, imp in sorted(fi.items(), key=lambda x: x[1], reverse=True):
                bar = "#" * int(imp * 50)
                print(f"  {name:25s} {imp:.4f} {bar}")
    else:
        print("Pas assez de donnees pour entrainer le modele.")
        print(f"  Min samples requis: {args.min_samples}")
        print(f"  Fenetre: {args.days} jours")

    db.close()


if __name__ == "__main__":
    main()
