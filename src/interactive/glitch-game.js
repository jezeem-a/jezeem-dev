import gsap from 'gsap'

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

// Center zone exclusion (approximate, updated on resize)
let centerZone = { x: 0, y: 0, w: 0, h: 0 }

let activeSquares = 0
let score = 0
let scoreEl = null
let factPool = []
let spawnTimer = null

export function initGlitchGame() {
  document.addEventListener('intro-complete', start)
}

function start() {
  buildScoreEl()
  updateCenterZone()
  window.addEventListener('resize', updateCenterZone)
  scheduleNextSpawn()
}

function updateCenterZone() {
  const vw = window.innerWidth
  const vh = window.innerHeight
  // Identity zone is centered; reserve a 320×80 safe area around it
  centerZone = {
    x: vw / 2 - 160,
    y: vh / 2 - 40,
    w: 320,
    h: 80,
  }
}

function buildScoreEl() {
  scoreEl = document.createElement('div')
  scoreEl.id = 'glitch-score'
  scoreEl.style.cssText = `
    position: fixed;
    top: 16px;
    right: 20px;
    z-index: 30;
    font-family: 'VT323', monospace;
    font-size: 16px;
    color: #33ff33;
    text-shadow: 0 0 6px rgba(51,255,51,0.5);
    opacity: 0;
    pointer-events: none;
  `
  scoreEl.textContent = 'GLITCHES CAUGHT: 0'
  document.getElementById('main-content').appendChild(scoreEl)
}

function scheduleNextSpawn() {
  const delay = (3 + Math.random() * 2) * 1000
  spawnTimer = setTimeout(() => {
    if (activeSquares < 3) spawnSquare()
    scheduleNextSpawn()
  }, delay)
}

function randomPos(size) {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const pad = 40
  let x, y, attempts = 0

  do {
    x = pad + Math.random() * (vw - size - pad * 2)
    y = pad + Math.random() * (vh - size - pad * 2)
    attempts++
  } while (
    attempts < 20 &&
    x < centerZone.x + centerZone.w &&
    x + size > centerZone.x &&
    y < centerZone.y + centerZone.h &&
    y + size > centerZone.y
  )

  return { x, y }
}

function spawnSquare() {
  const size = 20 + Math.random() * 20
  const { x, y } = randomPos(size)
  const lifetime = (1.5 + Math.random()) * 1000

  const sq = document.createElement('div')
  sq.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    width: ${size}px;
    height: ${size}px;
    background: #33ff33;
    z-index: 25;
    cursor: crosshair;
    pointer-events: all;
  `
  document.getElementById('main-content').appendChild(sq)
  activeSquares++

  // Rapid color flicker
  let flickerFrame
  const colors = GLITCH_COLORS
  let ci = 0
  function flicker() {
    ci = (ci + 1) % colors.length
    sq.style.background = colors[ci]
    sq.style.boxShadow = `0 0 8px ${colors[ci]}`
    flickerFrame = setTimeout(flicker, 80 + Math.random() * 80)
  }
  flicker()

  // Auto-despawn if not clicked
  const despawnTimer = setTimeout(() => despawn(sq, flickerFrame), lifetime)

  sq.addEventListener('click', (e) => {
    e.stopPropagation()
    clearTimeout(despawnTimer)
    onCatch(sq, flickerFrame, x + size / 2, y + size / 2)
  })
}

function despawn(sq, flickerFrame) {
  clearTimeout(flickerFrame)
  gsap.to(sq, {
    opacity: 0, scale: 0,
    duration: 0.2,
    ease: 'power2.in',
    onComplete() { sq.remove(); activeSquares-- }
  })
}

function onCatch(sq, flickerFrame, cx, cy) {
  clearTimeout(flickerFrame)
  activeSquares--

  // Particle burst
  for (let i = 0; i < 8; i++) {
    const p = document.createElement('div')
    const angle = (i / 8) * Math.PI * 2
    const dist = 30 + Math.random() * 40
    p.style.cssText = `
      position: fixed;
      left: ${cx}px;
      top: ${cy}px;
      width: 4px;
      height: 4px;
      background: ${GLITCH_COLORS[Math.floor(Math.random() * GLITCH_COLORS.length)]};
      z-index: 26;
      border-radius: 50%;
      pointer-events: none;
    `
    document.getElementById('main-content').appendChild(p)
    gsap.to(p, {
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      opacity: 0,
      duration: 0.5 + Math.random() * 0.3,
      ease: 'power2.out',
      onComplete() { p.remove() }
    })
  }

  sq.remove()

  // Score
  score++
  scoreEl.textContent = `GLITCHES CAUGHT: ${score}`
  if (score === 1) gsap.to(scoreEl, { opacity: 1, duration: 0.4 })

  // Fun fact popup
  showFact(cx, cy)
}

function showFact(x, y) {
  if (factPool.length === 0) factPool = [...FUN_FACTS].sort(() => Math.random() - 0.5)
  const fact = factPool.pop()

  const popup = document.createElement('div')
  popup.style.cssText = `
    position: fixed;
    left: ${Math.min(x, window.innerWidth - 220)}px;
    top: ${Math.max(y - 50, 10)}px;
    z-index: 30;
    background: #0d0d0d;
    border: 1px solid #33ff33;
    box-shadow: 0 0 12px rgba(51,255,51,0.2);
    padding: 6px 12px;
    font-family: 'VT323', monospace;
    font-size: 15px;
    color: #e0e0e0;
    max-width: 210px;
    pointer-events: none;
    opacity: 0;
  `
  popup.textContent = `> ${fact}`
  document.getElementById('main-content').appendChild(popup)

  gsap.timeline()
    .to(popup, { opacity: 1, duration: 0.2 })
    .to(popup, { opacity: 0, duration: 0.4, delay: 2.1, onComplete() { popup.remove() } })
}
