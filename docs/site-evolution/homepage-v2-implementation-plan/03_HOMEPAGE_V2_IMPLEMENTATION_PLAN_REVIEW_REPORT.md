# Homepage V2 Implementation Plan — Final Contact-Mapping Review Report

**Status:** focused correction review complete  
**Verdict:** `ACCEPT`  
**Repository:** `proaiexpert/proaiexpert.github.io`  
**Branch:** `agent/homepage-v2-implementation-plan`  
**Reviewed branch head:** `1e0f2ed2306b2da11b5497166c4242c7dd14a3fe`  
**Corrected implementation-plan blob:** `99c484c45bc9d75ac91c144511e2f059a021959e`  
**Initial review commit:** `c7a419e20e6f382ffb1fb0b0668f6e700036cef7`  
**Initial reviewed plan blob:** `b775dc2d7c24dfd4b6e22da15f3d9c513f9aecd8`  
**Production baseline inherited from initial review:** `7bcc09ae28388f8e4a5e6e5a715aa5ba7b3fbf50`  
**Review role:** Control / Independent Technical Reviewer

---

# 1. Executive verdict

The focused correction review checked only the Contact mappings identified as blocking in the initial implementation-plan review.

All seven required conditions now pass:

1. Homepage V2 does not pass a `source_context` query parameter;
2. Hero does not pass `selected_direction`;
3. Final Private Review does not pass `selected_direction`;
4. the three Ways-to-Start CTAs pass exactly `websites_branding`, `ai_systems_automation`, and `both` respectively;
5. every EN Contact destination uses `/contact/`;
6. every RU Contact destination uses `/ru/contact/`;
7. every Homepage-to-Contact URL ends with `#project-intake`, and `intent`, `source_page`, and `source_cta` match the accepted contract.

No remaining Contact-mapping defect was found.

**Final verdict: `ACCEPT`.**

This acceptance closes the only blocking defect from the initial `TARGETED CORRECTION` report. The previously accepted findings for architecture, five-file scope, JavaScript boundary, Header, Footer, metadata, routes, Concept A, assets, proof, accessibility, responsive behavior, build, rollback, and production-branch origin remain unchanged.

This report does not create or authorize a production branch, production code, a production PR, merge, or deployment. A future Builder stage still requires explicit owner authorization and must start from the then-current `main`.

---

# 2. Reviewed scope

## Corrected plan

```text
path:
docs/site-evolution/homepage-v2-implementation-plan/01_HOMEPAGE_V2_IMPLEMENTATION_PLAN.md

reviewed blob:
99c484c45bc9d75ac91c144511e2f059a021959e
```

The supplied plan blob matches the file at the supplied branch head.

## Initial review report used for comparison

```text
path:
docs/site-evolution/homepage-v2-implementation-plan/03_HOMEPAGE_V2_IMPLEMENTATION_PLAN_REVIEW_REPORT.md

initial review commit:
c7a419e20e6f382ffb1fb0b0668f6e700036cef7
```

The initial report identified exactly three Contact-contract defects:

1. unauthorized Homepage `source_context` parameters;
2. unauthorized `selected_direction=not_sure` on Hero and Final Private Review;
3. missing `#project-intake` fragments.

## Branch verification

```text
branch:
agent/homepage-v2-implementation-plan

supplied head:
1e0f2ed2306b2da11b5497166c4242c7dd14a3fe

branch-ref status:
identical
```

## Correction-cycle changed-file scope

Compared with the initial review commit `c7a419e20e6f382ffb1fb0b0668f6e700036cef7`, the pre-review branch head changed only:

```text
docs/site-evolution/homepage-v2-implementation-plan/01_HOMEPAGE_V2_IMPLEMENTATION_PLAN.md
```

No Homepage, Contact, Header, Footer, CSS, JavaScript, image, asset, route, metadata, sitemap, workflow, or production file was changed in the correction cycle.

---

# 3. Exact accepted Contact mappings

## 3.1 Hero Private Review

### EN

```text
/contact/?intent=private_review&source_page=homepage&source_cta=homepage_hero#project-intake
```

### RU

```text
/ru/contact/?intent=private_review&source_page=homepage&source_cta=homepage_hero#project-intake
```

**Result: PASS.**

The Hero mappings:

- use `intent=private_review`;
- use `source_page=homepage`;
- use `source_cta=homepage_hero`;
- do not include `selected_direction`;
- do not include a `source_context` parameter;
- use the correct localized Contact route;
- end with `#project-intake`.

---

## 3.2 Ways to Start — Website & trust

### EN

```text
/contact/?intent=private_review&source_page=homepage&source_cta=homepage_ways_to_start&selected_direction=websites_branding#project-intake
```

### RU

```text
/ru/contact/?intent=private_review&source_page=homepage&source_cta=homepage_ways_to_start&selected_direction=websites_branding#project-intake
```

**Result: PASS.**

The mapping passes exactly:

```text
selected_direction=websites_branding
```

It uses the correct shared Homepage values and localized routes, contains no `source_context` parameter, and ends with `#project-intake`.

---

## 3.3 Ways to Start — Inquiry handling

### EN

