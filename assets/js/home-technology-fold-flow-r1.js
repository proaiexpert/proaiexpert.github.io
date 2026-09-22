(function(){
'use strict';
var SELECTOR='[data-home-tech-fold-flow]';
var names=['handoff','understand','orchestrate','communicate','deliver','resolved'];
var forward=[.11,.29,.47,.65,.83];
var backward=[.08,.26,.44,.62,.80];
var reduce=matchMedia('(prefers-reduced-motion: reduce)');
var states=new WeakMap();
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function getState(section){var s=states.get(section);if(s)return s;s={progress:0,index:0,raf:0,resizing:0,orientation:innerWidth>innerHeight?'landscape':'portrait'};states.set(section,s);return s}
function setStage(section,index,reason){
  var s=getState(section);index=clamp(index,0,names.length-1);s.index=index;
  var name=names[index];section.setAttribute('data-ff-stage',name);section.setAttribute('data-ff-reason',reason||'scroll');
  section.querySelectorAll('[data-ff-panel]').forEach(function(panel){panel.setAttribute('aria-hidden',String(panel.getAttribute('data-ff-panel')!==name))});
}
function stageFor(section,p){
  var s=getState(section),i=s.index;
  while(i<5&&p>=forward[i])i++;
  while(i>0&&p<backward[i-1])i--;
  return i;
}
function updateVisual(section,p){
  var s=getState(section);s.progress=p;
  var foldWidth=88-(74*clamp(p/.13,0,1));
  section.style.setProperty('--ff-fold-width',foldWidth.toFixed(2)+'px');
  section.style.setProperty('--ff-progress',p.toFixed(4));
  var path=section.querySelector('[data-ff-path]');
  var trail=section.querySelector('[data-ff-trail]');
  var impulse=section.querySelector('[data-ff-impulse]');
  if(path&&trail&&impulse){
    var travel=clamp((p-.015)/.94,0,1);
    trail.style.strokeDasharray=travel.toFixed(4)+' 1';
    var total=path.getTotalLength();
    var len=total*(.01+.975*travel);
    var p1=path.getPointAtLength(len);
    var p0=path.getPointAtLength(Math.max(0,len-2));
    var angle=Math.atan2(p1.y-p0.y,p1.x-p0.x)*180/Math.PI;
    impulse.setAttribute('transform','translate('+p1.x.toFixed(2)+' '+p1.y.toFixed(2)+') rotate('+angle.toFixed(2)+')');
    impulse.style.opacity=(p>.965?'0':String(.55+.45*(1-clamp((p-.9)/.08,0,1))));
  }
  setStage(section,stageFor(section,p),'scroll');
}
function calcProgress(section){
  var story=section.querySelector('[data-ff-story]');if(!story)return 0;
  var r=story.getBoundingClientRect();
  var travel=Math.max(1,r.height-innerHeight);
  return clamp(-r.top/travel,0,1);
}
function schedule(section){
  var s=getState(section);if(s.raf)return;
  s.raf=requestAnimationFrame(function(){s.raf=0;if(!reduce.matches)updateVisual(section,calcProgress(section))});
}
function preserveOnResize(section){
  var s=getState(section);
  clearTimeout(s.resizing);
  var keep=s.progress;
  s.resizing=setTimeout(function(){
    var story=section.querySelector('[data-ff-story]');if(!story||reduce.matches)return;
    var nextOrientation=innerWidth>innerHeight?'landscape':'portrait';
    if(nextOrientation!==s.orientation){
      s.orientation=nextOrientation;
      var top=scrollY+story.getBoundingClientRect().top;
      var travel=Math.max(1,story.getBoundingClientRect().height-innerHeight);
      scrollTo({top:top+travel*keep,behavior:'auto'});
    }
    updateVisual(section,calcProgress(section));
  },90);
}
function init(section){
  var s=getState(section);
  if(reduce.matches){setStage(section,5,'reduced');section.style.setProperty('--ff-fold-width','14px');return}
  updateVisual(section,calcProgress(section));
  addEventListener('scroll',function(){schedule(section)},{passive:true});
  addEventListener('resize',function(){preserveOnResize(section)},{passive:true});
  if(window.visualViewport)visualViewport.addEventListener('resize',function(){preserveOnResize(section)},{passive:true});
  reduce.addEventListener&&reduce.addEventListener('change',function(){location.reload()});
}
function boot(){document.querySelectorAll(SELECTOR).forEach(init)}
window.__PROAI_FOLD_FLOW_R1__={
  setStage:function(section,name){var i=names.indexOf(name);if(i>=0)setStage(section,i,'debug')},
  setProgress:function(section,p){updateVisual(section,clamp(Number(p)||0,0,1))},
  stages:names.slice()
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
}());