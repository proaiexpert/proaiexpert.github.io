import fs from 'node:fs';

const inputPath = 'assets/models/proai-cube/proai-cube-r1.glb';
const outputPath = 'assets/models/proai-cube/proai-cube-r1-1.glb';

const input = fs.readFileSync(inputPath);
const view = new DataView(input.buffer, input.byteOffset, input.byteLength);
if (view.getUint32(0, true) !== 0x46546c67 || view.getUint32(4, true) !== 2) {
  throw new Error('Unexpected GLB header');
}

let json;
let binary;
for (let offset = 12; offset < input.byteLength;) {
  const length = view.getUint32(offset, true);
  const type = view.getUint32(offset + 4, true);
  const chunk = input.subarray(offset + 8, offset + 8 + length);
  if (type === 0x4e4f534a) json = JSON.parse(chunk.toString('utf8').trim());
  if (type === 0x004e4942) binary = chunk;
  offset += 8 + length;
}
if (!json || !binary) throw new Error('GLB JSON/BIN chunks missing');

const signatureNodeIndex = json.nodes.findIndex((node) => node.name === 'PROAI_SIG_KINETIC_R1');
const witnessNodeIndex = json.nodes.findIndex((node) => node.name === 'PROAI_FORENSIC_WITNESS_R1');
if (signatureNodeIndex < 0 || witnessNodeIndex < 0) throw new Error('Expected ownership nodes missing');
const signatureMeshIndex = json.nodes[signatureNodeIndex].mesh;
const witnessMeshIndex = json.nodes[witnessNodeIndex].mesh;
if (signatureMeshIndex == null || witnessMeshIndex == null) throw new Error('Expected ownership mesh missing');

const signatureMesh = json.meshes[signatureMeshIndex];
const witnessMesh = json.meshes[witnessMeshIndex];
const signaturePrimitive = signatureMesh.primitives[0];
const witnessPrimitive = witnessMesh.primitives[0];
const signatureAccessorIndexes = [
  ...Object.values(signaturePrimitive.attributes),
  signaturePrimitive.indices,
].filter((index) => Number.isInteger(index));
const witnessAccessorIndexes = [
  ...Object.values(witnessPrimitive.attributes),
  witnessPrimitive.indices,
].filter((index) => Number.isInteger(index));
const signatureViewIndexes = signatureAccessorIndexes.map((index) => json.accessors[index].bufferView);
const signatureStart = Math.min(...signatureViewIndexes.map((index) => json.bufferViews[index].byteOffset || 0));
const signatureEnd = Math.max(...signatureViewIndexes.map((index) => {
  const bufferView = json.bufferViews[index];
  return (bufferView.byteOffset || 0) + bufferView.byteLength;
}));
if (signatureStart < 0 || signatureEnd > binary.byteLength || signatureStart >= signatureEnd) {
  throw new Error('Invalid signature binary range');
}

function remapIndex(index, removedIndex) {
  if (index == null) return index;
  if (index === removedIndex) throw new Error(`Unexpected direct reference to removed index ${removedIndex}`);
  return index > removedIndex ? index - 1 : index;
}

const removeNode = (node) => node !== json.nodes[signatureNodeIndex];
json.nodes = json.nodes.filter(removeNode);
for (const node of json.nodes) {
  if (Array.isArray(node.children)) node.children = node.children.filter((index) => index !== signatureNodeIndex).map((index) => remapIndex(index, signatureNodeIndex));
  if (node.mesh != null) node.mesh = remapIndex(node.mesh, signatureMeshIndex);
}
for (const scene of json.scenes || []) {
  scene.nodes = (scene.nodes || []).filter((index) => index !== signatureNodeIndex).map((index) => remapIndex(index, signatureNodeIndex));
}

json.meshes = json.meshes.filter((mesh) => mesh !== signatureMesh);
for (const mesh of json.meshes) {
  for (const primitive of mesh.primitives || []) {
    if (primitive.material != null) primitive.material = remapIndex(primitive.material, 0);
  }
}

