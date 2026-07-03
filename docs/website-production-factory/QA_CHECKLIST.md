# QA Checklist

## Desktop
- Header/nav visible and complete.
- Hero clear and conversion-focused.
- Cards align and do not clip.
- Footer compact and complete.

## Tablet
- Grids collapse cleanly.
- Nav remains usable.
- CTA buttons remain readable.

## Mobile
- Check 430, 390, 375, 360, 320.
- Hamburger opens/closes.
- Sticky CTA does not cover content.
- Cards stack cleanly.
- Footer stacks cleanly.
- No horizontal overflow.
- Content visible without JS.

## Links
- Header links.
- Footer links.
- CTA links.
- City links.
- Form/request links.

## Content Safety
- No fake reviews or ratings.
- No fake license/insured/warranty claims.
- No fake completed projects.
- No guaranteed outcomes.
- No "free estimate" or "free consultation" unless explicitly approved and true.

## Accessibility Basics
- Viewport meta.
- Landmarks.
- Button labels.
- Focus states.
- FAQ controls usable.

## Performance Basics
- Images sized reasonably.
- No unnecessary large files.
- No blocking scripts unless needed.

## Reveal/Animation
- `.reveal` visible by default.
- Hiding only under `html.js .reveal`.
- No `html.js.reveal`.
- Reduced-motion fallback.
- No-IntersectionObserver fallback.
- Timeout fallback.

## Deployment
- Source HEAD equals intended commit.
- `origin/main` equals intended commit.
- Live cache-busted HTML/CSS checked.
- Rendered live QA done before final ready status.
