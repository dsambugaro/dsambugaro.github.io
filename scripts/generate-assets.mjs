// Renders static assets from the built site with headless Chromium:
//   public/cv/*.pdf, public/og-*.png, favicon PNGs.
// Run with `npm run assets` (builds first). Outputs are committed, so CI never runs this.
import { spawn } from 'node:child_process';
import { mkdir, readFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import sharp from 'sharp';

const PORT = 4329;
const BASE = `http://localhost:${PORT}`;

const server = spawn('node_modules/.bin/astro', ['preview', '--port', String(PORT), '--ignore-lock'], { stdio: ['ignore', 'pipe', 'inherit'] });
await new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error('preview did not start')), 30000);
  server.stdout.on('data', (d) => {
    if (String(d).includes(String(PORT))) {
      clearTimeout(timer);
      resolve();
    }
  });
});

const browser = await chromium.launch();
try {
  await mkdir('public/cv', { recursive: true });
  const page = await browser.newPage();

  for (const [lang, file] of [
    ['en', 'danilo-sambugaro-cv-en.pdf'],
    ['pt', 'danilo-sambugaro-cv-pt-br.pdf'],
  ]) {
    await page.goto(`${BASE}/print/cv-${lang}/`, { waitUntil: 'networkidle' });
    await page.emulateMedia({ media: 'print', colorScheme: 'light' });
    await page.evaluate(() => document.fonts.ready);
    await page.pdf({ path: `public/cv/${file}`, format: 'A4', printBackground: true, preferCSSPageSize: true });
    console.log(`wrote public/cv/${file}`);
  }

  await page.emulateMedia({ media: 'screen', colorScheme: 'light' });
  await page.setViewportSize({ width: 1200, height: 630 });
  for (const lang of ['en', 'pt']) {
    await page.goto(`${BASE}/print/og-${lang}/`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `public/og-${lang}.png`, clip: { x: 0, y: 0, width: 1200, height: 630 } });
    console.log(`wrote public/og-${lang}.png`);
  }
} finally {
  await browser.close();
  server.stdout.destroy();
  server.kill();
}

const svg = await readFile('public/favicon.svg');
for (const [size, name] of [
  [32, 'favicon-32.png'],
  [180, 'apple-touch-icon.png'],
  [192, 'icon-192.png'],
  [512, 'icon-512.png'],
]) {
  await sharp(svg, { density: 384 }).resize(size, size).png().toFile(`public/${name}`);
  console.log(`wrote public/${name}`);
}
