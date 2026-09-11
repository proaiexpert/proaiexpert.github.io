import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import fs from 'node:fs/promises';
import path from 'node:path';

const SOURCE = 'assets/brand/proai-logo-r341/proai-header-r111-static-cube-320.png';
const OUT = 'artifacts/favicon-system-r1';
await fs.mkdir(OUT, { recursive: true });

const bg = '#050607';
const sourceTrimmed = await sharp(SOURCE)
  .ensureAlpha()
  .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer();

async function makeIcon(size, cubeRatio, radiusRatio = 0.18, outputPath) {
  const cubeSize = Math.round(size * cubeRatio);
  const cube = await sharp(sourceTrimmed)
    .resize(cubeSize, cubeSize, { fit: 'contain', kernel: sharp.kernel.lanczos3 })
    .sharpen({ sigma: size <= 32 ? 0.7 : 0.35 })
    .png()
    .toBuffer();

  const radius = Math.max(2, Math.round(size * radiusRatio));
  const baseSvg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" rx="${radius}" fill="${bg}"/></svg>`);

  await sharp(baseSvg)
    .composite([{ input: cube, gravity: 'centre' }])
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(outputPath);
}

const p16 = path.join(OUT, 'favicon-16x16.png');
const p32 = path.join(OUT, 'favicon-32x32.png');
const p48 = path.join(OUT, 'favicon-48x48.png');
const p180 = path.join(OUT, 'apple-touch-icon.png');
const p192 = path.join(OUT, 'android-chrome-192x192.png');
const p512 = path.join(OUT, 'android-chrome-512x512.png');

// Tiny browser marks: maximize the exact production header cube inside a near-black tile.
await makeIcon(16, 0.86, 0.18, p16);
await makeIcon(32, 0.84, 0.18, p32);
await makeIcon(48, 0.82, 0.18, p48);

// App/touch icons: more breathing room while preserving the exact production cube.
await makeIcon(180, 0.70, 0.19, p180);
await makeIcon(192, 0.70, 0.19, p192);
await makeIcon(512, 0.68, 0.19, p512);

const ico = await pngToIco([p16, p32, p48]);
await fs.writeFile(path.join(OUT, 'favicon.ico'), ico);

// SVG favicon deliberately embeds the exact production header cube rather than redrawing it.
const svgCube = await sharp(sourceTrimmed)
  .resize(56, 56, { fit: 'contain', kernel: sharp.kernel.lanczos3 })
  .sharpen({ sigma: 0.4 })
  .png()
  .toBuffer();
const svgB64 = svgCube.toString('base64');
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="${bg}"/><image x="4" y="4" width="56" height="56" href="data:image/png;base64,${svgB64}"/></svg>`;
await fs.writeFile(path.join(OUT, 'favicon.svg'), faviconSvg);

const manifest = {
  name: 'ProAI Expert',
  short_name: 'ProAI Expert',
  icons: [
    { src: '/android-chrome-192x192.png?v=20260910-r1', sizes: '192x192', type: 'image/png' },
    { src: '/android-chrome-512x512.png?v=20260910-r1', sizes: '512x512', type: 'image/png' }
  ],
  theme_color: '#050607',
  background_color: '#050607',
  display: 'standalone'
};
await fs.writeFile(path.join(OUT, 'site.webmanifest'), JSON.stringify(manifest, null, 2) + '\n');

// Pixel-accurate QA board. No invented logo/cube: every icon below is generated from SOURCE.
const canvasW = 1600;
const canvasH = 1040;
const board = sharp({ create: { width: canvasW, height: canvasH, channels: 4, background: '#f3f4f5' } });

const textSvg = (w, h, body) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><style>text{font-family:Arial,sans-serif;fill:#111820}.small{font-size:24px;fill:#53606b}.label{font-size:30px;font-weight:700}.title{font-size:42px;font-weight:700}</style>${body}</svg>`);

const comps = [];
comps.push({ input: textSvg(canvasW, 120, `<text x="70" y="60" class="title">ProAI Expert — production favicon QA</text><text x="70" y="98" class="small">Source: exact production header cube asset · no AI-generated replacement</text>`), left: 0, top: 0 });

const sizes = [16,32,48,180,192,512];
const files = [p16,p32,p48,p180,p192,p512];
const display = [96,128,144,180,192,260];
let x = 70;
for (let i=0;i<sizes.length;i++) {
  const d = display[i];
  const icon = await sharp(files[i]).resize(d,d,{kernel:sharp.kernel.nearest}).png().toBuffer();
  comps.push({ input: icon, left: x, top: 170 });
  comps.push({ input: textSvg(d+40, 50, `<text x="0" y="34" class="small">${sizes[i]}×${sizes[i]}</text>`), left: x, top: 170+d+12 });
  x += d + 72;
}

// Native-scale tab checks on dark and light chrome.
const tabDark = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="680" height="130"><rect width="680" height="130" rx="24" fill="#171a1f"/><text x="92" y="78" font-family="Arial" font-size="34" fill="#f5f5f2">ProAI Expert</text></svg>`);
const tabLight = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="680" height="130"><rect width="680" height="130" rx="24" fill="#ffffff" stroke="#d8dde2" stroke-width="2"/><text x="92" y="78" font-family="Arial" font-size="34" fill="#15181c">ProAI Expert</text></svg>`);
const fav32 = await fs.readFile(p32);
const tabDarkImg = await sharp(tabDark).composite([{input:fav32,left:34,top:49}]).png().toBuffer();
const tabLightImg = await sharp(tabLight).composite([{input:fav32,left:34,top:49}]).png().toBuffer();
comps.push({ input: textSvg(700, 55, `<text x="0" y="38" class="label">Browser tab — dark chrome</text>`), left: 70, top: 575 });
comps.push({ input: tabDarkImg, left: 70, top: 635 });
comps.push({ input: textSvg(700, 55, `<text x="0" y="38" class="label">Browser tab — light chrome</text>`), left: 830, top: 575 });
comps.push({ input: tabLightImg, left: 830, top: 635 });

comps.push({ input: textSvg(1460, 120, `<text x="0" y="38" class="small">Acceptance focus: silhouette at 16/32 px · metallic highlight retention · dark/light tab contrast · app icon family consistency</text><text x="0" y="82" class="small">Large app icons use the same production cube with additional breathing room; no text inside any icon.</text>`), left: 70, top: 830 });

await board.composite(comps).png().toFile(path.join(OUT, 'favicon-qa-preview.png'));

for (const f of ['favicon.svg','favicon.ico','favicon-16x16.png','favicon-32x32.png','favicon-48x48.png','apple-touch-icon.png','android-chrome-192x192.png','android-chrome-512x512.png','site.webmanifest','favicon-qa-preview.png']) {
  const s = await fs.stat(path.join(OUT, f));
  console.log(`${f}: ${s.size} bytes`);
}
