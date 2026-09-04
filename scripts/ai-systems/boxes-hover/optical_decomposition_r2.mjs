#!/usr/bin/env node

// Read-only Golden optical decomposition. This script never writes the
// payload and never starts the Spline runtime.

import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const repoRoot = path.resolve(here, '../../../');
const GOLDEN_SHA = 'c3bcabd43c232045b059704e8d4be57634314b7da2fcfa5ebbd448ee40a16798';
const defaults = {
  payload: path.join(repoRoot, 'owner-preview/assets/3d/boxes-hover/public-original-inline-scene-payload.bin'),
  output: path.join(repoRoot, 'docs/site-evolution/ai-systems/boxes-hover-optical-material-r2/optical-decomposition.json'),
};

function parseArgs() {
  const options = { ...defaults };
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--msgpackr') options.msgpackr = path.resolve(argv[++i]);
    else if (argv[i] === '--payload') options.payload = path.resolve(argv[++i]);
    else if (argv[i] === '--output') options.output = path.resolve(argv[++i]);
  }
  if (!options.msgpackr) throw new Error('--msgpackr is required');
  return options;
}

function sha256(bytes) { return crypto.createHash('sha256').update(bytes).digest('hex'); }

function registerPublicExtensions(msgpackr) {
  class Ae {}
  class Me extends Array {}
  class Rt extends Array {}
  class Rl { constructor(value) { this.id = value; } }
  class Qu { constructor(value) { this.data = value; } }
  class Kt {}
  const definitions = [
    { type: 1, Class: Ae, write: (value) => ({ ...value }), read: (value) => Object.setPrototypeOf(value, Ae.prototype) },
    { type: 2, Class: Me, write: (value) => [...value], read: (value) => Object.setPrototypeOf(value, Me.prototype) },
    { type: 3, Class: Rt, write: (value) => [...value], read: (value) => Object.setPrototypeOf(value, Rt.prototype) },
    { type: 4, Class: Rl, write: (value) => value.id, read: (value) => new Rl(value) },
    { type: 5, Class: Qu, write: (value) => value.data, read: (value) => new Qu(value) },
    { type: 6, Class: Kt, write: (value) => ({ ...value }), read: (value) => Object.setPrototypeOf(value, Kt.prototype) },
  ];
  definitions.forEach((definition) => msgpackr.addExtension(definition));
}

function decodeOne(msgpackr, bytes) {
  const values = new msgpackr.Unpackr({ structuredClone: true }).unpackMultiple(bytes);
  if (values.length !== 1) throw new Error(`Expected one logical root value, got ${values.length}`);
  return values[0];
}

