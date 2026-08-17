const SOURCE_URL='/assets/js/proai-hero-cube-r1/source-materials-r1.js';
const GLB_URL='/assets/models/proai-cube/rubik_39_s_cube_animation.glb';
const HOME=Object.freeze({yaw:288,pitch:4.5,roll:-0.3,fov:27});
const MOTION=Object.freeze({
  yawSpeed:8.5,
  pitchAmplitude:5,
  pitchPrimaryAmplitude:4,
  pitchPrimaryRate:.34,
  pitchPrimaryPhase:.18,
  pitchSecondaryAmplitude:1,
  pitchSecondaryRate:.11,
  pitchSecondaryPhase:1.1,
  rollAmplitude:.75,
  rollPrimaryAmplitude:.6,
  rollPrimaryRate:.18,
  rollPrimaryPhase:.7,
  rollSecondaryAmplitude:.15,
  rollSecondaryRate:.07,
  rollSecondaryPhase:2.2,
});
const HEADER_MICRO_LOOKDEV=Object.freeze({
  name:'HEADER_MICRO_LOOKDEV',
  exposure:.92,
  pmremSigma:.11,
  materials:Object.freeze({
    graphiteFace:Object.freeze({color:'#29313a',metalness:.82,roughness:.36,clearcoat:.12,clearcoatRoughness:.24,envMapIntensity:1.06}),
    gunmetalFace:Object.freeze({color:'#303841',metalness:.84,roughness:.35,clearcoat:.14,clearcoatRoughness:.23,envMapIntensity:1.03}),
    blackChromeFace:Object.freeze({color:'#20262d',metalness:.88,roughness:.34,clearcoat:.12,clearcoatRoughness:.22,envMapIntensity:1.08}),
    smokedCore:Object.freeze({color:'#11151a',metalness:.44,roughness:.48,clearcoat:.05,clearcoatRoughness:.30,envMapIntensity:.72}),
  }),
  lighting:Object.freeze({hemisphereIntensity:.66,keyIntensity:4.35,fillIntensity:5.15,rimIntensity:3.65}),
  lightCards:Object.freeze({key:[3.8,3.0],fill:[3.6,3.2],rim:[1.7,3.0]}),
});
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const params=new URLSearchParams(location.search);
const mode=params.get('mode')||'living';
const requestedQuality=Number(params.get('quality'));
const qualityOverride=[2,3,4].includes(requestedQuality)?requestedQuality:null;
const controlledStart=params.get('startup')==='controlled';
const effectivePixelRatio=qualityOverride||Math.min(4,Math.max(3,window.devicePixelRatio||1));
globalThis.__PROAI_HEADER_MICRO_PIXEL_RATIO=effectivePixelRatio;
let moduleUrl=null;
let motionLastNow=performance.now();
let motionElapsedSec=0;
let motionYawDeg=HOME.yaw;
let motionEnabled=false;
const replaceOnce=(source,needle,replacement,label)=>{const a=source.indexOf(needle),b=a<0?-1:source.indexOf(needle,a+needle.length);if(a<0||b>=0)throw new Error(`Logo R3.4.1 source mismatch: ${label}`);return source.slice(0,a)+replacement+source.slice(a+needle.length)};
const notify=(state,detail={})=>parent.postMessage({type:'proai-logo-r341',state,...detail},location.origin);
const resetMotionClock=()=>{motionLastNow=performance.now()};
document.addEventListener('visibilitychange',resetMotionClock,{passive:true});
addEventListener('message',event=>{
  if(event.origin!==location.origin||event.data?.type!=='proai-logo-r341-control'||event.data?.action!=='start-motion')return;
  if(mode!=='living'||reduced)return;
  motionLastNow=performance.now();
  motionEnabled=true;
  if(window.__PROAI_LOGO_R341_STATE)window.__PROAI_LOGO_R341_STATE.motionStarted=true;
});
try{
  const response=await fetch(SOURCE_URL,{cache:'force-cache',credentials:'same-origin'});
  if(!response.ok)throw new Error(`Logo source HTTP ${response.status}`);
  let source=await response.text();
  source=replaceOnce(source,"const GLB_URL = new URL('./rubik_39_s_cube_animation.glb', import.meta.url).href;",`const GLB_URL = '${GLB_URL}';`,'shared canonical GLB');
  source=replaceOnce(source,'  alpha: false,','  alpha: true,','transparent renderer');
  source=replaceOnce(source,"renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, (captureMode || reviewMode) ? 1 : 2));","renderer.setPixelRatio(globalThis.__PROAI_HEADER_MICRO_PIXEL_RATIO || 3);",'Retina micro pixel ratio');
  source=replaceOnce(source,'renderer.toneMappingExposure = 1.0;','renderer.toneMappingExposure = 0.92;','micro exposure');
  source=replaceOnce(source,'renderer.setClearColor(0x050607, 1);','renderer.setClearColor(0x000000, 0);','transparent clear');
  source=replaceOnce(source,'const scene = new THREE.Scene();\nscene.background = new THREE.Color(0x050607);','const scene = new THREE.Scene();\nscene.background = null;','transparent scene');
  source=replaceOnce(source,'const texture = pmrem.fromScene(environmentScene, 0.075, 0.1, 30).texture;','const texture = pmrem.fromScene(environmentScene, 0.11, 0.1, 30).texture;','broader micro reflection');
  source=replaceOnce(source,"graphiteFace: Object.freeze({ color: '#242a31', metalness: 0.84, roughness: 0.295, clearcoat: 0.16, clearcoatRoughness: 0.20, envMapIntensity: 1.18 }),","graphiteFace: Object.freeze({ color: '#29313a', metalness: 0.82, roughness: 0.36, clearcoat: 0.12, clearcoatRoughness: 0.24, envMapIntensity: 1.06 }),",'micro graphite');
  source=replaceOnce(source,"gunmetalFace: Object.freeze({ color: '#2b323a', metalness: 0.86, roughness: 0.265, clearcoat: 0.20, clearcoatRoughness: 0.18, envMapIntensity: 1.22 }),","gunmetalFace: Object.freeze({ color: '#303841', metalness: 0.84, roughness: 0.35, clearcoat: 0.14, clearcoatRoughness: 0.23, envMapIntensity: 1.03 }),",'micro gunmetal');
  source=replaceOnce(source,"blackChromeFace: Object.freeze({ color: '#181d23', metalness: 0.92, roughness: 0.225, clearcoat: 0.16, clearcoatRoughness: 0.16, envMapIntensity: 1.26 }),","blackChromeFace: Object.freeze({ color: '#20262d', metalness: 0.88, roughness: 0.34, clearcoat: 0.12, clearcoatRoughness: 0.22, envMapIntensity: 1.08 }),",'micro black chrome');
  source=replaceOnce(source,"smokedCore: Object.freeze({ color: '#0c0f13', metalness: 0.48, roughness: 0.44, clearcoat: 0.06, clearcoatRoughness: 0.28, envMapIntensity: 0.66 }),","smokedCore: Object.freeze({ color: '#11151a', metalness: 0.44, roughness: 0.48, clearcoat: 0.05, clearcoatRoughness: 0.30, envMapIntensity: 0.72 }),",'micro smoked core');
  source=replaceOnce(source,'lighting: Object.freeze({ hemisphereIntensity: 0.52, keyIntensity: 5.2, fillIntensity: 4.0, rimIntensity: 4.6, rectAreaLights: 3 }),','lighting: Object.freeze({ hemisphereIntensity: 0.66, keyIntensity: 4.35, fillIntensity: 5.15, rimIntensity: 3.65, rectAreaLights: 3 }),','micro lighting');
  source=replaceOnce(source,"place(key, [1.62, 0.62, 1.95], 3.20, 2.50);\n  place(fill, [-1.45, 0.22, 1.72], 2.85, 2.65);\n  place(rim, [-1.28, 1.02, -1.88], 1.15, 2.65);","place(key, [1.62, 0.62, 1.95], 3.80, 3.00);\n  place(fill, [-1.45, 0.22, 1.72], 3.60, 3.20);\n  place(rim, [-1.28, 1.02, -1.88], 1.70, 3.00);",'broad micro studio lights');
  source=replaceOnce(source,'let sliceSchedulerEnabled = !captureMode && !prefersReducedMotion;','let sliceSchedulerEnabled = false;','disable slice scheduler');
  source=replaceOnce(source,'controls.enablePan = false;','controls.enablePan = false;\ncontrols.enableZoom = false;\ncontrols.enabled = false;','disable interaction');
  source=replaceOnce(source,'  setLookDevPreset,\n  renderReviewFrame,',`  setLookDevPreset,\n  setSignatureEuler(yawDeg,pitchDeg,rollDeg,renderFrame=true){\n    presentationRig.quaternion.setFromEuler(new THREE.Euler(THREE.MathUtils.degToRad(pitchDeg),THREE.MathUtils.degToRad(yawDeg),THREE.MathUtils.degToRad(rollDeg),'YXZ')).normalize();\n    if(renderFrame) renderReviewFrame();\n    return {yaw:yawDeg,pitch:pitchDeg,roll:rollDeg};\n  },\n  setSignatureFov(fovDeg,renderFrame=true){camera.fov=fovDeg;camera.updateProjectionMatrix();if(renderFrame) renderReviewFrame();return fovDeg;},\n  renderReviewFrame,`,'signature API');
  source=replaceOnce(source,`function render(now) {\n  updatePresentationMotion(now);\n  controls.update();\n  renderer.render(scene, camera);\n  requestAnimationFrame(render);\n}`,`function render(now) {\n  if (document.visibilityState === 'visible') {\n    globalThis.__PROAI_HEADER_LOGO_TICK?.(now);\n    controls.update();\n    renderer.render(scene, camera);\n  }\n  requestAnimationFrame(render);\n}`,'single RAF signature loop');
  moduleUrl=URL.createObjectURL(new Blob([source],{type:'text/javascript'}));
  await import(moduleUrl);
  const api=window.__PROAI_CUBE_R1_2;
  if(!api)throw new Error('Logo Cube API unavailable');
  const started=performance.now();
  while(!api.ready&&api.motionState!=='error'){
    if(performance.now()-started>45000)throw new Error('Logo Cube initialization timeout');
    await new Promise(resolve=>setTimeout(resolve,32));
  }
  if(!api.ready)throw new Error('Logo Cube failed to become ready');
  api.stopChoreography?.();
  api.stopSliceScheduler?.();
  api.setLookDevPreset?.('premiumHybrid');
  api.setSignatureFov?.(HOME.fov,false);
  api.setSignatureEuler?.(HOME.yaw,HOME.pitch,HOME.roll,false);
  const diagnostics=api.getDiagnostics?.()||{};
  const canvas=document.getElementById('cube-canvas');
  const rect=canvas.getBoundingClientRect();
  window.__PROAI_LOGO_R341_STATE={
    ready:true,
    revision:'HEADER_LIVING_CUBE_R1.1',
    mode,
    reducedMotion:reduced,
    captureMode:false,
    sourceUrl:SOURCE_URL,
    glbUrl:GLB_URL,
    home:HOME,
    motion:MOTION,
    microLookDev:HEADER_MICRO_LOOKDEV,
    geometry:diagnostics.geometry||api.geometry,
    renderer:Object.freeze({
      cssWidth:rect.width,
      cssHeight:rect.height,
      backingWidth:canvas.width,
      backingHeight:canvas.height,
      devicePixelRatio:window.devicePixelRatio||1,
      effectivePixelRatio,
      antialias:true,
      cssScaleTransform:false,
      preserveDrawingBuffer:false,
    }),
    sliceChoreography:false,
    semanticFace:false,
    wordmarkAnimated:false,
    controlledStart,
    motionStarted:false,
    frames:0,
    elapsedSec:0,
    current:{yaw:HOME.yaw,pitch:HOME.pitch,roll:HOME.roll},
    lastDeltaSec:0,
    lastRenderAt:performance.now(),
  };
  motionLastNow=performance.now();
  motionElapsedSec=0;
  motionYawDeg=HOME.yaw;
  if(mode==='living'&&!reduced){
    motionEnabled=!controlledStart;
    globalThis.__PROAI_HEADER_LOGO_TICK=(now)=>{
      if(!motionEnabled){motionLastNow=now;return;}
      const dt=Math.max(0,(now-motionLastNow)/1000);
      motionLastNow=now;
      motionElapsedSec+=dt;
      motionYawDeg+=MOTION.yawSpeed*dt;
      const pitch=HOME.pitch
        +MOTION.pitchPrimaryAmplitude*Math.sin(motionElapsedSec*MOTION.pitchPrimaryRate+MOTION.pitchPrimaryPhase)
        +MOTION.pitchSecondaryAmplitude*Math.sin(motionElapsedSec*MOTION.pitchSecondaryRate+MOTION.pitchSecondaryPhase);
      const roll=HOME.roll
        +MOTION.rollPrimaryAmplitude*Math.sin(motionElapsedSec*MOTION.rollPrimaryRate+MOTION.rollPrimaryPhase)
        +MOTION.rollSecondaryAmplitude*Math.sin(motionElapsedSec*MOTION.rollSecondaryRate+MOTION.rollSecondaryPhase);
      api.setSignatureEuler(motionYawDeg,pitch,roll,false);
      const state=window.__PROAI_LOGO_R341_STATE;
      state.frames+=1;
      state.elapsedSec=motionElapsedSec;
      state.current={yaw:motionYawDeg,pitch,roll};
      state.lastDeltaSec=dt;
      state.lastRenderAt=now;
    };
  }
  document.documentElement.dataset.proaiLogoReady='true';
  notify('ready',{geometryPass:Boolean((diagnostics.geometry||api.geometry)?.pass),glbUrl:GLB_URL,effectivePixelRatio,revision:'HEADER_LIVING_CUBE_R1.1'});
}catch(error){
  console.error('[ProAI Header Living Cube R1.1]',error);
  document.documentElement.dataset.proaiLogoReady='error';
  notify('error',{message:String(error)});
}finally{
  if(moduleUrl)setTimeout(()=>URL.revokeObjectURL(moduleUrl),0);
}