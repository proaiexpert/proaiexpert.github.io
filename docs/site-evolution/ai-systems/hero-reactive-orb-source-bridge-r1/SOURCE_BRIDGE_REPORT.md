# Reactive Orb Source Bridge R1 — отчёт

**Статус: HOLD.** Замороженный донор подтверждён и защищённая локальная копия проверена. Отдельный проект Spline создать не удалось; runtime/export bytes в репозиторий не получены. Переход к адаптации не разрешён.

## База и границы

- Репозиторий: `proaiexpert/proaiexpert.github.io`
- Свежая `main`: `bd4b01ed73464615a794038982989b109bfb47db` (сверена через GitHub API в текущем запуске).
- Source bridge branch уже существовала, была создана непосредственно от этой `main`; предыдущий HEAD: `f5fb26dc89d6e97847ebfcdea42f28b308779623`.
- Донор — оригинальный **Reactive Orb** автора **Vlad Kolokolnikov**. На Community странице ранее наблюдалась file-specific лицензия **CC BY 4.0**; это фиксация отображённой метки, не юридическое толкование.
- Главный канонический документ: `docs/site-evolution/ai-systems/hero-reactive-orb-authority-r1/PROJECT_AUTHORITY.md`; ограничения и следующие этапы следуют `DONOR_RECORD.md`, `NEXT_IMPLEMENTATION_STAGE.md`, а причина Phase A HOLD — `hero-reactive-orb-signature-r1-donor-fidelity/IMPLEMENTATION_REPORT.md`.
- Ни исходная сцена, ни production, ни `main` не редактировались. Clearance tile/shell эскизы не продолжались.

## Защищённый локальный исходник

Файл `proai_reactive_orb_donor_original_2026_10_05.spline` найден, читается; размер **64,846 bytes**, SHA-256 **7E69759DBD339EC5E481D018731DB9820AE767DA46E7CF0ED819D7C7894B0F84**.

Отдельная копия `proai_reactive_orb_signature_r1_working.spline` уже находилась в защищённом локальном архиве. Её первоначальный SHA-256 и размер совпали с донором. После проверки копии замороженный исходник проверен повторно; hash снова совпал. Путь намеренно не публикуется в этом документе; он известен владельцу. Оба файла остаются local-only и не включены в Git.

## Spline UI и рабочий проект

Owner-authenticated Remix открыт в Spline только для чтения и инвентаризации. Меню `Open / Import` отображало штатную плитку импорта `.spline scene`, но текущая browser-control среда не показала/не дала управлять системным выбором локального файла. Встроенный `Duplicate File` показал тарифный экран; он был закрыт без покупки. Поэтому separate working project с именем `PROAI REACTIVE ORB — SIGNATURE R1 — WORKING` и его URL не созданы/не подтверждены.

В исходном Remix не менялись материалы, цвета, свет, камера, геометрия, события, состояния, анимация или параметры publish. Выбор строк и открытие read-only панелей не сохраняли изменений намеренно.

## Публичный baseline

В отдельной вкладке загрузился опубликованный донор: https://my.spline.design/proaireactiveorbdonororiginal20261005-tNW94akGzluKeBFXuZZwlsyM/.

Наблюдения в браузере (это baseline публичной сцены, не proof repo parity):

- **REST:** bead-сфера компактна и тёмная.
- **Pointer response:** при наведении/клике внутри сферы beads заметно подсветились/перестроились.
- **Return:** при переносе указателя за пределы сферы публикация показала краткое раскрытие частиц и затем восстановилась в компактную сферу.
- Состояние после возврата отображалось повторно. Снимки были видны в браузере во время проверки, но не удалось сохранить их как файлы в evidence/ветке.

## Runtime и экспорты

- В панели Viewer отображался runtime URL: `https://prod.spline.design/sH5GiugwHqy0gA4X/scene.splinecode`.
- Прямой обычный запрос URL в браузере завершился `ERR_BLOCKED_BY_CLIENT`; прямой unauthenticated GET из shell не разрешился через DNS; web-fetch также сообщил URL недоступен. Не применялись обходы, cookies, токены, auth headers или private API.
- Code Export: пресет `Vanilla js (Web Content)`; `Download ZIP` и `Download Bundled ZIP (Web Content)` отключены. Runtime bytes не получены.
- Viewer показывает штатный embed/runtime snippet и `Update Viewer`; экспортного файла нет. Viewer не обновлялся.
- 3D Formats показывает GLTF / Color & Texture и список ограничений: геометрия, ограниченная анимация position/scale/rotation, color layer и базовые текстуры; lighting, post-processing, physics, environment, states/events/interactivity, assets/components/variables не поддерживаются. Кнопка говорит `Upgrade to export`; GLTF/GLB не покупался и не экспортировался.
- Меню также показывает Image (JPG/PNG), Video (MP4/WEBM), STL и `Save a local copy`; другие файлы не экспортировались.
- Не обновлялся Public URL, Viewer, Play Settings и никакие scene settings.

## Инвентаризация и доказательность

Факты из видимых панелей и пробелы отделены в `SOURCE_INVENTORY.md`. Полная инвентаризация именно импортированного рабочего проекта не завершена, потому что он не был создан. Текущие owner-remix UI данные не следует считать доказательством совпадения local file и облачной scene.

## Безопасность, parity, передача

**SECRET AUDIT: PASS (применимость ограничена).** Runtime/export пакеты отсутствуют; поэтому проверены только текстовые файлы этой записи. В них нет credentials, cookies, tokens, auth headers, browser/session data, email/username аккаунта или Owner Remix private URL. Указан только публичный runtime URL и общие имена/хэши local-only файлов.

- Runtime parity class: **D — NO USABLE ACQUISITION**.
- Repo asset/preview: отсутствует.
- REST, interaction и return/reformation parity репозиторного runtime: **UNVERIFIED**, поскольку runtime в репозитории отсутствует.
- Публичный runtime baseline наблюдался, но не заменяет repo parity.
- Обычный GitHub implementation chat не может продолжить по repo assets; понадобится штатный локальный импорт `.spline` в Spline, создание отдельного проекта и новый легитимный runtime/export путь.
- Реализация, адаптация, материалы, свет, камера, движение и Hero integration не начинались.
- `main`, production, merge и публикация не затронуты.

## Следующее действие

В Spline UI вручную импортировать указанный локальный working-copy file в отдельный проект (если локальный file chooser доступен владельцу), убедиться, что frozen donor не изменён, и проверить штатные export entitlements без покупки. До появления отдельного проекта и safe, repository-accessible runtime остаётся **HOLD**.
