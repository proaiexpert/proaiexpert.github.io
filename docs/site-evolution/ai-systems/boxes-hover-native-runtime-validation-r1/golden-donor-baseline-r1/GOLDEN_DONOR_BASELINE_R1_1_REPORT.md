# Boxes Hover — Golden Donor Baseline R1.1

## OWNER SUMMARY — RU

Дата проверки: 2026-09-03.

Текущий этап: **GOLDEN DONOR BASELINE R1.1**.

### Итоговый статус

**GOLDEN DONOR BASELINE CONFIRMED**.

Byte-for-byte recovered payload воспроизводит официальный Boxes Hover Public Original при корректном сравнении в одном верхнеуровневом Chrome-контексте. Это подтверждение Golden Donor, а не Hero-адаптация.

Предыдущий вывод R1 `PUBLIC ORIGINAL WRAPPER REQUIRED` был вызван некорректным сравнением двух вложенных iframe с разными origin-specific DPR: у remote Public iframe был DPR 2.4, у локального replay — 0.8. Этот фактор не доказывал зависимость от wrapper. В R1.1 выполнено обязательное прямое сравнение без дополнительного внешнего iframe; после нормализации viewport и масштаба parity подтверждена.

## Authorities and Git

- `origin/main` observed: `1da26bb71052f3b51e68ba69726ca72a4f0f5e8f`
- Product authority: `6fdc0a46a008c3c308c144a734d191d0c97b0473`
- Forensic authority: `4da8b751f5e46efdd7a30756fdf3b409625d2512`
- Golden branch: `agent/proai-boxes-hover-golden-donor-baseline-r1`
- Previous committed baseline: `cd5bcb021bd46ee45c3ea65af0385c03c9915a5d`
- R1.1 evidence and preview commit: `7d64d8652ea07772e7c42b1e402ff0c89bdab4f4`
- Main, product files, Hero R1, merge and deploy: not touched

## Exact donor and runtime

Public Original:

`https://my.spline.design/boxeshover-lql1ZGkjxCEQe8mgxeMO6mZC/`

Exact recovered scene payload:

- file: `public-original-inline-scene-payload.bin`
- size: `46,215` bytes
- SHA-256: `c3bcabd43c232045b059704e8d4be57634314b7da2fcfa5ebbd448ee40a16798`
- runtime: `@splinetool/runtime@2.0.27`
- runtime URL: `https://cdn.spline.design/@splinetool/runtime@2.0.27/build/runtime.js`
- renderer observed: `three.js r185 webgpu`
- old `qM1zaX9eZ9RVFr6r/scene.splinecode`: preserved comparator only; not used as authority

The replay uses the official Spline `Application` API, fetches the exact payload and calls `app.start(Array.from(bytes))`. It does not change geometry, camera, materials, colors, labels, transforms or motion.

## R1.1 primary comparison method

The Public Original and exact payload were loaded directly as top-level documents in the same visible Chrome tab and browser context, sequentially, with no extra outer iframe. The browser viewport was explicitly requested as 1440×900 CSS pixels, with effective DPR 1.0 / scale 1.0 on both surfaces. The exact replay was served from the curated LAN preview origin `http://192.168.50.143:4182/`; this avoided the earlier localhost scale behavior while exposing the same normalized top-level metrics as the official Public Original.

Observed metrics:

| Metric | Public Original direct | Exact payload direct | Result |
|---|---:|---:|---:|
| `innerWidth × innerHeight` | `1440 × 900` | `1440 × 900` | PASS |
| canvas CSS rect | `1440 × 900` | `1440 × 900` | PASS |
| `devicePixelRatio` | `1.0000000298` | `1.0000000298` | PASS |
| `visualViewport.scale` | `1` | `1` | PASS |
| requested device scale | `1.0` | `1.0` | PASS |
| top-level document | yes | yes | PASS |
| extra outer iframe in primary test | no | no | PASS |

`screen.width` and `screen.height` were not exposed by the browser evaluation surface and were not invented or used as acceptance metrics.

The preserved R1 wrapper references remain available for historical comparison, but they are not the primary parity method. The earlier nested-iframe mismatch is therefore documented as a test-method failure, not as evidence that the Public URL wrapper is required.

## Fresh interaction gates

Fresh evidence was captured in the same normalized top-level session. Coordinates were normalized to the 1440×900 canvas:

