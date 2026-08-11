# PROAI EXPERT HERO — LAYERED 2.5D STATIC R1 — SINGLE SOURCE OF TRUTH

Repository: `proaiexpert/proaiexpert.github.io`

Working branch: `agent/hero-layered-25d-static-r1`

Date context: 2026-08-10

Status at task creation: `READY FOR EXECUTION`

---

## 0. EXECUTION AUTHORITY

This file is the **only current execution authority** for the next Hero pass on this branch.

The previous raster-retouch V2 path is stopped and superseded for execution purposes.

Do **not** continue:

- `docs/site-evolution/PROAI_HERO_R46_CORRECTIVE_STATIC_V2_TASK_2026-08-10.md`
- the previous luminance/raster retouch method;
- any unfinished V2 workflow derived from that method.

Those files remain historical evidence only.

Read first:

- `docs/site-evolution/PROAI_HERO_OWNER_WORKFLOW_LOCK_2026-08-10.md`
- `docs/site-evolution/PROAI_HOMEPAGE_HERO_MASTER_RECOVERY_PACK_2026-08-10.md`
- `docs/site-evolution/PROAI_HOMEPAGE_HERO_ASSET_INDEX_2026-08-10.md`
- `docs/site-evolution/PROAI_EXPERT_HERO_RECOVERY_LOCK_2026-08-09.md`
- `docs/site-evolution/PROAI_HERO_R46_CORRECTIVE_STATIC_V1_STATUS.md`
- `tools/hero_r46_corrective_static_v1.py` **only as a failure/reference implementation, not as a method to continue**.

The owner is NEVER a context/file transport layer. Recover every required source yourself from GitHub / GitHub Actions / already indexed Drive references. Do not ask the owner to upload, attach, download, move, resend, copy or relay anything manually.

---

## 1. WHY THIS PASS EXISTS

The previous V1 corrective candidate fixed several formal requirements, but it exposed a method-level ceiling.

V1 candidate:

`docs/site-evolution/review-artifacts/PROAI_HERO_R46_CORRECTIVE_STATIC_V1.png`

Candidate commit:

`4e5dff089b1cf2c12b5bf84dc47105fb21135ca2`

Candidate SHA-256:

`3a1dfcd9514c9e7e99c461bab4b2f2a3489041217bae4619d898ae54e6691637`

The V1 method rebuilt the right visual field from a flattened raster plate, used luminance/content alpha to composite dark material, then drew output traces as separate RGBA lines over the result.

That produced two unacceptable visual artifacts:

1. **MATERIAL EROSION** — dark graphite/steel planes locally looked rubbed out, weakened, dirty, old, semi-erased or poorly composited.
2. **LINE-ON-TOP EFFECT** — output signal read as a graphic line drawn over metal instead of a signal physically emerging from the internal chamber.

This pass changes the **implementation architecture**, not the Hero concept.

---

## 2. PRIMARY OBJECTIVE

Build one new owner-review static Hero candidate using a **depth-separated layered 2.5D scene** derived from the exact approved/recovered C-shape.

Target perceptual result:

> SAME APPROVED HERO + SAME C-SHAPE + CLEAN PREMIUM MATERIAL + TRUE FOREGROUND OCCLUSION + INTERNAL CYAN DEPTH + PHYSICALLY CREDIBLE OUTPUT FLOW + SOFT CINEMATIC LIGHT RESPONSE

The new candidate must look materially more expensive than both the recovery baseline and V1 **without changing the concept**.

This is not a new render direction, not a redesign, not a new benchmark, not a new C-shape.

---

## 3. CANONICAL VISUAL SOURCES

### Frozen recovered composition

Branch:

`agent/hero-recovery-approved-composition-owner-look`

Recovery handoff commit:

`3067fa02631de98d98d9b6bc8a1d0ea880ad5a41`

Underlying exact recovered visual checkpoint:

`8bab1bbddbaadf70d88fd72c77e08d2d0ac77429`

Recovered owner-review GitHub Actions artifact:

- workflow run: `31351101048`
- artifact: `PROAI_HERO_RECOVERY_OWNER_REVIEW`
- file: `R46_DESKTOP_STATIC.png`
- expected frame: `1440 × 900`

### Canonical geometry / static master references

Use the current asset index for exact immutable references and hashes:

`docs/site-evolution/PROAI_HOMEPAGE_HERO_ASSET_INDEX_2026-08-10.md`

Important distinction:

- preserve approved geometry, perspective and silhouette;
- do not regenerate the C-shape;
- do not approximate it with new procedural geometry because it is easier to animate.

### V1 as negative QA reference

Read V1 to understand what must **not** happen again:

`docs/site-evolution/review-artifacts/PROAI_HERO_R46_CORRECTIVE_STATIC_V1.png`

Do not treat V1 as the new visual master.

