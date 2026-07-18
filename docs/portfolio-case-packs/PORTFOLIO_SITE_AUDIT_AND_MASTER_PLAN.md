# ProAI Expert — Portfolio Site Audit and Final Master Rollout Plan

**Status:** final pre-implementation source of truth  
**Prepared:** July 2026  
**Repository:** `proaiexpert/proaiexpert.github.io`  
**Working branch:** `portfolio-rebrand-v1`  
**Public code rule:** no portfolio change is merged into `main` or published before source parity, preview QA and owner approval.

This document defines the final portfolio architecture, implementation order, content ownership, technical gates and launch rules. Current operational status remains controlled by `PORTFOLIO_REBRAND_CURRENT_HANDOFF.md`.

---

## 1. Executive decisions

The final system is:

1. one shared Case Studies archive in English and Russian;
2. one dedicated EN/RU page pair per case;
3. concise proof modules on the homepage and relevant service pages;
4. real project captures only;
5. a reusable case-page system that can scale from three projects to twenty without changing routes;
6. Financial Stream as the flagship system that establishes the reusable design/components before the archive is finalized.

### Locked primary cases

1. **Financial Stream LLC** — real flagship client project.
2. **Alina Horb** — real live personal-brand/psychology website project.
3. **Local Repair Pro** — concept/showcase project in development.

### Preserved studio case

4. **ProAI Expert** — existing internal studio case, retained as a secondary Studio Case.

---

## 2. Work division

### ChatGPT / project management

Responsible for:

- strategy;
- case architecture;
- public copy;
- evidence/claim control;
- screenshot selection;
- documentation;
- implementation sequence;
- final Codex task specifications.

### Codex / technical implementation

Responsible for:

- source/deployment investigation;
- selective source recovery;
- HTML/CSS/JavaScript;
- responsive behavior;
- local preview;
- asset optimization;
- metadata, accessibility and regression QA;
- production-code commits.

Do not use Codex to repeat already completed strategy or documentation work.

---

## 3. Current-state audit and P0 risk

### Live/source mismatch

The live ProAI Case Studies routes have displayed complete pages, while current `main` does not cleanly contain the matching Case Studies source tree or sitemap representation.

Possible causes include:

- historical GitHub Pages deployment;
- another branch;
- workflow artifact;
- cache/proxy layer;
- deleted source that remains in an older deployment.

### P0 rule

Before any production case code is replaced:

1. identify the actual deployment source;
2. inspect Pages settings, workflows, artifacts and relevant branches;
3. preserve current live HTML and asset paths;
4. compare live output with verified historical source;
5. restore only required files into `portfolio-rebrand-v1`;
6. reproduce current routes locally;
7. confirm no unrelated current work is reverted.

Never overwrite the live site from an arbitrary historical commit and never roll the whole repository back.

---

## 4. Final route architecture

### English

```text
/case-studies/
/case-studies/financial-stream/
/case-studies/alina-horb/
/case-studies/local-repair-pro/
/case-studies/proai-expert/
```

### Russian

```text
/ru/case-studies/
/ru/case-studies/financial-stream/
/ru/case-studies/alina-horb/
/ru/case-studies/local-repair-pro/
/ru/case-studies/proai-expert/
```

### Route policy

- preserve existing Financial Stream and ProAI Expert URLs;
- do not introduce `/work/` or `/portfolio/` alternatives;
- EN/RU archive switches map archive to archive;
- case switches map exact case pairs;
- every launched pair uses self canonical, reciprocal hreflang and `x-default`;
- missing translations must not silently redirect to an unrelated homepage;
- redirects are added only for routes known to have been published or linked externally.

---

## 5. Project classifications

### Financial Stream

- `Real Client Project`
- `Live`
- `Ongoing Optimization`

### Alina Horb

- `Real Website Project`
- `Live` or `In Refinement` according to verified launch status
- client site languages: UA/RU
- portrait, diploma and testimonial require appropriate permission

### Local Repair Pro

- `Concept Project`
- `Website Production Factory Showcase`
- `In Development`
- never present as a completed paid client engagement

### ProAI Expert

- `Internal Studio Project`
- `Live`
- secondary Studio Case position

---

## 6. Final implementation order

The order below is locked because it minimizes rework.

### Stage 0 — Source and deployment parity

Deliverables:

- deployment-source report;
- current live route/source comparison;
- selectively restored Case Studies source on `portfolio-rebrand-v1`;
- local reproduction of existing routes;
- no live changes.

Gate:

- the current live pages can be explained and reproduced safely.

### Stage 1 — Financial Stream flagship detail pages

Build first:

- `/case-studies/financial-stream/`
- `/ru/case-studies/financial-stream/`

Why first:

Financial Stream is the deepest real case and defines the reusable components for every later case:

- cinematic/editorial hero;
- status and metadata strip;
- chapter navigation;
- proof strip;
- system map;
- screenshot panels;
- evidence blocks;
- automation status labels;
- testimonial;
- verified outcomes;
- next-case transition;
- language metadata.

Gate:

- EN/RU pages complete locally;
- selected visuals work in context;
- content/claims approved;
- mobile/reduced-motion QA passes;
- owner approves the flagship direction.

### Stage 2 — Case Studies archive foundation

Build the archive only after the Financial Stream system is stable.

Archive launch structure:

1. completed Financial Stream feature stage;
2. structurally ready Alina stage with truthful status;
3. structurally ready Local Repair Pro stage with concept label;
4. secondary ProAI Expert Studio Case.

The archive is a discovery/comparison layer—not a replacement for detail pages.

Gate:

- desktop/mobile hierarchy approved;
- unfinished cases are not represented as complete;
- archive routes and case links work locally.

### Stage 3 — Alina Horb detail pages

Requirements:

- use current real UA/RU website captures;
- preserve the approved editorial sanctuary direction;
- describe the actual project accurately;
- create natural EN/RU portfolio narratives without pretending the client site is English;
- confirm portrait, diploma and testimonial permissions;
- no synthetic portrait or obsolete arch concepts.

Gate:

- real visual package approved;
- permissions and claims verified;
- EN/RU portfolio pages complete.

### Stage 4 — Local Repair Pro detail pages

Requirements:

- preserve `Concept Project` classification;
- remove internal/demo-only wording before public use;
- use current real demo captures;
- disable or clearly label non-production form behavior;
- do not invent reviews, licensing, phone, years, metrics, clients or outcomes.

Gate:

- current demo works responsively;
- truthful labels are visible;
- no fake proof appears.

### Stage 5 — Final archive polish

After all three primary cases exist:

- finalize project transitions;
- balance card/stage hierarchy;
- refine comparison metadata;
- complete next-case navigation;
- verify all EN/RU routes;
- retain ProAI Expert Studio Case.

### Stage 6 — Site integration

- strengthen homepage Financial Stream module as `Featured Client Case`;
- add `View Case Study` while retaining `View Live Site` as secondary;
- link Websites & Branding proof to the case/archive;
- add a compact AI Systems proof teaser only when sanitized automation evidence exists;
- normalize global navigation and footer;
- do not duplicate full case narratives outside detail pages.

### Stage 7 — SEO, accessibility, performance and regression QA

- canonical/hreflang/x-default;
- unique metadata;
- sitemap only for approved live routes;
- OG/Twitter assets;
- alt text;
- keyboard/focus QA;
- reduced motion;
- image optimization;
- broken-link crawl;
- EN/RU pair crawl;
- responsive and short-height landscape QA;
- no-regression tests.

### Stage 8 — Controlled launch

- owner approves complete preview;
- final branch is reviewed;
- backup/rollback point retained;
- approved commits merged once;
- deployment verified;
- live smoke test completed;
- sitemap resubmitted only after live validation.

---

## 7. Shared case-page system

Every case uses a reusable narrative shell while keeping its own art direction.

### Required chapters

1. Overview / cinematic hero.
2. Business or project context.
3. System/scope map.
4. Visual walkthrough.
5. Proof / verified outcomes.
6. Owner or project perspective.
7. Next-case transition.

Financial Stream may use a deeper twelve-chapter structure defined in its master brief.

### Shared components

- truthful status badge;
- project metadata;
- live-site CTA where applicable;
- chapter progress/navigation;
- screenshot panels;
- proof/evidence cards;
- testimonial module;
- next-case module;
- reduced-motion behavior;
- EN/RU metadata/language pairing.

### Technical rules

- scope portfolio styles;
- avoid generic global selectors;
- avoid unnecessary frameworks;
- content remains readable without JavaScript motion;
- no horizontal overflow from 320px upward;
- meaningful keyboard and focus behavior;
- image dimensions/aspect ratios prevent layout shift.

---

## 8. Visual direction

Overall direction:

**Cinematic Editorial Systems**

Characteristics:

- dark ProAI shell;
- large editorial typography;
- real project captures;
- controlled project-color transitions;
- restrained sticky storytelling;
- motion used for hierarchy, not decoration.

Project worlds:

- Financial Stream: midnight navy, ice blue, white, restrained financial green.
- Alina Horb: ivory, stone, sage, muted terracotta.
- Local Repair Pro: deep forest, warm stone, amber, off-white.
- ProAI Expert: graphite, cyan, metallic neutrals.

Visual rules:

- no generated UI or synthetic project imagery;
- no fake dashboards;
- no placeholder portraits;
- no browser chrome in portfolio masters;
- open chatbot only in a deliberate proof frame;
- do not distort screenshots to fit device frames;
- keep text inside screenshots readable;
- use presentation masters separately from raw evidence captures.

---

## 9. Archive design and scaling

### Three to five projects

- large editorial project stages;
- strong visual distinction;
- no unnecessary category filters;
- secondary Studio Case section.

### Six to ten projects

- retain 2–3 featured stages;
- add a structured project grid;
- introduce useful status/category labels;
- filters only when categories materially help.

### Eleven to twenty projects

- featured editorial cases remain at top;
- searchable/filterable archive below;
- pagination or progressive loading;
- consistent metadata;
- unchanged individual case URLs.

---

## 10. Content ownership and anti-duplication

