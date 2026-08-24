const sourceUrl=new URL('../../../../assets/brand/proai-logo-r341/live-runtime.js',import.meta.url);
const r=await fetch(sourceUrl,{cache:'no-store'});if(!r.ok)throw new Error(`Header live runtime HTTP ${r.status}`);
let s=await r.text();
const shared=new URL('../../../../assets/js/proai-hero-cube-r1/source-materials-r1.js',import.meta.url).href;
const glb=new URL('../../../../assets/models/proai-cube/rubik_39_s_cube_animation.glb',import.meta.url).href;
s=s.replace("const SOURCE_URL='/assets/js/proai-hero-cube-r1/source-materials-r1.js';",`const SOURCE_URL='${shared}';`).replace("const GLB_URL='/assets/models/proai-cube/rubik_39_s_cube_animation.glb';",`const GLB_URL='${glb}';`);
if(s.includes("SOURCE_URL='/assets/")||s.includes("GLB_URL='/assets/"))throw new Error('Header live root path rewrite failed');
const u=URL.createObjectURL(new Blob([s],{type:'text/javascript'}));try{await import(u)}finally{setTimeout(()=>URL.revokeObjectURL(u),0)}
