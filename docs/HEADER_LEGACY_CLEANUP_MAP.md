# Header Legacy Cleanup Map

Status: active migration support document.

## Canonical owner

- Markup: `_includes/header-system/header.html`
- CSS: `assets/css/header-system-v1.css`
- JavaScript: `assets/js/header-system-v1.js`

## Temporary legacy bridge

- CSS: `assets/css/global-header-parity-v2.css`
- JavaScript: `mobile-behavior-v123.js`

The bridge exists only for routes that still contain copied `.global-header` markup. It must not be used by newly created pages.

## Confirmed duplicate sources

The following families still contain full copied header CSS and/or markup:

1. Commercial standalone pages: About, Contact, AI Systems, Websites & Branding, EN/RU.
2. Portfolio archive and individual case studies, EN/RU.
3. Insights hub and article generations.
4. Some article factory templates and generated outputs.

## Confirmed collision classes

- `.global-header`
- `.header-container`
- `.logo-block`
- `.logo-cube-container`
- `.logo-cube`
- `.l-face`
- `.logo-text`
- `.site-nav`
- `.header-actions`
- `.lang-link`
- `.start-btn`
- `.mobile-menu-toggle`
- `@keyframes logoSpin`

## Immediate hardening rules

1. Legacy cube animation uses a unique canonical runtime keyframe name so page-local `logoSpin` definitions cannot replace it.
2. Active navigation is derived from the current route, not stale copied classes.
3. Header CTA label, URL, dimensions and font metrics are normalized by language.
4. Exactly one runtime controller owns the legacy mobile menu.
5. New pages must use the shared include and `.site-header-*` namespace.
6. No new legacy bridge selectors may be added.

## Physical removal sequence

1. Commercial standalone pages.
2. Portfolio archive and case pages.
3. Insights hub.
4. Article templates and factory.
5. Legacy article outputs.
6. Utility pages.
7. Delete the bridge after repository search returns no legacy header markup.

## Completion gate

Header migration is complete only when:

- all public routes use the shared include;
- no public page contains copied header markup;
- no page-local header CSS remains;
- `global-header-parity-v2.css` and legacy menu ownership code are deleted;
- laptop, portrait and landscape parity tests pass across all families.
