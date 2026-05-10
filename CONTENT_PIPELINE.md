# AI Tool Guru — Automated Content Pipeline

## How It Works (No Manual Steps)

```
Quinn writes → Ollie auto-reviews → Git push → Vercel deploys → Tess QA → Bass notified
```

## The Pipeline

### 1. Quinn Writes Content
Quinn writes tool reviews and blog posts as markdown files in:
- `src/content/sites/` — AI tool reviews
- `src/content/posts/` — Blog articles
- `src/content/store/` — Digital products (if applicable)

**Format for tool reviews (sites):**
```markdown
---
title: "Tool Name"
tagline: "One-line value proposition"
description: "SEO meta description (150-160 chars)"
live: "https://actual-url.com"
thumbnail:
  url: "/src/images/sites/{id}.png"
  alt: "Tool Name interface screenshot"
details:
  - label: "Category"
    value: "AI Assistant"
  - label: "Pricing"
    value: "Freemium"
  - label: "Type"
    value: "Web App"
  - label: "Best For"
    value: "Small Business"
tags: ["ai-assistant", "writing", "productivity"]
---

**What It Does:**

Clear description of what the tool does, who it's for, and why it matters.

**Key Features:**

- Feature one with benefit
- Feature two with benefit
- Feature three with benefit

**Pricing:**

- Free: what's included
- Paid: price and what's unlocked
- Team/Enterprise: if applicable

**Verdict:**

Clear recommendation. Who should buy it, who should skip it, and why.
```

**Rules Quinn must follow:**
- No placeholders: `[Category 1]`, `[Target audience 1]`, `#_`
- No em dashes (`—`) — use commas or separate sentences
- Always include pricing section
- Always include verdict section
- Alt text must be descriptive, not "Put your alt text"
- `live:` URL must be real, not `#_`

### 2. Ollie Auto-Reviews
Every 30 minutes, Ollie runs the review engine on all new/modified content:

```bash
cd aitoolguru-site && node scripts/ollie-review.cjs src/content/sites/
```

**Checks performed:**
- All required frontmatter fields present
- No placeholder content
- No em dashes
- Pricing section exists
- Verdict section exists
- Content length adequate
- Live URL is real

**Auto-fixes minor issues:**
- Placeholder alt text → descriptive alt text
- Double spaces → single space

**Result:**
- ✅ APPROVED → proceeds to deploy
- ❌ REJECTED → content returned to Quinn for rewrite, Bass notified

### 3. Auto-Deploy
If all content passes review:

```bash
git add -A
git commit -m "content: auto-publish {tools} [Ollie approved]"
git push origin main
```

Vercel auto-deploys from GitHub push (30-60 seconds).

### 4. Tess QA Verification
After deploy confirms (HTTP 200):

```bash
cd agents/tess/scripts && node tess-test.js --url=https://aitoolguru.co.uk
```

**Checks:**
- All pages load (HTTP 200)
- New tool page renders correctly
- Screenshots display
- Affiliate CTAs visible
- Mobile responsive

### 5. Notification to Bass
Telegram message sent:
- ✅ "AI Tool Guru updated: {tool names} published. {X}/{Y} QA checks passed."
- ⚠️ "AI Tool Guru QA issue: {details}"
- ❌ "AI Tool Guru deploy failed: {reason}"

## Current Placeholders to Replace

Tools 6-10 are Carbon theme placeholders (demo content). Quinn needs to write real reviews for:

| ID | Current (Placeholder) | Should Be |
|----|----------------------|-----------|
| 6 | Batto | Real AI tool |
| 7 | Kromatika | Real AI tool |
| 8 | Radddd | Real AI tool |
| 9 | Faikko | Real AI tool |
| 10 | Blimp | Real AI tool |

**Suggested replacements:**
- Midjourney (AI image generation)
- Runway ML (AI video)
- Notion AI (workspace AI)
- Grammarly (writing assistant)
- Canva Magic Studio (design AI)

Or Quinn can choose based on current trending tools and affiliate availability.

## Files

| File | Purpose |
|------|---------|
| `scripts/ollie-review.cjs` | Auto-review engine |
| `scripts/content-pipeline.cjs` | Full pipeline orchestrator |
| `CONTENT_PIPELINE.md` | This document |

## Cron Schedule

```
# Check for new content, review, deploy, QA every 30 minutes
*/30 * * * * cd /home/bass/.openclaw/workspace/aitoolguru-site && node scripts/content-pipeline.cjs --mode=full >> /tmp/content-pipeline.log 2>&1
```

## Manual Trigger (if needed)

```bash
# Review only
cd aitoolguru-site && node scripts/ollie-review.cjs src/content/sites/

# Full pipeline
cd aitoolguru-site && node scripts/content-pipeline.cjs --mode=full --type=site
```

---

_Last updated: 2026-05-10_
_Approval: Bass authorized Ollie to auto-approve and publish_
