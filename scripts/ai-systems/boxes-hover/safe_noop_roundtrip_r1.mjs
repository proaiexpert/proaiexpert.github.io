#!/usr/bin/env node

// Read-only Golden payload no-op round-trip using the exact public
// @splinetool/loader@2.0.27 MessagePack extension table. This script writes
// only an experimental copy and never mutates the Golden payload.

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
  output: path.join(repoRoot, 'docs/site-evolution/ai-systems/boxes-hover-serialized-material-lab-r1/noop-roundtrip-r1'),
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

function sha256(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') {
    const output = {};
    for (const key of Object.keys(value).sort()) output[key] = stable(value[key]);
    return output;
  }
  return value;
}

function valueOrNull(value) {
  return value === undefined ? null : value;
}

function color(value) {
  if (!value || typeof value !== 'object') return null;
  return Object.fromEntries(['r', 'g', 'b', 'a']
    .filter((key) => typeof value[key] === 'number')
    .map((key) => [key, value[key]]));
}

function layerSnapshot(layer) {
  const data = layer?.data || {};
  return {
    id: valueOrNull(layer?.id),
    fi: valueOrNull(layer?.fi),
    type: valueOrNull(data.type),
    category: valueOrNull(data.category),
    colorA: color(data.colorA),
    colorB: color(data.colorB),
    metalness: valueOrNull(data.metalness),
    roughness: valueOrNull(data.roughness),
    reflectivity: valueOrNull(data.reflectivity),
    ior: valueOrNull(data.ior),
    thickness: valueOrNull(data.thickness),
    keys: Object.keys(data).sort(),
  };
}

function nodeSnapshot(node, objectPath) {
  const data = node?.data || {};
  return {
    path: objectPath,
    id: valueOrNull(node?.id),
    fi: valueOrNull(node?.fi),
    name: valueOrNull(data.name),
    type: valueOrNull(data.type),
    component: valueOrNull(data.component),
    childCount: Array.isArray(node?.children) ? node.children.length : 0,
  };
}

function traverseTree(root, callback, objectPath = 'scene.objects') {
  if (!Array.isArray(root)) return;
  root.forEach((node, index) => {
    const currentPath = `${objectPath}.${index}`;
    callback(node, currentPath);
    traverseTree(node?.children, callback, `${currentPath}.children`);
  });
}

function collectStringHits(value, pathName, hits, seen = new WeakSet()) {
  if (typeof value === 'string') {
    if (/^(MouseHover|hoverRotateDamping|hoverRotatePanMode|hoverRotatePanStrength|resetHoverEffectOnPointerLeave|events|states)$/.test(value)) {
      hits.push({ path: pathName, value });
    }
    return;
  }
  if (!value || typeof value !== 'object') return;
  if (seen.has(value)) return;
  seen.add(value);
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectStringHits(item, `${pathName}.${index}`, hits, seen));
    return;
  }
  for (const key of Object.keys(value)) collectStringHits(value[key], `${pathName}.${key}`, hits, seen);
}

