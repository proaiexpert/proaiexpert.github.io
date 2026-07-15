# ProAI Expert — Rebrand Opportunity Log

**Status:** Proposals only — no public implementation yet  
**Branch:** `portfolio-rebrand-v1`  
**Rule:** Every item requires prototype or copy review before production changes.

## P0 — Portfolio and source control

### 1. Restore Case Studies as a first-class current-site system

Current issue:

- historical Case Studies pages remain accessible on the custom domain;
- current `main` does not contain the matching source;
- navigation and sitemap omit the portfolio system.

Proposed direction:

- rebuild the archive and cases natively in the current ProAI system;
- preserve all established EN/RU routes;
- add Case Studies to navigation only after production pages pass QA;
- add canonical, hreflang, sitemap and OG coverage in one controlled launch.

## P1 — Positioning architecture

### 2. Refine AI Systems from a tool category into an operating-system offer

Current strength:

- the site already emphasizes intake, routing, communication support, knowledge workflows and human control.

Recommended positioning shift:

> **AI systems that organize how work, information and client requests move through a service business.**

This is stronger than presenting AI as isolated chatbots or automations.

Recommended capability families:

1. Intake and qualification systems.
2. Routing and handoff systems.
3. Knowledge and response-support systems.
4. Follow-up and communication workflows.
5. Human review, governance and control.
6. Reporting and operational visibility where verified.

Avoid:

- autonomous-business language;
- generic lists of AI tools;
- claims that AI replaces professional judgment;
- presenting every automation as an agent.

### 3. Clarify the relationship between the two core directions

Recommended master framing:

- **AI Systems & Operations** — improves how work moves internally.
- **Websites & Digital Presence** — improves how the business is understood and trusted externally.

Shared outcome:

> A stronger business interface — inside and outside.

This creates one studio logic instead of two unrelated service categories.

## P1 — Proof architecture

### 4. Give every Financial Stream placement a distinct job

#### Homepage

Role: flagship teaser and first-party trust proof.

Keep:

- Tetiana testimonial;
- desktop/mobile presentation;
- concise project summary.

Add after case launch:

- primary `View Case Study` CTA;
- secondary `View Live Site` CTA.

#### Websites & Branding

Role: website capability proof.

Focus:

- presentation quality;
- service architecture;
- bilingual implementation;
- responsive consistency.

Do not repeat:

- full testimonial;
- full GSC layer;
- full automation story.

#### AI Systems

Role: optional compact operational proof.

Only after sanitized evidence exists, show:

- Chatbase navigation/support;
- Gmail + Make + OpenAI draft preparation;
- human approval;
- partial/testing status for Twilio where relevant.

Do not add a second full Financial Stream case.

#### Case page

Role: complete evidence-led narrative.

### 5. Build a reusable proof-status vocabulary

Use visible labels consistently:

- Live client project.
- Live project — ongoing refinement.
- Website concept — in development.
- Internal studio project.
- Live / implemented.
- Tested / partial.
- Planned.

This protects credibility as the archive expands.

## P2 — Navigation and site coherence

### 6. Normalize the global information architecture

After portfolio production QA:

```text
Home
AI Systems
Websites & Branding
Case Studies
About
Insights
Contact
```

Review mobile menu density before adding the item.

### 7. Add controlled cross-linking

Recommended links:

- homepage Financial Stream teaser → full case;
- Websites & Branding showcase → Financial Stream case + all cases;
- case pages → relevant service page;
- case pages → next project;
- articles about websites/AI systems → relevant case only when contextually useful.

Avoid site-wide repetitive case banners.

## P2 — Visual identity and interaction

### 8. Preserve the current dark ProAI identity but increase editorial maturity

Keep:

- graphite/black base;
- cyan technical accent;
- spatial depth;
- strong motion language.

Strengthen:

- larger editorial typography;
- calmer spacing;
- fewer simultaneous animated objects;
- project-specific color worlds;
- more real screenshots and less generic abstract technology imagery;
- evidence modules that feel designed, not dashboard-like.

### 9. Establish motion tiers

#### Tier A — global

- reveal;
- progress;
- restrained parallax;
- project-color transitions.

#### Tier B — case-specific

- Financial Stream: connected system map and device expansion.
- Alina: softer editorial mask reveals and portrait/typography transitions.
- Local Repair: result-focused screen movement and service-area rhythm.

#### Tier C — prohibited by default

- scroll hijacking;
- sound;
- loaders;
- heavy WebGL;
- custom cursor dependency;
- information hidden behind hover;
- horizontal mobile galleries.

## P2 — Content and commercial clarity

### 10. Reduce generic “premium” repetition

The brand should prove premium quality through:

- composition;
- clarity;
- evidence;
- specific decisions;
- accurate project status;
- strong screenshots.

Use the word `premium` selectively rather than as a substitute for proof.

### 11. Make the primary offer more commercially legible

Potential high-level statement for later review:

> ProAI Expert designs the systems behind clearer operations and the digital presence that helps service businesses earn trust.

This is a proposal, not approved production copy.

## P3 — SEO and technical quality

### 12. Restore the portfolio SEO map in one launch

Required:

- one canonical per page;
- paired EN/RU hreflang;
- `x-default` to EN;
- unique titles and descriptions;
- portfolio routes in sitemap;
- project-specific OG images;
- accurate alt text;
- noindex removed only at production launch;
- no conflicting redirects.

### 13. Keep preview and production strictly separate

Preview paths remain:

```text
/previews/portfolio-v1/
/previews/portfolio-v1/financial-stream/
```

Production routes are not changed until approval.

## Decision sequence

1. Review Phase 1 prototype.
2. Run independent design/UX/deployment critique.
3. Correct prototype.
4. Approve shared portfolio system.
5. Capture Financial Stream evidence set.
6. Build production EN/RU Financial Stream case.
7. Build archive.
8. Build Alina.
9. Clean and build Local Repair.
10. Integrate homepage, service pages, navigation and SEO.
11. Run no-regression QA.
12. Controlled production launch with rollback point.
