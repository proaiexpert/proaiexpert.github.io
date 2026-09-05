#!/usr/bin/env node

// Build one serialized choreography scene. Runtime transitions are native
// Spline object.state/transition calls; no post-load material replacement.

import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const repoRoot = path.resolve(here, '../../../');
const msgpackrPath = 'C:/Users/PC Profile/AppData/Local/Temp/proai-msgpackr-r2/node_modules/msgpackr';
const inputPath = path.join(repoRoot, 'docs/site-evolution/ai-systems/boxes-hover-semantic-premium-r2/state-base.bin');
const outputDir = path.join(repoRoot, 'docs/site-evolution/ai-systems/boxes-hover-premium-choreography-r1');
const outputPath = path.join(outputDir, 'premium-choreography-r1.bin');
const expectedInputSha = '10fe04fdbe5be5ba80e8e06230a4306552a2c9978fc3c7bee32eb87f8497ccb4';
const sourceMeshId = '2264fe3b-7194-4ee4-adea-5fa8fa9f00b1';
const patternLayerId = '2152088c-a5a1-4f51-836e-cd9c00efe34d';
const boxesPath = 'root.scene.objects.0.children.2';
const componentId = '59d52622-c138-4b29-ad19-059c64a37d07';

const colors = {
  neutral: { r: 0x9a / 255, g: 0xa1 / 255, b: 0xa8 / 255, a: 1 },
  silver: { r: 0xc9 / 255, g: 0xcd / 255, b: 0xd1 / 255, a: 1 },
  indigo: { r: 0x67 / 255, g: 0x6b / 255, b: 0xff / 255, a: 1 },
  black: { r: 0x02 / 255, g: 0x03 / 255, b: 0x04 / 255, a: 1 },
};
const route = [
  { key: 'agent', label: 'AI AGENT', id: '46154286-13e1-464a-a27c-84bd720a9cce', index: 97, position: [200, 0, 250] },
  { key: 'automation', label: 'AUTOMATION', id: '889ba072-8c04-4fa0-80f7-5c32e26dd963', index: 110, position: [200, 0, 150] },
  { key: 'api', label: 'API', id: '9d07611a-c5ce-4020-abf0-dd0f4ca95d89', index: 129, position: [200, 0, 50] },
  { key: 'custom-code', label: 'CUSTOM CODE', id: '1687f9e7-cac3-4b61-b5f6-a6dd86082fff', index: 142, position: [200, 0, -50] },
  { key: 'gate', label: 'DECISION GATE', id: 'b3dc4e58-17e8-4fe9-a3f9-d22065e088fa', index: 84, position: [200, 0, -150] },
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
  return { Kt, Me };
}

function sha256(bytes) { return crypto.createHash('sha256').update(bytes).digest('hex'); }
function decode(msgpackr, bytes) { return new msgpackr.Unpackr({ structuredClone: true }).unpackMultiple(bytes)[0]; }
function walk(nodes, callback, base = 'root.scene.objects') { if (!Array.isArray(nodes)) return; nodes.forEach((node, index) => { const current = `${base}.${index}`; callback(node, current); walk(node?.children, callback, `${current}.children`); }); }
function findById(root, id) { let result; walk(root?.scene?.objects, (node, nodePath) => { if (node?.id === id) result = { node, path: nodePath }; }); return result; }
function clone(value) { return structuredClone(value); }
function makeOverride(sourceMaterial, color, Kt) {
  const override = new Kt();
  override.material = clone(sourceMaterial);
  Object.setPrototypeOf(override.material.layers, Object.getPrototypeOf(sourceMaterial.layers));
  const pattern = override.material.layers.find((layer) => layer?.id === patternLayerId);
  if (!pattern) throw new Error('Pattern layer missing');
  pattern.data.colorA = clone(color);
  pattern.data.colorB = clone(colors.black);
  return override;
}
function makeState(sourceMaterial, name, color, position, fi, Kt) {
  const state = {
    fi,
    id: crypto.randomUUID(),
    data: {
      name,
      position,
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      overrides: new Kt(),
    },
  };
  state.data.overrides[sourceMeshId] = makeOverride(sourceMaterial, color, Kt);
  return state;
}

