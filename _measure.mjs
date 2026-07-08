import pw from 'file:///C:/Users/DAN/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.js';
const { chromium } = pw;
const b = await chromium.launch({ channel: 'chrome' });
const ctx = await b.newContext({ viewport: { width: 1800, height: 950 }, ignoreHTTPSErrors: true });
const p = await ctx.newPage();
await p.goto('https://localhost:5174/#/', { waitUntil: 'networkidle', timeout: 30000 });
await p.waitForTimeout(1500);
const r = await p.evaluate(() => {
  const pick = s => { const el = document.querySelector(s); if(!el) return null; const b = el.getBoundingClientRect(); return { left: Math.round(b.left), right: Math.round(b.right), width: Math.round(b.width) }; };
  return {
    viewport: window.innerWidth,
    head: pick('.showcase-head'),
    brand: pick('.showcase-brand'),
    count: pick('.showcase-count'),
    controls: pick('.showcase-controls'),
    tabs: pick('.showcase-controls .deck-tabs'),
    firstTab: pick('.showcase-controls .deck-tab'),
    search: pick('.search-box'),
    grid: pick('.showcase-grid'),
  };
});
console.log(JSON.stringify(r, null, 2));
await b.close();
