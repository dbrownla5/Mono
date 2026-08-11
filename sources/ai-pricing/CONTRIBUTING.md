**Read in [English](./CONTRIBUTING.md) / [Français](./CONTRIBUTING.fr.md)**

# Contributing to AI Pricing

Thanks for looking at how to help. This is a maintained side project; clear, focused contributions land faster.

## Ground rules

- Open an issue before opening a non-trivial pull request.
- One concern per PR.
- Conventional commit messages: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`.
- Code, comments and commit messages in English.
- No secrets, no cookies, no `.env` files committed.
- Respect the [Disclaimer](./README.md#disclaimer). Pull requests that bypass marketplace terms of service or rate limits will be closed.

## Reporting bugs

Use the **Bug report** template. Include:

- What happened versus what you expected.
- Reproduction steps with concrete config inputs (which category, which country, which threshold).
- Your OS, Python version, commit SHA.
- Logs as text, not screenshots. Strip any tokens before pasting.

## Requesting features

Use the **Feature request** template. Explain the use case before the implementation.

## Local setup

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

Fill `.env` with at least one alert channel before running. The dev tooling (`pytest`, `pytest-cov`, `ruff`) matches what CI installs in `.github/workflows/ci.yml`.

## Tests

```bash
pytest
pytest --cov --cov-report=term-missing
ruff check .
```

CI fails the build if coverage drops below 60 percent (`--cov-fail-under=60`). Add tests for new scoring logic, storage paths, or config validation. When you touch `src/core/scoring/`, include at least one test that asserts on percentile boundaries (`p20` / `p50` / `p80`) or on the ML tier selected for a given SOLD count.

## Style

- Type hints on public functions.
- Functions under 50 lines; modules under 400 lines.
- Run `ruff check .` before committing.
- Keep modules consistent with the existing layout: scoring in `src/core/scoring/`, storage in `src/core/storage/`, infra in `src/core/infrastructure/`, notifications in `src/core/notifications/`.

## Pull request flow

1. Fork.
2. Branch from `main`: `git checkout -b feat/short-description`.
3. Small, focused commits.
4. Run tests and lint locally.
5. Open a PR using the template, reference the related issue with `Closes #N`.

A reviewer will respond when time allows.

## Code of conduct

Be respectful. Assume good intent. No harassment, no personal attacks.

## License

By submitting a contribution you agree that it will be released under the [MIT License](./LICENSE).
