# Boxes Hover — selective semantic instance state R1

## Итог

Статус: **SELECTIVE INSTANCE SEMANTIC STATE PASS**.

В exact R3 payload доказан безопасный сериализованный механизм `Instance` override. Два выбранных размещения получили отдельные полные material records, адресованные UUID исходного Cube Mesh; изменён только `pattern.colorA`. Третье размещение не имеет override и наследует общий R3 Cube Material. В runtime все 143 Cube Meshes сохранились, изоляция target-состояний подтверждена, native hover и settling работают.

Это capability proof. Полная семантическая хореография Hero, labels, intro timing и production integration намеренно не выполнялись.

## Authorities

- Branch: `agent/proai-boxes-hover-semantic-instance-state-r1`
- Base: `ab1da88762bf09434d0be9cedef4cb7383056aba`
- Frozen Hero authority: `agent/proai-ai-systems-hero-clean-transplant-r1`, `38ecb13e1a0d6b5814748d7741ba99ef58197e6b`
- Accepted R3 material source: `agent/proai-boxes-hover-neutral-light-material-r3`, `19ba191b499c347a67987d93ebe0e3e29c4b88d6`
- Clean Hero + R3 review base: `ab1da88762bf09434d0be9cedef4cb7383056aba`
- R3 payload: `1269ea60eb7725e59822ba2b9e789a2d9dd8956f557ffbbedfbb39e97a12c4d0`
- Candidate payload: `cf72f489011f26c82379faf3000b947442f1989fd105cb5d6f3762da0bf5ff2d`, 47,113 bytes
- Runtime/loader: `@splinetool/runtime@2.0.27`

Golden и R3 source payloads не перезаписывались.

## Что было найдено в схеме

`Boxes` находится по пути `root.scene.objects.0.children.2` и содержит 143 child placements. Первый child — source `Component`, остальные 142 — `Instance`. Все 142 instance records ссылаются на один component ID:

`59d52622-c138-4b29-ad19-059c64a37d07`

Source Cube Mesh:

- path: `root.scene.objects.0.children.2.children.0.children.0`
- mesh ID: `2264fe3b-7194-4ee4-adea-5fa8fa9f00b1`
- material: `Cube Material`
- layers: native physical/light, pattern, transmission

У instances есть собственные UUID, position/rotation/scale и поле `data.overrides`. У исходного Mesh остаются native states/events. Runtime публично поддерживает instance override resolution; в опубликованном runtime 2.0.27 обнаружены `overrides`, `resolve`, component descendants и полное override-свойство `material`.

## Механизм

Использована следующая pre-init цепочка:

`decode → instance.data.overrides[sourceMeshId].material → encode → fresh Application boot`

Технически:

1. `data.overrides` сохранён как native MessagePack extension table (`Ext6`).
2. Для каждого target создан source-compatible полный `Cube Material`.
3. Его `layers` сохранены как native layer table (`Ext2`), иначе runtime не принимает материал.
4. Изменён только `pattern` layer `colorA`; `colorB`, physical layer, transmission layer, alpha, blending, geometry и события сохранены.
5. Runtime material mutation, `setMaterial()`, `createCustomMaterial()`, Three.js reconstruction и `BoxGeometry` не использовались.

Полный material record в override — не глобальная мутация, а требование native runtime для material override. Это объясняет объём diff: сами изменения scoped только двум target override-веткам.

## Выбранные три размещения

| Target | Instance ID | Serialized path | Position | Component | Состояние |
|---|---|---|---:|---|---|
| T1 | `889ba072-8c04-4fa0-80f7-5c32e26dd963` | `root.scene.objects.0.children.2.children.110` | `[200, 0, 150]` | `59d52622-c138-4b29-ad19-059c64a37d07` | Indigo |
| T2 | `9d07611a-c5ce-4020-abf0-dd0f4ca95d89` | `root.scene.objects.0.children.2.children.129` | `[200, 0, 50]` | `59d52622-c138-4b29-ad19-059c64a37d07` | Neutral/Silver, inherited |
| T3 | `1687f9e7-cac3-4b61-b5f6-a6dd86082fff` | `root.scene.objects.0.children.2.children.142` | `[200, 0, -50]` | `59d52622-c138-4b29-ad19-059c64a37d07` | Pearl |

