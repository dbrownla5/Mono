# Site Audit — thewelllivedcitizen.com

**Audit date:** April 18, 2026
**Source:** Live site extraction via curl

## Trust Boundary

Any files modified after 8:00 AM PDT on April 17, 2026 by Replit are QUESTIONABLE. Verify with Dayna before treating as source of truth.

## Clean Findings

- No old domain references (thewelllivedcitizenco.com) found anywhere
- No Replit artifacts, badges, or injected code found
- No Netlify references found
- No retired tagline found
- All 9 pages have correct titles and valid HTML
- All canonical URLs point to thewelllivedcitizen.com (correct domain, no "co")
- All OG URLs match canonical URLs
- GA4 tag G-HN9C986JLW present on all pages
- Schema.org LocalBusiness markup on homepage with correct data

## Items to Note

### Well Dressed Citizen LLC
Footer on all 9 pages shows `Well Dressed Citizen LLC` as the legal entity. This is correct — it's the LLC name.

### Formspree
Contact form on contact.html uses Formspree endpoint `xreojkvo`. This is a third-party form handler — works independently of hosting.

### info-loader.js + /api/business-info
The site uses a JS file that fetches `/api/business-info` on page load to dynamically populate contact info (Zelle email). This endpoint was working at time of extraction. If the site is moved to static hosting, this endpoint will break and fallback text in the HTML will display instead. The only `data-info` attribute currently used is `zelleEmail`.

### No logo-white
The current site only uses `logo-black-ihHrkHSC.png`. No white logo variant exists in this version.

### Hashed Filenames
Asset filenames are Vite build hashes: `style-Dbo472dq.css`, `logo-black-ihHrkHSC.png`, `dayna-CD3hSILn.jpg`. If the site is rebuilt, these hashes will change.

### External Dependencies
- Google Fonts: Plus Jakarta Sans
- Google Analytics: GA4 via googletagmanager.com
- Formspree: form submission handler
- No other third-party scripts detected

### Social Links Present
- Instagram @thewelllivedcitizen (main)
- Instagram @thewelllivedcloset (closet)
- Facebook /thewelllivedcitizen
- All in footer of every page
