# Mobile QA

Use this for detailed mobile checks. General rendered, screenshot, and interaction QA lives in `QA_CHECKLIST.md`.

## Required Portrait Widths

- 430px
- 390px
- 375px
- 360px
- 320px

## Required Landscape Widths

- 844x390
- 932x430
- 812x375

## Core Checks

- Header fits.
- Hamburger opens.
- Hamburger closes.
- Menu state is visible and correct.
- CTA links/buttons remain visible and tappable.
- Sticky CTA does not block content.
- Hero is readable.
- Cards stack without clipping.
- Chips/buttons wrap cleanly.
- Text does not overflow its container.
- Images are not oversized or badly cropped.
- Footer stacks cleanly and reaches the bottom without a white strip.
- Forms/request flows remain usable.
- No hidden nav or CTA.

## Overflow Checks

- No horizontal overflow.
- No right blank area.
- No unwanted right-side whitespace.
- No blank strips.
- Layout must not depend on unsafe `100vw` sizing that creates overflow.

## Interaction Checks

- Hamburger open/close is click-tested.
- `aria-expanded` updates where applicable.
- Header links are tappable.
- Sticky CTA is tappable.
- FAQ/accordion controls work.
- Reveal sections do not hide content.

## Reveal / Fail-Open Checks

- Content is visible without JavaScript.
- `.reveal` is visible by default.
- Only `html.js .reveal` may hide content.
- No `html.js.reveal`.
- Mobile reveal hiding is disabled if reliability risk exists.
- Reduced-motion fallback works.
- Animation enhances content; it must not be required to reveal core content.

## Screenshot Expectations

- Capture screenshots for each changed mobile layout area.
- Include at least one narrow portrait screenshot when fixing mobile bugs.
- Include a landscape screenshot for header/menu/sticky CTA changes.
- Record viewport and page URL with each screenshot.
- If screenshots are not captured, state the risk in the final report.
