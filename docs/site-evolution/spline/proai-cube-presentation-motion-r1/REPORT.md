# ProAI Rubik Cube — Presentation Motion R1.1

## Scope

Narrow presentation-motion refinement built from Geometry R1 commit `73082717909b6f4225841401fe4962d6ff4bbcca`. Geometry, bevel, gaps, GLB, neutral materials/lighting, logical slice engine and existing Rubik slice choreography are frozen. No Hero integration, merge or deploy.

## Whole-cube presentation system

- Large autonomous yaw moves: .
- Duration range: undefined ms.
- Settle range: undefined ms.
- Full 360 move: **PASS**; deterministic unwrapped yaw delta 360.000000°.
- Large moves use per-move cubic-bezier profiles with soft pitch / minimal roll modulation; no bounce or overshoot.
- Existing micro-drift remains 3.8° yaw / 2.15° pitch / 0.65° roll.

## Interaction semantics

- Manual Orbit start pauses whole-cube presentation immediately.
- A slice already in progress continues to its exact ±90° endpoint.
- New autonomous slice starts are blocked while dragging and during calm delay.
- Calm delay: 1850 ms.
- Soft presentation blend: 2400 ms.
- Camera is never reset by the presentation system.
- Interaction QA: **PASS**.

## Frozen Geometry R1

- Geometry constants/functions: **PASS**.
- Neutral material/light block unchanged: **PASS**.
- GLB exact SHA match: **PASS**.
- Existing Rubik slice choreography byte-equivalent: **PASS**.

## Mechanical QA

- X / Y / Z: **PASS / PASS / PASS**.
- 30 mixed turns: **PASS**; endpoint max 0, position 1.1718571004216928e-13, quaternion 0, scale 4.002966042486721e-16.
- Exact inverse restoration: **PASS**.
- Runtime/browser errors: 0; Spline dependency **NONE**.

## Owner review evidence

- `review/proai-cube-presentation-motion-r1-natural.png`
- `review/proai-cube-presentation-motion-r1-large-inspection.png`
- `review/proai-cube-presentation-motion-r1-360-slice.png`
- `review/proai-cube-presentation-motion-r1-review-21s.mp4` — H.264 / yuv420p / 24 fps / 21.29 s.
- `QA.json`

## Gate

Automated mechanics, whole-cube 360, interaction, geometry-freeze and runtime gates must all be green. Visible intersections / presentation quality require direct screenshot/video QC before final handoff. Materials + Lighting must not start before owner review.
