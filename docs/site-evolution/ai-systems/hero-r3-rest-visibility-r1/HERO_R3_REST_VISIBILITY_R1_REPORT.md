# TRUE WEBGPU EVIDENCE + REST VISIBILITY R3.1

## Итог

Работа выполнена на изолированной ветке от `ab1da88762bf09434d0be9cedef4cb7383056aba`. Реальный системный Chrome подтвердил WebGPU в самой странице: secure localhost, `navigator.gpu=true`, адаптер доступен, payload загружен официальным `@splinetool/runtime@2.0.27`, runtime-инварианты `143` Cube и `143` material identities проходят.

Формальная визуальная приёмка `1440×900` не завершена: подключённая same-session вкладка имеет фактический viewport `1117×721` при DPR `2.4000000953674316`. Отдельный Puppeteer/headless запуск ранее давал `No available adapters` и поэтому сознательно не использован как WebGPU-доказательство.

На фактическом true-WebGPU viewport текущий R3 REST остаётся слишком тихим: справа видны только редкие слабые точки. Candidate A даёт небольшой lift, Candidate B — ещё немного сильнее, но даже разрешённый потолок B не создаёт достаточного непрерывного физического присутствия. Hover и settling у обоих кандидатов сохраняются. Дальнейшее увеличение запрещено этим заданием.

**Статус: `WEBGPU CAPTURE BLOCKER` для требуемого authoritative 1440×900 evidence; bounded R3.1 material test завершён с результатом `REST VISIBILITY MATERIAL BLOCKER`.**

## Authorities

- Frozen Hero: `agent/proai-ai-systems-hero-clean-transplant-r1` / `38ecb13e1a0d6b5814748d7741ba99ef58197e6b`
- R3 source: `agent/proai-boxes-hover-neutral-light-material-r3` / `19ba191b499c347a67987d93ebe0e3e29c4b88d6`
- Review base: `agent/proai-ai-systems-hero-r3-material-review-r1` / `ab1da88762bf09434d0be9cedef4cb7383056aba`
- Golden SHA-256: `c3bcabd43c232045b059704e8d4be57634314b7da2fcfa5ebbd448ee40a16798`
- R3 SHA-256: `1269ea60eb7725e59822ba2b9e789a2d9dd8956f557ffbbedfbb39e97a12c4d0`

## Same-session proof

Страница сама записала доказательные поля в `document.documentElement.dataset` после fresh boot:

- URL: `http://127.0.0.1:4179/owner-preview/ai-systems-hero-r3-material-context-review-r1.html`
- Browser UA: `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36`
- Chrome major: `152` (полный patch build через page-owned API не раскрыт)
- `isSecureContext`: `true`
- `navigator.gpu`: `true`
- `adapterAvailable`: `true`
- viewport: `1117×721`
- DPR: `2.4000000953674316`
- timestamps: `2026-09-05T01:15Z` серия fresh boots

Golden, current R3, Candidate A и Candidate B получили `status=ready`, WebGPU proof `true`, `143` Cube meshes и `143` material identities. Для каждого кандидата дополнительно выполнены center/edge pointer movement и pointer-leave settling.

## Phase A

Golden true-WebGPU boot прошёл. Golden REST видимее и сохраняет исходный цветовой optical response; Golden center hover — плотный и физически читаемый.

Current R3 true-WebGPU REST на фактическом viewport — `LIMITED`: нейтральный field почти исчезает без pointer interaction. Center hover, edge hover и settling — `PASS`.

Так как требуемый viewport 1440×900 не был доступен в той же WebGPU-сессии, Phase A не объявляется полным authoritative acceptance gate.

## Phase B bounded candidates

Базовый R3 Light Material не менялся. Cube Material lock сохранён:

- colorA `#C9CDD1`
- colorB `#020304`
- metalness `0.14`
- roughness `0.35`
- reflectivity `0.33`
- transmission `thickness=1`, `ior=1.5`, `roughness=2.7`

### Candidate A

Точный RGB midpoint между R3 Micro 2 и Micro 3 ceiling, без изменения alpha/steps/angle/opacity:

- `[0.6176470588235294, 0.6352941176470588, 0.6509803921568627, 1]` = 8-bit midpoint `[157.5, 162, 166]`
- `[0.5901960784313725, 0.6137254901960784, 0.6294117647058823, 1]` = 8-bit midpoint `[150.5, 156.5, 160.5]`
- `[0.7941176470588235, 0.807843137254902, 0.8215686274509804, 1]` = 8-bit midpoint `[202.5, 206, 209]`

SHA-256: `3888981f9f06fe1c89b282d8e19eb3bacd2a9de0c363dae115827a7763afdfed`

Результат: fresh WebGPU boot `PASS`; runtime invariants `PASS`; center/edge/settling `PASS`; REST visibility `FAIL` — lift недостаточен.

### Candidate B

Разрешённый Micro 3 ceiling:

- `#A5A9AD`
- `#9CA3A7`
- `#D0D3D5`

SHA-256: `4a4d321fec7161e9d2782da32ba96bdaa7f09619d371b88b0e06cd7b79f0c1ff`

Результат: fresh WebGPU boot `PASS`; runtime invariants `PASS`; center/edge/settling `PASS`; REST visibility `FAIL` — даже максимальный разрешённый lift остаётся слишком слабым. Candidate B не выбран.

## Semantic diff

Оба кандидата декодированы повторно. В каждом случае:

- изменены только RGB leaves в `root.scene.objects.0.children.3.data.material.layers.1.data.colors.*`
- изменено 30 RGB leaves из-за повторения трёх уникальных stop colors по десяти позициям
- alpha, steps, angle, offset, morph и opacity не изменялись
- disallowed semantic changes: `0`
- roundtrip disallowed changes: `0`
- Golden/R3 input files не перезаписывались
- runtime material mutation не использовалась

## Visual / runtime QA

| Состояние | R3 | Candidate A | Candidate B |
|---|---:|---:|---:|
| REST presence | LIMITED | FAIL | FAIL |
| CENTER HOVER | PASS | PASS | PASS |
| EDGE HOVER | PASS | PASS | PASS |
| POINTER LEAVE / SETTLE | PASS | PASS | PASS |
| 143 Cube meshes | PASS | PASS | PASS |
| 143 material identities | PASS | PASS | PASS |

Console содержит только известную Spline/Three WebGPU validation error `ShadowDepthTexture` (`Destroyed texture ... used in a submit`); новых ошибок загрузки, crash или invariant mismatch не обнаружено. Ошибка сохранена как известная runtime warning condition и не маскируется.

Pixel metrics `mean/median/p95/coverage/clipping` не публикуются как authoritative: CUA same-session screenshot возвращается только в UI и не доступен этому worktree как байтовый файл, а локальные 1440 screenshots из отдельного Puppeteer процесса имеют `adapterAvailable=false` и запрещены к финальному visual approval. Числа не выдумывались.

## Что изменено

- добавлена page-owned WebGPU proof metadata в preview runtime
- добавлены два read-only serialized candidate payloads
- добавлены Candidate A/B fresh-boot режимы в локальный preview
- добавлен этот отчёт
- Hero, copy, framing, camera, geometry, events, Cube Material, Golden и R3 payload не менялись

## Preview / evidence limitation

Preview server запущен на `0.0.0.0:4179` и проверен HTTP 200:

- Localhost: `http://127.0.0.1:4179/owner-preview/ai-systems-hero-r3-material-context-review-r1.html?mode=r3`
- LAN HTTP smoke: `http://10.0.0.204:4179/owner-preview/ai-systems-hero-r3-material-context-review-r1.html?mode=r3` → HTTP 200; WebGPU по LAN не проверялся и не заявляется, поскольку HTTP по IP является insecure context

Требуемые phone-accessible GitHub composite/MP4 не создавались из запрещённых non-WebGPU captures. Inline same-session screenshots были просмотрены в Chrome UI, но не считаются 1440×900 committed evidence.

## Stop condition

Не продолжать тюнинг. Следующий безопасный шаг — получить real system Chrome same-session CDP/viewport `1440×900` (secure localhost), повторить Golden/R3/A/B evidence и pixel-support. Если даже B остаётся слабым, нужен отдельный owner-approved материал/lighting task; Hero, семантика, Indigo/Pearl и production integration не начинать.
