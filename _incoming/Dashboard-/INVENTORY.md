# INVENTORY — Dashboard-

**What it is:** a small **Google AI Studio / Gemini** React dashboard app — the
"commerce/tooling" side. But its real value here is the **content in `outputs/`
and `references/`**, which is older WLC business material (March/April 2026).

- **Size:** ~464 KB, 21 files. Small.
- **Stack:** React 19 + Vite + Express + `@google/genai` (Gemini). Needs
  `GEMINI_API_KEY`. Recharts, Tailwind, lucide, motion.
- **Cloud flag:** **Google Gemini / AI Studio** dependency (not Firebase, but a
  Google-AI lock-in). Flagged, not touched.

## Map

| Path | Type | Note |
|---|---|---|
| `references/cross_platform_template.md` | **content** ⭐ | "paste into any AI to continue" handoff template — WHO I AM, DECISION LOCK, voice-processing rules |
| `outputs/session_summary.md` | **content** | March 2026 DECISION LOCK (older pricing + taglines). **Personal phone/email redacted in staged copy.** |
| `outputs/manus_build_directive.md` | **content** | full brand/services/pricing directive — older naming (RESET/RECORD/DOORS), dead flex banks |
| `AGENTS.md`, `README.md` | **content** | agent notes + AI-Studio run instructions |
| `src/`, `server.ts`, `vite.config.ts` | **code** | the Gemini dashboard app itself |

## Note

This is one company (WLC) again — even the "dashboard" is WLC content. The app
code is a candidate *tool* for the `commerce-workflow`/`tooling` group; the
content is older drift, logged to the ledger.
