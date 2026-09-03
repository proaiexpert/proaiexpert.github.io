# Boxes Hover safe no-op round-trip R1

Дата: 2026-09-03
Workstream: `PROAI EXPERT — BOXES HOVER`
Режим: read-only no-op serialization / runtime parity

## Итоговый статус

**BYTE-IDENTICAL ROUND-TRIP PASS**.

Golden payload был декодирован штатными Spline MessagePack extension
handlers, переупакован точным публичным encoder path `@splinetool/loader@2.0.27`
и записан только в экспериментальную копию. Экспериментальная копия совпала с
Golden byte-for-byte: размер, SHA-256 и все байты одинаковы. Повторный decode
дал тот же semantic snapshot. Официальный runtime smoke-test загрузил обе
копии в системном Chrome с доступным WebGPU; стабильная runtime topology и
material-layer inventory совпали.

Это доказывает безопасный no-op round-trip. Материалы, камера, geometry,
events, hover и Hero не изменялись.

## Authorities и границы

- Ветка: `agent/proai-boxes-hover-serialized-material-lab-r1`.
- Start HEAD: `6c948326fbb7c86d94f9006c3e6c9f7a5b5becd2`.
- Product/Hero authority только зафиксирована; Hero branch не изменялась.
- Golden payload: `owner-preview/assets/3d/boxes-hover/public-original-inline-scene-payload.bin`.
- Runtime authority: `@splinetool/runtime@2.0.27`.
- Loader authority: `@splinetool/loader@2.0.27`.

Golden payload не overwrote-ся и не изменялся. No-op binary записан отдельно:
`noop-roundtrip-r1/boxes-hover-noop-roundtrip-r1.bin`.

## Payload и byte gate

| Артефакт | Размер | SHA-256 |
|---|---:|---|
| Golden | 46,215 bytes | `c3bcabd43c232045b059704e8d4be57634314b7da2fcfa5ebbd448ee40a16798` |
| Experimental no-op | 46,215 bytes | `c3bcabd43c232045b059704e8d4be57634314b7da2fcfa5ebbd448ee40a16798` |

Byte comparison:

- `identical`: **true**
- `differentBytes`: `0`
- `sizeDelta`: `0`
- `firstDifferingOffset`: `null`

## Encoder protocol

Публичный bundle `@splinetool/loader@2.0.27` содержит:

```text
EL = new Packr({ structuredClone: true })
for (const handler of hx) ux(handler)
serialize(value) = EL.pack(value)
```

Воспроизведены все шесть entries публичной `hx` table:

- `0x01` object wrapper (`Ae`)
- `0x02` flat collection (`me`)
- `0x03` tree collection (`Rt`)
- `0x04` id wrapper (`rl`)
- `0x05` data wrapper (`Qu`)
- `0x06` property/path operation (`kt`)

В Golden реально присутствуют custom application extensions `0x01`, `0x02`,
`0x03`, `0x06`; `0x04` и `0x05` зарегистрированы для точного публичного
encoder path, хотя для этого payload не потребовались. `Packr` records оставлены
в default режиме, как в публичном loader constructor; `structuredClone: true`
совпадает с публичным кодом.

## Semantic re-decode

Semantic snapshot до encode и после decode no-op copy:

- Golden snapshot SHA: `d3dc19ad79b1cc4fbb2ab6910a1ed70f06177b974e907728d66bcb6fba2b96fe`.
- Round-trip snapshot SHA: `d3dc19ad79b1cc4fbb2ab6910a1ed70f06177b974e907728d66bcb6fba2b96fe`.
- Equality: **true**.
- Logical root values: `1`.
- Root keys: `schema`, `scene`, `frames`, `shared`, `version`.
- Decoded tree: `163` nodes, `142` Cube Instance nodes plus source Cube component.
- Source Cube Material: `Cube Material`.
- Native layer values and ordering preserved: serialized `light/physical`,
  `pattern`, `transmission`; runtime exposes reverse presentation order
  `transmission`, `pattern`, `light`.

## Official runtime QA

