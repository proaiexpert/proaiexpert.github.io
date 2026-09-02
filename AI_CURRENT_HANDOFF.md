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

### Canonical web-runtime authorities discovered 2026-09-02

Public original scene — **current visual/interaction donor authority**:

`https://my.spline.design/boxeshover-lql1ZGkjxCEQe8mgxeMO6mZC/`

Separate Spline Viewer scene export under investigation:

`https://prod.spline.design/qM1zaX9eZ9RVFr6r/scene.splinecode`

Viewer embed:

```html
<script type="module" src="https://cdn.spline.design/@splinetool/viewer@2.0.27/build/spline-viewer.js"></script>
<spline-viewer url="https://prod.spline.design/qM1zaX9eZ9RVFr6r/scene.splinecode"></spline-viewer>
```

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

Codex validated both web exports on the Owner's real Windows machine using system Google Chrome `152.0.7977.64` with hardware acceleration and a working WebGPU adapter. GPU inventory reported Intel UHD Graphics 630 with NVIDIA GTX 1650 installed.

Correct business status:

`PUBLIC ORIGINAL RUNTIME CONFIRMED / VIEWER EXPORT MISMATCH`

Verified:

- Public Original loads and runs on the real Windows/WebGPU environment;
- `navigator.gpu`: PASS;
- WebGPU adapter: PASS;
- separate `scene.splinecode`: HTTP 200, reported 46,359 bytes;
- Spline Viewer `2.0.27`: loads;
- Viewer runtime loads with a non-fatal WebGPU `ShadowDepthTexture` validation error;
- no GLB/Three.js/manual reconstruction used;
- no ProAI adaptation, Cube modification, merge or deploy.

The Viewer export materially does **not** match the Public Original at rest, center hover, edge hover, pointer movement, settling, geometry/depth, camera/composition and colors/lighting.

This mismatch does **not** mean the donor is missing or unusable: the exact beautiful Public Original itself is a working interactive Spline runtime and is now the donor visual/interaction authority. What remains unresolved is whether the current editable Spline source matches that Public Original and whether the Viewer URL is merely a stale/differently configured export snapshot.

Evidence branch:

`agent/proai-boxes-hover-native-runtime-validation-r1`

Evidence head reported:

`2837b90`

### Export/source synchronization hypothesis — next forensic gate

Do not reconstruct and do not buy another donor. The next gate is to compare three states without editing the scene:

1. Public Original runtime;
2. current Spline editor Play Mode for the acquired project;
3. current Viewer export.

Spline export behavior can diverge by snapshot/settings: Public URL changes require an explicit `Update Public URL`; Viewer exports require `Update`; Code Export supports Production/Draft snapshots. A stale Viewer export or different Viewer Play Settings is therefore a concrete, testable explanation for the mismatch.

Required decision tree:

- If **Editor Play Mode matches Public Original**, then the source project is correct and the Viewer export is stale/misconfigured. Preserve current Viewer evidence, then synchronize only the Viewer export/settings and rerun comparison.
- If **Editor Play Mode matches Viewer but not Public Original**, do **not** update Public URL or Viewer. The editable source has diverged from the working published donor; preserve the Public Original and identify/recover the published source/version before adaptation.
- If **Editor Play Mode matches neither**, compare Public URL vs Viewer Play Settings, camera/main scene/export snapshot state and determine the exact divergence before any update.

The Public Original is already a valid integration/runtime fallback via its official Spline Public URL/iframe path; Viewer parity is desirable for a native `<spline-viewer>` integration but is not evidence that the donor itself is unavailable.

### Hard correction / do not research again

Do **not** repeat the following as primary donor-recovery approaches:

- treating the raw GLB as the complete interactive donor;
- judging fidelity from static fallback screenshots;
- forcing WebGL when the original Spline experience is configured `WebGPU Only`;
- reconstructing a manual `13×11` / `143 boxes` field;
- generating substitute `BoxGeometry`, manual height falloff, invented easing, or invented hover behavior;
- declaring the donor failed merely because the separate Viewer export differs from the working Public Original;
- applying ProAI Indigo/Pearl semantics before source/public authority is resolved.

The GLB and previous reconstruction work remain forensic evidence only; do not delete them, but do not spend more time re-proving the same limitation.

### Next hard gate

Use the same local Windows/Codex environment that already proved WebGPU support. Without editing the scene, compare current Spline Editor Play Mode against the Public Original first.

Binary outcomes:

1. `SOURCE + PUBLIC ORIGINAL CONFIRMED / VIEWER STALE` → preserve Viewer evidence, synchronize Viewer export/settings, rerun side-by-side, then stop for Owner approval.
2. `PUBLIC ORIGINAL CONFIRMED / EDITOR SOURCE DIVERGED` → preserve working Public URL and recover the matching published source/version before any ProAI adaptation.
3. `EXPORT SETTINGS DIVERGENCE` → reconcile only the identified export settings after preserving all prior values, then rerun validation.

No manual reconstruction, donor replacement, ProAI adaptation, merge, or deploy before this gate is resolved.

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
