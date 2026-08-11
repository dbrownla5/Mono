# Portfolio GitHub — assinscreedFC

> 57 repositories (20 privés, 37 publics) — Dernière mise à jour : mars 2026

---

## Projets phares

### 1. AI Pricing `Python` `Privé`
Bot de sniping Vinted avancé avec analyse de marché temps réel.
- **Scoring multi-critères** : prix (45%), condition (25%), popularité (18%), marque (12%)
- **Scraping stealth** : Scrapling (primary) + curl_cffi (fallback), bypass anti-bot
- **Base de données** : SQLite avec segmentation SOLD/ACTIVE, TTL 30 jours
- **Analyse marché** : tendances, liquidité, rareté, indice de confiance, prix d'achat recommandé
- **Notifications** : Discord embeds + Telegram albums (sendMediaGroup)
- **Stack** : Python, asyncio, Scrapling, SQLite, Discord/Telegram API

---

### 2. Bot Spécialisé `Python` `Privé`
Système Telegram en deux parties : gestion automatique de dossiers + shop de contenu.
- **UserBot Telethon** : tri automatique des conversations en temps réel
- **Shop** : vente de contenu avec paiements CryptoBot, Revolut, PayPal
- **Architecture** : deux process indépendants, DB partagée, admin bot (aiogram), FastAPI webhooks
- **Stack** : Python, Telethon, aiogram, FastAPI, SQLite, multi-gateway paiement

---

### 3. Trading Stratégie `Python` `Public`
Suite complète de trading crypto spot — multi-framework.
- **Frameworks** : Freqtrade, Hummingbot, scripts on-chain custom
- **Stratégies** : Grid Trading ATR, DCA dynamique RSI, Trend Following, Mean Reversion Bollinger
- **ML intégré** : XGBoost (FreqAI), LSTM neural network
- **Arbitrage** : spatial, triangulaire, market making DEX
- **Outils** : whale tracker, index rebalancer, dry_run par défaut

---

### 4. ViralCutter `Python` `Public`
Alternative open-source gratuite à Opus Clip — création de shorts viraux.
- **IA de coupe** : Gemini, GPT-4, LLM locaux (GGUF offline)
- **Transcription** : WhisperX avec légendes dynamiques style "Hormozi"
- **Vidéo** : face tracking split screen, format 9:16, traduction auto
- **Export** : XML Premiere Pro, GPU CUDA, WebUI Gradio
- **Stack** : Python, WhisperX, FFmpeg, Gradio, LLM APIs

---

### 5. Surebet Bot `Python` `Public`
Détection d'arbitrage sportif multi-bookmakers.
- **Sports** : Football, NBA, NFL, Tennis
- **Bookmakers** : Betclic, Winamax, Unibet, PMU, Pinnacle
- **Marchés** : H2H, Totals, Spreads
- **Features** : calculateur de mises, dashboard Streamlit, notifications Telegram
- **API** : The Odds API avec failover automatique entre clés

---

### 6. X Monitor Bot `Python` `Public`
Monitoring Twitter/X avec notifications Telegram temps réel.
- **Scraping sans API** : Playwright stealth + cookies (pas de clé API X requise)
- **Media** : extraction HD images/vidéos
- **Infra** : rotation de proxies, commandes admin Telegram, Docker + Xvfb
- **Stack** : Python, Playwright, Telegram Bot API, Docker

---

## Projets notables

### 7. OrthoLyse `Python` `Public`
Application desktop pour orthophonistes (santé/NLP).
- Transcription via **OpenAI Whisper**, analyse linguistique **Spacy** (MLU, morphèmes)
- Interface **PySide6/Qt**, enregistrement en direct, export PDF
- Modèles Spacy français

### 8. OCR Project `Python` `Public`
Pipeline OCR intelligent pour documents (factures, contrats).
- Détection auto PDF/Image, extraction texte
- Structuration JSON via **Mistral LLM**, export Markdown
- Processing async **FastAPI**, prototype moteur de recherche full-text

### 9. Scrapping Automatisation `Python` `Public`
Bot Telegram de scraping d'annonces (Leboncoin, etc.).
- Stats prix (min/max/moyenne/médiane), distribution marques, analyse géo
- Graphiques ASCII + PNG (matplotlib), export JSON/CSV
- Commandes : `/search`, `/stats`, `/chart`, `/filter`

---

## Projets IA / Académiques

### 10. UPC Projet IA L3 `Python` `Public`
Jeu Quoridor avec IA — projet universitaire L3.
- **Minimax + Alpha-Beta**, heuristiques BFS/Manhattan
- Interface Pygame, système de tournois (50+ parties)
- Data science : Pandas/Matplotlib pour analyse des résultats

### 11. Poker IA `Python` `Privé`
Poker en terminal (jusqu'à 6 joueurs) avec IA en développement.
- Monte Carlo Counterfactual Regret Minimization (MCCFR) planifié
- Lib Deuces pour évaluation des mains

### 12. Maze Escape `Python` `Privé`
Simulation d'évacuation de labyrinthe (temple d'Ayutthaya).
- Algorithmes **Dijkstra** et **A***
- Mode statique (obstacles fixes) + dynamique (propagation du feu)

---

## Autres projets

| Projet | Lang | Type | Description |
|--------|------|------|-------------|
| Mobile-LLM | TypeScript | Privé | LLM sur mobile |
| crypto-news-bot | Python | Privé | Veille crypto automatisée via Telegram |
| portfolio | TypeScript | Public | Site portfolio personnel |
| chess-try | Python | Privé | Expérimentation échecs (repo volumineux) |
| cses | Python | Public | Solutions CSES (competitive programming) |
| pygame_jeu_1 | Python | Public | Jeu Pygame |
| video_maker | Python | Privé | Création vidéo automatisée |

---

## Stack technique global

| Domaine | Technologies |
|---------|-------------|
| **Backend** | Python, FastAPI, asyncio, Telethon, aiogram |
| **Frontend** | TypeScript, React, Tailwind, shadcn-ui |
| **Data/ML** | XGBoost, LSTM, Spacy, Whisper, Mistral AI, Gemini |
| **Scraping** | Scrapling, Playwright, curl_cffi, BeautifulSoup |
| **DB** | SQLite, aiosqlite |
| **Infra** | Docker, GitHub Actions |
| **APIs** | Discord, Telegram, Vinted, Twitter/X, The Odds API |
| **Trading** | Freqtrade, Hummingbot, ccxt |

---

## Thèmes récurrents

1. **Bots & Automatisation** — Telegram bots, scraping, monitoring (7+ projets)
2. **Trading & Finance** — Crypto strategies, arbitrage sportif, analyse de marché
3. **IA & ML** — LLM integration, computer vision, NLP, game AI
4. **Création de contenu** — Vidéo virale automatisée, TikTok/Reels
5. **Projets académiques** — Algorithmes (A*, Minimax), structures de données, IA de jeux
