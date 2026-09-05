#!/usr/bin/env node

// Build review-only serialized states from the accepted R3 payload.
// No runtime mutation, geometry reconstruction, or Golden/R3 overwrite.

import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const repoRoot = path.resolve(here, '../../../');
const inputPath = path.join(repoRoot, 'owner-preview/assets/3d/boxes-hover/neutral-light-material-r3-final.bin');
const outputDir = path.join(repoRoot, 'docs/site-evolution/ai-systems/boxes-hover-authority-threshold-route-r1');
const msgpackrPath = 'C:/Users/PC Profile/AppData/Local/Temp/proai-msgpackr-r2/node_modules/msgpackr';
const R3_SHA = '1269ea60eb7725e59822ba2b9e789a2d9dd8956f557ffbbedfbb39e97a12c4d0';
const SOURCE_COMPONENT_ID = '59d52622-c138-4b29-ad19-059c64a37d07';
const SOURCE_MESH_ID = '2264fe3b-7194-4ee4-adea-5fa8fa9f00b1';
const PATTERN_LAYER_ID = '2152088c-a5a1-4f51-836e-cd9c00efe34d';
const BOXES_ID = '006474fe-4e5b-4835-b106-89b2ec79dd71';
const BOXES_PATH = 'root.scene.objects.0.children.2';

const COLORS = {
  neutral: { r: 0xc9 / 255, g: 0xcd / 255, b: 0xd1 / 255, a: 1 },
  indigo: { r: 0x67 / 255, g: 0x6b / 255, b: 0xff / 255, a: 1 },
  pearl: { r: 0xf2 / 255, g: 0xf0 / 255, b: 0xeb / 255, a: 1 },
  black: { r: 0x02 / 255, g: 0x03 / 255, b: 0x04 / 255, a: 1 },
};

const route = [
  { stage: '01', key: 'agent', label: 'AI AGENT', id: '46154286-13e1-464a-a27c-84bd720a9cce', path: `${BOXES_PATH}.children.97`, position: [200, 0, 250] },
  { stage: '02', key: 'automation', label: 'AUTOMATION', id: '889ba072-8c04-4fa0-80f7-5c32e26dd963', path: `${BOXES_PATH}.children.110`, position: [200, 0, 150] },
  { stage: '03', key: 'api', label: 'API', id: '9d07611a-c5ce-4020-abf0-dd0f4ca95d89', path: `${BOXES_PATH}.children.129`, position: [200, 0, 50] },
  { stage: '04', key: 'custom-code', label: 'CUSTOM CODE', id: '1687f9e7-cac3-4b61-b5f6-a6dd86082fff', path: `${BOXES_PATH}.children.142`, position: [200, 0, -50] },
  { stage: '05', key: 'gate', label: 'DECISION GATE', id: 'b3dc4e58-17e8-4fe9-a3f9-d22065e088fa', path: `${BOXES_PATH}.children.84`, position: [200, 0, -150] },
];

