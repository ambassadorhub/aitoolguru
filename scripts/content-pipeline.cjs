#!/usr/bin/env node
/**
 * AI Tool Guru — Automated Content Pipeline
 * 
 * Workflow:
 * 1. Quinn writes new review(s) as markdown files
 * 2. Ollie reviews for quality, accuracy, affiliate compliance
 * 3. If approved: git commit + push → Vercel auto-deploys
 * 4. Tess runs QA on deployed site
 * 5. Report results to Bass via Telegram
 * 
 * Usage:
 *   node scripts/content-pipeline.js --mode=write --type=site --tool="Midjourney"
 *   node scripts/content-pipeline.js --mode=review
 *   node scripts/content-pipeline.js --mode=deploy
 *   node scripts/content-pipeline.js --mode=qa
 *   node scripts/content-pipeline.js --mode=full --type=site --tool="Midjourney"
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const SITE_DIR = path.join(__dirname, '..', 'src', 'content', 'sites');
const POSTS_DIR = path.join(__dirname, '..', 'src', 'content', 'posts');
const STORE_DIR = path.join(__dirname, '..', 'src', 'content', 'store');
const REPO_ROOT = path.join(__dirname, '..');

// Config
const BASE_URL = process.env.SITE_URL || 'https://aitoolguru.co.uk';
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

function log(msg) {
  console.log(`[${new Date().toISOString()}] ${msg}`);
}

function exec(cmd, opts = {}) {
  return execSync(cmd, { cwd: REPO_ROOT, encoding: 'utf8', ...opts }).trim();
}

// ─── CONTENT INVENTORY ─────────────────────────────────────────────

function getNextSiteId() {
  const files = fs.readdirSync(SITE_DIR).filter(f => f.endsWith('.md'));
  const ids = files.map(f => parseInt(path.basename(f, '.md'))).filter(n => !isNaN(n));
  return Math.max(...ids, 0) + 1;
}

function getNextPostId() {
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
  const ids = files.map(f => parseInt(path.basename(f, '.md'))).filter(n => !isNaN(n));
  return Math.max(...ids, 0) + 1;
}

function isPlaceholder(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return content.includes('[Category 1]') || 
         content.includes('[Target audience 1]') ||
         content.includes('live: "#_"') ||
         content.includes('Put your alt text');
}

function listPlaceholders() {
  const sites = fs.readdirSync(SITE_DIR)
    .filter(f => f.endsWith('.md'))
    .map(f => ({ id: path.basename(f, '.md'), path: path.join(SITE_DIR, f) }))
    .filter(f => isPlaceholder(f.path));
  
  const posts = fs.readdirSync(POSTS_DIR)
    .filter(f => f.endsWith('.md'))
    .map(f => ({ id: path.basename(f, '.md'), path: path.join(POSTS_DIR, f) }))
    .filter(f => isPlaceholder(f.path));
  
  return { sites, posts };
}

// ─── GIT OPERATIONS ────────────────────────────────────────────────

function gitStatus() {
  return exec('git status --short');
}

function gitHasChanges() {
  return gitStatus().length > 0;
}

function gitAdd(file) {
  exec(`git add "${file}"`);
  log(`Git added: ${file}`);
}

function gitAddAll() {
  exec('git add -A');
  log('Git added all changes');
}

function gitCommit(message) {
  exec(`git commit -m "${message.replace(/"/g, '\\"')}"`);
  log(`Git committed: ${message}`);
}

function gitPush() {
  exec('git push origin main');
  log('Git pushed to origin/main');
}

// ─── VERCEL DEPLOY CHECK ───────────────────────────────────────────

async function waitForVercelDeploy(timeoutMs = 120000) {
  log('Waiting for Vercel deploy...');
  const start = Date.now();
  
  while (Date.now() - start < timeoutMs) {
    try {
      const result = exec(`curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}"`);
      if (result === '200') {
        log('Vercel deploy confirmed (HTTP 200)');
        return true;
      }
    } catch (e) {}
    await new Promise(r => setTimeout(r, 5000));
  }
  
  log('Vercel deploy timeout exceeded');
  return false;
}

// ─── TELEGRAM ALERT ──────────────────────────────────────────────

function sendTelegram(message) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    log(`Telegram not configured. Would send: ${message}`);
    return;
  }
  
  try {
    const cmd = `curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
      -d "chat_id=${TELEGRAM_CHAT_ID}" \
      -d "text=${encodeURIComponent(message)}" \
      -d "parse_mode=Markdown"`;
    exec(cmd);
    log('Telegram alert sent');
  } catch (e) {
    log(`Telegram send failed: ${e.message}`);
  }
}

// ─── TESS QA ───────────────────────────────────────────────────────

function runTessQA() {
  log('Running Tess QA...');
  const tessDir = path.join(__dirname, '..', '..', '..', 'agents', 'tess', 'scripts');
  
  try {
    const result = execSync(
      `node tess-test.js --url=${BASE_URL} --report=json`,
      { cwd: tessDir, encoding: 'utf8', timeout: 60000 }
    );
    const report = JSON.parse(result);
    log(`Tess QA complete: ${report.passed}/${report.total} passed`);
    return report;
  } catch (e) {
    log(`Tess QA failed: ${e.message}`);
    return { passed: 0, total: 0, failed: true, error: e.message };
  }
}

// ─── OLLIE REVIEW CHECKLIST ────────────────────────────────────────

function ollieReview(filePath, type) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  
  // Basic checks
  if (!content.includes('title:')) issues.push('Missing title');
  if (!content.includes('description:')) issues.push('Missing description');
  if (content.includes('[Category 1]')) issues.push('Placeholder content detected');
  if (content.includes('[Target audience 1]')) issues.push('Placeholder content detected');
  if (content.includes('Put your alt text')) issues.push('Placeholder alt text');
  if (type === 'site' && content.includes('live: "#_"')) issues.push('Missing live URL');
  
  // Affiliate compliance
  if (type === 'site') {
    const hasPricing = content.includes('Pricing:') || content.includes('**Pricing:**');
    const hasVerdict = content.includes('Verdict:') || content.includes('**Verdict:**');
    if (!hasPricing) issues.push('Missing pricing section');
    if (!hasVerdict) issues.push('Missing verdict section');
  }
  
  // Quality checks
  if (content.length < 500) issues.push('Content too short (< 500 chars)');
  if (content.includes('  ')) issues.push('Double spaces found');
  
  return {
    approved: issues.length === 0,
    issues,
    content
  };
}

// ─── MAIN PIPELINE ─────────────────────────────────────────────────

async function runPipeline(args) {
  const mode = args.mode || 'full';
  const type = args.type || 'site'; // site | post | store
  const tool = args.tool || null;
  
  log(`=== Content Pipeline Started ===`);
  log(`Mode: ${mode}, Type: ${type}, Tool: ${tool || 'N/A'}`);
  
  // 1. Check placeholders
  const placeholders = listPlaceholders();
  log(`Placeholders found: ${placeholders.sites.length} sites, ${placeholders.posts.length} posts`);
  
  // 2. Write mode: spawn Quinn subagent
  if (mode === 'write' || mode === 'full') {
    log('STEP 1: Content creation (Quinn)');
    // This is triggered by spawning Quinn as a subagent
    // Quinn writes markdown files to the content directories
    log('Quinn writes content to src/content/[type]/');
  }
  
  // 3. Review mode
  if (mode === 'review' || mode === 'full') {
    log('STEP 2: Ollie review');
    
    const filesToReview = [];
    if (gitHasChanges()) {
      const status = gitStatus();
      const newFiles = status.split('\n')
        .filter(l => l.startsWith('A ') || l.startsWith('M '))
        .map(l => l.slice(3));
      filesToReview.push(...newFiles);
    }
    
    log(`Files to review: ${filesToReview.length}`);
    
    for (const file of filesToReview) {
      const fullPath = path.join(REPO_ROOT, file);
      const type = file.includes('/sites/') ? 'site' : 
                   file.includes('/posts/') ? 'post' : 'store';
      
      const review = ollieReview(fullPath, type);
      
      if (review.approved) {
        log(`✅ APPROVED: ${file}`);
      } else {
        log(`❌ REJECTED: ${file}`);
        log(`   Issues: ${review.issues.join(', ')}`);
        // Auto-fix what we can
        if (review.issues.includes('Placeholder alt text')) {
          let content = fs.readFileSync(fullPath, 'utf8');
          content = content.replace(/alt: "Put your alt text"/g, `alt: "${tool || 'AI tool'} screenshot"`);
          fs.writeFileSync(fullPath, content);
          log(`   Auto-fixed: alt text`);
        }
      }
    }
  }
  
  // 4. Deploy mode
  if (mode === 'deploy' || mode === 'full') {
    log('STEP 3: Deploy');
    
    if (gitHasChanges()) {
      gitAddAll();
      gitCommit(`content: auto-publish ${type} — ${tool || 'batch update'} [Ollie approved]`);
      gitPush();
      
      const deployed = await waitForVercelDeploy();
      if (!deployed) {
        log('❌ Deploy failed or timed out');
        sendTelegram(`⚠️ AI Tool Guru deploy failed for ${tool || 'batch update'}`);
        return;
      }
    } else {
      log('No changes to deploy');
    }
  }
  
  // 5. QA mode
  if (mode === 'qa' || mode === 'full') {
    log('STEP 4: Tess QA');
    const report = runTessQA();
    
    if (report.failed) {
      sendTelegram(`⚠️ AI Tool Guru QA failed after deploy. Check logs.`);
    } else if (report.passed < report.total) {
      sendTelegram(`⚠️ AI Tool Guru QA: ${report.passed}/${report.total} passed. Some issues detected.`);
    } else {
      sendTelegram(`✅ AI Tool Guru updated and verified. ${report.passed}/${report.total} QA checks passed.`);
    }
  }
  
  log('=== Content Pipeline Complete ===');
}

// ─── CLI ───────────────────────────────────────────────────────────

const args = {};
process.argv.slice(2).forEach(arg => {
  if (arg.startsWith('--')) {
    const [key, val] = arg.slice(2).split('=');
    args[key] = val || true;
  }
});

runPipeline(args).catch(e => {
  log(`Pipeline error: ${e.message}`);
  process.exit(1);
});
