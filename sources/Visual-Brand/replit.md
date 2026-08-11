# The Well Lived Citizen — Project Context

> **READ THIS FIRST.** This file loads automatically into every agent's memory. It is the orientation any future agent (or future-me) needs before touching anything.

---

## WHO THIS IS FOR

**Owner:** Dayna Brown
**Location:** Los Angeles
**Phone:** (323) 433-1350 — primary CTA across the entire brand
**Email:** dayna@thewelllivedcitizen.com
**Site:** thewelllivedcitizen.com (no "co" — confirmed Apr 17, 2026 against the live published endpoint)

Dayna is the operator. She is **not technical**: she does not use git, JSON, or files directly. She works visually and conversationally. She edits her business info through `admin.html`, not the codebase. Anything you generate in chat that is not saved to a file is **lost to her**. Default to writing real files.

---

## WHAT THIS PROJECT IS

**The Well Lived Citizen** — a Los Angeles concierge / home-organization / legacy / resale service. Multi-page static site (Vite) + Express API server. The site is the front door; the phone number is the actual conversion point.

**Brand-name history (do not re-litigate):** The brand was renamed from "The Well Lived Citizen Co" to "The Well Lived Citizen" in commit `7935067` on Apr 17, 2026. The social handles were also renamed late that same night to drop the "co": Company IG/FB went from `@thewelllivedcitizenco` to `@thewelllivedcitizen`; Closet IG went from `@thewelllivedcitizencocloset` to `@thewelllivedcloset` (note: also dropped "citizen"). The archive account `@welldressedcitizen` is unchanged. The eBay store `thewelllivedclosetco` retains the "co" deliberately. The Poshmark closet is `welllivedcloset`. Any reference to ".co" or "Citizen Co" anywhere in the project, outside the LLC name (`Well Dressed Citizen LLC`) and the eBay store username, is **drift** and must be corrected, not propagated.

### Tech stack
- Monorepo: pnpm workspace
- Site: `artifacts/website/` — static HTML + CSS, no framework, served by Vite
- API: `artifacts/api-server/` — Express 5, TypeScript, esbuild bundle
- Storage: `artifacts/api-server/data/business-info.json` (file-based; production-persistence is a known gap, see below)
- Auth: simple `ADMIN_PASSWORD` env var on the API server gates the admin save

### Three workflows
1. `artifacts/api-server: API Server` — port 8080
2. `artifacts/mockup-sandbox: Component Preview Server` — port 8081
3. `artifacts/website: web` — Vite dev server

### Backups
- **GitHub remote configured but NOT pushed:** `https://github.com/dbrownla5/Visual-Brand-Boost` is set as `origin` but Replit is not authenticated to push to it. The repo on GitHub is empty. To fix: operator opens Replit Tools → Git → Connect to GitHub, authorizes, selects existing repo, pushes. All local commits then sync up.
- **Replit gitsafe-backup** (automatic local mirror) — this IS active and current.
- **Replit Deployment** — the live site is published independently and survives even if the workspace is wiped.
- **47 agent memory snapshots** at `.local/state/replit/agent/.agent_state_*.bin` (restorable via Replit History panel).

---

## BRAND VOICE — non-negotiable

Voice is the single most important thing on this project. **Almost every other failure on this project has been a voice failure.**

- **First person, always.** Story-led. Specific objects, specific people. Never abstract benefits.
- **Calm, dry, warm.** Anti-hustle. No hype. No "transform your life." No emojis on Facebook/Nextdoor; max one tasteful one on Instagram.
- **Anti-Insta-perfect.** Real spaces, real light, mid-process imperfection. Phone-quality photos preferred over staged.
- **Em-dashes are fine. Sentence fragments are fine.**
- **Never use "AWLC."** Always full name: **The Well Lived Citizen** (no "Co" since the Apr 17 rename).
- **Never say "Well Dressed Citizen LLC" on payments.** Zelle uses phone/email handles only.
- **Phone format is exactly `(323) 433-1350`.** Never reformatted.

### The headline that defines the brand
> *Competence does not eliminate the need to be cared for.*

If something you write doesn't sit comfortably next to that sentence, rewrite it.

### Five anchor stories (locked source-of-truth in the knowledge base)
1. Gayle (84, post-hip surgery, the lamp clicker, Seattle)
2. The flood (13 temporary homes / Airbnbs in a year, dog in storage, "she was relief")
3. The china (incomplete sets, kids who said no)
4. Stevie's capes / Steven Tyler's scarves (museum glass, objects holding identity)
5. The baby shower mountain (8 months pregnant, hundreds of gifts)

---

## THE FOUR PILLARS

| # | Pillar | Notes |
|---|---|---|
| 1 | Home Organization & Modern Move | Stable. Don't touch positioning. |
| 2 | Legacy Planning & Inventory Catalog | **Slated to rename to "Home Archive & Story Recovery" in Week 3** — re-angle toward living people cataloging what matters, not preparing for the end. Stops the elder-care drift. |
| 3 | House Calls | **Soft-launch positioning:** productize as "2-hour House Call — $350, book this week." Fixed price, calendar link, one-tap. |
| 4 | Curated Resale & Consignment | **Soft-launch positioning:** lead with photo fast-path, not the agreement. "Send a photo to (323) 433-1350. I'll quote pickup. Agreement only after you see the number." |

---

## DECISION LOCKS — do NOT change

