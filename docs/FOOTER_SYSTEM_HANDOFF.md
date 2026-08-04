# Footer System — Canonical Handoff

Status: ready for implementation in a fresh working chat.

Repository: `proaiexpert/proaiexpert.github.io`

Baseline main verified before this document: `5ae15bbecfca6c66addbd7d3d2cdaf8641460cfc`

Open pull requests at handoff preparation: none.

## 1. Objective

Complete and lock one coherent Footer System across the entire ProAI Expert website without changing the approved Header System or unrelated page content.

The work is not a visual patch. It is a controlled migration from copied and overridden footer implementations to four explicit footer families with shared design, accessibility, localization and maintenance rules.

Completion means:

- every public route is mapped to an approved footer family;
- new pages cannot introduce an arbitrary footer;
- EN/RU social and language behavior is consistent;
- watermark placement is structural and collision-free;
- footer layout is stable on laptop, phone portrait and phone landscape;
- legacy footer overrides are removed only after their page family is migrated;
- Header System files and behavior remain unchanged.

## 2. Frozen boundary: Header System

The Header System was closed at main commit:

`5ae15bbecfca6c66addbd7d3d2cdaf8641460cfc`

Footer work must not change:

- `_includes/header-system/`;
- `_data/navigation.yml`;
- `_data/header.yml`;
- `assets/css/header-system-v1.css`;
- `assets/js/header-system-v1.js`;
- `assets/css/global-header-parity-v2.css`;
- header markup, menu behavior, logo cube, language control or CTA geometry;
- `mobile-behavior-v123.js` except in a separately approved future cleanup after footer migration.

If a footer implementation appears to require a header change, stop and treat that as a footer architecture error.

## 3. Current verified footer state

### 3.1 Homepage EN/RU — approved benchmark

The new Commercial Footer is currently implemented only on:

- `/`;
- `/ru/`.

Canonical homepage component:

- `_includes/footer-commercial-v1.html`;
- `assets/css/footer-commercial-v1.css`;
- `assets/css/footer-commercial-v1-polish.css`.

Current approved characteristics:

- separate CTA/content zone;
- dedicated watermark brand zone between main content and bottom row;
- watermark does not sit behind readable copy;
- mobile portrait watermark is fully visible and centered;
- phone landscape has a deliberate compact layout;
- homepage CTA title uses a restrained periodic light pulse;
- `prefers-reduced-motion` disables that pulse;
- GitHub appears on EN and RU;
- Telegram appears only on RU;
- footer language switch exists;
- no dead Privacy or Terms links;
- current GitHub destination: `https://github.com/proaiexpert`;
- current Telegram destination: `https://t.me/proAiexpert`.

The homepage footer is the visual-quality benchmark. Do not redesign it casually. Refactor only when necessary to create the shared system, and preserve the approved appearance and behavior.

### 3.2 Remaining site

Most other routes still use copied legacy footer markup and page-local or shared overrides.

Known implementation patterns include:

- full footer HTML copied into standalone pages;
- footer markup embedded inside Jekyll includes;
- article footer markup embedded inside article outputs or include chains;
- Portfolio footer created by hiding/rearranging Commercial markup through CSS;
- premium article CSS hiding legacy watermark markup instead of replacing it;
- global mobile CSS affecting legacy footer classes;
- pages with no footer, including the current `404.html`.

Do not claim that the site-wide footer migration is already complete.

## 4. Required footer families

There are four families, not three.

### A. Commercial Footer

Routes:

- Homepage EN/RU;
- About EN/RU;
- Contact EN/RU;
- AI Systems EN/RU;
- Websites & Branding EN/RU.

Approved variants:

- `commercial--homepage`;
- `commercial--service`;
- `commercial--about`;
- `commercial--contact`.

Rules:

- strong but contextual CTA;
- homepage may retain the approved title pulse;
- Contact should use a compact closing and must not repeat excessive contact CTAs;
- service pages may link to relevant capabilities and case studies;
- dedicated watermark brand zone;
- no Telegram on EN.

### B. Editorial Footer

Routes:

- Insights hub EN/RU;
- all article pages EN/RU;
- future editorial resources.

Rules:

