# PROAI EXPERT — PRODUCTION AUTHORITY

Status: CURRENT
Last normalized: 2026-08-29
Repository: proaiexpert/proaiexpert.github.io

## Canonical production authority

- `main` is the sole current product authority.
- Current production baseline at normalization start: `592b214aee9d55327432879ebcb88b5a8d5627ac`.
- Canonical Golden rollback: `backup/golden-homepage-approved-20260829`.
- Historical commits, donors, review branches, checkpoint branches, old manifests and static review copies are evidence only. They are NOT current design authority.
- A branch does not become canonical merely because it is newer.
- A technical PASS does not imply Owner approval.
- If `main` and this authority record disagree, STOP and resolve the authority mismatch before changing product code.

## Homepage component authority

### Header
Current authority:
- `assets/css/header-system-v1.css`
- `assets/js/header-system-v1.js`

### Hero
Current authority:
- `assets/css/homepage-hero-signature-r3.css`
- `assets/js/proai-hero-cube-r1/bootstrap-golden-r1-2.js`
- current cube runtime imported by that bootstrap

### Connected System
Current authority:
- `assets/css/homepage-connected-system-r13.css`
- `assets/js/homepage-connected-system-r13.js`
- `_includes/homepage-connected-system-en.html`
- `_includes/homepage-connected-system-ru.html`

### Two Worlds
Current authority:
- `assets/css/homepage-two-worlds-golden-r1.css`
- `assets/css/homepage-two-worlds-golden-r1-landscape-fix.css`
- `assets/js/homepage-two-worlds-golden-r1.js`
- `assets/js/homepage-two-worlds-golden-r1-landscape-fix.js`

### Technology
Current authority:
- `assets/css/home-technology-transition-r2.css`
- `assets/css/home-technology-transition-r2-golden-mobile.css`
- `assets/js/home-technology-transition-r2.js`

### Financial Stream
Current authority:
- active R1.1 → R1.4 CSS chain
- `assets/css/home-work-proof-financial-stream-r1-4-1-polish.css`
- `assets/css/home-work-proof-financial-stream-mobile-micro-r1.css`
- `_includes/home-work-proof-financial-stream-r1-4-en.html`
- `_includes/home-work-proof-financial-stream-r1-4-ru.html`

Approved current mobile geometry is the version frozen by the Owner immediately before authority cleanup on 2026-08-29.
Desktop/laptop proof sizing is owned by the Financial Stream polish chain; old owner recovery CSS is not authority.

### Selected Thinking
Current authority:
- active `home-selected-thinking-r1*` chain

### Selected Work
Current authority:
- `assets/css/home-selected-work-r1.css`
- `assets/css/home-selected-work-r1-2-polish.css`
- `assets/css/home-selected-work-owner-title-correction-r1.css`
- `_includes/home-selected-work-r1-en.html`
- `_includes/home-selected-work-r1-ru.html`

The old `home-psychology-practice-title-polish-r1.css` is historical and must not be treated as current authority.
The old `home-owner-desktop-recovery-r1-2.css` is historical and must not be treated as current authority.

### Footer
Current authority:
- `assets/css/home-footer-golden-r3.css`
- `assets/css/home-footer-golden-r3-1.css`
- `assets/css/home-footer-golden-r3-2-polish.css`
- `assets/css/home-footer-golden-r3-3-micro-polish.css`
- `assets/css/home-footer-signature-r4.css`
- `assets/js/home-footer-golden-r3.js`
- `assets/js/home-footer-signature-r4.js`
- `_includes/home-footer-golden-r3.html`

Footer R4 is the current material authority. Older broad/global recovery lighting is rejected historical implementation and must not be reintroduced.

## Release / cleanup rules

1. Verify `main` before every release or cleanup write.
2. Preserve a rollback before destructive cleanup.
3. Do not redesign while performing normalization or sanitation.
4. Do not use stale docs as implementation authority.
5. Do not delete history. Cleanup should target active tree, visible branches and stale public metadata.
6. Any future micro-polish must start from current `main`, not from old donor/checkpoint branches.
