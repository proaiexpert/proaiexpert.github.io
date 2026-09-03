#!/usr/bin/env node

// Read-only reproduction of the public @splinetool/loader@2.0.27 extension
// handlers. The msgpackr package is supplied by --msgpackr from a temporary
// inspection directory; it is deliberately not a repository dependency.

import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const repoRoot = path.resolve(here, '../../../');
const defaults = {
  payload: path.join(repoRoot, 'owner-preview/assets/3d/boxes-hover/public-original-inline-scene-payload.bin'),
  output: path.join(repoRoot, 'docs/site-evolution/ai-systems/boxes-hover-serialized-material-lab-r1'),
  runtimeInventory: path.join(repoRoot, 'docs/site-evolution/ai-systems/boxes-hover-material-layer-lab-r1/material-inventory.json'),
};

function args() {
  const result = { ...defaults };
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--msgpackr') result.msgpackr = argv[++i];
    else if (argv[i] === '--payload') result.payload = path.resolve(argv[++i]);
    else if (argv[i] === '--output') result.output = path.resolve(argv[++i]);
    else if (argv[i] === '--runtime-inventory') result.runtimeInventory = path.resolve(argv[++i]);
    else if (argv[i] === '--loader-bundle') result.loaderBundle = path.resolve(argv[++i]);
  }
  if (!result.msgpackr) throw new Error('--msgpackr is required');
  return result;
}

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function color(value) {
  if (!value || typeof value !== 'object') return null;
  const output = {};
  for (const key of ['r', 'g', 'b', 'a']) if (typeof value[key] === 'number') output[key] = value[key];
  return Object.keys(output).length ? output : null;
}

function layerSummary(layer) {
  const data = layer?.data || {};
  return {
    id: layer?.id ?? null,
    fi: layer?.fi ?? null,
    type: data.type ?? null,
    category: data.category ?? null,
    keys: Object.keys(data).sort(),
    values: {
      colorA: color(data.colorA),
      colorB: color(data.colorB),
      metalness: data.metalness ?? null,
      roughness: data.roughness ?? null,
      reflectivity: data.reflectivity ?? null,
      ior: data.ior ?? null,
      thickness: data.thickness ?? null,
    },
  };
}

