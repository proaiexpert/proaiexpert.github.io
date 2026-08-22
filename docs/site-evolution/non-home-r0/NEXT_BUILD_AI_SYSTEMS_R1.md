# NEXT BUILDER BRIEF — AI SYSTEMS R1

Status: **READY AFTER OWNER APPROVES R0 — DO NOT EXECUTE FROM R0**  
Project: ProAI Expert  
Page family: AI Systems EN/RU  
Concept authority: `docs/site-evolution/non-home-r0/AI_SYSTEMS_R1_CONCEPT.md`

# 0. Role

Act as:

- Senior Front-End Engineer;
- Senior Creative Developer;
- Motion / Interaction Engineer;
- Responsive Visual QA Lead;
- EN/RU implementation reviewer.

You are the builder, not the strategist. Do not reopen the R0 concept unless implementation proves a concrete defect.

# 1. Scope

Build only:

- `/ai-systems/`
- `/ru/ai-systems/`
- narrowly scoped shared inner-site files required by the approved AI pilot;
- review harness/screenshots in a separate review commit.

Do not modify:

- `/`;
- `/ru/`;
- Golden Homepage components;
- Homepage Footer R2;
- Websites & Branding production page except if a truly shared token file is introduced with zero behavioral change to that unbuilt page;
- case studies;
- Insights;
- About;
- Contact.

# 2. Git safety

After Owner approves R0:

1. identify the Owner-authorized implementation base;
2. create isolated branch `agent/proai-ai-systems-r1` or Owner-approved equivalent;
3. verify the branch starts from the exact authorized SHA;
4. no merge;
5. no deploy;
6. product commit and review commit must be separate.

Do not assume the R0 planning commit itself is the production integration base unless Owner explicitly says so.

# 3. Authorities

Use:

- current AI Systems EN/RU factual/content source at the approved implementation base;
- `AI_SYSTEMS_R1_CONCEPT.md`;
- `INNER_SITE_DESIGN_SYSTEM_R0.md`;
- `NO_REGRESSION_REGISTER.md`;
- canonical Header authority `20a36a5246ac2fb4507c69858289fc55d0f4a977` and its files:
  - `_includes/header-system/header.html`
  - `assets/css/header-system-v1.css`
  - `assets/js/header-system-v1.js`
  - `assets/css/header-footer-logo-r1.css`
  - `assets/js/header-footer-logo-r1.js`
- current navigation/header data files;
- local Inter variable font files.

Homepage Footer R2 `f6103920a4a47b51d1cff06d75ce62992d33d4ee` is a visual/behavioral authority only for what **not** to duplicate. Do not modify its files.

# 4. Core product concept

Implement:

## THE OPERATIONAL REGISTER — SIGNAL → CONTROL

The signature is a one-time registration/alignment of scattered operational information into:

`CAPTURE → CONTEXT → ROUTE → HUMAN CHECK → ACTION`

It must not become:

- a node network;
- a dashboard;
- a terminal;
- a moving rail;
- a 3D cube/object;
- a pile of glass cards.

# 5. Content preservation

Preserve the current strong logic:

- process before software;
- intake/routing;
- context/knowledge;
- communication support;
- repeated admin/follow-up;
- visibility/escalation;
- human review;
- governance/boundaries;
- controlled rollout;
- explicit judgment about what should not be automated.

Do not invent new client claims.

The current RU page contains especially strong native logic around:

- “Мы начинаем не с AI, а с процесса”;
- what not to automate first;
- avoiding AI layered over chaos.

Preserve that authority. EN may be editorially improved to reach semantic parity without mechanically translating RU.

# 6. Claim governance

Current AI-page examples are scenarios unless repository evidence proves they are real deployed client systems.

Use labels such as:

- `REFERENCE SCENARIO`;
- `SYSTEM PATTERN`;
- native RU equivalents.

Do not call them client results.

No invented:

- time saved;
- response-rate improvement;
- lead increase;
- revenue/ROI;
- client logo;
- testimonial;
- automation success percentage.

# 7. Information architecture

Required chapter order:

1. Hero / category / promise / CTA.
2. Where operational complexity is lost.
3. What ProAI builds.
4. Operational Register signature explanation.
5. AI vs automation vs process change.
6. Human control / governance.
7. Implementation protocol.
8. Proof / bounded scenarios / verified artifacts.
9. Integrations / implementation context — quiet treatment only.
10. Final next step.
11. Inner Footer derivative.

The builder may tune exact chapter boundaries for browser rhythm but must not drop a required commercial question.

# 8. Visual system

AI page material family:

- Obsidian;
- Graphite;
- Gunmetal;
- cool blued-steel optical behavior;
- Pearl/Silver text/proof;
- controlled indigo machine accent for active state only.

Reduce legacy cyan materially. Do not use cyan as atmospheric glow.

Use fewer containers. Structural rules, whitespace and alignment should do more work than rounded panels.

# 9. Typography

Use local Inter variable assets.

