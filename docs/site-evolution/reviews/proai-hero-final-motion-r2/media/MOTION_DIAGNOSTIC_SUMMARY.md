# Final Cube Motion R2 — Diagnostic Summary

- Product: 7413c94d622d412a6991b9353a247f826539c84e
- Required seeds: 142857, 271828, 314159
- Owner-video seed: 142857
- Overall automated acceptance: **FAIL**
- Mechanics / exact endpoints: **PASS**
- Anti-repetition audit: **PASS**
- Pose readability envelope: **PASS**
- Active slice completes during held drag: **PASS**
- Desktop interaction/no-snap/resume: **FAIL** (snap 0.0000°, resume 0.0085°)
- Mobile touch/no-snap/resume: **FAIL** (snap 0.0000°, resume 0.0085°)
- No velocity jump: **PASS**
- Mobile aspect: **PASS**
- Canonical transform safety: **PASS**
- Video event coverage: **FAIL**
- Desktop coverage: singles 3, pairs 1, phrases 2, breaths 1
- Mobile coverage: singles 3, pairs 1, phrases 2, breaths 3

## Five-minute generator audit
- Seed 142857: PASS; moves 210; exact repeats 0; immediate inverse 0; short-window inverse 0; recent phrase repeats 2/3/4/5 = 0/0/0/0; axis spread 1.4%; direction spread 5.7%
- Seed 271828: PASS; moves 210; exact repeats 0; immediate inverse 0; short-window inverse 0; recent phrase repeats 2/3/4/5 = 0/0/0/0; axis spread 3.8%; direction spread 1.9%
- Seed 314159: PASS; moves 210; exact repeats 0; immediate inverse 0; short-window inverse 0; recent phrase repeats 2/3/4/5 = 0/0/0/0; axis spread 0.0%; direction spread 4.8%

## Runtime seed review
- Seed 142857: PASS; pose quality min 1.000; speed 13.51–16.00 deg/s; observed moves 3
- Seed 271828: PASS; pose quality min 1.000; speed 13.51–16.00 deg/s; observed moves 3
- Seed 314159: PASS; pose quality min 1.000; speed 13.85–15.69 deg/s; observed moves 2
