(() => {
  'use strict';

  const canvas = document.querySelector('[data-hero-layered-r1-canvas]');
  if (!canvas) return;

  const gl = canvas.getContext('webgl2', {
    alpha: true,
    antialias: true,
    premultipliedAlpha: false,
    preserveDrawingBuffer: true
  });
  if (!gl) {
    document.documentElement.classList.add('hero-layered-r1--no-webgl');
    return;
  }

  const WIDTH = 1440;
  const HEIGHT = 900;
  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  const layers = [
    'rear_atmosphere.png',
    'contact_shadow_floor_response.png',
    'rear_body_graphite.png',
    'internal_chamber_depth.png',
    'internal_cyan_volume.png',
    'collector_emitter_zone.png',
    'external_output_impulses.png',
    'front_metal_shell.png',
    'rail_ui.png'
  ];

  const assetRoot = '/assets/hero-layered-25d-r1/';

  const vertexSource = `#version 300 es
    precision highp float;
    const vec2 POSITIONS[6] = vec2[6](
      vec2(-1.0, -1.0), vec2( 1.0, -1.0), vec2(-1.0,  1.0),
      vec2(-1.0,  1.0), vec2( 1.0, -1.0), vec2( 1.0,  1.0)
    );
    out vec2 vUv;
    void main() {
      vec2 p = POSITIONS[gl_VertexID];
      vUv = vec2((p.x + 1.0) * 0.5, 1.0 - ((p.y + 1.0) * 0.5));
      gl_Position = vec4(p, 0.0, 1.0);
    }
  `;

  const fragmentSource = `#version 300 es
    precision highp float;
    uniform sampler2D uTexture;
    in vec2 vUv;
    out vec4 outColor;
    void main() {
      outColor = texture(uTexture, vUv);
    }
  `;

  const compile = (type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(shader) || 'Hero R1 shader compilation failed');
    }
    return shader;
  };

  const program = gl.createProgram();
  gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexSource));
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentSource));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) || 'Hero R1 shader link failed');
  }

  gl.useProgram(program);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.disable(gl.DEPTH_TEST);
  gl.viewport(0, 0, WIDTH, HEIGHT);

  const textureLocation = gl.getUniformLocation(program, 'uTexture');
  gl.uniform1i(textureLocation, 0);

  const loadTexture = (name) => new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => {
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      resolve(texture);
    };
    image.onerror = () => reject(new Error(`Unable to load Hero R1 layer: ${name}`));
    image.src = assetRoot + name;
  });

  Promise.all(layers.map(loadTexture)).then((textures) => {
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    textures.forEach((texture) => {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    });
    document.documentElement.classList.add('hero-layered-r1--ready');
  }).catch((error) => {
    console.error(error);
    document.documentElement.classList.add('hero-layered-r1--failed');
  });
})();
