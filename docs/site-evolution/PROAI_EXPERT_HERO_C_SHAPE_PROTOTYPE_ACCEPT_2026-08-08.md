# ProAI Expert Hero C-Shape Prototype — ACCEPT

Date: 2026-08-08

## Decision

`C-SHAPE HERO PROTOTYPE — ACCEPT`

The C-shape direction has passed the browser prototype gate and is now the selected Hero direction for production integration.

The documented Current Production Hero A+ Refresh remains historical fallback only and is not the active path unless the owner explicitly reopens it.

No third Hero concept is authorized.

## Verified repository state

Repository: `proaiexpert/proaiexpert.github.io`

Main at acceptance verification:

`9d4cee9bf23ae71a08ebab5ba1713be9dc14e066`

Accepted prototype branch:

`agent/hero-c-shape-a-plus-browser-prototype`

Accepted prototype HEAD:

`7b2e7de26b5fc43fe5db68cd3ea51b4429edaeb5`

At verification the branch was `14` commits ahead and `0` behind main.

The branch diff against main contained exactly these eight isolated prototype files:

- `assets/css/hero-c-shape-a-plus-qa-fixes.css`
- `assets/css/hero-c-shape-a-plus.css`
- `assets/img/hero-c-shape/ASSET_MANIFEST.md`
- `assets/img/hero-c-shape/core-static-master-isolated.avif`
- `assets/img/hero-c-shape/core-static-master-isolated.webp`
- `assets/js/hero-c-shape-a-plus.js`
- `hero-a-plus-c-shape-preview/index.html`
- `ru/hero-a-plus-c-shape-preview/index.html`

No production `/` or `/ru/` homepage files were modified by the accepted prototype branch.

## Approved source assets

STATIC MASTER:

`FA5872D6-EA1E-4865-A94B-74CE5CFDB7F8.jpeg`

- dimensions: `1536 × 1024`
- bytes: `334,949`
- SHA-256: `c2cecdc255eb3c0d68de142dcbddba6e8cedf1f3f036b9f9ec62c562ef66d9e4`

Browser derivatives:

### WebP

`assets/img/hero-c-shape/core-static-master-isolated.webp`

- dimensions: `900 × 760`
- bytes: `64,940`
- SHA-256: `cd97f2e0107ddb577ae1cdded84cfbcc91c66b4f42374d1f2f510b3c807ad2f2`

### AVIF

`assets/img/hero-c-shape/core-static-master-isolated.avif`

- dimensions: `900 × 760`
- bytes: `48,100`
- SHA-256: `c6cc0ba89b7145bdbd796b7fd778e6c788133d3e278265947b7ce90793e458d8`

The derivatives are deterministic approved-pixel crops/masks. No generative redraw is authorized.

## Accepted browser qualities

The prototype acceptance includes:

- real shared Header System;
- real selectable EN/RU HTML typography;
- locked Hero commercial copy and CTA hierarchy;
- approved C-shaped graphite Core;
- semantic `TRUST / PRESENCE → INQUIRY → Intelligence Layer → RESPONSE → FOLLOW-UP` route;
- one controlled signal route;
- deterministic entrance assembly;
- quiet idle motion and bounded pointer response;
- reduced-motion and no-JS states;
- mobile/portrait and short-landscape compositions;
- no horizontal overflow;
- measured CLS `0` in required Chromium states;
- first-scroll stability;
- no visible raster rectangle, black halo, cut edge or material clipping;
- final targeted QA correction layer.

## Locked production-integration rule

The next gate is **Hero-only production integration**.

Do not redesign the accepted Hero.

Do not broaden into a Homepage redesign.

Do not alter downstream homepage sections except where strictly necessary to remove old Hero-only dependencies or prevent regressions.

Production integration must preserve:

- current canonical/hreflang/SEO behavior;
- real Header System;
- current non-Hero homepage sections;
- EN `/` and RU `/ru/` localization structure;
- mobile CTA usability;
- first-scroll stability;
- reduced motion and accessibility;
- current footer and downstream section behavior.

The accepted prototype is the implementation source of truth for the new production Hero.

## Next gate

Create a dedicated production-integration branch from the latest current main, then port the accepted Hero implementation deliberately into the real `/` and `/ru/` homepage structure.

Before merge/deploy, run production-context QA at minimum:

- EN: 1440, 390, 320, 844×390;
- RU: 1440, 390;
- reduced motion;
- no-JS fallback;
- horizontal overflow;
- CLS / first-scroll stability;
- CTA routes;
- header behavior;
- transition from Hero into the existing second section;
- canonical/hreflang/SEO metadata unchanged unless explicitly intended.

No merge or deploy without explicit owner authorization.
