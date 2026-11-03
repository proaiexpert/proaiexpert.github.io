import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';

const inputPath = 'assets/models/proai-cube/rubik_39_s_cube_animation.glb';
const outputPath = 'assets/models/proai-cube/proai-cube-r1.glb';
const sourceCommit = '7b0942a042ef23e10cd74592208eeae94479b45e';
const assetId = 'PAI-CUBE-0001';
const revision = 'r1';
const buildId = 'PAI-CUBE-R1-7B0942A0';
const forensicId = createHash('sha256')
  .update(`${assetId}|${revision}|${buildId}|PROAI|ownership-fingerprint-v1`)
  .digest('hex')
  .slice(0, 16)
  .toUpperCase();

const source = await readFile(inputPath);
const view = new DataView(source.buffer, source.byteOffset, source.byteLength);
if (view.getUint32(0, true) !== 0x46546c67 || view.getUint32(4, true) !== 2) {
  throw new Error('Expected a GLB 2.0 input');
}
const jsonLength = view.getUint32(12, true);
const jsonStart = 20;
const json = JSON.parse(source.subarray(jsonStart, jsonStart + jsonLength).toString('utf8').trim());
const binHeader = jsonStart + jsonLength;
if (view.getUint32(binHeader + 4, true) !== 0x004e4942) throw new Error('Expected a GLB BIN chunk');
const binLength = view.getUint32(binHeader, true);
const binStart = binHeader + 8;
const originalBin = source.subarray(binStart, binStart + binLength);

const positions = [];
const normals = [];
const indices = [];

function face(a, b, c, d, normal) {
  const start = positions.length / 3;
  for (const point of [a, b, c, d]) {
    positions.push(...point);
    normals.push(...normal);
  }
  indices.push(start, start + 1, start + 2, start, start + 2, start + 3);
}

function bar(y1, z1, y2, z2, width = 4.2, z0 = 300.15, zFront = 301.35) {
  const dy = y2 - y1;
  const dz = z2 - z1;
  const length = Math.hypot(dy, dz) || 1;
  const py = (-dz / length) * width * 0.5;
  const pz = (dy / length) * width * 0.5;
  const a = [y1 + py, z1 + pz];
  const b = [y2 + py, z2 + pz];
  const c = [y2 - py, z2 - pz];
  const d = [y1 - py, z1 - pz];
  const front = (point) => [point[1], point[0], zFront];
  const back = (point) => [point[1], point[0], z0];
  face(front(d), front(c), front(b), front(a), [0, 0, 1]);
  face(back(a), back(b), back(c), back(d), [0, 0, -1]);
  face(front(a), front(b), back(b), back(a), [-pz / (width * 0.5), py / (width * 0.5), 0]);
  face(front(b), front(c), back(c), back(b), [dz / length, -dy / length, 0]);
  face(front(c), front(d), back(d), back(c), [pz / (width * 0.5), -py / (width * 0.5), 0]);
  face(front(d), front(a), back(a), back(d), [-dy / length, -dz / length, 0]);
}

// The mark is five compact industrial letterforms laid onto the +Z physical face.
// It is intentionally behind the outer slice at rest and is revealed by existing turns.
const h = 40;
const mid = 0;
// P
bar(-h / 2, -58, h / 2, -58);
bar(h / 2, -58, h / 2, -40);
bar(mid, -58, mid, -40);
bar(h / 2, -40, mid, -40);
// R
bar(-h / 2, -30, h / 2, -30);
bar(h / 2, -30, h / 2, -12);
bar(mid, -30, mid, -12);
bar(h / 2, -12, mid, -12);
bar(mid, -12, -h / 2, 4);
// O
bar(-h / 2, 16, h / 2, 16);
bar(h / 2, 16, h / 2, 34);
bar(h / 2, 34, -h / 2, 34);
bar(-h / 2, 34, -h / 2, 16);
// A
bar(-h / 2, 46, h / 2, 55);
bar(-h / 2, 64, h / 2, 55);
bar(mid, 49, mid, 61);
bar(0, 49, 0, 61, 3.8);
// I
bar(h / 2, 76, h / 2, 94);
bar(h / 2, 94, -h / 2, 94);
bar(-h / 2, 94, -h / 2, 76);

