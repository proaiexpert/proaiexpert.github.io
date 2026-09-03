# Boxes Hover — Native Material Layer Lab R1.1

## OWNER SUMMARY — RU

Дата: 2026-09-03.

Статус: **PATTERN COLOR MUTATION BLOCKER**.

R1.1 проверил существующие `pattern.colorA` / `pattern.colorB` и зафиксировал точный stop-condition: разрешённая native color mutation сохраняет доступ к runtime-объекту, но разрушает fidelity до больших плоских цветных пластин во время hover. Physical candidates, three-Cube, cluster и 143-Cube gates по ТЗ не запускались.

## Authorities

- Product / accepted Hero Phase A: `38ecb13e1a0d6b5814748d7741ba99ef58197e6b`
- Lab start HEAD: `6fc0eeac1dd94ed9a3a68b5ae3d48add3c6b391c`
- Forensic authority: `4da8b751f5e46efdd7a30756fdf3b409625d2512`
- Exact payload SHA-256: `c3bcabd43c232045b059704e8d4be57634314b7da2fcfa5ebbd448ee40a16798`
- Exact payload size: `46,215` bytes
- Runtime: `@splinetool/runtime@2.0.27`
- Lab branch: `agent/proai-boxes-hover-material-layer-lab-r1`

## Native inventory

The exact payload exposed `143` `Cube` mesh objects, `143` independent material identities and `1` shared layer signature. Every inspected material had three native layers in this order:

1. `transmission`;
2. `pattern` with `colorA` and `colorB`;
3. `light` with `category: physical` and `metalness`, `roughness`, `reflectivity`.

The complete per-Cube UUID, material identity, layer type/category/key/property inventory is preserved in `material-inventory.json`. Runtime-generated Cube UUIDs changed between boots, so the inventory order and names are evidence only, not a future product selector.

Baseline pattern colors were recorded as `colorA = {r:1,g:1,b:1,a:1}` and `colorB = {r:0,g:0,b:0,a:1}`. Baseline physical values were `metalness 0.14`, `roughness 0.35`, `reflectivity 0.33`. Transmission was not modified.

## Pattern color mapping

Tests were performed on one diagnostic Cube after exact native baseline capture:

- Red/green: `colorA = red`, `colorB = green`.
- Swap: `colorA = green`, `colorB = red`.

Observed mapping:

- `colorB` controls the dominant broad planar / ground-like pattern region. Green in the first test and red after swap moved with `colorB`.
- `colorA` controls the complementary cube/pattern region and interacts with the raised cube surfaces/edges.
- The pattern is not a simple per-face cube tint: changing one Cube’s existing pattern colors produced multiple broad plate-like surfaces during hover.

Both fields changed through the existing native `pattern` layer; no new Color layer was added and no material replacement was used.

## Pattern fidelity gate

The one-Cube color mutation caused the following visible failure in real Chrome secure localhost:

- large flat green plate/ground artifacts for red/green;
- large flat red plate/ground artifacts after swap;
- donor depth/topology no longer read as the original Boxes Hover field;
- native hover remained active, but the material result was not acceptable donor fidelity.

Therefore:

- pattern color mutation: **FAIL**
- status: **PATTERN COLOR MUTATION BLOCKER**
- physical layer pass: **NOT REACHED**
- transmission: **NOT CHANGED**

The secure localhost runtime also emitted repeated Three.js/WebGPU `ShadowDepthTexture` validation errors during the diagnostic render. This is recorded as additional runtime instability, not used to override the visual stop-condition.

## Restore verification

Before each mutation the exact native values for the diagnostic Cube were captured. The restore routine reported `143/143` restored on the final clean run and a fresh payload reload returned the scene to the native baseline. In-session visual restore after direct nested pattern writes was not reliable: the renderer could retain the colored plate state until reload.

- native value restore: **PASS at object-value level**
- in-session visual restore: **FAIL / requires fresh payload reload**
- clean payload reload: **PASS**

Because the pattern fidelity gate failed, no further mutation was allowed.

## Deferred gates

- one-Cube physical metalness: **NOT REACHED**
- one-Cube physical roughness: **NOT REACHED**
- one-Cube physical reflectivity: **NOT REACHED**
- three-Cube validation: **NOT REACHED**
- 9–16 Cube cluster validation: **NOT REACHED**
- 143-Cube candidate validation: **NOT REACHED**
- Candidate A Black Chrome: **NOT REACHED**
- Candidate B Champagne: **NOT REACHED**
- Candidate C Violet / Indigo: **NOT REACHED**
- Owner composite: **NOT PRODUCED**

The normal lab URL leaves candidate buttons disabled after the blocker. QA diagnostics remain available only with `?qa=1` for reproducibility; do not use them as product material wiring.

## Evidence and preview

- Clean lab URL: `http://127.0.0.1:4183/boxes-hover-material-layer-lab-r1.html`
- QA URL: `http://127.0.0.1:4183/boxes-hover-material-layer-lab-r1.html?qa=1`
- Evidence: `diagnostic-pattern-red-green-final.png`, `diagnostic-pattern-swap-final.png`, `native-baseline-secure.png`, `native-restored-secure.png`.

## Safety

- Hero product modified: **NO**
- Hero copy/framing/CTA/header/camera/geometry/hover motion modified: **NO**
- Forbidden material replacement APIs: **NOT USED**
- Manual reconstruction / Three.js material / BoxGeometry: **NO**
- Main modified: **NO**
- Merged: **NO**
- Deployed: **NO**
- Enterprise purchased: **NO**

Stop and wait for Owner. Do not integrate material changes into the Hero.
