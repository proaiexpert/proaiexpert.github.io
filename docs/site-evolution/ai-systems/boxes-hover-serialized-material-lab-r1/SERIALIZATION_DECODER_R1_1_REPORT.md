# Boxes Hover serialization decoder R1.1

Дата проверки: 2026-09-03
Workstream: `AI SYSTEMS HERO — BOXES HOVER`
Этап: `GOLDEN DONOR BASELINE R1` / read-only serialization gate

## Итог

Статус: **MESSAGEPACK + CUSTOM EXTENSIONS CONFIRMED**.

Golden payload является корректным MessagePack-потоком. Он не является одним
MessagePack-объектом: попытка `unpackb()` закономерно завершается `ExtraData`,
после чего `Unpacker` последовательно разбирает весь payload до конца.
Неизвестные extension-объекты декодируются и сохраняются как raw `ExtType`;
их внутренний смысл в этой проверке не подменялся догадками.

Это подтверждает формат сериализации, но не даёт безопасного права менять
материалы или другие значения: поток плоский на top-level, содержит ссылки и
нестандартные extension-коды, а семантически безопасный no-op round-trip не
доказан. Поэтому бинарник не переписывался и не re-encode-ился.

## Authority и исходные данные

- Продуктовая authority: `6fdc0a46a008c3c308c144a734d191d0c97b0473`.
- Forensic authority: `4da8b751f5e46efdd7a30756fdf3b409625d2512`.
- Рабочая ветка: `agent/proai-boxes-hover-serialized-material-lab-r1`.
- Начальный HEAD этой ветки: `b79db9e550fac9062d2e1fe0f468853556a8d739`.
- Payload: `owner-preview/assets/3d/boxes-hover/public-original-inline-scene-payload.bin`.
- Размер: `46,215` bytes.
- SHA-256: `c3bcabd43c232045b059704e8d4be57634314b7da2fcfa5ebbd448ee40a16798`.

Бинарник читался только из уже сохранённого exact payload. Его байты не
изменялись.

## Parser gate

Основная проверка выполнена стандартной реализацией Python:

- implementation: `pip._vendor.msgpack`;
- version: `1.1.2`;
- single-object decode: `FAIL / ExtraData` — это ожидаемо для concatenated
  MessagePack stream, а не повреждение данных;
- stream/unpacker decode: `PASS`;
- top-level stream items: `5,577`;
- consumed bytes: `46,215 / 46,215`;
- all bytes consumed: `YES`;
- decoder exception at stream end: `NONE`.

Вторая независимая реализация JavaScript `@msgpack/msgpack` проверена на
наличие в локальном runtime, но пакет не установлен (`MODULE_NOT_FOUND`).
Установка зависимостей и изменение окружения для этой read-only проверки не
производились. Поэтому подтверждение двумя реализациями не заявляется.

## Structural inventory

Top-level types:

| Тип | Количество |
|---|---:|
| `ExtType` | 1,466 |
| `list` | 1,079 |
| `int` | 1,075 |
| `str` | 883 |
| `bool` | 529 |
| `float` | 346 |
| `NoneType` | 199 |
| **Всего** | **5,577** |

Дополнительные результаты рекурсивного обхода:

- вложенных arrays: `1,138`;
- map/dict: `0`;
- максимальная глубина: `3`;
- строковых значений: `660` unique.

Начало потока подтверждает заголовочную/schema-структуру:

1. `ExtType(0x72, 40)`;
2. `['schema', 'scene', 'frames', 'shared', 'version']`;
3. `131`;
4. `ExtType(0x72, 41)`;
5. `['objects', 'publish', 'styles']`;
6. `ExtType(0x03, 00)`;
7. `[ExtType(0x72, 42), ExtType(0x69, 00000011)]`;
8. `['fi', 'id', 'data', 'children']`.

Иными словами, стандартный декодер видит схему и object/property arrays,
однако не восстанавливает из них готовое дерево JSON без знания протокола
ссылок и порядка токенов.

## Extension inventory

Частоты ниже рекурсивные, включая extension-значения внутри arrays.

