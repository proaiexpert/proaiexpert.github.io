import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const stage = document.querySelector('[data-r5-stage]');
if (!stage) throw new Error('R5 stage missing');

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarsePointer = matchMedia('(pointer: coarse)').matches;
const lang = document.documentElement.lang?.toLowerCase().startsWith('ru') ? 'ru' : 'en';

const LABELS = {
  en: [
    { key:'models', index:'01', family:'MODELS', vendors:'OPENAI  /  CLAUDE  /  GEMINI' },
    { key:'automation', index:'02', family:'AUTOMATION', vendors:'N8N  /  MAKE  /  ZAPIER' },
    { key:'communication', index:'03', family:'COMMUNICATION', vendors:'TWILIO  /  GMAIL' },
    { key:'build', index:'04', family:'BUILD / DELIVERY', vendors:'VERCEL  /  GITHUB' }
  ],
  ru: [
    { key:'models', index:'01', family:'МОДЕЛИ', vendors:'OPENAI  /  CLAUDE  /  GEMINI' },
    { key:'automation', index:'02', family:'АВТОМАТИЗАЦИЯ', vendors:'N8N  /  MAKE  /  ZAPIER' },
    { key:'communication', index:'03', family:'КОММУНИКАЦИЯ', vendors:'TWILIO  /  GMAIL' },
    { key:'build', index:'04', family:'СБОРКА / ДОСТАВКА', vendors:'VERCEL  /  GITHUB' }
  ]
}[lang];

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true, powerPreference:'high-performance' });
} catch (error) {
  document.documentElement.classList.add('r5-no-webgl');
  console.error(error);
  throw error;
}
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, coarsePointer ? 1.55 : 1.8));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.03;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setClearColor(0x000000,0);
stage.prepend(renderer.domElement);
renderer.domElement.setAttribute('aria-hidden','true');

const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
const environment = new RoomEnvironment();
scene.environment = pmrem.fromScene(environment,0.055).texture;
environment.dispose();
pmrem.dispose();

const camera = new THREE.PerspectiveCamera(31,1,0.1,40);
scene.add(camera);

const rig = new THREE.Group();
const root = new THREE.Group();
rig.add(root);
scene.add(rig);

const bodyMaterial = new THREE.MeshPhysicalMaterial({
  color:0x171a1c,
  roughness:.36,
  metalness:.62,
  clearcoat:.16,
  clearcoatRoughness:.52,
  envMapIntensity:.72,
  transparent:true,
  opacity:1
});
const edgeMaterial = new THREE.MeshPhysicalMaterial({
  color:0xbfc1bd,
  roughness:.23,
  metalness:.92,
  envMapIntensity:.9
});
const darkCutMaterial = new THREE.MeshStandardMaterial({
  color:0x060708,
  roughness:.58,
  metalness:.35
});
const glassMaterial = new THREE.MeshPhysicalMaterial({
  color:0x151a1d,
  roughness:.18,
  metalness:.14,
  transparent:true,
  opacity:.48,
  transmission:.12,
  thickness:.08,
  ior:1.34,
  envMapIntensity:.8,
  depthWrite:false
});

function monolithGeometry(){
  const s = new THREE.Shape();
  s.moveTo(-1.56,-1.07);
  s.lineTo(1.36,-1.07);
  s.lineTo(1.67,-.78);
  s.lineTo(1.67,.70);
  s.lineTo(1.38,1.08);
  s.lineTo(-1.34,1.08);
  s.lineTo(-1.70,.76);
  s.lineTo(-1.70,-.80);
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s,{
    depth:2.62,
    steps:1,
    bevelEnabled:true,
    bevelSegments:6,
    bevelSize:.075,
    bevelThickness:.095,
    curveSegments:1
  });
  g.translate(0,0,-1.31);
  g.computeVertexNormals();
  return g;
}

const body = new THREE.Mesh(monolithGeometry(),bodyMaterial);
body.castShadow = true;
body.receiveShadow = true;
root.add(body);

// Integrated material datum: deliberately non-emissive and non-screen-like.
const datumCut = new THREE.Mesh(new THREE.BoxGeometry(1.38,.035,.035),darkCutMaterial);
datumCut.position.set(.66,-.69,1.416);
root.add(datumCut);
const datumGlass = new THREE.Mesh(new THREE.BoxGeometry(.76,.028,.026),glassMaterial);
datumGlass.position.set(.30,-.687,1.438);
root.add(datumGlass);