1. No "AWLC" — always full brand name.
2. Phone format exactly `(323) 433-1350`.
3. Online resale: all sales final, no chargebacks. Never soften.
4. In-person tone is warm; online resale tone is strict. Two voices on purpose.
5. No fixed pricing tier for larger estates. Whole-Home & Extended-Complex Legacy must be quoted after walkthrough.
6. No "Special Delivery" as a separate service line — that's House Calls content.
7. No Shopify storefront before Month 4. Cash floor first.
8. No Thumbtack, no TaskRabbit, no platform-feed services.
9. **Plus Jakarta Sans is the only font.** Don't add a second.
10. Color palette in `style.css` (`--cream`, `--warm`, `--linen`, `--char`, `--ink`, `--stone`, `--clay`, `--sand`, `--rust`, `--rust-soft`) is the only palette.

---

## CRITICAL PENDING / KNOWN ISSUES

- **Admin saves don't persist in production yet.** `business-info.json` is file-based; surviving deploys requires moving to object storage. Flagged for Week 3.
- **No Stripe payment link** wired in yet. `business-info.json` has slots; Dayna needs to create a Stripe payment link and the URL gets pasted in.
- **No Cal.com / Calendly link** wired in yet. Required for the $350 House Call to function as one-tap booking.
- **Hero CTAs and conversion blocks on `index.html`** still funnel to the contact form (`contact.html`). The Week-1 plan calls for text-first CTAs (`sms:` links with prefilled body). Not yet implemented — pending operator OK.
- **Resale card** still says "Commission-based · agreement required" without the photo-fast-path subline. Pending operator OK.

---

## KEY SOURCE-OF-TRUTH FILES (read these before doing anything content-related)

**Read in this order:**

1. `attached_assets/BRAND-MATCH-MARKETING-PROGRAM.md` — **PRIMARY SOURCE OF TRUTH for all social/marketing.** Defines the three-account architecture (Company / Closet / Archive), the per-account voice rules, the visual system, the caption formulas, the four launch posts (ready to ship), the cadence, and the "never do" list. Recovered from the prior strategy session. **This supersedes anything in `10-day-launch-content.md`.**
2. `attached_assets/welllivedcitizen_knowledge_base_1776369478910.json` — locked brand voice, pillar copy, headlines, anchor stories. Used for site copy and the *raw materials* that the marketing program shapes.
3. `attached_assets/Pasted-WEEK-1-Turn-the-site-into-a-cash-machine_1776378421090.txt` — original Week 1-3 strategy plan (saved Apr 16 22:27 UTC). Source of the soft-launch repositioning for Pillars 3 & 4 and the text-first CTA strategy.
4. `attached_assets/PLAYBOOK.md` — operator playbook. **Caveat:** portions extrapolated past saved strategy; verify against the marketing program above for any social/voice question.
5. `attached_assets/10-day-launch-content.md` — **DEPRECATED. Do not use.** Written before the brand-match marketing program was recovered. Operator rejected it. Use the four launch posts in BRAND-MATCH-MARKETING-PROGRAM.md instead.
6. `attached_assets/SESSION-AUDIT-and-TIMELINE.md` — full record of all checkpoints, backups, recovery paths.
7. `attached_assets/DAYNABROWN_EXPERIENCE_V_1776375994228.docx` — operator's professional experience.
8. `artifacts/api-server/data/business-info.json` — editable business info (powers site via `info-loader.js`).

## DIVISION OF LABOR — who does what

- **Dayna runs all content.** She decides what gets written, by whom, when. Manus is one of her tools assisting her — not a co-owner, not a separate channel to coordinate with.
- **This project's job:** the website, the API, site copy, and whatever Dayna explicitly asks for. Don't volunteer to draft closet captions, social posts, or piece copy unless she asks.
- **Domain / DNS / SSL / IONOS:** Dayna handles directly. Don't ask, don't offer.
- **Today (launch day):** stay in lane. Execute what's asked. Don't spin up extra work.

## THREE-ACCOUNT ARCHITECTURE (memorize this)

| Handle | Role | Voice notes |
|---|---|---|
| `@thewelllivedcitizen` | Company — positioning + lead gen | Calm, observant, dry, slightly literary. Sentence case. No exclamations. |
| `@thewelllivedcloset` | Closet — Poshmark/eBay sales + intake. **The cash account.** | Same register, more connoisseur. Story-led, never bargain-led. |
| `@welldressedcitizen` | Archive — one transition post then dark | Brief, warm, final. |

**Cross-tag rule:** Company and Closet feed each other via @-mentions in every relevant post. Never post the same item to both on the same day.

---

## WORKING WITH DAYNA — operating notes

- **She is exhausted and pre-launch.** Match her urgency without performing.
- **Do not regurgitate the knowledge base back at her.** She can tell. It reads as "GPT echo." Drafts that pull anchor stories at her without her in the room have been rejected.
- **Don't ask diagnostic questions when you can do the work.** "Should I X or Y?" wastes her time. Pick one, do it, show, adjust.
- **Don't apologize repeatedly.** It registers as performance. Acknowledge once, move.
- **Save things to files by default.** Anything generated only in chat is lost to her.
- **Voice rewrites need her in the room.** The kb gives you the vocabulary; only she gives you the cadence.
- **She has been burned by previous sessions losing strategic conversation.** Restoring a checkpoint via Replit's History panel (clock icon) is the only way to recover prior chat memory — direct her there for anything that "feels missing."

---

## TYPECHECK / BUILD COMMANDS

- `pnpm run typecheck` — full typecheck
- `pnpm run build` — typecheck + build
- `pnpm --filter @workspace/api-server run dev` — run API server (auto via workflow)
- `pnpm --filter @workspace/website run dev` — run site (auto via workflow)

See the `pnpm-workspace` skill for monorepo details.
