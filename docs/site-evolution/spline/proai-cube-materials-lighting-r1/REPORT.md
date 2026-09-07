# ProAI Rubik Cube — Materials + Lighting R1

## Scope

Look-development pass built from owner-approved Presentation Motion R1.2 commit `89965750e4456a6e2d54d8309809471f8dbfcc75`. Geometry R1 and all motion/mechanical/interaction logic are frozen.

## Final PBR material hierarchy

- Graphite face: color **#242a31**, metalness **0.84**, roughness **0.295**, clearcoat **0.16**, clearcoat roughness **0.2**, env intensity **1.18**.
- Gunmetal face: color **#2b323a**, metalness **0.86**, roughness **0.265**, clearcoat **0.2**, clearcoat roughness **0.18**, env intensity **1.22**.
- Black-chrome face: color **#181d23**, metalness **0.92**, roughness **0.225**, clearcoat **0.16**, clearcoat roughness **0.16**, env intensity **1.26**.
- Smoked core: color **#0c0f13**, metalness **0.48**, roughness **0.44**, clearcoat **0.06**, clearcoat roughness **0.28**, env intensity **0.66**.

Material assignment counts: graphite 48, gunmetal 48, black-chrome 84, core 30.

## Lighting / reflections

- Environment: **procedural PMREM studio reflection cards**, 4 broad cards, PMREM sigma 0.075, external textures 0.
- Key: **RectAreaLight**, intensity 5.2, size 16.75 × 13.09, position [8.48, 3.25, 10.21].
- Fill: **RectAreaLight**, intensity 4, size 14.92 × 13.87, position [-7.59, 1.15, 9.00].
- Rim: **RectAreaLight**, intensity 4.6, size 6.02 × 13.87, position [-6.70, 5.34, -9.84].
- Hemisphere fill: intensity 0.52, sky #8a949f, ground #0b0e12.
- Tone mapping: **ACESFilmicToneMapping**; exposure **1**; output **SRGBColorSpace**.
- Postprocessing: **NONE**.

## Motion freeze

- Motion R1.2 code freeze: **PASS**.
- Normal yaw: **7–12°/s**; inspection **18–30°/s**; pitch ±10.2°; roll ±2.45°.
- Slice duration: **1080–1420 ms**; normal gaps 180–420 ms; breathing 620–820 ms; paired stagger 100–220 ms.
- No motion timing values changed.

## QA

- Geometry R1 preserved: **PASS**.
- Motion R1.2 preserved: **PASS**.
- Materials + Lighting gate: **PASS**.
- GLB unchanged: **PASS**.
- X / Y / Z: **PASS / PASS / PASS**.
- 30 mixed turns: **PASS**; max position 6.961868572213853e-14; quaternion 0; scale 0.
- Paired-turn safety/inverse: **PASS**; physical cubie intersection 0.
- Inverse restoration: **PASS**.
- Interaction: **PASS**.
- Browser/runtime: **PASS**; Spline **NONE**.
- Software-CI render benchmark: 1.98 ms/frame at 960×960 (diagnostic only).
- Owner MP4: **PASS**, 27.000 s @ 24 fps, H.264/yuv420p, 720×720.

## Review evidence

- `review/proai-cube-materials-lighting-r1-natural.png`
- `review/proai-cube-materials-lighting-r1-front-lighting.png`
- `review/proai-cube-materials-lighting-r1-dark-side.png`
- `review/proai-cube-materials-lighting-r1-moving-highlight-large-angle.png`
- `review/proai-cube-materials-lighting-r1-paired-state.png`
- `review/proai-cube-materials-lighting-r1-slice-state.png`
- `review/proai-cube-materials-lighting-r1-review-27s.mp4` (primary)
- `QA.json`

## Gate

Automated acceptance: **PASS**. Semantic Display remains blocked pending owner visual approval of this Materials + Lighting pass.
