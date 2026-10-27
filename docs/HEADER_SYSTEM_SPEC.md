# Header System Specification

Status: Canonical architecture and migration specification

Repository: `proaiexpert/proaiexpert.github.io`

Baseline: `73a9a437f944a2551e68081c73a85df58c8bc5fa`

Related specification: `docs/FOOTER_SYSTEM_SPEC.md`

## 1. Purpose

The Header System exists to make every public page use one recognizable, accessible and maintainable ProAI Expert header. New pages must not recreate header markup, styling or mobile behavior independently.

This specification preserves the current visual identity. It authorizes standardization and technical cleanup, not a visual redesign.

## 2. Executive conclusion

The site already has a strong common visual header, but it is not yet a single source component.

Current implementation combines:

- manually copied header markup in standalone HTML pages;
- homepage snapshot markup;
- article and Insights include chains;
- shared `assets/css/global-header-parity-v2.css`;
- inline page-level header CSS;
- shared and page-specific mobile JavaScript;
- multiple historical mobile/header override generations.

`global-header-parity-v2.css` normalizes many pages, but it does not eliminate duplicated markup or conflicting inline rules. Therefore future pages can still introduce a white language link, different alignment, missing cube animation or inconsistent mobile behavior.

Decision: create one build-time Header component and migrate page families in controlled packages.

## 3. Canonical visual contract

The current design is retained.

Required identity:

- dark translucent fixed header;
- subtle bottom border and backdrop blur;
- rotating cyan wireframe cube;
- `PROAI` in white and `EXPERT` in cyan;
- primary navigation in a consistent order;
- active navigation state in cyan;
- EN/RU language switch in cyan, never plain white;
- commercial CTA where the page family requires it;
- mobile hamburger with one interaction model.

No page may invent a visually separate header without an approved update to this specification.

## 4. One Header family, controlled variants

Unlike the footer, the header uses one family.

Approved variants:

- `standard` — homepage, About, AI Systems, Websites & Branding, Contact, Case Studies and Insights hub;
- `article` — compact contextual state for articles, while retaining the same logo, language control, menu structure and interaction behavior;
- `utility` — minimal 404/future system pages, retaining brand, locale and menu where applicable.

Variants may change only approved density or CTA visibility. They must not change element order, logo construction, language color, mobile menu behavior or accessibility contract.

## 5. Verified current inventory

### 5.1 Shared normalization layer

`assets/css/global-header-parity-v2.css` defines:

- `.global-header` fixed position, 85px height, blur and border;
- `.header-container` max width and horizontal padding;
- `.logo-block`, `.logo-text`, navigation, actions and language styles;
- cyan active/hover states;
- mobile menu toggle;
- RU menu breakpoint at 1200px;
- EN menu breakpoint at 1100px;
- reduced-motion transition handling.

This is useful as a migration baseline but is not a complete component system.

### 5.2 Standalone commercial pages

Representative pages such as:

- `/about/` and `/ru/about/`;
- `/contact/` and `/ru/contact/`;
- `/ai-systems/` and `/ru/ai-systems/`;
- `/websites-branding/` and `/ru/websites-branding/`;

contain full or substantial copied header markup and inline CSS. The About page, for example, independently defines `header`, cube markup/animation, logo text, navigation, language control, CTA and mobile toggle before shared parity CSS is applied.

### 5.3 Homepage

Homepage EN/RU are assembled from snapshot includes and wrapper transformations. Header behavior remains coupled to the snapshot architecture and several shared mobile assets.

### 5.4 Insights and articles

Insights hub and articles exist in multiple source architectures:

- chained Jekyll includes;
- direct static HTML;
- premium article CSS;
- article factory/generated pages.

Search results confirm `global-header-parity-v2.css` is referenced across commercial pages, case studies, Insights and article routes, but markup remains distributed.

### 5.5 Portfolio and case studies

Case Studies archive and individual cases use the same broad brand language but remain independent HTML implementations. They must migrate to the common Header component without inheriting footer-family differences.

## 6. Current technical debt

1. Header markup is copied across many files.
2. Inline page CSS competes with shared parity CSS.
3. The rotating cube is implemented in page markup rather than one canonical include.
4. Language-switch target and color can drift on new pages.
5. EN and RU currently use different mobile breakpoints.
6. Mobile menu state is controlled by multiple historical scripts/listeners.
7. Header height and horizontal padding may be redefined locally.
8. Active navigation state is not centrally derived.
9. Page-specific cache keys can leave old header behavior in browsers.
10. Article generators can reproduce legacy header markup.
11. Generic selectors such as `header { ... }` make component isolation difficult.
12. New pages can be created without a mapped locale route or explicit header contract.

## 7. Target source architecture

Preferred build-time structure:

```text
_includes/header-system/
  header.html
  logo-cube.html
  primary-navigation.html
  mobile-navigation.html
_data/
  navigation.yml
  header.yml
assets/css/
  header-system-v1.css
assets/js/
  header-system-v1.js
```

No runtime JavaScript injection of header HTML.

Recommended include contract:

```liquid
{% include header-system/header.html
   lang="en"
   current_page="ai-systems"
   locale_url="/ru/ai-systems/"
   variant="standard"
%}
```

## 8. Required data contract

Every generated page must provide:

```yaml
lang: en
locale_url: /ru/equivalent-route/
header_variant: standard
navigation_key: about
footer_family: commercial
```

For articles:

```yaml
lang: en
locale_url: /ru/insights/equivalent-article/
header_variant: article
navigation_key: insights
footer_family: editorial
```

A page without a true translated equivalent may link to the language root only when explicitly documented. Do not silently guess locale mappings.

## 9. Canonical element order

```html
<header class="site-header site-header--standard">
  <div class="site-header__shell">
    <a class="site-header__brand" href="...">
      <span class="site-header__cube" aria-hidden="true">...</span>
      <span class="site-header__wordmark">PROAI <strong>EXPERT</strong></span>
    </a>
    <nav class="site-header__nav" aria-label="Primary navigation">...</nav>
    <div class="site-header__actions">
      <a class="site-header__locale" ...>RU</a>
      <a class="site-header__cta" ...>...</a>
      <button class="site-header__menu-toggle" ...>...</button>
    </div>
  </div>
  <nav class="site-header__mobile-nav" ...>...</nav>
</header>
```

Element order must be identical in EN and RU.

## 10. Logo and cube rules

- Cube must exist on all standard and article pages.
- Cube geometry, line thickness and cyan color must be centralized.
- Desktop and mobile use the same cube component with controlled sizing tokens.
- Default animation is a slow continuous rotation.
- `prefers-reduced-motion: reduce` stops rotation and presents a stable angle.
- Cube animation must not trigger layout changes.
- Cube must be decorative and `aria-hidden="true"`.
- Wordmark is the accessible brand link.

## 11. Language-switch rules

- EN pages show `RU`; RU pages show `EN`.
- Color is always the canonical cyan.
- The link must use `lang` and `hreflang`.
- Destination should be the mapped equivalent route.
- The control must remain in the same relative position across page families.
- It must meet a 44px minimum touch target.
- Local page CSS must not recolor it white.

## 12. Navigation rules

Canonical order must be stored in `_data/navigation.yml`.

Navigation labels may be localized naturally, but destinations and information architecture must remain paired.

Active state must use `aria-current="page"` and the shared cyan treatment.

No page may hand-code a different navigation order.

## 13. CTA rules

- CTA visibility is controlled by the approved variant, not page-level CSS hiding.
- Standard commercial pages may show the CTA.
- Article and utility variants may use a compact CTA or omit it according to centralized data.
- CTA dimensions, border, hover and focus behavior are shared.
- No inline styles.

## 14. Desktop and laptop behavior

- Fixed header, canonical 85px baseline height unless a later approved token change is made.
- Max shell width: 1600px.
- Stable left and right alignment across pages.
- Brand, navigation and actions remain vertically centered.
- Scroll state may increase background opacity but must not change horizontal alignment.
- Header must not overlap page hero content; pages consume the shared header-height token.

## 15. Mobile portrait behavior

- Brand remains visible on the left.
- Locale and hamburger remain visible on the right.
- Commercial CTA is hidden from the top row and may be placed inside the menu if approved.
- Mobile menu opens below the header and does not cover the toggle.
- Body scroll locks only while the menu is open.
- Safe-area insets are respected.
- Safari address-bar changes must not cause header jumping.
- Header must not disappear completely during ordinary scrolling.

## 16. Mobile landscape behavior

- Use a compact but fully usable header height.
- Preserve brand, locale and menu toggle.
- Menu must fit the reduced viewport height and be scrollable if required.
- Header must not consume excessive vertical space.
- No separate visual language or reordered controls.

## 17. Scroll behavior

Canonical recommendation:

- header remains present;
- scrolling adds `.is-scrolled` and increases background opacity;
- no full hide/reveal behavior;
- menu-open state takes priority over scroll state;
- transitions are subtle and disabled under reduced motion.

This is more reliable than multiple page-specific disappearance rules.

## 18. JavaScript contract

One shared script owns:

- menu toggle open/close;
- `aria-expanded`;
- mobile navigation visibility;
- Escape-key close;
- outside-click behavior where appropriate;
- body scroll lock;
- scroll-state class;
- cleanup on breakpoint changes.

Forbidden:

- duplicate listeners in page files;
- inline menu scripts;
- several scripts controlling the same classes;
- runtime HTML injection.

## 19. CSS contract

New selectors must use only the scoped namespace:

```text
.site-header
.site-header__shell
.site-header__brand
.site-header__cube
.site-header__wordmark
.site-header__nav
.site-header__actions
.site-header__locale
.site-header__cta
.site-header__menu-toggle
.site-header__mobile-nav
```

Forbidden in the new system:

- generic `header { ... }`;
- generic `.logo-block`, `.site-nav`, `.lang-link`, `.start-btn` rules;
- new `!important` compatibility layers;
- page-specific header alignment patches;
- inline transforms, colors or dimensions.

## 20. Accessibility

- One header landmark.
- Brand link has an accessible name.
- Primary and mobile navigation have labels.
- Toggle is a real `<button>` with `aria-expanded` and `aria-controls`.
- Logical keyboard order.
- Visible focus states.
- Escape closes the menu and returns focus to the toggle.
- 44px minimum touch targets.
- Reduced-motion handling for cube and transitions.
- 200% zoom remains usable.
- Forced-colors mode preserves navigation and focus visibility.

## 21. Page-to-header mapping

| Page family | Routes | Target variant |
|---|---|---|
| Homepage | `/`, `/ru/` | standard |
| Commercial | About, Contact, AI Systems, Websites & Branding EN/RU | standard |
| Insights hub | `/insights/`, `/ru/insights/` | standard |
| Articles | all EN/RU Insights articles | article |
| Portfolio | Case Studies archive and individual cases EN/RU | standard |
| Utility | 404 and future system pages | utility |

## 22. Migration sequence

1. Build shared Header component, data, CSS and JS.
2. Migrate Homepage EN/RU and verify no visual redesign.
3. Migrate About, AI Systems, Websites & Branding and Contact EN/RU.
4. Migrate Insights hub.
5. Update premium article templates and article factory/generator.
6. Migrate legacy articles.
7. Migrate Case Studies archive and individual cases.
8. Migrate 404/utility pages.
9. Remove obsolete generic and copied header rules only after their last consumer is migrated.
10. Run full-site regression and freeze Header System V1.

## 23. First implementation package

The next implementation PR should be limited to:

- create shared header include/data/CSS/JS;
- migrate Homepage EN/RU only;
- preserve current visual appearance;
- preserve current links and header copy;
- verify generated HTML contains one header;
- verify cube, locale color, menu and scroll state;
- leave other page families unchanged.

Do not combine the first package with footer migration or unrelated homepage changes.

## 24. Rules for future pages

A new page is not complete unless it:

1. uses the shared Header include;
2. declares language and mapped locale URL;
3. declares current navigation key;
4. declares an approved header variant;
5. declares the correct Footer family/variant;
6. contains no copied header/footer markup;
7. passes desktop, mobile portrait and mobile landscape checks.

Article generators and page factories must enforce these requirements automatically.

## 25. Acceptance criteria

Architecture:

- one canonical Header component;
- centralized navigation and locale data;
- scoped CSS and one JS owner;
- no runtime injection;
- no new generic selectors or `!important` layers.

Visual:

- same recognizable header across page families;
- cube present and correctly animated;
- language control cyan;
- controls aligned consistently;
- no header/hero overlap;
- stable portrait and landscape layouts.

Behavior:

- one menu interaction model;
- correct focus and Escape behavior;
- no duplicate event execution;
- no horizontal overflow;
- no Safari mobile jumping caused by conflicting scripts.

Localization:

- EN/RU structure parity;
- correct equivalent-route language links;
- active navigation state correct in both languages.

Regression:

- page content below the header unchanged;
- Footer System unchanged unless explicitly included in a later migration package;
- no SEO or route changes.

## 26. Regression matrix

Required viewports:

- 1920×1080;
- 1600×900;
- 1440×900;
- 1366×768;
- 1024×768;
- 768×1024;
- 430×932;
- 390×844;
- 932×430;
- 844×390.

Required page samples for each migration package:

- EN and RU homepage;
- one EN and RU commercial page;
- Insights hub;
- one legacy article;
- one premium article;
- Case Studies archive;
- one individual case;
- 404.

## 27. Prohibited patterns

- copied permanent header markup;
- white locale control caused by local CSS;
- missing or static cube without reduced-motion justification;
- page-specific menu scripts;
- different element order by language;
- arbitrary breakpoints per page;
- generic `header`, `.site-nav`, `.lang-link` or `.start-btn` overrides in new work;
- CSS hiding of unnecessary markup instead of a real variant;
- language links pointing to unrelated routes without documentation;
- claiming migration complete before real device and generated-output verification.

## 28. Final decision

The visual header should not be redesigned. It should be converted into a shared system, migrated by page family and then frozen as Header System V1.

The current homepage Commercial Footer is implemented only on `/` and `/ru/`. The remaining footer families continue to follow the staged plan in `docs/FOOTER_SYSTEM_SPEC.md` after the Header System foundation is established.