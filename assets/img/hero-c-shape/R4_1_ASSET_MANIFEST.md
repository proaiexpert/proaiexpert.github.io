# ProAI Expert Hero R4.1 — Premium Owner-Polish Asset / Scene Manifest

Date: 2026-08-08
Status: `OWNER REVIEW — R4.1 PREMIUM CORRECTION`

## Authoritative visual source

R4.1 preserves the locked C-shape source lineage. No Core regeneration, redraw, generative fill, geometry replacement, alternate AI object, or material repaint is used.

- source: `FA5872D6-EA1E-4865-A94B-74CE5CFDB7F8.jpeg`
- Google Drive file ID: `1OVJeRZI23IuMN5Toggcq5rOpqdh1ypsO`
- source dimensions: `1536 × 1024`
- source size: `334,949 bytes`
- source SHA-256: `c2cecdc255eb3c0d68de142dcbddba6e8cedf1f3f036b9f9ec62c562ef66d9e4`
- canonical Drive folder ID: `1wqHjUAfk2vOJcY013V0EX2LtK0aszPZS`

## R4.1 raster policy

R4.1 intentionally reuses the exact verified R4 integrated-scene AVIF payload already stored under `_includes/hero-c-shape-r4/` rather than introducing another compressed derivative during a targeted visual-polish pass.

Verified R4 decoded scene assets reused by R4.1:

### Desktop AVIF
- dimensions: `1160 × 900`
- file size: `54,784 bytes`
- SHA-256: `6f26515df1eccdc47f4f5c545deac77a3bccb7c5e4528214befd2c65e717e75d`

### Mobile AVIF
- dimensions: `820 × 860`
- file size: `55,263 bytes`
- SHA-256: `5635602861a654cdf1208d219dae4fc7ed7ab0de6a841e83e7fadb286d4b5462`

The browser payload remains the same high-fidelity integrated scene; R4.1 changes how it is optically integrated and how information motion is layered over/through it.

## R4.1 scene-integration correction

R4.1 applies preview-scoped, source-aware scene treatment:

- predominantly neutral near-black Hero field;
- restrained local cyan/teal atmosphere only around the Core;
- broad alpha feather on the scene raster so responsive crops dissolve into the page rather than form a blue/green rectangular plate;
- separate mobile feather geometry for portrait ratios;
- physical Core/floor registration remains fixed;
- reflection/contact/floor remain part of the same raster scene;
- `?debug=scene-edges` temporarily removes the feather and outlines the raw raster field for QA only.

No black rectangle is added behind the image and no object-shaped sticker mask is used.

## R4.1 signal / depth architecture

The rejected R4 `single path + moving dash` treatment is superseded.

R4.1 uses browser overlays only:

1. concentrated entry seed + short filament from the left;
2. low-opacity guide route;
3. soft halo trail;
4. sharper core filament;
5. concentrated moving head;
6. source-registered foreground occlusion using the same scene raster, so the signal briefly disappears behind physical C-shape structures;
7. local inner-tunnel and floor-response lighting;
8. output collector/spine;
9. four sequential distribution branches/nodes tied to the semantic rail.

The Core itself never rotates, bobs, tilts, scales, or moves relative to the floor.

## Header / production isolation

R4.1 continues to render the canonical shared Header DOM from:

- `_includes/header-system/header.html`
- `_data/header.yml`
- `_data/navigation.yml`
- `assets/css/header-system-v1.css`
- `assets/js/header-system-v1.js`

Header visual corrections are preview-scoped in the R4.1 Hero style include. Shared production Header source files are not modified.

Production `/` and `/ru/` remain outside the R4.1 edit scope.
