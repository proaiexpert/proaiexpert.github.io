# PROAI REACTIVE ORB — R1C.1 targeted visual QA repair

**Status: VISUAL HOLD pending reliable GPU-rendered evidence.** This is a QA repair, not approval of the native material lookdev.

## Scope and exact authority

- Repository `proaiexpert/proaiexpert.github.io`.
- Source baseline: verified R1C `f98fe67fc1d2e981ad98a82e7d1c20b1a5338b2e`.
- Fresh main at task start: `bd4b01ed73464615a794038982989b109bfb47db`.
- Branch: `agent/ai-systems-hero-reactive-orb-r1c1-visual-qa-repair`.
- Actual Spline donor payload: `https://prod.spline.design/sH5GiugwHqy0gA4X/scene.splinecode`, original `Reactive Orb` by **Vlad Kolokolnikov**, Spline community source (observed CC BY 4.0) — no original scene or remix files changed.
- Inspected R1C implementation report, preview, QA script and workflow before writing.

## Discovered issues

1. R1C automated QA was incorrectly targeting `owner-preview/ai-systems-reactive-orb-runtime-r1b/index.html` and expecting R1B globals instead of R1C. Corrected by a separately versioned R1C.1 owner QA page and new CI that opens that exact implementation page.
2. R1C `canvas.toDataURL()` was returning non-informative black frames: `lit=0` for original and all variants, even when GitHub Actions completed success. It is **not accepted** as a render proof.
3. In first R1C.1 CI, `structuredClone()` on Spline runtime-proxy material arrays threw `DataCloneError`. Replaced with recursively extracted plain arrays and plain objects; original 769 / 250 topology was then validated and real browser screenshots captured.
4. The next R1C.1 CI captured composited real pixels with CDP, but `app.stop()` made the entire material A/B sequence show an identical last frame. Setter-readback PASS did not equal pixel change. A new running-scene, interleaved Original → Modified → Original approach avoids that false comparison and measures motion-induced drift.
5. Mobile owner screenshots of old R1C preview show little credible neutral-material recolor, blackened spheres and bright/teal remnants. Source Spline donor already includes oversized typography and 3D placement beyond narrow phone viewport. Cropping is a comparison/viewport issue, not grounds for changing original geometry within QA scope.

## Implemented files

- `owner-preview/ai-systems-reactive-orb-r1c1-visual-qa/index.html` — real official Spline Runtime loading the original scene; 769-object / 250 distinct named Clone topology guard. An in-place five-state switcher **Original / Fresnel / Depth / Lighting / ProAI combined** applies native original material layer changes to the same loaded scene and restores original source RGBA colors between variants; the owner can observe running GPU output without page reload and animation-phase desynchronization.
- `scripts/qa-reactive-orb-r1c1-visual.mjs` — target corrected to R1C.1 path, CDP `Page.captureScreenshot({fromSurface:true})` as primary plus Playwright screenshot fallback. Decodes composited PNG pixels, excludes the left-side teal typography from color statistics and performs interleaved original/modified/original checks while the runtime continues playing. Reports motion drift, valid original pixels, teal share and object topology. **Never** promotes an all-black or stopped frozen frame to PASS.
- `.github/workflows/reactive-orb-r1c1-visual.yml` — branch-specific, read-only repository CI, screenshot + JSON artifact collection on PASS or HOLD, fails closed on unresolved visual comparison.
- This report.

## Concrete evidence and limitations

- Prior R1C CI `https://github.com/proaiexpert/proaiexpert.github.io/actions/runs/38005493691` ended SUCCESS but pixel result was **lit=0** in every variant — invalid render proof.
- R1C.1 `https://github.com/proaiexpert/proaiexpert.github.io/actions/runs/38021297008` captured **real composited original frames** via CDP: original had `lit=54,253`, `teal=30,987`, but after `app.stop()`, all variants repeated a static frame (teal=0). These are valid evidence that composited capture works, but **not valid evidence for material differentiation**.
- The next continuous-running-scene A-B-A test uses Orb ROI only. The result must be interpreted against original-to-original drift and can legitimately stay HOLD.
- Even a statistically reduced teal share cannot alone certify premium aesthetics, depth, gesture reaction or return/reformation. Native pointer and return parity require separately observable motion proof or owner review.
- Setter and object-count evidence establishes API access, **not** shader refresh. No repeated unbounded setter-only tests planned.
- No geometry, instance count, camera, event bindings or Spline donor source files are intentionally changed.

## Owner visual QA instructions

