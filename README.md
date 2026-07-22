# Mono — the clean gathering place

This repo is **one clean home** where the useful pieces from all of Dayna's
scattered GitHub repos get gathered, sorted, and made readable — so the whole
picture can finally be looked at in one place.

It is **not** a rebuild of any project. Nothing is being re-coded here. This is
a place to **extract, organize, and understand** what already exists across ~37
repos, so decisions can be made from a clean view instead of from 100 half-built
drafts scattered everywhere.

---

## The ground rules (read these — they keep us honest)

1. **Everything in the source repos is treated as drift until reviewed.**
   Nothing is assumed finished, correct, or "what was wanted" — even if it looks
   complete. We open each repo with fresh eyes and pull out only what's actually
   useful.

2. **Two things get extracted from every repo — not one:**
   - **Tools** — the working pieces, scripts, agents, and building blocks.
   - **Content** — the writing, drafts, and business concepts that are locked
     inside repos and "dripped" everywhere. We get these *out* into readable
     form so they can actually be passed through and used.

3. **Organize by intent, not by code category.** Things that were *meant to
   work together* live together (e.g. the dashboard, reseller, and handshake
   pieces were meant to be one connected workflow — so they share a bucket).

4. **No Firebase / no cloud lock-in.** Anything tied to Firebase or a cloud
   service we can't get out of gets **flagged, not built on.** We plan to cut
   those dependencies, not extend them.

5. **One repo at a time.** We do not try to build the whole thing at once. Slow,
   clean passes beat fast, messy ones.

---

## How it's organized

```
Mono/
├── README.md      ← you are here (what this is + the rules)
├── INDEX.md       ← the tracker: all 37 source repos, their bucket, their status
├── _incoming/     ← raw staging when a repo is first cracked open
└── buckets/       ← the intent shelves (things meant to work together)
    ├── commerce-workflow/   dashboard ↔ reseller ↔ handshake — the connected sell/ops flow
    ├── well-lived-citizen/  the WLC content + brand universe
    ├── brand-studio/        visual brand, studio, and design assets
    ├── business-agent/      agents + content-extraction engines
    ├── dev-tooling/         Claude Code config, skills, dev workflow
    └── reference/           retired, forks, boilerplates — salvage only, not active
```

As we work a bucket, it grows two sides inside it:
`buckets/<name>/tools/` and `buckets/<name>/content/`.

The buckets above are a **provisional first guess** made from repo names only —
they get confirmed (or moved) the moment we actually open each repo.

---

## The process (one repo at a time)

For each repo in `INDEX.md`:

1. **Open** it and skim what's really there (not what the name promises).
2. **Stage** anything interesting into `_incoming/<repo-name>/`.
3. **Extract** — pull the *tools* and the *content* out of the noise.
4. **Sort** them into the right intent bucket's `tools/` and `content/`.
5. **Flag** any Firebase / cloud lock-in for removal.
6. **Mark** the repo's status in `INDEX.md` and jot what was found.

That's the whole loop. See `INDEX.md` for where we are.
