# PROAI EXPERT — TWO WORLDS
## EXTERNAL FORENSIC HANDOFF — R4.2.2 CHROME / IPHONE MICRO-JITTER

**Purpose:** independent engineering audit. Do not redesign the section.

### 1. User/browser reality
- Owner tests on **Google Chrome on iPhone**, not Safari UI.
- Device family: iPhone 17 Pro Max-class.
- Residual issue: a small but visible **1–3 px / shimmer-like micro-jitter during the world-turn transition**.
- Locked endpoints themselves are stable.
- The same general jitter was also observed in the older production implementation, so do **not** assume the current state machine is the root cause.

### 2. Repository authority
- Repository: `proaiexpert/proaiexpert.github.io`
- Current verified production main: `bf5da6011d22644bd8e1d7d4d97e6f4a91d97342`
- Historical baseline used to build R4: `6ee55feb964ab6bcf113be7da45675eddbeeaa81`
- R4.2 base: `732ba5521d045126125dc880db4f0800dce97a4e`
- R4.2.1 A/B head: `280a2ef1caa8806134cec1e6e847fd92cee53340`
- Current R4.2.2 Chrome re-entry branch: `agent/proai-home-two-worlds-clean-golden-r4-2-2-chrome-reentry-final`
- R4.2.2 implementation commit: `2f8b55014cf369683f0be9516bff3d4b4dbe162d`

### 3. Critical integration warning
The old owner previews show an **obsolete Technology block** because they were generated from the older R4 working baseline.

Current production main already uses:
- `home-technology-fold-flow-r1-5-1.css`
- `home-technology-fold-flow-r1-5-1.html`
- `home-technology-fold-flow-r1-5-1.js`
- `home-two-worlds-tech-fs-integration-r1.css`

Therefore **DO NOT merge the R4.2.x branch wholesale into current main.**
Final integration must start from current main `bf5da6011d22644bd8e1d7d4d97e6f4a91d97342` and transplant only the approved Two Worlds assets/markup/runtime. This is mandatory to avoid regressing Technology / Selected Thinking.

### 4. What is already fixed and should not be reopened
- fullscreen portrait/landscape stage
- Header experience-owned guard
- intro centering
- AI_LOCKED / TRANSITIONING / WEB_LOCKED state model
- no `window.scrollTo`
- no raw scroll-progress transform engine
- locked RAF = 0
- locked transform writes = 0
- locked viewport-height recomposition = 0
- 1–2px scroll-noise suppression
- orientation false-scroll intent suppression
- Web re-entry catch: current R4.2.2 requires minimum 280ms hold **plus scroll settle/fresh gesture** before WEB→AI

### 5. What remains unresolved
Only investigate the physical transition jitter.

Owner reports:
1. design/materials are accepted;
2. reverse Web catch is now substantially acceptable;
3. micro-jitter still exists across many revisions;
4. historically an older differently-colored Two Worlds implementation felt smooth.

### 6. Main forensic question
Determine whether visible Chrome/iPhone jitter comes from:
- transform interpolation precision;
- large fullscreen 3D layer rasterization/compositing;
- simultaneous translateX + rotateY + dynamic Z;
- fold/surface geometry mismatch;
- sticky visual viewport behavior;
- browser toolbar / visual viewport offsets;
- layer promotion / de-promotion;
- texture resampling from percentage translations on a 104% face;
- CSS filter/drop-shadow costs;
- other compositor interaction.

Do not claim a cause without isolating it.

### 7. Current R4.2.2 product files
- `assets/js/homepage-two-worlds-clean-golden-r4.js`
- `assets/css/homepage-two-worlds-clean-golden-r4.css`
- `_includes/homepage-two-worlds-clean-golden-r4-en.html`
- `_includes/homepage-two-worlds-clean-golden-r4-ru.html`

### 8. Useful historical reference files on current main
- `assets/js/homepage-two-worlds-golden-r1.js`
- `assets/js/homepage-two-worlds-golden-r1-landscape-fix.js`
- `assets/css/homepage-two-worlds-golden-r1.css`
- `assets/css/homepage-two-worlds-golden-r1-landscape-fix.css`

The owner also remembers an even earlier smooth visual version. Do not assume current R1 is that exact version.

Historical preview refs that should be compared first:
- `two-worlds-preview`
- `two-worlds-r1-1-preview`
- `two-worlds-golden-r2-preview`
- `two-worlds-golden-r2-1-preview`

The R2/R2.1 branches use a materially different geometry model (shared normalized physical state, much smaller X travel, boundary-driven face ownership, and different Z/rotation curves). They are high-value references for identifying what changed between the remembered smooth behavior and current R4.2.2.

---

# CURRENT R4.2.2 MOTION CORE

