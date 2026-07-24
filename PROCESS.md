# PROCESS — methodical extraction, repo by repo

This is the operating doctrine for Mono. It exists to answer one question:
**how do we get everything useful out of ~37 scattered repos and leave the drift
behind — without the assistant getting carried away and inventing things?**

## The one principle everything hangs on

**We ADD nothing. We only MOVE what already exists.**

The master tool is not built here — it is *assembled*. Every repo already holds
one correct piece, usually wrapped in the wrong content. We find that piece,
carry it to Mono, and leave the rest behind. No new features. No new businesses.
No new themes. No rebuilding. Gathering, not generating.

---

## Two speeds — and bulk is the default

- **Bulk fan-out (default):** spawn a **fleet of `repo-extractor` subagents** that
  process many repos at once, in parallel. Each drops its source repo into the
  right one of the **4 groups** and logs any conflicts to the ledger. Dayna is not
  asked anything per repo. The goal is to get from **37 scattered repos down to 4
  consolidated groups she can edit down** at her own pace — not a hand-held,
  one-at-a-time audit.
- **Single-repo (only when asked):** run one `repo-extractor` for a close look.

## The 4 groups (what the 37 collapse into)

1. **well-lived-citizen** — WLC content, brand, voice, site (absorbs brand/studio)
2. **commerce-workflow** — dashboard ↔ reseller ↔ handshake ↔ property/shipping
3. **tooling** — agents, extractors, Claude Code config, skills
4. **reference** — retired, forks, boilerplates, unknowns (triage/archive)

## The loop (it carries across ALL repos — it does not stop at two)

The queue is `INDEX.md`. Each repo goes through four phases. In bulk mode the
phases still happen — just across many agents at once instead of one at a time.

### Phase 1 — INGEST (mechanical, zero judgment)
- Bring the repo in read-only.
- Produce an **INVENTORY**: every file, what it is (code / content / config /
  asset), its size, and whether it touches Firebase or cloud lock-in.
- Copy the repo **verbatim** into `_incoming/<repo>/`. Nothing overwritten,
  nothing merged, nothing lost. (This is the controlled version of "squash it
  all in" — same result, without 37 files colliding onto each other.)
- **No keep/drop decisions happen here.** This phase only catalogs.

### Phase 2 — EXTRACT (a constrained move, guided by you)
- Pull the useful pieces into the right bucket's `tools/` or `content/`.
- For each repo, write two plain-language lists:
  - **KEPT** — what moved, and what it's for (in your words, not reinterpreted).
  - **LEFT BEHIND** — the drift. Nothing is deleted from the source; "left
    behind" only means not carried forward into Mono.
- Copy **verbatim**. Concepts are not renamed. Content is not rewritten. Ideas
  are not merged. Structure is not invented.

### Phase 3 — AUDIT (you, on your schedule — not mid-run)
- You review KEPT vs LEFT BEHIND across a whole batch, when you're ready. You have
  final say. Confirmed drift stays out.
- **Conflicts are logged, never asked one at a time.** When two repos disagree
  (e.g. commission %), every version goes to `_audit/CLAIMS-LEDGER.md` with its
  source and date. The `conflict-reconciler` agent then lays the versions side by
  side so you decide **once, from the whole picture** — never repo by repo,
  mid-extraction. No document wins by calling itself "final" or "master."

### Phase 4 — ASSEMBLE (only on your say-so)
- Once the correct parts are gathered by intent, the master tool is simply what
  those parts form together. We connect them only when you decide to — never
  before.

---

## The guardrails (these bind the agent AND the assistant driving it)

These are hard rules. They exist because the failure mode is not laziness — it's
over-eagerness: seeing a "shiny train," interpreting it, and deciding before you do.

1. **Extract, don't invent.** Move what exists. Never generate new features,
   businesses, themes, rules, or content.
2. **Copy verbatim.** Don't rewrite content or rename concepts. Your words stay
   your words.
3. **Flag, don't fix.** Firebase / cloud lock-in gets flagged for removal — not
   worked around, not rebuilt, not "improved."
4. **When unsure, stage it.** Don't discard, and don't enhance. Park it and ask.
5. **No decisions without you.** The agent reports; you decide keep vs drift.
6. **One repo at a time, all the way through.** Finish a repo, report, move to the
   next. Never stop at two. Never widen scope mid-repo.
7. **Never say "it's already built."** State what was *found*, plainly, and let
   the audit decide what that's worth.
8. **Never interrupt Dayna to adjudicate a conflict.** Log it to the ledger and
   move on. No label ("final," "master," "source of truth") is treated as truth.

The spawnable agents:
- `.claude/agents/repo-extractor.md` — one per repo (Phase 1–2), run as a fleet.
- `.claude/agents/conflict-reconciler.md` — consolidates the claims ledger so
  conflicts are decided once, from the whole.
