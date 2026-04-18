import './style.css'
import { inject } from '@vercel/analytics'
import { injectSpeedInsights } from '@vercel/speed-insights'
inject()
injectSpeedInsights()
import * as THREE from 'three'
import { initBackground, tick } from './scene/background.js'
import { initMac } from './intro/mac.js'
import { initIdentity } from './zones/identity.js'
import { initExperience } from './zones/experience.js'
import { initSkills } from './zones/skills.js'
import { initSocials } from './zones/socials.js'
import { initWildcard } from './zones/wildcard.js'
import { initTerminal } from './interactive/terminal.js'
import { initGlitchGame } from './interactive/glitch-game.js'
import { initKonami } from './interactive/konami.js'
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
initIdentity()
initExperience()
initSkills()
initSocials()
initWildcard()
initTerminal()
initGlitchGame()
initCursor()
initKonami()

// Corner blink cursor
const cornerCursor = document.createElement('div')
cornerCursor.id = 'corner-cursor'
cornerCursor.textContent = '█'
document.body.appendChild(cornerCursor)

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
  
  // Subtle Konami hint after intro
  const hint = document.createElement('div')
  hint.textContent = '↑↑↓↓←→←→ba'
  hint.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    font-family: 'VT323', monospace;
    font-size: 12px;
    color: #33ff33;
    opacity: 0;
    transition: opacity 0.5s;
    cursor: default;
    user-select: none;
  `
  hint.title = "try the Konami Code"
  document.body.appendChild(hint)
  
  setTimeout(() => hint.style.opacity = '0.3', 2500)
  setTimeout(() => {
    hint.style.opacity = '0'
    setTimeout(() => hint.remove(), 500)
  }, 7000)
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
