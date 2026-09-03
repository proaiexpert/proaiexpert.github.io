import { Application } from 'https://cdn.spline.design/@splinetool/runtime@2.0.27/build/runtime.js';

(() => {
  'use strict';

  const canvas = document.querySelector('[data-material-lab-canvas]');
  const status = document.querySelector('[data-material-lab-status]');
  const buttons = [...document.querySelectorAll('[data-material-mode]')];
  if (!canvas || !status) return;

  const demoUiParentUuid = '3acae095-4a11-475a-8b70-59aac6906793';
  const demoUiWhitelist = [
    ['Ellipse', '50605cdf-cc85-46b6-874a-000a1d96b4b3'],
    ['Rectangle 3', 'bfc84abf-461b-4b5d-9e7d-4c0d2fe108c8'],
    ['Text 7', '7e0d047a-c03d-4b52-a29d-b7d9775b1630'],
    ['Rectangle 2', '2e4c9677-c23f-498d-a238-99e7346cd64a'],
    ['Text 6', 'b27bc674-20c0-4e2e-a608-b92976b171bc'],
    ['Rectangle', '4c080547-86bf-42e5-a23d-ce33a154bc87'],
    ['Text 5', 'd0d28aea-11cd-4c6d-b6ff-bf7c8528dd53'],
    ['Text 4', '85cc886f-d4fa-438a-a91c-4bf043d4555b'],
    ['Text 3', '8ef5eb04-1102-4e8f-b237-4452fe7c6385'],
    ['Text 2', '61f54f7d-ce88-46ea-9f45-a01825154460'],
    ['Text', '6013b0e6-e898-4640-9d62-e088a816f69c']
  ];

  const jsonValue = (value, depth = 0, seen = new Set()) => {
    if (value === null || value === undefined || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return value;
    if (depth > 2 || seen.has(value)) return `[${value?.constructor?.name || 'object'}]`;
    if (typeof value === 'function') return '[function]';
    seen.add(value);
    if (Array.isArray(value)) return value.slice(0, 24).map((item) => jsonValue(item, depth + 1, seen));
    const output = {};
    for (const key of Object.keys(value).slice(0, 60)) {
      try { output[key] = jsonValue(value[key], depth + 1, seen); } catch { output[key] = '[unreadable]'; }
    }
    return output;
  };

  const describeLayer = (layer) => {
    const keys = Object.keys(layer || {}).sort();
    const properties = {};
    for (const key of keys) {
      try {
        const value = layer[key];
        if (typeof value !== 'function') properties[key] = jsonValue(value);
      } catch { properties[key] = '[unreadable]'; }
    }
    return {
      constructor: layer?.constructor?.name || null,
      type: layer?.type ?? null,
      category: layer?.category ?? layer?.kind ?? null,
      keys,
      properties
    };
  };

  const start = async () => {
    document.documentElement.dataset.materialLabRuntime = 'loading';
    const response = await fetch(canvas.dataset.payloadUrl, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Golden payload HTTP ${response.status}`);
    const bytes = new Uint8Array(await response.arrayBuffer());
    const app = new Application(canvas, { htmlContentMode: 'inline' });
    await app.start(Array.from(bytes));

    const demoUiParent = app.findObjectByName('UI');
    if (!demoUiParent || demoUiParent.type !== 'Empty' || demoUiParent.uuid !== demoUiParentUuid) throw new Error('Demo UI parent identity mismatch');
    for (const [name, uuid] of demoUiWhitelist) {
      const object = app.findObjectByName(name);
      if (!object || object.type !== 'Mesh' || object.uuid !== uuid || object.parentUuid !== demoUiParentUuid) throw new Error(`Demo UI identity mismatch: ${name}`);
      object.visible = false;
    }

    const boxes = app.findObjectByName('Boxes');
    if (!boxes || boxes.type !== 'Empty' || boxes.uuid !== '006474fe-4e5b-4835-b106-89b2ec79dd71') throw new Error('Boxes identity mismatch');
    const cubes = (app.getAllObjects?.() || []).filter((object) => object.name === 'Cube' && object.type === 'Mesh' && object.parentUuid !== boxes.uuid).sort((left, right) => left.uuid.localeCompare(right.uuid));
    if (cubes.length !== 143) throw new Error(`Expected 143 Cube meshes, found ${cubes.length}`);

    const materialIds = new WeakMap();
    const familyMap = new Map();
    let nextMaterialId = 1;
    const inventory = cubes.map((object) => {
      const material = object.material;
      let materialId = null;
      if (material && typeof material === 'object') {
        materialId = materialIds.get(material);
        if (!materialId) { materialId = `material-${nextMaterialId++}`; materialIds.set(material, materialId); }
      }
      const layers = Array.isArray(material?.layers) ? material.layers.map(describeLayer) : [];
      const signature = JSON.stringify(layers);
      familyMap.set(signature, (familyMap.get(signature) || 0) + 1);
      return { objectUuid: object.uuid, objectName: object.name, materialId, materialConstructor: material?.constructor?.name || null, layerCount: layers.length, layers, signature };
    });

    const familyGroups = [...familyMap.entries()].map(([signature, count]) => ({ count, signature }));
    const report = { payloadSha256: canvas.dataset.payloadSha, payloadBytes: bytes.byteLength, runtime: '@splinetool/runtime@2.0.27', boxesUuid: boxes.uuid, cubeCount: cubes.length, sharedMaterialCount: new Set(inventory.map((item) => item.materialId).filter(Boolean)).size, familyCount: familyGroups.length, familyGroups, cubes: inventory };
    document.defaultView.__boxesHoverMaterialInventory = report;
    const dump = document.createElement('script');
    dump.id = 'material-inventory-dump';
    dump.type = 'application/json';
    dump.textContent = JSON.stringify(report);
    document.body.appendChild(dump);
    document.documentElement.dataset.materialLabRuntime = 'ready';
    document.documentElement.dataset.materialLabCubeCount = String(cubes.length);
    document.documentElement.dataset.materialLabLayeredCubes = String(inventory.filter((item) => item.layerCount > 0).length);
    document.documentElement.dataset.materialLabFamilyCount = String(familyGroups.length);
    status.textContent = `READY · ${cubes.length} cubes · ${report.sharedMaterialCount} material identities · ${report.familyCount} layer signatures\nDiagnostic target: ${inventory[0]?.objectUuid || 'none'} · ${inventory[0]?.layerCount || 0} native layers\nInventory is read-only until a lab control is selected.`;

    const target = cubes[0];
    const targetMaterial = target?.material;
    const targetLayers = Array.isArray(targetMaterial?.layers) ? targetMaterial.layers : [];
    const snapshot = new Map();
    for (const layer of targetLayers) {
      for (const key of ['color', 'roughness', 'metalness', 'reflectivity']) {
        if (key in layer) snapshot.set(`${targetLayers.indexOf(layer)}:${key}`, jsonValue(layer[key]));
      }
    }
    const assignColor = (layer, color) => {
      if (!layer || !('color' in layer)) return false;
      const current = layer.color;
      if (current && typeof current.set === 'function') current.set(color);
      else if (current && typeof current === 'object' && 'r' in current) { current.r = color[0]; current.g = color[1]; current.b = color[2]; }
      else layer.color = color;
      return true;
    };
    const mutate = (mode) => {
      if (!target) return { changed: false, reason: 'no target' };
      if (mode === 'native') {
        for (const [key, value] of snapshot) {
          const [index, property] = key.split(':');
          const layer = targetLayers[Number(index)];
          if (layer && property === 'color') assignColor(layer, value);
          else if (layer) layer[property] = value;
        }
        return { changed: true, mode };
      }
      const palette = { black: [0.067, 0.082, 0.106], champagne: [0.62, 0.5, 0.34], violet: [0.404, 0.42, 1] }[mode];
      let changed = false;
      for (const layer of targetLayers) {
        if (layer?.type === 'color') changed = assignColor(layer, palette) || changed;
        if (layer && typeof layer.roughness === 'number') { layer.roughness = mode === 'black' ? 0.22 : mode === 'champagne' ? 0.3 : 0.38; changed = true; }
        if (layer && typeof layer.metalness === 'number') { layer.metalness = mode === 'black' ? 0.72 : mode === 'champagne' ? 0.58 : 0.42; changed = true; }
        if (layer && typeof layer.reflectivity === 'number') { layer.reflectivity = mode === 'black' ? 0.42 : mode === 'champagne' ? 0.55 : 0.48; changed = true; }
      }
      return { changed, mode, targetUuid: target.uuid };
    };
    for (const button of buttons) button.addEventListener('click', () => { const result = mutate(button.dataset.materialMode); document.documentElement.dataset.materialLabMutation = result.changed ? result.mode : 'unsupported'; status.textContent = `${result.changed ? `APPLIED ${result.mode.toUpperCase()}` : 'NO SUPPORTED NATIVE TARGET'} · one Cube only\nTarget: ${target.uuid}\nInventory remains ${cubes.length} cubes / ${familyGroups.length} signatures.`; });
  };

  start().catch((error) => { document.documentElement.dataset.materialLabRuntime = 'error'; status.textContent = `ERROR · ${error.message}`; console.error('[Boxes Hover native material layer lab]', error); });
})();