Open the latest separate R1C.1 preview, preferably in desktop Chrome with hardware acceleration. On iPhone use landscape orientation. Select **Adapted** (not the old R1C preview), wait for runtime status showing `769 objects / 250 clones`, and tap the same-canvas material toggles **Original → Fresnel → Depth → Lighting → ProAI combined → Original**. Do not reload between toggles. Check whether the green/teal native clone spheres visibly change to graphite/metal/silver while maintaining shape and motion; check pointer/touch response and whether original shape reforms when the pointer leaves. Original iframe and Compare views are references but not frame-synchronized; use in-canvas Original vs Combined toggles for the defensible comparison.

If no visible repaint occurs, report `MATERIAL_GPU_UPDATE_UNVERIFIED` (or `NO_VISIBLE_UPDATE` when independently demonstrated with valid controls) and determine whether Spline editor material changes in a **copy** are required. Do not alter original donor, replace geometry, or make production integration.


## Final R1C.1 browser evidence and owner screenshot review

**Observed screenshots supplied by owner:** Original Spline page (mobile browser) repeatedly shows bright white/lime/teal animated spheres and dark teal outlines. Old R1C Vercel preview `...7zenizjlg.vercel.app` shows some darkened surfaces with retained teal rims / highlights, and many spheres become nearly black. This does **not** meet premium ProAI material acceptance; partial darkening cannot be treated as removal of green/teal. All screenshots contain the donor's own typography and off-screen Orb framing, so the two independently advancing animations are not frame-correspondent comparisons. These user screenshots are **not** screenshots of the newer R1C.1 same-canvas switcher.

**Confirmed R1C.1 browser QA results:**

- `https://github.com/proaiexpert/proaiexpert.github.io/actions/runs/38021215602`: original 769/250 source scene loaded; diagnostic found `structuredClone` cannot copy Spline runtime proxy objects. Fixed with plain JSON-like recursive copy.
- `https://github.com/proaiexpert/proaiexpert.github.io/actions/runs/38021297008`: correct R1C.1 implementation page loaded and CDP screenshot had original lit=54,253 / teal=30,987; five native setter modes succeeded for 250 source objects. But `app.stop()` froze the composited frame, and all material variants captured the same stopped image — **no visual pass**.
- `https://github.com/proaiexpert/proaiexpert.github.io/actions/runs/38023503216`: corrected test keeps source scene playing, isolates the Orb ROI from donor text and brackets material changes with an Original/Modified/Original sample. Browser screenshots failed: **CDP `Page.captureScreenshot` timed out**, then **Playwright `page.screenshot` timed out**. No valid evidence of GPU material updates. **This is a capture-path HOLD**, not proof that a live browser shader cannot be updated.
- A subsequent run used the same running-scene capture algorithm and was not relied upon to change the decision. The automated visual gate intentionally fails closed. Following bounded QA policy, no further repetitive headless WebGPU screenshot variants are requested.
- GitHub Actions workflow now limits automatic runs to relevant implementation/test changes and preserves manual dispatch; report-only updates do not trigger another visual test.

**Current definitive statuses:**
- Correct test path to R1C.1: **YES**.
- Real `.splinecode` through official runtime: **PASS**.
- Original objects: **769; exactly 250 distinct named Clone groups**, untouched by authored material edits.
- Native Fresnel/Depth/Lighting setter + readback: **PASS 250/250 per layer** where exposed, but visible shader update remains **UNVERIFIED**.
- Real original browser frame: **CAPTURED** in prior CDP run; stopped material frames captured but **NOT comparable**.
- Running-scene material comparison: **UNVERIFIED** due headless CDP/Playwright capture timeouts.
- Teal removal: **NOT PROVEN**; old owner screenshots still show teal.
- Rest, pointer response, return/reformation: **UNVERIFIED in R1C.1**.
- Desktop: partial load/capture only. Mobile: old preview observed; new R1C.1 mobile QA pending.
- Overall: **TECHNICAL PARTIAL / VISUAL HOLD; NO MERGE AUTHORIZATION**.

**Recommended narrow next step:** Open latest R1C.1 Adapted view in normal desktop Chrome or landscape iPhone and use its five-button in-canvas material switcher. Observe whether visible color actually changes **immediately** between Original and Combined (and individually Depth/Fresnel/Lighting), while geometry and motion remain the same. If there is no visible shader repaint in that interactive browser, mark **NO VISIBLE MATERIAL CHANGE** and move to an authorized *copy* in the Spline Editor for native source material editing and republishing. Do not alter the community donor or create a substitute Orb.

## Isolation

Main modified: **NO**.
Existing ProAI production modified: **NO**.
Existing Cube / AI Systems page modified: **NO**.
Original Spline donor modified: **NO**.
Merge performed: **NO**.
Codex used: **NO**.
No new Vercel project: **YES**; reuse existing isolated project `prj_MAFhuABtiQ7sYAesNzmsKjXTT8py`. Latest static owner preview uploaded under a separate immutable deployment (Vercel READY; independent browser access not yet confirmed).
