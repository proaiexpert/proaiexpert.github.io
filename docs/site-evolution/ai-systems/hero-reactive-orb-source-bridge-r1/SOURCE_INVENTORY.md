# Source Inventory — частичная инвентаризация

**Область наблюдения:** Owner-authenticated Spline Remix с названием `PROAI — Reactive Orb — DONOR ORIGINAL — 2026-10-05` и отдельный публичный runtime. Из-за невозможности импортировать локальную рабочую копию это не является полной инвентаризацией отдельного working project.

## OBSERVED — факты в интерфейсе

| Поле | Наблюдение |
|---|---|
| Scene | `Scene 1` |
| Камера | `Personal Camera` для scene/play; Preview также показывал `Personal Camera` |
| Frame | Size `Responsive`; Auto Zoom = No |
| Верхний уровень иерархии | `BG Event`; группа `CTA`; группа `Text`; `Сursor Event`; группа `Clones Event`; компонент `Instance` |
| Clones | В раскрытой группе перечислены `Clone 0`…`Clone 249`: 250 именованных дочерних групп. Фактический Spline Cloner object/count/config не был показан; 250 — число видимых групп, не заявка о настройке Cloner. |
| Source component | У Clone 0 отображается компонент `Instance`. Внутренняя геометрия компонента в доступных панелях не раскрыта; тип исходного примитива неизвестен. |
| Cursor shape | Для выбранного `Сursor` видимы Shape Size 296.59 × 296.59 × 296.59, Sides X=16/Y=16, Slice Y=180. Эти значения относятся к Cursor shape, не к Instance source geometry. |
| Cursor Follow | У Cursor видна кнопка/радио `Follow`, значение не выбрано. Связь и параметры поведения не установлены. |
| Instance material layers | Для компонента `Instance` видны слои Lighting 60 / Normal, Fresnel 100 / Normal, Depth 100 / Normal. Число уникальных material assets во всей сцене неизвестно. |
| Clones states/events | На выделенном `Clones` видимы состояния `Base State`, `State`, событие `Start`. На BG, Cursor и Clones видна кнопка Event. Под каждым раскрытым Clone интерфейс показывает вложенную группу `Group Event`; полные связи и переходы не проверены. |
| Scene toggles | В inspector видимые toggles Effects, Fog, Sky, Ambient Shadows = off. Scene BG Color показывает `000000`. |
| Play/Viewer publish | Main Scene `Scene 1`; Camera `Personal Camera`; Renderer `WebGPU Only`; Async Shaders = Yes; Logo = Yes; Loading Preview = No; Loading = None; Hint = None. |
| Viewer input | Mouse Events = `Local (Canvas Container)`; это значение было видно в Viewer settings. |
| Play settings | Page Scroll = No; Cursor = Default; Orbit/Pan/Zoom/Soft Orbit = No; Trigger = `Stop At Object`; Glass Precision = Normal; Mobile/Desktop Pixel Ratio = Auto (Default); Compression = on; Geometry Quality = Default; Image Quality = 70; Preload = Yes. |
| Public runtime behavior | Состояние покоя, локальная реакция на указатель внутри Orb и возврат/переформирование после уноса указателя наблюдались в публичном runtime. Подробная механика в Spline event/timeline панели не определена. |

## UNAVAILABLE / NOT EXPOSED

- Отдельный Spline working project, его имя/ID/URL и подтверждение импорта рабочей локальной копии.
- Внутренняя mesh/primitive геометрия `Instance`; точное число и конфигурация Spline Cloner.
- Детали Follow и Distance, targets/constraints, event bindings, state transitions, easing, spring/damping.
- Idle animation, global rotation и точный return/reformation механизм на уровне timeline/event.
- Полные материалы/цветовые значения и общее число уникальных материалов; световые объекты, их количество и параметры; environment scene assets.
- Параметры камеры, кроме названия `Personal Camera`.
- Renderer/runtime compatibility вне показанного `WebGPU Only`, DPR values вне Auto, device-specific behavior.
- Runtime bytes, их size/hash и самостоятельный repo-side воспроизводимый preview.

## EXPORT METHODS CHECKED

- **Public URL:** опубликованный owner remix открывается и runtime реагирует в браузере.
- **Viewer:** UI показывает URL `https://prod.spline.design/sH5GiugwHqy0gA4X/scene.splinecode`, Viewer v2.0.75 snippet, `Update Viewer`, Play Settings. Сцена не обновлялась. Байты стандартным URL request недоступны из среды.
- **Code Export:** `Vanilla js (Web Content)`; ZIP и bundled ZIP disabled.
- **GLTF / GLB:** формат GLTF и material `Color & Texture`; доступна только кнопка `Upgrade to export`. Export не выполнялся и покупка не совершалась.
- **Other menu formats:** Image JPG/PNG, Video MP4/WEBM, STL, Save a local copy видны. Файлы этих форматов не экспортировались.
- Значение/содержание локального `.spline` не анализировалось через бинарные маркеры; hash подтверждает лишь идентичность сохранённой копии, не структуру или облачную синхронизацию.

## EVIDENCE

В браузере во время проверки были визуально показаны три baseline состояния опубликованного Runtime: REST → pointer response → return/reformation. Сами screenshots не сохранены в Git из-за отсутствия поддерживаемого пути передачи UI screenshot в рабочую файловую область. Они не относятся к импортированной working copy.
