# 07 — Stack & Lock-in

The company's code is split across **two Google-adjacent silos** with two
competing data models for the same underlying inventory. This is the technical
knot to untie.

## The stack (as-is)
| Piece | Runs on | Notes |
|---|---|---|
| Client consignment portal | **Supabase** (DB + magic-link auth) | `handshakes` / `handshake_items` tables; anon key inline in HTML |
| Resale intake/routing engine | **Firebase / Firestore + Google Cloud** | `items` collection; owner-scoped rules; web API key committed; auth not fully wired |
| Shipping-weight tool | **Google Gemini** (AI Studio applet) | `gemini-3-flash-preview`; pulls inventory from **Nifty** |
| Content/site builds | **Netlify** (hosting), **Supabase** (future CRM), **Resend** (email), **Auth0** (some builds) | React/Vite + serverless |
| AI throughout | **Gemini** and **OpenAI** libs | mixed |

## The lock-in to cut (Dayna's stated direction: no Firebase / no cloud trap)
1. **Firebase / Firestore (resale engine)** — the clearest lock-in to remove.
   Its `items` model overlaps the portal's Supabase `handshake_items`.
2. **Two data models → one.** Reconcile Firestore `items` vs Supabase
   `handshake_items` into a single inventory source. (Recommendation: standardize
   on Supabase, since the client-facing portal and future CRM already use it — but
   that's a decision, see `DECISIONS.md`.)
3. **Gemini / Google AI Studio** — the tools are AI-Studio applets. Decide whether
   to keep Gemini or move the AI calls to a provider Dayna controls.
4. **Nifty** — fine as an ops board, but note it's a dependency for shipping.

## Security note (already known — not new)
Keys were committed in public source repos — the Supabase anon key is still live
in `wlc-portal/index.html` and the Firebase web key in
`Resell-Google-App/firebase-applet-config.json`. These are low-sensitivity
anon/web keys by design, but they remain in source. Old news, not a blocker for
consolidation — noted only so the stack doc is complete. Rotate on the normal cleanup.

_Sources: wlc-portal, Resell-Google-App (firebase-*), SHIPWEIGHT, wlc-build-2026
(.env references), for_referencev5.1._
