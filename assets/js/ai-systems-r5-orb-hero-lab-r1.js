// Isolated integration. Scene geometry, materials and event graph remain in Spline.
const SCRIPT='https://cdn.spline.design/@splinetool/viewer@2.0.90/build/spline-viewer.webgl.js';
const SCENE='https://prod.spline.design/2Yj34zCLbNfdn5zM/scene.splinecode';
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let library;
function loadLibrary(){
  if(!library) library=new Promise((resolve,reject)=>{
    const script=document.createElement('script');script.type='module';script.src=SCRIPT;
    script.onload=()=>customElements.whenDefined('spline-viewer').then(resolve);
    script.onerror=()=>reject(new Error('Spline Viewer unavailable'));document.head.append(script);
  }).catch(error=>{library=null;throw error;});
  return library;
}
for(const root of document.querySelectorAll('[data-orb]')){
  const stage=root.querySelector('[data-orb-stage]'),button=root.querySelector('[data-orb-toggle]'),status=root.querySelector('[data-orb-status]');
  let viewer=null,timer,requested=false,generation=0;
  let touchOrigin=null;
  stage.addEventListener('touchstart',event=>{
    const point=event.touches[0];touchOrigin=point?{x:point.clientX,y:point.clientY}:null;
  },{capture:true,passive:true});
  stage.addEventListener('touchmove',event=>{
    const point=event.touches[0];if(!point||!touchOrigin)return;
    const dx=Math.abs(point.clientX-touchOrigin.x),dy=Math.abs(point.clientY-touchOrigin.y);
    // Keep vertical gestures away from scene handlers that cancel browser scrolling.
    // No preventDefault: the browser retains its native pan and pinch behavior.
    if(dy>8&&dy>dx*1.2)event.stopPropagation();
  },{capture:true,passive:true});
  stage.addEventListener('touchend',()=>{touchOrigin=null;},{passive:true});
  button.hidden=false;
  function stop(message=''){
    generation++;requested=false;clearTimeout(timer);viewer?.remove();viewer=null;
    root.dataset.ready='false';button.textContent=root.dataset.start;button.setAttribute('aria-pressed','false');status.textContent=message;
  }
  async function start(){
    const ticket=++generation;requested=true;status.textContent=root.dataset.loading;
    button.textContent=root.dataset.pause;button.setAttribute('aria-pressed','true');
    timer=setTimeout(()=>stop(root.dataset.fallback),45000);
    try{
      await loadLibrary();if(ticket!==generation)return;
      viewer=document.createElement('spline-viewer');viewer.setAttribute('url',SCENE);
      viewer.setAttribute('events-target','local');viewer.setAttribute('loading','eager');
      viewer.setAttribute('background','transparent');
      viewer.addEventListener('load-complete',()=>{
        if(ticket!==generation)return;clearTimeout(timer);root.dataset.ready='true';status.textContent='';
        // Embed gesture policy: vertical panning belongs to the document.
        const canvas=viewer.shadowRoot?.querySelector('canvas');
        if(canvas)canvas.style.setProperty('touch-action','pan-y pinch-zoom','important');
      });
      viewer.addEventListener('context-loss',()=>stop(root.dataset.fallback));stage.append(viewer);
    }catch{if(ticket===generation)stop(root.dataset.fallback);}
  }
  button.addEventListener('click',()=>requested?stop():start());
  reduced.addEventListener('change',event=>{if(event.matches)stop();});
  const observer=new IntersectionObserver(entries=>{
    if(entries.some(entry=>entry.isIntersecting)){
      observer.disconnect();if(!reduced.matches&&!requested)start();
    }
  },{rootMargin:'250px'});observer.observe(root);
}
