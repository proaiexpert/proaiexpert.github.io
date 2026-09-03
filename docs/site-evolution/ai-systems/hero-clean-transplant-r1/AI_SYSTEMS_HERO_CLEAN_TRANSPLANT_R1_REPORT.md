# AI Systems Hero — Clean Donor Transplant R1

## OWNER SUMMARY — RU

Дата проверки: 2026-09-03.

Статус: **TARGETED R1.2 BLOCKER — MATERIAL PASS НЕ ПРИМЕНЁН ДЛЯ СОХРАНЕНИЯ FIDELITY**.

Это desktop-first checkpoint: Golden Boxes Hover transplanted в full-Hero canvas, а R1.1 demo UI очищен whitelist-ом. В R1.2 exact payload и native donor сохранены; две официальные material-стратегии были проверены, но обе разрушали визуальную fidelity в текущем Chrome runtime, поэтому финальный preview не подменяет donor materials. Semantic labels, Authority Threshold, custom motion, mobile polish и production release не выполнялись.

## Authorities

- `origin/main` observed for R1.2: `a4d222dd16adc736677a30ef5f4f38dd367cea1c` (repository reality only; not used as product authority)
- Product authority: `6fdc0a46a008c3c308c144a734d191d0c97b0473`
- Golden donor authority: `920d0b91728859c15bcace52e7a2a0da3539e347`
- Exact payload SHA-256: `c3bcabd43c232045b059704e8d4be57634314b7da2fcfa5ebbd448ee40a16798`
- Payload size: `46,215` bytes
- Runtime: `@splinetool/runtime@2.0.27`
- Implementation branch: `agent/proai-ai-systems-hero-clean-transplant-r1`

## Implementation

The product EN/RU Hero sections use one absolute full-Hero canvas (`position:absolute; inset:0`) behind the existing copy. The donor payload is fetched from the committed page asset and started through the official Spline `Application` API. No iframe, Three.js reconstruction, BoxGeometry, camera override or custom donor animation is used. R1.2 final code intentionally does not apply a material override after the runtime fidelity gate failed.

The only page-level composition treatment is a soft left fade behind the copy for readability. It does not alter the payload or create a card/frame boundary.

## R1.1 DONOR DEMO UI CLEANUP

После `Application.start()` runtime-инвентарь был проверен через официальный `getAllObjects()` / `findObjectByName()`. В payload есть отдельный корень `UI` типа `Empty` с UUID `3acae095-4a11-475a-8b70-59aac6906793`. Корень не скрывается рекурсивно. Скрываются только следующие прямые дочерние `Mesh`-объекты с точным UUID и parent UUID:

| Object | Type | Почему это только demo UI | Visibility change |
|---|---|---|---|
| `Ellipse` (`50605cdf-cc85-46b6-874a-000a1d96b4b3`) | `Mesh` | UI decoration/control surface under `UI` | `true → false` |
| `Rectangle 3` (`bfc84abf-461b-4b5d-9e7d-4c0d2fe108c8`) | `Mesh` | UI panel/control surface under `UI` | `true → false` |
| `Text 7` (`7e0d047a-c03d-4b52-a29d-b7d9775b1630`) | `Mesh` | donor demo caption under `UI` | `true → false` |
| `Rectangle 2` (`2e4c9677-c23f-498d-a238-99e7346cd64a`) | `Mesh` | UI panel/control surface under `UI` | `true → false` |
| `Text 6` (`b27bc674-20c0-4e2e-a608-b92976b171bc`) | `Mesh` | donor demo caption under `UI` | `true → false` |
| `Rectangle` (`4c080547-86bf-42e5-a23d-ce33a154bc87`) | `Mesh` | UI panel/control surface under `UI` | `true → false` |
| `Text 5` (`d0d28aea-11cd-4c6d-b6ff-bf7c8528dd53`) | `Mesh` | donor demo caption under `UI` | `true → false` |
| `Text 4` (`85cc886f-d4fa-438a-a91c-4bf043d4555b`) | `Mesh` | donor demo caption under `UI` | `true → false` |
| `Text 3` (`8ef5eb04-1102-4e8f-b237-4452fe7c6385`) | `Mesh` | donor demo caption under `UI` | `true → false` |
| `Text 2` (`61f54f7d-ce88-46ea-9f45-a01825154460`) | `Mesh` | donor demo caption under `UI` | `true → false` |
| `Text` (`6013b0e6-e898-4640-9d62-e088a816f69c`) | `Mesh` | donor demo caption under `UI` | `true → false` |

The whitelist is enforced by exact object name, type, object UUID and parent UUID before visibility is changed. No `Cube`, `Cube Instance*`, `Boxes`, `Effector`, `Sphere`, `Light`, `Directional Light` or camera object is in the whitelist.

