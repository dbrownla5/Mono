# Salvage Audit 11 — Client Consignment Portal vs. Existing Repos

**Date:** 2026-06-29
**Owner:** dbrownla5 (Dayna Brown / The Well Lived Citizen)
**Method:** READ-ONLY GitHub MCP (get_file_contents, search_code, list_commits). No clone, no writes.

## The Real Requirement (judge everything against THIS)

A **client-facing consignment portal**, not an intake/contact form:

1. **Inventory list** — Dayna uploads/sends each client an itemized list of their clothing, with proposed pricing.
2. **Client price-approval** — the CLIENT logs into a portal and APPROVES pricing **per item**.
3. **Monthly reports** — clients receive monthly consignment reports.
4. **Payout tracking** — consignment tracked through to PAYOUT, across the 9-step "Handshake" chain-of-custody.

A client login that shows items and lets the client approve/reject pricing is the load-bearing feature. None of the deployed intake forms are this.

---

## Per-Repo Findings (assigned set)

### 1. handshake-dashboard  *(private, branch `Claude`)*
- **Stack:** React 19 + Vite + Tailwind 4 + shadcn/ui + Wouter. Manus "web-static" template. `server/` and `shared/` are explicitly **placeholder dirs for template compatibility** (per README) — Express `server/index.ts` only serves static files, **no API**.
- **Storage:** NONE. README + commit say "Ready for integration with Google Sheets webhook." Data is `MOCK_HANDSHAKES` hardcoded in React state (`client/src/pages/Dashboard.tsx`). No DB, no Sheets call, no fetch.
- **Client-facing portal/login?** NO. Routes (`client/src/App.tsx`): `/`, `/dashboard`, `/handshakes`, `404`. No auth anywhere. "client" = the Vite frontend folder, not a customer.
- **Inventory list a client can see?** NO. Per-handshake fields are intake-level (name, email, bagsCount, estimatedItems) — no itemized garment list, no per-item pricing.
- **Client approves pricing?** NO. The only "approve" is conceptual: `WORKFLOW_STEPS` step 7 is labeled *"Consent Window — Client approves listings (24h)"* and step 6 *"Intake Report — Send full list with platform routing"*, step 9 *"30-Day Payout — Monthly report and payout cycle"*. These are **just static labels in a step array**. The actual control is `handleAdvanceStep()` — Dayna clicks "Advance to Next Step" on mock data. No client action, no per-item approve/reject.
- **Monthly reports?** NO (label only, step 9). **Payout tracking?** NO (label only).
- **Admin/ops dashboard for Dayna?** YES — the strongest artifact here. `pages/Dashboard.tsx` (13KB): two-column list+detail, status filter tabs (all/active/pending/completed), stats row, `components/HandshakeCard.tsx`, `components/StepIndicator.tsx` rendering the full 9 steps, `components/DashboardLayout.tsx` (sidebar). `ideas.md` documents the sage/gold design intent tied to her brand.
- **Runnable/complete?** Builds and runs as a static demo only; everything is mock. ~30% of an ops UI, 0% of a client portal, 0% backend.
- **Last commit:** 2026-05-30 (Manus agent). Two commits total: bootstrap + the dashboard checkpoint.
- **Verdict:** Best **information-architecture match** to the 9-step model and Dayna's ops side, but it is a front-end mock with no persistence and no client side.

### 2. well-lived-citizen-site  *(private, branch `Claude`)*
- **Stack:** React 19 + Vite client + **real tRPC backend** (`server/routers.ts`) + **Drizzle ORM on MySQL** (`drizzle/schema.ts`, migrations `0000`/`0001`). Manus full-stack template. Has tests (`businessInfo.test.ts`, `auth.logout.test.ts`).
- **Storage:** MySQL via Drizzle (`server/db.ts`, lazy `DATABASE_URL`). This is the only assigned repo with a real, migrated relational DB.
- **Auth / login?** YES, real: Manus OAuth (`users` table, `openId`, `role` enum user/admin), session cookie, `publicProcedure` / `adminProcedure`, owner auto-promoted to admin. BUT it is **admin/owner auth only** — there is no client account concept.
- **Schema scope (decisive):** Only two tables — `users` (auth) and `businessInfo` (a **single-row** business profile: phones, Zelle/Venmo, Instagram/Poshmark/eBay URLs, service summaries). **No consignment, client, inventory, item, pricing, report, or payout tables at all.**
- **Pages:** `Home`, `AdminDashboard.tsx` (edits the businessInfo record — gated by admin), `AdminStatus`, `ComponentShowcase`, `NotFound`. `server/publicSite.ts` serves public business info.
- **Inventory / client approve / monthly reports / payout?** NONE. Not in schema, routers, or UI. The "admin dashboard" the repo description mentions is a **business-info editor**, not a consignment console.
- **Runnable/complete?** Most production-shaped repo (DB, auth, tests, migrations) but **entirely scoped to marketing-site business data**. Last meaningful work 2026-04-25 (recent commits are Dependabot bumps).
- **Verdict:** Best **engineering foundation** (auth + Drizzle/MySQL + tRPC + tests) but zero consignment domain. Net-new everything for the portal; you'd reuse the plumbing, not the features.

