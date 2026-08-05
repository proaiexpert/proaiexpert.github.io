# Homepage V2 Low-Fidelity Map — Final Correction Review Report

**Status:** focused independent visual correction review complete  
**Verdict:** `TARGETED CORRECTION`  
**Repository:** `proaiexpert/proaiexpert.github.io`  
**Branch:** `agent/homepage-v2-low-fidelity-map`  
**Reviewed branch state:** branch tip immediately before this report write; 25 commits ahead of `main`, 0 behind  
**Reviewed branch-head SHA:** not exposed by the available branch-ref connector response; the reviewed tip is the direct parent of this report commit  
**Branch base / merge base:** `7bcc09ae28388f8e4a5e6e5a715aa5ba7b3fbf50`  
**Reviewed map-specification blob:** `3b6669e45fb04bacebf233b79b5a52e2fc51eca2`  
**Review role:** Control / Independent Reviewer

---

## 1. Executive verdict

Все четыре исправленные SVG-карты проверены как отрендеренные визуальные документы: целиком и через увеличенные области Hero, Connected Journey, Ways to Start и Selected Work.

Исправления закрыли основную часть первоначального `TARGETED CORRECTION`:

- desktop Hero теперь показывает expectation copy и accountability line;
- responsive Hero использует полный утверждённый RU-контент, а не сокращённую замену;
- карта `844 × 390` больше не содержит наложения Connected Journey на следующий блок;
- заключение Connected Journey присутствует во всех четырёх картах;
- Ways to Start отдельно показывает contextual review CTA и service links в количестве `1 / 1 / 2`;
- Selected Work теперь структурно разделяет status, disclosure/boundary и project action;
- утверждённый порядок десяти блоков сохранён;
- карты остаются grayscale low-fidelity артефактами и не вводят production-решения.

Однако финальный `ACCEPT` пока невозможен из-за одного существенного responsive-дефекта и двух связанных ограниченных дефектов представления:

1. на отрендеренной карте `320 px` вторая строка утверждённого RU H1 — `Наводим порядок в обращениях.` — выходит за правую границу доступной области и визуально обрезается;
2. в картах `390 px` и `320 px` статусы Alina Horb и Local Repair Pro искусственно разорваны внутри слов (`ОСНОВАТЕ / ЛЕМ`, `РАЗРА / БОТКЕ`), что не демонстрирует реалистичное естественное многострочное размещение;
3. заявленные размеры в corrected map specification не совпадают с фактическими `width` / `height` исправленных SVG.

Эти дефекты не требуют изменения Content Architecture, утверждённого текста, стратегии, десятиблочной архитектуры или трёх уже корректных карт по геометрии. Требуется ещё одна узкая коррекция responsive line breaking и синхронизация map specification.

**Final verdict: `TARGETED CORRECTION`.**

---

## 2. Reviewed branch head and map blobs

### Branch state before report write

- Branch: `agent/homepage-v2-low-fidelity-map`
- Base and merge base: `main` at `7bcc09ae28388f8e4a5e6e5a715aa5ba7b3fbf50`
- State: 25 commits ahead, 0 commits behind
- Scope: documentation workspace and four SVG maps; no Homepage, Contact, Header, Footer or other production file in the branch comparison

The available connector returned the branch comparison and exact file blobs but did not expose the pre-write branch-tip SHA. The reviewed artifact set is therefore locked below by the exact map-specification blob and four SVG blobs. The reviewed branch tip is the direct parent of the commit that writes this report.

### Corrected map specification

```text
docs/site-evolution/homepage-v2-low-fidelity/01_LOW_FIDELITY_FULL_PAGE_MAP.md
blob: 3b6669e45fb04bacebf233b79b5a52e2fc51eca2
```

### Corrected SVG maps

```text
docs/site-evolution/homepage-v2-low-fidelity/maps/homepage-v2-low-fi-1440.svg
blob: 9d60c2321771142b103604f34b965281a8bba075
actual SVG size: 1440 × 5405

docs/site-evolution/homepage-v2-low-fidelity/maps/homepage-v2-low-fi-390.svg
blob: f627dd440d37967c95adfb6052683c1aecb52476
actual SVG size: 390 × 6168

docs/site-evolution/homepage-v2-low-fidelity/maps/homepage-v2-low-fi-320.svg
blob: 8fd28c81b69b151aac6e36951c180589a554f9d5
actual SVG size: 320 × 6428

docs/site-evolution/homepage-v2-low-fidelity/maps/homepage-v2-low-fi-844x390.svg
blob: 98092891902fe23f418dd0bf2a8e7b289cd6d820
actual SVG size: 844 × 4564
```

