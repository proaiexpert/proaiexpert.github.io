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

  // R1.4.6 mobile stabilization: physical document position is the only mobile authority.
  const MOBILE_FORWARD = [0.26,0.51,0.76];
  const MOBILE_REVERSE = [0.22,0.47,0.72];
  const clamp = (v,min,max) => Math.max(min,Math.min(max,v));

  let currentState = 4;
  let manualUntil = 0;
  let frameRequested = false;
  let modeFrame = 0;
  let mobileTrackFrame = 0;
  let knownLowLandscape = lowLandscape.matches;
  let knownPortrait = portrait.matches;
  let knownTabletScroll = tabletScroll.matches;
  let knownViewportWidth = innerWidth;
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
    if (source === 'manual' && !scrollLedMode()) manualUntil = performance.now() + 900;
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

  const physicalMobileProgress = () => {
    const rect = experience.getBoundingClientRect();
    const absoluteTop = scrollY + rect.top;
    const vv = window.visualViewport;
    const viewport = vv ? vv.height : innerHeight;
    const travel = Math.max(1,experience.offsetHeight - viewport);
    return clamp((scrollY - absoluteTop) / travel,0,1);
  };

  const canonicalMobileState = progress => (
    progress < .24 ? 1 :
    progress < .49 ? 2 :
    progress < .74 ? 3 : 4
  );

  const hystereticMobileState = progress => {
    let state = currentState;
    if (!Number.isFinite(progress)) return state;

    // Hysteresis depends only on physical position and current state.
    // No gesture/session/direction variable participates in correctness.
    while (state < 4 && progress >= MOBILE_FORWARD[state-1]) state += 1;
    while (state > 1 && progress <= MOBILE_REVERSE[state-2]) state -= 1;
    return state;
  };

  const syncMobileState = (forceCanonical=false) => {
    if (!scrollLedMode()) return;
    const progress = physicalMobileProgress();

    // Physical scroll position is the single mobile authority.
    // A large Safari flick can cross several boundaries in one sample.
    setState(forceCanonical ? canonicalMobileState(progress) : hystereticMobileState(progress));
  };

  const mobileRunwayNearViewport = () => {
    const rect = experience.getBoundingClientRect();
    const viewport = window.visualViewport?.height || innerHeight;
    return rect.bottom >= -viewport && rect.top <= viewport*2;
  };

  const trackMobilePosition = () => {
    mobileTrackFrame = 0;
    if (!scrollLedMode() || document.hidden || !mobileRunwayNearViewport()) return;
    syncMobileState(false);
    mobileTrackFrame = requestAnimationFrame(trackMobilePosition);
  };

  const ensureMobileTracking = () => {
    if (!scrollLedMode() || document.hidden || mobileTrackFrame || !mobileRunwayNearViewport()) return;
    mobileTrackFrame = requestAnimationFrame(trackMobilePosition);
  };

  const stopMobileTracking = () => {
    cancelAnimationFrame(mobileTrackFrame);
    mobileTrackFrame = 0;
  };

  const updateFromScroll = () => {
    frameRequested = false;
    if (reducedMotion.matches) return;

    if (scrollLedMode()) {
      syncMobileState(false);
      ensureMobileTracking();
      return;
    }

    if (desktopAutoplayEligible() && ['armed','running','complete','cancelled'].includes(autoplayState)) return;
    if (performance.now() < manualUntil) return;
    setState(stateFromProgress(desktopProgress()));
  };

  const onScroll = () => {
    if (scrollLedMode()) {
      // Safari/WebKit must never wait an extra animation frame to reconcile
      // mobile state with the physical page position.
      updateFromScroll();
      return;
    }
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
    const nextLow = lowLandscape.matches;
    const nextPortrait = portrait.matches;
    const nextTablet = tabletScroll.matches;
    const changed = nextLow!==knownLowLandscape || nextPortrait!==knownPortrait || nextTablet!==knownTabletScroll;
    knownLowLandscape=nextLow;
    knownPortrait=nextPortrait;
    knownTabletScroll=nextTablet;
    cancelAnimationFrame(modeFrame);
    stopMobileTracking();
    if (changed && (autoplayState==='running'||autoplayState==='armed')) cancelAutoplay('manual',true);
    modeFrame=requestAnimationFrame(()=>modeFrame=requestAnimationFrame(()=>{
      if (reducedMotion.matches) setState(4);
      else if (scrollLedMode()) {
        syncMobileState(true);
        ensureMobileTracking();
      } else updateFromScroll();
    }));
  };

  const inspectStage = button => {
    if (scrollLedMode()) return;
    cancelAutoplay('manual',true);
    setState(Number(button.dataset.stageButton),'manual');
  };

  stageButtons.forEach(button => {
    button.addEventListener('pointerdown',()=>{ if (!scrollLedMode()) cancelAutoplay('manual',true); });
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
    if(Math.abs(innerWidth-knownViewportWidth)>2) knownViewportWidth=innerWidth;
    onScroll();
  };

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
    if(document.hidden){
      stopMobileTracking();
      if(autoplayState==='running')cancelAutoplay('manual',true);
      else if(autoplayState==='armed')clearTimeout(autoplayIdleTimer);
    } else {
      if(scrollLedMode()){
        syncMobileState(true);
        ensureMobileTracking();
      } else if(autoplayState==='armed')scheduleAutoplayStart();
    }
  });

  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',onResize,{passive:true});
  window.visualViewport?.addEventListener('resize',onResize,{passive:true});
  window.visualViewport?.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('orientationchange',configureMode,{passive:true});
  reducedMotion.addEventListener?.('change',configureMode);
  lowLandscape.addEventListener?.('change',configureMode);
  portrait.addEventListener?.('change',configureMode);
  tabletScroll.addEventListener?.('change',configureMode);
  finePointer.addEventListener?.('change',()=>{if(!desktopAutoplayEligible()&&(autoplayState==='armed'||autoplayState==='running'))cancelAutoplay('manual',true);});
  desktopViewport.addEventListener?.('change',configureMode);

  window.addEventListener('pagehide',()=>{
    clearAutoplayTimers(); clearTimeout(mobileCueTimer); clearTimeout(hoverIntentTimer); clearTimeout(lockTimer);
    stopMobileTracking();
    lockObserver.disconnect(); visibilityObserver.disconnect();
  },{once:true});

  root.dataset.autoplay = reducedMotion.matches ? 'disabled' : 'idle';
  if(reducedMotion.matches)setState(4);
  else{
    if (scrollLedMode()) {
      syncMobileState(true);
      ensureMobileTracking();
    } else setState(1);
    requestAnimationFrame(updateFromScroll);
    requestAnimationFrame(()=>semanticLock(String(currentState)));
  }
})();
