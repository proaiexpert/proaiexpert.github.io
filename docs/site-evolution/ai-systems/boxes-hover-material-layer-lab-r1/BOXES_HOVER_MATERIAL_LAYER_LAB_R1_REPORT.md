# Boxes Hover — Native Material Layer Lab R1

## OWNER SUMMARY — RU

Дата: 2026-09-03.

Статус: **TARGETED LAB BLOCKER — NATIVE LAYERS ДОСТУПНЫ, НО ДОНОР НЕ ИМЕЕТ ДОПУСТИМОГО COLOR LAYER ДЛЯ ПАЛИТРЫ A/B/C**.

Это изолированный R&D lab. Product Hero materials не менялись. Exact Golden donor payload и native runtime оставлены исходными.

## Authorities

- Product authority: `6fdc0a46a008c3c308c144a734d191d0c97b0473`
- Golden donor authority: `920d0b91728859c15bcace52e7a2a0da3539e347`
- Forensic authority: `4da8b751f5e46efdd7a30756fdf3b409625d2512`
- Phase A base: `38ecb13e1a0d6b5814748d7741ba99ef58197e6b`
- Exact payload SHA-256: `c3bcabd43c232045b059704e8d4be57634314b7da2fcfa5ebbd448ee40a16798`
- Exact payload size: `46,215` bytes
- Runtime: `@splinetool/runtime@2.0.27`
- Lab branch: `agent/proai-boxes-hover-material-layer-lab-r1`

## Method and safety

The lab uses the official Spline `Application` API and the exact recovered payload. No custom material factory and no runtime material replacement API were called. Inventory is read-only until the Owner selects a lab control. The controls mutate only one diagnostic `Cube`, then can restore its captured native values.

No Three.js reconstruction, `BoxGeometry`, camera override, geometry edit, cube transform edit, donor animation edit or product wiring is present.

## Complete native material inventory

The runtime reported exactly `143` mesh objects named `Cube`. Every Cube had an independent material identity in this runtime boot (`143` material identities), but all 143 shared one identical native layer signature (`1` signature). The diagnostic runtime object ID from the captured boot is recorded in `material-inventory.json`; runtime-generated Cube UUIDs can differ between boots, so the complete captured list is preserved as evidence rather than used as a product selector.

Every Cube material exposed exactly three native layers, in this order:

1. `transmission` — keys include `alpha`, `ior`, `mode`, `roughness`, `thickness`, `visible`.
2. `pattern` — keys include `colorA`, `colorB`, `frequency`, `projection`, `rotation`, `size`, `style`, `visible`.
3. `light` / `physical` — keys include `metalness`, `roughness`, `reflectivity`, `emissive`, `specular`, `occlusion`, `visible`.

No layer with `type === 'color'` was found. The allowed physical parameters were present on the `light` layer: baseline `metalness 0.14`, `roughness 0.35`, `reflectivity 0.33`. The exact per-Cube UUID/material/layer/property inventory is in `material-inventory.json`.

## One-Cube / one-family test

The test mutated only existing native properties on the first diagnostic Cube:

- A / Black Chrome: physical roughness, metalness and reflectivity values changed; scene remained renderable and native hover remained recognizable.
- B / Champagne: same allowed physical-property path; scene remained renderable.
- C / Violet / Indigo: same allowed physical-property path; scene remained renderable.
- NATIVE: captured values restored on the diagnostic Cube.

The test did not mutate `pattern.colorA` / `pattern.colorB`, because those are pattern-layer fields, not an allowed `type === 'color'` layer. Therefore this is not evidence for a valid family-wide Black Chrome / Champagne / Violet palette.

## Lab result

- Native layer access: **PASS**
- 143 Cube inventory: **PASS**
- Shared layer signature grouping: **PASS — 1 family signature**
- `color` layer available: **NO**
- Allowed physical fields available: **PASS**
- One-Cube native mutation rendered: **PASS**
- One-Cube native restore: **PASS**
- Family-wide palette candidates A/B/C: **NOT PRODUCED — no allowed color target; no product mutation justified**
- Geometry/camera/native hover changed: **NO**
- Console errors in lab boot: **NONE OBSERVED**

## Owner preview

- Lab URL: `http://192.168.50.143:4183/boxes-hover-material-layer-lab-r1.html`
- Evidence: `boxes-hover-material-layer-lab-r1-native-hover.png`, `boxes-hover-material-layer-lab-r1-a-black-chrome.png`, `boxes-hover-material-layer-lab-r1-a-black-chrome-hover.png`, `boxes-hover-material-layer-lab-r1-c-violet-hover.png`

The lab controls are intentionally diagnostic and one-Cube-only. They are not a product palette and must not be wired into the Hero without a separate Owner-approved material strategy.

## Non-actions

- Main modified: **NO**
- Merged: **NO**
- Deployed: **NO**
- Product Hero materials modified: **NO**
- Manual donor reconstruction: **NO**
- Enterprise purchased: **NO**

Stop and wait for Owner review.
