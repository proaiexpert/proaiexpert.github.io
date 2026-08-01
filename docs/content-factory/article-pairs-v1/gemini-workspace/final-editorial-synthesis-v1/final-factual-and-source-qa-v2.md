# Final Factual and Source QA V2

**Статус:** COMPLETE — PENDING FINAL MAIN-AUTHOR APPROVAL  
**Scope:** Language-polished RU candidates plus unchanged approved EN candidates  
**Verdict:** PASS — NO FACTUAL OR SOURCE DRIFT IDENTIFIED

## 1. QA method

This V2 control compares:

1. `main-author-final-editorial-review-v1.md`;
2. `final-ru-language-polish-task-v1.md`;
3. the reviewed RU V6/V5 candidates;
4. the language-polished RU V7/V6 candidates;
5. the unchanged EN candidates;
6. `final-factual-and-source-qa-v1.md`;
7. authoritative metadata governance.

The purpose is not to reopen research. It is to verify that language polishing did not change any factual proposition, source boundary, legal caveat, performance limitation, metadata value, or evidence gate.

No new external source, statistic, client, case, outcome, or performance claim was added.

---

## 2. Google wording — Article 1 RU/EN

| Control | Required wording boundary | V2 verdict |
|---|---|---|
| Separate URLs | Google recommends separate URLs for language variants | PASS |
| `hreflang` | Google supports `hreflang` for corresponding language/region versions | PASS |
| Self-reference | Each version should list itself and corresponding variants | PASS |
| Reciprocity | Corresponding language relationships should be reciprocal | PASS |
| Direct access | Each version should remain directly accessible | PASS |
| Locale-adaptive limitation | Content adapted by region or browser language may be discovered incompletely | PASS |
| Visible language | Page language remains evident from visible content | PASS |
| Performance boundary | No guarantee of demand, indexing, rankings, traffic, inquiries, revenue, or ROI | PASS |

### Language-polish impact

The RU replacement:

- `browser-based redirect` → `перенаправление по языку браузера`;
- `locale-adaptive content` → `контент, адаптируемый по региону или языку пользователя`;

changes only the language of explanation. It does not strengthen, weaken, or reinterpret Google’s guidance.

### Rejected formulations remain absent

- `Google requires separate URLs`;
- `localized slugs rank better`;
- `hreflang guarantees indexing or rankings`;
- `locale-adaptive pages are never indexed`;
- `multilingual publishing produces ROI`.

---

## 3. WCAG language criteria — Article 1 RU/EN

| Claim | Required nuance | V2 verdict |
|---|---|---|
| Language of Page | WCAG 2.2 SC 3.1.1 is Level A | PASS |
| Language of Parts | WCAG 2.2 SC 3.1.2 is Level AA | PASS |
| Exceptions | Proper names, technical terms, indeterminate language, and expressions incorporated into surrounding language | PASS |
| Legal boundary | Not presented as a universal private-sector legal conclusion | PASS |

No exception, level, or accessibility purpose was changed during the Russian-language polish.

---

## 4. W3C automated-testing boundary — Article 2 RU/EN

| Claim | V2 verdict |
|---|---|
| Accessibility evaluation should begin early and continue throughout development | PASS |
| No automated tool alone determines whether a site is accessible | PASS |
| Knowledgeable human evaluation is required | PASS |
| One Lighthouse result is not a complete definition of quality or compliance | PASS |

The language change `Lighthouse score` → `оценка Lighthouse` is purely editorial. The W3C boundary is unchanged.

---

## 5. ICANN registrant/registrar relationship — Article 2 RU/EN

| Control | Required treatment | V2 verdict |
|---|---|---|
| Registrant | Person or entity registering the domain through a registrar relationship | PASS |
| Registrar account | Separate practical-control field | PASS |
| DNS | Separate control field | PASS |
| Renewal and billing | Operational controls, not universal ownership conclusions | PASS |
| Transfer path | Project and continuity question | PASS |

RU V6 now introduces the terms as:

- `регистрант (registrant)`;
- `регистратор (registrar)`.

This improves comprehension without changing ICANN’s relationship model.

### Rejected formulations remain absent

- `true owner of the domain`;
- `if the agency registers it, the client is renting it`;
- `the domain is held hostage`.

---

## 6. Copyright, transfer, operation of law, and work made for hire

