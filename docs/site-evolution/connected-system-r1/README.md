# ProAI Connected System R1.2 — Owner Review Prototype

Isolated owner-review implementation for the post-Hero Connected System architecture.

## Product baseline

R1.1 product baseline: `0db1e58052fcecd594dfb8a53601324992779bfd`.

R1.2 preserves the approved semantic architecture and copy:

`TRUST → INQUIRY → RESPONSE → RESULT`

The correction is motion hierarchy / interaction-state work only. No semantic or production integration changes.

## R1.2 cinematic focus transfer

- Desktop/laptop presents the four stages sequentially using explicit `future → active → settled` states.
- Stage activation cadence is **520ms**; the full establishment / four-stage story settles in approximately **3.0 seconds**.
- Each handoff uses the existing machined rail as the physical carrier: prior stage settles, rail material response moves, next joint catches Pearl, then number/name/body/components resolve with internal stagger.
- Active stages receive a broad low-opacity neutral local light field; no card, glow box, cyan or progress-fill treatment is used.
- Desktop final state is balanced, followed by irregular local ambient events every **7–12 seconds**. The full four-stage sequence never loops automatically.
- Desktop pointer/focus inspection can activate any stage after the entry sequence; other stages settle and the rail focus follows.
- Mobile is scroll-driven and reversible rather than autoplayed: a stage becomes active when it occupies the **45–68% viewport reading band**.
- Mobile uses a **132px vertical material focus window** moving between stage joints over approximately **580ms**; reverse scroll restores prior stage focus naturally.
- Mobile replay demonstrates only the current local stage/focus transfer and never auto-scrolls or activates offscreen stages.
- Mobile ambient randomness is intentionally removed from the primary experience; scroll focus transfer is the living mechanism.
- Without JavaScript and under `prefers-reduced-motion: reduce`, all content remains fully visible and readable in a premium static state.

## Responsive strategy

- Large desktop retains architectural breathing room.
- 1200×800, 1280×800 and 1366×768 retain the R1.1 compact laptop composition so the entire core system reads as one coherent horizontal object.
- 390×844 and 430×932 use the vertical machined rail and discrete reading-zone focus.
- 844×390 and 932×430 remain in compact vertical architecture because height is the limiting dimension.

## Isolation

Product files are confined to this directory. Production `index.html`, `ru/index.html`, Hero, Header, Cube, Logo and global production styles/scripts are not modified.

The Hero shown in `en.html` / `ru.html` is review context referencing the locked product assets from base commit `735982473854c29a6f1eeeb4d87773abbc573b4d`.

No merge. No deployment. Owner review only.
