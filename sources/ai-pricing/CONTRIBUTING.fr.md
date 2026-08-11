**Lire en [English](./CONTRIBUTING.md) / [Français](./CONTRIBUTING.fr.md)**

# Contribuer à AI Pricing

Merci de regarder comment aider. C'est un projet annexe maintenu ; les contributions claires et focalisées passent plus vite.

## Règles de base

- Ouvrir une issue avant une pull request non triviale.
- Un seul sujet par PR.
- Messages de commit conventionnels : `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`.
- Code, commentaires et messages de commit en anglais.
- Aucun secret, aucun cookie, aucun fichier `.env` committé.
- Respecter l'[Avertissement](./README.fr.md#avertissement). Les pull requests qui contournent les CGU des marketplaces ou les limites de débit seront fermées.

## Signaler un bug

Utiliser le template **Bug report**. Inclure :

- Ce qui s'est passé versus ce qui était attendu.
- Étapes de repro avec inputs de config concrets (catégorie, pays, seuil).
- OS, version Python, SHA du commit.
- Logs en texte, pas en capture. Retirer les tokens avant de coller.

## Demander une fonctionnalité

Utiliser le template **Feature request**. Expliquer le cas d'usage avant l'implémentation.

## Setup local

```bash
git clone https://github.com/assinscreedFC/ai-pricing.git
cd ai-pricing
python -m venv .venv
source .venv/bin/activate     # macOS / Linux
.\.venv\Scripts\activate      # Windows
pip install -r requirements.txt
pip install pytest pytest-cov ruff
cp .env.example .env
```

Remplir `.env` avec au moins un canal d'alertes avant de lancer. L'outillage dev (`pytest`, `pytest-cov`, `ruff`) correspond à ce que la CI installe dans `.github/workflows/ci.yml`.

## Tests

```bash
pytest
pytest --cov --cov-report=term-missing
ruff check .
```

La CI échoue si la couverture descend sous 60 % (`--cov-fail-under=60`). Ajouter des tests pour toute nouvelle logique de scoring, chemin de storage, ou validation de config. Quand vous touchez à `src/core/scoring/`, inclure au moins un test qui assert sur les bornes de percentiles (`p20` / `p50` / `p80`) ou sur le tier ML sélectionné pour un nombre donné de SOLD.

## Style

- Type hints sur les fonctions publiques.
- Fonctions sous 50 lignes ; modules sous 400 lignes.
- Lancer `ruff check .` avant de committer.
- Garder les modules cohérents avec le layout existant : scoring dans `src/core/scoring/`, storage dans `src/core/storage/`, infra dans `src/core/infrastructure/`, notifications dans `src/core/notifications/`.

## Flux pull request

1. Fork.
2. Branche depuis `main` : `git checkout -b feat/courte-description`.
3. Petits commits ciblés.
4. Lancer tests et lint en local.
5. Ouvrir une PR avec le template, référencer l'issue avec `Closes #N`.

Un reviewer répondra dès que possible.

## Code de conduite

Respect mutuel. On suppose la bonne foi. Pas de harcèlement, pas d'attaque personnelle.

## Licence

En soumettant une contribution, vous acceptez qu'elle soit publiée sous la [licence MIT](./LICENSE).
