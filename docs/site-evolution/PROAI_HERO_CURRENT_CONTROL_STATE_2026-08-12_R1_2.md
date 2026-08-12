# PROAI EXPERT HERO — CURRENT CONTROL STATE — PRESENTATION MOTION R1.2

Repository: `proaiexpert/proaiexpert.github.io`

Date: 2026-08-12

This document is the newest control-state delta for the ProAI Expert Hero workstream.

It preserves the earlier Master Handoff as historical context and supersedes only the parts of that handoff that described Presentation Motion R1.1 as still pending or as the current next pass.

Historical Master Handoff:
- Branch: `agent/proai-hero-control-handoff-2026-08-12`
- Original commit: `2444387e36cc6ff09b775175e2c3e65dd5da1a45`
- File: `docs/site-evolution/PROAI_HERO_NEXT_CHAT_MASTER_HANDOFF_2026-08-12.md`

If this current-state document conflicts with sections 13, 14, 20 or other R1.1-pending statements in the historical Master Handoff, THIS DOCUMENT WINS.

## 0. OPERATING CONTRACT — STILL LOCKED

- Active scope is HERO ONLY.
- Do not redesign Homepage sections below Hero.
- Do not touch production `/index.html` or `/ru/index.html` without explicit owner authorization.
- No merge, deploy, publish, rollback, destructive cleanup or force-push without explicit owner authorization.
- Technical PASS does not equal owner visual approval.
- Builder implements. Control chat reviews, compares, accepts/rejects and defines the next narrow pass.
- When delegating work to Builder, ALWAYS provide ONE complete copy-paste technical task block. Never split one assignment into multiple messages that the owner has to copy separately.

## 1. CURRENT HERO DIRECTION — UNCHANGED

Primary Hero object: premium Rubik-style ProAI Cube.

Reference quality benchmark: `https://resend.com/home`

Resend is a quality / motion / material benchmark only. Do not copy proprietary implementation, exact choreography, geometry, materials, light-strip language, scene composition or distinctive visual identity.

Closed / parked directions remain closed unless owner explicitly reopens them:
- C-shape: superseded.
- procedural WebGL / raymarch / SDF sci-fi core: dead end.
- monolith cube: parked fallback only.

Final architecture remains:

`clean GLB + Three.js`

No production Spline runtime.
No watermark hacks.

## 2. CLEAN GLB / MECHANICAL FOUNDATION — LOCKED

Clean GLB:
- `rubik_39_s_cube_animation.glb`
- size: `279,412 bytes`
- SHA256: `DBB7FC4156F8C9ED2481DD76443DFFB9A45ECB5493463F99BFFB34DD3B59C79B`

Preserve:
- logical/spatial cubie identity;
- spatial deduplication for exported-parent oddities;
- temporary pivots for slice turns;
- exact ±90° endpoints;
- X/Y/Z support;
- layers -1 / 0 / +1;
- exact inverse restoration;
- OrbitControls;
- no reparenting leaf meshes out of the recovered `right/center/left` hierarchy in a way that breaks mechanics.

Mechanical R0 reference:
- Branch: `agent/proai-cube-threejs-mechanical-r0`
- Commit: `32cf6e497b3c4402169ab8b677d3372cca439da3`

Motion R1 reference:
- Branch: `agent/proai-cube-motion-r1`
- Commit: `023e0aa9d20292a13c04d9061f98f49a6c380e05`

## 3. GEOMETRY R1 — LAST OWNER-APPROVED STABLE BASELINE

Branch:
`agent/proai-cube-geometry-r1`

Commit:
`73082717909b6f4225841401fe4962d6ff4bbcca`

Prototype:
`docs/site-evolution/spline/proai-cube-geometry-r1/`

Geometry lock:
- face outer: 196.8
- corner radius: 10.6
- recessed thickness: 3.6
- bevel size: 2.35
- bevel thickness: 1.25
- bevel segments: 4
- core: 198
- core radius: 9.2
- core segments: 5
- extra face thickness inward
- outward protrusion: 0

Verified mechanical quality:
- X/Y/Z PASS
- 30 mixed turns PASS
- max position drift ~6.96e-14
- quaternion drift 0
- scale drift 0
- inverse restoration PASS
- Orbit/autonomous PASS
- Spline NONE

