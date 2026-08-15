import fs from 'node:fs';

const file = new URL('./main.generated.js', import.meta.url);
let source = fs.readFileSync(file, 'utf8');

const replaceUnique = (find,replacement,label)=>{const at=source.indexOf(find),next=at>=0?source.indexOf(find,at+find.length):-1;if(at<0||next>=0)throw new Error(`R4.4.2 runtime ${label}: ${at}/${next}`);source=source.slice(0,at)+replacement+source.slice(at+find.length)};

const anchor='function semanticR442FaceTileCoords(face,logical){';
const anchorAt=source.indexOf(anchor);
if(anchorAt<0||source.indexOf(anchor,anchorAt+anchor.length)>=0)throw new Error(`R4.4.2 runtime helper anchor invalid: ${anchorAt}`);

const helpers=`function createSemanticR442PlanarFaceGeometry(mesh,sourceGeometry,face='+Z'){const geometry=sourceGeometry.clone(),position=geometry.getAttribute('position');if(!position)throw new Error('R4.4.2 engraved face missing positions');sceneOne.updateMatrixWorld(true);mesh.updateMatrixWorld(true);const xy=new Float32Array(position.count*2),p=new THREE.Vector3();let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;for(let i=0;i<position.count;i++){p.fromBufferAttribute(position,i);mesh.localToWorld(p);sceneOne.worldToLocal(p);let u=p.x,v=p.y;if(face==='+X'){u=-p.z;v=p.y}else if(face==='-X'){u=p.z;v=p.y}xy[i*2]=u;xy[i*2+1]=v;minX=Math.min(minX,u);maxX=Math.max(maxX,u);minY=Math.min(minY,v);maxY=Math.max(maxY,v)}const spanX=Math.max(1e-6,maxX-minX),spanY=Math.max(1e-6,maxY-minY),uv=new Float32Array(position.count*2);for(let i=0;i<position.count;i++){uv[i*2]=THREE.MathUtils.clamp((xy[i*2]-minX)/spanX,0,1);uv[i*2+1]=THREE.MathUtils.clamp((xy[i*2+1]-minY)/spanY,0,1)}geometry.setAttribute('uv',new THREE.BufferAttribute(uv,2));geometry.userData.semanticR442PlanarUv={face,projection:face==='+Z'?'sceneOne XY':face==='+X'?'sceneOne -ZY':'sceneOne ZY',spanX,spanY};return geometry}\nfunction createSemanticR442BevelTile(maskTexture){const src=maskTexture.image,size=src.width,canvas=document.createElement('canvas');canvas.width=size;canvas.height=size;const ctx=canvas.getContext('2d',{alpha:false});ctx.fillStyle='#000000';ctx.fillRect(0,0,size,size);ctx.save();ctx.filter='blur(5px)';ctx.globalAlpha=.74;ctx.drawImage(src,0,0);ctx.restore();ctx.globalAlpha=.26;ctx.drawImage(src,0,0);ctx.globalAlpha=1;const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.NoColorSpace;t.minFilter=THREE.LinearFilter;t.magFilter=THREE.LinearFilter;t.generateMipmaps=true;t.needsUpdate=true;t.userData.semanticR44BeveledBump=true;t.userData.semanticR442BeveledBump=true;return t}\nfunction createSemanticR442ToneTile(maskTexture){const src=maskTexture.image,size=src.width,canvas=document.createElement('canvas'),ink=document.createElement('canvas');canvas.width=size;canvas.height=size;ink.width=size;ink.height=size;const ctx=canvas.getContext('2d',{alpha:false}),ic=ink.getContext('2d',{alpha:true});ctx.fillStyle='#ffffff';ctx.fillRect(0,0,size,size);ic.clearRect(0,0,size,size);ic.drawImage(src,0,0);ic.globalCompositeOperation='source-in';const v=Math.round(255*SEMANTIC_R4_3_ENGRAVING.tonalInk);ic.fillStyle='rgb('+v+','+v+','+v+')';ic.fillRect(0,0,size,size);ctx.drawImage(ink,0,0);const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;t.minFilter=THREE.LinearFilter;t.magFilter=THREE.LinearFilter;t.generateMipmaps=true;t.needsUpdate=true;t.userData.semanticR442Tone=true;return t}\n`;
source=source.slice(0,anchorAt)+helpers+source.slice(anchorAt);

