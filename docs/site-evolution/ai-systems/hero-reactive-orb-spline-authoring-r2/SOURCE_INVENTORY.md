# Source Inventory — Spline Authoring R2

## OBSERVED в R2

| Категория | Наблюдение |
|---|---|
| Chrome | Существующий локальный Chrome доступен; вкладки Spline уже открыты. |
| Авторизация | Owner Remix открылся в рабочем редакторе; Log In не требовался. |
| Owner Remix | `PROAI — Reactive Orb — DONOR ORIGINAL — 2026-10-05`; https://app.spline.design/file/88f4ebca-9bc8-4d85-a918-13a19c3b13ab |
| Community donor | Reactive Orb, Vlad Kolokolnikov; страница отображает CC BY 4.0: https://app.spline.design/community/file/306ca2a5-d1ab-46ac-a27c-198575c82db0 |
| Scene / hierarchy | `Scene 1`; верхние строки `BG Event`, `CTA`, `Text`, `Cursor Event`, `Clones Event`, `Instance`. |
| Import | Меню показывает `.spline scene`; выбор файла в исходном проекте не запускался. |
| Project / Remix | Community Remix и команда New 3D Scene открыли тарифный экран. Upgrade не нажимался. |
| Desktop/MCP | Отдельный Spline Desktop / подключённый Spline MCP не обнаружен в доступных локальных inventories. Spline page показывает CTA Connect with MCP; setup не выполнялся. |
| Frozen file | Существует и читается; 64,846 bytes; SHA-256 совпал с ожидаемым. |
| Local working-copy | Уже существовал отдельно; читается; 64,846 bytes; SHA-256 совпал с frozen donor. |
| Safety | Frozen donor и Owner Remix не редактировались. Independent working-project URL отсутствует. |

## VERIFIED HISTORY (Source Bridge R1; не переизмерено в R2)

- Ранее раскрытая группа содержала имена `Clone 0`…`Clone 249`: 250 именованных групп; это не доказательство Spline Cloner object/config.
- Для Instance были видны слои Lighting 60 / Normal, Fresnel 100 / Normal и Depth 100 / Normal.
- Для Clones видны Base State, State, Start; полные связи событий не подтверждены.
- Cursor Follow отображался выключенным; связь и значения Follow/Distance не подтверждены.
- Public donor runtime ранее показывал REST, локальную реакцию на указатель и возврат. Event/timeline механизм не подтверждён.
- Viewer settings ранее отображали Renderer WebGPU Only и Async Shaders Yes.
- Code Export ZIP disabled; GLTF/GLB требовал Upgrade; runtime bytes не сохранены.

## UNAVAILABLE в отдельном working project

Отдельного Spline-проекта нет; поэтому R2 не может подтвердить на копии полный hierarchy/Clone count, Cloner config, source primitive, native material settings, Follow/Distance, event transitions, easing/spring/damping, idle/rotation/return mechanism, lighting/environment, camera, renderer/export settings, desktop/mobile responsive state.

## EXPORT / IMPLEMENTATION RESULT

- Safe separate project: **NO**.
- Native material edit/test: **NOT PERFORMED**.
- ProAI palette: **NOT APPLIED**.
- scene.splinecode, web export, GLB/GLTF or other export acquired: **NO**.
- Runtime preview / parity comparison: **UNAVAILABLE**.
- Repository donor assets: **NONE**.
- Frozen editable source and working copy remain local-only.
- Status: **HOLD / D — no repository-usable runtime acquisition**.
