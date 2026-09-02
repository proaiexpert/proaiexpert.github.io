# Boxes Hover — source/export snapshot reconciliation

Дата проверки: 2026-09-02
Ветка evidence: `agent/proai-boxes-hover-native-runtime-validation-r1`
Базовый remote `main` на момент проверки: `204233b2683487433621c65b6409453503b74ba5`

## Итог

**PUBLIC ORIGINAL CONFIRMED / EDITOR SOURCE DIVERGED**

Текущий Spline Editor Play Mode не соответствует уже работающему Public Original. Поэтому Viewer не обновлялся: условие Case A не выполнено. Public URL также не обновлялся.

## Authorities

- Public Original: `https://my.spline.design/boxeshover-lql1ZGkjxCEQe8mgxeMO6mZC/`
- Current Viewer: `https://prod.spline.design/qM1zaX9eZ9RVFr6r/scene.splinecode`
- Viewer: `@splinetool/viewer@2.0.27`
- Current editor project: `https://app.spline.design/file/117b4cf5-47ae-497c-a445-4edea9bc604f`

## System/browser/runtime

- System browser: Google Chrome, `152.0.7977.64`
- Installed alternative: Microsoft Edge, `152.0.4191.53`; не использовался для решения
- GPU inventory: Intel(R) UHD Graphics 630; NVIDIA GeForce GTX 1650 также установлена
- Hardware acceleration: **PASS** по реальному системному Chrome/WebGPU adapter; полная страница `chrome://gpu` connector-ом не раскрыта, поэтому её строковые Graphics Feature Status считаются **непроверенными**
- `navigator.gpu`: **PASS**
- `navigator.gpu.requestAdapter()`: **PASS**, реальный adapter returned; `maxTextureDimension2D: 16384`
- Renderer path: WebGPU

## Viewer snapshot preserved before any export action

- HTTP: `200`
- Content type: `application/json`
- Size: `46,359` bytes
- SHA256: `4BA4B16BDE969700AF42E63482ECDA20218CE0F7CE5728BD1968C5830E96D468`
- Preserved file: `viewer-export-before.splinecode`
- Viewer URL unchanged: **YES**
- Viewer update: **NO**
- Public URL update: **NO**
- New Viewer hash/size: **NOT APPLICABLE**

## Read-only Play Settings comparison

### Public URL

- Main Scene: `Scene 1`
- Camera: `Personal Camera`
- Renderer: `WebGPU Only`
- Async Shaders: `Yes`
- Logo: `Yes`
- Background Color: `Show`
- Page Scroll: `Yes`
- Cursor: `Default`
- Orbit: `No`
- Pan: `No`
- Zoom: `No`
- Soft Orbit: `No`
- Orbit Speed: `1`
- Touch: Orbit `2 Fingers`, Pan `3 Fingers`, Zoom `Pinching`, Page Scroll `Yes`
- On Hover: present
- Orbit Limits: present
- Pan Limits: present
- Zoom Limits: present
- Animated Turntable: present
- Events Behavior: `Trigger Stop At Object`
- Materials / Glass Precision: `Normal`
- Pixel Ratio: Mobile `Auto (Default)`, Desktop `Auto (Default)`
- Compression: enabled
- Geometry Quality: `Default`
- Image Quality: `70`
- Preload: `Yes`
- URL: `https://my.spline.design/boxeshover-lql1ZGkjxCEQe8mgxeMO6mZC/`

### Viewer export

- Main Scene: `Scene 1`
- Camera: `Personal Camera`
- Renderer: `WebGPU Only`
- Async Shaders: `Yes`
- Logo: `Yes`
- Background Color: `Show`
- Page Scroll: `Yes`
- Cursor: `Default`
- Orbit: `No`
- Pan: `No`
- Zoom: `No`
- Soft Orbit: `No`
- Orbit Speed: `1`
- Touch: Orbit `2 Fingers`, Pan `3 Fingers`, Zoom `Pinching`, Page Scroll `Yes`
- On Hover: present
- Orbit Limits: present
- Pan Limits: present
- Zoom Limits: present
- Animated Turntable: present
- Events Behavior: `Trigger Stop At Object`
- Materials / Glass Precision: `Normal`
- Pixel Ratio: Mobile `Auto (Default)`, Desktop `Auto (Default)`
- Compression: enabled
- Geometry Quality: `Default`
- Image Quality: `70`
- Preload: not exposed in Viewer settings UI
- Mouse Events: `Local (Canvas Container)` exposed in Viewer Overview
- URL: `https://prod.spline.design/qM1zaX9eZ9RVFr6r/scene.splinecode`

### Differences observed

1. Public URL exposes `Preload: Yes`; Viewer Play Settings did not expose a Preload field.
2. Viewer Overview exposes `Mouse Events: Local (Canvas Container)`; Public URL Overview did not expose that field.
3. URLs are different by definition: public published URL versus current production Viewer scene URL.
4. All other visible shared settings matched. No setting was toggled.

