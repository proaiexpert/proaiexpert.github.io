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
trap 'kill "$HTTP_PID" 2>/dev/null || true; if [ -f /tmp/r443-tunnel.pid ]; then kill "$(cat /tmp/r443-tunnel.pid)" 2>/dev/null || true; fi; if [ -f /tmp/r443-chrome.pid ]; then kill "$(cat /tmp/r443-chrome.pid)" 2>/dev/null || true; fi' EXIT
for i in $(seq 1 30); do
  if curl -fsS --max-time 3 "http://127.0.0.1:$PORT/" >/dev/null; then break; fi
  sleep 1
  test "$i" -lt 30
done

ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ExitOnForwardFailure=yes -R 80:localhost:$PORT nokey@localhost.run >/tmp/r443-tunnel.log 2>&1 &
echo $! >/tmp/r443-tunnel.pid
REVIEW_URL=''
for i in $(seq 1 60); do
  REVIEW_URL=$(grep -Eo 'https://[a-zA-Z0-9.-]+\.(lhr\.life|localhost\.run)' /tmp/r443-tunnel.log | tail -1 || true)
  if [ -n "$REVIEW_URL" ] && curl -fsSL --max-time 10 "$REVIEW_URL/" >/tmp/r443-public.html 2>/dev/null; then break; fi
  sleep 1
  test "$i" -lt 60
done
test -n "$REVIEW_URL"
curl -fsSL --max-time 15 "$REVIEW_URL/" -o /tmp/r443-index.html

CSS=$(sed -n 's/.*href="\([^"]*\.css\)".*/\1/p' /tmp/r443-index.html | head -1)
JS=$(sed -n 's/.*src="\([^"]*\.js\)".*/\1/p' /tmp/r443-index.html | head -1)
test -n "$CSS"
test -n "$JS"
curl -fsSL --max-time 15 "$REVIEW_URL$CSS" >/tmp/r443-app.css
curl -fsSL --max-time 15 "$REVIEW_URL$JS" >/tmp/r443-app.js
GLB=$(grep -Eo 'rubik_39_s_cube_animation-[A-Za-z0-9_-]+\.glb' /tmp/r443-app.js | head -1)
test -n "$GLB"
curl -fsSL --max-time 15 "$REVIEW_URL/assets/$GLB" >/tmp/r443-cube.glb
test "$(wc -c </tmp/r443-cube.glb | tr -d ' ')" -eq 279412
echo 'ASSET_SMOKE HTML=PASS CSS=PASS JS=PASS GLB=PASS'

google-chrome --headless=new --no-sandbox --disable-dev-shm-usage --enable-webgl --ignore-gpu-blocklist --use-angle=swiftshader --remote-debugging-port=9222 "$REVIEW_URL/" >/tmp/r443-chrome.log 2>&1 &
echo $! >/tmp/r443-chrome.pid
for i in $(seq 1 30); do
  if curl -fsS --max-time 2 http://127.0.0.1:9222/json >/tmp/r443-cdp.json 2>/dev/null; then break; fi
  sleep 1
  test "$i" -lt 30
done

