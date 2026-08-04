# ProAI Expert Footer System Specification

Status: Canonical architecture specification

Repository: `proaiexpert/proaiexpert.github.io`

Initial baseline: `44683132c13d0a6300b0a1833209e46a3cd5459f`

## 1. Purpose

This document defines the canonical footer architecture for the ProAI Expert website. Its purpose is to eliminate duplicated markup, conflicting global selectors, inconsistent social links, accidental language leakage, and page-specific CSS patches.

The footer system must provide:

- consistent professional presentation across EN and RU;
- predictable behavior on desktop, laptop, tablet, phone portrait, and phone landscape;
- component-scoped CSS without semantic-element layout overrides;
- reusable build-time components for commercial, editorial, portfolio, and utility pages;
- explicit rules for future pages, articles, case studies, and generators;
- safe staged migration from current legacy implementations.

## 2. Scope

Included:

- Homepage EN/RU;
- About EN/RU;
- Contact EN/RU;
- AI Systems EN/RU;
- Websites & Branding EN/RU;
- Case Studies archive EN/RU;
- individual case studies EN/RU;
- Insights hub EN/RU;
- all current and future articles EN/RU;
- `404.html`;
- future Privacy, Terms, Thank-you, and system pages after their routes exist.

Excluded from footer migration unless explicitly required by a scoped PR:

- Header;
- Hero sections;
- Workflow Environment;
- page content blocks;
- SEO metadata;
- portfolio content cards;
- unrelated navigation systems.

## 3. Canonical footer families

### 3.1 Commercial Footer

Routes:

- `/` and `/ru/`;
- `/about/` and `/ru/about/`;
- `/contact/` and `/ru/contact/`;
- `/ai-systems/` and `/ru/ai-systems/`;
- `/websites-branding/` and `/ru/websites-branding/`.

Approved variants:

- `commercial--homepage`;
- `commercial--service`;
- `commercial--about`;
- `commercial--contact`.

Required characteristics:

- contextual closing CTA;
- contact details appropriate to language;
- relevant service navigation;
- dedicated brand zone;
- shared professional-profile navigation;
- language switch where a mapped equivalent route exists;
- shared bottom system row.

### 3.2 Editorial Footer

Routes:

- `/insights/` and `/ru/insights/`;
- all EN/RU articles;
- future editorial resources.

Approved variants:

- `editorial--hub`;
- `editorial--article`.

Required characteristics:

- contextual CTA related to the article or editorial hub;
- route back to Insights;
- relevant service links;
- compact or absent watermark;
- lower commercial pressure than Commercial Footer;
- shared professional-profile and language systems.

Every new article must receive the Editorial Footer automatically through its canonical template or generator. Permanent copy-pasted footer markup inside generated articles is prohibited.

### 3.3 Portfolio Footer

Routes:

- `/case-studies/` and `/ru/case-studies/`;
- all individual case-study routes.

Approved variants:

- `portfolio--archive`;
- `portfolio--case`.

Required characteristics:

- compact case closing;
- return link to Case Studies;
- optional next-case or relevant-service link;
- contained or absent watermark;
- no hidden Commercial Footer markup;
- no CSS pseudo-element used as the sole watermark content source.

### 3.4 Utility Footer

Routes:

- `404.html`;
- future Privacy, Terms, Thank-you, status, and system pages.

Required characteristics:

- logo/home link;
- copyright;
- existing legal links only;
- GitHub and essential professional profiles;
- language switch only where an equivalent route exists;
- no heavy CTA;
- no large watermark.

Privacy, Terms, or Thank-you links must not be rendered until valid routes exist.

## 4. Page-to-footer mapping

| Route family | EN/RU | Target family | Target variant |
|---|---:|---|---|
| Homepage | Both | Commercial | Homepage |
| About | Both | Commercial | About |
| Contact | Both | Commercial | Contact |
| AI Systems | Both | Commercial | Service |
| Websites & Branding | Both | Commercial | Service |
| Insights hub | Both | Editorial | Hub |
| Articles | Both | Editorial | Article |
| Case Studies archive | Both | Portfolio | Archive |
| Individual case studies | Both | Portfolio | Case |
| 404 | Current utility route | Utility | Minimal |
| Privacy / Terms / Thank-you | Future | Utility | Minimal/contextual |

## 5. Shared source architecture

Preferred build-time structure:

```text
_includes/footer-system/
  footer.html
  footer-commercial.html
  footer-editorial.html
  footer-portfolio.html
  footer-utility.html
  footer-brand-zone.html
  footer-bottom.html
_data/
  footer.yml
  social-links.yml
assets/css/
  footer-system-v1.css
```

Rules:

- use build-time includes or canonical generator templates;
- do not inject footer markup at runtime with JavaScript;
- direct static pages must eventually be migrated to a build-time source or their canonical generator/template;
- manually duplicated footer markup is transitional only and must not become a permanent source of truth;
- a generator must be updated before or together with generated output, so regeneration cannot restore a legacy footer.

## 6. Component contract

Canonical class namespace:

```text
.site-footer
.site-footer__shell
.site-footer__main
.site-footer__cta
.site-footer__details
.site-footer__contact
.site-footer__services
.site-footer__brand-zone
.site-footer__watermark
.site-footer__bottom
.site-footer__logo
.site-footer__socials
.site-footer__locale
.site-footer__legal
.site-footer__copyright
```

Approved modifiers:

```text
.site-footer--commercial
.site-footer--editorial
.site-footer--portfolio
.site-footer--utility
.site-footer--homepage
.site-footer--service
.site-footer--about
.site-footer--contact
.site-footer--hub
.site-footer--article
.site-footer--archive
.site-footer--case
```

Prohibited generic layout selectors:

```css
section { display: flex; }
footer { ...layout rules... }
nav { ...layout rules... }
```

Semantic elements may receive typography or reset rules only when the effect is safe and intentional. Layout must be attached to component classes.

## 7. Global CSS correction rule

The current site contains legacy global and mobile rules that can override component layouts. Before broad footer migration:

1. identify every global selector affecting `section`, `footer`, `.f-*`, footer body variants, and mobile alignment;
2. create a usage map of affected routes/components;
3. replace broad semantic selectors with the specific classes that actually require the behavior;
4. preserve visual behavior outside the footer through targeted component rules;
5. validate all major page families before removing legacy selectors;
6. do not compensate for a known global defect by adding repeated `!important` layers to individual footer files.

Temporary compatibility resets may exist only during a staged migration and must be documented with a removal condition.

## 8. Social and localization matrix

Canonical URLs:

```text
LinkedIn: https://www.linkedin.com/in/ihorhorb/
GitHub:   https://github.com/proaiexpert
X:        https://x.com/proaiexpert
Telegram: https://t.me/proAiexpert
```

Matrix:

| Channel | EN | RU |
|---|---:|---:|
| LinkedIn | Yes | Yes |
| GitHub | Yes | Yes |
| X | Yes | Yes |
| Telegram | No | Yes |
| Facebook | No | No |

Rules:

- EN footers must not show the RU Telegram channel;
- RU footers may show Telegram;
- `https://t.me/proai_expert` is treated as stale unless ownership is separately verified;
- social links must be stored centrally rather than copied through page files;
- external links require `target="_blank"` and `rel="noopener noreferrer"` where opening a new tab is intended;
- profile navigation must use an accessible `nav` label;
- platform names may remain untranslated, while accessible labels may be localized.

## 9. Language mapping

EN and RU versions must share:

- DOM structure;
- component class names;
- element order;
- breakpoint logic;
- accessibility behavior;
- social destinations except Telegram visibility;
- visual hierarchy.

They may differ in:

- CTA copy;
- line wrapping;
- contextual links;
- Telegram visibility;
- locale destination;
- limited typography constraints required by longer RU copy.

Language links must point to the mapped equivalent route when one exists, not automatically to the language homepage.

## 10. CTA rules

### Commercial

- clear project or consultation action;
- no unsupported claims;
- contact-page variant should be compact to avoid duplicating page-level CTAs;
- one primary action only.

### Editorial

- CTA must relate to the article topic or next rational action;
- include return to Insights;
- avoid a generic heavy commercial close after every article.

### Portfolio

- return to archive and/or relevant service;
- optional next case;
- no hidden unused CTA markup.

### Utility

- no commercial CTA by default.

## 11. Watermark specification

Watermark is decorative and must:

- be inside `.site-footer__brand-zone`;
- appear after main footer content and before the bottom row;
- use `aria-hidden="true"`;
- have `pointer-events: none` and `user-select: none`;
- remain static;
- never overlap readable text or interactive controls;
- use clipping only inside its own brand zone;
- be hidden in forced-colors mode when appropriate.

Prohibited:

- absolute positioning relative to the entire footer;
- tuning `top` offsets to resolve content collisions;
- negative margins that pull the watermark into CTA/contact content;
- duplicate watermark content from both markup and pseudo-elements;
- relying on global `overflow-x: clip` to conceal a sizing defect.

Mobile portrait must either contain the complete watermark or apply intentionally symmetric clipping. Mobile landscape must use a shorter brand zone and shall not inherit desktop spacing blindly.

## 12. Responsive behavior

Required validation viewports:

| Category | Dimensions |
|---|---|
| Wide desktop | 1920×1080, 1600×900 |
| Laptop | 1440×900, 1366×768 |
| Tablet | 1024×768, 768×1024 |
| Phone portrait | 430×932, 390×844 |
| Phone landscape | 932×430, 844×390 |

Requirements:

- no horizontal scrolling;
- all content remains within the shell;
- CTA hierarchy remains vertical and intentional;
- contact and service groups share a clear grid;
- RU strings do not overflow;
- social links wrap as complete labels;
- minimum touch targets are 44 px where practical;
- safe-area insets are respected;
- footer height remains reasonable in phone landscape;
- absence of a visible scrollbar is not sufficient: `scrollWidth` must not exceed `clientWidth`.

