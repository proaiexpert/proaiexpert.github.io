import { Application } from 'https://cdn.spline.design/@splinetool/runtime@2.0.27/build/runtime.js';

(() => {
  const html = document.documentElement;
  const status = document.querySelector('[data-status]');
  const canvas = document.querySelector('[data-semantic-canvas]');
  const runtimeConsole = [];
  const nativeConsoleError = console.error.bind(console);
  const nativeConsoleWarn = console.warn.bind(console);
  console.error = (...args) => { runtimeConsole.push({ level: 'error', text: args.map(String).join(' ') }); nativeConsoleError(...args); };
  console.warn = (...args) => { runtimeConsole.push({ level: 'warn', text: args.map(String).join(' ') }); nativeConsoleWarn(...args); };
  const payloadUrl = '../docs/site-evolution/ai-systems/boxes-hover-semantic-instance-state-r1/boxes-hover-semantic-instance-state-r1.bin';
  const payloadSha = 'cf72f489011f26c82379faf3000b947442f1989fd105cb5d6f3762da0bf5ff2d';
  const sourceMeshId = '2264fe3b-7194-4ee4-adea-5fa8fa9f00b1';
  const targets = {
    '889ba072-8c04-4fa0-80f7-5c32e26dd963': 'INDIGO',
    '9d07611a-c5ce-4020-abf0-dd0f4ca95d89': 'NEUTRAL / SILVER',
    '1687f9e7-cac3-4b61-b5f6-a6dd86082fff': 'PEARL',
  };
  const uiParentUuid = '3acae095-4a11-475a-8b70-59aac6906793';
  const uiWhitelist = [
    ['Ellipse', '50605cdf-cc85-46b6-874a-000a1d96b4b3'], ['Rectangle 3', 'bfc84abf-461b-4b5d-9e7d-4c0d2fe108c8'],
    ['Text 7', '7e0d047a-c03d-4b52-a29d-b7d9775b1630'], ['Rectangle 2', '2e4c9677-c23f-498d-a238-99e7346cd64a'],
    ['Text 6', 'b27bc674-20c0-4e2e-a608-b92976b171bc'], ['Rectangle', '4c080547-86bf-42e5-a23d-ce33a154bc87'],
    ['Text 5', 'd0d28aea-11cd-4c6d-b6ff-bf7c8528dd53'], ['Text 4', '85cc886f-d4fa-438a-a91c-4bf043d4555b'],
    ['Text 3', '8ef5eb04-1102-4e8f-b237-4452fe7c6385'], ['Text 2', '61f54f7d-ce88-46ea-9f45-a01825154460'],
    ['Text', '6013b0e6-e898-4640-9d62-e088a816f69c'],
  ];
  const hex = (value) => [...new Uint8Array(value)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
  const readColor = (value) => value && typeof value === 'object' && 'r' in value
    ? { r: value.r, g: value.g, b: value.b, a: value.a ?? null }
    : null;
  const materialInfo = (material) => ({
    constructor: material?.constructor?.name ?? null,
    keys: material ? Object.keys(material).slice(0, 24) : [],
    uuid: material?.uuid ?? null,
    id: material?.id ?? null,
    name: material?.name ?? null,
    type: material?.type ?? null,
    dataName: material?.data?.name ?? null,
    dataLayerCount: Array.isArray(material?.data?.layers) ? material.data.layers.length : null,
    layerTypes: typeof material?.getLayersOfType === 'function'
      ? ['light', 'pattern', 'transmission', 'physical'].map((type) => ({ type, count: material.getLayersOfType(type)?.length ?? 0 }))
      : [],
    layers: (material?.layers || []).map((layer) => ({
      uuid: layer.uuid ?? null,
      type: layer.type ?? null,
      keys: Object.keys(layer),
      prototypeMethods: Object.getOwnPropertyNames(Object.getPrototypeOf(layer) || {}).filter((key) => key !== 'constructor').slice(0, 30),
      colorA: readColor(layer.data?.colorA) || readColor(layer.colorA) || readColor(layer.getValue?.('colorA')),
      colorB: readColor(layer.data?.colorB) || readColor(layer.colorB) || readColor(layer.getValue?.('colorB')),
    })),
  });
  const objectInfo = (object) => ({
    uuid: object.uuid ?? null,
    name: object.name ?? null,
    type: object.type ?? null,
    parentUuid: object.parentUuid ?? object.parent?.uuid ?? null,
    componentUuid: object.component?.uuid ?? null,
    material: materialInfo(object.material),
    ownKeys: Object.keys(object).slice(0, 30),
    prototypeMethods: Object.getOwnPropertyNames(Object.getPrototypeOf(object) || {}).filter((key) => key !== 'constructor').slice(0, 30),
    childCount: object.children?.length ?? 0,
    componentChildren: object.component?.children?.length ?? null,
    overrideDataKeys: object.overrideData ? Object.keys(object.overrideData) : [],
  });
  const setStatus = (value) => { html.dataset.semanticStatus = value; if (status) status.textContent = `SELECTIVE INSTANCE STATE R1 · ${value.toUpperCase()}`; };
  const start = async () => {
    if (globalThis.__semanticBootCount) throw new Error('Duplicate semantic scene boot');
    globalThis.__semanticBootCount = 1;
    const response = await fetch(payloadUrl, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Payload HTTP ${response.status}`);
    const bytes = new Uint8Array(await response.arrayBuffer());
    const actualSha = hex(await crypto.subtle.digest('SHA-256', bytes));
    if (actualSha !== payloadSha) throw new Error(`Payload SHA mismatch: ${actualSha}`);
    const app = new Application(canvas, { htmlContentMode: 'inline' });
    await app.start(Array.from(bytes));
    globalThis.__semanticApp = app;
    const uiParent = app.findObjectByName('UI');
    if (!uiParent || uiParent.uuid !== uiParentUuid) throw new Error('UI parent identity mismatch');
    for (const [name, uuid] of uiWhitelist) {
      const object = app.findObjectByName(name);
      if (!object || object.uuid !== uuid || object.parentUuid !== uiParentUuid) throw new Error(`UI identity mismatch: ${name}`);
      object.visible = false;
    }
    const boxes = app.findObjectByName('Boxes');
    const objects = app.getAllObjects?.() || [];
    const cubes = objects.filter((object) => object.name === 'Cube' && object.type === 'Mesh' && object.parentUuid !== boxes?.uuid);
    const materials = new Set(cubes.map((object) => object.material?.uuid || object.material?.id || object.material).filter(Boolean));
    const directTargets = Object.keys(targets).map((id) => ({ id, semantic: targets[id], direct: objects.find((object) => object.uuid === id) || null }));
    const instanceRoots = objects.filter((object) => object.type === 'Instance');
    const targetMaterials = directTargets.map((entry) => ({ ...entry, material: entry.direct ? materialInfo(entry.direct.material) : null }));
    const targetRendered = directTargets.map((entry) => ({
      id: entry.id,
      semantic: entry.semantic,
      cubes: cubes.filter((object) => object.parentUuid === entry.id).map((object) => ({ uuid: object.uuid, material: materialInfo(object.material) })),
    }));
    html.dataset.semanticPayload = payloadSha;
    html.dataset.semanticSecureContext = String(isSecureContext);
    html.dataset.semanticNavigatorGpu = String(Boolean(navigator.gpu));
    html.dataset.semanticAdapterAvailable = String(Boolean(await navigator.gpu?.requestAdapter?.({ powerPreference: 'high-performance' })));
    html.dataset.semanticWebgpu = String(html.dataset.semanticSecureContext === 'true' && html.dataset.semanticNavigatorGpu === 'true' && html.dataset.semanticAdapterAvailable === 'true');
    html.dataset.semanticCubes = String(cubes.length);
    html.dataset.semanticMaterials = String(materials.size);
    html.dataset.semanticBoxesChildren = String(boxes?.children?.length ?? 0);
    html.dataset.semanticInstanceRoots = String(instanceRoots.length);
    html.dataset.semanticTargetObjects = JSON.stringify(targetMaterials);
    html.dataset.semanticTargetDetails = JSON.stringify(directTargets.map((entry) => ({ id: entry.id, semantic: entry.semantic, object: entry.direct ? objectInfo(entry.direct) : null })));
    html.dataset.semanticTargetRendered = JSON.stringify(targetRendered);
    const targetSet = new Set(Object.keys(targets));
    const colorKey = (value) => value && [value.r, value.g, value.b, value.a ?? 1].map((part) => Number(part).toFixed(6)).join(',');
    const expected = {
      indigo: colorKey({ r: 0x67 / 255, g: 0x6b / 255, b: 1, a: 1 }),
      neutral: colorKey({ r: 0xC9 / 255, g: 0xCD / 255, b: 0xD1 / 255, a: 1 }),
      pearl: colorKey({ r: 0xF2 / 255, g: 0xF0 / 255, b: 0xEB / 255, a: 1 }),
    };
    const runtimeColors = cubes.map((object) => ({ parentUuid: object.parentUuid, color: object.material?.layers?.find((layer) => layer.type === 'pattern')?.colorA }));
    html.dataset.semanticIsolation = JSON.stringify({
      targetCount: targetSet.size,
      targetIndigo: runtimeColors.filter((entry) => entry.parentUuid === '889ba072-8c04-4fa0-80f7-5c32e26dd963' && colorKey(entry.color) === expected.indigo).length,
      targetNeutral: runtimeColors.filter((entry) => entry.parentUuid === '9d07611a-c5ce-4020-abf0-dd0f4ca95d89' && colorKey(entry.color) === expected.neutral).length,
      targetPearl: runtimeColors.filter((entry) => entry.parentUuid === '1687f9e7-cac3-4b61-b5f6-a6dd86082fff' && colorKey(entry.color) === expected.pearl).length,
      nonTargetChanged: runtimeColors.filter((entry) => !targetSet.has(entry.parentUuid) && colorKey(entry.color) !== expected.neutral).length,
      runtimeCubeCount: cubes.length,
    });
    html.dataset.semanticConsole = JSON.stringify(runtimeConsole);
    const targetCubes = Object.fromEntries(targetRendered.map((entry) => [entry.id, cubes.filter((object) => object.parentUuid === entry.id)]));
    setInterval(() => {
      html.dataset.semanticTargetMotion = JSON.stringify(Object.fromEntries(Object.entries(targetCubes).map(([id, group]) => [id, group.map((object) => ({
        uuid: object.uuid,
        position: object.position ? { x: object.position.x, y: object.position.y, z: object.position.z } : null,
        scale: object.scale ? { x: object.scale.x, y: object.scale.y, z: object.scale.z } : null,
      }))])));
      html.dataset.semanticActiveParents = JSON.stringify(cubes.filter((object) => (object.scale?.y ?? 0) > 0.2).map((object) => object.parentUuid));
    }, 120);
    html.dataset.semanticCubeObjects = JSON.stringify(cubes.map(objectInfo));
    setStatus('ready');
  };
  start().catch((error) => { html.dataset.semanticStatus = 'error'; html.dataset.semanticError = String(error?.stack || error); status.textContent = 'SELECTIVE INSTANCE STATE R1 · ERROR'; console.error('[Boxes Hover semantic instance state R1]', error); });
})();
