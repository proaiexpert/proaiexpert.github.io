#!/usr/bin/env node

import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const repoRoot = path.resolve(here, '../../../');
const payload = path.join(repoRoot, 'owner-preview/assets/3d/boxes-hover/neutral-light-material-r3-final.bin');
const msgpackrPath = 'C:/Users/PC Profile/AppData/Local/Temp/proai-msgpackr-r2/node_modules/msgpackr';

function register(msgpackr) {
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

const safe = (value) => {
  if (value === null || value === undefined) return value ?? null;
  if (typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.slice(0, 12).map(safe);
  const out = {};
  for (const key of Object.keys(value).sort()) {
    if (['children', 'material', 'data', 'component', 'states', 'events', 'overrides', 'props', 'operations'].includes(key)) out[key] = safe(value[key]);
  }
  return out;
};

function pathValue(value, keys) {
  let current = value;
  for (const key of keys) current = current?.[key];
  return current;
}

function walkTree(nodes, callback, pathName = 'root.scene.objects') {
  if (!Array.isArray(nodes)) return;
  nodes.forEach((node, index) => {
    const currentPath = `${pathName}.${index}`;
    callback(node, currentPath);
    walkTree(node?.children, callback, `${currentPath}.children`);
  });
}

function nodeRecord(node, objectPath, depth) {
  const data = node?.data || {};
  const material = data.material;
  return {
    path: objectPath,
    depth,
    id: node?.id ?? null,
    name: data.name ?? null,
    type: data.type ?? null,
    children: Array.isArray(node?.children) ? node.children.length : 0,
    nodeKeys: Object.keys(node || {}).sort(),
    dataKeys: Object.keys(data).sort(),
    idFields: {
      id: data.id ?? null,
      fi: data.fi ?? null,
      component: data.component ?? null,
      componentId: data.componentId ?? null,
      instance: data.instance ?? null,
      source: data.source ?? null,
    },
    transform: {
      position: data.position ?? node?.position ?? null,
      x: data.x ?? null,
      y: data.y ?? null,
      z: data.z ?? null,
      rotation: data.rotation ?? node?.rotation ?? null,
      scale: data.scale ?? node?.scale ?? null,
    },
    material: material ? {
      name: material.name ?? null,
      id: material.id ?? null,
      uuid: material.uuid ?? null,
      layerCount: Array.isArray(material.layers) ? material.layers.length : null,
      layerIds: Array.isArray(material.layers) ? material.layers.map((layer) => layer?.id ?? null) : null,
    } : null,
    component: safe(node?.component ?? data.component ?? data.componentId ?? null),
    stateFields: {
      states: safe(node?.states ?? data.states ?? null),
      events: safe(node?.events ?? data.events ?? null),
      overrides: safe(node?.overrides ?? data.overrides ?? null),
      props: safe(node?.props ?? data.props ?? null),
      operations: safe(node?.operations ?? data.operations ?? null),
    },
  };
}

const msgpackr = require(msgpackrPath);
register(msgpackr);
const bytes = fs.readFileSync(payload);
const root = new msgpackr.Unpackr({ structuredClone: true }).unpackMultiple(bytes)[0];
const records = [];
const allInteresting = [];
let boxesPath = null;
walkTree(root?.scene?.objects, (node, objectPath) => {
  const depth = objectPath.split('.children.').length - 1;
  const record = nodeRecord(node, objectPath, depth);
  records.push(record);
  if (record.name === 'Boxes') boxesPath = objectPath;
  if (record.name?.includes('Cube') || record.type?.includes('Instance') || record.component || record.material) allInteresting.push(record);
});

const boxes = boxesPath ? pathValue(root, boxesPath.replace(/^root\./, '').split('.')) : null;
const descendants = [];
function walkDesc(node, objectPath, depth) {
  if (!node) return;
  descendants.push(nodeRecord(node, objectPath, depth));
  (node.children || []).forEach((child, index) => walkDesc(child, `${objectPath}.children.${index}`, depth + 1));
}
if (boxes) walkDesc(boxes, boxesPath, 0);

const result = {
  payload: { path: payload, bytes: bytes.length, sha256: crypto.createHash('sha256').update(bytes).digest('hex') },
  rootKeys: Object.keys(root || {}).sort(),
  boxesPath,
  boxesChildren: boxes?.children?.length ?? null,
  treeNodeCount: records.length,
  cubeNamed: records.filter((item) => item.name === 'Cube').length,
  instanceNamed: records.filter((item) => (item.name || '').includes('Instance')).length,
  boxesDescendants: descendants,
  interestingOutsideBoxes: allInteresting.filter((item) => !item.path.startsWith(`${boxesPath}.`)),
};
console.log(JSON.stringify(result, null, 2));