Do not use Google Fonts for the rebuilt page if local font loading is available.

Follow R0 scale/measure guidance.

EN and RU get independent line-break tuning. Do not shrink RU below the EN visual standard to make it fit.

# 10. Header

Mount the canonical Header System consistently for EN/RU.

Do not retain page-local header ownership as a design authority.

Verify:

- active AI route;
- locale switch;
- CTA;
- live logo + fallback;
- desktop geometry;
- mobile menu;
- reduced motion;
- short-landscape behavior.

# 11. Inner Footer

Create/use the approved inner Footer derivative.

Requirements:

- same ProAI brand/utility logic;
- contact/capabilities/social/locale/legal slots as factually available;
- calmer than Homepage Footer R2;
- no Homepage pointer ripple/material chase by default;
- coordinate final page CTA and Footer CTA to avoid duplicate “final step” blocks.

Do not modify Homepage Footer R2 files.

# 12. Signature motion implementation

The registration sequence:

- should read as physically plausible alignment;
- small distances, no floating-space spectacle;
- total signature sequence target ~900–1100ms;
- play once and settle;
- use scroll position/IntersectionObserver or equivalent without scroll-jacking;
- final content remains visible if JS fails.

Reduced motion:

- render final registered state;
- short opacity only;
- no essential information loss.

No idle `requestAnimationFrame` loop.

# 13. Pointer behavior

Fine pointer only.

Allowed:

- subtle local material/state highlight;
- small state emphasis.

Forbidden:

- replacement cursor;
- large spotlight following across page;
- magnetic CTA;
- required hover.

# 14. Mobile implementation

Do not stack the desktop scene.

Mobile signature:

- one raw inquiry/context object starts the story;
- states resolve vertically one at a time;
- only one or two states are dominant at once;
- proof/scenario moves earlier;
- capability matrix becomes labeled sequences;
- no fixed-height diagram;
- no hover dependency.

Test copy density in RU separately.

# 15. Responsive QA matrix

Minimum:

- 1440 desktop;
- 1366 laptop;
- 1024 tablet;
- 390 mobile portrait;
- 320 small mobile;
- 844×390 or comparable mobile landscape.

Also inspect 430/375 widths if the signature geometry changes near those breakpoints.

PASS requires:

- no horizontal overflow;
- no clipped heading/copy;
- no inaccessible proof;
- no header collision;
- no sticky trap;
- readable RU;
- touch targets ≥44px;
- content works with reduced motion;
- core content still exists without JS.

# 16. Accessibility

Required:

- semantic headings;
- visible focus;
- keyboard-complete navigation/actions;
- AA text/control contrast;
- non-color state cues;
- informative alt text;
- accessible form/CTA destinations;
- reduced motion;
- decorative register layers hidden from accessibility tree when redundant.

# 17. Performance

Target:

- initial JS ≤80KB gzip, preferred <50KB;
- no third-party visual runtime unless separately approved;
- no hero autoplay video;
- above-fold media ≤350KB compressed target;
- initial mobile route ≤900KB before lazy content target;
- LCP ≤2.5s p75 target;
- CLS <0.10;
- INP <200ms.

Measure the actual candidate; do not report targets as achieved metrics without measurement.

# 18. SEO / locale safety

Preserve:

- `/ai-systems/` and `/ru/ai-systems/` routes;
- canonical values;
- EN/RU `hreflang`;
- title/meta intent unless explicitly improved and documented;
- structured data if valid;
- internal links.

No slug changes.

# 19. Implementation architecture

Prefer:

- small shared inner token layer;
- AI-service page-family CSS;
- dedicated register JS;
- Jekyll include/data use where it removes factual duplication;
- no global `section` rule takeover.

Avoid:

- giant inline CSS;
- copied EN/RU code with divergent behavior;
- framework migration;
- uncontrolled dependencies.

# 20. Product commit gate

Before product commit:

1. verify diff contains only approved paths;
2. verify homepage paths are unchanged;
3. verify EN/RU content parity and native phrasing;
4. run route/link/asset checks;
5. run responsive QA;
6. run reduced-motion/keyboard checks;
7. verify no unsupported claims;
8. verify no console errors in review environment;
9. record exact product SHA.

# 21. Review commit

After product commit is frozen:

Create a separate review commit containing only review/harness artifacts as needed.

Required Owner artifacts:

- LIVE EN immutable/candidate URL;
- LIVE RU immutable/candidate URL;
- EN desktop still;
- EN mobile still;
- RU desktop still;
- RU mobile still;
- additional 320/landscape evidence if a defect was fixed there;
- exact screenshot paths;
- product SHA;
- review SHA;
- base SHA.

# 22. Owner-review stop

Do not merge or deploy.

Return the real browser-visible review package and stop for Owner decision.

Owner outcomes:

- `OWNER APPROVE` → next controlled integration step;
- `TARGETED CORRECTION` → fix only identified defects;
- `REJECT` → return to concept/system review, not random polishing.
