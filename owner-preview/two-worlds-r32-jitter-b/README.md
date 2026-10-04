# Two Worlds R5 R3.2 — изолированный эксперимент B

Это диагностический preview. Ни B1, ни эксперимент A не являются production authority.

- База: `26b3244f408ff09d052a4540bd7d07da82183df2`.
- Ветка: `agent/two-worlds-r32-jitter-b-compositor-isolation`.
- Результат A на iPhone владельца: **NO CLEAR IMPROVEMENT**. A не продвигать.
- Во всех вариантах B сохранён `IGNORE_SCROLL_PX=2`.
- Production-файлы JS/CSS/EN/RU не изменены. Все добавления находятся в этом namespace.
- B0 использует точный production runtime с отдельным cache-bust.
- B1 использует копию runtime, из которой удалены только две записи `important(ai/web,'clip-path',...)` в `renderMobile()`.
- `geometry()` продолжает рассчитывать clip-координаты. Это намеренно: изолируется применение clipping и его render cost, без изменения общей математики.
- Существующий mobile CSS даёт face `clip-path:none!important`. В B1 нет inline polygon, перекрывающего это правило. Статический clip и mask fold не изменены.
- B1 подписан **DIAGNOSTIC — NOT VISUAL AUTHORITY**. Перекрытие поверхностей и вид clipping во время поворота могут быть неверными.
- B2 **NOT JUSTIFIED**. B1b не создан: scroll/RAF/render cadence уже записан временными browser probes.

## SOURCE FACT

`renderMobile()` пишет transform и dynamic clip-path на одни и те же два `article.tw-r2__face`. Face занимает 104% ширины и высоты stage, имеет `overflow:hidden`, backface suppression и `will-change:transform,clip-path`. Viewport — sticky, `overflow:hidden`, perspective 1100px и isolation. Plate запрашивает preserve-3d и isolation. Face также запрашивает preserve-3d. Geometry, hinge, q/p и 3D transform строка остались неизменными.

