# Final Cube Motion R2 — Diagnostic Summary

- Product: 7413c94d622d412a6991b9353a247f826539c84e
- Seeds: 142857, 271828, 314159
- Overall automated acceptance: **FAIL**
- Mechanics / exact endpoints: **PASS**
- Anti-repetition audit: **PASS**
- Active slice completes during held drag: **PASS**
- Desktop interaction/no-snap: **FAIL** (release delta 0.0000°)
- Mobile touch/no-snap: **FAIL** (release delta 0.0000°)
- Mobile aspect: **PASS**
- Canonical transform safety: **PASS**
- Video event coverage: **FAIL**
- Desktop coverage: singles 2, pairs 1, phrases 2, breaths 1
- Mobile coverage: singles 2, pairs 1, phrases 2, breaths 1

## Five-minute generator audit
- Seed 142857: PASS; moves 210; exact repeats 0; immediate inverse 0; short-window inverse 0; recent phrase repeats 2/3/4/5 = 0/0/0/0; axis spread 1.4%; direction spread 5.7%
- Seed 271828: PASS; moves 210; exact repeats 0; immediate inverse 0; short-window inverse 0; recent phrase repeats 2/3/4/5 = 0/0/0/0; axis spread 3.8%; direction spread 1.9%
- Seed 314159: PASS; moves 210; exact repeats 0; immediate inverse 0; short-window inverse 0; recent phrase repeats 2/3/4/5 = 0/0/0/0; axis spread 0.0%; direction spread 4.8%

## Runtime seed review
- Seed 142857: FAIL; pose quality min NaN; speed 13.51–17.15 deg/s; observed moves 3
- Seed 271828: FAIL; pose quality min NaN; speed 14.10–16.58 deg/s; observed moves 3
- Seed 314159: FAIL; pose quality min NaN; speed 13.87–17.15 deg/s; observed moves 3
