# ProAI Expert Hero R4.6 Corrective Static V2 — Status

Date: 2026-08-10
Working branch: `agent/hero-static-premium-integration-r1`
Status: **PENDING OWNER REVIEW**

## Sources

- Frozen recovered composition branch: `agent/hero-recovery-approved-composition-owner-look`
- Recovery handoff commit: `3067fa02631de98d98d9b6bc8a1d0ea880ad5a41`
- Underlying exact recovered visual checkpoint: `8bab1bbddbaadf70d88fd72c77e08d2d0ac77429`
- Recovery artifact run: `31351101048`
- Recovery artifact: `PROAI_HERO_RECOVERY_OWNER_REVIEW / R46_DESKTOP_STATIC.png`
- V1 comparison path: `docs/site-evolution/review-artifacts/PROAI_HERO_R46_CORRECTIVE_STATIC_V1.png`
- V1 candidate commit: `4e5dff089b1cf2c12b5bf84dc47105fb21135ca2`
- V1 PNG SHA-256: `3a1dfcd9514c9e7e99c461bab4b2f2a3489041217bae4619d898ae54e6691637`
- Final V2 deterministic render run: `31448994858`

## V2 result

- Exact output path: `docs/site-evolution/review-artifacts/PROAI_HERO_R46_CORRECTIVE_STATIC_V2.png`
- Result commit SHA: `779c6a99232e78423acf42f6aff5221b50dd0513`
- Image dimensions: `1440 × 900`
- PNG SHA-256: `1f10090ab9b43b970970a3f84a69e7d8752749509087718a518753564553bb6f`
- Generator/correction sources: `tools/hero_r46_corrective_static_v2_preview.mjs` + `tools/hero_r46_corrective_static_v2.py`

## Generation / correction method

- Re-rendered the frozen R4.6 browser compositor at the retained V1 `95.5%` Core linear scale (`4.5%` reduction).
- The Core was never isolated by luminance/content-alpha, regenerated, redrawn or rebuilt from screenshot brightness.
- Scaling occurred inside the existing source-registered back/base/glass/front compositor planes, so near-black graphite remains intentionally opaque and structurally continuous.
- Material refinement uses only restrained non-destructive browser grading and source-registered glass/chamber/specular/floor response.
- Legacy free-space curls are removed with thin colour-selective inpainting only after preserved collector segments; the upper-right metal face is explicitly excluded from cleanup.

## Metal opacity / integrity protection

- No luminance key, content-alpha object extraction or dark-pixel transparency is used in V2.
- Upper-right and lower-right graphite planes remain solid with clean silhouette/corners and no V1 worn/rubbed/eaten-away failure.
- Foreground front-shell pixels come from the recovered registered source plane and remain above the deeper cyan/glass volume.

## Collector / output occlusion

- Collector origin remains the existing source-faithful right-side internal chamber/collector region; no new machine, bus, rack or manifold is added.
- Internal cyan/chamber response is rendered behind the source-registered foreground metal plane, providing true visual occlusion.
- Source-faithful short collector segments inside the open aperture are retained before legacy curls are removed.
- External traces begin only at defined physical exits `x=[1312, 1232, 1240, 1262]` and travel only through free space to rail node `x=1320`.
- No new output trace is drawn over a solid exterior metal face.

## Rail

- Fixed rows: `y=[400, 470, 540, 610]`
- Vertical pitch: `70 px`
- Labels: `01 TRUST / 02 INQUIRY / 03 RESPONSE / 04 RESULT`
- One restrained node, number column and label column per row; no cards/dashboard/bus/curls.

## Independent visual QA

Visual QA was performed against both the recovered R4.6 frame and rejected/targeted-correction V1 using full-frame, Core/material/output and collector/output/rail comparisons.

- Same approved C-shape geometry and two-column architecture: PASS.
- V1 approximate 4.5% smaller Core balance retained: PASS.
- No worn/rubbed/eroded dark graphite: PASS.
- No ragged silhouette, alpha holes or false transparency: PASS.
- No new output line drawn over solid exterior metal: PASS.
- Cyan reads deeper inside the chamber and remains subordinate externally: PASS.
- Foreground metal visibly occludes deeper cyan/glass response: PASS.
- Collector → emission → short external output → rail relationship: PASS.
- Rail precision / 70 px rhythm / `04 RESULT`: PASS.
- Optical effects/contact response are softer and less graphic than V1: PASS.
- Header pixel-lock against exact recovery source: PASS.
- Entire left H1/copy/CTA/accountability block pixel-lock against exact recovery source: PASS.

## Safety

- Production `/index.html` and `/ru/index.html`: NOT MODIFIED.
- Preview concept/geometry: NOT REDESIGNED.
- Merge: NOT PERFORMED.
- Deploy: NOT PERFORMED.
- Production PR: NOT OPENED.
- Motion: NOT STARTED.

**PENDING OWNER REVIEW**
