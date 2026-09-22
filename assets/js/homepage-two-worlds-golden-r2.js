/* ProAI Expert — Two Worlds Golden Premium R2
   One normalized physical state for desktop, portrait and phone landscape.
   No independent fold runtime. RAF runs only while desktop interaction settles. */
(function () {
  'use strict';

  var sections = Array.prototype.slice.call(document.querySelectorAll('[data-tw-r2]'));
  if (!sections.length) return;

  var fine = window.matchMedia('(hover:hover) and (pointer:fine)');
  var coarse = window.matchMedia('(hover:none) and (pointer:coarse)');
  var mobile = window.matchMedia('(max-width:980px), ((hover:none) and (pointer:coarse))');
  var landscape = window.matchMedia('(orientation:landscape) and (max-height:540px) and (max-width:980px) and (hover:none) and (pointer:coarse)');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var scrollRaf = 0;
  var resizeTimer = 0;
  var states = new WeakMap();
  var metricCanvas = document.createElement('canvas');
  var metricContext = metricCanvas.getContext && metricCanvas.getContext('2d');

  function clamp(v,min,max){ return Math.max(min,Math.min(max,v)); }
  function lerp(a,b,t){ return a + (b-a)*t; }
  function smoothstep(t){ t=clamp(t,0,1); return t*t*(3-2*t); }
  function pct(n){ return n.toFixed(3)+'%'; }
  function px(n){ return n.toFixed(2)+'px'; }
  function deg(n){ return n.toFixed(3)+'deg'; }

  function stateFor(section) {
    var s = states.get(section);
    if (!s) {
      s = {
        current:.5,
        target:.5,
        raf:0,
        lastTime:0,
        owner:'ai',
        lightX:0,
        lightY:0,
        targetLightX:0,
        targetLightY:0,
        viewportWidth:0,
        viewportHeight:0,
        mode:'',
        fontMetrics:Object.create(null),
        entered:false,
        focusTimer:0
      };
      states.set(section,s);
    }
    return s;
  }

  function getMode() {
    if (reduced.matches) return 'reduced';
    if (landscape.matches) return 'landscape';
    if (mobile.matches) return 'portrait';
    return 'desktop';
  }

  function worldText(section,world) {
    var node=section.querySelector('.tw-r2__inscription--'+world);
    return node ? (node.textContent||'').trim() : '';
  }

  function cacheTextMetrics(section) {
    var s=stateFor(section);
    if (!metricContext) return;
    var computed=window.getComputedStyle(section);
    var family=computed.fontFamily || 'Inter, sans-serif';
    ['ai','web'].forEach(function(world){
      var text=worldText(section,world);
      var key=world+'|'+text+'|'+family;
      if (s.fontMetrics[key]) return;
      metricContext.font='760 100px '+family;
      s.fontMetrics[key]=Math.max(1,metricContext.measureText(text).width);
    });
  }

  function measureWordAt100(section,world) {
    var s=stateFor(section);
    var computed=window.getComputedStyle(section);
    var family=computed.fontFamily || 'Inter, sans-serif';
    var text=worldText(section,world);
    var key=world+'|'+text+'|'+family;
    if (!s.fontMetrics[key]) cacheTextMetrics(section);
    return s.fontMetrics[key] || (world==='web' ? 620 : 430);
  }

  function layoutMetrics(section, p) {
    var s=stateFor(section);
    var w=Math.max(1,s.viewportWidth);
    var h=Math.max(1,s.viewportHeight);
    var signed=(p-.5)*2; // -1 AI, +1 Web

    /* 67/33 endpoint split keeps the R1 world-expansion idea without 80/20 drama. */
    var boundary=50-(17*signed);
    var perspectiveSlope=2.0*signed;
    var boundaryTop=boundary+perspectiveSlope;
    var boundaryBottom=boundary-perspectiveSlope;

    var aiActive=Math.max(0,-signed);
    var webActive=Math.max(0,signed);
    var aiInactive=Math.max(0,signed);
    var webInactive=Math.max(0,-signed);

    var isLand=s.mode==='landscape';
    var isPortrait=s.mode==='portrait';

    var foldBase=isLand ? clamp(w*.038,28,38) : (isPortrait ? clamp(w*.125,42,58) : clamp(w*.045,58,82));
    var foldWidth=foldBase*(1-.12*Math.abs(signed));
    var foldRy=signed*(isLand ? 4.6 : 5.4);

    var aiRy=-2.0 + (1.25*aiActive) - (5.1*aiInactive);
    var webRy= 2.0 - (1.25*webActive) + (5.1*webInactive);
    var depthActive=isLand ? 12 : 17;
    var depthInactive=isLand ? -42 : -52;
    var aiZ=depthActive*aiActive + depthInactive*aiInactive;
    var webZ=depthActive*webActive + depthInactive*webInactive;
    var aiX=-(isLand?1.7:2.7)*aiInactive;
    var webX=(isLand?1.7:2.7)*webInactive;

    var outerSafePct=isLand ? 4.0 : (isPortrait ? 7.0 : 3.8);
    var foldSafePx=(foldWidth*.56)+(isLand?10:(isPortrait?12:18));
    var foldSafePct=foldSafePx/w*100;

    var aiLeft=outerSafePct;
    var aiRight=Math.max(aiLeft+8,boundary-foldSafePct);
    var webLeft=Math.min(100-outerSafePct-8,boundary+foldSafePct);
    var webRight=100-outerSafePct;

    var aiCenter=(aiLeft+aiRight)/2;
    var webCenter=(webLeft+webRight)/2;
    var aiAvail=Math.max(20,(aiRight-aiLeft)/100*w);
    var webAvail=Math.max(20,(webRight-webLeft)/100*w);

    function wordSize(world,avail) {
      var measured=measureWordAt100(section,world);
      /* Optical safe-zone wins over an arbitrary type floor. Active worlds
         remain architectural; narrow/inactive territories may scale lower so
         no glyph is accidentally clipped by the viewport or hinge. */
      var fit=100*(avail*.84)/measured;
      var maxByHeight=isLand ? h*.155 : (isPortrait ? h*.105 : h*.18);
      var floor=isLand ? 30 : (isPortrait ? 34 : 56);
      var max=isLand ? 68 : (isPortrait ? 94 : 160);
      var safeFloor=Math.min(floor,fit);
      return clamp(Math.min(fit,maxByHeight),safeFloor,max);
    }

    function titleSize(avail,active) {
      var ratio=isLand ? .105 : (isPortrait ? .115 : .085);
      var min=isLand ? 24 : (isPortrait ? 31 : 34);
      var max=isLand ? 34 : (isPortrait ? 44 : 58);
      var value=clamp(avail*ratio+(active*4),min,max);
      if (document.body && document.body.classList.contains('lang-ru')) value*=isLand?.90:.94;
      return clamp(value,min,max);
    }

    var aiAuthority=.5+.5*aiActive-.35*aiInactive;
    var webAuthority=.5+.5*webActive-.35*webInactive;
    var aiDetail=clamp(.62+.38*aiActive-.27*aiInactive,.34,1);
    var webDetail=clamp(.62+.38*webActive-.27*webInactive,.34,1);

    return {
      boundary:boundary,
      boundaryTop:boundaryTop,
      boundaryBottom:boundaryBottom,
      foldWidth:foldWidth,
      foldRy:foldRy,
      aiRy:aiRy,webRy:webRy,aiZ:aiZ,webZ:webZ,aiX:aiX,webX:webX,
      aiCenter:aiCenter,webCenter:webCenter,
      aiWordSize:wordSize('ai',aiAvail),
      webWordSize:wordSize('web',webAvail),
      aiTitleSize:titleSize(aiAvail,aiActive),
      webTitleSize:titleSize(webAvail,webActive),
      aiDetail:aiDetail,webDetail:webDetail,
      aiOpacity:clamp(.76+.24*aiActive-.14*aiInactive,.60,1),
      webOpacity:clamp(.76+.24*webActive-.14*webInactive,.60,1),
      aiInscription:clamp(.050+.026*aiAuthority,.045,.078),
      webInscription:clamp(.050+.026*webAuthority,.045,.078),
      aiContentWidth:isLand ? null : clamp(aiAvail*.94,isPortrait?250:300,isPortrait?520:690),
      webContentWidth:isLand ? null : clamp(webAvail*.94,isPortrait?250:300,isPortrait?520:690)
    };
  }

  function semanticFocus(p) {
    if (p < .455) return 'ai';
    if (p > .545) return 'web';
    return 'neutral';
  }

  function mobileOwner(section,p) {
    var s=stateFor(section);
    if (s.owner==='ai' && p>.57) s.owner='web';
    else if (s.owner==='web' && p<.43) s.owner='ai';
    else if (s.owner!=='ai' && s.owner!=='web') s.owner=p>=.5?'web':'ai';
    section.setAttribute('data-owner',s.owner);
  }

  function applyState(section,p) {
    var s=stateFor(section);
    p=clamp(p,0,1);
    var g=layoutMetrics(section,p);
    section.style.setProperty('--tw-progress',p.toFixed(4));
    section.style.setProperty('--tw-boundary-top',pct(g.boundaryTop));
    section.style.setProperty('--tw-boundary-bottom',pct(g.boundaryBottom));
    section.style.setProperty('--tw-fold-x',pct(g.boundary));
    section.style.setProperty('--tw-fold-width',px(g.foldWidth));
    section.style.setProperty('--tw-fold-ry',deg(g.foldRy));
    section.style.setProperty('--tw-ai-x',pct(g.aiX));
    section.style.setProperty('--tw-web-x',pct(g.webX));
    section.style.setProperty('--tw-ai-z',px(g.aiZ));
    section.style.setProperty('--tw-web-z',px(g.webZ));
    section.style.setProperty('--tw-ai-ry',deg(g.aiRy));
    section.style.setProperty('--tw-web-ry',deg(g.webRy));
    section.style.setProperty('--tw-ai-opacity',g.aiOpacity.toFixed(3));
    section.style.setProperty('--tw-web-opacity',g.webOpacity.toFixed(3));
    section.style.setProperty('--tw-ai-detail',g.aiDetail.toFixed(3));
    section.style.setProperty('--tw-web-detail',g.webDetail.toFixed(3));
    section.style.setProperty('--tw-ai-inscription',g.aiInscription.toFixed(4));
    section.style.setProperty('--tw-web-inscription',g.webInscription.toFixed(4));
    section.style.setProperty('--tw-ai-inscription-center',pct(g.aiCenter));
    section.style.setProperty('--tw-web-inscription-center',pct(g.webCenter));
    section.style.setProperty('--tw-ai-inscription-size',px(g.aiWordSize));
    section.style.setProperty('--tw-web-inscription-size',px(g.webWordSize));
    section.style.setProperty('--tw-ai-title-size',px(g.aiTitleSize));
    section.style.setProperty('--tw-web-title-size',px(g.webTitleSize));
    if (g.aiContentWidth) section.style.setProperty('--tw-ai-content-width',px(g.aiContentWidth));
    else section.style.removeProperty('--tw-ai-content-width');
    if (g.webContentWidth) section.style.setProperty('--tw-web-content-width',px(g.webContentWidth));
    else section.style.removeProperty('--tw-web-content-width');

    var focus=semanticFocus(p);
    if (section.getAttribute('data-focus')!==focus) section.setAttribute('data-focus',focus);
    if (s.mode==='portrait' || s.mode==='landscape') mobileOwner(section,p);
  }

  function applyLight(section) {
    var s=stateFor(section);
    section.style.setProperty('--tw-light-x',pct(s.lightX));
    section.style.setProperty('--tw-light-y',pct(s.lightY));
  }

  function settle(section,time) {
    var s=stateFor(section);
    s.raf=0;
    if (s.mode!=='desktop' || reduced.matches) return;
    var dt=s.lastTime ? clamp((time-s.lastTime)/16.667,.5,2.4) : 1;
    s.lastTime=time;
    var k=1-Math.pow(.86,dt);
    var lk=1-Math.pow(.80,dt);
    s.current += (s.target-s.current)*k;
    s.lightX += (s.targetLightX-s.lightX)*lk;
    s.lightY += (s.targetLightY-s.lightY)*lk;
    if (Math.abs(s.target-s.current)<.0007) s.current=s.target;
    if (Math.abs(s.targetLightX-s.lightX)<.02) s.lightX=s.targetLightX;
    if (Math.abs(s.targetLightY-s.lightY)<.02) s.lightY=s.targetLightY;
    applyState(section,s.current);
    applyLight(section);
    if (s.current!==s.target || s.lightX!==s.targetLightX || s.lightY!==s.targetLightY) {
      s.raf=window.requestAnimationFrame(function(t){settle(section,t);});
    } else s.lastTime=0;
  }

  function scheduleSettle(section) {
    var s=stateFor(section);
    if (s.raf || s.mode!=='desktop' || reduced.matches) return;
    s.raf=window.requestAnimationFrame(function(t){settle(section,t);});
  }

  function desktopTargetFromPointer(normX) {
    if (normX>.47 && normX<.53) return .5;
    var t=clamp((normX-.12)/.76,0,1);
    return smoothstep(t);
  }

  function syncViewport(section,preserve) {
    var s=stateFor(section);
    var viewport=section.querySelector('[data-tw-viewport]');
    if (!viewport) return;
    var rect=viewport.getBoundingClientRect();
    s.viewportWidth=Math.max(1,rect.width||viewport.offsetWidth||window.innerWidth);
    s.viewportHeight=Math.max(1,rect.height||viewport.offsetHeight||window.innerHeight);
    var nextMode=getMode();
    var modeChanged=s.mode!==nextMode;
    s.mode=nextMode;
    cacheTextMetrics(section);

    if (nextMode==='reduced') {
      s.current=.5; s.target=.5; s.owner='ai';
      section.setAttribute('data-owner','ai');
      section.setAttribute('data-focus','neutral');
      applyState(section,.5);
      return;
    }

    if (nextMode==='desktop') {
      if (!preserve || modeChanged) { s.current=.5; s.target=.5; }
      applyState(section,s.current);
      applyLight(section);
    } else {
      updateScrollSection(section,true);
    }
  }

  function scrollProgress(section) {
    var experience=section.querySelector('[data-tw-experience]');
    var viewport=section.querySelector('[data-tw-viewport]');
    if (!experience || !viewport) return .5;
    var vh=Math.max(1,viewport.getBoundingClientRect().height||viewport.offsetHeight||window.innerHeight);
    var travel=Math.max(1,experience.offsetHeight-vh);
    var rect=experience.getBoundingClientRect();
    var absoluteTop=rect.top+window.scrollY;
    return clamp((window.scrollY-absoluteTop)/travel,0,1);
  }

  function updateScrollSection(section,immediate) {
    var s=stateFor(section);
    if (s.mode!=='portrait' && s.mode!=='landscape') return;
    var raw=scrollProgress(section);
    /* Keep geometry continuous; easing only shapes perceived material weight. */
    var p=(.72*raw)+(.28*smoothstep(raw));
    s.current=p;
    s.target=p;
    applyState(section,p);
    if (immediate) applyLight(section);
  }

  function runScroll() {
    scrollRaf=0;
    sections.forEach(function(section){updateScrollSection(section,false);});
  }
  function scheduleScroll() {
    if (!scrollRaf) scrollRaf=window.requestAnimationFrame(runScroll);
  }

  function triggerEntryLight(section) {
    var s=stateFor(section);
    if (s.entered || reduced.matches) return;
    s.entered=true;
    section.setAttribute('data-entry-lit','run');
    window.setTimeout(function(){section.setAttribute('data-entry-lit','done');},1700);
  }

  function bindSection(section) {
    var s=stateFor(section);
    var viewport=section.querySelector('[data-tw-viewport]');
    var ai=section.querySelector('[data-tw-world="ai"]');
    var web=section.querySelector('[data-tw-world="web"]');
    if (!viewport || !ai || !web) return;

    viewport.addEventListener('pointermove',function(event){
      if (s.mode!=='desktop' || !fine.matches || reduced.matches) return;
      var rect=viewport.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      var nx=clamp((event.clientX-rect.left)/rect.width,0,1);
      var ny=clamp((event.clientY-rect.top)/rect.height,0,1);
      s.target=desktopTargetFromPointer(nx);
      s.targetLightX=(nx-.5)*3.2;
      s.targetLightY=(ny-.5)*1.8;
      scheduleSettle(section);
    },{passive:true});

    viewport.addEventListener('pointerleave',function(){
      if (s.mode!=='desktop' || reduced.matches) return;
      s.target=.5;
      s.targetLightX=0;
      s.targetLightY=0;
      scheduleSettle(section);
    },{passive:true});

    section.addEventListener('focusin',function(event){
      if (s.mode!=='desktop' || reduced.matches) return;
      window.clearTimeout(s.focusTimer);
      if (ai.contains(event.target)) s.target=.06;
      else if (web.contains(event.target)) s.target=.94;
      else return;
      scheduleSettle(section);
    });

    section.addEventListener('focusout',function(){
      if (s.mode!=='desktop' || reduced.matches) return;
      window.clearTimeout(s.focusTimer);
      s.focusTimer=window.setTimeout(function(){
        if (!section.contains(document.activeElement)) {
          s.target=.5;
          scheduleSettle(section);
        }
      },80);
    });

    if ('ResizeObserver' in window) {
      new ResizeObserver(function(){
        window.clearTimeout(resizeTimer);
        resizeTimer=window.setTimeout(function(){syncViewport(section,true);},60);
      }).observe(viewport);
    }

    if ('IntersectionObserver' in window) {
      var io=new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if (entry.isIntersecting && entry.intersectionRatio>.32) {
            triggerEntryLight(section);
            io.unobserve(section);
          }
        });
      },{threshold:[.32,.5]});
      io.observe(section);
    } else triggerEntryLight(section);

    syncViewport(section,false);
  }

  sections.forEach(bindSection);

  window.addEventListener('scroll',scheduleScroll,{passive:true});
  window.addEventListener('resize',function(){
    window.clearTimeout(resizeTimer);
    resizeTimer=window.setTimeout(function(){
      sections.forEach(function(section){syncViewport(section,true);});
      scheduleScroll();
    },70);
  },{passive:true});

  window.addEventListener('orientationchange',function(){
    /* Preserve semantic progress through orientation; recalc projection after
       browser metrics settle, then resume from stable sticky geometry. */
    window.setTimeout(function(){
      sections.forEach(function(section){syncViewport(section,true);});
      scheduleScroll();
    },120);
  },{passive:true});

  if (window.visualViewport) window.visualViewport.addEventListener('resize',function(){
    window.clearTimeout(resizeTimer);
    resizeTimer=window.setTimeout(function(){
      sections.forEach(function(section){syncViewport(section,true);});
      scheduleScroll();
    },90);
  },{passive:true});

  [fine,coarse,mobile,landscape,reduced].forEach(function(q){
    var fn=function(){sections.forEach(function(section){syncViewport(section,true);});scheduleScroll();};
    if (typeof q.addEventListener==='function') q.addEventListener('change',fn);
    else if (typeof q.addListener==='function') q.addListener(fn);
  });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function(){
      sections.forEach(function(section){cacheTextMetrics(section);syncViewport(section,true);});
    });
  }

  window.addEventListener('pageshow',function(){
    sections.forEach(function(section){syncViewport(section,true);});
    scheduleScroll();
  },{passive:true});
}());
