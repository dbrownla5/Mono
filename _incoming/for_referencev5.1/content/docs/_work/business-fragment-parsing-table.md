# Business-Fragment Parsing Table

Purpose: separate **collection**, **judgment**, and **consolidation**.

This table is sorted by business fragment, not by repository. Each row captures one useful fragment and judges it against founder truth.

## Status key

- **built + aligned**
- **half-built + aligned**
- **planned + aligned**
- **drifted**
- **duplicate / noise**

## Parsing table (current workspace baseline)

| Business fragment | Source | Fragment type | Status | Founder-truth judgment | Final repo action |
|---|---|---|---|---|---|
| Intake front door | `docs/CRM-AND-INTAKE.md` | workflow spec | planned + aligned | States one conditional intake form as the entry point for every service path. | Keep as the governing intake model. |
| Intake gate for resale | `artifacts/wlc-site/src/components/AgreementGate.tsx`, `docs/HANDSHAKE.md` | built tool + workflow | built + aligned | Proves the resale lane can open a record from a signed intake path. | Keep and fold into the unified intake model as the resale-only legal branch. |
| Contact capture seam | `artifacts/api-server/src/routes/contact.ts`, `lib/db/src/schema/contact.ts` | built tool | built + aligned | Shows that lead capture and persistence exist already, but not yet as the unified client spine. | Keep and re-home under the eventual client-profile model. |
| One client record model | `docs/CRM-AND-INTAKE.md` | data model spec | planned + aligned | Matches the founder requirement that every path becomes a customer account. | Keep as a non-negotiable architecture rule. |
| Current split records | `contact_submissions` + `handshakes` references in `docs/CRM-AND-INTAKE.md` | implementation state | half-built + aligned | The ingredients exist, but they are still separated instead of acting like one client record. | Wire together; do not rebuild from scratch. |
| Operator dashboard | `docs/CRM-AND-INTAKE.md`, `docs/HANDSHAKE.md`, `docs/STATUS.md` | workflow + built seam | half-built + aligned | The handshake dashboard already exists and is the right place to extend, not replace. | Keep the dashboard as the operator center and widen its scope. |
| Resale handshake | `artifacts/api-server/src/routes/handshake.ts`, `artifacts/api-server/src/handshake/logic.ts`, `lib/db/src/schema/handshake.ts` | built tool | built + aligned | Strongest built workflow in the repo; fits the model as one service lane, not the whole business. | Keep intact and embed as the resale ticket system inside the CRM. |
| Handshake as whole business | repeated downstream behavior, corrected by `docs/CRM-AND-INTAKE.md` | interpretation pattern | drifted | This shrinks the company to the resale lane and hides the broader client/account system. | Discard as a governing assumption. |
| Client portal | `docs/CRM-AND-INTAKE.md` | product/workflow spec | planned + aligned | Clearly described as the client-facing surface sharing the same database as the dashboard. | Keep as a target surface for the final repo. |
| Agreements and e-sign | `docs/CRM-AND-INTAKE.md` | workflow spec | planned + aligned | Full e-sign, audit trail, PDF, storage, and status logic are defined and tied to the client profile. | Keep; build on the current gate rather than inventing a separate system. |
| Document uploads | `docs/CRM-AND-INTAKE.md` | workflow spec | planned + aligned | Matches the founder model that the profile carries agreements and other documents. | Keep inside the client profile feature set. |
| Messaging | `docs/CRM-AND-INTAKE.md` | workflow spec | planned + aligned | Messaging belongs inside the portal/dashboard relationship, not as a disconnected tool. | Keep in the final system map. |
| Notifications / email | `docs/HANDSHAKE.md`, `docs/CRM-AND-INTAKE.md` | built seam + spec | half-built + aligned | Resend seam exists; broader notifications are specified but not fully closed. | Keep and expand from the existing email layer. |
| Payments | `docs/CRM-AND-INTAKE.md` | workflow spec | planned + aligned | Correctly treats Zelle as the current operational reality and Stripe as a future drop-in. | Keep provider-agnostic rule. |
| Calendar / follow-up layer | `docs/CRM-AND-INTAKE.md` | workflow spec | planned + aligned | Belongs to the dashboard/client profile spine and supports the real business cadence. | Keep as part of CRM expansion. |
| Voice audit tool | `artifacts/api-server/src/routes/voice.ts`, `voice-audit-report.md` | built tool | built + aligned | Useful only when it serves founder truth and catches drift instead of generating new copy dogma. | Keep as QA, not as strategy. |
| Brand constants | `artifacts/wlc-site/src/content/brand.ts`, `CLAUDE.md` | built tool/rule | built + aligned | Correctly centralizes factual values to reduce future drift. | Keep as the single code truth for facts. |
| “Most finished repo wins” logic | cross-repo failure pattern described by user and countered in `CLAUDE.md` | decision pattern | drifted | Promotes polish over founder intent and causes the wrong repo to become default truth. | Discard. Judge fragments, not repo gloss. |
| Repeated polished wording | `CLAUDE.md`, founder guidance, voice docs | copy pattern | drifted | Repetition can be AI self-copying rather than founder voice. | Discard unless it survives founder-truth review. |
| “Stop building, start selling” prioritization | `docs/RESULTS-PLAN.md` | operating guidance | built + aligned | Useful as a triage rule because it pushes toward finishing a real lane instead of opening more apps. | Keep as consolidation pressure, not as copy. |
| Outcome-first marketing guidance | `docs/brand-source/marketing-strategy-2026-06-11.md` | marketing guidance | planned + aligned | Captures what the customer is actually buying: relief, momentum, competent help. | Keep as marketing skeleton for rewrite work. |
| Founder lineage / story-over-condition | `docs/brand-source/dayna-voice-capture-2026-06-11.md` | founder truth / copy guidance | planned + aligned | Grounds resale authority and voice in founder truth instead of generic resale copy. | Keep as calibration material, not verbatim page copy. |
| Source-of-truth claims that center legacy repos | `docs/WORKING-WITH-DAYNA.md`, `handoff/README.md` | outdated instruction | duplicate / noise | Conflicts with current repo guidance and can pull agents back toward legacy destinations. | Flag for later cleanup; do not treat as current authority. |

## How to use this table on the next repo

1. Pull fragments into these same business categories.
2. Add rows instead of starting a new repo summary.
3. Judge each row against the founder-truth checkpoint first.
4. Promote only the rows that survive into the final target map.
