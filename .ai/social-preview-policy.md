# Social Preview Policy

## English pages
- Use `https://proai-expert.com/assets/social/proai-home-og-en-r1-1.png` for both `og:image` and `twitter:image`.
- Use `ProAI Expert — From first impression to result — one system.` for `og:image:alt` and `twitter:image:alt`.

## Russian pages
- Use `https://proai-expert.com/assets/social/proai-home-og-ru-r1-1.png` for both `og:image` and `twitter:image`.
- Use `ProAI Expert — От первого впечатления до результата — одна система.` for `og:image:alt` and `twitter:image:alt`.

## Enforcement
- All current and future English public pages use the English default preview unless the Owner explicitly approves a page-specific override.
- All current and future Russian public pages use the Russian default preview unless the Owner explicitly approves a page-specific override.
- The GitHub Pages build materializes the approved assets, normalizes generated HTML by locale, and fails validation if the required social preview metadata is missing, duplicated, stale, or uses a legacy homepage screenshot.
- The enforcement implementation is `scripts/apply-social-preview-defaults.py` and the Pages workflow.

## Restriction
- Do not use client or case images such as `case-financial-desktop.webp` as the default social preview for studio pages.
- Do not restore `screenshots/proai-home-en-desktop.png` or `screenshots/proai-home-ru-desktop.png` as social preview defaults.
