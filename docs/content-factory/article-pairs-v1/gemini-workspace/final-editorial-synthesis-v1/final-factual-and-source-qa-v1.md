# Final Factual and Source QA V1

**Status:** COMPLETE — PENDING MAIN-AUTHOR REVIEW  
**Scope:** Four final editorial synthesis candidates  
**Verdict:** PASS — NO MATERIAL FACTUAL BLOCKER IDENTIFIED

## 1. QA method

Each source-dependent statement was checked against:

1. the authoritative governance and main-author adjudications;
2. the immutable baseline wording;
3. the approved primary-source manifest;
4. the actual final candidate text.

No new external source was added. No SERP observation, competitor claim, statistic, client outcome, or market-volume assertion was imported into the public candidates.

## 2. Approved primary sources

### Google Search Central

- Managing multilingual and multi-regional sites:  
  `https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites`
- Localized versions and `hreflang`:  
  `https://developers.google.com/search/docs/specialty/international/localized-versions`
- Locale-adaptive pages:  
  `https://developers.google.com/search/docs/specialty/international/locale-adaptive-pages`

### W3C

- Language of Page:  
  `https://www.w3.org/WAI/WCAG22/Understanding/language-of-page`
- Language of Parts:  
  `https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts`
- Evaluating Web Accessibility:  
  `https://www.w3.org/WAI/test-evaluate/`

### U.S. Copyright Office

- Copyright ownership and transfer, Title 17 Chapter 2:  
  `https://www.copyright.gov/title17/92chap2.html`
- Work made for hire:  
  `https://www.copyright.gov/register/se-hire.html`

### ICANN

- Information for domain-name registrants:  
  `https://www.icann.org/registrants`

### Supporting operating reference

- Digital.gov multilingual website guidance:  
  `https://digital.gov/resources/top-10-best-practices-for-multilingual-websites/`

Digital.gov is explicitly identified in Article 1 EN as federal guidance used as an operating reference, not as a universal private-sector legal requirement.

## 3. Google technical claims — Article 1 RU/EN

| Claim | Final wording standard | Source | Verdict |
|---|---|---|---|
| Separate language URLs | Google recommends separate URLs for language versions | Google multilingual guidance | PASS |
| `hreflang` role | Google supports `hreflang` to connect corresponding language/region versions | Google localized versions | PASS |
| Self-reference | Each version should list itself and corresponding variants | Google localized versions | PASS |
| Reciprocity | Corresponding annotations should be reciprocal | Google localized versions | PASS |
| Direct access | Users and crawlers should be able to access each version directly | Google multilingual and locale-adaptive guidance | PASS |
| Locale-adaptive limitation | Locale-adaptive content may be discovered incompletely | Google locale-adaptive pages | PASS |
| Visible language | Page language should be evident from visible content | Google multilingual guidance | PASS |
| Performance boundary | `hreflang` does not create demand or guarantee rankings | Governance/adjudication boundary | PASS |

### Rejected formulations not present

- `Google requires separate URLs`;
- `localized slugs rank better`;
- `hreflang guarantees indexing or rankings`;
- `locale-adaptive pages disappear from Google`;
- `structured headings cause AI Overview citation`;
- `multilingual publishing produces ROI`.

## 4. WCAG language claims — Article 1 RU/EN

| Claim | Required nuance | Verdict |
|---|---|---|
| Primary page language | WCAG 2.2 SC 3.1.1 is Level A | PASS |
| Language of parts | SC 3.1.2 is Level AA | PASS |
| Exceptions | Proper names, technical terms, indeterminate language, and expressions incorporated into surrounding language | PASS |
| Purpose | Supports appropriate pronunciation and processing by assistive technology | PASS |
| Legal boundary | Not framed as a universal legal obligation for every private business | PASS |

No article claims universal WCAG compliance or legal immunity.

## 5. W3C evaluation claims — Article 2 RU/EN

| Claim | Source | Verdict |
|---|---|---|
| Accessibility should be evaluated early and throughout development | W3C Evaluating Web Accessibility | PASS |
| No automated tool alone determines whether a site is accessible | W3C Evaluating Web Accessibility | PASS |
| Knowledgeable human evaluation is required | W3C Evaluating Web Accessibility | PASS |
| A Lighthouse score is not a complete definition of quality | Editorial application of W3C boundary | PASS |

The articles do not claim that a particular review establishes legal compliance.

## 6. ICANN domain claims — Article 2 RU/EN

| Claim | Final treatment | Verdict |
|---|---|---|
| Registrant relationship | Registrant is the person/entity registering the domain through a registrar relationship | PASS |
| Registrar account | Treated separately from registrant status | PASS |
| DNS control | Presented as a practical-control field | PASS |
| Renewal notices and billing | Presented as operational controls | PASS |
| Transfer path | Presented as a project question, not an ownership conclusion | PASS |

### Rejected formulations not present

- `true owner of the domain`;
- `if the agency registers it, you are renting it`;
- `the domain is automatically held hostage`.

## 7. Copyright claims — Article 2 RU/EN

