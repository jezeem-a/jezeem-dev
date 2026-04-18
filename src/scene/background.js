import * as THREE from 'three'

const CODE_SNIPPETS = [
  'const', '</>', '=>', 'git commit', 'npm run dev', 'flutter pub get',
  ':wq', 'sudo', 'yarn build', 'import', 'export default', 'async/await',
  'useEffect', 'setState', '.map()', 'null'
]

let particles, particleVelocities
let codeSprites = []
let tetrisBlocks = []
let scene

// ─── Particle Field ───────────────────────────────────────────────────────────

function createParticles(s) {
  const count = 800
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  particleVelocities = []

  for (let i = 0; i < count; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 20
    positions[i * 3 + 1] = (Math.random() - 0.5) * 12
    positions[i * 3 + 2] = (Math.random() - 0.5) * 5

    particleVelocities.push({
      y: -(0.002 + Math.random() * 0.004),
      x: (Math.random() - 0.5) * 0.001
    })
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const material = new THREE.PointsMaterial({
    color: 0x33ff33,
    size: 0.04,
    transparent: true,
    opacity: 0.3,
    sizeAttenuation: true
  })

  particles = new THREE.Points(geometry, material)
  s.add(particles)
}

function tickParticles() {
  const pos = particles.geometry.attributes.position.array
  const yBound = 6.5

  for (let i = 0; i < pos.length / 3; i++) {
    pos[i * 3]     += particleVelocities[i].x
    pos[i * 3 + 1] += particleVelocities[i].y

    if (pos[i * 3 + 1] < -yBound) {
      pos[i * 3 + 1] = yBound
      pos[i * 3]     = (Math.random() - 0.5) * 20
    }
  }

  particles.geometry.attributes.position.needsUpdate = true
}

// ─── Floating Code Sprites ────────────────────────────────────────────────────

function makeCodeTexture(text) {
  const size = Math.floor(12 + Math.random() * 9)
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 64
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = 'rgba(0,0,0,0)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#444444'
  ctx.font = `${size * 2}px VT323, monospace`
  ctx.fillText(text, 4, size * 2)
  return new THREE.CanvasTexture(canvas)
}

function createCodeSprites(s) {
  for (let i = 0; i < 20; i++) {
    const text = CODE_SNIPPETS[i % CODE_SNIPPETS.length]
    const texture = makeCodeTexture(text)
    const mat = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.6 })
    const sprite = new THREE.Sprite(mat)

    const scale = 0.8 + Math.random() * 1.2
    sprite.scale.set(scale * 2, scale * 0.5, 1)
    sprite.position.set(
      (Math.random() - 0.5) * 22,
      (Math.random() - 0.5) * 13,
      -1
    )

    sprite.userData.vel = {
      x: (Math.random() - 0.5) * 0.004,
      y: (Math.random() - 0.5) * 0.003
    }

    codeSprites.push(sprite)
    s.add(sprite)
  }
}

function tickCodeSprites() {
  const xBound = 12, yBound = 7

  for (const sprite of codeSprites) {
    sprite.position.x += sprite.userData.vel.x
    sprite.position.y += sprite.userData.vel.y

    if (sprite.position.x > xBound)  sprite.position.x = -xBound
    if (sprite.position.x < -xBound) sprite.position.x = xBound
    if (sprite.position.y > yBound)  sprite.position.y = -yBound
    if (sprite.position.y < -yBound) sprite.position.y = yBound
  }
}

// ─── Tetris Blocks ────────────────────────────────────────────────────────────

const SHAPES = [
  // L
  [[0,0],[1,0],[2,0],[2,1]],
  // J
  [[0,0],[1,0],[2,0],[0,1]],
  // T
  [[0,0],[1,0],[2,0],[1,1]],
  // S
  [[1,0],[2,0],[0,1],[1,1]],
  // Z
  [[0,0],[1,0],[1,1],[2,1]],
  // O
  [[0,0],[1,0],[0,1],[1,1]],
  // I
  [[0,0],[1,0],[2,0],[3,0]],
  // Dot pair
  [[0,0],[0,1]]
]

function createTetrisBlocks(s) {
  for (let i = 0; i < 8; i++) {
    const shape = SHAPES[i % SHAPES.length]
    const group = new THREE.Group()
    const color = Math.random() > 0.5 ? 0x1a1a1a : 0x2a2a2a

    for (const [cx, cy] of shape) {
      const geo = new THREE.BoxGeometry(0.3, 0.3, 0.1)
      const mat = new THREE.MeshBasicMaterial({ color, wireframe: true })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(cx * 0.32, cy * 0.32, 0)
      group.add(mesh)
    }

    group.position.set(
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 13,
      -2
    )

    const speed = 0.002 + Math.random() * 0.003
    const rotSpeed = (Math.random() - 0.5) * 0.003
    group.userData.vel = { y: -speed, rot: rotSpeed }

    tetrisBlocks.push(group)
    s.add(group)
  }
}

function tickTetrisBlocks() {
  const yBound = 7.5

  for (const block of tetrisBlocks) {
    block.position.y += block.userData.vel.y
    block.rotation.z += block.userData.vel.rot

    if (block.position.y < -yBound) {
      block.position.y = yBound + Math.random() * 2
      block.position.x = (Math.random() - 0.5) * 20
    }
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function initBackground(s) {
  scene = s
  createParticles(scene)
  createCodeSprites(scene)
  createTetrisBlocks(scene)
}

export function tick() {
  if (!scene) return
  tickParticles()
  tickCodeSprites()
  tickTetrisBlocks()
}