```js
  function renderTransition(section,t){
    var s=stateFor(section);
    t=clamp(t,0,1);
    s.t=t;
    var p=smootherstep(t);
    var sharedZ=-96*Math.sin(Math.PI*p);
    var aiContent=1-smoothstep((t-.18)/.24);
    var webContent=smoothstep((t-.58)/.24);
    var aiInscription=.92*(1-smoothstep((t-.24)/.22));
    var webInscription=.92*smoothstep((t-.54)/.22);
    var aiLight=mix(.48,.07,p);
    var webLight=mix(.08,.46,p);
    var foldResponse=.88+(.12*Math.sin(Math.PI*p));

    setVar(section,'--tw-r4-ai-x',(-104*p).toFixed(3)+'%');
    setVar(section,'--tw-r4-web-x',(104*(1-p)).toFixed(3)+'%');
    setVar(section,'--tw-r4-ai-ry',mix(-3,-72,p).toFixed(3)+'deg');
    setVar(section,'--tw-r4-web-ry',mix(72,3,p).toFixed(3)+'deg');
    setVar(section,'--tw-r4-ai-z',sharedZ.toFixed(2)+'px');
    setVar(section,'--tw-r4-web-z',sharedZ.toFixed(2)+'px');
    setVar(section,'--tw-r4-fold-x',mix(110,-10,p).toFixed(3)+'%');
    setVar(section,'--tw-r4-fold-ry',mix(-8,8,p).toFixed(3)+'deg');
    setVar(section,'--tw-r4-ai-content-opacity',aiContent.toFixed(3));
    setVar(section,'--tw-r4-web-content-opacity',webContent.toFixed(3));
    setVar(section,'--tw-r4-ai-inscription-opacity',aiInscription.toFixed(3));
    setVar(section,'--tw-r4-web-inscription-opacity',webInscription.toFixed(3));
    setVar(section,'--tw-r4-ai-light-opacity',aiLight.toFixed(3));
    setVar(section,'--tw-r4-web-light-opacity',webLight.toFixed(3));
    setVar(section,'--tw-r4-fold-response',foldResponse.toFixed(3));
  }

  function tick(section,now){
    var s=stateFor(section);
    if(s.logical!=='TRANSITIONING'){s.raf=0;return;}
    if(!s.lastFrame)s.lastFrame=now;
    var dt=Math.min(34,Math.max(0,now-s.lastFrame));
    s.lastFrame=now;
    s.t=clamp(s.t+(s.direction*(dt/TURN_MS)),0,1);
    renderTransition(section,s.t);
    if(s.direction<0&&s.t<=0){writeLocked(section,'AI_LOCKED');return;}
    if(s.direction>0&&s.t>=1){writeLocked(section,'WEB_LOCKED');return;}
    s.raf=window.requestAnimationFrame(function(ts){tick(section,ts);});
  }

  function beginTransition(section,direction){
    var s=stateFor(section);
    if(reducedMotion.matches||!mobileQuery.matches)return;
    if(s.logical==='TRANSITIONING'){
      s.direction=direction;
      section.setAttribute('data-r4-direction',direction>0?'forward':'reverse');
      return;
    }
    s.logical='TRANSITIONING';
    s.direction=direction;
    s.intent=0;
    s.reverseIntent=0;
    s.lastFrame=0;
    section.setAttribute('data-r4-state','TRANSITIONING');
    section.setAttribute('data-r4-direction',direction>0?'forward':'reverse');
    section.setAttribute('data-focus','turn');
    setAccessibility(section,'TRANSITIONING');
    renderTransition(section,s.t);
    if(!s.raf)s.raf=window.requestAnimationFrame(function(ts){tick(section,ts);});
  }

  function reverseThreshold(){return landscapeQuery.matches?38:46;}
  function forwardThreshold(){return landscapeQuery.matches?30:38;}
  function transitionReverseThreshold(){
    return landscapeQuery.matches?TRANSITION_REVERSE_THRESHOLD_LANDSCAPE:TRANSITION_REVERSE_THRESHOLD_PORTRAIT;
  }

  function experienceStatus(section){
    var experience=section.querySelector('[data-tw-experience]');
    if(!experience)return {engaged:false,below:false};
    /* Live viewport is used only to classify entry/exit. The stage geometry
       itself remains frozen while the immersive territory owns the viewport. */
    var vh=Math.max(1,stageHeightNow());
    var rect=experience.getBoundingClientRect();
    return {
      engaged:rect.top<=8&&rect.bottom>=vh-8,
      below:rect.bottom<vh-8
    };
  }

  function sectionEngaged(section){
    return experienceStatus(section).engaged;
  }

  function scheduleWebReentryFreshGate(section){
    var s=stateFor(section);
    if(s.webReentrySettleTimer)window.clearTimeout(s.webReentrySettleTimer);
    var wait=Math.max(0,s.webReentryHoldUntil-performance.now())+REVERSE_REENTRY_SETTLE_MS;
    s.webReentrySettleTimer=window.setTimeout(function(){
      s.webReentrySettleTimer=0;
      if(s.logical!=='WEB_LOCKED'||!s.webReentryWaitingFresh)return;
      var now=performance.now();
      var quietFor=now-s.webReentryLastScrollAt;
      if(now<s.webReentryHoldUntil||quietFor<REVERSE_REENTRY_SETTLE_MS){
        scheduleWebReentryFreshGate(section);
        return;
      }
      /* The original upward swipe/momentum is over. The next scroll event is
         now a genuinely fresh gesture and may contribute reverse intent. */
      s.webReentryWaitingFresh=false;
      s.webReentryHoldUntil=0;
      s.intent=0;
      s.reverseIntent=0;
      s.lastScrollY=Math.max(0,window.scrollY||0);
    },wait);
  }

  function armWebReentryGate(section,now){
    var s=stateFor(section);
    s.wasBelowExperience=false;
    s.webReentryHoldUntil=now+REVERSE_REENTRY_HOLD_MS;
    s.webReentryWaitingFresh=true;
    s.webReentryLastScrollAt=now;
    s.intent=0;
    s.reverseIntent=0;
    s.lastScrollY=Math.max(0,window.scrollY||0);
    scheduleWebReentryFreshGate(section);
  }

  function initialMobileState(section){
    var experience=section.querySelector('[data-tw-experience]');
    if(!experience)return 'AI_LOCKED';
    var s=stateFor(section);
    var vh=Math.max(1,s.viewportHeight||stageHeightNow());
    var travel=Math.max(1,experience.offsetHeight-vh);
    var rect=experience.getBoundingClientRect();
    var raw=clamp(-rect.top/travel,0,1);
    return raw>.56?'WEB_LOCKED':'AI_LOCKED';
  }

  function handleScrollFor(section){
    var s=stateFor(section);
    var y=Math.max(0,window.scrollY||0);
    var delta=y-s.lastScrollY;
    s.lastScrollY=y;

    if(!mobileQuery.matches||reducedMotion.matches)return;
    /* Orientation/width-class changes can make the browser adjust scrollY
       without a user reversal. Never convert that synthetic correction into
       world intent; lastScrollY is already synchronized above. */
    var now=performance.now();
    if(now<orientationIntentGuardUntil){
      s.intent=0;
      s.reverseIntent=0;
      return;
    }

    var experience=experienceStatus(section);
    if(experience.below){
      /* Remember that the user genuinely left the Two Worlds territory below.
         This is the only condition that can arm the Web re-entry hold later. */
      s.wasBelowExperience=true;
      s.webReentryHoldUntil=0;
      s.webReentryWaitingFresh=false;
      s.webReentryLastScrollAt=0;
      if(s.webReentrySettleTimer){window.clearTimeout(s.webReentrySettleTimer);s.webReentrySettleTimer=0;}
      s.intent=0;
      s.reverseIntent=0;
      return;
    }

    if(s.logical==='WEB_LOCKED'&&delta<0&&s.wasBelowExperience&&experience.engaged){
      /* R4.2.1 used a time gate only. Momentum from the SAME swipe could still
         resume reverse intent the instant 280ms elapsed, which is why the Web
         screen remained hard to catch in Chrome on iPhone. R4.2.2 requires
         both minimum hold time AND scroll settle before accepting a fresh
         upward gesture. */
      armWebReentryGate(section,now);
      return;
    }

    if(s.webReentryWaitingFresh){
      s.webReentryLastScrollAt=now;
      s.intent=0;
      s.reverseIntent=0;
      s.lastScrollY=y;
      scheduleWebReentryFreshGate(section);
      return;
    }

    if(Math.abs(delta)<=IGNORE_DELTA)return;

    /* Once a turn has begun, keep the same timeline authoritative even if
       a genuine reverse gesture momentarily moves the sticky boundary. */
    if(s.logical==='TRANSITIONING'){
      var opposite=(s.direction>0&&delta<0)||(s.direction<0&&delta>0);
      if(opposite){
        s.reverseIntent+=Math.abs(delta);
        if(s.reverseIntent>=transitionReverseThreshold()){
          s.direction*=-1;
          s.reverseIntent=0;
          section.setAttribute('data-r4-direction',s.direction>0?'forward':'reverse');
        }
      }else{
        s.reverseIntent=Math.max(0,s.reverseIntent-(Math.abs(delta)*.75));
      }
      return;
    }

    if(!experience.engaged){
      s.intent=0;
      s.reverseIntent=0;
      return;
    }

    if(s.logical==='AI_LOCKED'){
      if(delta>0){
        s.intent+=delta;
        if(s.intent>=forwardThreshold())beginTransition(section,1);
      }else{
        s.intent=Math.max(0,s.intent-(Math.abs(delta)*1.35));
      }
      return;
    }

    if(s.logical==='WEB_LOCKED'){
      if(delta<0){
        s.intent+=Math.abs(delta);
        if(s.intent>=reverseThreshold())beginTransition(section,-1);
      }else{
        s.intent=Math.max(0,s.intent-(Math.abs(delta)*1.35));
      }
    }
  }


```

