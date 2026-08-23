# AI Systems R1 — Owner Review

## Frozen product

- Product commit: `6203faa7e80c28c7148adc3bd788ee9c840703b5`
- Implementation base: `c945084e1952c05c686494091f7dbca0f7acdf08`
- Branch: `agent/proai-ai-systems-r1`
- Golden Blueprint: `536091991d05e8259ffdf9b5b7d1708bd36b3993`
- Visual Lock Freeze: `c972fa4967c2e43b4036ceff88c7218b1645cad6`
- Canonical Header authority: `20a36a5246ac2fb4507c69858289fc55d0f4a977`

## Canonical Header integration

The locked production base predates the canonical mobile Header auto-hide delta in `20a36…`. To keep homepage/shared files untouched, AI Systems R1 carries that authority behavior as an AI Systems-scoped enhancement inside `assets/js/ai-systems-r1.js`. Shared Header HTML/CSS/JS files remain unchanged.

## Review harness

`en.html` and `ru.html` are static browser-review harnesses. They use the same frozen AI Systems visual CSS blob and restrained static Header/Footer review equivalents so the candidate can be opened in a browser without merging or deploying.

The review harness does **not** redefine product content or production code. The actual product pages continue to use the repository shared Header/Footer includes.

## Browser render matrix executed

Chromium review renders were produced for:

- EN desktop — 1440-class source capture / owner JPEG
- RU desktop — 1440-class source capture / owner JPEG
- EN mobile — 390 × 844
- RU mobile — 390 × 844
- EN narrow mobile — 320 × 844
- EN short landscape — 844 × 390

Additional targeted stills were produced for the gate / Pearl review path.

## QA classification

Source-level checks cover canonical/hreflang/x-default, semantic headings, visible focus styling, local fonts, reduced-motion fallback, JS-disabled final-state visibility, route preservation, canonical Header mobile auto-hide behavior, evidence classification and absence of homepage changes.

Core Web Vitals are targets only. No deployed p75 LCP / CLS / INP measurement is claimed by this review package.

## Safety

- Homepage files changed: 0
- Main changed: no
- Merge: no
- Deploy: no