| Claim | Required nuance | Verdict |
|---|---|---|
| Initial ownership | Copyright initially vests in the author except where law provides otherwise | PASS |
| Work made for hire | Qualifying works made for hire are limited to statutory circumstances | PASS |
| Later transfer | Initial ownership and later transfer are separate | PASS |
| Signed writing | Transfer of copyright ownership, other than by operation of law, generally requires a signed writing | PASS |
| Third-party components | Fonts, stock assets, themes, plugins, and APIs may remain licensed under third-party terms | PASS |
| Source files | Repository/source-file access is a separate scope and control question | PASS |
| Legal boundary | Material IP questions are referred to a qualified U.S. attorney | PASS |

### Rejected formulations not present

- `payment transfers no rights under any circumstances`;
- `payment automatically transfers all rights`;
- `every commissioned website is work made for hire`;
- `the article determines ownership under a specific agreement`.

## 8. Proposal and contract boundary — Article 2 RU/EN

| Claim | Final treatment | Verdict |
|---|---|---|
| Proposal/SOW/agreement/estimate distinction | Descriptive and operational, not a legal classification of a specific document | PASS |
| Sales-call promises | Reader is advised to make material promises traceable in written documents | PASS |
| Oral statements | Not treated as automatically invalid; described as non-traceable operational scope until status is clear | PASS |
| Binding effect | Explicitly depends on text and applicable law | PASS |
| Legal referral | Significant contract questions go to qualified counsel | PASS |
| Acceptance | Defined as project confirmation, not a universal legal conclusion | PASS |

No article covers remedies, warranties, indemnification, termination, governing law, dispute resolution, or contract templates.

## 9. Privacy and professional-review wording

PASS.

Article 2 does not state that every site needs the same legal pages. It asks whether privacy notices or other disclosures may apply based on:

- data practices;
- services;
- audience;
- jurisdiction;
- business-specific requirements.

Professional facts and sensitive claims are assigned to the owner or a qualified specialist for verification. This is an operational approval boundary, not legal advice.

## 10. Hypothetical examples

| Candidate | Hypothetical module | Label present | Invented outcome avoided | Verdict |
|---|---|---:|---:|---|
| Article 1 RU | Разорванный языковой путь | Yes | Yes | PASS |
| Article 1 EN | Broken language journey | Yes | Yes | PASS |
| Article 2 RU | Одинаковое количество страниц — разные проекты | Yes | Yes | PASS |
| Article 2 EN | Same page count, two different projects | Yes | Yes | PASS |

No hypothetical is presented as a client, study, measured result, testimonial, or verified case.

## 11. Financial Stream evidence gate

PASS WITH IMPLEMENTATION-TIME RECHECK REQUIRED.

Article 1 RU uses Financial Stream only for the following architecture facts already approved by governance:

- separate EN/RU routes;
- corresponding service structures;
- consistent brand system;
- multiple contact paths.

The article explicitly rejects conclusions about:

- traffic;
- rankings;
- leads;
- conversion;
- revenue;
- ROI.

The public portfolio case link remains blocked.

Before implementation, the observable architecture must be checked again. If no longer observable, the named module must be removed rather than weakened into an unsupported claim.

This is a future implementation gate, not an editorial blocker for main-author review.

## 12. Unsupported-performance-claim scan

No candidate claims or promises:

- rankings;
- traffic growth;
- lead volume;
- conversion lift;
- sales;
- revenue;
- ROI;
- Google Maps placement;
- AI Overview citation;
- dispute avoidance;
- contractor competence;
- successful project delivery.

Statements about possible delay, rework, broken URLs, cost, or operational friction use conditional risk language.

## 13. Source placement

PASS.

Primary-source links remain adjacent to the relevant claim:

- Google links beside multilingual architecture claims;
- W3C language links beside WCAG language claims;
- W3C evaluation link beside automated-testing limits;
- ICANN link beside registrant/registrar discussion;
- Copyright Office links beside initial ownership, transfer, and work-made-for-hire wording.

Sources are not collected into a detached footer that would obscure claim traceability.

## 14. Metadata and query-ownership scan

PASS.

No candidate changes:

- route;
- H1;
- SEO title;
- meta description;
- language pairing;
- canonical relationship;
- query ownership.

Article 1 remains about multilingual coverage decisions and governance.  
Article 2 remains about proposal completeness, traceability, responsibility, control, and acceptance.

## 15. Natural-language factual risks

### RU

PASS after correction of:

- excessive English framework labels;
- unnatural `операционная ёмкость` repetition;
- legal absolutes;
- domain-ownership rhetoric;
- automatic SEO consequences.

Necessary U.S. terms remain where readers are likely to encounter them in actual documents or systems, with Russian context.

### EN

PASS after correction of:

- translation-cost generalization;
- legal/regulatory absolutes;
- “future invoice” certainty;
- “devastate visibility” language;
- impartial/independent review positioning.

## 16. Final factual/source verdict

**PASS — NO MATERIAL FACTUAL BLOCKER IDENTIFIED**

Remaining control:

- main-author approval is required;
- Financial Stream architecture must be rechecked at implementation time;
- source links must remain attached to claims during future page build;
- page build remains blocked.