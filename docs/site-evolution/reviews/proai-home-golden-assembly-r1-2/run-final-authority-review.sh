#!/usr/bin/env bash
set -Eeuo pipefail
RUNNER='docs/site-evolution/reviews/proai-home-golden-assembly-r1-2/run-final-review-v2.sh'
# Golden assembly intentionally strips the canonical donor's embedded .tw-tech-r2 block.
sed -i 's/ee48db8f844f61e3abb10f603bf8dabb3987dbc3/166eb49ffb4517f05d3ae2cfce4188eb9e6132ab/' "$RUNNER"
# R1.4 root class is also a prefix of ledger classes; use the unique section data marker for the static build gate.
sed -i "s/assert t.count('home-fs-showcase-r14')==1/assert t.count('data-fs-showcase-r11')==1 and 'home-fs-showcase-r14' in t/" "$RUNNER"
exec bash "$RUNNER"
