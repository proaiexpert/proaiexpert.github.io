#!/usr/bin/env bash
set -euo pipefail
PRODUCT_SHA='a4e93f645188fa92087121da4aa8c5bb839a3719'
MAIN_SHA='c945084e1952c05c686494091f7dbca0f7acdf08'
ROOT="$GITHUB_WORKSPACE"
PRODUCT_DIR='/tmp/proai-r443-live-product'
PORT=4173

cd "$ROOT"
git fetch origin main --depth=1
test "$(git rev-parse origin/main)" = "$MAIN_SHA"
rm -rf "$PRODUCT_DIR"
git worktree add --detach "$PRODUCT_DIR" "$PRODUCT_SHA"
test "$(git -C "$PRODUCT_DIR" rev-parse HEAD)" = "$PRODUCT_SHA"

cd "$PRODUCT_DIR/docs/site-evolution/spline/proai-cube-semantic-brand-face-r4"
timeout 180s npm install --package-lock=false
timeout 180s npm run build-r443
node --check main.generated.js
grep -Fq 'PROAI_CUBE_R4.4.3' main.generated.js
grep -Fq 'enterScore:.64' main.generated.js
grep -Fq 'rearmScore:.56' main.generated.js
grep -Fq 'semanticVelocityMultiplier: 1.0' main.generated.js
! grep -Fq 'emissiveIntensity' main.generated.js

nohup python3 -m http.server "$PORT" --bind 127.0.0.1 --directory dist >/tmp/r443-http.log 2>&1 &
HTTP_PID=$!
trap 'kill "$HTTP_PID" 2>/dev/null || true; if [ -f /tmp/r443-tunnel.pid ]; then kill "$(cat /tmp/r443-tunnel.pid)" 2>/dev/null || true; fi' EXIT
for i in $(seq 1 30); do
  if curl -fsS --max-time 3 "http://127.0.0.1:$PORT/" >/dev/null; then break; fi
  sleep 1
  test "$i" -lt 30
done

curl -fsSL --max-time 90 https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o /tmp/cloudflared
chmod +x /tmp/cloudflared
REVIEW_URL=''
for attempt in 1 2; do
  LOG="/tmp/r443-cloudflare-${attempt}.log"
  /tmp/cloudflared tunnel --no-autoupdate --url "http://127.0.0.1:$PORT" >"$LOG" 2>&1 &
  PID=$!
  echo "$PID" >/tmp/r443-tunnel.pid
  for i in $(seq 1 45); do
    URL=$(grep -Eo 'https://[a-z0-9-]+\.trycloudflare\.com' "$LOG" | tail -1 || true)
    if [ -n "$URL" ] && curl -fsSL --max-time 10 "$URL/" >/tmp/r443-public.html 2>/dev/null; then
      REVIEW_URL="$URL"
      break 2
    fi
    sleep 1
  done
  kill "$PID" 2>/dev/null || true
  rm -f /tmp/r443-tunnel.pid
done
test -n "$REVIEW_URL"

HTTP_CODE=$(curl -sS -L -o /tmp/r443-index.html -w '%{http_code}' --max-time 15 "$REVIEW_URL/")
test "$HTTP_CODE" = '200'
test -s /tmp/r443-index.html
CSS=$(sed -n 's/.*href="\([^"]*\.css\)".*/\1/p' /tmp/r443-index.html | head -1)
JS=$(sed -n 's/.*src="\([^"]*\.js\)".*/\1/p' /tmp/r443-index.html | head -1)
test -n "$CSS"
test -n "$JS"
curl -fsSL --max-time 15 "$REVIEW_URL$CSS" -o /tmp/r443-app.css
test -s /tmp/r443-app.css
curl -fsSL --max-time 15 "$REVIEW_URL$JS" -o /tmp/r443-app.js
test -s /tmp/r443-app.js
GLB=$(grep -Eo 'rubik_39_s_cube_animation-[A-Za-z0-9_-]+\.glb' /tmp/r443-app.js | head -1)
test -n "$GLB"
curl -fsSL --max-time 15 "$REVIEW_URL/assets/$GLB" -o /tmp/r443-cube.glb
test "$(wc -c </tmp/r443-cube.glb | tr -d ' ')" -eq 279412

echo "STATIC_CHECK HTTP=PASS HTML=PASS CSS=PASS JS=PASS Three.js=PASS GLB=PASS"
PR_NUMBER=$(jq -r '.pull_request.number' "$GITHUB_EVENT_PATH")
BODY="PROAI CUBE R4.4.3 LIVE OWNER REVIEW ONLY

Exact product: $PRODUCT_SHA
LIVE_OWNER_URL=$REVIEW_URL
EXPECTED_LIFETIME=approximately 3 hours
PUBLIC STATIC CHECK: HTTP PASS / HTML PASS / CSS PASS / JS PASS / Three.js PASS / GLB PASS
HEADLESS WEBGL MOTION GATE: SKIPPED BY CONTROL DECISION
HEADLESS SEMANTIC GATE: SKIPPED BY CONTROL DECISION
PRODUCT UNCHANGED"
gh api "repos/$GITHUB_REPOSITORY/issues/$PR_NUMBER/comments" -f body="$BODY" >/tmp/r443-comment.json
echo "LIVE_OWNER_URL=$REVIEW_URL"

for i in $(seq 1 180); do
  curl -fsSL --max-time 10 "$REVIEW_URL/" >/dev/null
  sleep 60
done