# HISTORICAL R1 MOBILE MOTION CORE

```js
  function setMobileGeometry(section, progress) {
    if (reducedMotion.matches) return;
    var p = clamp(progress, 0, 1);
    section.style.setProperty('--tw-mobile-ai-x', (-82 * p).toFixed(2) + '%');
    section.style.setProperty('--tw-mobile-ai-ry', (-3 - 69 * p).toFixed(2) + 'deg');
    section.style.setProperty('--tw-mobile-ai-z', (-110 * p).toFixed(2) + 'px');
    section.style.setProperty('--tw-mobile-web-x', (82 * (1 - p)).toFixed(2) + '%');
    section.style.setProperty('--tw-mobile-web-ry', (72 - 69 * p).toFixed(2) + 'deg');
    section.style.setProperty('--tw-mobile-web-z', (-110 * (1 - p)).toFixed(2) + 'px');
    section.style.setProperty('--tw-mobile-fold-x', (105 - 110 * p).toFixed(2) + '%');
    section.style.setProperty('--tw-mobile-progress', p.toFixed(3));

    /* Narrower deliberate THE TURN than the historical 0.34–0.66 band. */
    var next = p < .43 ? 'ai' : (p > .57 ? 'web' : 'turn');
    if (section.getAttribute('data-focus') !== next) section.setAttribute('data-focus', next);
    scheduleFit(section);
  }

  function updateMobileSection(section) {
    if (!mobileQuery.matches || reducedMotion.matches || shortLandscapeQuery.matches) return;
    var experience = section.querySelector('[data-tw-experience]');
    if (!experience) return;
    var rect = experience.getBoundingClientRect();
    var travel = Math.max(1, rect.height - window.innerHeight);
    setMobileGeometry(section, clamp(-rect.top / travel, 0, 1));
  }


```

