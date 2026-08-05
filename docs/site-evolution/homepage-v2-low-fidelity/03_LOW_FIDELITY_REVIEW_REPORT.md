# Homepage V2 Low-Fidelity Full-Page Map — Independent Review Report

**Status:** independent visual review complete  
**Verdict:** `TARGETED CORRECTION`  
**Repository:** `proaiexpert/proaiexpert.github.io`  
**Branch:** `agent/homepage-v2-low-fidelity-map`  
**Reviewed branch head:** `e02ead019fcec285a140598d1de69ef281791d9d`  
**Branch base:** `main` at `7bcc09ae28388f8e4a5e6e5a715aa5ba7b3fbf50`  
**Source Content Architecture blob:** `cdfe0188cdf5d886066f6effdceaf9e8bddd704b`  
**Review role:** Control / Independent Reviewer

---

## 1. Executive verdict

Все четыре SVG-карты были проверены как реальные визуальные документы: целиком и через увеличенные фрагменты Hero, Connected Journey, Ways to Start и Selected Work.

Основная low-fidelity композиция правильная:

- все десять блоков присутствуют в утверждённом порядке;
- Financial Stream остаётся самым сильным и ранним доказательным блоком;
- Ways to Start следует после реального proof;
- Process и Founder не прерывают первоначальный коммерческий аргумент;
- Insights остаются вторичными;
- Header и Footer показаны как закрытые границы;
- карты остаются серыми и не выдают low-fidelity решения за финальный дизайн.

Однако карты пока не могут быть приняты как надёжный вход для visual concept comparison. Остались ограниченные, но блокирующие дефекты:

1. карты 390, 320 и 844 × 390 не показывают полный принятый RU Hero: отсутствует eyebrow, полная supporting copy заменена короткой двухстрочной формулировкой, отсутствует accountability line;
2. поэтому раннее положение primary CTA получено на сокращённом, а не на утверждённом контенте, и RU Hero gate фактически не проверен;
3. в карте 844 × 390 четвёртый шаг Connected Journey выходит за границу своего блока и визуально накладывается на Two Core Directions;
4. мобильные и short-landscape карты не показывают заключение Connected Journey, которое связывает сайт и автоматизацию в одну систему;
5. Ways to Start не резервирует отдельные места одновременно для review CTA и обязательных `service_links`, особенно для третьей ситуации с двумя сервисными ссылками;
6. Selected Work не показывает отдельные читаемые зоны для статуса и disclosure/boundary, поэтому на 320 px нельзя подтвердить правдивое различие Alina Horb и Local Repair Pro;
7. desktop Hero не показывает обязательную expectation copy рядом с primary CTA.

Это не требует новой стратегии, перестройки десяти блоков или переписывания Content Architecture. Нужна точечная коррекция самих low-fidelity карт.

**Verdict: `TARGETED CORRECTION`.**

---

## 2. Reviewed branch head and map file blobs

### Branch state before this report write

- Reviewed head: `e02ead019fcec285a140598d1de69ef281791d9d`
- Base and merge base: `7bcc09ae28388f8e4a5e6e5a715aa5ba7b3fbf50`
- Branch state: 17 commits ahead, 0 commits behind
- Branch scope before report write: documentation workspace and four SVG maps; no production files

### Reviewed map blobs

```text
homepage-v2-low-fi-1440.svg
b1caced2044b7a0d7ffae467a9f8bd7ba5ee6997

homepage-v2-low-fi-390.svg
ac859a50563093f613a763334c039a8aa2962092

homepage-v2-low-fi-320.svg
db6c7869eaec494b8a58ab444c7891de636aa7b8

homepage-v2-low-fi-844x390.svg
004ebce53be5a5a7abb1164ddc8915a953a35682
```

All four SVG files are valid renderable documents with the declared dimensions:

- 1440 × 5300;
- 390 × 5646;
- 320 × 6067;
- 844 × 4684.

---

## 3. Ten-block architecture result

**Result: PASS.**

Every map contains the same ten blocks in the accepted order:

1. Hero;
2. Connected Business Journey;
3. Two Core Directions;
4. Financial Stream;
5. Ways to Start;
6. Controlled Delivery;
7. Founder;
8. Selected Work;
9. Insights;
10. Final Private Review.

No additional pricing block, third service direction, technology-logo wall, duplicate Financial Stream block or new service pitch was introduced.

Header precedes the ten blocks and Footer follows them. Neither is presented as part of the editable Homepage body architecture.

---

## 4. Commercial hierarchy result

**Result: PASS with targeted content-slot corrections required.**

The page-level hierarchy is directionally correct:

- Hero opens the journey and exposes the primary action;
- Connected Journey is the largest strategic explanation after Hero;
- Two Core Directions appears before proof without turning into a service catalogue;
- Financial Stream appears before Ways to Start and has the strongest proof field;
- Ways to Start is presented as three ordered situations, not three pricing tiers;
- Process and Founder reduce delivery risk after the first conversion opportunity;
- Selected Work and Insights remain secondary;
- Final Private Review closes the page without adding another offer.