// Accessors/bufferViews 88..90 belong to the rejected signature; the witness is 91..93.
const signatureAccessorSet = new Set(signatureAccessorIndexes);
const signatureViewSet = new Set(signatureViewIndexes);
const oldAccessorToNew = new Map();
const keptAccessors = [];
for (let index = 0; index < json.accessors.length; index += 1) {
  if (signatureAccessorSet.has(index)) continue;
  oldAccessorToNew.set(index, keptAccessors.length);
  keptAccessors.push(json.accessors[index]);
}
json.accessors = keptAccessors;
const oldViewToNew = new Map();
const keptViews = [];
for (let index = 0; index < json.bufferViews.length; index += 1) {
  if (signatureViewSet.has(index)) continue;
  oldViewToNew.set(index, keptViews.length);
  const bufferView = { ...json.bufferViews[index] };
  const oldOffset = bufferView.byteOffset || 0;
  if (oldOffset >= signatureEnd) bufferView.byteOffset = oldOffset - (signatureEnd - signatureStart);
  else if (oldOffset >= signatureStart) throw new Error(`Unexpected overlapping bufferView ${index}`);
  keptViews.push(bufferView);
}
json.bufferViews = keptViews;
for (const accessor of json.accessors) accessor.bufferView = oldViewToNew.get(accessor.bufferView);
for (const mesh of json.meshes) {
  for (const primitive of mesh.primitives || []) {
    for (const key of Object.keys(primitive.attributes || {})) primitive.attributes[key] = oldAccessorToNew.get(primitive.attributes[key]);
    if (primitive.indices != null) primitive.indices = oldAccessorToNew.get(primitive.indices);
  }
}

const trimmedBinary = Buffer.concat([binary.subarray(0, signatureStart), binary.subarray(signatureEnd)]);
json.buffers[0].byteLength = trimmedBinary.byteLength;
json.asset.extras.proai.revision = 'r1.1';
json.asset.extras.proai.build_id = 'PAI-CUBE-R1-1-7B0942A0';
json.asset.extras.proai.adaptation_notice = 'ProAI-created R1.1 recovery preserves the Golden Cube geometry, materials, lighting and motion while retaining an invisible forensic witness; the visible brand treatment is a modular runtime optical micro-etch on one center tile.';
json.asset.extras.proai.micro_etch = {
  text: 'PROAI',
  mode: 'single-center-tile-surface-response',
  variants: ['whisper', 'signature', 'reference'],
};
const witnessNode = json.nodes.find((node) => node.name === 'PROAI_FORENSIC_WITNESS_R1');
const witnessMeshAfter = json.meshes.find((mesh) => mesh.name === 'PROAI_FORENSIC_WITNESS_R1');
if (!witnessNode || !witnessMeshAfter) throw new Error('Witness was not preserved');
witnessNode.extras = { proaiNodeId: 'PROAI_FORENSIC_WITNESS_R1', role: 'hidden-asymmetric-micro-topology-witness', visibility: 'internal-inspection-only' };
witnessMeshAfter.extras = { proaiNodeId: 'PROAI_FORENSIC_WITNESS_R1' };

const jsonBytes = Buffer.from(JSON.stringify(json));
const jsonPaddedLength = Math.ceil(jsonBytes.length / 4) * 4;
const binaryPaddedLength = Math.ceil(trimmedBinary.length / 4) * 4;
const jsonChunk = Buffer.alloc(jsonPaddedLength, 0x20);
jsonBytes.copy(jsonChunk);
const binaryChunk = Buffer.alloc(binaryPaddedLength);
trimmedBinary.copy(binaryChunk);
const output = Buffer.alloc(12 + 8 + jsonChunk.length + 8 + binaryChunk.length);
const outputView = new DataView(output.buffer, output.byteOffset, output.byteLength);
outputView.setUint32(0, 0x46546c67, true);
outputView.setUint32(4, 2, true);
outputView.setUint32(8, output.length, true);
let offset = 12;
outputView.setUint32(offset, jsonChunk.length, true);
outputView.setUint32(offset + 4, 0x4e4f534a, true);
jsonChunk.copy(output, offset + 8);
offset += 8 + jsonChunk.length;
outputView.setUint32(offset, binaryChunk.length, true);
outputView.setUint32(offset + 4, 0x004e4942, true);
binaryChunk.copy(output, offset + 8);
fs.writeFileSync(outputPath, output);
console.log(JSON.stringify({ inputPath, outputPath, bytes: output.length, removedSignatureBytes: signatureEnd - signatureStart, nodes: json.nodes.length, meshes: json.meshes.length, accessors: json.accessors.length, bufferViews: json.bufferViews.length }, null, 2));