function makeSemanticSnapshot(root) {
  const nodes = [];
  const cubeInstances = [];
  let boxes = null;
  let sourceCubeComponent = null;
  let sourceCubeMesh = null;
  let camera = null;

  traverseTree(root?.scene?.objects, (node, objectPath) => {
    const summary = nodeSnapshot(node, objectPath);
    nodes.push(summary);
    const data = node?.data || {};
    if (summary.name === 'Boxes') boxes = summary;
    if (summary.name?.includes('Instance')) cubeInstances.push(summary);
    if (summary.name === 'Cube' && summary.type === 'Component') {
      sourceCubeComponent = { ...summary, children: node.children?.length ?? 0 };
    }
    if (summary.name === 'Cube' && summary.type === 'Mesh') {
      sourceCubeMesh = {
        ...summary,
        geometry: data.geometry ? { type: valueOrNull(data.geometry.type), keys: Object.keys(data.geometry).sort() } : null,
        material: data.material ? {
          name: valueOrNull(data.material.name),
          keys: Object.keys(data.material).sort(),
          layers: Array.isArray(data.material.layers) ? data.material.layers.map(layerSnapshot) : [],
        } : null,
      };
    }
    if (summary.type === 'OrthographicCamera' || data.type === 'OrthographicCamera') {
      camera = { ...summary, dataKeys: Object.keys(data).sort() };
    }
  });

  const protocolHits = [];
  collectStringHits(root, 'root', protocolHits);

  const material = sourceCubeMesh?.material ?? null;
  return stable({
    rootKeys: Object.keys(root || {}).sort(),
    runtimeVersion: valueOrNull(root?.version),
    sceneObjectRootCount: Array.isArray(root?.scene?.objects) ? root.scene.objects.length : null,
    treeNodeCount: nodes.length,
    boxes,
    sourceCubeComponent,
    sourceCubeMesh: material ? {
      path: sourceCubeMesh.path,
      id: sourceCubeMesh.id,
      geometry: sourceCubeMesh.geometry,
      material: {
        name: material.name,
        keys: material.keys,
        layerCount: material.layers.length,
        layers: material.layers,
      },
    } : sourceCubeMesh,
    cubeInstanceCount: cubeInstances.length,
    cubeInstanceComponentIds: [...new Set(cubeInstances.map((node) => node.component).filter(Boolean))].sort(),
    camera,
    protocolHits,
    hoverEventData: {
      hoverRotateDamping: findNumericValues(root, 'hoverRotateDamping'),
      hoverRotatePanStrength: findNumericValues(root, 'hoverRotatePanStrength'),
      resetHoverEffectOnPointerLeave: findBooleanValues(root, 'resetHoverEffectOnPointerLeave'),
    },
  });
}

function findNumericValues(root, targetKey) {
  const values = [];
  walkKeyValues(root, targetKey, (value, keyPath) => {
    if (typeof value === 'number') values.push({ path: keyPath, value });
  });
  return values;
}

function findBooleanValues(root, targetKey) {
  const values = [];
  walkKeyValues(root, targetKey, (value, keyPath) => {
    if (typeof value === 'boolean') values.push({ path: keyPath, value });
  });
  return values;
}

function walkKeyValues(value, targetKey, callback, pathName = 'root', seen = new WeakSet()) {
  if (!value || typeof value !== 'object' || seen.has(value)) return;
  seen.add(value);
  if (Array.isArray(value)) {
    value.forEach((item, index) => walkKeyValues(item, targetKey, callback, `${pathName}.${index}`, seen));
    return;
  }
  for (const key of Object.keys(value)) {
    const keyPath = `${pathName}.${key}`;
    if (key === targetKey) callback(value[key], keyPath);
    walkKeyValues(value[key], targetKey, callback, keyPath, seen);
  }
}

function registerPublicExtensions(msgpackr) {
  // Exact public hx table from @splinetool/loader@2.0.27. The write paths are
  // included only to test a no-op serialization; no source values are changed.
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
  for (const definition of definitions) {
    msgpackr.addExtension({
      Class: definition.Class,
      type: definition.type,
      write: definition.write,
      read: definition.read,
    });
  }
  return definitions;
}

function diffBytes(before, after) {
  const max = Math.max(before.length, after.length);
  const ranges = [];
  let range = null;
  let differentBytes = 0;
  for (let index = 0; index < max; index += 1) {
    const different = before[index] !== after[index];
    if (different) {
      differentBytes += 1;
      if (!range) range = { start: index, end: index };
      else range.end = index;
    } else if (range) {
      ranges.push(range);
      range = null;
    }
  }
  if (range) ranges.push(range);
  return {
    identical: before.length === after.length && differentBytes === 0,
    beforeBytes: before.length,
    afterBytes: after.length,
    sizeDelta: after.length - before.length,
    differentBytes,
    differingRangeCount: ranges.length,
    firstDifferingOffset: ranges[0]?.start ?? null,
    differingRangesPreview: ranges.slice(0, 20),
  };
}

