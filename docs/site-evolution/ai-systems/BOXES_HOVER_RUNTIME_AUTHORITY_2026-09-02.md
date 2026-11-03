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

## Native runtime / source reconciliation result

Evidence branch:

`agent/proai-boxes-hover-native-runtime-validation-r1`

Earlier reconciliation evidence HEAD:

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

## Editable-source recovery result

Latest evidence HEAD reported:

`2348ccbc039988e1dde81229004648105e97f6de`

Evidence report:

`docs/site-evolution/ai-systems/boxes-hover-native-runtime-validation-r1/editable-source-recovery-r1/EDITABLE_SOURCE_RECOVERY_REPORT.md`

Canonical recovery status:

`TECHNICAL BLOCKER — EDITABLE SOURCE NOT RECOVERED`

Verified:

- Public Original preserved: YES
- Current Editor source preserved: YES
- Spline Version History is available for read-only preview
- inspected versions: Current Version; Auto-saved Sep 1, 2026 22:41; Auto-saved Sep 1, 2026 22:38
- historical snapshot `2026-09-01 22:41` is a promising visual candidate close to Public Original
- snapshot `2026-09-01 22:38` renders an empty black canvas and is rejected
- public runtime exposes no Remix / Duplicate / Copy / Open in Spline action
- Spline blocks Restore and Duplicate of historical versions behind Enterprise upgrade
- no historical version was restored or duplicated
- no editable project matching Public Original was recovered
- Public URL and Viewer remained untouched
- no reconstruction, ProAI adaptation, product-code change, merge or deploy was performed

This result is consistent with current Spline documentation: Version History previews are available, while restoring and creating manual saves are Enterprise features. Do not treat the inability to restore as evidence that the Public Original itself is lost.

## Correct interpretation

Canonical status:

`PUBLIC ORIGINAL CONFIRMED / EDITOR SOURCE DIVERGED / EDITABLE RECOVERY BLOCKED`

The exact beautiful Public Original is NOT lost. It is a working WebGPU Spline runtime and can be embedded through its current Public URL / iframe path.

The current editable Spline project is not the same visual/runtime state as the working Public Original. The separate Viewer export is also not the same state. A historical Sep 1 22:41 snapshot appears visually promising, but exact editable parity is not yet proven because Restore/Duplicate is paywalled.

The working Public Original remains the donor visual/interaction authority.

## Important new forensic opportunity

Before paying for Enterprise or abandoning the donor, inspect the network requests made by the already-working Public Original and identify the exact production scene/runtime asset that it loads.

The Public URL page necessarily loads the runtime resources required to render the beautiful donor. The next safe task is therefore to capture, without modifying anything:

- every `prod.spline.design/.../scene.splinecode` request made by the Public Original;
- runtime/library versions used by the Public Original;
- response status, content type, byte size and SHA256 of the exact public runtime scene asset;
- whether that exact scene asset can be loaded through the official Spline Viewer or equivalent official runtime while preserving visual/interactivity parity.

This is inspection of the public runtime already delivered to the browser; it is not permission to bypass Enterprise-only restore/duplicate controls or to reconstruct a historical editable source from restricted internal APIs.

## Do not repeat

Do not spend more time on:

- GLB as the complete interactive authority;
- GLTFLoader reconstruction;
- manual `13x11` / `143 boxes` recreation;
- substitute BoxGeometry;
- invented hover falloff/heights/easing;
- static fallback as fidelity evidence;
- abandoning the donor merely because Editor/Viewer diverge from the working Public Original;
- attempting to circumvent Spline Enterprise restrictions for Version History restore/duplicate.

## Next hard gate

Use the same Windows/Codex browser environment that already proved WebGPU support.

1. Load the working Public Original normally.
2. Capture its actual browser network requests.
3. Identify the exact public `scene.splinecode` or equivalent scene payload used by that runtime.
4. Preserve its URL, HTTP metadata, byte size and SHA256.
5. Test that exact public scene asset in a minimal official Spline runtime/Viewer harness without changing the source project or Public URL.
6. Compare rest, center hover, edge hover, live pointer and settling against the Public Original.

Binary outcomes:

- `EXACT PUBLIC RUNTIME ASSET RECOVERED` — native runtime parity is available without reconstruction; stop and return evidence before ProAI adaptation.
- `PUBLIC URL WRAPPER REQUIRED` — exact Public Original remains safely integrable through iframe, but no equivalent independent scene asset was proven.
- `TECHNICAL BLOCKER` — document the exact blocker; do not reconstruct.

Enterprise purchase is NOT authorized by this document. If the historical `22:41` snapshot later proves to be the only route to an editable exact source, present the Owner with the exact plan/cost/benefit decision before any purchase.

## Workstream separation

Do not touch ProAI Cube from this workstream. Do not merge or deploy AI Systems / Boxes Hover changes before explicit Owner visual approval.
