# The Well Lived Citizen — New Task Brief

**Date:** April 18, 2026
**For:** The next agent picking this up
**From:** Dayna Brown (owner) via previous session

---

## What This Project Is

Dayna Brown owns The Well Lived Citizen — a concierge home & life services business in Los Angeles (legal entity: Well Dressed Citizen LLC). She rebuilt her website over the last two days on Replit. The site is live at **thewelllivedcitizen.com**. She has disconnected it from Replit and needs it moved to hosting she controls.

## What Needs to Happen

1. **Take the site off Replit and deploy it on a server Dayna controls.** The site is currently live at thewelllivedcitizen.com, served by Google Frontend (Replit's infrastructure). Dayna needs it on her own hosting. The site has a `/api/business-info` endpoint that dynamically populates contact info — that needs to work too.

2. **Build a separate admin dashboard.** A live interface where Dayna can manage business info, content, and sources of truth. This is the "living database" so she and any agent are never out of sync.

3. **Set up a 301 redirect** from thewelllivedcitizenco.com (old domain with "co") to thewelllivedcitizen.com (current domain).

4. **Fix the contact form.** Formspree endpoint xreojkvo — Replit masked it or broke it. Google rejects it. Nothing works behind it. Fix it so submissions actually reach dayna@thewelllivedcitizen.com.

5. **Fix CTA buttons and chat integrations.** Audit every page. All tel: links, mailto: links, social links, and any chat widgets need to be direct, working, unmasked.

6. **Fix social links.** Dayna was doing these manually. They need to be wired properly in the code.

7. **Publish today's content** for all agents to use — keep the living database current.

## What Went Wrong in This Session — DO NOT REPEAT

- The previous agent extracted the site from the live URL but Replit had already modified files after 8 AM PDT April 17, 2026. Those extracted files may be compromised.
- The previous agent kept an old pre-Replit backup instead of saving the Replit UI version when asked.
- The previous agent spun up deployment subtasks using potentially bad files before confirming with Dayna.
- The previous agent referenced Netlify repeatedly after being told Netlify is gone.
- Credits were wasted on work built from the wrong source files.

## Trust Boundary — CRITICAL

**Any files modified after 8:00 AM PDT April 17, 2026 by Replit are QUESTIONABLE.** Do not use extracted files as source of truth without Dayna's confirmation. Ask Dayna what's clean before building anything.

## Where to Get Clean Files

**ASK DAYNA.** She has the correct version. Do not assume the extracted files in this sandbox are correct. Do not assume the live site is correct. She will tell you what to use.

## The Skill

The skill at `/home/ubuntu/skills/well-lived-citizen/SKILL.md` contains the full brand bible, account info, behavioral expectations, and rules. Read it first. It is the operational playbook for this project.

## Connected Resources

- Dayna's desktop is connected for file access
- CloudFS is connected
- These are the only channels for the domains in use

## Budget

14,000 credits remaining for the month. The previous session burned ~26,000 on work that had to be redone. Every cycle counts. Be efficient. Come back with work better than expected.