| Код | Частота | Длины payload | Уникальных payload | Наблюдение |
|---|---:|---|---:|---|
| `0x00` | 302 | 1: 302 | 1 | raw `00` |
| `0x01` | 22 | 1: 22 | 1 | raw `00` |
| `0x02` | 200 | 1: 200 | 1 | raw `00` |
| `0x03` | 2 | 1: 2 | 1 | raw `00` |
| `0x06` | 45 | 1: 45 | 1 | raw `00` |
| `0x69` | 97 | 4: 97 | 97 | 32-bit big-endian-looking references, raw preserved |
| `0x70` | 709 | 4: 709 | 97 | repeated 32-bit reference values, raw preserved |
| `0x72` | 120 | 1: 120 | 64 | byte-range values, включая `40`–`7f`, raw preserved |

Особенно важный для запроса `0x72` встречается `120` раз. Его payload не
превращался в текст и не переименовывался. Для `0x69` и `0x70` также
сохранены исходные 4-byte payloads; например, поток начинается с
`0x72/40`, а следующий object reference — `0x69/00000011`.

Наличие `0x69`, `0x70` и `0x72` — причина итогового статуса
`MESSAGEPACK + CUSTOM EXTENSIONS CONFIRMED`, а не просто
`MESSAGEPACK STRUCTURE CONFIRMED`.

## Tokens / schema / materials

Декодированные строки дают прямые признаки scene schema и runtime metadata:

- `schema` — item `1`;
- `scene` — item `1`;
- `Scene 1` — item `220`;
- `objects`, `publish`, `styles` — начало object section;
- `Page`, `UI Scene`, `scene2d`, `uiScene`, `sceneScale`;
- `camera`, `personal camera`, `OrthographicCamera`, `playCamera`;
- `MouseHover`, `hoverRotateDamping`, `hoverRotatePanMode`,
  `hoverRotatePanStrength`, `resetHoverEffectOnPointerLeave`;
- `Cube`, `CubeGeometry`, `Cube Material`, `Cube Instance` и
  `Cube Instance 2`…`21`;
- `materials`, `material`, `Ellipse Material`, `Sphere Material`,
  `Light Material`, `Rectangle Material`, `Text Material` и другие
  material names;
- `position`, `rotation`, `pivotRotation`, `scale`, `color`, `opacity`,
  `visibility`, `raycastLock`, `states`, `events`;
- финальная строка потока: runtime version `2.0.27`.

Это подтверждает, что payload содержит сохранённую сцену с объектами,
камерами, hover-настройками и материалами. Однако correlation «material name →
конкретный runtime object → безопасно изменяемый цвет» стандартным MessagePack
декодером не доказана: object references находятся в extension-токенах и
требуют знания Spline serialization protocol.

## No-op round-trip и hard stop

- no-op re-encode: **NOT ATTEMPTED**;
- binary mutation: **NO**;
- custom extension semantics guessed: **NO**;
- material mutation: **NO**;
- Hero adaptation: **NO**;
- manual Three.js donor reconstruction: **NO**.

Причина остановки — стандартный parser доказал формат и полное потребление
байтов, но не доказал byte-stable/semantic-stable обратную сериализацию
плоского reference stream. Любой re-encode или замена extension payloads без
официального протокола может изменить ссылки, порядок токенов или runtime
поведение и потому не входит в этот gate.

## Files and preservation

Добавлен только read-only decoder:

- `scripts/ai-systems/boxes-hover/serialization_decoder_r1_1.py`

Он читает payload, сохраняет unknown `ExtType` в памяти и печатает JSON
инвентарь; он не пишет payload и не меняет runtime/product files.

Изменения ограничены decoder/report этого R1.1 gate. Main, production files,
Hero composition, цвета, материалы, camera, labels, motion и exact binary не
трогались. Merge и deploy не выполнялись.

## Decision

Формат установлен: **MessagePack stream with custom extensions**.

Следующий безопасный шаг возможен только при наличии официальной/доказанной
семантики extension reference protocol либо отдельного sanctioned runtime API.
До этого material patching и Hero adaptation остаются остановленными; этот
отчёт не разрешает переписывать golden payload.
