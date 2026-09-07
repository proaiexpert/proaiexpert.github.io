import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SOURCE = path.resolve(ROOT, '../proai-cube-threejs-mechanical-r0/rubik_39_s_cube_animation.glb');
const TARGET = path.join(ROOT, 'rubik_39_s_cube_animation.glb');
const EXPECTED_BYTES = 279412;

function sha256(filepath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filepath)).digest('hex');
}

if (!fs.existsSync(SOURCE)) throw new Error(`Stable R0 GLB not found: ${SOURCE}`);
if (fs.statSync(SOURCE).size !== EXPECTED_BYTES) {
  throw new Error(`Unexpected R0 GLB size: ${fs.statSync(SOURCE).size}`);
}
const sourceHash = sha256(SOURCE);
if (!fs.existsSync(TARGET) || sha256(TARGET) !== sourceHash) fs.copyFileSync(SOURCE, TARGET);
const targetHash = sha256(TARGET);
if (targetHash !== sourceHash || fs.statSync(TARGET).size !== EXPECTED_BYTES) {
  throw new Error('Motion R1 GLB copy does not exactly match the stable R0 source');
}
console.log(JSON.stringify({ bytes: EXPECTED_BYTES, sha256: targetHash }, null, 2));
