# Boxes Hover MessagePack reference protocol recovery R1

Дата: 2026-09-03
Workstream: `AI SYSTEMS HERO — BOXES HOVER`
Режим: read-only serialization / reference-protocol analysis

## Итоговый статус

**REFERENCE PROTOCOL PARTIALLY MAPPED**.

Удалена ключевая неопределённость вокруг базового формата и трёх reference-
extensions: Golden payload — полный MessagePack stream в msgpackr-compatible
формате; `0x72`, `0x69` и `0x70` имеют доказуемую роль. Восстановлены record
field tables и найден сериализованный material region с `Cube Material`,
`transmission`, `pattern`, `physical` и известными числовыми значениями.

Полный безопасный граф `Cube / Cube Instance → конкретный Cube Material →
native layers → runtime material identity` пока не доказан: оставшиеся
Spline application-specific extensions `0x01`, `0x02`, `0x03`, `0x06` имеют
однобайтный opaque payload `00`, а их роль в связывании application records не
установлена. Поэтому no-op round-trip и material patching запрещены.

## Authorities и границы

- Product authority: `6fdc0a46a008c3c308c144a734d191d0c97b0473`.
- Forensic authority: `4da8b751f5e46efdd7a30756fdf3b409625d2512`.
- Ветка: `agent/proai-boxes-hover-serialized-material-lab-r1`.
- Start HEAD: `6e1019008cb6e1bfa14f2050fa421b3f99df0839`.
- Golden payload: `owner-preview/assets/3d/boxes-hover/public-original-inline-scene-payload.bin`.
- Payload size: `46,215` bytes.
- Payload SHA-256: `c3bcabd43c232045b059704e8d4be57634314b7da2fcfa5ebbd448ee40a16798`.
- Runtime authority: `@splinetool/runtime@2.0.27`.

Payload читался только из сохранённого exact binary. Он не изменялся, не
перепаковывался и не re-encode-ился.

## Parser gates

### Python stream parser

- Implementation: `pip._vendor.msgpack`, version `1.1.2`.
- Single `unpackb()` корректно дал `ExtraData`: payload является concatenated
  stream, а не одним MessagePack object.
- `Unpacker` прошёл весь поток: `5,577` top-level items, `46,215 / 46,215`
  bytes consumed, unconsumed bytes `0`.
- Top-level inventory: `ExtType 1,466`, lists `1,079`, integers `1,075`,
  strings `883`, booleans `529`, floats `346`, `None 199`.
- Maps отсутствуют на top-level/recursive decode; nested arrays `1,138`,
  maximum depth `3`.

### Independent JavaScript parser

`msgpackr` был установлен только во временный directory вне repository и не
попал в package manifests. `Unpackr.unpackMultiple()` прошёл payload после
передачи in-memory handlers для неизвестных application ext `0x01/0x02/0x03/0x06`,
которые сохраняли их code/bytes как opaque placeholders. SHA исходного payload
совпал. Это **PASS независимой parser confirmation**, но не расшифровка
Spline application extensions.

## Extension inventory и выводы

| Extension | Наблюдение | Вывод | Уверенность |
|---|---:|---|---|
| `0x00` | 302 × 1 byte | application/runtime token, не требуется для reference graph | UNKNOWN |
| `0x01` | 22 × `00` | Spline application-specific | UNKNOWN |
| `0x02` | 200 × `00` | Spline application-specific | UNKNOWN |
| `0x03` | 2 × `00` | Spline application-specific | UNKNOWN |
| `0x06` | 45 × `00` | Spline application-specific | UNKNOWN |
| `0x69` | 97 × 4 bytes, 97 unique | structured-clone ID registration, uint32 big-endian | CONFIRMED |
| `0x70` | 709 × 4 bytes, 97 unique | pointer lookup into `0x69` namespace, uint32 big-endian | CONFIRMED |
| `0x72` | 120 × 1 byte, 64 unique | msgpackr record definition/record identifier | CONFIRMED |

