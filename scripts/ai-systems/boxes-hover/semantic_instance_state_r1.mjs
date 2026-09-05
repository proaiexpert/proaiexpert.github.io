#!/usr/bin/env node

// Read-only capability proof: make three serialized Instance overrides on a
// fresh copy of the accepted R3 payload. The Golden/R3 inputs are immutable.

import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const repoRoot = path.resolve(here, '../../../');
const inputPath = path.join(repoRoot, 'owner-preview/assets/3d/boxes-hover/neutral-light-material-r3-final.bin');
const outputDir = path.join(repoRoot, 'docs/site-evolution/ai-systems/boxes-hover-semantic-instance-state-r1');
const outputPath = path.join(outputDir, 'boxes-hover-semantic-instance-state-r1.bin');
const msgpackrPath = 'C:/Users/PC Profile/AppData/Local/Temp/proai-msgpackr-r2/node_modules/msgpackr';
const R3_SHA = '1269ea60eb7725e59822ba2b9e789a2d9dd8956f557ffbbedfbb39e97a12c4d0';
const SOURCE_COMPONENT_ID = '59d52622-c138-4b29-ad19-059c64a37d07';
const SOURCE_MESH_ID = '2264fe3b-7194-4ee4-adea-5fa8fa9f00b1';
const PATTERN_LAYER_ID = '2152088c-a5a1-4f51-836e-cd9c00efe34d';
const COLORS = {
  indigo: { r: 0x67 / 255, g: 0x6b / 255, b: 0xff / 255, a: 1 },
  pearl: { r: 0xf2 / 255, g: 0xf0 / 255, b: 0xeb / 255, a: 1 },
};
const targets = [
  { state: 'INDIGO', id: '889ba072-8c04-4fa0-80f7-5c32e26dd963', path: 'root.scene.objects.0.children.2.children.110', position: [200, 0, 150], color: COLORS.indigo },
  { state: 'NEUTRAL / SILVER', id: '9d07611a-c5ce-4020-abf0-dd0f4ca95d89', path: 'root.scene.objects.0.children.2.children.129', position: [200, 0, 50], color: null },
  { state: 'PEARL', id: '1687f9e7-cac3-4b61-b5f6-a6dd86082fff', path: 'root.scene.objects.0.children.2.children.142', position: [200, 0, -50], color: COLORS.pearl },
];

function registerExtensions(msgpackr) {
  class Ae {}
  class Me extends Array {}
  class Rt extends Array {}
  class Rl { constructor(value) { this.id = value; } }
  class Qu { constructor(value) { this.data = value; } }
  class Kt {}
  [
    { type: 1, Class: Ae, write: (value) => ({ ...value }), read: (value) => Object.setPrototypeOf(value, Ae.prototype) },
    { type: 2, Class: Me, write: (value) => [...value], read: (value) => Object.setPrototypeOf(value, Me.prototype) },
    { type: 3, Class: Rt, write: (value) => [...value], read: (value) => Object.setPrototypeOf(value, Rt.prototype) },
    { type: 4, Class: Rl, write: (value) => value.id, read: (value) => new Rl(value) },
    { type: 5, Class: Qu, write: (value) => value.data, read: (value) => new Qu(value) },
    { type: 6, Class: Kt, write: (value) => ({ ...value }), read: (value) => Object.setPrototypeOf(value, Kt.prototype) },
  ].forEach((definition) => msgpackr.addExtension(definition));
  return { Kt };
}