# CURRENT R4.2.2 CSS

```css
/* ProAI Expert — Two Worlds Clean Production Synthesis R4.1 FINAL
   Authority: accepted R4 visual system + this final fullscreen/stability correction.
   Mobile runtime authority: assets/js/homepage-two-worlds-clean-golden-r4.js
   R3/R3.1 donor retained here: one-shot 1.45s moonlight only.
   Material palette remains production R1 / accepted R4. */

.tw-r4 {
  --tw-r4-ai-x:0%;
  --tw-r4-web-x:104%;
  --tw-r4-ai-ry:-3deg;
  --tw-r4-web-ry:72deg;
  --tw-r4-ai-z:0px;
  --tw-r4-web-z:0px;
  --tw-r4-fold-x:110%;
  --tw-r4-fold-ry:-8deg;
  --tw-r4-ai-light-opacity:.48;
  --tw-r4-web-light-opacity:.08;
  --tw-r4-fold-response:.88;
  --tw-r4-ai-content-opacity:1;
  --tw-r4-web-content-opacity:0;
  --tw-r4-ai-inscription-opacity:.92;
  --tw-r4-web-inscription-opacity:0;
}

/* R4.1: intro is independent from the moving stage and optically centered.
   This removes the inherited 30/70 production grid bias without changing copy. */
.tw-r4 > .tw-r2__intro {
  display:block;
  width:min(calc(100% - 80px),1600px);
  margin-inline:auto;
  text-align:center;
}
.tw-r4 > .tw-r2__intro .tw-r2__eyebrow {
  width:max-content;
  max-width:100%;
  margin:0 auto 13px;
}
.tw-r4 > .tw-r2__intro .tw-r2__intro-title {
  width:min(100%,1100px);
  margin-inline:auto;
  text-wrap:balance;
}
.tw-r4 .tw-r2__experience,
.tw-r4 .tw-r2__viewport,
.tw-r4 .tw-r2__plate {
  width:100%;
  max-width:none;
}

/* Proven R3 donor: restrained grazing light, one shot only. */
.tw-r4 .tw-r2__face::after {
  position:absolute;
  inset:-12%;
  z-index:3;
  content:"";
  pointer-events:none;
  opacity:0;
  transform:translate3d(-128%,0,0) skewX(-9deg);
  background:linear-gradient(105deg,
    transparent 38%,
    rgba(188,191,211,.020) 44%,
    rgba(238,240,244,.118) 49%,
    rgba(111,93,181,.050) 53%,
    transparent 59%);
  mix-blend-mode:screen;
}
.tw-r4[data-entry-lit="run"] .tw-r2__face::after {
  animation:twR4Moonlight 1.45s cubic-bezier(.22,.61,.36,1) 1 both;
}
@keyframes twR4Moonlight {
  0% { opacity:0; transform:translate3d(-128%,0,0) skewX(-9deg); }
  18% { opacity:.15; }
  56% { opacity:.34; }
  100% { opacity:0; transform:translate3d(128%,0,0) skewX(-9deg); }
}

/* Desktop intentionally inherits production R1 geometry, typography, materials and fold. */
@media (min-width:981px) and (hover:hover) and (pointer:fine) {
  /* Laptop/desktop becomes a restrained sticky viewport chapter.
     Pointer-driven production world semantics remain unchanged; only viewport
     ownership changes so the block actually stops and fills the screen. */
  .tw-r4 .tw-r2__experience {
    height:155svh;
    min-height:155svh;
  }
  .tw-r4 .tw-r2__viewport {
    position:sticky;
    inset:auto;
    top:0;
    height:100svh;
    min-height:100svh;
  }

  .tw-r4[data-r4-state="DESKTOP"] .tw-r2__face,
  .tw-r4[data-r4-state="DESKTOP"] .tw-r2__fold { will-change:auto; }
}

@media (max-width:980px), ((hover:none) and (pointer:coarse)) {
  .tw-r4.tw-r2 {
    --tw-g-mobile-inset:clamp(48px,13vw,56px);
    background:#020304;
  }
  .tw-r4 > .tw-r2__intro {
    width:min(calc(100% - 32px),720px);
    text-align:center;
  }

  .tw-r4 .tw-r2__experience {
    height:var(--tw-r4-travel-height,220svh)!important;
    min-height:0!important;
    perspective:1000px;
  }
  .tw-r4 .tw-r2__viewport {
    position:sticky!important;
    top:0;
    width:100%;
    max-width:none;
    height:var(--tw-r4-stage-height,100svh)!important;
    min-height:0!important;
    overflow:hidden;
    perspective:980px;
    isolation:isolate;
  }
  .tw-r4 .tw-r2__plate { inset:0; }

  .tw-r4.tw-r2 .tw-r2__face {
    top:-2%;
    bottom:-2%;
    left:-2%!important;
    right:auto!important;
    width:104%;
    clip-path:none!important;
    transition:none!important;
    filter:none!important;
    backface-visibility:hidden;
  }
  .tw-r4.tw-r2 .tw-r2__face--ai {
    transform-origin:100% 50%;
    transform:translate3d(var(--tw-r4-ai-x),0,var(--tw-r4-ai-z)) rotateY(var(--tw-r4-ai-ry))!important;
  }
  .tw-r4.tw-r2 .tw-r2__face--web {
    transform-origin:0 50%;
    transform:translate3d(var(--tw-r4-web-x),0,var(--tw-r4-web-z)) rotateY(var(--tw-r4-web-ry))!important;
  }

  .tw-r4.tw-r2 .tw-r2__face--ai::before { opacity:var(--tw-r4-ai-light-opacity)!important; transform:none!important; }
  .tw-r4.tw-r2 .tw-r2__face--web::before { opacity:var(--tw-r4-web-light-opacity)!important; transform:none!important; }
  .tw-r4.tw-r2 .tw-r2__fold-plane::after { opacity:var(--tw-r4-fold-response)!important; }

  .tw-r4.tw-r2 .tw-r2__fold {
    left:var(--tw-r4-fold-x)!important;
    width:clamp(60px,15.5vw,76px);
    transform:translateX(-50%) perspective(720px) rotateY(var(--tw-r4-fold-ry))!important;
    transition:none!important;
  }

  .tw-r4.tw-r2[data-r4-state="AI_LOCKED"] .tw-r2__face,
  .tw-r4.tw-r2[data-r4-state="WEB_LOCKED"] .tw-r2__face,
  .tw-r4.tw-r2[data-r4-state="AI_LOCKED"] .tw-r2__fold,
  .tw-r4.tw-r2[data-r4-state="WEB_LOCKED"] .tw-r2__fold {
    will-change:auto;
  }
  .tw-r4.tw-r2[data-r4-state="TRANSITIONING"] .tw-r2__face,
  .tw-r4.tw-r2[data-r4-state="TRANSITIONING"] .tw-r2__fold {
    will-change:transform;
  }

  /* Content handoff is driven only by the single normalized R4 timeline. */
  .tw-r4.tw-r2 .tw-r2__content--ai {
    opacity:var(--tw-r4-ai-content-opacity)!important;
    transition:none!important;
  }
  .tw-r4.tw-r2 .tw-r2__content--web {
    opacity:var(--tw-r4-web-content-opacity)!important;
    transition:none!important;
  }

  /* Mobile watermarks are authored, never measured at runtime. */
  .tw-r4.tw-r2 .tw-r2__inscription {
    left:50%!important;
    transform:translateX(-50%) translateZ(0)!important;
    transition:none!important;
    white-space:nowrap;
  }
  .tw-r4.tw-r2 .tw-r2__inscription--ai {
    top:9.2%;
    font-size:clamp(64px,19vw,86px)!important;
    opacity:var(--tw-r4-ai-inscription-opacity)!important;
  }
  .tw-r4.tw-r2 .tw-r2__inscription--web {
    top:9.2%;
    font-size:clamp(46px,14vw,64px)!important;
    opacity:var(--tw-r4-web-inscription-opacity)!important;
  }
  body.lang-ru .tw-r4.tw-r2 .tw-r2__inscription--ai {
    font-size:clamp(62px,18.5vw,84px)!important;
  }
  body.lang-ru .tw-r4.tw-r2 .tw-r2__inscription--web {
    font-size:clamp(39px,11.2vw,52px)!important;
    letter-spacing:-.052em;
  }
}

/* Phone landscape: restore the wider production composition rather than R3.1's 42–64px inset.
   Current main contains a historical bridge override at 48–68px; R4 re-centers the composition
   near the original production R1 geometry while keeping the production title scale. */
@media (orientation:landscape) and (max-height:540px) and (max-width:980px) {
  .tw-r4.tw-r2 {
    --tw-g-landscape-inset:clamp(92px,11.5vw,116px);
  }

  .tw-r4.tw-r2 .tw-r2__content--ai,
  .tw-r4.tw-r2 .tw-r2__content--web,
  .tw-r4.tw-r2[data-focus="ai"] .tw-r2__content--ai,
  .tw-r4.tw-r2[data-focus="web"] .tw-r2__content--web {
    top:50%;
    left:var(--tw-g-landscape-inset);
    right:var(--tw-g-landscape-inset);
    width:auto!important;
    max-width:none;
    display:grid;
    grid-template-columns:minmax(0,56fr) minmax(0,44fr);
    grid-template-areas:"index registers" "title registers" "thesis registers" "cta registers";
    column-gap:clamp(24px,4vw,42px);
    align-items:start;
    align-content:center;
  }
  .tw-r4 .tw-r2__world-index { grid-area:index; margin:0 0 7px; }
  .tw-r4 .tw-r2__world-title,
  .tw-r4 .tw-r2__face--web .tw-r2__world-title,
  body.lang-ru .tw-r4 .tw-r2__world-title,
  body.lang-ru .tw-r4 .tw-r2__face--web .tw-r2__world-title {
    grid-area:title;
    font-size:clamp(35px,4.5vw,40px)!important;
    line-height:.91;
  }
  .tw-r4 .tw-r2__thesis {
    grid-area:thesis;
    max-width:34ch;
    margin-top:9px;
    font-size:12.5px;
    line-height:1.34;
  }
  .tw-r4 .tw-r2__cta {
    grid-area:cta;
    margin-top:10px;
    padding:5px 0;
    font-size:10px;
  }
  .tw-r4 .tw-r2__registers {
    grid-area:registers;
    align-self:center;
    width:100%;
    max-width:none;
    margin:0;
    grid-template-columns:1fr;
    gap:11px;
  }
  .tw-r4 .tw-r2__register { display:block; }
  .tw-r4 .tw-r2__register dt { font-size:10.5px; }
  .tw-r4 .tw-r2__register dd { margin-top:3px; font-size:12.75px; }

  .tw-r4.tw-r2 .tw-r2__inscription--ai {
    top:6.2%;
    font-size:clamp(112px,14.2vw,132px)!important;
    letter-spacing:-.060em;
  }
  .tw-r4.tw-r2 .tw-r2__inscription--web {
    top:6.2%;
    font-size:clamp(82px,10.5vw,104px)!important;
    letter-spacing:-.060em;
  }
  body.lang-ru .tw-r4.tw-r2 .tw-r2__inscription--ai {
    font-size:clamp(106px,13.4vw,126px)!important;
  }
  body.lang-ru .tw-r4.tw-r2 .tw-r2__inscription--web {
    font-size:clamp(68px,8.6vw,86px)!important;
    letter-spacing:-.052em;
  }
}

@media (prefers-reduced-motion:reduce) {
  .tw-r4[data-entry-lit="run"] .tw-r2__face::after { animation:none!important; }
}
@media (prefers-reduced-motion:reduce) and (max-width:980px),
       (prefers-reduced-motion:reduce) and (hover:none) and (pointer:coarse) {
  .tw-r4 .tw-r2__experience { height:auto!important; min-height:0!important; }
  .tw-r4 .tw-r2__viewport {
    position:relative!important;
    inset:auto;
    height:auto!important;
    min-height:0!important;
    overflow:hidden;
  }
  .tw-r4 .tw-r2__plate { position:relative; inset:auto; display:block; }
  .tw-r4.tw-r2 .tw-r2__face {
    position:relative;
    top:auto;
    bottom:auto;
    left:auto!important;
    right:auto!important;
    width:100%;
    min-height:520px;
    transform:none!important;
    filter:none!important;
    opacity:1!important;
  }
  .tw-r4.tw-r2 .tw-r2__face--ai { clip-path:polygon(0 0,100% 0,97% 100%,0 100%)!important; }
  .tw-r4.tw-r2 .tw-r2__face--web { clip-path:polygon(3% 0,100% 0,100% 100%,0 100%)!important; }
  .tw-r4.tw-r2 .tw-r2__fold {
    position:relative;
    top:auto;
    bottom:auto;
    left:50%!important;
    width:100%;
    max-width:none;
    height:34px;
    transform:translateX(-50%)!important;
    filter:none;
  }
  .tw-r4.tw-r2 .tw-r2__content--ai,
  .tw-r4.tw-r2 .tw-r2__content--web {
    top:50%;
    opacity:1!important;
  }
  .tw-r4.tw-r2 .tw-r2__inscription {
    opacity:.22!important;
  }
}

```

