import gsap from 'gsap'

let zTop = 100
const windows = new Map()

export function createWindow({ id, title, width = 560, height = 400, x, y, content }) {
  if (windows.has(id)) {
    const existing = windows.get(id)
    if (existing.style.display === 'none') {
      existing.style.display = 'flex'
      gsap.fromTo(existing, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.2, ease: 'power2.out' })
    }
    focusWindow(id)
    return existing
  }

  const startX = x ?? (window.innerWidth / 2 - width / 2 + (Math.random() * 60 - 30))
  const startY = y ?? (window.innerHeight / 2 - height / 2 + (Math.random() * 40 - 20))

  const win = document.createElement('div')
  win.id = `win-${id}`
  win.className = 'os-window'
  win.style.cssText = `
    position: fixed;
    left: ${startX}px;
    top: ${startY}px;
    width: ${width}px;
    height: ${height}px;
    background: #111;
    border: 1px solid #2a2a2a;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    z-index: ${++zTop};
    box-shadow: 0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04);
    min-width: 300px;
    min-height: 200px;
  `

  win.innerHTML = `
    <div class="win-header" style="
      height: 32px;
      background: #1a1a1a;
      display: flex;
      align-items: center;
      padding: 0 12px;
      gap: 8px;
      flex-shrink: 0;
      cursor: default;
      user-select: none;
      border-bottom: 1px solid #222;
      position: relative;
    ">
      <div class="win-traffic-lights" style="display:flex;gap:6px;align-items:center;">
        <div class="win-btn win-close" style="width:12px;height:12px;border-radius:50%;background:#444;cursor:pointer;transition:background 0.15s;"></div>
        <div class="win-btn win-minimize" style="width:12px;height:12px;border-radius:50%;background:#444;cursor:pointer;transition:background 0.15s;"></div>
        <div class="win-btn win-maximize" style="width:12px;height:12px;border-radius:50%;background:#444;cursor:pointer;transition:background 0.15s;"></div>
      </div>
      <span class="win-title" style="
        position:absolute;left:50%;transform:translateX(-50%);
        font-family:'VT323',monospace;font-size:14px;
        color:#666;pointer-events:none;white-space:nowrap;
      ">${title}</span>
    </div>
    <div class="win-body" style="flex:1;overflow:auto;position:relative;"></div>
    <div class="win-resize-handle" style="
      position:absolute;right:0;bottom:0;
      width:16px;height:16px;cursor:se-resize;
      background:linear-gradient(135deg,transparent 50%,#2a2a2a 50%);
      z-index:10;
    "></div>
  `

  const body = win.querySelector('.win-body')
  if (typeof content === 'string') {
    body.innerHTML = content
  } else if (content instanceof HTMLElement) {
    body.appendChild(content)
  }

  document.getElementById('main-content').appendChild(win)
  windows.set(id, win)

  wireHeader(win, id)
  wireResize(win)
  wireTrafficLights(win, id)
  wireHoverColors(win)

  gsap.fromTo(win,
    { scale: 0.92, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.22, ease: 'power2.out' }
  )

  win.addEventListener('mousedown', () => focusWindow(id))
  document.dispatchEvent(new CustomEvent('window-focused', { detail: { title } }))

  return win
}

export function focusWindow(id) {
  const win = windows.get(id)
  if (!win) return
  win.style.zIndex = ++zTop
  const title = win.querySelector('.win-title')?.textContent ?? ''
  document.dispatchEvent(new CustomEvent('window-focused', { detail: { title } }))
}

export function closeWindow(id) {
  const win = windows.get(id)
  if (!win) return
  gsap.to(win, {
    scale: 0.88,
    opacity: 0,
    duration: 0.18,
    ease: 'power2.in',
    onComplete() {
      win.remove()
      windows.delete(id)
      document.dispatchEvent(new CustomEvent('window-closed', { detail: { id } }))
    }
  })
}

