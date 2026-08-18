# 12 — Resale / Consignment Engine Audit

**Date:** 2026-06-29
**Owner:** github.com/dbrownla5
**Method:** READ-ONLY GitHub MCP inspection (no clone, no writes)
**Repos assigned:** `Well_Livedv5.1`, `Resell-Google-App-v5.3.2026`, `SHIPWEIGHT`

---

## TL;DR — Verdict

**The single best, most-complete resale/consignment engine is in `Well_Livedv5.1`** — a tested,
pure-logic 10-state "Handshake" chain-of-custody engine with payout math in integer cents,
tier-based commission splits, a legal signature gate, client consent flow, Drizzle persistence,
an Express API, and an internal ops dashboard. It is the only repo of the three that actually
models consignment intake → custody → evaluation → pricing/consent → payout.

The other two are **single-purpose Gemini AI helper apps**, not operations engines:
- `Resell-Google-App-v5.3.2026` = AI image → inventory/pricing/platform-routing tool (Firestore).
- `SHIPWEIGHT` = AI shipping-weight + packaging estimator.

Both are useful **feeders** into the Handshake engine (pricing + shipping cost inputs) but neither
contains intake, splits, payout, or chain-of-custody logic.

---

## Repo 1 — `Well_Livedv5.1`  ★ THE ENGINE

- **Description:** "WEB BUILD REPLIT"
- **Stack:** pnpm monorepo (`pnpm-workspace.yaml`), TypeScript, Express, Drizzle ORM + Postgres,
  Vite/React site, Resend email, Replit/Netlify deploy targets.
- **Last commit:** 2026-06-17 (`9691c1c`, by welllivedcitizen) — most recently active of the three.
- **Top-level:** `lib/` (db, api-spec, api-zod, integrations), `artifacts/` (api-server + wlc-site),
  `scripts/`, `docs/`, `CLAUDE.md`.

### Where the engine actually lives
The doc that maps it: `docs/HANDSHAKE.md` ("The Handshake — Operating Manual").

| Piece | Path | Status |
|-------|------|--------|
| **Business logic (pure)** | `artifacts/api-server/src/handshake/logic.ts` | ✅ complete, unit-tested |
| **Unit tests** | `artifacts/api-server/src/handshake/logic.test.ts` | ✅ 12 checks, runnable w/o DB |
| **API routes / engine** | `artifacts/api-server/src/routes/handshake.ts` | ✅ full (intake→payout→consent) |
| **Storage (Drizzle)** | `artifacts/api-server/src/handshake/storage.ts` | ✅ thin, complete CRUD + audit log |
| **DB schema** | `lib/db/src/schema/handshake.ts` | ✅ 3 tables: handshakes, handshake_items, handshake_events |
| **Ops dashboard (HTML)** | `artifacts/api-server/src/handshake/dashboard.html.ts` | ✅ self-contained admin page |
| **E2E DB simulation** | `scripts/src/simulate-intake.ts` | ✅ insert→verify→advance→cleanup against live DB |
| **Schema barrel / exports** | `lib/db/src/schema/index.ts`, `lib/db/src/index.ts` | ✅ |

### The 10-step state machine (`step` column; forward-only)
`intake → day_before → custody → inventory → evaluation → report → consent → review → payout → closed`
(The "9-step" handshake = the 9 operational stages; `closed` is the terminal 10th.)
Enforced by `canAdvance()` / `nextStep()` in `logic.ts` — cannot skip or reverse (asserted in tests).

### Business logic that exists (all in `logic.ts`, pure + testable)
- **Legal gate** — `evaluateGate()`: a record only opens on the board with
  `agreementAccepted === true` + a typed `signatureName` (len > 1) + valid `agreementTimestamp`.
  Otherwise stored with `blocked = true` and kept off the board. (This is the consent-at-intake gate.)
- **Tier commission splits** — `TIER_SHARE` / `tierSharePct()`:
  `standard 40% · contemporary 45% · designer 50% · luxury 60%` (client share).
