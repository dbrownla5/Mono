# LEFT BEHIND — replitfinal_referenceonlyretired

"Left behind" = not pulled into Mono staging. NOT deleted — the original repo
still holds it all on GitHub.

## Code / build (not staged — heavy, preserved on GitHub)

| Path | Why not staged now |
|---|---|
| `artifacts/` + `site/` | The React/Vite site + API — tool code, a later *tools* pass, not this content-first one. |
| `lib/` | Shared libraries (api, zod, db, OpenAI integrations). |
| `scripts/`, `netlify/`, `*.config`, lockfiles | Build + deploy plumbing (Netlify/Replit/pnpm). |
| `attached_assets/` binaries | Non-markdown assets not pulled in a content-first pass. |

## Note on overlap with for_referencev5.1

Most of this repo's `docs/` duplicates `for_referencev5.1`. That duplication is
staged again on purpose (each repo keeps its own record); the **assembly step**
later picks the best single version per file across both — it does not keep two.

## Nothing decided

Your audit decides what's real. Any left-behind code can be pulled in on request.
