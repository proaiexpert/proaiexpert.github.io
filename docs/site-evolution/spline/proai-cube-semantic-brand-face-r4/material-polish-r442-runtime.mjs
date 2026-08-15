import fs from 'node:fs';

const file = new URL('./main.generated.js', import.meta.url);
let source = fs.readFileSync(file, 'utf8');

const call = 'createSemanticR44PlanarFaceGeometry(mesh,mesh.geometry,face)';
const replacementCall = 'createSemanticR442PlanarFaceGeometry(mesh,mesh.geometry,face)';
const callAt = source.indexOf(call);
if (callAt < 0 || source.indexOf(call, callAt + call.length) >= 0) {
  throw new Error(`R4.4.2 runtime planar call anchor invalid: ${callAt}`);
}

const anchor = 'function semanticR442FaceTileCoords(face,logical){';
const anchorAt = source.indexOf(anchor);
if (anchorAt < 0 || source.indexOf(anchor, anchorAt + anchor.length) >= 0) {
  throw new Error(`R4.4.2 runtime planar injection anchor invalid: ${anchorAt}`);
}

const helper = `function createSemanticR442PlanarFaceGeometry(mesh,sourceGeometry,face='+Z'){const geometry=sourceGeometry.clone(),position=geometry.getAttribute('position');if(!position)throw new Error('R4.4.2 engraved face missing positions');sceneOne.updateMatrixWorld(true);mesh.updateMatrixWorld(true);const xy=new Float32Array(position.count*2),p=new THREE.Vector3();let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;for(let i=0;i<position.count;i++){p.fromBufferAttribute(position,i);mesh.localToWorld(p);sceneOne.worldToLocal(p);let u=p.x,v=p.y;if(face==='+X'){u=-p.z;v=p.y}else if(face==='-X'){u=p.z;v=p.y}xy[i*2]=u;xy[i*2+1]=v;minX=Math.min(minX,u);maxX=Math.max(maxX,u);minY=Math.min(minY,v);maxY=Math.max(maxY,v)}const spanX=Math.max(1e-6,maxX-minX),spanY=Math.max(1e-6,maxY-minY),uv=new Float32Array(position.count*2);for(let i=0;i<position.count;i++){uv[i*2]=THREE.MathUtils.clamp((xy[i*2]-minX)/spanX,0,1);uv[i*2+1]=THREE.MathUtils.clamp((xy[i*2+1]-minY)/spanY,0,1)}geometry.setAttribute('uv',new THREE.BufferAttribute(uv,2));geometry.userData.semanticR442PlanarUv={face,projection:face==='+Z'?'sceneOne XY':face==='+X'?'sceneOne -ZY':'sceneOne ZY',spanX,spanY};return geometry}\n`;

source = source.slice(0, anchorAt) + helper + source.slice(anchorAt);
source = source.replace(call, replacementCall);

for (const required of [
  'function createSemanticR442PlanarFaceGeometry(',
  'createSemanticR442PlanarFaceGeometry(mesh,mesh.geometry,face)',
  "SEMANTIC_R442_ELIGIBLE_FACES=Object.freeze(['+Z','+X','-X'])",
  'semanticVelocityMultiplier: 1.0',
  'const deltaMs=wallDeltaMs',
  'overlayTextRendered:false',
  'alphaDominantReveal:false',
  'semanticMotionCoupled:false',
  'semanticOrientationForcing:false',
]) if (!source.includes(required)) throw new Error(`R4.4.2 runtime hotfix missing invariant: ${required}`);

fs.writeFileSync(file, source);
console.log('R4.4.2 runtime planar-scope hotfix applied');