---

## 4. LOCKED HERO ELEMENTS — DO NOT CHANGE

The following are frozen for this pass:

- overall two-column Hero composition;
- canonical Header;
- left-side H1 hierarchy;
- left-side support copy;
- CTA system;
- general background architecture;
- approved C-shape concept;
- right-side placement logic;
- one-owner-candidate workflow;
- `04 RESULT`, not `04 OUTCOME`.

The complete left side and Header must remain pixel-locked against the exact recovered baseline in the final 1440 × 900 owner-review frame.

No copy strategy work.
No H1 redesign.
No CTA redesign.
No page architecture redesign.

---

## 5. CORE SCALE / COMPOSITION LOCK

The scale correction from V1 was directionally correct.

Use the recovered C-shape at approximately `95.5%` of the previous recovered right-side visual scale — approximately a `4.5%` linear reduction, within the already owner-requested 3–6% range.

Do not return to the larger recovered object.
Do not make it materially smaller than V1 unless a tiny registration correction is required to maintain the exact composition.

The reduction must be performed without luminance-key or content-alpha erosion of dark metal.

---

## 6. REQUIRED IMPLEMENTATION ARCHITECTURE

### 6.1 Build a registered layered scene, not a flattened retouch

Create a deterministic set of spatially registered layers from the approved source.

Minimum required scene layers:

1. `rear_atmosphere`
2. `rear_body_graphite`
3. `internal_chamber_depth`
4. `internal_cyan_volume`
5. `collector_emitter_zone`
6. `front_metal_shell`
7. `foreground_occlusion_mask`
8. `contact_shadow_floor_response`
9. `external_output_impulses`
10. `rail_ui`

All layers must share the same coordinate system and reproduce the approved source registration at neutral state.

Do not fake depth by simply duplicating the whole object multiple times with offsets.

### 6.2 Explicit masks — no luminance-key reconstruction of material

Dark graphite/steel must be isolated with deliberate masks / alpha assets / segmentation logic that preserves the intended silhouette and material mass.

Forbidden:

- global luminance-key extraction of the object;
- content-alpha derived primarily from brightness;
- any method where darker metal becomes more transparent because it is dark;
- broad inpainting that removes or weakens original metal surfaces.

If segmentation cannot preserve the object cleanly, refine the masks. Do not compensate with glow.

### 6.3 Depth map / surface-response support

Create and retain a deterministic depth representation for the right-side object.

Preferred architecture:

- explicit front / middle / rear depth layers;
- plus a grayscale depth map or local depth maps for surface response;
- derive a restrained normal-like surface-response map from depth gradients where useful.

The depth representation is not allowed to redesign geometry.

### 6.4 WebGL / Three.js role

Use a **layered WebGL/Three.js compositor in neutral static state** as the preferred foundation because this same scene will later support premium motion after owner approval.

WebGL is allowed to control:

- depth ordering;
- real occlusion between registered layers;
- soft emissive propagation;
- subtle material/specular response;
- floor/contact response;
- final neutral-state composition.

WebGL is **not** allowed to:

- rebuild the C-shape as new procedural geometry;
- change the silhouette;
- change the perspective;
- create a new R5-style object;
- use technology as a reason to redesign the approved visual.

A browser-based neutral compositor is preferred over another flattened PIL-only final because the approved static should become the foundation for a later controlled motion phase.

---

## 7. MATERIAL QUALITY — P0

The object must read as **clean, dense, premium graphite / dark steel**.

Required:

- strong but restrained material mass;
- clean uninterrupted dark planes;
- controlled roughness variation;
- subtle steel edge separation;
- cold-steel dominant highlights;
- slight tonal micro-variation;
- realistic edge continuity;
- no visual dirt unless it exists as ultra-fine premium microtexture.

The material must NOT read as:

- rubbed;
- scratched;
- old;
- weathered;
- smeared;
- semi-transparent;
- patch-painted;
- burned;
- dirty cyberpunk metal;
- over-sharpened raster texture.

Do not use aggressive unsharp masking as a substitute for real material separation.

The final owner-review frame must have **cleaner object integrity than the recovered baseline**, not merely higher contrast.

---

## 8. INTERNAL CHAMBER / CYAN VOLUME — P0

The cyan intelligence signal must live **inside spatial depth**.

Required visual hierarchy:

1. front graphite/steel shell;
2. visible recess / chamber boundary;
3. deeper cyan intelligence volume;
4. collector / convergence area;
5. emitter/output origin;
6. short external impulse to the rail.

Required cues:

- foreground occlusion;
- multiple depth planes;
- soft internal bloom at different depths;
- brighter core structures behind darker foreground edges;
- restrained atmospheric depth;
- cyan spill that reacts to nearby material;
- clear front/back relationship.

