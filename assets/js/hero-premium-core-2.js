(() => {
  'use strict';

  const root = document.documentElement;
  const canvas = document.querySelector('[data-hero-core2-canvas]');
  const visual = document.querySelector('[data-hero-core2-visual]');
  const stageItems = [...document.querySelectorAll('[data-hero-core2-stage]')];
  const stageButtons = [...document.querySelectorAll('[data-hero-core2-stage-button]')];
  if (!canvas || !visual) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const coarsePointer = window.matchMedia('(pointer: coarse)');
  let motionReduced = reducedMotion.matches;
  let activeStage = motionReduced ? 3 : 0;
  let narrativeTimers = [];
  let replayTimer = null;
  let manualStageUntil = 0;

  const setActiveStage = (index, manual = false) => {
    activeStage = Math.max(0, Math.min(3, index));
    stageItems.forEach((item, i) => item.classList.toggle('is-active', i === activeStage));
    stageButtons.forEach((button, i) => button.setAttribute('aria-current', i === activeStage ? 'step' : 'false'));
    if (manual) manualStageUntil = performance.now() + 9000;
  };

  const clearNarrative = () => {
    narrativeTimers.forEach(window.clearTimeout);
    narrativeTimers = [];
    if (replayTimer) window.clearInterval(replayTimer);
    replayTimer = null;
  };

  const runNarrative = () => {
    if (motionReduced) {
      setActiveStage(3);
      return;
    }
    narrativeTimers.forEach(window.clearTimeout);
    narrativeTimers = [];
    const beats = [[900, 0], [3200, 1], [5600, 2], [8100, 3]];
    beats.forEach(([delay, stage]) => {
      narrativeTimers.push(window.setTimeout(() => {
        if (performance.now() < manualStageUntil) return;
        setActiveStage(stage);
      }, delay));
    });
  };

  const scheduleNarrative = () => {
    clearNarrative();
    runNarrative();
    if (!motionReduced) {
      replayTimer = window.setInterval(() => {
        if (document.hidden || performance.now() < manualStageUntil) return;
        runNarrative();
      }, 24000);
    }
  };

  stageButtons.forEach((button, i) => {
    button.addEventListener('mouseenter', () => setActiveStage(i, true));
    button.addEventListener('focus', () => setActiveStage(i, true));
    button.addEventListener('click', () => setActiveStage(i, true));
  });

  setActiveStage(activeStage);
  scheduleNarrative();

  reducedMotion.addEventListener?.('change', (event) => {
    motionReduced = event.matches;
    scheduleNarrative();
  });

  const gl = canvas.getContext('webgl2', {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: false,
    preserveDrawingBuffer: false,
    powerPreference: 'high-performance'
  });

  if (!gl) {
    root.classList.add('hero-core2--fallback');
    return;
  }

  const vertexSource = `#version 300 es
    precision highp float;
    const vec2 POS[3] = vec2[3](
      vec2(-1.0, -1.0),
      vec2( 3.0, -1.0),
      vec2(-1.0,  3.0)
    );
    void main() {
      gl_Position = vec4(POS[gl_VertexID], 0.0, 1.0);
    }
  `;

  const fragmentSource = `#version 300 es
    precision highp float;

    uniform vec2 uResolution;
    uniform vec2 uPointer;
    uniform float uTime;
    uniform float uStage;
    uniform float uMotion;
    uniform float uQuality;

    out vec4 outColor;

    mat2 rot(float a) {
      float c = cos(a), s = sin(a);
      return mat2(c, -s, s, c);
    }

    float hash21(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }

    float sdRoundBox(vec3 p, vec3 b, float r) {
      vec3 q = abs(p) - b + r;
      return min(max(q.x, max(q.y, q.z)), 0.0) + length(max(q, 0.0)) - r;
    }

    float sdEllipsoid(vec3 p, vec3 r) {
      float k0 = length(p / r);
      float k1 = length(p / (r * r));
      return k0 * (k0 - 1.0) / max(k1, 0.0001);
    }

    float sdPlane(vec3 p, vec3 n, float h) {
      return dot(p, n) + h;
    }

    float stageYaw() {
      if (uStage < 0.5) return -0.12;
      if (uStage < 1.5) return -0.035;
      if (uStage < 2.5) return 0.075;
      return 0.14;
    }

    float stagePitch() {
      if (uStage < 0.5) return 0.06;
      if (uStage < 1.5) return 0.11;
      if (uStage < 2.5) return 0.045;
      return -0.025;
    }

    vec3 objectSpace(vec3 p) {
      p.y -= 0.015;
      float driftY = uMotion * (0.055 * sin(uTime * 0.22) + 0.026 * sin(uTime * 0.071 + 1.7));
      float driftX = uMotion * (0.028 * sin(uTime * 0.17 + 0.8));
      float yaw = -0.22 + stageYaw() + driftY + uPointer.x * 0.055 * uMotion;
      float pitch = 0.08 + stagePitch() + driftX - uPointer.y * 0.035 * uMotion;
      p.xz = rot(-yaw) * p.xz;
      p.yz = rot(-pitch) * p.yz;
      return p;
    }

    float innerDistanceFromObject(vec3 q) {
      vec3 iq = q - vec3(0.11, -0.015, 0.035);
      iq.xy = rot(0.10 + uMotion * 0.035 * sin(uTime * 0.31)) * iq.xy;
      float d0 = sdEllipsoid(iq, vec3(0.49, 0.56, 0.34));
      vec3 iq2 = iq - vec3(0.07, 0.04, -0.02);
      iq2.xz = rot(-0.42 - uMotion * uTime * 0.018) * iq2.xz;
      float d1 = sdRoundBox(iq2, vec3(0.30, 0.40, 0.24), 0.19);
      return min(d0, d1 + 0.035);
    }

    vec2 mapScene(vec3 p) {
      vec3 q = objectSpace(p);
      vec2 res = vec2(1000.0, 0.0);

      vec3 a = q - vec3(-0.53, 0.02, 0.01);
      a.xy = rot(-0.075) * a.xy;
      float dA = sdRoundBox(a, vec3(0.285, 0.91, 0.47), 0.155);
      if (dA < res.x) res = vec2(dA, 1.0);

      vec3 b = q - vec3(0.11, 0.73, 0.055);
      b.xy = rot(-0.17) * b.xy;
      b.xz = rot(0.05) * b.xz;
      float dB = sdRoundBox(b, vec3(0.78, 0.255, 0.43), 0.135);
      if (dB < res.x) res = vec2(dB, 2.0);

      vec3 c = q - vec3(0.20, -0.72, -0.015);
      c.xy = rot(0.115) * c.xy;
      c.xz = rot(-0.08) * c.xz;
      float dC = sdRoundBox(c, vec3(0.69, 0.255, 0.455), 0.14);
      if (dC < res.x) res = vec2(dC, 1.0);

      vec3 d = q - vec3(0.71, 0.10, -0.19);
      d.yz = rot(0.19) * d.yz;
      d.xz = rot(0.23) * d.xz;
      float dD = sdRoundBox(d, vec3(0.245, 0.62, 0.30), 0.13);
      if (dD < res.x) res = vec2(dD, 2.0);

      vec3 rear = q - vec3(0.04, -0.02, -0.45);
      rear.xy = rot(-0.045) * rear.xy;
      float dRear = sdRoundBox(rear, vec3(0.68, 0.68, 0.095), 0.07);
      if (dRear < res.x) res = vec2(dRear, 1.0);

      vec3 glass = q - vec3(0.18, 0.015, 0.385);
      glass.xy = rot(0.055) * glass.xy;
      float dGlass = sdRoundBox(glass, vec3(0.47, 0.50, 0.055), 0.065);
      if (dGlass < res.x) res = vec2(dGlass, 3.0);

      float dInner = innerDistanceFromObject(q);
      if (dInner < res.x) res = vec2(dInner, 4.0);

      float floorD = sdPlane(p, vec3(0.0, 1.0, 0.0), 1.28);
      if (floorD < res.x) res = vec2(floorD, 6.0);

      return res;
    }

    vec3 calcNormal(vec3 p) {
      vec2 e = vec2(0.0016, 0.0);
      float d = mapScene(p).x;
      return normalize(vec3(
        mapScene(p + e.xyy).x - d,
        mapScene(p + e.yxy).x - d,
        mapScene(p + e.yyx).x - d
      ));
    }

    float softShadow(vec3 ro, vec3 rd, float mint, float maxt) {
      float res = 1.0;
      float t = mint;
      for (int i = 0; i < 26; i++) {
        float h = mapScene(ro + rd * t).x;
        res = min(res, 14.0 * h / t);
        t += clamp(h, 0.02, 0.18);
        if (h < 0.001 || t > maxt) break;
      }
      return clamp(res, 0.0, 1.0);
    }

    float ambientOcclusion(vec3 p, vec3 n) {
      float occ = 0.0;
      float sca = 1.0;
      for (int i = 0; i < 4; i++) {
        float h = 0.035 + 0.085 * float(i);
        float d = mapScene(p + n * h).x;
        occ += (h - d) * sca;
        sca *= 0.68;
      }
      return clamp(1.0 - 1.35 * occ, 0.0, 1.0);
    }

    vec3 materialColor(float id, vec3 p, vec3 n, vec3 rd, float glow) {
      vec3 graphite = vec3(0.085, 0.103, 0.112);
      vec3 steel = vec3(0.18, 0.205, 0.214);
      vec3 cyan = vec3(0.31, 0.83, 0.98);
      vec3 warm = vec3(0.86, 0.72, 0.52);

      vec3 keyPos = vec3(-2.5, 3.2, 4.4);
      vec3 rimPos = vec3(3.6, 1.6, 2.3);
      vec3 l = normalize(keyPos - p);
      vec3 l2 = normalize(rimPos - p);
      vec3 v = normalize(-rd);
      float ndl = max(dot(n, l), 0.0);
      float ndl2 = max(dot(n, l2), 0.0);
      float shadow = softShadow(p + n * 0.008, l, 0.025, 6.0);
      float ao = ambientOcclusion(p, n);
      float fres = pow(1.0 - max(dot(n, v), 0.0), 4.0);

      if (id < 1.5) {
        float rough = 0.44 + 0.08 * sin(p.x * 8.0 + p.y * 4.0);
        vec3 h = normalize(l + v);
        float spec = pow(max(dot(n, h), 0.0), mix(52.0, 95.0, 1.0 - rough));
        vec3 base = graphite * (0.42 + 0.82 * ndl * shadow) * ao;
        base += vec3(0.36, 0.40, 0.42) * spec * 0.48;
        base += cyan * fres * 0.11;
        base += warm * ndl2 * fres * 0.045;
        return base;
      }

      if (id < 2.5) {
        vec3 h = normalize(l + v);
        float spec = pow(max(dot(n, h), 0.0), 88.0);
        vec3 base = steel * (0.46 + 0.92 * ndl * shadow) * ao;
        base += vec3(0.72,0.78,0.80) * spec * 0.72;
        base += cyan * fres * 0.13;
        base += warm * ndl2 * fres * 0.075;
        return base;
      }

      if (id < 3.5) {
        float facing = abs(dot(n, v));
        vec3 smoke = vec3(0.035, 0.060, 0.067);
        vec3 base = smoke * (0.42 + ndl * 0.32);
        base += cyan * (0.08 + fres * 0.35 + glow * 0.22);
        base += vec3(0.66,0.77,0.79) * pow(1.0 - facing, 2.8) * 0.10;
        return base;
      }

      if (id < 4.5) {
        float pulse = 0.78 + 0.12 * uMotion * sin(uTime * 1.25 + p.y * 5.0) + uStage * 0.035;
        vec3 inner = mix(vec3(0.035,0.17,0.21), cyan, 0.54 + 0.14 * fres);
        inner *= pulse * (0.72 + ndl * 0.18);
        inner += cyan * (0.24 + fres * 0.30);
        return inner;
      }

      vec3 floorBase = vec3(0.012, 0.015, 0.016);
      float radial = exp(-0.55 * dot(p.xz, p.xz));
      return floorBase + cyan * radial * 0.008;
    }

    vec2 curveDistance(vec2 p, vec2 a, vec2 b, vec2 c, vec2 d) {
      float md = 10.0;
      float mt = 0.0;
      vec2 prev = a;
      for (int i = 1; i <= 34; i++) {
        float t = float(i) / 34.0;
        float s = 1.0 - t;
        vec2 cur = s*s*s*a + 3.0*s*s*t*b + 3.0*s*t*t*c + t*t*t*d;
        vec2 pa = p - prev;
        vec2 ba = cur - prev;
        float h = clamp(dot(pa,ba) / max(dot(ba,ba), 0.00001), 0.0, 1.0);
        float dd = length(pa - ba * h);
        if (dd < md) {
          md = dd;
          mt = (float(i - 1) + h) / 34.0;
        }
        prev = cur;
      }
      return vec2(md, mt);
    }

    vec3 signalField(vec2 uv, bool objectHit, float objectDepth) {
      vec3 cyan = vec3(0.31, 0.83, 0.98);
      vec3 ice = vec3(0.58, 0.91, 1.0);
      vec3 col = vec3(0.0);

      vec2 c1 = curveDistance(uv,
        vec2(-1.05, 0.34), vec2(-0.48, 0.60), vec2(-0.39, -0.25), vec2(1.06, -0.08));
      vec2 c2 = curveDistance(uv,
        vec2(-0.91, -0.52), vec2(-0.24, -0.11), vec2(0.17, -0.63), vec2(0.96, -0.27));
      vec2 c3 = curveDistance(uv,
        vec2(-0.80, 0.69), vec2(-0.16, 0.17), vec2(0.28, 0.54), vec2(0.91, 0.42));

      float stagePhase = uStage * 0.095;
      float line1 = 1.0 - smoothstep(0.0014, 0.009, c1.x);
      float line2 = 1.0 - smoothstep(0.0012, 0.007, c2.x);
      float line3 = 1.0 - smoothstep(0.0010, 0.006, c3.x);

      float fragDash = mix(0.32, 0.74, smoothstep(0.38, 0.67, c1.y));
      float dashed = smoothstep(0.18, 0.48, fract(c1.y * 31.0 - uTime * 0.055 * uMotion));
      line1 *= mix(dashed, 1.0, fragDash);

      float pulse1 = exp(-150.0 * pow(abs(fract(c1.y - uTime * 0.060 * uMotion - stagePhase) - 0.5), 2.0));
      float pulse2 = exp(-135.0 * pow(abs(fract(c2.y - uTime * 0.047 * uMotion - 0.24 - stagePhase) - 0.5), 2.0));
      float pulse3 = exp(-165.0 * pow(abs(fract(c3.y - uTime * 0.038 * uMotion - 0.58 - stagePhase) - 0.5), 2.0));

      float behind1 = step(0.34, c1.y) * (1.0 - step(0.66, c1.y));
      float behind3 = step(0.43, c3.y) * (1.0 - step(0.72, c3.y));
      if (objectHit && objectDepth < 6.0) {
        line1 *= mix(1.0, 0.09, behind1);
        line3 *= mix(1.0, 0.12, behind3);
      }

      col += cyan * line1 * (0.16 + pulse1 * 0.74);
      col += ice * line2 * (0.075 + pulse2 * 0.33);
      col += cyan * line3 * (0.055 + pulse3 * 0.28);

      float branch = 1.0 - smoothstep(0.0012, 0.006, curveDistance(uv,
        vec2(-0.10, 0.02), vec2(0.12, 0.20), vec2(0.32, 0.08), vec2(0.54, 0.17)).x);
      col += cyan * branch * 0.07 * smoothstep(0.6, 2.6, uStage);

      return col;
    }

    vec3 aces(vec3 x) {
      float a = 2.51;
      float b = 0.03;
      float c = 2.43;
      float d = 0.59;
      float e = 0.14;
      return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
    }

    void main() {
      vec2 frag = gl_FragCoord.xy;
      vec2 p = (2.0 * frag - uResolution.xy) / uResolution.y;
      p.x += 0.015;

      vec3 ro = vec3(0.02 + uPointer.x * 0.055 * uMotion, 0.07 + uPointer.y * 0.035 * uMotion, 4.35);
      vec3 ta = vec3(0.055, -0.015, 0.0);
      vec3 ww = normalize(ta - ro);
      vec3 uu = normalize(cross(ww, vec3(0.0, 1.0, 0.0)));
      vec3 vv = cross(uu, ww);
      vec3 rd = normalize(uu * p.x + vv * p.y + ww * 2.28);

      vec3 bg = vec3(0.0065, 0.009, 0.0105);
      float halo = exp(-1.9 * dot(p - vec2(0.06, -0.02), p - vec2(0.06, -0.02)));
      bg += vec3(0.018, 0.046, 0.052) * halo * 0.52;
      float warmEnv = exp(-5.5 * dot(p - vec2(0.58, 0.22), p - vec2(0.58, 0.22)));
      bg += vec3(0.042, 0.028, 0.016) * warmEnv * 0.18;

      float grain = hash21(frag + floor(uTime * 2.0 * uMotion));
      bg += (grain - 0.5) * 0.0035;

      float t = 0.0;
      float id = 0.0;
      float glow = 0.0;
      bool hit = false;
      int maxSteps = int(mix(48.0, 76.0, uQuality));

      for (int i = 0; i < 78; i++) {
        if (i > maxSteps) break;
        vec3 pos = ro + rd * t;
        vec2 h = mapScene(pos);
        vec3 q = objectSpace(pos);
        float innerD = innerDistanceFromObject(q);
        glow += exp(-10.0 * abs(innerD)) * 0.0105 * exp(-0.08 * t);
        if (h.x < 0.0016) {
          hit = true;
          id = h.y;
          break;
        }
        t += max(h.x * 0.78, 0.009);
        if (t > 10.0) break;
      }

      vec3 color = bg;
      if (hit) {
        vec3 pos = ro + rd * t;
        vec3 n = calcNormal(pos);
        color = materialColor(id, pos, n, rd, glow);

        if (id > 5.5) {
          float coreShadow = exp(-1.65 * (pos.x * pos.x + pos.z * pos.z));
          color *= 1.0 - 0.72 * coreShadow;
          color += vec3(0.31,0.83,0.98) * exp(-3.2 * (pos.x*pos.x + pos.z*pos.z)) * 0.006;
        }

        float fog = 1.0 - exp(-0.035 * t * t);
        color = mix(color, bg, fog * 0.42);
      }

      color += vec3(0.20, 0.76, 0.93) * min(glow, 0.52) * (0.34 + 0.08 * uStage);
      vec2 signalUv = p * vec2(0.92, 0.92);
      color += signalField(signalUv, hit && id < 5.5, t);

      float vignette = 1.0 - smoothstep(0.32, 1.62, length(p * vec2(0.76, 0.92)));
      color *= mix(0.62, 1.0, vignette);
      color = aces(color * 1.22);
      color = pow(color, vec3(0.94));

      float alpha = smoothstep(0.0, 0.16, max(max(color.r, color.g), color.b));
      outColor = vec4(color, max(alpha, 0.82));
    }
  `;

  const compile = (type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const message = gl.getShaderInfoLog(shader) || 'Unknown shader compile failure';
      gl.deleteShader(shader);
      throw new Error(message);
    }
    return shader;
  };

  let program;
  try {
    const vertex = compile(gl.VERTEX_SHADER, vertexSource);
    const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
    program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) || 'Hero Core 2.0 program link failed');
    }
  } catch (error) {
    console.error('[Hero Core 2.0]', error);
    root.classList.add('hero-core2--fallback');
    return;
  }

  gl.useProgram(program);
  const uniforms = {
    resolution: gl.getUniformLocation(program, 'uResolution'),
    pointer: gl.getUniformLocation(program, 'uPointer'),
    time: gl.getUniformLocation(program, 'uTime'),
    stage: gl.getUniformLocation(program, 'uStage'),
    motion: gl.getUniformLocation(program, 'uMotion'),
    quality: gl.getUniformLocation(program, 'uQuality')
  };

  let pointer = { x: 0, y: 0 };
  let pointerTarget = { x: 0, y: 0 };
  let visible = true;
  let renderScale = 1;
  let quality = 1;
  let firstFrame = true;
  let frameSamples = [];
  let lastFrame = performance.now();

  const mobileViewport = () => window.innerWidth <= 700;

  const resize = () => {
    const rect = visual.getBoundingClientRect();
    const cssWidth = Math.max(1, Math.round(rect.width));
    const cssHeight = Math.max(1, Math.round(rect.height));
    const dprCap = mobileViewport() ? 1.15 : 1.55;
    const dpr = Math.min(window.devicePixelRatio || 1, dprCap) * renderScale;
    const width = Math.max(2, Math.round(cssWidth * dpr));
    const height = Math.max(2, Math.round(cssHeight * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }
  };

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(visual);
  window.addEventListener('resize', resize, { passive: true });
  resize();

  const updatePointer = (event) => {
    if (motionReduced || coarsePointer.matches) return;
    const rect = visual.getBoundingClientRect();
    const x = (event.clientX - rect.left) / Math.max(rect.width, 1);
    const y = (event.clientY - rect.top) / Math.max(rect.height, 1);
    pointerTarget.x = (Math.max(0, Math.min(1, x)) - 0.5) * 2;
    pointerTarget.y = (0.5 - Math.max(0, Math.min(1, y))) * 2;
  };
  visual.addEventListener('pointermove', updatePointer, { passive: true });
  visual.addEventListener('pointerleave', () => { pointerTarget.x = 0; pointerTarget.y = 0; });

  const visibilityObserver = new IntersectionObserver((entries) => {
    visible = entries.some((entry) => entry.isIntersecting);
  }, { threshold: 0.02 });
  visibilityObserver.observe(visual);

  const adaptPerformance = (delta) => {
    if (firstFrame || motionReduced) return;
    frameSamples.push(delta);
    if (frameSamples.length < 75) return;
    const avg = frameSamples.reduce((sum, value) => sum + value, 0) / frameSamples.length;
    frameSamples = [];
    if (avg > 25 && renderScale > 0.74) {
      renderScale = Math.max(0.74, renderScale * 0.86);
      quality = Math.max(0.62, quality - 0.16);
      resize();
    }
  };

  const start = performance.now();
  const render = (now) => {
    requestAnimationFrame(render);
    if (!visible || document.hidden) return;

    const delta = now - lastFrame;
    lastFrame = now;
    adaptPerformance(delta);

    pointer.x += (pointerTarget.x - pointer.x) * 0.035;
    pointer.y += (pointerTarget.y - pointer.y) * 0.035;

    const elapsed = motionReduced ? 6.4 : (now - start) * 0.001;
    gl.useProgram(program);
    gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
    gl.uniform2f(uniforms.pointer, pointer.x, pointer.y);
    gl.uniform1f(uniforms.time, elapsed);
    gl.uniform1f(uniforms.stage, activeStage);
    gl.uniform1f(uniforms.motion, motionReduced ? 0 : 1);
    gl.uniform1f(uniforms.quality, mobileViewport() ? Math.min(quality, 0.78) : quality);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    if (firstFrame) {
      firstFrame = false;
      root.classList.add('hero-core2--ready');
    }
  };

  requestAnimationFrame(render);
})();
