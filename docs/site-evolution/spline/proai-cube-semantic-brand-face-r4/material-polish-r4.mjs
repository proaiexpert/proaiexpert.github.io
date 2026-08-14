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

// R4.4 stays a narrow material/mapping calibration layer over the exact frozen
// R4.3 implementation. R4.3 therefore remains executable and byte-addressable
// as the rollback source while this pass cannot accidentally rewrite motion UX.
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

// Candidate 1 (-0.105 / 0.690) remained visually unreadable even at measured
// alignment 1.000 in the public browser. R4.4 therefore moves to the next
// physically plausible calibration level and fixes material-coordinate fidelity:
// the physical +Z face receives its own planar UV projection, so the engraving
// maps address the actual tile surface rather than inheriting any source-atlas UV.
// A restrained darker recess multiplier is now allowed as the specified last
// resort; it is persistent, near-tonal, and never becomes a flat Silver fill.
replaceOne(
  'bumpScale:-0.060,roughnessMapInk:0.855,metalnessDelta:0.0',
  'bumpScale:-0.130,roughnessMapInk:0.550,metalnessDelta:0.0,tonalInk:0.820',
  'micro-normal roughness and tonal calibration',
);
replaceOne(
  "driver:'actual outward +Z cubie MeshPhysicalMaterial BRDF + persistent bump micro-normal + static roughness/clearcoat-roughness micro-treatment; diagnostics observe face normal + camera view + stable key RectAreaLight half-vector only'",
  "driver:'R4.4 calibrated actual outward +Z cubie MeshPhysicalMaterial BRDF + local planar face material coordinates + persistent bump micro-normal (-0.130) + roughness/clearcoat-roughness ink (0.550) + restrained recess tonal multiplier (0.820); stable studio lighting only; diagnostics observe face normal + camera view + stable key RectAreaLight half-vector only'",
  'physical driver metadata',
);

const oldMaterialFactory = "function createPhysicalEngravedMaterial(baseMaterial,maskTexture,roughnessTexture){const m=baseMaterial.clone();m.name=`R4_3_PHYSICAL_MICRO_ENGRAVED_${baseMaterial.name||'FACE'}`;m.bumpMap=maskTexture;m.bumpScale=SEMANTIC_R4_3_ENGRAVING.bumpScale;m.roughnessMap=roughnessTexture;if('clearcoatRoughnessMap' in m)m.clearcoatRoughnessMap=roughnessTexture;m.userData.semanticMaterial='SEMANTIC_R4_3_PERSISTENT_PHYSICAL_MICRO_ENGRAVING';m.userData.semanticTileMask=maskTexture;m.userData.semanticRoughnessMap=roughnessTexture;m.needsUpdate=true;return m}";
const calibratedMaterialFactory = `function createSemanticR44PlanarFaceGeometry(sourceGeometry){const geometry=sourceGeometry.clone(),position=geometry.getAttribute('position');if(!position)throw new Error('R4.4 engraved face missing positions');geometry.computeBoundingBox();const box=geometry.boundingBox,minX=box.min.x,maxX=box.max.x,minY=box.min.y,maxY=box.max.y,spanX=Math.max(1e-6,maxX-minX),spanY=Math.max(1e-6,maxY-minY),uv=new Float32Array(position.count*2);for(let i=0;i<position.count;i++){uv[i*2]=THREE.MathUtils.clamp((position.getX(i)-minX)/spanX,0,1);uv[i*2+1]=THREE.MathUtils.clamp((position.getY(i)-minY)/spanY,0,1)}geometry.setAttribute('uv',new THREE.BufferAttribute(uv,2));geometry.userData.semanticR44PlanarUv={axis:'local XY on physical +Z face',spanX,spanY};return geometry}
function createSemanticR44ToneTile(maskTexture){const src=maskTexture.image,size=src.width,canvas=document.createElement('canvas'),ink=document.createElement('canvas');canvas.width=size;canvas.height=size;ink.width=size;ink.height=size;const ctx=canvas.getContext('2d',{alpha:false}),ic=ink.getContext('2d',{alpha:true});ctx.fillStyle='#ffffff';ctx.fillRect(0,0,size,size);ic.clearRect(0,0,size,size);ic.drawImage(src,0,0);ic.globalCompositeOperation='source-in';const v=Math.round(255*SEMANTIC_R4_3_ENGRAVING.tonalInk);ic.fillStyle=\`rgb(\${v},\${v},\${v})\`;ic.fillRect(0,0,size,size);ctx.drawImage(ink,0,0);const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;t.minFilter=THREE.LinearFilter;t.magFilter=THREE.LinearFilter;t.generateMipmaps=true;t.needsUpdate=true;return t}
function createPhysicalEngravedMaterial(mesh,baseMaterial,maskTexture,roughnessTexture){mesh.geometry=createSemanticR44PlanarFaceGeometry(mesh.geometry);const toneTexture=createSemanticR44ToneTile(maskTexture),m=baseMaterial.clone();m.name=\`R4_4_PHYSICAL_MICRO_ENGRAVED_\${baseMaterial.name||'FACE'}\`;m.bumpMap=maskTexture;m.bumpScale=SEMANTIC_R4_3_ENGRAVING.bumpScale;m.roughnessMap=roughnessTexture;if('clearcoatRoughnessMap' in m)m.clearcoatRoughnessMap=roughnessTexture;if(!baseMaterial.map)m.map=toneTexture;else toneTexture.dispose();m.userData.semanticMaterial='SEMANTIC_R4_4_PERSISTENT_PHYSICAL_MICRO_ENGRAVING';m.userData.semanticTileMask=maskTexture;m.userData.semanticRoughnessMap=roughnessTexture;m.userData.semanticTonalMap=!baseMaterial.map;m.userData.semanticPlanarUv=true;m.needsUpdate=true;return m}`;
replaceOne(oldMaterialFactory, calibratedMaterialFactory, 'physical engraved material factory');
replaceOne(
  'const material=createPhysicalEngravedMaterial(mesh.material,mask,rough);mesh.material=material;',
  'const material=createPhysicalEngravedMaterial(mesh,mesh.material,mask,rough);mesh.material=material;',
  'physical material installation call',
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
]) if (!source.includes(required)) throw new Error(`R4.4 missing invariant/calibration: ${required}`);

fs.writeFileSync(generatedFile, source);
console.log('R4.4 physical engraving readability calibration applied');
console.log('R4.3 rollback:', R43_SHA);
console.log('bumpScale:', '-0.130');
console.log('roughnessMapInk:', '0.550');
console.log('tonalInk:', '0.820');
console.log('material coordinates:', 'local planar +Z face UV');