The remaining defects concern completeness of represented content and responsive geometry, not the narrative order.

---

## 5. Desktop 1440 px result

**Result: TARGETED CORRECTION.**

Strong points:

- clear two-field Hero composition;
- supplementary system tableau does not dominate the commercial copy;
- Connected Journey has three friction signals, four steps and a visible concluding connector;
- two service directions are materially separated;
- Financial Stream receives the largest proof field on the page;
- Ways to Start uses editorial rows rather than pricing cards;
- five process phases remain one controlled sequence;
- Founder is compact;
- Insights do not outweigh proof;
- no horizontal-scroll or poster dependency appears.

Required corrections:

1. The Hero shows supporting-copy placeholders and two CTA controls but does not reserve visible expectation copy adjacent to the primary CTA. This copy is mandatory and cannot be hidden by the map.
2. Ways to Start shows only one pill/action placeholder per situation. It does not separately represent the review CTA and the required one, one and two service links.
3. Selected Work uses one generic bottom bar per project card. The map must distinguish the public status from the adjacent disclosure/boundary and from the project action.

The overall desktop scale and section order should remain unchanged.

---

## 6. Mobile 390 px result

**Result: TARGETED CORRECTION.**

Strong points:

- all blocks stack in the correct order;
- no horizontal poster or scrolling dependency is introduced;
- primary CTA is visually prominent;
- expectation-copy placeholders and secondary CTA remain adjacent to the CTA group;
- system tableau becomes a compact four-state strip;
- Connected Journey uses four stacked steps;
- Financial Stream screenshot appears before evidence copy;
- Process uses five stacked phases;
- Footer remains a separate locked boundary.

Blocking issue: the map does not render the accepted RU Hero content that it is supposed to test.

Missing or substituted content:

- accepted RU eyebrow is absent;
- the accepted full supporting paragraph is replaced by `Премиальный сайт, практическая автоматизация / и AI с проверкой человеком`;
- Washington/U.S./EN-RU-UA accountability line is absent.

Therefore the displayed CTA position does not prove that the accepted RU copy is viable at 390 px.

Additional omissions:

- no visible Connected Journey conclusion after the four steps;
- no distinct service-link placeholders in Ways to Start;
- no distinct status and disclosure/boundary zones in Selected Work.

---

## 7. Narrow mobile 320 px result

**Result: TARGETED CORRECTION.**

Strong points:

- single-column composition remains intact;
- cards and controls fit within the declared width;
- no forced one-line headings or horizontal chips appear;
- Financial Stream remains before Ways to Start;
- five process phases, two selected projects and three Insights remain stacked;
- final CTA and Footer remain separate.

The same RU Hero fidelity defect found at 390 px remains present at 320 px. The map omits the eyebrow and accountability line and substitutes a substantially shorter supporting statement. As a result, the first-fold test is not valid for the accepted copy.

Selected Work also fails the required 320 px proof test. Each project is represented by an image field plus one generic 20 px bar. This does not demonstrate that the following can remain visible and readable in normal flow:

- Alina Horb status;
- Alina adjacent related-party disclosure;
- Local Repair Pro three-part status;
- Local Repair Pro non-client/non-operating-business boundary.

The map must reserve realistic multi-line space for those elements rather than treating them as one undifferentiated strip.

---

## 8. Short landscape 844 × 390 result

**Result: TARGETED CORRECTION.**

The map correctly avoids a desktop two-column poster, sticky rail and viewport-filling section requirement. It keeps the page vertically progressive.

Two blocking issues remain.

### A. Invalid RU Hero first-viewport proof

The first 390 px fold contains the displayed H1, shortened two-line support and primary CTA. However:

- the accepted eyebrow is absent;
- the accepted full supporting paragraph is not rendered;
- the accountability line is absent.

The map therefore cannot prove the required statement that Header, accepted eyebrow, accepted H1, accepted supporting copy and primary CTA fit in the first short-landscape viewport.

### B. Geometry overlap

The Connected Journey container begins at `y=562` and ends at `y=1053`.

Its fourth journey step begins at `y=1040` and ends at `y=1108`.

The next block, Two Core Directions, begins at `y=1071`.

Consequently the fourth journey step leaves its owning section and overlaps the next block by 37 px. The rendered visual confirms the collision.

The Hero system strip also ends at `y=550`, while the Hero container ends at `y=544`. This smaller overflow must be contained during the same correction.

---

## 9. RU Hero decision

**Decision: do not shorten or rewrite the RU Hero at this stage.**

The current maps do not provide valid evidence for shortening because they do not render the accepted content in full.

A corrected 390, 320 and 844 × 390 map must show, in this order:

1. exact accepted eyebrow;
2. exact accepted H1;
3. exact accepted full supporting copy;
4. primary CTA;
5. exact expectation copy;
6. secondary CTA;
7. accountability line;
8. compact supplementary system strip.