# CURRENT R4.2.2 EN MARKUP

```html
<section class="tw-r2 tw-r4" id="two-worlds-clean-golden-r4" data-tw-r4 data-r4-state="AI_LOCKED" data-focus="neutral" aria-labelledby="tw-r4-title-en">
  <div class="tw-r2__intro">
    <p class="tw-r2__eyebrow">03 / TWO WORLDS</p>
    <h2 class="tw-r2__intro-title" id="tw-r4-title-en"><span class="tw-r2__heading-line tw-r2__heading-line--pearl">Two professional worlds.</span><span class="tw-r2__heading-line tw-r2__heading-line--silver">One business system.</span></h2>
  </div>

  <div class="tw-r2__experience" data-tw-experience>
    <div class="tw-r2__viewport" data-tw-viewport>
      <div class="tw-r2__plate" data-tw-plate>
        <article class="tw-r2__face tw-r2__face--ai" data-tw-world="ai" aria-labelledby="tw-r4-ai-title-en">
          <div class="tw-r2__material tw-r2__material--ai" aria-hidden="true"></div>
          <div class="tw-r2__inscription tw-r2__inscription--ai" aria-hidden="true">SYSTEMS</div>
          <div class="tw-r2__content tw-r2__content--ai">
            <p class="tw-r2__world-index">WORLD 01</p>
            <h3 class="tw-r2__world-title" id="tw-r4-ai-title-en"><span class="tw-r2__title-line">AI Systems &amp;</span><span class="tw-r2__title-line">Automation</span></h3>
            <p class="tw-r2__thesis">AI, automation and connected workflows built around how the business actually operates.</p>
            <dl class="tw-r2__registers">
              <div class="tw-r2__register"><dt>AI &amp; KNOWLEDGE</dt><dd>Assistants · Knowledge</dd></div>
              <div class="tw-r2__register"><dt>AUTOMATION</dt><dd>Workflows · Integrations</dd></div>
              <div class="tw-r2__register"><dt>CONTROL</dt><dd>Routing · Measurement</dd></div>
            </dl>
            <a class="tw-r2__cta" href="/ai-systems/">Explore AI Systems <span aria-hidden="true">→</span></a>
          </div>
        </article>

        <div class="tw-r2__fold" data-tw-fold aria-hidden="true"><span class="tw-r2__fold-plane"></span></div>

        <article class="tw-r2__face tw-r2__face--web" id="web" data-tw-world="web" aria-labelledby="tw-r4-web-title-en">
          <div class="tw-r2__material tw-r2__material--web" aria-hidden="true"></div>
          <div class="tw-r2__inscription tw-r2__inscription--web" aria-hidden="true">EXPERIENCE</div>
          <div class="tw-r2__content tw-r2__content--web">
            <p class="tw-r2__world-index">WORLD 02</p>
            <h3 class="tw-r2__world-title" id="tw-r4-web-title-en"><span class="tw-r2__title-line">Websites &amp;</span><span class="tw-r2__title-line">Branding</span></h3>
            <p class="tw-r2__thesis">Digital experiences that make the business easier to understand, trust and choose.</p>
            <dl class="tw-r2__registers">
              <div class="tw-r2__register"><dt>STRUCTURE</dt><dd>Architecture · UX</dd></div>
              <div class="tw-r2__register"><dt>BRAND</dt><dd>Website · Identity</dd></div>
              <div class="tw-r2__register"><dt>REACH</dt><dd>Multilingual · Content</dd></div>
            </dl>
            <a class="tw-r2__cta" href="/websites-branding/">Explore Websites &amp; Branding <span aria-hidden="true">→</span></a>
          </div>
        </article>
      </div>
    </div>
  </div>
</section>

```

