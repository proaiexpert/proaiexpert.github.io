# C-Shape Hero Asset Manifest

Status: `OWNER REVIEW — GROUNDING POLISH R2`

R2 fixes the owner-reported image-plate effect, desktop RU rail localization defect, and loss of premium Core fidelity without changing the locked C-shape concept, copy, Header System, or production routes.

No AI generation, generative fill, geometry reconstruction, material repainting, or alternate Hero source is used.

## Authoritative STATIC MASTER

- source filename: `FA5872D6-EA1E-4865-A94B-74CE5CFDB7F8.jpeg`
- Drive file ID: `1OVJeRZI23IuMN5Toggcq5rOpqdh1ypsO`
- dimensions: `1536 × 1024`
- file size: `334,949 bytes`
- SHA-256: `c2cecdc255eb3c0d68de142dcbddba6e8cedf1f3f036b9f9ec62c562ef66d9e4`

The source bytes were re-fetched from the canonical Drive folder immediately before R2 processing and re-verified against the locked byte size, dimensions and SHA-256.

## R2 compositing architecture

The browser scene uses two source-registered layers from the exact same STATIC MASTER coordinate system.

### Layer A — grounded environment

New environment crop:

- source crop: `x=640..1375`, `y=120..900`
- source/output dimensions: `735 × 780`
- purpose: floor, contact shadow, reflection, cyan floor spill, local black-level/light falloff and atmosphere
- baked Header, left copy/CTA/accountability and baked right semantic labels are outside the visible/final alpha field
- no visible RGB repainting is performed

The environment alpha is deliberately non-rectangular:

- broad elliptical scene field centered around the Core;
- separate floor/reflection ellipse preserving the contact zone;
- multi-axis edge falloff;
- alpha-only removal of the Core footprint so the sharp Core overlay owns high-frequency object detail;
- invisible RGB is zeroed only where final alpha is effectively zero (`alpha < 3/255`) to improve lossless transparency compression; this does not alter visible scene pixels.

Environment alpha does not trace the scene as one rectangular plate and does not create an object-shaped sticker boundary.

### Layer B — high-fidelity Core overlay

R2 reuses the existing verified high-fidelity deterministic Core derivatives because they already come directly from the same exact STATIC MASTER:

Source crop represented by the Core derivatives:

- `x=600..1500`
- `y=120..880`
- dimensions: `900 × 760`

The Core layer is mapped back into the same source-coordinate canvas as Layer A:

- environment crop starts at source `x=640`, therefore its visible viewport begins `40 source px` inside the 900 px Core coordinate system;
- both layers use identical source-pixel scale;
- no independent scale, rotation, motion, parallax or transform is applied;
- the registered canvas is static.

### Visible R2 scene coordinate mapping

The browser viewport represents source:

- `x=640..1375`
- `y=120..900`
- dimensions `735 × 780`

Inside that viewport:

- environment plate is `735 × 780`;
- Core derivative remains `900 × 760`, positioned by exact source-coordinate offset (`x=-40`, `y=0`) through a shared registration canvas;
- the complete approved Core silhouette remains inside the visible viewport;
- baked semantic label text remains outside the raster.

This lets EN and RU use real localized HTML rail labels while preserving original Core pixels and physical grounding.

## R2 browser assets

### New grounded environment — AVIF

`scene-r2-environment.avif`

- dimensions: `735 × 780`
- encoder: Pillow AVIF `quality=80`, `speed=6`
- file size: `13,594 bytes`
- SHA-256: `d33c64906bb89551204fa6044d478da403fd2b58c76e2e4b2b695abda7fee608`

The environment asset is small because the high-frequency Core is transparent in Layer A and is supplied separately by Layer B. Total AVIF visual stack is `61,694 bytes`, not a 13 KB single-raster Hero.

### New grounded environment — WebP fallback

`scene-r2-environment.webp`

- dimensions: `735 × 780`
- encoder: Pillow WebP `quality=95`, `method=6`, `exact=True`
- file size: `39,016 bytes`
- SHA-256: `6d67c5bba38da94284b19791255d2ead60d3c6a21d6b7023134e8e637747413d`

