# ProAI Expert Hero R4 — Integrated Scene Asset Manifest

Date: 2026-08-08
Status: `OWNER REVIEW — R4 INTEGRATED CINEMATIC SCENE`

## Authoritative source

The R4 scene is derived deterministically from the locked STATIC MASTER only. No generative fill, Core regeneration, alternate object, geometry repaint, or AI-generated replacement was used.

- source: `FA5872D6-EA1E-4865-A94B-74CE5CFDB7F8.jpeg`
- Google Drive file ID: `1OVJeRZI23IuMN5Toggcq5rOpqdh1ypsO`
- source dimensions: `1536 × 1024`
- source size: `334,949 bytes`
- source SHA-256: `c2cecdc255eb3c0d68de142dcbddba6e8cedf1f3f036b9f9ec62c562ef66d9e4`

The canonical Drive bytes were re-fetched and re-verified before R4 derivation.

The historical original geometry reference `C83206F2-E0BA-4F5D-B25E-560272E03FCD.jpeg` was not independently recoverable from the accessible canonical Drive folder during this pass. R4 therefore preserves geometry from the verified STATIC MASTER / R2 lineage and does not claim a fresh independent verification of that historical file.

## R4 deterministic scene derivation

The visual is no longer built as `isolated Core + separate page background`.

R4 uses a wide, source-registered integrated scene containing the approved C-shape, physical floor/contact, reflection, cyan spill, and surrounding environmental darkness from the same source image.

Sharp scene crop used for the approved object and its physical floor:

- source coordinates: `x=670..1360`, `y=120..980`
- source crop: `690 × 860`
- intentionally excludes baked left Hero copy and baked right semantic labels from the STATIC MASTER
- preserves the full recognizable C-shape, internal tunnel, contact zone, floor reflection, and cyan signal field

Desktop ambient field:

- broader source-derived environment sampled from approximately `x=470..1530`, `y=100..1000`
- source pixels only
- deterministic blur / luminance reduction / broad atmospheric feathering
- no object-shaped alpha tracing
- no hard rectangular plate

Mobile ambient field:

- uses the same sharp approved crop with a portrait-specific source-derived ambient field
- no scaled-down desktop two-column plate
- preserves the full C-shape identity and physical floor at large portrait scale

## Browser scene assets

### Desktop AVIF

Decoded browser asset: `scene-r4-integrated-desktop.avif`

- dimensions: `1160 × 900`
- encoder: Pillow AVIF, `quality=82`, `speed=5`
- decoded file size: `54,784 bytes`
- SHA-256: `6f26515df1eccdc47f4f5c545deac77a3bccb7c5e4528214befd2c65e717e75d`

### Desktop WebP fallback

Decoded browser asset: `scene-r4-integrated-desktop.webp`

- dimensions: `1160 × 900`
- encoder: Pillow WebP, `quality=94`, `method=6`
- decoded file size: `85,540 bytes`
- SHA-256: `d87d11574fe92ebbd7ff49c801b999530df38a04e13c8e5a82ace7aa58cee241`

### Mobile AVIF

Decoded browser asset: `scene-r4-integrated-mobile.avif`

- dimensions: `820 × 860`
- encoder: Pillow AVIF, `quality=82`, `speed=5`
- decoded file size: `55,263 bytes`
- SHA-256: `5635602861a654cdf1208d219dae4fc7ed7ab0de6a841e83e7fadb286d4b5462`

### Mobile WebP fallback

Decoded browser asset: `scene-r4-integrated-mobile.webp`

- dimensions: `820 × 860`
- encoder: Pillow WebP, `quality=94`, `method=6`
- decoded file size: `85,028 bytes`
- SHA-256: `503806e42279fbb7b71313e04708dcd291bbf3d9f033f591ea38224cbea3a1a0`

## Repository packaging

For this isolated owner-review branch, the exact encoded AVIF/WebP bytes are stored as Base64 text includes under:

`_includes/hero-c-shape-r4/`

Jekyll assembles them into `data:` URLs through `_includes/hero-c-shape-r4/scene-r4-picture.html`. The browser therefore decodes the exact AVIF/WebP assets listed above; the Base64 files are transport packaging, not separate visual tiles and do not introduce seams.

This mirrors the proven R2 review-branch packaging pattern while avoiding production-route changes.

## Motion separation rule

The scene raster is physically stable. Motion is browser overlay only:

- one restrained cyan signal pulse;
- subtle inner luminance breathing;
- synchronized local floor/haze response;
- sequential HTML rail activation;
- restrained CTA hover/focus response.

There is no Core rotation, bobbing, pointer tilt, object parallax, or independent movement between Core and floor.