Запрос preserve-3d не означает, что всё содержимое остаётся единой 3D-сценой: overflow hidden, clip-path, isolation и blend-mode являются grouping properties с flattening. Поэтому механически добавить wrapper недостаточно, чтобы гарантировать меньшую raster cost или визуальную идентичность. [CSS Transforms 2, grouping properties](https://www.w3.org/TR/css-transforms-2/#grouping-property-values).

Материалы содержат статическую SVG-noise текстуру с soft-light. Свет face и fold меняет opacity; fold имеет статические polygon и mask. Mobile filter fold отключён актуальным финальным override. Однократная moonlight-анимация длится 1.45s и не объясняет повторение дефекта при каждом проходе. Visibility пишет повторные значения внутри turn, а реально переключается у hinge lifecycle boundaries.

Точный активный render содержит 15 visual property setProperty calls; комментарий runtime про 12 устарел. B1 содержит 13. Никаких layout reads в этом render нет. Scroll callbacks сворачиваются в один RAF. Deadband сохранён. Existing `maxFrameDelta`/`frameSpikes` измеряют промежутки после deadband, включая паузы; это не GPU presentation telemetry.

Смещение fold = `-1.16 * stageWidth * deltaP`. Базовое горизонтальное смещение face = `-0.105 * 1.04 * stageWidth * deltaP` в portrait и `-0.085 * 1.04 * stageWidth * deltaP` в landscape. Отношение около 10.6 и 13.1 соответственно, без учёта изменения проекции rotateY/Z. Тонкая контрастная граница поэтому усиливает заметность пространственных шагов. Её удаление или smoothing этим экспериментом не предлагаются.

Нельзя по наличию polygon объявить полный reraster обеих face на каждом кадре iPhone. В текущем upstream WebKit `updateMaskingLayerGeometry()` имеет отдельный путь обновления shape-layer path при маске без drawsContent. Какой путь использует конкретная версия iOS с этими материалами и слоями, без устройства неизвестно. [WebKit RenderLayerBacking.cpp](https://github.com/WebKit/WebKit/blob/main/Source/WebCore/rendering/RenderLayerBacking.cpp).

## EMULATED MEASUREMENT

Подробные числа, контроль исходников и ограничения: [measurement-summary.json](measurement-summary.json).

Windows, headless Google Chrome 154 и Playwright WebKit 26.0; touch/mobile emulation, DPR 3. Размеры 393×750 и 852×390. Идентичная последовательность scroll-позиций вперёд/назад, 90 scroll events и 88 actual renders на каждый запуск. Chromium проверен двумя повторами, второй — с обратным порядком B1/B0. Перед замером у обоих вариантов одинаково выполнен существующий production resize/recompose при y=0 после загрузки и fonts.ready. Все наблюдатели временные, сняты после замера; они не загружаются в Owner preview.

q/p, transforms обоих face, fold, content opacity и visibility trajectories B0/B1 **совпали** во всех измеренных парах.

В повторном Chromium landscape запуске:

| Метрика | B0 | B1 |
|---|---:|---:|
| RAF p95 | 18.1 ms | 18.2 ms |
| Суммарное время Paint по странице | 109.23 ms | 65.12 ms |
| Суммарное время RasterTask по worker tasks | 19.28 ms | 17.25 ms |
| Paint events face AI / WEB | 92 / 91 | 6 / 3 |
| Layer paintCount face AI / WEB в финальном snapshot | 44 / 88 | 1 / 1 |
| Layer paintCount fold в финальном snapshot | 42 | 42 |

Это подтверждает дополнительную Chromium Paint работу dynamic clipping. Оно **не подтверждает** причину реального iPhone micro-jitter. Final layer paintCount является snapshot счётчиком, а не независимым числом presentation frames. CompositeLayers/DrawFrame durations и LayerTree.layerPainted events не были доступны в этой trace конфигурации; нулевые counts не означают отсутствие compositing.

В portrait суммарное Paint время не уменьшилось устойчиво: B0 73.53–91.40 ms, B1 79.06–94.93 ms; RAF p95 всех повторов 18.1–18.2 ms. Один первый Chromium landscape B0 запуск имел p95 72 ms, но это не воспроизвелось в обратном порядке; его нельзя выбирать как доказательство улучшения.

В Windows WebKit B1 оказался медленнее: RAF p95 portrait 417→572 ms, landscape 579→827 ms. Абсолютные интервалы этой среды чрезвычайно велики и не отражают iPhone. WebKit longtask observer/GPU Paint/Composite trace здесь недоступны. В Chromium longtask entries не обнаружены. Trace/probe overhead и изменение видимой площади B1 ограничивают сравнение.

Отдельно проверен следующий кандидат — cadence scroll→RAF→render: в повторных Chromium проходах внутренние изменения идут близко к RAF cadence; длительные render gaps совпали с повторяющимися входными позициями на разворотах. Одинаковые fold step distributions у B0/B1 исключают изменение математики самим B1. Finger-scroll delivery и отношение RAF к физическому display cadence на iPhone остаются неизвестными.

При fresh load cached territory может отличаться от settled DOM top. Это ранее существовавшее поведение, общее B0/B1; данный эксперимент его не исправляет. Для timed trace использован одинаковый штатный recompose, чтобы сравнивать видимую stage после стабилизации страницы.

## REAL-DEVICE UNKNOWN

Классификация причины: **UNKNOWN**. Сигнал B1 для причины micro-jitter: **WEAK**. Нет устойчивого улучшения frame cadence, оправдывающего B2. Desktop — regression/diagnostic guard, не iOS GPU authority.

Владелец сравнивает `b0/ru.html` и `b1/ru.html` либо EN `b0/` и `b1/`: медленно и быстрее, portrait/landscape, forward/reverse, несколько повторов. Смотреть отдельно на fold, clip edge и неподвижные визуальные детали больших face. B1 допускает неверный clipping, но не должен менять scroll mapping, perspective, transforms или fold trajectory.

Если B1 на iPhone не даёт явного улучшения, следующая узкая диагностика — реальные scroll-event timestamps, RAF timestamps, rendered Y/p/fold и display/paint timeline на том же устройстве. Для этого WebKit Inspector предлагает layer paint counts, compositing reasons и paint flashing; эти данные нельзя заменить Windows эмуляцией. [WebKit Layers Tab](https://webkit.org/web-inspector/layers-tab/).

Никаких merge, production PR, правок main, изменений PR #183/#184/#185 или продвижения A/B1. Preview ждёт Owner review.
