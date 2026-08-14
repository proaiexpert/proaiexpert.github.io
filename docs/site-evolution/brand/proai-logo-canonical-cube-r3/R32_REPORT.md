# ProAI Logo R3.2 — Canonical Premium Lockup Polish

R3.2 is a narrow polish pass on the accepted architecture. It does not create a new symbol or a new logo system.

## Locked architecture

- Exact physical canonical ProAI Cube on the left.
- Exact visible wordmark: `ProAI Expert`.
- One horizontal row.
- Dark Obsidian master first.
- Static master plus slow living digital companion.

## Wordmark correction

R3 uppercase was rejected. R3.2 uses the exact required casing `ProAI Expert`, with no `text-transform: uppercase`.

The wordmark uses the already-bundled **Instrument Sans Variable** family from the canonical Cube/brand runtime. The final review treatment is weight 700, with separate optical tracking: `ProAI -0.024em`, `Expert -0.016em`. The word gap is `0.31em` at master scale and `0.34em` at Header scale.

The color system is a restrained Pearl/Silver studio response: ProAI transitions microscopically from `#F2F0EB` to `#EBE9E4`; Expert from `#D0D3D2` to `#C5C9CB`. There is no cyan, glow, gold, neon, or animated typography.

## Cube portrait correction

The same verified GLB is used directly. Geometry is unchanged.

R3 used the `t=7.0s` presentation portrait. R3.2 performed an internal optical pose study across the frozen canonical presentation path and selected `t=42.0s`:

- semantic-facing plane: `+Z`
- visibility dot: `0.8942451358899213`
- integrated yaw: `419.19315000000074°`
- normalized yaw: `59.19315000000074°`
- pitch: `-5.245536154837076°`
- roll: `0.04696402012914522°`
- camera: `31°`

This portrait is front-dominant while retaining an explicit side plane and a restrained top plane. It materially improves immediate Cube recognition over the R3 portrait without changing geometry.

The canonical `premiumHybrid` lookdev remains the master material choice after an internal comparison against the existing `gunmetal` and `blackChrome` presets. At practical Header size, `premiumHybrid` preserved the most useful plane and seam information. Header presentation receives only a small-scale display tuning of the same rendered Cube to keep dark detail from collapsing.

## Living companion

The living state no longer traverses the full wide presentation path. It stays inside a bounded, recognizable orientation envelope centered on the exact static home pose. This keeps the Cube legible while preserving continuous living motion. Wordmark motion, slice choreography, and semantic face are disabled.

## Production safety

Production baseline remains `c945084e1952c05c686494091f7dbca0f7acdf08`. No production Header, Hero, Homepage, Footer, favicon, manifest, production CSS, or production JS is modified by R3.2.
