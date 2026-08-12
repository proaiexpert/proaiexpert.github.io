# PROAI EXPERT HERO — CURRENT CONTROL STATE — SEMANTIC DISPLAY R1

Repository: `proaiexpert/proaiexpert.github.io`
Date: 2026-08-12

This is the newest control-state delta. It preserves the historical Master Handoff and prior deltas. If any older control document still says Materials + Lighting R1 is pending owner approval, THIS DOCUMENT WINS.

## 0. Operating contract — still locked

- Active scope remains HERO ONLY.
- Do not touch sections below Hero.
- Do not modify production `/index.html` or `/ru/index.html` without explicit owner authorization.
- No merge, deploy, publish, rollback, force-push or destructive cleanup without explicit owner authorization.
- Technical PASS does not equal owner visual approval.
- Builder executes implementation; Control Chat owns visual acceptance and next-phase scope.
- Every delegated Builder assignment must be ONE complete copy-paste task block.

## 1. Owner-approved baselines

### Geometry R1 — OWNER APPROVED

Branch: `agent/proai-cube-geometry-r1`
Commit: `73082717909b6f4225841401fe4962d6ff4bbcca`

Geometry remains frozen.

### Presentation Motion R1.2 — OWNER APPROVED

Branch: `agent/proai-cube-presentation-motion-r1-2`
Commit: `89965750e4456a6e2d54d8309809471f8dbfcc75`

Motion remains frozen except for a future narrow micro-tuning pass only if a later integrated semantic/scene review proves it necessary.

### Materials + Lighting R1 — OWNER APPROVED

Branch: `agent/proai-cube-materials-lighting-r1`
Commit: `d17806da42275db617d8a46b231a2d877706a179`
Prototype: `docs/site-evolution/spline/proai-cube-materials-lighting-r1/`

Status: **TECHNICAL PASS + OWNER VISUAL APPROVAL**.

Owner reviewed the corrected 27 s MP4 and approved the direction after independent Control review.

Final approved material family:
- graphite `#242a31`;
- gunmetal `#2b323a`;
- black chrome `#181d23`;
- smoked core `#0c0f13`;
- physically based MeshPhysicalMaterial response;
- procedural PMREM studio reflection cards;
- soft key/fill/rim;
- ACESFilmicToneMapping;
- no bloom/postprocessing;
- no neon/RGB/sci-fi language.

Control assessment:
- current cube is already a high-end premium 3D brand-object foundation;
- geometry/mechanics/motion/materials should now be treated as frozen baseline layers;
- further roughness/light/motion iteration before semantic work would have low ROI;
- the highest-value differentiator now is Semantic Display.

## 2. Current next phase — Semantic Display R1

Semantic Display R1 is now UNBLOCKED.

Primary semantic states:

EN:
- `AI EXPERT`
- `TRUST`
- `INQUIRY`
- `RESPONSE`
- `RESULT`

RU:
- `AI EXPERT`
- `ДОВЕРИЕ`
- `ОБРАЩЕНИЕ`
- `ОТВЕТ`
- `РЕЗУЛЬТАТ`

The semantic system is the planned main differentiation from the Resend benchmark.

## 3. Core semantic concept

The cube has two visual modes:

### Mechanical state

- normal 3×3 segmentation visible;
- Geometry R1 seams and material hierarchy visible;
- R1.2 body motion and Rubik mechanics active.

### Semantic display state

- only when no slice turn is active and a suitable visible face is available;
- one complete exterior 3×3 face temporarily reads as one unified premium display surface;
- the display is NOT nine independent tile labels;
- one large word spans the whole face;
- internal seams are visually suppressed during the active semantic state;
- after the word disappears, the display layer disappears and normal Rubik segmentation returns before new slice mechanics resume.

The desired perceptual transformation is:

`ENGINEERED RUBIK OBJECT → UNIFIED INFORMATION SURFACE → ENGINEERED RUBIK OBJECT`

Do not make it look like HTML text pasted on top of the cube.
Do not make it look like a floating sticker/card.
Do not distribute letters tile-by-tile.

## 4. Semantic surface architecture

Preferred implementation:
- a very thin face-aligned semantic overlay/display surface attached to the cube coordinate system, not to individual cubies;
- nearly coplanar with the selected outer face, with only enough physical offset/polygon handling to eliminate z-fighting;
- full-face size aligned to the complete 3×3 exterior plane;
- restrained smoked graphite / black-chrome display material;
- broad existing PMREM reflections should continue across the display surface;
- text rendered sharply with a production-plausible local/browser solution that supports EN and Cyrillic;
- preserve current material/light system underneath unchanged.

The display should feel as though the cube material itself temporarily becomes an interface.

## 5. Motion / scheduler integration

Do NOT rewrite R1.2.
Do NOT retune base motion values in Semantic Display R1.

Required semantic scheduling behavior:

1. Wait until active slice/pair/phrase is fully finished.
2. Select a sufficiently camera-visible exterior face.
3. Temporarily block only NEW slice scheduling.
4. Whole-cube presentation motion CONTINUES during the semantic state.
5. Fade/resolve the unified display surface and word.
6. Hold long enough for effortless reading.
7. Fade the word/display away.
8. Restore visible 3×3 segmentation fully.
9. Resume new slice scheduling after a small natural offset rather than on the exact same frame.

The semantic state must never create a visually dead cube: presentation motion remains active.

Semantic display and an active slice turn must not overlap in R1 unless a later experiment proves a much stronger safe visual solution.

## 6. Visibility / face-selection quality

A semantic word must never appear on a hidden, back-facing or severely foreshortened face.

Activate only when:
- face is sufficiently front-facing to camera;
- projected face area is comfortably readable;
- current presentation velocity/orientation allows the word to remain legible for the intended hold;
- face is not currently participating in an active turn.

If the face is becoming unreadable during the state, exit cleanly rather than letting text rotate to an obviously poor angle.

Never mirror or reverse text.
Only one semantic face may be active at a time.

## 7. Visual language

Target:
- premium display surface;
- smoked graphite / black chrome;
- soft white / pearl / silver typography;
- subtle material reflection movement;
- extremely restrained transition;
- no neon;
- no cyan HUD;
- no glow-first treatment;
- no hologram;
- no gaming UI;
- no bright emissive rectangle;
- no visible floating border frame unless an exceptionally subtle physical edge is required.

The display should be visually quieter than the Rubik mechanics and therefore more powerful when it appears.

## 8. Typography

Use one large semantic word / phrase centered across the entire face.

Requirements:
- one line whenever physically possible;
- `AI EXPERT` one line;
- longest RU words such as `ОБРАЩЕНИЕ` and `РЕЗУЛЬТАТ` must fit cleanly without clipping;
- adaptive fit by measured text width is allowed;
- use the current/canonical ProAI typography family if available in the repository/browser environment rather than introducing a random new brand font;
- soft white/pearl rather than harsh #FFFFFF;
- crisp at owner-review resolution and plausible for final production rendering.

## 9. Interaction

On manual Orbit drag:
- do not start a new semantic state;
- if a semantic state is active, fade/resolve it cleanly and quickly instead of leaving a word stranded at a bad angle;
- preserve the existing active-slice completion behavior;
- preserve no-new-slice-during-drag behavior;
- preserve selected camera angle;
- preserve no snap-back;
- preserve calm delay and soft recovery;
- semantic scheduler resumes only after normal autonomy is stable again.

## 10. Reduced motion

Preserve sensible `prefers-reduced-motion` behavior.
A reduced-motion user must not be forced through repeated automatic semantic transitions.

## 11. QA requirements

Baseline regression:
- Geometry R1 preserved PASS;
- Materials + Lighting R1 preserved PASS;
- Motion R1.2 base values preserved PASS;
- X/Y/Z PASS;
- layers -1/0/+1 PASS;
- 30 mixed turns PASS;
- paired-turn safety PASS;
- inverse restoration PASS;
- interaction PASS;
- GLB unchanged PASS;
- Spline NONE;
- runtime/browser errors 0;
- production untouched.

Semantic QA should explicitly report:
- EN strings all fit with no clipping;
- RU strings all fit with no clipping;
- Cyrillic renders correctly;
- no mirrored/reversed text;
- max one semantic face active;
- semantic/slice overlap count = 0;
- body presentation remains active during semantic states;
- no z-fighting/flicker;
- no obvious floating-card detachment;
- seams are visually suppressed during active display and fully return after exit;
- interaction clears/blocks semantic state correctly.

## 12. Review evidence

Primary review should show actual runtime-like choreography, not isolated test scenes.

It should demonstrate:
- normal mechanical cube state;
- transition into unified display;
- readable `AI EXPERT`;
- stage words;
- whole-cube body motion continuing while display is active;
- display exit back to 3×3 segmentation;
- Rubik mechanics resuming;
- several different visible face angles;
- manual Orbit behavior;
- no text mirroring/clipping;
- Russian/Cyrillic proof.

Prefer 1080p if feasible; 720p minimum acceptable if CI rendering constraints make 1080 impractical.
Primary codec rule remains H.264 / yuv420p / 24 or 30 fps.

## 13. Stop condition

STOP after Semantic Display R1.

Do NOT start:
- Background / Spatial Integration;
- Hero Integration;
- motion micro-tuning;
- Logo;
- Header/Footer restyling;
- Homepage sections;
- production integration.

Owner/Control Chat must visually approve Semantic Display R1 first.

## 14. Remaining roadmap

1. Semantic Display R1.
2. Background / Spatial Integration.
3. Hero Integration.
4. Final integrated Hero review; only then allow a narrow micro-polish if needed.
5. Hero production only after explicit owner authorization.
6. After fully completed Hero: Logo → Header → Footer → reusable Brand System → Homepage/Landing Page.
