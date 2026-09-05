#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const repoRoot = path.resolve(here, '../../../');
const payload = path.join(repoRoot, 'owner-preview/assets/3d/boxes-hover/neutral-light-material-r3-final.bin');
const msgpackr = require('C:/Users/PC Profile/AppData/Local/Temp/proai-msgpackr-r2/node_modules/msgpackr');

function register() {
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
}

const compact = (value, max = 1200) => {
  let text;
  try { text = JSON.stringify(value); } catch { text = String(value); }
  return text?.length > max ? `${text.slice(0, max)}…` : text;
};

register();
const root = new msgpackr.Unpackr({ structuredClone: true }).unpackMultiple(fs.readFileSync(payload))[0];
const boxes = root.scene.objects[0].children[2];
const source = boxes.children[0];
const sourceMesh = source.children[0];
const instances = boxes.children.slice(1);

const summarize = (node) => ({
  id: node.id,
  fi: node.fi,
  name: node.data?.name,
  type: node.data?.type,
  component: node.data?.component,
  nodeKeys: Object.keys(node).sort(),
  dataKeys: Object.keys(node.data || {}).sort(),
  position: node.data?.position,
  rotation: node.data?.rotation,
  scale: node.data?.scale,
  overrides: node.data?.overrides,
  states: node.data?.states,
  events: node.data?.events,
  componentObject: node.component,
});

const result = {
  payload: { bytes: fs.statSync(payload).size },
  rootSchema: root.schema,
  rootSceneKeys: Object.keys(root.scene || {}).sort(),
  rootSharedKeys: Object.keys(root.shared || {}).sort(),
  boxes: { id: boxes.id, fi: boxes.fi, dataKeys: Object.keys(boxes.data || {}).sort(), children: boxes.children.length },
  source: summarize(source),
  sourceMesh: summarize(sourceMesh),
  sourceMaterial: sourceMesh.data.material,
  instances: instances.map(summarize),
  nonEmptyOverrides: instances.filter((node) => Object.keys(node.data?.overrides || {}).length > 0).map(summarize),
  nonEmptyStates: instances.filter((node) => (node.data?.states || []).length > 0).map(summarize),
  nonEmptyEvents: instances.filter((node) => (node.data?.events || []).length > 0).map(summarize),
  instanceComponentValues: [...new Set(instances.map((node) => node.data?.component))],
  instanceFiTypes: [...new Set(instances.map((node) => `${node.fi?.constructor?.name}:${typeof node.fi}`))],
  instanceOverrideTypes: [...new Set(instances.map((node) => `${node.data?.overrides?.constructor?.name}:${Object.getPrototypeOf(node.data?.overrides || {})?.constructor?.name}`))],
  sourceMaterialLayerType: `${sourceMesh.data.material.layers?.constructor?.name}:${Object.getPrototypeOf(sourceMesh.data.material.layers || [])?.constructor?.name}`,
  sourceStateMaterialLayerType: `${sourceMesh.data.states?.[0]?.data?.material?.layers?.constructor?.name}:${Object.getPrototypeOf(sourceMesh.data.states?.[0]?.data?.material?.layers || {})?.constructor?.name}`,
  sourceFi: { value: source.fi, constructor: source.fi?.constructor?.name, type: typeof source.fi },
  samplePaths: instances.slice(0, 3).map((node, index) => ({ index: index + 1, path: `root.scene.objects.0.children.2.children.${index + 1}` })),
};
console.log(JSON.stringify(result, null, 2));
