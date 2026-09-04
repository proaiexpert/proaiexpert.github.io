# Boxes Hover — Optical Material / Lighting Strategy R2

OWNER SUMMARY — RU

Дата: 2026-09-04.

Статус: **LIMITED OPTICAL PASS**.

R2 доказал безопасный source-level рецепт, который сохраняет Golden-плотность и native Boxes Hover interaction лучше, чем Black Chrome R1. При этом полноценный нейтральный Black / Chrome gate не закрыт: видимый объект `Light` в Golden содержит исходный розово-сине-бирюзовый градиент. Его изменение не входит в разрешённый R2 material budget, поэтому этот цветовой остаток намеренно не маскировался.

## Authority and safety

- Ветка: `agent/proai-boxes-hover-optical-material-r2`
- Start HEAD: `fdc2c5f146f9dbccd53793c016731d17b8d5d180`
- Product / Hero authority: `agent/proai-ai-systems-hero-clean-transplant-r1` / `38ecb13e1a0d6b5814748d7741ba99ef58197e6b`
- Forensic authority: `4da8b751f5e46efdd7a30756fdf3b409625d2512`
- Runtime: `@splinetool/runtime@2.0.27`, official standalone WebGPU runtime
- Golden payload: `46,215` bytes / `c3bcabd43c232045b059704e8d4be57634314b7da2fcfa5ebbd448ee40a16798`
- Golden payload modified: **NO**
- Runtime material mutation: **NO**
- Re-encode of Golden itself: **NO**; candidates are independent Packr copies

## Phase A — optical decomposition

| Source | Current Golden value | Visual role | Safe to test | Risk |
|---|---|---|---|---|
| Cube Material / pattern | `#FFFFFF / #000000`, style `3`, size `0.05`, rotation `90` | Main structural luminance separation of the box field | `colorA/colorB` only | Too-dark pair collapses box density |
| Cube Material / physical | metalness `0.14`, roughness `0.35`, reflectivity `0.33` | Surface response and highlight character | Yes, after contrast floor | Higher metal/reflectivity darkens the field |
| Cube Material / transmission | thickness `1`, IOR `1.5`, roughness `2.7` | Depth / transmitted edge response | Conditional | Changing it before contrast is understood can remove readable edges |
| Directional Light | white `#FFFFFF`, intensity `0.7`, shadows on, resolution `1024`, radius `1` | Neutral direct light and shadow definition | Conditional | Changing intensity affects every surface and shadow |
| Scene ambient | enabled, neutral `#D3D3D3`, intensity `0.75` | Base fill | Conditional | More fill can flatten the black/chrome read |
| Scene sky/environment | sky disabled; HDRI image `null`; lighting config present but inactive | No active HDRI/environment contribution in serialized Golden | Not changed | Enabling/tuning it would be a larger scene-look change |
| Visible `Light` mesh | `Light Material` gradient: pink / blue / teal source colors | Existing colored optical accent visible in the donor | **Not changed in R2** | Removing it needs a broader material/source budget |
| Postprocessing | scene config bloom intensity `0.871`, postprocessing disabled | No active bloom look in the serialized scene | Not changed | Enabling it risks neon/glow language |

The serialized scene has two page records. The render page is `root.scene.objects.0`; the second record is the UI scene. No camera, transforms, geometry, events, hover settings, or hierarchy values were edited.

## Pattern contrast floor

Fresh-boot tests used the official runtime and identical pointer positions. Physical, transmission, lights, camera and geometry stayed Golden.

| Variant | `colorA / colorB` | Physical | Finding |
|---|---|---|---|
| Golden control | `#FFFFFF / #000000` | Golden `.14 / .35 / .33` | Full reference read |
| Silver | `#C9CDD1 / #020304` | Golden `.14 / .35 / .33` | Lowest tested level that preserves the recognizable dense center-hover topology |
| Muted Silver | `#8C949D / #020304` | Golden `.14 / .35 / .33` | Structural read survives only weakly; visible field and rear contours lose separation |
| Graphite-Light | `#5A626B / #020304` | Golden `.14 / .35 / .33` | Below practical floor; field becomes too close to dark-on-dark |

Practical floor: `colorA` must remain approximately Silver-level (`#C9CDD1`, sRGB luminance about `0.80`) when `colorB` is Obsidian. The exact threshold is scene/runtime dependent; the visual evidence, not theoretical luminance alone, is the acceptance basis.

## Physical response tests

Silver/Obsidian was fixed, then physical values were tested independently:

| Variant | metalness / roughness / reflectivity | Finding |
|---|---|---|
| Silver Soft Chrome | `.58 / .30 / .42` | More metal character, but box faces and rear field become too dark |
| Silver Neutral Metal | `.68 / .27 / .46` | Further density loss; not selected |
| Silver Chrome | `.76 / .24 / .52` | Repeats the R1 failure pattern: sparse contours / large isolated boxes |

The selected recipe therefore keeps Golden physical values. This is intentional: the pattern change supplies the neutral material family while Golden physical response is the only tested response that protects the donor read.

