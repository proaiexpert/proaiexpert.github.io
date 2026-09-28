/* ProAI Expert — Two Worlds R6 Compositor-Native Scroll Motion
   Mobile authority: territory geometry -> one normalized physical progress.
   No timer-driven turn, no forced scroll, no gesture-session gate. */
(function () {
  'use strict';

  var sections=Array.prototype.slice.call(document.querySelectorAll('[data-tw-r5]'));
  if(!sections.length)return;

  var finePointer=window.matchMedia('(hover:hover) and (pointer:fine)');
  var mobileQuery=window.matchMedia('(max-width:980px), ((hover:none) and (pointer:coarse))');
  var landscapeQuery=window.matchMedia('(orientation:landscape) and (max-height:540px) and (max-width:980px)');
  var reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
  var states=new WeakMap();
  var meters=new Map();

  var AI_AUTHORITY_END=.24;
  var WEB_HOLD_START=.64;
  var IGNORE_SCROLL_PX=2;
  var WIDTH_RECOMPOSE_DELTA=40;
  var HEIGHT_RECOMPOSE_DELTA=12;
  var EPS=.00001;
  var SAMPLE_EPS=.05;
  var STABLE_FRAMES_TO_STOP=8;
  var REENTRY_SETTLE_FRAMES=6;
  var REENTRY_SAFETY_RAW=.50;
  var FACE_CROSS_START=.44;
  var FACE_CROSS_END=.56;
  var resizeTimer=0;
  var samplerRaf=0;
  var nativeTimelineSupported=!!(window.CSS&&CSS.supports&&
    CSS.supports('animation-timeline: view()')&&
    CSS.supports('view-timeline-name: --tw-r6-timeline')&&
    CSS.supports('animation-range: contain 0% contain 100%'));
  var jsVisualStyleWrites=0;
  var debugEnabled=/[?&]debug=1(?:&|$)/.test(window.location.search);

  function clamp(v,min,max){return Math.max(min,Math.min(max,v));}
  function mix(a,b,t){return a+((b-a)*t);}
  function smoothstep(v){v=clamp(v,0,1);return v*v*(3-(2*v));}
  function shapeTurn(v){
    v=clamp(v,0,1);
    return (.42*v)+(.58*smoothstep(v));
  }
  function stageWidthNow(){
    if(window.visualViewport&&window.visualViewport.width>0)return Math.max(1,Math.round(window.visualViewport.width));
    return Math.max(1,Math.round(document.documentElement.clientWidth||window.innerWidth||1));
  }
  function stageHeightNow(){
    if(window.visualViewport&&window.visualViewport.height>0)return Math.max(1,Math.round(window.visualViewport.height));
    return Math.max(1,Math.round(document.documentElement.clientHeight||window.innerHeight||1));
  }
  function orientationFor(w,h){return w>h?'landscape':'portrait';}

  function stateFor(section){
    var s=states.get(section);
    if(s)return s;
    s={
      mobile:false,
      nativeR6:false,
      composed:false,
      orientation:'',
      stageWidth:0,
      stageHeight:0,
      geometryWidth:0,
      viewportRectLeft:0,
      viewportRectRight:0,
      viewportRectWidth:0,
      experienceTop:0,
      travel:1,
      q:0,
      p:0,
      logical:'AI_LOCKED',
      zone:'AI_AUTHORITY',
      direction:0,
      lastScrollY:Math.max(0,window.scrollY||0),
      lastAppliedY:NaN,
      sampledY:Math.max(0,window.scrollY||0),
      samplerRunning:false,
      stableFrameCount:0,
      sampleFrameCount:0,
      anchored:false,
      anchorScrollY:0,
      anchorRaw:0,
      anchorQ:0,
      moonlit:false,
      targetLightX:0,
      targetLightY:0,
      currentLightX:0,
      currentLightY:0,
      lightRaf:0,
      leaveTimer:0,
      fitTimer:0,
      fitTimer2:0,
      lastFrameAt:0,
      maxFrameDelta:0,
      frameSpikes:0,
      frameDelta:0,
      directionChanges:0,
      lastRenderedDirection:0,
      lastDeltaY:0,
      rawQ:0,
      effectiveQ:0,
      smallDeltaSkippedCount:0,
      lockedSmallDeltaSkippedTotal:0,
      turnSmallDeltaAppliedCount:0,
      wasBelowExperience:false,
      reentryLatched:false,
      reentrySettled:false,
      reentryReleaseReason:'none',
      lastReentryReleaseReason:'none',
      reentryReleaseActive:false,
      reentryReleaseRaw:WEB_HOLD_START,
      lastFoldX:0,
      clipPathWrites:0,
      aiFaceOpacity:1,
      webFaceOpacity:0,
      recentFrames:[]
    };
    states.set(section,s);
    return s;
  }

  function qToP(q){
    q=clamp(q,0,1);
    if(q<=AI_AUTHORITY_END)return 0;
    if(q>=WEB_HOLD_START)return 1;
    return shapeTurn((q-AI_AUTHORITY_END)/(WEB_HOLD_START-AI_AUTHORITY_END));
  }

  function zoneFor(q){
    if(q<=AI_AUTHORITY_END)return 'AI_AUTHORITY';
    if(q>=WEB_HOLD_START)return 'WEB_HOLD';
    return 'TURN_ZONE';
  }

  function logicalFor(p,direction,previous){
    if(p<=EPS)return 'AI_LOCKED';
    if(p>=1-EPS)return 'WEB_LOCKED';
    if(direction<0)return 'TURNING_TO_AI';
    if(direction>0)return 'TURNING_TO_WEB';
    if(previous==='TURNING_TO_AI')return 'TURNING_TO_AI';
    return 'TURNING_TO_WEB';
  }

  function setAccessibility(section,state){
    var ai=section.querySelector('[data-tw-world="ai"]');
    var web=section.querySelector('[data-tw-world="web"]');
    var aiLink=ai&&ai.querySelector('a');
    var webLink=web&&web.querySelector('a');

    if(state==='AI_LOCKED'){
      if(ai)ai.removeAttribute('aria-hidden');
      if(web)web.setAttribute('aria-hidden','true');
      if(aiLink)aiLink.removeAttribute('tabindex');
      if(webLink)webLink.setAttribute('tabindex','-1');
    }else if(state==='WEB_LOCKED'){
      if(ai)ai.setAttribute('aria-hidden','true');
      if(web)web.removeAttribute('aria-hidden');
      if(aiLink)aiLink.setAttribute('tabindex','-1');
      if(webLink)webLink.removeAttribute('tabindex');
    }else{
      if(ai)ai.removeAttribute('aria-hidden');
      if(web)web.removeAttribute('aria-hidden');
      if(aiLink)aiLink.setAttribute('tabindex','-1');
      if(webLink)webLink.setAttribute('tabindex','-1');
    }
  }

  function setBothAccessible(section){
    var ai=section.querySelector('[data-tw-world="ai"]');
    var web=section.querySelector('[data-tw-world="web"]');
    var aiLink=ai&&ai.querySelector('a');
    var webLink=web&&web.querySelector('a');
    if(ai)ai.removeAttribute('aria-hidden');
    if(web)web.removeAttribute('aria-hidden');
    if(aiLink)aiLink.removeAttribute('tabindex');
    if(webLink)webLink.removeAttribute('tabindex');
  }

  function faceCoordinate(viewportPosition){
    return clamp(((viewportPosition*100)+2)/104*100,0,100);
  }

  function geometry(p,s){
    var land=s.orientation==='landscape';
    var travel=land?8.5:10.5;
    var inactiveRotation=land?12.5:14;
    var inactiveDepth=land?-48:-54;

    /* One shared hinge, deliberately off-canvas at both resolved endpoints. */
    var hinge=1.08-(1.16*p);
    var boundary=clamp(hinge,0,1);
    var signed=(p-.5)*2;
    var slope=Math.sin(Math.PI*p)*(land?.010:.014)*signed;
    var topBoundary=clamp(boundary+slope,0,1);
    var bottomBoundary=clamp(boundary-slope,0,1);
    var overlap=1.15*Math.sin(Math.PI*p);

    var topFace=faceCoordinate(topBoundary);
    var bottomFace=faceCoordinate(bottomBoundary);

    return {
      aiX:-travel*p,
      webX:travel*(1-p),
      aiRy:mix(-3,-inactiveRotation,p),
      webRy:mix(inactiveRotation,3,p),
      aiZ:inactiveDepth*p,
      webZ:inactiveDepth*(1-p),
      foldX:s.geometryWidth*hinge,
      foldRy:mix(-5,5,p),
      aiClipTop:clamp(topFace+overlap,0,100),
      aiClipBottom:clamp(bottomFace+overlap,0,100),
      webClipTop:clamp(topFace-overlap,0,100),
      webClipBottom:clamp(bottomFace-overlap,0,100),
      aiContent:1-smoothstep((p-.24)/.28),
      webContent:smoothstep((p-.48)/.28),
      aiInscription:.92*(1-smoothstep((p-.20)/.30)),
      webInscription:.92*smoothstep((p-.50)/.30),
      aiLight:mix(.48,.07,p),
      webLight:mix(.08,.46,p),
      foldResponse:.88+(.10*Math.sin(Math.PI*p))
    };
  }

  function important(node,name,value){
    if(node)node.style.setProperty(name,value,'important');
  }

  function faceOwnership(p){
    var web=smoothstep((p-FACE_CROSS_START)/(FACE_CROSS_END-FACE_CROSS_START));
    return {
      ai:1-web,
      web:web
    };
  }

  function renderMobile(section,p,direction,q,force){
    var s=stateFor(section);
    jsVisualStyleWrites+=13;
    p=clamp(p,0,1);
    q=clamp(q,0,1);
    if(!force&&Math.abs(p-s.p)<.000001&&zoneFor(q)===s.zone&&direction===s.direction)return;

    var ai=section.querySelector('[data-tw-world="ai"]');
    var web=section.querySelector('[data-tw-world="web"]');
    var fold=section.querySelector('[data-tw-fold]');
    var aiContent=ai&&ai.querySelector('.tw-r2__content');
    var webContent=web&&web.querySelector('.tw-r2__content');
    var aiInscription=ai&&ai.querySelector('.tw-r2__inscription');
    var webInscription=web&&web.querySelector('.tw-r2__inscription');
    var g=geometry(p,s);
    s.lastFoldX=g.foldX;

    var ownership=faceOwnership(p);
    s.aiFaceOpacity=ownership.ai;
    s.webFaceOpacity=ownership.web;

    /* R5.5 diagnostic: zero dynamic face clip-path writes. Physical transforms
       remain R5.4-exact; only whole-face compositor opacity owns the crossover. */
    important(ai,'transform','translate3d('+g.aiX.toFixed(3)+'%,0,'+g.aiZ.toFixed(2)+'px) rotateY('+g.aiRy.toFixed(3)+'deg)');
    important(web,'transform','translate3d('+g.webX.toFixed(3)+'%,0,'+g.webZ.toFixed(2)+'px) rotateY('+g.webRy.toFixed(3)+'deg)');
    important(ai,'opacity',ownership.ai.toFixed(3));
    important(web,'opacity',ownership.web.toFixed(3));

    /* R5.4 endpoint closure remains authoritative: inactive face cannot leave
       a projected residual strip. Active turn keeps both faces available. */
    if(p<=EPS){
      important(ai,'visibility','visible');
      important(web,'visibility','hidden');
    }else if(p>=1-EPS){
      important(ai,'visibility','hidden');
      important(web,'visibility','visible');
    }else{
      important(ai,'visibility','visible');
      important(web,'visibility','visible');
    }

    important(fold,'transform','translate3d('+g.foldX.toFixed(2)+'px,0,0) translateX(-50%) perspective(720px) rotateY('+g.foldRy.toFixed(3)+'deg)');
    important(aiContent,'opacity',g.aiContent.toFixed(3));
    important(webContent,'opacity',g.webContent.toFixed(3));
    important(aiInscription,'opacity',g.aiInscription.toFixed(3));
    important(webInscription,'opacity',g.webInscription.toFixed(3));
    section.style.setProperty('--tw-r5-ai-light-opacity',g.aiLight.toFixed(3));
    section.style.setProperty('--tw-r5-web-light-opacity',g.webLight.toFixed(3));
    section.style.setProperty('--tw-r5-fold-response',g.foldResponse.toFixed(3));

    var nextZone=zoneFor(q);
    var nextLogical=logicalFor(p,direction,s.logical);
    if(nextZone!==s.zone){
      s.zone=nextZone;
      section.setAttribute('data-r5-zone',nextZone);
    }
    if(nextLogical!==s.logical){
      s.logical=nextLogical;
      section.setAttribute('data-r5-state',nextLogical);
      section.setAttribute('data-focus',nextLogical==='AI_LOCKED'?'ai':(nextLogical==='WEB_LOCKED'?'web':'turn'));
      setAccessibility(section,nextLogical);
    }

    s.p=p;
    s.q=q;
    s.direction=direction;
  }

  function clearMobileInline(section){
    ['ai','web'].forEach(function(world){
      var face=section.querySelector('[data-tw-world="'+world+'"]');
      if(!face)return;
      face.style.removeProperty('transform');
      face.style.removeProperty('clip-path');
      face.style.removeProperty('visibility');
      face.style.removeProperty('opacity');
      var content=face.querySelector('.tw-r2__content');
      var inscription=face.querySelector('.tw-r2__inscription');
      if(content)content.style.removeProperty('opacity');
      if(inscription)inscription.style.removeProperty('opacity');
    });
    var fold=section.querySelector('[data-tw-fold]');
    if(fold)fold.style.removeProperty('transform');
    section.style.removeProperty('--tw-r5-ai-light-opacity');
    section.style.removeProperty('--tw-r5-web-light-opacity');
    section.style.removeProperty('--tw-r5-fold-response');
  }

  function actualQ(s,y){
    return clamp((y-s.experienceTop)/Math.max(1,s.travel),0,1);
  }

  function territoryQ(s,y){
    var raw=actualQ(s,y);
    if(!s.anchored)return raw;

    /* Orientation preservation is a temporary bias, not a second timeline.
       The bias is exactly zero at both authority boundaries, so continuity is
       recovered before either locked endpoint and TOP EXIT never needs a snap. */
    if(raw<=AI_AUTHORITY_END||raw>=WEB_HOLD_START){
      s.anchored=false;
      return raw;
    }

    var bias=s.anchorQ-s.anchorRaw;
    if(Math.abs(bias)<.0001){
      s.anchored=false;
      return raw;
    }

    var fade;
    if(raw<=s.anchorRaw){
      fade=(raw-AI_AUTHORITY_END)/Math.max(.001,s.anchorRaw-AI_AUTHORITY_END);
    }else{
      fade=(WEB_HOLD_START-raw)/Math.max(.001,WEB_HOLD_START-s.anchorRaw);
    }
    return clamp(raw+(bias*clamp(fade,0,1)),0,1);
  }

  function engaged(s,y){
    return s.mobile&&y>=s.experienceTop-2&&y<=s.experienceTop+s.travel+2;
  }

  function resetReentry(s,reason){
    s.reentryLatched=false;
    s.reentrySettled=false;
    s.reentryReleaseActive=false;
    s.reentryReleaseRaw=WEB_HOLD_START;
    if(reason)s.reentryReleaseReason=reason;
  }

  function beginReentryLatch(s){
    s.reentryLatched=true;
    s.reentrySettled=false;
    s.reentryReleaseActive=false;
    s.reentryReleaseRaw=WEB_HOLD_START;
    s.reentryReleaseReason='latched';
    s.stableFrameCount=0;
  }

  function beginReentryRelease(s,raw,reason){
    s.reentryReleaseActive=true;
    s.reentryReleaseRaw=clamp(raw,AI_AUTHORITY_END+.001,WEB_HOLD_START);
    s.reentryReleaseReason=reason;
    s.lastReentryReleaseReason=reason;
  }

  function reentryOwnedQ(s,raw,baseQ,direction,changed){
    if(!s.reentryLatched)return baseQ;

    if(s.reentryReleaseActive){
      if(raw<=AI_AUTHORITY_END){
        resetReentry(s,'ai-authority-resolved');
        return AI_AUTHORITY_END;
      }
      if(raw>=WEB_HOLD_START){
        resetReentry(s,'returned-to-web-hold');
        return baseQ;
      }
      if(raw>=s.reentryReleaseRaw)return WEB_HOLD_START;

      var span=Math.max(.001,s.reentryReleaseRaw-AI_AUTHORITY_END);
      var t=clamp((raw-AI_AUTHORITY_END)/span,0,1);
      return AI_AUTHORITY_END+((WEB_HOLD_START-AI_AUTHORITY_END)*t);
    }

    if(s.reentrySettled&&changed&&direction<0){
      beginReentryRelease(s,raw,'settled-continuation');
      return WEB_HOLD_START;
    }

    if(raw<=REENTRY_SAFETY_RAW&&direction<0){
      beginReentryRelease(s,raw,'geometry-safety');
      return WEB_HOLD_START;
    }

    return WEB_HOLD_START;
  }

  function recordSample(s,y,delta,raw,q,p,changed){
    if(!debugEnabled)return;
    s.recentFrames.push({
      y:Number(y.toFixed(2)),
      dy:Number(delta.toFixed(2)),
      rawQ:Number(raw.toFixed(5)),
      q:Number(q.toFixed(5)),
      p:Number(p.toFixed(5)),
      aiFaceOpacity:Number(s.aiFaceOpacity.toFixed(3)),
      webFaceOpacity:Number(s.webFaceOpacity.toFixed(3)),
      clipPathWrites:s.clipPathWrites,
      state:s.logical,
      zone:s.zone,
      dir:s.direction,
      stable:s.stableFrameCount,
      changed:changed?1:0,
      latched:s.reentryLatched?1:0,
      settled:s.reentrySettled?1:0,
      release:s.reentryReleaseReason,
      dt:Number(s.frameDelta.toFixed(2))
    });
    if(s.recentFrames.length>60)s.recentFrames.shift();
  }

  function updateMobile(section,force,now,sampledY){
    var s=stateFor(section);
    if(!s.mobile||reducedMotion.matches||!s.composed)return;

    var y=Number.isFinite(sampledY)?sampledY:Math.max(0,window.scrollY||0);
    var previousSample=s.sampledY;
    var changed=!Number.isFinite(previousSample)||Math.abs(y-previousSample)>SAMPLE_EPS;
    var delta=Number.isFinite(previousSample)?(y-previousSample):(y-s.lastScrollY);
    var direction=Math.abs(delta)>.25?(delta>0?1:-1):s.direction;

    s.sampleFrameCount+=1;
    if(changed)s.stableFrameCount=0;
    else s.stableFrameCount+=1;
    s.sampledY=y;
    s.samplerRunning=true;

    if(direction&&s.lastRenderedDirection&&direction!==s.lastRenderedDirection)s.directionChanges+=1;
    if(direction)s.lastRenderedDirection=direction;
    s.lastScrollY=y;
    s.lastDeltaY=delta;

    var bottom=s.experienceTop+s.travel;
    if(y>bottom+2){
      s.wasBelowExperience=true;
      if(s.reentryLatched)resetReentry(s,'below-territory');
    }else if(s.wasBelowExperience&&engaged(s,y)&&direction<0){
      s.wasBelowExperience=false;
      beginReentryLatch(s);
    }

    if(s.reentryLatched&&!s.reentryReleaseActive&&s.stableFrameCount>=REENTRY_SETTLE_FRAMES){
      s.reentrySettled=true;
    }

    var raw=actualQ(s,y);
    var inTurnZone=raw>AI_AUTHORITY_END&&raw<WEB_HOLD_START;
    var hardSafety=(raw<=AI_AUTHORITY_END)||(raw>=WEB_HOLD_START);
    var smallDelta=Number.isFinite(s.lastAppliedY)&&Math.abs(y-s.lastAppliedY)<=IGNORE_SCROLL_PX;

    s.rawQ=raw;

    /* R5.1 diagnostic: the <=2px suppression is forbidden inside TURN_ZONE.
       Every real native scroll sample in the active turn is allowed through. */
    if(inTurnZone&&s.zone!=='TURN_ZONE'){
      s.smallDeltaSkippedCount=0;
      s.turnSmallDeltaAppliedCount=0;
    }

    if(!force&&smallDelta&&!inTurnZone&&!hardSafety){
      s.smallDeltaSkippedCount+=1;
      s.lockedSmallDeltaSkippedTotal+=1;
      return;
    }

    if(!force&&smallDelta&&inTurnZone){
      s.turnSmallDeltaAppliedCount+=1;
    }

    var baseQ=territoryQ(s,y);
    var q=reentryOwnedQ(s,raw,baseQ,direction,changed);
    var p=qToP(q);
    s.effectiveQ=q;
    renderMobile(section,p,direction,q,force);
    s.lastAppliedY=y;

    if(now){
      if(s.lastFrameAt){
        var dt=now-s.lastFrameAt;
        s.frameDelta=dt;
        if(dt>s.maxFrameDelta)s.maxFrameDelta=dt;
        if(dt>22)s.frameSpikes+=1;
      }else{
        s.frameDelta=0;
      }
      s.lastFrameAt=now;
    }

    recordSample(s,y,delta,raw,q,p,changed);
  }

  function runSampler(now){
    samplerRaf=0;
    var y=Math.max(0,window.scrollY||0);
    var keepRunning=false;

    sections.forEach(function(section){
      var s=stateFor(section);
      if(!s.mobile||s.nativeR6||reducedMotion.matches||!s.composed){
        s.samplerRunning=false;
        return;
      }

      updateMobile(section,false,now||performance.now(),y);

      var active=engaged(s,y)||s.reentryLatched;
      if(active&&s.stableFrameCount<STABLE_FRAMES_TO_STOP){
        keepRunning=true;
      }else{
        s.samplerRunning=false;
      }
    });

    if(keepRunning){
      samplerRaf=window.requestAnimationFrame(runSampler);
    }
  }

  function ensureSampler(){
    sections.forEach(function(section){
      var s=stateFor(section);
      if(s.mobile&&!s.nativeR6&&!reducedMotion.matches)s.samplerRunning=true;
    });
    if(!samplerRaf)samplerRaf=window.requestAnimationFrame(runSampler);
  }

  function meterWidth(inscription){
    var style=window.getComputedStyle(inscription);
    var key=inscription.textContent+'|'+style.fontFamily+'|'+style.fontWeight+'|'+style.letterSpacing;
    if(meters.has(key))return meters.get(key);
    var meter=document.createElement('span');
    meter.textContent=inscription.textContent;
    meter.setAttribute('aria-hidden','true');
    meter.style.cssText=[
      'position:fixed','left:-10000px','top:-10000px','visibility:hidden','white-space:nowrap',
      'font-family:'+style.fontFamily,'font-weight:'+style.fontWeight,'font-style:'+style.fontStyle,
      'font-size:100px','letter-spacing:'+style.letterSpacing,'line-height:1'
    ].join(';');
    document.body.appendChild(meter);
    var width=Math.max(1,meter.getBoundingClientRect().width);
    meter.remove();
    meters.set(key,width);
    return width;
  }

  function desktopTerritory(focus,world){
    if(focus==='ai')return world==='ai'?{start:0,end:.72,target:.73}:{start:.692,end:1,target:.72};
    if(focus==='web')return world==='web'?{start:.28,end:1,target:.73}:{start:0,end:.308,target:.72};
    return world==='ai'?{start:0,end:.515,target:.73}:{start:.485,end:1,target:.73};
  }

  function fitDesktopInscription(section,world){
    if(mobileQuery.matches)return;
    var viewport=section.querySelector('[data-tw-viewport]');
    var face=section.querySelector('[data-tw-world="'+world+'"]');
    var inscription=section.querySelector('.tw-r2__inscription--'+world);
    if(!viewport||!face||!inscription||!face.offsetWidth)return;
    var vr=viewport.getBoundingClientRect();
    if(!vr.width)return;
    var focus=section.getAttribute('data-focus')||'neutral';
    var territory=desktopTerritory(focus,world);
    var target=window.innerWidth<=1200?Math.min(.79,territory.target+.06):territory.target;
    var targetCenter=vr.left+vr.width*((territory.start+territory.end)/2);
    var targetWidth=vr.width*(territory.end-territory.start)*target;
    var measured=meterWidth(inscription);
    var visualScale=clamp(face.getBoundingClientRect().width/face.offsetWidth,.58,1.18);
    var size=clamp((100*targetWidth/measured)/visualScale,48,220);
    var localCenter=(targetCenter-vr.left)-face.offsetLeft;
    inscription.style.setProperty('--tw-g-inscription-center',localCenter.toFixed(2)+'px');
    inscription.style.setProperty('--tw-g-inscription-size',size.toFixed(2)+'px');
  }

  function fitDesktop(section){
    fitDesktopInscription(section,'ai');
    fitDesktopInscription(section,'web');
  }

  function scheduleDesktopFit(section){
    var s=stateFor(section);
    window.clearTimeout(s.fitTimer);
    window.clearTimeout(s.fitTimer2);
    s.fitTimer=window.setTimeout(function(){fitDesktop(section);},0);
    s.fitTimer2=window.setTimeout(function(){fitDesktop(section);},720);
  }

  function setLight(section,x,y){
    section.style.setProperty('--tw-g-light-x',x.toFixed(3)+'%');
    section.style.setProperty('--tw-g-light-y',y.toFixed(3)+'%');
  }

  function runLight(section){
    var s=stateFor(section);
    s.lightRaf=0;
    if(reducedMotion.matches||mobileQuery.matches||!finePointer.matches){
      s.currentLightX=s.currentLightY=s.targetLightX=s.targetLightY=0;
      setLight(section,0,0);
      return;
    }
    s.currentLightX+=(s.targetLightX-s.currentLightX)*.075;
    s.currentLightY+=(s.targetLightY-s.currentLightY)*.075;
    if(Math.abs(s.targetLightX-s.currentLightX)<.006)s.currentLightX=s.targetLightX;
    if(Math.abs(s.targetLightY-s.currentLightY)<.006)s.currentLightY=s.targetLightY;
    setLight(section,s.currentLightX,s.currentLightY);
    if(s.currentLightX!==s.targetLightX||s.currentLightY!==s.targetLightY){
      s.lightRaf=window.requestAnimationFrame(function(){runLight(section);});
    }
  }

  function scheduleLight(section){
    var s=stateFor(section);
    if(!s.lightRaf)s.lightRaf=window.requestAnimationFrame(function(){runLight(section);});
  }

  function neutralLight(section){
    var s=stateFor(section);
    s.targetLightX=0;
    s.targetLightY=0;
    scheduleLight(section);
  }

  function bindDesktop(section){
    var viewport=section.querySelector('[data-tw-viewport]');
    var ai=section.querySelector('[data-tw-world="ai"]');
    var web=section.querySelector('[data-tw-world="web"]');
    if(!viewport||!ai||!web)return;

    viewport.addEventListener('pointermove',function(event){
      if(mobileQuery.matches||!finePointer.matches)return;
      var rect=viewport.getBoundingClientRect();
      if(!rect.width||!rect.height)return;
      var x=clamp(event.clientX-rect.left,0,rect.width);
      var y=clamp(event.clientY-rect.top,0,rect.height);
      var pct=x/rect.width*100;
      var next=pct<47?'ai':(pct>53?'web':'neutral');
      var s=stateFor(section);
      window.clearTimeout(s.leaveTimer);
      if(section.getAttribute('data-focus')!==next){
        section.setAttribute('data-focus',next);
        scheduleDesktopFit(section);
      }
      section.style.setProperty('--tw-pointer-x',(x/rect.width*100).toFixed(2)+'%');
      section.style.setProperty('--tw-pointer-y',(y/rect.height*100).toFixed(2)+'%');
      if(next==='ai'||next==='web'){
        s.targetLightX=clamp(((x/rect.width)-.5)*2,-1,1)*4.5;
        s.targetLightY=clamp(((y/rect.height)-.5)*2,-1,1)*2.6;
        scheduleLight(section);
      }else neutralLight(section);
    },{passive:true});

    viewport.addEventListener('pointerleave',function(){
      if(mobileQuery.matches||!finePointer.matches)return;
      var s=stateFor(section);
      window.clearTimeout(s.leaveTimer);
      neutralLight(section);
      s.leaveTimer=window.setTimeout(function(){
        section.setAttribute('data-focus','neutral');
        scheduleDesktopFit(section);
      },170);
    },{passive:true});

    section.addEventListener('focusin',function(event){
      if(mobileQuery.matches)return;
      if(ai.contains(event.target))section.setAttribute('data-focus','ai');
      if(web.contains(event.target))section.setAttribute('data-focus','web');
      scheduleDesktopFit(section);
    });
    section.addEventListener('focusout',function(){
      if(mobileQuery.matches)return;
      window.requestAnimationFrame(function(){
        if(!section.contains(document.activeElement)){
          section.setAttribute('data-focus','neutral');
          scheduleDesktopFit(section);
        }
      });
    });
  }

  function updateHeaderGuard(section){
    var viewport=section.querySelector('[data-tw-viewport]');
    var experience=section.querySelector('[data-tw-experience]');
    if(viewport)viewport.removeAttribute('data-header-autohide-guard');
    if(!experience)return;
    if(mobileQuery.matches&&!reducedMotion.matches){
      experience.setAttribute('data-header-autohide-guard','two-worlds-r5');
    }else{
      experience.removeAttribute('data-header-autohide-guard');
    }
  }

  function compose(section,preserve){
    var s=stateFor(section);
    var experience=section.querySelector('[data-tw-experience]');
    var viewport=section.querySelector('[data-tw-viewport]');
    if(!experience||!viewport)return;

    var w=stageWidthNow();
    var h=stageHeightNow();
    var mobile=mobileQuery.matches;
    var orientation=orientationFor(w,h);
    var previousQ=s.q;
    var previousMobile=s.mobile;
    var previousEngaged=engaged(s,Math.max(0,window.scrollY||0));

    s.mobile=mobile;
    s.orientation=orientation;
    updateHeaderGuard(section);

    if(reducedMotion.matches){
      s.nativeR6=false;
      section.removeAttribute('data-r6-native');
      s.composed=true;
      s.anchored=false;
      clearMobileInline(section);
      experience.style.removeProperty('--tw-r5-travel-height');
      viewport.style.removeProperty('--tw-r5-stage-height');
      section.setAttribute('data-r5-state','REDUCED');
      section.setAttribute('data-r5-zone','REDUCED');
      section.setAttribute('data-focus','neutral');
      setBothAccessible(section);
      return;
    }

    if(!mobile){
      s.nativeR6=false;
      section.removeAttribute('data-r6-native');
      s.composed=true;
      s.anchored=false;
      clearMobileInline(section);
      experience.style.removeProperty('--tw-r5-travel-height');
      viewport.style.removeProperty('--tw-r5-stage-height');
      s.logical='DESKTOP';
      section.setAttribute('data-r5-state','DESKTOP');
      section.setAttribute('data-r5-zone','DESKTOP');
      section.setAttribute('data-focus','neutral');
      setBothAccessible(section);
      neutralLight(section);
      scheduleDesktopFit(section);
      return;
    }

    s.stageWidth=w;
    s.stageHeight=h;
    var multiplier=orientation==='landscape'?2.30:2.20;
    section.style.setProperty('--tw-r5-stage-height',h+'px');
    section.style.setProperty('--tw-r5-travel-height',Math.round(h*multiplier)+'px');

    /* Layout-space geometry is measured only during compose/recompose.
       visualViewport remains stage/chrome context, but fold X uses the actual
       CSS coordinate space of [data-tw-viewport]. */
    var viewportRect=viewport.getBoundingClientRect();
    var rect=experience.getBoundingClientRect();
    s.geometryWidth=Math.max(1,viewportRect.width||viewport.offsetWidth||w);
    s.viewportRectLeft=viewportRect.left;
    s.viewportRectRight=viewportRect.right;
    s.viewportRectWidth=viewportRect.width;
    s.experienceTop=rect.top+Math.max(0,window.scrollY||0);
    s.travel=Math.max(1,(h*multiplier)-h);
    s.composed=true;

    if(nativeTimelineSupported){
      s.nativeR6=true;
      s.anchored=false;
      s.samplerRunning=false;
      section.setAttribute('data-r6-native','true');
      section.setAttribute('data-r5-state','R6_NATIVE');
      section.setAttribute('data-r5-zone','R6_NATIVE');
      section.removeAttribute('data-focus');
      clearMobileInline(section);
      setBothAccessible(section);
      return;
    }

    s.nativeR6=false;
    section.removeAttribute('data-r6-native');

    var currentY=Math.max(0,window.scrollY||0);
    var newRaw=actualQ(s,currentY);
    if(preserve&&previousMobile&&previousEngaged&&newRaw>AI_AUTHORITY_END&&newRaw<WEB_HOLD_START){
      s.anchorScrollY=currentY;
      s.anchorRaw=newRaw;
      s.anchorQ=previousQ;
      s.anchored=Math.abs(previousQ-newRaw)>.0001;
    }else{
      s.anchored=false;
    }

    var composeY=Math.max(0,window.scrollY||0);
    s.lastScrollY=composeY;
    s.sampledY=composeY;
    s.lastAppliedY=NaN;
    s.wasBelowExperience=composeY>s.experienceTop+s.travel+2;
    s.stableFrameCount=0;
    updateMobile(section,true,performance.now(),composeY);
  }

  function maybeRecompose(section,force){
    var s=stateFor(section);
    var w=stageWidthNow();
    var h=stageHeightNow();
    var orientation=orientationFor(w,h);
    var y=Math.max(0,window.scrollY||0);
    var viewport=section.querySelector('[data-tw-viewport]');
    var layoutWidth=viewport?viewport.getBoundingClientRect().width:w;

    if(force||!s.composed||s.mobile!==mobileQuery.matches||orientation!==s.orientation||Math.abs(w-s.stageWidth)>=WIDTH_RECOMPOSE_DELTA||Math.abs(layoutWidth-s.geometryWidth)>=1){
      compose(section,true);
      return;
    }

    /* Height-only browser chrome changes are accepted before/after the
       immersive territory, but ignored while the fixed stage owns it. */
    if(s.mobile&&!engaged(s,y)&&Math.abs(h-s.stageHeight)>=HEIGHT_RECOMPOSE_DELTA){
      compose(section,false);
    }
  }

  function armMoonlight(section){
    var s=stateFor(section);
    if(s.moonlit||reducedMotion.matches)return;
    s.moonlit=true;
    section.setAttribute('data-entry-lit','run');
  }

  function setupMoonlight(section){
    var viewport=section.querySelector('[data-tw-viewport]');
    if(!viewport)return;
    if('IntersectionObserver'in window){
      var observer=new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting&&entry.intersectionRatio>=.86){
            armMoonlight(section);
            observer.disconnect();
          }
        });
      },{threshold:[.86]});
      observer.observe(viewport);
    }
  }

  sections.forEach(function(section){
    bindDesktop(section);
    compose(section,false);
    setupMoonlight(section);
  });

  if(!nativeTimelineSupported){
    window.addEventListener('scroll',ensureSampler,{passive:true});
  }

  window.addEventListener('resize',function(){
    window.clearTimeout(resizeTimer);
    resizeTimer=window.setTimeout(function(){
      sections.forEach(function(section){maybeRecompose(section,false);});
    },90);
  },{passive:true});

  window.addEventListener('orientationchange',function(){
    window.clearTimeout(resizeTimer);
    resizeTimer=window.setTimeout(function(){
      sections.forEach(function(section){compose(section,true);});
    },160);
  },{passive:true});

  if(window.visualViewport){
    window.visualViewport.addEventListener('resize',function(){
      window.clearTimeout(resizeTimer);
      resizeTimer=window.setTimeout(function(){
        sections.forEach(function(section){maybeRecompose(section,false);});
      },90);
    },{passive:true});
  }

  [mobileQuery,landscapeQuery,reducedMotion].forEach(function(query){
    var handler=function(){sections.forEach(function(section){compose(section,true);});};
    if(typeof query.addEventListener==='function')query.addEventListener('change',handler);
    else if(typeof query.addListener==='function')query.addListener(handler);
  });

  if(document.fonts&&document.fonts.ready){
    document.fonts.ready.then(function(){
      sections.forEach(function(section){
        if(!mobileQuery.matches)scheduleDesktopFit(section);
      });
    });
  }

  window.addEventListener('pageshow',function(){
    sections.forEach(function(section){compose(section,false);});
  },{passive:true});

  function debugElementDescriptor(node){
    if(!node)return null;
    var parts=[];
    var current=node;
    var depth=0;
    while(current&&current.nodeType===1&&depth<4){
      var label=current.tagName.toLowerCase();
      if(current.id)label+='#'+current.id;
      if(current.classList&&current.classList.length){
        label+='.'+Array.prototype.slice.call(current.classList,0,3).join('.');
      }
      if(current.hasAttribute&&current.hasAttribute('data-tw-world')){
        label+='[data-tw-world="'+current.getAttribute('data-tw-world')+'"]';
      }
      if(current.hasAttribute&&current.hasAttribute('data-tw-fold'))label+='[data-tw-fold]';
      parts.push(label);
      current=current.parentElement;
      depth+=1;
    }
    return parts.join(' < ');
  }

  window.__twR6Snapshot=function(){
    return sections.map(function(section){
      var s=stateFor(section);
      var viewport=section.querySelector('[data-tw-viewport]');
      var fold=section.querySelector('[data-tw-fold]');
      var ai=section.querySelector('[data-tw-world="ai"]');
      var web=section.querySelector('[data-tw-world="web"]');
      var viewportRect=debugEnabled&&viewport?viewport.getBoundingClientRect():null;
      var foldRect=debugEnabled&&fold?fold.getBoundingClientRect():null;
      var aiRect=debugEnabled&&ai?ai.getBoundingClientRect():null;
      var webRect=debugEnabled&&web?web.getBoundingClientRect():null;
      var viewportStyle=debugEnabled&&viewport?window.getComputedStyle(viewport):null;
      var aiStyle=debugEnabled&&ai?window.getComputedStyle(ai):null;
      var webStyle=debugEnabled&&web?window.getComputedStyle(web):null;
      var sampleX=viewportRect?Math.max(viewportRect.left,viewportRect.right-30):null;
      var sampleY=viewportRect?viewportRect.top+(viewportRect.height/2):null;
      var sampleNode=(debugEnabled&&sampleX!==null&&sampleY!==null)?document.elementFromPoint(sampleX,sampleY):null;
      return {
        id:section.id,
        nativeTimelineSupported:nativeTimelineSupported,
        nativeR6:s.nativeR6,
        jsPerFrameVisualWrites:s.nativeR6?0:jsVisualStyleWrites,
        scrollListenerAttached:!nativeTimelineSupported,
        rafVisualEngineActive:s.nativeR6?false:s.samplerRunning,
        scrollY:Number((window.scrollY||0).toFixed(2)),
        sampledY:Number(s.sampledY.toFixed(2)),
        deltaY:Number(s.lastDeltaY.toFixed(2)),
        lastAppliedY:Number.isFinite(s.lastAppliedY)?Number(s.lastAppliedY.toFixed(2)):null,
        rawQ:Number(s.rawQ.toFixed(5)),
        effectiveQ:Number(s.effectiveQ.toFixed(5)),
        progress:Number(s.p.toFixed(5)),
        state:s.logical,
        zone:s.zone,
        direction:s.direction,
        samplerRunning:s.samplerRunning,
        stableFrameCount:s.stableFrameCount,
        sampleFrameCount:s.sampleFrameCount,
        frameDt:Number(s.frameDelta.toFixed(2)),
        maxFrameDt:Number(s.maxFrameDelta.toFixed(2)),
        frameSpikes:s.frameSpikes,
        directionChanges:s.directionChanges,
        reentryLatched:s.reentryLatched,
        reentrySettled:s.reentrySettled,
        reentryReleaseReason:s.reentryReleaseReason,
        lastReentryReleaseReason:s.lastReentryReleaseReason,
        visualViewportWidth:window.visualViewport?Number(window.visualViewport.width.toFixed(2)):null,
        documentClientWidth:document.documentElement.clientWidth,
        viewportRectWidth:viewportRect?Number(viewportRect.width.toFixed(2)):s.viewportRectWidth,
        geometryWidth:Number(s.geometryWidth.toFixed(2)),
        foldX:Number(s.lastFoldX.toFixed(2)),
        foldRectLeft:foldRect?Number(foldRect.left.toFixed(2)):null,
        foldRectRight:foldRect?Number(foldRect.right.toFixed(2)):null,
        viewportRectLeft:viewportRect?Number(viewportRect.left.toFixed(2)):s.viewportRectLeft,
        viewportRectRight:viewportRect?Number(viewportRect.right.toFixed(2)):s.viewportRectRight,
        aiFoldOffscreen:(debugEnabled&&foldRect&&viewportRect&&s.p<=EPS)?foldRect.left>=viewportRect.right-.5:null,
        webFoldOffscreen:(debugEnabled&&foldRect&&viewportRect&&s.p>=1-EPS)?foldRect.right<=viewportRect.left+.5:null,
        faces:{
          aiVisibility:aiStyle?aiStyle.visibility:null,
          webVisibility:webStyle?webStyle.visibility:null,
          aiInlineTransform:ai?ai.style.getPropertyValue('transform'):null,
          webInlineTransform:web?web.style.getPropertyValue('transform'):null,
          aiComputedMatrix:aiStyle?aiStyle.transform:null,
          webComputedMatrix:webStyle?webStyle.transform:null,
          aiClipPathComputed:aiStyle?aiStyle.clipPath:null,
          webClipPathComputed:webStyle?webStyle.clipPath:null,
          clipPathWrites:s.clipPathWrites,
          aiFaceOpacity:aiStyle?Number(parseFloat(aiStyle.opacity).toFixed(3)):null,
          webFaceOpacity:webStyle?Number(parseFloat(webStyle.opacity).toFixed(3)):null,
          faceWillChange:{
            ai:aiStyle?aiStyle.willChange:null,
            web:webStyle?webStyle.willChange:null
          },
          aiAnimationName:aiStyle?aiStyle.animationName:null,
          webAnimationName:webStyle?webStyle.animationName:null,
          aiAnimationTimeline:aiStyle?aiStyle.animationTimeline:null,
          webAnimationTimeline:webStyle?webStyle.animationTimeline:null,
          aiTranslate:aiStyle?aiStyle.translate:null,
          webTranslate:webStyle?webStyle.translate:null,
          aiRotate:aiStyle?aiStyle.rotate:null,
          webRotate:webStyle?webStyle.rotate:null,
          faceHasInlinePerspective:!!(
            (ai&&ai.style.getPropertyValue('transform').indexOf('perspective(')>=0)||
            (web&&web.style.getPropertyValue('transform').indexOf('perspective(')>=0)
          )
        },
        endpointBarCandidate:{
          sampleX:sampleX===null?null:Number(sampleX.toFixed(2)),
          sampleY:sampleY===null?null:Number(sampleY.toFixed(2)),
          elementFromPoint:debugElementDescriptor(sampleNode),
          foldRect:foldRect?{
            left:Number(foldRect.left.toFixed(2)),
            right:Number(foldRect.right.toFixed(2))
          }:null,
          webFaceRect:webRect?{
            left:Number(webRect.left.toFixed(2)),
            right:Number(webRect.right.toFixed(2))
          }:null,
          aiFaceRect:aiRect?{
            left:Number(aiRect.left.toFixed(2)),
            right:Number(aiRect.right.toFixed(2))
          }:null
        },
        perspective:{
          viewportSource:'1100px',
          viewportComputed:viewportStyle?viewportStyle.perspective:null,
          aiFaceInline:'none',
          webFaceInline:'none',
          fold:'perspective(720px)'
        },
        width:s.stageWidth,
        height:s.stageHeight,
        orientation:s.orientation,
        anchored:s.anchored,
        recentFrames:debugEnabled?s.recentFrames.slice(-60):[]
      };
    });
  };
}());