# CURRENT R4.2.2 RU MARKUP

```html
<section class="tw-r2 tw-r4" id="two-worlds-clean-golden-r4" data-tw-r4 data-r4-state="AI_LOCKED" data-focus="neutral" aria-labelledby="tw-r4-title-ru">
  <div class="tw-r2__intro">
    <p class="tw-r2__eyebrow">03 / ДВА МИРА</p>
    <h2 class="tw-r2__intro-title" id="tw-r4-title-ru"><span class="tw-r2__heading-line tw-r2__heading-line--pearl">Два профессиональных мира.</span><span class="tw-r2__heading-line tw-r2__heading-line--silver">Одна система для бизнеса.</span></h2>
  </div>

  <div class="tw-r2__experience" data-tw-experience>
    <div class="tw-r2__viewport" data-tw-viewport>
      <div class="tw-r2__plate" data-tw-plate>
        <article class="tw-r2__face tw-r2__face--ai" data-tw-world="ai" aria-labelledby="tw-r4-ai-title-ru">
          <div class="tw-r2__material tw-r2__material--ai" aria-hidden="true"></div>
          <div class="tw-r2__inscription tw-r2__inscription--ai" aria-hidden="true">СИСТЕМЫ</div>
          <div class="tw-r2__content tw-r2__content--ai">
            <p class="tw-r2__world-index">МИР 01</p>
            <h3 class="tw-r2__world-title" id="tw-r4-ai-title-ru"><span class="tw-r2__title-line">AI-системы и</span><span class="tw-r2__title-line">автоматизация</span></h3>
            <p class="tw-r2__thesis">AI, автоматизация и связанные процессы, выстроенные вокруг реальной работы бизнеса.</p>
            <dl class="tw-r2__registers">
              <div class="tw-r2__register"><dt>AI И ЗНАНИЯ</dt><dd>Ассистенты · Базы знаний</dd></div>
              <div class="tw-r2__register"><dt>АВТОМАТИЗАЦИЯ</dt><dd>Процессы · Интеграции</dd></div>
              <div class="tw-r2__register"><dt>КОНТРОЛЬ</dt><dd>Маршрутизация · Метрики</dd></div>
            </dl>
            <a class="tw-r2__cta" href="/ru/ai-systems/">Изучить AI-системы <span aria-hidden="true">→</span></a>
          </div>
        </article>

        <div class="tw-r2__fold" data-tw-fold aria-hidden="true"><span class="tw-r2__fold-plane"></span></div>

        <article class="tw-r2__face tw-r2__face--web" id="web" data-tw-world="web" aria-labelledby="tw-r4-web-title-ru">
          <div class="tw-r2__material tw-r2__material--web" aria-hidden="true"></div>
          <div class="tw-r2__inscription tw-r2__inscription--web" aria-hidden="true">ВПЕЧАТЛЕНИЕ</div>
          <div class="tw-r2__content tw-r2__content--web">
            <p class="tw-r2__world-index">МИР 02</p>
            <h3 class="tw-r2__world-title" id="tw-r4-web-title-ru"><span class="tw-r2__title-line">Сайты и</span><span class="tw-r2__title-line">брендинг</span></h3>
            <p class="tw-r2__thesis">Цифровая система, которая помогает быстрее понять бизнес, доверять ему и сделать следующий шаг.</p>
            <dl class="tw-r2__registers">
              <div class="tw-r2__register"><dt>СТРУКТУРА</dt><dd>Архитектура · UX</dd></div>
              <div class="tw-r2__register"><dt>БРЕНД</dt><dd>Сайт · Айдентика</dd></div>
              <div class="tw-r2__register"><dt>ОХВАТ</dt><dd>Языки · Контент</dd></div>
            </dl>
            <a class="tw-r2__cta" href="/ru/websites-branding/">Изучить сайты и брендинг <span aria-hidden="true">→</span></a>
          </div>
        </article>
      </div>
    </div>
  </div>
</section>

```

