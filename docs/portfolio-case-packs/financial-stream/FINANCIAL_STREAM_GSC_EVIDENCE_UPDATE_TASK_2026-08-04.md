# TASK — UPDATE FINANCIAL STREAM GOOGLE SEARCH CONSOLE EVIDENCE

**Status:** Approved evidence update specification · Implementation not started  
**Prepared:** August 4, 2026  
**Repository:** `proaiexpert/proaiexpert.github.io`  
**Base SHA reviewed:** `7a762141a4b14bdaa4d0239fadebbd63f618070d`

## 1. Objective

Replace the currently published Financial Stream three-month Google Search Console performance snapshot with the stronger, newer six-month snapshot supplied on August 4, 2026, while preserving evidence accuracy, EN/RU parity, responsive quality, current routes, and the separate July indexing snapshot.

The new screenshot visibly supports:

- selected period: **6 months**;
- search type: **Web**;
- total clicks: **57**;
- total impressions: **7.24K**;
- average CTR: **0.8%**;
- average position: **35.2**;
- capture date supplied by the owner: **August 4, 2026**.

## 2. Evidence interpretation

### Safe claims

- 57 organic clicks in the selected six-month Google Search Console window;
- 7.24K search impressions in the same selected window;
- 0.8% average CTR;
- 35.2 average position;
- the later portion of the visible impressions graph is generally higher than much of the earlier portion;
- the screenshot is a dated visibility snapshot.

### Claims that remain prohibited

Do not state or imply:

- threefold traffic growth;
- a precise period-over-period growth percentage;
- lead growth;
- conversion growth;
- revenue growth;
- SEO ROI;
- a guaranteed ranking;
- guaranteed future performance;
- that 7.24K impressions are visits or clicks.

The previous three-month and new six-month windows overlap and are not a controlled comparison report. The new screenshot is stronger cumulative evidence, but it is not a valid basis for a precise growth-rate claim.

## 3. Repository audit result

### 3.1 Production pages requiring changes

#### English Financial Stream case

`case-studies/financial-stream/index.html`

Change two current areas:

1. Chapter 02 proof strip:
   - current: `Dated search evidence · July 2026`;
   - replace with: `Dated search evidence · August 2026`.

2. Chapter 11 verified outcomes:
   - replace the current three-month 19-click / 4.17K-impression record;
   - add the new responsive evidence screenshot;
   - retain the separate 51-indexed-page record unless a newer indexing screenshot is supplied and approved;
   - strengthen the limitation text to distinguish cumulative visibility from controlled growth.

#### Russian Financial Stream case

`ru/case-studies/financial-stream/index.html`

Change the equivalent two areas:

1. Chapter 02 proof strip:
   - current: `Датированные поисковые данные · июль 2026`;
   - replace with: `Датированные поисковые данные · август 2026`.

2. Chapter 11 verified outcomes:
   - replace the current 19-click / 4.17K-impression record with the new six-month evidence;
   - add the same evidence image with independent Russian alt text and caption;
   - retain the separate 51-page indexing record;
   - preserve equivalent limitations in natural Russian.

### 3.2 Public repository presentation requiring synchronization

#### Main company repository README

`README.md`

Update `Verified project signals` from:

- 19 organic clicks;
- approximately 4.17K impressions;
- July 2026 review;

To the approved August 4 snapshot while keeping the separate 51-page indexing fact clearly dated as a different snapshot.

#### GitHub profile README

Repository: `proaiexpert/proaiexpert`  
File: `README.md`

Apply the same evidence wording so the public profile and company repository do not contradict the case study.

This requires a separate branch and PR in `proaiexpert/proaiexpert` after the website-repository change is ready.

### 3.3 Internal evidence records requiring extension

Update these as evidence-governance records, not as public marketing pages:

- `docs/portfolio-case-packs/financial-stream/EVIDENCE_INDEX.md`
- `docs/portfolio-case-packs/financial-stream/SCREENSHOT_MANIFEST.md`
- `docs/portfolio-case-packs/financial-stream/EVIDENCE_DERIVATIVES_MANIFEST.md`

