import './style.css'
import { inject } from '@vercel/analytics'
import { injectSpeedInsights } from '@vercel/speed-insights'
inject()
injectSpeedInsights()
import * as THREE from 'three'
import { initBackground, tick } from './scene/background.js'
import { initMac } from './intro/mac.js'
import { initOS } from './os/desktop.js'
import { initKonami } from './interactive/konami.js'
import { initLibraryCard } from './interactive/library-card.js'
import { initCursor } from './utils/cursor.js'
import { createCRTComposer } from './scene/crt-shader.js'
import gsap from 'gsap'

// Three.js renderer attached to #bg-canvas
const canvas = document.getElementById('bg-canvas')
canvas.style.opacity = '0'
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false })
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor(0x0a0a0a)

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 5

// CRT post-processing
const crt = createCRTComposer(renderer, scene, camera)

initBackground(scene)
initMac()
initCursor()
initKonami()
initLibraryCard()

// Resize handler
window.addEventListener('resize', () => {
  const w = window.innerWidth, h = window.innerHeight
  renderer.setSize(w, h)
  crt.setSize(w, h)
  camera.aspect = w / h
  camera.updateProjectionMatrix()
})

document.addEventListener('intro-complete', () => {
  gsap.to(canvas, { opacity: 1, duration: 1, ease: 'power2.out' })
  initOS()
})

// Animation loop
let clock = 0
function animate() {
  requestAnimationFrame(animate)
  clock += 0.016
  tick()
  crt.render(clock)
}

animate()
