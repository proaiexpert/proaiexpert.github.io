# Original ProAI Cube — Adaptation Log

This log separates the licensed/CC0 Spline donor contribution from later ProAI-authored runtime work.

## Donor-derived source

- original Spline Community scene
- donor hierarchy/source geometry/transforms/grouping
- original clean GLB
- original Spline state/motion behavior as reference

## ProAI adaptation history recovered

### Three.js Mechanical R0

ProAI used the exact clean GLB geometry while removing Spline runtime dependency from the production architecture and building an independent Three.js mechanical implementation.

### Motion R1

ProAI added generalized X/Y/Z slice mechanics, logical cube state, 27 physical cubies, autonomous choreography, body drift, manual Orbit interaction and resume behavior.

### Geometry R1

ProAI replaced local mesh `BufferGeometry` while preserving donor node hierarchy and cubie transforms. Face meshes remained children of the original cubie parents; no flattening/reparenting was performed.

Correct authorship description:

> third-party Spline donor hierarchy/source geometry → ProAI reconstructed/replaced runtime mesh geometry while preserving source hierarchy/transforms.

Do not claim that all Cube geometry was created by ProAI from scratch.

### Presentation Motion R1.2

ProAI added a continuous whole-cube presentation engine, independent Rubik scheduler, yaw/pitch/roll envelopes, paired turns and timing system while Geometry R1 remained frozen.

### Materials + Lighting R1

ProAI added graphite/gunmetal/black-chrome/smoked-core PBR materials, procedural PMREM environment, key/fill/rim studio lighting and ACES tone mapping. Recovery evidence records the original GLB as unchanged during this stage.

## Continuing rule

Future changes should be appended with date, branch/commit, exact scope and whether donor geometry/hierarchy remains present.
