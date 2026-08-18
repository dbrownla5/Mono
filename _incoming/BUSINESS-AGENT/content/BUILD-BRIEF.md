# BUILD BRIEF — FOR CLAUDE CODE (wlc-core)

*Written 2026-06-14 from the Cowork session that consolidated WLC into this repo. Read `CLAUDE.md` and `truth/truth-AUDIT.md` before doing anything. Dayna directs; she is not a coder — never make her read code or diffs. Jam session, not ticket queue. The raccoon stays. 🦝*

## 0. THE ONE RULE
`wlc-core` is the single source of truth. Everything else — `ReplitFinal`, `Well_Livedv5.1`, `Dashboard-`, ~20 other repos, ~300 loose drift files — is REFERENCE ONLY, never the workspace. Do not sync or "fix" them. Work only here. At the end of every session, write what changed into `memory/`. Push this repo to its own GitHub origin so it survives the machine swap. This persistence is the whole fix: four months of work vanished because validated voice + decisions were never saved in one durable place. They are now. Keep them here.

## 1. READ ORDER
1. `CLAUDE.md` — memory + locked decisions (pricing, pillars, hero, dead names).
2. `truth/truth-AUDIT.md` — the drift diagnosis: 6 self-crowned "sources of truth," 4 competing heroes, 3 commission schemes, an invented quote.
3. `truth/truth-FACT-LEDGER.md` — every money/name claim + the 9 questions only Dayna closes.
4. `voice/voice-VOICE-CANDIDATE.md` — the voice, built only from Dayna's own words.
5. `CLAUDE-LAW.md` — operating law: zero invention, validation gate is Dayna's, batch deploys.

