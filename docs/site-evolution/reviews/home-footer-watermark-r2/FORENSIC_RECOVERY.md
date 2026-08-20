# ProAI Expert — Homepage Footer Premium Watermark R2 Forensic Recovery

Status: OWNER CANDIDATE

Base: `b935c7212ab7e7434ff27fd45395e62e8bd3d802`
Production lock: `c945084e1952c05c686494091f7dbca0f7acdf08`

## Current base freeze

The preserved structural base is `_includes/footer-commercial-v1.html` at blob `68e3a03e7bbfc5d515be74770473ad51271be37e` plus its existing shared Footer System dependencies. The R2 candidate intentionally preserves CTA, contact, capabilities, social, locale, legal, current dark family, current bottom brand/logo logic, and proven responsive stacking.

## Historical recovery

| Checkpoint | What was strong | What was weak | What to recover | What not to recover |
|---|---|---|---|---|
| `1a75a6cd119874109eb82d6594ea225cfef63e0c` | First coherent Commercial Footer V1; CTA + utility + dedicated brand zone + social/locale/legal | Cyan accent and glow were too literal/loud for the new material direction | Dedicated brand zone and complete IA | Bright cyan/glow styling |
| `dae361bd02fcfca6c543e332454e3f22a41de550` | Restrained periodic title life and reduced-motion fallback | Still reads as text glow rather than material | Principle of rare, non-layout motion | Cyan text-shadow pulse implementation |
| `bf8e88be9dfc6f13b0711b40cbcbd625cf1d33a4` | Explicit vertical CTA stacking and mobile hierarchy | Compatibility patchiness | Stable stacking contract | Legacy-coupling workaround as visual language |
| `4fba2ba5dc7afde8478b221d321f13fc888b2d62` | Deliberate mobile grid, centered watermark, responsive discipline | Pulse intensity increased | Mobile alignment and separator rhythm | Stronger cyan pulse |
| `257bcac825c51fc1a9911ce7709c606d65c87cd1` | Operational cache correctness | No material visual idea | Cache-version discipline | Nothing visual |
| `44683132c13d0a6300b0a1833209e46a3cd5459f` | Strongest homepage viewport alignment; scoped selectors; portrait/landscape watermark handling | Accent still depended on cyan pulse | Scoped ownership and viewport geometry | Glow-heavy pulse |
| `8ab023984c8c0ba6655cf40bdc0dfa24ec4ce7f1` | Decoupled footer groups from global `section` layout | None material | `div role=group` isolation | Reintroducing global section coupling |
| `73a9a437f944a2551e68081c73a85df58c8bc5fa` | Best historical mobile watermark fit; compact brand-zone geometry | Title pulse became too conspicuous | Mobile watermark scale/fit | Strong pulse amplitude |
| `7e990536c41faa21b182d1db6e5100be13c75188` | Central contact/social ownership; structural watermark; canonical brand treatment; route QA | Shared system necessarily generic | Functional ownership and structural watermark principle | Destructive shared-system rewrite |
| `af9b7288a9a5fc36de57afd816302e80e17e0d8a` | Centralized reduced-motion-safe motion ownership | Global shared glow is not the right R2 material response | Accessibility/motion discipline | Extending R2 effect globally |
| `9f645eaac2792b8e1122aa24aed0622636e5421f` REJECTED R1 | Clean utility grouping and isolated rollback | Removed CTA architecture; made PROAI EXPERT a large foreground heading; lost deep watermark character | Isolation/rollback principle only | Foreground signature architecture |

## Material concepts

### A — Metallic Ripple / Interference Rings — RECOMMENDED — 9.2/10
- Rest: submerged gunmetal/pearl watermark on a deeper optical plane.
- Hover: local specular increase plus one/two soft interference bands; narrow indigo/violet edge only at peak response.
- Idle: rare low-amplitude traveling material sweep; lower brand breath is barely perceptible.
- Mobile: static metallic watermark plus rare CSS-only material life; no touch tracking.
- Implementation: CSS masks/text-clipped gradients/custom properties + short-lived Web Animations ring + damped rAF only while pointer state settles.
- Performance risk: Low/Medium. Gradient repaint is bounded to the brand zone and rAF is interaction-only.
- Gimmick risk: Low if chromatic/ring alpha remains constrained.

### B — Liquid Metal Wake — BACKUP — 8.5/10
- Rest: same deep watermark.
- Hover: broad anisotropic specular wake follows pointer velocity without visible rings.
- Idle: rare moving highlight.
- Mobile: static/idle only.
- Implementation: two moving elliptical masks and velocity-shaped highlight.
- Performance risk: Low/Medium.
- Gimmick risk: Medium; can become a cursor-trail effect if wake lags too visibly.

### C — Magnetic / Caustic Response — 8.0/10
- Rest: quiet dark-metal watermark.
- Hover: pointer bends a narrow caustic/specular field across glyphs; no circles.
- Idle: almost static.
- Mobile: static premium field.
- Implementation: radial/conic gradient field mapped into text masks.
- Performance risk: Low.
- Gimmick risk: Low, but the final impression is less distinctive and less aligned with the requested ripple/interference idea.

## R2 selection

A is selected because it translates the requested “stone in dark water” metaphor into optical material behavior rather than drawing literal water. The rings are a transient specular/interference event, not an always-visible animation. B remains the fallback if Owner review finds the ring event too explicit.

## Protected boundaries

R2 adds homepage-specific candidate files only. Header, Hero, Connected System, Two Worlds, Technology, Cube, Final CTA, existing shared Footer System, homepage assembly, and production `main` are not modified.
