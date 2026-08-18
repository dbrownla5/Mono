# THE LAW — read this before anything else 🦝

*(Repo copy lives at root `CLAUDE.md` so it auto-loads in every Claude session.
It outranks every other document — including `replit.md`, everything in `docs/`,
and anything titled FINAL, MASTER, LOCKED, CANONICAL, or VERBATIM. A title is
not a credential.)*

## The governing law

**The only source of truth is Dayna's voice, validated by Dayna out loud.**

Pricing and services are facts to verify — they are NOT the voice. No document
may be called final until Dayna has signed off on the voice in it, out loud.

The build order, always:

1. **Calibrate** the voice from her real dialogues and captures — never from an
   agent-made master.
2. **She validates it** — read-aloud, believable, sounds-like-her. Recorded in
   `truth/voice/SIGN-OFF-LOG.md`.
3. **Then** check facts (`truth/FACT-LEDGER.md`).
4. **Then** write docs.
5. **Then** a page exists.

**Nothing freezes before step 2.** As of 2026-06-12 the sign-off log is empty:
nothing in this repo is validated. Everything is raw material.

## Why this law exists (the receipts)

The audit (`truth/AUDIT.md`) found, in one night of looking:

- **Six documents** each claiming to be "the source of truth," written by four
  generations of agents, disagreeing with each other.
- **Four different "locked" homepage heroes**, each frozen by a different agent.
- **Three competing commission schemes** — including the live site paying Dayna's
  clients backwards (45/55 against the client; Dayna's ruling is **55/45 in the
  client's favor** for clothing & accessories).
- **An invented quote on her live site.** Her words, on tape: *"I never said this
  quote. It shouldn't be there. I don't like it. It's weird."*

That is what trusting titles instead of Dayna gets you. Don't add a seventh
"source of truth." Feed the one system in `truth/`.

## Precedence (highest wins)

1. **Dayna, live, right now** — but a stray line never overrides a core concept
   built over months. If something new contradicts a validated truth, **flag it
   and ask**; don't silently adopt either one.
2. **`truth/voice/SIGN-OFF-LOG.md`** — what she has validated out loud.
3. **`truth/FACT-LEDGER.md`** — rows marked ✅ verified-by-Dayna.
4. Tier-A sources in `truth/SOURCE-LEDGER.md` (her verbatim words, with provenance).
5. Tier-B distillations (made from her sessions; useful, unvalidated).
6. Everything else — including all of `docs/`, `replit.md`, and old site code —
   is Tier-C raw material. Quote it as a *claim*, never as a fact.

## Hard rules (scars — every one of these was earned)

- **Every fact cites a source. Zero invention.** No quote, price, name, date, or
  testimonial that can't point at where it came from. If you can't cite it, you
  can't write it.
- **Voice-dump ≠ copy.** Dayna talks through ideas to build concepts. Distill the
  concept; never paste her venting as site copy. (She nixed "I never had the
  luxury of not learning how to be all four" herself: "pretentious.")
- **Dayna's logo is untouchable.** Use her files as delivered. Resize only. Never
  recolor, re-key, or generate derivatives. (Canon: the word CITIZEN rides a
  clothes hanger.)
- **Batch changes → ONE deploy.** Deploys can cost her money. Never push per-edit.
- **Never trust tool dashboards. Curl the live site.** "Deployed" in a dashboard
  is a claim; the live HTML is the fact.
- **Never claim "done" without the fact-check passing.** Run `/fact-check` (or
  `node tools/page-audit.mjs`) and show the result. "Done" with a failing check
  is a lie with extra steps.
- **She's not a coder.** Plain language, warm, no jargon, never make her read
  diffs. Explain cost trade-offs out loud. Be honest about what's not done.
- **Read intent, not literal text.** She talks in voice-to-text streams; garbled
  happens. If it's garbled, say so lightly and move on.
- **The raccoon stays.** 🦝 Dry humor welcome. Never terse, never "executing
  directive," never make her feel managed. A jam session, not a ticket queue.

## The map

| Where | What |
|---|---|
| `truth/AUDIT.md` | The audit — what exists, what's trustworthy, what's pending. Start here. |
| `truth/SOURCE-LEDGER.md` | Every source, classified A/B/C with provenance. |
| `truth/FACT-LEDGER.md` | Every fact claim with citations and status. |
| `truth/voice/VOICE-CANDIDATE.md` | The calibrated voice draft — **unvalidated until the log says otherwise**. |
| `truth/voice/primary/` | Her verbatim words (Jam transcript, owner directives). |
| `truth/voice/READ-ALOUD-SESSION.md` | The validation session script (step 2 of the law). |
| `truth/voice/SIGN-OFF-LOG.md` | The only place anything becomes final. |
| `.claude/agents/` | The staff: writer, fact-checker, builder, auditor. |
| `.claude/commands/` | `/caption`, `/voice-check`, `/fact-check`. |
| `tools/page-audit.mjs` | Page fact-check + readability auditor (works on URLs and files). |
| `plans/` | Handshake/dashboard integration plan · the hired-agent plan. |
| `docs/`, `replit.md`, `artifacts/` | Inherited raw material. Suspect by default. |

## Working agreements

- Old repo `dbrownla5/ReplitFinal` is **read-only input**. Never push to it.
- When docs conflict, don't pick a winner silently — add the conflict to
  `truth/FACT-LEDGER.md` and ask Dayna.
- Content generation draws ONLY from Tier-A/B sources and validated entries, with
  line-level citations.
- If you finish a session having changed what's true, update the ledgers in the
  same commit. The ledgers are the memory.