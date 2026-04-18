import './style.css'
import * as THREE from 'three'
import { initBackground, tick } from './scene/background.js'
import { initMac } from './intro/mac.js'
import { initIdentity } from './zones/identity.js'
import { initExperience } from './zones/experience.js'
import { initSkills } from './zones/skills.js'
import { initSocials } from './zones/socials.js'
import { initWildcard } from './zones/wildcard.js'
import { initTerminal } from './interactive/terminal.js'

// Three.js renderer attached to #bg-canvas
const canvas = document.getElementById('bg-canvas')
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false })
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor(0x0a0a0a)

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 5

initBackground(scene)
initMac()
initIdentity()
initExperience()
initSkills()
initSocials()
initWildcard()
initTerminal()

// Corner blink cursor
const cornerCursor = document.createElement('div')
cornerCursor.id = 'corner-cursor'
cornerCursor.textContent = '█'
document.body.appendChild(cornerCursor)

// Resize handler
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
})

// Animation loop
function animate() {
  requestAnimationFrame(animate)
  tick()
  renderer.render(scene, camera)
}

animate()