QA harness: `noop-roundtrip-r1/runtime-harness/`. It loads Golden and no-op in
separate `Application` instances using the official standalone WebGPU browser
bundle from `@splinetool/runtime@2.0.27`.

Runtime environment:

- System Google Chrome: `152.0.7977.64`.
- Viewport: `1440×900`.
- `navigator.gpu`: **true**.
- WebGPU adapter: **available**.
- Golden payload: `46,215` bytes, exact SHA, Boxes UUID
  `006474fe-4e5b-4835-b106-89b2ec79dd71`, `143` Cube meshes,
  `143` material identities.
- No-op payload: same values.
- Stable runtime topology: **equal**.
- No material/geometry/camera/event/hover mutation API called.

Independent `Application` instances generate fresh UUIDs for expanded Cube
instances. Those runtime-generated UUIDs were intentionally excluded from the
parity key; stable Boxes identity, cube count, material identity count and all
layer signatures matched.

Visual states were captured under the same viewport and pointer coordinates:

- rest: Golden/no-op same dark field state;
- center hover: Golden/no-op same expanded Boxes Hover state;
- edge hover: Golden/no-op same peripheral hover state;
- pointer leave: Golden/no-op same settling state.

Screenshot inventory:

- `runtime-qa/single-golden-rest.png`
- `runtime-qa/single-noop-rest.png`
- `runtime-qa/single-golden-center-hover.png`
- `runtime-qa/single-noop-center-hover.png`
- `runtime-qa/single-golden-edge-hover.png`
- `runtime-qa/single-noop-edge-hover.png`
- `runtime-qa/single-golden-pointer-leave.png`
- `runtime-qa/single-noop-pointer-leave.png`
- `runtime-qa/runtime-qa-results.json`

## Checks

- Python MessagePack full-stream decode from previous accepted phase: **PASS**.
- Independent `msgpackr` decode and exact custom handlers: **PASS**.
- Public encoder reproduction: **PASS**.
- Byte-identical no-op output: **PASS**.
- Re-decode semantic equality: **PASS**.
- Official runtime Golden load: **PASS**.
- Official runtime no-op load: **PASS**.
- WebGPU adapter availability: **PASS**.
- Runtime object/material topology parity: **PASS**.
- Rest / center hover / edge hover / pointer-leave visual evidence: **PASS**.
- Console/page errors: **PASS** after local deterministic font routing; only
  Chrome warnings about Windows `powerPreference` were observed.

The browser sandbox could not fetch the donor's external Lexend font. For the
isolated QA harness only, font requests were fulfilled with the local Windows
Segoe UI font; this does not alter the scene payload or any Boxes Hover object,
material, camera, event or hover state.

## Artifacts

- Decoder/round-trip script:
  `scripts/ai-systems/boxes-hover/safe_noop_roundtrip_r1.mjs`
- Evidence:
  `noop-roundtrip-r1/noop-roundtrip-evidence.json`
- Experimental binary:
  `noop-roundtrip-r1/boxes-hover-noop-roundtrip-r1.bin`
- Official runtime QA harness and screenshots:
  `noop-roundtrip-r1/runtime-harness/` and `noop-roundtrip-r1/runtime-qa/`

## Non-actions

- Golden payload modified: **NO**.
- Material values modified: **NO**.
- Material variants created: **NO**.
- `setMaterial()` / `createCustomMaterial()` called: **NO**.
- Three.js reconstruction or BoxGeometry used: **NO**.
- Hero modified: **NO**.
- Main modified: **NO**.
- Merge: **NO**.
- Deploy: **NO**.

## Verdict and next safe step

Мы теперь имеем доказанный byte-identical no-op round-trip для Golden Boxes
Hover payload и подтверждение, что exact bytes снова загружаются официальным
Spline runtime с той же runtime topology/material-layer structure.

Следующий этап может быть отдельной Owner-approved material round-trip phase.
До отдельного approval нельзя менять значения материалов, создавать варианты,
переписывать payload или возвращаться к Hero adaptation в рамках этой задачи.
