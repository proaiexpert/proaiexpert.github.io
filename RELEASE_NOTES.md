# RELEASE NOTES

## ProAI Expert — Iteration vNext #1

Date: 2026-03-14

### Scope
Home page polish without URL changes or SEO mapping regressions.

### Edited files
- assets/css/site.css
- index.html
- ru/index.html
- process/index.html
- ru/process/index.html
- solutions/ai-systems/index.html
- ru/solutions/ai-systems/index.html
- insights/how-much-does-a-website-cost-2026.html
- ru/insights/skolko-stoit-sozdat-sait-v-2026.html
- Multiple HTML files updated only to refresh the CSS cache version to `site.css?v=20260314e`

### Changes made
1. Home pillar labels
- Removed visible `60% / 40%` labels from Home pillar tiles in EN and RU.
- Replaced them with neutral labels:
  - EN: `AI systems`, `Website systems`
  - RU: `AI-системы`, `Сайт-системы`

2. Home pillar micro-interactions
- Added hover and focus-visible treatment for pillar tiles:
  - `translateY(-3px)`
  - stronger shadow
  - accent-specific border/glow
  - animated corner highlight and subtle accent wash
- AI card uses `--accent-ai`
- Website card uses `--accent-web`

3. Website Systems pillar copy
- Rewrote the EN and RU Website Systems pillar to sell more clearly.
- Added explicit mention of:
  - full website builds of any complexity
  - branding/logo as add-on or done-for-you
  - content production and SEO publishing
  - care plans after launch
- Reworked bullets toward buyer outcomes:
  - trust
  - conversion path
  - mobile/speed discipline
  - post-launch care

4. Terminology cleanup
- Replaced visible EN `iteration` phrasing with:
  - `continuous improvement`
  - `next-step plan`
- Replaced visible RU `итерация` phrasing with:
  - `улучшения`
  - `план следующего шага`
  - `план доработок`

5. Cache refresh
- Updated stylesheet references to `site.css?v=20260314e` so the visual/CSS changes deploy cleanly.

### Verification
- Internal href check: `0 broken internal href targets found`
- RU/EN language switch verified on:
  - Home EN/RU
  - AI Systems EN/RU
  - Website Systems EN/RU
- No URL or directory structure changes
- No canonical/hreflang changes
- No sitemap changes

### Notes
- Some additional HTML files changed only because the CSS version query string was refreshed.
- No internal link slugs were changed.

## ProAI Expert - Iteration vNext #2

Date: 2026-03-14

### Scope
Deepen the Website Systems solution page so it feels like a dedicated web studio world in EN and RU, without changing URLs or SEO mapping.

### Edited files
- assets/css/site.css
- solutions/website-systems/index.html
- ru/solutions/website-systems/index.html

### Changes made
1. Website Systems page depth
- Added a premium hero composition with a website-system stack diagram.
- Reused the existing diagram asset:
  - `assets/diagrams/web-system.svg`

2. Packages preview
- Added 3 package cards on EN and RU pages:
  - Starter
  - Business Website System / Бизнес-сайт как система
  - Premium Build / Премиальная сборка

3. Care plans preview
- Added 3 care-plan cards:
  - Care Basic
  - Care Plus
  - Care Pro

4. Two ways to work
- Added a dedicated two-path block:
  - Client-ready / По готовым материалам
  - Done-for-you brand + website / Под ключ: бренд + сайт

5. Add-ons / outsource block
- Added a specific outsource/add-ons section covering:
  - logo
  - mini brand kit
  - business card / collateral
  - content pack
  - SEO publishing

6. Featured proof
- Added a Financial Stream proof block with 3 screenshot slots.
- Since screenshots were not present in the repo, used placeholders with explicit TODO labels.

7. Bottom internal linking
- Added links to:
  - Case Studies
  - Contact
  - 2 relevant Insights posts

8. Styling
- Added Website Systems specific styling in `site.css` for:
  - web-world hero layout
  - diagram card treatment
  - featured/default package emphasis
  - care-plan cards
  - proof placeholder grid
  - responsive behavior for the new sections

9. Cache refresh
- Updated the Website Systems pages to `site.css?v=20260314f`.

### Verification
- Website Systems page URLs unchanged
- Canonical and hreflang unchanged
- EN/RU language switch preserved on paired Website Systems pages
- Internal links on the EN/RU Website Systems pages checked after the update

### Notes
- No sitemap changes
- No directory changes
- Proof screenshots are placeholders until real Financial Stream captures are added
