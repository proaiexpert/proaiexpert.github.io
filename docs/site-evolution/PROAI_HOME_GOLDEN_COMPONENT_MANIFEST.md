# ProAI Home Golden Component Manifest

Recovery date: 2026-08-17

- Production main / Golden Assembly base: `c945084e1952c05c686494091f7dbca0f7acdf08`
- Recovery branch: `agent/proai-home-golden-assembly-r1`
- Golden Assembly product SHA: `6968afc698fc583b4573cf8056476ad984fa52d7`

## Logo — OWNER APPROVED

Accepted source: `agent/proai-logo-signature-object-r2` @ `b1500199cebec05b0ce1fc802296471a36d0c060`.
Homepage integration source: final Header lineage @ `20a36a5246ac2fb4507c69858289fc55d0f4a977`.

Critical integration identities:
- `assets/css/header-footer-logo-r1.css` — `b9cf2f5c0ba7a21dfedc2b41ccbcbf015fd4a71b`
- `assets/js/header-footer-logo-r1.js` — `c13acce20f36ea4804c35e8ba9faedba3d3e5cbf`
- `assets/brand/proai-logo-r341/live-runtime.js` — `994d58992a8f7bf607056ffcafd35b7039d4705b`
- `assets/brand/proai-logo-r341/live.html` — `28ea5404c478890a9282b666c3f8a528e0443e69`
- `assets/brand/proai-logo-r341/proai-header-r111-static-cube-320.png` — `7e00a181d70ea61420af88d0d9b503ab68de0816`
- `assets/brand/proai-logo-r341/proai-logo-r341-static-cube-320.png` — `ea840b5caab264e060ba1c32e4d9b38e32546963`
- `assets/fonts/proai-logo-r341/instrument-sans-latin-wght-normal.woff2` — `8611e41b14c75cfc8360e50d0d22a22d20a1de50`

Canonical Cube GLB SHA256: `dbb7fc4156f8c9ed2481dd76443dffb9a45ecb5493463f99bffb34dd3b59c79b`.

## Header — FROZEN

Final product source: `20a36a5246ac2fb4507c69858289fc55d0f4a977` (`fix: add canonical mobile Header auto-hide`), on top of final navigation/mobile-menu product `5279084dde5f17c0193bc533f9dc67b45893ee8d`; owner-ready review lineage includes `d8f6d9fd3959dc738e592490053787697a89f3bf`.

Critical identities:
- `_includes/header-system/header.html` — `6edc924df1df630a69379dfd746d161bab2fbe98`
- `_data/header.yml` — `e43d76c80a833c9123e6d06a08c45a38edd61158`
- `_data/navigation.yml` — `64a1fbe4492eebb8c5f3cacede448e5c91327318`
- `assets/css/header-system-v1.css` — `1e7651d5014b7b2e6f3d6a662b5431a7692f71`
- `assets/js/header-system-v1.js` — `bb107dd6054ba5210b4f77568e04014cdb239c55`

Do not regress to pre-canonical mobile auto-hide JS or duplicate Header mounts.

## Hero — FROZEN

Accepted product: `agent/hero-r3-owner-candidate-browser` @ `735982473854c29a6f1eeeb4d87773abbc573b4d`.

Critical source identities:
- `index.html` — `cab56696783a9fc2800bc02da9768b8266a753e4`
- `ru/index.html` — `c23f8c1c2e39a4ccc866fc4a80859a44afbb9043`
- `assets/css/homepage-hero-signature-r3.css` — `5dde833560aac0958875842a598f622942597b74`

Integration is via the verified Home Assembly wrapper lineage; Header work is a descendant of this Hero and does not alter the Hero component content except assembly/header wiring.

## Hero Cube — FROZEN / GOLDEN MOTION

Accepted source: Golden Hero `735982473854c29a6f1eeeb4d87773abbc573b4d`.

Critical identities:
- `assets/js/proai-hero-cube-r1/bootstrap.js` — `b46b26164efc000daef8ecb3416039008db7cd79`
- `assets/js/proai-hero-cube-r1/source-materials-r1.js` — `bab6b00e73b20fc2a51aeb00cb7fc08f16129e72`
- `assets/models/proai-cube/rubik_39_s_cube_animation.glb` — Git blob `7992019d85304c16244d0ca55a8cf15c13c26190`; SHA256 `dbb7fc4156f8c9ed2481dd76443dffb9a45ecb5493463f99bffb34dd3b59c79b`.

Do not use later semantic-owned motion, continuous-positive yaw, sequential-only slicing, forced orientation, global slowdown, or turntable behavior.

## Semantic Cube R1 — PRESERVED R&D / OWNER REVIEW BLOCKED

Branch: `agent/proai-cube-golden-hero-semantic-r1`

Product: `1f897995edd67ac52b6a69c90d9b5bfe7c65cfbf` (`fix: acquire semantic faces from current cube state`)

Status: **PRESERVED R&D PRODUCT / OWNER VISUAL REVIEW BLOCKED**  
Golden status: **NOT GOLDEN**  
Owner approval: **NOT APPROVED**  
Homepage assembly authorization: **NO**

This checkpoint preserves the later physical Semantic Cube work, including the Dynamic Current-Face Acquisition correction. It is intentionally not used by Golden Homepage Assembly R1. The accepted Hero Cube at `735982473854c29a6f1eeeb4d87773abbc573b4d` remains the authoritative Golden Cube.