Do not reopen Geometry unless a later visual/material pass reveals a concrete defect.

## 4. PRESENTATION MOTION R1.1 — COMPLETED TECHNICALLY, OWNER VISUALLY REJECTED

Branch:
`agent/proai-cube-presentation-motion-r1`

Exact commit:
`d176101a818a9f7b00963a4ece13cd90d222a21c`

Prototype:
`docs/site-evolution/spline/proai-cube-presentation-motion-r1/`

Technical verification:
- branch/SHA verified;
- built from Geometry R1 lineage;
- Geometry R1 preserved PASS;
- X/Y/Z PASS;
- 30 mixed turns PASS;
- inverse restoration PASS;
- interaction PASS;
- full 360 capability PASS;
- Spline NONE;
- production untouched.

R1.1 whole-cube moves implemented:
- +150° / 6400 ms
- -225° / 7600 ms
- +360° / 8800 ms
- +175° / 6900 ms

Interaction behavior that should be preserved:
- hover does nothing;
- manual Orbit drag pauses autonomous whole-cube presentation;
- an already active slice finishes to exact ±90° during drag;
- no new autonomous slice starts while drag is held;
- horizontal orbit unrestricted;
- vertical orbit constrained;
- user-selected camera angle remains after release;
- no snap-back;
- calm delay: ~1850 ms;
- soft presentation resume blend: ~2400 ms.

### OWNER VISUAL VERDICT ON R1.1

R1.1 is NOT owner-approved as the motion baseline.

The owner rejected the choreography because it reads as sequential and intermittently dead:

`slice → pause → body turn → pause → slice`

Observed visual problem:
- one motion system acts while the other is visually frozen;
- whole-cube rotation often becomes its own isolated event;
- Rubik slice mechanics stop while body presentation happens;
- pauses create dead states;
- object reads as mechanically scripted rather than alive;
- current occasional overlap is insufficient.

This is an architecture/choreography problem, not a geometry problem.

## 5. CURRENT NEXT PASS — PRESENTATION MOTION R1.2

R1.2 must build from the useful engineering foundation of R1.1 commit:

`d176101a818a9f7b00963a4ece13cd90d222a21c`

But it must replace/refactor the primarily sequential autonomous choreography.

Required concept:

CONTINUOUS DUAL-MOTION SYSTEM.

Two independent autonomous engines must coexist:

### ENGINE A — WHOLE-CUBE PRESENTATION

The entire cube remains spatially alive essentially continuously:
- evolving yaw;
- restrained pitch;
- subtle roll;
- low-frequency speed variation;
- occasional stronger inspection phase;
- occasional cumulative 360° travel;
- no normal start/stop presentation holds;
- no full stop immediately after 360°;
- no constant-speed screensaver spinner;
- no jitter/random per-frame noise.

### ENGINE B — RUBIK MECHANICS

Slice mechanics run on their own scheduler:
- regular X/Y/Z slice turns;
- changing layers -1/0/+1;
- changing directions;
- short irregular breaths;
- occasional denser phrases;
- no multi-second dead gaps;
- mechanics must frequently continue while Engine A is already moving.

Core architecture rule:

ENGINE A MUST NOT WAIT FOR ENGINE B.
ENGINE B MUST NOT WAIT FOR ENGINE A.

Frequent simultaneous movement is required.

## 6. OPTIONAL / DESIRED PAIRED-LAYER MOTION

If technically safe, R1.2 may occasionally use two concurrent same-axis turns on distinct layers.

Safe model:
- same axis;
- different layers;
- disjoint physical cubie sets;
- no cubie in two active pivots.

Examples:
- X -1 + X +1
- Y 0 + Y +1
- Z -1 + Z +1

Do NOT concurrently rotate intersecting perpendicular slices.

Paired-layer motion is desirable but must not weaken exact mechanics.

## 7. R1.2 LIVENESS TARGETS

For autonomous review footage, excluding manual interaction/calm-delay windows:

- presentationActiveFrameRatio > 0.95
- sliceActiveFrameRatio target roughly 0.55–0.75
- overlapActiveFrameRatio >= 0.50
- longestBothStaticAutonomousMs <= 400 ms

