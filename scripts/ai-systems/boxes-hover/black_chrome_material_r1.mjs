#!/usr/bin/env node

// Read-only source-level material candidate generator for the Golden Boxes
// Hover payload. The Golden file is never overwritten and no runtime material
// mutation is performed. Each candidate is encoded with the public
// @splinetool/loader@2.0.27 MessagePack extension table.

import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const repoRoot = path.resolve(here, '../../../');
const GOLDEN_SHA = 'c3bcabd43c232045b059704e8d4be57634314b7da2fcfa5ebbd448ee40a16798';
const GOLDEN_BYTES = 46215;
const SOURCE_MESH_ID = '2264fe3b-7194-4ee4-adea-5fa8fa9f00b1';
const SOURCE_COMPONENT_ID = '59d52622-c138-4b29-ad19-059c64a37d07';
const defaults = {
  payload: path.join(repoRoot, 'owner-preview/assets/3d/boxes-hover/public-original-inline-scene-payload.bin'),
  output: path.join(repoRoot, 'docs/site-evolution/ai-systems/boxes-hover-black-chrome-material-r1/preview/assets'),
  evidence: path.join(repoRoot, 'docs/site-evolution/ai-systems/boxes-hover-black-chrome-material-r1/black-chrome-material-r1-evidence.json'),
  name: 'r1',
  physical: { metalness: 0.76, roughness: 0.24, reflectivity: 0.52 },
  pattern: { colorA: { r: 26 / 255, g: 32 / 255, b: 39 / 255, a: 1 }, colorB: { r: 2 / 255, g: 3 / 255, b: 4 / 255, a: 1 } },
};

const COLORS = {
  gunmetal: { r: 26 / 255, g: 32 / 255, b: 39 / 255, a: 1 },
  obsidian: { r: 2 / 255, g: 3 / 255, b: 4 / 255, a: 1 },
};

function parseHexColor(value) {
  const hex = String(value).replace(/^#/, '');
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) throw new Error(`Expected six-digit hex color, got ${value}`);
  return {
    r: Number.parseInt(hex.slice(0, 2), 16) / 255,
    g: Number.parseInt(hex.slice(2, 4), 16) / 255,
    b: Number.parseInt(hex.slice(4, 6), 16) / 255,
    a: 1,
  };
}

function parseArgs() {
  const options = { ...defaults };
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--msgpackr') options.msgpackr = path.resolve(argv[++i]);
    else if (argv[i] === '--payload') options.payload = path.resolve(argv[++i]);
    else if (argv[i] === '--output') options.output = path.resolve(argv[++i]);
    else if (argv[i] === '--evidence') options.evidence = path.resolve(argv[++i]);
    else if (argv[i] === '--name') options.name = argv[++i];
    else if (argv[i] === '--metalness') options.physical.metalness = Number(argv[++i]);
    else if (argv[i] === '--roughness') options.physical.roughness = Number(argv[++i]);
    else if (argv[i] === '--reflectivity') options.physical.reflectivity = Number(argv[++i]);
    else if (argv[i] === '--color-a') options.pattern.colorA = parseHexColor(argv[++i]);
    else if (argv[i] === '--color-b') options.pattern.colorB = parseHexColor(argv[++i]);
  }
  if (!options.msgpackr) throw new Error('--msgpackr is required');
  return options;
}

function sha256(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

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
  for (const definition of definitions) msgpackr.addExtension(definition);
  return definitions;
}

function decodeOne(msgpackr, bytes) {
  const unpacker = new msgpackr.Unpackr({ structuredClone: true });
  const values = unpacker.unpackMultiple(bytes);
  if (values.length !== 1) throw new Error(`Expected one logical root value, got ${values.length}`);
  return values[0];
}

function jsonSnapshot(value) {
  return JSON.parse(JSON.stringify(value));
}

function walkTree(nodes, callback, pathName = 'root.scene.objects') {
  if (!Array.isArray(nodes)) return;
  nodes.forEach((node, index) => {
    const currentPath = `${pathName}.${index}`;
    callback(node, currentPath);
    walkTree(node?.children, callback, `${currentPath}.children`);
  });
}

