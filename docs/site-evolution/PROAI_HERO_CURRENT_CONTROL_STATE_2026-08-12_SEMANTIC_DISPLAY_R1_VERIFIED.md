# PROAI EXPERT HERO — CURRENT CONTROL STATE — SEMANTIC DISPLAY R1 VERIFIED

Repository: `proaiexpert/proaiexpert.github.io`
Date: 2026-08-12

This is a new control-state delta. It preserves all historical handoff/control documents. Where an older control document still says Semantic Display R1 is only planned/in progress, this document wins for current status.

## Approved upstream baselines

Geometry R1 — OWNER APPROVED:
- branch `agent/proai-cube-geometry-r1`
- commit `73082717909b6f4225841401fe4962d6ff4bbcca`

Presentation Motion R1.2 — OWNER APPROVED:
- branch `agent/proai-cube-presentation-motion-r1-2`
- commit `89965750e4456a6e2d54d8309809471f8dbfcc75`

Materials + Lighting R1 — OWNER APPROVED:
- branch `agent/proai-cube-materials-lighting-r1`
- commit `d17806da42275db617d8a46b231a2d877706a179`

## Semantic Display R1

Branch:
`agent/proai-cube-semantic-display-r1`

Exact final commit:
`d11bdd82cc3e209071b54ae1c7671ef4ab953181`

Prototype:
`docs/site-evolution/spline/proai-cube-semantic-display-r1/`

Status:
**TECHNICAL PASS / OWNER VISUAL APPROVAL PENDING**

## Independent control verification

Control independently confirmed:

- branch points exactly to `d11bdd82cc3e209071b54ae1c7671ef4ab953181`;
- compared to owner-approved Materials + Lighting R1 base `d17806da42275db617d8a46b231a2d877706a179`, Semantic Display R1 is `35 commits ahead`, `0 behind`;
- merge base is exactly `d17806da42275db617d8a46b231a2d877706a179`;
- net diff is isolated to Semantic Display R1 prototype/evidence/build/workflow files;
- production `/index.html` and `/ru/index.html` are absent from the net diff;
- REPORT.md confirms one reusable `SemanticDisplayGroup`, one near-coplanar unified physical surface and one typography plane; no nine independent display tiles and no letters parented to cubies;
- Semantic scheduler only blocks initiation of NEW slice events while the semantic state/recovery is active; active turns and approved ±90° mechanics remain unchanged;
- `BASELINE_FREEZE.json` independently confirms matching hashes for motion config, Presentation R1.2, Slice R1.2, Geometry R1, Lookdev R1, studio environment, studio lighting, material classifier, turn math, presentation engine and scheduler core;
- intentional scheduler delta is explicitly documented at `sliceAutonomyBlocked()`;
- Materials/Lighting, Geometry and Motion core are marked frozen/pass;
- X/Y/Z and layers -1/0/+1 PASS;
- 30 mixed turns PASS with max position drift `6.961868572213853e-14`, quaternion drift `0`, scale drift `0`;
- paired mechanics PASS with physical cubie intersections `0`;
- inverse restoration PASS;
- interaction PASS;
- EN semantic QA: 5 activations, 4 normal completions, 1 intentional early exit, slice overlap `0`, body-active ratio `1.0000`, average readable hold `1503 ms`, minimum entry dot `0.7409`, minimum active dot `0.5935`;
- clipping `0`, mirrored text `0`, missing glyphs `0`, Cyrillic PASS;
- GLB unchanged PASS;
- Spline dependency NONE;
- runtime PASS / browser errors 0;
- EN owner-review MP4 metadata: 41.000 s, 720×720, 24 fps, H.264, yuv420p, 984 frames;
- RU proof MP4 metadata: 22.000 s, 720×720, 24 fps, H.264, yuv420p, 528 frames;
- review directory contains required screenshots, EN/RU contact sheets and both MP4s.

## Owner-video correction note

The Builder detected that the first EN evidence capture omitted the late `RESULT` state despite logical QA passing. The final committed evidence corrects only the owner-review video layer:

- first 35.5 s retained;
- final 5.5 s deterministically re-captured from the same committed Three.js runtime;
- corrected tail shows `RESULT` on face `-X`, orientation `0°`, entry visibility `0.8841823894737262`, max text opacity `1`, body-active ratio `1`, semantic exit and post-semantic Y/-1 mechanical turn;
- runtime/config, Geometry R1, Motion R1.2, Materials + Lighting R1, Semantic R1 config and GLB were not changed by the correction.

This correction is documented in `OWNER_VIDEO_CORRECTION.json` and is technically acceptable as evidence-layer correction. It does not by itself equal owner visual approval.

## Current gate

Semantic Display R1 is technically complete and verified.

**Do NOT open Background / Spatial Integration or Hero Integration until the owner watches the final EN/RU review evidence and explicitly approves the visual result.**

If the owner approves:
- `d11bdd82cc3e209071b54ae1c7671ef4ab953181` becomes the OWNER-APPROVED SEMANTIC DISPLAY baseline;
- next Cube/Hero phase is Background / Spatial Integration, coordinated with the separately preserved Brand Color Architecture / Visual Lab decisions.

If the owner identifies a concrete visual defect:
- run only a narrow Semantic Display correction;
- preserve Geometry R1, Motion R1.2 and Materials + Lighting R1;
- do not start Background/Spatial Integration yet.

Production remains locked. Hero-only execution scope remains active.