const rails = [];
function addRail(size,pos,rot=[0,0,0],material=edgeMaterial){
  const m = new THREE.Mesh(new THREE.BoxGeometry(...size),material);
  m.position.set(...pos);
  m.rotation.set(...rot);
  m.castShadow = true;
  root.add(m);
  rails.push(m);
  return m;
}
addRail([.62,.018,.018],[-1.22,.89,1.432]);
addRail([.018,.47,.018],[1.54,.49,1.432]);
addRail([.018,.018,.72],[1.683,-.56,.47]);
addRail([.84,.018,.018],[-.88,1.115,.46],[-Math.PI/2,0,0]);

for(let i=0;i<4;i++){
  const pin = new THREE.Mesh(new THREE.CylinderGeometry(.021,.021,.012,18),edgeMaterial);
  pin.rotation.x = Math.PI/2;
  pin.position.set(-1.35+i*.12,-.92,1.435);
  root.add(pin);
}

function canvasTexture(draw){
  const canvas = document.createElement('canvas');
  canvas.width = 1536;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0,0,canvas.width,canvas.height);
  draw(ctx,canvas);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(),8);
  tex.needsUpdate = true;
  return tex;
}
function familyTexture(data){
  return canvasTexture((ctx)=>{
    ctx.textBaseline='alphabetic';
    ctx.fillStyle='rgba(222,223,218,.96)';
    ctx.font=`600 ${lang==='ru' ? 76 : 86}px Inter, Arial, sans-serif`;
    ctx.letterSpacing='4px';
    ctx.fillText(data.family,112,362);
    ctx.fillStyle='rgba(165,169,169,.76)';
    ctx.font='500 28px Inter, Arial, sans-serif';
    ctx.fillText(`SURFACE ${data.index}`,116,238);
    ctx.fillStyle='rgba(210,211,207,.31)';
    ctx.fillRect(116,276,176,3);
  });
}
function vendorTexture(data){
  return canvasTexture((ctx)=>{
    ctx.textBaseline='alphabetic';
    ctx.fillStyle='rgba(181,184,183,.88)';
    ctx.font='500 31px Inter, Arial, sans-serif';
    ctx.fillText(data.vendors,116,470);
    ctx.fillStyle='rgba(208,210,206,.22)';
    ctx.fillRect(116,506,660,2);
  });
}
function registrationTexture(index){
  return canvasTexture((ctx)=>{
    ctx.fillStyle='rgba(212,213,208,.19)';
    ctx.fillRect(112,196,4,330);
    ctx.fillRect(116,196,88,2);
    ctx.fillStyle='rgba(223,224,218,.54)';
    ctx.beginPath();
    ctx.arc(116,196,7,0,Math.PI*2);
    ctx.fill();
    ctx.fillStyle='rgba(122,127,128,.66)';
    ctx.font='500 22px Inter, Arial, sans-serif';
    ctx.fillText(`R5 · ${String(index+1).padStart(2,'0')}`,116,566);
  });
}

const surfaces = [];
function createLayer(texture,geometry,materialProps={}){
  const material = new THREE.MeshStandardMaterial({
    map:texture,
    color:0xffffff,
    roughness:.30,
    metalness:.76,
    transparent:true,
    opacity:0,
    depthWrite:false,
    side:THREE.DoubleSide,
    envMapIntensity:.54,
    ...materialProps
  });
  const mesh = new THREE.Mesh(geometry,material);
  mesh.renderOrder=4;
  return mesh;
}
function addSurface(data,cfg){
  const group = new THREE.Group();
  group.position.set(...cfg.position);
  group.rotation.set(...cfg.rotation);
  const geo = new THREE.PlaneGeometry(cfg.width,cfg.height);
  const register = createLayer(registrationTexture(cfg.order),geo,{metalness:.62,roughness:.4});
  const family = createLayer(familyTexture(data),geo);
  const vendor = createLayer(vendorTexture(data),geo,{metalness:.64,roughness:.36});
  register.position.z = 0;
  family.position.z = .004;
  vendor.position.z = .008;
  group.add(register,family,vendor);

  const hitMat = new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide});
  const hit = new THREE.Mesh(new THREE.PlaneGeometry(cfg.width*.96,cfg.height*.92),hitMat);
  hit.position.z=.014;
  hit.userData.surfaceKey=data.key;
  hit.renderOrder=7;
  group.add(hit);
  root.add(group);
  surfaces.push({data,group,register,family,vendor,hit,cfg});
}
addSurface(LABELS[0],{order:0,width:2.86,height:1.38,position:[-.12,.10,1.414],rotation:[0,0,0]});
addSurface(LABELS[1],{order:1,width:2.26,height:1.20,position:[1.682,-.02,.03],rotation:[0,Math.PI/2,0]});
addSurface(LABELS[2],{order:2,width:2.62,height:1.64,position:[-.04,1.105,-.05],rotation:[-Math.PI/2,0,0]});
addSurface(LABELS[3],{order:3,width:2.20,height:1.18,position:[-1.712,-.02,.02],rotation:[0,-Math.PI/2,0]});

