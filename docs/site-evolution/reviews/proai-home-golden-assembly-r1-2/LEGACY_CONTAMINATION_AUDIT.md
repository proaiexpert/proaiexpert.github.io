# Golden Assembly R1.2 — legacy contamination audit

Recovery base: `38b92195a11709546db8fe0beeaa782244eee83f`
Recovery product: `eac0959950cb5e900296f811f1d92027ed2003e1`

This is an assembly-only forensic record. Frozen component product files are not modified.

| Legacy selector / behavior | Legacy source | Golden component risk | Contaminating computed behavior | Standalone authority / R1.2 result |
|---|---|---|---|---|
| `* { margin:0; padding:0; box-sizing:border-box }` | `_includes/homepage-current-en.html`, RU equivalent | all | unscoped margin/padding reset | removed as a monolithic dependency; R1.2 keeps box-sizing only and lets component CSS own margins |
| `html { scroll-behavior:smooth }` | legacy inline shell | document | benign but coupled to monolith | reproduced explicitly in minimal assembly shell |
| `body { ... overflow-x:hidden }` | legacy inline shell | document / all | masks real overflow | removed; R1.2 measures actual scrollWidth-clientWidth |
| `html, body { overflow-x:clip !important }` / `clip` mobile variants | legacy mobile rules | all mobile components | masks integration overflow | removed; not recreated |
| `header { position:fixed; display:flex; justify-content:center; ... }` | legacy inline shell | frozen Header | can override Header root layout through element selector | removed; `header-system-v1.css` owns Header |
| `nav { display:flex; ... }`, `nav a { ... }` | legacy inline shell | Header / Footer nav | generic nav typography/layout contamination | removed; Header/Footer scoped CSS owns nav |
| `.start-btn` | legacy inline shell | Hero | obsolete CTA visual system | legacy markup/runtime not mounted; Hero R3 CTA classes remain authoritative |
| `section { width:100%; display:flex; align-items:center; justify-content:center; position:relative }` | legacy inline shell | Two Worlds, Technology, Financial Stream, downstream sections | forces flex formatting context and centering; confirmed Owner-visible displacement/overlap path | removed entirely; each Golden section keeps its own scoped `display` / positioning model |
| generic legacy Hero classes (`.hero-content`, `.hero-left`, `.hero-visual`, `.scene`, orbit/core rules) | legacy inline shell | Hero R3 / Cube | competing grid/flex/transform/size rules | removed; only frozen `homepage-hero-signature-r3.css` controls Hero geometry |
| old monolithic mobile `@media` rules | legacy inline shell | Hero / Two Worlds / Financial Stream | viewport-specific inherited overrides and overflow masking | removed with monolithic shell |
| `homepage-core-hardening-v1.css/js` | R1.1 inherited assembly | multiple Golden roots | broad corrective layer tied to old DOM/runtime assumptions | not loaded by R1.2 clean shell |
| `homepage-commercial-refinement-v1.css` as a whole | R1.1 inherited assembly | Hero plus downstream | contains `#hero` and `#manifest` declarations in addition to Founder styles | not loaded whole; only exact `.homepage-founder-*` declarations extracted into assembly-only downstream CSS |
| old R2/R2.1/R2.2 Two Worlds runtime | legacy/master assembly | Two Worlds | duplicate state/geometry authority | not loaded |
| embedded `.tw-tech-r2` | historical Golden donor include | Technology | duplicate Technology section | excluded through exact extracted `.tw-r2` assembly include |
| old `#section-trigger` Financial Stream shell | legacy homepage | Financial Stream | duplicate/obsolete monitor-phone treatment | not mounted |
| old `#core-split` | legacy homepage | Two Worlds / concept flow | obsolete split experience | not mounted |

## Review-harness contamination

R1.1 review generation performed broad URL string rewriting and could transform a valid CSS `data:image` URL into a malformed raw.githack-prefixed URL. R1.2 review generation rewrites only root-relative `href/src/srcset` attributes on asset-bearing HTML tags. It never parses or rewrites CSS `url(...)`, so `data:`, `blob:`, `javascript:`, `mailto:`, `tel:`, fragment and absolute HTTP(S) URLs remain untouched.

## Cube packaging failure

R1.1 Cube bootstrap used root-relative importmap/module asset URLs. They resolve on the production origin but not when the same page is nested below `raw.githack.com/<owner>/<repo>/<sha>/...`. R1.2 adds an assembly-only loader that derives the immutable repository base from its own script URL, while importing the exact frozen 45% Cube source unchanged.