The internal cyan must not be just one flat glow painted over the object.

Do not solve lack of depth by increasing brightness.

---

## 9. OUTPUT FLOW — P0

This is the most important correction.

The signal must visually obey:

`INTERNAL CHAMBER → COLLECTOR → EMITTER → SHORT EXTERNAL IMPULSE → RAIL NODE`

### Absolute rule

No output line may visibly travel across a solid external metal face as if it were drawn on top of it.

The output must be hidden wherever the foreground metal shell is physically in front of it.

Use real scene/layer occlusion.

### Output character

Use short, restrained signal impulses/traces.

Do not use:

- long neon cables;
- decorative curls;
- giant buses;
- circuit-board overlays;
- laser beams crossing the object;
- thick glowing pipes;
- dashboard-like connectors.

The visible external section should be only as long as necessary to establish the relation to the rail.

---

## 10. RAIL — LOCKED SEMANTICS

Use exactly:

- `01 TRUST`
- `02 INQUIRY`
- `03 RESPONSE`
- `04 RESULT`

Use one calm four-row rail.

Target geometry in the 1440 × 900 static frame:

- approximately the V1 fixed 70 px vertical rhythm;
- exact row registration;
- fixed number column;
- fixed label column;
- each output terminates at its own row/node.

The rail is UI; it should remain crisp and quiet while the object is spatial.

Do not restore `OUTCOME`.

---

## 11. LIGHTING / COLOR / PREMIUM EFFECT CHARACTER

This pass should already establish the premium static lighting language, but without turning into an effects showcase.

### Dominant language

- graphite / near-black body;
- cold steel edge response;
- cyan internal intelligence;
- extremely restrained warm/champagne counter-reflection;
- soft dark atmosphere;
- controlled floor/contact response.

### Required softness

Effects must be soft, layered and physically motivated.

Prefer:

- wide low-opacity internal spill;
- soft specular roll-off;
- localized reflection;
- subtle falloff;
- gentle tonal transitions.

Avoid:

- hard halos;
- bloom outlines around the whole object;
- neon cyan wash;
- high-saturation edge glow;
- aggressive amber edge tracing;
- posterized contrast;
- gaming GPU-ad treatment;
- Tron / crypto / cyberpunk treatment.

### Champagne warmth

Warm light is a **secondary micro-accent**, never a second dominant color.

It should feel like a physically plausible environment reflection, not jewelry/gold styling.

---

## 12. SOBEL / CHROMATIC ABERRATION / SHARPENING — RESTRICTIONS

Do not use Sobel edge detection as the main rim-light system.

Reason: it detects raster contrast, not physical surface orientation, and can create a synthetic halo.

Do not use noticeable global chromatic aberration in this static R1.

If any aberration is used at all, it must be microscopic, local to glass/internal optical boundaries, and visually invisible at first glance.

Do not use sharpening as the main quality strategy.

Any final sharpening must be subtle and last-mile only.

---

## 13. CONTACT / FLOOR RESPONSE

The object must feel physically located in one cinematic scene rather than pasted on a website background.

Required:

- believable soft contact shadow;
- subtle floor/value response;
- restrained cyan reflection/spill;
- optional nearly subliminal warm reflection if physically justified;
- no obvious mirror image;
- no wet floor;
- no visible reflective platform;
- no heavy fog.

The grounding should be felt more than noticed.

---

## 14. STATIC-FIRST GATE — ABSOLUTE

This task produces **one static owner-review candidate only**.

No mouse interaction.
No parallax animation.
No pointer tilt.
No particle animation.
No moving light.
No chromatic animation.
No reflection lag.
No motion timeline.

The neutral scene must already look premium without movement.

If the static frame is weak, do not try to rescue it with motion.

---

## 15. FUTURE PHASE 2 — RESERVED, DO NOT EXECUTE NOW

The owner explicitly intends to add more premium visual richness **after static approval**.

Preserve the scene architecture so that a future approved Phase 2 can add, selectively:

- subtle pointer parallax by true depth layer;
- restrained object tilt;
- depth-dependent chamber movement;
- soft cyan light propagation;
- specular response that changes with viewpoint;
- slight reflection lag;
- localized microscopic chromatic dispersion on glass/internal optics;
- restrained procedural particles inside the chamber or beam path;
- richer color grading / cyan tone nuance;
- soft warm/cold reflection interplay;
- controlled atmosphere movement.

These are **future capabilities, not current deliverables**.

Do not implement them in this R1 static task.

Do not create alternate static versions to demonstrate future effects.

---

## 16. PREVIEW FOUNDATION

Create one isolated non-production preview foundation at:

`/hero-layered-25d-static-preview/`

Purpose:

- render the neutral layered scene in browser;
- preserve actual DOM/Header/copy behavior;
- keep the right visual as a layered neutral WebGL/Three.js compositor;
- serve as the future foundation for Phase 2 after owner approval.

