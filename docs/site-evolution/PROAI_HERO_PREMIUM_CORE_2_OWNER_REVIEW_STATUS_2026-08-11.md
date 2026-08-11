# ProAI Expert Hero — Premium Core 2.0 — Owner Review Status

Date: 2026-08-11  
Status: **READY FOR OWNER REVIEW — NOT PRODUCTION AUTHORIZED**  
Scope: **HERO ONLY / ISOLATED PREVIEW ONLY**

Repository: `proaiexpert/proaiexpert.github.io`  
Source/research branch: `agent/hero-layered-25d-static-r1`  
Implementation branch: `agent/hero-premium-core-2-r1`  
Draft owner-review PR: `#117` — base is the research/archive branch only

## 1. Source of truth

Implementation follows:

- `docs/site-evolution/PROAI_HERO_NEXT_CHAT_PREMIUM_CORE_100K_BUILD_BRIEF_2026-08-11.md`
- `docs/site-evolution/PROAI_HERO_EN_COPY_LOCK_2026-08-11.md`
- `docs/site-evolution/PROAI_HERO_RU_COPY_LOCK_2026-08-11.md`

The rejected simple machined/closed box direction was not reused as the active art direction.

## 2. Copy lock execution — completed first

Final EN/RU Hero copy and CTA locks were applied before Premium Core visual development.

H1 remains one authored continuous string in both languages; no authored `<br>` or split slogan markup was introduced.

Locked stage chains remain:

- EN: `TRUST → INQUIRY → RESPONSE → RESULT`
- RU: `ДОВЕРИЕ → ОБРАЩЕНИЕ → ОТВЕТ → РЕЗУЛЬТАТ`

Primary CTA locks remain:

- EN: `Request a Review`
- RU: `Запросить разбор`

## 3. Active owner-review routes

- EN: `/hero-premium-core-2-preview/`
- RU: `/ru/hero-premium-core-2-preview/`

These routes are isolated candidates only. They are not production `/` or `/ru/`.

## 4. Active implementation

### DOM / layout ownership

- `hero-premium-core-2-preview/index.html`
- `ru/hero-premium-core-2-preview/index.html`
- `assets/css/hero-premium-core-2.css`
- `assets/css/hero-premium-core-2-r2.css`

DOM owns:

- header/navigation;
- eyebrow;
- H1/support copy;
- CTA/microcopy/accountability;
- accessible `01–04` stage typography;
- responsive/mobile composition.

### WebGL2 ownership

Active renderer:

- `assets/js/hero-premium-core-2-r2.js`

The active scene is procedural WebGL2 rather than the prior flattened Layered 2.5D PNG compositor.

It contains:

- asymmetric multi-mass sculptural Core geometry;
- open negative space rather than a closed product box;
- rear graphite spine, crown/upper shell mass, lower keel, detached output fin and floating collector/front masses;
- graphite / dark-steel material families;
- a restrained smoked aperture rather than a large rectangular screen;
- a contained internal intelligence volume with localized cyan rim/filament response;
- internal structural ribs/depth layers;
- transparent scene integration into one near-black Hero environment;
- non-concentric spline-derived signal trajectories;
- fragmented-to-resolved signal behavior;
- localized moving pulses and sparse data marks;
- Core/signal occlusion behavior;
- stage-driven orientation/state changes;
- pointer micro-parallax on fine-pointer devices;
- adaptive render scale / quality reduction under sustained slow frames;
- reduced-motion final-state behavior.

## 5. Abstract Signal Field

The rejected simple dotted ellipse/orbit treatment was not reused.

The active field uses:

- multiple non-concentric cubic trajectory families;
- broken-to-continuous line phases;
- localized pulses rather than uniform neon glow;
- depth/occlusion around the Core;
- restrained branching and sparse data marks;
- visual progression from fragmented input toward cleaner output/result states.

## 6. Motion / journey behavior

The normal Hero remains immediately readable; copy is not hidden behind an intro.

The active choreography supports:

1. `01 TRUST`
2. `02 INQUIRY`
3. `03 RESPONSE`
4. `04 RESULT`
5. continuing authored idle motion after resolution

Stage changes affect DOM emphasis plus Core orientation/signal state.

The four stages can also be activated by hover/focus/click/tap. The final QA independently verifies that the autonomous sequence resolves to stage index `3`, i.e. `04 RESULT`.

Reduced-motion mode keeps the scene available but parks it in the stable final/result state rather than replaying the full sequence.

## 7. Mobile recomposition

Mobile is not a desktop shrink.

The active mobile pass includes:

- 390-class composition;
- 320px/narrow composition;
- short-landscape compaction;
- compact `01–04` journey row integrated with the mobile visual field;
- smaller Core visual zone on 390-class widths so copy, CTA, accountability, all four stages and the Core remain visible in the first owner-review frame in both EN and RU;
- reduced rendering scale/quality budget on small devices;
- no horizontal document overflow in browser QA.

