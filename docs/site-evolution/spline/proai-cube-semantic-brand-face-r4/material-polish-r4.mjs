import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const R43_SHA = 'f4f4bfa34f38eb99b2e99cff941a7f7895e82d9a';
const PRODUCT_PATH = 'docs/site-evolution/spline/proai-cube-semantic-brand-face-r4/material-polish-r4.mjs';
const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '../../../..');
const baselineTemp = path.join(here, '.material-polish-r43-baseline.tmp.mjs');
const generatedFile = path.join(here, 'main.generated.js');

// R4.4 is deliberately a narrow material-only calibration over the exact frozen
// R4.3 product. The rollback commit remains byte-addressable and executable while
// this pass is forbidden from changing semantic motion, orientation, or overlays.
let baseline;
try {
  baseline = execFileSync('git', ['show', `${R43_SHA}:${PRODUCT_PATH}`], {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
  });
} catch (error) {
  throw new Error(`R4.4 requires reachable frozen R4.3 ${R43_SHA}: ${error.message}`);
}

fs.writeFileSync(baselineTemp, baseline);
try {
  execFileSync(process.execPath, [baselineTemp], { cwd: here, stdio: 'inherit' });
} finally {
  fs.rmSync(baselineTemp, { force: true });
}

let source = fs.readFileSync(generatedFile, 'utf8');

const replaceOne = (find, replacement, label) => {
  const first = source.indexOf(find);
  const second = first >= 0 ? source.indexOf(find, first + find.length) : -1;
  if (first < 0 || second >= 0) throw new Error(`R4.4 calibration anchor ${label}: first=${first} second=${second}`);
  source = source.slice(0, first) + replacement + source.slice(first + find.length);
};

// Final R4.4 material calibration. The physical +Z face receives local planar
// material coordinates, a softened micro-bevel height profile, stronger BRDF
// roughness separation, and a restrained persistent recess tone. There is no
// temporal driver: readability still comes only from face/light/view geometry.
replaceOne(
  'bumpScale:-0.060,roughnessMapInk:0.855,metalnessDelta:0.0',
  'bumpScale:-0.130,roughnessMapInk:0.550,metalnessDelta:0.0,tonalInk:0.820',
  'micro-normal roughness and tonal calibration',
);
replaceOne(
  "driver:'actual outward +Z cubie MeshPhysicalMaterial BRDF + persistent bump micro-normal + static roughness/clearcoat-roughness micro-treatment; diagnostics observe face normal + camera view + stable key RectAreaLight half-vector only'",
  "driver:'R4.4 calibrated actual outward +Z cubie MeshPhysicalMaterial BRDF + local planar face coordinates + persistent softened machined-edge bump (-0.130) + roughness/clearcoat-roughness ink (0.550) + restrained recess tonal multiplier (0.820); stable studio lighting only; front-facing signed optical diagnostics; zero timeline driver'",
  'physical driver metadata',
);

const oldMaterialFactory = "function createPhysicalEngravedMaterial(baseMaterial,maskTexture,roughnessTexture){const m=baseMaterial.clone();m.name=`R4_3_PHYSICAL_MICRO_ENGRAVED_${baseMaterial.name||'FACE'}`;m.bumpMap=maskTexture;m.bumpScale=SEMANTIC_R4_3_ENGRAVING.bumpScale;m.roughnessMap=roughnessTexture;if('clearcoatRoughnessMap' in m)m.clearcoatRoughnessMap=roughnessTexture;m.userData.semanticMaterial='SEMANTIC_R4_3_PERSISTENT_PHYSICAL_MICRO_ENGRAVING';m.userData.semanticTileMask=maskTexture;m.userData.semanticRoughnessMap=roughnessTexture;m.needsUpdate=true;return m}";
const calibratedMaterialFactory = `function createSemanticR44PlanarFaceGeometry(sourceGeometry){const geometry=sourceGeometry.clone(),position=geometry.getAttribute('position');if(!position)throw new Error('R4.4 engraved face missing positions');geometry.computeBoundingBox();const box=geometry.boundingBox,minX=box.min.x,maxX=box.max.x,minY=box.min.y,maxY=box.max.y,spanX=Math.max(1e-6,maxX-minX),spanY=Math.max(1e-6,maxY-minY),uv=new Float32Array(position.count*2);for(let i=0;i<position.count;i++){uv[i*2]=THREE.MathUtils.clamp((position.getX(i)-minX)/spanX,0,1);uv[i*2+1]=THREE.MathUtils.clamp((position.getY(i)-minY)/spanY,0,1)}geometry.setAttribute('uv',new THREE.BufferAttribute(uv,2));geometry.userData.semanticR44PlanarUv={axis:'local XY on physical +Z face',spanX,spanY};return geometry}
function createSemanticR44BevelTile(maskTexture){const src=maskTexture.image,size=src.width,canvas=document.createElement('canvas');canvas.width=size;canvas.height=size;const ctx=canvas.getContext('2d',{alpha:false});ctx.fillStyle='#000000';ctx.fillRect(0,0,size,size);ctx.save();ctx.filter='blur(5px)';ctx.globalAlpha=.74;ctx.drawImage(src,0,0);ctx.restore();ctx.globalAlpha=.26;ctx.drawImage(src,0,0);ctx.globalAlpha=1;const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.NoColorSpace;t.minFilter=THREE.LinearFilter;t.magFilter=THREE.LinearFilter;t.generateMipmaps=true;t.needsUpdate=true;t.userData.semanticR44BeveledBump=true;return t}
function createSemanticR44ToneTile(maskTexture){const src=maskTexture.image,size=src.width,canvas=document.createElement('canvas'),ink=document.createElement('canvas');canvas.width=size;canvas.height=size;ink.width=size;ink.height=size;const ctx=canvas.getContext('2d',{alpha:false}),ic=ink.getContext('2d',{alpha:true});ctx.fillStyle='#ffffff';ctx.fillRect(0,0,size,size);ic.clearRect(0,0,size,size);ic.drawImage(src,0,0);ic.globalCompositeOperation='source-in';const v=Math.round(255*SEMANTIC_R4_3_ENGRAVING.tonalInk);ic.fillStyle=\`rgb(\${v},\${v},\${v})\`;ic.fillRect(0,0,size,size);ctx.drawImage(ink,0,0);const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;t.minFilter=THREE.LinearFilter;t.magFilter=THREE.LinearFilter;t.generateMipmaps=true;t.needsUpdate=true;return t}
function createPhysicalEngravedMaterial(mesh,baseMaterial,maskTexture,roughnessTexture){mesh.geometry=createSemanticR44PlanarFaceGeometry(mesh.geometry);const bevelTexture=createSemanticR44BevelTile(maskTexture),toneTexture=createSemanticR44ToneTile(maskTexture),m=baseMaterial.clone();m.name=\`R4_4_PHYSICAL_MICRO_ENGRAVED_\${baseMaterial.name||'FACE'}\`;m.bumpMap=bevelTexture;m.bumpScale=SEMANTIC_R4_3_ENGRAVING.bumpScale;m.roughnessMap=roughnessTexture;if('clearcoatRoughnessMap' in m)m.clearcoatRoughnessMap=roughnessTexture;if(!baseMaterial.map)m.map=toneTexture;else toneTexture.dispose();m.userData.semanticMaterial='SEMANTIC_R4_4_PERSISTENT_PHYSICAL_MICRO_ENGRAVING';m.userData.semanticTileMask=maskTexture;m.userData.semanticBeveledBump=bevelTexture;m.userData.semanticRoughnessMap=roughnessTexture;m.userData.semanticTonalMap=!baseMaterial.map;m.userData.semanticPlanarUv=true;m.userData.semanticR44BeveledBump=true;m.needsUpdate=true;return m}`;
replaceOne(oldMaterialFactory, calibratedMaterialFactory, 'physical engraved material factory');
replaceOne(
  'const material=createPhysicalEngravedMaterial(mesh.material,mask,rough);mesh.material=material;',
  'const material=createPhysicalEngravedMaterial(mesh,mesh.material,mask,rough);mesh.material=material;',
  'physical material installation call',
);

