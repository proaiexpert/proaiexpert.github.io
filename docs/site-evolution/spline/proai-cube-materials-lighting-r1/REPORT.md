# ProAI Rubik Cube — Materials + Lighting R1

## Scope

Look-development pass built from owner-approved Presentation Motion R1.2 commit `89965750e4456a6e2d54d8309809471f8dbfcc75`. Geometry R1 and all motion/mechanical/interaction logic are frozen.

## Final PBR material hierarchy

- Graphite face: color **#171b20**, metalness **0.9**, roughness **0.245**, clearcoat **0.22**, clearcoat roughness **0.17**, env intensity **1.34**.
- Gunmetal face: color **#20262d**, metalness **0.88**, roughness **0.205**, clearcoat **0.28**, clearcoat roughness **0.14**, env intensity **1.42**.
- Black-chrome face: color **#0d1014**, metalness **0.96**, roughness **0.165**, clearcoat **0.2**, clearcoat roughness **0.12**, env intensity **1.52**.
- Smoked core: color **#07090b**, metalness **0.62**, roughness **0.385**, clearcoat **0.08**, clearcoat roughness **0.25**, env intensity **0.72**.

Material assignment counts: graphite 48, gunmetal 48, black-chrome 84, core 30.

## Lighting / reflections

- Environment: **procedural PMREM studio reflection cards**, 4 broad cards, PMREM sigma 0.055, external textures 0.
- Key: **RectAreaLight**, intensity 8.6, size 14.40 × 9.68, position [9.00, 7.43, 9.53].
- Fill: **RectAreaLight**, intensity 2.65, size 12.83 × 11.52, position [-8.48, 0.94, 6.70].
- Rim: **RectAreaLight**, intensity 6.9, size 5.50 × 14.40, position [-6.18, 6.49, -10.05].
- Hemisphere fill: intensity 0.34, sky #78818c, ground #080a0d.
- Tone mapping: **ACESFilmicToneMapping**; exposure **0.96**; output **SRGBColorSpace**.
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
- Software-CI render benchmark: 3.14 ms/frame at 960×960 (diagnostic only).
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