for(let i=0;i<5;i++){
  const vent = new THREE.Mesh(new THREE.BoxGeometry(.018,.055,.52),darkCutMaterial);
  vent.position.set(1.692,-.65+i*.10,-.76);
  root.add(vent);
}
for(let i=0;i<3;i++){
  const groove = new THREE.Mesh(new THREE.BoxGeometry(.48,.014,.018),darkCutMaterial);
  groove.position.set(.92-i*.17,1.117,-.92);
  groove.rotation.x=-Math.PI/2;
  root.add(groove);
}

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(13,9),
  new THREE.ShadowMaterial({color:0x000000,opacity:.42,transparent:true})
);
ground.rotation.x=-Math.PI/2;
ground.position.y=-1.285;
ground.receiveShadow=true;
scene.add(ground);

const key = new THREE.SpotLight(0xf4f1e8,620,18,Math.PI*.19,.62,1.35);
key.position.set(-3.6,5.8,5.5);
key.target.position.set(.2,.15,0);
key.castShadow=true;
key.shadow.mapSize.set(coarsePointer?1024:1536,coarsePointer?1024:1536);
key.shadow.bias=-.00032;
scene.add(key,key.target);

const rim = new THREE.SpotLight(0xcbd2d7,360,16,Math.PI*.22,.72,1.5);
rim.position.set(4.8,2.2,-3.4);
rim.target.position.set(0,.15,0);
scene.add(rim,rim.target);

const fill = new THREE.PointLight(0xa9b0b6,28,12,2);
fill.position.set(-3.4,-.3,4.1);
scene.add(fill);

const warm = new THREE.PointLight(0xe6ddd0,22,10,2);
warm.position.set(3.0,2.9,3.0);
scene.add(warm);

const POSES = {
  final:{x:.105,y:-.54,z:.016},
  models:{x:-.045,y:-.10,z:0},
  automation:{x:-.055,y:-1.18,z:.012},
  communication:{x:.80,y:-.40,z:0},
  build:{x:-.05,y:1.18,z:-.01}
};
let activePose='final';
let tweenSerial=0;

const clamp01=v=>Math.max(0,Math.min(1,v));
const easeOutCubic=t=>1-Math.pow(1-t,3);
const easeInOutCubic=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
function windowFade(t,a,b){return easeOutCubic(clamp01((t-a)/(b-a)))}

function applyLayout(){
  const w=stage.clientWidth||800;
  const h=stage.clientHeight||650;
  renderer.setSize(w,h,false);
  camera.aspect=w/h;

  const mobile = w < 560;
  const landscape = h < 500 && w > h;
  if (landscape){
    camera.fov=29;
    camera.position.set(.05,.82,7.35);
    rig.position.set(.16,-.01,0);
    rig.scale.setScalar(.88);
  } else if (mobile){
    camera.fov=31;
    camera.position.set(.06,.72,8.75);
    rig.position.set(.02,-.10,0);
    rig.scale.setScalar(.92);
  } else {
    camera.fov=31;
    camera.position.set(.06,1.05,7.55);
    rig.position.set(.10,-.02,0);
    rig.scale.setScalar(1);
  }
  camera.lookAt(0,-.08,0);
  camera.updateProjectionMatrix();
  render();
}
function render(){renderer.render(scene,camera)}

