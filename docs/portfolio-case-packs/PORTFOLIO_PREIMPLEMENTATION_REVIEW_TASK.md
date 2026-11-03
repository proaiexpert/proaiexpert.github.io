# TASK — Independent Pre-Implementation Review of the ProAI Expert Portfolio System

## Purpose

Perform a decisive independent review before any public portfolio code is changed.

This is not a request for general inspiration. Review the specific architecture, integration plan, and risk controls already prepared.

## Primary sources

1. `docs/portfolio-case-packs/PORTFOLIO_SITE_AUDIT_AND_MASTER_PLAN.md`
2. `docs/portfolio-case-packs/PORTFOLIO_EXPERIENCE_BLUEPRINT.md`
3. `docs/portfolio-case-packs/financial-stream/CASE_V2_MASTER_BRIEF.md`
4. `docs/portfolio-case-packs/alina-horb/CASE_PACK.md`
5. `docs/portfolio-case-packs/local-repair-pro/CASE_PACK.md`

## Review role

Act as all of the following:

- senior digital art director;
- information architect;
- interaction design lead;
- technical SEO lead;
- front-end performance/accessibility reviewer;
- deployment and no-regression reviewer.

## Critical current-state facts

- The live custom domain currently serves EN/RU Case Studies archive and case pages.
- Current `main` does not contain the same source state.
- `case-studies/index.html` in `main` is a redirect to `/`.
- the current sitemap omits Case Studies URLs;
- Git history contains commit `5fa342a64b464493a0935047c7c84d6c3884c4f0` labelled `Delete case-studies directory`;
- the public site already contains Financial Stream proof modules on the homepage and Websites & Branding page;
- the public archive currently contains Financial Stream and an internal ProAI Expert case;
- the planned primary portfolio set is Financial Stream, Alina Horb, and Local Repair Pro;
- the existing ProAI Expert studio case must be preserved rather than deleted accidentally.

## Questions to answer

### A. Information architecture

1. Is one EN/RU archive plus one EN/RU page per case the correct long-term architecture for 3–20 projects?
2. Is preserving ProAI Expert as a secondary studio case the right decision?
3. Are the proposed routes and language mappings stable and scalable?
4. Is there any reason to use `/work/` or `/portfolio/` instead of preserving `/case-studies/`?

### B. Existing site integration

5. Is the homepage Financial Stream section correctly assigned as a featured teaser rather than the full case?
6. Is the Websites & Branding showcase role sufficiently distinct from the homepage and full case?
7. Should AI Systems contain a compact Financial Stream automation proof module, or would that create unnecessary duplication?
8. Are any other site locations missing from the placement inventory?

### C. Design and interaction

9. Does the `Cinematic Editorial Systems` direction fit ProAI Expert?
10. Are three large editorial project stages appropriate, with ProAI Expert shown secondarily?
11. Which proposed interactions improve comprehension?
12. Which interactions are ornamental, risky, or likely to age poorly?
13. Are the mobile simplifications adequate?
14. Is the system distinctive enough without becoming visually inconsistent across the three project color worlds?

### D. Source/deployment safety

15. Is the Phase 0 recovery plan sufficiently conservative?
16. What additional evidence is needed to identify the current live deployment source?
17. What is the safest selective restoration strategy after the `case-studies` directory deletion?
18. Which files or global CSS areas present the highest regression risk?
19. Is the proposed branch, commit, preview, and rollback model sufficient?

### E. SEO, accessibility, and performance

20. Are archive/case canonical and hreflang rules correct?
21. Is the sitemap plan complete?
22. Are any schema types being considered that should be avoided?
23. Are the proposed animation constraints sufficient for accessibility and Core Web Vitals?
24. What additional keyboard, reduced-motion, or responsive tests are mandatory?

### F. Commercial clarity and truthfulness

25. Does the Financial Stream case prove enough without overstating outcomes?
26. Are the project status labels clear enough to distinguish real client, real/live project, concept, and internal studio work?
27. Does the archive communicate capability without making the projects look interchangeable?
28. Are any claims, placements, or proof modules likely to create confusion or distrust?

## Required output

Provide one decisive review containing:

1. **Overall verdict:** approve, approve with corrections, or reject.
2. **Blocking issues:** anything that must be resolved before implementation.
3. **Five strongest decisions.**
4. **Five highest risks.**
5. **Exact corrections to the master plan.**
6. **Final approved information architecture.**
7. **Final approved site-placement matrix.**
8. **Final approved interaction list.**
9. **Mobile/reduced-motion simplification rules.**
10. **Safe source-recovery sequence.**
11. **Implementation priority order.**
12. **A go/no-go checklist for beginning the prototype.**

## Restrictions

- Do not redesign the entire ProAI Expert site.
- Do not suggest deleting the existing ProAI Expert case without a redirect and preservation rationale.
- Do not recommend a second competing portfolio URL system.
- Do not invent client outcomes, metrics, testimonials, or permissions.
- Do not recommend effects solely for spectacle.
- Do not assume the current `main` branch is the exact source of the current live Case Studies pages.
- Do not propose direct-to-main implementation.
