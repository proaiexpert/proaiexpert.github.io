# Boxes Hover — forensic recovery Public Original runtime

## OWNER SUMMARY — RU

Дата проверки: 2026-09-02/03, реальный Windows Chrome/WebGPU.

Итог: **EXACT PUBLIC RUNTIME ASSET RECOVERED**.

Рабочий Public Original не загружает отдельный `scene.splinecode`. Его HTML-ответ содержит точный бинарный scene payload inline в вызове `app.start([...])`. Payload был извлечён byte-for-byte и загружен в минимальный harness через тот же официальный `@splinetool/runtime@2.0.27`. Ручная Three.js-реконструкция не использовалась.

Отдельный `qM1zaX9eZ9RVFr6r/scene.splinecode` остаётся mismatched comparator и не является authority.

## Git / scope

- Observed `origin/main`: `1da26bb71052f3b51e68ba69726ca72a4f0f5e8f`
- Requested remote `refs/heads/main`: `1da26bb71052f3b51e68ba69726ca72a4f0f5e8f`
- Local historical forensic head: `2348ccbc039988e1dde81229004648105e97f6de` — FOUND
- Safety ref: `backup/ai-systems-boxes-hover-forensics-2348c-20260902`
- R&D branch: `agent/proai-ai-systems-hero-runtime-forensics-r1`
- Product authority preserved: `6fdc0a46a008c3c308c144a734d191d0c97b0473`
- Main, production files, ProAI adaptation, merge and deploy: NOT TOUCHED

## Public Original request

URL:

`https://my.spline.design/boxeshover-lql1ZGkjxCEQe8mgxeMO6mZC/`

Observed GET:

- HTTP status: `200`
- Content-Type: `text/html`
- Real response size: `162571` bytes
- SHA-256: `aabad69692875cf52b842101a0ae21ea750cb9f5e06270aef2845309b8fb7002`
- ETag: `W/"91b13b7d9425e21c393f09205c24551f"`
- Cache: `RefreshHit from cloudfront`
- Server: `AmazonS3`
- Redirect chain: none observed
- Query parameters: none

Preserved response: `public-original-wrapper-2026-09-02.html`.

## Exact scene payload

The HTML contains the following official runtime shape:

```js
import { Application } from 'https://cdn.spline.design/@splinetool/runtime@2.0.27/build/runtime.js';
const app = new Application(canvas, { htmlContentMode: 'inline' });
app.start([/* exact public binary payload */]);
```

The array was extracted without transformation other than conversion from the HTML numeric array to raw bytes:

- Source URL: Public Original GET above; no standalone scene URL was observed
- Embedded payload size: `46215` bytes
- SHA-256: `c3bcabd43c232045b059704e8d4be57634314b7da2fcfa5ebbd448ee40a16798`
- Header bytes identify a Spline binary scene payload (`?r@...schema...`)
- Preserved bytes: `public-original-inline-scene-payload-2026-09-02.bin`

This is materially different from the known Viewer export:

- URL: `https://prod.spline.design/qM1zaX9eZ9RVFr6r/scene.splinecode`
- HTTP `200`, `application/json`, `46359` bytes
- SHA-256: `4BA4B16BDE969700AF42E63482ECDA20218CE0F7CE5728BD1968C5830E96D468`
- Preserved comparator only; not updated or modified

## Runtime inventory

The rendered Public Original exposed 70 public resources through the browser asset inventory, including the official runtime and its loaded chunks. Relevant runtime resources include:

- `https://cdn.spline.design/@splinetool/runtime@2.0.27/build/runtime.js`
- `runtime-webgpu-CNMVROCO.js`
- `runtime-mouseHover-X3SUIUNE.js`
- `runtime-transitions-5Q3K5NPG.js`
- `runtime-timeline-2JDILE3C.js`
- `runtime-fxBloom-6IFM7HAH.js`
- `runtime-components-KLWPKJCD.js`
- `opentype.js`
- multiple `runtime-chunk-*.js` modules

Runtime main script metadata:

- HTTP `200`
- Content-Type: `text/javascript`
- Real response size: `127113` bytes
- ETag: `W/"50298a19e843fdc65491ba88a53cb0f0"`
- Cache: `Hit from cloudfront`
- Server: `AmazonS3`
- Runtime version: `@splinetool/runtime@2.0.27`
- Canvas engine observed: `three.js r185 webgpu`

Полный обезличенный inventory: `request-inventory.json`. Cookies, authorization headers, tokens and personal browser data were not recorded.

## Minimal official harness

Harness:

`minimal-exact-runtime-harness/index.html`

It imports only the official Spline runtime and calls `Application.start([...])` with the preserved exact payload. It contains no Three.js scene reconstruction, `BoxGeometry`, custom materials, hover falloff, semantic anchors or ProAI code.

Chrome validation:

- `splineLoaded=true`
- WebGPU renderer observed: `three.js r185 webgpu`
- Public Original: loads and renders
- Harness: loads and renders the same dense Boxes Hover field and hover-driven box activation
- The same non-fatal `ShadowDepthTexture` WebGPU validation warning appeared in the runtime console; it did not prevent scene loading or interaction

## Interaction evidence

Tested in real Chrome with pointer movement:

| State | Public Original | Exact harness |
|---|---:|---:|
| Rest | PASS | PASS |
| Center hover | PASS | PASS |
| Edge hover | PASS | PASS |
| Live pointer movement | PASS | PASS |
| Pointer-leave settling | PASS | PASS |
| Dense field topology / scene identity | PASS | PASS, exact payload |

Screenshots:

- `01-public-rest.png`
- `02-public-center-hover.png`
- `03-public-edge-hover.png`
- `04-harness-rest.png`
- `05-harness-center-hover.png`
- `06-harness-edge-hover.png`
- `07-harness-pointer-leave-settling.png`
- `08-public-pointer-leave-settling.png`

The browser control surface assigned different CSS viewport/DPR contexts to remote Public Original and local HTTP harness pages (`Public: 1038×503, DPR 1.0`; `harness: 1297×628, DPR 0.8` in the final normalized relative-pointer run). Therefore strict pixel-for-pixel camera/color equality across those captures is **not claimed**. The authoritative identity evidence is byte-for-byte extraction of the same inline scene payload plus successful official-runtime loading and behavioral validation. A production-size pixel-normalized comparison remains an optional follow-up, not a reason to reconstruct the donor.

## Decision

**EXACT PUBLIC RUNTIME ASSET RECOVERED**

We now have the exact working Boxes Hover runtime in a usable form for future ProAI AI Systems Hero work: the preserved exact inline scene payload and a minimal official-runtime harness. The public delivery source is the Public Original wrapper URL; no independent CDN scene URL was exposed.

Stop here. Do not begin ProAI Hero adaptation until Owner / main coordination reviews this result.

## Explicit non-actions

- Manual reconstruction used: **NO**
- GLB fidelity experiment repeated: **NO**
- ProAI adaptation used: **NO**
- Enterprise purchased: **NO**
- Main modified: **NO**
- Merge: **NO**
- Production deploy: **NO**