- **Payout math (integer cents):**
  - `itemNetCents()` = `soldGross − fees − shipping`.
  - `itemClientShareCents()` = `round(net × tierShare)`, **never negative** (net ≤ 0 → 0).
  - `payoutTotalCents()` = sum of client shares for items that **sold, weren't pulled, disposition === "list"**.
  - Worked + tested example: $70 gross − $10 fees − $8 ship = $52 net; designer 50% → **$26 (2600¢)**.
- **Payout date rule** — `computePayoutDate()` = first Monday **strictly after** (consent date + 30 days).
- **Client approval / consent flow** — `GET/POST /handshake/consent/:token`: client reviews the itemized
  inventory and approves or pulls items; pulled items flip to `clientPulled + disposition:"return"` and
  drop out of the payout total. Decision advances the handshake to `review`.

### API surface (`routes/handshake.ts`, ~15 KB, complete)
`POST /handshake/intake` (gate-enforced, with email-fallback if DB down — never loses a lead),
`GET /handshake` (board), `GET /handshake/:id`, `POST /:id/advance` (runs step action + emails client),
`POST /:id/items` + `/:id/items/:itemId` (inventory + sale actuals), `POST /:id/send-report`
(itemized report + consent link), `POST /:id/payout` (computes total, sets payout date, emails),
consent GET/POST, `GET /handshake/dashboard`. Resend email with graceful fallback; optional portable
`WEBHOOK_URL` push to any external CRM.

### DB schema detail (`lib/db/src/schema/handshake.ts`)
- `handshakes` — client/engagement fields, the legal gate columns (`agreementAccepted`,
  `agreementTimestamp`, `signatureName`, `blocked`), per-step timestamps, `consentDecision`,
  and payout columns incl. **`payoutClientTotalCents` (integer cents)**.
- `handshakeItems` — `tier` (standard/contemporary/designer/luxury), `disposition`
  (list/donate/return/biohazard), estimate cents (`startPriceCents`, `estSaleCents`, `estTurnDays`),
  `clientPulled`, and sold actuals (`soldGrossCents`, `feesCents`, `shippingCents`, `netClientCents`).
- `handshakeEvents` — immutable audit log (one row per action; `detail` jsonb).
- Drizzle-zod insert schemas exported.

### Completeness / verification
- ✅ **Logic unit tests** pass per `HANDSHAKE.md`: 12/12 (gate, step machine, payout math incl. the
  $26 case, payout-date rule). Tests are self-contained — `node --experimental-strip-types logic.test.ts`.
- ✅ **Type safety / server build / site build** reported passing in the manual.
- ✅ **DB round-trip** has a real simulation script (`simulate-intake.ts`) that inserts a contact +
  handshake, verifies persistence, advances steps, and cleans up.
- ⏳ Only outstanding item is live Postgres round-trip + real email send (needs `DATABASE_URL` +
  `RESEND_API_KEY` set on deploy) — the logic it depends on is already proven.