These UI-level differences do not prove that the Viewer is only stale, because the current Editor Play Mode also differs materially from Public Original.

## Current editor Play Mode

The acquired project was opened in the Owner's existing logged-in Spline Chrome session. The scene was run as-is in Preview/Play Mode. No scene object, material, camera, state, event, or export setting was edited.

Observed evidence:

- Rest: editor canvas rendered the text/star field and no Public Original box composition.
- Center hover: a small, limited cyan/green raised group appeared.
- Edge hover: a different small blue/purple row appeared.
- Pointer leave: a pink/magenta row persisted while settling.

Result: Editor Play Mode **PASS** as a running source, but **FAIL** as a match for Public Original.

## Three-authority verdict

- Public Original: **PASS** — real system Chrome rendered the known working authority and its center/edge/leave responses were captured.
- Current Editor Play Mode: **PASS** for load/interaction; **FAIL** versus Public Original.
- Current Viewer: **PASS** for load; **FAIL** versus Public Original. The pre-existing Viewer evidence remains in the parent evidence directory.
- Editor vs Public Original: **FAIL** — box field topology/density, height hierarchy, composition, and hover response differ materially.
- Editor vs Viewer: **FAIL** on strict tested-state fidelity; both are non-public current-source/export evidence, but neither reproduces the Public Original. No Viewer update was attempted.
- Viewer vs Public Original: **FAIL** — established by the preserved prior Viewer comparison.

The decisive observation is that the source itself does not match the Public Original. This is Case B (`PUBLIC ORIGINAL CONFIRMED / EDITOR SOURCE DIVERGED`), not a proven stale-only Viewer export.

## Code Export / drafts

- Code Export mode: `Vanilla js (Web Content)`
- Runtime import: `@splinetool/runtime`
- Scene URL: current Viewer `scene.splinecode`
- Code Export Play Settings: same visible values as Viewer export; no update performed
- Drafts: empty; no Production or other draft snapshot was visible
- `Generate Draft`: not clicked
- Paid ZIP / Enterprise path: not used

## Public URL iframe/embed proof

An isolated temporary localhost harness used only the Public Original iframe URL, with no ProAI styling or reconstruction. The exact public scene rendered in the real system Chrome. Center hover, edge hover, and pointer-leave settling were captured in the evidence images below.

Result: **PUBLIC URL IFRAME / EMBED PATH = PASS**.

The temporary harness was validation-only and is not a product change.

## Console/network QA

- Public Original iframe: runtime rendered; console included an async-pipeline-stall warning and repeated non-fatal `ShadowDepthTexture` validation errors; also reported that 26 draws were permanently skipped after pipelines did not become ready.
- Editor Play Mode: WebGPU errors included missing vertex buffer for `renderPipeline_Untitled Material_90`, invalid command buffers, destroyed `SplineShadowMask.gbuffer`, destroyed `ShadowDepthTexture`, and related `onclose/onerror` messages. These are recorded; no scene change was attempted.
- Current Viewer: prior evidence recorded the non-fatal `Destroyed texture "ShadowDepthTexture" used in a submit` error.
- Direct origin precheck: root origins returned 403, while exact `scene.splinecode` returned 200 / 46,359 bytes / `application/json`.
- Viewer network activity included the exact `scene.splinecode` URL and `@splinetool/viewer@2.0.27` CDN resources.

ShadowDepth error: **PRESENT**.

## Evidence files

Editor and iframe captures are in this directory:

- `01-editor-rest.png`
- `02-editor-center-hover.png`
- `03-editor-edge-hover.png`
- `04-editor-pointer-leave.png`
- `05-public-embed-rest.png`
- `06-public-embed-center-hover.png`
- `07-public-embed-edge-hover.png`
- `08-public-embed-pointer-leave.png`
- `09-public-embed-interaction-probe.png`
- `10-public-embed-pointer-leave-final.png`

The preserved old Viewer binary is `viewer-export-before.splinecode` in the parent evidence directory. Existing Viewer/Public Original screenshots and the earlier report remain unchanged in that parent directory.

No motion video was produced: the available browser control path had no real video recorder, and no screenshot sequence was represented as video.

## Safety checks

- Manual reconstruction used: **NO**
- GLB used as visual authority: **NO**
- Three.js donor rebuild: **NO**
- ProAI adaptation: **NO**
- ProAI Cube touched: **NO**
- Main product code modified: **NO**
- Public URL updated: **NO**
- Viewer updated: **NO**
- Merged: **NO**
- Deployed: **NO**

## Final decision

1. Does the current editor source match the beautiful Public Original? **NO.**
2. Was the Viewer merely stale/misconfigured? **NOT PROVEN.** The source project also diverges, so Viewer export synchronization is unsafe and was not attempted.
3. Do we now have a safe exact-native integration path for Boxes Hover? **YES — through the already-working Public Original iframe/embed path.** The current Viewer export is not an exact-native match and must not be treated as the donor authority.
