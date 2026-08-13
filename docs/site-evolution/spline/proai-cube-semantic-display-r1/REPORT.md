# ProAI Cube — Semantic Display R1

## Scope
Built from owner-approved Materials + Lighting R1 commit `d17806da42275db617d8a46b231a2d877706a179`. Geometry R1, Motion R1.2 core values, and Materials + Lighting R1 are frozen. Semantic R1 adds one reusable unified face display and semantic scheduling/gating only.

## Unified display system
- Architecture: **one reusable SemanticDisplayGroup**, one near-coplanar unified physical surface mesh + one reusable typography plane. No nine display tiles; no letters parented to cubies.
- Face bounds are derived from live mechanical mesh bounds. Representative face span: **601.400 × 601.400**; display inset ratio **0.988**.
- Face offset: **0.72** local units; text offset: **0.18** local units.
- Display material: **#151c23**, metalness **0.62**, roughness **0.245**, clearcoat **0.14**, clearcoat roughness **0.18**, env intensity **1.08**.
- Text: CanvasTexture **2048×512**, color **#e9edf0**, weight **700**, measured binary font-size fitting. Requested stack: `Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif`. Actual resolved font is recorded per string in `SEMANTIC_QA.json`.

## Semantic behavior
- EN: AI EXPERT → TRUST → INQUIRY → RESPONSE → RESULT.
- RU: AI EXPERT → ДОВЕРИЕ → ОБРАЩЕНИЕ → ОТВЕТ → РЕЗУЛЬТАТ.
- Runtime cadence: **8200–10400 ms**; poor windows defer.
- Entry visibility dot **0.74**; active exit dot **0.56**; entry body-speed ≤ **13.5°/s**; early-exit speed > **18°/s**.
- Surface in 420 ms; text delay 140 ms; text in 320 ms; readable hold 1650 ms; text out 300 ms; surface out 420 ms; slice resume 260 ms.
- In-plane orientation tests 0°/90°/180°/270° in screen projection, selects the most upright candidate, then locks it for the event.
- Manual Orbit fast-resolves semantic state; approved R1.2 camera/calm/recovery remains authoritative. Reduced motion disables automatic semantic cycling.

## Intentional scheduler delta
`sliceAutonomyBlocked()` now calls the unchanged original interaction/recovery predicate plus `semanticBlocksNewSlices()`. This only delays initiation of **new** Rubik events while semantic display/recovery is active. Active turns, ±90° math, easing, event distribution, turn durations, pair safety and R1.2 presentation values are unchanged. See `BASELINE_FREEZE.json`.

## QA
- Semantic Display R1: **PASS**. Geometry **PASS**; Motion core **PASS**; Materials/Lighting **PASS**.
- X/Y/Z: **PASS / PASS / PASS**; layers **PASS**.
- 30 mixed turns: **PASS**, max position 6.961868572213853e-14; quaternion 0; scale 0.
- Paired mechanics **PASS**, physical cubie intersections 0. Inverse **PASS**. Interaction **PASS**.
- EN semantic: activations 5, completed 4, early exits 1, slice overlap 0, body-active ratio 1.0000, avg readable hold 1503.0 ms, min entry dot 0.7409, min active dot 0.5935.
- Text: clip 0; mirrored 0; missing glyph 0; Cyrillic **PASS**.
- GLB **PASS**; Spline **NONE**; runtime **PASS**.
- EN MP4 **PASS**: 41 s / 24 fps / H.264 / yuv420p / 720×720. RU MP4 **PASS**: 22 s / 24 fps / H.264 / yuv420p / 720×720.
- Automated overall: **PASS**.

## Evidence
Primary EN: `review/proai-cube-semantic-display-r1-en-review-41s.mp4`  
RU proof: `review/proai-cube-semantic-display-r1-ru-proof-22s.mp4`  
EN contact: `review/semantic-contact-sheet-en.png`  
RU contact: `review/semantic-contact-sheet-ru.png`  
See `review/` for ten high-resolution screenshots and video contact sheets.

## Gate
Stop after Semantic Display R1. No Background/Spatial Integration or Hero Integration is started. Owner visual approval is required before any later phase.

## Owner-video evidence correction
Owner visual frame inspection found that the first EN Playwright/WebM wall-time normalization omitted the late **RESULT** state from the visible 41-second MP4 even though logical semantic QA passed. The canonical EN owner video was corrected at the evidence layer only: 0–35.5 s is retained, and 35.5–41.0 s is a deterministic capture from the same committed Three.js runtime showing **RESULT**, continuous body motion, semantic exit, and a post-semantic Y/-1 mechanical turn. Geometry R1, Motion R1.2, Materials + Lighting R1, Semantic R1 runtime/config, and the GLB were not changed. See `OWNER_VIDEO_CORRECTION.json` and `review/11-en-result-owner-proof.png`.