Manual review after the automated run specifically caught and corrected a 390px issue where stage labels could fall below the physical screenshot despite the WebGL area technically intersecting the viewport. The final 390-class captures now visibly include all `01–04` labels in both languages.

## 8. Loading / fallback behavior

The initial loading fallback was also reviewed against the rejection gate.

A box-like fallback was rejected and replaced with an open asymmetric fallback composition so the page does not briefly regress to the rejected closed-box silhouette before WebGL becomes ready.

## 9. Final automated/browser QA

Final tested implementation commit:

`b514e9ed74df63291614730c13c53dff5b5eae13`

GitHub Actions run:

`31481180408`

Result:

**SUCCESS**

Final artifact:

- name: `PROAI_HERO_PREMIUM_CORE_2_OWNER_REVIEW`
- artifact id: `9097364475`
- SHA-256 digest: `b375eea58a70c827a5f1141272a3208e6b06f01233d5add1a756cb71a5b6ee71`
- artifact size: `3,125,751` bytes
- retention: 14 days from the run

The final package contains:

- `CORE2_EN_DESKTOP_1440x900.png`
- `CORE2_RU_DESKTOP_1440x900.png`
- `CORE2_EN_MOBILE_390x844.png`
- `CORE2_RU_MOBILE_390x844.png`
- `CORE2_EN_MOBILE_320x780.png`
- `CORE2_EN_LANDSCAPE_844x390.png`
- `CORE2_EN_REDUCED_MOTION_390x844.png`
- `CORE2_EN_STAGE_01_TRUST.png`
- `CORE2_EN_STAGE_02_INQUIRY.png`
- `CORE2_EN_STAGE_03_RESPONSE.png`
- `CORE2_EN_STAGE_04_RESULT.png`
- `CORE2_EN_DESKTOP_MOTION.mp4`
- `diagnostics.json`

Automated gates passed for:

- production-route protection;
- exact EN/RU copy locks;
- no authored H1 hard split;
- Jekyll build;
- WebGL2 ready state;
- no fallback on tested Chromium captures after ready;
- no page/console errors in capture flow;
- no horizontal document overflow in tested viewports;
- desktop EN/RU captures;
- 390-class EN/RU captures;
- 320px narrow capture;
- 844×390 short-landscape capture;
- reduced-motion final-state behavior;
- autonomous narrative resolution to `04 RESULT`;
- four deterministic stage-state captures;
- desktop browser-native motion sample;
- active R2 implementation/static rejection guards.

## 10. Final diagnostics summary

Final browser diagnostics report:

- EN desktop 1440×900: WebGL2 ready, fallback false, visual viewport ratio `1.0`, no horizontal overflow;
- RU desktop 1440×900: WebGL2 ready, fallback false, visual viewport ratio `1.0`, no horizontal overflow;
- EN 390-class capture: visual viewport ratio `1.0`, all `01–04` visible in manual capture review;
- RU 390-class capture: visual viewport ratio `1.0`, all `01–04` visible in manual capture review;
- EN 320/narrow capture: visual viewport ratio `1.0`;
- EN short-landscape capture: visual viewport ratio `1.0`;
- autonomous final stage: `3` = `04 RESULT`.

## 11. Internal visual quality gate

The first Premium Core implementation was not accepted merely because technical QA passed. It was revised because it still read too much like rounded box components around a cyan insert and exposed a visible WebGL panel boundary.

Subsequent internal review also corrected:

- overly closed Core readings in some angles;
- 320px composition;
- short-landscape fit;
- box-like loading fallback;
- 390-class stage visibility;
- owner-review motion/stage evidence.

The active candidate now:

- avoids a closed rectangular Core silhouette;
- avoids simple dotted ellipse/orbit graphics;
- avoids four floating glass feature cards;
- avoids a visible rectangular WebGL panel boundary;
- keeps cyan localized as intelligence/signal light rather than broad neon treatment;
- integrates the Core, signal field and stage journey into one near-black environment;
- preserves an open sculptural silhouette across the stage states;
- is materially richer and more authored than the older cube/orbit Hero engineering DNA.

This is an **owner-review candidate** targeting the brief's bespoke premium digital / AI studio standard. The monetary `$100k+` class is an art-direction target, not an objectively measurable QA fact.

## 12. Production safety — confirmed

Comparison against `agent/hero-layered-25d-static-r1` confirms this implementation branch contains isolated Hero preview/assets/docs/workflow changes only.

- Production `/index.html` was not modified by this Premium Core 2.0 pass.
- Production `/ru/index.html` was not modified by this Premium Core 2.0 pass.
- No production merge was performed.
- No production deploy was performed.
- No production-target PR was opened.
- Draft PR `#117` targets `agent/hero-layered-25d-static-r1`, not `main`.
- Existing C-shape/recovery/history files were not deleted.
- Financial Stream was not touched.

Do not merge, retarget to production or deploy without explicit owner approval.

**READY FOR OWNER REVIEW — NOT PRODUCTION AUTHORIZED**
