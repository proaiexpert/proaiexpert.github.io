# Header Legacy Cleanup Map

Status: visual system frozen; compatibility bridge accepted for existing legacy pages.

## Canonical owner for new pages

- Markup: `_includes/header-system/header.html`
- Data: `_data/navigation.yml`, `_data/header.yml`
- CSS: `assets/css/header-system-v1.css`
- JavaScript: `assets/js/header-system-v1.js`

All newly created pages must use this component and the `.site-header-*` namespace.

## Frozen compatibility owner for existing pages

- CSS: `assets/css/global-header-parity-v2.css`
- Legacy mobile behavior: existing page-family scripts, including `mobile-behavior-v123.js` and case-study navigation scripts.

Existing standalone pages still contain copied `.global-header` markup. The bridge is now an accepted compatibility layer rather than a source of independent visual decisions. It owns the same geometry, typography, cube motion, mobile layout and active-state presentation as the canonical component.

## Shared visual contract

Canonical and compatibility implementations must keep these values identical:

- header height: 85px desktop, 84px narrow portrait, 68px short landscape;
- shell width: 1600px;
- desktop horizontal padding: 40px;
- wordmark: 20px, weight 900, line-height 1;
- desktop navigation: 10px, weight 700, uppercase;
- mobile navigation: Title Case, `clamp(17px, 4.2vw, 23px)`;
- narrow portrait navigation: `clamp(17px, 5.5vw, 21px)`;
- short landscape navigation: `clamp(14px, 2.4vw, 17px)`;
- locale control: 52 × 44px desktop, 46 × 44px narrow portrait;
- CTA: 184 × 44px;
- font stack: Inter, system fallbacks;
- `font-synthesis: none`, normal kerning and border-box sizing;
- cube rotation: 10-second linear infinite animation;
- active route: cyan text with restrained cyan glow.

## Collision prevention

The compatibility bridge uses unique ownership rules for:

- `.global-header` geometry;
- exact locale and CTA boxes;
- mobile navigation type metrics;
- the `proaiLegacyHeaderCubeSpin` animation;
- reduced-motion behavior.

Page-local `logoSpin`, button metrics or font defaults must not be treated as authoritative.

## Future physical migration

Physical replacement of copied legacy markup remains desirable, but it is not required for visual parity and must not be mixed into unrelated content work. It should happen only when the corresponding page family or article generator is already being modernized.

Recommended sequence:

1. Commercial standalone pages.
2. Portfolio archive and case pages.
3. Insights hub.
4. Article templates and factory.
5. Legacy article outputs.
6. Utility pages.
7. Delete the compatibility bridge only after repository search returns no legacy header markup.

## Release gate

The user-facing Header System is considered frozen when:

- navigation content and order match;
- desktop locale and CTA boxes do not move between page families;
- mobile portrait and landscape menus use the same typography and active state;
- cube animation works on canonical and legacy pages;
- new pages are prohibited from introducing copied legacy markup;
- changes to header CSS, data or behavior require a dedicated regression review.
