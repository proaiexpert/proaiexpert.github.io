# Homepage V2 — Skip-Link Screenshot Probe

Production head: `2eef87720d17ee30abc6cd4ac215c158940b2de0`
Status: **NOT A DEFECT**

During owner-review preparation, the Playwright full-page screenshots visually showed the skip link near the top edge. Because the actual CSS contract requires the skip link to remain outside the viewport until keyboard focus, a separate runtime probe was executed before treating this as a production defect.

Probe artifact ID: `9009091632`

Observed on clean load:

- EN 1440: top `-74.4px`, bottom `-26.4px`, `visibleInViewport=false`, active element `BODY`.
- EN 390: top `-74.4px`, bottom `-26.4px`, `visibleInViewport=false`, active element `BODY`.
- RU 390: top `-74.4px`, bottom `-26.4px`, `visibleInViewport=false`, active element `BODY`.

Computed transform in every case:
`matrix(1, 0, 0, 1, 0, -86.4)`

After the mobile-menu Escape path, the skip link remained outside the viewport; focus was correctly on the menu toggle.

Conclusion: the visible skip-link fragment in some Playwright `fullPage` screenshots is a screenshot/stitching artifact, not live page behavior. No production correction is required.