### ⚠️ One discrepancy to flag (not a blocker)
Tier splits differ between two sources of truth:
- **Engine (`logic.ts`)**: standard 40 / contemporary 45 / designer 50 / luxury 60 (client share).
- **`CLAUDE.md` brand reference**: Clothing 45/55, Designer & Luxury 50/50, Furniture 50/50.
These do not map 1:1. Whoever builds on this must reconcile the canonical split table (the code is
the place to change it — it's a single `TIER_SHARE` constant).

---

## Repo 2 — `Resell-Google-App-v5.3.2026`  (AI pricing/inventory feeder)

- **Description:** "Rebuild"
- **Stack:** Google AI Studio export — Vite + React + TypeScript, Express, **Firebase/Firestore**,
  **Gemini** (`@google/genai`), multer. README is the stock AI Studio "Run and deploy your AI Studio app".
- **Last commit:** 2026-06-03 (`714a020`, merge of Firestore error-handling fix; earlier work by
  google-labs-jules bot).
- **What it actually does:** Upload product images → `POST /api/process-images` (`server.ts`) sends them
  to Gemini 1.5 Flash with the **"DB Strategic Resale Engine"** prompt, which returns a consolidated,
  deduplicated inventory JSON: `Brand, Model, MarketPrice, FloorPrice, Platform, Status`. Includes
  **platform routing** logic (Small/Luxury→eBay/Poshmark, Vintage/Handmade→Etsy, Large/High-end→Chairish,
  Bulky→FB Marketplace). Results are written to Firestore in a `writeBatch`; `App.tsx` renders a live
  inventory grid with market/floor price.
- **Business logic present:** AI-assisted **inventory creation, pricing (market + floor), dedup, and
  platform routing**. No intake, no splits, no payout, no chain-of-custody, no consent.
- **Files:** `server.ts` (Gemini route), `src/App.tsx` (inventory UI), `src/lib/firebase.ts`,
  `firestore.rules`, `firebase-blueprint.json`.
- **Completeness:** Runnable demo (needs `GEMINI_API_KEY` + Firebase config). No tests. `ownerId` is a
  hardcoded `'placeholder_user_id'` (auth not wired). It's a prototype pricing/intake-listing helper.

## Repo 3 — `SHIPWEIGHT`  (AI shipping-weight feeder)

- **Stack:** Same AI Studio template (Vite + React + TS + Express + Gemini). Stock README.
- **Last commit:** 2026-05-13 (`582a63a`, "Initialize ShipWeight Estimator app") — oldest/least active.
- **What it does:** `src/lib/gemini.ts` — `estimateWeightFromDescription()` and `estimateBulkWeights()`
  call Gemini (gemini-3-flash-preview) with a structured JSON schema to estimate **shipping weight in
  ounces + packaging type** from an item description/value (box vs padded vs poly mailer; high-value/
  designer → box). `src/constants/shippingData.ts` holds shipping presets/cost data; `App.tsx` (~22 KB)
  is the UI.
- **Business logic present:** Shipping weight + packaging estimation only. Directly relevant because the
  Handshake payout math subtracts `shippingCents` — this is the tool that would produce that number.
- **Completeness:** Runnable demo, no tests, no persistence beyond constants. No Firebase wiring.

---

## Ranking & reuse map

| Rank | Repo | Role | Reusable pieces (paths) |
|------|------|------|--------------------------|
| **1** | **Well_Livedv5.1** | **The consignment engine — build on this** | `artifacts/api-server/src/handshake/logic.ts` (gate, step machine, splits, payout, dates), `logic.test.ts`, `routes/handshake.ts` (full API + consent + payout), `handshake/storage.ts`, `lib/db/src/schema/handshake.ts`, `handshake/dashboard.html.ts`, `scripts/src/simulate-intake.ts` |
| 2 | Resell-Google-App-v5.3.2026 | Pricing/inventory feeder | `server.ts` Gemini prompt (pricing + platform routing); maps to `handshakeItems.estSaleCents`/`startPriceCents`/`platform` |
| 3 | SHIPWEIGHT | Shipping-cost feeder | `src/lib/gemini.ts` weight/packaging estimator; maps to `handshakeItems.shippingCents` for payout math |

### What's reusable as-is from the winner
- **`logic.ts`** is the crown jewel: zero imports, pure, unit-tested. Copy/keep verbatim. It encodes
  the chain-of-custody order, the legal gate, the tier splits, the cents-based payout math, and the
  payout-date rule — exactly the business logic Dayna's model needs.
- **`schema/handshake.ts`** is a clean, audit-friendly data model (intake gate columns, per-step
  timestamps, item tiers/dispositions, cents everywhere, immutable event log).
- **`routes/handshake.ts`** is a working end-to-end operational API (intake gate → board → advance →
  report → consent → payout) with email + webhook seams.

### What's missing / to finish
- Reconcile the **tier split table** (`logic.ts` `TIER_SHARE`) with the brand split table in `CLAUDE.md`.
- Live **Postgres** + **Resend** secrets to flip the last ⏳ (logic already proven).
- Auth on the internal dashboard (doc says keep behind hosting auth — not enforced in code).
- The two Gemini apps are **not integrated** with the engine yet; their outputs (price, shipping
  weight/cost) would need to flow into `handshakeItems` (`estSaleCents`, `shippingCents`) — today
  that's manual via `POST /:id/items`.

---

*All paths above are within `github.com/dbrownla5/<repo>` on branch `main`. Inspection read-only.*
