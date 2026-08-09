#!/usr/bin/env bash
set -euo pipefail

path="assets/img/hero-c-shape/core-static-master-isolated.avif"
source_name="FA5872D6-EA1E-4865-A94B-74CE5CFDB7F8.jpeg"
expected_size="48100"
expected_sha="c6cc0ba89b7145bdbd796b7fd778e6c788133d3e278265947b7ce90793e458d8"
source_size="334949"
source_sha="c2cecdc255eb3c0d68de142dcbddba6e8cedf1f3f036b9f9ec62c562ef66d9e4"

current_size="$(wc -c < "$path" | tr -d ' ')"
current_sha="$(sha256sum "$path" | awk '{print $1}')"
echo "Current Core: size=$current_size sha=$current_sha"

if [[ "$current_size" == "$expected_size" && "$current_sha" == "$expected_sha" ]]; then
  echo "Current Core already matches R2 manifest."
  exit 0
fi

echo "Fetching complete branch history for forensic recovery..."
git fetch --no-tags --force origin '+refs/heads/*:refs/remotes/origin/*'

echo "Scanning all commits that ever touched $path ..."
mapfile -t commits < <(git log --all --format='%H' -- "$path" | awk '!seen[$0]++')
echo "Candidate commits: ${#commits[@]}"
for commit in "${commits[@]}"; do
  if ! git cat-file -e "$commit:$path" 2>/dev/null; then
    continue
  fi
  git show "$commit:$path" > /tmp/core-candidate.avif
  size="$(wc -c < /tmp/core-candidate.avif | tr -d ' ')"
  digest="$(sha256sum /tmp/core-candidate.avif | awk '{print $1}')"
  printf '  %s size=%s sha=%s\n' "$commit" "$size" "$digest"
  if [[ "$size" == "$expected_size" && "$digest" == "$expected_sha" ]]; then
    cp /tmp/core-candidate.avif "$path"
    echo "RECOVERED exact canonical Core from commit $commit"
    exit 0
  fi
done

echo "Exact derivative not found in path history. Searching all reachable blobs by expected SHA..."
while read -r blob rest; do
  [[ -z "$blob" ]] && continue
  if [[ "$(git cat-file -t "$blob" 2>/dev/null || true)" != "blob" ]]; then
    continue
  fi
  size="$(git cat-file -s "$blob" 2>/dev/null || echo 0)"
  [[ "$size" != "$expected_size" ]] && continue
  git cat-file blob "$blob" > /tmp/core-candidate.avif
  digest="$(sha256sum /tmp/core-candidate.avif | awk '{print $1}')"
  echo "  48100-byte blob $blob sha=$digest path=$rest"
  if [[ "$digest" == "$expected_sha" ]]; then
    cp /tmp/core-candidate.avif "$path"
    echo "RECOVERED exact canonical Core from reachable blob $blob"
    exit 0
  fi
done < <(git rev-list --objects --all)

echo "Canonical derivative unavailable in reachable Git objects. Searching for authoritative STATIC MASTER..."
while read -r blob rest; do
  [[ "$rest" != *"$source_name"* ]] && continue
  [[ "$(git cat-file -t "$blob" 2>/dev/null || true)" != "blob" ]] && continue
  git cat-file blob "$blob" > /tmp/static-master.jpeg
  size="$(wc -c < /tmp/static-master.jpeg | tr -d ' ')"
  digest="$(sha256sum /tmp/static-master.jpeg | awk '{print $1}')"
  echo "  STATIC MASTER candidate blob=$blob size=$size sha=$digest path=$rest"
  if [[ "$size" == "$source_size" && "$digest" == "$source_sha" ]]; then
    echo "FOUND exact authoritative STATIC MASTER at /tmp/static-master.jpeg"
    echo "STATIC_MASTER_FOUND_BUT_DERIVATIVE_MISSING"
    exit 2
  fi
done < <(git rev-list --objects --all)

echo "ERROR: neither exact canonical Core nor exact STATIC MASTER was found in reachable Git history" >&2
exit 1
