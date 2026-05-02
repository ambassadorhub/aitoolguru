#!/usr/bin/env node
/**
 * Screenshot Harvester — Review Site Image Downloader
 * 
 * Fallback tool for when browser automation is unavailable.
 * Crawls review sites, extracts embedded tool screenshots, 
 * and downloads them for use on AI Tool Guru.
 * 
 * Usage:
 *   node scripts/harvest-screenshots.js --tool semrush --url https://review-site.com/semrush-review
 *   node scripts/harvest-screenshots.js --list tools.json
 *   node scripts/harvest-screenshots.js --bulk sites/ --output src/images/sites/
 * 
 * Dependencies: axios, cheerio, commander (auto-installed on first run)
 * 
 * Written: 2026-05-02
 * Author: Ollie (AI Tool Guru)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');

// Auto-install dependencies
async function ensureDeps() {
  const deps = ['axios', 'cheerio'];
  try {
    require('axios');
    require('cheerio');
  } catch {
    console.log('Installing dependencies...');
    const { execSync } = require('child_process');
    execSync('npm install axios cheerio', { stdio: 'inherit', cwd: __dirname });
    console.log('Dependencies installed. Please re-run the script.');
    process.exit(0);
  }
}

// Parse command line args
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    tool: null,
    url: null,
    list: null,
    bulk: null,
    output: './screenshots',
    selector: 'img',
    filter: null,
    max: 5,
    width: 1200,
    timeout: 30000,
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--tool': options.tool = args[++i]; break;
      case '--url': options.url = args[++i]; break;
      case '--list': options.list = args[++i]; break;
      case '--bulk': options.bulk = args[++i]; break;
      case '--output': options.output = args[++i]; break;
      case '--selector': options.selector = args[++i]; break;
      case '--filter': options.filter = args[++i]; break;
      case '--max': options.max = parseInt(args[++i]); break;
      case '--width': options.width = parseInt(args[++i]); break;
      case '--timeout': options.timeout = parseInt(args[++i]); break;
      case '--help':
        console.log(`
Screenshot Harvester

Usage:
  node harvest-screenshots.js --tool <name> --url <review-url>
  node harvest-screenshots.js --list <tools.json>
  node harvest-screenshots.js --bulk <sites-dir> --output <images-dir>

Options:
  --tool      Tool name (e.g., semrush, jasper, hubspot)
  --url       Review site URL to crawl
  --list      JSON file with multiple tools/URLs
  --bulk      Directory containing .md files with metadata
  --output    Output directory for downloaded images
  --selector  CSS selector for images (default: img)
  --filter    Regex filter for image URLs/alt text
  --max       Maximum images to download per tool (default: 5)
  --width     Minimum image width to consider (default: 1200)
  --timeout   Request timeout in ms (default: 30000)
  --help      Show this help message

Examples:
  # Single tool
  node harvest-screenshots.js --tool semrush --url "https://demandsage.com/semrush-review/"

  # From JSON list
  node harvest-screenshots.js --list tools-to-screenshot.json

  # Bulk process all site content files
  node harvest-screenshots.js --bulk src/content/sites/ --output src/images/sites/
        `);
        process.exit(0);
    }
  }
  return options;
}

// Fetch page HTML
async function fetchPage(url, options) {
  const axios = require('axios');
  try {
    const response = await axios.get(url, {
      timeout: options.timeout,
      headers: {
        'User-Agent': options.userAgent,
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      },
      maxRedirects: 5
    });
    return response.data;
  } catch (err) {
    console.error(`Failed to fetch ${url}:`, err.message);
    return null;
  }
}

// Extract image URLs from HTML
function extractImages(html, baseUrl, options) {
  const cheerio = require('cheerio');
  const $ = cheerio.load(html);
  const images = [];

  $(options.selector).each((_, el) => {
    const $img = $(el);
    const src = $img.attr('src') || $img.attr('data-src') || $img.attr('data-original');
    const alt = $img.attr('alt') || '';
    const width = parseInt($img.attr('width')) || 0;
    const classes = $img.attr('class') || '';

    if (!src) return;

    // Convert relative URLs to absolute
    let absoluteUrl;
    try {
      absoluteUrl = new URL(src, baseUrl).href;
    } catch {
      return;
    }

    // Skip non-image URLs
    if (!/\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i.test(absoluteUrl)) return;

    // Apply text filter if specified
    if (options.filter) {
      const regex = new RegExp(options.filter, 'i');
      if (!regex.test(alt) && !regex.test(absoluteUrl) && !regex.test(classes)) return;
    }

    // Check minimum width
    if (width && width < options.width) return;

    // Calculate relevance score
    let score = 0;
    const textContent = (alt + ' ' + classes).toLowerCase();
    
    if (textContent.includes('dashboard')) score += 10;
    if (textContent.includes('interface')) score += 8;
    if (textContent.includes('screenshot')) score += 10;
    if (textContent.includes('overview')) score += 5;
    if (textContent.includes('tool')) score += 3;
    if (textContent.includes('platform')) score += 3;
    if (absoluteUrl.includes('screenshot') || absoluteUrl.includes('dashboard')) score += 5;
    
    // Prefer larger images
    if (width >= 1400) score += 5;
    if (width >= 1600) score += 5;

    // Penalize tiny thumbnails
    if (width && width < 800) score -= 10;
    if (absoluteUrl.includes('icon') || absoluteUrl.includes('logo')) score -= 5;

    images.push({
      url: absoluteUrl,
      alt,
      width,
      score,
      source: baseUrl
    });
  });

  // Sort by score descending
  return images.sort((a, b) => b.score - a.score).slice(0, options.max);
}

// Download image
async function downloadImage(imageUrl, outputPath, options) {
  return new Promise((resolve, reject) => {
    const url = new URL(imageUrl);
    const client = url.protocol === 'https:' ? https : http;
    
    const request = client.get(imageUrl, {
      timeout: options.timeout,
      headers: {
        'User-Agent': options.userAgent,
        'Referer': imageUrl,
        'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8'
      }
    }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Follow redirect
        downloadImage(response.headers.location, outputPath, options)
          .then(resolve).catch(reject);
        return;
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }

      const file = fs.createWriteStream(outputPath);
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        const stats = fs.statSync(outputPath);
        console.log(`  Downloaded: ${path.basename(outputPath)} (${(stats.size / 1024).toFixed(1)} KB)`);
        resolve(outputPath);
      });

      file.on('error', (err) => {
        fs.unlink(outputPath, () => {});
        reject(err);
      });
    });

    request.on('error', reject);
    request.on('timeout', () => {
      request.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// Process single tool
async function processTool(toolName, url, options) {
  console.log(`\nProcessing: ${toolName}`);
  console.log(`URL: ${url}`);

  const html = await fetchPage(url, options);
  if (!html) return [];

  const images = extractImages(html, url, options);
  console.log(`  Found ${images.length} candidate images`);

  if (images.length === 0) {
    console.log(`  No suitable images found. Try adjusting --filter or --selector.`);
    return [];
  }

  // Ensure output directory exists
  if (!fs.existsSync(options.output)) {
    fs.mkdirSync(options.output, { recursive: true });
  }

  const downloaded = [];
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    const ext = path.extname(new URL(img.url).pathname) || '.png';
    const filename = `${toolName}-${i + 1}${ext}`;
    const outputPath = path.join(options.output, filename);

    // Skip if already exists
    if (fs.existsSync(outputPath)) {
      console.log(`  Skipping existing: ${filename}`);
      downloaded.push(outputPath);
      continue;
    }

    try {
      await downloadImage(img.url, outputPath, options);
      downloaded.push(outputPath);
    } catch (err) {
      console.error(`  Failed to download ${filename}:`, err.message);
    }

    // Small delay to be polite
    if (i < images.length - 1) {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  return downloaded;
}

// Process from JSON list
async function processList(listPath, options) {
  const list = JSON.parse(fs.readFileSync(listPath, 'utf-8'));
  const results = [];

  for (const item of list) {
    const paths = await processTool(
      item.tool || item.name,
      item.url,
      { ...options, ...item.options }
    );
    results.push({ tool: item.tool, paths });
  }

  return results;
}

// Process from content directory (reads .md files for URLs)
async function processBulk(contentDir, options) {
  const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));
  const results = [];

  for (const file of files) {
    const content = fs.readFileSync(path.join(contentDir, file), 'utf-8');
    
    // Extract live URL from frontmatter
    const liveMatch = content.match(/live:\s*"([^"]+)"/);
    const titleMatch = content.match(/title:\s*"([^"]+)"/);
    
    if (!liveMatch || !titleMatch) continue;

    const toolName = titleMatch[1].toLowerCase().replace(/\s+/g, '-');
    const liveUrl = liveMatch[1];

    // For official sites, we need review sites with screenshots
    // This is a simplified approach: search for review sites
    const reviewUrls = await findReviewSites(toolName);
    
    for (const reviewUrl of reviewUrls.slice(0, 2)) {
      const paths = await processTool(toolName, reviewUrl, options);
      if (paths.length > 0) {
        results.push({ tool: toolName, paths });
        break; // Got screenshots for this tool
      }
    }
  }

  return results;
}

// Find review sites for a tool (search-based)
async function findReviewSites(toolName) {
  // Common review site patterns
  const reviewSites = [
    `https://www.g2.com/products/${toolName}/reviews`,
    `https://www.capterra.com/p/${toolName}/`,
    `https://www.trustpilot.com/review/${toolName}.com`,
    `https://www.softwareadvice.co.uk/software/${toolName}/`,
    `https://www.getapp.com/operations-management-software/a/${toolName}/`,
  ];
  
  // Try to find blog reviews via search would require external API
  // For now, return common patterns
  return reviewSites;
}

// Main
async function main() {
  await ensureDeps();
  const options = parseArgs();

  console.log('Screenshot Harvester');
  console.log('====================');

  if (options.list) {
    await processList(options.list, options);
  } else if (options.bulk) {
    await processBulk(options.bulk, options);
  } else if (options.tool && options.url) {
    await processTool(options.tool, options.url, options);
  } else {
    console.error('Error: Specify --tool + --url, --list, or --bulk');
    console.error('Run with --help for usage information');
    process.exit(1);
  }

  console.log('\nDone!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