# CURRENT MAIN TWO-WORLDS → TECHNOLOGY INTEGRATION CSS

```css
/* ProAI Homepage Integration R1
   Scope: boundary ownership only.
   Current production Two Worlds -> frozen Technology R1.5.1 -> Financial Stream R1.4.
   Do not alter internal composition, copy, motion, platform groups, or neighboring section architecture. */

.tw-r2 + .home-tech-ff,
.home-tech-ff + .home-fs-showcase-r14{
  margin-top:-1px;
}

/* Temporary compatibility seam for the CURRENT non-final Two Worlds.
   Future fullscreen Two Worlds owns the final upstream handoff; Technology internals remain frozen. */
.tw-r2 + .home-tech-ff{
  border-top-color:transparent;
}
.tw-r2 + .home-tech-ff::before{
  content:"";
  position:absolute;
  z-index:11;
  left:50%;
  top:0;
  width:1px;
  height:clamp(54px,6.5svh,76px);
  transform:translateX(-50%);
  pointer-events:none;
  background:linear-gradient(
    180deg,
    rgba(218,216,211,.04) 0%,
    rgba(226,224,219,.16) 52%,
    rgba(226,224,219,.06) 100%
  );
  opacity:.72;
}

/* Technology -> Financial Stream is treated as the stable downstream seam.
   R1.5.1 resolves back to center; Financial Stream begins from that same center axis. */
.home-tech-ff + .home-fs-showcase-r14{
  position:relative;
  background:
    radial-gradient(ellipse at 50% 0%,rgba(116,109,137,.035),transparent 20%),
    linear-gradient(180deg,#080a0d 0%,#0a0d11 52%,#070708 100%);
}
.home-tech-ff + .home-fs-showcase-r14::after{
  content:"";
  position:absolute;
  z-index:2;
  left:50%;
  top:0;
  width:1px;
  height:clamp(44px,4.5vw,64px);
  transform:translateX(-50%);
  pointer-events:none;
  background:linear-gradient(
    180deg,
    rgba(235,233,228,.18) 0%,
    rgba(209,224,233,.13) 52%,
    rgba(209,224,233,0) 100%
  );
  opacity:.78;
}

/* Existing FS decorative seam remains suppressed by its own approved polish layer.
   This integration line is the only cross-section handoff. */
.home-tech-ff + .home-fs-showcase-r14 .home-fs-showcase-r11__seam{
  position:relative;
  z-index:3;
}

/* Phone portrait: keep the seam quiet and clear of the heading/scene composition. */
@media(max-width:700px) and (orientation:portrait){
  .tw-r2 + .home-tech-ff::before{
    height:38px;
    opacity:.42;
  }
  .home-tech-ff + .home-fs-showcase-r14::after{
    height:42px;
    opacity:.66;
  }
}

/* Phone landscape: use a short centered relay; no decorative expansion. */
@media(orientation:landscape) and (max-height:500px) and (max-width:960px){
  .tw-r2 + .home-tech-ff::before{
    height:32px;
    opacity:.46;
  }
  .home-tech-ff + .home-fs-showcase-r14::after{
    height:36px;
    opacity:.64;
  }
}

/* Reduced motion keeps the same static geometry and avoids introducing transition behavior. */
@media(prefers-reduced-motion:reduce){
  .tw-r2 + .home-tech-ff::before,
  .home-tech-ff + .home-fs-showcase-r14::after{
    transition:none!important;
    animation:none!important;
  }
}

```

# INDEPENDENT AUDIT REQUEST

Please return:
1. exact reproducible jitter mechanism;
2. the smallest isolated fix;
3. whether the fix changes visual depth;
4. whether dynamic Z is causal, contributory, or irrelevant;
5. whether percentage-based translate on 104% fullscreen faces creates subpixel resampling;
6. whether the fold should share the exact same pixel-space hinge calculation as both faces;
7. whether layer promotion/backface/preserve-3d/filter behavior is unstable on Chrome/iPhone;
8. a patch limited to Two Worlds only;
9. before/after test matrix for portrait + landscape Chrome on iPhone;
10. explicit confirmation that Technology/Header/current main are untouched.

### Non-negotiable
Do not redesign materials, typography, copy, watermark, moonlight, or composition.
Do not solve by removing the 3D idea unless a controlled test proves no stable alternative exists.
Do not merge or deploy production.
