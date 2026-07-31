# INVENTORY — replitfinal_referenceonlyretired

**What it is:** the same Well Lived Citizen system as `for_referencev5.1`, but a
**newer, fuller superset** — dated 6/12 vs 6/11. It's the most-worked reference
(Copilot's rectification passes landed here). Same "reference only / retired"
label, but it holds the freshest content in the account.

- **Size:** ~9.3 MB, 269 files. ~0.6 MB is content.
- **Same stack as v5.1:** React/Vite site + serverless API, pnpm, Replit origin,
  Netlify, Supabase, Resend, OpenAI libs. **No Firebase.**

## What's NEW here vs for_referencev5.1 (the reason to keep both)

- `memory/` folder — structured persistent memory: `context/company.md` (four
  pillars, pricing, a **resolved conflict log**), `glossary.md`, `people/bob.md`,
  `people/gayle.md`, `projects/wlc-site.md`, `context/builds.md`
- `docs/SERVICES-PRICING.md`, `docs/WLC-SITE-COPY-FINAL.md`, `docs/CRM-BUILD-PLAN.md`,
  `docs/WLC-MCP-SPEC.md`, `docs/CLAUDE-CODE-HANDOFF.md`, `docs/discovery-report.md`
- `.claude/brand-voice-guidelines.md`
- a top-level `site/` dir (in addition to `artifacts/`)

## Top-level map

| Path | Type | Note |
|---|---|---|
| `memory/` | **content** ⭐ | persistent-memory: company context, glossary, people, resolved conflict log |
| `docs/` (+ `_work`, `brand-source`) | **content** | full WLC business + brand docs, now with more "final" copies |
| `.agents/memory/`, `.claude/` | **content** | memory rules + brand-voice guidelines |
| `attached_assets/` | **content + assets** | brand vault + resale agreement (legal) |
| `artifacts/`, `site/`, `lib/`, `scripts/`, `netlify/` | **code** | the site/API/libs + build plumbing |
| root `*.md` | **content** | launch-social-posts, replit, CLAUDE |

## Cloud / lock-in flags

Supabase, Netlify, Resend, Replit, OpenAI. No Firebase. Flagged only, not touched.
