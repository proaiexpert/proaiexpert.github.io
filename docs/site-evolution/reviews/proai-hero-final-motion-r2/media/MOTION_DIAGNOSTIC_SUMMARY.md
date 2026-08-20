# Final Cube Motion R2 — Diagnostic Summary

- Product: 83fcda3d7c365af8aa951cce523f9c93971b6db9
- Required seeds: 142857, 271828, 314159
- Owner-video seed: 142857
- Overall automated acceptance: **FAIL**
- Mechanics / exact endpoints: **PASS**
- Anti-repetition audit: **PASS**
- Pose readability envelope: **PASS**
- Active slice completes during held drag: **PASS**
- Desktop interaction/no-snap/resume: **FAIL** (snap 0.0000°, resume 0.0340°)
- Mobile touch/no-snap/resume: **FAIL** (snap 0.0000°, resume 0.0340°)
- No velocity jump: **PASS**
- Mobile aspect: **PASS**
- Canonical transform safety: **PASS**
- Video event coverage: **FAIL**
- Desktop coverage: singles 1, pairs 2, phrases 1, breaths 1
- Mobile coverage: singles 3, pairs 2, phrases 1, breaths 2

## Five-minute generator audit
- Seed 142857: PASS; moves 210; exact repeats 0; immediate inverse 0; short-window inverse 0; recent phrase repeats 2/3/4/5 = 0/0/0/0; axis spread 1.4%; direction spread 5.7%
- Seed 271828: PASS; moves 210; exact repeats 0; immediate inverse 0; short-window inverse 0; recent phrase repeats 2/3/4/5 = 0/0/0/0; axis spread 3.8%; direction spread 1.9%
- Seed 314159: PASS; moves 210; exact repeats 0; immediate inverse 0; short-window inverse 0; recent phrase repeats 2/3/4/5 = 0/0/0/0; axis spread 0.0%; direction spread 4.8%

## Runtime seed review
- Seed 142857: PASS; pose quality min 1.000; speed 13.67–16.27 deg/s; observed moves 3
- Seed 271828: PASS; pose quality min 1.000; speed 13.90–15.74 deg/s; observed moves 3
- Seed 314159: PASS; pose quality min 1.000; speed 13.51–15.71 deg/s; observed moves 3
