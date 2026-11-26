// Renders static assets from the built site with headless Chromium:
//   public/og-*.png, and favicon PNGs made from the portrait.
// Run with `npm run assets` (builds first). Outputs are committed, so CI never runs this.
import { spawn } from 'node:child_process';
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
  const page = await browser.newPage();

  await page.emulateMedia({ colorScheme: 'light' });
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

// Icons from the portrait: round for the favicon and the manifest, square for
// apple-touch-icon (iOS rounds the corners itself).
const avatar = 'src/assets/avatar.jpg';
const circle = (size) =>
  Buffer.from(`<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}"/></svg>`);
for (const [size, name, round] of [
  [32, 'favicon-32.png', true],
  [48, 'favicon-48.png', true],
  [180, 'apple-touch-icon.png', false],
  [192, 'icon-192.png', true],
  [512, 'icon-512.png', true],
]) {
  let img = sharp(avatar).resize(size, size, { fit: 'cover' });
  if (round) img = sharp(await img.png().toBuffer()).composite([{ input: circle(size), blend: 'dest-in' }]);
  await img.png().toFile(`public/${name}`);
  console.log(`wrote public/${name}`);
}