R1.1 integrity gate:

- geometry unchanged: **YES**
- camera unchanged: **YES**
- materials unchanged: **YES**
- colors unchanged: **YES**
- native hover unchanged: **YES**
- ProAI copy preserved: **YES**
- ProAI CTA preserved: **YES**
- visible 3D card/frame: **NO**

Changed product files in the original R1 implementation:

- `ai-systems/index.html`
- `ru/ai-systems/index.html`
- `assets/css/ai-systems-hero-clean-transplant-r1.css`
- `assets/js/ai-systems-hero-clean-transplant-r1.js`
- `assets/3d/boxes-hover/public-original-inline-scene-payload.bin`

R1.1 changed files:

- `assets/js/ai-systems-hero-clean-transplant-r1.js`
- `owner-preview/assets/ai-systems-hero-clean-transplant-r1.js`
- `docs/site-evolution/ai-systems/hero-clean-transplant-r1/04-en-clean-donor-rest.png`
- `docs/site-evolution/ai-systems/hero-clean-transplant-r1/05-en-clean-donor-hover.png`

Owner-only curated preview files live under `owner-preview/`; they are a donor-only preview surface with the same Hero markup/runtime and copied shared header styles.

## Browser QA

Real Chrome preview at a normalized desktop CSS viewport of `1440×900` was loaded for EN and RU. The browser reported effective DPR `0.8` in this Chrome viewport override; the same condition was used for both language surfaces. In both cases:

- runtime marker: `ready`
- canvas spans the Hero stage
- no horizontal overflow
- existing copy and CTA remain above the canvas
- no visible 3D card, rounded window or hard donor frame

Fresh EN hover evidence was captured by moving the pointer across the donor box field. The original boxes rise with the native hover response after cleanup. Fresh RU rest/hover checks also completed without structural breakage. EN and RU runtime markers were `ready`, the hidden-object marker was `11`, and no horizontal overflow was present. Chrome console had no EN errors; RU emitted one non-fatal Spline WebGPU warning that four draw pipelines were skipped, with the frame still treated as final.

Quality gate:

1. Original Boxes Hover recognizable on native hover: **YES**
2. Visible 3D card/rectangle: **NO**
3. H1 remains dominant: **YES**
4. Donor scale and depth remain judgeable: **YES**
5. Native hover preserved: **YES**
6. Donor integrated through one full spatial stage: **YES**
7. Composition is ready for desktop Owner decision: **YES**

## R1.2 GOLDEN SHELL + MATERIAL PASS

### Approved shell

The exact approved EN/RU shell copy is present without rewriting:

- EN eyebrow: `AI SYSTEMS · AGENTS · CUSTOM ENGINEERING`
- EN H1: `AI systems that do the work.` / `You keep the decisions that matter.`
- EN support: `We build AI agents, automation, and integrations around real business processes. We connect data, software, and APIs—and write custom code when off-the-shelf tools are not enough. The system handles defined actions and stops where a human decision is required.`
- EN CTAs: `Discuss your challenge` / `How we build →`
- EN capability line: `AI AGENTS · AUTOMATION · APIs · CUSTOM CODE`
- RU eyebrow: `AI-СИСТЕМЫ · АГЕНТЫ · СОБСТВЕННАЯ РАЗРАБОТКА`
- RU H1: `AI-системы, которые выполняют работу.` / `Важные решения остаются за вами.`
- RU support: `Строим AI-агентов, автоматизацию и интеграции под реальные процессы бизнеса. Подключаем данные, сервисы и API, а когда готовых инструментов недостаточно — пишем собственный код. Система берёт на себя заданные действия и останавливается там, где решение должен принять человек.`
- RU CTAs: `Обсудить задачу` / `Как мы строим →`
- RU capability line: `AI-АГЕНТЫ · АВТОМАТИЗАЦИЯ · API · СОБСТВЕННЫЙ КОД`

The header uses the later Golden Homepage assembly, copied without cyan/teal invention: `_includes/header-system/header.html`, `assets/css/header-footer-logo-r1.css`, and `assets/js/header-footer-logo-r1.js`, with the `proai-logo-r341` Pearl/Silver neutral treatment. The owner preview includes the same approved header assets. A narrow-height desktop-only owner-preview rule prevents the approved desktop nav from being misclassified as a landscape mobile menu in the short Chrome capture viewport.

### Exact runtime inventory and attempted material pass

