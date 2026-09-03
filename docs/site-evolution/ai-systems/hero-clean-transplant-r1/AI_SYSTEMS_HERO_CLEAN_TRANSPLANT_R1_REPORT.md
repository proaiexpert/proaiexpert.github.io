# AI Systems Hero — Clean Donor Transplant R1

## OWNER SUMMARY — RU

Дата проверки: 2026-09-03.

Статус: **OWNER HERO PREVIEW READY**.

Это desktop-first checkpoint второй фазы: существующий AI Systems Hero copy/CTA сохранён, а Golden Boxes Hover transplanted в full-Hero canvas без изменения donor internals. Цветовая адаптация, материалы, semantic labels, Authority Threshold, custom motion, mobile polish и production release не выполнялись.

## Authorities

- Product authority: `6fdc0a46a008c3c308c144a734d191d0c97b0473`
- Golden donor authority: `920d0b91728859c15bcace52e7a2a0da3539e347`
- Exact payload SHA-256: `c3bcabd43c232045b059704e8d4be57634314b7da2fcfa5ebbd448ee40a16798`
- Payload size: `46,215` bytes
- Runtime: `@splinetool/runtime@2.0.27`
- Implementation branch: `agent/proai-ai-systems-hero-clean-transplant-r1`

## Implementation

The product EN/RU Hero sections now use one absolute full-Hero canvas (`position:absolute; inset:0`) behind the existing copy. The donor payload is fetched from the committed page asset and started through the official Spline `Application` API. No iframe, Three.js reconstruction, BoxGeometry, donor object lookup, material override, camera override or custom donor animation is used.

The only page-level composition treatment is a soft left fade behind the copy for readability. It does not alter the payload or create a card/frame boundary. The native donor UI remains present, as required by this checkpoint.

Changed product files:

- `ai-systems/index.html`
- `ru/ai-systems/index.html`
- `assets/css/ai-systems-hero-clean-transplant-r1.css`
- `assets/js/ai-systems-hero-clean-transplant-r1.js`
- `assets/3d/boxes-hover/public-original-inline-scene-payload.bin`

Owner-only curated preview files live under `owner-preview/`; they are a donor-only preview surface with the same Hero markup/runtime and copied shared header styles.

## Browser QA

Real Chrome preview at a normalized desktop CSS viewport of `1440×900` was loaded for EN and RU. The browser reported effective DPR `0.8` in this Chrome viewport override; the same condition was used for both language surfaces. In both cases:

- runtime marker: `ready`
- canvas spans the Hero stage
- no horizontal overflow
- existing copy and CTA remain above the canvas
- no visible 3D card, rounded window or hard donor frame

Fresh EN hover evidence was captured by moving the pointer across the donor box field. The original boxes rise with the native hover response. Fresh RU rest/hover checks also completed without structural breakage.

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

- `01-en-desktop-hero.png` — EN rest / full composition
- `02-en-desktop-hover.png` — EN native donor hover
- `03-ru-desktop-hover.png` — RU structural/native hover check

## Known limitations

- This is intentionally the unmodified donor palette; ProAI chrome/black/champagne/pearl/violet material work is the next approved phase only after Owner composition approval.
- The recovered donor includes its original demo text/UI. It remains visible and is not hidden in this checkpoint.
- Mobile and reduced-motion product adaptation are not finalised in this phase.
- The local preview is curated because the repository source requires Jekyll processing for its production includes; no production deploy was performed.

## Safety / non-actions

- Donor internals changed: **NO**
- Donor colors changed: **NO**
- Donor materials changed: **NO**
- Donor camera changed: **NO**
- Custom semantic overlays: **NO**
- Main modified: **NO**
- Merged: **NO**
- Deployed: **NO**

Stop and wait for Owner review. Do not start color/material adaptation, semantic labels, Authority Threshold, custom motion or mobile polish until the clean Hero composition is approved.
