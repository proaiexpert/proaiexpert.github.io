# ProAI Expert — Portfolio Site Audit and Master Rollout Plan

**Status:** Pre-implementation source of truth  
**Prepared:** July 2026  
**Repository:** `proaiexpert/proaiexpert.github.io`  
**Public code freeze:** No portfolio-related public HTML, CSS, JavaScript, navigation, sitemap, redirects, or assets may be changed until the readiness gates in this document are completed.

---

## 1. Executive decision

The correct portfolio architecture is:

1. **One shared Case Studies archive** in English and Russian.
2. **One dedicated page per case** in English and Russian.
3. **Selected proof modules on the homepage and relevant service pages** that point into the case-study system without duplicating the entire case.
4. A scalable structure that starts with three priority portfolio cases and can later grow to 5, 10, or 20 projects without changing the URL model.

### Priority portfolio cases

1. **Financial Stream LLC** — flagship real client case.
2. **Alina Horb Psychology Practice** — real/live personal-brand website case, subject to publication permissions.
3. **Local Repair Pro** — concept/showcase case, always labelled as a concept rather than a completed client engagement.

### Existing studio case that must be preserved

4. **ProAI Expert** — existing internal studio flagship case.

The ProAI Expert case must not be deleted merely because the first portfolio rollout focuses on three external/concept projects. Its existing EN/RU URLs should remain valid. It can live in a secondary **Studio Case** position rather than competing with the three priority projects.

---

## 2. Confirmed current-state audit

### 2.1 Live URLs currently accessible

The following live routes currently return full pages:

- `/case-studies/`
- `/ru/case-studies/`
- `/case-studies/financial-stream/`
- `/ru/case-studies/financial-stream/`
- `/case-studies/proai-expert/`
- `/ru/case-studies/proai-expert/`

The live archive currently presents Financial Stream and ProAI Expert.

### 2.2 Current `main` branch does not match the live site

The current repository state is materially different from what the custom domain serves:

- `case-studies/index.html` in `main` is only a redirect to `/` with `noindex`.
- `ru/case-studies/index.html` is absent through the current Contents API.
- the individual Financial Stream and ProAI Expert case HTML files are absent from current `main` through the Contents API;
- the current sitemap does not include any Case Studies archive or case-page URLs;
- Git history contains commit `5fa342a64b464493a0935047c7c84d6c3884c4f0` with message **Delete case-studies directory**.

### 2.3 Risk classification

This is a **P0 source/live parity problem**.

The live site may be serving a historical deployment, cached content, a different deployment source, or a layer that is not represented by the current `main` tree. The exact mechanism must be verified before implementation.

Do not:

- overwrite the live case pages from an arbitrary historical commit;
- merge new archive code directly into `main`;
- add navigation to `/case-studies/` while the source/deployment mismatch remains unresolved;
- assume that a URL opening today proves the corresponding source exists in the active deployment branch.

### 2.4 Sitemap and discoverability gap

The current `main` sitemap includes core pages and insights, but no Case Studies routes. Therefore the intended portfolio system is not represented consistently in the source-controlled SEO map.

### 2.5 Navigation inconsistency

The current main homepage, AI Systems page, and Websites & Branding page use a navigation set without **Case Studies**.

The live Case Studies pages use a different navigation set that includes **Case Studies**.

This creates two competing shells and must be normalized only after the archive source is restored safely.

---

## 3. Existing Financial Stream placements

Financial Stream already appears in multiple places. These placements should be retained, clarified, and connected rather than duplicated or removed blindly.

### 3.1 Homepage

Current role:

- major interactive Financial Stream proof section;
- owner testimonial;
- desktop and mobile device composition;
- CTA currently goes to the Financial Stream live website.

Existing assets:

- `assets/img/cases/financial-stream/fs-home-desktop-en-1600w.webp`
- `assets/img/cases/financial-stream/fs-home-mobile-en-640w.webp`

Future role:

- retain it as the strongest homepage proof module;
- strengthen it into a **Featured Client Case** teaser;
- preserve the owner testimonial;
- add a primary `View Case Study` CTA;
- retain a lower-emphasis `View Live Site` CTA;
- do not reproduce the full case narrative on the homepage.

### 3.2 Websites & Branding page

Current role:

- Financial Stream and ProAI Expert are shown together in an examples/showcase section;
- Financial Stream desktop and mobile assets are reused;
- the section demonstrates visual and structural quality but does not currently function as a strong gateway into the dedicated case.

Future role:

- retain this as a service-specific proof module;
- use one concise Financial Stream explanation;
- link directly to the Financial Stream case page;
- optionally link to the overall archive;
- do not duplicate the full testimonial, GSC evidence, forms, or automation story here.

### 3.3 AI Systems page

Current role:

- no dedicated Financial Stream case module was identified in the current live page content.

Future role:

- do not force a full Financial Stream block onto the page;
- only add a small **Operational Layer Example** after sanitized Gmail/Make evidence is available;
- describe Chatbase and human-reviewed email drafting accurately;
- label Twilio as tested/partial unless current production proof is attached;
- link to the automation chapter of the Financial Stream case where possible.

### 3.4 Case Studies archive

Future role:

- the canonical browse/discovery layer for all projects;
- no full testimonials or long project essays;
- each project contains title, classification, status, one concise outcome, visual, tags, and `View Case` CTA.

### 3.5 Individual Financial Stream case

Future role:

- canonical full case narrative;
- the only place where all layers come together: business context, bilingual architecture, services including Payroll, inquiry flow, SEO/content, automation, owner testimonial, and dated evidence.

---

## 4. Final information architecture

### 4.1 English routes

```text
/case-studies/
/case-studies/financial-stream/
/case-studies/alina-horb/
/case-studies/local-repair-pro/
/case-studies/proai-expert/
```

### 4.2 Russian routes

```text
/ru/case-studies/
/ru/case-studies/financial-stream/
/ru/case-studies/alina-horb/
/ru/case-studies/local-repair-pro/
/ru/case-studies/proai-expert/
```

### 4.3 Route policy

- preserve existing Financial Stream and ProAI Expert URLs;
- do not introduce a competing `/work/` or `/portfolio/` system;
- create static redirect stubs from `/work/` and `/portfolio/` only if those routes have already been published or linked externally;
- all EN/RU case pairs must have canonical, `hreflang="en"`, `hreflang="ru"`, and `x-default`;
- archive language switches must map archive-to-archive;
- case language switches must map the exact case pair;
- a missing translation must not silently redirect to an unrelated homepage.

---

## 5. Archive design and scale model

### 5.1 Launch state

The archive launches with three primary project stages:

1. Financial Stream.
2. Alina Horb.
3. Local Repair Pro.

A secondary **Studio Case** module preserves ProAI Expert.

### 5.2 Visual direction

Use the approved **Cinematic Editorial Systems** direction:

- dark ProAI shell;
- large editorial typography;
- real project captures;
- controlled project-color transitions;
- restrained sticky storytelling;
- motion that reveals hierarchy rather than decorating every element.

### 5.3 Scaling from 3 to 20 projects

#### 3–5 projects

- large editorial stages;
- strong visual distinction;
- no category filters;
- one secondary studio/internal section if needed.

#### 6–10 projects

- retain 2–3 featured editorial stages at the top;
- add a structured project grid below;
- introduce status/category labels;
- filters are optional only if categories are materially useful.

#### 11–20 projects

- featured projects remain editorial;
- searchable/filterable archive below;
- pagination or progressive load;
- consistent project metadata;
- no redesign of individual case URLs.

The route architecture remains unchanged at every scale.

---

## 6. Project classification and truth labels

### Financial Stream

- `Real Client Project`
- `Live`
- `Ongoing Optimization`

### Alina Horb

- `Real Website Project`
- `Live` or `In Refinement`, according to verified status at launch;
- name, portrait, diploma, and testimonial usage require explicit permission.

### Local Repair Pro

