#!/usr/bin/env node

// Read-only pre-init optical lookdev generator for the Golden Boxes Hover
// payload. It encodes independent copies with the public Spline MessagePack
// extension table and performs no live runtime mutation.

import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const repoRoot = path.resolve(here, '../../../');
const GOLDEN_SHA = 'c3bcabd43c232045b059704e8d4be57634314b7da2fcfa5ebbd448ee40a16798';
const SOURCE_MESH_ID = '2264fe3b-7194-4ee4-adea-5fa8fa9f00b1';
const SOURCE_COMPONENT_ID = '59d52622-c138-4b29-ad19-059c64a37d07';
const defaultOutput = path.join(repoRoot, 'docs/site-evolution/ai-systems/boxes-hover-optical-material-r2/diagnostics');

function parseHex(value) {
  const hex = String(value).replace(/^#/, '');
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) throw new Error(`Expected #RRGGBB, got ${value}`);
  return { r: Number.parseInt(hex.slice(0, 2), 16) / 255, g: Number.parseInt(hex.slice(2, 4), 16) / 255, b: Number.parseInt(hex.slice(4, 6), 16) / 255, a: 1 };
}

function parseArgs() {
  const options = {
    payload: path.join(repoRoot, 'owner-preview/assets/3d/boxes-hover/public-original-inline-scene-payload.bin'),
    output: defaultOutput,
    evidence: path.join(repoRoot, 'docs/site-evolution/ai-systems/boxes-hover-optical-material-r2/diagnostics-evidence.json'),
    name: 'candidate',
    pattern: { colorA: parseHex('#C9CDD1'), colorB: parseHex('#020304') },
    physical: { metalness: 0.14, roughness: 0.35, reflectivity: 0.33 },
    transmission: { thickness: 1, ior: 1.5, roughness: 2.7 },
  };
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--msgpackr') options.msgpackr = path.resolve(argv[++i]);
    else if (argv[i] === '--payload') options.payload = path.resolve(argv[++i]);
    else if (argv[i] === '--output') options.output = path.resolve(argv[++i]);
    else if (argv[i] === '--evidence') options.evidence = path.resolve(argv[++i]);
    else if (argv[i] === '--name') options.name = argv[++i];
    else if (argv[i] === '--color-a') options.pattern.colorA = parseHex(argv[++i]);
    else if (argv[i] === '--color-b') options.pattern.colorB = parseHex(argv[++i]);
    else if (argv[i] === '--metalness') options.physical.metalness = Number(argv[++i]);
    else if (argv[i] === '--roughness') options.physical.roughness = Number(argv[++i]);
    else if (argv[i] === '--reflectivity') options.physical.reflectivity = Number(argv[++i]);
    else if (argv[i] === '--transmission-thickness') options.transmission.thickness = Number(argv[++i]);
    else if (argv[i] === '--transmission-ior') options.transmission.ior = Number(argv[++i]);
    else if (argv[i] === '--transmission-roughness') options.transmission.roughness = Number(argv[++i]);
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

function findSourceMesh(root) {
  const matches = [];
  walkTree(root?.scene?.objects, (node, objectPath) => {
    if (node?.id === SOURCE_MESH_ID && node?.data?.type === 'Mesh') matches.push({ node, objectPath });
  });
  if (matches.length !== 1) throw new Error(`Expected one source Cube mesh, got ${matches.length}`);
  const source = matches[0];
  if (source.node.data.name !== 'Cube' || source.node.data.material?.name !== 'Cube Material') throw new Error('Unexpected Cube source identity');
  return source;
}

function findLayer(material, type, category) {
  const matches = (material?.layers || []).filter((layer) => layer?.data?.type === type && (category === undefined || layer?.data?.category === category));
  if (matches.length !== 1) throw new Error(`Expected one ${type} layer, got ${matches.length}`);
  return matches[0];
}

function rgba(value) { return ['r', 'g', 'b', 'a'].map((key) => value?.[key]); }

function sourceSnapshot(root) {
  const { node, objectPath } = findSourceMesh(root);
  const material = node.data.material;
  const physical = findLayer(material, 'light', 'physical').data;
  const pattern = findLayer(material, 'pattern').data;
  const transmission = findLayer(material, 'transmission').data;
  return {
    path: objectPath,
    sourceMeshId: node.id,
    sourceComponentId: root?.scene?.objects?.[0]?.children?.[2]?.children?.[0]?.id ?? null,
    materialName: material.name,
    layerTypes: material.layers.map((layer) => layer?.data?.type ?? null),
    physical: { metalness: physical.metalness, roughness: physical.roughness, reflectivity: physical.reflectivity },
    pattern: { colorA: rgba(pattern.colorA), colorB: rgba(pattern.colorB), size: pattern.size, rotation: pattern.rotation, style: pattern.style },
    transmission: { thickness: transmission.thickness, ior: transmission.ior, roughness: transmission.roughness },
  };
}

function invariantSnapshot(root) {
  let nodeCount = 0;
  let boxesChildCount = null;
  let cubeInstances = 0;
  let cameraCount = 0;
  walkTree(root?.scene?.objects, (node) => {
    nodeCount += 1;
    if (node?.data?.name === 'Boxes') boxesChildCount = node.children?.length ?? 0;
    if (node?.data?.name?.includes('Instance')) cubeInstances += 1;
    if (node?.data?.type === 'OrthographicCamera') cameraCount += 1;
  });
  return { rootKeys: Object.keys(root || {}).sort(), nodeCount, boxesChildCount, cubeInstances, cameraCount, source: sourceSnapshot(root) };
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

function applyRecipe(root, recipe) {
  const { node } = findSourceMesh(root);
  const material = node.data.material;
  const physical = findLayer(material, 'light', 'physical').data;
  const pattern = findLayer(material, 'pattern').data;
  const transmission = findLayer(material, 'transmission').data;
  Object.assign(physical, recipe.physical);
  Object.assign(pattern, { colorA: { ...recipe.pattern.colorA }, colorB: { ...recipe.pattern.colorB } });
  Object.assign(transmission, recipe.transmission);
}

function main() {
  const options = parseArgs();
  const msgpackr = require(options.msgpackr);
  registerPublicExtensions(msgpackr);
  const goldenBytes = fs.readFileSync(options.payload);
  const goldenSha = sha256(goldenBytes);
  if (goldenSha !== GOLDEN_SHA) throw new Error(`Golden SHA mismatch: ${goldenSha}`);
  const goldenRoot = decodeOne(msgpackr, goldenBytes);
  const goldenInvariant = invariantSnapshot(goldenRoot);
  const goldenRootJson = JSON.stringify(JSON.parse(JSON.stringify(goldenRoot)));
  const recipe = { pattern: options.pattern, physical: options.physical, transmission: options.transmission };
  const candidateRoot = decodeOne(msgpackr, goldenBytes);
  applyRecipe(candidateRoot, recipe);
  const changed = leafDiff(JSON.parse(goldenRootJson), JSON.parse(JSON.stringify(candidateRoot)));
  const allowed = [
    'root.scene.objects.0.children.2.children.0.children.0.data.material.layers.0.data.metalness',
    'root.scene.objects.0.children.2.children.0.children.0.data.material.layers.0.data.roughness',
    'root.scene.objects.0.children.2.children.0.children.0.data.material.layers.0.data.reflectivity',
    'root.scene.objects.0.children.2.children.0.children.0.data.material.layers.1.data.colorA',
    'root.scene.objects.0.children.2.children.0.children.0.data.material.layers.1.data.colorB',
    'root.scene.objects.0.children.2.children.0.children.0.data.material.layers.2.data.thickness',
    'root.scene.objects.0.children.2.children.0.children.0.data.material.layers.2.data.ior',
    'root.scene.objects.0.children.2.children.0.children.0.data.material.layers.2.data.roughness',
  ];
  const disallowed = changed.filter(({ path: changedPath }) => !allowed.some((prefix) => changedPath === prefix || changedPath.startsWith(`${prefix}.`)));
  if (disallowed.length) throw new Error(`Disallowed decoded changes: ${JSON.stringify(disallowed.slice(0, 10))}`);
  const bytes = Buffer.from(new msgpackr.Packr({ structuredClone: true }).pack(candidateRoot));
  const outputPath = path.join(options.output, `boxes-hover-optical-${options.name}.bin`);
  fs.mkdirSync(options.output, { recursive: true });
  fs.writeFileSync(outputPath, bytes);
  const decodedCandidate = decodeOne(msgpackr, bytes);
  const candidateInvariant = invariantSnapshot(decodedCandidate);
  const candidateRootJson = JSON.stringify(JSON.parse(JSON.stringify(decodedCandidate)));
  const roundtripChanged = leafDiff(JSON.parse(goldenRootJson), JSON.parse(candidateRootJson));
  const roundtripDisallowed = roundtripChanged.filter(({ path: changedPath }) => !allowed.some((prefix) => changedPath === prefix || changedPath.startsWith(`${prefix}.`)));
  if (roundtripDisallowed.length) throw new Error(`Disallowed roundtrip changes: ${JSON.stringify(roundtripDisallowed.slice(0, 10))}`);
  const evidence = {
    authority: { goldenSha256: goldenSha, goldenBytes: goldenBytes.length, runtime: '@splinetool/runtime@2.0.27', encoder: 'public Packr({structuredClone:true}) plus public extension table' },
    name: options.name,
    outputPath,
    candidateBytes: bytes.length,
    candidateSha256: sha256(bytes),
    recipe,
    goldenInvariant,
    candidateInvariant,
    decodedLeafDiff: changed,
    roundtripLeafDiff: roundtripChanged,
    disallowedDecodedChanges: disallowed.length,
    disallowedRoundtripChanges: roundtripDisallowed.length,
    safety: { goldenModified: false, runtimeMutation: false, geometryModified: false, cameraModified: false, hierarchyModified: false, hoverModified: false },
  };
  fs.mkdirSync(path.dirname(options.evidence), { recursive: true });
  fs.writeFileSync(options.evidence, `${JSON.stringify(evidence, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ name: options.name, path: outputPath, bytes: bytes.length, sha256: evidence.candidateSha256, disallowedDecodedChanges: disallowed.length, disallowedRoundtripChanges: roundtripDisallowed.length, candidate: candidateInvariant }, null, 2));
}

main();
