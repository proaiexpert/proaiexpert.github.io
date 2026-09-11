(() => {
  'use strict';

  const root = document.querySelector('[data-connected-next]');
  if (!root) return;
  root.classList.remove('connected-next--nojs');

  const experience = root.querySelector('[data-experience]');
  const stickyStage = root.querySelector('.connected-next__sticky-stage');
  const artifact = root.querySelector('[data-context-artifact]');
  const stageButtons = [...root.querySelectorAll('[data-stage-button]')];
  if (!experience || !artifact || !stageButtons.length) return;

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const lowLandscape = matchMedia('(max-height: 520px) and (min-width: 701px)');
  const portrait = matchMedia('(max-width: 700px)');
  const tabletScroll = matchMedia('(max-width: 900px) and (min-width: 701px) and (pointer: coarse)');
  const finePointer = matchMedia('(hover:hover) and (pointer:fine)');
  const desktopViewport = matchMedia('(min-width: 901px)');

  const PORTRAIT_RUNWAY_MULTIPLIER = 2.55;
  const TABLET_RUNWAY_MULTIPLIER = 1.90;
  const LANDSCAPE_RUNWAY_MULTIPLIER = 2.05;
  const SESSION_IDLE_MS = 360;
  const PORTRAIT_FORWARD = [0,.30,.56,.80];
  const PORTRAIT_REVERSE = [0,.22,.48,.72];
  const clamp = (v,min,max) => Math.max(min,Math.min(max,v));

  let currentState = 4;
  let manualUntil = 0;
  let frameRequested = false;
  let modeFrame = 0;
  let knownLowLandscape = lowLandscape.matches;
  let knownPortrait = portrait.matches;
  let knownTabletScroll = tabletScroll.matches;
  let modeTransitionUntil = 0;
  let portraitRunway = null;
  let tabletRunway = null;
  let landscapeRunway = null;
  let portraitInitialized = false;
  let tabletInitialized = false;
  let lastScrollY = scrollY;
  let knownViewportWidth = innerWidth;

  // R1.4.4 semantic gesture session. One physical touch + inertia = one session.
  let gestureId = 0;
  let gestureActive = false;
  let touchContact = false;
  let gestureConsumed = false;
  let gestureDirection = 0;
  let gestureStartY = scrollY;
  let scrollIdleTimer = 0;
  let stateEntryY = scrollY;
  let readAnchorForward = null;
  let readAnchorReverse = null;

  let autoplayState = 'idle';
  let autoplayVisibility = 0;
  let autoplayIdleTimer = 0;
  let autoplayTimers = [];
  let autoplayStartScrollY = scrollY;
  let autoplayStartedAt = 0;
  let autoplayArmScrollY = scrollY;
  let lastUserScrollAt = performance.now();
  let hoverIntentTimer = 0;
  let mobileCueDone = false;
  let mobileCueTimer = 0;
  let lockTimer = 0;
  let lastLockState = artifact.dataset.state || '4';

  const scrollLedMode = () => (
    (portrait.matches || tabletScroll.matches || lowLandscape.matches) && !reducedMotion.matches
  );

  const visualViewportBox = () => {
    const vv = window.visualViewport;
    return {
      top: vv ? vv.offsetTop : 0,
      height: vv ? vv.height : innerHeight,
      width: vv ? vv.width : innerWidth
    };
  };

  const activePlate = () => root.querySelector('.ledger-plate.is-active');

  const readingBand = () => {
    const vv = visualViewportBox();
    if (lowLandscape.matches) {
      return {top:vv.top + 8,bottom:vv.top + vv.height - 10};
    }
    if (portrait.matches) {
      const artifactBottom = artifact.getBoundingClientRect().bottom;
      const geometricTop = Math.min(vv.top + vv.height * .58, artifactBottom + 8);
      return {top:Math.max(vv.top + 8,geometricTop),bottom:vv.top + vv.height - 16};
    }
    if (tabletScroll.matches) return {top:vv.top + 14,bottom:vv.top + vv.height - 18};
    return {top:vv.top,bottom:vv.top + vv.height};
  };

  const plateFullyReadable = () => {
    const plate = activePlate();
    if (!plate) return false;
    const r = plate.getBoundingClientRect();
    const band = readingBand();
    if (r.top < band.top - .5 || r.bottom > band.bottom + .5) return false;
    const details = plate.querySelector('.ledger-detail');
    const components = plate.querySelector('.ledger-components');
    for (const node of [details,components]) {
      if (!node) continue;
      const n = node.getBoundingClientRect();
      if (n.top < band.top - .5 || n.bottom > band.bottom + .5) return false;
    }
    return true;
  };

  const minReadTravel = (state) => {
    const vv = visualViewportBox();
    if (lowLandscape.matches) {
      const ratio = state === 1 ? .22 : state === 4 ? .20 : .19;
      return clamp(vv.width * ratio,138,210);
    }
    if (portrait.matches) {
      const ratio = state === 1 ? .27 : state === 4 ? .24 : .23;
      return clamp(vv.height * ratio,150,245);
    }
    if (tabletScroll.matches) {
      const ratio = state === 1 ? .23 : .20;
      return clamp(vv.height * ratio,165,250);
    }
    return 0;
  };

  const resetReadWindow = () => {
    stateEntryY = scrollY;
    readAnchorForward = null;
    readAnchorReverse = null;
    root.dataset.readingWindow = 'enter';
    root.classList.remove('is-result-plateau');
  };

  const updateReadingWindow = (direction) => {
    if (!scrollLedMode()) return;
    if (!plateFullyReadable()) {
      root.dataset.readingWindow = 'enter';
      return;
    }
    root.dataset.readingWindow = currentState === 4 ? 'final-read' : 'read';
    if (direction > 0 && readAnchorForward == null) readAnchorForward = scrollY;
    if (direction < 0 && readAnchorReverse == null) readAnchorReverse = scrollY;
    if (currentState === 4) root.classList.add('is-result-plateau');
  };

  const requiredTravelSatisfied = (direction) => {
    if (!plateFullyReadable()) return false;
    const need = minReadTravel(currentState);
    if (direction > 0) {
      if (readAnchorForward == null) readAnchorForward = scrollY;
      return scrollY - readAnchorForward >= need;
    }
    if (direction < 0) {
      if (readAnchorReverse == null) readAnchorReverse = scrollY;
      return readAnchorReverse - scrollY >= need;
    }
    return false;
  };

  const beginGesture = (kind = 'touch') => {
    gestureId += 1;
    gestureActive = true;
    gestureConsumed = false;
    gestureDirection = 0;
    gestureStartY = scrollY;
    root.dataset.gestureSession = `${kind}-${gestureId}`;
  };

  const endGesture = () => {
    if (!gestureActive) return;
    gestureActive = false;
    gestureConsumed = false;
    gestureDirection = 0;
    delete root.dataset.gestureSession;
  };

  const scheduleGestureEnd = () => {
    clearTimeout(scrollIdleTimer);
    scrollIdleTimer = setTimeout(() => {
      if (!touchContact) endGesture();
    },SESSION_IDLE_MS);
  };

  const noteScrollSession = (direction) => {
    if (!scrollLedMode()) return;
    if (!gestureActive) beginGesture('scroll');
    if (direction) gestureDirection = direction;
    scheduleGestureEnd();
  };

  const governedMobileState = (desired,direction) => {
    if (!scrollLedMode() || desired === currentState || direction === 0) return currentState;
    updateReadingWindow(direction);
    if (!gestureActive || gestureConsumed) return currentState;
    if (!requiredTravelSatisfied(direction)) return currentState;
    const next = clamp(currentState + (desired > currentState ? 1 : -1),1,4);
    if (next === currentState) return currentState;
    gestureConsumed = true;
    return next;
  };

  const desktopAutoplayEligible = () => (
    desktopViewport.matches && finePointer.matches && !tabletScroll.matches &&
    !lowLandscape.matches && !portrait.matches && !reducedMotion.matches
  );

  const semanticLock = (state) => {
    if (reducedMotion.matches) { artifact.classList.remove('is-locking'); return; }
    clearTimeout(lockTimer);
    root.dataset.lockTarget = state;
    artifact.classList.remove('is-locking');
    void artifact.offsetWidth;
    artifact.classList.add('is-locking');
    lockTimer = setTimeout(() => {
      artifact.classList.remove('is-locking');
      delete root.dataset.lockTarget;
    },lowLandscape.matches ? 720 : 980);
  };

  const lockObserver = new MutationObserver(() => {
    const next = artifact.dataset.state || lastLockState;
    if (next === lastLockState) return;
    lastLockState = next;
    semanticLock(next);
  });
  lockObserver.observe(artifact,{attributes:true,attributeFilter:['data-state']});

  const setState = (state,source='system') => {
    const next = clamp(Number(state)||1,1,4);
    if (next === currentState && source === 'system') return;
    const changed = next !== currentState;
    currentState = next;
    root.dataset.activeStage = String(next);
    artifact.dataset.state = String(next);
    stageButtons.forEach(button => {
      const index = Number(button.dataset.stageButton);
      const active = index === next;
      button.classList.toggle('is-past',index < next);
      button.classList.toggle('is-active',active);
      button.classList.toggle('is-future',index > next);
      if (active) button.setAttribute('aria-current','step'); else button.removeAttribute('aria-current');
    });
    if (changed && scrollLedMode()) resetReadWindow();
    if (source === 'manual') manualUntil = performance.now() + 900;
  };

  const clearAutoplayTimers = () => {
    clearTimeout(autoplayIdleTimer);
    autoplayIdleTimer = 0;
    autoplayTimers.forEach(clearTimeout);
    autoplayTimers = [];
  };

  const cancelAutoplay = (reason='manual',hold=true) => {
    if (['complete','cancelled','abandoned'].includes(autoplayState)) return;
    clearAutoplayTimers();
    autoplayState = reason === 'abandoned' ? 'abandoned' : 'cancelled';
    root.dataset.autoplay = autoplayState;
    root.classList.remove('is-autoplaying','is-autoplay-armed');
    if (hold) manualUntil = Math.max(manualUntil,performance.now()+1200);
  };

  const finishAutoplay = () => {
    clearAutoplayTimers();
    autoplayState = 'complete';
    root.dataset.autoplay = 'complete';
    root.classList.remove('is-autoplaying','is-autoplay-armed');
    setState(4,'autoplay');
  };

  const scheduleAutoplayStep = (delay,state) => autoplayTimers.push(setTimeout(() => {
    if (autoplayState === 'running' && !document.hidden && autoplayVisibility >= .42) setState(state,'autoplay');
  },delay));

  const startAutoplay = () => {
    if (autoplayState !== 'armed' || !desktopAutoplayEligible() || document.hidden || autoplayVisibility < .58) return;
    autoplayState = 'running';
    autoplayStartedAt = performance.now();
    autoplayStartScrollY = scrollY;
    root.dataset.autoplay = 'running';
    root.classList.remove('is-autoplay-armed');
    root.classList.add('is-autoplaying');
    setState(1,'autoplay');
    scheduleAutoplayStep(2500,2);
    scheduleAutoplayStep(5200,3);
    scheduleAutoplayStep(8100,4);
    autoplayTimers.push(setTimeout(() => autoplayState === 'running' && finishAutoplay(),9100));
  };

  const scheduleAutoplayStart = () => {
    if (autoplayState !== 'armed') return;
    clearTimeout(autoplayIdleTimer);
    const idleRemaining = Math.max(0,650-(performance.now()-lastUserScrollAt));
    autoplayIdleTimer = setTimeout(() => {
      if (autoplayState !== 'armed') return;
      if (!desktopAutoplayEligible() || document.hidden || autoplayVisibility < .58) return;
      if (performance.now()-lastUserScrollAt < 640) return scheduleAutoplayStart();
      startAutoplay();
    },Math.max(820,idleRemaining));
  };

  const armAutoplay = () => {
    if (autoplayState !== 'idle' || !desktopAutoplayEligible() || document.hidden || autoplayVisibility < .58) return;
    autoplayState = 'armed';
    autoplayArmScrollY = scrollY;
    root.dataset.autoplay = 'armed';
    root.classList.add('is-autoplay-armed');
    setState(1,'autoplay');
    scheduleAutoplayStart();
  };

  const runMobileCue = () => {
    if (mobileCueDone || reducedMotion.matches || !portrait.matches || lowLandscape.matches || currentState !== 1) return;
    mobileCueDone = true;
    root.classList.add('is-mobile-cue');
    clearTimeout(mobileCueTimer);
    mobileCueTimer = setTimeout(() => root.classList.remove('is-mobile-cue'),820);
  };

  const stateFromProgress = p => p < .23 ? 1 : p < .48 ? 2 : p < .73 ? 3 : 4;
  const desktopProgress = () => {
    const rect = experience.getBoundingClientRect();
    const viewport = innerHeight;
    const startLine = viewport*.30;
    const travel = Math.max(360,rect.height-viewport*.42);
    return clamp((startLine-rect.top)/travel,0,1);
  };

  const makeRunway = (cacheName,multiplier,startFactor,minTravelFactor) => {
    const rect = experience.getBoundingClientRect();
    const absoluteTop = scrollY + rect.top;
    const cssMinHeight = parseFloat(getComputedStyle(experience).minHeight);
    const stableViewport = Number.isFinite(cssMinHeight) && cssMinHeight > innerHeight*1.25 ? cssMinHeight/multiplier : innerHeight;
    const runwayHeight = Number.isFinite(cssMinHeight) && cssMinHeight > stableViewport ? cssMinHeight : stableViewport*multiplier;
    return {startScroll:absoluteTop-stableViewport*startFactor,travel:Math.max(stableViewport*minTravelFactor,runwayHeight-stableViewport*.80),stableViewport};
  };

  const getPortraitRunway = () => portraitRunway || (portraitRunway = makeRunway('portrait',PORTRAIT_RUNWAY_MULTIPLIER,.28,1.25));
  const getTabletRunway = () => tabletRunway || (tabletRunway = makeRunway('tablet',TABLET_RUNWAY_MULTIPLIER,.14,.90));
  const getLandscapeRunway = () => landscapeRunway || (landscapeRunway = makeRunway('landscape',LANDSCAPE_RUNWAY_MULTIPLIER,0,.95));
  const progressFor = runway => clamp((scrollY-runway.startScroll)/runway.travel,0,1);

  const stableStateFromProgress = (progress,direction,initialized) => {
    if (!initialized || direction === 0) return currentState;
    if (direction > 0) {
      if (progress >= PORTRAIT_FORWARD[3]) return Math.max(currentState,4);
      if (progress >= PORTRAIT_FORWARD[2]) return Math.max(currentState,3);
      if (progress >= PORTRAIT_FORWARD[1]) return Math.max(currentState,2);
      return currentState;
    }
    if (progress <= PORTRAIT_REVERSE[1]) return Math.min(currentState,1);
    if (progress <= PORTRAIT_REVERSE[2]) return Math.min(currentState,2);
    if (progress <= PORTRAIT_REVERSE[3]) return Math.min(currentState,3);
    return currentState;
  };

  const updateFromScroll = () => {
    frameRequested = false;
    if (reducedMotion.matches) return;
    if (desktopAutoplayEligible() && ['armed','running','complete','cancelled'].includes(autoplayState)) return;

    const y = scrollY;
    const delta = y-lastScrollY;
    const direction = delta > 1 ? 1 : delta < -1 ? -1 : 0;
    lastScrollY = y;
    if (scrollLedMode()) noteScrollSession(direction);
    if (performance.now() < manualUntil) return;

    if (portrait.matches && !lowLandscape.matches) {
      const desired = stableStateFromProgress(progressFor(getPortraitRunway()),direction,portraitInitialized);
      portraitInitialized = true;
      updateReadingWindow(direction);
      setState(governedMobileState(desired,direction));
      return;
    }
    if (tabletScroll.matches && !lowLandscape.matches) {
      const desired = stableStateFromProgress(progressFor(getTabletRunway()),direction,tabletInitialized);
      tabletInitialized = true;
      updateReadingWindow(direction);
      setState(governedMobileState(desired,direction));
      return;
    }
    if (lowLandscape.matches) {
      const desired = stableStateFromProgress(progressFor(getLandscapeRunway()),direction,true);
      updateReadingWindow(direction);
      setState(governedMobileState(desired,direction));
      return;
    }
    setState(stateFromProgress(desktopProgress()));
  };

  const onScroll = () => {
    if (desktopAutoplayEligible()) {
      if (autoplayState === 'running' && Math.abs(scrollY-autoplayStartScrollY)>4 && performance.now()-autoplayStartedAt>120) cancelAutoplay('manual',true);
      else if (autoplayState === 'armed') {
        if (Math.abs(scrollY-autoplayArmScrollY)>innerHeight*.48) cancelAutoplay('abandoned',false);
        else { lastUserScrollAt = performance.now(); scheduleAutoplayStart(); }
      } else if (autoplayState === 'idle') lastUserScrollAt = performance.now();
    }
    if (frameRequested) return;
    frameRequested = true;
    requestAnimationFrame(updateFromScroll);
  };

  const configureMode = () => {
    const nextLow = lowLandscape.matches, nextPortrait = portrait.matches, nextTablet = tabletScroll.matches;
    const changed = nextLow!==knownLowLandscape || nextPortrait!==knownPortrait || nextTablet!==knownTabletScroll;
    knownLowLandscape=nextLow; knownPortrait=nextPortrait; knownTabletScroll=nextTablet;
    if (!changed && performance.now()<modeTransitionUntil) return;
    cancelAnimationFrame(modeFrame);
    if (changed) {
      if (autoplayState==='running'||autoplayState==='armed') cancelAutoplay('manual',true);
      portraitRunway=tabletRunway=landscapeRunway=null;
      portraitInitialized=tabletInitialized=false;
      lastScrollY=scrollY;
      endGesture();
      resetReadWindow();
      modeTransitionUntil=performance.now()+280;
      manualUntil=Math.max(manualUntil,performance.now()+600);
      modeFrame=requestAnimationFrame(()=>modeFrame=requestAnimationFrame(()=>{
        if (reducedMotion.matches) setState(4); else updateFromScroll();
      }));
      return;
    }
    modeFrame=requestAnimationFrame(()=>{manualUntil=0; reducedMotion.matches?setState(4):updateFromScroll();});
  };

  const inspectStage = button => {
    cancelAutoplay('manual',true);
    setState(Number(button.dataset.stageButton),'manual');
    updateReadingWindow(0);
  };

  stageButtons.forEach(button => {
    button.addEventListener('pointerdown',()=>cancelAutoplay('manual',true));
    button.addEventListener('click',()=>inspectStage(button));
    button.addEventListener('focus',()=>inspectStage(button));
    button.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ') inspectStage(button);});
    button.addEventListener('pointerenter',()=>{
      if(!finePointer.matches)return;
      clearTimeout(hoverIntentTimer);
      hoverIntentTimer=setTimeout(()=>inspectStage(button),120);
    });
    button.addEventListener('pointerleave',()=>clearTimeout(hoverIntentTimer));
  });

  const visibilityObserver = new IntersectionObserver(entries => {
    const entry=entries[0];
    autoplayVisibility=entry?.intersectionRatio||0;
    if (portrait.matches && autoplayVisibility>=.35) runMobileCue();
    if (!desktopAutoplayEligible()) return;
    if (autoplayVisibility>=.58 && autoplayState==='idle') armAutoplay();
    if (autoplayVisibility<.35) {
      if (autoplayState==='running') cancelAutoplay('manual',true);
      else if (autoplayState==='armed') cancelAutoplay('abandoned',false);
    }
  },{threshold:[0,.35,.58,.72]});
  visibilityObserver.observe(stickyStage||experience);

  const onResize=()=>{
    if(Math.abs(innerWidth-knownViewportWidth)>2){knownViewportWidth=innerWidth;portraitRunway=tabletRunway=landscapeRunway=null;}
    onScroll();
  };

  window.addEventListener('touchstart',()=>{
    if (!scrollLedMode()) { cancelAutoplay('manual',true); return; }
    touchContact=true;
    clearTimeout(scrollIdleTimer);
    endGesture();
    beginGesture('touch');
    cancelAutoplay('manual',true);
  },{passive:true});
  window.addEventListener('touchmove',()=>{ if(scrollLedMode()&&!gestureActive) beginGesture('touch'); },{passive:true});
  window.addEventListener('touchend',()=>{ touchContact=false; scheduleGestureEnd(); },{passive:true});
  window.addEventListener('touchcancel',()=>{ touchContact=false; scheduleGestureEnd(); },{passive:true});
  if ('onscrollend' in window) window.addEventListener('scrollend',()=>{ if(!touchContact) endGesture(); },{passive:true});

  window.addEventListener('wheel',()=>{
    if(autoplayState==='running')cancelAutoplay('manual',true);
    else if(autoplayState==='armed'){lastUserScrollAt=performance.now();scheduleAutoplayStart();}
  },{passive:true});
  window.addEventListener('keydown',e=>{
    if(autoplayState==='running'&&['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(e.key))cancelAutoplay('manual',true);
  });
  document.addEventListener('selectionchange',()=>{
    if(autoplayState!=='running')return;
    const s=document.getSelection(); if(!s||s.isCollapsed)return;
    const a=s.anchorNode; const t=a?.nodeType===Node.TEXT_NODE?a.parentNode:a;
    if(t&&root.contains(t))cancelAutoplay('manual',true);
  });
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){if(autoplayState==='running')cancelAutoplay('manual',true);else if(autoplayState==='armed')clearTimeout(autoplayIdleTimer);}
    else if(autoplayState==='armed')scheduleAutoplayStart();
  });

  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',onResize,{passive:true});
  window.addEventListener('orientationchange',configureMode,{passive:true});
  reducedMotion.addEventListener?.('change',configureMode);
  lowLandscape.addEventListener?.('change',configureMode);
  portrait.addEventListener?.('change',configureMode);
  tabletScroll.addEventListener?.('change',configureMode);
  finePointer.addEventListener?.('change',()=>{if(!desktopAutoplayEligible()&&(autoplayState==='armed'||autoplayState==='running'))cancelAutoplay('manual',true);});
  desktopViewport.addEventListener?.('change',configureMode);

  window.addEventListener('pagehide',()=>{
    clearAutoplayTimers(); clearTimeout(mobileCueTimer); clearTimeout(hoverIntentTimer); clearTimeout(lockTimer); clearTimeout(scrollIdleTimer);
    lockObserver.disconnect(); visibilityObserver.disconnect();
  },{once:true});

  root.dataset.autoplay = reducedMotion.matches ? 'disabled' : 'idle';
  root.dataset.readingWindow = reducedMotion.matches ? 'final' : 'enter';
  if(reducedMotion.matches)setState(4);
  else{
    setState(1);
    resetReadWindow();
    requestAnimationFrame(updateFromScroll);
    requestAnimationFrame(()=>semanticLock('1'));
  }
})();