// R4.3 used absolute dot products for review diagnostics, so a back-facing +Z
// face could score as a false optical peak. R4.4 records only genuinely visible,
// front-facing opportunities. This changes observation only, never orientation.
replaceOne(
  'const faceView=THREE.MathUtils.clamp(Math.abs(normal.dot(view)),0,1),halfDot=THREE.MathUtils.clamp(Math.abs(normal.dot(half)),0,1),spec=smootherstep',
  'const signedFaceView=normal.dot(view),signedHalfDot=normal.dot(half),faceView=THREE.MathUtils.clamp(signedFaceView,0,1),halfDot=THREE.MathUtils.clamp(signedHalfDot,0,1),spec=smootherstep',
  'front-facing signed optical metric',
);
replaceOne(
  'semanticR43OpticalDiagnostics={alignment,faceView,halfDot,fieldCenter:s.fieldCenter.toArray(),fieldAxis:s.axis.toArray(),opportunity:alignment,persistent:true,',
  'semanticR43OpticalDiagnostics={alignment,faceView,halfDot,signedFaceView,signedHalfDot,frontFacing:signedFaceView>0,fieldCenter:s.fieldCenter.toArray(),fieldAxis:s.axis.toArray(),opportunity:alignment,persistent:true,',
  'signed optical diagnostics payload',
);

// Guard every R4.3 architecture invariant that R4.4 is forbidden to alter.
const forbidden = [
  ['wallDeltaMs * semanticTimeScale', 'motion scale multiplication'],
  ['emissiveIntensity', 'emissive lettering'],
  ['SEMANTIC_R4_2_TEXT', 'R4.2 text-overlay material'],
];
for (const [needle, label] of forbidden) if (source.includes(needle)) throw new Error(`R4.4 forbidden regression: ${label}`);
for (const required of [
  'semanticVelocityMultiplier: 1.0',
  'const deltaMs=wallDeltaMs',
  'overlayTextRendered:false',
  'alphaDominantReveal:false',
  'semanticMotionCoupled:false',
  'semanticOrientationForcing:false',
  'physicalEngravedLogicalTileCount',
  'R4_4_PHYSICAL_MICRO_ENGRAVED_',
  'semanticPlanarUv=true',
  'semanticR44BeveledBump=true',
  'signedFaceView',
  'frontFacing:signedFaceView>0',
]) if (!source.includes(required)) throw new Error(`R4.4 missing invariant/calibration: ${required}`);

fs.writeFileSync(generatedFile, source);
console.log('R4.4 machined-edge engraving readability calibration applied');
console.log('R4.3 rollback:', R43_SHA);
console.log('bumpScale:', '-0.130');
console.log('roughnessMapInk:', '0.550');
console.log('clearcoat roughness map:', 'same persistent calibrated 0.550 ink field');
console.log('tonalInk:', '0.820');
console.log('micro-edge:', '5px softened bevel height + 26% hard core');
console.log('optical metric:', 'signed front-facing face/view + half-vector only');
