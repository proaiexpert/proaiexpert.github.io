# TECHNOLOGY ARCHITECTURE — CINEMATIC SYSTEM FIELD R1.2

Date: 2026-09-22  
Workstream: Homepage Technology Architecture  
Base: \`1a36e3a6e0b0c8eff731f9a735b59b28f06cd051\`  
Builder: \`agent/proai-home-technology-cinematic-r1-2\`

## Scope

R1.2 is a targeted continuation of Technology R1.1. It preserves the R1/R1.1 evidence chain and corrects the specific Owner rejection without modifying production main, Hero, Financial Stream, or Two Worlds source.

Locked conceptual model:

\`OPERATING REQUIREMENTS → SYSTEM FIT → TECHNOLOGY ROLES → TOOLS → IMPLEMENTATION\`

Locked thesis:

**The system determines the tools.**

## Owner issues addressed

### 1. Separate central box / cube-card feeling

R1.1 used a visibly discrete SYSTEM FIT physical core. R1.2 removes that object.

SYSTEM FIT is now embedded into the field as:
- an engraved authority label;
- a central resolution axis;
- a restrained material seam;
- a state shared by the whole architecture.

There is no cube, card, floating module, or second Hero object.

### 2. Density / logo wall

All ten existing platform identities remain in semantic HTML, but only the active technology family is visually authoritative.

Narrative families:
1. MODELS — OpenAI / Claude / Gemini
2. AUTOMATION — n8n / Make / Zapier
3. COMMUNICATION — Twilio / Gmail
4. BUILD / DELIVERY — Vercel / GitHub

Inactive families remain represented through restrained role markers and routing logic rather than ten equally weighted identities.

### 3. One continuous physical field

The composition is one obsidian / graphite machined field with:
- integrated operating constraints;
- embedded SYSTEM FIT axis;
- one active role territory;
- one active identity rail;
- precision routes;
- one implementation output.

Premium depth comes from edge hierarchy, recessed seams, roughness contrast, low-opacity pearl/silver accents, and restrained violet interference rather than additional UI or glow.

## Desktop production choreography

Desktop autoplay is one-shot and begins only when the section becomes materially visible.

Nominal sequence:

- 0 ms — SYSTEM / incoming seam
- 480 ms — constraints establish
- 1050 ms — SYSTEM FIT establishes
- 1550 ms — MODELS authoritative
- 2350 ms — AUTOMATION authoritative
- 3150 ms — COMMUNICATION authoritative
- 3950 ms — BUILD / DELIVERY authoritative
- 4850 ms — resolved final state

The final state reads:

**One architecture. Tools selected to serve it.**

and:

**ARCHITECTURE → IMPLEMENTATION**

The choreography stops after completion and does not restart on re-entry.

Any deliberate role interaction cancels remaining autoplay.

Post-autoplay desktop interaction:
- pointer hover may inspect a role;
- keyboard focus produces the equivalent state;
- click may lock/unlock a role;
- Escape returns to resolved;
- pointer leave returns to resolved when the role is not locked.

No major layout shifts, blur, aggressive glow, or continuous render loop are used.

## Mobile scroll story

On portrait/coarse-pointer mobile, autoplay is intentionally replaced by scroll progression.

The component owns an extended scroll territory with one sticky viewport:
- story height: approximately 430svh;
- sticky viewport: 100svh;
- normal document scrolling remains active;
- no scroll trapping.

Normalized progression:
- opening region — SYSTEM / constraints
- next region — MODELS
- next region — AUTOMATION
- next region — COMMUNICATION
- final region — BUILD / DELIVERY / output

The implementation uses directional hysteresis rather than a raw nearest-threshold switch. Forward and backward gates are deliberately separated so browser chrome changes and small finger movements do not repeatedly toggle states.

Scroll upward is supported and reverses the narrative.

A touch on a role remains a secondary inspection action; continued vertical scrolling resumes state authority.

## Orientation-change preservation

Browser QA found that a direct portrait → landscape resize could initially remap the same absolute scroll position to a later logical stage because the story travel distance changes.

R1.2 now preserves the current logical scroll index during orientation change, maps that stage to a normalized target position in the new geometry, and then resumes scroll-driven updates.

Verified example:
- portrait 390×844 at AUTOMATION
- rotate/resize to 844×390
- remains AUTOMATION
- no horizontal overflow

## Mobile landscape art direction

Landscape is not the R1.1 three-zone desktop compression.

It uses a dedicated short-height composition:
- compact chapter thesis at left;
- one continuous architecture field at right;
- compressed requirement indicators;
- restrained SYSTEM FIT axis;
- one technology family at a time;
- large active role title;
- only that role's 2–3 identities;
- numbered 01 / 02 / 03 / 04 progression rail.

Critical active content is not set at microscopic 6–9px sizes:
- active role title: approximately 31–44px;
- vendor labels: 13px;
- vendor marks: 31px;
- requirement labels: 10px.

## Two Worlds → Technology transition contract

Current production Two Worlds donor was inspected from:
- \`_includes/homepage-two-worlds-golden-r1-en-assembly.html\`
- \`_includes/homepage-two-worlds-golden-r1-ru-assembly.html\`
- \`assets/css/homepage-two-worlds-golden-r1.css\`
- \`assets/js/homepage-two-worlds-golden-r1.js\`

Current Golden fold facts relevant to integration:
- fold centerline: 50%;
- fold width: \`clamp(66px, 5.8vw, 100px)\`;
- material: graphite/bimetal with low-opacity pearl/silver and restrained violet interference;
- fold is already the central physical divider of Two Worlds.

### Future combined-branch contract

Two Worlds should keep its existing body and interaction. Only its terminal boundary behavior needs integration.

Expected terminal event:

\`wide bimetal fold → narrowed mechanical fold → precision seam → Technology receive axis\`

Geometry:
- shared boundary center: **50%**;
- terminal Technology seam: **1 CSS px**;
- no lateral jump;
- no glow bloom.

Recommended handoff timing:
- approximately 360 ms terminal contraction total;
- first ~220 ms: current 66–100px fold visually narrows toward a small mechanical key;
- next ~140 ms: key resolves into a 1px precision seam;
- Technology receiver may begin as the fold passes the narrow-key state so the transition overlaps rather than cuts.

Material:
- retain dark graphite body during contraction;
- pearl/silver edge remains low opacity;
- violet interference remains secondary;
- the result is a precise seam, not a neon line.

R1.2 owner preview simulates the production fold at its real width range and visually tapers it to the Technology seam. Two Worlds source itself is not modified.

## Technology → Financial Stream transition contract

After BUILD / DELIVERY, the architecture resolves to one implementation route.

Narrative:
\`TECHNOLOGY ROLES → ARCHITECTURE → IMPLEMENTATION → PROOF\`

The route converges to the 50% centerline and exits Technology as a 1px physical handoff.

Financial Stream source is not modified. A future integration branch only needs to accept the central incoming cue and let it disappear into the proof composition.

The owner preview includes enough Financial Stream context to judge this handoff without changing the actual section.

## Reduced motion

For \`prefers-reduced-motion: reduce\`:
- choreography is skipped;
- state is immediately RESOLVED;
- extended mobile scroll territory collapses;
- sticky behavior is removed;
- transitions/animations are disabled.

This avoids forcing a multi-viewport scroll story when motion has been reduced.

## Performance

Implementation:
- semantic HTML;
- CSS;
- SVG;
- vanilla JS.

Not used:
- Canvas;
- WebGL;
- Three.js;
- runtime textures;
- particle systems;
- \`setInterval\`;
- continuous animation/render loop.

The existing ten repository SVG marks are reused.

## Real browser QA

QA was performed in Chromium through Playwright using the exact component HTML/CSS/JS. The environment blocks direct localhost/file navigation administratively, so the page was injected with \`page.set_content(...)\`.

The container cannot DNS-fetch the repository SVG assets during this local harness. For geometry/layout screenshots, fixed-size SVG stand-ins occupied the same image boxes. The production component itself still references the real repository brand SVG files; no stand-ins are committed.

### Desktop rendered
- 1920×1080
- 1440×900
- 1366×768
- 1280×720

Verified:
- no horizontal overflow;
- complete one-shot autoplay order;
- settled resolved state;
- autoplay cancellation after deliberate role interaction;
- pointer inspection;
- keyboard focus;
- Escape return to resolved.

### Portrait rendered
- 430×932
- 390×844

Verified:
- sticky scroll sequence;
- forward SYSTEM → MODELS → AUTOMATION → COMMUNICATION → BUILD/DELIVERY progression;
- reverse scroll progression;
- no horizontal overflow;
- only current family visually dominant.

### Landscape rendered
- 844×390
- 896×414
- 932×430

Verified:
- dedicated landscape composition;
- one family at a time;
- 2–3 active identities only;
- no horizontal overflow;
- reverse scroll;
- landscape density materially lower than R1.1.

### RU rendered
Verified at:
- 390×844;
- 844×390.

No horizontal overflow was observed; long Russian BUILD / DELIVERY naming wraps within its territory without colliding with vendor identities.

### Touch rendered
Touch/coarse-pointer emulation verified:
- scroll-driven state authority;
- direct family tap inspection;
- normal vertical scrolling continues afterward.

### Orientation rendered
Verified:
- portrait 390×844 at AUTOMATION;
- resize/rotate to 844×390;
- logical AUTOMATION state retained;
- no horizontal overflow.

### Reduced motion rendered
Verified at:
- 1440×900;
- 390×844.

The section immediately presents the resolved state and does not retain the extended sticky story.

## Design success gate

1. Central cube/card feeling gone — YES
2. One physical system — YES
3. Landscape substantially simpler than R1.1 — YES
4. Only 2–3 vendor identities dominant at once — YES
5. Section demonstrates itself automatically — YES
6. Owner can understand it without state buttons — YES
7. Mobile progresses naturally through four roles — YES
8. Final/rest state is deliberately composed — YES
9. Field remains identifiable without logos — YES
10. Two Worlds → Technology → implementation/proof continuity is explicit — YES

## Scope boundary

R1 and R1.1 remain preserved.  
Hero is not modified.  
Two Worlds source is not modified.  
Financial Stream source is not modified.  
Production main is not modified by this workstream.
