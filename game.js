import * as THREE from 'three';
import { moveToward, touchesStone, START, STONE } from './rules.js';
import { createVisuals } from './visuals.js';

const container = document.querySelector('#scene'), hint = document.querySelector('#hint'), status = document.querySelector('#status');
const scene = new THREE.Scene();
scene.background = new THREE.Color('#10131b');
scene.fog = new THREE.Fog('#10131b', 17, 38);
const camera = new THREE.PerspectiveCamera(42, 1, .1, 100);
camera.position.set(0, 9, 14); camera.lookAt(0, 0, 0);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); container.appendChild(renderer.domElement);
scene.add(new THREE.HemisphereLight('#d7eddf', '#17203b', 2));
const light = new THREE.DirectionalLight('#fff0dd', 2); light.position.set(2, 8, 5); scene.add(light);
const material = (color, options = {}) => new THREE.MeshStandardMaterial({ color, roughness: .8, ...options });
const visuals = createVisuals(scene, STONE);
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
let reduced = motionPreference.matches;
const intensityButton = document.querySelector('#intensity');
function updateIntensity() {
  intensityButton.textContent = reduced ? 'Effects: gentle' : 'Effects: full';
  intensityButton.setAttribute('aria-pressed', String(reduced));
}
intensityButton.addEventListener('click', () => { reduced = !reduced; updateIntensity(); });
motionPreference.addEventListener('change', event => { reduced = event.matches; updateIntensity(); });
updateIntensity();
const stone = new THREE.Mesh(new THREE.DodecahedronGeometry(.8), material('#737c81')); stone.scale.set(.7, 1.7, .65); stone.position.set(STONE.x, 1, STONE.z); scene.add(stone);
const mark = new THREE.Mesh(new THREE.TorusGeometry(.22, .025, 8, 32), material('#ff6d79', { emissive: '#843341' })); mark.position.set(STONE.x, 1.05, STONE.z + .51); scene.add(mark);
const player = new THREE.Group();
const seed = new THREE.Mesh(new THREE.SphereGeometry(.43, 24, 16), material('#6ed9d0', { emissive: '#16413e' })); seed.scale.set(.8, 1.25, .8); player.add(seed);
const petals = new THREE.Group();
for (let i = 0; i < 4; i++) { const petal = new THREE.Mesh(new THREE.SphereGeometry(.25, 16, 12), material('#b8e5d9')); const angle = i * Math.PI / 2; petal.position.set(Math.cos(angle) * .42, .1, Math.sin(angle) * .42); petal.scale.set(1.5, .35, .7); petal.rotation.y = -angle; petals.add(petal); }
petals.visible = false; player.add(petals); scene.add(player);
let position = { ...START }, target = null, bloomed = false, awakened = false;
const keys = new Set(), clock = new THREE.Clock(), ray = new THREE.Raycaster(), pointer = new THREE.Vector2(), plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), hit = new THREE.Vector3();
function reset() { position = { ...START }; target = null; bloomed = false; awakened = false; keys.clear(); visuals.reset(); petals.visible = false; seed.material.color.set('#6ed9d0'); seed.material.emissive.set('#16413e'); mark.material.emissive.set('#843341'); hint.textContent = 'Find the standing stone'; status.textContent = 'Arrow keys / WASD to move · click or tap the field'; }
function bloom() { bloomed = !bloomed; petals.visible = bloomed; status.textContent = bloomed ? 'The seed has bloomed.' : 'The petals fold back in.'; }
document.querySelector('#restart').addEventListener('click', reset);
document.querySelector('#bloom').addEventListener('click', bloom);
window.addEventListener('keydown', event => { if (event.target instanceof HTMLButtonElement || event.target instanceof HTMLAnchorElement) return; if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','KeyW','KeyA','KeyS','KeyD'].includes(event.code)) { event.preventDefault(); keys.add(event.code); target = null; } if (event.code === 'Space' && !event.repeat) { event.preventDefault(); bloom(); } });
window.addEventListener('keyup', event => keys.delete(event.code));
window.addEventListener('blur', () => keys.clear());
container.addEventListener('pointerdown', event => { const rect = renderer.domElement.getBoundingClientRect(); pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1); ray.setFromCamera(pointer, camera); if (ray.ray.intersectPlane(plane, hit)) target = { x: Math.max(-7, Math.min(7, hit.x)), z: Math.max(-7, Math.min(7, hit.z)) }; });
function resize() { const w = container.clientWidth, h = container.clientHeight; camera.aspect = w / h; camera.fov = camera.aspect < 1 ? 65 : 42; camera.updateProjectionMatrix(); renderer.setSize(w, h); }
window.addEventListener('resize', resize); resize();
document.addEventListener('visibilitychange', () => { keys.clear(); clock.getDelta(); });
function frame() {
  requestAnimationFrame(frame);
  const delta = Math.min(clock.getDelta(), .05);
  if (document.hidden) return;
  const dx = Number(keys.has('ArrowRight') || keys.has('KeyD')) - Number(keys.has('ArrowLeft') || keys.has('KeyA'));
  const dz = Number(keys.has('ArrowDown') || keys.has('KeyS')) - Number(keys.has('ArrowUp') || keys.has('KeyW'));
  if (dx || dz) position = moveToward(position, { x: position.x + dx, z: position.z + dz }, delta * 3);
  else if (target) position = moveToward(position, target, delta * 3);
  if (!awakened && touchesStone(position)) {
    awakened = true; seed.material.color.set('#f1e9da'); seed.material.emissive.set('#a15a3a'); mark.material.emissive.set('#6ed9d0');
    hint.textContent = 'You became a light'; status.textContent = 'The stone is awake. Keep exploring, or start again.';
  }
  player.position.set(position.x, .55, position.z);
  visuals.update(delta, position, bloomed, awakened, reduced);
  renderer.render(scene, camera);
}
frame();