function findSourceMesh(root) {
  const matches = [];
  walkTree(root?.scene?.objects, (node, objectPath) => {
    const data = node?.data || {};
    if (data.type === 'Mesh' && node?.id === SOURCE_MESH_ID) matches.push({ node, objectPath });
  });
  if (matches.length !== 1) throw new Error(`Expected one source Cube mesh, got ${matches.length}`);
  const source = matches[0];
  if (source.node?.data?.name !== 'Cube') throw new Error('Source mesh name is not Cube');
  if (source.node?.data?.material?.name !== 'Cube Material') throw new Error('Source mesh material is not Cube Material');
  return source;
}

function findLayer(material, type, category = undefined) {
  const matches = (material?.layers || []).filter((layer) => {
    const data = layer?.data || {};
    return data.type === type && (category === undefined || data.category === category);
  });
  if (matches.length !== 1) throw new Error(`Expected one ${type} layer, got ${matches.length}`);
  return matches[0];
}

function rgba(value) {
  return ['r', 'g', 'b', 'a'].map((key) => value?.[key]);
}

function materialSnapshot(root) {
  const { node, objectPath } = findSourceMesh(root);
  const material = node.data.material;
  const physical = findLayer(material, 'light', 'physical').data;
  const pattern = findLayer(material, 'pattern').data;
  const transmission = findLayer(material, 'transmission').data;
  return {
    sourceMeshPath: objectPath,
    sourceMeshId: node.id,
    sourceComponentId: root?.scene?.objects?.[0]?.children?.[2]?.children?.[0]?.id ?? null,
    materialName: material.name,
    layerTypes: material.layers.map((layer) => layer?.data?.type ?? null),
    physical: {
      metalness: physical.metalness,
      roughness: physical.roughness,
      reflectivity: physical.reflectivity,
    },
    pattern: {
      colorA: rgba(pattern.colorA),
      colorB: rgba(pattern.colorB),
      size: pattern.size,
      rotation: pattern.rotation,
      style: pattern.style,
    },
    transmission: {
      thickness: transmission.thickness,
      ior: transmission.ior,
      roughness: transmission.roughness,
    },
  };
}

function treeSnapshot(root) {
  const nodes = [];
  const cubeMeshes = [];
  const cubeInstances = [];
  let boxes = null;
  let sourceComponent = null;
  let camera = null;
  walkTree(root?.scene?.objects, (node, objectPath) => {
    const data = node?.data || {};
    const summary = {
      path: objectPath,
      id: node?.id ?? null,
      fi: node?.fi ?? null,
      name: data.name ?? null,
      type: data.type ?? null,
      component: data.component ?? null,
      childCount: Array.isArray(node?.children) ? node.children.length : 0,
    };
    nodes.push(summary);
    if (summary.name === 'Boxes') boxes = summary;
    if (summary.name === 'Cube' && summary.type === 'Component') sourceComponent = summary;
    if (summary.name === 'Cube' && summary.type === 'Mesh') cubeMeshes.push(summary);
    if (summary.name?.includes('Instance')) cubeInstances.push(summary);
    if (summary.type === 'OrthographicCamera') camera = summary;
  });
  return {
    rootKeys: Object.keys(root || {}).sort(),
    version: root?.version ?? null,
    nodeCount: nodes.length,
    boxes,
    sourceComponent,
    cubeMeshCount: cubeMeshes.length,
    cubeInstanceCount: cubeInstances.length,
    cubeInstanceComponentIds: [...new Set(cubeInstances.map((node) => node.component).filter(Boolean))].sort(),
    camera,
    material: materialSnapshot(root),
  };
}

function collectLeafDiff(before, after, pathName = 'root', output = []) {
  const beforeObject = before && typeof before === 'object';
  const afterObject = after && typeof after === 'object';
  if (!beforeObject || !afterObject) {
    if (JSON.stringify(before) !== JSON.stringify(after)) output.push({ path: pathName, before, after });
    return output;
  }
  if (Array.isArray(before) || Array.isArray(after)) {
    const max = Math.max(before?.length ?? 0, after?.length ?? 0);
    for (let i = 0; i < max; i += 1) collectLeafDiff(before?.[i], after?.[i], `${pathName}.${i}`, output);
    return output;
  }
  const keys = [...new Set([...Object.keys(before), ...Object.keys(after)])].sort();
  for (const key of keys) collectLeafDiff(before[key], after[key], `${pathName}.${key}`, output);
  return output;
}

