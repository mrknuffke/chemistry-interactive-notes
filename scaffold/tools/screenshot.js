/* tools/screenshot.js
 * Render a lesson and capture light + dark screenshots so you can SEE the output.
 *
 * Setup (once):
 *   npm init -y && npm i -D playwright && npx playwright install chromium
 *
 * Usage:
 *   node tools/screenshot.js lessons/1-1b_periodic-trends-reactivity.html
 *   node tools/screenshot.js lessons/1-1b_periodic-trends-reactivity.html "#s-hazard"
 *
 * Writes full-page PNGs to tools/shots/. Serves the repo root on a temp port so
 * relative ../assets/ paths resolve.
 */
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const file = process.argv[2];
const selector = process.argv[3]; // optional: screenshot a specific section
if (!file) { console.error('usage: node tools/screenshot.js <lesson.html> [selector]'); process.exit(1); }

const ROOT = process.cwd();
const PORT = 8190;
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.svg': 'image/svg+xml', '.pdf': 'application/pdf' };

const server = http.createServer((req, res) => {
  let p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  fs.readFile(p, (err, data) => {
    if (err) { res.writeHead(404); return res.end('404'); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, async () => {
  const url = `http://localhost:${PORT}/${file.replace(/\\/g, '/')}`;
  const outDir = path.join(ROOT, 'tools', 'shots');
  fs.mkdirSync(outDir, { recursive: true });
  const base = path.basename(file, '.html');
  const browser = await chromium.launch();
  const errs = [];

  for (const theme of ['light', 'dark']) {
    const page = await browser.newPage({ viewport: { width: 1100, height: 900 } });
    page.on('pageerror', e => errs.push(`[${theme}] PAGEERROR ${e.message}`));
    page.on('console', m => { if (m.type() === 'error' && !/favicon/.test(m.text())) errs.push(`[${theme}] ${m.text()}`); });
    await page.goto(url, { waitUntil: 'networkidle' });
    if (theme === 'dark') { await page.evaluate(() => document.documentElement.classList.add('dark')); }
    await page.evaluate(() => { document.querySelectorAll('.reveal').forEach(e => e.classList.add('in')); });
    await page.waitForTimeout(1200);
    if (selector) {
      await page.evaluate(s => document.querySelector(s)?.scrollIntoView(), selector);
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(outDir, `${base}_${theme}.png` ) });
    } else {
      await page.screenshot({ path: path.join(outDir, `${base}_${theme}_full.png`), fullPage: true });
    }
    await page.close();
  }
  await browser.close();
  server.close();
  console.log(`shots written to tools/shots/ (${base}_light*, ${base}_dark*)`);
  if (errs.length) { console.log('PAGE ERRORS:'); errs.forEach(e => console.log('  ' + e)); }
  else console.log('no page errors.');
});
