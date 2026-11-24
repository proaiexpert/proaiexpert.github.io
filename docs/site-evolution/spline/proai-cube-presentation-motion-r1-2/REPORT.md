# ProAI Rubik Cube — Presentation Motion R1.2

## Scope

Continuous dual-motion refactor from Presentation Motion R1.1 commit `d176101a818a9f7b00963a4ece13cd90d222a21c`. Geometry R1, temporary materials/lights, clean GLB and exact Rubik mechanics remain locked.

## Engine A — continuous whole-cube presentation

- Normal yaw range: **7–12°/s**.
- Inspection yaw range: **18–30°/s**.
- Pitch envelope: **±10.2°**; roll envelope: **±2.45°**.
- Continuous cumulative 360: **PASS at ~18 s**; no stop immediately after 360: **PASS**.

## Engine B — independent Rubik scheduler

- Runtime duration range configured: **1080–1420 ms**.
- Review duration range actually used: **1120–1340 ms**.
- Runtime typical gaps: **180–420 ms**; breathing gaps **620–820 ms**; paired stagger **100–220 ms**.
- Tight phrase gap in owner review: **160 ms**.

## Liveness

- presentationActiveFrameRatio: **0.9983**.
- sliceActiveFrameRatio: **0.6799**.
- overlapActiveFrameRatio: **0.6799**.
- longestBothStaticAutonomousMs: **41.7 ms**.

## QA

- Geometry R1 preserved: **PASS**.
- X / Y / Z: **PASS / PASS / PASS**.
- 30 mixed turns: **PASS**; max position 6.961868572213853e-14; quaternion 0; scale 0.
- Inverse restoration: **PASS**.
- Paired-turn safety/inverse: **PASS**; cubie intersection 0.
- Interaction: **PASS**.
- Browser/runtime: **PASS**; Spline dependency **NONE**.
- Owner MP4: **PASS**, 27.000 s @ 24 fps, H.264/yuv420p, 640×760.

## Review evidence

- `review/proai-cube-presentation-motion-r1-2-natural.png`
- `review/proai-cube-presentation-motion-r1-2-simultaneous.png`
- `review/proai-cube-presentation-motion-r1-2-paired.png`
- `review/proai-cube-presentation-motion-r1-2-large-angle.png`
- `review/proai-cube-presentation-motion-r1-2-review-27s.mp4` (primary)
- `QA.json`

## Gate

Automated acceptance: **PASS**. Materials + Lighting remain blocked pending owner visual review.
