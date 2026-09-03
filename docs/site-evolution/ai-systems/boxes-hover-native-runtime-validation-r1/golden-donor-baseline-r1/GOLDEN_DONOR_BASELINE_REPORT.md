# Boxes Hover — Golden Donor Baseline R1

## OWNER SUMMARY — RU

Дата проверки: 2026-09-03.

Текущий этап: **GOLDEN DONOR BASELINE R1**.

Целью было не строить AI Systems Hero, а проверить исходный Boxes Hover: официальный Public Original против byte-for-byte recovered payload, без ProAI-адаптации и без изменения сцены.

## Итоговый статус

**EXACT PAYLOAD REPLAY PARITY FAILED**.

Точный payload действительно загружается официальным `@splinetool/runtime@2.0.27` и рисует ту же исходную Spline-композицию с оригинальным текстом/UI и нативным hover-поведением. Но строгая 1:1 визуальная parity в текущем Chrome-контексте не доказана: Public Original получает nested canvas DPR `2.4` внутри remote iframe, а локальный exact replay получает DPR `0.8`. Из-за этого меняются canvas buffer, яркость/масштаб и видимость hover geometry.

Операционный вывод для будущего Owner preview: **PUBLIC ORIGINAL WRAPPER REQUIRED** для гарантированного визуального 1:1 воспроизведения. Payload сохранён и технически пригоден для дальнейшей отдельной проверки, но этот gate нельзя считать подтверждённым как pixel/viewport-identical baseline.

## Authorities and Git

- `origin/main` observed: `1da26bb71052f3b51e68ba69726ca72a4f0f5e8f`
- Product authority: `6fdc0a46a008c3c308c144a734d191d0c97b0473`
- Forensic authority: `4da8b751f5e46efdd7a30756fdf3b409625d2512`
- Golden branch: `agent/proai-boxes-hover-golden-donor-baseline-r1`
- Golden base: `4da8b751f5e46efdd7a30756fdf3b409625d2512`
- Rejected Hero R1 remote branch check: not found / not pushed
- Main, rejected Hero worktree, production files: not modified

## Exact runtime evidence

Public Original:

`https://my.spline.design/boxeshover-lql1ZGkjxCEQe8mgxeMO6mZC/`

Exact recovered payload:

- Golden local file: `public-original-inline-scene-payload.bin`
- Size: `46,215` bytes
- SHA-256: `c3bcabd43c232045b059704e8d4be57634314b7da2fcfa5ebbd448ee40a16798`
- Runtime: `@splinetool/runtime@2.0.27`
- Runtime URL: `https://cdn.spline.design/@splinetool/runtime@2.0.27/build/runtime.js`
- Renderer observed: `three.js r185 webgpu`
- Separate `qM1zaX9eZ9RVFr6r/scene.splinecode`: preserved comparator only; not used as authority

The clean replay uses only `Application(canvas, { htmlContentMode: 'inline' })`, fetches the local binary, verifies SHA-256, and calls `app.start(Array.from(bytes))`. It does not alter objects, materials, camera, transforms, labels, or motion.

## Clean preview surfaces

- Public Original reference: `http://127.0.0.1:4181/docs/site-evolution/ai-systems/boxes-hover-native-runtime-validation-r1/golden-donor-baseline-r1/public-original-reference.html`
- Exact payload reference: `http://127.0.0.1:4181/docs/site-evolution/ai-systems/boxes-hover-native-runtime-validation-r1/golden-donor-baseline-r1/exact-payload-reference.html`
- Direct exact replay used by the reference: `exact-payload-replay.html`

Обе поверхности donor-only: без Hero shell, копирайта ProAI, custom overlay, semantic labels, CSS-линий, градиентов, дополнительных элементов и адаптации.

## Browser metrics

Для последовательной проверки использовалась одна и та же вкладка Chrome. После повторного применения одинакового browser viewport фактический Chrome CSS viewport был:

| Surface | innerWidth × innerHeight | outer DPR | canvas CSS rect | canvas buffer |
|---|---:|---:|---:|---:|
| Public outer page | `1800 × 1125` | `0.8` | iframe `1800 × 1125` | — |
| Public scene iframe | `1800 × 1125` | `2.4` | `1800 × 1125` | `4320 × 2700` |
| Exact payload local iframe | `1800 × 1125` | `0.8` | `1800 × 1125` | `1440 × 900` |

