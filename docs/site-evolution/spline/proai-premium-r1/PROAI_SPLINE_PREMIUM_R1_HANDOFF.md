# PROAI SPLINE PREMIUM R1 HANDOFF

THIS IS AN OWNER-REVIEW R1 PROTOTYPE.
DO NOT MERGE OR DEPLOY.
DO NOT START HERO INTEGRATION UNTIL OWNER APPROVAL.

## Назначение

Архивирует изолированный локальный R1 prototype premium graphite Rubik object для cross-agent access. Это не production-код, не Hero integration и не redesign следующей стадии.

## Canonical Original Scene

Canonical original Spline scene URL:

```text
https://prod.spline.design/Ps48UZeUPJBLxiy2/scene.splinecode
```

Локальная untouched base-копия сцены сохранена в:

```text
base/scene.splinecode
```

Prototype грузит локальную копию:

```text
prototype/out/scene.splinecode
```

Remote canonical URL сохранён в `prototype/src/main.js` как fallback/reference.

## Verified Facts

- scene load PASS
- Rubik animation PASS
- drag/orbit/zoom preserved
- 26 objects
- 18 face meshes
- 3 internal Cube meshes
- runtime material mutation works
- Phong -> Physical runtime conversion works
- Plane/light control works

## Object Groups

Основные группы:

- `right`
- `center`
- `left`

В каждой группе:

- `verde`
- `giallo`
- `bianco`
- `blu`
- `arancio`
- `rosso`
- `Cube`

## Final Face Material Family

Все 18 face meshes переведены runtime batch mutation в единую premium dark material family.

- graphite/gunmetal RGB approximately `0.175-0.300`
- category: `physical`
- roughness: `0.18-0.28`
- metalness: `0.84-0.92`
- reflectivity: `0.60-0.78`
- light layer intensity: `1.00-1.18`

## Internal Cube

Internal `Cube` meshes не перекрашены теми же значениями, что и faces. Они оставлены глубже для structural separation.

- RGB `0.052 / 0.056 / 0.066`
- roughness `0.54`
- metalness `0.38`
- reflectivity `0.22`

## Lighting / Environment

- Directional Light `#FAFBFC`
- intensity `6.4`
- position `[-620, 1880, -900]`
- Plane visible = `false`
- background `#080A0D`

## Runtime Implementation

Основная реализация находится в:

```text
prototype/src/main.js
```

Ключевые runtime-функции:

- `applyProAIGraphiteMaterials()`
- `configureProAILighting()`
- `configureProAIEnvironment()`

Изменения применяются только после:

```js
await app.load(...)
```

Бинарный `.splinecode` вручную не модифицировался.

## Review Assets

- `review/proai-spline-premium-r1-1440x900.png`
- `review/proai-spline-premium-r1-angle-2.png`
- `review/proai-spline-premium-r1-review-18s.webm`

## Provenance Notes

Original editable Spline/community provenance beyond the canonical `prod.spline.design` scene URL was not present in the local notes available during archival. Do not invent an editable source; use the canonical scene URL and archived `.splinecode` as the known source references.

## Hard Stop

Do not start:

- five-state cycle
- text on faces
- display panel
- stages
- production Hero integration

Owner approval is required before any integration or next visual pass.
