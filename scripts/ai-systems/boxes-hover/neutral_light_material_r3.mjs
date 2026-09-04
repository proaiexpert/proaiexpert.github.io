#!/usr/bin/env node

// Controlled pre-init R3 lookdev for the existing Spline Light Material.
// The Golden and accepted R2 payloads are read-only inputs. Each invocation
// writes a new independent payload and proves that only Light Material
// gradient colors changed relative to R2.

import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const repoRoot = path.resolve(here, '../../../');
const GOLDEN_SHA = 'c3bcabd43c232045b059704e8d4be57634314b7da2fcfa5ebbd448ee40a16798';
const R2_SHA = '9d97237a463dd2846bbf1ad7eb2594409d34a08bd1a2ff20ce08b330af201535';
const R2_DEFAULT = path.join(repoRoot, 'docs/site-evolution/ai-systems/boxes-hover-optical-material-r2/final/boxes-hover-optical-material-r2-final.bin');
const GOLDEN_DEFAULT = path.join(repoRoot, 'owner-preview/assets/3d/boxes-hover/public-original-inline-scene-payload.bin');
const DEFAULT_OUTPUT = path.join(repoRoot, 'docs/site-evolution/ai-systems/boxes-hover-neutral-light-material-r3/candidates');

const RECIPES = {
  'stage-a': {
    label: 'Stage A · luminance-preserving neutralization',
    colors: [
      [0.56015198746787, 0.56015198746787, 0.56015198746787, 1],
      [0.5593021030576, 0.5593021030576, 0.5593021030576, 1],
      [0.76270580197658, 0.76270580197658, 0.76270580197658, 1],
    ],
  },
  'micro-1': {
    label: 'Micro 1 · graphite neutral',
    colors: [
      [0.49411764705882355, 0.5137254901960784, 0.5333333333333333, 1],
      [0.47843137254901963, 0.4980392156862745, 0.5176470588235295, 1],
      [0.6588235294117647, 0.6784313725490196, 0.6980392156862745, 1],
    ],
  },
  'micro-2': {
    label: 'Micro 2 · silver neutral',
    colors: [
      [0.5882352941176471, 0.6078431372549019, 0.6235294117647059, 1],
      [0.5686274509803921, 0.5882352941176471, 0.6039215686274509, 1],
      [0.7725490196078432, 0.788235294117647, 0.803921568627451, 1],
    ],
  },
  'micro-3': {
    label: 'Micro 3 · chrome neutral',
    colors: [
      [0.6470588235294118, 0.6627450980392157, 0.6784313725490196, 1],
      [0.611764705882353, 0.6392156862745098, 0.6549019607843137, 1],
      [0.8156862745098039, 0.8274509803921568, 0.8392156862745098, 1],
    ],
  },
};

function parseArgs() {
  const options = { payload: R2_DEFAULT, golden: GOLDEN_DEFAULT, output: DEFAULT_OUTPUT, name: 'stage-a', recipe: 'stage-a' };
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--msgpackr') options.msgpackr = path.resolve(argv[++i]);
    else if (argv[i] === '--payload') options.payload = path.resolve(argv[++i]);
    else if (argv[i] === '--golden') options.golden = path.resolve(argv[++i]);
    else if (argv[i] === '--output') options.output = path.resolve(argv[++i]);
    else if (argv[i] === '--name') options.name = argv[++i];
    else if (argv[i] === '--recipe') options.recipe = argv[++i];
  }
  if (!options.msgpackr) throw new Error('--msgpackr is required');
  if (!RECIPES[options.recipe]) throw new Error(`Unknown recipe ${options.recipe}`);
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
  [
    { type: 1, Class: Ae, write: (value) => ({ ...value }), read: (value) => Object.setPrototypeOf(value, Ae.prototype) },
    { type: 2, Class: Me, write: (value) => [...value], read: (value) => Object.setPrototypeOf(value, Me.prototype) },
    { type: 3, Class: Rt, write: (value) => [...value], read: (value) => Object.setPrototypeOf(value, Rt.prototype) },
    { type: 4, Class: Rl, write: (value) => value.id, read: (value) => new Rl(value) },
    { type: 5, Class: Qu, write: (value) => value.data, read: (value) => new Qu(value) },
    { type: 6, Class: Kt, write: (value) => ({ ...value }), read: (value) => Object.setPrototypeOf(value, Kt.prototype) },
  ].forEach((definition) => msgpackr.addExtension(definition));
}

