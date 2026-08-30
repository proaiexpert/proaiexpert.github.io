import fs from 'node:fs';
import path from 'node:path';

const root = process.argv[2];
if (!root) throw new Error('Usage: node patch-r1.mjs <donor-root>');

function edit(rel, mutate) {
  const file = path.join(root, rel);
  const before = fs.readFileSync(file, 'utf8');
  const after = mutate(before);
  if (after === before) throw new Error(`No changes applied to ${rel}`);
  fs.writeFileSync(file, after);
  console.log(`patched ${rel}`);
}

function replaceOnce(text, search, replacement, label) {
  const idx = text.indexOf(search);
  if (idx < 0) throw new Error(`Missing patch anchor: ${label}`);
  if (text.indexOf(search, idx + search.length) >= 0) throw new Error(`Non-unique patch anchor: ${label}`);
  return text.slice(0, idx) + replacement + text.slice(idx + search.length);
}

edit('src/modes/fissures.ts', (input) => {
  let s = input;
  s = replaceOnce(s,
    '  abs, attribute, float, mix, positionLocal, smoothstep, step, time, uniform, vec3,',
    '  abs, attribute, float, mix, positionLocal, smoothstep, step, uniform, vec3,',
    'remove fire-flicker time import');

  s = s.replace(/export const defaultFissureSettings: FissureSettings = \{[\s\S]*?\n\};/, `export const defaultFissureSettings: FissureSettings = {
  width: 0.042,
  heat: 1,
  pulseSpeed: 0,
  branchDensity: 0,
  branchLength: 0.24,
  emberRate: 0,
  rockDensity: 0,
  rockSize: 0.065,
  lightSpill: 0,
  growthSpeed: 1.15,
};`);

  s = replaceOnce(s,
    '    this.coreMat.blending = THREE.AdditiveBlending;',
    '    this.coreMat.blending = THREE.NormalBlending;',
    'core normal blending');

  s = replaceOnce(s,
    '      this.rockMeshes.push(mesh);\n      this.group.add(mesh);',
    '      mesh.visible = false;\n      this.rockMeshes.push(mesh);\n      this.group.add(mesh);',
    'disable rocks visually');

  s = replaceOnce(s,
    '    this.emberMesh.renderOrder = 3;\n    this.emberMesh.frustumCulled = false;\n    this.group.add(this.emberMesh);',
    '    this.emberMesh.renderOrder = 3;\n    this.emberMesh.frustumCulled = false;\n    this.emberMesh.visible = false;\n    this.group.add(this.emberMesh);',
    'disable embers visually');

  s = replaceOnce(s,
    '      const light = new THREE.PointLight(0xff7030, 0, 1.5, 2);',
    '      const light = new THREE.PointLight(0x676bff, 0, 1.5, 2);\n      light.visible = false;',
    'disable lava point-light spill');

  const coreStart = s.indexOf('  /** Blackbody-ish core:');
  const underComment = s.indexOf('  /** The wide additive halo', coreStart);
  if (coreStart < 0 || underComment < 0) throw new Error('Missing core material function range');
  const coreReplacement = `  /** ProAI controlled activation path: quiet material wake + precise travelling front. */
  private buildCoreNodes(mat: MeshBasicNodeMaterial): void {
    const aAcross = attrFloat('aAcross');
    const aDist = attrFloat('aDist');
    const aJit = attrFloat('aJit');
    const aSide = attrVec3('aSide');
    const { sel, taper, tip } = this.branchFactors();

    mat.positionNode = positionLocal.add(
      aSide.mul(this.uWidth.mul(0.5).mul(aAcross).mul(aJit)).mul(taper.mul(sel)),
    );

    // Donor propagation authority remains uGrown - aDist. Only visual semantics change.
    const delta = this.uGrown.sub(aDist);
    const opened = smoothstep(0.0, 0.045, delta);
    const front = smoothstep(0.018, 0.085, abs(delta.sub(0.055))).oneMinus().mul(tip);
    const wake = smoothstep(0.035, 0.19, abs(delta.sub(0.16))).oneMinus().mul(0.18);
    const activated = smoothstep(0.10, 0.24, delta);
    const cross = smoothstep(0.84, 1.0, abs(aAcross)).oneMinus();
    const edgeResponse = smoothstep(0.52, 0.92, abs(aAcross)).mul(0.16);

    const graphite = vec3(0.075, 0.09, 0.105);
    const resolved = vec3(0.17, 0.195, 0.225);
    const silver = vec3(1.12, 1.15, 1.18);
    const indigo = vec3(0.357, 0.314, 1.0);

    let color = mix(graphite, resolved, activated);
    color = color.add(indigo.mul(wake));
    color = mix(color, silver, front.mul(0.92));
    color = color.add(vec3(0.22, 0.23, 0.245).mul(edgeResponse).mul(activated));
    mat.colorNode = color;
    mat.opacityNode = opened.mul(cross).mul(sel).mul(tip).mul(0.86);
  }

`;
  s = s.slice(0, coreStart) + coreReplacement + s.slice(underComment);

  const underStart = s.indexOf('  /** The wide additive halo');
  const rocksStart = s.indexOf('  // ----- rocks -----', underStart);
  if (underStart < 0 || rocksStart < 0) throw new Error('Missing underglow function range');
  const underReplacement = `  /** Restrained front-localized Indigo optical spill; no full-path neon halo. */
  private buildUnderglowNodes(mat: MeshBasicNodeMaterial): void {
    const aAcross = attrFloat('aAcross');
    const aDist = attrFloat('aDist');
    const aJit = attrFloat('aJit');
    const aSide = attrVec3('aSide');
    const { sel, taper, tip } = this.branchFactors();

    mat.positionNode = positionLocal.add(
      aSide.mul(this.uGlowWidth.mul(0.5).mul(aAcross).mul(aJit)).mul(taper.mul(sel)),
    );

    const delta = this.uGrown.sub(aDist);
    const opened = smoothstep(0.0, 0.035, delta);
    const front = smoothstep(0.025, 0.13, abs(delta.sub(0.07))).oneMinus().mul(tip);
    const falloff = abs(aAcross).oneMinus().max(0).pow(2.5);
    const strength = front.mul(falloff).mul(0.22);
    mat.colorNode = vec3(0.357, 0.314, 1.0).mul(strength);
    mat.opacityNode = opened.mul(front).mul(falloff).mul(sel).mul(0.28);
  }

`;
  s = s.slice(0, underStart) + underReplacement + s.slice(rocksStart);

  s = replaceOnce(s,
    '    this.uGlowWidth.value = s.width * 3.4 + 0.05;',
    '    this.uGlowWidth.value = s.width * 1.35 + 0.02;',
    'restrain underglow width');

  return s;
});

