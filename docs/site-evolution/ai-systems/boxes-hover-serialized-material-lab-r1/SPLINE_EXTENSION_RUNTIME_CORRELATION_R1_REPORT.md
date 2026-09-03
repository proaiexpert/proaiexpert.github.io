# Boxes Hover Spline extension semantics + runtime correlation R1

Дата: 2026-09-03
Workstream: `AI SYSTEMS HERO — BOXES HOVER`
Режим: read-only forensics

## Итоговый статус

**END-TO-END MATERIAL GRAPH CONFIRMED**.

Публично опубликованный `@splinetool/loader@2.0.27` содержит exact handlers
для прежних unresolved extension codes `0x01`, `0x02`, `0x03`, `0x06`.
После их воспроизведения Golden payload декодируется как один logical root без
opaque placeholders, и прямой serialized graph восстанавливается полностью:

```text
Boxes
└── Cube component
    ├── Cube source Mesh
    │   ├── CubeGeometry
    │   └── Cube Material
    │       ├── light / physical
    │       ├── pattern
    │       └── transmission
    └── Cube Instance × 142
        └── component → Cube component UUID
```

Отдельно сохраняется осторожность: exact internal runtime mechanism, который
превращает один serialized source component плюс 142 instances в 143
independent runtime material identities, не называется без прямого source
evidence. Cardinality correspondence доказана; implementation mechanism
остаётся `PARTIAL`.

## Authorities и immutable inputs

- Product authority: `6fdc0a46a008c3c308c144a734d191d0c97b0473`.
- Forensic authority: `4da8b751f5e46efdd7a30756fdf3b409625d2512`.
- Branch: `agent/proai-boxes-hover-serialized-material-lab-r1`.
- Start HEAD: `cd1db0970739bf5db380c98d3f40b3d71151e4cc`.
- Golden payload: `owner-preview/assets/3d/boxes-hover/public-original-inline-scene-payload.bin`.
- Golden payload: `46,215` bytes.
- Golden SHA-256: `c3bcabd43c232045b059704e8d4be57634314b7da2fcfa5ebbd448ee40a16798`.
- Runtime authority: `@splinetool/runtime@2.0.27`.
- Loader authority: `@splinetool/loader@2.0.27`.

Payload не изменялся и не re-encode-ился.

## Public package inspection

Проверены только публичные npm packages, скачанные во временные каталоги вне
repository:

- `@splinetool/runtime@2.0.27/package.json`;
- `build/runtime.cjs`;
- `build/runtime.js`;
- `build/runtime.standalone.webgpu.js`;
- `build/runtime-chunk-AIWIOLR6.js`;
- `@splinetool/loader@2.0.27/package.json`;
- `build/SplineLoader.cjs` и `build/SplineLoader.js`.

Loader CJS bundle inspected in this run: `1,350,002` bytes,
SHA-256 `f4c80425dfa1aa2e4cabee25f64a73e36d5edb0cd540bb0fecae72e5033346ec`.

Runtime bundle содержит встроенный msgpackr-compatible decoder и стандартные
record/structured-clone handlers. Loader содержит public extension table `hx`,
которая регистрирует application classes через `Ff(...)`.

## Recovered handlers

В опубликованном loader bundle найден exact pattern:

```text
hx = [
  { Class: Ae.prototype.constructor, type: 1, read(n) { setPrototypeOf(n, Ae.prototype) } },
  { Class: me.prototype.constructor, type: 2, read(n) { setPrototypeOf(n, me.prototype) } },
  { Class: Rt.prototype.constructor, type: 3, read(n) { setPrototypeOf(n, Rt.prototype) } },
  ...
  { Class: kt.prototype.constructor, type: 6, read(n) { setPrototypeOf(n, kt.prototype) } }
]
```

Важная деталь: для этих custom handlers `read(value)` получает следующий
decoded MessagePack value; extension byte `00` выступает как one-byte wrapper
marker. Поэтому предыдущий placeholder decoder сохранял ext token отдельно
и терял object topology. Exact handler reproduction восстанавливает wrapper
прототипы и потребляет surrounding value так же, как public loader.

| Code | Public class | Доказанная семантика | Input / return |
|---|---|---|---|
| `0x01` | `Ae` | object wrapper с ID-keyed operation methods (`modifyById`, `runOp`) | следующий decoded object → тот же object с `Ae.prototype` |
| `0x02` | `me` | flat ID-keyed array/collection с `fi/id/data` operations | следующий decoded array → тот же array с `me.prototype` |
| `0x03` | `Rt` | tree collection с `fi/id/data/children`, parent/child caches и traversal | следующий decoded array → тот же array с `Rt.prototype` |
| `0x06` | `kt` | property/path operation object (`path`, `props`, operation methods) | следующий decoded object → тот же object с `kt.prototype` |

Все четыре semantics: **CONFIRMED**. Рендеринг, материалы и runtime values не
менялись.

## Exact re-decode gate

Read-only reproduction находится в:
`scripts/ai-systems/boxes-hover/spline_extension_runtime_correlation_r1.mjs`.

Запуск использует временный `msgpackr` package path через `--msgpackr`; package
не добавляется в production dependencies. Результат:

- logical root values: `1`;
- root keys: `schema`, `scene`, `frames`, `shared`, `version`;
- bytes consumed: `46,215 / 46,215`;
- decoder errors: `0`;
- SHA: exact Golden SHA;
- tree nodes traversed: `163`;
- Cube instances: `142`;
- source Cube component UUID:
  `59d52622-c138-4b29-ad19-059c64a37d07`;
- source Cube mesh UUID:
  `2264fe3b-7194-4ee4-adea-5fa8fa9f00b1`.

## Cube → material proof

Для source mesh по decoded path
`scene.objects.0.children.2.children.0.children.0` подтверждено:

- `type = Mesh`;
- `name = Cube`;
- `geometry.type = CubeGeometry`;
- `data.material.name = Cube Material`;
- `data.material.layers.length = 3`.

Для всех `142` `Cube Instance` nodes:

- `type = Instance`;
- `component = 59d52622-c138-4b29-ad19-059c64a37d07`;
- unique component IDs: только этот один source component ID.

Это не proximity inference: edge material — direct decoded object property,
edge instance — direct decoded component UUID.

**CUBE → MATERIAL: CONFIRMED**.

## Material → layers proof

`Cube Material` содержит exact serialized layers:

1. `id=layer1`, `type=light`, `category=physical`
   - `metalness = 0.14`
   - `roughness = 0.35`
   - `reflectivity = 0.33`
2. `id=2152088c-a5a1-4f51-836e-cd9c00efe34d`, `type=pattern`
   - `colorA = {r:1,g:1,b:1,a:1}`
   - `colorB = {r:0,g:0,b:0,a:1}`
   - `size = 0.05`
   - `rotation = 90`
3. `id=layer2`, `type=transmission`
   - `thickness = 1`
   - `ior = 1.5`
   - `roughness = 2.7`

Порядок serialized layers — `light → pattern → transmission`. Read-only runtime
inventory отдаёт соответствующий runtime order в обратном stack traversal:
`transmission → pattern → light`; layer types и значения совпадают.

**MATERIAL → LAYERS: CONFIRMED**.

## Runtime correlation

Использован существующий read-only runtime inventory:
`docs/site-evolution/ai-systems/boxes-hover-material-layer-lab-r1/material-inventory.json`.
Он был получен официальным `Application` runtime harness для exact payload и
`@splinetool/runtime@2.0.27`; mutation controls в этой задаче не запускались.

Independent signals:

1. Golden payload SHA/size совпадает между serialized analysis и runtime
   inventory.
2. Serialized source material прямо называется `Cube Material` и содержит
   три layer records с перечисленными values.
3. Runtime inventory находит `143` Cube meshes, `143` independent material
   identities и `1` common layer signature.
4. Runtime first-Cube layer values совпадают с decoded serialized values:
   transmission `ior=1.5`, `roughness=2.7`; pattern white/black; physical
   `metalness=0.14`, `roughness=0.35`, `reflectivity=0.33`.

Итоговые edge labels:

- serialized pattern source → runtime pattern: **CONFIRMED**;
- serialized physical source → runtime physical: **CONFIRMED**;
- serialized transmission source → runtime transmission: **CONFIRMED**;
- serialized `Cube Material` → runtime material layer family: **CONFIRMED**.

## 143 material identities

Serialized topology: `1` source Cube component + `142` Cube Instance nodes =
`143` visual Cube placements. Runtime inventory: `143` Cube meshes + `143`
independent material identities.

Доказана cardinality correspondence и shared layer signature. Но точный
внутренний implementation mechanism — clone-on-instantiation, template
expansion или иной runtime path — по публичному bundle не утверждается.

**143 MATERIAL IDENTITIES EXPLAINED: PARTIAL**.

## Runtime instrumentation decision

**READ-ONLY RUNTIME INSTRUMENTATION: NOT NEEDED** для снятия blocker: public
handler table плюс existing read-only exact-runtime inventory дали независимые
signals для всех requested material edges. Новая browser mutation или runtime
property assignment не выполнялась.

## Non-actions и safety gate

- Material values modified: **NO**.
- Payload modified: **NO**.
- Re-encode performed: **NO**.
- `setMaterial()` / `createCustomMaterial()`: **NO**.
- Geometry/camera/interaction changed: **NO**.
- Hero modified: **NO**.
- Main modified: **NO**.
- Merged: **NO**.
- Deployed: **NO**.

Это исследование разрешает только рассмотреть отдельную Owner-approved
no-op round-trip фазу. Сам round-trip здесь не выполнялся.

## Artifacts

- Decoder: [spline_extension_runtime_correlation_r1.mjs](../../../../../scripts/ai-systems/boxes-hover/spline_extension_runtime_correlation_r1.mjs)
- Report: `SPLINE_EXTENSION_RUNTIME_CORRELATION_R1_REPORT.md`
- Handler inventory: `spline-extension-handlers.json`
- Runtime correlation: `runtime-material-correlation.json`
- End-to-end graph: `end-to-end-material-graph.json`

## Final verdict

Proven end-to-end semantic map:

```text
serialized Cube / Cube Instance
  → serialized Cube Material
  → physical + pattern + transmission layers
  → exact known runtime material layer values
```

**YES** — достаточно для рассмотрения отдельного no-op round-trip test,
но только в следующей Owner-approved фазе. В этой фазе остановиться и ждать
Owner; материалы и Golden payload не патчить.
