# Contributing to ProAI Expert

## Repository purpose

This repository is the production source for the ProAI Expert website. It also contains public project documentation, portfolio case packs, QA records, and implementation standards.

The repository is public for transparency, portfolio value, and controlled collaboration. It is not currently operated as an open-ended community project.

## Contributions currently considered

Useful contributions may include:

- reproducible broken-link reports;
- accessibility defects;
- clear responsive-layout defects;
- browser compatibility problems;
- factual documentation corrections;
- security-adjacent observations that do not expose sensitive details;
- narrowly scoped fixes with clear verification steps.

## Contributions not currently solicited

Please do not submit unsolicited:

- full redesigns or broad visual rewrites;
- bulk AI-generated content or code changes;
- speculative SEO rewrites;
- unverified marketing claims, rankings, reviews, metrics, or client outcomes;
- new third-party trackers, widgets, form services, or dependencies;
- route restructures or language-system changes;
- changes to client case studies without evidence and approval;
- large refactors without a specific production need;
- changes that mix unrelated projects or repositories.

## Before opening an Issue

For a non-security problem, include:

- affected URL or repository path;
- concise description of the issue;
- expected and actual behavior;
- browser, viewport, device, or operating system when relevant;
- reproducible steps;
- screenshots with personal and client information removed.

Do not use public Issues for vulnerabilities, credentials, personal data, private client information, or exploitable configuration details. Follow [SECURITY.md](SECURITY.md) instead.

## Pull request expectations

A pull request should:

- address one clearly defined problem;
- use a dedicated feature or fix branch;
- preserve current production routes;
- preserve natural EN/RU localization and reciprocal language relationships;
- preserve canonical, `hreflang`, sitemap, and robots integrity when affected;
- preserve accessibility, keyboard use, and reduced-motion behavior;
- avoid unsupported claims and fictional proof;
- document testing and visual verification;
- identify any limitations or unverified assumptions;
- avoid unrelated formatting churn.

## Language and localization

English and Russian pages are maintained as language-specific experiences, not mechanical line-by-line copies.

When changing localized content:

- preserve meaning, intent, and service accuracy;
- do not assume identical sentence structure across languages;
- maintain correct localized routes and internal links;
- label Russian- or Ukrainian-language destinations clearly in English-first GitHub documentation;
- verify both language versions when a shared component or navigation pattern changes.

## Evidence and claims

Any statement about rankings, inquiries, conversions, revenue, credentials, reviews, response times, savings, or business outcomes must be verified and properly scoped.

Use these labels consistently:

- **Implemented** — present in source or production;
- **Verified** — checked with evidence;
- **Observed** — seen in a defined period or test;
- **Planned** — approved but not built;
- **Concept** — demonstrative and not verified in operations;
- **Not claimed** — intentionally excluded because evidence is insufficient.

## Testing

Testing depends on the scope of the change, but may include:

- HTML and JavaScript validation;
- affected route checks;
- desktop and mobile viewport checks;
- keyboard navigation;
- reduced-motion behavior;
- EN/RU parity checks;
- canonical and `hreflang` validation;
- form and contact-path checks;
- visual comparison against the approved production state.

A pull request should state exactly what was tested and what was not tested.

## Approval and merging

Submission does not imply acceptance. Changes may be declined when they:

- conflict with current strategy or approved design direction;
- duplicate active work;
- introduce unverifiable claims;
- increase dependency, privacy, or maintenance risk;
- require unavailable client approval;
- expand scope beyond the stated problem.

Only authorized maintainers may approve deployment-sensitive changes.