const witnessPositions = [
  [0, 0, 0], [3.2, 1.1, -2.4], [-2.1, 3.7, 1.4], [1.5, -3.4, 3.1],
  [-3.6, -1.7, -2.8], [0.6, 2.8, 4.2], [-4.1, 0.9, 2.5],
];
const witnessIndices = [];
const witnessSeedCount = witnessPositions.length;
for (let i = 0; i < witnessSeedCount - 1; i += 1) {
  const a = witnessPositions[i];
  const b = witnessPositions[i + 1];
  const c = [a[0] * 0.55 + b[0] * 0.45, a[1] * 0.55 + b[1] * 0.45, a[2] * 0.55 + b[2] * 0.45];
  const start = witnessPositions.length;
  witnessPositions.push(c);
  witnessIndices.push(i, (i + 1) % 7, start);
}
const witnessFlat = witnessPositions.flat();
const witnessNormals = new Array(witnessFlat.length).fill(0);

function appendAligned(current, extra) {
  const pad = (4 - (current.length % 4)) % 4;
  return Buffer.concat([current, Buffer.alloc(pad), extra]);
}

let bin = Buffer.from(originalBin);
const append = (typed) => {
  const offset = bin.length + ((4 - (bin.length % 4)) % 4);
  bin = appendAligned(bin, Buffer.from(typed.buffer, typed.byteOffset, typed.byteLength));
  return { offset, byteLength: typed.byteLength };
};

const signaturePositionBlock = append(new Float32Array(positions));
const signatureNormalBlock = append(new Float32Array(normals));
const signatureIndexBlock = append(new Uint16Array(indices));
const witnessPositionBlock = append(new Float32Array(witnessFlat));
const witnessNormalBlock = append(new Float32Array(witnessNormals));
const witnessIndexBlock = append(new Uint16Array(witnessIndices));

json.buffers[0].byteLength = bin.length;
json.materials ??= [];
const materialIndex = json.materials.length;
json.materials.push({
  name: 'PROAI Kinetic Engraving R1',
  pbrMetallicRoughness: {
    baseColorFactor: [0.075, 0.09, 0.11, 1],
    metallicFactor: 0.92,
    roughnessFactor: 0.28,
  },
});
const witnessMaterialIndex = json.materials.length;
json.materials.push({
  name: 'PROAI Forensic Witness R1',
  pbrMetallicRoughness: {
    baseColorFactor: [0.02, 0.025, 0.03, 1],
    metallicFactor: 0.94,
    roughnessFactor: 0.34,
  },
});

function addBufferView(block, target) {
  const index = json.bufferViews.length;
  json.bufferViews.push({ buffer: 0, byteOffset: block.offset, byteLength: block.byteLength, target });
  return index;
}
function addAccessor(block, bufferView, componentType, count, type, min, max) {
  const index = json.accessors.length;
  json.accessors.push({ bufferView, componentType, count, type, min, max });
  return index;
}
function addMesh(name, positionBlock, normalBlock, indexBlock, vertexCount, indexCount, material, min = [-101.35, -20, -62], max = [101.35, 20, 101.35]) {
  const positionView = addBufferView(positionBlock, 34962);
  const normalView = addBufferView(normalBlock, 34962);
  const indexView = addBufferView(indexBlock, 34963);
  const positionAccessor = addAccessor(positionBlock, positionView, 5126, vertexCount, 'VEC3', min, max);
  const normalAccessor = addAccessor(normalBlock, normalView, 5126, vertexCount, 'VEC3', [-1, -1, -1], [1, 1, 1]);
  const indexAccessor = addAccessor(indexBlock, indexView, 5123, indexCount, 'SCALAR', [0], [vertexCount - 1]);
  const meshIndex = json.meshes.length;
  json.meshes.push({
    name,
    extras: { proaiNodeId: name },
    primitives: [{ attributes: { POSITION: positionAccessor, NORMAL: normalAccessor }, indices: indexAccessor, material }],
  });
  return meshIndex;
}

