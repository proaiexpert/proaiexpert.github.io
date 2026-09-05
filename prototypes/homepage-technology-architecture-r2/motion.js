(function(){'use strict';
var sections=[].slice.call(document.querySelectorAll('[data-ta2]'));if(!sections.length)return;
var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)');
var fine=window.matchMedia&&window.matchMedia('(hover:hover) and (pointer:fine)');
function clearActive(obj){obj.removeAttribute('data-active');[].forEach.call(obj.querySelectorAll('[data-family]'),function(c){c.setAttribute('aria-pressed','false')})}
function setActive(obj,family){obj.setAttribute('data-active',family);[].forEach.call(obj.querySelectorAll('[data-family]'),function(c){c.setAttribute('aria-pressed',c.dataset.family===family?'true':'false')})}
function installInteraction(section){var obj=section.querySelector('[data-ta2-object]');if(!obj)return;[].forEach.call(obj.querySelectorAll('[data-family]'),function(control){var family=control.dataset.family;
control.addEventListener('pointerenter',function(){if(fine&&fine.matches)setActive(obj,family)},{passive:true});
control.addEventListener('pointerleave',function(){if(fine&&fine.matches&&!control.matches(':focus-visible'))clearActive(obj)},{passive:true});
control.addEventListener('focus',function(){if(fine&&fine.matches)setActive(obj,family)});control.addEventListener('blur',function(){if(fine&&fine.matches)clearActive(obj)});
control.addEventListener('click',function(){if(fine&&fine.matches)return;var on=control.getAttribute('aria-pressed')==='true';if(on){clearActive(obj);control.blur()}else{setActive(obj,family);control.blur()}})});}
function arm(section){if(section.dataset.ta2Armed==='true'||(reduced&&reduced.matches))return;section.dataset.ta2Armed='true';section.classList.add('is-armed')}
function compose(section){if(section.dataset.ta2Composed==='true')return;section.dataset.ta2Composed='true';if(reduced&&reduced.matches){section.classList.remove('is-armed');return}section.classList.add('is-composing');window.setTimeout(function(){section.classList.remove('is-armed','is-composing')},2460)}
sections.forEach(installInteraction);if(reduced&&reduced.matches)return;
sections.forEach(arm);
if(!('IntersectionObserver'in window)){sections.forEach(function(s){window.setTimeout(function(){compose(s)},260)});return}
var observer=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting&&entry.intersectionRatio>=.58){var section=entry.target.closest('[data-ta2]');if(section)compose(section);observer.unobserve(entry.target)}})},{threshold:[.42,.58,.72],rootMargin:'0px 0px -3% 0px'});
sections.forEach(function(s){var obj=s.querySelector('[data-ta2-object]');if(obj)observer.observe(obj)});
})();
