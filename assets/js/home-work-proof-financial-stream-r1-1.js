(()=>{
  document.documentElement.classList.add('js');
  const roots=[...document.querySelectorAll('[data-fs-showcase-r11]')];
  if(!roots.length)return;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduced){roots.forEach(root=>root.classList.add('is-live'));return;}
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('is-live');observer.unobserve(entry.target);}
    });
  },{threshold:.12,rootMargin:'0px 0px -8%'});
  roots.forEach(root=>observer.observe(root));
})();
