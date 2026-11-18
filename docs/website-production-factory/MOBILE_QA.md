# Mobile QA (v2)

Full rendered mobile QA protocol. Curl-only inspection is NEVER sufficient for anything in this document — every check below requires a rendered/screenshot-based pass. General rendered, screenshot, and interaction QA principles live in `QA_CHECKLIST.md`.

## Required Widths

Portrait:
- 430
- 390
- 375
- 360
- 320

Landscape:
- 844x390
- 932x430
- 812x375

All 20 checks below must be run at every portrait width. The header/CTA/overflow-related checks (1-16) must also be run at every landscape width, since short-landscape phones are a common failure point for fixed headers and sticky CTAs.

## The 20 Checks

1. Header visible at top on initial page load.
2. Header auto-hides when scrolling down past the initial viewport.
3. Header reappears immediately when scrolling up, at any scroll position.
4. Hamburger icon is visible and has a large-enough tap target (44x44px minimum).
5. Menu opens on tap and closes on tap (of hamburger, backdrop, escape key, or a nav link).
6. `aria-expanded` attribute on the hamburger button flips true/false correctly with menu state.
7. All expected nav links are visible and legible inside the open mobile menu (verify the full expected link count for that page — e.g. 10 links on pages with the full nav).
8. Phone number is visible somewhere in the header or sticky CTA area (if the business has a confirmed phone number).
9. "Request Estimate" (or the page's primary CTA) is visible without requiring the user to open the menu.
10. Sticky CTA appears at the intended scroll threshold (e.g. after ~260px of scroll) — not before, not with a large delay.
11. Sticky CTA hides/fades as the footer enters the viewport, if that is the designed behavior.
12. Sticky CTA never overlaps the open hamburger menu.
13. Sticky CTA never covers form fields, footer content, or body copy at any scroll position.
14. No white/blank strip appears below the footer at any scroll position or width — the footer must be the visual end of the page (verify background color extends fully, no leftover body padding-bottom).
15. Footer is confirmed as the true visual end of the page (no content or empty space below it).
16. No horizontal overflow/scroll at any tested width — verify by checking `document.documentElement.scrollWidth` does not exceed the viewport width.
17. `.reveal` sections are visible by default (fail-open) — content must not be blank while waiting for JS.
18. No blank middle content between header/hero and footer at any tested width.
19. Zero new console errors introduced by the change (compare before/after console output).
20. Safe-area behavior (iOS notch/home-indicator padding) does not clip the header, sticky CTA, or footer content on iPhone-like layouts.

## Additional Layout Checks (carried over from rendered QA migration)

These supplement the 20 checks above and must also be verified during the same rendered pass at every required width:

- Images are not oversized or badly cropped.
- Chips/buttons wrap cleanly without overlapping or clipping.
- Cards stack without clipping at every required width.
- Forms/request flows remain usable and are not obscured by the sticky CTA or header.
- No hidden nav or CTA — every required nav item and CTA must be reachable at every width.
- No right blank area or unwanted right-side whitespace (distinct from the scrollWidth check in item 16 — visually inspect for whitespace even when scrollWidth passes).
- Layout must not depend on unsafe `100vw` sizing that creates overflow.

## Rendered QA Method — Playwright-style

For each required width:

1. Load the page at that viewport size (e.g. `page.setViewportSize({width: 390, height: 844})`).
2. Take a screenshot immediately on load (checks 1, 4, 7, 8, 9, 14, 15, 16, 17, 18).
3. Scroll down ~400-600px, screenshot again (checks 2, 10, 13).
4. Scroll back up, screenshot again (check 3).
5. Click the hamburger, screenshot the open state (checks 4, 5, 6, 7, 12).
6. Click a nav link or the backdrop, screenshot the closed state (check 5).
7. Scroll to near the footer, screenshot (checks 11, 14, 15).
8. Capture the browser console log across the whole pass (check 19).
9. On an iPhone-class viewport (e.g. 390x844, 430x932), verify safe-area padding visually (check 20).

## Manual iPhone QA Guidance (when Playwright is unavailable)

- Use Safari's Web Inspector responsive design mode or a physical iPhone.
- Repeat the same scroll-down / scroll-up / hamburger-open / hamburger-close sequence manually.
- Watch specifically for the header sticking/covering content, the sticky CTA overlapping the menu, and any blank strip below the footer — these are the most common regressions.
- Use Safari's console (via Mac + cable, or remote debugging) to check for JS errors.

## Required Screenshot Evidence List

For each required width, capture and retain:

- Initial load (top of page)
- Mid-scroll (header hidden, sticky CTA visible)
- Scroll-up (header reappeared)
- Hamburger open state
- Hamburger closed state (post-click)
- Footer area (confirm no blank strip)

## Pass/Fail Report Template

```
Mobile QA Report — <page/site> — <date>

Width: 430 (portrait)
  1. Header visible at top: PASS/FAIL
  2. Header auto-hide on scroll down: PASS/FAIL
  3. Header reappear on scroll up: PASS/FAIL
  4. Hamburger visible/tappable: PASS/FAIL
  5. Menu open/close: PASS/FAIL
  6. aria-expanded correct: PASS/FAIL
  7. Nav links visible (expected N, found N): PASS/FAIL
  8. Phone visible: PASS/FAIL
  9. Primary CTA visible: PASS/FAIL
  10. Sticky CTA threshold correct: PASS/FAIL
  11. Sticky CTA hides near footer: PASS/FAIL
  12. Sticky CTA does not overlap menu: PASS/FAIL
  13. Sticky CTA does not cover content: PASS/FAIL
  14. No white strip below footer: PASS/FAIL
  15. Footer is visual end of page: PASS/FAIL
  16. No horizontal overflow: PASS/FAIL
  17. Reveal sections visible by default: PASS/FAIL
  18. No blank middle content: PASS/FAIL
  19. No new console errors: PASS/FAIL
  20. Safe-area behavior correct: PASS/FAIL

[Repeat block for 390, 375, 360, 320, and each landscape width]

Overall: PASS / FAIL
Screenshots attached: <list or links>
Remaining issues: <list or "none">
```

## Reveal Fail-Open Rule (unchanged from v1, kept here for co-location)

- `.reveal` visible by default.
- Only `html.js .reveal` (descendant selector) may hide content — never `html.js.reveal` (compound selector, a common typo that silently breaks the fail-open behavior).
- Mobile reveal hiding must be disabled entirely if any reliability risk exists for that page.
- Reduced-motion and no-IntersectionObserver fallbacks must both resolve to visible content, never permanently hidden content.
- A timeout fallback (e.g. force-visible after N ms if the observer never fires) is required wherever reveal animation is used.