function applyRecipe(root, recipe) {
  const { node } = findSourceMesh(root);
  const material = node.data.material;
  const physical = findLayer(material, 'light', 'physical').data;
  const pattern = findLayer(material, 'pattern').data;
  if (recipe.physical) {
    physical.metalness = recipe.physical.metalness;
    physical.roughness = recipe.physical.roughness;
    physical.reflectivity = recipe.physical.reflectivity;
  }
  if (recipe.pattern) {
    pattern.colorA = { ...recipe.pattern.colorA };
    pattern.colorB = { ...recipe.pattern.colorB };
  }
}

function assertTreeInvariant(baseline, candidate, stageName) {
  const checks = {
    rootKeys: JSON.stringify(baseline.rootKeys) === JSON.stringify(candidate.rootKeys),
    version: baseline.version === candidate.version,
    nodeCount: baseline.nodeCount === candidate.nodeCount && candidate.nodeCount === 163,
    boxesChildCount: baseline.boxes?.childCount === candidate.boxes?.childCount && candidate.boxes?.childCount === 143,
    sourceComponentId: candidate.sourceComponent?.id === SOURCE_COMPONENT_ID,
    cubeMeshCount: baseline.cubeMeshCount === candidate.cubeMeshCount,
    cubeInstanceCount: baseline.cubeInstanceCount === candidate.cubeInstanceCount && candidate.cubeInstanceCount === 142,
    cubeInstanceComponentIds: JSON.stringify(baseline.cubeInstanceComponentIds) === JSON.stringify(candidate.cubeInstanceComponentIds),
    camera: JSON.stringify(baseline.camera) === JSON.stringify(candidate.camera),
    materialName: baseline.material.materialName === candidate.material.materialName && candidate.material.materialName === 'Cube Material',
    layerTypes: JSON.stringify(baseline.material.layerTypes) === JSON.stringify(candidate.material.layerTypes),
    patternStaticFields: baseline.material.pattern.size === candidate.material.pattern.size
      && baseline.material.pattern.rotation === candidate.material.pattern.rotation
      && baseline.material.pattern.style === candidate.material.pattern.style,
    transmission: JSON.stringify(baseline.material.transmission) === JSON.stringify(candidate.material.transmission),
  };
  const failed = Object.entries(checks).filter(([, value]) => !value).map(([key]) => key);
  if (failed.length) throw new Error(`${stageName} invariant failure: ${failed.join(', ')}`);
  return checks;
}

function encodeStage(msgpackr, goldenBytes, baselineRootJson, baselineTreeJson, stageName, recipe, outputPath) {
  const root = decodeOne(msgpackr, goldenBytes);
  const beforeJson = jsonSnapshot(root);
  applyRecipe(root, recipe);
  const afterJson = jsonSnapshot(root);
  const leafDiff = collectLeafDiff(beforeJson, afterJson);
  const allowedPrefixes = [
    'root.scene.objects.0.children.2.children.0.children.0.data.material.layers.0.data.metalness',
    'root.scene.objects.0.children.2.children.0.children.0.data.material.layers.0.data.roughness',
    'root.scene.objects.0.children.2.children.0.children.0.data.material.layers.0.data.reflectivity',
    'root.scene.objects.0.children.2.children.0.children.0.data.material.layers.1.data.colorA',
    'root.scene.objects.0.children.2.children.0.children.0.data.material.layers.1.data.colorB',
  ];
  const disallowedDiff = leafDiff.filter(({ path: changedPath }) => !allowedPrefixes.some((prefix) => changedPath === prefix || changedPath.startsWith(`${prefix}.`)));
  if (disallowedDiff.length) throw new Error(`${stageName} changed disallowed decoded fields: ${JSON.stringify(disallowedDiff.slice(0, 10))}`);

  const packer = new msgpackr.Packr({ structuredClone: true });
  const bytes = Buffer.from(packer.pack(root));
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, bytes);
  const roundtripRoot = decodeOne(msgpackr, bytes);
  const candidate = treeSnapshot(roundtripRoot);
  const baseline = JSON.parse(baselineTreeJson);
  const invariants = assertTreeInvariant(baseline, candidate, stageName);
  const candidateJson = jsonSnapshot(roundtripRoot);
  const roundtripDiff = collectLeafDiff(baselineRootJson ? JSON.parse(baselineRootJson) : {}, candidateJson);
  const roundtripDisallowed = roundtripDiff.filter(({ path: changedPath }) => !allowedPrefixes.some((prefix) => changedPath === prefix || changedPath.startsWith(`${prefix}.`)));
  if (roundtripDisallowed.length) throw new Error(`${stageName} roundtrip changed disallowed decoded fields: ${JSON.stringify(roundtripDisallowed.slice(0, 10))}`);
  return {
    name: stageName,
    outputPath,
    bytes: bytes.length,
    sha256: sha256(bytes),
    recipe,
    decodedMaterial: candidate.material,
    decodedLeafDiff: leafDiff,
    roundtripLeafDiff: roundtripDiff,
    disallowedDecodedChanges: disallowedDiff.length,
    disallowedRoundtripChanges: roundtripDisallowed.length,
    invariants,
  };
}

