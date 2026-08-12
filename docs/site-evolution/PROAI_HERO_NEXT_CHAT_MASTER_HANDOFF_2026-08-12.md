# PROAI EXPERT HERO — NEXT CHAT MASTER HANDOFF — 2026-08-12

Repository: `proaiexpert/proaiexpert.github.io`

This document is the current control handoff for the ProAI Expert Homepage Hero workstream. It supersedes older active-direction statements that still describe the C-shape as selected. Historical documents remain useful for context, but any statement that conflicts with this handoff is stale.

## 0. OPERATING CONTRACT

- Active scope is **HERO ONLY**. Do not redesign the rest of the Homepage now.
- Do not touch production `/index.html` or `/ru/index.html` without explicit owner authorization.
- No merge, deploy, publication, rollback, destructive operation or force-push without explicit owner authorization.
- Technical/agent PASS does not equal owner visual approval. The owner must see the real result and approve it.
- Visual quality is the priority. Avoid wasting iterations on analysis that can be resolved from existing GitHub evidence.
- Builder/Codex is primarily for real implementation, local browser capture, video and QA. Do not spend scarce coding budget re-reverse-engineering already recovered Spline data.
- When delegating a technical task, provide one complete executable block: repo/ref, canonical sources, objective, scope, locked decisions, do-not-touch rules, outputs, QA gate and exact completion return.

## 1. CURRENT DESIGN DECISION

Primary Hero object: **Rubik-style ProAI Cube**.

The object is not a colorful toy Rubik cube. It is a restrained premium technology object with real slice mechanics, precision geometry, dark premium materials later, controlled cinematic motion, and future semantic display states.

Reference quality benchmark: `https://resend.com/`

Resend is a **quality/motion/material benchmark only**. Do not copy its proprietary implementation, exact object, light-strip language, scene composition or distinctive visual identity.

The ProAI result must be recognizably ours and ideally stronger/more original in the final Hero.

### Current visual direction

- dark, restrained, premium technology/luxury tone;
- serious, not gaming;
- no cyan/neon sci-fi HUD language;
- no reactor/tunnel/pedestal/particle clutter;
- near-square or slightly vertical object field;
- cube should occupy roughly 75–85% of useful object area when isolated;
- strong 3/4 presentation angles;
- future final object family: graphite / gunmetal / black chrome / smoked graphite / controlled glass-like display layer;
- subtle reflection movement across bevels is important;
- background comes later and must support the object rather than compete with it.

## 2. DIRECTIONS THAT ARE CLOSED / PARKED

### C-shape direction — superseded

Earlier C-shape R2/R3 work and `AI_CURRENT_HANDOFF.md` are historical. The old statement that C-shape remains selected is no longer current.

The owner rejected the latest C-shape browser composition because it read as a cut-out Photoshop object placed on a dark page instead of one integrated spatial Hero scene.

Do not restart C-shape work unless the owner explicitly reopens it.

### Procedural WebGL/raymarch/SDF core — dead end

R2/R3 procedural sci-fi core experiments were engineering-strong but visually wrong. A later Codex pass produced a dark square/tunnel/cyan-center result and was rejected. Do not invent unrelated sci-fi objects.

### Monolith cube — parked fallback

Branch: `agent/proai-monolith-cube-r0`
Final verified commit: `f8044e5e5e1db0eeecb624ca59403302e54f5f25`
Path: `docs/site-evolution/spline/proai-monolith-cube-r0/`

It is technically valid but visually generic: essentially a premium grey monolithic cube without enough identity. It is frozen as fallback/reference only. Do not spend resources there now.

## 3. LOCKED HERO COPY — DO NOT REWRITE

### RU

Eyebrow:
`AI-СИСТЕМЫ · АВТОМАТИЗАЦИЯ · ПРЕМИАЛЬНЫЕ САЙТЫ`

H1:
`От первого впечатления до результата — одна система.`

Support:
`Создаём премиальные сайты для компаний сферы услуг и соединяем их с AI и автоматизацией. Клиенту проще понять ваши услуги и обратиться с нужной информацией, вам — быстрее ответить и меньше заниматься рутиной. Ключевые решения — за вами.`

Primary CTA:
`Запросить разбор`

Microcopy:
`Коротко опишите задачу. Мы предложим, с чего разумнее начать.`

Secondary CTA:
`Смотреть проекты`