const msgpackr = require(msgpackrPath);
const { Kt, Me } = registerExtensions(msgpackr);
const inputBytes = fs.readFileSync(inputPath);
if (sha256(inputBytes) !== expectedInputSha) throw new Error(`Input SHA mismatch: ${sha256(inputBytes)}`);
const root = decode(msgpackr, inputBytes);
const boxes = findById(root, '006474fe-4e5b-4835-b106-89b2ec79dd71');
const sourceMesh = findById(root, sourceMeshId);
if (!boxes || boxes.path !== boxesPath || !sourceMesh || sourceMesh.node.data?.material?.name !== 'Cube Material') throw new Error('Base topology/material authority mismatch');
const sourceMaterial = sourceMesh.node.data.material;

const targetRecords = [];
for (const stage of route.slice(0, 4)) {
  const found = findById(root, stage.id);
  if (!found || found.path !== `${boxesPath}.children.${stage.index}` || found.node.data?.component !== componentId) throw new Error(`Target mismatch: ${stage.label}`);
  found.node.data.states = new Me();
  found.node.data.states.push(
    makeState(sourceMaterial, 'Indigo', colors.indigo, [stage.position[0], 10, stage.position[2]], 0.71 + stage.index / 10000, Kt),
    makeState(sourceMaterial, 'Silver', colors.silver, stage.position, 0.72 + stage.index / 10000, Kt),
  );
  targetRecords.push({ stage: stage.key, id: stage.id, path: found.path, position: stage.position, component: componentId, states: found.node.data.states.map((state) => ({ name: state.data.name, id: state.id })) });
}

fs.mkdirSync(outputDir, { recursive: true });
const outputBytes = Buffer.from(new msgpackr.Packr({ structuredClone: true }).pack(root));
fs.writeFileSync(outputPath, outputBytes);
const decoded = decode(msgpackr, outputBytes);
const roundtripBoxes = findById(decoded, '006474fe-4e5b-4835-b106-89b2ec79dd71');
const roundtripTargets = targetRecords.map((record) => findById(decoded, record.id)?.node?.data?.states?.map((state) => state.data.name));
if (roundtripBoxes?.node?.children?.length !== 143 || roundtripTargets.some((names) => JSON.stringify(names) !== JSON.stringify(['Indigo', 'Silver']))) throw new Error('Roundtrip topology/state verification failed');

const evidence = {
  authority: { baseCommit: '6ebe7475045743ae5fb03790c41c82dd2ada741d', input: 'docs/site-evolution/ai-systems/boxes-hover-semantic-premium-r2/state-base.bin', inputSha256: expectedInputSha, runtime: '@splinetool/runtime@2.0.27', loader: '@splinetool/loader@2.0.27' },
  output: { file: 'docs/site-evolution/ai-systems/boxes-hover-premium-choreography-r1/premium-choreography-r1.bin', bytes: outputBytes.length, sha256: sha256(outputBytes) },
  mechanism: 'Serialized Instance data.states with native source-compatible material overrides; runtime object.transition({from,to,duration}).play() after one Application boot.',
  route: targetRecords,
  states: { neutral: 'Base State / inherited R2 neutral', indigo: 'Indigo state: colorA #676BFF + position.y +10', silver: 'Silver state: colorA #C9CDD1 + base position', pearl: 'Gate remains the existing serialized Pearl override' },
  invariants: { boxesChildren: 143, targetStates: 4, cameraChanged: false, geometryChanged: false, hierarchyChanged: false, eventsChanged: false, nativeHoverPreserved: true, runtimeMaterialMutation: false, duplicateApplicationBoot: false },
};
fs.writeFileSync(path.join(outputDir, 'choreography-evidence.json'), `${JSON.stringify(evidence, null, 2)}\n`, 'utf8');
console.log(JSON.stringify(evidence, null, 2));
