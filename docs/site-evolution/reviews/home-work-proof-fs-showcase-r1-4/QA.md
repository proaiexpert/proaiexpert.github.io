# Financial Stream R1.4 — Owner Review QA

Product authority: `d6e33b1c428d3478072c3fdf728c50a27ae0461b`
Base: `e601863fb6af39fd518a3203ce2ad7bce3713304`

This review package does not modify product markup, CSS, JS, evidence, testimonial, CTA copy, screenshot assets, or geometry.

## Acceptance gate

- PRIMARY DESKTOP SCREENSHOT FULL: YES
- PRIMARY DESKTOP CROPPED: NO
- MOBILE SCREENSHOT FULL: YES
- TEXT OVER CLIENT SCREENSHOTS: NO
- MICROTEXT <= 7PX: NO
- TITLE CLIPPED: NO
- TESTIMONIAL OVERLAP: NO
- MOBILE PROOF COVERS CRITICAL UI: NO
- HORIZONTAL OVERFLOW: 0px
- BROKEN IMAGES: 0
- CRITICAL FAILED REQUESTS: 0

## Product facts verified

- Desktop primary uses content-driven `height:auto` and `object-fit:contain`.
- Desktop mobile proof uses content-driven `height:auto` and `object-fit:contain`.
- System-depth copy is outside the screenshot stage in `.home-fs-showcase-r14__ledger`.
- Desktop ledger: 10.5px heading / 10px detail.
- Desktop metric labels: 10px.
- Desktop provenance / attribution metadata: 9.5px.
- Mobile meaningful metadata floor: 8.5px.
- Mobile testimonial body: 15px.
- No count-up, new motion runtime, or new evidence was introduced.

## Personally inspected owner viewports

- 1536×864 EN: PASS
- 1440×900 EN: PASS
- 1366×768 EN: PASS
- 1024×768 EN: PASS
- 390×844 EN: PASS
- 390×844 RU: PASS
- 844×390 EN: PASS

Additional packaged context / comparison views:

- 1536×864 EN R1.3.1 baseline
- Technology → Financial Stream context at 1440×900
- Financial Stream → Founder context at 1440×900

## Screenshot manifest

1. `screenshots/01-r131-en-1536x864.avif`
2. `screenshots/02-r14-en-1536x864.avif`
3. `screenshots/03-r14-en-1440x900.avif`
4. `screenshots/04-r14-en-1366x768.avif`
5. `screenshots/05-r14-en-1024x768.avif`
6. `screenshots/06-r14-en-390x844.avif`
7. `screenshots/07-r14-ru-390x844.avif`
8. `screenshots/08-r14-en-844x390.avif`
9. `screenshots/09-r14-tech-to-fs-context-1440x900.avif`
10. `screenshots/10-r14-fs-to-founder-context-1440x900.avif`

## A/B conclusion

TAKE R1.4.

R1.4 removes the accidental fixed-height desktop crop, keeps both real client interfaces at natural aspect, and relocates meaningful system metadata outside the client screenshots while preserving R1.3 material language and R1.3.1 mobile hierarchy.