const signatureMesh = addMesh('PROAI_SIG_KINETIC_R1', signaturePositionBlock, signatureNormalBlock, signatureIndexBlock, positions.length / 3, indices.length, materialIndex, [-62, -20, 300.15], [98, 20, 301.35]);
const witnessMesh = addMesh('PROAI_FORENSIC_WITNESS_R1', witnessPositionBlock, witnessNormalBlock, witnessIndexBlock, witnessFlat.length / 3, witnessIndices.length, witnessMaterialIndex);
const sceneNode = json.nodes.findIndex((node) => node.name === 'Scene 1');
if (sceneNode < 0) throw new Error('Scene 1 node missing; refusing to alter hierarchy');
const signatureNode = json.nodes.length;
json.nodes.push({
  name: 'PROAI_SIG_KINETIC_R1',
  mesh: signatureMesh,
  extras: { proaiNodeId: 'PROAI_SIG_KINETIC_R1', role: 'kinetic-visible-signature', surface: 'physical-face-hidden-at-rest' },
});
const witnessNode = json.nodes.length;
json.nodes.push({
  name: 'PROAI_FORENSIC_WITNESS_R1',
  mesh: witnessMesh,
  extras: { proaiNodeId: 'PROAI_FORENSIC_WITNESS_R1', role: 'hidden-asymmetric-micro-topology-witness', visibility: 'internal-inspection-only' },
});
json.nodes[sceneNode].children ??= [];
json.nodes[sceneNode].children.push(signatureNode, witnessNode);
json.asset.extras = {
  ...(json.asset.extras ?? {}),
  proai: {
    schema: 'proai.asset.provenance.v1',
    asset_id: assetId,
    public_name: 'PROAI CUBE',
    asset_family: 'proai-cube',
    revision,
    build_id: buildId,
    forensic_id: forensicId,
    source_commit: sourceCommit,
    third_party_donor: 'Spline Community — rubik\'s cube animation — CC0 1.0',
    adaptation_notice: 'ProAI-created adaptation adds kinetic physical signature, hidden forensic geometry witness, metadata identity, runtime integration, materials, lighting and motion preservation.',
    planned_provenance_url: 'https://proai-expert.com/provenance/proai-cube/r1',
  },
};

const jsonBuffer = Buffer.from(JSON.stringify(json));
const jsonPadding = (4 - (jsonBuffer.length % 4)) % 4;
const paddedJson = Buffer.concat([jsonBuffer, Buffer.alloc(jsonPadding, 0x20)]);
const binPadding = (4 - (bin.length % 4)) % 4;
const paddedBin = Buffer.concat([bin, Buffer.alloc(binPadding)]);
const header = Buffer.alloc(12);
header.writeUInt32LE(0x46546c67, 0);
header.writeUInt32LE(2, 4);
header.writeUInt32LE(12 + 8 + paddedJson.length + 8 + paddedBin.length, 8);
const jsonHeader = Buffer.alloc(8);
jsonHeader.writeUInt32LE(paddedJson.length, 0);
jsonHeader.writeUInt32LE(0x4e4f534a, 4);
const binHeaderOut = Buffer.alloc(8);
binHeaderOut.writeUInt32LE(paddedBin.length, 0);
binHeaderOut.writeUInt32LE(0x004e4942, 4);
await writeFile(outputPath, Buffer.concat([header, jsonHeader, paddedJson, binHeaderOut, paddedBin]));

console.log(JSON.stringify({ outputPath, forensicId, signatureMesh, witnessMesh, signatureBars: 20, witnessPoints: witnessFlat.length / 3 }, null, 2));