replaceUnique('createSemanticR44PlanarFaceGeometry(mesh,mesh.geometry,face)','createSemanticR442PlanarFaceGeometry(mesh,mesh.geometry,face)','planar call');
replaceUnique('createSemanticR44BevelTile(maskTexture)','createSemanticR442BevelTile(maskTexture)','bevel call');
replaceUnique('createSemanticR44ToneTile(maskTexture)','createSemanticR442ToneTile(maskTexture)','tone call');

// A semantic material must never remain visible after its optical protection has ended.
// This preserves zero tearing without keeping any physical face protected outside the
// consciously readable approach/read/exit envelope.
const oldRelease="semanticR442State.releaseCount++;return true}";
const newRelease="semanticR442State.releaseCount++;semanticR442SetActiveMaterialFace(null);semanticR442State.activeMaterialFace=null;return true}";
replaceUnique(oldRelease,newRelease,'release material dormancy');

// Do not pre-activate a semantic face before protection. Best-face scoring remains live,
// but the physical engraving only becomes optically active when the strong enter gate wins.
const oldApproach="if(best.rawQuality>=SEMANTIC_R442_QUALITY.approachScore&&best.viewAlignment>=SEMANTIC_R442_QUALITY.exitView&&best.assembled){if(semanticR442ActiveMaterialFace!==best.face)semanticR442SetActiveMaterialFace(best.face);semanticR442State.activeMaterialFace=best.face}else if(semanticR442ActiveMaterialFace&&best.rawQuality<SEMANTIC_R442_QUALITY.materialDormantScore){semanticR442SetActiveMaterialFace(null);semanticR442State.activeMaterialFace=null}if(now<semanticR442State.nextEligiblePresentationMs)return;";
replaceUnique(oldApproach,"if(!semanticR442State.protected&&semanticR442ActiveMaterialFace!==null){semanticR442SetActiveMaterialFace(null);semanticR442State.activeMaterialFace=null}if(now<semanticR442State.nextEligiblePresentationMs)return;",'pre-protection dormancy');

for(const required of[
 'function createSemanticR442PlanarFaceGeometry(',
 'function createSemanticR442BevelTile(',
 'function createSemanticR442ToneTile(',
 'createSemanticR442PlanarFaceGeometry(mesh,mesh.geometry,face)',
 'createSemanticR442BevelTile(maskTexture)',
 'createSemanticR442ToneTile(maskTexture)',
 "SEMANTIC_R442_ELIGIBLE_FACES=Object.freeze(['+Z','+X','-X'])",
 'semanticR442SetActiveMaterialFace(null);semanticR442State.activeMaterialFace=null;return true',
 'semanticVelocityMultiplier: 1.0','const deltaMs=wallDeltaMs','overlayTextRendered:false','alphaDominantReveal:false','semanticMotionCoupled:false','semanticOrientationForcing:false'
])if(!source.includes(required))throw new Error(`R4.4.2 runtime hotfix missing invariant: ${required}`);
for(const forbidden of['createSemanticR44PlanarFaceGeometry(mesh,mesh.geometry,face)','createSemanticR44BevelTile(maskTexture)','createSemanticR44ToneTile(maskTexture)'])if(source.includes(forbidden))throw new Error(`R4.4.2 unresolved R4.4 helper dependency: ${forbidden}`);

fs.writeFileSync(file,source);
console.log('R4.4.2 self-contained physical helper scope + prompt release dormancy applied');
