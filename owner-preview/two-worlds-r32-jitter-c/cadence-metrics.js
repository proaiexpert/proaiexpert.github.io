/* Preview-only passive counters. No RAF loop, animation, or per-frame DOM writes. */
(function(){
  'use strict';
  var section=document.querySelector('[data-tw-r5]');
  var fold=section&&section.querySelector('[data-tw-fold]');
  if(!fold)return;
  var nativeRaf=window.requestAnimationFrame;
  var nativeCancel=window.cancelAnimationFrame;
  var nativeSet=CSSStyleDeclaration.prototype.setProperty;
  var pending=new Set();
  var samples=[],events=[],intervals=[],deltas=[],foldDeltas=[];
  var lastAt=0,lastY=NaN,lastFoldX=NaN;
  var released=false;
  var m;
  function reset(){
    m={scrollEvents:0,rafRequests:0,rafCallbacks:0,geometryRenders:0,
      rafsWithoutGeometry:0,identicalYFrames:0,maxIdenticalYRun:0,
      intervalsOver16_7:0,intervalsOver22:0,maxFrameInterval:0,
      scrollEventsAfterRelease:0,changedYFramesAfterRelease:0,
      rendersAfterRelease:0,resetAt:performance.now()};
    samples.length=events.length=intervals.length=deltas.length=foldDeltas.length=0;
    lastAt=0;lastY=NaN;released=false;
  }
  reset();
  function boundedPush(list,value){if(list.length>=512)list.shift();list.push(value);}
  var identicalRun=0;
  window.requestAnimationFrame=function(callback){
    if(callback.name!=='runScroll')return nativeRaf.call(window,callback);
    m.rafRequests+=1;
    var id=nativeRaf.call(window,function(at){
      pending.delete(id);
      var y=Math.max(0,window.scrollY||0),dy=Number.isFinite(lastY)?y-lastY:0;
      if(lastAt){
        var dt=at-lastAt;
        boundedPush(intervals,dt);
        m.maxFrameInterval=Math.max(m.maxFrameInterval,dt);
        if(dt>16.7)m.intervalsOver16_7+=1;
        if(dt>22)m.intervalsOver22+=1;
      }
      if(Number.isFinite(lastY)&&y===lastY){
        m.identicalYFrames+=1;identicalRun+=1;
        m.maxIdenticalYRun=Math.max(m.maxIdenticalYRun,identicalRun);
      }else identicalRun=0;
      if(released&&dy!==0)m.changedYFramesAfterRelease+=1;
      m.rafCallbacks+=1;
      boundedPush(deltas,dy);
      var renders=m.geometryRenders;
      callback(at);
      var rendered=m.geometryRenders!==renders;
      if(!rendered)m.rafsWithoutGeometry+=1;
      boundedPush(samples,{at:at,y:y,dy:dy,foldX:lastFoldX,rendered:rendered,afterRelease:released});
      lastAt=at;lastY=y;
    });
    pending.add(id);
    return id;
  };
  window.cancelAnimationFrame=function(id){pending.delete(id);return nativeCancel.call(window,id);};
  CSSStyleDeclaration.prototype.setProperty=function(name,value,priority){
    if(this===fold.style&&name==='transform'){
      var x=parseFloat(value.slice('translate3d('.length));
      if(Number.isFinite(lastFoldX))boundedPush(foldDeltas,x-lastFoldX);
      lastFoldX=x;m.geometryRenders+=1;
      if(released)m.rendersAfterRelease+=1;
    }
    return nativeSet.call(this,name,value,priority);
  };
  window.addEventListener('scroll',function(){
    m.scrollEvents+=1;
    if(released)m.scrollEventsAfterRelease+=1;
    boundedPush(events,{at:performance.now(),y:Math.max(0,window.scrollY||0),afterRelease:released});
  },{passive:true});
  window.addEventListener('touchstart',function(){released=false;},{passive:true});
  window.addEventListener('touchend',function(){released=true;},{passive:true});
  function distribution(values){
    var sorted=values.slice().sort(function(a,b){return a-b;});
    return {n:sorted.length,p95:sorted[Math.floor(sorted.length*.95)]||0,
      median:sorted[Math.floor(sorted.length*.5)]||0,max:sorted[sorted.length-1]||0};
  }
  function snapshot(){
    return Object.assign({},m,{
      pendingScrollRafs:pending.size,hidden:document.hidden,
      runtime:window.__twR5Snapshot?window.__twR5Snapshot()[0]:null,
      frameIntervals:distribution(intervals),scrollYDelta:distribution(deltas),
      foldXDelta:distribution(foldDeltas),recentRafs:samples.slice(),recentScrollEvents:events.slice(),
      note:'RAF callbacks, not physical display presentation. Bounded recent sample buffers: 512.'
    });
  }
  window.__twR5Cadence={snapshot:snapshot,reset:function(){identicalRun=0;reset();}};
  var button=document.querySelector('[data-cadence-open]');
  var dialog=document.querySelector('[data-cadence-dialog]');
  var output=document.querySelector('[data-cadence-output]');
  if(button&&dialog&&output){
    button.addEventListener('click',function(){
      var s=snapshot();delete s.recentRafs;delete s.recentScrollEvents;
      output.textContent=JSON.stringify(s,null,2);dialog.showModal();
    });
    dialog.querySelector('[data-cadence-close]').addEventListener('click',function(){dialog.close();});
    dialog.querySelector('[data-cadence-reset]').addEventListener('click',function(){window.__twR5Cadence.reset();dialog.close();});
  }
}());
