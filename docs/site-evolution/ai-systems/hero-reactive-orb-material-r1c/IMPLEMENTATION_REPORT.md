# R1C — Original Material Recovery / ProAI Lookdev Foundation

Status: **TECHNICAL PARTIAL / VISUAL HOLD** — donor-native visual recoloring not yet accepted.

## Authority and provenance
- Fresh `main` initially checked: `bd4b01ed73464615a794038982989b109bfb47db`.
- R1C based exactly on R1B verified head `0cb764cbcb58130df8151d1ac61a0bc8d08d9c8b`.
- Authority: `agent/ai-systems-hero-reactive-orb-authority-r1`, head `48126513de95161f83980a837f044430e021b91b`, read previously and confirmed against R1B record.
- Source donor: *Reactive Orb* by **Vlad Kolokolnikov**, Spline Community file `306ca2a5-d1ab-46ac-a27c-198575c82db0`, original observed CC BY 4.0. No claim of authorship of donor.
- Original published scene: `https://prod.spline.design/sH5GiugwHqy0gA4X/scene.splinecode`; untouched community/remix/local .spline.
- R1B head/report and four base files inspected; no project restart, no alternate object, no Codex.

## Verified material anatomy from live R1C browser
- Real official `@splinetool/runtime` loaded original scene in GitHub Actions.
- 769 original runtime objects, 250 original `Clones / Clone N / Group / Sphere` hierarchy entries.
- Material stack on original Sphere, not parent Instance: `Depth`, `Fresnel`, `Lighting`.
- **Depth** has four RGBA float-array color stops and separate `steps` array: original stops:
  1. `[0,0,0,1]`
  2. `[0.03811214,0.71277916,0.73604354,1]`
  3. `[0.69992582,0.95125395,0.15084591,1]`
  4. `[1,1,1,1]`
  Therefore the green/teal is intrinsic to Depth, **not Fresnel alone**.
- **Fresnel** exposes original teal RGBA `{r:.16341076,g:.93507267,b:.91192281,a:1}`; original intensity `4.12`, bias `-0.21`.
- **Lighting** Phong specular `{r:.2,g:.2,b:.2}`, shininess 5, layer alpha 0.6.
- Material readback is **not** a visual shader or rendering proof.

## Isolated implementation
- New owner preview `owner-preview/ai-systems-reactive-orb-material-r1c/index.html`, using same published donor and original Spline runtime: four modes `?view=original|adapted|compare|clean`.
- Runtime targets only exactly 250 native Clone spheres and refuses an incorrect 769/250 object topology.
- Experimental color palette: Obsidian `#10141B`, Graphite `#353E49`, Smoked Gunmetal `#566270`, Pearl Silver `#D5DDE6`.
- 4-stop native Depth gradient transformed using normalized RGBA arrays (preserve source `steps`), Fresnel to cold silver CSS color, Lighting Phong neutral specular floats. Changes exist **only in browser memory after loading the published original scene**. No editor save and no material shader replacement.
- No new geometry, no clone movement, no new layers, no CSS filter, no new scene, no effects overlays, no custom Three.js sphere, no Clearance tiles.
- Branch-only QA `scripts/qa-reactive-orb-material-r1c.mjs` + `.github/workflows/reactive-orb-r1c-material.yml` tests original layer anatomy and actual browser canvas screenshot / color metrics. Headless Playwright screenshot had stability timeout, then direct CDP Page.captureScreenshot added.
- Existing isolated Vercel project reused: `prj_MAFhuABtiQ7sYAesNzmsKjXTT8py`; no new Vercel project created. The R1C deployment target is unassigned (`target:null`), Vercel reports READY; live public HTTP/browser usability outside Vercel not independently established here.

## Current acceptance gates
- Loading actual donor through official runtime: **PASS**.
- Original named Clone hierarchy 250: **PASS**.
- Geometry generated/changed by authored R1C code: **NO**. Visual parity with original: **UNVERIFIED**.
- Depth API surface and RGBA schema: **PASS for inspection**; visible effect **HOLD**.
- Fresnel API access/write: **PASS from R1B**; visible effect **HOLD**.
- Lighting Phong access: **PASS for inspection**, visible effect **HOLD**.
- Green/teal removed: **NOT PROVEN**.
- REST/Pointer/Return visual acceptance: **UNVERIFIED**.
- Desktop / mobile device QA: **UNVERIFIED**.
- Source original untouched: **YES**.
- Production/site/AI Systems/Cube untouched; main untouched; merge: **NO**.

### Narrow blocker and next decision
The material properties are readable and writable in the public runtime's exposed object view, but identical-timestamp rendered frame proof of the GPU effect is necessary. Do not promote this branch based on setter/readback. If screenshot tests continue to fail in headless WebGPU, route to **interactive browser visual inspection of the two original-scene canvases** (not local source manipulation). If live properties do not update shaders, use a separate Spline Editor material adaptation copy and published Spline export only after specific evidence of this limitation.

No lighting redesign, advanced motion or signature/forensics authorized.
