import { Application } from '@splinetool/runtime';

const localSceneUrl = '/out/scene.splinecode';
const remoteSceneUrl = 'https://prod.spline.design/Ps48UZeUPJBLxiy2/scene.splinecode';
const canvas = document.getElementById('canvas3d');
const status = document.getElementById('status');
const app = new Application(canvas);

const GRAPHITE_FACES = ['verde', 'giallo', 'bianco', 'blu', 'arancio', 'rosso'];
const GROUP_UUIDS = new Set([
  'd0f2f312-20b7-4585-bcde-95e9276568f8',
  'c4838e42-d896-4eaa-b171-057187ae939f',
  '8a6241de-bb76-457b-a4eb-b95729bf3fb9',
]);

const FACE_VARIANTS = [
  { color: { r: 0.265, g: 0.276, b: 0.3 }, roughness: 0.18, metalness: 0.92, reflectivity: 0.78, intensity: 1.18 },
  { color: { r: 0.21, g: 0.222, b: 0.248 }, roughness: 0.23, metalness: 0.88, reflectivity: 0.68, intensity: 1.08 },
  { color: { r: 0.175, g: 0.187, b: 0.215 }, roughness: 0.28, metalness: 0.84, reflectivity: 0.6, intensity: 1 },
  { color: { r: 0.3, g: 0.31, b: 0.335 }, roughness: 0.2, metalness: 0.9, reflectivity: 0.72, intensity: 1.12 },
];

const CORE_MATERIAL = {
  color: { r: 0.052, g: 0.056, b: 0.066 },
  roughness: 0.54,
  metalness: 0.38,
  reflectivity: 0.22,
  intensity: 0.72,
};

function setLayerColor(layer, color) {
  if (!layer) return;
  layer.color = { r: color.r, g: color.g, b: color.b };
}

function applyPhysicalLayer(layer, values) {
  if (!layer) return;
  layer.category = 'physical';
  layer.roughness = values.roughness;
  layer.metalness = values.metalness;
  layer.reflectivity = values.reflectivity;
  if ('color' in layer) layer.color = { r: 0.96, g: 0.98, b: 1 };
  if ('intensity' in layer) layer.intensity = values.intensity || 1;
  if ('occlusion' in layer) layer.occlusion = true;
  if ('visible' in layer) layer.visible = true;
}

function applyMaterial(object, values) {
  const layers = object.material?.layers || [];
  const colorLayer = layers.find((layer) => layer.type === 'color') || layers[0];
  const lightLayer = layers.find((layer) => layer.type === 'light');

  object.color = values.color;
  setLayerColor(colorLayer, values.color);
  applyPhysicalLayer(lightLayer, values);
}

function getRubikGroupName(objects, parentUuid) {
  return objects.find((object) => object.uuid === parentUuid)?.name || 'scene';
}

function applyProAIGraphiteMaterials(objects) {
  const faces = objects.filter(
    (object) => GRAPHITE_FACES.includes(object.name) && GROUP_UUIDS.has(object.parentUuid),
  );
  const cores = objects.filter((object) => object.name === 'Cube' && GROUP_UUIDS.has(object.parentUuid));

  faces.forEach((face, index) => {
    applyMaterial(face, FACE_VARIANTS[index % FACE_VARIANTS.length]);
  });

  cores.forEach((core) => {
    applyMaterial(core, CORE_MATERIAL);
  });

  return {
    faces: faces.map((face) => ({
      name: face.name,
      uuid: face.uuid,
      group: getRubikGroupName(objects, face.parentUuid),
    })),
    cores: cores.map((core) => ({
      name: core.name,
      uuid: core.uuid,
      group: getRubikGroupName(objects, core.parentUuid),
    })),
  };
}

function configureProAILighting(objects) {
  const directional = objects.find((object) => object.uuid === '1ccd27ee-5f74-4b6d-94ba-f98954b9f14e');
  if (directional) {
    directional.visible = true;
    directional.color = '#FAFBFC';
    directional.intensity = 6.4;
    directional.position.x = -620;
    directional.position.y = 1880;
    directional.position.z = -900;
    directional.rotation.x = -0.96;
    directional.rotation.y = -1.24;
    directional.rotation.z = -1.18;
  }

  return {
    directional: directional
      ? {
          uuid: directional.uuid,
          color: '#FAFBFC',
          intensity: directional.intensity,
          position: directional.position.toArray?.() || directional.position,
        }
      : null,
  };
}

function configureProAIEnvironment(objects) {
  document.documentElement.style.background = '#080A0D';
  document.body.style.background = '#080A0D';

  const plane = objects.find((object) => object.uuid === 'ea2cdf15-c2fb-45c3-9bd8-04d836d4d700');
  if (plane) {
    plane.visible = false;
    plane.color = '#080A0D';
    applyMaterial(plane, {
      color: { r: 0.031, g: 0.039, b: 0.051 },
      roughness: 0.68,
      metalness: 0.12,
      reflectivity: 0.12,
    });
    plane.scale.x = 16;
    plane.scale.y = 16;
    plane.scale.z = 16;
    plane.position.y = -610;
  }

  return {
    background: '#080A0D',
    plane: plane
      ? {
          uuid: plane.uuid,
          visible: plane.visible,
          color: '#080A0D',
          scale: plane.scale.toArray?.() || plane.scale,
        }
      : null,
  };
}

function summarizeMaterials(objects) {
  return objects
    .filter((object) => GRAPHITE_FACES.includes(object.name) || object.name === 'Cube')
    .map((object) => ({
      name: object.name,
      uuid: object.uuid,
      group: getRubikGroupName(objects, object.parentUuid),
      layers: (object.material?.layers || []).map((layer) => ({
        type: layer.type,
        category: layer.category,
        color: layer.color,
        roughness: layer.roughness,
        metalness: layer.metalness,
        reflectivity: layer.reflectivity,
      })),
    }));
}

async function loadScene() {
  try {
    await app.load(localSceneUrl);
    return localSceneUrl;
  } catch (error) {
    console.warn('Local Spline scene failed, falling back to remote scene.', error);
    await app.load(remoteSceneUrl);
    return remoteSceneUrl;
  }
}

const loadedSceneUrl = await loadScene();
const objects = app.getAllObjects();
const materialReport = applyProAIGraphiteMaterials(objects);
const lightingReport = configureProAILighting(objects);
const environmentReport = configureProAIEnvironment(objects);

window.__proAIR1 = {
  app,
  loaded: true,
  loadedSceneUrl,
  objectCount: objects.length,
  materials: materialReport,
  lighting: lightingReport,
  environment: environmentReport,
  materialSummary: summarizeMaterials(objects),
};

console.log('PROAI_SPLINE_PREMIUM_R1', window.__proAIR1);

status.textContent = [
  'PROAI_SPLINE_PREMIUM_R1',
  `Loaded: ${loadedSceneUrl}`,
  `Objects: ${objects.length}`,
  `Graphite faces: ${materialReport.faces.length}`,
  `Core cubes: ${materialReport.cores.length}`,
].join('\n');
