# INVENTORY — for_referencev5.1

**What this repo actually is:** a full **Well Lived Citizen (WLC / AWLC)** working
system — a React/Vite site plus an API server, wrapped around a deep pile of
**business content**: brand voice, services + pricing master, CRM/intake, the
handshake (bag pickup) flow, launch kits, and social/marketing copy. Despite the
"for reference" name, this is one of the richest content sources in the account.

- **Size:** ~9.2 MB, 260 files. Content is ~0.5 MB of it; the rest is the site code and assets.
- **Stack seen:** React/Vite site, serverless API (Netlify functions), pnpm workspace, Replit origin. Integrations referenced: **Supabase** (future CRM), **Resend** (email), **Netlify** (hosting), **Manus** (task executor), **OpenAI** (lib/integrations-openai-*).

## Top-level map

| Path | Type | Note |
|---|---|---|
| `docs/` (400K) | **content** | brand, services, pricing, CRM, handshake, launch, working-with-Dayna, source-of-truth |
| `docs/brand-source/` | **content** | voice capture, content transformation system, marketing strategy |
| `docs/_work/` | **content** | prior extraction trackers, launch posts, instagram posts, evidence ledger |
| `.agents/memory/` | **content** | memory rules: brand vault, handshake flow, site audit |
| `attached_assets/` (320K) | **content + assets** | brand vault + resale agreement (md); plus binary assets |
| `artifacts/wlc-site/` (7.4M) | **code** | the React/Vite WLC site (single source `src/content/brand.ts`) |
| `artifacts/api-server/` (180K) | **code** | serverless API |
| `lib/` (436K) | **code** | shared libs: api-client, api-spec, zod, db, integrations (incl. OpenAI) |
| `scripts/`, `netlify/`, `*.config` | **code/config** | build + deploy plumbing |
| root `*.md` | **content** | launch-social-posts, voice-audit-report, task, replit, CLAUDE |

## Cloud / lock-in flags (for later removal planning)

- **Supabase** (cloud DB, future CRM), **Netlify** (hosting/deploy), **Resend**
  (email), **Replit** (origin), **OpenAI** libs. No Firebase found. None of this
  is removed or rebuilt here — flagged only.
