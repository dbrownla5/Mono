# 00 — MASTER SALVAGE MAP

**Date:** 2026-06-29 · **Status:** Read-only audit complete. Nothing was built, moved, edited, deleted, deployed, or decided.

> **The one sentence:** You are not rebuilding. You have roughly **85% of a working system** — it's just scattered across three places (the live repo, the flattened workspace, and GitHub) and buried under contradicting drafts. The real work left is **deciding**, not constructing.

---

## 1. What you actually have (the good news, plain)

| Piece | Status | Where it lives |
|---|---|---|
| **The website** | ✅ **Done & complete** | `wlc-build-2026/artifacts/wlc-site` — 18 pages, routing, intake form, signed-agreement gate, consent page. Copy centralized in `src/content/brand.ts`. |
| **CRM database (the schema)** | ✅ **Real & well-built** | `wlc-build-2026/lib/db` — full 9-step chain-of-custody modeled (handshakes, items, events, payouts-in-cents, legal gate, contact submissions). |
| **CRM engine (the backend logic)** | ✅ **Exists — just not in place** | A complete **10-step consignment→payout engine with 13 passing tests** (payout math, consent flow, full REST API). Survived as loose files in `UNNESTED_FLAT_WORKSPACE` (`handshake.ts`, `logic.ts`, `logic.test.ts`, `storage.ts`, `email.ts`) **+ a full project ZIP** `handshake-workflow-dashboard_1780214481486.zip`. Also in GitHub `Well_Livedv5.1`. |
| **CRM UI screens** | ✅ Done | AgreementGate + Consent pages in the live site. |
| **Lead capture backend** | ✅ Working | `netlify/functions/submit.mts` — emails you (Resend) + writes leads to Supabase. |
| **Voice app** | ✅ Survived | `transcribe.py` + docs in `UNNESTED_FLAT_WORKSPACE`. |
| **Other tools** | ⚠️ Partial survivors | `wlc-swarm`, `pc-operations-hub`, `pc_command_center` (partial) — scattered in the flat workspace. |

**Translation:** the front of the house and the data model are finished. The engine that runs the CRM is written and tested — it was never *moved into* the active build. That's a copy-and-wire job, not a build-from-scratch job.

---

## 2. What genuinely still needs doing (honest punch-list)

1. **Port the handshake engine** into `wlc-build-2026/artifacts/api-server/src` (currently empty) from the recovered files / ZIP / `Well_Livedv5.1`. Bring the matching Drizzle migration with it.
2. **Replace the "fraud" CRM** — the current Render/Supabase version is a placeholder, not the system you designed. The real engine + your dashboard plan is the replacement.
3. **Wire the dead ends** — the consent page calls a missing endpoint; signed bag-pickups currently only send an email (no real record/board) until the engine is ported.
4. **Build the voice tool** — the "you talk, it writes what you'd really say" tool. *Not started.* Needs your locked voice first (see §4).
5. **Lock the business spine** — see §3. This is the keystone; everything above drifts without it.

---

## 3. ⭐ The keystone: the business is undefined (only you can fix this)

Every drift below traces back to one missing thing: **there is no single, locked definition of the actual business** — the real pillars vs. the QuickBooks/turnaround services that were only ever for initial cleanup. Until that exists in ONE place, copy and CRM fields will keep regenerating wrong. This is decision #1.

---

## 4. The drift — decisions waiting for your ruling (the grill, teed up)

You said you're done writing — you just want to *choose*. Here's what's waiting. **I did not pick any of these.**

- **Consignment splits — 4–5 contradictory versions coexist.** `BUILD-BRIEF.md` rules **55/45 (client-favorable)** correct and notes the reversed value "keeps regenerating." Others on disk say 45/55, flat-55/45-all-tiers, 40/60, 35/65. → **You rule once; it gets locked everywhere and never reopened.** (You've said this shouldn't still be an open question — agreed. One ruling closes it.)
- **Homepage hero — 5 "locked" versions, none signed off.** "Chaos Wrangler…", "One person for the move…", "Professional problem solver…", "built for your chaos" (also marked banned), "There's an easier way…". → **Pick one (or Frankenstein the words you like).**
- **Payout timing** — first-Monday vs. the site's "by the 5th." → Pick.
- **Phantom "Full Closet Liquidation" tier** — appears in some docs, marked "never approved" in others. → Keep or kill.
- **Your voice** — to be assembled from your voice docs and brought to you as "this line, or this line?" — never as a blank page.

---

## 5. Where "truth" probably lives (candidates — labeled, not crowned)

Strongest source-of-truth candidates found, for you to bless or reject:
`WLC-CANONICAL-TRUTH.md` (newest) · `TWLC_Master_Document.md` (most complete, 147KB) · `BUILD-BRIEF.md` (reads as operational law) · `AWLC-SERVICES-MASTER-FINAL.md` · `wlc-resale-agreement.md` (newest legal) · `WLC-SITE-COPY-FINAL.md` · `BRAND-VOICE.md` · `CRM-AND-INTAKE.md` · `THE-HANDSHAKE.md`.

⚠️ Note: `WLC-CANONICAL-TRUTH.md` literally contradicts itself between its 06-21 version ("Locked authority") and 06-28 version ("UNAUDITED DRAFT"). So even the "truth" file isn't settled — which is exactly why you rule, not the docs.

---

## 6. 🔒 Security flag (worth doing soon, not tonight)

Live secrets are sitting loose: `.env` with Supabase service-role keys + Netlify/Resend/GitHub tokens, plus `github-token.txt` and `claude-credentials.json`, are in the flat dump. Your GitHub token is also embedded in plaintext in the active repo's git remote URL. **Recommend: rotate these and relocate to one secure vault.** No values were ever printed in any report — names only.

---

## 7. What I did NOT do (guardrails honored)

- ❌ Did not build the site, write code, or port the engine
- ❌ Did not decide splits, hero, voice, or pillars — those are yours
- ❌ Did not move, rename, delete, or edit any of your files
- ❌ Did not push, deploy, or spend anything
- The only inert leftover is one parked, uncommitted CSS fix from earlier — harmless, ignore it.

---

## 8. The road from here (so it doesn't go south)

- **Wave 1 — THE MAP** ✅ *(this document)*
- **Wave 2 — THE SORT + GRILL PREP** *(ready to run on these clean inputs):* organize the recovered tools/engine into a usable structure; pull every scrap of copy and split **social vs. website** into two decision-ready piles; assemble your voice corpus; deep-read the resale app + CRM plan into a precise build punch-list.
- **Wave 3 — DECISIONS WITH YOU:** you rule the spine (pillars, splits, hero, payout) and your voice via the grill. *Then* — and only then — the engine gets ported and the voice tool gets built against locked truth.

**Reports backing this map:** `01-FLAT-WORKSPACE-DOCS.md` · `02-ALREADY-BUILT-CODEBASE.md` · `03-REFERENCE-LEGACY-SALVAGE.md` · `04-RECOVERY-HUNT.md`
