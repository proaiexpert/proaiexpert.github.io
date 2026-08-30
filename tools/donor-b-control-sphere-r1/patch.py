from pathlib import Path

root = Path('.')
app = root / 'src/app.ts'
s = app.read_text()

# Review-only settings: modes remain in donor source, but draw mode is disabled.
s = s.replace("    drawMode: true,\n", "    drawMode: false,\n")
s = s.replace("    exposure: 1.1,\n    envIntensity: 0.9,\n    backlight: 1,\n    bloomStrength: 0.4,\n    bloomThreshold: 0.75,\n", "    exposure: 1.0,\n    envIntensity: 1.18,\n    backlight: 1,\n    bloomStrength: 0.08,\n    bloomThreshold: 0.96,\n")

field_marker = "  private regrowCost = 0;\n\n  constructor(private container: HTMLElement) {}"
fields = """  private regrowCost = 0;

  // PROAI control-sphere R1 interaction state. Geometry is intentionally untouched.
  private rearLight!: THREE.DirectionalLight;
  private kickerLight!: THREE.DirectionalLight;
  private pointerTarget = new THREE.Vector2();
  private pointerCurrent = new THREE.Vector2();
  private engagedTarget = 0;
  private engaged = 0;
  private autoY = 0;
  private reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  private forcedEngaged = new URLSearchParams(window.location.search).get('engaged') === '1';

  constructor(private container: HTMLElement) {}"""
assert field_marker in s
s = s.replace(field_marker, fields)

s = s.replace("    this.scene.background = new THREE.Color(0x0a0b10);\n    this.scene.fog = new THREE.Fog(0x0a0b10, 9, 22);\n    this.camera.position.set(2.7, 1.15, 3.3);\n", "    this.scene.background = new THREE.Color(0x020304);\n    this.scene.fog = new THREE.Fog(0x020304, 9, 22);\n    this.camera.position.set(2.55, 0.42, 3.75);\n")
s = s.replace("    this.controls.target.set(0, -0.05, 0);\n", "    this.controls.target.set(0, 0, 0);\n")

# Replace the painter/UI activation block but preserve donor SurfacePainter/camera architecture.
start = s.index("    this.painter = new SurfacePainter(")
end = s.index("    window.addEventListener('resize', this.onResize);", start)
review_block = """    this.painter = new SurfacePainter(
      renderer.domElement,
      this.camera,
      this.scene,
      () => [this.sphere],
      this.floatRoot,
    );
    // Sphere-only gate: donor modes remain untouched but cannot author strokes here.
    this.painter.onStroke = null;
    this.painter.setEnabled(false);
    this.controls.enabled = false;
    document.body.classList.remove('draw', 'orbit');
    document.body.classList.add('proai-review');

    const updatePointer = (e: PointerEvent): void => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      this.pointerTarget.set(THREE.MathUtils.clamp(x, -1, 1), THREE.MathUtils.clamp(y, -1, 1));
      this.engagedTarget = Math.hypot(x, y) < 0.82 ? 1 : 0;
    };
    renderer.domElement.addEventListener('pointermove', updatePointer);
    renderer.domElement.addEventListener('pointerleave', () => {
      this.pointerTarget.set(0, 0);
      this.engagedTarget = 0;
    });
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionQuery.addEventListener('change', (e) => { this.reducedMotion = e.matches; });

"""
s = s[:start] + review_block + s[end:]

# PMREM studio: same donor architecture, ProAI-neutral sources with one restrained indigo optical source.
env_start = s.index("  private setupEnvironment(): void {")
env_end = s.index("  /**\n   * A cinematic three-point rig", env_start)
env_func = """  private setupEnvironment(): void {
    const env = new THREE.Scene();
    env.background = new THREE.Color(0x020304);
    const geo = new THREE.PlaneGeometry(1, 1);
    const panel = (color: number, intensity: number, w: number, h: number, pos: [number, number, number]): void => {
      const mat = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
      mat.color.set(color).multiplyScalar(intensity);
      const m = new THREE.Mesh(geo, mat);
      m.scale.set(w, h, 1);
      m.position.set(...pos);
      m.lookAt(0, 0, 0);
      env.add(m);
    };

    panel(0xf2f0eb, 7.2, 4.8, 2.2, [1.4, 7.5, 2.8]);   // broad Pearl-neutral crown
    panel(0xc9cdd1, 16, 0.48, 5.2, [-3.2, 4.8, -6]); // narrow Silver rear strip
    panel(0xd8dce0, 4.2, 0.82, 6.2, [-6.5, 1.5, -1.8]); // cool-neutral side strip
    panel(0x9da3aa, 2.2, 1.0, 4.5, [5.7, 0.4, 2.6]); // restrained gunmetal fill source
    panel(0x676bff, 0.42, 3.6, 2.2, [0, 2.2, -7.5]); // near-absent Indigo rear optical event
    panel(0x171c22, 0.55, 8, 8, [0, -5, 0]); // deep graphite floor bounce

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(env, 0.04).texture;
    this.scene.environmentIntensity = this.settings.envIntensity;
    pmrem.dispose();
    geo.dispose();
  }

"""
s = s[:env_start] + env_func + s[env_end:]

