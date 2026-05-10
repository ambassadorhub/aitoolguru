# AI Tool Guru — Analytics Setup Guide

## What You Need Before Starting
- Google account: **ambassador.workspace@gmail.com**
- Your site URL: **https://aitoolguru.co.uk**
- About 20 minutes total

---

## Part 1: Google Analytics 4 (GA4)

**URL:** https://analytics.google.com/analytics/web/provision/#/provision/create

### Step 1: Create the Account
1. Go to the URL above
2. Sign in with **ambassador.workspace@gmail.com**
3. Click the big blue button: **"Create"** (or "Start measuring")
4. Account name: **"AI Tool Guru"**
5. Leave all data sharing settings checked (recommended for small businesses)
6. Click **"Next"**

### Step 2: Create the Property
1. Property name: **"AI Tool Guru Website"**
2. Reporting time zone: **United Kingdom** (scroll to find it)
3. Currency: **British Pound (GBP)**
4. Click **"Next"**

### Step 3: Business Details
1. Industry category: **Business & Industrial Market** (or "Technology")
2. Business size: **Small** (1-10 employees)
3. How do you intend to use GA: Check all that apply:
   - ✅ Generate leads
   - ✅ Drive online sales
   - ✅ Examine user behaviour
4. Click **"Create"**
5. Accept the terms of service (read quickly, scroll, click **"I Accept"**)

### Step 4: Add Data Stream
1. Choose platform: **"Web"**
2. Website URL: **https://aitoolguru.co.uk**
3. Stream name: **"AI Tool Guru Website"**
4. **IMPORTANT:** Turn ON "Enhanced measurement"
   - This should already be ON by default
   - It tracks: page views, scrolls, outbound clicks, site search, video engagement, file downloads
5. Click **"Create stream"**

### Step 5: Copy Your Measurement ID
You will now see a screen with:
- **Measurement ID:** Looks like **G-XXXXXXXXXX** (10-12 characters)
- Stream URL: https://aitoolguru.co.uk
- Status: Active

**Copy the Measurement ID and paste it in a reply to me.**

Do NOT close this page yet.

---

## Part 2: Google Search Console

**URL:** https://search.google.com/search-console/welcome

### Step 1: Add Property
1. Go to the URL above
2. Sign in with **ambassador.workspace@gmail.com** (same account)
3. Click **"Add property"**
4. You will see two options. Choose: **"URL prefix"**
5. Enter: **https://aitoolguru.co.uk**
6. Click **"Continue"**

### Step 2: Verify Ownership (HTML Tag Method)
Google will ask you to verify ownership. You will see several methods.

**Choose: "HTML tag"**

1. You will see a meta tag that looks like this:
   ```html
   <meta name="google-site-verification" content="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" />
   ```
2. **Copy the entire content value** (the long string of letters and numbers)
3. **Paste it in a reply to me**

Alternative method if HTML tag does not work:
- **DNS record method:** Copy the TXT record and I will add it to your Namecheap DNS

### Step 3: Submit Sitemap
After verification:
1. In the left sidebar, click **"Sitemaps"**
2. Enter sitemap URL: **sitemap-index.xml**
   - (The full URL would be https://aitoolguru.co.uk/sitemap-index.xml but Search Console only needs the last part)
3. Click **"Submit"**

If Astro does not auto-generate a sitemap, I will create one manually.

---

## Part 3: What to Send Me

Reply with these two pieces of information:

1. **GA4 Measurement ID** (from Part 1, Step 5)
   - Format: G-XXXXXXXXXX

2. **Search Console Verification Code** (from Part 2, Step 2)
   - Format: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

Once I have these, I will:
1. Add both to the site code
2. Deploy to Vercel
3. Confirm verification in Search Console
4. Set up a monthly analytics report for you

---

## Part 4: Bing Webmaster Tools (Optional, 5 Minutes)

**URL:** https://www.bing.com/webmasters

1. Sign in with your Google account
2. Click "Add site"
3. Enter: **https://aitoolguru.co.uk**
4. Choose **"Import from Google Search Console"** (easiest method)
5. Select your verified property
6. Done. Bing will automatically import your sitemap and settings.

Bing is ~10% of UK search traffic. Worth doing while you are here.

---

## Part 5: What to Expect After Setup

| Timeline | What Happens |
|----------|-------------|
| **Day 0** | I install the codes, deploy, verify |
| **Day 1-2** | GA4 starts collecting data (Realtime report shows visitors) |
| **Day 3-7** | Search Console shows first search performance data |
| **Week 2** | Meaningful traffic patterns emerge |
| **Month 1** | First monthly analytics report from me |

## Key Reports to Check Weekly

### GA4
- **Realtime:** See who is on your site right now
- **Engagement > Pages and screens:** Which reviews get the most views
- **Engagement > Events:** Which affiliate links get clicked
- **Acquisition > Traffic acquisition:** Where visitors come from (Google, social, direct)

### Search Console
- **Performance:** Which search queries bring visitors
- **Coverage:** Which pages are indexed by Google
- **Core Web Vitals:** Page speed scores (should be green)

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Property already exists" | You or someone else already created it. Check your GA4 account list. |
| Verification fails | Wait 5 minutes and retry. Or switch to DNS method and send me the TXT record. |
| No data showing | Normal. GA4 takes 24-48 hours. Search Console takes 3-7 days. |
| Sitemap error | I will create a manual sitemap and resubmit. |

---

## What I Will Do After You Send Me the Codes

1. Add GA4 script to `src/layouts/BaseLayout.astro`
2. Add Search Console meta tag to the same file
3. Add affiliate click tracking events
4. Commit and push to GitHub
5. Wait for Vercel deploy
6. Verify Search Console ownership
7. Confirm GA4 is receiving data
8. Send you a confirmation message

---

_Last updated: 2026-05-10_
