# Analyse Technique Complete — AI Pricing Bot

---

## Table des matieres

1. [Vue d'ensemble du bot](#1-vue-densemble)
2. [Pipeline de scoring heuristique](#2-pipeline-de-scoring-heuristique)
3. [Algorithme ML — GradientBoosting](#3-algorithme-ml)
4. [Market Analyzer — Analyse de marche](#4-market-analyzer)
5. [Pricing externe — Sources et routing](#5-pricing-externe)
6. [Geo-arbitrage — Arbitrage geographique](#6-geo-arbitrage)
7. [Critique globale et alternatives](#7-critique-globale-et-alternatives)

---

## 1. Vue d'ensemble

### Flow complet d'un cycle (toutes les ~30 secondes)

```
CYCLE (30s + jitter gaussien +/- 7s)
  |
  1. FETCH parallele (ThreadPoolExecutor, 4 workers)
  |   - Pour chaque niche x domaine (12 pays Vinted)
  |   - Scrapling (stealth, Playwright) ou curl_cffi (fallback)
  |   - Anti-bot : impersonation Chrome124, cookies Netscape, jitter
  |
  2. STOCKAGE DB systematique
  |   - Tous les items fetches → market.db (meme si pas d'alerte)
  |   - Fingerprint SHA256(seller+title+price+photos) pour detecter republications
  |   - Upsert batch optimise (pre-load IDs, commit unique)
  |
  3. PRE-FILTRES (dans cet ordre)
  |   - SeenStore : dedup FIFO 100k IDs
  |   - Prix bounds : min_price <= prix <= price_max
  |   - Texte + condition : mots bannis, conditions autorisees
  |   - Anti-fake : prix plancher par marque luxe
  |   - Filtre vendeur : penalite pro (>200 avis), exclusion optionnelle
  |
  4. SCORING (pour chaque item survivant)
  |   - PriceStats.update() → rolling window 600 prix/marque
  |   - Pricing externe (StockX, LBC, Vestiaire, eBay, Idealo) avec cache 6h
  |   - score_item() → score 0-100 (moyenne ponderee 6 composants)
  |   - ML boost optionnel : +/- 10 points selon P(vente rapide)
  |   - Geo-arbitrage : gain net cross-pays
  |
  5. DECISION
  |   - score >= buy_threshold → BUY (envoi immediat)
  |   - score >= review_threshold → REVIEW (accumule, top 5 en fin de cycle)
  |   - micro_min <= prix <= micro_max ET score >= micro_threshold → MICRO-DEAL
  |
  6. NOTIFICATION
  |   - Telegram (sendMediaGroup avec galerie photos)
  |   - Discord (embeds avec images)
  |   - Rate limit : max 5 alertes/minute
  |
  7. MAINTENANCE (periodique)
  |   - Detection SOLD : items disparus du feed → verification statut
  |   - Expiration 30j : items trop vieux → status='expired'
  |   - ML auto-train toutes les 24h
  |   - Refresh taux de change toutes les 6h
  |
  SLEEP → REPEAT
```

### Protection ressources VPS

Le `ResourceGuard` (src/core/resource_guard.py) lit `/proc/meminfo` et `os.getloadavg()` :

| Seuil | Condition | Action |
|-------|-----------|--------|
| RAM > 85% OU dispo < 200MB OU load > 2x cores | `ok_for_ml = False` | Skip ML train |
| RAM > 95% OU load > 3x cores | `ok_for_http = False` | Skip pricing externe |

Cela protege le VPS des pics de charge lors du training ML ou des requetes HTTP massives.

---

## 2. Pipeline de scoring heuristique

### Les 6 composants et leurs poids

| Composant | Poids | Plage | Ce qu'il mesure |
|-----------|-------|-------|-----------------|
| **Price** | 35 | 0-100 | Le prix est-il bon par rapport au marche ? |
| **Condition** | 18 | 0-100 | L'etat de l'article (neuf, tres bon, etc.) |
| **Popularity** | 13 | 0-100 | Combien de favoris (demande) ? |
| **Freshness** | 12 | 0-100 | Depuis combien de temps l'annonce est en ligne ? |
| **Seller** | 12 | 0-100 | Le vendeur est-il fiable ? |
| **Brand** | 10 | 0-100 | La marque est-elle recherchee ? |

**Formule finale :**
```
score = (35 * S_price + 18 * S_condition + 13 * S_popularity
         + 12 * S_freshness + 12 * S_seller + 10 * S_brand) / 100
```

### 2.1 Price Score (poids 35 — le plus important)

Le prix passe par un **systeme de tiers en cascade**. Le premier tier disponible est utilise :

**Tier 0a — Prix resale externe (StockX, LBC, Vestiaire, eBay) :**
```
ratio = prix_item / prix_resale_externe

ratio <= 0.65  →  100  (35%+ sous le marche)
0.65 - 0.85    →   80
0.85 - 1.05    →   50
1.05 - 1.25    →   20
> 1.25         →    0  (sur-evalue)
```

**Tier 0b — Prix retail (Idealo) :**
```
discount = 1 - (prix_item / prix_retail)

discount >= 60%  →  100
40-60%           →   80
20-40%           →   50
0-20%            →   25
< 0% (plus cher) →  10
```

**Tier 1 — Percentiles API Vinted** (si disponibles dans le feed)

**Tier 2 — Percentiles data-driven** (PriceStats rolling window, min 15 obs) :
```
prix <= P20        →  100  (tres bon prix)
P20 < prix <= P50  →  70-100  (interpolation lineaire)
P50 < prix <= P80  →  10-70   (interpolation lineaire)
prix > P80         →    0  (trop cher)
```

**Tier 3 — Fallback baselines** (sweetspot/price_max de la config niche)

**Ajustement confiance** : Si peu d'observations pour cette marque, le poids du prix est reduit :
```
< 10 obs   → prix * 0.40 (confiance faible, redistribue vers condition/brand)
10-24 obs  → prix * 0.70
>= 25 obs  → poids nominal
```

> **Pertinence : HAUTE.** Le prix est le facteur #1 de rentabilite en resell. Le systeme de tiers avec fallback est robuste — on utilise la meilleure donnee disponible.
>
> **Critique :** Les seuils (0.65, 0.85, 1.05, 1.25) sont arbitraires et identiques pour tous les types de produits. Un ratio de 0.85 pour un sneaker hype est mediocre, mais excellent pour un jean basique. Alternative : seuils adaptatifs par categorie/liquidite.

### 2.2 Condition Score (poids 18)

Lookup direct dans une table de mapping multilangue :

| Etat | Score |
|------|-------|
| Neuf avec etiquettes | 100 |
| Neuf | 95 |
| Tres bon etat | 85 |
| Bon etat | 70 |
| Satisfaisant | 55 |
| (inconnu) | 60 |

> **Pertinence : MOYENNE-HAUTE.** L'etat impacte directement le prix de revente. Un "Neuf avec etiquettes" se vend bien plus cher.
>
> **Critique :** Le score est binaire (lookup), il ne prend pas en compte le delta entre l'etat et le prix demande. Un article "Bon etat" a 30EUR peut etre mieux qu'un "Neuf" a 90EUR. Ce delta est partiellement capture par le price score, mais la synergie condition/prix n'est pas modelisee explicitement.

### 2.3 Popularity Score (poids 13)

```
popularity = min(100, log(1 + favoris) * 18)
```

Exemples :
```
0 favoris  →   0
1 favori   →  12.5
5 favoris  →  32.3
10 favoris →  43.2
50 favoris →  70.7
100 favoris → 83.1
500 favoris → 112 → cap a 100
```

> **Pertinence : MOYENNE.** Les favoris indiquent une demande, mais c'est aussi un signal de competition (plus de monde = prix monte aux encheres implicites). Un item avec 50 favoris est deja surveille par beaucoup d'acheteurs — la fenetre d'opportunite est peut-etre fermee.
>
> **Critique : La courbe log sature trop vite.** A 50 favoris on est deja a 70/100, a 500 c'est cap. La differentiation entre un item tres populaire et un phenomene viral disparait. La formule `log1p(fav) * 18` est un choix simple mais grossier.
>
> **Alternative :** Utiliser un score **en cloche** : faible a 0 favoris (pas de demande), maximum a 5-15 favoris (demande existante mais peu de competition), puis decroit au-dela de 30+ (trop de competition). Cela modelise mieux la realite du resell.

### 2.4 Freshness Score (poids 12)

Decay piecewise :
```
Age <= 5 min      →  100    (tres frais)
5 - 30 min        →  70-100  (decay -1.2/min)
30 min - 2h       →  20-70   (decay -0.56/min)
2h - 4h           →  10-20   (decay lent)
> 4h              →    5     (quasi mort)
```

> **Pertinence : HAUTE pour le resell rapide.** Les meilleures affaires partent en minutes. Etre le premier a voir un item sous-evalue est crucial.
>
> **Critique : Le decay est trop agressif.** A 2h un item a deja perdu 80% de son score freshness. Pour des articles de niche (vintage, luxe), un item peut rester une bonne affaire pendant des jours. Le decay devrait etre parametrable par niche.
>
> **Alternative :** Decay exponentiel configurable par niche : `score = 100 * exp(-lambda * age_minutes)` ou `lambda` depend de la liquidite de la niche. Niche hype (sneakers) : lambda=0.05 (fast decay). Niche luxe : lambda=0.005 (slow decay).

### 2.5 Seller Score (poids 12)

```
trust = (rating / 5.0) * min(1.0, reviews / 50)
base_score = trust * 100

# Penalite vendeur pro (>200 avis)
if reviews >= 200:
    excess = reviews - 200
    penalty = min(40, excess * 0.1)
    score = max(10, base_score - penalty)
```

Exemples :
```
Rating 5.0, 100 avis  →  100
Rating 4.5, 30 avis   →  54  (30/50 = 0.6 volume factor)
Rating 4.0, 200 avis  →  80
Rating 4.0, 600 avis  →  80 - 40 = 40  (penalite pro max)
Rating 3.0, 5 avis    →   6  (vendeur douteux)
```

> **Pertinence : MOYENNE.** Un bon vendeur = transaction plus sure, mais le score vendeur n'impacte pas directement la rentabilite du resell.
>
> **Critique :** La penalite pro est un bon concept (les pros vendent au prix marche, pas de bonnes affaires). Mais le seuil de 200 avis est arbitraire. Certains particuliers actifs ont 200+ avis, certains pros ont des comptes avec 50 avis.
>
> **Alternative :** Utiliser des signaux plus fiables : `is_pro_account` flag (si disponible dans l'API), ratio items_en_vente/items_vendus (un pro a beaucoup d'items actifs simultanement), et anciennete du compte.

### 2.6 Brand Score (poids 10)

Lookup statique dans config.yaml :
```yaml
Jordan: 87,  Nike: 86,  Adidas: 85
New Balance: 83,  Puma: 78
...
Shein: 35,  Boohoo: 40
default: 60
```

> **Pertinence : FAIBLE-MOYENNE.** La marque determine le marche cible, mais un score statique ne capture pas les tendances (New Balance etait a 60 en 2020, 85 en 2024). Et surtout, la marque est deja implicitement encodee dans le prix et la popularite.
>
> **Critique : Le brand score cree un biais de confirmation.** Si Nike a un score de 86, tous les articles Nike recoivent +8.6 points bonus meme si cet article Nike specifique est invendable. Le probleme n'est pas la marque mais le modele specifique (Nike Dunk Low vs Nike Tanjun).
>
> **Alternative :** Supprimer le brand score statique et le remplacer par un **brand_liquidity_score** dynamique calcule depuis market.db : `sold_count / (sold_count + active_count)` par marque. Cela mesure la vitesse de vente reelle, pas une perception subjective.

---

## 3. Algorithme ML — GradientBoosting

### 3.1 Le modele

**Type :** `GradientBoostingClassifier` de scikit-learn

**Hyperparametres :**
```python
n_estimators = 100    # (50 si RAM < 300MB)
max_depth = 4         # (3 si RAM < 300MB)
learning_rate = 0.1
min_samples_split = 5
min_samples_leaf = 3
```

**Cible :** Classification binaire `sold_within_7d`
- `1` = item vendu en moins de 7 jours
- `0` = item non vendu en 7 jours (ou encore actif depuis > 14 jours)

### 3.2 Les 11 features

| # | Feature | Source training | Source inference | Probleme |
|---|---------|----------------|------------------|----------|
| 0 | `price_eur` | DB | Item live | OK |
| 1 | `brand_score` | Config lookup | Config lookup | OK |
| 2 | `condition_score` | Config lookup | Config lookup | OK |
| 3 | `freshness_minutes` | DB (first_seen → now) | Item live | OK mais semantique differente |
| 4 | `popularity` | **HARDCODE 0.0** | Item live (favoris) | GAP TRAIN/INFERENCE |
| 5 | `seller_score` | DB (rating * reviews) | Item live | OK |
| 6 | `n_obs` | **HARDCODE 0.0** | PriceStats count | GAP TRAIN/INFERENCE |
| 7 | `price_vs_p50_ratio` | **HARDCODE 0.0** | price / P50 | GAP TRAIN/INFERENCE |
| 8 | `ext_resale_ratio` | **HARDCODE 0.0** | price / ext_resale | GAP TRAIN/INFERENCE |
| 9 | `geo_spread` | **HARDCODE 0.0** | GeoArbitrage spread | GAP TRAIN/INFERENCE |
| 10 | `liquidity_index` | **HARDCODE 0.0** | MarketAnalyzer | GAP TRAIN/INFERENCE |

### 3.3 Labelling

```
Items SOLD (market.db, status='sold') :
  - duration = status_changed_at - first_seen_at
  - Si duration < 7 jours → label = 1 (vente rapide)
  - Si duration >= 7 jours → label = 0 (vente lente)

Items ACTIVE (market.db, status='active') :
  - Si actif depuis > 14 jours → label = 0 (presume invendu)
  - Si actif depuis < 14 jours → IGNORE (statut inconnu)
```

### 3.4 Training pipeline

```
1. Extraire items SOLD + ACTIVE des 30 derniers jours
2. Appliquer labelling (ci-dessus)
3. Feature engineering (11 features, 6 a 0.0)
4. Verifier : min 100 samples, min 10 positifs ET 10 negatifs
5. Sampling dynamique base sur la RAM disponible (max 500k)
6. Cross-validation (min(5, n_pos, n_neg) folds)
7. Si accuracy > 55% → sauvegarder le modele (.joblib)
8. Log feature importance top 3
```

### 3.5 Integration dans le scoring

```python
# Apres le score heuristique (0-100)
ml_adjustment = (ml_probability - 0.5) * 2 * boost_weight
# boost_weight = 10 par defaut

# Exemples :
# P(vente) = 0.80 → ajustement = +6 points
# P(vente) = 0.50 → ajustement = 0
# P(vente) = 0.20 → ajustement = -6 points

score_final = clamp(0, 100, score_heuristique + ml_adjustment)
```

### 3.6 Pertinence — Est-ce que ca marche ?

**Reponse courte : Pas encore, et voici pourquoi.**

**Probleme #1 : Gap train/inference (CRITIQUE)**
6 des 11 features sont a 0.0 pendant l'entrainement car non disponibles en DB. Le modele apprend donc **uniquement** sur 5 features : `price_eur`, `brand_score`, `condition_score`, `freshness_minutes`, `seller_score`.

Consequences :
- En inference, les features 4-10 sont alimentees avec des vraies valeurs, mais le modele n'a jamais appris leurs correlations avec la cible
- Le modele les ignore effectivement (feature_importance ~0 pour ces features)
- On perd tout le potentiel de `popularity`, `price_vs_p50_ratio`, `liquidity_index`

**Probleme #2 : Accuracy comme seule metrique**
L'accuracy est trompeuse quand les classes sont desequilibrees. Si 80% des items ne se vendent pas en 7j, un modele qui predit toujours "0" a 80% d'accuracy.

Le seuil de 55% est tres bas — a peine mieux que le hasard.

**Probleme #3 : Pas de stratification cross-val**
`cross_val_score(cv=n_folds)` utilise `KFold` (non stratifie). Si les classes sont desequilibrees, certains folds peuvent ne contenir aucun positif → metrique non fiable.

**Probleme #4 : Label bias**
Les items actifs < 14j sont ignores (statut inconnu). Mais les items actifs > 14j sont tous labelles 0. Cela biaise le modele vers les items "anciens et invendus" comme exemples negatifs, ignorant les items recents qui ne se vendront pas.

**Probleme #5 : `freshness_minutes` semantiquement different**
A l'entrainement, freshness = age depuis first_seen (jours/semaines). En inference, freshness = age depuis publication (minutes). Le modele apprend que "vieil item = pas vendu" ce qui est une tautologie, pas un signal predictif.

### 3.7 Peut-on faire mieux ?

**Oui, significativement. Voici comment :**

#### A. Enrichir les donnees en DB (impact : ENORME)

Stocker `favourite_count`, `seller_rating`, `seller_reviews`, `photo_count`, `description_length` dans market.db a chaque upsert. Cela permet au modele d'apprendre sur les vraies features au lieu de 0.0.

**Effort : moyen** (modifier upsert + schema, backfill impossible sur l'existant).

#### B. Utiliser AUC-ROC + F1 au lieu d'accuracy (impact : MOYEN)

```python
# Remplacer :
scores = cross_val_score(model, X, y, cv=n_folds, scoring='accuracy')

# Par :
from sklearn.model_selection import StratifiedKFold
skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
scores_auc = cross_val_score(model, X, y, cv=skf, scoring='roc_auc')
scores_f1 = cross_val_score(model, X, y, cv=skf, scoring='f1')
```

AUC-ROC mesure la capacite du modele a **classer** correctement (pas juste a predire la classe majoritaire). F1 equilibre precision et recall.

**Seuil de qualite recommande :** AUC > 0.60 (au lieu d'accuracy > 0.55).

#### C. LightGBM au lieu de GradientBoosting (impact : MOYEN)

```
GradientBoosting (sklearn)     → LightGBM
- Training lent                → 5-10x plus rapide
- Consomme plus de RAM         → ~50% moins de RAM
- Pas de gestion native NaN    → Gere les NaN nativement
- max 100 estimators (VPS)     → 200+ confortablement
```

LightGBM gere nativement les valeurs manquantes (NaN). Au lieu de hardcoder 0.0 pour les features indisponibles, on peut mettre NaN et laisser LightGBM decider du meilleur split. C'est une victoire immediate sans modifier la DB.

**Effort : faible** (remplacer le classifier, ajuster hyperparams).

#### D. Calibration des probabilites (impact : MOYEN)

```python
from sklearn.calibration import CalibratedClassifierCV
calibrated = CalibratedClassifierCV(model, cv=5, method='isotonic')
calibrated.fit(X, y)
```

Sans calibration, `predict_proba(X) = 0.7` ne signifie pas "70% de chance". Avec un GradientBoosting non calibre, les probabilites sont souvent trop confiantes ou pas assez. La calibration corrige ca.

Important car le ML boost est lineaire en `(prob - 0.5)` — des probas mal calibrees = des ajustements incorrects.

#### E. Features temporelles (impact : HAUT)

Ajouter des features que le modele n'a pas :
```
- jour_semaine (0-6) : les ventes varient par jour (weekend vs semaine)
- heure_publication (0-23) : les annonces du soir ont plus de visibilite
- saison (0-3) : la mode est saisonniere
- jours_depuis_dernier_sold_meme_brand : liquidite recente
```

Ces features sont disponibles depuis `first_seen_at` en DB, zero cout supplementaire.

#### F. Alternative radicale : pas de ML du tout

Avec seulement 6 SOLD detectes sur 136k items, le ML n'a pas assez de donnees pour apprendre quoi que ce soit de significatif. Il faut d'abord :

1. **Accumuler des donnees SOLD** pendant 2-4 semaines avec le bot actif
2. **Ameliorer la detection SOLD** (scan plus frequent, verification API)
3. **Atteindre 200+ SOLD** avant de meme envisager le ML

En attendant, le scoring heuristique (sans ML) est plus fiable et ne risque pas de degrader les decisions avec des predictions aleatoires.

---

## 4. Market Analyzer

### 4.1 Time-decay weighted median

**Principe :** Les prix recents comptent plus que les anciens.

```
poids = e^(-lambda * age_seconds)
lambda = ln(2) / (7 jours en secondes)
```

Apres 7 jours, un prix a 50% de poids. Apres 14 jours, 25%. Apres 30 jours, ~6%.

**Combine avec seller_confidence :**
```
seller_confidence = (rating / 5) * min(1, reviews / 10)
poids_final = time_decay * seller_confidence
```

> **Pertinence : HAUTE.** La mediane ponderee par le temps est bien meilleure qu'une mediane simple. Les prix du marche evoluent, surtout en mode/sneakers (tendances, saisons, drops).
>
> **Critique :** Le seuil seller_confidence de 10 avis est tres bas. Un vendeur avec 3 avis et rating 5.0 a un poids de 0.3 — c'est beaucoup pour un profil potentiellement faux. En revanche, la combinaison multiplicative est elegante.

### 4.2 Hope Gap (ecart actif vs vendu)

```
hope_gap = (median_active - median_sold) / median_sold * 100
```

| Ecart | Interpretation |
|-------|---------------|
| > 20% | SUREVALUE — les vendeurs demandent trop |
| 10-20% | Legere surevaluation |
| -10% a +10% | Prix marche coherent |
| < -10% | SOUS-EVALUE — opportunites |

> **Pertinence : HAUTE.** C'est une metrique classique en finance (bid-ask spread). Un grand hope gap = les vendeurs sont gourmands, il faut negocier ou attendre.
>
> **Critique :** La metrique ne prend pas en compte le volume. Un hope gap de -15% avec 3 items vendus n'est pas fiable. La confiance devrait moduler l'interpretation.

### 4.3 Tendances 7j vs 30j

```
trend = (median_7j - median_30j) / median_30j * 100

> +5%  → hausse
< -5%  → baisse
sinon  → stable
```

> **Pertinence : MOYENNE.** Utile pour detecter les tendances saisonnieres ou les drops. Mais 7 jours de mediane sur peu de ventes est tres bruite.
>
> **Critique :** Le seuil de +/-5% est trop serré pour des petits echantillons. Avec 5 ventes sur 7j, une seule vente a prix eleve peut faire basculer la tendance. Utiliser un test statistique (Mann-Whitney U) serait plus robuste.

### 4.4 Recommended Buy Price

```
prix_recommande = median_sold * (1 - marge_cible) - frais_fixes
```

Avec marge_cible = 20% et frais_fixes = 2 EUR :
```
median_sold = 100 EUR → prix_recommande = 100 * 0.80 - 2 = 78 EUR
```

> **Pertinence : HAUTE.** C'est la metrique la plus actionnable du bot — elle dit "n'achete pas au-dessus de X EUR".
>
> **Critique :** La marge de 20% est un defaut raisonnable mais ne prend pas en compte les frais Vinted (5% + 0.70 EUR), les frais d'expedition, ni le temps investi. La vraie formule devrait etre :
> ```
> prix_max = median_sold * (1 - marge) - frais_vinted - frais_expedition - frais_fixes
> ```

---

## 5. Pricing externe

### 5.1 Architecture de routing

```
get_prices(search_text, brand)
  |
  ├─ 1. StockX (toujours en premier)
  |     → Sneakers premium, resale authentifie
  |
  ├─ 2. Si brand in luxury_brands :
  |     └─ Vestiaire Collective
  |     Sinon :
  |     └─ Leboncoin
  |
  ├─ 3. Si toujours pas de prix resale :
  |     └─ eBay (fallback universel)
  |
  ├─ 4. Cross-fallback (source non essayee)
  |
  └─ 5. Idealo (retail, toujours)
```

### 5.2 Sources et leur pertinence en France

| Source | Type | Pertinence FR | Forces | Faiblesses |
|--------|------|--------------|--------|-----------|
| **StockX** | Resale auth. | HAUTE (sneakers) | Prix verifies, authentification | Limite aux sneakers/streetwear |
| **Leboncoin** | Resale FR | HAUTE (generaliste) | Reference #1 en France | API instable, anti-bot agressif |
| **Vestiaire Collective** | Resale luxe | HAUTE (luxe) | Reference luxe occasion | Limité au luxe, prix eleves |
| **eBay** | Resale intl. | FAIBLE (France) | Large catalogue | Peu utilise en FR pour la mode |
| **Idealo** | Retail neuf | MOYENNE | Prix neuf de reference | Pas de prix occasion |

> **Critique du routing :** Le routing est bon mais **StockX en premier pour tout** est sous-optimal. Pour un sac Hermes, StockX n'a rien — on perd du temps et un appel API avant de fallback sur Vestiaire. Le routing devrait verifier la categorie avant de tenter StockX (sneakers/streetwear uniquement).

### 5.3 Cache

Toutes les sources partagent un cache SQLite avec TTL 6h.

```
Cle : (search_text, source_name)
Valeur : prix_eur (nullable — les echecs sont aussi caches)
```

> **Pertinence du cache :** HAUTE. Sans cache, chaque cycle (30s) ferait des dizaines de requetes HTTP → ban IP immediat. Le TTL de 6h est un bon compromis entre fraicheur et economie de requetes.
>
> **Critique :** Le cache ne distingue pas "source down" (retry dans 30min) de "pas de resultats" (retry dans 6h). Un echec temporaire de Leboncoin bloque les lookups pendant 6h.

---

## 6. Geo-arbitrage

### 6.1 Principe

Comparer le prix d'un item dans son pays d'origine avec la mediane des prix dans d'autres pays Vinted.

```
item : Nike Dunk Low a 70 EUR sur vinted.fr
median DE : 95 EUR (vinted.de)
frais port FR→DE : 10 EUR
gain net = 95 - 70 - 10 = 15 EUR (+21%)
```

### 6.2 Implementation

- 20 domaines Vinted mappes (FR, DE, BE, ES, IT, PL, GB, NL, PT, AT, CZ, LU, LT, SE, DK, FI, HU, RO, SK)
- FIFO cap : 200 observations par (marque, pays)
- Seuil minimum : 3 observations par pays + gain net >= 5 EUR
- Thread-safe (Lock)
- Pre-seed depuis market.db au demarrage

### 6.3 Pertinence

> **Pertinence : MOYENNE-HAUTE.** L'arbitrage geographique est un vrai levier de profit. Les ecarts de prix existent (sneakers moins chers en PL/CZ qu'en FR/DE, luxe moins cher en IT/ES qu'en FR).
>
> **Critique :**
> - Les frais de port sont **statiques** (estimation). En realite ils varient par poids/taille/transporteur.
> - La mediane sur 3 observations est tres bruitee. Il faudrait au minimum 10 obs pour un signal fiable.
> - Pas de prise en compte des **differences de taille** (les tailles IT != tailles FR, ce qui affecte le prix).
> - Le bot ne peut pas acheter automatiquement sur un autre domaine — c'est du signalement uniquement.

---

## 7. Critique globale et alternatives

### Ce qui marche bien

1. **Architecture de tiers pour le prix** — cascader depuis la meilleure source disponible est robuste
2. **Cache 6h partagee** — evite le ban et economise les appels
3. **Time-decay weighted median** — capture bien l'evolution des prix
4. **Hope gap** — metrique actionnable pour les decisions d'achat
5. **Pre-filtres avant scoring** — economise du CPU en eliminant les items non pertinents
6. **ResourceGuard** — protege le VPS contre les pics de charge
7. **Detection SOLD par fingerprint** — les republications sont detectees

### Ce qui est faible

| Probleme | Severite | Impact |
|----------|----------|--------|
| ML : 6/11 features a 0.0 au training | CRITIQUE | Le modele n'apprend que sur 5 features |
| ML : trop peu de donnees SOLD | CRITIQUE | Modele non fiable < 200 SOLD |
| Popularity : courbe log saturee | MOYEN | Pas de differentiation au-dela de 50 favoris |
| Brand score : statique | MOYEN | Ne capture pas les tendances |
| Freshness : decay trop agressif | MOYEN | Penalise les niches slow-moving |
| Geo : 3 obs minimum trop bas | FAIBLE | Signaux bruite sur petits echantillons |
| Cache : pas de distinction erreur/vide | FAIBLE | Requetes bloquees 6h apres un timeout |

### Priorite des ameliorations

**Court terme (impact immediat, effort faible) :**

1. **Enrichir la DB** — stocker popularity, seller_rating, seller_reviews, photo_count dans market.db
2. **Stratified cross-val + AUC-ROC** — remplacer accuracy par des metriques fiables
3. **NaN au lieu de 0.0** — pour les features manquantes a l'entrainement (necessite LightGBM)

**Moyen terme (impact haut, effort moyen) :**

4. **Migrer vers LightGBM** — plus rapide, gere les NaN, moins gourmand en RAM
5. **Features temporelles** — jour semaine, heure, saison
6. **Brand liquidity score dynamique** — remplacer le score statique par sold_ratio reel
7. **Popularity en cloche** — recompenser 5-15 favoris, penaliser >30

**Long terme (impact tres haut, effort important) :**

8. **Calibration des probabilites** — CalibratedClassifierCV pour des probas fiables
9. **Seuils adaptatifs par categorie** — au lieu de seuils globaux
10. **Detection d'anomalies** — identifier les items anormalement sous-evalues par isolation forest avant le scoring classique

### Verdict ML : activer ou pas ?

| Condition | Recommandation |
|-----------|---------------|
| < 50 SOLD en DB | NE PAS activer — le scoring heuristique seul est plus fiable |
| 50-200 SOLD | Activer en mode observation (`boost_weight: 0`) — logger les probas sans impacter le score |
| 200-500 SOLD | Activer prudemment (`boost_weight: 5`) — petit impact |
| > 500 SOLD + enrichissement DB | Activer pleinement (`boost_weight: 10`) — le ML apporte de la valeur |
| > 1000 SOLD + LightGBM + features temporelles | Le ML peut devenir le signal principal |
