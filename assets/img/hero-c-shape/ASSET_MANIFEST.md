# C-Shape Hero Asset Manifest

Status: `OWNER REVIEW — GROUNDING CORRECTION`

The authoritative Core geometry and all visible grounded-scene pixels in this directory are derived only from the exact approved STATIC MASTER. No AI generation, generative fill, geometry reconstruction, material repainting, or alternate Hero source is used.

## Immutable geometry reference

- source filename: `C83206F2-E0BA-4F5D-B25E-560272E03FCD.jpeg`
- dimensions: `1536 × 864`
- file size: `290,734 bytes`
- SHA-256: `8d2576338c54f49660bd6e15f9b1864013016367e4f0c438c4ae7e8389a5423a`
- role: protects the selected open C-shape geometry and flow concept from drift

## Authoritative STATIC MASTER

- source filename: `FA5872D6-EA1E-4865-A94B-74CE5CFDB7F8.jpeg`
- Drive file ID: `1OVJeRZI23IuMN5Toggcq5rOpqdh1ypsO`
- dimensions: `1536 × 1024`
- file size: `334,949 bytes`
- SHA-256: `c2cecdc255eb3c0d68de142dcbddba6e8cedf1f3f036b9f9ec62c562ef66d9e4`
- role: authoritative source for browser composition, C-shape material, light, signal, floor, contact shadow, reflection and local atmosphere

The source bytes were re-fetched from the canonical Drive folder and re-verified before this correction pass.

## Grounded desktop scene — primary browser visual

### `scene-grounded-static-master.avif`

- source crop: `x=640..1536`, `y=100..940` (`896 × 840`)
- browser output dimensions: `720 × 675`
- processing:
  1. deterministic crop from the exact STATIC MASTER;
  2. alpha-only environmental falloff; RGB content is not repainted;
  3. deterministic Lanczos resize from `896 × 840` to `720 × 675`.
- alpha mask before resize:
  - left edge smoothstep feather: `80 px`
  - top edge smoothstep feather: `50 px`
  - right edge smoothstep feather: `35 px`
  - floor/bottom falloff: full through crop `y=700`, smooth fade to transparent at crop `y=840`
- encoder: Pillow AVIF `quality=40`, `speed=6`
- file size: `13,042 bytes`
- SHA-256: `389e89f04751402f2d155dbfb4965c6b53b9a79596fc2d65784a3427e7a620f9`

The wider soft feather replaces the first grounding-pass edge treatment after visual QA found a faint black-level plate boundary. Desktop intentionally keeps the STATIC MASTER's original object + floor + contact shadow + reflection + cyan spill + semantic rail in one coherent source scene.

## Grounded mobile / short-landscape scene

The mobile crop excludes the baked desktop rail labels so readable HTML rail labels can be recomposed beside/below the object at small viewports while preserving the object, contact area and floor as one scene.

### `scene-grounded-static-master-mobile.avif`

- source crop: `x=640..1365`, `y=100..960` (`725 × 860`)
- browser output dimensions: `420 × 498`
- processing:
  1. deterministic crop from the exact STATIC MASTER;
  2. alpha-only environmental falloff; RGB content is not repainted;
  3. deterministic Lanczos resize from `725 × 860` to `420 × 498`.
- alpha mask before resize:
  - left edge smoothstep feather: `80 px`
  - top edge smoothstep feather: `50 px`
  - right edge safety feather: `8 px`
  - floor/bottom falloff: full through crop `y=720`, smooth fade to transparent at crop `y=860`
- encoder: Pillow AVIF `quality=38`, `speed=6`
- file size: `5,824 bytes`
- SHA-256: `4770ce77777bbd4113673fd30fe2ab70bce74bb92d128ccaa0ef104b19307e0c`

## Previous isolated Core — retained for audit/history, no longer the primary visual solution

### `core-static-master-isolated.webp`

- dimensions: `900 × 760`
- file size: `64,940 bytes`
- SHA-256: `cd97f2e0107ddb577ae1cdded84cfbcc91c66b4f42374d1f2f510b3c807ad2f2`

### `core-static-master-isolated.avif`

- dimensions: `900 × 760`
- file size: `48,100 bytes`
- SHA-256: `c6cc0ba89b7145bdbd796b7fd778e6c788133d3e278265947b7ce90793e458d8`

These tight-isolation files remain valid approved-pixel audit derivatives, but owner visual review found that using them as the complete scene removed too much floor/contact/reflection context and created a floating cutout reading. They are therefore not used as the primary rendered scene in the grounding-correction prototype.

## Compositing rule

The correction prioritizes art-direction fidelity over layer purity:

1. Desktop uses the wide grounded master crop as one scene plate, preserving the original physical relationship among Core, floor, contact shadow, reflection, cyan spill, and approved semantic rail.
2. Mobile and 844×390 use the rail-free grounded mobile crop, then render the same four semantic labels as HTML at readable size.
3. Object rotation / tilt-card behavior is removed. The grounded scene does not detach from its floor or reflection.
4. Motion is limited to scene reveal plus a tiny source-pixel-only internal luminance breathing overlay clipped from the same scene asset.
5. No generated replacement image is permitted.
