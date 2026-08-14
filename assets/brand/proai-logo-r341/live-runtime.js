const SOURCE_URL='/assets/js/proai-hero-cube-r1/source-materials-r1.js';
const GLB_URL='/assets/models/proai-cube/rubik_39_s_cube_animation.glb';
const HOME=Object.freeze({yaw:288,pitch:4.5,roll:-0.3,fov:31});
const MOTION=Object.freeze({yawSpeed:4.5,pitchAmplitude:2,pitchRate:.19,rollAmplitude:.35,rollRate:.128});
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const params=new URLSearchParams(location.search);
const mode=params.get('mode')||'living';
let moduleUrl=null;
const replaceOnce=(source,needle,replacement,label)=>{const a=source.indexOf(needle),b=a<0?-1:source.indexOf(needle,a+needle.length);if(a<0||b>=0)throw new Error(`Logo R3.4.1 source mismatch: ${label}`);return source.slice(0,a)+replacement+source.slice(a+needle.length)};
const notify=(state,detail={})=>parent.postMessage({type:'proai-logo-r341',state,...detail},location.origin);
try{
  const response=await fetch(SOURCE_URL,{cache:'force-cache',credentials:'same-origin'});
  if(!response.ok)throw new Error(`Logo source HTTP ${response.status}`);
  let source=await response.text();
  source=replaceOnce(source,"const GLB_URL = new URL('./rubik_39_s_cube_animation.glb', import.meta.url).href;",`const GLB_URL = '${GLB_URL}';`,'shared canonical GLB');
  source=replaceOnce(source,'  alpha: false,','  alpha: true,','transparent renderer');
  source=replaceOnce(source,'renderer.setClearColor(0x050607, 1);','renderer.setClearColor(0x000000, 0);','transparent clear');
  source=replaceOnce(source,'const scene = new THREE.Scene();\nscene.background = new THREE.Color(0x050607);','const scene = new THREE.Scene();\nscene.background = null;','transparent scene');
  source=replaceOnce(source,'lighting: Object.freeze({ hemisphereIntensity: 0.52, keyIntensity: 5.2, fillIntensity: 4.0, rimIntensity: 4.6, rectAreaLights: 3 }),','lighting: Object.freeze({ hemisphereIntensity: 0.52, keyIntensity: 5.2, fillIntensity: 4.35, rimIntensity: 4.85, rectAreaLights: 3 }),','R3.4.1 living lighting');
  source=replaceOnce(source,'let sliceSchedulerEnabled = !captureMode && !prefersReducedMotion;','let sliceSchedulerEnabled = false;','disable slice scheduler');
  source=replaceOnce(source,'controls.enablePan = false;','controls.enablePan = false;\ncontrols.enableZoom = false;\ncontrols.enabled = false;','disable interaction');
  source=replaceOnce(source,'  setLookDevPreset,\n  renderReviewFrame,',`  setLookDevPreset,\n  setSignatureEuler(yawDeg,pitchDeg,rollDeg,renderFrame=true){\n    presentationRig.quaternion.setFromEuler(new THREE.Euler(THREE.MathUtils.degToRad(pitchDeg),THREE.MathUtils.degToRad(yawDeg),THREE.MathUtils.degToRad(rollDeg),'YXZ')).normalize();\n    if(renderFrame) renderReviewFrame();\n    return {yaw:yawDeg,pitch:pitchDeg,roll:rollDeg};\n  },\n  setSignatureFov(fovDeg,renderFrame=true){camera.fov=fovDeg;camera.updateProjectionMatrix();if(renderFrame) renderReviewFrame();return fovDeg;},\n  renderReviewFrame,`,'signature API');
  moduleUrl=URL.createObjectURL(new Blob([source],{type:'text/javascript'}));
  await import(moduleUrl);
  const api=window.__PROAI_CUBE_R1_2;
  if(!api)throw new Error('Logo Cube API unavailable');
  const started=performance.now();
  while(!api.ready&&api.motionState!=='error'){
    if(performance.now()-started>18000)throw new Error('Logo Cube initialization timeout');
    await new Promise(resolve=>setTimeout(resolve,32));
  }
  if(!api.ready)throw new Error('Logo Cube failed to become ready');
  api.stopChoreography?.();api.stopSliceScheduler?.();api.setLookDevPreset?.('premiumHybrid');api.setSignatureFov?.(HOME.fov,false);api.setSignatureEuler?.(HOME.yaw,HOME.pitch,HOME.roll,true);
  const diagnostics=api.getDiagnostics?.()||{};
  window.__PROAI_LOGO_R341_STATE={ready:true,mode,reducedMotion:reduced,sourceUrl:SOURCE_URL,glbUrl:GLB_URL,home:HOME,motion:MOTION,geometry:diagnostics.geometry||api.geometry,sliceChoreography:false,semanticFace:false,wordmarkAnimated:false,frames:0,elapsedSec:0,current:{yaw:HOME.yaw,pitch:HOME.pitch,roll:HOME.roll}};
  document.documentElement.dataset.proaiLogoReady='true';
  notify('ready',{geometryPass:Boolean((diagnostics.geometry||api.geometry)?.pass),glbUrl:GLB_URL});
  if(mode==='living'&&!reduced){
    const t0=performance.now();
    const tick=(now)=>{const e=(now-t0)/1000;const yaw=HOME.yaw+e*MOTION.yawSpeed;const pitch=HOME.pitch+MOTION.pitchAmplitude*Math.sin(e*MOTION.pitchRate);const roll=HOME.roll+MOTION.rollAmplitude*Math.sin(e*MOTION.rollRate);api.setSignatureEuler(yaw,pitch,roll,true);const state=window.__PROAI_LOGO_R341_STATE;state.frames+=1;state.elapsedSec=e;state.current={yaw,pitch,roll};requestAnimationFrame(tick)};
    requestAnimationFrame(tick);
  }
}catch(error){console.error('[ProAI Logo R3.4.1]',error);document.documentElement.dataset.proaiLogoReady='error';notify('error',{message:String(error)});}finally{if(moduleUrl)setTimeout(()=>URL.revokeObjectURL(moduleUrl),0)}