# Portfolio Prototype v1 — Visual and Browser QA Report

**Branch:** `portfolio-rebrand-v1`  
**Scope:** `/previews/portfolio-v1/` only  
**Production files changed:** none  
**Status:** Prototype review-ready; production not approved

## 1. Test method

The exact prototype HTML, base CSS and JavaScript were retrieved from the working branch through the GitHub connector and reconstructed in an isolated local browser harness.

Chromium was controlled through Playwright. The test matrix covered:

- 1920×1080 desktop;
- 1440×900 desktop;
- 1024×1366 tablet portrait;
- 390×844 mobile;
- 320×568 compact mobile;
- reduced-motion mode;
- keyboard focus traversal;
- programmatic scroll-state checks.

The two existing Financial Stream image paths were verified in the repository. The isolated browser harness used ratio-matched local stand-ins for their pixel content because this execution environment could not transfer the complete binary images from GitHub into Chromium. Device composition, responsive dimensions and crop containers were tested; final pixel-level crop fidelity with the real images remains a pre-production asset check.

## 2. Isolation and source safety

Passed:

- all prototype code remains under `previews/portfolio-v1/`;
- `main` was not modified;
- no production Case Studies route was replaced;
- no homepage, AI Systems, Websites & Branding, navigation, sitemap, robots or global mobile file was changed;
- prototype pages retain `noindex,nofollow,noarchive`;
- the refinement layer is loaded only by the isolated prototype JavaScript.

## 3. Responsive matrix

### Archive

Passed at all five tested widths:

- no document-level horizontal overflow;
- no element extended outside the viewport after the refinement pass;
- desktop sticky stages remain active at wide widths;
- tablet and mobile switch to normal vertical project cards;
- the 1024 px portrait hero now uses a stacked composition instead of leaving the desktop split layout compressed at the bottom;
- Financial Stream, Alina Horb and Local Repair Pro retain distinct visual worlds;
- the secondary ProAI Expert Studio Case remains visually subordinate.

### Financial Stream case

Passed at all five tested widths:

- no document-level horizontal overflow;
- desktop hero remains a balanced copy/device composition;
- mobile hero now reveals part of the device composition in the first viewport instead of presenting an empty lower area;
- the phone mockup remains inside the visible viewport;
- tablet case sections stack at 1100 px and below;
- the system-map orbit remains inside the 320 px viewport;
- the schematic intake preview changes from two columns to one column on compact mobile;
- facts, proof cards and bilingual cards collapse cleanly;
- the testimonial and next-case transition remain legible without horizontal galleries.

## 4. Interaction checks

Passed:

- project-stage active state changes with scroll;
- stage progress lines update;
- reveal behavior uses Intersection Observer;
- unsupported Intersection Observer falls back to visible content;
- chapter rail updates the active chapter;
- after the visitor passes the final chapter, the rail retains `Perspective` rather than incorrectly resetting to `Overview`;
- system-map dots and central label update to the active layer;
- the central system label uses an accessible live region;
- system state is preserved when the system list is outside the viewport;
- pointer light runs only on fine-pointer hover devices;
- scroll work remains queued through `requestAnimationFrame`.

## 5. Accessibility checks

Passed for the prototype stage:

- keyboard focus reaches the brand link, case CTA and chapter links;
- brand and chapter links now have explicit visible focus outlines;
- primary buttons already retain focus-visible treatment;
- reduced-motion mode disables sticky project scenes and reveals all content immediately;
- core information does not depend on hover;
- project status remains visible in text, not only by color;
- mobile hides the decorative chapter rail rather than presenting undersized targets;
- disabled prototype actions are non-interactive and visually reduced.

## 6. Visual refinements applied after browser review

1. Changed the archive hero hierarchy so `Systems.` and `Sites.` are white while `Proof.` remains cyan.
2. Extended the safe stacked breakpoint to 1100 px for tablet portrait layouts.
3. Brought the Financial Stream device composition into the first mobile viewport.
4. Reduced and repositioned the case phone mockup to prevent clipping.
5. Rescaled the system-map orbit and dots for 390 px and 320 px widths.
6. Increased inactive system-item readability on mobile.
7. Stacked the intake schematic on compact mobile.
8. Added explicit keyboard-focus styling.
9. Added active-layer text to the system-map core.
10. Corrected chapter-state persistence after the final case chapter.

## 7. Claim and status QA

Confirmed:

- Financial Stream is labelled `Live client project`;
- Payroll remains an active Financial Stream service;
- Alina Horb is labelled `Live project · ongoing refinement`;
- Local Repair Pro is labelled `Website concept · in development` and is not represented as a client project;
- ProAI Expert is labelled `Internal studio project`;
- Twilio work is not represented as fully deployed automation;
- Gmail + Make + OpenAI is described as human-reviewed draft support;
- GSC metrics remain snapshot-qualified and require exact public dates before launch.

## 8. Remaining gates before production

Still required:

1. review the prototype visually with the real Financial Stream source images;
2. approve the overall archive direction and motion intensity;
3. replace all schematic proof panels with approved current captures;
4. perform final copy and claims review in EN and RU;
5. build production routes in the working branch;
6. test canonical, hreflang, OG and sitemap output;
7. run real-network performance and layout-shift tests;
8. run a complete regression test against the current public site;
9. merge only through a controlled production review.

## 9. Current decision

**Phase 1 browser/layout QA: passed.**  
**Prototype: ready for stakeholder design review and the next implementation pass.**  
**Production readiness: not approved.**
