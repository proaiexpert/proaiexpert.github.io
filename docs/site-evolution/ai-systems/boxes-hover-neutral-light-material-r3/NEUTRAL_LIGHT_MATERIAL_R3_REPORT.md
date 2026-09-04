# Boxes Hover — Neutral Light Material R3

OWNER SUMMARY — RU

Дата: 2026-09-04.

Статус: **NEUTRAL LIGHT MATERIAL R3 READY**.

R3 устранил наследуемый розово-сине-бирюзовый cast именно в `Light Material`, сохранив R2 Cube Material, плотность Boxes Hover, native camera/geometry/events/hover/settling и runtime inventory. Hero не изменялся.

## Authority and safety

- Branch: `agent/proai-boxes-hover-neutral-light-material-r3`
- Start HEAD: `04d0fd6c00a850bbbc17c3c6da2f9a0a5708258e`
- Frozen Hero: `38ecb13e1a0d6b5814748d7741ba99ef58197e6b`
- Runtime: `@splinetool/runtime@2.0.27`
- Loader / encoder: public Spline extension table + `Packr({structuredClone:true})`
- Golden: `46,215` bytes / `c3bcabd43c232045b059704e8d4be57634314b7da2fcfa5ebbd448ee40a16798`
- Golden modified: **NO**
- R2 input: `46,263` bytes / `9d97237a463dd2846bbf1ad7eb2594409d34a08bd1a2ff20ce08b330af201535`
- Final R3: `46,418` bytes / `1269ea60eb7725e59822ba2b9e789a2d9dd8956f557ffbbedfbb39e97a12c4d0`
- Runtime material mutation: **NO**

## Light Material ownership map

| Object / node | Material | Layer | Optical data | Role |
|---|---|---|---|---|
| `root.scene.objects.0.children.3` | `Light Material` | `layer1` | `type=light`, `category=phong`, `alpha=0.6`, `specular=.2/.2/.2`, `shininess=5`, occlusion on | Base response of the visible Light mesh |
| `root.scene.objects.0.children.3` | `Light Material` | `layer2` | `type=gradient`, `alpha=1`, `gradientType=0`, `num=3`, `steps=[0,.5211267605633803,1,1,1,1,1,1,1,1]`, angle `0`, offset/morph `[0,0]` | Colored optical gradient visible in the Boxes Hover field |

Exact material path: `root.scene.objects.0.children.3.data.material`.

Exact object: `Light`, Mesh, id `367609e7-8860-4b9d-b2b6-95237b31b103`.

Confirmed uses: one scene node. No Cube node, UI node, camera, ground plane, or separate scene object references this `Light Material` in the serialized object tree. The material controls the visible light/reflection geometry and the colored field response; it does not control the Cube Material pattern, cube geometry, or hover event logic.

## Original color decomposition

The gradient has 10 stop entries but only three unique colors; the third is repeated for the remaining stops:

1. Pink: `{r:0.9215686274509803,g:0.4392156862745098,b:0.6938980392156864,a:1}`
2. Blue: `{r:0.4393411064373875,g:0.5588241708332363,b:0.9172733640207827,a:1}`
3. Teal / turquoise: `{r:0.3493824346520014,g:0.8849108057114684,b:0.7692366775626239,a:1}` repeated eight times

No emission, physical, transmission, opacity, blend, layer-count, gradient-step, or light-intensity change was required. The Directional Light remains white, intensity `0.7`; ambient/environment remain Golden.

## Stage A — hue neutralization

Stage A converted the three source hues to grayscale equivalents using their relative luminance while preserving gradient order and all non-color properties:

- `#8F8F8F`
- `#8F8F8F`
- `#C3C3C3` repeated

Result: **PASS**. Pink, blue, cyan/teal disappeared from the field; dense center hover topology, native edge behavior and settling remained intact. Stage A established that the colored cast was carried by the gradient stop colors, not by Cube Material, camera, geometry, or runtime hover logic.

## Micro-tuning passes

Maximum three passes were used:

| Pass | Unique gradient colors | SHA-256 | Result |
|---|---|---|---|
| Micro 1 · graphite | `#7E8388 / #7A7F84 / #A8ADB2` | `fa0716d699ebc117f685b95783c03f15d01ecbd716ac2fe349395319732e22cc` | PASS; slightly darker |
| Micro 2 · silver | `#969B9F / #91969A / #C5C9CD` | `1269ea60eb7725e59822ba2b9e789a2d9dd8956f557ffbbedfbb39e97a12c4d0` | **SELECTED**; best neutral silver/graphite balance |
| Micro 3 · chrome | `#A5A9AD / #9CA3A7 / #D0D3D5` | `4a4d321fec7161e9d2782da32ba96bdaa7f09619d371b88b0e06cd7b79f0c1ff` | PASS; brighter, less restrained |

## Selected R3 recipe

Final payload: `final/boxes-hover-neutral-light-material-final.bin`.

Final `Light Material` gradient unique colors:

- `#969B9F` — first stop
- `#91969A` — second stop
- `#C5C9CD` — third stop, repeated through the remaining gradient stops

Unchanged:

- layer count: `2`
- layer types: `light/phong → gradient`
- alpha/opacity: unchanged (`0.6` / `1`)
- steps, angle, offset, morph, gradient type: unchanged
- Cube Material R2 recipe: unchanged
- transmission, environment, Directional Light, camera, transforms, geometry, events, hover: unchanged

## Exact semantic diff

R2 → R3 changed exactly 30 leaf values, all under:

```text
root.scene.objects.0.children.3.data.material.layers.1.data.colors.{0..9}.{r,g,b}
```

Allowed semantic changes: gradient RGB stop colors only. Alpha channels and all other Light Material fields remained unchanged. Unrelated semantic changes: **0**. Round-trip disallowed changes: **0**.

Cube Material lock verification:

- `pattern.colorA = #C9CDD1`
- `pattern.colorB = #020304`
- physical `0.14 / 0.35 / 0.33`
- transmission `1 / 1.5 / 2.7`
- node count `163`, Boxes children `143`, source material `Cube Material`

## Runtime QA

System Chrome `152.0.7977.64`, WebGPU, fresh Application instance and fresh payload boot for every mode, viewport `1440×900`.

- Golden / R2 / Stage A / Micro 1 / Micro 2 / Micro 3 boot: **PASS**
- Final R3 SHA verification: **PASS**
- 143 Cube meshes: **PASS**
- 143 material identities: **PASS**
- Boxes UUID preserved: `006474fe-4e5b-4835-b106-89b2ec79dd71`
- Camera / geometry / hierarchy / events: **MATCH**
- Rest density: **PASS relative to Golden/R2; same intentionally restrained donor rest**
- Center hover: **PASS**
- Edge hover: **PASS**
- Pointer leave / settling: **PASS**
- 390px / 320px overflow sanity: **PASS**, no horizontal overflow
- Final local console: no fatal errors. The previously known `ShadowDepthTexture` WebGPU warning may occur in repeated fresh boots and remains recorded separately.

## Art-direction verdict

- Pink: **ABSENT from Light Material field**
- Cyan / teal: **ABSENT from Light Material field**
- Blue gaming cast: **ABSENT from Light Material field**
- Existing UI demo blue plus control: untouched and unrelated to `Light Material`
- Plate artifact: **ABSENT**
- Boxes Hover recognizability: **PASS**
- Density versus R2: **PRESERVED**
- Physical depth / dimensional hover: **PRESERVED**
- Neutral black / graphite / silver / chrome language: **PASS**

## Preview and evidence

Safe staging contains only preview files, the three comparison payloads and official runtime assets. Server is bound to `0.0.0.0` on port `4178`.

- Localhost preview: http://127.0.0.1:4178/owner-preview/boxes-hover-neutral-light-material-r3.html?mode=r3
- LAN preview: http://10.0.0.204:4178/owner-preview/boxes-hover-neutral-light-material-r3.html?mode=r3
- Server running: **YES**
- Local live runtime: **PASS** (`isSecureContext=true`, `navigator.gpu=true`)
- LAN HTTP route: **200**
- LAN live WebGPU: **NOT VERIFIED / BLOCKED** in ordinary HTTP-by-IP context (`isSecureContext=false`, `navigator.gpu=false`)
- Owner composite: `runtime-qa/owner-composite.png`

## Final decision

R3 removed the inherited colored Light Material contribution without touching Cube Material or donor interaction. Stage A proved the responsible source was the gradient stop color data. Micro 2 is the selected final because it keeps the most balanced neutral silver response without becoming either too dark or overly bright.

Hero integration is intentionally not performed. Champagne/Violet, Indigo/Pearl semantics, camera work and page composition remain out of scope.
