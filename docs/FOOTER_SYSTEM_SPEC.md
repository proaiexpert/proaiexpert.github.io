# ProAI Expert Footer System Specification

Status: canonical and production-locked

Repository: `proaiexpert/proaiexpert.github.io`

## 1. Purpose

The Footer System provides one maintainable build-time architecture for ProAI Expert public footers. It centralizes structure, localization, contact/profile destinations, responsive behavior, accessibility and decorative motion.

It must prevent:

- copied footer markup;
- page-local social URLs;
- language drift;
- watermark collisions;
- global semantic CSS ownership;
- runtime footer injection;
- inconsistent motion across page families.

## 2. Ownership boundary

Included:

- Commercial, Portfolio and Editorial full-footer routes;
- future approved Utility routes;
- footer includes, data, shared CSS and deployment assertions.

Excluded:

- Header System;
- hero and content sections;
- SEO metadata;
- case evidence;
- independently hosted projects;
- unrelated application behavior.

## 3. Family mapping

| Route family | EN/RU | Footer family | Variant |
|---|---:|---|---|
| Homepage | Both | Commercial | Homepage |
| About | Both | Commercial | About |
| Contact | Both | Commercial | Contact |
| AI Systems | Both | Commercial | Service |
| Websites & Branding | Both | Commercial | Service |
| Case Studies archive | Both | Portfolio | Archive |
| Individual cases | Both | Portfolio | Case |
| Insights hub | Both | Editorial | Hub |
| Articles | Both | Editorial | Article |
| 404 and approved system pages | As mapped | Utility | Minimal |

No fifth family may be introduced without an architecture review and specification update.

## 4. Canonical sources

```text
_includes/footer-system/
  footer.html
  commercial.html
  portfolio.html
  editorial.html
  contact-links.html
  brand-zone.html
  bottom.html
_data/
  footer.yml
  social-links.yml
assets/css/
  footer-system-foundation-v1.css
  footer-system-v1.css
  footer-title-pulse-v1.css
```

Homepage integration:

```text
_includes/footer-commercial-v1.html
assets/css/footer-commercial-v1-polish.css
```

The router include selects a family at build time. Client-side JavaScript must not inject or replace footer markup.

## 5. Component contract

Canonical namespace:

```text
.site-footer
.site-footer__shell
.site-footer__main
.site-footer__cta
.site-footer__eyebrow
.site-footer__summary
.site-footer__primary-action
.site-footer__details
.site-footer__detail-group
.site-footer__services
.site-footer__brand-zone
.site-footer__watermark
.site-footer__bottom
.site-footer__logo
.site-footer__socials
.site-footer__locale
.site-footer__copyright
```

Canonical family attributes:

```text
data-footer-family="commercial"
data-footer-family="portfolio"
data-footer-family="editorial"
```

Each generated page must contain exactly one owned footer.

## 6. Structural order

Full footer DOM order:

1. `.site-footer__main`;
2. contextual CTA;
3. `.site-footer__details`;
4. first detail group: contact;
5. second detail group: related paths/capabilities;
6. `.site-footer__brand-zone`;
7. `.site-footer__bottom`.

The contact group must precede `.site-footer__services` in generated HTML.

## 7. Contact and profiles

Canonical contact:

```text
hello@proai-expert.com
```

Canonical profiles:

```text
LinkedIn: https://www.linkedin.com/in/ihorhorb/
GitHub:   https://github.com/proaiexpert
X:        https://x.com/proaiexpert
Telegram: https://t.me/proAiexpert
```

Both EN and RU full footers include all four profiles. Destinations are owned only by `_data/social-links.yml`.

External links require:

- accessible localized labels;
- `target="_blank"` when a new tab is intended;
- `rel="noopener noreferrer"`;
- a labelled social navigation landmark.

## 8. Localization

EN and RU versions share:

- DOM structure;
- component classes;
- element order;
- profile destinations;
- breakpoint logic;
- motion behavior;
- accessibility behavior.

