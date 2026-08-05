# Homepage V2 Implementation Plan — Independent Review Task

**Status:** ready for independent review  
**Repository:** `proaiexpert/proaiexpert.github.io`  
**Branch:** `agent/homepage-v2-implementation-plan`  
**Required output:** `docs/site-evolution/homepage-v2-implementation-plan/03_HOMEPAGE_V2_IMPLEMENTATION_PLAN_REVIEW_REPORT.md`

---

# 1. Role

Act as **Control / Independent Technical Reviewer**.

Review the Homepage V2 implementation plan. Do not implement the Homepage, rewrite the accepted concept, or broaden the file scope.

This is a planning review, not a production review.

---

# 2. Required read order

Read in this order:

1. `AI_START_HERE.md`;
2. `AGENTS.md`;
3. `AI_CURRENT_HANDOFF.md`;
4. `README.md`;
5. `docs/site-evolution/homepage-v2-content-review/04_CONTENT_ARCHITECTURE_FINAL_REVIEW_REPORT.md`;
6. `docs/site-evolution/homepage-v2-low-fidelity/05_LOW_FIDELITY_FINAL_REVIEW_REPORT.md`;
7. `docs/site-evolution/homepage-v2-visual-concepts/03_VISUAL_CONCEPT_REVIEW_REPORT.md`;
8. `docs/site-evolution/homepage-v2-concept-a-spec/01_CONCEPT_A_SELECTED_SPECIFICATION.md`;
9. `docs/site-evolution/homepage-v2-concept-a-spec/05_CONCEPT_A_SPEC_FINAL_REVIEW_REPORT.md`;
10. `docs/site-evolution/homepage-v2-implementation-plan/00_READ_ME.md`;
11. `docs/site-evolution/homepage-v2-implementation-plan/01_HOMEPAGE_V2_IMPLEMENTATION_PLAN.md`.

Then inspect actual current branch and repository metadata.

---

# 3. Current-main verification

Confirm whether the plan accurately analyzed current `main` at:

```text
7bcc09ae28388f8e4a5e6e5a715aa5ba7b3fbf50
```

Inspect at minimum:

```text
index.html
ru/index.html
_includes/homepage-current-en.html
_includes/homepage-current-ru.html

_includes/header-system/header.html
_data/header.yml
_data/navigation.yml
assets/js/header-system-v1.js

_includes/footer-commercial-v1.html

contact/index.html
ru/contact/index.html

assets/css/homepage-materials-editorial-v2.css
assets/css/homepage-core-hardening-v1.css
assets/css/homepage-commercial-refinement-v1.css
assets/js/homepage-core-hardening-v1.js
```

Determine whether the plan correctly describes:

- the full-document snapshot includes;
- Liquid `capture`, `replace`, `replace_first`, and marker-string `split` ownership;
- shared Header/Footer replacement;
- external Homepage CSS layers;
- old inline CSS/JavaScript and motion;
- current Contact allowlist;
- current rollback sources.

---

# 4. Architecture review questions

## 4.1 Replacement architecture

Determine whether it is safe and sufficient to use:

```text
index.html
ru/index.html
_includes/homepage-v2-en.html
_includes/homepage-v2-ru.html
assets/css/homepage-v2.css
```

Check that:

- wrappers explicitly own document shell and metadata;
- body includes own only localized `<main>` content;
- string-transforming snapshot construction is removed;
- old snapshots remain unchanged for rollback;
- no new layout/framework/dependency is required;
- the approach remains compatible with the repository's static/Jekyll behavior.

## 4.2 File-scope sufficiency

Determine whether the exact five-file initial Builder scope is:

- sufficient;
- minimal;
- reversible;
- isolated from Header, Footer, Contact, case studies, service pages, Insights, data, workflows, and deployment.

If another file is genuinely required, return `TARGETED CORRECTION` and identify the exact dependency. Do not broaden scope speculatively.

## 4.3 JavaScript boundary

Determine whether the initial Homepage can safely ship without page-specific JavaScript.

Check that:

- all content is available statically;
- the shared Header retains its own JavaScript;
- no reveal gating is required;
- no CTA depends on script-generated state;
- no accepted visual requirement needs animation;
- the future implementation does not accidentally carry legacy pointer, scroll, or draggable behavior.

---

# 5. Contact-contract review

Verify the actual current EN/RU Contact allowlists and sanitization behavior.

Review the plan's mappings for:

- Hero Private Review;
- Website & trust;
- Inquiry handling;
- Connected system;
- Final Private Review.

Confirm that the plan uses only accepted values for:

```text
intent
selected_direction
source_page
source_cta
source_context
```

Confirm that EN routes use `/contact/` and RU routes use `/ru/contact/`.

The review must not change the Contact contract.

---

# 6. Metadata, Header, and Footer review

Confirm that the plan protects:

- route `/`;
- route `/ru/`;
- localized `<html lang>`;
- canonical URLs;
- reciprocal hreflang;
- x-default;
- favicon set;
- current social-preview URLs during the initial pass;
- shared Header include/data/JS;
- shared commercial Footer include;
- no local competing Header or Footer;
- no sitemap edit when routes remain unchanged.

Check whether the Footer include's stylesheet ownership is compatible with the proposed wrappers without modifying Footer files.

---

# 7. Section and visual-system review

Confirm that the plan preserves:

1. exact ten-block order;
2. accepted Concept A section-surface ownership;
3. Financial Stream as strongest proof;
4. Ways to Start `1 / 1 / 2` service-link counts;
5. Controlled Delivery five stages;
6. founder section subordination;
7. Selected Work status/disclosure/action separation;
8. Insights subordination;
9. bounded final Private Review;
10. `Signal, not spectacle`.

Check that the proposed section IDs and legacy anchor aliases do not create duplicate IDs or extra blocks.

---

# 8. Asset review

Verify that the exact existing assets named in the plan exist at current `main` and are appropriate as source assets:

```text
/assets/img/cases/financial-stream/fs-home-desktop-en-1600w.webp
/assets/img/cases/financial-stream/fs-home-mobile-en-640w.webp
/assets/img/cases/financial-stream/fs-home-desktop-ru-1600w.webp
/assets/img/cases/financial-stream/fs-home-mobile-ru-640w.webp

/ru/about/ProAI_Founder_Portrait_2x3.webp

/assets/img/cases/alina-horb/final-assets-v1/delivery/alina-horb-home-ua-desktop.webp

/assets/img/cases/local-repair-pro/production-v1/lrp-01-homepage-hero-640.webp
/assets/img/cases/local-repair-pro/production-v1/lrp-01-homepage-hero-1120.webp
/assets/img/cases/local-repair-pro/production-v1/lrp-01-homepage-hero-1920.webp
```

Confirm that no new asset file is required for the initial Builder pass.

Do not create, edit, optimize, or replace images during this review.

---

# 9. EN/RU, proof, and accessibility review

Confirm that the plan adequately protects:

- full accepted RU Hero;
- natural EN/RU line differences;
- normal-flow text expansion;
- exact proof taxonomy;
- exact RU project statuses;
- visible disclosures;
- 12px mobile proof-status minimum;
- 14px mobile disclosure minimum;
- `3:1` interactive-boundary contrast;
- visible focus;
- forced colors;
- reduced motion;
- touch targets;
- 200% zoom/reflow;
- no horizontal overflow;
- 1440, 390, 320, and approximately 844 × 390 protection.

---

# 10. Build, QA, and rollback review

Determine whether the plan gives a realistic and sufficient future verification path for:

- Jekyll/GitHub Pages-compatible build;
- generated EN/RU output;
- canonical/hreflang/x-default;
- links and Contact query strings;
- required viewport matrix;
- keyboard/focus;
- reduced motion and forced colors;
- console and missing assets;
- independent review;
- optional Codex/browser escalation;
- rollback to exact current wrappers and snapshots.

Confirm that the future production branch starts from the then-current `main`, not from the docs-only planning branch.

---

# 11. Allowed verdicts

Use exactly one:

- `ACCEPT`;
- `TARGETED CORRECTION`;
- `REJECT`.

`ACCEPT` means the plan may be used for a separate owner-authorized production Builder task. It does not authorize code, PR creation, merge, or deployment.

`TARGETED CORRECTION` must identify:

- exact defect;
- exact planning section;
- exact permitted file scope;
- what must remain unchanged.

`REJECT` requires a material conflict with current production architecture, accepted Concept A, proof safety, localization, or rollback feasibility.

---

# 12. Write boundary

Create and fill only:

```text
docs/site-evolution/homepage-v2-implementation-plan/03_HOMEPAGE_V2_IMPLEMENTATION_PLAN_REVIEW_REPORT.md
```

Do not change:

- the implementation plan;
- README;
- this review task;
- accepted Strategy, Content Architecture, low-fidelity maps, visual concepts, or selected specification;
- Homepage wrappers or snapshots;
- Header, Footer, or Contact;
- CSS or JavaScript;
- images or assets;
- routes, metadata, sitemap, workflows, or production files.

Do not create a production branch or production PR.

---

# 13. Report requirements

The report must include:

1. reviewed branch head;
2. implementation-plan blob SHA;
3. current-main SHA verified;
4. verdict;
5. current architecture findings;
6. five-file scope findings;
7. JavaScript-boundary findings;
8. Contact-contract findings;
9. Header/Footer/metadata findings;
10. section and visual-system findings;
11. asset findings;
12. EN/RU, proof, accessibility, and responsive findings;
13. build/QA/rollback findings;
14. remaining defects, if any;
15. exact next authorized step;
16. changed-file confirmation.

After saving the report, provide the new commit SHA and stop.
