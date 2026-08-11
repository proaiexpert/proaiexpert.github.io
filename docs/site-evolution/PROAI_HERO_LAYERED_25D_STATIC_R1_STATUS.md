# ProAI Expert Hero — Layered 2.5D Static R1 — Status

Date: 2026-08-10  
Working branch: `agent/hero-layered-25d-static-r1`  
Status: **PENDING OWNER REVIEW**

## Canonical recovery source

- Frozen recovered composition branch: `agent/hero-recovery-approved-composition-owner-look`
- Recovery handoff commit: `3067fa02631de98d98d9b6bc8a1d0ea880ad5a41`
- Underlying recovered visual checkpoint: `8bab1bbddbaadf70d88fd72c77e08d2d0ac77429`
- Recovery workflow run: `31351101048`
- Recovery artifact: `PROAI_HERO_RECOVERY_OWNER_REVIEW / R46_DESKTOP_STATIC.png`
- Recovery PNG SHA-256: `98529b39fb4e951638379431f1a746b1a3d89e6b6d69e10ff2f1b53e8e80f315`

## R1 owner-review result

- Candidate: `docs/site-evolution/review-artifacts/PROAI_HERO_LAYERED_25D_STATIC_R1.png`
- Candidate commit SHA: `e3dd5f36b61a5f9fb90a0842a9a7c0f15efa3c4e`
- Candidate PNG SHA-256: `28d1885ff2350562434e5a4bf50cbc787a7ffee5e29635780cf2ce96560ff622`
- Dimensions: `1440 × 900`
- Core scale: `95.5%` of recovered registration (`4.5%` linear reduction)
- Preview route: `/hero-layered-25d-static-preview/`
- Deterministic generator: `tools/hero_layered_25d_static_r1.py`
- Neutral WebGL2 compositor: `assets/js/hero-layered-25d-r1.js`
- Isolated preview CSS: `assets/css/hero-layered-25d-r1.css`

## Registered scene assets

- `assets/hero-layered-25d-r1/rear_atmosphere.png`
- `assets/hero-layered-25d-r1/rear_body_graphite.png`
- `assets/hero-layered-25d-r1/internal_chamber_depth.png`
- `assets/hero-layered-25d-r1/internal_cyan_volume.png`
- `assets/hero-layered-25d-r1/collector_emitter_zone.png`
- `assets/hero-layered-25d-r1/front_metal_shell.png`
- `assets/hero-layered-25d-r1/foreground_occlusion_mask.png`
- `assets/hero-layered-25d-r1/contact_shadow_floor_response.png`
- `assets/hero-layered-25d-r1/external_output_impulses.png`
- `assets/hero-layered-25d-r1/rail_ui.png`
- `assets/hero-layered-25d-r1/depth_map.png`
- QA: `assets/hero-layered-25d-r1/qa.json`
- Manifest/hashes: `assets/hero-layered-25d-r1/manifest.json`

## Method / QA summary

- The approved C-shape geometry/perspective/silhouette and two-column Hero concept were not redesigned.
- Header and complete left H1/copy/CTA field are pixel-locked to the recovered `1440 × 900` source frame.
- Material separation uses explicit registered spatial masks; no luminance/content-alpha material reconstruction is used.
- External impulses are rendered below the explicit `front_metal_shell`; the retained foreground occlusion mask prevents traces from reading as lines painted across solid metal.
- Internal chamber, cyan volume, collector/emitter and front shell are separate registered depth layers; depth support is retained in `depth_map.png`.
- Rail is one calm four-row system at fixed `70 px` pitch: `01 TRUST / 02 INQUIRY / 03 RESPONSE / 04 RESULT`.
- One owner-review R1 PNG only: PASS.
- Candidate dimensions `1440 × 900`: PASS.
- Header pixel-lock: PASS.
- Left H1/copy/CTA pixel-lock: PASS.
- Output-to-row registration: PASS.
- Static-only implementation: PASS; no animation loop, pointer/touch motion, parallax, tilt, particles or motion timeline.
- Deterministic full-frame and enlarged-crop visual preflight was performed before repository execution; automated GitHub QA passed. Final visual approval remains exclusively with the owner.

## Production safety

- `/index.html` blob at R1 execution: `3d44bd2f6f0f09bf9c45ba661ccffd2ac6183aa4`
- `/ru/index.html` blob at R1 execution: `4d703c149b626dab3a3db13b3566c9d0cb28d374`
- Production Homepage routes were not modified by this R1 pass.
- No merge performed.
- No deploy performed.
- No production PR opened.
- Motion not started.

**PENDING OWNER REVIEW**