These are quality-control targets, not permission to make the object frantic.

Desired motion language:
- alive
- weighted
- continuous
- controlled
- premium
- independently layered

Avoid:
- robotic synchronization
- clockwork
- screensaver spin
- chaotic gaming motion
- jitter
- stop/start timeline behavior.

## 8. R1.2 MECHANICAL QA — REQUIRED

Required:
- X/Y/Z PASS
- layers -1/0/+1 PASS
- 30 mixed turns PASS
- exact/effectively-zero endpoint error
- position drift same order as Geometry R1/R1.1
- quaternion drift zero/effectively zero
- scale drift zero/effectively zero
- inverse restoration PASS
- Geometry R1 preserved PASS
- GLB unchanged PASS
- Spline dependency NONE
- browser/runtime errors 0

If paired turns are implemented, also prove:
- same-axis + distinct-layer safety
- physical cubie intersection count 0
- no cubie has two simultaneous pivots
- exact ±90° endpoints for both
- correct logical state
- inverse restoration
- repeatability including paired events.

## 9. REVIEW VIDEO — PERMANENT FORMAT RULE

Primary owner-review artifact:
- MP4
- H.264
- yuv420p
- 24 or 30 fps
- preferably 1080p
- direct GitHub/raw link suitable for iPhone

WebM may be supplemental only.

R1.2 review should be approximately 24–30 seconds and visibly demonstrate:
- continuous body movement + Rubik slices;
- X/Y/Z turns while body continues moving;
- at least one dense mechanical phrase;
- paired-layer event if implemented;
- cumulative 360° while Rubik mechanics continue;
- no dead pause after 360°;
- manual Orbit interaction;
- active slice finishing during interaction;
- preserved camera angle;
- soft autonomous recovery.

## 10. PHASE ORDER AFTER R1.2 OWNER REVIEW

Do NOT skip ahead.

Current sequence:
1. Presentation Motion R1.2 — continuous dual-motion architecture.
2. Materials + Lighting.
3. Semantic Display States.
4. Background / Spatial Integration.
5. Hero Integration.
6. Production only after explicit owner authorization.
7. Homepage-wide work later.

Materials + Lighting must NOT start before owner visually approves R1.2.

## 11. MATERIALS + LIGHTING — LATER, DIRECTION PRESERVED

Future material family:
- graphite
- gunmetal
- black chrome
- smoked graphite
- subtle tonal differences
- controlled reflections
- large soft key reflection
- restrained rim
- subtle fill
- moving highlights across bevels

No colorful toy Rubik treatment.
No flat generic grey.

## 12. SEMANTIC DISPLAY STATES — LATER

Future semantic states remain:

RU:
- AI EXPERT
- ДОВЕРИЕ
- ОБРАЩЕНИЕ
- ОТВЕТ
- РЕЗУЛЬТАТ

EN:
- AI EXPERT
- TRUST
- INQUIRY
- RESPONSE
- RESULT

Concept remains:
- mechanical state shows normal 3×3 segmentation;
- on settle, one active face may temporarily become a unified premium display surface;
- one large word across the face;
- segmentation returns before next mechanical phrase.

Do not implement during R1.2.

## 13. HERO COPY / HEADER / PRODUCTION LOCKS — UNCHANGED

Locked Hero copy remains exactly as recorded in the historical Master Handoff. Do not rewrite it.

When actual Hero integration happens later, reuse the real Header System:
- `_includes/header-system/header.html`
- `_data/header.yml`
- `_data/navigation.yml`
- `assets/css/header-system-v1.css`
- `docs/HEADER_SYSTEM_SPEC.md`

Do not redraw header/logo from screenshots.

## 14. NEW-CHAT RULE

A fresh Builder chat is preferred for R1.2 because the previous Builder thread accumulated many experimental iterations and temporary QA patches.

A new Builder must:
1. read the historical Master Handoff for project history and locked decisions;
2. read THIS current-state delta for the newest state;
3. treat this delta as authoritative wherever the historical handoff still says R1.1 is pending;
4. then execute ONE complete R1.2 implementation task from the owner/control chat.

The owner must never be asked to copy separate bootstrap + task messages for one assignment. The complete Builder assignment must be delivered as one copy-paste block, even if it contains multiple internal steps.
