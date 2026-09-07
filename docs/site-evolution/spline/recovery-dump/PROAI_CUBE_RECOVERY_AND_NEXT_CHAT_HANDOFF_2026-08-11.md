# PROAI CUBE RECOVERY + NEXT CHAT HANDOFF — 2026-08-11

**Project:** ProAI Expert Hero 3D system  
**Repository:** `proaiexpert/proaiexpert.github.io`  
**Working branch:** `agent/spline-recovery-dump-r1`  
**Status:** recovery/source-of-truth consolidation only; **NO production merge/deploy**.

---

## 1. Executive decision

The Spline watermark problem is no longer a blocker.

We successfully exported the Rubik-like object from Spline as a clean, free **GLB** with no Spline web watermark and no paywall. The correct forward architecture is therefore:

**clean GLB geometry + recovered Spline metadata as reference → independent Three.js renderer/mechanics → premium ProAI visual system → later Hero integration.**

Do **not** use `@splinetool/runtime` in the intended production path. Do **not** spend time trying to reverse-engineer the whole Spline binary unless a very specific missing parameter is needed.

---

## 2. Why this handoff exists

Two separate Codex chats worked on the Spline/Rubik investigation and had separate conversational context. To avoid losing local-only files and to reduce further Codex usage, both chats dumped their local artifacts to GitHub.

### Recovery dumps

**Chat 1**
- branch commit: `63f236d7d671f4f8cc0d9aa0f45b69a06f28ac62`
- path: `docs/site-evolution/spline/recovery-dump/chat-1/`
- Codex reported 83 files saved
- its payload manifest itself lists 81 archived entries; the difference is consistent with wrapper/manifest files and is not important for recovery

**Chat 2**
- branch commit: `e7baee789fddbf001cd50380c65fcf0f3c5ac5a7`
- path: `docs/site-evolution/spline/recovery-dump/chat-2/`
- Codex reported 63 files added

Nothing in these dump folders should be treated as production code. They intentionally preserve duplicates, diagnostics, experiments and intermediate reverse-engineering output.

---

## 3. Canonical sources now available

### A. Clean GLB — primary geometry source

Representative archived copy:

`docs/site-evolution/spline/recovery-dump/chat-1/desktop_PROAI_SPLINE_EXPORT_TEST/rubik_39_s_cube_animation.glb`

Verified inspection:
- file size: **279,412 bytes**
- valid GLB header: **YES**
- glTF version: **2**
- scenes: **1**
- nodes: **249**
- meshes: **22**
- materials: **0**
- textures: **0**
- images: **0**
- animations: **0**
- named hierarchy includes: `right`, `center`, `left`
- named objects include: `verde`, `giallo`, `bianco`, `blu`, `arancio`, `rosso`, `Cube`
- no `spline`, `watermark`, or `logo` string was found in the GLB JSON inspection

The absence of materials/textures is expected because the free export used **Default Color (Grey)**.

**Important:** the GLB contains **zero animation clips**. Spline motion/events/states must therefore be reconstructed in code; do not claim the GLB contains original animation keyframes.

### B. Original / runtime Spline binary — secondary recovery source

Important archived 49,789-byte scene copy:

`docs/site-evolution/spline/recovery-dump/chat-2/desktop_PROAI_SPLINE_PREMIUM_R1_out/scene.splinecode`

Known SHA-256 from manifest:

`90F669182F8E98EAE1A619477C7019E373308473E514FD420D8F0F47AFE2826D`

Canonical remote scene previously used by the R1 runtime prototype:

`https://prod.spline.design/Ps48UZeUPJBLxiy2/scene.splinecode`

There is also a second downloaded `scene.splinecode` variant of **32,439 bytes**, with SHA-256:

`0FF01F004EBEA2C73CD9EF654D5E369FB1C0A90D8AC35640C132B9F270C33049`

Its exact provenance/version relationship has **not** yet been resolved. Preserve both; do not delete either until compared.

### C. Reverse-engineering outputs

High-value files include:
- `scene_full.json`
- `scene_hierarchy.json`
- `scene_resolved.json`
- `extracted/scene.json`
- `header_hex.txt`
- `extract.py`
- `extract_objects.py`
- `parse_scene.py`
- `resolve_refs.py`
- `unpack_full.py`
- `probe-report.json`
- `logo-bevel-diagnostics/*`
- `glb-inspection.json`
- `inspect-glb.mjs`

These are evidence/recovery aids, not canonical implementation.

---

## 4. What was verified in Spline Runtime before the pivot

The earlier isolated R1 runtime prototype proved:

- scene load: PASS
- original Rubik animation: PASS
- drag/orbit/zoom: PASS
- runtime objects: **26**
- face meshes: **18**
- internal `Cube` meshes: **3**
- main groups: `right`, `center`, `left`
- each group contains six named face meshes plus one internal `Cube`
- material layers are programmatically writable
- runtime conversion from Phong-like light layer to Physical values worked
- Plane and Directional Light were controllable

Useful UUIDs from the prior runtime work:
- Directional Light: `1ccd27ee-5f74-4b6d-94ba-f98954b9f14e`
- Plane: `ea2cdf15-c2fb-45c3-9bd8-04d836d4d700`
- `right`: `d0f2f312-20b7-4585-bcde-95e9276568f8`
- `center`: `c4838e42-d896-4eaa-b171-057187ae939f`
- `left`: `8a6241de-bb76-457b-a4eb-b95729bf3fb9`

---

## 5. Useful recovered geometry data

The reverse-engineered JSON and runtime diagnostics expose geometry parameters that are valuable as reference.

### Face / plate geometry observed

Representative `RectangleGeometry`:
- width: `190`
- height: `190`
- depth: `0`
- cornerRadius: `[8, 8, 8, 8]`
- cornerType: `1`
- extrudeBevelSize: `0`
- extrudeBevelSegments: `1`

### Internal Cube geometry observed

Representative `CubeGeometry`:
- width: `200`
- height: `200`
- depth: `200`
- widthSegments: `1`
- heightSegments: `1`
- depthSegments: `1`
- cornerRadius: `8`
- cornerSegments: `8`

### Bevel diagnostic

A private/internal diagnostic successfully changed one representative face (`verde`) from:
- cornerRadius `8`
- extrudeBevelSize `0`
- extrudeBevelSegments `1`

to:
- cornerRadius `14`
- extrudeBevelSize `4`
- extrudeBevelSegments `3`

This proves the original object had explicit rounded/bevel geometry controls. These values are useful visual references for the Three.js recreation, but private Spline internals should **not** be part of the production architecture.

---

## 6. Recovered motion/state information — useful but not fully trustworthy

`scene_resolved.json` contains clear evidence of Spline state/event/transition structures. For the `right` group, recovered data includes references to:

- `Start`
- `Transition`
- target object UUID matching the `right` group
- `State`
- repeat/delay/direction fields
- a transition record with `duration: 8000`
- `easing: 5`
- Bezier/control values such as `control1` / `control2`
- pivot/pivotRotation references

It also exposes grid/cloner-related records and geometry/state references.

### Reliability warning

The current JSON reconstruction is **not semantically clean**. Some resolved values are visibly shifted into implausible fields, which means the parser/reference resolution was only partial.

Therefore:

- use the recovered JSON to discover relationships, IDs, candidate values and original behavior;
- cross-check important transforms/motion against GLB hierarchy, runtime diagnostics and visual video;
- do **not** copy every field literally into Three.js.

The goal is not to perfectly reconstruct Spline's undocumented file format. The goal is to recover only enough information to avoid guessing the important Rubik behavior.

---

## 7. R1 ProAI visual values worth preserving as references

The R1 `main.js` contains the exact material family used in the owner-review prototype.

### Face material variants

Variant 1:
- RGB `(0.265, 0.276, 0.300)`
- roughness `0.18`
- metalness `0.92`
- reflectivity `0.78`
- intensity `1.18`

Variant 2:
- RGB `(0.210, 0.222, 0.248)`
- roughness `0.23`
- metalness `0.88`
- reflectivity `0.68`
- intensity `1.08`

Variant 3:
- RGB `(0.175, 0.187, 0.215)`
- roughness `0.28`
- metalness `0.84`
- reflectivity `0.60`
- intensity `1.00`

Variant 4:
- RGB `(0.300, 0.310, 0.335)`
- roughness `0.20`
- metalness `0.90`
- reflectivity `0.72`
- intensity `1.12`

### Internal core material

- RGB `(0.052, 0.056, 0.066)`
- roughness `0.54`
- metalness `0.38`
- reflectivity `0.22`
- intensity `0.72`

### R1 lighting/environment

Directional Light:
- color `#FAFBFC`
- intensity `6.4`
- position `[-620, 1880, -900]`
- runtime rotation approximately `[-0.96, -1.24, -1.18]`

Environment:
- background `#080A0D`
- Plane hidden

These are **reference values**, not locked final art direction. The owner review said R1 still needed better framing, softer premium edges, improved material balance and slower/heavier motion.

---

## 8. Watermark conclusion

Previous diagnostics established that the Spline logo was not a normal DOM element or a normal scene object returned by `app.getAllObjects()`. The published Spline scene/runtime contained watermark branding behavior and `logo = true` publish settings.

