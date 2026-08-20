(function(){
  'use strict';
  var fine = window.matchMedia('(hover:hover) and (pointer:fine)');
  var reduce = window.matchMedia('(prefers-reduced-motion:reduce)');

  function bind(root){
    var zone = root.querySelector('[data-footer-material]');
    if(!zone) return;

    var state = {x:50,y:50,tx:50,ty:50,e:.14,te:.14,inside:false,raf:0,lx:50,ly:50,last:0};

    function write(){
      root.style.setProperty('--material-x', state.x.toFixed(2) + '%');
      root.style.setProperty('--material-y', state.y.toFixed(2) + '%');
      root.style.setProperty('--material-energy', state.e.toFixed(3));
    }

    function tick(){
      state.raf = 0;
      state.x += (state.tx - state.x) * .15;
      state.y += (state.ty - state.y) * .15;
      state.e += (state.te - state.e) * (state.inside ? .13 : .075);
      write();
      if(Math.abs(state.tx-state.x)>.04 || Math.abs(state.ty-state.y)>.04 || Math.abs(state.te-state.e)>.003){
        state.raf = requestAnimationFrame(tick);
      }
    }

    function go(){ if(!state.raf) state.raf = requestAnimationFrame(tick); }

    function point(ev){
      var b = zone.getBoundingClientRect();
      var nx = Math.max(0,Math.min(100,(ev.clientX-b.left)/b.width*100));
      var ny = Math.max(0,Math.min(100,(ev.clientY-b.top)/b.height*100));
      var now = performance.now();
      var dt = Math.max(16, now - (state.last || now));
      var speed = Math.min(1, Math.hypot(nx-state.lx, ny-state.ly) / (dt/16) / 4.5);
      state.lx = nx; state.ly = ny; state.last = now;
      state.tx = nx; state.ty = ny;
      state.te = .58 + speed * .25;
      go();
    }

    function enter(ev){
      if(!fine.matches || reduce.matches) return;
      state.inside = true;
      point(ev);
      state.x = state.tx; state.y = state.ty;
      state.e = .24; state.te = .66;
      write();
    }

    function leave(){
      state.inside = false;
      state.tx = 50; state.ty = 50; state.te = .14;
      go();
    }

    function reset(){
      if(!fine.matches || reduce.matches){
        state.inside = false; state.tx = state.x = 50; state.ty = state.y = 50; state.te = state.e = .12;
        if(state.raf){ cancelAnimationFrame(state.raf); state.raf = 0; }
        write();
      }
    }

    zone.addEventListener('pointerenter',enter,{passive:true});
    zone.addEventListener('pointermove',function(ev){ if(state.inside && fine.matches && !reduce.matches) point(ev); },{passive:true});
    zone.addEventListener('pointerleave',leave,{passive:true});
    if(fine.addEventListener) fine.addEventListener('change',reset);
    if(reduce.addEventListener) reduce.addEventListener('change',reset);
    write();
  }

  function init(){ document.querySelectorAll('[data-footer-golden-r22]').forEach(bind); }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init,{once:true}); else init();
}());
