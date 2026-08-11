**Lire en [English](./README.md) / [Français](./README.fr.md)**

# AI Pricing

Moteur d'intelligence marché pour les plateformes de revente d'occasion. Score les annonces contre l'historique de prix, fait remonter les sous-cotées, envoie des alertes sur Telegram ou Discord. Conçu pour les revendeurs d'occasion qui refusent de rafraîchir le feed à la main.

[![Python](https://img.shields.io/badge/Python-3.10%2B-3776ab?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![SQLite](https://img.shields.io/badge/SQLite-3-003b57?style=flat-square&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Licence: MIT](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](./LICENSE)
[![CI](https://img.shields.io/badge/CI-pytest%20%2B%20ruff-success?style=flat-square)](.github/workflows/ci.yml)
[![Couverture](https://img.shields.io/badge/coverage-60%25%2B-yellowgreen?style=flat-square)](.github/workflows/ci.yml)

> AI Pricing transforme une marketplace bruyante en liste courte et triée des annonces qui valent un regard. Il fait le scoring chiant pour que vous ne voyiez que ce qui est vraiment un bon plan.

## Table des matières

1. [À propos](#à-propos)
2. [Fonctionnalités](#fonctionnalités)
3. [Comment marche le scoring](#comment-marche-le-scoring)
4. [Architecture](#architecture)
5. [Prérequis](#prérequis)
6. [Installation](#installation)
7. [Configuration](#configuration)
8. [Démarrage rapide](#démarrage-rapide)
9. [Utilisation](#utilisation)
10. [Développement](#développement)
11. [Tests](#tests)
12. [Feuille de route](#feuille-de-route)
13. [Contribuer](#contribuer)
14. [Licence](#licence)
15. [Remerciements](#remerciements)
16. [Avertissement](#avertissement)
17. [Lire l'article](#lire-larticle)
18. [Page projet](#page-projet)

## À propos

Les marketplaces d'occasion comme Vinted publient des milliers de nouvelles annonces par heure. La plupart ne sont pas des bonnes affaires, quelques-unes sont mal cotées, et celles qui comptent disparaissent en quelques minutes. AI Pricing surveille le feed, score chaque annonce contre un historique glissant d'objets comparables, et vous ping uniquement quand quelque chose franchit votre seuil.

Le moteur de scoring combine plusieurs signaux : percentile de prix contre la distribution récente d'articles similaires (p20 / p50 / p80), multiplicateurs de marque et d'état, dégradation de popularité, et un modèle ML optionnel qui prédit la probabilité de vente à 7 jours, entraîné sur l'historique local. Un module `LeBonCoin` surveille indépendamment les annonces "Je donne" avec matching par mots-clés.

**Pour qui :**

- Revendeurs d'occasion et personnes qui construisent des outils autour de la revente
- Développeurs qui veulent une référence fonctionnelle de pipeline de données marketplace
- Profils data curieux du scoring par percentile sur des données retail bruitées

## Fonctionnalités

- Scan continu des domaines Vinted par pays avec cadence configurable
- Scoring multi-facteurs : percentile de prix, hype de marque, état, popularité, arbitrage géo
- Prédiction ML optionnelle de la demande, ré-entraînée toutes les 24 h sur l'historique local
- Références prix externes (StockX, Vestiaire, eBay, Idealo) si les clés API sont fournies
- Alertes temps réel via Telegram (media groups avec photos) ou Discord (embeds)
- Historique de prix persistant en SQLite (chiffré via SQLCipher) pour scoring et analyse de tendances
- Détection SOLD automatique et expiration à 30 jours
- Rate limiting et garde-fous ressources (CPU, mémoire)
- Module LeBonCoin "Je donne" avec filtres par catégorie et mots-clés

## Comment marche le scoring

Pour chaque nouvelle annonce dans une catégorie cible, le moteur récupère les comparables récents depuis le store SQLite local et calcule trois percentiles de prix (configurables, valeurs par défaut dans `src/core/scoring/scorer.py`) :

- `p20` seuil bon plan agressif
- `p50` médiane marché
- `p80` seuil surcoté

Le score est une somme pondérée sur plusieurs dimensions, avec ces poids par défaut définis dans `scorer.py` :

| Dimension | Poids par défaut |
|---|---|
| Percentile de prix vs comparables | 30 |
| Multiplicateur de marque | 15 |
| Multiplicateur d'état | 15 |
| Fraîcheur | 8 |
| Popularité (favoris, échelle log) | 10 |
| Signaux vendeur | 5 |
| Historique sell-through | 10 |
| Bonus deal | 7 |

Les multiplicateurs d'état couvrent la grille Vinted standard (`Neuf avec étiquettes`, `Neuf`, `Très bon état`, `Bon état`, `Satisfaisant`).

Par-dessus le score heuristique, une couche ML optionnelle prédit la probabilité qu'un article se vende sous 7 jours. Le modèle est un `GradientBoostingClassifier` (scikit-learn) persisté avec joblib dans `data/models/sell_predictor_v2.joblib`. Il utilise deux tiers de features :

- **Core** (toujours présentes) : `price_eur`, `brand_score`, `condition_score`, `photo_count`, `seller_rating`, `seller_reviews`, `price_vs_brand_median`, `brand_liquidity`, `brand_sold_count`
- **Enrichies** (ajoutées dans les tiers supérieurs) : `favourite_count`, `view_count`, `description_length`, `seller_item_count`, `is_promoted`, `original_price_ratio`

L'activation ML est progressive selon le nombre d'échantillons SOLD en base locale :

| Tier | Échantillons SOLD | Poids boost ML | Features enrichies |
|---|---|---|---|
| off | < 200 | 0 | non |
| observe | 200+ | 0 (log uniquement) | non |
| cautious | 500+ | 5 | non |
| standard | 1500+ | 8 | oui |
| full | 3000+ | 10 | oui |

Le modèle se ré-entraîne automatiquement toutes les 24 h. Les annonces au-dessus du seuil d'alerte configurable (`scoring.alert_threshold` dans `config/config.yaml`) sont poussées dans la queue d'alertes.

## Architecture

```
+---------------------+     +---------------------+     +-------------------+
|  Scanner Vinted     | --> |  Moteur scoring     | --> |  Dispatcher       |
|  (HTTP furtif)      |     |  (percentiles + ML) |     |  Telegram/Discord |
+---------------------+     +---------------------+     +-------------------+
         |                            |
         v                            v
+---------------------+     +---------------------+
|  Historique SQLite  |     |  Prix externes      |
|  (SQLCipher)        |     |  (StockX, eBay...)  |
+---------------------+     +---------------------+
```

Dossiers clés :

- `src/core/scoring/` moteur percentile (`scorer.py`, `engine.py`), modèle ML (`ml.py`), market analyzer, cache sell-through
- `src/core/storage/` writer SQLite, état scanner, requêtes d'historique
- `src/core/infrastructure/` client HTTP, helpers géo, rate limiting, garde-fous ressources
- `src/core/notifications/` dispatchers Telegram et Discord
- `tests/` suite pytest (plus de 30 modules de tests)
- `config/config.yaml` marques, états, seuils, sélection des pays
- `main.py` point d'entrée scanner Vinted
- `lbc_main.py` point d'entrée LeBonCoin "Je donne"

## Prérequis

- Python 3.10 ou plus récent (la CI tourne en 3.12)
- Un compte Vinted (pour les cookies de session ; les endpoints invité sont limités)
- Token de bot Telegram, ou URL de webhook Discord, pour les alertes (optionnel mais recommandé)
- Environ 500 Mo de disque pour l'historique SQLite

## Installation

1. Cloner le dépôt :

   ```bash
   git clone https://github.com/assinscreedFC/ai-pricing.git
   cd ai-pricing
   ```

2. Créer un environnement virtuel et installer les dépendances :

   ```bash
   python -m venv .venv
   .\.venv\Scripts\activate     # Windows
   source .venv/bin/activate     # macOS / Linux
   pip install -r requirements.txt
   ```

3. Copier le template d'environnement :

   ```bash
   cp .env.example .env
   ```

   Renseigner `TELEGRAM_BOT_TOKEN` et `TELEGRAM_CHAT_ID`, ou `DISCORD_WEBHOOK`, selon le canal voulu.

## Configuration

La config vit à deux endroits :

- `.env` pour les secrets (tokens, webhooks, clé de chiffrement)
- `config/config.yaml` pour les règles de scoring, multiplicateurs de marque, sélection des pays, seuils d'alerte

Principales variables d'environnement (voir `.env.example`) :

| Variable | Rôle |
|---|---|
| `AI_PRICING_CONFIG` | Override optionnel du chemin du fichier YAML |
| `TELEGRAM_BOT_TOKEN` | Token de bot Telegram (canal d'alertes) |
| `TELEGRAM_CHAT_ID` | ID de chat ou canal cible des alertes |
| `DISCORD_WEBHOOK` | URL de webhook Discord (canal d'alertes alternatif) |
| `DB_ENCRYPTION_KEY` | Clé utilisée pour chiffrer l'historique SQLite au repos |
| `DESTRUCT_ADMIN_ID` | ID Telegram admin autorisé à déclencher self-destruct |
| `DESTRUCT_TOKEN` | Token de confirmation pour la commande self-destruct |
| `SSH_PASSWORD` | Utilisé uniquement par `deploy.bat` / `scripts/deploy/deploy_remote.py` |

## Démarrage rapide

```bash
python main.py
```

Le scanner démarre sur les catégories actives dans `config/config.yaml`. Le premier scan peut prendre quelques minutes, le temps que l'historique de prix s'amorce ; les alertes commencent à tomber ensuite.

## Utilisation

Boucles typiques :

- **Boucle scanner** poll en continu les catégories actives et écrit les nouvelles annonces en SQLite.
- **Boucle scoring** évalue les annonces fraîches et pousse tout ce qui dépasse le seuil dans la queue d'alertes.
- **Dispatcher d'alertes** rate-limite la queue et envoie sur Telegram ou Discord.

Ajuster le seuil d'alerte dans `config/config.yaml` (`scoring.alert_threshold`). Baisser la valeur pour plus d'alertes, l'augmenter pour être plus sélectif.

Le module LeBonCoin se lance indépendamment :

```bash
python lbc_main.py
```

Il surveille les annonces "Je donne" avec catégories et mots-clés configurables.

## Développement

```bash
# Installer l'outillage de tests et de lint (identique à la CI)
pip install pytest pytest-cov ruff

# Lint
ruff check .

# Lancer les tests
pytest

# Lancer les tests avec couverture
pytest --cov --cov-report=term-missing
```

Le code utilise les type hints sur la plupart des fonctions publiques. Viser des modules sous 400 lignes et des fonctions sous 50 lignes.

## Tests

La CI tourne à chaque push et pull request sur `main` (voir `.github/workflows/ci.yml`) :

- Lint avec `ruff check .`
- `pytest --cov --cov-report=term-missing --cov-fail-under=60`

Le seuil de couverture est volontairement modéré parce qu'une bonne partie du code réseau (HTTP furtif, scraping marketplace) est difficile à tester de manière déterministe sans fixtures enregistrées. La logique de scoring, le storage et les helpers d'infra portent une couverture par module plus élevée.

## Feuille de route

- Plus d'adaptateurs marketplace (intégration eBay complète, Vestiaire, StockX)
- Dashboard web pour exploration de l'historique et tuning des seuils
- Mode multi-utilisateur avec canaux d'alertes par utilisateur
- Stratégies de scoring pluggables via config

Suivi dans les issues du repo, pas dans ce fichier.

## Contribuer

Issues et pull requests bienvenues. Merci de lire [CONTRIBUTING.fr.md](./CONTRIBUTING.fr.md) (ou [CONTRIBUTING.md](./CONTRIBUTING.md) en anglais) avant d'ouvrir une PR. Pour les changements non triviaux, ouvrir une issue d'abord pour discuter de l'approche.

## Licence

MIT. Voir [LICENSE](./LICENSE).

## Remerciements

- [Scrapling](https://github.com/D4Vinci/Scrapling) pour la couche HTTP furtive
- [curl_cffi](https://github.com/yifeikong/curl_cffi) pour le fallback TLS fingerprinting
- [SQLite](https://www.sqlite.org/) et [SQLCipher](https://www.zetetic.net/sqlcipher/) pour le stockage
- [scikit-learn](https://scikit-learn.org/) pour le modèle gradient boosting
- [aiogram](https://github.com/aiogram/aiogram) et [discord.py](https://github.com/Rapptz/discord.py) pour les canaux d'alertes

## Conformité et CGU

Ce projet scrape Vinted et Leboncoin. Les deux plateformes interdisent explicitement le scraping automatisé dans leurs CGU (Vinted CGU section "Utilisation prohibée", Leboncoin CGU article 3). Lancer cet outil contre elles en production, sans leur accord écrit préalable, vous expose à :

- La suspension ou le bannissement définitif de votre compte Vinted/Leboncoin.
- Une action civile de la plateforme.
- Une exposition pénale au titre du Computer Fraud and Abuse Act (US), de la Directive européenne 2013/40 sur les attaques contre les systèmes d'information, ou des équivalents locaux couvrant l'accès non autorisé.

**Comportement par défaut (sûr) :** l'outil utilise des requêtes HTTP standard avec un User-Agent identifiable (`ai-pricing/0.1 (research; +https://github.com/assinscreedFC/ai-pricing)`). La plupart des marketplaces bloqueront ces requêtes en quelques minutes. C'est le résultat attendu du mode par défaut.

**Bypass opt-in :** le flag `--allow-bypass` active :

- L'impersonation de fingerprint TLS via `curl_cffi` (Chrome, Edge, Safari).
- Scrapling StealthyFetcher avec résolution Cloudflare Turnstile.
- La rotation de fingerprint sur réponses 401/403/429.

```bash
# Par défaut (pas de bypass, prévoir des 403 sur la plupart des marketplaces)
python main.py

# Bypass opt-in (sous votre responsabilité)
python main.py --allow-bypass
```

Si vous activez `--allow-bypass`, vous acceptez l'entière responsabilité des conséquences. Ne l'utilisez que sur vos propres comptes marketplace, à des fins de recherche, avec un délai inter-requêtes raisonnable (la valeur par défaut `poll_interval_seconds: 30` est le plancher, pas la cible).

Ce projet est fourni "EN L'ÉTAT" sans aucune garantie. Les mainteneurs déclinent toute responsabilité pour les comptes suspendus, les IP bannies, les actions des marketplaces, ou toute autre conséquence en aval de l'utilisation de ce logiciel. C'est vous qui opérez. C'est vous qui portez le risque.

Hors scope également par défaut :

- `robots.txt` n'est pas vérifié au runtime dans cette version (prévu v0.2). Vérifiez-le vous-même avant de pointer l'outil vers un nouveau domaine.
- L'article 6 du RGPD s'applique dès que vous stockez des identifiants vendeurs dans la base SQLite. Vérifiez votre base légale avant de partager la base ou de traiter des PII vendeur.

Ce projet n'est affilié à Vinted, Leboncoin, StockX, eBay ou aucune marketplace mentionnée dans cette documentation.

## Lire l'article

Comment le moteur de scoring a été calibré, pourquoi les percentiles battent les fourchettes de prix fixes, et ce que le modèle ML apporte vraiment :

https://solidscale.tech/insights/ai-pricing-vinted-intelligence-open-source

## Page projet

Page projet avec captures et résumé non technique :

https://solidscale.tech/labs/ia-pricing