Add the new August 4 evidence as a new entry. Do not overwrite or delete the historical July/June evidence entries.

### 3.4 Historical documents

Repository search also finds old 19-click evidence in historical planning and source documents, including:

- `docs/portfolio-case-packs/financial-stream/CASE_V2_BUILD_TASK.md`
- `docs/portfolio-case-packs/financial-stream/CASE_V2_MASTER_BRIEF.md`
- `docs/portfolio-case-packs/financial-stream/CASE_PACK_PART_3_EVIDENCE_AND_FRAMING.md`

Do not silently rewrite historical snapshot values. They document the evidence available when those documents were prepared.

Where a historical document is still used as an active implementation instruction, add a short notice near the old evidence section:

> Historical snapshot retained for audit history. Current public performance evidence is the August 4, 2026 six-month snapshot documented in `FINANCIAL_STREAM_GSC_EVIDENCE_UPDATE_TASK_2026-08-04.md`.

### 3.5 No other production-page occurrence found

The repository audit did not find the old 19-click / 4.17K performance claim on the homepage, service pages, case-study archive, or insight pages. Do not broaden the implementation beyond the verified locations without a fresh repository search immediately before the change.

## 4. Approved public copy

## 4.1 English case copy

### Chapter 02 proof strip

```text
Dated search evidence · August 2026
```

### Evidence label

```text
GOOGLE SEARCH CONSOLE · SELECTED 6-MONTH WINDOW · CAPTURED AUGUST 4, 2026
```

### Evidence value

```text
57 clicks · 7.24K impressions
```

### Supporting sentence

```text
In the selected six-month Google Search Console window captured on August 4, 2026, Financial Stream recorded 57 organic clicks and 7.24K search impressions. The same snapshot shows a 0.8% average CTR and a 35.2 average position.
```

### Source rail

```text
Google Search Console · Web search · Selected six-month window · Captured August 4, 2026
```

### Image caption

```text
Financial Stream Google Search Console performance snapshot with the six-month filter selected. The screenshot is dated evidence of search visibility, not proof of leads, revenue, or a controlled growth rate.
```

### Updated limitation

```text
These are dated search-visibility and indexing snapshots. The six-month screenshot is cumulative evidence and is not a controlled comparison against the preceding period. It does not prove lead growth, conversion improvement, revenue, SEO ROI, guaranteed rankings, or future performance.
```

## 4.2 Russian case copy

### Chapter 02 proof strip

```text
Датированные поисковые данные · август 2026
```

### Evidence label

```text
GOOGLE SEARCH CONSOLE · ВЫБРАННЫЙ ПЕРИОД 6 МЕСЯЦЕВ · СНИМОК ОТ 4 АВГУСТА 2026 ГОДА
```

### Evidence value

```text
57 кликов · 7,24 тыс. показов
```

### Supporting sentence

```text
За выбранный шестимесячный период Google Search Console, зафиксированный 4 августа 2026 года, сайт Financial Stream получил 57 переходов из органического поиска и 7,24 тыс. показов. На том же снимке указаны средний CTR 0,8% и средняя позиция 35,2.
```

### Source rail

```text
Google Search Console · Веб-поиск · Выбранный период 6 месяцев · Снимок от 4 августа 2026 года
```

### Image caption

```text
Снимок эффективности Financial Stream в Google Search Console с выбранным периодом шесть месяцев. Это датированное подтверждение поисковой видимости, а не доказательство количества обращений, выручки или точного темпа роста.
```

### Updated limitation

```text
Это датированные показатели поисковой видимости и индексирования. Шестимесячный снимок показывает накопленные данные и не является контролируемым сравнением с предыдущим периодом. Он не подтверждает рост обращений, конверсии, выручки, SEO ROI, гарантированные позиции или будущий результат.
```

## 4.3 Main repository README copy

Replace the current `Verified project signals` block with:

```markdown
## Verified project signals

Financial Stream includes a Google Search Console performance snapshot captured August 4, 2026, plus a separate July indexing snapshot:

- **57 organic clicks** in the selected six-month window;
- **7.24K search impressions** in the same window;
- **0.8% average CTR** and **35.2 average position** in that snapshot;
- **51 indexed pages** at the separate July 9, 2026 indexing snapshot;
- no claim that these visibility signals alone prove leads, conversion growth, revenue, SEO ROI, guaranteed rankings, or future performance.

Full evidence and limitations are documented in the [Financial Stream case study](https://proai-expert.com/case-studies/financial-stream/).
```

## 4.4 GitHub profile README copy

Replace the current `Verified project signal` block with:

```markdown
## Verified project signal

The Financial Stream case includes a Google Search Console performance snapshot captured August 4, 2026, plus a separate July indexing snapshot:

- **57 organic clicks** in the selected six-month window;
- **7.24K search impressions** in the same window;
- **0.8% average CTR** and **35.2 average position** in that snapshot;
- **51 indexed pages** at the separate July 9, 2026 indexing snapshot;
- no claim that these visibility signals alone prove leads, conversion growth, revenue, SEO ROI, guaranteed rankings, or future performance.

The full evidence and limitations are documented in the [Financial Stream case study](https://proai-expert.com/case-studies/financial-stream/).
```

## 5. Image preparation specification

## 5.1 Supplied source

- source type: PNG screenshot;
- original dimensions: `2048 × 1103`;
- original file size: `312,596 bytes`;
- visible content: Performance header, six-month selector, Web search type, all four metrics, and daily graph;
- no visible account name, email address, property selector, or client personal data.

## 5.2 Public crop

Crop only the outer blank margin and right-side browser scrollbar.

Preserve:

- `Performance` title;
- selected `6 months` control;
- `Search type: Web`;
- 57 clicks;
- 7.24K impressions;
- 0.8% CTR;
- 35.2 average position;
- complete visible chart area;
- `Last update` line where naturally retained by the crop.

Do not:

- remove or replace metrics;
- redraw the graph;
- add arrows, highlights, badges, or marketing labels inside the screenshot;
- sharpen so aggressively that text develops halos;
- alter colors;
- crop away the selected period.

## 5.3 File set

### Internal cropped master

```text
docs/portfolio-case-packs/financial-stream/evidence/07-gsc-performance-6-months-2026-08-04-master.png
```

Target:

- dimensions approximately `1865 × 1062`;
- lossless PNG;
- retain as evidence master;
- not loaded by production HTML.

### Web derivatives

```text
assets/img/cases/financial-stream/evidence/fs-gsc-performance-6-months-2026-08-04-640.webp
assets/img/cases/financial-stream/evidence/fs-gsc-performance-6-months-2026-08-04-1120.webp
assets/img/cases/financial-stream/evidence/fs-gsc-performance-6-months-2026-08-04-1845.webp
```

Target budgets:

| File | Target dimensions | Maximum preferred size |
|---|---:|---:|
| 640 | `640 × 364` | 30 KB |
| 1120 | `1120 × 638` | 60 KB |
| 1845 | `1845 × 1051` | 100 KB |

Use WebP quality approximately 86–90 with high-quality Lanczos resizing. Verify text readability after compression.

## 5.4 Approved alt text

### English

```text
Google Search Console Performance report for Financial Stream with the six-month filter selected, showing 57 clicks, 7.24K impressions, 0.8% average CTR, 35.2 average position, and the daily performance graph.
```

### Russian

```text
Отчёт Google Search Console по эффективности Financial Stream с выбранным периодом шесть месяцев: 57 кликов, 7,24 тыс. показов, средний CTR 0,8%, средняя позиция 35,2 и график по дням.
```

## 6. Recommended markup structure

Do not force the wide screenshot into either existing evidence card. Add one full-width evidence figure above the two evidence cards inside the right side of the outcomes grid.

