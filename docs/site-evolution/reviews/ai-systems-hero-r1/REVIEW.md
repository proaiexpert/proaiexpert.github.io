# AI Systems Hero R1 — Owner Review

PRODUCT: `cb2c1df0bb4dde481f92b5fa4438cb33019edae9`

Scope: review packaging only. Product files are frozen.

## Review pages
- `en.html` loads `ai-systems/index.html` from the exact PRODUCT SHA.
- `ru.html` loads `ru/ai-systems/index.html` from the exact PRODUCT SHA.
- Both inject the resolved shared header markup matching `_includes/header-system/header.html` and pin all `/assets/` CSS/JS/font references to the exact PRODUCT SHA through RawGitHack CDN.
- The rest of each AI Systems page, including the current footer, comes directly from the PRODUCT HTML.

## Fresh screenshots
- `screenshots/en-1440.png` — 1440×1000 viewport
- `screenshots/ru-1440.png` — 1440×1000 viewport
- `screenshots/en-390.png` — 390×844 viewport
- `screenshots/ru-390.png` — 390×844 viewport
- `screenshots/en-320.png` — 320×800 viewport
- `screenshots/ru-320.png` — 320×800 viewport
- `screenshots/en-844x390.png` — 844×390 short landscape
- `screenshots/en-390-menu-open.png` — 390×844 shared-header menu-open state

The screenshots were freshly captured in headless Chromium from the frozen local Hero build used to validate PRODUCT R1 responsive behavior. No horizontal overflow or console errors were observed in these local capture runs. The immutable review harness itself is pinned to the real GitHub PRODUCT SHA. This environment does not claim an executed browser render of the external RawGitHack URLs.
