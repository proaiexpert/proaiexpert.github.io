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
## ProAI Expert - Iteration vNext #3

Date: 2026-03-14

### Scope
Global premium polish pass across the site: design-system consistency, exclusivity layer, premium micro-interactions, diagram standardization, and selective copy cleanup without URL or SEO mapping changes.

### Edited files
- assets/css/site.css
- assets/diagrams/ops-layer.svg
- assets/diagrams/case-flow.svg
- assets/diagrams/console-map.svg
- assets/icons/icon-launch.svg
- assets/icons/icon-reporting.svg
- assets/icons/icon-ux.svg
- index.html
- ru/index.html
- solutions/index.html
- ru/solutions/index.html
- solutions/ai-systems/index.html
- ru/solutions/ai-systems/index.html
- solutions/website-systems/index.html
- ru/solutions/website-systems/index.html
- process/index.html
- ru/process/index.html
- case-studies/financial-stream/index.html
- case-studies/proai-expert/index.html
- ru/case-studies/financial-stream/index.html
- ru/case-studies/proai-expert/index.html
- Multiple HTML files updated to refresh the CSS cache version to `site.css?v=20260314g`

### Icons and diagrams added
- Added custom SVG icons:
  - `assets/icons/icon-launch.svg`
  - `assets/icons/icon-reporting.svg`
  - `assets/icons/icon-ux.svg`
- Added flat SVG diagrams:
  - `assets/diagrams/ops-layer.svg`
  - `assets/diagrams/case-flow.svg`
- Updated existing diagram copy in:
  - `assets/diagrams/console-map.svg`

### Components standardized
1. Design system consistency
- Standardized buttons, cards, tags, forms, diagram cards, and article-support blocks around the shared token layer.
- Kept the site on two radii and two shadow levels.
- Tightened spacing and border rhythm across section heads, cards, and footer blocks.

2. Premium micro-interactions
- Added hover/focus polish for:
  - cards
  - buttons
  - tags
  - diagram/media blocks
- Added subtle diagram reveal treatment.
- Added `prefers-reduced-motion` fallback to disable animation and transitions for reduced-motion users.

3. Header and footer polish
- Refined sticky header treatment with lighter backdrop, border, and top shadow.
- Kept the ProAI CTA visually distinct from Financial Stream.
- Tightened footer typography, spacing, and structure to feel more studio-like.

4. Page-level premium layer
- Added the operations diagram to AI Systems pages.
- Added case-flow diagram/proof treatment to case-study pages.
- Expanded EN case-study pages with deliverables/proof blocks to match the newer RU depth.

### Copy changes
- Replaced visible `iteration` language in user-facing EN copy with:
  - `continuous improvement`
  - `next-step plan`
- Replaced visible RU `итерация` language in key sections with:
  - `улучшения`
  - `следующий шаг`
  - `план доработок`
- Cleaned obvious RU/EN mixed terminology on key case and solution surfaces so AI Systems and Website Systems read as distinct offers.

### Verification
- Internal href check: `0 broken internal links`
- Canonical/hreflang structure check: `OK`
- RU/EN language-switch pairs reviewed on:
  - Home EN/RU
  - AI Systems EN/RU
  - Website Systems EN/RU
  - Financial Stream case EN/RU
  - ProAI Expert case EN/RU
  - 2 paired insight articles EN/RU
- No URL or directory structure changes
- No sitemap changes

### Notes
- This pass prioritizes premium consistency and stability over aggressive redesign.
- A few longer RU editorial pages still have room for another pure copy-editing pass, but core structure, UX, SEO mapping, and premium visual layer are now aligned.

## ProAI Expert - Master Iteration: Two Worlds + Premium Proof

Date: 2026-03-14

### Scope
Global pass to separate the AI world and Web world more clearly on Home, deepen both solution pages, upgrade the case-studies index into a more portfolio-like surface, and make the Process page more symmetric, while preserving URLs and SEO mapping.

### Edited files
- assets/css/site.css
- assets/diagrams/ai-motif.svg
- assets/diagrams/web-motif.svg
- assets/screenshots/README.md
- index.html
- ru/index.html
- case-studies/index.html
- ru/case-studies/index.html
- process/index.html
- ru/process/index.html
- solutions/website-systems/index.html
- ru/solutions/website-systems/index.html
- solutions/ai-systems/index.html
- ru/solutions/ai-systems/index.html

### Icons and diagrams added
- Added flat SVG background motifs:
  - assets/diagrams/ai-motif.svg
  - assets/diagrams/web-motif.svg
- Reused existing flat SVG diagrams:
  - assets/diagrams/ops-layer.svg
  - assets/diagrams/web-system.svg

### Components standardized
- Added shared premium components/styles for:
  - Two-world panels
  - BrowserFrame
  - PhoneFrame
  - Portfolio-style case cards
  - Symmetric process cards
  - AI systems cards and controls blocks
  - Website showcase cards
- Kept the same token system, two radii, and two shadow levels.

### Changes made
1. Home: Two Worlds
- Replaced the simpler pillar presentation with two large world panels in EN and RU.
- AI panel now uses the ops diagram and operations-first copy.
- Web panel now uses BrowserFrame + PhoneFrame mock visuals and stronger web-studio selling copy.
- No visible 60/40 or primary/secondary labels remain.

2. Case Studies index upgrade
- Reworked EN and RU case index cards into more visual portfolio-style cards.
- Added BrowserFrame thumbnail areas.
- Added tags, result summaries, and two buttons:
  - Open case
  - Live site
- Existing case page URLs stayed unchanged.

3. Process page layout
- Rebuilt EN and RU Process pages into a more compact, symmetric card layout.
- Step index placement is consistent.
- Step cards now share the same structural rhythm and min-height behavior.
- Reduced excessive top whitespace by using a tighter process hero.

4. Website Systems page depth
- Strengthened H1 and positioning in EN and RU.
- Kept packages, care plans, two ways to work, and add-ons.
- Added a dedicated project showcase block using BrowserFrame + PhoneFrame mock slots.
- Added screenshot TODO references tied to the expected files in assets/screenshots.

5. AI Systems page depth
- Added a stronger “Systems we build” layer.
- Added a dedicated controls & safety block.
- Strengthened the console section and kept the operational framing clear.

6. Exclusivity layer
- Added subtle AI and Web SVG motifs.
- Added reusable BrowserFrame and PhoneFrame components.
- Preserved reduced-motion support through existing prefers-reduced-motion handling.

### Screenshot TODO list
Expected future files in /assets/screenshots/:
- financial-stream/home-desktop.png
- financial-stream/service-desktop.png
- financial-stream/editorial-desktop.png
- financial-stream/home-mobile.png
- proai-expert/home-desktop.png
- proai-expert/solutions-desktop.png
- proai-expert/home-mobile.png

### Verification
- Internal link check: OK, 0 broken internal links
- Canonical count on key pages: 1 per page
- hreflang verified on:
  - Home EN/RU
  - Website Systems EN/RU
  - AI Systems EN/RU
  - Case Studies index EN/RU
  - Process EN/RU
- No URL or directory structure changes
- No sitemap URL changes

### Notes
- This pass focused on the core presentation layer and paired EN/RU key surfaces.
- Existing case-study detail pages, insights pages, and contact page structure were left intact unless needed for shared styling consistency.
