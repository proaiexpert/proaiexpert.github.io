/* ProAI Expert — Homepage Footer Watermark R2 interaction.
   Runs only for fine-pointer/hover devices. No idle rAF loop. */
(function(){
  'use strict';

  var roots = Array.prototype.slice.call(document.querySelectorAll('[data-footer-watermark-r2]'));
  if (!roots.length) return;

  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  roots.forEach(function(root){
    var field = root.querySelector('[data-footer-material]');
    var ring = root.querySelector('[data-footer-ring]');
    if (!field || !ring) return;

    var frame = 0;
    var inside = false;
    var currentX = 50;
    var currentY = 50;
    var targetX = 50;
    var targetY = 50;
    var currentResponse = 0.08;
    var targetResponse = 0.08;
    var lastClientX = 0;
    var lastClientY = 0;
    var lastTime = 0;
    var lastRipple = 0;
    var ringAnimation = null;

    function write(){
      field.style.setProperty('--r2-x', currentX.toFixed(2) + '%');
      field.style.setProperty('--r2-y', currentY.toFixed(2) + '%');
      root.style.setProperty('--r2-x', currentX.toFixed(2) + '%');
      root.style.setProperty('--r2-y', currentY.toFixed(2) + '%');
      root.style.setProperty('--r2-response', currentResponse.toFixed(3));
    }

    function tick(){
      frame = 0;
      currentX += (targetX - currentX) * 0.14;
      currentY += (targetY - currentY) * 0.14;
      currentResponse += (targetResponse - currentResponse) * (inside ? 0.12 : 0.08);
      write();

      var positionSettled = Math.abs(targetX-currentX) < 0.05 && Math.abs(targetY-currentY) < 0.05;
      var responseSettled = Math.abs(targetResponse-currentResponse) < 0.004;
      if (!positionSettled || !responseSettled) frame = requestAnimationFrame(tick);
    }

    function ensureTick(){
      if (!frame) frame = requestAnimationFrame(tick);
    }

    function positionFromEvent(event){
      var rect = field.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      targetX = Math.max(0,Math.min(100,((event.clientX-rect.left)/rect.width)*100));
      targetY = Math.max(0,Math.min(100,((event.clientY-rect.top)/rect.height)*100));
    }

    function ripple(strength){
      if (!finePointer.matches || reduceMotion.matches || typeof ring.animate !== 'function') return;
      var now = performance.now();
      if (now-lastRipple < 520) return;
      lastRipple = now;
      if (ringAnimation) ringAnimation.cancel();
      var alpha = Math.max(.18,Math.min(.42,strength));
      ringAnimation = ring.animate([
        {opacity:0,transform:'translate3d(-50%,-50%,0) scale(.20)'},
        {opacity:alpha,offset:.16,transform:'translate3d(-50%,-50%,0) scale(.42)'},
        {opacity:alpha*.54,offset:.52,transform:'translate3d(-50%,-50%,0) scale(1.02)'},
        {opacity:0,transform:'translate3d(-50%,-50%,0) scale(1.68)'}
      ],{
        duration:1380,
        easing:'cubic-bezier(.16,.72,.22,1)',
        fill:'none'
      });
    }

    function onEnter(event){
      if (!finePointer.matches || reduceMotion.matches) return;
      inside = true;
      root.setAttribute('data-r2-active','true');
      positionFromEvent(event);
      currentX = targetX;
      currentY = targetY;
      currentResponse = .16;
      targetResponse = .31;
      write();
      ripple(.31);
      lastClientX = event.clientX;
      lastClientY = event.clientY;
      lastTime = performance.now();
    }

    function onMove(event){
      if (!inside || !finePointer.matches || reduceMotion.matches) return;
      positionFromEvent(event);
      var now = performance.now();
      var dt = Math.max(8,now-lastTime);
      var dx = event.clientX-lastClientX;
      var dy = event.clientY-lastClientY;
      var speed = Math.min(1,Math.hypot(dx,dy)/dt/1.15);
      targetResponse = .20 + speed*.27;
      root.style.setProperty('--r2-speed',speed.toFixed(3));
      if (speed > .48) ripple(.22 + speed*.12);
      lastClientX = event.clientX;
      lastClientY = event.clientY;
      lastTime = now;
      ensureTick();
    }

    function onLeave(){
      inside = false;
      root.removeAttribute('data-r2-active');
      targetResponse = .08;
      targetX = 50;
      targetY = 50;
      root.style.setProperty('--r2-speed','0');
      ensureTick();
    }

    function onMediaChange(){
      if (!finePointer.matches || reduceMotion.matches) {
        inside = false;
        targetResponse = .08;
        targetX = 50;
        targetY = 50;
        root.removeAttribute('data-r2-active');
        if (ringAnimation) ringAnimation.cancel();
        ensureTick();
      }
    }

    field.addEventListener('pointerenter',onEnter,{passive:true});
    field.addEventListener('pointermove',onMove,{passive:true});
    field.addEventListener('pointerleave',onLeave,{passive:true});
    finePointer.addEventListener('change',onMediaChange);
    reduceMotion.addEventListener('change',onMediaChange);
    write();
  });
}());
