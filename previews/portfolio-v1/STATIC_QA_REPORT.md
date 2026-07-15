# Portfolio Prototype v1 — Static QA Report

**Branch:** `portfolio-rebrand-v1`  
**Scope:** `/previews/portfolio-v1/` only  
**Production files changed:** none

## Passed checks

### Isolation

- All prototype HTML is located under `previews/portfolio-v1/`.
- Prototype CSS and JavaScript are loaded only by prototype pages.
- No homepage, service page, production Case Studies route, sitemap, robots file, redirect, global CSS or global JavaScript file was modified.
- Branch comparison against `main` shows only new documentation and preview files.

### Indexing protection

Both HTML pages contain:

```html
<meta name="robots" content="noindex,nofollow,noarchive">
```

This prevents intentional search indexing when the preview is eventually rendered, but it is not a privacy mechanism. The repository and branch remain publicly accessible according to repository visibility.

### Content status accuracy

- Financial Stream: labelled `Live client project`.
- Payroll: retained as an active service.
- Alina Horb: labelled `Live project · ongoing refinement`.
- Local Repair Pro: labelled `Website concept · in development` and explicitly distinguished from a client project.
- ProAI Expert: labelled `Internal studio project`.
- Twilio/partial automation is not presented as fully live.
- Gmail/Make/OpenAI support is described as human-reviewed drafting, not autonomous client communication.
- GSC metrics are marked as a provided snapshot and require exact public date labels before launch.

### Link and asset structure

- Archive → Financial Stream prototype uses a relative route.
- Financial Stream → archive uses a relative route.
- Financial Stream live-site CTA opens the verified production domain in a new tab with `rel="noopener"`.
- Existing Financial Stream desktop/mobile asset paths match files already present in the current repository.
- Alina and Local Repair visuals are explicitly labelled prototype/art-direction canvases rather than production screenshots.

### Accessibility and responsive foundations

- Semantic sections, headings and navigation labels are present.
- Images include alt text.
- Chapter navigation has accessible labels and active-state support.
- `prefers-reduced-motion` disables meaningful animation dependencies.
- Desktop sticky project scenes become normal vertical cards below 980px.
- The prototype avoids horizontal mobile galleries.
- Hover is not required to access core information.

### JavaScript boundaries

- No external JavaScript dependency.
- Intersection Observer is used for reveal behavior.
- A fallback reveals all content when Intersection Observer is unavailable.
- Pointer tracking only runs on fine-pointer hover devices.
- Scroll work is queued through `requestAnimationFrame`.

## Pending visual/browser QA

Pixel-level visual QA is **not yet marked complete**.

Reason:

- the working branch is intentionally not connected to the production GitHub Pages source;
- the current execution environment could not resolve GitHub over its local network, so Chromium could not load the branch files and repository assets for screenshots.

Required next test in a local checkout, Codex browser session or isolated preview deployment:

1. desktop 1440×900;
2. desktop 1920×1080;
3. tablet 1024×1366;
4. mobile 390×844;
5. mobile 320×568;
6. short landscape viewport;
7. reduced-motion mode;
8. keyboard navigation;
9. sticky-stage rhythm;
10. chapter rail active state;
11. system-map active state;
12. image loading and crop quality;
13. horizontal overflow;
14. performance and layout shift.

## Status

**Static QA: passed.**  
**Visual/browser QA: pending.**  
**Production readiness: not approved.**