Semantic Cube R1 requires a separate successful visual-review recovery before any future homepage substitution can be considered. Previous blank/fog-only standalone previews were review/runtime packaging failures and are not evidence that the Git product commit was lost, that the Golden Cube failed, or that the Semantic Cube branch may be deleted or rewritten.

This branch/commit must not be deleted during cleanup until Semantic Cube disposition is explicitly decided by Owner. Later rejected Semantic Cube experiments must not become Golden motion authority. No Semantic Cube state may silently change Golden whole-cube motion, signed yaw, pitch/roll, paired staggered slice behavior, Golden scheduler, or camera/orbit behavior without a separate Owner-approved task.

## Connected System — OWNER APPROVED

Product branch: `agent/proai-connected-system-final-calibration-r1`.
Final product: `d5f2e2fd85218b2a98e774b0b19df1536240d4fb`.
Premium-motion parent: `4e8b12e040f1024e8ece5185a8ea02e6bd8d0981`.
Final review: `499afe600a7b064e5ede831554c543f47d7a5eb1`.

Critical identities:
- `assets/js/homepage-connected-system-r13.js` — `8fba38d49366bb69b7e06f9527dd4d07d8d05279`
- `assets/css/homepage-connected-system-r13.css` — `b99dfc19739070fee88d47c94c202d60feab7619`
- `_includes/homepage-connected-system-en.html` — `6bf4b0c236ab9063b7588faf5c59f660f64b71aa`
- `_includes/homepage-connected-system-ru.html` — `92081f9f98f43a9f794d2c5a49b7bce19aafae16`

Locked cadence: `firstActive=760`, `stageOffset=1900`, `transferDuration=620`, `transferLead=610`, `departureLead=260`, `arrivalLead=190`.
Locked text rhythm: desktop `6.04em`; compact desktop `5.76em`; 761–1100px `7.2em`; mobile `0`.

Known regressed Home Assembly identities that must not be used:
- JS `1fe31763ef41b97277cf0b692337a09a3568bb0a` (`650/520` cadence)
- CSS `946780c076fc6a2e4811e41f88a5a8f18a915baa` (pre-final typography calibration)

## Fourth block / Two Worlds — IN PROGRESS

Latest in-progress product snapshot: `411937c0e1367681891ef562e02d333681984c39` (Bimetal Fold R2.2).
R2.1 product parent lineage: `bdbf7a3195b269186c9a61938ab56c65edc533af`; R2.1 controlled review capture: `6fed1a4c123708e063a81ac2d4fe0191ef2f66eb`.
No explicit Owner approval freezing R2.2 was found; it remains IN PROGRESS and is preserved without design changes.

Critical current identities:
- `_includes/homepage-two-worlds-r2-en.html` — `9f68f8d6832cd50f400eebdfa39c4c0b1d808931`
- `_includes/homepage-two-worlds-r2-ru.html` — `98d0b0509bba746629f12f3e22f858c7afb5e0dd`
- `assets/css/homepage-two-worlds-r2.css` — `b223e33734d0bf1411e55a997263fafc1e32b1c9`
- `assets/js/homepage-two-worlds-r2.js` — `b2da88b805fe07eea7fcdad491efd2c5ce6d7f82`
- `assets/css/homepage-two-worlds-r21.css` — `f6e235807eb5c238cf5849ae222f192de1a5d09b`
- `assets/js/homepage-two-worlds-r21.js` — `94977c8128a4a5f62eb5df4ed80ab2892a86250f`
- `assets/css/homepage-two-worlds-r22.css` — `63e9d73d4ecad2c339ac42a61b0cdf39663894b2`
- `assets/js/homepage-two-worlds-r22.js` — `1983ba4bef7816501a7605293a95b828d3748b06`

## Shared assembly wiring

Controlled wiring source: latest Two Worlds R2.2 snapshot `411937c0e1367681891ef562e02d333681984c39`, descended from Home Assembly product `0c0613cd40d0f396d9dbf05bf2f8a61658ff4ae0`.

Critical wiring identities:
- `_includes/homepage-assembly-base-en.html` — `72a5a6e84b6bfd47753bbce8a7ccfbc9c5cffd22`
- `_includes/homepage-assembly-base-ru.html` — `690ccf7d82368b57b29dc66031c010db2cbb8b94`
- `index.html` — `eba5f5f7c63a4519861251e894fcef4c0406c8cf`
- `ru/index.html` — `ff91c72ba2a6cdc7fa2e1db4c57001b8152b5cea`
- `assets/js/homepage-core-hardening-v1.js` — `4ffd9833232177f77d4189811a21b71dd28201dc`
- `mobile-pass-v141.css` — `5bd5bf4ddcb9fe4af0979abe63d4267251c561cd`

Connected System component blobs are replaced from `d5f2e2fd85218b2a98e774b0b19df1536240d4fb`; latest Two Worlds R2.2 production files/wiring remain exact to `411937c0e1367681891ef562e02d333681984c39`.

## Recovery rule

Use file/blob-level recovery only. No historical branch merge/cherry-pick, no review workflow import, no tunnel/review infrastructure import, no cleanup, no main modification.
