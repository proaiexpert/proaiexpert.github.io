# Reactive Orb R1B — official Runtime access & first original-material proof

**FINAL STATUS: TECHNICAL PARTIAL PASS / VISUAL HOLD.**
Updated 2026-10-09 UTC. Evidence-only owner-preview R&D branch; **no merge authorization**.

## Fresh source authority and lineage

| Source | SHA |
| --- | --- |
| Current verified production `main` at start | `bd4b01ed73464615a794038982989b109bfb47db` |
| Authority | `48126513de95161f83980a837f044430e021b91b` |
| Source Bridge | `2fe32d087b51d92bc603baf6b7850ff0ea398104` |
| Phase A | `f9a160c97d8d4b3d212ef0bca8811bb2a182fe81` |
| Implementation branch | `agent/ai-systems-hero-reactive-orb-runtime-lookdev-r1b` |
| Base | Phase A HEAD (`f9a160c97d8d4b3d212ef0bca8811bb2a182fe81`) |

Phase A contains seven authority documents. Source Bridge diverges as a sibling of the authority/Phase A lineage, so its evidence was read but its commits were **not merged**. `main` and `PRODUCTION-AUTHORITY.md` remain product authority.

## Authority and Cube precedent read

- Authority: `README.md`, `PROJECT_AUTHORITY.md`, `DONOR_RECORD.md`, `DESIGN_RESEARCH_SYNTHESIS.md`, `RND_HISTORY.md`, `NEXT_IMPLEMENTATION_STAGE.md`, `SOURCE_MANIFEST.json`.
- Source Bridge: `SOURCE_BRIDGE_REPORT.md`, `SOURCE_INVENTORY.md`.
- Phase A: `IMPLEMENTATION_REPORT.md`, its baseline owner-preview.
- Cube: `docs/site-evolution/reviews/proai-cube-ownership-fingerprint-r1/PROVENANCE_RECORD.md`, `OWNERSHIP_MANIFEST.json`, `scripts/build-proai-cube-ownership-r1.mjs`, `scripts/verify-proai-cube-integrity-r2.mjs`; binaries known through manifests, not claimed decoded in this task.
- Official Spline: https://docs.spline.design/skill.md; https://docs.spline.design/exporting-your-scene/web/code-api-for-web; https://www.npmjs.com/package/@splinetool/runtime and package documentation. Code/API controls are considered proven only by real browser execution below.

## Original donor and preserved provenance

- Original: **Reactive Orb**, author **Vlad Kolokolnikov**.
- Community: https://app.spline.design/community/file/306ca2a5-d1ab-46ac-a27c-198575c82db0
- Observed Community license label: **CC BY 4.0**, retained in preview attribution; not a transfer of authorship to ProAI or a legal opinion.
- Owner Remix: https://app.spline.design/file/88f4ebca-9bc8-4d85-a918-13a19c3b13ab
- Preserved published original: https://my.spline.design/proaireactiveorbdonororiginal20261005-tNW94akGzluKeBFXuZZwlsyM/
- Real exported runtime payload: https://prod.spline.design/sH5GiugwHqy0gA4X/scene.splinecode
- Historic immutable local source SHA-256: `7E69759DBD339EC5E481D018731DB9820AE767DA46E7CF0ED819D7C7894B0F84` for `proai_reactive_orb_donor_original_2026_10_05.spline` (64,846 bytes); local source not accessible or altered here.

## Runtime implementation and evidence

**Authoring path:** `owner-preview/ai-systems-reactive-orb-runtime-r1b/index.html`

Four modes: `?view=original` (untouched Spline public iframe), `?view=adapted` (official Runtime with in-memory material patch), `?view=compare` (both sources side by side), `?view=clean` (runtime-only). No filters, fake Orb, WebGL geometry reconstruction, Three.js substitute, or shell/tile structures.

- Official `@splinetool/runtime@1.12.98` imported from pinned ESM delivery URL, `new Application(canvas)`, `app.load(SCENE)` returned normally.
- GitHub Actions real Chromium proof **PASS** for remote scene load, object access, precise Clone hierarchy and material setter readback: https://github.com/proaiexpert/proaiexpert.github.io/actions/runs/37895756688. Run conclusion **SUCCESS**, internal report `TECHNICAL_PARTIAL`.
- `getAllObjects()` returned **769 original objects**, including **253 named Sphere material hosts**.
- Actual hierarchy detection via `parentUuid`: **250 distinct `Clone 0` through `Clone 249` descendants each contain an original `Group/Sphere`**. No ambiguity about selecting unrelated spheres: exactly 250 matched.
- Real Fresnel layers exposed on the original Sphere objects. Original Fresnel `color` RGBA in inspected object: `{r:0.16341075740803065,g:0.9350726673903974,b:0.9119228100909261,a:1}` (green/teal).
- On **each of the 250 original Clone spheres**, only existing `material.layers[].type='fresnel'` color was set in memory to **`#C4CBD2` (cold silver / pearl-grey)**. **250/250 write-readback matches.** No new layer, no depth gradient modification, no lights, no added mesh, no camera/event/motion mutation. The runtime object count stayed **769 before and after**.
- `#303640` graphite was an initial candidate but **NOT applied** because original clone spheres expose Fresnel / Depth / Lighting, not a color layer. Obsidian, gunmetal and new lighting not implemented.
- These values are in-memory edits of a loaded published scene, **not** edits to immutable source, Owner Remix, or original Spline publish.

