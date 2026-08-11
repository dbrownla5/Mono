**Read in [English](./README.md) / [Français](./README.fr.md)**

# AI Pricing

Marketplace intelligence engine for second-hand resale platforms. Scores listings against historical pricing, surfaces underpriced items, and ships alerts to Telegram or Discord. Built for second-hand resellers who refuse to refresh feeds by hand.

[![Python](https://img.shields.io/badge/Python-3.10%2B-3776ab?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![SQLite](https://img.shields.io/badge/SQLite-3-003b57?style=flat-square&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](./LICENSE)
[![CI](https://img.shields.io/badge/CI-pytest%20%2B%20ruff-success?style=flat-square)](.github/workflows/ci.yml)
[![Coverage](https://img.shields.io/badge/coverage-60%25%2B-yellowgreen?style=flat-square)](.github/workflows/ci.yml)

> AI Pricing turns a noisy marketplace into a short, ranked list of listings worth looking at. It does the boring scoring so you only see what is actually a deal.

## Table of Contents

1. [About](#about)
2. [Features](#features)
3. [How scoring works](#how-scoring-works)
4. [Architecture](#architecture)
5. [Prerequisites](#prerequisites)
6. [Installation](#installation)
7. [Configuration](#configuration)
8. [Quickstart](#quickstart)
9. [Usage](#usage)
10. [Development](#development)
11. [Tests](#tests)
12. [Roadmap](#roadmap)
13. [Contributing](#contributing)
14. [License](#license)
15. [Acknowledgments](#acknowledgments)
16. [Disclaimer](#disclaimer)
17. [Read the Story](#read-the-story)
18. [Live page](#live-page)

## About

Second-hand marketplaces like Vinted publish thousands of new listings per hour. Most of them are not deals, a few are mispriced, and the ones that matter disappear in minutes. AI Pricing watches the feed, scores each listing against a rolling history of comparable items, and pings you only when something crosses your threshold.

The scoring engine combines several signals: price percentile against the recent distribution of similar items (p20 / p50 / p80), brand and condition multipliers, popularity decay, and an optional ML model that predicts the probability of a 7-day sell-through, trained on local history. A `LeBonCoin` module independently monitors free items ("Je donne") with keyword matching.

**Built for:**

- Second-hand resellers and people building tools around resale
- Developers who want a working reference for marketplace data pipelines
- Data folks curious about percentile-based scoring on noisy retail data

## Features

- Continuous scanning of Vinted country domains with configurable cadence
- Multi-factor scoring: price percentile, brand hype, condition, popularity, geo-arbitrage
- Optional ML demand prediction, retrained every 24 hours on local history
- External pricing references (StockX, Vestiaire, eBay, Idealo) when API keys are provided
- Real-time alerts via Telegram (with photo media groups) or Discord (embed cards)
- Persistent price history in SQLite (encrypted via SQLCipher) for scoring and trend analysis
- Automatic SOLD detection and 30-day item expiration
- Rate limiting and resource guards (CPU, memory)
- LeBonCoin "Je donne" monitoring module with category and keyword filters

## How scoring works

For each new listing in a target category, the engine pulls recent comparable items from the local SQLite store and computes three price percentiles (configurable, defaults from `src/core/scoring/scorer.py`):

- `p20` aggressive deal threshold
- `p50` market median
- `p80` overpriced threshold

The score is a weighted sum across several dimensions, with default weights defined in `scorer.py`:

| Dimension | Default weight |
|---|---|
| Price percentile vs comparables | 30 |
| Brand multiplier | 15 |
| Condition multiplier | 15 |
| Freshness | 8 |
| Popularity (favourites, log-scaled) | 10 |
| Seller signals | 5 |
| Sell-through history | 10 |
| Deal bonus | 7 |

Condition multipliers cover the standard Vinted ladder (`Neuf avec étiquettes`, `Neuf`, `Très bon état`, `Bon état`, `Satisfaisant`).

On top of the heuristic score, an optional ML layer predicts the probability that an item sells within 7 days. The model is a `GradientBoostingClassifier` (scikit-learn) persisted with joblib in `data/models/sell_predictor_v2.joblib`. It uses two feature tiers:

- **Core** (always present): `price_eur`, `brand_score`, `condition_score`, `photo_count`, `seller_rating`, `seller_reviews`, `price_vs_brand_median`, `brand_liquidity`, `brand_sold_count`
- **Enriched** (added in higher tiers): `favourite_count`, `view_count`, `description_length`, `seller_item_count`, `is_promoted`, `original_price_ratio`

ML activation is progressive based on the number of SOLD samples in the local DB:

| Tier | SOLD samples | ML boost weight | Enriched features |
|---|---|---|---|
| off | < 200 | 0 | no |
| observe | 200+ | 0 (log only) | no |
| cautious | 500+ | 5 | no |
| standard | 1500+ | 8 | yes |
| full | 3000+ | 10 | yes |

The model retrains automatically every 24 hours. Listings above the configurable alert threshold (`scoring.alert_threshold` in `config/config.yaml`) are pushed to the alert queue.

## Architecture

```
+---------------------+     +---------------------+     +-------------------+
|  Vinted scanner     | --> |  Scoring engine     | --> |  Alert dispatcher |
|  (stealth HTTP)     |     |  (percentiles + ML) |     |  Telegram/Discord |
+---------------------+     +---------------------+     +-------------------+
         |                            |
         v                            v
+---------------------+     +---------------------+
|  SQLite history     |     |  External pricing   |
|  (SQLCipher)        |     |  (StockX, eBay...)  |
+---------------------+     +---------------------+
```

Key folders:

- `src/core/scoring/` percentile engine (`scorer.py`, `engine.py`), ML model (`ml.py`), market analyzer, sell-through cache
- `src/core/storage/` SQLite writer, scanner state, history queries
- `src/core/infrastructure/` HTTP client, geo helpers, rate limiting, resource guards
- `src/core/notifications/` Telegram and Discord dispatchers
- `tests/` pytest suite (30+ test modules)
- `config/config.yaml` brands, conditions, thresholds, country selection
- `main.py` Vinted scanner entry point
- `lbc_main.py` LeBonCoin "Je donne" entry point

## Prerequisites

- Python 3.10 or higher (CI runs on 3.12)
- A Vinted account (for session cookies; guest endpoints are limited)
- Telegram bot token, or Discord webhook URL, for alerts (optional but recommended)
- About 500 MB of disk for the SQLite history

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/assinscreedFC/ai-pricing.git
   cd ai-pricing
   ```

2. Create a virtual environment and install dependencies:

   ```bash
   python -m venv .venv
   .\.venv\Scripts\activate     # Windows
   source .venv/bin/activate     # macOS / Linux
   pip install -r requirements.txt
   ```

3. Copy the env template:

   ```bash
   cp .env.example .env
   ```

   Fill in `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`, or `DISCORD_WEBHOOK`, depending on the channel you want to use.

## Configuration

Configuration lives in two places:

- `.env` for secrets (tokens, webhooks, encryption key)
- `config/config.yaml` for scoring rules, brand multipliers, country selection, alert thresholds

Main env variables (see `.env.example`):

| Variable | Purpose |
|---|---|
| `AI_PRICING_CONFIG` | Optional path override for the YAML config file |
| `TELEGRAM_BOT_TOKEN` | Telegram bot token (alerts channel) |
| `TELEGRAM_CHAT_ID` | Chat or channel ID to send alerts to |
| `DISCORD_WEBHOOK` | Discord webhook URL (alternative alerts channel) |
| `DB_ENCRYPTION_KEY` | Key used to encrypt the SQLite history at rest |
| `DESTRUCT_ADMIN_ID` | Admin Telegram ID allowed to trigger the self-destruct command |
| `DESTRUCT_TOKEN` | Confirmation token for the self-destruct command |
| `SSH_PASSWORD` | Used by `deploy.bat` / `scripts/deploy/deploy_remote.py` only |

## Quickstart

```bash
python main.py
```

The scanner starts on the categories enabled in `config/config.yaml`. The first scan can take a few minutes while the price history bootstraps; expect alerts to start flowing after that.

## Usage

Typical loops:

- **Scanner loop** continuously polls enabled categories and writes new listings to SQLite.
- **Scoring loop** evaluates fresh listings and pushes anything above the threshold to the alert queue.
- **Alert dispatcher** rate-limits the queue and sends to Telegram or Discord.

Tweak the alert threshold in `config/config.yaml` (`scoring.alert_threshold`). Lower the value to receive more alerts, raise it to be more selective.

A separate LeBonCoin module can be launched independently:

```bash
python lbc_main.py
```

It watches "Je donne" listings with configurable categories and keywords.

## Development

```bash
# Install test and lint tooling (same as CI)
pip install pytest pytest-cov ruff

# Lint
ruff check .

# Run tests
pytest

# Run tests with coverage
pytest --cov --cov-report=term-missing
```

The codebase uses type hints across most public functions. Aim to keep modules under 400 lines and functions under 50 lines.

## Tests

CI runs on every push and pull request to `main` (see `.github/workflows/ci.yml`):

- Lint with `ruff check .`
- `pytest --cov --cov-report=term-missing --cov-fail-under=60`

The coverage gate is intentionally moderate because much of the network-facing code (stealth HTTP, marketplace scraping) is hard to test deterministically without recorded fixtures. Scoring logic, storage and infrastructure helpers carry higher per-module coverage.

## Roadmap

- More marketplace adapters (eBay full integration, Vestiaire, StockX)
- Web dashboard for history exploration and threshold tuning
- Multi-user mode with per-user alert channels
- Pluggable scoring strategies via config

Tracked in repo issues, not in this file.

## Contributing

Issues and pull requests are welcome. Please read [CONTRIBUTING.md](./CONTRIBUTING.md) (or [CONTRIBUTING.fr.md](./CONTRIBUTING.fr.md) in French) before opening a PR. For non-trivial changes, open an issue first to discuss the approach.

## License

MIT. See [LICENSE](./LICENSE).

## Acknowledgments

- [Scrapling](https://github.com/D4Vinci/Scrapling) for the stealth HTTP layer
- [curl_cffi](https://github.com/yifeikong/curl_cffi) for TLS fingerprinting fallback
- [SQLite](https://www.sqlite.org/) and [SQLCipher](https://www.zetetic.net/sqlcipher/) for storage
- [scikit-learn](https://scikit-learn.org/) for the gradient boosting model
- [aiogram](https://github.com/aiogram/aiogram) and [discord.py](https://github.com/Rapptz/discord.py) for the alert channels

## Compliance & ToS

This project scrapes Vinted and Leboncoin. Both platforms explicitly forbid automated scraping in their Terms of Service (Vinted CGU section "Utilisation prohibée", Leboncoin CGU article 3). Running this tool against them in production, without their prior written consent, exposes you to:

- Account suspension or permanent ban (your own Vinted/Leboncoin account).
- Civil action by the platform.
- Criminal exposure under the Computer Fraud and Abuse Act (US), the EU Directive 2013/40 on attacks against information systems, or local equivalents covering unauthorized access.

**Default behavior (safe):** the tool uses standard HTTP requests with an identifiable User-Agent (`ai-pricing/0.1 (research; +https://github.com/assinscreedFC/ai-pricing)`). Most marketplaces will block these requests within a few minutes. That is the intended outcome of the default mode.

**Opt-in bypass:** the `--allow-bypass` flag enables:

- `curl_cffi` TLS fingerprint impersonation (Chrome, Edge, Safari).
- Scrapling StealthyFetcher with Cloudflare Turnstile resolution.
- Fingerprint rotation on 401/403/429 responses.

```bash
# Default (no bypass, expect 403 from most marketplaces)
python main.py

# Opt-in bypass (your responsibility)
python main.py --allow-bypass
```

If you enable `--allow-bypass`, you accept full responsibility for the consequences. Use it only on your own marketplace accounts, for research, and with a reasonable inter-request delay (the default `poll_interval_seconds: 30` is the floor, not the target).

This project is provided "AS IS" without warranty of any kind. The maintainers disclaim all liability for accounts suspended, IPs banned, marketplace counter-claims, or any other downstream consequence of using this software. You are the operator. You hold the risk.

Also out of scope of these defaults:

- `robots.txt` is not verified at runtime in this version (planned v0.2). Verify it yourself before pointing the tool at a new domain.
- GDPR Article 6 applies as soon as you store seller identifiers in the SQLite database. Verify your lawful basis before sharing the database or processing seller PII.

This project is not affiliated with Vinted, Leboncoin, StockX, eBay or any marketplace named in this documentation.

## Read the Story

How the scoring engine was tuned, why percentiles beat fixed price ranges, and what the ML model actually adds:

https://solidscale.tech/insights/ai-pricing-vinted-intelligence-open-source

## Live page

Project page with screenshots and a non-technical summary:

https://solidscale.tech/labs/ia-pricing
