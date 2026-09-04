# Boxes Hover — Black Chrome Material Candidate R1

OWNER SUMMARY — RU

Дата: 2026-09-04.

Статус: **MATERIAL ART-DIRECTION FAIL**.

Pre-init serialized material pipeline технически работает, но Black Chrome не проходит visual fidelity gate: после замены только разрешённых material source values донор теряет большую часть визуально читаемой плотности. В центре/на edge остаются отдельные крупные коробки и яркие контуры вместо узнаваемого плотного Boxes Hover field. Кандидат не интегрирован в Hero.

## Authority and scope

- Рабочая ветка: `agent/proai-boxes-hover-black-chrome-material-r1`
- Start / product serialization HEAD: `6be300da679e9ad76688831a7e4c312a11ec8821`
- Product authority: `agent/proai-ai-systems-hero-clean-transplant-r1` / `38ecb13e1a0d6b5814748d7741ba99ef58197e6b`
- Forensic authority: `4da8b751f5e46efdd7a30756fdf3b409625d2512`
- Runtime: `@splinetool/runtime@2.0.27`
- Loader / encoder authority: `@splinetool/loader@2.0.27`, public `Packr({structuredClone:true})` extension table
- Golden payload: `owner-preview/assets/3d/boxes-hover/public-original-inline-scene-payload.bin`
- Golden size / SHA-256: `46,215` bytes / `c3bcabd43c232045b059704e8d4be57634314b7da2fcfa5ebbd448ee40a16798`

Golden payload не перезаписывался. Ни один runtime material mutation API не вызывался.

## Реализованный безопасный путь

1. Golden decoded exact public extension handlers.
2. Найден стабильный source mesh `Cube` по UUID `2264fe3b-7194-4ee4-adea-5fa8fa9f00b1`.
3. Найден `data.material.name = Cube Material` по пути `root.scene.objects.0.children.2.children.0.children.0.data.material`.
4. Изменялись только source material layer values до запуска runtime.
5. Каждый вариант упакован официальным public `Packr` и заново decoded.
6. Каждый вариант загружен свежим `Application` через официальный runtime.

Не использовались: Three.js reconstruction, BoxGeometry, `setMaterial()`, `createCustomMaterial()`, post-load mutation, patching raw bytes, изменение камеры/геометрии/events/hover.

## Baseline graph and invariants

Decoded Golden baseline:

- tree nodes: `163`;
- Boxes children: `143`;
- Cube source component: `59d52622-c138-4b29-ad19-059c64a37d07`;
- Cube source mesh: `2264fe3b-7194-4ee4-adea-5fa8fa9f00b1`;
- serialized Cube instances: `142` плюс source component;
- source material: `Cube Material`;
- native layer order in serialization: `light/physical → pattern → transmission`;
- transmission сохранён: `thickness=1`, `ior=1.5`, `roughness=2.7`;
- pattern structure сохранена: `size=0.05`, `rotation=90`, `style=3`;
- official runtime inventory for every loaded variant: `143` Cube meshes, `143` material identities, layer signature `transmission → pattern → light`.

## Approved material diff

Baseline physical values: `metalness=0.14`, `roughness=0.35`, `reflectivity=0.33`.

Base Stage B Black Chrome changed exactly:

| Serialized field | Golden | Candidate |
|---|---:|---:|
| `Cube Material / light physical / metalness` | `0.14` | `0.76` |
| `Cube Material / light physical / roughness` | `0.35` | `0.24` |
| `Cube Material / light physical / reflectivity` | `0.33` | `0.52` |
| `Cube Material / pattern / colorA` | white `#FFFFFF` | Gunmetal `#1A2027` |
| `Cube Material / pattern / colorB` | black `#000000` | Obsidian `#020304` |

Normalized color values:

- `colorA = {r:0.10196078431372549,g:0.12549019607843137,b:0.15294117647058825,a:1}`;
- `colorB = {r:0.00784313725490196,g:0.011764705882352941,b:0.01568627450980392,a:1}`.

Unapproved decoded changes: `0`. Camera, geometry, hierarchy, transmission, pattern size/rotation/style, events and hover fields: unchanged.

## Candidate artifacts