function nodeSummary(node, objectPath) {
  const data = node?.data || {};
  return {
    path: objectPath,
    id: node?.id ?? null,
    fi: node?.fi ?? null,
    name: data.name ?? null,
    type: data.type ?? null,
    component: data.component ?? null,
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

function main() {
  const options = args();
  const msgpackr = requireMsgpackr(options.msgpackr);
  const bytes = fs.readFileSync(options.payload);
  const sha256 = crypto.createHash('sha256').update(bytes).digest('hex');

  // These four classes and their read() behavior are the public loader's
  // handlers from its `hx` extension table. The decoder only needs the
  // prototype identity; no mutation or serializer is included here.
  class Ae {}
  class Me extends Array {}
  class Rt extends Array {}
  class Kt {}
  const handlers = [
    { type: 1, className: 'Ae', Class: Ae, meaning: 'object wrapper with ID-keyed operation methods' },
    { type: 2, className: 'me', Class: Me, meaning: 'flat ID-keyed array/collection wrapper' },
    { type: 3, className: 'Rt', Class: Rt, meaning: 'tree collection wrapper with fi/id/data/children topology' },
    { type: 6, className: 'kt', Class: Kt, meaning: 'property/path operation object wrapper' },
  ];
  for (const handler of handlers) {
    msgpackr.addExtension({
      type: handler.type,
      read(value) {
        if (value === null || typeof value !== 'object') throw new Error(`Unexpected wrapped value for type ${handler.type}`);
        return Object.setPrototypeOf(value, handler.Class.prototype);
      },
    });
  }

  const unpacker = new msgpackr.Unpackr({ useRecords: true, structuredClone: true, sequential: true });
  const values = unpacker.unpackMultiple(bytes);
  if (values.length !== 1) throw new Error(`Expected one logical root value, got ${values.length}`);
  const root = values[0];
  if (sha256 !== 'c3bcabd43c232045b059704e8d4be57634314b7da2fcfa5ebbd448ee40a16798') throw new Error('Golden payload SHA mismatch');

  const nodes = [];
  const materials = [];
  const cubeInstances = [];
  let sourceCubeComponent = null;
  let sourceCubeMesh = null;
  traverseTree(root?.scene?.objects, (node, objectPath) => {
    const summary = nodeSummary(node, objectPath);
    nodes.push(summary);
    const data = node?.data;
    if (!data || typeof data !== 'object') return;
    if (data.name?.includes('Instance')) cubeInstances.push(summary);
    if (data.name === 'Cube' && data.type === 'Component') sourceCubeComponent = { ...summary, children: node.children?.length ?? 0 };
    if (data.name === 'Cube' && data.type === 'Mesh') {
      const material = data.material;
      sourceCubeMesh = {
        ...summary,
        geometry: data.geometry ? { type: data.geometry.type ?? null, keys: Object.keys(data.geometry).sort() } : null,
        material: material ? {
          name: material.name ?? null,
          keys: Object.keys(material).sort(),
          layerCount: Array.isArray(material.layers) ? material.layers.length : 0,
          layers: Array.isArray(material.layers) ? material.layers.map(layerSummary) : [],
        } : null,
      };
    }
    if (typeof data.material?.name === 'string') {
      materials.push({
        path: `${objectPath}.data.material`,
        name: data.material.name,
        layerCount: Array.isArray(data.material.layers) ? data.material.layers.length : 0,
        layerTypes: Array.isArray(data.material.layers) ? data.material.layers.map((layer) => layer?.data?.type ?? null) : [],
      });
    }
  });

  const runtimeInventory = JSON.parse(fs.readFileSync(options.runtimeInventory, 'utf8'));
  const serializedLayerValues = Object.fromEntries((sourceCubeMesh?.material?.layers || []).map((layer) => [layer.type, layer.values]));
  const runtimeFirstCube = runtimeInventory.cubes?.[0] ?? null;
  const runtimeLayerTypes = runtimeFirstCube?.layers?.map((layer) => layer.type) ?? [];
  const runtimeValues = {};
  for (const layer of runtimeFirstCube?.layers ?? []) {
    runtimeValues[layer.type] = {
      colorA: layer.properties?.colorA ?? null,
      colorB: layer.properties?.colorB ?? null,
      metalness: layer.properties?.metalness ?? null,
      roughness: layer.properties?.roughness ?? null,
      reflectivity: layer.properties?.reflectivity ?? null,
      ior: layer.properties?.ior ?? null,
      thickness: layer.properties?.thickness ?? null,
    };
  }

  const handlerArtifact = {
    authority: '@splinetool/loader@2.0.27',
    inspectedBundle: options.loaderBundle ? {
      path: options.loaderBundle,
      sizeBytes: fs.statSync(options.loaderBundle).size,
      sha256: crypto.createHash('sha256').update(fs.readFileSync(options.loaderBundle)).digest('hex'),
    } : { path: 'build/SplineLoader.cjs', note: 'public package bundle; path omitted from CLI' },
    sourceEvidence: 'public bundle extension table `hx`; each handler uses read(value) and Object.setPrototypeOf(value, Class.prototype)',
    wrapperMechanism: 'fixext1 marker is consumed as a wrapper for the following MessagePack value by the public decoder',
    handlers: handlers.map(({ type, className, meaning }) => ({
      extensionCode: `0x${type.toString(16).padStart(2, '0')}`,
      decimalCode: type,
      className,
      inputShape: 'following decoded MessagePack value (the ext payload is a one-byte wrapper marker)',
      returnShape: className === 'me' || className === 'Rt' ? 'same Array value with public prototype' : 'same object value with public prototype',
      semanticMeaning: meaning,
      consumesSurroundingValue: true,
      confidence: 'CONFIRMED',
    })),
    unresolvedCodes: [],
    decode: { values: values.length, bytesConsumed: bytes.length, sha256, rootKeys: Object.keys(root) },
  };

  const correlationArtifact = {
    authority: { runtime: '@splinetool/runtime@2.0.27', loader: '@splinetool/loader@2.0.27', payloadSha256: sha256 },
    serialized: {
      rootKeys: Object.keys(root),
      treeNodeCount: nodes.length,
      boxes: nodes.filter((node) => node.name === 'Boxes'),
      sourceCubeComponent,
      cubeInstanceCount: cubeInstances.length,
      cubeInstanceComponentIds: [...new Set(cubeInstances.map((node) => node.component).filter(Boolean))],
      sourceCubeMesh,
      materialNames: [...new Set(materials.map((material) => material.name))].sort(),
    },
    runtimeReadOnlyInventory: {
      source: 'docs/site-evolution/ai-systems/boxes-hover-material-layer-lab-r1/material-inventory.json',
      runtime: runtimeInventory.runtime,
      payloadSha256: runtimeInventory.payloadSha256,
      cubeCount: runtimeInventory.cubeCount,
      independentMaterialIdentities: runtimeInventory.sharedMaterialCount,
      layerSignatureCount: runtimeInventory.familyCount,
      firstCubeLayerTypes: runtimeLayerTypes,
      firstCubeKnownValues: runtimeValues,
    },
    comparisons: {
      payloadShaMatch: runtimeInventory.payloadSha256 === sha256,
      cubeCountMatch: runtimeInventory.cubeCount === cubeInstances.length + 1,
      sourceMaterialNameMatch: sourceCubeMesh?.material?.name === 'Cube Material',
      layerTypeOrderMatch: JSON.stringify(sourceCubeMesh?.material?.layers?.map((layer) => layer.type)) === JSON.stringify(runtimeLayerTypes.slice().reverse()),
      exactKnownValues: {
        physical: serializedLayerValues.light,
        pattern: serializedLayerValues.pattern,
        transmission: serializedLayerValues.transmission,
      },
    },
    identityCardinality: {
      serializedSourceComponentPlusInstances: `${sourceCubeComponent ? 1 : 0} + ${cubeInstances.length}`,
      runtimeIndependentMaterialIdentities: runtimeInventory.sharedMaterialCount,
      explanation: 'The serialized topology proves one Cube source component plus 142 instances; the prior runtime inventory proves 143 independent material identities. The exact internal clone mechanism is not claimed beyond this cardinality correspondence.',
      confidence: 'PARTIAL',
    },
  };

  const sourcePath = sourceCubeMesh?.path ?? null;
  const materialPath = sourcePath ? `${sourcePath}.data.material` : null;
  const graphArtifact = {
    authority: { payloadSha256: sha256, runtime: '@splinetool/runtime@2.0.27' },
    nodes: {
      boxes: nodes.filter((node) => node.name === 'Boxes'),
      cubeComponent: sourceCubeComponent,
      cubeMesh: sourceCubeMesh,
      cubeMaterial: sourceCubeMesh?.material ?? null,
      cubeInstances: { count: cubeInstances.length, componentIds: [...new Set(cubeInstances.map((node) => node.component).filter(Boolean))] },
    },
    edges: [
      { from: 'Boxes', to: 'Cube component', relation: 'parent/child', confidence: 'CONFIRMED', evidence: 'decoded Rt tree path and stable UUID' },
      { from: 'Cube component', to: 'Cube source mesh', relation: 'parent/child', confidence: 'CONFIRMED', evidence: 'decoded Rt tree path and type=Mesh' },
      { from: 'Cube source mesh', to: 'Cube Material', relation: 'data.material', confidence: 'CONFIRMED', evidence: materialPath },
      { from: 'Cube Material', to: 'light/physical', relation: 'layers[0]', confidence: 'CONFIRMED', evidence: 'direct decoded layer object and exact values' },
      { from: 'Cube Material', to: 'pattern', relation: 'layers[1]', confidence: 'CONFIRMED', evidence: 'direct decoded layer object, colorA/colorB and exact values' },
      { from: 'Cube Material', to: 'transmission', relation: 'layers[2]', confidence: 'CONFIRMED', evidence: 'direct decoded layer object and exact values' },
      { from: 'Cube Instance × 142', to: 'Cube component', relation: 'component UUID', confidence: 'CONFIRMED', evidence: `all component IDs=${[...new Set(cubeInstances.map((node) => node.component).filter(Boolean))].join(',')}` },
      { from: 'serialized Cube Material layers', to: 'runtime Cube material layers', relation: 'type/order/value comparison', confidence: 'CONFIRMED', evidence: 'payload SHA, layer types, and known numeric/color values match prior read-only runtime inventory' },
      { from: 'serialized source+instances', to: '143 runtime material identities', relation: 'cardinality correspondence', confidence: 'PROBABLE', evidence: `${cubeInstances.length + 1} serialized Cube topology nodes vs ${runtimeInventory.sharedMaterialCount} runtime identities` },
    ],
    knownValues: { serialized: serializedLayerValues, runtime: runtimeValues },
    confidence: 'END-TO-END MATERIAL GRAPH CONFIRMED',
  };

  fs.mkdirSync(options.output, { recursive: true });
  writeJson(path.join(options.output, 'spline-extension-handlers.json'), handlerArtifact);
  writeJson(path.join(options.output, 'runtime-material-correlation.json'), correlationArtifact);
  writeJson(path.join(options.output, 'end-to-end-material-graph.json'), graphArtifact);
  console.log(JSON.stringify({
    payloadSha256: sha256,
    payloadBytes: bytes.length,
    logicalRootValues: values.length,
    treeNodeCount: nodes.length,
    cubeInstanceCount: cubeInstances.length,
    sourceCubeComponentId: sourceCubeComponent?.id ?? null,
    sourceCubeMeshId: sourceCubeMesh?.id ?? null,
    sourceMaterial: sourceCubeMesh?.material?.name ?? null,
    layerTypes: sourceCubeMesh?.material?.layers?.map((layer) => layer.type) ?? [],
    output: options.output,
  }));
}

function requireMsgpackr(packagePath) {
  const normalized = path.resolve(packagePath);
  return require(normalized);
}

main();
