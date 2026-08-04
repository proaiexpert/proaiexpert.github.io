# Global CSS Footer Dependency Audit

Status: Canonical implementation audit for Footer System migration

Repository: `proaiexpert/proaiexpert.github.io`

Baseline: `17b8d7110b038203a4068ea2f5c138ad78e0f9be`

## 1. Executive conclusion

The current homepage footer defects are caused primarily by a broad semantic selector embedded in both homepage snapshot files:

```css
section {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
```

This rule was written for top-level homepage sections, but it also applies to nested semantic sections inside the new Commercial Footer component. As a result, `.site-footer__cta` and `.site-footer__detail-group` inherit flex centering and conflict with the component-scoped footer layout.

The defect is therefore not a cache issue and not primarily a watermark issue. It is a selector-scope defect.

## 2. Verified source locations

The broad `section` selector is present in:

- `_includes/homepage-current-en.html`
- `_includes/homepage-current-ru.html`

Both snapshots contain the same legacy layout contract.

The generated homepages are assembled through:

- `index.html`
- `ru/index.html`

Both wrappers replace the legacy footer with `_includes/footer-commercial-v1.html`, but the replacement footer remains inside the same document and is still affected by the snapshot-level `section` rule.

## 3. Why repeated footer overrides failed

The footer-specific polish styles attempted to restore vertical layout with selectors such as:

```css
.site-footer__cta { display: block; }
.site-footer__detail-group { display: grid; }
```

These rules improved some states but did not remove the underlying semantic coupling. The page continued to contain competing layout contracts, and later or more specific legacy rules could still affect nested footer sections.

Repeated `!important` additions would only deepen the cascade debt and are prohibited by `docs/FOOTER_SYSTEM_SPEC.md` except as a temporary documented compatibility boundary.

## 4. Correct replacement strategy

The legacy rule must be restricted to the homepage sections it was intended to control.

Preferred correction:

```css
body > section {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
```

This preserves the current layout contract for direct child sections while excluding nested component sections inside:

- footer components;
- cards;
- future nested editorial components;
- other semantic sub-sections.

If generated DOM inspection shows that some intended homepage sections are children of `<main>` rather than direct children of `<body>`, the accepted selector is:

```css
body > section,
main > section {
  ...
}
```

The exact selector must be chosen from generated HTML, not assumed from source snapshots.

## 5. Files in the first correction package

Expected production files:

- `_includes/homepage-current-en.html`
- `_includes/homepage-current-ru.html`

Wrapper files to inspect for generated-output safety:

- `index.html`
- `ru/index.html`

Footer files to verify but not redesign in this package:

- `_includes/footer-commercial-v1.html`
- `assets/css/footer-commercial-v1.css`
- `assets/css/footer-commercial-v1-polish.css`

## 6. Other global and legacy dependencies

The broader Footer System migration must also account for:

- generic `footer` rules in legacy page snapshots;
- `.f-*` selectors copied across commercial, editorial, and portfolio pages;
- `body.footer-primary-mobile` and `body.footer-secondary-mobile` variants;
- global mobile files that reposition `.f-backmark`, `.f-top`, `.f-bottom`, and `.f-socials`;
- `overflow-x: clip` rules that may hide rather than fix overflow;
- portfolio CSS that hides Commercial Footer content and recreates watermark content through pseudo-elements;
- article templates and generators that can restore legacy footer markup.

These dependencies must be removed progressively by footer family. They must not be deleted globally before the corresponding family has migrated.

## 7. Scope of the first implementation PR

Allowed:

- restrict the broad homepage `section` selector;
- remove footer-only compatibility rules that become provably redundant;
- bump affected cache keys when an external stylesheet changes;
- verify Homepage EN/RU generated output.

Not allowed:

- migrate About, Contact, service pages, Insights, articles, or Case Studies;
- redesign the footer;
- change CTA copy, social links, routes, SEO, header, hero, Workflow, or content sections;
- remove shared `.f-*` rules used by pages not yet migrated.

## 8. Required generated-output checks

For EN and RU homepages:

1. Exactly one `<footer>`.
2. `.site-footer__cta` computed display follows the footer component, not the broad semantic rule.
3. Both detail groups share the intended mobile grid.
4. No footer section is centered by the legacy page selector.
5. No horizontal overflow.
6. Watermark remains inside `.site-footer__brand-zone`.
7. Pulse animation remains optional and reduced-motion-safe.
8. Header, Hero, Workflow, Insights preview, and Selected Work remain unchanged.

## 9. Required viewports

- 1920×1080
- 1440×900
- 1366×768
- 1024×768
- 768×1024
- 430×932
- 390×844
- 932×430
- 844×390

## 10. Migration boundary

This audit authorizes a narrow Homepage EN/RU selector-scope correction as the next implementation package.

It does not authorize a single global deletion across all page families. Commercial secondary pages, Editorial, Portfolio, and Utility must migrate in the staged order defined in `docs/FOOTER_SYSTEM_SPEC.md`.
