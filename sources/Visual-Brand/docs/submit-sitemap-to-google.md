# Submit the Sitemap to Google Search Console

This guide walks you through verifying `thewelllivedcitizen.com` in Google Search Console and submitting the sitemap so new pages get discovered and indexed faster.

**Time required:** ~5 minutes (plus a few days for Google to finish indexing)

**Sitemap URL:** https://thewelllivedcitizen.com/sitemap.xml
**Robots URL:** https://thewelllivedcitizen.com/robots.txt

---

## Step 1 — Verify ownership of the domain

1. Go to https://search.google.com/search-console
2. Sign in with the Google account you want to manage the site with (use a permanent account, not a personal one you might lose access to).
3. Click **Add property** in the top-left property selector.
4. Choose one of the two verification methods:

### Option A — Domain property (recommended)
Covers every subdomain and both http/https. Requires DNS access.

1. Select **Domain** and enter: `thewelllivedcitizen.com`
2. Click **Continue**. Google will display a **TXT record** that looks like:
   `google-site-verification=AbCdEf123...`
3. Log in to your domain registrar (GoDaddy, Namecheap, Cloudflare, Google Domains, etc.).
4. Open the DNS settings for `thewelllivedcitizen.com`.
5. Add a new record:
   - **Type:** TXT
   - **Name / Host:** `@` (or leave blank — means the root domain)
   - **Value:** the full `google-site-verification=...` string Google gave you
   - **TTL:** default (usually 1 hour or 3600 seconds)
6. Save the record. DNS propagation usually takes 5–30 minutes (occasionally up to a few hours).
7. Return to Search Console and click **Verify**.

### Option B — URL prefix property (easier, no DNS needed)
Covers only the exact URL prefix you enter.

1. Select **URL prefix** and enter: `https://thewelllivedcitizen.com`
2. Click **Continue**.
3. Choose the **HTML tag** method. Google gives you a meta tag like:
   `<meta name="google-site-verification" content="AbCdEf123..." />`
4. Send that tag to the developer (or paste it here in chat) so it can be added to the `<head>` of every page.
5. Once the site is redeployed, click **Verify** in Search Console.

---

## Step 2 — Submit the sitemap

Once the property shows as verified:

1. In the left sidebar, click **Sitemaps** (under the **Indexing** section).
2. Under **Add a new sitemap**, type: `sitemap.xml`
   (The full URL field will auto-fill to `https://thewelllivedcitizen.com/sitemap.xml`.)
3. Click **Submit**.
4. Within a minute or two, the **Status** column should change to **Success**.
   - If it shows **Couldn't fetch**, wait 10 minutes and refresh — Google sometimes retries automatically.
   - If it shows an error, open https://thewelllivedcitizen.com/sitemap.xml directly in your browser to confirm it loads.

---

## Step 3 — Confirm coverage (over the next few days)

Indexing isn't instant. Google will crawl in the background.

1. In the left sidebar, click **Pages** (under **Indexing**).
2. You should see all 9 public URLs listed as either:
   - **Indexed** — live in Google search
   - **Discovered – currently not indexed** — queued, will be indexed soon
3. Initial indexing typically takes **2–14 days**. Re-check weekly.

### Optional: request faster indexing for individual pages
1. Use the **URL Inspection** bar at the top of Search Console.
2. Paste a full URL (e.g. `https://thewelllivedcitizen.com/services`).
3. Click **Request Indexing**. Limit: ~10 requests per day.

---

## Done checklist

- [ ] Property added and verified in Search Console
- [ ] `sitemap.xml` submitted and showing **Success**
- [ ] Pages report shows all 9 URLs indexed or queued

---

## Troubleshooting

| Problem | Fix |
|---|---|
| "Verification failed" (Domain method) | DNS hasn't propagated yet. Wait 30 min and retry. Use https://dnschecker.org to confirm the TXT record is live. |
| "Couldn't fetch" sitemap | Open the sitemap URL in a browser to confirm it loads. Confirm `robots.txt` doesn't block Googlebot. |
| Pages stuck on "Discovered – currently not indexed" | Normal for new sites. Improves with backlinks and time. Use URL Inspection → Request Indexing for priority pages. |
| Lost access to verification | Add a second verified owner under **Settings → Users and permissions** as soon as you're verified, so access isn't tied to a single account. |