function shortValue(value, depth = 0) {
  if (value === null || value === undefined || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return value ?? null;
  if (depth > 2) return `[${Array.isArray(value) ? 'array' : 'object'}]`;
  if (Array.isArray(value)) return value.slice(0, 16).map((item) => shortValue(item, depth + 1));
  if (typeof value === 'object') {
    const output = {};
    for (const key of Object.keys(value).slice(0, 40)) output[key] = shortValue(value[key], depth + 1);
    return output;
  }
  return String(value);
}

function walkTree(nodes, callback, pathName = 'root.scene.objects') {
  if (!Array.isArray(nodes)) return;
  nodes.forEach((node, index) => {
    const currentPath = `${pathName}.${index}`;
    callback(node, currentPath);
    walkTree(node?.children, callback, `${currentPath}.children`);
  });
}

function findKeyHits(value, pathName, hits, seen = new WeakSet()) {
  if (!value || typeof value !== 'object' || seen.has(value)) return;
  seen.add(value);
  if (Array.isArray(value)) {
    value.forEach((item, index) => findKeyHits(item, `${pathName}.${index}`, hits, seen));
    return;
  }
  for (const key of Object.keys(value)) {
    const keyPath = `${pathName}.${key}`;
    if (/light|environment|envMap|sky|reflection|reflect|intensity|power|ambient|background|fog|shadow/i.test(key)) {
      hits.push({ path: keyPath, key, value: shortValue(value[key]) });
    }
    findKeyHits(value[key], keyPath, hits, seen);
  }
}

function materialSummary(material) {
  if (!material || typeof material !== 'object') return null;
  return {
    name: material.name ?? null,
    keys: Object.keys(material).sort(),
    layers: Array.isArray(material.layers) ? material.layers.map((layer) => ({
      id: layer?.id ?? null,
      keys: Object.keys(layer?.data || {}).sort(),
      data: shortValue(layer?.data || {}),
    })) : [],
  };
}

function main() {
  const options = parseArgs();
  const msgpackr = require(options.msgpackr);
  registerPublicExtensions(msgpackr);
  const bytes = fs.readFileSync(options.payload);
  const payloadSha = sha256(bytes);
  if (payloadSha !== GOLDEN_SHA) throw new Error(`Golden SHA mismatch: ${payloadSha}`);
  const root = decodeOne(msgpackr, bytes);
  const treeNodes = [];
  const lights = [];
  const materials = new Map();
  walkTree(root?.scene?.objects, (node, objectPath) => {
    const data = node?.data || {};
    const summary = {
      path: objectPath,
      id: node?.id ?? null,
      name: data.name ?? null,
      type: data.type ?? null,
      keys: Object.keys(data).sort(),
      position: shortValue(data.position),
      rotation: shortValue(data.rotation),
      scale: shortValue(data.scale),
      transform: shortValue(data.transform),
      color: shortValue(data.color),
      intensity: data.intensity ?? null,
      power: data.power ?? null,
      angle: data.angle ?? null,
      penumbraSize: data.penumbraSize ?? null,
      shadows: data.shadows ?? null,
      shadowResolution: data.shadowResolution ?? null,
      shadowRadius: data.shadowRadius ?? null,
      backgroundColor: shortValue(data.backgroundColor),
      ambient: shortValue(data.ambient),
      sky: shortValue(data.sky),
      postprocessing: shortValue(data.postprocessing),
      material: materialSummary(data.material),
    };
    treeNodes.push(summary);
    if (/light|ambient|directional|point|spot|hemisphere/i.test(`${data.type ?? ''} ${data.name ?? ''}`)) lights.push(summary);
    if (data.material?.name) materials.set(data.material.name, summary.material);
  });
  const keyHits = [];
  findKeyHits(root, 'root', keyHits);
  const scene = root?.scene || {};
  const report = {
    authority: {
      payloadBytes: bytes.length,
      payloadSha256: payloadSha,
      runtime: '@splinetool/runtime@2.0.27',
      mode: 'read-only decoded Golden; no runtime boot and no mutation',
    },
    rootKeys: Object.keys(root || {}).sort(),
    sceneKeys: Object.keys(scene).sort(),
    sceneSummary: shortValue(scene),
    serializedLights: lights,
    serializedLightCount: lights.length,
    materialTypes: [...materials.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([name, material]) => ({ name, material })),
    treeNodeCount: treeNodes.length,
    treeNodes,
    opticalKeyHits: keyHits,
    interpretation: {
      existingSerializedLights: lights.length ? 'IDENTIFIED; inspect listed records' : 'NONE IDENTIFIED IN scene.objects tree',
      environmentFields: keyHits.filter((hit) => /environment|envMap|sky|reflection|background/i.test(hit.key)).length ? 'PRESENT IN DECODED STREAM; inspect paths' : 'NOT IDENTIFIED BY key scan',
      materialTransmission: 'PRESENT in Cube Material transmission layer; source values preserved for diagnostics',
      materialPhysical: 'PRESENT in Cube Material light layer with category physical',
      materialPattern: 'PRESENT in Cube Material pattern layer; colorA/colorB are contrast controls',
      confidence: 'READ-ONLY INVENTORY; visual contribution requires fresh-boot candidate tests',
    },
  };
  fs.mkdirSync(path.dirname(options.output), { recursive: true });
  fs.writeFileSync(options.output, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ output: options.output, payloadBytes: bytes.length, payloadSha, treeNodeCount: treeNodes.length, serializedLightCount: lights.length, materialNames: [...materials.keys()].sort(), opticalKeyHitCount: keyHits.length }, null, 2));
}

main();
