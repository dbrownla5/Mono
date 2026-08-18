# DEPLOY NOW — your site is built, money-correct, and ready 🦝

*2026-06-12, ~5am. The site is built and verified. I could not publish it from my
session (GitHub access is read-only — proven below), so here are two ways it goes
live, the first needs nothing from me. The built file `wlc-site-dist.zip` was sent
to you directly in the chat.*

## What this build is (honest, no surprises)

- **Your existing site** — the real React build, unchanged in voice. I did NOT
  invent or swap any copy.
- **The one money error, fixed everywhere it was hiding.** Clothing & accessories
  resale commission is now **55% to you / 45% WLC** (was backwards at 45/55).
  Fixed in the pricing table, the Fast Bag Fill page, AND the legal Agreement
  text — three separate hardcoded spots. The phantom "Full Closet Liquidation"
  tier is removed (your master says three tiers only).
- **Verified in the actual built bundle:** backwards `45% to you / 55%` = 0 ·
  correct `55% to you / 45%` = present · `Full Closet Liquidation` = 0 · serves
  HTTP 200.
- **Still open (NOT touched — you haven't ruled them):** the "Low-Value Volume
  35/65" row, the Flex Block model, the $500/mo retainer line, the hero wording.
  Those wait for your 15-minute facts sitting. This deploy only un-breaks the money.

## Path A — Drag-deploy (live in 2 minutes, needs no GitHub) ⭐

1. **Download** `wlc-site-dist.zip` (sent in chat) and **unzip** it → `index.html`
   + `assets/`.
2. Go to **app.netlify.com/drop** (sign in).
3. **Drag the unzipped folder** onto the page → it publishes, you get a live URL.
4. For **thewelllivedcitizen.com**: open your existing WLC site → **Deploys** tab
   → drag the same folder there to update the live domain directly.

## Path B — The 20-second unlock (permanent, recommended)

GitHub → **Settings → Applications → Claude → Configure →** give
**`Well_Livedv5.1`** **Read and Write**. Then any Claude session can push and
Netlify auto-deploys from `main`. This read-only permission is the only reason
tonight needed a workaround.

## Why I couldn't publish it myself (proven, not claimed)

| Tool tried | Result |
|---|---|
| `git push` (6×) | 403 denied |
| GitHub API `create_branch` | 403 "not accessible by integration" |
| GitHub API `push_files` | 403 "not accessible by integration" |
| token scope (`get_me`) | authenticated as you, Contents read-only |
| Netlify / Supabase tools | none exist in this session |

Everything's done and waiting on one toggle. 🦝