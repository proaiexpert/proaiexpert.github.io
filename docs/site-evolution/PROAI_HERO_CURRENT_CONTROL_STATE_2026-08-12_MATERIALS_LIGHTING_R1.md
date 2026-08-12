# PROAI EXPERT HERO — CURRENT CONTROL STATE — MATERIALS + LIGHTING R1

Repository: `proaiexpert/proaiexpert.github.io`
Date: 2026-08-12

This is the newest control-state delta. It preserves the historical Master Handoff and later deltas. If an older control document still says Materials + Lighting is pending, this document wins.

## Current approved baselines

Geometry R1 owner-approved baseline:
- branch `agent/proai-cube-geometry-r1`
- commit `73082717909b6f4225841401fe4962d6ff4bbcca`

Presentation Motion R1.2 owner-approved motion baseline:
- branch `agent/proai-cube-presentation-motion-r1-2`
- commit `89965750e4456a6e2d54d8309809471f8dbfcc75`

## Materials + Lighting R1 — technical result

Branch:
`agent/proai-cube-materials-lighting-r1`

Exact final commit:
`d17806da42275db617d8a46b231a2d877706a179`

Prototype:
`docs/site-evolution/spline/proai-cube-materials-lighting-r1/`

Status:
**TECHNICAL PASS / OWNER VISUAL APPROVAL PENDING**

Independent control verification confirmed:
- branch points exactly to the claimed SHA;
- implementation is 11 commits ahead of Motion R1.2 and 0 behind; merge base is exactly `89965750e4456a6e2d54d8309809471f8dbfcc75`;
- net diff contains only isolated Materials + Lighting prototype/evidence/workflow files; production `/index.html` and `/ru/index.html` are not changed;
- final correction changes only material/light/readability look-development parameters and evidence, while frozen motion/mechanics/interaction/geometry hashes remain identical to R1.2;
- Geometry R1 preserved PASS;
- Motion R1.2 preserved PASS;
- clean GLB unchanged PASS;
- X/Y/Z and layers -1/0/+1 PASS;
- 30 mixed turns PASS;
- paired-turn safety PASS;
- inverse restoration PASS;
- interaction PASS;
- Spline dependency NONE;
- browser/runtime QA PASS;
- production untouched.

## Final look-development configuration

Materials use `MeshPhysicalMaterial`.

Graphite:
- color `#242a31`
- metalness `0.84`
- roughness `0.295`
- clearcoat `0.16`
- clearcoat roughness `0.20`
- env intensity `1.18`

Gunmetal:
- color `#2b323a`
- metalness `0.86`
- roughness `0.265`
- clearcoat `0.20`
- clearcoat roughness `0.18`
- env intensity `1.22`

Black chrome:
- color `#181d23`
- metalness `0.92`
- roughness `0.225`
- clearcoat `0.16`
- clearcoat roughness `0.16`
- env intensity `1.26`

Smoked core:
- color `#0c0f13`
- metalness `0.48`
- roughness `0.44`
- clearcoat `0.06`
- clearcoat roughness `0.28`
- env intensity `0.66`

Lighting:
- Hemisphere fill intensity `0.52`, sky `#8a949f`, ground `#0b0e12`;
- Key RectArea `#e2e6eb`, intensity `5.2`, size `16.75×13.09`, position `[8.48,3.25,10.21]`;
- Fill RectArea `#b7c0ca`, intensity `4.0`, size `14.92×13.87`, position `[-7.59,1.15,9.00]`;
- Rim RectArea `#e8ecf1`, intensity `4.6`, size `6.02×13.87`, position `[-6.70,5.34,-9.84]`.

Environment:
- procedural PMREM studio reflection-card environment;
- 4 broad cards;
- sigma `0.075`;
- no external HDR/HDRI texture.

Color management:
- `SRGBColorSpace`;
- `ACESFilmicToneMapping`;
- exposure `1.0`;
- postprocessing NONE.

## Owner review artifacts

Primary MP4:
`https://raw.githubusercontent.com/proaiexpert/proaiexpert.github.io/d17806da42275db617d8a46b231a2d877706a179/docs/site-evolution/spline/proai-cube-materials-lighting-r1/review/proai-cube-materials-lighting-r1-review-27s.mp4`

Metadata:
- H.264
- yuv420p
- 24 fps
- 720×720
- 27.000 s
- 648 frames
- 4,265,271 bytes

Review screenshots are stored in:
`docs/site-evolution/spline/proai-cube-materials-lighting-r1/review/`

## Current gate

Do NOT start Semantic Display until owner visually reviews Materials + Lighting R1.

If owner approves:
- Materials + Lighting R1 becomes the new owner-approved visual/material baseline;
- next phase is Semantic Display States.

If owner identifies a concrete visual defect:
- perform only a narrow Materials + Lighting correction;
- do not reopen Geometry R1 or Motion R1.2 unless the defect specifically proves a regression there.

Production remains locked. Hero-only scope remains active. Sections below Hero remain untouched.