| Variant | Physical | Pattern | Bytes | SHA-256 | Result |
|---|---|---|---:|---|---|
| Stage A | `.76/.24/.52` | Golden white/black | `46,215` | `cc34bb1706496553b0f2d9dd83c8cfedfe998e04e9b31d9e3b02ab90d17d4787` | runtime PASS; visual gate not accepted |
| Stage B R1 | `.76/.24/.52` | Gunmetal / Obsidian | `46,263` | `44b7218470e40d925d4cf6e827fe4d17869f86a4a35a28fdd439280ec25549d9` | FAIL: field density collapses |
| Micro 1 | `.82/.20/.60` | Gunmetal / Obsidian | `46,263` | `4123f68ac0c9bf676f90f791f289c6ef2da14d26d8490d5887a50a649a33df72` | FAIL: no meaningful recovery |
| Micro 2 | `.82/.20/.60` | Graphite / Obsidian | `46,263` | `aa79825f6f168dc2c75aa81f3e5cff6c52c1d882b10c1b1a5094e9a23b5cf8c8` | FAIL: no meaningful recovery |
| Micro 3 | `.82/.20/.60` | Muted / Obsidian | `46,263` | `f077b2c58e72b75e24ee6abc9afdf69eb2501d6c06467bf8e67bb2b7a1c333f1` | FAIL: density still absent; tuning stopped |

Stage A remains the visual control: physical-only change did not create a serialization failure, but it also does not make the dark material candidate acceptable. Micro 1–3 were the maximum allowed diagnostic passes; no fourth pass was performed.

## Runtime QA — system Chrome / WebGPU

Browser: real Google Chrome `152.0.7977.64`, viewport `1440×900`, `navigator.gpu=true`, adapter available, official standalone WebGPU runtime.

- Golden payload load: **PASS**;
- Stage A load: **PASS**;
- Stage B load: **PASS**;
- Micro 1/2/3 load: **PASS**;
- SHA and byte-size verification in browser: **PASS**;
- `143` Cube meshes / `143` material identities for every variant: **PASS**;
- native pointer interaction: **PASS**;
- pointer-leave settling: **PASS**;
- horizontal overflow at 390 and 320 sanity viewports: **none detected**;
- candidate field fidelity at rest: **FAIL** — dark field is barely readable;
- candidate field fidelity at center hover: **FAIL** — most box topology disappears;
- candidate field fidelity at edge hover: **FAIL** — field collapses to sparse contours;
- camera/depth/topology semantic invariants after decode: **PASS**;
- material art-direction / recognizable donor gate: **FAIL**.

The only repeated console error was the previously observed runtime/WebGPU warning:
`ShadowDepthTexture` destroyed texture used in a submit. It did not prevent boot or inventory, but it remains a runtime risk and is recorded rather than hidden.

Performance sanity: candidate boot reached QA pass in approximately `1.58s` in the tested run, `5` resource entries were observed, and no duplicate scene load occurred within one page boot. This is not a production performance claim.

## Evidence and preview

Owner preview (local R&D server only, not deployed):

- [Black Chrome preview](http://127.0.0.1:4176/owner-preview/boxes-hover-black-chrome-material-r1.html?mode=black-chrome)
- [Golden vs Black Chrome 2×2 composite](http://127.0.0.1:4176/docs/site-evolution/ai-systems/boxes-hover-black-chrome-material-r1/owner-composite.html)

The server must be running from this worktree on port `4176`; these URLs are not production URLs.

Screenshots:

- `runtime-qa/golden-true-rest.png`
- `runtime-qa/black-chrome-true-rest.png`
- `runtime-qa/golden-center-hover-verified.png`
- `runtime-qa/black-chrome-center-hover-verified.png`
- `runtime-qa/golden-edge-hover-verified.png`
- `runtime-qa/black-chrome-edge-hover-verified.png`
- `runtime-qa/black-chrome-settled-verified.png`
- `runtime-qa/micro-1-*.png`, `runtime-qa/micro-2-*.png`, `runtime-qa/micro-3-*.png`
- `owner-composite.png`

Deterministic generator and source-level evidence:

- `scripts/ai-systems/boxes-hover/black_chrome_material_r1.mjs`
- `black-chrome-material-r1-evidence.json`
- `micro-1-evidence.json`
- `micro-2-evidence.json`
- `micro-3-evidence.json`

## Final decision

What was removed: uncertainty about whether a serialized source-level material candidate could be produced and replayed through the exact official runtime. That path is proven.

What remains blocked: the requested Black Chrome colors make the native pattern visually disappear in the exact donor runtime. The candidate is therefore not a safe basis for Hero adaptation.

Safe next step: Owner reviews the Golden-vs-Black-Chrome evidence. Do not patch more material values, do not integrate into the Hero, and do not start Champagne/Violet or any semantic authority-threshold work in this branch without a new explicit decision.

Safety:

- Golden payload modified: **NO**;
- Hero modified: **NO**;
- main modified: **NO**;
- merge: **NO**;
- deploy: **NO**;
- Enterprise purchased: **NO**;
- manual donor reconstruction: **NO**;
- runtime post-load material mutation: **NO**.
