# Reactive Orb R1B — official Spline Runtime access and material probe

Status at commit: **TECHNICAL HOLD / OWNER PREVIEW EXPERIMENT — NOT ACCEPTED**.

## Immutable authority and base

- Current `main` observed 2026-10-08 PT: `bd4b01ed73464615a794038982989b109bfb47db`.
- Authority branch: `agent/ai-systems-hero-reactive-orb-authority-r1` at `48126513de95161f83980a837f044430e021b91b`.
- Source Bridge: `agent/ai-systems-hero-reactive-orb-source-bridge-r1` at `2fe32d087b51d92bc603baf6b7850ff0ea398104`.
- Phase A: `agent/ai-systems-hero-reactive-orb-signature-r1-donor-fidelity` at `f9a160c97d8d4b3d212ef0bca8811bb2a182fe81`.
- R1B branch is **directly based on Phase A** because Phase A includes the seven canonical authority docs and frozen donor-only preview. Source Bridge is a sibling branch (not an ancestor); its evidence was read, not merged.

## Sources inspected

- Seven authority documents: README, PROJECT_AUTHORITY, DONOR_RECORD, DESIGN_RESEARCH_SYNTHESIS, RND_HISTORY, NEXT_IMPLEMENTATION_STAGE, SOURCE_MANIFEST.
- Source Bridge: SOURCE_BRIDGE_REPORT, SOURCE_INVENTORY.
- Phase A: IMPLEMENTATION_REPORT and original owner-preview index.
- PROAI Cube: PROVENANCE_RECORD, OWNERSHIP_MANIFEST, build-proai-cube-ownership-r1, verify-proai-cube-integrity-r2, current PRODUCTION-AUTHORITY.
- Official: https://docs.spline.design/skill.md; https://docs.spline.design/exporting-your-scene/web/code-api-for-web; https://www.npmjs.com/package/@splinetool/runtime; CDN README for runtime 1.12.x.

## Donor and license

- Reactive Orb by Vlad Kolokolnikov; Community: https://app.spline.design/community/file/306ca2a5-d1ab-46ac-a27c-198575c82db0
- Observed source-page marking: CC BY 4.0. Creator credited in preview. No ProAI ownership assertion over the donor.
- Owner Remix: https://app.spline.design/file/88f4ebca-9bc8-4d85-a918-13a19c3b13ab
- Original public runtime: https://my.spline.design/proaireactiveorbdonororiginal20261005-tNW94akGzluKeBFXuZZwlsyM/
- Export URL observed in source Spline UI: https://prod.spline.design/sH5GiugwHqy0gA4X/scene.splinecode
- Local .spline SHA-256 recorded in donor authority: `7E69759DBD339EC5E481D018731DB9820AE767DA46E7CF0ED819D7C7894B0F84`. No access to file contents in this environment; not modified.

## Implementation

- Four mutually selectable review modes in `owner-preview/ai-systems-reactive-orb-runtime-r1b/index.html`: original published iframe, official runtime-based material probe, original-versus-probe split, clean runtime probe.
- The original iframe points at the unmodified published donor and never receives a CSS filter.
- The probe imports the pinned npm `@splinetool/runtime@1.12.98` through an ESM delivery endpoint, constructs `Application(canvas)`, and awaits `app.load()` of the **actual exported donor scene URL**.
- Only after load resolves: enumerate `getAllObjects()`, find named original `Instance`, inspect `material.layers`, and write documented `fresnel.color` = `#C4CBD2` (cold silver) and/or `color.color` = `#303640` (graphite), when exposed. Read back properties; collect errors and object counts. No color layer is inserted if the source does not expose one. No other object is edited.
- No geometry, tiles, shell, spheres, custom Three.js, depth/lighting/motion changes, source changes, signature, or changes to live AI Systems.
- Diagnostics via browser `window.__proaiOrbR1B` or Copy diagnostics.
- Fail-closed: load failure or unexposed Instance/material marks HOLD; no success fallback imagery.

## Evidence boundaries

1. Official API documents remote `.splinecode` loading and material-layer setters **generically**, not donor-specific success.
2. Previous Source Bridge observed a published pointer reaction/return and the editor's `Instance` with Lighting/Fresnel/Depth and 250 named Clone groups. These are prior observations, not new runtime QA.
3. The current execution host could not DNS-resolve `prod.spline.design`; a direct binary fetch and local headless browser online test were blocked. Web text fetch also could not retrieve the binary. A static source review is not a render PASS.
4. Branch-only GitHub Actions QA was added to run a real browser against the exact donor URL and to upload screenshot/JSON artifacts. The CI result must be read separately; no automatic ACCEPT of visual fidelity, clone material propagation, pointer response, or reformation.
5. A separate Vercel project `proai-reactive-orb-r1b-preview` was created with static review files. Vercel returned deployment READY; website rendering/public HTTP accessibility has not been independently established. Vercel labeled the first deployment `target=production` **within this new isolated preview-only project** even though the request specified `target=preview`. The existing ProAI website/project, GitHub Pages, and main were not deployed or changed.

## Decision and next acceptance gates

- Remote donor load: **UNVERIFIED** until browser evidence reports PASS.
- Original scene render / silhouette / density: **UNVERIFIED** (cannot infer from `load()`).
- Pointer response and return/reformation: **UNVERIFIED in R1B**; previous public baseline reports separate observations.
- Runtime object access: **UNVERIFIED**, diagnostic code in place.
- Material setter acceptance: **UNVERIFIED**, conditional code in place; readback alone does not mean visual success.
- If material access succeeds but clones do not visually inherit it, do not mass-recolor unknown objects or claim completion; report limitation and switch to Spline editor copy only if truly needed.
- If source URL cannot load, investigate CORS, published export vs public page, runtime version and WebGPU Only. No new reconstructed Orb.
- Owner must see visually faithful before any merge, production integration, or subsequent lighting/motion stages.

## Isolation policy

- Main modified: NO.
- Existing production / existing AI Systems page / Cube modified: NO.
- Merge: NO.
- Donor original edited: NO.
- New isolated Vercel preview project created: YES (first deployment labeled production within this new project only).
- Implementation branch: `agent/ai-systems-hero-reactive-orb-runtime-lookdev-r1b`.
- Hard release gate: **HOLD** pending real browser and owner visual proof.
