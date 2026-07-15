# ProAI Expert — Phase 0 Portfolio Recovery Report

**Status:** Completed for safe prototype work  
**Date:** 2026-07-15  
**Repository:** `proaiexpert/proaiexpert.github.io`

## 1. Actions completed

Three isolated safety branches now exist:

1. `backup/pre-portfolio-rebrand-2026-07-15`
   - exact backup of current `main` at commit `16789fae5309cf8558700af4229494abf28b6e78`;
   - rollback reference for the current public-source state.

2. `portfolio-rebrand-v1`
   - working branch based on the same current `main` commit;
   - all portfolio prototype and reconstruction work must happen here first;
   - this branch is not the production source.

3. `archive/live-case-studies-snapshot-2026-03`
   - historical portfolio snapshot at commit `02f6c7c224c302fafc05dabffaabdd04dd06afd0`;
   - preserves the EN/RU archive and the legacy case-study design system that closely matches the currently accessible live Case Studies archive;
   - reference only: never merge or roll this entire branch over the current site.

## 2. Confirmed root cause class

The portfolio mismatch was caused by a major site rebuild, not by a single broken link.

Between historical commit `02f6c7c224c302fafc05dabffaabdd04dd06afd0` and rebuild/deletion commit `5fa342a64b464493a0935047c7c84d6c3884c4f0`, the repository changed materially:

- old EN Case Studies archive and case pages were removed;
- much of the old shared CSS, JS, brand assets and case assets was removed;
- the homepage and service pages were replaced with the newer largely self-contained site architecture;
- the sitemap was rewritten and Case Studies routes were removed;
- current `main` later received a redirect at `case-studies/index.html`.

The custom domain still exposes historical Case Studies pages while current `main` does not represent them. The exact cache/deployment retention mechanism is not required for safe design work because the historical source is now preserved independently and current production source has a separate backup.

## 3. Important architectural conclusion

Do **not** restore the old site shell into the current site.

The old Case Studies pages depended on the previous global system under paths such as:

- `assets/css/main.css`;
- `assets/css/sections.css`;
- `assets/css/layout.css`;
- `assets/css/components.css`;
- old shared navigation and brand assets.

Restoring that system globally would risk overwriting or conflicting with the current homepage, AI Systems, Websites & Branding, About, Contact and Insights pages.

The correct strategy is:

1. preserve the historical case content and route intent;
2. rebuild the portfolio experience natively inside the current ProAI visual/technical system;
3. use case-specific CSS and JavaScript with strict scoping;
4. test in `portfolio-rebrand-v1`;
5. merge only after preview approval and no-regression QA.

## 4. Route preservation decision

The following routes remain canonical and must be rebuilt rather than renamed:

```text
/case-studies/
/case-studies/financial-stream/
/case-studies/alina-horb/
/case-studies/local-repair-pro/
/case-studies/proai-expert/

/ru/case-studies/
/ru/case-studies/financial-stream/
/ru/case-studies/alina-horb/
/ru/case-studies/local-repair-pro/
/ru/case-studies/proai-expert/
```

No competing `/work/` or `/portfolio/` system will be introduced.

## 5. Existing placements to preserve

### Homepage

Keep and later strengthen the existing Financial Stream proof section:

- owner testimonial;
- desktop and mobile device composition;
- live-site link;
- add a clear `View Case Study` route once the rebuilt case is ready.

### Websites & Branding

Keep the existing Financial Stream / ProAI showcase as capability proof. It should link into the new case system without duplicating the full case narrative.

### AI Systems

Do not add a large duplicate client case. A compact operational proof module may be added later only after sanitized automation evidence is ready.

## 6. Prototype implementation boundary

The first prototype must be created only in `portfolio-rebrand-v1` and must not modify current public routes yet.

Recommended isolated preview path:

```text
/previews/portfolio-v1/
/previews/portfolio-v1/financial-stream/
```

Prototype scope:

- archive opening and three primary project stages;
- secondary ProAI Expert Studio Case treatment;
- Financial Stream cinematic hero;
- chapter navigation;
- one system-map interaction;
- one visual walkthrough transition;
- owner testimonial;
- next-project transition to Alina Horb;
- reduced-motion and mobile fallback.

## 7. Global areas frozen until prototype approval

Do not edit yet:

- current homepage public Financial Stream section;
- current header and footer across the site;
- `/ai-systems/`;
- `/websites-branding/`;
- sitemap and robots;
- current redirects;
- production Case Studies routes;
- global mobile CSS files;
- root-level shared JavaScript.

## 8. Phase 0 exit criteria

Completed:

- current source backed up;
- isolated working branch created;
- historical portfolio snapshot preserved;
- deletion/rebuild boundary identified;
- route model confirmed;
- dangerous full rollback rejected;
- safe selective rebuild strategy established.

## 9. Next action

Proceed to **Phase 1: isolated portfolio prototype** on `portfolio-rebrand-v1`.

The prototype should validate the design and motion language before any public Case Studies route, homepage module, service page, navigation or sitemap is changed.
