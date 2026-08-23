#!/usr/bin/env bash
set -Eeuo pipefail
RUNNER='docs/site-evolution/reviews/proai-home-golden-assembly-r1-2/run-final-review-v2.sh'
# Golden assembly intentionally strips the canonical donor's embedded .tw-tech-r2 block.
# Therefore the assembly include hash is 166eb49..., not the full donor hash ee48db8....
sed -i 's/ee48db8f844f61e3abb10f603bf8dabb3987dbc3/166eb49ffb4517f05d3ae2cfce4188eb9e6132ab/' "$RUNNER"
exec bash "$RUNNER"