CSS viewport size was equal in the final same-tab run, but scene DPR and backing buffer were not equal. Это и есть установленный фактор, который запрещает честно объявить 1:1 parity.

## State gates

| State | Public Original | Exact payload | Strict visual parity |
|---|---:|---:|---:|
| Rest | PASS | PASS, same original scene identity | FAIL: render scale/brightness differs |
| Center hover | PASS | PASS in preserved forensic validation | NOT CONFIRMED 1:1 |
| Edge hover | PASS | PASS in preserved forensic validation | FAIL in captured evidence |
| Live pointer movement | PASS | PASS in preserved forensic validation | NOT CONFIRMED 1:1 |
| Pointer-leave settling | PASS | PASS in preserved forensic validation | NOT CONFIRMED 1:1 |
| Original field topology | recognizable on hover | recognizable on hover | not pixel-identical |

Normalized interaction coordinates used for the controlled run:

- center: `(0.50, 0.50)`
- edge: `(0.88, 0.22)`
- live path: `(0.20, 0.50) → (0.80, 0.50)`
- leave: `(0.00, 0.00)` followed by a settling wait

The current Chrome capture path timed out on `Page.captureScreenshot` while WebGPU hover was actively rendering. Therefore the hover evidence files `04–12` are preserved screenshots from the forensic validation of the same Public Original URL, exact payload SHA and runtime 2.0.27. They are explicitly not represented as fresh pixel-identical captures.

## Root cause of rejected Hero R1

The supplied rejected screenshot (`13-rejected-hero-reference.png`) is not the original full donor surface. The rejected implementation changed the scene context in several independent ways:

1. It placed the donor in `.ai-r1-donor` with a constrained hero box (`height: clamp(430px,38vw,560px)`), negative right margin and `overflow:hidden`, instead of the official full-viewport Spline surface.
2. It added a custom radial background and custom CSS execution line, node, threshold slab and caption. Those elements are the visible “stripes / lines / square / slab” impression in the screenshot; they are not the recovered donor.
3. It hid donor text objects `Text` through `Text 8` through `app.findObjectByName(...).visible = false`.
4. It mixed the donor with a full ProAI page, copy and additional sections, so the original composition could not read as an untouched Golden Donor.
5. The effective canvas aspect/crop differed from the official Public Original. The raw payload was not the problem; the wrapper/composition and object overrides were.

The exact Golden harness does none of these things. No donor objects are hidden, no camera is altered, no materials/colors/lights/transforms are altered, and no custom overlays are present.

## Console and performance observations

- Payload HTTP fetch: success.
- Payload SHA verification: success.
- Official runtime startup: success (`data-runtime=ready`).
- No duplicate scene initialization in the clean page.
- WebGPU renderer loaded; non-fatal `ShadowDepthTexture` GPU validation errors were observed in Chrome runtime logs, matching the earlier forensic run. They did not prevent the scene from rendering or the native hover test.
- No mobile or reduced-motion adaptation was run: those belong to Hero implementation, explicitly outside this Golden Donor stage.
- No Jekyll build was required for the donor-only static preview; the two HTML surfaces are isolated evidence harnesses.

## Evidence inventory

- `01-public-rest.png`
- `02-payload-rest.png`
- `03-rest-side-by-side.png`
- `04-public-center-hover.png`
- `05-payload-center-hover.png`
- `06-center-hover-side-by-side.png`
- `07-public-edge-hover.png`
- `08-payload-edge-hover.png`
- `09-edge-hover-side-by-side.png`
- `10-public-settled.png`
- `11-payload-settled.png`
- `12-settled-side-by-side.png`
- `13-rejected-hero-reference.png`
- `public-original-inline-scene-payload.bin`

## Explicit non-actions

- Manual Three.js donor reconstruction: **NO**
- BoxGeometry or substitute cubes: **NO**
- ProAI Hero adaptation: **NO**
- ProAI colors/materials/labels/threshold: **NO**
- Enterprise purchase or paywall bypass: **NO**
- `main` modified: **NO**
- Merge: **NO**
- Production deploy: **NO**

## Stop condition

Остановиться на Golden Donor Baseline R1. Не начинать Hero integration, semantic mapping, camera adaptation, EN/RU composition, mobile, reduced-motion или ProAI authority-threshold implementation до Owner review этого результата.
