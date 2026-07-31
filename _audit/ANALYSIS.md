# Analysis — the drift, and where the past work stalled

Visual version: Miro board "The Well Lived Citizen — Master Workspace"
(https://miro.com/app/board/uXjVH4Yu0Ws=/).

## One company, rebuilt 4 times

The Well Lived Citizen was rebuilt across **four generations**, each with a
different voice and different prices. Nothing locked, so each drifted from the last.

| Gen | When | Voice | Notable |
|---|---|---|---|
| 1 | March 2026 (Dashboard/Manus) | warm, story-first — "Well Placed. Well Dressed (again)." | DOOR 1 THE RESET / DOOR 2 THE RECORD; flex banks LOCKED |
| 2 | May 2026 | BRAND-VOICE locked 5/31 | **Handshake system built + tested (5/30)** — the thing that shipped |
| 3 | June 11 (v5.1) | "CHAOS WRANGLER. Professional Problem Solver." | AWLC master; commission client 55 / Dayna 45 |
| 4 | June 12 (ReplitFinal) | "the skill is JUDGMENT" | memory folder; commission FLIPPED to Dayna 55 / client 45 |

## The decisions that never locked (the engine of the drift)

1. **Identity lock (highest)** — 3 identities across 4 generations, never reconciled.
   Copilot itself ranked this #1, ahead of commission.
2. **Commission split** — flips between repos (client 55/Dayna 45 vs Dayna 55/client 45).
3. **Flex blocks** — March banks LOCKED vs June banks DEAD.
4. **Service naming** — "The Reset/The Record/DOORS" vs the June four-pillar names.
5. Smaller: Full Closet Liquidation tier, home-org minimum, Legacy pricing, dead contact form.

Full evidence with sources + dates: `_audit/CLAIMS-LEDGER.md`.

## Where the past work (Copilot) stalled

Copilot ran a sound method — "every source is evidence, not truth," extracted in
chronological waves — but **only finished Waves 1–2** (inventory + single-repo
pullout). **Wave 3 (cross-repo) and Wave 4 (consolidation) never happened.** It
perfected one repo and never spread; ~15 apps were left un-triaged. The work kept
producing analysis without converging — which is why it stopped feeling like
progress.

## What actually got built (salvageable, not drift)

- **Handshake system** — 9-step chain-of-custody, unit-tested (12/12).
- APIs (contact, voice, handshake), DB schemas, single-source `brand.ts`.
- A deep content/voice library and a `memory/` folder (company, glossary, people).

## The honest read

Almost nothing needs to be *rebuilt*. The company exists in pieces across these
repos. What was missing was never code — it was **one place to see it all and lock
the root decisions.** That's what Mono + the Miro board now provide. The next move
is to finish Waves 3–4 and lock Identity + Commission once, from the whole picture.