### `0x72`

В начале stream наблюдается `0x72/40` сразу перед
`['schema','scene','frames','shared','version']`, затем `0x72/41` перед
`['objects','publish','styles']`, затем `0x72/42` перед
`['fi','id','data','children']`. Аналогичный паттерн повторяется для
material/object field arrays. Всего offset-aware scan нашёл `67` declarations,
где `0x72/<record-id>` непосредственно предшествует массиву строк-полей.

Это совпадает с официальным msgpackr record protocol: extension `0x72` (`r`)
содержит record identifier, а следующее значение содержит field names.
Источник: [msgpackr record structures](https://github.com/kriszyp/msgpackr/blob/master/README.md).

### `0x69` и `0x70`

Все четыре-byte payloads интерпретированы как big-endian uint32. В потоке:

- `0x69`: `97` occurrences, все `97` значения уникальны;
- `0x70`: `709` occurrences, `97` unique values;
- `0x70` unique set полностью входит в `0x69` ID set;
- все `709/709` pointer occurrences имеют ранее встреченный соответствующий
  `0x69` ID на уровне top-level stream item.

Это согласуется с official msgpackr source: `0x69` registers the following
value under a big-endian ID, а `0x70` возвращает ранее зарегистрированный
target по big-endian ID. Источники: [pack.js](https://raw.githubusercontent.com/kriszyp/msgpackr/master/pack.js)
и [unpack.js](https://raw.githubusercontent.com/kriszyp/msgpackr/master/unpack.js).

Таким образом, базовый ID/pointer namespace доказан. Это не означает, что
каждый Spline-level объект уже получил человечески читаемое имя: application
extensions остаются opaque.

## Schema table recovery

Восстановлены offset-aware declarations с item index и byte offsets. Наиболее
важные подтверждённые field tables:

| Record ID | Definition item | Fields / значение |
|---|---:|---|
| `0x40` | `0` | `schema, scene, frames, shared, version` |
| `0x41` | `3` | `objects, publish, styles` |
| `0x43` | `10` | scene fields, включая `states`, `events`, `camera`, `name`, `sky` |
| `0x62` | `323` | `layers, name` |
| `0x63` | `327` | pattern fields, включая `colorA`, `colorB`, `frequency`, `size` |
| `0x71` | `1223` | `name, geometry, material, scale, position, hiddenMatrix` |
| `0x41` | `1496` | native pattern fields, включая `colorA`, `colorB` |
| `0x42` | `1529` | transmission fields: `alpha, mode, isMask, visible, type, thickness, ior, roughness` |
| `0x45` | `4977` | `name, geometry, material` |
| `0x4b` | `5118` | `fi, data, id, children` |

Некоторые record IDs переиспользуются после нового declaration; поэтому
mapping хранится как ordered declarations, а не как одна потеряющая контекст
dictionary.

## Material correlation

Offset-aware material context локализован в районе items `1468–1541`:

- item `1476`: `physical`;
- items `1485–1487`: exact floats `0.35`, `0.14`, `0.33`, рядом с physical
  field/value sequence;
- item `1496`: pattern record declaration;
- item `1499`: `pattern`;
- item `1520`: `0.05`, item `1523`: `90`;
- item `1529`: transmission record declaration;
- item `1535`: `transmission`;
- items `1537–1538`: exact `1.5`, `2.7`;
- item `1540`: `Cube Material`;
- item `1541`: `Cube`.

Это идентифицирует сериализованные source records/field tables для native
material layers. Оно согласуется с предыдущим read-only runtime inventory:
`143` Cube meshes, `143` independent runtime material identities и один
общий layer signature: `transmission → pattern → light/physical`; runtime
values включают pattern white/black и physical `metalness 0.14`, `roughness
0.35`, `reflectivity 0.33`.

Статус correlation:

- `Cube Material record`: **IDENTIFIED** — exact stream item `1540`.
- Pattern serialized source: **IDENTIFIED** на уровне record/field/value
  source; связь с каждой runtime identity: **PARTIAL**.
- Physical serialized source: **IDENTIFIED** на уровне record/field/value
  source; связь с каждой runtime identity: **PARTIAL**.
- `Cube / Cube Instance → конкретный Cube Material`: **UNRESOLVED**.
  Schemas exposing a `material` field are confirmed, but the concrete
  application edge still crosses opaque Spline extensions/record packing.
- `material → layers`: **PROBABLE**, not safe enough for mutation: material
  region and layer records are co-located and runtime layer signature matches,
  but the app-specific edge is not fully decoded.

Control-group names (`Ellipse Material`, `Sphere Material`, `Rectangle
Material`, `Text Material`) are present in the stream and were included in the
same context inventory. Their presence confirms common material naming/record
grammar, but does not by itself prove object identity edges.

## Read-only reference graph

Proven edges:

```text
0x72 declaration
  -> following field-name array                         CONFIRMED
0x69 uint32 ID registration
  -> value registered in reference namespace             CONFIRMED
0x70 uint32 pointer
  -> previously registered 0x69 target                  CONFIRMED
schema / scene / object / material records
  -> msgpackr record field tables                       CONFIRMED
Cube Material record
  -> transmission / pattern / physical layer region    PROBABLE
Cube / Cube Instance
  -> specific Cube Material runtime identity             UNRESOLVED
```

Машиночитаемый компактный граф: `reference-graph.json`. Полная таблица
declarations: `schema-table.json`. Byte-offset contexts и float hits:
`stream-context-materials.json`.

## Что осталось unresolved

Точный blocker — не MessagePack и не `0x69/0x70/0x72`. Не расшифрованы
Spline application-specific ext codes `0x01/0x02/0x03/0x06`, из-за чего нельзя
безопасно доказать конкретную end-to-end связь serialized Cube instance с
одной из `143` runtime material identities и всеми layer objects.

Следующий безопасный этап, только после отдельного Owner approval: read-only
runtime instrumentation или отдельное protocol research для этих application
extensions. До него нельзя делать no-op re-encode, заменять bytes, вызывать
`setMaterial()`/`createCustomMaterial()` или менять Hero.

MessagePack extension codes являются application-defined по спецификации:
[MessagePack extension format](https://github.com/msgpack/msgpack/blob/master/spec.md).

## Checks и non-actions

- Golden payload SHA/size: **PASS**.
- Python stream decode and full consumption: **PASS**.
- Independent `msgpackr` parser confirmation: **PASS**, opaque unknown-ext
  handlers only, no payload write.
- Offset-aware stream inventory: **PASS**.
- `0x69/0x70` namespace inclusion and prior-ID check: **PASS**.
- Schema declaration extraction: **PASS**, 67 declarations.
- Golden payload modified: **NO**.
- Material values modified: **NO**.
- Re-encode performed: **NO**.
- Hero modified: **NO**.
- Main modified: **NO**.
- Merge/deploy: **NO**.

## Artifacts

- Decoder: `scripts/ai-systems/boxes-hover/reference_protocol_decoder_r1.py`
- Report: `docs/site-evolution/ai-systems/boxes-hover-serialized-material-lab-r1/REFERENCE_PROTOCOL_R1_REPORT.md`
- Schema table: `docs/site-evolution/ai-systems/boxes-hover-serialized-material-lab-r1/schema-table.json`
- Reference graph: `docs/site-evolution/ai-systems/boxes-hover-serialized-material-lab-r1/reference-graph.json`
- Material contexts: `docs/site-evolution/ai-systems/boxes-hover-serialized-material-lab-r1/stream-context-materials.json`

## Verdict

**PARTIAL** — protocol-level ID/record semantics are now understood well
enough to remove the original “unknown MessagePack references” problem, but
not enough to authorize a safe no-op round-trip. Stop here and wait for Owner;
do not patch materials.
