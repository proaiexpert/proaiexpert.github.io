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

// R4.4 is deliberately a narrow calibration layer over the exact frozen R4.3
// product implementation. This keeps f4f4... as an executable rollback source
// while preventing the calibration pass from re-authoring motion or semantic UX.
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
  execFileSync(process.execPath, [baselineTemp], {
    cwd: here,
    stdio: 'inherit',
  });
} finally {
  fs.rmSync(baselineTemp, { force: true });
}

let source = fs.readFileSync(generatedFile, 'utf8');

const replaceOne = (find, replacement, label) => {
  const first = source.indexOf(find);
  const second = first >= 0 ? source.indexOf(find, first + find.length) : -1;
  if (first < 0 || second >= 0) {
    throw new Error(`R4.4 calibration anchor ${label}: first=${first} second=${second}`);
  }
  source = source.slice(0, first) + replacement + source.slice(first + find.length);
};

// Calibrated inside the requested physically plausible range. The stronger
// negative bump increases engraved wall/edge normal response, while the lower
// roughness multiplier creates a restrained BRDF separation inside the same
// Black Chrome / Graphite material family. No opacity, color fill, emissive,
// semantic light event, or motion term is introduced.
replaceOne(
  'bumpScale:-0.060,roughnessMapInk:0.855,metalnessDelta:0.0',
  'bumpScale:-0.105,roughnessMapInk:0.690,metalnessDelta:0.0',
  'micro-normal + roughness calibration',
);
replaceOne(
  "driver:'actual outward +Z cubie MeshPhysicalMaterial BRDF + persistent bump micro-normal + static roughness/clearcoat-roughness micro-treatment; diagnostics observe face normal + camera view + stable key RectAreaLight half-vector only'",
  "driver:'R4.4 calibrated actual outward +Z cubie MeshPhysicalMaterial BRDF + persistent bump micro-normal (-0.105) + seam-aware roughness/clearcoat-roughness multiplier (0.690); stable studio lighting only; diagnostics observe face normal + camera view + stable key RectAreaLight half-vector only'",
  'physical driver metadata',
);
replaceOne(
  "m.name=`R4_3_PHYSICAL_MICRO_ENGRAVED_${baseMaterial.name||'FACE'}`",
  "m.name=`R4_4_PHYSICAL_MICRO_ENGRAVED_${baseMaterial.name||'FACE'}`",
  'material name',
);
replaceOne(
  "m.userData.semanticMaterial='SEMANTIC_R4_3_PERSISTENT_PHYSICAL_MICRO_ENGRAVING'",
  "m.userData.semanticMaterial='SEMANTIC_R4_4_PERSISTENT_PHYSICAL_MICRO_ENGRAVING'",
  'material diagnostic name',
);

// Guard the R4.3 architectural invariants that R4.4 is forbidden to alter.
const forbidden = [
  ['wallDeltaMs * semanticTimeScale', 'motion scale multiplication'],
  ['emissiveIntensity', 'emissive lettering'],
  ['SEMANTIC_R4_2_TEXT', 'R4.2 text-overlay material'],
];
for (const [needle, label] of forbidden) {
  if (source.includes(needle)) throw new Error(`R4.4 forbidden regression: ${label}`);
}
for (const required of [
  'semanticVelocityMultiplier: 1.0',
  'const deltaMs=wallDeltaMs',
  'overlayTextRendered:false',
  'alphaDominantReveal:false',
  'semanticMotionCoupled:false',
  'semanticOrientationForcing:false',
  'physicalEngravedLogicalTileCount',
]) {
  if (!source.includes(required)) throw new Error(`R4.4 missing R4.3 invariant: ${required}`);
}

fs.writeFileSync(generatedFile, source);
console.log('R4.4 physical engraving readability calibration applied');
console.log('R4.3 rollback:', R43_SHA);
console.log('bumpScale:', '-0.105');
console.log('roughnessMapInk:', '0.690');