- lower commercial pressure than the homepage;
- contextual CTA based on the article or Insights context;
- clear link back to Insights;
- relevant service links;
- compact or absent watermark depending on the approved editorial variant;
- no large generic Commercial CTA copied into every article;
- article generator/templates must be updated before or together with generated outputs.

### C. Portfolio Footer

Routes:

- Case Studies archive EN/RU;
- Financial Stream case EN/RU;
- Alina Horb case EN/RU;
- Local Repair Pro case EN/RU;
- future case studies.

Rules:

- compact project-closing structure;
- link back to Case Studies;
- relevant next project, service or contact path;
- no hidden Commercial CTA markup;
- no pseudo-element that duplicates an existing watermark element;
- case-specific GitHub links only where a public repository exists and disclosure is safe;
- do not claim stars, users, adoption or open-source community without evidence.

### D. Utility Footer

Routes:

- `404.html`;
- future Privacy pages;
- future Terms pages;
- future Thank-you pages;
- future system/status pages.

Rules:

- minimal brand identity;
- copyright;
- GitHub;
- mapped language route when one exists;
- existing legal links only;
- no large CTA;
- no large watermark.

Privacy, Terms and Thank-you routes do not currently exist. Do not create dead links or pretend that those page families already exist.

## 5. Route-to-family map

| Route family | EN | RU | Target footer |
|---|---:|---:|---|
| Homepage | `/` | `/ru/` | Commercial — Homepage |
| About | `/about/` | `/ru/about/` | Commercial — About |
| Contact | `/contact/` | `/ru/contact/` | Commercial — Contact compact |
| AI Systems | `/ai-systems/` | `/ru/ai-systems/` | Commercial — Service |
| Websites & Branding | `/websites-branding/` | `/ru/websites-branding/` | Commercial — Service |
| Case Studies archive | `/case-studies/` | `/ru/case-studies/` | Portfolio — Archive |
| Individual cases | `/case-studies/.../` | `/ru/case-studies/.../` | Portfolio — Case |
| Insights hub | `/insights/` | `/ru/insights/` | Editorial — Hub |
| Articles | `/insights/.../` | `/ru/insights/.../` | Editorial — Article |
| 404 | `404.html` | bilingual navigation where appropriate | Utility — Minimal |
| Privacy / Terms / Thank-you | absent | absent | Do not render links until routes exist |

## 6. Social and localization contract

### EN

- LinkedIn: yes;
- GitHub: yes;
- X: yes;
- Telegram: no;
- Facebook: no.

### RU

- LinkedIn: yes;
- GitHub: yes;
- X: yes;
- Telegram: yes;
- Facebook: no.

Canonical destinations:

- LinkedIn: `https://www.linkedin.com/in/ihorhorb/`;
- GitHub: `https://github.com/proaiexpert`;
- X: `https://x.com/proaiexpert`;
- Telegram: `https://t.me/proAiexpert`.

The stale/conflicting Telegram form `https://t.me/proai_expert` must not be introduced.

Language links must point to the mapped equivalent page, not automatically to the language homepage, when an equivalent route exists.

External profile links require:

- `target="_blank"` where approved;
- `rel="noopener noreferrer"`;
- clear accessible labels;
- a labelled social `<nav>`.

## 7. Watermark contract

The watermark is decorative and must be inside a dedicated structural zone.

Required order:

1. footer main content;
2. footer brand/watermark zone;
3. footer bottom row.

Required behavior:

- `aria-hidden="true"`;
- no link;
- no pointer events;
- no animation;
- no absolute `top` positioning relative to the complete footer;
- no negative margin pulling it behind content;
- clipping is allowed only inside the brand zone;
- no collision with CTA, contacts, social links or copyright;
- it may be hidden in forced-colors mode;
- mobile portrait must show the complete approved wordmark treatment;
- phone landscape must stay compact.

The homepage title pulse is not a watermark animation and must not be generalized to all footer families without approval.

## 8. Recommended source architecture

Use build-time composition. Do not inject a footer with client-side JavaScript.

Recommended target:

```text
_includes/footer-system/
  footer.html
  commercial.html
  editorial.html
  portfolio.html
  utility.html
  brand-zone.html
  bottom.html
_data/
  footer.yml
  social-links.yml
assets/css/
  footer-system-v1.css
```

The existing homepage files may be migrated into this structure or used as the initial Commercial variant, but there must be one documented source of truth after migration.