This is no longer worth pursuing.

The free GLB export contains no Spline watermark/logo and allows us to remove Spline Runtime from the production architecture entirely.

**Do not spend more time trying to patch or bypass the Spline watermark.**

---

## 9. Current visual direction — keep stable

The target is a bespoke premium digital/AI studio Hero, visually closer to a restrained Resend-class 3D object than to neon/gaming sci-fi.

### Core visual object

A segmented, physically credible Rubik-like ProAI cube/system:
- graphite / gunmetal / smoked-black material family
- subtle silver/pearl reflections
- visible mechanical segmentation
- subtle premium bevel/softened edges, not cartoon rounding
- black or transparent seamless environment
- no pedestal
- no giant HUD plates
- no reactor/cyan-frame look
- no neon clutter
- no procedural scaffold/open-frame object

### Composition

On desktop Hero, the 3D visual should occupy a near-square or slightly vertical right-side zone, with the cube visually dominant and only modest breathing room. Avoid the previous tiny cube floating in a huge horizontal empty scene.

### Motion

Target motion:
- slower, heavier, intentional
- real Rubik-like slice turns
- smooth easing
- clean settle between states
- no jerky fast-spin/freeze rhythm
- orbit/drag can remain as secondary inspection behavior
- autonomous narrative sequence is primary

---

## 10. Planned five-state narrative — later stage, not R0

Final autonomous sequence concept:

1. `AI EXPERT` / ProAI Expert brand state
2. `ДОВЕРИЕ` / `TRUST`
3. `ОБРАЩЕНИЕ` / `INQUIRY`
4. `ОТВЕТ` / `RESPONSE`
5. `РЕЗУЛЬТАТ` / `RESULT`
6. return to AI Expert

Between states: one or more controlled Rubik-like slice turns, then settle at a slightly varied 3/4 presentation angle.

A later display-state concept can use a thin smoked-glass/display skin over the active face so one large stage word reads clearly while mechanical seams are visually suppressed. Do **not** build this until the base Three.js cube/motion is proven.

---

## 11. Locked Hero copy — do not reopen

### RU

Eyebrow:  
`AI-СИСТЕМЫ · АВТОМАТИЗАЦИЯ · ПРЕМИАЛЬНЫЕ САЙТЫ`

H1:  
`От первого впечатления до результата — одна система.`

Support:  
`Создаём премиальные сайты для компаний сферы услуг и соединяем их с AI и автоматизацией. Клиенту проще понять ваши услуги и обратиться с нужной информацией, вам — быстрее ответить и меньше заниматься рутиной. Ключевые решения — за вами.`

Primary CTA: `Запросить разбор`  
Microcopy: `Коротко опишите задачу. Мы предложим, с чего разумнее начать.`  
Secondary CTA: `Смотреть проекты`  
Accountability: `Штат Вашингтон · Работаем по всей США · EN / RU / UA`  
Stages: `ДОВЕРИЕ → ОБРАЩЕНИЕ → ОТВЕТ → РЕЗУЛЬТАТ`

### EN

Eyebrow:  
`AI SYSTEMS · AUTOMATION · PREMIUM WEBSITES`

H1:  
`From first impression to result — one system.`

Support:  
`We build premium websites for service businesses and connect them with AI and automation. Customers understand your services and reach out with the right information; you respond faster and spend less time on routine work. Key decisions stay with you.`

Primary CTA: `Request a Review`  
Microcopy: `Briefly describe the challenge. We’ll recommend where to start.`  
Secondary CTA: `View Work`  
Accountability: `Washington-based · Working across the U.S. · EN / RU / UA`  
Stages: `TRUST → INQUIRY → RESPONSE → RESULT`

Do not restore older FOLLOW-THROUGH / Private / superseded wording.

---

## 12. Rejected / dead-end directions — do not repeat

Do not return to:
- procedural raymarch/SDF R2/R3 core refinement;
- scaffold/open-frame core;
- bulky square tunnel/frame with cyan center;
- generic sci-fi reactor/HUD composition;
- tiny object in oversized horizontal scene;
- trying to make the free Spline web runtime the final production dependency;
- assuming DeepSeek's sample HTML is a finished reconstruction.

Important technical warning about the sample HTML previously proposed elsewhere: traversing the GLB and doing `cubeGroup.add(child)` on every mesh reparents meshes away from their original hierarchy. That can empty/break the `right/center/left` groups that are later expected to rotate. The future Three.js implementation must preserve or intentionally rebuild hierarchy and pivots rather than destructively flattening it.

---

## 13. Confidence table