Accountability:
`Штат Вашингтон · Работаем по всей США · EN / RU / UA`

Stages:
`ДОВЕРИЕ → ОБРАЩЕНИЕ → ОТВЕТ → РЕЗУЛЬТАТ`

### EN

Eyebrow:
`AI SYSTEMS · AUTOMATION · PREMIUM WEBSITES`

H1:
`From first impression to result — one system.`

Support:
`We build premium websites for service businesses and connect them with AI and automation. Customers understand your services and reach out with the right information; you respond faster and spend less time on routine work. Key decisions stay with you.`

Primary CTA:
`Request a Review`

Microcopy:
`Briefly describe the challenge. We’ll recommend where to start.`

Secondary CTA:
`View Work`

Accountability:
`Washington-based · Working across the U.S. · EN / RU / UA`

Stages:
`TRUST → INQUIRY → RESPONSE → RESULT`

Do not restore old `FOLLOW-THROUGH`, `OUTCOME`, `Private Review`, `No pressure`, etc.

## 4. REAL HEADER SYSTEM — REUSE, DO NOT REDRAW

Source of truth:

- `_includes/header-system/header.html`
- `_data/header.yml`
- `_data/navigation.yml`
- `assets/css/header-system-v1.css`
- `docs/HEADER_SYSTEM_SPEC.md`

When Hero is eventually integrated, reuse the real shared Header System. Do not redraw logo/header from screenshots.

## 5. HOMEPAGE-WIDE WORK — PRESERVED FOR LATER, NOT ACTIVE NOW

A previous 45-site premium Hero benchmark was completed and should not be restarted from zero. Historical seed references included Work & Co, Clay, Code and Theory, Instrument, BASIC/DEPT, Linear, Scale AI, K2 Cloud, Nimax, ONY and AGIMA.

The current active scope is Hero only.

After the Hero is owner-approved and production integration is explicitly authorized, the later Homepage-wide phase should run a full-page premium benchmark synthesis before blindly polishing the existing page.

The provisional historical Homepage sequence is preserved only as a future working hypothesis, not a lock:

1. Hero
2. Connected Business Journey
3. Two Core Directions
4. Financial Stream proof
5. Ways to Start
6. Controlled Delivery
7. Founder accountability
8. Selected Work
9. Insights
10. Final Review CTA

Future full-page audit must classify each current block as `KEEP / REFINE / MERGE / MOVE / REPLACE / REMOVE`.

Do not act on this now. Do not touch sections below Hero until the owner explicitly changes scope.

## 6. ORIGINAL SPLINE SOURCE / LEGAL-CLEAN ARCHITECTURE

Original/public editable CC0 Rubik-like community base:
`https://community.spline.design/file/285d0202-c418-45e7-be1e-43b2338acb14`

Owner remix:
`https://app.spline.design/file/ce46e80c-54d5-4440-b044-df95208a1a90`

Canonical public scene reference:
`https://prod.spline.design/Ps48UZeUPJBLxiy2/scene.splinecode`

Earlier scene reference also archived:
`https://prod.spline.design/DlnNMurvV4Ugn-k6/scene.splinecode`

Important architecture decision:

**Do not use Spline runtime in production.**

Reason:
- free Spline web export contains branding/watermark;
- watermark is renderer/runtime branding, not a normal removable DOM/object layer;
- do not attempt any private hack or watermark bypass;
- owner does not want to pay for watermark removal;
- clean free GLB geometry export was verified.

Final clean architecture:

`Spline community geometry source → clean GLB → Three.js renderer/mechanics/materials/motion`

No `@splinetool/runtime` and no `.splinecode` runtime dependency in production.

## 7. CLEAN GLB — VERIFIED SOURCE ASSET

Clean free GLB export was verified:

- file: `rubik_39_s_cube_animation.glb`
- size: `279,412 bytes`
- SHA256: `DBB7FC4156F8C9ED2481DD76443DFFB9A45ECB5493463F99BFFB34DD3B59C79B`
- valid glTF v2;
- nodes: 249;
- meshes: 22;
- no Spline watermark strings/assets;
- no materials/textures/images in the free Default Grey export;
- no animations;
- useful hierarchy names retained including `right`, `center`, `left`, face-color names and `Cube`.

The GLB is geometry/hierarchy source only. Three.js owns the final materials, lights, motion and interaction.

