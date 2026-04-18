import * as THREE from 'three'

// ─── CRT GLSL ─────────────────────────────────────────────────────────────────

const vertexShader = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

const fragmentShader = /* glsl */`
  uniform sampler2D tDiffuse;
  uniform float time;
  varying vec2 vUv;

  // Barrel distortion — curves edges inward like CRT glass
  vec2 barrel(vec2 uv, float k) {
    vec2 c = uv - 0.5;
    float r2 = dot(c, c);
    return uv + c * r2 * k;
  }

  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    // 1 — Barrel distortion
    vec2 uv = barrel(vUv, 0.10);

    // Hard black border outside the curved screen
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
      return;
    }

    // 2 — Chromatic aberration — RGB split stronger at edges
    vec2 centered = uv - 0.5;
    float edgeDist = length(centered);
    float aberration = 0.0018 + edgeDist * edgeDist * 0.012;

    float r = texture2D(tDiffuse, uv + centered * aberration).r;
    float g = texture2D(tDiffuse, uv).g;
    float b = texture2D(tDiffuse, uv - centered * aberration).b;
    vec3 color = vec3(r, g, b);

    // 3 — Vignette — darkens corners naturally
    float vig = 1.0 - dot(centered * 1.5, centered * 1.5);
    vig = pow(clamp(vig, 0.0, 1.0), 0.55);
    color *= vig;

    // 4 — Film grain / phosphor noise
    float grain = noise(uv + fract(time * 0.07)) * 0.028;
    color += grain;

    // 5 — Scanline shimmer
    float scan = sin(uv.y * 800.0) * 0.012;
    color -= scan;

    gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
  }
`

// ─── Self-contained post-processing (no addons, no duplicate Three.js) ────────

export function createCRTComposer(renderer, scene, camera) {
  const w = window.innerWidth
  const h = window.innerHeight

  // Render target — scene renders into this texture
  const renderTarget = new THREE.WebGLRenderTarget(w, h, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
  })

  // Full-screen quad
  const postGeo = new THREE.PlaneGeometry(2, 2)
  const postMat = new THREE.ShaderMaterial({
    uniforms: {
      tDiffuse: { value: renderTarget.texture },
      time:     { value: 0.0 },
    },
    vertexShader,
    fragmentShader,
    depthTest: false,
    depthWrite: false,
  })

  const postScene  = new THREE.Scene()
  const postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
  postScene.add(new THREE.Mesh(postGeo, postMat))

  function render(time) {
    postMat.uniforms.time.value = time

    // Pass 1 — render main scene into texture
    renderer.setRenderTarget(renderTarget)
    renderer.render(scene, camera)

    // Pass 2 — render CRT quad to screen
    renderer.setRenderTarget(null)
    renderer.render(postScene, postCamera)
  }

  function setSize(w, h) {
    renderTarget.setSize(w, h)
  }

  return { render, setSize }
}
