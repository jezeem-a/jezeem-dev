import gsap from 'gsap'
import { createWindow } from '../os/window-manager.js'

const FUN_FACTS = [
  'built first app in 2021',
  'flutter dev since day one',
  'ships side projects for fun',
  'terminal > GUI. always.',
  'once fixed a bug at 3am. worth it.',
  "git commit -m 'it works, don't touch it'",
  'prefers dark mode. obviously.',
  'currently: available for work',
]

const GLITCH_COLORS = ['#33ff33', '#ffffff', '#ff0000']

let activeSquares = 0
let score = 0
let scoreEl = null
let factPool = []
let spawnTimer = null
let gameRunning = false

export function openGlitchGame() {
  document.dispatchEvent(new CustomEvent('window-opened', { detail: 'glitch' }))

  const content = document.createElement('div')
  content.style.cssText = `
    padding: 20px 24px;
    font-family: 'VT323', monospace;
    color: #e0e0e0;
    font-size: 15px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  `
  content.innerHTML = `
    <div style="color:#33ff33;font-size:20px;">&gt; glitch_hunt.exe</div>
    <div style="color:#2a2a2a;">────────────────────────────────────────</div>
    <div style="color:#888;font-size:14px;line-height:1.6;">
      Glitch squares appear on your desktop.<br>
      Click them before they vanish.
    </div>
    <div id="glitch-score-display" style="
      font-size:18px;color:#33ff33;
      text-shadow:0 0 6px rgba(51,255,51,0.5);
    ">GLITCHES CAUGHT: ${score}</div>
    <div style="display:flex;gap:10px;margin-top:4px;">
      <button id="glitch-start-btn" style="
        font-family:'VT323',monospace;font-size:16px;
        background:#1a1a1a;border:1px solid #33ff33;
        color:#33ff33;padding:6px 16px;border-radius:3px;
        cursor:pointer;text-shadow:0 0 4px rgba(51,255,51,0.4);
      ">[ start hunt ]</button>
      <button id="glitch-stop-btn" style="
        font-family:'VT323',monospace;font-size:16px;
        background:#1a1a1a;border:1px solid #444;
        color:#555;padding:6px 16px;border-radius:3px;
        cursor:pointer;
      " disabled>[ stop ]</button>
    </div>
    <div id="glitch-status" style="color:#555;font-size:13px;"></div>
  `

  createWindow({ id: 'glitch', title: 'glitch_hunt.exe', width: 360, height: 320, x: 280, y: 100, content })

  const startBtn = content.querySelector('#glitch-start-btn')
  const stopBtn = content.querySelector('#glitch-stop-btn')
  const statusEl = content.querySelector('#glitch-status')

  startBtn.addEventListener('click', () => {
    if (gameRunning) return
    gameRunning = true
    activeSquares = 0
    startBtn.disabled = true
    startBtn.style.color = '#555'
    startBtn.style.borderColor = '#333'
    stopBtn.disabled = false
    stopBtn.style.color = '#ff5555'
    stopBtn.style.borderColor = '#ff5555'
    statusEl.textContent = 'hunting glitches...'
    scheduleNextSpawn()
  })

  stopBtn.addEventListener('click', () => {
    stopGame()
    statusEl.textContent = `hunt ended. score: ${score}`
    startBtn.disabled = false
    startBtn.style.color = '#33ff33'
    startBtn.style.borderColor = '#33ff33'
    stopBtn.disabled = true
    stopBtn.style.color = '#555'
    stopBtn.style.borderColor = '#444'
  })

  // Stop game when window closes
  document.addEventListener('window-closed', e => {
    if (e.detail.id === 'glitch') stopGame()
  }, { once: true })
}

function stopGame() {
  gameRunning = false
  clearTimeout(spawnTimer)
  spawnTimer = null
  document.querySelectorAll('.glitch-square').forEach(sq => sq.remove())
  activeSquares = 0
}