### 3. dash  *(public, branch `Claude`)*
- **Contents:** a single 6-byte `README.md`. **Empty/dead.** No stack, no code. Disregard.

### 4. Dashboard-  *(public, branch `main`, desc "Business hub")*
- **Stack:** React + Vite + Express (`server.ts`) + **Google GenAI (Gemini)**. `src/App.tsx` is one 148KB file. `AGENTS.md` / `CREATIVE_PERSONA.md` define it as a **"Creative Partner & Brand Engine"** — a copy/marketing/brainstorming AI assistant for Dayna.
- **Storage:** none relevant (env-key status endpoint, `domain_check.ts`). No client data store.
- **Portal / inventory / approve / reports / payout?** NONE. Explicit boundary in AGENTS.md: "No Direct UI Build for Marketing Sites." It is an internal brand/copy co-pilot, not consignment software.
- **Last commit:** 2026-05-13.
- **Verdict:** Out of scope for the portal. Brand-voice tooling only.

### 5. BUSINESS-AGENT  *(private, branch `main`)*
- **Stack:** React + Vite + **Firebase/Firestore** (`firestore.rules`, `firebase-applet-config.json`) + Gemini. `src/App.tsx` (~7.7KB) + `CREATIVE_PERSONA.md`. Near-identical sibling to `Dashboard-` (same brand-engine persona, Firebase-backed applet).
- **Portal / inventory / approve / reports / payout?** NONE. Another creative/brand agent.
- **Verdict:** Out of scope for the portal.

### Adjacent (not assigned, noted): Resell-Google-App-v5.3.2026  *(public, `main`)*
Firebase/Firestore + Gemini app with `firestore.rules`, `security_spec.md`, `firebase-blueprint.json` — a resale-oriented build with real Firestore security rules. Not analyzed in depth (out of assigned scope) but it is the one repo whose **persistence model (Firestore + auth rules)** could plausibly host multi-client/per-item data. Worth a dedicated audit if the portal goes the Firebase route.

---

## Cross-Repo Code Search
Scoped `search_code` across all four code repos for `approve | inventory | payout`: **0 results.** Confirms none implement client price-approval, inventory, or payout logic. The only occurrences of those concepts are the **static step labels** in handshake-dashboard's `WORKFLOW_STEPS`.

---

## Ranking Against the Real Requirement

| Repo | Client login | Inventory list (per-item) | Client price-approval | Monthly reports | Payout tracking | Backend/DB | As portal foundation |
|---|---|---|---|---|---|---|---|
| **handshake-dashboard** | ✗ | ✗ (intake fields only) | ✗ (label only, Dayna-driven) | ✗ (label) | ✗ (label) | ✗ (mock state) | **Best domain/UX match** |
| **well-lived-citizen-site** | partial (admin OAuth only) | ✗ | ✗ | ✗ | ✗ | ✓ (MySQL+Drizzle+tRPC+auth+tests) | **Best engineering base** |
| dash | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | dead |
| Dashboard- | ✗ | ✗ | ✗ | ✗ | ✗ | partial (Gemini/Express) | no |
| BUSINESS-AGENT | ✗ | ✗ | ✗ | ✗ | ✗ | partial (Firestore) | no |

## Honest Bottom Line
**NO repo implements client price-approval — or any client-facing consignment feature.** Not one of inventory-list, per-item approval, monthly reports, or payout exists as working code anywhere in the assigned set. The closest things are (a) handshake-dashboard's 9-step *labels and ops layout*, and (b) WLC-site's *auth + DB plumbing*.

## Recommended Foundation
**Two-part:** take **well-lived-citizen-site** as the technical base (real Drizzle/MySQL, OAuth users with roles, tRPC, tests, CI) and port **handshake-dashboard**'s 9-step UX (StepIndicator, HandshakeCard, list+detail Dashboard, sage/gold brand) onto it. Then build all four core features net-new:

**Net-new work required (none exists today):**
1. **Schema:** `clients`, `consignments`, `items` (garment, condition, proposedPrice, approvedPrice, status), `reports`, `payouts`. WLC-site has only `users` + single-row `businessInfo`.
2. **Client auth/portal:** extend `users.role` for a `client` role + per-client data scoping (or magic-link login — no magic-link/passwordless code exists in any repo).
3. **Per-item approval flow:** client view of their inventory with approve/reject/counter per item + write-back. Entirely absent.
4. **Monthly reports + payout tracking:** generation, storage, and client-visible history. Only step *labels* exist.

If a Firebase direction is preferred instead, evaluate **Resell-Google-App-v5.3.2026** (already has Firestore rules + a security spec) before committing.