- `Concept Project`
- `Website Production Factory Showcase`
- never describe it as a completed paid client engagement;
- no fake phone, email, reviews, licensing, years, metrics, or customer outcomes.

### ProAI Expert

- `Internal Studio Project`
- `Live`
- position as a studio flagship, not as an external client case.

---

## 7. Individual case-page system

Each case uses the same reusable narrative shell while adopting its own project art direction.

### Required chapters

1. **Overview / Cinematic Hero**
2. **Business Context**
3. **System or Scope Map**
4. **Visual Walkthrough**
5. **Proof / Verified Outcomes**
6. **Owner or Project Perspective**
7. **Next Case Transition**

### Shared components

- case status badge;
- live-site CTA where a live public site exists;
- project metadata;
- chapter progress navigation;
- reusable screenshot panels;
- proof cards;
- testimonial module;
- next-case module;
- reduced-motion alternative;
- EN/RU metadata component.

### Project-specific worlds

- Financial Stream: midnight navy, ice blue, white, restrained financial green.
- Alina Horb: ivory, stone, sage, muted terracotta.
- Local Repair Pro: deep forest, warm stone, amber, off-white.
- ProAI Expert: graphite, cyan, metallic neutrals.

---

## 8. Content ownership and anti-duplication rules

### Canonical content ownership

| Content | Canonical location | Other placements |
|---|---|---|
| Full project story | Individual case page | Short teaser only |
| Full owner testimonial | Individual case page | Homepage may reuse a shorter approved version |
| Financial Stream live-site proof | Individual case | Homepage and Websites page may show visual teaser |
| GSC/SEO evidence | Financial Stream case | No raw metric dashboard on homepage/service pages |
| Intake architecture | Financial Stream case | One sentence on homepage or Websites page maximum |
| Gmail/Make workflow | Financial Stream automation chapter | Small AI Systems teaser after evidence is sanitized |
| Portfolio browsing | Case Studies archive | Homepage links to archive |
| Studio methodology | Service/About pages | Cases show only project-specific application |

### Duplicate-content prevention

- do not paste the same 150–250 word case summary across homepage, archive, service page, and case page;
- each placement has a distinct commercial role;
- homepage: credibility and curiosity;
- service page: capability proof;
- archive: comparison and discovery;
- individual case: complete evidence-backed narrative.

---

## 9. Homepage integration decision

The existing Financial Stream section should be **retained and strengthened**, not removed.

### Keep

- interactive desktop/mobile composition;
- owner feedback;
- premium visual treatment;
- current placement as the strongest proof module.

### Improve later

- label as `Featured Client Case`;
- add `View Case Study` CTA;
- retain `View Live Site` as secondary;
- add one concise proof line such as `Bilingual website · structured intake · AI-assisted support`;
- add a `View All Case Studies` route after the section or near the homepage CTA;
- align EN/RU testimonial/name formatting;
- keep animation performance-safe.

### Do not

- replace the homepage section with a generic three-card grid;
- insert all three cases into the already dense homepage before the archive is stable;
- duplicate GSC screenshots or automation diagrams on the homepage.

---

## 10. Service-page integration decisions

### Websites & Branding

- keep the current Financial Stream + ProAI visual showcase;
- add a clear link to the Financial Stream case;
- add a discreet `View all cases` link;
- do not duplicate the full case story;
- preserve service-page focus.

### AI Systems

- no large Financial Stream duplicate;
- later add one compact operational proof module only if sanitized automation evidence is ready;
- link to the Financial Stream automation chapter or case page;
- do not imply full business automation.

### About

- add only a small Selected Work link or project-count proof if it improves navigation;
- no duplicate case cards unless the page needs a proof strip.

### Insights

- cases may be referenced contextually from relevant articles;
- no site-wide automatic insertion until the archive is stable.

---

## 11. Navigation and footer plan

### After source/live parity is resolved

Add `Case Studies` / `Кейсы` consistently to:

- homepage header;
- AI Systems header;
- Websites & Branding header;
- About header;
- Insights header;
- Contact header;
- EN/RU footer service/explore navigation.

### Guardrails

- do not add navigation before `/case-studies/` is source-controlled and preview-tested;
- mobile menu must be tested at 320, 360, 390, 430, 768, and landscape heights;
- no wrapping or overflow in the desktop header;
- active-state logic must work on archive and individual cases.

---

## 12. SEO and metadata plan

At launch, add to the sitemap:

- both archive URLs;
- all published EN/RU case URLs;
- accurate `lastmod` values.

Each case needs:

- unique title and meta description;
- canonical;
- EN/RU/x-default hreflang;
- OG and Twitter image;
- meaningful alt text;
- `WebPage` or appropriate `CreativeWork`/`Article`-style schema only if implemented accurately;
- breadcrumbs where useful;
- noindex only for temporary preview pages, never for launched cases.

Do not publish:

- unsupported performance outcomes;
- fake conversion uplift;
- fake client metrics;
- undated SEO claims;
- testimonial text without permission/source.

---

## 13. Source recovery and deployment investigation — P0

Before any visual implementation:

1. record current `main` HEAD;
2. create a protected backup branch/tag, for example:
   - `backup/pre-portfolio-v2-2026-07`;
3. inspect repository Pages settings and deployment source manually;
4. inspect Actions/Pages deployment history if present;
5. identify what currently serves the custom domain;
6. capture raw live HTML and asset paths for all existing case URLs;
7. compare live content against historical commits immediately before the deletion commit;
8. identify the latest complete, valid source version;
9. restore source files into a dedicated implementation branch only;
10. verify no unrelated current homepage/service work is reverted.

### Historical evidence

- `5fa342a64b464493a0935047c7c84d6c3884c4f0` — deleted the case-studies directory;
- earlier commits contain progressively refined Financial Stream, ProAI Expert, EN/RU archive, screenshots, and case styles;
- restoration must be selective, not a full repository rollback.

---

## 14. Safe implementation workflow

### Branch model

Do not work directly on `main`.

Recommended branches:

```text
portfolio-v2-foundation
portfolio-v2-financial-stream
portfolio-v2-alina
portfolio-v2-local-repair
portfolio-v2-integration
```

A simpler single branch is acceptable only if commits remain atomic and reviewable.

### Preview model

- run locally with a static server;
- use Codex/browser preview for desktop and mobile;
- produce screenshots or a screen recording for approval;
- do not publish incomplete case routes on the custom domain;
- preview pages must not be indexable.

### Commit model

Separate commits for:

1. source recovery;
2. shared portfolio styles/components;
3. archive prototype;
4. Financial Stream case;
5. Alina case;
6. Local Repair case;
7. navigation/footer integration;
8. sitemap/metadata;
9. QA fixes.

This makes rollback possible without reverting unrelated site work.

---

## 15. Production phases

### Phase 0 — Source and deployment parity

Deliverables:

- deployment-source report;
- restored source tree in an implementation branch;
- route inventory;
- asset inventory;
- no live changes.

Gate:

- repository source and current live pages can be explained and reproduced locally.

### Phase 1 — Portfolio experience prototype

Build only:

- archive hero;
- three primary project stages;
- secondary ProAI studio case treatment;
- Financial Stream hero;
- chapter navigation;
- one system-map interaction;
- one visual walkthrough interaction;
- testimonial;
- next-case transition.

Gate:

- desktop/mobile motion and layout approved before full case production.

### Phase 2 — Independent design/architecture review

Use `PORTFOLIO_PREIMPLEMENTATION_REVIEW_TASK.md`.

Gate:

- risks and corrections resolved in the blueprint/prototype.

### Phase 3 — Financial Stream flagship case

Use:

- `financial-stream/CASE_V2_MASTER_BRIEF.md`;
- `financial-stream/CASE_V2_BUILD_TASK.md`;
- current live captures and sanitized evidence.

Gate:

- EN/RU complete;
- Payroll correctly represented;
- testimonial approved;
- evidence wording accurate;
- mobile QA passed.

### Phase 4 — Archive V2

- connect Financial Stream;
- add Alina and Local Repair states;
- preserve ProAI Expert studio case;
- verify all routes and transitions.

### Phase 5 — Alina case

- confirm publication permissions;
- create EN/RU strategy deliberately; do not manufacture an English client site if the actual project is UA/RU only;
- case page language may describe the project in EN/RU while clearly stating the client-site languages.

### Phase 6 — Local Repair Pro case

- clean demo/internal wording first;
- preserve concept classification;
- disable misleading form behavior;
- create final screenshots;
- publish as concept/showcase.

### Phase 7 — Site integration

- homepage Featured Client Case CTA;
- Websites & Branding case links;
- optional AI Systems proof teaser;
- global navigation/footer normalization;
- archive links.

### Phase 8 — SEO, accessibility, performance, and regression QA

- sitemap;
- canonical/hreflang;
- metadata;
- OG images;
- keyboard navigation;
- reduced motion;
- responsive widths;
- image sizes;
- broken-link crawl;
- language-pair crawl;
- no-regression checks.

### Phase 9 — Controlled launch

- final approved branch merged;
- deployment verified;
- live smoke test;
- rollback point retained;
- Search Console sitemap resubmission only after live validation.

---

## 16. No-regression checklist

Before merge, confirm:

- homepage interactive hero still works;
- homepage Financial Stream section still works;
- homepage testimonial remains correct;
- Websites & Branding showcase still works;
- AI Systems interactions still work;
- mobile menus close and reopen correctly;
- EN/RU language switches map correctly;
- contact anchors still work;
- Insights routes remain unchanged;
- no CSS namespace collisions;
- no global `.section`, `.card`, `.reveal`, or device-frame rule breaks existing pages;
- no horizontal overflow from 320px upward;
- `prefers-reduced-motion` is supported;
- all new assets exist and are optimized;
- existing Financial Stream and ProAI case URLs remain valid;
- no temporary preview URL is indexed;
- sitemap contains only live canonical routes;
- 404 behavior remains correct for genuinely missing pages.

---

## 17. Rollback plan

Before public merge:

1. preserve the pre-portfolio source state in a backup branch/tag;
2. record the last known-good deployment SHA;
3. keep portfolio changes in atomic commits;
4. if launch fails, revert only the integration/portfolio commits;
5. do not force-reset unrelated homepage, insights, or service-page work;
6. validate rollback on the custom domain and language routes.

---

## 18. Definition of Ready

Implementation may begin only when:

- [ ] the source of the current live Case Studies pages is identified;
- [ ] live/source parity is documented;
- [ ] a backup branch/tag exists;
- [ ] the latest valid case source is restored in a non-main branch;
- [ ] the archive and case route map is approved;
- [ ] Financial Stream, Alina, Local Repair, and ProAI classifications are locked;
- [ ] the interaction prototype scope is approved;
- [ ] existing Financial Stream placements are inventoried;
- [ ] the independent review task is ready;
- [ ] no public code has been changed prematurely.

---

## 19. Definition of Done

The portfolio rollout is complete when:

- [ ] one scalable EN/RU archive exists;
- [ ] Financial Stream, Alina, and Local Repair have dedicated pages;
- [ ] the existing ProAI Expert case remains valid;
- [ ] homepage and service-page proof modules point to the canonical cases;
- [ ] navigation and footer are consistent;
- [ ] sitemap and metadata are complete;
- [ ] all case classifications and claims are accurate;
- [ ] desktop/mobile/reduced-motion QA passes;
- [ ] no existing page, route, integration, or language pair regresses;
- [ ] a rollback point remains available after launch.

---

## 20. Immediate next action

Do not modify the public site yet.

The next action is **Phase 0: source/deployment parity investigation and selective recovery of the existing Case Studies source into a dedicated implementation branch**.

Only after Phase 0 is complete should the interactive archive + Financial Stream opening prototype be built.