# PROAI LOGO R3 — CANONICAL CUBE IDENTITY — OWNER REVIEW

## Decision

Logo R1 and Logo R2 symbol inventions remain rejected. R3 uses the existing approved ProAI Cube directly as the brand object.

The previous R3 composition was also corrected after checking the live production site. The real current ProAI logo language is not a stacked `ProAI / Expert` wordmark. Production uses a single-line heavy `PROAI EXPERT` lockup with a small rotating wireframe cube at left.

R3 therefore preserves the actual production wordmark language and changes only the object under review:

`legacy CSS wireframe cube` → `existing canonical premium ProAI 3D Cube`.

No new symbol is invented.

## Live production logo reference

Verified before this correction against `https://proai-expert.com/` and production baseline `c945084e1952c05c686494091f7dbca0f7acdf08`.

Production source:
- `_includes/header-system/header.html`
- `assets/css/header-system-v1.css`

Current production wordmark contract:
- single line: `PROAI EXPERT`;
- Inter/system sans stack;
- weight `900`;
- desktop size `20px`;
- letter spacing `-1px`;
- uppercase;
- `PROAI` white;
- `EXPERT` cyan `#5de2ff`;
- mark-to-wordmark gap `12px`.

The production Header currently adds cyan text glow. The R3 large-form premium review preserves the cyan hierarchy but does not amplify/reproduce the glow, because the R3 brief explicitly rejects neon/glowing-letter treatment.

## Identity architecture

**ONE OBJECT · MULTIPLE BRAND STATES.**

R3 reviews only:
1. static premium signature;
2. living digital signature.

Header/favicons/16px/28px/vector reduction/light-background production adaptation remain deferred.

## Canonical Cube provenance

- Source branch: `agent/proai-cube-semantic-brand-face-r4`
- Canonical product consumed: R4.1 SHA `d4902a151b5f4cc98032c956e3d9e1d0fca94827`
- Active R4 branch HEAD inspected: `0c9cafc0d7a29879a257f11cd26a0db77bb187e6`
- Physical base GLB: `docs/site-evolution/spline/proai-cube-semantic-brand-moment-r2/rubik_39_s_cube_animation.glb`
- Frozen R4.1 review GLB: `docs/site-evolution/spline/proai-cube-semantic-brand-face-r4/review-dist/assets/rubik_39_s_cube_animation-DvywXmYB.glb`
- GLB Git blob: `7992019d85304c16244d0ca55a8cf15c13c26190`
- GLB byte count: `279412`
- GLB SHA-256: `dbb7fc4156f8c9ed2481dd76443dffb9a45ecb5493463f99bffb34dd3b59c79b`
- Base Three.js implementation: `docs/site-evolution/spline/proai-cube-semantic-brand-moment-r2/main.js`
- R4 preparation: `docs/site-evolution/spline/proai-cube-semantic-brand-face-r4/prepare-r4.mjs`
- Exact compiled frozen R4.1 runtime consumed by Logo R3: `docs/site-evolution/spline/proai-cube-semantic-brand-face-r4/review-dist/assets/index-vldOIrE-.js`
- Current R4.2 semantic optical patch inspected but intentionally not consumed: `docs/site-evolution/spline/proai-cube-semantic-brand-face-r4/material-polish-r4.mjs`

The review folder copies the canonical GLB and compiled runtime byte-for-byte by their existing Git blob SHAs. No substitute model, redraw, SVG approximation or invented mark geometry is present.

## Physical Cube state retained

The source retains the established monochrome 3×3 structure and precision face/core replacement geometry. Geometry includes face outer size `196.8`, face corner radius `10.6`, bevel size `2.35`, bevel thickness `1.25`, and core size `198.0` / radius `9.2`.

The established `premiumHybrid` lookdev remains the source of truth: Graphite `#242a31`, Gunmetal `#2b323a`, Black Chrome `#181d23`, Smoked Core `#0c0f13`, ACES Filmic tone mapping, SRGB output, procedural studio reflection cards, no postprocessing bloom.

Semantic reveal is cleared for Logo R3 identity review and remains upstream in the Cube stream.

## Canonical static home orientation

The static portrait locks the exact natural 3/4 pose selected by the frozen R4.1 owner-evidence workflow:
- presentation time `7.0s`;
- face `-X`;
- visibility dot `0.8157899686`;
- yaw `105.2783115°`;
- pitch `-1.3348996°`;
- roll `-1.2040612°`;
- source camera `31°` perspective;
- camera fit direction `[1.18, 0.86, 1.33]`.

This is the canonical resting portrait, not a random paused frame.

## Corrected static identity

The static state stops slice scheduling, clears semantic reveal, places the exact Cube at the locked home pose and renders it completely still.

The lockup now uses the actual production wordmark hierarchy: one-line `PROAI EXPERT`, Inter 900, compact uppercase proportions, white `PROAI`, cyan `EXPERT`. The canonical 3D Cube is allowed to be materially larger than the current tiny Header mark because micro reduction is explicitly deferred.

## Corrected living digital identity

The living state uses the same exact Cube, runtime, camera, materials and home pose. Slice motion is disabled. The R4.1 presentation path runs at `0.10×` time: typical yaw about `0.7–1.2°/s`, short inspection portions up to roughly `3°/s`, effective cycle about `680s / 11m20s`.

It starts from the exact static home orientation. The viewer sees the same identity object becoming alive, not a separate motion logo.

## Review applications

- `owner-review.html` — single-direction owner board;
- `static-signature.html?capture` — large static signature;
- `static-lockup.html?capture` — practical horizontal lockup;
- `business-card.html?capture` — dark identity-only business-card test;
- `social-square.html?capture` — square/social test;
- `living-digital.html?capture` — living digital signature;
- `site-wordmark-test.html` — current production wordmark reference;
- `SITE_LOGO_REFERENCE.md` — live-site/source verification notes.

## Scope safety

All Logo R3 work remains isolated under `docs/site-evolution/brand/proai-logo-canonical-cube-r3/` on the Logo review branch. No production Header, Hero, Homepage, Cube runtime, Footer, favicon, manifest, production CSS/JS or `main` is modified.

**OWNER VISUAL REVIEW GATE — STOP.**