## Evidence quality / limits

- **Remote scene loading: PASS.**
- **Runtime original Clone hierarchy access: PASS.**
- **Material property writes/readback: PASS (250/250); visual material acceptance: UNVERIFIED.**
- Rendering/silhouette and exact original pixel appearance in the separate runtime canvas: **UNVERIFIED** under R1B. The existing published Spline public page has prior observed REST/pointer/return, but this R1B browser test did not positively verify those motions.
- GIF/video/motion QA not performed. `getAllObjects` and setters do **not** prove pointer response, reformation, sprite/clone animation equivalence, or visible shader repaint.
- Browser CI `37898999325` failed while trying a screenshot of continuously animated WebGPU canvas: `locator.screenshot` waited for element stability and timed out. A subsequent screenshot A/B experiment was also not accepted as repeatable. These harness limits are **not** evidence that the actual Spline runtime failed; the last accepted material/API-level CI was green. The stable test script was restored to the CI-proven 250/250 API verification.
- No mobile, touch, reduced-motion, geometry visual equivalence, measured FPS, or source hash comparison beyond recorded provenance. No false PASS claims.
- No `.spline` or `.splinecode` export attempted and no Codex/local machine step required for documented remote access.

## Preview publication

An independent **new** Vercel project `proai-reactive-orb-r1b-preview` was created (`prj_MAFhuABtiQ7sYAesNzmsKjXTT8py`); existing ProAI domain/site/project were not changed.

Four URLs on isolated immutable deployment `dpl_EesiBf4VR3BDcoaLkQ3AAkKwX3rQ`, Vercel `READY`, `target:null`:

- Original: https://proai-reactive-orb-r1b-preview-9erupongq.vercel.app/owner-preview/ai-systems-reactive-orb-runtime-r1b/index.html?view=original
- Adapted: https://proai-reactive-orb-r1b-preview-9erupongq.vercel.app/owner-preview/ai-systems-reactive-orb-runtime-r1b/index.html?view=adapted
- Compare: https://proai-reactive-orb-r1b-preview-9erupongq.vercel.app/owner-preview/ai-systems-reactive-orb-runtime-r1b/index.html?view=compare
- Clean: https://proai-reactive-orb-r1b-preview-9erupongq.vercel.app/owner-preview/ai-systems-reactive-orb-runtime-r1b/index.html?view=clean

Vercel reported `READY` and files present. Independent public HTTP/browser usability of deployed route was **not verified** from this execution host; external HTTP probes had DNS/connectivity limits. SSO auth was disabled **on this preview-only Vercel project** for owner access.

**Disclosure:** the *first* Vercel upload to this newly created separate R1B-only project was classified by the API as `target:production` **within that new project**, despite passing `target:preview`. This is not a change to existing ProAI website production, but that Vercel classification must not be concealed. The later 250-Fresnel deployment above has `target:null`.

## Changed R1B files only

1. `owner-preview/ai-systems-reactive-orb-runtime-r1b/index.html`
2. `scripts/qa-reactive-orb-runtime-r1b.mjs`
3. `.github/workflows/reactive-orb-r1b-runtime.yml`
4. `docs/site-evolution/ai-systems/hero-reactive-orb-runtime-lookdev-r1b/IMPLEMENTATION_REPORT.md`

## Final decision

**TECHNICAL PARTIAL PASS; VISUAL HOLD.** This phase established real official Runtime access and exact selective color setters for all 250 native clone spheres. It **did not** establish visible quality, pointer/reformation parity, or full neutral material transformation. Continue normal ChatGPT/GitHub-driven work on this branch; local Codex only if a concrete browser/editor-only material limitation remains after further runtime visual QA. No production integration, design acceptance, merge, or signature stage authorized.

NEXT: owner compares original/adapted preview in a compatible WebGPU browser; independently verify visible cold silver effect and REST/pointer/return. If colors are not visibly updated, inspect Spline Runtime event/material updates / alternative official exposed properties and report precise limitation; do not create replacement scene. After visual pass choose further limited material-layer changes (Depth gradient only if native layer editing documented and tested), then defer lighting/motion/signature to separate decisions.

MAIN MODIFIED: **NO**. EXISTING PRODUCTION MODIFIED: **NO**. ORIGINAL DONOR EDITED: **NO**. MERGE PERFORMED: **NO**.
