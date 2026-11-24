# ProAI Rubik Cube — Motion R1

## Scope

Motion-only pass built from the stable Three.js Mechanical R0 baseline. Geometry, neutral R0 materials/light, named hierarchy, clean GLB and OrbitControls are preserved. No semantic text, final material system, Hero integration, Spline runtime, merge or deployment.

## Generalized slice engine

- Axes: **X / Y / Z**.
- Logical layers: **-1 / 0 / +1** on every axis.
- Spatial deduplication: **27 physical cubies from 30 exported cubie-parent objects**.
- Selection is based on logical spatial coordinates, never mesh names.
- Slice turns use a temporary pivot; leaf face meshes are never flattened/reparented.
- Each completed turn commits a discrete logical coordinate/orientation state and exact canonical transform. There is no visual transform reset between choreography moves.

## Motion character

- Turn durations used by autonomous choreography: **1210–1490 ms**.
- Holds: **520–2600 ms**, including short phrase breaths and longer settles.
- Easing: **cubic-bezier(0.36, 0, 0.12, 1)**.
- Body drift: yaw **±3.8° / 12.8s**, pitch **±2.15° / 15.2s**, roll **±0.65° / 10.6s**.
- OrbitControls: damping **0.074**, rotate speed **0.5**, zoom speed **0.48**, pan disabled.
- Manual interaction pauses autonomous progression; resume delay **1850 ms**, soft presentation blend **2400 ms**. Camera is never snapped back.

## Choreography

The autonomous program uses a curated 8-turn X/Y/Z phrase followed later by its exact inverse as an 8-turn resolution. This returns the cube naturally through real Rubik turns rather than a hidden transform reset. Short two-turn phrases alternate with longer breathing holds.

## Automated QA

- X axis: **PASS**.
- Y axis: **PASS**.
- Z axis: **PASS**.
- Layers -1 / 0 / +1: **PASS**.
- 30 mixed turns: **PASS**; max canonical position error 6.961868572213853e-14; quaternion error 0; scale error 0.
- Exact inverse restoration: **PASS**.
- Orbit/autonomous interaction: **PASS**; max deterministic resume quaternion step 0.010730634307600316.
- Runtime/browser: **PASS**; Spline dependency **NONE**.
- Review video: **18.00 s @ 24 fps**, 432 frames; coverage **PASS**.

## Review evidence

- `review/proai-cube-motion-r1-natural.png`
- `review/proai-cube-motion-r1-multi-axis.png`
- `review/proai-cube-motion-r1-review-18s.webm`
- `QA.json`

## Gate

Automated mechanical/runtime gates: **PASS**. Final choreography visual-quality judgment remains an owner-review gate; Geometry Phase must not start before owner review.