## Transmission and lighting diagnostics

Transmission stayed exactly Golden (`thickness=1`, `ior=1.5`, `roughness=2.7`). No transmission test was promoted because the pattern + Golden physical combination already provided the best structural result.

Lighting/environment values stayed exactly Golden. The Directional Light is already neutral white and the ambient is neutral gray; the visible non-neutral color is in the existing `Light Material` gradient, not a serialized light color field. No new light, light movement, CSS glow, environment, or postprocessing was added.

## Final R2 recipe

- Pattern `colorA`: `#C9CDD1` / `{r:0.788235294117647,g:0.803921568627451,b:0.8196078431372549,a:1}`
- Pattern `colorB`: `#020304` / `{r:0.00784313725490196,g:0.011764705882352941,b:0.01568627450980392,a:1}`
- Physical metalness: `0.14`
- Physical roughness: `0.35`
- Physical reflectivity: `0.33`
- Transmission: unchanged `1 / 1.5 / 2.7`
- Lights/environment: unchanged
- Final payload: `final/boxes-hover-optical-material-r2-final.bin`
- Final payload size / SHA-256: `46,263` / `9d97237a463dd2846bbf1ad7eb2594409d34a08bd1a2ff20ce08b330af201535`

## Semantic diff gate

Re-decoding and re-encoding were run for every candidate. The selected candidate has only the allowed material paths and `0` unrelated changes. At leaf level 6 values changed: RGB channels for each of the two pattern colors; alpha, all three physical values, transmission and every other field remained equal to Golden.

```text
root.scene.objects.0.children.2.children.0.children.0.data.material.layers.1.data.colorA.{r,g,b}
root.scene.objects.0.children.2.children.0.children.0.data.material.layers.1.data.colorB.{r,g,b}
```

The three physical leaves remain equal to Golden. The effective changed fields are the two pattern colors; no unrelated semantic mutation was observed. Round-trip disallowed changes: `0`.

## Runtime invariants and QA

System Google Chrome `152.0.7977.64`, WebGPU enabled, viewport `1440×900`, official runtime, fresh payload boot per mode.

- Golden boot: **PASS**
- R2 boot and SHA verification: **PASS**
- Runtime Boxes object: same UUID `006474fe-4e5b-4835-b106-89b2ec79dd71`
- Cube meshes: `143` / **PASS**
- Runtime material identities: `143` / **PASS**
- Native layer signature: `transmission → pattern → light` / **PASS**
- Hierarchy / geometry / camera / events / hover values: unchanged by source diff / **PASS**
- Rest: **PASS relative to Golden; inherently low-contrast in donor**
- Center hover: **PASS relative to Golden; density preserved with Silver**
- Edge hover: **PASS relative to Golden; no interaction mutation**
- Pointer leave / settling: **PASS**
- 390px sanity: no horizontal overflow, runtime boot **PASS**
- 320px sanity: no horizontal overflow, runtime boot **PASS**
- Console: no fatal error in final run. Earlier fresh boots reproduced the known WebGPU `ShadowDepthTexture` destroyed-texture warning; it is recorded, not hidden.

## Preview and evidence

Safe staging contains only the preview, selected payloads and official runtime. The server is bound to `0.0.0.0` on port `4177`.

- Local preview: http://127.0.0.1:4177/owner-preview/boxes-hover-optical-material-r2.html?mode=r2
- LAN preview: http://10.0.0.204:4177/owner-preview/boxes-hover-optical-material-r2.html?mode=r2
- Server running: **YES**
- Local verification: HTTP `200`
- LAN verification from the same machine: HTTP `200`; regular HTTP-by-IP Chrome context is insecure (`isSecureContext=false`, `navigator.gpu=false`), so live WebGPU runtime is verified on localhost only. The LAN URL is useful for route/access verification, but needs a trusted HTTPS/local secure-origin setup for live WebGPU.
- Owner composite: `owner-composite.png` (Golden Rest | R2 Rest / Golden Center Hover | R2 Center Hover)

Curated frames are under `runtime-qa/`:

- `golden-true-rest.png`, `r2-final-rest.png`
- `golden-center-hover.png`, `r2-final-center-hover.png`
- `golden-edge-hover.png`, `r2-final-edge-hover.png`
- `golden-settled.png`, `r2-final-settled.png`

## Final decision

What was learned: the donor’s recognizable density is controlled primarily by pattern luminance separation. Silver/Obsidian is the practical floor tested without damaging structure; aggressive metal/reflectivity tuning cannot replace that contrast.

What problem was removed: uncertainty about whether a neutral source-level pattern candidate could be encoded, re-decoded, and loaded through the exact runtime without changing donor structure or interaction.

What remains: the Golden `Light Material` carries inherited pink/blue/teal gradient colors. Removing that color would require a separately authorized source/material-light strategy; it was not smuggled into this controlled R2 budget.

Safe next step: Owner reviews the single R2 candidate and composite. Do not start Champagne/Violet, do not modify Hero, and do not expand the material budget until Owner approval.
