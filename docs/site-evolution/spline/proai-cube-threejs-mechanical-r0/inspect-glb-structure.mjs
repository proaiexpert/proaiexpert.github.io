import fs from 'node:fs';
import path from 'node:path';

const GLB = 'docs/site-evolution/spline/recovery-dump/chat-1/desktop_PROAI_SPLINE_EXPORT_TEST/rubik_39_s_cube_animation.glb';
const OUT = 'docs/site-evolution/spline/proai-cube-threejs-mechanical-r0/GLB_STRUCTURE_INSPECTION.json';

const buffer = fs.readFileSync(GLB);
const magic = buffer.toString('ascii', 0, 4);
const version = buffer.readUInt32LE(4);
const declaredLength = buffer.readUInt32LE(8);
const jsonLength = buffer.readUInt32LE(12);
const jsonType = buffer.toString('ascii', 16, 20);
if (magic !== 'glTF' || version !== 2 || jsonType !== 'JSON') {
  throw new Error(`Unexpected GLB header: magic=${magic} version=${version} jsonType=${jsonType}`);
}
const jsonText = buffer.subarray(20, 20 + jsonLength).toString('utf8').replace(/\0/g, '').trim();
const gltf = JSON.parse(jsonText);
const nodes = gltf.nodes || [];
const parents = new Array(nodes.length).fill(null);
nodes.forEach((node, index) => {
  for (const child of node.children || []) parents[child] = index;
});

function translationOf(node) {
  if (Array.isArray(node.matrix) && node.matrix.length === 16) {
    return [node.matrix[12], node.matrix[13], node.matrix[14]];
  }
  return node.translation || [0, 0, 0];
}

function summarizeNode(index) {
  const node = nodes[index] || {};
  const parentIndex = parents[index];
  const parent = parentIndex == null ? null : nodes[parentIndex];
  return {
    index,
    name: node.name ?? null,
    mesh: node.mesh ?? null,
    parentIndex,
    parentName: parent?.name ?? null,
    children: node.children || [],
    childNames: (node.children || []).map((child) => nodes[child]?.name ?? null),
    localTranslation: translationOf(node),
    matrix: node.matrix || null,
    translation: node.translation || null,
    rotation: node.rotation || null,
    scale: node.scale || null,
  };
}

const named = ['right', 'center', 'left'];
const namedGroups = Object.fromEntries(named.map((name) => {
  const index = nodes.findIndex((node) => node.name === name);
  return [name, index >= 0 ? summarizeNode(index) : null];
}));

const meshNodes = nodes
  .map((node, index) => ({ node, index }))
  .filter(({ node }) => Number.isInteger(node.mesh))
  .map(({ index }) => summarizeNode(index));

const unnamedMeshNodes = meshNodes.filter((node) => !node.name);
const meshParentHistogram = {};
for (const item of meshNodes) {
  const key = `${item.parentIndex ?? 'ROOT'}:${item.parentName ?? '(unnamed)'}`;
  meshParentHistogram[key] = (meshParentHistogram[key] || 0) + 1;
}

const report = {
  source: GLB,
  header: { magic, version, declaredLength, actualLength: buffer.length, jsonLength, jsonType },
  counts: {
    scenes: (gltf.scenes || []).length,
    nodes: nodes.length,
    meshes: (gltf.meshes || []).length,
    materials: (gltf.materials || []).length,
    animations: (gltf.animations || []).length,
    meshNodes: meshNodes.length,
    unnamedMeshNodes: unnamedMeshNodes.length,
  },
  sceneRoots: (gltf.scenes || []).map((scene, sceneIndex) => ({
    sceneIndex,
    nodes: scene.nodes || [],
    nodeNames: (scene.nodes || []).map((index) => nodes[index]?.name ?? null),
  })),
  namedGroups,
  meshParentHistogram,
  meshNodes,
  nodes: nodes.map((_, index) => summarizeNode(index)),
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(report, null, 2) + '\n');
console.log(`Wrote ${OUT}`);
console.log(JSON.stringify({ counts: report.counts, namedGroups, meshParentHistogram }, null, 2));