# Product-light rig. Ground/backdrop are existing donor geometry, not new geometry.
light_start = s.index("  private setupLights(): void {")
light_end = s.index("  /** The canvas itself:", light_start)
light_func = """  private setupLights(): void {
    const hemi = new THREE.HemisphereLight(0x9da3aa, 0x020304, 0.055);

    const key = new THREE.SpotLight(0xf2f0eb, 62, 0, Math.PI / 6, 0.62, 1.8);
    key.position.set(3.2, 5.4, 3.0);
    key.target.position.set(-0.1, 0.05, 0);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 20;
    key.shadow.bias = -0.0004;
    key.shadow.normalBias = 0.02;
    key.shadow.radius = 5;

    this.rearLight = new THREE.DirectionalLight(0xc9cdd1, 2.25);
    this.rearLight.position.set(-3.2, 2.7, -4.6);
    this.kickerLight = new THREE.DirectionalLight(0xd8dce0, 1.0);
    this.kickerLight.position.set(4.8, 1.1, -3.2);
    this.backLights = [
      { light: this.rearLight, base: 2.25 },
      { light: this.kickerLight, base: 1.0 },
    ];

    const under = new THREE.PointLight(0x242a31, 0.18, 5, 1.8);
    under.position.set(0, GROUND_Y + 0.18, 0.4);

    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(14, 64),
      new THREE.MeshPhysicalMaterial({ map: makeFloorTexture(), color: 0xffffff, roughness: 0.98, metalness: 0, specularIntensity: 0.06, envMapIntensity: 0.06 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = GROUND_Y;
    ground.receiveShadow = true;

    const backdrop = new THREE.Mesh(
      new THREE.SphereGeometry(30, 32, 16),
      new THREE.MeshBasicMaterial({ map: makeBackdropTexture(), side: THREE.BackSide, fog: false }),
    );

    this.scene.add(hemi, key, key.target, this.rearLight, this.kickerLight, under, ground, backdrop);
  }

"""
s = s[:light_start] + light_func + s[light_end:]

sphere_start = s.index("  private setupCanvasSphere(): void {")
sphere_end = s.index("  /** A whisper of drifting dust", sphere_start)
sphere_func = """  private setupCanvasSphere(): void {
    const mat = new THREE.MeshPhysicalMaterial({
      color: 0x181d23,
      metalness: 0.96,
      roughness: 0.145,
      clearcoat: 0.32,
      clearcoatRoughness: 0.08,
      sheen: 0.04,
      sheenColor: new THREE.Color(0x242a31),
      sheenRoughness: 0.82,
      anisotropy: 0.36,
      anisotropyRotation: 0.22,
      specularIntensity: 1,
      envMapIntensity: 1.22,
    });
    // GEOMETRY FREEZE: exact donor sphere geometry, radius/topology/subdivisions unchanged.
    this.sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 96, 64), mat);
    this.sphere.castShadow = true;
    this.sphere.receiveShadow = true;

    this.floatRoot.add(this.sphere, this.paintRoot);
    this.scene.add(this.floatRoot);
    indexForRaycasts(this.floatRoot);
  }

"""
s = s[:sphere_start] + sphere_func + s[sphere_end:]

# Keep donor dust code present but invisible in sphere-only review.
s = s.replace("    const N = 320;\n", "    const N = 0;\n")

