(function(){'use strict';
  var scenes=Array.prototype.slice.call(document.querySelectorAll('[data-tw-mobile-scene]'));
  if(!scenes.length)return;
  var reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  var coarse=window.matchMedia('(hover: none), (pointer: coarse)');
  if(!coarse.matches)return;

  function settle(scene){
    scene.classList.remove('is-r13-awake');
    scene.classList.add('is-r13-settled');
  }

  function wake(scene){
    if(scene.dataset.r13Woken==='1')return;
    scene.dataset.r13Woken='1';
    if(reduced.matches){settle(scene);return;}
    scene.classList.add('is-r13-awake');
    window.setTimeout(function(){settle(scene);},1120);
  }

  if(!('IntersectionObserver' in window)){
    scenes.forEach(function(scene){scene.classList.add('is-r13-active');wake(scene);});
    return;
  }

  var observer=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.intersectionRatio>=.42){
        scenes.forEach(function(scene){if(scene!==entry.target)scene.classList.remove('is-r13-active');});
        entry.target.classList.add('is-r13-active');
        wake(entry.target);
      }else if(!entry.isIntersecting){
        entry.target.classList.remove('is-r13-active');
      }
    });
  },{threshold:[0,.2,.42,.62],rootMargin:'-12% 0px -18% 0px'});

  scenes.forEach(function(scene){observer.observe(scene);});
}());