### Specification-size synchronization issue

The map specification currently declares:

```text
1440 × 5740
390 × 6608
320 × 6978
844 × 5282
```

Those values do not match the actual SVG root dimensions listed above. This does not create the 320 px clipping defect, but the canonical low-fidelity document must be synchronized during the same bounded correction.

---

## 3. Hero fidelity result

**Result: PARTIAL PASS — TARGETED CORRECTION REQUIRED AT 320 PX.**

### Desktop 1440

**PASS.**

The corrected desktop map visibly reserves the accepted Hero sequence:

1. eyebrow;
2. H1;
3. full supporting copy;
4. primary CTA;
5. dedicated expectation-copy field;
6. secondary CTA;
7. accountability line;
8. supplementary system tableau.

The expectation copy is no longer omitted, and the accountability line is explicitly represented.

### Mobile 390

**PASS for Hero order and full-copy fidelity.**

The rendered map shows, in the accepted order:

- full RU eyebrow;
- full RU H1;
- full accepted supporting paragraph;
- primary CTA;
- exact expectation copy;
- secondary CTA;
- accountability line;
- compact system strip.

No Hero copy shortening was introduced.

### Narrow mobile 320

**FAIL — remaining blocking defect.**

The source contains the accepted H1, but the rendered document does not display it completely within the available width. The line:

```text
Наводим порядок в обращениях.
```

extends beyond the right edge and is visibly clipped. Therefore the map does not yet prove that the full accepted RU Hero is viable at `320 px` without horizontal overflow or content loss.

This is a line-breaking and geometry problem, not authorization to rewrite or shorten the H1. The exact words must remain unchanged and be reflowed across additional natural lines.

The accountability line is also extremely tight at `320 px`; it should be reflowed into clean natural lines while preserving the exact accepted wording.

### Short landscape 844 × 390

**PASS.**

The first 390 px viewport contains:

- locked Header;
- full accepted RU eyebrow;
- full RU H1;
- full supporting copy;
- primary CTA.

Expectation copy and the primary CTA are represented without substituting shorter copy. Secondary CTA and accountability remain inside Hero. The system strip follows within the Hero container.

### RU Hero decision

Do not shorten or rewrite the RU Hero. The remaining `320 px` defect must be solved only by natural line wrapping and sufficient vertical space.

---

## 4. Short-landscape containment result

**Result: PASS.**

The prior `844 × 390` collision is resolved.

Verified geometry:

- Hero container: `y=68` through `y=498`;
- system strip: `y=403` through `y=451`, fully inside Hero;
- Connected Journey container: `y=512` through `y=1162`;
- fourth journey step: `y=923` through `y=985`, fully inside Connected Journey;
- conclusion: `y=995` through `y=1087`, fully inside Connected Journey;
- Two Core Directions begins at `y=1176`, after the previous block ends.

No section collision remains. No horizontal poster dependency, sticky rail or viewport-filling requirement is introduced.

---

## 5. Connected Journey conclusion result

**Result: PASS.**

All four maps now include one visible conclusion after exactly four journey steps.

The conclusion preserves the accepted meaning:

- the website shapes the decision before contact;
- automation protects the process after contact;
- both work best as one connected system.

The conclusion is contained inside its owning section at every reviewed size. It is not hover-dependent and does not require animation or JavaScript.

---

## 6. Ways-to-Start action result

**Result: PASS.**

Every map now separates the contextual review CTA from the service-link collection.

Verified counts:

```text
Situation 1: one Website service link
Situation 2: one AI Systems service link
Situation 3: two service links — AI Systems and Websites & Branding
```

The maps preserve three visitor situations rather than pricing packages. No price, tier ranking, feature matrix or “most popular” treatment was introduced.

---

## 7. Selected Work proof-zone result

**Result: STRUCTURAL PASS; TARGETED LINE-BREAK CORRECTION REQUIRED AT 390/320.**

All four maps now provide distinct normal-flow zones for:

1. project status;
2. disclosure or evidence boundary;
3. project action.

Alina Horb and Local Repair Pro remain visually distinguishable by proof taxonomy. The disclosure/boundary is not placed in a tooltip, overlay or hover state.

