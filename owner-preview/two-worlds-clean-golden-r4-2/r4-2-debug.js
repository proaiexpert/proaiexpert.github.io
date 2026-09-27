/* Two Worlds R4.2 owner-preview diagnostics only. Never loaded by production pages. */
(function(){
  'use strict';
  if(new URLSearchParams(location.search).get('debug')!=='1')return;

  var MAX_RECORDS=2400;
  var records=[];
  var counters={scroll:0,resize:0,vvResize:0,vvScroll:0,orientation:0,styleMutations:0,recompositions:0};
  var lastStageHeight='',lastTravelHeight='',lastT=null,lastStyleMutationAt=0;
  var lockedProbe=null,lockedResult='WAITING';

  function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
  function smootherstep(v){v=clamp(v,0,1);return v*v*v*(v*(v*6-15)+10);}
  function invertSmoother(p){
    p=clamp(p,0,1);
    var lo=0,hi=1,mid=0;
    for(var i=0;i<26;i++){mid=(lo+hi)/2;if(smootherstep(mid)<p)lo=mid;else hi=mid;}
    return (lo+hi)/2;
  }
  function pctVar(style,name){
    var raw=style.getPropertyValue(name).trim();
    var v=parseFloat(raw);
    return Number.isFinite(v)?v:null;
  }
  function round(v,n){if(typeof v!=='number'||!Number.isFinite(v))return v;var p=Math.pow(10,n||3);return Math.round(v*p)/p;}
  function nowVV(){
    var vv=window.visualViewport;
    return {
      width:vv?vv.width:window.innerWidth,
      height:vv?vv.height:window.innerHeight,
      offsetTop:vv?vv.offsetTop:0,
      offsetLeft:vv?vv.offsetLeft:0
    };
  }
  function getNodes(){
    var section=document.querySelector('[data-tw-r4]');
    if(!section)return null;
    return {
      section:section,
      stage:section.querySelector('[data-tw-viewport]'),
      experience:section.querySelector('[data-tw-experience]'),
      ai:section.querySelector('[data-tw-world="ai"]'),
      web:section.querySelector('[data-tw-world="web"]'),
      fold:section.querySelector('[data-tw-fold]')
    };
  }
  function inferT(style,state){
    if(state==='AI_LOCKED')return 0;
    if(state==='WEB_LOCKED')return 1;
    var aiX=pctVar(style,'--tw-r4-ai-x');
    if(aiX===null)return null;
    return invertSmoother(clamp(-aiX/104,0,1));
  }
  function pushRecord(reason){
    var n=getNodes(); if(!n||!n.stage||!n.experience)return;
    var style=getComputedStyle(n.section);
    var sr=n.stage.getBoundingClientRect();
    var er=n.experience.getBoundingClientRect();
    var state=n.section.getAttribute('data-r4-state')||'';
    var t=inferT(style,state);
    var stageHeight=style.getPropertyValue('--tw-r4-stage-height').trim();
    var travelHeight=style.getPropertyValue('--tw-r4-travel-height').trim();
    if(lastStageHeight && (stageHeight!==lastStageHeight || travelHeight!==lastTravelHeight)) counters.recompositions++;
    lastStageHeight=stageHeight; lastTravelHeight=travelHeight;
    var vv=nowVV();
    var rec={
      ms:round(performance.now(),1),reason:reason,
      scrollY:round(window.scrollY,3),
      vvWidth:round(vv.width,3),vvHeight:round(vv.height,3),
      vvOffsetTop:round(vv.offsetTop,3),vvOffsetLeft:round(vv.offsetLeft,3),
      stageTop:round(sr.top,3),stageHeight:round(sr.height,3),
      experienceTop:round(er.top,3),experienceBottom:round(er.bottom,3),
      state:state,direction:n.section.getAttribute('data-r4-direction')||'',
      t:t===null?null:round(t,5),
      aiX:style.getPropertyValue('--tw-r4-ai-x').trim(),
      webX:style.getPropertyValue('--tw-r4-web-x').trim(),
      sharedZ:style.getPropertyValue('--tw-r4-ai-z').trim(),
      foldX:style.getPropertyValue('--tw-r4-fold-x').trim(),
      aiTransform:n.ai?getComputedStyle(n.ai).transform:'',
      webTransform:n.web?getComputedStyle(n.web).transform:'',
      foldTransform:n.fold?getComputedStyle(n.fold).transform:'',
      componentMotionWriter:(state==='TRANSITIONING'||performance.now()-lastStyleMutationAt<120)?'ACTIVE':'IDLE',
      counters:Object.assign({},counters)
    };
    records.push(rec); if(records.length>MAX_RECORDS)records.shift();
    lastT=t;
    updateLockedProbe(rec);
    paint(rec);
  }

  var pending=false;
  function schedule(reason){
    if(pending)return;
    pending=true;
    requestAnimationFrame(function(){pending=false;pushRecord(reason);});
  }

  function updateLockedProbe(rec){
    var locked=rec.state==='AI_LOCKED'||rec.state==='WEB_LOCKED';
    if(!locked){lockedProbe=null;lockedResult='WAITING';return;}
    if(!lockedProbe){
      lockedProbe={
        state:rec.state,start:performance.now(),
        style:counters.styleMutations,recomp:counters.recompositions,
        topMin:rec.stageTop,topMax:rec.stageTop,heightMin:rec.stageHeight,heightMax:rec.stageHeight
      };
      lockedResult='MEASURING';
      return;
    }
    if(lockedProbe.state!==rec.state){lockedProbe=null;lockedResult='WAITING';return;}
    lockedProbe.topMin=Math.min(lockedProbe.topMin,rec.stageTop);
    lockedProbe.topMax=Math.max(lockedProbe.topMax,rec.stageTop);
    lockedProbe.heightMin=Math.min(lockedProbe.heightMin,rec.stageHeight);
    lockedProbe.heightMax=Math.max(lockedProbe.heightMax,rec.stageHeight);
    if(performance.now()-lockedProbe.start>=3000){
      var noStyle=counters.styleMutations===lockedProbe.style;
      var noRecomp=counters.recompositions===lockedProbe.recomp;
      var topSpread=lockedProbe.topMax-lockedProbe.topMin;
      var heightSpread=lockedProbe.heightMax-lockedProbe.heightMin;
      lockedResult=(noStyle&&noRecomp&&topSpread<0.25&&heightSpread<0.25)?'PASS':'FAIL';
    }
  }

  var panel=document.createElement('aside');
  panel.id='tw-r42-debug-panel';
  panel.setAttribute('aria-label','Two Worlds R4.2 debug');
  panel.style.cssText='position:fixed;z-index:99999;left:8px;bottom:8px;width:min(360px,calc(100vw - 16px));max-height:46vh;overflow:auto;padding:10px 11px;border:1px solid rgba(255,255,255,.18);border-radius:8px;background:rgba(0,0,0,.88);color:#dfe3e7;font:600 10px/1.42 ui-monospace,SFMono-Regular,Menlo,monospace;white-space:pre-wrap;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)';
  var pre=document.createElement('div');
  var row=document.createElement('div'); row.style.cssText='display:flex;gap:8px;margin-top:8px';
  var copy=document.createElement('button'); copy.textContent='COPY TRACE'; copy.style.cssText='font:700 10px monospace;padding:6px 8px';
  var clear=document.createElement('button'); clear.textContent='CLEAR'; clear.style.cssText='font:700 10px monospace;padding:6px 8px';
  row.append(copy,clear); panel.append(pre,row); document.body.appendChild(panel);

  function paint(rec){
    pre.textContent=[
      'R4.2 DEBUG — REVIEW ONLY',
      'state '+rec.state+'  t '+rec.t+'  dir '+(rec.direction||'—'),
      'scrollY '+rec.scrollY,
      'vv '+rec.vvWidth+'×'+rec.vvHeight+'  off '+rec.vvOffsetLeft+','+rec.vvOffsetTop,
      'stage top '+rec.stageTop+'  h '+rec.stageHeight,
      'experience '+rec.experienceTop+' … '+rec.experienceBottom,
      'AI '+rec.aiX+'  WEB '+rec.webX+'  Z '+rec.sharedZ+'  FOLD '+rec.foldX,
      'writer '+rec.componentMotionWriter,
      'style mutations '+counters.styleMutations+'  recompositions '+counters.recompositions,
      'events scroll '+counters.scroll+' resize '+counters.resize+' vvR '+counters.vvResize+' vvS '+counters.vvScroll+' orient '+counters.orientation,
      'LOCKED 3S '+lockedResult
    ].join('\n');
  }
  function exportTrace(){
    return JSON.stringify({
      generatedAt:new Date().toISOString(),
      ua:navigator.userAgent,
      dpr:devicePixelRatio,
      viewport:{innerWidth:innerWidth,innerHeight:innerHeight},
      counters:counters,lockedResult:lockedResult,records:records
    },null,2);
  }
  copy.addEventListener('click',function(){
    var data=exportTrace();
    if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(data).then(function(){copy.textContent='COPIED';setTimeout(function(){copy.textContent='COPY TRACE';},900);});
    else {window.prompt('Copy trace',data);}
  });
  clear.addEventListener('click',function(){records.length=0;counters.styleMutations=0;counters.recompositions=0;lockedProbe=null;lockedResult='WAITING';pushRecord('clear');});

  function boot(){
    var n=getNodes();if(!n)return;
    new MutationObserver(function(muts){
      var touched=false;
      muts.forEach(function(m){
        if(m.attributeName==='style'){counters.styleMutations++;lastStyleMutationAt=performance.now();touched=true;}
        if(m.attributeName==='data-r4-state'||m.attributeName==='data-r4-direction')touched=true;
      });
      if(touched)schedule('mutation');
    }).observe(n.section,{attributes:true,attributeFilter:['style','data-r4-state','data-r4-direction']});

    window.addEventListener('scroll',function(){counters.scroll++;schedule('scroll');},{passive:true});
    window.addEventListener('resize',function(){counters.resize++;schedule('resize');},{passive:true});
    window.addEventListener('orientationchange',function(){counters.orientation++;schedule('orientationchange');},{passive:true});
    if(window.visualViewport){
      visualViewport.addEventListener('resize',function(){counters.vvResize++;schedule('visualViewport.resize');},{passive:true});
      visualViewport.addEventListener('scroll',function(){counters.vvScroll++;schedule('visualViewport.scroll');},{passive:true});
    }
    setInterval(function(){
      var st=n.section.getAttribute('data-r4-state');
      if(st==='AI_LOCKED'||st==='WEB_LOCKED')pushRecord('locked-100ms');
    },100);
    pushRecord('boot');
  }
  window.__twR42Debug={records:records,counters:counters,exportTrace:exportTrace};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();