function main() {
  const options = parseArgs();
  const msgpackr = require(options.msgpackr);
  registerPublicExtensions(msgpackr);
  const goldenBytes = fs.readFileSync(options.payload);
  const goldenSha = sha256(goldenBytes);
  if (goldenBytes.length !== GOLDEN_BYTES || goldenSha !== GOLDEN_SHA) {
    throw new Error(`Golden payload mismatch: ${goldenBytes.length} bytes / ${goldenSha}`);
  }
  const baselineRoot = decodeOne(msgpackr, goldenBytes);
  const baseline = treeSnapshot(baselineRoot);
  const baselineRootJson = JSON.stringify(jsonSnapshot(baselineRoot));
  const baselineTreeJson = JSON.stringify(baseline);
  if (baseline.sourceComponent?.id !== SOURCE_COMPONENT_ID) throw new Error('Unexpected source Cube component ID');
  if (baseline.material.sourceMeshId !== SOURCE_MESH_ID) throw new Error('Unexpected source Cube mesh ID');
  if (baseline.material.materialName !== 'Cube Material') throw new Error('Unexpected source material name');

  const physical = { ...options.physical };
  const stageA = encodeStage(
    msgpackr,
    goldenBytes,
    baselineRootJson,
    baselineTreeJson,
    'stage-a-physical-only',
    { physical, pattern: null, transmission: 'preserved' },
    path.join(options.output, `boxes-hover-black-chrome-stage-a-physical-${options.name}.bin`),
  );
  const stageB = encodeStage(
    msgpackr,
    goldenBytes,
    baselineRootJson,
    baselineTreeJson,
    `stage-b-black-chrome-${options.name}`,
    { physical, pattern: options.pattern, transmission: 'preserved' },
    path.join(options.output, `boxes-hover-black-chrome-${options.name}.bin`),
  );
  const evidence = {
    authority: {
      payloadSha256: goldenSha,
      payloadBytes: goldenBytes.length,
      runtime: '@splinetool/runtime@2.0.27',
      loader: '@splinetool/loader@2.0.27',
      encoder: 'Packr({structuredClone:true}) with public extension table',
    },
    baseline: { decoded: baseline },
    allowedMutationScope: [
      'Cube Material / light physical / metalness',
      'Cube Material / light physical / roughness',
      'Cube Material / light physical / reflectivity',
      'Cube Material / pattern / colorA',
      'Cube Material / pattern / colorB',
    ],
    stages: [stageA, stageB],
    safety: {
      goldenModified: false,
      goldenShaVerified: true,
      manualGeometryReconstruction: false,
      runtimeMaterialMutation: false,
      transmissionModified: false,
      cameraModified: false,
      hoverModified: false,
      labelsAdded: false,
    },
    verdict: 'SERIALIZED BLACK CHROME CANDIDATE GENERATED; RUNTIME QA REQUIRED',
  };
  writeJson(options.evidence, evidence);
  console.log(JSON.stringify({
    goldenSha,
    goldenBytes: goldenBytes.length,
    baseline: {
      nodeCount: baseline.nodeCount,
      cubeMeshCount: baseline.cubeMeshCount,
      cubeInstanceCount: baseline.cubeInstanceCount,
      material: baseline.material,
    },
    stageA: { path: stageA.outputPath, bytes: stageA.bytes, sha256: stageA.sha256 },
    stageB: { path: stageB.outputPath, bytes: stageB.bytes, sha256: stageB.sha256 },
    evidence: options.evidence,
  }, null, 2));
}

main();
