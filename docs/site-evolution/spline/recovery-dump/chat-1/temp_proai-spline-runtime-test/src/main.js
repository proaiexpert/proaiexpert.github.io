import { Application } from '@splinetool/runtime';

const sceneUrl = 'https://prod.spline.design/Ps48UZeUPJBLxiy2/scene.splinecode';
const canvas = document.getElementById('canvas3d');
const status = document.getElementById('status');
const app = new Application(canvas);

window.__splineProbe = {
  app,
  sceneUrl,
  loaded: false,
  objects: [],
  importantObjects: [],
  materialReports: [],
  mutationReport: null,
  controlReport: null,
};

function safeValue(value) {
  if (value == null) return value;
  if (typeof value !== 'object') return value;
  if (typeof value.toArray === 'function') return value.toArray();
  if ('r' in value && 'g' in value && 'b' in value) {
    return { r: value.r, g: value.g, b: value.b, a: value.a };
  }
  return String(value);
}

function layerReport(layer) {
  const keys = Object.keys(layer || {});
  const relevant = {};
  for (const key of keys) {
    if (
      /type|category|color|rough|metal|reflect|intensity|opacity|visible|enabled|light/i.test(key)
    ) {
      try {
        relevant[key] = safeValue(layer[key]);
      } catch (error) {
        relevant[key] = `[read error: ${error.message}]`;
      }
    }
  }
  return {
    keys,
    type: layer?.type,
    category: layer?.category,
    relevant,
    writable: Object.fromEntries(
      ['color', 'roughness', 'metalness', 'reflectivity', 'intensity', 'visible'].map((key) => {
        let writable = false;
        try {
          const before = layer?.[key];
          layer[key] = before;
          writable = true;
        } catch {
          writable = false;
        }
        return [key, writable];
      }),
    ),
  };
}

function objectReport(object) {
  return {
    name: object.name,
    id: object.id,
    type: object.type,
    parentName: object.parent?.name,
    parentId: object.parent?.id,
    visible: object.visible,
    position: safeValue(object.position),
    rotation: safeValue(object.rotation),
    scale: safeValue(object.scale),
  };
}

function materialReport(object) {
  return {
    object: objectReport(object),
    hasMaterial: Boolean(object.material),
    materialKeys: Object.keys(object.material || {}),
    materialType: object.material?.type,
    materialCategory: object.material?.category,
    materialRelevant: layerReport(object.material),
    layers: (object.material?.layers || []).map(layerReport),
  };
}

function findObjects(objects, terms) {
  return objects.filter((object) =>
    terms.some((term) => object.name?.toLowerCase().includes(term.toLowerCase())),
  );
}

function setIfWritable(target, key, value) {
  const before = target?.[key];
  try {
    target[key] = value;
    return { key, before: safeValue(before), after: safeValue(target[key]), ok: true };
  } catch (error) {
    return { key, before: safeValue(before), error: error.message, ok: false };
  }
}

await app.load(sceneUrl);

const objects = app.getAllObjects();
const importantTerms = [
  'right',
  'center',
  'left',
  'cube',
  'plane',
  'directional light',
  'verde',
  'giallo',
  'bianco',
  'blu',
  'arancio',
  'rosso',
];

const importantObjects = findObjects(objects, importantTerms);
const faceObjects = findObjects(objects, ['verde', 'giallo', 'bianco', 'blu', 'arancio', 'rosso']);
const plane = findObjects(objects, ['plane'])[0];
const light = findObjects(objects, ['directional light'])[0];
const targetFace = faceObjects[0];

window.__splineProbe.loaded = true;
window.__splineProbe.objects = objects.map(objectReport);
window.__splineProbe.importantObjects = importantObjects.map(objectReport);
window.__splineProbe.materialReports = faceObjects.slice(0, 8).map(materialReport);

const mutationReport = {
  target: targetFace ? objectReport(targetFace) : null,
  objectColor: null,
  layerMutations: [],
  materialAfter: null,
};

if (targetFace) {
  mutationReport.objectColor = setIfWritable(targetFace, 'color', '#17191D');
  for (const layer of targetFace.material?.layers || []) {
    const category = String(layer.category || layer.type || '').toLowerCase();
    if (category.includes('physical')) {
      mutationReport.layerMutations.push(setIfWritable(layer, 'roughness', 0.3));
      mutationReport.layerMutations.push(setIfWritable(layer, 'metalness', 0.78));
      mutationReport.layerMutations.push(setIfWritable(layer, 'reflectivity', 0.48));
    }
  }
  mutationReport.materialAfter = materialReport(targetFace);
}

const controlReport = {
  plane: plane
    ? {
        target: objectReport(plane),
        visible: setIfWritable(plane, 'visible', plane.visible),
        color: setIfWritable(plane, 'color', plane.color || '#17191D'),
      }
    : null,
  light: light
    ? {
        target: objectReport(light),
        color: setIfWritable(light, 'color', light.color || '#ffffff'),
        intensity: setIfWritable(light, 'intensity', light.intensity),
      }
    : null,
  transform: targetFace
    ? {
        target: objectReport(targetFace),
        positionX: (() => {
          try {
            const before = targetFace.position?.x;
            targetFace.position.x = before;
            return { before, after: targetFace.position?.x, ok: true };
          } catch (error) {
            return { error: error.message, ok: false };
          }
        })(),
      }
    : null,
};

window.__splineProbe.mutationReport = mutationReport;
window.__splineProbe.controlReport = controlReport;

console.log('SPLINE_PROBE', window.__splineProbe);
status.textContent = [
  `Loaded: ${window.__splineProbe.loaded}`,
  `Objects: ${objects.length}`,
  `Important objects: ${importantObjects.length}`,
  `Mutated face: ${targetFace?.name || 'none'}`,
].join('\n');