function decodeOne(msgpackr, bytes) {
  const values = new msgpackr.Unpackr({ structuredClone: true }).unpackMultiple(bytes);
  if (values.length !== 1) throw new Error(`Expected one logical root value, got ${values.length}`);
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

function walkAny(value, callback, pathName = 'root', seen = new WeakSet()) {
  if (!value || typeof value !== 'object') return;
  if (seen.has(value)) return;
  seen.add(value);
  callback(value, pathName);
  if (Array.isArray(value)) value.forEach((item, index) => walkAny(item, callback, `${pathName}.${index}`, seen));
  else Object.keys(value).forEach((key) => walkAny(value[key], callback, `${pathName}.${key}`, seen));
}

function materialSummary(material) {
  return {
    name: material?.name ?? null,
    layerCount: Array.isArray(material?.layers) ? material.layers.length : 0,
    layers: (material?.layers || []).map((layer, index) => ({
      index,
      id: layer?.id ?? null,
      type: layer?.data?.type ?? null,
      category: layer?.data?.category ?? null,
      keys: Object.keys(layer?.data || {}).sort(),
      alpha: layer?.data?.alpha ?? null,
      colors: layer?.data?.colors ?? null,
    })),
  };
}

function findMaterials(root, name) {
  const matches = [];
  walkAny(root, (value, objectPath) => {
    if (value?.name === name && Array.isArray(value.layers)) matches.push({ path: objectPath, material: value });
  });
  return matches;
}

function ownershipMap(root) {
  const uses = [];
  walkTree(root?.scene?.objects, (node, objectPath) => {
    if (node?.data?.material?.name === 'Light Material') {
      uses.push({ objectPath, objectId: node.id ?? null, objectName: node.data?.name ?? null, objectType: node.data?.type ?? null, materialName: node.data.material.name });
    }
  });
  const materialRecords = findMaterials(root, 'Light Material').map(({ path: materialPath, material }) => ({ path: materialPath, summary: materialSummary(material) }));
  return { uses, materialRecords, uniqueMaterialObjects: new Set(materialRecords.map((record) => JSON.stringify(record.summary))).size };
}

function findGradientLayers(root) {
  const matches = [];
  for (const { path: materialPath, material } of findMaterials(root, 'Light Material')) {
    (material.layers || []).forEach((layer, index) => {
      if (layer?.data?.type === 'gradient' && Array.isArray(layer.data.colors)) matches.push({ materialPath, layerIndex: index, layerId: layer.id ?? null, data: layer.data });
    });
  }
  return matches;
}

function cubeSnapshot(root) {
  let source = null;
  let cubeMeshes = 0;
  let cubeInstances = 0;
  let boxesChildCount = null;
  let nodeCount = 0;
  walkTree(root?.scene?.objects, (node, objectPath) => {
    nodeCount += 1;
    if (node?.data?.name === 'Boxes') boxesChildCount = node.children?.length ?? 0;
    if (node?.data?.name === 'Cube' && node?.data?.type === 'Mesh') {
      cubeMeshes += 1;
      if (node.id === '2264fe3b-7194-4ee4-adea-5fa8fa9f00b1') source = { path: objectPath, material: node.data.material };
    }
    if (node?.data?.name?.includes('Instance')) cubeInstances += 1;
  });
  const material = source?.material;
  const physical = (material?.layers || []).find((layer) => layer?.data?.category === 'physical')?.data;
  const pattern = (material?.layers || []).find((layer) => layer?.data?.type === 'pattern')?.data;
  const transmission = (material?.layers || []).find((layer) => layer?.data?.type === 'transmission')?.data;
  return {
    nodeCount,
    boxesChildCount,
    cubeMeshes,
    cubeInstances,
    sourcePath: source?.path ?? null,
    sourceMaterial: material?.name ?? null,
    physical: physical ? { metalness: physical.metalness, roughness: physical.roughness, reflectivity: physical.reflectivity } : null,
    pattern: pattern ? { colorA: pattern.colorA, colorB: pattern.colorB, size: pattern.size, rotation: pattern.rotation, style: pattern.style } : null,
    transmission: transmission ? { thickness: transmission.thickness, ior: transmission.ior, roughness: transmission.roughness } : null,
  };
}

function leafDiff(before, after, pathName = 'root', output = []) {
  const beforeObject = before && typeof before === 'object';
  const afterObject = after && typeof after === 'object';
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

function normalizeRgb(luminance) { return [luminance, luminance, luminance, 1]; }

function applyRecipe(root, recipe) {
  const layers = findGradientLayers(root);
  if (layers.length !== 1) throw new Error(`Expected exactly one Light Material gradient record, found ${layers.length}`);
  const colors = layers[0].data.colors;
  const sourceUnique = [];
  for (const color of colors) {
    const key = JSON.stringify(color);
    if (!sourceUnique.some((item) => item.key === key)) sourceUnique.push({ key, color });
  }
  if (sourceUnique.length !== recipe.colors.length) throw new Error(`Expected ${recipe.colors.length} unique gradient colors, found ${sourceUnique.length}`);
  const mapping = new Map(sourceUnique.map((item, index) => [item.key, recipe.colors[index]]));
  layers[0].data.colors = colors.map((color) => [...(mapping.get(JSON.stringify(color)) || color)]);
  return { gradientPath: `${layers[0].materialPath}.layers.${layers[0].layerIndex}.data.colors`, sourceColors: sourceUnique.map((item) => item.color), finalColors: layers[0].data.colors };
}

function main() {
  const options = parseArgs();
  const msgpackr = require(options.msgpackr);
  registerPublicExtensions(msgpackr);
  const goldenBytes = fs.readFileSync(options.golden);
  const r2Bytes = fs.readFileSync(options.payload);
  const goldenSha = sha256(goldenBytes);
  const r2Sha = sha256(r2Bytes);
  if (goldenSha !== GOLDEN_SHA) throw new Error(`Golden SHA mismatch: ${goldenSha}`);
  if (r2Sha !== R2_SHA) throw new Error(`R2 SHA mismatch: ${r2Sha}`);
  const goldenRoot = decodeOne(msgpackr, goldenBytes);
  const r2Root = decodeOne(msgpackr, r2Bytes);
  const r2Json = JSON.parse(JSON.stringify(r2Root));
  const ownership = ownershipMap(r2Root);
  const originalGradient = findGradientLayers(r2Root).map((item) => ({ materialPath: item.materialPath, layerIndex: item.layerIndex, layerId: item.layerId, alpha: item.data.alpha, mode: item.data.mode, gradientType: item.data.gradientType, colors: item.data.colors, steps: item.data.steps, num: item.data.num, angle: item.data.angle, offset: item.data.offset, morph: item.data.morph }));
  const candidateRoot = decodeOne(msgpackr, r2Bytes);
  const recipe = RECIPES[options.recipe];
  const mutation = applyRecipe(candidateRoot, recipe);
  const candidateJson = JSON.parse(JSON.stringify(candidateRoot));
  const changed = leafDiff(r2Json, candidateJson);
  const allowedPrefixes = [`${mutation.gradientPath}`];
  const disallowed = changed.filter(({ path: changedPath }) => !allowedPrefixes.some((prefix) => changedPath === prefix || changedPath.startsWith(`${prefix}.`)));
  if (disallowed.length) throw new Error(`Disallowed R2→R3 changes: ${JSON.stringify(disallowed.slice(0, 10))}`);
  const bytes = Buffer.from(new msgpackr.Packr({ structuredClone: true }).pack(candidateRoot));
  fs.mkdirSync(options.output, { recursive: true });
  const outputPath = path.join(options.output, `boxes-hover-neutral-light-material-${options.name}.bin`);
  fs.writeFileSync(outputPath, bytes);
  const decodedCandidate = decodeOne(msgpackr, bytes);
  const roundtripChanged = leafDiff(r2Json, JSON.parse(JSON.stringify(decodedCandidate)));
  const roundtripDisallowed = roundtripChanged.filter(({ path: changedPath }) => !allowedPrefixes.some((prefix) => changedPath === prefix || changedPath.startsWith(`${prefix}.`)));
  if (roundtripDisallowed.length) throw new Error(`Disallowed roundtrip changes: ${JSON.stringify(roundtripDisallowed.slice(0, 10))}`);
  const evidence = {
    authority: { goldenSha256: goldenSha, r2Sha256: r2Sha, goldenBytes: goldenBytes.length, r2Bytes: r2Bytes.length, runtime: '@splinetool/runtime@2.0.27', encoder: 'public Packr({structuredClone:true}) plus public extension table' },
    recipe: { name: options.recipe, label: recipe.label, colors: recipe.colors },
    ownership,
    originalGradient,
    mutation,
    r2CubeMaterial: cubeSnapshot(r2Root),
    candidateCubeMaterial: cubeSnapshot(decodedCandidate),
    candidateBytes: bytes.length,
    candidateSha256: sha256(bytes),
    decodedLeafDiff: changed,
    roundtripLeafDiff: roundtripChanged,
    disallowedDecodedChanges: disallowed.length,
    disallowedRoundtripChanges: roundtripDisallowed.length,
    safety: { goldenModified: false, r2Modified: false, runtimeMutation: false, cubeMaterialModified: false, geometryModified: false, cameraModified: false, hierarchyModified: false, hoverModified: false },
  };
  const evidencePath = path.join(options.output, `boxes-hover-neutral-light-material-${options.name}.json`);
  fs.writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ outputPath, evidencePath, bytes: bytes.length, sha256: evidence.candidateSha256, lightMaterialUses: ownership.uses, originalGradient, changed: changed.length, disallowed: disallowed.length, roundtripDisallowed: roundtripDisallowed.length, cube: evidence.candidateCubeMaterial }, null, 2));
}

main();
