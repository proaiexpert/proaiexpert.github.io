# ProAI Rubik Cube — Presentation Motion R1.1

## Scope

Presentation-motion-only refinement from Geometry R1 commit `73082717909b6f4225841401fe4962d6ff4bbcca`. Geometry R1, bevel/gaps, temporary materials/lights and X/Y/Z slice mechanics are frozen.

## Whole-cube presentation

- Large yaw moves: **150°, -225°, 360°, 175°**.
- Duration range: **6400–8800 ms**.
- Full 360 move: **8800 ms**, rare in the autonomous sequence.
- Secondary modulation: pitch up to **±7.6°**, roll up to **±1.45°**.
- Presentation easing profiles: cubic-bezier(0.42, 0, 0.12, 1); cubic-bezier(0.38, 0, 0.1, 1); cubic-bezier(0.46, 0, 0.14, 1).
- Existing micro drift remains unchanged: yaw ±3.8°, pitch ±2.15°, roll ±0.65°.

## Interaction semantics

- Manual Orbit drag pauses whole-cube presentation and blocks new autonomous slices.
- An already active Rubik slice continues to its exact ±90° endpoint during drag.
- Release delay remains **1850 ms**; presentation blend remains **2400 ms**.
- Camera remains at the manually chosen orbit; no automatic camera reset/snap.
- Horizontal azimuth is unrestricted; vertical polar range remains Geometry R1 / Motion R1 bounds.

## QA

- Geometry R1 preserved: **PASS**.
- Full 360 inspection: **PASS**.
- Interaction active-slice completion / no next slice / no snap: **PASS**.
- X / Y / Z: **PASS / PASS / PASS**.
- 30 mixed turns: **PASS**; max position 6.961868572213853e-14; quaternion 0; scale 0.
- Inverse restoration: **PASS**.
- Browser/runtime: **PASS**; Spline dependency **NONE**.
- Owner MP4: **PASS**, 20.250 s @ 24 fps, H.264/yuv420p.

## Review evidence

- `review/proai-cube-presentation-motion-r1-natural.png`
- `review/proai-cube-presentation-motion-r1-large-angle.png`
- `review/proai-cube-presentation-motion-r1-slice-plus-presentation.png`
- `review/proai-cube-presentation-motion-r1-review-20s.mp4` (primary)
- `review/proai-cube-presentation-motion-r1-review-20s.webm` (secondary)
- `QA.json`

## Gate

Automated acceptance: **PASS**. Materials + Lighting remain blocked pending owner review.
