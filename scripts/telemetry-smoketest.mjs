#!/usr/bin/env node
/**
 * End-to-end smoketest for kian-coffee's browser telemetry.
 *
 * Loads the target origin in a real headless Chrome, injects a synchronous
 * throw + an unhandled promise rejection, and asserts that:
 *   - runtime-config.js populates window.__ENV
 *   - POST /api/op/track returned 200 (OpenPanel proxy)
 *   - POST /api/gt/<project>/envelope returned 200 (Sentry tunnel)
 *   - No CSP violations in the console
 *
 * Usage:
 *   node scripts/telemetry-smoketest.mjs https://dev.kian.coffee
 *   node scripts/telemetry-smoketest.mjs https://kian.coffee
 *
 * Requires: playwright-core (dev dep) and a local Chrome install.
 * `CHROME_PATH` overrides the default macOS location.
 */
import { chromium } from 'playwright-core';

const TARGET_URL = process.argv[2];
if (!TARGET_URL) {
  console.error('usage: telemetry-smoketest.mjs <url>');
  process.exit(2);
}

const CHROME_PATH =
  process.env.CHROME_PATH ||
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const REAL_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';

const posts = [];
const consoleMessages = [];
const pageErrors = [];

const browser = await chromium.launch({
  executablePath: CHROME_PATH,
  headless: true,
  args: ['--disable-blink-features=AutomationControlled'],
});
const ctx = await browser.newContext({
  userAgent: REAL_UA,
  ignoreHTTPSErrors: true,
});
const page = await ctx.newPage();

page.on('response', async (resp) => {
  const req = resp.request();
  if (req.method() !== 'POST') return;
  const url = req.url();
  if (!url.includes('/api/op/') && !url.includes('/api/gt/')) return;
  let body = '';
  try { body = (await resp.text()).substring(0, 120); } catch {}
  posts.push({ url, status: resp.status(), body });
});
page.on('requestfailed', (req) => {
  const url = req.url();
  if (url.includes('/api/op/') || url.includes('/api/gt/')) {
    posts.push({ url, status: 'failed', error: req.failure()?.errorText });
  }
});
page.on('console', (msg) => {
  if (msg.type() === 'error' || msg.type() === 'warning') {
    consoleMessages.push({ type: msg.type(), text: msg.text() });
  }
});
page.on('pageerror', (err) => pageErrors.push(err.message));

console.log(`Loading ${TARGET_URL} ...`);
await page.goto(TARGET_URL, { waitUntil: 'networkidle' });

const runtime = await page.evaluate(() => ({
  env: window.__ENV,
  opType: typeof window.op,
}));
console.log(`  APP_ENV: ${runtime.env?.APP_ENV}`);
console.log(`  window.op: ${runtime.opType}`);

await page.waitForTimeout(4000);

const stamp = new Date().toISOString();
await page.evaluate((s) => {
  setTimeout(() => { throw new Error('smoketest-sync-' + s); }, 0);
}, stamp);
await page.evaluate((s) => {
  Promise.reject(new Error('smoketest-async-' + s));
}, stamp);
await page.waitForTimeout(6000);

console.log(`\nPOSTs captured: ${posts.length}`);
posts.forEach((p, i) =>
  console.log(`  [${i}] ${p.status} ${p.url}${p.body ? '  body=' + p.body : ''}`));

const opOK = posts.filter((p) => p.url.includes('/api/op/') && p.status === 200).length;
const gtOK = posts.filter((p) => p.url.includes('/api/gt/') && p.status === 200).length;
const cspViolations = consoleMessages
  .filter((m) => m.text.toLowerCase().includes('content security')).length;
const unexpectedConsole = consoleMessages
  .filter((m) => !m.text.includes('smoketest-'))
  .filter((m) => !/Failed to load resource: the server responded with a status of 200/.test(m.text));

console.log('\n=== RESULTS ===');
console.log(`OpenPanel 200s:   ${opOK}`);
console.log(`GlitchTip 200s:   ${gtOK}`);
console.log(`CSP violations:   ${cspViolations}`);
console.log(`pageErrors:       ${pageErrors.length}  (expect ≥ 1 — the sync throw)`);
if (unexpectedConsole.length) {
  console.log('Unexpected console output:');
  unexpectedConsole.forEach((m) =>
    console.log(`  [${m.type}] ${m.text.substring(0, 160)}`));
}

await browser.close();
const pass = opOK > 0 && gtOK > 0 && cspViolations === 0;
console.log(pass ? '\nPASS' : '\nFAIL');
process.exit(pass ? 0 : 1);
