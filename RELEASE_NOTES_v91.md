# RELEASE NOTES v91

## Scope
Systematic desktop fix for the Case Studies hero block (`/case-studies/` and `/ru/case-studies/`).

## What changed
- Reworked the cases hero to use a fixed-height desktop container instead of flow-based image placement.
- Made the visual wrapper absolutely positioned on desktop.
- Reduced the perceived top gap by normalizing hero vertical spacing.
- Increased hero visual scale and moved it upward/leftward through positioned layout, not margin hacks.
- Kept mobile/tablet fallback behavior unchanged.

## Files changed
- `assets/css/sections.css`

## Notes
- This is a CSS-only patch.
- No routing, header/footer, forms, or JS behavior were changed.