```text
/contact/?intent=private_review&source_page=homepage&source_cta=homepage_ways_to_start&selected_direction=ai_systems_automation#project-intake
```

### RU

```text
/ru/contact/?intent=private_review&source_page=homepage&source_cta=homepage_ways_to_start&selected_direction=ai_systems_automation#project-intake
```

**Result: PASS.**

The mapping passes exactly:

```text
selected_direction=ai_systems_automation
```

It uses the correct shared Homepage values and localized routes, contains no `source_context` parameter, and ends with `#project-intake`.

---

## 3.4 Ways to Start — Connected system

### EN

```text
/contact/?intent=private_review&source_page=homepage&source_cta=homepage_ways_to_start&selected_direction=both#project-intake
```

### RU

```text
/ru/contact/?intent=private_review&source_page=homepage&source_cta=homepage_ways_to_start&selected_direction=both#project-intake
```

**Result: PASS.**

The mapping passes exactly:

```text
selected_direction=both
```

It uses the correct shared Homepage values and localized routes, contains no `source_context` parameter, and ends with `#project-intake`.

---

## 3.5 Final Private Review

### EN

```text
/contact/?intent=private_review&source_page=homepage&source_cta=homepage_final#project-intake
```

### RU

```text
/ru/contact/?intent=private_review&source_page=homepage&source_cta=homepage_final#project-intake
```

**Result: PASS.**

The Final Private Review mappings:

- use `intent=private_review`;
- use `source_page=homepage`;
- use `source_cta=homepage_final`;
- do not include `selected_direction`;
- do not include a `source_context` parameter;
- use the correct localized Contact route;
- end with `#project-intake`.

---

# 4. Global parameter findings

## 4.1 `source_context`

**Result: PASS.**

No `source_context=` query parameter remains anywhere in the corrected implementation plan.

The plan contains only explicit prohibitions stating that Hero, Final Private Review, and Homepage V2 generally must not send `source_context`. These statements do not transmit the parameter and correctly preserve the accepted contract.

## 4.2 `selected_direction`

**Result: PASS.**

The only Homepage-to-Contact URL mappings containing `selected_direction=` are the three Ways-to-Start situations:

```text
websites_branding
ai_systems_automation
both
```

No `selected_direction=not_sure` mapping remains.

Hero and Final Private Review do not send any selected direction.

## 4.3 Localized Contact routes

**Result: PASS.**

All five EN mappings use:

```text
/contact/
```

All five RU mappings use:

```text
/ru/contact/
```

No cross-locale Contact route was found.

## 4.4 Intake fragment

**Result: PASS.**

All ten localized Homepage-to-Contact URLs end with:

```text
#project-intake
```

The query string precedes the fragment correctly.

## 4.5 Accepted machine values

**Result: PASS.**

All mappings use only accepted finite values:

```text
intent=private_review
source_page=homepage
source_cta=homepage_hero | homepage_ways_to_start | homepage_final
selected_direction=websites_branding | ai_systems_automation | both
```

No unaccepted CTA, source-page, intent, or selected-direction value was introduced.

---

# 5. Closure of initial findings

The three blocking findings from the initial report are closed:

```text
unauthorized source_context parameters: CLOSED
Hero/Final selected_direction=not_sure: CLOSED
missing #project-intake fragments: CLOSED
```

No additional correction is required in Section 9.2.

The implementation plan is now suitable for a separate owner-authorized production Builder task.

---

# 6. Remaining defects

**None within the reviewed Contact-mapping scope.**

The focused review did not reopen or re-audit already accepted non-Contact sections. Those findings remain governed by the initial review report and are unaffected by the narrow Section 9.2 correction.

---

# 7. Exact next authorized step

The implementation plan is accepted.

The next possible stage is a separate, explicitly owner-authorized Homepage V2 production Builder task.

Before any production edit, that task must:

1. fetch the then-current `main`;
2. record the actual production base SHA;
3. confirm that Homepage, Header, Footer, Contact, routes, and shared contracts have not materially drifted from the reviewed baseline;
4. create the production branch from that current `main`, not from this docs-only planning branch;
5. keep the initial Builder scope to the accepted five files unless a verified dependency requires a stop and new authorization.

Still not authorized by this review alone:

- production branch creation;
- Homepage YAML, HTML, CSS, or JavaScript changes;
- image or asset changes;
- Contact, Header, or Footer changes;
- production PR creation;
- merge;
- deployment.

---

# 8. Changed-file confirmation

Only this file was changed during the focused correction review:

```text
docs/site-evolution/homepage-v2-implementation-plan/03_HOMEPAGE_V2_IMPLEMENTATION_PLAN_REVIEW_REPORT.md
```

Not changed during this review:

- `00_READ_ME.md`;
- `01_HOMEPAGE_V2_IMPLEMENTATION_PLAN.md`;
- `02_HOMEPAGE_V2_IMPLEMENTATION_PLAN_REVIEW_TASK.md`;
- Homepage wrappers or snapshots;
- Contact;
- Header;
- Footer;
- CSS;
- JavaScript;
- images;
- assets;
- routes;
- metadata;
- sitemap;
- workflows;
- production files.

Focused Homepage V2 implementation-plan Contact-mapping review complete. No production files were changed.