function sha256(bytes) { return crypto.createHash('sha256').update(bytes).digest('hex'); }
function decode(msgpackr, bytes) {
  const values = new msgpackr.Unpackr({ structuredClone: true }).unpackMultiple(bytes);
  if (values.length !== 1) throw new Error(`Expected one root value, got ${values.length}`);
  return values[0];
}
function json(value) { return JSON.parse(JSON.stringify(value)); }
function leafDiff(before, after, pathName = 'root', output = []) {
  const beforeObject = before && typeof before === 'object';
  const afterObject = after && typeof after === 'object';
  if (!beforeObject && afterObject) {
    for (const key of Object.keys(after).sort()) leafDiff(undefined, after[key], `${pathName}.${key}`, output);
    return output;
  }
  if (beforeObject && !afterObject) {
    for (const key of Object.keys(before).sort()) leafDiff(before[key], undefined, `${pathName}.${key}`, output);
    return output;
  }
  if (!beforeObject || !afterObject) {
    if (JSON.stringify(before) !== JSON.stringify(after)) output.push({ path: pathName, before, after });
    return output;
  }
  if (Array.isArray(before) || Array.isArray(after)) {
    const max = Math.max(before?.length ?? 0, after?.length ?? 0);
    for (let index = 0; index < max; index += 1) leafDiff(before?.[index], after?.[index], `${pathName}.${index}`, output);
    return output;
  }
  for (const key of [...new Set([...Object.keys(before), ...Object.keys(after)])].sort()) leafDiff(before[key], after[key], `${pathName}.${key}`, output);
  return output;
}
function walkTree(nodes, callback, pathName = 'root.scene.objects') {
  if (!Array.isArray(nodes)) return;
  nodes.forEach((node, index) => {
    const currentPath = `${pathName}.${index}`;
    callback(node, currentPath);
    walkTree(node?.children, callback, `${currentPath}.children`);
  });
}
function findById(root, id) {
  let result = null;
  walkTree(root?.scene?.objects, (node, nodePath) => { if (node?.id === id) result = { node, path: nodePath }; });
  return result;
}
function materialSnapshot(material) {
  return {
    name: material?.name ?? null,
    layers: (material?.layers || []).map((layer) => ({
      id: layer?.id ?? null,
      type: layer?.data?.type ?? null,
      colorA: layer?.data?.colorA ?? null,
      colorB: layer?.data?.colorB ?? null,
      metalness: layer?.data?.metalness ?? null,
      roughness: layer?.data?.roughness ?? null,
      reflectivity: layer?.data?.reflectivity ?? null,
    })),
  };
}
function countCubes(root) {
  let cubes = 0;
  let instances = 0;
  let boxes = null;
  walkTree(root?.scene?.objects, (node, nodePath) => {
    if (node?.data?.name === 'Boxes') boxes = { path: nodePath, children: node.children?.length ?? 0, id: node.id };
    if (node?.data?.name === 'Cube' && node?.data?.type === 'Mesh') cubes += 1;
    if (node?.data?.type === 'Instance') instances += 1;
  });
  return { cubes, instances, boxes };
}

const msgpackr = require(msgpackrPath);
const { Kt } = registerExtensions(msgpackr);
const inputBytes = fs.readFileSync(inputPath);
if (sha256(inputBytes) !== R3_SHA) throw new Error(`R3 SHA mismatch: ${sha256(inputBytes)}`);
const baseRoot = decode(msgpackr, inputBytes);
const candidateRoot = decode(msgpackr, inputBytes);
const boxes = candidateRoot.scene.objects[0].children[2];
if (boxes.children.length !== 143) throw new Error(`Unexpected Boxes child count: ${boxes.children.length}`);
const source = findById(candidateRoot, SOURCE_MESH_ID);
if (!source || source.node.data?.material?.name !== 'Cube Material') throw new Error('Source Cube Material identity mismatch');

for (const target of targets) {
  const found = findById(candidateRoot, target.id);
  if (!found || found.path !== target.path) throw new Error(`Target identity/path mismatch for ${target.id}`);
  if (found.node.data?.component !== SOURCE_COMPONENT_ID) throw new Error(`Target component mismatch for ${target.id}`);
  if ((found.node.data.position || []).some((value, index) => Math.abs(value - target.position[index]) > 1e-9)) throw new Error(`Target position mismatch for ${target.id}`);
  if (target.color) {
    const overrides = new Kt();
    const meshOverride = new Kt();
    // Runtime classifies Instance material as an entire composite override;
    // provide a complete source-compatible material record, changing only
    // the approved pattern colors on this placement.
    meshOverride.material = structuredClone(source.node.data.material);
    // Preserve the serialized layer-table extension so runtime can use its
    // native `layers.data(id)` lookup while creating the override material.
    Object.setPrototypeOf(meshOverride.material.layers, Object.getPrototypeOf(source.node.data.material.layers));
    const patternLayer = meshOverride.material.layers.find((layer) => layer?.id === PATTERN_LAYER_ID);
    if (!patternLayer) throw new Error(`Pattern layer missing for ${target.id}`);
    patternLayer.data.colorA = { ...target.color };
    patternLayer.data.colorB = { r: 0x02 / 255, g: 0x03 / 255, b: 0x04 / 255, a: 1 };
    overrides[SOURCE_MESH_ID] = meshOverride;
    found.node.data.overrides = overrides;
  }
}