## 8. SPLINE RECOVERY / REVERSE ENGINEERING — DO NOT REDO

Master recovery branch:
`agent/spline-recovery-dump-r1`

Master handoff commit:
`a2269a4948b661108d82a3953d5cc337ccce17ec`

Master recovery document:
`docs/site-evolution/spline/recovery-dump/PROAI_CUBE_RECOVERY_AND_NEXT_CHAT_HANDOFF_2026-08-11.md`

Read this only if deeper geometry/hierarchy/history is needed. Do not spend new Codex budget rediscovering the same internals.

Useful recovered facts:

- scene groups: `right`, `center`, `left`;
- each contains colored face overlay meshes plus internal `Cube` geometry;
- original face geometry roughly Rectangle 190×190, corner radius 8;
- original core geometry roughly Cube 200×200×200, corner radius 8, cornerSegments 8;
- private diagnostic proved stronger bevel/radius variants are possible, but private Spline internals are not for production;
- old parser output is secondary evidence only; some resolved fields were imperfect/mismatched;
- do not use recovered parser output as transform truth when current GLB/Three.js mechanics already prove the correct behavior.

Recovery dumps:

- `docs/site-evolution/spline/recovery-dump/chat-1/`
- `docs/site-evolution/spline/recovery-dump/chat-2/`

## 9. THREE.JS MECHANICAL FOUNDATION — LOCKED

Mechanical Parity R0:

Branch:
`agent/proai-cube-threejs-mechanical-r0`

Original stable task commit:
`32cf6e497b3c4402169ab8b677d3372cca439da3`

Path:
`docs/site-evolution/spline/proai-cube-threejs-mechanical-r0/`

R0 proved:

- clean GLB loads in Three.js;
- Spline dependency NONE;
- real Rubik hierarchy/mechanics;
- exact 90° slice movement;
- OrbitControls;
- repeatability without drift.

Critical GLB oddity:
- one X-layer can expose 10 exported parent objects for 9 physical cubies;
- this was solved with spatial deduplication;
- preserve that approach.

Critical implementation rule:
- do not traverse leaf meshes and reparent them out of `right/center/left`;
- do not reuse the flawed old sample that did `cubeGroup.add(child)` and then tried to rotate emptied groups;
- use logical/spatial cubie identity;
- slice turns use temporary pivot/group while preserving world transforms;
- final logical coordinates/orientations snap exactly;
- endpoints remain exact ±90°.

## 10. MOTION R1 — COMPLETED TECHNICALLY

Branch:
`agent/proai-cube-motion-r1`

Commit:
`023e0aa9d20292a13c04d9061f98f49a6c380e05`

Path:
`docs/site-evolution/spline/proai-cube-motion-r1/`

Implemented:

- generalized X/Y/Z slice engine;
- layers −1 / 0 / +1;
- no constant visible `turn → reset → turn → reset` behavior;
- cube preserves new logical state between moves;
- occasional two-turn phrases;
- slow micro body drift;
- OrbitControls with pause/resume behavior;
- 30 mixed-turn repeatability PASS;
- exact inverse restoration PASS;
- Spline dependency NONE.

Measured R1 motion tuning:

- turns: `1210–1490 ms`;
- holds: `520–2600 ms`;
- easing: `cubic-bezier(0.36, 0, 0.12, 1)`;
- micro drift yaw: `±3.8° / 12.8s`;
- pitch: `±2.15° / 15.2s`;
- roll: `±0.65° / 10.6s`;
- Orbit damping: `0.074`;
- manual resume delay: `1850 ms`;
- soft resume blend: `2400 ms`.

Owner visual note:
- movement became much better;
- slice movement still feels somewhat too mathematically even/static compared with the quality benchmark;
- do not destabilize mechanics casually;
- material reflections may improve the perceived motion later;
- if needed after materials/light, run a narrow motion micro-pass rather than rewriting the engine.

## 11. GEOMETRY R1 — CURRENT VERIFIED STABLE BASELINE

Branch:
`agent/proai-cube-geometry-r1`

Latest verified commit including iPhone MP4 review:
`73082717909b6f4225841401fe4962d6ff4bbcca`

Path:
`docs/site-evolution/spline/proai-cube-geometry-r1/`

Geometry choices:

- face outer: `196.8`;
- corner radius: `10.6`;
- recessed thickness: `3.6`;
- bevel size: `2.35`;
- bevel thickness: `1.25`;
- bevel segments: `4`;
- core: `198`;
- core radius: `9.2`;
- core segments: `5`;
- face gaps observed: `3.7–8.2`;
- core seams observed: `2.5–7.0`;
- extra face thickness goes inward;
- outward protrusion: `0`.

Technical acceptance:

- Geometry quality PASS;
- Motion R1 preserved PASS;
- X/Y/Z PASS;
- 30 mixed turns PASS;
- max position drift `6.96e-14`;
- quaternion drift `0`;
- scale drift `0`;
- inverse restoration PASS;
- Orbit/autonomous PASS;
- Spline dependency NONE;
- no observed intersections/holes;
- bevel catches highlights;
- seams are denser/darker;
- no cartoon rounding.

Owner visual impression:
- cube looks better and more interesting than before;
- geometry is acceptable as working baseline;
- do not reopen Geometry unless a later material/light pass reveals a concrete defect.

Owner-review MP4:
`https://raw.githubusercontent.com/proaiexpert/proaiexpert.github.io/agent/proai-cube-geometry-r1/docs/site-evolution/spline/proai-cube-geometry-r1/review/proai-cube-geometry-r1-review-14s.mp4`

## 12. REVIEW VIDEO FORMAT — PERMANENT RULE

The owner reviews on iPhone and WebM is unreliable in the GitHub/iPhone flow.

Every future visual/motion pass must provide the primary review video as:

- MP4;
- H.264;
- yuv420p;
- 24 or 30 fps;
- preferably 1080p;
- direct GitHub/raw link that opens on iPhone.

WebM may be provided as an additional technical artifact, but never as the only owner-review video.

## 13. CURRENT NEXT MOTION REFINEMENT — ALREADY ASSIGNED TO BUILDER

A narrow task has already been issued after Geometry R1:

**Presentation Motion R1.1**

Goal:
- add large autonomous rotation of the entire cube, because current video mostly shows slice turns while the whole cube stays near one 3/4 angle with only tiny drift;
- support expressive large inspection arcs and occasional full 360° whole-cube turns;
- do not make constant screensaver spin;
- combine whole-cube presentation movement with slice choreography;
- preserve Geometry R1 and exact slice mechanics.

Important intended interaction behavior:

- simple hover does nothing;
- manual Orbit drag pauses autonomous whole-cube presentation;
- if a slice turn is already active when drag starts, it should finish cleanly to its exact ±90° endpoint rather than freeze halfway;
- no new autonomous slice should begin while manual interaction is active;
- horizontal manual orbit can go around the object fully;
- vertical orbit stays reasonably constrained;
- after release, keep the user's chosen camera/orbit angle;
- do not snap back to a canned angle;
- calm delay roughly 1.5–2.0 s;
- then autonomous presentation resumes softly with roughly 2–3 s blend.

Autonomous whole-cube presentation should include:

- large yaw-based arcs around roughly 120–180°, 180–270°;
- occasional full 360° inspection turn;
- subtle pitch/roll modulation;
- slow acceleration and controlled inertia;
- no bounce, no cartoon overshoot, no jerk, no snap;
- occasional slice movement during or near the end of a large body turn, but not constant simultaneous activity.

The owner will send the new chat the builder's latest completion response immediately after this handoff. Treat that next message as the delta/newest builder result. Verify its branch, commit, evidence and MP4 in GitHub before declaring it the new stable baseline.

Do not assume Presentation Motion R1.1 is complete until that next builder response is received and verified.

## 14. REQUIRED PHASE ORDER AFTER PRESENTATION MOTION REVIEW

Current intended sequence:

1. `Presentation Motion R1.1` — whole-cube large motion / occasional 360° / interaction refinement.
2. `Materials + Lighting`.
3. `Semantic Display States`.
4. `Background / Spatial Integration`.
5. `Hero Integration`.
6. Only after explicit Hero approval: production integration.
7. Homepage-wide work remains later and out of scope until owner explicitly opens it.

Do not skip straight to Hero integration.

## 15. MATERIALS + LIGHTING — NEXT MAJOR ART PASS

After Presentation Motion owner review, the next major art pass should make the object feel materially expensive.

Direction:

- graphite;
- gunmetal;
- black chrome;
- smoked graphite;
- very subtle tonal variation across surface groups;
- no colorful Rubik stickers;
- not one flat uniform grey;
- controlled physical reflections;
- large soft key reflection;
- restrained rim;
- soft fill so dark faces do not disappear;
- reflections should travel across the bevels during motion;
- environment should read as premium studio, not generic grey render.

Potential material implementation may use Three.js PBR/physical materials, environment reflections and controlled lighting, but preserve performance and mobile quality.

Do not add semantic text during the same pass unless explicitly requested. Keep art passes narrow enough to diagnose regressions.

## 16. SEMANTIC DISPLAY STATES — MAIN DIFFERENTIATOR

After cube motion/material quality is strong, implement the ProAI semantic concept.

Primary states:

RU:
- `AI EXPERT`
- `ДОВЕРИЕ`
- `ОБРАЩЕНИЕ`
- `ОТВЕТ`
- `РЕЗУЛЬТАТ`

EN equivalents later under copy lock:
- `AI EXPERT`
- `TRUST`
- `INQUIRY`
- `RESPONSE`
- `RESULT`

Concept:

- during mechanical movement, normal 3×3 Rubik segmentation is clearly visible;
- after settle, an active face can temporarily read as a unified premium display surface;
- one strong word appears across that face, not letters distributed tile-by-tile;
- a thin smoked-glass/display layer may sit slightly in front of the face to visually suppress seams while the semantic state is active;
- then display state fades, segmentation returns and the next mechanical phrase begins.

This semantic transformation is the strongest planned differentiation from Resend and should not be attempted before the object itself looks premium.

## 17. BACKGROUND / SPATIAL INTEGRATION — LATER

Only after cube + semantic states are strong.

Direction:

- one coherent dark spatial Hero scene;
- very subtle volumetric halo;
- large soft out-of-focus reflection planes or depth cues if useful;
- restrained spatial richness;
- no obvious white Resend light-strip copy;
- no cyan neon frame;
- no HUD;
- no particles unless later evidence proves they improve the composition.

The goal is not an object pasted on a page background. The final cube must physically belong to the Hero scene.

## 18. HERO INTEGRATION — LOCKED SCOPE RULE

When isolated object is approved:

- integrate only into Hero;
- preserve locked RU/EN copy exactly;
- reuse real Header System;
- responsive desktop/mobile framing;
- preserve English root and Russian `/ru/` architecture;
- preserve canonical/hreflang/x-default/sitemap/internal links;
- no invented metrics/outcomes;
- no changes below Hero unless owner explicitly opens Homepage scope.

Production remains untouched until the owner explicitly says to integrate/publish.

## 19. VISUAL QUALITY STANDARD

Target feeling:

- bespoke premium technology/AI studio;
- serious, restrained, expensive;
- object feels physically present;
- engineered precision rather than toy;
- motion feels weighted and deliberate rather than mathematical demo;
- highlights/reflections should communicate material quality;
- interaction should feel natural and never fight the user;
- composition should not look like stock 3D or a generic product render.

Do not accept a result merely because QA is green. If it looks visually weak, call it visually weak and correct the specific layer causing it.

## 20. WHAT THE NEW CONTROL CHAT MUST DO FIRST

1. Read this handoff.
2. Treat `Geometry R1 @ 73082717909b6f4225841401fe4962d6ff4bbcca` as the latest verified stable baseline until newer evidence is supplied.
3. The owner will next paste the builder's latest Presentation Motion response from the neighboring chat.
4. Verify the claimed branch, exact SHA, prototype/evidence paths and MP4 in GitHub.
5. Give a concise owner-facing assessment: what is actually complete, what is visually/technically good, what remains weak, and whether it becomes the new baseline.
6. Do not launch another phase until the owner has reviewed the real MP4/screenshots or explicitly authorizes continuation.
7. Continue the sequence without losing the locks in this document.

## 21. CONTROL-BRANCH HANDOFF LOCATION

This handoff itself is intentionally stored on a separate control branch so it does not disturb the active Builder branch:

Branch:
`agent/proai-hero-control-handoff-2026-08-12`

File:
`docs/site-evolution/PROAI_HERO_NEXT_CHAT_MASTER_HANDOFF_2026-08-12.md`

The branch was created from verified Geometry R1 commit `73082717909b6f4225841401fe4962d6ff4bbcca`.

Use this document as the cross-chat continuity source of truth for the current Hero direction.