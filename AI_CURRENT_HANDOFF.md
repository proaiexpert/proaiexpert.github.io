# AI Current Handoff — ProAI Expert Website

Status: CURRENT
Last normalized: 2026-09-02
Repository: `proaiexpert/proaiexpert.github.io`

## Current authority

1. Fetch current `main` before acting.
2. Read `/PRODUCTION-AUTHORITY.md`.
3. Treat `main` as the sole current product authority.
4. Treat historical commits, donor branches, checkpoint branches, old manifests, review copies and superseded files as evidence only.
5. If any historical file conflicts with `main` or `/PRODUCTION-AUTHORITY.md`, stop and use current production authority.

Canonical rollback:

`backup/golden-homepage-approved-20260829`

Additional cleanup rollback branches may exist for narrow sanitation steps. They are rollback evidence, not design authority.

## Current homepage state

The approved homepage is already in production. Do not restart old Hero C-shape, Golden Assembly, Footer donor, Selected Work donor or Financial Stream proof experiments.

Current homepage authority is documented component-by-component in `/PRODUCTION-AUTHORITY.md`.

Key current facts:

- Header: current Header System.
- Hero: approved Signature R3 + current Golden cube runtime.
- Connected System: approved R13.
- Two Worlds: approved Golden R1 + landscape correction.
- Technology: approved Transition R2 chain.
- Financial Stream: approved R1.4 presentation with `EN + RU`, `8.36K` search impressions and `52` indexed pages; mobile geometry frozen by Owner on 2026-08-29.
- Selected Thinking: current R1 chain.
- Selected Work: current R1 + owner title correction authority.
- Footer: current Golden R3 structure with Signature R4 material authority.

## Active R&D — AI Systems / Boxes Hover

This workstream is **not production authority** and must stay isolated from `main` until Owner visual approval.

AI Systems frozen product authority:

`6fdc0a46a008c3c308c144a734d191d0c97b0473`

Historical donor-recovery branches to preserve as evidence:

- `agent/proai-ai-systems-hover-donor-fidelity-r1`
- `agent/proai-ai-systems-hover-donor-fidelity-r1-1`
- `agent/proai-boxes-hover-native-runtime-validation-r1`

Latest forensic commits reported:

- R1.1 GLB forensic validation: `07d97e92e02ac48fc0dc8f586cb70ac30418166c`
- native runtime validation evidence head: `2837b90`

### Acquired donor files

`boxes_hover.glb`

SHA256:

`bf08adff36c83b5d4becdddac3d68d1a83e5c985b9d7ee71aad516afb202d401`

`boxes_hover.spline`

SHA256:

`49a6b63e3b4dbefc936ea4c91dc79e12d7869f4b3aa80437e58dc8eb50683aff`

Verified GLB forensic baseline:

- GLB 2.0;
- 307 nodes;
- 156 meshes;
- approximately 45,414 triangles;
- 1 orthographic camera;
- raw GLB is **not** the visual/runtime authority for the interactive public Boxes Hover state.

### Canonical web-runtime authority discovered 2026-09-02

Official Spline scene runtime:

`https://prod.spline.design/qM1zaX9eZ9RVFr6r/scene.splinecode`

Official Spline Viewer embed:

```html
<script type="module" src="https://cdn.spline.design/@splinetool/viewer@2.0.27/build/spline-viewer.js"></script>
<spline-viewer url="https://prod.spline.design/qM1zaX9eZ9RVFr6r/scene.splinecode"></spline-viewer>
```

Public original scene:

`https://my.spline.design/boxeshover-lql1ZGkjxCEQe8mgxeMO6mZC/`

Owner-observed Spline Play Settings:

- Main Scene: `Scene 1`;
- Camera: `Personal Camera`;
- Renderer: `WebGPU Only`;
- Async Shaders: `Yes`;
- Loading Preview: `No`;
- Loading: `None`;
- Hint: `None`;
- Mouse Events: `Local (Canvas Container)`.

### Native runtime validation result — 2026-09-02

Codex validated both URLs on the Owner's real Windows machine using system Google Chrome `152.0.7977.64` with hardware acceleration and a working WebGPU adapter. GPU inventory reported Intel UHD Graphics 630 with NVIDIA GTX 1650 installed.

Validation outcome:

`ORIGINAL RUNTIME MISMATCH`

Verified:

- `navigator.gpu`: PASS;
- WebGPU adapter: PASS;
- `scene.splinecode`: HTTP 200, reported 46,359 bytes;
- Spline Viewer `2.0.27`: loaded;
- Public Original: loaded;
- Official Viewer runtime: loaded, with a non-fatal WebGPU `ShadowDepthTexture` validation error;
- no GLB/Three.js/manual reconstruction used;
- no ProAI adaptation, Cube modification, merge or deploy.

Material mismatch reported between the current Viewer runtime and Public Original at rest, center hover, edge hover, pointer movement, settling, geometry/depth, camera/composition and colors/lighting. This is **not** a WebGPU blocker and **not** evidence that the donor concept itself is wrong; both web runtimes executed successfully but did not represent the same published state.

Evidence branch:

`agent/proai-boxes-hover-native-runtime-validation-r1`