const states = [
  { key: 'base', label: 'BASE', active: null, resolved: [], pearl: 'gate' },
  { key: 'agent', label: '1 AGENT', active: 'agent', resolved: [], pearl: 'gate' },
  { key: 'automation', label: '2 AUTOMATION', active: 'automation', resolved: ['agent'], pearl: 'gate' },
  { key: 'api', label: '3 API', active: 'api', resolved: ['agent', 'automation'], pearl: 'gate' },
  { key: 'custom-code', label: '4 CUSTOM CODE', active: 'custom-code', resolved: ['agent', 'automation', 'api'], pearl: 'gate' },
  { key: 'gate', label: '5 GATE', active: null, resolved: ['agent', 'automation', 'api', 'custom-code'], pearl: 'gate' },
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
function json(value) { return JSON.parse(JSON.stringify(value)); }
function decode(msgpackr, bytes) {
  const values = new msgpackr.Unpackr({ structuredClone: true }).unpackMultiple(bytes);
  if (values.length !== 1) throw new Error(`Expected one root value, got ${values.length}`);
  return values[0];
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
function leafDiff(before, after, pathName = 'root', output = []) {
  const beforeObject = before && typeof before === 'object';
  const afterObject = after && typeof after === 'object';
  if (!beforeObject && afterObject) { for (const key of Object.keys(after).sort()) leafDiff(undefined, after[key], `${pathName}.${key}`, output); return output; }
  if (beforeObject && !afterObject) { for (const key of Object.keys(before).sort()) leafDiff(before[key], undefined, `${pathName}.${key}`, output); return output; }
  if (!beforeObject || !afterObject) { if (JSON.stringify(before) !== JSON.stringify(after)) output.push({ path: pathName, before, after }); return output; }
  if (Array.isArray(before) || Array.isArray(after)) {
    const max = Math.max(before?.length ?? 0, after?.length ?? 0);
    for (let index = 0; index < max; index += 1) leafDiff(before?.[index], after?.[index], `${pathName}.${index}`, output);
    return output;
  }
  for (const key of [...new Set([...Object.keys(before), ...Object.keys(after)])].sort()) leafDiff(before[key], after[key], `${pathName}.${key}`, output);
  return output;
}
function countTopology(root) {
  let sourceCubes = 0;
  let instances = 0;
  walkTree(root?.scene?.objects, (node) => {
    if (node?.data?.type === 'Mesh' && node?.data?.name === 'Cube') sourceCubes += 1;
    if (node?.data?.type === 'Instance') instances += 1;
  });
  const boxes = findById(root, BOXES_ID);
  return { sourceCubes, instances, boxesChildren: boxes?.node?.children?.length ?? null };
}
function instanceMap(root) {
  const boxes = findById(root, BOXES_ID);
  if (!boxes || boxes.path !== BOXES_PATH) throw new Error('Boxes identity/path mismatch');
  const instances = [];
  boxes.node.children.forEach((node, index) => {
    if (node?.data?.type !== 'Instance') return;
    instances.push({
      index,
      id: node.id,
      path: `${BOXES_PATH}.children.${index}`,
      position: (node.data.position || []).map((value) => Math.abs(value) < 1e-9 ? 0 : value),
      component: node.data.component ?? null,
    });
  });
  if (instances.length !== 142) throw new Error(`Expected 142 instances, got ${instances.length}`);
  if (instances.some((item) => item.component !== SOURCE_COMPONENT_ID)) throw new Error('Instance component reference mismatch');
  return instances;
}
function materialOverride(source, color, Kt) {
  const meshOverride = new Kt();
  meshOverride.material = structuredClone(source.node.data.material);
  Object.setPrototypeOf(meshOverride.material.layers, Object.getPrototypeOf(source.node.data.material.layers));
  const patternLayer = meshOverride.material.layers.find((layer) => layer?.id === PATTERN_LAYER_ID);
  if (!patternLayer) throw new Error('Pattern layer missing');
  patternLayer.data.colorA = { ...color };
  patternLayer.data.colorB = { ...COLORS.black };
  return meshOverride;
}

const msgpackr = require(msgpackrPath);
const { Kt } = registerExtensions(msgpackr);
const inputBytes = fs.readFileSync(inputPath);
if (sha256(inputBytes) !== R3_SHA) throw new Error(`R3 SHA mismatch: ${sha256(inputBytes)}`);
const inspectionRoot = decode(msgpackr, inputBytes);
const allInstances = instanceMap(inspectionRoot);
const source = findById(inspectionRoot, SOURCE_MESH_ID);
if (!source || source.node.data?.material?.name !== 'Cube Material') throw new Error('Source Cube Material mismatch');
const routeIds = new Set(route.map((item) => item.id));
for (const item of route) {
  const found = findById(inspectionRoot, item.id);
  if (!found || found.path !== item.path || found.node.data.component !== SOURCE_COMPONENT_ID) throw new Error(`Route target mismatch: ${item.label}`);
  const actualPosition = (found.node.data.position || []).map((value) => Math.abs(value) < 1e-9 ? 0 : value);
  if (JSON.stringify(actualPosition) !== JSON.stringify(item.position)) throw new Error(`Route position mismatch: ${item.label}`);
}

fs.mkdirSync(outputDir, { recursive: true });
const outputs = [];
const stateDiffs = [];
for (const state of states) {
  const root = decode(msgpackr, inputBytes);
  for (const stage of route) {
    const found = findById(root, stage.id);
    const color = stage.key === state.pearl ? COLORS.pearl : stage.key === state.active ? COLORS.indigo : null;
    if (color) {
      const overrides = new Kt();
      overrides[SOURCE_MESH_ID] = materialOverride(source, color, Kt);
      found.node.data.overrides = overrides;
    }
  }
  const diff = leafDiff(json(inspectionRoot), json(root));
  const allowedPrefixes = route
    .filter((stage) => stage.key === state.pearl || stage.key === state.active)
    .map((stage) => `${stage.path}.data.overrides.${SOURCE_MESH_ID}`);
  const allowed = (entryPath) => allowedPrefixes.some((prefix) => entryPath === prefix || entryPath.startsWith(`${prefix}.`));
  const disallowed = diff.filter((entry) => !allowed(entry.path));
  if (disallowed.length) throw new Error(`Disallowed ${state.key} diff: ${JSON.stringify(disallowed.slice(0, 5))}`);
  const outputBytes = Buffer.from(new msgpackr.Packr({ structuredClone: true }).pack(root));
  const filename = `state-${state.key}.bin`;
  const outputPath = path.join(outputDir, filename);
  fs.writeFileSync(outputPath, outputBytes);
  const decodedOutput = decode(msgpackr, outputBytes);
  const roundtripDiff = leafDiff(json(inspectionRoot), json(decodedOutput));
  const roundtripDisallowed = roundtripDiff.filter((entry) => !allowed(entry.path));
  if (roundtripDisallowed.length) throw new Error(`Disallowed roundtrip ${state.key} diff`);
  const record = {
    key: state.key,
    label: state.label,
    file: `docs/site-evolution/ai-systems/boxes-hover-authority-threshold-route-r1/${filename}`,
    bytes: outputBytes.length,
    sha256: sha256(outputBytes),
    active: state.active,
    resolved: state.resolved,
    pearl: state.pearl,
    changedLeafCount: diff.length,
    roundtripChangedLeafCount: roundtripDiff.length,
    disallowedDiff: disallowed.length,
    roundtripDisallowed: roundtripDisallowed.length,
  };
  outputs.push(record);
  stateDiffs.push({ ...record, allowedOverridePaths: allowedPrefixes });
}

const map = {
  authority: {
    baseCommit: '2b8ca329f755355bd143cd5e7f2e6950c4ee91ad',
    r3PayloadSha256: R3_SHA,
    runtime: '@splinetool/runtime@2.0.27',
    loader: '@splinetool/loader@2.0.27',
  },
  boxes: { id: BOXES_ID, path: BOXES_PATH, children: 143 },
  source: { componentId: SOURCE_COMPONENT_ID, meshId: SOURCE_MESH_ID, patternLayerId: PATTERN_LAYER_ID },
  count: allInstances.length,
  instances: allInstances,
  selectedRoute: route.map((item) => ({ stage: item.stage, key: item.key, label: item.label, id: item.id, path: item.path, position: item.position, component: SOURCE_COMPONENT_ID })),
};
fs.writeFileSync(path.join(outputDir, 'all-instance-map.json'), `${JSON.stringify(map, null, 2)}\n`, 'utf8');
fs.writeFileSync(path.join(outputDir, 'state-diffs.json'), `${JSON.stringify({ authority: map.authority, states: stateDiffs }, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ input: { path: inputPath, bytes: inputBytes.length, sha256: sha256(inputBytes) }, topology: countTopology(inspectionRoot), allInstances: allInstances.length, selectedRoute: map.selectedRoute, outputs }, null, 2));

