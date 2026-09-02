# Boxes Hover — editable source recovery

Дата проверки: 2026-09-02
Ветка evidence: `agent/proai-boxes-hover-native-runtime-validation-r1`
Remote `main` SHA: `204233b2683487433621c65b6409453503b74ba5`

## Итог

**TECHNICAL BLOCKER**

В текущем залогиненном Spline-проекте обнаружены Current Version и два historical Auto-saved snapshots. Snapshot `2026-09-01 22:41` является promising read-only кандидатом и визуально близок к Public Original. Но Spline блокирует `Restore` и `Duplicate` Enterprise-тарифом. Editable-копия не создана; текущий проект не изменён.

## Preserved authorities

- Public Original не изменялся: `https://my.spline.design/boxeshover-lql1ZGkjxCEQe8mgxeMO6mZC/`
- Current editor не изменялся: `https://app.spline.design/file/117b4cf5-47ae-497c-a445-4edea9bc604f`
- Viewer URL и текущий `scene.splinecode` не изменялись.
- `Update Public URL`, `Update Viewer`, `Restore`, `Use this version` не нажимались.
- Попытка сохранить локальную native-копию через Spline File → Save a local copy не завершила browser download event; это не изменило проект. Основной current source сохранён в Spline без mutation.

## Version History

Version History доступна в текущем проекте и содержит:

1. `Current Version`
2. `Auto-saved Sep 1, 2026 22:41`
3. `Auto-saved Sep 1, 2026 22:38`

Оба historical snapshot-а открывались только в Preview. На карточке версии доступны `Use this version` и контекстные действия `Rename`, `Restore`, `Duplicate`; `Restore` и `Duplicate` переводят в Enterprise upgrade dialog. `Delete` disabled. Ни один destructive или restoring action не выполнялся.

## Candidate validation

### Auto-saved 2026-09-01 22:41

Read-only Preview показал тот же общий runtime-паттерн, что и Public Original: чёрное поле со звёздами, центрально-верхний box composition при center hover, edge response и цветовой settling после pointer leave. Это promising candidate, но не hard pass: Spline не позволил получить отдельный editable project, а live-pointer проход завершился потерей preview canvas/loading state до однозначной оценки.

Evidence:

- `01-autosaved-2026-09-01-2241.png`
- `03-auto41-rest.png`
- `04-auto41-center-hover.png`
- `05-auto41-edge-hover.png`
- `06-auto41-pointer-leave.png`
- `11-auto41-live-pointer.png`

Candidate result: **NOT FOUND as an editable, independently preservable source**.

### Auto-saved 2026-09-01 22:38

Read-only Preview показал пустой чёрный canvas с другой рабочей областью (`800 × 400`); box field не появился в проверенных состояниях.

Evidence:

- `02-autosaved-2026-09-01-2238.png`
- `07-auto38-rest.png`
- `08-auto38-center-hover.png`
- `09-auto38-edge-hover.png`
- `10-auto38-pointer-leave.png`

Candidate result: **FAIL**.

## Public Original Remix / Duplicate

Public Original был открыт напрямую в системном Chrome. Видимый DOM содержит только публичный Spline runtime и ссылку на Spline logo. Официальных действий `Remix`, `Duplicate`, `Copy to workspace` или `Open in Spline` не отображается. Поэтому отдельная editable-копия из Public Original не создана.

Result: **PUBLIC ORIGINAL REMIX/DUPLICATE AVAILABLE = NO**.

## Required hard-pass matrix

Для отдельного editable source hard pass не получен:

- REST: **NOT FOUND**
- CENTER HOVER: **NOT FOUND**
- EDGE HOVER: **NOT FOUND**
- LIVE POINTER: **NOT FOUND**
- SETTLING: **NOT FOUND**
- GEOMETRY / DEPTH: **NOT FOUND**
- CAMERA / COMPOSITION: **NOT FOUND**
- COLORS / LIGHTING: **NOT FOUND**

Это не означает, что snapshot 22:41 обязательно не совпадает с Public Original; это означает, что его нельзя безопасно объявить exact editable donor без независимой копии и полного hard-pass сравнения.

## Safety result

- Public Original preserved: **YES**
- Current editor preserved: **YES**
- Public URL modified: **NO**
- Viewer modified: **NO**
- Manual reconstruction: **NO**
- GLB / Three.js reconstruction: **NO**
- ProAI adaptation: **NO**
- Main modified: **NO**
- Merge/deploy: **NO**

## Final verdict

Editable exact donor не recovered. Найден promising historical Preview snapshot `2026-09-01 22:41`, но Spline account plan не позволяет безопасно выполнить `Duplicate` или `Restore`; Public Original не предоставляет видимого official Remix/Copy action.

Следующий допустимый gate — Owner решает вопрос с официальным Spline-доступом, который позволит duplicate/restore historical snapshot в отдельный проект. До этого не восстанавливать Current Version, не обновлять Public URL или Viewer и не начинать ProAI adaptation.
