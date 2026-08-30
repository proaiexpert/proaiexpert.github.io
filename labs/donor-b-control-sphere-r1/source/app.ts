import * as THREE from 'three/webgpu';
import { float, pass, screenUV, smoothstep, vec2 } from 'three/tsl';
import { bloom } from 'three/addons/tsl/display/BloomNode.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { indexForRaycasts } from './bvh';
import { SurfacePainter } from './surfacePainter';
import type { PaintMode, StrokeInstance, SurfaceSample } from './modes/mode';
import {
  crystalMode,
  defaultCrystalSettings,
  setCrystalGlow,
  type CrystalSettings,
} from './modes/crystals';
import { defaultFissureSettings, fissureMode, type FissureSettings } from './modes/fissures';
import { auroraMode, defaultAuroraSettings, type AuroraSettings } from './modes/aurora';
import { defaultReefSettings, reefMode, type ReefSettings } from './modes/reef';
import { buildGui } from './ui';

export type ModeName = 'Crystals' | 'Molten fissures' | 'Aurora silk' | 'Bioluminescent reef';

const GROUND_Y = -1.55; // the floor the sphere floats above

interface Stroke {
  samples: SurfaceSample[];
  index: number;    // stable per-stroke id; combined with the global seed to vary each stroke
  mode: ModeName;   // which painting mode authored it (strokes rebuild through their own mode)
}

/** Everything the GUI edits. Mode-specific settings live in their own sub-objects. */
export interface AppSettings {
  mode: ModeName;
  drawMode: boolean;
  seed: number;
  exposure: number;
  envIntensity: number;
  backlight: number; // scales the kickers that stream light through the crystals
  bloomStrength: number;
  bloomThreshold: number;
}

export class App {
  readonly settings: AppSettings = {
    mode: 'Crystals',
    drawMode: false,
    seed: 1,
    exposure: 1.0,
    envIntensity: 1.18,
    backlight: 1,
    bloomStrength: 0.08,
    bloomThreshold: 0.96,
  };

  readonly crystal: CrystalSettings = { ...defaultCrystalSettings };
  readonly fissure: FissureSettings = { ...defaultFissureSettings };
  readonly aurora: AuroraSettings = { ...defaultAuroraSettings };
  readonly reef: ReefSettings = { ...defaultReefSettings };

  /** Registry of painting modes — new modes plug in here. */
  private modes: Record<ModeName, PaintMode<unknown>> = {
    'Crystals': crystalMode as PaintMode<unknown>,
    'Molten fissures': fissureMode as PaintMode<unknown>,
    'Aurora silk': auroraMode as PaintMode<unknown>,
    'Bioluminescent reef': reefMode as PaintMode<unknown>,
  };

  /** Snapshot of the settings object a given mode consumes. */
  private settingsFor(mode: ModeName): unknown {
    switch (mode) {
      case 'Crystals': return { ...this.crystal };
      case 'Molten fissures': return { ...this.fissure };
      case 'Aurora silk': return { ...this.aurora };
      case 'Bioluminescent reef': return { ...this.reef };
    }
  }

