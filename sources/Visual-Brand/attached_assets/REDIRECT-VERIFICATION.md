# Redirect Verification Checklist — welldressedcitizen.com → thewelllivedcitizen.com

Run this any time after a deploy to confirm the old domain still forwards to the live site.
The redirect itself is configured at IONOS (domain forwarding), not in the website code.

## A. Three curl commands (paste into Terminal)

Each should return a 301 or 302 with a `Location:` header pointing at `https://thewelllivedcitizen.com/...`.

```bash
# 1. Bare apex
curl -sSI https://welldressedcitizen.com | grep -iE 'HTTP/|location'

# 2. www subdomain
curl -sSI https://www.welldressedcitizen.com | grep -iE 'HTTP/|location'

# 3. A nested path (proves path is preserved, not just root)
curl -sSI https://welldressedcitizen.com/services | grep -iE 'HTTP/|location'
```

Expected output for each (status code may be 301 or 302):

```
HTTP/2 301
location: https://thewelllivedcitizen.com/...
```

## B. Two browser checks

1. Open a fresh private/incognito window. Go to `https://welldressedcitizen.com`.
   - Address bar should end up at `https://thewelllivedcitizen.com/` and show the live site.
2. In the same private window, go to `https://www.welldressedcitizen.com/contact`.
   - Address bar should end up at `https://thewelllivedcitizen.com/contact` and show the contact page.

## C. If any test above fails

1. Sign in to IONOS → **Domains & SSL** → click `welldressedcitizen.com`.
2. Open the **Destination** (or **Domain forwarding**) panel.
3. Confirm:
   - Forwarding type: **HTTP redirect** (301 permanent).
   - Target URL: `https://thewelllivedcitizen.com`
   - "Forward subdomains" / "Forward paths" enabled so `/services` etc. are preserved.
4. Save, wait ~5 minutes for DNS/redirect to propagate, then re-run section A.
5. Also confirm `www.welldressedcitizen.com` either has the same forwarding rule or a CNAME pointing to the apex.

## D. After all checks pass

Paste this URL into Google Search Console → **Sitemaps**:

```
https://thewelllivedcitizen.com/sitemap.xml
```