Only after those exact elements are mapped may a Reviewer determine whether:

- the eyebrow dominates;
- the opening is excessive;
- the primary CTA arrives too late;
- or short landscape fails.

No RU copy correction is authorized by this verdict. The current finding is a map-fidelity defect, not a content defect.

---

## 10. Proof, status and disclosure result

**Result: PARTIAL PASS / TARGETED CORRECTION REQUIRED.**

### Financial Stream

**PASS.**

Across all four maps:

- Financial Stream appears early;
- it receives the largest proof field;
- no metrics dashboard is introduced;
- no lead, revenue, conversion, response-speed or ROI outcome is visually implied;
- evidence and boundary areas remain subordinate to the screenshot rather than replacing it.

### Alina Horb and Local Repair Pro

**NOT YET PROVEN.**

The cards remain visually equal in size, which is acceptable for Selected Work, but their proof classes are not explicitly represented. A single generic bottom strip does not prove that status and disclosure remain adjacent, distinct and readable.

Corrected maps must reserve separate normal-flow placeholders for:

- project status;
- adjacent disclosure or evidence boundary;
- project action/link.

At 320 px the status and disclosure placeholders must be realistically multi-line. They must not depend on hover, tooltip, expansion or an image overlay.

---

## 11. Low-fidelity discipline result

**Result: PASS.**

The maps remain appropriately low fidelity:

- grayscale surfaces;
- generic screenshot and portrait fields;
- no final photography;
- no final color direction;
- no approved typography system;
- no detailed component styling;
- no motion specification;
- no production behavior;
- no claim that exact spacing or controls are final.

The maps do not modify or authorize Homepage, Contact, Header, Footer, CSS, JavaScript, YAML, routes, assets or workflows.

---

## 12. Blocking defects and exact correction scope

The next correction must remain limited to the low-fidelity workspace and must not change Content Architecture or production files.

### Correction 1 — Render the accepted Hero content faithfully

Update the maps so they reserve and label every mandatory Hero element.

For 390, 320 and 844 × 390, render the exact accepted RU eyebrow, H1 and full supporting copy rather than a shortened substitute. Preserve primary CTA, expectation copy, secondary CTA, accountability line and system strip in the accepted order.

For 1440, add the missing expectation-copy slot adjacent to the primary CTA and represent the accountability line.

Do not rewrite the copy.

### Correction 2 — Repair 844 × 390 containment

- keep the Hero strip inside the Hero container;
- keep all four Connected Journey steps inside the Connected Journey container;
- remove the overlap with Two Core Directions;
- preserve the 390 px fold markers and vertical progression;
- do not introduce sticky behavior or horizontal scrolling.

### Correction 3 — Restore the Connected Journey conclusion

Add a visible low-fidelity conclusion/connector after the four journey steps on 390, 320 and 844 × 390. It must remain inside the section and represent the accepted website-plus-automation conclusion.

### Correction 4 — Represent all Ways-to-Start actions

For every situation, show separate placeholders for:

- contextual review CTA;
- service links.

Required service-link counts remain:

- Situation 1: one Website link;
- Situation 2: one AI link;
- Situation 3: two links.

Do not turn these into pricing controls or equal package tiers.

### Correction 5 — Reserve explicit proof-status and disclosure space

For both Selected Work items, show distinct placeholders for:

- status;
- disclosure/boundary;
- action link.

Demonstrate readable multi-line space at 320 px. Preserve Alina as related-party proof and Local Repair Pro as a concept/live demo in development.

After these corrections, perform one focused low-fidelity correction review. Do not start visual concepts before that review returns `ACCEPT`.

---

## 13. Readiness for visual concept comparison

**Status: NOT READY.**

The strategic page map is viable, but the current artifacts do not yet prove the accepted RU Hero, complete Connected Journey, full Ways-to-Start action model, or mobile proof disclosures.

Exact next process:

1. correct only the low-fidelity map specification and four SVG maps as required above;
2. keep the accepted ten-block architecture and copy unchanged;
3. record the corrected branch head and four new map blobs;
4. run one focused independent correction review;
5. advance to full-page visual concept comparison only after `ACCEPT`;
6. do not start production YAML, HTML, CSS, JavaScript or a production PR.

---

## 14. Files changed during review

Only this report was changed during the review:

```text
docs/site-evolution/homepage-v2-low-fidelity/03_LOW_FIDELITY_REVIEW_REPORT.md
```

Not changed:

- `01_LOW_FIDELITY_FULL_PAGE_MAP.md`;
- any of the four SVG maps;
- Content Architecture;
- Strategy;
- Homepage;
- Contact;
- Header;
- Footer;
- CSS;
- JavaScript;
- YAML;
- routes;
- assets;
- workflows;
- any production file.

Independent Homepage V2 low-fidelity full-page map review complete. No production files were changed.
