import gsap from 'gsap'

const APPS = [
  { id: 'about',      label: 'About',      icon: '\u25c8' },
  { id: 'projects',   label: 'Projects',   icon: '\u2b21' },
  { id: 'experience', label: 'Experience', icon: '\u29c9' },
  { id: 'skills',     label: 'Skills',     icon: '\u27e1' },
  { id: 'contact',    label: 'Contact',    icon: '\u25c9' },
  { id: 'terminal',   label: 'Terminal',   icon: '>_' },
  { id: 'glitch',     label: 'Glitch',     icon: '\u26a1' },
]

const SEPARATOR = true

export function initDock() {
  const style = document.createElement('style')
  style.textContent = `
    #os-dock {
      position: fixed;
      bottom: 10px;
      left: 50%;
      transform: translateX(-50%);
      height: 68px;
      background: rgba(18,18,18,0.88);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid #252525;
      border-radius: 16px;
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 0 14px;
      z-index: 8000;
      box-shadow: 0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03);
    }
    .dock-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      cursor: pointer;
      border-radius: 10px;
      background: #1a1a1a;
      border: 1px solid #252525;
      position: relative;
      flex-shrink: 0;
      transform-origin: bottom center;
    }
    .dock-icon {
      font-family: 'VT323', monospace;
      font-size: 22px;
      color: #33ff33;
      line-height: 1;
      text-shadow: 0 0 6px rgba(51,255,51,0.3);
      pointer-events: none;
    }
    .dock-tooltip {
      position: absolute;
      bottom: 58px;
      left: 50%;
      transform: translateX(-50%);
      font-family: 'VT323', monospace;
      font-size: 12px;
      color: #888;
      background: #111;
      border: 1px solid #2a2a2a;
      padding: 2px 8px;
      border-radius: 3px;
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.15s;
    }
    .dock-item:hover .dock-tooltip {
      opacity: 1;
    }
    .dock-running-dot {
      position: absolute;
      bottom: -6px;
      left: 50%;
      transform: translateX(-50%);
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: #33ff33;
      box-shadow: 0 0 4px #33ff33;
      display: none;
    }
    .dock-sep {
      width: 1px;
      height: 32px;
      background: #2a2a2a;
      margin: 0 4px;
      flex-shrink: 0;
    }
  `
  document.head.appendChild(style)

  const dock = document.createElement('div')
  dock.id = 'os-dock'

  const items = APPS.map((app, i) => {
    if (i === 5) {
      // separator before terminal
      const sep = document.createElement('div')
      sep.className = 'dock-sep'
      dock.appendChild(sep)
    }

    const item = document.createElement('div')
    item.className = 'dock-item'
    item.dataset.appId = app.id
    item.innerHTML = `
      <span class="dock-icon">${app.icon}</span>
      <span class="dock-tooltip">${app.label}</span>
      <span class="dock-running-dot"></span>
    `

    item.addEventListener('click', () => {
      document.dispatchEvent(new CustomEvent('open-app', { detail: app.id }))
      gsap.to(item, {
        y: -12,
        duration: 0.12,
        ease: 'power2.out',
        yoyo: true,
        repeat: 1
      })
    })

    dock.appendChild(item)
    return { el: item, id: app.id }
  })

  // Magnification
  dock.addEventListener('mousemove', e => {
    items.forEach(({ el }) => {
      const rect = el.getBoundingClientRect()
      const center = rect.left + rect.width / 2
      const dist = Math.abs(e.clientX - center)
      const maxDist = 90
      const scale = dist < maxDist ? 1 + (1 - dist / maxDist) * 0.45 : 1
      const liftY = dist < maxDist ? -(1 - dist / maxDist) * 10 : 0
      gsap.to(el, { scale, y: liftY, duration: 0.12, ease: 'power2.out' })
    })
  })

  dock.addEventListener('mouseleave', () => {
    items.forEach(({ el }) => gsap.to(el, { scale: 1, y: 0, duration: 0.2, ease: 'power2.out' }))
  })

  document.body.appendChild(dock)

  // Running indicators
  document.addEventListener('window-opened', e => {
    const dot = dock.querySelector(`[data-app-id="${e.detail}"] .dock-running-dot`)
    if (dot) dot.style.display = 'block'
  })

  document.addEventListener('window-closed', e => {
    const item = dock.querySelector(`[data-app-id="${e.detail.id}"]`)
    if (item) item.querySelector('.dock-running-dot').style.display = 'none'
  })
}
