# ProAI Expert — 3D Asset Provenance Register

Status: canonical internal provenance register for third-party 3D donor assets used or evaluated by ProAI Expert.

## Rules

For every external 3D donor preserve: exact source URL, asset title, creator (if known), per-file license, commercial-use permission, modification permission, attribution requirement, acquisition record, untouched originals or immutable pointers, SHA256, screenshots/evidence, and a clear boundary between donor-derived material and ProAI-authored adaptation work.

Do not infer a specific asset license from platform-wide defaults when an exact per-file record exists. Do not delete historical recovery evidence merely because newer canonical records exist.

| Asset ID | Third-party title | Creator | Exact source | License | Commercial | Modification | Attribution | Acquisition | Original evidence | SHA256 | ProAI adaptation | Evidence status | Open risks |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| BOXES_HOVER | Boxes Hover | Vlad Kolokolnikov / vladkolokolnikov | https://community.spline.design/file/a1f156f7-ef01-42d1-bf7b-5be1b7967b0a | CC BY 4.0 | Yes | Yes | Required | 2026-09-01 session | `boxes_hover.spline`, `boxes_hover.glb` acquired from Spline Remix/export | GLB `bf08adff36c83b5d4becdddac3d68d1a83e5c985b9d7ee71aad516afb202d401`; SPLINE `49a6b63e3b4dbefc936ea4c91dc79e12d7869f4b3aa80437e58dc8eb50683aff` | Not yet integrated; future ProAI work must be logged separately | COMPLETE for source/license/hash; screenshots should remain preserved when available | Attribution must accompany production use; do not imply creator endorsement |
| ORIGINAL_PROAI_CUBE | rubik's cube animation | NOT RECOVERED | https://community.spline.design/file/285d0202-c418-45e7-be1e-43b2338acb14 | CC0 1.0 | Yes | Yes | Not legally required under CC0 | 2026-08-11 recovery session | Clean GLB + two distinct `.splinecode` variants + recovery dumps | Clean GLB `dbb7fc4156f8c9ed2481dd76443dffb9a45ecb5493463f99bffb34dd3b59c79b`; splinecode variants `90F669182F8E98EAE1A619477C7019E373308473E514FD420D8F0F47AFE2826D` and `0FF01F004EBEA2C73CD9EF654D5E369FB1C0A90D8AC35640C132B9F270C33049` | Independent Three.js mechanics, reconstructed runtime geometry treatment, motion/presentation systems, materials, lighting, interactions, homepage integration | PARTIAL: exact creator and acquisition-day license screenshot not recovered | Preserve both splinecode variants; avoid implying official Rubik's endorsement |

## Public attribution policy

Production assets that require attribution should be listed on a future `/legal/third-party-assets/` page or equivalent persistent legal/credits location. Boxes Hover requires attribution. The Cube source is currently recorded as CC0 1.0, so attribution is not legally required by CC0, but internal source provenance must remain preserved.