export function minimizeWindow(id) {
  const win = windows.get(id)
  if (!win) return
  const dockEl = document.getElementById('os-dock')
  const rect = dockEl
    ? dockEl.getBoundingClientRect()
    : { left: window.innerWidth / 2, top: window.innerHeight - 68 }
  const winLeft = parseFloat(win.style.left)
  const winTop = parseFloat(win.style.top)
  gsap.to(win, {
    x: rect.left + rect.width / 2 - winLeft,
    y: rect.top - winTop,
    scale: 0.08,
    opacity: 0,
    duration: 0.28,
    ease: 'power2.in',
    onComplete() {
      win.style.display = 'none'
      gsap.set(win, { x: 0, y: 0, scale: 1, opacity: 1 })
    }
  })
}

export function isWindowOpen(id) {
  return windows.has(id)
}

// ── Drag ──────────────────────────────────────────────────────────────────────

function wireHeader(win, id) {
  const header = win.querySelector('.win-header')
  let dragging = false, ox = 0, oy = 0

  header.addEventListener('mousedown', e => {
    if (e.target.classList.contains('win-btn')) return
    dragging = true
    ox = e.clientX - win.offsetLeft
    oy = e.clientY - win.offsetTop
    focusWindow(id)
    e.preventDefault()
  })

  const onMove = e => {
    if (!dragging) return
    win.style.left = Math.max(0, e.clientX - ox) + 'px'
    win.style.top = Math.max(32, e.clientY - oy) + 'px'
  }
  const onUp = () => { dragging = false }
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}

// ── Resize ─────────────────────────────────────────────────────────────────────

function wireResize(win) {
  const handle = win.querySelector('.win-resize-handle')
  let resizing = false, startW = 0, startH = 0, startX = 0, startY = 0

  handle.addEventListener('mousedown', e => {
    resizing = true
    startW = win.offsetWidth
    startH = win.offsetHeight
    startX = e.clientX
    startY = e.clientY
    e.preventDefault()
    e.stopPropagation()
  })

  document.addEventListener('mousemove', e => {
    if (!resizing) return
    win.style.width = Math.max(300, startW + e.clientX - startX) + 'px'
    win.style.height = Math.max(200, startH + e.clientY - startY) + 'px'
  })

  document.addEventListener('mouseup', () => { resizing = false })
}

// ── Traffic lights ─────────────────────────────────────────────────────────────

function wireTrafficLights(win, id) {
  win.querySelector('.win-close').addEventListener('click', e => {
    e.stopPropagation()
    closeWindow(id)
  })
  win.querySelector('.win-minimize').addEventListener('click', e => {
    e.stopPropagation()
    minimizeWindow(id)
  })
  win.querySelector('.win-maximize').addEventListener('click', e => {
    e.stopPropagation()
    const isMax = win.dataset.maximized === '1'
    if (isMax) {
      win.dataset.maximized = '0'
      const prev = JSON.parse(win.dataset.prevGeom || '{}')
      Object.assign(win.style, prev)
    } else {
      win.dataset.maximized = '1'
      win.dataset.prevGeom = JSON.stringify({
        left: win.style.left,
        top: win.style.top,
        width: win.style.width,
        height: win.style.height,
      })
      win.style.left = '0'
      win.style.top = '32px'
      win.style.width = window.innerWidth + 'px'
      win.style.height = (window.innerHeight - 32 - 80) + 'px'
    }
  })
}

// ── Hover colors ──────────────────────────────────────────────────────────────

function wireHoverColors(win) {
  const header = win.querySelector('.win-header')
  header.addEventListener('mouseenter', () => {
    win.querySelector('.win-close').style.background = '#ff5f57'
    win.querySelector('.win-minimize').style.background = '#febc2e'
    win.querySelector('.win-maximize').style.background = '#28c840'
  })
  header.addEventListener('mouseleave', () => {
    win.querySelectorAll('.win-btn').forEach(b => { b.style.background = '#444' })
  })
}
