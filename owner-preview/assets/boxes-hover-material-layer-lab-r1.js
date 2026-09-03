import { Application } from 'https://cdn.spline.design/@splinetool/runtime@2.0.27/build/runtime.js';

(() => {
  'use strict';

  const canvas = document.querySelector('[data-material-lab-canvas]');
  const status = document.querySelector('[data-material-lab-status]');
  const buttons = [...document.querySelectorAll('[data-material-mode],[data-material-test]')];
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
    if (typeof value === 'function') return '[function]';
    if (depth > 2 || seen.has(value)) return `[${value?.constructor?.name || 'object'}]`;
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
      try { const value = layer[key]; if (typeof value !== 'function') properties[key] = jsonValue(value); } catch { properties[key] = '[unreadable]'; }
    }
    return { constructor: layer?.constructor?.name || null, type: layer?.type ?? null, category: layer?.category ?? layer?.kind ?? null, keys, properties };
  };

  const readColor = (value) => {
    if (!value || typeof value !== 'object') return null;
    if (Array.isArray(value)) return value.slice(0, 4).map(Number);
    if ('r' in value && 'g' in value && 'b' in value) return { r: Number(value.r), g: Number(value.g), b: Number(value.b), a: 'a' in value ? Number(value.a) : undefined };
    return null;
  };

  const writeColor = (target, color) => {
    if (!target || !color) return false;
    if (Array.isArray(target) && Array.isArray(color)) { color.forEach((value, index) => { target[index] = value; }); return true; }
    if (typeof target === 'object' && 'r' in target && 'g' in target && 'b' in target && !Array.isArray(color)) {
      target.r = color.r; target.g = color.g; target.b = color.b; if ('a' in target && color.a !== undefined) target.a = color.a; return true;
    }
    return false;
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
    const inventory = cubes.map((object, index) => {
      const material = object.material;
      let materialId = null;
      if (material && typeof material === 'object') {
        materialId = materialIds.get(material);
        if (!materialId) { materialId = `material-${nextMaterialId++}`; materialIds.set(material, materialId); }
      }
      const layers = Array.isArray(material?.layers) ? material.layers.map(describeLayer) : [];
      const signature = JSON.stringify(layers);
      familyMap.set(signature, (familyMap.get(signature) || 0) + 1);
      return { index, objectUuid: object.uuid, objectName: object.name, materialId, materialConstructor: material?.constructor?.name || null, layerCount: layers.length, layers, signature };
    });
    const familyGroups = [...familyMap.entries()].map(([signature, count]) => ({ count, signature }));
    const report = { payloadSha256: canvas.dataset.payloadSha, payloadBytes: bytes.byteLength, runtime: '@splinetool/runtime@2.0.27', boxesUuid: boxes.uuid, cubeCount: cubes.length, sharedMaterialCount: new Set(inventory.map((item) => item.materialId).filter(Boolean)).size, familyCount: familyGroups.length, familyGroups, cubes: inventory };
    document.defaultView.__boxesHoverMaterialInventory = report;
    const dump = document.createElement('script'); dump.id = 'material-inventory-dump'; dump.type = 'application/json'; dump.textContent = JSON.stringify(report); document.body.appendChild(dump);

    const nativeSnapshots = cubes.map((cube) => {
      const layers = Array.isArray(cube.material?.layers) ? cube.material.layers : [];
      const pattern = layers.find((layer) => layer?.type === 'pattern');
      const light = layers.find((layer) => layer?.type === 'light' && layer?.category === 'physical');
      return { pattern: { colorA: readColor(pattern?.colorA), colorB: readColor(pattern?.colorB) }, light: { metalness: typeof light?.metalness === 'number' ? light.metalness : null, roughness: typeof light?.roughness === 'number' ? light.roughness : null, reflectivity: typeof light?.reflectivity === 'number' ? light.reflectivity : null } };
    });
    const threeIndexes = [0, 71, 142];
    const clusterIndexes = Array.from({ length: 12 }, (_, index) => index);
    const recipe = {
      black: { colorA: { r: .24, g: .27, b: .31, a: 1 }, colorB: { r: .018, g: .022, b: .028, a: 1 }, metalness: .52, roughness: .28, reflectivity: .42 },
      champagne: { colorA: { r: .25, g: .27, b: .29, a: 1 }, colorB: { r: .29, g: .235, b: .17, a: 1 }, metalness: .48, roughness: .31, reflectivity: .44 },
      violet: { colorA: { r: .22, g: .24, b: .30, a: 1 }, colorB: { r: .035, g: .042, b: .12, a: 1 }, metalness: .45, roughness: .34, reflectivity: .43 }
    };
    const getLayers = (cube) => { const layers = Array.isArray(cube?.material?.layers) ? cube.material.layers : []; return { pattern: layers.find((layer) => layer?.type === 'pattern'), light: layers.find((layer) => layer?.type === 'light' && layer?.category === 'physical') }; };
    const restoreCube = (cube, snapshot) => {
      const { pattern, light } = getLayers(cube);
      const restoredA = writeColor(pattern?.colorA, snapshot.pattern.colorA);
      const restoredB = writeColor(pattern?.colorB, snapshot.pattern.colorB);
      if (light && snapshot.light.metalness !== null) light.metalness = snapshot.light.metalness;
      if (light && snapshot.light.roughness !== null) light.roughness = snapshot.light.roughness;
      if (light && snapshot.light.reflectivity !== null) light.reflectivity = snapshot.light.reflectivity;
      return restoredA && restoredB;
    };
    const applyRecipe = (cube, values) => {
      const { pattern, light } = getLayers(cube);
      const changedA = writeColor(pattern?.colorA, values.colorA);
      const changedB = writeColor(pattern?.colorB, values.colorB);
      if (light && typeof light.metalness === 'number') light.metalness = values.metalness;
      if (light && typeof light.roughness === 'number') light.roughness = values.roughness;
      if (light && typeof light.reflectivity === 'number') light.reflectivity = values.reflectivity;
      return { changedA, changedB, light: Boolean(light) };
    };
    const restoreIndexes = (indexes) => indexes.reduce((count, index) => count + (restoreCube(cubes[index], nativeSnapshots[index]) ? 1 : 0), 0);
    const applyIndexes = (indexes, values) => indexes.reduce((count, index) => { const result = applyRecipe(cubes[index], values); return count + (result.changedA && result.changedB && result.light ? 1 : 0); }, 0);
    const run = (action) => {
      let changed = 0; let restored = 0;
      if (action === 'native' || action === 'restore-all') restored = restoreIndexes(cubes.map((_, index) => index));
      if (action === 'diagnostic-red-green' || action === 'diagnostic-swap') {
        restored = restoreIndexes([0]);
        const colors = action === 'diagnostic-red-green' ? { colorA: { r: 1, g: 0, b: 0, a: 1 }, colorB: { r: 0, g: 1, b: 0, a: 1 } } : { colorA: { r: 0, g: 1, b: 0, a: 1 }, colorB: { r: 1, g: 0, b: 0, a: 1 } };
        const result = applyRecipe(cubes[0], { ...recipe.black, ...colors }); changed = result.changedA && result.changedB ? 1 : 0;
      }
      if (['black', 'champagne', 'violet'].includes(action)) { restored = restoreIndexes(cubes.map((_, index) => index)); changed = applyIndexes(cubes.map((_, index) => index), recipe[action]); }
      if (action.startsWith('one-')) { restored = restoreIndexes([0]); changed = applyIndexes([0], recipe[action.slice(4)]); }
      if (action.startsWith('three-')) { restored = restoreIndexes(threeIndexes); changed = applyIndexes(threeIndexes, recipe[action.slice(6)]); }
      if (action.startsWith('cluster-')) { restored = restoreIndexes(clusterIndexes); changed = applyIndexes(clusterIndexes, recipe[action.slice(8)]); }
      document.documentElement.dataset.materialLabMutation = action;
      document.documentElement.dataset.materialLabChanged = String(changed);
      document.documentElement.dataset.materialLabRestored = String(restored);
      return { action, changed, restored };
    };

    document.documentElement.dataset.materialLabRuntime = 'ready';
    document.documentElement.dataset.materialLabCubeCount = String(cubes.length);
    document.documentElement.dataset.materialLabLayeredCubes = String(inventory.filter((item) => item.layerCount > 0).length);
    document.documentElement.dataset.materialLabFamilyCount = String(familyGroups.length);
    status.textContent = `READY · ${cubes.length} cubes · ${report.sharedMaterialCount} material identities · ${report.familyCount} layer signatures\nPattern layers: colorA + colorB · Light: physical metalness / roughness / reflectivity\nRead-only baseline captured. Select a diagnostic or candidate control.`;
    for (const button of buttons) button.addEventListener('click', () => { const action = button.dataset.materialMode || button.dataset.materialTest; const result = run(action); status.textContent = `${result.action.toUpperCase()} · changed ${result.changed} · restored before mutation ${result.restored}\n143 cubes / 1 layer signature · geometry and camera untouched.`; });
  };

  start().catch((error) => { document.documentElement.dataset.materialLabRuntime = 'error'; status.textContent = `ERROR · ${error.message}`; console.error('[Boxes Hover native material layer lab]', error); });
})();