function decodeOne(msgpackr, bytes) {
  const unpacker = new msgpackr.Unpackr({ structuredClone: true });
  const values = unpacker.unpackMultiple(bytes);
  if (values.length !== 1) throw new Error(`Expected one logical root value, got ${values.length}`);
  return values[0];
}

function main() {
  const options = parseArgs();
  const msgpackr = require(options.msgpackr);
  const goldenBytes = fs.readFileSync(options.payload);
  const goldenSha = sha256(goldenBytes);
  if (goldenSha !== GOLDEN_SHA) throw new Error(`Golden payload SHA mismatch: ${goldenSha}`);

  const definitions = registerPublicExtensions(msgpackr);
  const goldenRoot = decodeOne(msgpackr, goldenBytes);
  const goldenSnapshot = makeSemanticSnapshot(goldenRoot);
  const goldenSnapshotSha = sha256(Buffer.from(JSON.stringify(goldenSnapshot)));

  // Exact public serializer construction observed in SplineLoader.cjs:
  // EL = new Packr({ structuredClone: true }); for (const hx of handlers) ux(hx).
  const packer = new msgpackr.Packr({ structuredClone: true });
  const roundtripBytes = Buffer.from(packer.pack(goldenRoot));
  const roundtripSha = sha256(roundtripBytes);

  fs.mkdirSync(options.output, { recursive: true });
  const roundtripPath = path.join(options.output, 'boxes-hover-noop-roundtrip-r1.bin');
  fs.writeFileSync(roundtripPath, roundtripBytes);

  const roundtripRoot = decodeOne(msgpackr, roundtripBytes);
  const roundtripSnapshot = makeSemanticSnapshot(roundtripRoot);
  const roundtripSnapshotSha = sha256(Buffer.from(JSON.stringify(roundtripSnapshot)));
  const byteDiff = diffBytes(goldenBytes, roundtripBytes);
  const semanticEqual = JSON.stringify(goldenSnapshot) === JSON.stringify(roundtripSnapshot);

  const evidence = {
    protocol: 'MessagePack with Spline application extensions and msgpackr records',
    encoderAuthority: '@splinetool/loader@2.0.27 public serializer: Packr({structuredClone:true}) plus hx extension table',
    options: { structuredClone: true, useRecords: 'Packr default, matching public loader construction', sequential: false },
    payload: {
      golden: { path: options.payload, bytes: goldenBytes.length, sha256: goldenSha },
      experimentalNoop: { path: roundtripPath, bytes: roundtripBytes.length, sha256: roundtripSha },
    },
    extensions: definitions.map(({ type, Class }) => ({ type: `0x${type.toString(16).padStart(2, '0')}`, className: Class.name, writeRead: 'public hx write/read reproduced' })),
    byteDiff,
    semantic: {
      goldenSnapshotSha256: goldenSnapshotSha,
      roundtripSnapshotSha256: roundtripSnapshotSha,
      equal: semanticEqual,
      golden: goldenSnapshot,
      roundtrip: roundtripSnapshot,
    },
    verdict: {
      byteIdentical: byteDiff.identical,
      semanticPass: semanticEqual,
      goldenModified: false,
      intentionalPayloadMutation: false,
    },
  };
  writeJson(path.join(options.output, 'noop-roundtrip-evidence.json'), evidence);
  console.log(JSON.stringify({
    goldenSha,
    goldenBytes: goldenBytes.length,
    roundtripSha,
    roundtripBytes: roundtripBytes.length,
    byteIdentical: byteDiff.identical,
    differentBytes: byteDiff.differentBytes,
    semanticPass: semanticEqual,
    goldenSnapshotSha256: goldenSnapshotSha,
    roundtripSnapshotSha256: roundtripSnapshotSha,
    roundtripPath,
    output: options.output,
  }));
}

main();
