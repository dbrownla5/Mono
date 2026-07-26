# 06 — What's actually BUILT + Operations

This is the salvageable engineering and operational IP — real, not drift.

## Built software
- **Client consignment portal** (`wlc-portal/index.html`) — clients see every
  piece they handed over, WLC's proposed price, and **Approve / Suggest price /
  Pull** each item. Passwordless email magic-link (Supabase OTP). *"Nothing goes
  live until you say so."* Data model: `handshakes` + `handshake_items` (prices
  in cents; states Approved/Pulled). **This is the finished client-facing voice** too.
- **E-sign consignment flow** (`well-lived-citizen` app) — the built "handshake":
  tRPC inquiry intake + attachments, admin dashboard (`/admin`), signature canvas
  (`/sign/:token`), server-side PDF generation (`pdf-lib`), auto-send on resale
  inquiry. Drizzle schema + migrations present.
- **Handshake state engine + APIs** (`for_referencev5.1` / `ReplitFinal`) —
  9-step chain-of-custody, unit-tested (12/12); contact + voice + handshake APIs;
  DB schemas; single-source `brand.ts`.

## Operational IP (hard-won, reusable)
- **Resale platform routing** (see `05-RESALE.md`).
- **Shipping rate tables** (`SHIPWEIGHT`): Poshmark flat **$7.97** ≤5lb · eBay
  Ground Advantage 4oz $4.15 / 8oz $4.90 / 12oz $5.60 / 15.9oz $6.80; Priority
  1–2lb $8.50 … 4–5lb $19.20 · Etsy & UPS ladders. Value threshold **>$60 = box it.**
- **Packaging heuristics:** always add packaging weight; high-value/designer →
  box (+6–8oz); large purses → box (+10–12oz); belts/silk/delicates → padded
  mailer (+1.5–2oz); standard clothing → poly mailer + tissue (+1oz); prefer USPS
  Ground Advantage. Reference weights (oz): tee 7 · jeans 24 · hoodie 20 · sneakers 32 · boots 48.
- **Inventory board:** **Nifty (niftypm.com)** is used as the task/inventory
  system of record for bulk shipping.

## Design system (two related palettes to reconcile)
- **"West Coast Modernism"** (chosen direction, `well-lived-citizen/ideas.md`):
  cream `#F5F0E8` · near-black `#1C1917` · sage `#C2D0C8` · rust `#B85C38`;
  **Plus Jakarta Sans**; no rounded corners / no gradients. Appears in the built site.
- **Client portal** (`wlc-portal`): parchment `#F3EFE9` · ink `#2D2F2F` · terracotta
  `#8C5542` · sage `#5b6b54`; **Inter**; flat **4px 4px 0** offset drop-shadow (letterpress/editorial).
- These are the same family (cream/ink/sage + a warm rust/terracotta accent) —
  **pick one canonical token set** (see `DECISIONS.md`). No logo file exists yet;
  the brand lives inline in these files.

_Sources: wlc-portal, well-lived-citizen (app + ideas.md), SHIPWEIGHT,
Resell-Google-App, for_referencev5.1 / ReplitFinal._
