# Fact-Check Narrative Template

## Purpose

This format turns a build-agent audit into a fast mobile review flow for Dayna. It is designed for voice reply, not long typing. Each item should present the current believed fact, why it matters, and the fastest response path: **yes**, **no**, or **corrected value**.

## Review Rules

| Rule | Application |
|---|---|
| One fact per item | Avoid stacked questions that force repeated clarification. |
| Plain language first | Use business language, not technical labels, on the visible layer. |
| Correction-friendly | Every item must be answerable with a short spoken correction. |
| Confidence visible behind the scenes | The system should preserve whether the fact came from Dayna, the build agent, or a noisy file. |
| Only ask what is needed | Do not make Dayna reapprove facts already confirmed directly. |

## Item Structure

| Field | Meaning |
|---|---|
| Category | Contact, social, payments, service, domain, brand, or workflow |
| Proposed fact | What the system currently believes is true |
| Source | Where the fact came from |
| Confidence | High, medium, or low |
| Voice review prompt | Short sentence Dayna can answer by voice |
| Accepted responses | Yes, no, or corrected value |
| Update behavior | What the dashboard should do after Dayna replies |

## Example Review Items

| Category | Proposed Fact | Source | Confidence | Voice Review Prompt | Accepted Responses | Update Behavior |
|---|---|---|---|---|---|---|
| Contact | The main phone number is 3234331350. | Repeated in prior instruction and JSON reference | High | Is 3234331350 still the main phone number? | Yes / No / New phone number | If yes, mark confirmed. If corrected, replace and timestamp. |
| Contact | The main email is dayna@thewelllivedcitizen.com. | JSON reference | Medium | Is dayna@thewelllivedcitizen.com still the right main email? | Yes / No / New email | If corrected, replace and mark prior value superseded. |
| Social | The main Instagram is @thewelllivedcitizen. | JSON reference and prior instruction | High | Is @thewelllivedcitizen still the main Instagram? | Yes / No / New handle | Update active social record. |
| Workflow | The old-domain redirect should still be set up. | Prior task brief only | Low | Do we still care about redirecting the old co domain, or is that dead? | Yes / No / Clarifying note | If no, retire the item from active asks. |

## Mobile Review Pattern

The ideal mobile screen should show a short stack of review cards. Each card should present a single statement and three clear actions: confirm, correct, or defer. The interface should minimize typing and let Dayna move quickly through a queue of facts from the builder or from noisy sources.

## Output After Review

After Dayna responds, the system should produce three outputs at once: an updated source-of-truth record, a resolved-or-pending checklist update, and a clean handoff note for the build agent.
