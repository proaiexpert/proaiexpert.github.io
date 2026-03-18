# RELEASE NOTES — Version 15

## Scope
Emergency restore from v14 regression + targeted button-family polish only.

## Fixed
- Restored hero/header visuals by rebuilding from v12 baseline instead of the broken v14 global CSS edit.
- Kept changes limited to the button system only.
- Unified main button shape toward the approved premium family:
  - `.btn` radius changed from full pill to `var(--r-md)` (10px)
  - `.btn--lg` tightened slightly
  - primary button shadows reduced and calmed
  - light/ghost hover states softened
  - header CTA spacing tuned slightly

## Intentionally unchanged
- Hero visuals
- Header layout
- Footer/logo integration
- Content
- Routing
- Forms
- Chatbot
- SEO/meta

## Files changed
- assets/css/components.css
- assets/css/layout.css
