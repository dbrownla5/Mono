# Task: The Well Lived Citizen — Site Takeover & Launch

## Situation

The Well Lived Citizen (thewelllivedcitizen.com) is a live website for a concierge home & life services business in Los Angeles owned by Dayna Brown. The legal entity is Well Dressed Citizen LLC.

The site was rebuilt by Dayna over the last two days using Replit. It is currently live and served by Replit's infrastructure (Google Frontend). Dayna has disconnected the site from Replit and needs it moved to hosting she controls.

The old domain thewelllivedcitizenco.com (with "co") is retired and needs a 301 redirect to thewelllivedcitizen.com.

There is no Netlify. That hosting is gone.

The site has 9 HTML pages, 1 CSS file, 1 JS file (info-loader.js), and 2 images (logo, photo). It uses a /api/business-info endpoint to dynamically populate contact data. The contact form uses Formspree (endpoint xreojkvo). The form and some links may have issues from the Replit build process.

Dayna's desktop and CloudFS are connected.

## Actions Needed

1. Move the site off Replit infrastructure onto a server Dayna controls
2. Replicate the /api/business-info endpoint so info-loader.js continues working
3. Set up 301 redirect from thewelllivedcitizenco.com to thewelllivedcitizen.com
4. Audit and fix the contact form (Formspree)
5. Audit and fix all CTA buttons, phone links, email links, and social links across all pages
6. Build a separate admin dashboard for managing business info and content
7. Publish content for cross-agent use

## Skill

Load the skill at /home/ubuntu/skills/well-lived-citizen/SKILL.md for brand rules, accounts, behavioral expectations, and reference data.

## Constraints

- The live site is the starting point — it is close to correct but may need fixes
- Do not change any of Dayna's copy or wording
- Do not change the visual design
- Ask Dayna before assuming anything about file correctness
- Be efficient with credits