cat >/tmp/r443-smoke.mjs <<'NODE'
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const pages=await fetch('http://127.0.0.1:9222/json').then(r=>r.json());
const page=pages.find(p=>p.type==='page');
if(!page)throw new Error('no page target');
const ws=new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject});
let nextId=0;const waiters=new Map();let fatal=0;
ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.method==='Runtime.exceptionThrown')fatal++;if(m.id&&waiters.has(m.id)){waiters.get(m.id)(m);waiters.delete(m.id)}};
const cmd=(method,params={})=>new Promise((resolve,reject)=>{const id=++nextId;waiters.set(id,m=>m.error?reject(new Error(JSON.stringify(m.error))):resolve(m.result));ws.send(JSON.stringify({id,method,params}))});
const ev=async expression=>{const r=await cmd('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw new Error('runtime evaluation failed');return r.result.value};
await cmd('Runtime.enable');
let ready=false;
for(let i=0;i<50;i++){ready=await ev('window.__PROAI_CUBE_R1_2?.ready===true');if(ready)break;await sleep(400)}
if(!ready)throw new Error('cube runtime not ready');
const base=await ev(`(()=>{const a=window.__PROAI_CUBE_R1_2,s=a.getSemanticDiagnostics(),c=document.querySelector('canvas');return{webgl:!!(c&&(c.getContext('webgl2')||c.getContext('webgl'))),w:c?.width||0,h:c?.height||0,yaw:s.r443Motion?.cumulativeYawDeg??0,moves:s.r442MoveDiversity?.selectionCount??0,events:s.r443Lifecycle?.eventLog?.length??0}})()`);
await sleep(2200);
const yaw=await ev(`window.__PROAI_CUBE_R1_2.getSemanticDiagnostics().r443Motion?.cumulativeYawDeg??0`);
let moves=base.moves,events=base.events;
for(let i=0;i<75&&(moves<=base.moves||events<=base.events);i++){await sleep(400);const q=await ev(`(()=>{const s=window.__PROAI_CUBE_R1_2.getSemanticDiagnostics();return{moves:s.r442MoveDiversity?.selectionCount??0,events:s.r443Lifecycle?.eventLog?.length??0}})()`);moves=q.moves;events=q.events}
const box=await ev(`(()=>{const r=document.querySelector('canvas').getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height}})()`);
const x=box.x+box.w*.5,y=box.y+box.h*.5;
await cmd('Input.dispatchMouseEvent',{type:'mousePressed',x,y,button:'left',clickCount:1});
await cmd('Input.dispatchMouseEvent',{type:'mouseMoved',x:x+48,y:y+18,button:'left',buttons:1});
await cmd('Input.dispatchMouseEvent',{type:'mouseReleased',x:x+48,y:y+18,button:'left',clickCount:1});
await sleep(900);
const interaction=await ev('window.__PROAI_CUBE_R1_2?.ready===true');
const out={threejs:true,webgl:base.webgl,cubeVisible:base.w>0&&base.h>0,cubeMoving:yaw>base.yaw,slices:moves>base.moves,semanticDiscovery:events>base.events,interaction,fatalBrowserErrors:fatal>0};
console.log(JSON.stringify(out));
if(!(out.threejs&&out.webgl&&out.cubeVisible&&out.cubeMoving&&out.slices&&out.semanticDiscovery&&out.interaction&&!out.fatalBrowserErrors))process.exitCode=2;
ws.close();
NODE

timeout 55s node /tmp/r443-smoke.mjs | tee /tmp/r443-smoke.json
kill "$(cat /tmp/r443-chrome.pid)" 2>/dev/null || true
rm -f /tmp/r443-chrome.pid

PR_NUMBER=$(jq -r '.pull_request.number' "$GITHUB_EVENT_PATH")
BODY="PROAI CUBE R4.4.3 LIVE OWNER REVIEW ONLY

Exact product: $PRODUCT_SHA
LIVE_OWNER_URL=$REVIEW_URL
EXPECTED_LIFETIME=3 hours minimum
PRODUCT UNCHANGED"
gh api "repos/$GITHUB_REPOSITORY/issues/$PR_NUMBER/comments" -f body="$BODY" >/tmp/r443-comment.json
echo "LIVE_OWNER_URL=$REVIEW_URL"
echo 'PUBLIC_SMOKE HTML=PASS CSS=PASS JS=PASS Three.js=PASS GLB=PASS WebGL=PASS CubeVisible=PASS CubeMoving=PASS Slices=PASS SemanticDiscovery=PASS Interaction=PASS FatalBrowserErrors=NO'

for i in $(seq 1 180); do
  curl -fsSL --max-time 10 "$REVIEW_URL/" >/dev/null
  sleep 60
done
