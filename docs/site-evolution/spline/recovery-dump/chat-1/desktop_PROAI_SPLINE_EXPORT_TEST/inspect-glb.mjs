import fs from 'node:fs';

const filePath = 'C:/Users/PC Profile/Desktop/PROAI_SPLINE_EXPORT_TEST/rubik_39_s_cube_animation.glb';
const buffer = fs.readFileSync(filePath);

const magic = buffer.toString('ascii', 0, 4);
const version = buffer.readUInt32LE(4);
const declaredLength = buffer.readUInt32LE(8);
const jsonChunkLength = buffer.readUInt32LE(12);
const jsonChunkType = buffer.toString('ascii', 16, 20);
const jsonText = buffer.toString('utf8', 20, 20 + jsonChunkLength).trim();
const gltf = JSON.parse(jsonText);

const names = [];
for (const collectionName of ['scenes', 'nodes', 'meshes', 'materials', 'images', 'textures']) {
  for (const item of gltf[collectionName] || []) {
    if (item?.name) names.push({ collection: collectionName, name: item.name });
    if (item?.uri) names.push({ collection: collectionName, uri: item.uri });
  }
}

const searchable = JSON.stringify(gltf).toLowerCase();
const report = {
  filePath,
  sizeBytes: buffer.length,
  magic,
  version,
  declaredLength,
  jsonChunkLength,
  jsonChunkType,
  validGlbHeader: magic === 'glTF' && declaredLength === buffer.length && jsonChunkType === 'JSON',
  scenes: gltf.scenes?.length || 0,
  nodes: gltf.nodes?.length || 0,
  meshes: gltf.meshes?.length || 0,
  materials: gltf.materials?.length || 0,
  images: gltf.images?.length || 0,
  textures: gltf.textures?.length || 0,
  animations: gltf.animations?.length || 0,
  firstNames: names.slice(0, 80),
  containsSplineString: searchable.includes('spline'),
  containsWatermarkString: searchable.includes('watermark'),
  containsLogoString: searchable.includes('logo'),
};

fs.writeFileSync(
  'C:/Users/PC Profile/Desktop/PROAI_SPLINE_EXPORT_TEST/glb-inspection.json',
  JSON.stringify(report, null, 2),
);

console.log(JSON.stringify(report, null, 2));