| Area | Current status | Confidence | Source / note |
|---|---|---:|---|
| Clean geometry without watermark | Solved | High | Free GLB export |
| GLB validity | Solved | High | glTF 2.0, valid header |
| Named `right/center/left` hierarchy present | Solved | High | GLB inspection |
| Named face/core objects present | Solved | High | GLB inspection |
| Original GLB materials | Not preserved | High | 0 materials/textures/images |
| Original Spline animation clips in GLB | Not preserved | High | animations = 0 |
| Original runtime Rubik motion existed | Verified | High | browser/runtime tests + video |
| Runtime orbit/drag/zoom existed | Verified | High | browser/runtime tests |
| Original geometry dimensions/radius | Partially recovered | Medium–High | resolved JSON + diagnostics |
| Original transition/state records | Partially recovered | Medium | resolved JSON |
| Exact motion semantics/easing/pivots | Partial | Medium–Low until cross-checked | parser resolution is imperfect |
| R1 graphite material values | Preserved exactly | High | archived `src/main.js` |
| Spline web watermark removed from future architecture | Solved by dependency removal | High | clean GLB + Three.js path |
| Final premium Three.js object | Not built yet | — | next implementation stage |
| Five-state Hero narrative | Designed, not built | — | later stage |
| Production Hero integration | Not started / must remain untouched | High | owner gate |

---

## 14. Recommended next workflow

### Phase 1 — data consolidation, done mostly in ChatGPT

Do this without spending Codex unless absolutely necessary:

1. Compare Chat 1 and Chat 2 dumps.
2. Identify duplicate vs unique files.
3. Compare the two `scene.splinecode` variants and determine likely provenance.
4. Extract only high-value motion/pivot/state information from `scene_resolved.json`, diagnostics and video.
5. Map GLB `right/center/left` and face/core nodes to the recovered Spline references.
6. Produce a compact implementation spec.

Do **not** attempt a complete Spline binary reverse-engineering.

### Phase 2 — isolated Three.js parity prototype

Only after Phase 1 is summarized:

- load the clean GLB with `GLTFLoader`;
- preserve original hierarchy or deliberately reconstruct it;
- no `@splinetool/runtime`;
- no `.splinecode` production dependency;
- no `prod.spline.design` network dependency;
- no Spline branding;
- reproduce orbit/drag/zoom with controlled damping;
- implement correct slice rotation using pivots/groups and exact ±90° mechanics;
- prove the mechanical cube before adding narrative text;
- initial review in a near-square/slightly vertical viewport.

### Phase 3 — premium art direction

After mechanics are stable:

- refined bevel/profile;
- graphite/gunmetal physical materials;
- premium studio lighting;
- black/transparent integration;
- larger framing;
- slower/heavier motion;
- desktop/mobile visual tuning.

### Phase 4 — five-state narrative

Only then add:

`AI EXPERT → TRUST/ДОВЕРИЕ → INQUIRY/ОБРАЩЕНИЕ → RESPONSE/ОТВЕТ → RESULT/РЕЗУЛЬТАТ → AI EXPERT`

Then add display-skin / stage typography if still visually justified.

### Phase 5 — Hero integration

Only after owner approval of the isolated 3D object:

- integrate with locked Hero DOM/copy;
- responsive desktop/mobile QA;
- performance/accessibility checks;
- still no production merge/deploy without explicit owner approval.

---

## 15. Codex budget rule

Codex usage should now be minimized.

Preferred division of work:
- **ChatGPT + GitHub:** research consolidation, architecture, code review, art-direction decisions, recovery-file analysis, handoff/spec creation.
- **Codex:** only when local browser/Windows execution, actual file generation, screenshot/video capture, or integration testing is genuinely needed.

Do not use Codex for large exploratory analyses that can be done from the GitHub archive.

---

## 16. Start-here instruction for the next chat

The next chat should begin by reading this document from:

`agent/spline-recovery-dump-r1`

`docs/site-evolution/spline/recovery-dump/PROAI_CUBE_RECOVERY_AND_NEXT_CHAT_HANDOFF_2026-08-11.md`

Then continue from **Phase 1** using the GitHub recovery data directly. Do not ask the owner to re-upload files or repeat the history. Do not call Codex first. Do not touch production.

---

## 17. Hard guardrails

- Production `/index.html` and `/ru/index.html`: untouched.
- No merge/deploy without owner approval.
- Do not reopen locked RU/EN copy.
- Do not restart the Hero concept from zero.
- Do not return to rejected procedural sci-fi core directions.
- Do not pay for Spline merely to remove the watermark; clean GLB export already solved that dependency.
- Preserve both Spline binary variants until provenance is resolved.
- Clean GLB is the preferred geometry source of truth.
- Recovered Spline JSON is a secondary behavioral/reference source, not blindly trusted canonical data.