Do not modify:

- `/index.html`
- `/ru/index.html`

Do not replace existing recovered preview routes.
Do not make this preview a second production source of truth.

The owner-review PNG remains the approval artifact.

---

## 17. REQUIRED FILE ORGANIZATION

Keep new scene-specific work isolated.

Recommended paths:

`assets/hero-layered-25d-r1/`

for registered raster/mask/depth assets.

`assets/js/hero-layered-25d-r1.js`

for the neutral layered scene.

`assets/css/hero-layered-25d-r1.css`

for isolated preview integration.

`hero-layered-25d-static-preview/index.html`

for the isolated preview.

Do not overwrite approved recovery assets.
Do not overwrite V1 evidence.

---

## 18. OWNER-REVIEW OUTPUT — EXACTLY ONE CANDIDATE

Save exactly one final owner-review static candidate:

`docs/site-evolution/review-artifacts/PROAI_HERO_LAYERED_25D_STATIC_R1.png`

Required dimensions:

`1440 × 900`

Save status at:

`docs/site-evolution/PROAI_HERO_LAYERED_25D_STATIC_R1_STATUS.md`

Status must remain:

`PENDING OWNER REVIEW`

until the owner explicitly approves it.

Do not save V1/V2/V3-style alternate candidates.
Do not present a contact sheet as an owner candidate.
Internal temporary renders are allowed only for QA and should not become competing sources of truth.

---

## 19. DETERMINISM / RECOVERABILITY

A fresh chat must be able to reproduce or recover the exact R1 candidate without the owner manually providing files.

Record in the status file:

- source branch/commit;
- recovery artifact run and exact file;
- exact source hashes where available;
- all generated registered layer paths;
- depth/mask generation method;
- renderer/compositor path;
- preview route;
- candidate commit SHA;
- candidate SHA-256;
- dimensions;
- QA summary.

If any required intermediate is generated, save it in GitHub unless it is prohibitively large; if large, persist a deterministic reconstruction method and immutable source reference.

---

## 20. QA — AUTOMATED AND VISUAL

Automated QA is necessary but cannot self-approve the visual.

### Required automated checks

1. Final PNG is exactly `1440 × 900`.
2. Header pixels match the frozen recovery baseline.
3. Left H1/copy/CTA region matches the frozen recovery baseline.
4. `04 RESULT` is present; `OUTCOME` is absent.
5. Four rail rows exist in correct order.
6. Each output terminates at the corresponding rail node.
7. Production `/index.html` and `/ru/index.html` are unchanged relative to branch base safety state.
8. Exactly one owner-review R1 PNG is produced.
9. No animation loop / pointer event / motion implementation is active in R1.

### Required visual QA

Inspect full-frame and 200–400% crops for:

- metal edge integrity;
- dark-plane continuity;
- alpha/mask erosion;
- fringing;
- inpainting artifacts;
- line crossing solid metal;
- cyan depth;
- collector origin credibility;
- object grounding;
- rail precision;
- overall premium restraint.

### Visual rejection conditions

Reject internally and correct before saving the owner candidate if any of the following are visible:

- rubbed/eroded metal;
- cyan trace visibly painted on a metal face;
- obvious halo around entire silhouette;
- glowing cartoon edges;
- object feels like a cut-out on a dark website;
- depth is created only by blur;
- cyan becomes a neon tube;
- warm highlight becomes gold styling;
- object silhouette or approved perspective changes;
- new geometry appears because WebGL was easier to build that way;
- static looks like a VFX/gaming poster rather than premium professional-services design.

---

## 21. SUCCESS STANDARD

Do not judge success by whether the renderer works.

Success means the owner-review frame visually reads as:

- cleaner than recovery;
- materially richer than V1;
- spatially deeper than V1;
- physically more believable than V1;
- more premium and expensive;
- restrained enough for a professional-services Homepage;
- unmistakably the same approved Hero concept.

The most important perception test:

> A viewer should no longer think “a line was drawn on top of a PNG” or “the metal looks rubbed out.”

Instead, the object should feel like one clean premium engineered C-form with an internal intelligence chamber that physically generates its output system.

---

## 22. SAFETY

Do not modify production `/index.html` or `/ru/index.html`.
Do not merge.
Do not deploy.
Do not open a production PR.
Do not touch Financial Stream.
Do not start motion.
Do not restart benchmark research.
Do not restart copy strategy.
Do not generate a new C-shape.
Do not ask the owner to transport files or context.

---

## 23. FINAL EXECUTION MODE

Execute autonomously from GitHub-backed sources.

Produce one R1 static candidate, save it and its status to GitHub, then stop for owner review.

Do not propose extra variants.
Do not continue into Phase 2 without explicit owner approval.
