# ProAI Rubik Cube — Geometry R1

## Scope

Geometry-only pass built from frozen Motion R1 commit `023e0aa9d20292a13c04d9061f98f49a6c380e05`. X/Y/Z mechanics, logical state, choreography timing, body drift and OrbitControls behavior are preserved. No final materials, final lighting, semantic display, Hero integration, merge or deploy.

## Geometry decision

The baked GLB hierarchy and transforms remain authoritative. The original render geometry was visually too flat/subtle for a premium object, so Geometry R1 replaces only local mesh BufferGeometry while keeping the exact mesh nodes and cubie transforms. Face meshes remain children of their original cubie parents; no leaf flattening/reparenting is introduced.

## Chosen geometry

- Face outer size: **196.8**.
- Face corner radius: **10.6**.
- Face recessed thickness: **3.6**.
- Face bevel: size **2.35**, thickness **1.25**, **4** segments.
- Core size: **198**.
- Core radius: **9.2**, **5** segments.
- Face gap range from frozen lattice: **3.700–8.200**.
- Core seam range: **2.500–7.000**.
- Added face thickness is recessed inward; outward protrusion into gaps: **0**.

## Temporary visual baseline

Neutral graphite MeshStandardMaterial plus simple key/fill/rim studio lights are used only to reveal bevel, gaps and silhouette. This is not the Materials / Lighting phase.

## QA

- Geometry structural gate: **PASS**.
- Motion R1 config frozen: **PASS**.
- X / Y / Z: **PASS / PASS / PASS**.
- 30 mixed turns: **PASS**; max position error 6.961868572213853e-14; quaternion 0; scale 0.
- Exact inverse restoration: **PASS**.
- Orbit/autonomous interaction: **PASS**.
- Runtime/browser: **PASS**; Spline dependency **NONE**.
- Review video: **14.50 s @ 24 fps**, 348 frames; **PASS**.

## Review evidence

- `review/proai-cube-geometry-r1-natural.png`
- `review/proai-cube-geometry-r1-edge-close.png`
- `review/proai-cube-geometry-r1-slice-turn.png`
- `review/proai-cube-geometry-r1-review-14s.webm`
- `QA.json`

## Gate

Automated geometry/mechanical/runtime gates: **PASS**. Visual geometry quality still requires direct screenshot/video QC before owner handoff. Materials / Lighting must not start before owner review.
