import * as THREE from 'three';

export function createVisuals(scene, stonePosition) {
  const uniforms = {
    time: { value: 0 }, seed: { value: new THREE.Vector2() },
    stone: { value: new THREE.Vector2(stonePosition.x, stonePosition.z) },
    bloom: { value: 0 }, awakening: { value: 0 }, intensity: { value: 1 },
  };
  const field = new THREE.Mesh(new THREE.PlaneGeometry(55, 55), new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `varying vec2 fieldPosition;
      void main() { fieldPosition = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,
    fragmentShader: `
      varying vec2 fieldPosition;
      uniform float time, bloom, awakening, intensity;
      uniform vec2 seed, stone;
      float contour(float v, float width) {
        float edge = max(fwidth(v), .025);
        return 1. - smoothstep(width, width + edge, abs(sin(v)));
      }
      void main() {
        vec2 p = vec2(fieldPosition.x, -fieldPosition.y);
        float ds = length(p - seed), dt = length(p - stone);
        float influence = exp(-ds * .3);
        vec2 q = p * .58;
        for (int i = 0; i < 3; i++) {
          q += .48 * sin(q.yx * 1.5 + vec2(1.2, 2.7) + time * .13);
        }
        float angle = atan(p.y - stone.y, p.x - stone.x);
        float petals = cos(angle * 8. + dt * .28) * (.4 + awakening * .7);
        float weave = length(q) * 3. + sin(q.x * 2. - q.y) * 1.4;
        weave += sin(ds * 2.8 - time * .65) * influence * (1. + bloom);
        weave = mix(weave, dt * 3. + petals + sin(weave) * .5, awakening * .65);
        float line = contour(weave, .07);
        float fine = contour(weave * 2. + .6, .025) * .24;
        float region = sin(q.x * .7 + q.y * .5 + awakening * 2.);
        vec3 cyan = vec3(.08, .78, .69), violet = vec3(.52, .18, .9), coral = vec3(1., .22, .34);
        vec3 ink = mix(violet, cyan, smoothstep(-.8, .8, region));
        ink = mix(ink, coral, smoothstep(.15, .95, sin(dt * .55 - awakening * 2.)) * .65);
        float fade = 1. - smoothstep(7., 24., length(p));
        float focus = .48 + influence * .3 + exp(-dt * .16) * awakening * .3;
        vec3 night = vec3(.005, .0065, .011);
        vec3 color = night + ink * ((line + fine) * focus * 1.3 + .018) * fade * intensity;
        gl_FragColor = vec4(color, 1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  }));
  field.rotation.x = -Math.PI / 2;
  scene.add(field);

  const shrine = new THREE.Group();
  shrine.position.set(stonePosition.x, 1.3, stonePosition.z);
  const rings = [];
  for (let i = 0; i < 3; i++) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.25 + i * .32, .012, 5, 100),
      new THREE.MeshBasicMaterial({ color: ['#ff6d79', '#b48aff', '#6ed9d0'][i], transparent: true, opacity: .45 }));
    ring.rotation.set(.3 + i * .8, i * .7, i * .2);
    shrine.add(ring); rings.push(ring);
  }
  scene.add(shrine);
  const aura = new THREE.Mesh(new THREE.TorusGeometry(.7, .018, 6, 64), new THREE.MeshBasicMaterial({ color: '#b8ffe9' }));
  aura.rotation.x = -Math.PI / 2;
  scene.add(aura);

  return {
    update(delta, position, bloomed, awakened, reduced) {
      if (!reduced) uniforms.time.value += delta;
      uniforms.seed.value.set(position.x, position.z);
      const ease = reduced ? 1 : 1 - Math.exp(-delta * 1.4);
      uniforms.bloom.value += (Number(bloomed) - uniforms.bloom.value) * ease;
      uniforms.awakening.value += (Number(awakened) - uniforms.awakening.value) * ease;
      uniforms.intensity.value = reduced ? .32 : 1;
      aura.position.set(position.x, .035, position.z);
      aura.scale.setScalar(bloomed ? 1.6 : 1);
      rings.forEach((ring, i) => {
        ring.material.opacity = reduced ? .22 : .4 + uniforms.awakening.value * .4;
        ring.scale.setScalar(1 + uniforms.awakening.value * .35);
        if (!reduced) ring.rotation.z += delta * .07 * (i % 2 ? -1 : 1);
      });
    },
    reset() {
      uniforms.time.value = 0; uniforms.bloom.value = 0; uniforms.awakening.value = 0;
      rings.forEach((ring, i) => ring.rotation.set(.3 + i * .8, i * .7, i * .2));
    },
  };
}