## 2. FIRST FIX — THE MONEY ERROR (highest priority; client-facing legal risk)
The resale commission is written BACKWARDS (`45/55`, against the client) in several places. It has been hand-corrected 10+ times this week and keeps regenerating, because nothing gates it. CORRECT values (Dayna's ruling, legal done):
- Clothing & accessories: **55/45 (client/Dayna)** — client gets 55.
- Full Closet Liquidation: **55/45** public.
- Designer & luxury: **50/50**.
- Furniture & significant home: **50/50**.
- Low-value volume bags ($5–$10 range): **35/65**, disclosed at intake, never retroactive.

Backwards `45/55` found as live fact (in reference repos — fix the equivalents as they enter wlc-core):
- `replit.md:100`, `docs/WLC-SITE-COPY-FINAL.md:217`, `docs/_work/gap-map.md:128` — in BOTH ReplitFinal and Well_Livedv5.1.
- **`docs/WLC-SITE-COPY-FINAL.md` is now in wlc-core** — verify and fix its line ~217 first; it carried the error in.

Then wire `tools/page-audit.mjs` (from the 6/12 system) as a pre-deploy gate so any backwards split FAILS the build. Also kill the phantom "Full Closet Liquidation 45/55" tier and the invented homepage quote (zero-invention law: every quote needs provenance).

## 3. THE VOICE
Source order: `voice/voice-VOICE-CANDIDATE.md` (cited, her words) > `voice/voice-primary-jam-2026-05-30.md` (raw tape) > `.claude/brand-voice-guidelines.md`.
To perfect: run `/brand-voice:guideline-generation` against the `voice/` folder, write result to `.claude/brand-voice-guidelines.md`. Dayna has validated her voice hundreds of times — DO NOT make her start over; recover and consolidate. Never invent quotes.
Scrutinize "Brand Monster" words: stewardship, elevated, white-glove, holding space. Kitchen Rule: rewrite until it sounds like a trusted person solving a real problem in a real home. Dead names (never use): "Special Delivery," "estate sale," "elder care," "A Well Lived Citizen," public "Quick Books," and "Co" (ended April 2026).

## 4. THE WORKFLOW — THE CRM (the build target, now unblocked)
`plans/plan-HANDSHAKE-DASHBOARD.md` is the spec: the 9-step Handshake / chain-of-custody client workflow (Render + Supabase + SignNow). The handshake ENGINE already EXISTS in `ReplitFinal` (per the audit) — lift/rebuild it here, do not start blind. History: a prior Claude halted Manus from building this over a security concern; **Manus has since handled that**, so it is buildable now. The commission scheme inside that backend uses a THIRD split (`40/45/50/60` by tier) — reconcile to §2 before it ever goes live (Fact Ledger F5). The private repo `dbrownla5/handshake-dashboard` is a near-empty Manus template scaffold; the real logic is the plan + the ReplitFinal engine. `THE-HANDSHAKE-app.zip` and `Dashboard--main.zip` are in `_dropin` as reference.

## 5. THE SITE
`docs/WLC-SITE-COPY-FINAL.md` = launch copy (fix the split first). Stack: React/Vite in `artifacts/wlc-site`, single content source `src/content/brand.ts`, hosted on **Netlify** auto-deploying from `main`. BATCH changes, deploy once — each deploy costs Dayna money. Live site: **thewelllivedcitizen.com** (Netlify project `well-lived-citizen`, builds from `dbrownla5/ReplitFinal`). Resend = contact emails. Supabase = CRM database (future). Do NOT default to Replit/Netlify just because it's wired — that's the lazy path Dayna has explicitly rejected.

## 6. OPEN QUESTIONS — ONLY DAYNA ANSWERS (don't guess, don't freeze without her)
The full list lives in `truth/truth-FACT-LEDGER.md` (the 9 money/name questions) + `voice/voice-VOICE-CANDIDATE.md` §7 (the read-aloud questions). Known live ones: which homepage HERO (4 competing "locked" versions); backend commission tiers (F5); prepaid-vs-reserved Flex Block conflict; the $500/mo retainer (should have NO published price); phantom "Full Closet Liquidation" tier; resale PAYOUT timing (first-Monday is correct; site's "by the 5th" is WRONG); the pillar public name "The Reset" (Q6); identity/domain keeper confirm (Q7). Turn each into "confirm or override," never a dead end.

## 7. LOCKED DECISIONS (canonical — full detail in CLAUDE.md)
- **Identity:** The Well Lived Citizen (NO "Co" — ended April 2026); DBA under Well Dressed Citizen LLC. Domain thewelllivedcitizen.com / dayna@thewelllivedcitizen.com.
- **Pillars (LOCKED 6/12):** Home Organization & Move Support · House Calls · Legacy Inventory & Cataloging · Resale & Consignment.
- **Pricing (LOCKED 6/12):** hourly base · flat Move-In Day $1,200 · everything else project-scoped with client. 4-Hour Reset $495 flat entry. House Calls $175/hr.
- **Flex Blocks (LOCKED 6/12):** 2/4/6-hr reserved at hourly rate, cross-scope, never expire. Prepaid "banks" are DEAD.
- **Fast Books (LOCKED):** rotational easy-book layer (4-Hr Reset $495 · House Call $350 = 2hr min · Quick Resale Pickup · Move Wrap-Up). Packaging, not pricing.
- **Fast Bag:** FREE resale pickup workflow — NOT a paid "$95 Fast Bag Fill."
- **Commission (LEGAL DONE):** see §2. `wlc-resale-agreement.md` governs ALL public resale copy.
- **People:** Gayle (verbatim testimonial; fur-coat story = Legacy "choice" thesis; gave Dayna the St. John). Bob (fanny-pack customer, Missouri; bought nothing; = "value others don't see"). Full profiles in `memory/people/`.

## 8. INFRASTRUCTURE & RESOURCES (the means already exist — "what to build" is NOT the blocker)
- **$10/mo personal server**, 30-min data, security protocols already fit for customer workflow.
- **Google AI Studio + Vertex AI** startup credits available; Google SDK + a terminal on the machine.
- **Manus** on standby (the earlier security concern is resolved) — feed it FLAT literal specs, never voice/nuance.
- **Netlify** (live deploys), **Supabase** (CRM DB), **Resend** (emails) all wired.
- **GitHub CLI (`gh`) installed but NOT logged in** — `gh auth login` is the one gate to pushing wlc-core and reading private repos.
- **`git` installed.** `tools/page-audit.mjs` (in the 6/12 system) is a working audit gate — wire it.

## 9. THE MAP — WHERE EVERYTHING IS
- **`C:\Dev\WLC\wlc-core`** = THE single source of truth (this repo). Work here only.
- **`C:\Dev\WLC\_repos`** = reference clones w/ history: `ReplitFinal` (LIVE site, 130 commits), `Well_Livedv5.1` (backend spine, 241 files), `Dashboard-`.
- **`C:\Dev\WLC\_dropin`** = raw source drop: voice/brand/audit files + `THE-HANDSHAKE-app.zip`, `Dashboard--main.zip`, `wlc-brand-system.zip`, `ClaudeWorkspace.zip`, `TWLC_Master_Document.md`.
- **GitHub `dbrownla5`** = ~30 repos; `ReplitFinal` is the live Netlify origin. `handshake-dashboard` (private) = scaffold only.

## 10. THE BURN LIST (reference only — NEVER the workspace)
The ~20 other repos, the ~300 loose drift files, the duplicate "selves" agents spawned, the six self-crowned "source of truth" docs. Do not sync, merge, or patch them forward. They exist to be read once if needed, then ignored. wlc-core does not inherit their drift.

## 11. HOW TO WORK WITH DAYNA
Jam session, not a ticket queue. She directs; she is not a coder — never make her read code or diffs. Voice-to-text is often garbled (broken monitor) — READ INTENT, not literal text; if garbled, say so lightly and move on. Catch errors before she does. Never claim "done" when it isn't. Batch changes and deploy once — each deploy costs money. Plain language, warm, never terse, never "executing directive." Dry humor welcome — the raccoon stays. 🦝 **NEVER touch registry/identity/login** — full access once wiped her machine and locked her out 3 days; that loss is real.

## 12. SESSION LOG — 2026-06-14 (what this Cowork session did)
Consolidated WLC off iCloud into `C:\Dev\WLC`. Confirmed GitHub as truth (Netlify → `dbrownla5/ReplitFinal`). Pulled the real repos with history. Built `wlc-core` as the single source of truth, folded in the trusted 6-13 voice/memory drop + the orphaned 6-12 agent system (truth audit, ledgers, voice candidate, jam tape, plans, CLAUDE-LAW). Located every live instance of the backwards `45/55` money error. Wrote this brief. The voice was NEVER the missing piece — Dayna validated it hundreds of times; persistence was missing. It is now in git.

## START HERE (Claude Code, first session in wlc-core)
1. `cd C:\Dev\WLC\wlc-core` — read `CLAUDE.md`, `truth/truth-AUDIT.md`, then this brief.
2. **Fix #1:** correct the money error to 55/45 everywhere (see §2); wire `page-audit.mjs` as a deploy gate.
3. Run `/brand-voice:guideline-generation` over `voice/` → write `.claude/brand-voice-guidelines.md`.
4. `gh auth login`, then push wlc-core to a NEW GitHub repo as origin (retires ReplitFinal as the working base).
5. Build the site from corrected copy + locked voice (batch, deploy once). Then build the Handshake CRM per `plans/`.
6. Close the open questions WITH Dayna (§6) — confirm-or-override, never freeze without her.
