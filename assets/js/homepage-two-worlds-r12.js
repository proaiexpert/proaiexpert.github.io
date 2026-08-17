(function(){'use strict';
  var scenes=Array.prototype.slice.call(document.querySelectorAll('[data-tw-mobile-scene]'));
  if(!scenes.length)return;
  var reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  function wake(scene){if(scene.classList.contains('is-r12-awake'))return;scene.classList.add('is-r12-awake');}
  if(reduced.matches||!('IntersectionObserver' in window)){scenes.forEach(wake);return;}
  var observer=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(!entry.isIntersecting)return;wake(entry.target);observer.unobserve(entry.target);});},{threshold:.34,rootMargin:'0px 0px -10% 0px'});
  scenes.forEach(function(scene){observer.observe(scene);});
}());
