# Boxes Hover Runtime Authority — 2026-09-02

Status: CURRENT FORENSIC AUTHORITY

This document records the current verified state of the ProAI Expert AI Systems / Boxes Hover donor workstream. It is evidence/authority only and does not authorize product integration, merge, or deployment.

## Verified donor authorities

Public Original — current strongest visual and interaction authority:

`https://my.spline.design/boxeshover-lql1ZGkjxCEQe8mgxeMO6mZC/`

Separate Viewer scene export under investigation:

`https://prod.spline.design/qM1zaX9eZ9RVFr6r/scene.splinecode`

Viewer runtime:

`@splinetool/viewer 2.0.27`

Acquired files preserved:

- `boxes_hover.glb` SHA256 `bf08adff36c83b5d4becdddac3d68d1a83e5c985b9d7ee71aad516afb202d401`
- `boxes_hover.spline` SHA256 `49a6b63e3b4dbefc936ea4c91dc79e12d7869f4b3aa80437e58dc8eb50683aff`

## Latest native runtime / source reconciliation result

Evidence branch:

`agent/proai-boxes-hover-native-runtime-validation-r1`

Evidence HEAD reported:

`3973a8eadf22da1c9898061d2ad68b2ebd409f40`

Evidence report:

`docs/site-evolution/ai-systems/boxes-hover-native-runtime-validation-r1/source-export-reconciliation-r1/SOURCE_EXPORT_RECONCILIATION_REPORT.md`

Verified on the Owner's Windows PC:

- System browser: Google Chrome `152.0.7977.64`
- GPU inventory: Intel UHD Graphics 630; NVIDIA GTX 1650 installed
- hardware acceleration: PASS
- `navigator.gpu`: PASS
- WebGPU adapter: PASS (`maxTextureDimension2D: 16384`)
- Public Original: PASS
- Editor Play Mode: launches, but does not visually match Public Original
- Viewer runtime: launches, but does not match Public Original
- Public Original iframe/embed path: PASS, including center hover, edge hover, pointer-leave settling
- `scene.splinecode`: HTTP 200, 46,359 bytes, `application/json`
- current Viewer SHA256: `4BA4B16BDE969700AF42E63482ECDA20218CE0F7CE5728BD1968C5830E96D468`
- Public URL was NOT updated
- Viewer was NOT updated
- no GLB/Three.js/manual reconstruction was used
- no ProAI adaptation, Cube changes, product-code changes, merge, or deploy were performed

Observed Spline export settings:

Public URL:

- Main Scene: `Scene 1`
- Camera: `Personal Camera`
- Renderer: `WebGPU Only`
- Async Shaders: `Yes`
- Preload: `Yes`

Viewer:

- Main Scene: `Scene 1`
- Camera: `Personal Camera`
- Renderer: `WebGPU Only`
- Async Shaders: `Yes`
- Mouse Events: `Local (Canvas Container)`
- Preload is not displayed in Viewer settings

Code Export:

- Vanilla JS / Web Content
- current `scene.splinecode`
- Drafts empty
- Generate Draft was not used

## Correct interpretation

Canonical status:

`PUBLIC ORIGINAL CONFIRMED / EDITOR SOURCE DIVERGED`

The exact beautiful Public Original is NOT lost. It is a working WebGPU Spline runtime and can be embedded through its current Public URL / iframe path.

The current editable Spline project is not the same visual/runtime state as the working Public Original. The separate Viewer export is also not the same state. Therefore neither the current Editor Source nor the current Viewer may be treated as the donor visual authority.

The working Public Original is the donor authority until a matching editable source snapshot is recovered.

## Important limitations

An iframe/embed of the Public Original proves an exact-native integration path for preserving the donor experience as-is. It does NOT yet prove that ProAI can safely modify internal donor materials, object states, labels, or semantics from the host page. Cross-origin/runtime control capabilities must be proven before planning adaptation through the iframe path.

## Do not repeat

Do not spend more time on:

- GLB as the complete interactive authority;
- GLTFLoader reconstruction;
- manual `13x11` / `143 boxes` recreation;
- substitute BoxGeometry;
- invented hover falloff/heights/easing;
- static fallback as fidelity evidence;
- abandoning the donor merely because Editor/Viewer diverge from the working Public Original.

## Next hard gate

Recover or identify an EDITABLE source state that matches the working Public Original, without modifying or overwriting the current working Public URL.

Preferred forensic order:

1. preserve the current Editor project and current Public Original unchanged;
2. inspect Spline project/version history for a snapshot matching Public Original;
3. inspect whether the working Public Original can be safely duplicated/remixed into a separate editable project without changing the published original;
4. if a matching editable snapshot is recovered, compare it against Public Original at rest, center hover, edge hover, live pointer and settling;
5. only after exact editable-source parity is proven may ProAI adaptation begin.

If no editable source can be recovered, the Public Original iframe remains a valid exact-native presentation path, but ProAI adaptation must be scoped around its control limitations rather than by reconstructing the donor from scratch.

## Workstream separation

Do not touch ProAI Cube from this workstream. Do not merge or deploy AI Systems / Boxes Hover changes before explicit Owner visual approval.
