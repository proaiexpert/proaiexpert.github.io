#!/usr/bin/env bash
set -euo pipefail

path="assets/img/hero-c-shape/core-static-master-isolated.avif"
expected_size="48100"
expected_sha="c6cc0ba89b7145bdbd796b7fd778e6c788133d3e278265947b7ce90793e458d8"

current_size="$(wc -c < "$path" | tr -d ' ')"
current_sha="$(sha256sum "$path" | awk '{print $1}')"
echo "Current Core: size=$current_size sha=$current_sha"

if [[ "$current_size" == "$expected_size" && "$current_sha" == "$expected_sha" ]]; then
  echo "Current Core already matches R2 manifest."
  exit 0
fi

candidates=(
  "agent/hero-c-shape-grounding-correction"
  "agent/hero-c-shape-a-plus-browser-prototype"
  "agent/hero-c-shape-grounding-polish-r2"
  "main"
)

idx=0
for branch in "${candidates[@]}"; do
  idx=$((idx + 1))
  ref="refs/remotes/origin/recover-$idx"
  echo "Checking $branch ..."
  git fetch --no-tags --depth=1 origin "refs/heads/$branch:$ref"
  if ! git cat-file -e "$ref:$path" 2>/dev/null; then
    echo "  asset not present"
    continue
  fi
  git show "$ref:$path" > /tmp/core-candidate.avif
  size="$(wc -c < /tmp/core-candidate.avif | tr -d ' ')"
  digest="$(sha256sum /tmp/core-candidate.avif | awk '{print $1}')"
  echo "  size=$size sha=$digest"
  if [[ "$size" == "$expected_size" && "$digest" == "$expected_sha" ]]; then
    cp /tmp/core-candidate.avif "$path"
    echo "RECOVERED canonical Core from $branch"
    exit 0
  fi
done

echo "ERROR: canonical Core matching R2 manifest was not found in candidate refs" >&2
exit 1