At `320 px`, the disclosure containers have meaningful multi-line height, so the structural correction is successful.

However, the visible status text in the `390 px` and `320 px` maps is manually split inside words:

```text
ОСНОВАТЕ / ЛЕМ
РАЗРА / БОТКЕ
```

This is not realistic natural wrapping and should not become the basis for visual-concept typography decisions. The exact approved statuses must remain unchanged but be broken only at word boundaries, for example by using additional lines and/or slightly more status height.

No proof-status wording change is authorized.

---

## 8. Ten-block and collateral-scope result

**Result: PASS.**

Every corrected map retains the accepted order:

1. Hero;
2. Connected Journey;
3. Two Core Directions;
4. Financial Stream;
5. Ways to Start;
6. Controlled Delivery;
7. Founder;
8. Selected Work;
9. Insights;
10. Final Private Review.

The relative commercial hierarchy remains intact:

- Financial Stream is still the dominant proof block;
- Ways to Start follows proof;
- Process and Founder remain secondary risk-reduction blocks;
- Insights remain subordinate;
- final conversion introduces no new service argument.

The corrections remain low fidelity and grayscale. No final colors, typography, imagery, motion, component system or production behavior was approved.

No Content Architecture, Strategy, Homepage, Contact, Header, Footer, YAML, HTML, CSS, JavaScript, route, workflow or production file was changed as part of the map correction scope reviewed here.

---

## 9. Remaining blocking defects and exact permitted correction scope

One additional bounded map correction is required.

### Correction 1 — Reflow the 320 px Hero without changing copy

In:

```text
docs/site-evolution/homepage-v2-low-fidelity/maps/homepage-v2-low-fi-320.svg
```

- keep the exact accepted RU H1;
- split the H1 across enough natural lines so no line clips or exceeds the available width;
- preserve the accepted Hero order;
- reflow the accountability line naturally;
- increase Hero height and move following blocks only as needed;
- preserve the `640 px` fold marker as a measurement reference;
- do not reduce font size to an unrealistic value merely to force one line;
- do not shorten or rewrite any RU copy.

### Correction 2 — Use natural status line breaks

In:

```text
docs/site-evolution/homepage-v2-low-fidelity/maps/homepage-v2-low-fi-390.svg
docs/site-evolution/homepage-v2-low-fidelity/maps/homepage-v2-low-fi-320.svg
```

- keep the exact approved Alina Horb and Local Repair Pro statuses;
- remove line breaks inside words;
- provide additional status lines or height as needed;
- retain separate disclosure/boundary and action zones.

### Correction 3 — Synchronize map specification

In:

```text
docs/site-evolution/homepage-v2-low-fidelity/01_LOW_FIDELITY_FULL_PAGE_MAP.md
```

- update declared SVG dimensions after the final responsive correction;
- do not change strategy, accepted content or correction scope.

The following files do not require further content or geometry correction from this review:

```text
docs/site-evolution/homepage-v2-low-fidelity/maps/homepage-v2-low-fi-1440.svg
docs/site-evolution/homepage-v2-low-fidelity/maps/homepage-v2-low-fi-844x390.svg
```

After the bounded correction, perform one final focused check of the corrected `320 px` Hero, the `390/320` status wrapping, actual SVG dimensions and changed-file scope.

---

## 10. Readiness for visual-concept comparison

**Status: NOT READY.**

Visual-concept comparison remains blocked until:

1. the complete RU H1 is visibly contained at `320 px`;
2. the accountability line is naturally contained at `320 px`;
3. Selected Work statuses wrap only at word boundaries at `390 px` and `320 px`;
4. the map specification records the actual final SVG sizes;
5. a final focused independent review returns `ACCEPT`.

All other original low-fidelity correction groups are accepted and should not be reopened.

This verdict does not authorize visual concepts, YAML, HTML, CSS, JavaScript, production implementation or a production PR.

---

## 11. Files changed during review

Only this file was changed during the focused independent review:

```text
docs/site-evolution/homepage-v2-low-fidelity/05_LOW_FIDELITY_FINAL_REVIEW_REPORT.md
```

Not changed:

- four corrected SVG maps;
- map specification;
- original low-fidelity report;
- correction-review task;
- Content Architecture;
- Strategy;
- Homepage;
- Contact;
- Header;
- Footer;
- any production file.

Focused Homepage V2 low-fidelity correction review complete. No production files were changed.
