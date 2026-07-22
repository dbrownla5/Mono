# INDEX — every source repo, its bucket, its status

This is the tracker. Every repo in the GitHub account (except `Mono` itself) is
listed here. We work down the list, one repo at a time.

**Status key:** ⬜ not reviewed · 🟡 in progress · ✅ extracted · ⏭️ skipped (nothing to salvage)

**Bucket column** is a *provisional guess from the repo name only.* A `?` means
low confidence — it gets confirmed or moved the moment the repo is opened.

_37 source repos · 0 reviewed · 37 remaining_

---

## commerce-workflow — dashboard ↔ reseller ↔ handshake (the connected flow)

| Status | Repo | Bucket confidence | Notes |
|---|---|---|---|
| ⬜ | `Dashboard-` | high | one of the connected trio |
| ⬜ | `handshake-dashboard` | high | one of the connected trio (private) |
| ⬜ | `Resell-Google-App-v5.3.2026` | high | reseller tool, most recent commerce push |
| ⬜ | `Propertyv050826` | ? | property angle — confirm if part of this flow (private) |
| ⬜ | `SHIPWEIGHT` | ? | shipping/weight — likely reseller ops (archived) |

## well-lived-citizen — the WLC content + brand universe

| Status | Repo | Bucket confidence | Notes |
|---|---|---|---|
| ⬜ | `well-lived-citizen` | high | core WLC |
| ⬜ | `well-lived-citizen-manus` | high | WLC variant |
| ⬜ | `well-lived-citizenV.5.13` | high | WLC version (private) |
| ⬜ | `well-lived-citizen-site` | high | WLC site (private) |
| ⬜ | `the-well-lived-citizen-rebuild` | high | WLC rebuild (private) |
| ⬜ | `wlc-portal` | high | WLC portal |
| ⬜ | `wlc-june-2026` | high | WLC snapshot (private) |
| ⬜ | `wlc-build-2026` | high | WLC build |

## brand-studio — visual brand, studio, design assets

| Status | Repo | Bucket confidence | Notes |
|---|---|---|---|
| ⬜ | `Visual-Brand` | high | brand assets (private) |
| ⬜ | `Visual-Brand-Boost` | high | brand assets (private) |
| ⬜ | `Studio-content-` | ? | studio content — may be content-heavy for WLC too |

## business-agent — agents + content-extraction engines

| Status | Repo | Bucket confidence | Notes |
|---|---|---|---|
| ⬜ | `BUSINESS-AGENT` | high | agent (private) |
| ⬜ | `Content-Extractor` | high | content extraction engine (private) |
| ⬜ | `repo-digest` | high | repo digest tool (fork) |

## dev-tooling — Claude Code config, skills, dev workflow

| Status | Repo | Bucket confidence | Notes |
|---|---|---|---|
| ⬜ | `claude-code-best-practice` | high | Claude Code patterns (fork) |
| ⬜ | `skills` | high | skills registry (fork) |

## reference — retired, forks, boilerplates (salvage only, triage before trusting)

| Status | Repo | Bucket confidence | Notes |
|---|---|---|---|
| ⬜ | `WEBREBUILD` | ? | web rebuild — could be commerce or WLC, triage (private) |
| ⬜ | `May24` | ? | dated snapshot — unknown contents, triage |
| ⬜ | `team-project-build` | ? | project build — unknown, triage (private) |
| ⬜ | `ReplitFinal_referenceonlyretired` | high | explicitly reference-only / retired |
| ⬜ | `for_referencev5.1` | high | explicitly reference |
| ⬜ | `replit_updatedv5.5.2026` | ? | Replit export — triage for salvage |
| ⬜ | `solid-couscous` | ? | auto-named repo — unknown, triage |
| ⬜ | `nextjs-boilerplate` | high | boilerplate — likely nothing custom (private) |
| ⬜ | `vercel-ai-gateway-demo` | high | demo (private) |
| ⬜ | `vero-for-vercel` | high | Vercel scaffold (fork) |
| ⬜ | `git-clone-...-vero.git-cd-vero` | high | accidental repo from a shell command (private) |
| ⬜ | `ai-pricing` | high | fork — reference |
| ⬜ | `antigravity_phone_chat` | high | fork — reference |
| ⬜ | `github-action` | high | fork — reference |
| ⬜ | `whisper` | high | fork — reference (transcription) |
| ⬜ | `dayna-brown` | ? | personal/archived — triage (private, archived) |

---

## Suggested order of attack

We don't have to review in list order. A sensible pass:

1. **business-agent** first — `Content-Extractor` and `repo-digest` may be the
   very tools that help extract everything else faster.
2. **commerce-workflow** — the connected dashboard/reseller/handshake flow, since
   that's an active intent.
3. **well-lived-citizen** — the biggest content pile; where most "dripped" writing lives.
4. **brand-studio** — brand + design assets.
5. **dev-tooling** — Claude Code setup (helps future sessions run smoother).
6. **reference** — quick triage passes; salvage only what's real.