Total WebP visual stack is `103,956 bytes`.

### High-fidelity Core — AVIF

`core-static-master-isolated.avif`

- dimensions: `900 × 760`
- encoder: Pillow AVIF `quality=78`, `speed=6`
- file size: `48,100 bytes`
- SHA-256: `c6cc0ba89b7145bdbd796b7fd778e6c788133d3e278265947b7ce90793e458d8`

### High-fidelity Core — WebP fallback

`core-static-master-isolated.webp`

- dimensions: `900 × 760`
- encoder: Pillow WebP `quality=92`, `method=6`, `exact=True`
- file size: `64,940 bytes`
- SHA-256: `cd97f2e0107ddb577ae1cdded84cfbcc91c66b4f42374d1f2f510b3c807ad2f2`

These Core files were previously verified deterministic approved-pixel derivatives. R2 changes their role: they are no longer a standalone pasted visual; they are the sharp registered foreground over the grounded environment layer.

## Repository packaging for the grounded environment

For this isolated OWNER REVIEW branch, the encoded Layer A environment bytes are stored as Base64 text chunks under:

`_includes/hero-c-shape-r2/`

This is a transport/packaging mechanism only. Jekyll concatenates the chunks with whitespace-controlled Liquid includes into one contiguous `data:` URI for each format:

- AVIF decoded asset: exactly `13,594 bytes`, `735 × 780`, SHA-256 `d33c64906bb89551204fa6044d478da403fd2b58c76e2e4b2b695abda7fee608`
- WebP decoded asset: exactly `39,016 bytes`, `735 × 780`, SHA-256 `6d67c5bba38da94284b19791255d2ead60d3c6a21d6b7023134e8e637747413d`

The browser therefore renders **one monolithic environment raster**, not visual image tiles. Chunk boundaries do not correspond to image rows, pixels, masks, or scene geometry and cannot create visual seams.

The include structure is:

- `_includes/hero-c-shape-r2/environment-r2.html`
- `_includes/hero-c-shape-r2/env-avif-01.b64` … `env-avif-03.b64`
- `_includes/hero-c-shape-r2/env-webp-01.b64` … `env-webp-05.b64`
- `_includes/hero-c-shape-r2/env-webp-06a.b64`
- `_includes/hero-c-shape-r2/env-webp-06b.b64`
- `_includes/hero-c-shape-r2/env-webp-07.b64`

AVIF remains the preferred browser source and WebP is the fallback. The high-fidelity Core remains normal repository image assets at the existing canonical paths.

## Responsive quality

R2 does not downscale the source stack into a 420 px mobile master.

The same high-resolution source-coordinate stack is used responsively:

- environment natural width: `735 px`;
- Core natural width: `900 px`;
- mobile visual CSS width remains well below those natural widths, providing sufficient source density for modern high-DPR phones;
- `<picture>` uses AVIF first with WebP fallback;
- intrinsic width/height attributes reserve the coordinate geometry and preserve CLS.

## Real semantic rail

No EN or RU semantic label text is baked into the R2 raster.

EN HTML rail:

- `01 TRUST / PRESENCE`
- `02 INQUIRY`
- `03 RESPONSE`
- `04 FOLLOW-UP`

RU HTML rail:

- `01 ДОВЕРИЕ / ПРИСУТСТВИЕ`
- `02 ОБРАЩЕНИЕ`
- `03 ОТВЕТ`
- `04 ДАЛЬНЕЙШАЯ СВЯЗЬ`

## Motion rule

The registered physical scene remains static:

- no Core rotation;
- no pointer tilt;
- no bobbing;
- no relative parallax;
- no independent movement or scale between Layer A and Layer B.

Only a short whole-scene opacity reveal remains. `prefers-reduced-motion` disables it.

## Previous R1 scene assets

`scene-grounded-static-master.avif` and `scene-grounded-static-master-mobile.avif` remain for audit/history but are not used by the R2 page.