New selectors must be scoped to the Footer System namespace, for example:

```text
.site-footer
.site-footer__shell
.site-footer__main
.site-footer__cta
.site-footer__details
.site-footer__brand-zone
.site-footer__watermark
.site-footer__bottom
.site-footer__socials
.site-footer__locale
```

Forbidden patterns:

- generic `footer { ... }` ownership;
- new `.f-*` legacy classes;
- JavaScript footer injection;
- permanent copied social URLs across dozens of files;
- CSS hiding of irrelevant Commercial markup;
- pseudo-elements duplicating real watermark content;
- new `!important` override layers except a documented temporary migration boundary;
- dead legal links;
- Telegram on EN;
- unsupported GitHub proof claims.

## 9. Migration sequence

Do not perform a blind site-wide rewrite in one PR.

### PR 1 — Commercial secondary pages

Migrate:

- About EN/RU;
- Contact EN/RU;
- AI Systems EN/RU;
- Websites & Branding EN/RU.

Preserve the approved homepage footer.

Acceptance gate:

- no footer/header collision;
- correct contextual CTA per page type;
- EN/RU social matrix exact;
- mapped language links;
- laptop, phone portrait and landscape verified;
- no unrelated page changes.

### PR 2 — Editorial hub and current templates

Migrate:

- Insights hub EN/RU;
- premium/current article templates;
- include chains used by current article generation.

Do not migrate all old generated articles until the source templates and generator are corrected.

### PR 3 — Editorial legacy outputs

Migrate existing static article outputs after generator/template ownership is correct.

Acceptance gate:

- future generation cannot restore the old footer;
- no old footer markup is reintroduced.

### PR 4 — Portfolio

Migrate:

- Case Studies archive EN/RU;
- all current individual cases EN/RU.

Remove the need for `portfolio-footer-compact-v1.css` only after every Portfolio route is migrated and verified.

### PR 5 — Utility

Add the minimal Utility Footer to `404.html`.

Do not add Privacy, Terms or Thank-you links until those routes are explicitly created and approved.

### PR 6 — Cleanup and lock

- repository search for legacy footer markup/classes;
- delete obsolete page-local/footer override rules only when unused;
- update documentation with final source ownership;
- full regression audit;
- mark Footer System closed.

## 10. Required QA

Test each migrated family on:

- 1920×1080;
- 1600×900;
- 1440×900;
- 1366×768;
- 1024×768;
- 768×1024;
- 430×932;
- 390×844;
- 932×430;
- 844×390.

Verify:

- no horizontal overflow;
- no watermark/content intersection;
- no duplicate footer;
- no missing links;
- no dead legal routes;
- logical keyboard order;
- visible focus;
- 44px mobile targets;
- 200% zoom usability;
- reduced-motion behavior;
- forced-colors behavior;
- EN/RU parity;
- no console errors;
- no Header System regression;
- no unrelated content, SEO or case-evidence changes.

## 11. Parallel-work protocol

Before every branch:

1. verify current `main` SHA;
2. verify open PRs;
3. declare exact file scope;
4. do not edit files owned by another active branch;
5. update the branch from current `main` before merge;
6. inspect the final diff for stale file restoration.

Footer work must not overwrite concurrent Financial Stream, case-image, article-content or other unrelated production changes.

## 12. First action for the fresh chat

The fresh chat must:

1. read this document and inspect the actual current `main`;
2. confirm that no newer PR changed Footer System files;
3. perform a read-only audit of the eight Commercial secondary pages against the approved homepage benchmark;
4. produce a precise file-level plan;
5. implement only PR 1 — Commercial secondary pages;
6. build or inspect generated output where Jekyll includes are involved;
7. merge only after the acceptance gate passes;
8. stop and report before starting Editorial migration.

## 13. Definition of done

Footer System is closed only when:

- four footer families are implemented on all mapped public routes;
- new pages use an explicit footer-family contract;
- approved homepage appearance remains intact;
- all social/localization rules are centralized;
- watermark behavior is structural;
- article generation cannot restore legacy footer markup;
- Portfolio no longer depends on CSS hiding Commercial content;
- Utility pages have the minimal approved footer;
- obsolete legacy footer rules are removed;
- final site-wide QA passes;
- the Header System remains unchanged.