Override color paths for T1/T3:

`<instance>.data.overrides.2264fe3b-7194-4ee4-adea-5fa8fa9f00b1.material.layers.2152088c-a5a1-4f51-836e-cd9c00efe34d.colorA`

Recipes:

- T1 Indigo: `colorA #676BFF`, `colorB #020304`
- T2 Neutral/Silver: inherited R3 `colorA #C9CDD1`, `colorB #020304`
- T3 Pearl: `colorA #F2F0EB`, `colorB #020304`

Pearl не становится Indigo: это отдельный override color и отдельная runtime material identity.

## Semantic diff gate

Candidate повторно декодирован и проверен round-trip без записи обратно в Golden.

- changed leaves: `130`
- round-trip changed leaves: `130`
- disallowed diff: `0`
- round-trip disallowed: `0`
- unrelated semantic changes: `0`
- изменённые ветки: только два target `data.overrides.*.material` records
- source/global Cube Material: unchanged
- Light Material: unchanged

130 leaves — это сериализация двух source-compatible полных material overrides, включая неизменённые поля, необходимые native runtime. Семантически новый state отличается только `pattern.colorA`; exact diff сохранён в `semantic-diff.json`.

## Runtime / WebGPU QA

Проверка выполнена в одном и том же реальном Google Chrome процессе и той же странице после fresh boot:

- Chrome: `152.0.0.0`
- viewport: `1117 × 721` CSS px
- DPR: `2.4000000953674316`
- `isSecureContext`: `true`
- `navigator.gpu`: `true`
- adapter: available
- runtime status: `ready`
- Cube Meshes: `143`
- material identities: `143`
- instance roots: `142`
- fatal console errors: `0`

### Isolation

Runtime data подтвердил ровно три target states: `1 Indigo`, `1 Neutral`, `1 Pearl`; `nonTargetChanged = 0`. T1 runtime pattern layer содержит `#676BFF`, T2 — R3 `#C9CDD1`, T3 — `#F2F0EB`. У всех сохранён R3 black `colorB #020304`.

### Hover / settling

- Center hover: PASS. При pointer `[560,360]` все три targets были активны; expanded cubes показали native motion `position.y = 23.73153206177814`, `scale.y = 0.87`.
- Edge hover: PASS. При pointer `[800,360]` наблюдалась native edge response, включая T2/T3; instances не были frozen или detached.
- Pointer leave / settling: PASS. После ухода pointer и ожидания active parents стали пустыми; targets вернулись к `position.y = 0`, `scale.y = 0.09`.
- Plate artifact: отсутствует; source component не повреждён; field не распался.

Подробное машиночитаемое доказательство: `runtime-capability.json`.

## Invariants и границы этой фазы

Сохранены:

- 143 visual placements / Cube Mesh count
- Boxes hierarchy и component reference
- camera и geometry
- native events, hover и settling
- глобальный R3 Cube Material
- R3 Light Material

Намеренно не добавлялись:

- semantic labels, leader lines, badges, tooltips
- 0–3.8s intro
- Indigo propagation / Pearl stop choreography
- mobile adaptation
- Hero integration
- production wiring

Визуальный screenshot был просмотрен inline в той же true-WebGPU сессии; committed image artifact не добавлялся, поскольку доступного безопасного filesystem capture sink в этой сессии не было. Для текущей задачи это не блокирует технический capability proof; финальная 1440×900 art-direction QA остаётся отдельным gate.

## Вывод и следующая безопасная стадия

**Да: R3 Boxes Hover field безопасно поддерживает селективные физические semantic states.** Доказан native serialized Instance override без глобальной мутации и без реконструкции donor geometry. Механизм можно использовать как техническую основу следующей отдельной фазы, где Owner/Coordinator отдельно утвердит полную Indigo → Pearl execution choreography.

До этого момента нельзя строить полный intro, добавлять labels, менять Hero или интегрировать результат в production.

