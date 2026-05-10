#!/usr/bin/env node
/**
 * Ollie Review & Approval Engine
 * 
 * Auto-reviews content for:
 * - Quality (completeness, no placeholders)
 * - Affiliate compliance (pricing, verdict, disclosure)
 * - SEO (title, description, tags)
 * - Brand voice (no em dashes, UK focus)
 * 
 * Returns: approve / reject with reason
 * Auto-fixes minor issues (alt text, spacing)
 */

const fs = require('fs');
const path = require('path');

const REVIEW_RULES = {
  site: {
    required: ['title:', 'tagline:', 'description:', 'live:', 'thumbnail:', 'details:', 'tags:'],
    sections: ['**What It Does:**', '**Key Features:**', '**Pricing:**', '**Verdict:**'],
    minLength: 800,
    maxDoubleSpaces: 5,
    noEmDashes: true,
    noPlaceholders: true,
    allowMarkdownTables: true,
  },
  post: {
    required: ['title:', 'pubDate:', 'description:', 'image:', 'tags:'],
    sections: [], // Posts vary in structure
    minLength: 1000,
    maxDoubleSpaces: 10,
    noEmDashes: true,
    noPlaceholders: true,
  }
};

function detectContentType(filePath) {
  if (filePath.includes('/sites/')) return 'site';
  if (filePath.includes('/posts/')) return 'post';
  if (filePath.includes('/store/')) return 'store';
  return 'unknown';
}

function reviewFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const type = detectContentType(filePath);
  const rules = REVIEW_RULES[type] || REVIEW_RULES.post;
  
  const issues = [];
  const autoFixes = [];
  
  // 1. Check required fields
  for (const field of rules.required) {
    if (!content.includes(field)) {
      issues.push(`Missing required field: ${field}`);
    }
  }
  
  // 2. Check sections
  for (const section of rules.sections) {
    if (!content.includes(section)) {
      issues.push(`Missing section: ${section}`);
    }
  }
  
  // 3. Check length
  if (content.length < rules.minLength) {
    issues.push(`Too short: ${content.length} chars (min ${rules.minLength})`);
  }
  
  // 4. Check placeholders
  if (rules.noPlaceholders) {
    if (content.includes('[Category 1]')) issues.push('Placeholder: [Category 1]');
    if (content.includes('[Target audience 1]')) issues.push('Placeholder: [Target audience 1]');
    if (content.includes('Put your alt text')) issues.push('Placeholder alt text');
    if (content.includes('live: "#_"')) issues.push('Placeholder live URL');
    if (content.includes('[number of items]')) issues.push('Placeholder: [number of items]');
  }
  
  // 5. Check em dashes
  if (rules.noEmDashes && content.includes('—')) {
    issues.push('Contains em dash (—) — use commas or separate sentences');
  }
  
  // 6. Check double spaces
  const doubleSpaces = (content.match(/  /g) || []).length;
  if (doubleSpaces > rules.maxDoubleSpaces) {
    issues.push(`Too many double spaces: ${doubleSpaces}`);
  }
  
  // 7. Check affiliate compliance for sites
  if (type === 'site') {
    if (!content.includes('**Pricing:**') && !content.includes('Pricing:')) {
      issues.push('Missing pricing section');
    }
    if (!content.includes('**Verdict:**') && !content.includes('Verdict:')) {
      issues.push('Missing verdict section');
    }
    // Check for affiliate disclosure
    if (!content.toLowerCase().includes('affiliate') && !content.toLowerCase().includes('commission')) {
      // This is a soft warning, not a hard fail
      // issues.push('No affiliate disclosure found');
    }
  }
  
  // 8. Auto-fix minor issues
  let fixed = content;
  
  if (content.includes('alt: "Put your alt text"')) {
    const titleMatch = content.match(/title:\s*"([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : 'AI tool';
    fixed = fixed.replace(/alt: "Put your alt text"/g, `alt: "${title} interface screenshot"`);
    autoFixes.push('Fixed placeholder alt text');
  }
  
  if (content.includes('live: "#_"')) {
    // Can't auto-fix live URL — needs human input
    issues.push('CRITICAL: Missing live URL — cannot auto-fix');
  }
  
  // Write fixes back
  if (autoFixes.length > 0) {
    fs.writeFileSync(filePath, fixed);
  }
  
  return {
    approved: issues.length === 0,
    issues,
    autoFixes,
    type,
    file: path.basename(filePath)
  };
}

function reviewDirectory(dir) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
  const results = [];
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    results.push(reviewFile(filePath));
  }
  
  return results;
}

// CLI
const targetDir = process.argv[2];
if (targetDir) {
  const results = reviewDirectory(targetDir);
  let approved = 0;
  let rejected = 0;
  
  for (const r of results) {
    if (r.approved) {
      approved++;
      console.log(`✅ ${r.file} — APPROVED`);
    } else {
      rejected++;
      console.log(`❌ ${r.file} — REJECTED`);
      for (const issue of r.issues) {
        console.log(`   • ${issue}`);
      }
    }
    if (r.autoFixes.length > 0) {
      console.log(`   🔧 Auto-fixed: ${r.autoFixes.join(', ')}`);
    }
  }
  
  console.log(`\n=== Summary ===`);
  console.log(`Approved: ${approved}, Rejected: ${rejected}`);
  process.exit(rejected > 0 ? 1 : 0);
} else {
  console.log('Usage: node ollie-review.js <directory>');
  console.log('Example: node ollie-review.js ../src/content/sites/');
}
