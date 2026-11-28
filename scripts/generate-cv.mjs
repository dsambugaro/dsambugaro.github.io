// Renders the résumé sources in cv/ to one-page A4 PDFs with headless Chromium.
// Run with `npm run cv`. Two versions per language:
//   public/cv/danilo-sambugaro-cv-<lang>.pdf  for the site, without the phone number
//   <outDir>/danilo-sambugaro-cv-<lang>.pdf   to send to recruiters, with the phone number
// The phone number and outDir come from cv/private.json, which is git-ignored:
//   { "phone": { "pt": "...", "en": "..." }, "outDir": "/some/path" }   (outDir defaults to cv/out)
// Without that file only the public PDFs are written. Public outputs are committed, so CI never runs this.
import { fileURLToPath, pathToFileURL } from 'node:url';
import { mkdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const root = fileURLToPath(new URL('..', import.meta.url));
const publicDir = `${root}public/cv`;

let priv = null;
try {
  priv = JSON.parse(await readFile(`${root}cv/private.json`, 'utf8'));
} catch {
  console.warn('cv/private.json not found: writing only the public PDFs');
}
const privateDir = priv ? resolve(root, priv.outDir ?? 'cv/out') : null;

// Full Chromium, not the default headless shell: the shell splits letter-spaced
// headings in the PDF text layer ("EXPERI ENCE"), which hurts ATS parsing.
const browser = await chromium.launch({ channel: 'chromium' });
const page = await browser.newPage();

async function render(lang, phone, dir) {
  await mkdir(dir, { recursive: true });
  await page.goto(pathToFileURL(`${root}cv/cv.${lang}.html`).href, { waitUntil: 'networkidle' });
  await page.evaluate((phone) => {
    for (const el of document.querySelectorAll('[data-private="phone"]')) {
      if (phone) el.lastChild.textContent = phone;
      else el.remove();
    }
  }, phone);
  await page.evaluate(() => document.fonts.ready);
  // .page clips at one A4 sheet, so check each column for content that does not fit.
  const overflow = await page.evaluate(() =>
    [...document.querySelectorAll('.page > *')].some((el) => el.scrollHeight > el.clientHeight + 1),
  );
  if (overflow) console.warn(`cv.${lang}.html does not fit on one page`);
  const file = `${dir}/danilo-sambugaro-cv-${lang}.pdf`;
  await page.pdf({ path: file, format: 'A4', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  console.log(`wrote ${file}`);
}

for (const lang of ['pt', 'en']) {
  await render(lang, null, publicDir);
  if (priv?.phone?.[lang]) await render(lang, priv.phone[lang], privateDir);
}
await browser.close();