edit('src/app.ts', (input) => {
  let s = input;
  s = replaceOnce(s, "    mode: 'Crystals',", "    mode: 'Molten fissures',", 'default fissure mode');
  s = replaceOnce(s, '    exposure: 1.1,', '    exposure: 1.05,', 'exposure');
  s = replaceOnce(s, '    envIntensity: 0.9,', '    envIntensity: 0.72,', 'environment intensity');
  s = replaceOnce(s, '    backlight: 1,', '    backlight: 0.45,', 'backlight');
  s = replaceOnce(s, '    bloomStrength: 0.4,', '    bloomStrength: 0.06,', 'bloom strength');
  s = replaceOnce(s, '    bloomThreshold: 0.75,', '    bloomThreshold: 1.15,', 'bloom threshold');
  s = replaceOnce(s,
    '  readonly fissure: FissureSettings = { ...defaultFissureSettings };',
    `  readonly fissure: FissureSettings = {
    ...defaultFissureSettings,
    width: 0.042,
    branchDensity: 0,
    emberRate: 0,
    rockDensity: 0,
    lightSpill: 0,
    growthSpeed: 1.15,
  };`,
    'fissure R1 settings');

  s = replaceOnce(s, '    this.scene.background = new THREE.Color(0x0a0b10);', '    this.scene.background = new THREE.Color(0x020304);', 'obsidian background');
  s = replaceOnce(s, '    this.scene.fog = new THREE.Fog(0x0a0b10, 9, 22);', '    this.scene.fog = new THREE.Fog(0x020304, 9, 22);', 'obsidian fog');

  const envStart = s.indexOf('  private setupEnvironment(): void {');
  const lightsDoc = s.indexOf('  /**\n   * A cinematic three-point rig', envStart);
  if (envStart < 0 || lightsDoc < 0) throw new Error('Missing setupEnvironment range');
  const envReplacement = `  private setupEnvironment(): void {
    const env = new THREE.Scene();
    const geo = new THREE.PlaneGeometry(1, 1);

    const panel = (
      color: number,
      intensity: number,
      w: number,
      h: number,
      pos: [number, number, number],
    ): void => {
      const mat = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
      mat.color.set(color).multiplyScalar(intensity);
      const m = new THREE.Mesh(geo, mat);
      m.scale.set(w, h, 1);
      m.position.set(...pos);
      m.lookAt(0, 0, 0);
      env.add(m);
    };

    // Same donor PMREM/studio-panel architecture, translated to restrained ProAI neutrals.
    panel(0xf2f0eb, 7.0, 4.5, 3, [1.5, 8, 2]);
    panel(0xc9cdd1, 14.0, 0.7, 4.5, [-2.5, 5, -6]);
    panel(0x9ba8ff, 1.8, 1.2, 7, [-7, 2, -2]);
    panel(0x69727d, 1.7, 1.6, 5, [6, 1.5, 3]);
    panel(0x676bff, 0.55, 6, 3.5, [0, 2.5, -8]);
    panel(0x171c22, 0.75, 9, 9, [0, -5, 0]);

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(env, 0.04).texture;
    this.scene.environmentIntensity = this.settings.envIntensity;
    pmrem.dispose();
    geo.dispose();
  }

`;
  s = s.slice(0, envStart) + envReplacement + s.slice(lightsDoc);

  const lightsStart = s.indexOf('  private setupLights(): void {');
  const sphereDoc = s.indexOf('  /** The canvas itself:', lightsStart);
  if (lightsStart < 0 || sphereDoc < 0) throw new Error('Missing setupLights range');
  const lightsReplacement = `  private setupLights(): void {
    const hemi = new THREE.HemisphereLight(0x87919d, 0x020304, 0.10);

    const key = new THREE.SpotLight(0xe7e8e9, 44, 0, Math.PI / 5, 0.62, 1.8);
    key.position.set(3.4, 5.6, 2.6);
    key.target.position.set(0, 0, 0);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 20;
    key.shadow.bias = -0.0004;
    key.shadow.normalBias = 0.02;
    key.shadow.radius = 5;

    const back = new THREE.DirectionalLight(0x9ba8ff, 0.95);
    back.position.set(-3, 3.2, -4.5);
    const kick = new THREE.DirectionalLight(0xc9cdd1, 0.70);
    kick.position.set(4.5, 1.2, -3);
    this.backLights = [
      { light: back, base: 0.95 },
      { light: kick, base: 0.70 },
    ];

    const under = new THREE.PointLight(0x5b50ff, 0.08, 6, 1.6);
    under.position.set(0, GROUND_Y + 0.25, 0);

    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(14, 64),
      new THREE.MeshPhysicalMaterial({
        map: makeFloorTexture(),
        color: 0xffffff,
        roughness: 0.96,
        metalness: 0.02,
        specularIntensity: 0.10,
        envMapIntensity: 0.12,
      }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = GROUND_Y;
    ground.receiveShadow = true;

    const backdrop = new THREE.Mesh(
      new THREE.SphereGeometry(30, 32, 16),
      new THREE.MeshBasicMaterial({ map: makeBackdropTexture(), side: THREE.BackSide, fog: false }),
    );

    this.scene.add(hemi, key, key.target, back, kick, under, ground, backdrop);
  }

`;
  s = s.slice(0, lightsStart) + lightsReplacement + s.slice(sphereDoc);

  const sphereStart = s.indexOf('  private setupCanvasSphere(): void {');
  const dustDoc = s.indexOf('  /** A whisper of drifting dust', sphereStart);
  if (sphereStart < 0 || dustDoc < 0) throw new Error('Missing setupCanvasSphere range');
  const sphereReplacement = `  private setupCanvasSphere(): void {
    const mat = new THREE.MeshPhysicalMaterial({
      color: 0x242a31,
      metalness: 0.62,
      roughness: 0.40,
      clearcoat: 0.12,
      clearcoatRoughness: 0.38,
      sheen: 0,
      envMapIntensity: 0.72,
      specularIntensity: 0.55,
    });
    // Donor carrier geometry is intentionally unchanged.
    this.sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 96, 64), mat);
    this.sphere.castShadow = true;
    this.sphere.receiveShadow = true;

    this.floatRoot.add(this.sphere, this.paintRoot);
    this.scene.add(this.floatRoot);
    indexForRaycasts(this.floatRoot);
  }

`;
  s = s.slice(0, sphereStart) + sphereReplacement + s.slice(dustDoc);

  s = replaceOnce(s, '        opacity: 0.45,', '        opacity: 0,', 'hide donor dust');

  const applyModesAnchor = '    this.applyModes();\n\n    document.getElementById(\'modeBtn\')!';
  const instrumented = `    this.applyModes();

    // Non-visual QA instrumentation. It does not create or drive propagation.
    (window as Window & { __PROAI_R1__?: unknown }).__PROAI_R1__ = {
      backend: () => (this.renderer.backend as { isWebGPUBackend?: boolean }).isWebGPUBackend
        ? 'WebGPU'
        : 'WebGL2 (fallback)',
      strokeCount: () => this.strokes.length,
      liveCount: () => this.live.length,
      snapshot: () => this.live.map((instance) => {
        const state = instance as unknown as { grown?: number; total?: number };
        return { grown: state.grown ?? 0, total: state.total ?? 0 };
      }),
    };

    document.getElementById('modeBtn')!`;
  s = replaceOnce(s, applyModesAnchor, instrumented, 'QA instrumentation');

  s = replaceOnce(s, "  ctx.fillStyle = '#06070b';", "  ctx.fillStyle = '#020304';", 'backdrop obsidian');
  s = replaceOnce(s,
    "  blob(w * 0.3, h * 0.38, 280, 'rgba(74, 52, 138, 0.34)');  // violet bloom, camera-left\n  blob(w * 0.78, h * 0.45, 220, 'rgba(40, 58, 118, 0.22)'); // cooler bloom, camera-right\n  blob(w * 0.55, h * 0.2, 180, 'rgba(120, 100, 190, 0.10)'); // faint high sparkle wash",
    "  blob(w * 0.3, h * 0.38, 280, 'rgba(28, 32, 38, 0.15)');\n  blob(w * 0.78, h * 0.45, 220, 'rgba(20, 24, 30, 0.11)');\n  blob(w * 0.55, h * 0.2, 180, 'rgba(88, 94, 104, 0.045)');",
    'remove violet backdrop wash');
  s = replaceOnce(s, "  g.addColorStop(0, '#0f1118');", "  g.addColorStop(0, '#0e1217');", 'floor center');
  s = replaceOnce(s, "  g.addColorStop(0.45, '#0b0c12');", "  g.addColorStop(0.45, '#090b0e');", 'floor mid');
  s = replaceOnce(s, "  g.addColorStop(1, '#08090d');", "  g.addColorStop(1, '#050607');", 'floor edge');

  return s;
});

edit('index.html', (input) => {
  let s = input;
  s = replaceOnce(s, '<title>Geometry Painter — three.js WebGPU</title>', '<title>ProAI Fissure Propagation Viability R1</title>', 'document title');
  const style = `\n    <style id="proai-r1">\n      html, body { background: #020304 !important; }\n      #title, #modeBtn, #hud, #toast, #drawFrame, .lil-gui { display: none !important; }\n      #app { background: #020304; }\n      body.draw #app { cursor: crosshair; }\n    </style>\n`;
  s = replaceOnce(s, '  </head>', `${style}  </head>`, 'R1 presentation style');
  return s;
});
