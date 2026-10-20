/* Selected Thinking R3.1 — one-shot signature, progressive enhancement.
   Content is always readable without JavaScript. */
(function(){
  "use strict";
  var sections=document.querySelectorAll("[data-st-r31]");
  if(!sections.length)return;
  var reduce=window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  sections.forEach(function(section){
    if(reduce || !("IntersectionObserver" in window)){
      section.dataset.stR31State="rest";
      return;
    }
    var entered=false;
    var observer=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entered || !entry.isIntersecting)return;
        entered=true;
        observer.disconnect();
        section.dataset.stR31State="reveal";
        section.classList.add("st-r31-entered");
        window.setTimeout(function(){
          section.classList.remove("st-r31-entered");
          section.dataset.stR31State="rest";
        },1280);
      });
    },{rootMargin:"0px 0px -12% 0px",threshold:0.07});
    observer.observe(section);
  });
})();