| Content | Canonical location | Other placements |
|---|---|---|
| Full project story | Individual case page | concise teaser only |
| Full testimonial | Individual case | shortened approved excerpt where useful |
| Financial Stream GSC evidence | Financial Stream case | no raw dashboard on homepage/service pages |
| Financial Stream intake architecture | Financial Stream case | one capability line elsewhere |
| Gmail/Make workflow | Financial Stream automation chapter | compact AI Systems teaser after sanitization |
| Project browsing/comparison | Case Studies archive | homepage links to archive |
| Studio methodology | Services/About | cases show project-specific application only |

Placement roles:

- homepage: credibility and curiosity;
- service page: capability proof;
- archive: discovery and comparison;
- detail page: complete evidence-backed narrative.

Do not repeat the same long summary in all four placements.

---

## 11. Homepage and service integration

### Homepage

Retain the existing Financial Stream module and owner feedback.

Later improvements:

- label `Featured Client Case`;
- primary `View Case Study` CTA;
- secondary `View Live Site` CTA;
- concise proof line;
- `View All Case Studies` route.

Do not replace it with a generic three-card grid and do not insert full case evidence into the homepage.

### Websites & Branding

- retain concise Financial Stream and ProAI visual proof;
- link to Financial Stream case and archive;
- do not duplicate full testimonial, metrics, intake or automation story.

### AI Systems

- add only a compact operational proof module after sanitized evidence exists;
- describe Chatbase and human-reviewed email drafting accurately;
- label Twilio tested/partial;
- do not imply full business automation.

### About / Insights

- use small contextual links only;
- no automatic site-wide case insertion until the archive is stable.

---

## 12. SEO and metadata plan

Each launched archive/case page requires:

- unique title and meta description;
- one H1;
- self canonical;
- reciprocal EN/RU hreflang;
- `x-default` to EN;
- correct language attribute;
- OG/Twitter image;
- descriptive alt text;
- accurate breadcrumbs/schema if used;
- meaningful internal links.

Sitemap rules:

- include only approved live canonical routes;
- use accurate `lastmod` values;
- do not index temporary previews;
- do not publish undated or unsupported SEO claims.

---

## 13. Branch and commit model

Work only on `portfolio-rebrand-v1` for the current rollout.

Recommended atomic commits:

1. source/deployment recovery;
2. shared case foundation;
3. Financial Stream EN;
4. Financial Stream RU;
5. archive foundation;
6. Alina case;
7. Local Repair case;
8. final archive polish;
9. navigation/footer integration;
10. metadata/sitemap;
11. QA fixes.

Do not merge or publish partial work.

---

## 14. QA matrix

### Content and truth

- correct project classification;
- Payroll active in Financial Stream;
- no unsupported performance claims;
- current metrics include date/period;
- historical metrics labelled historical;
- automation statuses explicit;
- permissions confirmed where required.

### Responsive

Test at minimum:

- 320px;
- 360/375px;
- 390px;
- 430px;
- 768px;
- 1024px;
- 1440px;
- short-height mobile landscape.

Check:

- no horizontal overflow;
- no clipped headings;
- readable screenshots;
- stable sticky behavior;
- usable mobile menus;
- no excessive blank space.

### Accessibility

- semantic landmarks/headings;
- keyboard navigation;
- visible focus;
- sufficient contrast;
- reduced motion;
- no hover-only content;
- meaningful alt text.

### Functional/no regression

- homepage interactions still work;
- Financial Stream homepage module still works;
- service and Insights routes remain intact;
- contact anchors/forms remain intact;
- language switches map correctly;
- no console errors;
- no missing assets;
- no CSS collisions;
- 404 behavior remains correct.

---

## 15. Rollback plan

Before public merge:

1. preserve the pre-portfolio source state;
2. record the last known-good deployment SHA;
3. retain atomic commits;
4. revert only portfolio/integration commits if necessary;
5. do not force-reset unrelated work;
6. validate rollback on the custom domain and language routes.

---

## 16. Definition of ready

Implementation can begin when:

- the source/live mismatch is investigated;
- safe source recovery is defined;
- current routes reproduce locally;
- the route map and project classifications are locked;
- Financial Stream master brief/build task are current;
- the selected Financial Stream visual package remains intact;
- no public code has been changed prematurely.

---

## 17. Definition of done

The portfolio rollout is complete when:

- one scalable EN/RU archive exists;
- Financial Stream, Alina and Local Repair have dedicated pages;
- ProAI Expert Studio Case remains valid;
- homepage/service proof links to canonical cases;
- navigation/footer are consistent;
- sitemap and metadata are correct;
- classifications and claims are accurate;
- desktop/mobile/reduced-motion QA passes;
- no existing route or integration regresses;
- owner approves the complete preview;
- one controlled launch succeeds;
- rollback remains available.

---

## 18. Immediate next action

The next technical task is:

**Codex performs source/live parity investigation and, after the gate passes, implements the Financial Stream EN/RU flagship case using `financial-stream/CASE_V2_BUILD_TASK.md`.**

Do not build Alina, Local Repair Pro, final archive integration or publish in that same task.
