# Mobile Review Packet

This packet translates Dayna’s latest working fact set into a faster mobile review model. The goal is to replace long voice correction loops with tap-friendly confirmation patterns. Each row is written so it can become a checkbox, segmented control, or short correction field inside the internal dashboard.

## Working Fact Set

| # | Category | Working Fact | Confidence | Recommended Mobile Control | Options or Expected Input |
|---|---|---|---|---|---|
| 1 | Business identity | The business name is **The Well Lived Citizen**. | High | Checkbox | Keep as-is / Edit text |
| 2 | Legal entity | The legal entity is **Well Dressed Citizen LLC**. | High | Checkbox | Keep as-is / Edit text |
| 3 | Primary domain | The active domain is **thewelllivedcitizen.com**. | High | Checkbox | Keep as-is / Edit text |
| 4 | Domain alias | **welllivedcitizen.com** is also owned and mirrors the primary site. | High | Multiple choice | Keep mirror / Change routing / Remove |
| 5 | Primary contact number | Use **310-993-0204** as the personal mobile contact. | High | Multiple choice | Keep personal mobile / Replace with new number / Mark as unresolved |
| 6 | Main email | The main email is **dayna@thewelllivedcitizen.com**. | Medium | Checkbox | Keep as-is / Edit text |
| 7 | Main Instagram | The main Instagram is **@thewelllivedcitizen**. | High | Checkbox | Keep as-is / Edit handle |
| 8 | Closet Instagram | The closet Instagram is **@thewelllivedcloset**. | High | Checkbox | Keep as-is / Edit handle |
| 9 | Facebook | The Facebook handle is **/thewelllivedcitizen**. | High | Checkbox | Keep as-is / Edit handle |
| 10 | Zelle destination | Zelle points to **dayna@thewelllivedcitizen.com**. | High | Multiple choice | Keep current email / Change to another email / Change to another tag |
| 11 | Redirect behavior | A redirect decision is still needed for the legacy domain or legacy destination behavior. | Medium | Multiple choice | Redirect to primary domain / Redirect to Resell & Consignment page / Remove redirect item |

## UI Translation

The fastest mobile interaction model is not one giant form. It should be a review queue with a short statement, one primary confirmation action, and one alternate correction path. Straight facts such as the business name, legal entity, and social handles should use a simple **keep or edit** pattern. Routing, phone, and payment items should use **multiple-choice controls** because they imply a decision rather than a pure text correction.

## Normalization Notes

| Item | Normalization Decision |
|---|---|
| 5 | The phone decision has been rewritten as a routing choice rather than preserving the longer note about Google Voice and AT&T plan changes inside the visible fact field. That note should live in internal metadata, not in the user-facing fact card. |
| 8 | The phrase about using “gorgeous” styling assets appears unrelated to the social handle itself, so it should be treated as a separate design/archive note rather than a correction to the closet Instagram field. |
| 10 | The note about Zelle tags has been preserved as an alternate-path decision and should be stored as payment metadata if needed. |
| 11 | The original line appears malformed and mixes redirect intent with a search URL. It has been normalized into a cleaner redirect decision that can still be resolved later without carrying forward broken wording. |

## Implementation Direction

Inside the living dashboard, this packet should become a **Review** surface with three behaviors. Confirmed items should immediately move into the current source of truth. Edited items should store both the new value and the superseded value with a timestamp. Unresolved items should move to the requests or blockers queue instead of staying mixed into confirmed facts.