function scheduleNextSpawn() {
  if (!gameRunning) return
  const delay = (2 + Math.random() * 2.5) * 1000
  spawnTimer = setTimeout(() => {
    if (gameRunning && activeSquares < 3) spawnSquare()
    scheduleNextSpawn()
  }, delay)
}

function spawnSquare() {
  const size = 18 + Math.random() * 18
  const pad = 80
  const x = pad + Math.random() * (window.innerWidth - size - pad * 2)
  const y = 80 + Math.random() * (window.innerHeight - size - 180)
  const lifetime = (1.2 + Math.random()) * 1000

  const sq = document.createElement('div')
  sq.className = 'glitch-square'
  sq.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    width: ${size}px;
    height: ${size}px;
    background: #33ff33;
    z-index: 7000;
    cursor: crosshair;
    pointer-events: all;
  `
  document.getElementById('main-content').appendChild(sq)
  activeSquares++

  let ci = 0
  let flickerTimer
  function flicker() {
    ci = (ci + 1) % GLITCH_COLORS.length
    sq.style.background = GLITCH_COLORS[ci]
    sq.style.boxShadow = `0 0 8px ${GLITCH_COLORS[ci]}`
    flickerTimer = setTimeout(flicker, 70 + Math.random() * 80)
  }
  flicker()

  const despawnTimer = setTimeout(() => despawn(sq, flickerTimer), lifetime)

  sq.addEventListener('click', e => {
    e.stopPropagation()
    clearTimeout(despawnTimer)
    onCatch(sq, flickerTimer, x + size / 2, y + size / 2)
  })
}

function despawn(sq, flickerTimer) {
  clearTimeout(flickerTimer)
  gsap.to(sq, {
    opacity: 0, scale: 0,
    duration: 0.18,
    ease: 'power2.in',
    onComplete() { sq.remove(); activeSquares-- }
  })
}

function onCatch(sq, flickerTimer, cx, cy) {
  clearTimeout(flickerTimer)
  activeSquares--

  // Particle burst
  for (let i = 0; i < 8; i++) {
    const p = document.createElement('div')
    const angle = (i / 8) * Math.PI * 2
    const dist = 28 + Math.random() * 36
    p.style.cssText = `
      position: fixed;
      left: ${cx}px;
      top: ${cy}px;
      width: 4px;
      height: 4px;
      background: ${GLITCH_COLORS[Math.floor(Math.random() * 3)]};
      z-index: 7001;
      border-radius: 50%;
      pointer-events: none;
    `
    document.getElementById('main-content').appendChild(p)
    gsap.to(p, {
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      opacity: 0,
      duration: 0.45 + Math.random() * 0.25,
      ease: 'power2.out',
      onComplete() { p.remove() }
    })
  }

  sq.remove()
  score++

  const scoreDisplay = document.getElementById('glitch-score-display')
  if (scoreDisplay) scoreDisplay.textContent = `GLITCHES CAUGHT: ${score}`

  showFact(cx, cy)
}

function showFact(x, y) {
  if (factPool.length === 0) factPool = [...FUN_FACTS].sort(() => Math.random() - 0.5)
  const fact = factPool.pop()

  const popup = document.createElement('div')
  popup.style.cssText = `
    position: fixed;
    left: ${Math.min(x, window.innerWidth - 230)}px;
    top: ${Math.max(y - 50, 50)}px;
    z-index: 7002;
    background: #0d0d0d;
    border: 1px solid #33ff33;
    box-shadow: 0 0 12px rgba(51,255,51,0.2);
    padding: 6px 12px;
    font-family: 'VT323', monospace;
    font-size: 15px;
    color: #e0e0e0;
    max-width: 220px;
    pointer-events: none;
    opacity: 0;
  `
  popup.textContent = `> ${fact}`
  document.getElementById('main-content').appendChild(popup)

  gsap.timeline()
    .to(popup, { opacity: 1, duration: 0.2 })
    .to(popup, { opacity: 0, duration: 0.4, delay: 2.2, onComplete() { popup.remove() } })
}
