# Boxes Hover — native Spline runtime validation R1

Дата проверки: 2026-09-02, Windows, Chrome extension connection to the installed system browser.

## Бинарный результат

**STATUS: ORIGINAL RUNTIME MISMATCH**

Exact scene asset загружается и WebGPU работает в системном Chrome, но официальный Viewer embed не совпал с Public Original по framing и по наблюдаемому pointer response. Реконструкция запрещена и не выполнялась.

## Git / scope

- Remote `origin/main` на момент проверки: `55788322f7f9079da6bbe28dec9eb789a6cb337e`.
- Рабочая ветка evidence: `agent/proai-boxes-hover-native-runtime-validation-r1`.
- HEAD ветки на момент начала: `ec181837bf95bc2cad4068974e3393fcbfeb4b99`.
- Main не изменялся, merge/push/deploy не выполнялись.
- Производственные страницы и product code не изменялись.

## System browser / GPU

- Chrome: `C:\Program Files\Google\Chrome\Application\chrome.exe`, `152.0.7977.64`.
- Edge также обнаружен: `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`, `152.0.4191.53`; в этой проверке не использовался.
- GPU, обнаруженный Windows: `Intel(R) UHD Graphics 630`, driver `31.0.101.2127`; также установлен `NVIDIA GeForce GTX 1650`, driver `32.0.15.6614`.
- `navigator.gpu`: **PASS**.
- `requestAdapter()`: **PASS**; adapter object returned, `maxTextureDimension2D: 16384`, WebGPU feature set returned, adapter name exposed as `null`.
- WebGL context: **PASS**, page telemetry returned `WebKit WebGL` / `WebKit`.
- `chrome://gpu`: **NOT READ** — Chrome connector URL policy blocks internal `chrome://` navigation; bypass was not attempted. This is an instrumentation limitation, not substituted with bundled Chromium.
- Аппаратный WebGPU runtime фактически отрисовал сцену; software-only fallback не использовался.

## Network / provenance

- `https://prod.spline.design/qM1zaX9eZ9RVFr6r/scene.splinecode`: **PASS**, HTTP `200`, `46359` bytes, `application/json`.
- `https://cdn.spline.design/`: direct root probe returned HTTP `403`, но exact Viewer module загрузился в браузере.
- `https://my.spline.design/`: direct root probe returned HTTP `403`, но exact Public Original открылся в браузере.
- Viewer runtime requests recorded in page telemetry:
  - `https://cdn.spline.design/@splinetool/viewer@2.0.27/build/spline-viewer.js`
  - `https://prod.spline.design/qM1zaX9eZ9RVFr6r/scene.splinecode`
  - `https://cdn.spline.design/@splinetool/viewer@2.0.27/build/opentype.js`
- CDN Spline Viewer `@splinetool/viewer@2.0.27`: **PASS**.

## Runtime checks

Проверены REST, center hover, edge hover, live pointer path и pointer leave/settling. Для визуальной сверки использован один и тот же системный Chrome и одинаковые pointer phases; connector не удержал фиксированный `1440×900`, поэтому фактические CSS viewport telemetry различались по surface (`1600×661`, DPR `2.4` для localhost Viewer; `1280×585`, DPR `3` для Public Original). Это отмечено как риск сравнения, но не объясняет наблюдаемый material mismatch hover response.

| Проверка | Результат | Наблюдение |
|---|---|---|
| Official Viewer runtime | PASS с оговоркой | Сцена полностью отрисовалась из exact scene URL. |
| Public Original | PASS | Страница `Boxes Hover` полностью открылась. |
| REST match | FAIL | Различаются framing/viewport chrome; Public Original имеет Spline badge. |
| Center hover match | FAIL | Public Original поднимает заметную cyan/blue/violet box composition; Viewer в нормализованной center phase остаётся в rest-представлении. |
| Edge hover match | FAIL | Viewer показывает иной cyan/blue row; Public Original — другую violet/cyan box composition. |
| Live pointer match | FAIL | При одинаковом типе движения поле реагирует по-разному. |
| Settling / release match | FAIL | После leave состояния и остаточные box silhouettes различаются. |
| Field / geometry | FAIL | Base star/field присутствует в обоих, но hover-revealed field composition не совпадает. |
| Height / depth | FAIL | Визуальная box height/depth hierarchy при hover различается. |
| Camera / composition | FAIL | Framing и размещение основной композиции различаются на фактических browser surfaces. |
| Colors / lighting | FAIL | Обе сцены используют dark/cyan/violet language, но световые акценты и раскрываемая composition различаются. |

## Console QA

Public Original: ошибок/предупреждений через доступный tab console log не зафиксировано.

Official Viewer: зафиксирована повторяющаяся hard console error, не скрытая в отчёте:

`THREE.WebGPURenderer: Uncaptured WebGPU GPUValidationError: Destroyed texture [Texture "ShadowDepthTexture"] used in a submit.`

Ошибка пришла из `https://cdn.spline.design/@splinetool/viewer@2.0.27/build/spline-viewer.js`; она не остановила видимый рендер и не превратилась в scene load failure. Поэтому Viewer runtime отмечен как функционально загрузившийся с оговоркой, а не как clean console PASS.

## Evidence

- [01-viewer-initial-rest.png](01-viewer-initial-rest.png)
- [02-public-original-rest.png](02-public-original-rest.png)
- [03-viewer-center-hover.png](03-viewer-center-hover.png)
- [04-public-center-hover.png](04-public-center-hover.png)
- [05-viewer-edge-hover.png](05-viewer-edge-hover.png)
- [06-public-edge-hover.png](06-public-edge-hover.png)
- [07-viewer-after-pointer-leave.png](07-viewer-after-pointer-leave.png)
- [08-public-after-pointer-leave.png](08-public-after-pointer-leave.png)
- Видео `09`/`10` не создавались: доступный browser API не предоставил recorder; fake video из screenshot sequence не использовалось.

## Non-use / next gate

- Manual reconstruction: **NO**.
- GLB as visual authority: **NO**.
- Three.js reconstruction / BoxGeometry / InstancedMesh / manual hover: **NO**.
- ProAI adaptation: **NO**.
- ProAI Cube touched: **NO**.
- Main product code modified: **NO**.
- Merge: **NO**.
- Deploy: **NO**.

Следующий gate: Owner должен решить, считать ли exact scene asset достаточным donor authority несмотря на mismatch официального Viewer embed. До отдельного разрешения product development не начинать.
