# Workspace-Specific AI Guidelines — The Well Lived Citizen

All AI agents working within this workspace must adhere to the following rules:

## 1. Single Source of Truth
* **CRITICAL:** You must read [WLC-CANONICAL-TRUTH.md](file:///C:/Users/dayna/iCloudDrive/Documents/Well_Lived/WLC-CANONICAL-TRUTH.md) immediately upon startup.
* This file defines the actual services, how they work, why they are different, how they function, and how to present them.
* Do NOT read from stale archives, `C:\Users\dayna\dev`, or `G:\My Drive` for business details.
* Any changes to pricing, commission splits, tone guidelines, or flow must be written to `WLC-CANONICAL-TRUTH.md` and approved by Dayna.

## 2. No Code/Copy Drift
* All client-facing code must import brand details from `brand.ts` and page copy from `copy.ts`. Never hardcode copy, pricing, splits, or pillar details in page components.
* Before modifying any page content, run a comparison against `WLC-CANONICAL-TRUTH.md` to ensure the brand voice rules (The Kitchen Rule, banned words) are strictly followed.

## 3. Communication Rhythm
* Match Dayna's pace. Keep responses concise, direct, and focused on operational deliverables.
* Never show code blocks, diffs, or generic AI summaries unless explicitly requested.
* Do not give generic customer service apologies or boilerplate AI statements. Keep it dry, Capable Millennial register.
