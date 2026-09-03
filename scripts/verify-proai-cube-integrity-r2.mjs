import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = process.env.PROAI_CUBE_ROOT
  ? resolve(process.env.PROAI_CUBE_ROOT)
  : fileURLToPath(new URL('../', import.meta.url));
const manifestPath = process.env.PROAI_CUBE_MANIFEST
  ? resolve(process.env.PROAI_CUBE_MANIFEST)
  : resolve(root, 'provenance/proai-cube/r1/integrity-manifest.json');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const failures = [];

function fail(message) {
  failures.push(message);
}

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex').toUpperCase();
}

function parseGlbJson(buffer) {
  const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  if (view.byteLength < 20 || view.getUint32(0, true) !== 0x46546c67 || view.getUint32(4, true) !== 2) {
    fail('production GLB is not a valid GLB 2.0 file');
    return null;
  }
  const jsonLength = view.getUint32(12, true);
  const jsonStart = 20;
  const jsonEnd = jsonStart + jsonLength;
  if (jsonEnd > view.byteLength) {
    fail('production GLB JSON chunk exceeds file bounds');
    return null;
  }
  try {
    return JSON.parse(Buffer.from(buffer.subarray(jsonStart, jsonEnd)).toString('utf8').trim());
  } catch (error) {
    fail(`production GLB JSON chunk is invalid: ${error.message}`);
    return null;
  }
}

if (manifest.schema !== 'proai.asset.integrity.v1') fail('manifest schema mismatch');
if (!['owner-review', 'implementation-preview'].includes(manifest.status)) fail('manifest status is not a review status');

const asset = manifest.asset || {};
const glbPath = asset.production_glb;
const glbBuffer = await readFile(resolve(root, glbPath));
const actualGlbSha256 = sha256(glbBuffer);
if (actualGlbSha256 !== manifest.hashes?.[glbPath]) {
  fail(`GLB SHA256 mismatch: expected ${manifest.hashes?.[glbPath]}, got ${actualGlbSha256}`);
}

const gltfJson = parseGlbJson(glbBuffer);
const provenance = gltfJson?.asset?.extras?.proai;
if (!provenance) {
  fail('GLB asset.extras.proai metadata is missing');
} else {
  for (const [field, expected] of Object.entries({
    schema: asset.provenance_schema,
    asset_id: asset.asset_id,
    revision: asset.revision,
    forensic_id: asset.forensic_id,
  })) {
    if (provenance[field] !== expected) fail(`GLB metadata ${field} mismatch: expected ${expected}, got ${provenance[field]}`);
  }
}
const witnessId = asset.hidden_witness_node;
const witnessPresent = (gltfJson?.nodes || []).some((node) => node.name === witnessId || node.extras?.proaiNodeId === witnessId);
if (!witnessPresent) fail(`GLB hidden witness node missing: ${witnessId}`);

for (const [relativePath, expected] of Object.entries(manifest.hashes || {})) {
  const actual = sha256(await readFile(resolve(root, relativePath)));
  if (actual !== expected) fail(`protected file SHA256 mismatch for ${relativePath}: expected ${expected}, got ${actual}`);
}

if (failures.length) {
  console.error('ProAI Cube R2 integrity verification FAILED');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`ProAI Cube R2 integrity verification passed (${Object.keys(manifest.hashes).length} protected files).`);
  console.log(`GLB SHA256: ${actualGlbSha256}`);
  console.log(`Hidden witness: ${witnessId}`);
}
