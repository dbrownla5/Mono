# DECISIONS — the short list (this is all that's actually open)

After converging every source, almost everything is settled. What's left is a
handful of real decisions. Not 200GB. This page.

## A. Real decisions only Dayna can make (4)

1. **The hero.** Two strong locked versions exist:
   - **"CHAOS WRANGLER / Professional problem solver."** (newest, 6/12), or
   - **"One person for the move, the resale, the storage unit…"** (April, was live).
   Pick one as the public hero; the other stays in the copy library.

2. **The exact final category line.** Direction is locked (*practical operational
   support for complicated modern life; the skill is judgment; support for things
   that fall between categories*). The precise one-sentence wording was still being
   refined ("there is a better way to say that"). Confirm the final line.

3. **One brand token set + a logo.** Two near-identical palettes exist (West Coast
   Modernism cream/near-black/sage/rust + Plus Jakarta Sans; and the portal's
   parchment/ink/terracotta/sage + Inter). Pick one canonical set; commission a
   real logo (none exists yet).

4. **One data model.** Reconcile the resale engine's Firestore `items` with the
   portal's Supabase `handshake_items` into a single inventory source (recommend
   Supabase). This is the technical decision behind cutting Firebase.

## B. Settled — just needs the build/site fixed to match (4 action items)

These are NOT open questions; the answer is on record. The live builds just haven't
caught up. Highest-impact first:

5. **⚠️ Wire the contact form (SHIPPING BLOCKER).** The newest build's contact form
   is a Formspree placeholder (`YOUR_FORM_ID`) — **every submission dies silently.**
   Nothing should ship until intake actually works.
6. **301 the -co domain + kill "Co."** The newest static build still canonicals to
   `thewelllivedcitizenco.com` with a -co email, contradicting the locked identity.
   Redirect the -co domain, sweep "Co.," retire gen-1 listings.
7. **Strike the dead flex-block banks from the site.** `company.md` already recorded
   the banks as DEAD (2/4/6-hr reserved is the model). The **10-hr $1,250 / 25-hr
   $3,150** banks are still published — remove them.
8. **Align payout language.** The signed legal agreement (governing) says **"first
   Monday after each 30-day period."** The live site still says "report by the 1st,
   payout by the 5th." Update the site to the legal wording.

## Everything else is settled (per newest authoritative sources)
Name/entity/contact · what the company is / is not · the four pillars + taglines ·
Fast-Book entry offers · all core pricing · the commission table (client 45 / WLC 55
on clothing — the AWLC "client 55" line was a transcription slip, resolved to the
legal doc) · the voice constants + banned words · the executed resale legal terms ·
the founder background.

## Why this is the useful part
Every prior attempt produced more analysis. This produces the **convergence** —
one place where the company is assembled, and what's left is **4 real decisions +
4 build-fixes**, each phrased in a sentence. Make the four, fix the four, and the
drift is over.