  private renderer!: THREE.WebGPURenderer;
  private post!: THREE.PostProcessing;
  private bloomNode!: ReturnType<typeof bloom>;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100);
  private controls!: OrbitControls;
  private painter!: SurfacePainter;

  /** The floating canvas: sphere + everything painted on it bob and turn together. */
  private floatRoot = new THREE.Group();
  private sphere!: THREE.Mesh;
  private paintRoot = new THREE.Group(); // strokes parent here (child of floatRoot)

  private strokes: Stroke[] = [];
  private live: StrokeInstance[] = [];
  private strokeCounter = 0;

  private dust!: THREE.Points;
  private dustVel: number[] = [];
  /** The backlight/kicker pair, scaled together by the Backlight slider. */
  private backLights: { light: THREE.DirectionalLight; base: number }[] = [];

  private hud = document.getElementById('hud')!;
  private lastTime = 0;
  private hovering = false;
  private toastTimer = 0;
  private regrowPending: { mode: 'instant' | 'animate' } | null = null;
  private lastRegrowAt = 0;
  private regrowCost = 0;

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

  constructor(private container: HTMLElement) {}

  async start(): Promise<void> {
    const renderer = new THREE.WebGPURenderer({ antialias: true });
    await renderer.init();
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = this.settings.exposure;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(renderer.domElement);
    this.renderer = renderer;

    this.scene.background = new THREE.Color(0x020304);
    this.scene.fog = new THREE.Fog(0x020304, 9, 22);
    this.camera.position.set(2.55, 0.42, 3.75);

    this.controls = new OrbitControls(this.camera, renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.minDistance = 1.6;
    this.controls.maxDistance = 10;
    this.controls.target.set(0, 0, 0);
    // Keep the camera above the horizon so you can't tumble under the floor.
    this.controls.maxPolarAngle = Math.PI / 2 - 0.02;

    this.setupEnvironment();
    this.setupLights();
    this.setupCanvasSphere();
    this.setupDust();
    this.setupPost();

    this.painter = new SurfacePainter(
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
    window.addEventListener('pointermove', updatePointer, { passive: true });
    window.addEventListener('pointerout', (e) => {
      if (e.relatedTarget) return;
      this.pointerTarget.set(0, 0);
      this.engagedTarget = 0;
    });
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionQuery.addEventListener('change', (e) => { this.reducedMotion = e.matches; });

    window.addEventListener('resize', this.onResize);
    this.onResize();

    renderer.setAnimationLoop((t) => this.tick(t));
  }

  // ---------- environment: a dark studio captured into a PMREM env map ----------

  /**
   * The "perfect light set" starts here: crystals and the lacquered sphere are mostly
   * REFLECTION, so what matters most is what there is to reflect. We build a black studio
   * with a huge overhead softbox, a cool strip camera-left, a warm strip camera-right and a
   * violet wash behind — classic three-point product lighting — and prefilter it into the
   * environment map. Every glossy highlight in the scene is one of these shapes.
   */
  private setupEnvironment(): void {
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

  /**
   * A cinematic three-point rig, tuned like a product macro shot:
   *  - KEY: a focused warm spot from top-front-right with a soft penumbra — a pool of
   *    light on the subject instead of a flat wash over the whole set.
   *  - BACKLIGHT + KICKER: cool violet-blue from behind. These are what make the
   *    transmissive crystals GLOW from within (transmission responds to light arriving
   *    from behind the surface) — the signature of the reference look.
   *  - FILL: a whisper of hemisphere so shadows never crush to pure black.
   */
  private setupLights(): void {
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

  /** The canvas itself: a satin basalt sphere — a quiet stage that lets the crystals star.
   *  Matte enough that the studio doesn't mirror across it, with just enough clearcoat
   *  for a soft polished-stone sheen at grazing angles. */
  private setupCanvasSphere(): void {
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

  /** A whisper of drifting dust — depth cue and atmosphere, kept deliberately subtle. */
  private setupDust(): void {
    const N = 0;
    const positions = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const r = 1.9 + Math.random() * 4.5;
      const a = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = GROUND_Y + 0.1 + Math.random() * 4.2;
      positions[i * 3 + 2] = Math.sin(a) * r;
      this.dustVel.push(0.02 + Math.random() * 0.05);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.dust = new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        color: 0x9db4e8,
        size: 0.02,
        transparent: true,
        opacity: 0.45,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      }),
    );
    this.dust.frustumCulled = false;
    this.scene.add(this.dust);
  }

  /** Post: MSAA scene pass + bloom + a gentle lens vignette, tone-mapped on output. */
  private setupPost(): void {
    const scenePass = pass(this.scene, this.camera, { samples: 4 });
    const color = scenePass.getTextureNode();
    this.bloomNode = bloom(color, this.settings.bloomStrength, 0.6, this.settings.bloomThreshold);
    // Vignette: full exposure in the middle, ~35% falloff into the corners — pulls the
    // eye to the subject the way a fast lens does.
    const vignette = float(1).sub(smoothstep(0.5, 0.92, screenUV.distance(vec2(0.5, 0.5))).mul(0.35));
    this.post = new THREE.PostProcessing(this.renderer);
    this.post.outputNode = color.add(this.bloomNode).mul(vignette);
  }

  // ---------- strokes ----------

  addStroke(samples: SurfaceSample[]): void {
    const stroke: Stroke = { samples, index: this.strokeCounter++, mode: this.settings.mode };
    this.strokes.push(stroke);
    this.buildStroke(stroke, true);
    const toasts: Record<ModeName, string> = {
      'Crystals': '💎 crystals seeded — watch them grow',
      'Molten fissures': '🔥 fissure torn open — stand back',
      'Aurora silk': '🌌 aurora silk unfurling — look up',
      'Bioluminescent reef': '🪸 reef colony seeded — watch it come alive',
    };
    this.showToast(toasts[stroke.mode]);
  }

  private buildStroke(stroke: Stroke, animate: boolean): void {
    const seed = this.effectiveSeed(stroke.index);
    const instance = this.modes[stroke.mode].createStroke(stroke.samples, seed, this.settingsFor(stroke.mode));
    this.paintRoot.add(instance.group);
    this.live.push(instance);
    if (!animate) instance.finishGrowth();
  }

  private regrow(animate: boolean): void {
    for (const s of this.live) s.dispose();
    this.live = [];
    for (const stroke of this.strokes) this.buildStroke(stroke, animate);
  }

  /**
   * Ask for a rebuild. Requests are coalesced and throttled in the tick (slider drags fire
   * onChange dozens of times a second). 'instant' snaps to fully grown; 'animate' replays
   * the crystal growth.
   */
  scheduleRegrow(mode: 'instant' | 'animate'): void {
    if (this.regrowPending?.mode === 'animate') return; // an animate request always wins
    this.regrowPending = { mode };
  }

  undoLast(): void {
    this.strokes.pop();
    const s = this.live.pop();
    s?.dispose();
  }

  clearAll(): void {
    for (const s of this.live) s.dispose();
    this.live = [];
    this.strokes = [];
    this.regrowPending = null;
  }

  /** Mix the global seed with a stroke's stable id so strokes stay distinct but reseed together. */
  private effectiveSeed(index: number): number {
    return ((this.settings.seed * 2654435761) ^ (index * 40503 + 1)) >>> 0;
  }

  // ---------- live (no-rebuild) setting paths ----------

  /**
   * Push a mode's current settings into its live strokes IN PLACE — matrices, colors and
   * shader uniforms update on the existing objects, nothing is recreated. Falls back to a
   * rebuild only for stroke types that can't re-derive themselves.
   */
  updateModeSettings(mode: ModeName): void {
    let needRebuild = false;
    for (let i = 0; i < this.live.length; i++) {
      if (this.strokes[i].mode !== mode) continue;
      const s = this.live[i];
      if (s.applySettings) s.applySettings(this.settingsFor(mode));
      else needRebuild = true;
    }
    if (needRebuild) this.scheduleRegrow('instant');
  }

  setGlow(v: number): void {
    this.crystal.glow = v;
    setCrystalGlow(v);
  }

  setExposure(v: number): void {
    this.settings.exposure = v;
    this.renderer.toneMappingExposure = v;
  }

  setEnvIntensity(v: number): void {
    this.settings.envIntensity = v;
    this.scene.environmentIntensity = v;
  }

  /** Backlight slider: scales the rear rig — how hard light streams through the crystals. */
  setBacklight(v: number): void {
    this.settings.backlight = v;
    for (const { light, base } of this.backLights) light.intensity = base * v;
  }

  setBloomStrength(v: number): void {
    this.settings.bloomStrength = v;
    this.bloomNode.strength.value = v;
  }

  setBloomThreshold(v: number): void {
    this.settings.bloomThreshold = v;
    this.bloomNode.threshold.value = v;
  }

  // ---------- modes / hud ----------

  toggleMode(): void {
    this.settings.drawMode = !this.settings.drawMode;
    this.applyModes();
  }

  applyModes(): void {
    const draw = this.settings.drawMode;
    this.painter.setEnabled(draw);
    this.controls.enableRotate = !draw;
    document.body.classList.toggle('draw', draw);
    document.body.classList.toggle('orbit', !draw);

    const btn = document.getElementById('modeBtn')!;
    btn.querySelector('.label')!.textContent = draw ? 'Paint mode' : 'Orbit mode';

    if (!draw) this.hovering = false;
    this.updateHud();
  }

  private updateHud(): void {
    const backend = (this.renderer.backend as { isWebGPUBackend?: boolean }).isWebGPUBackend
      ? 'WebGPU'
      : 'WebGL2 (fallback)';
    const nouns: Record<ModeName, string> = {
      'Crystals': 'crystal vein',
      'Molten fissures': 'molten fissure',
      'Aurora silk': 'silk of aurora',
      'Bioluminescent reef': 'reef colony',
    };
    const noun = nouns[this.settings.mode];
    let mode: string;
    if (this.settings.drawMode) {
      mode = this.hovering
        ? `<b>Drag now</b> to paint a ${noun} across the sphere — it grows when you let go.`
        : `Move over the sphere, then <b>drag</b> to paint a ${noun}. Press <b>D</b> to orbit.`;
    } else {
      mode = '<b>Orbit mode</b> — drag to rotate, scroll to zoom, right-drag to pan. ' +
        `Press <b>D</b> to paint.`;
    }
    this.hud.innerHTML = `${mode}<div class="sub">Mode: ${this.settings.mode} · Renderer: ${backend}</div>`;
  }

  private showToast(msg: string): void {
    const el = document.getElementById('toast')!;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => el.classList.remove('show'), 1800);
  }

  // ---------- frame loop ----------

  private onResize = (): void => {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  private tick(time: number): void {
    const elapsed = Math.min((time - this.lastTime) / 1000, 0.5);
    const dt = Math.min(elapsed, 0.05);
    this.lastTime = time;

    const damping = 1 - Math.exp(-elapsed * 3.2);
    this.pointerCurrent.lerp(this.pointerTarget, damping);
    const desiredEngaged = this.forcedEngaged ? 1 : this.engagedTarget;
    this.engaged = THREE.MathUtils.lerp(this.engaged, desiredEngaged, 1 - Math.exp(-elapsed * 2.7));

    if (!this.reducedMotion) this.autoY += elapsed * 0.026;
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
  }
}

/**
 * The out-of-focus studio behind the subject: near-black with two soft violet/blue blooms,
 * like distant practicals through a wide-open lens. Painted once onto a canvas and wrapped
 * on an inward-facing sphere.
 */
function makeBackdropTexture(): THREE.CanvasTexture {
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

/** Near-black satin floor with a soft radial sheen — a quiet stage for the sphere's shadow. */
function makeFloorTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, '#090b0e');
  g.addColorStop(0.45, '#050607');
  g.addColorStop(1, '#020304');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