They may differ in copy, route mapping and limited typography constraints needed for readable wrapping.

The locale control must use the mapped equivalent route where one exists, not a generic language homepage fallback.

## 9. Watermark

The decorative watermark must:

- exist in markup inside `.site-footer__brand-zone`;
- use `aria-hidden="true"`;
- remain static;
- have no pointer interaction;
- never overlap CTA, contacts, links or copyright;
- use clipping only within its own brand zone;
- be hidden in forced-colors when appropriate.

Prohibited:

- absolute positioning against the whole footer;
- negative margins into readable content;
- duplicate pseudo-element watermark text;
- watermark animation;
- concealment of a sizing defect through global page clipping.

## 10. Motion

Canonical motion source:

```text
assets/css/footer-title-pulse-v1.css
```

Approved behavior:

- selector: `.site-footer[data-footer-family] .site-footer__cta h2`;
- animation: `siteFooterTitlePulseV5`;
- duration: `4.6s`;
- timing: `ease-in-out`;
- iteration: infinite;
- effect: restrained text shadow and brightness only.

The pulse must:

- apply to full Commercial, Portfolio and Editorial footers;
- work without viewport-specific activation;
- keep all geometry static;
- remain visually inactive for most of each cycle;
- never target the watermark, logo, links or controls;
- be disabled under `prefers-reduced-motion: reduce`;
- be disabled under forced-colors.

Homepage polish CSS must not define a competing keyframe animation.

## 11. CSS ownership

Layout selectors must remain component-scoped.

Prohibited examples:

```css
footer { display: grid; }
nav { display: flex; }
section { display: flex; }
```

Generic semantic elements may receive only safe intentional resets. Repeated page-specific `!important` patches are not an acceptable replacement for correcting ownership.

## 12. Responsive behavior

Required reference viewports:

| Category | Dimensions |
|---|---|
| Laptop | 1440×900 |
| Phone portrait | 390×844 |
| Phone landscape | 844×390 |

Additional desktop, tablet and phone widths should be included for larger footer redesigns.

Acceptance requirements:

- footer `scrollWidth` does not exceed `clientWidth`;
- no document-overflow regression caused by the footer;
- brand zone does not intersect main or bottom content;
- EN/RU strings remain readable;
- social labels wrap as complete controls;
- interactive targets are at least 44 px where practical;
- safe-area insets are respected;
- phone landscape remains compact and usable.

## 13. Accessibility

Required:

- semantic `<footer>` landmark;
- labelled social and locale navigation;
- logical keyboard order;
- visible `:focus-visible` styling;
- decorative watermark excluded from assistive technology;
- reduced-motion compliance;
- forced-colors compatibility;
- no dead links;
- usable layout at browser zoom.

## 14. Build and deployment

GitHub Pages deployment must:

1. build the repository with Jekyll;
2. deploy generated `_site` output, not raw Liquid source;
3. verify one correct family footer per mapped route;
4. reject raw unrendered footer includes;
5. verify the brand zone and watermark;
6. verify canonical email, Telegram and GitHub destinations;
7. verify contact-first detail ordering;
8. verify the shared title-pulse stylesheet on every full-footer route.

A shared CSS cache key must change whenever the file contents change.

## 15. Regression protocol

Every Footer System PR must:

- start from current `main`;
- inspect open PRs for ownership conflicts;
- declare exact file scope;
- build generated output;
- test EN and RU;
- test laptop, portrait and landscape;
- verify reduced motion;
- verify Header geometry/style parity when shared layout is touched;
- inspect overflow numerically;
- remove temporary workflows and scripts before merge;
- review the final changed-file list;
- use a focused squash commit.

## 16. Closed-state governance

The system is closed after the shared title pulse is published and the deployment gate is updated. Future pages must select an existing family and reuse the canonical sources. Page-by-page footer reinvention is prohibited.