| Claim | Required nuance | V2 verdict |
|---|---|---|
| Initial ownership | Copyright initially belongs to the author except where law provides otherwise | PASS |
| Later transfer | Initial ownership and later transfer remain separate | PASS |
| Operation of law | Transfer other than by operation of law generally requires signed writing | PASS |
| Signed writing | Written transfer signed by the rights owner or authorized agent remains stated | PASS |
| Work made for hire | Applies only in circumstances established by U.S. law | PASS |
| Third-party licenses | Fonts, stock assets, themes, plugins, APIs, and other components remain separately licensed where applicable | PASS |
| Source files/repository | Remain separate scope and practical-control questions | PASS |
| Legal referral | Material IP questions remain referred to qualified U.S. counsel | PASS |

The RU wording was naturalized from mixed English/Russian prose into Russian legal-business language. No legal conclusion was added.

### Rejected formulations remain absent

- payment automatically transfers all rights;
- payment transfers no rights in every case;
- every commissioned website qualifies as work made for hire;
- the article determines ownership under a specific agreement.

---

## 7. Proposal, SOW, contract, and oral-discussion boundary

| Control | Required treatment | V2 verdict |
|---|---|---|
| Proposal / SOW / contract / estimate | Descriptive operational distinctions only | PASS |
| Attachments and change orders | Remain part of document reconciliation | PASS |
| Oral discussions | Not automatically declared invalid or unenforceable | PASS |
| Written traceability | Important promises should be located in the current document package | PASS |
| Binding effect | Depends on actual text and applicable law | PASS |
| Legal referral | Significant questions remain directed to qualified counsel | PASS |
| Acceptance | Project confirmation, not a universal legal conclusion | PASS |

The replacement `enforceability` → `юридическая сила` does not alter the disclaimer or legal boundary.

---

## 8. Proposal Risk Ledger and methodology integrity

PASS.

RU V6 retains every independent field:

- item or required result;
- scope / объём;
- responsible party;
- client input / материалы и решения заказчика;
- external dependency;
- acceptance evidence;
- document source;
- open question.

The language polish does not merge responsibility with dependency, scope with acceptance, or ownership with practical control.

`НЕ ПРИМЕНЯЕТСЯ` logic remains intact.

---

## 9. No-guarantee language

PASS.

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
- successful project delivery;
- legal compliance or enforceability.

Conditional language around delay, rework, broken paths, extra cost, and operational risk remains conditional.

---

## 10. Financial Stream evidence gate

**Verdict:** PASS WITH IMPLEMENTATION-TIME RECHECK REQUIRED.

Article 1 RU V7 retains only the approved architecture facts:

- separate EN/RU routes;
- corresponding service structures;
- consistent brand system;
- multiple contact paths.

The polish changes only the wording of the boundary:

- `portfolio case` → `портфолио-кейс`;
- `evidence gate` → `проверка доказательной базы`.

It does not add a public link or any traffic, ranking, lead, conversion, revenue, or ROI conclusion.

Before page implementation, the architecture must still be rechecked. If no longer observable, the named module must be removed rather than weakened into an unsupported claim.

This remains a future implementation gate, not an editorial blocker.

---

## 11. Source placement and URLs

PASS.

All source URLs remain unchanged and adjacent to their relevant claims:

- Google Search Central beside multilingual architecture guidance;
- W3C Language of Page / Language of Parts beside WCAG language claims;
- W3C evaluation guidance beside automated-testing limits;
- ICANN beside registrant/registrar wording;
- U.S. Copyright Office beside ownership, transfer, and work-made-for-hire wording.

Only explanatory anchor text was naturalized where appropriate.

---

## 12. Hypothetical examples

PASS.

All four scenarios remain explicitly hypothetical.

The RU language polish does not add:

- a real client identity;
- a testimonial;
- a measured loss;
- a verified outcome;
- a new business fact.

---

## 13. Metadata and query ownership

PASS.

No change was made to:

- routes;
- H1s;
- SEO titles;
- meta descriptions;
- language pairing;
- canonical relationships;
- `hreflang` plan;
- query ownership.

Article 1 remains limited to multilingual coverage decisions, continuity, and governance.  
Article 2 remains limited to proposal completeness, traceability, responsibility, dependencies, rights/control, acceptance, evidence, and support.

---

## 14. EN candidate integrity

PASS.

The approved files remain unchanged:

- `article-01-en-final-candidate-v5.md`;
- `article-02-en-final-candidate-v6.md`.

---

## 15. Final verdict

**PASS — NO FACTUAL OR SOURCE DRIFT IDENTIFIED**

Remaining gates:

- final main-author approval is required;
- page build and Stage 3 remain blocked;
- Financial Stream architecture requires implementation-time recheck;
- source links and caveats must remain attached during any future page build.