Recommended structure:

```html
<div class="evidence-column">
  <figure class="gsc-evidence">
    <div class="gsc-evidence__media">
      <picture>
        <source
          type="image/webp"
          srcset="
            /assets/img/cases/financial-stream/evidence/fs-gsc-performance-6-months-2026-08-04-640.webp 640w,
            /assets/img/cases/financial-stream/evidence/fs-gsc-performance-6-months-2026-08-04-1120.webp 1120w,
            /assets/img/cases/financial-stream/evidence/fs-gsc-performance-6-months-2026-08-04-1845.webp 1845w"
          sizes="(min-width: 1200px) min(58vw, 980px), (min-width: 768px) calc(100vw - 80px), calc(100vw - 36px)">
        <img
          src="/assets/img/cases/financial-stream/evidence/fs-gsc-performance-6-months-2026-08-04-1120.webp"
          width="1865"
          height="1062"
          loading="lazy"
          decoding="async"
          alt="LANGUAGE-SPECIFIC ALT TEXT">
      </picture>
    </div>
    <figcaption>
      <span>LANGUAGE-SPECIFIC CAPTION</span>
      <small>LANGUAGE-SPECIFIC SOURCE RAIL</small>
      <a href="/assets/img/cases/financial-stream/evidence/fs-gsc-performance-6-months-2026-08-04-1845.webp">Open full evidence image</a>
    </figcaption>
  </figure>

  <div class="evidence-records effect-source-lock">
    <!-- Updated performance record -->
    <!-- Existing separate indexing record -->
  </div>
</div>
```

Russian link text:

```text
Открыть изображение в полном размере
```

## 7. CSS requirements

Add only scoped selectors in `assets/css/case-financial-stream-v2.css` or a narrowly scoped case-specific patch file.

Required behavior:

```css
.evidence-column {
  min-width: 0;
  display: grid;
  gap: 24px;
}

.gsc-evidence {
  min-width: 0;
  margin: 0;
}

.gsc-evidence__media {
  overflow: hidden;
  border: 1px solid rgba(146, 202, 218, .28);
  border-radius: 18px;
  background: #eef3f8;
  box-shadow: 0 26px 68px rgba(0, 0, 0, .19);
}

.gsc-evidence img {
  width: 100%;
  height: auto;
  object-fit: contain;
}
```

Use the existing figcaption visual language. Do not create a new global image system.

Mobile requirements:

- no fixed height;
- no `object-fit: cover`;
- no cropped metric cards;
- image must remain `width: 100%; height: auto`;
- the full-resolution link must remain keyboard and touch accessible;
- no horizontal overflow;
- do not use a CSS background image for evidence.

## 8. Implementation sequence

1. Fetch current `main` SHA and open PRs again.
2. Create a dedicated feature branch from current `main`.
3. Preserve the supplied original screenshot outside the public web path.
4. Create cropped PNG master and three WebP derivatives.
5. Record dimensions, byte sizes, SHA-256 values, capture date, and safe-use note.
6. Update `EVIDENCE_INDEX.md` with a new row; keep the old row.
7. Update `SCREENSHOT_MANIFEST.md` and `EVIDENCE_DERIVATIVES_MANIFEST.md`.
8. Add the full-width evidence figure to EN Chapter 11.
9. Add the same figure with independent Russian text to RU Chapter 11.
10. Replace the old performance copy in both pages.
11. Update Chapter 02 date labels in both pages.
12. Update `README.md` in the company repository.
13. In a separate PR, update `proaiexpert/proaiexpert/README.md`.
14. Search again for stale public occurrences of:
    - `19 clicks`;
    - `19 кликов`;
    - `4.17K`;
    - `4,17 тыс.`;
    - `3 MONTHS` in the current performance record;
    - `3 МЕСЯЦА` in the current performance record;
    - `Dated search evidence · July 2026`;
    - `Датированные поисковые данные · июль 2026`.