# Replace frame loop only; all donor mode implementations remain untouched in files/history.
tick_start = s.index("  private tick(time: number): void {")
tick_end = s.index("\n}\n\n/**\n * The out-of-focus studio", tick_start)
tick_func = """  private tick(time: number): void {
    const dt = Math.min((time - this.lastTime) / 1000, 0.05);
    this.lastTime = time;

    const damping = 1 - Math.exp(-dt * 3.2);
    this.pointerCurrent.lerp(this.pointerTarget, damping);
    const desiredEngaged = this.forcedEngaged ? 1 : this.engagedTarget;
    this.engaged = THREE.MathUtils.lerp(this.engaged, desiredEngaged, 1 - Math.exp(-dt * 2.7));

    if (!this.reducedMotion) this.autoY += dt * 0.026;
    const biasX = this.reducedMotion ? 0 : this.pointerCurrent.y * 0.032 * this.engaged;
    const biasY = this.reducedMotion ? 0 : this.pointerCurrent.x * 0.048 * this.engaged;
    const biasZ = this.reducedMotion ? 0 : -this.pointerCurrent.x * 0.012 * this.engaged;
    this.floatRoot.rotation.set(biasX, this.autoY + biasY, biasZ);

    // Physically plausible rear response: modest lateral motion + Silver→Indigo interpolation.
    const px = this.pointerCurrent.x * this.engaged;
    const py = this.pointerCurrent.y * this.engaged;
    this.rearLight.position.x = -3.2 + px * 1.1;
    this.rearLight.position.y = 2.7 + py * 0.45;
    this.rearLight.intensity = 2.25 + this.engaged * 0.48;
    this.kickerLight.position.x = 4.8 - px * 0.55;
    this.kickerLight.intensity = 1.0 + this.engaged * 0.16;
    this.rearLight.color.copy(new THREE.Color(0xc9cdd1)).lerp(new THREE.Color(0x676bff), this.engaged * 0.34);

    // QA state is data only; it does not alter visuals.
    (window as unknown as { __PROAI_QA: unknown }).__PROAI_QA = {
      backend: (this.renderer.backend as { isWebGPUBackend?: boolean }).isWebGPUBackend ? 'WebGPU' : 'WebGL2 (fallback)',
      engaged: this.engaged,
      autoY: this.autoY,
      reducedMotion: this.reducedMotion,
      geometry: 'SphereGeometry(1,96,64)',
      background: '#020304',
    };

    this.post.render();
  }"""
s = s[:tick_start] + tick_func + s[tick_end:]

# True-obsidian backdrop/floor: remove donor violet blooms while retaining donor texture architecture.
back_start = s.index("function makeBackdropTexture(): THREE.CanvasTexture {")
back_end = s.index("/** Near-black satin floor", back_start)
back_func = """function makeBackdropTexture(): THREE.CanvasTexture {
  const w = 1024;
  const h = 512;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  const g = ctx.createRadialGradient(w * 0.5, h * 0.46, 0, w * 0.5, h * 0.46, w * 0.52);
  g.addColorStop(0, '#050607');
  g.addColorStop(0.52, '#020304');
  g.addColorStop(1, '#020304');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

"""
s = s[:back_start] + back_func + s[back_end:]
s = s.replace("  g.addColorStop(0, '#0f1118');\n  g.addColorStop(0.45, '#0b0c12');\n  g.addColorStop(1, '#08090d');\n", "  g.addColorStop(0, '#090b0e');\n  g.addColorStop(0.45, '#050607');\n  g.addColorStop(1, '#020304');\n")

app.write_text(s)

# Minimal isolated review presentation. No donor GUI/mode chrome is exposed.
index = root / 'index.html'
index.write_text('''<!doctype html>\n<html lang="en">\n<head>\n<meta charset="UTF-8" />\n<meta name="viewport" content="width=device-width, initial-scale=1.0" />\n<title>PROAI — Donor B Control Sphere R1</title>\n<style>\nhtml,body{margin:0;width:100%;height:100%;overflow:hidden;background:#020304}#app{position:fixed;inset:0;background:#020304}canvas{display:block;width:100%;height:100%}.fatal{position:fixed;inset:auto 16px 16px 16px;padding:12px;color:#f2f0eb;background:#090b0e;font:12px/1.4 system-ui;border:1px solid #242a31}\n</style>\n</head>\n<body><div id="app"></div><div id="hud" hidden></div><div id="toast" hidden></div><div id="modeBtn" hidden><span class="label"></span></div><div id="drawFrame" hidden></div><script type="module" src="/src/main.ts"></script></body>\n</html>\n''')

print('patched src/app.ts and index.html')