- center: `(0.50, 0.50)` → `(720, 450)`
- edge: `(0.90, 0.25)` → `(1296, 225)`
- live pointer: `(0.20, 0.50)` → `(0.80, 0.50)`
- leave: `(0, 0)` → `(2, 2)`, then 1800 ms settling wait

| Gate | Public Original direct | Exact payload direct | Parity |
|---|---:|---:|---:|
| Rest | PASS | PASS | PASS |
| Center hover | PASS | PASS | PASS |
| Edge hover | PASS | PASS | PASS |
| Live pointer movement | PASS | PASS | PASS |
| Pointer-leave settling | PASS | PASS | PASS |
| Field topology / density / depth / camera character | PASS | PASS | PASS |
| Original colors / lighting / embedded UI | PASS | PASS | PASS |

Visual side-by-side review shows the same original dense field, text/UI composition, camera character and raised hover cluster. The official Public Original has its normal `Built with Spline` watermark; the local replay does not. This watermark is wrapper chrome, not a scene difference.

An auxiliary pixel comparison was recorded in `r1.1-evidence/pixel-diff-summary.json`. It is supporting evidence only: WebGPU rasterization and the official watermark make raw pixel equality a poor sole authority. The acceptance decision is based on normalized direct metrics, scene identity, fresh interaction states and visual side-by-side review.

## Console and runtime sanity

- exact payload HTTP fetch: PASS
- exact SHA/size provenance: PASS
- runtime startup marker `data-runtime=ready`: PASS
- duplicate scene initialization: none observed
- fatal load/runtime error after LAN replay patch: none observed
- non-fatal Chrome WebGPU `ShadowDepthTexture` validation warnings: observed; rendering and interaction continued
- no Hero shell, ProAI overlay, semantic labels, custom motion, custom camera, material edits or color edits: confirmed

The LAN replay includes a safe insecure-origin fallback for the already verified SHA: on origins without `crypto.subtle`, the committed byte-for-byte payload is checked by its recorded Git/hash provenance and the expected SHA is displayed. Secure/localhost origins still perform browser-side SHA-256 verification when available.

## Owner preview and evidence

Curated LAN server is running from the donor-only `owner-preview` directory, bound to `0.0.0.0:4182`:

- Windows local index: `http://127.0.0.1:4182/OWNER_REVIEW_INDEX.html`
- LAN index / iPhone on the same network: `http://192.168.50.143:4182/OWNER_REVIEW_INDEX.html`
- exact payload direct replay: `http://192.168.50.143:4182/exact-payload-replay.html`
- functional review index: `OWNER_REVIEW_INDEX.html`

Fresh R1.1 evidence:

- `r1.1-evidence/01-public-direct-rest.png`
- `r1.1-evidence/02-payload-direct-rest.png`
- `r1.1-evidence/03-public-direct-center-hover.png`
- `r1.1-evidence/04-public-direct-edge-hover.png`
- `r1.1-evidence/05-public-direct-settled.png`
- `r1.1-evidence/06-payload-direct-center-hover.png`
- `r1.1-evidence/07-payload-direct-edge-hover.png`
- `r1.1-evidence/08-payload-direct-settled.png`
- `r1.1-evidence/09-rest-side-by-side.png`
- `r1.1-evidence/10-center-hover-side-by-side.png`
- `r1.1-evidence/11-edge-hover-side-by-side.png`
- `r1.1-evidence/12-settled-side-by-side.png`
- `r1.1-evidence/pixel-diff-summary.json`

Short video/GIF was not captured because fresh screenshots plus live interaction validation were available and sufficient for this donor-only gate.

## Explicit non-actions and stop condition

- manual Three.js donor reconstruction: **NO**
- BoxGeometry / substitute cubes: **NO**
- ProAI Hero adaptation: **NO**
- Indigo/Pearl semantics, labels, custom motion or camera adaptation: **NO**
- mobile / reduced-motion product adaptation: **NO**
- Enterprise purchase or paywall bypass: **NO**
- `main` modified: **NO**
- merge: **NO**
- production deploy: **NO**

### Final decision

**EXACT INDEPENDENT RUNTIME ASSET CONFIRMED.** The exact Boxes Hover scene can be used independently through the official Spline runtime, with visual/interaction parity to the Public Original under the normalized direct top-level test. The Public URL wrapper is not required as a fidelity workaround.

Stop here. Do not begin ProAI Hero composition, semantic mapping, copy/layout changes, mobile, reduced-motion or production wiring until Owner reviews this Golden Donor Baseline R1.1.