The committed payload remains `assets/3d/boxes-hover/public-original-inline-scene-payload.bin`, SHA-256 `c3bcabd43c232045b059704e8d4be57634314b7da2fcfa5ebbd448ee40a16798`, size `46,215` bytes, started with `@splinetool/runtime@2.0.27` through `Application`. Runtime inventory confirmed `Boxes` is the expected `Empty` UUID `006474fe-4e5b-4835-b106-89b2ec79dd71` and found exactly `143` `Cube` mesh objects. The R1.1 eleven-object `UI` whitelist remains unchanged.

The official runtime APIs inspected were `getAllObjects()`, `findObjectByName()`, `createCustomMaterial()` and `setMaterial()`. A guarded WebGPU `MeshStandardNodeMaterial` pass was tested with these proposed families: black chrome/obsidian, graphite/gunmetal, silver/chrome, restrained champagne and low-energy indigo. In the connected Chrome session the LAN HTTP origin had no WebGPU adapter. On secure localhost the override technically reached `ready`, but native pipelines skipped draws and the visible result became flat oversized plates/diamonds rather than recognizable Boxes Hover cubes. A BasicNodeMaterial retry produced the same fidelity failure. The final implementation therefore sets `data-clean-donor-material-pass=blocked-runtime-fidelity-safe` and leaves all native donor materials untouched.

Material gate: **BLOCKED**. No material, color, geometry, camera or motion override is present in the final preview. This is intentional: no broken “metallic” approximation is being presented as the Golden donor.

### R1.2 QA result

- Golden payload SHA gate: **PASS**
- EN/RU approved copy and CTA: **PASS**
- neutral approved header / no legacy cyan or teal shell: **PASS**
- demo UI hidden: **PASS — 11 exact objects only**
- all donor cube inventory: **PASS — 143 meshes**
- geometry/camera changed: **NO**
- native center hover: **PASS — recognizable cube field captured**
- pointer-leave settling: **PASS in prior clean donor QA; not changed in R1.2**
- material hierarchy visibly applied: **FAIL / blocked**
- final Chrome console: **PASS** on clean native-donor localhost tab; the rejected material experiments are not in the final code path
- horizontal overflow: **PASS**

R1.2 evidence files:

- `07-r12-en-desktop-material-rest.png` — full viewport native rest; donor is intentionally very dark in rest
- `08-r12-en-desktop-material-hover.png` — native center-hover field with recognizable cubes
- `09-r12-en-desktop-full-hero.png` — full-page composition evidence; fixed-header duplication is QA-only and not an owner-facing deliverable

Implementation checkpoint: start `1a71265fcd92b5cabf232498a367a39236988574`; Phase A commit `ca3c1a78bf9d6c1fd6e9afefb67f3698de0e9642`; R1.2 commit `e0fe3988b6dd23305eaaab75b8f99abefaf8479f` on `agent/proai-ai-systems-hero-clean-transplant-r1`.

## Owner preview

- EN Hero laptop (secure localhost): `http://127.0.0.1:4183/ai-systems-hero-clean-transplant-r1.html`
- RU Hero laptop (secure localhost): `http://127.0.0.1:4183/ai-systems-hero-clean-transplant-r1-ru.html`
- LAN / iPhone: **NOT AVAILABLE for the R1.2 material gate**; the LAN HTTP origin has no WebGPU adapter in this Chrome environment.

The curated server is bound to `0.0.0.0:4183` and is intentionally limited to the Owner preview directory. The repository itself remains static/Jekyll source; the curated URL is the real rendered Hero checkpoint used for browser QA, not the Public Original or exact-payload harness.

Fresh Owner-facing screenshots:

- `07-r12-en-desktop-material-rest.png` — EN native rest / full viewport
- `08-r12-en-desktop-material-hover.png` — EN native center hover / full viewport

## Known limitations

- The requested ProAI material pass is blocked in the current runtime environment and was deliberately not faked; native donor palette remains visible for fidelity review.
- The current R1.1 whitelist is tied to the exact recovered payload UUIDs; changing the payload requires rerunning the runtime inventory gate.
- The rest state is intentionally very dark because donor materials/motion remain untouched; boxes become clearly visible under native hover, as in the Golden donor behavior.
- Mobile and reduced-motion product adaptation are not finalised in this phase.
- The local preview is curated because the repository source requires Jekyll processing for its production includes; no production deploy was performed.

## Safety / non-actions

- Donor demo UI visibility changed: **YES — 11-object whitelist only**
- Donor geometry changed: **NO**
- Donor colors changed: **NO**
- Donor materials changed: **NO — material gate failed safely**
- Donor camera changed: **NO**
- Custom semantic overlays: **NO**
- Main modified: **NO**
- Merged: **NO**
- Deployed: **NO**

Stop and wait for Owner review / runtime decision. Do not start semantic labels, Authority Threshold, custom motion or mobile polish. Do not retry material overrides until the Owner provides a real secure WebGPU-capable Chrome path or approves a separate material strategy.