Evidence head reported:

`2837b90`

### Export-versioning hypothesis / next forensic gate

Do not reconstruct yet. The next gate is to determine whether Public URL and Viewer are different Spline export snapshots / Play Settings versions.

Spline export behavior is versioned independently: Public URL changes require an explicit `Update Public URL`; Viewer exports require `Update`; Code Export supports Production/Draft snapshots and changes require a new/promoted production draft. Therefore a stale Viewer export or differing Play Settings is a concrete hypothesis that must be tested before abandoning the donor or rebuilding it.

Required next actions:

1. inspect the original Spline project Export panels for `Public URL`, `Viewer`, and `Code Export` without editing the scene;
2. record the currently selected Main Scene, Camera, Renderer, Mouse Events and all material Play Settings separately for Public URL and Viewer;
3. inspect Viewer/Code Drafts or production snapshot state where available;
4. preserve the currently mismatching `scene.splinecode` URL and validation evidence before any update;
5. determine whether `Update Viewer` would publish the current editor scene/settings to the existing Viewer URL;
6. only after preservation, update Viewer from the exact current source scene if doing so is confirmed safe and does not alter the Public Original;
7. rerun the exact side-by-side WebGPU validation;
8. binary outcome: `EXPORT VERSION MISMATCH RESOLVED` or `SOURCE SCENE / PUBLIC ORIGINAL DIVERGENCE`.

Do **not** buy another donor, manually reconstruct hover, or abandon this donor until this export-versioning gate is resolved.

### Hard correction / do not research again

Do **not** repeat the following as primary donor-recovery approaches:

- treating the raw GLB as the complete interactive donor;
- judging fidelity from static fallback screenshots;
- forcing WebGL when the original Spline Viewer is configured `WebGPU Only`;
- reconstructing a manual `13×11` / `143 boxes` field before validating the official runtime;
- generating substitute `BoxGeometry`, manual height falloff, invented easing, or invented hover behavior;
- applying ProAI Indigo/Pearl semantics before the original runtime itself passes Owner visual comparison.

The GLB and previous reconstruction work remain forensic evidence only; do not delete them, but do not spend more time re-proving the same limitation.

### Next hard gate

Resolve whether the mismatch is caused by independent Spline export snapshots / Play Settings. If the Viewer can be safely synchronized to the current Public Original source scene, rerun:

- rest;
- center hover;
- edge hover;
- live pointer movement;
- geometry/depth;
- materials/colors/light;
- camera/composition;
- motion/settling.

Binary outcome only:

1. `EXPORT VERSION MISMATCH RESOLVED / FULL ORIGINAL RUNTIME CONFIRMED` → stop manual reconstruction and use the synchronized native Spline runtime as donor authority.
2. `SOURCE SCENE / PUBLIC ORIGINAL DIVERGENCE` → document exactly which published state is authoritative before any donor replacement or reconstruction decision.

No ProAI adaptation, merge, or deploy before this gate passes and Owner visually approves the actual runtime.

## Workstream separation — ProAI Cube

ProAI Cube ownership/fingerprint and visible-signature correction are a separate workstream. Do not modify Cube files, Cube branches, Cube runtime, or Cube production state from a Boxes Hover / AI Systems task. Likewise, Cube tasks must not alter Boxes Hover work.

## Current execution phase

The current production phase is authority-controlled maintenance after the approved Golden homepage was frozen. Active R&D workstreams must remain isolated until their explicit Owner gates pass.

Rules:

- no redesign during cleanup;
- no product copy or geometry changes unless explicitly authorized;
- remove stale authority, duplicated review copies and confirmed unreferenced donors only after dependency checks;
- preserve current production wiring and deployment verification;
- preserve rollback before destructive cleanup;
- do not rewrite Git history;
- future production micro-polish must start from current `main`, never from an old donor or checkpoint;
- R&D donor branches may continue from their frozen product authority when explicitly documented, but must not silently become production authority.

## GitHub public-surface rule

Public repository README/profile text must not present superseded proof metrics or old project status as current.

Current Financial Stream public proof framing:

- bilingual delivery: `EN + RU`;
- `8.36K` search impressions;
- `52` indexed pages;
- Google Search Console, six-month window, August 2026;
- indexing updated August 16, 2026.

Do not reintroduce old `57 clicks / 7.24K / 50 pages` or superseded `63 clicks` homepage proof as current evidence.

## Owner workflow contract

- Technical PASS does not equal Owner visual approval.
- Narrow, reversible changes only.
- Verify exact diff before moving `main`.
- Do not claim browser or visual QA unless it was actually performed.
- Every meaningful Owner-facing progress update and final report begins with `OWNER SUMMARY — RU`.
- The Owner is not responsible for manually preserving technical handoffs, runtime URLs, hashes, or evidence already supplied to an agent; agents must persist relevant state in the canonical handoff.

## Site invariants

- English root; Russian under `/ru/`.
- Preserve canonical, reciprocal hreflang, x-default, sitemap and internal links.
- Preserve accessibility and reduced-motion behavior.
- Do not invent outcomes, rankings, revenue, reviews, licenses or proof.
- Keep EN/RU localization natural rather than mechanically mirrored.
