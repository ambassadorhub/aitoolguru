# AI Tool Guru — Analytics Setup Guide

## Google Analytics 4 (GA4)

### Step 1: Create GA4 Property
1. Go to https://analytics.google.com
2. Sign in with your Google account (ambassador.workspace@gmail.com)
3. Click "Create Property"
4. Property name: "AI Tool Guru"
5. Time zone: Europe/London
6. Currency: GBP
7. Industry: Business and Industrial (or Technology)
8. Business size: Small
9. Click "Create"

### Step 2: Add Data Stream
1. Select "Web" as platform
2. Website URL: https://aitoolguru.co.uk
3. Stream name: "AI Tool Guru Website"
4. Enable "Enhanced measurement" (page views, scrolls, outbound clicks, site search)
5. Click "Create stream"
6. **Copy the Measurement ID** (looks like G-XXXXXXXXXX)

### Step 3: Install on Site
The Astro site needs the GA4 script added to the base layout.

**File to edit:** `src/layouts/BaseLayout.astro`

Add this inside the `<head>` section, replacing `G-XXXXXXXXXX` with your actual Measurement ID:

```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Step 4: Verify Installation
1. Deploy the updated site (git push)
2. Wait 24-48 hours for data to appear
3. Check Realtime report in GA4 to confirm page views are tracking

---

## Google Search Console

### Step 1: Add Property
1. Go to https://search.google.com/search-console
2. Sign in with same Google account
3. Click "Add property"
4. Select "URL prefix"
5. Enter: https://aitoolguru.co.uk
6. Click "Continue"

### Step 2: Verify Ownership
**Method A: HTML tag (recommended)**
1. Copy the meta tag provided by Search Console
2. Add it to `src/layouts/BaseLayout.astro` inside `<head>`
3. Deploy and verify

**Method B: DNS record**
1. Copy the TXT record provided
2. Add it to Namecheap DNS for aitoolguru.co.uk
3. Wait for propagation, then verify

### Step 3: Submit Sitemap
1. In Search Console, go to "Sitemaps" in left menu
2. Enter sitemap URL: `https://aitoolguru.co.uk/sitemap-index.xml`
3. Click "Submit"

**Note:** Astro should generate a sitemap automatically. If not, we can create one manually.

### Step 4: Key Reports to Monitor
- **Performance:** Search queries, clicks, impressions, CTR
- **Coverage:** Indexed pages, errors
- **Core Web Vitals:** Page speed metrics
- **Mobile Usability:** Mobile-friendly issues
- **Security & Manual Actions:** Any penalties or issues

---

## Bing Webmaster Tools (Optional but Recommended)

1. Go to https://www.bing.com/webmasters
2. Sign in with Microsoft or Google account
3. Add site: https://aitoolguru.co.uk
4. Import from Search Console (easiest method)
5. Submit sitemap

Bing represents ~10% of UK search traffic. Worth the 5-minute setup.

---

## Affiliate Link Tracking (GA4 Events)

Add custom events to track affiliate clicks:

```javascript
// Add to site JavaScript
function trackAffiliateClick(toolName, destination) {
  gtag('event', 'affiliate_click', {
    tool_name: toolName,
    destination: destination
  });
}
```

Attach to all affiliate links:
```html
<a href="affiliate-link" onclick="trackAffiliateClick('GoHighLevel', 'gohighlevel.com')">
  Try GoHighLevel
</a>
```

This lets you see which reviews generate clicks and revenue.

---

## Dashboard Summary

| Tool | Purpose | URL | Status |
|------|---------|-----|--------|
| GA4 | Traffic analytics | https://analytics.google.com | Not set up |
| Search Console | Search performance | https://search.google.com/search-console | Not set up |
| Bing Webmaster | Bing search data | https://www.bing.com/webmasters | Not set up |

---

## What Ollie Needs From Bass

1. **GA4 Measurement ID** — provide once created
2. **Search Console verification tag** — provide once generated
3. **Google account confirmation** — using ambassador.workspace@gmail.com?

Once you provide the Measurement ID and verification tag, I will:
1. Add them to the site code
2. Commit and deploy
3. Verify tracking is working
4. Set up monthly analytics reporting

---

_Last updated: 2026-05-10_
