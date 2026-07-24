# LEFT BEHIND — for_referencev5.1

"Left behind" means **not pulled into Mono staging** — it is NOT deleted. The
original repo `dbrownla5/for_referencev5.1` still holds all of it, untouched, on
GitHub. Anything here can be pulled in later if you want it.

## Code / build (not staged — heavy, and already preserved on GitHub)

| Path | Why not staged now |
|---|---|
| `artifacts/wlc-site/` (7.4M) | The React/Vite site — a real tool, but this is a "reference" build. Better reviewed as a *tools* pass than dumped into Mono. Candidate for `commerce-workflow` / `well-lived-citizen` tools later. |
| `artifacts/api-server/` (180K) | Serverless API — same: review as a tool later. |
| `lib/` (436K) | Shared libraries (api-client, zod, db, OpenAI integrations) — tool code. |
| `scripts/`, `netlify/`, `*.config`, lockfiles | Build + deploy plumbing. Tied to Netlify/Replit/pnpm — infrastructure, not content. |
| `attached_assets/` binaries (images etc.) | Non-markdown assets not pulled in this content-first pass. |

## Why this split

This first pass was **content-first** on purpose — the goal was to get the
"dripped" writing out where you can read it. The code is a separate *tools* pass,
and it's safest done deliberately (checking what actually works) rather than
copied wholesale.

## Nothing was decided

None of the above is a verdict. It's just "not yet." Your audit of `KEPT.md`
decides what's real; if you want any left-behind code pulled in, say so.
