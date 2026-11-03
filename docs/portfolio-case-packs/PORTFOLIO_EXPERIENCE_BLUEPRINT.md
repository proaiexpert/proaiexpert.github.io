# ProAI Expert — Portfolio Experience Blueprint

**Status:** Approved direction for design prototyping  
**Applies to:** `/case-studies/`, `/ru/case-studies/`, and all individual case pages  
**Build order:** Financial Stream → Alina Horb → Local Repair Pro

## 1. Objective

Create a premium, highly visual, motion-led case-study system that feels alive without becoming noisy, slow, or difficult to use.

The portfolio must communicate three things immediately:

1. ProAI Expert thinks strategically, not only visually.
2. Each project is a real system with structure, content, intake, and business logic.
3. The studio can adapt its design language to different industries while preserving one recognizable ProAI case-study framework.

Do not rebuild the whole ProAI website. Upgrade the existing Case Studies architecture.

---

## 2. Chosen creative direction

### Cinematic Editorial Systems

A hybrid of:

- premium editorial storytelling;
- dark ProAI technology framing;
- project-specific color worlds;
- large real website captures;
- controlled scroll choreography;
- clear business proof.

The experience should feel closer to a studio presentation than a conventional blog article.

### Shared portfolio shell

- dark graphite background;
- subtle grid/noise layer;
- large typography;
- restrained cyan ProAI interface accents;
- sticky progress navigation;
- project-specific accent colors inside each case;
- strong whitespace and long visual pauses;
- motion used to reveal hierarchy, not decorate everything.

### Project color worlds

- **Financial Stream:** midnight navy, ice blue, white, restrained financial green.
- **Alina Horb:** ivory, stone, sage, muted terracotta.
- **Local Repair Pro:** deep forest, warm stone, amber, off-white.

The shell remains recognizably ProAI, while the project canvas adopts the client’s visual language.

---

## 3. Case Studies index experience

The archive should not be a small card grid. With only three priority cases, use three large editorial project stages.

### Desktop structure

1. **Opening hero**
   - large heading: Selected Work / Избранные проекты;
   - short positioning line;
   - animated project count `03`;
   - subtle downward cue.

2. **Three stacked project stages**
   - each stage occupies approximately 75–90vh;
   - card becomes sticky briefly while the next card slides over it;
   - project screenshot moves with subtle depth/parallax;
   - project title, category, status, and one-line result remain readable at all times;
   - CTA appears after the visual settles.

3. **Final studio CTA**
   - concise invitation to discuss a project;
   - no generic archive filler.

### Project-card behavior

On entry into viewport:

- background color transitions toward the project accent;
- screenshot rises 24–40px and sharpens from a soft blur;
- title reveals line by line;
- tags appear with short stagger;
- a thin progress line fills across the card;
- CTA arrow moves only on hover/focus.

On hover:

- screenshot tilts by no more than 1.5–2 degrees;
- a second project image may crossfade in;
- no autoplay video is required for V1.

### Mobile behavior

- normal vertical cards, no sticky stacking dependency;
- one strong image per project;
- all information visible without hover;
- reduced parallax;
- no horizontal overflow.

### No filters initially

Three projects do not justify category filters. Add filters only when the archive contains at least six materially different cases.

---

## 4. Individual case-page experience

Each case uses the same narrative skeleton but receives its own art direction.

### Chapter 01 — Cinematic hero

- full viewport opening;
- category and real project status at top;
- large project title;
- concise outcome statement;
- layered desktop/mobile website captures;
- live-site CTA and project metadata;
- project-specific accent glow.

#### Hero motion

- title enters with masked line reveal;
- devices rise separately with slight depth;
- on first scroll, the main device expands toward the viewport width;
- metadata remains stable and readable;
- no excessive rotation or floating objects.

### Chapter 02 — Business context

- short challenge statement;
- client/business facts in a clean side rail;
- one large visual or typographic statement;
- text reveals in logical groups, not word-by-word.

### Chapter 03 — System map

Show what was built as an interconnected system rather than a service list.

For Financial Stream:

- bilingual architecture;
- service structure, including Payroll;
- structured intake;
- short form;
- calendar-after-context;
- Chatbase;
- content/SEO;
- Gmail/Make layer.

Interaction:

- central system diagram or connected cards;
- active node highlights as the user scrolls;
- supporting screenshot changes in a sticky visual panel.

### Chapter 04 — Visual walkthrough

A sequence of 5–8 large screens.

Recommended rhythm:

1. full-width homepage;
2. paired EN/RU view;
3. service architecture;
4. intake/contact flow;
5. content/SEO layer;
6. mobile implementation;
7. optional automation evidence.

Use alternating layouts rather than repeating identical cards.

Motion:

- image masks open vertically or horizontally;
- captions appear after image reveal;
- device frames move minimally;
- full-page captures may use slow scroll simulation only when it adds understanding.

### Chapter 05 — Proof layer

Use compact, evidence-backed modules:

- verified project status;
- dated SEO/GSC snapshot;
- bilingual production architecture;
- indexed-page snapshot;
- owner testimonial;
- live-site link.

Do not turn weak metrics into a fake dashboard. The proof section must remain restrained and credible.

### Chapter 06 — Owner perspective

- large testimonial block;
- owner name and role;
- optional portrait/logo only with permission;
- background may transition into the project’s light color world;
- quote reveals as one block, not as animated individual words.

### Chapter 07 — Next project transition

- full-width teaser for the next case;
- next project color slowly replaces the current project color;
- title and screenshot enter from opposite directions;
- direct route to the next case and back to archive.

---

## 5. Sticky navigation and progress

### Desktop

Use a slim right-side or left-side chapter rail:

- `01 Overview`
- `02 Context`
- `03 System`
- `04 Screens`
- `05 Proof`
- `06 Perspective`

The active chapter changes on scroll. Clicking a chapter uses smooth scrolling and preserves accessible focus behavior.

### Mobile

Replace the rail with a compact sticky progress bar showing current chapter number and title.

---

## 6. Motion system

### Allowed

- masked text reveal;
- opacity + translate transitions;
- subtle screenshot parallax;
- project-color transitions;
- sticky visual storytelling;
- restrained device tilt;
- chapter progress animation;
- image crossfade;
- next-project transition.

### Avoid

- constant floating objects;
- animation on every paragraph;
- cursor tricks that interfere with links;
- long intro loaders;
- scroll hijacking;
- heavy WebGL as a dependency;
- auto-playing sound;
- horizontal galleries on mobile;
- effects that hide information until hover.

### Performance rules

- prefer CSS transforms and opacity;
- use `IntersectionObserver` for reveals;
- use GSAP only if native implementation becomes materially harder;
- lazy-load below-the-fold assets;
- provide `prefers-reduced-motion` behavior;
- maintain responsive behavior from 320px upward;
- do not animate full-resolution PNG masters.

---

## 7. Financial Stream flagship composition

Financial Stream is the first implementation and defines the reusable system.

### Required sections

1. Hero with desktop/mobile composition.
2. Real-client status and live-site CTA.
3. Business context.
4. Scope/system map.
5. Bilingual EN/RU proof.
6. Services including Payroll.
7. Structured intake + short contact path.
8. Calendar-after-context logic.
9. Content and SEO layer.
10. Dated GSC evidence.
11. Chatbase and sanitized Gmail/Make evidence.
12. Tetiana owner testimonial.
13. Next case: Alina Horb.

### Existing assets to reuse

- `assets/img/cases/financial-stream/fs-home-desktop-en-1600w.webp`
- `assets/img/cases/financial-stream/fs-home-mobile-en-640w.webp`
- existing owner testimonial copy;
- existing SEO/GSC evidence derivatives.

### New captures required

- EN/RU homepage pair;
- services view;
- structured intake;
- short form;
- calendar-after-context;
- Chatbase open state;
- article/content pair;
- full desktop/mobile pages;
- sanitized Gmail/Make workflow.

---

## 8. Prototype workflow

Do not implement the full case immediately.

### Prototype 1 — Archive + Financial Stream opening

Build a non-public preview containing:

- Case Studies hero;
- three stacked project stages;
- Financial Stream cinematic hero;
- sticky chapter rail;
- one system-map section;
- one large screenshot transition;
- testimonial block;
- next-project transition.

This prototype is enough to validate the entire motion language.

### Approval gate

Before full production, verify:

- visual quality;
- animation rhythm;
- desktop/mobile behavior;
- readability;
- ProAI brand consistency;
- performance;
- no source/live deployment conflict.

After approval, expand Financial Stream and reuse the system for Alina and Local Repair Pro.

---

## 9. Source and deployment gate

Current live Case Studies content and current `main` repository content have shown a source/live mismatch.

Before public edits:

1. identify the actual deployment source;
2. restore source/live parity;
3. preserve the current live pages;
4. build the prototype in an isolated preview path or branch;
5. publish only after visual and technical QA.

Do not overwrite live Case Studies with an old historical HTML snapshot.

---

## 10. Final build order

1. Resolve source/live parity.
2. Build portfolio-motion prototype.
3. Review and refine the prototype.
4. Complete Financial Stream flagship case.
5. Build Alina Horb case using the shared system and her editorial visual world.
6. Clean and build Local Repair Pro as a clearly labeled concept case.
7. Update Case Studies archive and homepage Selected Work block.
8. Run EN/RU, responsive, accessibility, performance, SEO, and claims QA.