const beforeJson = json(baseRoot);
const candidateJson = json(candidateRoot);
const semanticDiff = leafDiff(beforeJson, candidateJson);
const allowedPrefixes = [];
for (const target of targets.filter((item) => item.color)) {
  const prefix = `${target.path}.data.overrides.${SOURCE_MESH_ID}`;
  allowedPrefixes.push(prefix);
}
const allowed = (entryPath) => allowedPrefixes.some((prefix) => entryPath === prefix || entryPath.startsWith(`${prefix}.`));
const disallowedDiff = semanticDiff.filter((entry) => !allowed(entry.path));
if (disallowedDiff.length) throw new Error(`Disallowed semantic changes: ${JSON.stringify(disallowedDiff.slice(0, 20))}`);

const outputBytes = Buffer.from(new msgpackr.Packr({ structuredClone: true }).pack(candidateRoot));
fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputPath, outputBytes);
const decodedCandidate = decode(msgpackr, outputBytes);
const roundtripDiff = leafDiff(beforeJson, json(decodedCandidate));
const roundtripDisallowed = roundtripDiff.filter((entry) => !allowed(entry.path));
if (roundtripDisallowed.length) throw new Error(`Disallowed roundtrip changes: ${JSON.stringify(roundtripDisallowed.slice(0, 20))}`);

const semanticTargetMap = targets.map((target) => {
  const found = findById(decodedCandidate, target.id);
  const override = found?.node?.data?.overrides?.[SOURCE_MESH_ID];
  return {
    state: target.state,
    id: target.id,
    path: target.path,
    position: target.position,
    component: found?.node?.data?.component ?? null,
    overridePath: target.color ? `${target.path}.data.overrides.${SOURCE_MESH_ID}.material.layers.${PATTERN_LAYER_ID}.colorA` : null,
    serializedOverride: target.color ? json(override) : null,
    expectedColorA: target.color,
    inheritedNeutral: !target.color,
  };
});
const evidence = {
  authority: {
    baseCommit: 'ab1da88762bf09434d0be9cedef4cb7383056aba',
    r3PayloadSha256: sha256(inputBytes),
    r3PayloadBytes: inputBytes.length,
    runtime: '@splinetool/runtime@2.0.27',
    loader: '@splinetool/loader@2.0.27',
    encoder: 'public msgpackr Packr({structuredClone:true}) with registered public extension table',
  },
  source: { componentId: SOURCE_COMPONENT_ID, meshId: SOURCE_MESH_ID, patternLayerId: PATTERN_LAYER_ID, material: materialSnapshot(source.node.data.material) },
  targets: semanticTargetMap,
  topology: { base: countCubes(baseRoot), candidate: countCubes(decodedCandidate) },
  semanticDiff,
  roundtripDiff,
  disallowedDiff,
  roundtripDisallowed,
  changedLeafCount: semanticDiff.length,
  roundtripChangedLeafCount: roundtripDiff.length,
  safety: {
    goldenPayloadModified: false,
    r3SourceModified: false,
    globalCubeMaterialModified: false,
    lightMaterialModified: false,
    cameraModified: false,
    geometryModified: false,
    hierarchyModified: false,
    eventsModified: false,
    runtimeMaterialMutation: false,
  },
  output: { path: outputPath, bytes: outputBytes.length, sha256: sha256(outputBytes) },
};
fs.writeFileSync(path.join(outputDir, 'semantic-diff.json'), `${JSON.stringify({ ...evidence, semanticDiff, roundtripDiff }, null, 2)}\n`, 'utf8');
fs.writeFileSync(path.join(outputDir, 'target-instance-map.json'), `${JSON.stringify({ targets: semanticTargetMap, source: evidence.source, topology: evidence.topology }, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ outputPath, bytes: outputBytes.length, sha256: evidence.output.sha256, targets: semanticTargetMap, topology: evidence.topology, changedLeafCount: semanticDiff.length, roundtripChangedLeafCount: roundtripDiff.length, disallowedDiff: disallowedDiff.length, roundtripDisallowed: roundtripDisallowed.length }, null, 2));