function animatePose(name,duration=720){
  const target=POSES[name]||POSES.final;
  const from={x:root.rotation.x,y:root.rotation.y,z:root.rotation.z};
  const serial=++tweenSerial;
  const start=performance.now();
  activePose=name;
  syncButtons(name);
  function frame(now){
    if(serial!==tweenSerial)return;
    const p=clamp01(duration?((now-start)/duration):1);
    const e=easeInOutCubic(p);
    root.rotation.x=THREE.MathUtils.lerp(from.x,target.x,e);
    root.rotation.y=THREE.MathUtils.lerp(from.y,target.y,e);
    root.rotation.z=THREE.MathUtils.lerp(from.z,target.z,e);
    render();
    if(p<1)requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
function syncButtons(name){
  const normalized=name==='final'?'models':name;
  document.querySelectorAll('[data-r5-face]').forEach(b=>{
    b.setAttribute('aria-pressed',String(b.dataset.r5Face===normalized));
  });
}

function finishStill(){
  bodyMaterial.opacity=1;
  bodyMaterial.transparent=false;
  root.scale.setScalar(1);
  root.position.set(0,0,0);
  root.rotation.set(POSES.final.x,POSES.final.y,POSES.final.z);
  surfaces.forEach(s=>{
    s.register.material.opacity=.72;
    s.family.material.opacity=.96;
    s.vendor.material.opacity=.86;
  });
  activePose='final';
  syncButtons('final');
  render();
  stage.dispatchEvent(new CustomEvent('r5:rest'));
  document.documentElement.dataset.r5State='rest';
}
function intro(){
  if(reducedMotion){finishStill();return}
  document.documentElement.dataset.r5State='intro';
  bodyMaterial.opacity=0;
  root.scale.setScalar(.82);
  root.position.set(.02,-.17,0);
  root.rotation.set(-.18,-1.10,-.045);
  surfaces.forEach(s=>{
    s.register.material.opacity=0;
    s.family.material.opacity=0;
    s.vendor.material.opacity=0;
  });
  const start=performance.now();
  const duration=3900;
  function frame(now){
    const t=clamp01((now-start)/duration);
    const orient=easeInOutCubic(windowFade(t,.12,.60));
    const settle=easeInOutCubic(windowFade(t,.67,1));
    const target=POSES.final;
    bodyMaterial.opacity=windowFade(t,0,.22);
    const scale=THREE.MathUtils.lerp(.82,1,easeOutCubic(windowFade(t,.02,.42)));
    root.scale.setScalar(scale);
    root.position.y=THREE.MathUtils.lerp(-.17,0,easeOutCubic(windowFade(t,.03,.40)));
    root.rotation.x=THREE.MathUtils.lerp(-.18,target.x,orient);
    root.rotation.y=THREE.MathUtils.lerp(-1.10,target.y,orient);
    root.rotation.z=THREE.MathUtils.lerp(-.045,target.z,settle);

    surfaces.forEach((s,i)=>{
      const stagger=i*.035;
      s.register.material.opacity=.72*windowFade(t,.34+stagger,.53+stagger);
      s.family.material.opacity=.96*windowFade(t,.48+stagger,.68+stagger);
      s.vendor.material.opacity=.86*windowFade(t,.61+stagger,.82+stagger);
    });
    render();
    if(t<1)requestAnimationFrame(frame); else finishStill();
  }
  requestAnimationFrame(frame);
}

const raycaster=new THREE.Raycaster();
const pointer=new THREE.Vector2();
function raySurface(ev){
  const r=renderer.domElement.getBoundingClientRect();
  pointer.x=((ev.clientX-r.left)/r.width)*2-1;
  pointer.y=-((ev.clientY-r.top)/r.height)*2+1;
  raycaster.setFromCamera(pointer,camera);
  return raycaster.intersectObjects(surfaces.map(s=>s.hit),false)[0]?.object?.userData?.surfaceKey||null;
}
let hoverKey=null;
renderer.domElement.addEventListener('pointermove',ev=>{
  if(coarsePointer||document.documentElement.dataset.r5State!=='rest')return;
  const key=raySurface(ev);
  if(key===hoverKey)return;
  hoverKey=key;
  renderer.domElement.style.cursor=key?'crosshair':'default';
  if(key){
    const target=POSES[key]||POSES.final;
    POSES.__hover={
      x:THREE.MathUtils.lerp(POSES.final.x,target.x,.18),
      y:THREE.MathUtils.lerp(POSES.final.y,target.y,.18),
      z:THREE.MathUtils.lerp(POSES.final.z,target.z,.18)
    };
    animatePose('__hover',420);
  }else{
    animatePose('final',520);
  }
},{passive:true});
renderer.domElement.addEventListener('pointerleave',()=>{
  if(coarsePointer||!hoverKey)return;
  hoverKey=null;
  renderer.domElement.style.cursor='default';
  animatePose('final',560);
},{passive:true});
renderer.domElement.addEventListener('pointerup',ev=>{
  if(!coarsePointer||document.documentElement.dataset.r5State!=='rest')return;
  const key=raySurface(ev);
  if(key)animatePose(key,650);
},{passive:true});

document.querySelectorAll('[data-r5-face]').forEach(btn=>{
  btn.addEventListener('click',()=>animatePose(btn.dataset.r5Face,coarsePointer?600:720));
});

const resizeObserver=new ResizeObserver(applyLayout);
resizeObserver.observe(stage);

async function boot(){
  try{await document.fonts.ready}catch{}
  applyLayout();
  intro();
}
boot();

window.__PROAI_R5__={
  version:'R5-monolith',
  get state(){return document.documentElement.dataset.r5State||'boot'},
  pose:name=>animatePose(name,0),
  render,
  labels:LABELS.map(x=>({...x}))
};
