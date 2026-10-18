# R3.0 — Golden R5 × Reactive Orb Hero Lab

## STATUS — PARTIAL

Рабочий изолированный EN/RU прототип опубликован и проверен в Chrome. Это кандидат для Controller/Owner review, не финальное визуальное одобрение и не production release. Маршрут: Codex escalation (Jekyll, локальный сервер, браузерные жесты и скриншоты). Независимый Reviewer в этой задаче не запускался.

## Authority / Git

- Fresh main: `0e2a484fef96d88735c5b34216af0f69b8fc0c81`.
- R5 base: `f394a3d45de129b4f4b21b41050edf34f8c95804`.
- Source branch: `agent/ai-systems-r5-orb-hero-lab-r1`, создана точно от R5.
- Orb documentation authority: `e2de8ff65060fb6de2869d2a207e38d693207bef`.
- Compiled-only preview branch: `ai-systems-orb-lab-preview`.
- Preview commit: `cfd321ea730f1121e5e4210adcc347b2a76d7a1d`.
- Implementation HEAD: смотреть commit, содержащий этот отчёт; не подставляется вымышленный self-referential SHA.

## Реальные Owner Preview

- [EN](https://ai-systems-orb-lab-preview.proaiexpert-github-io.pages.dev/owner-preview/ai-systems-r5-orb-hero-lab-r1/)
- [RU](https://ai-systems-orb-lab-preview.proaiexpert-github-io.pages.dev/owner-preview/ai-systems-r5-orb-hero-lab-r1/ru/)
- [Неизменяемый deployment EN](https://c9eb847c.proaiexpert-github-io.pages.dev/owner-preview/ai-systems-r5-orb-hero-lab-r1/)
- [Исходный Golden R5 для сравнения](https://ai-systems-orb-lab-preview.proaiexpert-github-io.pages.dev/owner-preview/ai-systems-r5-release-candidate-r1/)

Cloudflare Pages check подтвердил deployment success. После этого проверены сами публичные страницы, а не только статус.

## Реализация

Скопированы полные исходные EN/RU R5 страницы в новые lab routes. Заменена только Hero visual. Общие R5 CSS/JS, header/footer includes, утверждённые H1/lead/CTA и остальные секции не редактировались. Локальные language switch ссылки ведут между EN/RU lab. Canonical/hreflang production ссылки сохранены; preview остаётся noindex/nofollow.

Используется официальный `<spline-viewer>` 2.0.90 WebGL build с настоящим `scene.splinecode`, `events-target=local`, прозрачным embed-фоном. Scene geometry, material setters и event API не используются. Существующие 250 элементов и реакции приходят из опубликованной сцены; независимый пересчёт объектов внутри runtime не выполнялся. Spline badge сохранён.

Hero grid имеет равные desktop колонки; на tablet/mobile объект идёт после текста/CTA. Контейнер квадратный, без растягивания геометрии и прежнего iframe с pointer-events:none. Прозрачный canvas визуально согласуется с тёмным R5. Добавлены пауза/повторный запуск 3D, status live region, локализованная инструкция, атрибуция и настоящий статичный кадр опубликованного Orb.

## Interaction / scroll

REST → PRESS → DRAG → RELEASE → RETURN выполнены через Chrome input, desktop и touch. На local mobile drag получено выраженное пространственное раскрытие; кадр `mobile-390-touch-drag.jpg`. После отпускания сфера снова связная; опубликованные return кадры также сохранены. Оригинальная амплитуда/тайминги не изменялись, количественная motion-parity с отдельным Viewer не заявляется.

Первая проверка вертикального touch выявила отсутствие прокрутки. Добавлен пассивный capture handler: вертикальное движение >8px и >1.2× горизонтального не передаётся обработчикам сцены. `preventDefault` не используется. Canvas touch-action: pan-y pinch-zoom. Горизонтальный drag остаётся у сцены. После исправления local scrollY 812.50 → 943.75; на публичном Preview 649.67 → 774.67. Никакой глобальный reset или новые события Spline не добавлены.

## QA

- Public Chrome CSS viewports: 1440×900, 1366×768, 768×1024, 390×844, 375×812. Горизонтального overflow нет.
- EN и RU публично загрузились; настоящий ProAI header/footer, локализованные тексты и switch ссылки присутствуют.
- Публичный Viewer: data-ready=true, url соответствует требуемому runtime, материал визуально загружен.
- Anchor «See how it works» реально перевёл к #operational-register, scrollY≈1192.
- Локально эмулирован prefers-reduced-motion: reduce: viewer отсутствует, poster opacity=1, доступна кнопка Enable 3D. Отключение 3D удаляет viewer.
- Локально блокировался CDN Viewer через штатный DevTools Network: показано сообщение об ошибке и статичный объект; viewer отсутствует. Блокировка затем снята.
- Все последующие main sections byte-identical R5; Hero copy block byte-identical. Результаты в STATIC_QA.json.
- Существующие Controlled Agent Reference tests: 7/7 PASS. Источники reference runtime не менялись.
- Физический iPhone НЕ тестировался. Длительный GPU/performance soak и все браузеры НЕ тестировались.

Локальный Chrome использовал 80% zoom: часть ранних evidence имеет viewport на 1px ниже цели. Публичные QA размеры повторены на новом домене при 100% и подтверждены innerWidth/innerHeight. Имена ранних local файлов не заменяют точные public проверки.

## Jekyll / deployment

Jekyll 4.3.4 на установленном Ruby 3.3.12 собрал полный сайт. В Cloudflare передан скомпилированный output, а не исходные шаблоны. Существующая настройка Cloudflare no-build/root не менялась. Отдельная preview mirror branch не является источником production-кода. YAML front matter и Liquid в EN/RU compiled output отсутствуют; это также проверено в публичном DOM.

Повторная сборка:

```powershell
& 'C:\Users\PC Profile\Documents\ProAI_System_Trace_R1_Tooling\ruby-devkit-3.3.12\bin\ruby.exe' -e "load Gem.bin_path('jekyll','jekyll','4.3.4')" -- build --source . --destination '..\ai-systems-r5-orb-hero-lab-compiled'
```

Для новой публикации обновлять только существующую preview mirror ветку обычным commit/push compiled output. Не отправлять этот mirror в main.

## Console / ограничения

Наблюдались существующие предупреждения logo Three.js `sigmaRadians ... clip` и Spline: classic WebGL не отображает PBR metalness/normal/AO/emissive maps. Новых необработанных integration JS ошибок в просмотренных логах не обнаружено; намеренно заблокированный CDN — отдельный ожидаемый error test. WebGPU parity не заявляется.

Chrome один раз надолго завис при диагностике/снимке тяжёлой сцены. Это не считается PASS производительности. Дальнейшие простые DOM проверки и native screenshots работали. Нужна отдельная оценка производительности на физическом iPhone.

## Визуальное сравнение / remaining issues

Orb создаёт значительно более выраженный самостоятельный 3D акцент, чем исходная абстрактная схема R5. Сохранены тёмный металл, серебряные блики и исходное движение. Геометрия видна целиком внутри контейнера, без растяжения и донорского текста/CTA.

Однако крупный длинный R5 H1 и lead остаются высокими: на desktop 1366×768 часть Hero ниже первого экрана; на mobile Orb появляется после текста/CTA. Это контентная высота, а не fullscreen black Viewer. Типографика и copy не менялись. Owner должен решить, подходит ли такой порядок/ритм. Статичный fallback имеет исходный чёрный фон; live canvas прозрачный. Free Spline badge остаётся видимым. Маленькие активные элементы могут быть тёмными — существующее ограничение R2.7/R2.8, здесь материалы не правились.

Видео в этой итерации не записывались; доказательства — реальные последовательные скриншоты и зафиксированные жесты/scroll measurements. Не выдавать их за непрерывную видеозапись. Desktop drag кадры не доказывают одинаковую силу деформации при каждом жесте.

## Evidence / exact files

Все изменённые source файлы и evidence перечислены в FILES_CHANGED.txt. SHA-256 каждого снимка и poster — SHA256SUMS.txt. Главные кадры: public-en-desktop-1440-rest.jpg, public-en-mobile-390-rest.jpg, mobile-390-touch-drag.jpg, public-en-mobile-390-return.jpg, public-ru-mobile-375-orb.jpg, public-r5-baseline-desktop-1440.jpg.

Attribution: Reactive Orb — Vlad Kolokolnikov. Original Community license observed CC BY 4.0. R3 — интеграция существующей Owner Studio Titanium адаптации. Editable .spline, auth/session data и vendor bundle в source commit не включены.

## Next exact step

Controller/Owner сравнивают EN/RU lab с исходным R5 и проверяют drag/scroll на физическом iPhone. Затем свежий независимый Reviewer проверяет actual branch diff. До решения не менять Golden R5 release branch, Spline или production.

MAIN MODIFIED: NO
PRODUCTION MODIFIED: NO
R5 SOURCE BRANCH MODIFIED: NO
SPLINE PROJECT MODIFIED: NO
MERGE: NO
PAID UPGRADE: NO