15. Do not globally replace unrelated July dates.
16. Run responsive and content QA.
17. Open a focused PR with before/after screenshots and exact evidence wording.
18. Merge only after review confirms EN/RU parity and no layout regression.

## 9. Responsive QA matrix

### Desktop and laptop

- `1920 × 1080`
- `1600 × 900`
- `1440 × 900`
- `1366 × 768`

Verify:

- evidence image is sharp at normal zoom;
- right column remains within the outcomes grid;
- image and cards have consistent spacing;
- cards do not overlap the image;
- the section does not become visually unbalanced;
- no horizontal overflow.

### Tablet portrait and landscape

- `768 × 1024`
- `1024 × 768`

Verify:

- outcomes grid collapses cleanly to one column under existing breakpoint behavior;
- image uses full available width;
- metric text remains recognizable;
- evidence cards remain readable;
- image link is easy to tap.

### Mobile portrait

- `390 × 844`
- `375 × 812`
- `360 × 800`
- `320 × 568`

Verify:

- no clipping of 57, 7.24K, CTR, or average position;
- no fixed-height crop;
- image does not cause side scrolling;
- captions wrap naturally;
- cards stack as currently designed;
- full-image link opens the 1845px derivative;
- no layout shift caused by missing intrinsic dimensions.

### Mobile landscape and low-height

- `844 × 390`
- `667 × 375`
- `568 × 320`

Verify:

- full screenshot remains visible without forced crop;
- no sticky-navigation overlap;
- evidence image does not create page-width overflow;
- captions and limitation remain readable.

## 10. Functional and accessibility QA

- one H1 remains unchanged per page;
- canonical and reciprocal `hreflang` remain unchanged;
- EN/RU language switch remains correct;
- sitemap remains unchanged because routes do not change;
- image paths return `200`;
- alt text is language-specific;
- `<figure>` and `<figcaption>` remain semantically connected;
- full-image link has visible focus;
- evidence remains readable with JavaScript disabled;
- reduced-motion behavior is unaffected;
- no console errors;
- no missing assets;
- no cumulative layout shift from the evidence image;
- no personal or account-identifying data is introduced.

## 11. Regression boundaries

Do not change:

- global header or footer systems;
- navigation routes;
- case-study chapter order;
- Financial Stream testimonial;
- automation status labels;
- the separate indexing record unless newer evidence is supplied;
- homepage Financial Stream presentation;
- site-wide typography or color tokens;
- SEO titles, descriptions, canonical URLs, or sitemap routes;
- any client claim unrelated to this evidence update.

## 12. PR requirements

The implementation PR must include:

1. exact base SHA;
2. list of modified HTML, CSS, README, manifest, and image files;
3. original and derivative image dimensions and byte sizes;
4. EN and RU before/after copy;
5. desktop, tablet, mobile portrait, and mobile landscape screenshots;
6. confirmation that old historical evidence was retained;
7. confirmation that stale public metrics were removed from current presentation;
8. confirmation that the 51-page indexing record remains a separate July snapshot;
9. accessibility and responsive QA results;
10. rollback instructions.

## 13. Rollback

Rollback is limited and reversible:

- revert the implementation PR;
- restore the previous Chapter 02 labels and Chapter 11 performance card;
- remove only the newly added August evidence assets and manifest entries;
- do not remove historical June/July evidence files;
- verify EN/RU case routes and README presentation after rollback.

## 14. Acceptance criteria

The task is complete only when:

- EN and RU Financial Stream case pages display the August 4 six-month evidence;
- the screenshot is responsive and sharp across the full QA matrix;
- the public case copy states 57 clicks and 7.24K impressions accurately;
- CTR 0.8% and average position 35.2 are stated only as snapshot values;
- no exact growth percentage is claimed;
- the 51-page indexing snapshot remains separately dated;
- the main repository README is synchronized;
- the GitHub profile README is synchronized through a separate PR;
- internal evidence manifests preserve both historical and current evidence;
- no routes, canonical tags, `hreflang`, forms, navigation, or unrelated sections regress.
