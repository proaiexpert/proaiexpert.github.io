# AI Systems Hero — Clean Donor Transplant R1

## OWNER SUMMARY — RU

Дата проверки: 2026-09-03.

Статус: **CLEAN HERO R1.1 OWNER PREVIEW READY**.

Это desktop-first checkpoint второй фазы: существующий AI Systems Hero copy/CTA сохранён, а Golden Boxes Hover transplanted в full-Hero canvas без изменения donor geometry/camera/materials/colors. В R1.1 удалён только подтверждённый demo UI, встроенный в exact payload. Цветовая адаптация, материалы, semantic labels, Authority Threshold, custom motion, mobile polish и production release не выполнялись.

## Authorities

- `origin/main` observed at final verification: `7a15cc696a63a055fe6f6e2e8a7ee47928c86fad` (repository reality only; not used as product authority)
- Product authority: `6fdc0a46a008c3c308c144a734d191d0c97b0473`
- Golden donor authority: `920d0b91728859c15bcace52e7a2a0da3539e347`
- Exact payload SHA-256: `c3bcabd43c232045b059704e8d4be57634314b7da2fcfa5ebbd448ee40a16798`
- Payload size: `46,215` bytes
- Runtime: `@splinetool/runtime@2.0.27`
- Implementation branch: `agent/proai-ai-systems-hero-clean-transplant-r1`

## Implementation

The product EN/RU Hero sections use one absolute full-Hero canvas (`position:absolute; inset:0`) behind the existing copy. The donor payload is fetched from the committed page asset and started through the official Spline `Application` API. No iframe, Three.js reconstruction, BoxGeometry, material override, camera override or custom donor animation is used.

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

## Owner preview

- EN Hero local: `http://127.0.0.1:4183/ai-systems-hero-clean-transplant-r1.html`
- EN Hero LAN / iPhone: `http://192.168.50.143:4183/ai-systems-hero-clean-transplant-r1.html`
- RU Hero local QA: `http://127.0.0.1:4183/ai-systems-hero-clean-transplant-r1-ru.html`
- RU Hero LAN QA: `http://192.168.50.143:4183/ai-systems-hero-clean-transplant-r1-ru.html`

The curated server is bound to `0.0.0.0:4183` and is intentionally limited to the Owner preview directory. The repository itself remains static/Jekyll source; the curated URL is the real rendered Hero checkpoint used for browser QA, not the Public Original or exact-payload harness.

Fresh Owner-facing screenshots:

- `04-en-clean-donor-rest.png` — EN clean rest / full composition
- `05-en-clean-donor-hover.png` — EN clean native donor hover

## Known limitations

- This is intentionally the unmodified donor palette; ProAI chrome/black/champagne/pearl/violet material work is the next approved phase only after Owner composition approval.
- The current R1.1 whitelist is tied to the exact recovered payload UUIDs; changing the payload requires rerunning the runtime inventory gate.
- The rest state is intentionally very dark because donor materials/motion remain untouched; boxes become clearly visible under native hover, as in the Golden donor behavior.
- Mobile and reduced-motion product adaptation are not finalised in this phase.
- The local preview is curated because the repository source requires Jekyll processing for its production includes; no production deploy was performed.

## Safety / non-actions

- Donor demo UI visibility changed: **YES — 11-object whitelist only**
- Donor geometry changed: **NO**
- Donor colors changed: **NO**
- Donor materials changed: **NO**
- Donor camera changed: **NO**
- Custom semantic overlays: **NO**
- Main modified: **NO**
- Merged: **NO**
- Deployed: **NO**

Stop and wait for Owner review. Do not start color/material adaptation, semantic labels, Authority Threshold, custom motion or mobile polish until the clean Hero composition is approved.
