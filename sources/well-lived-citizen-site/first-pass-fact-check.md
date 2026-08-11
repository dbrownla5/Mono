# First-Pass Fact Check

This review packet is built from the noisy ZIP after triage. It includes only facts that were repeated or potentially useful, plus one clearly uncertain item that should not silently survive.

## Voice Review Queue

| # | Category | Proposed Fact | Confidence | Say This if Correct | Say This if Wrong |
|---|---|---|---|---|---|
| 1 | Business identity | The business name is The Well Lived Citizen. | High | Yes, keep it. | No, change business name to ___. |
| 2 | Legal entity | The legal entity is Well Dressed Citizen LLC. | High | Yes, keep it. | No, legal entity is ___. |
| 3 | Domain | The active domain is thewelllivedcitizen.com. | High | Yes, keep it. | No, active domain is ___. |
| 4 | Contact | The main phone number is 3234331350. | High | Yes, keep it. | No, main phone is ___. |
| 5 | Contact | The main email is dayna@thewelllivedcitizen.com. | Medium | Yes, keep it. | No, main email is ___. |
| 6 | Social | The main Instagram is @thewelllivedcitizen. | High | Yes, keep it. | No, main Instagram is ___. |
| 7 | Social | The closet Instagram is @thewelllivedcloset. | High | Yes, keep it. | No, closet Instagram is ___. |
| 8 | Social | The Facebook handle is /thewelllivedcitizen. | High | Yes, keep it. | No, Facebook is ___. |
| 9 | Payments | Zelle currently points to dayna@thewelllivedcitizen.com. | Medium | Yes, keep it. | No, Zelle should use ___. |
| 10 | Workflow | The old co-domain redirect may still matter. | Low | Yes, still needed. | No, kill that item. |

## How This Should Be Used

The build agent or audit agent can keep generating candidate facts. This file is the human review layer. Dayna should only need to answer with short voice confirmations or corrections, and the system should update the source of truth from those answers rather than asking the same questions again in future sessions.
