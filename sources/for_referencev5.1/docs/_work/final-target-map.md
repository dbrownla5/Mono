# Final Target Map — One Clean Repo

Purpose: show what survives into the final repo once drift is removed.

The final repo is not “the resale app.” It is the full operating system for the business, with resale as one lane inside it.

## Core rule

Everything in the final repo should support this chain:

**one intake → one client record → routed service workflow → dashboard visibility → client-facing follow-through**

## What belongs in the final repo

| Layer | What it is | Existing assets to keep | What still needs wiring or build-out |
|---|---|---|---|
| Intake | One conditional entry form for all services | `docs/CRM-AND-INTAKE.md` model, current contact route, current resale intake gate | Unify all paths behind one branching intake and write every path into one client model |
| Client record / CRM spine | The central customer account and history | `contact_submissions`, `handshakes`, dashboard intent in `docs/CRM-AND-INTAKE.md` | Dedupe, unified profile, notes, tags, follow-ups, service history, documents, money view |
| Operator dashboard | Dayna's internal business cockpit | Existing `/api/handshake/dashboard` seam, handshake board behaviors | Expand beyond resale so it handles clients, calendar, agreements, messages, and money |
| Resale handshake lane | The chain-of-custody workflow for resale only | Handshake schema, logic, routes, consent flow, payout logic | Keep intact and connect more cleanly to the unified client profile |
| Client portal | The client-facing account surface | Portal spec in `docs/CRM-AND-INTAKE.md` | Auth, booking/status visibility, messaging, uploads, resale visibility, documents |
| Agreements and documents | E-sign, signed PDFs, uploads, status tracking | Current gate concept, agreement spec in `docs/CRM-AND-INTAKE.md` | Full document generation, audit trail, storage, resend, dashboard controls |
| Messaging and notifications | Client communication inside the system | Current email seam, notification spec | Unified thread model, portal/dashboard replies, email notices |
| Payments and money | Current manual payment reality with future flexibility | Zelle-now / Stripe-later rules in `docs/CRM-AND-INTAKE.md` | Provider-agnostic payment state, dashboard money view, client-visible payment status |
| Copy and voice layer | Public explanation of what the business does | Voice audit tool, brand constants, founder voice and marketing docs | Rewrite against founder truth after the operating model is locked |
| Marketing guidance | Outcome framing and conversion logic | `docs/brand-source/marketing-strategy-2026-06-11.md`, `docs/RESULTS-PLAN.md` | Extract reusable messaging without letting it override the business structure |

## What gets discarded

- Any assumption that the most finished-looking repo is the source of truth.
- Any copy that sounds more like a seminar, agency pitch, or AI smoothing layer than Dayna.
- Any structure that treats resale as the entire company.
- Any duplicate workflow that rebuilds tools already present in this workspace.
- Any “source of truth” instruction that points agents back toward legacy repos without a fragment-by-fragment review.

## What gets rewritten

- Copy that explains the business incorrectly, even if it sounds polished.
- Any instructions that collapse the CRM, portal, dashboard, and handshake into separate app ideas instead of one business system.
- Any downstream summaries that blur founder truth with reused AI wording.

## What gets wired together instead of rebuilt

- Contact capture + handshake capture
- Handshake dashboard + broader CRM dashboard
- Intake branching + client profile creation
- Agreement gate + full e-sign/document system
- Voice audit tooling + copy review process
- Brand constants + page content imports

## Order of consolidation

1. Lock founder truth.
2. Judge fragments by business category.
3. Keep built and aligned pieces first.
4. Wire half-built aligned pieces into the same spine.
5. Pull in planned aligned pieces only after they have a clear home.
6. Rewrite copy last, after the system map is stable.
