# PREMIUM CHOREOGRAPHY R1 — отчёт

## Статус

`PREMIUM CHOREOGRAPHY R1 LIMITED`

Собран review-only прототип одной live-сцены на точном serialized Boxes Hover runtime. Native state transitions и интерактивный review-flow работают технически, но визуальная art-direction проверка ограничена: в доступном Chrome viewport исходное поле в rest остаётся слишком тёмным и разреженным, поэтому пятиступенчатый маршрут нельзя честно объявить достаточно очевидным для iPhone.

## Authority и границы

- Repository: `proaiexpert/proaiexpert.github.io`
- Base: `6ebe7475045743ae5fb03790c41c82dd2ada741d`
- Branch: `agent/proai-boxes-hover-premium-choreography-r1`
- Runtime: `@splinetool/runtime@2.0.27`
- Source payload: `docs/site-evolution/ai-systems/boxes-hover-semantic-premium-r2/state-base.bin`
- Generated choreography payload: `premium-choreography-r1.bin`
- Generated payload SHA256: `8c810261638d1c9e7d78c2264342209e28344a1c32b5e8751edf9daf2489b3a5`
- Generated payload size: `50,003` bytes

Frozen Hero shell, approved EN/RU copy, camera, geometry, donor hierarchy, events, Cube Material и Light Material не переписывались.

## Механизм animation

До runtime boot четыре выбранных `Instance` получают native serialized `data.states` с source-compatible material overrides. Для каждого рабочего stage сериализованы состояния `Indigo` и `Silver`; `Decision Gate` остаётся существующим отдельным Pearl endpoint. После одного `Application.start()` используется официальный runtime surface `object.transition({ to, duration, easing }).play()`.

После завершения native transition применяется только официальный `object.state` для фиксации уже достигнутого serialized state перед следующим шагом. Это не material replacement и не Three.js mutation: `setMaterial()`, `createCustomMaterial()`, BoxGeometry и реконструкция donor не использовались.

Открытие занимает примерно 5.4 секунды в текущем последовательном review-прототипе: короткий rest, четыре пары Indigo → Silver и финальный hold. Это допустимый R1 proof, но timing требует отдельного motion-pass перед production choreography.

## Route

Сохранён существующий adjacent right-side route; reselect не потребовался.

| Stage | Instance ID | Serialized path | Position |
|---|---|---|---|
| 01 AI AGENT | `46154286-13e1-464a-a27c-84bd720a9cce` | `root.scene.objects.0.children.2.children.97` | `[200, 0, 250]` |
| 02 AUTOMATION | `889ba072-8c04-4fa0-80f7-5c32e26dd963` | `root.scene.objects.0.children.2.children.110` | `[200, 0, 150]` |
| 03 API | `9d07611a-c5ce-4020-abf0-dd0f4ca95d89` | `root.scene.objects.0.children.2.children.129` | `[200, 0, 50]` |
| 04 CUSTOM CODE | `1687f9e7-cac3-4b61-b5f6-a6dd86082fff` | `root.scene.objects.0.children.2.children.142` | `[200, 0, -50]` |
| 05 DECISION GATE | `b3dc4e58-17e8-4fe9-a3f9-d22065e088fa` | `root.scene.objects.0.children.2.children.84` | `[200, 0, -150]` |

Почему маршрут не менялся: это уже доказанная coherent straight-line cluster с сохранёнными donor placements и минимальным риском camera/framing drift. В R1 не добавлялись новые объекты и не создавалась manual grid.

## Material recipes

- Neutral / inherited R2: graphite/silver base `#9AA1A8 / #020304`.
- Active Indigo: `#676BFF / #020304`, с тем же native physical/transmission structure.
- Resolved Silver: `#C9CDD1 / #020304`.
- Decision Gate: существующий Pearl endpoint `#F2F0EB` family.

`Pearl` никогда не назначается Indigo. Global Cube Material и Light Material в generated choreography source не менялись.

## Interaction model

- Autoplay запускается автоматически после fresh payload boot.
- После окончания autoplay кнопки stage позволяют выбрать semantic focus.
- Pointer/touch outside focus возвращает final Silver trail + Pearl Gate.
- Replay делает новый проход той же Application instance; duplicate Application boot блокируется guard-ом.
- Desktop native donor hover остаётся включённым; поверх него не добавлялся camera parallax.
- Labels показывают только текущий active/resolved/gate context; permanent label forest, leader lines и cards не добавлялись.

## Review page

Файл: `owner-preview/premium-choreography-r1.html`

Поддерживаемые query:

- `?lang=en&view=hero`
- `?lang=ru&view=hero`
- `?lang=en&view=focus`
- `?lang=ru&view=focus`

На странице есть только review controls: `FOCUS / HERO / REPLAY / EN-RU` и пять stage focus buttons. Hero mode использует approved shell и copy; Focus mode использует тот же runtime/choreography без отдельной сцены.

## QA

Проверено в реальном secure localhost Chrome с WebGPU:

- `isSecureContext`: true
- `navigator.gpu`: true
- adapter: доступен
- runtime status: ready
- Cube Meshes: `143`
- Instance roots: `142`
- payload SHA check: PASS
- EN boot: PASS
- RU boot: PASS
- replay: PASS
- API focus: PASS
- Gate focus: PASS
- `Pearl → Indigo`: не выполняется
- horizontal overflow в проверенном viewport: отсутствует
- duplicate scene/Application boot: не обнаружен
- fatal error после исправления native orchestration: отсутствует

Native hover/settling path сохранён и был проверен через canvas interaction. Отдельный real iPhone и точные `390×844` / `844×390` emulation surfaces в доступном browser backend отсутствовали, поэтому mobile visual PASS не заявляется.

## Art-direction verdict

Техническая последовательность и semantic state mechanism доказаны. Визуальный product gate — только LIMITED: на доступном desktop viewport Boxes Hover остаётся узнаваемым как поле точек/кубов, но rest density и contrast недостаточны для уверенного чтения маршрута `1 → 2 → 3 → 4` без review captions. Это продолжает известное ограничение R3 neutral base. Дополнительное глобальное осветление или новый material direction в этой задаче не выполнялись.

Поэтому R1 не считается готовым к production и не является основанием для финальной timed choreography approval. Следующий безопасный шаг — отдельный owner/coordinator decision по visibility/material treatment и только затем motion polish; текущая ветка останавливается здесь.

## Изменённые файлы

- `owner-preview/premium-choreography-r1.html`
- `owner-preview/assets/premium-choreography-r1.js`
- `scripts/ai-systems/boxes-hover/premium_choreography_r1.mjs`
- `docs/site-evolution/ai-systems/boxes-hover-premium-choreography-r1/premium-choreography-r1.bin`
- `docs/site-evolution/ai-systems/boxes-hover-premium-choreography-r1/choreography-evidence.json`
- этот отчёт

Main, production, frozen Hero branch и material R&D branches не изменялись. Merge и deploy не выполнялись.
