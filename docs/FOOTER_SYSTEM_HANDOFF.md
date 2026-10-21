# Footer System — Final Handoff

Status: closed and production-owned

Repository: `proaiexpert/proaiexpert.github.io`

## 1. Scope

This handoff covers only the ProAI Expert website in this repository. It does not govern any separately hosted client or portfolio project.

The Footer System owns the public EN/RU footer experience for:

- Homepage;
- About;
- Contact;
- AI Systems;
- Websites & Branding;
- Case Studies archive and individual cases;
- Insights hub and current articles.

The Header System, page content, SEO metadata, case evidence and unrelated projects remain outside Footer ownership.

## 2. Canonical families

### Commercial

Routes:

- `/` and `/ru/`;
- `/about/` and `/ru/about/`;
- `/contact/` and `/ru/contact/`;
- `/ai-systems/` and `/ru/ai-systems/`;
- `/websites-branding/` and `/ru/websites-branding/`.

Variants: Homepage, About, Contact and Service.

### Portfolio

Routes:

- `/case-studies/` and `/ru/case-studies/`;
- all current EN/RU case-study routes.

Variants: Archive and Case.

### Editorial

Routes:

- `/insights/` and `/ru/insights/`;
- all current EN/RU article routes.

Variants: Hub and Article.

### Utility

Reserved for `404.html` and future approved system or legal routes. Dead or placeholder legal links are prohibited.

## 3. Source ownership

Canonical build-time sources:

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

Homepage-specific layout polish remains in:

```text
_includes/footer-commercial-v1.html
assets/css/footer-commercial-v1-polish.css
```

Rules:

- use build-time includes;
- do not inject footer markup with JavaScript;
- do not copy social destinations into individual pages;
- do not create page-local footer variants outside the approved families;
- article and case generation must preserve the canonical family include.

## 4. Shared structural contract

Full footers use this order:

1. contextual CTA/content;
2. contact group;
3. related paths or capabilities;
4. dedicated brand/watermark zone;
5. bottom row with wordmark, profiles, locale switch and copyright.

Contact is always the first detail group. Related navigation is always the second.

The watermark:

- is decorative and `aria-hidden`;
- stays inside `.site-footer__brand-zone`;
- never overlaps readable content or controls;
- never moves or pulses;
- is hidden where forced-colors requires it.

## 5. Contact and profile policy

Both EN and RU full footers include:

- `hello@proai-expert.com`;
- LinkedIn;
- GitHub;
- X;
- Telegram.

Canonical destinations are stored only in `_data/social-links.yml`.

Language controls must point to the mapped equivalent route whenever one exists.

External profile links require accessible labels and `rel="noopener noreferrer"`.

## 6. Motion contract

One restrained title glow/pulse is shared across full Commercial, Portfolio and Editorial footers.

Canonical source:

```text
assets/css/footer-title-pulse-v1.css
```

Behavior:

- targets only `.site-footer__cta h2`;
- uses `siteFooterTitlePulseV5` with a 4.6-second cycle;
- remains static for most of the cycle and briefly adds a soft cyan glow;
- never changes size, position or layout geometry;
- never animates the watermark, wordmark, links or controls;
- works on desktop, phone portrait and phone landscape;
- is disabled under `prefers-reduced-motion: reduce` and forced-colors.

Homepage layout CSS must not define a second animation.

## 7. Responsive and accessibility contract

Required:

- no footer horizontal overflow;
- no document-overflow regression caused by the footer;
- stable desktop, portrait and landscape layouts;
- minimum 44 px interactive targets where practical;
- visible `:focus-visible` states;
- logical keyboard order;
- labelled social and locale navigation;
- safe-area support;
- readable EN/RU wrapping;
- no Header geometry or behavior regression.

## 8. Deployment gate

GitHub Pages must build Jekyll output into `_site` before deployment.

The deployment workflow verifies generated footer ownership, structural brand zones, canonical contacts and profiles, contact-first detail order and rendered Liquid output.

Any future Footer System change must also verify that the shared title-pulse stylesheet is present on every full-footer route.

## 9. Change protocol

A future footer change requires:

1. current `main` and open-PR review;
2. a focused branch and PR;
3. generated-output verification;
4. EN/RU review;
5. desktop, portrait and landscape regression checks;
6. reduced-motion verification;
7. final diff review for temporary files or unrelated changes.

The Header System must not be changed to compensate for a footer defect.

## 10. Closed-state rule

The Footer System is considered closed after the shared title pulse is published and verified. New work should treat these files as a stable component system, not as page-by-page styling territory.