## 13. Motion

Footer motion is optional, not structural.

Approved:

- restrained, infrequent title glow/pulse;
- hover/focus transitions that do not cause layout movement.

Prohibited:

- continuous watermark movement;
- parallax;
- scale animation that shifts layout;
- repeated flashing;
- animation required to understand content.

All animation must be disabled under `prefers-reduced-motion: reduce`.

## 14. Accessibility

Required:

- semantic `<footer>` landmark;
- labelled social navigation;
- labelled language navigation;
- logical keyboard order;
- clearly visible `:focus-visible` state;
- decorative watermark ignored by assistive technology;
- accessible external-link labels where the visible label is insufficient;
- usable layout at 200% browser zoom;
- forced-colors compatibility;
- no inaccessible dead links.

## 15. Legal links

Legal links must be rendered from centralized data and only when their routes exist.

Current rule:

- do not add Privacy, Terms, or Thank-you links until valid public routes and language mappings are implemented.

Placeholder or dead legal links are prohibited.

## 16. Rules for future content

### New commercial page

Must declare or select:

```text
footer_family: commercial
footer_variant: service | about | contact | homepage
```

### New article

Must automatically receive:

```text
footer_family: editorial
footer_variant: article
```

The article template/generator must supply:

- contextual CTA;
- return to Insights;
- related services when relevant;
- language-specific social matrix;
- shared footer bottom.

### New case study

Must receive:

```text
footer_family: portfolio
footer_variant: case
```

### New utility page

Must receive:

```text
footer_family: utility
```

A page must not introduce a fifth family without an architecture review and an update to this specification.

## 17. Migration sequence

1. Publish this canonical specification.
2. Audit and correct global semantic/mobile selectors.
3. Stabilize Homepage Commercial Footer EN/RU.
4. Migrate About EN/RU.
5. Migrate AI Systems EN/RU.
6. Migrate Websites & Branding EN/RU.
7. Migrate Contact EN/RU.
8. Build Editorial Footer for Insights hub and current premium article templates.
9. Update article generators/templates.
10. Migrate legacy articles.
11. Replace Portfolio override architecture with a true Portfolio Footer.
12. Add Utility Footer to 404.
13. Add future utility routes only after content/routes exist.
14. Remove obsolete `.f-*`, body-variant, and global footer rules after all consumers are migrated.

Each implementation package must use a separate branch and focused PR. A mass migration PR is prohibited unless it is generated from a verified canonical source and has complete route-level regression coverage.

## 18. Acceptance criteria for each migration PR

Architecture:

- only intended family/routes change;
- component classes are scoped;
- no new generic semantic layout selector;
- no runtime JS injection;
- no unsupported social or legal URLs;
- generator/template updated when generated pages are involved.

Visual:

- no overlap;
- no horizontal overflow;
- no asymmetric accidental clipping;
- coherent hierarchy on desktop, portrait, and landscape;
- no duplicate footer or watermark.

Localization:

- EN contains no Telegram footer link;
- RU uses only `https://t.me/proAiexpert`;
- GitHub, LinkedIn, and X destinations are identical across languages;
- locale route is mapped correctly.

Accessibility:

- keyboard reachable links;
- visible focus;
- labelled nav elements;
- decorative content hidden appropriately;
- reduced-motion behavior verified.

Technical:

- build completes;
- generated output contains exactly one footer;
- no console errors attributable to the change;
- cache key changes whenever a cached shared asset changes;
- no unrelated page-section or SEO diff.

## 19. Regression checklist

For every footer-system PR:

- verify current `main` before creating the branch;
- verify open PRs and branch scope;
- inspect changed filenames and complete diff;
- build or inspect generated HTML;
- test EN and RU;
- test desktop, laptop, phone portrait, and phone landscape;
- verify all social, service, CTA, and locale links;
- verify keyboard focus and reduced motion;
- inspect horizontal overflow numerically;
- compare page content above the footer for unintended changes;
- use a new cache key when CSS/JS changes;
- document rollback as a single PR revert.

## 20. Prohibited patterns

- generic `section { display: flex; }` or equivalent layout rule;
- generic footer layout overrides shared unintentionally by unrelated families;
- new permanent `.f-*` legacy classes;
- repeated `!important` patches used instead of fixing the source selector;
- absolute watermark positioned against the whole footer;
- CSS hiding of markup that belongs to another footer family;
- duplicate social URLs across page files;
- Telegram on EN pages;
- personal Facebook in the professional footer;
- dead Privacy/Terms links;
- unsupported GitHub metrics, stars, users, community, or adoption claims;
- manual article footer copies that can diverge from the generator;
- claiming a visual fix is complete before cache delivery and real viewport behavior are verified.

## 21. Governance

This document is the canonical source for footer architecture. Implementation code and future handoffs must conform to it.

Changes to footer families, social policy, shared component contracts, or migration order require:

1. a documented reason;
2. an update to this specification;
3. a focused PR;
4. regression review against affected page families.

Historical reports may provide context but must not override current code or this canonical specification.