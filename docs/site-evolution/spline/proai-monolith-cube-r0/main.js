import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const canvas = document.querySelector('#scene');
const shell = document.querySelector('#scene-shell');

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.86;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x080a0d, 0.032);

const camera = new THREE.PerspectiveCamera(31.5, 1, 0.1, 100);
camera.position.set(7.35, 5.35, 9.15);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.065;
controls.enablePan = false;
controls.minDistance = 10.1;
controls.maxDistance = 14.2;
controls.rotateSpeed = 0.32;
controls.zoomSpeed = 0.42;
controls.minPolarAngle = Math.PI * 0.23;
controls.maxPolarAngle = Math.PI * 0.70;
controls.target.set(0, 0.02, 0);

const pmrem = new THREE.PMREMGenerator(renderer);
const room = new RoomEnvironment();
scene.environment = pmrem.fromScene(room, 0.045).texture;
room.dispose();
pmrem.dispose();

const monolith = new THREE.Group();
monolith.rotation.set(-0.12, 0.16, 0.035);
monolith.position.y = 0.14;
scene.add(monolith);

const coreMaterial = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color(0.105, 0.116, 0.132),
  metalness: 0.88,
  roughness: 0.20,
  clearcoat: 0.58,
  clearcoatRoughness: 0.20,
  reflectivity: 0.78,
  ior: 1.48,
  envMapIntensity: 1.02,
});

const geometry = new RoundedBoxGeometry(4.55, 4.55, 4.55, 10, 0.18);
const cube = new THREE.Mesh(geometry, coreMaterial);
cube.castShadow = true;
cube.receiveShadow = true;
monolith.add(cube);

// A nearly flush smoked coating marks one future-ready active face without breaking the monolith silhouette.
const displayGeometry = new RoundedBoxGeometry(3.70, 3.70, 0.024, 8, 0.12);
const displayMaterial = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color(0.028, 0.036, 0.050),
  metalness: 0.52, roughness: 0.135, clearcoat: 0.78, clearcoatRoughness: 0.12,
  transparent: true, opacity: 0.48, envMapIntensity: 1.12,
});
const displaySkin = new THREE.Mesh(displayGeometry, displayMaterial);
displaySkin.position.z = 2.282;
monolith.add(displaySkin);

const key = new THREE.RectAreaLight(0xe9eef6, 16.5, 6.2, 7.6);
key.position.set(-4.9, 6.7, 5.2);
key.lookAt(0, 0, 0);
scene.add(key);

const silverRim = new THREE.RectAreaLight(0xbfc9d9, 8.2, 3.4, 6.4);
silverRim.position.set(6.0, 1.7, -1.8);
silverRim.lookAt(0, 0.15, 0);
scene.add(silverRim);

const warmRim = new THREE.RectAreaLight(0xd6b89b, 2.1, 3.4, 4.8);
warmRim.position.set(-3.8, -2.0, -4.3);
warmRim.lookAt(0, 0, 0);
scene.add(warmRim);

const topFill = new THREE.DirectionalLight(0xdde3ea, 1.0);
topFill.position.set(0.8, 7.5, 1.5);
scene.add(topFill);

// Soft grounding only — no pedestal and no visible floor edge.
const shadowTexture = new THREE.CanvasTexture(makeShadowTexture());
shadowTexture.colorSpace = THREE.SRGBColorSpace;
const shadowMat = new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false, opacity: 0.57 });
const shadow = new THREE.Mesh(new THREE.PlaneGeometry(7.6, 4.8), shadowMat);
shadow.rotation.x = -Math.PI / 2;
shadow.position.set(0.1, -2.52, 0.25);
scene.add(shadow);

// Extremely restrained spatial planes: no Resend-style white stripe.
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x7f8a9b, transparent: true, opacity: 0.018, depthWrite: false, side: THREE.DoubleSide });
const planeA = new THREE.Mesh(new THREE.PlaneGeometry(10.0, 4.0), planeMaterial);
planeA.position.set(-2.7, 1.4, -5.2);
planeA.rotation.set(-0.12, 0.62, -0.05);
scene.add(planeA);
const planeB = new THREE.Mesh(new THREE.PlaneGeometry(5.6, 9.0), planeMaterial.clone());
planeB.material.opacity = 0.012;
planeB.position.set(5.8, 0.2, -2.8);
planeB.rotation.set(0.12, -0.94, 0.0);
scene.add(planeB);

const clock = new THREE.Clock();
let userActiveUntil = 0;
const baseRotation = new THREE.Euler(-0.12, 0.16, 0.035, 'XYZ');

controls.addEventListener('start', () => { userActiveUntil = performance.now() + 9000; });
controls.addEventListener('change', () => { userActiveUntil = Math.max(userActiveUntil, performance.now() + 1800); });

function easeFollow(current, target, dt, responsiveness) {
  return THREE.MathUtils.lerp(current, target, 1 - Math.exp(-responsiveness * dt));
}

function animate() {
  const dt = Math.min(clock.getDelta(), 0.05);
  const t = clock.elapsedTime;
  const interactionWeight = THREE.MathUtils.smoothstep(userActiveUntil - performance.now(), 0, 1800);
  const autoWeight = 1 - interactionWeight;

  const targetX = baseRotation.x + autoWeight * (Math.sin(t * 0.105 + 0.7) * 0.082 + Math.sin(t * 0.036) * 0.024);
  const targetY = baseRotation.y + autoWeight * (Math.sin(t * 0.082) * 0.145 + Math.sin(t * 0.031 + 1.1) * 0.045);
  const targetZ = baseRotation.z + autoWeight * Math.sin(t * 0.073 + 2.2) * 0.048;

  monolith.rotation.x = easeFollow(monolith.rotation.x, targetX, dt, 1.35);
  monolith.rotation.y = easeFollow(monolith.rotation.y, targetY, dt, 1.25);
  monolith.rotation.z = easeFollow(monolith.rotation.z, targetZ, dt, 1.18);
  monolith.position.y = easeFollow(monolith.position.y, 0.14 + Math.sin(t * 0.095) * 0.055, dt, 1.6);

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

function makeShadowTexture() {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 320;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(256, 160, 8, 256, 160, 218);
  g.addColorStop(0, 'rgba(0,0,0,.56)');
  g.addColorStop(.42, 'rgba(0,0,0,.25)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, c.width, c.height);
  return c;
}

function resize() {
  const r = shell.getBoundingClientRect();
  renderer.setSize(Math.max(1, Math.round(r.width)), Math.max(1, Math.round(r.height)), false);
  camera.aspect = r.width / r.height;
  camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(shell);
resize();

window.__PROAI_MONOLITH_R0 = {
  scene,
  camera,
  renderer,
  controls,
  monolith,
  cube,
  displaySkin,
  surfaceState: { mode: 'smoked-idle', readyForFutureDisplay: true },
  setReviewAngle(name = 'hero') {
    if (name === 'motion') {
      monolith.rotation.set(-0.24, -0.08, 0.070);
      camera.position.set(7.25, 5.1, 9.30);
    } else {
      monolith.rotation.copy(baseRotation);
      camera.position.set(7.35, 5.35, 9.15);
    }
    camera.lookAt(controls.target);
    controls.update();
    renderer.render(scene, camera);
  },
};

animate();
